"""Health-check routes.

Moved verbatim out of `app.main` so that module stays an app factory. The paths,
tags, payloads and status codes are unchanged: `/`, `/health`, `/health/db`.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db

router = APIRouter(tags=["Health Check"])


@router.get("/")
async def root():
    return {
        "status": "online",
        "app_name": settings.APP_NAME,
        "message": "Welcome to ViuPace API"
    }


@router.get("/health")
async def health_check():
    return {"status": "ok"}


@router.get("/health/db")
async def database_health_check(db: AsyncSession = Depends(get_db)):
    """Test async connectivity to Neon PostgreSQL database."""
    try:
        result = await db.execute(text("SELECT 1"))
        val = result.scalar()
        if val == 1:
            return {
                "database_status": "connected",
                "provider": "Neon PostgreSQL",
                "message": "Async database connection successful"
            }
        raise Exception("Unexpected query result")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection error: {str(e)}"
        )
