"use client";

import React from "react";
import type { ProjectFile, EditorTab } from "@/types/playground";

interface EditorTabsProps {
  tabs: EditorTab[];
  files: ProjectFile[];
  activeFileId: string | null;
  onSelect: (fileId: string) => void;
  onClose: (fileId: string) => void;
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const icons: Record<string, string> = {
    html: "🌐",
    css: "🎨",
    js: "📜",
    ts: "📘",
    json: "📋",
    md: "📝",
    svg: "🖼️",
    txt: "📄",
  };
  return icons[ext] ?? "📄";
}

export default function EditorTabs({
  tabs,
  files,
  activeFileId,
  onSelect,
  onClose,
}: EditorTabsProps) {
  if (tabs.length === 0) {
    return (
      <div className="ide-tabs-empty">
        <span>Open a file from the Explorer</span>
      </div>
    );
  }

  return (
    <div className="ide-tabs">
      {tabs.map(({ fileId, isDirty }) => {
        const file = files.find((f) => f.id === fileId);
        if (!file) return null;
        const isActive = fileId === activeFileId;

        return (
          <div
            key={fileId}
            className={`ide-tab ${isActive ? "ide-tab-active" : ""}`}
            onClick={() => onSelect(fileId)}
            title={file.path}
          >
            <span className="ide-tab-icon">{getFileIcon(file.name)}</span>
            <span className="ide-tab-name">{file.name}</span>
            {isDirty && <span className="ide-tab-dirty" title="Unsaved changes">●</span>}
            <button
              className="ide-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onClose(fileId);
              }}
              title="Close tab"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
