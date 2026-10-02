import React, { useState, useEffect, useRef } from "react";
import { FileCode2, MoreVertical } from "lucide-react";
import { SQLFile } from "@/lib/sql/types";
import { useLongPress } from "./useLongPress";

interface Props {
  file: SQLFile;
  isActive: boolean;
  isRenaming: boolean;
  isMenuOpen: boolean;
  onSelect: (id: string) => void;
  onOpenMenu: (file: SQLFile, position: { x: number; y: number }) => void;
  onRenameSubmit: (id: string, newName: string) => void;
  onRenameCancel: () => void;
}

export default function SQLFileItem({
  file,
  isActive,
  isRenaming,
  isMenuOpen,
  onSelect,
  onOpenMenu,
  onRenameSubmit,
  onRenameCancel
}: Props) {
  const [editName, setEditName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const threeDotBtnRef = useRef<HTMLButtonElement>(null);

  // Sync editName when entering rename mode
  useEffect(() => {
    if (isRenaming) {
      setEditName(file.name.replace(/\.sql$/, ""));
    }
  }, [isRenaming, file.name]);

  // Focus and select input text when entering rename mode
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  // Long press handler for touch/mobile
  const longPressHandlers = useLongPress({
    onLongPress: (pos) => {
      onOpenMenu(file, pos);
    },
    onClick: () => {
      if (!isRenaming) {
        onSelect(file.id);
      }
    },
    delay: 500
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenMenu(file, { x: e.clientX, y: e.clientY });
  };

  const handleThreeDotClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (threeDotBtnRef.current) {
      const rect = threeDotBtnRef.current.getBoundingClientRect();
      onOpenMenu(file, {
        x: rect.right - 170,
        y: rect.bottom + 4
      });
    } else {
      onOpenMenu(file, { x: e.clientX, y: e.clientY });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onRenameSubmit(file.id, editName);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onRenameCancel();
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-3 py-1.5 cursor-pointer group transition-colors select-none ${
        isActive
          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
          : "text-[var(--ink)] hover:bg-[var(--surface-subdued)]"
      }`}
      onContextMenu={handleContextMenu}
      {...longPressHandlers}
    >
      <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2 min-w-0">
        <FileCode2
          className={`w-4 h-4 shrink-0 ${
            isActive ? "text-blue-500" : "text-[var(--ink-secondary)]"
          }`}
        />

        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={() => onRenameSubmit(file.id, editName)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-[var(--surface)] border border-blue-500 rounded px-1.5 py-0.5 text-xs text-[var(--ink)] outline-hidden w-full min-w-0 shadow-xs"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-sm truncate select-none">
            {file.name}
          </span>
        )}
      </div>

      {!isRenaming && (
        <button
          ref={threeDotBtnRef}
          type="button"
          aria-label={`Options for ${file.name}`}
          className={`p-1 rounded text-[var(--ink-tertiary)] hover:text-[var(--ink)] hover:bg-[var(--border)] transition-all cursor-pointer ${
            isMenuOpen
              ? "opacity-100 bg-[var(--border)] text-[var(--ink)]"
              : "opacity-0 group-hover:opacity-100 focus:opacity-100 md:opacity-0 md:group-hover:opacity-100 opacity-80"
          }`}
          onClick={handleThreeDotClick}
          onContextMenu={handleContextMenu}
        >
          <MoreVertical className="w-3.5 h-3.5 pointer-events-none" />
        </button>
      )}
    </div>
  );
}
