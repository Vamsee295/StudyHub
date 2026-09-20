import { DirectoryCompany } from "@/types";
import { ChevronRight, SearchX } from "lucide-react";
import { clsx } from "clsx";

interface CompanyDirectoryProps {
  companies: DirectoryCompany[];
  onSelect: (id: string) => void;
  searchQuery: string;
}

export function CompanyDirectory({ companies, onSelect, searchQuery }: CompanyDirectoryProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-[var(--ink)] tracking-tight">Explore Company Directory</h2>
        <p className="text-sm text-[var(--ink-secondary)]">Search and filter {companies.length} active pipelines</p>
      </div>

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--surface)] border border-[var(--border)] rounded-xl border-dashed">
          <div className="w-16 h-16 bg-[var(--surface-subdued)] rounded-2xl flex items-center justify-center mb-4">
            <SearchX className="w-8 h-8 text-[var(--ink-tertiary)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--ink)] mb-2">No companies found</h3>
          <p className="text-[var(--ink-secondary)] max-w-md mx-auto">
            We couldn't find any companies matching "{searchQuery}" in this segment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {companies.map((company) => {
            const isHard = company.difficulty.includes("Hard");
            return (
              <div 
                key={company.id} 
                className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-xl p-5 flex flex-col h-full gap-4 transition-all hover:shadow-sm group cursor-pointer"
                onClick={() => onSelect(company.id)}
              >
                {/* Header: Logo, Name, Location */}
                <div className="flex gap-3">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-[var(--surface-subdued)] border border-[var(--border)] flex items-center justify-center text-[var(--ink)] font-bold text-lg font-newsreader shadow-sm">
                    {company.monogram}
                  </div>
                  <div className="flex flex-col justify-center gap-0.5">
                    <h3 className="text-[16px] font-bold text-[var(--ink)] leading-none group-hover:text-[var(--accent)] transition-colors">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[12px] text-[var(--ink-secondary)] font-medium">
                      <span>{company.segment}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                      <span>{company.location}</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div className="flex flex-col gap-1 bg-[#f8fafc] border border-[var(--border)] rounded-lg p-2.5">
                    <span className="text-[10px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">Packages</span>
                    <span className="text-[12px] font-mono font-semibold text-[var(--ink)]">{company.salaryRange}</span>
                  </div>
                  <div className="flex flex-col gap-1 bg-[#f8fafc] border border-[var(--border)] rounded-lg p-2.5">
                    <span className="text-[10px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">Readiness</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div 
                          className={clsx("h-full rounded-full", company.readinessScore > 75 ? "bg-[var(--success)]" : "bg-[var(--accent)]")} 
                          style={{ width: `${company.readinessScore}%` }} 
                        />
                      </div>
                      <span className="text-[12px] font-mono font-bold text-[var(--ink)]">{company.readinessScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Tags & Process */}
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {company.roles.map(r => (
                      <span key={r} className="text-[10px] bg-[var(--surface-subdued)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--ink-secondary)]">
                        {r}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--ink-secondary)] truncate">
                      <span className={clsx(
                        "font-bold uppercase tracking-wider",
                        isHard ? "text-[var(--error)]" : "text-[var(--warning)]"
                      )}>
                        {company.difficulty}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[var(--border-strong)] shrink-0" />
                      <span className="truncate">{company.processSummary}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--ink-tertiary)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
