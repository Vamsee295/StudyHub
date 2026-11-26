/**
 * "Picture it" for a lesson: the idea in plain words (an everyday analogy for someone starting from zero)
 * plus a picture of it, shown above the lesson's theory.
 *
 * `diagram` is Mermaid text (https://mermaid.js.org) drawn in the site's colours. `image` is for pictures
 * Mermaid can't draw; use openly licensed files only and fill in the credit.
 */
export interface LessonVisual {
  plain: string; // 2–4 sentences, no jargon a beginner hasn't met yet
  diagram?: string;
  image?: { src: string; alt: string; credit: string; href: string };
  caption: string;
}

/** Keyed by "<course-slug>/<lesson-slug>". */
export type VisualMap = Record<string, LessonVisual>;
