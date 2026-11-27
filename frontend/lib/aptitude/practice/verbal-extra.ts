// More authored practice for the word-based banks, plus original reading and cloze passages.
type Fill = [string, string, string[], string];

export const MORE_CONCLUSIONS: Fill[] = [
  ["Statement: All engineers in the firm know Java. Priya is an engineer in the firm. Conclusion?", "Priya knows Java.", ["Priya knows only Java.", "Priya is the best engineer.", "Priya doesn't know Java."], "Priya is one of the engineers who all know Java."],
  ["Statement: The shop gives a discount only on weekends. Today there's no discount. Conclusion?", "Nothing definite about whether today is a weekday.", ["Today is a weekday.", "Today is Sunday.", "The shop has stopped discounts."], "'Only on weekends' means no discount on weekdays, but weekends may also have none: the statement doesn't force today to be a weekday."],
  ["Statement: Every train to Mumbai stops at Pune. This train doesn't stop at Pune. Conclusion?", "This train isn't going to Mumbai.", ["This train is late.", "This train goes to Pune.", "No train stops at Pune."], "If it were going to Mumbai, it would stop at Pune."],
  ["Statement: Some books in the library are rare. Conclusion?", "The library has at least one rare book.", ["All books are rare.", "No book is common.", "Rare books are expensive."], "'Some' means at least one."],
  ["Statement: Children under 12 travel free. Anu paid for her ticket. Conclusion?", "Nothing definite about Anu's age.", ["Anu is under 12.", "Anu is 12 or older.", "Anu travelled free."], "She may be 12 or older, or may have paid anyway: the statement doesn't force either."],
  ["Statement: The factory has doubled its output this year. Conclusion?", "The factory is producing more than last year.", ["The factory has doubled its profit.", "The factory has hired twice as many workers.", "The factory will double again next year."], "Only output is mentioned."],
  ["Statement: No student who missed the test was allowed to pass. Kabir passed. Conclusion?", "Kabir didn't miss the test.", ["Kabir topped the class.", "Kabir missed the test.", "All students passed."], "Missing the test would have meant failing."],
  ["Statement: Most of the members voted for the proposal. Conclusion?", "The proposal got more than half the votes of members.", ["Every member voted for it.", "The proposal was rejected.", "No member voted against it."], "'Most' means more than half."],
  ["Statement: Air pollution in the city rose after factories were set up nearby. Conclusion?", "Pollution rose after the factories came.", ["The factories caused all the pollution.", "The factories must be closed.", "There was no pollution before."], "The statement only gives the order of events, not proven cause."],
  ["Statement: Only members can use the gym. Ravi uses the gym. Conclusion?", "Ravi is a member.", ["Ravi is the owner.", "Ravi is a trainer.", "Ravi isn't a member."], "Using the gym requires membership."],
];

export const MORE_ASSUMPTIONS: Fill[] = [
  ["\"Wear a helmet while riding.\" Which is implicit?", "Helmets protect riders.", ["Riders never fall.", "Helmets are cheap.", "Only bad riders need helmets."], "The advice assumes helmets give protection."],
  ["\"The college has added evening classes for working students.\" Which is implicit?", "Some working students want to study in the evening.", ["All students work.", "Morning classes are cancelled.", "Evening classes are better."], "The change assumes there's demand."],
  ["\"Drink boiled water during the monsoon.\" Which is implicit?", "Water may be contaminated in the monsoon.", ["Boiled water tastes better.", "It never rains outside the monsoon.", "Everyone falls ill in the monsoon."], "The advice assumes a risk to unboiled water."],
  ["\"Apply before 30 June to be considered.\" Which is implicit?", "Late applications won't be considered.", ["Everyone applies on 30 June.", "Applications open in June.", "Only toppers apply."], "A deadline assumes later entries are excluded."],
  ["\"Our new phone has a bigger battery, so you can go two days without charging.\" Which is implicit?", "A bigger battery lasts longer.", ["Other phones last one hour.", "People hate charging.", "The phone is cheaper."], "The claim links battery size to battery life."],
  ["\"The museum will stay open late on Fridays to attract more visitors.\" Which is implicit?", "Some people can visit only in the evening.", ["Nobody visits on other days.", "The museum is losing money.", "Fridays are holidays."], "Late hours help only if evening visitors exist."],
  ["\"Revise every chapter twice before the exam.\" Which is implicit?", "Revision improves exam performance.", ["The exam is tomorrow.", "Chapters are short.", "Students never forget anything."], "The advice assumes revision helps."],
  ["\"The bank has launched a mobile app so customers needn't visit branches.\" Which is implicit?", "Customers have access to smartphones.", ["All branches will close.", "Customers dislike the staff.", "Apps never fail."], "An app replaces visits only for customers who can use it."],
  ["\"Plant more trees to fight rising temperatures.\" Which is implicit?", "Trees can help reduce temperatures.", ["There are no trees today.", "Temperatures will fall to zero.", "Only trees affect climate."], "The suggestion assumes trees help."],
  ["\"Use our cloud storage so you never lose your photos.\" Which is implicit?", "People worry about losing photos.", ["Phones always break.", "Cloud storage is free.", "Nobody takes photos."], "The pitch assumes this worry exists."],
  ["\"The library will extend its hours during exams.\" Which is implicit?", "More students use the library during exams.", ["The library is always empty.", "Exams are held in the library.", "Students hate studying at home."], "Longer hours assume higher demand."],
  ["\"Check the weather forecast before trekking.\" Which is implicit?", "Weather can affect a trek's safety.", ["Forecasts are always wrong.", "Treks happen only in winter.", "Nobody treks in summer."], "Checking makes sense only if weather matters."],
];

export const MORE_POS: Fill[] = [
  ["In 'She sang beautifully', 'beautifully' is an…", "adverb", ["adjective", "noun", "verb"], "It tells how she sang."], ["In 'The quick fox jumped', 'quick' is an…", "adjective", ["adverb", "verb", "noun"], "It describes the fox."],
  ["In 'He works hard', 'hard' is an…", "adverb", ["adjective", "noun", "verb"], "It tells how he works."], ["In 'a hard exam', 'hard' is an…", "adjective", ["adverb", "noun", "verb"], "It describes the exam."],
  ["In 'They walked through the park', 'through' is a…", "preposition", ["adverb", "conjunction", "verb"], "It links 'walked' to 'the park'."], ["In 'We stayed home because it rained', 'because' is a…", "conjunction", ["preposition", "adverb", "pronoun"], "It joins two clauses."],
  ["In 'This is mine', 'mine' is a…", "pronoun", ["adjective", "noun", "verb"], "It stands for 'my thing'."], ["In 'Happiness matters', 'happiness' is a…", "noun", ["adjective", "verb", "adverb"], "It names a feeling."],
  ["In 'She has finished', 'has' is a…", "helping verb", ["main verb", "noun", "adverb"], "It helps form the present perfect."], ["In 'Alas, we lost', 'alas' is an…", "interjection", ["adverb", "conjunction", "noun"], "It expresses sorrow."],
  ["In 'He is taller than me', 'taller' is an…", "adjective (comparative)", ["adverb", "verb", "noun"], "It compares him with me."], ["In 'Reading improves vocabulary', 'reading' is a…", "noun (gerund)", ["verb", "adjective", "adverb"], "An -ing word used as a subject acts as a noun."],
];

export const MORE_SVA: Fill[] = [
  ["Physics ___ difficult for many students.", "is", ["are", "were", "have been"], "Subjects ending in -ics are singular."], ["The jury ___ divided in their opinions.", "were", ["was", "is", "has been"], "When members act separately, the collective noun is plural."],
  ["Each boy and each girl ___ a prize.", "gets", ["get", "are getting", "have got"], "'Each … and each …' takes a singular verb."], ["The cattle ___ grazing in the field.", "are", ["is", "was", "has been"], "'Cattle' is always plural."],
  ["Not only the students but also the teacher ___ late.", "was", ["were", "are", "have been"], "The verb agrees with the nearer subject, 'the teacher'."], ["The committee ___ its decision.", "has announced", ["have announced", "are announcing", "were announcing"], "The committee acts as one unit."],
  ["Five hundred rupees ___ too much for this.", "is", ["are", "were", "have been"], "An amount of money as one sum is singular."], ["A lot of water ___ wasted.", "is", ["are", "were", "have been"], "'Water' is uncountable."],
  ["A lot of people ___ waiting.", "are", ["is", "was", "has been"], "'People' is plural."], ["Neither of the answers ___ correct.", "is", ["are", "were", "have been"], "'Neither of' takes a singular verb."],
];

export const MORE_TENSES: Fill[] = [
  ["I ___ this film twice.", "have seen", ["saw", "see", "am seeing"], "Experience up to now: present perfect."], ["She ___ when I called her.", "was sleeping", ["slept", "sleeps", "has slept"], "An action in progress in the past."],
  ["He ___ the report by the time the boss arrived.", "had finished", ["finished", "has finished", "finishes"], "Completed before another past event."], ["They ___ cricket every Sunday.", "play", ["are playing", "played", "have played"], "A habit: present simple."],
  ["The train ___ at 6 tomorrow morning.", "leaves", ["left", "has left", "had left"], "Timetabled future events often use the present simple."], ["I ___ English for five years now.", "have been learning", ["learn", "learned", "am learning"], "Ongoing up to now with a duration."],
  ["If she had studied, she ___ passed.", "would have", ["will have", "would", "had"], "Third conditional: had + past participle, would have + past participle."], ["By the time we reach, the show ___.", "will have started", ["starts", "started", "has started"], "Completed before a future time."],
  ["He usually ___ tea, but today he is drinking coffee.", "drinks", ["is drinking", "drank", "has drunk"], "A usual habit: present simple."], ["I ___ to the market yesterday.", "went", ["have gone", "go", "had gone"], "'Yesterday' takes the past simple."],
];

export const MORE_CORRECTION: Fill[] = [
  ["Choose the correct sentence.", "Each of the players was given a medal.", ["Each of the players were given a medal.", "Each of the player was given a medal.", "Each players was given a medal."], "'Each of' + plural noun + singular verb."],
  ["Choose the correct sentence.", "She has been ill since Monday.", ["She is ill since Monday.", "She has been ill from Monday.", "She was ill since Monday."], "'Since' with a present perfect."],
  ["Choose the correct sentence.", "The data shows a clear trend.", ["The datas show a clear trend.", "The data showing a clear trend.", "The data show clearly trend."], "'Data' is commonly used as a singular mass noun in tests."],
  ["Choose the correct sentence.", "I have never seen such a beautiful place.", ["I have never seen such beautiful place.", "I never have seen a such beautiful place.", "I have never saw such a beautiful place."], "'Such a' + adjective + singular noun; 'seen', not 'saw'."],
  ["Choose the correct sentence.", "He asked me where I was going.", ["He asked me where was I going.", "He asked me where am I going.", "He asked to me where I was going."], "Reported questions use statement order."],
  ["Choose the correct sentence.", "Between you and me, the plan won't work.", ["Between you and I, the plan won't work.", "Between you and myself, the plan won't work.", "Among you and me, the plan won't work."], "After a preposition, use the object form 'me'."],
  ["Choose the correct sentence.", "The children played in the park.", ["The childrens played in the park.", "The children plays in the park.", "The child played in the parks yesterday tomorrow."], "'Children' is already plural."],
  ["Choose the correct sentence.", "Scarcely had we started when the bus broke down.", ["Scarcely we had started when the bus broke down.", "Scarcely had we started than the bus broke down.", "Scarcely we started when the bus broke down."], "'Scarcely' at the start inverts the verb and pairs with 'when'."],
];

export const MORE_FILL: Fill[] = [
  ["The doctor advised him to ___ smoking.", "give up", ["give in", "give out", "give away"], "'Give up' means stop doing something."], ["The meeting was ___ because the manager was ill.", "called off", ["called on", "called up", "called in"], "'Call off' means cancel."],
  ["She is ___ of handling the project alone.", "capable", ["able", "capability", "capably"], "The fixed phrase is 'capable of'."], ["The police are ___ the case.", "looking into", ["looking after", "looking up", "looking down"], "'Look into' means investigate."],
  ["His explanation was so ___ that everyone understood.", "lucid", ["vague", "obscure", "confusing"], "Everyone understood, so it was clear."], ["The ___ of the new rule surprised everyone.", "introduction", ["introduce", "introduced", "introducing"], "A noun is needed after 'the'."],
  ["We must ___ the damage before it spreads.", "contain", ["contend", "content", "contest"], "'Contain' means keep something from spreading."], ["The two reports ___ each other: one says profit, the other loss.", "contradict", ["confirm", "support", "repeat"], "Opposite conclusions contradict."],
];

export const MORE_VOICE: Fill[] = [
  ["Passive of: 'The teacher praised the student.'", "The student was praised by the teacher.", ["The student is praised by the teacher.", "The student had praised the teacher.", "The student was praise by the teacher."], "Past simple → was + past participle."],
  ["Passive of: 'They had completed the task.'", "The task had been completed by them.", ["The task has been completed by them.", "The task was completed by them.", "The task had completed by them."], "Past perfect → had been + past participle."],
  ["Passive of: 'Someone stole my wallet.'", "My wallet was stolen.", ["My wallet is stolen by someone.", "My wallet has stolen.", "My wallet was stole."], "Unknown doer: drop 'by someone'."],
  ["Passive of: 'Please help me.'", "You are requested to help me.", ["Let me be helped.", "Help is requested by me.", "Me is helped."], "Polite requests → You are requested to…"],
  ["Passive of: 'Will you invite her?'", "Will she be invited by you?", ["Will she invited by you?", "Would she be invited by you?", "Is she invited by you?"], "Future question → Will … be + past participle?"],
  ["Passive of: 'She was writing a letter.'", "A letter was being written by her.", ["A letter was written by her.", "A letter is being written by her.", "A letter had been written by her."], "Past continuous → was being + past participle."],
  ["Passive of: 'They called off the match.'", "The match was called off.", ["The match was called.", "The match called off.", "The match is called off by them yesterday."], "Phrasal verbs keep their particle."],
  ["Passive of: 'You should have told me.'", "I should have been told by you.", ["I should be told by you.", "I should have told by you.", "I had been told by you."], "Modal perfect → should have been + past participle."],
];

export const MORE_SPEECH: Fill[] = [
  ["Indirect form: He said, \"I can swim.\"", "He said that he could swim.", ["He said that he can swim.", "He said that I could swim.", "He told that he could swim."], "After a past reporting verb, can becomes could."],
  ["Indirect form: She said, \"I met him yesterday.\"", "She said that she had met him the previous day.", ["She said that she met him yesterday.", "She said that she has met him the previous day.", "She told that she had met him yesterday."], "Past simple → past perfect; yesterday → the previous day."],
  ["Indirect form: The boy said, \"Please give me water.\"", "The boy requested to be given water.", ["The boy said please give me water.", "The boy ordered to give him water.", "The boy asked that please give water."], "Requests → requested (to)…"],
  ["Indirect form: He said to me, \"Did you see the match?\"", "He asked me if I had seen the match.", ["He asked me did I see the match.", "He asked me if I saw the match yesterday.", "He said me if I had seen the match."], "Yes/no question → asked if; past → past perfect."],
  ["Indirect form: Mother said, \"Wash your hands.\"", "Mother told me to wash my hands.", ["Mother told me wash my hands.", "Mother said me to wash my hands.", "Mother asked if I washed my hands."], "Commands → told + to."],
  ["Indirect form: She said, \"I am going to Delhi now.\"", "She said that she was going to Delhi then.", ["She said that she is going to Delhi now.", "She said that she was going to Delhi now.", "She told that she was going to Delhi then."], "am going → was going; now → then."],
  ["Indirect form: He said, \"May God bless you!\"", "He prayed that God might bless me.", ["He said may God bless me.", "He wished God bless me.", "He prayed God may bless you."], "Prayers → prayed that … might."],
  ["Indirect form: She said, \"I have been waiting for an hour.\"", "She said that she had been waiting for an hour.", ["She said that she has been waiting for an hour.", "She said that she was waiting for an hour.", "She told that she had been waiting for an hour."], "Present perfect continuous → past perfect continuous."],
];

export const MORE_PARAS: string[][] = [
  ["Priya woke up late on the exam day.", "She rushed out without breakfast.", "On the way, her bus broke down.", "Still, she reached the hall just in time."],
  ["Bees collect nectar from flowers.", "They carry it back to the hive.", "There it is turned into honey.", "The honey feeds the colony through winter."],
  ["The company launched a new app.", "Early users reported many bugs.", "The team fixed them within a week.", "Downloads then grew steadily."],
  ["Kiran saved a little money every month.", "After a year, he had enough for a laptop.", "He used it to learn programming online.", "Two years later, he got his first job as a developer."],
  ["The river flooded after heavy rain.", "Villagers moved to higher ground.", "Rescue teams brought food and medicine.", "When the water fell, people returned to rebuild."],
  ["Start by reading the passage once.", "Then read the questions carefully.", "Go back to find the lines that answer each question.", "Choose the option the passage supports, not your opinion."],
  ["A seed is planted in moist soil.", "It absorbs water and swells.", "A tiny shoot pushes up towards the light.", "Over weeks it grows into a young plant."],
  ["The team lost the first match badly.", "The coach changed their practice routine.", "They trained harder for a month.", "In the final, they won by a big margin."],
];

// [passage, questions: [q, correct, wrong[3], why]]
export const PASSAGES: [string, [string, string, string[], string][]][] = [
  [
    "Many people believe that multitasking makes them more productive. Research suggests the opposite. When we switch between tasks, the brain needs time to refocus, and these small delays add up. Studies have found that people who handle several tasks at once make more errors and take longer overall than those who finish one task before starting the next. The feeling of being busy is often mistaken for being productive. Experts recommend working in focused blocks, such as 25 minutes on a single task followed by a short break.",
    [
      ["What is the main idea of the passage?", "Multitasking usually reduces productivity.", ["Multitasking always improves productivity.", "Breaks waste time.", "The brain never needs to refocus."], "The passage argues that switching tasks costs time and accuracy."],
      ["According to the passage, why does switching tasks slow people down?", "The brain needs time to refocus.", ["People get bored.", "Computers are slow.", "Tasks become harder."], "Stated directly in the second and third sentences."],
      ["What does the passage say people often confuse?", "Being busy with being productive.", ["Breaks with work.", "Errors with speed.", "Research with opinion."], "'The feeling of being busy is often mistaken for being productive.'"],
      ["Which method do experts recommend?", "Working in focused blocks with short breaks.", ["Doing several tasks at once.", "Working without any breaks.", "Switching tasks every few minutes."], "The last sentence describes focused blocks."],
      ["The word 'overall' in the passage most nearly means…", "in total", ["partly", "rarely", "suddenly"], "'Take longer overall' means in total time."],
      ["The tone of the passage is best described as…", "informative", ["angry", "humorous", "sad"], "It explains research findings calmly."],
    ],
  ],
  [
    "India's railways carry more than twenty million passengers on an average day. Built mostly in the nineteenth century, the network has grown to over sixty thousand kilometres of track. For millions, trains are the cheapest way to travel long distances. In recent years, the railways have introduced online booking, faster trains on busy routes and cleaner stations. However, overcrowding on popular trains and delays during the monsoon remain common complaints.",
    [
      ["What is the passage mainly about?", "India's railway network, its improvements and problems.", ["The history of the monsoon.", "Air travel in India.", "How to book train tickets."], "It covers size, use, improvements and complaints."],
      ["Why do millions of people use trains, according to the passage?", "They are the cheapest way to travel long distances.", ["They are always on time.", "They are never crowded.", "They are faster than planes."], "Stated in the third sentence."],
      ["Which improvement is NOT mentioned?", "Free tickets for students.", ["Online booking.", "Faster trains on busy routes.", "Cleaner stations."], "Only free tickets are absent from the passage."],
      ["Which problem does the passage mention?", "Delays during the monsoon.", ["High ticket prices.", "Lack of tracks.", "Too few passengers."], "The last sentence names monsoon delays."],
      ["The word 'remain' in the last sentence means…", "continue to exist", ["disappear", "begin", "improve"], "The complaints are still present."],
      ["When was most of the network built?", "In the nineteenth century.", ["In the twenty-first century.", "Last year.", "During the monsoon."], "Stated in the second sentence."],
    ],
  ],
  [
    "Sleep is not just rest for the body; it is essential for learning. During deep sleep, the brain strengthens the memories formed during the day. Students who sleep well after studying remember more than those who stay up all night. Lack of sleep also affects attention and mood, making it harder to concentrate in class. Doctors advise teenagers to sleep eight to ten hours a night and to avoid screens before bed.",
    [
      ["What is the main idea of the passage?", "Good sleep helps learning and memory.", ["Screens improve sleep.", "Students should study all night.", "Sleep is only for the body."], "The passage links sleep to memory and attention."],
      ["What happens to memories during deep sleep?", "The brain strengthens them.", ["They are erased.", "They turn into dreams only.", "Nothing happens to them."], "Stated in the second sentence."],
      ["How much sleep do doctors advise for teenagers?", "Eight to ten hours a night.", ["Four to five hours.", "Twelve hours.", "As little as possible."], "Stated in the last sentence."],
      ["Which effect of poor sleep is mentioned?", "It makes concentrating harder.", ["It improves mood.", "It increases memory.", "It has no effect on attention."], "Lack of sleep affects attention and mood."],
      ["What does the passage suggest about staying up all night to study?", "It is less effective than sleeping after studying.", ["It is the best method.", "It improves attention.", "Doctors recommend it."], "Students who sleep remember more."],
      ["The word 'essential' most nearly means…", "necessary", ["optional", "harmful", "rare"], "Sleep is described as needed for learning."],
    ],
  ],
];

// cloze passages: [text with (1)..(5) blanks, answers]
export const CLOZE: [string, [string, string, string[], string][]][] = [
  [
    "Exercise is good for both the body and the mind. Even a short walk (1) ___ improve your mood. People who exercise regularly tend to sleep (2) ___ and feel less stressed. (3) ___, many people find it hard to start. Experts suggest beginning with small goals, such as ten minutes a day, and (4) ___ the time slowly. The key is to choose an activity you enjoy, (5) ___ you are more likely to keep doing it.",
    [
      ["Blank (1)", "can", ["cannot", "must not", "had"], "'Can improve' fits: a short walk is able to improve mood."],
      ["Blank (2)", "better", ["worse", "good", "best"], "A comparison: regular exercisers sleep better."],
      ["Blank (3)", "However", ["Therefore", "Because", "Moreover"], "Contrast: benefits, yet people find it hard to start."],
      ["Blank (4)", "increasing", ["increase", "increased", "increases"], "Parallel with 'beginning': beginning … and increasing."],
      ["Blank (5)", "because", ["although", "unless", "despite"], "The reason: enjoyment makes you continue."],
    ],
  ],
  [
    "Interviews can feel stressful, but preparation makes a big (1) ___. Start by researching the company so that you can explain (2) ___ you want to work there. Practise common questions aloud, and prepare short stories that (3) ___ your skills. On the day, arrive early and listen carefully (4) ___ answering. Finally, remember that the interview is also a chance for you to decide (5) ___ the job suits you.",
    [
      ["Blank (1)", "difference", ["different", "differ", "differently"], "'Make a difference' is the collocation; a noun is needed."],
      ["Blank (2)", "why", ["which", "who", "whom"], "You explain the reason: why."],
      ["Blank (3)", "show", ["shows", "showing", "shown"], "'Stories that show' (plural subject)."],
      ["Blank (4)", "before", ["after", "without", "instead"], "Listen first, then answer."],
      ["Blank (5)", "whether", ["unless", "although", "because"], "Deciding between two possibilities: whether."],
    ],
  ],
];
