"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { clsx } from "clsx";
import { AlertCircle, RefreshCw } from "lucide-react";
import { AnnotationLayer } from "./AnnotationLayer";

// Use Cloudflare CDN for the worker to avoid Webpack configuration issues in Next.js
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface NativePdfReaderProps {
  fileUrl: string;
  currentPage: number;
  zoomLevel: number;
  rotation?: number;
  onDocumentLoad: (pageCount: number) => void;
  className?: string;
  isDoodleMode?: boolean;
  onCloseDoodle?: () => void;
}

export function NativePdfReader({
  fileUrl,
  currentPage,
  zoomLevel,
  rotation = 0,
  onDocumentLoad,
  className,
  isDoodleMode,
  onCloseDoodle
}: NativePdfReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number } | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const renderTaskRef = useRef<RenderTask | null>(null);

  // Measure container width on mount and on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Load Document
  useEffect(() => {
    let isMounted = true;
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // We use a clean getDocument call
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const doc = await loadingTask.promise;
        
        if (isMounted) {
          setPdfDoc(doc);
          onDocumentLoad(doc.numPages);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error loading PDF:", err);
          setError(err.message || "Failed to load PDF document.");
          setIsLoading(false);
        }
      }
    };
    loadPdf();
    
    return () => { 
      isMounted = false; 
    };
  }, [fileUrl, onDocumentLoad]);

  // Render Page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    let isMounted = true;
    
    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (!isMounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false }); // Better performance
        if (!ctx) return;

        // Base scale for crisp rendering on high-DPI screens
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Calculate viewport with rotation and zoom applied
        const unscaledViewport = page.getViewport({ scale: 1.0, rotation: rotation });
        
        // Base scale to fit container width (minus padding)
        const effectiveContainerWidth = containerRef.current?.clientWidth || containerWidth || 800;
        let baseScale = 1.0;
        if (unscaledViewport.width > effectiveContainerWidth - 32) {
          baseScale = (effectiveContainerWidth - 32) / unscaledViewport.width;
        } else if (unscaledViewport.width < effectiveContainerWidth - 32) {
          baseScale = (effectiveContainerWidth - 32) / unscaledViewport.width;
          if (baseScale > 1.5) baseScale = 1.5;
        }

        const scale = baseScale * (zoomLevel / 100);
        
        const viewport = page.getViewport({ scale: scale * pixelRatio, rotation: rotation });

        // Set actual canvas size (for internal drawing)
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Set CSS display size
        canvas.style.height = `${viewport.height / pixelRatio}px`;
        canvas.style.width = `${viewport.width / pixelRatio}px`;

        setCanvasDimensions({
          width: viewport.width,
          height: viewport.height,
        });

        if (renderTaskRef.current) {
          await renderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
          // @ts-ignore - some versions of types demand canvas, some don't
          canvas: canvas,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
        
      } catch (err: any) {
        if (err.name === 'RenderingCancelledException') {
          // Normal during rapid page changes
          return;
        }
        console.error("Error rendering page:", err);
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, currentPage, zoomLevel, rotation, containerWidth]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[500px] w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
        <AlertCircle className="w-10 h-10 text-[var(--error)] mb-3" />
        <h3 className="text-[16px] font-semibold text-[var(--ink)] mb-1">Unable to load document</h3>
        <p className="text-[13px] text-[var(--ink-secondary)] mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)] text-[13px] font-semibold text-[var(--ink)] hover:bg-[var(--border)] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={clsx(
        "w-full flex justify-center bg-[#525659] min-h-[500px] sm:min-h-[700px] relative overflow-auto p-4 md:p-8", 
        className
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#525659] z-10 text-white/80">
          <RefreshCw className="w-8 h-8 animate-spin mb-4 text-white/50" />
          <p className="text-[14px] font-medium tracking-wide">Loading Document...</p>
        </div>
      )}
      <div className="relative inline-block">
        <canvas 
          ref={canvasRef} 
          className={clsx(
            "bg-white shadow-2xl transition-opacity duration-300 rounded-sm",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
        {isDoodleMode && canvasDimensions && !isLoading && (
          <AnnotationLayer
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            currentPage={currentPage}
            fileUrl={fileUrl}
            onClose={() => onCloseDoodle && onCloseDoodle()}
          />
        )}
      </div>
    </div>
  );
}
