import { Users } from "lucide-react";
import { formatTimecode, type AudienceBehavior } from "@/lib/mock/diagnostics";

/**
 * A supporting panel, not a numbered finding — hence no stamp, no
 * recommendation field, and a single comparison. One cohort split read at one
 * checkpoint. This is deliberately not a demographics breakdown: the only
 * question it answers is whether the drop is a new-viewer problem.
 */
export function AudienceBehaviorPanel({ data }: { data: AudienceBehavior }) {
  const gap =
    data.cohorts.length === 2
      ? Math.abs(data.cohorts[0].retention - data.cohorts[1].retention)
      : null;

  return (
    <section
      aria-labelledby="audience-behavior-heading"
      className="rounded-xl border border-rule p-5"
    >
      <div className="flex items-center gap-2">
        <Users className="size-3.5 shrink-0 text-ink-muted" aria-hidden />
        <h4
          id="audience-behavior-heading"
          className="text-[0.875rem] font-semibold tracking-[-0.01em] text-ink"
        >
          Audience behavior
        </h4>
        <span className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase tabular-nums">
          Read at {formatTimecode(data.at)}
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {data.cohorts.map((cohort) => (
          <li key={cohort.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span
                className={`text-[0.8125rem] ${
                  cohort.emphasis ? "font-medium text-ink" : "text-ink-secondary"
                }`}
              >
                {cohort.label}
                <span className="ml-2 font-mono text-[0.6875rem] text-ink-muted tabular-nums">
                  {cohort.share}% of audience
                </span>
              </span>
              <span
                className={`font-mono text-[0.8125rem] tabular-nums ${
                  cohort.emphasis
                    ? "font-semibold text-ink"
                    : "text-ink-secondary"
                }`}
              >
                {cohort.retention}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-field">
              <div
                className={`h-full rounded-full ${
                  cohort.emphasis ? "bg-ink" : "bg-rule-strong"
                }`}
                style={{ width: `${cohort.retention}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-2.5 font-mono text-[0.625rem] tracking-[0.04em] text-ink-muted uppercase">
        Axis 0–100% retention
        {gap !== null && ` · ${gap.toFixed(1)}-point spread`}
      </p>

      <p className="mt-3.5 max-w-[68ch] text-[0.8125rem] leading-relaxed text-ink-secondary">
        {data.reading}
      </p>
    </section>
  );
}
