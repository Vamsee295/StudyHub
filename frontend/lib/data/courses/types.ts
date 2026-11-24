export type SectionType = 
  | 'text' 
  | 'code' 
  | 'list' 
  | 'table' 
  | 'warning' 
  | 'takeaways' 
  | 'quickCheck' 
  | 'think' 
  | 'tryIt' 
  | 'dryRun' 
  | 'interviewTraps' 
  | 'practice' 
  | 'prerequisites'
  | 'callout';

export interface CourseLessonContent {
  // Legacy fields (kept for backward compatibility during transition)
  definition?: string;
  whyItMatters?: string;
  coreConcept?: string;
  syntax?: string;
  javaExample?: string;
  howItWorks?: string;
  realWorldUse?: string;
  commonMistakes?: string[];
  interviewQuestions?: {
    question: string;
    answer: string;
  }[];
  quickRevision?: string;
  practicePrompt?: string;
  quickCheck?: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  
  // Long-form markdown explanation shown before the sections (see components/learn/TheoryNotes)
  theory?: string;
  // Attribution and further reading for this lesson
  sources?: Array<{ title: string; url: string; license?: string }>;

  // The new structured content sections
  sections?: Array<{
    type: SectionType;
    title?: string;
    // For text, warning, callout
    content?: string;
    // For code, tryIt
    code?: string;
    language?: string;
    explanation?: string;
    // For list, takeaways, warning (legacy)
    items?: string[];
    // For table
    headers?: string[];
    rows?: string[][];
    // For quickCheck
    question?: string;
    options?: string[];
    answer?: number | string; // index or string
    // For think
    answerReveal?: string;
    // For tryIt
    expectedOutput?: string;
    // For dryRun
    iterations?: Array<{
      step: number | string;
      variables: Record<string, string>;
      description: string;
    }>;
    // For interviewTraps
    traps?: Array<{
      question: string;
      trap: string;
      solution: string;
    }>;
    // For practice
    problems?: Array<{
      id: string;
      title: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
    }>;
    // For prerequisites
    links?: Array<{
      title: string;
      slug: string;
    }>;
    [key: string]: unknown;
  }>;
}

export interface CourseLesson {
  id: string;
  slug: string;
  legacySlug?: string;
  legacyId?: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  content: CourseLessonContent;
  relatedTools?: { title: string; url: string }[];
  relatedResources?: { title: string; url: string }[];
  relatedPracticeTrack?: string;
}


export interface CourseModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "Technical" | "Placement" | "Core CS" | "Aptitude";
  icon: string;
  displayOrder: number;
  modules: CourseModule[];
}

export interface CourseProgress {
  completedLessons: string[];
  totalLessons: number;
  percentage: number;
  lastAccessedLessonSlug?: string;
}

/** A lesson's one-line description: its definition, else the start of its first text section. */
export function describeLesson(content: CourseLessonContent | undefined): string {
  if (content?.definition) return content.definition;
  const sections = content?.sections ?? [];
  const textSec = sections.find((s) => s.type === 'text' && s.title !== 'Prerequisites') || sections[0];
  if (!textSec?.content) return '';
  const plain = textSec.content.replace(/[*_#`]/g, '').trim();
  return plain.slice(0, 160) + (plain.length > 160 ? '...' : '');
}
