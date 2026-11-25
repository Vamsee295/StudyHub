import { HiringStage } from "@/types";
import { Clock } from "lucide-react";

/** The company's rounds in order. Editorial summary, not live data, so no per-user status. */
export function HiringPipeline({ stages }: { stages: HiringStage[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="label-cond text-[20px]">The rounds, in order</h3>
        <p className="text-[13px] text-body">A typical process. Rounds vary by year, role and campus.</p>
      </div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        {stages.map((stage) => (
          <li key={stage.stageNumber} className="flex flex-col gap-2 rounded-2xl border-[1.5px] border-hair bg-card p-4">
            <span className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-ink font-mono text-[11px] text-paper">{stage.stageNumber}</span>
              <span className="text-[15px] font-semibold leading-tight">{stage.title}</span>
            </span>
            <p className="text-[13px] leading-relaxed text-body">{stage.description}</p>
            {stage.duration && (
              <span className="mt-auto flex items-center gap-1.5 font-mono text-[11px] text-mute">
                <Clock aria-hidden className="size-3.5" /> {stage.duration}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
