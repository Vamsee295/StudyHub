import { Loader2 } from "lucide-react";

export default function LearnLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
      <div className="w-12 h-12 rounded-full bg-[var(--surface-subdued)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[var(--accent)] animate-spin" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-[15px] font-bold text-[var(--ink)]">Loading Learning Paths...</h2>
        <p className="text-[13px] text-[var(--ink-secondary)]">Retrieving your progress and modules.</p>
      </div>
    </div>
  );
}
