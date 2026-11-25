"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileCheck2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/components/providers/ProfileProvider";
import { ResumeAnalysisRequest, ResumeAnalysisTarget } from "@/lib/resume-analyzer/types";
import { getResumeRequestFormData, resumeAnalysisApi } from "@/lib/resume-analyzer/client";
import { validateResumeRequest } from "@/lib/resume-analyzer/validation";
import { ROLE_OPTIONS } from "./TargetRoleFields";
import { ResumeInputForm } from "./ResumeInputForm";

const blankTarget: ResumeAnalysisTarget = {
  company: "",
  companyType: "",
  role: "",
  customRole: "",
  jobDescription: "",
};

function getRoleFromProfile(value: string): Pick<ResumeAnalysisTarget, "role" | "customRole"> {
  const normalized = value.trim().toLowerCase();
  const match = ROLE_OPTIONS.find((option) => option.value === normalized || option.label.toLowerCase() === normalized);
  if (match) return { role: match.value, customRole: "" };
  return value.trim() ? { role: "custom", customRole: value.trim() } : { role: "", customRole: "" };
}

export function ResumeAnalyzerPage() {
  const router = useRouter();
  const { draftProfile, isLoading } = useProfile();
  const [request, setRequest] = useState<ResumeAnalysisRequest>({
    source: "pdf",
    target: blankTarget,
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const errorRef = useRef<HTMLDivElement | null>(null);

  // Prefill the target role from the profile once it has loaded (only while the field is empty)
  const profileRole = draftProfile.identity?.targetRole?.trim();
  if (!isLoading && !request.target.role && profileRole) {
    setRequest((current) => ({ ...current, target: { ...current.target, ...getRoleFromProfile(profileRole) } }));
  }

  const updateTarget = (patch: Partial<ResumeAnalysisTarget>) => {
    setRequest((current) => ({ ...current, target: { ...current.target, ...patch } }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) {
        delete next[key];
      }
      return next;
    });
    setApiError(null);
  };

  const updateSource = (source: ResumeAnalysisRequest["source"]) => {
    setRequest((current) => ({ ...current, source }));
    setErrors((current) => {
      const next = { ...current };
      delete next.resume;
      delete next.resumeText;
      return next;
    });
    setApiError(null);
  };

  const updateFile = (nextFile: File | null) => {
    setFile(nextFile);
    setErrors((current) => {
      const next = { ...current };
      delete next.resume;
      return next;
    });
    setApiError(null);
  };

  const updateText = (value: string) => {
    setRequest((current) => ({ ...current, resumeText: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next.resumeText;
      return next;
    });
    setApiError(null);
  };

  const handleSubmit = async () => {
    const formData = getResumeRequestFormData(request, file);
    const nextErrors = validateResumeRequest(request, file);
    setErrors(nextErrors);
    setApiError(null);

    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setSubmitting(true);
    try {
      const analysis = await resumeAnalysisApi.createAnalysis(formData);
      router.push(`/tools/resume-analyzer/${encodeURIComponent(analysis.id)}`);
    } catch (error) {
      setApiError(error instanceof Error && error.message ? error.message : "The analysis could not be started. Please try again.");
      window.requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link href="/tools" className="inline-flex items-center gap-2 text-[12.5px] font-medium text-body hover:text-accent-ink">
          <ArrowLeft size={15} />
          All tools
        </Link>
      </nav>

      <header className="mb-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-card border-[1.5px] border-hair shadow-[0_1px_2px_-1px_rgba(15,23,42,0.04)]">
            <span className="w-1.5 h-1.5 rounded-full bg-note animate-pulse"></span>
            <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-note">
              Resume Analyzer
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-hair"></div>
          <span className="hidden sm:inline-block text-[11px] font-medium text-body uppercase tracking-wider">
            Evidence-backed placement review
          </span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="display text-[44px] md:text-[60px]">
              Compare your resume with the role you want.
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-body">
              Describe the role you want, upload your resume, and get a report with the evidence, the gaps, and what to fix first.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded border-[1.5px] border-hair bg-card px-2.5 py-1.5 text-[11px] font-mono text-body">
              <FileCheck2 size={14} />
              PDF + text
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border-[1.5px] border-hair bg-card px-2.5 py-1.5 text-[11px] font-mono text-body">
              <ShieldCheck size={14} />
              Authenticated
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] items-start">
        <main className="rounded-lg border-[1.5px] border-hair bg-card p-4 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.04)] sm:p-6">
          <ResumeInputForm
            request={request}
            file={file}
            errors={errors}
            apiError={apiError}
            submitting={submitting}
            errorRef={errorRef}
            onSourceChange={updateSource}
            onFileChange={updateFile}
            onTextChange={updateText}
            onTargetChange={updateTarget}
            onSubmit={handleSubmit}
          />
        </main>

        <aside className="space-y-4 lg:sticky lg:top-24" aria-labelledby="analyzer-notes-heading">
          <section className="rounded-lg border-[1.5px] border-hair bg-card p-4">
            <h2 id="analyzer-notes-heading" className="text-[13px] font-bold text-ink">What gets checked</h2>
            <ul className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-body">
              <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>Candidate and contact details</li>
              <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>Skills, keywords, and role fit</li>
              <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>Experience, projects, and education</li>
              <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>ATS compatibility and resume issues</li>
              <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>Prioritized action plan</li>
            </ul>
          </section>
          <section className="rounded-lg border-[1.5px] border-hair bg-card p-4">
            <h2 className="text-[13px] font-bold text-ink">Before you analyze</h2>
            <p className="mt-3 text-[12.5px] leading-relaxed text-body">
              Use a PDF with selectable text when possible. Add the exact company and role so the comparison reflects the opportunity rather than a generic checklist.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
