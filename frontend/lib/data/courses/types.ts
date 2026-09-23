export interface CourseLessonContent {
  definition: string;
  whyItMatters: string;
  coreConcept: string;
  syntax?: string;
  codeExample?: string;
  executionExplanation?: string;
  realWorldUse: string;
  commonMistakes: string;
  interviewQuestions: {
    question: string;
    answer: string;
  }[];
  quickRevision: string;
  practicePrompt: string;
}

export interface CourseLesson {
  id: string;
  slug: string;
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
