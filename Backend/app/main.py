from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.config import settings
from app.database import get_db, engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions. Plain ASCII: the Windows console defaults to cp1252,
    # which cannot encode emoji, and an exception here aborts startup entirely.
    print(f"Starting {settings.APP_NAME}...")
    yield
    # Shutdown actions
    print(f"Shutting down {settings.APP_NAME}...")
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    description="ViuPace Backend API powered by FastAPI and Neon PostgreSQL",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health Check"])
async def root():
    return {
        "status": "online",
        "app_name": settings.APP_NAME,
        "message": "Welcome to ViuPace API"
    }


@app.get("/health", tags=["Health Check"])
async def health_check():
    return {"status": "ok"}


@app.get("/health/db", tags=["Health Check"])
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
