import {
  channelOverview,
  formatCount,
  formatWatchHours,
} from "@/lib/mock/diagnostics";

/**
 * Channel context, above the divider — not the report.
 *
 * DESIGN.md refuses the analytics-dashboard default: a grid of equal metric
 * cards with sparklines and green delta percentages, which reports everything
 * and diagnoses nothing. That refusal is about the *report*, which still opens
 * on a probable-cause verdict. These four are the channel counters a creator
 * expects at the top of a workspace, so they are kept deliberately inert —
 * a label and a value, no deltas, no arrows, no trend lines, no colour. The
 * diagnosis lives below, and nothing here competes with it.
 */
export function ChannelOverview() {
  const cards = [
    { label: "Total views", value: formatCount(channelOverview.totalViews) },
    {
      label: "Total watch time",
      value: formatWatchHours(channelOverview.watchTimeHours),
    },
    {
      label: "Subscribers gained",
      value: `+${formatCount(channelOverview.subscribersGained)}`,
    },
    { label: "Average CTR", value: `${channelOverview.averageCtr}%` },
  ];

  return (
    <section aria-labelledby="overview-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          id="overview-heading"
          className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink"
        >
          Channel overview
        </h2>
        <p className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase tabular-nums">
          Last {channelOverview.windowDays} days
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-rule px-4 py-3.5"
          >
            <dt className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
              {card.label}
            </dt>
            <dd className="mt-1.5 font-mono text-[1.25rem] leading-none font-medium text-ink tabular-nums">
              {card.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
