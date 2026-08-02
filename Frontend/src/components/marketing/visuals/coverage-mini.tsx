import { FigureFrame } from "./figure-frame";
import { DROP, MONO, REWATCH } from "./tokens";

/**
 * Discoverability Report. A coverage grid: the search terms actually bringing
 * viewers, against the three fields the creator controls.
 *
 * Presence is never color alone. Each cell carries a glyph, and every glyph has
 * a screen-reader word next to it.
 */

const TERMS = [
  { term: "cheap workshop bench build", share: 31.2, title: false, desc: false, tags: false },
  { term: "plywood workbench plans", share: 22.6, title: false, desc: false, tags: false },
  { term: "small garage workshop setup", share: 18.4, title: false, desc: false, tags: true },
  { term: "budget workshop on a budget", share: 15.1, title: false, desc: true, tags: true },
  { term: "diy workbench flat", share: 12.7, title: false, desc: false, tags: false },
];

function Cell({ present }: { present: boolean }) {
  return (
    <td className="px-2 py-2 text-center">
      <span className="inline-flex items-center justify-center">
        {present ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M2.5 7.5 L5.5 10.5 L11.5 4"
              fill="none"
              stroke={REWATCH}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M3.5 3.5 L10.5 10.5 M10.5 3.5 L3.5 10.5"
              fill="none"
              stroke={DROP}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
        <span className="sr-only">{present ? "present" : "missing"}</span>
      </span>
    </td>
  );
}

export function CoverageMini() {
  return (
    <FigureFrame
      stamp="Discoverability"
      caption="These are the five searches bringing viewers to this video. Three of them appear nowhere in the title, the description, or the tags."
    >
      <div className="overflow-hidden rounded-xl border border-rule bg-paper">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Search terms bringing viewers to this video, and whether each term
            appears in the video title, description, and tags.
          </caption>
          <thead>
            <tr className="border-b border-rule-strong bg-field">
              <th
                scope="col"
                className="px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted"
                style={{ fontFamily: MONO }}
              >
                Search term
              </th>
              <th
                scope="col"
                className="px-2 py-2.5 text-right text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted"
                style={{ fontFamily: MONO }}
              >
                Share
              </th>
              {["Title", "Desc", "Tags"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-2 py-2.5 text-center text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted"
                  style={{ fontFamily: MONO }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TERMS.map((row) => (
              <tr key={row.term} className="border-b border-rule last:border-b-0">
                <th
                  scope="row"
                  className="px-4 py-2 text-left text-[0.8125rem] font-normal text-ink"
                >
                  {row.term}
                </th>
                <td
                  className="px-2 py-2 text-right text-[0.8125rem] text-ink-secondary"
                  style={{ fontFamily: MONO }}
                >
                  {row.share.toFixed(1)}%
                </td>
                <Cell present={row.title} />
                <Cell present={row.desc} />
                <Cell present={row.tags} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.75rem] text-ink-secondary">
        <span className="inline-flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M2.5 7.5 L5.5 10.5 L11.5 4"
              fill="none"
              stroke={REWATCH}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Present in this field
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M3.5 3.5 L10.5 10.5 M10.5 3.5 L3.5 10.5"
              fill="none"
              stroke={DROP}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Missing
        </span>
        <span
          className="text-[0.6875rem] text-ink-muted"
          style={{ fontFamily: MONO }}
        >
          21.4% OF VIEWS CAME FROM SEARCH
        </span>
      </div>
    </FigureFrame>
  );
}
