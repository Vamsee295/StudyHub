"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { CompaniesHeader } from "@/components/companies/CompaniesHeader";
import { TargetCompaniesSection } from "@/components/companies/TargetCompaniesSection";
import { CompanyWorkspace } from "@/components/companies/CompanyWorkspace";
import { CompanyDirectory } from "@/components/companies/CompanyDirectory";
import { RecentlyExploredTable } from "@/components/companies/RecentlyExploredTable";
import { AskedInSection } from "@/components/companies/AskedInSection";
import { HiringBasics } from "@/components/companies/HiringBasics";
import { INTERVIEW_RESOURCES } from "@/lib/data/companyPrep";
import { ExternalLink } from "lucide-react";

import { companyWorkspaces } from "@/lib/data/companiesData";
import { COMPANIES, companyById, companyByName } from "@/lib/data/companyData";
import { useProfile } from "@/components/providers/ProfileProvider";
import { RecentCompanyLog } from "@/types";

const POPULAR = ["google", "microsoft", "amazon", "tcs-prime"];

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSegment, setActiveSegment] = useState("All Companies");
  // ?company=infosys (e.g. from the dashboard) opens that workspace; client-only render, so location is readable
  const [selectedCompanyId, setSelectedCompanyId] = useState(() => {
    const id = new URLSearchParams(window.location.search).get("company");
    return id && companyById(id) ? id : "google";
  });
  // the learner's own target companies from their profile, else popular ones
  const { draftProfile: profile } = useProfile();
  const mine = (profile?.targets?.companies ?? []).map(companyByName).filter((c): c is NonNullable<typeof c> => !!c);
  const targets = [...new Map((mine.length ? mine : POPULAR.map(companyById)).filter((c) => !!c).map((c) => [c!.id, c!])).values()].slice(0, 4);
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
  // opening a company while searching or filtering still shows it
  const [opened, setOpened] = useState(false);

  // a ?company= link (from the dashboard, a profile, a shared URL) lands on that company
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).get("company") || window.location.hash) return;
    const go = () => workspaceRef.current?.scrollIntoView({ block: "start" });
    go();
    // diagrams above draw a moment later and push the workspace down; land on it again unless the reader scrolled
    const y = window.scrollY;
    const t = setTimeout(() => Math.abs(window.scrollY - y) < 4 && go(), 900);
    return () => clearTimeout(t);
  }, []);

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
    setOpened(true);
    // scroll once the workspace has rendered (it may not exist yet while filtering)
    requestAnimationFrame(() => workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

    const workspace = companyById(id);
    if (workspace) {
      setRecentHistory(prev => {
        // Remove if already exists to move to top
        const filtered = prev.filter(h => h.id !== id);
        const newEntry: RecentCompanyLog = {
          id: workspace.id,
          name: workspace.name,
          targetRole: companyWorkspaces[id]?.targetRole ?? workspace.segment,
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
    const q = searchQuery.trim().toLowerCase();
    return COMPANIES.filter(c => {
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.topTopics.some(t => t.toLowerCase().includes(q));
      const matchSegment = activeSegment === "All Companies" || c.segment === activeSegment;
      return matchSearch && matchSegment;
    });
  }, [searchQuery, activeSegment]);

  const activeCompany = companyById(selectedCompanyId);
  const unfiltered = searchQuery === "" && activeSegment === "All Companies";


  return (
    <div className="flex flex-col gap-10 md:gap-14 pb-24 relative max-w-[1440px] mx-auto w-full min-w-0">
      <CompaniesHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeSegment={activeSegment}
        setActiveSegment={setActiveSegment}
      />

      {searchQuery === "" && <HiringBasics />}

      {searchQuery === "" && <AskedInSection />}

      <div className="flex flex-col gap-10 md:gap-14">
        {unfiltered && (
          <TargetCompaniesSection targets={targets} personal={mine.length > 0} selectedId={selectedCompanyId} onSelect={handleSelectCompany} />
        )}

        {activeCompany && (unfiltered || opened) && (
          <div ref={workspaceRef} className="scroll-mt-24">
            <CompanyWorkspace company={activeCompany} curated={companyWorkspaces[activeCompany.id]} />
          </div>
        )}

        <CompanyDirectory
          companies={filteredDirectory}
          searchQuery={searchQuery}
          onSelect={handleSelectCompany}
        />

        {searchQuery === "" && (
          <RecentlyExploredTable history={recentHistory} onClear={handleClearHistory} onSelect={handleSelectCompany} />
        )}

        {searchQuery === "" && (
          <section aria-labelledby="interview-resources">
            <p className="eyebrow">Resources</p>
            <h2 id="interview-resources" className="display mt-1 text-[30px]">Prepare for any interview, free</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {INTERVIEW_RESOURCES.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col rounded-2xl border-[1.5px] border-hair bg-card p-4 transition-colors hover:border-ink/40">
                    <span className="flex items-center justify-between gap-2 text-[15px] font-semibold group-hover:text-accent-ink">
                      {r.title}
                      <ExternalLink aria-hidden className="size-3.5 shrink-0 text-mute" />
                    </span>
                    <span className="mt-1 text-[13.5px] text-body">{r.why}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
