import type { ReactNode } from "react";
import { ThresholdMini } from "./visuals/threshold-mini";
import { BlueprintMini } from "./visuals/blueprint-mini";
import { FlopMini } from "./visuals/flop-mini";
import { RescueMini } from "./visuals/rescue-mini";
import { LackingMini } from "./visuals/lacking-mini";
import { CoverageMini } from "./visuals/coverage-mini";

/**
 * The six MVP features, in the order a real report reads them. Findings stack in
 * one spine and are never placed side by side, because the order is the argument:
 * did the opening hold, what worked, was it seen, was the packaging at fault,
 * what does the fix look like, and what did the video that worked do differently.
 *
 * The exhibit inside each section carries the section's one stamp, so no heading
 * here wears a second uppercase designator.
 */

function Finding({
  title,
  children,
  figure,
}: {
  title: string;
  children: ReactNode;
  figure: ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-10 first:border-t-0 first:pt-0">
      <h3 className="text-[1.375rem] leading-[1.25] font-semibold tracking-[-0.02em] text-ink">
        {title}
      </h3>
      <div className="mt-4 max-w-[68ch] space-y-3 text-[0.9375rem] leading-relaxed text-ink-secondary">
        {children}
      </div>
      <div className="mt-8">{figure}</div>
    </section>
  );
}

export function Findings() {
  return (
    <section id="report" className="border-b border-rule">
      <div className="mx-auto max-w-[72rem] px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-[62ch]">
          <h2 className="text-[1.75rem] leading-[1.2] font-semibold tracking-[-0.025em] text-balance text-ink">
            What one report actually says
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-ink-secondary">
            Below is every exhibit from a real diagnostic, run on a 14-minute
            workshop build that got 18,420 views against a channel average of
            41,000. Same numbers, same order, same wording you would see on your
            own video.
          </p>
        </div>

        <div className="mt-14 space-y-10">
          <Finding
            title="Did the opening hold?"
            figure={<ThresholdMini />}
          >
            <p>
              The first check is the one most tools get wrong by applying a single
              rule to every video. A long-form video is measured on the first 30
              seconds; a Short is measured on the first 3 to 5, because a swipe is
              a faster decision than a back button.
            </p>
            <p>
              When the opening passes, ViuPace says so and stops recommending an
              intro rewrite. Being told your hook is fine is the finding.
            </p>
          </Finding>

          <Finding
            title="Where did viewers leave, and what was being said?"
            figure={<BlueprintMini />}
          >
            <p>
              Retention is read at multiple checkpoints and every drop is aligned
              to the transcript at that exact second, so a drop stops being a dip
              in a chart and becomes a named cause: 90 seconds of backstory, a
              slow tool change, a claim with no number attached.
            </p>
            <p>
              The reverse works too. Rewatched segments are the only unambiguous
              signal of what your audience wants more of, and there is usually
              just one in a 14-minute video.
            </p>
          </Finding>

          <Finding
            title="Was the video even shown to people?"
            figure={<FlopMini />}
          >
            <p>
              High impressions with a low click rate is a different failure from
              low impressions, and it needs a different fix. One is packaging, the
              other is the video. Separating them is the whole point of this
              check, because rewriting a title cannot save a video nobody was
              offered.
            </p>
          </Finding>

          <Finding
            title="What should the packaging have been?"
            figure={<RescueMini />}
          >
            <p>
              This runs only when the previous check pinned the failure on the
              title and thumbnail. It writes three replacements with the reasoning
              behind each, names the one to try first, and tells you to change
              nothing else for two weeks so the result stays readable.
            </p>
          </Finding>

          <Finding
            title="What did your video that worked do differently?"
            figure={<LackingMini />}
          >
            <p>
              The comparison is against your own best video in the same subject,
              long-form against long-form and Shorts against Shorts. Not a
              category benchmark, not a competitor, because you already proved
              what works on your channel once.
            </p>
          </Finding>

          <Finding
            title="Which searches were you missing?"
            figure={<CoverageMini />}
          >
            <p>
              The terms bringing viewers in are matched against the three fields
              you control. Anything arriving from a phrase that appears nowhere in
              your title, description, or tags is reach you got by accident and
              can get on purpose next time.
            </p>
          </Finding>
        </div>
      </div>
    </section>
  );
}
