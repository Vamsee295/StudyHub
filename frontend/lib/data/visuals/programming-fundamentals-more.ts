import type { VisualMap } from "./types";

const c = "programming-fundamentals";

export const pfMoreVisuals: VisualMap = {
  // ── Operators ──
  [`${c}/what-are-operators`]: {
    plain:
      "Operators are the verbs of a calculation: + adds, > compares, && combines. The values they work on are operands. In a + b, + is the operator and a and b are the operands, and the whole thing produces one new value.",
    diagram: `flowchart LR
  A["operand<br/>7"] --> O(("+<br/>operator"))
  B["operand<br/>3"] --> O
  O --> R["result<br/>10"]`,
    caption: "An operator takes operands and produces a value.",
  },
  [`${c}/arithmetic-operators`]: {
    plain:
      "Arithmetic operators work like a calculator, with one surprise: dividing two ints throws away the decimal part. 7 / 2 is 3, not 3.5, and 7 % 2 (the remainder) is 1. Make one side a double (7.0 / 2) to get 3.5.",
    diagram: `flowchart TB
  D["7 ÷ 2"] --> I["7 / 2 = 3<br/>int division drops .5"]
  D --> M["7 % 2 = 1<br/>remainder"]
  D --> F["7.0 / 2 = 3.5<br/>double division"]`,
    caption: "Integer division and remainder.",
  },
  [`${c}/assignment-operators`]: {
    plain:
      "= doesn't mean 'equals' in Java, it means 'put the value on the right into the box on the left'. score += 10 is a short way of saying 'take what's in score, add 10, put it back'.",
    diagram: `flowchart LR
  S["score = 50"] -->|"score += 10<br/>(score = score + 10)"| T["score = 60"]
  T -->|"score *= 2"| U["score = 120"]`,
    caption: "Compound assignment reads, changes and writes back.",
  },
  [`${c}/relational-operators`]: {
    plain:
      "Relational operators ask a yes/no question about two values: is a bigger than b? are they equal? The answer is always a boolean, true or false, which is exactly what if statements and loops need.",
    diagram: `flowchart LR
  Q1["10 > 7"] --> T1["true"]
  Q2["10 == 7"] --> F1["false"]
  Q3["10 != 7"] --> T2["true"]
  Q4["7 <= 7"] --> T3["true"]`,
    caption: "Every comparison produces true or false.",
  },
  [`${c}/unary-operators`]: {
    plain:
      "Unary operators need just one operand. ++ adds one, -- subtracts one. The position matters: ++x adds first and then gives you the new value; x++ gives you the old value and adds afterwards.",
    diagram: `flowchart TB
  S["x = 5"] --> P["y = ++x<br/>x becomes 6, y = 6"]
  S --> Q["y = x++<br/>y = 5, then x becomes 6"]`,
    caption: "Pre-increment vs post-increment.",
  },
  [`${c}/bitwise-operators`]: {
    plain:
      "Bitwise operators work on the individual 0s and 1s inside a number, like flipping rows of light switches. & keeps a bit only where both are 1, | where either is 1, ^ where they differ, and << shifts all bits left (doubling the number).",
    diagram: `flowchart TB
  A["a = 6 → 0110"] --> AND["a & b = 0010 = 2"]
  B["b = 3 → 0011"] --> AND
  A --> OR["a | b = 0111 = 7"]
  B --> OR
  A --> XOR["a ^ b = 0101 = 5"]
  B --> XOR
  A --> SH["a << 1 = 1100 = 12"]`,
    caption: "Operations bit by bit on 6 and 3.",
  },

  // ── Input & output ──
  [`${c}/printing-output`]: {
    plain:
      "System.out.println sends text to the console, the program's way of talking to you. System is a class, out is the console stream inside it, and println is the method that writes a line.",
    diagram: `flowchart LR
  P["System.out.println(#quot;Hi#quot;)"] --> S["standard output stream"] --> C["console shows: Hi"]`,
    caption: "Your text flows through the output stream to the screen.",
  },
  [`${c}/print-vs-println`]: {
    plain:
      "print writes and leaves the cursor where it is, so the next output continues on the same line. println writes and then moves to a new line, like pressing Enter after typing.",
    diagram: `flowchart TB
  A["print(#quot;A#quot;); print(#quot;B#quot;);"] --> R1["AB"]
  B["println(#quot;A#quot;); println(#quot;B#quot;);"] --> R2["A<br/>B"]`,
    caption: "println adds a line break after the text.",
  },
  [`${c}/escape-sequences`]: {
    plain:
      "Some characters can't be typed directly inside a string, like a new line or a quote mark. A backslash starts an escape sequence that stands for them: \\n is a new line, \\t a tab, \\\" a quote, \\\\ a backslash.",
    diagram: `flowchart LR
  N["\\n"] --> N2["new line"]
  T["\\t"] --> T2["tab"]
  Q["\\ then a quote mark"] --> Q2["a quote mark inside the text"]
  B["\\\\"] --> B2["a backslash"]`,
    caption: "Backslash + letter = a special character.",
  },
  [`${c}/input-parsing-errors`]: {
    plain:
      "A classic trap: nextInt() reads the number but leaves the Enter key behind. The next nextLine() reads that leftover Enter and returns an empty string. Call an extra nextLine() after nextInt() to clear it.",
    diagram: `sequenceDiagram
  participant U as User types
  participant S as Scanner
  U->>S: 25 + Enter
  S-->>S: nextInt() returns 25, leaves newline behind
  S-->>S: nextLine() returns empty string immediately
  Note over S: fix: call nextLine() once more after nextInt()`,
    caption: "Why nextLine() seems to get skipped.",
  },

  // ── Control flow ──
  [`${c}/if-statement`]: {
    plain:
      "An if statement is a door that only opens when the condition is true. If it's false, the program walks straight past the block as if it weren't there.",
    diagram: `flowchart TB
  S(["start"]) --> Q{"temperature > 35?"}
  Q -->|"true"| A["print 'Stay hydrated'"]
  Q -->|"false"| E(["continue"])
  A --> E`,
    caption: "The block runs only when the condition is true.",
  },
  [`${c}/nested-conditions`]: {
    plain:
      "A nested condition is a question inside a question, like a form that only asks 'which college?' if you answered 'yes' to 'are you a student?'. The inner check only happens when the outer one passes.",
    diagram: `flowchart TB
  A{"age >= 18?"} -->|"no"| N["can't vote"]
  A -->|"yes"| B{"has voter ID?"}
  B -->|"yes"| Y["can vote"]
  B -->|"no"| G["get an ID first"]`,
    caption: "The inner question is only asked if the outer one passes.",
  },
  [`${c}/ternary-operator`]: {
    plain:
      "The ternary operator is a one-line if/else that gives back a value: condition ? valueIfTrue : valueIfFalse. String r = marks >= 40 ? \"Pass\" : \"Fail\"; is a compact way to choose between two values.",
    diagram: `flowchart LR
  Q{"marks >= 40 ?"} -->|"true"| P["#quot;Pass#quot;"]
  Q -->|"false"| F["#quot;Fail#quot;"]
  P --> R["result"]
  F --> R`,
    caption: "condition ? a : b picks one of two values.",
  },
  [`${c}/break-statement`]: {
    plain:
      "break is the emergency exit: it leaves the loop (or switch) immediately, skipping any remaining rounds. Use it when you've found what you were looking for and there's no point continuing.",
    diagram: `flowchart TB
  L{"next item?"} -->|"yes"| C{"is it the target?"}
  C -->|"yes"| B["break: leave loop"]
  C -->|"no"| L
  L -->|"no more"| E(["after loop"])
  B --> E`,
    caption: "break jumps straight out of the loop.",
  },
  [`${c}/continue-statement`]: {
    plain:
      "continue skips the rest of the current round and jumps to the next one, like skipping a song you don't like without stopping the playlist. The loop keeps going.",
    diagram: `flowchart TB
  L{"i < 10?"} -->|"yes"| C{"i is even?"}
  C -->|"yes"| S["continue: skip print"]
  C -->|"no"| P["print i"]
  S --> U["i++"]
  P --> U
  U --> L`,
    caption: "Printing only odd numbers: even ones are skipped.",
  },
  [`${c}/return-statement`]: {
    plain:
      "return ends a method right away and, if the method has a return type, hands a value back to whoever called it. Nothing after a return in the same path runs.",
    diagram: `sequenceDiagram
  participant M as main()
  participant F as max(a, b)
  M->>F: max(4, 9)
  F->>F: 9 > 4
  F-->>M: return 9
  M->>M: int m = 9`,
    caption: "return sends a value back and ends the method.",
  },
  [`${c}/why-loops`]: {
    plain:
      "Printing 1 to 100 by writing 100 print lines would be silly and error-prone. A loop says 'repeat this, changing one thing each time' in a few lines, and works the same for 100 or a million.",
    diagram: `flowchart LR
  A["100 lines of print<br/>✗ long, error-prone"] ==> B["for (int i = 1; i <= 100; i++)<br/>  print(i)<br/>✓ 2 lines"]`,
    caption: "Repetition is what loops are for.",
  },
  [`${c}/break-continue-loops`]: {
    plain:
      "Inside a loop, continue means 'skip to the next round' and break means 'stop the whole loop'. One moves you forward a round, the other takes you out.",
    diagram: `flowchart LR
  R["round i"] -->|"continue"| N["round i + 1"]
  R -->|"break"| X["exit loop"]
  R -->|"normal end"| N`,
    caption: "continue skips a round; break leaves the loop.",
  },
  [`${c}/counting-accumulation-patterns`]: {
    plain:
      "Two patterns appear in almost every loop problem. A counter starts at 0 and adds 1 when something matches ('how many?'). An accumulator starts at 0 (or 1 for products) and adds each value ('how much?').",
    diagram: `flowchart LR
  I["start: count = 0, sum = 0"] --> L["for each mark m"]
  L --> C["if m >= 40: count++"]
  C --> S["sum += m"]
  S --> L
  L --> E["count = passes, sum = total"]`,
    caption: "Counter and accumulator updated each round.",
  },
  [`${c}/basic-pattern-problems`]: {
    plain:
      "Star patterns are nested loops in disguise: the outer loop picks the row, the inner loop prints what goes in that row. For a right triangle, row i prints i stars.",
    diagram: `flowchart TB
  R1["row 1: *"] --> R2["row 2: * *"] --> R3["row 3: * * *"] --> R4["row 4: * * * *"]`,
    caption: "Outer loop = rows, inner loop = stars in each row.",
  },

  // ── Arrays ──
  [`${c}/array-declaration-initialization`]: {
    plain:
      "Declaring an array names it and says what type it holds; creating it with new reserves the lockers, all starting at a default (0 for int). Or fill it straight away with values in braces.",
    diagram: `flowchart TB
  A["int[] a = new int[3]"] --> A2["[0, 0, 0]<br/>default values"]
  B["int[] b = {4, 8, 15}"] --> B2["[4, 8, 15]"]`,
    caption: "Size fixed at creation; elements start at defaults.",
  },
  [`${c}/taking-array-input`]: {
    plain:
      "To fill an array from the keyboard, first read how many items there will be, create an array that size, then loop: read one value and store it at index i.",
    diagram: `flowchart LR
  N["read n = 3"] --> A["int[] a = new int[3]"] --> L["for i in 0..2<br/>a[i] = sc.nextInt()"] --> D["[7, 2, 9]"]`,
    caption: "Read the size, then read each element into place.",
  },
  [`${c}/min-max-sum`]: {
    plain:
      "To find the largest value, assume the first element is the max, then walk the rest and update whenever you see something bigger. Starting with 0 is a bug: it fails when every number is negative.",
    diagram: `flowchart LR
  A["max = 3"] -->|"see 8"| B["max = 8"] -->|"see 5"| C["max = 8"] -->|"see 12"| D["max = 12"]`,
    caption: "Array [3, 8, 5, 12]: keep the best seen so far.",
  },

  // ── Strings ──
  [`${c}/string-creation`]: {
    plain:
      "Writing \"java\" reuses a shared copy from the string pool, like everyone pointing at the same notice board. new String(\"java\") always builds a separate copy on the heap. Same text, different objects.",
    diagram: `flowchart LR
  a["String a = #quot;java#quot;"] --> P["pool: #quot;java#quot;"]
  b["String b = #quot;java#quot;"] --> P
  c["String c = new String(#quot;java#quot;)"] --> H["heap: separate #quot;java#quot;"]`,
    caption: "Literals share one pooled object; new makes another.",
  },
  [`${c}/string-indexing`]: {
    plain:
      "Each character in a string has a position, starting at 0. The last character is at length() − 1. Asking for a position outside that range throws StringIndexOutOfBoundsException.",
    diagram: `flowchart LR
  c0["0: c"] --- c1["1: o"] --- c2["2: d"] --- c3["3: e"]`,
    caption: "\"code\": indexes 0 to 3, length 4.",
  },
  [`${c}/length-method`]: {
    plain:
      "length() counts the characters, including spaces. \"hi there\" has length 8. Note the brackets: strings use length(), arrays use length without brackets.",
    diagram: `flowchart LR
  S["#quot;hi there#quot;"] --> L["h i _ t h e r e<br/>8 characters"] --> R["length() = 8"]`,
    caption: "Spaces count too.",
  },
  [`${c}/charat-method`]: {
    plain:
      "charAt(i) hands you the single character at position i, as a char, not a String. Looping i from 0 to length() − 1 with charAt is how you walk through a string letter by letter.",
    diagram: `flowchart LR
  S["#quot;java#quot;.charAt(2)"] --> I["index 2"] --> R["'v'"]`,
    caption: "charAt returns one char.",
  },
  [`${c}/basic-string-problems`]: {
    plain:
      "Most beginner string problems use the same tool: walk the string with a loop and inspect each character. Reverse it by walking backwards; count vowels by checking each char; check a palindrome by comparing ends moving inwards.",
    diagram: `flowchart LR
  A["L → 'l'"] --- B["e"] --- C["v"] --- D["e"] --- E["'l' ← R"]
  A -.->|"compare ends, move inwards"| E`,
    caption: "Palindrome check: \"level\" matches from both ends.",
  },

  // ── Methods ──
  [`${c}/why-use-methods`]: {
    plain:
      "Without methods, the same 10 lines of code get copied everywhere, and a bug has to be fixed in every copy. A method writes it once with a clear name; every caller reuses it, and a fix in one place fixes all of them.",
    diagram: `flowchart LR
  A["main"] --> M["calculateGrade(marks)"]
  B["report"] --> M
  C["dashboard"] --> M`,
    caption: "One method, many callers.",
  },
  [`${c}/method-syntax`]: {
    plain:
      "A method signature reads like a label on a machine: who can use it (public), whether it needs an object (static), what it gives back (int), its name, and what it needs (parameters).",
    diagram: `flowchart LR
  A["public"] --> B["static"] --> C["int<br/>return type"] --> D["add<br/>name"] --> E["(int a, int b)<br/>parameters"] --> F["{ return a + b; }<br/>body"]`,
    caption: "The parts of a method declaration.",
  },
  [`${c}/method-parameters`]: {
    plain:
      "Parameters are the method's input slots; arguments are the actual values you put in when calling. Java copies each argument into its parameter, so changing a parameter inside the method doesn't change the caller's variable.",
    diagram: `flowchart LR
  A["call: square(n)<br/>n = 5"] -->|"copy 5"| P["parameter x = 5"]
  P --> X["x = x * x (x is 25)"]
  X -.->|"n is still 5"| A`,
    caption: "Java passes a copy of the value.",
  },
  [`${c}/return-values`]: {
    plain:
      "A return value is the answer a method hands back, which the caller can store, print or use in another calculation. The return type in the signature promises what kind of value comes back.",
    diagram: `flowchart LR
  C["int total = add(2, 3) * 10"] --> M["add returns 5"] --> R["total = 50"]`,
    caption: "The returned value is used like any other value.",
  },
  [`${c}/void-methods`]: {
    plain:
      "A void method does a job but hands nothing back, like a printer: you send it a page and it prints, there's no answer to store. You call it as a statement on its own line.",
    diagram: `flowchart LR
  V["void greet(name)"] --> S["prints 'Hello, name'"]
  V -.->|"no value returned"| X["can't do int x = greet(...)"]`,
    caption: "void means 'returns nothing'.",
  },
  [`${c}/method-overloading-basics`]: {
    plain:
      "Overloading lets several methods share a name as long as their parameter lists differ, like a print button that handles a page or a photo. Java picks the right one from the arguments you pass.",
    diagram: `flowchart LR
  A["area(5)"] --> M1["area(int side): square"]
  B["area(4, 6)"] --> M2["area(int l, int w): rectangle"]
  C["area(2.5)"] --> M3["area(double r): circle"]`,
    caption: "Same name, different parameters.",
  },

  // ── Memory & execution ──
  [`${c}/memory-execution-overview`]: {
    plain:
      "When a Java program runs, the JVM splits memory into areas with different jobs: the stack for method calls and local variables, the heap for objects, and a method area for class code. Each thread gets its own stack; all threads share the heap.",
    diagram: `flowchart TB
  JVM["JVM memory"] --> S["Stack (per thread)<br/>frames, local variables"]
  JVM --> H["Heap (shared)<br/>objects, arrays"]
  JVM --> M["Method area / Metaspace<br/>class code, static fields"]
  JVM --> PC["PC register (per thread)<br/>current instruction"]`,
    caption: "The main JVM runtime areas.",
  },
  [`${c}/jit-compilation`]: {
    plain:
      "The JVM starts by interpreting bytecode, which is quick to start but slow to run. It watches which methods run a lot ('hot' code) and compiles those to native machine code, so long-running programs get faster as they go.",
    diagram: `flowchart LR
  B["bytecode"] --> I["interpreter<br/>runs and counts calls"]
  I -->|"method is hot"| J["JIT compiler<br/>native code + optimisations"]
  J --> F["fast native execution"]
  I -->|"cold code"| I`,
    caption: "Hot methods get compiled to native code.",
  },
  [`${c}/execution-engine`]: {
    plain:
      "The execution engine is the JVM's motor: it reads bytecode instructions one by one, runs them with the interpreter or JIT-compiled code, and works with the garbage collector to keep memory tidy.",
    diagram: `flowchart LR
  CL["Class loader"] --> RA["Runtime data areas"]
  RA --> EE["Execution engine<br/>interpreter · JIT · GC"]
  EE --> N["Native interface<br/>OS calls"]`,
    caption: "Where the execution engine sits in the JVM.",
  },

  // ── Problem solving & recursion ──
  [`${c}/breaking-problems-into-steps`]: {
    plain:
      "A big problem becomes easy when you split it into small ones you already know how to solve, like a to-do list. 'Find the topper' is: read marks, find the maximum, find whose mark it is, print the name.",
    diagram: `flowchart TB
  P["Find the class topper"] --> A["read names and marks"]
  P --> B["find the highest mark"]
  P --> C["find who scored it"]
  P --> D["print the name"]`,
    caption: "Decompose a problem into steps you can code.",
  },
  [`${c}/recursive-case`]: {
    plain:
      "The recursive case is where the method makes the problem a little smaller and calls itself on that smaller piece. Each call must move closer to the base case, or it will never stop.",
    diagram: `flowchart LR
  A["sum(4) = 4 + sum(3)"] --> B["sum(3) = 3 + sum(2)"] --> C["sum(2) = 2 + sum(1)"] --> D["sum(1) = 1 · base"]`,
    caption: "Each call shrinks n by one until the base case.",
  },
  [`${c}/basic-recursion-problems`]: {
    plain:
      "Most beginner recursion problems follow one template: if the input is tiny, answer directly; otherwise do one small step and let the recursive call handle the rest. Reversing a string: last character + reverse of everything before it.",
    diagram: `flowchart TB
  R["reverse('abc')"] --> A["'c' + reverse('ab')"]
  A --> B["'b' + reverse('a')"]
  B --> C["'a' · base case"]
  C -.-> D["result 'cba'"]`,
    caption: "One step now, the rest by recursion.",
  },
};
