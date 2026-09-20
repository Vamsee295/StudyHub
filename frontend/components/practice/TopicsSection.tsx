import { Network, Database, Cpu, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PracticeCurriculumBank } from "@/types";

interface TopicsSectionProps {
  banks: PracticeCurriculumBank[];
}

export function TopicsSection({ banks }: TopicsSectionProps) {
  if (banks.length === 0) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "network": return <Network className="w-5 h-5 text-[var(--ink-secondary)]" />;
      case "database": return <Database className="w-5 h-5 text-[var(--ink-secondary)]" />;
      case "cpu": return <Cpu className="w-5 h-5 text-[var(--ink-secondary)]" />;
      case "brain": return <Brain className="w-5 h-5 text-[var(--ink-secondary)]" />;
      default: return <Database className="w-5 h-5 text-[var(--ink-secondary)]" />;
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[10px] font-mono text-[var(--ink-secondary)] uppercase tracking-wider font-semibold flex items-center gap-2">
            Curriculum Architecture <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span> Systematic Question Banks
          </h2>
          <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight">Practice by Topic</h3>
          <p className="text-[13px] text-[var(--ink-secondary)]">Comprehensive syllabus question banks categorized by fundamental engineering domains.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {banks.map((bank) => (
          <div key={bank.id} className="group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--border-strong)] hover:shadow-sm transition-all overflow-hidden">
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--surface-subdued)] border border-[var(--border)] flex items-center justify-center">
                  {getIcon(bank.iconName)}
                </div>
                <span className="text-[10px] font-mono font-semibold tracking-wider text-[var(--ink-tertiary)] bg-[var(--canvas)] border border-[var(--border)] px-1.5 py-0.5 rounded">
                  {bank.bankCode}
                </span>
              </div>
              
              <h4 className="text-[16px] font-bold text-[var(--ink)] mb-2 leading-tight group-hover:text-[var(--accent)] transition-colors">
                {bank.title}
              </h4>
              
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[12px] font-medium text-[var(--ink-secondary)]">{bank.problemCount} Problems</span>
                <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
                <span className="text-[12px] font-medium text-[var(--ink-secondary)]">{bank.categoriesCount} Categories</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {bank.topics.map((topic, i) => (
                  <span key={i} className="text-[11px] bg-[var(--canvas)] border border-[var(--border)] text-[var(--ink-secondary)] px-2 py-0.5 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto border-t border-[var(--border)]/60 pt-4">
                <Link 
                  href={`/practice/bank/${bank.id}`}
                  className="flex items-center justify-between w-full text-[13px] font-medium text-[var(--ink-secondary)] group-hover:text-[var(--ink)] transition-colors"
                >
                  Explore {bank.title.split(" ")[0]} Bank
                  <ArrowRight className="w-4 h-4 text-[var(--ink-tertiary)] group-hover:text-[var(--ink)] group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
