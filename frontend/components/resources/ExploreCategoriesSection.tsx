import { ArrowRight, Code2, Terminal, Database, Cpu, Brain, Calculator } from "lucide-react";
import { libraryCategories } from "@/lib/data/resourcesData";
import { clsx } from "clsx";

interface ExploreCategoriesSectionProps {
  onCategoryClick: (filterKey: string) => void;
}

export function ExploreCategoriesSection({ onCategoryClick }: ExploreCategoriesSectionProps) {
  // Mapping string icon names from data to actual Lucide components
  const iconMap: Record<string, React.ReactNode> = {
    "code_blocks": <Code2 className="w-5 h-5" />,
    "terminal": <Terminal className="w-5 h-5" />,
    "database": <Database className="w-5 h-5" />,
    "memory": <Cpu className="w-5 h-5" />,
    "psychology": <Brain className="w-5 h-5" />,
    "calculate": <Calculator className="w-5 h-5" />
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-newsreader font-medium text-[var(--ink)]">Explore Library</h2>
          <p className="text-[13px] text-[var(--ink-secondary)]">Browse resources mapped by technical domains.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {libraryCategories.map((cat) => (
          <div 
            key={cat.id}
            className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--accent)] hover:shadow-md hover:shadow-[var(--accent)]/5 transition-all flex flex-col h-full cursor-pointer"
            onClick={() => onCategoryClick(cat.filterKey)}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cat.colorScheme)}>
                {iconMap[cat.icon]}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--ink)] leading-snug group-hover:text-[var(--accent)] transition-colors mb-1">
                  {cat.title}
                </h3>
                <p className="text-[13px] text-[var(--ink-secondary)] leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-[var(--ink)] leading-none mb-1">{cat.resourcesCount}</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--ink-tertiary)]">Resources</span>
                </div>
                <div className="w-px bg-[var(--border)]"></div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-[var(--ink)] leading-none mb-1">{cat.guidesCount}</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--ink-tertiary)]">Guides</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[var(--surface-subdued)] group-hover:bg-[var(--accent)] flex items-center justify-center text-[var(--ink-secondary)] group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
