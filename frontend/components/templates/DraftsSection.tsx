import React from "react";
import Link from "next/link";
import { ArrowRight, FileEdit, Clock } from "lucide-react";
import { TemplateDraft } from "@/types";

export function DraftsSection({ drafts }: { drafts: TemplateDraft[] }) {
  if (!drafts || drafts.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-bold text-[var(--ink)] flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-[var(--accent)]" />
          Continue With Your Templates
        </h2>
        <Link
          href="/templates#my-templates"
          className="text-[13px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1"
        >
          View all drafts <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--accent)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] transition-all flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--surface-subdued)]">
              <div
                className="h-full bg-[var(--accent)] rounded-r-full"
                style={{ width: `${draft.progress}%` }}
              ></div>
            </div>

            <div className="flex flex-col flex-1 mt-2">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono font-semibold text-[var(--ink-secondary)] bg-[var(--surface-subdued)] px-2 py-0.5 rounded tracking-wider uppercase border border-[var(--border)]/50">
                  {draft.targetRole}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--ink-tertiary)]">
                  <Clock className="w-3.5 h-3.5" />
                  {draft.lastEdited}
                </div>
              </div>
              
              <h3 className="text-[16px] font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                {draft.title}
              </h3>
              
              <p className="text-[13px] text-[var(--ink-secondary)] line-clamp-2 leading-relaxed mb-5">
                {draft.description}
              </p>
            </div>

            <Link
              href={draft.href}
              className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border)]/60 text-[13px] font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors"
            >
              <span>Continue Editing</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
