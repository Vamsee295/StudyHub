"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, Key, Hash, Type, Calendar, ToggleLeft, Database, RefreshCw, Table } from "lucide-react";
import { DatabaseTable, DatabaseColumn } from "@/lib/services/tools/sqlService";

interface SqlSchemaSidebarProps {
  tables: DatabaseTable[];
  isLoading: boolean;
  onTableClick: (tableName: string) => void;
  onRefresh: () => void;
}

function columnTypeIcon(type: string, isPrimaryKey: boolean) {
  if (isPrimaryKey) return <Key className="w-3 h-3 text-gold shrink-0" />;
  const t = type.toUpperCase();
  if (t.includes("INT") || t.includes("NUM") || t.includes("REAL") || t.includes("FLOAT") || t.includes("DECIMAL"))
    return <Hash className="w-3 h-3 text-accent shrink-0" />;
  if (t.includes("DATE") || t.includes("TIME"))
    return <Calendar className="w-3 h-3 text-note shrink-0" />;
  if (t.includes("BOOL"))
    return <ToggleLeft className="w-3 h-3 text-accent shrink-0" />;
  return <Type className="w-3 h-3 text-mute shrink-0" />;
}

function normalizeType(type: string): string {
  if (!type) return "TEXT";
  return type.replace("AUTOINCREMENT", "").replace("PRIMARY KEY", "").trim() || "TEXT";
}

function TableRow({ table, onTableClick }: { table: DatabaseTable; onTableClick: (t: string) => void }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-card-2 transition-colors text-left group"
        aria-expanded={open}
        aria-label={`Toggle table ${table.name}`}
      >
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-mute shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-mute shrink-0" />
        )}
        <Table className="w-3.5 h-3.5 text-accent-ink shrink-0" />
        <span className="font-mono text-[13px] font-semibold text-ink flex-1 truncate">
          {table.name}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTableClick(table.name);
          }}
          className="sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 sm:focus-within:opacity-100 text-[10px] text-accent-ink font-semibold bg-accent-soft px-1.5 py-0.5 rounded transition-all hover:bg-accent hover:text-paper"
          title={`SELECT * FROM ${table.name}`}
        >
          SELECT
        </button>
      </button>

      {open && (
        <div className="ml-6 mb-1 flex flex-col">
          {table.columns.map((col) => (
            <ColumnRow key={col.name} col={col} />
          ))}
        </div>
      )}
    </div>
  );
}

function ColumnRow({ col }: { col: DatabaseColumn }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-card-2/60 transition-colors">
      {columnTypeIcon(col.type, col.isPrimaryKey)}
      <span className="font-mono text-[12px] text-ink flex-1 truncate">{col.name}</span>
      <span className="font-mono text-[10px] text-mute uppercase shrink-0">
        {normalizeType(col.type)}
      </span>
      {col.isNotNull && !col.isPrimaryKey && (
        <span className="text-[9px] text-gold font-bold shrink-0">NN</span>
      )}
    </div>
  );
}

export function SqlSchemaSidebar({ tables, isLoading, onTableClick, onRefresh }: SqlSchemaSidebarProps) {
  return (
    <div className="bg-card rounded-2xl border-[1.5px] border-hair flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-hair bg-paper-2/60 shrink-0">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-accent-ink" />
          <span className="text-[13px] font-semibold text-ink">Database Schema</span>
        </div>
        <button
          onClick={onRefresh}
          title="Refresh schema"
          aria-label="Refresh schema"
          className="p-1 rounded-md text-mute hover:text-accent-ink hover:bg-accent-soft transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-card-2 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : tables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <Database className="w-8 h-8 text-ink/30 mb-2" />
            <p className="text-[12px] text-mute">No tables found. Create one with CREATE TABLE.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {tables.map((t) => (
              <TableRow key={t.name} table={t} onTableClick={onTableClick} />
            ))}
          </div>
        )}
      </div>

      {/* Footer legend */}
      <div className="px-4 py-2.5 border-t border-hair bg-paper-2/40 shrink-0">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <div className="flex items-center gap-1"><Key className="w-2.5 h-2.5 text-gold" /><span className="text-[10px] text-mute">PK</span></div>
          <div className="flex items-center gap-1"><Hash className="w-2.5 h-2.5 text-accent" /><span className="text-[10px] text-mute">Number</span></div>
          <div className="flex items-center gap-1"><Type className="w-2.5 h-2.5 text-mute" /><span className="text-[10px] text-mute">Text</span></div>
          <div className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5 text-note" /><span className="text-[10px] text-mute">Date</span></div>
        </div>
      </div>
    </div>
  );
}
