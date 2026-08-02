import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { STAMP } from "./tokens";

interface FigureFrameProps {
  /** The single mono designator for this exhibit, e.g. "BOREDOM LOCATOR". */
  stamp: string;
  /** One plain sentence naming what the reader is looking at. */
  caption: string;
  className?: string;
  children: ReactNode;
}

/**
 * Every marketing visual is a real mini-instrument rather than a picture of one,
 * so each ships the same three parts as a docket exhibit: a stamp, the
 * instrument, and a caption that says in plain words what is on screen.
 *
 * The caption is not decoration. A reader who cannot interpret the chart still
 * gets the finding from the sentence underneath it.
 */
export function FigureFrame({
  stamp,
  caption,
  className,
  children,
}: FigureFrameProps) {
  return (
    <figure className={cn("m-0", className)}>
      <div className="mb-3 flex items-center gap-3">
        <span className={cn(STAMP, "text-ink-muted")}>{stamp}</span>
        <span aria-hidden className="h-px flex-1 bg-rule" />
        <span className={cn(STAMP, "text-ink-muted")}>Sample</span>
      </div>

      {children}

      <figcaption className="mt-3 max-w-[60ch] text-[0.8125rem] leading-relaxed text-ink-secondary">
        {caption}
      </figcaption>
    </figure>
  );
}
