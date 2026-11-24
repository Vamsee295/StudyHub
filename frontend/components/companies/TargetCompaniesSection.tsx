import { CompanyTarget } from "@/types";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Settings2, CheckCircle2 } from "lucide-react";
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {targets.map((target) => {
          const isSelected = selectedId === target.id;
          return (
            <div
              key={target.id}
              onClick={() => onSelect(target.id)}
              className={clsx(
                "group relative bg-card border rounded-xl p-5 flex flex-col h-full gap-4 cursor-pointer transition-all duration-300",
                isSelected
                  ? "border-accent shadow-[0_0_0_1px_var(--accent)] ring-4 ring-accent-soft"
                  : "border-hair hover:border-line hover:shadow-md"
              )}
            >
              {isSelected && (
                <div className="absolute -top-2.5 -right-2.5 bg-accent text-paper text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Selected
                </div>
              )}

              {/* Logo & Header */}
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-paper-2 border border-hair flex items-center justify-center text-ink font-bold text-lg font-newsreader">
                  {target.monogram}
                </div>
                <span className="pill pill-neutral text-[10px]">{target.tier}</span>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-ink leading-tight group-hover:text-accent-ink transition-colors">
                  {target.name}
                </h3>
                <span className="text-[12px] text-body font-medium">
                  {target.segment}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {target.roles.map((role) => (
                    <span
                      key={role}
                      className="text-[11px] bg-paper border border-hair px-1.5 py-0.5 rounded text-mute"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>


              {/* Recruiter Highlight */}
              <div className="bg-paper-2/50 border border-hair rounded-lg p-2.5 mt-auto">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-ink uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                    {target.recruiterHighlight.title}
                  </span>
                  <span className="text-[11px] text-body">
                    {target.recruiterHighlight.detail}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                className={clsx(
                  "w-full py-2 rounded-lg text-[13px] font-medium transition-colors mt-2",
                  isSelected
                    ? "bg-accent text-paper"
                    : "bg-paper-2 text-ink hover:bg-hair"
                )}
              >
                {isSelected ? "Active Workspace" : "View Workspace"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
