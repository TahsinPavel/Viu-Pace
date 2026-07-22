import { Zap, BarChart3, ShieldCheck, Cpu, Globe, Users, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Instant Velocity Tracking",
    description: "Measure sprint progress and deployment pacing in real-time with zero overhead or setup complexity.",
    tag: "Performance",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Leverage AI-driven forecasting models to identify bottlenecks before they impact delivery timelines.",
    tag: "AI Intelligence",
  },
  {
    icon: Cpu,
    title: "Automated Workflow Engine",
    description: "Trigger automated pacing rules, team notifications, and deployment checks with custom webhooks.",
    tag: "Automation",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Grade Security",
    description: "End-to-end encryption, SOC2 Type II compliance, and granular RBAC permissions built from the ground up.",
    tag: "Security",
  },
  {
    icon: Globe,
    title: "Global Distributed Infrastructure",
    description: "Sub-20ms latency across 30+ edge data centers worldwide ensuring snappy performance everywhere.",
    tag: "Global Edge",
  },
  {
    icon: Users,
    title: "Seamless Team Alignment",
    description: "Centralized dashboards with customizable views for developers, product managers, and executives.",
    tag: "Collaboration",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Engineered for High-Growth Teams
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Everything you need to pace your SaaS execution
          </h2>
          <p className="text-base sm:text-lg text-zinc-600">
            ViuPace unifies execution tracking, team velocity metrics, and workflow automation into one powerful, intuitive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="group relative overflow-hidden border border-zinc-200/80 bg-white hover:border-blue-500/40 hover:shadow-xl transition-all duration-300 rounded-2xl cursor-pointer"
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
                      {feature.tag}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-zinc-900 pt-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm text-zinc-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform duration-200 pt-2">
                    <span>Learn more</span>
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
