import type { VisualMap } from "./types";

const c = "programming-fundamentals";

export const pfVisuals: VisualMap = {
  // ── Programming basics ──
  [`${c}/what-is-programming`]: {
    plain:
      "A program is a recipe for a computer. The computer is a very fast cook that follows every step exactly, in order, and never guesses what you meant. Programming is writing that recipe clearly enough that there is nothing left to guess.",
    diagram: `flowchart LR
  A["You: a problem<br/>'add up my marks'"] --> B["Steps in plain words<br/>(an algorithm)"]
  B --> C["Steps in a language<br/>(Java code)"]
  C --> D["Computer runs it"]
  D --> E["Answer: 437"]`,
    caption: "From a problem to an answer: you think of the steps, the computer follows them.",
  },
  [`${c}/programming-languages`]: {
    plain:
      "Computers only understand 0s and 1s, people understand words. A programming language sits in between: strict enough for a machine to follow, readable enough for a person to write. Different languages are different trade-offs, like a scooter versus a truck.",
    diagram: `flowchart TB
  P["Person"] -->|"writes"| L["Programming language<br/>Java · Python · C"]
  L -->|"translated to"| M["Machine code<br/>0s and 1s"]
  M -->|"runs on"| H["CPU"]`,
    caption: "A language is the middle ground between human words and machine bits.",
  },
  [`${c}/high-level-vs-low-level-languages`]: {
    plain:
      "Low-level languages talk to the hardware almost directly, like giving a driver every turn of the steering wheel. High-level languages let you say 'drive to the station' and handle the details for you. Higher is easier to write; lower gives more control.",
    diagram: `flowchart TB
  A["High level: Python, Java<br/>easy to read, portable"] --> B["Mid level: C<br/>close to memory"]
  B --> C["Assembly<br/>one line ≈ one CPU instruction"]
  C --> D["Machine code: 10110000 01100001"]`,
    caption: "The higher the level, the further from the hardware and the closer to human language.",
  },
  [`${c}/compiler-vs-interpreter`]: {
    plain:
      "A compiler is like translating a whole book before anyone reads it: slow once, then fast to read many times. An interpreter is a live translator who translates each sentence as it is spoken: you start straight away, but every run pays the translation cost. Java does a bit of both.",
    diagram: `flowchart LR
  subgraph Compiler
    S1["Whole source file"] --> C1["Compile once"] --> X1["Executable"] --> R1["Run many times"]
  end
  subgraph Interpreter
    S2["Source"] --> I2["Read line 1 → run<br/>read line 2 → run …"]
  end`,
    caption: "Compile the whole thing first, or translate and run line by line.",
  },
  [`${c}/source-code-compilation-execution`]: {
    plain:
      "Your Java file goes through two translations. javac turns it into bytecode, a halfway language any computer with Java understands. Then the JVM on each machine turns bytecode into that machine's own instructions while it runs. That's why Java runs anywhere.",
    diagram: `flowchart LR
  A["Hello.java<br/>source code"] -->|"javac"| B["Hello.class<br/>bytecode"]
  B -->|"java (JVM)"| C["Class loader"]
  C --> D["Bytecode verifier"]
  D --> E["Interpreter + JIT"]
  E --> F["Machine code on the CPU"]`,
    caption: "Write once, compile to bytecode, run on any machine with a JVM.",
  },
  [`${c}/syntax-vs-semantics`]: {
    plain:
      "Syntax is grammar, semantics is meaning. 'Cat the sat mat' breaks grammar, so it's a syntax error and the compiler refuses it. 'The mat sat on the cat' is good grammar but wrong meaning: the program runs and gives a wrong answer. Semantic bugs are the sneaky ones.",
    diagram: `flowchart TB
  Code["Your code"] --> Q{"Follows the language rules?"}
  Q -->|"No"| SE["Syntax error<br/>won't compile"]
  Q -->|"Yes"| R{"Does what you meant?"}
  R -->|"No"| LE["Logic / semantic bug<br/>runs, wrong answer"]
  R -->|"Yes"| OK["Correct program"]`,
    caption: "Compilers catch grammar mistakes; only testing catches wrong meaning.",
  },

  // ── Variables & data types ──
  [`${c}/variables`]: {
    plain:
      "A variable is a labelled box in memory. The label is its name, the box has a fixed shape (its type), and you can swap what's inside. int age = 20 makes a box called age that holds whole numbers and puts 20 in it.",
    diagram: `flowchart LR
  subgraph Memory
    A["age<br/>int<br/>20"]
    B["price<br/>double<br/>99.5"]
    C["grade<br/>char<br/>'A'"]
  end
  S["age = 21;"] -.->|"replaces 20 with 21"| A`,
    caption: "Name, type and value: assigning again replaces what's in the box.",
  },
  [`${c}/constants`]: {
    plain:
      "A constant is a box you seal after filling it. final double PI = 3.14159 can be read anywhere but never changed, so nobody can accidentally set PI to 3. Use constants for values that should never move, like tax rates or limits.",
    diagram: `stateDiagram-v2
  [*] --> Declared: final int MAX = 100
  Declared --> Read: use MAX anywhere
  Read --> Read
  Declared --> Error: MAX = 200
  note right of Error: compile error, a final variable can't be reassigned`,
    caption: "Assigned once, read many times, never changed.",
  },
  [`${c}/primitive-data-types`]: {
    plain:
      "Java's eight primitive types are boxes of different sizes. A byte is a tiny box for small numbers, a long is a big box for huge ones, and a boolean holds just true or false. Bigger boxes take more memory, so you pick the smallest that fits.",
    diagram: `flowchart TB
  P["Primitive types"] --> I["Whole numbers"]
  P --> F["Decimals"]
  P --> CH["char<br/>16 bits · 'A'"]
  P --> BO["boolean<br/>true / false"]
  I --> b["byte · 8 bits"]
  I --> s["short · 16 bits"]
  I --> i["int · 32 bits"]
  I --> l["long · 64 bits"]
  F --> fl["float · 32 bits"]
  F --> d["double · 64 bits"]`,
    caption: "Eight primitive types, grouped by what they hold.",
  },
  [`${c}/type-casting`]: {
    plain:
      "Casting moves a value into a box of a different type. Small to big (int to double) is automatic and safe, like pouring a glass of water into a bucket. Big to small (double to int) needs an explicit cast and can spill: 9.99 becomes 9.",
    diagram: `flowchart LR
  byte --> short --> int --> long --> float --> double
  double -.->|"(int) 9.99 → 9<br/>explicit, may lose data"| int`,
    caption: "Widening (left to right) is automatic; narrowing needs a cast and can lose data.",
  },
  [`${c}/wrapper-classes`]: {
    plain:
      "A wrapper class puts a primitive inside an object, like putting a coin in an envelope so it can go through the post. Collections such as ArrayList only accept objects, so int travels as Integer. Java wraps and unwraps automatically (autoboxing).",
    diagram: `flowchart LR
  A["int 5<br/>primitive"] -->|"autoboxing"| B["Integer object<br/>value: 5"]
  B -->|"unboxing"| A
  B --> L["ArrayList&lt;Integer&gt;"]`,
    caption: "Primitives become objects when a collection needs them, and back again.",
  },

  // ── Operators ──
  [`${c}/operator-precedence`]: {
    plain:
      "When an expression has several operators, Java follows a fixed order, just like BODMAS in maths: multiplication before addition, and brackets first of all. 2 + 3 * 4 is 14, not 20. When in doubt, add brackets so the reader doesn't have to remember the table.",
    diagram: `flowchart TB
  E["2 + 3 * 4"] --> S1["3 * 4 = 12<br/>(* before +)"]
  S1 --> S2["2 + 12 = 14"]
  E2["(2 + 3) * 4"] --> T1["2 + 3 = 5<br/>(brackets first)"]
  T1 --> T2["5 * 4 = 20"]`,
    caption: "Same numbers, different order, different answer.",
  },
  [`${c}/logical-operators`]: {
    plain:
      "&& means both must be true, || means at least one must be true, ! flips true and false. Java also stops early: in a && b, if a is false it never looks at b, because the answer is already false. This 'short-circuit' is often used to avoid errors.",
    diagram: `flowchart LR
  A{"age >= 18"} -->|"false"| N["whole && is false<br/>(right side skipped)"]
  A -->|"true"| B{"hasId"}
  B -->|"true"| Y["allowed in"]
  B -->|"false"| N2["not allowed"]`,
    caption: "age >= 18 && hasId: the second test only runs if the first passes.",
  },

  // ── Input & output ──
  [`${c}/taking-input-scanner`]: {
    plain:
      "Scanner is a reader standing at the keyboard. You ask it for the next whole number or the next line, and it waits until the user types one and presses Enter. Ask for a number when the user typed a word and it throws an error.",
    diagram: `sequenceDiagram
  participant P as Program
  participant S as Scanner
  participant U as User
  P->>S: nextInt()
  S->>U: waits for input
  U-->>S: types 42 + Enter
  S-->>P: returns 42
  P->>P: uses the value`,
    caption: "The program pauses until the user types and presses Enter.",
  },

  // ── Control flow ──
  [`${c}/what-is-control-flow`]: {
    plain:
      "Normally code runs top to bottom like reading a page. Control flow lets the program choose a path (if/else), repeat steps (loops), or jump out early (break, return). Every program, however big, is built from these three shapes: sequence, choice and repetition.",
    diagram: `flowchart LR
  subgraph Sequence
    a1["step 1"] --> a2["step 2"] --> a3["step 3"]
  end
  subgraph Choice
    q{"condition?"} -->|"yes"| y["do A"]
    q -->|"no"| n["do B"]
  end
  subgraph Repetition
    l{"more to do?"} -->|"yes"| w["do work"] --> l
    l -->|"no"| d["done"]
  end`,
    caption: "Sequence, choice and repetition: the three building blocks of every program.",
  },
  [`${c}/if-else-statement`]: {
    plain:
      "if/else is a fork in the road. The condition is the signpost: if it says true you take the left road, otherwise the right. Exactly one of the two blocks runs, never both, never neither.",
    diagram: `flowchart TB
  S(["marks = 72"]) --> Q{"marks >= 40?"}
  Q -->|"true"| P["print 'Pass'"]
  Q -->|"false"| F["print 'Fail'"]
  P --> E(["continue"])
  F --> E`,
    caption: "Exactly one branch runs, then both paths meet again.",
  },
  [`${c}/else-if-ladder`]: {
    plain:
      "An else-if ladder checks conditions one at a time from the top and stops at the first true one, like a teacher looking down a grade table. Order matters: put the most specific conditions first, or a broad one higher up will catch everything.",
    diagram: `flowchart TB
  S(["marks = 82"]) --> A{"marks >= 90?"}
  A -->|"no"| B{"marks >= 75?"}
  A -->|"yes"| GA["Grade A"]
  B -->|"yes"| GB["Grade B ✓"]
  B -->|"no"| C{"marks >= 40?"}
  C -->|"yes"| GC["Grade C"]
  C -->|"no"| GF["Fail"]`,
    caption: "Checked top to bottom; the first true condition wins and the rest are skipped.",
  },
  [`${c}/switch-statement`]: {
    plain:
      "switch is a lift panel: press a floor number and you go straight to that floor. Without break, the lift keeps going down to the next floors too (fall-through). Use it when one value picks one of many fixed options.",
    diagram: `flowchart TB
  D(["day = 3"]) --> S{"switch (day)"}
  S -->|"case 1"| M["Monday"]
  S -->|"case 2"| T["Tuesday"]
  S -->|"case 3"| W["Wednesday ✓ then break"]
  S -->|"default"| X["Invalid day"]`,
    caption: "The value jumps straight to its matching case; break stops it falling into the next.",
  },
  [`${c}/for-loop`]: {
    plain:
      "A for loop is a counter on a treadmill: start at a number, check you haven't reached the end, do one lap, add one, check again. for (int i = 0; i < 5; i++) runs exactly 5 laps, with i going 0, 1, 2, 3, 4.",
    diagram: `flowchart TB
  I["int i = 0<br/>(runs once)"] --> C{"i < 5?"}
  C -->|"true"| B["loop body"]
  B --> U["i++"]
  U --> C
  C -->|"false"| E(["after the loop"])`,
    caption: "Initialise once, then check → body → update, until the check fails.",
  },
  [`${c}/while-loop`]: {
    plain:
      "A while loop keeps going as long as something stays true, like stirring until the sugar dissolves: you don't know how many stirs it will take. Use it when you don't know the number of repetitions in advance. Forget to change the condition and it never stops.",
    diagram: `flowchart TB
  S(["n = 1234, digits = 0"]) --> C{"n > 0?"}
  C -->|"true"| B["n = n / 10<br/>digits++"]
  B --> C
  C -->|"false"| E(["digits = 4"])`,
    caption: "Counting digits: we don't know how many loops in advance, so while fits.",
  },
  [`${c}/do-while-loop`]: {
    plain:
      "do-while does the work first and asks afterwards, like a menu that always shows at least once before asking 'show again?'. A while loop might run zero times; a do-while always runs at least once.",
    diagram: `flowchart TB
  S(["start"]) --> B["show the menu<br/>(body runs first)"]
  B --> C{"user wants again?"}
  C -->|"yes"| B
  C -->|"no"| E(["exit"])`,
    caption: "The body runs before the first check, so it always runs at least once.",
  },
  [`${c}/nested-loops`]: {
    plain:
      "A nested loop is a clock: the minute hand (inner loop) goes all the way round for every single step of the hour hand (outer loop). Three outer steps times four inner steps means twelve runs of the inner body.",
    diagram: `flowchart LR
  O["row 0"] --> c00["col 0"] --> c01["col 1"] --> c02["col 2"]
  O2["row 1"] --> c10["col 0"] --> c11["col 1"] --> c12["col 2"]
  O3["row 2"] --> c20["col 0"] --> c21["col 1"] --> c22["col 2"]`,
    caption: "For each row, the inner loop visits every column: 3 × 3 = 9 visits.",
  },

  // ── Arrays ──
  [`${c}/what-is-an-array`]: {
    plain:
      "An array is a row of numbered lockers, all the same size, side by side in memory. Locker numbers start at 0. Because they're side by side, the computer can jump straight to locker 7 without opening lockers 0 to 6.",
    diagram: `flowchart LR
  a["[0]<br/>12"] --- b["[1]<br/>7"] --- c["[2]<br/>31"] --- d["[3]<br/>4"] --- e["[4]<br/>19"]`,
    caption: "int[] marks = {12, 7, 31, 4, 19}: index on top, value below.",
  },
  [`${c}/array-indexing`]: {
    plain:
      "The index is the locker number, starting at 0. An array of 5 has indexes 0 to 4, so the last one is length - 1. Asking for index 5 is asking for a locker that doesn't exist, and Java throws ArrayIndexOutOfBoundsException.",
    diagram: `flowchart LR
  A["arr[0] = 10"] --- B["arr[1] = 20"] --- C["arr[2] = 30"] --- D["arr[3] = 40"] --- E["arr[4] = 50"]
  F["arr[5] ✗<br/>out of bounds"]:::bad
  classDef bad stroke-dasharray: 5 5`,
    caption: "Valid indexes run from 0 to length − 1.",
  },
  [`${c}/traversing-arrays`]: {
    plain:
      "Traversing means visiting every locker once, in order, usually to read, print or add up values. A for loop with i from 0 to length - 1 is the standard way. The for-each loop does the same thing when you don't need the index.",
    diagram: `flowchart LR
  i0["i = 0 → 12"] --> i1["i = 1 → 7"] --> i2["i = 2 → 31"] --> i3["i = 3 → 4"] --> i4["i = 4 → 19"] --> done(["sum = 73"])`,
    caption: "Visit each index once and keep a running total.",
  },
  [`${c}/searching-arrays`]: {
    plain:
      "Linear search checks lockers one by one from the start until it finds the value or runs out. It works on any array but can take as many checks as there are items. (On a sorted array, binary search is much faster: you'll meet it in DSA.)",
    diagram: `flowchart LR
  A["7?"] -->|"12 no"| B["7?"] -->|"9 no"| C["7?"] -->|"7 yes!"| F(["found at index 2"])`,
    caption: "Linear search: compare with each element until a match.",
  },
  [`${c}/two-dimensional-arrays`]: {
    plain:
      "A 2D array is a grid, like seats in a cinema: row number then seat number. grid[1][2] means row 1, column 2. In Java it's really an array of rows, each row being its own array.",
    diagram: `flowchart LR
  subgraph R0["row 0"]
    direction LR
    a00["[0][0] = 1"] --- a01["[0][1] = 2"] --- a02["[0][2] = 3"]
  end
  subgraph R1["row 1"]
    direction LR
    a10["[1][0] = 4"] --- a11["[1][1] = 5"] --- a12["[1][2] = 6 ✓"]
  end
  R0 ~~~ R1`,
    caption: "Row first, then column.",
  },

  // ── Strings ──
  [`${c}/what-is-a-string`]: {
    plain:
      "A String is a sequence of characters, like beads on a necklace, each with a position starting from 0. In Java, Strings are immutable: methods like toUpperCase() don't change the necklace, they make a new one.",
    diagram: `flowchart LR
  h["[0]<br/>H"] --- e["[1]<br/>e"] --- l1["[2]<br/>l"] --- l2["[3]<br/>l"] --- o["[4]<br/>o"]`,
    caption: "\"Hello\": five characters at indexes 0 to 4; length() is 5.",
  },
  [`${c}/substring-method`]: {
    plain:
      "substring(start, end) cuts out a piece: it includes start and stops just before end. Think of end as the first index you don't want. \"placement\".substring(0, 5) is \"place\".",
    diagram: `flowchart LR
  A["p0 l1 a2 c3 e4"]:::keep --- B["m5 e6 n7 t8"]
  A --> R(["substring(0, 5) = #quot;place#quot;"])
  classDef keep stroke-width:3px`,
    caption: "Start is included, end is excluded.",
  },
  [`${c}/string-comparison`]: {
    plain:
      "== asks 'is this the same object in memory?', equals() asks 'do they contain the same characters?'. Two strings typed the same way can live in different places, so == can say false even when the text matches. Compare text with equals().",
    diagram: `flowchart TB
  subgraph Heap
    P["String pool: #quot;java#quot;"]
    N["new String(#quot;java#quot;)"]
  end
  a["a"] --> P
  b["b"] --> P
  c["c"] --> N
  a -.-|"a == b true · a == c false"| c`,
    caption: "a.equals(c) is true; a == c is false because they're different objects.",
  },

  // ── Methods ──
  [`${c}/what-is-a-method`]: {
    plain:
      "A method is a named mini-program you can call whenever you need it, like a vending machine: you put inputs in (parameters), it does its job, and hands something back (the return value). Write it once, use it many times.",
    diagram: `flowchart LR
  I["inputs<br/>a = 3, b = 4"] --> M["add(a, b)<br/>return a + b;"] --> O["output<br/>7"]`,
    caption: "Inputs in, work done, result out.",
  },
  [`${c}/scope-and-tracing`]: {
    plain:
      "Each method call gets its own fresh notebook (a stack frame) for its variables. When the method returns, the notebook is thrown away. That's why a variable made inside one method can't be seen from another.",
    diagram: `flowchart TB
  subgraph Stack["Call stack (top = running now)"]
    S["square(x = 4)<br/>result = 16"]
    M["main()<br/>n = 4"]
  end
  S -->|"returns 16, frame removed"| M`,
    caption: "Each call pushes a frame with its own variables; returning pops it.",
  },

  // ── Memory & execution ──
  [`${c}/stack-memory`]: {
    plain:
      "The stack is a pile of plates: each method call adds a plate holding its local variables, and returning removes the top plate. It's fast and tidy, but small. Too many plates (endless recursion) and the pile falls over: StackOverflowError.",
    diagram: `flowchart TB
  subgraph Stack
    direction TB
    c["c() · top"] --> b["b()"] --> a["a()"] --> m["main() · bottom"]
  end`,
    caption: "main calls a, a calls b, b calls c: the latest call is on top.",
  },
  [`${c}/heap-memory`]: {
    plain:
      "The heap is a big warehouse for objects. Variables on the stack hold only an address (a reference) pointing into the warehouse. When nothing points at an object any more, the garbage collector clears it out.",
    diagram: `flowchart LR
  subgraph Stack
    s1["Student s"]
    s2["int[] marks"]
  end
  subgraph Heap
    o1["Student object<br/>name: 'Asha'"]
    o2["int array<br/>[90, 85, 77]"]
  end
  s1 --> o1
  s2 --> o2`,
    caption: "References live on the stack, the objects themselves on the heap.",
  },
  [`${c}/garbage-collection`]: {
    plain:
      "The garbage collector is a cleaner who walks through the warehouse and removes any box that no-one can reach any more. You never free memory by hand in Java. You just stop pointing at things you no longer need.",
    diagram: `flowchart LR
  R["references on the stack"] --> A["object A"]
  A --> B["object B"]
  C["object C<br/>unreachable"]:::gone
  classDef gone stroke-dasharray: 5 5`,
    caption: "A and B are reachable and kept; C is unreachable and will be collected.",
  },

  // ── Problem solving & recursion ──
  [`${c}/problem-solving-approach`]: {
    plain:
      "Strong programmers don't start typing straight away. They understand the problem, try small examples by hand, plan the steps, then code and test. Most bugs come from skipping the first two steps.",
    diagram: `flowchart LR
  U["1 Understand<br/>input, output"] --> E["2 Examples<br/>by hand"] --> P["3 Plan<br/>steps in words"] --> C["4 Code"] --> T["5 Test<br/>edge cases"]
  T -->|"wrong?"| P`,
    caption: "Understand → examples → plan → code → test, and loop back when a test fails.",
  },
  [`${c}/what-is-recursion`]: {
    plain:
      "Recursion is a method that solves a problem by calling itself on a smaller version of the same problem, like Russian nesting dolls: open one and there's a smaller doll inside, until you reach the tiny one that doesn't open (the base case).",
    diagram: `flowchart TB
  F4["fact(4) = 4 × fact(3)"] --> F3["fact(3) = 3 × fact(2)"]
  F3 --> F2["fact(2) = 2 × fact(1)"]
  F2 --> F1["fact(1) = 1 · base case"]
  F1 -.->|"1"| F2
  F2 -.->|"2"| F3
  F3 -.->|"6"| F4
  F4 -.-> R(["24"])`,
    caption: "Calls go down to the base case, then answers come back up.",
  },
  [`${c}/base-case`]: {
    plain:
      "The base case is the smallest doll, the one that doesn't open. It answers directly without calling itself again. Without it, the method keeps calling itself until the stack runs out of room.",
    diagram: `flowchart TB
  C["countdown(n)"] --> Q{"n == 0?"}
  Q -->|"yes · base case"| S["print 'Go!' and stop"]
  Q -->|"no · recursive case"| R["print n<br/>countdown(n - 1)"]
  R --> C`,
    caption: "Every recursive method needs a way to stop.",
  },
};
