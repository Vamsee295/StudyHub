import React from "react";
import Link from "next/link";
import { FolderKanban, MoreVertical, FileText, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { SavedTemplateRecord } from "@/types";

export function MyTemplatesTable({ savedTemplates }: { savedTemplates: SavedTemplateRecord[] }) {
  return (
    <section id="my-templates" className="mb-20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-bold text-[var(--ink)] flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-[var(--ink-secondary)]" />
          My Templates
        </h2>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
        {savedTemplates && savedTemplates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[var(--surface-subdued)]/50 border-b border-[var(--border)]">
                  <th className="py-3 px-5 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Template Name</th>
                  <th className="py-3 px-5 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Type</th>
                  <th className="py-3 px-5 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Target Drive / Role</th>
                  <th className="py-3 px-5 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Last Updated</th>
                  <th className="py-3 px-5 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Status</th>
                  <th className="py-3 px-5 text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/60">
                {savedTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-[var(--surface-subdued)]/30 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[var(--surface-subdued)] border border-[var(--border)] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-[var(--ink-secondary)]" />
                        </div>
                        <span className="text-[14px] font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                          {template.templateName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-[12px] font-medium text-[var(--ink-secondary)] bg-[var(--surface-subdued)] px-2 py-0.5 rounded border border-[var(--border)]/50 whitespace-nowrap">
                        {template.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-[13px] text-[var(--ink-secondary)] line-clamp-1">{template.targetRole}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-[12px] text-[var(--ink-tertiary)] whitespace-nowrap">{template.lastUpdated}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={clsx(
                          "flex items-center gap-1.5 text-[12px] font-semibold px-2 py-0.5 rounded-full w-fit whitespace-nowrap",
                          template.status === "Draft" && "text-[#ca8a04] bg-[#fef9c3] border border-[#fef08a]",
                          template.status === "Ready" && "text-[#166534] bg-[#dcfce3] border border-[#bbf7d0]",
                          template.status === "Archived" && "text-[var(--ink-tertiary)] bg-[var(--surface-subdued)] border border-[var(--border)]"
                        )}
                      >
                        {template.status === "Ready" && <CheckCircle2 className="w-3 h-3" />}
                        {template.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={template.href}
                          className="text-[12px] font-semibold text-[var(--ink)] bg-white border border-[var(--border)] hover:border-[var(--border-strong)] px-3 py-1.5 rounded-lg shadow-sm transition-all"
                        >
                          Open
                        </Link>
                        <button className="p-1.5 text-[var(--ink-tertiary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 bg-[var(--surface-subdued)] rounded-xl flex items-center justify-center mb-3">
              <FolderKanban className="w-6 h-6 text-[var(--ink-tertiary)]" />
            </div>
            <h3 className="text-[15px] font-bold text-[var(--ink)] mb-1">No templates saved yet</h3>
            <p className="text-[13px] text-[var(--ink-secondary)] max-w-sm">
              Templates you customize and save will appear here for quick access later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
