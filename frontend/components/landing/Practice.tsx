"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";
import { practiceCategories, practiceStats, featuredProblem } from "@/lib/data/practice";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Practice() {
  const [openHint, setOpenHint] = useState<number | null>(null);

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

        {/* featured problem */}
        <Reveal direction="scale" className="elevate-2 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap px-5 py-4 border-b border-border bg-surface-subdued/60">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="pill pill-accent">{featuredProblem.difficulty}</span>
              <h3 className="font-medium text-[15px]">{featuredProblem.title}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-ink-tertiary text-[12.5px]">Seen at:</span>
              {featuredProblem.seenAt.map((s) => (
                <span key={s} className="pill pill-neutral">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="p-5 md:p-6 md:border-r border-border flex flex-col justify-between">
              <div>
                <p className="text-[14px] leading-relaxed mb-4">{featuredProblem.statement}</p>

                <div className="bg-surface-subdued rounded-lg p-3.5 mb-4 text-[13px]">
                  <p className="tag-mono text-ink-tertiary uppercase mb-1.5">Example 1</p>
                  <p className="mb-1">
                    <span className="text-ink-tertiary">Input:</span> {featuredProblem.example.input}
                  </p>
                  <p className="mb-1">
                    <span className="text-ink-tertiary">Output:</span> {featuredProblem.example.output}
                  </p>
                  <p className="text-ink-secondary">{featuredProblem.example.explanation}</p>
                </div>

                <div className="space-y-2">
                  {featuredProblem.hints.map((h, i) => (
                    <div key={h.label} className="border border-border rounded-md overflow-hidden">
                      <button
                        onClick={() => setOpenHint(openHint === i ? null : i)}
                        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-[13px] text-left font-medium"
                      >
                        <span>{h.label}</span>
                        <ChevronDown
                          size={14}
                          className={`shrink-0 transition-transform ${openHint === i ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openHint === i && (
                        <div className="px-3.5 pb-3 text-[12.5px] text-ink-secondary">{h.body}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-5">
                <button className="btn-primary h-9 px-4 text-[13px]">
                  <Play size={14} /> Solve in Playground
                </button>
                <button className="btn-secondary h-9 px-4 text-[13px]">View 4 Tested Approaches</button>
              </div>
            </div>

            <div className="code-surface m-5 md:m-6 md:ml-0 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-[11.5px] text-white/50 tag-mono">
                <span>Solution.java · Optimal O(n²)</span>
                <span>Java 21</span>
              </div>
              <pre className="p-4 text-[12.5px] leading-relaxed overflow-x-auto font-mono flex-1">
                <code>{featuredProblem.code}</code>
              </pre>
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 text-[11px] text-white/40">
                <span>{featuredProblem.runtime}</span>
                <span>{featuredProblem.memory}</span>
              </div>
            </div>
          </div>
        </Reveal>

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
