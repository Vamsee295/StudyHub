"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, X } from "lucide-react";
import { BOOKMARKS_EVENT, getBookmarks, LessonBookmark, toggleBookmark } from "@/lib/learn/bookmarks";
import { lessonRef } from "@/lib/learn/lessonPrereqs";
import { getStoredProgress } from "@/lib/services/learnService";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";

export default function SavedLessonsPage() {
  // client-only render (AppLayout), so local bookmarks are readable on first render
  const [items, setItems] = useState<LessonBookmark[]>(getBookmarks);

  useEffect(() => {
    const sync = () => setItems(getBookmarks());
    window.addEventListener(BOOKMARKS_EVENT, sync);
    return () => window.removeEventListener(BOOKMARKS_EVENT, sync);
  }, []);

  const store = getStoredProgress();
  // Group by course, keeping the most recently saved course first.
  const groups = new Map<string, { title: string; rows: { b: LessonBookmark; title: string; done: boolean }[] }>();
  for (const b of items) {
    const ref = lessonRef(`${b.course}/${b.lesson}`);
    if (!ref) continue;
    if (!groups.has(b.course)) groups.set(b.course, { title: ref.courseTitle, rows: [] });
    const done = store[ref.id]?.status === "completed" || store[b.lesson]?.status === "completed";
    groups.get(b.course)!.rows.push({ b, title: ref.title, done });
  }

  return (
    <div className="max-w-3xl">
      <Link href="/learn" className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft aria-hidden className="size-3.5" /> Learn
      </Link>
      <PageHeader eyebrow="Saved in this browser" title="Saved" hl="lessons" />

      {groups.size === 0 ? (
        <div className="rounded-2xl border-[1.5px] border-dashed border-hair p-8 text-center">
          <p className="note mb-2">nothing here yet</p>
          <p className="text-[15px] text-body">Hit Save at the top of any lesson to keep it here.</p>
          <Link href="/learn" className={`${buttonClass("secondary", "sm")} mt-5`}>
            Browse lessons
          </Link>
        </div>
      ) : (
        [...groups.entries()].map(([course, g]) => (
          <section key={course} aria-labelledby={`saved-${course}`} className="mb-10">
            <h2 id={`saved-${course}`} className="label-cond mb-2 flex items-baseline gap-2 text-[20px]">
              {g.title} <span className="font-mono text-[12px] font-normal text-mute">{g.rows.length}</span>
            </h2>
            <ul className="border-t-[1.5px] border-hair">
              {g.rows.map(({ b, title, done }) => {
                const key = `${b.course}/${b.lesson}`;
                return (
                  <li key={key} className="flex items-center gap-3 border-b-[1.5px] border-hair px-1 py-3">
                    {done ? (
                      <CheckCircle2 aria-label="Completed" className="size-[18px] shrink-0 text-note" />
                    ) : (
                      <span aria-hidden className="block size-[18px] shrink-0 rounded-full border-2 border-ink/25" />
                    )}
                    <Link href={`/learn/${key}`} className="min-w-0 flex-1 truncate text-[15px] font-medium hover:text-accent-ink">
                      {title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(b.course, b.lesson)}
                      aria-label={`Remove ${title} from saved lessons`}
                      className="tap rounded-lg p-1.5 text-mute hover:bg-card-2 hover:text-ink"
                    >
                      <X aria-hidden className="size-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
