"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ProfileNavTabs } from "@/components/profile/ProfileNavTabs";
import { PageHeader, Section, Progress } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { useProfile } from "@/components/providers/ProfileProvider";
import { courseProgress } from "@/lib/learn/progress";

export default function MyLearningPathPage() {
  const { draftProfile: profile } = useProfile();
  // client-only render (AppLayout), so local progress is readable on first render
  const [courses] = useState(courseProgress);
  const active = courses.filter((c) => c.done > 0 && c.pct < 100).sort((a, b) => b.pct - a.pct);
  const finished = courses.filter((c) => c.total > 0 && c.pct === 100);
  const upNext = courses.filter((c) => c.done === 0).slice(0, 4);
  const track = profile.identity?.targetRole || profile.careerTracks?.[0] || "Software Engineer";

  return (
    <div className="w-full min-w-0">
      <ProfileNavTabs />
      <PageHeader eyebrow={track} title="Your" hl="path">
        <Link href="/roadmaps" className={buttonClass("secondary", "sm")}>
          Full roadmap <ArrowRight className="size-4" />
        </Link>
      </PageHeader>

      <Section title="In progress" kicker={`${active.length} courses`}>
        {active.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {active.map((c) => (
              <div key={c.slug} className="brut flex flex-col rounded-2xl bg-card p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-mute">{c.category}</p>
                <h3 className="display mt-2 text-[28px]">{c.title}</h3>
                {c.next && <p className="mt-1 text-[14px] text-body">Next: {c.next.title}</p>}
                <div className="mt-auto flex items-end gap-4 pt-5">
                  <Progress value={c.pct} label={`${c.done} of ${c.total} lessons`} className="flex-1" />
                  {c.next && (
                    <Link href={`/learn/${c.slug}/${c.next.slug}`} className={buttonClass("primary", "sm")}>
                      Continue <ArrowRight className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-[1.5px] border-dashed border-hair p-8 text-center">
            <p className="note mb-1">nothing started yet</p>
            <p className="text-[15px] text-body">Open any course and finish a lesson; it shows up here.</p>
          </div>
        )}
      </Section>

      <div className="grid gap-10 lg:grid-cols-2">
        <Section title="Up next" kicker="Not started">
          <ul className="border-t-[1.5px] border-hair">
            {upNext.map((c) => (
              <li key={c.slug} className="border-b-[1.5px] border-hair">
                <Link href={`/learn/${c.slug}`} className="group flex items-center gap-3 px-1 py-3 hover:bg-card-2 md:px-2">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium group-hover:text-accent-ink">{c.title}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-mute">
                      {c.category} · {c.total} lessons
                    </span>
                  </span>
                  <ArrowRight className="size-4 text-mute transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Finished" kicker={`${finished.length} courses`}>
          {finished.length ? (
            <ul className="border-t-[1.5px] border-hair">
              {finished.map((c) => (
                <li key={c.slug} className="flex items-center gap-3 border-b-[1.5px] border-hair px-1 py-3">
                  <CheckCircle2 className="size-5 text-note" aria-hidden />
                  <Link href={`/learn/${c.slug}`} className="flex-1 truncate text-[15px] font-medium hover:text-accent-ink">
                    {c.title}
                  </Link>
                  <span className="font-mono text-[12px] text-mute">{c.total} lessons</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[14px] text-body">Finish every lesson in a course and it lands here.</p>
          )}
        </Section>
      </div>
    </div>
  );
}
