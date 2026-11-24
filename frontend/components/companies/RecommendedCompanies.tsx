import { CompanyRecommendation } from "@/types";
import { Sparkles, ArrowRight } from "lucide-react";

interface RecommendedCompaniesProps {
  recommendations: CompanyRecommendation[];
}

export function RecommendedCompanies({ recommendations }: RecommendedCompaniesProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-warning" />
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-semibold text-ink tracking-tight">More companies to explore</h2>
          <p className="text-[13px] text-body">Companies that hire for similar roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-card border border-hair rounded-xl p-5 flex flex-col h-full gap-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] relative overflow-hidden group">

            <div className="flex items-start justify-between">
              <h3 className="text-[16px] font-bold text-ink">{rec.name}</h3>
            </div>

            <p className="text-[13px] text-body leading-relaxed">
              {rec.rationale}
            </p>

            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-hair">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-body">
                <span className="text-ink font-bold">{rec.roadmapsCount}</span> Roadmaps
              </div>
              <span className="w-1 h-1 rounded-full bg-ink/25" />
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-body">
                <span className="text-ink font-bold">{rec.practiceSetsCount}</span> Practice Sets
              </div>
            </div>

            <button className="w-full py-2 mt-2 bg-paper-2 hover:bg-hair border border-transparent hover:border-line text-[12.5px] font-semibold text-ink rounded-lg transition-colors flex items-center justify-center gap-1.5">
              Explore Track <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
