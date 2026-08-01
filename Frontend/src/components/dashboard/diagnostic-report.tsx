import { BoredomLocatorSection } from "./boredom-locator";
import { ViralityBlueprintSection } from "./virality-blueprint";
import { EarlyDropSection } from "./early-drop";
import { FlopFinderChart } from "./flop-finder";
import { DiscoverabilitySection } from "./discoverability";
import { AssetRescueSection } from "./asset-rescue";
import { LackingReportSection } from "./lacking-report";
import { AudienceBehaviorPanel } from "./audience-behavior";
import { RecommendationField } from "./recommendation-field";
import { ContentTypeMark } from "./content-type-mark";
import {
  STATUS_LABEL,
  formatCount,
  formatTimecode,
  type DiagnosticReport,
} from "@/lib/mock/diagnostics";

/**
 * The seven findings, in the fixed order the docket presents them. The order is
 * the argument — retention first, then packaging, then discovery, then the
 * comparison — so findings stack in a single spine and are never placed side by
 * side.
 */
const FINDINGS = [
  {
    n: "01",
    title: "Boredom Locator",
    blurb: "Where attention broke, and what was on screen.",
  },
  {
    n: "02",
    title: "Virality Blueprint",
    blurb: "What worked, and how much of the audience saw it.",
  },
  {
    n: "03",
    title: "Early Drop AI Diagnostic",
    blurb: "Whether the opening cleared the gate this format is held to.",
  },
  {
    n: "04",
    title: "Flop Finder",
    blurb: "Whether packaging converted the reach it was given.",
  },
  {
    n: "05",
    title: "Discoverability Report",
    blurb: "What people searched, and whether the metadata answers it.",
  },
  {
    n: "06",
    title: "Asset Rescue Engine",
    blurb: "Replacement titles and thumbnail concepts, when packaging is the gap.",
  },
  {
    n: "07",
    title: "Lacking Report",
    blurb: "What your best video in this sub-niche did differently.",
  },
] as const;

export function DiagnosticReportView({ report }: { report: DiagnosticReport }) {
  return (
    <article className="mx-auto max-w-[58rem] px-6 py-10 lg:px-10 lg:py-12">
      {/* Verdict first — the probable cause, before any evidence */}
      <header className="border-b border-rule pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <ContentTypeMark
            contentType={report.contentType}
            earlyDropWindow={report.boredomLocator.earlyDropWindow}
          />
          <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-ink-muted uppercase">
            {STATUS_LABEL[report.status]}
          </span>
          <span aria-hidden className="text-rule-strong">
            /
          </span>
          <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-ink-muted uppercase">
            {report.confidence} confidence
          </span>
        </div>

        <h2 className="mt-4 text-[1.75rem] leading-[1.2] font-semibold tracking-[-0.025em] text-balance">
          {report.probableCause}
        </h2>

        <p className="mt-4 text-[0.9375rem] text-ink-secondary">{report.title}</p>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[0.75rem]">
          {[
            ["Runtime", formatTimecode(report.durationSeconds)],
            ["Views", formatCount(report.views)],
            [
              "vs channel median",
              `${report.vsChannelMedian > 0 ? "+" : ""}${report.vsChannelMedian}%`,
            ],
            ["Published", report.publishedAt],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
                {label}
              </dt>
              <dd className="mt-1 text-[0.8125rem] text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* FINDING 01 — Boredom Locator */}
      <Finding index={0}>
        <BoredomLocatorSection
          data={report.boredomLocator}
          durationSeconds={report.durationSeconds}
          contentType={report.contentType}
        />
        <RecommendationField rec={report.boredomLocator.recommendation} index={0} />
      </Finding>

      {/* FINDING 02 — Virality Blueprint */}
      <Finding index={1}>
        <ViralityBlueprintSection
          data={report.viralityBlueprint}
          contentType={report.contentType}
        />
        <RecommendationField
          rec={report.viralityBlueprint.recommendation}
          index={1}
        />
      </Finding>

      {/* FINDING 03 — Early Drop AI Diagnostic, with the cohort panel that
          reads the same checkpoint. Supporting, so it sits inside the finding
          and carries no stamp of its own. */}
      <Finding index={2}>
        <EarlyDropSection data={report.earlyDrop} contentType={report.contentType} />
        <AudienceBehaviorPanel data={report.audienceBehavior} />
        <RecommendationField rec={report.earlyDrop.recommendation} index={2} />
      </Finding>

      {/* FINDING 04 — Flop Finder (covers thumbnail and title CTR diagnosis) */}
      <Finding index={3}>
        <FlopFinderChart data={report.flopFinder} contentType={report.contentType} />
        <RecommendationField rec={report.flopFinder.recommendation} index={3} />
      </Finding>

      {/* FINDING 05 — Discoverability Report */}
      <Finding index={4}>
        <DiscoverabilitySection data={report.discoverability} />
        <RecommendationField
          rec={report.discoverability.recommendation}
          index={4}
        />
      </Finding>

      {/* FINDING 06 — Asset Rescue Engine */}
      <Finding index={5}>
        <AssetRescueSection data={report.assetRescue} />
        <RecommendationField rec={report.assetRescue.recommendation} index={5} />
      </Finding>

      {/* FINDING 07 — Lacking Report */}
      <Finding index={6}>
        <LackingReportSection data={report.lackingReport} />
        <RecommendationField rec={report.lackingReport.recommendation} index={6} />
      </Finding>
    </article>
  );
}

function Finding({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const meta = FINDINGS[index];
  return (
    <section className="border-b border-rule py-10 last:border-b-0">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-muted tabular-nums">
          FINDING {meta.n}
        </span>
        <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em]">
          {meta.title}
        </h3>
      </div>
      <p className="mt-1.5 text-[0.8125rem] text-ink-secondary">{meta.blurb}</p>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}
