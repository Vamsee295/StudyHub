import { Course } from './types';
import { createAptitudeLesson } from './aptitude-factory';

export const aptitudeLogicalCourse: Course = {
  id: "course-logical-reasoning",
  slug: "logical-reasoning",
  title: "Logical Reasoning",
  description: "Develop structured reasoning and problem-solving skills for placement examinations.",
  category: "Aptitude",
  icon: "Brain",
  displayOrder: 9,
  modules: [
    {
      id: "logical-mod-1",
      slug: "patterns",
      title: "Patterns",
      description: "Identify numerical and alphabetical sequences.",
      difficulty: "Beginner",
      estimatedMinutes: 75,
      lessons: [
        createAptitudeLesson(
          "number-series",
          "Number Series",
          "Identifying the hidden mathematical sequence.",
          "A number series is a sequence of numbers following a specific mathematical rule.",
          "This is the most common reasoning question across all aptitude tests.",
          "Identify the gap (difference) between consecutive numbers. If the gap increases rapidly, it's multiplication/squares. If it increases slowly, it's addition.",
          "Calculate the difference between adjacent terms. If no pattern emerges, calculate the difference of the differences (double difference).",
          "Series: 2, 5, 10, 17, 26, ?\nDifferences: 3, 5, 7, 9. The next difference is 11. So 26 + 11 = 37.",
          "Check for n^2 + 1, n^2 - 1, n^3 patterns immediately if the numbers look familiar.",
          ["Adding incorrectly during stressful timed tests."],
          "If the series alternately increases and decreases, it might be two intertwined series.",
          {
            question: "Find the next number: 1, 4, 9, 16, 25, ?",
            options: ["30", "36", "40", "49"],
            answer: 1,
            explanation: "These are perfect squares (1^2, 2^2, 3^2, etc.). 6^2 = 36."
          }
        ),
        createAptitudeLesson(
          "alphabet-series",
          "Alphabet Series",
          "Patterns using letters.",
          "A series where letters are arranged according to a specific logic.",
          "Tests your speed in mapping letters to their positional values.",
          "A=1, B=2 ... Z=26. Also reverse order Z=1 ... A=26.",
          "Convert the letters to their numerical positions and solve it like a Number Series.",
          "Series: A, C, F, J, O, ?\nPositions: 1, 3, 6, 10, 15.\nDifferences: +2, +3, +4, +5. Next difference is +6. 15 + 6 = 21, which is U.",
          "Memorize EJOTY (5, 10, 15, 20, 25) to quickly find positions of nearby letters.",
          ["Counting on fingers instead of memorizing positional values."],
          "Write down the alphabet with numbers 1-26 before the exam begins on your scratchpad.",
          {
            question: "Find the next letter: B, E, H, K, ?",
            options: ["M", "N", "O", "P"],
            answer: 1,
            explanation: "Positions: 2, 5, 8, 11. Difference is +3. 11+3 = 14 = N."
          }
        ),
        createAptitudeLesson(
          "alphanumeric-series",
          "Alphanumeric Series",
          "Combining letters and numbers.",
          "A sequence containing both letters and digits.",
          "Often used to increase the visual complexity of simple patterns.",
          "Treat the letters and numbers as two separate, independent series.",
          "Solve the number pattern first, then the letter pattern, and combine them.",
          "Series: A1, C4, E9, G16, ?\nLetters: A, C, E, G (+2) -> I\nNumbers: 1, 4, 9, 16 (squares) -> 25\nAnswer: I25",
          "Don't try to link the letter to the number unless they are clearly tied (e.g., A1, B2).",
          ["Getting overwhelmed by the combination and missing simple individual patterns."],
          "Focus on one element type across the series first.",
          {
            question: "Find the next term: 2Z5, 7Y7, 14X9, 23W11, 34V13, ?",
            options: ["47U15", "45U15", "47V14", "45V14"],
            answer: 0,
            explanation: "First number: 2(+5)=7(+7)=14(+9)=23(+11)=34(+13)=47. Letter: Z,Y,X,W,V(-1)=U. Last number: 5,7,9,11,13(+2)=15. 47U15."
          }
        ),
        createAptitudeLesson(
          "analogies",
          "Analogies",
          "Finding proportional relationships.",
          "A comparison between two things, typically on the basis of their structure.",
          "Tests vocabulary, general knowledge, and logic simultaneously.",
          "A : B :: C : D. The relationship between A and B is identical to C and D.",
          "Form a sentence that describes the relationship between A and B. Apply that exact sentence to C.",
          "OVEN : BAKE :: KNIFE : ?\nSentence: An OVEN is a tool used to BAKE.\nA KNIFE is a tool used to CUT.",
          "Read all options before deciding; sometimes multiple fit loosely, but one fits perfectly.",
          ["Picking an option related to C, but not exhibiting the same relationship."],
          "Check the part of speech (noun, verb, adjective) to eliminate wrong answers.",
          {
            question: "Tree : Forest :: Soldier : ?",
            options: ["Gun", "Army", "Battle", "Uniform"],
            answer: 1,
            explanation: "A collection of Trees makes a Forest. A collection of Soldiers makes an Army."
          }
        ),
        createAptitudeLesson(
          "odd-one-out",
          "Odd One Out",
          "Classification and finding the anomaly.",
          "Selecting the item that does not belong to the given group.",
          "Tests your ability to find a common rule that applies to all but one.",
          "Find the underlying category (e.g., primes, capitals, synonyms) that links the majority.",
          "Look for squares, primes, or divisibility for numbers. Look for vowels, consonants, or alphabetical gaps for letters.",
          "Options: 16, 25, 36, 50. All are perfect squares except 50.",
          "For numbers, always check prime numbers and perfect squares first.",
          ["Finding a rule for the odd one instead of finding the rule for the group."],
          "The 'Odd One' is odd because the OTHERS share a property, not just because it is unique.",
          {
            question: "Find the odd one out: Apple, Orange, Banana, Carrot",
            options: ["Apple", "Orange", "Banana", "Carrot"],
            answer: 3,
            explanation: "Apple, Orange, and Banana are fruits. Carrot is a vegetable."
          }
        )
      ]
    },
    {
      id: "logical-mod-2",
      slug: "basic-reasoning",
      title: "Basic Reasoning",
      description: "Coding, relations, and directions.",
      difficulty: "Intermediate",
      estimatedMinutes: 90,
      lessons: [
        createAptitudeLesson(
          "coding-decoding",
          "Coding-Decoding",
          "Encrypting and decrypting information.",
          "A process of converting a word to a code and vice-versa using a specific rule.",
          "Heavily tested in mass recruiter exams.",
          "Identify the shift (+1, -2, reverse order) applied to each letter.",
          "Write the word and the code directly below it. Map the changes column by column.",
          "If APPLE is coded as BQQMF (each letter +1), then ORANGE is coded as PSBOHF.",
          "Look for diagonal coding (first letter shifts and becomes the last letter).",
          ["Assuming a constant shift when the shift is increasing (+1, +2, +3)."],
          "Always write the positional values above the letters if the pattern isn't obvious.",
          {
            question: "If CAT is coded as 24, what is DOG coded as?",
            options: ["24", "26", "28", "30"],
            answer: 1,
            explanation: "C(3) + A(1) + T(20) = 24. D(4) + O(15) + G(7) = 26."
          }
        ),
        createAptitudeLesson(
          "blood-relations",
          "Blood Relations",
          "Family trees and connections.",
          "Tracing family relationships through generations.",
          "Tests your ability to map complex relational logic.",
          "Use a family tree diagram. Squares for males, circles for females. Vertical lines for generations, horizontal for siblings/spouses.",
          "Break the statement down from the end to the beginning (e.g., 'My father's only son' -> me/my brother).",
          "'A is the brother of B's father.' Diagram: B is at bottom. Father above B. A next to Father. A is B's uncle.",
          "Assume 'My' refers to the speaker. Work backward from 'My'.",
          ["Assuming gender based on names (e.g., assuming 'Pat' is male/female)."],
          "Never assume gender by name in logical reasoning unless explicitly stated.",
          {
            question: "Pointing to a photograph, a man says 'She is the mother of my son's wife's daughter'. How is she related to the man?",
            options: ["Wife", "Daughter-in-law", "Daughter", "Sister"],
            answer: 1,
            explanation: "Son's wife's daughter = Son's daughter = Granddaughter. Mother of granddaughter = Son's wife = Daughter-in-law."
          }
        ),
        createAptitudeLesson(
          "direction-sense",
          "Direction Sense",
          "Navigating 2D space.",
          "Tracing the path and finding final position/distance relative to the start.",
          "Combines logic with basic geometry (Pythagoras).",
          "North (Up), South (Down), East (Right), West (Left).",
          "Draw a map step-by-step as you read the problem. Mark distances.",
          "Walk 3m East, turn left (North) walk 4m. Distance from start = sqrt(3^2 + 4^2) = 5m.",
          "Imagine yourself facing the direction of travel to correctly identify left and right turns.",
          ["Confusing East and West on the paper."],
          "Always draw a small compass (N, S, E, W) on the corner of your scratchpad.",
          {
            question: "A man walks 5km South, turns right and walks 3km. Then he turns right and walks 5km. What direction is he from the start?",
            options: ["North", "South", "East", "West"],
            answer: 3,
            explanation: "South (down 5), right (West 3), right (North 5). He is 3km directly West of the start."
          }
        ),
        createAptitudeLesson(
          "ranking-and-ordering",
          "Ranking and Ordering",
          "Positions in a queue.",
          "Finding the total number of people or someone's rank from the other end.",
          "Requires careful boundary management (inclusive/exclusive counting).",
          "Total = (Rank from Left) + (Rank from Right) - 1.",
          "Draw a line and mark the positions. Apply the formula.",
          "A is 10th from left and 15th from right. Total = 10 + 15 - 1 = 24.",
          "Subtract 1 because the person is counted twice.",
          ["Forgetting to subtract 1 in the total formula."],
          "If A and B swap positions, track the empty 'seats', not just the people.",
          {
            question: "In a class of 40 students, Rohan's rank is 15th from top. What is his rank from the bottom?",
            options: ["24", "25", "26", "27"],
            answer: 2,
            explanation: "Total = Top + Bottom - 1. 40 = 15 + Bottom - 1. Bottom = 40 - 14 = 26."
          }
        ),
        createAptitudeLesson(
          "clocks-calendars",
          "Clocks and Calendars",
          "Time-based logical math.",
          "Finding angles between clock hands or determining the day of the week.",
          "Frequently asked in core placement tests.",
          "Minute hand moves 6 deg/min. Hour hand moves 0.5 deg/min. Angle = |30*H - 5.5*M|.",
          "For calendars, find 'odd days' (remainder when dividing total days by 7).",
          "Angle at 3:30. |30(3) - 5.5(30)| = |90 - 165| = 75 degrees.",
          "A normal year has 1 odd day. A leap year has 2 odd days.",
          ["Forgetting that the hour hand moves while the minute hand moves."],
          "Every 400 years has 0 odd days. This resets the calendar math completely.",
          {
            question: "What is the angle between the hands of a clock at 4:20?",
            options: ["0 degrees", "5 degrees", "10 degrees", "15 degrees"],
            answer: 2,
            explanation: "Angle = |30(4) - 5.5(20)| = |120 - 110| = 10 degrees."
          }
        )
      ]
    },
    {
      id: "logical-mod-3",
      slug: "advanced-reasoning",
      title: "Advanced Reasoning",
      description: "Syllogisms, data sufficiency, and puzzles.",
      difficulty: "Advanced",
      estimatedMinutes: 100,
      lessons: [
        createAptitudeLesson(
          "syllogisms",
          "Syllogisms",
          "Deductive logic and Venn diagrams.",
          "Determining if conclusions logically follow from given statements.",
          "Tests strict logical deduction without real-world assumptions.",
          "Draw Venn diagrams to represent 'All', 'Some', 'No', and 'Some Not'.",
          "Draw the basic diagram. A conclusion must be true in ALL possible valid diagrams to follow.",
          "Statements: All Cats are Dogs. Some Dogs are Birds. \nConclusion: Some Cats are Birds. (False - possible, but not definite).",
          "If a statement is positive, negative definite conclusions usually do not follow.",
          ["Bringing real-world knowledge into the problem (e.g., 'cats aren't dogs')."],
          "Only accept a conclusion if it is 100% true based ONLY on the statements provided.",
          {
            question: "Statements: All A are B. All B are C. Conclusion: All A are C.",
            options: ["True", "False", "Cannot be determined", "Sometimes true"],
            answer: 0,
            explanation: "If A is entirely inside B, and B is entirely inside C, then A is entirely inside C."
          }
        ),
        createAptitudeLesson(
          "statements-conclusions",
          "Statements and Conclusions",
          "Analyzing logical implications.",
          "Evaluating whether a conclusion can be safely drawn from a real-world statement.",
          "Used to test critical reasoning.",
          "The conclusion must be directly related and logically derived from the statement.",
          "Read the statement carefully. Do not assume any external facts.",
          "Statement: The company is hiring only experienced candidates. Conclusion: The company wants to reduce training time. (Valid assumption).",
          "Avoid conclusions that use extreme words like 'always', 'never', 'only' unless the statement implies it.",
          ["Making assumptions that go too far beyond the provided text."],
          "If the conclusion requires two leaps of logic, it is usually invalid.",
          {
            question: "Statement: A diet rich in fruits prevents diseases. Conclusion: Everyone should eat fruits.",
            options: ["Follows", "Does not follow"],
            answer: 0,
            explanation: "Since it prevents diseases, it is a logical recommendation for everyone."
          }
        ),
        createAptitudeLesson(
          "data-sufficiency",
          "Data Sufficiency",
          "Evaluating information completeness.",
          "Determining if the provided statements are enough to answer the question.",
          "Saves time because you don't actually have to solve the problem.",
          "Check Statement 1 alone. Then Statement 2 alone. If both fail, combine them.",
          "Do NOT calculate the exact answer. Just verify if a unique answer exists.",
          "Q: What is x? \nS1: x + y = 10 \nS2: x - y = 4 \nResult: Both together are sufficient.",
          "Once you know the statements are sufficient, STOP calculating.",
          ["Solving the entire math problem unnecessarily, wasting 3 minutes."],
          "Always test Statement 2 alone and pretend Statement 1 does not exist.",
          {
            question: "What is the value of x? \nI: x^2 = 25 \nII: x > 0",
            options: ["I alone", "II alone", "Both together", "Neither"],
            answer: 2,
            explanation: "I gives x = 5 or -5. II gives x > 0. Together, we know exactly that x = 5."
          }
        ),
        createAptitudeLesson(
          "seating-arrangement",
          "Seating Arrangement",
          "Logical spatial positioning.",
          "Placing individuals in a row or circle based on a set of rules.",
          "Common in banking exams and advanced IT placements.",
          "Identify fixed information first. Draw the circle/row. Fill in relative information.",
          "Start with the most definite statement (e.g., 'A sits perfectly opposite B').",
          "If 'A is second to the left of B', place B first, then count two seats left to place A.",
          "For circular arrangements, always be clear if they are facing the center or outside.",
          ["Placing an uncertain variable immediately and getting stuck later."],
          "Write down all conditions in short notation before drawing the diagram.",
          {
            question: "A, B, C, D sit in a circle facing the center. A is opposite C. B is to the immediate right of A. Who is opposite B?",
            options: ["A", "C", "D", "None"],
            answer: 2,
            explanation: "Draw it. A is Top, C is Bottom. Right of A is B (Right side). So D must be on the Left side, opposite B."
          }
        )
      ]
    }
  ]
};
