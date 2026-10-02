import React, { useEffect, useRef, useState } from "react";
import { Edit2, Copy, X, Trash2, FileCode2 } from "lucide-react";
import { SQLFile } from "@/lib/sql/types";

interface Props {
  file: SQLFile | null;
  isOpen: boolean;
  position: { x: number; y: number } | null;
  isTabOpen: boolean;
  onRename: (file: SQLFile) => void;
  onDuplicate: (file: SQLFile) => void;
  onCloseTab: (file: SQLFile) => void;
  onDelete: (file: SQLFile) => void;
  onClose: () => void;
}

export default function SQLFileContextMenu({
  file,
  isOpen,
  position,
  isTabOpen,
  onRename,
  onDuplicate,
  onCloseTab,
  onDelete,
  onClose
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle outside click & escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    // Small timeout so the event that opened the menu does not immediately close it
    const timer = setTimeout(() => {
      window.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("touchstart", handleClickOutside);
      window.addEventListener("contextmenu", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("contextmenu", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !file) return null;

  // Calculate clamped coordinates for desktop popover
  const menuWidth = 190;
  const menuHeight = isTabOpen ? 180 : 140;

  const posX = position ? Math.max(10, Math.min(position.x, (typeof window !== "undefined" ? window.innerWidth : 1000) - menuWidth - 10)) : 10;
  const posY = position ? Math.max(10, Math.min(position.y, (typeof window !== "undefined" ? window.innerHeight : 800) - menuHeight - 10)) : 10;

  // Render mobile bottom sheet
  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          ref={menuRef}
          className="bg-[var(--surface)] border-t border-[var(--border)] rounded-t-2xl p-4 w-full max-w-lg mx-auto shadow-2xl animate-in slide-in-from-bottom duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header handle & file name */}
          <div className="w-10 h-1 bg-[var(--border-strong)] rounded-full mx-auto mb-3" />
          <div className="flex items-center gap-2 px-2 pb-3 border-b border-[var(--border)] mb-2">
            <FileCode2 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-[var(--ink)] truncate">{file.name}</span>
          </div>

          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-[var(--ink)] active:bg-[var(--surface-subdued)] flex items-center justify-between"
              onClick={() => {
                onRename(file);
                onClose();
              }}
            >
              <div className="flex items-center gap-2.5">
                <Edit2 className="w-4 h-4 text-[var(--ink-secondary)]" />
                <span>Rename</span>
              </div>
              <span className="text-xs text-[var(--ink-tertiary)] font-mono">F2</span>
            </button>

            <button
              type="button"
              className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-[var(--ink)] active:bg-[var(--surface-subdued)] flex items-center justify-between"
              onClick={() => {
                onDuplicate(file);
                onClose();
              }}
            >
              <div className="flex items-center gap-2.5">
                <Copy className="w-4 h-4 text-[var(--ink-secondary)]" />
                <span>Duplicate</span>
              </div>
              <span className="text-xs text-[var(--ink-tertiary)] font-mono">Ctrl+D</span>
            </button>

            {isTabOpen && (
              <button
                type="button"
                className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-[var(--ink)] active:bg-[var(--surface-subdued)] flex items-center justify-between"
                onClick={() => {
                  onCloseTab(file);
                  onClose();
                }}
              >
                <div className="flex items-center gap-2.5">
                  <X className="w-4 h-4 text-[var(--ink-secondary)]" />
                  <span>Close Tab</span>
                </div>
              </button>
            )}

            <div className="h-px bg-[var(--border)] my-1" />

            <button
              type="button"
              className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-red-500 active:bg-red-50 dark:active:bg-red-950/40 flex items-center justify-between"
              onClick={() => {
                onDelete(file);
                onClose();
              }}
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Delete</span>
              </div>
              <span className="text-xs text-red-400 font-mono">Del</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render desktop floating context menu
  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={`Options for ${file.name}`}
      className="fixed z-50 bg-[var(--surface)] border border-[var(--border)] shadow-xl rounded-lg py-1.5 w-48 text-sm animate-in fade-in zoom-in-95 duration-100 select-none"
      style={{
        top: posY,
        left: posX
      }}
      onClick={e => e.stopPropagation()}
    >
      <button
        type="button"
        role="menuitem"
        className="w-full text-left px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[var(--surface-subdued)] focus:bg-[var(--surface-subdued)] focus:outline-hidden flex items-center justify-between transition-colors group cursor-pointer"
        onClick={() => {
          onRename(file);
          onClose();
        }}
      >
        <div className="flex items-center gap-2">
          <Edit2 className="w-3.5 h-3.5 text-[var(--ink-secondary)] group-hover:text-[var(--ink)]" />
          <span>Rename</span>
        </div>
        <span className="text-[10px] text-[var(--ink-tertiary)] font-mono">F2</span>
      </button>

      <button
        type="button"
        role="menuitem"
        className="w-full text-left px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[var(--surface-subdued)] focus:bg-[var(--surface-subdued)] focus:outline-hidden flex items-center justify-between transition-colors group cursor-pointer"
        onClick={() => {
          onDuplicate(file);
          onClose();
        }}
      >
        <div className="flex items-center gap-2">
          <Copy className="w-3.5 h-3.5 text-[var(--ink-secondary)] group-hover:text-[var(--ink)]" />
          <span>Duplicate</span>
        </div>
        <span className="text-[10px] text-[var(--ink-tertiary)] font-mono">Ctrl+D</span>
      </button>

      {isTabOpen && (
        <button
          type="button"
          role="menuitem"
          className="w-full text-left px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[var(--surface-subdued)] focus:bg-[var(--surface-subdued)] focus:outline-hidden flex items-center justify-between transition-colors group cursor-pointer"
          onClick={() => {
            onCloseTab(file);
            onClose();
          }}
        >
          <div className="flex items-center gap-2">
            <X className="w-3.5 h-3.5 text-[var(--ink-secondary)] group-hover:text-[var(--ink)]" />
            <span>Close Tab</span>
          </div>
        </button>
      )}

      <div className="h-px bg-[var(--border)] my-1" />

      <button
        type="button"
        role="menuitem"
        className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 focus:outline-hidden flex items-center justify-between transition-colors cursor-pointer"
        onClick={() => {
          onDelete(file);
          onClose();
        }}
      >
        <div className="flex items-center gap-2">
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
          <span>Delete</span>
        </div>
        <span className="text-[10px] text-red-400 font-mono">Del</span>
      </button>
    </div>
  );
}
