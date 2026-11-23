import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface PlacementJourneyStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  relatedTemplateId?: string;
  isCompleted: boolean;
}

export const defaultPlacementJourneySteps: PlacementJourneyStep[] = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "Master the 1-Page Resume",
    description: "Your resume is your ticket to the interview. Use the SDE ATS template to ensure you pass screening.",
    relatedTemplateId: "sde-resume",
    isCompleted: true,
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "Prepare Your Project Walkthrough",
    description: "Every technical interview starts with 'tell me about a project'. Script a 2-minute overview.",
    relatedTemplateId: "project-walkthrough",
    isCompleted: false,
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "Map the STAR Matrix",
    description: "Prepare 5 core stories that map to 15 different behavioral questions to avoid getting caught off-guard.",
    relatedTemplateId: "star-matrix",
    isCompleted: false,
  },
];

export function PlacementJourneySection({ steps = defaultPlacementJourneySteps }: { steps?: PlacementJourneyStep[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="mb-6">
        <h2 className="text-[17px] font-semibold text-[var(--ink)] flex items-center gap-2 mb-1">
          Placement Toolkit Journey
        </h2>
        <p className="text-[13px] text-[var(--ink-secondary)]">
          Follow this sequence to ensure your materials are ready for campus and off-campus drives.
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Horizontal line connecting steps on md+ screens */}
          <div className="hidden md:block absolute top-[22px] left-0 right-0 h-px bg-[var(--border)]/60 z-0"></div>

          {steps.map((step: PlacementJourneyStep, idx: number) => (
            <div key={step.id} className="flex-1 relative z-10">
              <div className="flex flex-row md:flex-col items-start gap-4 md:gap-3">
                {/* Icon / Step indicator */}
                <div className="bg-[var(--surface)] shrink-0 mt-1 md:mt-0 relative group">
                  {step.isCompleted ? (
                    <CheckCircle2 className="w-8 h-8 text-[var(--ink)] bg-[var(--surface)] fill-[var(--surface-subdued)]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--ink-secondary)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors">
                      {step.stepNumber}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <h3 className={`text-[15px] font-semibold mb-1.5 ${step.isCompleted ? 'text-[var(--ink)]' : 'text-[var(--ink)]'}`}>
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[var(--ink-secondary)] leading-relaxed mb-3">
                    {step.description}
                  </p>
                  
                  {step.relatedTemplateId && (
                    <Link
                      href={`/templates/${step.relatedTemplateId}`}
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors mt-auto"
                    >
                      {step.isCompleted ? "Review Template" : "Start Template"} 
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Vertical line connecting steps on small screens */}
              {idx < steps.length - 1 && (
                <div className="md:hidden absolute left-[15px] top-[40px] bottom-[-20px] w-px bg-[var(--border)]/60 z-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
