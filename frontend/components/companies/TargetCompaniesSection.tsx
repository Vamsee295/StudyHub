import Link from "next/link";
import { clsx } from "clsx";
import { ChevronRight, Settings2 } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import type { CompanyEntry } from "@/lib/data/companyData";
import { CompanyLogo } from "./CompanyLogo";

interface TargetCompaniesSectionProps {
  targets: CompanyEntry[];
  personal: boolean; // the learner's own targets, not the popular defaults
  selectedId: string;
  onSelect: (id: string) => void;
}

/** The learner's target companies (from their profile), or popular ones until they set some. */
export function TargetCompaniesSection({ targets, personal, selectedId, onSelect }: TargetCompaniesSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">{personal ? "Your targets" : "Popular"}</span>
          <span className="display text-[28px] md:text-[34px]">{personal ? "Companies you're aiming for" : "Where students aim"}</span>
        </h2>
        <Link href="/profile/target-companies" className={`${buttonClass("secondary", "sm")} max-sm:hidden`}>
          <Settings2 className="size-4" />
          {personal ? "Edit targets" : "Set your targets"}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {targets.map((c) => {
          const isSelected = selectedId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              aria-pressed={isSelected}
              className={clsx(
                "no-press group flex h-full flex-col gap-4 rounded-2xl border-[2.4px] bg-card p-5 text-left transition-[transform,box-shadow] duration-150",
                isSelected ? "border-line shadow-[4px_5px_0_var(--hard)]" : "border-hair hover:border-line"
              )}
            >
              <span className="flex items-start justify-between">
                <CompanyLogo company={c} size={40} />
                {isSelected && <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper">Showing</span>}
              </span>
              <span>
                <span className="label-cond block text-[20px] leading-tight group-hover:text-accent-ink">{c.name}</span>
                <span className="text-[13px] text-mute">{c.segment}</span>
              </span>
              <span className="flex flex-wrap gap-1.5">
                {c.topTopics.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-md border-[1.5px] border-hair px-1.5 py-0.5 font-mono text-[11px] text-body">
                    {t}
                  </span>
                ))}
              </span>
              <span className="mt-auto flex items-center justify-between border-t-[1.5px] border-hair pt-3 font-mono text-[12px] uppercase tracking-wider text-mute">
                {c.counts.total.toLocaleString()} questions
                <ChevronRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
