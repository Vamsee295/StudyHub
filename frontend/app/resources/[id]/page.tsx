"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Bookmark, CheckCircle2, Share2, Lightbulb, AlertTriangle, ArrowRight } from "lucide-react";
import { resourceDetailsMap } from "@/lib/data/resourcesData";

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  // We unwrap params assuming it's available. In Next.js 15, params might be a promise in server components,
  // but in standard App Router client components without async, we can read it directly for simple string matching,
  // or use `React.use()` if it's treated as a promise. Here we just use the string.
  const id = params.id;
  const [content, setContent] = useState<any>(resourceDetailsMap[id] || null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResource() {
      try {
        const { resourcesApi } = await import('@/lib/api/resources');
        const res = await resourcesApi.getResource(id);
        
        if (res.file_type === 'pdf') {
          const urlRes = await resourcesApi.getResourceUrl(id);
          setPdfUrl(urlRes.url);
          // Set dynamic content if it wasn't in the mock map
          if (!content) {
            setContent({
              id: res.id,
              title: res.title,
              topic: res.subject,
              timeEstimate: "Read",
              difficulty: "All Levels",
              summary: "PDF Document",
              keyTakeaways: [],
              sections: [],
              interviewTraps: [],
              relatedResources: []
            });
          }
        }
      } catch (e) {
        console.error("Failed to load backend resource:", e);
      } finally {
        setLoading(false);
      }
    }
    
    loadResource();
  }, [id, content]);

  useEffect(() => {
    setMounted(true);
    
    // Check saved state
    const localSaved = localStorage.getItem("pathward_saved_resources");
    if (localSaved) {
      try {
        const saved = JSON.parse(localSaved);
        setIsBookmarked(saved.some((r: any) => r.id === id));
      } catch (e) {
        // ignore
      }
    }

    // Add to recent history
    if (content && !loading) {
      const localRecent = localStorage.getItem("pathward_recent_resources");
      let recent = [];
      if (localRecent) {
        try { recent = JSON.parse(localRecent); } catch(e) {}
      }
      
      const newRecent = [
        {
          id: content.id,
          title: content.title,
          topic: content.topic,
          type: "Handbook",
          viewedAt: "Just now",
          href: `/resources/${content.id}`
        },
        ...recent.filter((r: any) => r.id !== content.id)
      ].slice(0, 5);
      
      localStorage.setItem("pathward_recent_resources", JSON.stringify(newRecent));
    }
  }, [id, content, loading]);

  if (!mounted || loading) return null;

  if (!content && !pdfUrl) {
    // If not found in our mock map and no backend resource
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center max-w-7xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-[var(--ink)] mb-4">Resource Detail: {id}</h1>
        <p className="text-[var(--ink-secondary)] mb-8">This resource was not found.</p>
        <Link href="/resources" className="text-[var(--accent)] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Resources
        </Link>
      </div>
    );
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Real implementation would sync with localStorage Saved Resources array here
  };

  return (
    <div className="max-w-4xl mx-auto w-[calc(100%-32px)] md:w-full pb-32">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] text-[var(--ink-tertiary)] mb-8 font-medium">
        <Link href="/resources" className="hover:text-[var(--ink)] transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          Resources
        </Link>
        <span>/</span>
        <span className="hover:text-[var(--ink)] transition-colors cursor-pointer">{content.topic}</span>
        <span>/</span>
        <span className="text-[var(--ink)] truncate max-w-[200px] sm:max-w-xs">{content.title}</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col gap-6 mb-12">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded text-[11px] font-medium bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border border-[var(--border)]">
            {content.topic}
          </span>
          <span className="text-[12px] text-[var(--ink-tertiary)] font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {content.timeEstimate}
          </span>
          <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
          <span className="text-[12px] text-orange-600 font-medium">
            {content.difficulty}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-newsreader font-medium text-[var(--ink)] leading-tight tracking-tight">
          {content.title}
        </h1>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border)]">
          <button 
            onClick={toggleBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all border ${
              isBookmarked 
                ? "bg-[var(--accent-soft)] border-[var(--accent-soft-border)] text-[var(--accent)]" 
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink)] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
            {isBookmarked ? "Saved" : "Save Resource"}
          </button>
          
          <button 
            onClick={() => setIsCompleted(!isCompleted)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all border ${
              isCompleted 
                ? "bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]" 
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink)] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? "fill-current" : ""}`} />
            {isCompleted ? "Completed" : "Mark as Completed"}
          </button>
          
          <button className="flex items-center gap-2 p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink)] transition-all ml-auto shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <article className="flex flex-col gap-10">
        
        {pdfUrl && (
          <div className="w-full h-[800px] border border-[var(--border)] rounded-2xl overflow-hidden mt-4 shadow-sm bg-[var(--surface-subdued)] relative">
            <iframe 
              src={pdfUrl} 
              className="absolute inset-0 w-full h-full border-0" 
              title="PDF Viewer" 
            />
          </div>
        )}

        {/* Summary */}
        <div className="text-[17px] leading-relaxed text-[var(--ink-secondary)] font-newsreader">
          {content.summary}
        </div>

        {/* Key Takeaways */}
        <div className="bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] rounded-2xl p-6">
          <h3 className="text-[15px] font-semibold text-[var(--accent)] mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Key Takeaways
          </h3>
          <ul className="flex flex-col gap-3">
            {content.keyTakeaways.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-[var(--ink)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1.5"></span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-12">
          {content.sections.map((section: any, idx: number) => (
            <section key={idx} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">
                {section.heading}
              </h2>
              <p className="text-[15px] leading-relaxed text-[var(--ink-secondary)]">
                {section.content}
              </p>
              {section.codeSnippet && (
                <div className="mt-2 rounded-xl overflow-hidden border border-[var(--border)] bg-[#1e1e1e]">
                  <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d]">
                    <span className="text-[11px] font-mono text-[#a0a0a0] uppercase tracking-wider">{section.codeLanguage}</span>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-[13px] font-mono leading-relaxed text-[#d4d4d4]">
                      {section.codeSnippet}
                    </code>
                  </pre>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Interview Traps */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mt-4">
          <h3 className="text-[15px] font-semibold text-orange-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Common Interview Traps
          </h3>
          <ul className="flex flex-col gap-3">
            {content.interviewTraps.map((trap: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-orange-900">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5"></span>
                <span className="leading-relaxed">{trap}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Next Steps */}
        <div className="pt-10 border-t border-[var(--border)]">
          <h3 className="text-[16px] font-semibold text-[var(--ink)] mb-4">
            Related Resources
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.relatedResources.map((res: any, i: number) => (
              <Link 
                key={i}
                href={res.href}
                className="group p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-subdued)]/30 transition-all flex items-center justify-between"
              >
                <span className="text-[14px] font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                  {res.title}
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--ink-tertiary)] group-hover:text-[var(--accent)] transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>

      </article>
    </div>
  );
}
