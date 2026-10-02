/**
 * StudyHub Web IDE — Virtual File System Service
 *
 * Manages all file/folder operations and provides tree building utilities.
 * All mutations are saved to IndexedDB via the persistence service.
 */

import type {
  ProjectFile,
  ProjectFolder,
  PlaygroundProject,
  TreeNode,
  SupportedLanguage,
} from "@/types/playground";
import * as db from "./persistence";

// ── UUID helper (browser-safe) ─────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Language detection ─────────────────────────────────────────────────────────

export function detectLanguage(filename: string): SupportedLanguage {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, SupportedLanguage> = {
    html: "html",
    htm: "html",
    css: "css",
    js: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    md: "markdown",
    markdown: "markdown",
    xml: "xml",
    svg: "xml",
    txt: "plaintext",
    py: "python",
    java: "java",
    c: "c",
    h: "c",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    hpp: "cpp",
  };
  return map[ext] ?? "plaintext";
}

// ── Path helpers ───────────────────────────────────────────────────────────────

/** Normalize path to forward-slash, no leading slash */
export function normalizePath(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
}

/** Get parent folder path of a given path */
export function parentPath(p: string): string {
  const parts = normalizePath(p).split("/");
  parts.pop();
  return parts.join("/");
}

/** Get just the filename from a path */
export function basename(p: string): string {
  const parts = normalizePath(p).split("/");
  return parts[parts.length - 1] ?? "";
}

/** All ancestor folder paths of a path */
export function ancestorPaths(p: string): string[] {
  const parts = normalizePath(p).split("/");
  const ancestors: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    ancestors.push(parts.slice(0, i).join("/"));
  }
  return ancestors;
}

// ── Tree builder ───────────────────────────────────────────────────────────────

export function buildTree(files: ProjectFile[], folders: ProjectFolder[]): TreeNode[] {
  // Deduplicate files and folders by id and path
  const seenFolderPaths = new Set<string>();
  const seenFolderIds = new Set<string>();
  const uniqueFolders: ProjectFolder[] = [];

  for (const folder of folders) {
    const norm = normalizePath(folder.path);
    if (!seenFolderPaths.has(norm) && !seenFolderIds.has(folder.id)) {
      seenFolderPaths.add(norm);
      seenFolderIds.add(folder.id);
      uniqueFolders.push({ ...folder, path: norm });
    }
  }

  const seenFilePaths = new Set<string>();
  const seenFileIds = new Set<string>();
  const uniqueFiles: ProjectFile[] = [];

  for (const file of files) {
    const norm = normalizePath(file.path);
    if (!seenFilePaths.has(norm) && !seenFileIds.has(file.id)) {
      seenFilePaths.add(norm);
      seenFileIds.add(file.id);
      uniqueFiles.push({ ...file, path: norm });
    }
  }

  const folderMap = new Map<string, TreeNode>();

  // Create folder nodes
  for (const folder of uniqueFolders) {
    folderMap.set(folder.path, {
      kind: "folder",
      folder,
      children: [],
    });
  }

  const roots: TreeNode[] = [];

  // Place folders into parent folders or root
  const sortedFolders = [...uniqueFolders].sort((a, b) => a.path.localeCompare(b.path));

  for (const folder of sortedFolders) {
    const node = folderMap.get(folder.path);
    if (!node) continue;
    const parent = parentPath(folder.path);

    if (parent === "" || !folderMap.has(parent)) {
      roots.push(node);
    } else {
      const parentNode = folderMap.get(parent) as { kind: "folder"; children: TreeNode[] };
      parentNode.children.push(node);
    }
  }

  // Place files into folder nodes or root
  for (const file of uniqueFiles) {
    const fileNode: TreeNode = { kind: "file", file };
    const parent = parentPath(file.path);

    if (parent === "" || !folderMap.has(parent)) {
      roots.push(fileNode);
    } else {
      const parentNode = folderMap.get(parent) as { kind: "folder"; children: TreeNode[] };
      parentNode.children.push(fileNode);
    }
  }

  // Sort: folders first, then files, alphabetically
  function sortNodes(nodes: TreeNode[]): TreeNode[] {
    return nodes.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
      const aName = a.kind === "folder" ? a.folder.name : a.file.name;
      const bName = b.kind === "folder" ? b.folder.name : b.file.name;
      return aName.localeCompare(bName);
    });
  }

  function sortTree(nodes: TreeNode[]): TreeNode[] {
    return sortNodes(nodes).map((n) => {
      if (n.kind === "folder") {
        return { ...n, children: sortTree(n.children) };
      }
      return n;
    });
  }

  return sortTree(roots);
}

// ── Default starter project ────────────────────────────────────────────────────

export function createStarterProject(projectId: string): {
  files: ProjectFile[];
  folders: ProjectFolder[];
} {
  const now = Date.now();

  const folders: ProjectFolder[] = [
    { id: generateId(), projectId, path: "css", name: "css", createdAt: now },
    { id: generateId(), projectId, path: "js", name: "js", createdAt: now },
  ];

  const files: ProjectFile[] = [
    {
      id: generateId(),
      projectId,
      path: "index.html",
      name: "index.html",
      language: "html",
      createdAt: now,
      updatedAt: now,
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StudyHub IDE</title>
  <link rel="stylesheet" href="./css/main.css">
</head>
<body>

  <h1 id="title">StudyHub IDE</h1>
  <p>Start building your project!</p>
  <button id="btn">Click Me</button>

  <script type="module" src="./js/main.js"><\/script>
</body>
</html>`,
    },
    {
      id: generateId(),
      projectId,
      path: "css/main.css",
      name: "main.css",
      language: "css",
      createdAt: now,
      updatedAt: now,
      content: `/* StudyHub IDE — Main Styles */

body {
  font-family: Arial, sans-serif;
  padding: 50px;
  background-color: #f8fafc;
  color: #0f172a;
}

h1 {
  color: #2563eb;
}

button {
  padding: 12px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

button:hover {
  background: #1d4ed8;
}`,
    },
    {
      id: generateId(),
      projectId,
      path: "js/main.js",
      name: "main.js",
      language: "javascript",
      createdAt: now,
      updatedAt: now,
      content: `import { changeTitle } from "./utils.js";

document.getElementById("btn").addEventListener("click", () => {
  changeTitle();
  console.log("Button clicked!");
});`,
    },
    {
      id: generateId(),
      projectId,
      path: "js/utils.js",
      name: "utils.js",
      language: "javascript",
      createdAt: now,
      updatedAt: now,
      content: `/**
 * Utility functions
 */

export function changeTitle() {
  const title = document.getElementById("title");
  if (title) {
    title.textContent = "JavaScript Works!";
  }
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}`,
    },
  ];

  return { files, folders };
}

// ── VFS Operations ─────────────────────────────────────────────────────────────

export async function createFile(
  projectId: string,
  path: string,
  content = ""
): Promise<ProjectFile> {
  const norm = normalizePath(path);
  const file: ProjectFile = {
    id: generateId(),
    projectId,
    path: norm,
    name: basename(norm),
    content,
    language: detectLanguage(basename(norm)),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await db.saveFile(file);
  return file;
}

export async function createFolder(projectId: string, path: string): Promise<ProjectFolder> {
  const norm = normalizePath(path);
  const folder: ProjectFolder = {
    id: generateId(),
    projectId,
    path: norm,
    name: basename(norm),
    createdAt: Date.now(),
  };
  await db.saveFolder(folder);
  return folder;
}

export async function updateFileContent(file: ProjectFile, content: string): Promise<ProjectFile> {
  const updated = { ...file, content, updatedAt: Date.now() };
  await db.saveFile(updated);
  return updated;
}

export async function renameFile(
  file: ProjectFile,
  newName: string,
  allFiles: ProjectFile[]
): Promise<ProjectFile> {
  const parent = parentPath(file.path);
  const newPath = parent ? parent + "/" + newName : newName;
  const norm = normalizePath(newPath);

  const updated: ProjectFile = {
    ...file,
    path: norm,
    name: newName,
    language: detectLanguage(newName),
    updatedAt: Date.now(),
  };
  await db.saveFile(updated);
  return updated;
}

export async function renameFolder(
  folder: ProjectFolder,
  newName: string,
  allFiles: ProjectFile[],
  allFolders: ProjectFolder[]
): Promise<{ folder: ProjectFolder; files: ProjectFile[]; folders: ProjectFolder[] }> {
  const parent = parentPath(folder.path);
  const newPath = parent ? parent + "/" + newName : newName;
  const oldPath = folder.path;
  const norm = normalizePath(newPath);

  const updatedFolder: ProjectFolder = {
    ...folder,
    path: norm,
    name: newName,
  };

  // Update all child files
  const updatedFiles: ProjectFile[] = [];
  for (const file of allFiles) {
    if (file.path.startsWith(oldPath + "/") || file.path === oldPath) {
      const relPath = file.path.slice(oldPath.length);
      const updated = { ...file, path: norm + relPath, updatedAt: Date.now() };
      await db.saveFile(updated);
      updatedFiles.push(updated);
    }
  }

  // Update all child folders
  const updatedFolders: ProjectFolder[] = [];
  for (const f of allFolders) {
    if (f.path.startsWith(oldPath + "/") && f.id !== folder.id) {
      const relPath = f.path.slice(oldPath.length);
      const updated = { ...f, path: norm + relPath };
      await db.saveFolder(updated);
      updatedFolders.push(updated);
    }
  }

  await db.saveFolder(updatedFolder);
  return { folder: updatedFolder, files: updatedFiles, folders: updatedFolders };
}

export async function deleteFilePermanently(file: ProjectFile): Promise<void> {
  await db.deleteFile(file.id);
}

export async function deleteFolderPermanently(
  folder: ProjectFolder,
  allFiles: ProjectFile[],
  allFolders: ProjectFolder[]
): Promise<{ deletedFileIds: string[]; deletedFolderIds: string[] }> {
  const deletedFileIds: string[] = [];
  const deletedFolderIds: string[] = [];

  // Delete all child files
  for (const file of allFiles) {
    if (file.path === folder.path || file.path.startsWith(folder.path + "/")) {
      await db.deleteFile(file.id);
      deletedFileIds.push(file.id);
    }
  }

  // Delete all child folders
  for (const f of allFolders) {
    if (f.path === folder.path || f.path.startsWith(folder.path + "/")) {
      await db.deleteFolder(f.id);
      deletedFolderIds.push(f.id);
    }
  }

  return { deletedFileIds, deletedFolderIds };
}

export async function ensureAncestorFolders(
  projectId: string,
  filePath: string,
  existingFolders: ProjectFolder[]
): Promise<ProjectFolder[]> {
  const ancestors = ancestorPaths(filePath);
  const existingPaths = new Set(existingFolders.map((f) => f.path));
  const newFolders: ProjectFolder[] = [];

  for (const ancestor of ancestors) {
    if (!existingPaths.has(ancestor)) {
      const folder = await createFolder(projectId, ancestor);
      newFolders.push(folder);
      existingPaths.add(ancestor);
    }
  }

  return newFolders;
}

export async function duplicateFile(
  file: ProjectFile,
  allFiles: ProjectFile[]
): Promise<ProjectFile> {
  const parent = parentPath(file.path);
  const extIndex = file.name.lastIndexOf(".");
  const baseName = extIndex !== -1 ? file.name.slice(0, extIndex) : file.name;
  const ext = extIndex !== -1 ? file.name.slice(extIndex) : "";

  let candidateName = `${baseName} copy${ext}`;
  let counter = 2;
  const existingNames = new Set(
    allFiles
      .filter((f) => parentPath(f.path) === parent)
      .map((f) => f.name)
  );

  while (existingNames.has(candidateName)) {
    candidateName = `${baseName} copy ${counter}${ext}`;
    counter++;
  }

  const newPath = parent ? `${parent}/${candidateName}` : candidateName;
  const newFile: ProjectFile = {
    id: generateId(),
    projectId: file.projectId,
    path: normalizePath(newPath),
    name: candidateName,
    content: file.content,
    language: file.language,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await db.saveFile(newFile);
  return newFile;
}

export async function moveItem(
  sourcePath: string,
  targetFolderPath: string,
  allFiles: ProjectFile[],
  allFolders: ProjectFolder[]
): Promise<{ files: ProjectFile[]; folders: ProjectFolder[] }> {
  const normSource = normalizePath(sourcePath);
  const normTarget = normalizePath(targetFolderPath);

  const isFolder = allFolders.some((f) => f.path === normSource);
  const base = basename(normSource);
  const newPath = normTarget ? `${normTarget}/${base}` : base;

  if (normSource === newPath) {
    return { files: allFiles, folders: allFolders };
  }

  if (isFolder) {
    if (normTarget === normSource || normTarget.startsWith(normSource + "/")) {
      return { files: allFiles, folders: allFolders };
    }
    const updatedFoldersList: ProjectFolder[] = [];
    for (const f of allFolders) {
      if (f.path === normSource || f.path.startsWith(normSource + "/")) {
        const rel = f.path.slice(normSource.length);
        const upd = { ...f, path: newPath + rel };
        await db.saveFolder(upd);
        updatedFoldersList.push(upd);
      } else {
        updatedFoldersList.push(f);
      }
    }
    const updatedFilesList: ProjectFile[] = [];
    for (const file of allFiles) {
      if (file.path === normSource || file.path.startsWith(normSource + "/")) {
        const rel = file.path.slice(normSource.length);
        const upd = { ...file, path: newPath + rel, updatedAt: Date.now() };
        await db.saveFile(upd);
        updatedFilesList.push(upd);
      } else {
        updatedFilesList.push(file);
      }
    }
    return { files: updatedFilesList, folders: updatedFoldersList };
  } else {
    const file = allFiles.find((f) => f.path === normSource);
    if (!file) return { files: allFiles, folders: allFolders };
    const updatedFile: ProjectFile = {
      ...file,
      path: newPath,
      updatedAt: Date.now(),
    };
    await db.saveFile(updatedFile);
    return {
      files: allFiles.map((f) => (f.id === file.id ? updatedFile : f)),
      folders: allFolders,
    };
  }
}

