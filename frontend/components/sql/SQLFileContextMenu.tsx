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
          className="bg-card border-t border-hair rounded-t-2xl p-4 w-full max-w-lg mx-auto shadow-2xl animate-in slide-in-from-bottom duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header handle & file name */}
          <div className="w-10 h-1 bg-ink/25 rounded-full mx-auto mb-3" />
          <div className="flex items-center gap-2 px-2 pb-3 border-b border-hair mb-2">
            <FileCode2 className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-ink truncate">{file.name}</span>
          </div>

          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-ink active:bg-paper-2 flex items-center justify-between"
              onClick={() => {
                onRename(file);
                onClose();
              }}
            >
              <div className="flex items-center gap-2.5">
                <Edit2 className="w-4 h-4 text-body" />
                <span>Rename</span>
              </div>
              <span className="text-xs text-mute font-mono">F2</span>
            </button>

            <button
              type="button"
              className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-ink active:bg-paper-2 flex items-center justify-between"
              onClick={() => {
                onDuplicate(file);
                onClose();
              }}
            >
              <div className="flex items-center gap-2.5">
                <Copy className="w-4 h-4 text-body" />
                <span>Duplicate</span>
              </div>
              <span className="text-xs text-mute font-mono">Ctrl+D</span>
            </button>

            {isTabOpen && (
              <button
                type="button"
                className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-ink active:bg-paper-2 flex items-center justify-between"
                onClick={() => {
                  onCloseTab(file);
                  onClose();
                }}
              >
                <div className="flex items-center gap-2.5">
                  <X className="w-4 h-4 text-body" />
                  <span>Close Tab</span>
                </div>
              </button>
            )}

            <div className="h-px bg-hair my-1" />

            <button
              type="button"
              className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-danger active:bg-danger-soft flex items-center justify-between"
              onClick={() => {
                onDelete(file);
                onClose();
              }}
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-danger" />
                <span>Delete</span>
              </div>
              <span className="text-xs text-danger font-mono">Del</span>
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
      className="fixed z-50 bg-card border border-hair shadow-xl rounded-lg py-1.5 w-48 text-sm animate-in fade-in zoom-in-95 duration-100 select-none"
      style={{
        top: posY,
        left: posX
      }}
      onClick={e => e.stopPropagation()}
    >
      <button
        type="button"
        role="menuitem"
        className="w-full text-left px-3 py-1.5 text-xs text-ink hover:bg-paper-2 focus:bg-paper-2 focus:outline-hidden flex items-center justify-between transition-colors group cursor-pointer"
        onClick={() => {
          onRename(file);
          onClose();
        }}
      >
        <div className="flex items-center gap-2">
          <Edit2 className="w-3.5 h-3.5 text-body group-hover:text-ink" />
          <span>Rename</span>
        </div>
        <span className="text-[10px] text-mute font-mono">F2</span>
      </button>

      <button
        type="button"
        role="menuitem"
        className="w-full text-left px-3 py-1.5 text-xs text-ink hover:bg-paper-2 focus:bg-paper-2 focus:outline-hidden flex items-center justify-between transition-colors group cursor-pointer"
        onClick={() => {
          onDuplicate(file);
          onClose();
        }}
      >
        <div className="flex items-center gap-2">
          <Copy className="w-3.5 h-3.5 text-body group-hover:text-ink" />
          <span>Duplicate</span>
        </div>
        <span className="text-[10px] text-mute font-mono">Ctrl+D</span>
      </button>

      {isTabOpen && (
        <button
          type="button"
          role="menuitem"
          className="w-full text-left px-3 py-1.5 text-xs text-ink hover:bg-paper-2 focus:bg-paper-2 focus:outline-hidden flex items-center justify-between transition-colors group cursor-pointer"
          onClick={() => {
            onCloseTab(file);
            onClose();
          }}
        >
          <div className="flex items-center gap-2">
            <X className="w-3.5 h-3.5 text-body group-hover:text-ink" />
            <span>Close Tab</span>
          </div>
        </button>
      )}

      <div className="h-px bg-hair my-1" />

      <button
        type="button"
        role="menuitem"
        className="w-full text-left px-3 py-1.5 text-xs text-danger hover:bg-danger-soft focus:bg-danger-soft focus:outline-hidden flex items-center justify-between transition-colors cursor-pointer"
        onClick={() => {
          onDelete(file);
          onClose();
        }}
      >
        <div className="flex items-center gap-2">
          <Trash2 className="w-3.5 h-3.5 text-danger" />
          <span>Delete</span>
        </div>
        <span className="text-[10px] text-danger font-mono">Del</span>
      </button>
    </div>
  );
}
