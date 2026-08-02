import Link from "next/link";

/**
 * The closing block is the one place the page speaks in advice rather than
 * evidence, so it is built from the signal field — the same material the Asset
 * Rescue exhibit and the in-product recommendation block use. No gradient, no
 * shadow, no second accent.
 */
export function CTA() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-[72rem] px-5 py-16 sm:px-8 sm:py-24">
        <div className="rounded-xl border-l-2 border-signal bg-signal-field p-7 sm:p-10">
          <h2 className="max-w-[34ch] text-[1.75rem] leading-[1.2] font-semibold tracking-[-0.025em] text-balance text-ink">
            Pick the video that disappointed you.
          </h2>
          <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-ink-secondary">
            Connect the channel, choose one upload, and read the findings in
            order. About ten minutes, and it ends with one thing to change.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center rounded-md bg-ink px-5 text-[0.875rem] font-medium text-paper transition-colors hover:bg-[#2b3238] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal active:translate-y-px"
            >
              Open a report
            </Link>
            <Link
              href="#report"
              className="inline-flex h-10 items-center rounded-md border border-rule-strong px-5 text-[0.875rem] font-medium text-ink transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              Read a sample report first
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
