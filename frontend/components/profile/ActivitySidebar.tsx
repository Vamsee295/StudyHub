"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Activity, ArrowRight } from "lucide-react";
import { ActivityHeatmap } from "@/components/profile/ActivityHeatmap";
import { problems } from "@/lib/problems/problemRegistry";
import { problemStorage } from "@/lib/problems/problemStorage";
import { getSubmissions, SUBMISSIONS_EVENT, type Submission } from "@/lib/problems/submissions";
import { SYNCED_EVENT } from "@/lib/sync/userSync";

const VERDICT: Record<string, [string, string]> = {
  accepted: ["Accepted", "text-note"],
  wrong_answer: ["Wrong answer", "text-danger"],
  compile_error: ["Compile error", "text-warning"],
  runtime_error: ["Runtime error", "text-warning"],
  time_limit: ["Time limit", "text-warning"],
};
const LANG: Record<string, string> = { java: "Java", python: "Python", cpp: "C++" };

function ago(t: number) {
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function read() {
  const statuses = problemStorage.getAllStatuses();
  const solved = { Easy: 0, Medium: 0, Hard: 0 } as Record<string, number>;
  const total = { Easy: 0, Medium: 0, Hard: 0 } as Record<string, number>;
  for (const p of Object.values(problems)) {
    total[p.difficulty]++;
    if (statuses[p.id] === "solved") solved[p.difficulty]++;
  }
  const subs = getSubmissions();
  return { solved, total, recent: subs.slice(0, 8), count: subs.length, accepted: subs.filter((s) => s.v === "accepted").length };
}

/** Right-hand column on every profile page: the heatmap, solve counts and the latest submissions. */
export function ActivitySidebar() {
  // client-only render (AppLayout), so local data is readable on first render
  const [d, setD] = useState(read);
  useEffect(() => {
    const refresh = () => setD(read());
    for (const e of [SUBMISSIONS_EVENT, SYNCED_EVENT, "studyhub:problem_status_updated"]) window.addEventListener(e, refresh);
    return () => {
      for (const e of [SUBMISSIONS_EVENT, SYNCED_EVENT, "studyhub:problem_status_updated"]) window.removeEventListener(e, refresh);
    };
  }, []);

  const levels: [string, string][] = [
    ["Easy", "bg-note"],
    ["Medium", "bg-gold"],
    ["Hard", "bg-accent"],
  ];

  return (
    <aside aria-labelledby="activity-sidebar" className="flex flex-col gap-5 lg:sticky lg:top-6">
      <h2 id="activity-sidebar" className="eyebrow flex items-center gap-1.5">
        <Activity className="size-3.5" aria-hidden /> Activity
      </h2>

      <section className="rounded-2xl border-[1.5px] border-hair bg-card p-4">
        <ActivityHeatmap weeks={18} compact />
      </section>

      <section aria-label="Problems solved by level" className="rounded-2xl border-[1.5px] border-hair bg-card p-4">
        <p className="mb-3 flex items-baseline justify-between">
          <span className="text-[14px] font-semibold">Solved</span>
          <span className="font-mono text-[12px] text-mute tabular-nums">
            {d.solved.Easy + d.solved.Medium + d.solved.Hard}/{d.total.Easy + d.total.Medium + d.total.Hard}
          </span>
        </p>
        <ul className="space-y-2.5">
          {levels.map(([lv, color]) => (
            <li key={lv}>
              <div className="mb-1 flex justify-between text-[12.5px]">
                <span className="text-body">{lv}</span>
                <span className="font-mono text-mute tabular-nums">
                  {d.solved[lv]}/{d.total[lv]}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-hair">
                <div className={clsx("h-full rounded-full", color)} style={{ width: `${d.total[lv] ? (100 * d.solved[lv]) / d.total[lv] : 0}%` }} />
              </div>
            </li>
          ))}
        </ul>
        {d.count > 0 && (
          <p className="mt-3 font-mono text-[11px] text-mute">
            {d.count} submissions · {Math.round((100 * d.accepted) / d.count)}% accepted
          </p>
        )}
      </section>

      <section aria-labelledby="recent-subs" className="rounded-2xl border-[1.5px] border-hair bg-card p-4">
        <h3 id="recent-subs" className="mb-2 text-[14px] font-semibold">
          Recent submissions
        </h3>
        {d.recent.length === 0 ? (
          <p className="text-[13px] leading-relaxed text-mute">
            Nothing yet. Submit a solution on any problem and it shows up here and on the heatmap.
          </p>
        ) : (
          <ul className="divide-y divide-hair">
            {d.recent.map((s: Submission) => {
              const [label, tone] = VERDICT[s.v] ?? [s.v, "text-mute"];
              return (
                <li key={`${s.at}-${s.id}`}>
                  <Link href={`/practice/problems/${s.id}`} className="group block py-2">
                    <span className="block truncate text-[13.5px] font-semibold group-hover:text-accent-ink">{problems[s.id]?.title ?? s.id}</span>
                    <span className="flex gap-2 font-mono text-[11px] text-mute">
                      <span className={tone}>{label}</span>
                      {s.n ? <span className="tabular-nums">{s.p}/{s.n}</span> : null}
                      <span>{LANG[s.l] ?? s.l}</span>
                      <span className="ml-auto">{ago(s.at)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        <Link href="/practice/submissions" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-accent-ink hover:underline">
          All submissions with code <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </section>
    </aside>
  );
}
