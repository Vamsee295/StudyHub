import React, { useState, useEffect } from "react";
import { Folder, Plus } from "lucide-react";
import { SQLWorkspace, SQLFile } from "@/lib/sql/types";
import SQLFileItem from "./SQLFileItem";
import SQLFileContextMenu from "./SQLFileContextMenu";
import SQLDeleteDialog from "./SQLDeleteDialog";

interface Props {
  workspace: SQLWorkspace;
  onOpenFile: (id: string) => void;
  onRenameFile: (id: string, newName: string) => boolean;
  onDeleteFile: (id: string) => void;
  onDuplicateFile: (id: string) => void;
  onCloseFile: (id: string) => void;
  onNewFile?: () => void;
}

export default function SQLFileExplorer({
  workspace,
  onOpenFile,
  onRenameFile,
  onDeleteFile,
  onDuplicateFile,
  onCloseFile,
  onNewFile
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuState, setMenuState] = useState<{
    file: SQLFile;
    position: { x: number; y: number };
  } | null>(null);
  const [deletingFile, setDeletingFile] = useState<SQLFile | null>(null);

  // Open context menu handler
  const handleOpenMenu = (file: SQLFile, position: { x: number; y: number }) => {
    // If clicking the same 3-dot when menu is already open for this file, toggle it closed
    if (menuState?.file.id === file.id && Math.abs(menuState.position.x - position.x) < 20) {
      setMenuState(null);
      return;
    }
    setMenuState({ file, position });
  };

  const handleCloseMenu = () => {
    setMenuState(null);
  };

  // Trigger renaming
  const handleStartRename = (file: SQLFile) => {
    setEditingId(file.id);
    setMenuState(null);
  };

  // Submit renamed file
  const handleRenameSubmit = (id: string, rawName: string) => {
    const trimmed = rawName.trim();
    if (!trimmed) {
      alert("Filename cannot be empty.");
      setEditingId(null);
      return;
    }

    if (/[\\/:"*?<>|]/.test(trimmed)) {
      alert('Filename cannot contain invalid characters: \\ / : * ? " < > |');
      setEditingId(null);
      return;
    }

    let finalName = trimmed;
    if (!finalName.endsWith(".sql")) finalName += ".sql";

    const currentFile = workspace.files[id];
    if (currentFile && finalName !== currentFile.name) {
      const isDuplicate = Object.values(workspace.files).some(
        f => f.name.toLowerCase() === finalName.toLowerCase() && f.folder === currentFile.folder && f.id !== id
      );

      if (isDuplicate) {
        alert(`A file named "${finalName}" already exists in the workspace.`);
        setEditingId(null);
        return;
      }

      onRenameFile(id, finalName);
    }
    setEditingId(null);
  };

  const handleRenameCancel = () => {
    setEditingId(null);
  };

  // Trigger delete dialog
  const handleStartDelete = (file: SQLFile) => {
    setDeletingFile(file);
    setMenuState(null);
  };

  const handleConfirmDelete = (fileId: string) => {
    onDeleteFile(fileId);
    setDeletingFile(null);
  };

  // Keyboard Shortcuts (F2: Rename, Ctrl/Cmd+D: Duplicate, Delete: Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const activeFileId = workspace.activeFileId;
      if (!activeFileId || !workspace.files[activeFileId]) return;
      const activeFile = workspace.files[activeFileId];

      if (e.key === "F2") {
        e.preventDefault();
        handleStartRename(activeFile);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        onDuplicateFile(activeFile.id);
      } else if (e.key === "Delete") {
        e.preventDefault();
        handleStartDelete(activeFile);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [workspace.activeFileId, workspace.files, onDuplicateFile]);

  return (
    <div className="flex flex-col flex-1 bg-[var(--surface)] border-b border-[var(--border)] overflow-hidden">
      {/* Explorer Header */}
      <div className="h-10 flex shrink-0 items-center justify-between px-4 border-b border-[var(--border)]">
        <span className="text-xs font-semibold text-[var(--ink-secondary)] uppercase tracking-wider flex items-center gap-2">
          <Folder className="w-3.5 h-3.5" /> Workspace
        </span>

        {onNewFile && (
          <button
            type="button"
            onClick={onNewFile}
            className="p-1 rounded text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] transition-colors cursor-pointer"
            title="New SQL File"
            aria-label="New SQL File"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto py-2">
        {Object.values(workspace.files).map(file => {
          const isActive = file.id === workspace.activeFileId;
          const isRenaming = file.id === editingId;
          const isMenuOpen = menuState?.file.id === file.id;

          return (
            <SQLFileItem
              key={file.id}
              file={file}
              isActive={isActive}
              isRenaming={isRenaming}
              isMenuOpen={isMenuOpen}
              onSelect={onOpenFile}
              onOpenMenu={handleOpenMenu}
              onRenameSubmit={handleRenameSubmit}
              onRenameCancel={handleRenameCancel}
            />
          );
        })}
      </div>

      {/* Unified Context Menu (Desktop, Touch Long-Press, 3-Dot) */}
      <SQLFileContextMenu
        file={menuState?.file || null}
        isOpen={!!menuState}
        position={menuState?.position || null}
        isTabOpen={menuState ? workspace.openTabIds.includes(menuState.file.id) : false}
        onRename={handleStartRename}
        onDuplicate={(file) => onDuplicateFile(file.id)}
        onCloseTab={(file) => onCloseFile(file.id)}
        onDelete={handleStartDelete}
        onClose={handleCloseMenu}
      />

      {/* Accessible Confirmation Deletion Dialog */}
      <SQLDeleteDialog
        file={deletingFile}
        isOpen={!!deletingFile}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingFile(null)}
      />
    </div>
  );
}
