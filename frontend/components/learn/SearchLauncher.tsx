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
        className="tap grid size-9 shrink-0 place-items-center rounded-xl text-ink/70 transition-colors hover:bg-ink/[0.06] hover:text-ink"
      >
        <Search aria-hidden className="size-[18px]" />
      </button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}
