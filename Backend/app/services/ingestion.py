"""Ingestion orchestration: Data API + Analytics API -> the content tables.

The run is deliberately split into a network phase and a write phase rather
than interleaved. Every video costs one Data API batch slot plus four Analytics
requests, so interleaving would hold a database transaction open across
hundreds of round-trips — on Neon's serverless Postgres that is how you collect
idle-in-transaction disconnects. Fetching everything first keeps the
transaction open only for the inserts, which are fast.

Two write rules follow from the schema:

* `Content` is **upserted** on `external_id`. Titles, descriptions, tags and
  thumbnails change on the platform, and the row should track the current
  truth. `external_id` is the stable identity; the surrogate `id` never moves,
  so foreign keys from older snapshots stay valid.
* Every time-series table is **append-only**. Nothing is updated or deleted;
  each run adds a new row per video per table. That accumulating history is
  what later powers trend diagnosis, so an "update the latest row" shortcut
  would quietly destroy the product's reason for storing snapshots at all.

All rows written by one run share a single `captured_at`, passed explicitly
rather than left to the column's `server_default`. Postgres's `now()` is
transaction-scoped and would in practice produce the same value, but relying on
that couples "one run is one grouping key" to a database detail; setting it
here makes the invariant the code's own.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    Audience,
    Content,
    Engagement,
    MetricsSnapshot,
    Retention,
    Traffic,
)
from app.services.youtube_analytics import (
    DEFAULT_CONCURRENCY,
    EARLIEST_ANALYTICS_DATE,
    VideoAnalytics,
    fetch_many_video_analytics,
)
from app.services.youtube_data import VideoMetadata, fetch_channel_videos

logger = logging.getLogger(__name__)


@dataclass
class IngestionResult:
    """What one ingestion run did, in numbers the API can hand back."""

    captured_at: datetime
    videos_seen: int = 0
    content_created: int = 0
    content_updated: int = 0
    metrics_rows: int = 0
    retention_rows: int = 0
    traffic_rows: int = 0
    engagement_rows: int = 0
    audience_rows: int = 0

    # Videos where at least one Analytics report was unavailable. The content
    # row and whatever data did arrive are still written; this names the gaps so
    # an all-NULL snapshot is never mistaken for a video with genuinely no
    # activity.
    degraded_videos: list[str] = field(default_factory=list)

    @property
    def snapshot_rows(self) -> int:
        return (
            self.metrics_rows
            + self.retention_rows
            + self.traffic_rows
            + self.engagement_rows
            + self.audience_rows
        )


def _apply_metadata(content: Content, meta: VideoMetadata) -> None:
    """Copy the mutable Data API fields onto a Content row.

    `external_id` and `platform` are identity, not payload, so they are not
    touched here — an upsert that rewrote them would be creating a different
    video, not updating this one.
    """
    content.title = meta.title
    content.description = meta.description
    content.tags = meta.tags
    content.thumbnail_url = meta.thumbnail_url
    content.duration_seconds = meta.duration_seconds
    content.type = meta.type
    # publish_date is immutable in practice, but a re-fetch is authoritative and
    # costs nothing to reapply.
    content.publish_date = meta.publish_date


async def upsert_content(
    session: AsyncSession,
    metadata: list[VideoMetadata],
) -> tuple[dict[str, Content], int, int]:
    """Insert or update one Content row per video.

    Returns the `external_id -> Content` map the write phase needs, plus the
    created and updated counts. Existing rows are loaded in a single `IN` query
    rather than one lookup per video: a channel-wide run would otherwise issue
    hundreds of sequential round-trips to Neon before writing anything.
    """
    if not metadata:
        return {}, 0, 0

    external_ids = [meta.external_id for meta in metadata]
    result = await session.execute(
        select(Content).where(Content.external_id.in_(external_ids))
    )
    existing = {row.external_id: row for row in result.scalars()}

    created = 0
    updated = 0
    for meta in metadata:
        content = existing.get(meta.external_id)
        if content is None:
            content = Content(external_id=meta.external_id, platform="youtube")
            _apply_metadata(content, meta)
            session.add(content)
            existing[meta.external_id] = content
            created += 1
        else:
            _apply_metadata(content, meta)
            updated += 1

    # Flush so every new Content has its surrogate `id` populated before the
    # snapshot rows below take it as a foreign key.
    await session.flush()
    return existing, created, updated


def _write_snapshots(
    session: AsyncSession,
    content: Content,
    analytics: VideoAnalytics,
    captured_at: datetime,
    result: IngestionResult,
) -> None:
    """Append this run's time-series rows for one video."""
    session.add(
        MetricsSnapshot(
            content_id=content.id,
            captured_at=captured_at,
            views=analytics.views,
            watch_time_hours=analytics.watch_time_hours,
            average_view_duration=analytics.average_view_duration,
            # impressions and ctr have no Analytics API equivalent; see the
            # module docstring in app.services.youtube_analytics.
            impressions=None,
            ctr=None,
        )
    )
    result.metrics_rows += 1

    session.add(
        Engagement(
            content_id=content.id,
            captured_at=captured_at,
            likes=analytics.likes,
            comments=analytics.comments,
            shares=analytics.shares,
        )
    )
    result.engagement_rows += 1

    # Retention and audience rows are written even when the payload is None, so
    # the history records "we asked at this time and YouTube had nothing" rather
    # than leaving a hole indistinguishable from a run that never happened.
    session.add(
        Retention(
            content_id=content.id,
            captured_at=captured_at,
            retention_curve=analytics.retention_curve,
        )
    )
    result.retention_rows += 1

    session.add(
        Audience(
            content_id=content.id,
            captured_at=captured_at,
            # No new-vs-returning dimension exists in the Analytics API; these
            # stay NULL rather than being filled from `subscribedStatus`, which
            # answers a different question.
            new_viewer_percentage=None,
            returning_viewer_percentage=None,
            top_countries=analytics.top_countries,
        )
    )
    result.audience_rows += 1

    # Traffic is the one fan-out: one row per source per capture.
    for slice_ in analytics.traffic_sources:
        session.add(
            Traffic(
                content_id=content.id,
                captured_at=captured_at,
                source=slice_["source"],
                views=slice_.get("views"),
                percentage=slice_.get("percentage"),
            )
        )
        result.traffic_rows += 1


async def ingest_channel(
    session: AsyncSession,
    *,
    max_videos: Optional[int] = None,
    concurrency: int = DEFAULT_CONCURRENCY,
    start_date: str = EARLIEST_ANALYTICS_DATE,
    end_date: Optional[str] = None,
) -> IngestionResult:
    """Fetch the connected channel and write one snapshot per video.

    Does not commit. The caller owns the transaction — `get_db()` commits on a
    clean request, and `run_ingestion_job` commits for background runs.
    """
    captured_at = datetime.now(timezone.utc)
    result = IngestionResult(captured_at=captured_at)

    # --- Network phase: everything fetched before the first write. ---
    metadata = await fetch_channel_videos(max_videos=max_videos)
    result.videos_seen = len(metadata)
    if not metadata:
        logger.warning("Channel returned no videos; nothing to ingest.")
        return result

    analytics = await fetch_many_video_analytics(
        [meta.external_id for meta in metadata],
        concurrency=concurrency,
        start_date=start_date,
        end_date=end_date,
    )
    by_video_id = {record.video_id: record for record in analytics}

    # --- Write phase. ---
    content_map, result.content_created, result.content_updated = await upsert_content(
        session, metadata
    )

    for meta in metadata:
        content = content_map.get(meta.external_id)
        record = by_video_id.get(meta.external_id)
        if content is None or record is None:
            # Only reachable if the two phases disagree about which videos
            # exist, which would be a bug rather than a data condition.
            logger.error("No %s for video %s; skipping its snapshot.",
                         "content row" if content is None else "analytics",
                         meta.external_id)
            continue

        if record.failed_reports:
            result.degraded_videos.append(meta.external_id)

        _write_snapshots(session, content, record, captured_at, result)

    await session.flush()
    logger.info(
        "Ingestion wrote %d snapshot rows for %d videos (%d new, %d updated).",
        result.snapshot_rows, result.videos_seen,
        result.content_created, result.content_updated,
    )
    return result


async def run_ingestion_job(
    *,
    max_videos: Optional[int] = None,
    concurrency: int = DEFAULT_CONCURRENCY,
    start_date: str = EARLIEST_ANALYTICS_DATE,
    end_date: Optional[str] = None,
) -> IngestionResult:
    """Run ingestion in its own session and commit it.

    Entry point for background tasks, which have no request-scoped `get_db()`
    session to inherit.
    """
    # Imported here rather than at module scope so that importing this module
    # does not pull in the engine — keeps unit-level imports side-effect free.
    from app.database import AsyncSessionLocal

    async with AsyncSessionLocal() as session:
        try:
            result = await ingest_channel(
                session,
                max_videos=max_videos,
                concurrency=concurrency,
                start_date=start_date,
                end_date=end_date,
            )
            await session.commit()
            return result
        except Exception:
            await session.rollback()
            logger.exception("Ingestion job failed; transaction rolled back.")
            raise
