"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, CheckCircle2, Mountain } from "lucide-react";
import { ladderFor } from "@/lib/learn/practiceLadder";
import { problemStorage } from "@/lib/problems/problemStorage";
import { LessonHeading } from "./TheoryNotes";

const STEPS = [
  { key: "easy", label: "Easy", note: "check you understood it", tone: "text-note" },
  { key: "medium", label: "Medium", note: "use it on your own", tone: "text-warning" },
  { key: "hard", label: "Hard", note: "interview level", tone: "text-danger" },
] as const;

/** End-of-lesson practice: problems on this topic from easy to hard, with ticks for ones already solved. */
export function PracticeLadder({ course, lesson }: { course: string; lesson: string }) {
  // client-only render (AppLayout), so local progress is readable on first render
  const [solved] = useState(() => problemStorage.getAllStatuses());
  const ladder = ladderFor(course, lesson);
  if (!ladder) return null;
  // some topics have no problems at one level yet (few Hard problems exist): show only filled steps
  const steps = STEPS.filter((s) => ladder[s.key].length > 0);

  return (
    <section className="flex flex-col gap-4">
      <LessonHeading icon={Mountain}>Practice ladder</LessonHeading>
      <p className="-mt-1 text-[15px] text-body">
        From first try to interview level, on {ladder.categories.join(" and ").toLowerCase()}. Solve them in order.
      </p>
      <ol className={clsx("grid gap-3", steps.length === 3 ? "md:grid-cols-3" : steps.length === 2 ? "md:grid-cols-2" : "")}>
        {steps.map((step, i) => (
          <li key={step.key} className="flex flex-col rounded-2xl border-[1.5px] border-hair bg-card p-4">
            <p className="flex items-baseline justify-between gap-2">
              <span className={clsx("label-cond text-[17px]", step.tone)}>
                {i + 1}. {step.label}
              </span>
              <span className="text-[12px] text-mute">{step.note}</span>
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {ladder[step.key].map((p) => (
                <li key={p.id}>
                  <Link href={`/practice/problems/${p.id}`} className="group flex items-start gap-2 rounded-lg py-1 text-[14px] font-medium text-ink hover:text-accent-ink">
                    {solved[p.id] === "solved" ? (
                      <CheckCircle2 aria-label="Solved" className="mt-0.5 size-4 shrink-0 text-note" />
                    ) : (
                      <ArrowRight aria-hidden className="mt-0.5 size-4 shrink-0 text-mute transition-transform group-hover:translate-x-0.5" />
                    )}
                    <span>{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
