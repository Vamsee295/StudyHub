import { templateLibrary } from "@/lib/data/templatesData";
import { PageHeader } from "@/components/ui/Page";

export function TemplatesHeader() {
  return (
    <PageHeader eyebrow="Templates" title="Don't start" hl="blank" note="resumes, cover letters, STAR stories, outreach">
      <div className="text-right max-md:text-left">
        <p className="display text-[44px] leading-none tabular-nums">{templateLibrary.length}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mute">Templates</p>
      </div>
    </PageHeader>
  );
}
