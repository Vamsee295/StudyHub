import { Search, SlidersHorizontal, Activity } from "lucide-react";
import { clsx } from "clsx";

interface CompaniesHeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeSegment: string;
  setActiveSegment: (val: string) => void;
}

const segments = [
  "All Companies",
  "Product",
  "Service & IT",
  "High-Growth Startup",
  "Mass Hiring / NQT",
];

export function CompaniesHeader({
  searchQuery,
  setSearchQuery,
  activeSegment,
  setActiveSegment,
}: CompaniesHeaderProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Telemetry & Eyebrow */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--accent)] tracking-wider uppercase">
            <span>RECRUITER PATTERN INTELLIGENCE</span>
            <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
            <span>COMPANY-CALIBRATED TARGET TRACKING</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-newsreader font-semibold tracking-tight text-[var(--ink)]">
            Know the companies. Prepare with direction.
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] max-w-3xl leading-relaxed mt-1">
            Explore verified hiring patterns, selection rounds, role requirements, question banks, and company-specific preparation sprints calibrated for Cycle 2026.
          </p>
        </div>

        {/* Telemetry Panel */}
        <div className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 shadow-sm shrink-0">
          <div className="flex flex-col gap-0.5 px-3">
            <span className="text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">Tracking</span>
            <span className="text-lg font-mono font-medium text-[var(--ink)]">14<span className="text-sm text-[var(--ink-secondary)] ml-1">Corp</span></span>
          </div>
          <div className="w-px h-8 bg-[var(--border)]" />
          <div className="flex flex-col gap-0.5 px-3">
            <span className="text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">Priority</span>
            <span className="text-lg font-mono font-medium text-[var(--accent)] flex items-center gap-1.5">
              03 <span className="text-xs bg-[var(--accent-soft)] px-1.5 py-0.5 rounded text-[var(--accent)] uppercase">Active</span>
            </span>
          </div>
          <div className="w-px h-8 bg-[var(--border)] hidden sm:block" />
          <div className="hidden sm:flex flex-col gap-0.5 px-3">
            <span className="text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">Readiness</span>
            <span className="text-lg font-mono font-medium text-[var(--success)] flex items-center gap-1.5">
              68% <Activity className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] border border-[var(--border)] p-2 pl-4 rounded-xl shadow-[0_2px_4px_-1px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-5 h-5 text-[var(--ink-tertiary)]" />
          <input
            type="text"
            placeholder="Search companies, roles, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-tertiary)]"
          />
          <div className="hidden md:flex items-center gap-1.5 px-2">
            <kbd className="font-mono text-[10px] bg-[var(--surface-subdued)] border border-[var(--border)] text-[var(--ink-secondary)] px-1.5 py-0.5 rounded font-medium">⌘</kbd>
            <kbd className="font-mono text-[10px] bg-[var(--surface-subdued)] border border-[var(--border)] text-[var(--ink-secondary)] px-1.5 py-0.5 rounded font-medium">F</kbd>
          </div>
        </div>
        
        <div className="h-6 w-px bg-[var(--border)] hidden sm:block" />
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <SlidersHorizontal className="w-4 h-4 text-[var(--ink-tertiary)] shrink-0 ml-1 sm:ml-0" />
          {segments.map((segment) => (
            <button
              key={segment}
              onClick={() => setActiveSegment(segment)}
              className={clsx(
                "whitespace-nowrap px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors border",
                activeSegment === segment
                  ? "bg-[var(--ink)] text-white border-[var(--ink)] shadow-sm"
                  : "bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border-transparent hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
              )}
            >
              {segment}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
