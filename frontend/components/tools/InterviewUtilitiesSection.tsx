import React from "react";
import { InterviewUtilityItem } from "@/types";
import Link from "next/link";
import { clsx } from "clsx";

export function InterviewUtilitiesSection({ items }: { items: InterviewUtilityItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14 animate-in fade-in duration-500 delay-200">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[14px] font-bold text-[var(--ink)] tracking-wide uppercase flex items-center gap-2">
          <span className="text-[var(--ink-tertiary)] font-mono">Module 02 /</span> Interview Utilities
        </h2>
        <span className="text-[13px] text-[var(--ink-secondary)] font-medium hidden sm:block">
          Tools for technical, architectural, and behavioral rounds
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-strong)] transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded-sm bg-[var(--surface-subdued)] border border-[var(--border)] text-[10px] font-mono font-medium text-[var(--ink-secondary)] uppercase">
                {item.tag}
              </span>
            </div>

            <h3 className="text-[15.5px] font-bold text-[var(--ink)] mb-1 group-hover:text-[var(--accent)] transition-colors">
              {item.title}
            </h3>
            
            <div className="flex items-center gap-3 text-[12.5px] font-medium text-[var(--ink-tertiary)] mb-5">
              <span className="text-[var(--ink-secondary)]">{item.durationOrStep}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
              <span>{item.meta}</span>
            </div>

            <div
              className={clsx(
                "inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-[13px] font-semibold transition-all w-full",
                item.isPrimaryAction
                  ? "bg-[var(--ink)] text-white group-hover:bg-[var(--accent)] shadow-sm"
                  : "bg-[var(--surface-subdued)] text-[var(--ink)] border border-[var(--border)] group-hover:bg-white group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
              )}
            >
              {item.actionLabel}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
