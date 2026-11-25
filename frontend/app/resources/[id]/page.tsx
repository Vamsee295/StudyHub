"use client";

import { useState, useEffect, useRef, use, useCallback } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  Bookmark, 
  CheckCircle2, 
  Download,
  FileText,
  Share2,
  Check,
  Layers
} from "lucide-react";
import { resourceService, Resource } from "@/lib/resources";
import { resourceStorage } from "@/lib/resourceStorage";
import { clsx } from "clsx";

// New custom Native PDF components
import { NativePdfReader } from "@/components/resources/NativePdfReader";
import { PdfReaderToolbar } from "@/components/resources/PdfReaderToolbar";

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // AppLayout renders pages only on the client, so the catalog and localStorage can be read up front.
  const [resource, setResource] = useState<Resource | null>(() => resourceService.getById(id) ?? null);
  const [isBookmarked, setIsBookmarked] = useState(() => resourceStorage.isSaved(id));
  const [isCompleted, setIsCompleted] = useState(() => resourceStorage.isCompleted(id));
  const [copiedLink, setCopiedLink] = useState(false);

  // PDF Viewer Controls State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  // resume where the reader left off
  const [currentPage, setCurrentPage] = useState<number>(() => resourceStorage.getRecentItems().find((r) => r.id === id)?.lastPage || 1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDoodleMode, setIsDoodleMode] = useState(false);

  const readerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resourceService.getById(id)) {
      resourceStorage.recordView(id, resourceStorage.getRecentItems().find((r) => r.id === id)?.lastPage || 1);
    } else {
      // Dynamic fallback for newly added files
      fetch("/api/materials/catalog")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.resources)) {
            resourceService.setDynamicCatalog(data.resources);
            const dynamicFound = resourceService.getById(id);
            if (dynamicFound) {
              setResource(dynamicFound);
              setIsBookmarked(resourceStorage.isSaved(dynamicFound.id));
              setIsCompleted(resourceStorage.isCompleted(dynamicFound.id));
              resourceStorage.recordView(dynamicFound.id, 1);
            }
          }
        })
        .catch((err) => {
          console.warn("[ResourceDetail] Failed to fetch dynamic catalog:", err);
        });
    }
  }, [id]);

  // Handle document loaded from PDF.js
  const handleDocumentLoad = useCallback((numPages: number) => {
    setPageCount(numPages);
    if (resource) resourceStorage.recordView(resource.id, currentPage, numPages); // the real page count drives the progress bar
  }, [resource, currentPage]);

  // Fullscreen change listener
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);


  const toggleBookmark = () => {
    if (!resource) return;
    const nowSaved = resourceStorage.toggleSave(resource.id);
    setIsBookmarked(nowSaved);
  };

  const toggleCompleted = () => {
    if (!resource) return;
    const nowCompleted = resourceStorage.toggleCompleted(resource.id);
    setIsCompleted(nowCompleted);
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (e) {
        console.warn("Clipboard write failed", e);
      }
    }
  };

  const handleToggleFullscreen = () => {
    if (!readerContainerRef.current) return;
    if (!document.fullscreenElement) {
      readerContainerRef.current.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request error", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen error", err);
      });
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(300, prev + 25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(25, prev - 25));
  const handleResetZoom = () => setZoomLevel(100);
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleFitWidth = () => {
    // Toggle between default fit and expanded width view
    setZoomLevel((prev) => (prev === 100 ? 135 : 100)); 
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      const next = currentPage + 1;
      setCurrentPage(next);
      if (resource) resourceStorage.recordView(resource.id, next);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
      if (resource) resourceStorage.recordView(resource.id, prev);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page);
      if (resource) resourceStorage.recordView(resource.id, page);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (e.g. page jump)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          handleNextPage();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          handlePrevPage();
          break;
        case "+":
        case "=":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
          e.preventDefault();
          handleZoomOut();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }); // re-binds each render so the handlers see the current page


  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-2xl mx-auto px-6">
        <div className="w-12 h-12 rounded-full bg-paper-2 flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-mute" />
        </div>
        <h1 className="display mb-2 text-[40px]">Resource not found</h1>
        <p className="text-[14px] text-body mb-8">
          The requested study material could not be located in the StudyHub catalog.
        </p>
        <Link 
          href="/resources" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-[13px] font-semibold hover:bg-ink/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resources
        </Link>
      </div>
    );
  }

  const encodedFilename = encodeURIComponent(resource.filename);
  // Using direct /api/materials/ path to fetch the PDF payload for pdfjs
  const pdfStreamUrl = `/api/materials/${encodedFilename}`;
  const downloadUrl = `/api/materials/${encodedFilename}?download=true`;

  const relatedResources = resourceService
    .getByCategory(resource.category)
    .filter((r) => r.id !== resource.id)
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-24 font-sans">
      
      {/* NAVIGATION BREADCRUMB */}
      <nav className="flex items-center gap-2 text-[13px] text-mute mb-6 font-medium">
        <Link href="/resources" className="hover:text-ink transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          Resources
        </Link>
        <span>/</span>
        <span className="hover:text-ink transition-colors">{resource.category}</span>
        <span>/</span>
        <span className="text-ink truncate max-w-[220px] sm:max-w-md">{resource.title}</span>
      </nav>

      {/* HEADER BAR */}
      <header className="flex flex-col gap-6 mb-8 pb-6 border-b border-hair">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-accent-soft text-accent-ink border border-accent-line flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                PDF · {resource.category}
              </span>

              {resource.readTimeEstimate && (
                <span className="text-[12px] text-mute font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {resource.readTimeEstimate}
                </span>
              )}

              <span className="w-1 h-1 rounded-full bg-ink/25"></span>
              <span className="text-[12px] text-mute font-mono">
                {pageCount > 1 ? pageCount : resource.pageCount} Pages
              </span>

              <span className="w-1 h-1 rounded-full bg-ink/25"></span>
              <span className={clsx(
                "text-[12px] font-semibold",
                resource.difficulty === "Advanced" ? "text-accent-ink" :
                resource.difficulty === "Intermediate" ? "text-warning" :
                "text-note"
              )}>
                {resource.difficulty}
              </span>
            </div>

            <h1 className="display text-[40px] md:text-[56px]">
              {resource.title}
            </h1>

            <p className="text-[15px] text-body leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start">
            <button 
              onClick={toggleBookmark}
              className={clsx(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all border cursor-pointer",
                isBookmarked 
                  ? "bg-accent-soft border-accent-line text-accent-ink" 
                  : "bg-card border-hair text-body hover:border-line hover:text-ink"
              )}
            >
              <Bookmark className={clsx("w-4 h-4", isBookmarked && "fill-current")} />
              {isBookmarked ? "Saved" : "Save"}
            </button>
            
            <a
              href={downloadUrl}
              download={resource.filename}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium bg-card border-[1.5px] border-hair text-body hover:border-line hover:text-ink transition-all"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button 
              onClick={handleShare}
              className="flex items-center gap-2 p-2 rounded-xl bg-card border-[1.5px] border-hair text-body hover:border-line hover:text-ink transition-all cursor-pointer"
              title="Share Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-note" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* PACK UNIT SWITCHER BAR (if part of a pack) */}
      {(() => {
        const parentPack = resourceService.getAll().find(
          (r) => r.isPack && (r.id === resource.id || r.packItems?.some((p) => p.id === resource.id || p.filename.toLowerCase() === resource.filename.toLowerCase()))
        );
        if (!parentPack || !parentPack.packItems) return null;
        return (
          <div className="mb-6 p-3 bg-card border-[1.5px] border-hair rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <Layers className="w-4 h-4 text-accent-ink" />
              <span>{parentPack.title}:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              {parentPack.packItems.map((item) => {
                const isActive = item.id === resource.id || item.filename.toLowerCase() === resource.filename.toLowerCase();
                return (
                  <Link
                    key={item.id}
                    href={`/resources/${item.id}`}
                    className={clsx(
                      "px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all shrink-0 flex items-center gap-1.5",
                      isActive
                        ? "bg-accent text-paper"
                        : "bg-paper-2 text-body hover:text-ink hover:bg-paper-2/80 border border-transparent hover:border-hair"
                    )}
                  >
                    <span>{item.unit || item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* PDF READER WRAPPER */}
      <div 
        ref={readerContainerRef}
        className={clsx(
          "flex flex-col bg-card border-[1.5px] border-hair rounded-2xl overflow-hidden shadow-lg transition-all",
          isFullscreen ? "fixed inset-0 z-50 rounded-none border-0 h-screen w-screen" : "w-full"
        )}
      >
        <PdfReaderToolbar 
          currentPage={currentPage}
          pageCount={pageCount}
          zoomLevel={zoomLevel}
          rotation={rotation}
          isFullscreen={isFullscreen}
          fileUrl={pdfStreamUrl}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onPageChange={handlePageChange}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onRotate={handleRotate}
          onFitWidth={handleFitWidth}
          onToggleFullscreen={handleToggleFullscreen}
          isDoodleMode={isDoodleMode}
          onToggleDoodle={() => setIsDoodleMode(!isDoodleMode)}
        />
        
        {/* NATIVE PDF.JS CANVAS READER */}
        <NativePdfReader 
          fileUrl={pdfStreamUrl}
          currentPage={currentPage}
          zoomLevel={zoomLevel}
          rotation={rotation}
          onDocumentLoad={handleDocumentLoad}
          className={isFullscreen ? "h-[calc(100vh-56px)]" : ""}
          isDoodleMode={isDoodleMode}
          onCloseDoodle={() => setIsDoodleMode(false)}
        />
      </div>

      {/* COMPLETION ACTION */}
      <div className="flex justify-center mt-8">
        <button 
          onClick={toggleCompleted}
          className={clsx(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold transition-all border cursor-pointer",
            isCompleted 
              ? "bg-note border-note text-paper" 
              : "bg-card border-line text-ink hover:bg-paper-2"
          )}
        >
          <CheckCircle2 className={clsx("w-5 h-5", isCompleted && "fill-white text-note")} />
          {isCompleted ? "Resource Completed" : "Mark as Completed"}
        </button>
      </div>

      {/* RELATED STUDY MATERIALS */}
      {relatedResources.length > 0 && (
        <section className="mt-16 pt-10 border-t border-hair flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium text-ink">
                More in {resource.category}
              </h3>
              <p className="text-[13px] text-body">
                Complementary study guides and handwritten notes in this track.
              </p>
            </div>
            <Link 
              href={`/resources`}
              className="text-[13px] font-semibold text-accent-ink hover:text-accent-ink flex items-center gap-1"
            >
              View all <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedResources.map((rel) => (
              <Link 
                key={rel.id}
                href={`/resources/${rel.id}`}
                className="group p-4 rounded-xl border-[1.5px] border-hair hover:border-accent hover:bg-paper-2/30 transition-all flex flex-col justify-between gap-3 bg-card"
              >
                <div>
                  <span className="text-[11px] font-semibold text-accent-ink uppercase font-mono mb-1 block">
                    PDF · {rel.category}
                  </span>
                  <h4 className="text-[14px] font-semibold text-ink group-hover:text-accent-ink transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[11px] text-mute pt-2 border-t border-hair/60">
                  <span>{rel.difficulty}</span>
                  <span className="group-hover:translate-x-1 transition-transform text-accent-ink font-semibold">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
