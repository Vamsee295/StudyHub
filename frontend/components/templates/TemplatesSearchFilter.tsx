"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, ArrowDownAZ } from "lucide-react";
import { clsx } from "clsx";
import { templateCategories } from "@/lib/data/templatesData";

interface TemplatesSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
}

export function TemplatesSearchFilter({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: TemplatesSearchFilterProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-5 mb-10 sticky top-[64px] z-40 bg-[var(--canvas)]/95 backdrop-blur-md py-4 border-b border-[var(--border)] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] -mx-6 px-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div
          className={clsx(
            "relative w-full sm:max-w-md flex items-center bg-[var(--surface)] border rounded-xl overflow-hidden transition-all duration-200",
            isFocused
              ? "border-[var(--accent)] ring-4 ring-[var(--accent)]/10 shadow-sm"
              : "border-[var(--border)] hover:border-[var(--border-strong)]"
          )}
        >
          <Search
            className={clsx(
              "absolute left-3.5 w-4 h-4 transition-colors",
              isFocused ? "text-[var(--accent)]" : "text-[var(--ink-tertiary)]"
            )}
          />
          <input
            type="text"
            placeholder="Search resumes, scripts, matrices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-10 pr-12 py-2.5 bg-transparent text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-tertiary)] focus:outline-none"
          />
          <kbd className="absolute right-3 font-mono text-[10px] bg-[var(--surface-subdued)] border border-[var(--border)] text-[var(--ink-secondary)] px-1.5 py-0.5 rounded shadow-[0_1px_1px_0_rgba(0,0,0,0.02)] font-medium">
            ⌘K
          </kbd>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[13px] font-semibold text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subdued)] transition-all">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[13px] font-semibold text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subdued)] transition-all">
            <ArrowDownAZ className="w-4 h-4" />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 no-scrollbar mask-edges">
        {templateCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={clsx(
              "shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 border",
              activeCategory === cat.id
                ? "bg-[var(--ink)] border-[var(--ink)] text-white shadow-md shadow-[var(--ink)]/10"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subdued)]"
            )}
          >
            <span>{cat.label}</span>
            <span
              className={clsx(
                "text-[11px] px-1.5 py-0.5 rounded-md font-semibold transition-colors",
                activeCategory === cat.id
                  ? "bg-white/20 text-white"
                  : "bg-[var(--surface-subdued)] text-[var(--ink-tertiary)]"
              )}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
