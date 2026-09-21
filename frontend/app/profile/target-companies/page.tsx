"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  const [trackedList, setTrackedList] = useState<CompanyTarget[]>(targetCompanies);
  const [searchFilter, setSearchFilter] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState("");

  useEffect(() => {
    // Sync with saved profile targets if available
    const saved = localStorage.getItem("pathward_tracked_companies_list");
    if (saved) {
      try {
        setTrackedList(JSON.parse(saved));
      } catch (e) {
        setTrackedList(targetCompanies);
      }
    }
  }, []);

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

  const avgReadiness = trackedList.length > 0 
    ? Math.round(trackedList.reduce((acc, curr) => acc + curr.readiness, 0) / trackedList.length)
    : 0;

  return (
    <div className="w-full min-w-0 pb-16">
      {/* SECTION TABS */}
      <ProfileNavTabs />

      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border)] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold tracking-wider border border-indigo-200">
              Company Tracking &amp; Readiness
            </span>
          </div>
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
            Target Companies
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] mt-1.5 font-normal">
            Manage your targeted campus and off-campus recruiters, hiring patterns, and mock rubrics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setAddModalOpen(true)}
            className="btn-primary text-xs h-9 px-4 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Company Target
          </button>
          <Link
            href="/companies"
            className="btn-secondary text-xs h-9 px-4 flex items-center gap-2"
          >
            <Building2 className="w-3.5 h-3.5" /> Company Directory
          </Link>
        </div>
      </div>

      {/* METRIC STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Tracked Recruiter Workspaces</span>
          <p className="text-2xl font-bold text-[var(--ink)] mt-1">{trackedList.length} Companies</p>
          <span className="text-xs text-[var(--accent)] font-medium mt-1 inline-block">Active for Cycle '26</span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Mean Target Readiness</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{avgReadiness}%</p>
          <span className="text-xs text-[var(--ink-secondary)] font-medium mt-1 inline-block">Based on verified OA cut-offs</span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Top Segment</span>
          <p className="text-base font-bold text-[var(--ink)] mt-1">Product MNC &amp; High-Volume IT</p>
          <span className="text-xs text-slate-500 font-mono mt-1 inline-block">DSA + Core CS + Aptitude</span>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tracked companies or roles..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="field w-full pl-9 text-xs"
          />
        </div>
        <span className="text-xs font-mono text-[var(--ink-secondary)]">
          Showing {filtered.length} of {trackedList.length} companies
        </span>
      </div>

      {/* COMPANIES LIST */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[var(--ink)]">No companies tracked yet</h3>
          <p className="text-xs text-[var(--ink-secondary)] max-w-sm mx-auto mt-1 mb-4">
            Select organizations from the Pathward directory to track hiring requirements and test pattern alignment.
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
              className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-2xl p-6 shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-bold font-newsreader text-lg flex items-center justify-center shrink-0">
                      {company.monogram}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[var(--ink)]">{company.name}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {company.tier}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--ink-secondary)] font-medium">
                        {company.segment}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUntrack(company.id)}
                    title="Remove from tracked list"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Roles and Recruiter Highlight */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)] block mb-1">
                      Targeted Positions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {company.roles.map(r => (
                        <span key={r} className="text-xs px-2.5 py-0.5 rounded-md bg-[var(--surface-subdued)] text-[var(--ink)] font-medium border border-[var(--border)]/60">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {company.recruiterHighlight && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                      <span className="text-slate-600 font-medium">{company.recruiterHighlight.title}</span>
                      <span className="font-mono text-slate-500 font-semibold">{company.recruiterHighlight.detail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom: Readiness and Action */}
              <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-[var(--ink-tertiary)] uppercase text-[11px]">Readiness</span>
                    <span className="font-mono font-bold text-emerald-600">{company.readiness}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${company.readiness}%` }}
                    />
                  </div>
                </div>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Company to Target Tracker</h3>
            <p className="text-xs text-slate-500 mb-4">Select an organization from the verified recruitment directory.</p>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {directoryCompanies
                .filter(d => !trackedList.some(t => t.id === d.id))
                .map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => handleAddCompany(comp.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 font-bold flex items-center justify-center text-xs text-slate-700">
                        {comp.monogram}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{comp.name}</div>
                        <div className="text-[11px] text-slate-500">{comp.segment} • {comp.difficulty}</div>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))}
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-200">
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
