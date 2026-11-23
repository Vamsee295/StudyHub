import Link from "next/link";
import { LineChart, Cpu, Layers, Network, Gauge, ArrowRight } from "lucide-react";
import { LABS } from "@/lib/labs/catalog";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const ICONS = { chart: LineChart, cpu: Cpu, layers: Layers, network: Network, gauge: Gauge };

export function Labs() {
  return (
    <section id="labs" className="border-b border-border">
      <div className="container-max px-5 md:px-8 py-16 md:py-20">
        <SectionHeader eyebrow="Interactive simulators" title="Labs: learn by doing" />

        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" stagger={0.07}>
          {LABS.map((l) => {
            const Icon = ICONS[l.icon];
            return (
              <RevealItem key={l.slug} direction="up">
                <div className="elevate-1 rounded-xl p-5 h-full flex flex-col hover:border-accent transition-colors">
                  <span className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center mb-3">
                    <Icon size={17} className="text-accent" aria-hidden="true" />
                  </span>
                  <p className="font-medium text-[15px] mb-1.5">{l.title}</p>
                  <p className="text-ink-secondary text-[13.5px] leading-relaxed flex-1">{l.description}</p>
                  <Link href={`/labs/${l.slug}`} className="text-[13.5px] text-accent font-medium mt-4 inline-flex items-center gap-1">
                    Launch lab <ArrowRight size={13} className="arrow" aria-hidden="true" />
                  </Link>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
