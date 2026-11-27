"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses/index";
import { FORMULAS } from "@/lib/data/formulas";
import { FormulaTable } from "@/components/learn/FormulaSheet";
import { PageHeader } from "@/components/ui/Page";

export default function FormulasPage() {
  const subjectSlug = useParams().subject as string;
  const course = getCourseBySlug(subjectSlug);
  const sheet = FORMULAS[subjectSlug];

  if (!course || !sheet) {
    return (
      <p className="text-body">
        No formula sheet for this course.{" "}
        <Link href="/learn" className="text-accent-ink underline">
          Back to Learn
        </Link>
      </p>
    );
  }

  // In course order, only lessons that have formulas
  const lessons = course.modules.flatMap((m) => m.lessons).filter((l) => sheet[l.slug]);

  return (
    <div className="max-w-4xl">
      <Link href={`/learn/${subjectSlug}`} className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft aria-hidden className="size-3.5" /> {course.title}
      </Link>
      <PageHeader eyebrow={course.title} title="Formula" hl="sheet" />
      <p className="mb-6 text-body">Every formula from this course on one page. Tap a topic name to open its lesson.</p>
      <div className="flex flex-col gap-6">
        {lessons.map((l) => (
          <section key={l.slug} className="rounded-2xl border-[1.5px] border-hair bg-card p-4 md:p-5">
            <h2 className="label-cond mb-2 text-[20px]">
              <Link href={`/learn/${subjectSlug}/${l.slug}`} className="hover:text-accent-ink">
                {l.title}
              </Link>
            </h2>
            <FormulaTable rows={sheet[l.slug]} />
          </section>
        ))}
      </div>
    </div>
  );
}
