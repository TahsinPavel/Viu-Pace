import { MONO } from "./visuals/tokens";

/**
 * The boundary section. A diagnostic tool earns trust by naming what it cannot
 * see, so "does" and "does not" get equal weight and equal type — no crossed-out
 * competitor column, no red X list. Two plain lists, one rule between them.
 */

const DOES = [
  "Reads one video per report, long-form or Shorts, with the checkpoints and thresholds that match the format.",
  "Aligns every retention drop and rewatch to the transcript line at that second.",
  "Separates a packaging failure from a distribution failure before recommending a title change.",
  "Compares against your own best video in the same subject, not a category benchmark.",
  "Checks your title, description, and tags against the search terms viewers actually arrived on.",
  "Ends each finding with one instruction, so the next upload tests one change.",
];

const DOES_NOT = [
  "Look at your footage. Analysis runs on API metrics, retention curves, and transcripts only — no frames are processed and nothing leaves YouTube.",
  "Write or publish anything. Access is read-only: ViuPace never posts, never edits metadata, never uploads.",
  "Score your channel. There is no grade, no health number, no leaderboard.",
  "Predict views. It explains a video that already ran; it does not forecast one that has not.",
  "Track other creators' private data. Comparisons use your channel and publicly available context.",
];

function List({
  stamp,
  heading,
  items,
}: {
  stamp: string;
  heading: string;
  items: string[];
}) {
  return (
    <div className="bg-paper p-6 sm:p-8">
      <span
        className="text-[0.6875rem] font-medium tracking-[0.08em] text-ink-muted uppercase"
        style={{ fontFamily: MONO }}
      >
        {stamp}
      </span>
      <h3 className="mt-3 text-[1.375rem] leading-[1.25] font-semibold tracking-[-0.02em] text-ink">
        {heading}
      </h3>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li
            key={item}
            className="border-t border-rule pt-3.5 text-[0.875rem] leading-relaxed text-ink-secondary first:border-t-0 first:pt-0"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Scope() {
  return (
    <section id="scope" className="border-b border-rule">
      <div className="mx-auto max-w-[72rem] px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-[62ch]">
          <h2 className="text-[1.75rem] leading-[1.2] font-semibold tracking-[-0.025em] text-balance text-ink">
            What is in scope, and what is not
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-ink-secondary">
            A report is only worth reading if you know what the instrument can
            see. Here is the whole boundary.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-rule bg-rule lg:grid-cols-2">
          <List stamp="In scope" heading="What ViuPace does" items={DOES} />
          <List
            stamp="Out of scope"
            heading="What ViuPace does not do"
            items={DOES_NOT}
          />
        </div>
      </div>
    </section>
  );
}
