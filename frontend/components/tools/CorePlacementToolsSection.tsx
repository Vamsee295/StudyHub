import React from "react";
import { CoreToolItem } from "@/types";
import Link from "next/link";

export function CorePlacementToolsSection({ items }: { items: CoreToolItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14 animate-in fade-in duration-500 delay-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[14px] font-bold text-[var(--ink)] tracking-wide uppercase flex items-center gap-2">
          <span className="text-[var(--ink-tertiary)] font-mono">Module 01 /</span> Core Placement Tools
        </h2>
        <span className="text-[13px] text-[var(--ink-secondary)] font-medium hidden sm:block">
          Practical utilities for coding, interviews, and resumes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex flex-col justify-between bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-strong)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition-all duration-300 min-h-[160px]"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="pill pill-neutral group-hover:border-[var(--border-strong)] transition-colors">
                  {item.tag}
                </span>
                <span className="w-8 h-8 rounded bg-[var(--surface-subdued)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-secondary)] group-hover:text-[var(--ink)] transition-colors group-hover:bg-white">
                  {/* Icon placeholder - could be mapped from item.icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </span>
              </div>
              <h3 className="text-[15.5px] font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                {item.title}
              </h3>
              <p className="text-[13px] text-[var(--ink-secondary)] leading-snug">
                {item.description}
              </p>
            </div>
            {item.codeAst && (
              <div className="mt-4 pt-4 border-t border-[var(--border)] group-hover:border-[var(--border-strong)] transition-colors">
                <code className="text-[11px] font-mono font-medium text-[var(--ink-tertiary)] bg-[var(--surface-subdued)] px-1.5 py-0.5 rounded group-hover:text-[var(--ink-secondary)] transition-colors">
                  {item.codeAst}
                </code>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
