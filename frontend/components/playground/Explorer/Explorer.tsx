"use client";

import React from "react";
import type { TreeNode, ContextMenuState, ContextMenuTarget } from "@/types/playground";
import FileTree from "./FileTree";

interface ExplorerProps {
  projectName: string;
  nodes: TreeNode[];
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onNewFile: (folderPath?: string) => void;
  onNewFolder: (parentPath?: string) => void;
  onContextMenu: (e: React.MouseEvent, target: ContextMenuTarget) => void;
  onRootContextMenu: (e: React.MouseEvent) => void;
}

export default function Explorer({
  projectName,
  nodes,
  activeFileId,
  onSelectFile,
  onNewFile,
  onNewFolder,
  onContextMenu,
  onRootContextMenu,
}: ExplorerProps) {
  return (
    <div className="ide-explorer">
      {/* Header */}
      <div className="ide-explorer-header">
        <span className="ide-explorer-title">EXPLORER</span>
      </div>

      {/* Project label */}
      <div className="ide-explorer-project-header" onContextMenu={onRootContextMenu}>
        <span className="ide-explorer-project-icon">📁</span>
        <span className="ide-explorer-project-name">{projectName.toUpperCase()}</span>
      </div>

      {/* File tree */}
      <div className="ide-explorer-tree">
        <FileTree
          nodes={nodes}
          activeFileId={activeFileId}
          onSelectFile={onSelectFile}
          onContextMenu={onContextMenu}
        />
      </div>

      {/* Bottom actions */}
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
