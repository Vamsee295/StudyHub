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

import { 
  curatedPlacementResources, 
  initialSavedResources, 
  initialRecentResources 
} from "@/lib/data/resourcesData";
import { SavedResourceRecord, RecentlyViewedRecord } from "@/types";

export default function ResourcesPage() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Bookmarks & History
  const [savedResources, setSavedResources] = useState<SavedResourceRecord[]>([]);
  const [recentResources, setRecentResources] = useState<RecentlyViewedRecord[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Load saved resources
    const localSaved = localStorage.getItem("pathward_saved_resources");
    if (localSaved) {
      try { setSavedResources(JSON.parse(localSaved)); } 
      catch (e) { setSavedResources(initialSavedResources); }
    } else {
      setSavedResources(initialSavedResources);
    }

    // Load recent resources
    const localRecent = localStorage.getItem("pathward_recent_resources");
    if (localRecent) {
      try { setRecentResources(JSON.parse(localRecent)); }
      catch (e) { setRecentResources(initialRecentResources); }
    } else {
      setRecentResources(initialRecentResources);
    }

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
    
    setSavedResources(prev => {
      const isCurrentlySaved = prev.some(r => r.id === id);
      let newSaved;
      
      if (isCurrentlySaved) {
        newSaved = prev.filter(r => r.id !== id);
      } else {
        // Find full resource details from curated (simplified mock behavior)
        const resource = curatedPlacementResources.find(r => r.id === id);
        if (resource) {
          const newRecord: SavedResourceRecord = {
            id: resource.id,
            title: resource.title,
            topic: resource.category,
            type: "Handbook", // mocked default
            savedAt: "Just now",
            iconName: "code_blocks", // mocked default
            href: `/resources/${resource.slug}`
          };
          newSaved = [newRecord, ...prev];
        } else {
          newSaved = prev;
        }
      }
      
      localStorage.setItem("pathward_saved_resources", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const handleRemoveSaved = (id: string) => {
    setSavedResources(prev => {
      const newSaved = prev.filter(r => r.id !== id);
      localStorage.setItem("pathward_saved_resources", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const handleClearHistory = () => {
    setRecentResources([]);
    localStorage.removeItem("pathward_recent_resources");
  };

  const handleCategoryClick = (filterKey: string) => {
    setActiveFilter(filterKey);
    const element = document.getElementById("curated-resources");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Derived state for filtered curated resources
  const filteredCuratedResources = useMemo(() => {
    return curatedPlacementResources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = activeFilter === "All" || resource.category === activeFilter || resource.tags.includes(activeFilter);
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

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
        {searchQuery === "" && activeFilter === "All" && (
          <>
            <motion.div variants={reduced ? undefined : item}>
              <ContinueReadingSection />
            </motion.div>
            <motion.div variants={reduced ? undefined : item}>
              <ExploreCategoriesSection onCategoryClick={handleCategoryClick} />
            </motion.div>
          </>
        )}

        <motion.div variants={reduced ? undefined : item}>
          <CuratedResourcesSection 
            resources={filteredCuratedResources} 
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
      </motion.div>
    </div>
  );
}
