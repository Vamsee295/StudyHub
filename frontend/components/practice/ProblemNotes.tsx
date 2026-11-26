"use client";

import { useEffect, useState } from "react";
import { markChanged } from "@/lib/sync/userSync";

// All problem notes live in one synced key (last write wins), keyed by problem id.
export const NOTES_KEY = "studyhub_problem_notes_v1";
const MAX_NOTE = 5000;

function readNotes(): Record<string, string> {
  try {
    const v = JSON.parse(localStorage.getItem(NOTES_KEY) || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

/** Notes tab: your own approach, edge cases and mistakes for this problem. Saves as you type. */
export function ProblemNotes({ problemId }: { problemId: string }) {
  const [text, setText] = useState(() => readNotes()[problemId] ?? "");
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (saved) return;
    const t = setTimeout(() => {
      const all = readNotes();
      if (text.trim()) all[problemId] = text;
      else delete all[problemId];
      try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(all));
        markChanged(NOTES_KEY);
      } catch {
        /* storage full or blocked */
      }
      setSaved(true);
    }, 500);
    return () => clearTimeout(t);
  }, [text, saved, problemId]);

  return (
    <div className="flex h-full flex-col gap-2">
      <label htmlFor="problem-notes" className="flex items-baseline justify-between">
        <span className="text-[14px] font-semibold text-ink">Your notes</span>
        <span className="font-mono text-[11px] text-mute">{saved ? "Saved" : "Saving…"}</span>
      </label>
      <textarea
        id="problem-notes"
        value={text}
        maxLength={MAX_NOTE}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        placeholder={"The pattern, the key observation, edge cases you missed, how long it took…\nWriting it in your own words is what makes it stick."}
        className="min-h-[260px] flex-1 resize-y rounded-xl border-2 border-hair bg-paper px-3 py-2.5 text-[16px] leading-relaxed text-ink outline-none placeholder:text-mute focus:border-accent md:text-[14px]"
      />
      <p className="text-[12px] text-mute">Notes are private and sync to your account.</p>
    </div>
  );
}
