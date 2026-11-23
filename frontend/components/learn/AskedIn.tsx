import Link from "next/link";
import { Building2 } from "lucide-react";
import { ASKED_IN_CAVEAT, companiesForModule } from "@/lib/data/askedIn";

/** "Reported in interviews at" chips for a course module; renders nothing when no company covers it. */
export function AskedInChips({ course, module, compact = false }: { course: string; module?: string; compact?: boolean }) {
  const companies = companiesForModule(course, module);
  if (companies.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5" title={ASKED_IN_CAVEAT}>
      {!compact && (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mr-1">
          <Building2 aria-hidden="true" className="w-3.5 h-3.5" /> Reported in interviews at
        </span>
      )}
      {companies.map((c) => (
        <Link key={c.id} href={`/companies?company=${c.id}#asked-in`}
          className="px-2 py-0.5 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[11.5px] font-medium text-[var(--ink-secondary)] hover:border-[var(--accent)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          {c.name}
        </Link>
      ))}
    </div>
  );
}
