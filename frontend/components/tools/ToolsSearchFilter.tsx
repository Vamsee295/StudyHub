import React, { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { toolsCategories } from "@/lib/data/toolsData";
import { ToolCategory } from "@/types";
import { clsx } from "clsx";

interface ToolsSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeCategory: ToolCategory;
  setActiveCategory: (cat: ToolCategory) => void;
  filteredCount?: number;
}

export function ToolsSearchFilter({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  filteredCount,
}: ToolsSearchFilterProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="sticky top-[64px] z-40 bg-paper/80 backdrop-blur-md pt-4 pb-4 mb-8 border-b border-hair shadow-[0_1px_2px_rgba(15,23,42,0.01)]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills (Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide shrink-0 max-w-full md:max-w-[65%]">
          {toolsCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  "shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-2 border",
                  isActive
                    ? "bg-ink text-paper border-ink shadow-md"
                    : "bg-card text-body border-hair hover:bg-paper-2 hover:text-ink"
                )}
              >
                {cat.label}
                <span
                  className={clsx(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-card/20 text-paper"
                      : "bg-paper-2 text-mute"
                  )}
                >
                  {cat.id === "all" && filteredCount !== undefined ? filteredCount : cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0 lg:w-72 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-mute group-focus-within:text-accent-ink transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search tools, topics, or tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] bg-card border-[1.5px] border-hair rounded-md pl-9 pr-10 text-[13.5px] text-ink placeholder:text-mute focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-[0_1px_2px_rgba(15,23,42,0.02)]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="font-mono text-[10px] bg-paper-2 border-[1.5px] border-hair text-mute px-1.5 py-0.5 rounded shadow-[0_1px_1px_0_rgba(0,0,0,0.02)] font-medium">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
