import Link from "next/link";
import { Star, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { LibraryResource } from "@/types";
import { BookmarkButton } from "./BookmarkButton";
import { clsx } from "clsx";

interface CuratedResourcesSectionProps {
  resources: LibraryResource[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export function CuratedResourcesSection({ 
  resources, 
  bookmarkedIds, 
  onToggleBookmark 
}: CuratedResourcesSectionProps) {
  if (!resources || resources.length === 0) {
    return (
      <section className="flex flex-col gap-6 py-12 items-center justify-center text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface-subdued)]/30">
        <h3 className="text-[16px] font-medium text-[var(--ink)]">No resources found</h3>
        <p className="text-[13px] text-[var(--ink-secondary)]">Try adjusting your filters or search query.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 scroll-mt-24" id="curated-resources">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-newsreader font-medium text-[var(--ink)]">Curated for Placement Preparation</h2>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20">
            <ShieldCheck className="w-3 h-3" />
            Recruiter Calibrated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {resources.map((resource) => (
          <div 
            key={resource.id}
            className="group bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md hover:shadow-[var(--accent)]/5 rounded-2xl p-5 flex flex-col gap-4 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded text-[11px] font-medium bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border border-[var(--border)]">
                  {resource.category}
                </span>
                <span className="flex items-center gap-1 text-[12px] font-medium text-[var(--ink-tertiary)]">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[var(--ink-secondary)]">{resource.rating}</span>
                  <span>({resource.reviewsCount})</span>
                </span>
              </div>
              <BookmarkButton 
                resourceId={resource.id} 
                isBookmarked={bookmarkedIds.includes(resource.id)}
                onToggle={onToggleBookmark}
              />
            </div>

            <div>
              <h3 className="text-[17px] font-semibold text-[var(--ink)] leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors">
                {resource.title}
              </h3>
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
                <span className="text-[11px] px-2 py-0.5 text-[var(--ink-tertiary)]">+{resource.tags.length - 3}</span>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3 text-[12px] text-[var(--ink-tertiary)] font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {resource.readTime}
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
                <span className={clsx(
                  resource.difficulty === "Advanced" ? "text-purple-600" :
                  resource.difficulty === "Intermediate" ? "text-orange-600" :
                  resource.difficulty === "Core SDE" ? "text-[var(--accent)]" :
                  "text-emerald-600"
                )}>
                  {resource.difficulty}
                </span>
              </div>
              
              <Link
                href={`/resources/${resource.slug}`}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors group/link"
              >
                Open Resource
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
