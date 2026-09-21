import { resourceTelemetry } from "@/lib/data/resourcesData";

export function ResourcesHeader() {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-[var(--accent)] font-semibold mb-4 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
          STUDYHUB RESOURCE LIBRARY // CURATED PREPARATION MATERIAL
        </div>
        <h1 className="text-3xl md:text-4xl font-newsreader font-medium text-[var(--ink)] tracking-tight mb-3">
          Your preparation library.<br />
          <span className="text-[var(--ink-secondary)]">Everything in one place.</span>
        </h1>
        <p className="text-[var(--ink-secondary)] text-[15px] leading-relaxed max-w-xl">
          Curated notes, cheat sheets, and interview guides mapped exactly to your placement syllabus. 
          Save resources, track progress, and review before interviews.
        </p>
      </div>

      <div className="flex bg-[var(--surface-subdued)]/50 rounded-xl border border-[var(--border)] p-4 gap-6 shrink-0 shadow-sm shadow-[0_1px_3px_0_rgba(0,0,0,0.01)]">
        <div>
          <div className="text-[22px] font-newsreader font-medium text-[var(--ink)] leading-none mb-1">
            {resourceTelemetry.saved.toString().padStart(2, '0')}
          </div>
          <div className="text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">
            Saved
          </div>
        </div>
        <div className="w-px bg-[var(--border)]"></div>
        <div>
          <div className="text-[22px] font-newsreader font-medium text-[var(--ink)] leading-none mb-1">
            {resourceTelemetry.recent.toString().padStart(2, '0')}
          </div>
          <div className="text-[11px] font-semibold text-[var(--ink-tertiary)] uppercase tracking-wider">
            Recent
          </div>
        </div>
        <div className="w-px bg-[var(--border)]"></div>
        <div>
          <div className="text-[22px] font-newsreader font-medium text-[var(--accent)] leading-none mb-1">
            {resourceTelemetry.completed.toString().padStart(2, '0')}
          </div>
          <div className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider">
            Completed
          </div>
        </div>
      </div>
    </section>
  );
}
