"use client";

import React, { useRef } from "react";
import { clsx } from "clsx";
import { FEED_FILTERS, type FeedFilter } from "@/lib/types/community";

interface ActivityFilterBarProps {
  active: FeedFilter;
  onChange: (filter: FeedFilter) => void;
}

export function ActivityFilterBar({ active, onChange }: ActivityFilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3 px-4 sm:px-8 border-b border-[var(--border)] bg-[var(--surface)] sticky top-16 z-30"
      role="tablist"
      aria-label="Filter community feed"
    >
      {FEED_FILTERS.map((f) => (
        <button
          key={f.id}
          role="tab"
          aria-selected={active === f.id}
          onClick={() => onChange(f.id)}
          className={clsx(
            "shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap",
            active === f.id
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border border-[var(--border)] hover:text-[var(--ink)] hover:border-[var(--accent-soft-border)]"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
