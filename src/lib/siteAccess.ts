export const ACCESS_COOKIE_NAME = "s42_private_access";
export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const DEFAULT_ACCESS_CODE = "S42";

function getAccessCode() {
  return process.env.SITE_ACCESS_CODE?.trim() || DEFAULT_ACCESS_CODE;
}

function valuesMatch(left: string, right: string) {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

export function isValidAccessCode(candidate: string) {
  return valuesMatch(candidate.trim(), getAccessCode());
}

export async function createAccessToken() {
  const source = new TextEncoder().encode(
    `s42-private-access:${getAccessCode()}`,
  );
  const digest = await crypto.subtle.digest("SHA-256", source);

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
