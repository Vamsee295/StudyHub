"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { PRACTICE_PATH } from "@/lib/data/patterns";
import { categoryOf, problemOrder, problems } from "@/lib/problems/problemRegistry";
import { problemStorage } from "@/lib/problems/problemStorage";

/** Practice from zero to interview level: the next problem to solve, and every topic in learning order with progress. */
export function PracticePath() {
  // client-only render (AppLayout), so local progress is readable on first render
  const [solved] = useState(() => problemStorage.getAllStatuses());
  const order = problemOrder(); // topics in learning order, easy before hard
  const isSolved = (id: string) => solved[id] === "solved";
  const next = order.map((id) => problems[id]).find((p) => !isSolved(p.id));
  const nextTopic = next ? categoryOf(next) : null;

  const stats = (topic: string) => {
    const ids = order.filter((id) => categoryOf(problems[id]) === topic);
    return { total: ids.length, done: ids.filter(isSolved).length };
  };

  return (
    <div className="flex flex-col gap-5">
      {next && (
        <div className="brut flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card p-5 md:p-6">
          <div className="min-w-0">
            <p className="eyebrow">Next up · {nextTopic}</p>
            <p className="display mt-1 text-[28px] leading-tight md:text-[32px]">{next.title}</p>
            <p className="mt-1 text-[14px] text-body">
              {next.difficulty} · the first unsolved problem on your path. Stuck? Open its Pattern guide.
            </p>
          </div>
          <Link href={`/practice/problems/${next.id}`} className={clsx(buttonClass("accent"), "shrink-0")}>
            Solve it <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PRACTICE_PATH.map((stage) => (
          <li key={stage.stage} className="flex flex-col rounded-2xl border-[1.5px] border-hair bg-card p-5">
            <p className="eyebrow">{stage.stage}</p>
            <p className="mt-1 text-[14px] text-body">{stage.goal}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {stage.topics.map((topic) => {
                const { total, done } = stats(topic);
                if (!total) return null;
                const complete = done === total;
                return (
                  <li key={topic}>
                    <Link href={`/practice/problems?topic=${encodeURIComponent(topic)}`} className="group block">
                      <span className="flex items-center gap-1.5 text-[14.5px]">
                        {complete && <CheckCircle2 aria-label="Completed" className="size-4 text-note" />}
                        <span className={clsx("font-semibold group-hover:text-accent-ink", complete && "text-mute")}>{topic}</span>
                        {topic === nextTopic && (
                          <span className="rounded-full bg-accent px-1.5 py-px font-mono text-[9.5px] uppercase tracking-wider text-paper">Now</span>
                        )}
                        <span className="ml-auto font-mono text-[11.5px] text-mute tabular-nums">
                          {done}/{total}
                        </span>
                      </span>
                      <span aria-hidden className="mt-1 block h-1.5 overflow-hidden rounded-full bg-hair">
                        <span className="block h-full rounded-full bg-note" style={{ width: `${(100 * done) / total}%` }} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
