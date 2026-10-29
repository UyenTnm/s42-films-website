import type { Application } from "@/lib/careers";

// Saves job applications as items on a SEPARATE monday.com board
// (MONDAY_CAREERS_BOARD_ID), so candidates never mix with private-access leads.
// It reuses MONDAY_API_TOKEN.
//
// Columns are matched by title (case-insensitive), so no column IDs are needed.
// A missing column is simply skipped. Columns used:
//   Email (Email) | Phone (Phone) | Location (Text) | Position (Status)
//   Experience (Text) | Strengths (Long text) | AI Tools (Long text)
//   English (Text) | Portfolio (Link) | CV (Link) | CV File (Files)
//   Best Project (Link) | On-site HCMC (Text) | Start Date (Date)
//   Salary Min (Numbers) | Salary Max (Numbers) | Notes (Long text)
// The item name is "Full name — Position".

const MONDAY_API = "https://api.monday.com/v2";
const MONDAY_FILE_API = "https://api.monday.com/v2/file";

export interface CvUpload {
  name: string;
  type: string;
  bytes: Uint8Array;
}

interface Column {
  id: string;
  title: string;
  type: string;
}

let columnCache: { boardId: string; columns: Column[]; at: number } | null =
  null;
const COLUMN_CACHE_MS = 10 * 60 * 1000;

function getConfig() {
  const token = process.env.MONDAY_API_TOKEN?.trim();
  const boardId = process.env.MONDAY_CAREERS_BOARD_ID?.trim();
  return token && boardId ? { token, boardId } : null;
}

export function isCareersBoardConfigured() {
  return getConfig() !== null;
}

async function readResult<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`monday.com responded with ${response.status}`);
  }
  const result = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };
  if (result.errors?.length) {
    throw new Error(result.errors.map((e) => e.message).join("; "));
  }
  if (!result.data) throw new Error("monday.com returned no data");
  return result.data;
}

async function mondayRequest<T>(
  token: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(MONDAY_API, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(8000),
  });
  return readResult<T>(response);
}

async function getColumns(token: string, boardId: string) {
  if (
    columnCache &&
    columnCache.boardId === boardId &&
    Date.now() - columnCache.at < COLUMN_CACHE_MS
  ) {
    return columnCache.columns;
  }
  const data = await mondayRequest<{ boards: Array<{ columns: Column[] }> }>(
    token,
    `query ($ids: [ID!]) { boards(ids: $ids) { columns { id title type } } }`,
    { ids: [boardId] },
  );
  const columns = data.boards?.[0]?.columns ?? [];
  columnCache = { boardId, columns, at: Date.now() };
  return columns;
}

/** Converts a plain value into the shape each monday column type expects. */
function toColumnValue(column: Column, value: string | number | string[]) {
  const list = Array.isArray(value) ? value : [String(value)];
  const flat = list.join(", ");

  switch (column.type) {
    case "email":
      return { email: flat, text: flat };
    case "phone":
      return { phone: flat.replace(/[^\d+]/g, ""), countryShortName: "VN" };
    case "link":
      return { url: flat, text: flat };
    case "date":
      return { date: flat };
    case "numbers":
      return String(value);
    case "long_text":
      return { text: flat };
    case "status":
      return { label: flat };
    case "dropdown":
      return { labels: list };
    case "text":
      return flat;
    default:
      return null; // Unsupported column type: skip it rather than fail.
  }
}

async function uploadCv(
  token: string,
  itemId: string,
  columnId: string,
  cv: CvUpload,
) {
  // Both ids come from monday's own responses; checked anyway before they
  // are placed in the query text.
  if (!/^\d+$/.test(itemId) || !/^[a-z0-9_]+$/i.test(columnId)) {
    throw new Error("Unexpected monday.com item or column id");
  }

  const body = new FormData();
  body.append(
    "query",
    `mutation ($file: File!) { add_file_to_column(item_id: ${itemId}, column_id: "${columnId}", file: $file) { id } }`,
  );
  body.append(
    "variables[file]",
    new Blob([cv.bytes as BlobPart], { type: cv.type }),
    cv.name,
  );

  const response = await fetch(MONDAY_FILE_API, {
    method: "POST",
    headers: { Authorization: token },
    body,
    signal: AbortSignal.timeout(20000),
  });
  await readResult(response);
}

/**
 * Creates one item per application (and attaches the CV file when there is
 * one). Returns true when the item was saved. Never throws.
 */
export async function saveApplicationToMonday(
  app: Application,
  cv: CvUpload | null,
) {
  const config = getConfig();
  if (!config) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[s42 careers] monday.com careers board not configured.");
    }
    return false;
  }

  const { token, boardId } = config;

  let itemId: string;
  let columns: Column[];
  try {
    columns = await getColumns(token, boardId);
    const byTitle = new Map(
      columns.map((c) => [c.title.trim().toLowerCase(), c] as const),
    );

    const fields: Array<[string[], string | number | string[]]> = [
      [["email", "e-mail"], app.email],
      [["phone", "phone number"], app.phone],
      [["location", "current location"], app.location],
      [["position", "role"], app.position],
      [["experience"], app.experience],
      [["strengths", "creative strengths"], app.strengths],
      [["ai tools", "tools"], app.tools],
      [["english", "english proficiency"], app.english],
      [["portfolio", "portfolio / showreel", "showreel"], app.portfolioUrl],
      [["cv", "resume", "cv / resume"], app.cvUrl],
      [["best project", "best ai project"], app.bestProjectUrl],
      [["on-site hcmc", "on-site", "onsite"], app.onSite === "yes" ? "Yes" : "No"],
      [["start date", "available from"], app.startDate],
      [["salary min", "salary minimum"], app.salaryMin],
      [["salary max", "salary maximum"], app.salaryMax],
      [["notes", "additional information"], app.notes],
    ];

    const values: Record<string, unknown> = {};
    for (const [titles, value] of fields) {
      if (value === "" || (Array.isArray(value) && !value.length)) continue;
      const column = titles.map((t) => byTitle.get(t)).find(Boolean);
      if (!column) continue;
      const formatted = toColumnValue(column, value);
      if (formatted !== null) values[column.id] = formatted;
    }

    const created = await mondayRequest<{ create_item: { id: string } }>(
      token,
      `mutation ($board: ID!, $name: String!, $values: JSON!) {
        create_item(
          board_id: $board
          item_name: $name
          column_values: $values
          create_labels_if_missing: true
        ) { id }
      }`,
      {
        board: boardId,
        name: `${app.fullName} — ${app.position}`,
        values: JSON.stringify(values),
      },
    );
    itemId = created.create_item.id;
  } catch (error) {
    console.error("[s42 careers] monday.com save failed", error, {
      // Enough to find the candidate if monday is down; no salary or phone.
      email: app.email,
      position: app.position,
    });
    return false;
  }

  if (cv) {
    const fileColumn = columns.find(
      (c) =>
        c.type === "file" &&
        ["cv file", "cv upload", "resume file", "files"].includes(
          c.title.trim().toLowerCase(),
        ),
    );
    if (!fileColumn) {
      console.error(
        '[s42 careers] monday.com board needs a "CV File" column of type Files.',
      );
    } else {
      try {
        await uploadCv(token, itemId, fileColumn.id, cv);
      } catch (error) {
        // The item is saved and the CV is attached to the team email anyway.
        console.error("[s42 careers] monday.com CV upload failed", error, {
          email: app.email,
        });
      }
    }
  }

  return true;
}
