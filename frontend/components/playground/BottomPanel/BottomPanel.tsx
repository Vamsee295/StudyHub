"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type {
  ConsoleMessage,
  ProblemEntry,
  BottomPanelTab,
  CodeExecResult,
  ProjectFile,
} from "@/types/playground";

interface BottomPanelProps {
  activeTab: BottomPanelTab;
  onTabChange: (tab: BottomPanelTab) => void;
  messages: ConsoleMessage[];
  problems: ProblemEntry[];
  onClearConsole: () => void;
  onJumpToError?: (problem: ProblemEntry) => void;
  // Code IDE specific (optional — backward compatible with WebIDE)
  execResult?: CodeExecResult | null;
  isRunning?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  projectFiles?: ProjectFile[];
  projectName?: string;
}

const LEVEL_COLORS: Record<string, string> = {
  log: "#d1fae5",
  info: "#bfdbfe",
  warn: "#fef3c7",
  error: "#fee2e2",
};

const LEVEL_ICONS: Record<string, string> = {
  log: "›",
  info: "ℹ",
  warn: "⚠",
  error: "✕",
};

function StatusPill({ status }: { status: CodeExecResult["status"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    accepted: { label: "✓ Accepted", cls: "code-status-accepted" },
    compile_error: { label: "✕ Compile Error", cls: "code-status-error" },
    runtime_error: { label: "✕ Runtime Error", cls: "code-status-error" },
    timeout: { label: "⏱ Time Limit Exceeded", cls: "code-status-timeout" },
    error: { label: "✕ Error", cls: "code-status-error" },
  };
  const cfg = map[status] ?? { label: status, cls: "code-status-error" };
  return <span className={`code-status-pill ${cfg.cls}`}>{cfg.label}</span>;
}

export default function BottomPanel({
  activeTab,
  onTabChange,
  messages,
  problems,
  onClearConsole,
  onJumpToError,
  execResult,
  isRunning,
  isCollapsed,
  onToggleCollapse,
  projectFiles,
  projectName,
}: BottomPanelProps) {
  const errorCount = problems.filter((p) => p.severity === "error").length;
  const warnCount = problems.filter((p) => p.severity === "warning").length;
  const isCodeIDE = onToggleCollapse !== undefined;

  return (
    <div className="ide-bottom-panel">
      {/* ── Tab bar ─────────────────────────────────────────── */}
      <div className="ide-bottom-tabs">
        <button
          className={`ide-bottom-tab ${activeTab === "output" ? "active" : ""}`}
          onClick={() => onTabChange("output")}
        >
          OUTPUT
          {isRunning && <span className="ide-bottom-tab-spinner" />}
        </button>

        <button
          className={`ide-bottom-tab ${activeTab === "problems" ? "active" : ""}`}
          onClick={() => onTabChange("problems")}
        >
          PROBLEMS
          {errorCount > 0 && (
            <span className="ide-bottom-badge ide-bottom-badge-error">{errorCount}</span>
          )}
          {warnCount > 0 && (
            <span className="ide-bottom-badge ide-bottom-badge-warn">{warnCount}</span>
          )}
        </button>

        <button
          className={`ide-bottom-tab ${activeTab === "console" ? "active" : ""}`}
          onClick={() => onTabChange("console")}
        >
          CONSOLE
          {messages.length > 0 && (
            <span className="ide-bottom-badge">{messages.length}</span>
          )}
        </button>

        {isCodeIDE && (
          <button
            className={`ide-bottom-tab ${activeTab === "terminal" ? "active" : ""}`}
            onClick={() => onTabChange("terminal")}
          >
            TERMINAL
          </button>
        )}

        <div className="ide-bottom-tabs-spacer" />

        {activeTab === "console" && (
          <button className="ide-bottom-action" onClick={onClearConsole} title="Clear console">
            🗑 Clear
          </button>
        )}

        {activeTab === "output" && execResult && (
          <div className="ide-bottom-output-meta">
            <span>{execResult.executionTime}s</span>
            <span>·</span>
            <span>{execResult.memory}</span>
          </div>
        )}

        {onToggleCollapse && (
          <button
            className="ide-bottom-action ide-bottom-collapse-btn"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {isCollapsed ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      {!isCollapsed && (
        <div className="ide-bottom-content">

          {/* OUTPUT */}
          {activeTab === "output" && (
            <div className="ide-console">
              {isRunning && (
                <div className="ide-output-running">
                  <div className="code-ide-spinner-sm" />
                  <span>Executing…</span>
                </div>
              )}

              {!execResult && !isRunning && (
                <div className="ide-console-empty">
                  Output appears here after running your code.<br />
                  <span style={{ fontSize: "11px", opacity: 0.6 }}>Press Ctrl+Enter or click Run Code</span>
                </div>
              )}

              {execResult && !isRunning && (
                <div className="ide-output-content">
                  {/* Status header */}
                  <div className="ide-output-status-row">
                    <StatusPill status={execResult.status} />
                    <span className="ide-output-time">⏱ {execResult.executionTime}s</span>
                    <span className="ide-output-mem">📦 {execResult.memory}</span>
                  </div>

                  {/* Compile error */}
                  {execResult.compileError && (
                    <div className="ide-output-section">
                      <div className="ide-output-section-label error">Compile Error</div>
                      <pre className="ide-output-pre ide-output-pre-error">{execResult.compileError}</pre>
                    </div>
                  )}

                  {/* Stdout */}
                  {execResult.stdout && (
                    <div className="ide-output-section">
                      <div className="ide-output-section-label">Standard Output</div>
                      <pre className="ide-output-pre">{execResult.stdout}</pre>
                    </div>
                  )}

                  {/* Stderr */}
                  {execResult.stderr && !execResult.compileError && (
                    <div className="ide-output-section">
                      <div className="ide-output-section-label error">Standard Error / Traceback</div>
                      <pre className="ide-output-pre ide-output-pre-error">{execResult.stderr}</pre>
                    </div>
                  )}

                  {!execResult.stdout && !execResult.stderr && !execResult.compileError && (
                    <div className="ide-console-empty">No output produced.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PROBLEMS */}
          {activeTab === "problems" && (
            <div className="ide-problems">
              {problems.length === 0 ? (
                <div className="ide-console-empty">✓ No problems detected.</div>
              ) : (
                problems.map((p) => (
                  <div
                    key={p.id}
                    className={`ide-problem-line ide-problem-${p.severity}`}
                    onClick={() => onJumpToError?.(p)}
                    title="Click to navigate"
                  >
                    <span className="ide-problem-icon">
                      {p.severity === "error" ? "✕" : "⚠"}
                    </span>
                    <span className="ide-problem-message">{p.message}</span>
                    {p.filePath && (
                      <span className="ide-problem-file">{p.filePath}</span>
                    )}
                    {p.lineNumber && (
                      <span className="ide-problem-loc">
                        :{p.lineNumber}
                        {p.columnNumber ? `:${p.columnNumber}` : ""}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* CONSOLE */}
          {activeTab === "console" && (
            <div className="ide-console">
              {messages.length === 0 ? (
                <div className="ide-console-empty">Console is empty. Run code to see execution events.</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="ide-console-line"
                    style={{ background: LEVEL_COLORS[msg.level] + "22" }}
                  >
                    <span
                      className="ide-console-level"
                      style={{ color: LEVEL_COLORS[msg.level] }}
                    >
                      {LEVEL_ICONS[msg.level]}
                    </span>
                    <span className="ide-console-timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="ide-console-message">{msg.message}</span>
                    {msg.lineNumber && (
                      <span className="ide-console-source">:{msg.lineNumber}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TERMINAL */}
          {activeTab === "terminal" && (
            <div className="ide-terminal">
              <div className="ide-terminal-header">
                <span className="ide-terminal-prompt">$</span>
                <span className="ide-terminal-cwd">studyhub-ide</span>
                <span className="ide-terminal-note">(read-only project info — code runs in isolated sandbox)</span>
              </div>
              <div className="ide-terminal-body">
                {projectName && (
                  <div className="ide-terminal-row">
                    <span className="ide-terminal-label">Project:</span>
                    <span>{projectName}</span>
                  </div>
                )}
                {projectFiles && projectFiles.length > 0 && (
                  <div className="ide-terminal-row">
                    <span className="ide-terminal-label">Files:</span>
                    <div className="ide-terminal-file-list">
                      {projectFiles.map((f) => (
                        <div key={f.id} className="ide-terminal-file">{f.path}</div>
                      ))}
                    </div>
                  </div>
                )}
                {execResult && (
                  <div className="ide-terminal-row">
                    <span className="ide-terminal-label">Last run:</span>
                    <span className={execResult.status === "accepted" ? "ide-terminal-ok" : "ide-terminal-err"}>
                      {execResult.status} ({execResult.executionTime}s)
                    </span>
                  </div>
                )}
              </div>
              <div className="ide-terminal-cursor">█</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

