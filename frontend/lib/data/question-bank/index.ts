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
import { questionsOf } from "../courses/apt-extra-types";
import { pseudocodeLessons } from "../courses/aptitude-pseudocode";
import { moreQuant } from "../courses/apt-more-quant";
import { moreLogical } from "../courses/apt-more-logical";
import { moreVerbal } from "../courses/apt-more-verbal";
import { syllabusQuant } from "../courses/apt-syllabus-quant";
import { syllabusLogical } from "../courses/apt-syllabus-logical";
import { syllabusVerbal } from "../courses/apt-syllabus-verbal";

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
  "quantitative-aptitude": { ...quantQuestions, ...questionsOf(moreQuant), ...questionsOf(syllabusQuant) },
  "logical-reasoning": { ...logicalQuestions, ...questionsOf(moreLogical), ...questionsOf(syllabusLogical) },
  "verbal-ability": { ...verbalQuestions, ...questionsOf(moreVerbal), ...questionsOf(syllabusVerbal) },
  pseudocode: questionsOf(pseudocodeLessons),
  "data-interpretation": diQuestions,
  "placement-aptitude": placementAptitudeQuestions,
  "system-design": systemDesignQuestions,
};
