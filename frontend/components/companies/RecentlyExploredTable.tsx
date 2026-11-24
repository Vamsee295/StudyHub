import { RecentCompanyLog } from "@/types";
import { ChevronRight, Trash2 } from "lucide-react";

interface RecentlyExploredTableProps {
  history: RecentCompanyLog[];
  onClear: () => void;
  onSelect: (id: string) => void;
}

function ago(ts: number) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "Yesterday" : `${d} days ago`;
}

/** The last companies opened on this device, newest first. */
export function RecentlyExploredTable({ history, onClear, onSelect }: RecentlyExploredTableProps) {
  if (history.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="label-cond text-[22px]">Recently opened</h2>
        <button onClick={onClear} className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-danger">
          <Trash2 className="size-3.5" /> Clear
        </button>
      </div>
      <ul className="border-t-[1.5px] border-hair">
        {history.map((log) => (
          <li key={log.id} className="border-b-[1.5px] border-hair">
            <button onClick={() => onSelect(log.id)} className="group flex w-full items-center gap-4 px-1 py-3 text-left hover:bg-card-2 md:px-2">
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold group-hover:text-accent-ink">{log.name}</span>
                <span className="block text-[13px] text-mute">{log.targetRole}</span>
              </span>
              <span className="shrink-0 font-mono text-[12px] text-mute">{ago(log.viewedAt)}</span>
              <ChevronRight aria-hidden className="size-4 shrink-0 text-mute transition-transform group-hover:translate-x-0.5" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
