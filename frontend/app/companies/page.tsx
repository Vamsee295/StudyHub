"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { CompaniesHeader } from "@/components/companies/CompaniesHeader";
import { TargetCompaniesSection } from "@/components/companies/TargetCompaniesSection";
import { CompanyWorkspace } from "@/components/companies/CompanyWorkspace";
import { CompanyDirectory } from "@/components/companies/CompanyDirectory";
import { RecommendedCompanies } from "@/components/companies/RecommendedCompanies";
import { RecentlyExploredTable } from "@/components/companies/RecentlyExploredTable";

import { 
  targetCompanies, 
  companyWorkspaces, 
  directoryCompanies, 
  companyRecommendations, 
  initialRecentHistory 
} from "@/lib/data/companiesData";
import { RecentCompanyLog } from "@/types";

export default function CompaniesPage() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSegment, setActiveSegment] = useState("All Companies");
  const [selectedCompanyId, setSelectedCompanyId] = useState("microsoft");
  const [recentHistory, setRecentHistory] = useState<RecentCompanyLog[]>([]);

  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage or fallback
    const saved = localStorage.getItem("pathward_recent_companies");
    if (saved) {
      try {
        setRecentHistory(JSON.parse(saved));
      } catch (e) {
        setRecentHistory(initialRecentHistory);
      }
    } else {
      setRecentHistory(initialRecentHistory);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search companies"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update history when selecting a new company (if it exists in directory or targets)
  const handleSelectCompany = (id: string) => {
    setSelectedCompanyId(id);
    
    // Scroll to workspace
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Add to history if valid workspace exists
    const workspace = companyWorkspaces[id];
    if (workspace) {
      setRecentHistory(prev => {
        // Remove if already exists to move to top
        const filtered = prev.filter(h => h.id !== id);
        const newEntry: RecentCompanyLog = {
          id: workspace.id,
          name: workspace.name,
          targetRole: workspace.targetRole,
          lastInteraction: "Just now",
          cohortStatus: "Active",
          readinessScore: workspace.readinessScore,
          sprintAction: "Continue Prep →"
        };
        const updated = [newEntry, ...filtered].slice(0, 5); // Keep last 5
        localStorage.setItem("pathward_recent_companies", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleClearHistory = () => {
    setRecentHistory([]);
    localStorage.removeItem("pathward_recent_companies");
  };

  // Filter Directory
  const filteredDirectory = useMemo(() => {
    return directoryCompanies.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchSegment = activeSegment === "All Companies" || c.segmentFilter === activeSegment;
      return matchSearch && matchSegment;
    });
  }, [searchQuery, activeSegment]);

  const activeWorkspace = companyWorkspaces[selectedCompanyId];

  // Framer Motion variants
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

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-10 md:gap-14 pb-24 relative max-w-[1440px] mx-auto w-full min-w-0">
      <CompaniesHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeSegment={activeSegment}
        setActiveSegment={setActiveSegment}
      />

      <motion.div 
        className="flex flex-col gap-10 md:gap-14"
        variants={reduced ? undefined : container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Only show target and workspace if search is empty, otherwise just show directory filter results */}
        {searchQuery === "" && activeSegment === "All Companies" && (
          <>
            <motion.div variants={reduced ? undefined : item}>
              <TargetCompaniesSection 
                targets={targetCompanies}
                selectedId={selectedCompanyId}
                onSelect={handleSelectCompany}
              />
            </motion.div>

            {activeWorkspace && (
              <motion.div variants={reduced ? undefined : item} ref={workspaceRef} className="scroll-mt-24">
                <CompanyWorkspace workspace={activeWorkspace} />
              </motion.div>
            )}
          </>
        )}

        <motion.div variants={reduced ? undefined : item} className="scroll-mt-24">
          <CompanyDirectory 
            companies={filteredDirectory} 
            searchQuery={searchQuery}
            onSelect={handleSelectCompany}
          />
        </motion.div>

        {searchQuery === "" && (
          <>
            <motion.div variants={reduced ? undefined : item}>
              <RecommendedCompanies recommendations={companyRecommendations} />
            </motion.div>
            
            <motion.div variants={reduced ? undefined : item}>
              <RecentlyExploredTable 
                history={recentHistory}
                onClear={handleClearHistory}
                onSelect={handleSelectCompany}
              />
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
