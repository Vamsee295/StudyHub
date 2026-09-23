"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  History,
  MessageSquare,
  TableProperties,
  ChevronRight,
} from "lucide-react";
import { QueryExecutionResult, QueryHistoryItem } from "@/lib/services/tools/sqlService";
import { cn } from "@/lib/utils";

interface SqlResultsPanelProps {
  result: QueryExecutionResult | null;
  history: QueryHistoryItem[];
  isLoading: boolean;
  onSelectHistory: (sql: string) => void;
}

type Tab = "results" | "messages" | "history";

// ─── Results Table ───────────────────────────────────────────────────────────

function ResultTable({ result }: { result: QueryExecutionResult }) {
  const set = result.resultSets?.[0];

  if (!set || set.rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center px-4">
        <TableProperties className="w-8 h-8 text-gray-300 mb-2" />
        <p className="text-[13px] font-medium text-gray-500">0 rows returned</p>
        <p className="text-[11px] text-gray-400 mt-0.5">The query executed successfully but returned no data.</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full">
      <div className="text-[11px] text-gray-400 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
        <span className="font-semibold text-green-600">{set.rows.length} {set.rows.length === 1 ? "row" : "rows"} returned</span>
        <span>·</span>
        <Clock className="w-3 h-3" />
        <span>{result.executionTimeMs} ms</span>
      </div>
      <table className="w-full text-left text-[12px] border-collapse min-w-max">
        <thead className="sticky top-0 z-10">
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 font-mono font-semibold text-gray-400 text-[11px] tracking-wider select-none w-10 text-right border-r border-gray-200">
              #
            </th>
            {set.columns.map((col) => (
              <th key={col.name} className="px-4 py-2 font-mono font-semibold text-[var(--ink)] text-[11px] tracking-wider whitespace-nowrap border-r border-gray-100 last:border-r-0">
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {set.rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-blue-50/30 transition-colors group">
              <td className="px-4 py-2 font-mono text-gray-300 text-[11px] text-right border-r border-gray-100 select-none">
                {rIdx + 1}
              </td>
              {set.columns.map((col) => {
                const val = row[col.name];
                const isNull = val === null || val === undefined;
                return (
                  <td key={col.name} className="px-4 py-2 font-mono text-[12px] border-r border-gray-100 last:border-r-0 whitespace-nowrap max-w-[200px] truncate">
                    {isNull ? (
                      <span className="text-gray-300 italic text-[11px]">NULL</span>
                    ) : (
                      <span className="text-[var(--ink)]">{String(val)}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Messages Panel ───────────────────────────────────────────────────────────

function MessagesPanel({ result, isLoading }: { result: QueryExecutionResult | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          Executing query…
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10">
        <MessageSquare className="w-8 h-8 text-gray-200 mb-2" />
        <p className="text-[13px] text-gray-400">No query executed yet. Write SQL and press Run.</p>
      </div>
    );
  }

  const isError = !result.success;

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className={cn(
        "rounded-xl p-4 border flex items-start gap-3",
        isError
          ? "bg-red-50 border-red-100"
          : "bg-green-50 border-green-100"
      )}>
        {isError ? (
          <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
        )}
        <div className="flex flex-col gap-1 min-w-0">
          <p className={cn("text-[13px] font-semibold", isError ? "text-red-700" : "text-green-700")}>
            {isError ? "SQL Error" : "Query Successful"}
          </p>
          <p className={cn("text-[12px] font-mono break-words", isError ? "text-red-600" : "text-green-600")}>
            {isError ? result.error?.message : result.message}
          </p>
        </div>
      </div>

      {isError && result.error?.sql && (
        <div className="rounded-lg bg-gray-900 px-4 py-3">
          <p className="text-[11px] text-gray-500 mb-1 uppercase tracking-wider font-semibold">Query</p>
          <pre className="text-red-300 font-mono text-[12px] whitespace-pre-wrap break-all">{result.error.sql}</pre>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {result.executionTimeMs !== undefined && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-[12px] text-gray-600 font-mono">{result.executionTimeMs} ms</span>
          </div>
        )}
        {result.rowsAffected !== undefined && result.type === 'mutation' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100">
            <span className="text-[12px] text-gray-600">{result.rowsAffected} rows affected</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── History Panel ────────────────────────────────────────────────────────────

function HistoryPanel({ history, onSelect }: { history: QueryHistoryItem[]; onSelect: (sql: string) => void }) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10">
        <History className="w-8 h-8 text-gray-200 mb-2" />
        <p className="text-[13px] text-gray-400">No query history yet. Run some SQL to see your session history here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100 overflow-y-auto h-full">
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.sql)}
          aria-label={`Restore query: ${item.sql}`}
          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
        >
          <div className="mt-0.5 shrink-0">
            {item.success ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-red-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <pre className="font-mono text-[11px] text-[var(--ink)] whitespace-pre-wrap break-all line-clamp-2 leading-relaxed">
              {item.sql}
            </pre>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-gray-400">
                {item.executedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="text-[10px] text-gray-300">·</span>
              <span className="text-[10px] text-gray-400 font-mono">{item.executionTimeMs}ms</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[var(--accent)] shrink-0 mt-0.5 transition-colors" />
        </button>
      ))}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function SqlResultsPanel({ result, history, isLoading, onSelectHistory }: SqlResultsPanelProps) {
  const [tab, setTab] = useState<Tab>("results");

  // Auto-switch to results when a SELECT comes in
  React.useEffect(() => {
    if (!result) return;
    if (result.type === "select" && result.success) setTab("results");
    else if (result.type === "error") setTab("messages");
    else if (result.type === "mutation" || result.type === "ddl") setTab("messages");
  }, [result]);

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "results",  label: "Results" },
    { id: "messages", label: "Messages" },
    { id: "history",  label: "History", badge: history.length || undefined },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center border-b border-gray-100 bg-gray-50/60 px-2 py-1 gap-0.5 shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-selected={tab === t.id}
            role="tab"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all",
              tab === t.id
                ? "bg-white text-[var(--accent)] shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            {t.label}
            {t.badge !== undefined && (
              <span className="bg-[var(--accent)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {t.badge > 9 ? "9+" : t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === "results" && (
          <div className="h-full overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  Running…
                </div>
              </div>
            ) : result && result.type === "select" && result.success ? (
              <ResultTable result={result} />
            ) : result && !result.success ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                <XCircle className="w-8 h-8 text-red-400 mb-2" />
                <p className="text-[13px] font-semibold text-red-600">Query Error</p>
                <p className="text-[12px] text-red-500 mt-1 font-mono max-w-xs break-words">{result.error?.message}</p>
              </div>
            ) : result ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                <CheckCircle2 className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-[13px] font-semibold text-green-600">Query Executed</p>
                <p className="text-[12px] text-gray-500 mt-1">{result.message}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10">
                <TableProperties className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-[13px] font-medium text-gray-400">Results will appear here</p>
                <p className="text-[11px] text-gray-300 mt-1">Run a SELECT query to see data</p>
              </div>
            )}
          </div>
        )}

        {tab === "messages" && (
          <MessagesPanel result={result} isLoading={isLoading} />
        )}

        {tab === "history" && (
          <HistoryPanel history={history} onSelect={onSelectHistory} />
        )}
      </div>
    </div>
  );
}
