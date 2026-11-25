import React from "react";
import Link from "next/link";
import { ArrowRight, LayoutTemplate, Activity } from "lucide-react";

export function PreviewSnapshotSection() {
  return (
    <section className="mb-16">
      <div className="flex flex-col lg:flex-row gap-8 bg-paper-2/30 border-[1.5px] border-hair rounded-2xl p-6 md:p-8">
        
        {/* Left Side: Preview Image / Mock Document */}
        <div className="flex-1 rounded-xl bg-card border-[1.5px] border-hair overflow-hidden flex flex-col relative">
          <div className="bg-paper border-b border-hair px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="ml-4 text-[11px] font-mono text-body tracking-wide">
              Document Preview / workspace.txt
            </div>
          </div>
          
          <div className="p-6 text-[13px] leading-relaxed text-body font-serif h-full relative">
            <h4 className="text-[16px] font-bold text-ink mb-4 font-sans">
              “Tell me about yourself”
            </h4>
            <p className="mb-4">
              I am a <span className="bg-warning-soft text-warning px-1 py-0.5 rounded border border-warning-line">[YEAR]</span> student at <span className="bg-warning-soft text-warning px-1 py-0.5 rounded border border-warning-line">[UNIVERSITY]</span>. Over the last year, I’ve specialized in <span className="bg-warning-soft text-warning px-1 py-0.5 rounded border border-warning-line">[TECH STACK]</span>. 
            </p>
            <p className="mb-4">
              My most significant project was <span className="bg-warning-soft text-warning px-1 py-0.5 rounded border border-warning-line">[PROJECT NAME]</span> where I solved <span className="bg-warning-soft text-warning px-1 py-0.5 rounded border border-warning-line">[PROBLEM]</span>. This taught me how to scale systems for real users. 
            </p>
            <p>
              I’m interviewing for this role because <span className="bg-warning-soft text-warning px-1 py-0.5 rounded border border-warning-line">[COMPANY MISSION]</span> aligns with my engineering goals.
            </p>

            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent"></div>
          </div>
        </div>

        {/* Right Side: Features */}
        <div className="w-full lg:w-80 flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-[10px] font-mono font-bold text-accent-ink tracking-wider uppercase mb-2 block">
              LIVE TEMPLATE WORKSPACE
            </span>
            <h3 className="text-2xl font-medium text-ink mb-3">
              Don’t just read it. Build it.
            </h3>
            <p className="text-[14px] text-body">
              Our workspace allows you to fill in variables and instantly generate customized output ready for your interviews.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex gap-3 items-start">
              <LayoutTemplate className="w-4 h-4 text-body mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-ink">Guided Variables</h4>
                <p className="text-[12px] text-mute leading-snug mt-1">Fill in the blanks with your own experience.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Activity className="w-4 h-4 text-body mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-ink">Auto-Save State</h4>
                <p className="text-[12px] text-mute leading-snug mt-1">Your progress is automatically saved to your dashboard.</p>
              </div>
            </div>
          </div>

          <Link
            href="/templates/project-walkthrough"
            className="flex items-center justify-center gap-2 bg-ink text-paper hover:bg-ink/90 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all"
          >
            Open the editor <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
