import React from "react";
import { InterviewUtilityItem } from "@/types";
import Link from "next/link";
import { clsx } from "clsx";

export function InterviewUtilitiesSection({ items }: { items: InterviewUtilityItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14 animate-in fade-in duration-500 delay-200">
      <div className="flex items-center justify-between mb-5">
        <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">Interview</span>
          <span className="display text-[28px] md:text-[34px]">Interview prep</span>
        </h2>
        <span className="text-[13px] text-body font-medium hidden sm:block">
          Tools for technical, architectural, and behavioral rounds
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block bg-card border-[1.5px] border-hair rounded-xl p-5 hover:border-line transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded-sm bg-paper-2 border-[1.5px] border-hair text-[10px] font-mono font-medium text-body uppercase">
                {item.tag}
              </span>
            </div>

            <h3 className="text-[15.5px] font-bold text-ink mb-1 group-hover:text-accent-ink transition-colors">
              {item.title}
            </h3>
            
            <div className="flex items-center gap-3 text-[12.5px] font-medium text-mute mb-5">
              <span className="text-body">{item.durationOrStep}</span>
              <span className="w-1 h-1 rounded-full bg-ink/25"></span>
              <span>{item.meta}</span>
            </div>

            <div
              className={clsx(
                "inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-[13px] font-semibold transition-all w-full",
                item.isPrimaryAction
                  ? "bg-ink text-paper group-hover:bg-accent"
                  : "bg-paper-2 text-ink border-[1.5px] border-hair group-hover:bg-card group-hover:border-accent group-hover:text-accent-ink"
              )}
            >
              {item.actionLabel}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
