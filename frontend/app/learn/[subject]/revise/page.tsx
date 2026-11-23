"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Printer, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";
import { getCourseBySlug } from "@/lib/data/courses/index";
import { revisionData } from "@/lib/learn/study";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

function RevisionSheet() {
  const subjectSlug = useParams().subject as string;
  const moduleFilter = useSearchParams().get("module");
  const course = getCourseBySlug(subjectSlug);
  const all = useMemo(() => revisionData(subjectSlug), [subjectSlug]);
  const modules = moduleFilter ? all.filter((m) => m.slug === moduleFilter) : all;

  if (!course) {
    return <p className="text-[var(--ink-secondary)]">Course not found. <Link href="/learn" className="text-[var(--accent)] underline">Back to Learn</Link></p>;
  }

  return (
    <div className="flex flex-col gap-6 pb-16 w-full max-w-3xl print:max-w-none">
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link href={`/learn/${subjectSlug}`} className={clsx("inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] rounded", focusRing)}>
          <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Back to {course.title}
        </Link>
        <button type="button" onClick={() => window.print()} className={clsx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[13px] text-[var(--ink)] hover:border-[var(--accent)]", focusRing)}>
          <Printer aria-hidden="true" className="w-4 h-4" /> Print or Save PDF
        </button>
      </div>

      <header className="flex flex-col gap-2">
        <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">{course.title}: Revision Sheet</h1>
        <p className="text-[var(--ink-secondary)] text-[15px]">Key takeaways and interview traps from every lesson, on one page. Read it the night before an exam or interview.</p>
      </header>

      <nav aria-label="Filter by module" className="flex flex-wrap gap-2 print:hidden">
        <Link href={`/learn/${subjectSlug}/revise`} aria-current={!moduleFilter ? "page" : undefined}
          className={clsx("px-3 py-1 rounded-full border text-[12px]", focusRing, !moduleFilter ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--accent)]")}>
          All modules
        </Link>
        {all.map((m) => (
          <Link key={m.slug} href={`/learn/${subjectSlug}/revise?module=${m.slug}`} aria-current={moduleFilter === m.slug ? "page" : undefined}
            className={clsx("px-3 py-1 rounded-full border text-[12px]", focusRing, moduleFilter === m.slug ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--accent)]")}>
            {m.title}
          </Link>
        ))}
      </nav>

      {modules.length === 0 && <p className="text-[var(--ink-secondary)]">No module matches that filter.</p>}

      {modules.map((m) => (
        <section key={m.slug} className="flex flex-col gap-4 break-inside-avoid-page">
          <h2 className="text-[20px] font-bold text-[var(--ink)] border-b border-[var(--border)] pb-2">
            <span className="font-mono text-[var(--ink-tertiary)] mr-2">{String(all.indexOf(m) + 1).padStart(2, "0")}</span>{m.title}
          </h2>
          {m.lessons.map((l) => (
            <article key={l.slug} className="flex flex-col gap-2 break-inside-avoid">
              <h3 className="text-[15px] font-semibold text-[var(--ink)]">
                <Link href={`/learn/${subjectSlug}/${l.slug}`} className={clsx("hover:text-[var(--accent)] rounded", focusRing)}>{l.title}</Link>
              </h3>
              {l.takeaways.length > 0 ? (
                <ul className="list-disc pl-6 space-y-1 text-[14px] text-[var(--ink-secondary)] leading-relaxed">
                  {l.takeaways.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              ) : (
                <p className="text-[13px] text-[var(--ink-tertiary)]">No takeaways yet for this lesson.</p>
              )}
              {l.traps.length > 0 && (
                <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-[var(--warning,#d97706)]">
                  {l.traps.map((t, i) => (
                    <p key={i} className="text-[13px] text-[var(--ink-secondary)]">
                      <AlertTriangle aria-hidden="true" className="inline w-3.5 h-3.5 mr-1 text-[var(--warning,#d97706)]" />
                      <strong className="text-[var(--ink)]">{t.question}</strong> Trap: {t.trap} Fix: {t.solution}
                    </p>
                  ))}
                </div>
              )}
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}

export default function RevisionPage() {
  return (
    <Suspense fallback={<p className="text-[var(--ink-secondary)] text-[13px] font-mono">Loading revision sheet…</p>}>
      <RevisionSheet />
    </Suspense>
  );
}
