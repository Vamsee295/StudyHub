"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import { practiceApi, AttemptReview } from "@/lib/api/practice";

export default function PracticeReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [attempt, setAttempt] = useState<AttemptReview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    practiceApi
      .getAttempt(id)
      .then(setAttempt)
      .catch((err) => {
        console.error("Failed to load attempt", err);
        setError("This session could not be found.");
      });
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col gap-4 pb-16 w-full max-w-4xl mx-auto">
        <p className="text-[var(--ink)]">{error}</p>
        <Link href="/practice" className="text-[13px] text-[var(--accent)]">Back to Practice</Link>
      </div>
    );
  }
  if (!attempt) {
    return <div className="w-full max-w-4xl mx-auto text-[var(--ink-tertiary)]">Loading review...</div>;
  }

  const accuracy = attempt.total_questions > 0 ? Math.round((attempt.score / attempt.total_questions) * 100) : 0;
  const minutes = Math.floor(attempt.duration_seconds / 60);
  const seconds = attempt.duration_seconds % 60;

  return (
    <div className="flex flex-col gap-8 pb-16 w-full max-w-4xl mx-auto">
      <Link href="/practice" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Practice
      </Link>

      <div className="flex flex-col gap-4">
        <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] tracking-tight leading-tight">
          Session Review
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-semibold text-[var(--ink)]">{attempt.title}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
          <span className="text-[13px] text-[var(--ink-secondary)] uppercase font-mono">{attempt.domain}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
          <span className="text-[13px] text-[var(--ink-secondary)] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {minutes}m {seconds}s
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">Accuracy</span>
          <span className="text-3xl font-bold text-[var(--ink)]">{accuracy}%</span>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">Score</span>
          <span className="text-3xl font-bold text-[var(--ink)]">{attempt.score} / {attempt.total_questions}</span>
        </div>
        <div className="bg-[var(--surface-subdued)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-2 justify-center">
          <Link href={`/practice/session/${attempt.set_id}`} className="flex justify-center items-center bg-[var(--ink)] hover:bg-black text-[var(--surface)] px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
            Retake Session
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[var(--ink)] border-b border-[var(--border)]/80 pb-4">
          Question Breakdown
        </h3>

        <div className="flex flex-col gap-3">
          {attempt.questions.map((q, i) => {
            const a = q.answer;
            const isCorrect = !!a?.is_correct;
            const chosen = q.options.find((o) => o.id === a?.choice);
            const correct = q.options.find((o) => o.id === q.correct_option);
            return (
              <div key={q.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex items-start gap-4">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[var(--error)] shrink-0 mt-0.5" />
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-semibold text-[var(--ink)]">Question {i + 1}: {q.title}</span>
                    {a?.graded_by === "self" || (!a && q.options.length === 0) ? (
                      <span className="text-[12px] text-[var(--ink-secondary)]">
                        Self-assessed: you marked this {isCorrect ? "solved" : "not solved"}.
                      </span>
                    ) : (
                      <span className="text-[12px] text-[var(--ink-secondary)]">
                        Your answer: {chosen?.text ?? "not answered"}
                        {!isCorrect && correct && <> · Correct answer: {correct.text}</>}
                      </span>
                    )}
                  </div>
                </div>
                {a?.text && (
                  <pre className="text-[12px] font-mono whitespace-pre-wrap bg-[var(--surface-subdued)] border border-[var(--border)] rounded-md p-3 text-[var(--ink)]">{a.text}</pre>
                )}
                {q.explanation && (
                  <p className="text-[13px] text-[var(--ink-secondary)] leading-relaxed">
                    <span className="font-semibold text-[var(--ink)]">Explanation:</span> {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
