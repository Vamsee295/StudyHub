"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ListChecks } from "lucide-react";
import { prerequisitesFor } from "@/lib/learn/lessonPrereqs";
import { getStoredProgress } from "@/lib/services/learnService";

/** "Before this lesson" panel: prerequisite lessons with completion state from saved progress. */
export function LessonPrereqs({ course, lesson }: { course: string; lesson: string }) {
  const items = useMemo(() => prerequisitesFor(course, lesson), [course, lesson]);
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    const store = getStoredProgress();
    setDone(new Set(items
      .filter((p) => store[p.lessonId]?.status === "completed" || store[p.lesson]?.status === "completed")
      .map((p) => `${p.course}/${p.lesson}`)));
  }, [items]);

  // The "previous lesson" entry alone isn't worth a panel.
  if (!items.some((p) => p.kind !== "previous")) return null;
  const remaining = items.filter((p) => !done.has(`${p.course}/${p.lesson}`)).length;

  return (
    <section aria-labelledby="prereq-heading" className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-subdued)]/40 flex flex-col gap-3">
      <h2 id="prereq-heading" className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">
        <ListChecks aria-hidden="true" className="w-4 h-4 text-[var(--accent)]" /> Before this lesson
        <span className="ml-auto normal-case font-medium tracking-normal text-[var(--ink-tertiary)] tabular-nums">
          {remaining === 0 ? "All done" : `${remaining} of ${items.length} not completed`}
        </span>
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((p) => {
          const complete = done.has(`${p.course}/${p.lesson}`);
          return (
            <li key={`${p.course}/${p.lesson}`} className="flex items-start gap-2 text-[13px]">
              {complete
                ? <CheckCircle2 aria-label="Completed" className="w-4 h-4 mt-0.5 shrink-0 text-[var(--success)]" />
                : <Circle aria-label="Not completed" className="w-4 h-4 mt-0.5 shrink-0 text-[var(--ink-tertiary)]" />}
              <span className="min-w-0">
                <Link href={`/learn/${p.course}/${p.lesson}`} className="font-medium text-[var(--ink)] hover:text-[var(--accent)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded">
                  {p.title}
                </Link>
                {p.course !== course && <span className="text-[var(--ink-tertiary)]"> · {p.courseTitle}</span>}
                <span className="block text-[12.5px] text-[var(--ink-secondary)]">{p.reason}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
