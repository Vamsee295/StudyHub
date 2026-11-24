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
          ? "bg-accent-soft border-accent-line text-accent-ink" 
          : "bg-paper-2 border-transparent hover:border-hair text-body hover:text-ink",
        className
      )}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      title={isBookmarked ? "Remove from saved" : "Save for later"}
    >
      <Bookmark className={clsx("w-4 h-4", isBookmarked && "fill-current")} />
    </button>
  );
}
