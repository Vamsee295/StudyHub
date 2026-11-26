import Link from "next/link";
import { Building2 } from "lucide-react";
import { ASKED_IN_CAVEAT, companiesForModule } from "@/lib/data/askedIn";
import { companiesAsking, moduleTopics } from "@/lib/learn/interviewDemand";

const SHOW = 6;
const chip = "rounded-full border-[1.5px] border-hair px-2.5 py-0.5 text-[12px] font-medium text-body hover:border-line hover:text-ink";
const label = "mr-1 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-mute";

/**
 * Which companies ask about a course module. Coding topics (DSA, SQL…) use real reported questions;
 * other subjects (OS, networks, aptitude) fall back to the researched company profiles.
 */
export function AskedInChips({ course, module, compact = false }: { course: string; module?: string; compact?: boolean }) {
  const real = companiesAsking(moduleTopics(course, module));
  if (real.length) {
    return (
      <div className="flex flex-wrap items-center gap-1.5" title="Companies where these topics make up the biggest share of reported interview questions">
        {!compact && (
          <span className={label}>
            <Building2 aria-hidden="true" className="size-3.5" /> Asked most often at
          </span>
        )}
        {real.slice(0, SHOW).map(({ company, share }) => (
          <Link key={company.id} href={`/companies?company=${company.id}`} title={`${Math.round(share * 100)}% of their reported questions`} className={chip}>
            {company.name}
          </Link>
        ))}
        {real.length > SHOW && <span className="text-[12px] text-mute">+{real.length - SHOW} more</span>}
      </div>
    );
  }

  const companies = companiesForModule(course, module);
  if (companies.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5" title={ASKED_IN_CAVEAT}>
      {!compact && (
        <span className={label}>
          <Building2 aria-hidden="true" className="size-3.5" /> Reported in interviews at
        </span>
      )}
      {companies.map((c) => (
        <Link key={c.id} href={`/companies?company=${c.id}#asked-in`} className={chip}>
          {c.name}
        </Link>
      ))}
    </div>
  );
}
