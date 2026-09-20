import { ArrowRight } from "lucide-react";
import { templates } from "@/lib/data/templates";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Templates() {
  return (
    <section id="templates" className="border-b border-border bg-surface-subdued/40">
      <div className="container-max px-5 md:px-8 py-16 md:py-20">
        <SectionHeader
          eyebrow="Production Artifacts"
          title="Templates that help you get hired"
          description="Vetted, high-conversion templates modeled after successful offers at tier-1 companies and high-growth startups."
        />

        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.06}>
          {templates.map((t) => (
            <RevealItem key={t.name} direction="scale">
              <div className="elevate-1 rounded-xl p-4 h-full flex flex-col justify-between hover:-translate-y-0.5 hover:border-accent transition-all">
                {t.isResume && (
                  <div className="bg-surface-subdued rounded-md p-3 mb-3 space-y-1.5">
                    <div className="h-[7px] w-[55%] rounded bg-border-strong" />
                    <div className="h-[5px] w-[35%] rounded bg-accent-soft" />
                    <div className="h-[4px] w-[90%] rounded bg-border mt-2" />
                    <div className="h-[4px] w-[75%] rounded bg-border" />
                    <div className="h-[4px] w-[82%] rounded bg-border" />
                  </div>
                )}
                <div>
                  <p className="tag-mono text-ink-tertiary uppercase mb-2">{t.category}</p>
                  <p className="font-medium text-[14px] leading-snug mb-1.5">{t.name}</p>
                  <p className="text-ink-secondary text-[12.5px] leading-relaxed">{t.description}</p>
                </div>
                <a
                  href="#"
                  className="text-[13px] text-accent font-medium inline-flex items-center gap-1 mt-4"
                >
                  {t.ctaLabel} <ArrowRight size={12} className="arrow" />
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
