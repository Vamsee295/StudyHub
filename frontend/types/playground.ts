// ============================================================
// StudyHub Web IDE — Core Type Definitions
// ============================================================

export type SupportedLanguage =
  | "html"
  | "css"
  | "javascript"
  | "typescript"
  | "json"
  | "markdown"
  | "xml"
  | "plaintext";

export interface ProjectFile {
  id: string;
  projectId: string;
  path: string;
  name: string;
  content: string;
  language: SupportedLanguage;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectFolder {
  id: string;
  projectId: string;
  path: string;
  name: string;
  createdAt: number;
}

export interface PlaygroundProject {
  id: string;
  name: string;
  activeFileId: string | null;
  openFileIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface TreeFile {
  kind: "file";
  file: ProjectFile;
}

export interface TreeFolder {
  kind: "folder";
  folder: ProjectFolder;
  children: TreeNode[];
}

export type TreeNode = TreeFile | TreeFolder;

export interface EditorTab {
  fileId: string;
  isDirty: boolean;
}

export type ConsoleLevel = "log" | "info" | "warn" | "error";

export interface ConsoleMessage {
  id: string;
  level: ConsoleLevel;
  message: string;
  timestamp: number;
  sourceFile?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export interface ProblemEntry {
  id: string;
  severity: "error" | "warning";
  message: string;
  filePath?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export type ContextMenuTarget =
  | { type: "file"; fileId: string }
  | { type: "folder"; folderPath: string }
  | { type: "root" };

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  target: ContextMenuTarget | null;
}

export interface PaletteCommand {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  action: () => void;
}

export type BottomPanelTab = "console" | "problems" | "output";

export type PreviewViewport = "desktop" | "tablet" | "mobile";

export const IDB_DB_NAME = "StudyHub_WebIDE_DB";
export const IDB_VERSION = 1;

export const IDB_STORES = {
  projects: "projects",
  files: "files",
  folders: "folders",
} as const;
