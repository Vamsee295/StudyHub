import { CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

/** Lesson status: tick when completed, a ring filled to the reading % while in progress, an empty ring otherwise. */
export function LessonDot({ status, progress = 0, inverted = false, className }: { status: string; progress?: number; inverted?: boolean; className?: string }) {
  if (status === "completed") {
    return <CheckCircle2 aria-label="Completed" className={clsx("shrink-0", inverted ? "text-paper" : "text-note", className)} />;
  }
  const pct = status === "in_progress" ? Math.max(0, Math.min(99, progress)) : 0;
  const fill = inverted ? "var(--paper)" : "var(--gold)";
  return (
    <span
      role="img"
      aria-label={pct > 0 ? `${pct}% read` : status === "in_progress" ? "Started" : "Not started"}
      className={clsx("block shrink-0 rounded-full border-2", inverted ? "border-paper" : pct > 0 ? "border-gold" : "border-ink/25", className)}
      style={pct > 0 ? { background: `conic-gradient(${fill} ${pct * 3.6}deg, transparent 0)` } : undefined}
    />
  );
}
