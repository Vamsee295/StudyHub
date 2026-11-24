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
          "flex min-h-[168px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-5 py-6 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
          isDragging
            ? "border-accent bg-accent-soft"
            : "border-line bg-paper-2/40 hover:border-accent hover:bg-accent-soft",
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
              ? "border-accent-line bg-card text-accent-ink"
              : "border-hair bg-card text-body")
          }
        >
          <UploadCloud size={20} strokeWidth={1.8} />
        </span>
        <span id="resume-dropzone-label" className="text-[14px] font-semibold text-ink">
          {file ? "Replace the selected PDF" : "Drag and drop your resume PDF"}
        </span>
        <span className="max-w-md text-[12.5px] leading-relaxed text-body">
          PDF only, up to 10 MB. The file is sent to the secure backend for parsing.
        </span>
        <span className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] font-mono text-mute">
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
        <p id="resume-dropzone-error" className="mt-2 text-[12px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
