"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2, MapPin } from "lucide-react";
import { boardUrl, fetchOpenRoles, isTechRole, type CompanyEntry, type OpenRole } from "@/lib/data/companyData";

const SHOW = 6;

/** Openings read live from the company's public job board (Greenhouse or Lever). */
export function OpenRoles({ company }: { company: CompanyEntry & { jobs: NonNullable<CompanyEntry["jobs"]> } }) {
  const [state, setState] = useState<{ id: string; roles: OpenRole[] | null }>({ id: "", roles: null });
  const [techOnly, setTechOnly] = useState(true);

  useEffect(() => {
    let live = true;
    fetchOpenRoles(company.jobs)
      .then((roles) => live && setState({ id: company.id, roles }))
      .catch(() => live && setState({ id: company.id, roles: null }));
    return () => {
      live = false;
    };
  }, [company.id, company.jobs]);

  const ready = state.id === company.id;
  const all = state.roles ?? [];
  const tech = all.filter(isTechRole);
  const list = techOnly ? tech : all;

  return (
    <section aria-labelledby="open-roles" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 id="open-roles" className="label-cond flex items-center gap-2 text-[20px]">
            Open right now
            <span className="rounded-full bg-note/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-note">Live</span>
          </h3>
          <p className="text-[13px] text-body">Straight from {company.name}&apos;s public job board, as of this moment.</p>
        </div>
        {ready && state.roles && (
          <label className="flex items-center gap-2 text-[13px] text-body">
            <input type="checkbox" checked={techOnly} onChange={(e) => setTechOnly(e.target.checked)} className="size-4 accent-[var(--accent)]" />
            Tech roles only ({tech.length} of {all.length})
          </label>
        )}
      </div>

      {!ready ? (
        <p className="flex items-center gap-2 text-[14px] text-mute">
          <Loader2 aria-hidden className="size-4 animate-spin" /> Checking openings…
        </p>
      ) : !state.roles ? (
        <p className="text-[14px] text-body">
          Couldn&apos;t reach the job board.{" "}
          <a href={boardUrl(company.jobs)} target="_blank" rel="noopener noreferrer" className="text-accent-ink underline">
            Open it directly
          </a>
          .
        </p>
      ) : list.length === 0 ? (
        <p className="text-[14px] text-body">No {techOnly ? "tech " : ""}openings listed right now.</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {list.slice(0, SHOW).map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col gap-1 rounded-xl border-[1.5px] border-hair bg-paper p-3 hover:border-ink/40">
                <span className="flex items-start justify-between gap-2 text-[14px] font-semibold leading-snug group-hover:text-accent-ink">
                  {r.title}
                  <ExternalLink aria-hidden className="mt-0.5 size-3.5 shrink-0 text-mute" />
                </span>
                <span className="flex flex-wrap items-center gap-x-2 text-[12.5px] text-mute">
                  {r.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin aria-hidden className="size-3" /> {r.location}
                    </span>
                  )}
                  {r.team && <span>{r.team}</span>}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {ready && state.roles && list.length > SHOW && (
        <a href={boardUrl(company.jobs)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 self-start text-[13.5px] font-semibold text-accent-ink hover:underline">
          See all {list.length} openings <ExternalLink aria-hidden className="size-3.5" />
        </a>
      )}
    </section>
  );
}
