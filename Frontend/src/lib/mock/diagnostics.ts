/**
 * Demonstration data for the diagnosis workspace.
 *
 * Every value here is SYNTHETIC and authored for design review — no YouTube API
 * call exists yet. Metrics are internally consistent (retention curves integrate
 * to their stated average view duration, CTR matches impressions/views) so the
 * report reads truthfully, but no figure describes a real channel or video.
 * Replace this module with the API client when the backend lands.
 */

export type ContentType = "long-form" | "shorts";

export type VideoStatus = "flagged" | "underperforming" | "healthy";

/** A sampled point on the audience-retention curve. */
export interface RetentionPoint {
  /** Seconds from playback start. */
  t: number;
  /** Percent of viewers still watching. */
  r: number;
}

/**
 * A stretch of the curve the analyzer classified. Bounds are inclusive
 * timestamps in seconds and always align to sampled points.
 */
export interface RetentionSegment {
  kind: "drop" | "rewatch";
  from: number;
  to: number;
  /** Percentage points of audience lost (drop) or regained (rewatch). */
  delta: number;
  /** Transcript at this timestamp — the cross-reference that names the cause. */
  transcript: string;
  /** What the analyzer concluded from the transcript plus the curve shape. */
  reading: string;
}

/** A content-type-aware retention checkpoint. */
export interface Checkpoint {
  label: string;
  /** Seconds from start. */
  at: number;
  /** Retention floor this content type is expected to hold at `at`. */
  threshold: number;
  /** Measured retention at `at`. */
  measured: number;
}

export interface Recommendation {
  /** Short imperative — the action itself. */
  action: string;
  /** Why this fix follows from the evidence above it. */
  rationale: string;
  /** The concrete asset: a rewritten line, a pacing note, a thumbnail concept. */
  asset?: { label: string; body: string };
  /** Optional second and third options, for packaging fixes. */
  alternates?: string[];
}

export interface BoredomLocator {
  /** Percentage of the audience lost inside the early-drop window. */
  earlyDropPct: number;
  /** The early-drop window for this content type, in seconds. */
  earlyDropWindow: number;
  /** The content-type threshold the early-drop check uses. */
  earlyDropThreshold: number;
  curve: RetentionPoint[];
  segments: RetentionSegment[];
  checkpoints: Checkpoint[];
  /** Channel-average retention curve for the same content type, for reference. */
  reference: RetentionPoint[];
  recommendation: Recommendation;
}

export interface FlopFinder {
  impressions: number;
  views: number;
  ctr: number;
  channelAvgCtr: number;
  nicheMedianCtr: number;
  /** Impressions percentile against the channel's own catalogue. */
  impressionsPercentile: number;
  verdict: string;
  recommendation: Recommendation;
}

export interface LackingRow {
  metric: string;
  unit: string;
  /** This video's value. */
  value: number;
  /** The reference video's value. */
  referenceValue: number;
  /** Row-local scale so each metric keeps its own units. */
  scale: { min: number; max: number };
  /** True when a higher number is the better outcome. */
  higherIsBetter: boolean;
  note: string;
}

export interface LackingReport {
  subNiche: string;
  reference: {
    title: string;
    thumbnail: string;
    publishedAt: string;
    views: number;
  };
  rows: LackingRow[];
  recommendation: Recommendation;
}

/**
 * The positive half of the retention curve. Spike thresholds are content-type
 * aware — Shorts swing harder by construction, so a segment has to clear a
 * taller bar there before it counts as a rewatch event.
 */
export interface ViralityBlueprint {
  /** Percentage-point gain a segment must clear to register as a spike. */
  spikeThreshold: number;
  /** Share of playbacks that reached the strongest spike. */
  reachedShare: number;
  /** The rewatch segments lifted out of the retention curve. */
  spikes: RetentionSegment[];
  /** What the spikes have in common — the reusable pattern. */
  pattern: string;
  recommendation: Recommendation;
}

/**
 * The content-type-aware opening gate. Long-form is judged on the first 30
 * seconds, Shorts on the first 3–5, because the swipe decision arrives sooner.
 */
export interface EarlyDrop {
  /** Window length in seconds for this content type. */
  window: number;
  /** Percentage points lost inside the window. */
  pct: number;
  /** Ceiling on points lost that this content type is held to. */
  threshold: number;
  /** Retention still held at the end of the window. */
  measured: number;
  /** Points the channel's own average curve loses over the same window. */
  channelAvgPct: number;
  verdict: string;
  recommendation: Recommendation;
}

/**
 * Supporting panel, not a headline finding: one cohort comparison read at the
 * early-drop checkpoint. New against returning is the only split shown — this
 * is deliberately not a demographics breakdown.
 */
export interface AudienceBehavior {
  /** The checkpoint both cohorts are read at, in seconds. */
  at: number;
  cohorts: {
    label: string;
    /** Share of this video's audience. */
    share: number;
    /** Retention at `at`, percent. Weighted by share, these reconcile to the curve. */
    retention: number;
    /** The cohort the reading turns on, drawn in ink rather than neutral gray. */
    emphasis: boolean;
  }[];
  reading: string;
}

/**
 * One search query bringing traffic to this video, with per-field coverage.
 * A field counts as covered when the phrase, or a close variant of it, appears
 * there — the same match the ingestion layer will run against the real metadata.
 */
export interface SearchTerm {
  term: string;
  /** Share of this video's search traffic. */
  share: number;
  views: number;
  inTitle: boolean;
  inDescription: boolean;
  inTags: boolean;
}

export interface Discoverability {
  /** Share of total views arriving from YouTube search. */
  searchShare: number;
  /** The other named traffic sources, for context on how much search can move. */
  otherSources: { label: string; share: number }[];
  title: string;
  description: string;
  tags: string[];
  terms: SearchTerm[];
  recommendation: Recommendation;
}

/**
 * Generated packaging alternatives. The engine is gated on Flop Finder: it only
 * runs when CTR is the measured gap, so a video whose packaging is already
 * converting gets a stand-down instead of three titles it does not need.
 */
export interface AssetRescue {
  eligible: boolean;
  /** Why the engine ran, or why it stood down. */
  gate: string;
  titles: { text: string; angle: string }[];
  thumbnails: { label: string; body: string }[];
  recommendation: Recommendation;
}

export interface VideoSummary {
  id: string;
  title: string;
  thumbnail: string;
  contentType: ContentType;
  status: VideoStatus;
  /** Human-readable duration, e.g. "14:32" or "0:47". */
  duration: string;
  /** Duration in seconds — the retention x-axis domain. */
  durationSeconds: number;
  publishedAt: string;
  views: number;
  /** Percent difference against the channel's median for this content type. */
  vsChannelMedian: number;
}

/**
 * The seven report features, in the fixed order the docket presents them.
 * `audienceBehavior` is deliberately not in this list — it is a supporting
 * panel inside the report, not a numbered finding.
 */
export interface DiagnosticReport extends VideoSummary {
  /** The single-sentence verdict the report leads with. */
  probableCause: string;
  /** Which diagnostic carries the primary failure. */
  primaryFailure: "retention" | "packaging" | "structure";
  confidence: "high" | "moderate" | "low";
  boredomLocator: BoredomLocator;
  viralityBlueprint: ViralityBlueprint;
  earlyDrop: EarlyDrop;
  flopFinder: FlopFinder;
  discoverability: Discoverability;
  assetRescue: AssetRescue;
  lackingReport: LackingReport;
  /** Supporting panel, read at the early-drop checkpoint. */
  audienceBehavior: AudienceBehavior;
}

export const channel = {
  name: "Fieldnote Workshop",
  handle: "@fieldnoteworkshop",
  subscribers: 84200,
  avatar:
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=96&h=96&q=70",
  /** Sub-niche the analyzer matched this channel into. */
  subNiche: "Small-workshop build documentation",
} as const;

/**
 * Channel-level counters for the overview strip, over a trailing 28-day window.
 * These are channel context above the divider, not a report: no deltas, no
 * sparklines, no trend arrows. The diagnosis still lives in the report column.
 */
export const channelOverview = {
  windowDays: 28,
  totalViews: 1284000,
  /** Watch time in hours — the unit YouTube Studio reports it in. */
  watchTimeHours: 62400,
  subscribersGained: 3820,
  /** Channel-wide impressions CTR, percent. */
  averageCtr: 5.2,
} as const;

const LONG_FORM_DURATION = 872; // 14:32

/**
 * Long-form retention: holds through a cold open, bleeds across a 90-second
 * sponsor-and-context block at 4:10, recovers slightly at the first real build
 * step, and settles low. Sampled every ~22s.
 */
const longFormCurve: RetentionPoint[] = [
  { t: 0, r: 100 },
  { t: 10, r: 93.4 },
  { t: 20, r: 84.1 },
  { t: 30, r: 76.8 },
  { t: 45, r: 72.5 },
  { t: 65, r: 70.1 },
  { t: 90, r: 68.4 },
  { t: 120, r: 66.9 },
  { t: 150, r: 65.2 },
  { t: 180, r: 63.8 },
  { t: 210, r: 62.1 },
  { t: 240, r: 60.6 },
  { t: 250, r: 59.8 },
  { t: 265, r: 54.2 },
  { t: 280, r: 49.6 },
  { t: 300, r: 45.1 },
  { t: 320, r: 41.8 },
  { t: 340, r: 39.4 },
  { t: 360, r: 37.9 },
  { t: 390, r: 36.8 },
  { t: 420, r: 35.9 },
  { t: 450, r: 35.1 },
  { t: 462, r: 35.4 },
  { t: 474, r: 38.9 },
  { t: 486, r: 41.2 },
  { t: 498, r: 39.6 },
  { t: 510, r: 36.4 },
  { t: 540, r: 34.2 },
  { t: 570, r: 32.6 },
  { t: 600, r: 31.1 },
  { t: 640, r: 29.4 },
  { t: 680, r: 27.8 },
  { t: 720, r: 26.2 },
  { t: 760, r: 24.6 },
  { t: 800, r: 23.1 },
  { t: 836, r: 21.8 },
  { t: 872, r: 20.4 },
];

/** Channel-average long-form curve — the reference trace. */
const longFormReference: RetentionPoint[] = [
  { t: 0, r: 100 },
  { t: 30, r: 82.6 },
  { t: 90, r: 74.2 },
  { t: 180, r: 68.1 },
  { t: 250, r: 63.4 },
  { t: 300, r: 60.2 },
  { t: 360, r: 56.8 },
  { t: 450, r: 52.4 },
  { t: 540, r: 48.1 },
  { t: 640, r: 43.6 },
  { t: 760, r: 38.2 },
  { t: 872, r: 33.9 },
];

const SHORTS_DURATION = 47;

/**
 * Shorts retention: the decision window is the first 3–5 seconds, so the curve
 * is sampled every second through the hook. Loses a third of the audience before
 * the payoff is stated, then holds and loops.
 */
const shortsCurve: RetentionPoint[] = [
  { t: 0, r: 100 },
  { t: 1, r: 91.2 },
  { t: 2, r: 78.4 },
  { t: 3, r: 66.1 },
  { t: 4, r: 61.8 },
  { t: 5, r: 59.2 },
  { t: 6, r: 57.6 },
  { t: 8, r: 55.1 },
  { t: 10, r: 53.4 },
  { t: 12, r: 52.2 },
  { t: 14, r: 51.1 },
  { t: 16, r: 50.2 },
  { t: 18, r: 49.4 },
  { t: 20, r: 48.6 },
  { t: 23, r: 47.5 },
  { t: 26, r: 46.4 },
  { t: 29, r: 45.6 },
  { t: 32, r: 45.1 },
  { t: 35, r: 44.8 },
  { t: 38, r: 46.2 },
  { t: 40, r: 49.8 },
  { t: 42, r: 53.1 },
  { t: 44, r: 51.2 },
  { t: 45, r: 47.6 },
  { t: 46, r: 43.2 },
  { t: 47, r: 38.4 },
];

const shortsReference: RetentionPoint[] = [
  { t: 0, r: 100 },
  { t: 3, r: 81.4 },
  { t: 5, r: 74.2 },
  { t: 10, r: 68.1 },
  { t: 16, r: 63.8 },
  { t: 23, r: 60.2 },
  { t: 32, r: 57.4 },
  { t: 40, r: 56.1 },
  { t: 47, r: 49.8 },
];

const longFormReport: DiagnosticReport = {
  id: "vid_9fbc21",
  title: "I Rebuilt My Entire Workshop for $900",
  thumbnail:
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=320&h=180&q=70",
  contentType: "long-form",
  status: "flagged",
  duration: "14:32",
  durationSeconds: LONG_FORM_DURATION,
  publishedAt: "2026-07-18",
  views: 18420,
  vsChannelMedian: -61,
  probableCause:
    "Packaging carried the impressions; a 90-second context block at 4:10 lost the audience that clicked.",
  primaryFailure: "retention",
  confidence: "high",
  boredomLocator: {
    earlyDropPct: 23.2,
    earlyDropWindow: 30,
    earlyDropThreshold: 30,
    curve: longFormCurve,
    reference: longFormReference,
    segments: [
      {
        kind: "drop",
        from: 250,
        to: 340,
        delta: -20.4,
        transcript:
          "…before I get into the build, a bit of history: this space used to be a single-car garage, and back in 2019 when I first moved in I had almost no tools at all, just a circular saw and…",
        reading:
          "Narration turns retrospective 4 minutes in, before any build step is shown. 20.4 points lost across 90 seconds with no cut, no on-screen change, and no restatement of the payoff.",
      },
      {
        kind: "rewatch",
        from: 462,
        to: 498,
        delta: +5.8,
        transcript:
          "…and that's the whole bench, flat to within half a millimetre, for thirty-one dollars in plywood.",
        reading:
          "The one measured, quantified result in the video. Viewers scrubbed back to re-read the number on screen.",
      },
    ],
    checkpoints: [
      { label: "0:30 hook", at: 30, threshold: 70, measured: 76.8 },
      { label: "1:30 setup", at: 90, threshold: 62, measured: 68.4 },
      { label: "4:00 mid", at: 240, threshold: 55, measured: 60.6 },
      { label: "6:00 mid-late", at: 360, threshold: 48, measured: 37.9 },
      { label: "10:00 late", at: 600, threshold: 38, measured: 31.1 },
      { label: "End", at: 872, threshold: 28, measured: 20.4 },
    ],
    recommendation: {
      action: "Cut 4:10–5:40 and move the bench result to 3:55.",
      rationale:
        "The 90-second history block sits between the click and the first payoff. The segment viewers rewatched at 7:42 is the one that should arrive before the mid-video checkpoint.",
      asset: {
        label: "Pacing note for the next edit",
        body: "Open the build within 45 seconds. Put the flat-to-half-a-millimetre bench result at 3:55, where retention is still above 60%. Any backstory that survives gets cut to two sentences and moved after the first finished piece — never before it.",
      },
    },
  },
  viralityBlueprint: {
    // Long-form curves are smoother than Shorts, so a smaller gain still counts.
    spikeThreshold: 4,
    reachedShare: 35.4,
    spikes: [
      {
        kind: "rewatch",
        from: 462,
        to: 498,
        delta: +5.8,
        transcript:
          "…and that's the whole bench, flat to within half a millimetre, for thirty-one dollars in plywood.",
        reading:
          "The only quantified result in 14 minutes. 5.8 points of recovery against a 4-point threshold, and the shape is scrub-back traffic: viewers returned to re-read the tolerance and the price on screen.",
      },
    ],
    pattern:
      "The single spike is a number said out loud while the same number is on screen. Retention recovers where a claim becomes measurable, and nowhere else in the video does that happen.",
    recommendation: {
      action: "Write the next build around seven quantified beats and put each number on screen as it is said.",
      rationale:
        "Only 35.4% of playbacks reached the one moment that worked. The pattern is reusable — it just needs to arrive while the audience is still present.",
      asset: {
        label: "Reusable beat",
        body: "State a price, a tolerance, or a time saved, and cut to the number on screen in the same breath. Place the first one before 0:45 and repeat every two minutes. The bench line at 7:42 is the template: claim, number, proof, cut.",
      },
    },
  },
  earlyDrop: {
    // Long-form is judged on the first 30 seconds.
    window: 30,
    pct: 23.2,
    threshold: 30,
    measured: 76.8,
    channelAvgPct: 17.4,
    verdict:
      "23.2 points lost inside the 30-second window, under the 30-point ceiling for long-form. The opening is not the failure — it runs 5.8 points behind the channel average, which is inside normal variance. The audience this video lost, it lost at 4:10.",
    recommendation: {
      action: "Leave the intro alone and spend the edit on 4:10–5:40 instead.",
      rationale:
        "The hook cleared its gate. Rewriting an opening that already holds 76.8% would spend effort where there is no measured gap, while the 20.4-point bleed four minutes in goes unaddressed.",
    },
  },
  flopFinder: {
    impressions: 412000,
    views: 18420,
    ctr: 3.1,
    channelAvgCtr: 6.4,
    nicheMedianCtr: 5.8,
    impressionsPercentile: 88,
    verdict:
      "Impressions landed in the channel's top 12%, so distribution was not the constraint. CTR came in 3.3 points under the channel average — the thumbnail and title did not convert the reach they were given.",
    recommendation: {
      action: "Reshoot the thumbnail around the $900 figure and the finished bench.",
      rationale:
        "The current thumbnail shows the room mid-clearout, before anything is built. The number is the only claim in the title doing work, and it appears nowhere in the image.",
      asset: {
        label: "Thumbnail concept",
        body: "Finished bench, shot square-on at eye level, warm work light from the left. “$900” set large in the top-right third over the empty wall, no face, no arrow, no outline. The build result and the price are the only two things in frame.",
      },
      alternates: [
        "The $900 Workshop (Everything Is Plywood)",
        "I Built a Whole Workshop for the Price of One Table Saw",
        "$900 Workshop: Flat to Half a Millimetre",
      ],
    },
  },
  discoverability: {
    searchShare: 21.4,
    otherSources: [
      { label: "Browse features", share: 44.8 },
      { label: "Suggested videos", share: 26.1 },
      { label: "External", share: 7.7 },
    ],
    title: "I Rebuilt My Entire Workshop for $900",
    description:
      "I rebuilt my whole workshop on a tight budget this month. Full tour at the end, plus the bench build. Tools I use are linked below. Thanks for watching, and let me know what you want to see next.",
    tags: ["workshop", "diy", "woodworking", "shop tour", "budget build"],
    terms: [
      {
        term: "cheap workshop bench build",
        share: 31.2,
        views: 1230,
        inTitle: false,
        inDescription: false,
        inTags: false,
      },
      {
        term: "plywood workbench plans",
        share: 22.6,
        views: 891,
        inTitle: false,
        inDescription: false,
        inTags: false,
      },
      {
        term: "small garage workshop setup",
        share: 18.4,
        views: 725,
        inTitle: false,
        inDescription: false,
        inTags: true,
      },
      {
        term: "budget workshop on a budget",
        share: 15.1,
        views: 596,
        inTitle: false,
        inDescription: true,
        inTags: true,
      },
      {
        term: "diy workbench flat",
        share: 12.7,
        views: 501,
        inTitle: false,
        inDescription: false,
        inTags: false,
      },
    ],
    recommendation: {
      action: "Name the bench build in the first line of the description and add the four bench tags.",
      rationale:
        "The two queries bringing the most search traffic are both about the bench, and neither the title, the description, nor the tags mention a bench at all. Search is finding this video despite the metadata, not because of it.",
      asset: {
        label: "Description opening + tags to add",
        body: "First line: “A flat plywood workbench, built for $31 in material, inside a $900 small-garage workshop rebuild — full bench plans and cut list below.” Add tags: plywood workbench, workbench build, cheap workshop bench, diy workbench plans. Drop “diy” on its own; it is too broad to rank and it is already implied.",
      },
    },
  },
  assetRescue: {
    eligible: true,
    gate:
      "Flop Finder measured CTR 3.3 points under the channel average on top-12% impressions, so packaging is the confirmed gap. The engine ran.",
    titles: [
      {
        text: "The $900 Workshop (Everything Is Plywood)",
        angle: "Leads on the price, then names the constraint that makes it credible.",
      },
      {
        text: "I Built a Whole Workshop for the Price of One Table Saw",
        angle: "Comparison hook — reframes the number against something the audience already prices.",
      },
      {
        text: "$900 Workshop: Flat to Half a Millimetre",
        angle: "Pairs the price with the tolerance claim that produced the video's one rewatch spike.",
      },
    ],
    thumbnails: [
      {
        label: "Concept A — the result, priced",
        body: "Finished bench square-on at eye level, warm work light from the left. “$900” set large in the top-right third over the empty wall. No face, no arrow, no outline.",
      },
      {
        label: "Concept B — the tolerance",
        body: "Close crop on a straightedge across the benchtop with a feeler gauge at the gap. “0.5mm” in the corner. Sells precision rather than price, matching the rewatched moment.",
      },
      {
        label: "Concept C — before and after",
        body: "Hard vertical split: cleared garage left, finished workshop right, same camera position and focal length so the change reads instantly. “$900” on the seam.",
      },
    ],
    recommendation: {
      action: "Ship Concept A with the first title, and hold Concept B for the follow-up.",
      rationale:
        "The current thumbnail shows the room mid-clearout, before anything is built, so the only claim doing work is a number that appears nowhere in the image. Concept A puts the result and the price in the same frame.",
      asset: {
        label: "Swap to run",
        body: "Replace the thumbnail with Concept A and the title with “The $900 Workshop (Everything Is Plywood)”. Leave the video untouched for 14 days and compare impressions CTR against the 6.4% channel average before changing anything else — one variable at a time or the read is worthless.",
      },
      // No `alternates` here: the three titles are the evidence of this finding
      // and are already listed above with their angles. This recommendation
      // names which one to ship rather than reprinting the list.
    },
  },
  audienceBehavior: {
    at: 240,
    cohorts: [
      { label: "New viewers", share: 68, retention: 54.1, emphasis: true },
      { label: "Returning viewers", share: 32, retention: 74.5, emphasis: false },
    ],
    reading:
      "At the 4:00 checkpoint, returning viewers held 20.4 points higher than new ones. The history block that opens at 4:10 is context your subscribers already have — the 68% of this audience meeting you for the first time left during it.",
  },
  lackingReport: {
    subNiche: "Small-workshop build documentation",
    reference: {
      title: "Every Jig I Use, Built in One Weekend",
      thumbnail:
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=320&h=180&q=70",
      publishedAt: "2026-04-02",
      views: 214800,
    },
    rows: [
      {
        metric: "Time to first build step",
        unit: "m:ss",
        value: 262,
        referenceValue: 38,
        scale: { min: 0, max: 300 },
        higherIsBetter: false,
        note: "The reference video starts cutting material before the title card.",
      },
      {
        metric: "Cuts per minute",
        unit: "cuts",
        value: 4.2,
        referenceValue: 11.6,
        scale: { min: 0, max: 14 },
        higherIsBetter: true,
        note: "Long static takes over narration; the reference cuts on every completed action.",
      },
      {
        metric: "Quantified claims",
        unit: "claims",
        value: 3,
        referenceValue: 14,
        scale: { min: 0, max: 16 },
        higherIsBetter: true,
        note: "Measurements and prices on screen. Your one rewatch spike was a quantified claim.",
      },
      {
        metric: "Average view duration",
        unit: "m:ss",
        value: 214,
        referenceValue: 486,
        scale: { min: 0, max: 540 },
        higherIsBetter: true,
        note: "Reference holds viewers 4.5 minutes longer at a comparable length.",
      },
    ],
    recommendation: {
      action: "Front-load one quantified result per two minutes of runtime.",
      rationale:
        "Both videos cover the same sub-niche at a similar length. The reference carries 14 on-screen numbers to your 3, and your single retention recovery came at your only measurement.",
      asset: {
        label: "Structure note",
        body: "Storyboard the next build as seven quantified beats — a price, a tolerance, or a time saved every two minutes. Show each number on screen as it is said. Cut any passage longer than 40 seconds that contains no measurable claim.",
      },
    },
  },
};

const shortsReport: DiagnosticReport = {
  id: "vid_4ad70e",
  title: "The $12 clamp trick nobody shows you",
  thumbnail:
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=320&h=180&q=70",
  contentType: "shorts",
  status: "flagged",
  duration: "0:47",
  durationSeconds: SHORTS_DURATION,
  publishedAt: "2026-07-26",
  views: 42600,
  vsChannelMedian: -44,
  probableCause:
    "A third of the audience left inside the first 3 seconds — the trick is named at 0:06, four seconds after the swipe decision was made.",
  primaryFailure: "retention",
  confidence: "high",
  boredomLocator: {
    earlyDropPct: 33.9,
    earlyDropWindow: 3,
    earlyDropThreshold: 25,
    curve: shortsCurve,
    reference: shortsReference,
    segments: [
      {
        kind: "drop",
        from: 0,
        to: 3,
        delta: -33.9,
        transcript: "Hey — so, quick one today. I get asked about clamps a lot, and…",
        reading:
          "Three seconds of greeting and framing before the subject appears. Shorts viewers decide inside this window; 33.9 points lost against a 25-point threshold.",
      },
      {
        kind: "rewatch",
        from: 38,
        to: 44,
        delta: +8.3,
        transcript: "— and it holds a mitre square without touching the face.",
        reading:
          "The payoff frame. The spike past 100% of the preceding second is loop-back traffic: viewers replayed the reveal.",
      },
    ],
    checkpoints: [
      { label: "0:03 swipe", at: 3, threshold: 75, measured: 66.1 },
      { label: "0:05 hook", at: 5, threshold: 68, measured: 59.2 },
      { label: "0:10 hold", at: 10, threshold: 58, measured: 53.4 },
      { label: "0:20 mid", at: 20, threshold: 50, measured: 48.6 },
      { label: "0:35 payoff", at: 35, threshold: 44, measured: 44.8 },
      { label: "Loop", at: 47, threshold: 40, measured: 38.4 },
    ],
    recommendation: {
      action: "Open on the clamp already holding the mitre square. Cut the greeting entirely.",
      rationale:
        "The frame viewers looped back to at 0:38 is the frame that should be at 0:00. Nothing before 0:06 shows the subject.",
      asset: {
        label: "First-second rewrite",
        body: "Frame 1: the clamp holding the square, mid-shot, already in tension. Voice starts on the claim, not the greeting — “This holds a mitre square without touching the face.” Name the $12 price at 0:02, demonstrate by 0:04.",
      },
    },
  },
  viralityBlueprint: {
    // Shorts swing harder by construction, so the bar for a spike sits higher.
    spikeThreshold: 7,
    reachedShare: 44.8,
    spikes: [
      {
        kind: "rewatch",
        from: 38,
        to: 44,
        delta: +8.3,
        transcript: "— and it holds a mitre square without touching the face.",
        reading:
          "The payoff frame. The gain past the preceding second is loop-back traffic: viewers replayed the reveal rather than swiping on.",
      },
    ],
    pattern:
      "The single spike is the demonstration itself, with no words over it. Retention rises the moment the clamp does the thing the title promised.",
    recommendation: {
      action: "Make the loop seam the demonstration, not the sign-off.",
      rationale:
        "8.3 points of loop-back on a 47-second Short is a strong signal, and it lands on a silent demonstration. The last three seconds currently break that loop with a verbal outro.",
      asset: {
        label: "Loop seam",
        body: "End on the same frame you open on — clamp in tension on the square. Cut the “thanks for watching” tail entirely so frame 47 matches frame 0 and the replay is seamless.",
      },
    },
  },
  earlyDrop: {
    // Shorts are judged on the swipe window, not the first 30 seconds.
    window: 3,
    pct: 33.9,
    threshold: 25,
    measured: 66.1,
    channelAvgPct: 18.6,
    verdict:
      "33.9 points lost inside the 3-second swipe window, against a 25-point ceiling for Shorts. This is the primary failure: the subject does not appear on screen until 0:06, three seconds after the decision was already made.",
    recommendation: {
      action: "Put the clamp on screen in frame one and cut the greeting.",
      rationale:
        "Nothing before 0:06 shows the subject. The window that decides a Short's distribution closed at 0:03, while the video was still saying hello.",
      asset: {
        label: "First-second rewrite",
        body: "Frame 1: the clamp holding the square, mid-shot, already in tension. Voice starts on the claim — “This holds a mitre square without touching the face.” Price at 0:02, demonstration complete by 0:04.",
      },
    },
  },
  flopFinder: {
    impressions: 1240000,
    views: 42600,
    ctr: 3.4,
    channelAvgCtr: 4.1,
    nicheMedianCtr: 3.9,
    impressionsPercentile: 71,
    verdict:
      "Shorts CTR sits 0.7 points under the channel average — inside normal variance for the format. Packaging is not the primary failure here; the first three seconds are.",
    recommendation: {
      action: "Leave the packaging alone. Fix the opening frame instead.",
      rationale:
        "CTR is within variance and the feed served 1.24M impressions. Rewriting a title that is already converting would spend effort where there is no measured gap.",
    },
  },
  discoverability: {
    // Shorts are a feed format: search moves far less here than on long-form.
    searchShare: 6.8,
    otherSources: [
      { label: "Shorts feed", share: 84.2 },
      { label: "Channel page", share: 5.4 },
      { label: "Suggested videos", share: 3.6 },
    ],
    title: "The $12 clamp trick nobody shows you",
    description: "One clamp, one square, no marring. Full build video linked in the comments.",
    tags: ["shorts", "woodworking", "clamp", "workshop tips"],
    terms: [
      {
        term: "mitre square clamp trick",
        share: 38.4,
        views: 1113,
        inTitle: false,
        inDescription: false,
        inTags: false,
      },
      {
        term: "cheap clamps woodworking",
        share: 27.1,
        views: 785,
        inTitle: false,
        inDescription: false,
        inTags: true,
      },
      {
        term: "how to clamp without marring",
        share: 21.3,
        views: 617,
        inTitle: false,
        inDescription: true,
        inTags: false,
      },
      {
        term: "woodworking clamp hacks",
        share: 13.2,
        views: 382,
        inTitle: false,
        inDescription: false,
        inTags: true,
      },
    ],
    recommendation: {
      action: "Put “mitre square” in the title and add it to the tags.",
      rationale:
        "Search is only 6.8% of this video's traffic, so this is the smaller lever — but the top query names a tool that appears in none of the three metadata fields, and the title's “nobody shows you” carries no query at all.",
      asset: {
        label: "Title + tags to change",
        body: "Title: “The $12 clamp that holds a mitre square”. Add tags: mitre square, clamp trick, no-mar clamping, square clamping jig. Keep the description line as-is — “without marring” is already the only phrase pulling a query.",
      },
    },
  },
  assetRescue: {
    eligible: false,
    gate:
      "Flop Finder measured CTR inside normal variance for Shorts, 0.7 points off the channel average on 1.24M impressions. Packaging is not the gap, so the engine stood down rather than generating three titles this video does not need.",
    titles: [],
    thumbnails: [],
    recommendation: {
      action: "Do not regenerate packaging. Re-run this engine only if the 3-second fix lands and CTR then falls behind.",
      rationale:
        "The feed served this Short 1.24 million impressions and 3.4% of them clicked, which is what a working title does. The measured failure is 33.9 points lost in the swipe window — replacing the title would not move it.",
    },
  },
  audienceBehavior: {
    at: 3,
    cohorts: [
      { label: "New viewers", share: 91, retention: 64.3, emphasis: true },
      { label: "Returning viewers", share: 9, retention: 84.5, emphasis: false },
    ],
    reading:
      "At the 0:03 swipe checkpoint, returning viewers held 20.2 points higher — they wait through a greeting because they know the channel. 91% of this Short's audience does not, and that is the cohort the opening has to earn.",
  },
  lackingReport: {
    subNiche: "Workshop tips (Shorts)",
    reference: {
      title: "Stop cutting plywood like this",
      thumbnail:
        "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=320&h=180&q=70",
      publishedAt: "2026-06-11",
      views: 1840000,
    },
    rows: [
      {
        metric: "Subject on screen by",
        unit: "s",
        value: 6,
        referenceValue: 0,
        scale: { min: 0, max: 8 },
        higherIsBetter: false,
        note: "The reference opens on the mistake itself, mid-cut, with no preamble.",
      },
      {
        metric: "Words before the claim",
        unit: "words",
        value: 17,
        referenceValue: 3,
        scale: { min: 0, max: 20 },
        higherIsBetter: false,
        note: "Seventeen words of greeting cost the swipe decision.",
      },
      {
        metric: "3-second retention",
        unit: "%",
        value: 66.1,
        referenceValue: 89.4,
        scale: { min: 0, max: 100 },
        higherIsBetter: true,
        note: "The single metric that separates these two videos most sharply.",
      },
      {
        metric: "Loop rate",
        unit: "%",
        value: 8.3,
        referenceValue: 22.1,
        scale: { min: 0, max: 26 },
        higherIsBetter: true,
        note: "Your payoff loops; it just arrives too late for most of the audience to see it.",
      },
    ],
    recommendation: {
      action: "Put the payoff frame first and let the explanation follow it.",
      rationale:
        "The reference states its claim in three words over the demonstration. Your video explains for six seconds, then demonstrates.",
      asset: {
        label: "Structure note",
        body: "Demonstrate, then explain — never the reverse in a Short. Frame 1 shows the result, words 1–3 name it, the how-to fills the remaining 40 seconds. Keep the loop-back frame identical to the opening frame so the replay is seamless.",
      },
    },
  },
};

/** The channel's recent uploads, newest first — the video selector's queue. */
export const recentVideos: VideoSummary[] = [
  {
    id: "vid_4ad70e",
    title: "The $12 clamp trick nobody shows you",
    thumbnail: shortsReport.thumbnail,
    contentType: "shorts",
    status: "flagged",
    duration: "0:47",
    durationSeconds: 47,
    publishedAt: "2026-07-26",
    views: 42600,
    vsChannelMedian: -44,
  },
  {
    id: "vid_9fbc21",
    title: "I Rebuilt My Entire Workshop for $900",
    thumbnail: longFormReport.thumbnail,
    contentType: "long-form",
    status: "flagged",
    duration: "14:32",
    durationSeconds: 872,
    publishedAt: "2026-07-18",
    views: 18420,
    vsChannelMedian: -61,
  },
  {
    id: "vid_77c104",
    title: "Sharpening a hand plane, start to finish",
    thumbnail:
      "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?auto=format&fit=crop&w=320&h=180&q=70",
    contentType: "long-form",
    status: "underperforming",
    duration: "22:08",
    durationSeconds: 1328,
    publishedAt: "2026-07-09",
    views: 61300,
    vsChannelMedian: -18,
  },
  {
    id: "vid_2be845",
    title: "Reading a tape measure properly",
    thumbnail:
      "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=320&h=180&q=70",
    contentType: "shorts",
    status: "healthy",
    duration: "0:38",
    durationSeconds: 38,
    publishedAt: "2026-07-02",
    views: 318000,
    vsChannelMedian: 142,
  },
  {
    id: "vid_15de92",
    title: "Every Jig I Use, Built in One Weekend",
    thumbnail: longFormReport.lackingReport.reference.thumbnail,
    contentType: "long-form",
    status: "healthy",
    duration: "17:45",
    durationSeconds: 1065,
    publishedAt: "2026-04-02",
    views: 214800,
    vsChannelMedian: 96,
  },
  {
    id: "vid_08b3f1",
    title: "The offcut bin problem",
    thumbnail:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=320&h=180&q=70",
    contentType: "shorts",
    status: "underperforming",
    duration: "0:52",
    durationSeconds: 52,
    publishedAt: "2026-06-24",
    views: 88400,
    vsChannelMedian: -12,
  },
];

const reports: Record<string, DiagnosticReport> = {
  [longFormReport.id]: longFormReport,
  [shortsReport.id]: shortsReport,
};

/**
 * Reports exist for the two flagged videos in the demo set. The workspace shows a
 * "not yet analyzed" state for the rest, which is the honest shape of the real
 * product: analysis is run per video, not precomputed for the whole catalogue.
 */
export function getReport(videoId: string): DiagnosticReport | undefined {
  return reports[videoId];
}

export const DEFAULT_VIDEO_ID = longFormReport.id;

/**
 * The queue is split by content type before it is shown, because the two
 * formats are judged on different checkpoints and are never ranked against
 * each other. Order within each list stays newest-first.
 */
export function videosByType(contentType: ContentType): VideoSummary[] {
  return recentVideos.filter((v) => v.contentType === contentType);
}

/* ---------- formatting helpers ---------- */

export function formatTimecode(seconds: number): string {
  const whole = Math.round(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}K`;
  }
  return n.toLocaleString("en-US");
}

/** Formats watch time in hours, the unit YouTube Studio reports it in. */
export function formatWatchHours(hours: number): string {
  return `${formatCount(hours)} hr`;
}

/** Formats a row value in its own unit, so mixed-unit tables stay honest. */
export function formatRowValue(value: number, unit: string): string {
  if (unit === "m:ss") return formatTimecode(value);
  if (unit === "%") return `${value.toFixed(1)}%`;
  if (unit === "s") return `${value}s`;
  return `${value}`;
}

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  "long-form": "Long-form",
  shorts: "Shorts",
};

export const STATUS_LABEL: Record<VideoStatus, string> = {
  flagged: "Flagged",
  underperforming: "Underperforming",
  healthy: "Healthy",
};
