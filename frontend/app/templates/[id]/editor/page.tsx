"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Download, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { templateWorkspaces } from "@/lib/data/templatesData";
import { SavedTemplateRecord } from "@/types";

export default function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: templateId } = use(params);
  const workspaceData = templateWorkspaces[templateId];

  // Form State
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (workspaceData) {
      // Initialize with default values
      const initial: Record<string, string> = {};
      workspaceData.fields.forEach(f => {
        initial[f.key] = f.value || "";
      });
      setFieldValues(initial);
    }
  }, [workspaceData]);

  if (!mounted) return null;

  if (!workspaceData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-10 h-10 text-[var(--accent)] mb-4" />
        <h2 className="text-[17px] font-semibold text-[var(--ink)] mb-2">Editor Workspace Not Found</h2>
        <p className="text-[14px] text-[var(--ink-secondary)] mb-6 text-center max-w-md">
          The requested template could not be loaded.
        </p>
        <Link href="/templates" className="text-[13px] text-[var(--accent)] hover:underline font-semibold flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Templates
        </Link>
      </div>
    );
  }

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate save to localStorage
    setTimeout(() => {
      try {
        const existingStr = localStorage.getItem("pathward-saved-templates");
        const existing: SavedTemplateRecord[] = existingStr ? JSON.parse(existingStr) : [];
        
        // Remove old version if it exists
        const filtered = existing.filter(t => t.id !== `saved-${templateId}`);
        
        const newRecord: SavedTemplateRecord = {
          id: `saved-${templateId}`,
          templateName: workspaceData.title,
          type: workspaceData.category,
          targetRole: "Custom Target",
          lastUpdated: "Just now",
          status: "Draft",
          href: `/templates/${templateId}/editor`
        };
        
        localStorage.setItem("pathward-saved-templates", JSON.stringify([newRecord, ...filtered]));
      } catch (e) {
        console.error(e);
      }
      setIsSaving(false);
      router.push("/templates#my-templates");
    }, 600);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("PDF Export triggered! (Simulation)");
    }, 1000);
  };

  // Helper to replace [fieldKey] with its value in the text
  const renderPreviewContent = (text: string) => {
    let result = text;
    workspaceData.fields.forEach(field => {
      const regex = new RegExp(`\\[${field.key}\\]`, 'g');
      const replacement = fieldValues[field.key] || `[${field.label.toUpperCase()}]`;
      result = result.replace(regex, replacement);
    });
    
    // Simple markdown-ish bold replacement
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return <span dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} />;
  };

  return (
    <div className="flex flex-col h-full w-full animate-in fade-in duration-300">
      {/* Editor Top Bar */}
      <div className="h-14 shrink-0 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href={`/templates/${templateId}`}
            className="text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-[var(--border)]"></div>
          <div>
            <div className="text-[13px] font-semibold text-[var(--ink)] flex items-center gap-2">
              {workspaceData.title}
              <span className="text-[10px] bg-[var(--surface-subdued)] text-[var(--ink-tertiary)] px-2 py-0.5 rounded-sm font-medium uppercase tracking-wider">
                Draft
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] rounded-sm transition-all"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-[var(--ink-secondary)] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Draft
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent)]/90 rounded-sm shadow-sm transition-all"
          >
            {isExporting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export PDF
          </button>
        </div>
      </div>

      {/* Editor Workspace Split */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Pane: Input Form */}
        <div className="w-1/2 flex flex-col bg-[var(--canvas)] border-r border-[var(--border)] overflow-y-auto">
          <div className="p-8 max-w-[600px] mx-auto w-full">
            <h2 className="text-[15px] font-semibold text-[var(--ink)] mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--ink-tertiary)]" />
              Document Content
            </h2>
            <p className="text-[13px] text-[var(--ink-secondary)] mb-8">
              Fill in the fields below. The document will update automatically.
            </p>

            <div className="flex flex-col gap-6">
              {workspaceData.fields.map(field => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label htmlFor={field.key} className="text-[12px] font-medium text-[var(--ink)]">
                    {field.label}
                  </label>
                  {field.key.toLowerCase().includes("desc") || field.key.toLowerCase().includes("result") || field.key.toLowerCase().includes("action") ? (
                    <textarea
                      id={field.key}
                      value={fieldValues[field.key] || ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-sm text-[13px] text-[var(--ink)] placeholder:text-[var(--ink-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] resize-y shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    />
                  ) : (
                    <input
                      type="text"
                      id={field.key}
                      value={fieldValues[field.key] || ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-sm text-[13px] text-[var(--ink)] placeholder:text-[var(--ink-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-6 border-t border-[var(--border)] flex items-center gap-3 text-[12px] text-[var(--success)] font-medium">
              <CheckCircle2 className="w-4 h-4" />
              All fields sync automatically
            </div>
          </div>
        </div>

        {/* Right Pane: Live Document Preview */}
        <div className="w-1/2 flex flex-col bg-[var(--surface-subdued)] overflow-y-auto">
          <div className="p-8 pb-20 flex justify-center min-h-full">
            {/* The Document Page */}
            <div className="w-full max-w-[750px] bg-[var(--surface)] border border-[var(--border)] rounded-sm shadow-sm p-10 md:p-12 shrink-0">
              <div className="flex flex-col gap-8">
                {workspaceData.structure.map((section, idx) => (
                  <div key={idx} className="flex flex-col gap-2 group relative">
                    {section.section !== "Header" && (
                      <div className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider border-b border-[var(--border)] pb-1 mb-2">
                        {section.section}
                      </div>
                    )}
                    <div 
                      className={clsx(
                        "text-[13px] text-[var(--ink)] leading-[1.8]",
                        section.section === "Header" && "text-center pb-4 border-b border-[var(--border)]"
                      )}
                    >
                      {renderPreviewContent(section.body)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
