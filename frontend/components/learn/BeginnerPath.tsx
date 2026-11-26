import Link from "next/link";
import { clsx } from "clsx";
import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/Page";
import { BEGINNER_PATH } from "@/lib/data/learnResources";
import type { LearningSubject } from "@/lib/services/learnService";

/** The learning order from zero to pro across all subjects, four stages, with progress per subject. */
export function BeginnerPath({ subjects }: { subjects: LearningSubject[] }) {
  const bySlug = new Map(subjects.map((s) => [s.slug, s]));
  // the first unfinished subject in path order is "you are here"
  const next = BEGINNER_PATH.flatMap((s) => s.courses).find((slug) => (bySlug.get(slug)?.progress_percentage ?? 0) < 100);

  return (
    <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {BEGINNER_PATH.map((stage) => (
        <li key={stage.stage} className="flex flex-col rounded-2xl border-[1.5px] border-hair bg-card p-5">
          <p className="eyebrow">{stage.stage}</p>
          <p className="mt-1 text-[14px] text-body">{stage.goal}</p>
          <ul className="mt-4 flex flex-col gap-3">
            {stage.courses.map((slug) => {
              const s = bySlug.get(slug);
              if (!s) return null;
              const done = s.progress_percentage >= 100;
              return (
                <li key={slug}>
                  <Link href={`/learn/${slug}`} className="group block">
                    <span className="flex items-center gap-1.5">
                      {done && <CheckCircle2 aria-label="Completed" className="size-4 text-note" />}
                      <span className={clsx("text-[15px] font-semibold group-hover:text-accent-ink", done && "text-mute")}>{s.name}</span>
                      {slug === next && (
                        <span className="ml-auto rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper">You are here</span>
                      )}
                    </span>
                    <Progress value={s.progress_percentage} className="mt-1.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ol>
  );
}
