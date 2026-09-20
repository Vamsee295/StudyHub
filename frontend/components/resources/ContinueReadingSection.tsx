import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { continueReadingList } from "@/lib/data/resourcesData";

export function ContinueReadingSection() {
  if (!continueReadingList || continueReadingList.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-newsreader font-medium text-[var(--ink)]">Continue Reading</h2>
          <p className="text-[13px] text-[var(--ink-secondary)]">Pick up where you left off in your active study guides.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {continueReadingList.map((item) => (
          <div 
            key={item.id}
            className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--accent)] hover:shadow-md hover:shadow-[var(--accent)]/5 transition-all flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-wider font-semibold text-[var(--ink-tertiary)] uppercase flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" />
                  {item.track}
                </span>
                <h3 className="text-[15px] font-semibold text-[var(--ink)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border border-[var(--border)]">
                {item.typeBadge}
              </span>
              <span className="text-[12px] text-[var(--ink-tertiary)] flex items-center gap-1.5">
                • {item.timeEstimate}
              </span>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[12px] font-medium text-[var(--ink-secondary)]">
                  <span>{item.unitProgress}</span>
                  <span className="font-mono text-[11px]">{item.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--surface-subdued)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent)] rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
              
              <Link
                href={item.href}
                className="w-full flex items-center justify-center gap-2 bg-[var(--surface-subdued)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] text-[var(--ink)] border border-[var(--border)] hover:border-[var(--accent-soft-border)] rounded-xl py-2.5 text-[13px] font-semibold transition-all group/btn"
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
