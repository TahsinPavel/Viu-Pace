from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine
from app.routers import content, health, ingest


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

app.include_router(health.router)
app.include_router(ingest.router)
app.include_router(content.router)
