"use client";

import { useState, useEffect, useMemo } from "react";

import { ResourcesHeader } from "@/components/resources/ResourcesHeader";
import { ResourcesSearchFilter, SortOption } from "@/components/resources/ResourcesSearchFilter";
import { ContinueReadingSection, type ContinueItem } from "@/components/resources/ContinueReadingSection";
import { ExploreCategoriesSection } from "@/components/resources/ExploreCategoriesSection";
import { CuratedResourcesSection } from "@/components/resources/CuratedResourcesSection";
import { SavedAndRecentSection } from "@/components/resources/SavedAndRecentSection";

import { resourceService } from "@/lib/resources";
import { resourceStorage } from "@/lib/resourceStorage";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("Relevant");

  // Bumped when the catalog or this device's saved/recent/completed lists change; everything below re-reads.
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [storageVersion, setStorageVersion] = useState(0);
  const refresh = () => setStorageVersion((v) => v + 1);

  // AppLayout renders pages only on the client, so reading localStorage during render is safe.
  const store = useMemo(
    () => ({
      savedIds: resourceStorage.getSavedIds(),
      completedIds: resourceStorage.getCompletedIds(),
      recent: resourceStorage.getRecentResources(),
      saved: resourceStorage.getSavedResources(),
      stats: resourceStorage.getStats(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the versions are the cache keys for localStorage reads
    [storageVersion, catalogVersion]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps -- re-count when the catalog changes
  const categories = useMemo(() => resourceService.getCategoriesWithCounts(), [catalogVersion]);

  useEffect(() => {
    // Pick up materials added to the filesystem since the build
    fetch("/api/materials/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.resources)) {
          resourceService.setDynamicCatalog(data.resources);
          setCatalogVersion((v) => v + 1);
        }
      })
      .catch((err) => console.warn("[Resources] Using catalog baseline:", err));

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[placeholder*="Search notes"]')?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resourceStorage.toggleSave(id);
    refresh();
  };

  const handleRemoveSaved = (id: string) => {
    resourceStorage.toggleSave(id);
    refresh();
  };

  const handleClearHistory = () => {
    resourceStorage.clearRecent();
    refresh();
  };

  const handleCategoryClick = (filterKey: string) => {
    setActiveFilter(filterKey);
    document.getElementById("curated-resources")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredResources = useMemo(
    () => resourceService.searchAndFilter({ query: searchQuery, category: activeFilter, sortBy }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- catalogVersion invalidates the catalog
    [searchQuery, activeFilter, sortBy, catalogVersion]
  );

  // Started but unfinished PDFs. Progress = furthest page reached / real page count; no bar when the count isn't known yet.
  const continueReadingItems = useMemo<ContinueItem[]>(
    () =>
      store.recent
        .filter((r) => !store.completedIds.includes(r.id))
        .slice(0, 3)
        .map((r) => {
          const page = r.maxPage ?? r.lastPage ?? 1;
          return {
            id: r.id,
            title: r.title,
            category: r.category,
            page,
            pageCount: r.pageCount,
            percentage: r.pageCount ? Math.min(100, Math.round((page / r.pageCount) * 100)) : null,
            href: `/resources/${r.id}`,
          };
        }),
    [store]
  );

  const browsing = searchQuery === "" && activeFilter === "All";

  return (
    <div className="relative mx-auto flex w-full min-w-0 max-w-[1440px] flex-col gap-10 pb-24 md:gap-14">
      <ResourcesHeader savedCount={store.stats.saved} recentCount={store.stats.recent} completedCount={store.stats.completed} />

      <ResourcesSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {browsing && <ContinueReadingSection items={continueReadingItems} />}

      <CuratedResourcesSection
        resources={filteredResources}
        bookmarkedIds={store.savedIds}
        completedIds={store.completedIds}
        onToggleBookmark={handleToggleBookmark}
      />

      {browsing && <ExploreCategoriesSection counts={categories} onCategoryClick={handleCategoryClick} />}

      {browsing && (
        <SavedAndRecentSection
          savedResources={store.saved}
          recentResources={store.recent}
          onRemoveSaved={handleRemoveSaved}
          onClearHistory={handleClearHistory}
        />
      )}
    </div>
  );
}
