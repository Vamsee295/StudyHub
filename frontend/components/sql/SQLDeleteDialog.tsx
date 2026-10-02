import React, { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { SQLFile } from "@/lib/sql/types";

interface Props {
  file: SQLFile | null;
  isOpen: boolean;
  onConfirm: (fileId: string) => void;
  onCancel: () => void;
}

export default function SQLDeleteDialog({
  file,
  isOpen,
  onConfirm,
  onCancel
}: Props) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) {
      confirmBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen || !file) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div 
        className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl max-w-sm w-full p-5 animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="delete-dialog-title" className="text-sm font-semibold text-[var(--ink)] truncate">
              Delete &ldquo;{file.name}&rdquo;?
            </h3>
            <p id="delete-dialog-desc" className="text-xs text-[var(--ink-secondary)] mt-1.5 leading-relaxed">
              This will permanently remove the file from your SQL workspace. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-medium text-[var(--ink)] bg-[var(--surface-subdued)] hover:bg-[var(--border)] rounded-lg transition-colors cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            onClick={() => onConfirm(file.id)}
          >
            Delete File
          </button>
        </div>
      </div>
    </div>
  );
}
