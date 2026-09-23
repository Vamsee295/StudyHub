"use client";

import { CompanyType, ResumeAnalysisTarget } from "@/lib/resume-analyzer/types";

interface TargetCompanyFieldsProps {
  target: ResumeAnalysisTarget;
  companyError?: string | null;
  companyTypeError?: string | null;
  jobDescriptionError?: string | null;
  disabled?: boolean;
  onChange: (patch: Partial<ResumeAnalysisTarget>) => void;
}

const companyTypes = [
  { value: "product", label: "Product company" },
  { value: "high_volume", label: "High-volume recruiter" },
  { value: "fintech_consulting", label: "FinTech / consulting" },
  { value: "startup", label: "Early-stage startup" },
  { value: "mass_hiring", label: "Mass hiring / assessment-led" },
  { value: "other", label: "Other" },
] as const;

export function TargetCompanyFields({
  target,
  companyError,
  companyTypeError,
  jobDescriptionError,
  disabled = false,
  onChange,
}: TargetCompanyFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="target-company" className="mb-1.5 block text-[12px] font-semibold text-[var(--ink-secondary)]">
          Target company
        </label>
        <input
          id="target-company"
          type="text"
          value={target.company}
          onChange={(event) => onChange({ company: event.target.value })}
          disabled={disabled}
          maxLength={120}
          placeholder="For example: Microsoft"
          aria-invalid={Boolean(companyError)}
          aria-describedby={companyError ? "target-company-error" : "target-company-hint"}
          className="field w-full text-[var(--ink)] disabled:cursor-not-allowed disabled:bg-[var(--surface-subdued)]"
        />
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <p id="target-company-hint" className="text-[11.5px] text-[var(--ink-tertiary)]">
            Enter the company or hiring organization named in the opening.
          </p>
          <span className="text-[11px] font-mono text-[var(--ink-tertiary)]">{target.company.length}/120</span>
        </div>
        {companyError && (
          <p id="target-company-error" className="mt-1.5 text-[12px] font-medium text-[var(--error)]">
            {companyError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="company-type" className="mb-1.5 block text-[12px] font-semibold text-[var(--ink-secondary)]">
          Company type
        </label>
        <select
          id="company-type"
          value={target.companyType}
          onChange={(event) => onChange({ companyType: event.target.value as typeof companyTypes[number]["value"] })}
          disabled={disabled}
          aria-invalid={Boolean(companyTypeError)}
          aria-describedby={companyTypeError ? "company-type-error" : undefined}
          className="field w-full appearance-none pr-9 text-[var(--ink)] disabled:cursor-not-allowed disabled:bg-[var(--surface-subdued)]"
        >
          {companyTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {companyTypeError && (
          <p id="company-type-error" className="mt-1.5 text-[12px] font-medium text-[var(--error)]">
            {companyTypeError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="job-description" className="mb-1.5 block text-[12px] font-semibold text-[var(--ink-secondary)]">
          Job description <span className="font-normal text-[var(--ink-tertiary)">(optional)</span>
        </label>
        <textarea
          id="job-description"
          value={target.jobDescription ?? ""}
          onChange={(event) => onChange({ jobDescription: event.target.value })}
          disabled={disabled}
          maxLength={12_000}
          rows={6}
          placeholder="Paste the role description to compare responsibilities, requirements, and company language."
          aria-invalid={Boolean(jobDescriptionError)}
          aria-describedby={jobDescriptionError ? "job-description-error" : "job-description-hint"}
          className="field min-h-[132px] resize-y w-full text-[var(--ink)] disabled:cursor-not-allowed disabled:bg-[var(--surface-subdued)]"
        />
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <p id="job-description-hint" className="text-[11.5px] text-[var(--ink-tertiary)]">
            A description makes company alignment and keyword checks more specific.
          </p>
          <span className="text-[11px] font-mono text-[var(--ink-tertiary)]">
            {(target.jobDescription ?? "").length}/12,000
          </span>
        </div>
        {jobDescriptionError && (
          <p id="job-description-error" className="mt-1.5 text-[12px] font-medium text-[var(--error)]">
            {jobDescriptionError}
          </p>
        )}
      </div>
    </div>
  );
}
