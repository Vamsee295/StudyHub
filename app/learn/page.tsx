"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { 
  PlayCircle, 
  BookOpen, 
  Terminal, 
  ChevronRight,
  TrendingUp,
  Clock,
  Briefcase,
  Code
} from "lucide-react";
import { clsx } from "clsx";
import { learnSubjects, learnPaths, continueLearningSubjects } from "@/lib/data/learnData";

export default function LearnPage() {
  const reduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState("All subjects");
  
  const tabs = ["All subjects", "Technical", "Placement", "Core CS", "Aptitude"];
  
  const filteredSubjects = activeTab === "All subjects" 
    ? learnSubjects 
    : learnSubjects.filter(s => s.category === activeTab);

  const continueSubject = learnSubjects.find(s => s.slug === continueLearningSubjects[0]) || learnSubjects[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Core CS': return <Terminal className="w-5 h-5" />;
      case 'Technical': return <Code className="w-5 h-5" />;
      case 'Placement': return <Briefcase className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-16 w-full">
      {/* PAGE HEADER */}
      <motion.section 
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4"
      >
        <div>
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight leading-tight">
            Learn
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] mt-1.5 max-w-2xl font-normal leading-relaxed">
            Build the technical foundation you need for your placement journey.
          </p>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-[var(--border)]/80">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all border",
                activeTab === tab
                  ? "bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)] shadow-sm"
                  : "bg-[var(--surface)] text-[var(--ink-secondary)] border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.section>

      {/* CONTINUE LEARNING */}
      <motion.section
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider font-sans">
          Continue Learning
        </h2>
        
        <Link href={`/learn/${continueSubject.slug}`} className="group block">
          <div className="bg-[var(--surface)] p-5 sm:p-7 rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--accent-soft)] rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
            
            <div className="flex flex-col gap-2.5 flex-1 relative z-10">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider font-bold">
                <span>{continueSubject.category}</span>
                <span>•</span>
                <span className="text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] px-2 py-0.5 rounded">
                  {continueSubject.progress}% Complete
                </span>
              </div>
              <h3 className="text-xl sm:text-[22px] font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-tight">
                {continueSubject.title}
              </h3>
              <p className="text-[14px] text-[var(--ink-secondary)] line-clamp-2 max-w-2xl">
                {continueSubject.description}
              </p>
            </div>
            
            <div className="flex items-center gap-5 shrink-0 relative z-10 border-t md:border-t-0 md:border-l border-[var(--border)]/60 pt-4 md:pt-0 md:pl-6">
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[var(--ink)]">
                  Up next: {continueSubject.modules.find(m => !m.completed)?.title || "Review"}
                </span>
                <span className="text-[11.5px] font-mono text-[var(--ink-tertiary)] mt-0.5">
                  {continueSubject.completedModules} of {continueSubject.totalModules} modules completed
                </span>
              </div>
              <div className="w-11 h-11 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                <PlayCircle className="w-5 h-5 fill-white text-[var(--accent)]" />
              </div>
            </div>
          </div>
        </Link>
      </motion.section>

      {/* LEARNING PATHS */}
      <motion.section
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider font-sans flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
          Learning Paths
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learnPaths.map((path) => (
            <div key={path.id} className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] transition-all cursor-pointer flex flex-col gap-3 group shadow-sm hover:shadow">
              <h3 className="text-[15px] font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                {path.title}
              </h3>
              <p className="text-[13px] text-[var(--ink-secondary)]">
                {path.description}
              </p>
              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[var(--border)]/40">
                <span className="text-[11px] font-mono font-medium text-[var(--ink-tertiary)]">
                  {path.subjects.length} Subjects
                </span>
                <ChevronRight className="w-4 h-4 text-[var(--ink-tertiary)] group-hover:text-[var(--accent)] transition-colors ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* SUBJECTS GRID */}
      <motion.section
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider font-sans flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--accent)]" />
            Subjects
          </h2>
          {activeTab !== "All subjects" && (
            <span className="text-[11px] font-mono text-[var(--ink-tertiary)]">
              Showing {filteredSubjects.length} results
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((subject) => (
            <Link key={subject.id} href={`/learn/${subject.slug}`} className="group flex flex-col h-full">
              <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] group-hover:border-[var(--accent)] transition-all shadow-sm group-hover:shadow-md flex flex-col gap-3 flex-1 relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-lg bg-[var(--surface-subdued)] flex items-center justify-center border border-[var(--border)] text-[var(--ink-secondary)] group-hover:text-[var(--accent)] group-hover:bg-[var(--accent-soft)] group-hover:border-[var(--accent-soft-border)] transition-colors shadow-sm">
                    {getCategoryIcon(subject.category)}
                  </div>
                  {subject.progress > 0 && (
                    <span className="text-[10px] font-mono font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded border border-[var(--accent-soft-border)]">
                      {subject.progress}%
                    </span>
                  )}
                </div>
                
                <h3 className="text-[15.5px] font-bold text-[var(--ink)] mt-1.5 group-hover:text-[var(--accent)] transition-colors">
                  {subject.title}
                </h3>
                
                <p className="text-[13px] text-[var(--ink-secondary)] line-clamp-2 flex-1 leading-relaxed">
                  {subject.description}
                </p>
                
                <div className="pt-3.5 mt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] font-mono text-[var(--ink-tertiary)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {subject.totalModules} modules
                  </span>
                  <span className="group-hover:text-[var(--accent)] transition-colors font-medium">View Course →</span>
                </div>
              </div>
            </Link>
          ))}
          {filteredSubjects.length === 0 && (
            <div className="col-span-full py-12 text-center text-[var(--ink-tertiary)] border border-dashed border-[var(--border)] rounded-xl">
              No subjects found in this category.
            </div>
          )}
        </div>
      </motion.section>

    </div>
  );
}
