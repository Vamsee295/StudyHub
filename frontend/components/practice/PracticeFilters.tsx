"use client";

import { Search, ChevronDown, Filter } from "lucide-react";
import { clsx } from "clsx";

interface PracticeFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTrack: string;
  setActiveTrack: (track: string) => void;
}

const tracks = [
  { id: "all", label: "All Tracks", count: null },
  { id: "dsa", label: "DSA", count: 420 },
  { id: "sql", label: "SQL & Databases", count: 180 },
  { id: "java", label: "Java Core", count: 95 },
  { id: "cs", label: "Core CS", count: 140 },
  { id: "aptitude", label: "Aptitude & Reasoning", count: 210 },
];

export function PracticeFilters({ searchQuery, setSearchQuery, activeTrack, setActiveTrack }: PracticeFiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[var(--border)]/80 pb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, algorithms, SQL schemas, or company tags..."
            className="w-full pl-10 pr-12 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[14px] text-[var(--ink)] placeholder-[var(--ink-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="font-mono text-[10px] text-[var(--ink-tertiary)] bg-[var(--canvas)] border border-[var(--border)] px-1.5 py-0.5 rounded">⌘</kbd>
            <kbd className="font-mono text-[10px] text-[var(--ink-tertiary)] bg-[var(--canvas)] border border-[var(--border)] px-1.5 py-0.5 rounded">P</kbd>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <Filter className="w-3.5 h-3.5" />
            <span>Difficulty: All</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-50" />
          </button>
          <button className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <span>Status: All</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-50" />
          </button>
        </div>
      </div>

      {/* Track Segmented Control */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tracks.map((track) => {
          const isActive = activeTrack === track.id;
          return (
            <button
              key={track.id}
              onClick={() => setActiveTrack(track.id)}
              className={clsx(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap border",
                isActive
                  ? "bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)] shadow-sm"
                  : "bg-[var(--surface)] text-[var(--ink-secondary)] border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
              )}
            >
              <span>{track.label}</span>
              {track.count !== null && (
                <span className={clsx(
                  "px-1.5 py-0.5 rounded text-[10px] font-mono",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-[var(--surface-subdued)] text-[var(--ink-tertiary)]"
                )}>
                  {track.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
