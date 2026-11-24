import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Progress } from "@/components/ui/Page";

export interface ContinueItem {
  id: string;
  title: string;
  category: string;
  page: number;
  pageCount?: number;
  /** furthest page reached / page count; null until the PDF has been opened and its length is known */
  percentage: number | null;
  href: string;
}

export function ContinueReadingSection({ items }: { items: ContinueItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="sec">
        <span className="eyebrow sec-n mb-1.5 block">Reading</span>
        <span className="display text-[28px] md:text-[34px]">Continue reading</span>
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="brut brut-hover no-press group flex h-full flex-col gap-4 rounded-2xl bg-card p-5">
            <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-mute">
              <FileText aria-hidden className="size-3.5" /> {item.category} · PDF
            </span>
            <span className="label-cond line-clamp-2 text-[19px] leading-snug group-hover:text-accent-ink">{item.title}</span>
            <span className="mt-auto flex flex-col gap-3">
              {item.percentage !== null ? (
                <Progress value={item.percentage} label={`Page ${item.page} of ${item.pageCount}`} />
              ) : (
                <span className="font-mono text-[12px] text-mute">Page {item.page}</span>
              )}
              <span className="flex items-center gap-1.5 text-[14px] font-semibold">
                Continue <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
