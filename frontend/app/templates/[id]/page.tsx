"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Download, Eye, TerminalSquare, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { templateWorkspaces } from "@/lib/data/templatesData";
import { SavedTemplateRecord } from "@/types";

export default function TemplateWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: templateId } = use(params);
  const workspaceData = templateWorkspaces[templateId];

  // Form State
  // starts from the template's default values
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() =>
    Object.fromEntries((workspaceData?.fields ?? []).map((f) => [f.key, f.value || ""]))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "preview">("split");

  if (!workspaceData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-10 h-10 text-accent-ink mb-4" />
        <h2 className="label-cond text-[22px] mb-2">Template not found</h2>
        <p className="text-body mb-6 text-center max-w-md">
          The requested template could not be loaded. This might be because the template ID is invalid or the data is missing.
        </p>
        <Link href="/templates" className="text-accent-ink hover:underline font-semibold flex items-center gap-2">
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
          targetRole: "Custom Target", // Could be a field too
          lastUpdated: "Just now",
          status: "Draft",
          href: `/templates/${templateId}`
        };
        
        localStorage.setItem("pathward-saved-templates", JSON.stringify([newRecord, ...filtered]));
      } catch (e) {
        console.error(e);
      }
      setIsSaving(false);
      router.push("/templates#my-templates");
    }, 600);
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
    <div className="w-full max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-500 min-h-[calc(100vh-140px)] flex flex-col">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-hair">
        <div>
          <Link href="/templates" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-body hover:text-ink transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Templates
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="display text-[36px] md:text-[44px]">{workspaceData.title}</h1>
            <span className="text-[10px] font-mono font-semibold text-accent-ink bg-accent-soft px-2 py-0.5 rounded tracking-wider uppercase border border-accent-line hidden sm:block">
              {workspaceData.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-paper-2 p-1 rounded-lg border-[1.5px] border-hair mr-2 hidden md:flex">
            <button
              onClick={() => setViewMode("split")}
              className={clsx(
                "px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all flex items-center gap-1.5",
                viewMode === "split" ? "bg-card text-ink" : "text-body hover:text-ink"
              )}
            >
              <TerminalSquare className="w-3.5 h-3.5" /> Editor
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={clsx(
                "px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all flex items-center gap-1.5",
                viewMode === "preview" ? "bg-card text-ink" : "text-body hover:text-ink"
              )}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
          
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-card border-[1.5px] border-hair rounded-lg text-[13px] font-semibold text-body hover:text-ink hover:bg-paper-2 transition-all flex-1 sm:flex-none">
            <Download className="w-4 h-4" /> Export
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-accent text-paper rounded-lg text-[13px] font-semibold hover:bg-accent-ink transition-all disabled:opacity-70 flex-1 sm:flex-none"
          >
            {isSaving ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Template
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className={clsx(
        "flex flex-col lg:flex-row gap-6 flex-1",
        viewMode === "preview" && "justify-center"
      )}>
        
        {/* Editor Form Panel */}
        <div className={clsx(
          "w-full lg:w-1/3 flex flex-col gap-5",
          viewMode === "preview" ? "hidden" : "block"
        )}>
          <div className="bg-card border-[1.5px] border-hair rounded-xl p-5 sticky top-[90px] overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
            <h3 className="text-[14px] font-bold text-ink mb-4 flex items-center gap-2">
              <TerminalSquare className="w-4 h-4 text-body" />
              Template Variables
            </h3>
            
            <div className="flex flex-col gap-4">
              {workspaceData.fields.map(field => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label htmlFor={field.key} className="text-[12px] font-semibold text-body uppercase tracking-wide">
                    {field.label}
                  </label>
                  {field.key.toLowerCase().includes("desc") || field.key.toLowerCase().includes("result") ? (
                    <textarea
                      id={field.key}
                      value={fieldValues[field.key] || ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 bg-paper border-[1.5px] border-hair hover:border-line focus:border-accent focus:ring-1 focus:ring-accent rounded-lg text-[13px] text-ink transition-all resize-none outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      id={field.key}
                      value={fieldValues[field.key] || ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-paper border-[1.5px] border-hair hover:border-line focus:border-accent focus:ring-1 focus:ring-accent rounded-lg text-[13px] text-ink transition-all outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className={clsx(
          "w-full flex-1",
          viewMode === "preview" ? "max-w-3xl mx-auto" : "lg:w-2/3"
        )}>
          <div className="bg-card border-[1.5px] border-hair rounded-xl min-h-full">
            {/* Preview Toolbar */}
            <div className="bg-paper border-b border-hair px-4 py-3 flex items-center gap-2 rounded-t-xl">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="ml-4 text-[11px] font-mono text-body tracking-wide">
                Live Document Preview / {workspaceData.category.toLowerCase()}.txt
              </div>
            </div>
            
            {/* Document Content */}
            <div className="p-8 md:p-12 font-sans text-[14px] text-ink leading-relaxed flex flex-col gap-6">
              {workspaceData.structure.map((section, idx) => (
                <div key={idx} className="flex flex-col gap-2 relative group">
                  <div className="absolute -left-6 top-1 text-[10px] text-mute opacity-0 group-hover:opacity-100 transition-opacity">§</div>
                  {renderPreviewContent(section.body)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
