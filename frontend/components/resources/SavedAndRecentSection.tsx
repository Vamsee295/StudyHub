import Link from "next/link";
import { ArrowRight, Trash2, History, BookmarkMinus, ExternalLink, Terminal, Database, Code2, Layers } from "lucide-react";
import { SavedResourceRecord, RecentlyViewedRecord } from "@/types";
import { clsx } from "clsx";

interface SavedAndRecentSectionProps {
  savedResources: SavedResourceRecord[];
  recentResources: RecentlyViewedRecord[];
  onRemoveSaved: (id: string) => void;
  onClearHistory: () => void;
}

export function SavedAndRecentSection({
  savedResources,
  recentResources,
  onRemoveSaved,
  onClearHistory
}: SavedAndRecentSectionProps) {
  
  const getIcon = (name: string, className = "w-4 h-4") => {
    switch (name) {
      case "terminal": return <Terminal className={className} />;
      case "database": return <Database className={className} />;
      case "code_blocks": return <Code2 className={className} />;
      case "architecture": return <Layers className={className} />;
      default: return <ExternalLink className={className} />;
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* SAVED RESOURCES TABLE */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-newsreader font-medium text-[var(--ink)]">Your Saved Resources</h2>
            <p className="text-[13px] text-[var(--ink-secondary)]">Materials you have bookmarked for quick access.</p>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          {savedResources.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <BookmarkMinus className="w-10 h-10 text-[var(--ink-tertiary)] mb-3 opacity-50" />
              <h3 className="text-[15px] font-semibold text-[var(--ink)] mb-1">No saved resources</h3>
              <p className="text-[13px] text-[var(--ink-secondary)] max-w-xs">
                Click the bookmark icon on any resource card to save it here for later.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[var(--surface-subdued)]/50 border-b border-[var(--border)]">
                    <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wider text-[var(--ink-secondary)] uppercase w-[50%]">Resource</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wider text-[var(--ink-secondary)] uppercase">Topic</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wider text-[var(--ink-secondary)] uppercase hidden sm:table-cell">Saved</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wider text-[var(--ink-secondary)] uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {savedResources.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--surface-subdued)]/30 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--surface-subdued)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-secondary)] shrink-0">
                            {getIcon(item.iconName)}
                          </div>
                          <div>
                            <Link href={item.href} className="text-[14px] font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors line-clamp-1 block">
                              {item.title}
                            </Link>
                            <span className="text-[12px] text-[var(--ink-tertiary)]">{item.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border border-[var(--border)]">
                          {item.topic}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-[13px] text-[var(--ink-secondary)]">
                        {item.savedAt}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={item.href}
                            className="p-1.5 text-[var(--ink-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded transition-colors"
                            title="Open"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => onRemoveSaved(item.id)}
                            className="p-1.5 text-[var(--ink-secondary)] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
            <h2 className="text-xl font-newsreader font-medium text-[var(--ink)]">Recently Viewed</h2>
            <p className="text-[13px] text-[var(--ink-secondary)]">Your learning audit trail.</p>
          </div>
          {recentResources.length > 0 && (
            <button 
              onClick={onClearHistory}
              className="text-[12px] font-medium text-[var(--ink-tertiary)] hover:text-[var(--ink)] flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {recentResources.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 text-center shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
              <History className="w-6 h-6 text-[var(--ink-tertiary)] mx-auto mb-2 opacity-50" />
              <p className="text-[13px] text-[var(--ink-secondary)]">No recent history.</p>
            </div>
          ) : (
            recentResources.map((item) => (
              <div 
                key={item.id}
                className="group flex flex-col gap-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider font-medium text-[var(--ink-tertiary)] uppercase">
                    {item.viewedAt}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border border-[var(--border)]">
                    {item.topic}
                  </span>
                </div>
                
                <h4 className="text-[14px] font-semibold text-[var(--ink)] leading-snug line-clamp-2">
                  {item.title}
                </h4>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-[var(--ink-secondary)] flex items-center gap-1">
                    <BookOpenIcon className="w-3 h-3" />
                    {item.type}
                  </span>
                  <Link 
                    href={item.href}
                    className="text-[12px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
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

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
