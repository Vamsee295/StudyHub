"use client";
// The landing's product window: the real app's three loops (read, practice, review) drawn in HTML from real
// content. The learner's progress shown in it is a sample; the lessons, problem, tests and review rules are real.
import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { clsx } from "clsx";

export type TourData = {
  course: string;
  module: string;
  lessons: { title: string; minutes: number }[];
  lesson: { title: string; minutes: number; intro: string };
  problem: { id: string; title: string; difficulty: string; statement: string; tests: { input: string; output: string }[] };
  review: { question: string; days: number[] };
};

const TABS = [
  { id: "read", label: "Read", path: "learn / dsa / big-o-notation" },
  { id: "practice", label: "Practice", path: "practice / problems / 15" },
  { id: "review", label: "Review", path: "learn / dsa / review" },
] as const;
type Tab = (typeof TABS)[number]["id"];

function Ring({ pct, done }: { pct: number; done?: boolean }) {
  if (done) return <Check aria-label="Completed" className="size-4 shrink-0 text-note" />;
  return (
    <span
      aria-label={pct ? `${pct}% read` : "Not started"}
      className={clsx("block size-4 shrink-0 rounded-full border-2", pct ? "border-gold" : "border-ink/25")}
      style={pct ? { background: `conic-gradient(var(--gold) ${pct * 3.6}deg, transparent 0)` } : undefined}
    />
  );
}

function Read({ d }: { d: TourData }) {
  const read = 54;
  return (
    <div className="grid min-h-[440px] md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden border-r-[1.5px] border-hair bg-paper p-4 md:block">
        <p className="label-cond text-[18px] leading-tight">{d.course}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
          <span className="block h-full w-[6%] rounded-full bg-accent" />
        </div>
        <p className="mt-5 text-[13px] font-semibold text-mute">{d.module}</p>
        <ul className="mt-2 space-y-1">
          {d.lessons.map((l, i) => (
            <li key={l.title} className={clsx("flex items-start gap-2 rounded-lg px-2 py-1.5 text-[13px] leading-snug", i === 1 && "bg-ink text-paper")}>
              <span className="mt-px">{i === 0 ? <Ring pct={100} done /> : i === 1 ? <span className="block size-4 rounded-full border-2 border-paper" style={{ background: `conic-gradient(var(--paper) ${read * 3.6}deg, transparent 0)` }} /> : <Ring pct={0} />}</span>
              <span className="min-w-0 flex-1">{l.title}</span>
            </li>
          ))}
        </ul>
      </aside>
      <div className="min-w-0">
        <div className="relative flex items-center justify-between gap-3 border-b-[1.5px] border-hair px-5 py-3">
          <span className="truncate text-[13px] font-semibold text-mute">{d.module} · 2/47</span>
          <span className="shrink-0 text-[13px] text-mute">{read}% read · {Math.ceil(d.lesson.minutes * (1 - read / 100))} min left</span>
          <span aria-hidden className="absolute inset-x-0 -bottom-[1.5px] h-[3px]">
            <span className="absolute inset-y-0 left-0 bg-accent/30" style={{ width: `${read}%` }} />
            <span className="absolute inset-y-0 left-0 w-[40%] bg-accent" />
          </span>
        </div>
        <div className="px-5 py-6 md:px-8">
          <h3 className="display text-[30px] leading-[0.95] md:text-[38px]">{d.lesson.title}</h3>
          <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-body">{d.lesson.intro}</p>
          <div className="mt-6 rounded-xl bg-paper-2 p-4">
            <p className="text-[13px] font-semibold text-accent-ink">Quick check</p>
            <p className="mt-1 text-[15px] font-semibold leading-snug">{d.review.question}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Practise({ d }: { d: TourData }) {
  return (
    <div className="grid min-h-[440px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="p-5 md:p-7">
        <p className="text-[13px] font-semibold text-mute">
          Problem {d.problem.id} · {d.problem.difficulty}
        </p>
        <h3 className="display mt-1 text-[34px]">{d.problem.title}</h3>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-body">{d.problem.statement}</p>
      </div>
      <div className="bg-night p-5 font-mono text-[13px] leading-relaxed text-[#f5efe6] md:p-7">
        <p className="text-[#7fc9a2]">
          ✓ {d.problem.tests.length} of {d.problem.tests.length} sample tests passed
        </p>
        <ul className="mt-4 space-y-3">
          {d.problem.tests.map((t, i) => (
            <li key={i} className="rounded-lg bg-white/5 p-3">
              <p className="text-[#f5efe6]/60">case {i + 1}</p>
              <p>
                <span className="text-[#e07a52]">in </span>
                {t.input}
              </p>
              <p>
                <span className="text-[#e07a52]">out </span>
                {t.output}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Review({ d }: { d: TourData }) {
  const steps = d.review.days;
  return (
    <div className="min-h-[440px] p-5 md:p-8">
      <div className="max-w-[640px]">
        <p className="text-[13px] font-semibold text-mute">Due today · from {d.lesson.title.split(":")[0]}</p>
        <p className="mt-2 text-[22px] font-semibold leading-snug">{d.review.question}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-xl bg-success-soft px-4 py-2 text-[15px] font-semibold text-note">Got it</span>
          <span className="rounded-xl bg-danger-soft px-4 py-2 text-[15px] font-semibold text-danger">Missed it</span>
        </div>
      </div>
      <div className="mt-10">
        <p className="flex items-center gap-2 text-[15px] font-semibold">
          <RotateCcw aria-hidden className="size-4 text-accent" /> Each correct answer pushes the card further out
        </p>
        <ol className="mt-4 grid grid-cols-5 gap-2">
          {steps.map((n, i) => (
            <li key={n} className={clsx("rounded-xl p-3", i === 0 ? "bg-accent text-paper" : "bg-paper-2")}>
              <span className="display block text-[28px] leading-none md:text-[36px]">{n}</span>
              <span className={clsx("text-[13px]", i === 0 ? "text-paper/80" : "text-mute")}>{n === 1 ? "day" : "days"}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[14px] text-body">Miss it and it comes back tomorrow. Get it right after {steps[steps.length - 1]} days and it&apos;s yours.</p>
      </div>
    </div>
  );
}

export function ProductTour({ data }: { data: TourData }) {
  const [tab, setTab] = useState<Tab>("read");
  const current = TABS.find((t) => t.id === tab)!;
  return (
    <div data-ui className="brut overflow-hidden rounded-2xl bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b-[2.4px] border-line bg-paper-2 px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          <i className="size-3 rounded-full border-[1.5px] border-line bg-accent" />
          <i className="size-3 rounded-full border-[1.5px] border-line bg-gold" />
          <i className="size-3 rounded-full border-[1.5px] border-line bg-note" />
        </span>
        <div role="tablist" aria-label="Inside StudyHub" className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tour-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="tour-panel"
              onClick={() => setTab(t.id)}
              className={clsx(
                "label-cond h-9 rounded-full px-4 text-[16px] transition-colors",
                tab === t.id ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="ml-auto hidden truncate rounded-full bg-card px-3 py-1 text-[13px] text-mute sm:block">studyhub / {current.path}</span>
      </div>
      <div id="tour-panel" role="tabpanel" aria-labelledby={`tour-${tab}`} key={tab} className="fade-in">
        {tab === "read" ? <Read d={data} /> : tab === "practice" ? <Practise d={data} /> : <Review d={data} />}
      </div>
    </div>
  );
}
