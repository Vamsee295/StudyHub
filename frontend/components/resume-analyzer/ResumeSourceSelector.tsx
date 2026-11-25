"use client";

import { FileText, UploadCloud } from "lucide-react";
import { ResumeSourceType } from "@/lib/resume-analyzer/types";

interface ResumeSourceSelectorProps {
  value: ResumeSourceType;
  onChange: (source: ResumeSourceType) => void;
  disabled?: boolean;
}

const sources: Array<{
  value: ResumeSourceType;
  label: string;
  description: string;
  icon: typeof FileText;
}> = [
  {
    value: "pdf",
    label: "Upload a PDF",
    description: "Use an editable PDF with selectable text.",
    icon: UploadCloud,
  },
  {
    value: "text",
    label: "Paste resume text",
    description: "Paste a plain-text copy when a PDF is unavailable.",
    icon: FileText,
  },
];

export function ResumeSourceSelector({
  value,
  onChange,
  disabled = false,
}: ResumeSourceSelectorProps) {
  return (
    <fieldset className="border-[1.5px] border-hair rounded-lg p-4 bg-card">
      <legend className="px-1.5 text-[11px] font-mono font-semibold uppercase tracking-wide text-body">
        Resume source
      </legend>
      <div className="grid sm:grid-cols-2 gap-3">
        {sources.map(({ value: sourceValue, label, description, icon: Icon }) => {
          const selected = value === sourceValue;
          return (
            <label key={sourceValue} className="block cursor-pointer">
              <input
                type="radio"
                name="resume-source"
                value={sourceValue}
                checked={selected}
                onChange={() => !disabled && onChange(sourceValue)}
                disabled={disabled}
                className="sr-only"
              />
              <div
                className={
                  "source-option flex gap-3 rounded-md border p-3 transition-colors " +
                  (selected
                    ? "border-accent bg-accent-soft"
                    : "border-hair bg-card hover:border-line") +
                  (disabled ? " opacity-60 cursor-not-allowed" : "")
                }
              >
                <span
                  className={
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border " +
                    (selected
                      ? "border-accent-line bg-card text-accent-ink"
                      : "border-hair bg-paper-2 text-body")
                  }
                >
                  <Icon size={16} strokeWidth={1.8} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-semibold text-ink">{label}</span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-body">
                    {description}
                  </span>
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
