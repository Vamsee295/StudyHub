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
        "label-cond flex h-9 shrink-0 items-center gap-1.5 rounded-xl border-2 px-3 text-[14px] transition-colors",
        saved ? "border-line bg-card-2 text-accent-ink" : "border-hair text-body hover:border-line hover:text-ink"
      )}
    >
      <Bookmark aria-hidden="true" className={clsx("w-4 h-4", saved && "fill-current")} />
      <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
