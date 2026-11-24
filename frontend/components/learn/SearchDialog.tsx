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
  useEffect(() => setActive(0), [query]);

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 px-4 pt-[10vh]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search lessons"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="w-full max-w-2xl rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
      >
        <div className="flex items-center gap-2 px-4 border-b border-[var(--border)]">
          <Search aria-hidden="true" className="w-4 h-4 text-[var(--ink-tertiary)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all lessons and notes…"
            aria-label="Search lessons"
            aria-controls="search-results"
            aria-activedescendant={rows.length ? `search-row-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 min-w-0 py-3.5 bg-transparent text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-tertiary)] outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="p-1.5 rounded text-[var(--ink-tertiary)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>

        <div id="search-results" role="listbox" aria-label="Results" className="overflow-y-auto">
          {!query.trim() && (
            <p className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--ink-tertiary)] flex items-center gap-1.5">
              <Bookmark aria-hidden="true" className="w-3.5 h-3.5" /> {bookmarks.length ? "Saved lessons" : "No saved lessons yet"}
            </p>
          )}
          {!query.trim() && !bookmarks.length && (
            <p className="px-4 pb-4 text-[13px] text-[var(--ink-secondary)]">Type to search 400+ lessons, or bookmark lessons to see them here.</p>
          )}
          {query.trim() && !results.length && (
            <p className="px-4 py-6 text-[13px] text-[var(--ink-secondary)]">No lessons match “{query}”. Try fewer or different words.</p>
          )}
          {rows.map((r, i) => (
            <div
              key={r.href}
              id={`search-row-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r)}
              className={clsx("px-4 py-2.5 cursor-pointer flex flex-col gap-0.5 border-l-2",
                i === active ? "bg-[var(--accent-soft)]/50 border-[var(--accent)]" : "border-transparent")}
            >
              <span className="flex items-center gap-2 text-[14px] font-medium text-[var(--ink)]">
                <span className="truncate">{r.title}</span>
                <span className="ml-auto shrink-0 text-[11.5px] font-normal text-[var(--ink-tertiary)]">{r.meta}</span>
              </span>
              {r.heading && <span className="text-[12px] text-[var(--accent)] truncate">§ {r.heading}</span>}
              {r.snippet && <span className="text-[12.5px] text-[var(--ink-secondary)] line-clamp-2">{r.snippet}</span>}
            </div>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-[var(--border)] text-[11px] text-[var(--ink-tertiary)] flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><CornerDownLeft aria-hidden="true" className="w-3 h-3" /> open</span>
          <span>↑ ↓ move</span>
          <span>Esc close</span>
        </div>
      </div>
    </div>
  );
}
