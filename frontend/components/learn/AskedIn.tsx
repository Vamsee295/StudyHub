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
        <span className="mr-1 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-mute">
          <Building2 aria-hidden="true" className="w-3.5 h-3.5" /> Reported in interviews at
        </span>
      )}
      {companies.map((c) => (
        <Link key={c.id} href={`/companies?company=${c.id}#asked-in`}
          className="rounded-full border-[1.5px] border-hair px-2.5 py-0.5 text-[12px] font-medium text-body hover:border-line hover:text-ink">
          {c.name}
        </Link>
      ))}
    </div>
  );
}
