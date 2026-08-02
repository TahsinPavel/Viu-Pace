import Link from "next/link";
import { Wordmark } from "./wordmark";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "#report", label: "What a report says" },
      { href: "#method", label: "How it works" },
      { href: "#scope", label: "Scope" },
      { href: "#pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Data",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/data-use", label: "What we read from YouTube" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-panel">
      <div className="mx-auto max-w-[72rem] px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-[38ch]">
            <Wordmark />
            <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-secondary">
              A diagnostic report for one YouTube video: where attention left,
              what was said at that second, and one thing to change next time.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="text-[0.875rem] font-semibold text-ink">
                  {column.heading}
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.875rem] text-ink-secondary transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-ink-muted">
            © {new Date().getFullYear()} ViuPace
          </p>
          <p className="text-[0.8125rem] text-ink-muted">
            Not affiliated with YouTube or Google.
          </p>
        </div>
      </div>
    </footer>
  );
}
