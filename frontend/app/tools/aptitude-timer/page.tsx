"use client";

import { useEffect, useRef, useState } from "react";
import { Flag, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { ToolWorkspaceHeader } from "@/components/tools/shared/ToolWorkspaceHeader";
import { AnimatedNumber, MeterBar } from "@/components/tools/shared/ResultMotion";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const fmt = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

type Lap = { ms: number; skipped: boolean };

const paceColor = (ms: number, target: number) => (ms > 2 * target ? "var(--accent)" : ms > target ? "var(--gold)" : "var(--note)");

/** End-of-section report: the one place this tool animates (a rare moment, explaining where the time went). */
function SectionReport({ laps, target, limit, elapsed }: { laps: Lap[]; target: number; limit: number; elapsed: number }) {
  const answered = laps.filter((l) => !l.skipped);
  const used = laps.reduce((n, l) => n + l.ms, 0);
  const sorted = [...laps].map((l, i) => ({ ...l, i })).sort((a, b) => b.ms - a.ms);
  const slowest3 = sorted.slice(0, 3);
  const share = used ? Math.round((100 * slowest3.reduce((n, l) => n + l.ms, 0)) / used) : 0;
  const onPace = laps.filter((l) => l.ms <= target).length;
  const maxMs = Math.max(target * 2, ...laps.map((l) => l.ms));
  const stats: [string, number, (n: number) => string][] = [
    ["Answered", answered.length, (n) => String(Math.round(n))],
    ["Skipped", laps.length - answered.length, (n) => String(Math.round(n))],
    ["On pace", onPace, (n) => `${Math.round(n)}/${laps.length}`],
    ["Time used", Math.min(elapsed, limit) / 1000, (n) => fmt(n * 1000)],
  ];

  return (
    <section aria-labelledby="report" className="brut mt-8 rounded-2xl bg-card p-6 md:p-8">
      <p className="eyebrow">Section report</p>
      <h2 id="report" className="display mt-1 text-[32px] md:text-[40px]">Where your minutes went</h2>

      <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(([label, value, show], k) => (
          <div key={label} className="rounded-xl border-[1.5px] border-hair p-4">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">{label}</dt>
            <dd className="display mt-1 text-[36px] tabular-nums">
              <span className="sr-only">{show(value)}</span>
              <span aria-hidden>
                <AnimatedNumber value={value} format={show} fromZero duration={0.6} delay={k * 0.06} />
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-mute">
          <span>Per question</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-note" /> on pace</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-gold" /> over target</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" /> over 2× target</span>
        </div>
        <ol className="grid gap-1.5">
          {laps.map((l, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr_3.5rem] items-center gap-3 text-[13px] tabular-nums">
              <span className="text-mute">Q{i + 1}</span>
              <MeterBar
                pct={(100 * l.ms) / maxMs}
                color={paceColor(l.ms, target)}
                className="h-3"
                duration={0.4}
                delay={0.25 + Math.min(i, 30) * 0.04}
                label={`Question ${i + 1}: ${fmt(l.ms)}${l.skipped ? ", skipped" : ""}`}
              />
              <span className="text-right">
                {fmt(l.ms)}
                {l.skipped && <span className="ml-1 text-[10px] text-mute">skip</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {laps.length >= 6 && ( /* with fewer questions "the slowest three" is most of the section, so it says nothing */
        <p className="mt-6 max-w-[64ch] text-[15px] leading-relaxed text-body">
          Your three slowest questions (Q{slowest3.map((l) => l.i + 1).join(", Q")}) took <strong className="text-ink">{share}%</strong> of
          the time you spent. {share > 40 ? "In the next section, skip a question once it passes twice the target and come back if time is left." : "Your time was spread fairly evenly."}
        </p>
      )}
    </section>
  );
}

export default function AptitudeTimerPage() {
  const [questions, setQuestions] = useState(20);
  const [minutes, setMinutes] = useState(25);
  const [wantRun, setRunning] = useState(false); // the learner pressed start; the clock also stops itself when done
  const [elapsed, setElapsed] = useState(0);      // total ms
  const [lapStart, setLapStart] = useState(0);    // elapsed value when the current question began
  const [laps, setLaps] = useState<Lap[]>([]);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const last = useRef(0);

  const target = (minutes * 60_000) / Math.max(1, questions);
  const limit = minutes * 60_000;
  const done = laps.length >= questions || elapsed >= limit;
  const running = wantRun && !done;

  useEffect(() => {
    if (!running) return;
    last.current = performance.now();
    tick.current = setInterval(() => {
      const now = performance.now();
      setElapsed((e) => e + (now - last.current));
      last.current = now;
    }, 200);
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [running]);


  const lap = (skipped: boolean) => {
    if (done || elapsed === 0) return;
    setLaps((l) => [...l, { ms: elapsed - lapStart, skipped }]);
    setLapStart(elapsed);
  };

  const reset = () => { setRunning(false); setElapsed(0); setLapStart(0); setLaps([]); };

  // Keyboard: Space starts/pauses, Enter records an answered question, S records a skip.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      if (e.code === "Space") { e.preventDefault(); if (!done) setRunning((r) => !r); }
      else if (e.key === "Enter" && running) lap(false);
      else if (e.key.toLowerCase() === "s" && running) lap(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const current = elapsed - lapStart;
  const answered = laps.filter((l) => !l.skipped);
  const avg = answered.length ? answered.reduce((n, l) => n + l.ms, 0) / answered.length : 0;
  const slow = laps.filter((l) => l.ms > 2 * target).length;
  const remainingQ = Math.max(0, questions - laps.length);
  const remainingT = Math.max(0, limit - elapsed);
  const pacePerQ = remainingQ ? remainingT / remainingQ : 0;

  return (
    <div className="w-full max-w-[960px] mx-auto pb-20">
      <ToolWorkspaceHeader
        title="Aptitude Pacing Timer"
        description="Set a section's question count and time limit, then record each question as you finish or skip it. You'll see where the minutes went and which questions to skip faster next time."
        icon={<Timer className="w-5 h-5" />}
      />

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <section aria-label="Timer" className="p-6 rounded-xl border-[1.5px] border-hair bg-card flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-[13px]">
              <span className="font-semibold text-ink">Questions</span>
              <input type="number" min={1} max={200} value={questions} disabled={elapsed > 0}
                onChange={(e) => setQuestions(Math.max(1, Math.min(200, Number(e.target.value) || 1)))}
                className={`px-3 py-2 rounded-lg border-[1.5px] border-hair bg-card tabular-nums disabled:opacity-60 ${focusRing}`} />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px]">
              <span className="font-semibold text-ink">Minutes</span>
              <input type="number" min={1} max={300} value={minutes} disabled={elapsed > 0}
                onChange={(e) => setMinutes(Math.max(1, Math.min(300, Number(e.target.value) || 1)))}
                className={`px-3 py-2 rounded-lg border-[1.5px] border-hair bg-card tabular-nums disabled:opacity-60 ${focusRing}`} />
            </label>
          </div>

          <div className="text-center flex flex-col gap-1">
            <p className="text-[12px] uppercase tracking-wider text-mute">Question {Math.min(laps.length + 1, questions)} of {questions}</p>
            <p className={`display text-[72px] leading-none tabular-nums ${current > target ? "text-warning" : "text-ink"}`} aria-live="off">{fmt(current)}</p>
            <p className="text-[13px] text-body tabular-nums">Target {fmt(target)} per question · {fmt(remainingT)} left in section</p>
            {done && <p className="text-[14px] font-semibold text-accent-ink mt-2" role="status">{elapsed >= limit ? "Time's up." : "Section complete."}</p>}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setRunning((r) => !r)} disabled={done}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ink text-paper font-semibold text-[14px] hover:bg-ink/85 disabled:opacity-50 ${focusRing}`}>
              {running ? <><Pause aria-hidden="true" className="w-4 h-4" /> Pause</> : <><Play aria-hidden="true" className="w-4 h-4" /> {elapsed ? "Resume" : "Start"}</>}
            </button>
            <button type="button" onClick={() => lap(false)} disabled={!running}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-[1.5px] border-hair font-semibold text-[14px] text-ink disabled:opacity-50 ${focusRing}`}>
              <Flag aria-hidden="true" className="w-4 h-4" /> Answered
            </button>
            <button type="button" onClick={() => lap(true)} disabled={!running}
              className={`px-5 py-2.5 rounded-lg border-[1.5px] border-hair font-semibold text-[14px] text-body disabled:opacity-50 ${focusRing}`}>
              Skip
            </button>
            <button type="button" onClick={reset} disabled={elapsed === 0}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] text-body hover:text-ink disabled:opacity-50 ${focusRing}`}>
              <RotateCcw aria-hidden="true" className="w-4 h-4" /> Reset
            </button>
          </div>
          <p className="text-center text-[12px] text-mute">Keyboard: Space start/pause · Enter answered · S skip</p>
        </section>

        <aside aria-label="Pacing summary" className="p-6 rounded-xl border-[1.5px] border-hair bg-card flex flex-col gap-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-ink">Pacing</h2>
          <dl className="grid grid-cols-2 gap-3 text-[13px]">
            <div><dt className="text-mute">Answered</dt><dd className="display text-[26px] tabular-nums">{answered.length}</dd></div>
            <div><dt className="text-mute">Skipped</dt><dd className="display text-[26px] tabular-nums">{laps.length - answered.length}</dd></div>
            <div><dt className="text-mute">Average</dt><dd className="display text-[26px] tabular-nums">{answered.length ? fmt(avg) : "—"}</dd></div>
            <div><dt className="text-mute">Over 2× target</dt><dd className="display text-[26px] tabular-nums">{slow}</dd></div>
          </dl>
          {elapsed > 0 && !done && remainingQ > 0 && (
            <p className={`text-[13px] ${pacePerQ < target ? "text-warning" : "text-body"}`}>
              To finish, you need {fmt(pacePerQ)} per remaining question{pacePerQ < target ? ", faster than your target" : ""}.
            </p>
          )}
          {laps.length > 0 && (
            <ol className="flex flex-col gap-1 max-h-72 overflow-y-auto text-[13px] tabular-nums">
              {laps.map((l, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-8 text-mute">Q{i + 1}</span>
                  <MeterBar pct={Math.min(100, (50 * l.ms) / target)} color={paceColor(l.ms, target)} className="h-1.5 flex-1" duration={0.2} />
                  <span className="w-12 text-right">{fmt(l.ms)}</span>
                  {l.skipped && <span className="text-[11px] text-mute">skip</span>}
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>

      {done && laps.length > 0 && <SectionReport laps={laps} target={target} limit={limit} elapsed={elapsed} />}
    </div>
  );
}
