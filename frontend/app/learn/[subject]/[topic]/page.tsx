"use client";

import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { clsx } from "clsx";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  FlaskConical,
  Lightbulb,
  ListChecks,
  Loader2,
} from "lucide-react";
import { getProblem } from "@/lib/problems/problemRegistry";
import { getCourseBySlug } from "@/lib/data/courses";
import { learnService, SubjectDetails, TopicContent } from "@/lib/services/learnService";
import { TheoryNotes, LessonSources, LessonHeading, prose } from "@/components/learn/TheoryNotes";
import { labForLesson } from "@/lib/labs/catalog";
import { AskedInChips } from "@/components/learn/AskedIn";
import { LessonBookmarkButton } from "@/components/learn/LessonBookmarkButton";
import { LessonPrereqs } from "@/components/learn/LessonPrereqs";
import { Badge } from "@/components/ui/Badge";
import { optionClass } from "@/components/learn/optionClass";
import { buttonClass } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Page";
import { notificationService } from "@/lib/services/notificationService";
import { useAuth } from "@/components/providers/AuthProvider";

/* eslint-disable @typescript-eslint/no-explicit-any -- lesson content is authored JSON with many block shapes */

// --- INTERACTIVE BLOCKS ---

/** Hairline card with a mono header row: the frame for every interactive lesson block. */
function Block({ icon: Icon, title, aside, tone, children }: { icon: typeof Code; title: string; aside?: ReactNode; tone?: "danger"; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border-[1.5px] border-hair bg-card">
      <div className="flex items-center justify-between gap-3 border-b-[1.5px] border-hair bg-paper-2 px-5 py-3">
        <h2 className={clsx("label-cond flex items-center gap-2 text-[17px]", tone === "danger" && "text-danger")}>
          <Icon aria-hidden className={clsx("size-4", tone === "danger" ? "text-danger" : "text-accent")} /> {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

const inlineCode = (text: string) =>
  text
    ? text.split(/`([^`]+)`/g).map((part, i) =>
        i % 2 ? (
          <code key={i} className={prose.code}>
            {part}
          </code>
        ) : (
          part
        )
      )
    : null;

function QuickCheckBlock({ section }: { section: any }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answer = section.answer ?? section.correctIndex; // older lessons use correctIndex
  return (
    <Block icon={CheckCircle2} title={section.title || "Quick check"}>
      <div className="flex flex-col gap-4 p-5">
        <p className="text-[16px] font-medium">{section.question}</p>
        <div className="flex flex-col gap-2">
          {section.options.map((opt: string, idx: number) => {
            const shown = picked !== null;
            const right = idx === answer;
            return (
              <button
                key={idx}
                onClick={() => picked === null && setPicked(idx)}
                disabled={shown}
                className={optionClass(shown, right, picked === idx)}
              >
                <span className="font-mono text-[12px] text-mute">{String.fromCharCode(65 + idx)}</span>
                <span className="flex-1">{opt}</span>
                {shown && right && <Check aria-label="Correct answer" className="size-4" />}
              </button>
            );
          })}
        </div>
        {picked !== null && section.explanation && (
          <p className="fade-in rounded-xl bg-paper-2 p-4 text-[15px] leading-relaxed text-body">
            <span className="font-semibold text-ink">{picked === answer ? "Right. " : "Not quite. "}</span>
            {section.explanation}
          </p>
        )}
      </div>
    </Block>
  );
}

function ThinkBlock({ section }: { section: any }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <Block icon={Lightbulb} title={section.title || "Think about it"}>
      <div className="p-5">
        <p className="text-[16px] leading-relaxed text-body">{section.question || section.content}</p>
        {revealed ? (
          <div className="fade-in mt-4 rounded-xl bg-paper-2 p-4 text-[15px] leading-relaxed">
            <p className="eyebrow mb-1.5">Answer</p>
            {section.answerReveal}
          </div>
        ) : (
          <button onClick={() => setRevealed(true)} className={clsx(buttonClass("secondary", "sm"), "mt-4")}>
            Reveal answer
          </button>
        )}
      </div>
    </Block>
  );
}

function TryItBlock({ section }: { section: any }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <Block icon={Code} title={section.title || "Predict the output"}>
      <div className="p-5">
        <pre className={prose.pre}>
          <code>{section.code}</code>
        </pre>
        {revealed ? (
          <div className="fade-in mt-4 flex flex-col gap-3">
            <div className="rounded-xl border-[1.5px] border-hair bg-paper-2 p-3 font-mono text-[14px]">
              <span className="mr-2 select-none text-mute">$</span>
              {section.expectedOutput}
            </div>
            {section.explanation && <p className="text-[15px] leading-relaxed text-body">{section.explanation}</p>}
          </div>
        ) : (
          <button onClick={() => setRevealed(true)} className={clsx(buttonClass("secondary", "sm"), "mt-4 w-full")}>
            I&apos;ve made my guess, show output
          </button>
        )}
      </div>
    </Block>
  );
}

function DryRunBlock({ section }: { section: any }) {
  const [step, setStep] = useState(0);
  // older lessons use steps: [{ step, explanation }] instead of iterations
  const iterations = section.iterations ?? section.steps?.map((s: any) => ({ step: s.step, variables: {}, description: s.explanation })) ?? [];
  if (!iterations.length) return null;
  const cur = iterations[step];
  return (
    <Block
      icon={Clock}
      title={section.title || "Dry run"}
      aside={
        <span className="font-mono text-[12px] text-mute">
          Step {step + 1} / {iterations.length}
        </span>
      }
    >
      <div className="flex flex-col gap-4 p-5">
        {section.code && (
          <pre className={prose.pre}>
            <code>{section.code}</code>
          </pre>
        )}
        {Object.keys(cur.variables ?? {}).length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(cur.variables).map(([k, v]) => (
              <div key={k} className="rounded-xl border-[1.5px] border-hair bg-paper-2 p-3 text-center">
                <span className="block font-mono text-[11px] uppercase text-mute">{k}</span>
                <span className="mt-1 block font-mono text-[16px]">{String(v)}</span>
              </div>
            ))}
          </div>
        )}
        {cur.description && <p className={prose.callout}>{cur.description}</p>}
        <Progress value={((step + 1) / iterations.length) * 100} />
        <div className="flex justify-between gap-2">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className={buttonClass("ghost", "sm")}>
            <ChevronLeft className="size-4" /> Back
          </button>
          <button
            onClick={() => setStep((s) => Math.min(iterations.length - 1, s + 1))}
            disabled={step === iterations.length - 1}
            className={buttonClass("primary", "sm")}
          >
            Next step <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </Block>
  );
}

function InterviewTrapsBlock({ section }: { section: any }) {
  return (
    <Block icon={AlertTriangle} title={section.title || "Interview traps"} tone="danger">
      <div className="divide-y-[1.5px] divide-hair">
        {section.traps?.map((trap: any, idx: number) => (
          <div key={idx} className="flex flex-col gap-3 p-5">
            <p className="text-[16px] font-semibold">{trap.question}</p>
            <p className="rounded-xl border-[1.5px] border-[var(--error-soft-border)] bg-[var(--error-soft)] px-4 py-3 text-[15px] leading-relaxed">
              <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-danger">The trap</span>
              {trap.trap}
            </p>
            <p className="rounded-xl border-[1.5px] border-[var(--success-soft-border)] bg-[var(--success-soft)] px-4 py-3 text-[15px] leading-relaxed">
              <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-note">What to say</span>
              {trap.solution}
            </p>
          </div>
        ))}
      </div>
    </Block>
  );
}

// Prerequisite slugs may name a course, a module of the current course, or a lesson
function prerequisiteHref(slug: string, subjectSlug: string): string {
  if (getCourseBySlug(slug)) return `/learn/${slug}`;
  const course = getCourseBySlug(subjectSlug);
  const mod = course?.modules.find((m) => m.slug === slug);
  if (mod?.lessons[0]) return `/learn/${subjectSlug}/${mod.lessons[0].slug}`;
  return `/learn/${subjectSlug}/${slug}`;
}

const difficultyVariant = (d: string) => (d === "Easy" ? "success" : d === "Medium" ? "warning" : "danger");

function SectionRenderer({ section, subjectSlug }: { section: any; subjectSlug: string }) {
  switch (section.type) {
    case "text":
      return (
        <section>
          {section.title && <LessonHeading>{section.title}</LessonHeading>}
          <div className={clsx(prose.p, "whitespace-pre-wrap")}>{section.content}</div>
        </section>
      );
    case "callout":
      return (
        <aside className={prose.callout}>
          <p className="eyebrow mb-1.5 flex items-center gap-1.5">
            <Lightbulb aria-hidden className="size-3.5" /> {section.title || "Important"}
          </p>
          {section.content}
        </aside>
      );
    case "code":
      return (
        <section>
          {section.title && <LessonHeading icon={Code}>{section.title}</LessonHeading>}
          <pre className={prose.pre}>
            <code>{section.code}</code>
          </pre>
          {section.explanation && <p className="mt-3 text-[15px] leading-relaxed text-body">{inlineCode(section.explanation)}</p>}
        </section>
      );
    case "list":
      return (
        <section>
          {section.title && <LessonHeading>{section.title}</LessonHeading>}
          <ul className={clsx(prose.list, "list-disc")}>
            {section.items?.map((item: string, idx: number) => (
              // authored lesson content: only **bold** is converted
              <li key={idx} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            ))}
          </ul>
        </section>
      );
    case "table":
      return (
        <section>
          {section.title && <LessonHeading>{section.title}</LessonHeading>}
          <div className="overflow-x-auto rounded-xl border-[1.5px] border-hair">
            <table className="w-full text-left">
              <thead className="border-b-[1.5px] border-hair bg-paper-2">
                <tr>
                  {section.headers?.map((h: string, i: number) => (
                    <th key={i} className="px-4 py-2.5 font-mono text-[12px] font-medium uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-hair">
                {section.rows?.map((row: string[], i: number) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2.5 align-top text-[15px] text-body">
                        {inlineCode(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    case "warning":
      return (
        <aside className="rounded-xl border-[1.5px] border-[var(--error-soft-border)] bg-[var(--error-soft)] px-5 py-4">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-danger">
            <AlertTriangle aria-hidden className="size-3.5" /> {section.title || "Common mistakes"}
          </p>
          {section.content && <p className="text-[16px] leading-relaxed">{inlineCode(section.content)}</p>}
          {section.items?.length > 0 && (
            <ul className="mt-1 list-disc space-y-1.5 pl-5 text-[16px] leading-relaxed">
              {section.items.map((m: string, idx: number) => (
                <li key={idx}>{inlineCode(m)}</li>
              ))}
            </ul>
          )}
        </aside>
      );
    case "takeaways":
      return (
        <section className="brut rounded-2xl bg-card p-6">
          <p className="eyebrow mb-3">{section.title || "Key takeaways"}</p>
          <ul className="space-y-2.5">
            {section.items?.map((item: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-[16px] leading-relaxed">
                <CheckCircle2 aria-hidden className="mt-1 size-4 shrink-0 text-note" />
                <span>{inlineCode(item)}</span>
              </li>
            ))}
          </ul>
        </section>
      );
    case "practice":
      return (
        <Block icon={ListChecks} title={section.title || "Practice problems"}>
          <ul className="divide-y-[1.5px] divide-hair">
            {section.problems?.map((prob: any) => {
              // problems missing from the registry render as plain exercises instead of dead links
              const linked = !!getProblem(prob.id);
              const body = (
                <>
                  <span className="flex-1 text-[15px] font-medium group-hover:text-accent-ink">{prob.title}</span>
                  <Badge variant={difficultyVariant(prob.difficulty)}>{prob.difficulty}</Badge>
                  {linked && <ChevronRight aria-hidden className="size-4 text-mute" />}
                </>
              );
              return (
                <li key={prob.id}>
                  {linked ? (
                    <Link href={`/practice/problems/${prob.id}`} className="group flex items-center gap-3 px-5 py-3 hover:bg-card-2">
                      {body}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-5 py-3">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Block>
      );
    case "prerequisites":
      return (
        <section className="flex flex-wrap items-center gap-2 text-[14px]">
          <span className="font-mono text-[12px] uppercase tracking-wider text-mute">Before this:</span>
          {section.links?.map((link: any, idx: number) => (
            <Link
              key={idx}
              href={prerequisiteHref(link.slug, subjectSlug)}
              className="rounded-full border-[1.5px] border-hair px-3 py-1 font-medium hover:border-line hover:text-accent-ink"
            >
              {link.title}
            </Link>
          ))}
        </section>
      );
    case "quickCheck":
      return <QuickCheckBlock section={section} />;
    case "think":
      return <ThinkBlock section={section} />;
    case "tryIt":
      return <TryItBlock section={section} />;
    case "dryRun":
      return <DryRunBlock section={section} />;
    case "interviewTraps":
      return <InterviewTrapsBlock section={section} />;
    default:
      return null;
  }
}

/** Older lessons store fixed fields instead of a `sections` list; express them as sections so one renderer handles both. */
function legacySections(c: any): any[] {
  return [
    c.concept && { type: "text", title: "Concept", content: c.concept },
    c.whyItMatters && { type: "callout", title: "Why it matters", content: c.whyItMatters },
    c.howItWorks && { type: "text", title: "How it works", content: c.howItWorks },
    c.javaExample && { type: "code", title: "Code example", code: c.javaExample },
    c.commonMistakes?.length && { type: "warning", title: "Common mistakes", items: c.commonMistakes },
    c.quickCheck && { type: "quickCheck", ...c.quickCheck },
  ].filter(Boolean);
}

export default function TopicPage() {
  const params = useParams();
  const subjectSlug = params.subject as string;
  const topicSlug = params.topic as string;
  const { user } = useAuth();

  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [topic, setTopic] = useState<TopicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const notesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lessonScrollRef = useRef<HTMLDivElement>(null);

  // new lesson: back to the top of the reading pane
  useEffect(() => {
    if (!loading && lessonScrollRef.current) lessonScrollRef.current.scrollTop = 0;
  }, [topicSlug, loading]);

  useEffect(() => {
    let live = true;
    Promise.all([learnService.getSubjectDetails(subjectSlug), learnService.getTopicContent(subjectSlug, topicSlug)])
      .then(([s, t]) => {
        if (!live) return;
        setSubject(s);
        setTopic(t);
        setNotes(t.notes || "");
        setError(null);
      })
      .catch((err: Error) => {
        console.error("Failed to load topic details:", err);
        if (live) setError(err.message);
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [subjectSlug, topicSlug]);

  const { currentModule, nextTopic, prevTopic, position, total } = useMemo(() => {
    if (!subject || !topic) return { currentModule: null, nextTopic: null, prevTopic: null, position: 0, total: 0 };
    const all = subject.modules.flatMap((m) => m.topics.map((t) => ({ ...t, module: m })));
    const i = all.findIndex((t) => t.id === topic.id || t.slug === topic.slug);
    return {
      currentModule: all[i]?.module ?? null,
      prevTopic: i > 0 ? all[i - 1] : null,
      nextTopic: i >= 0 && i < all.length - 1 ? all[i + 1] : null,
      position: i + 1,
      total: all.length,
    };
  }, [subject, topic]);

  const content = useMemo(() => {
    if (!topic?.content) return null;
    if (typeof topic.content !== "string") return topic.content;
    try {
      return JSON.parse(topic.content);
    } catch {
      // MDX lessons (public/content/learn/**/index.mdx) are plain markdown: drop the frontmatter and the
      // "# Title" line (the page already shows the title) and render the rest as theory.
      // ponytail: JSX components inside MDX would print as text; wire up MdxRenderer if a lesson ever needs them.
      const body = topic.content.replace(/^---[\s\S]*?\n---\s*/, "").replace(/^#\s.*\n/, "");
      return body.trim() ? { theory: body } : null;
    }
  }, [topic]);

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-accent" />
        <p className="font-mono text-[13px] text-mute">Opening lesson…</p>
      </div>
    );
  }

  if (error || !topic || !subject || !currentModule) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="eyebrow mb-2">Not found</p>
          <h1 className="display text-[44px]">No such lesson</h1>
          <p className="mt-3 text-body">
            <span className="font-mono text-[14px]">{topicSlug}</span> isn&apos;t in the {subjectSlug} course.
          </p>
          <Link href={`/learn/${subjectSlug}`} className={clsx(buttonClass("secondary"), "mt-6")}>
            <ArrowLeft className="size-4" /> Back to course
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = topic.status === "completed";

  const markComplete = async () => {
    try {
      setUpdating(true);
      await learnService.updateTopicProgress(topic.id, "completed");
      if (user?.id) {
        notificationService.createNotification({
          userId: user.id,
          title: "Lesson Completed",
          message: `You completed "${topic.title}".`,
          type: "LESSON_COMPLETED",
          link: `/learn/${subjectSlug}/${topicSlug}`,
        });
      }
      setTopic({ ...topic, status: "completed" });
      setSubject({
        ...subject,
        modules: subject.modules.map((m) => ({ ...m, topics: m.topics.map((t) => (t.id === topic.id ? { ...t, status: "completed" } : t)) })),
      });
    } catch (err) {
      console.error("Failed to update progress:", err);
    } finally {
      setUpdating(false);
    }
  };

  const onNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    if (notesTimeoutRef.current) clearTimeout(notesTimeoutRef.current);
    setNotesSaved(false);
    setSavingNotes(true);
    notesTimeoutRef.current = setTimeout(async () => {
      try {
        await learnService.updateTopicProgress(topic.id, topic.status as any, val);
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2000);
      } catch (err) {
        console.error("Failed to save notes", err);
      } finally {
        setSavingNotes(false);
      }
    }, 1000);
  };

  const sections: any[] = content ? (content.sections ?? legacySections(content)) : [];

  return (
    <div className="flex h-full min-w-0 overflow-hidden">
      {/* course outline */}
      <aside aria-label="Course outline" className="hidden h-full w-[300px] shrink-0 flex-col border-r-[2.4px] border-line bg-paper lg:flex">
        <div className="shrink-0 border-b-[1.5px] border-hair p-5">
          <Link href={`/learn/${subject.slug}`} className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-mute hover:text-ink">
            <ArrowLeft className="size-3" /> Course
          </Link>
          <p className="display text-[26px]">{subject.name}</p>
          <Progress value={subject.progress_percentage || 0} label="Complete" className="mt-3" />
        </div>
        <nav className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-6">
          {subject.modules.map((m, mIdx) => (
            <div key={m.id}>
              <p className="sticky top-0 z-10 bg-paper px-5 pb-1.5 pt-4 font-mono text-[11px] uppercase tracking-wider text-mute">
                {String(mIdx + 1).padStart(2, "0")} · {m.title}
              </p>
              {m.topics.map((t) => {
                const active = t.id === topic.id;
                const done = t.status === "completed";
                return (
                  <Link
                    key={t.id}
                    href={`/learn/${subject.slug}/${t.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "mx-2 flex items-start gap-2.5 rounded-lg px-3 py-2 text-[14px] leading-snug transition-colors",
                      active ? "bg-ink text-paper" : "hover:bg-card-2"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 aria-label="Completed" className={clsx("mt-px size-4 shrink-0", active ? "text-paper" : "text-note")} />
                    ) : (
                      <span aria-hidden className={clsx("mt-px block size-4 shrink-0 rounded-full border-2", active ? "border-paper" : "border-ink/25")} />
                    )}
                    <span className={clsx("min-w-0 flex-1", active && "font-semibold")}>{t.title}</span>
                    <span className={clsx("font-mono text-[11px]", active ? "text-paper/70" : "text-mute")}>{t.estimated_minutes}m</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-card">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-hair px-5 py-3 md:px-10">
          <Link href={`/learn/${subject.slug}`} className="min-w-0 truncate font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink lg:pointer-events-none">
            <span className="lg:hidden">← </span>
            {currentModule.title} · {position}/{total}
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <LessonBookmarkButton course={subjectSlug} lesson={topicSlug} />
            {isCompleted ? (
              <span className="label-cond flex h-9 items-center gap-1.5 rounded-xl bg-[var(--success-soft)] px-3 text-[14px] text-note">
                <CheckCircle2 className="size-4" /> Completed
              </span>
            ) : (
              <button onClick={markComplete} disabled={updating} className={buttonClass("primary", "sm")}>
                {updating ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                Mark complete
              </button>
            )}
          </div>
        </header>

        <div ref={lessonScrollRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <article className="mx-auto flex w-full max-w-[760px] flex-col gap-10 px-5 py-10 md:px-10">
            <header>
              <p className="eyebrow mb-3">
                {subject.name} · {topic.estimated_minutes} min
              </p>
              <h1 className="display text-[44px] md:text-[60px]">{topic.title}</h1>
              {topic.description && <p className="mt-4 text-[18px] leading-relaxed text-body">{topic.description}</p>}
              <div className="mt-5 flex flex-col gap-3">
                <AskedInChips course={subjectSlug} module={currentModule.slug} />
                <LessonPrereqs course={subjectSlug} lesson={topicSlug} />
              </div>
            </header>

            {content ? (
              <>
                {content.theory && <TheoryNotes markdown={content.theory} />}
                {labForLesson(subjectSlug, topicSlug).map((lab) => (
                  <Link key={lab.slug} href={`/labs/${lab.slug}`} className="brut brut-hover no-press flex items-center gap-4 rounded-2xl bg-card p-5">
                    <FlaskConical aria-hidden className="size-6 shrink-0 text-accent" />
                    <span className="min-w-0 flex-1">
                      <span className="eyebrow block">Try it in the lab</span>
                      <span className="label-cond block text-[19px]">{lab.title}</span>
                    </span>
                    <ArrowRight aria-hidden className="size-5 shrink-0" />
                  </Link>
                ))}
                {sections.map((section, idx) => (
                  <SectionRenderer key={idx} section={section} subjectSlug={subjectSlug} />
                ))}
                {content.sources?.length > 0 && <LessonSources sources={content.sources} />}
              </>
            ) : (
              <p className="text-body">This lesson has no content yet.</p>
            )}

            <section className="border-t-[1.5px] border-hair pt-8">
              <div className="mb-3 flex items-center justify-between">
                <LessonHeading icon={BookOpen}>My notes</LessonHeading>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-mute" aria-live="polite">
                  {savingNotes && <Loader2 className="size-3 animate-spin" />}
                  {notesSaved && <Check className="size-3 text-note" />}
                  {savingNotes ? "Saving…" : notesSaved ? "Saved" : "Saves as you type"}
                </span>
              </div>
              <textarea
                value={notes}
                onChange={onNotes}
                aria-label="My notes"
                placeholder="Key ideas, a snippet, a question for later…"
                className="min-h-[160px] w-full resize-y rounded-xl border-2 border-hair bg-paper p-4 text-[15px] leading-relaxed placeholder:text-mute focus:border-accent"
              />
            </section>

            <nav aria-label="Lesson navigation" className="grid gap-4 border-t-[1.5px] border-hair pt-8 sm:grid-cols-2">
              {prevTopic ? (
                <Link href={`/learn/${subject.slug}/${prevTopic.slug}`} className="brut brut-hover no-press group rounded-2xl bg-card p-4">
                  <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-mute">
                    <ChevronLeft className="size-3.5" /> Previous
                  </span>
                  <span className="label-cond mt-1 block truncate text-[18px]">{prevTopic.title}</span>
                </Link>
              ) : (
                <span />
              )}
              <Link
                href={nextTopic ? `/learn/${subject.slug}/${nextTopic.slug}` : `/learn/${subject.slug}`}
                className="brut brut-hover no-press group rounded-2xl bg-ink p-4 text-right text-paper"
              >
                <span className="flex items-center justify-end gap-1 font-mono text-[11px] uppercase tracking-wider text-paper/70">
                  {nextTopic ? "Next" : "Finished the course"} <ChevronRight className="size-3.5" />
                </span>
                <span className="label-cond mt-1 block truncate text-[18px]">{nextTopic ? nextTopic.title : "Back to course"}</span>
              </Link>
            </nav>
          </article>
        </div>
      </div>
    </div>
  );
}
