import { Check, Minus } from "lucide-react";
import {
  formatCount,
  type Discoverability,
  type SearchTerm,
} from "@/lib/mock/diagnostics";

/**
 * Search terms against the metadata that is supposed to be targeting them.
 *
 * The whole point of this finding is the gap, so coverage is a matrix: one row
 * per query, one column per metadata field, and a glyph in every cell. Absence
 * is drawn as an explicit "not targeted" mark rather than an empty cell — a
 * blank would read as missing data instead of a missing keyword.
 */
export function DiscoverabilitySection({ data }: { data: Discoverability }) {
  const untargeted = data.terms.filter(
    (t) => !t.inTitle && !t.inDescription && !t.inTags
  );
  const topTerm = data.terms[0];

  return (
    <div className="space-y-6">
      <p className="text-[0.9375rem] leading-relaxed text-ink-secondary">
        <strong className="font-semibold text-ink">
          {data.searchShare}% of views arrived from search
        </strong>
        {untargeted.length > 0 ? (
          <>
            , and{" "}
            <span className={untargeted.length > 1 ? "text-drop" : "text-caution"}>
              {untargeted.length} of the {data.terms.length} queries
            </span>{" "}
            bringing that traffic appear in none of the three metadata fields.
          </>
        ) : (
          <>, and every query bringing that traffic is targeted somewhere in the
          metadata.</>
        )}
      </p>

      {/* Traffic mix — the context that decides how much search can move */}
      <div>
        <p className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
          Traffic sources
        </p>
        <div className="mt-2.5 flex h-2 gap-[2px] overflow-hidden rounded-full">
          <span
            className="bg-signal"
            style={{ width: `${data.searchShare}%` }}
            aria-hidden
          />
          {data.otherSources.map((src) => (
            <span
              key={src.label}
              className="bg-rule-strong"
              style={{ width: `${src.share}%` }}
              aria-hidden
            />
          ))}
        </div>
        <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
          <li className="inline-flex items-center gap-1.5 text-[0.75rem] text-ink">
            <span aria-hidden className="size-2.5 rounded-full bg-signal" />
            YouTube search
            <span className="font-mono text-[0.6875rem] text-ink-secondary tabular-nums">
              {data.searchShare}%
            </span>
          </li>
          {data.otherSources.map((src) => (
            <li
              key={src.label}
              className="inline-flex items-center gap-1.5 text-[0.75rem] text-ink-secondary"
            >
              <span aria-hidden className="size-2.5 rounded-full bg-rule-strong" />
              {src.label}
              <span className="font-mono text-[0.6875rem] tabular-nums">
                {src.share}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* The coverage matrix — query against each metadata field */}
      <div className="overflow-x-auto rounded-lg border border-rule">
        <table className="w-full min-w-[34rem] text-left">
          <caption className="sr-only">
            Top search terms driving traffic to this video, and whether the
            title, description, and tags target each one.
          </caption>
          <thead>
            <tr className="border-b border-rule">
              <th
                scope="col"
                className="px-4 py-2.5 font-mono text-[0.625rem] font-normal tracking-[0.06em] text-ink-muted uppercase"
              >
                Search term
              </th>
              <th
                scope="col"
                className="px-3 py-2.5 text-right font-mono text-[0.625rem] font-normal tracking-[0.06em] text-ink-muted uppercase"
              >
                Share
              </th>
              {["Title", "Desc.", "Tags"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-3 py-2.5 text-center font-mono text-[0.625rem] font-normal tracking-[0.06em] text-ink-muted uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.terms.map((term) => (
              <TermRow key={term.term} term={term} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[0.625rem] tracking-[0.04em] text-ink-muted uppercase">
        <span className="inline-flex items-center gap-1.5">
          <Check className="size-3 text-rewatch" aria-hidden />
          Targeted
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Minus className="size-3 text-drop" aria-hidden />
          Not targeted
        </span>
      </p>

      {/* The metadata as it currently stands — the evidence being judged */}
      <dl className="space-y-3 rounded-lg bg-field p-4">
        <div>
          <dt className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
            Current title
          </dt>
          <dd className="mt-1 text-[0.875rem] leading-relaxed text-ink">
            {data.title}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
            Current description
          </dt>
          <dd className="mt-1 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-secondary">
            {data.description}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[0.625rem] tracking-[0.06em] text-ink-muted uppercase">
            Current tags ({data.tags.length})
          </dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-paper px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-secondary ring-1 ring-rule"
              >
                {tag}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      {topTerm && (
        <p className="max-w-[68ch] text-[0.8125rem] leading-relaxed text-ink-secondary">
          The strongest query,{" "}
          <span className="font-mono text-[0.75rem] text-ink">
            “{topTerm.term}”
          </span>
          , carries {topTerm.share}% of search traffic and{" "}
          {formatCount(topTerm.views)} views
          {!topTerm.inTitle && !topTerm.inDescription && !topTerm.inTags
            ? " while appearing in no metadata field at all."
            : "."}
        </p>
      )}
    </div>
  );
}

function TermRow({ term }: { term: SearchTerm }) {
  const fields = [
    { label: "title", covered: term.inTitle },
    { label: "description", covered: term.inDescription },
    { label: "tags", covered: term.inTags },
  ];
  const orphaned = fields.every((f) => !f.covered);

  return (
    <tr className="border-b border-rule last:border-b-0">
      <th scope="row" className="px-4 py-2.5 font-normal">
        <span className="font-mono text-[0.75rem] text-ink">{term.term}</span>
        {orphaned && (
          <span className="mt-1 block text-[0.6875rem] text-drop">
            Not targeted anywhere
          </span>
        )}
      </th>
      <td className="px-3 py-2.5 text-right font-mono text-[0.75rem] text-ink-secondary tabular-nums">
        {term.share}%
      </td>
      {fields.map((field) => (
        <td key={field.label} className="px-3 py-2.5 text-center">
          {field.covered ? (
            <Check className="mx-auto size-3.5 text-rewatch" aria-hidden />
          ) : (
            <Minus className="mx-auto size-3.5 text-drop" aria-hidden />
          )}
          <span className="sr-only">
            {field.covered
              ? `targeted in ${field.label}`
              : `not targeted in ${field.label}`}
          </span>
        </td>
      ))}
    </tr>
  );
}
