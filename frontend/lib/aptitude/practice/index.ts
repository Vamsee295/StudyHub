// Practice sets for every aptitude lesson: generated (number-based topics) or from curated banks (word-based).
import { bankSet, buildSet, type PracticeQ } from "./core";
import { quantGenerators } from "./quant";
import { reasoningGenerators } from "./reasoning";
import { verbalBanks } from "./verbal";
import { pseudocodeGenerators } from "./pseudocode";
import { diGenerators } from "./di";
import { CS_BANKS, csBank } from "./cs";

export type { PracticeQ } from "./core";

export const PRACTICE_COURSES = ["quantitative-aptitude", "logical-reasoning", "verbal-ability", "pseudocode", "data-interpretation", "dbms", "os", "computer-networks", "oop", "sql"] as const;

const cache = new Map<string, PracticeQ[]>();

/** Up to 30 questions for a lesson, Easy → Hard, the same every time. Empty when the lesson has none. */
export function practiceFor(course: string, lesson: string): PracticeQ[] {
  const key = `${course}/${lesson}`;
  if (cache.has(key)) return cache.get(key)!;
  let set: PracticeQ[] = [];
  if (course === "quantitative-aptitude" && quantGenerators[lesson]) set = buildSet(key, quantGenerators[lesson]);
  else if (course === "logical-reasoning" && reasoningGenerators[lesson]) set = buildSet(key, reasoningGenerators[lesson]);
  else if (course === "logical-reasoning" && verbalBanks[lesson]) set = bankSet(key, verbalBanks[lesson]);
  else if (course === "verbal-ability" && verbalBanks[lesson]) set = bankSet(key, verbalBanks[lesson]);
  else if (course === "pseudocode" && pseudocodeGenerators[lesson]) set = buildSet(key, pseudocodeGenerators[lesson]);
  else if (course === "data-interpretation" && diGenerators[lesson]) set = buildSet(key, diGenerators[lesson]);
  else if (CS_BANKS[course]?.[lesson]) set = bankSet(key, csBank(CS_BANKS[course][lesson]));
  cache.set(key, set);
  return set;
}
