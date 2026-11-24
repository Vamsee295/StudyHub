"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/Page";
import { optionClass } from "@/components/learn/optionClass";
import { clsx } from "clsx";
import { bestStreak, currentStreak, dailyQuestion, dateKey, dayNumber, getDailyHistory, keyFromDayNumber, saveDailyAnswer, DailyHistory } from "@/lib/learn/daily";
import { recordAnswers } from "@/lib/learn/study";

const WEEKS = 6;

export default function DailyQuestionPage() {
  // Dates come from the learner's own clock; AppLayout renders pages on the client only, so read them directly.
  const [today] = useState(dateKey);
  const [history, setHistory] = useState<DailyHistory>(getDailyHistory);
  const [viewDate, setViewDate] = useState(today);
  const [practicePick, setPracticePick] = useState<number | null>(null);

  const q = useMemo(() => dailyQuestion(viewDate), [viewDate]);

  const isToday = viewDate === today;
  const entry = history[viewDate];
  // Past days can be practised, but only today's answer counts toward the streak.
  const pick = isToday ? (entry ? entry.pick ?? (entry.correct ? q.answer : -1) : practicePick) : practicePick;
  const answered = isToday ? !!entry : practicePick !== null;
  const correct = isToday ? entry?.correct : practicePick === q.answer;

  function choose(i: number) {
    if (answered) return;
    if (isToday) {
      const ok = i === q.answer;
      saveDailyAnswer(today, { id: q.id, correct: ok, pick: i });
      recordAnswers(q.course, [{ id: q.id, correct: ok }]); // misses join that course's review queue
      setHistory(getDailyHistory());
      setPracticePick(i);
    } else setPracticePick(i);
  }

  const answeredDays = Object.values(history);
  const stats = [
    { label: "Current streak", value: String(currentStreak(history, today)), unit: "days" },
    { label: "Best streak", value: String(bestStreak(history)), unit: "days" },
    { label: "Accuracy", value: answeredDays.length ? `${Math.round((100 * answeredDays.filter((d) => d.correct).length) / answeredDays.length)}%` : "–" },
    { label: "Days answered", value: String(answeredDays.length) },
  ];

  // Calendar: the last WEEKS weeks, Monday-first, ending with the current week.
  const todayN = dayNumber(today);
  const weekday = (new Date(todayN * 86_400_000).getUTCDay() + 6) % 7; // 0 = Monday
  const firstN = todayN - weekday - (WEEKS - 1) * 7;
  const cells = Array.from({ length: WEEKS * 7 }, (_, i) => firstN + i);
  const now = new Date();
  const msLeft = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

  return (
    <div className="max-w-4xl">
      <Link href="/learn" className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft aria-hidden className="size-3.5" /> Learn
      </Link>
      <PageHeader eyebrow="Same question for everyone, every day" title="Daily" hl="question" />

      <dl className="mb-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y-[1.5px] border-hair py-5 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">{s.label}</dt>
            <dd className="display mt-1 text-[40px] tabular-nums">
              {s.value}
              {s.unit && <span className="ml-1.5 font-mono text-[12px] normal-case tracking-normal text-mute">{s.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <section className="brut mb-12 rounded-2xl bg-card p-6 md:p-8">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <span className="eyebrow">
            {isToday ? "Today" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(dayNumber(viewDate) * 86_400_000))} · {q.courseTitle} · {q.moduleTitle}
          </span>
          {!isToday && <span className="text-[12px] text-mute">Practice only: past days don&apos;t change your streak.</span>}
        </div>
        <h2 className="text-[20px] font-semibold leading-snug">{q.question}</h2>
        <div role="radiogroup" aria-label="Answer options" className="mt-5 flex flex-col gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={pick === i}
              disabled={answered}
              onClick={() => choose(i)}
              className={optionClass(answered, i === q.answer, i === pick)}
            >
              <span className="font-mono text-[12px] text-mute">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>
        {answered && (
          <div aria-live="polite" className="fade-in mt-5 flex flex-col gap-2 rounded-xl bg-paper-2 p-4">
            <p className={clsx("inline-flex items-center gap-1.5 text-[15px] font-semibold", correct ? "text-note" : "text-danger")}>
              {correct ? <CheckCircle2 aria-hidden className="size-4" /> : <XCircle aria-hidden className="size-4" />}
              {correct ? "Correct." : isToday ? "Not this time. It's in your review queue now." : "Not quite."}
            </p>
            {q.explanation && <p className="text-[15px] leading-relaxed text-body">{q.explanation}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
              <Link href={`/learn/${q.course}/${q.lessonSlug}`} className="font-semibold text-accent-ink underline underline-offset-2">
                Read the lesson: {q.lessonTitle}
              </Link>
              {isToday && (
                <span className="font-mono text-[13px] tabular-nums text-mute">
                  Next question in {Math.floor(msLeft / 3_600_000)}h {Math.floor((msLeft % 3_600_000) / 60_000)}m
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      <Section title="Your calendar" kicker={`Last ${WEEKS} weeks`}>
        <div className="grid max-w-md grid-cols-7 gap-1.5">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d} className="text-center font-mono text-[10px] uppercase text-mute">
              {d}
            </span>
          ))}
          {cells.map((n) => {
            const key = keyFromDayNumber(n);
            const e = history[key];
            const future = n > todayN;
            const label = `${key}: ${future ? "upcoming" : e ? (e.correct ? "answered correctly" : "answered incorrectly") : "not answered"}`;
            return (
              <button
                key={n}
                type="button"
                disabled={future}
                aria-label={label}
                aria-current={key === viewDate ? "date" : undefined}
                onClick={() => {
                  setViewDate(key);
                  setPracticePick(null);
                }}
                className={clsx(
                  "no-press aspect-square rounded-lg border-2 font-mono text-[11px] tabular-nums",
                  key === viewDate && "outline-2 outline-offset-2 outline-accent",
                  future
                    ? "border-transparent text-mute/40"
                    : e
                      ? e.correct
                        ? "border-note bg-note text-paper"
                        : "border-danger bg-danger text-paper"
                      : "border-hair text-body hover:border-line"
                )}
              >
                {Number(key.slice(8))}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[13px] text-mute">Teal: right · Red: wrong · Outlined: skipped. Pick any past day to practise its question.</p>
      </Section>
    </div>
  );
}
