import React from "react";
import { RecommendedToolItem } from "@/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function RecommendedToolsSection({ items }: { items: RecommendedToolItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14 animate-in fade-in duration-500 delay-500">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[14px] font-bold text-[var(--ink)] tracking-wide uppercase flex items-center gap-2">
          <span className="text-[var(--accent)] font-mono">Stage 04 Sync //</span> Recommended For Your Path
        </h2>
        <span className="text-[13px] text-[var(--ink-secondary)] font-medium hidden sm:block">
          Calibrated to your active SDE-1 roadmap
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block bg-gradient-to-br from-[var(--surface)] to-[var(--surface-subdued)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--accent)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--telemetry)] animate-pulse"></span>
              <span className="text-[10px] font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">
                {item.rationale}
              </span>
            </div>

            <h3 className="text-[15.5px] font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--accent)] transition-colors">
              {item.title}
            </h3>

            <div className="flex flex-col gap-1 mb-5">
              <div className="text-[12.5px] font-medium text-[var(--ink-secondary)]">
                {item.tag}
              </div>
              <div className="text-[12px] font-medium text-[var(--ink-tertiary)]">
                {item.subTag}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
              Open Tool
              <ChevronRight className="w-[14px] h-[14px] arrow" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
