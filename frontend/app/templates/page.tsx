"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TemplatesHeader } from "@/components/templates/TemplatesHeader";
import { TemplatesSearchFilter } from "@/components/templates/TemplatesSearchFilter";
import { DraftsSection } from "@/components/templates/DraftsSection";
import { LibraryGridSection } from "@/components/templates/LibraryGridSection";
import { RecommendationsSection } from "@/components/templates/RecommendationsSection";
import { PreviewSnapshotSection } from "@/components/templates/PreviewSnapshotSection";
import { MyTemplatesTable } from "@/components/templates/MyTemplatesTable";
import { CheckCircle2 } from "lucide-react";
import {
  inFlightDrafts,
  templateLibrary,
  recommendedTemplates,
  myTemplatesList,
} from "@/lib/data/templatesData";
import { SavedTemplateRecord } from "@/types";

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplateRecord[]>([]);

  // Load saved templates from localStorage on mount
  useEffect(() => {
    const localData = localStorage.getItem("pathward-saved-templates");
    if (localData) {
      try {
        setSavedTemplates(JSON.parse(localData));
      } catch (e) {
        console.error("Error parsing saved templates", e);
        setSavedTemplates(myTemplatesList); // Fallback
      }
    } else {
      setSavedTemplates(myTemplatesList); // Fallback to mock data if empty
    }
  }, []);

  // Filter templates based on search query and category
  const filteredLibrary = useMemo(() => {
    let filtered = templateLibrary;

    if (activeCategory !== "all") {
      filtered = filtered.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [searchQuery, activeCategory]);

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 animate-in fade-in duration-500">
      <TemplatesHeader />

      <TemplatesSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Main Content Areas */}
      
      {/* Hide Drafts and Recommendations if searching/filtering */}
      {searchQuery === "" && activeCategory === "all" && (
        <>
          <DraftsSection drafts={inFlightDrafts} />
          <RecommendationsSection recommendations={recommendedTemplates} />
          <PreviewSnapshotSection />
        </>
      )}

      <LibraryGridSection templates={filteredLibrary} />

      {searchQuery === "" && activeCategory === "all" && (
        <MyTemplatesTable savedTemplates={savedTemplates} />
      )}

      <div className="mt-16 pt-8 border-t border-[var(--border)] text-center max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-10 h-10 bg-[var(--surface-subdued)] rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
        </div>
        <p className="text-[13px] text-[var(--ink-secondary)] leading-relaxed">
          <strong className="text-[var(--ink)] font-semibold">Technical Verification Note:</strong> All resumes and
          cover letter templates are parsed through our standard ATS simulator to ensure they output valid,
          machine-readable text blocks without tabular artifacting.
        </p>
      </div>
    </div>
  );
}
