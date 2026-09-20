import { RecentCompanyLog } from "@/types";
import { Clock, ArrowRight, Trash2 } from "lucide-react";
import { clsx } from "clsx";

interface RecentlyExploredTableProps {
  history: RecentCompanyLog[];
  onClear: () => void;
  onSelect: (id: string) => void;
}

export function RecentlyExploredTable({ history, onClear, onSelect }: RecentlyExploredTableProps) {
  if (history.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[var(--ink-secondary)]" />
          <h2 className="text-xl font-semibold text-[var(--ink)] tracking-tight">Recently Explored</h2>
        </div>
        <button 
          onClick={onClear}
          className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--ink-tertiary)] hover:text-[var(--error)] transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear History
        </button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--surface-subdued)] border-b border-[var(--border)]">
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">Company & Target Role</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">Last Interaction</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">Cohort Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider hidden sm:table-cell">Readiness</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider text-right">Sprint Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {history.map((log) => (
                <tr 
                  key={log.id} 
                  className="hover:bg-[var(--surface-subdued)]/50 transition-colors cursor-pointer group"
                  onClick={() => onSelect(log.id)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">{log.name}</span>
                      <span className="text-[12px] text-[var(--ink-secondary)]">{log.targetRole}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] text-[var(--ink-secondary)] font-medium">{log.lastInteraction}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={clsx(
                      "inline-flex text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                      log.cohortStatus === "Active" ? "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft-border)]" :
                      "bg-[#f8fafc] text-[var(--ink-tertiary)] border border-[var(--border)]"
                    )}>
                      {log.cohortStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={clsx("text-[13px] font-mono font-bold", log.readinessScore > 75 ? "text-[var(--success)]" : "text-[var(--ink-secondary)]")}>
                      {log.readinessScore}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                      {log.sprintAction}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
