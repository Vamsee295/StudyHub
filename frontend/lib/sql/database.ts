import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import { SQLExecutionResult, SQLResult, SQLTable, SQLColumn } from "./types";
import { saveDatabaseToIDB, loadDatabaseFromIDB } from "./persistence";

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

const DEFAULT_SEED = `
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  salary INTEGER NOT NULL,
  hire_date TEXT NOT NULL
);

CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  budget INTEGER NOT NULL
);

INSERT INTO employees (id, name, department, salary, hire_date) VALUES 
(1, 'Alice', 'Engineering', 85000, '2023-01-15'),
(2, 'Bob', 'Engineering', 78000, '2022-07-10'),
(3, 'Charlie', 'Sales', 65000, '2024-02-01'),
(4, 'Diana', 'HR', 72000, '2021-11-20'),
(5, 'Evan', 'Marketing', 68000, '2023-05-12'),
(6, 'Fiona', 'Engineering', 92000, '2020-03-10'),
(7, 'George', 'Sales', 58000, '2023-09-01'),
(8, 'Hannah', 'Marketing', 71000, '2022-01-18');

INSERT INTO departments (id, name, budget) VALUES 
(1, 'Engineering', 500000),
(2, 'Sales', 300000),
(3, 'HR', 200000),
(4, 'Marketing', 250000);
`;

export async function initDatabase(): Promise<void> {
  if (typeof window === "undefined") return; // Client only
  
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: file => `/${file}` // Serve from public/ folder
    });
  }

  if (!db) {
    // Try to load from IndexedDB
    const savedBytes = await loadDatabaseFromIDB();
    if (savedBytes && savedBytes.byteLength > 0) {
      db = new SQL.Database(savedBytes);
    } else {
      // Initialize new and seed
      db = new SQL.Database();
      db.run(DEFAULT_SEED);
      await saveDatabase();
    }
  }
}

export async function resetDatabase(): Promise<void> {
  if (!SQL) return;
  if (db) {
    db.close();
  }
  db = new SQL.Database();
  db.run(DEFAULT_SEED);
  await saveDatabase();
}

async function saveDatabase(): Promise<void> {
  if (db) {
    const data = db.export();
    await saveDatabaseToIDB(data);
  }
}

export async function executeSQL(query: string): Promise<SQLExecutionResult> {
  if (!db) throw new Error("Database not initialized");

  const start = performance.now();
  try {
    const execRes = db.exec(query);
    const end = performance.now();
    
    const rowsModified = db.getRowsModified();
    
    // Auto-save if it was a mutation query
    const isMutation = /^(insert|update|delete|create|drop|alter)/i.test(query.trim());
    if (isMutation) {
      await saveDatabase();
    }

    const results: SQLResult[] = execRes.map(res => ({
      columns: res.columns,
      values: res.values
    }));

    return {
      results,
      executionTime: Math.round((end - start) * 10) / 10,
      rowsModified
    };
  } catch (err: any) {
    return {
      results: [],
      executionTime: 0,
      rowsModified: 0,
      error: err.message || String(err)
    };
  }
}

export function getSchema(): SQLTable[] {
  if (!db) return [];
  
  try {
    const tablesRes = db.exec("SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    if (tablesRes.length === 0) return [];
    
    const tables: SQLTable[] = [];
    const tableNames = tablesRes[0].values.map(v => v[0] as string);
    
    for (const name of tableNames) {
      const infoRes = db.exec(`PRAGMA table_info("${name}")`);
      if (infoRes.length > 0) {
        const columns: SQLColumn[] = infoRes[0].values.map(row => ({
          name: row[1] as string,
          type: row[2] as string,
          notNull: Boolean(row[3]),
          isPrimary: Boolean(row[5])
        }));
        tables.push({ name, columns });
      }
    }
    
    return tables;
  } catch (e) {
    console.error("Failed to get schema:", e);
    return [];
  }
}
