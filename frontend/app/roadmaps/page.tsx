"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock, Flag, ListChecks } from "lucide-react";
import { roadmapModules, type RoadmapModule, type RoadmapPhase } from "@/lib/data/roadmapModules";
import { getCourseBySlug } from "@/lib/data/courses";
import type { Course, CourseLesson, CourseModule } from "@/lib/data/courses/types";
import { getStoredProgress } from "@/lib/services/learnService";
import { questionBank } from "@/lib/learn/study";
import { PageHeader, Progress } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { DsaRoadmapView } from "@/components/roadmaps/DsaRoadmapView";

type Status = "completed" | "in-progress" | "upcoming";
type Store = ReturnType<typeof getStoredProgress>;

const PHASES: { name: RoadmapPhase; blurb: string }[] = [
  { name: "Foundations", blurb: "Programming, OOP, SQL and DSA: the base every round builds on." },
  { name: "Core CS", blurb: "The core subjects asked in technical rounds." },
  { name: "Get hired", blurb: "Projects, resume, tests and interviews." },
];

const lessonDone = (store: Store, l: CourseLesson) => store[l.id]?.status === "completed" || store[l.slug]?.status === "completed";
const hours = (minutes: number) => (minutes < 90 ? `${Math.round(minutes)} min` : `${Math.round(minutes / 60)} h`);
const isExternal = (href: string) => href.startsWith("http");

/** One stage with everything measured from real data: the learner's saved lesson completions,
 *  the Learn courses' modules and lessons, and the question bank. Nothing is typed in. */
function measure(m: RoadmapModule, store: Store) {
  const courses = m.courses.map(getCourseBySlug).filter((c): c is Course => !!c);
  const lessons = courses.flatMap((c) => c.modules.flatMap((x) => x.lessons.map((l) => ({ course: c, lesson: l }))));
  const done = lessons.filter((x) => lessonDone(store, x.lesson)).length;
  const pct = lessons.length ? Math.round((100 * done) / lessons.length) : 0;
  const status: Status = !lessons.length ? "upcoming" : pct === 100 ? "completed" : done > 0 ? "in-progress" : "upcoming";
  const next = lessons.find((x) => !lessonDone(store, x.lesson));
  return {
    ...m,
    courseList: courses,
    lessonCount: lessons.length,
    done,
    pct,
    status,
    tracked: lessons.length > 0,
    minutes: lessons.reduce((n, x) => n + (x.lesson.estimatedMinutes || 0), 0),
    quizCount: m.courses.reduce((n, slug) => n + questionBank(slug).length, 0),
    next: next ? { title: next.lesson.title, href: `/learn/${next.course.slug}/${next.lesson.slug}` } : null,
  };
}
type Stage = ReturnType<typeof measure>;

function statusLabel(s: Stage) {
  if (!s.tracked) return "Self-paced";
  if (s.status === "completed") return "Done";
  if (s.status === "in-progress") return `${s.pct}%`;
  return "Not started";
}

const stageName = (s: Stage) => s.shortTitle.replace(/^\d+\s/, "");

/* ───────────────────────── stage list ───────────────────────── */

function StageDot({ s, active }: { s: Stage; active: boolean }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 font-mono text-[12px] font-bold",
        s.status === "completed"
          ? "border-note bg-note text-paper"
          : active
            ? "border-ink bg-ink text-paper"
            : s.status === "in-progress"
              ? "border-gold bg-card text-ink"
              : "border-line bg-card text-mute"
      )}
    >
      {s.status === "completed" ? <Check className="size-4" strokeWidth={3} /> : s.numStr}
    </span>
  );
}

function StageRail({ stages, active, onPick }: { stages: Stage[]; active: string; onPick: (slug: string) => void }) {
  return (
    <nav aria-label="Roadmap stages" className="space-y-6">
      {PHASES.map((phase) => (
        <div key={phase.name}>
          <p className="eyebrow mb-2 px-2">{phase.name}</p>
          <ol className="relative">
            <span aria-hidden className="absolute bottom-4 left-[23px] top-4 w-0.5 bg-hair" />
            {stages
              .filter((s) => s.phase === phase.name)
              .map((s) => {
                const on = s.slug === active;
                return (
                  <li key={s.slug}>
                    <button
                      type="button"
                      onClick={() => onPick(s.slug)}
                      aria-current={on ? "step" : undefined}
                      className={clsx(
                        "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors",
                        on ? "bg-card-2" : "hover:bg-card-2/60"
                      )}
                    >
                      <StageDot s={s} active={on} />
                      <span className="min-w-0 flex-1">
                        <span className={clsx("block text-[14px] leading-snug", on ? "font-semibold text-ink" : "text-body")}>{stageName(s)}</span>
                        <span className="mt-0.5 flex items-center gap-2">
                          <span className={clsx("font-mono text-[11px]", s.status === "completed" ? "text-note" : "text-mute")}>{statusLabel(s)}</span>
                          {s.status === "in-progress" && (
                            <span className="block h-1 max-w-24 flex-1 overflow-hidden rounded-full bg-ink/10">
                              <span className="block h-full rounded-full bg-gold" style={{ width: `${s.pct}%` }} />
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
          </ol>
        </div>
      ))}
    </nav>
  );
}

/** Phones and tablets: the 12 stages as a horizontal row of chips. */
function StageChips({ stages, active, onPick }: { stages: Stage[]; active: string; onPick: (slug: string) => void }) {
  const row = useRef<HTMLElement>(null);
  // keep the selected stage's chip in view (stage 10 starts off-screen on a phone)
  useEffect(() => {
    const nav = row.current;
    const chip = nav?.querySelector<HTMLElement>('[aria-current="step"]');
    if (nav && chip) nav.scrollTo({ left: chip.offsetLeft - (nav.clientWidth - chip.offsetWidth) / 2 });
  }, [active]);
  return (
    <nav ref={row} aria-label="Roadmap stages" className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 md:-mx-8 md:px-8 lg:hidden">
      {stages.map((s) => {
        const on = s.slug === active;
        return (
          <button
            key={s.slug}
            type="button"
            onClick={() => onPick(s.slug)}
            aria-current={on ? "step" : undefined}
            className={clsx(
              "label-cond flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] px-3 py-1.5 text-[15px]",
              on ? "border-ink bg-ink text-paper" : "border-hair bg-card text-body"
            )}
          >
            <span className="font-mono text-[11px] opacity-70">{s.numStr}</span>
            {stageName(s)}
            {s.status === "completed" && <Check className="size-3.5 text-note" strokeWidth={3} aria-label="done" />}
          </button>
        );
      })}
    </nav>
  );
}

/* ───────────────────────── the path ───────────────────────── */

// Difficulty chips: Beginner teal, Intermediate gold, Advanced rust (DESIGN.md §2), always with text.
const DIFFICULTY: Record<CourseModule["difficulty"], string> = {
  Beginner: "border-note/60 text-note",
  Intermediate: "border-gold text-ink",
  Advanced: "border-accent/60 text-accent-ink",
};

function Stop({ n, state, last, children }: { n: number | "check"; state: Status; last?: boolean; children: React.ReactNode }) {
  return (
    <li className="relative flex gap-4 pb-7">
      {!last && <span aria-hidden className="absolute bottom-0 left-[15px] top-9 w-0.5 bg-hair" />}
      <span
        aria-hidden
        className={clsx(
          "grid size-8 shrink-0 place-items-center rounded-full border-2 font-mono text-[12px] font-bold",
          state === "completed"
            ? "border-note bg-note text-paper"
            : state === "in-progress"
              ? "border-gold bg-gold/20 text-ink"
              : "border-line bg-card text-mute"
        )}
      >
        {state === "completed" ? <Check className="size-4" strokeWidth={3} /> : n === "check" ? <Flag className="size-3.5" /> : n}
      </span>
      <div className="min-w-0 flex-1 pt-1">{children}</div>
    </li>
  );
}

function ModuleStop({ course, mod, n, store, open }: { course: Course; mod: CourseModule; n: number; store: Store; open: boolean }) {
  const done = mod.lessons.filter((l) => lessonDone(store, l)).length;
  const state: Status = done === mod.lessons.length && done > 0 ? "completed" : done > 0 ? "in-progress" : "upcoming";
  const minutes = mod.lessons.reduce((k, l) => k + (l.estimatedMinutes || 0), 0);
  return (
    <Stop n={n} state={state}>
      <details open={open} className="group">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-3 rounded-lg [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-[16px] font-semibold leading-snug">{mod.title}</span>
            <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-mute">
              <span className={clsx("rounded-full border-[1.5px] px-2 py-px uppercase tracking-wider", DIFFICULTY[mod.difficulty])}>{mod.difficulty}</span>
              <span>
                {done}/{mod.lessons.length} lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" aria-hidden /> {hours(minutes)}
              </span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 pt-0.5 font-mono text-[11px] uppercase tracking-wider text-mute">
            <span className="group-open:hidden">Lessons</span>
            <span className="hidden group-open:inline">Hide</span>
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
          </span>
        </summary>
        {mod.description && <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-body">{mod.description}</p>}
        <ol className="mt-3 divide-y divide-hair overflow-hidden rounded-xl border-[1.5px] border-hair bg-card">
          {mod.lessons.map((l) => {
            const d = lessonDone(store, l);
            return (
              <li key={l.id}>
                <Link href={`/learn/${course.slug}/${l.slug}`} className="group/l flex items-center gap-3 px-3.5 py-2.5 text-[14px] hover:bg-card-2">
                  <span
                    className={clsx(
                      "grid size-4 shrink-0 place-items-center rounded-full border-[1.5px]",
                      d ? "border-note bg-note text-paper" : "border-ink/30"
                    )}
                  >
                    {d && <Check className="size-2.5" strokeWidth={4} aria-label="completed" />}
                  </span>
                  <span className={clsx("min-w-0 flex-1", d && "text-mute")}>{l.title}</span>
                  <span className="shrink-0 font-mono text-[11px] text-mute">{l.estimatedMinutes}m</span>
                  <ArrowRight className="size-3.5 shrink-0 text-mute opacity-0 transition-opacity group-hover/l:opacity-100" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ol>
      </details>
    </Stop>
  );
}

function CoursePath({ stage, store }: { stage: Stage; store: Store }) {
  // One course: its modules are the steps. Several (aptitude): each course is a step.
  if (stage.courseList.length === 1) {
    const course = stage.courseList[0];
    const nextModule = course.modules.find((m) => m.lessons.some((l) => !lessonDone(store, l)));
    return (
      <ol>
        {course.modules.map((mod, i) => (
          <ModuleStop key={mod.id} course={course} mod={mod} n={i + 1} store={store} open={mod.id === nextModule?.id} />
        ))}
        <Stop n="check" state="upcoming" last>
          <p className="text-[16px] font-semibold leading-snug">Checkpoint: take the mock test</p>
          <p className="mt-1 max-w-[62ch] text-[14px] leading-relaxed text-body">
            A timed test across the whole course. Questions you miss go into your review queue, so you know exactly what to reread.
          </p>
          <Link href={`/learn/${course.slug}/test`} className={clsx(buttonClass("secondary", "sm"), "mt-3")}>
            <ListChecks className="size-4" /> Start the mock test
          </Link>
        </Stop>
      </ol>
    );
  }
  return (
    <ol>
      {stage.courseList.map((course, i) => {
        const lessons = course.modules.flatMap((m) => m.lessons);
        const done = lessons.filter((l) => lessonDone(store, l)).length;
        const state: Status = done === lessons.length && done > 0 ? "completed" : done > 0 ? "in-progress" : "upcoming";
        return (
          <Stop key={course.slug} n={i + 1} state={state} last={i === stage.courseList.length - 1}>
            <Link href={`/learn/${course.slug}`} className="group inline-flex items-center gap-1.5 text-[16px] font-semibold hover:text-accent-ink">
              {course.title} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <p className="mt-1 font-mono text-[11px] text-mute">
              {done}/{lessons.length} lessons · {course.modules.length} modules
            </p>
            <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-body">{course.modules.map((m) => m.title).join(" · ")}</p>
          </Stop>
        );
      })}
    </ol>
  );
}

function StepsPath({ stage }: { stage: Stage }) {
  const steps = stage.steps ?? [];
  return (
    <ol>
      {steps.map((st, i) => (
        <Stop key={st.title} n={i + 1} state="upcoming" last={i === steps.length - 1}>
          <p className="text-[16px] font-semibold leading-snug">{st.title}</p>
          <p className="mt-1 max-w-[62ch] text-[14px] leading-relaxed text-body">{st.detail}</p>
          {st.link && <LinkOut href={st.link.href} label={st.link.label} className="mt-2" />}
        </Stop>
      ))}
    </ol>
  );
}

function LinkOut({ href, label, className }: { href: string; label: string; className?: string }) {
  const cls = clsx("inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink hover:underline", className);
  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {label} <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={cls}>
      {label} <ArrowRight className="size-3.5 shrink-0" aria-hidden />
    </Link>
  );
}

/* ───────────────────────── stage detail ───────────────────────── */

function SectionTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="eyebrow mb-1">{kicker}</p>
      <h3 className="display text-[28px] md:text-[32px]">{children}</h3>
    </div>
  );
}

function LinkList({ items }: { items: { href: string; title: string; meta?: string }[] }) {
  return (
    <ul className="divide-y divide-hair overflow-hidden rounded-xl border-[1.5px] border-hair bg-card">
      {items.map((it) => {
        const ext = isExternal(it.href);
        const body = (
          <>
            <span className="min-w-0">
              <span className="block text-[15px] font-medium">{it.title}</span>
              {it.meta && <span className="block font-mono text-[11px] text-mute">{it.meta}</span>}
            </span>
            {ext ? (
              <ArrowUpRight className="size-4 shrink-0 text-mute group-hover:text-ink" aria-hidden />
            ) : (
              <ArrowRight className="size-4 shrink-0 text-mute transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
            )}
          </>
        );
        const cls = "group flex items-center justify-between gap-3 px-4 py-3 hover:bg-card-2";
        return (
          <li key={it.href + it.title}>
            {ext ? (
              <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {body}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <Link href={it.href} className={cls}>
                {body}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function StageDetail({ stage, store }: { stage: Stage; store: Store }) {
  const meta = [
    stage.tracked && `${stage.courseList.reduce((n, c) => n + c.modules.length, 0)} modules`,
    stage.tracked && `${stage.lessonCount} lessons`,
    stage.minutes > 0 && `about ${hours(stage.minutes)} of lessons`,
    stage.quizCount > 0 && `${stage.quizCount} quiz questions`,
    !stage.tracked && `${stage.steps?.length ?? 0} steps at your own pace`,
  ].filter(Boolean) as string[];

  return (
    <article className="min-w-0">
      <header className="border-b-[1.5px] border-hair pb-8">
        <p className="eyebrow">{stage.badge}</p>
        <h2 className="display mt-2 text-[40px] md:text-[56px]">{stage.title}</h2>
        <p className="mt-3 max-w-[64ch] text-[16px] leading-relaxed text-body md:text-[17px]">{stage.description}</p>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] uppercase tracking-wider text-mute">
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </p>
        {stage.tracked && <Progress value={stage.pct} label={`${stage.done} of ${stage.lessonCount} lessons done`} className="mt-5 max-w-md" />}
        <div className="mt-6 flex flex-wrap gap-3">
          {stage.next && (
            <Link href={stage.next.href} className={clsx(buttonClass("primary"), "max-w-full")}>
              <span className="truncate">
                {stage.done ? "Continue" : "Start"}: {stage.next.title}
              </span>
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          )}
          {stage.tracked && !stage.next && (
            <p className="label-cond inline-flex items-center gap-1.5 text-[17px] text-note">
              <Check className="size-4" strokeWidth={3} /> Every lesson done
            </p>
          )}
          {!stage.tracked && (
            <Link href={stage.learn.href} className={buttonClass("primary")}>
              {stage.learn.label} <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </header>

      <section className={clsx("grid gap-8 border-b-[1.5px] border-hair py-8 md:gap-10", stage.howTo.length > 0 && "md:grid-cols-2")}>
        <div className="max-w-[64ch]">
          <p className="eyebrow mb-2">Why this stage</p>
          <p className="text-[16px] leading-relaxed text-ink">{stage.why}</p>
        </div>
        {stage.howTo.length > 0 && (
          <div>
            <p className="eyebrow mb-2">How to work through it</p>
            <ol className="space-y-2.5">
              {stage.howTo.map((t, i) => (
                <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-body">
                  <span className="font-mono text-[12px] font-bold leading-[1.6rem] text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <section className="border-b-[1.5px] border-hair py-8">
        <SectionTitle kicker={stage.tracked ? "Step by step, in order" : "What to do, in order"}>The path</SectionTitle>
        {stage.tracked ? <CoursePath stage={stage} store={store} /> : <StepsPath stage={stage} />}
      </section>

      {stage.slug === "dsa" && (
        <section className="border-b-[1.5px] border-hair py-8">
          <SectionTitle kicker="Practise each topic as you finish it">Problem roadmap</SectionTitle>
          <DsaRoadmapView embedded />
        </section>
      )}

      <section className="grid gap-8 border-b-[1.5px] border-hair py-8 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Practise</p>
          <LinkList items={stage.practice.map((p) => ({ href: p.href, title: p.label }))} />
        </div>
        <div>
          <p className="eyebrow mb-3">Read alongside</p>
          <LinkList items={stage.resources.map((r) => ({ href: r.href, title: r.title, meta: `${r.kind} · ${r.source}` }))} />
        </div>
      </section>

      {/* the one feature card on the page */}
      <section className="pt-8">
        <div className="brut rounded-2xl bg-card p-6 md:p-7">
          <p className="eyebrow">Sample interview question</p>
          <p className="mt-2 text-[17px] font-semibold leading-snug md:text-[19px]">&ldquo;{stage.interviewQuestion.question}&rdquo;</p>
          <details className="group mt-4">
            <summary className="label-cond inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg text-[16px] text-accent-ink [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Show a model answer</span>
              <span className="hidden group-open:inline">Hide the answer</span>
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-body">{stage.interviewQuestion.answer}</p>
            {stage.interviewQuestion.source && (
              <LinkOut href={stage.interviewQuestion.source.href} label={`Source: ${stage.interviewQuestion.source.label}`} className="mt-3 !text-[13px]" />
            )}
          </details>
        </div>
      </section>
    </article>
  );
}

/* ───────────────────────── page ───────────────────────── */

function RoadmapContent() {
  const searchParams = useSearchParams();
  // client-only render (AppLayout), so saved progress is readable on first render
  const [store] = useState(getStoredProgress);
  const stages = useMemo(() => roadmapModules.map((m) => measure(m, store)), [store]);

  const param = searchParams.get("module");
  // ?module= wins; otherwise open the stage the learner is working on
  const [selected, setSelected] = useState(
    () => stages.find((s) => s.slug === param)?.slug ?? stages.find((s) => s.status === "in-progress")?.slug ?? stages[0].slug
  );
  const [seenParam, setSeenParam] = useState(param);
  if (param !== seenParam) {
    setSeenParam(param);
    if (param && stages.some((s) => s.slug === param)) setSelected(param);
  }

  const pick = (slug: string) => {
    setSelected(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("module", slug);
    window.history.replaceState({}, "", url.toString());
    const el = document.getElementById("stage");
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" });
  };

  const stage = stages.find((s) => s.slug === selected) ?? stages[0];
  const lessonsDone = stages.reduce((n, s) => n + s.done, 0);
  const lessonsTotal = stages.reduce((n, s) => n + s.lessonCount, 0);
  const stagesDone = stages.filter((s) => s.status === "completed").length;

  return (
    <div className="w-full min-w-0">
      <PageHeader eyebrow="Software engineer track · 12 stages" title="Your placement" hl="roadmap">
        <dl className="flex gap-8">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">Stages done</dt>
            <dd className="display text-[40px] tabular-nums">
              {stagesDone}
              <span className="text-[22px] text-mute">/{stages.length}</span>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">Lessons done</dt>
            <dd className="display text-[40px] tabular-nums">
              {lessonsDone}
              <span className="text-[22px] text-mute">/{lessonsTotal}</span>
            </dd>
          </div>
        </dl>
      </PageHeader>

      <StageChips stages={stages} active={stage.slug} onPick={pick} />

      <div className="grid items-start gap-10 lg:grid-cols-[272px_minmax(0,1fr)] xl:gap-14">
        <aside className="no-scrollbar sticky top-6 hidden max-h-[calc(100dvh-3rem)] overflow-y-auto lg:block">
          <StageRail stages={stages} active={stage.slug} onPick={pick} />
          <dl className="mt-6 space-y-1.5 border-t-[1.5px] border-hair px-2 pt-4 text-[13px] leading-relaxed text-mute">
            {PHASES.map((p) => (
              <div key={p.name}>
                <dt className="inline font-semibold text-body">{p.name}: </dt>
                <dd className="inline">{p.blurb}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div id="stage" className="scroll-mt-6">
          <StageDetail key={stage.slug} stage={stage} store={store} />
        </div>
      </div>
    </div>
  );
}

export default function RoadmapsPage() {
  return (
    <Suspense fallback={null}>
      <RoadmapContent />
    </Suspense>
  );
}
