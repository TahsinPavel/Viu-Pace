import { FigureFrame } from "./figure-frame";
import { MONO, SIGNAL, STAMP } from "./tokens";
import { cn } from "@/lib/utils";

/**
 * Asset Rescue Engine. The one exhibit made of the advice material rather than
 * the evidence material: signal field, signal rule, one stamp.
 *
 * Nothing here is measured, so nothing here carries a number.
 */

const TITLES = [
  {
    text: "The $900 Workshop (Everything Is Plywood)",
    angle: "Leads with the price, then says what made it possible.",
  },
  {
    text: "I Built a Whole Workshop for the Price of One Table Saw",
    angle: "Compares the price to something viewers already know the cost of.",
  },
  {
    text: "$900 Workshop: Flat to Half a Millimetre",
    angle: "Puts the price next to the measurement viewers rewatched.",
  },
];

export function RescueMini() {
  return (
    <FigureFrame
      stamp="Asset Rescue"
      caption="This runs only when the title and thumbnail are what held a video back. It writes replacements you can paste in, and it says which one to try first."
    >
      <div className="overflow-hidden rounded-xl border border-rule bg-paper">
        <div className="border-b border-rule bg-field px-5 py-3">
          <div
            className={cn(STAMP, "text-ink-muted")}
            style={{ fontFamily: MONO }}
          >
            Current title
          </div>
          <p className="mt-1 text-[0.9375rem] text-ink-muted line-through decoration-ink-muted/50">
            I Rebuilt My Entire Workshop for $900
          </p>
        </div>

        <div
          className="border-l-2 px-5 py-4"
          style={{ borderLeftColor: SIGNAL, backgroundColor: "#fbf2f8" }}
        >
          <div className="mb-3 flex items-center gap-3">
            <span className={cn(STAMP)} style={{ color: SIGNAL }}>
              Suggested
            </span>
            <span
              aria-hidden
              className="h-px flex-1"
              style={{ backgroundColor: SIGNAL, opacity: 0.25 }}
            />
          </div>

          <ol className="space-y-3">
            {TITLES.map((t, i) => (
              <li key={t.text} className="flex gap-3">
                <span
                  className="mt-0.5 shrink-0 text-[0.75rem] font-medium"
                  style={{ fontFamily: MONO, color: SIGNAL }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    {t.text}
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] text-ink-secondary">
                    {t.angle}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-4 border-t pt-3 text-[0.8125rem] text-ink-secondary"
             style={{ borderTopColor: "rgba(165,34,140,0.2)" }}>
            <span className="font-semibold text-ink">Do this:</span> use title 1
            with the finished-bench thumbnail, and change nothing else for 14
            days. If you change several things at once you will not know which
            one worked.
          </p>
        </div>
      </div>
    </FigureFrame>
  );
}
