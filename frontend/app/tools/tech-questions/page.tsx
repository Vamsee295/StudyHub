"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Layers, RotateCcw, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { ToolWorkspaceHeader } from "@/components/tools/shared/ToolWorkspaceHeader";
import { ALL_COURSES } from "@/lib/data/courses/index";
import { BankQuestion, dueItems, getReviewItems, questionBank, recordAnswers, shuffle } from "@/lib/learn/study";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
type Source = "random" | "due";

export default function TechQuestionDrillPage() {
  const [course, setCourse] = useState("dsa");
  const [count, setCount] = useState(10);
  const [source, setSource] = useState<Source>("random");
  const [deck, setDeck] = useState<BankQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<{ id: string; correct: boolean }[]>([]);
  const bank = useMemo(() => questionBank(course), [course]);
  // re-read when a deck starts or ends, since answering changes the review queue
  const dueCount = useMemo(() => {
    const ids = new Set(bank.map((q) => q.id));
    return dueItems(getReviewItems(course)).filter((r) => ids.has(r.id)).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deck is the refresh trigger
  }, [course, bank, deck]);

  const start = () => {
    let pool = bank;
    if (source === "due") {
      const due = new Set(dueItems(getReviewItems(course)).map((r) => r.id));
      pool = bank.filter((q) => due.has(q.id));
    }
    setDeck(shuffle(pool).slice(0, count));
    setIndex(0);
    setPicked(null);
    setResults([]);
  };

  const answer = (i: number) => {
    if (!deck || picked !== null) return;
    setPicked(i);
    setResults((r) => [...r, { id: deck[index].id, correct: i === deck[index].answer }]);
  };

  const next = () => {
    if (!deck) return;
    if (index + 1 < deck.length) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      recordAnswers(course, results);   // misses join the review queue; repeat hits move up a box
      setIndex(deck.length);
    }
  };

  const q = deck && index < deck.length ? deck[index] : null;
  const finished = deck !== null && index >= deck.length;
  const correct = results.filter((r) => r.correct).length;
  const courseTitle = ALL_COURSES.find((c) => c.slug === course)?.title ?? course;

  return (
    <div className="w-full max-w-[860px] mx-auto pb-20">
      <ToolWorkspaceHeader
        title="Technical Question Drill"
        description="Quick multiple-choice drill from each course's question bank. Questions you miss join that course's spaced-repetition review queue, the same one the mock tests use."
        icon={<Layers className="w-5 h-5" />}
      />

      {deck === null || finished ? (
        <section aria-label="Drill settings" className="p-6 rounded-xl border border-hair bg-card flex flex-col gap-5">
          {finished && deck && (
            <div className="flex flex-col gap-1 pb-4 border-b border-hair">
              <p className="text-[12px] font-bold uppercase tracking-wider text-mute">Drill complete</p>
              <p className="text-3xl font-bold text-ink tabular-nums">{correct} / {deck.length}</p>
              <p className="text-[13.5px] text-body">
                {deck.length - correct > 0
                  ? `${deck.length - correct} missed question${deck.length - correct === 1 ? " was" : "s were"} added to your ${courseTitle} review queue.`
                  : "No misses. Nice work."}{" "}
                <Link href={`/learn/${course}/review`} className={`text-accent-ink underline rounded ${focusRing}`}>Open the review queue</Link>
              </p>
            </div>
          )}
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1.5 text-[13px]">
              <span className="font-semibold text-ink">Course</span>
              <select value={course} onChange={(e) => setCourse(e.target.value)} className={`px-3 py-2 rounded-lg border border-hair bg-card ${focusRing}`}>
                {ALL_COURSES.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[13px]">
              <span className="font-semibold text-ink">Questions</span>
              <select value={count} onChange={(e) => setCount(Number(e.target.value))} className={`px-3 py-2 rounded-lg border border-hair bg-card ${focusRing}`}>
                {[10, 20, 30].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <fieldset className="flex flex-col gap-1.5 text-[13px]">
              <legend className="font-semibold text-ink mb-1.5">Source</legend>
              <label className="flex items-center gap-2"><input type="radio" name="src" checked={source === "random"} onChange={() => setSource("random")} /> Random from the bank</label>
              <label className="flex items-center gap-2"><input type="radio" name="src" checked={source === "due"} onChange={() => setSource("due")} disabled={dueCount === 0} /> Due for review ({dueCount})</label>
            </fieldset>
          </div>
          <p className="text-[12.5px] text-mute">{bank.length} questions available in {courseTitle}.</p>
          <button type="button" onClick={start} disabled={bank.length === 0 || (source === "due" && dueCount === 0)}
            className={`self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-paper text-[14px] font-semibold hover:bg-accent-ink disabled:opacity-50 ${focusRing}`}>
            {finished ? <><RotateCcw aria-hidden="true" className="w-4 h-4" /> Start another drill</> : "Start drill"}
          </button>
        </section>
      ) : q && (
        <section aria-label={`Question ${index + 1} of ${deck.length}`} className="p-6 rounded-xl border border-hair bg-card flex flex-col gap-5">
          <div className="flex items-center justify-between text-[12px] text-mute">
            <span className="font-mono uppercase tracking-wider">{q.moduleTitle}</span>
            <span className="tabular-nums">{index + 1} / {deck.length} · {correct} correct</span>
          </div>
          <div className="h-1 rounded-full bg-hair overflow-hidden" aria-hidden="true">
            <div className="h-full bg-accent transition-[width]" style={{ width: `${(100 * index) / deck.length}%` }} />
          </div>
          <h2 className="text-[17px] font-semibold text-ink leading-snug">{q.question}</h2>
          <div className="flex flex-col gap-2" role="group" aria-label="Options">
            {q.options.map((o, i) => {
              const isAnswer = i === q.answer, chosen = i === picked;
              return (
                <button key={i} type="button" onClick={() => answer(i)} disabled={picked !== null}
                  className={clsx("text-left px-4 py-3 rounded-lg border text-[14px] flex items-center gap-3 transition-colors", focusRing,
                    picked === null && "border-hair hover:border-accent",
                    picked !== null && isAnswer && "border-note bg-success-soft",
                    picked !== null && chosen && !isAnswer && "border-danger bg-danger/5",
                    picked !== null && !isAnswer && !chosen && "border-hair opacity-60")}>
                  <span className="font-mono text-[12px] text-mute">{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{o}</span>
                  {picked !== null && isAnswer && <CheckCircle2 aria-label="Correct answer" className="w-4 h-4 text-note" />}
                  {picked !== null && chosen && !isAnswer && <XCircle aria-label="Your answer" className="w-4 h-4 text-danger" />}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="flex flex-col gap-3" aria-live="polite">
              <p className="text-[13.5px] text-body leading-relaxed">
                <strong className="text-ink">{picked === q.answer ? "Correct. " : "Not quite. "}</strong>{q.explanation}
              </p>
              <div className="flex items-center gap-3">
                <button type="button" onClick={next} autoFocus className={`px-5 py-2 rounded-lg bg-accent text-paper text-[14px] font-semibold hover:bg-accent-ink ${focusRing}`}>
                  {index + 1 < deck.length ? "Next question" : "Finish"}
                </button>
                <Link href={`/learn/${course}/${q.lessonSlug}`} className={`text-[13px] text-accent-ink underline rounded ${focusRing}`}>Read the lesson: {q.lessonTitle}</Link>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
