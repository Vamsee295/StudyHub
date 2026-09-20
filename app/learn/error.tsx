"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function LearnError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in a real app
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-5">
      <div className="w-14 h-14 rounded-full bg-[var(--error-soft)] border border-[var(--error-soft-border)] flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-[var(--error)]" />
      </div>
      
      <div className="flex flex-col items-center gap-2 text-center max-w-md">
        <h2 className="text-xl font-bold text-[var(--ink)]">Something went wrong</h2>
        <p className="text-[14px] text-[var(--ink-secondary)] leading-relaxed">
          We encountered an issue loading the learning content. Please try again or navigate back to the dashboard.
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="mt-2 inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--ink)] text-[var(--ink)] px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
