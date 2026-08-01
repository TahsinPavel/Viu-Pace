# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two independent apps, no shared build tooling and no monorepo runner. Always `cd` into the app you're working on.

- `Frontend/` — Next.js 16 App Router client (TypeScript, React 19, Tailwind v4)
- `Backend/` — FastAPI service (async SQLAlchemy → Neon serverless PostgreSQL)

`PRODUCT.md` at the root is the product brief (written by the `impeccable` skill, marked `impeccable:product-schema`). It defines ViuPace's purpose, users, and brand commitments — read it before making product or visual decisions, and don't rewrite it as a side effect of another task.

## Commands

Frontend (from `Frontend/`):
```bash
npm run dev      # next dev
npm run build    # next build
npm run start    # next start (requires a prior build)
npm run lint     # eslint (flat config; note: bare `eslint`, not `next lint`)
```

Backend (from `Backend/`, venv is committed in-tree at `Backend/venv`):
```bash
source venv/Scripts/activate            # Windows/Git Bash; venv/bin/activate elsewhere
uvicorn app.main:app --reload           # dev server on :8000
pip install -r requirements.txt
```

Health endpoints for verifying the backend: `GET /`, `GET /health`, and `GET /health/db` (executes `SELECT 1` against Neon and returns 503 on failure). Interactive docs at `/docs`.

No test suite or type-check script exists in either app yet. TypeScript is `noEmit` + `strict`, so type errors surface via `npm run build`.

## Frontend architecture

**This is Next.js 16, which has breaking changes from earlier versions.** `Frontend/AGENTS.md` (loaded via `Frontend/CLAUDE.md`) makes this a hard requirement: read the relevant guide under `Frontend/node_modules/next/dist/docs/` before writing App Router code, and honor deprecation notices. Do not rely on Next.js 14/15 conventions from memory.

- `src/app/` — App Router. `layout.tsx` is the only place fonts (`next/font` Geist + Geist Mono) and global metadata are set. `page.tsx` is a pure composition of section components; `dashboard/page.tsx` is the app shell (fixed left panel + currently-blank main area).
- `src/components/` — page sections (hero, features, pricing, testimonials, cta-section, footer, navbar, dashboard-preview). Server Components by default; only add `"use client"` on leaves that need state (see `navbar.tsx`).
- `src/components/ui/` — shadcn primitives. `components.json` sets style `base-nova`, `rsc: true`, baseColor `neutral`, and `iconLibrary: lucide`. **These primitives are built on `@base-ui/react`, not Radix** — e.g. `button.tsx` wraps `@base-ui/react/button`. Add components with `npx shadcn@latest add <name>` so the registry style stays consistent.
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge). Path alias is `@/*` → `./src/*`.

**Known token gap:** `src/components/ui/*` use semantic Tailwind tokens (`bg-primary`, `border-border`, `text-muted-foreground`, `--radius-md`, `ring`, `destructive`), but `src/app/globals.css` only defines `--background` and `--foreground`. The shadcn token layer was never installed. Page sections work around this with literal Zinc/blue utility classes. If you touch `ui/` components or add new ones, define the full token set in `globals.css` under `@theme inline` first rather than layering more literal colors on top.

Styling is Tailwind v4 via `@tailwindcss/postcss` — there is no `tailwind.config.js`; theme lives in `globals.css` (`@import "tailwindcss"` + `@theme inline`).

## Backend architecture

Three modules, deliberately thin:

- `app/config.py` — pydantic-settings `Settings` read from `Backend/.env` (see `.env.example`). The `async_database_url` property normalizes `postgresql://` / `postgres://` to `postgresql+asyncpg://`, so a raw Neon connection string can be pasted in unmodified. `DEBUG` also drives SQLAlchemy `echo`.
- `app/database.py` — the async engine (`pool_pre_ping=True`, `pool_recycle=300`, tuned for Neon's serverless connection behavior), `AsyncSessionLocal`, the `Base` declarative class for models, and the `get_db()` dependency. `get_db()` **commits on successful exit and rolls back on exception** — route handlers should not commit themselves.
- `app/main.py` — app factory with a `lifespan` handler that disposes the engine on shutdown, permissive CORS (`allow_origins=["*"]`, flagged for production tightening), and the health routes.

There are no models, routers, or migrations yet. When adding them, subclass `Base` from `app/database.py`, inject sessions with `Depends(get_db)`, and mount routers on `app` in `main.py`. No migration tool (Alembic) is installed — pick and set one up before relying on `Base.metadata`.

The frontend does not call the backend anywhere yet: there is no `fetch`, no API client, and no `NEXT_PUBLIC_*` base URL. Wiring the two together is greenfield.

## Design skills and hooks

`.agents/skills/` holds two vendored frontend design skills (both git-ignored, tracked via `skills-lock.json`):

- `impeccable` — broad frontend design system with sub-commands (`shape`, `critique`, `audit`, `polish`, `animate`, `layout`, …). Its setup step is `node .agents/skills/impeccable/scripts/context.mjs` once per session, keeping cwd at the project root. It owns `PRODUCT.md` and would own `DESIGN.md` (not yet created).
- `design-taste-frontend` — anti-slop rules for landing pages and marketing surfaces. It is explicitly out of scope for dashboards and dense product UI, so it applies to `src/app/page.tsx` and its sections, not to `dashboard/`.

`.codex/hooks.json` wires the impeccable detector to run after `Edit`/`Write`/`apply_patch` and on `Stop`. That hook is Codex-specific config and is not read by Claude Code; to run the same check manually, invoke the detector script under `.agents/skills/impeccable/scripts/`.

Note that `design-taste-frontend` discourages `lucide-react`, but the project already depends on it and uses it throughout — the existing dependency is the tiebreaker, so keep using Lucide rather than introducing a second icon family.
