import React from "react";
import { Database } from "lucide-react";
import { SQLResult, SQLExecutionResult } from "@/lib/sql/types";

interface Props {
  result: SQLExecutionResult | null;
  isRunning: boolean;
}

export default function SQLResults({ result, isRunning }: Props) {
  if (isRunning) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[var(--ink-tertiary)] p-8">
        <span className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--ink)] rounded-full animate-spin mb-3"></span>
        <span className="text-sm">Executing query...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[var(--ink-tertiary)] text-sm">
        <Database className="w-8 h-8 mb-2 opacity-20" />
        Run a query to see results
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="flex-1 overflow-auto bg-red-50/50 dark:bg-red-950/10 p-4 font-mono text-sm">
        <div className="text-red-600 font-semibold mb-1">SQL Error</div>
        <div className="text-red-500 whitespace-pre-wrap">{result.error}</div>
      </div>
    );
  }

  const hasResults = result.results.length > 0;

  return (
    <div className="flex-1 overflow-auto bg-[var(--surface)]">
      {hasResults ? (
        result.results.map((res, i) => (
          <div key={i} className="mb-6">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--surface-subdued)] sticky top-0 shadow-sm z-10">
                <tr>
                  {res.columns.map((col, j) => (
                    <th key={j} className="px-4 py-2 font-semibold text-[var(--ink-secondary)] border-b border-[var(--border)] whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {res.values.length === 0 ? (
                  <tr>
                    <td colSpan={res.columns.length} className="px-4 py-4 text-center text-[var(--ink-tertiary)]">
                      0 rows returned
                    </td>
                  </tr>
                ) : (
                  res.values.map((row, r) => (
                    <tr key={r} className="border-b border-[var(--border)] hover:bg-[var(--surface-subdued)]/50 transition-colors">
                      {row.map((cell, c) => (
                        <td key={c} className="px-4 py-1.5 text-[var(--ink)] whitespace-nowrap max-w-xs truncate" title={cell?.toString() || ""}>
                          {cell === null ? (
                            <span className="text-[var(--ink-tertiary)] italic">NULL</span>
                          ) : (
                            String(cell)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <div className="p-4 text-sm text-[var(--ink-secondary)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-500 font-bold">✓</span> Query executed successfully.
          </div>
          {result.rowsModified > 0 && (
            <div>Rows affected: {result.rowsModified}</div>
          )}
        </div>
      )}
    </div>
  );
}
