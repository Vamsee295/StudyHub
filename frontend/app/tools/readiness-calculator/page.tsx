"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gauge } from "lucide-react";
import { ToolWorkspaceHeader } from "@/components/tools/shared/ToolWorkspaceHeader";
import { AnimatedNumber, MeterBar, ScoreRing } from "@/components/tools/shared/ResultMotion";
import { overallReadiness, subjectReadiness, SubjectReadiness } from "@/lib/tools/readiness";
import { markChanged, SYNCED_EVENT } from "@/lib/sync/userSync";

const KEY = "studyhub_readiness_subjects_v1";
const DEFAULT = ["dsa", "oop", "dbms", "os", "computer-networks", "sql", "quantitative-aptitude", "logical-reasoning", "verbal-ability"];
const pct = (x: number | null) => (x === null ? "—" : `${Math.round(x * 100)}%`);

function band(score: number) {
  if (score >= 75) return { label: "Interview ready", color: "var(--note)" };
  if (score >= 50) return { label: "Getting there", color: "var(--accent)" };
  if (score >= 25) return { label: "Early stage", color: "var(--warning)" };
  return { label: "Just starting", color: "var(--mute)" };
}

export default function ReadinessPage() {
  const [rows, setRows] = useState<SubjectReadiness[] | null>(null);
  const [selected, setSelected] = useState<string[]>(DEFAULT);

  useEffect(() => {
    const load = () => {
      setRows(subjectReadiness());
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) || "null");
        if (Array.isArray(saved) && saved.length) setSelected(saved);
      } catch { /* use defaults */ }
    };
    load();
    // Progress, tests and reviews from other devices arrive with the account sync.
    window.addEventListener(SYNCED_EVENT, load);
    return () => window.removeEventListener(SYNCED_EVENT, load);
  }, []);

  const toggle = (course: string) => {
    const next = selected.includes(course) ? selected.filter((c) => c !== course) : [...selected, course];
    setSelected(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* not persisted */ }
    markChanged(KEY);
  };

  if (!rows) return null;
  const overall = overallReadiness(rows, selected);
  const b = band(overall);
  const picked = rows.filter((r) => selected.includes(r.course)).sort((a, z) => a.score - z.score);

  return (
    <div className="w-full max-w-[1100px] mx-auto pb-20">
      <ToolWorkspaceHeader
        title="Placement Readiness"
        description="A readiness score per subject, calculated from your own lesson progress, mock test scores and review queue in this browser. Pick the subjects your target companies test."
        icon={<Gauge className="w-5 h-5" />}
      />

      <section aria-labelledby="overall" className="grid md:grid-cols-[260px_1fr] gap-6 mb-10">
        <div className="brut flex flex-col items-center gap-3 rounded-2xl bg-card p-6 text-center">
          <h2 id="overall" className="eyebrow">Overall readiness</h2>
          <p className="sr-only" aria-live="polite">{`${overall} percent, ${b.label}`}</p>
          {/* keyed on the subject set so the ring sweeps again when the selection changes */}
          <ScoreRing key={selected.join()} pct={overall} color={b.color}>
            <span aria-hidden>
              <span className="display block text-[52px] leading-none tabular-nums text-ink">
                <AnimatedNumber value={overall} fromZero duration={0.8} />
                <span className="text-[24px]">%</span>
              </span>
            </span>
          </ScoreRing>
          <p className="label-cond text-[19px]" style={{ color: b.color }}>{b.label}</p>
          <p className="text-[12px] text-mute">Across {picked.length} subject{picked.length === 1 ? "" : "s"}, weighted by lesson count</p>
        </div>
        <div className="p-6 rounded-xl border-[1.5px] border-hair bg-card flex flex-col gap-3">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-mute">How the score works</h2>
          <ul className="text-[13.5px] text-body flex flex-col gap-1.5 list-disc pl-5">
            <li><strong className="text-ink">55%</strong> lessons completed in the subject</li>
            <li><strong className="text-ink">35%</strong> your latest mock test score (counted as half your coverage until you take one)</li>
            <li><strong className="text-ink">10%</strong> review health: share of review cards that aren’t overdue</li>
          </ul>
          <p className="text-[12.5px] text-mute">It measures preparation you’ve done here, not how an interviewer will judge you. Data stays in this browser.</p>
        </div>
      </section>

      <section aria-labelledby="subjects" className="mb-10">
        <h2 id="subjects" className="text-[12px] font-bold uppercase tracking-wider text-ink mb-3">Subjects to include</h2>
        <div className="flex flex-wrap gap-2">
          {rows.map((r) => (
            <button key={r.course} type="button" onClick={() => toggle(r.course)} aria-pressed={selected.includes(r.course)}
              className={`px-3 py-1.5 rounded-full text-[13px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${selected.includes(r.course) ? "bg-accent-soft border-accent-line text-accent-ink font-semibold" : "border-hair text-body hover:text-ink"}`}>
              {r.title}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="breakdown">
        <h2 id="breakdown" className="text-[12px] font-bold uppercase tracking-wider text-ink mb-3">Breakdown, weakest first</h2>
        {picked.length === 0 ? (
          <p className="text-[14px] text-body">Select at least one subject.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border-[1.5px] border-hair bg-card">
            <table className="w-full text-[13.5px]">
              <thead className="text-left text-[11.5px] uppercase tracking-wider text-mute border-b border-hair">
                <tr>
                  <th scope="col" className="px-4 py-3">Subject</th>
                  <th scope="col" className="px-4 py-3">Score</th>
                  <th scope="col" className="px-4 py-3">Lessons</th>
                  <th scope="col" className="px-4 py-3">Latest / best test</th>
                  <th scope="col" className="px-4 py-3">Review due</th>
                  <th scope="col" className="px-4 py-3">Next step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hair">
                {picked.map((r, i) => (
                  <tr key={r.course}>
                    <th scope="row" className="px-4 py-3 text-left font-medium text-ink">
                      <Link href={`/learn/${r.course}`} className="hover:text-accent-ink rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">{r.title}</Link>
                    </th>
                    <td className="px-4 py-3 tabular-nums">
                      <span className="inline-flex items-center gap-2">
                        <MeterBar pct={r.score} color={band(r.score).color} className="h-1.5 w-20" duration={0.4} delay={Math.min(i, 10) * 0.04} />
                        <span className="font-semibold text-ink">{r.score}%</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-body">{r.completed}/{r.lessons}</td>
                    <td className="px-4 py-3 tabular-nums text-body">{r.tests ? `${pct(r.recentTest)} / ${pct(r.bestTest)}` : "No test yet"}</td>
                    <td className="px-4 py-3 tabular-nums text-body">{r.reviewTotal ? `${r.reviewDue} of ${r.reviewTotal}` : "—"}</td>
                    <td className="px-4 py-3 text-body">{r.next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
