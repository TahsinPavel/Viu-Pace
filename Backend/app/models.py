"""SQLAlchemy models for ViuPace's YouTube data layer.

The schema is a single content table plus five time-series tables. Every
time-series row is stamped with `captured_at`, so repeated ingestion runs append
snapshots rather than overwriting history — that history is what powers
trend-over-time diagnosis. Each time-series table is indexed on
`(content_id, captured_at)` for the "latest snapshot for this video" lookup that
the detail endpoint and every diagnostic feature perform.
"""

from __future__ import annotations

import enum
from datetime import datetime
from typing import Any, List, Optional

from sqlalchemy import (
    DateTime,
    Enum as SAEnum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ContentType(str, enum.Enum):
    """Long-form vs Shorts. Drives content-type-aware diagnostic thresholds."""

    LONG_FORM = "long_form"
    SHORTS = "shorts"


class Content(Base):
    """A single piece of published content (currently always a YouTube video)."""

    __tablename__ = "content"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    external_id: Mapped[str] = mapped_column(
        String(64), nullable=False, unique=True, index=True,
        doc="Platform-native video id, e.g. the YouTube 11-char video id.",
    )
    platform: Mapped[str] = mapped_column(String(32), nullable=False, default="youtube")
    type: Mapped[ContentType] = mapped_column(
        SAEnum(ContentType, name="content_type", native_enum=False, length=32),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    tags: Mapped[Optional[list[str]]] = mapped_column(JSONB, nullable=True)
    duration_seconds: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True,
        doc="Parsed from ISO-8601 contentDetails.duration; also decides Shorts vs long-form.",
    )
    publish_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    metrics_snapshots: Mapped[List["MetricsSnapshot"]] = relationship(
        back_populates="content", cascade="all, delete-orphan", lazy="selectin"
    )
    retentions: Mapped[List["Retention"]] = relationship(
        back_populates="content", cascade="all, delete-orphan", lazy="selectin"
    )
    traffic_sources: Mapped[List["Traffic"]] = relationship(
        back_populates="content", cascade="all, delete-orphan", lazy="selectin"
    )
    engagements: Mapped[List["Engagement"]] = relationship(
        back_populates="content", cascade="all, delete-orphan", lazy="selectin"
    )
    audiences: Mapped[List["Audience"]] = relationship(
        back_populates="content", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Content id={self.id} external_id={self.external_id!r} type={self.type}>"


class MetricsSnapshot(Base):
    """Point-in-time reach and watch-time metrics for one video."""

    __tablename__ = "metrics_snapshot"
    __table_args__ = (
        Index("ix_metrics_snapshot_content_captured", "content_id", "captured_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    content_id: Mapped[int] = mapped_column(
        ForeignKey("content.id", ondelete="CASCADE"), nullable=False, index=True
    )
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )

    # All metrics are nullable: the Analytics API omits impressions/CTR for some
    # videos (notably very new ones and some Shorts), and 0 is not the same as
    # "not reported".
    views: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    impressions: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    ctr: Mapped[Optional[float]] = mapped_column(
        Float, nullable=True, doc="Click-through rate as a percentage, e.g. 4.2 == 4.2%."
    )
    watch_time_hours: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    average_view_duration: Mapped[Optional[float]] = mapped_column(
        Float, nullable=True, doc="Average view duration in seconds."
    )

    content: Mapped["Content"] = relationship(back_populates="metrics_snapshots")


class Retention(Base):
    """Audience-retention curve for one video at one capture time."""

    __tablename__ = "retention"
    __table_args__ = (
        Index("ix_retention_content_captured", "content_id", "captured_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    content_id: Mapped[int] = mapped_column(
        ForeignKey("content.id", ondelete="CASCADE"), nullable=False, index=True
    )
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    retention_curve: Mapped[Optional[list[dict[str, Any]]]] = mapped_column(
        JSONB, nullable=True,
        doc=(
            "Ordered points: [{'elapsed_ratio': 0.0-1.0, "
            "'audience_watch_ratio': float, 'relative_retention_performance': float}]."
        ),
    )

    content: Mapped["Content"] = relationship(back_populates="retentions")


class Traffic(Base):
    """One traffic-source slice for a video. Several rows per capture."""

    __tablename__ = "traffic"
    __table_args__ = (
        Index("ix_traffic_content_captured", "content_id", "captured_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    content_id: Mapped[int] = mapped_column(
        ForeignKey("content.id", ondelete="CASCADE"), nullable=False, index=True
    )
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    source: Mapped[str] = mapped_column(
        String(64), nullable=False,
        doc="Analytics insightTrafficSourceType, e.g. YT_SEARCH, BROWSE, SUGGESTED, EXT_URL.",
    )
    percentage: Mapped[Optional[float]] = mapped_column(
        Float, nullable=True, doc="Share of views from this source, 0-100."
    )
    views: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True, doc="Raw view count backing the percentage."
    )

    content: Mapped["Content"] = relationship(back_populates="traffic_sources")


class Engagement(Base):
    """Likes / comments / shares for one video at one capture time."""

    __tablename__ = "engagement"
    __table_args__ = (
        Index("ix_engagement_content_captured", "content_id", "captured_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    content_id: Mapped[int] = mapped_column(
        ForeignKey("content.id", ondelete="CASCADE"), nullable=False, index=True
    )
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    likes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    comments: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    shares: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    content: Mapped["Content"] = relationship(back_populates="engagements")


class Audience(Base):
    """New vs returning viewer split and geography for one video."""

    __tablename__ = "audience"
    __table_args__ = (
        Index("ix_audience_content_captured", "content_id", "captured_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    content_id: Mapped[int] = mapped_column(
        ForeignKey("content.id", ondelete="CASCADE"), nullable=False, index=True
    )
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    new_viewer_percentage: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    returning_viewer_percentage: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    top_countries: Mapped[Optional[list[dict[str, Any]]]] = mapped_column(
        JSONB, nullable=True,
        doc="Ordered: [{'country': 'US', 'views': 1234, 'percentage': 42.1}].",
    )

    content: Mapped["Content"] = relationship(back_populates="audiences")
