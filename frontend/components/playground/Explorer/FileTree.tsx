"use client";

import React, { useState, useRef, useEffect } from "react";
import type { TreeNode, ContextMenuTarget } from "@/types/playground";
import { useLongPress } from "./useLongPress";

// ── File icons ─────────────────────────────────────────────────────────────────

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const icons: Record<string, string> = {
    html: "🌐",
    htm: "🌐",
    css: "🎨",
    js: "📜",
    mjs: "📜",
    cjs: "📜",
    jsx: "⚛️",
    ts: "📘",
    tsx: "📘",
    json: "📋",
    md: "📝",
    markdown: "📝",
    xml: "📄",
    svg: "🖼️",
    png: "🖼️",
    jpg: "🖼️",
    jpeg: "🖼️",
    gif: "🖼️",
    webp: "🖼️",
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
  renamingId: string | null;
  renamingType: "file" | "folder" | null;
  onToggleFolder: (path: string) => void;
  onSelectFile: (fileId: string) => void;
  onOpenMenu: (target: ContextMenuTarget, pos: { x: number; y: number }) => void;
  onRenameSubmit: (id: string, type: "file" | "folder", newName: string) => void;
  onRenameCancel: () => void;
  onMoveItem: (sourcePath: string, targetFolderPath: string) => void;
}

function TreeItem({
  node,
  depth,
  activeFileId,
  openFolders,
  renamingId,
  renamingType,
  onToggleFolder,
  onSelectFile,
  onOpenMenu,
  onRenameSubmit,
  onRenameCancel,
  onMoveItem,
}: TreeItemProps) {
  const indent = depth * 12;
  const threeDotRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editName, setEditName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Check if this item is in inline rename mode
  const isRenaming =
    node.kind === "folder"
      ? renamingId === node.folder.id && renamingType === "folder"
      : renamingId === node.file.id && renamingType === "file";

  useEffect(() => {
    if (isRenaming) {
      const initialName = node.kind === "folder" ? node.folder.name : node.file.name;
      setEditName(initialName);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const dotIdx = initialName.lastIndexOf(".");
          if (dotIdx > 0 && node.kind === "file") {
            inputRef.current.setSelectionRange(0, dotIdx);
          } else {
            inputRef.current.select();
          }
        }
      }, 20);
    }
  }, [isRenaming, node]);

  // Long press hook for touch devices
  const longPress = useLongPress({
    onLongPress: (pos) => {
      if (node.kind === "folder") {
        onOpenMenu({ type: "folder", folderPath: node.folder.path }, pos);
      } else {
        onOpenMenu({ type: "file", fileId: node.file.id }, pos);
      }
    },
    onClick: () => {
      if (isRenaming) return;
      if (node.kind === "folder") {
        onToggleFolder(node.folder.path);
      } else {
        onSelectFile(node.file.id);
      }
    },
    delay: 500,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (node.kind === "folder") {
      onOpenMenu(
        { type: "folder", folderPath: node.folder.path },
        { x: e.clientX, y: e.clientY }
      );
    } else {
      onOpenMenu(
        { type: "file", fileId: node.file.id },
        { x: e.clientX, y: e.clientY }
      );
    }
  };

  const handleThreeDotClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (threeDotRef.current) {
      const rect = threeDotRef.current.getBoundingClientRect();
      const pos = { x: rect.right - 160, y: rect.bottom + 4 };
      if (node.kind === "folder") {
        onOpenMenu({ type: "folder", folderPath: node.folder.path }, pos);
      } else {
        onOpenMenu({ type: "file", fileId: node.file.id }, pos);
      }
    } else {
      handleContextMenu(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editName.trim()) {
        const id = node.kind === "folder" ? node.folder.id : node.file.id;
        const type = node.kind === "folder" ? "folder" : "file";
        onRenameSubmit(id, type, editName.trim());
      } else {
        onRenameCancel();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onRenameCancel();
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    const itemPath = node.kind === "folder" ? node.folder.path : node.file.path;
    e.dataTransfer.setData("text/plain", itemPath);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (node.kind === "folder") {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "move";
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (node.kind === "folder") {
      e.preventDefault();
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (node.kind === "folder") {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const sourcePath = e.dataTransfer.getData("text/plain");
      if (sourcePath && sourcePath !== node.folder.path) {
        onMoveItem(sourcePath, node.folder.path);
      }
    }
  };

  if (node.kind === "folder") {
    const isOpen = openFolders.has(node.folder.path);
    return (
      <div className="ide-tree-folder-group">
        <div
          className={`ide-tree-item ide-tree-folder ${
            isDragOver ? "ide-tree-dragover" : ""
          }`}
          style={{ paddingLeft: indent + 6 }}
          draggable={!isRenaming}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onContextMenu={handleContextMenu}
          {...longPress}
          title={node.folder.path}
        >
          <span
            className="ide-tree-arrow"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFolder(node.folder.path);
            }}
          >
            {isOpen ? "▾" : "▸"}
          </span>
          <span className="ide-tree-icon">{isOpen ? "📂" : "📁"}</span>

          {isRenaming ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() => {
                if (editName.trim()) {
                  onRenameSubmit(node.folder.id, "folder", editName.trim());
                } else {
                  onRenameCancel();
                }
              }}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="ide-tree-rename-input"
            />
          ) : (
            <span className="ide-tree-name">{node.folder.name}</span>
          )}

          {!isRenaming && (
            <button
              ref={threeDotRef}
              type="button"
              className="ide-tree-more-btn"
              onClick={handleThreeDotClick}
              title="More options"
            >
              ⋮
            </button>
          )}
        </div>

        {isOpen && (
          <div className="ide-tree-children">
            {node.children.length === 0 ? (
              <div
                className="ide-tree-empty-folder"
                style={{ paddingLeft: indent + 24 }}
              >
                (empty folder)
              </div>
            ) : (
              node.children.map((child) => (
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
                  renamingId={renamingId}
                  renamingType={renamingType}
                  onToggleFolder={onToggleFolder}
                  onSelectFile={onSelectFile}
                  onOpenMenu={onOpenMenu}
                  onRenameSubmit={onRenameSubmit}
                  onRenameCancel={onRenameCancel}
                  onMoveItem={onMoveItem}
                />
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  const isActive = node.file.id === activeFileId;
  return (
    <div
      className={`ide-tree-item ide-tree-file ${
        isActive ? "ide-tree-file-active" : ""
      }`}
      style={{ paddingLeft: indent + 18 }}
      draggable={!isRenaming}
      onDragStart={handleDragStart}
      onContextMenu={handleContextMenu}
      {...longPress}
      title={node.file.path}
    >
      <span className="ide-tree-icon">{getFileIcon(node.file.name)}</span>

      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={() => {
            if (editName.trim()) {
              onRenameSubmit(node.file.id, "file", editName.trim());
            } else {
              onRenameCancel();
            }
          }}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="ide-tree-rename-input"
        />
      ) : (
        <span className="ide-tree-name">{node.file.name}</span>
      )}

      {!isRenaming && (
        <button
          ref={threeDotRef}
          type="button"
          className="ide-tree-more-btn"
          onClick={handleThreeDotClick}
          title="More options"
        >
          ⋮
        </button>
      )}
    </div>
  );
}

// ── FileTree ───────────────────────────────────────────────────────────────────

export interface FileTreeProps {
  nodes: TreeNode[];
  activeFileId: string | null;
  openFolders?: Set<string>;
  renamingId?: string | null;
  renamingType?: "file" | "folder" | null;
  onToggleFolder?: (path: string) => void;
  onSelectFile: (fileId: string) => void;
  onOpenMenu: (target: ContextMenuTarget, pos: { x: number; y: number }) => void;
  onRenameSubmit?: (id: string, type: "file" | "folder", newName: string) => void;
  onRenameCancel?: () => void;
  onMoveItem?: (sourcePath: string, targetFolderPath: string) => void;
}

export default function FileTree({
  nodes,
  activeFileId,
  openFolders: controlledOpenFolders,
  renamingId = null,
  renamingType = null,
  onToggleFolder: controlledToggleFolder,
  onSelectFile,
  onOpenMenu,
  onRenameSubmit = () => {},
  onRenameCancel = () => {},
  onMoveItem = () => {},
}: FileTreeProps) {
  const [internalOpenFolders, setInternalOpenFolders] = useState<Set<string>>(new Set());
  const [isRootDragOver, setIsRootDragOver] = useState(false);

  const openFolders = controlledOpenFolders ?? internalOpenFolders;
  const handleToggleFolder =
    controlledToggleFolder ??
    ((path: string) => {
      setInternalOpenFolders((prev) => {
        const next = new Set(prev);
        if (next.has(path)) next.delete(path);
        else next.add(path);
        return next;
      });
    });

  if (nodes.length === 0) {
    return (
      <div className="ide-tree-empty">
        <p>No files yet.</p>
        <p>Click + New File to get started.</p>
      </div>
    );
  }

  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsRootDragOver(true);
  };

  const handleRootDragLeave = () => {
    setIsRootDragOver(false);
  };

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsRootDragOver(false);
    const sourcePath = e.dataTransfer.getData("text/plain");
    if (sourcePath) {
      onMoveItem(sourcePath, "");
    }
  };

  return (
    <div
      className={`ide-filetree ${isRootDragOver ? "ide-tree-root-dragover" : ""}`}
      onDragOver={handleRootDragOver}
      onDragLeave={handleRootDragLeave}
      onDrop={handleRootDrop}
    >
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
          renamingId={renamingId}
          renamingType={renamingType}
          onToggleFolder={handleToggleFolder}
          onSelectFile={onSelectFile}
          onOpenMenu={onOpenMenu}
          onRenameSubmit={onRenameSubmit}
          onRenameCancel={onRenameCancel}
          onMoveItem={onMoveItem}
        />
      ))}
    </div>
  );
}

