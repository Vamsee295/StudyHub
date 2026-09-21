"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Check, 
  CheckCircle2, 
  Terminal, 
  BookOpen, 
  Code2, 
  ArrowRight, 
  ArrowUpRight, 
  ChevronDown, 
  Sparkles,
  Layers,
  Flame,
  CheckCheck
} from "lucide-react";
import { clsx } from "clsx";
import { roadmapModules, RoadmapModule } from "@/lib/data/roadmapModules";
import { DsaRoadmapView } from "@/components/roadmaps/DsaRoadmapView";
import { ProgrammingCurriculumView } from "@/components/roadmaps/ProgrammingCurriculumView";

function RoadmapContent() {
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();

  // Selected module from URL or default to programming-fundamentals
  const initialModuleSlug = searchParams.get("module") || "programming-fundamentals";
  
  const [selectedSlug, setSelectedSlug] = useState<string>(initialModuleSlug);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Sync state if URL changes externally
  useEffect(() => {
    const param = searchParams.get("module");
    if (param && roadmapModules.some((m) => m.slug === param)) {
      setSelectedSlug(param);
    }
  }, [searchParams]);

  const activeModule: RoadmapModule = useMemo(() => {
    return (
      roadmapModules.find((m) => m.slug === selectedSlug) || roadmapModules[0]
    );
  }, [selectedSlug]);

  const handleSelectModule = (slug: string) => {
    setSelectedSlug(slug);
    setShowAnswer(false);
    // Update URL query parameter cleanly without page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("module", slug);
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-16 w-full">
      {/* PAGE HEADER */}
      <motion.section 
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border)]/80"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
            Placement Roadmap Architecture
          </div>
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight leading-tight">
            From learning to placement.
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] mt-1.5 max-w-2xl font-normal leading-relaxed">
            Follow a structured path from fundamentals to technical and HR interviews.
          </p>
        </div>

        {/* Subtle Track Selector Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex items-center gap-2 bg-[var(--surface)] px-3.5 py-2 rounded-lg border border-[var(--border)] shadow-sm text-[var(--ink)] hover:border-[var(--border-strong)] transition-colors">
            <Terminal className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-medium text-[var(--ink)]">Software Engineer Track</span>
            <span className="text-[var(--border-strong)]">·</span>
            <span className="text-xs font-semibold text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded-md">
              4 of 12 Cleared
            </span>
          </div>
        </div>
      </motion.section>

      {/* TWO-COLUMN ROADMAP ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Vertical Curriculum Timeline (35% ~ 4 of 12 cols) */}
        <motion.aside 
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-4 flex flex-col gap-3"
        >
          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-[var(--border)]/60">
              <h2 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider">
                Curriculum Path
              </h2>
              <span className="font-mono text-xs font-semibold text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded">
                33% Complete
              </span>
            </div>

            {/* Vertical Interactive Timeline */}
            <div className="relative flex flex-col gap-1 py-1">
              {/* Spine track line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[var(--border)] -z-0" />

              {roadmapModules.map((module) => {
                const isSelected = module.slug === activeModule.slug;
                const isCompleted = module.status === "completed";
                const isInProgress = module.status === "in-progress";

                return (
                  <button
                    key={module.id}
                    onClick={() => handleSelectModule(module.slug)}
                    className={clsx(
                      "relative z-10 flex items-center gap-3.5 p-2.5 rounded-xl text-left cursor-pointer transition-all group w-full",
                      isSelected
                        ? "bg-[var(--accent-soft)] border border-[var(--accent)]/50 ring-2 ring-[var(--accent-soft-border)] shadow-sm"
                        : "hover:bg-[var(--surface-subdued)]/70 border border-transparent"
                    )}
                  >
                    {/* Status icon badge */}
                    {isCompleted ? (
                      <div className={clsx(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm",
                        isSelected 
                          ? "bg-[var(--accent)] text-white ring-2 ring-[var(--accent-soft-border)]"
                          : "bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] text-[var(--accent)] group-hover:bg-[var(--accent-soft-border)]/40"
                      )}>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : isInProgress ? (
                      <div className="relative w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shrink-0 shadow-sm font-mono text-[11px] font-bold ring-2 ring-[var(--accent-soft-border)]">
                        <span>{module.numStr}</span>
                        <span className="absolute inset-0 rounded-full bg-[var(--accent)] animate-ping opacity-25"></span>
                      </div>
                    ) : (
                      <div className={clsx(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-semibold transition-colors",
                        isSelected
                          ? "bg-[var(--accent)] text-white ring-2 ring-[var(--accent-soft-border)]"
                          : "bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--ink-tertiary)] group-hover:border-[var(--ink-secondary)] group-hover:text-[var(--ink)]"
                      )}>
                        {module.numStr}
                      </div>
                    )}

                    {/* Module Title & Status Label */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={clsx(
                          "text-[13.5px] truncate",
                          isSelected 
                            ? "font-bold text-[var(--accent-hover)]" 
                            : isCompleted 
                              ? "font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]" 
                              : "font-medium text-[var(--ink-secondary)] group-hover:text-[var(--ink)]"
                        )}>
                          {module.shortTitle}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0"></span>
                        )}
                      </div>

                      <span className={clsx(
                        "text-[11px] font-medium",
                        isCompleted 
                          ? "text-[var(--success)]" 
                          : isInProgress 
                            ? "text-[var(--accent)] font-semibold" 
                            : "text-[var(--ink-tertiary)]"
                      )}>
                        {module.statusText}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.aside>

        {/* RIGHT COLUMN: Selected Module Workspace (65% ~ 8 of 12 cols) */}
        <motion.section 
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="lg:col-span-8 flex flex-col gap-6"
        >
          {/* MAIN DOSSIER WHITE CARD */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 sm:p-10 border border-[var(--border)] shadow-card flex flex-col gap-8">
            
            <AnimatePresence mode="wait">
              {selectedSlug === "dsa" ? (
                <motion.div
                  key="dsa"
                  initial={reduced ? undefined : { opacity: 0, y: 8 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <DsaRoadmapView />
                </motion.div>
              ) : (
                <motion.div
                  key={activeModule.slug}
                  initial={reduced ? undefined : { opacity: 0, y: 8 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-8 w-full"
                >
                  {/* STAGE HEADER & METADATA */}
                <div className="flex flex-col gap-3 pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] text-[var(--accent)] text-[11px] font-mono font-bold tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                      {activeModule.badge}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[var(--ink-secondary)] text-xs font-mono">
                      <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                      Verified Placement Standard
                    </span>
                  </div>

                  <h2 className="font-newsreader text-[32px] sm:text-[40px] text-[var(--ink)] font-normal leading-[1.15] tracking-tight mt-1">
                    {activeModule.title}
                  </h2>
                  
                  <p className="text-[var(--ink-secondary)] text-[16px] sm:text-[17px] font-normal leading-relaxed max-w-3xl">
                    {activeModule.description}
                  </p>
                </div>

                {/* OVERALL PROGRESS SECTION */}
                <div className="bg-[var(--surface-subdued)]/70 p-6 sm:p-7 rounded-xl border border-[var(--border)] flex flex-col gap-3.5 shadow-sm">
                  <div className="flex flex-wrap justify-between items-center text-sm gap-2">
                    <span className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider font-mono">
                      Overall Stage Progress
                    </span>
                    <span className="text-[13.5px] font-semibold text-[var(--accent)] font-mono">
                      {activeModule.progressPct}% Complete{" "}
                      <span className="text-[var(--ink-tertiary)] font-normal">
                        ({activeModule.progressDetail})
                      </span>
                    </span>
                  </div>

                  {/* Royal Blue Progress Bar */}
                  <div className="w-full bg-[var(--border-strong)]/30 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-[var(--accent)] h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                      initial={reduced ? { width: `${activeModule.progressPct}%` } : { width: 0 }}
                      animate={{ width: `${activeModule.progressPct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-[var(--ink-secondary)] pt-0.5">
                    <span>Target Velocity: {activeModule.targetVelocity}</span>
                    <span className="font-medium text-[var(--ink)]">
                      Estimated Clearance: {activeModule.clearanceEstimate}
                    </span>
                  </div>
                </div>

                {/* DYNAMIC CONTENT BLOCK */}
                {selectedSlug === "programming-fundamentals" ? (
                  <ProgrammingCurriculumView />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    
                    {/* CARD 1: WHAT TO LEARN */}
                  <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-[var(--border)]/60">
                        <Layers className="w-4 h-4 text-[var(--accent)]" />
                        <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                          What to Learn
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {activeModule.topics.map((topic, i) => (
                          <span 
                            key={topic}
                            className={clsx(
                              "text-xs px-2.5 py-1 rounded-md font-medium transition-colors",
                              i >= 4 
                                ? "bg-[var(--accent-soft)] text-[var(--accent)] ring-1 ring-[var(--accent-soft-border)]"
                                : "bg-[var(--surface-subdued)] text-[var(--ink)]"
                            )}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3.5 mt-4 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] font-mono text-[var(--ink-tertiary)]">
                      <span className="flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                        {activeModule.modulesSummary}
                      </span>
                    </div>
                  </div>

                  {/* CARD 2: CURATED RESOURCES */}
                  <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-[var(--border)]/60">
                        <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                        <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                          Curated Resources
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2 pt-1">
                        {activeModule.resources.map((res) => (
                          <Link
                            key={res.title}
                            href={res.href}
                            className="group/item flex items-center justify-between p-2 rounded-lg hover:bg-[var(--surface-subdued)]/70 transition-colors border border-transparent hover:border-[var(--border)]"
                          >
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="text-[12.5px] font-semibold text-[var(--ink)] group-hover/item:text-[var(--accent)] truncate">
                                {res.title}
                              </span>
                              <span className="text-[11px] text-[var(--ink-tertiary)] font-mono">
                                {res.readTime} · {res.tag}
                              </span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-[var(--ink-tertiary)] group-hover/item:text-[var(--accent)] shrink-0 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link 
                      href="/resources"
                      className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 pt-3.5 mt-4 border-t border-[var(--border)]/60"
                    >
                      View all reading material →
                    </Link>
                  </div>

                  {/* CARD 3: PRACTICE & LABS */}
                  <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-[var(--border)]/60">
                        <Code2 className="w-4 h-4 text-[var(--accent)]" />
                        <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                          Practice &amp; Labs
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[var(--ink-secondary)]">Total Solved:</span>
                          <span className="font-mono font-bold text-[var(--ink)]">
                            {activeModule.practice.totalSolved} / {activeModule.practice.totalQuestions}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-soft-border)]">
                            {activeModule.practice.easy} Easy
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium bg-[var(--warning-soft)] text-[var(--warning)] border border-amber-200">
                            {activeModule.practice.medium} Med
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium bg-[var(--error-soft)] text-[var(--error)] border border-[var(--error-soft-border)]">
                            {activeModule.practice.hard} Hard
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={activeModule.learnUrl}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-[0.99] text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold shadow-sm transition-all"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                )}

                {/* FEATURED SAMPLE INTERVIEW QUESTION CALLOUT CARD */}
                <div className="mt-2 rounded-xl border border-[var(--accent-soft-border)] bg-[var(--accent-soft)]/40 p-6 sm:p-7 flex flex-col gap-4 relative overflow-hidden shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] px-2.5 py-0.5 rounded">
                      {activeModule.interviewQuestion.companyBadge}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--ink-tertiary)]">
                      {activeModule.interviewQuestion.frequency}
                    </span>
                  </div>

                  <p className="text-[var(--ink)] font-medium text-[15px] sm:text-[16px] leading-relaxed">
                    &ldquo;{activeModule.interviewQuestion.question}&rdquo;
                  </p>

                  <div className="pt-1">
                    <button
                      onClick={() => setShowAnswer((prev) => !prev)}
                      type="button"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer"
                    >
                      <span>{showAnswer ? "Hide Answer & Approach" : "View Optimal Answer & Approach"}</span>
                      <ChevronDown className={clsx(
                        "w-4 h-4 transition-transform duration-200",
                        showAnswer && "rotate-180"
                      )} />
                    </button>
                  </div>

                  {/* Expandable Optimal Answer */}
                  <AnimatePresence>
                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 p-4 bg-[var(--surface)] rounded-lg border border-[var(--accent-soft-border)] text-xs text-[var(--ink-secondary)] leading-relaxed shadow-sm">
                          <strong className="text-[var(--ink)] block mb-1 text-[13px]">
                            Key Interview Talking Points:
                          </strong>
                          <span>{activeModule.interviewQuestion.answer}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.section>

      </div>
    </div>
  );
}

export default function RoadmapsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-8 pb-16 w-full animate-pulse">
          <div className="h-10 w-80 bg-[var(--border)]/70 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 bg-[var(--surface)] h-[600px] rounded-2xl border border-[var(--border)]"></div>
            <div className="lg:col-span-8 bg-[var(--surface)] h-[600px] rounded-2xl border border-[var(--border)]"></div>
          </div>
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  );
}
