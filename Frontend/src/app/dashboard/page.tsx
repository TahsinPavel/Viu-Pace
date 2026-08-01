/*
 * DIRECTION CONTRACT
 * deb4aa84 — form position 7 — "The Investigation Docket"
 *
 * THESIS: A video that underperformed is an incident. This surface is the docket that
 * investigates it: a recorder trace read on a dark instrument plate, transcript aligned to the
 * second the trace broke, and numbered findings that each close on a recommendation.
 *
 * OWN-WORLD: Air-safety investigation, because it is already the product's structure — curve
 * cross-referenced against transcript, ending in a concrete fix. Register is calm and
 * evidentiary. Authority comes from precision: exact timecodes, named thresholds, and a visible
 * separation between what the data shows and what ViuPace advises.
 *
 * STORY: A worried creator is told what happened without being sold to. Nothing pulses or
 * celebrates. Evidence wears dark plate or neutral paper; advice wears the magenta signal field.
 * That Two Materials rule lets a creator tell diagnosis from instruction before reading a word.
 *
 * FIRST VIEWPORT: Connected channel and the connect action above a hairline rule, then four
 * inert channel counters, then the Shorts / Long Videos switch over the upload queue. Selecting
 * an upload opens its docket: probable cause, then FINDING 01–07, each ending in a magenta REC.
 *
 * FORM: Analytical report. Seed key deb4aa84, position 7 of the ordered form list.
 */

"use client";

import { useMemo, useState } from "react";
import { DocketRail } from "@/components/dashboard/docket-rail";
import { ChannelHeader } from "@/components/dashboard/channel-header";
import { ChannelOverview } from "@/components/dashboard/channel-overview";
import { ContentTypeTabs } from "@/components/dashboard/content-type-tabs";
import { VideoQueue } from "@/components/dashboard/video-queue";
import { DiagnosticReportView } from "@/components/dashboard/diagnostic-report";
import {
  recentVideos,
  getReport,
  videosByType,
  DEFAULT_VIDEO_ID,
  type ContentType,
} from "@/lib/mock/diagnostics";

const DEFAULT_TYPE: ContentType =
  recentVideos.find((v) => v.id === DEFAULT_VIDEO_ID)?.contentType ?? "long-form";

export default function DashboardPage() {
  const [contentType, setContentType] = useState<ContentType>(DEFAULT_TYPE);
  const [selectedId, setSelectedId] = useState<string | null>(DEFAULT_VIDEO_ID);

  const videos = useMemo(() => videosByType(contentType), [contentType]);

  const counts = useMemo(
    () => ({
      shorts: videosByType("shorts").length,
      "long-form": videosByType("long-form").length,
    }),
    []
  );

  /**
   * The two lists are separate selections, not one filtered list — switching
   * type clears the open report rather than carrying a Short's docket over into
   * the long-form tab, where its checkpoints would not apply.
   */
  const handleTypeChange = (next: ContentType) => {
    if (next === contentType) return;
    setContentType(next);
    setSelectedId(null);
  };

  const selected = selectedId
    ? (recentVideos.find((v) => v.id === selectedId) ?? null)
    : null;
  const report = selectedId ? getReport(selectedId) : undefined;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <DocketRail />

      <main className="lg:ml-64">
        {/* ---- Channel strip, above the divider ---- */}
        <div id="channel" className="px-6 pt-8 pb-6 lg:px-10">
          <div className="mx-auto max-w-[58rem]">
            <ChannelHeader />
          </div>
        </div>

        <div className="border-t border-rule" />

        {/* ---- Overview, then the content-type switch and its queue ---- */}
        <div className="px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-[58rem] space-y-8">
            <ChannelOverview />

            <section aria-labelledby="uploads-heading">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <h2
                  id="uploads-heading"
                  className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink"
                >
                  Recent uploads
                </h2>
                <ContentTypeTabs
                  value={contentType}
                  onChange={handleTypeChange}
                  counts={counts}
                />
              </div>

              <div
                id={`panel-${contentType}`}
                role="tabpanel"
                aria-labelledby={`tab-${contentType}`}
                className="mt-4"
              >
                <VideoQueue
                  videos={videos}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
            </section>
          </div>
        </div>

        {/* ---- The report for the selected upload ---- */}
        <div className="border-t border-rule">
          {report ? (
            <DiagnosticReportView report={report} />
          ) : (
            <div className="mx-auto max-w-[58rem] px-6 py-12 lg:px-10">
              <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-muted uppercase">
                No report on file
              </p>
              <h2 className="mt-3 text-[1.375rem] font-semibold tracking-[-0.02em]">
                {selected ? selected.title : "Select a video"}
              </h2>
              <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-secondary">
                {selected
                  ? "Analysis runs per video, and this upload has not been analyzed yet. Pick one of the flagged uploads above to read its docket."
                  : "Analysis runs per video. Pick an upload above to read its docket."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
