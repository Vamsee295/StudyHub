/**
 * StudyHub Web IDE — IndexedDB Persistence Service
 *
 * Stores and retrieves the virtual file system across sessions.
 * Uses the native IndexedDB API (no extra wrappers needed for this scale).
 */

import type { PlaygroundProject, ProjectFile, ProjectFolder } from "@/types/playground";
import { IDB_DB_NAME, IDB_VERSION, IDB_STORES } from "@/types/playground";

// ── Internal: Open DB ──────────────────────────────────────────────────────────

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_DB_NAME, IDB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(IDB_STORES.projects)) {
        db.createObjectStore(IDB_STORES.projects, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(IDB_STORES.files)) {
        const fileStore = db.createObjectStore(IDB_STORES.files, { keyPath: "id" });
        fileStore.createIndex("projectId", "projectId", { unique: false });
      }

      if (!db.objectStoreNames.contains(IDB_STORES.folders)) {
        const folderStore = db.createObjectStore(IDB_STORES.folders, { keyPath: "id" });
        folderStore.createIndex("projectId", "projectId", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      _db = (event.target as IDBOpenDBRequest).result;
      resolve(_db);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

// ── Generic helpers ────────────────────────────────────────────────────────────

function txGet<T>(storeName: string, key: string): Promise<T | undefined> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const req = tx.objectStore(storeName).get(key);
        req.onsuccess = () => resolve(req.result as T | undefined);
        req.onerror = () => reject(req.error);
      })
  );
}

function txGetAll<T>(storeName: string): Promise<T[]> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const req = tx.objectStore(storeName).getAll();
        req.onsuccess = () => resolve(req.result as T[]);
        req.onerror = () => reject(req.error);
      })
  );
}

function txGetByIndex<T>(storeName: string, indexName: string, value: string): Promise<T[]> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const req = tx.objectStore(storeName).index(indexName).getAll(value);
        req.onsuccess = () => resolve(req.result as T[]);
        req.onerror = () => reject(req.error);
      })
  );
}

function txPut<T>(storeName: string, value: T): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const req = tx.objectStore(storeName).put(value);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      })
  );
}

function txDelete(storeName: string, key: string): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const req = tx.objectStore(storeName).delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      })
  );
}

// ── Projects ───────────────────────────────────────────────────────────────────

export async function getAllProjects(): Promise<PlaygroundProject[]> {
  return txGetAll<PlaygroundProject>(IDB_STORES.projects);
}

export async function getProject(id: string): Promise<PlaygroundProject | undefined> {
  return txGet<PlaygroundProject>(IDB_STORES.projects, id);
}

export async function saveProject(project: PlaygroundProject): Promise<void> {
  return txPut(IDB_STORES.projects, project);
}

export async function deleteProject(id: string): Promise<void> {
  return txDelete(IDB_STORES.projects, id);
}

// ── Files ──────────────────────────────────────────────────────────────────────

export async function getProjectFiles(projectId: string): Promise<ProjectFile[]> {
  return txGetByIndex<ProjectFile>(IDB_STORES.files, "projectId", projectId);
}

export async function getFile(id: string): Promise<ProjectFile | undefined> {
  return txGet<ProjectFile>(IDB_STORES.files, id);
}

export async function saveFile(file: ProjectFile): Promise<void> {
  return txPut(IDB_STORES.files, file);
}

export async function deleteFile(id: string): Promise<void> {
  return txDelete(IDB_STORES.files, id);
}

// ── Folders ────────────────────────────────────────────────────────────────────

export async function getProjectFolders(projectId: string): Promise<ProjectFolder[]> {
  return txGetByIndex<ProjectFolder>(IDB_STORES.folders, "projectId", projectId);
}

export async function saveFolder(folder: ProjectFolder): Promise<void> {
  return txPut(IDB_STORES.folders, folder);
}

export async function deleteFolder(id: string): Promise<void> {
  return txDelete(IDB_STORES.folders, id);
}

// ── Full project snapshot ──────────────────────────────────────────────────────

export interface ProjectSnapshot {
  project: PlaygroundProject;
  files: ProjectFile[];
  folders: ProjectFolder[];
}

export async function loadProjectSnapshot(projectId: string): Promise<ProjectSnapshot | null> {
  const [project, files, folders] = await Promise.all([
    getProject(projectId),
    getProjectFiles(projectId),
    getProjectFolders(projectId),
  ]);

  if (!project) return null;

  return { project, files, folders };
}

export async function saveProjectSnapshot(snapshot: ProjectSnapshot): Promise<void> {
  const { project, files, folders } = snapshot;

  await saveProject(project);

  await Promise.all([
    ...files.map((f) => saveFile(f)),
    ...folders.map((fo) => saveFolder(fo)),
  ]);
}

// ── Settings: last open project ────────────────────────────────────────────────

const LAST_PROJECT_KEY = "studyhub_ide_last_project";

export function saveLastProjectId(id: string): void {
  try {
    localStorage.setItem(LAST_PROJECT_KEY, id);
  } catch {
    // ignore
  }
}

export function getLastProjectId(): string | null {
  try {
    return localStorage.getItem(LAST_PROJECT_KEY);
  } catch {
    return null;
  }
}
