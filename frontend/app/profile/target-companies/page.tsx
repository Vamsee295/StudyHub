"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { 
  Building2, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Search,
  SlidersHorizontal,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { targetCompanies, directoryCompanies, companyWorkspaces } from "@/lib/data/companiesData";
import { ProfileNavTabs } from "@/components/profile/ProfileNavTabs";
import { CompanyTarget } from "@/types";
import { useProfile } from "@/components/providers/ProfileProvider";

export default function TargetCompaniesPage() {
  const { draftProfile, updateDraft, saveProfile } = useProfile();
  // Start from this browser's saved list, else from the targets in your profile (set during onboarding).
  // Client-only render (AppLayout), so localStorage is readable on first render.
  const [trackedList, setTrackedList] = useState<CompanyTarget[]>(() => {
    try {
      const saved = localStorage.getItem("pathward_tracked_companies_list");
      if (saved) return JSON.parse(saved);
    } catch {}
    return (draftProfile.targets?.companies ?? []).map(
      (name): CompanyTarget =>
        targetCompanies.find((t) => t.name.toLowerCase() === name.toLowerCase()) ?? {
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name,
          monogram: name.slice(0, 2).toUpperCase(),
          segment: "Product MNC",
          tier: "Tier-1",
          roles: ["Software Engineer"],
          readiness: 0,
          recruiterHighlight: { title: "Target", detail: "Added from your profile" },
        }
    );
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState("");

  const saveTrackedList = (updated: CompanyTarget[]) => {
    setTrackedList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("pathward_tracked_companies_list", JSON.stringify(updated));
      // Also sync company names to user profile
      updateDraft({
        targets: {
          ...draftProfile.targets,
          companies: updated.map(c => c.name)
        }
      });
      saveProfile().catch(console.error);
    }
  };

  const handleUntrack = (id: string) => {
    const updated = trackedList.filter(c => c.id !== id);
    saveTrackedList(updated);
  };

  const handleAddCompany = (companyId: string) => {
    if (!companyId) return;
    const exists = trackedList.some(c => c.id === companyId);
    if (exists) return;

    // Find in directory or fallback
    const found = directoryCompanies.find(d => d.id === companyId);
    const newTarget: CompanyTarget = found ? {
      id: found.id,
      name: found.name,
      monogram: found.monogram,
      segment: (found.segment as CompanyTarget["segment"]) || "Product MNC",
      tier: found.difficulty || "Tier-1",
      roles: found.roles,
      readiness: 65,
      recruiterHighlight: { title: "Assessment", detail: "Pattern synced for '26" }
    } : {
      id: companyId,
      name: companyId,
      monogram: companyId.slice(0, 2).toUpperCase(),
      segment: "Product MNC",
      tier: "Tier-1",
      roles: ["Software Engineer"],
      readiness: 60,
      recruiterHighlight: { title: "SDE Prep", detail: "Target Active" }
    };

    saveTrackedList([...trackedList, newTarget]);
    setAddModalOpen(false);
    setSelectedToAdd("");
  };

  const filtered = trackedList.filter(c => 
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.roles.some(r => r.toLowerCase().includes(searchFilter.toLowerCase()))
  );


  return (
    <div className="w-full min-w-0">
      {/* SECTION TABS */}
      <ProfileNavTabs />

      <PageHeader eyebrow="Profile" title="Target" hl="companies">
        <button onClick={() => setAddModalOpen(true)} className={buttonClass("primary", "sm")}>
          <Plus className="size-4" /> Add company
        </button>
        <Link href="/companies" className={buttonClass("secondary", "sm")}>
          <Building2 className="size-4" /> Directory
        </Link>
      </PageHeader>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-mute absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tracked companies or roles..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="field w-full pl-9 text-xs"
          />
        </div>
        <span className="text-xs font-mono text-body">
          Showing {filtered.length} of {trackedList.length} companies
        </span>
      </div>

      {/* COMPANIES LIST */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-hair rounded-2xl p-12 text-center">
          <Building2 className="w-12 h-12 text-ink/30 mx-auto mb-3" />
          <h3 className="text-base font-bold text-ink">No companies tracked yet</h3>
          <p className="text-xs text-body max-w-sm mx-auto mt-1 mb-4">
            Select organizations from the StudyHub directory to track hiring requirements and test pattern alignment.
          </p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="btn-primary text-xs h-9 px-4 inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add First Company
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((company) => (
            <div
              key={company.id}
              className="bg-card border border-hair hover:border-line rounded-2xl p-6 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-card-2 border border-hair text-ink font-bold text-lg flex items-center justify-center shrink-0">
                      {company.monogram}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-ink">{company.name}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card-2 text-body font-semibold">
                          {company.tier}
                        </span>
                      </div>
                      <span className="text-xs text-body font-medium">
                        {company.segment}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUntrack(company.id)}
                    title="Remove from tracked list"
                    className="p-1.5 rounded-lg text-mute hover:text-danger hover:bg-danger-soft transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Roles and Recruiter Highlight */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-mute block mb-1">
                      Targeted Positions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {company.roles.map(r => (
                        <span key={r} className="text-xs px-2.5 py-0.5 rounded-md bg-paper-2 text-ink font-medium border border-hair/60">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {company.recruiterHighlight && (
                    <div className="p-3 rounded-lg bg-paper-2 border border-hair/80 text-xs flex items-center justify-between">
                      <span className="text-body font-medium">{company.recruiterHighlight.title}</span>
                      <span className="font-mono text-mute font-semibold">{company.recruiterHighlight.detail}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-4 border-t-[1.5px] border-hair pt-4">
                <Link
                  href="/companies"
                  className="btn-secondary text-xs h-8 px-3 shrink-0 flex items-center gap-1.5"
                >
                  Workspace <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD COMPANY POPUP SELECTOR */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card rounded-2xl border border-hair shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-base font-bold text-ink mb-1">Add Company to Target Tracker</h3>
            <p className="text-xs text-mute mb-4">Pick a company to track.</p>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {directoryCompanies
                .filter(d => !trackedList.some(t => t.id === d.id))
                .map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => handleAddCompany(comp.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-hair hover:border-accent hover:bg-accent-soft/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-card-2 font-bold flex items-center justify-center text-xs text-body">
                        {comp.monogram}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-ink group-hover:text-accent-ink">{comp.name}</div>
                        <div className="text-[11px] text-mute">{comp.segment} • {comp.difficulty}</div>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-mute group-hover:text-accent-ink" />
                  </button>
                ))}
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-hair">
              <button
                onClick={() => setAddModalOpen(false)}
                className="btn-secondary text-xs h-8 px-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
