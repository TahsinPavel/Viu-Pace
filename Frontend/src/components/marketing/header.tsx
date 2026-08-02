"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./wordmark";

const NAV = [
  { href: "#report", label: "What a report says" },
  { href: "#method", label: "How it works" },
  { href: "#scope", label: "Scope" },
  { href: "#pricing", label: "Pricing" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[72rem] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
        >
          <Wordmark />
          <span className="sr-only">ViuPace home</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm text-[0.8125rem] font-medium text-ink-secondary transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden h-8 items-center rounded-md px-2.5 text-[0.8125rem] font-medium text-ink-secondary transition-colors hover:bg-panel hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-8 items-center rounded-md bg-ink px-3 text-[0.8125rem] font-medium text-paper transition-colors hover:bg-[#2b3238] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal active:translate-y-px"
          >
            Open a report
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="header-nav"
            className="grid size-8 place-items-center rounded-md text-ink-secondary transition-colors hover:bg-panel hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal lg:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="header-nav"
          className="border-t border-rule bg-panel px-5 py-3 lg:hidden"
        >
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-sm px-2 py-2 text-[0.8125rem] font-medium text-ink-secondary transition-colors hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
