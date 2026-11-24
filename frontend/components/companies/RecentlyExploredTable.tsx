import { RecentCompanyLog } from "@/types";
import { Clock, Trash2 } from "lucide-react";
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
          <Clock className="w-5 h-5 text-body" />
          <h2 className="text-xl font-semibold text-ink tracking-tight">Recently Explored</h2>
        </div>
        <button 
          onClick={onClear}
          className="flex items-center gap-1.5 text-[12px] font-medium text-mute hover:text-danger transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear History
        </button>
      </div>

      <div className="bg-card border border-hair rounded-xl overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-paper-2 border-b border-hair">
                <th className="px-5 py-3 text-[11px] font-semibold text-mute uppercase tracking-wider">Company & Target Role</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-mute uppercase tracking-wider">Last Interaction</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-mute uppercase tracking-wider">Cohort Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-mute uppercase tracking-wider text-right">Sprint Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hair">
              {history.map((log) => (
                <tr 
                  key={log.id} 
                  className="hover:bg-paper-2/50 transition-colors cursor-pointer group"
                  onClick={() => onSelect(log.id)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-ink group-hover:text-accent-ink transition-colors">{log.name}</span>
                      <span className="text-[12px] text-body">{log.targetRole}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] text-body font-medium">{log.lastInteraction}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={clsx(
                      "inline-flex text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                      log.cohortStatus === "Active" ? "bg-accent-soft text-accent-ink border border-accent-line" :
                      "bg-paper text-mute border border-hair"
                    )}>
                      {log.cohortStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent-ink hover:text-accent-ink transition-colors">
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
