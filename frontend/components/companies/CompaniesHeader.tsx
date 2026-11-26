import { Search } from "lucide-react";
import { clsx } from "clsx";
import { PageHeader } from "@/components/ui/Page";
import { SEGMENTS } from "@/lib/data/companyData";

interface CompaniesHeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeSegment: string;
  setActiveSegment: (val: string) => void;
}

const segments = ["All Companies", ...SEGMENTS];

export function CompaniesHeader({ searchQuery, setSearchQuery, activeSegment, setActiveSegment }: CompaniesHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      <PageHeader eyebrow="Companies" title="Know your" hl="company" note="rounds, topics, and what to study first" />
      <div className="-mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative max-w-xl flex-1">
          <span className="sr-only">Search companies</span>
          <Search aria-hidden className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <input
            type="text"
            placeholder="Search companies or topics"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field w-full pl-10"
          />
        </label>
        <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Company type">
          {segments.map((segment) => (
            <button
              key={segment}
              onClick={() => setActiveSegment(segment)}
              aria-pressed={activeSegment === segment}
              className={clsx(
                "label-cond h-8 shrink-0 rounded-full border-2 px-3.5 text-[14px] transition-colors",
                activeSegment === segment ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line hover:text-ink"
              )}
            >
              {segment === "All Companies" ? "All" : segment}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
