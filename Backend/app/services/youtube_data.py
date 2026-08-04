"""YouTube Data API v3 client: channel, playlist and video metadata.

Transport choice: direct HTTP via `httpx`, not `google-api-python-client`.
Three reasons, in order of weight:

1. `google-api-python-client` is synchronous only. This service is async top to
   bottom (async SQLAlchemy, async FastAPI), so every call would have to be
   pushed through `run_in_executor`, and the library's discovery-document
   machinery is not thread-safe in a way that makes that pleasant.
2. We already mint bearer tokens ourselves in `youtube_auth`. A raw HTTP client
   reuses that cache directly; the Google client would want its own credentials
   object wrapping the same refresh token.
3. The surface actually needed here is three endpoints. The dependency would
   cost more in install weight and indirection than it saves in code.

`httpx` was already present in the venv; it is now pinned in requirements.txt
because this module depends on it directly rather than transitively.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional

from app.models import ContentType
from app.services.youtube_auth import authorized_get

logger = logging.getLogger(__name__)

DATA_API_BASE = "https://www.googleapis.com/youtube/v3"

# The Data API caps both playlistItems.list and videos.list at 50 ids per call.
MAX_RESULTS_PER_PAGE = 50

# Shorts threshold: a video is classified as SHORTS when duration_seconds <= 180
# (3 minutes), which is YouTube's own maximum Shorts length since October 2024.
#
# Known limitation, recorded here rather than hidden: duration alone
# over-classifies. A genuinely short long-form upload (a 2-minute tutorial, say)
# is indistinguishable from a Short by duration, and the Data API exposes no
# `isShort` field. The reliable signals are aspect ratio, which needs frame
# access that PRODUCT.md rules out, or probing youtube.com/shorts/{id} for a
# non-redirect, which is scraping rather than API use. 180s is the best
# API-only approximation available, and it is deliberately the *outer* bound so
# real Shorts are never misfiled as long-form.
SHORTS_MAX_DURATION_SECONDS = 180

# ISO-8601 durations as the Data API emits them: PT4M13S, PT1H2M3S, PT0S, and
# for multi-hour livestream archives P1DT2H30M. Weeks are in the grammar and
# cost nothing to accept.
_ISO_8601_DURATION = re.compile(
    r"^P"
    r"(?:(?P<weeks>\d+)W)?"
    r"(?:(?P<days>\d+)D)?"
    r"(?:T"
    r"(?:(?P<hours>\d+)H)?"
    r"(?:(?P<minutes>\d+)M)?"
    r"(?:(?P<seconds>\d+(?:\.\d+)?)S)?"
    r")?$"
)

# Preference order for snippet.thumbnails. Not every video carries every size:
# maxres in particular only exists once YouTube has generated it.
_THUMBNAIL_PREFERENCE = ("maxres", "standard", "high", "medium", "default")


@dataclass
class VideoMetadata:
    """One video's Data API facts, shaped to match the `Content` model's columns."""

    external_id: str
    title: str
    description: Optional[str]
    tags: Optional[list[str]]
    thumbnail_url: Optional[str]
    publish_date: Optional[datetime]
    duration_seconds: Optional[int]
    type: ContentType


def parse_iso8601_duration(value: Optional[str]) -> Optional[int]:
    """Convert an ISO-8601 duration such as `PT4M13S` to whole seconds.

    Returns None for a missing or unparseable value rather than 0: the `Content`
    model keeps `duration_seconds` nullable precisely because "not reported" and
    "zero seconds" are different facts.
    """
    if not value:
        return None

    match = _ISO_8601_DURATION.match(value)
    if not match:
        logger.warning("Unparseable ISO-8601 duration %r", value)
        return None

    parts = {key: float(raw) for key, raw in match.groupdict().items() if raw}
    total = (
        parts.get("weeks", 0) * 604800
        + parts.get("days", 0) * 86400
        + parts.get("hours", 0) * 3600
        + parts.get("minutes", 0) * 60
        + parts.get("seconds", 0)
    )
    return int(total)


def classify_content_type(duration_seconds: Optional[int]) -> ContentType:
    """Long-form vs Shorts from duration. See SHORTS_MAX_DURATION_SECONDS."""
    if duration_seconds is None:
        # Unknown duration defaults to long-form: the long-form diagnostic
        # thresholds are the gentler of the two, so a misfiled video produces a
        # weaker report rather than a wrong one built on 3-second checkpoints.
        return ContentType.LONG_FORM
    return (
        ContentType.SHORTS
        if duration_seconds <= SHORTS_MAX_DURATION_SECONDS
        else ContentType.LONG_FORM
    )


def _parse_published_at(value: Optional[str]) -> Optional[datetime]:
    """Parse `snippet.publishedAt` (RFC-3339, e.g. `2024-05-01T12:00:00Z`)."""
    if not value:
        return None
    try:
        # Python 3.11+ accepts the trailing `Z` directly.
        return datetime.fromisoformat(value)
    except ValueError:
        logger.warning("Unparseable publishedAt %r", value)
        return None


def _pick_thumbnail(thumbnails: dict[str, Any]) -> Optional[str]:
    """Highest-resolution thumbnail the API actually returned for this video."""
    for size in _THUMBNAIL_PREFERENCE:
        url = (thumbnails.get(size) or {}).get("url")
        if url:
            return url
    return None


async def get_uploads_playlist_id() -> str:
    """Return the connected channel's "uploads" playlist id.

    Every channel has an auto-maintained uploads playlist that contains all of
    its public videos; listing that playlist is the supported way to enumerate a
    channel, and it costs 1 quota unit against search.list's 100.
    """
    payload = await authorized_get(
        f"{DATA_API_BASE}/channels",
        {"part": "contentDetails,snippet", "mine": "true"},
    )

    items = payload.get("items") or []
    if not items:
        raise RuntimeError(
            "The authorized Google account has no YouTube channel. Check that the "
            "refresh token was minted for the account that owns the channel."
        )

    channel = items[0]
    uploads = (
        channel.get("contentDetails", {})
        .get("relatedPlaylists", {})
        .get("uploads")
    )
    if not uploads:
        raise RuntimeError(f"Channel {channel.get('id')} exposes no uploads playlist.")

    logger.info(
        "Resolved channel %s (%s) -> uploads playlist %s",
        channel.get("snippet", {}).get("title", "?"),
        channel.get("id"),
        uploads,
    )
    return uploads


async def list_playlist_video_ids(
    playlist_id: str,
    max_videos: Optional[int] = None,
) -> list[str]:
    """List every video id in a playlist, following pagination to the end.

    `max_videos` caps the walk for development runs against large channels; None
    means the whole playlist.
    """
    video_ids: list[str] = []
    page_token: Optional[str] = None

    while True:
        params: dict[str, Any] = {
            "part": "contentDetails",
            "playlistId": playlist_id,
            "maxResults": MAX_RESULTS_PER_PAGE,
        }
        if page_token:
            params["pageToken"] = page_token

        payload = await authorized_get(f"{DATA_API_BASE}/playlistItems", params)

        for item in payload.get("items") or []:
            video_id = (item.get("contentDetails") or {}).get("videoId")
            if video_id:
                video_ids.append(video_id)

        if max_videos is not None and len(video_ids) >= max_videos:
            video_ids = video_ids[:max_videos]
            break

        page_token = payload.get("nextPageToken")
        if not page_token:
            break

    logger.info("Playlist %s contains %d videos", playlist_id, len(video_ids))
    return video_ids


async def fetch_video_metadata(video_ids: list[str]) -> list[VideoMetadata]:
    """Fetch full metadata for a batch of video ids, 50 per request."""
    results: list[VideoMetadata] = []

    for start in range(0, len(video_ids), MAX_RESULTS_PER_PAGE):
        batch = video_ids[start:start + MAX_RESULTS_PER_PAGE]
        payload = await authorized_get(
            f"{DATA_API_BASE}/videos",
            {"part": "snippet,contentDetails", "id": ",".join(batch)},
        )

        for item in payload.get("items") or []:
            snippet = item.get("snippet") or {}
            content_details = item.get("contentDetails") or {}
            duration_seconds = parse_iso8601_duration(content_details.get("duration"))

            results.append(
                VideoMetadata(
                    external_id=item["id"],
                    title=snippet.get("title") or "(untitled)",
                    description=snippet.get("description") or None,
                    tags=snippet.get("tags") or None,
                    thumbnail_url=_pick_thumbnail(snippet.get("thumbnails") or {}),
                    publish_date=_parse_published_at(snippet.get("publishedAt")),
                    duration_seconds=duration_seconds,
                    type=classify_content_type(duration_seconds),
                )
            )

        # videos.list silently omits ids it cannot return (deleted, private, or
        # belonging to another channel). Log the gap so ingestion counts add up.
        returned = {item["id"] for item in payload.get("items") or []}
        missing = [vid for vid in batch if vid not in returned]
        if missing:
            logger.warning("videos.list returned no data for %d id(s): %s", len(missing), missing)

    return results


async def fetch_channel_videos(max_videos: Optional[int] = None) -> list[VideoMetadata]:
    """Convenience: uploads playlist -> video ids -> full metadata, in one call."""
    playlist_id = await get_uploads_playlist_id()
    video_ids = await list_playlist_video_ids(playlist_id, max_videos=max_videos)
    if not video_ids:
        return []
    return await fetch_video_metadata(video_ids)
