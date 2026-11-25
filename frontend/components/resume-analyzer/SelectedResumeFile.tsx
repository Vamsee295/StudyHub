"use client";

import { File, RefreshCw, X } from "lucide-react";
import { formatBytes } from "@/lib/resume-analyzer/validation";

interface SelectedResumeFileProps {
  file: File | null;
  error?: string | null;
  disabled?: boolean;
  onReplace: () => void;
  onRemove: () => void;
}

export function SelectedResumeFile({
  file,
  error,
  disabled = false,
  onReplace,
  onRemove,
}: SelectedResumeFileProps) {
  if (!file) {
    return error ? null : null;
  }

  return (
    <div className="mt-3 rounded-md border-[1.5px] border-hair bg-card p-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded border-[1.5px] border-hair bg-paper-2 text-accent-ink">
          <File size={17} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-ink" title={file.name}>
            {file.name}
          </p>
          <p className="mt-1 text-[11.5px] font-mono text-body">
            {formatBytes(file.size)}
            {file.type ? ` · ${file.type}` : ""}
          </p>
          <p className="mt-1.5 text-[11.5px] text-mute">
            Metadata is shown before parsing; page count appears after the backend reads the PDF.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onReplace}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded border-[1.5px] border-hair bg-card px-2.5 py-1.5 text-[11.5px] font-semibold text-body hover:border-line hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Replace ${file.name}`}
          >
            <RefreshCw size={13} />
            Replace
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded border-[1.5px] border-hair bg-card px-2.5 py-1.5 text-[11.5px] font-semibold text-body hover:border-danger-line hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Remove ${file.name}`}
          >
            <X size={13} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
