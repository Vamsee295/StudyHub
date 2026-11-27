// Practice banks for word-based topics (verbal ability and judgment-type reasoning). Original content.
// Many banks are built from word lists, so each list entry becomes a question with options from the others.
import type { Level } from "./core";
import { CLOZE, MORE_ASSUMPTIONS, MORE_CONCLUSIONS, MORE_CORRECTION, MORE_FILL, MORE_PARAS, MORE_POS, MORE_SPEECH, MORE_SVA, MORE_TENSES, MORE_VOICE, PASSAGES } from "./verbal-extra";
import { CLOZE_3, MORE_COMPLETE, MORE_ERRORS, MORE_ESSENTIAL, MORE_IMPROVE, MORE_JUDGMENTS, MORE_ORDER, MORE_PARAS_2, MORE_SEQUENCES, MORE_TRUTH } from "./verbal-extra-2";
import { CLOZE_4, PASSAGES_3, SPEECH_3, VOICE_3 } from "./verbal-extra-3";

export interface BankQ { level: Level; q: string; o: string[]; e: string } // o[0] is correct

const lv = (i: number, n: number): Level => (i < n / 3 ? "Easy" : i < (2 * n) / 3 ? "Medium" : "Hard");

/** Turn a list into questions: options are the right item plus three others from the list. */
function fromList<T>(items: T[], make: (it: T, others: T[], i: number) => BankQ): BankQ[] {
  return items.map((it, i) => {
    const others = items.filter((_, k) => k !== i);
    const pick = [others[(i * 7 + 1) % others.length], others[(i * 7 + 4) % others.length], others[(i * 7 + 9) % others.length]];
    return make(it, [...new Set(pick)].length === 3 ? pick : others.slice(0, 3), i);
  });
}

// word, synonym, antonym (Easy → Hard)
const WORDS: [string, string, string][] = [
  ["happy", "joyful", "sad"], ["begin", "start", "end"], ["rapid", "quick", "slow"], ["brave", "courageous", "cowardly"], ["huge", "enormous", "tiny"],
  ["ancient", "old", "modern"], ["generous", "liberal", "stingy"], ["honest", "truthful", "deceitful"], ["abundant", "plentiful", "scarce"], ["fragile", "delicate", "sturdy"],
  ["diligent", "hard-working", "lazy"], ["candid", "frank", "evasive"], ["prudent", "wise", "reckless"], ["obscure", "unclear", "evident"], ["hostile", "unfriendly", "amicable"],
  ["lucid", "clear", "confusing"], ["meticulous", "careful", "careless"], ["benevolent", "kind", "malevolent"], ["frugal", "thrifty", "extravagant"], ["tranquil", "calm", "agitated"],
  ["verbose", "wordy", "concise"], ["ephemeral", "short-lived", "permanent"], ["ambiguous", "vague", "explicit"], ["affluent", "wealthy", "poor"], ["candour", "openness", "secrecy"],
  ["obstinate", "stubborn", "flexible"], ["pragmatic", "practical", "idealistic"], ["zealous", "eager", "apathetic"], ["mitigate", "lessen", "aggravate"], ["laconic", "brief", "talkative"],
  ["exacerbate", "worsen", "alleviate"], ["innocuous", "harmless", "harmful"], ["ubiquitous", "everywhere", "rare"], ["gregarious", "sociable", "reclusive"], ["impeccable", "flawless", "faulty"],
];

const ONE_WORD: [string, string][] = [
  ["A person who loves books", "bibliophile"], ["Fear of heights", "acrophobia"], ["One who cannot read or write", "illiterate"], ["A speech made without preparation", "extempore"],
  ["A person who walks in their sleep", "somnambulist"], ["Government by the people", "democracy"], ["A place where birds are kept", "aviary"], ["Something that can't be seen", "invisible"],
  ["One who looks on the bright side", "optimist"], ["One who believes in no god", "atheist"], ["Killing of a king", "regicide"], ["A life story written by oneself", "autobiography"],
  ["Words written on a tombstone", "epitaph"], ["One who knows many languages", "polyglot"], ["Something that can't be corrected", "incorrigible"], ["A cure for all ills", "panacea"],
  ["A person who eats no animal products", "vegan"], ["Study of the human mind", "psychology"], ["Animals that eat only plants", "herbivores"], ["A group of ships", "fleet"],
  ["Fit to be eaten", "edible"], ["A person who hates mankind", "misanthrope"], ["Rule by a few people", "oligarchy"], ["That which can't be avoided", "inevitable"],
  ["A word that means the opposite", "antonym"], ["One who is new to a field", "novice"], ["A handwriting that can't be read", "illegible"], ["A list of books referred to", "bibliography"],
  ["Done in secret", "clandestine"], ["Lasting only a short time", "transient"],
];

const IDIOMS: [string, string][] = [
  ["break the ice", "start a conversation in an awkward situation"], ["call it a day", "stop working for now"], ["once in a blue moon", "hardly ever"], ["a piece of cake", "no trouble at all"],
  ["under the weather", "slightly ill"], ["spill the beans", "reveal a secret"], ["hit the nail on the head", "describe exactly what's right"], ["burn the midnight oil", "work late into the night"],
  ["cost an arm and a leg", "cost a lot"], ["let the cat out of the bag", "reveal a secret by mistake"], ["see eye to eye", "agree"], ["beat around the bush", "avoid saying something directly"],
  ["bite the bullet", "face something unpleasant bravely"], ["cut corners", "do something cheaply or badly"], ["in hot water", "in trouble"], ["a blessing in disguise", "something good that first seemed bad"],
  ["the ball is in your court", "it's your decision now"], ["turn a blind eye", "deliberately ignore"], ["add fuel to the fire", "make a bad situation worse"], ["red tape", "excessive official rules"],
  ["white elephant", "a costly but useless possession"], ["Achilles' heel", "a weak point"], ["by leaps and bounds", "rapidly"], ["bone of contention", "the subject of a dispute"],
  ["smell a rat", "suspect something is wrong"], ["throw in the towel", "give up"], ["sit on the fence", "avoid taking sides"], ["a wild goose chase", "a hopeless search"],
  ["face the music", "accept the consequences"], ["rest on one's laurels", "stop trying because of past success"],
];

// correct spelling first, then three misspellings
const SPELL: string[][] = [
  ["receive", "recieve", "receeve", "receve"], ["separate", "seperate", "separete", "seperete"], ["definitely", "definately", "definitly", "defenitely"], ["necessary", "neccessary", "necesary", "neccesary"],
  ["occasion", "ocassion", "occassion", "ocasion"], ["accommodate", "accomodate", "acommodate", "acomodate"], ["embarrass", "embarass", "embarras", "emberrass"], ["beginning", "begining", "beggining", "beginnig"],
  ["believe", "beleive", "belive", "beleave"], ["environment", "enviroment", "envirnment", "environmant"], ["government", "goverment", "govenment", "governmant"], ["occurrence", "occurence", "ocurrence", "occurance"],
  ["privilege", "priviledge", "privilage", "privelege"], ["recommend", "recomend", "reccommend", "reccomend"], ["committee", "commitee", "comittee", "committe"], ["conscience", "concience", "conscence", "consience"],
  ["guarantee", "garantee", "guarentee", "gaurantee"], ["maintenance", "maintainance", "maintenence", "maintanance"], ["millennium", "millenium", "milennium", "millenneum"], ["questionnaire", "questionaire", "questionnair", "questionnare"],
  ["rhythm", "rythm", "rhythem", "rhytm"], ["acquaintance", "aquaintance", "acquaintence", "acquantance"], ["bureaucracy", "beaurocracy", "bureacracy", "burocracy"], ["entrepreneur", "entrepeneur", "enterpreneur", "entrepreneure"],
  ["exaggerate", "exagerate", "exxagerate", "exaggarate"], ["harass", "harrass", "haras", "harras"], ["liaison", "liasion", "liason", "liaision"], ["perseverance", "perseverence", "perserverance", "persevarance"],
  ["pronunciation", "pronounciation", "pronunsiation", "pronunciaton"], ["supersede", "supercede", "superseed", "supersed"],
];

// A : B :: C : D (D first among options)
const ANALOGIES: [string, string, string, string, string[], string][] = [
  ["Bird", "Nest", "Bee", "Hive", ["Honey", "Flower", "Wing"], "a home"], ["Pen", "Write", "Knife", "Cut", ["Sharp", "Steel", "Kitchen"], "an object and its use"],
  ["Doctor", "Hospital", "Teacher", "School", ["Book", "Student", "Lesson"], "a worker and their workplace"], ["Hot", "Cold", "Tall", "Short", ["High", "Long", "Big"], "opposites"],
  ["Puppy", "Dog", "Kitten", "Cat", ["Milk", "Mouse", "Pet"], "young one and adult"], ["Eye", "See", "Ear", "Hear", ["Sound", "Head", "Listen to music"], "an organ and its function"],
  ["Water", "Thirst", "Food", "Hunger", ["Taste", "Plate", "Cook"], "what satisfies a need"], ["Author", "Book", "Composer", "Symphony", ["Piano", "Orchestra", "Song lyrics"], "creator and creation"],
  ["Cow", "Calf", "Horse", "Foal", ["Pony", "Stable", "Mare"], "animal and its young"], ["Wheel", "Car", "Wing", "Aeroplane", ["Feather", "Sky", "Pilot"], "part and whole"],
  ["Thermometer", "Temperature", "Barometer", "Pressure", ["Weather", "Rain", "Height"], "instrument and what it measures"], ["Lion", "Roar", "Dog", "Bark", ["Bite", "Tail", "Howl"], "animal and its sound"],
  ["Ink", "Pen", "Paint", "Brush", ["Colour", "Wall", "Canvas"], "what a tool applies"], ["Seed", "Tree", "Egg", "Bird", ["Nest", "Shell", "Chick feed"], "start and grown form"],
  ["Mason", "Wall", "Tailor", "Clothes", ["Needle", "Shop", "Thread"], "worker and product"], ["Cricket", "Bat", "Tennis", "Racket", ["Ball", "Net", "Court"], "game and the tool used to hit"],
  ["Flock", "Sheep", "Pack", "Wolves", ["Cattle", "Fish", "Bees"], "group and its members"], ["India", "Rupee", "Japan", "Yen", ["Dollar", "Tokyo", "Euro"], "country and currency"],
  ["Microscope", "Small", "Telescope", "Distant", ["Large", "Star", "Lens"], "instrument and what it helps see"], ["Library", "Books", "Museum", "Artefacts", ["Visitors", "Guide", "Tickets"], "place and what it keeps"],
];

// [correct sentence chunks in order] → ordering questions
const ORDER_SENTENCES: string[][] = [
  ["The students", "completed the project", "before the deadline", "despite the rain"], ["Regular practice", "improves your speed", "in aptitude tests", "more than anything else"],
  ["She opened the window", "to let in", "the cool breeze", "of the evening"], ["The manager", "praised the team", "for its hard work", "during the review"],
  ["Most companies", "hold an online test", "before the", "technical interview"], ["Reading newspapers", "every morning", "builds vocabulary", "over time"],
  ["The train", "left the station", "exactly at", "seven o'clock"], ["Good communication", "is as important", "as technical skill", "in any job"],
  ["He forgot", "to bring", "his admit card", "to the exam hall"], ["The old bridge", "was repaired", "by the engineers", "last summer"],
  ["Our team", "won the match", "in the", "final over"], ["Please submit", "your assignment", "by Friday", "at the latest"],
];

// paragraphs of four sentences in the right order
const PARAS: string[][] = [
  ["Ravi wanted to crack his placement test.", "He made a study plan for six weeks.", "Every day he solved twenty aptitude questions.", "By the end, his scores had doubled."],
  ["Plants need sunlight to make food.", "This process is called photosynthesis.", "It takes in carbon dioxide and water.", "As a result, plants release oxygen."],
  ["The shop opened at nine.", "Customers began arriving soon after.", "By noon, the shelves were almost empty.", "The owner decided to reorder stock."],
  ["Rain had fallen all night.", "The roads were flooded by morning.", "Schools announced a holiday.", "Children stayed home and played indoors."],
  ["First, read the question carefully.", "Next, note what is given and what is asked.", "Then choose a method and solve.", "Finally, check your answer against the options."],
  ["Meera joined a coding club in college.", "There she met seniors preparing for interviews.", "They shared tips and mock tests with her.", "Soon she felt ready for her own interviews."],
  ["The phone rang late at night.", "Arjun answered it sleepily.", "It was his friend with good news.", "He had got the job they both applied for."],
  ["Water is heated in the boiler.", "It turns into steam under pressure.", "The steam spins a turbine.", "The turbine drives a generator that makes electricity."],
];

const letters = ["P", "Q", "R", "S"];
function orderQuestions(items: string[][], sentence: boolean): BankQ[] {
  return items.map((parts, i) => {
    // fixed shuffle of the parts per item
    const shown = [1, 3, 0, 2].map((k) => parts[(k + i) % 4]);
    const correct = parts.map((p) => letters[shown.indexOf(p)]).join("");
    const wrong = [correct.split("").reverse().join(""), correct.slice(1) + correct[0], correct[1] + correct[0] + correct.slice(2)].filter((w) => w !== correct);
    const extra = ["PQRS", "SRQP", "QPSR", "RSPQ"].filter((w) => w !== correct && !wrong.includes(w));
    return {
      level: lv(i, items.length),
      q: `Arrange the ${sentence ? "sentences" : "parts"} in the right order:\n${shown.map((p, k) => `${letters[k]}. ${p}`).join("\n")}`,
      o: [correct, ...[...wrong, ...extra].slice(0, 3)],
      e: `The ${sentence ? "story" : "sentence"} reads: ${parts.join(sentence ? " " : " ")}${sentence ? "" : "."}`,
    };
  });
}

// fill-in banks: sentence with ___, correct, three wrong, why
type Fill = [string, string, string[], string];
const fills = (xs: Fill[]): BankQ[] => xs.map(([q, c, w, e], i) => ({ level: lv(i, xs.length), q, o: [c, ...w], e }));

const ARTICLES_PREPS: Fill[] = [
  ["She waited for ___ hour.", "an", ["a", "the", "no article"], "Hour starts with a vowel sound (silent h)."], ["He is ___ European writer.", "a", ["an", "the", "no article"], "European starts with a 'y' sound."],
  ["The meeting is ___ Monday.", "on", ["in", "at", "by"], "Days and dates take 'on' (on Monday, on 5 May)."], ["I was born ___ 2004.", "in", ["on", "at", "since"], "Years take 'in'."],
  ["The train arrives ___ 6 pm.", "at", ["on", "in", "by"], "Clock times take 'at'."], ["___ Ganga is a holy river.", "The", ["A", "An", "No article"], "Rivers take 'the'."],
  ["She is good ___ maths.", "at", ["in", "on", "with"], "The fixed pair is 'good at'."], ["He is senior ___ me.", "to", ["than", "from", "over"], "Senior and junior take 'to'."],
  ["I prefer tea ___ coffee.", "to", ["than", "over", "from"], "The pattern is 'prefer X to Y'."], ["She has lived here ___ 2019.", "since", ["for", "from", "by"], "since + a point in time."],
  ["He has worked here ___ five years.", "for", ["since", "from", "by"], "for + a length of time."], ["The book is ___ the table.", "on", ["in", "at", "into"], "Use 'on' for something resting on a surface."],
  ["We reached ___ time for the show.", "in", ["on", "at", "by"], "'In time' means early enough."], ["He is afraid ___ dogs.", "of", ["from", "with", "by"], "The fixed pair is 'afraid of'."],
  ["___ honesty is the best policy.", "No article", ["The", "An", "A"], "Abstract nouns used generally take no article."], ["She is interested ___ music.", "in", ["on", "at", "for"], "The fixed pair is 'interested in'."],
  ["It's ___ unique opportunity.", "a", ["an", "the", "no article"], "Unique starts with a 'y' sound."], ["He was married ___ a doctor.", "to", ["with", "by", "from"], "The fixed pair is 'married to'."],
  ["___ sun rises in the east.", "The", ["A", "An", "No article"], "Unique things take 'the'."], ["The decision depends ___ you.", "on", ["of", "from", "at"], "The fixed pair is 'depend on'."],
];

const SVA: Fill[] = [
  ["Each of the students ___ a laptop.", "has", ["have", "are having", "were having"], "'Each' is singular."], ["Neither the teacher nor the students ___ present.", "were", ["was", "is", "has been"], "With neither…nor, the verb agrees with the nearer subject (students)."],
  ["The news ___ good today.", "is", ["are", "were", "have been"], "'News' is singular."], ["Bread and butter ___ my breakfast.", "is", ["are", "were", "have"], "A single dish joined by 'and' takes a singular verb."],
  ["The team ___ practising hard.", "is", ["are", "were", "have"], "A collective noun acting as one unit is singular."], ["One of my friends ___ in Delhi.", "lives", ["live", "are living", "have lived"], "The subject is 'one', singular."],
  ["Mathematics ___ my favourite subject.", "is", ["are", "were", "have been"], "Subjects ending in -ics are singular."], ["The number of applicants ___ grown.", "has", ["have", "are", "were"], "'The number of' is singular; 'a number of' is plural."],
  ["A number of students ___ absent.", "were", ["was", "is", "has been"], "'A number of' means many: plural."], ["Either you or he ___ to go.", "has", ["have", "are", "were"], "The verb agrees with the nearer subject, 'he'."],
  ["Ten kilometres ___ a long walk.", "is", ["are", "were", "have been"], "A distance as one amount is singular."], ["The scissors ___ on the table.", "are", ["is", "was", "has been"], "'Scissors' is plural."],
  ["Everyone ___ invited.", "was", ["were", "are", "have been"], "'Everyone' is singular."], ["The quality of the apples ___ poor.", "was", ["were", "are", "have been"], "The subject is 'quality', not 'apples'."],
  ["My brother, along with his friends, ___ coming.", "is", ["are", "were", "have"], "'Along with' doesn't add to the subject."],
];

const TENSES: Fill[] = [
  ["She ___ to school every day.", "goes", ["go", "is going", "went"], "Habits use the present simple."], ["Look! It ___.", "is raining", ["rains", "rained", "has rained"], "An action happening now: present continuous."],
  ["I ___ my homework already.", "have finished", ["finished", "finish", "am finishing"], "'Already' with a result now: present perfect."], ["He ___ in Delhi since 2018.", "has lived", ["lives", "lived", "is living"], "'Since' + a continuing state: present perfect."],
  ["When I arrived, the film ___.", "had started", ["started", "has started", "starts"], "An earlier past action: past perfect."], ["We ___ dinner when the lights went out.", "were having", ["had", "have", "are having"], "An action in progress in the past: past continuous."],
  ["By next year, I ___ my degree.", "will have completed", ["will complete", "complete", "completed"], "Finished before a future time: future perfect."], ["If it rains, we ___ at home.", "will stay", ["stayed", "would stay", "stay"], "First conditional: if + present, will + verb."],
  ["She ___ the answer yesterday.", "knew", ["knows", "has known", "know"], "'Yesterday' takes the past simple."], ["They ___ for two hours when help came.", "had been waiting", ["waited", "were waiting", "have waited"], "Duration up to a past moment: past perfect continuous."],
  ["The sun ___ in the east.", "rises", ["rose", "is rising", "has risen"], "Universal truths use the present simple."], ["I ___ you tomorrow.", "will call", ["called", "call", "have called"], "A future plan or promise."],
  ["If I were you, I ___ apologise.", "would", ["will", "shall", "am"], "Second conditional: if + past, would + verb."], ["He ___ never seen snow.", "has", ["have", "is", "was"], "Present perfect with 'never'."],
  ["While she ___, the phone rang.", "was cooking", ["cooked", "cooks", "has cooked"], "Background action in progress: past continuous."],
];

const POS: Fill[] = [
  ["In 'She runs fast', 'fast' is a…", "adverb", ["adjective", "noun", "verb"], "It describes how she runs."], ["In 'a fast car', 'fast' is a…", "adjective", ["adverb", "noun", "verb"], "It describes the car."],
  ["In 'Honesty pays', 'honesty' is a…", "noun", ["adjective", "verb", "adverb"], "It names a quality."], ["In 'He sings well', 'well' is a…", "adverb", ["adjective", "noun", "preposition"], "It tells how he sings."],
  ["In 'The book is on the table', 'on' is a…", "preposition", ["adverb", "conjunction", "noun"], "It shows position."], ["In 'I like tea but not coffee', 'but' is a…", "conjunction", ["preposition", "adverb", "pronoun"], "It joins two ideas."],
  ["In 'Wow, that's great!', 'wow' is an…", "interjection", ["adverb", "adjective", "noun"], "It expresses a sudden feeling."], ["In 'They arrived late', 'they' is a…", "pronoun", ["noun", "adjective", "adverb"], "It replaces a noun."],
  ["In 'She is beautiful', 'beautiful' is an…", "adjective", ["adverb", "noun", "verb"], "It describes her."], ["In 'He quickly left', 'left' is a…", "verb", ["noun", "adjective", "adverb"], "It's the action."],
  ["In 'Swimming is fun', 'swimming' is a…", "noun (gerund)", ["verb", "adjective", "adverb"], "An -ing word used as a subject is a gerund, which acts as a noun."], ["In 'the running water', 'running' is an…", "adjective (participle)", ["noun", "verb", "adverb"], "It describes the water."],
];

const CORRECTION: Fill[] = [
  ["Choose the correct sentence.", "He doesn't know the answer.", ["He don't know the answer.", "He not know the answer.", "He doesn't knows the answer."], "Third person singular: doesn't + base verb."],
  ["Choose the correct sentence.", "I have been working here for three years.", ["I am working here since three years.", "I have been working here since three years.", "I work here from three years."], "Duration takes 'for' with the present perfect continuous."],
  ["Choose the correct sentence.", "Neither of them was ready.", ["Neither of them were ready.", "Neither of them are ready.", "Neither of them have been ready."], "'Neither of' takes a singular verb."],
  ["Choose the correct sentence.", "She is taller than I am.", ["She is more taller than me.", "She is taller then me.", "She is most tall than I."], "No double comparatives; 'than', not 'then'."],
  ["Choose the correct sentence.", "We discussed the plan.", ["We discussed about the plan.", "We discussed on the plan.", "We had discussed about the plan."], "'Discuss' takes its object directly."],
  ["Choose the correct sentence.", "Hardly had I reached when it began to rain.", ["Hardly I had reached when it began to rain.", "Hardly had I reached than it began to rain.", "Hardly I reached when it began to rain."], "'Hardly' at the start inverts the verb and pairs with 'when'."],
  ["Choose the correct sentence.", "The furniture in this room is new.", ["The furnitures in this room are new.", "The furniture in this room are new.", "The furnitures in this room is new."], "'Furniture' is uncountable and singular."],
  ["Choose the correct sentence.", "One should do one's duty.", ["One should do his duty.", "One should do their duty.", "One should do your duty."], "'One' pairs with 'one's' in formal English."],
  ["Choose the correct sentence.", "He is one of the best players who have played for India.", ["He is one of the best player who has played for India.", "He is one of the best players who has played for India.", "He is one of best players who have played for India."], "'Who' refers to 'players' (plural), so 'have'."],
  ["Choose the correct sentence.", "Unless you work hard, you will fail.", ["Unless you will work hard, you will fail.", "Unless you don't work hard, you will fail.", "Unless you worked hard, you will fail."], "'Unless' already means 'if not'; no future tense after it."],
  ["Choose the correct sentence.", "No sooner did he arrive than the meeting began.", ["No sooner did he arrive when the meeting began.", "No sooner he arrived than the meeting began.", "No sooner did he arrived than the meeting began."], "'No sooner' pairs with 'than' and inverts the verb."],
  ["Choose the correct sentence.", "I look forward to meeting you.", ["I look forward to meet you.", "I look forward for meeting you.", "I am looking forward to meet you."], "'Look forward to' takes an -ing form."],
];

const ERRORS: Fill[] = [
  ["Find the part with the error: (a) Each of the boys / (b) have finished / (c) their work / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "'Each' is singular: 'has finished'."],
  ["Find the part with the error: (a) She has been / (b) living here / (c) since five years / (d) no error", "(c)", ["(a)", "(b)", "(d)"], "A length of time needs 'for five years'."],
  ["Find the part with the error: (a) The informations / (b) you gave / (c) were useful / (d) no error", "(a)", ["(b)", "(c)", "(d)"], "'Information' is uncountable: 'The information … was useful'."],
  ["Find the part with the error: (a) He is / (b) senior than / (c) all of us / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "Senior and junior take 'to', not 'than': senior to."],
  ["Find the part with the error: (a) We discussed / (b) about the matter / (c) for an hour / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "'Discuss' takes no 'about'."],
  ["Find the part with the error: (a) The team / (b) is playing / (c) well this season / (d) no error", "(d)", ["(a)", "(b)", "(c)"], "The sentence is correct: the team acts as one unit."],
  ["Find the part with the error: (a) If I was you / (b) I would / (c) take the offer / (d) no error", "(a)", ["(b)", "(c)", "(d)"], "Hypothetical conditions use 'If I were you'."],
  ["Find the part with the error: (a) She prefers / (b) reading than / (c) watching TV / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "'Prefer X to Y': 'reading to watching'."],
  ["Find the part with the error: (a) My friend and / (b) myself went / (c) to the market / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "Use 'I', not 'myself', as a subject."],
  ["Find the part with the error: (a) The number of / (b) students have / (c) increased this year / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "'The number of' is singular: 'has'."],
  ["Find the part with the error: (a) I am / (b) knowing him / (c) for years / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "'Know' isn't used in continuous forms: 'I have known him for years'."],
  ["Find the part with the error: (a) He gave me / (b) an useful / (c) piece of advice / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "'Useful' starts with a 'y' sound: 'a useful'."],
];

const IMPROVE: Fill[] = [
  ["Improve the part in capitals: 'He insisted ON TO GO alone.'", "on going", ["to go", "for going", "No improvement"], "'Insist on' + -ing."], ["Improve: 'I WOULD HAVE HELPED you if you had asked.'", "No improvement", ["will help", "would help", "had helped"], "Third conditional is already correct."],
  ["Improve: 'She is VERY MUCH CLEVER.'", "very clever", ["much clever", "more clever", "No improvement"], "'Very' goes with adjectives; 'much' doesn't."], ["Improve: 'He did not came to class.'", "did not come", ["does not came", "not came", "No improvement"], "After 'did', use the base verb."],
  ["Improve: 'We have got ENOUGH OF TIME.'", "enough time", ["time enough of", "enough the time", "No improvement"], "'Enough' + noun, with no 'of'."], ["Improve: 'The police HAS ARRESTED the thief.'", "have arrested", ["is arresting", "had arrest", "No improvement"], "'Police' takes a plural verb."],
  ["Improve: 'I am used TO WAKE up early.'", "to waking", ["to woke", "for waking", "No improvement"], "'Be used to' + -ing."], ["Improve: 'Hardly she had left WHEN it rained.'", "had she left when", ["she had left than", "had she left than", "No improvement"], "'Hardly' at the start inverts and pairs with 'when'."],
  ["Improve: 'He is THE MOST TALLEST boy.'", "the tallest", ["most tallest", "the more tall", "No improvement"], "No double superlatives."], ["Improve: 'Let us DISCUSS ABOUT the plan.'", "discuss", ["discussing about", "discussion", "No improvement"], "'Discuss' takes its object directly."],
];

const VOICE: Fill[] = [
  ["Passive of: 'She writes a letter.'", "A letter is written by her.", ["A letter was written by her.", "A letter has been written by her.", "A letter is being written by her."], "Present simple → is / are + past participle."],
  ["Passive of: 'They are building a bridge.'", "A bridge is being built by them.", ["A bridge is built by them.", "A bridge was being built by them.", "A bridge has been built by them."], "Present continuous → is being + past participle."],
  ["Passive of: 'He has finished the work.'", "The work has been finished by him.", ["The work is finished by him.", "The work had been finished by him.", "The work was finished by him."], "Present perfect → has been + past participle."],
  ["Passive of: 'The cat killed the rat.'", "The rat was killed by the cat.", ["The rat is killed by the cat.", "The rat has been killed by the cat.", "The rat had killed the cat."], "Past simple → was + past participle."],
  ["Passive of: 'Close the door.'", "Let the door be closed.", ["The door is closed.", "The door should close.", "Let close the door."], "Commands → Let + object + be + past participle."],
  ["Passive of: 'Who broke the vase?'", "By whom was the vase broken?", ["Who was the vase broken?", "By whom is the vase broken?", "The vase was broken by who?"], "Who → by whom, past simple."],
  ["Passive of: 'You must obey the rules.'", "The rules must be obeyed by you.", ["The rules must obey by you.", "The rules must have obeyed by you.", "The rules are obeyed by you."], "Modal → modal + be + past participle."],
  ["Passive of: 'Did she cook dinner?'", "Was dinner cooked by her?", ["Is dinner cooked by her?", "Did dinner cooked by her?", "Has dinner been cooked by her?"], "Did … ? → Was / Were … past participle?"],
  ["Passive of: 'People say that he is rich.'", "It is said that he is rich.", ["It said that he is rich.", "He said to be rich.", "It is saying that he is rich."], "Reporting verbs: It is said that…"],
  ["Passive of: 'They will announce the results tomorrow.'", "The results will be announced tomorrow.", ["The results will announce tomorrow.", "The results would be announced tomorrow.", "The results are announced tomorrow."], "Future → will be + past participle."],
];

const SPEECH: Fill[] = [
  ["Indirect form: He said, \"I am tired.\"", "He said that he was tired.", ["He said that he is tired.", "He said that I was tired.", "He told that he was tired."], "Past reporting verb: am → was; I → he."],
  ["Indirect form: She said, \"I will come tomorrow.\"", "She said that she would come the next day.", ["She said that she will come tomorrow.", "She said that she would come tomorrow.", "She told that she would come the next day."], "will → would; tomorrow → the next day."],
  ["Indirect form: He said to me, \"Where do you live?\"", "He asked me where I lived.", ["He asked me where did I live.", "He asked me where do I live.", "He said me where I lived."], "Questions use statement order after the wh-word."],
  ["Indirect form: The teacher said, \"Sit down.\"", "The teacher told us to sit down.", ["The teacher said us to sit down.", "The teacher told us sit down.", "The teacher asked that we sat down."], "Commands → told + to + verb."],
  ["Indirect form: She said, \"Don't be late.\"", "She told me not to be late.", ["She told me don't be late.", "She said me not to be late.", "She told me to not being late."], "Negative commands → told + not to."],
  ["Indirect form: He said, \"The earth is round.\"", "He said that the earth is round.", ["He said that the earth was round.", "He said that the earth had been round.", "He told that the earth is round."], "Universal truths keep their tense."],
  ["Indirect form: She said to him, \"Are you busy?\"", "She asked him if he was busy.", ["She asked him if he is busy.", "She asked him was he busy.", "She said him if he was busy."], "Yes/no questions → asked if / whether."],
  ["Indirect form: He said, \"I have finished my work.\"", "He said that he had finished his work.", ["He said that he has finished his work.", "He said that he finished his work.", "He said that I had finished my work."], "has / have done → had done."],
  ["Indirect form: She said, \"Let's go out.\"", "She suggested that they should go out.", ["She said let's go out.", "She told to go out.", "She ordered them going out."], "'Let's' → suggested that … should."],
  ["Indirect form: He said, \"What a lovely day!\"", "He exclaimed that it was a lovely day.", ["He said what a lovely day it is.", "He asked what a lovely day.", "He exclaimed what a lovely day was it."], "Exclamations → exclaimed that…"],
];

const FILL_WORDS: Fill[] = [
  ["The scientist made an important ___ in the field of medicine.", "discovery", ["discover", "discovered", "discovering"], "After 'an important', a noun is needed."], ["Despite the rain, the match ___ on time.", "began", ["begun", "begin", "beginning"], "Past simple of 'begin'."],
  ["Her ___ to detail made her an excellent editor.", "attention", ["attend", "attentive", "attending"], "A noun after the possessive 'her'."], ["The new policy will ___ thousands of farmers.", "benefit", ["beneficial", "benefited", "beneficiary"], "A verb after 'will'."],
  ["He was ___ for his rude behaviour.", "reprimanded", ["rewarded", "praised", "promoted"], "Rude behaviour leads to a scolding."], ["The two friends had a ___ argument and stopped talking.", "bitter", ["sweet", "gentle", "friendly"], "'Stopped talking' signals a harsh argument."],
  ["The company ___ a profit for the first time this year.", "made", ["did", "took", "gave"], "The collocation is 'make a profit'."], ["Please ___ attention to the instructions.", "pay", ["give", "make", "take"], "The collocation is 'pay attention'."],
  ["She ___ a decision after much thought.", "made", ["did", "took on", "gave"], "The collocation is 'make a decision' ('take a decision' is also used in Indian English, but 'made' is the safe choice)."], ["The evidence was ___, so the case was dismissed.", "insufficient", ["abundant", "conclusive", "strong"], "A case is dismissed when evidence falls short."],
  ["He is so ___ that he never shares his things.", "selfish", ["generous", "kind", "humble"], "Never sharing signals selfishness."], ["The medicine had an immediate ___ on the patient.", "effect", ["affect", "effort", "affection"], "'Effect' is the noun; 'affect' is usually a verb."],
];

const COMPLETE: Fill[] = [
  ["Although he studied hard, …", "he could not clear the exam", ["he cleared the exam easily", "he therefore passed", "because he was clever"], "'Although' introduces a contrast with what follows."], ["Because it was raining heavily, …", "the match was postponed", ["the sun was shining", "the players were happy to play", "although they won"], "'Because' needs a result that follows from heavy rain."],
  ["Unless you leave now, …", "you will miss the train", ["you will catch the train early", "you missed the train", "because the train is late"], "'Unless' means 'if not': if you don't leave, you'll miss it."], ["Not only did she win the race, …", "but she also set a new record", ["and she lost the race", "or she gave up", "so she won"], "'Not only' pairs with 'but also'."],
  ["The more you practise, …", "the better you become", ["the worse you become", "you become better", "and better"], "'The more…, the better…' is a fixed pattern."], ["He was so tired that …", "he fell asleep at once", ["he was very energetic", "so he slept", "because he slept"], "'So … that' gives a result."],
  ["No sooner had the bell rung …", "than the students rushed out", ["when the students rushed out", "then the students rushed out", "the students rushed out"], "'No sooner' pairs with 'than'."], ["Since the shop was closed, …", "we went home", ["we bought everything", "it was open", "although we shopped"], "'Since' here means 'because'."],
];

// statements and conclusions / assumptions / judgments: [question, correct, wrong[3], why]
const CONCLUSIONS: Fill[] = [
  ["Statement: All the students who scored above 90% got scholarships. Ravi scored 95%. Conclusion?", "Ravi got a scholarship.", ["Ravi didn't get a scholarship.", "Only Ravi got a scholarship.", "Nothing can be concluded."], "Ravi belongs to the group that got scholarships."],
  ["Statement: The library is closed on Sundays. Today the library is open. Conclusion?", "Today is not Sunday.", ["Today is Monday.", "Today is Sunday.", "The library is always open."], "If it were Sunday, it would be closed."],
  ["Statement: Some mangoes are sour. Conclusion?", "Not all mangoes are sweet.", ["All mangoes are sour.", "No mango is sweet.", "Most mangoes are sour."], "'Some are sour' means not every mango is sweet."],
  ["Statement: Smoking is injurious to health. Conclusion?", "Smoking can harm people's health.", ["Non-smokers never fall ill.", "All smokers die young.", "Smoking is illegal."], "Only the first restates the statement without adding extremes."],
  ["Statement: The government has raised the price of petrol. Conclusion?", "Petrol will cost consumers more.", ["People will stop driving.", "The government wants fewer cars.", "Petrol will become scarce."], "Higher price means higher cost; the others go beyond the statement."],
  ["Statement: Only graduates can apply for the post. Meera applied. Conclusion?", "Meera is a graduate.", ["Meera is a postgraduate.", "Meera will get the post.", "Meera is not a graduate."], "Applicants must be graduates."],
  ["Statement: Every player in the team is fit. Arjun is in the team. Conclusion?", "Arjun is fit.", ["Arjun is the captain.", "Arjun is the fittest.", "Arjun may be unfit."], "Arjun is one of 'every player'."],
  ["Statement: The bus is late by 20 minutes every day this week. Conclusion?", "The bus has been running late this week.", ["The driver is careless.", "The bus will be late forever.", "The bus company will shut down."], "Only the first stays within the facts."],
  ["Statement: No fruit in the basket is rotten. Conclusion?", "All fruits in the basket are fit to eat in terms of rot.", ["Some fruits are rotten.", "The basket is new.", "All fruits are ripe."], "'No fruit is rotten' means every fruit is free of rot; ripeness isn't mentioned."],
  ["Statement: Most students in the class like cricket. Conclusion?", "Some students in the class like cricket.", ["All students like cricket.", "No student likes football.", "Cricket is the best sport."], "'Most' guarantees at least some."],
];

const ASSUMPTIONS: Fill[] = [
  ["\"Use our app to learn coding faster.\" Which is implicit?", "People want to learn coding faster.", ["Other apps teach nothing.", "Everyone already codes.", "Coding is the only skill worth learning."], "The advert assumes there's demand for faster learning."],
  ["\"Please carry your ID card to the exam.\" Which is implicit?", "ID cards will be checked at the exam.", ["Everyone has lost their ID card.", "The exam is cancelled.", "Only toppers need ID cards."], "Asking to carry it assumes it will be needed."],
  ["\"The city will build a new flyover to reduce traffic jams.\" Which is implicit?", "A flyover can help reduce traffic jams.", ["The city has no roads.", "Traffic jams will end forever.", "Nobody uses public transport."], "The plan assumes the flyover helps."],
  ["\"Book your tickets early to avoid disappointment.\" Which is implicit?", "Tickets may sell out.", ["Tickets are free.", "Nobody wants tickets.", "Tickets can only be bought on the day."], "Booking early avoids missing out only if tickets can run out."],
  ["\"Switch off the lights when you leave the room.\" Which is implicit?", "Saving electricity matters.", ["Lights never work.", "Nobody uses the room.", "Electricity is free."], "The request assumes waste should be avoided."],
  ["\"The school has made yoga compulsory to improve students' health.\" Which is implicit?", "Yoga can improve health.", ["Students are all unhealthy.", "Only yoga improves health.", "Students dislike yoga."], "The decision rests on yoga helping health."],
  ["\"If you want to clear the interview, practise mock interviews.\" Which is implicit?", "Mock interviews help with real ones.", ["Everyone fails interviews.", "Only mock interviews matter.", "Interviews are always easy."], "The advice assumes practice transfers."],
  ["\"The company is hiring 1,000 freshers this year.\" Which is implicit?", "The company expects work for the new hires.", ["The company will hire no one next year.", "Freshers are better than experienced staff.", "The company is shutting down."], "Hiring assumes there's work to do."],
];

const JUDGMENTS: Fill[] = [
  ["Definition: 'Plagiarism' is presenting someone else's work as your own. Which is an example?", "Submitting a copied essay under your name", ["Quoting a source with credit", "Writing your own essay", "Reading a book for ideas"], "Only the first passes off another's work as yours."],
  ["Definition: A 'conflict of interest' is when personal gain could affect a professional decision. Which is an example?", "A judge hearing a case involving her own company", ["A judge reading a law book", "A judge taking a holiday", "A judge praising a lawyer"], "Her personal stake could sway her decision."],
  ["Definition: 'Procrastination' is delaying tasks without a good reason. Which is an example?", "Watching videos instead of starting an assignment due tomorrow", ["Resting after finishing work", "Postponing a trip because of a storm", "Planning a study timetable"], "Only the first delays without good reason."],
  ["Definition: 'Constructive criticism' points out problems and suggests improvements. Which is an example?", "'Your report is clear; adding a summary would help.'", ["'This report is useless.'", "'Great job, no changes.'", "'I don't like your style.'"], "It names an issue and how to fix it."],
  ["Definition: 'Empathy' is understanding another person's feelings. Which is an example?", "Comforting a friend who failed an exam", ["Laughing at a friend's mistake", "Ignoring a friend's message", "Competing with a friend"], "Only the first shows understanding of feelings."],
  ["Definition: 'Inflation' is a general rise in prices over time. Which is an example?", "A loaf of bread costing more each year", ["A shop giving a discount", "Salaries being cut", "A new phone launch"], "Prices rising over time."],
];

// logical sequence: items in the right order
const SEQUENCES: string[][] = [
  ["seed", "plant", "tree", "fruit"], ["birth", "childhood", "adulthood", "old age"], ["morning", "noon", "evening", "night"], ["letter", "word", "sentence", "paragraph"],
  ["village", "district", "state", "country"], ["admission", "study", "exam", "result"], ["wake up", "brush", "bathe", "breakfast"], ["sowing", "growing", "harvesting", "selling"],
  ["cloud", "rain", "flood", "relief"], ["infant", "child", "teenager", "adult"], ["second", "minute", "hour", "day"], ["page", "chapter", "book", "library"],
  ["egg", "larva", "pupa", "butterfly"], ["apply", "interview", "offer", "join"], ["dough", "bake", "bread", "eat"], ["thought", "plan", "action", "result"],
];

const ESSENTIAL: [string, string, string[]][] = [
  ["book", "pages", ["pictures", "cover art", "index"]], ["river", "water", ["fish", "boats", "bridge"]], ["school", "students", ["uniform", "bus", "canteen"]], ["fire", "oxygen", ["smoke", "flame colour", "wood"]],
  ["song", "melody", ["guitar", "singer", "album"]], ["election", "voters", ["posters", "speeches", "rallies"]], ["computer", "processor", ["printer", "mouse", "speaker"]], ["dictionary", "words", ["pictures", "maps", "stories"]],
  ["shoe", "sole", ["laces", "buckle", "polish"]], ["hospital", "patients", ["parking", "garden", "canteen"]], ["race", "competitors", ["spectators", "trophy", "referee"]], ["language", "words", ["grammar book", "teacher", "alphabet chart"]],
  ["game", "rules", ["referee", "spectators", "trophy"]], ["bank", "money", ["building", "guard", "queue"]], ["cloud", "water vapour", ["rain", "sky", "lightning"]], ["newspaper", "news", ["advertisements", "photographs", "crossword"]],
];

const TRUTH: Fill[] = [
  ["A tree always has…", "roots", ["fruits", "flowers", "birds"], "Not every tree bears fruit or flowers, but every tree has roots."], ["A book always has…", "pages", ["pictures", "a hard cover", "an index"], "Only pages are essential."],
  ["A school always has…", "students", ["a playground", "a library", "a bus"], "Without students it isn't a school."], ["A circle always has…", "a centre", ["corners", "straight sides", "a diagonal"], "Every circle has a centre."],
  ["A desert always has…", "very little rainfall", ["camels", "sand dunes", "oases"], "Low rainfall defines a desert; some deserts have no sand dunes."], ["A song always has…", "a melody", ["lyrics", "a guitar", "a chorus"], "Instrumental songs have no lyrics, but all have melody."],
  ["Fire always needs…", "oxygen", ["wood", "smoke", "a match"], "Combustion needs oxygen."], ["A shadow always needs…", "light", ["the sun", "a wall", "night"], "Any light source can cast a shadow."],
  ["An election always has…", "voters", ["posters", "rallies", "a holiday"], "Voting needs voters."], ["A language always has…", "words", ["a script", "books", "teachers"], "Some languages have no script, but all have words."],
];

/** Questions about a passage: each question repeats the passage so it can be answered on its own. */
function passageQs(items: [string, [string, string, string[], string][]][], lead: string): BankQ[] {
  const out: BankQ[] = [];
  items.forEach(([text, qs], p) =>
    qs.forEach(([q, c, w, e]) => out.push({ level: p === 0 ? "Easy" : p === 1 ? "Medium" : "Hard", q: `${lead} ${q}

${text}`, o: [c, ...w], e }))
  );
  return out;
}

const SYN: BankQ[] = fromList(WORDS, (w, others, i) => ({ level: lv(i, WORDS.length), q: `Choose the word closest in meaning to '${w[0].toUpperCase()}'.`, o: [w[1], w[2], others[0][1], others[1][1]], e: `'${w[0]}' means ${w[1]}; '${w[2]}' is its opposite.` }));
const ANT: BankQ[] = fromList(WORDS, (w, others, i) => ({ level: lv(i, WORDS.length), q: `Choose the word opposite in meaning to '${w[0].toUpperCase()}'.`, o: [w[2], w[1], others[0][2], others[1][2]], e: `The opposite of '${w[0]}' is ${w[2]}; '${w[1]}' is a synonym, a common trap.` }));
const CONTEXT: BankQ[] = fromList(WORDS.slice(10), (w, others, i) => ({ level: lv(i, WORDS.length - 10), q: `"The report was ${w[0]}." Here '${w[0]}' most nearly means…`, o: [w[1], w[2], others[0][1], others[1][2]], e: `'${w[0]}' means ${w[1]}. Substitute it into the sentence to check.` }));

export const verbalBanks: Record<string, BankQ[]> = {
  synonyms: SYN,
  antonyms: ANT,
  "vocabulary-in-context": CONTEXT,
  "one-word-substitution": fromList(ONE_WORD, ([phrase, word], others, i) => ({ level: lv(i, ONE_WORD.length), q: `One word for: "${phrase}"`, o: [word, ...others.map((x) => x[1])], e: `${phrase}: ${word}.` })),
  "idioms-and-phrases": fromList(IDIOMS, ([idiom, meaning], others, i) => ({ level: lv(i, IDIOMS.length), q: `What does "${idiom}" mean?`, o: [meaning, ...others.map((x) => x[1])], e: `"${idiom}" means ${meaning}.` })),
  spellings: SPELL.map((s, i) => ({ level: lv(i, SPELL.length), q: "Choose the correctly spelt word.", o: s, e: `The correct spelling is '${s[0]}'.` })),
  "verbal-analogies": ANALOGIES.map(([a, b, c, d, wrong, rel], i) => ({ level: lv(i, ANALOGIES.length), q: `${a} : ${b} :: ${c} : ?`, o: [d, ...wrong], e: `The relationship is ${rel}: ${a} → ${b}, so ${c} → ${d}.` })),
  "ordering-of-words": orderQuestions([...ORDER_SENTENCES, ...MORE_ORDER], false),
  "para-jumbles": orderQuestions([...PARAS, ...MORE_PARAS, ...MORE_PARAS_2], true),
  "articles-and-prepositions": fills(ARTICLES_PREPS),
  "subject-verb-agreement": fills([...SVA, ...MORE_SVA]),
  tenses: fills([...TENSES, ...MORE_TENSES]),
  "parts-of-speech": fills([...POS, ...MORE_POS]),
  "sentence-correction": fills([...CORRECTION, ...MORE_CORRECTION]),
  "spotting-errors": fills([...ERRORS, ...MORE_ERRORS]),
  "sentence-improvement": fills([...IMPROVE, ...MORE_IMPROVE]),
  "active-passive-voice": fills([...VOICE, ...MORE_VOICE, ...VOICE_3]),
  "direct-indirect-speech": fills([...SPEECH, ...MORE_SPEECH, ...SPEECH_3]),
  "fill-in-the-blanks": fills([...FILL_WORDS, ...MORE_FILL]),
  "completing-statements": fills([...COMPLETE, ...MORE_COMPLETE]),
  "cloze-test": passageQs([...CLOZE, CLOZE_3, ...CLOZE_4], "Read the passage and choose the word for"),
  "reading-comprehension": passageQs([...PASSAGES, ...PASSAGES_3], "Read the passage and answer:"),
  // judgment-type reasoning (logical-reasoning course)
  "statements-conclusions": fills([...CONCLUSIONS, ...MORE_CONCLUSIONS]),
  "statements-and-assumptions": fills([...ASSUMPTIONS, ...MORE_ASSUMPTIONS]),
  "making-judgments": fills([...JUDGMENTS, ...MORE_JUDGMENTS]),
  "verification-of-truth": fills([...TRUTH, ...MORE_TRUTH]),
  "logical-sequence-of-words": [...SEQUENCES, ...MORE_SEQUENCES].map((seq, i) => {
    const shown = [2, 0, 3, 1].map((k) => seq[(k + i) % 4]);
    const order = seq.map((s) => shown.indexOf(s) + 1).join(", ");
    const wrong = [[...order.split(", ")].reverse().join(", "), shown.map((_, k) => k + 1).join(", "), [order.split(", ")[1], order.split(", ")[0], ...order.split(", ").slice(2)].join(", ")];
    return { level: lv(i, SEQUENCES.length + MORE_SEQUENCES.length), q: `Arrange in a logical order: ${shown.map((s, k) => `${k + 1}. ${s}`).join("  ")}`, o: [order, ...[...new Set(wrong.filter((w) => w !== order)), "4, 3, 2, 1", "2, 1, 4, 3"].filter((w, k, a) => w !== order && a.indexOf(w) === k).slice(0, 3)], e: `The natural order is ${seq.join(" → ")}.` };
  }),
  "essential-part": [...ESSENTIAL, ...MORE_ESSENTIAL].map(([thing, part, wrong], i) => ({ level: lv(i, ESSENTIAL.length + MORE_ESSENTIAL.length), q: `Which is an essential part of a ${thing}?`, o: [part, ...wrong], e: `A ${thing} can exist without the others, but not without ${part}.` })),
};
