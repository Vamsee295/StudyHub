import { CompanyCompetency } from "@/types";
import { AlertCircle, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

interface CompetencyDiagnosticsProps {
  competencies: CompanyCompetency[];
  companyName: string;
}

export function CompetencyDiagnostics({ competencies, companyName }: CompetencyDiagnosticsProps) {
  const hasGaps = competencies.some((c) => c.isGap);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-[var(--ink)]">Competency Diagnostics</h3>
          <p className="text-[13px] text-[var(--ink-secondary)]">Your evaluated profile against {companyName} benchmarks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {competencies.map((comp) => {
          const statusColor = comp.isGap ? "var(--error)" : comp.score > 80 ? "var(--success)" : "var(--accent)";
          
          return (
            <div key={comp.name} className="flex flex-col gap-2.5">
              <div className="flex items-start justify-between">
                <span className={clsx(
                  "text-[13px] font-semibold",
                  comp.isGap ? "text-[var(--error)] flex items-center gap-1.5" : "text-[var(--ink)]"
                )}>
                  {comp.isGap && <AlertCircle className="w-3.5 h-3.5" />}
                  {comp.name}
                </span>
                <span className={clsx("text-xs font-mono font-bold", comp.isGap ? "text-[var(--error)]" : "text-[var(--ink-secondary)]")}>
                  {comp.score}%
                </span>
              </div>
              
              <div className="h-1.5 w-full bg-[var(--surface-subdued)] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${comp.score}%`,
                    backgroundColor: statusColor 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {hasGaps && (
        <div className="mt-2 bg-[var(--error-soft)] border border-[var(--error-soft-border)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--error)] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[var(--ink)]">Critical Focus Areas for Round 2 & Round 3</span>
              <span className="text-[13px] text-[var(--ink-secondary)]">Your Low-Level System Design readiness is below the 55% safe threshold.</span>
            </div>
          </div>
          <Link 
            href="/practice" 
            className="shrink-0 bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] hover:border-[var(--ink)] hover:shadow-sm px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all"
          >
            Launch LLD Drill <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
