"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, BookOpen, CheckCircle2, Route } from "lucide-react";
import { clsx } from "clsx";
import { getCourseBySlug } from "@/lib/data/courses/index";
import { readingOrderFor } from "@/lib/data/readingOrder";
import { CROSS_LINKS } from "@/lib/learn/conceptGraph";
import { getStoredProgress } from "@/lib/services/learnService";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

export default function ReadingOrderPage() {
  const subjectSlug = useParams().subject as string;
  const course = getCourseBySlug(subjectSlug);
  const order = readingOrderFor(subjectSlug);
  const [done, setDone] = useState<Record<string, number>>({});

  // Module completion from saved lesson progress (keyed by lesson id or slug).
  useEffect(() => {
    if (!course) return;
    const store = getStoredProgress();
    setDone(Object.fromEntries(course.modules.map((m) => {
      const n = m.lessons.filter((l) => store[l.id]?.status === "completed" || store[l.slug]?.status === "completed").length;
      return [m.slug, m.lessons.length ? n / m.lessons.length : 0];
    })));
  }, [course]);

  if (!course || !order) {
    return <p className="text-[var(--ink-secondary)]">No reading order for this course yet. <Link href="/learn" className="text-[var(--accent)] underline">Back to Learn</Link></p>;
  }

  // "Before you start": modules in other courses that this course builds on (from the concept map).
  const before = [...new Map(CROSS_LINKS
    .filter(([from, to]) => to.startsWith(`${subjectSlug}:`) && !from.startsWith(`${subjectSlug}:`))
    .map(([from, , reason]) => {
      const [c, mod] = from.split(":");
      const other = getCourseBySlug(c);
      const module = other?.modules.find((x) => x.slug === mod);
      return [from, { course: other, module, reason }] as const;
    })).values()].filter((b) => b.course && b.module);

  let moduleNo = 0;

  return (
    <div className="flex flex-col gap-6 pb-16 w-full max-w-3xl">
      <Link href={`/learn/${subjectSlug}`} className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] self-start rounded ${focusRing}`}>
        <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Back to {course.title}
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] tracking-tight flex items-center gap-3">
          <Route aria-hidden="true" className="w-7 h-7 text-[var(--accent)]" /> {course.title}: Reading Order
        </h1>
        <p className="text-[var(--ink-secondary)] text-[15px]">{order.intro}</p>
        <p className="text-[12.5px] text-[var(--ink-tertiary)]">Every external resource listed here is free to read, watch or practise.</p>
      </header>

      {before.length > 0 && (
        <section className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-2">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">Before you start</h2>
          <ul className="flex flex-col gap-1.5">
            {before.map((b) => (
              <li key={`${b.course!.slug}-${b.module!.slug}`} className="text-[13px]">
                <Link href={`/learn/${b.course!.slug}/${b.module!.lessons[0]?.slug ?? ""}`} className={`font-medium text-[var(--ink)] hover:text-[var(--accent)] rounded ${focusRing}`}>
                  {b.course!.title}: {b.module!.title}
                </Link>
                <span className="text-[var(--ink-secondary)]"> · {b.reason}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ol className="relative flex flex-col gap-3 border-l-2 border-[var(--border)] ml-3 pl-6">
        {order.steps.map((step, i) => {
          if ("module" in step) {
            const mod = course.modules.find((x) => x.slug === step.module)!;
            const pct = done[mod.slug] ?? 0;
            moduleNo++;
            return (
              <li key={i} className="relative">
                <span className={clsx("absolute -left-[37px] top-3 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold",
                  pct === 1 ? "bg-[var(--success)] text-white" : "bg-[var(--accent)] text-white")} aria-hidden="true">
                  {pct === 1 ? <CheckCircle2 className="w-4 h-4" /> : moduleNo}
                </span>
                <Link href={`/learn/${course.slug}/${mod.lessons[0]?.slug ?? ""}`}
                  className={`flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors ${focusRing}`}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">StudyHub module {moduleNo}</span>
                  <span className="text-[15px] font-semibold text-[var(--ink)]">{mod.title}</span>
                  <span className="text-[13px] text-[var(--ink-secondary)]">{mod.description}</span>
                  <span className="text-[12px] text-[var(--ink-tertiary)] tabular-nums">{mod.lessons.length} lessons · {Math.round(pct * 100)}% done</span>
                </Link>
              </li>
            );
          }
          const res = step.resource;
          return (
            <li key={i} className="relative">
              <span className="absolute -left-[35px] top-3.5 w-5 h-5 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] flex items-center justify-center" aria-hidden="true">
                <BookOpen className="w-3 h-3 text-[var(--ink-tertiary)]" />
              </span>
              <a href={res.url} target="_blank" rel="noopener noreferrer"
                className={`flex flex-col gap-1 p-4 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--accent)] transition-colors ${focusRing}`}>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--ink-tertiary)]">Free {res.format.toLowerCase()} · {res.by}</span>
                <span className="text-[15px] font-semibold text-[var(--ink)] inline-flex items-center gap-1.5">
                  {res.title} <ExternalLink aria-hidden="true" className="w-3.5 h-3.5 text-[var(--ink-tertiary)]" /><span className="sr-only">(opens in a new tab)</span>
                </span>
                <span className="text-[13px] text-[var(--ink-secondary)]">{res.why}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
