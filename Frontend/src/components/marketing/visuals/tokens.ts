/**
 * DESIGN.md palette, restated as literals because SVG presentation attributes
 * cannot read Tailwind theme tokens. Keep in sync with globals.css.
 *
 * Rules that these values encode, and that every visual in this folder honors:
 * - SIGNAL is reference and advice only. It never means good or bad.
 * - DROP / REWATCH / CAUTION always ship with a glyph and a text label.
 */
export const PLATE = "#14181c";
export const PLATE_GRID = "#232a31";
export const PLATE_INK = "#f7f8f9";
export const PLATE_INK_MUTED = "#b3bcc4";

export const INK = "#14181c";
export const INK_SECONDARY = "#566069";
export const INK_MUTED = "#6b757e";
export const RULE = "#e2e5e9";
export const RULE_STRONG = "#cdd2d8";

export const SIGNAL = "#a5228c";
export const DROP = "#c0362c";
export const REWATCH = "#0f7a45";
export const CAUTION = "#9a6400";

export const MONO = "var(--font-geist-mono), ui-monospace, monospace";

/** The one uppercase mono designator a block is allowed to carry. */
export const STAMP =
  "font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em]";
