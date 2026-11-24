"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, ChevronRight, CheckCircle2 } from "lucide-react";
import { currentStreak, dailyQuestion, dateKey, getDailyHistory, DailyQuestion } from "@/lib/learn/daily";

/** "Today's question" sticker with the learner's streak; links to /learn/daily. */
export function DailyCard() {
  // Only rendered inside AppLayout, which renders children on the client only, so local history is readable here.
  const [{ q, streak, done }] = useState(() => {
    const today = dateKey();
    const history = getDailyHistory();
    return { q: dailyQuestion(today) as DailyQuestion, streak: currentStreak(history, today), done: !!history[today] };
  });
  return (
    <Link href="/learn/daily" className="brut brut-hover no-press group block rounded-2xl bg-card p-5">
      <span className="flex items-center justify-between gap-3">
        <span className="eyebrow">Daily question</span>
        <span className="inline-flex items-center gap-1 font-mono text-[12px] tabular-nums">
          <Flame aria-hidden className={streak > 0 ? "size-4 text-accent" : "size-4 text-mute"} />
          {streak}-day streak
        </span>
      </span>
      <span className="mt-3 block text-[15px] font-medium leading-snug">{q.question}</span>
      <span className="mt-4 flex items-center justify-between gap-3 border-t-[1.5px] border-hair pt-3 text-[13px]">
        <span className="truncate text-mute">{q.courseTitle}</span>
        {done ? (
          <span className="inline-flex items-center gap-1 font-semibold text-note">
            <CheckCircle2 aria-hidden className="size-4" /> Done today
          </span>
        ) : (
          <span className="label-cond inline-flex items-center text-[15px]">
            Answer <ChevronRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </span>
    </Link>
  );
}
