import { FigureFrame } from "./figure-frame";
import { Legend } from "./legend";
import { DROP, MONO, SIGNAL } from "./tokens";

/**
 * Lacking Report. Dumbbell rows: this video against the channel's own best
 * video on the same subject, one row per measurable difference.
 *
 * Each row keeps its own scale because the units differ. A shared axis would
 * imply these numbers are comparable to each other, and they are not.
 */

const fmtTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

const ROWS = [
  {
    metric: "Time to first build step",
    value: 262,
    reference: 38,
    max: 300,
    format: fmtTime,
    worse: true,
  },
  {
    metric: "Cuts per minute",
    value: 4.2,
    reference: 11.6,
    max: 14,
    format: (v: number) => v.toFixed(1),
    worse: true,
  },
  {
    metric: "Numbers shown on screen",
    value: 3,
    reference: 14,
    max: 16,
    format: (v: number) => String(v),
    worse: true,
  },
  {
    metric: "How long people watch",
    value: 214,
    reference: 486,
    max: 540,
    format: fmtTime,
    worse: true,
  },
];

export function LackingMini() {
  return (
    <FigureFrame
      stamp="Lacking Report"
      caption="Both videos are about the same thing and run about the same length. The one that worked cuts almost 3 times as often and puts almost 5 times as many numbers on screen."
    >
      <div className="rounded-xl border border-rule bg-paper p-5">
        <div className="mb-4 border-b border-rule pb-3">
          <p className="text-[0.8125rem] text-ink-secondary">
            Compared against{" "}
            <span className="font-medium text-ink">
              &ldquo;Every Jig I Use, Built in One Weekend&rdquo;
            </span>
            , the best-performing video on this channel in the same subject.
          </p>
        </div>

        <div className="space-y-4">
          {ROWS.map((row) => {
            const vPct = (row.value / row.max) * 100;
            const rPct = (row.reference / row.max) * 100;
            const left = Math.min(vPct, rPct);
            const width = Math.abs(vPct - rPct);

            return (
              <div key={row.metric}>
                <div className="mb-1.5 flex items-baseline justify-between gap-4">
                  <span className="text-[0.8125rem] text-ink">{row.metric}</span>
                  <span
                    className="shrink-0 text-[0.75rem] text-ink-secondary"
                    style={{ fontFamily: MONO }}
                  >
                    {row.format(row.value)} vs {row.format(row.reference)}
                  </span>
                </div>

                <div className="relative h-4">
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-rule" />
                  <div
                    className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-rule-strong"
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                  <span
                    className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ left: `${rPct}%`, backgroundColor: SIGNAL }}
                  />
                  <span
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper"
                    style={{
                      left: `${vPct}%`,
                      backgroundColor: row.worse ? DROP : SIGNAL,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Legend
        items={[
          { glyph: "dot", color: DROP, label: "This video" },
          { glyph: "dot", color: SIGNAL, label: "The video that worked" },
        ]}
        note="EACH ROW HAS ITS OWN SCALE"
      />
    </FigureFrame>
  );
}
