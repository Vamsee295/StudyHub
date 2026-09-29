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
    <div className="bg-[#FFFFFF] border-b border-slate-200 sticky top-16 z-30">
      <div
        ref={scrollRef}
        className="max-w-[1050px] mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none py-2 px-4 sm:px-8"
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
              "shrink-0 px-3 h-[42px] rounded-[8px] text-[14px] font-medium transition-colors whitespace-nowrap",
              active === f.id
                ? "bg-blue-50 text-[#2563eb]"
                : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
