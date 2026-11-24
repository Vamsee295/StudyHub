import Link from "next/link";
import { LineChart, Cpu, Layers, Network, Gauge, ArrowRight } from "lucide-react";
import { LABS } from "@/lib/labs/catalog";
import { PageHeader } from "@/components/ui/Page";

const ICONS = { chart: LineChart, cpu: Cpu, layers: Layers, network: Network, gauge: Gauge };

export default function LabsIndex() {
  return (
    <>
      <PageHeader eyebrow={`${LABS.length} labs`} title="Watch it" hl="run" note="change the inputs, see the algorithm work" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LABS.map((l) => {
          const Icon = ICONS[l.icon];
          return (
            <li key={l.slug}>
              <Link href={`/labs/${l.slug}`} className="brut brut-hover no-press group flex h-full flex-col rounded-2xl bg-card p-5">
                <span className="flex items-center justify-between">
                  <Icon aria-hidden className="size-6 text-accent" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-mute">{l.course}</span>
                </span>
                <span className="display mt-5 text-[28px]">{l.title}</span>
                <span className="mt-2 flex-1 text-[14px] leading-relaxed text-body">{l.description}</span>
                <span className="label-cond mt-5 inline-flex items-center gap-1 text-[16px]">
                  Open lab <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
