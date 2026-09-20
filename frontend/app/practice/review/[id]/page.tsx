import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { practiceLedger } from "@/lib/data/practiceData";

export function generateStaticParams() {
  return practiceLedger.map(l => ({ id: l.id }));
}

export default async function PracticeReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const attempt = practiceLedger.find(l => l.id === id) || practiceLedger[0];

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
          <span className="text-[13px] text-[var(--ink-secondary)]">{attempt.sessionType}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
          <span className="text-[13px] text-[var(--ink-secondary)] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {attempt.timeElapsed}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">Accuracy</span>
          <span className="text-3xl font-bold text-[var(--ink)]">{attempt.accuracyPercent}%</span>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">Score</span>
          <span className="text-3xl font-bold text-[var(--ink)]">{attempt.correctQuestions} / {attempt.totalQuestions}</span>
        </div>
        <div className="bg-[var(--surface-subdued)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-2 justify-center">
          <Link href={`/practice/session/${attempt.id}`} className="flex justify-center items-center bg-[var(--ink)] hover:bg-black text-[var(--surface)] px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
            Retake Session
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[var(--ink)] border-b border-[var(--border)]/80 pb-4">
          Question Breakdown
        </h3>
        
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((q) => {
            const isCorrect = q !== 3; // Simulate one wrong answer
            return (
              <div key={q} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[var(--error)] shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-[var(--ink)]">Question {q}: {attempt.track === 'sql' ? 'Advanced JOIN Query' : 'Two Sum Implementation'}</span>
                    <span className="text-[12px] text-[var(--ink-secondary)]">
                      {isCorrect ? 'Passed all 12 test cases.' : 'Failed on hidden test case 8 (Time Limit Exceeded).'}
                    </span>
                  </div>
                </div>
                {!isCorrect && (
                  <button className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1 bg-[var(--accent-soft)] px-3 py-1.5 rounded-md w-fit">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Review Concept
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
