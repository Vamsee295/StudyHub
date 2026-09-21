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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 w-full">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
        <p className="text-[var(--ink-secondary)] text-[13px] font-mono">Loading subject details...</p>
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
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Learn
        </Link>

        <div className="flex flex-col gap-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] border border-[var(--border)] text-[var(--ink)] text-[11px] font-mono font-bold tracking-wider uppercase">
              <Terminal className="w-3.5 h-3.5 text-[var(--ink-secondary)]" />
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
          <div className="w-full bg-[var(--border-strong)]/30 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-[var(--accent)] h-full rounded-full transition-all duration-700 ease-out"
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
                    "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border transition-all shadow-sm",
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
                      {moduleCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-[13px] font-mono font-bold">{index + 1}</span>}
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
                        <Clock className="w-3.5 h-3.5" />
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
                        "flex items-center justify-between p-3 rounded-lg border transition-colors",
                        topic.status === 'completed'
                          ? "bg-[var(--surface-subdued)] border-[var(--border)]"
                          : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent)]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {topic.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                        ) : topic.status === 'in_progress' ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
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
                          <Clock className="w-3.5 h-3.5" />
                          {topic.estimated_minutes}m
                        </span>
                        <ChevronRight className="w-4 h-4 text-[var(--ink-tertiary)]" />
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
