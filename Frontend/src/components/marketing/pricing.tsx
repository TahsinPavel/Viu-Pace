import Link from "next/link";
import { cn } from "@/lib/utils";
import { MONO } from "./visuals/tokens";

/**
 * Priced per report, because a report is the unit of work. No billing toggle, no
 * "most popular" ribbon, no feature matrix with checkmarks in a second hue — the
 * allowance is the stamp, the price is a measurement, and the recommendation is
 * one line of signal ink because a recommendation is advice.
 */

const PLANS = [
  {
    allowance: "1 report",
    name: "Single report",
    price: "$9",
    unit: "once",
    body: "One video, the full diagnostic, no account renewal. For the upload that is still bothering you.",
    includes: [
      "All six findings",
      "Transcript-aligned retention",
      "Kept for 12 months",
    ],
    cta: "Run one report",
    recommended: false,
  },
  {
    allowance: "8 reports / month",
    name: "Channel",
    price: "$29",
    unit: "per month",
    body: "Enough to diagnose every upload on a weekly schedule and still have room for the back catalogue.",
    includes: [
      "All six findings",
      "Transcript-aligned retention",
      "Comparison against your own best video",
      "Search coverage on title, description, and tags",
      "Report history across uploads",
    ],
    cta: "Open a report",
    recommended: true,
  },
  {
    allowance: "40 reports / month",
    name: "Studio",
    price: "$79",
    unit: "per month",
    body: "For multiple channels or a team reviewing a slate. Same report, more of them, shared in one place.",
    includes: [
      "Everything in Channel",
      "Up to 5 connected channels",
      "Shared report links",
      "Export findings as text",
    ],
    cta: "Open a report",
    recommended: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-rule bg-panel">
      <div className="mx-auto max-w-[72rem] px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-[62ch]">
          <h2 className="text-[1.75rem] leading-[1.2] font-semibold tracking-[-0.025em] text-balance text-ink">
            Priced by the report
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-ink-secondary">
            One video per report, whatever the plan. Cancel whenever — unused
            reports do not roll over, so the smaller plan is usually the right
            one to start on.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-rule bg-rule lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col p-6 sm:p-7",
                plan.recommended ? "bg-field" : "bg-paper",
              )}
            >
              <span
                className="text-[0.6875rem] font-medium tracking-[0.08em] text-ink-muted uppercase"
                style={{ fontFamily: MONO }}
              >
                {plan.allowance}
              </span>

              <h3 className="mt-3 text-[0.9375rem] leading-[1.4] font-semibold tracking-[-0.01em] text-ink">
                {plan.name}
              </h3>

              <p className="mt-4 flex items-baseline gap-2">
                <span
                  className="text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-ink"
                  style={{ fontFamily: MONO }}
                >
                  {plan.price}
                </span>
                <span className="text-[0.8125rem] text-ink-muted">
                  {plan.unit}
                </span>
              </p>

              <p className="mt-4 max-w-[46ch] text-[0.875rem] leading-relaxed text-ink-secondary">
                {plan.body}
              </p>

              <ul className="mt-6 space-y-2.5 border-t border-rule pt-5">
                {plan.includes.map((item) => (
                  <li
                    key={item}
                    className="text-[0.8125rem] leading-relaxed text-ink-secondary"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-7">
                <Link
                  href="/dashboard"
                  className={cn(
                    "inline-flex h-10 w-full items-center justify-center rounded-md px-5 text-[0.875rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal active:translate-y-px",
                    plan.recommended
                      ? "bg-ink text-paper hover:bg-[#2b3238]"
                      : "border border-rule-strong text-ink hover:bg-panel",
                  )}
                >
                  {plan.cta}
                </Link>
                {plan.recommended && (
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-signal">
                    Start here if you upload weekly.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-[68ch] text-[0.8125rem] leading-relaxed text-ink-muted">
          Read-only YouTube access, revocable from your Google account at any
          time. No card required to connect a channel and see which of your
          videos are eligible.
        </p>
      </div>
    </section>
  );
}
