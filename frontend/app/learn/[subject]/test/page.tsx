"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Flag, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import { getCourseBySlug } from "@/lib/data/courses/index";
import { BankQuestion, getAttempts, questionBank, recordAnswers, saveAttempt, shuffle, TestAttempt } from "@/lib/learn/study";

const SECONDS_PER_QUESTION = 60;
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

type Phase = "setup" | "running" | "done";

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
  const [history, setHistory] = useState<TestAttempt[]>([]);

  useEffect(() => setHistory(getAttempts(subjectSlug)), [subjectSlug, phase]);

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
    if (secondsLeft <= 0) { submit(); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  if (!course) {
    return <p className="text-[var(--ink-secondary)]">Course not found. <Link href="/learn" className="text-[var(--accent)] underline">Back to Learn</Link></p>;
  }

  const back = (
    <Link href={`/learn/${subjectSlug}`} className={clsx("inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] self-start rounded", focusRing)}>
      <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Back to {course.title}
    </Link>
  );

  if (phase === "setup") {
    return (
      <div className="flex flex-col gap-6 pb-16 w-full max-w-3xl">
        {back}
        <header className="flex flex-col gap-2">
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">{course.title}: Mock Test</h1>
          <p className="text-[var(--ink-secondary)] text-[15px]">
            Timed test drawn from the course’s lesson questions. You get {SECONDS_PER_QUESTION} seconds per question. Questions you miss go into your review queue.
          </p>
        </header>

        <fieldset className="flex flex-col gap-3 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <legend className="px-1 text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">Modules</legend>
          <div className="flex gap-3 text-[12px]">
            <button type="button" className={clsx("text-[var(--accent)] underline rounded", focusRing)} onClick={() => setSelectedModules(course.modules.map((m) => m.slug))}>Select all</button>
            <button type="button" className={clsx("text-[var(--accent)] underline rounded", focusRing)} onClick={() => setSelectedModules([])}>Clear</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {course.modules.map((m) => {
              const n = bank.filter((q) => q.moduleSlug === m.slug).length;
              return (
                <label key={m.slug} className="flex items-center gap-2 text-[14px] text-[var(--ink)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(m.slug)}
                    onChange={(e) => setSelectedModules((s) => (e.target.checked ? [...s, m.slug] : s.filter((x) => x !== m.slug)))}
                    className="accent-[var(--accent)]"
                  />
                  <span className="truncate">{m.title}</span>
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] tabular-nums">{n}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <legend className="px-1 text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">Questions</legend>
          <div className="flex flex-wrap gap-2">
            {[10, 20, 30, 1000].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                aria-pressed={count === n}
                className={clsx("px-3 py-1.5 rounded-lg border text-[13px] font-medium", focusRing,
                  count === n ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--ink)] hover:border-[var(--accent)]")}
              >
                {n === 1000 ? "All" : n}
              </button>
            ))}
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            {finalCount} questions · {Math.ceil((finalCount * SECONDS_PER_QUESTION) / 60)} minutes
          </p>
        </fieldset>

        <button
          type="button"
          onClick={start}
          disabled={finalCount === 0}
          className={clsx("self-start px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white font-bold text-[14px] disabled:opacity-50", focusRing)}
        >
          Start Test
        </button>

        {history.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">Past attempts</h2>
            <ul className="flex flex-col gap-1 text-[13px] text-[var(--ink-secondary)]">
              {history.slice(0, 5).map((a) => (
                <li key={a.at} className="flex justify-between gap-4 tabular-nums">
                  <span>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(a.at)}</span>
                  <span className="font-mono">{a.correct}/{a.total} ({Math.round((100 * a.correct) / a.total)}%)</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  if (phase === "running") {
    const q = questions[current];
    const answered = answers.filter((a) => a !== null).length;
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const ss = String(secondsLeft % 60).padStart(2, "0");
    return (
      <div className="flex flex-col gap-5 pb-16 w-full max-w-3xl">
        <div className="flex items-center justify-between gap-4 sticky top-0 z-10 bg-[var(--bg,var(--surface))] py-3 border-b border-[var(--border)]">
          <span className="text-[13px] font-mono text-[var(--ink-secondary)] tabular-nums">Question {current + 1} of {questions.length} · {answered} answered</span>
          <span className={clsx("inline-flex items-center gap-1.5 font-mono font-bold tabular-nums text-[15px]", secondsLeft < 60 ? "text-[var(--error)]" : "text-[var(--ink)]")} aria-live={secondsLeft < 60 ? "polite" : "off"}>
            <Clock aria-hidden="true" className="w-4 h-4" /> {mm}:{ss}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">{q.moduleTitle}</span>
          <h1 className="text-[18px] font-semibold text-[var(--ink)] leading-snug">{q.question}</h1>
        </div>

        <div role="radiogroup" aria-label="Answer options" className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const chosen = answers[current] === i;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={chosen}
                onClick={() => setAnswers((a) => a.map((v, k) => (k === current ? i : v)))}
                className={clsx("text-left px-4 py-3 rounded-lg border text-[15px]", focusRing,
                  chosen ? "border-[var(--accent)] bg-[var(--accent-soft)]/40 text-[var(--ink)] font-medium" : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)]")}
              >
                <span className="font-mono text-[var(--ink-tertiary)] mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setFlags((f) => f.map((v, k) => (k === current ? !v : v)))}
            aria-pressed={flags[current]}
            className={clsx("inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[13px]", focusRing,
              flags[current] ? "border-[var(--warning,#d97706)] text-[var(--warning,#d97706)]" : "border-[var(--border)] text-[var(--ink-secondary)]")}
          >
            <Flag aria-hidden="true" className="w-4 h-4" /> {flags[current] ? "Flagged" : "Flag for Review"}
          </button>
          <div className="flex gap-2">
            <button type="button" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)} className={clsx("px-4 py-2 rounded-lg border border-[var(--border)] text-[13px] disabled:opacity-40", focusRing)}>Previous</button>
            {current < questions.length - 1 ? (
              <button type="button" onClick={() => setCurrent((c) => c + 1)} className={clsx("px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-[13px] font-bold", focusRing)}>Next</button>
            ) : (
              <button
                type="button"
                onClick={() => { if (answered === questions.length || confirm(`${questions.length - answered} questions are unanswered. Submit anyway?`)) submit(); }}
                className={clsx("px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-[13px] font-bold", focusRing)}
              >
                Submit Test
              </button>
            )}
          </div>
        </div>

        <nav aria-label="Jump to question" className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border)]">
          {questions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Question ${i + 1}${answers[i] !== null ? ", answered" : ""}${flags[i] ? ", flagged" : ""}`}
              aria-current={i === current ? "step" : undefined}
              className={clsx("w-8 h-8 rounded-md text-[12px] font-mono tabular-nums border", focusRing,
                i === current ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-[var(--border)]",
                flags[i] ? "bg-[var(--warning-soft,#fef3c7)] text-[var(--ink)]" : answers[i] !== null ? "bg-[var(--surface-subdued)] text-[var(--ink)]" : "bg-[var(--surface)] text-[var(--ink-tertiary)]")}
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
    <div className="flex flex-col gap-6 pb-16 w-full max-w-3xl">
      {back}
      <header className="flex flex-col gap-2 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink-secondary)]">Your score</span>
        <span className="font-newsreader text-5xl text-[var(--ink)] tabular-nums">{pct}%</span>
        <span className="text-[14px] text-[var(--ink-secondary)] tabular-nums">{correct} of {questions.length} correct · {missed} added to your review queue</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <button type="button" onClick={() => setPhase("setup")} className={clsx("inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-[13px] font-bold", focusRing)}>
            <RotateCcw aria-hidden="true" className="w-4 h-4" /> New Test
          </button>
          {missed > 0 && <Link href={`/learn/${subjectSlug}/review`} className={clsx("px-4 py-2 rounded-lg border border-[var(--border)] text-[13px] font-medium text-[var(--ink)]", focusRing)}>Review Missed Questions</Link>}
          <Link href={`/learn/${subjectSlug}/revise`} className={clsx("px-4 py-2 rounded-lg border border-[var(--border)] text-[13px] font-medium text-[var(--ink)]", focusRing)}>Open Revision Sheet</Link>
        </div>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">By module (weakest first)</h2>
        <ul className="flex flex-col gap-2">
          {modules.map((m) => {
            const mp = Math.round((100 * m.correct) / m.total);
            return (
              <li key={m.slug} className="flex items-center gap-3 text-[13px]">
                <span className="w-44 sm:w-60 truncate text-[var(--ink)]">{m.title}</span>
                <div className="flex-1 h-1.5 rounded-full bg-[var(--border-strong)]/30 overflow-hidden" role="progressbar" aria-label={`${m.title} score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={mp}>
                  <div className={clsx("h-full rounded-full", mp >= 70 ? "bg-[var(--success)]" : mp >= 40 ? "bg-[var(--accent)]" : "bg-[var(--error)]")} style={{ width: `${mp}%` }} />
                </div>
                <span className="w-12 text-right font-mono tabular-nums text-[var(--ink-tertiary)]">{m.correct}/{m.total}</span>
                <Link href={`/learn/${subjectSlug}/revise?module=${m.slug}`} className={clsx("text-[12px] text-[var(--accent)] underline rounded", focusRing)}>Revise</Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">Answers</h2>
        {questions.map((q, i) => {
          const ok = answers[i] === q.answer;
          return (
            <article key={q.id} className="flex flex-col gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="flex items-start gap-2">
                {ok ? <CheckCircle2 aria-label="Correct" className="w-5 h-5 text-[var(--success)] shrink-0" /> : <XCircle aria-label="Incorrect" className="w-5 h-5 text-[var(--error)] shrink-0" />}
                <p className="text-[15px] font-medium text-[var(--ink)]">{i + 1}. {q.question}</p>
              </div>
              <p className="text-[14px] text-[var(--ink-secondary)] pl-7">
                {answers[i] === null ? "Not answered. " : !ok ? <>Your answer: {q.options[answers[i]!]}. </> : null}
                Correct: <strong className="text-[var(--ink)]">{q.options[q.answer]}</strong>
              </p>
              {q.explanation && <p className="text-[14px] text-[var(--ink-secondary)] pl-7">{q.explanation}</p>}
              <Link href={`/learn/${subjectSlug}/${q.lessonSlug}`} className={clsx("pl-7 text-[12px] text-[var(--accent)] underline self-start rounded", focusRing)}>Lesson: {q.lessonTitle}</Link>
            </article>
          );
        })}
      </section>
    </div>
  );
}
