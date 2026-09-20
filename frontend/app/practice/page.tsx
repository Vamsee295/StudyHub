"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { PracticeHeader } from "@/components/practice/PracticeHeader";
import { PracticeFilters } from "@/components/practice/PracticeFilters";
import { QuickPracticeSection } from "@/components/practice/QuickPracticeSection";
import { RecommendedSection } from "@/components/practice/RecommendedSection";
import { TopicsSection } from "@/components/practice/TopicsSection";
import { PlacementSection } from "@/components/practice/PlacementSection";
import { RecentPracticeSection } from "@/components/practice/RecentPracticeSection";
import { PracticeShortcutsBar } from "@/components/practice/PracticeShortcutsBar";

import { 
  quickSprints, 
  recommendedDiagnostics, 
  curriculumBanks, 
  placementSimulations, 
  practiceLedger 
} from "@/lib/data/practiceData";
import { SearchX } from "lucide-react";

export default function PracticePage() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTrack, setActiveTrack] = useState("all");

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+P or Ctrl+P to focus search (in a real app we'd have a ref to the input)
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search questions"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered data logic
  const filteredSprints = useMemo(() => {
    return quickSprints.filter(s => {
      const matchTrack = activeTrack === "all" || s.track === activeTrack;
      const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTrack && matchSearch;
    });
  }, [activeTrack, searchQuery]);

  const filteredDiagnostics = useMemo(() => {
    return recommendedDiagnostics.filter(d => {
      const matchTrack = activeTrack === "all" || d.track === activeTrack;
      const matchSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTrack && matchSearch;
    });
  }, [activeTrack, searchQuery]);

  const filteredBanks = useMemo(() => {
    return curriculumBanks.filter(b => {
      const matchTrack = activeTrack === "all" || b.track === activeTrack;
      const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTrack && matchSearch;
    });
  }, [activeTrack, searchQuery]);

  // Placement sims don't have a strict track, but we can filter by search
  const filteredSimulations = useMemo(() => {
    return placementSimulations.filter(s => {
      if (activeTrack !== "all") return false; // Placement is mixed, maybe hide if a specific track is selected
      return s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             s.companyTag.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [activeTrack, searchQuery]);

  const filteredLedger = useMemo(() => {
    return practiceLedger.filter(l => {
      const matchTrack = activeTrack === "all" || l.track === activeTrack;
      const matchSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTrack && matchSearch;
    });
  }, [activeTrack, searchQuery]);

  const hasResults = filteredSprints.length > 0 || 
                     filteredDiagnostics.length > 0 || 
                     filteredBanks.length > 0 || 
                     filteredSimulations.length > 0 || 
                     filteredLedger.length > 0;

  // Stagger variants
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Prevent hydration mismatch by returning null until mounted if using system features
  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-10 pb-24 w-full relative">
      <PracticeHeader />
      
      <PracticeFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTrack={activeTrack}
        setActiveTrack={setActiveTrack}
      />

      {hasResults ? (
        <motion.div 
          className="flex flex-col gap-16"
          variants={reduced ? undefined : container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={reduced ? undefined : item}>
            <QuickPracticeSection sprints={filteredSprints} />
          </motion.div>
          
          <motion.div variants={reduced ? undefined : item}>
            <RecommendedSection diagnostics={filteredDiagnostics} />
          </motion.div>
          
          <motion.div variants={reduced ? undefined : item}>
            <TopicsSection banks={filteredBanks} />
          </motion.div>
          
          <motion.div variants={reduced ? undefined : item}>
            <PlacementSection simulations={filteredSimulations} />
          </motion.div>
          
          <motion.div variants={reduced ? undefined : item}>
            <RecentPracticeSection ledger={filteredLedger} />
          </motion.div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-[var(--surface-subdued)] rounded-2xl flex items-center justify-center mb-4">
            <SearchX className="w-8 h-8 text-[var(--ink-tertiary)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--ink)] mb-2">No practice modules found</h3>
          <p className="text-[var(--ink-secondary)] max-w-md mx-auto mb-6">
            We couldn't find any practice sets matching "{searchQuery}" for the selected track.
          </p>
          <button 
            onClick={() => {
              setSearchQuery("");
              setActiveTrack("all");
            }}
            className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--ink)] text-[var(--ink)] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      <PracticeShortcutsBar />
    </div>
  );
}
