import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, FileText, CheckCircle2 } from "lucide-react";
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

