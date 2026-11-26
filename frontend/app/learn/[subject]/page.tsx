"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, ChevronRight, ClipboardCheck, ExternalLink, FileText, ListOrdered, Loader2, RotateCcw } from "lucide-react";
import { COURSE_RESOURCES } from "@/lib/data/learnResources";
import { learnService, SubjectDetails } from "@/lib/services/learnService";
import { dueItems, getReviewItems } from "@/lib/learn/study";
import { AskedInChips } from "@/components/learn/AskedIn";
import { LessonDot } from "@/components/learn/LessonDot";
import { PageHeader, Section, Progress } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";

export default function SubjectPage() {
  const subjectSlug = useParams().subject as string;
  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // client-only render (AppLayout), so the local review queue is readable on first render
  const [dueCount] = useState(() => dueItems(getReviewItems(subjectSlug)).length);

  useEffect(() => {
    learnService
      .getSubjectDetails(subjectSlug)
      .then(setSubject)
      .catch((err: Error) => {
        console.error("Failed to load subject details:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [subjectSlug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 aria-hidden className="size-8 animate-spin text-accent" />
        <p className="font-mono text-[13px] text-mute">Loading course…</p>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="mx-auto mt-16 max-w-md text-center">
        <p className="eyebrow mb-2">Not found</p>
        <h1 className="display text-[44px]">No such course</h1>
        <p className="mt-3 text-body">This course doesn&apos;t exist, or it couldn&apos;t be loaded.</p>
        <Link href="/learn" className={clsx(buttonClass("secondary"), "mt-6")}>
          <ArrowLeft className="size-4" /> Back to Learn
        </Link>
      </div>
    );
  }

  const allTopics = subject.modules.flatMap((m) => m.topics.map((t) => ({ ...t, moduleTitle: m.title })));
  // the unfinished lesson read most recently, else the first one not done
  const lastRead = allTopics
    .filter((t) => t.status === "in_progress")
    .sort((a, b) => (b.last_read ?? "").localeCompare(a.last_read ?? ""))[0];
  const next = lastRead ?? allTopics.find((t) => t.status !== "completed");
  const tools = [
    { href: `/learn/${subject.slug}/test`, label: "Mock test", icon: ClipboardCheck },
    { href: `/learn/${subject.slug}/revise`, label: "Revision sheet", icon: FileText },
    { href: `/learn/${subject.slug}/review`, label: "Review queue", icon: RotateCcw, badge: dueCount ? `${dueCount} due` : undefined },
    { href: `/learn/${subject.slug}/reading-order`, label: "Reading order", icon: ListOrdered },
  ];

  return (
    <>
      <Link href="/learn" className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft aria-hidden className="size-3.5" /> Learn
      </Link>
      <PageHeader eyebrow={`${subject.category} · ${subject.total_topics} topics`} title={subject.name} />
      <p className="-mt-4 mb-8 max-w-3xl text-[16px] leading-relaxed text-body">{subject.description}</p>

      <div className="mb-12 grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="brut flex flex-col rounded-2xl bg-card p-6 md:p-8">
          {next ? (
            <>
              <p className="eyebrow mb-3">{next.status === "in_progress" ? "Continue where you left off" : "Next on your path"}</p>
              <h2 className="display text-[30px] md:text-[38px]">{next.title}</h2>
              <p className="mt-1 text-[14px] text-mute">{next.moduleTitle}</p>
              <div className="mt-auto flex flex-wrap items-end gap-6 pt-6">
                <Progress
                  value={subject.progress_percentage}
                  label={`${subject.completed_topics} of ${subject.total_topics} topics`}
                  className="min-w-[180px] flex-1"
                />
                <Link href={`/learn/${subject.slug}/${next.slug}`} className={buttonClass("accent")}>
                  {next.status === "in_progress" ? "Continue" : "Start"} <ArrowRight className="size-4" />
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow mb-3 !text-note">Course complete</p>
              <h2 className="display text-[38px]">Every topic done.</h2>
              <p className="mt-2 text-body">Keep it fresh with the review queue or a mock test.</p>
              <Progress value={100} className="mt-auto pt-6" />
            </>
          )}
        </div>

        <nav aria-label="Study tools" className="rounded-2xl border-[1.5px] border-hair bg-card p-2">
          <p className="eyebrow px-3 pb-1 pt-2">Study tools</p>
          {tools.map(({ href, label, icon: Icon, badge }) => (
            <Link key={href} href={href} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium hover:bg-card-2">
              <Icon className="size-[18px] text-accent" aria-hidden />
              <span className="flex-1">{label}</span>
              {badge && <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] text-paper">{badge}</span>}
              <ChevronRight className="size-4 text-mute transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ))}
        </nav>
      </div>

      <Section title="Syllabus" kicker={`${subject.modules.length} modules`}>
        <ol className="flex flex-col gap-10">
          {subject.modules.map((m, i) => {
            const done = m.topics.filter((t) => t.status === "completed").length;
            const complete = m.topics.length > 0 && done === m.topics.length;
            return (
              <li key={m.id} className="grid gap-x-6 gap-y-4 md:grid-cols-[72px_minmax(0,1fr)]">
                <span aria-hidden className={clsx("display text-[56px] leading-[0.85]", complete ? "text-note" : "text-ink/20")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="label-cond text-[22px]">{m.title}</h3>
                    <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-mute">
                      <span className="capitalize">{m.difficulty || "Intermediate"}</span>
                      <span>{m.estimated_minutes || 60} min</span>
                      <span className={complete ? "text-note" : "text-ink"}>
                        {done}/{m.topics.length}
                      </span>
                    </span>
                  </div>
                  {m.description && <p className="mt-1 text-[14px] text-body">{m.description}</p>}
                  <div className="mt-2">
                    <AskedInChips course={subject.slug} module={m.slug} />
                  </div>
                  <ul className="mt-4 border-t-[1.5px] border-hair">
                    {m.topics.map((t, ti) => (
                      <li key={t.id} className="border-b-[1.5px] border-hair">
                        <Link href={`/learn/${subject.slug}/${t.slug}`} className="group flex items-start gap-3 px-1 py-3 hover:bg-card-2 md:px-2">
                          <span className="mt-0.5 shrink-0">
                            <LessonDot status={t.status} progress={t.progress} className="size-[18px]" />
                          </span>
                          <span className="w-7 shrink-0 pt-px font-mono text-[12px] text-mute">{String(ti + 1).padStart(2, "0")}</span>
                          <span className="min-w-0 flex-1">
                            <span className={clsx("block text-[15px] font-medium group-hover:text-accent-ink", t.status === "completed" && "text-mute")}>
                              {t.title}
                            </span>
                            {t.description && <span className="mt-0.5 block text-[13px] text-mute">{t.description}</span>}
                          </span>
                          <span className="shrink-0 pt-px font-mono text-[11px] text-mute">
                            {t.status === "in_progress" && t.progress > 0 ? `${t.progress}%` : `${t.estimated_minutes}m`}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      {(COURSE_RESOURCES[subject.slug] ?? []).length > 0 && (
        <Section title="Go deeper, free" kicker="Resources">
          <p className="-mt-2 mb-5 max-w-2xl text-[15px] text-body">Hand-picked free courses, books, tools and GitHub repos to practise more or see the topic another way.</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {COURSE_RESOURCES[subject.slug].map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col rounded-2xl border-[1.5px] border-hair bg-card p-4 transition-colors hover:border-ink/40">
                  <span className="flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-mute">
                    {r.kind}
                    <ExternalLink aria-hidden className="size-3.5" />
                  </span>
                  <span className="mt-1.5 text-[15px] font-semibold group-hover:text-accent-ink">{r.title}</span>
                  <span className="mt-1 text-[13.5px] text-body">{r.why}</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
