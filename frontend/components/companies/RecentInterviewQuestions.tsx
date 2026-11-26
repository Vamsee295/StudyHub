import { InterviewProblem } from "@/types";
import { Code2 } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { fallbackFor, problemIdForTitle } from "@/lib/data/companyPrep";

interface RecentInterviewQuestionsProps {
  questions: InterviewProblem[];
  companyName: string;
}

export function RecentInterviewQuestions({ questions, companyName }: RecentInterviewQuestionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="label-cond text-[20px]">Problems in the style {companyName} asks</h3>
        <p className="text-[13px] text-body">Classic problems on the topics this company tests. Where we have the problem, solve it right here.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {questions.map((q) => {
          const isHard = q.difficulty === "Hard" || q.difficulty === "Medium-Hard";
          const isMedium = q.difficulty === "Medium" || q.difficulty === "Easy-Medium";
          return (
            <div key={q.id} className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-hair bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-mute">{q.domain}</span>
                <span
                  className={clsx(
                    "rounded-full border-[1.5px] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                    isHard ? "border-danger-line bg-danger-soft text-danger" : isMedium ? "border-warning-line bg-warning-soft text-warning" : "border-success-line bg-success-soft text-note"
                  )}
                >
                  {q.difficulty}
                </span>
              </div>
              <h4 className="text-[15px] font-semibold leading-snug">{q.title}</h4>
              <p className="line-clamp-2 text-[13px] leading-relaxed text-body">{q.description}</p>
              {(() => {
                const id = problemIdForTitle(q.title);
                const fallback = fallbackFor(q.domain);
                return (
                  <Link
                    href={id ? `/practice/problems/${id}` : fallback.href}
                    className="mt-auto inline-flex items-center gap-1.5 border-t-[1.5px] border-hair pt-3 font-mono text-[12px] uppercase tracking-wider text-accent-ink hover:underline"
                  >
                    <Code2 aria-hidden className="size-3.5" /> {id ? "Solve it" : fallback.label}
                  </Link>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
