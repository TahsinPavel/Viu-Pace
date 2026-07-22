import Link from "next/link";
import { Sparkles, Globe, Share2, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white pt-16 pb-12 text-zinc-600 border-t border-zinc-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-zinc-900 font-bold text-xl tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-xl">
                Viu<span className="text-blue-600">Pace</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm leading-relaxed">
              ViuPace is the next-generation SaaS execution platform built for engineering velocity, workflow automation, and real-time telemetry.
            </p>
            <div className="flex items-center gap-4 text-zinc-400">
              <a href="#" className="hover:text-zinc-900 transition-colors" aria-label="Globe">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-zinc-900 transition-colors" aria-label="Code">
                <Code2 className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-zinc-900 transition-colors" aria-label="Share">
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Product</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li><Link href="#features" className="hover:text-zinc-900 transition-colors">Features</Link></li>
              <li><Link href="#preview" className="hover:text-zinc-900 transition-colors">Live Tour</Link></li>
              <li><Link href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-zinc-900 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Resources</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">System Status</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Company</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>&copy; {new Date().getFullYear()} ViuPace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <a href="#" className="hover:text-zinc-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-600 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
