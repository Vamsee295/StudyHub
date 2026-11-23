"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { getCourseBySlug } from "@/lib/data/courses/index";
import { BankQuestion, dueItems, getReviewItems, questionBank, recordAnswers, ReviewItem } from "@/lib/learn/study";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

export default function ReviewPage() {
  const subjectSlug = useParams().subject as string;
  const course = getCourseBySlug(subjectSlug);
  const bank = useMemo(() => new Map(questionBank(subjectSlug).map((q) => [q.id, q])), [subjectSlug]);

  const [items, setItems] = useState<ReviewItem[] | null>(null);
  const [queue, setQueue] = useState<BankQuestion[]>([]);
  const [pick, setPick] = useState<number | null>(null);
  const [done, setDone] = useState({ right: 0, wrong: 0 });

  useEffect(() => {
    const all = getReviewItems(subjectSlug);
    setItems(all);
    setQueue(dueItems(all).map((x) => bank.get(x.id)).filter((q): q is BankQuestion => !!q));
  }, [subjectSlug, bank]);

  if (!course) {
    return <p className="text-[var(--ink-secondary)]">Course not found. <Link href="/learn" className="text-[var(--accent)] underline">Back to Learn</Link></p>;
  }

  const q = queue[0];
  const answered = pick !== null;
  const correct = answered && q && pick === q.answer;

  function next() {
    if (!q || pick === null) return;
    recordAnswers(subjectSlug, [{ id: q.id, correct: pick === q.answer }]);
    setDone((d) => (pick === q.answer ? { ...d, right: d.right + 1 } : { ...d, wrong: d.wrong + 1 }));
    setQueue((qs) => qs.slice(1));
    setPick(null);
  }

  const upcoming = (items ?? []).filter((x) => x.due > Date.now()).sort((a, b) => a.due - b.due);

  return (
    <div className="flex flex-col gap-6 pb-16 w-full max-w-3xl">
      <Link href={`/learn/${subjectSlug}`} className={clsx("inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] self-start rounded", focusRing)}>
        <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Back to {course.title}
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">{course.title}: Review</h1>
        <p className="text-[var(--ink-secondary)] text-[15px]">
          Questions you miss are due straight away. Each time you get one right it waits longer: 1, 3, 7, 14, then 30 days. Miss it and it starts over.
        </p>
      </header>

      {items === null ? (
        <p className="text-[13px] font-mono text-[var(--ink-secondary)]">Loading review queue…</p>
      ) : q ? (
        <section className="flex flex-col gap-4 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <span className="text-[12px] font-mono text-[var(--ink-tertiary)] tabular-nums">{queue.length} due · {q.moduleTitle}</span>
          <h2 className="text-[17px] font-semibold text-[var(--ink)] leading-snug">{q.question}</h2>
          <div role="radiogroup" aria-label="Answer options" className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={pick === i}
                disabled={answered}
                onClick={() => setPick(i)}
                className={clsx("text-left px-4 py-3 rounded-lg border text-[15px]", focusRing,
                  answered && i === q.answer ? "border-[var(--success)] bg-[var(--success-soft)] text-[var(--ink)]"
                    : answered && i === pick ? "border-[var(--error)] bg-[var(--error-soft)] text-[var(--ink)]"
                      : "border-[var(--border)] text-[var(--ink)] hover:border-[var(--accent)] disabled:hover:border-[var(--border)]")}
              >
                <span className="font-mono text-[var(--ink-tertiary)] mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            ))}
          </div>
          {answered && (
            <div aria-live="polite" className="flex flex-col gap-2">
              <p className={clsx("inline-flex items-center gap-1.5 font-bold text-[14px]", correct ? "text-[var(--success)]" : "text-[var(--error)]")}>
                {correct ? <CheckCircle2 aria-hidden="true" className="w-4 h-4" /> : <XCircle aria-hidden="true" className="w-4 h-4" />}
                {correct ? "Correct. It will come back later." : "Not quite. It stays in your queue."}
              </p>
              {q.explanation && <p className="text-[14px] text-[var(--ink-secondary)]">{q.explanation}</p>}
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={next} className={clsx("px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-[13px] font-bold", focusRing)}>
                  {queue.length > 1 ? "Next Question" : "Finish"}
                </button>
                <Link href={`/learn/${subjectSlug}/${q.lessonSlug}`} className={clsx("text-[12px] text-[var(--accent)] underline rounded", focusRing)}>Lesson: {q.lessonTitle}</Link>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="flex flex-col gap-3 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-[15px] font-medium text-[var(--ink)]">
            {done.right + done.wrong > 0 ? `Session done: ${done.right} right, ${done.wrong} still to practise.` : "Nothing is due right now."}
          </p>
          <p className="text-[14px] text-[var(--ink-secondary)]">
            {upcoming.length > 0
              ? `${upcoming.length} question${upcoming.length === 1 ? "" : "s"} scheduled. Next one is due ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(upcoming[0].due)}.`
              : "Take a mock test; any question you miss will show up here."}
          </p>
          <Link href={`/learn/${subjectSlug}/test`} className={clsx("self-start px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-[13px] font-bold", focusRing)}>Take a Mock Test</Link>
        </section>
      )}
    </div>
  );
}
