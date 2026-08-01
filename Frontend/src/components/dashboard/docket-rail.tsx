import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * The docket rail. One platform: YouTube. Facebook and Instagram are future
 * platforms and are deliberately absent — a disabled row for an unbuilt
 * integration is a promise the MVP has not made.
 *
 * The active item carries the 2px Signal Magenta left marker, which DESIGN.md
 * names as the sole exception to the colour-edge rule because it marks
 * position, not severity.
 */
export function DocketRail() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-rule bg-panel lg:flex">
        <div className="border-b border-rule px-5 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-sm text-[0.75rem] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to home
          </Link>
          <p className="mt-3 text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink">
            ViuPace
          </p>
        </div>

        <nav aria-label="Platforms" className="min-h-0 flex-1 overflow-y-auto p-3">
          <h2 className="px-2 pt-2 pb-2 font-mono text-[0.625rem] tracking-[0.08em] text-ink-muted uppercase">
            Platforms
          </h2>
          <ul>
            <li>
              <a
                href="#channel"
                aria-current="page"
                className="relative flex items-center gap-2.5 rounded-sm bg-paper px-2.5 py-2 text-[0.8125rem] font-medium text-ink transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-0 w-[2px] rounded-full bg-signal"
                />
                <YouTubeGlyph className="size-5 shrink-0" />
                YouTube
              </a>
            </li>
          </ul>
        </nav>

        <p className="border-t border-rule px-5 py-3 font-mono text-[0.625rem] leading-relaxed tracking-[0.04em] text-ink-muted uppercase">
          Demonstration data
        </p>
      </aside>

      {/* Below lg the rail becomes a top bar; labels persist and glyphs shrink. */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-rule bg-panel px-5 py-3 lg:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-sm text-[0.75rem] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Home
        </Link>
        <nav aria-label="Platforms">
          <a
            href="#channel"
            aria-current="page"
            className="inline-flex items-center gap-1.5 rounded-sm bg-paper px-2 py-1 text-[0.8125rem] font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            <YouTubeGlyph className="size-4 shrink-0" />
            YouTube
          </a>
        </nav>
      </div>
    </>
  );
}

/** lucide-react v1 dropped brand marks, so the source glyph is inline. */
function YouTubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
