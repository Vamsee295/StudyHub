// Merges all Aptitude long-form theory (five aptitude courses), keyed by lesson slug.
import { LessonTheory } from './utils';
import { aptQuantNumbersTheory } from './apt-theory-quant-numbers';
import { aptQuantTimeAlgebraTheory } from './apt-theory-quant-time-algebra';
import { aptQuantAdvancedTheory } from './apt-theory-quant-advanced';
import { aptLogicalTheory } from './apt-theory-logical';
import { aptReasoningVocabTheory } from './apt-theory-reasoning-vocab';
import { aptVerbalTheory } from './apt-theory-verbal';
import { aptDiPlacementTheory } from './apt-theory-di-placement';

export const aptitudeTheory: Record<string, LessonTheory> = {
  ...aptQuantNumbersTheory,
  ...aptQuantTimeAlgebraTheory,
  ...aptQuantAdvancedTheory,
  ...aptLogicalTheory,
  ...aptReasoningVocabTheory,
  ...aptVerbalTheory,
  ...aptDiPlacementTheory,
};
