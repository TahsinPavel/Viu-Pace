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

/**
 * Every finding carries a `headline`: the plain sentence a reader sees first.
 *
 * House rules for this string, applied without exception:
 * - State what happened with numbers, never a vague comparison.
 * - Say plainly whether it is good or bad; never make the reader infer it.
 * - Banned words: ceiling, percentile, median, packaging, spike threshold.
 * - A metric keeps one name everywhere in the app. It is always "channel
 *   average", never "channel median" or "your usual". The early-drop bar is
 *   always "normal limit". Anything compared against similar videos is
 *   "videos like yours".
 * - Two short sentences maximum, at a level a 12-year-old can follow.
 */
export interface BoredomLocator {
  headline: string;
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
  /** Plain sentence, first thing read. See BoredomLocator.headline for rules. */
  headline: string;
  impressions: number;
  views: number;
  ctr: number;
  channelAvgCtr: number;
  nicheMedianCtr: number;
  /** Impressions percentile against the channel's own catalogue. */
  impressionsPercentile: number;
  /** The percentile said in words, because the number alone is jargon. */
  reachPlain: string;
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
  /** Plain sentence, first thing read. See BoredomLocator.headline for rules. */
  headline: string;
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
  /** Plain sentence, first thing read. See BoredomLocator.headline for rules. */
  headline: string;
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
  /** Plain sentence, first thing read. See BoredomLocator.headline for rules. */
  headline: string;
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
  /**
   * The panel gets its own plain sentence, same rules as a finding headline —
   * a reader should not have to compare two bars to learn what happened.
   */
  headline: string;
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
  /** Plain sentence, first thing read. See BoredomLocator.headline for rules. */
  headline: string;
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
  /** Plain sentence, first thing read. See BoredomLocator.headline for rules. */
  headline: string;
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
    "Most viewers left 4 minutes in, during 90 seconds of backstory.",
  primaryFailure: "retention",
  confidence: "high",
  boredomLocator: {
    headline:
      "Viewers started leaving at 4:10. You lost 20 out of every 100 viewers over the next 90 seconds.",
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
          "Here you start telling the story of the garage, 4 minutes in, before you have built anything. For the next 90 seconds there is no cut and nothing new on screen.",
      },
      {
        kind: "rewatch",
        from: 462,
        to: 498,
        delta: +5.8,
        transcript:
          "…and that's the whole bench, flat to within half a millimetre, for thirty-one dollars in plywood.",
        reading:
          "This is the only place you say a number out loud while that number is on screen. Viewers went back to read it again.",
      },
    ],
    checkpoints: [
      { label: "0:30", at: 30, threshold: 70, measured: 76.8 },
      { label: "1:30", at: 90, threshold: 62, measured: 68.4 },
      { label: "4:00", at: 240, threshold: 55, measured: 60.6 },
      { label: "6:00", at: 360, threshold: 48, measured: 37.9 },
      { label: "10:00", at: 600, threshold: 38, measured: 31.1 },
      { label: "End", at: 872, threshold: 28, measured: 20.4 },
    ],
    recommendation: {
      action: "Delete 4:10 to 5:40. Move the finished bench to 3:55 instead.",
      rationale:
        "The 90 seconds you cut is backstory. The bench is the part people came for.",
      asset: {
        label: "For your next video",
        body: "Start building in the first 45 seconds. Keep any backstory to two sentences, and put it after you show something finished, never before.",
      },
    },
  },
  viralityBlueprint: {
    headline:
      "Viewers went back and rewatched 7:42 to 8:18. Only 35 out of every 100 viewers got that far.",
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
          "You say the price and the measurement while both are on screen. That is the only time in 14 minutes you do this, and it is the only time viewers came back.",
      },
    ],
    pattern:
      "Viewers rewatch the moment a claim becomes a number they can see. That happens once in this video.",
    recommendation: {
      action:
        "Put a price or a measurement on screen every two minutes. Start before 0:45.",
      rationale:
        "Only 35 of every 100 viewers reached the moment that worked. It needs to arrive while people are still watching.",
      asset: {
        label: "How to repeat it",
        body: "Say a price, a size, or a time saved, and show that number on screen as you say it. The bench line at 7:42 is the example to copy.",
      },
    },
  },
  earlyDrop: {
    headline:
      "You lost 23% of viewers in the first 30 seconds. That is under the normal limit of 30%, so your opening is fine.",
    // Long-form is judged on the first 30 seconds.
    window: 30,
    pct: 23.2,
    threshold: 30,
    measured: 76.8,
    channelAvgPct: 17.4,
    verdict:
      "Long videos normally lose up to 30% in the first 30 seconds. You lost 23%, so the opening passed. It is 6% behind your channel average, which is a normal difference. The viewers you lost, you lost at 4:10.",
    recommendation: {
      action: "Leave your opening as it is. Spend your editing time on 4:10 to 5:40.",
      rationale:
        "Your opening keeps 77 of every 100 viewers. There is nothing to fix there.",
    },
  },
  flopFinder: {
    headline:
      "This video was seen a lot but clicked very little. Only 3 out of every 100 people who saw it clicked, and your channel average is 6.",
    impressions: 412000,
    views: 18420,
    ctr: 3.1,
    channelAvgCtr: 6.4,
    nicheMedianCtr: 5.8,
    impressionsPercentile: 88,
    reachPlain: "YouTube showed this video to more people than usual for your channel.",
    verdict:
      "YouTube showed this video to 412,000 people, which is a lot for your channel. So getting seen was not the problem. Out of every 100 people who saw it, only 3 clicked. Your channel usually gets 6. The title and the picture are what stopped them.",
    recommendation: {
      action:
        "Make a new thumbnail showing the finished bench with “$900” on it.",
      rationale:
        "Your thumbnail shows an empty room before anything is built. The $900 in your title is the reason people click, and it is not in the picture.",
      asset: {
        label: "Thumbnail idea",
        body: "The finished bench, shot straight on at eye level, warm light from the left. “$900” written large in the top-right corner. No face, no arrow, no outline.",
      },
      alternates: [
        "The $900 Workshop (Everything Is Plywood)",
        "I Built a Whole Workshop for the Price of One Table Saw",
        "$900 Workshop: Flat to Half a Millimetre",
      ],
    },
  },
  discoverability: {
    headline:
      "3 of your top 5 search terms appear nowhere in your title, description, or tags.",
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
      action:
        "Write “plywood workbench” in the first line of your description, and add it as a tag.",
      rationale:
        "The two search terms bringing you the most viewers are both about the bench. The word “bench” is not in your title, your description, or your tags.",
      asset: {
        label: "What to write",
        body: "First line: “A flat plywood workbench, built for $31, inside a $900 workshop rebuild. Full plans and cut list below.” Add these tags: plywood workbench, workbench build, cheap workshop bench, diy workbench plans. Remove the tag “diy” on its own, it is too general to help.",
      },
    },
  },
  assetRescue: {
    headline: "Here are 3 better titles and 3 thumbnail ideas to try.",
    eligible: true,
    gate:
      "Your click rate is 3.3% below your channel average, so the title and picture are worth changing. That is why these were written.",
    titles: [
      {
        text: "The $900 Workshop (Everything Is Plywood)",
        angle: "Leads with the price, then says what made it possible.",
      },
      {
        text: "I Built a Whole Workshop for the Price of One Table Saw",
        angle: "Compares the price to something viewers already know the cost of.",
      },
      {
        text: "$900 Workshop: Flat to Half a Millimetre",
        angle: "Puts the price next to the measurement viewers rewatched.",
      },
    ],
    thumbnails: [
      {
        label: "Thumbnail A — the finished bench and the price",
        body: "The finished bench, straight on at eye level, warm light from the left. “$900” large in the top-right corner. No face, no arrow, no outline.",
      },
      {
        label: "Thumbnail B — the measurement",
        body: "Close-up of a straightedge across the bench top with a gauge in the gap. “0.5mm” in the corner. Sells how well it is made instead of the price.",
      },
      {
        label: "Thumbnail C — before and after",
        body: "Split down the middle: empty garage on the left, finished workshop on the right, same camera position so the change is obvious. “$900” on the line between them.",
      },
    ],
    recommendation: {
      action:
        "Use title 1 with thumbnail A. Change nothing else for 14 days.",
      rationale:
        "Thumbnail A puts the finished bench and the price in one picture. Your current one shows an empty room.",
      asset: {
        label: "Why wait 14 days",
        body: "Change one thing at a time. If you change the title and the picture and the description together, you will not know which one worked. After 14 days, compare the click rate against your 6.4% channel average.",
      },
      // No `alternates` here: the three titles are the evidence of this finding
      // and are already listed above with their angles. This recommendation
      // names which one to ship rather than reprinting the list.
    },
  },
  audienceBehavior: {
    headline:
      "At 4 minutes, 74 out of every 100 returning viewers were still watching, but only 54 out of every 100 new viewers. 68% of this audience was new.",
    at: 240,
    cohorts: [
      { label: "New viewers", share: 68, retention: 54.1, emphasis: true },
      { label: "Returning viewers", share: 32, retention: 74.5, emphasis: false },
    ],
    reading:
      "At 4:00, 74 out of every 100 returning viewers were still watching, but only 54 out of every 100 new viewers. The garage story that starts at 4:10 is something your regular viewers already know. Most of this audience, 68%, was watching you for the first time.",
  },
  lackingReport: {
    headline:
      "Your best video cuts almost 3 times as often and shows almost 5 times as many numbers on screen.",
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
        note: "Your best video starts cutting wood before the title even appears.",
      },
      {
        metric: "Cuts per minute",
        unit: "cuts",
        value: 4.2,
        referenceValue: 11.6,
        scale: { min: 0, max: 14 },
        higherIsBetter: true,
        note: "You hold long still shots while talking. Your best video cuts every time something is finished.",
      },
      {
        metric: "Numbers shown on screen",
        unit: "numbers",
        value: 3,
        referenceValue: 14,
        scale: { min: 0, max: 16 },
        higherIsBetter: true,
        note: "Prices and measurements shown on screen. The one moment viewers rewatched was a number.",
      },
      {
        metric: "How long people watch",
        unit: "m:ss",
        value: 214,
        referenceValue: 486,
        scale: { min: 0, max: 540 },
        higherIsBetter: true,
        note: "Both videos are about the same length, but your best one keeps people 4 minutes longer.",
      },
    ],
    recommendation: {
      action: "Show one price or measurement every two minutes.",
      rationale:
        "Both videos are about the same thing and the same length. Your best one shows 14 numbers on screen, this one shows 3.",
      asset: {
        label: "How to plan the next one",
        body: "Before you film, write down seven moments where you say a price, a size, or a time saved. Show each number on screen as you say it. If any part runs longer than 40 seconds with no number in it, cut it.",
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
    "A third of viewers swiped away in the first 3 seconds, before you showed the clamp.",
  primaryFailure: "retention",
  confidence: "high",
  boredomLocator: {
    headline:
      "You lost 34 out of every 100 viewers in the first 3 seconds. You do not show the clamp until 0:06.",
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
          "You spend the first 3 seconds saying hello. Viewers decide whether to swipe in exactly those 3 seconds, and a third of them left.",
      },
      {
        kind: "rewatch",
        from: 38,
        to: 44,
        delta: +8.3,
        transcript: "— and it holds a mitre square without touching the face.",
        reading:
          "This is where you show the clamp working. Viewers played it again to watch it a second time.",
      },
    ],
    checkpoints: [
      { label: "0:03", at: 3, threshold: 75, measured: 66.1 },
      { label: "0:05", at: 5, threshold: 68, measured: 59.2 },
      { label: "0:10", at: 10, threshold: 58, measured: 53.4 },
      { label: "0:20", at: 20, threshold: 50, measured: 48.6 },
      { label: "0:35", at: 35, threshold: 44, measured: 44.8 },
      { label: "End", at: 47, threshold: 40, measured: 38.4 },
    ],
    recommendation: {
      action: "Start with the clamp already holding the square. Delete the greeting.",
      rationale:
        "The moment viewers replayed at 0:38 is the moment that should open the video. Nothing before 0:06 shows the clamp.",
      asset: {
        label: "How to open it",
        body: "First frame: the clamp holding the square, already tight. Your first words are the claim, not hello — “This holds a mitre square without touching the face.” Say the $12 price at 0:02 and show it working by 0:04.",
      },
    },
  },
  viralityBlueprint: {
    headline:
      "Viewers replayed the clamp demo at 0:38. Only 45 out of every 100 viewers got that far.",
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
          "This is where the clamp does the thing you promised. Viewers played it again instead of swiping away.",
      },
    ],
    pattern:
      "Viewers replay the moment you show the clamp working, with no talking over it. That happens once, near the end.",
    recommendation: {
      action: "End on the same shot you start on, and delete the sign-off.",
      rationale:
        "Viewers replay the demo, but your last 3 seconds are a goodbye. That breaks the replay.",
      asset: {
        label: "How to make it loop",
        body: "Make the last frame the same as the first frame: the clamp tight on the square. Cut the “thanks for watching” at the end so the video runs straight back into itself.",
      },
    },
  },
  earlyDrop: {
    headline:
      "You lost 34 out of every 100 viewers in the first 3 seconds. The normal limit is 25, so this is the problem.",
    // Shorts are judged on the swipe window, not the first 30 seconds.
    window: 3,
    pct: 33.9,
    threshold: 25,
    measured: 66.1,
    channelAvgPct: 18.6,
    verdict:
      "Short videos normally lose up to 25 out of every 100 viewers in the first 3 seconds. You lost 34. This is the main thing to fix: the clamp does not appear on screen until 0:06, and by then most people had already swiped away.",
    recommendation: {
      action: "Put the clamp on screen in the very first frame. Delete the greeting.",
      rationale:
        "Nothing before 0:06 shows the clamp. Viewers had already decided to leave by 0:03, while you were still saying hello.",
      asset: {
        label: "How to open it",
        body: "First frame: the clamp holding the square, already tight. Your first words are the claim — “This holds a mitre square without touching the face.” Price at 0:02, and show it working by 0:04.",
      },
    },
  },
  flopFinder: {
    headline:
      "3.4 out of every 100 people who saw this clicked it. Your channel average is 4.1, so the title and picture are working fine.",
    impressions: 1240000,
    views: 42600,
    ctr: 3.4,
    channelAvgCtr: 4.1,
    nicheMedianCtr: 3.9,
    impressionsPercentile: 71,
    reachPlain: "YouTube showed this Short to a lot of people, more than usual for your channel.",
    verdict:
      "YouTube showed this Short to 1,240,000 people. Out of every 100 who saw it, 3.4 clicked, and your channel usually gets 4.1. That is a normal difference for a Short. The title and the picture are not the problem here. The first 3 seconds are.",
    recommendation: {
      action: "Leave the title and picture alone. Fix the first 3 seconds instead.",
      rationale:
        "People are clicking this Short at your normal rate. Changing a title that already works would not fix anything.",
    },
  },
  discoverability: {
    headline:
      "Your top search term, “mitre square clamp trick”, is not in your title, description, or tags.",
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
      action: "Put “mitre square” in your title and add it as a tag.",
      rationale:
        "Search only brings 7 out of every 100 viewers to this Short, so this is a small fix. But the words people search for most are not in your title, description, or tags at all.",
      asset: {
        label: "What to change",
        body: "New title: “The $12 clamp that holds a mitre square”. Add these tags: mitre square, clamp trick, no-mar clamping, square clamping jig. Leave your description as it is, “without marring” is already bringing you viewers.",
      },
    },
  },
  assetRescue: {
    headline:
      "No new titles or thumbnails needed. People are already clicking this Short at your normal rate.",
    eligible: false,
    gate:
      "Your click rate is 3.4 out of every 100 people, and your channel average is 4.1. That is a normal difference, so the title and picture are not worth changing. Nothing was written for this.",
    titles: [],
    thumbnails: [],
    recommendation: {
      action: "Do not change the title or picture. Fix the first 3 seconds first.",
      rationale:
        "YouTube showed this Short to 1,240,000 people and they clicked at your normal rate, which is what a working title does. The real problem is the 34 out of every 100 viewers you lose in the first 3 seconds. A new title would not change that.",
    },
  },
  audienceBehavior: {
    headline:
      "At 3 seconds, 85 out of every 100 returning viewers were still watching, but only 64 out of every 100 new viewers. 91% of this audience was new.",
    at: 3,
    cohorts: [
      { label: "New viewers", share: 91, retention: 64.3, emphasis: true },
      { label: "Returning viewers", share: 9, retention: 84.5, emphasis: false },
    ],
    reading:
      "At 0:03, 85 out of every 100 returning viewers were still watching, but only 64 out of every 100 new viewers. People who know you will sit through a greeting. Almost everyone here, 91%, had never seen your channel before, and they will not.",
  },
  lackingReport: {
    headline:
      "Your best Short shows the subject in the first frame. This one waits 6 seconds.",
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
        note: "Your best Short opens on the mistake itself, mid-cut, with no talking first.",
      },
      {
        metric: "Words before the point",
        unit: "words",
        value: 17,
        referenceValue: 3,
        scale: { min: 0, max: 20 },
        higherIsBetter: false,
        note: "Seventeen words of hello, and viewers had already decided to swipe.",
      },
      {
        metric: "Still watching at 3 seconds",
        unit: "%",
        value: 66.1,
        referenceValue: 89.4,
        scale: { min: 0, max: 100 },
        higherIsBetter: true,
        note: "This is the biggest difference between the two videos.",
      },
      {
        metric: "Viewers who replayed it",
        unit: "%",
        value: 8.3,
        referenceValue: 22.1,
        scale: { min: 0, max: 26 },
        higherIsBetter: true,
        note: "People do replay your clamp demo. It just comes too late for most of them to see it.",
      },
    ],
    recommendation: {
      action: "Show the clamp working first, then explain how it works.",
      rationale:
        "Your best Short makes its point in three words while showing you. This one explains for 6 seconds before showing anything.",
      asset: {
        label: "How to structure it",
        body: "Show it first, explain second, never the other way round in a Short. First frame shows the result, your first three words name it, and the how-to fills the remaining 40 seconds. Make the last frame the same as the first so it replays smoothly.",
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
