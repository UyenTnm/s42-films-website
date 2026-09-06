/**
 * Utility functions for S•42
 */

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Pads a number with leading zeros (e.g. 1 -> "01", 42 -> "42")
 */
export function formatFilmNumber(num: number | string): string {
  const parsed = typeof num === "string" ? parseInt(num, 10) : num;
  if (isNaN(parsed)) return String(num);
  return parsed < 10 ? `0${parsed}` : `${parsed}`;
}
