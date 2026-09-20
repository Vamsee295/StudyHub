import { ArrowRight, Activity, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { RecommendedDiagnostic } from "@/types";

interface RecommendedSectionProps {
  diagnostics: RecommendedDiagnostic[];
}

export function RecommendedSection({ diagnostics }: RecommendedSectionProps) {
  if (diagnostics.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider font-semibold flex items-center gap-2">
            Telemetry Guided <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span> Diagnostic Gaps
          </h2>
          <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight">Recommended For You</h3>
          <p className="text-[13px] text-[var(--ink-secondary)] max-w-2xl">
            AI-calibrated practice sets addressing detected conceptual gaps in your recent submissions.
          </p>
        </div>
        <Link 
          href="/dashboard"
          className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
        >
          View Full Analysis <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {diagnostics.map((diag) => {
          const isRed = diag.accentColor === "red";
          const isBlue = diag.accentColor === "blue";
          
          return (
            <div key={diag.id} className="group flex flex-col bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden hover:border-[var(--border-strong)] hover:shadow-md transition-all">
              {/* Dynamic Top Border */}
              <div className={clsx(
                "h-1.5 w-full",
                isRed ? "bg-[var(--error)]" : isBlue ? "bg-[var(--accent)]" : "bg-[var(--navy)]"
              )}></div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 mb-3">
                  {isRed && <AlertCircle className="w-3.5 h-3.5 text-[var(--error)]" />}
                  {isBlue && <TrendingUp className="w-3.5 h-3.5 text-[var(--accent)]" />}
                  {!isRed && !isBlue && <Activity className="w-3.5 h-3.5 text-[var(--navy)]" />}
                  <span className={clsx(
                    "text-[10px] font-mono font-semibold tracking-wider",
                    isRed ? "text-[var(--error)]" : isBlue ? "text-[var(--accent)]" : "text-[var(--navy)]"
                  )}>
                    {diag.badge}
                  </span>
                </div>
                
                <h4 className="text-[15px] font-bold text-[var(--ink)] mb-2 leading-tight">{diag.title}</h4>
                <p className="text-[13px] text-[var(--ink-secondary)] mb-5 leading-relaxed line-clamp-3">
                  {diag.description}
                </p>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                    <span className="text-[var(--ink-tertiary)]">{diag.metricLabel}</span>
                    <span className="text-[var(--ink)]">{diag.metricValueText}</span>
                  </div>
                  {/* Progress bar container */}
                  <div className="h-1.5 w-full bg-[var(--surface-subdued)] rounded-full overflow-hidden mb-5">
                    <div 
                      className={clsx(
                        "h-full rounded-full transition-all duration-1000",
                        isRed ? "bg-[var(--error)]" : isBlue ? "bg-[var(--accent)]" : "bg-[var(--navy)]"
                      )}
                      style={{ width: `${diag.metricPercent}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-[var(--border)]/60 pt-4">
                    <span className="text-[12px] text-[var(--ink-secondary)] font-medium">
                      {diag.questionCount} Qs · {diag.estimatedMinutes}m
                    </span>
                    <Link
                      href={`/practice/session/${diag.id}`}
                      className={clsx(
                        "text-[13px] font-semibold transition-colors flex items-center gap-1",
                        isRed 
                          ? "text-[var(--error)] hover:text-red-700" 
                          : isBlue 
                            ? "text-[var(--accent)] hover:text-[var(--accent-hover)]" 
                            : "text-[var(--navy)] hover:text-black"
                      )}
                    >
                      {diag.ctaText}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
