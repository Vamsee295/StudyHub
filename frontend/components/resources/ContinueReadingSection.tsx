import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
interface ContinueReadingProps {
  items: any[];
}

export function ContinueReadingSection({ items }: ContinueReadingProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">Reading</span>
          <span className="display text-[28px] md:text-[34px]">Continue reading</span>
        </h2>
          <p className="text-[13px] text-body">Pick up where you left off in your active study guides.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item) => (
          <div 
            key={item.id}
            className="group relative bg-card border border-hair rounded-2xl p-5 hover:border-accent hover:shadow-md hover:shadow-accent/5 transition-all flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-wider font-semibold text-mute uppercase flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" />
                  {item.track}
                </span>
                <h3 className="text-[15px] font-semibold text-ink leading-snug group-hover:text-accent-ink transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-paper-2 text-body border border-hair">
                {item.typeBadge}
              </span>
              <span className="text-[12px] text-mute flex items-center gap-1.5">
                • {item.timeEstimate}
              </span>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[12px] font-medium text-body">
                  <span>{item.unitProgress}</span>
                  <span className="font-mono text-[11px]">{item.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-paper-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
              
              <Link
                href={item.href}
                className="w-full flex items-center justify-center gap-2 bg-paper-2 hover:bg-accent-soft hover:text-accent-ink text-ink border border-hair hover:border-accent-line rounded-xl py-2.5 text-[13px] font-semibold transition-all group/btn"
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
