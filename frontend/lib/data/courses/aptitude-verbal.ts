import { Course } from './types';
import { createAptitudeLesson } from './aptitude-factory';

export const aptitudeVerbalCourse: Course = {
  id: "course-verbal-ability",
  slug: "verbal-ability",
  title: "Verbal Ability",
  description: "Improve grammar, vocabulary, comprehension, and sentence-solving skills for placement tests.",
  category: "Aptitude",
  icon: "BookOpen",
  displayOrder: 10,
  modules: [
    {
      id: "verbal-mod-1",
      slug: "vocabulary",
      title: "Vocabulary",
      description: "Synonyms, antonyms, and substitutions.",
      difficulty: "Beginner",
      estimatedMinutes: 60,
      lessons: [
        createAptitudeLesson(
          "synonyms",
          "Synonyms",
          "Words with similar meanings.",
          "A synonym is a word or phrase that means exactly or nearly the same as another.",
          "Tests your English lexicon, crucial for communication roles.",
          "Identify the root, prefix, and suffix of the word if you don't know the exact meaning.",
          "Read the word in context if a sentence is provided. Substitute the options to see which fits best.",
          "'The manager was ASTOUNDED by the results.' \nOptions: Amazed, Angry, Bored. \n'Amazed' fits the context perfectly.",
          "Use the elimination method based on the positive or negative tone of the word.",
          ["Picking an antonym by mistake because it is a closely associated word."],
          "Learn 10 new words daily leading up to the placement season.",
          {
            question: "What is the synonym of 'Abundant'?",
            options: ["Scarce", "Plentiful", "Rare", "Short"],
            answer: 1,
            explanation: "Abundant means existing or available in large quantities; plentiful."
          }
        ),
        createAptitudeLesson(
          "antonyms",
          "Antonyms",
          "Words with opposite meanings.",
          "An antonym is a word opposite in meaning to another.",
          "Tests precise understanding of word nuances.",
          "Identify the core meaning and tone (positive/negative) of the given word.",
          "Find a word in the options that has the exact opposite tone and scale.",
          "Antonym of 'Optimistic'. Optimistic is positive (hopeful). We need a negative word. 'Pessimistic' is the exact opposite.",
          "Prefixes like un-, in-, dis-, im- often form antonyms (e.g., capable -> incapable).",
          ["Picking a synonym by mistake, as test makers always include the synonym as option A."],
          "Always double-check the question header (Synonym vs Antonym) before clicking.",
          {
            question: "What is the antonym of 'Transparent'?",
            options: ["Clear", "Opaque", "Translucent", "Lucid"],
            answer: 1,
            explanation: "Transparent allows light through; opaque blocks it entirely."
          }
        ),
        createAptitudeLesson(
          "one-word-substitution",
          "One-Word Substitution",
          "Replacing a phrase with a single word.",
          "Using one specific word to describe a lengthy phrase or sentence.",
          "Reduces wordiness and tests advanced vocabulary.",
          "Understand the definition provided and map it to standard English nouns/adjectives.",
          "Look for root words. For example, 'cide' means killing (homicide), 'ology' means study of (biology).",
          "'A person who hates mankind' -> Misanthrope. (Misan = hate, anthrope = mankind).",
          "Learn common roots (phobia, cracy, cide, logy, phil) to guess words you haven't seen.",
          ["Guessing a word that sounds similar but means something else."],
          "Group words by roots when studying to memorize them 10x faster.",
          {
            question: "What is the one-word substitution for 'A life history written by oneself'?",
            options: ["Biography", "Autobiography", "Calligraphy", "History"],
            answer: 1,
            explanation: "Auto = self. Bio = life. Graphy = writing."
          }
        ),
        createAptitudeLesson(
          "vocabulary-in-context",
          "Vocabulary in Context",
          "Deducing meaning from a sentence.",
          "Finding the meaning of a word based on how it is used in a specific sentence.",
          "Tests practical English usage rather than rote memorization.",
          "Look at the surrounding words (context clues) to deduce the tone and meaning.",
          "Blank out the target word, guess a simple word that fits, and find the closest match in the options.",
          "'His ERUDITE speech impressed the scholars.' -> The speech impressed scholars, so it must mean 'educated' or 'learned'.",
          "Conjunctions like 'but' or 'although' indicate a shift in tone. 'And' indicates a continuation.",
          ["Ignoring the sentence and choosing the most common definition of the word."],
          "Some words have multiple meanings; always rely on the sentence context.",
          {
            question: "In the sentence 'The water was so MURKY we couldn't see the bottom', what does MURKY mean?",
            options: ["Clear", "Deep", "Cloudy/Dark", "Cold"],
            answer: 2,
            explanation: "Since they couldn't see the bottom, the water must be unclear or dark."
          }
        )
      ]
    },
    {
      id: "verbal-mod-2",
      slug: "grammar",
      title: "Grammar",
      description: "Rules of English structure.",
      difficulty: "Intermediate",
      estimatedMinutes: 90,
      lessons: [
        createAptitudeLesson(
          "parts-of-speech",
          "Parts of Speech",
          "Nouns, verbs, adjectives, and adverbs.",
          "The categories into which words are classified according to their functions in sentences.",
          "Forms the foundation for sentence correction questions.",
          "Identify the role of the word. Is it an action (verb), a thing (noun), or descriptive (adjective/adverb)?",
          "Analyze the sentence structure (Subject-Verb-Object).",
          "'He runs quickly.' He=Pronoun, runs=Verb, quickly=Adverb.",
          "Adverbs modify verbs, adjectives, or other adverbs. Adjectives modify nouns.",
          ["Confusing adjectives (good) with adverbs (well)."],
          "Understand the function, not just the word. 'Water' can be a noun (drink water) or a verb (water the plants).",
          {
            question: "Identify the adverb in: 'The dog barked loudly.'",
            options: ["The", "dog", "barked", "loudly"],
            answer: 3,
            explanation: "'Loudly' modifies the verb 'barked'."
          }
        ),
        createAptitudeLesson(
          "subject-verb-agreement",
          "Subject-Verb Agreement",
          "Matching subjects to their verbs.",
          "A singular subject takes a singular verb, and a plural subject takes a plural verb.",
          "The #1 most tested grammar rule in placement exams.",
          "Identify the true subject of the sentence, ignoring any prepositional phrases in between.",
          "Match the verb explicitly to the true subject.",
          "'The box of chocolates IS on the table.' (Subject is 'box', not 'chocolates').",
          "Words like 'Everyone', 'Each', 'Anyone' always take a singular verb.",
          ["Matching the verb to the noun closest to it, rather than the actual subject."],
          "When two subjects are joined by 'or'/'nor', the verb agrees with the subject closest to it.",
          {
            question: "Which sentence is correct?",
            options: ["The group of boys are playing.", "The group of boys is playing.", "The group of boys were playing.", "None of the above."],
            answer: 1,
            explanation: "The subject is 'group' (singular), so the verb must be 'is'."
          }
        ),
        createAptitudeLesson(
          "tenses",
          "Tenses",
          "Time of action.",
          "Verb forms that indicate the time (past, present, future) of an action.",
          "Crucial for paragraph coherence and error detection.",
          "Ensure the tense is consistent throughout the sentence unless a time shift is explicitly stated.",
          "Look for time markers (e.g., 'yesterday', 'since 2010', 'tomorrow').",
          "'I have been living here since 2010.' (Present Perfect Continuous - started in past, continuing now).",
          "Use 'had + V3' (Past Perfect) when two past actions occur, to show which happened first.",
          ["Mixing past and present tenses in the same clause incorrectly."],
          "The Past Perfect tense ('had done') requires another past action to anchor it.",
          {
            question: "Complete the sentence: 'By the time we arrived, the train _______.'",
            options: ["left", "has left", "had left", "was leaving"],
            answer: 2,
            explanation: "Two past actions. The train leaving happened first, so it takes the past perfect ('had left')."
          }
        ),
        createAptitudeLesson(
          "sentence-correction",
          "Sentence Correction",
          "Fixing grammatical errors.",
          "Identifying and correcting errors in a given sentence.",
          "A staple of TCS, Infosys, and Wipro verbal sections.",
          "Check S-V agreement, tenses, pronouns, idioms, and parallel structure.",
          "Read the sentence carefully. Identify the underlined portion and test each option.",
          "'He is more taller than me.' -> 'He is taller than I.' (Double comparative is wrong, and subject pronoun is needed).",
          "Shorter answers are usually better if grammatically correct (avoid wordiness).",
          ["Selecting an option that changes the original meaning of the sentence."],
          "Check for parallelism: 'I like hiking, swimming, and to bike' -> '...and biking'.",
          {
            question: "Correct the sentence: 'Neither of the answers are correct.'",
            options: ["Neither of the answers is correct.", "Neither answers are correct.", "No correction required."],
            answer: 0,
            explanation: "'Neither' is a singular subject and requires the singular verb 'is'."
          }
        )
      ]
    },
    {
      id: "verbal-mod-3",
      slug: "comprehension",
      title: "Comprehension",
      description: "Reading and understanding passages.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: [
        createAptitudeLesson(
          "reading-comprehension",
          "Reading Comprehension",
          "Extracting information from text.",
          "Reading a passage and answering questions based on it.",
          "Tests reading speed, retention, and analytical ability.",
          "Identify the main idea, tone of the author, and specific facts.",
          "Read the questions FIRST, then skim the passage for keywords.",
          "If a question asks for the 'Main Idea', look at the first and last paragraphs.",
          "Do not infer beyond what is stated or strongly implied in the text.",
          ["Using outside knowledge to answer a question instead of the passage."],
          "The answer is ALWAYS in the text, either explicitly or implicitly.",
          {
            question: "If a passage discusses the negative impacts of pollution, what is the likely tone of the author?",
            options: ["Joyful", "Concerned", "Indifferent", "Humorous"],
            answer: 1,
            explanation: "Discussing negative impacts naturally implies a concerned or critical tone."
          }
        ),
        createAptitudeLesson(
          "para-jumbles",
          "Para Jumbles",
          "Reordering sentences.",
          "A set of jumbled sentences that need to be arranged into a coherent paragraph.",
          "Tests logical flow and understanding of transitions.",
          "Identify the opening sentence (usually introduces a noun or concept). Look for links (pronouns, conjunctions).",
          "Find mandatory pairs (e.g., Sentence A introduces 'John', Sentence B says 'He did this'. A must precede B).",
          "Sentences: \nP. But he failed. \nQ. John tried hard. \nR. He decided to quit.\nOrder: Q -> P -> R.",
          "Look for transition words like 'However', 'Therefore', 'Also' to connect ideas.",
          ["Trying to read all possible combinations instead of finding mandatory pairs."],
          "Use the multiple-choice options to eliminate invalid starting sentences quickly.",
          {
            question: "Arrange: P: Finally, he succeeded. Q: He started a business. R: It struggled at first.",
            options: ["PQR", "QRP", "RQP", "QPR"],
            answer: 1,
            explanation: "Q introduces the action. R describes the initial state. P concludes."
          }
        ),
        createAptitudeLesson(
          "fill-in-the-blanks",
          "Fill in the Blanks",
          "Completing the sentence logically.",
          "Choosing the correct word to complete a sentence.",
          "Tests vocabulary and context simultaneously.",
          "Analyze the tone (positive/negative) and the grammar required (noun/verb).",
          "Predict a word that fits before looking at the options.",
          "'The CEO was known for his _____, always giving money to charity.' -> Prediction: Generosity. Matches option: Philanthropy.",
          "Pay attention to prepositional phrases that follow the blank.",
          ["Picking a word that sounds good but violates grammatical rules."],
          "If there are two blanks, one word usually eliminates 2-3 options instantly.",
          {
            question: "Despite his _______ wealth, he lived a very simple life.",
            options: ["little", "immense", "unknown", "poor"],
            answer: 1,
            explanation: "'Despite' implies a contrast. Living simple contrasts with having 'immense' wealth."
          }
        )
      ]
    }
  ]
};
