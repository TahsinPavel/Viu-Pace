import Link from "next/link";
import { TraceMini } from "./visuals/trace-mini";

const CLAIMS = [
  "Reads the retention curve against the transcript, second by second.",
  "Separate checkpoints and thresholds for long-form and for Shorts.",
  "Every finding closes on one thing to change before the next upload.",
];

export function Hero() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-[72rem] px-5 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20">
        <div className="max-w-[46rem]">
          <h1 className="text-[2rem] leading-[1.15] font-semibold tracking-[-0.025em] text-balance text-ink sm:text-[2.75rem]">
            Find out why the video failed.
          </h1>

          <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-secondary">
            ViuPace opens one underperforming video the way an investigator opens
            a flight recorder. It finds the second viewers left, reads what was
            being said when they did, and tells you what to change — instead of
            handing you another dashboard to interpret.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center rounded-md bg-ink px-5 text-[0.875rem] font-medium text-paper transition-colors hover:bg-[#2b3238] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal active:translate-y-px"
            >
              Open a report
            </Link>
            <Link
              href="#report"
              className="inline-flex h-10 items-center rounded-md border border-rule-strong px-5 text-[0.875rem] font-medium text-ink transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              Read a sample report
            </Link>
          </div>
        </div>

        <div className="mt-14 sm:mt-16">
          <TraceMini />
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-3">
          {CLAIMS.map((claim) => (
            <li
              key={claim}
              className="bg-paper px-5 py-4 text-[0.8125rem] leading-relaxed text-ink-secondary"
            >
              {claim}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
