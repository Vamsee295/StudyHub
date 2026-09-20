import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const checks = ["Free Community Access", "Updated for 2026 Batch", "100% Ad-Free"];

export function FinalCTA() {
  return (
    <section className="bg-navy text-white">
      <div className="container-max px-5 md:px-8 py-20 md:py-24 text-center">
        <Reveal direction="up">
          <h2 className="font-display text-[30px] md:text-[38px] font-medium tracking-tight leading-tight max-w-2xl mx-auto">
            Your placement preparation starts here.
          </h2>
        </Reveal>
        <Reveal direction="up" delay={0.12}>
          <p className="text-white/60 text-[15.5px] mt-4 max-w-lg mx-auto">
            Stop collecting scattered PDFs. Learn the right things, practice consistently, and
            walk into every interview already prepared.
          </p>
        </Reveal>
        <Reveal direction="up" delay={0.24}>
          <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
            <Link href="/login" className="btn-primary">
              Start Free Placement Track
            </Link>
            <a
              href="#learn"
              className="btn-secondary bg-transparent text-white border-white/20 hover:bg-white/10"
            >
              View Complete Curriculum
            </a>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.34}>
          <div className="mt-8 flex items-center justify-center gap-6 flex-wrap text-[13px] text-white/60">
            {checks.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-success" /> {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
