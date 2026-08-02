import { FigureFrame } from "./figure-frame";
import { Legend } from "./legend";
import {
  MONO,
  PLATE_GRID,
  PLATE_INK,
  PLATE_INK_MUTED,
  REWATCH,
  SIGNAL,
} from "./tokens";

/**
 * Early Drop AI Diagnostic. Deliberately shows a passing result: the tool
 * saying "your opening is fine, the problem is elsewhere" is the trust claim
 * worth making on a marketing page.
 */

const MAX = 40;
const MEASURED = 23.2;
const LIMIT = 30;
const CHANNEL_AVG = 17.4;

const W = 620;
const H = 108;
const PAD_X = 20;
const TRACK_Y = 52;
const TRACK_H = 22;
const TRACK_W = W - PAD_X * 2;

const x = (v: number) => PAD_X + (v / MAX) * TRACK_W;

export function ThresholdMini() {
  return (
    <FigureFrame
      stamp="Early Drop"
      caption="Long videos normally lose up to 30 out of every 100 viewers in the first 30 seconds. This one lost 23, so the opening is not the problem and does not need re-editing."
    >
      <div className="rounded-xl bg-plate p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Viewers lost in the first 30 seconds: 23.2 out of every 100. The normal limit for this kind of video is 30, and the channel average is 17.4. This video is under the limit, so the opening passed."
        >
          <rect
            x={PAD_X}
            y={TRACK_Y}
            width={TRACK_W}
            height={TRACK_H}
            rx="4"
            fill={PLATE_GRID}
          />
          <rect
            x={PAD_X}
            y={TRACK_Y}
            width={x(MEASURED) - PAD_X}
            height={TRACK_H}
            rx="4"
            fill={PLATE_INK}
          />

          <line
            x1={x(CHANNEL_AVG)}
            x2={x(CHANNEL_AVG)}
            y1={TRACK_Y - 6}
            y2={TRACK_Y + TRACK_H + 6}
            stroke={PLATE_INK_MUTED}
            strokeWidth="1.5"
          />
          <text
            x={x(CHANNEL_AVG)}
            y={TRACK_Y - 12}
            fill={PLATE_INK_MUTED}
            fontSize="10"
            textAnchor="middle"
            fontFamily={MONO}
          >
            17.4 avg
          </text>

          <line
            x1={x(LIMIT)}
            x2={x(LIMIT)}
            y1={TRACK_Y - 14}
            y2={TRACK_Y + TRACK_H + 14}
            stroke={SIGNAL}
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <text
            x={x(LIMIT)}
            y={TRACK_Y - 20}
            fill={SIGNAL}
            fontSize="10"
            textAnchor="middle"
            fontFamily={MONO}
          >
            30 limit
          </text>

          <text
            x={x(MEASURED) - 8}
            y={TRACK_Y + TRACK_H / 2}
            fill={PLATE_INK}
            fontSize="13"
            fontWeight="600"
            textAnchor="end"
            dominantBaseline="middle"
            fontFamily={MONO}
          >
            23.2
          </text>

          {[0, 10, 20, 30, 40].map((v) => (
            <text
              key={v}
              x={x(v)}
              y={H - 10}
              fill={PLATE_INK_MUTED}
              fontSize="9"
              textAnchor="middle"
              fontFamily={MONO}
            >
              {v}
            </text>
          ))}

          <text
            x={PAD_X}
            y={22}
            fill={PLATE_INK_MUTED}
            fontSize="10"
            fontFamily={MONO}
          >
            VIEWERS LOST PER 100, FIRST 30 SECONDS
          </text>
        </svg>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <svg width="14" height="14" aria-hidden viewBox="0 0 14 14">
          <path
            d="M2.5 7.5 L5.5 10.5 L11.5 4"
            fill="none"
            stroke={REWATCH}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[0.8125rem] font-semibold text-rewatch">
          Opening passed
        </span>
      </div>

      <Legend
        items={[
          { glyph: "square", color: "#14181c", label: "This video" },
          { glyph: "dashed", color: SIGNAL, label: "Normal limit" },
          { glyph: "solid", color: "#6b757e", label: "Channel average" },
        ]}
      />
    </FigureFrame>
  );
}
