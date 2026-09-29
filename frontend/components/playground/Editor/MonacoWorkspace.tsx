"use client";

import React, { useRef, useMemo } from "react";
import Editor from "@monaco-editor/react";
import type { ProjectFile } from "@/types/playground";

interface MonacoWorkspaceProps {
  files: ProjectFile[];
  activeFileId: string | null;
  onContentChange: (fileId: string, content: string) => void;
}

export default function MonacoWorkspace({
  files,
  activeFileId,
  onContentChange,
}: MonacoWorkspaceProps) {
  const activeFile = useMemo(
    () => files.find((f) => f.id === activeFileId) ?? null,
    [files, activeFileId]
  );

  const activeFileRef = useRef<ProjectFile | null>(activeFile);
  activeFileRef.current = activeFile;

  const onContentChangeRef = useRef(onContentChange);
  onContentChangeRef.current = onContentChange;

  const handleChange = (value: string | undefined) => {
    if (value !== undefined && activeFileRef.current) {
      onContentChangeRef.current(activeFileRef.current.id, value);
    }
  };

  if (!activeFile) {
    return (
      <div className="ide-editor-welcome">
        <div className="ide-editor-welcome-inner">
          <p>No file selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ide-monaco-container" style={{ width: "100%", height: "100%" }}>
      <Editor
        key={activeFile.id}
        path={activeFile.path}
        defaultLanguage={activeFile.language}
        language={activeFile.language}
        defaultValue={activeFile.content}
        value={activeFile.content}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          lineNumbers: "on",
          renderLineHighlight: "gutter",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          bracketPairColorization: { enabled: true },
          formatOnPaste: true,
        }}
        loading={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#888",
              background: "#1e1e1e",
              fontSize: "13px",
            }}
          >
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
