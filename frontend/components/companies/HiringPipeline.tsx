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
          <h3 className="text-lg font-bold text-ink flex items-center gap-2">
            Hiring Pipeline & Elimination Thresholds
          </h3>
          <p className="text-[13px] text-body">The rounds, in order</p>
        </div>
        <span className="hidden sm:inline-flex px-2 py-1 bg-paper-2 border border-hair rounded text-[10px] font-mono text-mute uppercase tracking-wider">
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
                  ? "bg-card border-ink" 
                  : "bg-paper-2 border-hair hover:border-line",
                isCleared && !isActive && "opacity-80"
              )}
            >
              {/* Top Row: Status Icon & Number */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-card border border-hair text-[11px] font-mono font-bold text-ink z-10">
                  {stage.stageNumber}
                </div>
                
                {isCleared ? (
                  <CheckCircle2 className="w-5 h-5 text-note" />
                ) : isInFlight ? (
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <span className="absolute w-full h-full rounded-full border-2 border-warning border-t-transparent animate-spin opacity-50" />
                    <CircleDashed className="w-4 h-4 text-warning" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-ink/25" />
                )}
              </div>

              {/* Title & Status */}
              <div className="flex flex-col gap-1 z-10">
                <span className={clsx(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isCleared ? "text-note" : isInFlight ? "text-warning" : "text-mute"
                )}>
                  {stage.status}
                </span>
                <h4 className={clsx(
                  "text-sm font-semibold leading-tight",
                  isActive ? "text-ink" : "text-body"
                )}>
                  {stage.title}
                </h4>
              </div>

              {/* Active State Detail Panel (simulated by expansion in mobile, or always there but hidden if not active) */}
              <div className={clsx(
                "mt-4 pt-3 border-t border-hair transition-all duration-300 flex flex-col gap-3",
                isActive ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden pt-0 mt-0 border-t-0"
              )}>
                <p className="text-[12px] text-body leading-relaxed">
                  {stage.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-mute">
                    <Clock className="w-3.5 h-3.5" />
                    {stage.duration}
                  </span>
                  <button className="text-[11px] font-semibold text-accent-ink hover:text-accent-ink flex items-center gap-0.5">
                    View Drill <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Connecting Line (Desktop) */}
              {idx < stages.length - 1 && (
                <div className="hidden sm:block absolute top-7 -right-3 w-6 h-[2px] bg-hair z-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
