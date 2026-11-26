"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, ChevronRight, CheckCircle2, CircleDot, Code2 } from "lucide-react";
import { dailyProblem, dailyStreak, dateKey, getDailyCodeHistory } from "@/lib/learn/dailyCode";

/** "Today's problem" sticker with the learner's daily streak; links to /learn/daily. */
export function DailyCard() {
  // Only rendered inside AppLayout, which renders children on the client only, so local history is readable here.
  const [{ p, streak, entry }] = useState(() => {
    const today = dateKey();
    const history = getDailyCodeHistory();
    return { p: dailyProblem(today), streak: dailyStreak(history, today), entry: history[today] };
  });
  return (
    <Link href="/learn/daily" className="brut brut-hover no-press group block rounded-2xl bg-card p-5">
      <span className="flex items-center justify-between gap-3">
        <span className="eyebrow flex items-center gap-1.5">
          <Code2 className="size-3.5" aria-hidden /> Daily problem
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[12px] tabular-nums">
          <Flame aria-hidden className={streak > 0 ? "size-4 text-accent" : "size-4 text-mute"} />
          {streak}-day streak
        </span>
      </span>
      <span className="label-cond mt-3 block text-[22px] leading-tight">{p.title}</span>
      <span className="mt-1 block text-[13px] text-mute">
        {p.difficulty} · {p.topics.slice(0, 2).join(" · ")}
      </span>
      <span className="mt-4 flex items-center justify-between gap-3 border-t-[1.5px] border-hair pt-3 text-[13px]">
        <span className="text-mute">New problem every day at midnight</span>
        {entry?.status === "solved" ? (
          <span className="inline-flex items-center gap-1 font-semibold text-note">
            <CheckCircle2 aria-hidden className="size-4" /> Solved
          </span>
        ) : entry ? (
          <span className="inline-flex items-center gap-1 font-semibold text-warning">
            <CircleDot aria-hidden className="size-4" /> Keep going
          </span>
        ) : (
          <span className="label-cond inline-flex items-center text-[15px]">
            Solve <ChevronRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </span>
    </Link>
  );
}
