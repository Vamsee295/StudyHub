export type SQLColumnType = "INT" | "VARCHAR" | "TEXT" | "DATE" | "REAL" | "BOOLEAN" | string;

export interface SQLColumn {
  name: string;
  type: SQLColumnType;
  isPrimary: boolean;
  notNull: boolean;
}

export interface SQLTable {
  name: string;
  columns: SQLColumn[];
}

export interface SQLResult {
  columns: string[];
  values: any[][];
}

export interface SQLExecutionResult {
  results: SQLResult[]; // Multiple statements can return multiple results
  executionTime: number;
  rowsModified: number;
  error?: string;
}

export interface SQLFile {
  id: string;
  name: string;
  content: string;
  folder: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface SQLWorkspace {
  activeFileId: string | null;
  files: Record<string, SQLFile>;
  openTabIds: string[];
}
