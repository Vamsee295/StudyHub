"use client";

/**
 * StudyHub Code IDE — VS Code-style coding environment for Python / Java / C / C++
 *
 * Layout:
 *   ┌──────────┬──────────────────────────────────────────────┐
 *   │ EXPLORER │  Tabs + Monaco Editor (full width)            │
 *   │          │                                               │
 *   └──────────┴──────────────────────────────────────────────┘
 *   ┌─────────────────────────────────────────────────────────┐
 *   │ [OUTPUT] [PROBLEMS] [CONSOLE] [TERMINAL]  ↑ drag resize │
 *   └─────────────────────────────────────────────────────────┘
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Link from "next/link";
import { Play, RotateCcw, ChevronLeft, FileCode2 } from "lucide-react";

import Explorer from "./Explorer/Explorer";
import ContextMenu from "./Explorer/ContextMenu";
import type { ContextMenuAction } from "./Explorer/ContextMenu";
import EditorTabs from "./Editor/EditorTabs";
import MonacoWorkspace from "./Editor/MonacoWorkspace";
import BottomPanel from "./BottomPanel/BottomPanel";
import NewItemModal, {
  RenameModal,
  DeleteConfirmModal,
} from "./Modals/NewItemModal";

import type {
  PlaygroundProject,
  ProjectFile,
  ProjectFolder,
  EditorTab,
  ContextMenuState,
  ContextMenuTarget,
  BottomPanelTab,
  ConsoleMessage,
  ProblemEntry,
  CodeExecResult,
  CodeLanguage,
} from "@/types/playground";

import {
  buildTree,
  createFile,
  createFolder,
  renameFile,
  renameFolder,
  deleteFilePermanently,
  deleteFolderPermanently,
  updateFileContent,
  ensureAncestorFolders,
  normalizePath,
  basename,
  parentPath,
} from "@/lib/services/playground/virtualFileSystem";

import {
  loadProjectSnapshot,
  saveProjectSnapshot,
  saveLastProjectId,
  getLastProjectId,
} from "@/lib/services/playground/persistence";

// ── Constants ─────────────────────────────────────────────────────────────────

const CODE_LANGUAGES: { value: CodeLanguage; label: string }[] = [
  { value: "python", label: "Python 3" },
  { value: "java", label: "Java 21" },
  { value: "cpp", label: "C++ 17" },
  { value: "c", label: "C (GCC)" },
];

const STARTER_PROJECTS: Record<
  CodeLanguage,
  { files: { path: string; content: string }[] }
> = {
  python: {
    files: [
      {
        path: "main.py",
        content: `# StudyHub Code Playground — Python 3
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

arr = [10, 20, 30, 40, 50]
target = 30
result = binary_search(arr, target)
print(f"Element found at index: {result}")
`,
      },
    ],
  },
  java: {
    files: [
      {
        path: "Main.java",
        content: `// StudyHub Code Playground — Java 21
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, StudyHub!");

        int[] arr = {10, 20, 30, 40, 50};
        int result = binarySearch(arr, 30);
        System.out.println("Element found at index: " + result);
    }

    static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}
`,
      },
    ],
  },
  cpp: {
    files: [
      {
        path: "main.cpp",
        content: `// StudyHub Code Playground — C++ 17
#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> arr = {10, 20, 30, 40, 50};
    cout << "Element found at index: " << binarySearch(arr, 30) << endl;
    return 0;
}
`,
      },
    ],
  },
  c: {
    files: [
      {
        path: "main.c",
        content: `/* StudyHub Code Playground — C (GCC) */
#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int n = sizeof(arr) / sizeof(arr[0]);
    printf("Element found at index: %d\\n", binarySearch(arr, n, 30));
    return 0;
}
`,
      },
    ],
  },
};

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── API ───────────────────────────────────────────────────────────────────────

const BACKEND_URL =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ?? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000";

async function runCodeOnBackend(
  language: CodeLanguage,
  files: ProjectFile[],
  entryFile: string | null,
  stdin: string
): Promise<CodeExecResult> {
  const payload = {
    language,
    files: files.map((f) => ({ path: f.path, content: f.content })),
    entryFile: entryFile ?? undefined,
    stdin,
  };

  const res = await fetch(`${BACKEND_URL}/api/practice/code/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Server error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

// StatusPill lives in BottomPanel now

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CodeIDE() {
  const [language, setLanguage] = useState<CodeLanguage>("python");
  const [project, setProject] = useState<PlaygroundProject | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [folders, setFolders] = useState<ProjectFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<CodeExecResult | null>(null);
  const [stdin, setStdin] = useState("");
  const [showStdin, setShowStdin] = useState(false);

  const [bottomTab, setBottomTab] = useState<BottomPanelTab>("output");
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [problems, setProblems] = useState<ProblemEntry[]>([]);

  // ── Resizable bottom panel ────────────────────────────────────────────────
  const [bottomHeight, setBottomHeight] = useState(220);
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(true);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startY: e.clientY, startHeight: bottomHeight };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startY - ev.clientY;
      const next = Math.max(80, Math.min(600, dragRef.current.startHeight + delta));
      setBottomHeight(next);
      if (next > 60) setIsBottomCollapsed(false);
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [bottomHeight]);

  const toggleBottomCollapse = useCallback(() => {
    setIsBottomCollapsed((v) => !v);
  }, []);

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false, x: 0, y: 0, target: null,
  });

  const [newItemModal, setNewItemModal] = useState<{
    visible: boolean; mode: "file" | "folder"; contextPath?: string;
  }>({ visible: false, mode: "file" });

  const [renameModal, setRenameModal] = useState<{
    visible: boolean; mode: "file" | "folder"; currentName: string;
    targetFileId?: string; targetFolderPath?: string;
  }>({ visible: false, mode: "file", currentName: "" });

  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean; mode: "file" | "folder"; name: string;
    targetFileId?: string; targetFolderPath?: string;
  }>({ visible: false, mode: "file", name: "" });

  const tree = useMemo(() => buildTree(files, folders), [files, folders]);

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  const bootstrapProject = useCallback(async (lang: CodeLanguage) => {
    const pid = generateId();
    const now = Date.now();

    const newProject: PlaygroundProject = {
      id: pid,
      name: `${lang}-project`,
      activeFileId: null,
      openFileIds: [],
      createdAt: now,
      updatedAt: now,
    };

    const newFiles: ProjectFile[] = [];
    const newFolders: ProjectFolder[] = [];

    for (const def of STARTER_PROJECTS[lang].files) {
      const norm = normalizePath(def.path);
      const parent = parentPath(norm);

      if (parent) {
        const parts = parent.split("/");
        for (let i = 1; i <= parts.length; i++) {
          const fp = parts.slice(0, i).join("/");
          if (!newFolders.find((f) => f.path === fp)) {
            newFolders.push({ id: generateId(), projectId: pid, path: fp, name: basename(fp), createdAt: now });
          }
        }
      }

      newFiles.push({
        id: generateId(), projectId: pid, path: norm, name: basename(norm),
        content: def.content, language: lang as any, createdAt: now, updatedAt: now,
      });
    }

    await saveProjectSnapshot({ project: newProject, files: newFiles, folders: newFolders });
    saveLastProjectId(pid);

    setProject(newProject);
    setFiles(newFiles);
    setFolders(newFolders);
    setTabs([{ fileId: newFiles[0].id, isDirty: false }]);
    setActiveFileId(newFiles[0].id);
    setExecResult(null);
  }, []);

  const loadOrCreateProject = useCallback(async (lang: CodeLanguage) => {
    setIsLoading(true);
    try {
      const lastId = getLastProjectId();
      if (lastId) {
        const snapshot = await loadProjectSnapshot(lastId);
        if (snapshot && snapshot.project.name === `${lang}-project`) {
          setProject(snapshot.project);
          setFiles(snapshot.files);
          setFolders(snapshot.folders);
          const openIds = snapshot.project.openFileIds.filter((id) =>
            snapshot.files.find((f) => f.id === id)
          );
          const activeId =
            snapshot.project.activeFileId &&
            snapshot.files.find((f) => f.id === snapshot.project.activeFileId)
              ? snapshot.project.activeFileId
              : openIds[0] ?? snapshot.files[0]?.id ?? null;
          setTabs(openIds.length ? openIds.map((id) => ({ fileId: id, isDirty: false })) : snapshot.files[0] ? [{ fileId: snapshot.files[0].id, isDirty: false }] : []);
          setActiveFileId(activeId);
          setIsLoading(false);
          return;
        }
      }
      await bootstrapProject(lang);
    } catch (err) {
      console.error("[CodeIDE] Load failed:", err);
      await bootstrapProject(lang);
    } finally {
      setIsLoading(false);
    }
  }, [bootstrapProject]);

  useEffect(() => {
    loadOrCreateProject(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Language switch ────────────────────────────────────────────────────────

  const handleLanguageChange = useCallback(async (lang: CodeLanguage) => {
    setLanguage(lang);
    setExecResult(null);
    setIsLoading(true);
    setTabs([]);
    setActiveFileId(null);
    setFiles([]);
    setFolders([]);
    await bootstrapProject(lang);
    setIsLoading(false);
  }, [bootstrapProject]);

  // ── File selection ────────────────────────────────────────────────────────

  const selectFile = useCallback((fileId: string) => {
    setActiveFileId(fileId);
    setTabs((prev) => {
      if (prev.find((t) => t.fileId === fileId)) return prev;
      return [...prev, { fileId, isDirty: false }];
    });
  }, []);

  const closeTab = useCallback((fileId: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.fileId !== fileId);
      if (fileId === activeFileId) {
        setActiveFileId(next.length > 0 ? next[next.length - 1].fileId : null);
      }
      return next;
    });
  }, [activeFileId]);

  // ── Content change ────────────────────────────────────────────────────────

  const handleContentChange = useCallback((fileId: string, content: string) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, content } : f)));
    setTabs((prev) => prev.map((t) => (t.fileId === fileId ? { ...t, isDirty: true } : t)));

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        setFiles((prev) => {
          const file = prev.find((f) => f.id === fileId);
          if (file) updateFileContent(file, content);
          return prev;
        });
        setTabs((prev) => prev.map((t) => (t.fileId === fileId ? { ...t, isDirty: false } : t)));
      } catch (e) {
        console.warn("[CodeIDE] Auto-save error:", e);
      }
    }, 1200);
  }, []);

  // ── Run code ──────────────────────────────────────────────────────────────

  const runCode = useCallback(async () => {
    if (!files.length || isRunning) return;
    setIsRunning(true);
    setExecResult(null);
    setBottomTab("output");

    // Auto-expand bottom panel and switch to output tab
    setIsBottomCollapsed(false);
    setBottomTab("output");

    setConsoleMessages((prev) => [
      ...prev,
      { id: generateId(), level: "info", message: `▶ Running ${language}…`, timestamp: Date.now() },
    ]);

    try {
      const entryMap: Record<CodeLanguage, string> = {
        python: "main.py", java: "Main.java", c: "main.c", cpp: "main.cpp",
      };
      const result = await runCodeOnBackend(language, files, entryMap[language], stdin);
      setExecResult(result);

      // Switch to PROBLEMS tab if there are errors
      if (result.compileError || result.status === "compile_error") {
        setBottomTab("problems");
      }

      setConsoleMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          level: result.status === "accepted" ? "log" : "error",
          message: result.status === "accepted"
            ? `✓ Done in ${result.executionTime}s — ${result.memory}`
            : `✕ ${result.status.replace(/_/g, " ")}`,
          timestamp: Date.now(),
        },
      ]);

      if (result.compileError) {
        setProblems([{ id: generateId(), severity: "error", message: result.compileError.slice(0, 300) }]);
      } else {
        setProblems([]);
      }
    } catch (err: any) {
      const msg = err?.message ?? "Unknown error";
      setConsoleMessages((prev) => [
        ...prev,
        { id: generateId(), level: "error", message: `Execution failed: ${msg}`, timestamp: Date.now() },
      ]);
      setExecResult({ status: "error", stdout: "", stderr: msg, compileError: null, executionTime: 0, memory: "--" });
    } finally {
      setIsRunning(false);
    }
  }, [files, language, stdin, isRunning]);

  const resetProject = useCallback(async () => {
    if (!confirm("Reset to starter code? All changes will be lost.")) return;
    setExecResult(null);
    setConsoleMessages([]);
    setProblems([]);
    setIsLoading(true);
    setTabs([]);
    setActiveFileId(null);
    await bootstrapProject(language);
    setIsLoading(false);
  }, [language, bootstrapProject]);

  // ── Keyboard shortcut ─────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
      // Ctrl+J — toggle bottom panel (VS Code convention)
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        toggleBottomCollapse();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runCode, toggleBottomCollapse]);

  // ── Context menu ──────────────────────────────────────────────────────────

  const openContextMenu = useCallback((e: React.MouseEvent, target: ContextMenuTarget) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, target });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu((p) => ({ ...p, visible: false }));
  }, []);

  const contextMenuActions = useMemo((): ContextMenuAction[] => {
    if (!contextMenu.target) return [];
    const t = contextMenu.target;

    if (t.type === "file") {
      const file = files.find((f) => f.id === t.fileId);
      if (!file) return [];
      return [
        { label: "Open", icon: "📄", action: () => selectFile(t.fileId) },
        { label: "---", icon: "", action: () => {} },
        {
          label: "Rename", icon: "✏️",
          action: () => setRenameModal({ visible: true, mode: "file", currentName: file.name, targetFileId: file.id }),
        },
        {
          label: "Delete", icon: "🗑", danger: true,
          action: () => setDeleteModal({ visible: true, mode: "file", name: file.name, targetFileId: file.id }),
        },
      ];
    }

    if (t.type === "folder") {
      return [
        { label: "New File Here", icon: "📄", action: () => setNewItemModal({ visible: true, mode: "file", contextPath: t.folderPath }) },
        { label: "New Folder Here", icon: "📁", action: () => setNewItemModal({ visible: true, mode: "folder", contextPath: t.folderPath }) },
        { label: "---", icon: "", action: () => {} },
        {
          label: "Rename", icon: "✏️",
          action: () => {
            const folder = folders.find((f) => f.path === t.folderPath);
            if (folder) setRenameModal({ visible: true, mode: "folder", currentName: folder.name, targetFolderPath: folder.path });
          },
        },
        {
          label: "Delete", icon: "🗑", danger: true,
          action: () => {
            const folder = folders.find((f) => f.path === t.folderPath);
            if (folder) setDeleteModal({ visible: true, mode: "folder", name: folder.name, targetFolderPath: folder.path });
          },
        },
      ];
    }

    return [
      { label: "New File", icon: "📄", action: () => setNewItemModal({ visible: true, mode: "file" }) },
      { label: "New Folder", icon: "📁", action: () => setNewItemModal({ visible: true, mode: "folder" }) },
    ];
  }, [contextMenu.target, files, folders, selectFile]);

  // ── Modal handlers ────────────────────────────────────────────────────────

  const handleNewItem = useCallback(async (path: string) => {
    if (!project) return;
    setNewItemModal((p) => ({ ...p, visible: false }));
    try {
      if (newItemModal.mode === "file") {
        const newFolders = await ensureAncestorFolders(project.id, path, folders);
        const file = await createFile(project.id, path, "");
        setFiles((prev) => [...prev, file]);
        setFolders((prev) => [...prev, ...newFolders]);
        selectFile(file.id);
      } else {
        const folder = await createFolder(project.id, path);
        setFolders((prev) => [...prev, folder]);
      }
    } catch (e) {
      console.error("[CodeIDE] New item:", e);
    }
  }, [project, newItemModal.mode, folders, selectFile]);

  const handleRename = useCallback(async (newName: string) => {
    setRenameModal((p) => ({ ...p, visible: false }));
    try {
      if (renameModal.mode === "file" && renameModal.targetFileId) {
        const file = files.find((f) => f.id === renameModal.targetFileId);
        if (!file) return;
        const updated = await renameFile(file, newName, files);
        setFiles((prev) => prev.map((f) => (f.id === file.id ? updated : f)));
      } else if (renameModal.mode === "folder" && renameModal.targetFolderPath) {
        const folder = folders.find((f) => f.path === renameModal.targetFolderPath);
        if (!folder) return;
        const { folder: uf, files: uFiles, folders: uFolders } = await renameFolder(folder, newName, files, folders);
        setFolders((prev) => prev.map((f) => {
          const match = uFolders.find((u) => u.id === f.id);
          return match ?? (f.id === folder.id ? uf : f);
        }));
        setFiles((prev) => prev.map((f) => uFiles.find((u) => u.id === f.id) ?? f));
      }
    } catch (e) {
      console.error("[CodeIDE] Rename:", e);
    }
  }, [renameModal, files, folders]);

  const handleDelete = useCallback(async () => {
    setDeleteModal((p) => ({ ...p, visible: false }));
    try {
      if (deleteModal.mode === "file" && deleteModal.targetFileId) {
        const file = files.find((f) => f.id === deleteModal.targetFileId);
        if (!file) return;
        await deleteFilePermanently(file);
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
        closeTab(file.id);
      } else if (deleteModal.mode === "folder" && deleteModal.targetFolderPath) {
        const folder = folders.find((f) => f.path === deleteModal.targetFolderPath);
        if (!folder) return;
        const { deletedFileIds, deletedFolderIds } = await deleteFolderPermanently(folder, files, folders);
        setFiles((prev) => prev.filter((f) => !deletedFileIds.includes(f.id)));
        setFolders((prev) => prev.filter((f) => !deletedFolderIds.includes(f.id)));
        deletedFileIds.forEach((id) => closeTab(id));
      }
    } catch (e) {
      console.error("[CodeIDE] Delete:", e);
    }
  }, [deleteModal, files, folders, closeTab]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="code-ide-loading">
        <div className="code-ide-spinner-lg" />
        <span>Loading Code IDE…</span>
      </div>
    );
  }

  return (
    <div className="code-ide-root">

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="code-ide-toolbar">
        <div className="code-ide-toolbar-left">
          <Link href="/practice" className="code-ide-back-btn" title="Back">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="code-ide-breadcrumb">
            <FileCode2 className="w-4 h-4 text-blue-400" />
            <span>Code Playground</span>
          </div>
        </div>

        <div className="code-ide-toolbar-center">
          <select
            className="code-ide-lang-select"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as CodeLanguage)}
          >
            {CODE_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="code-ide-toolbar-right">
          <button
            className={`code-ide-btn-ghost ${showStdin ? "active" : ""}`}
            onClick={() => setShowStdin((v) => !v)}
            title="Toggle stdin"
          >
            <span style={{fontSize:'11px', fontFamily:'monospace', opacity:0.8}}>⌨</span>
            <span className="hidden sm:inline">Stdin</span>
          </button>

          <button
            className="code-ide-btn-ghost"
            onClick={resetProject}
            title="Reset to starter code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            className={`code-ide-run-btn ${isRunning ? "running" : ""}`}
            onClick={runCode}
            disabled={isRunning}
            title="Run (Ctrl+Enter)"
          >
            {isRunning ? (
              <span className="code-ide-spinner-sm" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunning ? "Running…" : "Run Code"}</span>
          </button>
        </div>
      </div>

      {/* ── Stdin ───────────────────────────────────────────────── */}
      {showStdin && (
        <div className="code-ide-stdin-bar">
          <span className="code-ide-stdin-label">stdin:</span>
          <textarea
            className="code-ide-stdin-textarea"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Enter program input here (one line per value)…"
            rows={2}
            spellCheck={false}
          />
        </div>
      )}

      {/* ── Workspace (Explorer + Editor — full width) ──────────── */}
      <div className="code-ide-workspace">

        {/* LEFT: Explorer */}
        <div className="code-ide-sidebar">
          <Explorer
            projectName={project?.name ?? "project"}
            nodes={tree}
            activeFileId={activeFileId}
            onSelectFile={selectFile}
            onNewFile={(folderPath) => setNewItemModal({ visible: true, mode: "file", contextPath: folderPath })}
            onNewFolder={(parentPath) => setNewItemModal({ visible: true, mode: "folder", contextPath: parentPath })}
            onContextMenu={openContextMenu}
            onRootContextMenu={(e) => openContextMenu(e, { type: "root" })}
          />
        </div>

        {/* CENTER: Monaco editor takes full remaining width */}
        <div className="code-ide-editor-col code-ide-editor-full">
          <EditorTabs
            tabs={tabs}
            files={files}
            activeFileId={activeFileId}
            onSelect={selectFile}
            onClose={closeTab}
          />
          <div className="code-ide-monaco-area">
            <MonacoWorkspace
              files={files}
              activeFileId={activeFileId}
              onContentChange={handleContentChange}
            />
          </div>
        </div>
      </div>

      {/* ── VS Code-style bottom panel (resizable) ───────────────── */}
      <div
        className="code-ide-bottom-area"
        style={{ height: isBottomCollapsed ? 32 : bottomHeight }}
      >
        {/* Drag handle — only visible when not collapsed */}
        {!isBottomCollapsed && (
          <div
            className="code-ide-drag-handle"
            onMouseDown={handleDragStart}
            title="Drag to resize"
          />
        )}

        <BottomPanel
          activeTab={bottomTab}
          onTabChange={setBottomTab}
          messages={consoleMessages}
          problems={problems}
          onClearConsole={() => setConsoleMessages([])}
          execResult={execResult}
          isRunning={isRunning}
          isCollapsed={isBottomCollapsed}
          onToggleCollapse={toggleBottomCollapse}
          projectFiles={files}
          projectName={project?.name}
        />
      </div>

      {/* ── Overlays ────────────────────────────────────────────── */}
      <ContextMenu state={contextMenu} actions={contextMenuActions} onClose={closeContextMenu} />

      <NewItemModal
        visible={newItemModal.visible}
        mode={newItemModal.mode}
        contextPath={newItemModal.contextPath}
        onConfirm={handleNewItem}
        onCancel={() => setNewItemModal((p) => ({ ...p, visible: false }))}
      />

      <RenameModal
        visible={renameModal.visible}
        mode={renameModal.mode}
        currentName={renameModal.currentName}
        onConfirm={handleRename}
        onCancel={() => setRenameModal((p) => ({ ...p, visible: false }))}
      />

      <DeleteConfirmModal
        visible={deleteModal.visible}
        mode={deleteModal.mode}
        name={deleteModal.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal((p) => ({ ...p, visible: false }))}
      />
    </div>
  );
}
