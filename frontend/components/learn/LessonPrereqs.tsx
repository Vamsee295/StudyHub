"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ListChecks } from "lucide-react";
import { prerequisitesFor } from "@/lib/learn/lessonPrereqs";
import { getStoredProgress } from "@/lib/services/learnService";

/** "Before this lesson" panel: prerequisite lessons with completion state from saved progress. */
export function LessonPrereqs({ course, lesson }: { course: string; lesson: string }) {
  const items = useMemo(() => prerequisitesFor(course, lesson), [course, lesson]);
  // rendered inside the lesson page, which only renders on the client
  const done = useMemo(() => {
    const store = getStoredProgress();
    return new Set(items
      .filter((p) => store[p.lessonId]?.status === "completed" || store[p.lesson]?.status === "completed")
      .map((p) => `${p.course}/${p.lesson}`));
  }, [items]);

  // The "previous lesson" entry alone isn't worth a panel.
  if (!items.some((p) => p.kind !== "previous")) return null;
  const remaining = items.filter((p) => !done.has(`${p.course}/${p.lesson}`)).length;

  return (
    <section aria-labelledby="prereq-heading" className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-hair bg-paper-2 p-4">
      <h2 id="prereq-heading" className="label-cond flex items-center gap-2 text-[17px]">
        <ListChecks aria-hidden className="size-4 text-accent" /> Before this lesson
        <span className="ml-auto font-mono text-[11px] font-normal normal-case tracking-normal tabular-nums text-mute">
          {remaining === 0 ? "All done" : `${remaining} of ${items.length} not completed`}
        </span>
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((p) => {
          const complete = done.has(`${p.course}/${p.lesson}`);
          return (
            <li key={`${p.course}/${p.lesson}`} className="flex items-start gap-2 text-[14px]">
              {complete
                ? <CheckCircle2 aria-label="Completed" className="mt-0.5 size-4 shrink-0 text-note" />
                : <Circle aria-label="Not completed" className="mt-0.5 size-4 shrink-0 text-mute" />}
              <span className="min-w-0">
                <Link href={`/learn/${p.course}/${p.lesson}`} className="font-semibold underline-offset-2 hover:text-accent-ink hover:underline">
                  {p.title}
                </Link>
                {p.course !== course && <span className="text-mute"> · {p.courseTitle}</span>}
                <span className="block text-[13px] text-body">{p.reason}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
