import Link from "next/link";
import { LineChart, Cpu, Layers, Network, Gauge, ArrowRight } from "lucide-react";
import { LABS } from "@/lib/labs/catalog";
import { focusRing } from "@/components/labs/LabShell";

const ICONS = { chart: LineChart, cpu: Cpu, layers: Layers, network: Network, gauge: Gauge };

export default function LabsIndex() {
  return (
    <div className="flex flex-col gap-6 pb-16 w-full">
      <header className="flex flex-col gap-2 border-b border-[var(--border)]/80 pb-6">
        <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">Labs</h1>
        <p className="text-[var(--ink-secondary)] text-[15px] max-w-2xl">
          Interactive simulators for the topics that come up in exams and interviews. Change the inputs and watch the algorithm work. Everything runs in your browser.
        </p>
      </header>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LABS.map((l) => {
          const Icon = ICONS[l.icon];
          return (
            <li key={l.slug}>
              <Link href={`/labs/${l.slug}`} className={`group flex flex-col h-full p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors ${focusRing}`}>
                <span className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center mb-3">
                  <Icon aria-hidden="true" className="w-[18px] h-[18px] text-[var(--accent)]" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">{l.course}</span>
                <span className="text-[15px] font-semibold text-[var(--ink)] mt-1">{l.title}</span>
                <span className="text-[13.5px] text-[var(--ink-secondary)] leading-relaxed mt-1.5 flex-1">{l.description}</span>
                <span className="text-[13px] text-[var(--accent)] font-medium mt-4 inline-flex items-center gap-1">
                  Open lab <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
