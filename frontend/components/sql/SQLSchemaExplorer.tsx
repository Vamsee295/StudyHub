import React, { useState } from "react";
import { Database, Table2, ChevronRight, ChevronDown } from "lucide-react";
import { SQLTable } from "@/lib/sql/types";

interface Props {
  schema: SQLTable[];
  onInsertText: (text: string) => void;
}

export default function SQLSchemaExplorer({ schema, onInsertText }: Props) {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  return (
    <div className="flex flex-col h-full bg-card text-sm">
      <div className="h-10 flex shrink-0 items-center px-4 border-b border-hair">
        <span className="text-xs font-semibold text-body uppercase tracking-wider flex items-center gap-2">
          <Database className="w-3.5 h-3.5" /> Database
        </span>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        {schema.length === 0 ? (
          <div className="text-mute p-4 text-center text-xs italic">
            No tables available.
          </div>
        ) : (
          schema.map(table => (
            <div key={table.name} className="mb-1">
              <div 
                className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-paper-2 rounded cursor-pointer group"
                onClick={() => toggleTable(table.name)}
              >
                {expandedTables[table.name] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-mute" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-mute" />
                )}
                <Table2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold text-ink select-none truncate flex-1">
                  {table.name}
                </span>
                
                {/* Hover actions */}
                <button 
                  className="opacity-0 group-hover:opacity-100 text-[10px] text-body hover:text-blue-500 font-medium px-1 rounded transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInsertText(`SELECT * FROM ${table.name};\n`);
                  }}
                  title={`Insert SELECT * FROM ${table.name}`}
                >
                  SELECT
                </button>
              </div>
              
              {expandedTables[table.name] && (
                <div className="flex flex-col gap-[2px] pl-7 pr-2 pb-2 pt-1">
                  {table.columns.map(col => (
                    <div 
                      key={col.name} 
                      className="flex items-center justify-between text-xs group/col hover:bg-paper-2 px-1.5 py-1 rounded cursor-pointer"
                      onClick={() => onInsertText(col.name)}
                      title={`Insert column ${col.name}`}
                    >
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {col.isPrimary ? (
                          <span title="Primary Key" className="text-[10px]">🔑</span>
                        ) : (
                          <span className="w-[14px]"></span>
                        )}
                        <span className={`truncate select-none ${col.isPrimary ? "font-semibold text-ink" : "text-body"}`}>
                          {col.name}
                        </span>
                      </div>
                      <span className="text-[9px] text-mute font-mono uppercase">
                        {col.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
