import { openDB, DBSchema, IDBPDatabase } from "idb";
import { SQLWorkspace, SQLFile } from "./types";

interface StudyHubSQLDB extends DBSchema {
  "sql-db": {
    key: string;
    value: Uint8Array;
  };
  "sql-workspace": {
    key: string;
    value: SQLWorkspace;
  };
}

let dbPromise: Promise<IDBPDatabase<StudyHubSQLDB>> | null = null;

function getDB() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB<StudyHubSQLDB>("studyhub-sql", 1, {
      upgrade(db) {
        db.createObjectStore("sql-db");
        db.createObjectStore("sql-workspace");
      }
    });
  }
  return dbPromise;
}

// ── SQLite Binary Persistence ──

export async function saveDatabaseToIDB(data: Uint8Array): Promise<void> {
  const db = await getDB();
  if (db) {
    await db.put("sql-db", data, "main-db");
  }
}

export async function loadDatabaseFromIDB(): Promise<Uint8Array | null> {
  const db = await getDB();
  if (db) {
    const data = await db.get("sql-db", "main-db");
    return data || null;
  }
  return null;
}

// ── Workspace / Files Persistence ──

const DEFAULT_WORKSPACE: SQLWorkspace = {
  activeFileId: "query-1",
  files: {
    "query-1": {
      id: "query-1",
      name: "query.sql",
      content: `-- StudyHub SQL Lab
-- Practice your SQL queries here

SELECT department, COUNT(*) as count
FROM employees
GROUP BY department
ORDER BY count DESC;`,
      folder: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  },
  openTabIds: ["query-1"]
};

export async function saveWorkspace(workspace: SQLWorkspace): Promise<void> {
  const db = await getDB();
  if (db) {
    await db.put("sql-workspace", workspace, "main");
  }
}

export async function loadWorkspace(): Promise<SQLWorkspace> {
  const db = await getDB();
  if (db) {
    const ws = await db.get("sql-workspace", "main");
    if (ws) return ws;
  }
  return DEFAULT_WORKSPACE;
}
