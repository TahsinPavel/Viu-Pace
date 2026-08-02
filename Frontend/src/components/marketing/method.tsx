import { MONO } from "./visuals/tokens";

const STEPS = [
  {
    n: "01",
    title: "Connect the channel",
    body: "Read-only access to the YouTube Data and Analytics APIs. ViuPace never posts, never edits metadata, and never uploads.",
  },
  {
    n: "02",
    title: "Pick the video that disappointed you",
    body: "One video per report. Long-form or Shorts — the content type sets which checkpoints and thresholds apply from here on.",
  },
  {
    n: "03",
    title: "Read the findings in order",
    body: "Retention, packaging, and structure, each with the measurement, the threshold it was judged against, and the transcript line at that timestamp.",
  },
  {
    n: "04",
    title: "Change one thing",
    body: "Each finding ends in a single instruction. Change one thing per upload and you can tell what moved the number.",
  },
];

export function Method() {
  return (
    <section id="method" className="border-b border-rule bg-panel">
      <div className="mx-auto max-w-[72rem] px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-[62ch]">
          <h2 className="text-[1.75rem] leading-[1.2] font-semibold tracking-[-0.025em] text-balance text-ink">
            Four steps, about ten minutes
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-ink-secondary">
            Analysis is derived from API metrics, retention curves, and
            transcripts. No frames are processed and no footage leaves YouTube.
          </p>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2">
          {STEPS.map((step) => (
            <li key={step.n} className="bg-paper p-6">
              <span
                className="text-[0.6875rem] font-medium tracking-[0.08em] text-ink-muted uppercase"
                style={{ fontFamily: MONO }}
              >
                Step {step.n}
              </span>
              <h3 className="mt-3 text-[0.9375rem] leading-[1.4] font-semibold tracking-[-0.01em] text-ink">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[52ch] text-[0.875rem] leading-relaxed text-ink-secondary">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
