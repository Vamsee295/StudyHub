import React from "react";

export function ToolsHeader() {
  return (
    <div className="mb-10 animate-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Eyebrow & Telemetry */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-[0_1px_2px_-1px_rgba(15,23,42,0.04)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--telemetry)] animate-pulse"></span>
          <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[var(--telemetry)]">
            Placement Utility Workbench
          </span>
        </div>
        <div className="hidden sm:block w-px h-4 bg-[var(--border)]"></div>
        <span className="hidden sm:inline-block text-[11px] font-medium text-[var(--ink-secondary)] uppercase tracking-wider">
          Practical Tools · Cycle 2026
        </span>
      </div>

      {/* Headline & Subtitle */}
      <h1 className="text-4xl md:text-[42px] font-display font-medium text-[var(--ink)] leading-[1.1] tracking-tight mb-4">
        Tools that help you prepare smarter.
      </h1>
      <p className="text-[15px] md:text-[16px] text-[var(--ink-secondary)] leading-relaxed max-w-2xl mb-8 font-medium">
        Calculators, generators, trackers, interview utilities, and preparation assistants built around your placement workflow.
      </p>

      {/* Telemetry Grid Block */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
          <div className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider mb-1">
            Workbench
          </div>
          <div className="text-[15px] font-mono font-semibold text-[var(--ink)]">12 Tools</div>
        </div>
        
        {/* Metric 2 */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)] relative overflow-hidden group hover:border-[var(--telemetry)]/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--telemetry)]/0 via-[var(--telemetry)]/5 to-[var(--telemetry)]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
          <div className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider mb-1">
            Active
          </div>
          <div className="text-[15px] font-mono font-semibold text-[var(--ink)]">04 Recent</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
          <div className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider mb-1">
            Pinned
          </div>
          <div className="text-[15px] font-mono font-semibold text-[var(--ink)]">08 Saved</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
          <div className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider mb-1 flex items-center justify-between">
            Track
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shadow-[0_0_4px_var(--success)]"></span>
          </div>
          <div className="text-[15px] font-mono font-semibold text-[var(--ink)]">72% Prep</div>
        </div>
      </div>
    </div>
  );
}
