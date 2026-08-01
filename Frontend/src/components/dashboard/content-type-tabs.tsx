"use client";

import { Clapperboard, Smartphone } from "lucide-react";
import { type ContentType } from "@/lib/mock/diagnostics";

/**
 * The only two content-type options in the MVP. Long-form and Shorts are never
 * ranked against each other — they are judged on different checkpoints — so
 * this is a switch between two lists, not a filter over one.
 *
 * Hand-rolled rather than the base-ui `Tabs` primitive: that one puts a
 * `shadow-sm` under the active trigger, and the Flat Evidence rule takes
 * precedence. Selection is carried by fill, weight, and `aria-selected`.
 */
const TABS: { value: ContentType; label: string; Icon: typeof Smartphone }[] = [
  { value: "shorts", label: "Shorts", Icon: Smartphone },
  { value: "long-form", label: "Long Videos", Icon: Clapperboard },
];

export function ContentTypeTabs({
  value,
  onChange,
  counts,
}: {
  value: ContentType;
  onChange: (next: ContentType) => void;
  counts: Record<ContentType, number>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Content type"
      className="inline-flex items-center gap-1 rounded-lg bg-panel p-1"
    >
      {TABS.map(({ value: tab, label, Icon }) => {
        const selected = tab === value;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${tab}`}
            id={`tab-${tab}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const next = TABS.find((t) => t.value !== value);
                if (next) {
                  onChange(next.value);
                  document.getElementById(`tab-${next.value}`)?.focus();
                }
              }
            }}
            className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[0.8125rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${
              selected
                ? "bg-paper text-ink"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            <Icon className="size-3.5" aria-hidden />
            {label}
            <span className="font-mono text-[0.6875rem] text-ink-muted tabular-nums">
              {counts[tab]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
