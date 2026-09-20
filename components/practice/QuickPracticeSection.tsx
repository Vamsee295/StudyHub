import { PlayCircle, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { QuickPracticeSprint } from "@/types";

interface QuickPracticeSectionProps {
  sprints: QuickPracticeSprint[];
}

export function QuickPracticeSection({ sprints }: QuickPracticeSectionProps) {
  if (sprints.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider font-semibold flex items-center gap-2">
            Sprint Engine <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span> High Retention Recall
          </h2>
          <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight">Quick Practice</h3>
          <p className="text-[13px] text-[var(--ink-secondary)]">Targeted 15–25 minute timed sprints to sharpen daily recall and algorithmic agility.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 rounded text-[11px] font-medium text-[var(--ink-tertiary)] shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          Real-time timing harness
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sprints.map((sprint) => (
          <div key={sprint.id} className="group flex flex-col bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden hover:border-[var(--border-strong)] hover:shadow-md transition-all">
            
            {/* Top Pattern Area */}
            <div className="h-1 bg-[var(--accent)] w-full"></div>
            
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded">
                  {sprint.tag}
                </span>
                <span className="text-[11px] font-medium text-[var(--ink-secondary)] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {sprint.avgTime} avg
                </span>
              </div>
              
              <h4 className="text-[16px] font-bold text-[var(--ink)] mb-1 group-hover:text-[var(--accent)] transition-colors">{sprint.title}</h4>
              <p className="text-[13px] text-[var(--ink-secondary)] mb-4">{sprint.questionsCount} items · {sprint.estimatedMinutes} mins · {sprint.difficulty}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-6">
                {sprint.topics.map((topic, i) => (
                  <span key={i} className="bg-[var(--surface-subdued)] border border-[var(--border)] text-[var(--ink-secondary)] text-[11px] px-2 py-0.5 rounded-md">
                    {topic}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-[var(--border)]/60 pt-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-[var(--ink-tertiary)] uppercase font-semibold">Target Accuracy</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
                    <span className="text-[13px] font-semibold text-[var(--ink)]">{sprint.targetAccuracy}</span>
                  </div>
                </div>
                
                <Link 
                  href={`/practice/session/${sprint.id}`}
                  className="flex items-center gap-1.5 bg-[var(--ink)] hover:bg-black text-[var(--surface)] px-4 py-2 rounded-lg text-[13px] font-medium transition-colors shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  Start
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
