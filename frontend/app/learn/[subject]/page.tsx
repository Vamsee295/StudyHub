"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle2, 
  PlayCircle, 
  BookOpen, 
  Code2, 
  Clock,
  Terminal,
  ChevronRight,
  FileText,
  Loader2
} from "lucide-react";
import { clsx } from "clsx";
import { learnService, SubjectDetails } from "@/lib/services/learnService";
import { dueItems, getReviewItems } from "@/lib/learn/study";

export default function SubjectPage() {
  const params = useParams();
  const reduced = useReducedMotion();
  const subjectSlug = params.subject as string;

  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await learnService.getSubjectDetails(subjectSlug);
        setSubject(data);
      } catch (err: any) {
        console.error("Failed to load subject details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [subjectSlug]);

  const [dueCount, setDueCount] = useState(0);
  useEffect(() => setDueCount(dueItems(getReviewItems(subjectSlug)).length), [subjectSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 w-full">
        <Loader2 aria-hidden="true" className="w-8 h-8 text-[var(--accent)] animate-spin" />
        <p className="text-[var(--ink-secondary)] text-[13px] font-mono">Loading subject details…</p>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 w-full">
        <div className="p-4 bg-[var(--error-soft)] text-[var(--error)] rounded-xl border border-[var(--error)]/20 max-w-md text-center">
          <h3 className="font-bold mb-2">Subject not found</h3>
          <p className="text-[14px]">The subject you are looking for does not exist or an error occurred.</p>
          <Link href="/learn" className="inline-block mt-4 text-[13px] font-bold hover:underline">
            ← Back to Learn
          </Link>
        </div>
      </div>
    );
  }

  const getModuleIcon = (type: string) => {
    switch(type) {
      case "video": return <PlayCircle className="w-4 h-4" />;
      case "reading": return <FileText className="w-4 h-4" />;
      case "exercise": return <Code2 className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-16 w-full">
      {/* PAGE HEADER */}
      <motion.section 
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-5 border-b border-[var(--border)]/80 pb-8"
      >
        <Link 
          href="/learn" 
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors self-start rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" />
          Back to Learn
        </Link>

        <div className="flex flex-col gap-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] border border-[var(--border)] text-[var(--ink)] text-[11px] font-mono font-bold tracking-wider uppercase">
              <Terminal aria-hidden="true" className="w-3.5 h-3.5 text-[var(--ink-secondary)]" />
              {subject.category}
            </span>
          </div>
          
          <h1 className="font-newsreader text-3xl sm:text-4xl lg:text-[40px] text-[var(--ink)] font-normal tracking-tight leading-tight">
            {subject.name}
          </h1>
          
          <p className="text-[var(--ink-secondary)] text-[16px] font-normal leading-relaxed">
            {subject.description}
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex flex-col gap-2.5 mt-2 bg-[var(--surface-subdued)]/50 p-4 rounded-xl border border-[var(--border)]/80">
          <div className="flex justify-between items-center text-[12px] font-mono">
            <span className="text-[var(--ink-secondary)] font-medium">Your Progress</span>
            <span className="text-[var(--accent)] font-bold">{subject.progress_percentage}%</span>
          </div>
          <div className="w-full bg-[var(--border-strong)]/30 h-2 rounded-full overflow-hidden" role="progressbar" aria-label="Course progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={subject.progress_percentage}>
            <motion.div 
              className="bg-[var(--accent)] h-full rounded-full"
              initial={reduced ? { width: `${subject.progress_percentage}%` } : { width: 0 }}
              animate={{ width: `${subject.progress_percentage}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="text-[11px] text-[var(--ink-tertiary)] flex justify-between">
            <span>{subject.completed_topics} of {subject.total_topics} topics completed</span>
          </div>
        </div>
      </motion.section>

      {/* ROADMAP: generated from the course's own modules and the learner's progress */}
      {(() => {
        const allTopics = subject.modules.flatMap((m) => m.topics.map((t) => ({ ...t, moduleTitle: m.title })));
        const next = allTopics.find((t) => t.status === "in_progress") ?? allTopics.find((t) => t.status !== "completed");
        return (
          <section className="flex flex-col gap-4" aria-label="Course roadmap">
            <h2 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider font-sans">Your Roadmap</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { href: `/learn/${subject.slug}/test`, label: "Take Mock Test" },
                { href: `/learn/${subject.slug}/revise`, label: "Revision Sheet" },
                { href: `/learn/${subject.slug}/review`, label: dueCount > 0 ? `Review (${dueCount} due)` : "Review Queue" },
              ].map((a) => (
                <Link key={a.href} href={a.href}
                  className="px-3.5 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[13px] font-medium text-[var(--ink)] hover:border-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                  {a.label}
                </Link>
              ))}
            </div>
            {next ? (
              <Link
                href={`/learn/${subject.slug}/${next.slug}`}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--accent)]/40 bg-[var(--surface)] hover:border-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                    {next.status === "in_progress" ? "Continue where you left off" : "Next on your path"}
                  </span>
                  <span className="text-[15px] font-bold text-[var(--ink)] truncate">{next.title}</span>
                  <span className="text-[12px] text-[var(--ink-secondary)] truncate">{next.moduleTitle}</span>
                </div>
                <ChevronRight aria-hidden="true" className="w-5 h-5 text-[var(--accent)] shrink-0" />
              </Link>
            ) : (
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--success-soft)] text-[var(--success)] text-[14px] font-medium">
                You’ve completed every topic in this course.
              </div>
            )}
            <ol className="flex flex-col gap-2">
              {subject.modules.map((m, i) => {
                const done = m.topics.filter((t) => t.status === "completed").length;
                const total = m.topics.length;
                const pct = total ? Math.round((done / total) * 100) : 0;
                const current = next ? m.topics.some((t) => t.id === next.id) : false;
                return (
                  <li key={m.id} className="flex items-center gap-3">
                    <span
                      className={clsx(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0",
                        total > 0 && done === total
                          ? "bg-[var(--success-soft)] text-[var(--success)]"
                          : current
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--surface-subdued)] text-[var(--ink-secondary)]"
                      )}
                    >
                      {total > 0 && done === total ? <CheckCircle2 aria-hidden="true" className="w-4 h-4" /> : i + 1}
                    </span>
                    <span className={clsx("text-[13px] w-40 sm:w-56 truncate", current ? "font-bold text-[var(--ink)]" : "text-[var(--ink-secondary)]")}>
                      {m.title}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--border-strong)]/30 overflow-hidden" role="progressbar" aria-label={`${m.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                      <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] font-mono text-[var(--ink-tertiary)] w-12 text-right tabular-nums">{done}/{total}</span>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })()}

      {/* MODULES LIST */}
      <motion.section
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider font-sans">
          Course Modules
        </h2>
        
        <div className="flex flex-col gap-3">
          {subject.modules.map((module, index) => {
            const moduleCompleted = module.topics.length > 0 && module.topics.every(t => t.status === 'completed');
            
            return (
              <div key={module.id} className="flex flex-col gap-2">
                <div
                  className={clsx(
                    "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border shadow-sm",
                    moduleCompleted 
                      ? "bg-[var(--surface-subdued)]/40 border-[var(--border)]"
                      : "bg-[var(--surface)] border-[var(--border)]"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      moduleCompleted
                        ? "bg-[var(--success-soft)] text-[var(--success)]"
                        : "bg-[var(--surface-subdued)] text-[var(--ink-secondary)]"
                    )}>
                      {moduleCompleted ? <CheckCircle2 aria-hidden="true" className="w-5 h-5" /> : <span className="text-[13px] font-mono font-bold">{index + 1}</span>}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className={clsx(
                          "text-[15px] font-bold transition-colors",
                          moduleCompleted ? "text-[var(--ink)]" : "text-[var(--ink)]"
                        )}>
                          {module.title}
                        </h3>
                      </div>
                      <p className="text-[13px] text-[var(--ink-secondary)]">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pl-12 sm:pl-0 sm:shrink-0 mt-2 sm:mt-0">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--ink-tertiary)]">
                      <span className="flex items-center gap-1 border border-[var(--border)] px-2 py-0.5 rounded bg-[var(--surface)]">
                        <span className="capitalize">{module.difficulty || "Intermediate"}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock aria-hidden="true" className="w-3.5 h-3.5" />
                        {module.estimated_minutes || 60}m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Module Topics */}
                <div className="flex flex-col pl-14 sm:pl-16 gap-2 mt-1 mb-4">
                  {module.topics.map((topic, tIndex) => (
                    <Link 
                      key={topic.id}
                      href={`/learn/${subject.slug}/${topic.slug}`}
                      className={clsx(
                        "flex items-center justify-between p-3 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                        topic.status === 'completed'
                          ? "bg-[var(--surface-subdued)] border-[var(--border)]"
                          : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent)]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {topic.status === 'completed' ? (
                          <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-[var(--success)]" />
                        ) : topic.status === 'in_progress' ? (
                          <div aria-label="In progress" className="w-4 h-4 rounded-full border-2 border-[var(--accent)] border-t-transparent border-r-transparent" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-[var(--border-strong)]" />
                        )}
                        <div className="flex flex-col gap-1">
                          <span className={clsx(
                            "text-[14px]",
                            topic.status === 'completed' ? "text-[var(--ink-secondary)] line-through" : "text-[var(--ink)] font-medium"
                          )}>
                            <span className="font-mono text-[var(--ink-secondary)] mr-2">{String(tIndex + 1).padStart(2, '0')}</span> 
                            {topic.title}
                          </span>
                          <span className="text-[13px] text-[var(--ink-secondary)] pl-6">
                            {topic.description}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--ink-tertiary)]">
                        <span className="flex items-center gap-1">
                          <Clock aria-hidden="true" className="w-3.5 h-3.5" />
                          {topic.estimated_minutes}m
                        </span>
                        <ChevronRight aria-hidden="true" className="w-4 h-4 text-[var(--ink-tertiary)]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

    </div>
  );
}
