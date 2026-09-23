"use client";

import type { RefObject } from "react";
import { Loader2, LockKeyhole, Sparkles } from "lucide-react";
import { ResumeAnalysisRequest } from "@/lib/resume-analyzer/types";
import { MIN_RESUME_TEXT_LENGTH, MAX_RESUME_TEXT_LENGTH } from "@/lib/resume-analyzer/validation";
import { ResumeFormErrors } from "./ResumeFormErrors";
import { ResumeDropzone } from "./ResumeDropzone";
import { SelectedResumeFile } from "./SelectedResumeFile";
import { ResumeSourceSelector } from "./ResumeSourceSelector";
import { TargetCompanyFields } from "./TargetCompanyFields";
import { TargetRoleFields } from "./TargetRoleFields";

interface ResumeInputFormProps {
  request: ResumeAnalysisRequest;
  file: File | null;
  errors: Record<string, string>;
  apiError: string | null;
  submitting: boolean;
  errorRef?: React.RefObject<HTMLDivElement | null>;
  onSourceChange: (source: ResumeAnalysisRequest["source"]) => void;
  onFileChange: (file: File | null) => void;
  onTextChange: (value: string) => void;
  onTargetChange: (patch: Partial<ResumeAnalysisRequest["target"]>) => void;
  onSubmit: () => void;
}

export function ResumeInputForm({
  request,
  file,
  errors,
  apiError,
  submitting,
  errorRef,
  onSourceChange,
  onFileChange,
  onTextChange,
  onTargetChange,
  onSubmit,
}: ResumeInputFormProps) {
  const resumeError = errors.resume ?? errors.resumeText;
  const textLength = request.resumeText?.trim().length ?? 0;

  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }} className="space-y-6" noValidate>
      <ResumeFormErrors errors={errors} apiError={apiError} errorRef={errorRef} />

      <section aria-labelledby="source-heading" className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="source-heading" className="text-[16px] font-bold text-[var(--ink)]">1. Add the resume</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
              Use one source. A PDF is preferred because the parser can preserve section and page metadata.
            </p>
          </div>
          <span className="mt-0.5 hidden rounded border border-[var(--border)] bg-[var(--surface-subdued)] px-2 py-1 text-[10.5px] font-mono text-[var(--ink-secondary)] sm:inline-flex">
            INPUT
          </span>
        </div>

        <ResumeSourceSelector
          value={request.source}
          onChange={onSourceChange}
          disabled={submitting}
        />

        {request.source === "pdf" ? (
          <div className="mt-4">
            <ResumeDropzone
              file={file}
              error={resumeError}
              disabled={submitting}
              onFileChange={onFileChange}
            />
            <SelectedResumeFile
              file={file}
              error={resumeError}
              disabled={submitting}
              onReplace={() => document.getElementById("resume-pdf-input")?.click()}
              onRemove={() => onFileChange(null)}
            />
          </div>
        ) : (
          <div className="mt-4">
            <label htmlFor="resume-text" className="mb-1.5 block text-[12px] font-semibold text-[var(--ink-secondary)]">
              Resume text
            </label>
            <textarea
              id="resume-text"
              value={request.resumeText ?? ""}
              onChange={(event) => onTextChange(event.target.value)}
              disabled={submitting}
              rows={12}
              placeholder="Paste the resume text here, including experience, projects, education, and skills."
              aria-invalid={Boolean(resumeError)}
              aria-describedby={resumeError ? "resume-text-error" : "resume-text-hint"}
              className="field min-h-[260px] resize-y w-full text-[var(--ink)] disabled:cursor-not-allowed disabled:bg-[var(--surface-subdued)]"
            />
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <p id="resume-text-hint" className="text-[11.5px] text-[var(--ink-tertiary)]">
                Paste at least {MIN_RESUME_TEXT_LENGTH} characters. Do not include passwords or confidential client data.
              </p>
              <span className={textLength < MIN_RESUME_TEXT_LENGTH ? "text-[11px] font-mono text-[var(--warning)]" : "text-[11px] font-mono text-[var(--ink-tertiary)]"}>
                {textLength.toLocaleString()}/{MAX_RESUME_TEXT_LENGTH.toLocaleString()}
              </span>
            </div>
            {resumeError && (
              <p id="resume-text-error" className="mt-1.5 text-[12px] font-medium text-[var(--error)]">
                {resumeError}
              </p>
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="target-heading" className="space-y-5 border-t border-[var(--border)] pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="target-heading" className="text-[16px] font-bold text-[var(--ink)]">2. Set the target benchmark</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
              The report compares the resume with the role and hiring context you provide.
            </p>
          </div>
          <span className="mt-0.5 hidden rounded border border-[var(--border)] bg-[var(--surface-subdued)] px-2 py-1 text-[10.5px] font-mono text-[var(--ink-secondary)] sm:inline-flex">
            BENCHMARK
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <TargetRoleFields
            target={request.target}
            error={errors.role}
            customRoleError={errors.customRole}
            disabled={submitting}
            onChange={onTargetChange}
          />
          <TargetCompanyFields
            target={request.target}
            companyError={errors.company}
            companyTypeError={errors.companyType}
            jobDescriptionError={errors.jobDescription}
            disabled={submitting}
            onChange={onTargetChange}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-[var(--ink-tertiary)]">
          <LockKeyhole size={14} className="mt-0.5 shrink-0" />
          Resume data is sent only to the authenticated StudyHub backend. Provider credentials stay server-side.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary min-w-[180px] disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {submitting ? "Creating analysis..." : "Analyze resume"}
        </button>
      </div>
    </form>
  );
}
