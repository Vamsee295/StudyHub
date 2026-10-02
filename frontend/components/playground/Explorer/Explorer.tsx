"use client";

import React from "react";
import type { TreeNode, ContextMenuTarget } from "@/types/playground";
import FileTree from "./FileTree";

export interface ExplorerProps {
  projectName: string;
  nodes: TreeNode[];
  activeFileId: string | null;
  openFolders?: Set<string>;
  renamingId?: string | null;
  renamingType?: "file" | "folder" | null;
  onToggleFolder?: (path: string) => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onSelectFile: (fileId: string) => void;
  onNewFile: (folderPath?: string) => void;
  onNewFolder: (parentPath?: string) => void;
  onOpenMenu?: (target: ContextMenuTarget, pos: { x: number; y: number }) => void;
  onContextMenu?: (e: React.MouseEvent, target: ContextMenuTarget) => void;
  onRenameSubmit?: (id: string, type: "file" | "folder", newName: string) => void;
  onRenameCancel?: () => void;
  onMoveItem?: (sourcePath: string, targetFolderPath: string) => void;
  onRootContextMenu: (e: React.MouseEvent) => void;
}

export default function Explorer({
  projectName,
  nodes,
  activeFileId,
  openFolders = new Set(),
  renamingId = null,
  renamingType = null,
  onToggleFolder,
  onExpandAll,
  onCollapseAll,
  onSelectFile,
  onNewFile,
  onNewFolder,
  onOpenMenu,
  onContextMenu,
  onRenameSubmit = () => {},
  onRenameCancel = () => {},
  onMoveItem = () => {},
  onRootContextMenu,
}: ExplorerProps) {
  // Bridge onOpenMenu and onContextMenu
  const handleMenu = (target: ContextMenuTarget, pos: { x: number; y: number }, e?: React.MouseEvent) => {
    if (onOpenMenu) {
      onOpenMenu(target, pos);
    } else if (onContextMenu && e) {
      onContextMenu(e, target);
    }
  };

  return (
    <div className="ide-explorer">
      {/* Header */}
      <div className="ide-explorer-header">
        <span className="ide-explorer-title">EXPLORER</span>
        <div className="ide-explorer-header-actions">
          <button
            type="button"
            className="ide-explorer-icon-action"
            onClick={() => onNewFile()}
            title="New File"
          >
            +📄
          </button>
          <button
            type="button"
            className="ide-explorer-icon-action"
            onClick={() => onNewFolder()}
            title="New Folder"
          >
            +📁
          </button>
          {onCollapseAll && (
            <button
              type="button"
              className="ide-explorer-icon-action"
              onClick={onCollapseAll}
              title="Collapse All Folders"
            >
              ⊟
            </button>
          )}
          {onExpandAll && (
            <button
              type="button"
              className="ide-explorer-icon-action"
              onClick={onExpandAll}
              title="Expand All Folders"
            >
              ⊞
            </button>
          )}
        </div>
      </div>

      {/* Project label */}
      <div
        className="ide-explorer-project-header"
        onContextMenu={onRootContextMenu}
        title={projectName}
      >
        <span className="ide-explorer-project-icon">📁</span>
        <span className="ide-explorer-project-name">{projectName.toUpperCase()}</span>
      </div>

      {/* File tree */}
      <div
        className="ide-explorer-tree"
        onContextMenu={(e) => {
          if ((e.target as HTMLElement).classList.contains("ide-explorer-tree")) {
            onRootContextMenu(e);
          }
        }}
      >
        <FileTree
          nodes={nodes}
          activeFileId={activeFileId}
          openFolders={openFolders}
          renamingId={renamingId}
          renamingType={renamingType}
          onToggleFolder={onToggleFolder}
          onSelectFile={onSelectFile}
          onOpenMenu={handleMenu}
          onRenameSubmit={onRenameSubmit}
          onRenameCancel={onRenameCancel}
          onMoveItem={onMoveItem}
        />
      </div>

      {/* Bottom quick actions */}
      <div className="ide-explorer-actions">
        <button
          className="ide-explorer-action-btn"
          onClick={() => onNewFile()}
          title="New File"
        >
          <span>+</span> New File
        </button>
        <button
          className="ide-explorer-action-btn"
          onClick={() => onNewFolder()}
          title="New Folder"
        >
          <span>+</span> New Folder
        </button>
      </div>
    </div>
  );
}
