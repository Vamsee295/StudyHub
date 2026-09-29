"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Database, Play, RotateCcw, Table2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

const DEFAULT_QUERY = `-- StudyHub SQL Lab
-- Practice your SQL queries here

SELECT department, COUNT(*) as count
FROM employees
GROUP BY department
ORDER BY count DESC;`;

// Mock schema for UI
const SCHEMA = [
  {
    name: "employees",
    columns: [
      { name: "id", type: "INT", isPrimary: true },
      { name: "name", type: "VARCHAR" },
      { name: "department", type: "VARCHAR" },
      { name: "salary", type: "INT" },
      { name: "hire_date", type: "DATE" }
    ]
  },
  {
    name: "departments",
    columns: [
      { name: "id", type: "INT", isPrimary: true },
      { name: "name", type: "VARCHAR" },
      { name: "budget", type: "INT" }
    ]
  }
];

// Mock execution result
const MOCK_RESULT = {
  columns: ["department", "count"],
  rows: [
    ["Engineering", 42],
    ["Sales", 27],
    ["HR", 12],
    ["Marketing", 8]
  ],
  executionTime: 4.2
};

export default function SQLLabPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [isRunning, setIsRunning] = useState(false);
  
  const [result, setResult] = useState<{columns: string[], rows: any[][], executionTime: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runQuery = () => {
    setIsRunning(true);
    setError(null);
    
    // Simulate execution delay
    setTimeout(() => {
      setIsRunning(false);
      // Very basic mock check
      if (query.toLowerCase().includes("select")) {
        setResult(MOCK_RESULT);
      } else {
        setError("Execution Error: near '"+ query.split(' ')[0] +"': syntax error (Mock engine only supports SELECT right now)");
        setResult(null);
      }
    }, 600);
  };

  const clearQuery = () => {
    setQuery("");
  };

  const resetDatabase = () => {
    setQuery(DEFAULT_QUERY);
    setResult(null);
    setError(null);
  };

  if (!mounted) return <div className="p-8 text-[var(--ink-secondary)]">Loading SQL Lab...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[var(--surface-subdued)]">
      {/* Toolbar */}
      <div className="h-14 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/practice" className="text-[var(--ink-secondary)] hover:text-[var(--ink)] font-medium text-sm flex items-center gap-2">
            Practice
          </Link>
          <span className="text-[var(--border-strong)]">/</span>
          <div className="flex items-center gap-2 text-[var(--ink)] font-bold text-sm">
            <Database className="w-4 h-4 text-emerald-600" /> SQL Lab
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={resetDatabase} className="btn-secondary text-xs h-8 px-3 flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" /> Reset DB
          </button>
          <button onClick={runQuery} disabled={isRunning || !query.trim()} className="btn-primary text-xs h-8 px-4 flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
            {isRunning ? (
               <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Run Query
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Schema Explorer */}
        <div className="w-64 border-r border-[var(--border)] bg-[var(--surface)] hidden md:flex flex-col shrink-0">
          <div className="h-10 border-b border-[var(--border)] flex items-center px-4">
            <span className="text-xs font-semibold text-[var(--ink-secondary)] uppercase tracking-wider flex items-center gap-2">
              <Database className="w-3.5 h-3.5" /> Schema
            </span>
          </div>
          <div className="flex-1 overflow-auto p-3">
            {SCHEMA.map(table => (
              <div key={table.name} className="mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)] mb-2 px-1">
                  <Table2 className="w-4 h-4 text-emerald-500" /> {table.name}
                </div>
                <div className="flex flex-col gap-1 pl-6">
                  {table.columns.map(col => (
                    <div key={col.name} className="flex items-center justify-between text-xs group">
                      <span className={`\${col.isPrimary ? "font-semibold text-[var(--ink)]" : "text-[var(--ink-secondary)]"}`}>
                        {col.name}
                      </span>
                      <span className="text-[10px] text-[var(--ink-tertiary)] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        {col.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Editor & Results */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Editor */}
          <div className="flex-1 border-b border-[var(--border)] relative flex flex-col">
            <div className="h-10 bg-[#1e1e1e] flex items-center justify-between px-4 shrink-0">
              <div className="text-xs font-mono text-gray-400">query.sql</div>
              <button onClick={clearQuery} className="text-gray-400 hover:text-white transition-colors" title="Clear Editor">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 bg-[#1e1e1e]">
              <Editor
                height="100%"
                language="sql"
                theme="vs-dark"
                value={query}
                onChange={(val) => setQuery(val || "")}
                options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: "on", padding: { top: 16 } }}
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="h-64 bg-[var(--surface)] flex flex-col shrink-0">
            <div className="h-10 border-b border-[var(--border)] flex items-center justify-between px-4 bg-[var(--surface-subdued)]">
              <span className="text-xs font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Results</span>
              {result && (
                <span className="text-xs text-[var(--ink-tertiary)]">
                  {result.rows.length} rows • {result.executionTime}ms
                </span>
              )}
            </div>
            <div className="flex-1 overflow-auto p-0">
              {error ? (
                <div className="p-4 text-sm text-red-600 font-mono bg-red-50/50 h-full">
                  {error}
                </div>
              ) : result ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-[var(--surface-subdued)] sticky top-0 shadow-sm">
                    <tr>
                      {result.columns.map(col => (
                        <th key={col} className="px-4 py-2 font-semibold text-[var(--ink-secondary)] border-b border-[var(--border)]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--surface-subdued)]/50 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 text-[var(--ink)]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-[var(--ink-tertiary)] text-sm flex flex-col items-center justify-center h-full">
                  <Database className="w-8 h-8 mb-2 opacity-20" />
                  Run a query to see results
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
