"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { clsx } from "clsx";
import { ArrowLeft, BookOpen, CheckCircle2, ExternalLink } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses/index";
import { readingOrderFor } from "@/lib/data/readingOrder";
import { CROSS_LINKS } from "@/lib/learn/conceptGraph";
import { getStoredProgress } from "@/lib/services/learnService";
import { PageHeader, Progress } from "@/components/ui/Page";

export default function ReadingOrderPage() {
  const subjectSlug = useParams().subject as string;
  const course = getCourseBySlug(subjectSlug);
  const order = readingOrderFor(subjectSlug);
  // Module completion from saved lesson progress (client-only render via AppLayout, so localStorage is readable here)
  const [done] = useState<Record<string, number>>(() => {
    if (!course) return {};
    const store = getStoredProgress();
    return Object.fromEntries(
      course.modules.map((m) => {
        const n = m.lessons.filter((l) => store[l.id]?.status === "completed" || store[l.slug]?.status === "completed").length;
        return [m.slug, m.lessons.length ? n / m.lessons.length : 0];
      })
    );
  });

  if (!course || !order) {
    return (
      <p className="text-body">
        No reading order for this course yet.{" "}
        <Link href="/learn" className="text-accent-ink underline">
          Back to Learn
        </Link>
      </p>
    );
  }

  // "Before you start": modules in other courses that this course builds on (from the concept map).
  const before = [
    ...new Map(
      CROSS_LINKS.filter(([from, to]) => to.startsWith(`${subjectSlug}:`) && !from.startsWith(`${subjectSlug}:`)).map(([from, , reason]) => {
        const [c, mod] = from.split(":");
        const other = getCourseBySlug(c);
        const otherModule = other?.modules.find((x) => x.slug === mod);
        return [from, { course: other, module: otherModule, reason }] as const;
      })
    ).values(),
  ].filter((b) => b.course && b.module);

  let moduleNo = 0;

  return (
    <div className="max-w-3xl">
      <Link href={`/learn/${subjectSlug}`} className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft aria-hidden className="size-3.5" /> {course.title}
      </Link>
      <PageHeader eyebrow={course.title} title="Reading" hl="order" />
      <p className="-mt-4 max-w-2xl text-[15px] leading-relaxed text-body">{order.intro}</p>
      <p className="mb-8 mt-2 font-mono text-[12px] text-mute">Every outside resource here is free to read, watch or practise.</p>

      {before.length > 0 && (
        <section className="mb-10 rounded-2xl border-[1.5px] border-hair bg-card p-5">
          <h2 className="eyebrow mb-3">Before you start</h2>
          <ul className="flex flex-col gap-2">
            {before.map((b) => (
              <li key={`${b.course!.slug}-${b.module!.slug}`} className="text-[15px]">
                <Link href={`/learn/${b.course!.slug}/${b.module!.lessons[0]?.slug ?? ""}`} className="font-semibold hover:text-accent-ink">
                  {b.course!.title}: {b.module!.title}
                </Link>
                <span className="text-body"> · {b.reason}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ol className="relative ml-4 flex flex-col gap-4 border-l-[2.4px] border-line pl-8">
        {order.steps.map((step, i) => {
          if ("module" in step) {
            const mod = course.modules.find((x) => x.slug === step.module)!;
            const pct = done[mod.slug] ?? 0;
            moduleNo++;
            return (
              <li key={i} className="relative">
                <span
                  aria-hidden
                  className={clsx(
                    "absolute -left-[49px] top-4 grid size-8 place-items-center rounded-full border-[2.4px] border-line font-mono text-[12px] font-bold",
                    pct === 1 ? "bg-note text-paper" : "bg-ink text-paper"
                  )}
                >
                  {pct === 1 ? <CheckCircle2 className="size-4" /> : moduleNo}
                </span>
                <Link href={`/learn/${course.slug}/${mod.lessons[0]?.slug ?? ""}`} className="brut brut-hover no-press block rounded-2xl bg-card p-5">
                  <span className="eyebrow block">Module {moduleNo}</span>
                  <span className="label-cond mt-1 block text-[21px]">{mod.title}</span>
                  {mod.description && <span className="mt-1 block text-[14px] text-body">{mod.description}</span>}
                  <Progress value={pct * 100} label={`${mod.lessons.length} lessons`} className="mt-4" />
                </Link>
              </li>
            );
          }
          const res = step.resource;
          return (
            <li key={i} className="relative">
              <span aria-hidden className="absolute -left-[45px] top-4 grid size-6 place-items-center rounded-full border-2 border-hair bg-paper">
                <BookOpen className="size-3 text-mute" />
              </span>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border-[1.5px] border-dashed border-hair p-5 transition-colors hover:border-line"
              >
                <span className="block font-mono text-[11px] uppercase tracking-wider text-mute">
                  Free {res.format.toLowerCase()} · {res.by}
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[16px] font-semibold">
                  {res.title} <ExternalLink aria-hidden className="size-3.5 text-mute" />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
                <span className="mt-1 block text-[14px] text-body">{res.why}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
