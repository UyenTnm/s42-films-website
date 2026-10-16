/**
 * Faint, repeating S•42 Films watermark over every page.
 * Edit WATERMARK_TEXT to change the wording, and FILL_OPACITY to make it
 * lighter (smaller number) or stronger (bigger number).
 */
const WATERMARK_TEXT = "S•42 FILMS · CONFIDENTIAL";
const FILL_OPACITY = 0.07;

export default function ViewerWatermark() {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220">` +
    `<text x="180" y="110" text-anchor="middle" transform="rotate(-24 180 110)" ` +
    `font-family="Helvetica,Arial,sans-serif" font-size="14" letter-spacing="3" ` +
    `fill="#ffffff" fill-opacity="${FILL_OPACITY}">${WATERMARK_TEXT}</text></svg>`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
