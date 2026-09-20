"use client";

import { useMemo } from "react";
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
  FileText
} from "lucide-react";
import { clsx } from "clsx";
import { learnSubjects } from "@/lib/data/learnData";

export default function SubjectPage() {
  const params = useParams();
  const reduced = useReducedMotion();
  const subjectSlug = params.subject as string;

  const subject = useMemo(() => {
    return learnSubjects.find(s => s.slug === subjectSlug);
  }, [subjectSlug]);

  if (!subject) {
    notFound();
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
            {subject.title}
          </h1>
          
          <p className="text-[var(--ink-secondary)] text-[16px] font-normal leading-relaxed">
            {subject.description}
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex flex-col gap-2.5 mt-2 bg-[var(--surface-subdued)]/50 p-4 rounded-xl border border-[var(--border)]/80">
          <div className="flex justify-between items-center text-[12px] font-mono">
            <span className="text-[var(--ink-secondary)] font-medium">Your Progress</span>
            <span className="text-[var(--accent)] font-bold">{subject.progress}%</span>
          </div>
          <div className="w-full bg-[var(--border-strong)]/30 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-[var(--accent)] h-full rounded-full transition-all duration-700 ease-out"
              initial={reduced ? { width: `${subject.progress}%` } : { width: 0 }}
              animate={{ width: `${subject.progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="text-[11px] text-[var(--ink-tertiary)] flex justify-between">
            <span>{subject.completedModules} of {subject.totalModules} modules completed</span>
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
          {subject.modules.map((module, index) => (
            <Link 
              key={module.id} 
              href={`/learn/${subject.slug}/${module.id}`}
              className={clsx(
                "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border transition-all shadow-sm",
                module.completed 
                  ? "bg-[var(--surface-subdued)]/40 border-[var(--border)] hover:border-[var(--border-strong)]"
                  : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  module.completed
                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--surface-subdued)] text-[var(--ink-secondary)] group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)]"
                )}>
                  {module.completed ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-[13px] font-mono font-bold">{index + 1}</span>}
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className={clsx(
                      "text-[15px] font-bold transition-colors",
                      module.completed ? "text-[var(--ink)]" : "text-[var(--ink)] group-hover:text-[var(--accent)]"
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
                    {getModuleIcon(module.type)}
                    <span className="capitalize">{module.type}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {module.duration}
                  </span>
                </div>
                
                <ChevronRight className={clsx(
                  "w-4 h-4 hidden sm:block transition-colors",
                  module.completed ? "text-[var(--ink-tertiary)]" : "text-[var(--ink-secondary)] group-hover:text-[var(--accent)]"
                )} />
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

    </div>
  );
}
