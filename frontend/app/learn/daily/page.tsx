"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Flame, Trophy, Target, CalendarDays } from "lucide-react";
import { clsx } from "clsx";
import { bestStreak, currentStreak, dailyQuestion, dateKey, dayNumber, getDailyHistory, keyFromDayNumber, saveDailyAnswer, DailyHistory } from "@/lib/learn/daily";
import { recordAnswers } from "@/lib/learn/study";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";
const WEEKS = 6;

export default function DailyQuestionPage() {
  const [today, setToday] = useState<string | null>(null);
  const [history, setHistory] = useState<DailyHistory>({});
  const [viewDate, setViewDate] = useState<string | null>(null);
  const [practicePick, setPracticePick] = useState<number | null>(null);

  // Dates come from the learner's own clock, so read them after mount to avoid a hydration mismatch.
  useEffect(() => {
    const t = dateKey();
    setToday(t);
    setViewDate(t);
    setHistory(getDailyHistory());
  }, []);

  const q = useMemo(() => (viewDate ? dailyQuestion(viewDate) : null), [viewDate]);
  if (!today || !q || !viewDate) return <p className="text-[13px] font-mono text-[var(--ink-secondary)]">Loading today&apos;s question…</p>;

  const isToday = viewDate === today;
  const entry = history[viewDate];
  // Past days can be practised, but only today's answer counts toward the streak.
  const pick = isToday ? (entry ? entry.pick ?? (entry.correct ? q.answer : -1) : practicePick) : practicePick;
  const answered = isToday ? !!entry : practicePick !== null;
  const correct = isToday ? entry?.correct : practicePick === q.answer;

  function choose(i: number) {
    if (answered) return;
    if (isToday) {
      const ok = i === q!.answer;
      saveDailyAnswer(today!, { id: q!.id, correct: ok, pick: i });
      recordAnswers(q!.course, [{ id: q!.id, correct: ok }]); // misses join that course's review queue
      setHistory(getDailyHistory());
      setPracticePick(i);
    } else setPracticePick(i);
  }

  const answeredDays = Object.values(history);
  const stats = [
    { icon: Flame, label: "Current streak", value: `${currentStreak(history, today)} ${currentStreak(history, today) === 1 ? "day" : "days"}` },
    { icon: Trophy, label: "Best streak", value: `${bestStreak(history)} ${bestStreak(history) === 1 ? "day" : "days"}` },
    { icon: Target, label: "Accuracy", value: answeredDays.length ? `${Math.round((100 * answeredDays.filter((d) => d.correct).length) / answeredDays.length)}%` : "—" },
    { icon: CalendarDays, label: "Days answered", value: String(answeredDays.length) },
  ];

  // Calendar: the last WEEKS weeks, Monday-first, ending with the current week.
  const todayN = dayNumber(today);
  const weekday = (new Date(todayN * 86_400_000).getUTCDay() + 6) % 7; // 0 = Monday
  const firstN = todayN - weekday - (WEEKS - 1) * 7;
  const cells = Array.from({ length: WEEKS * 7 }, (_, i) => firstN + i);
  const now = new Date();
  const msLeft = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

  return (
    <div className="flex flex-col gap-6 pb-16 w-full max-w-4xl">
      <Link href="/learn" className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] self-start rounded ${focusRing}`}>
        <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Back to Learn
      </Link>
      <header className="flex flex-col gap-1.5">
        <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">Daily Question</h1>
        <p className="text-[var(--ink-secondary)] text-[15px]">One question a day from across every course, the same for everyone. Answer daily to keep your streak.</p>
      </header>

      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <li key={s.label} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              <s.icon aria-hidden="true" className="w-3.5 h-3.5 text-[var(--accent)]" /> {s.label}
            </span>
            <span className="text-[22px] font-bold text-[var(--ink)] tabular-nums">{s.value}</span>
          </li>
        ))}
      </ul>

      <section className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
            {isToday ? "Today" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(dayNumber(viewDate) * 86_400_000))} · {q.courseTitle} · {q.moduleTitle}
          </span>
          {!isToday && <span className="text-[12px] text-[var(--ink-tertiary)]">Practice only: past days don&apos;t change your streak.</span>}
        </div>
        <h2 className="text-[18px] font-semibold text-[var(--ink)] leading-snug">{q.question}</h2>
        <div role="radiogroup" aria-label="Answer options" className="flex flex-col gap-2">
          {q.options.map((opt, i) => (
            <button key={i} type="button" role="radio" aria-checked={pick === i} disabled={answered} onClick={() => choose(i)}
              className={clsx("text-left px-4 py-3 rounded-lg border text-[15px]", focusRing,
                answered && i === q.answer ? "border-[var(--success)] bg-[var(--success-soft)] text-[var(--ink)]"
                  : answered && i === pick ? "border-[var(--error)] bg-[var(--error-soft)] text-[var(--ink)]"
                    : "border-[var(--border)] text-[var(--ink)] hover:border-[var(--accent)] disabled:hover:border-[var(--border)]")}>
              <span className="font-mono text-[var(--ink-tertiary)] mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          ))}
        </div>
        {answered && (
          <div aria-live="polite" className="flex flex-col gap-2">
            <p className={clsx("inline-flex items-center gap-1.5 font-bold text-[14px]", correct ? "text-[var(--success)]" : "text-[var(--error)]")}>
              {correct ? <CheckCircle2 aria-hidden="true" className="w-4 h-4" /> : <XCircle aria-hidden="true" className="w-4 h-4" />}
              {correct ? "Correct." : isToday ? "Not this time. It's been added to your review queue." : "Not quite."}
            </p>
            {q.explanation && <p className="text-[14px] text-[var(--ink-secondary)]">{q.explanation}</p>}
            <div className="flex flex-wrap gap-3 text-[13px]">
              <Link href={`/learn/${q.course}/${q.lessonSlug}`} className={`text-[var(--accent)] underline rounded ${focusRing}`}>Read the lesson: {q.lessonTitle}</Link>
              {isToday && <span className="text-[var(--ink-tertiary)] tabular-nums">Next question in {Math.floor(msLeft / 3_600_000)}h {Math.floor((msLeft % 3_600_000) / 60_000)}m</span>}
            </div>
          </div>
        )}
      </section>

      <section className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">Last {WEEKS} weeks</h2>
        <div className="grid grid-cols-7 gap-1.5 max-w-md">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d} className="text-[10px] text-center text-[var(--ink-tertiary)]">{d}</span>)}
          {cells.map((n) => {
            const key = keyFromDayNumber(n);
            const e = history[key];
            const future = n > todayN;
            const label = `${key}: ${future ? "upcoming" : e ? (e.correct ? "answered correctly" : "answered incorrectly") : "not answered"}`;
            return (
              <button key={n} type="button" disabled={future} aria-label={label} aria-current={key === viewDate ? "date" : undefined}
                onClick={() => { setViewDate(key); setPracticePick(null); }}
                className={clsx("aspect-square rounded-md text-[11px] tabular-nums border", focusRing,
                  key === viewDate ? "ring-2 ring-[var(--accent)]" : "",
                  future ? "border-transparent text-[var(--ink-tertiary)]/40" :
                  e ? (e.correct ? "bg-[var(--success)] border-[var(--success)] text-white" : "bg-[var(--error)] border-[var(--error)] text-white") :
                  "border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--accent)]")}>
                {Number(key.slice(8))}
              </button>
            );
          })}
        </div>
        <p className="text-[12px] text-[var(--ink-tertiary)]">Green: correct · Red: incorrect · Outlined: missed. Select any past day to practise its question.</p>
      </section>
    </div>
  );
}
