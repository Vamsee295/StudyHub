import { InterviewProblem } from "@/types";
import { Code2, ArrowUpRight, History } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

interface RecentInterviewQuestionsProps {
  questions: InterviewProblem[];
  companyName: string;
}

export function RecentInterviewQuestions({ questions, companyName }: RecentInterviewQuestionsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-[var(--ink)] flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent {companyName} Interview Problems
          </h3>
          <p className="text-[13px] text-[var(--ink-secondary)]">Verified problems from candidates in Cycle 2026.</p>
        </div>
        <Link 
          href={`/practice?search=${encodeURIComponent(companyName)}`}
          className="hidden sm:inline-flex text-[12px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
        >
          View All Questions →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((q) => {
          const isHard = q.difficulty === "Hard" || q.difficulty === "Medium-Hard";
          const isMedium = q.difficulty === "Medium" || q.difficulty === "Easy-Medium";

          return (
            <div key={q.id} className="flex flex-col bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-xl p-4 gap-4 transition-all hover:shadow-sm group">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--ink-secondary)]">
                    {q.domain}
                  </span>
                  <span className={clsx(
                    "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                    isHard ? "bg-[var(--error-soft)] text-[var(--error)]" :
                    isMedium ? "bg-[var(--warning-soft)] text-[var(--warning)]" :
                    "bg-[var(--success-soft)] text-[var(--success)]"
                  )}>
                    {q.difficulty}
                  </span>
                </div>
                <h4 className="text-[15px] font-bold text-[var(--ink)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                  {q.title}
                </h4>
                <p className="text-[13px] text-[var(--ink-secondary)] line-clamp-2 leading-relaxed">
                  {q.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold text-[var(--ink)]">{q.recurrenceRate}</span>
                  <span className="text-[10px] text-[var(--ink-tertiary)]">{q.askedDate}</span>
                </div>
                <Link 
                  href="/practice"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-subdued)] hover:bg-[var(--border)] rounded-lg text-[12px] font-semibold text-[var(--ink)] transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Practice
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
