import { FigureFrame } from "./figure-frame";
import { Legend } from "./legend";
import { MONO, PLATE_GRID, PLATE_INK, PLATE_INK_MUTED, REWATCH } from "./tokens";

/**
 * Virality Blueprint. Shows the one rewatched segment against the full runtime,
 * and how far into the video it sits, which is the actual finding: the moment
 * that worked arrived after most of the audience had gone.
 */

const DURATION = 872;
const SPIKE = { from: 462, to: 498, delta: 5.8 };
const REACHED = 35.4;

const W = 620;
const H = 92;
const PAD_X = 18;
const BAR_Y = 40;
const BAR_H = 26;
const BAR_W = W - PAD_X * 2;

const x = (t: number) => PAD_X + (t / DURATION) * BAR_W;

export function BlueprintMini() {
  return (
    <FigureFrame
      stamp="Virality Blueprint"
      caption="One moment in this video was rewatched: 7:42, where a price is spoken while it is on screen. Only 35 out of every 100 viewers stayed long enough to reach it."
    >
      <div className="rounded-xl bg-plate p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="A 14 minute 32 second runtime bar. One rewatched segment runs from 7:42 to 8:18, gaining 5.8 points of retention. It sits just past the halfway point of the video."
        >
          <text
            x={PAD_X}
            y={20}
            fill={PLATE_INK_MUTED}
            fontSize="10"
            fontFamily={MONO}
          >
            RUNTIME 14:32, REWATCHED SEGMENTS MARKED
          </text>

          <rect
            x={PAD_X}
            y={BAR_Y}
            width={BAR_W}
            height={BAR_H}
            rx="4"
            fill={PLATE_GRID}
          />

          <rect
            x={x(SPIKE.from)}
            y={BAR_Y}
            width={x(SPIKE.to) - x(SPIKE.from)}
            height={BAR_H}
            rx="3"
            fill={REWATCH}
          />

          <line
            x1={x(SPIKE.from)}
            x2={x(SPIKE.from)}
            y1={BAR_Y - 8}
            y2={BAR_Y + BAR_H + 8}
            stroke={PLATE_INK}
            strokeWidth="1.5"
          />

          <text
            x={x(SPIKE.from) + 6}
            y={BAR_Y + BAR_H + 20}
            fill={PLATE_INK}
            fontSize="10"
            fontFamily={MONO}
          >
            7:42 to 8:18, +5.8
          </text>

          <text
            x={PAD_X}
            y={BAR_Y + BAR_H + 20}
            fill={PLATE_INK_MUTED}
            fontSize="10"
            fontFamily={MONO}
          >
            0:00
          </text>
          <text
            x={W - PAD_X}
            y={BAR_Y + BAR_H + 20}
            fill={PLATE_INK_MUTED}
            fontSize="10"
            textAnchor="end"
            fontFamily={MONO}
          >
            14:32
          </text>
        </svg>
      </div>

      <div className="mt-3 rounded-lg border border-rule bg-field px-4 py-3">
        <p className="max-w-[62ch] text-[0.8125rem] leading-relaxed text-ink-secondary">
          <span className="font-semibold text-ink">The pattern:</span> viewers
          rewatch the moment a claim becomes a number they can see. That happens
          once in 14 minutes, and{" "}
          <span
            className="font-medium text-ink"
            style={{ fontFamily: MONO }}
          >
            {REACHED}%
          </span>{" "}
          of viewers were still there for it.
        </p>
      </div>

      <Legend
        items={[
          { glyph: "square", color: REWATCH, label: "Rewatched segment" },
          { glyph: "square", color: "#6b757e", label: "Rest of the video" },
        ]}
      />
    </FigureFrame>
  );
}
