// A third batch of authored practice, bringing the smaller banks up to about 20 questions each. Original content.
type Fill = [string, string, string[], string];

export const MORE_JUDGMENTS: Fill[] = [
  ["Definition: 'Negligence' is failing to take reasonable care, causing harm. Which is an example?", "A shop leaves a wet floor unmarked and a customer slips", ["A customer trips while running on a dry floor", "A shop mops and puts up a warning sign", "A customer buys the wrong item"], "Only the first shows a lack of reasonable care that caused harm."],
  ["Definition: 'Delegation' is assigning a task while keeping responsibility for the result. Which is an example?", "A manager asks a colleague to draft a report and reviews it before sending", ["A manager writes every report alone", "A manager quits the project", "A manager ignores a report"], "The task is assigned and the manager keeps responsibility."],
  ["Rule: free entry for students OR senior citizens. Who pays?", "A 30-year-old who isn't a student", ["A 20-year-old student", "A 70-year-old", "A 68-year-old student"], "'Or' needs only one condition; the 30-year-old meets neither."],
  ["Rule: a loan is approved if income exceeds ₹5 lakh AND there are no unpaid loans. Ravi earns ₹6 lakh but has an unpaid loan. Approved?", "No", ["Yes", "Partly", "Can't be determined"], "'And' needs both conditions; the second fails."],
  ["Definition: 'Recycling' is turning used material into new products. Which is an example?", "Melting old bottles to make new ones", ["Throwing bottles in the bin", "Buying new bottles", "Washing a cup"], "Only melting used bottles into new ones fits."],
  ["Definition: 'Brainstorming' is a group freely suggesting ideas without judging them at first. Which fits?", "A team lists every idea on a board before discussing any", ["A manager picks one idea and rejects the rest at once", "One person writes a plan alone", "A team votes without discussion"], "Ideas are collected freely before any judgment."],
  ["Definition: 'Monopoly' is a market with a single seller. Which is an example?", "Only one company is allowed to supply electricity in a city", ["Ten shops sell phones on one street", "Two airlines compete on a route", "Many farmers sell rice"], "A single supplier controls the market."],
  ["Definition: 'Feedback' is information about performance used to improve it. Which is an example?", "A coach tells a player how to fix her serve", ["A fan cheers loudly", "A player buys new shoes", "A referee ends the game"], "Only the coach's comment gives information for improvement."],
  ["Definition: 'Vandalism' is deliberately damaging public or private property. Which fits?", "Spray-painting a bus stop on purpose", ["A car scratched in an accident", "Cleaning a wall", "Repairing a bench"], "Deliberate damage, not an accident."],
  ["Definition: 'Mentoring' is an experienced person guiding a less experienced one. Which fits?", "A senior engineer meets a new hire weekly to advise her", ["Two new hires chat at lunch", "A manager sends a schedule", "A student reads a book alone"], "Guidance from experienced to less experienced."],
  ["Rule: a parcel ships free if it weighs under 2 kg AND costs over ₹500. Which ships free?", "1.5 kg, ₹800", ["3 kg, ₹900", "1 kg, ₹300", "2.5 kg, ₹400"], "Only the first meets both conditions."],
  ["Definition: 'Inflation' is a general rise in prices. Which is evidence of it?", "Most goods cost more than a year ago", ["One shop runs a sale", "A new phone launches", "Salaries are paid on time"], "A general rise across most goods."],
  ["Definition: 'Teamwork' is people working together towards a shared goal. Which fits?", "Classmates split up a project and combine their parts", ["Each student does a different unrelated assignment", "One student does the project alone", "Students compete against each other"], "Shared goal, combined effort."],
  ["Definition: 'Punctuality' is being on time. Which shows it?", "Arriving at 9:55 for a 10:00 meeting", ["Arriving at 10:20 for a 10:00 meeting", "Skipping the meeting", "Leaving early without notice"], "Arriving before the start time."],
];

export const MORE_COMPLETE: Fill[] = [
  ["Not only did the team win the trophy, …", "but they also broke the record", ["and they lost the final", "so they won", "or they gave up"], "'Not only' pairs with 'but also'."],
  ["Had the bridge been inspected earlier, …", "the accident could have been avoided", ["the accident is avoided", "the accident will be avoided", "because the accident happened"], "Inverted third conditional takes 'could/would have'."],
  ["Despite repeated warnings, …", "the residents refused to leave", ["the residents left at once", "because the residents were safe", "so the warnings stopped"], "'Despite' introduces a contrast."],
  ["The faster you drive, …", "the greater the risk", ["the risk is greater", "and greater risk", "risk becomes great"], "'The faster …, the greater …' is a fixed pattern."],
  ["So well did she perform that …", "she received a standing ovation", ["she was booed", "because she performed", "although she performed"], "'So … that' gives a result."],
  ["If I had enough money, …", "I would buy a laptop", ["I will buy a laptop", "I bought a laptop", "I have bought a laptop"], "Second conditional: if + past, would + verb."],
  ["Hardly had she sat down …", "when the phone rang", ["than the phone rang", "then the phone rang", "the phone rang"], "'Hardly' pairs with 'when'."],
  ["Either you apologise now …", "or you face the consequences", ["nor you face the consequences", "and you face the consequences", "but you face the consequences"], "'Either' pairs with 'or'."],
  ["As the prices rose sharply, …", "people bought less", ["people bought more cheaply", "the prices fell", "although people shopped"], "'As' (because) needs a result of rising prices."],
  ["Neither the manager nor the staff …", "were aware of the change", ["was aware of the change, and", "or the change", "but the change"], "Neither … nor; verb agrees with 'staff' (nearer subject)."],
  ["She studied late every night, …", "so she was well prepared for the exam", ["although she was well prepared", "but she studied", "unless she prepared"], "'So' introduces a result."],
  ["Although the restaurant was expensive, …", "the food was not worth the price", ["the food was expensive too", "therefore it was costly", "because the food was good"], "'Although' needs a contrast with the expectation."],
];

export const MORE_TRUTH: Fill[] = [
  ["A newspaper always has…", "news", ["advertisements", "photographs", "an editorial"], "Some papers carry no ads or photos; news is constant."],
  ["A triangle always has…", "three sides", ["a right angle", "equal sides", "a base of 5 cm"], "Every triangle has exactly three sides."],
  ["A bicycle always has…", "wheels", ["a bell", "a basket", "gears"], "Bells, baskets and gears are optional."],
  ["A doctor always has…", "patients", ["a hospital", "a car", "a stethoscope"], "Doctors may work outside hospitals, but always treat patients."],
  ["A clock always has…", "a way to show time", ["hands", "numbers", "an alarm"], "Digital clocks have no hands; all clocks show time."],
  ["Rain always needs…", "clouds", ["thunder", "lightning", "wind"], "Rain falls from clouds; thunder and wind are optional."],
  ["A game always has…", "rules", ["a referee", "spectators", "a trophy"], "Every game has rules; the others are optional."],
  ["A sentence always has…", "a verb", ["an adjective", "a comma", "an object"], "Every complete sentence has a verb."],
  ["A lake always has…", "water", ["fish", "boats", "a bridge"], "A lake is a body of water."],
  ["A building always has…", "a foundation", ["a lift", "a garden", "windows on every wall"], "Every building stands on a foundation."],
];

export const MORE_IMPROVE: Fill[] = [
  ["Improve: 'Each of the players HAVE BEEN given a kit.'", "has been", ["were", "are being", "No improvement"], "'Each' is singular."], ["Improve: 'She has been working here SINCE TEN YEARS.'", "for ten years", ["from ten years", "ten years before", "No improvement"], "A length of time takes 'for'."],
  ["Improve: 'Had I known, I WOULD HAVE LEFT earlier.'", "No improvement", ["will leave", "would leave", "had left"], "A correct inverted third conditional."], ["Improve: 'The jury ARE DIVIDED in their opinions.'", "No improvement", ["is divided", "were dividing", "has divided"], "Members acting separately take a plural verb."],
  ["Improve: 'He is one of those people who ALWAYS SPEAKS the truth.'", "always speak", ["speaks always", "is always speaking", "No improvement"], "'Who' refers to 'people', so plural."], ["Improve: 'I look forward TO MEET you.'", "to meeting", ["for meeting", "meeting to", "No improvement"], "'Look forward to' + -ing."],
  ["Improve: 'Neither of them ARE coming.'", "is", ["were", "have been", "No improvement"], "'Neither of' takes a singular verb."], ["Improve: 'He RESEMBLES TO his father.'", "resembles", ["resembles with", "is resembling to", "No improvement"], "'Resemble' takes no preposition."],
  ["Improve: 'We ENJOYED very much at the party.'", "enjoyed ourselves", ["enjoyed us", "were enjoyed", "No improvement"], "'Enjoy' needs an object; here a reflexive one."], ["Improve: 'The sceneries of Kashmir ARE beautiful.'", "The scenery of Kashmir is", ["The sceneries of Kashmir is", "The scenery of Kashmir are", "No improvement"], "'Scenery' is uncountable and singular."],
];

export const MORE_ERRORS: Fill[] = [
  ["Find the error: (a) Not only he is clever / (b) but also hard-working / (c) in every way / (d) no error", "(a)", ["(b)", "(c)", "(d)"], "'Not only' at the start inverts the verb: 'Not only is he clever'."],
  ["Find the error: (a) The boy, as well as his parents, / (b) were present / (c) at the function / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "'As well as' doesn't add to the subject: 'was present'."],
  ["Find the error: (a) Neither the manager / (b) nor his assistants / (c) was available / (d) no error", "(c)", ["(a)", "(b)", "(d)"], "The verb agrees with the nearer subject 'assistants': 'were'."],
  ["Find the error: (a) One of the most / (b) famous poet / (c) of India / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "'One of the most famous poets' needs the plural."],
  ["Find the error: (a) I look forward / (b) to meet you / (c) next week / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "'Look forward to' takes -ing: 'to meeting'."],
  ["Find the error: (a) She is / (b) more cleverer / (c) than her sister / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "No double comparatives: 'cleverer'."],
  ["Find the error: (a) We have / (b) ordered three dozens / (c) bananas / (d) no error", "(b)", ["(a)", "(c)", "(d)"], "After a number, 'dozen' stays singular: 'three dozen'."],
  ["Find the error: (a) The train / (b) had left / (c) before we reached the station / (d) no error", "(d)", ["(a)", "(b)", "(c)"], "Correct: past perfect for the earlier action."],
];

export const MORE_ORDER: string[][] = [
  ["The old palace", "on the hill", "which was built in 1890", "is now a museum"],
  ["The school", "declared a holiday", "on Monday", "because the roads were flooded"],
  ["The manager", "asked his team", "to finish the report", "by Friday"],
  ["Regular exercise", "not only reduces stress", "but also improves sleep", "and concentration"],
  ["The young scientist", "presented her research", "at the conference", "last month"],
  ["Most students", "find mathematics easier", "after regular practice", "with worked examples"],
  ["The government", "has launched a scheme", "to help farmers", "during droughts"],
  ["My grandmother", "tells us stories", "about her childhood", "every evening"],
];

export const MORE_ESSENTIAL: [string, string, string[]][] = [
  ["garden", "plants", ["fountain", "fence", "bench"]], ["lecture", "speaker", ["projector", "notes", "microphone"]], ["vehicle", "wheels", ["radio", "mirror", "seat cover"]],
  ["library", "books", ["computers", "chairs", "librarian's desk"]], ["map", "scale", ["colours", "pictures", "a compass rose"]], ["orchestra", "musicians", ["conductor's stand", "audience", "stage lights"]],
];

export const MORE_SEQUENCES: string[][] = [
  ["clay", "brick", "wall", "house"], ["rivulet", "stream", "river", "ocean"], ["illness", "doctor", "treatment", "recovery"], ["key", "lock", "door", "room"],
  ["foetus", "baby", "child", "adult"], ["word", "line", "page", "book"],
];

export const MORE_PARAS_2: string[][] = [
  ["Anil lost his wallet on the bus.", "He reported it at the depot.", "Two days later the depot called him.", "Someone had found it and handed it in."],
  ["Clouds gathered over the city.", "Soon thunder rolled in the distance.", "Heavy rain began to fall.", "Streets filled with water within an hour."],
  ["The startup built a simple prototype.", "They showed it to a few customers.", "Customers suggested many changes.", "The team used the feedback to improve the product."],
  ["Lata wanted to improve her English.", "She began reading one article every day.", "She noted new words in a notebook.", "Within months, her vocabulary had grown a lot."],
];

export const CLOZE_3: [string, [string, string, string[], string][]] = [
  "Saving money is a habit, not a talent. The first step is to (1) ___ track of what you spend. Many people are surprised by how much goes on small purchases. (2) ___ you know where your money goes, you can set a monthly budget. A good rule is to save a fixed amount (3) ___ you spend the rest. Over time, small savings (4) ___ into a large sum, (5) ___ to compound interest.",
  [
    ["Blank (1)", "keep", ["make", "take", "do"], "The collocation is 'keep track of'."],
    ["Blank (2)", "Once", ["Unless", "Although", "Despite"], "'Once you know…' means after you know."],
    ["Blank (3)", "before", ["after", "unless", "although"], "Save first, then spend: before."],
    ["Blank (4)", "grow", ["grows", "growing", "grown"], "Plural subject 'savings' takes 'grow'."],
    ["Blank (5)", "thanks", ["due", "because", "owing"], "'Thanks to' gives the cause."],
  ],
];
