import { Flag, TrendingUp } from "lucide-react";
import { formatTimecode, type RetentionSegment } from "@/lib/mock/diagnostics";

/**
 * A classified stretch of the curve, with the transcript that was on screen
 * while it happened. Shared by Boredom Locator (which reads the drops) and
 * Virality Blueprint (which reads the spikes) so one segment renders the same
 * way whichever finding lifts it out.
 *
 * Kind is never carried by colour alone: each callout pairs a distinct glyph
 * with a written label.
 */
export function SegmentCallout({ seg }: { seg: RetentionSegment }) {
  const isDrop = seg.kind === "drop";
  const Icon = isDrop ? Flag : TrendingUp;

  return (
    <li
      className={`rounded-lg p-4 ${isDrop ? "bg-drop-field" : "bg-rewatch-field"}`}
    >
      <div
        className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 ${isDrop ? "text-drop" : "text-rewatch"}`}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden />
        <span className="text-[0.8125rem] font-semibold">
          {isDrop ? "Drop-off" : "Rewatch spike"}
        </span>
        <span className="font-mono text-[0.75rem] tabular-nums">
          {formatTimecode(seg.from)}–{formatTimecode(seg.to)}
        </span>
        <span className="font-mono text-[0.75rem] font-semibold tabular-nums">
          {seg.delta > 0 ? "+" : ""}
          {seg.delta} pts
        </span>
      </div>

      <blockquote className="mt-3 border-l border-rule-strong pl-3 font-mono text-[0.75rem] leading-relaxed text-ink-secondary">
        {seg.transcript}
      </blockquote>

      <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink">{seg.reading}</p>
    </li>
  );
}
