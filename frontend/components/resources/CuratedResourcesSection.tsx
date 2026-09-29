"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Layers, 
  ChevronDown, 
  BookOpen, 
  Download,
  FolderOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Resource } from "@/lib/resources";
import { BookmarkButton } from "./BookmarkButton";
import { clsx } from "clsx";

interface CuratedResourcesSectionProps {
  resources: Resource[];
  bookmarkedIds: string[];
  completedIds?: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export function CuratedResourcesSection({ 
  resources, 
  bookmarkedIds,
  completedIds = [],
  onToggleBookmark 
}: CuratedResourcesSectionProps) {
  // Track open/collapsed state of resource packs
  const [expandedPacks, setExpandedPacks] = useState<Record<string, boolean>>({});

  const togglePack = (packId: string) => {
    setExpandedPacks((prev) => ({
      ...prev,
      [packId]: !prev[packId]
    }));
  };

  if (!resources || resources.length === 0) {
    return (
      <section className="flex flex-col gap-3 py-16 items-center justify-center text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface-subdued)]/30 px-6">
        <div className="w-12 h-12 rounded-full bg-[var(--surface-subdued)] flex items-center justify-center mb-2">
          <FileText className="w-5 h-5 text-[var(--ink-tertiary)]" />
        </div>
        <h3 className="text-[16px] font-semibold text-[var(--ink)]">No resources found</h3>
        <p className="text-[13px] text-[var(--ink-secondary)] max-w-sm">
          Try adjusting your search keywords or choosing a different category filter.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 scroll-mt-24" id="curated-resources">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-newsreader font-medium text-[var(--ink)]">Official Placement Study Materials</h2>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20">
            <ShieldCheck className="w-3 h-3" />
            Verified Materials
          </span>
        </div>
        <span className="text-[12px] font-mono text-[var(--ink-tertiary)]">
          {resources.length} {resources.length === 1 ? "Material" : "Materials"} Available
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {resources.map((resource) => {
          const isDone = completedIds.includes(resource.id);
          const isPack = Boolean(resource.isPack && resource.packItems && resource.packItems.length > 0);
          const isExpanded = Boolean(expandedPacks[resource.id]);

          // Render Course Pack Card (such as Advance Algorithms and Data Structures Pack)
          if (isPack) {
            return (
              <div 
                key={resource.id}
                className={clsx(
                  "col-span-1 lg:col-span-2 group bg-[var(--surface)] border rounded-2xl p-5 md:p-6 flex flex-col gap-4 transition-all relative shadow-sm",
                  isExpanded 
                    ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/10 shadow-md" 
                    : "border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md hover:shadow-[var(--accent)]/5"
                )}
              >
                {/* Header row with badges and bookmark */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      COURSE PACK · {resource.category}
                    </span>
                    <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft-border)] flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" />
                      {resource.packItems?.length || 4} Files Included
                    </span>
                    {isDone && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>

                  <BookmarkButton 
                    resourceId={resource.id} 
                    isBookmarked={bookmarkedIds.includes(resource.id)}
                    onToggle={onToggleBookmark}
                  />
                </div>

                {/* Pack Title & Description */}
                <div 
                  className="cursor-pointer select-none"
                  onClick={() => togglePack(resource.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[19px] md:text-[20px] font-semibold text-[var(--ink)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                      {resource.title}
                    </h3>
                  </div>
                  <p className="text-[14px] text-[var(--ink-secondary)] leading-relaxed mt-1.5">
                    {resource.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 bg-[var(--surface-subdued)] text-[var(--ink-secondary)] rounded-md border border-[var(--border)]/60 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Bar / Click to Drop Button */}
                <div className="mt-auto pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-[12px] text-[var(--ink-tertiary)] font-medium">
                    {resource.readTimeEstimate && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {resource.readTimeEstimate}
                      </span>
                    )}
                    {resource.pageCount && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
                        <span>{resource.pageCount} Pages Total</span>
                      </>
                    )}
                    <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
                    <span className="text-purple-600 font-semibold">
                      {resource.difficulty}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => togglePack(resource.id)}
                    className={clsx(
                      "flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer shadow-sm",
                      isExpanded
                        ? "bg-[var(--ink)] text-white hover:bg-[var(--ink)]/90"
                        : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[var(--accent)]/20"
                    )}
                  >
                    <span>{isExpanded ? "Collapse Pack Files" : `Drop ${resource.packItems?.length || 4} Files (Click to View)`}</span>
                    <ChevronDown className={clsx("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-180")} />
                  </button>
                </div>

                {/* DROPPED FILES ACCORDION TRAY */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden mt-2 pt-2 border-t border-[var(--border)]"
                    >
                      <div className="bg-[var(--surface-subdued)]/60 border border-[var(--border)] rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-[var(--accent)]" />
                            <span className="text-[13px] font-semibold text-[var(--ink)]">
                              Pack Contents ({resource.packItems?.length || 4} Files)
                            </span>
                          </div>
                          <span className="text-[11px] text-[var(--ink-tertiary)] hidden sm:inline">
                            Click any unit below to read in PDF viewer
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {resource.packItems?.map((item, idx) => (
                            <div 
                              key={item.id}
                              className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-sm rounded-xl p-3.5 flex flex-col justify-between gap-3 transition-all group/sub"
                            >
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft-border)]">
                                    {item.unit || `Unit ${idx + 1}`}
                                  </span>
                                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] truncate max-w-[160px]">
                                    {item.filename}
                                  </span>
                                </div>
                                <Link href={`/resources/${item.id}`}>
                                  <h4 className="text-[14px] font-semibold text-[var(--ink)] group-hover/sub:text-[var(--accent)] transition-colors leading-snug cursor-pointer">
                                    {item.title}
                                  </h4>
                                </Link>
                                <p className="text-[12px] text-[var(--ink-secondary)] line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>

                              <div className="pt-2.5 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] text-[var(--ink-tertiary)]">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{item.pageCount} Pages</span>
                                  <span>•</span>
                                  <span>{item.readTimeEstimate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`/api/materials/${encodeURIComponent(item.filename)}?download=true`}
                                    title="Download PDF"
                                    className="p-1 text-[var(--ink-tertiary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] rounded transition-colors"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                  <Link
                                    href={`/resources/${item.id}`}
                                    className="flex items-center gap-1 font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                                  >
                                    <span>Read PDF</span>
                                    <ArrowRight className="w-3 h-3 group-hover/sub:translate-x-0.5 transition-transform" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // Standard Single PDF Card
          return (
            <div 
              key={resource.id}
              className="group bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md hover:shadow-[var(--accent)]/5 rounded-2xl p-5 flex flex-col gap-4 transition-all relative"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft-border)] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    PDF · {resource.category}
                  </span>

                  {isDone && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>

                <BookmarkButton 
                  resourceId={resource.id} 
                  isBookmarked={bookmarkedIds.includes(resource.id)}
                  onToggle={onToggleBookmark}
                />
              </div>

              <div>
                <Link href={`/resources/${resource.id}`}>
                  <h3 className="text-[17px] font-semibold text-[var(--ink)] leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors cursor-pointer">
                    {resource.title}
                  </h3>
                </Link>
                <p className="text-[14px] text-[var(--ink-secondary)] leading-relaxed line-clamp-2">
                  {resource.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {resource.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 bg-[var(--surface-subdued)] text-[var(--ink-secondary)] rounded-md border border-transparent group-hover:border-[var(--border)]/60 transition-colors">
                    {tag}
                  </span>
                ))}
                {resource.tags.length > 3 && (
                  <span className="text-[11px] px-2 py-0.5 text-[var(--ink-tertiary)] font-mono">
                    +{resource.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3 text-[12px] text-[var(--ink-tertiary)] font-medium">
                  {resource.readTimeEstimate && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {resource.readTimeEstimate}
                    </span>
                  )}
                  {resource.pageCount && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
                      <span>{resource.pageCount} Pages</span>
                    </>
                  )}
                  <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
                  <span className={clsx(
                    resource.difficulty === "Advanced" ? "text-purple-600" :
                    resource.difficulty === "Intermediate" ? "text-orange-600" :
                    "text-emerald-600"
                  )}>
                    {resource.difficulty}
                  </span>
                </div>
                
                <Link
                  href={`/resources/${resource.id}`}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors group/link"
                >
                  Read PDF
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
