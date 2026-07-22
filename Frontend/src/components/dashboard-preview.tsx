"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2, Activity, Cpu, ShieldCheck, Check, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="preview" className="py-20 lg:py-28 bg-zinc-50/70 border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4 mb-12">
          <Badge variant="outline" className="text-xs font-bold text-blue-700 bg-blue-50 border-blue-200">
            Interactive Product Tour
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            See how ViuPace transforms SaaS operations
          </h2>
          <p className="text-base sm:text-lg text-zinc-600">
            Explore live modules designed to keep your engineering and business metrics in sync.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="max-w-4xl mx-auto">
          {!isMounted ? (
            <div className="h-64 bg-white rounded-2xl border border-zinc-200 shadow-xl flex items-center justify-center text-zinc-400 text-sm">
              Loading Product Tour...
            </div>
          ) : (
            <Tabs defaultValue="analytics" onValueChange={setActiveTab} className="w-full space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-white p-1.5 rounded-xl border border-zinc-200 shadow-xs h-auto gap-1">
              <TabsTrigger
                value="analytics"
                className="py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <BarChart2 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="workflows"
                className="py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Cpu className="h-4 w-4" />
                <span>Workflows</span>
              </TabsTrigger>
              <TabsTrigger
                value="pacing"
                className="py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Activity className="h-4 w-4" />
                <span>Team Pacing</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Analytics Tab Content */}
            <TabsContent value="analytics" className="focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/90 shadow-xl">
                <div className="lg:col-span-5 space-y-4 text-left">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Live Telemetry</Badge>
                  <h3 className="text-2xl font-bold text-zinc-900">Comprehensive Performance & Throughput Analytics</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    Gain full visibility into system throughput, active API calls, and team velocity metrics with auto-updating charts.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm font-medium text-zinc-700 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600" />
                      <span>Customizable KPI dashboards & export options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600" />
                      <span>Automated latency anomaly alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600" />
                      <span>Historical trend analysis & forecasting</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/dashboard">
                      <Button className="bg-blue-600 text-white gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Launch Analytics Dashboard</span>
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-7 bg-zinc-900 p-6 rounded-xl text-white space-y-4 shadow-inner">
                  <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-3">
                    <span className="font-mono">ANALYTICS_OVERVIEW_V2</span>
                    <span className="text-emerald-400 font-semibold">99.98% Uptime</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700">
                      <div className="text-xs text-zinc-400">Total API Hits</div>
                      <div className="text-xl font-bold text-white mt-1">2.4M / hr</div>
                    </div>
                    <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700">
                      <div className="text-xs text-zinc-400">Pace Index Score</div>
                      <div className="text-xl font-bold text-blue-400 mt-1">98.4 / 100</div>
                    </div>
                  </div>
                  <div className="h-32 bg-zinc-800/50 rounded-lg p-3 flex items-end justify-between gap-1.5 border border-zinc-800">
                    {[65, 80, 70, 90, 85, 95, 100, 88, 92, 98, 85, 96].map((v, i) => (
                      <div key={i} className="flex-1 bg-blue-500 rounded-t-sm" style={{ height: `${v}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Workflows Tab Content */}
            <TabsContent value="workflows" className="focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/90 shadow-xl">
                <div className="lg:col-span-5 space-y-4 text-left">
                  <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Automation</Badge>
                  <h3 className="text-2xl font-bold text-zinc-900">Event-Driven Workflow Automation</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    Set up conditional triggers, CI/CD pacing checkpoints, and automatic team notifications without writing code.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm font-medium text-zinc-700 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-indigo-600" />
                      <span>Webhook integration with GitHub, Slack & Jira</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-indigo-600" />
                      <span>Conditional step execution & retry logic</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/dashboard">
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Manage Workflows</span>
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-7 bg-zinc-900 p-6 rounded-xl text-white space-y-3 font-mono text-xs shadow-inner">
                  <div className="text-zinc-400 border-b border-zinc-800 pb-2 flex justify-between">
                    <span>WORKFLOW_EXECUTION_LOG</span>
                    <span className="text-blue-400">STATUS: RUNNING</span>
                  </div>
                  <div className="space-y-2 text-zinc-300">
                    <div className="bg-zinc-800 p-2.5 rounded border-l-2 border-emerald-500 flex justify-between">
                      <span>[10:14:02] Trigger: GitHub Push main</span>
                      <span className="text-emerald-400">SUCCESS</span>
                    </div>
                    <div className="bg-zinc-800 p-2.5 rounded border-l-2 border-blue-500 flex justify-between">
                      <span>[10:14:04] Pace Check: Velocity Limit Check</span>
                      <span className="text-blue-400">PASSED</span>
                    </div>
                    <div className="bg-zinc-800 p-2.5 rounded border-l-2 border-amber-500 flex justify-between">
                      <span>[10:14:05] Action: Deploy to Staging Region</span>
                      <span className="text-amber-400">IN PROGRESS</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Pacing Tab Content */}
            <TabsContent value="pacing" className="focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/90 shadow-xl">
                <div className="lg:col-span-5 space-y-4 text-left">
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Velocity</Badge>
                  <h3 className="text-2xl font-bold text-zinc-900">Sprint & Team Velocity Tracking</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    Keep your team aligned with live sprint execution meters, workload distribution charts, and release readiness scores.
                  </p>
                  <div className="pt-2">
                    <Link href="/dashboard">
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>View Team Dashboard</span>
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-7 bg-zinc-50 p-6 rounded-xl border border-zinc-200 space-y-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
                    <span>Sprint 42 Pacing Progress</span>
                    <span className="text-emerald-600 font-bold">84% Complete</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[84%] rounded-full transition-all duration-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                    <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                      <div className="text-zinc-500">Tasks Completed</div>
                      <div className="font-bold text-zinc-900 text-base">42 / 50</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                      <div className="text-zinc-500">Days Remaining</div>
                      <div className="font-bold text-zinc-900 text-base">3 Days</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                      <div className="text-zinc-500">Burnup Rate</div>
                      <div className="font-bold text-emerald-600 text-base">+15% Optimal</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab Content */}
            <TabsContent value="security" className="focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/90 shadow-xl">
                <div className="lg:col-span-5 space-y-4 text-left">
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Compliance</Badge>
                  <h3 className="text-2xl font-bold text-zinc-900">SOC2 Type II & End-to-End Encryption</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    Rest easy with automated audit logs, encrypted token management, and role-based access governance.
                  </p>
                  <div className="pt-2">
                    <Link href="/dashboard">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Security & Access Control</span>
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-7 bg-zinc-900 p-6 rounded-xl text-white space-y-3 text-xs font-mono">
                  <div className="text-emerald-400 border-b border-zinc-800 pb-2">✓ SECURITY_AUDIT_PASSED (0 VULNERABILITIES)</div>
                  <div className="text-zinc-300 space-y-1.5">
                    <div>[AES-256] Data at rest encryption: ACTIVE</div>
                    <div>[TLS 1.3] Transit layer security: ENFORCED</div>
                    <div>[RBAC] Multi-factor auth policy: COMPLIANT</div>
                    <div>[AUDIT] Continuous vulnerability scan: CLEAN</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          )}
        </div>
      </div>
    </section>
  );
}
