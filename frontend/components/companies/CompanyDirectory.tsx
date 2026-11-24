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
        <h2 className="text-xl font-semibold text-ink tracking-tight">Explore Company Directory</h2>
        <p className="text-sm text-body">Search and filter {companies.length} active pipelines</p>
      </div>

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-hair rounded-xl border-dashed">
          <div className="w-16 h-16 bg-paper-2 rounded-2xl flex items-center justify-center mb-4">
            <SearchX className="w-8 h-8 text-mute" />
          </div>
          <h3 className="text-lg font-bold text-ink mb-2">No companies found</h3>
          <p className="text-body max-w-md mx-auto">
            We couldn’t find any companies matching “{searchQuery}” in this segment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {companies.map((company) => {
            const isHard = company.difficulty.includes("Hard");
            return (
              <div 
                key={company.id} 
                className="bg-card border border-hair hover:border-line rounded-xl p-5 flex flex-col h-full gap-4 transition-all hover:shadow-sm group cursor-pointer"
                onClick={() => onSelect(company.id)}
              >
                {/* Header: Logo, Name, Location */}
                <div className="flex gap-3">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-paper-2 border border-hair flex items-center justify-center text-ink font-bold text-lg font-newsreader">
                    {company.monogram}
                  </div>
                  <div className="flex flex-col justify-center gap-0.5">
                    <h3 className="text-[16px] font-bold text-ink leading-none group-hover:text-accent-ink transition-colors">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[12px] text-body font-medium">
                      <span>{company.segment}</span>
                      <span className="w-1 h-1 rounded-full bg-ink/25" />
                      <span>{company.location}</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mt-1 grid grid-cols-1 gap-3">
                  <div className="flex flex-col gap-1 bg-paper border border-hair rounded-lg p-2.5">
                    <span className="text-[10px] font-semibold text-mute uppercase tracking-wider">Packages</span>
                    <span className="text-[12px] font-mono font-semibold text-ink">{company.salaryRange}</span>
                  </div>
                </div>

                {/* Tags & Process */}
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {company.roles.map(r => (
                      <span key={r} className="text-[10px] bg-paper-2 border border-hair px-1.5 py-0.5 rounded text-body">
                        {r}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-hair">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-body truncate">
                      <span className={clsx(
                        "font-bold uppercase tracking-wider",
                        isHard ? "text-danger" : "text-warning"
                      )}>
                        {company.difficulty}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-ink/25 shrink-0" />
                      <span className="truncate">{company.processSummary}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-mute group-hover:text-accent-ink transition-colors shrink-0" />
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
