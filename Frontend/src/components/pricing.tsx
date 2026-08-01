"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Ideal for individual developers & small teams starting out.",
      priceMonthly: "$29",
      priceAnnual: "$19",
      features: [
        "Up to 5 Team Members",
        "Real-Time Pacing Telemetry",
        "10 Automated Workflows",
        "7-Day Metrics History",
        "Community Support",
      ],
      popular: false,
      ctaText: "Start Free Trial",
      ctaVariant: "outline" as const,
    },
    {
      name: "Pro",
      description: "For scaling products requiring advanced automation & insights.",
      priceMonthly: "$79",
      priceAnnual: "$59",
      features: [
        "Up to 25 Team Members",
        "Unlimited Automated Workflows",
        "AI Predictive Bottleneck Detection",
        "90-Day Metrics History",
        "Priority 24/7 Slack & Email Support",
        "Custom Webhooks & Integrations",
      ],
      popular: true,
      ctaText: "Start 14-Day Free Trial",
      ctaVariant: "default" as const,
    },
    {
      name: "Enterprise",
      description: "Dedicated infrastructure, custom SLAs, and governance.",
      priceMonthly: "Custom",
      priceAnnual: "Custom",
      features: [
        "Unlimited Team Members",
        "Dedicated Isolated Instance",
        "SOC2 Type II & HIPAA Compliance",
        "Custom SSO & SAML Auth",
        "Dedicated Solutions Engineer",
        "SLA Guarantee (99.99%)",
      ],
      popular: false,
      ctaText: "Contact Sales",
      ctaVariant: "outline" as const,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border-blue-200">
            Simple & Transparent Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Flexible plans built to scale with your pace
          </h2>
          <p className="text-base sm:text-lg text-zinc-600">
            No hidden fees. Switch or cancel your subscription at any time.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!isAnnual ? "text-zinc-900 font-semibold" : "text-zinc-500"}`}>
              Monthly billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-zinc-200 transition-colors duration-200 ease-in-out focus:outline-none data-[checked=true]:bg-blue-600"
              data-checked={isAnnual}
              aria-label="Toggle annual billing"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-zinc-900 font-semibold" : "text-zinc-500"} flex items-center gap-1.5`}>
              <span>Annual billing</span>
              <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">Save 25%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col justify-between rounded-2xl p-8 bg-white border transition-all duration-200 ${
                plan.popular
                  ? "border-blue-600 shadow-2xl ring-2 ring-blue-600/20 md:-translate-y-2"
                  : "border-zinc-200/90 shadow-sm hover:border-zinc-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-zinc-900">{plan.name}</h3>
                <p className="text-xs text-zinc-500 mt-1 min-h-[32px]">{plan.description}</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight">
                    {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  {plan.priceMonthly !== "Custom" && (
                    <span className="text-sm font-medium text-zinc-500"> / month</span>
                  )}
                </div>

                <div className="border-t border-zinc-100 pt-6 space-y-3">
                  <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">Includes:</span>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700">
                      <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link href="/dashboard" className="w-full">
                  <Button
                    variant={plan.ctaVariant}
                    className={`w-full h-11 rounded-xl font-semibold cursor-pointer ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-blue-500/20"
                        : "border-zinc-300 hover:bg-zinc-50 text-zinc-800"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
