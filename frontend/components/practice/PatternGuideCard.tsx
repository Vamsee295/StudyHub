import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import { Diagram } from "@/components/learn/Diagram";
import { PATTERN_GUIDES } from "@/lib/data/patterns";
import type { ProblemCategory } from "@/lib/problems/problemRegistry";

/** How a problem topic works: plain words, a diagram, when to use it, the template, and where to learn more. */
export function PatternGuideCard({ category, compact = false }: { category: ProblemCategory; compact?: boolean }) {
  const g = PATTERN_GUIDES[category];
  if (!g) return null;
  return (
    <div className="fade-in flex flex-col gap-4 rounded-2xl border-[1.5px] border-hair bg-card p-4 md:p-5">
      <p className="text-[15px] leading-relaxed text-body">{g.plain}</p>
      <Diagram code={g.diagram} caption={g.caption} />
      <div className={compact ? "flex flex-col gap-4" : "grid gap-4 md:grid-cols-2"}>
        <div>
          <p className="eyebrow mb-1.5">Use it when</p>
          <ul className="list-disc space-y-1 pl-5 text-[14px] text-body marker:text-accent">
            {g.whenToUse.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-1.5">Template</p>
          <ol className="list-decimal space-y-1 pl-5 text-[14px] text-body marker:font-mono marker:text-mute">
            {g.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </div>
      <p className="font-mono text-[12px] text-mute">{g.complexity}</p>
      {(g.learn || g.watch) && (
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t-[1.5px] border-hair pt-3 text-[13.5px] font-semibold">
          {g.learn && (
            <Link href={g.learn.href} className="inline-flex items-center gap-1.5 text-accent-ink hover:underline">
              <BookOpen className="size-4" /> Lesson: {g.learn.title}
            </Link>
          )}
          {g.watch && (
            <a href={g.watch.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-accent-ink hover:underline">
              <ExternalLink className="size-4" /> {g.watch.title}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
