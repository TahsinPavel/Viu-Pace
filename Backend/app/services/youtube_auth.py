"""Google OAuth access-token management for the single connected channel.

ViuPace connects exactly one YouTube channel, whose refresh token is minted
once out-of-band and stored in `.env` (see `Settings.YOUTUBE_REFRESH_TOKEN`).
At runtime that refresh token is exchanged for a short-lived access token,
which is cached in process memory until shortly before it expires.

The cache is a module-level singleton guarded by an `asyncio.Lock`: an
ingestion run fires many concurrent API calls, and without the lock each of
them would race to mint its own token. Google tolerates that but it wastes a
round-trip per call and burns refresh-token quota for no reason.
"""

import asyncio
import logging
import time
from dataclasses import dataclass
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"

# Refresh this many seconds before the token actually expires. A request that
# starts life valid can still arrive at Google after expiry; the margin keeps a
# long-running batch from tripping over that boundary.
_EXPIRY_MARGIN_SECONDS = 120

# Fallback lifetime if Google omits `expires_in` (it never has, but treating a
# missing value as "already expired" would spin, and as "never expires" would
# wedge the run on 401s).
_DEFAULT_EXPIRES_IN = 3600


class YouTubeAuthError(RuntimeError):
    """Raised when an access token cannot be obtained."""


class YouTubeAPIError(RuntimeError):
    """A Google API call returned a non-2xx response.

    Lives here rather than in the two client modules because both of them raise
    it, and because the retry that precedes it is an auth concern.
    """

    def __init__(self, status_code: int, message: str, url: str) -> None:
        super().__init__(f"{url} -> HTTP {status_code}: {message}")
        self.status_code = status_code
        self.message = message
        self.url = url


@dataclass
class _CachedToken:
    access_token: str
    expires_at: float  # time.monotonic() reference point, not wall clock

    @property
    def is_valid(self) -> bool:
        return time.monotonic() < self.expires_at - _EXPIRY_MARGIN_SECONDS


class TokenManager:
    """Exchanges the stored refresh token for access tokens, and caches them."""

    def __init__(self) -> None:
        self._cached: _CachedToken | None = None
        self._lock = asyncio.Lock()

    async def get_access_token(self, force_refresh: bool = False) -> str:
        """Return a valid access token, refreshing only when the cache is stale."""
        if not force_refresh and self._cached is not None and self._cached.is_valid:
            return self._cached.access_token

        async with self._lock:
            # Re-check inside the lock: whoever held it before us may have
            # already refreshed, in which case there is nothing left to do.
            if not force_refresh and self._cached is not None and self._cached.is_valid:
                return self._cached.access_token
            self._cached = await self._refresh()
            return self._cached.access_token

    async def _refresh(self) -> _CachedToken:
        if not settings.youtube_configured:
            raise YouTubeAuthError(
                "YouTube credentials are not configured. Set YOUTUBE_CLIENT_ID, "
                "YOUTUBE_CLIENT_SECRET and YOUTUBE_REFRESH_TOKEN in Backend/.env."
            )

        payload = {
            "client_id": settings.YOUTUBE_CLIENT_ID,
            "client_secret": settings.YOUTUBE_CLIENT_SECRET,
            "refresh_token": settings.YOUTUBE_REFRESH_TOKEN,
            "grant_type": "refresh_token",
        }

        # Read the clock before the call, not after: counting the round-trip as
        # part of the lifetime errs toward refreshing early, which is safe.
        issued_at = time.monotonic()
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(GOOGLE_TOKEN_URL, data=payload)
        except httpx.HTTPError as exc:
            raise YouTubeAuthError(f"Token request to Google failed: {exc}") from exc

        if response.status_code != 200:
            # Google returns {"error": "invalid_grant", "error_description": ...}
            # for a revoked or expired refresh token — the most common real
            # failure here, and one no retry will fix.
            raise YouTubeAuthError(
                f"Token refresh rejected by Google (HTTP {response.status_code}): "
                f"{response.text}"
            )

        body = response.json()
        access_token = body.get("access_token")
        if not access_token:
            raise YouTubeAuthError(f"Token response contained no access_token: {body}")

        expires_in = body.get("expires_in") or _DEFAULT_EXPIRES_IN
        logger.info("Refreshed YouTube access token, valid for %ss", expires_in)
        return _CachedToken(
            access_token=access_token,
            expires_at=issued_at + float(expires_in),
        )

    def invalidate(self) -> None:
        """Drop the cached token so the next call mints a fresh one."""
        self._cached = None


# Process-wide singleton. Every service module shares this cache.
token_manager = TokenManager()


async def get_access_token(force_refresh: bool = False) -> str:
    """Module-level convenience wrapper around the shared `token_manager`."""
    return await token_manager.get_access_token(force_refresh=force_refresh)


async def get_auth_headers() -> dict[str, str]:
    """Authorization header for a Google API call, using the cached token."""
    return {"Authorization": f"Bearer {await get_access_token()}"}


async def authorized_get(
    url: str,
    params: dict[str, Any],
    *,
    timeout: float = 60.0,
) -> dict[str, Any]:
    """GET a Google API endpoint with the cached token, retrying once on 401.

    A 401 mid-run means the cached token died earlier than its stated expiry
    (revocation, a password change, a clock skew wider than the margin). The
    single forced-refresh retry turns that into a hiccup instead of a failed
    ingestion run. Every other status is surfaced as `YouTubeAPIError` — callers
    decide what is fatal and what is a per-video "not reported".
    """
    for attempt in (1, 2):
        token = await get_access_token(force_refresh=attempt == 2)
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.get(
                    url,
                    params=params,
                    headers={"Authorization": f"Bearer {token}"},
                )
        except httpx.HTTPError as exc:
            raise YouTubeAPIError(0, f"transport error: {exc}", url) from exc

        if response.status_code == 401 and attempt == 1:
            logger.warning("Got 401 from %s, refreshing token and retrying once", url)
            continue

        if response.status_code != 200:
            raise YouTubeAPIError(response.status_code, response.text, url)

        return response.json()

    # Unreachable: the loop either returns or raises on the second attempt.
    raise YouTubeAPIError(401, "unauthorized after token refresh", url)
