"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { clsx } from "clsx";
import { 
  Pencil, 
  Highlighter, 
  Circle, 
  Minus, 
  ArrowUpRight, 
  Eraser, 
  Undo2, 
  Redo2, 
  Trash2, 
  X,
  Pointer
} from "lucide-react";

export type AnnotationTool = "pencil" | "highlighter" | "circle" | "line" | "arrow" | "eraser" | "laser";

export interface Point {
  x: number;
  y: number;
}

export interface Annotation {
  id: string;
  type: AnnotationTool;
  points: Point[];
  color: string;
  width: number;
}

interface AnnotationLayerProps {
  width: number;
  height: number;
  currentPage: number;
  fileUrl: string;
  onClose: () => void;
}

const COLORS = ["#ef4444", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#18181b", "#ffffff"];

export function AnnotationLayer({ width, height, currentPage, fileUrl, onClose }: AnnotationLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [activeTool, setActiveTool] = useState<AnnotationTool>("pencil");
  const [activeColor, setActiveColor] = useState<string>("#ef4444"); // Default red
  const [pencilSize, setPencilSize] = useState<number>(4);
  const [eraserSize, setEraserSize] = useState<number>(16);
  
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Annotation | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Reset when page, fileUrl, or dimensions (zoom) changes
  useEffect(() => {
    setAnnotations([]);
    setRedoStack([]);
    setCurrentStroke(null);
    setIsDrawing(false);
  }, [currentPage, fileUrl, width, height]);

  // Main render function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all saved annotations
    annotations.forEach(ann => drawAnnotation(ctx, ann));
    
    // Draw the active stroke
    if (currentStroke) {
      drawAnnotation(ctx, currentStroke);
    }
  }, [annotations, currentStroke]);

  // Call renderCanvas whenever annotations or currentStroke changes, or on resize
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas, width, height]);

  const drawAnnotation = (ctx: CanvasRenderingContext2D, ann: Annotation) => {
    if (ann.points.length === 0) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (ann.type === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = ann.width;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = ann.color;
      ctx.lineWidth = ann.width;
    }

    if (ann.type === "highlighter") {
      // Hex to RGBA for highlighter transparency
      const r = parseInt(ann.color.slice(1, 3), 16) || 234;
      const g = parseInt(ann.color.slice(3, 5), 16) || 179;
      const b = parseInt(ann.color.slice(5, 7), 16) || 8;
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
      ctx.lineWidth = 24; // Thicker for highlighter
    }

    if (ann.type === "pencil" || ann.type === "highlighter" || ann.type === "eraser") {
      ctx.beginPath();
      ctx.moveTo(ann.points[0].x, ann.points[0].y);
      for (let i = 1; i < ann.points.length; i++) {
        ctx.lineTo(ann.points[i].x, ann.points[i].y);
      }
      ctx.stroke();
    } else if (ann.type === "line" && ann.points.length > 1) {
      const start = ann.points[0];
      const end = ann.points[ann.points.length - 1];
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    } else if (ann.type === "arrow" && ann.points.length > 1) {
      const start = ann.points[0];
      const end = ann.points[ann.points.length - 1];
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      
      // Draw arrowhead
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const headLen = 15;
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    } else if (ann.type === "circle" && ann.points.length > 1) {
      const start = ann.points[0];
      const end = ann.points[ann.points.length - 1];
      const radiusX = Math.abs(end.x - start.x) / 2;
      const radiusY = Math.abs(end.y - start.y) / 2;
      const centerX = Math.min(start.x, end.x) + radiusX;
      const centerY = Math.min(start.y, end.y) + radiusY;
      
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }

    ctx.restore();
  };

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scaling factors because the actual canvas pixel size might differ from its CSS size
    // For NativePdfReader, it uses devicePixelRatio. We must map the pointer event from CSS pixels to Canvas pixels.
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Only left click
    if (e.button !== 0 && e.pointerType === "mouse") return;
    
    // Prevent accidental selections or scroll on touch
    if (e.pointerType === "touch") {
      // Can't preventDefault in React pointerdown easily if it's passive, but we can set touch-action: none on the canvas
    }
    
    if (activeTool === "laser") return; // No drawing for laser pointer

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    const coords = getCoordinates(e);
    setIsDrawing(true);
    const currentWidth = activeTool === "eraser" ? eraserSize : pencilSize;
    
    setCurrentStroke({
      id: Date.now().toString(),
      type: activeTool,
      color: activeColor,
      width: currentWidth,
      points: [coords]
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;
    
    const coords = getCoordinates(e);
    setCurrentStroke(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        points: [...prev.points, coords]
      };
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;
    
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    setIsDrawing(false);
    if (currentStroke.points.length > 1) {
      setAnnotations(prev => [...prev, currentStroke]);
      setRedoStack([]); // Clear redo stack on new action
    }
    setCurrentStroke(null);
  };

  const undo = () => {
    if (annotations.length === 0) return;
    const newAnnotations = [...annotations];
    const popped = newAnnotations.pop();
    if (popped) {
      setAnnotations(newAnnotations);
      setRedoStack(prev => [...prev, popped]);
    }
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const newRedo = [...redoStack];
    const popped = newRedo.pop();
    if (popped) {
      setRedoStack(newRedo);
      setAnnotations(prev => [...prev, popped]);
    }
  };

  const clear = () => {
    if (window.confirm("Clear all annotations on this page?")) {
      setAnnotations([]);
      setRedoStack([]);
    }
  };

  const getCursor = () => {
    if (activeTool === "pencil") {
      const size = Math.max(4, pencilSize); // at least 4px so it's clickable and visible
      const encodedColor = encodeURIComponent(activeColor);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${encodedColor}" /></svg>`;
      return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${size/2} ${size/2}, crosshair`;
    } else if (activeTool === "eraser") {
      const size = eraserSize;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="rgba(255,255,255,0.8)" stroke="black" stroke-width="1" /></svg>`;
      return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${size/2} ${size/2}, crosshair`;
    } else if (activeTool === "laser") {
      const size = 24;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="1"/>
            <stop offset="40%" stop-color="#ef4444" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#glow)" />
        <circle cx="${size/2}" cy="${size/2}" r="${size/6}" fill="#ffffff" />
      </svg>`;
      return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${size/2} ${size/2}, crosshair`;
    }
    return "crosshair";
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* 
        The canvas captures pointer events so you can draw. 
        It sits exactly on top of the PDF canvas.
      */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute top-0 left-0 touch-none pointer-events-auto"
        style={{ 
          width: `${width / (window.devicePixelRatio || 1)}px`, 
          height: `${height / (window.devicePixelRatio || 1)}px`,
          cursor: getCursor()
        }}
      />

      {/* Floating Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl flex flex-col p-2.5 pointer-events-auto min-w-[310px] select-none">
        
        {/* Tools row */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1">
            <ToolButton icon={<Pencil className="w-4 h-4" />} active={activeTool === "pencil"} onClick={() => setActiveTool("pencil")} title="Pencil" />
            <ToolButton icon={<Highlighter className="w-4 h-4" />} active={activeTool === "highlighter"} onClick={() => setActiveTool("highlighter")} title="Highlighter" />
            <div className="w-px h-5 bg-[var(--border)] mx-1" />
            <ToolButton icon={<Circle className="w-4 h-4" />} active={activeTool === "circle"} onClick={() => setActiveTool("circle")} title="Circle" />
            <ToolButton icon={<Minus className="w-4 h-4" />} active={activeTool === "line"} onClick={() => setActiveTool("line")} title="Line" />
            <ToolButton icon={<ArrowUpRight className="w-4 h-4" />} active={activeTool === "arrow"} onClick={() => setActiveTool("arrow")} title="Arrow" />
            <div className="w-px h-5 bg-[var(--border)] mx-1" />
            <ToolButton icon={<Eraser className="w-4 h-4" />} active={activeTool === "eraser"} onClick={() => setActiveTool("eraser")} title="Eraser" />
            <ToolButton icon={<Pointer className="w-4 h-4" />} active={activeTool === "laser"} onClick={() => setActiveTool("laser")} title="Laser Pointer" />
          </div>
        </div>

        {/* Colors & Actions row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setActiveColor(color)}
                className={clsx(
                  "w-5 h-5 rounded-full border-2 transition-all",
                  activeColor === color ? "border-[var(--ink)] scale-110" : "border-transparent hover:scale-110"
                )}
                style={{ backgroundColor: color, boxShadow: color === "#ffffff" ? "inset 0 0 0 1px #e5e7eb" : "none" }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 border-l border-[var(--border)] pl-2">
            <ToolButton icon={<Undo2 className="w-4 h-4" />} onClick={undo} disabled={annotations.length === 0} title="Undo" />
            <ToolButton icon={<Redo2 className="w-4 h-4" />} onClick={redo} disabled={redoStack.length === 0} title="Redo" />
            <ToolButton icon={<Trash2 className="w-4 h-4" />} onClick={clear} disabled={annotations.length === 0} title="Clear Page" />
            <ToolButton icon={<X className="w-4 h-4" />} onClick={onClose} title="Close Doodle Mode" />
          </div>
        </div>

        {/* Size row (conditionally rendered) */}
        {(activeTool === "pencil" || activeTool === "eraser") && (
          <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 mt-2 bg-[var(--surface-subdued)] rounded-xl border border-[var(--border)]">
            <span className="text-[10px] font-bold text-[var(--ink-secondary)] uppercase tracking-wider shrink-0">
              {activeTool === "pencil" ? "Size" : "Eraser"}
            </span>
            <div className="w-px h-3 bg-[var(--border)] shrink-0" />
            <div className="flex items-center gap-1.5">
              {activeTool === "pencil" ? (
                [1, 2, 4, 6, 10, 16].map((size) => {
                  const circleSizes: Record<number, number> = { 1: 2, 2: 3, 4: 5, 6: 7, 10: 10, 16: 14 };
                  return (
                    <button
                      key={size}
                      onClick={() => setPencilSize(size)}
                      title={`Set pencil size to ${size}px`}
                      className={clsx(
                        "w-7 h-7 flex items-center justify-center rounded-lg transition-colors shrink-0",
                        pencilSize === size ? "bg-[var(--accent)] text-white shadow-sm" : "hover:bg-[var(--surface)] text-[var(--ink-secondary)] hover:text-[var(--ink)]"
                      )}
                    >
                      <div 
                        className="bg-current rounded-full" 
                        style={{ width: circleSizes[size] || size, height: circleSizes[size] || size }} 
                      />
                    </button>
                  );
                })
              ) : (
                [8, 16, 24, 32, 48].map((size) => {
                  const circleSizes: Record<number, number> = { 8: 5, 16: 8, 24: 12, 32: 16, 48: 20 };
                  return (
                    <button
                      key={size}
                      onClick={() => setEraserSize(size)}
                      title={`Set eraser size to ${size}px`}
                      className={clsx(
                        "w-7 h-7 flex items-center justify-center rounded-lg transition-colors shrink-0",
                        eraserSize === size ? "bg-[var(--accent)] text-white shadow-sm" : "hover:bg-[var(--surface)] text-[var(--ink-secondary)] hover:text-[var(--ink)]"
                      )}
                    >
                      <div 
                        className="rounded-full border-2 border-current" 
                        style={{ 
                          width: circleSizes[size] || 12, 
                          height: circleSizes[size] || 12 
                        }} 
                      />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolButton({ icon, active, onClick, disabled, title }: { icon: React.ReactNode, active?: boolean, onClick: () => void, disabled?: boolean, title?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={clsx(
        "p-1.5 rounded-lg transition-colors",
        active 
          ? "bg-[var(--accent)] text-white" 
          : "text-[var(--ink-secondary)] hover:bg-[var(--surface-subdued)] hover:text-[var(--ink)]",
        disabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
      )}
    >
      {icon}
    </button>
  );
}
