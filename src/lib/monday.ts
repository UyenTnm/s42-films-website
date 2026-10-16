import type { Profile } from "@/lib/siteAccess";

// Saves verified visitors as items on a monday.com board.
//
// Setup: create a board with these columns (names are matched by title, so no
// column IDs are needed):
//   Email (Email column) | First name (Text) | Last name (Text) | Company (Text)
// The item name is set to "First Last".

const MONDAY_API = "https://api.monday.com/v2";

interface Column {
  id: string;
  title: string;
  type: string;
}

interface GraphQlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

let columnCache: { boardId: string; columns: Column[]; at: number } | null =
  null;
const COLUMN_CACHE_MS = 10 * 60 * 1000;

function getConfig() {
  const token = process.env.MONDAY_API_TOKEN?.trim();
  const boardId = process.env.MONDAY_BOARD_ID?.trim();
  return token && boardId ? { token, boardId } : null;
}

async function mondayRequest<T>(
  token: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(MONDAY_API, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`monday.com responded with ${response.status}`);
  }

  const result = (await response.json()) as GraphQlResponse<T>;
  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join("; "));
  }
  if (!result.data) throw new Error("monday.com returned no data");

  return result.data;
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

function findColumn(columns: Column[], titles: string[], type?: string) {
  return columns.find(
    (column) =>
      titles.includes(column.title.trim().toLowerCase()) &&
      (!type || column.type === type),
  );
}

/**
 * Creates the visitor on the board, or updates the existing item when the
 * same email is already there. Never throws: a failure must not affect login.
 */
export async function saveContactToMonday(profile: Profile) {
  const config = getConfig();
  if (!config) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[s42 access] monday.com is not configured; skipping contact save.",
      );
    }
    return;
  }

  const { token, boardId } = config;

  try {
    const columns = await getColumns(token, boardId);

    const emailColumn = findColumn(columns, ["email", "e-mail"], "email");
    if (!emailColumn) {
      console.error(
        '[s42 access] monday.com board needs an "Email" column of type Email.',
      );
      return;
    }

    const values: Record<string, unknown> = {
      [emailColumn.id]: { email: profile.email, text: profile.email },
    };

    const textFields: Array<[string[], string]> = [
      [["first name", "firstname"], profile.firstName],
      [["last name", "lastname"], profile.lastName],
      [["company", "company name"], profile.company],
    ];
    for (const [titles, value] of textFields) {
      const column = findColumn(columns, titles, "text");
      if (column) values[column.id] = value;
    }

    // Same email twice: update the existing item instead of adding a row.
    let existingId: string | null = null;
    try {
      const found = await mondayRequest<{
        items_page_by_column_values: { items: Array<{ id: string }> };
      }>(
        token,
        `query ($board: ID!, $column: String!, $email: String!) {
          items_page_by_column_values(
            board_id: $board
            columns: [{ column_id: $column, column_values: [$email] }]
            limit: 1
          ) { items { id } }
        }`,
        { board: boardId, column: emailColumn.id, email: profile.email },
      );
      existingId = found.items_page_by_column_values.items[0]?.id ?? null;
    } catch (error) {
      // Better a possible duplicate row than a lost lead.
      console.warn("[s42 access] monday.com lookup failed", error);
    }

    if (existingId) {
      await mondayRequest(
        token,
        `mutation ($board: ID!, $item: ID!, $values: JSON!) {
          change_multiple_column_values(
            board_id: $board
            item_id: $item
            column_values: $values
          ) { id }
        }`,
        {
          board: boardId,
          item: existingId,
          values: JSON.stringify(values),
        },
      );
      return;
    }

    await mondayRequest(
      token,
      `mutation ($board: ID!, $name: String!, $values: JSON!) {
        create_item(
          board_id: $board
          item_name: $name
          column_values: $values
        ) { id }
      }`,
      {
        board: boardId,
        name: `${profile.firstName} ${profile.lastName}`.trim() || profile.email,
        values: JSON.stringify(values),
      },
    );
  } catch (error) {
    console.error("[s42 access] monday.com contact save failed", error);
  }
}
