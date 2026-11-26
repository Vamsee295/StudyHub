"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { ProfileNavTabs } from "@/components/profile/ProfileNavTabs";
import { ActivityHeatmap } from "@/components/profile/ActivityHeatmap";
import { PageHeader, Section, Progress } from "@/components/ui/Page";
import { courseProgress } from "@/lib/learn/progress";
import { activityByDay, activityCount, streakOf } from "@/lib/activity";
import { dueItems, getAttempts, getReviewItems } from "@/lib/learn/study";
import { problemStorage } from "@/lib/problems/problemStorage";
import { problems } from "@/lib/problems/problemRegistry";

// Everything on this page is computed from what you've actually done in this browser:
// completed lessons, solved problems, the daily problem, the review queue and mock-test history.
function readStats() {
  const courses = courseProgress();
  const due = courses
    .map((c) => ({ ...c, due: dueItems(getReviewItems(c.slug)).length }))
    .filter((c) => c.due > 0)
    .sort((a, b) => b.due - a.due);
  const tests = courses
    .map((c) => ({ ...c, last: getAttempts(c.slug)[0] }))
    .filter((c) => c.last)
    .sort((a, b) => b.last.at - a.last.at);
  return {
    courses: [...courses].sort((a, b) => (b.done > 0 ? 1 : 0) - (a.done > 0 ? 1 : 0) || b.pct - a.pct),
    lessonsDone: courses.reduce((n, c) => n + c.done, 0),
    lessonsTotal: courses.reduce((n, c) => n + c.total, 0),
    started: courses.filter((c) => c.done > 0).length,
    streak: (() => { const m = activityByDay(); return streakOf((k) => activityCount(m[k]) > 0); })(),
    solved: Object.values(problemStorage.getAllStatuses()).filter((s) => s === "solved").length,
    due,
    tests,
  };
}

export default function ProgressPage() {
  // client-only render (AppLayout), so local progress is readable on first render
  const [s] = useState(readStats);
  const totalProblems = Object.keys(problems).length;
  const kpis = [
    { n: s.lessonsDone, of: s.lessonsTotal, label: "Lessons done" },
    { n: s.started, of: s.courses.length, label: "Courses started" },
    { n: s.solved, of: totalProblems, label: "Problems solved" },
    { n: s.streak, label: "Day streak (any study)" },
  ];

  return (
    <div className="w-full min-w-0">
      <ProfileNavTabs />
      <PageHeader eyebrow="Profile" title="Your" hl="progress" note="counted from what you've actually done" />

      <dl className="mb-12 grid grid-cols-2 gap-x-6 gap-y-6 border-y-[1.5px] border-hair py-6 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label}>
            <dd className="display text-[44px] leading-none tabular-nums">
              {k.n}
              {k.of !== undefined && <span className="text-[22px] text-mute">/{k.of}</span>}
            </dd>
            <dt className="mt-2 font-mono text-[11px] uppercase tracking-wider text-mute">{k.label}</dt>
          </div>
        ))}
      </dl>

      <ActivityHeatmap />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Section title="By course" kicker="Lessons">
          <ul className="border-t-[1.5px] border-hair">
            {s.courses.map((c) => (
              <li key={c.slug} className="border-b-[1.5px] border-hair">
                <Link href={`/learn/${c.slug}`} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-1 py-3 hover:bg-card-2 md:px-2">
                  <span className="truncate text-[15px] font-medium group-hover:text-accent-ink">{c.title}</span>
                  <span className="font-mono text-[12px] tabular-nums text-mute">
                    {c.done}/{c.total}
                  </span>
                  <Progress value={c.pct} className="col-span-2" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <aside className="flex flex-col gap-8">
          <section>
            <h2 className="eyebrow mb-3">Due for review</h2>
            {s.due.length ? (
              <ul className="border-t-[1.5px] border-hair">
                {s.due.map((c) => (
                  <li key={c.slug} className="border-b-[1.5px] border-hair">
                    <Link href={`/learn/${c.slug}/review`} className="group flex items-center gap-3 px-1 py-3 text-[14px] hover:bg-card-2">
                      <RotateCcw className="size-4 text-accent" aria-hidden />
                      <span className="flex-1 truncate font-medium">{c.title}</span>
                      <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] text-paper">{c.due}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-body">Nothing due. Questions you miss in quizzes and tests come back here.</p>
            )}
          </section>

          <section>
            <h2 className="eyebrow mb-3">Last mock tests</h2>
            {s.tests.length ? (
              <ul className="border-t-[1.5px] border-hair">
                {s.tests.slice(0, 5).map((c) => (
                  <li key={c.slug} className="flex items-center gap-3 border-b-[1.5px] border-hair px-1 py-3 text-[14px]">
                    <span className="min-w-0 flex-1 truncate font-medium">{c.title}</span>
                    <span className="display text-[22px] tabular-nums">{Math.round((100 * c.last.correct) / c.last.total)}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-body">
                No tests yet.{" "}
                <Link href="/learn" className="font-semibold text-accent-ink hover:underline">
                  Pick a course and take one <ArrowRight className="inline size-3.5" />
                </Link>
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
