import { Landing, type LandingStats } from "@/components/landing/Landing";
import { ALL_COURSES } from "@/lib/data/courses";
import { questionBank } from "@/lib/learn/study";
import { askedAt, problems } from "@/lib/problems/problemRegistry";
import type { TopAsked } from "@/components/landing/islands";
import type { PlanStage } from "@/components/landing/plan";
import { COMPANY_PROFILES } from "@/lib/data/askedIn";
import { roadmap } from "@/lib/data/roadmap";
import { LABS } from "@/lib/labs/catalog";
import { companies } from "@/lib/data/companies";

// Every number on the landing page is counted from the real content, here on the server,
// so the course data never ships to the browser just to count it.
export default function Home() {
  const stats: LandingStats = {
    courses: ALL_COURSES.length,
    lessons: ALL_COURSES.reduce((n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0),
    quiz: ALL_COURSES.reduce((n, c) => n + questionBank(c.slug).length, 0),
    problems: Object.keys(problems).length,
    labs: LABS.length,
    companies: companies.length,
    subjects: ALL_COURSES.map((c) => c.title),
  };
  // Per hero company: its most frequently reported problem in our set, and how many of ours it is reported to ask.
  // Company names match the report data by first word ("TCS Digital / Prime" -> "TCS").
  const topAsked: Record<string, TopAsked> = {};
  for (const c of companies) {
    const name = c.name.split(" ")[0];
    const hits: { id: string; f: number }[] = [];
    for (const p of Object.values(problems)) {
      const a = askedAt(p.id).find((x) => x.name === name);
      if (a) hits.push({ id: p.id, f: a.frequency });
    }
    if (!hits.length) continue;
    hits.sort((a, b) => b.f - a.f);
    topAsked[c.name] = {
      reported: hits.length,
      top: hits.slice(0, 3).map(({ id }) => ({ id, title: problems[id].title, difficulty: problems[id].difficulty })),
    };
  }
  // Planner: per company with a sourced syllabus (lib/data/askedIn.ts), the course modules it's reported
  // to test, in roadmap order, each sized by its lessons' own time estimates.
  const plans: Record<string, PlanStage[]> = {};
  for (const profile of COMPANY_PROFILES) {
    const units = roadmap.flatMap((s) =>
      s.courses.flatMap((slug) => {
        const course = ALL_COURSES.find((x) => x.slug === slug);
        const area = profile.areas.find((a) => a.course === slug);
        if (!course || !area) return [];
        return course.modules
          .filter((m) => m.lessons.length && (area.modules === "*" || area.modules.includes(m.slug)))
          .map((m) => ({
            id: `${slug}/${m.slug}`,
            title: m.title,
            stage: s.title,
            lessons: m.lessons.length,
            minutes: m.lessons.reduce((n, l) => n + (l.estimatedMinutes || 0), 0),
          }));
      })
    );
    if (units.length) plans[profile.name] = units;
  }
  return <Landing stats={stats} topAsked={topAsked} plans={plans} />;
}
