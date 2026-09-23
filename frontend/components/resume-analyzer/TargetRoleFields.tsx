"use client";

import { ResumeAnalysisTarget } from "@/lib/resume-analyzer/types";

interface TargetRoleFieldsProps {
  target: ResumeAnalysisTarget;
  error?: string | null;
  customRoleError?: string | null;
  disabled?: boolean;
  onChange: (patch: Partial<ResumeAnalysisTarget>) => void;
}

export const ROLE_OPTIONS = [
  { value: "software_developer", label: "Software Development Engineer" },
  { value: "frontend_engineer", label: "Frontend Engineer" },
  { value: "backend_engineer", label: "Backend Engineer" },
  { value: "full_stack_engineer", label: "Full Stack Engineer" },
  { value: "data_engineer", label: "Data Engineer" },
  { value: "qa_engineer", label: "Quality Assurance Engineer" },
  { value: "custom", label: "Custom role" },
] as const;

export function TargetRoleFields({
  target,
  error,
  customRoleError,
  disabled = false,
  onChange,
}: TargetRoleFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="target-role" className="mb-1.5 block text-[12px] font-semibold text-[var(--ink-secondary)]">
          Target role
        </label>
        <select
          id="target-role"
          value={target.role}
          onChange={(event) => onChange({ role: event.target.value })}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "target-role-error" : undefined}
          className="field w-full appearance-none pr-9 text-[var(--ink)] disabled:cursor-not-allowed disabled:bg-[var(--surface-subdued)]"
        >
          <option value="">Select a role</option>
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id="target-role-error" className="mt-1.5 text-[12px] font-medium text-[var(--error)]">
            {error}
          </p>
        )}
      </div>

      {target.role === "custom" && (
        <div>
          <label htmlFor="custom-role" className="mb-1.5 block text-[12px] font-semibold text-[var(--ink-secondary)]">
            Custom role title
          </label>
          <input
            id="custom-role"
            type="text"
            value={target.customRole ?? ""}
            onChange={(event) => onChange({ customRole: event.target.value })}
            disabled={disabled}
            maxLength={120}
            placeholder="For example: Machine Learning Engineer"
            aria-invalid={Boolean(customRoleError)}
            aria-describedby={customRoleError ? "custom-role-error" : "custom-role-hint"}
            className="field w-full text-[var(--ink)] disabled:cursor-not-allowed disabled:bg-[var(--surface-subdued)]"
          />
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p id="custom-role-hint" className="text-[11.5px] text-[var(--ink-tertiary)]">
              Use the exact title from the role you are targeting.
            </p>
            <span className="text-[11px] font-mono text-[var(--ink-tertiary)]">
              {(target.customRole ?? "").length}/120
            </span>
          </div>
          {customRoleError && (
            <p id="custom-role-error" className="mt-1.5 text-[12px] font-medium text-[var(--error)]">
              {customRoleError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
