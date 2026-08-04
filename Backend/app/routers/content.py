"""Content read routes: list and detail.

Both endpoints deliberately avoid `Content`'s ORM relationships. Those are
declared `lazy="selectin"`, so touching a `Content` entity loads *every*
snapshot ever captured for it, across all five time-series tables — the exact
history the schema accumulates on purpose. That is right for a diagnostic that
wants a trend and catastrophic for a list of cards that wants one number, so
the queries here select columns explicitly and fetch only the latest rows.

"Latest" is resolved in the database, not in Python. The list endpoint uses
Postgres `DISTINCT ON`, which walks the `(content_id, captured_at)` index each
time-series table carries and yields one row per video in a single pass; the
alternative — fetch all snapshots, sort per video in the handler — grows with
history rather than with the page size.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import noload

from app.database import get_db
from app.models import (
    Audience,
    Content,
    ContentType,
    Engagement,
    MetricsSnapshot,
    Retention,
    Traffic,
)
from app.schemas.content import (
    AudienceOut,
    ContentDetail,
    ContentListResponse,
    ContentSummary,
    EngagementOut,
    MetricsSnapshotOut,
    RetentionOut,
    TrafficOut,
)

router = APIRouter(prefix="/content", tags=["Content"])

# Sort keys the list endpoint accepts, mapped to the column each one orders by.
# An allowlist rather than a free-text column name: the value reaches ORDER BY.
_SORT_COLUMNS = {
    "publish_date": Content.publish_date,
    "title": Content.title,
    "created_at": Content.created_at,
}


def _latest_metrics_subquery():
    """One row per video: its most recent `metrics_snapshot`.

    `DISTINCT ON (content_id)` with a matching `ORDER BY` is Postgres's
    first-row-per-group idiom, and it reads straight down the
    `(content_id, captured_at)` index.
    """
    return (
        select(
            MetricsSnapshot.content_id,
            MetricsSnapshot.captured_at,
            MetricsSnapshot.views,
            MetricsSnapshot.watch_time_hours,
        )
        .distinct(MetricsSnapshot.content_id)
        .order_by(MetricsSnapshot.content_id, MetricsSnapshot.captured_at.desc())
        .subquery()
    )


def _apply_filters(
    stmt: Select,
    *,
    content_type: Optional[ContentType],
    search: Optional[str],
) -> Select:
    """Apply the shared filters, so the page and its count cannot disagree."""
    if content_type is not None:
        stmt = stmt.where(Content.type == content_type)
    if search:
        # `ilike` keeps the match case-insensitive; the wildcards are added here
        # rather than expected from the caller. `%`, `_` and the escape
        # character itself are neutralised first — otherwise a search for
        # "my_video" would also match "myXvideo", and one for "50%" would match
        # everything starting with "50".
        pattern = (
            search.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        )
        stmt = stmt.where(Content.title.ilike(f"%{pattern}%", escape="\\"))
    return stmt


@router.get(
    "",
    response_model=ContentListResponse,
    summary="List ingested content with its latest headline metrics",
)
async def list_content(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    content_type: Optional[ContentType] = Query(
        default=None, alias="type", description="Filter to long_form or shorts."
    ),
    search: Optional[str] = Query(
        default=None, description="Case-insensitive substring match on title."
    ),
    sort: str = Query(
        default="publish_date",
        description=f"One of: {', '.join(_SORT_COLUMNS)}.",
    ),
    order: str = Query(default="desc", pattern="^(asc|desc)$"),
) -> ContentListResponse:
    """Return a page of content summaries, newest first by default."""
    if sort not in _SORT_COLUMNS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported sort {sort!r}. Use one of: {', '.join(_SORT_COLUMNS)}.",
        )

    latest = _latest_metrics_subquery()

    stmt = (
        select(
            Content.id,
            Content.external_id,
            Content.platform,
            Content.type,
            Content.title,
            Content.thumbnail_url,
            Content.duration_seconds,
            Content.publish_date,
            latest.c.captured_at.label("latest_captured_at"),
            latest.c.views,
            latest.c.watch_time_hours,
        )
        # Outer join: a video ingested but not yet captured still belongs in the
        # list, with null metrics.
        .outerjoin(latest, latest.c.content_id == Content.id)
    )
    stmt = _apply_filters(stmt, content_type=content_type, search=search)

    sort_column = _SORT_COLUMNS[sort]
    direction = sort_column.desc() if order == "desc" else sort_column.asc()
    # NULLs last either way: a video with no publish date is not the "newest".
    # `Content.id` breaks ties so paging is stable across requests.
    stmt = stmt.order_by(direction.nullslast(), Content.id.desc())

    count_stmt = _apply_filters(
        select(func.count()).select_from(Content),
        content_type=content_type,
        search=search,
    )
    total = (await db.execute(count_stmt)).scalar_one()

    rows = (await db.execute(stmt.limit(limit).offset(offset))).all()
    items = [ContentSummary(**row._mapping) for row in rows]

    return ContentListResponse(total=total, limit=limit, offset=offset, items=items)


async def _latest_row(db: AsyncSession, model, content_id: int):
    """The most recent row of one time-series table for one video."""
    stmt = (
        select(model)
        .where(model.content_id == content_id)
        .order_by(model.captured_at.desc())
        .limit(1)
    )
    return (await db.execute(stmt)).scalar_one_or_none()


async def _latest_traffic(db: AsyncSession, content_id: int) -> list[Traffic]:
    """Every traffic row from the most recent capture.

    Unlike the other tables this one fans out — several sources per capture —
    so the whole group is returned. A source mix only means anything whole.
    """
    latest_at = (
        select(func.max(Traffic.captured_at))
        .where(Traffic.content_id == content_id)
        .scalar_subquery()
    )
    stmt = (
        select(Traffic)
        .where(Traffic.content_id == content_id, Traffic.captured_at == latest_at)
        .order_by(Traffic.views.desc().nullslast())
    )
    return list((await db.execute(stmt)).scalars())


@router.get(
    "/{content_id}",
    response_model=ContentDetail,
    summary="One video with the latest snapshot from each time-series table",
)
async def get_content(
    content_id: int,
    db: AsyncSession = Depends(get_db),
) -> ContentDetail:
    """Return full metadata plus the newest capture of each metric family."""
    # `noload("*")` suppresses the selectin relationship loads; the latest rows
    # are fetched below instead of pulling the entire history.
    content = (
        await db.execute(
            select(Content).where(Content.id == content_id).options(noload("*"))
        )
    ).scalar_one_or_none()

    if content is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No content with id {content_id}.",
        )

    metrics = await _latest_row(db, MetricsSnapshot, content_id)
    engagement = await _latest_row(db, Engagement, content_id)
    retention = await _latest_row(db, Retention, content_id)
    audience = await _latest_row(db, Audience, content_id)
    traffic = await _latest_traffic(db, content_id)

    return ContentDetail(
        id=content.id,
        external_id=content.external_id,
        platform=content.platform,
        type=content.type,
        title=content.title,
        description=content.description,
        tags=content.tags,
        thumbnail_url=content.thumbnail_url,
        duration_seconds=content.duration_seconds,
        publish_date=content.publish_date,
        created_at=content.created_at,
        metrics=MetricsSnapshotOut.model_validate(metrics) if metrics else None,
        engagement=EngagementOut.model_validate(engagement) if engagement else None,
        retention=RetentionOut.model_validate(retention) if retention else None,
        audience=AudienceOut.model_validate(audience) if audience else None,
        traffic=[TrafficOut.model_validate(row) for row in traffic],
    )
