"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { AlertTriangle, ArrowLeft, Printer } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses/index";
import { revisionData } from "@/lib/learn/study";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";

const chip = (on: boolean) =>
  clsx(
    "label-cond inline-flex h-8 items-center rounded-full border-2 px-3.5 text-[14px] transition-colors",
    on ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line hover:text-ink"
  );

function RevisionSheet() {
  const subjectSlug = useParams().subject as string;
  const moduleFilter = useSearchParams().get("module");
  const course = getCourseBySlug(subjectSlug);
  const all = useMemo(() => revisionData(subjectSlug), [subjectSlug]);
  const modules = moduleFilter ? all.filter((m) => m.slug === moduleFilter) : all;

  if (!course) {
    return (
      <p className="text-body">
        Course not found.{" "}
        <Link href="/learn" className="text-accent-ink underline">
          Back to Learn
        </Link>
      </p>
    );
  }

  return (
    <div className="max-w-3xl print:max-w-none">
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link href={`/learn/${subjectSlug}`} className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
          <ArrowLeft aria-hidden className="size-3.5" /> {course.title}
        </Link>
        <button type="button" onClick={() => window.print()} className={buttonClass("secondary", "sm")}>
          <Printer aria-hidden className="size-4" /> Print / PDF
        </button>
      </div>

      <PageHeader eyebrow={course.title} title="Revision" hl="sheet" note="read it the night before ↓" />

      <nav aria-label="Filter by module" className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0 print:hidden">
        <Link href={`/learn/${subjectSlug}/revise`} aria-current={!moduleFilter ? "page" : undefined} className={clsx(chip(!moduleFilter), "shrink-0")}>
          All modules
        </Link>
        {all.map((m) => (
          <Link
            key={m.slug}
            href={`/learn/${subjectSlug}/revise?module=${m.slug}`}
            aria-current={moduleFilter === m.slug ? "page" : undefined}
            className={clsx(chip(moduleFilter === m.slug), "shrink-0")}
          >
            {m.title}
          </Link>
        ))}
      </nav>

      {modules.length === 0 && <p className="text-body">No module matches that filter.</p>}

      {modules.map((m) => (
        <section key={m.slug} className="mb-12 break-inside-avoid-page">
          <h2 className="mb-5 flex items-baseline gap-3 border-b-[2.4px] border-line pb-2">
            <span className="display text-[40px] leading-none text-ink/20">{String(all.indexOf(m) + 1).padStart(2, "0")}</span>
            <span className="label-cond text-[24px]">{m.title}</span>
          </h2>
          <div className="flex flex-col gap-7">
            {m.lessons.map((l) => (
              <article key={l.slug} className="break-inside-avoid">
                <h3 className="text-[17px] font-semibold">
                  <Link href={`/learn/${subjectSlug}/${l.slug}`} className="hover:text-accent-ink">
                    {l.title}
                  </Link>
                </h3>
                {l.takeaways.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1.5 pl-6 text-[15px] leading-relaxed text-body marker:text-accent">
                    {l.takeaways.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-[14px] text-mute">No takeaways for this lesson yet.</p>
                )}
                {l.traps.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2 rounded-xl border-[1.5px] border-[var(--warning-soft-border)] bg-[var(--warning-soft)] px-4 py-3">
                    {l.traps.map((t, i) => (
                      <p key={i} className="text-[14px] leading-relaxed text-body">
                        <AlertTriangle aria-hidden className="mr-1 inline size-3.5 text-[var(--warning)]" />
                        <strong className="text-ink">{t.question}</strong> Trap: {t.trap} Fix: {t.solution}
                      </p>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function RevisionPage() {
  return (
    <Suspense fallback={<p className="font-mono text-[13px] text-mute">Loading revision sheet…</p>}>
      <RevisionSheet />
    </Suspense>
  );
}
