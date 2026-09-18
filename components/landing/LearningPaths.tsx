import { ArrowRight } from "lucide-react";
import { paths } from "@/lib/data/paths";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function LearningPaths() {
  return (
    <section id="learn" className="border-b border-border">
      <div className="container-max px-5 md:px-8 py-16 md:py-20">
        <SectionHeader
          eyebrow="Career Architecture"
          title="Choose your engineering path"
          description="Structured curriculums mapped to the hiring bar of product companies, tech consultancies and engineering labs."
        />

        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" stagger={0.08}>
          {paths.map((p) => (
            <RevealItem key={p.slug} direction="up">
              <div className="group elevate-1 rounded-xl p-5 h-full flex flex-col justify-between hover:-translate-y-0.5 hover:border-accent transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="pill pill-accent">{p.weeks}</span>
                    <span className="tag-mono text-ink-tertiary">{p.resourceCount}</span>
                  </div>
                  <p className="font-medium text-[16.5px] mb-2 group-hover:text-accent transition-colors">
                    {p.name}
                  </p>
                  <p className="text-ink-secondary text-[13.5px] mb-4 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tags.map((t) => (
                      <span key={t} className="pill pill-neutral">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <a href="#roadmap" className="text-[13.5px] text-accent font-medium inline-flex items-center gap-1">
                  {p.ctaLabel} <ArrowRight size={14} className="arrow" />
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
