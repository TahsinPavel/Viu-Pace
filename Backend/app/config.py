from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict

# libpq connection parameters that asyncpg's connect() does not accept as
# keyword arguments. Neon's copy-paste connection strings carry these, and
# asyncpg raises TypeError if they survive in the DSN, so they are stripped from
# the URL and re-applied through `async_connect_args`.
_LIBPQ_ONLY_PARAMS = frozenset({"sslmode", "channel_binding"})


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/viupace"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    APP_NAME: str = "ViuPace API"
    DEBUG: bool = True

    # Single-channel YouTube OAuth credentials. The refresh token is minted once
    # out-of-band and exchanged for short-lived access tokens at runtime.
    YOUTUBE_CLIENT_ID: str = ""
    YOUTUBE_CLIENT_SECRET: str = ""
    YOUTUBE_REFRESH_TOKEN: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def async_database_url(self) -> str:
        """Database URL using the asyncpg driver, with libpq-only params removed.

        A pasted Neon string looks like
        `postgresql://user:pw@host/neondb?sslmode=require&channel_binding=require`.
        Two things have to change before SQLAlchemy's async engine can use it:
        the driver has to be `postgresql+asyncpg`, and `sslmode`/`channel_binding`
        have to come out of the query string — asyncpg's `connect()` takes `ssl=`
        instead and raises `TypeError: connect() got an unexpected keyword
        argument 'sslmode'` if they are left in. See `async_connect_args`, which
        re-applies the TLS requirement.
        """
        url = self.DATABASE_URL
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)

        parts = urlsplit(url)
        kept = [
            (key, value)
            for key, value in parse_qsl(parts.query, keep_blank_values=True)
            if key.lower() not in _LIBPQ_ONLY_PARAMS
        ]
        return urlunsplit(parts._replace(query=urlencode(kept)))

    @property
    def async_connect_args(self) -> dict[str, object]:
        """asyncpg connect kwargs carrying the TLS mode stripped from the URL.

        asyncpg understands libpq's mode names (`require`, `verify-full`, …) when
        they are passed as `ssl`, so the original intent is preserved rather than
        silently downgraded. Neon requires TLS, so `require` is the default when
        the URL says nothing.
        """
        query = dict(parse_qsl(urlsplit(self.DATABASE_URL).query, keep_blank_values=True))
        sslmode = query.get("sslmode")
        if not sslmode and "neon.tech" not in self.DATABASE_URL:
            return {}
        return {"ssl": sslmode or "require"}

    @property
    def youtube_configured(self) -> bool:
        """True when all three single-channel OAuth credentials are present."""
        return bool(
            self.YOUTUBE_CLIENT_ID
            and self.YOUTUBE_CLIENT_SECRET
            and self.YOUTUBE_REFRESH_TOKEN
        )


settings = Settings()
