// Top-up items for the voice, speech, reading-comprehension and cloze banks. All original.
type Fill = [string, string, string[], string];

type Passage = [string, [string, string, string[], string][]];

export const VOICE_3: Fill[] = [
  ["Passive of: 'The cat chased the mouse.'", "The mouse was chased by the cat.", ["The mouse is chased by the cat.", "The mouse was chase by the cat.", "The cat was chased by the mouse."], "Past tense → was + past participle (chased)."],
  ["Passive of: 'She sings a song.'", "A song is sung by her.", ["A song was sung by her.", "A song is sang by her.", "A song is being sung by she."], "Present tense → is + past participle (sung)."],
  ["Passive of: 'They are building a bridge.'", "A bridge is being built by them.", ["A bridge is built by them.", "A bridge was being built by them.", "A bridge is being build by them."], "Present continuous → is being + past participle."],
  ["Passive of: 'Ravi has written a book.'", "A book has been written by Ravi.", ["A book had been written by Ravi.", "A book has written by Ravi.", "A book is written by Ravi."], "Present perfect → has been + past participle."],
  ["Passive of: 'Close the door.'", "Let the door be closed.", ["The door is closed.", "Let the door closed.", "The door was being closed."], "Commands → Let + object + be + past participle."],
  ["Passive of: 'Who broke the window?'", "By whom was the window broken?", ["Who was the window broken?", "By whom the window was broken?", "Whom was broken the window?"], "Who → By whom, then question order: was + subject + participle."],
  ["Passive of: 'The manager will sign the letter.'", "The letter will be signed by the manager.", ["The letter will signed by the manager.", "The letter would be signed by the manager.", "The letter is going to sign by the manager."], "Future → will be + past participle."],
  ["Passive of: 'People speak English all over the world.'", "English is spoken all over the world.", ["English was spoken all over the world.", "English is speak all over the world.", "People are spoken English all over the world."], "General doer 'people' is dropped; is + spoken."],
  ["Passive of: 'She gave me a gift.' (personal object first)", "I was given a gift by her.", ["I was gave a gift by her.", "I am given a gift by her.", "A gift gave me by her."], "Either object can become the subject; I + was given."],
  ["Passive of: 'You must obey the rules.'", "The rules must be obeyed by you.", ["The rules must obeyed by you.", "The rules must have obeyed by you.", "The rules are must be obeyed."], "Modal → must be + past participle."],
  ["Active of: 'The cake was eaten by the children.'", "The children ate the cake.", ["The children eat the cake.", "The children have eaten the cake.", "The cake ate the children."], "was eaten (past) → ate; the doer becomes the subject."],
  ["Passive of: 'Did he finish the work?'", "Was the work finished by him?", ["Did the work finished by him?", "Is the work finished by him?", "Was the work finish by him?"], "Did + verb question → Was + subject + past participle?"],
];

export const SPEECH_3: Fill[] = [
  ["Indirect form: He said, \"I am tired.\"", "He said that he was tired.", ["He said that he is tired.", "He said that I was tired.", "He told that he was tired."], "am → was after a past reporting verb; I → he."],
  ["Indirect form: She said, \"I will come tomorrow.\"", "She said that she would come the next day.", ["She said that she will come tomorrow.", "She said that she would come tomorrow.", "She told that she will come the next day."], "will → would; tomorrow → the next day."],
  ["Indirect form: He said to her, \"Where do you live?\"", "He asked her where she lived.", ["He asked her where did she live.", "He asked her where does she live.", "He said her where she lived."], "Wh-question keeps the wh-word, takes statement order, and shifts the tense."],
  ["Indirect form: The teacher said, \"The earth goes round the sun.\"", "The teacher said that the earth goes round the sun.", ["The teacher said that the earth went round the sun.", "The teacher said that the earth had gone round the sun.", "The teacher told that the earth goes round the sun."], "Universal truths keep their present tense."],
  ["Indirect form: She said, \"I like this dress.\"", "She said that she liked that dress.", ["She said that she likes this dress.", "She said that she liked this dress.", "She said that I liked that dress."], "like → liked; this → that."],
  ["Indirect form: He said to me, \"Don't touch the wire.\"", "He told me not to touch the wire.", ["He told me don't touch the wire.", "He told me to not touching the wire.", "He asked me if I touched the wire."], "Negative command → told + not to."],
  ["Indirect form: They said, \"We are playing here.\"", "They said that they were playing there.", ["They said that we were playing here.", "They said that they are playing here.", "They said that they were playing here."], "are → were; we → they; here → there."],
  ["Indirect form: She said, \"What a lovely garden!\"", "She exclaimed that it was a lovely garden.", ["She said what a lovely garden it is.", "She asked if it was a lovely garden.", "She exclaimed what a lovely garden."], "Exclamations → exclaimed that + statement."],
  ["Indirect form: He said, \"I must leave now.\"", "He said that he had to leave then.", ["He said that he must leave now.", "He said that he has to leave then.", "He told that he had to leave now."], "must (duty) → had to; now → then."],
  ["Indirect form: She said to him, \"Can you help me?\"", "She asked him if he could help her.", ["She asked him can he help her.", "She asked him if he can help me.", "She said him if he could help her."], "Yes/no question → asked if; can → could; me → her."],
  ["Indirect form: He said, \"I wrote the letter last week.\"", "He said that he had written the letter the previous week.", ["He said that he wrote the letter last week.", "He said that he has written the letter the previous week.", "He said that he had wrote the letter last week."], "Past → past perfect; last week → the previous week."],
  ["Direct form of: She told me that she was busy.", "She said to me, \"I am busy.\"", ["She said to me, \"She is busy.\"", "She said to me, \"I was busy.\"", "She says to me, \"I am busy.\""], "Reverse the shift: was → am, she → I."],
];

export const PASSAGES_3: Passage[] = [
  [
    "Mangrove forests grow along tropical coastlines where land meets the sea. Their tangled roots hold soil in place and slow down waves, which protects villages from storms and erosion. Mangroves also serve as nurseries for many fish, which lay eggs among the roots where larger predators cannot reach them. In addition, these forests store large amounts of carbon in their mud. Despite these benefits, mangroves have been cleared in many places for shrimp farms and coastal building. Some countries now pay local communities to replant and guard them.",
    [
      ["What is the passage mainly about?", "The value of mangrove forests and threats to them.", ["How to start a shrimp farm.", "Why storms are getting stronger.", "The life cycle of a fish."], "Most sentences list benefits; the end mentions clearing and replanting."],
      ["How do mangroves protect villages?", "Their roots hold soil and slow waves.", ["They block all rain.", "They keep fish away.", "They raise the land level."], "Stated in the second sentence."],
      ["Why do fish lay eggs among mangrove roots?", "Larger predators cannot reach the eggs there.", ["The water is warmer there.", "There is more light.", "The roots provide food for eggs."], "The third sentence gives the reason: shelter from predators."],
      ["Which is NOT given as a cause of mangrove loss?", "Forest fires", ["Shrimp farms", "Coastal building", "Clearing land by people"], "Only shrimp farms and coastal building are named."],
      ["The word 'nurseries' in the passage means…", "places where young ones grow", ["hospitals", "plant shops", "schools for children"], "Fish eggs hatch and grow among the roots."],
      ["What does the last sentence suggest?", "Some governments are trying to restore mangroves.", ["Mangroves cannot be replanted.", "Local people destroy mangroves.", "Mangroves are no longer at risk."], "Paying people to replant shows a restoration effort."],
    ],
  ],
  [
    "When Anil started his first job, he found meetings stressful. He prepared long notes but rarely spoke, worried that his ideas were not good enough. His manager noticed this and gave him a small task: share one idea in every meeting, however small. At first Anil's voice shook. After a few weeks, he realised that colleagues welcomed his questions, and some of his suggestions were adopted. The habit grew into confidence. A year later, Anil was leading the weekly meeting himself, and he made a point of asking the quietest person in the room for their view.",
    [
      ["Why did Anil rarely speak in meetings at first?", "He worried his ideas were not good enough.", ["He was not allowed to speak.", "He had not prepared.", "He disliked his colleagues."], "The second sentence gives the reason."],
      ["What task did the manager give him?", "Share one idea in every meeting.", ["Write the meeting notes.", "Lead the weekly meeting.", "Stay silent and listen."], "Stated in the third sentence."],
      ["What changed Anil's attitude?", "Colleagues welcomed his questions and adopted some ideas.", ["He got a promotion at once.", "His manager left.", "He stopped attending meetings."], "Positive responses built his confidence."],
      ["Why did Anil ask the quietest person for their view?", "He remembered how it felt to be hesitant.", ["He wanted to embarrass them.", "It was a company rule.", "He had no ideas of his own."], "It is implied: he had been the quiet one."],
      ["The phrase 'made a point of' means…", "did deliberately and regularly", ["argued about", "pointed at", "forgot to do"], "Making a point of doing something means doing it on purpose."],
      ["The best title for the passage is…", "Small Steps to Confidence", ["The Stress of Office Work", "How to Write Notes", "A Strict Manager"], "The story shows a small habit growing into confidence."],
    ],
  ],
];

export const CLOZE_4: Passage[] = [
  [
    "Sleep is (1) ___ important for students as study. During sleep, the brain sorts the day's learning and (2) ___ the useful parts. Students who stay up all night before an exam often remember (3) ___ than those who sleep well. Experts advise going to bed at the same time each night and (4) ___ screens for an hour before sleeping. A rested mind is quicker, calmer and (5) ___ likely to make careless mistakes.",
    [
      ["Blank (1)", "as", ["so", "more", "too"], "The comparison 'as important as' needs 'as'."],
      ["Blank (2)", "stores", ["store", "storing", "stored"], "Singular subject 'the brain' takes 'stores', matching 'sorts'."],
      ["Blank (3)", "less", ["fewer", "little", "least"], "Comparing amounts with 'than' needs 'less'."],
      ["Blank (4)", "avoiding", ["avoid", "avoided", "to avoiding"], "Parallel with 'going': going … and avoiding."],
      ["Blank (5)", "less", ["more", "most", "least"], "A rested mind makes fewer mistakes, so 'less likely'."],
    ],
  ],
  [
    "The village had no library, (1) ___ a retired teacher opened one in her front room. She began with fifty books from her own shelves. Word spread quickly, and neighbours (2) ___ donating books they no longer needed. Within a year the collection had (3) ___ to over a thousand titles. Children came after school to read and do homework. The teacher says the library has (4) ___ her more joy than anything else in her life, and she hopes someone will carry it on (5) ___ she is gone.",
    [
      ["Blank (1)", "so", ["but", "because", "although"], "The lack of a library led to opening one: result → so."],
      ["Blank (2)", "started", ["start", "starting", "starts"], "Past narrative: neighbours started donating."],
      ["Blank (3)", "grown", ["grew", "grow", "growing"], "had + past participle → had grown."],
      ["Blank (4)", "given", ["gave", "give", "giving"], "has + past participle → has given."],
      ["Blank (5)", "after", ["before", "until", "while"], "Carry it on once she is no longer there: after."],
    ],
  ],
  [
    "Online shopping has changed how people buy things. Customers can compare prices (1) ___ leaving home and have goods delivered within days. (2) ___, this convenience has a cost. Small local shops find it hard to (3) ___ with large websites, and extra packaging creates waste. Some buyers now try to (4) ___ a balance by ordering online only when an item is not available nearby. Such choices, (5) ___ small, can help keep local markets alive.",
    [
      ["Blank (1)", "without", ["by", "despite", "for"], "Compare prices while not leaving home: without leaving."],
      ["Blank (2)", "However", ["Therefore", "Moreover", "Similarly"], "The next sentence contrasts the benefit: However."],
      ["Blank (3)", "compete", ["complete", "compare", "compose"], "Shops struggle to compete with large websites."],
      ["Blank (4)", "strike", ["hit", "make", "take"], "The collocation is 'strike a balance'."],
      ["Blank (5)", "though", ["despite", "because", "unless"], "'Though small' means even if small."],
    ],
  ],
];
