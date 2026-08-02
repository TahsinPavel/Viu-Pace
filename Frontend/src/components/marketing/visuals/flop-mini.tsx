import { FigureFrame } from "./figure-frame";
import { Legend } from "./legend";
import { DROP, MONO, SIGNAL } from "./tokens";

/**
 * Flop Finder, rendered on paper rather than plate so the features page does
 * not repeat one visual material seven times.
 *
 * SIGNAL marks the two reference rates. It never marks the outcome, which is
 * carried by the drop glyph and the word "below" on the row that failed.
 */

const MAX = 8;

const ROWS = [
  { label: "This video", value: 3.1, kind: "measured" as const },
  { label: "Your channel average", value: 6.4, kind: "reference" as const },
  { label: "Videos like yours", value: 5.8, kind: "reference" as const },
];

export function FlopMini() {
  return (
    <FigureFrame
      stamp="Flop Finder"
      caption="YouTube showed this video to 412,000 people, which is more than usual for this channel. Getting seen was not the problem. Only 3 out of every 100 people who saw it clicked."
    >
      <div className="rounded-xl border border-rule bg-field p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <span
            className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted"
            style={{ fontFamily: MONO }}
          >
            Clicks per 100 people who saw it
          </span>
          <span
            className="text-[0.6875rem] text-ink-muted"
            style={{ fontFamily: MONO }}
          >
            412,000 shown / 18,420 views
          </span>
        </div>

        <div className="space-y-3">
          {ROWS.map((row) => (
            <div key={row.label} className="grid grid-cols-[9.5rem_1fr_3rem] items-center gap-3">
              <span className="text-[0.8125rem] text-ink-secondary">
                {row.label}
              </span>
              <div className="h-5 rounded-sm bg-panel">
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${(row.value / MAX) * 100}%`,
                    backgroundColor: row.kind === "measured" ? DROP : SIGNAL,
                    opacity: row.kind === "measured" ? 1 : 0.45,
                  }}
                />
              </div>
              <span
                className="text-right text-[0.8125rem] font-medium text-ink"
                style={{ fontFamily: MONO }}
              >
                {row.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-rule pt-3">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M7 2.5 L7 11.5 M3.5 8 L7 11.5 L10.5 8"
              fill="none"
              stroke={DROP}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[0.8125rem] font-semibold text-drop">
            3.3 below your channel average
          </span>
        </div>
      </div>

      <Legend
        items={[
          { glyph: "square", color: DROP, label: "This video" },
          { glyph: "square", color: SIGNAL, label: "Reference rates" },
        ]}
      />
    </FigureFrame>
  );
}
