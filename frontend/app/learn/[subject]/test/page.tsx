"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, RotateCcw, XCircle } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses/index";
import { BankQuestion, getAttempts, questionBank, recordAnswers, saveAttempt, shuffle, TestAttempt } from "@/lib/learn/study";
import { PageHeader, Section, Progress } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { askConfirm } from "@/components/ui/AskDialog";
import { optionClass } from "@/components/learn/optionClass";

const SECONDS_PER_QUESTION = 60;
type Phase = "setup" | "running" | "done";

const chip = (on: boolean) =>
  clsx(
    "label-cond inline-flex h-9 items-center rounded-full border-2 px-4 text-[15px] transition-colors",
    on ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line hover:text-ink"
  );

export default function MockTestPage() {
  const subjectSlug = useParams().subject as string;
  const course = getCourseBySlug(subjectSlug);
  const bank = useMemo(() => questionBank(subjectSlug), [subjectSlug]);

  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedModules, setSelectedModules] = useState<string[]>(() => course?.modules.map((m) => m.slug) ?? []);
  const [count, setCount] = useState(20);
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startedAt, setStartedAt] = useState(0);

  const pool = bank.filter((q) => selectedModules.includes(q.moduleSlug));
  const finalCount = Math.min(count, pool.length);

  function start() {
    const picked = shuffle(pool).slice(0, finalCount);
    setQuestions(picked);
    setAnswers(picked.map(() => null));
    setFlags(picked.map(() => false));
    setCurrent(0);
    setSecondsLeft(picked.length * SECONDS_PER_QUESTION);
    setStartedAt(Date.now());
    setPhase("running");
  }

  function submit() {
    const byModule: TestAttempt["byModule"] = {};
    const results = questions.map((q, i) => {
      const ok = answers[i] === q.answer;
      const b = (byModule[q.moduleSlug] ??= { title: q.moduleTitle, correct: 0, total: 0 });
      b.total++;
      if (ok) b.correct++;
      return { id: q.id, correct: ok };
    });
    saveAttempt(subjectSlug, {
      at: Date.now(),
      total: questions.length,
      correct: results.filter((r) => r.correct).length,
      seconds: Math.round((Date.now() - startedAt) / 1000),
      byModule,
    });
    recordAnswers(subjectSlug, results);
    setPhase("done");
  }

  // Timer: counts down while running and submits when it reaches zero.
  useEffect(() => {
    if (phase !== "running") return;
    if (secondsLeft <= 0) {
      // time's up: submitting from this render keeps the latest answers (a timeout callback would see stale ones)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      submit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  if (!course) {
    return (
      <p className="text-body">
        Course not found.{" "}
        <Link href="/learn" className="text-accent-ink underline">
          Back to Learn
        </Link>
      </p>
    );
  }

  const back = (
    <Link href={`/learn/${subjectSlug}`} className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
      <ArrowLeft aria-hidden className="size-3.5" /> {course.title}
    </Link>
  );

  if (phase === "setup") {
    const history = getAttempts(subjectSlug); // local, cheap; re-read each time setup shows
    return (
      <div className="max-w-3xl">
        {back}
        <PageHeader eyebrow={course.title} title="Mock" hl="test" />
        <p className="-mt-4 mb-8 max-w-2xl text-[15px] leading-relaxed text-body">
          Timed, drawn from the course&apos;s lesson questions: {SECONDS_PER_QUESTION} seconds each. Anything you miss goes to your review queue.
        </p>

        <fieldset className="mb-8">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <legend className="label-cond text-[20px]">Modules</legend>
            <span className="flex gap-4 font-mono text-[12px] uppercase tracking-wider">
              <button type="button" className="text-accent-ink hover:underline" onClick={() => setSelectedModules(course.modules.map((m) => m.slug))}>
                All
              </button>
              <button type="button" className="text-mute hover:text-ink" onClick={() => setSelectedModules([])}>
                None
              </button>
            </span>
          </div>
          <div className="grid border-t-[1.5px] border-hair sm:grid-cols-2 sm:gap-x-6">
            {course.modules.map((m) => {
              const n = bank.filter((q) => q.moduleSlug === m.slug).length;
              return (
                <label key={m.slug} className="flex cursor-pointer items-center gap-3 border-b-[1.5px] border-hair px-1 py-2.5 text-[15px] hover:bg-card-2">
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(m.slug)}
                    onChange={(e) => setSelectedModules((s) => (e.target.checked ? [...s, m.slug] : s.filter((x) => x !== m.slug)))}
                    className="size-4 accent-[var(--ink)]"
                  />
                  <span className="min-w-0 flex-1 truncate">{m.title}</span>
                  <span className="font-mono text-[11px] tabular-nums text-mute">{n}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mb-8">
          <legend className="label-cond mb-3 text-[20px]">Questions</legend>
          <div className="flex flex-wrap gap-2">
            {[10, 20, 30, 1000].map((n) => (
              <button key={n} type="button" onClick={() => setCount(n)} aria-pressed={count === n} className={chip(count === n)}>
                {n === 1000 ? "All" : n}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="brut mb-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card p-5">
          <p>
            <span className="display text-[36px]">{finalCount}</span> <span className="text-body">questions ·</span>{" "}
            <span className="display text-[36px]">{Math.ceil((finalCount * SECONDS_PER_QUESTION) / 60)}</span> <span className="text-body">min</span>
          </p>
          <button type="button" onClick={start} disabled={finalCount === 0} className={buttonClass("accent", "lg")}>
            Start test <ArrowRight className="size-5" />
          </button>
        </div>

        {history.length > 0 && (
          <Section title="Past attempts" kicker="History">
            <ul className="border-t-[1.5px] border-hair">
              {history.slice(0, 5).map((a) => (
                <li key={a.at} className="flex items-center justify-between gap-4 border-b-[1.5px] border-hair px-1 py-2.5 text-[14px] tabular-nums">
                  <span className="text-body">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(a.at)}</span>
                  <span className="font-mono">
                    {a.correct}/{a.total} · {Math.round((100 * a.correct) / a.total)}%
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    );
  }

  if (phase === "running") {
    const q = questions[current];
    const answered = answers.filter((a) => a !== null).length;
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const ss = String(secondsLeft % 60).padStart(2, "0");
    const finish = async () => {
      const left = questions.length - answered;
      if (!left || (await askConfirm("Submit the test?", { body: `${left} question${left === 1 ? " is" : "s are"} still unanswered.`, ok: "Submit" }))) submit();
    };
    return (
      <div className="max-w-3xl">
        <div className="sticky top-14 z-10 -mx-4 mb-6 border-b-[1.5px] border-hair bg-paper px-4 py-3 md:top-0 md:-mx-8 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[13px] tabular-nums text-body">
              {current + 1} / {questions.length} · {answered} answered
            </span>
            <span
              className={clsx("inline-flex items-center gap-1.5 font-mono text-[18px] font-bold tabular-nums", secondsLeft < 60 ? "text-danger" : "text-ink")}
              aria-live={secondsLeft < 60 ? "polite" : "off"}
            >
              <Clock aria-hidden className="size-4" /> {mm}:{ss}
            </span>
          </div>
          <Progress value={(answered / questions.length) * 100} className="mt-2" />
        </div>

        <p className="eyebrow mb-2">{q.moduleTitle}</p>
        <h1 className="text-[22px] font-semibold leading-snug">{q.question}</h1>

        <div role="radiogroup" aria-label="Answer options" className="mt-6 flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const chosen = answers[current] === i;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={chosen}
                onClick={() => setAnswers((a) => a.map((v, k) => (k === current ? i : v)))}
                className={clsx(optionClass(false, false, false), chosen && "!border-ink bg-card-2")}
              >
                <span className={clsx("grid size-6 shrink-0 place-items-center rounded-full font-mono text-[12px]", chosen ? "bg-ink text-paper" : "text-mute")}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setFlags((f) => f.map((v, k) => (k === current ? !v : v)))}
            aria-pressed={flags[current]}
            className={clsx(
              "label-cond inline-flex h-9 items-center gap-1.5 rounded-xl border-2 px-3 text-[14px]",
              flags[current] ? "border-gold bg-[var(--warning-soft)] text-[var(--warning)]" : "border-hair text-body hover:border-line"
            )}
          >
            <Flag aria-hidden className="size-4" /> {flags[current] ? "Flagged" : "Flag"}
          </button>
          <div className="flex gap-2">
            <button type="button" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)} className={buttonClass("secondary", "sm")}>
              Previous
            </button>
            {current < questions.length - 1 ? (
              <button type="button" onClick={() => setCurrent((c) => c + 1)} className={buttonClass("primary", "sm")}>
                Next <ArrowRight className="size-4" />
              </button>
            ) : (
              <button type="button" onClick={finish} className={buttonClass("accent", "sm")}>
                Submit test
              </button>
            )}
          </div>
        </div>

        <nav aria-label="Jump to question" className="mt-8 flex flex-wrap gap-1.5 border-t-[1.5px] border-hair pt-5">
          {questions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Question ${i + 1}${answers[i] !== null ? ", answered" : ""}${flags[i] ? ", flagged" : ""}`}
              aria-current={i === current ? "step" : undefined}
              className={clsx(
                "no-press size-9 rounded-lg border-2 font-mono text-[12px] tabular-nums",
                i === current ? "border-ink" : "border-hair",
                flags[i] ? "bg-[var(--warning-soft)]" : answers[i] !== null ? "bg-ink/10 text-ink" : "text-mute"
              )}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </div>
    );
  }

  // Results
  const correct = questions.filter((q, i) => answers[i] === q.answer).length;
  const pct = Math.round((100 * correct) / questions.length);
  const modules = Object.values(
    questions.reduce<Record<string, { title: string; slug: string; correct: number; total: number }>>((acc, q, i) => {
      const b = (acc[q.moduleSlug] ??= { title: q.moduleTitle, slug: q.moduleSlug, correct: 0, total: 0 });
      b.total++;
      if (answers[i] === q.answer) b.correct++;
      return acc;
    }, {})
  ).sort((a, b) => a.correct / a.total - b.correct / b.total);
  const missed = questions.length - correct;

  return (
    <div className="max-w-3xl">
      {back}
      <header className="brut mb-12 rounded-2xl bg-card p-6 md:p-8">
        <p className="eyebrow">Your score</p>
        <p className="display mt-2 text-[96px] leading-none tabular-nums">{pct}%</p>
        <p className="mt-3 text-[15px] tabular-nums text-body">
          {correct} of {questions.length} correct · {missed} added to your review queue
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => setPhase("setup")} className={buttonClass("primary", "sm")}>
            <RotateCcw aria-hidden className="size-4" /> New test
          </button>
          {missed > 0 && (
            <Link href={`/learn/${subjectSlug}/review`} className={buttonClass("secondary", "sm")}>
              Review misses
            </Link>
          )}
          <Link href={`/learn/${subjectSlug}/revise`} className={buttonClass("secondary", "sm")}>
            Revision sheet
          </Link>
        </div>
      </header>

      <Section title="By module" kicker="Weakest first">
        <ul className="border-t-[1.5px] border-hair">
          {modules.map((m) => {
            const mp = Math.round((100 * m.correct) / m.total);
            return (
              <li key={m.slug} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 border-b-[1.5px] border-hair px-1 py-3 sm:grid-cols-[14rem_minmax(0,1fr)_auto_auto]">
                <span className="truncate text-[15px] font-medium">{m.title}</span>
                <Progress value={mp} className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto" />
                <span className="font-mono text-[12px] tabular-nums text-mute">
                  {m.correct}/{m.total}
                </span>
                <Link href={`/learn/${subjectSlug}/revise?module=${m.slug}`} className="hidden text-[13px] font-semibold text-accent-ink hover:underline sm:inline">
                  Revise
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Answers" kicker={`${questions.length} questions`}>
        <ol className="flex flex-col gap-3">
          {questions.map((q, i) => {
            const ok = answers[i] === q.answer;
            return (
              <li key={q.id} className="rounded-2xl border-[1.5px] border-hair bg-card p-5">
                <p className="flex items-start gap-2.5 text-[16px] font-medium">
                  {ok ? <CheckCircle2 aria-label="Correct" className="mt-0.5 size-5 shrink-0 text-note" /> : <XCircle aria-label="Incorrect" className="mt-0.5 size-5 shrink-0 text-danger" />}
                  <span>
                    <span className="mr-1.5 font-mono text-[13px] text-mute">{i + 1}.</span>
                    {q.question}
                  </span>
                </p>
                <p className="mt-2 pl-[30px] text-[15px] text-body">
                  {answers[i] === null ? "Not answered. " : !ok ? <>You picked: {q.options[answers[i]!]}. </> : null}
                  Correct: <strong className="text-ink">{q.options[q.answer]}</strong>
                </p>
                {q.explanation && <p className="mt-1.5 pl-[30px] text-[15px] leading-relaxed text-body">{q.explanation}</p>}
                <Link href={`/learn/${subjectSlug}/${q.lessonSlug}`} className="mt-2 inline-block pl-[30px] text-[13px] font-semibold text-accent-ink hover:underline">
                  Lesson: {q.lessonTitle}
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>
    </div>
  );
}
