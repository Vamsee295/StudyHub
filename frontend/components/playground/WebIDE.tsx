"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import dynamic from "next/dynamic";

import type {
  PlaygroundProject,
  ProjectFile,
  ProjectFolder,
  EditorTab,
  ConsoleMessage,
  ProblemEntry,
  ContextMenuState,
  ContextMenuTarget,
  BottomPanelTab,
  SaveStatus,
  PaletteCommand,
} from "@/types/playground";

import Explorer from "./Explorer/Explorer";
import EditorTabs from "./Editor/EditorTabs";
import BottomPanel from "./BottomPanel/BottomPanel";
import ContextMenu from "./Explorer/ContextMenu";
import type { ContextMenuAction } from "./Explorer/ContextMenu";
import NewItemModal, {
  RenameModal,
  DeleteConfirmModal,
} from "./Modals/NewItemModal";
import CommandPalette from "./CommandPalette/CommandPalette";
import LivePreview from "./Preview/LivePreview";

import * as vfs from "@/lib/services/playground/virtualFileSystem";
import * as persist from "@/lib/services/playground/persistence";
import { buildPreviewDocument } from "@/lib/services/playground/dependencyResolver";
import { exportProjectAsZip } from "@/lib/services/playground/zipExporter";
import { buildTree } from "@/lib/services/playground/virtualFileSystem";

// Dynamically import Monaco to avoid SSR
const MonacoWorkspace = dynamic(
  () => import("./Editor/MonacoWorkspace"),
  { ssr: false }
);

// ── Autosave debounce (ms) ─────────────────────────────────────────────────────
const AUTOSAVE_DELAY = 800;

// ── Default project ID (single-project mode for now) ──────────────────────────
const DEFAULT_PROJECT_ID = "studyhub-web-ide-default";

export default function WebIDE() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [project, setProject] = useState<PlaygroundProject | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [folders, setFolders] = useState<ProjectFolder[]>([]);
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [problems, setProblems] = useState<ProblemEntry[]>([]);
  const [bottomTab, setBottomTab] = useState<BottomPanelTab>("console");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [explorerVisible, setExplorerVisible] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [bottomVisible, setBottomVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [paletteVisible, setPaletteVisible] = useState(false);

  // Modals
  const [newItemModal, setNewItemModal] = useState<{
    visible: boolean;
    mode: "file" | "folder";
    contextPath?: string;
  }>({ visible: false, mode: "file" });
  const [renameModal, setRenameModal] = useState<{
    visible: boolean;
    mode: "file" | "folder";
    targetId: string;
    currentName: string;
  }>({ visible: false, mode: "file", targetId: "", currentName: "" });
  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean;
    mode: "file" | "folder";
    targetId: string;
    name: string;
  }>({ visible: false, mode: "file", targetId: "", name: "" });

  // Context menu
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    target: null,
  });

  // Autosave
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChanges = useRef<Map<string, string>>(new Map());

  // ── Bootstrap: load or create project ─────────────────────────────────────
  useEffect(() => {
    async function bootstrap() {
      try {
        const snapshot = await persist.loadProjectSnapshot(DEFAULT_PROJECT_ID);

        if (snapshot) {
          const { project: proj, files: f, folders: fo } = snapshot;
          // Deduplicate by path & id
          const uniqueF = Array.from(new Map(f.map((item) => [item.path, item])).values());
          const uniqueFo = Array.from(new Map(fo.map((item) => [item.path, item])).values());

          setProject(proj);
          setFiles(uniqueF);
          setFolders(uniqueFo);

          // Restore open tabs
          const validTabs = proj.openFileIds
            .filter((id) => uniqueF.some((fi) => fi.id === id))
            .map((id) => ({ fileId: id, isDirty: false }));
          setTabs(validTabs);

          const active = proj.activeFileId && uniqueF.some((fi) => fi.id === proj.activeFileId)
            ? proj.activeFileId
            : validTabs[0]?.fileId ?? null;
          setActiveFileId(active);
        } else {
          // Create new default project
          const now = Date.now();
          const proj: PlaygroundProject = {
            id: DEFAULT_PROJECT_ID,
            name: "My Project",
            activeFileId: null,
            openFileIds: [],
            createdAt: now,
            updatedAt: now,
          };

          const { files: starterFiles, folders: starterFolders } =
            vfs.createStarterProject(DEFAULT_PROJECT_ID);

          await persist.saveProjectSnapshot({
            project: proj,
            files: starterFiles,
            folders: starterFolders,
          });
          persist.saveLastProjectId(DEFAULT_PROJECT_ID);

          setProject(proj);
          setFiles(starterFiles);
          setFolders(starterFolders);

          // Open index.html by default
          const indexFile = starterFiles.find((f) => f.name === "index.html");
          if (indexFile) {
            const initialTab = { fileId: indexFile.id, isDirty: false };
            setTabs([initialTab]);
            setActiveFileId(indexFile.id);
            await persist.saveProject({
              ...proj,
              activeFileId: indexFile.id,
              openFileIds: [indexFile.id],
            });
          }
        }
      } catch (err) {
        console.error("[WebIDE] Bootstrap error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();
  }, []);

  // ── Derived tree ───────────────────────────────────────────────────────────
  const tree = useMemo(() => buildTree(files, folders), [files, folders]);

  // ── Save project state to IDB ──────────────────────────────────────────────
  const persistProjectState = useCallback(
    async (overrides?: Partial<PlaygroundProject>) => {
      if (!project) return;
      const updated = {
        ...project,
        activeFileId,
        openFileIds: tabs.map((t) => t.fileId),
        updatedAt: Date.now(),
        ...overrides,
      };
      setProject(updated);
      await persist.saveProject(updated);
    },
    [project, activeFileId, tabs]
  );

  // Persist state when tabs/active file changes
  useEffect(() => {
    if (!project || isLoading) return;
    persistProjectState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFileId, tabs]);

  // ── Autosave file content ──────────────────────────────────────────────────
  const scheduleAutosave = useCallback((fileId: string, content: string) => {
    pendingChanges.current.set(fileId, content);
    setSaveStatus("unsaved");

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const changes = new Map(pendingChanges.current);
        pendingChanges.current.clear();

        for (const [id, newContent] of changes.entries()) {
          setFiles((prev) => {
            const file = prev.find((f) => f.id === id);
            if (!file) return prev;
            const updated = { ...file, content: newContent, updatedAt: Date.now() };
            persist.saveFile(updated); // non-blocking
            return prev.map((f) => (f.id === id ? updated : f));
          });
        }
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, AUTOSAVE_DELAY);
  }, []);

  const handleContentChange = useCallback(
    (fileId: string, content: string) => {
      scheduleAutosave(fileId, content);
      setTabs((prev) =>
        prev.map((t) => (t.fileId === fileId ? { ...t, isDirty: true } : t))
      );
    },
    [scheduleAutosave]
  );

  // ── File selection ─────────────────────────────────────────────────────────
  const openFile = useCallback((fileId: string) => {
    setActiveFileId(fileId);
    setTabs((prev) => {
      if (prev.some((t) => t.fileId === fileId)) {
        return prev;
      }
      return [...prev, { fileId, isDirty: false }];
    });
  }, []);

  const closeTab = useCallback(
    (fileId: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.fileId === fileId);
        const next = prev.filter((t) => t.fileId !== fileId);
        if (activeFileId === fileId) {
          const newActive =
            next[Math.min(idx, next.length - 1)]?.fileId ?? null;
          setActiveFileId(newActive);
        }
        return next;
      });
    },
    [activeFileId]
  );

  // ── Run code ───────────────────────────────────────────────────────────────
  const runCode = useCallback(() => {
    // Flush any pending in-flight changes
    const snapshotFiles = [...files];
    for (const [id, content] of pendingChanges.current.entries()) {
      const idx = snapshotFiles.findIndex((f) => f.id === id);
      if (idx >= 0) {
        snapshotFiles[idx] = { ...snapshotFiles[idx], content };
      }
    }

    // Revoke old blob URL
    if (blobUrl) URL.revokeObjectURL(blobUrl);

    setConsoleMessages([]);

    const { blobUrl: newUrl, warnings } = buildPreviewDocument(snapshotFiles);
    setBlobUrl(newUrl);

    if (warnings.length > 0) {
      setProblems(
        warnings.map((w, i) => ({
          id: `warn-${i}`,
          severity: "warning" as const,
          message: w,
        }))
      );
    } else {
      setProblems([]);
    }

    setBottomTab("console");
  }, [files, blobUrl]);

  // ── Console message handler ────────────────────────────────────────────────
  const handleConsoleMessage = useCallback(
    (msg: Omit<ConsoleMessage, "id" | "timestamp">) => {
      setConsoleMessages((prev) => [
        ...prev,
        {
          ...msg,
          id: Math.random().toString(36).slice(2),
          timestamp: Date.now(),
        },
      ]);
    },
    []
  );

  // ── File/Folder creation ───────────────────────────────────────────────────
  const handleCreateItem = useCallback(
    async (path: string) => {
      if (!project) return;
      const mode = newItemModal.mode;
      setNewItemModal((m) => ({ ...m, visible: false }));

      if (mode === "file") {
        const newFolders = await vfs.ensureAncestorFolders(
          project.id,
          path,
          folders
        );
        const newFile = await vfs.createFile(project.id, path);
        setFolders((prev) => [...prev, ...newFolders]);
        setFiles((prev) => [...prev, newFile]);
        openFile(newFile.id);
      } else {
        const folder = await vfs.createFolder(project.id, path);
        setFolders((prev) => [...prev, folder]);
      }
    },
    [project, newItemModal.mode, folders, openFile]
  );

  // ── Rename ─────────────────────────────────────────────────────────────────
  const handleRename = useCallback(
    async (newName: string) => {
      setRenameModal((m) => ({ ...m, visible: false }));
      if (!renameModal.targetId) return;

      if (renameModal.mode === "file") {
        const file = files.find((f) => f.id === renameModal.targetId);
        if (!file) return;
        const updated = await vfs.renameFile(file, newName, files);
        setFiles((prev) => prev.map((f) => (f.id === file.id ? updated : f)));
      } else {
        const folder = folders.find((f) => f.id === renameModal.targetId);
        if (!folder) return;
        const { folder: updated, files: updatedFiles, folders: updatedFolders } =
          await vfs.renameFolder(folder, newName, files, folders);
        setFolders((prev) =>
          prev.map((fo) => {
            const uf = updatedFolders.find((u) => u.id === fo.id);
            return uf ?? (fo.id === folder.id ? updated : fo);
          })
        );
        setFiles((prev) =>
          prev.map((fi) => {
            const uf = updatedFiles.find((u) => u.id === fi.id);
            return uf ?? fi;
          })
        );
      }
    },
    [renameModal, files, folders]
  );

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    setDeleteModal((m) => ({ ...m, visible: false }));
    if (!deleteModal.targetId) return;

    if (deleteModal.mode === "file") {
      const file = files.find((f) => f.id === deleteModal.targetId);
      if (!file) return;
      await vfs.deleteFilePermanently(file);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      closeTab(file.id);
    } else {
      const folder = folders.find((f) => f.id === deleteModal.targetId);
      if (!folder) return;
      const { deletedFileIds, deletedFolderIds } =
        await vfs.deleteFolderPermanently(folder, files, folders);
      setFiles((prev) => prev.filter((f) => !deletedFileIds.includes(f.id)));
      setFolders((prev) => prev.filter((f) => !deletedFolderIds.includes(f.id)));
      deletedFileIds.forEach(closeTab);
    }
  }, [deleteModal, files, folders, closeTab]);

  // ── Context menu ───────────────────────────────────────────────────────────
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, target: ContextMenuTarget) => {
      e.preventDefault();
      setContextMenu({ visible: true, x: e.clientX, y: e.clientY, target });
    },
    []
  );

  const buildContextActions = (): ContextMenuAction[] => {
    if (!contextMenu.target) return [];

    const target = contextMenu.target;

    if (target.type === "file") {
      const file = files.find((f) => f.id === target.fileId);
      if (!file) return [];
      return [
        {
          label: "Rename",
          icon: "✏️",
          action: () =>
            setRenameModal({
              visible: true,
              mode: "file",
              targetId: file.id,
              currentName: file.name,
            }),
        },
        {
          label: "Delete",
          icon: "🗑️",
          danger: true,
          action: () =>
            setDeleteModal({
              visible: true,
              mode: "file",
              targetId: file.id,
              name: file.name,
            }),
        },
      ];
    }

    if (target.type === "folder") {
      const folder = folders.find((f) => f.path === target.folderPath);
      if (!folder) return [];
      return [
        {
          label: "New File Here",
          icon: "📄",
          action: () =>
            setNewItemModal({ visible: true, mode: "file", contextPath: folder.path }),
        },
        {
          label: "New Folder Here",
          icon: "📁",
          action: () =>
            setNewItemModal({ visible: true, mode: "folder", contextPath: folder.path }),
        },
        { label: "---", action: () => {} },
        {
          label: "Rename",
          icon: "✏️",
          action: () =>
            setRenameModal({
              visible: true,
              mode: "folder",
              targetId: folder.id,
              currentName: folder.name,
            }),
        },
        {
          label: "Delete",
          icon: "🗑️",
          danger: true,
          action: () =>
            setDeleteModal({
              visible: true,
              mode: "folder",
              targetId: folder.id,
              name: folder.name,
            }),
        },
      ];
    }

    // root
    return [
      {
        label: "New File",
        icon: "📄",
        action: () => setNewItemModal({ visible: true, mode: "file" }),
      },
      {
        label: "New Folder",
        icon: "📁",
        action: () => setNewItemModal({ visible: true, mode: "folder" }),
      },
    ];
  };

  // ── Command palette commands ───────────────────────────────────────────────
  const paletteCommands: PaletteCommand[] = useMemo(
    () => [
      {
        id: "run",
        label: "Run Code",
        shortcut: "Ctrl+Enter",
        action: runCode,
      },
      {
        id: "new-file",
        label: "New File",
        shortcut: "...",
        action: () => setNewItemModal({ visible: true, mode: "file" }),
      },
      {
        id: "new-folder",
        label: "New Folder",
        shortcut: "...",
        action: () => setNewItemModal({ visible: true, mode: "folder" }),
      },
      {
        id: "toggle-explorer",
        label: "Toggle Explorer",
        shortcut: "Ctrl+B",
        action: () => setExplorerVisible((v) => !v),
      },
      {
        id: "toggle-preview",
        label: "Toggle Preview",
        shortcut: "Ctrl+Shift+P",
        action: () => setPreviewVisible((v) => !v),
      },
      {
        id: "toggle-console",
        label: "Toggle Console",
        shortcut: "Ctrl+`",
        action: () => setBottomVisible((v) => !v),
      },
      {
        id: "export",
        label: "Export Project as ZIP",
        shortcut: "...",
        action: () =>
          exportProjectAsZip(project?.name ?? "project", files, folders),
      },
    ],
    [runCode, project, files, folders]
  );

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === "Enter") {
        e.preventDefault();
        runCode();
      } else if (ctrl && e.key === "b") {
        e.preventDefault();
        setExplorerVisible((v) => !v);
      } else if (ctrl && e.key === "p" && !e.shiftKey) {
        e.preventDefault();
        setPaletteVisible(true);
      } else if (ctrl && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setPaletteVisible(true);
      } else if (ctrl && e.key === "`") {
        e.preventDefault();
        setBottomVisible((v) => !v);
      } else if (e.key === "Escape" && paletteVisible) {
        setPaletteVisible(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runCode, paletteVisible]);

  // ── Active file info ───────────────────────────────────────────────────────
  const activeFile = files.find((f) => f.id === activeFileId) ?? null;

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="ide-loading">
        <div className="ide-loading-spinner" />
        <p>Loading Web IDE...</p>
      </div>
    );
  }

  return (
    <div className="ide-root">
      {/* ── Header ── */}
      <header className="ide-header">
        <div className="ide-header-left">
          <button
            className="ide-header-icon-btn"
            title="Toggle Explorer (Ctrl+B)"
            onClick={() => setExplorerVisible((v) => !v)}
          >
            ☰
          </button>
          <div className="ide-header-breadcrumb">
            <span className="ide-header-project">{project?.name}</span>
            {activeFile && (
              <>
                <span className="ide-header-sep">›</span>
                <span className="ide-header-file">{activeFile.path}</span>
              </>
            )}
          </div>
        </div>

        <div className="ide-header-center">
          <span className="ide-header-logo">
            StudyHub <span>Web IDE</span>
          </span>
        </div>

        <div className="ide-header-right">
          <span
            className={`ide-save-status ide-save-${saveStatus}`}
            title="Autosave status"
          >
            {saveStatus === "saved" && "✓ Saved"}
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "unsaved" && "● Unsaved"}
            {saveStatus === "error" && "⚠ Save error"}
          </span>

          <button
            className="ide-header-btn ide-header-btn-ghost"
            onClick={() => setPreviewVisible((v) => !v)}
            title="Toggle Preview"
          >
            {previewVisible ? "Hide Preview" : "Show Preview"}
          </button>

          <button
            className="ide-header-btn ide-header-btn-primary"
            onClick={runCode}
            title="Run Code (Ctrl+Enter)"
          >
            ▶ Run
          </button>

          <button
            className="ide-header-btn ide-header-btn-ghost"
            onClick={() =>
              exportProjectAsZip(project?.name ?? "project", files, folders)
            }
            title="Export as ZIP"
          >
            ⬇ Export
          </button>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="ide-body">
        {/* Explorer sidebar */}
        {explorerVisible && (
          <aside className="ide-sidebar">
            <Explorer
              projectName={project?.name ?? "Project"}
              nodes={tree}
              activeFileId={activeFileId}
              onSelectFile={openFile}
              onNewFile={(p) =>
                setNewItemModal({ visible: true, mode: "file", contextPath: p })
              }
              onNewFolder={(p) =>
                setNewItemModal({ visible: true, mode: "folder", contextPath: p })
              }
              onContextMenu={handleContextMenu}
              onRootContextMenu={(e) =>
                handleContextMenu(e, { type: "root" })
              }
            />
          </aside>
        )}

        {/* Editor pane */}
        <div className="ide-editor-pane">
          <EditorTabs
            tabs={tabs}
            files={files}
            activeFileId={activeFileId}
            onSelect={openFile}
            onClose={closeTab}
          />

          <div className="ide-editor-area">
            {activeFileId ? (
              <MonacoWorkspace
                files={files}
                activeFileId={activeFileId}
                onContentChange={handleContentChange}
              />
            ) : (
              <div className="ide-editor-welcome">
                <div className="ide-editor-welcome-inner">
                  <h2>StudyHub Web IDE</h2>
                  <p>Select a file from the Explorer to start editing.</p>
                  <button
                    className="ide-header-btn ide-header-btn-primary"
                    onClick={runCode}
                  >
                    ▶ Run Project
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom panel */}
          {bottomVisible && (
            <div className="ide-bottom-area">
              <div
                className="ide-bottom-resize-handle"
                onMouseDown={() => {}}
                title="Drag to resize"
              />
              <BottomPanel
                activeTab={bottomTab}
                onTabChange={setBottomTab}
                messages={consoleMessages}
                problems={problems}
                onClearConsole={() => setConsoleMessages([])}
              />
            </div>
          )}
        </div>

        {/* Preview pane */}
        {previewVisible && (
          <div className="ide-preview-pane">
            <div className="ide-preview-header">
              <span>LIVE PREVIEW</span>
              <button
                className="ide-preview-run-btn"
                onClick={runCode}
                title="Refresh preview"
              >
                ↻ Refresh
              </button>
            </div>
            <LivePreview
              blobUrl={blobUrl}
              onConsoleMessage={handleConsoleMessage}
            />
          </div>
        )}
      </div>

      {/* ── Overlays ── */}
      <ContextMenu
        state={contextMenu}
        actions={buildContextActions()}
        onClose={() => setContextMenu((m) => ({ ...m, visible: false }))}
      />

      <NewItemModal
        visible={newItemModal.visible}
        mode={newItemModal.mode}
        contextPath={newItemModal.contextPath}
        onConfirm={handleCreateItem}
        onCancel={() => setNewItemModal((m) => ({ ...m, visible: false }))}
      />

      <RenameModal
        visible={renameModal.visible}
        mode={renameModal.mode}
        currentName={renameModal.currentName}
        onConfirm={handleRename}
        onCancel={() => setRenameModal((m) => ({ ...m, visible: false }))}
      />

      <DeleteConfirmModal
        visible={deleteModal.visible}
        mode={deleteModal.mode}
        name={deleteModal.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal((m) => ({ ...m, visible: false }))}
      />

      <CommandPalette
        visible={paletteVisible}
        commands={paletteCommands}
        files={files.map((f) => ({ id: f.id, name: f.name, path: f.path }))}
        onClose={() => setPaletteVisible(false)}
        onSelectFile={(id) => {
          openFile(id);
          setPaletteVisible(false);
        }}
      />
    </div>
  );
}
