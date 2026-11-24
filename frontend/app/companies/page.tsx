"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { CompaniesHeader } from "@/components/companies/CompaniesHeader";
import { TargetCompaniesSection } from "@/components/companies/TargetCompaniesSection";
import { CompanyWorkspace } from "@/components/companies/CompanyWorkspace";
import { CompanyDirectory } from "@/components/companies/CompanyDirectory";
import { RecentlyExploredTable } from "@/components/companies/RecentlyExploredTable";
import { AskedInSection } from "@/components/companies/AskedInSection";

import { 
  targetCompanies, 
  companyWorkspaces, 
  directoryCompanies,
} from "@/lib/data/companiesData";
import { RecentCompanyLog } from "@/types";

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSegment, setActiveSegment] = useState("All Companies");
  const [selectedCompanyId, setSelectedCompanyId] = useState("microsoft");
  // AppLayout renders pages only on the client, so localStorage is safe to read here.
  const [recentHistory, setRecentHistory] = useState<RecentCompanyLog[]>(() => {
    try {
      const saved: RecentCompanyLog[] = JSON.parse(localStorage.getItem("pathward_recent_companies") || "[]");
      return saved.filter((h) => typeof h.viewedAt === "number"); // entries from before viewedAt existed are dropped
    } catch {
      return [];
    }
  });

  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
          viewedAt: Date.now(),
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


  return (
    <div className="flex flex-col gap-10 md:gap-14 pb-24 relative max-w-[1440px] mx-auto w-full min-w-0">
      <CompaniesHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeSegment={activeSegment}
        setActiveSegment={setActiveSegment}
      />

      {searchQuery === "" && <AskedInSection />}

      <div className="flex flex-col gap-10 md:gap-14">
        {/* Only show target and workspace if search is empty, otherwise just show directory filter results */}
        {searchQuery === "" && activeSegment === "All Companies" && (
          <>
            <TargetCompaniesSection
              targets={targetCompanies}
              selectedId={selectedCompanyId}
              onSelect={handleSelectCompany}
            />

            {activeWorkspace && (
              <div ref={workspaceRef} className="scroll-mt-24">
                <CompanyWorkspace workspace={activeWorkspace} />
              </div>
            )}
          </>
        )}

        <CompanyDirectory
          companies={filteredDirectory}
          searchQuery={searchQuery}
          onSelect={handleSelectCompany}
        />

        {searchQuery === "" && (
          <RecentlyExploredTable history={recentHistory} onClear={handleClearHistory} onSelect={handleSelectCompany} />
        )}
      </div>
    </div>
  );
}
