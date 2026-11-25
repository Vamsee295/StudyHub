import React from "react";
import Link from "next/link";
import { ArrowRight, Target, Lightbulb } from "lucide-react";
import { TemplateItem } from "@/types";

export function RecommendationsSection({ recommendations }: { recommendations: TemplateItem[] }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-5">
        <Target className="w-5 h-5 text-accent-ink" />
        <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">Start here</span>
          <span className="display text-[28px] md:text-[34px]">Most used</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((template) => (
          <div
            key={template.id}
            className="group bg-card border-t-2 border-hair border-t-accent rounded-b-xl rounded-t-sm p-6 hover:shadow-[4px_5px_0_var(--hard)] transition-all flex flex-col h-full"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-accent-soft text-accent-ink text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-accent-line flex items-center gap-1.5">
                <Target className="w-3 h-3" />
                {template.tags[0] || "Recommended"}
              </span>
            </div>

            <h3 className="text-[16px] font-bold text-ink mb-2 group-hover:text-accent-ink transition-colors">
              {template.title}
            </h3>

            <div className="bg-paper border-[1.5px] border-hair rounded-lg p-3 my-3">
              <p className="text-[13px] text-body flex gap-2">
                <Lightbulb className="w-4 h-4 text-accent-ink shrink-0 mt-0.5" />
                <span className="leading-relaxed">{template.description}</span>
              </p>
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-body bg-paper-2 px-2.5 py-1 rounded-md border-[1.5px] border-hair/50">
                {template.estimatedTime}
              </span>
              <Link
                href={`/templates/${template.id}`}
                className="text-[13px] font-bold text-accent-ink hover:text-accent-ink transition-colors flex items-center gap-1"
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
