"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { LabShell, cardCls, focusRing } from "@/components/labs/LabShell";

const OPS_PER_SEC = 1e8;
const CLASSES = [
  { label: "O(1)", f: () => 1, color: "#0ea5e9" },
  { label: "O(log n)", f: (n: number) => Math.max(1, Math.log2(n)), color: "#10b981" },
  { label: "O(n)", f: (n: number) => n, color: "#6366f1" },
  { label: "O(n log n)", f: (n: number) => n * Math.max(1, Math.log2(n)), color: "#f59e0b" },
  { label: "O(n²)", f: (n: number) => n * n, color: "#ef4444" },
  { label: "O(2ⁿ)", f: (n: number) => 2 ** Math.min(n, 1024), color: "#a855f7" },
];

const fmtOps = (x: number) => (x >= 1e15 ? x.toExponential(1) : Math.round(x).toLocaleString());
function fmtTime(sec: number) {
  if (!isFinite(sec) || sec > 3.15e9) return "longer than a century";
  if (sec < 1e-6) return "under a microsecond";
  if (sec < 1e-3) return `${(sec * 1e6).toFixed(0)} µs`;
  if (sec < 1) return `${(sec * 1e3).toFixed(0)} ms`;
  if (sec < 120) return `${sec.toFixed(1)} s`;
  if (sec < 7200) return `${(sec / 60).toFixed(0)} min`;
  if (sec < 172800) return `${(sec / 3600).toFixed(0)} hours`;
  if (sec < 3.15e7) return `${(sec / 86400).toFixed(0)} days`;
  return `${(sec / 3.15e7).toFixed(0)} years`;
}

export default function BigOLab() {
  const [exp, setExp] = useState(3); // n = 10^exp
  const [shown, setShown] = useState(() => new Set(CLASSES.map((c) => c.label)));
  const n = Math.round(10 ** exp);

  // Chart: x from 1 to n (linear), y on a log10 scale capped at 10^12.
  const W = 640, H = 300, PAD = 40, YMAX = 12;
  const pts = 60;
  const xs = Array.from({ length: pts }, (_, i) => 1 + ((n - 1) * i) / (pts - 1));
  const y = (v: number) => H - PAD - (Math.min(YMAX, Math.log10(Math.max(1, v))) / YMAX) * (H - 2 * PAD);
  const x = (v: number) => PAD + ((v - 1) / Math.max(1, n - 1)) * (W - 2 * PAD);

  return (
    <LabShell slug="big-o">
      <section className={cardCls}>
        <label htmlFor="n" className="text-[13px] font-medium text-ink">
          Input size n = <span className="font-mono tabular-nums">{n.toLocaleString()}</span>
        </label>
        <input id="n" type="range" min={0.3} max={7} step={0.1} value={exp} onChange={(e) => setExp(Number(e.target.value))}
          className="w-full mt-2 accent-accent" aria-valuetext={`n equals ${n}`} />
        <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label="Complexity classes to show">
          {CLASSES.map((c) => {
            const on = shown.has(c.label);
            return (
              <button key={c.label} type="button" aria-pressed={on}
                onClick={() => setShown((s) => { const t = new Set(s); if (on) t.delete(c.label); else t.add(c.label); return t; })}
                className={clsx("px-2.5 py-1 rounded-full border text-[12px] font-mono", focusRing, on ? "text-ink" : "text-mute opacity-60")}
                style={{ borderColor: on ? c.color : undefined }}>
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: c.color }} aria-hidden="true" />{c.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className={cardCls}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Operation counts for each complexity class, log scale">
          {[0, 3, 6, 9, 12].map((e) => (
            <g key={e}>
              <line x1={PAD} x2={W - PAD} y1={y(10 ** e)} y2={y(10 ** e)} stroke="var(--hair)" strokeDasharray="3 3" />
              <text x={PAD - 6} y={y(10 ** e) + 4} textAnchor="end" fontSize="10" fill="var(--mute)">10^{e}</text>
            </g>
          ))}
          <text x={W - PAD} y={H - 10} textAnchor="end" fontSize="10" fill="var(--mute)">n = {n.toLocaleString()}</text>
          <text x={PAD} y={H - 10} fontSize="10" fill="var(--mute)">1</text>
          {CLASSES.filter((c) => shown.has(c.label)).map((c) => (
            <polyline key={c.label} fill="none" stroke={c.color} strokeWidth="2.5" strokeLinejoin="round"
              points={xs.map((v) => `${x(v).toFixed(1)},${y(c.f(v)).toFixed(1)}`).join(" ")} />
          ))}
        </svg>
        <p className="text-[12px] text-mute mt-2">The y-axis is logarithmic: each gridline is 1,000 times the one below. Lines are capped at 10¹².</p>
      </section>

      <section className={cardCls}>
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-ink mb-3">At n = {n.toLocaleString()}, assuming 10⁸ operations per second</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead><tr className="border-b border-hair text-body"><th className="py-2 pr-4 font-semibold">Class</th><th className="py-2 pr-4 font-semibold">Operations</th><th className="py-2 pr-4 font-semibold">Time</th><th className="py-2 font-semibold">Fits a 1 s limit?</th></tr></thead>
            <tbody>
              {CLASSES.map((c) => {
                const ops = c.f(n);
                const sec = ops / OPS_PER_SEC;
                return (
                  <tr key={c.label} className="border-b border-hair/60">
                    <td className="py-2 pr-4 font-mono" style={{ color: c.color }}>{c.label}</td>
                    <td className="py-2 pr-4 font-mono tabular-nums text-ink">{n > 1024 && c.label === "O(2ⁿ)" ? "astronomical" : fmtOps(ops)}</td>
                    <td className="py-2 pr-4 tabular-nums text-ink">{fmtTime(sec)}</td>
                    <td className={clsx("py-2 font-medium", sec <= 1 ? "text-note" : "text-danger")}>{sec <= 1 ? "Yes" : "No"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-body mt-3">
          Rule of thumb from the constraints: n ≤ 20 allows O(2ⁿ), n ≤ 5,000 allows O(n²), and n up to 10⁶ needs O(n log n) or better.
        </p>
      </section>
    </LabShell>
  );
}
