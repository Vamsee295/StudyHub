"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, CircleHelp, Compass, X } from "lucide-react";
import { Diagram } from "@/components/learn/Diagram";
import { pageGuideFor, type PageGuideEntry } from "@/lib/data/pageGuides";

const SEEN_KEY = "studyhub_page_guides_seen";

function seenPages(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function markSeen(pathname: string) {
  try {
    const seen = seenPages();
    if (!seen.includes(pathname)) localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, pathname]));
  } catch {}
}

// decided once per page load: pages can mount twice (loading state, Strict Mode), and the second mount
// must not see the first one's "seen" mark
const firstVisits = new Map<string, boolean>();
function isFirstVisit(pathname: string): boolean {
  if (!firstVisits.has(pathname)) {
    firstVisits.set(pathname, !seenPages().includes(pathname));
    markSeen(pathname);
  }
  return firstVisits.get(pathname)!;
}

function GuideBody({ guide }: { guide: PageGuideEntry }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-3xl text-[15px] leading-relaxed text-body">{guide.plain}</p>
      {guide.diagram && <Diagram code={guide.diagram} />}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div>
          <p className="eyebrow mb-1.5">Do it like this</p>
          <ol className="list-decimal space-y-1 pl-5 text-[14px] text-body marker:font-mono marker:text-mute">
            {guide.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
        <div>
          <p className="eyebrow mb-1.5">Related</p>
          <ul className="flex flex-col gap-1.5">
            {guide.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink hover:underline">
                  {r.label} <ArrowRight className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** "How this page works" under the page title: open on the first visit to a page, folded after that. */
export function PageGuide() {
  const pathname = usePathname();
  const guide = pageGuideFor(pathname);
  // client-only render (AppLayout), so storage is readable in the initializer
  const [firstVisit] = useState(() => guide !== null && isFirstVisit(pathname));
  if (!guide) return null;

  return (
    <details open={firstVisit} className="group mb-8 rounded-2xl border-[1.5px] border-hair bg-card">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <Compass aria-hidden className="size-[18px] text-accent" />
        <span className="label-cond text-[18px]">{guide.title}</span>
        <ChevronDown aria-hidden className="ml-auto size-4 text-mute transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t-[1.5px] border-hair px-5 pb-5 pt-4">
        <GuideBody guide={guide} />
      </div>
    </details>
  );
}

/** Full-screen workspaces have no room for a panel: a small floating button opens the same guide in a dialog. */
export function WorkspaceGuideButton() {
  const pathname = usePathname();
  const guide = pageGuideFor(pathname);
  const dialog = useRef<HTMLDialogElement>(null);
  // the diagram only mounts while open, so it measures the dialog's real width
  const [open, setOpen] = useState(false);
  if (!guide) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
        aria-label={guide.title}
        title={guide.title}
        className="fixed bottom-2 right-3 z-40 flex size-9 items-center justify-center rounded-full border-[1.5px] border-hair bg-card text-ink shadow-md hover:border-ink/40"
      >
        <CircleHelp className="size-5" />
      </button>
      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto w-[min(720px,calc(100vw-2rem))] rounded-2xl border-[1.5px] border-hair bg-card p-0 text-ink backdrop:bg-ink/40"
      >
        <div className="flex items-center gap-2 border-b-[1.5px] border-hair px-5 py-4">
          <Compass aria-hidden className="size-[18px] text-accent" />
          <h2 className="label-cond text-[18px]">{guide.title}</h2>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="ml-auto rounded-full p-1 text-mute hover:text-ink">
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[75dvh] overflow-y-auto px-5 pb-5 pt-4">
          {open && <GuideBody guide={guide} />}
        </div>
      </dialog>
    </>
  );
}
