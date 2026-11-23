"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ChevronRight, CheckCircle2 } from "lucide-react";
import { currentStreak, dailyQuestion, dateKey, getDailyHistory, DailyQuestion } from "@/lib/learn/daily";

/** Compact "today's question" card with the learner's streak; links to /learn/daily. */
export function DailyCard() {
  const [state, setState] = useState<{ q: DailyQuestion; streak: number; done: boolean } | null>(null);

  useEffect(() => {
    const today = dateKey();
    const history = getDailyHistory();
    setState({ q: dailyQuestion(today), streak: currentStreak(history, today), done: !!history[today] });
  }, []);

  if (!state) return null;
  const { q, streak, done } = state;
  return (
    <Link href="/learn/daily"
      className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
      <span className="flex flex-col gap-1 min-w-0">
        <span className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
          Daily question · {q.courseTitle}
          {done && <span className="inline-flex items-center gap-1 text-[var(--success)] normal-case font-sans"><CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" /> Done</span>}
        </span>
        <span className="text-[14px] font-medium text-[var(--ink)] truncate">{q.question}</span>
      </span>
      <span className="flex items-center gap-2 shrink-0">
        <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[var(--ink)] tabular-nums">
          <Flame aria-hidden="true" className={streak > 0 ? "w-4 h-4 text-orange-500" : "w-4 h-4 text-[var(--ink-tertiary)]"} /> {streak}-day streak
        </span>
        <ChevronRight aria-hidden="true" className="w-5 h-5 text-[var(--accent)]" />
      </span>
    </Link>
  );
}
