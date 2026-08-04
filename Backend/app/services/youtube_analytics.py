"""YouTube Analytics API (youtubeAnalytics v2) client: per-video reports.

Every report is the same GET against `/v2/reports` with a different
metrics/dimensions/filters triple, so the module is one generic query helper
plus a thin function per report shape. Responses come back as a column-header
list and a parallel row list; `parse_report` zips them into dicts so callers
never index by position.

Two facts about this API drive the design, and both are gaps rather than
features — recorded here because the database schema anticipates data the API
does not actually serve:

1. **There is no thumbnail-impressions or impressions-CTR metric.** YouTube
   Studio shows both; the public Analytics API exposes neither, under any
   metric name, for any authorization level. The only `impressions`-suffixed
   metrics are for ads, annotations, cards and retention segments — different
   quantities entirely. `MetricsSnapshot.impressions` and `.ctr` are therefore
   left NULL by this client rather than filled with a lookalike. Populating
   them needs a Studio CSV export or the (partner-only) Reporting API bulk
   reports, neither of which is wired up.

2. **There is no new-vs-returning viewer dimension.** The nearest thing is
   `subscribedStatus` (SUBSCRIBED / UNSUBSCRIBED), which answers a different
   question — someone can be a first-time viewer who subscribed last year via
   another video. Writing that split into `Audience.new_viewer_percentage`
   would be mislabeled data, so those columns are also left NULL.

`percentage` values are computed here rather than requested: the API reports
raw `views` per traffic source and per country, and the share is that row's
views over the total across all rows in the same report.
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Optional

from app.services.youtube_auth import YouTubeAPIError, authorized_get

logger = logging.getLogger(__name__)

ANALYTICS_API_URL = "https://youtubeanalytics.googleapis.com/v2/reports"

# The channel being queried is always the one the refresh token was minted for.
CHANNEL_ID_SELECTOR = "channel==MINE"

# Analytics data does not predate YouTube itself. Using a fixed floor rather
# than the video's publish date keeps the query independent of Data API state,
# and the API clamps the window to what it actually holds.
EARLIEST_ANALYTICS_DATE = "2005-02-01"

# How many countries to keep in `Audience.top_countries`. The full country list
# is still fetched, so the stored percentages are shares of total views, not
# shares of the truncated top-N.
TOP_COUNTRIES_LIMIT = 10

# Retention is one call per video and cannot be batched (the API rejects a
# comma-separated video filter for that report), so a channel-wide ingestion
# run makes one request per video. This bounds how many are in flight at once.
DEFAULT_CONCURRENCY = 5


@dataclass
class VideoAnalytics:
    """Every Analytics fact for one video, shaped to match the ORM tables."""

    video_id: str

    # -> MetricsSnapshot (impressions and ctr stay None; see module docstring)
    views: Optional[int] = None
    watch_time_hours: Optional[float] = None
    average_view_duration: Optional[float] = None

    # -> Engagement
    likes: Optional[int] = None
    comments: Optional[int] = None
    shares: Optional[int] = None

    # -> Retention.retention_curve
    retention_curve: Optional[list[dict[str, Any]]] = None

    # -> Traffic, one row each
    traffic_sources: list[dict[str, Any]] = field(default_factory=list)

    # -> Audience.top_countries
    top_countries: Optional[list[dict[str, Any]]] = None

    # Report names that raised instead of returning data. Empty on a clean run;
    # ingestion logs it so a silent all-NULL row is never mistaken for a video
    # that genuinely has no activity.
    failed_reports: list[str] = field(default_factory=list)


def today_utc() -> str:
    """Today in UTC as `YYYY-MM-DD`, the format the API's date params want."""
    return datetime.now(timezone.utc).date().isoformat()


def parse_report(payload: dict[str, Any]) -> list[dict[str, Any]]:
    """Zip `columnHeaders` with `rows` into one dict per row.

    The API omits `rows` entirely for an empty result rather than sending an
    empty list, so a missing key is a normal outcome and yields `[]`.
    """
    headers = [column.get("name") for column in payload.get("columnHeaders") or []]
    rows = payload.get("rows") or []
    return [dict(zip(headers, row)) for row in rows]


async def query_report(
    *,
    metrics: str,
    dimensions: Optional[str] = None,
    filters: Optional[str] = None,
    sort: Optional[str] = None,
    start_date: str = EARLIEST_ANALYTICS_DATE,
    end_date: Optional[str] = None,
) -> list[dict[str, Any]]:
    """Run one `/v2/reports` query and return its rows as dicts."""
    params: dict[str, Any] = {
        "ids": CHANNEL_ID_SELECTOR,
        "startDate": start_date,
        "endDate": end_date or today_utc(),
        "metrics": metrics,
    }
    if dimensions:
        params["dimensions"] = dimensions
    if filters:
        params["filters"] = filters
    if sort:
        params["sort"] = sort

    payload = await authorized_get(ANALYTICS_API_URL, params)
    return parse_report(payload)


def _as_int(value: Any) -> Optional[int]:
    """Coerce a reported number to int, treating absent/garbage as unreported."""
    if value is None:
        return None
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return None


def _as_float(value: Any) -> Optional[float]:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


async def fetch_core_metrics(
    video_id: str,
    *,
    start_date: str = EARLIEST_ANALYTICS_DATE,
    end_date: Optional[str] = None,
) -> dict[str, Any]:
    """Reach, watch-time and engagement totals for one video, in a single call.

    These are two ORM tables (`MetricsSnapshot` and `Engagement`) but one
    dimensionless query, so they are fetched together and split by the caller —
    a second request would cost quota to learn nothing new.
    """
    rows = await query_report(
        metrics="views,estimatedMinutesWatched,averageViewDuration,likes,comments,shares",
        filters=f"video=={video_id}",
        start_date=start_date,
        end_date=end_date,
    )
    # A dimensionless query returns exactly one row, or none at all for a video
    # with no recorded activity in the window.
    return rows[0] if rows else {}


async def fetch_retention_curve(
    video_id: str,
    *,
    start_date: str = EARLIEST_ANALYTICS_DATE,
    end_date: Optional[str] = None,
) -> Optional[list[dict[str, Any]]]:
    """The audience-retention curve for one video, ordered by elapsed ratio.

    Returns None when the API reports nothing — typically a video too new or
    too low-traffic for YouTube to publish a curve. That is distinct from an
    empty curve, which this never produces.
    """
    rows = await query_report(
        metrics="audienceWatchRatio,relativeRetentionPerformance",
        dimensions="elapsedVideoTimeRatio",
        filters=f"video=={video_id}",
        start_date=start_date,
        end_date=end_date,
    )
    if not rows:
        return None

    curve = [
        {
            "elapsed_ratio": _as_float(row.get("elapsedVideoTimeRatio")),
            "audience_watch_ratio": _as_float(row.get("audienceWatchRatio")),
            "relative_retention_performance": _as_float(
                row.get("relativeRetentionPerformance")
            ),
        }
        for row in rows
    ]
    # The API documents 100 ordered points, but sorting locally costs nothing
    # and makes the stored curve safe to read positionally.
    curve.sort(key=lambda point: point["elapsed_ratio"] or 0.0)
    return curve


def _with_percentages(
    rows: list[dict[str, Any]],
    *,
    key_field: str,
    key_name: str,
) -> list[dict[str, Any]]:
    """Turn per-row view counts into rows carrying a share of the total.

    Total is summed across every row in the report, so percentages stay honest
    even when the caller later truncates to a top-N.
    """
    counted = [(row.get(key_field), _as_int(row.get("views")) or 0) for row in rows]
    total = sum(views for _, views in counted)

    result = [
        {
            key_name: key,
            "views": views,
            # No total means no denominator; None says "unknown", not "zero".
            "percentage": round(views / total * 100, 2) if total else None,
        }
        for key, views in counted
        if key is not None
    ]
    result.sort(key=lambda entry: entry["views"], reverse=True)
    return result


async def fetch_traffic_sources(
    video_id: str,
    *,
    start_date: str = EARLIEST_ANALYTICS_DATE,
    end_date: Optional[str] = None,
) -> list[dict[str, Any]]:
    """Views per `insightTrafficSourceType` for one video, with shares."""
    rows = await query_report(
        metrics="views,estimatedMinutesWatched",
        dimensions="insightTrafficSourceType",
        filters=f"video=={video_id}",
        start_date=start_date,
        end_date=end_date,
    )
    return _with_percentages(rows, key_field="insightTrafficSourceType", key_name="source")


async def fetch_top_countries(
    video_id: str,
    *,
    limit: int = TOP_COUNTRIES_LIMIT,
    start_date: str = EARLIEST_ANALYTICS_DATE,
    end_date: Optional[str] = None,
) -> Optional[list[dict[str, Any]]]:
    """The highest-viewership countries for one video, as ISO-3166-1 codes."""
    rows = await query_report(
        metrics="views",
        dimensions="country",
        filters=f"video=={video_id}",
        sort="-views",
        start_date=start_date,
        end_date=end_date,
    )
    if not rows:
        return None
    return _with_percentages(rows, key_field="country", key_name="country")[:limit]


async def _run_report(
    analytics: VideoAnalytics,
    name: str,
    coro: Any,
) -> Any:
    """Await one report, recording rather than raising a per-video failure.

    A 400 here usually means "this report is not available for this video" —
    common enough on new uploads and some Shorts that it must not abort a
    channel-wide run. 401 and 403 are different in kind: they say the whole
    run is misauthorized, so they propagate and stop the ingestion early
    instead of writing hundreds of empty rows.
    """
    try:
        return await coro
    except YouTubeAPIError as exc:
        if exc.status_code in (401, 403):
            raise
        logger.warning(
            "Report %r unavailable for video %s (HTTP %s): %s",
            name, analytics.video_id, exc.status_code, exc.message,
        )
        analytics.failed_reports.append(name)
        return None


async def fetch_video_analytics(
    video_id: str,
    *,
    start_date: str = EARLIEST_ANALYTICS_DATE,
    end_date: Optional[str] = None,
) -> VideoAnalytics:
    """Every report for one video, gathered concurrently into one record."""
    analytics = VideoAnalytics(video_id=video_id)
    window = {"start_date": start_date, "end_date": end_date}

    core, retention, traffic, countries = await asyncio.gather(
        _run_report(analytics, "core_metrics", fetch_core_metrics(video_id, **window)),
        _run_report(analytics, "retention", fetch_retention_curve(video_id, **window)),
        _run_report(analytics, "traffic", fetch_traffic_sources(video_id, **window)),
        _run_report(analytics, "countries", fetch_top_countries(video_id, **window)),
    )

    core = core or {}
    analytics.views = _as_int(core.get("views"))
    minutes_watched = _as_float(core.get("estimatedMinutesWatched"))
    # The ORM stores hours; the API reports minutes. Convert once, here, so the
    # unit mismatch cannot leak into a diagnostic later.
    analytics.watch_time_hours = (
        round(minutes_watched / 60, 4) if minutes_watched is not None else None
    )
    analytics.average_view_duration = _as_float(core.get("averageViewDuration"))
    analytics.likes = _as_int(core.get("likes"))
    analytics.comments = _as_int(core.get("comments"))
    analytics.shares = _as_int(core.get("shares"))

    analytics.retention_curve = retention
    analytics.traffic_sources = traffic or []
    analytics.top_countries = countries

    return analytics


async def fetch_many_video_analytics(
    video_ids: list[str],
    *,
    concurrency: int = DEFAULT_CONCURRENCY,
    start_date: str = EARLIEST_ANALYTICS_DATE,
    end_date: Optional[str] = None,
) -> list[VideoAnalytics]:
    """Fetch analytics for many videos, capped at `concurrency` in flight.

    Four requests per video and no batching available means an unbounded
    `gather` over a large channel would open thousands of sockets and invite
    rate limiting. The semaphore keeps the run polite and predictable.
    """
    semaphore = asyncio.Semaphore(concurrency)

    async def bounded(video_id: str) -> VideoAnalytics:
        async with semaphore:
            return await fetch_video_analytics(
                video_id, start_date=start_date, end_date=end_date
            )

    results = await asyncio.gather(*(bounded(vid) for vid in video_ids))
    degraded = [r.video_id for r in results if r.failed_reports]
    if degraded:
        logger.warning(
            "%d/%d videos returned at least one unavailable report: %s",
            len(degraded), len(results), degraded,
        )
    return list(results)
