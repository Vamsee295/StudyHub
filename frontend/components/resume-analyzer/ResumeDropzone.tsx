"use client";

import { useCallback, useState, type DragEvent } from "react";
import { FileUp, UploadCloud } from "lucide-react";
import { clsx } from "clsx";

interface ResumeDropzoneProps {
  file: File | null;
  error?: string | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
}

export function ResumeDropzone({ file, error, disabled = false, onFileChange }: ResumeDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputId = "resume-pdf-input";

  const addFile = useCallback(
    (nextFile?: File | null) => {
      if (disabled) return;
      onFileChange(nextFile ?? null);
    },
    [disabled, onFileChange],
  );

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={disabled ? undefined : 0}
        aria-disabled={disabled || undefined}
        aria-labelledby="resume-dropzone-label"
        aria-describedby={error ? "resume-dropzone-error" : undefined}
        className={clsx(
          "flex min-h-[168px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-5 py-6 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
          isDragging
            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
            : "border-[var(--border-strong)] bg-[var(--surface-subdued)]/40 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]",
          disabled && "cursor-not-allowed opacity-60",
        )}
        onClick={() => !disabled && document.getElementById(inputId)?.click()}
        onKeyDown={(event) => {
          if (!disabled && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            document.getElementById(inputId)?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span
          className={
            "flex h-10 w-10 items-center justify-center rounded-full border " +
            (isDragging
              ? "border-[var(--accent-soft-border)] bg-white text-[var(--accent)]"
              : "border-[var(--border)] bg-white text-[var(--ink-secondary)]")
          }
        >
          <UploadCloud size={20} strokeWidth={1.8} />
        </span>
        <span id="resume-dropzone-label" className="text-[14px] font-semibold text-[var(--ink)]">
          {file ? "Replace the selected PDF" : "Drag and drop your resume PDF"}
        </span>
        <span className="max-w-md text-[12.5px] leading-relaxed text-[var(--ink-secondary)]">
          PDF only, up to 10 MB. The file is sent to the secure backend for parsing.
        </span>
        <span className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] font-mono text-[var(--ink-tertiary)]">
          <FileUp size={13} />
          or choose a file
        </span>
      </div>
      <input
        id={inputId}
        type="file"
        accept=".pdf,application/pdf"
        className="sr-only"
        onChange={(event) => addFile(event.target.files?.[0] ?? null)}
        disabled={disabled}
      />
      {error && (
        <p id="resume-dropzone-error" className="mt-2 text-[12px] font-medium text-[var(--error)]">
          {error}
        </p>
      )}
    </div>
  );
}
