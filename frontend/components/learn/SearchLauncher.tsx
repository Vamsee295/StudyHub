"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";

// The dialog pulls in every course's notes to build its index, so load it only when opened.
const SearchDialog = dynamic(() => import("./SearchDialog"), { ssr: false });

/** Header search button (icon-only: the primary nav fills the header); Ctrl/Cmd+K also toggles it. */
export function SearchLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search lessons"
        aria-keyshortcuts="Control+K"
        title="Search lessons (Ctrl K)"
        className="p-2 rounded-lg text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <Search aria-hidden="true" className="w-[19px] h-[19px] sm:w-[20px] sm:h-[20px]" />
      </button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}
