"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { clsx } from "clsx";
import { Avatar } from "@/components/ui/Avatar";
import { communityApi } from "@/lib/api/community";
import type { CommunityAuthor } from "@/lib/types/community";

/** "@query" right before the caret, if the caret is in one. */
export function mentionAt(text: string, caret: number): { start: number; query: string } | null {
  const m = text.slice(0, caret).match(/(?:^|\s)@([^\s@]{0,30})$/);
  return m ? { start: caret - m[1].length - 1, query: m[1] } : null;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Split text into plain parts and "@Name" parts for the given people (longest names first). */
export function splitMentions(text: string, people: CommunityAuthor[]): { text: string; who?: CommunityAuthor }[] {
  const named = people.filter((p) => p.full_name).sort((a, b) => b.full_name.length - a.full_name.length);
  if (!named.length) return [{ text }];
  const byName = new Map(named.map((p) => [p.full_name.toLowerCase(), p]));
  const re = new RegExp(`@(${named.map((p) => escape(p.full_name)).join("|")})(?![\\w])`, "gi");
  const out: { text: string; who?: CommunityAuthor }[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], who: byName.get(m[1].toLowerCase()) });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export interface MentionBoxHandle {
  focus: () => void;
}

/**
 * A growing textarea where typing "@" suggests people: those already in the thread first, then a search
 * of community members. Picking one writes "@Their Name " and reports them through `onPick`.
 */
export const MentionBox = forwardRef<
  MentionBoxHandle,
  {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    onPick: (who: CommunityAuthor) => void;
    people: CommunityAuthor[]; // thread participants, suggested first
    meId: string | null;
    placeholder: string;
    label: string;
  }
>(function MentionBox({ value, onChange, onSubmit, onPick, people, meId, placeholder, label }, handle) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [at, setAt] = useState<{ start: number; query: string } | null>(null);
  const [found, setFound] = useState<CommunityAuthor[]>([]);
  const [active, setActive] = useState(0);
  useImperativeHandle(handle, () => ({ focus: () => ref.current?.focus() }));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  // search other members after a short pause
  const query = at?.query ?? "";
  useEffect(() => {
    if (!query) return;
    let live = true;
    const t = setTimeout(() => {
      communityApi.searchLearners(query).then((r) => live && setFound(r)).catch(() => {});
    }, 200);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [query]);

  const q = query.toLowerCase();
  const local = people.filter((p) => p.id !== meId && p.full_name.toLowerCase().includes(q));
  const seen = new Set(local.map((p) => p.id));
  const options = at ? [...local, ...(q ? found.filter((p) => !seen.has(p.id) && p.id !== meId) : [])].slice(0, 6) : [];
  const open = options.length > 0;

  const track = (text: string, caret: number) => {
    const next = mentionAt(text, caret);
    setAt(next);
    if (!next?.query) setFound([]);
    setActive(0);
  };

  const pick = (who: CommunityAuthor) => {
    if (!at) return;
    const caret = at.start + 1 + at.query.length;
    const insert = `@${who.full_name} `;
    const next = value.slice(0, at.start) + insert + value.slice(caret);
    onChange(next);
    onPick(who);
    setAt(null);
    setFound([]);
    requestAnimationFrame(() => {
      const pos = at.start + insert.length;
      ref.current?.focus();
      ref.current?.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="relative">
      <textarea
        ref={ref}
        rows={1}
        value={value}
        maxLength={1000}
        aria-label={label}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? "mention-options" : undefined}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          track(e.target.value, e.target.selectionStart);
        }}
        onClick={(e) => track(value, e.currentTarget.selectionStart)}
        onBlur={() => setTimeout(() => setAt(null), 150)}
        onKeyDown={(e) => {
          if (open) {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (i + (e.key === "ArrowDown" ? 1 : options.length - 1)) % options.length);
              return;
            }
            if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              pick(options[active]);
              return;
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setAt(null);
              return;
            }
          }
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onSubmit();
        }}
        className="block w-full resize-none overflow-hidden bg-transparent pt-1.5 text-[15px] leading-[1.5] outline-none placeholder:text-mute"
      />
      {open && (
        <ul id="mention-options" role="listbox" aria-label="People to mention" className="pop-in brut absolute left-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-xl bg-card py-1">
          {options.map((p, i) => (
            <li key={p.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()} // keep focus in the textarea
                onClick={() => pick(p)}
                onMouseEnter={() => setActive(i)}
                className={clsx("flex w-full items-center gap-2.5 px-3 py-2 text-left", i === active && "bg-card-2")}
              >
                <Avatar src={p.avatar_url} name={p.full_name} className="size-7 text-[11px]" />
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold">{p.full_name}</span>
                  {p.university && <span className="block truncate text-[12px] text-mute">{p.university}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
