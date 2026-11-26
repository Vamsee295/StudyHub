"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, CheckCircle2, Circle, CircleDot, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

import { CATEGORY_ORDER, categoryOf, problemOrder, problems as registryProblems, type ProblemCategory } from "@/lib/problems/problemRegistry";
import { problemStorage, ProblemStatus } from "@/lib/problems/problemStorage";
import { ASKED_IN_CAVEAT, COMPANY_PROFILES } from "@/lib/data/askedIn";
import { PageHeader } from "@/components/ui/Page";
import { Badge } from "@/components/ui/Badge";

export default function ProblemBankPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "solved" | "attempted" | "unsolved">("all");
  const [activeDifficulty, setActiveDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  // client-only render (AppLayout), so local statuses are readable on first render
  const [statuses, setStatuses] = useState<Record<string, ProblemStatus>>(() => problemStorage.getAllStatuses());
  const [activeCompany, setActiveCompany] = useState<string>("all");
  const [activeTopic, setActiveTopic] = useState<ProblemCategory | "all">("all");

  useEffect(() => {
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
    return (
      // topic sections in learning order, easy before medium before hard (shared with the problem page's next/previous)
      problemOrder()
        .map((id) => registryProblems[id])
        .map((p) => {
          const status = statuses[p.id] || "unsolved";
          return {
            id: p.id,
            number: Number(p.id) || 0,
            ladder: p.ladder,
            title: p.title,
            difficulty: p.difficulty,
            status,
            topics: p.topics,
            category: categoryOf(p),
            companies: p.companies || [],
          };
        })
    );
  }, [statuses]);

  // Derived counts
  const totalCount = allProblems.length;
  const solvedCount = allProblems.filter((p) => p.status === "solved").length;
  const attemptedCount = allProblems.filter((p) => p.status === "attempted").length;
  const unsolvedCount = totalCount - solvedCount - attemptedCount;

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

      // Company filter
      if (activeCompany !== "all" && !prob.companies.includes(activeCompany)) return false;

      if (activeTopic !== "all" && prob.category !== activeTopic) return false;

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
  }, [allProblems, activeTab, activeDifficulty, searchQuery, activeCompany, activeTopic]);

  const sections = CATEGORY_ORDER.map((cat) => ({
    cat,
    rows: filteredProblems.filter((p) => p.category === cat),
    all: allProblems.filter((p) => p.category === cat),
  })).filter((s) => s.rows.length > 0);

  const chip = (on: boolean) =>
    clsx(
      "label-cond inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 text-[14px] transition-colors",
      on ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line hover:text-ink",
    );
  const tabs = [
    ["all", "All", totalCount],
    ["unsolved", "To do", unsolvedCount],
    ["attempted", "Attempted", attemptedCount],
    ["solved", "Solved", solvedCount],
  ] as const;
  const levels = [
    ["all", "Any level", totalCount],
    ["easy", "Easy", easyCount],
    ["medium", "Medium", mediumCount],
    ["hard", "Hard", hardCount],
  ] as const;
  const companyChips = COMPANY_PROFILES.map((c) => ({ name: c.name, count: allProblems.filter((p) => p.companies.includes(c.name)).length })).filter((c) => c.count > 0);

  return (
    <>
      <PageHeader eyebrow="Practice · problems" title="The problem" hl="set">
        <div className="text-right max-md:text-left">
          <p className="display text-[44px] leading-none tabular-nums">
            {solvedCount}
            <span className="text-[24px] text-mute">/{totalCount}</span>
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mute">Solved</p>
          <Link href="/practice/submissions" className="mt-2 inline-block text-[13px] font-semibold text-accent-ink hover:underline">
            My submissions →
          </Link>
        </div>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative max-w-xl flex-1">
            <span className="sr-only">Search problems</span>
            <Search aria-hidden className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mute" />
            <input type="text" placeholder="Search by title, number, topic or company" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="field w-full pl-10" />
          </label>
          <div role="tablist" aria-label="Status" className="no-scrollbar flex gap-2 overflow-x-auto">
            {tabs.map(([id, label, n]) => (
              <button key={id} role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)} className={chip(activeTab === id)}>
                {label} <span className="font-mono text-[11px] font-normal opacity-70">{n}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Filter by topic">
          <button aria-pressed={activeTopic === "all"} onClick={() => setActiveTopic("all")} className={chip(activeTopic === "all")}>
            All topics <span className="font-mono text-[11px] font-normal opacity-70">{totalCount}</span>
          </button>
          {CATEGORY_ORDER.map((cat) => {
            const n = allProblems.filter((p) => p.category === cat).length;
            return n ? (
              <button key={cat} aria-pressed={activeTopic === cat} onClick={() => setActiveTopic(cat)} className={chip(activeTopic === cat)}>
                {cat} <span className="font-mono text-[11px] font-normal opacity-70">{n}</span>
              </button>
            ) : null;
          })}
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Difficulty">
          {levels.map(([id, label, n]) => (
            <button key={id} aria-pressed={activeDifficulty === id} onClick={() => setActiveDifficulty(id)} className={chip(activeDifficulty === id)}>
              {id !== "all" && <span aria-hidden className={clsx("size-2 rounded-full", id === "easy" ? "bg-note" : id === "medium" ? "bg-gold" : "bg-accent")} />}
              {label} <span className="font-mono text-[11px] font-normal opacity-70">{n}</span>
            </button>
          ))}
        </div>

        {companyChips.length > 0 && (
          <div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Filter by company">
              <button aria-pressed={activeCompany === "all"} onClick={() => setActiveCompany("all")} className={chip(activeCompany === "all")}>
                Any company
              </button>
              {companyChips.map((c) => (
                <button key={c.name} aria-pressed={activeCompany === c.name} onClick={() => setActiveCompany(c.name)} className={chip(activeCompany === c.name)}>
                  {c.name} <span className="font-mono text-[11px] font-normal opacity-70">{c.count}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-mute">
              Company tags mean the company is reported to test the topic, not this exact question. {ASKED_IN_CAVEAT}{" "}
              <Link href="/companies#asked-in" className="underline hover:text-ink">
                Sources
              </Link>
            </p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-y-[2.4px] border-line font-mono text-[11px] uppercase tracking-wider text-mute">
              <th className="w-12 py-2.5 pl-1 font-medium">
                <span className="sr-only">Status</span>
              </th>
              <th className="py-2.5 font-medium">Problem</th>
              <th className="w-24 py-2.5 font-medium">Level</th>
              <th className="hidden py-2.5 font-medium md:table-cell">Topics</th>
              <th className="hidden py-2.5 font-medium lg:table-cell">Reported at</th>
              <th className="w-8 py-2.5">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          {sections.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <p className="font-semibold">No problems match</p>
                  <p className="mt-1 text-[14px] text-mute">Clear the search or pick another filter.</p>
                </td>
              </tr>
            </tbody>
          ) : (
            sections.map(({ cat, rows, all }) => {
              const solved = all.filter((p) => p.status === "solved").length;
              return (
                <tbody key={cat}>
                  <tr>
                    <th colSpan={6} scope="rowgroup" className="pb-2 pt-8 text-left font-normal">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="label-cond text-[22px] text-ink">
                          <span className="mr-2 font-mono text-[12px] text-mute">{String(CATEGORY_ORDER.indexOf(cat) + 1).padStart(2, "0")}</span>
                          {cat}
                        </span>
                        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-mute">
                          <span aria-hidden className="h-1.5 w-20 overflow-hidden rounded-full bg-hair">
                            <span className="block h-full rounded-full bg-note" style={{ width: `${(100 * solved) / all.length}%` }} />
                          </span>
                          {solved}/{all.length} solved
                        </span>
                      </span>
                    </th>
                  </tr>
                  {rows.map((prob, i) => (
                    <tr key={prob.id} className="group border-b-[1.5px] border-hair hover:bg-card-2">
                      <td className="py-3 pl-1">
                        <button
                          type="button"
                          onClick={(e) => handleToggleStatus(prob.id, e)}
                          title={prob.status === "solved" ? "Mark as not solved" : "Mark as solved"}
                          aria-label={`${prob.title}: ${prob.status}. ${prob.status === "solved" ? "Mark as not solved" : "Mark as solved"}`}
                          className="tap grid size-8 place-items-center rounded-full"
                        >
                          {prob.status === "solved" ? (
                            <CheckCircle2 className="size-5 text-note" />
                          ) : prob.status === "attempted" ? (
                            <CircleDot className="size-5 text-gold" />
                          ) : (
                            <Circle className="size-5 text-ink/25 group-hover:text-ink/50" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 pr-4">
                        <Link href={`/practice/problems/${prob.id}`} className="flex items-baseline gap-2.5">
                          <span className="w-8 shrink-0 font-mono text-[12px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                          <span className="text-[15px] font-semibold group-hover:text-accent-ink">{prob.title}</span>
                        </Link>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={prob.difficulty === "Easy" ? "success" : prob.difficulty === "Medium" ? "warning" : "danger"}>{prob.difficulty}</Badge>
                      </td>
                      <td className="hidden py-3 pr-4 md:table-cell">
                        <span className="text-[13px] text-body">{prob.topics.join(" · ")}</span>
                      </td>
                      <td className="hidden py-3 pr-4 lg:table-cell">
                        <span title={ASKED_IN_CAVEAT} className="text-[13px] text-mute">
                          {prob.companies.join(", ") || "–"}
                        </span>
                      </td>
                      <td className="py-3 pr-1 text-right">
                        <Link href={`/practice/problems/${prob.id}`} aria-label={`Open ${prob.title}`} className="inline-grid size-8 place-items-center">
                          <ArrowRight className="size-4 text-mute transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              );
            })
          )}
        </table>
      </div>
    </>
  );
}
