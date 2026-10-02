"use client";

import { clsx } from "clsx";
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Maximize,
  Pencil
} from "lucide-react";
import React from "react";

interface PdfReaderToolbarProps {
  currentPage: number;
  pageCount: number;
  zoomLevel: number;
  rotation?: number;
  isFullscreen: boolean;
  fileUrl: string;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onRotate?: () => void;
  onFitWidth: () => void;
  onToggleFullscreen: () => void;
  isDoodleMode?: boolean;
  onToggleDoodle?: () => void;
}

export function PdfReaderToolbar({
  currentPage,
  pageCount,
  zoomLevel,
  rotation = 0,
  isFullscreen,
  fileUrl,
  onPrevPage,
  onNextPage,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onRotate,
  onFitWidth,
  onToggleFullscreen,
  isDoodleMode,
  onToggleDoodle
}: PdfReaderToolbarProps) {
  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1) {
      // We don't limit strictly to pageCount here in case it's not loaded yet, 
      // but parent component will handle boundaries
      onPageChange(val);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[var(--surface-subdued)]/70 border-b border-[var(--border)] text-[13px] select-none rounded-t-2xl">
      {/* Left: Page Navigation */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg hover:bg-[var(--surface)] disabled:opacity-40 disabled:hover:bg-transparent text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-1 text-[12px] font-mono text-[var(--ink-secondary)] px-2">
          <span className="hidden sm:inline">Page</span>
          <input
            type="number"
            min={1}
            max={pageCount || 999}
            value={currentPage}
            onChange={handlePageInput}
            className="w-12 text-center bg-[var(--surface)] border border-[var(--border)] rounded py-0.5 text-[12px] font-mono font-semibold text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <span>/ {pageCount || "—"}</span>
        </div>

        <button
          onClick={onNextPage}
          disabled={Boolean(pageCount && currentPage >= pageCount)}
          className="p-1.5 rounded-lg hover:bg-[var(--surface)] disabled:opacity-40 disabled:hover:bg-transparent text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Zoom Controls */}
      <div className="flex items-center gap-1 bg-[var(--surface)] border border-[var(--border)]/80 rounded-xl px-2 py-1 shadow-2xs">
        <button
          onClick={onZoomOut}
          disabled={zoomLevel <= 25}
          className="p-1 rounded hover:bg-[var(--surface-subdued)] disabled:opacity-40 text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          title="Zoom Out (-25%)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        
        <button
          onClick={onResetZoom}
          className="font-mono text-[11px] font-semibold text-[var(--ink)] hover:text-[var(--accent)] px-1.5 py-0.5 rounded hover:bg-[var(--surface-subdued)] transition-colors min-w-[42px] text-center cursor-pointer"
          title="Reset Zoom (100%)"
        >
          {zoomLevel}%
        </button>
        
        <button
          onClick={onZoomIn}
          disabled={zoomLevel >= 300}
          className="p-1 rounded hover:bg-[var(--surface-subdued)] disabled:opacity-40 text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          title="Zoom In (+25%)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        
        <div className="w-px h-3 bg-[var(--border)] mx-1" />
        
        <button
          onClick={onRotate || onResetZoom}
          className="p-1 rounded hover:bg-[var(--surface-subdued)] text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          title={onRotate ? `Rotate Clockwise 90° (${rotation}°)` : "Reset Zoom"}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        
        <button
          onClick={onFitWidth}
          className="p-1 rounded hover:bg-[var(--surface-subdued)] text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          title="Fit to Width"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: External & Fullscreen */}
      <div className="flex items-center gap-2">
        {onToggleDoodle && (
          <button
            onClick={onToggleDoodle}
            className={clsx(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer",
              isDoodleMode 
                ? "bg-[var(--accent)] text-white" 
                : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
            )}
            title="Doodle / Annotate (Temporary)"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Doodle</span>
          </button>
        )}

        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
          title="Open in Native Browser Tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Open in Tab</span>
        </a>

        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reading Mode"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
