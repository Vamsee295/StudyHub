import { PageHeader } from "@/components/ui/Page";

interface ResourcesHeaderProps {
  savedCount?: number;
  recentCount?: number;
  completedCount?: number;
}

/** Counts come from this browser's reading history (lib/resourceStorage). */
export function ResourcesHeader({ savedCount = 0, recentCount = 0, completedCount = 0 }: ResourcesHeaderProps) {
  const stats = [
    { n: savedCount, label: "Saved" },
    { n: recentCount, label: "Recent" },
    { n: completedCount, label: "Finished" },
  ];
  return (
    <PageHeader eyebrow="Resources" title="The" hl="library" note="notes, handbooks and cheat sheets">
      <dl className="flex gap-6 text-right max-md:text-left">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="display text-[40px] leading-none tabular-nums">{s.n}</dd>
            <dt className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mute">{s.label}</dt>
          </div>
        ))}
      </dl>
    </PageHeader>
  );
}
