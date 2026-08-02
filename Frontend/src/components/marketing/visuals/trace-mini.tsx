import { FigureFrame } from "./figure-frame";
import { Legend } from "./legend";
import {
  DROP,
  MONO,
  PLATE_GRID,
  PLATE_INK,
  PLATE_INK_MUTED,
  REWATCH,
  SIGNAL,
} from "./tokens";

/**
 * The Boredom Locator exhibit: the signature retention trace at marketing scale.
 *
 * Values are the same sample report the product ships in
 * src/lib/mock/diagnostics.ts, inlined so the caption prose and the plotted
 * shape can never drift apart.
 */

const DURATION = 872;

const CURVE: [number, number][] = [
  [0, 100], [30, 76.8], [90, 68.4], [150, 65.2], [210, 62.1], [250, 59.8],
  [265, 54.2], [280, 49.6], [300, 45.1], [320, 41.8], [340, 39.4], [360, 37.9],
  [420, 35.9], [462, 35.4], [474, 38.9], [486, 41.2], [498, 39.6], [510, 36.4],
  [570, 32.6], [640, 29.4], [720, 26.2], [800, 23.1], [872, 20.4],
];

const REFERENCE: [number, number][] = [
  [0, 100], [30, 82.6], [90, 74.2], [180, 68.1], [250, 63.4], [300, 60.2],
  [360, 56.8], [450, 52.4], [540, 48.1], [640, 43.6], [760, 38.2], [872, 33.9],
];

const BANDS = [
  { kind: "drop" as const, from: 250, to: 340 },
  { kind: "rewatch" as const, from: 462, to: 498 },
];

const W = 680;
const H = 196;
const PAD = { top: 20, right: 14, bottom: 26, left: 28 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const x = (t: number) => PAD.left + (t / DURATION) * PLOT_W;
const y = (r: number) => PAD.top + ((100 - r) / 100) * PLOT_H;

const line = (pts: [number, number][]) =>
  pts.map(([t, r], i) => `${i === 0 ? "M" : "L"}${x(t)} ${y(r)}`).join(" ");

const area = (pts: [number, number][]) =>
  `${line(pts)} L${x(pts[pts.length - 1][0])} ${y(0)} L${x(pts[0][0])} ${y(0)} Z`;

const slice = (from: number, to: number) =>
  CURVE.filter(([t]) => t >= from && t <= to);

export function TraceMini() {
  return (
    <FigureFrame
      stamp="Boredom Locator"
      caption="Viewers started leaving at 4:10, where 90 seconds of backstory begins. They came back at 7:42, the one moment a price is spoken and shown at the same time."
    >
      <div className="rounded-xl bg-plate p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Audience retention across a 14 minute 32 second video. Retention falls from 60 percent to 39 percent between 4:10 and 5:40, then rises from 35 to 41 percent between 7:42 and 8:18. A dashed reference line shows the channel average staying above this video after the 4:10 mark."
        >
          {[0, 50, 100].map((r) => (
            <g key={r}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(r)}
                y2={y(r)}
                stroke={PLATE_GRID}
                strokeWidth="1"
              />
              <text
                x={PAD.left - 6}
                y={y(r)}
                fill={PLATE_INK_MUTED}
                fontSize="9"
                textAnchor="end"
                dominantBaseline="middle"
                fontFamily={MONO}
              >
                {r}
              </text>
            </g>
          ))}

          {BANDS.map((b) => (
            <path
              key={`band-${b.from}`}
              d={area(slice(b.from, b.to))}
              fill={b.kind === "drop" ? DROP : REWATCH}
              fillOpacity="0.16"
            />
          ))}

          <path
            d={line(REFERENCE)}
            fill="none"
            stroke={SIGNAL}
            strokeWidth="1.5"
            strokeDasharray="5 4"
            opacity="0.85"
          />

          <path
            d={line(CURVE)}
            fill="none"
            stroke={PLATE_INK}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {BANDS.map((b) => {
            const pts = slice(b.from, b.to);
            const last = pts[pts.length - 1];
            return (
              <g key={`over-${b.from}`}>
                <path
                  d={line(pts)}
                  fill="none"
                  stroke={b.kind === "drop" ? DROP : REWATCH}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <circle
                  cx={x(last[0])}
                  cy={y(last[1])}
                  r="4"
                  fill={b.kind === "drop" ? DROP : REWATCH}
                  stroke="#14181c"
                  strokeWidth="2"
                />
              </g>
            );
          })}

          {[
            { at: 0, label: "0:00", anchor: "start" as const },
            { at: 250, label: "4:10", anchor: "middle" as const },
            { at: 462, label: "7:42", anchor: "middle" as const },
            { at: 872, label: "14:32", anchor: "end" as const },
          ].map((tick) => (
            <text
              key={tick.at}
              x={x(tick.at)}
              y={H - 8}
              fill={PLATE_INK_MUTED}
              fontSize="9"
              textAnchor={tick.anchor}
              fontFamily={MONO}
            >
              {tick.label}
            </text>
          ))}

          <text
            x={PAD.left - 6}
            y={PAD.top - 9}
            fill={PLATE_INK_MUTED}
            fontSize="9"
            textAnchor="end"
            fontFamily={MONO}
          >
            %
          </text>
        </svg>
      </div>

      <Legend
        items={[
          { glyph: "solid", color: "#14181c", label: "This video" },
          { glyph: "dashed", color: SIGNAL, label: "Channel average" },
          { glyph: "dot", color: DROP, label: "Viewers leaving" },
          { glyph: "dot", color: REWATCH, label: "Viewers rewatching" },
        ]}
      />
    </FigureFrame>
  );
}
