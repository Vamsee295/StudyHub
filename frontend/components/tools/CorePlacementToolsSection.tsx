import React from "react";
import { CoreToolItem } from "@/types";
import Link from "next/link";

export function CorePlacementToolsSection({ items }: { items: CoreToolItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14 animate-in fade-in duration-500 delay-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">Core</span>
          <span className="display text-[28px] md:text-[34px]">Placement tools</span>
        </h2>
        <span className="text-[13px] text-body font-medium hidden sm:block">
          Practical utilities for coding, interviews, and resumes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex flex-col justify-between bg-card border-[1.5px] border-hair rounded-xl p-5 hover:border-line hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition-all duration-300 min-h-[160px]"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="pill pill-neutral group-hover:border-line transition-colors">
                  {item.tag}
                </span>
                <span className="w-8 h-8 rounded bg-paper-2 border-[1.5px] border-hair flex items-center justify-center text-body group-hover:text-ink transition-colors group-hover:bg-card">
                  {/* Icon placeholder - could be mapped from item.icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </span>
              </div>
              <h3 className="text-[15.5px] font-bold text-ink mb-2 group-hover:text-accent-ink transition-colors">
                {item.title}
              </h3>
              <p className="text-[13px] text-body leading-snug">
                {item.description}
              </p>
            </div>
            {item.codeAst && (
              <div className="mt-4 pt-4 border-t border-hair group-hover:border-line transition-colors">
                <code className="text-[11px] font-mono font-medium text-mute bg-paper-2 px-1.5 py-0.5 rounded group-hover:text-body transition-colors">
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
