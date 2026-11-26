"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses/index";
import { useStudyPrefs } from "@/lib/prefs";
import { BankQuestion, dueItems, getReviewItems, questionBank, recordAnswers } from "@/lib/learn/study";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { optionClass } from "@/components/learn/optionClass";

export default function ReviewPage() {
  const subjectSlug = useParams().subject as string;
  const course = getCourseBySlug(subjectSlug);
  const bank = useMemo(() => new Map(questionBank(subjectSlug).map((q) => [q.id, q])), [subjectSlug]);

  // client-only render (AppLayout), so the local review queue is readable on first render
  const [items] = useState(() => getReviewItems(subjectSlug));
  const [{ reviewBatch }] = useStudyPrefs();
  // Settings > Learning can cap a session; the rest stays due for next time.
  const [queue, setQueue] = useState<BankQuestion[]>(() => {
    const due = dueItems(items)
      .map((x) => bank.get(x.id))
      .filter((q): q is BankQuestion => !!q);
    return reviewBatch > 0 ? due.slice(0, reviewBatch) : due;
  });
  const [pick, setPick] = useState<number | null>(null);
  const [done, setDone] = useState({ right: 0, wrong: 0 });
  const [now] = useState(Date.now);

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

  const upcoming = items.filter((x) => x.due > now).sort((a, b) => a.due - b.due);

  return (
    <div className="max-w-3xl">
      <Link href={`/learn/${subjectSlug}`} className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft aria-hidden className="size-3.5" /> {course.title}
      </Link>
      <PageHeader eyebrow={course.title} title="Review" hl="queue" />
      <p className="-mt-4 mb-8 max-w-2xl text-[15px] leading-relaxed text-body">
        Missed questions are due straight away. Each right answer pushes one further out: 1, 3, 7, 14, then 30 days. A miss starts it over.
      </p>

      {q ? (
        <section className="brut rounded-2xl bg-card p-6 md:p-8">
          <p className="eyebrow mb-3">
            {queue.length} due · {q.moduleTitle}
          </p>
          <h2 className="text-[20px] font-semibold leading-snug">{q.question}</h2>
          <div role="radiogroup" aria-label="Answer options" className="mt-5 flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={pick === i}
                disabled={answered}
                onClick={() => setPick(i)}
                className={optionClass(answered, i === q.answer, i === pick)}
              >
                <span className="font-mono text-[12px] text-mute">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>
          {answered && (
            <div aria-live="polite" className="fade-in mt-5 flex flex-col gap-3 rounded-xl bg-paper-2 p-4">
              <p className={clsx("inline-flex items-center gap-1.5 text-[15px] font-semibold", correct ? "text-note" : "text-danger")}>
                {correct ? <CheckCircle2 aria-hidden className="size-4" /> : <XCircle aria-hidden className="size-4" />}
                {correct ? "Correct. It'll come back later." : "Not quite. It stays in your queue."}
              </p>
              {q.explanation && <p className="text-[15px] leading-relaxed text-body">{q.explanation}</p>}
              <div className="flex flex-wrap items-center gap-4">
                <button type="button" onClick={next} className={buttonClass("primary", "sm")}>
                  {queue.length > 1 ? "Next question" : "Finish"} <ArrowRight className="size-4" />
                </button>
                <Link href={`/learn/${subjectSlug}/${q.lessonSlug}`} className="text-[14px] font-semibold text-accent-ink underline underline-offset-2">
                  Lesson: {q.lessonTitle}
                </Link>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-2xl border-[1.5px] border-hair bg-card p-6 md:p-8">
          {done.right + done.wrong > 0 ? (
            <>
              <p className="eyebrow mb-2">Session done</p>
              <p className="display text-[44px]">
                {done.right} right <span className="text-mute">·</span> {done.wrong} to practise
              </p>
            </>
          ) : (
            <p className="display text-[36px]">Nothing due right now.</p>
          )}
          <p className="mt-3 text-[15px] text-body">
            {upcoming.length > 0
              ? `${upcoming.length} question${upcoming.length === 1 ? "" : "s"} scheduled. The next is due ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(upcoming[0].due)}.`
              : "Take a mock test: any question you miss lands here."}
          </p>
          <Link href={`/learn/${subjectSlug}/test`} className={`${buttonClass("secondary")} mt-5`}>
            Take a mock test <ArrowRight className="size-4" />
          </Link>
        </section>
      )}
    </div>
  );
}
