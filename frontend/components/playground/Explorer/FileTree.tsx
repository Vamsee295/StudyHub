"use client";

import React, { useState, useRef, useEffect } from "react";
import type { TreeNode, ContextMenuTarget } from "@/types/playground";
import { normalizePath } from "@/lib/services/playground/virtualFileSystem";

// ── File icons ─────────────────────────────────────────────────────────────────

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const icons: Record<string, string> = {
    html: "🌐",
    htm: "🌐",
    css: "🎨",
    js: "📜",
    mjs: "📜",
    jsx: "📜",
    ts: "📘",
    tsx: "📘",
    json: "📋",
    md: "📝",
    markdown: "📝",
    svg: "🖼️",
    png: "🖼️",
    jpg: "🖼️",
    txt: "📄",
  };
  return icons[ext] ?? "📄";
}

// ── Single tree item ───────────────────────────────────────────────────────────

interface TreeItemProps {
  node: TreeNode;
  depth: number;
  activeFileId: string | null;
  openFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onSelectFile: (fileId: string) => void;
  onContextMenu: (e: React.MouseEvent, target: ContextMenuTarget) => void;
}

function TreeItem({
  node,
  depth,
  activeFileId,
  openFolders,
  onToggleFolder,
  onSelectFile,
  onContextMenu,
}: TreeItemProps) {
  const indent = depth * 12;

  if (node.kind === "folder") {
    const isOpen = openFolders.has(node.folder.path);
    return (
      <div>
        <div
          className={`ide-tree-item ide-tree-folder`}
          style={{ paddingLeft: indent + 8 }}
          onClick={() => onToggleFolder(node.folder.path)}
          onContextMenu={(e) =>
            onContextMenu(e, { type: "folder", folderPath: node.folder.path })
          }
          title={node.folder.path}
        >
          <span className="ide-tree-arrow">{isOpen ? "▾" : "▸"}</span>
          <span className="ide-tree-icon">📁</span>
          <span className="ide-tree-name">{node.folder.name}</span>
        </div>
        {isOpen && (
          <div>
            {node.children.map((child) => (
              <TreeItem
                key={
                  child.kind === "file"
                    ? `file-${child.file.path}-${child.file.id}`
                    : `folder-${child.folder.path}-${child.folder.id}`
                }
                node={child}
                depth={depth + 1}
                activeFileId={activeFileId}
                openFolders={openFolders}
                onToggleFolder={onToggleFolder}
                onSelectFile={onSelectFile}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = node.file.id === activeFileId;
  return (
    <div
      className={`ide-tree-item ide-tree-file ${isActive ? "ide-tree-file-active" : ""}`}
      style={{ paddingLeft: indent + 20 }}
      onClick={() => onSelectFile(node.file.id)}
      onContextMenu={(e) => onContextMenu(e, { type: "file", fileId: node.file.id })}
      title={node.file.path}
    >
      <span className="ide-tree-icon">{getFileIcon(node.file.name)}</span>
      <span className="ide-tree-name">{node.file.name}</span>
    </div>
  );
}

// ── FileTree ───────────────────────────────────────────────────────────────────

export interface FileTreeProps {
  nodes: TreeNode[];
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onContextMenu: (e: React.MouseEvent, target: ContextMenuTarget) => void;
}

export default function FileTree({
  nodes,
  activeFileId,
  onSelectFile,
  onContextMenu,
}: FileTreeProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  // Auto-open folders containing the active file
  useEffect(() => {
    if (!activeFileId) return;
    // We cannot easily look up from node alone, so we keep a separate open state
  }, [activeFileId]);

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  if (nodes.length === 0) {
    return (
      <div className="ide-tree-empty">
        <p>No files yet.</p>
        <p>Click + New File to get started.</p>
      </div>
    );
  }

  return (
    <div className="ide-filetree">
      {nodes.map((node) => (
        <TreeItem
          key={
            node.kind === "file"
              ? `file-${node.file.path}-${node.file.id}`
              : `folder-${node.folder.path}-${node.folder.id}`
          }
          node={node}
          depth={0}
          activeFileId={activeFileId}
          openFolders={openFolders}
          onToggleFolder={toggleFolder}
          onSelectFile={onSelectFile}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  );
}
