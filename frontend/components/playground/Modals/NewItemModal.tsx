"use client";

import React, { useState, useRef, useEffect } from "react";

interface NewItemModalProps {
  visible: boolean;
  mode: "file" | "folder";
  contextPath?: string; // folder context for creation
  onConfirm: (path: string) => void;
  onCancel: () => void;
}

export default function NewItemModal({
  visible,
  mode,
  contextPath,
  onConfirm,
  onCancel,
}: NewItemModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) {
      const prefix = contextPath ? contextPath + "/" : "";
      setValue(prefix);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [visible, contextPath]);

  const handleConfirm = () => {
    const trimmed = value.trim().replace(/^\/+|\/+$/g, "");

    if (!trimmed) {
      setError("Please enter a name");
      return;
    }

    if (!/^[a-zA-Z0-9._\-/]+$/.test(trimmed)) {
      setError("Invalid characters. Use letters, numbers, ., _, -, /");
      return;
    }

    onConfirm(trimmed);
    setValue("");
    setError("");
  };

  if (!visible) return null;

  return (
    <div className="ide-modal-backdrop" onClick={onCancel}>
      <div
        className="ide-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="ide-modal-title">
          {mode === "file" ? "New File" : "New Folder"}
        </h3>

        <p className="ide-modal-desc">
          {mode === "file"
            ? "Enter the file path. Use / for subdirectories."
            : "Enter the folder path. Use / for nested folders."}
        </p>

        <input
          ref={inputRef}
          className={`ide-modal-input ${error ? "ide-modal-input-error" : ""}`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") onCancel();
          }}
          placeholder={mode === "file" ? "components/Button.js" : "src/components"}
          spellCheck={false}
          autoComplete="off"
        />

        {error && <p className="ide-modal-error">{error}</p>}

        <div className="ide-modal-actions">
          <button className="ide-modal-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="ide-modal-btn-confirm" onClick={handleConfirm}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Rename modal ───────────────────────────────────────────────────────────────

interface RenameModalProps {
  visible: boolean;
  currentName: string;
  mode: "file" | "folder";
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}

export function RenameModal({
  visible,
  currentName,
  mode,
  onConfirm,
  onCancel,
}: RenameModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) {
      setValue(currentName);
      setError("");
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Select without the extension
          const dotIdx = currentName.lastIndexOf(".");
          if (dotIdx > 0 && mode === "file") {
            inputRef.current.setSelectionRange(0, dotIdx);
          } else {
            inputRef.current.select();
          }
        }
      }, 50);
    }
  }, [visible, currentName, mode]);

  const handleConfirm = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }
    if (trimmed.includes("/") || trimmed.includes("\\")) {
      setError("Name cannot contain path separators");
      return;
    }
    if (!/^[a-zA-Z0-9._\-]+$/.test(trimmed)) {
      setError("Invalid characters in name");
      return;
    }
    onConfirm(trimmed);
  };

  if (!visible) return null;

  return (
    <div className="ide-modal-backdrop" onClick={onCancel}>
      <div className="ide-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="ide-modal-title">Rename {mode === "file" ? "File" : "Folder"}</h3>

        <input
          ref={inputRef}
          className={`ide-modal-input ${error ? "ide-modal-input-error" : ""}`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") onCancel();
          }}
          spellCheck={false}
          autoComplete="off"
        />

        {error && <p className="ide-modal-error">{error}</p>}

        <div className="ide-modal-actions">
          <button className="ide-modal-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="ide-modal-btn-confirm" onClick={handleConfirm}>
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm modal ───────────────────────────────────────────────────────

interface DeleteConfirmProps {
  visible: boolean;
  name: string;
  mode: "file" | "folder";
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  visible,
  name,
  mode,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  if (!visible) return null;

  return (
    <div className="ide-modal-backdrop" onClick={onCancel}>
      <div className="ide-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="ide-modal-title">Delete {mode === "file" ? "File" : "Folder"}</h3>

        <p className="ide-modal-desc">
          Are you sure you want to delete{" "}
          <strong>{name}</strong>?
          {mode === "folder" && (
            <span> This will also delete all files inside this folder.</span>
          )}
        </p>

        <p className="ide-modal-warn">This action cannot be undone.</p>

        <div className="ide-modal-actions">
          <button className="ide-modal-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="ide-modal-btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
