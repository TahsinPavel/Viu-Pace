# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
YouTube content creators, both long-form and Shorts creators, who want to understand exactly why a specific video underperformed and what to fix in the next one.

## Product Purpose
ViuPace analyzes YouTube video performance data to diagnose why a video failed, covering both long-form videos and Shorts, and turns that diagnosis into concrete, actionable fixes such as rewritten titles, thumbnail concepts, and script pacing feedback.

## Positioning
A YouTube performance diagnosis tool that goes beyond raw analytics dashboards like TubeBuddy and vidIQ, by explaining the actual reason a video failed and generating specific fixes, using YouTube API data only, no video frame or computer vision analysis.

## Operating Context
Creators upload or connect a YouTube channel, select an underperforming video, long-form or Shorts, and receive a diagnostic report covering retention, packaging, and content structure, along with AI generated fixes.

## Capabilities and Constraints
- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS v4, Shadcn UI components.
- **Backend**: FastAPI (Python), Uvicorn, SQLAlchemy async engine, `asyncpg`.
- **Database**: Serverless Neon PostgreSQL.
- **Data source**: YouTube Data API and YouTube Analytics API only. No computer vision or video frame analysis, all diagnosis is derived from API metrics, retention curves, and transcripts.
- **Dashboard UI**: Minimalist white workspace with dedicated left panel and YouTube integration views.

## Brand Commitments
- **Name**: ViuPace
- **Visual Tone**: Clean, minimal, high-contrast, professional white aesthetic.

## Evidence on Hand
- Next.js 16+ App Router web client configured in [`Frontend`](file:///d:/projects/ViuPace/Frontend).
- FastAPI backend service configured in [`Backend`](file:///d:/projects/ViuPace/Backend).
- Functional landing page and minimalist white dashboard shell in [`src/app/dashboard/page.tsx`](file:///d:/projects/ViuPace/Frontend/src/app/dashboard/page.tsx).

## Product Principles
1. **Content type aware**: Every diagnostic feature accounts for the different viewer behavior between long-form videos and Shorts, using separate checkpoints and thresholds for each.
2. **Multi checkpoint retention analysis**: Retention is evaluated at multiple points across a video's duration, not a single fixed timestamp, to catch both early drop-off and slow mid-video bleed.
3. **Diagnosis leads to action**: Every insight ends in a concrete suggestion, a rewritten title, a thumbnail concept, or a script pacing note, not just a chart.
4. **API data only**: All analysis is derived from YouTube API metrics and transcripts. No frame level video processing.

## MVP Core Features

1. **Boredom Locator**
   Cross-references retention drop-off timestamps with the video transcript to isolate pacing issues, text-heavy blocks, or slow narration. Evaluated at multiple retention checkpoints across the video, not one fixed point. For Shorts, checkpoints are compressed to the first few seconds given shorter total duration and faster swipe-away behavior.

2. **Virality Blueprint**
   Isolates positive retention spikes and rewatch points, and identifies what likely caused them, a hook, a line, a visual beat, using the transcript at that timestamp. Works across both long-form and Shorts, with separate spike thresholds since Shorts naturally show sharper retention swings.

3. **Early Drop AI Diagnostic**
   Flags videos losing a significant share of audience early in playback and prompts an intro or hook rewrite. Threshold is content type aware, long-form uses a percentage lost in the first 30 seconds, Shorts use a percentage lost in the first 3 to 5 seconds, since Shorts viewers decide far faster.

4. **Flop Finder**
   Tags videos with high impressions but low CTR, isolating packaging as the likely failure point, thumbnail or title, separate from content or retention issues.

5. **Asset Rescue Engine**
   For any video flagged by Flop Finder, generates 3 alternative high-curiosity titles and thumbnail concepts.

6. **Lacking Report**
   Compares an underperforming video against the creator's own highest-performing video in the same sub-niche, highlighting concrete gaps, such as slower hook pacing or lower information density, with content type matched comparisons, long-form compared to long-form, Shorts compared to Shorts.

## Supporting Data Layer
Required for the above features to function, not sold as standalone value:
- YouTube metadata ingestion: titles, descriptions, tags, publish dates
- Reach metrics: impressions, CTR, traffic source breakdown
- Engagement metrics: views, watch time, average view duration, likes, comments, shares
- Second-by-second retention curve extraction, for both long-form and Shorts
- Interactive, color coded retention curve visualization, drop-offs in red, rewatch spikes in green