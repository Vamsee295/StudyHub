// Extra multiple-choice questions per lesson, used by mock tests and the review queue
// on top of each lesson's own quickCheck. Keyed by course slug, then lesson slug.
import { dbmsQuestions } from "./dbms";
import { osQuestions } from "./os";
import { cnQuestions } from "./computer-networks";
import { dsaQuestions } from "./dsa";
import { sqlQuestions } from "./sql";
import { oopQuestions } from "./oop";
import { pfQuestions } from "./programming-fundamentals";
import { systemDesignQuestions } from "./system-design";
import { quantQuestions, logicalQuestions, verbalQuestions, diQuestions, placementAptitudeQuestions } from "./aptitude";

/** q: question, o: four options, a: index of the correct option, e: explanation */
export interface ExtraQuestion { q: string; o: string[]; a: number; e: string }
export type LessonQuestions = Record<string, ExtraQuestion[]>;

export const EXTRA_QUESTIONS: Record<string, LessonQuestions> = {
  dbms: dbmsQuestions,
  os: osQuestions,
  "computer-networks": cnQuestions,
  dsa: dsaQuestions,
  sql: sqlQuestions,
  oop: oopQuestions,
  "programming-fundamentals": pfQuestions,
  "quantitative-aptitude": quantQuestions,
  "logical-reasoning": logicalQuestions,
  "verbal-ability": verbalQuestions,
  "data-interpretation": diQuestions,
  "placement-aptitude": placementAptitudeQuestions,
  "system-design": systemDesignQuestions,
};
