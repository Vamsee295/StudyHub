import { CompanyRecommendation } from "@/types";
import { Sparkles, ArrowRight } from "lucide-react";

interface RecommendedCompaniesProps {
  recommendations: CompanyRecommendation[];
}

export function RecommendedCompanies({ recommendations }: RecommendedCompaniesProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[var(--warning)]" />
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-semibold text-[var(--ink)] tracking-tight">Recommended for Your Profile</h2>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Affinity matching based on your learning mastery and recent practice metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col h-full gap-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] relative overflow-hidden group">
            {/* Ambient Match Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--warning)] opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity" />

            <div className="flex items-start justify-between">
              <h3 className="text-[16px] font-bold text-[var(--ink)]">{rec.name}</h3>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">Affinity Match</span>
                <span className="text-sm font-mono font-bold text-[var(--warning)]">{rec.matchPercentage}%</span>
              </div>
            </div>

            <p className="text-[13px] text-[var(--ink-secondary)] leading-relaxed">
              {rec.rationale}
            </p>

            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--ink-secondary)]">
                <span className="text-[var(--ink)] font-bold">{rec.roadmapsCount}</span> Roadmaps
              </div>
              <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--ink-secondary)]">
                <span className="text-[var(--ink)] font-bold">{rec.practiceSetsCount}</span> Practice Sets
              </div>
            </div>

            <button className="w-full py-2 mt-2 bg-[var(--surface-subdued)] hover:bg-[var(--border)] border border-transparent hover:border-[var(--border-strong)] text-[12.5px] font-semibold text-[var(--ink)] rounded-lg transition-colors flex items-center justify-center gap-1.5">
              Explore Track <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
