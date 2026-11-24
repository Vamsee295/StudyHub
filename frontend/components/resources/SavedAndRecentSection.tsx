import Link from "next/link";
import { ArrowRight, Trash2, History, BookmarkMinus, FileText } from "lucide-react";
import { Resource } from "@/lib/resources";

interface SavedAndRecentSectionProps {
  savedResources: Resource[];
  recentResources: (Resource & { viewedAt: string; lastPage?: number })[];
  onRemoveSaved: (id: string) => void;
  onClearHistory: () => void;
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function SavedAndRecentSection({
  savedResources,
  recentResources,
  onRemoveSaved,
  onClearHistory
}: SavedAndRecentSectionProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* SAVED RESOURCES TABLE */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">Saved</span>
          <span className="display text-[28px] md:text-[34px]">Your saved resources</span>
        </h2>
            <p className="text-[13px] text-body">Materials you have bookmarked for quick access.</p>
          </div>
        </div>

        <div className="bg-card border border-hair rounded-2xl overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          {savedResources.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-6">
              <BookmarkMinus className="w-10 h-10 text-mute mb-3 opacity-50" />
              <h3 className="text-[15px] font-semibold text-ink mb-1">No saved resources</h3>
              <p className="text-[13px] text-body max-w-xs">
                Click the bookmark icon on any resource card to save it here for quick access.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-paper-2/50 border-b border-hair">
                    <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wider text-body uppercase w-[55%]">Resource</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wider text-body uppercase">Category</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wider text-body uppercase hidden sm:table-cell">Pages</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wider text-body uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hair">
                  {savedResources.map((item) => (
                    <tr key={item.id} className="hover:bg-paper-2/30 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent-soft border border-accent-line flex items-center justify-center text-accent-ink shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <Link href={`/resources/${item.id}`} className="text-[14px] font-semibold text-ink group-hover:text-accent-ink transition-colors line-clamp-1 block">
                              {item.title}
                            </Link>
                            <span className="text-[12px] text-mute">PDF Document · {item.difficulty}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-paper-2 text-body border border-hair">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-[13px] text-body font-mono">
                        {item.pageCount ? `${item.pageCount} p.` : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/resources/${item.id}`}
                            className="p-1.5 text-body hover:text-accent-ink hover:bg-accent-soft rounded transition-colors"
                            title="Read PDF"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => onRemoveSaved(item.id)}
                            className="p-1.5 text-body hover:text-danger hover:bg-danger-soft rounded transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* RECENTLY VIEWED */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="sec">
          <span className="eyebrow sec-n mb-1.5 block">History</span>
          <span className="display text-[28px] md:text-[34px]">Recently viewed</span>
        </h2>
            <p className="text-[13px] text-body">What you opened lately.</p>
          </div>
          {recentResources.length > 0 && (
            <button 
              onClick={onClearHistory}
              className="text-[12px] font-medium text-mute hover:text-ink flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {recentResources.length === 0 ? (
            <div className="bg-card border border-hair rounded-2xl p-6 text-center shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
              <History className="w-6 h-6 text-mute mx-auto mb-2 opacity-50" />
              <p className="text-[13px] text-body">No recent reading history.</p>
            </div>
          ) : (
            recentResources.map((item) => (
              <div 
                key={item.id}
                className="group flex flex-col gap-2 p-4 rounded-xl bg-card border border-hair hover:border-line transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider font-medium text-mute uppercase">
                    {formatRelativeTime(item.viewedAt)}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-paper-2 text-body border border-hair">
                    {item.category}
                  </span>
                </div>
                
                <h4 className="text-[14px] font-semibold text-ink leading-snug line-clamp-2">
                  {item.title}
                </h4>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-body flex items-center gap-1">
                    <FileText className="w-3 h-3 text-accent-ink" />
                    PDF Document
                  </span>
                  <Link 
                    href={`/resources/${item.id}`}
                    className="text-[12px] font-semibold text-accent-ink hover:text-accent-ink flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                  >
                    Resume <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

