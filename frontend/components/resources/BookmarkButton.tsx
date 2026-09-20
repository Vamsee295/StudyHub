import { Bookmark } from "lucide-react";
import { clsx } from "clsx";

interface BookmarkButtonProps {
  resourceId: string;
  isBookmarked: boolean;
  onToggle: (id: string, e: React.MouseEvent) => void;
  className?: string;
}

export function BookmarkButton({ resourceId, isBookmarked, onToggle, className }: BookmarkButtonProps) {
  return (
    <button 
      onClick={(e) => onToggle(resourceId, e)}
      className={clsx(
        "p-2 rounded-lg transition-colors flex items-center justify-center border",
        isBookmarked 
          ? "bg-[var(--accent-soft)] border-[var(--accent-soft-border)] text-[var(--accent)]" 
          : "bg-[var(--surface-subdued)] border-transparent hover:border-[var(--border)] text-[var(--ink-secondary)] hover:text-[var(--ink)]",
        className
      )}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      title={isBookmarked ? "Remove from saved" : "Save for later"}
    >
      <Bookmark className={clsx("w-4 h-4", isBookmarked && "fill-current")} />
    </button>
  );
}
