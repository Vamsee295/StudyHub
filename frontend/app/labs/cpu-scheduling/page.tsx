"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { LabShell, cardCls, focusRing, inputCls } from "@/components/labs/LabShell";
import { Algorithm, Proc, schedule } from "@/lib/labs/scheduling";

const ALGOS: { id: Algorithm; label: string }[] = [
  { id: "FCFS", label: "FCFS" }, { id: "SJF", label: "SJF" }, { id: "SRTF", label: "SRTF" },
  { id: "RR", label: "Round Robin" }, { id: "PRIORITY", label: "Priority" }, { id: "PRIORITY_P", label: "Priority (preemptive)" },
];
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#0ea5e9", "#a855f7", "#14b8a6", "#f97316"];
const PRESETS: Record<string, Proc[]> = {
  "Convoy effect": [{ id: "P1", arrival: 0, burst: 24, priority: 1 }, { id: "P2", arrival: 0, burst: 3, priority: 2 }, { id: "P3", arrival: 0, burst: 3, priority: 3 }],
  "Staggered arrivals": [{ id: "P1", arrival: 0, burst: 8, priority: 3 }, { id: "P2", arrival: 1, burst: 4, priority: 1 }, { id: "P3", arrival: 2, burst: 9, priority: 4 }, { id: "P4", arrival: 3, burst: 5, priority: 2 }],
};

export default function CpuSchedulingLab() {
  const [procs, setProcs] = useState<Proc[]>(PRESETS["Staggered arrivals"]);
  const [algo, setAlgo] = useState<Algorithm>("SRTF");
  const [quantum, setQuantum] = useState(2);

  const valid = procs.length > 0 && procs.every((p) => p.burst > 0 && p.arrival >= 0);
  const result = useMemo(() => (valid ? schedule(procs, algo, Math.max(1, quantum)) : null), [procs, algo, quantum, valid]);
  const comparison = useMemo(() => (valid ? ALGOS.map((a) => ({ ...a, avg: schedule(procs, a.id, Math.max(1, quantum)).avgWaiting })) : []), [procs, quantum, valid]);
  const color = (id: string) => COLORS[procs.findIndex((p) => p.id === id) % COLORS.length];
  const total = result?.gantt.at(-1)?.end ?? 1;

  const update = (i: number, field: keyof Proc, v: string) =>
    setProcs((ps) => ps.map((p, k) => (k === i ? { ...p, [field]: field === "id" ? v : Math.max(0, Math.floor(Number(v) || 0)) } : p)));

  return (
    <LabShell slug="cpu-scheduling">
      <section className={cardCls}>
        <div className="flex flex-wrap items-center gap-2 mb-4" role="group" aria-label="Scheduling algorithm">
          {ALGOS.map((a) => (
            <button key={a.id} type="button" aria-pressed={algo === a.id} onClick={() => setAlgo(a.id)}
              className={clsx("px-3 py-1.5 rounded-lg border text-[13px] font-medium", focusRing,
                algo === a.id ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--ink)] hover:border-[var(--accent)]")}>
              {a.label}
            </button>
          ))}
          {algo === "RR" && (
            <label className="flex items-center gap-2 text-[13px] text-[var(--ink)] ml-2">
              Quantum
              <input type="number" min={1} value={quantum} onChange={(e) => setQuantum(Math.max(1, Number(e.target.value) || 1))} className={`${inputCls} w-20`} />
            </label>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead><tr className="text-[var(--ink-secondary)] text-[12px] uppercase tracking-wider">
              <th className="py-1.5 pr-2 font-semibold">Process</th><th className="py-1.5 pr-2 font-semibold">Arrival</th><th className="py-1.5 pr-2 font-semibold">Burst</th><th className="py-1.5 pr-2 font-semibold">Priority (low = high)</th><th className="py-1.5"><span className="sr-only">Remove</span></th>
            </tr></thead>
            <tbody>
              {procs.map((p, i) => (
                <tr key={i}>
                  <td className="py-1 pr-2"><input aria-label={`Process ${i + 1} name`} value={p.id} onChange={(e) => update(i, "id", e.target.value)} className={`${inputCls} w-20`} /></td>
                  <td className="py-1 pr-2"><input aria-label={`${p.id} arrival time`} type="number" min={0} value={p.arrival} onChange={(e) => update(i, "arrival", e.target.value)} className={`${inputCls} w-20`} /></td>
                  <td className="py-1 pr-2"><input aria-label={`${p.id} burst time`} type="number" min={1} value={p.burst} onChange={(e) => update(i, "burst", e.target.value)} className={`${inputCls} w-20`} /></td>
                  <td className="py-1 pr-2"><input aria-label={`${p.id} priority`} type="number" min={0} value={p.priority} onChange={(e) => update(i, "priority", e.target.value)} className={`${inputCls} w-20`} /></td>
                  <td className="py-1"><button type="button" aria-label={`Remove ${p.id}`} onClick={() => setProcs((ps) => ps.filter((_, k) => k !== i))} className={`p-2 rounded-lg text-[var(--ink-tertiary)] hover:text-[var(--error)] ${focusRing}`}><Trash2 aria-hidden="true" className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button type="button" disabled={procs.length >= 8}
            onClick={() => setProcs((ps) => [...ps, { id: `P${ps.length + 1}`, arrival: 0, burst: 3, priority: ps.length + 1 }])}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[13px] text-[var(--ink)] hover:border-[var(--accent)] disabled:opacity-40 ${focusRing}`}>
            <Plus aria-hidden="true" className="w-4 h-4" /> Add process
          </button>
          {Object.keys(PRESETS).map((k) => (
            <button key={k} type="button" onClick={() => setProcs(PRESETS[k])} className={`px-3 py-1.5 rounded-lg border border-[var(--border)] text-[13px] text-[var(--ink-secondary)] hover:border-[var(--accent)] ${focusRing}`}>Load: {k}</button>
          ))}
        </div>
        {!valid && <p className="text-[13px] text-[var(--error)] mt-2">Add at least one process, and give every process a burst of 1 or more.</p>}
      </section>

      {result && (
        <>
          <section className={cardCls}>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)] mb-3">Gantt chart</h2>
            <div className="flex w-full h-12 rounded-lg overflow-hidden border border-[var(--border)]" role="img"
              aria-label={result.gantt.map((s) => `${s.id ?? "idle"} from ${s.start} to ${s.end}`).join(", ")}>
              {result.gantt.map((s, i) => (
                <div key={i} className="flex items-center justify-center text-[12px] font-mono font-bold text-white border-r border-white/40 last:border-r-0"
                  style={{ width: `${((s.end - s.start) / total) * 100}%`, background: s.id ? color(s.id) : "var(--surface-subdued)", color: s.id ? "white" : "var(--ink-tertiary)" }}>
                  {(s.end - s.start) / total > 0.04 ? s.id ?? "idle" : ""}
                </div>
              ))}
            </div>
            <div className="relative h-5 mt-1 text-[11px] font-mono text-[var(--ink-tertiary)] tabular-nums">
              {[0, ...result.gantt.map((s) => s.end)].map((t, i) => (
                <span key={i} className="absolute -translate-x-1/2" style={{ left: `${(t / total) * 100}%` }}>{t}</span>
              ))}
            </div>
          </section>

          <section className={cardCls}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] tabular-nums">
                <thead><tr className="border-b border-[var(--border)] text-[var(--ink-secondary)]">
                  {["Process", "Arrival", "Burst", "Completion", "Turnaround", "Waiting", "Response"].map((h) => <th key={h} className="py-2 pr-3 font-semibold">{h}</th>)}
                </tr></thead>
                <tbody>
                  {result.procs.map((p) => (
                    <tr key={p.id} className="border-b border-[var(--border)]/60">
                      <td className="py-2 pr-3 font-mono font-bold" style={{ color: color(p.id) }}>{p.id}</td>
                      <td className="py-2 pr-3">{p.arrival}</td><td className="py-2 pr-3">{p.burst}</td><td className="py-2 pr-3">{p.completion}</td>
                      <td className="py-2 pr-3">{p.turnaround}</td><td className="py-2 pr-3">{p.waiting}</td><td className="py-2 pr-3">{p.response}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold text-[var(--ink)]">
                    <td className="py-2 pr-3" colSpan={4}>Average</td>
                    <td className="py-2 pr-3">{result.avgTurnaround.toFixed(2)}</td><td className="py-2 pr-3">{result.avgWaiting.toFixed(2)}</td><td className="py-2 pr-3">{result.avgResponse.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[12px] text-[var(--ink-tertiary)] mt-2">Turnaround = completion − arrival. Waiting = turnaround − burst. Response = first run − arrival.</p>
          </section>

          <section className={cardCls}>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)] mb-3">Average waiting time by algorithm</h2>
            <ul className="flex flex-col gap-2">
              {comparison.map((c) => {
                const max = Math.max(...comparison.map((x) => x.avg), 1);
                return (
                  <li key={c.id} className="flex items-center gap-3 text-[13px]">
                    <span className={clsx("w-44 truncate", c.id === algo ? "font-bold text-[var(--ink)]" : "text-[var(--ink-secondary)]")}>{c.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-[var(--border-strong)]/30 overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(c.avg / max) * 100}%` }} />
                    </div>
                    <span className="w-14 text-right font-mono tabular-nums text-[var(--ink)]">{c.avg.toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </LabShell>
  );
}
