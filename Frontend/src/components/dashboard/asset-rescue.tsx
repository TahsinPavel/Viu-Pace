import { Ban } from "lucide-react";
import { type AssetRescue } from "@/lib/mock/diagnostics";

/**
 * Generated packaging alternatives, gated on Flop Finder. When CTR is not the
 * measured gap the engine stands down and says so, rather than generating three
 * titles a converting video does not need — the stand-down is a real result and
 * is rendered as one.
 */
export function AssetRescueSection({ data }: { data: AssetRescue }) {
  if (!data.eligible) {
    return (
      <div className="space-y-4">
        <p className="inline-flex items-center gap-2 rounded-md bg-panel px-2.5 py-1.5 text-[0.8125rem] font-semibold text-ink-secondary">
          <Ban className="size-3.5 shrink-0" aria-hidden />
          Engine stood down
        </p>
        <p className="max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-secondary">
          {data.gate}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-secondary">
        {data.gate}
      </p>

      <div>
        <p className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
          Generated titles ({data.titles.length})
        </p>
        <ul className="mt-2.5 space-y-2.5">
          {data.titles.map((title, i) => (
            <li key={title.text} className="rounded-lg border border-rule p-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[0.625rem] text-ink-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[0.9375rem] leading-snug font-medium text-ink">
                  {title.text}
                </p>
              </div>
              <p className="mt-2 pl-[1.9rem] text-[0.8125rem] leading-relaxed text-ink-secondary">
                {title.angle}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
          Thumbnail concepts ({data.thumbnails.length})
        </p>
        <ul className="mt-2.5 space-y-2.5">
          {data.thumbnails.map((concept) => (
            <li key={concept.label} className="rounded-lg bg-field p-4">
              <p className="text-[0.8125rem] font-medium text-ink">
                {concept.label}
              </p>
              <p className="mt-1.5 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-secondary">
                {concept.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
