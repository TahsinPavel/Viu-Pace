import { SegmentCallout } from "./segment-callout";
import {
  CONTENT_TYPE_LABEL,
  type ContentType,
  type ViralityBlueprint,
} from "@/lib/mock/diagnostics";

/**
 * The positive half of the curve. Spike thresholds are content-type aware —
 * Shorts swing harder by construction, so the bar a segment has to clear
 * before it counts as a rewatch event is taller there. The threshold in force
 * is stated rather than implied.
 */
export function ViralityBlueprintSection({
  data,
  contentType,
}: {
  data: ViralityBlueprint;
  contentType: ContentType;
}) {
  return (
    <div className="space-y-6">
      <p className="text-[0.9375rem] leading-relaxed text-ink-secondary">
        {data.spikes.length === 1 ? (
          <>
            <strong className="font-semibold text-ink">
              One segment cleared the spike threshold
            </strong>{" "}
            for {CONTENT_TYPE_LABEL[contentType]}, and{" "}
            <span className="font-mono text-[0.875rem] tabular-nums">
              {data.reachedShare}%
            </span>{" "}
            of playbacks reached it.
          </>
        ) : (
          <>
            <strong className="font-semibold text-ink">
              {data.spikes.length} segments cleared the spike threshold
            </strong>{" "}
            for {CONTENT_TYPE_LABEL[contentType]}. The strongest was reached by{" "}
            <span className="font-mono text-[0.875rem] tabular-nums">
              {data.reachedShare}%
            </span>{" "}
            of playbacks.
          </>
        )}
      </p>

      {/* The content-type gate this finding was measured against */}
      <dl className="grid grid-cols-2 gap-4 rounded-lg bg-field p-4">
        <div>
          <dt className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
            Spike threshold, {CONTENT_TYPE_LABEL[contentType]}
          </dt>
          <dd className="mt-1 font-mono text-[0.9375rem] text-ink tabular-nums">
            +{data.spikeThreshold} pts
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
            Reached the strongest spike
          </dt>
          <dd className="mt-1 font-mono text-[0.9375rem] text-ink tabular-nums">
            {data.reachedShare}%
          </dd>
        </div>
      </dl>

      <ul className="space-y-3">
        {data.spikes.map((seg) => (
          <SegmentCallout key={`${seg.kind}-${seg.from}`} seg={seg} />
        ))}
      </ul>

      {/* The reusable pattern — what the spikes have in common */}
      <div className="rounded-lg border border-rule p-4">
        <p className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
          Pattern
        </p>
        <p className="mt-2 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink">
          {data.pattern}
        </p>
      </div>
    </div>
  );
}
