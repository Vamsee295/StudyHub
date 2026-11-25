"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, BookOpen, Code2, ArrowRight, ArrowUpRight, ChevronDown, Layers, CheckCheck } from "lucide-react";
import { clsx } from "clsx";
import { roadmapModules, RoadmapModule } from "@/lib/data/roadmapModules";
import { getCourseBySlug } from "@/lib/data/courses";
import { getStoredProgress } from "@/lib/services/learnService";
import { PageHeader } from "@/components/ui/Page";
import { DsaRoadmapView } from "@/components/roadmaps/DsaRoadmapView";
import { ProgrammingCurriculumView } from "@/components/roadmaps/ProgrammingCurriculumView";

/** Real progress for a roadmap module: lesson completion of the Learn course with the same slug (saved locally).
 *  Modules with no course behind them (projects, resume, interviews) aren't tracked yet, so they show as upcoming. */
function withProgress(m: RoadmapModule): RoadmapModule {
  const course = getCourseBySlug(m.slug);
  if (!course) return { ...m, status: "upcoming", statusText: "Not tracked yet", progressPct: 0, progressDetail: "no lessons to track" };
  const store = getStoredProgress();
  const lessons = course.modules.flatMap((x) => x.lessons);
  const done = lessons.filter((l) => store[l.id]?.status === "completed" || store[l.slug]?.status === "completed").length;
  const pct = lessons.length ? Math.round((100 * done) / lessons.length) : 0;
  const status = pct === 100 ? "completed" : done > 0 ? "in-progress" : "upcoming";
  return {
    ...m,
    status,
    progressPct: pct,
    progressDetail: `${done} of ${lessons.length} lessons`,
    statusText: status === "completed" ? "Completed" : status === "in-progress" ? `In progress · ${pct}%` : "Not started",
  };
}

function RoadmapContent() {
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();

  // Selected module from URL or default to programming-fundamentals
  const initialModuleSlug = searchParams.get("module") || "programming-fundamentals";
  
  const [selectedSlug, setSelectedSlug] = useState<string>(initialModuleSlug);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  // client-only render (AppLayout), so saved progress is readable on first render
  const [modules] = useState(() => roadmapModules.map(withProgress));
  const doneCount = modules.filter((m) => m.status === "completed").length;
  const overallPct = Math.round(modules.reduce((n, m) => n + m.progressPct, 0) / modules.length);

  // Follow ?module= when the URL changes from outside (back/forward, a link)
  const moduleParam = searchParams.get("module");
  const [seenParam, setSeenParam] = useState(moduleParam);
  if (moduleParam !== seenParam) {
    setSeenParam(moduleParam);
    if (moduleParam && modules.some((m) => m.slug === moduleParam)) setSelectedSlug(moduleParam);
  }

  const activeModule: RoadmapModule = useMemo(() => {
    return (
      modules.find((m) => m.slug === selectedSlug) || modules[0]
    );
  }, [selectedSlug, modules]);

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
    <div className="flex w-full flex-col gap-8">
      <PageHeader eyebrow="Software engineer track" title="Learning to" hl="placement" note="one stage at a time">
        <div className="text-right max-md:text-left">
          <p className="display text-[44px] leading-none tabular-nums">
            {doneCount}
            <span className="text-[24px] text-mute">/{modules.length}</span>
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mute">Stages done</p>
        </div>
      </PageHeader>

      {/* TWO-COLUMN ROADMAP ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Vertical Curriculum Timeline (35% ~ 4 of 12 cols) */}
        <motion.aside 
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-4 flex flex-col gap-3"
        >
          <div className="bg-card rounded-2xl p-5 border-[1.5px] border-hair">
            <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-hair/60">
              <h2 className="text-[13px] font-bold text-ink uppercase tracking-wider">
                Curriculum Path
              </h2>
              <span className="font-mono text-xs font-semibold text-accent-ink bg-accent-soft px-2 py-0.5 rounded">
                {overallPct}% complete
              </span>
            </div>

            {/* Vertical Interactive Timeline */}
            <div className="relative flex flex-col gap-1 py-1">
              {/* Spine track line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-hair -z-0" />

              {modules.map((module) => {
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
                        ? "bg-accent-soft border border-accent/50 ring-2 ring-accent-line"
                        : "hover:bg-paper-2/70 border border-transparent"
                    )}
                  >
                    {/* Status icon badge */}
                    {isCompleted ? (
                      <div className={clsx(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        isSelected 
                          ? "bg-accent text-paper ring-2 ring-accent-line"
                          : "bg-accent-soft border border-accent-line text-accent-ink group-hover:bg-accent-line/40"
                      )}>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : isInProgress ? (
                      <div className="relative w-7 h-7 rounded-full bg-accent text-paper flex items-center justify-center shrink-0 font-mono text-[11px] font-bold ring-2 ring-accent-line">
                        <span>{module.numStr}</span>
                        <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-25"></span>
                      </div>
                    ) : (
                      <div className={clsx(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-semibold transition-colors",
                        isSelected
                          ? "bg-accent text-paper ring-2 ring-accent-line"
                          : "bg-card border-2 border-line text-mute group-hover:border-body group-hover:text-ink"
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
                            ? "font-bold text-accent-ink" 
                            : isCompleted 
                              ? "font-semibold text-ink group-hover:text-accent-ink" 
                              : "font-medium text-body group-hover:text-ink"
                        )}>
                          {module.shortTitle}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-accent shrink-0"></span>
                        )}
                      </div>

                      <span className={clsx(
                        "text-[11px] font-medium",
                        isCompleted 
                          ? "text-note" 
                          : isInProgress 
                            ? "text-accent-ink font-semibold" 
                            : "text-mute"
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
          <div className="bg-card rounded-2xl p-6 sm:p-10 border-[1.5px] border-hair shadow-card flex flex-col gap-8">
            
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-accent-soft border border-accent-line text-accent-ink text-[11px] font-mono font-bold tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      {activeModule.badge}
                    </span>
                  </div>

                  <h2 className="display mt-1 text-[36px] sm:text-[48px]">
                    {activeModule.title}
                  </h2>
                  
                  <p className="text-body text-[16px] sm:text-[17px] font-normal leading-relaxed max-w-3xl">
                    {activeModule.description}
                  </p>
                </div>

                {/* OVERALL PROGRESS SECTION */}
                <div className="bg-paper-2/70 p-6 sm:p-7 rounded-xl border-[1.5px] border-hair flex flex-col gap-3.5">
                  <div className="flex flex-wrap justify-between items-center text-sm gap-2">
                    <span className="text-[12px] font-bold text-ink uppercase tracking-wider font-mono">
                      Overall Stage Progress
                    </span>
                    <span className="text-[13.5px] font-semibold text-accent-ink font-mono">
                      {activeModule.progressPct}% Complete{" "}
                      <span className="text-mute font-normal">
                        ({activeModule.progressDetail})
                      </span>
                    </span>
                  </div>

                  {/* Royal Blue Progress Bar */}
                  <div className="w-full bg-ink/30 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-accent h-full rounded-full transition-all duration-700 ease-out"
                      initial={reduced ? { width: `${activeModule.progressPct}%` } : { width: 0 }}
                      animate={{ width: `${activeModule.progressPct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>

                </div>

                {/* DYNAMIC CONTENT BLOCK */}
                {selectedSlug === "programming-fundamentals" ? (
                  <ProgrammingCurriculumView />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    
                    {/* CARD 1: WHAT TO LEARN */}
                  <div className="bg-card p-6 rounded-xl border-[1.5px] border-hair hover:border-line transition-all flex flex-col justify-between hover:shadow-[4px_5px_0_var(--hard)]">
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-hair/60">
                        <Layers className="w-4 h-4 text-accent-ink" />
                        <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
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
                                ? "bg-accent-soft text-accent-ink ring-1 ring-accent-line"
                                : "bg-paper-2 text-ink"
                            )}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3.5 mt-4 border-t border-hair/60 flex items-center justify-between text-[11px] font-mono text-mute">
                      <span className="flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-accent-ink" />
                        {activeModule.modulesSummary}
                      </span>
                    </div>
                  </div>

                  {/* CARD 2: CURATED RESOURCES */}
                  <div className="bg-card p-6 rounded-xl border-[1.5px] border-hair hover:border-line transition-all flex flex-col justify-between hover:shadow-[4px_5px_0_var(--hard)]">
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-hair/60">
                        <BookOpen className="w-4 h-4 text-accent-ink" />
                        <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                          Curated Resources
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2 pt-1">
                        {activeModule.resources.map((res) => (
                          <Link
                            key={res.title}
                            href={res.href}
                            className="group/item flex items-center justify-between p-2 rounded-lg hover:bg-paper-2/70 transition-colors border border-transparent hover:border-hair"
                          >
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="text-[12.5px] font-semibold text-ink group-hover/item:text-accent-ink truncate">
                                {res.title}
                              </span>
                              <span className="text-[11px] text-mute font-mono">
                                {res.readTime} · {res.tag}
                              </span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-mute group-hover/item:text-accent-ink shrink-0 transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link 
                      href="/resources"
                      className="text-xs font-semibold text-accent-ink hover:text-accent-ink flex items-center gap-1 pt-3.5 mt-4 border-t border-hair/60"
                    >
                      View all reading material →
                    </Link>
                  </div>

                  {/* CARD 3: PRACTICE & LABS */}
                  <div className="bg-card p-6 rounded-xl border-[1.5px] border-hair hover:border-line transition-all flex flex-col justify-between hover:shadow-[4px_5px_0_var(--hard)]">
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-hair/60">
                        <Code2 className="w-4 h-4 text-accent-ink" />
                        <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                          Practice &amp; Labs
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-body">Total Solved:</span>
                          <span className="font-mono font-bold text-ink">
                            {activeModule.practice.totalSolved} / {activeModule.practice.totalQuestions}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium bg-success-soft text-note border border-success-line">
                            {activeModule.practice.easy} Easy
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium bg-warning-soft text-warning border border-warning-line">
                            {activeModule.practice.medium} Med
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium bg-danger-soft text-danger border border-danger-line">
                            {activeModule.practice.hard} Hard
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={activeModule.learnUrl}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-ink active:scale-[0.99] text-paper px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                )}

                {/* FEATURED SAMPLE INTERVIEW QUESTION CALLOUT CARD */}
                <div className="mt-2 rounded-xl border border-accent-line bg-accent-soft/40 p-6 sm:p-7 flex flex-col gap-4 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-ink bg-accent-soft border border-accent-line px-2.5 py-0.5 rounded">
                      {activeModule.interviewQuestion.companyBadge}
                    </span>
                    <span className="text-[11px] font-mono text-mute">
                      {activeModule.interviewQuestion.frequency}
                    </span>
                  </div>

                  <p className="text-ink font-medium text-[15px] sm:text-[16px] leading-relaxed">
                    &ldquo;{activeModule.interviewQuestion.question}&rdquo;
                  </p>

                  <div className="pt-1">
                    <button
                      onClick={() => setShowAnswer((prev) => !prev)}
                      type="button"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-ink hover:text-accent-ink transition-colors cursor-pointer"
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
                        <div className="mt-2 p-4 bg-card rounded-lg border border-accent-line text-xs text-body leading-relaxed">
                          <strong className="text-ink block mb-1 text-[13px]">
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
          <div className="h-10 w-80 bg-hair/70 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 bg-card h-[600px] rounded-2xl border-[1.5px] border-hair"></div>
            <div className="lg:col-span-8 bg-card h-[600px] rounded-2xl border-[1.5px] border-hair"></div>
          </div>
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  );
}
