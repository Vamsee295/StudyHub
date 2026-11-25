import React from "react";
import Link from "next/link";
import { ArrowRight, FileText, Clock, LayoutTemplate } from "lucide-react";
import { TemplateItem } from "@/types";

export function LibraryGridSection({ templates }: { templates: TemplateItem[] }) {
  if (!templates || templates.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center border border-dashed border-hair rounded-2xl bg-paper-2/30">
        <LayoutTemplate className="w-10 h-10 text-mute mb-4" />
        <h3 className="text-[16px] font-semibold text-ink">No templates found</h3>
        <p className="text-[14px] text-body mt-1">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-5">
        <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">Library</span>
          <span className="display text-[28px] md:text-[34px]">All templates</span>
        </h2>
        <span className="text-[13px] font-medium text-mute bg-paper-2 px-2.5 py-1 rounded-md">
          {templates.length} Result{templates.length !== 1 && "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group bg-card border-[1.5px] border-hair rounded-xl flex flex-col h-full hover:border-line hover:shadow-[4px_5px_0_var(--hard)] transition-all overflow-hidden relative"
          >
            {/* Top accent line */}
            <div className="h-1 w-full bg-hair transition-colors group-hover:bg-accent"></div>
            
            <div className="p-5 flex-1 flex flex-col">
              {/* Badges row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-accent-ink bg-accent-soft px-2 py-0.5 rounded border border-accent-line">
                    {template.category.replace("-", " ")}
                  </span>
                  {template.badge && (
                    <span className="text-[10px] font-bold tracking-wider uppercase text-note bg-note/10 px-2 py-0.5 rounded border border-note/20">
                      {template.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Desc */}
              <h3 className="text-[16px] font-bold text-ink mb-2 group-hover:text-accent-ink transition-colors">
                {template.title}
              </h3>
              <p className="text-[13px] text-body leading-relaxed line-clamp-2 mb-4">
                {template.description}
              </p>

              {/* Metadata */}
              <div className="mt-auto grid grid-cols-2 gap-3 mb-5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-mute uppercase tracking-wide mb-0.5">Target</span>
                  <span className="text-[12px] font-semibold text-ink">{template.targetRole}</span>
                </div>
                <div className="flex flex-col border-l border-hair pl-3">
                  <span className="text-[11px] font-medium text-mute uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time
                  </span>
                  <span className="text-[12px] font-semibold text-ink">{template.estimatedTime}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-hair/50">
                {template.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] bg-paper-2 text-body px-2 py-0.5 rounded-md font-medium border-[1.5px] border-hair/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="p-4 bg-paper-2/30 border-t border-hair flex justify-between items-center">
              <span className="text-[12px] font-medium text-body flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Customizable
              </span>
              <Link
                href={`/templates/${template.id}`}
                className="bg-card text-ink border-[1.5px] border-hair group-hover:border-accent group-hover:bg-accent group-hover:text-paper text-[13px] font-semibold px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
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
