import { CompanyWorkspaceDetail } from "@/types";
import { HiringPipeline } from "./HiringPipeline";
import { CompetencyDiagnostics } from "./CompetencyDiagnostics";
import { QuestionWeighting } from "./QuestionWeighting";
import { RecentInterviewQuestions } from "./RecentInterviewQuestions";
import { Terminal, Bookmark, MapPin, Target, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CompanyWorkspaceProps {
  workspace: CompanyWorkspaceDetail;
}

export function CompanyWorkspace({ workspace }: CompanyWorkspaceProps) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  return (
    <div className="flex flex-col gap-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-sm">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex gap-5">
          <div className="w-16 h-16 shrink-0 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)] flex items-center justify-center text-[var(--ink)] font-bold text-3xl font-newsreader shadow-sm">
            {workspace.monogram}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[var(--ink)]">{workspace.name} Workspace</h2>
              <span className="hidden sm:inline-flex px-2 py-1 bg-[var(--surface-subdued)] border border-[var(--border)] rounded text-[11px] font-semibold text-[var(--ink-secondary)]">
                {workspace.category}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-[13px] text-[var(--ink-secondary)] font-medium">
              <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {workspace.targetRole}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {workspace.locations.join(", ")}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[11px] font-mono font-bold px-2 py-1 rounded bg-[#f8fafc] border border-[var(--border)] text-[var(--ink-secondary)] uppercase tracking-wider">
                {workspace.recruitmentWindow}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded bg-[var(--success-soft)] border border-[var(--success-soft-border)] text-[var(--success)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {workspace.competenciesVerified} of {workspace.totalCompetencies} Competencies Verified
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-subdued)] text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="hidden sm:flex h-10 items-center justify-center rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[13px] font-semibold text-[var(--ink)] transition-all hover:bg-[var(--surface-subdued)] gap-2">
            <Terminal className="w-4 h-4" /> Simulate Interview
          </button>
          <Link 
            href={`/practice?search=${encodeURIComponent(workspace.name)}`}
            className="h-10 flex items-center justify-center rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 text-[13px] font-semibold text-white transition-all shadow-sm gap-2"
          >
            Prepare for {workspace.name} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Readiness Diagnostic Strip */}
      <div className="flex items-center gap-5 p-4 rounded-xl border border-[var(--border)] bg-[#f8fafc]">
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[var(--border)]"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[var(--accent)] transition-all duration-1000 ease-out"
              strokeDasharray={`${workspace.readinessScore}, 100`}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-[13px] font-mono font-bold text-[var(--ink)]">{workspace.readinessScore}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-bold text-[var(--ink)]">{workspace.name} Placement Readiness: {workspace.readinessPhase}</h4>
          <p className="text-[13px] text-[var(--ink-secondary)] leading-relaxed">
            Your profile currently clears the threshold filters for early screening. We recommend focusing on High-Level System Design to increase final-round conversion probability.
          </p>
        </div>
      </div>

      <hr className="border-[var(--border)]" />

      {/* Hiring Pipeline */}
      <HiringPipeline 
        stages={workspace.hiringStages} 
        activeStageIndex={activeStageIndex} 
        setActiveStageIndex={setActiveStageIndex} 
      />

      <hr className="border-[var(--border)]" />

      {/* Competency Diagnostics */}
      <CompetencyDiagnostics 
        competencies={workspace.competencies} 
        companyName={workspace.name}
      />

      <hr className="border-[var(--border)]" />

      {/* Question Weighting */}
      <QuestionWeighting 
        weights={workspace.questionWeights} 
      />

      <hr className="border-[var(--border)]" />

      {/* Recent Questions */}
      <RecentInterviewQuestions 
        questions={workspace.recentQuestions} 
        companyName={workspace.name}
      />
    </div>
  );
}
