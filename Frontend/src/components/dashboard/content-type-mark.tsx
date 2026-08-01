import { Clapperboard, Smartphone } from "lucide-react";
import { CONTENT_TYPE_LABEL, type ContentType } from "@/lib/mock/diagnostics";

/**
 * Content type is never decorative here — the mark states the format *and* the
 * checkpoint window that format is judged against, because the thresholds
 * differ between long-form and Shorts.
 */
export function ContentTypeMark({
  contentType,
  earlyDropWindow,
}: {
  contentType: ContentType;
  earlyDropWindow: number;
}) {
  const Icon = contentType === "shorts" ? Smartphone : Clapperboard;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-plate px-2 py-1 font-mono text-[0.6875rem] tracking-[0.04em] text-plate-ink uppercase">
      <Icon className="size-3" aria-hidden />
      {CONTENT_TYPE_LABEL[contentType]}
      <span className="text-plate-ink-muted">· {earlyDropWindow}s window</span>
    </span>
  );
}
