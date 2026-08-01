"use client";

import { useId, useMemo, useState } from "react";
import {
  CONTENT_TYPE_LABEL,
  formatTimecode,
  type Checkpoint,
  type ContentType,
  type RetentionPoint,
  type RetentionSegment,
} from "@/lib/mock/diagnostics";

/**
 * The recorder trace. Read on a dark plate so the two mandated status hues
 * (drop / rewatch) carry maximum separation, with the channel-average curve
 * as a dashed reference in the reserved signal ink.
 *
 * Drop and rewatch are never distinguished by colour alone — each carries a
 * filled band, an end marker, and a labelled callout in the list below.
 */

const W = 720;
const H = 260;
const PAD = { top: 26, right: 16, bottom: 30, left: 34 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const DROP = "#c0362c";
const REWATCH = "#0f7a45";
const SIGNAL = "#a5228c";
const TRACE = "#f7f8f9";
const GRID = "#232a31";
const AXIS_INK = "#b3bcc4";

interface RetentionTraceProps {
  curve: RetentionPoint[];
  reference: RetentionPoint[];
  segments: RetentionSegment[];
  checkpoints: Checkpoint[];
  durationSeconds: number;
  contentType: ContentType;
}

export function RetentionTrace({
  curve,
  reference,
  segments,
  checkpoints,
  durationSeconds,
  contentType,
}: RetentionTraceProps) {
  const clipId = useId();
  const [cursor, setCursor] = useState<number | null>(null);

  const x = (t: number) => PAD.left + (t / durationSeconds) * PLOT_W;
  const y = (r: number) => PAD.top + ((100 - r) / 100) * PLOT_H;

  const line = (pts: RetentionPoint[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.t)} ${y(p.r)}`).join(" ");

  const area = (pts: RetentionPoint[]) =>
    `${line(pts)} L${x(pts[pts.length - 1].t)} ${y(0)} L${x(pts[0].t)} ${y(0)} Z`;

  /** Slice the curve to a segment's bounds, so overdraws sit exactly on it. */
  const slices = useMemo(
    () =>
      segments.map((seg) => ({
        seg,
        pts: curve.filter((p) => p.t >= seg.from && p.t <= seg.to),
      })),
    [segments, curve]
  );

  const active = cursor === null ? null : curve[cursor];

  const step = (dir: number) =>
    setCursor((c) => {
      const next = (c ?? 0) + dir;
      return Math.max(0, Math.min(curve.length - 1, next));
    });

  return (
    <figure className="m-0">
      <div className="rounded-xl bg-plate p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label={`Audience retention over ${formatTimecode(durationSeconds)}, with ${segments.filter((s) => s.kind === "drop").length} drop-off and ${segments.filter((s) => s.kind === "rewatch").length} rewatch segments marked. The table below the chart lists every checkpoint value.`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              step(1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              step(-1);
            } else if (e.key === "Escape") {
              setCursor(null);
            }
          }}
          onPointerMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            const t =
              (((e.clientX - box.left) / box.width) * W - PAD.left) / PLOT_W;
            const seconds = t * durationSeconds;
            let best = 0;
            for (let i = 1; i < curve.length; i++) {
              if (
                Math.abs(curve[i].t - seconds) < Math.abs(curve[best].t - seconds)
              )
                best = i;
            }
            setCursor(best);
          }}
          onPointerLeave={() => setCursor(null)}
          onBlur={() => setCursor(null)}
        >
          <defs>
            <clipPath id={clipId}>
              <rect
                x={PAD.left}
                y={PAD.top}
                width={PLOT_W}
                height={PLOT_H + 1}
              />
            </clipPath>
          </defs>

          {/* Gridlines — hairline, solid, behind everything */}
          {[0, 25, 50, 75, 100].map((r) => (
            <g key={r}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(r)}
                y2={y(r)}
                stroke={GRID}
                strokeWidth="1"
              />
              <text
                x={PAD.left - 7}
                y={y(r)}
                fill={AXIS_INK}
                fontSize="9"
                textAnchor="end"
                dominantBaseline="middle"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {r}
              </text>
            </g>
          ))}

          {/* Checkpoint rules — content-type aware positions */}
          {checkpoints.map((cp) => (
            <line
              key={cp.at}
              x1={x(cp.at)}
              x2={x(cp.at)}
              y1={PAD.top}
              y2={y(0)}
              stroke={GRID}
              strokeWidth="1"
            />
          ))}

          <g clipPath={`url(#${clipId})`}>
            {/* Segment bands */}
            {slices.map(({ seg, pts }) =>
              pts.length < 2 ? null : (
                <path
                  key={`band-${seg.from}`}
                  d={area(pts)}
                  fill={seg.kind === "drop" ? DROP : REWATCH}
                  fillOpacity="0.16"
                />
              )
            )}

            {/* Channel average reference */}
            <path
              d={line(reference)}
              fill="none"
              stroke={SIGNAL}
              strokeWidth="1.5"
              strokeDasharray="5 4"
              opacity="0.85"
            />

            {/* The trace */}
            <path
              d={line(curve)}
              fill="none"
              stroke={TRACE}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Segment overdraws, in status ink */}
            {slices.map(({ seg, pts }) =>
              pts.length < 2 ? null : (
                <path
                  key={`over-${seg.from}`}
                  d={line(pts)}
                  fill="none"
                  stroke={seg.kind === "drop" ? DROP : REWATCH}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )
            )}

            {/* Segment end markers — the second encoding for each band */}
            {slices.map(({ seg, pts }) =>
              pts.length < 2 ? null : (
                <circle
                  key={`dot-${seg.from}`}
                  cx={x(pts[pts.length - 1].t)}
                  cy={y(pts[pts.length - 1].r)}
                  r="4"
                  fill={seg.kind === "drop" ? DROP : REWATCH}
                  stroke="#14181c"
                  strokeWidth="2"
                />
              )
            )}
          </g>

          {/* Checkpoint labels */}
          {checkpoints.map((cp, i) => (
            <text
              key={cp.at}
              x={x(cp.at)}
              y={H - 10}
              fill={AXIS_INK}
              fontSize="9"
              textAnchor={
                i === 0 ? "start" : i === checkpoints.length - 1 ? "end" : "middle"
              }
              fontFamily="var(--font-geist-mono), monospace"
            >
              {formatTimecode(cp.at)}
            </text>
          ))}

          {/* Cursor */}
          {active && (
            <g pointerEvents="none">
              <line
                x1={x(active.t)}
                x2={x(active.t)}
                y1={PAD.top}
                y2={y(0)}
                stroke={TRACE}
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.55"
              />
              <circle
                cx={x(active.t)}
                cy={y(active.r)}
                r="4"
                fill={TRACE}
                stroke="#14181c"
                strokeWidth="2"
              />
              <text
                x={Math.min(x(active.t) + 8, W - PAD.right - 74)}
                y={Math.max(y(active.r) - 10, PAD.top + 10)}
                fill={TRACE}
                fontSize="11"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {formatTimecode(active.t)} · {active.r.toFixed(1)}%
              </text>
            </g>
          )}

          <text
            x={PAD.left - 7}
            y={PAD.top - 12}
            fill={AXIS_INK}
            fontSize="9"
            textAnchor="end"
            fontFamily="var(--font-geist-mono), monospace"
          >
            %
          </text>
        </svg>
      </div>

      {/* Legend — each key names its own glyph, not just its colour */}
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.75rem] text-ink-secondary">
        <span className="inline-flex items-center gap-1.5">
          <svg width="18" height="8" aria-hidden>
            <line x1="0" y1="4" x2="18" y2="4" stroke="#14181c" strokeWidth="2" />
          </svg>
          This video
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="18" height="8" aria-hidden>
            <line
              x1="0"
              y1="4"
              x2="18"
              y2="4"
              stroke={SIGNAL}
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
          </svg>
          Channel average, {CONTENT_TYPE_LABEL[contentType]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-drop">
          <span aria-hidden className="size-2.5 rounded-full bg-drop" />
          Drop-off
        </span>
        <span className="inline-flex items-center gap-1.5 text-rewatch">
          <span aria-hidden className="size-2.5 rounded-full bg-rewatch" />
          Rewatch spike
        </span>
        <span className="font-mono text-[0.6875rem] text-ink-muted">
          Arrow keys scrub
        </span>
      </figcaption>
    </figure>
  );
}
