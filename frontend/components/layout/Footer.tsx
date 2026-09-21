import { StudyHubLogo } from "@/components/ui/StudyHubLogo";

const columns = [
  {
    title: "Platform",
    links: ["Learn", "Roadmaps", "Practice", "Companies"],
  },
  {
    title: "Career",
    links: ["Internships", "Placements", "Projects", "Open source"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Guides", "Interview questions", "Templates"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Contribute", "Privacy"],
  },
];

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="container-max px-5 md:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-8 text-[13.5px]">
        <div className="lg:col-span-1">
          <div className="mb-3">
            <StudyHubLogo href="#" size="sm" showBadge={false} />
          </div>
          <p className="text-ink-secondary leading-relaxed">
            A unified placement preparation and skill-building platform for engineering students.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-medium mb-3">{col.title}</p>
            <div className="flex flex-col gap-2 text-ink-secondary">
              {col.links.map((l) => (
                <a key={l} href="#" className="hover:text-ink transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-max px-5 md:px-8 py-5 text-[12.5px] text-ink-secondary flex items-center justify-between flex-wrap gap-2">
          <span>© 2026 StudyHub. All rights reserved.</span>
          <span>Sample data shown for demonstration.</span>
        </div>
      </div>
    </footer>
  );
}
