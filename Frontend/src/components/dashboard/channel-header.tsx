import Image from "next/image";
import { channel, formatCount } from "@/lib/mock/diagnostics";

/**
 * The connected-account header. The connect action is a real primary — ink on
 * paper, per DESIGN.md, which reserves black for primary actions precisely so
 * the magenta accent stays rare. It is the loudest thing in this strip and
 * still quieter than the report verdict below it, which is where the creator's
 * attention is supposed to land.
 */
export function ChannelHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={channel.avatar}
          alt=""
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-full bg-field object-cover ring-1 ring-rule"
          unoptimized
        />
        <div className="min-w-0">
          <p className="truncate text-[1.0625rem] leading-tight font-semibold tracking-[-0.015em] text-ink">
            {channel.name}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 font-mono text-[0.6875rem] text-ink-muted tabular-nums">
            <span>{formatCount(channel.subscribers)} subscribers</span>
            <span aria-hidden className="text-rule-strong">
              ·
            </span>
            <span>{channel.handle}</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex h-8 shrink-0 items-center gap-2 rounded-md bg-ink px-3 text-[0.8125rem] font-medium text-paper transition-colors hover:bg-[#2b3238] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-signal/50 active:translate-y-px"
      >
        {/* lucide-react v1 dropped brand marks, so the source glyph is inline */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        Connect YouTube
      </button>
    </div>
  );
}
