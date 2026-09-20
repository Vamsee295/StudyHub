import React from "react";
import Link from "next/link";
import { ArrowRight, LayoutTemplate, Activity, MessageSquare } from "lucide-react";

export function PreviewSnapshotSection() {
  return (
    <section className="mb-16">
      <div className="flex flex-col lg:flex-row gap-8 bg-[var(--surface-subdued)]/30 border border-[var(--border)] rounded-2xl p-6 md:p-8">
        
        {/* Left Side: Preview Image / Mock Document */}
        <div className="flex-1 rounded-xl bg-white border border-[var(--border)] shadow-sm overflow-hidden flex flex-col relative">
          <div className="bg-[#f8fafc] border-b border-[var(--border)] px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="ml-4 text-[11px] font-mono text-[var(--ink-secondary)] tracking-wide">
              Document Preview / workspace.txt
            </div>
          </div>
          
          <div className="p-6 text-[13px] leading-relaxed text-[var(--ink-secondary)] font-serif h-full relative">
            <h4 className="text-[16px] font-bold text-[var(--ink)] mb-4 font-sans">
              "Tell me about yourself"
            </h4>
            <p className="mb-4">
              I am a <span className="bg-[#fef9c3] text-[#ca8a04] px-1 py-0.5 rounded border border-[#fef08a]">[YEAR]</span> student at <span className="bg-[#fef9c3] text-[#ca8a04] px-1 py-0.5 rounded border border-[#fef08a]">[UNIVERSITY]</span>. Over the last year, I’ve specialized in <span className="bg-[#fef9c3] text-[#ca8a04] px-1 py-0.5 rounded border border-[#fef08a]">[TECH STACK]</span>. 
            </p>
            <p className="mb-4">
              My most significant project was <span className="bg-[#fef9c3] text-[#ca8a04] px-1 py-0.5 rounded border border-[#fef08a]">[PROJECT NAME]</span> where I solved <span className="bg-[#fef9c3] text-[#ca8a04] px-1 py-0.5 rounded border border-[#fef08a]">[PROBLEM]</span>. This taught me how to scale systems for real users. 
            </p>
            <p>
              I’m interviewing for this role because <span className="bg-[#fef9c3] text-[#ca8a04] px-1 py-0.5 rounded border border-[#fef08a]">[COMPANY MISSION]</span> aligns with my engineering goals.
            </p>

            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
          </div>
        </div>

        {/* Right Side: Features */}
        <div className="w-full lg:w-80 flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-[10px] font-mono font-bold text-[var(--accent)] tracking-wider uppercase mb-2 block">
              LIVE TEMPLATE WORKSPACE
            </span>
            <h3 className="text-2xl font-newsreader font-medium text-[var(--ink)] mb-3">
              Don't just read it. Build it.
            </h3>
            <p className="text-[14px] text-[var(--ink-secondary)]">
              Our workspace allows you to fill in variables and instantly generate customized output ready for your interviews.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex gap-3 items-start">
              <LayoutTemplate className="w-4 h-4 text-[var(--ink-secondary)] mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-[var(--ink)]">Guided Variables</h4>
                <p className="text-[12px] text-[var(--ink-tertiary)] leading-snug mt-1">Fill in the blanks with your own experience.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Activity className="w-4 h-4 text-[var(--ink-secondary)] mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-[var(--ink)]">Auto-Save State</h4>
                <p className="text-[12px] text-[var(--ink-tertiary)] leading-snug mt-1">Your progress is automatically saved to your dashboard.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <MessageSquare className="w-4 h-4 text-[var(--ink-secondary)] mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-[var(--ink)]">Recruiter Calibrated</h4>
                <p className="text-[12px] text-[var(--ink-tertiary)] leading-snug mt-1">Language is structured for exactly what recruiters want to hear.</p>
              </div>
            </div>
          </div>

          <Link
            href="/templates/project-walkthrough"
            className="flex items-center justify-center gap-2 bg-[var(--ink)] text-white hover:bg-[var(--ink)]/90 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all shadow-sm"
          >
            Try the Workspace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
