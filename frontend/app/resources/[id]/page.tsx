"use client";

import { useState, useEffect, useRef, use, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Clock, 
  Bookmark, 
  CheckCircle2, 
  Download,
  FileText,
  Share2,
  Check
} from "lucide-react";
import { resourceService, Resource } from "@/lib/resources";
import { resourceStorage } from "@/lib/resourceStorage";
import { clsx } from "clsx";

// New custom Native PDF components
import { NativePdfReader } from "@/components/resources/NativePdfReader";
import { PdfReaderToolbar } from "@/components/resources/PdfReaderToolbar";

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [resource, setResource] = useState<Resource | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // PDF Viewer Controls State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const readerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const found = resourceService.getById(id);
    if (found) {
      setResource(found);
      setIsBookmarked(resourceStorage.isSaved(found.id));
      setIsCompleted(resourceStorage.isCompleted(found.id));
      
      // If we have history for this resource, resume from last page
      const recentItems = resourceStorage.getRecentResources();
      const match = recentItems.find(r => r.id === found.id);
      if (match && match.lastPage && match.lastPage > 1) {
        setCurrentPage(match.lastPage);
      }
      
      resourceStorage.recordView(found.id, match?.lastPage || 1);
    }
  }, [id]);

  // Handle document loaded from PDF.js
  const handleDocumentLoad = useCallback((numPages: number) => {
    setPageCount(numPages);
    if (resource && !resource.pageCount) {
      // We could update the resource object here if we wanted to dynamically set page counts
    }
  }, [resource]);

  // Fullscreen change listener
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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
  }, [currentPage, pageCount, resource]);

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

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(50, prev - 25));
  const handleResetZoom = () => setZoomLevel(100);
  const handleFitWidth = () => {
    // A little hack to trigger re-calculation: fit width logic handles zooming to fit
    setZoomLevel(100); 
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

  if (!mounted) return null;

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-2xl mx-auto px-6">
        <div className="w-12 h-12 rounded-full bg-[var(--surface-subdued)] flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-[var(--ink-tertiary)]" />
        </div>
        <h1 className="text-2xl font-newsreader font-bold text-[var(--ink)] mb-2">Resource not found</h1>
        <p className="text-[14px] text-[var(--ink-secondary)] mb-8">
          The requested study material could not be located in the StudyHub catalog.
        </p>
        <Link 
          href="/resources" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--ink)] text-white text-[13px] font-semibold hover:bg-[var(--ink)]/90 transition-colors"
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
      <nav className="flex items-center gap-2 text-[13px] text-[var(--ink-tertiary)] mb-6 font-medium">
        <Link href="/resources" className="hover:text-[var(--ink)] transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          Resources
        </Link>
        <span>/</span>
        <span className="hover:text-[var(--ink)] transition-colors">{resource.category}</span>
        <span>/</span>
        <span className="text-[var(--ink)] truncate max-w-[220px] sm:max-w-md">{resource.title}</span>
      </nav>

      {/* HEADER BAR */}
      <header className="flex flex-col gap-6 mb-8 pb-6 border-b border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft-border)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                PDF · {resource.category}
              </span>

              {resource.readTimeEstimate && (
                <span className="text-[12px] text-[var(--ink-tertiary)] font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {resource.readTimeEstimate}
                </span>
              )}

              <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
              <span className="text-[12px] text-[var(--ink-tertiary)] font-mono">
                {pageCount > 1 ? pageCount : resource.pageCount} Pages
              </span>

              <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
              <span className={clsx(
                "text-[12px] font-semibold",
                resource.difficulty === "Advanced" ? "text-purple-600" :
                resource.difficulty === "Intermediate" ? "text-orange-600" :
                "text-emerald-600"
              )}>
                {resource.difficulty}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-newsreader font-medium text-[var(--ink)] leading-tight tracking-tight">
              {resource.title}
            </h1>

            <p className="text-[15px] text-[var(--ink-secondary)] leading-relaxed">
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
                  ? "bg-[var(--accent-soft)] border-[var(--accent-soft-border)] text-[var(--accent)]" 
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink)] shadow-xs"
              )}
            >
              <Bookmark className={clsx("w-4 h-4", isBookmarked && "fill-current")} />
              {isBookmarked ? "Saved" : "Save"}
            </button>
            
            <a
              href={downloadUrl}
              download={resource.filename}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink)] transition-all shadow-xs"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button 
              onClick={handleShare}
              className="flex items-center gap-2 p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink)] transition-all shadow-xs cursor-pointer"
              title="Share Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[var(--success)]" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* PDF READER WRAPPER */}
      <div 
        ref={readerContainerRef}
        className={clsx(
          "flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg transition-all",
          isFullscreen ? "fixed inset-0 z-50 rounded-none border-0 h-screen w-screen" : "w-full"
        )}
      >
        <PdfReaderToolbar 
          currentPage={currentPage}
          pageCount={pageCount}
          zoomLevel={zoomLevel}
          isFullscreen={isFullscreen}
          fileUrl={pdfStreamUrl}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onPageChange={handlePageChange}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onFitWidth={handleFitWidth}
          onToggleFullscreen={handleToggleFullscreen}
        />
        
        {/* NATIVE PDF.JS CANVAS READER */}
        <NativePdfReader 
          fileUrl={pdfStreamUrl}
          currentPage={currentPage}
          zoomLevel={zoomLevel}
          onDocumentLoad={handleDocumentLoad}
          className={isFullscreen ? "h-[calc(100vh-56px)]" : ""}
        />
      </div>

      {/* COMPLETION ACTION */}
      <div className="flex justify-center mt-8">
        <button 
          onClick={toggleCompleted}
          className={clsx(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold transition-all border shadow-sm cursor-pointer",
            isCompleted 
              ? "bg-[var(--success)] border-[var(--success)] text-white" 
              : "bg-[var(--surface)] border-[var(--border-strong)] text-[var(--ink)] hover:bg-[var(--surface-subdued)]"
          )}
        >
          <CheckCircle2 className={clsx("w-5 h-5", isCompleted && "fill-white text-[var(--success)]")} />
          {isCompleted ? "Resource Completed" : "Mark as Completed"}
        </button>
      </div>

      {/* RELATED STUDY MATERIALS */}
      {relatedResources.length > 0 && (
        <section className="mt-16 pt-10 border-t border-[var(--border)] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-newsreader font-medium text-[var(--ink)]">
                More in {resource.category}
              </h3>
              <p className="text-[13px] text-[var(--ink-secondary)]">
                Complementary study guides and handwritten notes in this track.
              </p>
            </div>
            <Link 
              href={`/resources`}
              className="text-[13px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1"
            >
              View all <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedResources.map((rel) => (
              <Link 
                key={rel.id}
                href={`/resources/${rel.id}`}
                className="group p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-subdued)]/30 transition-all flex flex-col justify-between gap-3 bg-[var(--surface)]"
              >
                <div>
                  <span className="text-[11px] font-semibold text-[var(--accent)] uppercase font-mono mb-1 block">
                    PDF · {rel.category}
                  </span>
                  <h4 className="text-[14px] font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--ink-tertiary)] pt-2 border-t border-[var(--border)]/60">
                  <span>{rel.difficulty}</span>
                  <span className="group-hover:translate-x-1 transition-transform text-[var(--accent)] font-semibold">
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
