"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Database, CheckCircle2, AlertCircle, Loader2, RotateCcw, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { SqlEditor } from "@/components/tools/sql/SqlEditor";
import { SqlSchemaSidebar } from "@/components/tools/sql/SqlSchemaSidebar";
import { SqlResultsPanel } from "@/components/tools/sql/SqlResultsPanel";
import {
  databaseManager,
  DatabaseTable,
  QueryExecutionResult,
  QueryHistoryItem,
} from "@/lib/services/tools/sqlService";

const DEFAULT_QUERY = `-- Welcome to StudyHub SQL Playground!
-- Write any SQL and press Run (Ctrl+Enter / ⌘+Enter)

SELECT * FROM employees;`;

const EXAMPLE_QUERIES: { label: string; sql: string }[] = [
  { label: "SELECT *",       sql: "SELECT * FROM employees;" },
  { label: "WHERE",          sql: "SELECT * FROM employees WHERE salary > 90000;" },
  { label: "ORDER BY",       sql: "SELECT * FROM students ORDER BY gpa DESC;" },
  { label: "GROUP BY",       sql: "SELECT branch, COUNT(*) AS count FROM students GROUP BY branch;" },
  { label: "JOIN",           sql: "SELECT e.first_name, e.last_name, d.name AS department\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nORDER BY d.name;" },
  { label: "INSERT",         sql: "INSERT INTO students (name, email, branch, gpa, graduation_year, placement_status)\nVALUES ('Raj Patel', 'raj@uni.edu', 'Computer Science', 8.9, 2025, 'Unplaced');" },
  { label: "UPDATE",         sql: "UPDATE employees SET salary = salary * 1.10 WHERE department_id = 1;" },
  { label: "DELETE",         sql: "DELETE FROM students WHERE placement_status = 'Unplaced' AND graduation_year < 2024;" },
  { label: "CREATE TABLE",   sql: "CREATE TABLE projects (\n  id        INTEGER PRIMARY KEY AUTOINCREMENT,\n  name      TEXT    NOT NULL,\n  budget    REAL,\n  lead_id   INTEGER REFERENCES employees(id)\n);" },
];

type DbStatus = "initializing" | "ready" | "error";

export default function SqlPlaygroundPage() {
  const [dbStatus, setDbStatus]       = useState<DbStatus>("initializing");
  const [schema, setSchema]           = useState<DatabaseTable[]>([]);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [query, setQuery]             = useState(DEFAULT_QUERY);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult]           = useState<QueryExecutionResult | null>(null);
  const [history, setHistory]         = useState<QueryHistoryItem[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  // ── Initialize DB ──────────────────────────────────────────────────────────
  useEffect(() => {
    databaseManager
      .init()
      .then(() => {
        setDbStatus("ready");
        refreshSchema();
      })
      .catch(() => setDbStatus("error"));
  }, []);

  const refreshSchema = useCallback(async () => {
    setSchemaLoading(true);
    try {
      const tables = await databaseManager.getSchema();
      setSchema(tables);
    } finally {
      setSchemaLoading(false);
    }
  }, []);

  // ── Execute Query ──────────────────────────────────────────────────────────
  const handleExecute = useCallback(async (sql: string) => {
    if (!sql.trim() || isExecuting) return;
    setIsExecuting(true);

    const res = await databaseManager.execute(sql);
    setResult(res);
    setIsExecuting(false);

    // Append to history
    const histItem: QueryHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      sql,
      executedAt: new Date(),
      success: res.success,
      executionTimeMs: res.executionTimeMs,
      rowCount: res.resultSets?.[0]?.rows.length,
    };
    setHistory((prev) => [histItem, ...prev].slice(0, 50));

    // Refresh schema after DDL statements
    const upper = sql.trim().toUpperCase();
    if (
      upper.startsWith("CREATE") ||
      upper.startsWith("DROP") ||
      upper.startsWith("ALTER")
    ) {
      await refreshSchema();
    }
  }, [isExecuting, refreshSchema]);

  // ── Reset DB ───────────────────────────────────────────────────────────────
  const handleReset = useCallback(async () => {
    setShowResetConfirm(false);
    setDbStatus("initializing");
    await databaseManager.reset();
    setDbStatus("ready");
    setResult(null);
    await refreshSchema();
  }, [refreshSchema]);

  // ── Schema table click → insert SELECT ───────────────────────────────────
  const handleTableClick = useCallback((tableName: string) => {
    setQuery(`SELECT * FROM ${tableName};`);
  }, []);

  // ── Load history item back into editor ────────────────────────────────────
  const handleSelectHistory = useCallback((sql: string) => {
    setQuery(sql);
  }, []);

  // ── Status indicator ──────────────────────────────────────────────────────
  const statusEl =
    dbStatus === "initializing" ? (
      <span className="flex items-center gap-1.5 text-amber-600 text-[12px] font-medium">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Initializing SQL Playground…
      </span>
    ) : dbStatus === "ready" ? (
      <span className="flex items-center gap-1.5 text-green-600 text-[12px] font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Database Ready
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-red-500 text-[12px] font-medium">
        <AlertCircle className="w-3.5 h-3.5" />
        Database Error — Try refreshing the page
      </span>
    );

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 pt-8 pb-4">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--ink-secondary)] hover:text-[var(--accent)] mb-5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] flex items-center justify-center text-[var(--accent)]">
                <Database className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--ink)]">SQL Playground</h1>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft-border)]">
                Interactive Database
              </span>
            </div>
            <p className="text-[13px] text-[var(--ink-secondary)] max-w-lg">
              Write and execute SQL queries in a safe browser-based database environment. All data is local to your browser.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {statusEl}

            {/* Examples dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExamples((s) => !s)}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50 text-[var(--ink)] transition-colors"
              >
                Examples ▾
              </button>
              {showExamples && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 w-52">
                  {EXAMPLE_QUERIES.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => {
                        setQuery(ex.sql);
                        setShowExamples(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[12px] text-[var(--ink)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors font-mono"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3-Panel IDE ────────────────────────────────────────────── */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 md:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[22%_1fr_25%] gap-4 h-[calc(100vh-220px)] min-h-[500px]">
          {/* LEFT — Schema */}
          <div className="hidden lg:flex flex-col min-h-0">
            <SqlSchemaSidebar
              tables={schema}
              isLoading={schemaLoading}
              onTableClick={handleTableClick}
              onRefresh={refreshSchema}
            />
          </div>

          {/* CENTER — Editor */}
          <div className="flex flex-col min-h-0">
            <SqlEditor
              value={query}
              onChange={setQuery}
              onExecute={handleExecute}
              onClear={() => setQuery("")}
              onReset={() => setShowResetConfirm(true)}
              isExecuting={isExecuting}
            />
          </div>

          {/* RIGHT — Results */}
          <div className="flex flex-col min-h-0">
            <SqlResultsPanel
              result={result}
              history={history}
              isLoading={isExecuting}
              onSelectHistory={handleSelectHistory}
            />
          </div>
        </div>

        {/* Mobile: Schema (collapsed below editor on small screens) */}
        <div className="lg:hidden mt-4">
          <SqlSchemaSidebar
            tables={schema}
            isLoading={schemaLoading}
            onTableClick={handleTableClick}
            onRefresh={refreshSchema}
          />
        </div>
      </div>

      {/* ─── Reset Confirmation Dialog ───────────────────────────────── */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--ink)] text-[15px]">Reset Database?</h3>
                <p className="text-[12px] text-[var(--ink-secondary)]">This cannot be undone</p>
              </div>
            </div>
            <p className="text-[13px] text-[var(--ink-secondary)] mb-5">
              All tables you created and any data changes will be permanently removed. The original sample database (employees, students, courses, departments) will be restored.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-[var(--ink)] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
