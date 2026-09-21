import React from "react";
import { RecentToolAuditRecord } from "@/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { clsx } from "clsx";

export function RecentlyUsedLedger({ items }: { items: RecentToolAuditRecord[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-20 animate-in fade-in duration-500 delay-700">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[14px] font-bold text-[var(--ink)] tracking-wide uppercase flex items-center gap-2">
          <span className="text-[var(--ink-tertiary)] font-mono">Audit Ledger /</span> Recently Used
        </h2>
        <span className="text-[13px] text-[var(--ink-secondary)] font-medium hidden sm:block">
          Local runtime & synchronization log
        </span>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-subdued)]/50">
                <th className="py-3 px-5 text-[11px] font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">
                  Tool
                </th>
                <th className="py-3 px-5 text-[11px] font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-5 text-[11px] font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">
                  Last Used
                </th>
                <th className="py-3 px-5 text-[11px] font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider w-1/3">
                  Progress / State
                </th>
                <th className="py-3 px-5 text-[11px] font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--surface-subdued)]/30 transition-colors group">
                  <td className="py-4 px-5">
                    <span className="text-[13.5px] font-bold text-[var(--ink)]">
                      {item.toolName}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="pill pill-neutral">{item.category}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[13px] font-medium text-[var(--ink-secondary)]">
                      {item.lastUsed}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px] h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            "h-full rounded-full",
                            item.statusType === "success" ? "bg-[var(--success)]" : "bg-[var(--accent)]"
                          )}
                          style={{ width: `${item.progressPercent}%` }}
                        ></div>
                      </div>
                      <span
                        className={clsx(
                          "text-[12px] font-medium",
                          item.statusType === "success"
                            ? "text-[var(--success)]"
                            : "text-[var(--ink-secondary)]"
                        )}
                      >
                        {item.statusText}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
                    >
                      {item.progressPercent < 100 ? "Continue" : "Open"}
                      <ChevronRight className="w-3.5 h-3.5 arrow" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Telemetry Footer */}
        <div className="bg-[var(--surface-subdued)]/50 border-t border-[var(--border)] py-2.5 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10.5px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
            Verified StudyHub Workbench Tools v2.6 · Real-time local execution & progress sync
          </div>
          <div>LATENCY: 12ms · ALL SYSTEMS OPERATIONAL</div>
        </div>
      </div>
    </section>
  );
}
