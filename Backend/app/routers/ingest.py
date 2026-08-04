"""Ingestion trigger routes.

Ingestion is exposed two ways because the run time depends on the channel.
`POST /ingest` runs inline and returns the counts, which is what you want in
development and for a channel of a few dozen videos. `POST /ingest/async` hands
the same work to a background task and returns 202 immediately, because a
several-hundred-video channel costs four Analytics requests per video and will
outlive any sensible HTTP timeout.

The two differ in session ownership as well as timing. The inline route uses
the request-scoped `get_db()` session, which commits when the handler returns
cleanly. The background route cannot: that session is closed the moment the
response is sent, so `run_ingestion_job` opens and commits its own.

Failures are mapped rather than left to surface as 500s. A missing or rejected
credential is a configuration problem the caller can act on, so it answers 503;
an error from Google itself is an upstream failure, so it answers 502.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.schemas.content import (
    IngestionAccepted,
    IngestionRequest,
    IngestionResultOut,
)
from app.services.ingestion import ingest_channel, run_ingestion_job
from app.services.youtube_analytics import EARLIEST_ANALYTICS_DATE
from app.services.youtube_auth import YouTubeAPIError, YouTubeAuthError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ingest", tags=["Ingestion"])


def _require_credentials() -> None:
    """Reject the request early when the channel credentials are absent.

    Without this the failure would happen several seconds in, after the first
    token exchange, and read as an upstream error rather than the local
    configuration gap it is.
    """
    if not settings.youtube_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "YouTube credentials are not configured. Set YOUTUBE_CLIENT_ID, "
                "YOUTUBE_CLIENT_SECRET and YOUTUBE_REFRESH_TOKEN in Backend/.env."
            ),
        )


def _window(options: IngestionRequest) -> dict[str, object]:
    """Normalize the optional analytics window into service-layer kwargs."""
    return {
        "max_videos": options.max_videos,
        "concurrency": options.concurrency,
        "start_date": options.start_date or EARLIEST_ANALYTICS_DATE,
        "end_date": options.end_date,
    }


@router.post(
    "",
    response_model=IngestionResultOut,
    summary="Ingest the connected channel and wait for the result",
)
async def trigger_ingestion(
    options: IngestionRequest = IngestionRequest(),
    db: AsyncSession = Depends(get_db),
) -> IngestionResultOut:
    """Run ingestion inline and return what it wrote.

    The commit is left to `get_db()`, which owns the request transaction.
    """
    _require_credentials()

    try:
        result = await ingest_channel(db, **_window(options))
    except YouTubeAuthError as exc:
        # The credentials are present but Google refused them — a revoked or
        # mistyped secret, or a refresh token minted for another account.
        logger.error("Ingestion aborted: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"YouTube authorization failed: {exc}",
        ) from exc
    except YouTubeAPIError as exc:
        logger.error("Ingestion aborted on an upstream error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"YouTube API error: {exc}",
        ) from exc

    return IngestionResultOut(
        captured_at=result.captured_at,
        videos_seen=result.videos_seen,
        content_created=result.content_created,
        content_updated=result.content_updated,
        metrics_rows=result.metrics_rows,
        retention_rows=result.retention_rows,
        traffic_rows=result.traffic_rows,
        engagement_rows=result.engagement_rows,
        audience_rows=result.audience_rows,
        snapshot_rows=result.snapshot_rows,
        degraded_videos=result.degraded_videos,
    )


@router.post(
    "/async",
    response_model=IngestionAccepted,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Start ingestion in the background and return immediately",
)
async def trigger_ingestion_async(
    background_tasks: BackgroundTasks,
    options: IngestionRequest = IngestionRequest(),
) -> IngestionAccepted:
    """Queue an ingestion run and acknowledge it.

    There is no job registry yet, so the run reports only to the server log.
    Progress is observable through `GET /content`, whose rows gain a newer
    `latest_captured_at` as the run lands.
    """
    _require_credentials()

    background_tasks.add_task(run_ingestion_job, **_window(options))
    return IngestionAccepted(
        detail=(
            "Ingestion started in the background. Watch the server log for the "
            "result, or poll GET /content for a newer latest_captured_at."
        )
    )


@router.get(
    "/status",
    summary="Report whether ingestion is currently possible",
)
async def ingestion_status() -> dict[str, object]:
    """Check credentials without running an ingestion.

    Deliberately goes as far as exchanging the refresh token: `youtube_configured`
    only proves three strings are non-empty, and the failure this most often
    needs to catch is a secret that is present but wrong.
    """
    if not settings.youtube_configured:
        missing = [
            name
            for name, value in (
                ("YOUTUBE_CLIENT_ID", settings.YOUTUBE_CLIENT_ID),
                ("YOUTUBE_CLIENT_SECRET", settings.YOUTUBE_CLIENT_SECRET),
                ("YOUTUBE_REFRESH_TOKEN", settings.YOUTUBE_REFRESH_TOKEN),
            )
            if not value
        ]
        return {
            "configured": False,
            "authorized": False,
            "missing": missing,
            "detail": "Set the missing values in Backend/.env.",
        }

    # Imported here so the module has no import-time dependency on a live token.
    from app.services.youtube_auth import get_access_token

    try:
        await get_access_token()
    except YouTubeAuthError as exc:
        return {
            "configured": True,
            "authorized": False,
            "missing": [],
            "detail": str(exc),
        }

    return {
        "configured": True,
        "authorized": True,
        "missing": [],
        "detail": "Credentials accepted by Google; ingestion can run.",
    }
