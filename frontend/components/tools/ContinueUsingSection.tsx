import React from "react";
import { ContinueToolItem } from "@/types";
import { Play } from "lucide-react";
import Link from "next/link";

export function ContinueUsingSection({ items }: { items: ContinueToolItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-5">
        <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">Recent</span>
          <span className="display text-[28px] md:text-[34px]">Continue where you left off</span>
        </h2>
        <span className="text-[13px] text-body font-medium">Pick up where you left off</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block bg-card border border-hair rounded-xl p-5 hover:border-accent-line hover:bg-accent-soft hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/10 group-hover:bg-accent transition-colors"></div>

            <div className="flex justify-between items-start mb-3">
              <span className="inline-block px-2 py-1 rounded bg-paper-2 border border-hair text-[10px] font-mono font-medium text-body uppercase group-hover:bg-card group-hover:border-accent-line group-hover:text-accent-ink transition-colors">
                {item.badge}
              </span>
              <span className="text-[12px] font-medium text-mute">{item.timeAgo}</span>
            </div>

            <h3 className="text-[16px] font-bold text-ink mb-1 group-hover:text-accent-ink transition-colors">
              {item.title}
            </h3>
            <p className="text-[13px] text-body mb-4">{item.meta}</p>

            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-accent-ink opacity-80 group-hover:opacity-100 transition-opacity">
              Continue
              <Play className="w-[12px] h-[12px] fill-current" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
