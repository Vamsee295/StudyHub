"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { resources, resourceCategories } from "@/lib/data/resources";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const difficultyPill: Record<string, string> = {
  Beginner: "pill-success",
  Intermediate: "pill-accent",
  Advanced: "pill-neutral",
};

export function Resources() {
  const [category, setCategory] = useState("All");
  const filtered = resources.filter((r) => category === "All" || r.category === category);

  return (
    <section id="resources" className="border-b border-border">
      <div className="container-max px-5 md:px-8 py-16 md:py-20">
        <SectionHeader
          eyebrow="Peer-Reviewed Notes"
          title="Start with the essentials"
          right={
            <div className="flex gap-2 flex-wrap">
              {resourceCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`pill transition-colors ${
                    category === c ? "bg-accent text-white border border-accent" : "pill-neutral hover:border-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          }
        />

        <RevealGroup
          key={category}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          stagger={0.06}
        >
          {filtered.map((r) => (
            <RevealItem key={r.title} direction="left">
              <div className="elevate-1 rounded-xl p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`pill ${difficultyPill[r.difficulty]}`}>{r.difficulty}</span>
                  <span className="text-ink-tertiary text-[12px] tag-mono">{r.time}</span>
                </div>
                <p className="font-medium text-[15px] mb-1.5 leading-snug">{r.title}</p>
                <p className="text-ink-secondary text-[13px] leading-relaxed flex-1 mb-4">
                  {r.description}
                </p>
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-tertiary tag-mono">{r.detail}</span>
                  <a href="#" className="text-accent font-medium inline-flex items-center gap-1">
                    Read notes <ArrowRight size={13} className="arrow" />
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
