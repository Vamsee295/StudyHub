import React from "react";
import { templatesTelemetry } from "@/lib/data/templatesData";

export function TemplatesHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[var(--border)] pb-8 mb-8">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] relative">
            <div className="absolute inset-0 bg-[var(--accent)] rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="text-[11px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider font-semibold">
            PLACEMENT TOOLKIT // READY-TO-USE TEMPLATES
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-newsreader font-medium text-[var(--ink)] tracking-tight mb-3">
          Your preparation toolkit. Structured for impact.
        </h1>
        <p className="text-[15px] text-[var(--ink-secondary)] leading-relaxed max-w-xl">
          Don't start from scratch. Use our calibrated templates for resumes,
          cover letters, behavioral stories, and cold outreach to maximize your
          interview conversion rate.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 md:gap-6 bg-[var(--surface-subdued)]/50 p-4 rounded-xl border border-[var(--border)]/50 shrink-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div className="flex flex-col">
          <span className="text-2xl font-bold font-sans text-[var(--ink)] tracking-tight">
            {templatesTelemetry.totalTemplates}
          </span>
          <span className="text-[11px] text-[var(--ink-tertiary)] font-medium uppercase tracking-wide">
            Templates
          </span>
        </div>
        <div className="w-px bg-[var(--border)] hidden sm:block"></div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold font-sans text-[var(--ink)] tracking-tight">
            {templatesTelemetry.categories}
          </span>
          <span className="text-[11px] text-[var(--ink-tertiary)] font-medium uppercase tracking-wide">
            Categories
          </span>
        </div>
        <div className="w-px bg-[var(--border)] hidden sm:block"></div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold font-sans text-[var(--ink)] tracking-tight text-[var(--accent)]">
            {templatesTelemetry.customized}
          </span>
          <span className="text-[11px] text-[var(--ink-tertiary)] font-medium uppercase tracking-wide">
            Customized
          </span>
        </div>
      </div>
    </div>
  );
}
