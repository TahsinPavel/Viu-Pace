"""API-facing Pydantic shapes for content and ingestion.

Deliberately separate from the SQLAlchemy models in `app.models`: the ORM layer
owns storage concerns (nullability, indexes, capture history), these own the
wire contract.

Two shapes exist for content because the two reads want different things. The
list endpoint returns `ContentSummary` — identity, metadata and the handful of
headline numbers a card needs — while the detail endpoint returns
`ContentDetail`, which adds the latest snapshot from each time-series table.
Sending detail-shaped payloads from the list endpoint would mean fetching five
extra tables per row to render fields nothing on that screen displays.

Nullability here mirrors the ORM's on purpose. A metric that YouTube does not
report arrives as `null`, never as `0` — the difference between "no views" and
"views not reported" is exactly the kind of thing a diagnostic must not guess
at, so it survives all the way to the client.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models import ContentType


class _ORMModel(BaseModel):
    """Base for every shape read directly off a SQLAlchemy row."""

    model_config = ConfigDict(from_attributes=True)


class MetricsSnapshotOut(_ORMModel):
    """One capture of reach and watch-time figures."""

    captured_at: datetime
    views: Optional[int] = None
    watch_time_hours: Optional[float] = None
    average_view_duration: Optional[float] = Field(
        default=None, description="Average view duration in seconds."
    )
    # Always null for YouTube-sourced rows: the Analytics API exposes no
    # thumbnail-impression or CTR metric. Kept in the contract so the field does
    # not have to be added later for a source that does report them.
    impressions: Optional[int] = None
    ctr: Optional[float] = Field(
        default=None, description="Click-through rate as a percentage, e.g. 4.2 == 4.2%."
    )


class EngagementOut(_ORMModel):
    """One capture of likes, comments and shares."""

    captured_at: datetime
    likes: Optional[int] = None
    comments: Optional[int] = None
    shares: Optional[int] = None


class RetentionOut(_ORMModel):
    """One capture of the audience-retention curve.

    `retention_curve` is null when YouTube published no curve for the video —
    typically too new or too little traffic. That is distinct from an empty
    list, which this never returns.
    """

    captured_at: datetime
    retention_curve: Optional[list[dict[str, Any]]] = Field(
        default=None,
        description=(
            "Ordered points: [{'elapsed_ratio': 0.0-1.0, "
            "'audience_watch_ratio': float, 'relative_retention_performance': float}]."
        ),
    )


class TrafficOut(_ORMModel):
    """One traffic source's share of a video's views at one capture time."""

    captured_at: datetime
    source: str = Field(
        description="Analytics insightTrafficSourceType, e.g. YT_SEARCH, BROWSE, SUGGESTED."
    )
    views: Optional[int] = None
    percentage: Optional[float] = Field(
        default=None, description="Share of views from this source, 0-100."
    )


class AudienceOut(_ORMModel):
    """One capture of audience composition.

    The viewer-split fields are always null for YouTube-sourced rows: the
    Analytics API has no new-vs-returning dimension, and the nearest available
    one (`subscribedStatus`) answers a different question, so it is not
    substituted in.
    """

    captured_at: datetime
    new_viewer_percentage: Optional[float] = None
    returning_viewer_percentage: Optional[float] = None
    top_countries: Optional[list[dict[str, Any]]] = Field(
        default=None,
        description="Ordered: [{'country': 'US', 'views': 1234, 'percentage': 42.1}].",
    )


class ContentSummary(_ORMModel):
    """A video as the list endpoint returns it."""

    id: int
    external_id: str
    platform: str
    type: ContentType
    title: str
    thumbnail_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    publish_date: Optional[datetime] = None

    # Flattened from the newest MetricsSnapshot so a list row needs no nested
    # object to show its headline numbers. Null when the video has never been
    # captured.
    latest_captured_at: Optional[datetime] = None
    views: Optional[int] = None
    watch_time_hours: Optional[float] = None


class ContentDetail(_ORMModel):
    """A video plus the most recent snapshot from each time-series table."""

    id: int
    external_id: str
    platform: str
    type: ContentType
    title: str
    description: Optional[str] = None
    tags: Optional[list[str]] = None
    thumbnail_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    publish_date: Optional[datetime] = None
    created_at: datetime

    metrics: Optional[MetricsSnapshotOut] = None
    engagement: Optional[EngagementOut] = None
    retention: Optional[RetentionOut] = None
    audience: Optional[AudienceOut] = None
    # Every traffic row from the latest capture, not just one: the fan-out is
    # the point, since a source mix is only meaningful whole.
    traffic: list[TrafficOut] = Field(default_factory=list)


class ContentListResponse(BaseModel):
    """A page of content summaries.

    `total` is the count matching the filters, not the length of `items`, so a
    client can size its pagination without a second request.
    """

    total: int
    limit: int
    offset: int
    items: list[ContentSummary]


class IngestionRequest(BaseModel):
    """Options for a manual ingestion trigger. Every field has a usable default."""

    max_videos: Optional[int] = Field(
        default=None,
        ge=1,
        description="Cap the number of videos fetched. Omit to ingest the whole channel.",
    )
    concurrency: int = Field(
        default=5,
        ge=1,
        le=20,
        description="How many videos to request Analytics for at once.",
    )
    start_date: Optional[str] = Field(
        default=None,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Analytics window start, YYYY-MM-DD. Defaults to the earliest available.",
    )
    end_date: Optional[str] = Field(
        default=None,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Analytics window end, YYYY-MM-DD. Defaults to today (UTC).",
    )


class IngestionResultOut(BaseModel):
    """What an ingestion run did."""

    captured_at: datetime = Field(
        description="Shared timestamp stamped on every row this run wrote."
    )
    videos_seen: int
    content_created: int
    content_updated: int
    metrics_rows: int
    retention_rows: int
    traffic_rows: int
    engagement_rows: int
    audience_rows: int
    snapshot_rows: int
    degraded_videos: list[str] = Field(
        default_factory=list,
        description=(
            "Videos where at least one Analytics report was unavailable. Their "
            "rows are still written, with the missing figures left null."
        ),
    )


class IngestionAccepted(BaseModel):
    """Acknowledgement for an ingestion started in the background."""

    status: str = "accepted"
    detail: str
