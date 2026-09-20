import Link from "next/link";
import { ArrowRight, Lightbulb, Compass, Target, AlertCircle } from "lucide-react";
import { pathRecommendations } from "@/lib/data/resourcesData";
import { clsx } from "clsx";

export function RecommendedPathSection() {
  if (!pathRecommendations || pathRecommendations.length === 0) return null;

  const getBadgeIcon = (type: string) => {
    if (type.includes("Curriculum")) return <Compass className="w-3.5 h-3.5" />;
    if (type.includes("Diagnostic")) return <AlertCircle className="w-3.5 h-3.5" />;
    if (type.includes("Milestone")) return <Target className="w-3.5 h-3.5" />;
    return <Lightbulb className="w-3.5 h-3.5" />;
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-newsreader font-medium text-[var(--ink)]">Recommended for Your Path</h2>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
            <Lightbulb className="w-3 h-3" />
            Contextual
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {pathRecommendations.map((rec) => (
          <div 
            key={rec.id}
            className="group relative bg-[var(--surface)] border border-[var(--border)] border-t-[3px] border-t-[var(--accent)] rounded-2xl p-5 hover:shadow-md hover:shadow-[var(--accent)]/5 transition-all flex flex-col h-full"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border border-[var(--border)] flex items-center gap-1.5">
                {getBadgeIcon(rec.badgeType)}
                {rec.badgeType}
              </span>
            </div>

            <h3 className="text-[16px] font-semibold text-[var(--ink)] leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors">
              {rec.title}
            </h3>
            
            <p className="text-[13.5px] text-[var(--ink-secondary)] leading-relaxed mb-4 flex-1">
              {rec.description}
            </p>

            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[12px] text-blue-800 leading-snug font-medium">
                  {rec.rationale}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)]">
              <span className="text-[12px] font-medium text-[var(--ink-tertiary)]">
                {rec.readTime}
              </span>
              <Link
                href={rec.href}
                className="flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors group/link"
              >
                Start Module
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
