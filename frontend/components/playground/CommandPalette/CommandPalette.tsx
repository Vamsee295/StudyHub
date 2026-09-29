"use client";

import React, { useState, useEffect, useRef } from "react";
import type { PaletteCommand } from "@/types/playground";

interface CommandPaletteProps {
  visible: boolean;
  commands: PaletteCommand[];
  files: { id: string; name: string; path: string }[];
  onClose: () => void;
  onSelectFile: (fileId: string) => void;
}

export default function CommandPalette({
  visible,
  commands,
  files,
  onClose,
  onSelectFile,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [visible]);

  const isFileMode = query.startsWith(">");
  const searchQuery = isFileMode ? query.slice(1).trim() : query.trim();

  const filteredFiles = files.filter(
    (f) =>
      !isFileMode &&
      (searchQuery === "" ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.path.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCommands = commands.filter(
    (c) =>
      isFileMode &&
      (searchQuery === "" || c.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const allItems = isFileMode ? filteredCommands : filteredFiles;
  const total = allItems.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (isFileMode) {
        (filteredCommands[selectedIndex] as PaletteCommand)?.action();
        onClose();
      } else {
        const file = filteredFiles[selectedIndex];
        if (file) {
          onSelectFile(file.id);
          onClose();
        }
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div className="ide-palette-backdrop" onClick={onClose}>
      <div className="ide-palette" onClick={(e) => e.stopPropagation()}>
        <div className="ide-palette-hint">
          {isFileMode ? "Type command name" : "Type file name — prefix > for commands"}
        </div>
        <input
          ref={inputRef}
          className="ide-palette-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={isFileMode ? "> Run Code, New File..." : "Search files..."}
          spellCheck={false}
          autoComplete="off"
        />

        <div className="ide-palette-results">
          {!isFileMode &&
            filteredFiles.map((file, i) => (
              <button
                key={file.id}
                className={`ide-palette-item ${i === selectedIndex ? "selected" : ""}`}
                onClick={() => {
                  onSelectFile(file.id);
                  onClose();
                }}
              >
                <span className="ide-palette-item-name">{file.name}</span>
                <span className="ide-palette-item-path">{file.path}</span>
              </button>
            ))}

          {isFileMode &&
            filteredCommands.map((cmd, i) => (
              <button
                key={cmd.id}
                className={`ide-palette-item ${i === selectedIndex ? "selected" : ""}`}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
              >
                <span className="ide-palette-item-name">{cmd.label}</span>
                {cmd.shortcut && (
                  <span className="ide-palette-item-shortcut">{cmd.shortcut}</span>
                )}
              </button>
            ))}

          {total === 0 && (
            <div className="ide-palette-empty">No results</div>
          )}
        </div>
      </div>
    </div>
  );
}
