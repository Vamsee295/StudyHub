import { QuestionWeight } from "@/types";
import { BarChart3 } from "lucide-react";
import { clsx } from "clsx";

interface QuestionWeightingProps {
  weights: QuestionWeight[];
}

export function QuestionWeighting({ weights }: QuestionWeightingProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 text-ink">
        <BarChart3 className="w-5 h-5" />
        <h3 className="text-lg font-bold">Topic Weighting (Past 24 Months)</h3>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {weights.map((weight) => (
          <div 
            key={weight.topic}
            className="flex items-center gap-2 bg-paper-2 border border-hair rounded-lg px-3 py-2"
          >
            <span className="text-[13px] font-medium text-ink">{weight.topic}</span>
            <span className="w-px h-3 bg-ink/25" />
            <span className={clsx(
              "text-[11px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
              weight.label === "Very High" 
                ? "bg-accent-soft text-accent-ink"
                : "text-body"
            )}>
              {weight.frequency > 0 ? `${weight.frequency} ${weight.label}` : weight.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
