import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Database, Play, RotateCcw, Plus, Trash2, FileCode2, Terminal, PanelLeft, X } from "lucide-react";
import Editor, { useMonaco } from "@monaco-editor/react";

import { 
  initDatabase, 
  executeSQL, 
  getSchema, 
  resetDatabase 
} from "@/lib/sql/database";
import { 
  loadWorkspace, 
  saveWorkspace 
} from "@/lib/sql/persistence";
import { 
  SQLWorkspace, 
  SQLFile, 
  SQLTable, 
  SQLExecutionResult 
} from "@/lib/sql/types";

import SQLFileExplorer from "./SQLFileExplorer";
import SQLSchemaExplorer from "./SQLSchemaExplorer";
import SQLResults from "./SQLResults";
import "../playground/WebIDE.css"; // Reuse IDE layout classes if possible, or we define custom styles

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function SQLLab() {
  const [mounted, setMounted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Database State
  const [schema, setSchema] = useState<SQLTable[]>([]);
  const [execResult, setExecResult] = useState<SQLExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Workspace State
  const [workspace, setWorkspace] = useState<SQLWorkspace | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const editorRef = useRef<any>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Layout State
  const [schemaWidth, setSchemaWidth] = useState(250);
  const [bottomHeight, setBottomHeight] = useState(250);
  
  const schemaDragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const bottomDragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  // ── Initialization ──
  
  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        setSchema(getSchema());
        
        const ws = await loadWorkspace();
        setWorkspace(ws);
      } catch (err) {
        console.error("Failed to initialize SQL Lab:", err);
      } finally {
        setIsInitializing(false);
        setMounted(true);
      }
    }
    setup();
  }, []);

  // ── Keyboard Shortcuts ──
  
  const runQuery = useCallback(async () => {
    if (!workspace?.activeFileId || isRunning) return;
    const activeFile = workspace.files[workspace.activeFileId];
    if (!activeFile?.content.trim()) return;

    setIsRunning(true);
    
    // Tiny delay to let UI render "Running..." state
    await new Promise(r => setTimeout(r, 50));

    try {
      const res = await executeSQL(activeFile.content);
      setExecResult(res);
      // Refresh schema in case of DDL
      setSchema(getSchema());
    } finally {
      setIsRunning(false);
    }
  }, [workspace, isRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runQuery();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        // Saving is automatic, but we can provide visual feedback here later
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runQuery]);

  // ── File & Workspace Management ──

  const debouncedSaveWorkspace = useCallback((ws: SQLWorkspace) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveWorkspace(ws);
    }, 500);
  }, []);

  const updateWorkspace = (updater: (prev: SQLWorkspace) => SQLWorkspace) => {
    setWorkspace(prev => {
      if (!prev) return prev;
      const next = updater(prev);
      debouncedSaveWorkspace(next);
      return next;
    });
  };

  const handleEditorChange = (val: string | undefined) => {
    if (!workspace?.activeFileId || typeof val !== "string") return;
    
    updateWorkspace(ws => ({
      ...ws,
      files: {
        ...ws.files,
        [ws.activeFileId!]: {
          ...ws.files[ws.activeFileId!],
          content: val,
          updatedAt: Date.now()
        }
      }
    }));
  };

  const createNewFile = () => {
    const id = generateId();
    // find a safe name
    let idx = 1;
    let name = `query-${idx}.sql`;
    while (workspace && Object.values(workspace.files).some(f => f.name === name)) {
      idx++;
      name = `query-${idx}.sql`;
    }

    const newFile: SQLFile = {
      id, name, folder: null, content: "", createdAt: Date.now(), updatedAt: Date.now()
    };

    updateWorkspace(ws => ({
      ...ws,
      files: { ...ws.files, [id]: newFile },
      openTabIds: [...ws.openTabIds, id],
      activeFileId: id
    }));
  };

  const switchTab = (id: string) => {
    updateWorkspace(ws => {
      const isAlreadyOpen = ws.openTabIds.includes(id);
      return {
        ...ws,
        activeFileId: id,
        openTabIds: isAlreadyOpen ? ws.openTabIds : [...ws.openTabIds, id]
      };
    });
  };

  const closeFile = (id: string) => {
    updateWorkspace(ws => {
      const newTabs = ws.openTabIds.filter(tid => tid !== id);
      let newActiveId = ws.activeFileId;
      if (ws.activeFileId === id) {
        newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1] : null;
      }
      return { ...ws, openTabIds: newTabs, activeFileId: newActiveId };
    });
  };

  const renameFile = (id: string, newName: string): boolean => {
    updateWorkspace(ws => ({
      ...ws,
      files: {
        ...ws.files,
        [id]: { ...ws.files[id], name: newName, updatedAt: Date.now() }
      }
    }));
    return true;
  };

  const duplicateFile = (id: string) => {
    const newId = generateId();
    updateWorkspace(ws => {
      const original = ws.files[id];
      if (!original) return ws;
      
      let baseName = original.name.replace(/\.sql$/, "");
      let newName = `${baseName}-copy.sql`;
      let idx = 1;
      while (Object.values(ws.files).some(f => f.name.toLowerCase() === newName.toLowerCase())) {
        newName = `${baseName}-copy-${idx}.sql`;
        idx++;
      }
      
      const newFile: SQLFile = {
        ...original,
        id: newId,
        name: newName,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      return {
        ...ws,
        files: { ...ws.files, [newId]: newFile },
        openTabIds: [...ws.openTabIds, newId],
        activeFileId: newId
      };
    });
  };

  const deleteFile = (id: string) => {
    updateWorkspace(ws => {
      const newFiles = { ...ws.files };
      delete newFiles[id];
      
      const newOpenTabs = ws.openTabIds.filter(tid => tid !== id);
      let newActiveId = ws.activeFileId;
      if (ws.activeFileId === id) {
        newActiveId = newOpenTabs.length > 0 ? newOpenTabs[newOpenTabs.length - 1] : null;
      }
      
      return {
        ...ws,
        files: newFiles,
        openTabIds: newOpenTabs,
        activeFileId: newActiveId
      };
    });
  };

  // ── Resizing Logic ──

  const handleSchemaDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    schemaDragRef.current = { startX: e.clientX, startWidth: schemaWidth };
    const handleMouseMove = (ev: MouseEvent) => {
      if (!schemaDragRef.current) return;
      const delta = ev.clientX - schemaDragRef.current.startX;
      setSchemaWidth(Math.max(150, Math.min(500, schemaDragRef.current.startWidth + delta)));
    };
    const handleMouseUp = () => {
      schemaDragRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [schemaWidth]);

  const handleBottomDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    bottomDragRef.current = { startY: e.clientY, startHeight: bottomHeight };
    const handleMouseMove = (ev: MouseEvent) => {
      if (!bottomDragRef.current) return;
      const delta = bottomDragRef.current.startY - ev.clientY;
      setBottomHeight(Math.max(100, Math.min(600, bottomDragRef.current.startHeight + delta)));
    };
    const handleMouseUp = () => {
      bottomDragRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [bottomHeight]);

  const handleResetDatabase = async () => {
    if (confirm("Reset database? This will restore the default tables and remove any tables you created. Your files will NOT be deleted.")) {
      await resetDatabase();
      setSchema(getSchema());
      setExecResult(null);
    }
  };

  const handleInsertText = (text: string) => {
    const editor = editorRef.current;
    if (editor) {
      const position = editor.getPosition();
      editor.executeEdits("schema-insert", [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        },
        text: text,
        forceMoveMarkers: true
      }]);
      editor.focus();
    }
  };

  // ── Render ──

  if (!mounted || isInitializing || !workspace) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--surface-subdued)]">
        <span className="w-6 h-6 border-2 border-[var(--border)] border-t-[var(--ink)] rounded-full animate-spin"></span>
      </div>
    );
  }

  const activeFile = workspace.activeFileId ? workspace.files[workspace.activeFileId] : null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[var(--surface-subdued)]">
      
      {/* TOOLBAR */}
      <div className="h-14 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-1.5 rounded-lg text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] transition-colors cursor-pointer"
            onClick={() => setIsMobileSidebarOpen(prev => !prev)}
            aria-label="Toggle SQL Explorer"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          
          <Link href="/practice" className="text-[var(--ink-secondary)] hover:text-[var(--ink)] font-medium text-sm">
            Practice
          </Link>
          <span className="text-[var(--border-strong)]">/</span>
          <div className="flex items-center gap-2 text-[var(--ink)] font-bold text-sm">
            <Database className="w-4 h-4 text-emerald-600" /> SQL Lab
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleResetDatabase} 
            className="text-[var(--ink-secondary)] hover:text-[var(--ink)] bg-[var(--surface-subdued)] hover:bg-[var(--border)] h-8 px-3 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset DB
          </button>
          <button 
            onClick={runQuery} 
            disabled={isRunning || !activeFile?.content.trim()} 
            className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-4 rounded text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRunning ? (
               <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Run Query
          </button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* MOBILE SIDEBAR DRAWER OVERLAY */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden animate-in fade-in duration-150"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div 
              className="w-72 h-full bg-[var(--surface)] border-r border-[var(--border)] flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-12 border-b border-[var(--border)] px-4 flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">Explorer & Schema</span>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded text-[var(--ink-secondary)] hover:text-[var(--ink)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SQLFileExplorer 
                workspace={workspace} 
                onOpenFile={(id) => {
                  switchTab(id);
                  setIsMobileSidebarOpen(false);
                }} 
                onRenameFile={renameFile} 
                onDeleteFile={deleteFile}
                onDuplicateFile={duplicateFile}
                onCloseFile={closeFile}
                onNewFile={() => {
                  createNewFile();
                  setIsMobileSidebarOpen(false);
                }}
              />
              <div className="flex-1 min-h-0 overflow-hidden">
                <SQLSchemaExplorer schema={schema} onInsertText={(text) => {
                  handleInsertText(text);
                  setIsMobileSidebarOpen(false);
                }} />
              </div>
            </div>
          </div>
        )}

        {/* LEFT: Explorer & Schema (Desktop) */}
        <div 
          className="border-r border-[var(--border)] bg-[var(--surface)] shrink-0 hidden md:flex flex-col" 
          style={{ width: schemaWidth }}
        >
          <SQLFileExplorer 
            workspace={workspace} 
            onOpenFile={switchTab} 
            onRenameFile={renameFile} 
            onDeleteFile={deleteFile}
            onDuplicateFile={duplicateFile}
            onCloseFile={closeFile}
            onNewFile={createNewFile}
          />
          <div className="flex-1 min-h-0 overflow-hidden">
            <SQLSchemaExplorer schema={schema} onInsertText={handleInsertText} />
          </div>
        </div>
        
        {/* Horizontal Drag Handle */}
        <div 
          className="w-1 cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500 hidden md:block transition-colors z-10 -ml-[1px]" 
          onMouseDown={handleSchemaDragStart} 
        />

        {/* RIGHT: Editor + Results */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          
          {/* TABS */}
          <div className="flex items-center bg-[#181818] overflow-x-auto overflow-y-hidden border-b border-[#2d2d2d] shrink-0">
            {workspace.openTabIds.map(id => {
              const file = workspace.files[id];
              if (!file) return null;
              const isActive = id === workspace.activeFileId;
              return (
                <div 
                  key={id}
                  onClick={() => switchTab(id)}
                  className={`flex items-center h-9 px-4 gap-2 text-xs cursor-pointer border-r border-[#2d2d2d] select-none ${isActive ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500' : 'text-gray-400 hover:bg-[#252525] border-t-2 border-t-transparent'}`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>{file.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); closeFile(id); }}
                    className="ml-2 opacity-50 hover:opacity-100 hover:text-white p-0.5 rounded hover:bg-white/10"
                  >
                    ×
                  </button>
                </div>
              );
            })}
            <button 
              onClick={createNewFile}
              className="h-9 px-3 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#252525] transition-colors"
              title="New SQL File"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* EDITOR */}
          <div className="flex-1 min-h-0 relative">
            {activeFile ? (
              <Editor
                height="100%"
                language="sql"
                theme="vs-dark"
                value={activeFile.content}
                onChange={handleEditorChange}
                onMount={(editor) => { editorRef.current = editor; }}
                options={{ 
                  minimap: { enabled: false }, 
                  fontSize: 13, 
                  wordWrap: "on", 
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  renderWhitespace: "selection"
                }}
              />
            ) : (
              <div className="flex-1 h-full flex flex-col items-center justify-center text-gray-500">
                <FileCode2 className="w-12 h-12 mb-4 opacity-20" />
                <p>Open a file or create a new one</p>
                <button 
                  onClick={createNewFile}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> New File
                </button>
              </div>
            )}
          </div>

          {/* BOTTOM RESULTS DRAG HANDLE */}
          <div 
            className="h-1 cursor-row-resize bg-[#2d2d2d] hover:bg-blue-500/50 active:bg-blue-500 transition-colors z-20 shrink-0" 
            onMouseDown={handleBottomDragStart}
          />

          {/* BOTTOM RESULTS PANEL */}
          <div 
            className="bg-[var(--surface)] flex flex-col shrink-0"
            style={{ height: bottomHeight }}
          >
            <div className="h-9 border-b border-[var(--border)] bg-[var(--surface-subdued)] flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)]">
                <span className="flex items-center gap-1.5 text-[var(--ink)] border-b-2 border-blue-500 h-9">
                  <Terminal className="w-3.5 h-3.5" /> Results
                </span>
              </div>
              
              {execResult && !execResult.error && (
                <div className="text-[10px] text-[var(--ink-tertiary)] flex gap-3">
                  <span>{execResult.results.reduce((acc, r) => acc + r.values.length, 0)} rows</span>
                  <span>{execResult.executionTime} ms</span>
                </div>
              )}
            </div>
            
            <SQLResults result={execResult} isRunning={isRunning} />
          </div>

        </div>
      </div>
    </div>
  );
}
