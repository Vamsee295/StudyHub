"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowUpDown, Check, X } from "lucide-react";
import { clsx } from "clsx";

export type SortOption = "Relevant" | "A-Z" | "Category" | "Difficulty";

interface ResourcesSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  categories: { name: string; count: number }[];
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

export function ResourcesSearchFilter({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  categories,
  sortBy,
  setSortBy
}: ResourcesSearchFilterProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions: SortOption[] = ["Relevant", "A-Z", "Category", "Difficulty"];

  return (
    <section className="flex flex-col gap-4 sticky top-14 md:top-0 z-30 bg-paper/90 backdrop-blur-xl py-4 -mx-6 px-6 border-b border-hair shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute group-focus-within:text-accent-ink transition-colors" />
          <input
            type="text"
            placeholder="Search notes, cheat sheets, interview guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-hair rounded-xl py-2.5 pl-10 pr-12 text-[14px] text-ink placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-mute hover:text-ink transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
              <kbd className="font-mono text-[10px] bg-paper-2 border border-hair text-body px-1.5 py-0.5 rounded shadow-[0_1px_1px_0_rgba(0,0,0,0.02)] font-semibold tracking-wider">
                ⌘K
              </kbd>
            </div>
          )}
        </div>

        {/* Sort Action Button with Dropdown */}
        <div className="relative shrink-0" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-2 bg-card border border-hair hover:border-line hover:bg-paper-2/50 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-body transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] cursor-pointer"
          >
            <ArrowUpDown className="w-4 h-4 text-accent-ink" />
            <span>Sort: <strong className="text-ink font-semibold">{sortBy}</strong></span>
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-card border border-hair rounded-xl shadow-xl shadow-ink/5 p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSortBy(opt);
                    setSortOpen(false);
                  }}
                  className={clsx(
                    "flex items-center justify-between px-3 py-2 text-[13px] rounded-lg text-left transition-colors cursor-pointer",
                    sortBy === opt
                      ? "bg-accent-soft text-accent-ink font-semibold"
                      : "text-body hover:bg-paper-2 hover:text-ink"
                  )}
                >
                  <span>{opt}</span>
                  {sortBy === opt && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isActive = activeFilter === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveFilter(cat.name)}
              className={clsx(
                "whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0",
                isActive
                  ? "bg-ink text-paper shadow-md shadow-ink/10 ring-1 ring-ink"
                  : "bg-card text-body border border-hair hover:border-line hover:bg-paper-2/50"
              )}
            >
              {cat.name}
              <span
                className={clsx(
                  "text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-card/20 text-paper" : "bg-paper-2 text-mute"
                )}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

