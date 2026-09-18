"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { companies, companySegments, lastVerified } from "@/lib/data/companies";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Companies() {
  const [segment, setSegment] = useState<string>("All");
  const filtered = companies.filter((c) => segment === "All" || c.segment === segment);

  return (
    <section id="companies" className="border-b border-border bg-surface-subdued/40">
      <div className="container-max px-5 md:px-8 py-16 md:py-20">
        <SectionHeader
          eyebrow="Hiring Blueprints"
          title="Target your company placement rounds"
          right={
            <div className="flex gap-2 flex-wrap">
              {["All", ...companySegments].map((s) => (
                <button
                  key={s}
                  onClick={() => setSegment(s)}
                  className={`pill transition-colors ${
                    segment === s ? "bg-accent text-white border border-accent" : "pill-neutral hover:border-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          }
        />
        <p className="tag-mono text-ink-tertiary -mt-7 mb-8">Last verified: {lastVerified}</p>

        <RevealGroup key={segment} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.06}>
          {filtered.map((c) => (
            <RevealItem key={c.name} direction="up">
              <div className="elevate-1 rounded-xl p-5 h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-semibold text-[15px]">{c.name}</p>
                  <span className="pill pill-neutral shrink-0">{c.roleTag}</span>
                </div>
                <p className="text-ink-secondary text-[13px] leading-relaxed mb-3">{c.description}</p>
                <ul className="space-y-1.5 mb-4 flex-1">
                  {c.focus.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12.5px] text-ink-secondary">
                      <span className="w-1 h-1 rounded-full bg-accent mt-[7px] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#" className="text-[13px] text-accent font-medium inline-flex items-center gap-1">
                  View {c.name.split(" ")[0]} Blueprint <ArrowRight size={13} className="arrow" />
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
