import { CompanyTarget } from "@/types";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Settings2, ChevronRight } from "lucide-react";
import { companyWorkspaces } from "@/lib/data/companiesData";
import { clsx } from "clsx";

interface TargetCompaniesSectionProps {
  targets: CompanyTarget[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function TargetCompaniesSection({
  targets,
  selectedId,
  onSelect,
}: TargetCompaniesSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">Popular</span>
          <span className="display text-[28px] md:text-[34px]">Where students aim</span>
        </h2>
        <Link href="/profile/target-companies" className={`${buttonClass("secondary", "sm")} max-sm:hidden`}>
          <Settings2 className="size-4" />
          Set your targets
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {targets.map((target) => {
          const isSelected = selectedId === target.id;
          const rounds = companyWorkspaces[target.id]?.hiringStages.length;
          return (
            <button
              key={target.id}
              type="button"
              onClick={() => onSelect(target.id)}
              aria-pressed={isSelected}
              className={clsx(
                "no-press group flex h-full flex-col gap-4 rounded-2xl border-[2.4px] bg-card p-5 text-left transition-[transform,box-shadow] duration-150",
                isSelected ? "border-line shadow-[4px_5px_0_var(--hard)]" : "border-hair hover:border-line"
              )}
            >
              <span className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl border-2 border-line bg-paper font-cond text-[15px] font-bold">
                  {target.monogram}
                </span>
                {isSelected ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper">Showing</span>
                ) : (
                  <span className="font-mono text-[11px] text-mute">{target.tier}</span>
                )}
              </span>
              <span>
                <span className="label-cond block text-[20px] leading-tight group-hover:text-accent-ink">{target.name}</span>
                <span className="text-[13px] text-mute">{target.segment}</span>
              </span>
              <span className="flex flex-wrap gap-1.5">
                {target.roles.map((role) => (
                  <span key={role} className="rounded-md border-[1.5px] border-hair px-1.5 py-0.5 font-mono text-[11px] text-body">
                    {role}
                  </span>
                ))}
              </span>
              <span className="mt-auto flex items-center justify-between border-t-[1.5px] border-hair pt-3 font-mono text-[12px] uppercase tracking-wider text-mute">
                {rounds ? `${rounds} rounds` : "Process below"}
                <ChevronRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
