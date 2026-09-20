"use client";

import React, { useState, useMemo } from "react";
import { ToolsHeader } from "@/components/tools/ToolsHeader";
import { ToolsSearchFilter } from "@/components/tools/ToolsSearchFilter";
import { ContinueUsingSection } from "@/components/tools/ContinueUsingSection";
import { CorePlacementToolsSection } from "@/components/tools/CorePlacementToolsSection";
import { InterviewUtilitiesSection } from "@/components/tools/InterviewUtilitiesSection";
import { CalculatorsTrackersSection } from "@/components/tools/CalculatorsTrackersSection";
import { RecommendedToolsSection } from "@/components/tools/RecommendedToolsSection";
import { RecentlyUsedLedger } from "@/components/tools/RecentlyUsedLedger";
import { ToolCategory } from "@/types";

import {
  continueUsingTools,
  corePlacementTools,
  interviewUtilities,
  calculatorsTrackers,
  recommendedTools,
  recentToolAudits,
} from "@/lib/data/toolsData";

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");

  // Filter core placement tools
  const filteredCoreTools = useMemo(() => {
    let filtered = corePlacementTools;
    if (activeCategory !== "all") {
      filtered = filtered.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tag.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [searchQuery, activeCategory]);

  const isFiltering = searchQuery.trim() !== "" || activeCategory !== "all";

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 animate-in fade-in duration-500">
      <ToolsHeader />

      <ToolsSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        filteredCount={filteredCoreTools.length}
      />

      {/* When filtering, only show relevant sections or just hide recommended/recent things */}
      {!isFiltering && <ContinueUsingSection items={continueUsingTools} />}

      <CorePlacementToolsSection items={filteredCoreTools} />

      {!isFiltering && (
        <>
          <InterviewUtilitiesSection items={interviewUtilities} />
          <CalculatorsTrackersSection items={calculatorsTrackers} />
          <RecommendedToolsSection items={recommendedTools} />
          <RecentlyUsedLedger items={recentToolAudits} />
        </>
      )}

      {/* Empty State for Core Tools if filtering returns nothing */}
      {isFiltering && filteredCoreTools.length === 0 && (
        <div className="text-center py-20 bg-[var(--surface-subdued)]/50 rounded-xl border border-[var(--border)] border-dashed">
          <p className="text-[14px] text-[var(--ink-secondary)] font-medium">
            No tools found for "{searchQuery}" in this category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-4 text-[13px] font-semibold text-[var(--accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
