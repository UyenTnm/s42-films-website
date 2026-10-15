// Email + one-time-code access gate.
//
// Everything is stateless and signed with SITE_ACCESS_SECRET (HMAC-SHA-256):
//  - a short-lived "challenge" cookie proves a code was sent to an email,
//    without ever containing the code itself;
//  - a longer-lived "session" cookie proves the email was verified.

export const ACCESS_COOKIE_NAME = "s42_private_access";
export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const CHALLENGE_COOKIE_NAME = "s42_access_challenge";
export const CHALLENGE_TTL_SECONDS = 60 * 10; // 10 minutes

const CODE_LENGTH = 6;
const encoder = new TextEncoder();

// ---------------------------------------------------------------------------
// Secret
// ---------------------------------------------------------------------------

const DEV_SECRET = "dev-only-secret-do-not-use-in-production";

function getSecret(): string | null {
  const secret = process.env.SITE_ACCESS_SECRET?.trim();
  if (secret && secret.length >= 16) return secret;
  // Fail closed in production: with no secret nobody can get in.
  return process.env.NODE_ENV === "production" ? null : DEV_SECRET;
}

export function isAccessConfigured() {
  return getSecret() !== null;
}

// ---------------------------------------------------------------------------
// Small crypto helpers (Web Crypto only, works in the proxy and route handlers)
// ---------------------------------------------------------------------------

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function textToBase64Url(text: string) {
  return toBase64Url(encoder.encode(text));
}

function base64UrlToText(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function hmac(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );
  return toBase64Url(new Uint8Array(signature));
}

function valuesMatch(left: string, right: string) {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

// ---------------------------------------------------------------------------
// Email helpers
// ---------------------------------------------------------------------------

// "|" is excluded because it separates fields inside the session token.
const EMAIL_PATTERN =
  /^[^\s@<>()[\]\\,;:"|]+@[^\s@<>()[\]\\,;:"|]+\.[^\s@<>()[\]\\,;:"|]{2,}$/;

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const email = value.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return null;

  return email;
}

export interface Profile {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
}

/** Trims, collapses whitespace and strips control characters. */
export function normalizeName(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;

  let cleaned = "";
  for (const char of value) {
    const code = char.charCodeAt(0);
    cleaned += code < 32 || code === 127 ? " " : char;
  }

  const name = cleaned.replace(/\s+/g, " ").trim();
  if (!name || name.length > maxLength) return null;

  return name;
}

// ---------------------------------------------------------------------------
// One-time code + challenge cookie
// ---------------------------------------------------------------------------

function generateCode() {
  // Uniform 6-digit code (rejection sampling avoids modulo bias).
  const limit = Math.floor(0x100000000 / 10 ** CODE_LENGTH) * 10 ** CODE_LENGTH;
  const buffer = new Uint32Array(1);

  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);

  return String(buffer[0] % 10 ** CODE_LENGTH).padStart(CODE_LENGTH, "0");
}

export function sanitizeCode(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const digits = value.replace(/\D/g, "");
  return digits.length === CODE_LENGTH ? digits : null;
}

export async function createChallenge(profile: Profile) {
  const secret = getSecret();
  if (!secret) return null;

  const code = generateCode();
  const expiresAt = Math.floor(Date.now() / 1000) + CHALLENGE_TTL_SECONDS;
  const payload = textToBase64Url(JSON.stringify({ ...profile, expiresAt }));
  const signature = await hmac(secret, `s42-challenge|${payload}|${code}`);

  return { code, token: `${payload}.${signature}` };
}

/** Returns the signed profile when the code matches this challenge cookie. */
export async function verifyChallenge(
  token: string | undefined,
  code: string,
): Promise<Profile | null> {
  const secret = getSecret();
  if (!secret || !token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = await hmac(secret, `s42-challenge|${payload}|${code}`);
  if (!valuesMatch(signature, expected)) return null;

  try {
    const data = JSON.parse(base64UrlToText(payload)) as Partial<Profile> & {
      expiresAt?: number;
    };

    if (
      typeof data.email !== "string" ||
      typeof data.firstName !== "string" ||
      typeof data.lastName !== "string" ||
      typeof data.company !== "string" ||
      typeof data.expiresAt !== "number"
    ) {
      return null;
    }
    if (data.expiresAt < Math.floor(Date.now() / 1000)) return null;

    return {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Session cookie (set after the code is verified)
// ---------------------------------------------------------------------------

export async function createSessionToken(email: string) {
  const secret = getSecret();
  if (!secret) return null;

  const expiresAt = Math.floor(Date.now() / 1000) + ACCESS_COOKIE_MAX_AGE;
  const payload = textToBase64Url(`${email}|${expiresAt}`);
  const signature = await hmac(secret, `s42-session|${email}|${expiresAt}`);

  return `${payload}.${signature}`;
}

/** Returns the email stored in a valid, unexpired session token. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<string | null> {
  const secret = getSecret();
  if (!secret || !token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  let email: string;
  let expiresAt: number;
  try {
    const [decodedEmail, decodedExpiry] = base64UrlToText(payload).split("|");
    email = decodedEmail;
    expiresAt = Number(decodedExpiry);
  } catch {
    return null;
  }

  if (!email || !Number.isFinite(expiresAt)) return null;
  if (expiresAt < Math.floor(Date.now() / 1000)) return null;

  const expected = await hmac(secret, `s42-session|${email}|${expiresAt}`);

  return valuesMatch(signature, expected) ? email : null;
}

// ---------------------------------------------------------------------------
// Best-effort rate limiting
// ---------------------------------------------------------------------------
// In-memory, so it is per server instance only. It slows down casual abuse;
// add a Vercel Firewall rate-limit rule on /api/access/* for real protection.

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [storedKey, times] of hits) {
      if (times.every((time) => now - time >= windowMs)) hits.delete(storedKey);
    }
  }

  return false;
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
