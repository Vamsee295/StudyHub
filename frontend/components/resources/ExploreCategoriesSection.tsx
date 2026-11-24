import { ArrowRight, Code2, Terminal, Database, Cpu, Brain, Calculator } from "lucide-react";
import { libraryCategories } from "@/lib/data/resourcesData";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  code_blocks: Code2,
  terminal: Terminal,
  database: Database,
  memory: Cpu,
  psychology: Brain,
  calculate: Calculator,
};

interface ExploreCategoriesSectionProps {
  /** live counts per category from the catalog */
  counts: { name: string; count: number }[];
  onCategoryClick: (filterKey: string) => void;
}

export function ExploreCategoriesSection({ counts, onCategoryClick }: ExploreCategoriesSectionProps) {
  const countOf = (key: string) => counts.find((c) => c.name === key)?.count ?? 0;
  const topics = libraryCategories.filter((c) => countOf(c.filterKey) > 0); // no empty topic cards

  if (topics.length === 0) return null;
  return (
    <section className="flex flex-col gap-6">
      <h2 className="sec">
        <span className="eyebrow sec-n mb-1.5 block">Topics</span>
        <span className="display text-[28px] md:text-[34px]">Browse by topic</span>
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((cat) => {
          const Icon = icons[cat.icon] ?? Code2;
          const n = countOf(cat.filterKey);
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat.filterKey)}
              className="brut brut-hover no-press group flex h-full flex-col gap-4 rounded-2xl bg-card p-5 text-left"
            >
              <span className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-line bg-paper text-accent">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="label-cond block text-[19px] leading-snug group-hover:text-accent-ink">{cat.title}</span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-body">{cat.description}</span>
                </span>
              </span>
              <span className="mt-auto flex items-center justify-between border-t-[1.5px] border-hair pt-3">
                <span className="font-mono text-[12px] uppercase tracking-wider text-mute">
                  {n} {n === 1 ? "resource" : "resources"}
                </span>
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
