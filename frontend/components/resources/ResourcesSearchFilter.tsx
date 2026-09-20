import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { filterCategories } from "@/lib/data/resourcesData";
import { clsx } from "clsx";

interface ResourcesSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function ResourcesSearchFilter({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter
}: ResourcesSearchFilterProps) {
  return (
    <section className="flex flex-col gap-4 sticky top-16 z-40 bg-[var(--canvas)]/90 backdrop-blur-xl py-4 -mx-6 px-6 border-b border-[var(--border)] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" />
          <input
            type="text"
            placeholder="Search notes, cheat sheets, interview guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-12 text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd className="font-mono text-[10px] bg-[var(--surface-subdued)] border border-[var(--border)] text-[var(--ink-secondary)] px-1.5 py-0.5 rounded shadow-[0_1px_1px_0_rgba(0,0,0,0.02)] font-semibold tracking-wider">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subdued)]/50 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[var(--ink-secondary)] transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subdued)]/50 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[var(--ink-secondary)] transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">Sort: Relevant</span>
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
        {filterCategories.map((cat) => {
          const isActive = activeFilter === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveFilter(cat.name)}
              className={clsx(
                "whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-2",
                isActive
                  ? "bg-[var(--ink)] text-white shadow-md shadow-[var(--ink)]/10 ring-1 ring-[var(--ink)]"
                  : "bg-[var(--surface)] text-[var(--ink-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subdued)]/50"
              )}
            >
              {cat.name}
              <span className={clsx(
                "text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                isActive ? "bg-white/20 text-white" : "bg-[var(--surface-subdued)] text-[var(--ink-tertiary)]"
              )}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
