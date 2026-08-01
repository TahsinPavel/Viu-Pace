"use client";

import Image from "next/image";
import { CircleCheck, Flag, TriangleAlert } from "lucide-react";
import {
  CONTENT_TYPE_LABEL,
  STATUS_LABEL,
  formatCount,
  type VideoStatus,
  type VideoSummary,
} from "@/lib/mock/diagnostics";

/**
 * Status is never carried by colour alone: every chip pairs a distinct glyph
 * with a written label, so the queue stays readable under any colour vision.
 */
const STATUS_MARK: Record<
  VideoStatus,
  { Icon: typeof Flag; text: string; field: string }
> = {
  flagged: { Icon: Flag, text: "text-drop", field: "bg-drop-field" },
  underperforming: {
    Icon: TriangleAlert,
    text: "text-caution",
    field: "bg-caution-field",
  },
  healthy: { Icon: CircleCheck, text: "text-rewatch", field: "bg-rewatch-field" },
};

interface VideoQueueProps {
  videos: VideoSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Wired to the content-type tab that owns this list. */
  labelledBy?: string;
}

export function VideoQueue({
  videos,
  selectedId,
  onSelect,
  labelledBy,
}: VideoQueueProps) {
  if (videos.length === 0) {
    return (
      <p className="rounded-lg border border-rule px-4 py-6 text-center text-[0.8125rem] text-ink-secondary">
        No uploads of this type in the current window.
      </p>
    );
  }

  return (
    <ul
      aria-labelledby={labelledBy}
      className="divide-y divide-rule overflow-hidden rounded-xl border border-rule"
    >
      {videos.map((video) => {
        const { Icon, text, field } = STATUS_MARK[video.status];
        const isSelected = video.id === selectedId;
        return (
          <li key={video.id}>
            <button
              type="button"
              onClick={() => onSelect(video.id)}
              aria-current={isSelected ? "true" : undefined}
              className={`relative flex w-full items-start gap-3 px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal ${
                isSelected ? "bg-signal-field" : "hover:bg-field"
              }`}
            >
              {isSelected && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[2px] bg-signal"
                />
              )}

              <span className="relative w-[88px] shrink-0 overflow-hidden rounded-sm bg-field">
                <Image
                  src={video.thumbnail}
                  alt=""
                  width={88}
                  height={50}
                  className="aspect-video h-auto w-full object-cover"
                  unoptimized
                />
                <span className="absolute right-0.5 bottom-0.5 rounded-[3px] bg-plate/90 px-1 font-mono text-[0.5625rem] text-plate-ink tabular-nums">
                  {video.duration}
                </span>
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={`line-clamp-2 text-[0.8125rem] leading-snug ${
                    isSelected ? "font-medium text-ink" : "text-ink-secondary"
                  }`}
                >
                  {video.title}
                </span>

                <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[0.625rem] tracking-[0.02em] ${field} ${text}`}
                  >
                    <Icon className="size-2.5" aria-hidden />
                    {STATUS_LABEL[video.status]}
                  </span>
                  <span className="font-mono text-[0.625rem] text-ink-muted">
                    {CONTENT_TYPE_LABEL[video.contentType]}
                  </span>
                  <span className="font-mono text-[0.625rem] text-ink-muted tabular-nums">
                    {formatCount(video.views)} views
                  </span>
                  <span className="font-mono text-[0.625rem] text-ink-muted tabular-nums">
                    {video.publishedAt}
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
