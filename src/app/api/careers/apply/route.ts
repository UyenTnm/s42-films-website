import { after } from "next/server";
import {
  CV_MAX_BYTES,
  fileExtension,
  validateApplication,
} from "@/lib/careers";
import { getClientIp, isRateLimited } from "@/lib/siteAccess";
import { saveApplicationToMonday, type CvUpload } from "@/lib/mondayCareers";
import {
  sendApplicationConfirmation,
  sendApplicationNotification,
} from "@/lib/careersEmail";

// File (max 4 MB) + form fields, kept under Vercel's 4.5 MB request limit.
const MAX_REQUEST_BYTES = CV_MAX_BYTES + 300_000;
const MAX_DATA_CHARS = 20_000;

// The first bytes each allowed file type must start with. The extension alone
// is not trusted: a renamed .exe must not reach the team's inbox.
const SIGNATURES: Record<string, number[][]> = {
  pdf: [[0x25, 0x50, 0x44, 0x46]], // %PDF
  docx: [[0x50, 0x4b, 0x03, 0x04]], // ZIP container
  doc: [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]], // OLE2
};

const MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function matchesSignature(bytes: Uint8Array, ext: string) {
  return (SIGNATURES[ext] ?? []).some((sig) =>
    sig.every((byte, i) => bytes[i] === byte),
  );
}

/** "Nguyễn Văn A" → "CV - Nguyen Van A.pdf" (ASCII only, safe everywhere). */
function safeFileName(fullName: string, ext: string) {
  const ascii = fullName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, (c) => (c === "đ" ? "d" : "D"))
    .replace(/[^A-Za-z0-9 .-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  return `CV - ${ascii || "Candidate"}.${ext}`;
}

function fail(status: number, message: string, errors?: object) {
  return Response.json({ ok: false, message, ...(errors ? { errors } : {}) }, { status });
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_REQUEST_BYTES) {
    return fail(413, "Your CV file is too large. Please keep it under 4 MB.");
  }

  const ip = getClientIp(request);
  if (isRateLimited(`careers-ip:${ip}`, 5, 60 * 60 * 1000)) {
    return fail(429, "Too many submissions. Please try again a little later.");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "We could not read your application. Please try again.");
  }

  const rawData = form.get("data");
  if (typeof rawData !== "string" || rawData.length > MAX_DATA_CHARS) {
    return fail(400, "We could not read your application. Please try again.");
  }

  let payload: unknown = null;
  try {
    payload = JSON.parse(rawData);
  } catch {
    payload = null;
  }

  // Honeypot: a hidden "website" field people never fill in. Pretend it
  // worked so bots learn nothing.
  const website = (payload as { website?: unknown } | null)?.website;
  if (typeof website === "string" && website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const fileEntry = form.get("cvFile");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  const result = validateApplication(
    payload,
    file ? { name: file.name, size: file.size } : null,
  );
  if (!result.ok) {
    return fail(400, "Please check the highlighted fields.", result.errors);
  }

  const app = result.data;

  // Read and verify the file only when the candidate chose to upload one.
  let cv: CvUpload | null = null;
  if (app.cvMode === "file" && file) {
    const ext = fileExtension(file.name);
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes.byteLength > CV_MAX_BYTES || !matchesSignature(bytes, ext)) {
      return fail(400, "Please check the highlighted fields.", {
        cvFile: "This file does not look like a valid PDF, DOC or DOCX.",
      });
    }
    cv = { name: safeFileName(app.fullName, ext), type: MIME[ext], bytes };
  }

  if (isRateLimited(`careers-email:${app.email}`, 3, 24 * 60 * 60 * 1000)) {
    return fail(
      429,
      "We already have an application from this email today. Our team will be in touch.",
    );
  }

  // The application must land in at least one place the team reads.
  const [savedToMonday, notified] = await Promise.all([
    saveApplicationToMonday(app, cv),
    sendApplicationNotification(app, cv),
  ]);

  if (!savedToMonday && !notified) {
    return fail(
      502,
      "We could not submit your application. Please try again, or email it to us directly.",
    );
  }

  // The candidate's confirmation never delays the response.
  after(() => sendApplicationConfirmation(app));

  return Response.json({ ok: true });
}
