import { CircleCheck, TriangleAlert } from "lucide-react";
import {
  CONTENT_TYPE_LABEL,
  formatTimecode,
  type ContentType,
  type EarlyDrop,
} from "@/lib/mock/diagnostics";

/**
 * The opening gate, judged against a content-type-aware ceiling: long-form on
 * the first 30 seconds, Shorts on the first 3–5, because the swipe decision
 * arrives sooner. Pass/fail is stated with a glyph and a label, never colour
 * alone, and the ceiling in force is always on screen next to the measurement.
 */
export function EarlyDropSection({
  data,
  contentType,
}: {
  data: EarlyDrop;
  contentType: ContentType;
}) {
  const failed = data.pct > data.threshold;
  const Icon = failed ? TriangleAlert : CircleCheck;

  // Both the loss and the ceiling are read against the same axis, padded so a
  // failing bar still has room to overshoot its marker.
  const axisMax = Math.ceil(
    Math.max(data.pct, data.threshold, data.channelAvgPct) * 1.25
  );
  const ceilingPct = (data.threshold / axisMax) * 100;

  const rows = [
    { label: "This video", value: data.pct, emphasis: true },
    {
      label: `Channel average, ${CONTENT_TYPE_LABEL[contentType]}`,
      value: data.channelAvgPct,
      emphasis: false,
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-[0.9375rem] leading-relaxed text-ink-secondary">
        <strong className="font-semibold text-ink">
          {data.pct} points lost in the first {data.window} seconds
        </strong>
        , against a {data.threshold}-point ceiling for{" "}
        {CONTENT_TYPE_LABEL[contentType]}. Retention at{" "}
        {formatTimecode(data.window)} is{" "}
        <span className="font-mono text-[0.875rem] tabular-nums">
          {data.measured}%
        </span>
        .
      </p>

      {/* Gate verdict — glyph + label + colour, all three */}
      <p
        className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[0.8125rem] font-semibold ${
          failed ? "bg-drop-field text-drop" : "bg-rewatch-field text-rewatch"
        }`}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {failed
          ? `Over the ${data.threshold}-point ceiling`
          : `Inside the ${data.threshold}-point ceiling`}
      </p>

      {/* Loss against the ceiling. The ceiling is one rule drawn across both
          bars rather than a tick under them, so it reads as the gate they are
          measured against instead of a third data point. */}
      <div>
        <p
          className="mb-1.5 font-mono text-[0.625rem] whitespace-nowrap text-ink tabular-nums"
          style={{ marginInlineStart: `${ceilingPct}%` }}
        >
          <span className="-translate-x-1/2 inline-block">
            {data.threshold}-pt ceiling
          </span>
        </p>

        <div className="relative">
          {/* The gate, spanning the bar group */}
          <span
            className="absolute inset-y-0 z-10 w-px bg-ink"
            style={{ left: `${ceilingPct}%` }}
            aria-hidden
          />

          <div className="space-y-3.5">
            {rows.map((row) => (
              <div key={row.label}>
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    className={`text-[0.8125rem] ${
                      row.emphasis ? "font-medium text-ink" : "text-ink-secondary"
                    }`}
                  >
                    {row.label}
                  </span>
                  <span
                    className={`font-mono text-[0.8125rem] tabular-nums ${
                      row.emphasis
                        ? failed
                          ? "font-semibold text-drop"
                          : "font-semibold text-rewatch"
                        : "text-ink-secondary"
                    }`}
                  >
                    {row.value} pts
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-field">
                  <div
                    className={`h-full rounded-full ${
                      row.emphasis
                        ? failed
                          ? "bg-drop"
                          : "bg-rewatch"
                        : "bg-rule-strong"
                    }`}
                    style={{ width: `${(row.value / axisMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 font-mono text-[0.625rem] tracking-[0.04em] text-ink-muted uppercase">
          Axis 0–{axisMax} points lost · {data.window}s window
        </p>
      </div>

      <p className="max-w-[68ch] text-[0.8125rem] leading-relaxed text-ink-secondary">
        {data.verdict}
      </p>
    </div>
  );
}
