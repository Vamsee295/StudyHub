"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

import { ResourcesHeader } from "@/components/resources/ResourcesHeader";
import { ResourcesSearchFilter, SortOption } from "@/components/resources/ResourcesSearchFilter";
import { ContinueReadingSection } from "@/components/resources/ContinueReadingSection";
import { ExploreCategoriesSection } from "@/components/resources/ExploreCategoriesSection";
import { CuratedResourcesSection } from "@/components/resources/CuratedResourcesSection";
import { SavedAndRecentSection } from "@/components/resources/SavedAndRecentSection";

import { resourceService, Resource } from "@/lib/resources";
import { resourceStorage } from "@/lib/resourceStorage";

export default function ResourcesPage() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("Relevant");

  // Telemetry & Storage State
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [recentResources, setRecentResources] = useState<(Resource & { viewedAt: string; lastPage?: number })[]>([]);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState({ saved: 0, recent: 0, completed: 0 });

  const categories = useMemo(() => {
    return resourceService.getCategoriesWithCounts();
  }, [catalogVersion]);

  const refreshStorageData = () => {
    const sIds = resourceStorage.getSavedIds();
    const cIds = resourceStorage.getCompletedIds();
    const recents = resourceStorage.getRecentResources();
    const saveds = resourceStorage.getSavedResources();
    const currentStats = resourceStorage.getStats();

    setSavedIds(sIds);
    setCompletedIds(cIds);
    setRecentResources(recents);
    setSavedResources(saveds);
    setStats(currentStats);
  };

  useEffect(() => {
    setMounted(true);
    refreshStorageData();

    // Dynamically sync newly added materials from filesystem API
    fetch("/api/materials/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.resources)) {
          resourceService.setDynamicCatalog(data.resources);
          setCatalogVersion((v) => v + 1);
        }
      })
      .catch((err) => {
        console.warn("[Resources] Using catalog baseline:", err);
      });

    // Global keyboard shortcut for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search notes"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resourceStorage.toggleSave(id);
    refreshStorageData();
  };

  const handleRemoveSaved = (id: string) => {
    resourceStorage.toggleSave(id);
    refreshStorageData();
  };

  const handleClearHistory = () => {
    resourceStorage.clearRecent();
    refreshStorageData();
  };

  const handleCategoryClick = (filterKey: string) => {
    setActiveFilter(filterKey);
    const element = document.getElementById("curated-resources");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Filtered resources based on query, category, and sort
  const filteredResources = useMemo(() => {
    return resourceService.searchAndFilter({
      query: searchQuery,
      category: activeFilter,
      sortBy
    });
  }, [searchQuery, activeFilter, sortBy, catalogVersion]);

  // Format continue reading items
  const continueReadingItems = useMemo(() => {
    return recentResources.slice(0, 3).map((r) => {
      const page = r.lastPage || 1;
      const totalPages = r.pageCount || 10;
      const percentage = Math.min(100, Math.round((page / totalPages) * 100));

      return {
        id: r.id,
        title: r.title,
        track: `Official StudyHub · ${r.category}`,
        unitProgress: `Page ${page} of ${totalPages}`,
        percentage: percentage > 0 ? percentage : 15,
        timeEstimate: r.readTimeEstimate || "Read",
        typeBadge: "PDF Document",
        href: `/resources/${r.id}`
      };
    });
  }, [recentResources]);

  // Framer Motion configuration
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col gap-10 md:gap-14 pb-24 relative max-w-[1440px] mx-auto w-full min-w-0">
      <ResourcesHeader 
        savedCount={mounted ? stats.saved : 0}
        recentCount={mounted ? stats.recent : 0}
        completedCount={mounted ? stats.completed : 0}
      />
      
      <ResourcesSearchFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <motion.div 
        className="flex flex-col gap-10 md:gap-14"
        variants={reduced ? undefined : container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {mounted && searchQuery === "" && activeFilter === "All" && continueReadingItems.length > 0 && (
          <motion.div variants={reduced ? undefined : item}>
            <ContinueReadingSection items={continueReadingItems} />
          </motion.div>
        )}

        <motion.div variants={reduced ? undefined : item}>
          <CuratedResourcesSection 
            resources={filteredResources} 
            bookmarkedIds={mounted ? savedIds : []}
            completedIds={mounted ? completedIds : []}
            onToggleBookmark={handleToggleBookmark}
          />
        </motion.div>

        {searchQuery === "" && activeFilter === "All" && (
          <motion.div variants={reduced ? undefined : item}>
            <ExploreCategoriesSection onCategoryClick={handleCategoryClick} />
          </motion.div>
        )}

        {mounted && searchQuery === "" && activeFilter === "All" && (
          <motion.div variants={reduced ? undefined : item}>
            <SavedAndRecentSection 
              savedResources={savedResources}
              recentResources={recentResources}
              onRemoveSaved={handleRemoveSaved}
              onClearHistory={handleClearHistory}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

