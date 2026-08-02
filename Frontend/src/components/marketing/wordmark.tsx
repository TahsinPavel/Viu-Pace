import { cn } from "@/lib/utils";
import { PLATE_INK, REWATCH } from "./visuals/tokens";

/**
 * The mark is a two-second retention trace on a plate chip: the instrument the
 * whole product is built around, at 24px. No icon-library glyph, because the
 * shape of the trace is the brand.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-7 place-items-center rounded-sm bg-plate">
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
          <path
            d="M1 2 L4 5.5 L7 9.5 L10 8 L13 9 L17 11"
            fill="none"
            stroke={PLATE_INK}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="8" r="1.75" fill={REWATCH} />
        </svg>
      </span>
      <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
        ViuPace
      </span>
    </span>
  );
}
