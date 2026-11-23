"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { LabShell, cardCls, focusRing, inputCls } from "@/components/labs/LabShell";
import { PagingAlgorithm, simulatePaging } from "@/lib/labs/paging";

const ALGOS: { id: PagingAlgorithm; label: string }[] = [{ id: "FIFO", label: "FIFO" }, { id: "LRU", label: "LRU" }, { id: "OPT", label: "Optimal" }];
const PRESETS = { "Textbook string": "7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1", "Belady's anomaly": "1 2 3 4 1 2 5 1 2 3 4 5" };

export default function PageReplacementLab() {
  const [text, setText] = useState(PRESETS["Textbook string"]);
  const [frames, setFrames] = useState(3);
  const [algo, setAlgo] = useState<PagingAlgorithm>("LRU");

  const refs = text.split(/[\s,]+/).filter(Boolean).map(Number).filter((n) => Number.isInteger(n) && n >= 0).slice(0, 40);
  const run = useMemo(() => simulatePaging(refs, frames, algo), [text, frames, algo]); // eslint-disable-line react-hooks/exhaustive-deps
  const table = useMemo(() => ALGOS.map((a) => ({
    ...a, byFrames: [1, 2, 3, 4, 5, 6].map((f) => simulatePaging(refs, f, a.id).faults),
  })), [text]); // eslint-disable-line react-hooks/exhaustive-deps
  const anomaly = table.find((t) => t.id === "FIFO")!.byFrames.some((v, i, a) => i > 0 && v > a[i - 1]);

  return (
    <LabShell slug="page-replacement">
      <section className={cardCls}>
        <div className="grid sm:grid-cols-[1fr_auto] gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[var(--ink)]">
            Reference string (up to 40 page numbers)
            <input value={text} onChange={(e) => setText(e.target.value)} className={`${inputCls} font-mono`} spellCheck={false} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[var(--ink)]">
            Frames
            <input type="number" min={1} max={8} value={frames} onChange={(e) => setFrames(Math.min(8, Math.max(1, Number(e.target.value) || 1)))} className={`${inputCls} w-24`} />
          </label>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {ALGOS.map((a) => (
            <button key={a.id} type="button" aria-pressed={algo === a.id} onClick={() => setAlgo(a.id)}
              className={clsx("px-3 py-1.5 rounded-lg border text-[13px] font-medium", focusRing,
                algo === a.id ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--ink)] hover:border-[var(--accent)]")}>
              {a.label}
            </button>
          ))}
          {Object.entries(PRESETS).map(([k, v]) => (
            <button key={k} type="button" onClick={() => setText(v)} className={`px-3 py-1.5 rounded-lg border border-[var(--border)] text-[13px] text-[var(--ink-secondary)] hover:border-[var(--accent)] ${focusRing}`}>Load: {k}</button>
          ))}
        </div>
      </section>

      <section className={cardCls}>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">Step by step</h2>
          <p className="text-[14px] text-[var(--ink)] tabular-nums">
            <strong>{run.faults}</strong> faults, {refs.length - run.faults} hits
            {refs.length > 0 && <> · fault rate {((100 * run.faults) / refs.length).toFixed(0)}%</>}
          </p>
        </div>
        <div className="overflow-x-auto" tabIndex={0} aria-label="Frame contents after each reference">
          <table className="text-center text-[13px] font-mono tabular-nums border-collapse">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left text-[11px] font-sans font-semibold text-[var(--ink-tertiary)]">Ref</th>
                {run.steps.map((s, i) => <th key={i} className="px-2 py-1 font-bold text-[var(--ink)]">{s.page}</th>)}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: frames }, (_, f) => (
                <tr key={f}>
                  <td className="px-2 py-1 text-left text-[11px] font-sans text-[var(--ink-tertiary)]">Frame {f + 1}</td>
                  {run.steps.map((s, i) => (
                    <td key={i} className={clsx("px-2 py-1 border border-[var(--border)]",
                      s.fault && s.frames[f] === s.page ? "bg-[var(--accent-soft)] text-[var(--ink)] font-bold" : "text-[var(--ink-secondary)]")}>
                      {s.frames[f] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-2 py-1 text-left text-[11px] font-sans text-[var(--ink-tertiary)]">Result</td>
                {run.steps.map((s, i) => (
                  <td key={i} className={clsx("px-2 py-1 text-[11px] font-sans font-semibold", s.fault ? "text-[var(--error)]" : "text-[var(--success)]")}>{s.fault ? "Fault" : "Hit"}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-[var(--ink-tertiary)] mt-2">Highlighted cells show where a page was loaded on a fault.</p>
      </section>

      <section className={cardCls}>
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)] mb-3">Faults by number of frames</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] tabular-nums">
            <thead><tr className="border-b border-[var(--border)] text-[var(--ink-secondary)]"><th className="py-2 pr-4 font-semibold">Algorithm</th>{[1, 2, 3, 4, 5, 6].map((f) => <th key={f} className="py-2 pr-4 font-semibold">{f}</th>)}</tr></thead>
            <tbody>
              {table.map((t) => (
                <tr key={t.id} className="border-b border-[var(--border)]/60">
                  <td className="py-2 pr-4 font-medium text-[var(--ink)]">{t.label}</td>
                  {t.byFrames.map((v, i) => (
                    <td key={i} className={clsx("py-2 pr-4 font-mono", t.id === "FIFO" && i > 0 && v > t.byFrames[i - 1] ? "text-[var(--error)] font-bold" : "text-[var(--ink)]")}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={clsx("text-[13px] mt-3", anomaly ? "text-[var(--error)] font-medium" : "text-[var(--ink-secondary)]")}>
          {anomaly
            ? "Belady's anomaly: FIFO has more faults with more frames on this string (shown in red). LRU and Optimal never do this."
            : "More frames never increase faults for LRU and Optimal. Load the Belady preset to see FIFO break that rule."}
        </p>
      </section>
    </LabShell>
  );
}
