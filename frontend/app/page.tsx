import { Landing, type LandingStats } from "@/components/landing/Landing";
import { ALL_COURSES } from "@/lib/data/courses";
import { questionBank } from "@/lib/learn/study";
import { problems } from "@/lib/problems/problemRegistry";
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
  return <Landing stats={stats} />;
}
