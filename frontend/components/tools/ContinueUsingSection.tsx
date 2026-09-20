import React from "react";
import { ContinueToolItem } from "@/types";
import { Play } from "lucide-react";
import Link from "next/link";

export function ContinueUsingSection({ items }: { items: ContinueToolItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[14px] font-bold text-[var(--ink)] tracking-wide uppercase flex items-center gap-2">
          <span className="text-[var(--accent)] font-mono">Session //</span> Active / Continue Using
        </h2>
        <span className="text-[13px] text-[var(--ink-secondary)] font-medium">Pick up where you left off</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--accent-soft-border)] hover:bg-[var(--accent-soft)] hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent)]/10 group-hover:bg-[var(--accent)] transition-colors"></div>

            <div className="flex justify-between items-start mb-3">
              <span className="inline-block px-2 py-1 rounded bg-[var(--surface-subdued)] border border-[var(--border)] text-[10px] font-mono font-medium text-[var(--ink-secondary)] uppercase group-hover:bg-white group-hover:border-[var(--accent-soft-border)] group-hover:text-[var(--accent)] transition-colors">
                {item.badge}
              </span>
              <span className="text-[12px] font-medium text-[var(--ink-tertiary)]">{item.timeAgo}</span>
            </div>

            <h3 className="text-[16px] font-bold text-[var(--ink)] mb-1 group-hover:text-[var(--accent)] transition-colors">
              {item.title}
            </h3>
            <p className="text-[13px] text-[var(--ink-secondary)] mb-4">{item.meta}</p>

            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)] opacity-80 group-hover:opacity-100 transition-opacity">
              Continue
              <Play className="w-[12px] h-[12px] fill-current" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
