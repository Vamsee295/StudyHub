"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { practiceCategories, practiceStats } from "@/lib/data/practice";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Practice() {
  return (
    <section id="practice" className="border-b border-border">
      <div className="container-max px-5 md:px-8 py-16 md:py-20">
        <SectionHeader
          eyebrow="Targeted Problem Sets"
          title="Practice what companies actually test"
          right={
            <div className="flex items-center gap-2 tag-mono text-ink-secondary">
              {practiceStats.map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  {i > 0 && <span className="text-ink-tertiary">·</span>}
                  {s}
                </span>
              ))}
            </div>
          }
        />

        {/* category grid */}
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" stagger={0.07}>
          {practiceCategories.map((p) => (
            <RevealItem key={p.name} direction="scale">
              <div className="elevate-1 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-[15px]">{p.name}</p>
                  <span className="tag-mono text-ink-tertiary">{p.questions} Qs</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-accent-soft mb-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${p.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-secondary text-[12.5px]">{p.progress}% complete</span>
                  <a href="#" className="text-[13.5px] text-accent font-medium inline-flex items-center gap-1">
                    Solve <Play size={12} className="arrow" />
                  </a>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

