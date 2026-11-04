// Which pages need the private-access code (email + one-time code).
//
// Set NEXT_PUBLIC_PROTECTED_PATHS on Vercel, then redeploy (the value is fixed
// at build time):
//   not set            → "/"  the whole site is protected (safe default)
//   none               → nothing is protected: the whole site is open
//   /films,/slate      → only these pages and everything under them
//
// /careers and /access are never protected.

const ALWAYS_PUBLIC = ["/careers", "/access"];

function parse(value: string | undefined): string[] {
  const raw = value?.trim();
  if (!raw) return ["/"];
  if (raw.toLowerCase() === "none") return [];

  const paths = raw
    .split(",")
    .map((path) => path.trim())
    .filter((path) => path.startsWith("/"))
    .map((path) => (path === "/" ? path : path.replace(/\/+$/, "")));

  // A typo must never open the whole site by accident.
  return paths.length ? paths : ["/"];
}

export const PROTECTED_PATHS = parse(process.env.NEXT_PUBLIC_PROTECTED_PATHS);

/** False when the whole site is open ("none"). */
export const HAS_PROTECTED_PAGES = PROTECTED_PATHS.length > 0;

function isUnder(pathname: string, base: string) {
  return base === "/" || pathname === base || pathname.startsWith(`${base}/`);
}

export function isProtectedPath(pathname: string) {
  if (ALWAYS_PUBLIC.some((path) => isUnder(pathname, path))) return false;
  return PROTECTED_PATHS.some((path) => isUnder(pathname, path));
}
