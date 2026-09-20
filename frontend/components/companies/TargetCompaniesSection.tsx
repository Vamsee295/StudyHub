import { CompanyTarget } from "@/types";
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
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-[var(--ink)] tracking-tight">
            Your Target Companies
          </h2>
          <p className="text-sm text-[var(--ink-secondary)]">
            Active recruitment pipelines aligned with your target graduation cycle and verified coursework.
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-[var(--border-strong)]">
          <Settings2 className="w-4 h-4" />
          Manage Targets
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {targets.map((target) => {
          const isSelected = selectedId === target.id;
          return (
            <div
              key={target.id}
              onClick={() => onSelect(target.id)}
              className={clsx(
                "group relative bg-[var(--surface)] border rounded-xl p-5 flex flex-col h-full gap-4 cursor-pointer transition-all duration-300",
                isSelected
                  ? "border-[var(--accent)] shadow-[0_0_0_1px_var(--accent)] ring-4 ring-[var(--accent-soft)]"
                  : "border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-md"
              )}
            >
              {isSelected && (
                <div className="absolute -top-2.5 -right-2.5 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Selected
                </div>
              )}

              {/* Logo & Header */}
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-[var(--surface-subdued)] border border-[var(--border)] flex items-center justify-center text-[var(--ink)] font-bold text-lg font-newsreader shadow-sm">
                  {target.monogram}
                </div>
                <span className="pill pill-neutral text-[10px]">{target.tier}</span>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-[var(--ink)] leading-tight group-hover:text-[var(--accent)] transition-colors">
                  {target.name}
                </h3>
                <span className="text-[12px] text-[var(--ink-secondary)] font-medium">
                  {target.segment}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {target.roles.map((role) => (
                    <span
                      key={role}
                      className="text-[11px] bg-[#f8fafc] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--ink-tertiary)]"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Readiness Progress */}
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-[var(--ink-secondary)] uppercase tracking-wider">Readiness</span>
                  <span className={clsx("font-mono", target.readiness > 75 ? "text-[var(--success)]" : "text-[var(--accent)]")}>
                    {target.readiness}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[var(--surface-subdued)] rounded-full overflow-hidden border border-[var(--border)]/50">
                  <div
                    className={clsx(
                      "h-full rounded-full transition-all duration-1000",
                      target.readiness > 75 ? "bg-[var(--success)]" : "bg-[var(--accent)]"
                    )}
                    style={{ width: `${target.readiness}%` }}
                  />
                </div>
              </div>

              {/* Recruiter Highlight */}
              <div className="bg-[var(--surface-subdued)]/50 border border-[var(--border)] rounded-lg p-2.5 mt-auto">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)]" />
                    {target.recruiterHighlight.title}
                  </span>
                  <span className="text-[11px] text-[var(--ink-secondary)]">
                    {target.recruiterHighlight.detail}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                className={clsx(
                  "w-full py-2 rounded-lg text-[13px] font-medium transition-colors mt-2",
                  isSelected
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "bg-[var(--surface-subdued)] text-[var(--ink)] hover:bg-[var(--border)]"
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
