import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/** Editorial page header (Mimo): mono eyebrow, big Anton title with an optional rust word block, handwritten note. */
export function PageHeader({
  title,
  hl,
  eyebrow,
  note,
  children,
}: {
  title: string;
  hl?: string;
  eyebrow?: string;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 flex-1">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="display text-[44px] md:text-[72px]">
          {title}
          {hl && (
            <>
              {" "}
              <span className="hl">{hl}</span>
            </>
          )}
        </h1>
        {note && <p className="note mt-2 -rotate-1">{note}</p>}
      </div>
      {children && <div className="flex items-center gap-3 max-md:w-full">{children}</div>}
    </header>
  );
}

/** Numbered section: "01 / KICKER" (auto-counted by CSS), Anton title, optional link and note. */
export function Section({
  title,
  kicker,
  href,
  note,
  children,
  className,
}: {
  title: string;
  kicker?: string;
  href?: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  const heading = (
    <>
      <span className="eyebrow sec-n mb-1.5 block">{kicker}</span>
      <span className="display text-[28px] md:text-[34px]">{title}</span>
    </>
  );
  return (
    <section className={clsx("sec mb-12", className)}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2>
          {href ? (
            <Link href={href} className="group inline-block">
              {heading}
              <ArrowRight className="-mt-1 ml-1 inline size-6 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            heading
          )}
        </h2>
        {note && <p className="note hidden -rotate-2 text-right md:block">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/** Horizontal snap-scroll row that bleeds to the screen edge; padding leaves room for hard shadows. */
export function Shelf({ children }: { children: ReactNode }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-5 overflow-x-auto px-4 pb-4 pt-1 md:-mx-8 md:scroll-px-8 md:px-8">
      {children}
    </div>
  );
}

/** 6px progress track: rust while going, teal at 100%. */
export function Progress({ value, label, className }: { value: number; label?: string; className?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-mute">
          <span>{label}</span>
          <span className="text-ink">{v}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-1.5 overflow-hidden rounded-full bg-ink/10"
      >
        <div className={clsx("h-full rounded-full", v === 100 ? "bg-note" : "bg-accent")} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

/** Outlined object card. `href` makes it a link; links and `interactive` cards lift on hover and press on click. */
export function Card({
  href,
  interactive,
  className,
  children,
}: {
  href?: string;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cls = clsx("brut block rounded-2xl bg-card p-5", (href || interactive) && "brut-hover no-press", className);
  return href ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <div className={cls}>{children}</div>
  );
}
