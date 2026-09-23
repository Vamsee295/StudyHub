import { Course } from './types';
import { createAptitudeLesson } from './aptitude-factory';

export const aptitudePlacementCourse: Course = {
  id: "course-placement-aptitude",
  slug: "placement-aptitude",
  title: "Placement Aptitude",
  description: "Company-specific patterns, time management strategies, and test-taking techniques.",
  category: "Aptitude",
  icon: "Briefcase",
  displayOrder: 12,
  modules: [
    {
      id: "placement-mod-1",
      slug: "company-specific",
      title: "Company Specific Patterns",
      description: "Understanding how different companies structure their tests.",
      difficulty: "Advanced",
      estimatedMinutes: 60,
      lessons: [
        createAptitudeLesson(
          "tcs-ninja-patterns",
          "TCS Ninja Patterns",
          "TCS specific quantitative and reasoning focus.",
          "TCS Ninja focuses heavily on advanced quantitative aptitude (Time & Work, Profit & Loss) and data interpretation.",
          "Knowing the pattern allows you to allocate study time to the highest-weightage topics.",
          "Focus on LCM/HCF, Time & Work, Speed & Distance, and Basic DI. Use the on-screen calculator efficiently.",
          "TCS questions are often wordy. Read the last sentence first to know what to solve for.",
          "If a TCS question gives a 5-line story about two workers, jump to the end: 'Find the time taken by A alone.'",
          "Do not get stuck on 'Advanced Quant' questions; they carry the same marks as easy ones.",
          ["Spending 5 minutes on a difficult permutation question while missing 3 easy arithmetic questions."],
          "TCS Ninja does not usually have negative marking, so never leave a question blank.",
          {
            question: "Which of these topics is historically a high-weightage area in TCS Ninja?",
            options: ["Geometry", "Time and Work", "Vocabulary", "Syllogisms"],
            answer: 1,
            explanation: "TCS heavily favors core arithmetic like Time and Work."
          }
        ),
        createAptitudeLesson(
          "infosys-logical",
          "Infosys Logical",
          "Infosys specific reasoning focus.",
          "Infosys is known for having a very challenging logical reasoning section.",
          "You must be fast at syllogisms, data sufficiency, and puzzles.",
          "Practice Data Sufficiency and Syllogisms extensively. You must solve them in < 45 seconds.",
          "For Infosys, draw Venn diagrams immediately when reading the question.",
          "If you see a puzzle with 5 questions attached, invest 3-4 minutes solving the puzzle grid first.",
          "Infosys often has sectional cutoffs. Do not ignore the verbal section.",
          ["Guessing blindly on Data Sufficiency."],
          "Data sufficiency in Infosys is a trap to make you solve the whole problem. Just check if it's solvable.",
          {
            question: "What is the best approach for a 5-question puzzle block in Infosys?",
            options: ["Skip it", "Solve questions individually", "Map the entire puzzle first", "Guess"],
            answer: 2,
            explanation: "Mapping the puzzle first allows you to answer all 5 questions instantly."
          }
        )
      ]
    },
    {
      id: "placement-mod-2",
      slug: "test-strategies",
      title: "Test Strategies",
      description: "Time management and elimination.",
      difficulty: "Intermediate",
      estimatedMinutes: 45,
      lessons: [
        createAptitudeLesson(
          "elimination-techniques",
          "Elimination Techniques",
          "Removing wrong options.",
          "Using logic, units, or estimation to eliminate 2-3 wrong options without fully solving the problem.",
          "Saves critical minutes during a timed exam.",
          "Check the unit digit of the calculation. Check if the answer should be positive/negative or integer/fraction.",
          "If 123 * 456 is asked, the unit digit must be 3*6 = 18 -> ends in 8. Eliminate options not ending in 8.",
          "Q: Area of a circle with radius 7? Options: 153, 154, 155. Pi = 22/7. Area must be a multiple of 11. Only 154 is.",
          "Always check divisibility rules (especially 3, 9, 11) against the options.",
          ["Solving the entire calculation before looking at the options."],
          "The options are part of the question. Use them to your advantage.",
          {
            question: "What is 453 * 217?",
            options: ["98301", "98303", "98305", "98307"],
            answer: 0,
            explanation: "Unit digit is 3 * 7 = 21 -> ends in 1. Only 98301 ends in 1."
          }
        ),
        createAptitudeLesson(
          "skimming-questions",
          "Skimming Questions",
          "Finding the easy wins.",
          "Quickly scanning a test to solve the easiest 40% of questions first.",
          "Maximizes your score and builds confidence.",
          "Categorize questions visually into: Do Now (1 min), Do Later (2 mins), Skip (Too long).",
          "Skip long reading comprehension passages or massive puzzles on your first pass.",
          "See a 6-line Time & Work problem? Skip it for round 2. See a basic Number Series? Do it now.",
          "Your goal is to see every single question before the time runs out.",
          ["Ego-solving: refusing to skip a question because you 'should' know how to do it."],
          "A hard question gives the exact same marks as an easy question.",
          {
            question: "What should you do if you encounter a very long puzzle on question 1?",
            options: ["Solve it", "Mark for review and skip", "Guess", "Panic"],
            answer: 1,
            explanation: "Always secure easy marks first before tackling time-sinks."
          }
        )
      ]
    }
  ]
};
