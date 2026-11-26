"use client";

import { useState } from "react";
import { Calculator, ExternalLink } from "lucide-react";
import { ToolWorkspaceHeader } from "@/components/tools/shared/ToolWorkspaceHeader";
import { AnimatedNumber, MeterBar } from "@/components/tools/shared/ResultMotion";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

// Conventions on a 10-point scale. None is universal: the rule printed on your own grade card or
// transcript is the one that counts. Sources were checked in November 2026.
const FORMULAS = [
  { id: "x95", label: "CGPA × 9.5", note: "CBSE's indicative conversion for Classes IX and X; many institutions also use it.", m: 9.5, c: 0 },
  { id: "minus075", label: "(CGPA − 0.75) × 10", note: "Widely attributed to AICTE and used by several engineering universities; we couldn't locate the primary AICTE notice, so confirm with your university.", m: 10, c: -7.5 },
  { id: "x10", label: "CGPA × 10", note: "A notional conversion some universities state in their own regulations.", m: 10, c: 0 },
  { id: "custom", label: "Custom", note: "Use the multiplier and offset printed on your grade card.", m: 10, c: 0 },
] as const;

const SOURCES = [
  { title: "Shiksha: CBSE CGPA to percentage (explains the 9.5 factor)", url: "https://www.shiksha.com/boards/articles/cbse-cgpa-to-percentage-calculator-how-to-convert-cbse-10th-12th-cgpa-into-percentage-blogId-170395" },
  { title: "IISc: CGPA to percentage conversion notification (example of an institution's own rule)", url: "https://www.iisc.ac.in/wp-content/uploads/2021/10/IISc-CGPA-Percentage-Conversion-notification-signed.pdf" },
  { title: "NIT Tiruchirappalli: certificate of CGPA to percentage conversion", url: "https://www.nitt.edu/home/academics/transcript_section/3.%20Certificate%20of%20CGPA%20to%20percentage%20conversion.pdf" },
];

export default function CgpaConverterPage() {
  const [cgpa, setCgpa] = useState("8.2");
  const [formula, setFormula] = useState<(typeof FORMULAS)[number]["id"]>("x95");
  const [m, setM] = useState("9.5");
  const [c, setC] = useState("0");

  const value = Number(cgpa);
  const valid = cgpa.trim() !== "" && Number.isFinite(value) && value >= 0 && value <= 10;
  const f = FORMULAS.find((x) => x.id === formula)!;
  const mult = formula === "custom" ? Number(m) : f.m;
  const offset = formula === "custom" ? Number(c) : f.c;
  const pct = valid && Number.isFinite(mult) && Number.isFinite(offset) ? Math.min(100, Math.max(0, value * mult + offset)) : null;

  return (
    <div className="w-full max-w-[900px] mx-auto pb-20">
      <ToolWorkspaceHeader
        title="CGPA to Percentage"
        description="Convert a 10-point CGPA to a percentage with a common convention or your university's own formula. Placement forms often ask for a percentage, so use the rule your institution states."
        icon={<Calculator className="w-5 h-5" />}
      />

      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <section aria-label="Converter" className="p-6 rounded-xl border-[1.5px] border-hair bg-card flex flex-col gap-5">
          <label className="flex flex-col gap-1.5 text-[13px] max-w-[200px]">
            <span className="font-semibold text-ink">Your CGPA (out of 10)</span>
            <input inputMode="decimal" value={cgpa} onChange={(e) => setCgpa(e.target.value)} aria-invalid={!valid}
              className={`px-3 py-2 rounded-lg border bg-card text-[18px] tabular-nums ${valid ? "border-hair" : "border-danger"} ${focusRing}`} />
            {!valid && <span className="text-[12px] text-danger">Enter a number between 0 and 10.</span>}
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-[13px] font-semibold text-ink mb-1">Formula</legend>
            {FORMULAS.map((x) => (
              <label key={x.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${formula === x.id ? "border-accent bg-accent-soft/40" : "border-hair"}`}>
                <input type="radio" name="formula" checked={formula === x.id} onChange={() => setFormula(x.id)} className="mt-1" />
                <span>
                  <span className="block text-[14px] font-semibold text-ink font-mono">{x.label}</span>
                  <span className="block text-[12.5px] text-body">{x.note}</span>
                </span>
              </label>
            ))}
          </fieldset>

          {formula === "custom" && (
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <label className="flex flex-col gap-1.5 text-[13px]">
                <span className="font-semibold text-ink">Multiply by</span>
                <input inputMode="decimal" value={m} onChange={(e) => setM(e.target.value)} className={`px-3 py-2 rounded-lg border-[1.5px] border-hair bg-card tabular-nums ${focusRing}`} />
              </label>
              <label className="flex flex-col gap-1.5 text-[13px]">
                <span className="font-semibold text-ink">Then add</span>
                <input inputMode="decimal" value={c} onChange={(e) => setC(e.target.value)} className={`px-3 py-2 rounded-lg border-[1.5px] border-hair bg-card tabular-nums ${focusRing}`} />
              </label>
            </div>
          )}
        </section>

        <aside aria-label="Result" className="brut flex flex-col gap-4 self-start rounded-2xl bg-card p-6">
          <h2 className="eyebrow">Equivalent percentage</h2>
          {/* the screen-reader text updates instantly; the visible number tweens */}
          <p className="sr-only" aria-live="polite">{pct === null ? "No result" : `${pct.toFixed(2)} percent`}</p>
          <p className="display text-[64px] leading-none tabular-nums text-ink" aria-hidden>
            {pct === null ? "—" : (
              <>
                <AnimatedNumber value={pct} decimals={2} />
                <span className="text-[32px]">%</span>
              </>
            )}
          </p>
          {pct !== null && (
            <>
              <div>
                <MeterBar pct={pct} className="h-3" />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-mute" aria-hidden>
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
              <p className="font-mono text-[12.5px] tabular-nums text-body">
                {value} × {mult}{offset ? ` ${offset < 0 ? "−" : "+"} ${Math.abs(offset)}` : ""} = {pct.toFixed(2)}%
              </p>
            </>
          )}
          <div className="border-t-[1.5px] border-hair pt-4">
            <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-mute">Same CGPA, each convention</p>
            <ul className="space-y-3">
              {FORMULAS.filter((x) => x.id !== "custom").map((x) => {
                const p = Math.min(100, Math.max(0, value * x.m + x.c));
                const active = formula === x.id;
                return (
                  <li key={x.id}>
                    <div className="mb-1 flex items-baseline justify-between gap-3 text-[12.5px]">
                      <span className={`font-mono ${active ? "font-bold text-ink" : "text-body"}`}>{x.label}</span>
                      <span className="font-semibold tabular-nums text-ink">{valid ? <><AnimatedNumber value={p} decimals={2} />%</> : "—"}</span>
                    </div>
                    <MeterBar pct={valid ? p : 0} className="h-1.5" color={active ? "var(--accent)" : "var(--mute)"} />
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>

      <section aria-labelledby="cgpa-sources" className="mt-8 flex flex-col gap-2">
        <h2 id="cgpa-sources" className="text-[12px] font-bold uppercase tracking-wider text-ink">Which formula applies to me?</h2>
        <p className="text-[13.5px] text-body max-w-3xl">
          The conversion printed on your grade card, transcript or university regulations always takes priority. If your university issues a conversion certificate, quote that figure on placement forms. These pages show how institutions state their rules:
        </p>
        <ul className="flex flex-col gap-1">
          {SOURCES.map((s) => (
            <li key={s.url} className="text-[13px]">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 text-accent-ink hover:underline rounded ${focusRing}`}>
                {s.title} <ExternalLink aria-hidden="true" className="w-3 h-3" /><span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
