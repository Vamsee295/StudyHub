import { Briefcase, Clock, FileCode, Database, Cpu, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { PlacementSimulation } from "@/types";

interface PlacementSectionProps {
  simulations: PlacementSimulation[];
}

export function PlacementSection({ simulations }: PlacementSectionProps) {
  if (simulations.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider font-semibold flex items-center gap-2">
            Enterprise Standard <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span> Recruiter Pattern Matching
          </h2>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight">Placement Practice</h3>
            <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono font-semibold bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-soft-border)] px-1.5 py-0.5 rounded uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" />
              Verified for 2026 Campus Cycle
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)] max-w-2xl">
            Curated interview simulations matching verified recruitment patterns from Tier-1 and MNC engineering drives.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {simulations.map((sim, index) => {
          const isFeatured = sim.isFeaturedSpan;
          
          return (
            <div 
              key={sim.id} 
              className={clsx(
                "group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--border-strong)] hover:shadow-md transition-all overflow-hidden",
                isFeatured ? "lg:col-span-2 bg-[var(--surface-subdued)]/50" : ""
              )}
            >
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[var(--ink-tertiary)]" />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--ink-secondary)]">
                      {sim.companyTag}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-[var(--accent)] bg-[var(--accent-soft)] px-1.5 py-0.5 rounded">
                    {sim.cycleBadge}
                  </span>
                </div>
                
                <h4 className="text-[17px] font-bold text-[var(--ink)] mb-2 leading-tight group-hover:text-[var(--accent)] transition-colors">
                  {sim.title}
                </h4>
                <p className="text-[13px] text-[var(--ink-secondary)] mb-5 leading-relaxed line-clamp-3 flex-1">
                  {sim.description}
                </p>

                {sim.components && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
                    {sim.components.map((comp, idx) => (
                      <div key={idx} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2.5 flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">{comp.name}</span>
                        <span className="text-[12px] font-semibold text-[var(--ink)]">{comp.detail}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-auto border-t border-[var(--border)]/60 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-[12px] font-medium text-[var(--ink-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" />
                      {sim.questionsCount} Qs
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {sim.timeMinutes}m
                    </span>
                    <span className={clsx(
                      "px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold",
                      sim.difficulty.includes("Hard") ? "bg-red-50 text-red-700" :
                      sim.difficulty.includes("Mixed") ? "bg-[var(--surface-subdued)] text-[var(--ink-secondary)]" :
                      "bg-orange-50 text-orange-700"
                    )}>
                      {sim.difficulty}
                    </span>
                  </div>
                  
                  <Link 
                    href={`/practice/session/${sim.id}`}
                    className="flex justify-center items-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--ink)] hover:text-[var(--ink)] text-[var(--ink-secondary)] px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors shadow-sm"
                  >
                    Launch Simulation
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
