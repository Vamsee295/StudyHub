"use client";

import { useState } from "react";
import Link from "next/link";
import { COMPANIES, COMPANY_DATA_SOURCE } from "@/lib/data/companyData";
import { DEMAND_TOTAL, lessonFor, topicDemand } from "@/lib/learn/interviewDemand";

const SHOW = 10;

/** What interviews actually test, from every company's reported questions, with where to learn each topic. */
export function InterviewDemand() {
  const [all, setAll] = useState(false);
  const rows = topicDemand();
  const max = rows[0]?.share ?? 1;

  return (
    <div className="flex flex-col gap-4">
      <ol className="grid gap-x-8 md:grid-cols-2">
        {rows.slice(0, all ? rows.length : SHOW).map((r, i) => {
          const lesson = lessonFor(r.topic);
          return (
            <li key={r.topic} className="flex flex-col gap-1.5 border-b-[1.5px] border-hair py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex items-baseline gap-2">
                  <span className="w-5 font-mono text-[12px] text-mute">{i + 1}</span>
                  <span className="text-[15.5px] font-semibold">{r.topic}</span>
                </span>
                <span className="font-mono text-[13px] font-semibold tabular-nums">{Math.round(r.share * 100)}%</span>
              </div>
              <span className="ml-7 h-2 overflow-hidden rounded-full bg-paper-2" aria-hidden>
                <span className="block h-full rounded-full bg-accent" style={{ width: `${(100 * r.share) / max}%` }} />
              </span>
              <div className="ml-7 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[12.5px]">
                <span className="text-mute">
                  Asked at {r.companies} of {COMPANIES.length} companies · biggest focus at {r.top.map((c) => c.name).join(", ")}
                </span>
                <span className="flex gap-3 font-semibold">
                  {lesson && (
                    <Link href={lesson.href} className="text-accent-ink hover:underline" title={lesson.title}>
                      Learn
                    </Link>
                  )}
                  <Link href={r.topic === "SQL" ? "/practice/sql" : `/practice/problems?topic=${encodeURIComponent(r.topic)}`} className="text-body hover:text-ink hover:underline">
                    Practise
                  </Link>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      {rows.length > SHOW && (
        <button type="button" onClick={() => setAll((v) => !v)} className="self-start rounded-full border-[1.5px] border-hair px-4 py-1.5 text-[13.5px] font-semibold hover:border-line">
          {all ? "Show fewer" : `Show all ${rows.length} topics`}
        </button>
      )}
      <p className="text-[12px] leading-relaxed text-mute">
        Share of {DEMAND_TOTAL.toLocaleString()} coding questions candidates reported from {COMPANIES.length} companies (one question can use several topics), from LeetCode&apos;s company tags via{" "}
        <a href={COMPANY_DATA_SOURCE} target="_blank" rel="noopener noreferrer" className="underline">
          leetcode-company-wise-problems
        </a>
        . Aptitude, core CS and HR rounds aren&apos;t in this data, so they still matter.
      </p>
    </div>
  );
}
