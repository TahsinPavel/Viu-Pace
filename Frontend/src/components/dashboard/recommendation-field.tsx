import { ArrowRight } from "lucide-react";
import { type Recommendation } from "@/lib/mock/diagnostics";

/**
 * The fix, on its own material. Evidence above this block sits on plate or
 * paper; advice always sits in the signal field, so the two are told apart
 * before a word is read. One per finding.
 */
export function RecommendationField({
  rec,
  index,
}: {
  rec: Recommendation;
  index: number;
}) {
  const stamp = `REC ${String(index + 1).padStart(2, "0")}`;

  return (
    <aside className="rounded-xl bg-signal-field p-5">
      <p className="font-mono text-[0.625rem] tracking-[0.08em] text-signal uppercase">
        {stamp} · Do this
      </p>

      <p className="mt-2.5 text-[1.0625rem] leading-snug font-semibold tracking-[-0.015em] text-ink text-balance">
        {rec.action}
      </p>

      <p className="mt-2.5 max-w-[62ch] text-[0.875rem] leading-relaxed text-ink-secondary">
        {rec.rationale}
      </p>

      {rec.asset && (
        <div className="mt-4 rounded-lg bg-paper p-4">
          <p className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
            {rec.asset.label}
          </p>
          <p className="mt-2 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink">
            {rec.asset.body}
          </p>
        </div>
      )}

      {rec.alternates && rec.alternates.length > 0 && (
        <div className="mt-4">
          <p className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
            Title options
          </p>
          <ul className="mt-2 space-y-1.5">
            {rec.alternates.map((alt) => (
              <li
                key={alt}
                className="flex items-start gap-2 text-[0.875rem] leading-snug text-ink"
              >
                <ArrowRight
                  className="mt-[0.2em] size-3.5 shrink-0 text-signal"
                  aria-hidden
                />
                {alt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
