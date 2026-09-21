"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

import { ResourcesHeader } from "@/components/resources/ResourcesHeader";
import { ResourcesSearchFilter } from "@/components/resources/ResourcesSearchFilter";
import { ContinueReadingSection } from "@/components/resources/ContinueReadingSection";
import { ExploreCategoriesSection } from "@/components/resources/ExploreCategoriesSection";
import { CuratedResourcesSection } from "@/components/resources/CuratedResourcesSection";
import { RecommendedPathSection } from "@/components/resources/RecommendedPathSection";
import { SavedAndRecentSection } from "@/components/resources/SavedAndRecentSection";

import { resourcesApi, Resource, ResourceCategory, UserResourceProgress, UserSavedResource } from "@/lib/api/resources";
import { SavedResourceRecord, RecentlyViewedRecord } from "@/types";

export default function ResourcesPage() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Data
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bookmarks & History
  const [savedResources, setSavedResources] = useState<any[]>([]);
  const [recentResources, setRecentResources] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    
    async function loadData() {
      try {
        const [resourcesRes, historyRes] = await Promise.all([
          resourcesApi.getResources(),
          resourcesApi.getHistory()
        ]);
        
        if (resourcesRes.categories) setCategories(resourcesRes.categories);
        if (resourcesRes.resources) setResources(resourcesRes.resources);
        
        if (historyRes.recent) setRecentResources(historyRes.recent);
        if (historyRes.saved) setSavedResources(historyRes.saved);
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

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

  const handleToggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await resourcesApi.toggleSave(id);
      if (res.status === "saved") {
        const resource = resources.find(r => r.id === id);
        if (resource) {
          setSavedResources(prev => [{
            id: resource.id,
            title: resource.title,
            topic: resource.category_id,
            type: resource.file_type.toUpperCase(),
            savedAt: "Just now",
            iconName: "book",
            href: `/resources/${resource.id}`
          }, ...prev]);
        }
      } else {
        setSavedResources(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    }
  };

  const handleRemoveSaved = async (id: string) => {
    try {
      await resourcesApi.toggleSave(id);
      setSavedResources(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Failed to remove bookmark", err);
    }
  };

  const handleClearHistory = () => {
    // Ideally call API to clear history, but we'll mock it for now
    setRecentResources([]);
  };

  const handleCategoryClick = (filterKey: string) => {
    setActiveFilter(filterKey);
    const element = document.getElementById("curated-resources");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Derived state for filtered curated resources
  const formattedResources = useMemo(() => {
    return resources.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: categories.find(c => c.id === r.category_id)?.name || r.category_id,
      type: r.file_type.toUpperCase(),
      author: r.author,
      pageCount: r.page_count,
      fileSizeBytes: r.file_size_bytes || 0,
      readTimeMinutes: Math.round(r.page_count * 2), // roughly 2 mins per page
      tags: [categories.find(c => c.id === r.category_id)?.name || r.category_id],
      slug: r.id
    }));
  }, [resources, categories]);

  const filteredCuratedResources = useMemo(() => {
    return formattedResources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = activeFilter === "All" || resource.category === activeFilter || resource.tags.includes(activeFilter);
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, formattedResources]);

  const bookmarkedIds = useMemo(() => savedResources.map(r => r.id), [savedResources]);

  // Framer Motion configuration
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-10 md:gap-14 pb-24 relative max-w-[1440px] mx-auto w-full min-w-0">
      <ResourcesHeader />
      
      <ResourcesSearchFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <motion.div 
        className="flex flex-col gap-10 md:gap-14"
        variants={reduced ? undefined : container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {isLoading ? (
          <div className="py-20 text-center text-[var(--ink-tertiary)]">Loading resources...</div>
        ) : (
          <>
            {searchQuery === "" && activeFilter === "All" && (
              <>
                <motion.div variants={reduced ? undefined : item}>
                  <ContinueReadingSection items={recentResources} />
                </motion.div>
                <motion.div variants={reduced ? undefined : item}>
                  <ExploreCategoriesSection onCategoryClick={handleCategoryClick} />
                </motion.div>
              </>
            )}

            <motion.div variants={reduced ? undefined : item}>
              <CuratedResourcesSection 
                resources={filteredCuratedResources as any} 
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
              />
            </motion.div>

            {searchQuery === "" && activeFilter === "All" && (
              <motion.div variants={reduced ? undefined : item}>
                <RecommendedPathSection />
              </motion.div>
            )}

            <motion.div variants={reduced ? undefined : item}>
              <SavedAndRecentSection 
                savedResources={savedResources}
                recentResources={recentResources}
                onRemoveSaved={handleRemoveSaved}
                onClearHistory={handleClearHistory}
              />
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
