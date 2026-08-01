import { RetentionTrace } from "./retention-trace";
import { SegmentCallout } from "./segment-callout";
import {
  formatTimecode,
  type BoredomLocator,
  type ContentType,
} from "@/lib/mock/diagnostics";

interface BoredomLocatorProps {
  data: BoredomLocator;
  durationSeconds: number;
  contentType: ContentType;
}

export function BoredomLocatorSection({
  data,
  durationSeconds,
  contentType,
}: BoredomLocatorProps) {
  const earlyDropFailed = data.earlyDropPct > data.earlyDropThreshold;

  return (
    <div className="space-y-6">
      {/* The one-line read, before the chart */}
      <p className="text-[0.9375rem] leading-relaxed text-ink-secondary">
        {earlyDropFailed ? (
          <>
            <strong className="font-semibold text-ink">
              {data.earlyDropPct}% left in the first {data.earlyDropWindow} seconds
            </strong>{" "}
            — over the {data.earlyDropThreshold}% ceiling this format is held to.
          </>
        ) : (
          <>
            The opening held:{" "}
            <strong className="font-semibold text-ink">
              {data.earlyDropPct}% left in the first {data.earlyDropWindow} seconds
            </strong>
            , inside the {data.earlyDropThreshold}% ceiling for this format.
          </>
        )}
      </p>

      <RetentionTrace
        curve={data.curve}
        reference={data.reference}
        segments={data.segments}
        checkpoints={data.checkpoints}
        durationSeconds={durationSeconds}
        contentType={contentType}
      />

      {/* Transcript-aligned callouts */}
      <ul className="space-y-3">
        {data.segments.map((seg) => (
          <SegmentCallout key={`${seg.kind}-${seg.from}`} seg={seg} />
        ))}
      </ul>

      <CheckpointTable data={data} />
    </div>
  );
}

/**
 * The chart's numbers, available as text. Checkpoint schedules differ by
 * content type, so the thresholds are shown alongside the measurements.
 */
function CheckpointTable({ data }: { data: BoredomLocator }) {
  return (
    <details className="group rounded-lg border border-rule">
      <summary className="cursor-pointer list-none px-4 py-2.5 text-[0.8125rem] text-ink-secondary transition-colors hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal">
        <span className="inline-block w-3 transition-transform group-open:rotate-90">
          ›
        </span>
        Checkpoint values ({data.checkpoints.length})
      </summary>
      <table className="w-full border-t border-rule text-left font-mono text-[0.75rem] tabular-nums">
        <thead className="text-ink-muted">
          <tr>
            {["Checkpoint", "At", "Floor", "Measured", ""].map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-2 text-[0.625rem] font-normal tracking-[0.06em] uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.checkpoints.map((cp) => {
            const held = cp.measured >= cp.threshold;
            return (
              <tr key={cp.at} className="border-t border-rule">
                <td className="px-4 py-2 text-ink">{cp.label}</td>
                <td className="px-4 py-2 text-ink-secondary">
                  {formatTimecode(cp.at)}
                </td>
                <td className="px-4 py-2 text-ink-muted">{cp.threshold}%</td>
                <td className="px-4 py-2 text-ink">{cp.measured}%</td>
                <td
                  className={`px-4 py-2 font-medium ${held ? "text-rewatch" : "text-drop"}`}
                >
                  {held ? "held" : "under"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </details>
  );
}
