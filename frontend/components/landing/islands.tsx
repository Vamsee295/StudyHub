"use client";
// The landing page's interactive parts. Everything else in Landing.tsx renders on the server.
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Pause, Play } from "lucide-react";
import { roadmap } from "@/lib/data/roadmap";
import { companies } from "@/lib/data/companies";
import { COMPANY_PROFILES } from "@/lib/data/askedIn";
import { buttonClass } from "@/components/ui/Button";
import { allocate, type PlanStage } from "./plan";

const SIGNUP = "/login?mode=signup";
// "Study these first" comes from the sourced company research in lib/data/askedIn.ts:
// the roadmap stages whose courses that company is reported to test. "TCS Digital / Prime" -> "TCS".
const shortName = (name: string) => name.split(" ")[0];
const stagesFor = (name: string) => {
  const profile = COMPANY_PROFILES.find((p) => p.name.startsWith(shortName(name)));
  const courses = new Set(profile?.areas.map((a) => a.course) ?? []);
  return roadmap.filter((s) => s.courses.some((c) => courses.has(c)));
};
const wrap = "mx-auto w-full max-w-[1180px] px-4 md:px-8";

const ROTATE_MS = 5000;

/** Per company, worked out on the server (app/page.tsx) from the interview-report data, so the problem set never ships here. */
export type TopAsked = { reported: number; top: { id: string; title: string; difficulty: "Easy" | "Medium" | "Hard" }[] };
type HeroStats = { courses: number; lessons: number; problems: number; quiz: number };

const diffTone = { Easy: "text-[#3f8a5a]", Medium: "text-[#b7791f]", Hard: "text-[#c0392b]" } as const;

// The second hero panel: the company's most-reported problems from our set, each runnable in practice.
function ProblemPanel({ company, data }: { company: string; data?: TopAsked }) {
  if (!data) return null;
  const name = shortName(company);
  return (
    <div
      key={company}
      data-ui
      className="brut fade-in relative mx-auto mt-10 w-full max-w-[440px] rounded-2xl bg-night text-[#f5efe6] lg:ml-auto lg:mr-0 lg:w-[88%] lg:rotate-1"
    >
      <p className="px-5 pt-4 font-mono text-[13px] uppercase tracking-wider text-[#f5efe6]/55">Most reported at {name}</p>
      <ol className="mt-2 px-2">
        {data.top.map((p, i) => (
          <li key={p.id}>
            <Link
              prefetch={false}
              href={`/practice/problems/${p.id}`}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] hover:bg-white/5"
            >
              <span className="font-mono text-[13px] text-[#e07a52]">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 truncate font-semibold">{p.title}</span>
              <span className={`shrink-0 font-mono text-[13px] ${diffTone[p.difficulty]}`}>{p.difficulty}</span>
              <ArrowRight className="size-4 shrink-0 text-[#f5efe6]/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[#e07a52]" aria-hidden />
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-2 border-t border-white/10 px-5 py-3 text-[14px] text-[#f5efe6]/70">
        {data.reported} problems in our set are reported at {name}
      </p>
    </div>
  );
}

/** Should the deck move on its own? Not with reduced motion (OS setting or the in-app toggle). */
function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !document.documentElement.classList.contains("reduce-motion");
}

function CompanyCard({
  index,
  onPick,
  playing,
  run,
  onToggle,
  onHold,
}: {
  index: number;
  onPick: (i: number) => void;
  playing: boolean;
  run: number;
  onToggle: () => void;
  onHold: (held: boolean) => void;
}) {
  const c = companies[index];
  const stages = stagesFor(c.name).slice(0, 4);
  const next = () => onPick((index + 1) % companies.length);
  return (
    <div
      className="relative mx-auto w-full max-w-[480px]"
      // hover holds the deck for a mouse only: a tap fires an enter with no leave, which would pause it for good
      onPointerEnter={(e) => e.pointerType === "mouse" && onHold(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHold(false)}
      onFocus={() => onHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && onHold(false)}
    >
      {/* two sheets underneath for a hand-stacked deck */}
      <div aria-hidden className="brut absolute inset-0 translate-x-4 translate-y-3 rotate-[4deg] rounded-2xl bg-paper-2" />
      <div aria-hidden className="brut absolute inset-0 -translate-x-2 translate-y-2 -rotate-[3deg] rounded-2xl bg-card-2" />
      <div data-ui className="brut relative -rotate-1 rounded-2xl bg-card p-6 sm:p-7">
        {/* the whole card is a tap target for the next company; the Next button below is the keyboard path */}
        <div key={c.name} className="fade-in cursor-pointer select-none" onClick={next} aria-live={playing ? "off" : "polite"}>
          <div className="flex items-start justify-between gap-4 border-b-[1.5px] border-dashed border-hair pb-4">
            <div>
              <p className="eyebrow !text-[13px] !text-[13px]">
                {c.segment} · {c.roleTag}
              </p>
              <h2 className="display mt-1 text-[38px]">{c.name}</h2>
            </div>
            <span className="label-cond shrink-0 rounded-lg border-2 border-line px-2 py-0.5 text-[14px]">{c.focus.length} rounds</span>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-body">{c.description}</p>
          <p className="mt-5 font-mono text-[13px] uppercase tracking-wider text-mute">The rounds</p>
          <ol className="mt-2 space-y-1.5">
            {c.focus.map((f, i) => (
              <li key={f} className="flex gap-3 text-[15px] font-semibold">
                <span className="font-mono text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                {f}
              </li>
            ))}
          </ol>
          {stages.length > 0 && (
            <>
              <p className="mt-5 font-mono text-[13px] uppercase tracking-wider text-mute">Study these first</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {stages.map((s) => (
                  <li key={s.id} className="rounded-full border-[1.5px] border-hair bg-paper-2 px-3 py-0.5 text-[13px] font-semibold">
                    {s.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* deck controls: one tick per company (the current one fills over 5 s), pause, next */}
        <div className="mt-6 flex items-center gap-3 border-t-[1.5px] border-dashed border-hair pt-4">
          <ol className="flex flex-1 gap-1.5" aria-label="Companies">
            {companies.map((co, i) => (
              <li key={co.name} className="flex-1">
                <button
                  type="button"
                  onClick={() => onPick(i)}
                  aria-label={co.name}
                  aria-current={i === index ? "true" : undefined}
                  className="no-press block w-full py-2"
                >
                  <span className="block h-1.5 overflow-hidden rounded-full bg-ink/15">
                    {i < index && <span className="block h-full w-full bg-ink/40" />}
                    {i === index && (
                      <span
                        key={run}
                        className={playing ? "deck-tick block h-full bg-accent" : "block h-full w-full bg-accent"}
                        style={playing ? { animationDuration: `${ROTATE_MS}ms` } : undefined}
                      />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={onToggle}
            aria-label={playing ? "Pause the company tour" : "Play the company tour"}
            className="tap grid size-8 shrink-0 place-items-center rounded-full border-2 border-line bg-card hover:bg-ink hover:text-paper"
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next company"
            className="tap grid size-8 shrink-0 place-items-center rounded-full border-2 border-line bg-card hover:bg-ink hover:text-paper"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-center font-mono text-[13px] text-mute md:hidden">Tap the card for the next company</p>
      </div>
    </div>
  );
}

export function Hero({ stats, topAsked }: { stats: HeroStats; topAsked: Record<string, TopAsked> }) {
  const [picked, setPicked] = useState(Math.min(2, companies.length - 1)); // Amazon: the most-asked-about company
  const [paused, setPaused] = useState(false); // the learner pressed pause
  const [held, setHeld] = useState(false); // pointer or focus is on the card: hold still while they read
  const [canMove, setCanMove] = useState(false); // decided after mount (reduced motion is a browser setting)
  const [run, setRun] = useState(0); // restarts the 5 s tick in sync with the timer
  const playing = canMove && !paused && !held;

  useEffect(() => {
    const decide = () => setCanMove(motionAllowed() && document.visibilityState === "visible");
    decide();
    document.addEventListener("visibilitychange", decide);
    return () => document.removeEventListener("visibilitychange", decide);
  }, []);

  // One timer per shown company: picking one by hand, pausing or holding restarts the full 5 s.
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setPicked((p) => (p + 1) % companies.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [picked, playing, run]);

  const pick = (i: number) => {
    setPicked(i);
    setRun((r) => r + 1);
  };
  const hold = (h: boolean) => {
    setHeld(h);
    if (!h) setRun((r) => r + 1);
  };

  return (
    // Phones read headline -> card -> picker; desktop keeps the card column beside both text blocks.
    <section className={`${wrap} grid gap-x-16 gap-y-10 pb-20 pt-12 md:pt-20 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[auto_1fr]`}>
      <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
        <p className="note -rotate-2">free placement prep for engineering students ↓</p>
        <h1 className="display mt-3 text-[52px] sm:text-[76px] xl:text-[88px]">
          Know what <br />
          {/* static block, not <Marked>: the headline must read correctly before any animation runs */}
          <span className="hl my-1 whitespace-nowrap">your company</span>
          <br />
          will ask.
        </h1>
        <p className="mt-6 max-w-[46ch] text-[18px] leading-relaxed text-body">
          The hiring rounds at each company, the subjects those rounds test, and the order to learn them in. Then you practice on the same kind of questions.
        </p>
      </div>

      <div className="lg:col-start-1 lg:row-start-2">
        <p className="label-cond text-[16px]">Pick a company:</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Companies">
          {companies.map((c, i) => (
            <button
              key={c.name}
              type="button"
              aria-pressed={i === picked}
              onClick={() => pick(i)}
              className={
                "label-cond h-9 rounded-full border-2 px-4 text-[15px] transition-colors " +
                (i === picked ? "border-ink bg-ink text-paper" : "border-hair hover:border-line")
              }
            >
              {shortName(c.name)}
            </button>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link prefetch={false} href={SIGNUP} className={buttonClass("accent", "lg")}>
            Prepare for {shortName(companies[picked].name)} <ArrowRight className="size-5" />
          </Link>
          <Link prefetch={false} href="/companies" className={buttonClass("secondary", "lg")}>
            All companies
          </Link>
        </div>
        <p className="mt-8 font-mono text-[13px] text-mute">
          Free: {stats.courses} courses · {stats.lessons.toLocaleString("en-IN")} lessons · {stats.problems.toLocaleString("en-IN")} coding problems ·{" "}
          {stats.quiz.toLocaleString("en-IN")} quiz questions
        </p>
      </div>
      <div className="row-start-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
        <CompanyCard
          index={picked}
          onPick={pick}
          playing={playing}
          run={run}
          onToggle={() => {
            setPaused((p) => !p);
            setRun((r) => r + 1);
          }}
          onHold={hold}
        />
        <ProblemPanel company={companies[picked].name} data={topAsked[companies[picked].name]} />
      </div>
    </section>
  );
}

// Pick a company and the months left: the modules it's reported to test, spread over the weeks.
const MONTHS = [1, 2, 3, 6];

export function Planner({ plans }: { plans: Record<string, PlanStage[]> }) {
  const names = Object.keys(plans);
  const [co, setCo] = useState(names.includes("Amazon") ? "Amazon" : names[0]);
  const [months, setMonths] = useState(3);
  const units = plans[co] ?? [];
  const weeks = months * 4;
  const studyWeeks = weeks >= 4 ? weeks - 1 : weeks; // the last week is kept for timed mocks
  const blocks = allocate(units, studyWeeks);
  const lessons = units.reduce((n, u) => n + u.lessons, 0);
  const hours = units.reduce((n, u) => n + u.minutes, 0) / 60;
  const perWeek = Math.max(1, Math.round(hours / studyWeeks));
  const wk = (b: { from: number; to: number }) => (b.from === b.to ? `Wk ${b.from}` : `Wk ${b.from}–${b.to}`);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div>
        <p className="label-cond text-[16px]">Your target company</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Target company">
          {names.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={n === co}
              onClick={() => setCo(n)}
              className={"label-cond h-9 rounded-full border-2 px-4 text-[15px] transition-colors " + (n === co ? "border-ink bg-ink text-paper" : "border-hair hover:border-line")}
            >
              {n}
            </button>
          ))}
        </div>

        <p className="label-cond mt-7 text-[16px]">Time until your test</p>
        <div className="mt-2 inline-flex rounded-xl border-2 border-line bg-card p-1" role="group" aria-label="Months left">
          {MONTHS.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={m === months}
              onClick={() => setMonths(m)}
              className={"label-cond h-9 rounded-lg px-4 text-[15px] transition-colors " + (m === months ? "bg-accent text-paper" : "hover:bg-card-2")}
            >
              {m} {m === 1 ? "month" : "months"}
            </button>
          ))}
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-4 border-t-[2.4px] border-line pt-5">
          <div>
            <dd className="display text-[40px] leading-none tabular-nums">{units.length}</dd>
            <dt className="mt-1 text-[13px] text-mute">modules</dt>
          </div>
          <div>
            <dd className="display text-[40px] leading-none tabular-nums">{lessons}</dd>
            <dt className="mt-1 text-[13px] text-mute">lessons</dt>
          </div>
          <div>
            <dd className="display text-[40px] leading-none tabular-nums">~{perWeek}</dd>
            <dt className="mt-1 text-[13px] text-mute">hours a week</dt>
          </div>
        </dl>
        <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-mute">
          Built from what {co} is reported to test and each lesson&apos;s time estimate. Practice problems and quizzes come on top.
        </p>
        <Link prefetch={false} href={SIGNUP} className={`${buttonClass("accent", "lg")} mt-6`}>
          Start this plan <ArrowRight className="size-5" />
        </Link>
      </div>

      <div data-ui className="brut overflow-hidden rounded-2xl bg-card">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b-[1.5px] border-hair bg-paper-2 px-4 py-3 font-mono text-[13px] uppercase tracking-wider sm:px-5">
          <span>
            {co} · {weeks} weeks
          </span>
          <span className="text-mute">{Math.round(hours)} hrs of lessons</span>
        </div>
        <ol key={`${co}-${months}`} className="fade-in max-h-[460px] divide-y-[1.5px] divide-hair overflow-y-auto">
          {blocks.map((b) => {
            const n = b.stages.reduce((s, x) => s + x.lessons, 0);
            return (
              <li key={b.from} className="grid grid-cols-[68px_1fr] items-baseline gap-3 px-4 py-3 sm:grid-cols-[92px_1fr_auto] sm:px-5">
                <span className="font-mono text-[13px] text-accent-ink">{wk(b)}</span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold leading-snug">{b.stages.map((s) => s.title).join(" + ")}</span>
                  <span className="block text-[13px] text-mute">
                    {[...new Set(b.stages.map((s) => s.stage))].join(" · ")}
                    <span className="sm:hidden"> · {n} lessons</span>
                  </span>
                </span>
                <span className="hidden font-mono text-[13px] tabular-nums text-mute sm:block">{n} lessons</span>
              </li>
            );
          })}
          {studyWeeks < weeks && (
            <li className="grid grid-cols-[68px_1fr] items-baseline gap-3 bg-paper-2 px-4 py-3 sm:grid-cols-[92px_1fr_auto] sm:px-5">
              <span className="font-mono text-[13px] text-accent-ink">Wk {weeks}</span>
              <span className="text-[15px] font-semibold">Timed mock tests and your review queue</span>
              <span />
            </li>
          )}
        </ol>
      </div>
    </div>
  );
}

// Click through the real roadmap: every stage's topics and a sample interview question.
export function StageExplorer() {
  const [i, setI] = useState(0);
  const s = roadmap[i];
  const go = (n: number) => setI((n + roadmap.length) % roadmap.length);
  return (
    <div data-ui className="brut overflow-hidden rounded-2xl bg-card">
      <div className="flex items-center justify-between gap-3 border-b-[1.5px] border-hair bg-paper-2 px-5 py-3">
        <span className="font-mono text-[13px] uppercase tracking-wider">
          Stage {i + 1} of {roadmap.length}
        </span>
        <span className="flex gap-1.5">
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous stage" className="tap grid size-8 place-items-center rounded-full border-2 border-line bg-card hover:bg-ink hover:text-paper">
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next stage" className="tap grid size-8 place-items-center rounded-full border-2 border-line bg-card hover:bg-ink hover:text-paper">
            <ArrowRight className="size-4" />
          </button>
        </span>
      </div>
      <ol className="flex flex-wrap gap-1.5 px-5 pb-1 pt-4" aria-label="Roadmap stages">
        {roadmap.map((st, n) => (
          <li key={st.id}>
            <button
              type="button"
              onClick={() => setI(n)}
              aria-current={n === i ? "step" : undefined}
              title={st.title}
              className={
                "no-press grid h-8 min-w-8 place-items-center rounded-lg border-2 px-1.5 font-mono text-[13px] font-bold transition-colors " +
                (n === i ? "border-ink bg-ink text-paper" : n < i ? "border-line bg-paper-2" : "border-hair text-mute hover:border-line")
              }
            >
              {String(n + 1).padStart(2, "0")}
            </button>
          </li>
        ))}
      </ol>
      <div key={s.id}
          className="fade-in px-5 pb-6 pt-4"
          aria-live="polite"
        >
          <p className="eyebrow !text-[13px] !text-[13px]">{s.phase}</p>
          <h4 className="display mt-1 text-[32px]">{s.title}</h4>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-body">{s.description}</p>
          <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {s.topics.map((t) => (
              <li key={t} className="flex gap-2 text-[14px] font-medium leading-snug">
                <Check className="mt-0.5 size-4 shrink-0 text-note" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl bg-night px-4 py-3.5 text-[#f5efe6]">
            <p className="font-mono text-[13px] uppercase tracking-wider text-[#f5efe6]/55">Sample interview question</p>
            <p className="mt-1 text-[15px] font-semibold leading-snug">&ldquo;{s.sampleQuestion}&rdquo;</p>
          </div>
        </div>
      <Link prefetch={false} href="/roadmaps" className="label-cond flex items-center justify-between border-t-[1.5px] border-hair px-5 py-3.5 text-[17px] hover:bg-card-2">
        Open the full roadmap <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
