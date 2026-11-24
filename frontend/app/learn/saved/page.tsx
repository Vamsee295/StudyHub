"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, CheckCircle2, X } from "lucide-react";
import { BOOKMARKS_EVENT, getBookmarks, LessonBookmark, toggleBookmark } from "@/lib/learn/bookmarks";
import { lessonRef } from "@/lib/learn/lessonPrereqs";
import { getStoredProgress } from "@/lib/services/learnService";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

export default function SavedLessonsPage() {
  const [items, setItems] = useState<LessonBookmark[] | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = () => {
      const list = getBookmarks();
      const store = getStoredProgress();
      setItems(list);
      setDone(Object.fromEntries(list.map((b) => {
        const ref = lessonRef(`${b.course}/${b.lesson}`);
        return [`${b.course}/${b.lesson}`, !!ref && (store[ref.id]?.status === "completed" || store[b.lesson]?.status === "completed")];
      })));
    };
    load();
    window.addEventListener(BOOKMARKS_EVENT, load);
    return () => window.removeEventListener(BOOKMARKS_EVENT, load);
  }, []);

  if (items === null) return null;

  // Group by course, keeping the most recently saved course first.
  const groups = new Map<string, { title: string; rows: { b: LessonBookmark; title: string }[] }>();
  for (const b of items) {
    const ref = lessonRef(`${b.course}/${b.lesson}`);
    if (!ref) continue;
    if (!groups.has(b.course)) groups.set(b.course, { title: ref.courseTitle, rows: [] });
    groups.get(b.course)!.rows.push({ b, title: ref.title });
  }

  return (
    <div className="flex flex-col gap-6 pb-16 w-full max-w-3xl">
      <Link href="/learn" className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] self-start rounded ${focusRing}`}>
        <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Back to Learn
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] tracking-tight flex items-center gap-3">
          <Bookmark aria-hidden="true" className="w-7 h-7 text-[var(--accent)]" /> Saved lessons
        </h1>
        <p className="text-[var(--ink-secondary)] text-[15px]">
          Lessons you bookmarked, grouped by course. Saved in this browser. Press Ctrl K anywhere to search all lessons.
        </p>
      </header>

      {groups.size === 0 ? (
        <p className="p-6 rounded-xl border border-dashed border-[var(--border)] text-[14px] text-[var(--ink-secondary)]">
          No saved lessons yet. Use the Save button at the top of any lesson to keep it here.
        </p>
      ) : (
        [...groups.entries()].map(([course, g]) => (
          <section key={course} aria-labelledby={`saved-${course}`} className="flex flex-col gap-2">
            <h2 id={`saved-${course}`} className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink-tertiary)]">
              {g.title} <span className="tabular-nums">({g.rows.length})</span>
            </h2>
            <ul className="flex flex-col divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              {g.rows.map(({ b, title }) => {
                const key = `${b.course}/${b.lesson}`;
                return (
                  <li key={key} className="flex items-center gap-3 px-4 py-3">
                    {done[key] && <CheckCircle2 aria-label="Completed" className="w-4 h-4 shrink-0 text-[var(--success)]" />}
                    <Link href={`/learn/${key}`} className={`flex-1 min-w-0 truncate text-[14px] font-medium text-[var(--ink)] hover:text-[var(--accent)] rounded ${focusRing}`}>
                      {title}
                    </Link>
                    <button type="button" onClick={() => toggleBookmark(b.course, b.lesson)} aria-label={`Remove ${title} from saved lessons`}
                      className={`p-1.5 rounded text-[var(--ink-tertiary)] hover:text-[var(--ink)] ${focusRing}`}>
                      <X aria-hidden="true" className="w-4 h-4" />
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
