"use client";

import React, { useRef, useEffect } from "react";
import type { ContextMenuState } from "@/types/playground";

export interface ContextMenuAction {
  label: string;
  icon?: string;
  danger?: boolean;
  disabled?: boolean;
  action: () => void;
}

interface ContextMenuProps {
  state: ContextMenuState;
  actions: ContextMenuAction[];
  onClose: () => void;
}

export default function ContextMenu({ state, actions, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.visible) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.visible, onClose]);

  if (!state.visible || !state.target) return null;

  // Adjust position to stay within viewport
  const x = Math.min(state.x, window.innerWidth - 180);
  const y = Math.min(state.y, window.innerHeight - actions.length * 36 - 16);

  return (
    <div
      ref={menuRef}
      className="ide-context-menu"
      style={{ left: x, top: y }}
    >
      {actions.map((action, i) =>
        action.label === "---" ? (
          <div key={i} className="ide-context-divider" />
        ) : (
          <button
            key={i}
            className={`ide-context-item ${action.danger ? "ide-context-item-danger" : ""}`}
            onClick={() => {
              action.action();
              onClose();
            }}
            disabled={action.disabled}
          >
            {action.icon && <span className="ide-context-icon">{action.icon}</span>}
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
