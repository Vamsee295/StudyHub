"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, CheckCircle2, Circle, CircleDot, ArrowRight, BookOpen, Code2 } from "lucide-react";
import { clsx } from "clsx";

import { problems as registryProblems } from "@/lib/problems/problemRegistry";
import { problemStorage, ProblemStatus } from "@/lib/problems/problemStorage";

export default function ProblemBankPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "solved" | "attempted" | "unsolved">("all");
  const [activeDifficulty, setActiveDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [statuses, setStatuses] = useState<Record<string, ProblemStatus>>({});

  useEffect(() => {
    // Load persisted problem statuses from storage
    setStatuses(problemStorage.getAllStatuses());

    const handleUpdate = () => {
      setStatuses(problemStorage.getAllStatuses());
    };

    window.addEventListener("studyhub:problem_status_updated", handleUpdate);
    return () => {
      window.removeEventListener("studyhub:problem_status_updated", handleUpdate);
    };
  }, []);

  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = problemStorage.toggleStatus(id);
    setStatuses((prev) => ({
      ...prev,
      [id]: nextStatus,
    }));
  };

  const allProblems = useMemo(() => {
    return Object.values(registryProblems)
      .map((p) => {
        const status = statuses[p.id] || "unsolved";
        return {
          id: p.id,
          number: Number(p.id) || 0,
          title: p.title,
          difficulty: p.difficulty,
          status,
          topics: p.topics,
          companies: p.companies || ["Amazon", "Google", "Microsoft"],
          acceptance: p.acceptance || "48.2%",
        };
      })
      .sort((a, b) => a.number - b.number);
  }, [statuses]);

  // Derived counts
  const totalCount = allProblems.length;
  const solvedCount = allProblems.filter((p) => p.status === "solved").length;
  const attemptedCount = allProblems.filter((p) => p.status === "attempted").length;
  const unsolvedCount = totalCount - solvedCount - attemptedCount;
  const solvedPercentage = totalCount > 0 ? ((solvedCount / totalCount) * 100).toFixed(1) : "0.0";

  const easyCount = allProblems.filter((p) => p.difficulty.toLowerCase() === "easy").length;
  const mediumCount = allProblems.filter((p) => p.difficulty.toLowerCase() === "medium").length;
  const hardCount = allProblems.filter((p) => p.difficulty.toLowerCase() === "hard").length;

  const filteredProblems = useMemo(() => {
    return allProblems.filter((prob) => {
      // Status Tab filter
      if (activeTab === "solved" && prob.status !== "solved") return false;
      if (activeTab === "attempted" && prob.status !== "attempted") return false;
      if (activeTab === "unsolved" && prob.status !== "unsolved") return false;

      // Difficulty filter
      if (activeDifficulty !== "all" && prob.difficulty.toLowerCase() !== activeDifficulty) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = prob.title.toLowerCase().includes(q);
        const matchesId = String(prob.number).includes(q);
        const matchesTopic = prob.topics.some((t) => t.toLowerCase().includes(q));
        const matchesCompany = prob.companies.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesId && !matchesTopic && !matchesCompany) {
          return false;
        }
      }

      return true;
    });
  }, [allProblems, activeTab, activeDifficulty, searchQuery]);

  return (
    <div className="flex flex-col gap-6 pb-24 w-full">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-[var(--accent)] uppercase">
              Practice // Coding Sprints & DSA
            </span>
            <span className="text-[var(--ink-tertiary)] font-mono text-xs">•</span>
            <span className="font-mono text-xs text-[var(--ink-secondary)]">
              REPOSITORY_INDEX_v4.2
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight font-display">
            Curated Problem Bank
          </h1>
          <p className="text-base text-[var(--ink-secondary)] leading-relaxed max-w-2xl">
            Explore 1,240+ interview questions calibrated against Tier-1 SDE hiring bars, corporate interview patterns, and campus placement drives.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto bg-[var(--surface)] border border-[var(--border)] px-4 py-3 rounded-xl shadow-xs">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider mb-1">
              Global Solved Ratio
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[var(--ink)]">{solvedCount}</span>
              <span className="font-mono text-sm text-[var(--ink-secondary)]">/ {totalCount}</span>
              <span className="text-[11px] font-semibold text-[var(--success)] bg-[var(--success-soft)] px-2 py-0.5 rounded-full ml-1">
                {solvedPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER CONSOLE */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs p-5 space-y-5">
        
        {/* Top Bar: Search + Status Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink-tertiary)]" />
            <input
              type="text"
              placeholder="Search 1,240+ problems by title, algorithm, or company (e.g. Two Sum)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-12 bg-[var(--surface-subdued)] border border-[var(--border)] rounded-xl text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--ink-tertiary)]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--ink-secondary)]">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[var(--surface-subdued)] p-1 rounded-xl overflow-x-auto shrink-0 border border-[var(--border)]">
            <button 
              onClick={() => setActiveTab('all')}
              className={clsx("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap", activeTab === 'all' ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs" : "text-[var(--ink-secondary)] hover:text-[var(--ink)]")}
            >
              All ({totalCount})
            </button>
            <button 
              onClick={() => setActiveTab('solved')}
              className={clsx("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap", activeTab === 'solved' ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs" : "text-[var(--ink-secondary)] hover:text-[var(--ink)]")}
            >
              Solved ({solvedCount})
            </button>
            <button 
              onClick={() => setActiveTab('attempted')}
              className={clsx("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap", activeTab === 'attempted' ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs" : "text-[var(--ink-secondary)] hover:text-[var(--ink)]")}
            >
              Attempted ({attemptedCount})
            </button>
            <button 
              onClick={() => setActiveTab('unsolved')}
              className={clsx("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap", activeTab === 'unsolved' ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs" : "text-[var(--ink-secondary)] hover:text-[var(--ink)]")}
            >
              Unsolved ({unsolvedCount})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          
          {/* Difficulty */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider mr-2">Difficulty:</span>
            <button 
              onClick={() => setActiveDifficulty('all')}
              className={clsx("px-3 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-colors border", activeDifficulty === 'all' ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border-transparent hover:border-[var(--border-strong)]")}
            >
              All Difficulties <span className="opacity-70 font-mono text-[11px]">{totalCount}</span>
            </button>
            <button 
              onClick={() => setActiveDifficulty('easy')}
              className={clsx("px-3 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-colors border", activeDifficulty === 'easy' ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border-transparent hover:border-[var(--border-strong)]")}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Easy <span className="opacity-70 font-mono text-[11px]">{easyCount}</span>
            </button>
            <button 
              onClick={() => setActiveDifficulty('medium')}
              className={clsx("px-3 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-colors border", activeDifficulty === 'medium' ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border-transparent hover:border-[var(--border-strong)]")}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Medium <span className="opacity-70 font-mono text-[11px]">{mediumCount}</span>
            </button>
            <button 
              onClick={() => setActiveDifficulty('hard')}
              className={clsx("px-3 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-colors border", activeDifficulty === 'hard' ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border-transparent hover:border-[var(--border-strong)]")}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Hard <span className="opacity-70 font-mono text-[11px]">{hardCount}</span>
            </button>
          </div>

          {/* Topics & Companies summary row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider mr-2 shrink-0">Topics:</span>
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--ink)] text-white whitespace-nowrap">All Topics</button>
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-subdued)] text-[var(--ink-secondary)] hover:text-[var(--ink)] whitespace-nowrap transition-colors">Arrays <span className="font-mono opacity-70">142</span></button>
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-subdued)] text-[var(--ink-secondary)] hover:text-[var(--ink)] whitespace-nowrap transition-colors">Strings <span className="font-mono opacity-70">98</span></button>
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-subdued)] text-[var(--ink-secondary)] hover:text-[var(--ink)] whitespace-nowrap transition-colors">Hash Maps <span className="font-mono opacity-70">76</span></button>
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-subdued)] text-[var(--ink-secondary)] hover:text-[var(--ink)] whitespace-nowrap transition-colors">Linked Lists <span className="font-mono opacity-70">64</span></button>
            </div>
            
            <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto bg-[var(--surface-subdued)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
              <span className="text-xs font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">Curricula:</span>
              <span className="text-xs font-mono font-medium text-[var(--ink)] hover:text-[var(--accent)] cursor-pointer transition-colors">Blind 75</span>
              <span className="text-xs font-mono font-medium text-[var(--ink)] hover:text-[var(--accent)] cursor-pointer transition-colors">NeetCode 150</span>
            </div>
          </div>

        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs overflow-hidden">
        
        {/* Table Header / Meta */}
        <div className="px-5 py-4 bg-[var(--surface-subdued)] border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold text-[var(--ink)] uppercase tracking-wider">TABLE // MASTER_INDEX</span>
            <span className="text-sm text-[var(--ink-secondary)] hidden sm:inline">Displaying active telemetry for verified problem descriptors</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-[var(--ink-secondary)]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--success)]"></span> Solved</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--warning)]"></span> Attempted</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--border-strong)]"></span> Unsolved</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-3 px-5 text-xs font-semibold text-[var(--ink-secondary)] uppercase tracking-wider w-24 text-center">Status</th>
                <th className="py-3 px-5 text-xs font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Problem Name &amp; ID</th>
                <th className="py-3 px-5 text-xs font-semibold text-[var(--ink-secondary)] uppercase tracking-wider w-28">Difficulty</th>
                <th className="py-3 px-5 text-xs font-semibold text-[var(--ink-secondary)] uppercase tracking-wider hidden md:table-cell">Topics</th>
                <th className="py-3 px-5 text-xs font-semibold text-[var(--ink-secondary)] uppercase tracking-wider hidden lg:table-cell">Company Tags</th>
                <th className="py-3 px-5 text-xs font-semibold text-[var(--ink-secondary)] uppercase tracking-wider w-28 text-right hidden sm:table-cell">Acceptance</th>
                <th className="py-3 px-5 text-xs font-semibold text-[var(--ink-secondary)] uppercase tracking-wider w-32 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--ink-secondary)]">
                    <p className="text-sm font-semibold">No problems match the current filter</p>
                    <p className="text-xs text-[var(--ink-tertiary)] mt-1">Try resetting your search query or selecting a different status/difficulty tab.</p>
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => (
                  <tr key={prob.id} className="hover:bg-[var(--surface-subdued)]/50 transition-colors group">
                    <td className="py-4 px-5 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(prob.id, e)}
                        title={
                          prob.status === "solved"
                            ? "Mark as unread / unsolved"
                            : prob.status === "attempted"
                            ? "In progress — Click to mark as read / solved"
                            : "Click to mark as read / solved"
                        }
                        aria-label={
                          prob.status === "solved"
                            ? `Mark #${prob.number} ${prob.title} as unsolved`
                            : `Mark #${prob.number} ${prob.title} as read`
                        }
                        className={clsx(
                          "inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                          prob.status === "solved"
                            ? "bg-[var(--success-soft)] text-[var(--success)] hover:bg-emerald-100"
                            : prob.status === "attempted"
                            ? "bg-amber-50 text-[var(--warning)] hover:bg-amber-100"
                            : "text-[var(--border-strong)] hover:text-[var(--success)] hover:bg-[var(--success-soft)]"
                        )}
                      >
                        {prob.status === "solved" ? (
                          <CheckCircle2 className="w-5 h-5 transition-transform duration-150" />
                        ) : prob.status === "attempted" ? (
                          <CircleDot className="w-5 h-5 transition-transform duration-150" />
                        ) : (
                          <Circle className="w-5 h-5 transition-transform duration-150" />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-5">
                      <Link href={`/practice/problems/${prob.id}`} className="flex items-center gap-2 group/link">
                        <span className="font-mono text-sm text-[var(--ink-tertiary)]">#{prob.number}.</span>
                        <span className="font-semibold text-[var(--ink)] group-hover/link:text-[var(--accent)] transition-colors">{prob.title}</span>
                      </Link>
                    </td>
                    <td className="py-4 px-5">
                      {prob.difficulty === "Easy" && <span className="inline-block px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-emerald-50 text-emerald-700">Easy</span>}
                      {prob.difficulty === "Medium" && <span className="inline-block px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-amber-50 text-amber-700">Medium</span>}
                      {prob.difficulty === "Hard" && <span className="inline-block px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-rose-50 text-rose-700">Hard</span>}
                    </td>
                    <td className="py-4 px-5 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {prob.topics.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-[var(--surface-subdued)] border border-[var(--border)] font-mono text-[11px] text-[var(--ink-secondary)]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {prob.companies.map((c) => (
                          <span key={c} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-sm text-[var(--ink-secondary)] hidden sm:table-cell">
                      {prob.acceptance}
                    </td>
                    <td className="py-4 px-5 text-right">
                      {prob.status === "solved" ? (
                        <Link href={`/practice/problems/${prob.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface)] text-[var(--ink)] text-sm font-medium transition-colors shadow-sm">
                          Review
                        </Link>
                      ) : (
                        <Link href={`/practice/problems/${prob.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors shadow-sm">
                          Solve
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
