import { Activity, Code2, Database, Brain, Cpu, Trophy, TrendingUp } from "lucide-react";

export function PracticeHeader() {
  return (
    <section className="flex flex-col gap-6">
      {/* Eyebrow */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
        </span>
        <span className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider font-semibold">
          Placement Engine // Skill Evaluation &amp; Practice Workspace
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-newsreader text-4xl sm:text-5xl text-[var(--ink)] tracking-tight leading-tight mb-3">
            Practice what you've learned.
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] max-w-2xl leading-relaxed">
            Build speed, problem-solving intuition, and interview confidence through rapid coding sprints, 
            targeted topic drills, and placement-calibrated challenge sets.
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-[var(--surface-subdued)] border border-[var(--border)] px-3 py-1.5 rounded-lg">
            <Trophy className="w-4 h-4 text-[var(--warning)]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--ink-secondary)] uppercase font-semibold tracking-wider">Sprint Streak</span>
              <span className="text-[13px] font-semibold text-[var(--ink)]">7 Days Active</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[var(--surface-subdued)] border border-[var(--border)] px-3 py-1.5 rounded-lg">
            <TrendingUp className="w-4 h-4 text-[var(--success)]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--ink-secondary)] uppercase font-semibold tracking-wider">Problems Solved</span>
              <span className="text-[13px] font-semibold text-[var(--ink)]">142 / 850</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
