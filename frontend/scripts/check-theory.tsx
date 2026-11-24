// Validates lesson theory for a course: renders it with TheoryNotes and flags short notes,
// banned words, em dashes and broken markdown. Usage: npx tsx scripts/check-theory.tsx <course-slug>
import { renderToStaticMarkup } from 'react-dom/server';
import { getCourseBySlug } from '../lib/data/courses/index';
import { TheoryNotes, LessonSources } from '../components/learn/TheoryNotes';
const course = getCourseBySlug(process.argv[2])!;
let withT = 0, total = 0, problems = 0;
for (const m of course.modules) for (const l of m.lessons) {
  total++;
  const t = l.content.theory;
  if (!t) continue;
  withT++;
  const words = t.split(/\s+/).filter(Boolean).length;
  const html = renderToStaticMarkup(<><TheoryNotes markdown={t} />{l.content.sources && <LessonSources sources={l.content.sources} />}</>);
  const issues: string[] = [];
  if (words < 700) issues.push(`only ${words} words`);
  if (/—/.test(t)) issues.push('em dash');
  // "simple attribute" (ER), "simple interest" (finance) and "present simple" (grammar) are technical terms, not filler
  const banned = t.replace(/\*{0,2}\bsimple\*{0,2} (and composite )?attributes?\b|\| Simple \||\bsimple interest\b|\b(present|past|future) simple\b|\bsimple, continuous\b/gi, '');
  if (/\b(easy|simple|simply|just|very|really)\b/i.test(banned)) issues.push('banned word: ' + banned.match(/\b(easy|simple|simply|just|very|really)\b/i)![0]);
  if (/\$\{/.test(t)) issues.push('template interpolation');
  if (/```|~~~/.test(html)) issues.push('unclosed fence');
  if (/\*\*/.test(html.replace(/<pre[\s\S]*?<\/pre>/g, ''))) issues.push('raw ** in output');
  const fences = (t.match(/^~~~/gm) || []).length;
  if (fences % 2) issues.push('odd fence count');
  console.log(`${l.slug.padEnd(38)} ${String(words).padStart(5)} words  ${html.length} html chars ${issues.length ? '  <-- ' + issues.join(', ') : ''}`);
  if (issues.length) problems++;
}
console.log({ lessons: total, withTheory: withT, problems });
