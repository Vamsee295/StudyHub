import { History, ArrowRight } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { PracticeAttemptLedger } from "@/types";

interface RecentPracticeSectionProps {
  ledger: PracticeAttemptLedger[];
}

export function RecentPracticeSection({ ledger }: RecentPracticeSectionProps) {
  if (ledger.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider font-semibold flex items-center gap-2">
            Telemetry Log <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span> Historical Verification
          </h2>
          <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight">Recent Practice</h3>
          <p className="text-[13px] text-[var(--ink-secondary)] max-w-2xl">
            Track accuracy, review mistakes, and inspect detailed test case breakdowns from your previous runs.
          </p>
        </div>
        <Link 
          href="/practice/history"
          className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium bg-[var(--surface-subdued)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--ink)] px-3 py-1.5 rounded-lg transition-colors shadow-sm"
        >
          View Full Practice Log
        </Link>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-subdued)]/50">
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Session Details</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Accuracy & Score</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider hidden md:table-cell">Time Elapsed</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/60">
              {ledger.map((attempt) => {
                const isHighAccuracy = attempt.accuracyPercent >= 80;
                const isMedAccuracy = attempt.accuracyPercent >= 60 && attempt.accuracyPercent < 80;
                
                return (
                  <tr key={attempt.id} className="hover:bg-[var(--surface-subdued)]/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-semibold text-[var(--ink)]">{attempt.title}</span>
                        <span className="text-[12px] text-[var(--ink-tertiary)]">{attempt.sessionType}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                        <div className="flex items-center justify-between text-[12px]">
                          <span className="font-semibold text-[var(--ink)]">{attempt.correctQuestions}/{attempt.totalQuestions}</span>
                          <span className={clsx(
                            "font-bold",
                            isHighAccuracy ? "text-[var(--success)]" : isMedAccuracy ? "text-[var(--warning)]" : "text-[var(--error)]"
                          )}>{attempt.accuracyPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                          <div 
                            className={clsx(
                              "h-full rounded-full",
                              isHighAccuracy ? "bg-[var(--success)]" : isMedAccuracy ? "bg-[var(--warning)]" : "bg-[var(--error)]"
                            )}
                            style={{ width: `${attempt.accuracyPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-[13px] text-[var(--ink-secondary)] font-mono">
                      {attempt.timeElapsed}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell text-[13px] text-[var(--ink-secondary)]">
                      {attempt.completedAt}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link 
                        href={`/practice/review/${attempt.id}`}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                      >
                        Review <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
