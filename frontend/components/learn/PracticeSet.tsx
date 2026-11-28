"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { CheckCircle2, XCircle } from "lucide-react";
import { practiceFor, type PracticeQ } from "@/lib/aptitude/practice/index";
import { DataView } from "./DataView";

const LEVELS = ["All", "Easy", "Medium", "Hard"] as const;

/** Up to 30 practice questions for an aptitude lesson: answer, check, read the worked solution. */
export function PracticeSet({ course, lesson }: { course: string; lesson: string }) {
  const all = useMemo(() => practiceFor(course, lesson), [course, lesson]);
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");
  const [picked, setPicked] = useState<Record<string, number>>({});
  if (!all.length) return null;
  const shown = level === "All" ? all : all.filter((q) => q.level === level);
  const answered = all.filter((q) => q.id in picked);
  const right = answered.filter((q) => picked[q.id] === q.answer).length;

  return (
    <section aria-labelledby="practice-set" className="flex flex-col gap-4 rounded-2xl border-[1.5px] border-hair bg-card p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="practice-set" className="label-cond text-[22px]">Practice: {all.length} questions</h2>
          <p className="text-[13px] text-body">Pick an answer to see if it&apos;s right and read the worked solution.</p>
        </div>
        <p className="font-mono text-[13px] text-mute">
          {right} / {answered.length} correct
        </p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Difficulty">
        {LEVELS.map((l) => (
          <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(l)}
            className={clsx("rounded-full border-[1.5px] px-3 py-1 text-[13px] font-medium", level === l ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line")}>
            {l}
          </button>
        ))}
      </div>
      <ol className="flex flex-col gap-3">
        {shown.map((q) => (
          <Question key={q.id} q={q} n={all.indexOf(q) + 1} pick={picked[q.id]} onPick={(i) => setPicked((p) => (q.id in p ? p : { ...p, [q.id]: i }))} />
        ))}
      </ol>
    </section>
  );
}

function Question({ q, n, pick, onPick }: { q: PracticeQ; n: number; pick?: number; onPick: (i: number) => void }) {
  const done = pick !== undefined;
  return (
    <li className="rounded-xl border-[1.5px] border-hair bg-paper p-3">
      <p className="font-mono text-[11px] uppercase tracking-wider text-mute">
        Q{n} · {q.level}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-[15px]">{q.q}</p>
      {q.code && <pre className="mt-2 overflow-x-auto rounded-lg border-[1.5px] border-hair bg-card p-3 font-mono text-[13px] leading-relaxed">{q.code}</pre>}
      {q.data && <DataView data={q.data} />}
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {q.options.map((o, i) => (
          <button key={i} type="button" disabled={done} onClick={() => onPick(i)}
            className={clsx("rounded-lg border-[1.5px] px-3 py-2 text-left text-[14px]",
              !done && "border-hair hover:border-line",
              done && i === q.answer && "border-success-line bg-success-soft",
              done && i === pick && i !== q.answer && "border-danger-line bg-danger-soft",
              done && i !== q.answer && i !== pick && "border-hair opacity-60")}>
            {String.fromCharCode(65 + i)}. {o}
          </button>
        ))}
      </div>
      {done && (
        <p className={clsx("mt-2 flex gap-1.5 text-[13.5px]", pick === q.answer ? "text-note" : "text-danger")}>
          {pick === q.answer ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <XCircle className="mt-0.5 size-4 shrink-0" />}
          <span className="text-body">{q.explanation}</span>
        </p>
      )}
    </li>
  );
}
