"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, CheckCircle2, Code2, ExternalLink, Loader2 } from "lucide-react";
import { problemIdForTitle } from "@/lib/data/companyPrep";
import { problemStorage } from "@/lib/problems/problemStorage";
import {
  COMPANY_DATA_SOURCE,
  DIFFICULTY,
  PERIODS,
  loadCompanyQuestions,
  type CompanyEntry,
  type CompanyQuestion,
} from "@/lib/data/companyData";

const PAGE = 25;
const pill = (d: CompanyQuestion["d"]) =>
  d === "H" ? "border-danger-line bg-danger-soft text-danger" : d === "M" ? "border-warning-line bg-warning-soft text-warning" : "border-success-line bg-success-soft text-note";
const chip = (on: boolean) =>
  clsx("rounded-full border-[1.5px] px-3 py-1 text-[13px] font-medium transition-colors", on ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line hover:text-ink");

/** The questions this company is reported to ask, filterable, with what you've already solved here. */
export function CompanyQuestions({ company }: { company: CompanyEntry }) {
  const [data, setData] = useState<{ id: string; asOf: string; questions: CompanyQuestion[] } | { id: string; error: true } | null>(null);
  const [period, setPeriod] = useState(3);
  const [diff, setDiff] = useState<CompanyQuestion["d"] | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [hideSolved, setHideSolved] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [statuses] = useState(() => problemStorage.getAllStatuses());

  useEffect(() => {
    let live = true;
    loadCompanyQuestions(company.id)
      .then((d) => live && setData({ id: company.id, ...d }))
      .catch(() => live && setData({ id: company.id, error: true }));
    return () => {
      live = false;
    };
  }, [company.id]);

  const ready = data && data.id === company.id && "questions" in data ? data : null;
  const all = useMemo(
    () => (ready?.questions ?? []).map((q) => ({ ...q, pid: problemIdForTitle(q.t) })),
    [ready]
  );
  const inPeriod = useMemo(() => all.filter((q) => q.r <= period), [all, period]);
  const topics = useMemo(() => {
    const m = new Map<string, number>();
    for (const q of inPeriod) for (const t of q.tp) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [inPeriod]);
  const list = inPeriod.filter(
    (q) => (!diff || q.d === diff) && (!topic || q.tp.includes(topic)) && (!hideSolved || !(q.pid && statuses[q.pid] === "solved"))
  );
  const here = inPeriod.filter((q) => q.pid);
  const solvedHere = here.filter((q) => statuses[q.pid!] === "solved").length;
  const max = topics[0]?.[1] ?? 1;

  // filters change → back to the first page
  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setShown(PAGE);
  };

  return (
    <section aria-labelledby="company-questions" className="flex flex-col gap-5">
      <div>
        <h3 id="company-questions" className="label-cond text-[20px]">
          Questions {company.name} is reported to ask
        </h3>
        <p className="text-[13px] text-body">
          {company.counts.total.toLocaleString()} coding questions candidates reported from {company.name} interviews and tests, most frequent first.
          {company.counts.d30 > 0 && ` ${company.counts.d30} were reported in the last 30 days.`}
        </p>
      </div>

      {!ready ? (
        data && "error" in data && data.id === company.id ? (
          <p className="rounded-xl border-[1.5px] border-hair bg-paper p-4 text-[14px] text-body">Couldn&apos;t load the questions. Check your connection and reopen the company.</p>
        ) : (
          <p className="flex items-center gap-2 text-[14px] text-mute">
            <Loader2 aria-hidden className="size-4 animate-spin" /> Loading questions…
          </p>
        )
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            {/* where the questions come from: topics */}
            <div className="flex flex-col gap-2 rounded-2xl border-[1.5px] border-hair bg-paper p-4">
              <p className="eyebrow">Most-tested topics · {PERIODS[period].toLowerCase()}</p>
              {topics.length === 0 ? (
                <p className="text-[13px] text-mute">Nothing reported in this period.</p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {topics.map(([t, n]) => (
                    <li key={t}>
                      <button
                        type="button"
                        aria-pressed={topic === t}
                        onClick={() => reset(setTopic)(topic === t ? null : t)}
                        className="group grid w-full grid-cols-[minmax(0,9rem)_1fr_2.5rem] items-center gap-2 text-left text-[13px]"
                      >
                        <span className={clsx("truncate", topic === t ? "font-semibold text-accent-ink" : "text-body group-hover:text-ink")}>{t}</span>
                        <span className="h-2 overflow-hidden rounded-full bg-paper-2">
                          <span className={clsx("block h-full rounded-full", topic === t ? "bg-accent" : "bg-ink/60 group-hover:bg-ink")} style={{ width: `${(100 * n) / max}%` }} />
                        </span>
                        <span className="text-right font-mono text-[12px] text-mute">{n}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-1 text-[12px] text-mute">Tap a topic to filter. Learn it first in Practice, where every topic has a pattern guide.</p>
            </div>

            {/* your progress on the ones StudyHub has */}
            <div className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-hair bg-paper p-4">
              <p className="eyebrow">Your progress</p>
              <p className="text-[15px] text-ink">
                <b className="display text-[30px] leading-none">{solvedHere}</b> of {here.length} solved
              </p>
              <p className="text-[13px] text-body">
                {here.length} of these {inPeriod.length} questions are in StudyHub&apos;s problem set, so you can solve them here and track them. The rest open on LeetCode.
              </p>
              {here.length > 0 && (
                <Link href={`/practice/problems?company=${encodeURIComponent(company.name)}`} className="inline-flex items-center gap-1 self-start text-[13.5px] font-semibold text-accent-ink hover:underline">
                  Practise them in the problem set <ArrowRight aria-hidden className="size-3.5" />
                </Link>
              )}
              <div className="flex h-2.5 overflow-hidden rounded-full bg-paper-2" aria-hidden>
                {(["E", "M", "H"] as const).map((d) => (
                  <span
                    key={d}
                    className={d === "E" ? "bg-note" : d === "M" ? "bg-warning" : "bg-danger"}
                    style={{ width: `${(100 * inPeriod.filter((q) => q.d === d).length) / Math.max(1, inPeriod.length)}%` }}
                  />
                ))}
              </div>
              <p className="font-mono text-[12px] text-mute">
                {(["E", "M", "H"] as const).map((d) => `${inPeriod.filter((q) => q.d === d).length} ${DIFFICULTY[d].toLowerCase()}`).join(" · ")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="When it was reported">
              {PERIODS.map((p, i) => (
                <button key={p} type="button" aria-pressed={period === i} onClick={() => reset(setPeriod)(i)} className={clsx(chip(period === i), "shrink-0")}>
                  {p}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Difficulty">
              {([null, "E", "M", "H"] as const).map((d) => (
                <button key={d ?? "all"} type="button" aria-pressed={diff === d} onClick={() => reset(setDiff)(d)} className={chip(diff === d)}>
                  {d ? DIFFICULTY[d] : "Any difficulty"}
                </button>
              ))}
              <label className="ml-auto flex items-center gap-2 text-[13px] text-body">
                <input type="checkbox" checked={hideSolved} onChange={(e) => reset(setHideSolved)(e.target.checked)} className="size-4 accent-[var(--accent)]" />
                Hide solved
              </label>
            </div>
            {topic && (
              <p className="text-[13px] text-body">
                Topic: <b>{topic}</b>{" "}
                <button type="button" onClick={() => reset(setTopic)(null)} className="text-accent-ink underline">
                  clear
                </button>
              </p>
            )}
          </div>

          {list.length === 0 ? (
            <p className="rounded-xl border-[1.5px] border-dashed border-hair p-6 text-center text-[14px] text-body">No questions match these filters. Try a longer period.</p>
          ) : (
            <ol className="border-t-[1.5px] border-hair">
              {list.slice(0, shown).map((q, i) => {
                const solved = q.pid && statuses[q.pid] === "solved";
                return (
                  <li key={q.s} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b-[1.5px] border-hair py-3 sm:grid-cols-[2rem_minmax(0,1fr)_7rem_auto]">
                    <span className="font-mono text-[12px] text-mute">{i + 1}</span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        {solved && <CheckCircle2 aria-label="Solved" className="size-4 shrink-0 text-note" />}
                        <span className="text-[15px] font-semibold leading-snug">{q.t}</span>
                        <span className={clsx("rounded-full border-[1.5px] px-2 py-px font-mono text-[10px] uppercase tracking-wider", pill(q.d))}>{DIFFICULTY[q.d]}</span>
                        {q.r === 0 && <span className="rounded-full bg-accent/15 px-2 py-px font-mono text-[10px] uppercase tracking-wider text-accent-ink">Recent</span>}
                      </span>
                      <span className="mt-0.5 block truncate text-[12.5px] text-mute">{q.tp.slice(0, 3).join(" · ")}</span>
                    </span>
                    {/* how often it's reported, relative to the company's most-asked question */}
                    <span className="hidden items-center gap-2 sm:flex" title={`Reported frequency ${q.f} of 100`}>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2">
                        <span className="block h-full rounded-full bg-ink/60" style={{ width: `${q.f}%` }} />
                      </span>
                      <span className="w-7 text-right font-mono text-[11px] text-mute">{Math.round(q.f)}</span>
                    </span>
                    {q.pid ? (
                      <Link href={`/practice/problems/${q.pid}`} className="inline-flex items-center gap-1 font-mono text-[12px] uppercase tracking-wider text-accent-ink hover:underline">
                        <Code2 aria-hidden className="size-3.5" /> {solved ? "Again" : "Solve"}
                      </Link>
                    ) : (
                      <a
                        href={`https://leetcode.com/problems/${q.s}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[12px] uppercase tracking-wider text-body hover:text-ink hover:underline"
                      >
                        LeetCode <ExternalLink aria-hidden className="size-3" />
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
          {list.length > shown && (
            <button type="button" onClick={() => setShown((n) => n + PAGE)} className="self-center rounded-full border-[1.5px] border-hair px-4 py-1.5 text-[13.5px] font-semibold hover:border-line">
              Show {Math.min(PAGE, list.length - shown)} more of {list.length - shown}
            </button>
          )}
          <p className="text-[12px] leading-relaxed text-mute">
            Frequency is how often a question is tagged for {company.name} relative to its most-asked one. From LeetCode&apos;s company tags, collected by the open{" "}
            <a href={COMPANY_DATA_SOURCE} target="_blank" rel="noopener noreferrer" className="underline">
              leetcode-company-wise-problems
            </a>{" "}
            project, updated {new Date(ready.asOf).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}. Real interviews also include aptitude, core CS and HR rounds.
          </p>
        </>
      )}
    </section>
  );
}
