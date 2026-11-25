"use client";

import React, { useCallback, useRef } from "react";
import { Play, RotateCcw, AlignLeft, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { MONACO_THEME, defineMonacoTheme } from "@/lib/monacoTheme";

// Monaco editor loaded dynamically to avoid SSR issues
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  { ssr: false, loading: () => <EditorFallback /> }
);

function EditorFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1E1E1E]">
      <div className="flex items-center gap-2 text-mute text-sm">
        <span className="inline-block w-3 h-3 rounded-full border-2 border-line border-t-transparent animate-spin" />
        Loading editor…
      </div>
    </div>
  );
}

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: (sql: string) => void;
  onClear: () => void;
  onReset: () => void;
  isExecuting: boolean;
}

export function SqlEditor({
  value,
  onChange,
  onExecute,
  onClear,
  onReset,
  isExecuting,
}: SqlEditorProps) {
  const editorRef = useRef<unknown>(null);

  const handleEditorMount = useCallback((editor: unknown) => {
    editorRef.current = editor;

    // Disable Ctrl+S default browser save
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = editor as any;
    e.addCommand(
      // Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyS
      2048 | 49,
      () => {
        // no-op — prevent browser save dialog
      }
    );
    // Ctrl/Cmd+Enter to run
    e.addCommand(2048 | 3, () => {
      const currentVal = e.getValue() as string;
      if (currentVal.trim()) onExecute(currentVal);
    });

    // Focus the editor on mount
    e.focus();
  }, [onExecute]);

  const handleFormat = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = editorRef.current as any;
    if (e) {
      e.getAction("editor.action.formatDocument")?.run();
    }
  };

  const handleRun = () => {
    if (value.trim() && !isExecuting) {
      onExecute(value);
    }
  };

  return (
    <div className="bg-card rounded-2xl border-[1.5px] border-hair flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-hair bg-paper-2/60 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-danger" />
            <div className="w-3 h-3 rounded-full bg-gold" />
            <div className="w-3 h-3 rounded-full bg-note" />
          </div>
          <span className="text-xs font-medium text-mute ml-2 font-mono">query.sql</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFormat}
            title="Format SQL"
            className="p-1.5 text-mute hover:text-body hover:bg-card-2 rounded-md transition-colors"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClear}
            title="Clear Editor"
            className="p-1.5 text-mute hover:text-body hover:bg-card-2 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onReset}
            title="Reset Database"
            className="p-1.5 text-mute hover:text-warning hover:bg-warning-soft rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-ink/10 mx-0.5" />
          <button
            onClick={handleRun}
            disabled={isExecuting || !value.trim()}
            aria-label="Run query"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all",
              value.trim() && !isExecuting
                ? "bg-accent text-paper hover:bg-accent-ink"
                : "bg-card-2 text-mute cursor-not-allowed"
            )}
          >
            {isExecuting ? (
              <span className="w-3.5 h-3.5 border-2 border-card border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Run</span>
            <span className="hidden sm:inline text-[10px] opacity-60 ml-0.5">⌘↵</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          defaultLanguage="sql"
          theme={MONACO_THEME}
          beforeMount={defineMonacoTheme}
          value={value}
          onChange={(val) => onChange(val ?? "")}
          onMount={handleEditorMount}
          options={{
            fontSize: 14,
            fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
            fontLigatures: true,
            lineNumbers: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: "all",
            matchBrackets: "always",
            autoClosingBrackets: "always",
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            folding: true,
          }}
        />
      </div>
    </div>
  );
}
