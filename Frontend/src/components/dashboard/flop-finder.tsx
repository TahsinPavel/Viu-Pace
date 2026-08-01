import {
  CONTENT_TYPE_LABEL,
  formatCount,
  type ContentType,
  type FlopFinder,
} from "@/lib/mock/diagnostics";

/**
 * CTR against two references on one shared axis. Emphasis form: the video under
 * inspection carries status ink, the references stay neutral gray. No second
 * axis, and every bar is labelled with its own raw value.
 */
export function FlopFinderChart({
  data,
  contentType,
}: {
  data: FlopFinder;
  contentType: ContentType;
}) {
  const rows = [
    { label: "This video", value: data.ctr, emphasis: true },
    {
      label: `Channel average, ${CONTENT_TYPE_LABEL[contentType]}`,
      value: data.channelAvgCtr,
      emphasis: false,
    },
    { label: "Sub-niche median", value: data.nicheMedianCtr, emphasis: false },
  ];

  const axisMax = Math.ceil(Math.max(...rows.map((r) => r.value)) + 1);
  const under = data.ctr < data.channelAvgCtr;
  const gap = data.ctr - data.channelAvgCtr;

  return (
    <div className="space-y-6">
      <p className="text-[0.9375rem] leading-relaxed text-ink-secondary">
        <strong className="font-semibold text-ink">
          {data.ctr}% clicked through
        </strong>
        , {under ? "under" : "over"} your {data.channelAvgCtr}% average by{" "}
        <span className={under ? "text-drop" : "text-rewatch"}>
          {Math.abs(gap).toFixed(1)} points
        </span>
        .
      </p>

      <div className="space-y-3.5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span
                className={`text-[0.8125rem] ${row.emphasis ? "font-medium text-ink" : "text-ink-secondary"}`}
              >
                {row.label}
              </span>
              <span
                className={`font-mono text-[0.8125rem] tabular-nums ${
                  row.emphasis
                    ? under
                      ? "font-semibold text-drop"
                      : "font-semibold text-rewatch"
                    : "text-ink-secondary"
                }`}
              >
                {row.value}%
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-field">
              <div
                className={`h-full rounded-full ${
                  row.emphasis
                    ? under
                      ? "bg-drop"
                      : "bg-rewatch"
                    : "bg-rule-strong"
                }`}
                style={{ width: `${(row.value / axisMax) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <p className="pt-0.5 font-mono text-[0.625rem] tracking-[0.04em] text-ink-muted uppercase">
          Axis 0–{axisMax}% CTR
        </p>
      </div>

      {/* Reach context — the number that decides whether CTR is even the problem */}
      <dl className="grid grid-cols-3 gap-4 rounded-lg bg-field p-4">
        {[
          ["Impressions", formatCount(data.impressions)],
          ["Views", formatCount(data.views)],
          ["Reach percentile", `${data.impressionsPercentile}th`],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
              {label}
            </dt>
            <dd className="mt-1 font-mono text-[0.9375rem] text-ink tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-[0.8125rem] leading-relaxed text-ink-secondary">
        {data.verdict}
      </p>
    </div>
  );
}
