"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  BookOpen, 
  Code2, 
  Database, 
  TerminalSquare, 
  Network, 
  Server, 
  PlaySquare, 
  FileText, 
  Clock, 
  Briefcase 
} from "lucide-react";

export default function DashboardPage() {
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col gap-8 pb-12 w-full">
      {/* PAGE HEADER */}
      <motion.section 
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]/80"
      >
        <div>
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight leading-tight">
            Good morning, Aditya.
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] mt-2 font-normal">
            Let's continue your placement preparation.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <div className="flex flex-col px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-sm">
            <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Placement Readiness</span>
            <span className="text-lg font-bold text-[var(--accent)] mt-0.5">74%</span>
          </div>
          <div className="flex flex-col px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-sm">
            <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Current Path</span>
            <span className="text-[13.5px] font-semibold text-[var(--ink)] mt-1">Software Engineer</span>
          </div>
          <div className="flex flex-col px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-sm">
            <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Current Streak</span>
            <span className="text-[13.5px] font-semibold text-[var(--success)] mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
              7 days
            </span>
          </div>
        </div>
      </motion.section>

      {/* MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (Main Content) - 8 columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* 1. Continue Learning Card */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] shadow-sm"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-mono font-bold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                  CONTINUE LEARNING
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
                <div>
                  <h2 className="text-2xl font-newsreader font-normal text-[var(--ink)]">Java OOP</h2>
                  <p className="text-[var(--ink-secondary)] text-[15px] mt-1">Inheritance & Polymorphism</p>
                </div>
                <Link href="/learn/java-oop" className="btn-primary shrink-0">
                  Continue Module <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-mono text-[12px] text-[var(--ink-tertiary)] uppercase">Module Progress</span>
                  <span className="font-mono text-[12px] text-[var(--accent)] font-semibold">68%</span>
                </div>
                <div className="w-full bg-[var(--border-strong)]/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--accent)] h-full rounded-full w-[68%]"></div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 2. Learning Progress (Grid of subjects) */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 mt-2"
          >
            <h3 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider">Learning Progress</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: "Java", progress: 72, icon: <TerminalSquare className="w-5 h-5 text-blue-600" /> },
                { name: "DSA", progress: 48, icon: <Code2 className="w-5 h-5 text-emerald-600" /> },
                { name: "SQL", progress: 81, icon: <Database className="w-5 h-5 text-purple-600" /> },
                { name: "DBMS", progress: 55, icon: <Server className="w-5 h-5 text-amber-600" /> },
                { name: "OS", progress: 31, icon: <TerminalSquare className="w-5 h-5 text-rose-600" /> },
                { name: "Networks", progress: 20, icon: <Network className="w-5 h-5 text-cyan-600" /> },
              ].map((subject) => (
                <div 
                  key={subject.name} 
                  className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm hover:border-[var(--border-strong)] transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-[var(--surface-subdued)]">
                      {subject.icon}
                    </div>
                    <span className="font-semibold text-[14px] text-[var(--ink)]">{subject.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-[var(--ink-secondary)] mb-1.5">
                    <span>PROGRESS</span>
                    <span className="text-[var(--ink)] font-semibold">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-[var(--border-strong)]/30 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--accent)] h-full rounded-full" style={{ width: `${subject.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 3. Recommended Resources */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 mt-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider">Recommended Resources</h3>
              <Link href="/resources" className="text-[12px] font-medium text-[var(--accent)] hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Java OOP Complete Guide", type: "Notes", time: "45 min" },
                { title: "DSA Patterns Cheatsheet", type: "Cheatsheet", time: "20 min" },
                { title: "SQL Interview Handbook", type: "Interview", time: "1h 30m" },
                { title: "DBMS Revision Guide", type: "Revision", time: "40 min" },
              ].map((resource) => (
                <Link 
                  key={resource.title} 
                  href="#" 
                  className="group flex items-center justify-between p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-[var(--ink-tertiary)] group-hover:text-[var(--accent)] transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">{resource.title}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono bg-[var(--surface-subdued)] px-1.5 py-0.5 rounded text-[var(--ink-secondary)]">{resource.type}</span>
                        <span className="text-[11px] font-mono text-[var(--ink-tertiary)]">{resource.time}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>

        </div>

        {/* RIGHT COLUMN (Sidebar context) - 4 columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Today's Plan */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)] shadow-sm"
          >
            <h3 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent)]" />
              Today's Plan
            </h3>
            
            <div className="flex flex-col gap-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />
                <span className="text-[14px] text-[var(--ink-secondary)] line-through group-hover:text-[var(--ink)] transition-colors">Complete Java OOP revision</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <Circle className="w-5 h-5 text-[var(--border-strong)] group-hover:text-[var(--accent)] shrink-0 mt-0.5 transition-colors" />
                <span className="text-[14px] text-[var(--ink)] font-medium">Solve 5 DSA questions</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <Circle className="w-5 h-5 text-[var(--border-strong)] group-hover:text-[var(--accent)] shrink-0 mt-0.5 transition-colors" />
                <span className="text-[14px] text-[var(--ink)] font-medium">Practice SQL joins</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <Circle className="w-5 h-5 text-[var(--border-strong)] group-hover:text-[var(--accent)] shrink-0 mt-0.5 transition-colors" />
                <span className="text-[14px] text-[var(--ink)] font-medium">Complete aptitude test</span>
              </label>
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--border)]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase">Completion</span>
                <span className="text-[11px] font-mono font-semibold text-[var(--ink)]">25%</span>
              </div>
              <div className="w-full bg-[var(--border-strong)]/30 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[var(--success)] h-full rounded-full w-[25%]"></div>
              </div>
            </div>
          </motion.section>

          {/* Upcoming Milestone */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--accent-soft)] rounded-xl p-6 border border-[var(--accent-soft-border)] shadow-sm"
          >
            <h3 className="text-[11px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider mb-3">
              Upcoming Milestone
            </h3>
            <div className="flex flex-col gap-1">
              <h4 className="text-[18px] font-newsreader font-medium text-[var(--ink)]">TCS Online Assessment</h4>
              <p className="text-[13px] text-[var(--ink-secondary)]">2 days remaining to clear cut-off.</p>
            </div>
            <Link href="/companies/tcs" className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-white border border-[var(--border)] text-[var(--ink)] px-4 py-2 rounded-lg text-[13px] font-semibold hover:border-[var(--border-strong)] shadow-sm transition-all hover:-translate-y-0.5">
              Prepare Now
            </Link>
          </motion.section>

          {/* Quick Tools */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)] shadow-sm"
          >
            <h3 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider mb-4">
              Quick Tools
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "SQL Playground", icon: <Database className="w-4 h-4" /> },
                { name: "DSA Visualizer", icon: <PlaySquare className="w-4 h-4" /> },
                { name: "Resume Analyzer", icon: <FileText className="w-4 h-4" /> },
                { name: "Interview Sim", icon: <Briefcase className="w-4 h-4" /> },
              ].map((tool) => (
                <Link 
                  key={tool.name} 
                  href={`/tools/${tool.name.toLowerCase().replace(" ", "-")}`} 
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--surface-subdued)] border border-[var(--border)] rounded-lg hover:border-[var(--border-strong)] hover:bg-[var(--surface)] transition-all hover:-translate-y-0.5 group"
                >
                  <div className="text-[var(--ink-tertiary)] group-hover:text-[var(--accent)] transition-colors">
                    {tool.icon}
                  </div>
                  <span className="text-[11px] font-medium text-[var(--ink)] text-center leading-tight">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}
