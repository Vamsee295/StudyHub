"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, CornerDownLeft, Search, X } from "lucide-react";
import { clsx } from "clsx";
import { searchLessons, SearchResult } from "@/lib/learn/search";
import { BOOKMARKS_EVENT, getBookmarks } from "@/lib/learn/bookmarks";
import { lessonRef } from "@/lib/learn/lessonPrereqs";

type Row = { href: string; title: string; meta: string; snippet?: string; heading?: string };

const toRow = (r: SearchResult): Row => ({
  href: `/learn/${r.course}/${r.lesson}`, title: r.title, meta: r.courseTitle, snippet: r.snippet, heading: r.heading,
});

/** Lesson search dialog: full-text search over every lesson; an empty query lists bookmarks. */
export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [bookmarks, setBookmarks] = useState<Row[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
    const load = () => setBookmarks(getBookmarks().flatMap((b) => {
      const ref = lessonRef(`${b.course}/${b.lesson}`);
      return ref ? [{ href: `/learn/${b.course}/${b.lesson}`, title: ref.title, meta: ref.courseTitle }] : [];
    }));
    load();
    window.addEventListener(BOOKMARKS_EVENT, load);
    return () => window.removeEventListener(BOOKMARKS_EVENT, load);
  }, []);

  const results = useMemo(() => (query.trim() ? searchLessons(query, 20).map(toRow) : []), [query]);
  const rows = query.trim() ? results : bookmarks;

  const go = (row: Row | undefined) => {
    if (!row) return;
    onClose();
    router.push(row.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, rows.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); go(rows[active]); }
  };

  useEffect(() => {
    document.getElementById(`search-row-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-[10vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search lessons"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="pop-in brut flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-card"
      >
        <div className="flex items-center gap-2 border-b-[1.5px] border-hair px-4">
          <Search aria-hidden="true" className="size-4 shrink-0 text-accent" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0); // new results: highlight the first
            }}
            placeholder="Search all lessons and notes…"
            aria-label="Search lessons"
            aria-controls="search-results"
            aria-activedescendant={rows.length ? `search-row-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent py-4 text-[16px] outline-none placeholder:text-mute"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="tap rounded-lg p-1.5 text-mute hover:bg-card-2 hover:text-ink">
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>

        <div id="search-results" role="listbox" aria-label="Results" className="overflow-y-auto">
          {!query.trim() && (
            <p className="flex items-center gap-1.5 px-4 pb-1 pt-3 font-mono text-[11px] uppercase tracking-wider text-mute">
              <Bookmark aria-hidden="true" className="w-3.5 h-3.5" /> {bookmarks.length ? "Saved lessons" : "No saved lessons yet"}
            </p>
          )}
          {!query.trim() && !bookmarks.length && (
            <p className="px-4 pb-4 text-[14px] text-body">Type to search 400+ lessons, or bookmark lessons to see them here.</p>
          )}
          {query.trim() && !results.length && (
            <p className="px-4 py-6 text-[14px] text-body">No lessons match “{query}”. Try fewer or different words.</p>
          )}
          {rows.map((r, i) => (
            <div
              key={r.href}
              id={`search-row-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r)}
              className={clsx("flex cursor-pointer flex-col gap-0.5 px-4 py-2.5", i === active && "bg-card-2")}
            >
              <span className="flex items-center gap-2 text-[15px] font-medium">
                <span className="truncate">{r.title}</span>
                <span className="ml-auto shrink-0 font-mono text-[11px] font-normal text-mute">{r.meta}</span>
              </span>
              {r.heading && <span className="truncate text-[12px] text-accent-ink">§ {r.heading}</span>}
              {r.snippet && <span className="line-clamp-2 text-[13px] text-body">{r.snippet}</span>}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t-[1.5px] border-hair px-4 py-2 font-mono text-[11px] text-mute">
          <span className="inline-flex items-center gap-1"><CornerDownLeft aria-hidden="true" className="w-3 h-3" /> open</span>
          <span>↑ ↓ move</span>
          <span>Esc close</span>
        </div>
      </div>
    </div>
  );
}
