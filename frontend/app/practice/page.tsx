"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Code2, Database, ExternalLink, Flame, ListChecks, type LucideIcon } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/Page";
import { PracticePath } from "@/components/practice/PracticePath";
import { AskedInInterviews } from "@/components/practice/AskedInInterviews";
import { PRACTICE_RESOURCES } from "@/lib/data/patterns";
import { practiceApi } from "@/lib/api/practice";
import { problemStorage } from "@/lib/problems/problemStorage";
import { problems } from "@/lib/problems/problemRegistry";
import { activityByDay, streakOf } from "@/lib/activity";
import { dateKey } from "@/lib/learn/dailyCode";

// Backend timestamps are naive UTC
const parseUtc = (s: string) => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`);

const totalProblems = Object.keys(problems).length;
const askedProblems = Object.values(problems).filter((p) => p.companies?.length).length;

const spaces: { href: string; title: string; body: string; tags: string[]; icon: LucideIcon; cta: string }[] = [
  {
    href: "/practice/problems",
    title: "Problems",
    body: `${totalProblems} problems, from beginner warm-ups to interview level, with tests and hints. ${askedProblems} of them have been reported in real interviews.`,
    tags: ["Arrays", "Graphs", "DP"],
    icon: ListChecks,
    cta: "Browse problems",
  },
  {
    href: "/practice/sql",
    title: "SQL lab",
    body: "Write queries against practice databases, with the schema beside you and real results.",
    tags: ["Editor", "Schema", "Results"],
    icon: Database,
    cta: "Open SQL lab",
  },
  {
    href: "/practice/code",
    title: "Code playground",
    body: "A multi-file editor with tabs, a file explorer and real execution.",
    tags: ["Python", "Java", "C", "C++"],
    icon: Code2,
    cta: "Open playground",
  },
];

export default function PracticeHubPage() {
  // client-only render (AppLayout), so local problem progress is readable on first render
  const [solved] = useState(() => Object.values(problemStorage.getAllStatuses()).filter((s) => s === "solved").length);
  // Practice days: a problem solved or the daily problem solved (local), plus finished sprints (from the server).
  const [localDays] = useState(() => {
    const m = activityByDay();
    return Object.keys(m).filter((k) => m[k].problems > 0 || m[k].daily);
  });
  const [sprintDays, setSprintDays] = useState<string[]>([]);
  const practiceDays = new Set([...localDays, ...sprintDays]);
  const streakDays = streakOf((k) => practiceDays.has(k));

  useEffect(() => {
    practiceApi
      .getLedger()
      .then((res) => res.ledger && setSprintDays(res.ledger.map((l) => dateKey(parseUtc(l.completed_at)))))
      .catch((err) => console.error("Failed to load practice ledger", err));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Practice" title="Write the" hl="code">
        <dl className="flex gap-8 text-right max-md:text-left">
          <div>
            <dd className="display text-[44px] leading-none tabular-nums">
              {solved}
              <span className="text-[24px] text-mute">/{totalProblems}</span>
            </dd>
            <dt className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mute">Solved</dt>
          </div>
          <div>
            <dd className="flex items-center justify-end gap-1 display text-[44px] leading-none tabular-nums max-md:justify-start">
              <Flame className={streakDays > 0 ? "size-8 text-accent" : "size-8 text-mute"} aria-hidden />
              {streakDays}
            </dd>
            <dt className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mute" title="Days in a row with a problem solved, the daily problem solved or a sprint finished">
              Day streak
            </dt>
          </div>
        </dl>
      </PageHeader>

      <div className="mb-12 grid gap-5 md:grid-cols-3">
        {spaces.map(({ href, title, body, tags, icon: Icon, cta }) => (
          <Link key={href} href={href} className="brut brut-hover no-press group flex flex-col rounded-2xl bg-card p-6">
            <Icon className="size-7 text-accent" aria-hidden />
            <h2 className="display mt-5 text-[34px]">{title}</h2>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-body">{body}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <li key={t} className="rounded-full border-[1.5px] border-hair px-2.5 py-0.5 font-mono text-[11px] text-body">
                  {t}
                </li>
              ))}
            </ul>
            <span className="label-cond mt-5 flex items-center gap-1 text-[17px]">
              {cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <Section title="From zero to pro" kicker="Your path">
        <p className="-mt-2 mb-5 max-w-2xl text-[15px] text-body">
          Practise topics in this order, easy problems first. Every topic has a guide with a picture of the pattern: open &ldquo;How it works&rdquo; on the problem list, or &ldquo;Pattern&rdquo; inside any problem.
        </p>
        <PracticePath />
      </Section>

      <AskedInInterviews />

      <Section title="Practise more, free" kicker="Resources">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICE_RESOURCES.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col rounded-2xl border-[1.5px] border-hair bg-card p-4 transition-colors hover:border-ink/40">
                <span className="flex items-center justify-between gap-2 text-[15px] font-semibold group-hover:text-accent-ink">
                  {r.title}
                  <ExternalLink aria-hidden className="size-3.5 shrink-0 text-mute" />
                </span>
                <span className="mt-1 text-[13.5px] text-body">{r.why}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
