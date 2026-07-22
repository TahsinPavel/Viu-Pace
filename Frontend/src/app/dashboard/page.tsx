import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-white text-zinc-900 font-sans">
      {/* Left Panel / Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white p-6 flex flex-col justify-between min-h-screen">
        <div className="space-y-6">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors inline-block"
          >
            &larr; Back to Home
          </Link>

          {/* Sidebar Menu Item */}
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-100 text-zinc-900 font-semibold text-sm transition-colors cursor-pointer">
              {/* YouTube SVG Icon */}
              <svg
                className="w-5 h-5 text-red-600 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YouTube</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area - Blank White */}
      <main className="flex-1 bg-white" />
    </div>
  );
}
