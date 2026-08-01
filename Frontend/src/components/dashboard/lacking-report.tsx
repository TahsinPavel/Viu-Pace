import Image from "next/image";
import {
  formatCount,
  formatRowValue,
  type LackingReport,
  type LackingRow,
} from "@/lib/mock/diagnostics";

/**
 * Dumbbell rows. Each metric keeps its own scale and unit — nothing is
 * normalised into a shared index, because "cuts per minute" and "seconds to
 * first build step" are not comparable quantities.
 */
export function LackingReportSection({ data }: { data: LackingReport }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg bg-field p-3">
        <Image
          src={data.reference.thumbnail}
          alt=""
          width={88}
          height={50}
          className="aspect-video w-[88px] shrink-0 rounded-sm object-cover"
          unoptimized
        />
        <div className="min-w-0">
          <p className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
            Compared against · {data.subNiche}
          </p>
          <p className="mt-1 text-[0.8125rem] font-medium text-ink">
            {data.reference.title}
          </p>
          <p className="mt-0.5 font-mono text-[0.6875rem] text-ink-muted tabular-nums">
            {formatCount(data.reference.views)} views · {data.reference.publishedAt}
          </p>
        </div>
      </div>

      <ul className="space-y-5">
        {data.rows.map((row) => (
          <DumbbellRow key={row.metric} row={row} />
        ))}
      </ul>
    </div>
  );
}

function DumbbellRow({ row }: { row: LackingRow }) {
  const span = row.scale.max - row.scale.min || 1;
  const pos = (v: number) =>
    Math.max(0, Math.min(100, ((v - row.scale.min) / span) * 100));

  const mine = pos(row.value);
  const theirs = pos(row.referenceValue);
  const behind = row.higherIsBetter
    ? row.value < row.referenceValue
    : row.value > row.referenceValue;

  return (
    <li>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[0.8125rem] font-medium text-ink">{row.metric}</span>
        <span className="font-mono text-[0.75rem] tabular-nums">
          <span className={behind ? "text-drop" : "text-rewatch"}>
            {formatRowValue(row.value, row.unit)}
          </span>
          <span className="text-ink-muted"> vs </span>
          <span className="text-ink-secondary">
            {formatRowValue(row.referenceValue, row.unit)}
          </span>
        </span>
      </div>

      {/* Track */}
      <div className="relative mt-3 h-4">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-rule" />
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-rule-strong"
          style={{
            left: `${Math.min(mine, theirs)}%`,
            width: `${Math.abs(mine - theirs)}%`,
          }}
        />
        {/* Reference marker — hollow, neutral */}
        <span
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-muted bg-paper"
          style={{ left: `${theirs}%` }}
          aria-hidden
        />
        {/* This video — filled, status ink */}
        <span
          className={`absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-paper ${
            behind ? "bg-drop" : "bg-rewatch"
          }`}
          style={{ left: `${mine}%` }}
          aria-hidden
        />
      </div>

      <div className="mt-1.5 flex justify-between font-mono text-[0.625rem] text-ink-muted tabular-nums">
        <span>{formatRowValue(row.scale.min, row.unit)}</span>
        <span>{formatRowValue(row.scale.max, row.unit)}</span>
      </div>

      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-secondary">
        {row.note}
      </p>
    </li>
  );
}
