import { ChevronRight, SearchX } from "lucide-react";
import { pressable } from "@/lib/utils";
import { COMPANY_DATA_AS_OF, COMPANY_DATA_SOURCE, type CompanyEntry } from "@/lib/data/companyData";
import { CompanyLogo } from "./CompanyLogo";

interface CompanyDirectoryProps {
  companies: CompanyEntry[];
  onSelect: (id: string) => void;
  searchQuery: string;
}

/** Every company we have real interview data for. */
export function CompanyDirectory({ companies, onSelect, searchQuery }: CompanyDirectoryProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">Directory</span>
          <span className="display text-[28px] md:text-[34px]">All companies</span>
        </h2>
        <p className="text-sm text-body">{companies.length} companies, each with the coding questions candidates report from its interviews</p>
        <p className="font-mono text-[11px] text-mute">
          Questions from{" "}
          <a href={COMPANY_DATA_SOURCE} target="_blank" rel="noopener noreferrer" className="underline">
            leetcode-company-wise-problems
          </a>{" "}
          ({new Date(COMPANY_DATA_AS_OF).toLocaleDateString(undefined, { month: "long", year: "numeric" })}), company facts from Wikidata.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-[1.5px] border-dashed border-hair bg-card py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-paper-2">
            <SearchX className="size-8 text-mute" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-ink">No companies found</h3>
          <p className="mx-auto max-w-md text-body">Nothing matches “{searchQuery}” in this segment. Try a company name or a topic like “graphs”.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((c) => {
            const n = c.counts.easy + c.counts.medium + c.counts.hard || 1;
            return (
              <div
                key={c.id}
                className="group flex h-full cursor-pointer flex-col gap-4 rounded-xl border-[1.5px] border-hair bg-card p-5 transition-all hover:border-line hover:shadow-sm"
                {...pressable(() => onSelect(c.id))}
              >
                <div className="flex items-center gap-3">
                  <CompanyLogo company={c} />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 className="text-[16px] font-bold leading-tight text-ink transition-colors group-hover:text-accent-ink">{c.name}</h3>
                    <span className="truncate text-[12px] font-medium text-body">
                      {c.segment}
                      {c.facts.hq && ` · ${c.facts.hq}`}
                    </span>
                  </div>
                  {c.jobs && <span className="ml-auto shrink-0 rounded-full bg-note/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-note">Hiring live</span>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border-[1.5px] border-hair bg-paper p-2.5">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-mute">Questions</span>
                    <span className="font-mono text-[15px] font-semibold text-ink">{c.counts.total.toLocaleString()}</span>
                  </div>
                  <div className="rounded-lg border-[1.5px] border-hair bg-paper p-2.5">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-mute">Last 3 months</span>
                    <span className="font-mono text-[15px] font-semibold text-ink">{c.counts.d90}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex h-1.5 overflow-hidden rounded-full bg-paper-2" aria-hidden>
                    <span className="bg-note" style={{ width: `${(100 * c.counts.easy) / n}%` }} />
                    <span className="bg-warning" style={{ width: `${(100 * c.counts.medium) / n}%` }} />
                    <span className="bg-danger" style={{ width: `${(100 * c.counts.hard) / n}%` }} />
                  </div>
                  <span className="font-mono text-[11px] text-mute">
                    {Math.round((100 * c.counts.easy) / n)}% easy · {Math.round((100 * c.counts.medium) / n)}% medium · {Math.round((100 * c.counts.hard) / n)}% hard
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-hair pt-3">
                  <span className="flex min-w-0 flex-wrap gap-1.5">
                    {c.topTopics.slice(0, 3).map((t) => (
                      <span key={t} className="rounded border-[1.5px] border-hair bg-paper-2 px-1.5 py-0.5 text-[10.5px] text-body">
                        {t}
                      </span>
                    ))}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-mute transition-colors group-hover:text-accent-ink" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
