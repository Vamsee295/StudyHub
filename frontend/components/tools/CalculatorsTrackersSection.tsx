import React from "react";
import { CalculatorTrackerItem } from "@/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CalculatorsTrackersSection({ items }: { items: CalculatorTrackerItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14 animate-in fade-in duration-500 delay-300">
      <div className="flex items-center justify-between mb-5">
        <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">Calculators</span>
          <span className="display text-[28px] md:text-[34px]">Calculators &amp; trackers</span>
        </h2>
        <span className="text-[13px] text-body font-medium hidden sm:block">
          Quick formula and telemetry utilities for placement milestones
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex flex-col items-center text-center bg-card border border-hair rounded-xl p-4 hover:border-accent hover:shadow-sm transition-all duration-300"
          >
            <span className="text-[10px] font-mono font-medium text-mute uppercase tracking-wider mb-2 group-hover:text-accent-ink transition-colors">
              {item.subtitle}
            </span>
            <h3 className="text-[14px] font-bold text-ink mb-3 leading-tight">
              {item.title}
            </h3>
            <div className="mt-auto flex items-center justify-center gap-1 text-[11.5px] font-semibold text-body group-hover:text-accent-ink transition-colors">
              {item.actionLabel.replace("→", "").trim()}
              <ChevronRight className="w-3 h-3 arrow" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
