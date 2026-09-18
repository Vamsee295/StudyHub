import {
  Database, Activity, ScanSearch, Clock, Mic, Gauge, ArrowRight, LucideIcon,
} from "lucide-react";
import { labs } from "@/lib/data/labs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const iconMap: Record<string, LucideIcon> = {
  database: Database,
  activity: Activity,
  scan: ScanSearch,
  clock: Clock,
  mic: Mic,
  gauge: Gauge,
};

export function Labs() {
  return (
    <section id="labs" className="border-b border-border">
      <div className="container-max px-5 md:px-8 py-16 md:py-20">
        <SectionHeader eyebrow="Experimental Sandboxes" title="Placement Labs: learn by doing" />

        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" stagger={0.07}>
          {labs.map((l) => {
            const Icon = iconMap[l.icon] ?? Database;
            return (
              <RevealItem key={l.name} direction="up">
                <div className="elevate-1 rounded-xl p-5 h-full flex flex-col hover:border-accent transition-colors">
                  <span className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center mb-3">
                    <Icon size={17} className="text-accent" />
                  </span>
                  <p className="font-medium text-[15px] mb-1.5">{l.name}</p>
                  <p className="text-ink-secondary text-[13.5px] leading-relaxed flex-1">{l.description}</p>
                  <a href="#" className="text-[13.5px] text-accent font-medium mt-4 inline-flex items-center gap-1">
                    Launch lab <ArrowRight size={13} className="arrow" />
                  </a>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
