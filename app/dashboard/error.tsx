"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm max-w-lg mx-auto my-12">
      <div className="w-12 h-12 rounded-full bg-[var(--error-soft)] text-[var(--error)] flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-newsreader font-semibold text-[var(--ink)] mb-2">
        Unable to load dashboard
      </h2>
      <p className="text-sm text-[var(--ink-secondary)] mb-6 max-w-md">
        An error occurred while rendering your preparation workspace. You can try refreshing the data.
      </p>
      <button
        onClick={() => reset()}
        className="btn-primary inline-flex items-center gap-2 text-sm"
      >
        <RotateCcw className="w-4 h-4" />
        Retry Dashboard
      </button>
    </div>
  );
}
