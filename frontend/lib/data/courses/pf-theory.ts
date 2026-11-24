// Merges all Programming Fundamentals long-form theory, keyed by lesson slug.
import { LessonTheory } from './utils';
import { pfBasicsTheory } from './pf-theory-basics';
import { pfOperatorsIoTheory } from './pf-theory-operators-io';
import { pfControlTheory } from './pf-theory-control';
import { pfLoopsTheory } from './pf-theory-loops';
import { pfArraysTheory } from './pf-theory-arrays';
import { pfStringsTheory } from './pf-theory-strings';
import { pfMethodsTheory } from './pf-theory-methods';
import { pfMemoryRecursionTheory } from './pf-theory-memory-recursion';

export const pfTheory: Record<string, LessonTheory> = {
  ...pfBasicsTheory,
  ...pfOperatorsIoTheory,
  ...pfControlTheory,
  ...pfLoopsTheory,
  ...pfArraysTheory,
  ...pfStringsTheory,
  ...pfMethodsTheory,
  ...pfMemoryRecursionTheory,
};
