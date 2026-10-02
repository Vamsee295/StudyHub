"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import Link from "next/link";
import { Code2, Database, Laptop, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { PracticeHeader } from "@/components/practice/PracticeHeader";
import { practiceApi } from "@/lib/api/practice";
import { PracticeAttemptLedger } from "@/types";

type MappedSession = {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  durationStr: string;
  completedDate: string;
  track: string;
  type: string;
};

export default function PracticeHubPage() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [recentSessions, setRecentSessions] = useState<MappedSession[]>([]);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const res = await practiceApi.getLedger();
        if (res.ledger) {
          const ledger: MappedSession[] = res.ledger.map(l => ({
            id: l.id,
            title: l.title,
            score: l.score,
            totalQuestions: l.total_questions,
            accuracy: l.total_questions > 0 ? Math.round((l.score / l.total_questions) * 100) : 0,
            durationStr: `${Math.round(l.duration_seconds / 60)}m ${l.duration_seconds % 60}s`,
            completedDate: new Date(l.completed_at).toLocaleDateString(),
            track: l.domain,
            type: "Sprint"
          } as any));
          setRecentSessions(ledger.slice(0, 5)); // Just take the 5 most recent
        }
      } catch (err) {
        console.error("Failed to load practice ledger", err);
      }
    }
    loadData();
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-10 pb-24 w-full relative">
      <PracticeHeader />

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4"
        variants={reduced ? undefined : container}
        initial="hidden"
        animate="show"
      >
        {/* CARD 1: CODE PLAYGROUND */}
        <motion.div variants={reduced ? undefined : item} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[var(--accent)] hover:shadow-md transition-all group">
          <div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5">
              <Code2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight mb-2">Code Playground</h2>
            <p className="text-[14px] text-[var(--ink-secondary)] mb-6">
              VS Code-style multi-file environment with real execution, full file explorer, tabs, and output console.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-xs font-mono text-[var(--ink-secondary)]">Python</span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-xs font-mono text-[var(--ink-secondary)]">Java</span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-xs font-mono text-[var(--ink-secondary)]">C</span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-xs font-mono text-[var(--ink-secondary)]">C++</span>
            </div>
          </div>
          <Link href="/practice/code" className="btn-primary w-full flex items-center justify-center gap-2 group-hover:bg-[var(--accent-hover)] transition-colors">
            Open Code Playground <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* CARD 2: SQL LAB */}
        <motion.div variants={reduced ? undefined : item} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[var(--accent)] hover:shadow-md transition-all group">
          <div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
              <Database className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight mb-2">SQL Lab</h2>
            <p className="text-[14px] text-[var(--ink-secondary)] mb-6">
              Write SQL queries against interactive practice databases with live schema exploration and real execution.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-xs font-mono text-[var(--ink-secondary)]">SQL Editor</span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-xs font-mono text-[var(--ink-secondary)]">Schema Explorer</span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-xs font-mono text-[var(--ink-secondary)]">Query Results</span>
            </div>
          </div>
          <Link href="/practice/sql" className="btn-primary w-full flex items-center justify-center gap-2 group-hover:bg-[var(--accent-hover)] transition-colors">
            Open SQL Lab <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* CARD 3: DSA PROBLEMS / CODING SPRINTS */}
        <motion.div variants={reduced ? undefined : item} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[var(--accent)] hover:shadow-md transition-all group">
          <div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-5">
              <Laptop className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight mb-2">Coding Sprints &amp; DSA</h2>
            <p className="text-[14px] text-[var(--ink-secondary)] mb-6">
              Targeted timed sprints to sharpen placement algorithms, data structures recall, and coding speed.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-xs font-mono text-[var(--ink-secondary)]">Algorithms</span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-xs font-mono text-[var(--ink-secondary)]">Data Structures</span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-xs font-mono text-[var(--ink-secondary)]">Timed Sprints</span>
            </div>
          </div>
          <Link href="/practice/problems" className="btn-primary w-full flex items-center justify-center gap-2 group-hover:bg-[var(--accent-hover)] transition-colors">
            Start Coding Sprint <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>

      {/* RECENT SESSIONS */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-bold text-[var(--ink)] mb-4">Recent Practice Sessions</h3>
        {recentSessions.length > 0 ? (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs">
            <div className="divide-y divide-[var(--border)]">
              {recentSessions.map((session, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-[var(--surface-subdued)] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--surface-subdued)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-secondary)]">
                      {session.track === 'dsa' ? <Code2 className="w-5 h-5" /> : 
                       session.track === 'sql' ? <Database className="w-5 h-5" /> : 
                       <Laptop className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-[var(--ink)]">{session.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-[var(--ink-tertiary)] mt-1">
                        <span className="uppercase font-mono">{session.track}</span>
                        <span>•</span>
                        <span>{session.completedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-[var(--success)] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                    <span className="text-xs text-[var(--ink-tertiary)] flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {session.durationStr}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[var(--surface-subdued)] border border-[var(--border)] rounded-2xl p-8 text-center">
            <p className="text-[var(--ink-secondary)]">You haven't completed any practice sessions yet.</p>
            <p className="text-sm text-[var(--ink-tertiary)] mt-1">Select one of the playgrounds above to get started.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
