"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { clsx } from "clsx";
import { BOOKMARKS_EVENT, isBookmarked, toggleBookmark } from "@/lib/learn/bookmarks";

/** Toggles a bookmark for one lesson; stays in sync with other bookmark controls. */
export function LessonBookmarkButton({ course, lesson }: { course: string; lesson: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isBookmarked(course, lesson));
    sync();
    window.addEventListener(BOOKMARKS_EVENT, sync);
    return () => window.removeEventListener(BOOKMARKS_EVENT, sync);
  }, [course, lesson]);

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleBookmark(course, lesson))}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Bookmark this lesson"}
      title={saved ? "Remove bookmark" : "Bookmark this lesson"}
      className={clsx(
        "shrink-0 text-[12px] font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
        saved
          ? "bg-[var(--accent-soft)] border-[var(--accent-soft-border)] text-[var(--accent)]"
          : "bg-white border-[var(--border)] text-[var(--ink-secondary)] hover:text-[var(--ink)]"
      )}
    >
      <Bookmark aria-hidden="true" className={clsx("w-4 h-4", saved && "fill-current")} />
      <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
