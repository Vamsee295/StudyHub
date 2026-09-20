"use client";

import { useMemo, useState } from "react";
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
  ChevronLeft,
  FileText
} from "lucide-react";
import { clsx } from "clsx";
import { learnSubjects } from "@/lib/data/learnData";

export default function ModulePage() {
  const params = useParams();
  const reduced = useReducedMotion();
  const subjectSlug = params.subject as string;
  const moduleId = params.module as string;

  const subject = useMemo(() => {
    return learnSubjects.find(s => s.slug === subjectSlug);
  }, [subjectSlug]);

  if (!subject) notFound();

  const moduleIndex = useMemo(() => {
    return subject.modules.findIndex(m => m.id === moduleId);
  }, [subject, moduleId]);

  const module = subject.modules[moduleIndex];

  if (!module) notFound();

  const prevModule = moduleIndex > 0 ? subject.modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < subject.modules.length - 1 ? subject.modules[moduleIndex + 1] : null;

  const [isCompleted, setIsCompleted] = useState(module.completed);

  const getModuleIcon = (type: string) => {
    switch(type) {
      case "video": return <PlayCircle className="w-4 h-4" />;
      case "reading": return <FileText className="w-4 h-4" />;
      case "exercise": return <Code2 className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-8 mt-[-2rem]">
      {/* TOP NAVIGATION BAR FOR MODULE */}
      <header className="sticky top-0 z-10 w-full bg-[var(--surface)] border-b border-[var(--border)] px-6 h-14 flex items-center justify-between shadow-sm">
        <Link 
          href={`/learn/${subject.slug}`} 
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to {subject.title}</span>
          <span className="sm:hidden">Back</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider font-semibold hidden md:inline-block">
            Module {moduleIndex + 1} of {subject.totalModules}
          </span>
          <div className="h-4 w-px bg-[var(--border)] hidden md:block mx-2"></div>
          <button 
            onClick={() => setIsCompleted(!isCompleted)}
            className={clsx(
              "text-[12px] font-semibold px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 border shadow-sm",
              isCompleted 
                ? "bg-[var(--success-soft)] text-[var(--success)] border-[var(--success-soft-border)] hover:bg-[var(--surface)] hover:text-[var(--ink-secondary)] hover:border-[var(--border)]"
                : "bg-[var(--surface)] text-[var(--ink)] border-[var(--border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isCompleted ? "Completed" : "Mark as Complete"}
          </button>
        </div>
      </header>

      {/* MODULE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT/MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f8fafc]">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col gap-3 pb-6 border-b border-[var(--border)]/60">
              <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--ink-secondary)]">
                <span className="flex items-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded shadow-sm">
                  {getModuleIcon(module.type)}
                  <span className="capitalize font-bold">{module.type}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {module.duration}
                </span>
              </div>
              <h1 className="font-newsreader text-2xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
                {module.title}
              </h1>
              <p className="text-[15px] text-[var(--ink-secondary)] leading-relaxed">
                {module.description}
              </p>
            </div>
            
            {/* MOCK WORKSPACE CONTENT BASED ON TYPE */}
            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm min-h-[500px] flex items-center justify-center p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
              
              {module.type === "video" && (
                <div className="flex flex-col items-center gap-4 relative z-10">
                  <div className="w-20 h-20 rounded-full bg-[var(--accent-soft)] flex items-center justify-center border border-[var(--accent-soft-border)] text-[var(--accent)] mb-2 shadow-sm">
                    <PlayCircle className="w-10 h-10 ml-1" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">Video Player Placeholder</h3>
                  <p className="text-[13px] text-[var(--ink-secondary)] max-w-sm">
                    This is where the actual video content for "{module.title}" would play.
                  </p>
                </div>
              )}
              
              {module.type === "reading" && (
                <div className="flex flex-col items-center gap-4 relative z-10">
                  <div className="w-20 h-20 rounded-full bg-[var(--surface-subdued)] flex items-center justify-center border border-[var(--border)] text-[var(--ink-secondary)] mb-2 shadow-sm">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">Reading Content Placeholder</h3>
                  <p className="text-[13px] text-[var(--ink-secondary)] max-w-sm">
                    This is where the markdown or rich text content for "{module.title}" would be displayed.
                  </p>
                </div>
              )}
              
              {module.type === "exercise" && (
                <div className="flex flex-col items-center gap-4 relative z-10">
                  <div className="w-20 h-20 rounded-full bg-[var(--surface-subdued)] flex items-center justify-center border border-[var(--border)] text-[var(--ink-secondary)] mb-2 shadow-sm">
                    <Code2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">Coding Environment Placeholder</h3>
                  <p className="text-[13px] text-[var(--ink-secondary)] max-w-sm">
                    This is where an embedded IDE or coding challenge for "{module.title}" would be rendered.
                  </p>
                </div>
              )}
            </div>

            {/* BOTTOM NAVIGATION */}
            <div className="flex items-center justify-between mt-8">
              {prevModule ? (
                <Link 
                  href={`/learn/${subject.slug}/${prevModule.id}`}
                  className="flex items-center gap-2 text-[13px] font-semibold text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors px-4 py-2 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-subdued)] rounded-lg shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Link>
              ) : <div></div>}
              
              {nextModule ? (
                <Link 
                  href={`/learn/${subject.slug}/${nextModule.id}`}
                  className="flex items-center gap-2 text-[13px] font-semibold text-white transition-colors px-4 py-2 border border-[var(--accent)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-lg shadow-sm"
                >
                  Next Module
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link 
                  href={`/learn/${subject.slug}`}
                  className="flex items-center gap-2 text-[13px] font-semibold text-[var(--accent)] transition-colors px-4 py-2 border border-[var(--accent-soft-border)] bg-[var(--accent-soft)] hover:bg-[var(--surface)] rounded-lg shadow-sm"
                >
                  Finish Subject
                  <CheckCircle2 className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </main>
        
        {/* RIGHT SIDEBAR - MODULES LIST (DESKTOP ONLY) */}
        <aside className="hidden lg:flex w-80 bg-[var(--surface)] border-l border-[var(--border)] flex-col overflow-y-auto">
          <div className="p-4 border-b border-[var(--border)]/60 bg-[var(--surface-subdued)]/40 sticky top-0">
            <h3 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider font-sans">
              Up Next
            </h3>
          </div>
          <div className="flex flex-col">
            {subject.modules.map((m, idx) => (
              <Link 
                key={m.id}
                href={`/learn/${subject.slug}/${m.id}`}
                className={clsx(
                  "p-4 border-b border-[var(--border)]/40 flex items-start gap-3 transition-colors",
                  m.id === module.id 
                    ? "bg-[var(--accent-soft)]/50 border-l-2 border-l-[var(--accent)]" 
                    : "hover:bg-[var(--surface-subdued)] border-l-2 border-l-transparent"
                )}
              >
                <div className={clsx(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  m.completed 
                    ? "text-[var(--success)]" 
                    : m.id === module.id ? "text-[var(--accent)]" : "text-[var(--ink-tertiary)]"
                )}>
                  {m.completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                </div>
                <div className="flex flex-col gap-1">
                  <span className={clsx(
                    "text-[13px] font-semibold leading-snug line-clamp-2",
                    m.id === module.id ? "text-[var(--accent)]" : "text-[var(--ink)]"
                  )}>
                    {idx + 1}. {m.title}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)]">
                    {m.duration}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
