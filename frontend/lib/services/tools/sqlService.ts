import type { SqlJsStatic, Database } from 'sql.js';

// ===========================================================================
// TYPES
// ===========================================================================

export interface QueryColumn {
  name: string;
}

export interface QueryRow {
  [column: string]: string | number | boolean | null;
}

export interface QueryResultSet {
  columns: QueryColumn[];
  rows: QueryRow[];
}

export interface QueryExecutionResult {
  success: boolean;
  type: 'select' | 'mutation' | 'ddl' | 'error';
  resultSets?: QueryResultSet[];
  message?: string;
  rowsAffected?: number;
  executionTimeMs: number;
  error?: SqlError;
  sql: string;
}

export interface SqlError {
  message: string;
  sql?: string;
}

export interface DatabaseColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isNotNull: boolean;
  defaultValue: string | null;
}

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
}

export interface QueryHistoryItem {
  id: string;
  sql: string;
  executedAt: Date;
  success: boolean;
  executionTimeMs: number;
  rowCount?: number;
}

// ===========================================================================
// SEED SQL — the default sample database that gets created on first run
// ===========================================================================

const SEED_SQL = `
CREATE TABLE IF NOT EXISTS departments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  location    TEXT
);

CREATE TABLE IF NOT EXISTS employees (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name    TEXT    NOT NULL,
  last_name     TEXT    NOT NULL,
  email         TEXT    UNIQUE,
  department_id INTEGER REFERENCES departments(id),
  salary        REAL    NOT NULL,
  hire_date     TEXT
);

CREATE TABLE IF NOT EXISTS students (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT NOT NULL,
  email             TEXT,
  branch            TEXT,
  gpa               REAL,
  graduation_year   INTEGER,
  placement_status  TEXT DEFAULT 'Unplaced'
);

CREATE TABLE IF NOT EXISTS courses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  credits     INTEGER,
  department  TEXT
);

INSERT INTO departments (name, location) VALUES
  ('Engineering',       'Bangalore'),
  ('Sales',             'Mumbai'),
  ('Marketing',         'Delhi'),
  ('Human Resources',   'Hyderabad'),
  ('Finance',           'Pune');

INSERT INTO employees (first_name, last_name, email, department_id, salary, hire_date) VALUES
  ('Arjun',   'Sharma',    'arjun@company.com',   1, 95000,  '2020-03-15'),
  ('Priya',   'Nair',      'priya@company.com',   2, 72000,  '2021-06-01'),
  ('Rahul',   'Gupta',     'rahul@company.com',   1, 110000, '2019-01-20'),
  ('Sneha',   'Iyer',      'sneha@company.com',   3, 68000,  '2022-08-10'),
  ('Vikram',  'Reddy',     'vikram@company.com',  1, 125000, '2018-11-05'),
  ('Kavya',   'Menon',     'kavya@company.com',   4, 58000,  '2023-01-15'),
  ('Aditya',  'Patel',     'aditya@company.com',  2, 89000,  '2020-09-30'),
  ('Divya',   'Singh',     'divya@company.com',   5, 77000,  '2021-04-12'),
  ('Rohan',   'Kumar',     'rohan@company.com',   1, 98000,  '2019-07-22'),
  ('Meera',   'Joshi',     'meera@company.com',   3, 61000,  '2022-03-08');

INSERT INTO students (name, email, branch, gpa, graduation_year, placement_status) VALUES
  ('Ananya Rao',         'ananya@uni.edu',   'Computer Science',       8.7, 2024, 'Placed'),
  ('Ravi Teja',          'ravi@uni.edu',     'Electrical Engineering',  7.4, 2024, 'Unplaced'),
  ('Lakshmi Prasad',     'lakshmi@uni.edu',  'Computer Science',        9.1, 2025, 'Unplaced'),
  ('Siddharth Mehta',    'sid@uni.edu',      'Information Technology',  8.2, 2024, 'Placed'),
  ('Pooja Verma',        'pooja@uni.edu',    'Computer Science',        7.9, 2025, 'Unplaced'),
  ('Kiran Babu',         'kiran@uni.edu',    'Mechanical Engineering',  6.8, 2024, 'Unplaced'),
  ('Tejaswini Nair',     'teju@uni.edu',     'Computer Science',        9.4, 2024, 'Placed'),
  ('Harish Chandra',     'harish@uni.edu',   'Information Technology',  7.6, 2025, 'Unplaced'),
  ('Swathi Reddy',       'swathi@uni.edu',   'Computer Science',        8.5, 2024, 'Placed'),
  ('Naveen Kumar',       'naveen@uni.edu',   'Electronics Engineering', 7.1, 2024, 'Unplaced');

INSERT INTO courses (name, credits, department) VALUES
  ('Data Structures & Algorithms', 4, 'Computer Science'),
  ('Database Management Systems',  3, 'Computer Science'),
  ('Operating Systems',            3, 'Computer Science'),
  ('Computer Networks',            3, 'Computer Science'),
  ('Software Engineering',         3, 'Computer Science'),
  ('Machine Learning',             4, 'Computer Science'),
  ('Digital Electronics',          3, 'Electronics'),
  ('Signals & Systems',            3, 'Electronics'),
  ('Engineering Mathematics',      4, 'Common'),
  ('Technical Communication',      2, 'Common');
`;

// ===========================================================================
// DATABASE MANAGER
// ===========================================================================

class DatabaseManager {
  private db: Database | null = null;
  private sqlJs: SqlJsStatic | null = null;
  private initPromise: Promise<void> | null = null;
  private dbKey = 'studyhub_sql_playground_db';

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      // Dynamic import to avoid SSR issues
      const initSqlJs = (await import('sql.js')).default;
      try {
        this.sqlJs = await initSqlJs({
          locateFile: (file: string) => `/${file}`,
        });
      } catch (localErr) {
        console.warn('[SQL Playground] Local WASM file failed to load, trying cdn fallback...', localErr);
        this.sqlJs = await initSqlJs({
          locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.14.2/${file}`,
        });
      }

      // Try to load persisted DB from IndexedDB/localStorage
      const saved = this.loadPersistedDb();
      if (saved) {
        try {
          this.db = new this.sqlJs!.Database(saved);
          return;
        } catch {
          // Corrupted — fall through to fresh seed
        }
      }

      // Create fresh seeded database
      this.db = new this.sqlJs!.Database();
      this.db.run(SEED_SQL);
      this.persistDb();
    })();

    return this.initPromise;
  }

  private loadPersistedDb(): Uint8Array | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(this.dbKey);
      if (!raw) return null;
      const arr = JSON.parse(raw);
      return new Uint8Array(arr);
    } catch {
      return null;
    }
  }

  persistDb(): void {
    if (!this.db || typeof window === 'undefined') return;
    try {
      const data = this.db.export();
      localStorage.setItem(this.dbKey, JSON.stringify(Array.from(data)));
    } catch {
      // Storage quota exceeded — silently ignore
    }
  }

  clearPersistedDb(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.dbKey);
  }

  async reset(): Promise<void> {
    this.clearPersistedDb();
    this.initPromise = null;
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    await this.init();
  }

  async execute(sql: string): Promise<QueryExecutionResult> {
    await this.init();
    const start = performance.now();
    const trimmed = sql.trim();

    if (!trimmed) {
      return {
        success: false,
        type: 'error',
        executionTimeMs: 0,
        sql,
        error: { message: 'Query is empty. Please write some SQL and run again.' },
      };
    }

    try {
      const upperTrimmed = trimmed.toUpperCase();
      const isSelect = upperTrimmed.startsWith('SELECT') || upperTrimmed.startsWith('WITH') || upperTrimmed.startsWith('EXPLAIN');
      const isDDL = upperTrimmed.startsWith('CREATE') || upperTrimmed.startsWith('DROP') || upperTrimmed.startsWith('ALTER');

      let resultSets: QueryResultSet[] = [];
      let rowsAffected = 0;

      if (isSelect) {
        const rawResults = this.db!.exec(trimmed);
        resultSets = rawResults.map((r) => ({
          columns: r.columns.map((c) => ({ name: c })),
          rows: r.values.map((v) =>
            Object.fromEntries(r.columns.map((c, i) => [c, v[i] as string | number | boolean | null]))
          ),
        }));
      } else {
        this.db!.run(trimmed);
        rowsAffected = this.db!.getRowsModified() ?? 0;
      }

      // Persist the updated state
      this.persistDb();

      const executionTimeMs = parseFloat((performance.now() - start).toFixed(2));
      const type = isDDL ? 'ddl' : isSelect ? 'select' : 'mutation';

      let message = '';
      if (type === 'select') {
        const rowCount = resultSets[0]?.rows.length ?? 0;
        message = rowCount === 1 ? '1 row returned' : `${rowCount} rows returned`;
      } else if (type === 'ddl') {
        const op = trimmed.toUpperCase().startsWith('CREATE') ? 'created' :
                   trimmed.toUpperCase().startsWith('DROP') ? 'dropped' : 'altered';
        message = `Table ${op} successfully`;
      } else {
        message = rowsAffected === 1
          ? 'Query executed successfully — 1 row affected'
          : `Query executed successfully — ${rowsAffected} rows affected`;
      }

      return {
        success: true,
        type,
        resultSets,
        message,
        rowsAffected,
        executionTimeMs,
        sql,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        type: 'error',
        executionTimeMs: parseFloat((performance.now() - start).toFixed(2)),
        sql,
        error: { message, sql: trimmed },
      };
    }
  }

  async getSchema(): Promise<DatabaseTable[]> {
    await this.init();

    const tablesResult = this.db!.exec(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
    );
    if (!tablesResult.length) return [];

    const tableNames = tablesResult[0].values.map((v) => v[0] as string);
    const tables: DatabaseTable[] = [];

    for (const name of tableNames) {
      const infoResult = this.db!.exec(`PRAGMA table_info("${name}")`);
      const columns: DatabaseColumn[] = infoResult[0]?.values.map((v) => ({
        name: v[1] as string,
        type: (v[2] as string) || 'TEXT',
        isPrimaryKey: v[5] === 1,
        isNotNull: v[3] === 1,
        defaultValue: v[4] as string | null,
      })) ?? [];
      tables.push({ name, columns });
    }

    return tables;
  }

  isReady(): boolean {
    return this.db !== null;
  }
}

// Singleton
export const databaseManager = new DatabaseManager();
