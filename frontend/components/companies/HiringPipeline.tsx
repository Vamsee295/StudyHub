import { HiringStage } from "@/types";
import { CheckCircle2, CircleDashed, Circle, Clock, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface HiringPipelineProps {
  stages: HiringStage[];
  activeStageIndex: number;
  setActiveStageIndex: (index: number) => void;
}

export function HiringPipeline({
  stages,
  activeStageIndex,
  setActiveStageIndex,
}: HiringPipelineProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-[var(--ink)] flex items-center gap-2">
            Hiring Pipeline & Elimination Thresholds
          </h3>
          <p className="text-[13px] text-[var(--ink-secondary)]">Verified Evaluation Sequence</p>
        </div>
        <span className="hidden sm:inline-flex px-2 py-1 bg-[var(--surface-subdued)] border border-[var(--border)] rounded text-[10px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">
          Updated Sept 2026 via Campus Engine
        </span>
      </div>

      {/* Pipeline Visual */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 relative">
        {stages.map((stage, idx) => {
          const isActive = activeStageIndex === idx;
          const isCleared = stage.status === "Cleared";
          const isInFlight = stage.status === "In-Flight";
          
          return (
            <div
              key={stage.stageNumber}
              onClick={() => setActiveStageIndex(idx)}
              className={clsx(
                "flex-1 flex flex-col p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden",
                isActive 
                  ? "bg-[var(--surface)] border-[var(--ink)] shadow-sm" 
                  : "bg-[var(--surface-subdued)] border-[var(--border)] hover:border-[var(--border-strong)]",
                isCleared && !isActive && "opacity-80"
              )}
            >
              {/* Top Row: Status Icon & Number */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--surface)] shadow-sm border border-[var(--border)] text-[11px] font-mono font-bold text-[var(--ink)] z-10">
                  {stage.stageNumber}
                </div>
                
                {isCleared ? (
                  <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                ) : isInFlight ? (
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <span className="absolute w-full h-full rounded-full border-2 border-[var(--warning)] border-t-transparent animate-spin opacity-50" />
                    <CircleDashed className="w-4 h-4 text-[var(--warning)]" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-[var(--border-strong)]" />
                )}
              </div>

              {/* Title & Status */}
              <div className="flex flex-col gap-1 z-10">
                <span className={clsx(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isCleared ? "text-[var(--success)]" : isInFlight ? "text-[var(--warning)]" : "text-[var(--ink-tertiary)]"
                )}>
                  {stage.status}
                </span>
                <h4 className={clsx(
                  "text-sm font-semibold leading-tight",
                  isActive ? "text-[var(--ink)]" : "text-[var(--ink-secondary)]"
                )}>
                  {stage.title}
                </h4>
              </div>

              {/* Active State Detail Panel (simulated by expansion in mobile, or always there but hidden if not active) */}
              <div className={clsx(
                "mt-4 pt-3 border-t border-[var(--border)] transition-all duration-300 flex flex-col gap-3",
                isActive ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden pt-0 mt-0 border-t-0"
              )}>
                <p className="text-[12px] text-[var(--ink-secondary)] leading-relaxed">
                  {stage.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                    <Clock className="w-3.5 h-3.5" />
                    {stage.duration}
                  </span>
                  <button className="text-[11px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-0.5">
                    View Drill <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Connecting Line (Desktop) */}
              {idx < stages.length - 1 && (
                <div className="hidden sm:block absolute top-7 -right-3 w-6 h-[2px] bg-[var(--border)] z-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
