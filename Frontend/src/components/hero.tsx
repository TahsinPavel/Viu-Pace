import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, ShieldCheck, Zap, BarChart3, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-zinc-100">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/60 to-transparent pointer-events-none -z-10 rounded-full blur-3xl opacity-70" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <Badge variant="outline" className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50/80 text-blue-700 border-blue-200/80 flex items-center gap-2 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Introducing ViuPace v2.0 &bull; Next-Gen SaaS Pacing</span>
          </Badge>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.15]">
            Accelerate your workflow with real-time <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Pace Intelligence</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl font-normal leading-relaxed">
            ViuPace empowers modern engineering & product teams to monitor speed, track execution velocity, and optimize performance metrics seamlessly.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-200 h-12 px-7 rounded-xl flex items-center justify-center gap-2 text-base cursor-pointer">
                <span>Start Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#preview" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 h-12 px-6 rounded-xl flex items-center justify-center gap-2 text-base cursor-pointer">
                <Play className="h-4 w-4 fill-zinc-700 text-zinc-700" />
                <span>Watch Demo</span>
              </Button>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-zinc-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span>14-Day Free Trial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span>Setup in Under 2 Mins</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Mock Dashboard Preview Graphic */}
        <div className="mt-12 lg:mt-16 relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-3 shadow-2xl shadow-zinc-900/10 ring-1 ring-zinc-950/5">
            {/* Mock Window Controls */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 px-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-mono text-zinc-400 bg-zinc-50 px-3 py-1 rounded-md border border-zinc-100">
                app.viupace.com/analytics/live
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>Live Sync</span>
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="p-6 bg-zinc-50/50 rounded-xl space-y-6">
              {/* Top Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-zinc-200/70 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500">Global Pace Index</span>
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-zinc-900 mt-2">99.8%</div>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    +12.4% vs last week
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200/70 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500">Active Workflows</span>
                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-zinc-900 mt-2">1,482</div>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    +8.1% automation efficiency
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200/70 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500">Avg Response Time</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-zinc-900 mt-2">18ms</div>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    -4ms lower latency
                  </span>
                </div>
              </div>

              {/* Chart Visual Simulation */}
              <div className="bg-white p-5 rounded-xl border border-zinc-200/70 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900">Real-Time Speed & Throughput</h4>
                    <p className="text-xs text-zinc-500">Live monitoring across 24 global regions</p>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-zinc-100 text-zinc-700">
                    Auto-Refreshing
                  </Badge>
                </div>
                {/* Simulated Chart Bars */}
                <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2">
                  {[45, 60, 52, 78, 90, 65, 85, 95, 70, 88, 100, 92, 84, 96, 75, 90].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-500 hover:brightness-110"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
