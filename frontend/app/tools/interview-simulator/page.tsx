"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { AlertTriangle, ArrowRight, Check, Eye, RotateCcw, Timer } from "lucide-react";
import { ToolWorkspaceHeader } from "@/components/tools/shared/ToolWorkspaceHeader";
import { buttonClass } from "@/components/ui/Button";
import {
  buildInterview,
  interviewSubjects,
  type InterviewQuestion,
  type InterviewResult,
  type SelfRating,
} from "@/lib/services/tools/interviewService";

const COUNTS = [5, 10, 15];
const TARGET_SECONDS = 120; // a spoken technical answer usually fits in about two minutes

const RATINGS: { id: SelfRating; label: string; hint: string; cls: string }[] = [
  { id: "nailed", label: "Nailed it", hint: "I covered the model answer's points", cls: "border-note text-note" },
  { id: "partly", label: "Partly", hint: "I had the idea but missed points", cls: "border-gold text-ink" },
  { id: "missed", label: "Missed it", hint: "I didn't know, or fell into the trap", cls: "border-accent/70 text-accent-ink" },
];

/** Course text marks code with backticks; show those parts as inline code. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/`([^`]+)`/).map((part, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-paper-2 px-1 py-px font-mono text-[0.9em]">
            {part}
          </code>
        ) : (
          part
        )
      )}
    </>
  );
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/* ───────────── setup ───────────── */

function Setup({ onStart }: { onStart: (subject: string, count: number) => void }) {
  const subjects = useMemo(() => interviewSubjects(), []);
  const total = subjects.reduce((n, s) => n + s.count, 0);
  const [subject, setSubject] = useState("all");
  const [count, setCount] = useState(10);
  const available = subject === "all" ? total : (subjects.find((s) => s.slug === subject)?.count ?? 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section aria-labelledby="pick" className="rounded-2xl border-[1.5px] border-hair bg-card p-6">
        <h2 id="pick" className="eyebrow mb-3">
          1 · Pick a subject
        </h2>
        <div className="flex flex-wrap gap-2">
          {[{ slug: "all", title: "Mixed", count: total }, ...subjects].map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setSubject(s.slug)}
              aria-pressed={subject === s.slug}
              className={clsx(
                "label-cond flex items-center gap-2 rounded-full border-[1.5px] px-3.5 py-1.5 text-[15px]",
                subject === s.slug ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line hover:text-ink"
              )}
            >
              {s.title}
              <span className={clsx("font-mono text-[11px]", subject === s.slug ? "text-paper/70" : "text-mute")}>{s.count}</span>
            </button>
          ))}
        </div>

        <h2 className="eyebrow mb-3 mt-8">2 · How many questions</h2>
        <div role="radiogroup" aria-label="How many questions" className="inline-flex gap-1 rounded-xl border-[1.5px] border-hair p-1">
          {COUNTS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={count === c}
              disabled={c > available && c !== COUNTS[0]}
              onClick={() => setCount(c)}
              className={clsx(
                "label-cond rounded-lg px-4 py-1.5 text-[16px] disabled:opacity-40",
                count === c ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/[0.06]"
              )}
            >
              {c}
            </button>
          ))}
        </div>
        {available < count && <p className="mt-2 text-[13px] text-mute">This subject has {available}; you&apos;ll get all of them.</p>}

        <button type="button" onClick={() => onStart(subject, count)} className={clsx(buttonClass("primary"), "mt-8")}>
          Start the interview <ArrowRight className="size-4" />
        </button>
      </section>

      <aside className="rounded-2xl border-[1.5px] border-hair bg-paper-2 p-6 text-[14px] leading-relaxed text-body">
        <p className="eyebrow mb-3">How it works</p>
        <ol className="space-y-3">
          {[
            "Read the question and answer it out loud, as you would in the room. Jot your key points in the box if it helps.",
            "Reveal the model answer and the trap: the weak answer interviewers hear too often.",
            "Rate yourself honestly. The summary lists what to reread, with a link to each lesson.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="font-mono text-[12px] font-bold leading-6 text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 border-t-[1.5px] border-hair pt-4 text-[13px] text-mute">
          Questions come from the courses&apos; interview sections. Nothing is graded by a machine, so the rating is only as useful as you are honest.
        </p>
      </aside>
    </div>
  );
}

/* ───────────── one question ───────────── */

function QuestionCard({
  q,
  index,
  total,
  onRate,
}: {
  q: InterviewQuestion;
  index: number;
  total: number;
  onRate: (r: { answer: string; rating: SelfRating; seconds: number }) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // the clock runs while you think and answer, and stops when you reveal
  useEffect(() => {
    if (revealed) return;
    timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [revealed]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-3 font-mono text-[12px] uppercase tracking-wider text-mute">
        <span>
          Question {index + 1} of {total} · {q.courseTitle}
        </span>
        <span className={clsx("flex items-center gap-1.5 tabular-nums", seconds > TARGET_SECONDS && !revealed && "text-accent-ink")} aria-label="Time on this question">
          <Timer className="size-3.5" aria-hidden /> {clock(seconds)}
        </span>
      </div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-ink/10" aria-hidden>
        <div className="h-full rounded-full bg-accent" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <div className="brut rounded-2xl bg-card p-6 md:p-8">
        <p className="eyebrow mb-3">The interviewer asks</p>
        <h2 className="text-[20px] font-semibold leading-snug md:text-[24px]"><Rich text={q.question} /></h2>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">Your answer or key points (optional)</span>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            readOnly={revealed}
            rows={5}
            placeholder="Say it out loud first, then note the points you made…"
            className="w-full resize-y rounded-xl border-2 border-hair bg-card px-3.5 py-3 text-[16px] leading-relaxed text-ink outline-none transition-colors placeholder:text-mute focus:border-accent read-only:bg-paper-2 md:text-[15px]"
          />
        </label>

        {!revealed ? (
          <button type="button" onClick={() => setRevealed(true)} className={clsx(buttonClass("primary"), "mt-5")}>
            <Eye className="size-4" /> Reveal the model answer
          </button>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border-[1.5px] border-note/40 bg-note/[0.07] p-4">
              <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-note">
                <Check className="size-3.5" aria-hidden /> A strong answer
              </p>
              <p className="text-[15px] leading-relaxed text-ink"><Rich text={q.answer} /></p>
            </div>
            {q.trap && (
              <div className="rounded-xl border-[1.5px] border-accent/40 bg-accent/[0.07] p-4">
                <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-ink">
                  <AlertTriangle className="size-3.5" aria-hidden /> The trap
                </p>
                <p className="text-[15px] leading-relaxed text-ink"><Rich text={q.trap} /></p>
              </div>
            )}
            {q.lesson && (
              <Link href={q.lesson.href} target="_blank" className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink hover:underline">
                From: {q.lesson.title} <ArrowRight className="size-3.5" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </Link>
            )}

            <fieldset className="border-t-[1.5px] border-hair pt-5">
              <legend className="mb-3 text-[14px] font-semibold">How did your answer compare?</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {RATINGS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onRate({ answer, rating: r.id, seconds })}
                    className={clsx("rounded-xl border-2 bg-card px-4 py-3 text-left hover:bg-card-2", r.cls)}
                  >
                    <span className="label-cond block text-[18px]">{r.label}</span>
                    <span className="block text-[12.5px] text-body">{r.hint}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────── summary ───────────── */

function Summary({ results, onRestart }: { results: InterviewResult[]; onRestart: () => void }) {
  const tally = (r: SelfRating) => results.filter((x) => x.rating === r).length;
  const toReread = results.filter((x) => x.rating !== "nailed");
  const avg = Math.round(results.reduce((n, r) => n + r.seconds, 0) / Math.max(1, results.length));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="brut rounded-2xl bg-card p-6 md:p-8">
        <p className="eyebrow">Interview done</p>
        <h2 className="display mt-2 text-[36px] md:text-[44px]">Your self-review</h2>
        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Nailed it", tally("nailed"), "text-note"],
            ["Partly", tally("partly"), "text-ink"],
            ["Missed it", tally("missed"), "text-accent-ink"],
            ["Avg. time", clock(avg), "text-ink"],
          ].map(([label, value, cls]) => (
            <div key={label as string} className="rounded-xl border-[1.5px] border-hair p-4">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">{label}</dt>
              <dd className={clsx("display mt-1 text-[36px] tabular-nums", cls as string)}>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[14px] text-body">
          {avg > TARGET_SECONDS
            ? `You averaged over two minutes per answer. In the room, lead with the main point in a sentence, then add detail.`
            : `Your answers averaged under two minutes, a comfortable length for a spoken technical answer.`}
        </p>
      </div>

      {toReread.length > 0 && (
        <section className="mt-8">
          <h3 className="eyebrow mb-3">Reread these ({toReread.length})</h3>
          <ul className="divide-y divide-hair overflow-hidden rounded-xl border-[1.5px] border-hair bg-card">
            {toReread.map((r) => (
              <li key={r.question.id} className="flex flex-col gap-1.5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="min-w-0">
                  <span className={clsx("mr-2 font-mono text-[11px] uppercase", r.rating === "missed" ? "text-accent-ink" : "text-mute")}>
                    {r.rating === "missed" ? "Missed" : "Partly"}
                  </span>
                  <span className="text-[14px]"><Rich text={r.question.question} /></span>
                </span>
                {r.question.lesson && (
                  <Link href={r.question.lesson.href} className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-accent-ink hover:underline">
                    Reread <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <button type="button" onClick={onRestart} className={clsx(buttonClass("secondary"), "mt-8")}>
        <RotateCcw className="size-4" /> Start another interview
      </button>
    </div>
  );
}

/* ───────────── page ───────────── */

export default function InterviewSimulatorPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[] | null>(null);
  const [results, setResults] = useState<InterviewResult[]>([]);
  const index = results.length;
  const finished = questions !== null && index >= questions.length;

  const start = (subject: string, count: number) => {
    setQuestions(buildInterview(subject, count));
    setResults([]);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="w-full min-w-0">
      <ToolWorkspaceHeader
        title="Mock Interview"
        badge="Interview prep"
        description="Real interview questions from the courses. Answer out loud, then compare with a model answer and the trap interviewers watch for."
      />
      {!questions && <Setup onStart={start} />}
      {questions && !finished && (
        <QuestionCard
          key={questions[index].id}
          q={questions[index]}
          index={index}
          total={questions.length}
          onRate={(r) => {
            setResults((prev) => [...prev, { question: questions[index], ...r }]);
            window.scrollTo({ top: 0 });
          }}
        />
      )}
      {finished && <Summary results={results} onRestart={() => setQuestions(null)} />}
    </div>
  );
}
