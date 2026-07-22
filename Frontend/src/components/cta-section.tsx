import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, LayoutDashboard } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ready to boost your execution speed?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Start pacing your SaaS performance today.
            </h2>

            <p className="text-zinc-400 text-base sm:text-lg">
              Join thousands of engineering teams who use ViuPace to streamline workflows, eliminate bottlenecks, and deliver faster.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 px-8 rounded-xl flex items-center gap-2 cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Open Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#pricing" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white h-12 px-6 rounded-xl cursor-pointer">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
