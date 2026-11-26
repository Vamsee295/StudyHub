import Link from "next/link";
import { LineChart, Cpu, Layers, Network, Gauge, ArrowRight, BookOpen, CircleHelp, MousePointerClick } from "lucide-react";
import { LABS } from "@/lib/labs/catalog";
import { PageHeader } from "@/components/ui/Page";
import type { LabContent } from "@/components/labs/LabTheory";
import { bigOContent } from "@/components/labs/theory/BigOTheory";
import { cpuSchedulingContent } from "@/components/labs/theory/CpuSchedulingTheory";
import { pageReplacementContent } from "@/components/labs/theory/PageReplacementTheory";
import { subnetContent } from "@/components/labs/theory/SubnetTheory";
import { capacityContent } from "@/components/labs/theory/CapacityTheory";

const ICONS = { chart: LineChart, cpu: Cpu, layers: Layers, network: Network, gauge: Gauge };
const CONTENT: Record<string, LabContent> = {
  "big-o": bigOContent,
  "cpu-scheduling": cpuSchedulingContent,
  "page-replacement": pageReplacementContent,
  "subnet-calculator": subnetContent,
  "capacity-estimator": capacityContent,
};

const HOW = [
  { icon: BookOpen, title: "Learn the idea", body: "Plain-language theory from zero, with an everyday comparison, the key words and a worked example." },
  { icon: CircleHelp, title: "Check yourself", body: "A few quick questions with answers you can reveal, so you know you've got it." },
  { icon: MousePointerClick, title: "Play with it", body: "A visualizer at the end: change the inputs and watch the algorithm work step by step." },
];

export default function LabsIndex() {
  return (
    <>
      <PageHeader eyebrow={`${LABS.length} labs · beginner friendly`} title="Watch it" hl="run" note="learn it first, then play with it" />

      <section aria-label="How each lab works" className="mb-12 grid gap-4 md:grid-cols-3">
        {HOW.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="flex gap-4 rounded-2xl border-[1.5px] border-hair bg-card p-5">
            <span className="display text-[40px] leading-none text-accent">{i + 1}</span>
            <div>
              <p className="label-cond flex items-center gap-1.5 text-[19px]">
                <Icon className="size-4 text-accent-ink" aria-hidden /> {title}
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-body">{body}</p>
            </div>
          </div>
        ))}
      </section>

      <ul className="grid gap-5 md:grid-cols-2">
        {LABS.map((l) => {
          const Icon = ICONS[l.icon];
          const c = CONTENT[l.slug];
          return (
            <li key={l.slug}>
              <Link href={`/labs/${l.slug}`} className="brut brut-hover no-press group flex h-full flex-col rounded-2xl bg-card p-6">
                <span className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl border-2 border-line bg-paper-2">
                    <Icon aria-hidden className="size-5 text-accent-ink" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-mute">
                    {l.course} · {c.minutes} min
                  </span>
                </span>
                <span className="display mt-5 text-[30px]">{l.title}</span>
                <span className="mt-2 text-[15px] leading-relaxed text-body">{l.description}</span>
                <span className="mt-4 border-t-[1.5px] border-hair pt-4">
                  <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-mute">You&apos;ll learn to</span>
                  <span className="block space-y-1 text-[14px] text-ink">
                    {c.learn.slice(0, 3).map((x) => (
                      <span key={x} className="flex gap-2">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                        {x}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="label-cond mt-auto inline-flex items-center gap-1 pt-5 text-[16px]">
                  Start from scratch <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
