import type { LessonVisual, VisualMap } from "./types";
import { pfVisuals } from "./programming-fundamentals";
import { oopVisuals } from "./oop";
import { sqlVisuals } from "./sql";
import { dsaVisuals } from "./dsa";
import { dbmsVisuals } from "./dbms";
import { osVisuals } from "./os";
import { cnVisuals } from "./computer-networks";
import { sdVisuals } from "./system-design";
import { aptitudeVisuals } from "./aptitude";
import { pfMoreVisuals } from "./programming-fundamentals-more";
import { oopMoreVisuals } from "./oop-more";
import { sqlMoreVisuals } from "./sql-more";
import { dsaMoreVisuals } from "./dsa-more";
import { dbmsMoreVisuals } from "./dbms-more";
import { osCnMoreVisuals } from "./os-cn-more";
import { aptitudeMoreVisuals } from "./aptitude-more";

const ALL: VisualMap = {
  ...pfVisuals,
  ...oopVisuals,
  ...sqlVisuals,
  ...dsaVisuals,
  ...dbmsVisuals,
  ...osVisuals,
  ...cnVisuals,
  ...sdVisuals,
  ...aptitudeVisuals,
  ...pfMoreVisuals,
  ...oopMoreVisuals,
  ...sqlMoreVisuals,
  ...dsaMoreVisuals,
  ...dbmsMoreVisuals,
  ...osCnMoreVisuals,
  ...aptitudeMoreVisuals,
};

/** The "Picture it" block for a lesson, if it has one. */
export function visualFor(course: string, lesson: string): LessonVisual | undefined {
  return ALL[`${course}/${lesson}`];
}

export const allVisuals = () => ALL;
