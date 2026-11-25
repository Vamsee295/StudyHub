"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Code2, Database, ListChecks, type LucideIcon } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/Page";
import { practiceApi, PracticeSet } from "@/lib/api/practice";
import { problemStorage } from "@/lib/problems/problemStorage";
import { problems } from "@/lib/problems/problemRegistry";

// Backend timestamps are naive UTC
const parseUtc = (s: string) => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`);

// Consecutive days with a completed sprint, ending today (or yesterday, so the streak survives until today is over)
function streakFrom(dates: Date[]) {
  const days = new Set(dates.map((d) => d.toDateString()));
  const cursor = new Date();
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (days.has(cursor.toDateString())) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

type MappedSession = { id: string; title: string; score: number; totalQuestions: number; durationStr: string; completedDate: string; track: string };

const totalProblems = Object.keys(problems).length;

const spaces: { href: string; title: string; body: string; tags: string[]; icon: LucideIcon; cta: string }[] = [
  {
    href: "/practice/problems",
    title: "Problems",
    body: `${totalProblems} problems (beginner warm-ups to interview level) with tests, hints and a review after you submit.`,
    tags: ["Arrays", "Linked lists", "DP"],
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
  const [recent, setRecent] = useState<MappedSession[]>([]);
  const [sprints, setSprints] = useState<PracticeSet[]>([]);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    practiceApi
      .getPracticeSets()
      .then((res) => setSprints(res.sets ?? []))
      .catch((err) => console.error("Failed to load practice sets", err));
    practiceApi
      .getLedger()
      .then((res) => {
        if (!res.ledger) return;
        setStreakDays(streakFrom(res.ledger.map((l) => parseUtc(l.completed_at))));
        setRecent(
          res.ledger.slice(0, 5).map((l) => ({
            id: l.id,
            title: l.title,
            score: l.score,
            totalQuestions: l.total_questions,
            durationStr: `${Math.round(l.duration_seconds / 60)}m ${l.duration_seconds % 60}s`,
            completedDate: parseUtc(l.completed_at).toLocaleDateString(),
            track: l.domain,
          }))
        );
      })
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
            <dd className="display text-[44px] leading-none tabular-nums">{streakDays}</dd>
            <dt className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mute">Sprint streak</dt>
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

      {sprints.length > 0 && (
        <Section title="Timed sprints" kicker="Against the clock">
          <ul className="border-t-[1.5px] border-hair">
            {sprints.map((s) => (
              <li key={s.id} className="border-b-[1.5px] border-hair">
                <Link href={`/practice/session/${s.id}`} className="group flex items-center gap-4 px-1 py-3 hover:bg-card-2 md:px-2">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium group-hover:text-accent-ink">{s.title}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-mute">
                      {s.domain} · {s.difficulty}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[12px] text-mute">
                    <Clock className="size-3.5" aria-hidden /> {s.estimated_minutes} min
                  </span>
                  <ArrowRight className="size-4 text-mute transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Recent sessions" kicker="History">
        {recent.length > 0 ? (
          <ul className="border-t-[1.5px] border-hair">
            {recent.map((s) => (
              <li key={s.id} className="border-b-[1.5px] border-hair">
                <Link href={`/practice/review/${s.id}`} className="group flex items-center gap-4 px-1 py-3 hover:bg-card-2 md:px-2">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium group-hover:text-accent-ink">{s.title}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-mute">
                      {s.track} · {s.completedDate} · {s.durationStr}
                    </span>
                  </span>
                  <span className="display text-[26px] tabular-nums">
                    {s.score}
                    <span className="text-[16px] text-mute">/{s.totalQuestions}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border-[1.5px] border-dashed border-hair p-8 text-center">
            <p className="note mb-1">nothing yet</p>
            <p className="text-[15px] text-body">Finished sprints show up here with their score.</p>
          </div>
        )}
      </Section>
    </>
  );
}
