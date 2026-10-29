// Shared by the careers form (browser) and /api/careers/apply (server), so the
// rules and option lists can never drift apart.

export const POSITIONS = [
  "AI Creative — Full-time",
  "AI Creative — Internship",
] as const;

export const EXPERIENCE = [
  "Less than 6 months",
  "6 months – 1 year",
  "1–2 years",
  "2–3 years",
  "3+ years",
] as const;

export const STRENGTHS = [
  "AI Image Generation",
  "AI Video Generation",
  "Video Editing",
  "Visual Storytelling",
  "VFX / Compositing",
  "Motion Graphics",
  "Other",
] as const;

export const AI_TOOLS = [
  "Midjourney",
  "Kling",
  "Runway",
  "Google Veo",
  "Higgsfield",
  "ComfyUI",
  "ChatGPT",
  "Adobe Creative Cloud",
  "Other",
] as const;

export const ENGLISH_LEVELS = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Upper-Intermediate",
  "Advanced / Fluent",
] as const;

// Vietnam's 34 provincial-level units (since 2025). Ho Chi Minh City first
// because the role is on-site there; the rest alphabetical.
export const LOCATIONS = [
  "Ho Chi Minh City",
  "An Giang",
  "Bac Ninh",
  "Ca Mau",
  "Can Tho",
  "Cao Bang",
  "Da Nang",
  "Dak Lak",
  "Dien Bien",
  "Dong Nai",
  "Dong Thap",
  "Gia Lai",
  "Ha Noi",
  "Ha Tinh",
  "Hai Phong",
  "Hue",
  "Hung Yen",
  "Khanh Hoa",
  "Lai Chau",
  "Lam Dong",
  "Lang Son",
  "Lao Cai",
  "Nghe An",
  "Ninh Binh",
  "Phu Tho",
  "Quang Ngai",
  "Quang Ninh",
  "Quang Tri",
  "Son La",
  "Tay Ninh",
  "Thai Nguyen",
  "Thanh Hoa",
  "Tuyen Quang",
  "Vinh Long",
  "Outside Vietnam",
] as const;

export const CONTACT_EMAIL = "hello@s42films.com";

export const LIMITS = {
  fullName: 100,
  email: 254,
  url: 500,
  notes: 3000,
  tag: 40,
  tags: 5,
  salaryMax: 1_000_000_000, // 1 tỷ VND/tháng: chặn số nhập nhầm
} as const;

// CV upload. 4 MB keeps the whole request under Vercel's 4.5 MB body limit.
export const CV_MAX_BYTES = 4 * 1024 * 1024;
export const CV_EXTENSIONS = ["pdf", "doc", "docx"] as const;
export const CV_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type CvMode = "file" | "link";

export interface Application {
  fullName: string;
  email: string;
  phone: string; // +84XXXXXXXXX
  location: string;
  position: string;
  experience: string;
  /** Chosen options (without "Other") + the candidate's own tags. */
  strengths: string[];
  tools: string[];
  english: string; // "" = không chọn (không bắt buộc)
  portfolioUrl: string;
  cvMode: CvMode;
  cvUrl: string; // "" when a file is uploaded
  bestProjectUrl: string; // "" = không điền (không bắt buộc)
  onSite: "yes" | "no";
  startDate: string; // YYYY-MM-DD
  salaryMin: number;
  salaryMax: number;
  notes: string;
  consent: true;
}

export type FieldName =
  | Exclude<keyof Application, "cvMode">
  | "strengthsOther"
  | "toolsOther"
  | "cvFile";
export type FieldErrors = Partial<Record<FieldName, string>>;

/** What the validator needs to know about an uploaded file. */
export interface CvFileMeta {
  name: string;
  size: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function text(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

function oneOf<T extends readonly string[]>(value: unknown, list: T) {
  return typeof value === "string" && (list as readonly string[]).includes(value)
    ? value
    : "";
}

function manyOf<T extends readonly string[]>(value: unknown, list: T) {
  if (!Array.isArray(value)) return [];
  const allowed = list as readonly string[];
  return [...new Set(value.filter((v): v is string => allowed.includes(v)))];
}

/** Cleans a free-text tag list: trimmed, de-duplicated, max 5 × 40 chars. */
export function cleanTags(value: unknown) {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of value) {
    const tag = text(item, LIMITS.tag).replace(/\s+/g, " ").replace(/,/g, "");
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length >= LIMITS.tags) break;
  }
  return out;
}

/**
 * Vietnamese mobile number → "+84XXXXXXXXX".
 * Accepts "0901234567", "901234567", "+84 90 123 4567", "84901234567".
 */
export function normalizeVnPhone(value: unknown) {
  if (typeof value !== "string") return null;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length === 11) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return /^[35789]\d{8}$/.test(digits) ? `+84${digits}` : null;
}

/** "+84901234567" → "+84 90 123 4567" for display. */
export function formatVnPhone(e164: string) {
  const d = e164.replace(/^\+84/, "");
  return `+84 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
}

/** Only http(s); adds https:// if the candidate forgot it. */
export function normalizeUrl(value: unknown) {
  const raw = text(value, LIMITS.url);
  if (!raw) return "";
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

/** Checks name + size only; the server also checks the file's real content. */
export function checkCvFile(file: CvFileMeta | null | undefined) {
  if (!file || file.size === 0) return "Please upload your CV, or switch to a link.";
  if (!(CV_EXTENSIONS as readonly string[]).includes(fileExtension(file.name))) {
    return "Please upload a PDF, DOC or DOCX file.";
  }
  if (file.size > CV_MAX_BYTES) return "The file is larger than 4 MB.";
  return null;
}

function salary(value: unknown) {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.replace(/[^\d]/g, ""))
        : NaN;
  return Number.isFinite(n) && n > 0 && n <= LIMITS.salaryMax
    ? Math.round(n)
    : null;
}

export function todayInVietnam() {
  return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/**
 * Cleans and checks an application. Returns clean data, or one error per
 * field so the form can show it right under the input.
 */
export function validateApplication(
  input: unknown,
  cvFile?: CvFileMeta | null,
):
  | { ok: true; data: Application }
  | { ok: false; errors: FieldErrors } {
  const raw = (input && typeof input === "object" ? input : {}) as Record<
    string,
    unknown
  >;
  const errors: FieldErrors = {};

  const fullName = text(raw.fullName, LIMITS.fullName);
  if (fullName.length < 2) errors.fullName = "Please enter your full name.";

  const email = text(raw.email, LIMITS.email).toLowerCase();
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";

  const phone = normalizeVnPhone(raw.phone);
  if (!phone) {
    errors.phone = "Please enter a valid Vietnamese mobile number, e.g. 90 123 4567.";
  }

  const location = oneOf(raw.location, LOCATIONS);
  if (!location) errors.location = "Please choose where you live now.";

  const position = oneOf(raw.position, POSITIONS);
  if (!position) errors.position = "Please choose a position.";

  const experience = oneOf(raw.experience, EXPERIENCE);
  if (!experience) errors.experience = "Please choose your experience.";

  const pickedStrengths = manyOf(raw.strengths, STRENGTHS);
  const strengthsOther = cleanTags(raw.strengthsOther);
  if (!pickedStrengths.length) errors.strengths = "Choose at least one strength.";
  else if (pickedStrengths.includes("Other") && !strengthsOther.length) {
    errors.strengthsOther = "Tell us your other strength(s).";
  }

  const pickedTools = manyOf(raw.tools, AI_TOOLS);
  const toolsOther = cleanTags(raw.toolsOther);
  if (!pickedTools.length) errors.tools = "Choose at least one tool.";
  else if (pickedTools.includes("Other") && !toolsOther.length) {
    errors.toolsOther = "Tell us which other tool(s) you use.";
  }

  const english = oneOf(raw.english, ENGLISH_LEVELS);

  const portfolioUrl = normalizeUrl(raw.portfolioUrl);
  if (!portfolioUrl)
    errors.portfolioUrl = "Please enter a valid portfolio or showreel link.";

  const cvMode: CvMode = raw.cvMode === "link" ? "link" : "file";
  let cvUrl = "";
  if (cvMode === "link") {
    const url = normalizeUrl(raw.cvUrl);
    if (!url) errors.cvUrl = "Please enter a valid CV / resume link.";
    else cvUrl = url;
  } else {
    const problem = checkCvFile(cvFile);
    if (problem) errors.cvFile = problem;
  }

  const bestProjectUrl = normalizeUrl(raw.bestProjectUrl);
  if (bestProjectUrl === null)
    errors.bestProjectUrl = "Please enter a valid link, or leave it empty.";

  const onSite = raw.onSite === "yes" || raw.onSite === "no" ? raw.onSite : null;
  if (!onSite) errors.onSite = "Please choose Yes or No.";

  const startDate = text(raw.startDate, 10);
  if (!DATE_RE.test(startDate) || Number.isNaN(Date.parse(startDate))) {
    errors.startDate = "Please choose a start date.";
  } else if (startDate < todayInVietnam()) {
    errors.startDate = "The start date cannot be in the past.";
  }

  const salaryMin = salary(raw.salaryMin);
  const salaryMax = salary(raw.salaryMax);
  if (salaryMin === null) errors.salaryMin = "Please enter a minimum amount.";
  if (salaryMax === null) errors.salaryMax = "Please enter a maximum amount.";
  if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
    errors.salaryMax = "Maximum must be greater than or equal to minimum.";
  }

  const notes = text(raw.notes, LIMITS.notes);

  if (raw.consent !== true) {
    errors.consent = "Please agree to the processing of your data to continue.";
  }

  if (Object.keys(errors).length) return { ok: false, errors };

  // Own tags only count while "Other" is ticked.
  const merge = (picked: string[], extra: string[]) => [
    ...picked.filter((item) => item !== "Other"),
    ...(picked.includes("Other") ? extra : []),
  ];

  return {
    ok: true,
    data: {
      fullName,
      email,
      phone: phone as string,
      location,
      position,
      experience,
      strengths: merge(pickedStrengths, strengthsOther),
      tools: merge(pickedTools, toolsOther),
      english,
      portfolioUrl: portfolioUrl as string,
      cvMode,
      cvUrl,
      bestProjectUrl: bestProjectUrl ?? "",
      onSite: onSite as "yes" | "no",
      startDate,
      salaryMin: salaryMin as number,
      salaryMax: salaryMax as number,
      notes,
      consent: true,
    },
  };
}

export function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
}
