import { CompanyWorkspaceDetail } from "@/types";
import { HiringPipeline } from "./HiringPipeline";
import { QuestionWeighting } from "./QuestionWeighting";
import { RecentInterviewQuestions } from "./RecentInterviewQuestions";
import { CompanyPrepPlan } from "./CompanyPrepPlan";
import { Terminal, MapPin, Target, ArrowRight } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import Link from "next/link";

interface CompanyWorkspaceProps {
  workspace: CompanyWorkspaceDetail;
}

export function CompanyWorkspace({ workspace }: CompanyWorkspaceProps) {

  return (
    <div className="flex flex-col gap-8 bg-card border-[1.5px] border-hair rounded-2xl p-6 md:p-8">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex gap-5">
          <div className="w-16 h-16 shrink-0 rounded-xl bg-paper-2 border-[1.5px] border-hair flex items-center justify-center text-ink font-cond text-3xl font-bold">
            {workspace.monogram}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h2 className="display text-[30px]">{workspace.name}</h2>
              <span className="hidden sm:inline-flex px-2 py-1 bg-paper-2 border-[1.5px] border-hair rounded text-[11px] font-semibold text-body">
                {workspace.category}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-[13px] text-body font-medium">
              <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {workspace.targetRole}</span>
              <span className="w-1 h-1 rounded-full bg-ink/25" />
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {workspace.locations.join(", ")}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[11px] font-mono font-bold px-2 py-1 rounded bg-paper border-[1.5px] border-hair text-body uppercase tracking-wider">
                {workspace.recruitmentWindow}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/tools/interview-simulator" className={`${buttonClass("secondary", "sm")} max-sm:hidden`}>
            <Terminal className="size-4" /> Mock interview
          </Link>
          <Link 
            href={`/tools/company-prep?company=${workspace.id}`}
            className={buttonClass("primary", "sm")}
          >
            Prepare for {workspace.name} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>


      <hr className="border-hair" />

      {/* Hiring Pipeline */}
      <HiringPipeline stages={workspace.hiringStages} />

      <hr className="border-hair" />

      {/* The rounds as a picture, and what to study for each */}
      <CompanyPrepPlan workspace={workspace} />

      <hr className="border-hair" />

      {/* Question Weighting */}
      <QuestionWeighting 
        weights={workspace.questionWeights} 
      />

      <hr className="border-hair" />

      {/* Recent Questions */}
      <RecentInterviewQuestions 
        questions={workspace.recentQuestions} 
        companyName={workspace.name}
      />
    </div>
  );
}
