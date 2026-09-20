import React from "react";
import Link from "next/link";
import { ArrowRight, Target, Lightbulb } from "lucide-react";
import { TemplateItem } from "@/types";

export function RecommendationsSection({ recommendations }: { recommendations: TemplateItem[] }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-5">
        <Target className="w-5 h-5 text-[var(--accent)]" />
        <h2 className="text-[17px] font-bold text-[var(--ink)]">
          Recommended for Your Path
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((template) => (
          <div
            key={template.id}
            className="group bg-[var(--surface)] border-t-2 border-[var(--border)] border-t-[var(--accent)] rounded-b-xl rounded-t-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--accent-soft-border)] flex items-center gap-1.5">
                <Target className="w-3 h-3" />
                {template.tags[0] || "Recommended"}
              </span>
            </div>

            <h3 className="text-[16px] font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--accent)] transition-colors">
              {template.title}
            </h3>

            <div className="bg-[#f8fafc] border border-[var(--border)] rounded-lg p-3 my-3">
              <p className="text-[13px] text-[var(--ink-secondary)] flex gap-2">
                <Lightbulb className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{template.description}</span>
              </p>
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[var(--ink-secondary)] bg-[var(--surface-subdued)] px-2.5 py-1 rounded-md border border-[var(--border)]/50">
                {template.estimatedTime}
              </span>
              <Link
                href={`/templates/${template.id}`}
                className="text-[13px] font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1"
              >
                Use this template <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
