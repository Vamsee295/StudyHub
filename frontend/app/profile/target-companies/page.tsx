"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Plus, Search, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { ProfileNavTabs } from "@/components/profile/ProfileNavTabs";
import { useProfile } from "@/components/providers/ProfileProvider";
import { CompanyLogo } from "@/components/companies/CompanyLogo";
import { COMPANIES, SEGMENTS, companyByName } from "@/lib/data/companyData";
import { markChanged } from "@/lib/sync/userSync";

const LEGACY_KEY = "pathward_tracked_companies_list"; // older builds kept the list here as objects with a name

export default function TargetCompaniesPage() {
  const { draftProfile, updateDraft, saveProfile } = useProfile();
  // Company names, as stored in the profile. Client-only render (AppLayout), so localStorage is readable here.
  const [names, setNames] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? "null");
      if (Array.isArray(saved)) return saved.map((x: string | { name: string }) => (typeof x === "string" ? x : x.name));
    } catch {}
    return draftProfile.targets?.companies ?? [];
  });
  const [filter, setFilter] = useState("");
  const [adding, setAdding] = useState(false);
  const [pick, setPick] = useState("");

  const save = (next: string[]) => {
    setNames(next);
    localStorage.setItem(LEGACY_KEY, JSON.stringify(next));
    markChanged(LEGACY_KEY);
    updateDraft({ targets: { ...draftProfile.targets, companies: next } });
    saveProfile().catch(console.error);
  };

  const tracked = names.map((name) => ({ name, entry: companyByName(name) }));
  const trackedIds = new Set(tracked.map((t) => t.entry?.id).filter(Boolean));
  const shown = tracked.filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()));
  const q = pick.trim().toLowerCase();
  const choices = COMPANIES.filter((c) => !trackedIds.has(c.id) && (!q || c.name.toLowerCase().includes(q)));

  return (
    <div className="w-full min-w-0">
      <ProfileNavTabs />

      <PageHeader eyebrow="Profile" title="Target" hl="companies">
        <button onClick={() => setAdding(true)} className={buttonClass("primary", "sm")}>
          <Plus className="size-4" /> Add company
        </button>
        <Link href="/companies" className={buttonClass("secondary", "sm")}>
          <Building2 className="size-4" /> Directory
        </Link>
      </PageHeader>

      {names.length > 0 && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <label className="relative max-w-md flex-1">
            <span className="sr-only">Search your companies</span>
            <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
            <input type="text" placeholder="Search your companies" value={filter} onChange={(e) => setFilter(e.target.value)} className="field w-full pl-9" />
          </label>
          <span className="font-mono text-xs text-body">
            {shown.length} of {names.length}
          </span>
        </div>
      )}

      {names.length === 0 ? (
        <div className="rounded-2xl border-[1.5px] border-hair bg-card p-12 text-center">
          <Building2 className="mx-auto mb-3 size-12 text-ink/30" />
          <h3 className="text-base font-bold text-ink">No companies yet</h3>
          <p className="mx-auto mb-4 mt-1 max-w-sm text-[13px] text-body">
            Pick the companies you&apos;re aiming for. Their questions, rounds and openings then show up first on Companies and your dashboard.
          </p>
          <button onClick={() => setAdding(true)} className={buttonClass("primary", "sm")}>
            <Plus className="size-4" /> Add your first company
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {shown.map(({ name, entry }) => (
            <li key={name} className="flex flex-col gap-4 rounded-2xl border-[1.5px] border-hair bg-card p-5">
              <div className="flex items-start gap-3">
                <CompanyLogo company={entry ?? { name, facts: {} }} size={44} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-ink">{entry?.name ?? name}</h3>
                  <p className="text-[13px] text-body">{entry ? [entry.segment, entry.facts.hq].filter(Boolean).join(" · ") : "Not in our directory yet"}</p>
                </div>
                <button
                  onClick={() => save(names.filter((n) => n !== name))}
                  aria-label={`Stop tracking ${name}`}
                  title="Remove"
                  className="rounded-lg p-1.5 text-mute transition-colors hover:bg-danger-soft hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              {entry ? (
                <>
                  <dl className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border-[1.5px] border-hair bg-paper p-2.5">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-mute">Questions reported</dt>
                      <dd className="font-mono text-[15px] font-semibold">{entry.counts.total.toLocaleString()}</dd>
                    </div>
                    <div className="rounded-lg border-[1.5px] border-hair bg-paper p-2.5">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-mute">Last 3 months</dt>
                      <dd className="font-mono text-[15px] font-semibold">{entry.counts.d90}</dd>
                    </div>
                  </dl>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.topTopics.slice(0, 4).map((t) => (
                      <span key={t} className="rounded-md border-[1.5px] border-hair bg-paper-2 px-2 py-0.5 text-[12px] text-body">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/companies?company=${entry.id}`}
                    className="mt-auto inline-flex items-center gap-1.5 self-end font-mono text-[12px] uppercase tracking-wider text-accent-ink hover:underline"
                  >
                    Questions and rounds <ArrowRight className="size-3.5" />
                  </Link>
                </>
              ) : (
                <p className="text-[13px] text-mute">We don&apos;t have interview data for this company yet. It still counts as one of your targets.</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setAdding(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="add-company" className="flex max-h-[85dvh] w-full max-w-lg flex-col rounded-2xl border-[1.5px] border-hair bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b-[1.5px] border-hair px-5 py-4">
              <h3 id="add-company" className="text-base font-bold text-ink">
                Add a company
              </h3>
              <button onClick={() => setAdding(false)} aria-label="Close" className="ml-auto rounded-full p-1 text-mute hover:text-ink">
                <X className="size-4" />
              </button>
            </div>
            <div className="px-5 pt-4">
              <label className="relative block">
                <span className="sr-only">Search companies</span>
                <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
                <input autoFocus type="text" placeholder={`Search ${COMPANIES.length} companies`} value={pick} onChange={(e) => setPick(e.target.value)} className="field w-full pl-9" />
              </label>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-5 pt-3">
              {choices.length === 0 && <p className="py-6 text-center text-[13px] text-mute">No company matches &ldquo;{pick}&rdquo;.</p>}
              {SEGMENTS.map((seg) => {
                const group = choices.filter((c) => c.segment === seg);
                if (!group.length) return null;
                return (
                  <div key={seg} className="mt-3 first:mt-0">
                    <p className="eyebrow mb-1.5">{seg}</p>
                    <ul className="flex flex-col gap-1.5">
                      {group.map((c) => (
                        <li key={c.id}>
                          <button
                            onClick={() => {
                              save([...names, c.name]);
                              setPick("");
                              setAdding(false);
                            }}
                            className="group flex w-full items-center gap-3 rounded-xl border-[1.5px] border-hair p-2.5 text-left transition-colors hover:border-accent"
                          >
                            <CompanyLogo company={c} size={32} />
                            <span className="min-w-0 flex-1">
                              <span className="block text-[14px] font-semibold text-ink group-hover:text-accent-ink">{c.name}</span>
                              <span className="block text-[12px] text-mute">{c.counts.total.toLocaleString()} questions reported</span>
                            </span>
                            <Plus className="size-4 text-mute group-hover:text-accent-ink" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
