"use client";

import { useEffect, useState } from "react";
import { Check, Copy, MessageSquareQuote, Plus, Trash2 } from "lucide-react";
import { ToolWorkspaceHeader } from "@/components/tools/shared/ToolWorkspaceHeader";
import { markChanged, SYNCED_EVENT } from "@/lib/sync/userSync";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const KEY = "studyhub_star_stories_v1";
const WPM = 130; // typical conversational speaking pace

type Story = { id: string; question: string; s: string; t: string; a: string; r: string };

const PROMPTS = [
  "Tell me about a time you faced a difficult technical problem.",
  "Describe a time you disagreed with a teammate.",
  "Tell me about a project you're proud of.",
  "Describe a time you missed a deadline or made a mistake.",
  "Tell me about a time you learned something new quickly.",
  "Describe a time you took ownership beyond your role.",
];

const PARTS = [
  { key: "s", label: "Situation", hint: "Where and when? Give only the context needed: the project, team and stakes.", target: [25, 60] },
  { key: "t", label: "Task", hint: "What were you responsible for? Make your own role clear.", target: [15, 45] },
  { key: "a", label: "Action", hint: "What did you do, step by step? Say \"I\", not \"we\". This is the longest part.", target: [60, 150] },
  { key: "r", label: "Result", hint: "What changed? Use numbers where honest, and add what you learned.", target: [20, 60] },
] as const;

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const newStory = (): Story => ({ id: crypto.randomUUID(), question: PROMPTS[0], s: "", t: "", a: "", r: "" });

function checks(st: Story): string[] {
  const out: string[] = [];
  const total = words(st.s) + words(st.t) + words(st.a) + words(st.r);
  if (total > 0 && words(st.a) < Math.max(words(st.s), words(st.t))) out.push("Action is shorter than the setup. Interviewers mostly assess what you did.");
  if (/\bwe\b/i.test(st.a) && !/\bI\b/.test(st.a)) out.push("Action uses \"we\" but never \"I\". Make your own contribution explicit.");
  if (st.r.trim() && !/\d/.test(st.r)) out.push("Result has no number. Add a measurable outcome if you honestly have one (time saved, users, accuracy).");
  if (total / WPM > 2.5) out.push("Over about 2.5 minutes spoken. Trim the situation and task first.");
  if (total > 0 && total < 80) out.push("Under about 40 seconds spoken. Add detail to the action and result.");
  return out;
}

export default function StarBuilderPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = (keepActive: boolean) => {
      let list: Story[] = [];
      try { list = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { /* start fresh */ }
      if (!Array.isArray(list) || !list.length) list = [newStory()];
      setStories(list);
      setActiveId((cur) => (keepActive && list.some((s) => s.id === cur) ? cur : list[0].id));
    };
    load(false);
    // Stories written on another device arrive with the account sync.
    const onSync = () => load(true);
    window.addEventListener(SYNCED_EVENT, onSync);
    return () => window.removeEventListener(SYNCED_EVENT, onSync);
  }, []);

  const save = (list: Story[]) => {
    setStories(list);
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* not persisted */ }
    markChanged(KEY);
  };
  const st = stories.find((x) => x.id === activeId);
  if (!st) return null;

  const update = (patch: Partial<Story>) => save(stories.map((x) => (x.id === st.id ? { ...x, ...patch } : x)));
  const add = () => { const n = newStory(); save([n, ...stories]); setActiveId(n.id); };
  const remove = () => {
    const rest = stories.filter((x) => x.id !== st.id);
    const list = rest.length ? rest : [newStory()];
    save(list);
    setActiveId(list[0].id);
  };

  const total = words(st.s) + words(st.t) + words(st.a) + words(st.r);
  const secs = Math.round((total / WPM) * 60);
  const tips = checks(st);
  const fullText = `${st.question}\n\nSituation: ${st.s}\n\nTask: ${st.t}\n\nAction: ${st.a}\n\nResult: ${st.r}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(fullText); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard blocked */ }
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto pb-20">
      <ToolWorkspaceHeader
        title="STAR Answer Builder"
        description="Structure behavioural answers as Situation, Task, Action and Result. Word counts and a speaking-time estimate keep each story around one to two minutes. Stories are saved in this browser."
        icon={<MessageSquareQuote className="w-5 h-5" />}
      />

      <div className="grid lg:grid-cols-[240px_1fr_280px] gap-6">
        <nav aria-label="Your stories" className="flex flex-col gap-2">
          <button type="button" onClick={add} className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-hair text-[13px] font-semibold text-body hover:text-ink ${focusRing}`}>
            <Plus aria-hidden="true" className="w-4 h-4" /> New story
          </button>
          {stories.map((x) => (
            <button key={x.id} type="button" onClick={() => setActiveId(x.id)} aria-current={x.id === st.id ? "true" : undefined}
              className={`text-left px-3 py-2 rounded-lg text-[13px] border ${x.id === st.id ? "border-accent bg-accent-soft/40 text-ink" : "border-transparent text-body hover:bg-paper-2"} ${focusRing}`}>
              <span className="line-clamp-2">{x.question || "Untitled story"}</span>
            </button>
          ))}
        </nav>

        <section aria-label="Story editor" className="p-6 rounded-xl border border-hair bg-card flex flex-col gap-5">
          <label className="flex flex-col gap-1.5 text-[13px]">
            <span className="font-semibold text-ink">Question</span>
            <input list="star-prompts" value={st.question} onChange={(e) => update({ question: e.target.value })}
              className={`px-3 py-2 rounded-lg border border-hair bg-card text-[14px] ${focusRing}`} />
            <datalist id="star-prompts">{PROMPTS.map((p) => <option key={p} value={p} />)}</datalist>
          </label>
          {PARTS.map((p) => {
            const n = words(st[p.key]);
            const ok = n >= p.target[0] && n <= p.target[1];
            return (
              <label key={p.key} className="flex flex-col gap-1.5 text-[13px]">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-ink">{p.label}</span>
                  <span className={`tabular-nums text-[12px] ${n === 0 ? "text-mute" : ok ? "text-note" : "text-warning"}`}>
                    {n} words · aim {p.target[0]}–{p.target[1]}
                  </span>
                </span>
                <span className="text-[12px] text-mute">{p.hint}</span>
                <textarea value={st[p.key]} onChange={(e) => update({ [p.key]: e.target.value } as Partial<Story>)} rows={p.key === "a" ? 6 : 3}
                  className={`px-3 py-2 rounded-lg border border-hair bg-card text-[14px] leading-relaxed resize-y ${focusRing}`} />
              </label>
            );
          })}
        </section>

        <aside aria-label="Story check" className="flex flex-col gap-4">
          <div className="p-5 rounded-xl border border-hair bg-card flex flex-col gap-1">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-mute">Speaking time</h2>
            <p className="text-3xl font-bold tabular-nums text-ink">{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</p>
            <p className="text-[12px] text-mute">{total} words at about {WPM} words per minute. Aim for 1:00 to 2:00.</p>
          </div>
          <div className="p-5 rounded-xl border border-hair bg-card flex flex-col gap-2">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-mute">Checks</h2>
            {total === 0 ? (
              <p className="text-[13px] text-body">Start writing to see feedback.</p>
            ) : tips.length ? (
              <ul className="flex flex-col gap-2 text-[13px] text-body list-disc pl-4">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
            ) : (
              <p className="text-[13px] text-note font-medium">Structure looks balanced. Practise saying it aloud.</p>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={copy} className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent text-paper text-[13px] font-semibold hover:bg-accent-ink ${focusRing}`}>
              {copied ? <><Check aria-hidden="true" className="w-4 h-4" /> Copied</> : <><Copy aria-hidden="true" className="w-4 h-4" /> Copy story</>}
            </button>
            <button type="button" onClick={remove} aria-label="Delete this story" className={`px-3 py-2 rounded-lg border border-hair text-body hover:text-danger ${focusRing}`}>
              <Trash2 aria-hidden="true" className="w-4 h-4" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
