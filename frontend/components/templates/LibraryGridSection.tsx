import React from "react";
import Link from "next/link";
import { ArrowRight, FileText, Clock, LayoutTemplate } from "lucide-react";
import { clsx } from "clsx";
import { TemplateItem } from "@/types";

export function LibraryGridSection({ templates }: { templates: TemplateItem[] }) {
  if (!templates || templates.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface-subdued)]/30">
        <LayoutTemplate className="w-10 h-10 text-[var(--ink-tertiary)] mb-4" />
        <h3 className="text-[16px] font-semibold text-[var(--ink)]">No templates found</h3>
        <p className="text-[14px] text-[var(--ink-secondary)] mt-1">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-bold text-[var(--ink)] flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-[var(--ink-secondary)]" />
          Explore Template Library
        </h2>
        <span className="text-[13px] font-medium text-[var(--ink-tertiary)] bg-[var(--surface-subdued)] px-2.5 py-1 rounded-md">
          {templates.length} Result{templates.length !== 1 && "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col h-full hover:border-[var(--border-strong)] hover:shadow-md transition-all overflow-hidden relative"
          >
            {/* Top accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-[var(--border)] to-[var(--border)] group-hover:from-[var(--accent)] group-hover:to-[var(--accent-hover)] transition-all"></div>
            
            <div className="p-5 flex-1 flex flex-col">
              {/* Badges row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded border border-[var(--accent-soft-border)]">
                    {template.category.replace("-", " ")}
                  </span>
                  {template.badge && (
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded border border-[var(--success)]/20">
                      {template.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Desc */}
              <h3 className="text-[16px] font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                {template.title}
              </h3>
              <p className="text-[13px] text-[var(--ink-secondary)] leading-relaxed line-clamp-2 mb-4">
                {template.description}
              </p>

              {/* Metadata */}
              <div className="mt-auto grid grid-cols-2 gap-3 mb-5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-[var(--ink-tertiary)] uppercase tracking-wide mb-0.5">Target</span>
                  <span className="text-[12px] font-semibold text-[var(--ink)]">{template.targetRole}</span>
                </div>
                <div className="flex flex-col border-l border-[var(--border)] pl-3">
                  <span className="text-[11px] font-medium text-[var(--ink-tertiary)] uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time
                  </span>
                  <span className="text-[12px] font-semibold text-[var(--ink)]">{template.estimatedTime}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border)]/50">
                {template.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] bg-[var(--surface-subdued)] text-[var(--ink-secondary)] px-2 py-0.5 rounded-md font-medium border border-[var(--border)]/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="p-4 bg-[var(--surface-subdued)]/30 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-[12px] font-medium text-[var(--ink-secondary)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Customizable
              </span>
              <Link
                href={`/templates/${template.id}`}
                className="bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white text-[13px] font-semibold px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
              >
                Use Template
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
