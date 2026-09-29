"use client";

import React from "react";
import type { ConsoleMessage, ProblemEntry, BottomPanelTab } from "@/types/playground";

interface BottomPanelProps {
  activeTab: BottomPanelTab;
  onTabChange: (tab: BottomPanelTab) => void;
  messages: ConsoleMessage[];
  problems: ProblemEntry[];
  onClearConsole: () => void;
  onJumpToError?: (problem: ProblemEntry) => void;
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

export default function BottomPanel({
  activeTab,
  onTabChange,
  messages,
  problems,
  onClearConsole,
  onJumpToError,
}: BottomPanelProps) {
  const errorCount = problems.filter((p) => p.severity === "error").length;
  const warnCount = problems.filter((p) => p.severity === "warning").length;

  return (
    <div className="ide-bottom-panel">
      {/* Tab bar */}
      <div className="ide-bottom-tabs">
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
          className={`ide-bottom-tab ${activeTab === "output" ? "active" : ""}`}
          onClick={() => onTabChange("output")}
        >
          OUTPUT
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

        <div className="ide-bottom-tabs-spacer" />
        {activeTab === "console" && (
          <button className="ide-bottom-action" onClick={onClearConsole} title="Clear console">
            🗑 Clear
          </button>
        )}
      </div>

      {/* Content */}
      <div className="ide-bottom-content">
        {activeTab === "console" && (
          <div className="ide-console">
            {messages.length === 0 ? (
              <div className="ide-console-empty">Console is empty. Run code to see output.</div>
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
                  <span className="ide-console-message">{msg.message}</span>
                  {msg.lineNumber && (
                    <span className="ide-console-source">:{msg.lineNumber}</span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

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
                  title="Click to navigate to error"
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

        {activeTab === "output" && (
          <div className="ide-console">
            <div className="ide-console-empty">
              Build output appears here after running the project.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
