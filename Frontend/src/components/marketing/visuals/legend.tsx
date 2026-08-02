import { cn } from "@/lib/utils";
import { MONO } from "./tokens";

export type LegendGlyph = "solid" | "dashed" | "dot" | "square";

export interface LegendItem {
  glyph: LegendGlyph;
  color: string;
  label: string;
}

function Glyph({ glyph, color }: { glyph: LegendGlyph; color: string }) {
  if (glyph === "dot") {
    return (
      <svg width="10" height="10" aria-hidden>
        <circle cx="5" cy="5" r="4" fill={color} />
      </svg>
    );
  }
  if (glyph === "square") {
    return (
      <svg width="10" height="10" aria-hidden>
        <rect x="1" y="1" width="8" height="8" rx="1.5" fill={color} />
      </svg>
    );
  }
  return (
    <svg width="18" height="8" aria-hidden>
      <line
        x1="0"
        y1="4"
        x2="18"
        y2="4"
        stroke={color}
        strokeWidth={glyph === "dashed" ? 1.5 : 2}
        strokeDasharray={glyph === "dashed" ? "5 4" : undefined}
      />
    </svg>
  );
}

/**
 * Required on any exhibit carrying two or more series. Each key names its own
 * glyph as well as its color, so removing the color never removes the meaning.
 */
export function Legend({
  items,
  note,
  className,
}: {
  items: LegendItem[];
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.75rem] text-ink-secondary",
        className
      )}
    >
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <Glyph glyph={item.glyph} color={item.color} />
          {item.label}
        </span>
      ))}
      {note ? (
        <span
          className="text-[0.6875rem] text-ink-muted"
          style={{ fontFamily: MONO }}
        >
          {note}
        </span>
      ) : null}
    </div>
  );
}
