// Long-form theory for Programming Fundamentals module 5 (part 1): conditionals and jump statements. Original writing.
import { LessonTheory } from './utils';

const FLOW = { title: "The Java Tutorials: Control Flow Statements", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html" };
const IF_ELSE = { title: "The Java Tutorials: The if-then and if-then-else Statements", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html" };
const SWITCH = { title: "The Java Tutorials: The switch Statement", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html" };
const SWITCH_EXPR = { title: "JEP 361: Switch Expressions", url: "https://openjdk.org/jeps/361" };
const BRANCHING = { title: "The Java Tutorials: Branching Statements", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html" };
const OPS_EQUALITY = { title: "The Java Tutorials: Equality, Relational, and Conditional Operators", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html" };
const JLS_STATEMENTS = { title: "JLS Chapter 14: Blocks, Statements, and Patterns", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html" };
const REFACTORING_GUARD = { title: "Refactoring.Guru: Replace Nested Conditional with Guard Clauses", url: "https://refactoring.guru/replace-nested-conditional-with-guard-clauses" };

export const pfControlTheory: Record<string, LessonTheory> = {
  "what-is-control-flow": {
    theory: `Control flow is the order in which a program's statements execute. Without it, a program would run every line once, top to bottom, and could never make decisions or repeat work. Control flow statements let a program choose between paths, repeat steps, and jump out early. Every algorithm, from validating a password to searching a database, is built from three basic structures: sequence, selection and iteration. This lesson introduces those structures, Java's control flow statements, and how to reason about the paths through a program.

## The three basic structures

Computer scientists showed that any algorithm can be expressed using three structures, a result known as the **structured program theorem**:

1. **Sequence**: statements run one after another, in order
2. **Selection**: the program chooses which statements to run based on a condition
3. **Iteration**: the program repeats statements while a condition holds

~~~java
int marks = 72;                       // sequence
if (marks >= 40) {                    // selection
    System.out.println("Pass");
}
for (int i = 1; i <= 3; i++) {        // iteration
    System.out.println("Attempt " + i);
}
~~~

## Java's control flow statements

| Category | Statements | Purpose |
|---|---|---|
| Selection | \`if\`, \`if-else\`, \`else if\`, \`switch\`, ternary \`? :\` | Choose a path |
| Iteration | \`for\`, enhanced \`for\`, \`while\`, \`do-while\` | Repeat work |
| Jump | \`break\`, \`continue\`, \`return\` | Leave a loop, skip an iteration, exit a method |
| Exceptions | \`try\`, \`catch\`, \`finally\`, \`throw\` | Handle errors by jumping to handlers |

Each gets its own lesson in this module.

## Conditions drive control flow

Selection and iteration depend on **conditions**: expressions that evaluate to \`true\` or \`false\`. They're built from relational operators (\`<\`, \`==\`), logical operators (\`&&\`, \`||\`, \`!\`), boolean variables and methods that return booleans:

~~~java
if (age >= 18 && hasId) { ... }
while (!queue.isEmpty()) { ... }
~~~

Java requires conditions to be genuine booleans. \`if (count)\` with an int doesn't compile, which prevents a family of bugs common in C.

## Blocks

A **block** is a group of statements in braces. Control flow statements apply to the single statement or block that follows them:

~~~java
if (marks >= 40)
    System.out.println("Pass");
    System.out.println("Well done");   // always runs: not part of the if
~~~

The indentation suggests both lines belong to the if, but only the first does. Always using braces, even for one statement, prevents this bug. Variables declared inside a block exist only within it.

## Flowcharts

A **flowchart** draws control flow: rectangles for actions, diamonds for decisions, arrows for the order of execution. Flowcharts and pseudocode help plan logic before coding, and drawing one for a confusing function often reveals a missing case.

## Paths through a program

Each decision splits execution into paths. A method with two independent if statements has up to four paths; with ten, up to 1,024. This growth is why:

- testing must cover important paths, especially boundary cases
- deeply nested conditions are hard to understand
- small methods with few decisions are easier to get right

A metric called **cyclomatic complexity** counts the independent paths in a method; tools flag methods where it gets high.

## Tracing execution

To understand control flow, trace a program by hand with concrete values: track each variable and note which branch runs and how many times each loop repeats. A trace table with one column per variable and one row per step is a reliable way to find logic errors and to solve output questions in interviews.

## Structured versus unstructured flow

Early languages used \`goto\` to jump anywhere, producing tangled "spaghetti code". Java reserves the word \`goto\` but doesn't implement it. Its jump statements are restricted: \`break\` and \`continue\` affect only loops and switches, and \`return\` exits only the current method. These limits keep control flow readable.

## Choosing the right structure

- one condition, one optional action: \`if\`
- two alternatives: \`if-else\`
- several ranges or unrelated conditions: \`else if\` ladder
- one value compared against fixed options: \`switch\`
- choosing between two values in an expression: ternary
- repeat a known number of times: \`for\`
- repeat until something happens: \`while\`
- run at least once: \`do-while\`

## How interviewers test this

Expect "What are the types of control statements in Java?", output questions that require tracing branches and loops, and bugs caused by missing braces. Name sequence, selection and iteration, list Java's statements by category, and demonstrate tracing with a table of variable values.`,
    sources: [FLOW, JLS_STATEMENTS],
  },

  "if-statement": {
    theory: `The \`if\` statement is the most basic decision in programming: run some code only when a condition is true. It's how programs react to input, validate data and handle special cases. Although it looks trivial, writing correct if statements depends on precise conditions, correct use of braces, and avoiding a handful of classic traps. This lesson covers syntax, how conditions are evaluated, block scope, common mistakes, and habits that keep conditions readable.

## Syntax

~~~java
if (condition) {
    // runs only when condition is true
}
// execution continues here either way
~~~

The condition must be a boolean expression inside parentheses. If it's true, the block runs; if false, the block is skipped. Either way, execution continues after the closing brace.

~~~java
int stock = 3;
if (stock < 5) {
    System.out.println("Low stock: reorder soon");
}
~~~

## Building conditions

Conditions combine relational and logical operators:

~~~java
if (age >= 18) { ... }
if (score >= 40 && attendance >= 75) { ... }
if (input.isEmpty() || input.length() > 100) { ... }
if (!isLoggedIn) { ... }
~~~

Methods that return booleans read naturally in conditions: \`if (list.contains(item))\`, \`if (Character.isDigit(c))\`.

## Always use braces

Braces are optional when the body is a single statement, but leaving them out invites bugs:

~~~java
if (balance < 0)
    System.out.println("Overdrawn");
    applyFee();          // runs every time, despite the indentation
~~~

A famous real-world security bug in Apple's SSL code (2014) came from a duplicated line after a brace-less if. Most style guides require braces always.

## The stray semicolon

~~~java
if (marks > 90); {
    System.out.println("Distinction");   // always prints
}
~~~

The semicolon ends the if statement with an empty body. The block after it is an ordinary block that always runs. The code compiles silently, so this bug can be hard to spot.

## Assignment instead of comparison

\`if (x = 5)\` doesn't compile in Java, because the assignment produces an int. With booleans it compiles and misbehaves:

~~~java
boolean done = false;
if (done = true) { ... }   // assigns true; the block always runs
~~~

Write \`if (done)\` instead of comparing booleans with \`==\` at all.

## Comparing strings

\`if (name == "admin")\` compares references and may fail even when the text matches. Use \`if (name.equals("admin"))\`, or \`"admin".equals(name)\`, which also handles a null \`name\` without throwing.

## Block scope

Variables declared inside an if block exist only inside it:

~~~java
if (marks >= 40) {
    String result = "Pass";
}
System.out.println(result);   // compile error: result isn't in scope
~~~

Declare the variable before the if when you need it afterwards.

## Independent ifs versus chained decisions

Separate if statements are each checked independently:

~~~java
if (marks >= 90) System.out.println("A");
if (marks >= 75) System.out.println("B");
// marks = 95 prints both A and B
~~~

If only one outcome should happen, use \`else if\`, covered in the next lessons. Choosing between independent ifs and a chain is a common source of logic errors.

## Guard clauses

An if that exits early handles special cases first and keeps the main logic unindented:

~~~java
static double average(int[] nums) {
    if (nums.length == 0) {
        return 0;               // guard clause
    }
    int sum = 0;
    for (int n : nums) sum += n;
    return (double) sum / nums.length;
}
~~~

## Readable conditions

- name complex conditions: \`boolean eligible = age >= 18 && hasId && !isBanned;\` then \`if (eligible)\`
- avoid negated compound conditions; apply De Morgan's laws to simplify them
- put the expected or common case first when it helps the reader
- return boolean results directly: \`return marks >= 40;\` instead of an if returning true or false

## Boundary conditions

Many bugs live at boundaries. Is a mark of exactly 40 a pass? Does \`>\` or \`>=\` match the requirement? Test values at, slightly below and slightly above each boundary.

## A quick summary

An \`if\` runs its block only when a boolean condition is true, then execution continues either way. Use braces every time, watch for stray semicolons after the condition, compare strings with \`equals\`, and test the values on both sides of every boundary.

## How interviewers test this

Expect output questions with a stray semicolon, missing braces or \`==\` on strings, and short tasks such as "print whether a number is positive". Show correct syntax with braces, explain why the semicolon creates an empty body, use equals for strings, and mention guard clauses.`,
    sources: [IF_ELSE, JLS_STATEMENTS],
  },

  "if-else-statement": {
    theory: `The \`if-else\` statement chooses between exactly two paths: one runs when the condition is true, the other when it's false. Exactly one of the two blocks always executes. It models every binary decision a program makes: pass or fail, valid or invalid, even or odd. This lesson covers syntax, how if-else differs from separate ifs, the dangling-else problem, returning from both branches, and when the ternary operator is a better fit.

## Syntax

~~~java
if (condition) {
    // runs when condition is true
} else {
    // runs when condition is false
}
~~~

~~~java
int n = 7;
if (n % 2 == 0) {
    System.out.println(n + " is even");
} else {
    System.out.println(n + " is odd");
}
~~~

The \`else\` has no condition of its own; it catches every case the \`if\` didn't.

## Exactly one branch runs

Compare these two versions:

~~~java
// Version A: if-else
if (marks >= 40) System.out.println("Pass");
else System.out.println("Fail");

// Version B: two independent ifs
if (marks >= 40) System.out.println("Pass");
if (marks < 40) System.out.println("Fail");
~~~

They behave the same here, but Version B evaluates two conditions, and if someone later edits one boundary (say, to \`marks > 40\`), a mark of exactly 40 prints nothing. if-else guarantees that every case lands in exactly one branch.

## The dangling else

Without braces, an \`else\` belongs to the **nearest** unmatched \`if\`, regardless of indentation:

~~~java
if (age >= 18)
    if (hasTicket)
        System.out.println("Enter");
else
    System.out.println("Too young");   // actually pairs with if (hasTicket)
~~~

An adult without a ticket sees "Too young". Braces make the intended pairing explicit:

~~~java
if (age >= 18) {
    if (hasTicket) {
        System.out.println("Enter");
    }
} else {
    System.out.println("Too young");
}
~~~

## Variables assigned in both branches

A common pattern assigns a variable differently in each branch. Java's definite assignment rules accept this, even for final variables:

~~~java
final String category;
if (age < 18) {
    category = "Minor";
} else {
    category = "Adult";
}
System.out.println(category);
~~~

If only one branch assigned \`category\`, the compiler would reject the print statement.

## Returning from both branches

When both branches return, the method needs no return after the if-else:

~~~java
static int max(int a, int b) {
    if (a >= b) {
        return a;
    } else {
        return b;
    }
}
~~~

Many developers drop the \`else\` after a return, since the code after the if only runs when the condition was false:

~~~java
static int max(int a, int b) {
    if (a >= b) return a;
    return b;
}
~~~

Both are correct; choose one style and apply it consistently.

## Ternary for choosing a value

When both branches only compute a value, the ternary operator is more concise:

~~~java
String result = marks >= 40 ? "Pass" : "Fail";
int larger = a >= b ? a : b;     // or Math.max(a, b)
~~~

Use if-else when branches perform actions or contain several statements.

## Avoiding redundant branches

~~~java
// Redundant
if (isValid) {
    return true;
} else {
    return false;
}

// Better
return isValid;
~~~

Likewise, \`if (x > 0) flag = true; else flag = false;\` is \`flag = x > 0;\`.

## Keeping branches balanced

If one branch is three lines and the other is fifty, readers lose track of the condition by the time they reach the else. Handle the short case first, or extract the long branch into a well-named method.

## Examples worth practising

- positive or negative (decide where zero goes)
- leap year or not
- eligible to vote or not
- larger of two numbers
- vowel or consonant for a letter

Each forces you to choose the condition precisely and test the boundary.

## A quick summary

Use \`if-else\` whenever exactly one of two outcomes must happen. Braces settle which \`if\` an \`else\` belongs to, assigning a variable in both branches satisfies definite assignment, and a ternary or a direct boolean return replaces branches that only produce a value. When one branch grows long, move it into a well-named method so the decision stays visible at a glance.

## How interviewers test this

Expect dangling-else output questions, rewrites of redundant if-else into a single return, and basic tasks like even or odd. Explain that exactly one branch runs, that else binds to the nearest if, and when the ternary operator or a direct boolean return is cleaner.`,
    sources: [IF_ELSE, JLS_STATEMENTS],
  },

  "else-if-ladder": {
    theory: `An else-if ladder checks a series of conditions in order and runs the first branch whose condition is true. It handles decisions with more than two outcomes, such as grading by score ranges, classifying ages, or computing tax slabs. The order of conditions matters, and getting it wrong is one of the most common logic errors in beginner code. This lesson covers the syntax, how evaluation proceeds, ordering rules for ranges, the final else, and when a switch or a lookup is a better choice.

## Syntax

~~~java
if (condition1) {
    // runs if condition1 is true
} else if (condition2) {
    // runs if condition1 is false and condition2 is true
} else if (condition3) {
    // ...
} else {
    // runs if none of the conditions are true
}
~~~

Java has no special \`elseif\` keyword: an else-if ladder is an if-else whose else branch is another if statement, formatted flat for readability.

## Evaluation stops at the first match

~~~java
int marks = 82;
if (marks >= 90) {
    grade = 'A';
} else if (marks >= 75) {
    grade = 'B';
} else if (marks >= 60) {
    grade = 'C';
} else if (marks >= 40) {
    grade = 'D';
} else {
    grade = 'F';
}
~~~

For 82, the first condition is false, the second is true, so the grade is B and the remaining conditions are never checked. Exactly one branch runs.

Because earlier conditions have already failed, later conditions can rely on that. The \`marks >= 75\` branch doesn't need \`&& marks < 90\`; reaching it already implies marks < 90.

## Order matters

Reversing the order breaks the logic:

~~~java
if (marks >= 40) {
    grade = 'D';            // 95 lands here
} else if (marks >= 60) {
    grade = 'C';            // unreachable for anything ≥ 40
} else if (marks >= 90) {
    grade = 'A';
}
~~~

Every passing mark matches the first condition. With "greater than or equal" ranges, check from the **highest** threshold down; with "less than" ranges, check from the lowest up. The compiler won't warn you about this mistake.

## Ladder versus separate ifs

Separate ifs evaluate every condition, and several can run:

~~~java
if (marks >= 90) System.out.println("A");
if (marks >= 75) System.out.println("B");   // also prints for 95
~~~

Use a ladder when outcomes are mutually exclusive; use separate ifs when each check is independent, such as printing every warning that applies.

## The final else

The final else catches everything not handled above. Include it when:

- there's a sensible default, such as grade F
- you want to detect unexpected values: \`else { throw new IllegalArgumentException("Invalid marks: " + marks); }\`

Leaving it out means some inputs do nothing, which may be correct or may hide a bug. Validating input range first, such as rejecting marks below 0 or above 100, keeps ladders honest.

## Boundaries

Range-based ladders need careful boundaries. Is 75 a B or a C? Write test cases at each boundary: 89, 90, 74, 75, 39, 40, and the extremes 0 and 100. Off-by-one boundary mistakes (\`>\` versus \`>=\`) are the most common bug in grading and tax problems.

## Example: income tax slabs

~~~java
double tax;
if (income <= 300_000) {
    tax = 0;
} else if (income <= 700_000) {
    tax = (income - 300_000) * 0.05;
} else if (income <= 1_000_000) {
    tax = 400_000 * 0.05 + (income - 700_000) * 0.10;
} else {
    tax = 400_000 * 0.05 + 300_000 * 0.10 + (income - 1_000_000) * 0.15;
}
~~~

(The slabs here are illustrative, not real tax rules.) Ordering from lowest to highest works because each condition uses \`<=\`.

## When to use something else

- comparing **one variable against fixed values** (menu choices, day names, commands): a \`switch\` is clearer
- mapping keys to values with no logic: a \`Map\` or array lookup replaces the whole ladder, such as \`String[] dayNames\` indexed by day number
- long ladders that keep growing as types are added: polymorphism, covered in the OOP course

## Readability tips

- keep conditions in a consistent direction (all \`>=\`, descending)
- put each branch's body in braces
- keep bodies short; extract long branches into methods
- avoid mixing unrelated conditions in one ladder

## How interviewers test this

Expect grading or tax-slab problems, output questions where conditions are in the wrong order, and "difference between multiple ifs and else-if." Explain first-match evaluation, why ranges must be ordered from the most restrictive threshold, the role of the final else, and boundary testing.`,
    sources: [IF_ELSE, JLS_STATEMENTS],
  },

  "nested-conditions": {
    theory: `A nested condition is an if statement inside another if statement. Nesting expresses decisions that depend on earlier decisions: only check the password if the user exists, only apply a discount if the order qualifies. Nesting is sometimes necessary, but deep nesting makes code hard to read and test. This lesson covers how nested conditions work, when they're the right tool, how to flatten them with logical operators and guard clauses, and the dangling-else trap.

## How nesting works

~~~java
if (userExists) {
    if (passwordCorrect) {
        System.out.println("Welcome");
    } else {
        System.out.println("Wrong password");
    }
} else {
    System.out.println("No such user");
}
~~~

The inner if is evaluated only when the outer condition is true. Each level adds a further requirement to reach the code inside it.

## When nesting is appropriate

Nesting fits when the inner decision only makes sense after the outer one, and each level has its own else behaviour. In the login example, the three outcomes ("Welcome", "Wrong password", "No such user") need distinct messages, so nesting expresses the structure directly.

Another legitimate case is when the outer check protects the inner one from errors:

~~~java
if (order != null) {
    if (order.getTotal() > 1000) {
        applyDiscount(order);
    }
}
~~~

Here, though, the nesting can be flattened, as shown next.

## Flattening with &&

When inner and outer conditions have no separate else branches, combine them:

~~~java
if (order != null && order.getTotal() > 1000) {
    applyDiscount(order);
}
~~~

Short-circuit evaluation keeps this safe: if \`order\` is null, the second condition is never evaluated. One condition reads more easily than two nested ones.

## The arrow anti-pattern

Deep nesting pushes code to the right, forming an arrow shape:

~~~java
if (user != null) {
    if (user.isActive()) {
        if (cart != null) {
            if (!cart.isEmpty()) {
                if (payment.isValid()) {
                    placeOrder();
                }
            }
        }
    }
}
~~~

Readers must keep five conditions in mind, and each failure case is buried. This is often called **arrow code**.

## Guard clauses

Handle failure cases first and exit early, leaving the main logic at the top level:

~~~java
static void checkout(User user, Cart cart, Payment payment) {
    if (user == null || !user.isActive()) {
        System.out.println("Please log in");
        return;
    }
    if (cart == null || cart.isEmpty()) {
        System.out.println("Your cart is empty");
        return;
    }
    if (!payment.isValid()) {
        System.out.println("Payment failed");
        return;
    }
    placeOrder();
}
~~~

Each guard deals with one problem and leaves. The "happy path" reads straight down at the end. Inside loops, \`continue\` plays the same role, skipping to the next item when a condition fails.

## Extracting methods

When a nested block grows, moving it into a well-named method reduces nesting and documents intent:

~~~java
if (isEligibleForDiscount(order)) {
    applyDiscount(order);
}
~~~

## The dangling else

Without braces, an else binds to the nearest unmatched if:

~~~java
if (a > 0)
    if (b > 0)
        System.out.println("both positive");
else
    System.out.println("a is not positive");   // actually belongs to if (b > 0)
~~~

Always use braces in nested conditions to make the pairing explicit.

## Example: largest of three numbers

Nested version:

~~~java
if (a >= b) {
    if (a >= c) largest = a;
    else largest = c;
} else {
    if (b >= c) largest = b;
    else largest = c;
}
~~~

Flattened version:

~~~java
if (a >= b && a >= c) largest = a;
else if (b >= c) largest = b;
else largest = c;
~~~

Library version: \`Math.max(a, Math.max(b, c))\`. Interviewers often accept any correct version but appreciate seeing the cleanest one.

## Testing nested logic

Each level of nesting multiplies the number of paths. List every combination of outer and inner outcomes and test each one. For the login example: user missing; user present with wrong password; user present with correct password.

## A quick summary

Nest conditions only when each level has its own else behaviour. Otherwise, combine conditions with \`&&\`, which short-circuits safely, or handle failure cases first with guard clauses and early returns. Use braces at every level so each \`else\` pairs with the \`if\` you intended, and list every combination of outcomes when you test.

## How interviewers test this

Expect "find the largest of three numbers", dangling-else output questions, and code reviews asking how to reduce nesting. Show both nested and flattened solutions, explain combining conditions with short-circuit &&, and refactor arrow code with guard clauses.`,
    sources: [IF_ELSE, REFACTORING_GUARD],
  },

  "switch-statement": {
    theory: `A \`switch\` compares one value against a list of constant cases and runs the matching branch. It's clearer than a long else-if ladder when you're checking a single variable against fixed options, such as menu choices, days of the week or command names. Java's switch has evolved: the classic form with \`case ... :\` and \`break\` has a notorious fall-through behaviour, while modern switch expressions with arrows (Java 14) are safer and more concise. This lesson covers both forms, allowed types, fall-through, and pattern matching.

## Classic switch statement

~~~java
int day = 3;
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    default:
        System.out.println("Other day");
}
~~~

Java evaluates the expression once, jumps to the matching case label, and runs statements until it hits \`break\` or the end of the switch. \`default\` runs when no case matches.

## Fall-through

Without \`break\`, execution continues into the next case:

~~~java
int day = 1;
switch (day) {
    case 1:
        System.out.println("Monday");
    case 2:
        System.out.println("Tuesday");
    default:
        System.out.println("Other day");
}
// Monday
// Tuesday
// Other day
~~~

Forgetting a break is one of the most common switch bugs, and it's a favourite output question. Fall-through is occasionally useful for grouping cases:

~~~java
switch (month) {
    case 12: case 1: case 2:
        season = "Winter";
        break;
    case 3: case 4: case 5:
        season = "Summer";
        break;
    default:
        season = "Other";
}
~~~

When you intentionally fall through after statements, add a comment saying so.

## Allowed types

A switch works on:

- \`int\` and smaller integer types: \`byte\`, \`short\`, \`char\`, and their wrappers
- \`String\` (Java 7+), compared with \`equals\`
- enum types
- any reference type with pattern matching (Java 21)

It doesn't work on \`long\`, \`float\`, \`double\` or \`boolean\`. Case labels must be compile-time constants, and duplicates are compile errors. A null String or enum in a classic switch throws NullPointerException.

## Arrow syntax (Java 14+)

The arrow form has no fall-through and allows comma-separated labels:

~~~java
switch (day) {
    case 1, 7 -> System.out.println("Weekend");
    case 2, 3, 4, 5, 6 -> System.out.println("Weekday");
    default -> System.out.println("Invalid day");
}
~~~

Each arrow runs only its own expression, block or throw statement. No \`break\` is needed.

## Switch expressions

A switch can also produce a value:

~~~java
String name = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    case 4 -> "Thursday";
    case 5 -> "Friday";
    case 6, 7 -> "Weekend";
    default -> throw new IllegalArgumentException("Invalid day: " + day);
};
~~~

A switch expression must be **exhaustive**: every possible value must be handled, usually with a default. For enums, listing every constant satisfies exhaustiveness without a default, and the compiler flags missing constants when new ones are added.

When a case needs several statements, use a block and \`yield\` to produce the value:

~~~java
int fee = switch (plan) {
    case "basic" -> 0;
    case "pro" -> {
        int base = 499;
        yield isStudent ? base / 2 : base;
    }
    default -> throw new IllegalArgumentException(plan);
};
~~~

## Switch on strings

~~~java
switch (command.toLowerCase()) {
    case "start" -> start();
    case "stop" -> stop();
    default -> System.out.println("Unknown command");
}
~~~

Matching is case-sensitive, so normalize input first.

## Pattern matching in switch (Java 21)

Modern switch can test types and bind variables:

~~~java
String describe(Object o) {
    return switch (o) {
        case Integer i when i > 0 -> "positive integer " + i;
        case Integer i -> "integer " + i;
        case String s -> "string of length " + s.length();
        case null -> "null";
        default -> "something else";
    };
}
~~~

The \`when\` clause adds a condition, called a guard. This is useful with sealed class hierarchies, covered in the OOP course.

## Switch versus if-else

- use switch for one value compared with many constants
- use if-else for ranges (\`marks >= 90\`), conditions on several variables, or non-constant comparisons

## A quick summary

Reach for \`switch\` when one value is compared against fixed constants. In the classic form, end each case with \`break\` unless fall-through is intended. Prefer arrow cases and switch expressions in modern Java: they never fall through, they return values, and the compiler checks that every case is handled.

## How interviewers test this

Expect fall-through output questions, "Which types can a switch use?", "Can you switch on a long or a String?" and conversions to switch expressions. Explain break and fall-through, list allowed types, show the arrow form and \`yield\`, and mention exhaustiveness.`,
    sources: [SWITCH, SWITCH_EXPR],
  },

  "ternary-operator": {
    theory: `The ternary operator, \`condition ? valueIfTrue : valueIfFalse\`, is a compact if-else that produces a value. It's Java's only operator with three operands, and it shines when choosing between two values for an assignment, a return or an argument. Overused or nested, it becomes hard to read. Its type rules also cause surprising results when the two branches have different types. This lesson covers syntax, when to use it, nesting, type rules and common traps.

## Syntax

~~~java
result = condition ? expression1 : expression2;
~~~

If the condition is true, the whole expression evaluates to expression1; otherwise to expression2. Only the chosen branch is evaluated.

~~~java
int a = 7, b = 12;
int max = a > b ? a : b;                         // 12
String parity = n % 2 == 0 ? "even" : "odd";
String label = count == 1 ? "item" : "items";
System.out.println(count + " " + label);
~~~

## Ternary versus if-else

The equivalent if-else for \`max\` takes five lines:

~~~java
int max;
if (a > b) {
    max = a;
} else {
    max = b;
}
~~~

The ternary is better when:

- both branches produce a value of the same kind
- the expressions are short
- the result goes directly into an assignment, return or method argument

if-else is better when branches perform actions (printing, updating several variables), contain multiple statements, or need explanatory comments. The ternary is an **expression**, not a statement: \`x > 0 ? print("pos") : print("neg");\` doesn't compile as a standalone statement.

## Common uses

~~~java
return list.isEmpty() ? 0 : list.get(0);                 // safe default
String name = input != null ? input : "Guest";            // null fallback
System.out.println("Status: " + (active ? "on" : "off")); // inline in output
int abs = x < 0 ? -x : x;                                 // absolute value
~~~

For null fallbacks, \`Objects.requireNonNullElse(input, "Guest")\` expresses the same idea by name.

## Precedence and parentheses

The ternary has low precedence, below arithmetic, comparison and logical operators, but above assignment. Inside a concatenation, it must be wrapped in parentheses:

~~~java
System.out.println("Result: " + score > 40 ? "pass" : "fail");     // compile error
System.out.println("Result: " + (score > 40 ? "pass" : "fail"));   // correct
~~~

Without parentheses, \`"Result: " + score\` happens first, producing a String, which can't be compared with \`>\`.

## Nested ternaries

The ternary is right-associative, so nesting chains from the right:

~~~java
String grade = marks >= 90 ? "A"
             : marks >= 75 ? "B"
             : marks >= 40 ? "C"
             : "F";
~~~

Formatted one condition per line, this reads like a ladder. Nested ternaries inside the **true** branch, or on one long line, quickly become unreadable. Many teams allow at most one level; an else-if ladder or switch expression is clearer beyond that.

## Type rules

Both branches must produce compatible types, and the result type is determined by both:

~~~java
System.out.println(true ? 1 : 2.0);    // prints 1.0
~~~

When one branch is int and the other double, numeric promotion makes the whole expression a double, even when the int branch is chosen.

A more dangerous case mixes a wrapper and a primitive:

~~~java
Integer cached = null;
int value = flag ? cached : 0;          // NullPointerException when flag is true
~~~

Because one branch is the primitive 0, Java unboxes \`cached\` to int, and unboxing null throws. Such bugs are hard to spot in code review.

## Side effects

Only the selected branch runs, so side effects in the other branch don't happen:

~~~java
int x = 5;
int y = x > 3 ? x++ : x--;   // y = 5, x = 6; x-- never runs
~~~

Keep side effects out of ternaries; they make code harder to follow.

## The conditional operator in other contexts

Ternaries work anywhere an expression is allowed: array indices, method arguments, lambda bodies and field initializers. That flexibility is useful but tempting: if a reader needs to stop and parse it, an if-else is probably kinder.

## Switch expressions as an alternative

For choosing among many values based on one variable, a switch expression is cleaner than nested ternaries:

~~~java
String dayType = switch (day) {
    case SATURDAY, SUNDAY -> "Weekend";
    default -> "Weekday";
};
~~~

## How interviewers test this

Expect output questions like \`true ? 1 : 2.0\`, precedence errors with concatenation, "find the max of three numbers using the ternary operator" and rewrites between if-else and ternary. Explain that only one branch is evaluated, the numeric promotion rule, the unboxing NullPointerException, and when if-else is more readable.`,
    sources: [OPS_EQUALITY, JLS_STATEMENTS],
  },

  "break-statement": {
    theory: `The \`break\` statement immediately exits the nearest enclosing loop or switch, and execution continues with the statement after it. It's used to stop searching once a result is found, to end loops whose exit condition is discovered mid-iteration, and to prevent fall-through in classic switch statements. Labeled breaks can exit several nested loops at once. This lesson covers each use, how break interacts with nested loops, and when a different structure would be clearer.

## break in a loop

~~~java
int[] nums = {4, 8, 15, 16, 23, 42};
int target = 16;
int foundAt = -1;
for (int i = 0; i < nums.length; i++) {
    if (nums[i] == target) {
        foundAt = i;
        break;          // stop searching: no need to check the rest
    }
}
System.out.println(foundAt);   // 3
~~~

Without the break, the loop would continue through the remaining elements, wasting time. For large data, stopping early can matter a great deal, though the worst-case complexity doesn't change.

## break with while(true)

Some loops discover their exit condition in the middle of the body. An infinite loop with a break expresses this directly:

~~~java
Scanner sc = new Scanner(System.in);
while (true) {
    System.out.print("Command (q to quit): ");
    String cmd = sc.nextLine().trim();
    if (cmd.equals("q")) {
        break;
    }
    process(cmd);
}
System.out.println("Bye");
~~~

This avoids duplicating the prompt before the loop and at its end. Make sure every path through such a loop eventually reaches the break.

## break in switch

In a classic switch, break ends the case and prevents falling into the next one:

~~~java
switch (choice) {
    case 1:
        startGame();
        break;
    case 2:
        showScores();
        break;
    default:
        System.out.println("Invalid choice");
}
~~~

Arrow-style switches (\`case 1 -> ...\`) don't fall through, so they don't need break.

## break exits only the innermost loop

In nested loops, a plain break leaves only the loop that directly contains it:

~~~java
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) break;          // exits the inner loop only
        System.out.println(i + "," + j);
    }
}
// 0,0
// 1,0
// 2,0
~~~

The outer loop keeps running. This trips up many beginners searching a 2D grid: they find the target, break, and the outer loop continues anyway.

## Labeled break

A label names a loop, and \`break label;\` exits that loop, however deeply nested the break is:

~~~java
int[][] grid = {{1, 2}, {3, 4}, {5, 6}};
int target = 4;
search:
for (int r = 0; r < grid.length; r++) {
    for (int c = 0; c < grid[r].length; c++) {
        if (grid[r][c] == target) {
            System.out.println("Found at " + r + "," + c);
            break search;           // exits both loops
        }
    }
}
~~~

Labels are identifiers followed by a colon, placed directly before a loop. They're legal but uncommon; many developers prefer extracting the search into a method and using \`return\`, which exits all loops naturally:

~~~java
static int[] find(int[][] grid, int target) {
    for (int r = 0; r < grid.length; r++)
        for (int c = 0; c < grid[r].length; c++)
            if (grid[r][c] == target) return new int[]{r, c};
    return null;
}
~~~

## Using a flag instead

Another alternative is a boolean flag in the loop condition:

~~~java
boolean found = false;
for (int i = 0; i < n && !found; i++) {
    if (nums[i] == target) found = true;
}
~~~

Flags work, but they add a variable and spread the exit logic across the condition and body. break or return usually reads more directly.

## Where break isn't allowed

\`break\` outside a loop or switch is a compile error. It can't exit an if statement on its own; an if inside a loop with a break exits the loop, not the if. A labeled break can technically target a labeled block, but this is rare and confusing.

## break versus continue versus return

| Statement | Effect |
|---|---|
| \`break\` | Exit the nearest loop or switch entirely |
| \`continue\` | Skip the rest of this iteration, go to the next |
| \`return\` | Exit the whole method, optionally with a value |

## Readability guidelines

- use break for early exit when a result is found
- keep loops with several breaks short, so readers can see every exit
- prefer extracting a method and using return over labeled breaks
- in \`while (true)\` loops, put the break condition near the top when possible

## How interviewers test this

Expect output questions with break in nested loops, fall-through when break is missing in a switch, and "how do you exit two loops at once?" Explain that break exits only the innermost loop, show labeled break and the return-based alternative, and contrast break with continue and return.`,
    sources: [BRANCHING, JLS_STATEMENTS],
  },

  "continue-statement": {
    theory: `The \`continue\` statement skips the rest of the current loop iteration and moves on to the next one. Where \`break\` leaves the loop entirely, continue stays in the loop but abandons this pass. It's useful for filtering: skip invalid entries, skip items that don't match, and handle the interesting cases without deep nesting. This lesson explains how continue behaves in each kind of loop, labeled continue, the infinite-loop trap in while loops, and when to use it.

## Basic use

~~~java
for (int i = 1; i <= 10; i++) {
    if (i % 3 == 0) {
        continue;            // skip multiples of 3
    }
    System.out.print(i + " ");
}
// 1 2 4 5 7 8 10
~~~

When \`i\` is a multiple of 3, continue jumps straight to the next iteration, skipping the print.

## Where continue jumps

The destination depends on the loop type:

| Loop | After continue |
|---|---|
| \`for\` | Runs the update expression (\`i++\`), then checks the condition |
| enhanced \`for\` | Moves to the next element |
| \`while\` | Jumps directly to the condition check |
| \`do-while\` | Jumps to the condition check at the bottom |

The difference between \`for\` and \`while\` matters a great deal, as the next section shows.

## The while-loop trap

~~~java
int i = 0;
while (i < 10) {
    if (i % 2 == 0) {
        continue;            // i never increments: infinite loop
    }
    System.out.println(i);
    i++;
}
~~~

In a for loop, the update runs automatically after continue. In a while loop, the update is an ordinary statement in the body, and continue skips it. Here, \`i\` stays at 0 forever. Fix it by incrementing before the continue, or put the update at the top of the body:

~~~java
int i = 0;
while (i < 10) {
    i++;
    if (i % 2 == 0) continue;
    System.out.println(i);
}
~~~

## continue as a filter

continue keeps the main logic unindented by rejecting unwanted items early, much like guard clauses in methods:

~~~java
for (String line : lines) {
    if (line.isBlank()) continue;            // skip empty lines
    if (line.startsWith("#")) continue;      // skip comments
    String[] parts = line.split(",");
    if (parts.length != 3) continue;         // skip malformed rows
    process(parts);
}
~~~

The alternative, nesting the processing inside three ifs, pushes the main work far to the right.

## continue in nested loops

A plain continue affects only the innermost loop:

~~~java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == 2) continue;                // skips j == 2 only
        System.out.println(i + "," + j);
    }
}
// 1,1  1,3  2,1  2,3  3,1  3,3
~~~

## Labeled continue

A labeled continue skips to the next iteration of an **outer** loop:

~~~java
outer:
for (int i = 2; i <= 20; i++) {
    for (int d = 2; d * d <= i; d++) {
        if (i % d == 0) continue outer;      // i isn't prime: try the next i
    }
    System.out.print(i + " ");
}
// 2 3 5 7 11 13 17 19
~~~

As soon as a divisor is found, the inner loop is abandoned and the outer loop moves on. Like labeled break, this is legal but uncommon; extracting \`isPrime(i)\` into a method often reads better.

## continue versus if-else

These are equivalent:

~~~java
for (int n : nums) {
    if (n < 0) continue;
    total += n;
}

for (int n : nums) {
    if (n >= 0) {
        total += n;
    }
}
~~~

For a one-line body, the if version is often clearer. continue earns its place when there are several skip conditions or the main body is long.

## Streams as an alternative

Modern Java can express filtering declaratively:

~~~java
int total = Arrays.stream(nums).filter(n -> n >= 0).sum();
~~~

Loops with continue remain common and are often easier to debug, but recognizing the filter pattern helps when reading stream-based code.

## Where continue isn't allowed

continue is valid only inside loops. Unlike break, it has no meaning in a switch on its own: a continue inside a switch that's inside a loop continues the loop.

## Pitfalls

- forgetting the update in while and do-while loops, causing infinite loops
- several continues scattered through a long body, which makes the flow hard to follow
- using continue where break was intended, so the loop keeps running after the answer is found

## How interviewers test this

Expect output questions mixing break and continue, the infinite while loop trap, and tasks such as "print numbers from 1 to 50 except multiples of 5". Explain where continue jumps in each loop type, why the for loop's update still runs, and show labeled continue with the prime-number example.`,
    sources: [BRANCHING, JLS_STATEMENTS],
  },

  "return-statement": {
    theory: `The \`return\` statement ends the current method and hands control back to the caller, optionally sending a value back. It's how methods produce results and how they exit early when there's nothing more to do. Java's compiler checks return statements strictly: a non-void method must return a value on every path, and code after an unconditional return is rejected as unreachable. This lesson covers returning values, early returns, return in void methods, compiler rules, and the interaction with loops and finally blocks.

## Returning a value

~~~java
static int square(int n) {
    return n * n;
}

int result = square(7);   // 49
~~~

The expression after \`return\` is evaluated, converted to the method's declared return type if needed (for example int to long), and passed back. The caller can store it, print it, or use it in a larger expression.

## return in void methods

A \`void\` method returns nothing, but it can still use a bare \`return;\` to exit early:

~~~java
static void printReport(List<String> items) {
    if (items.isEmpty()) {
        System.out.println("Nothing to report");
        return;
    }
    for (String item : items) {
        System.out.println("- " + item);
    }
}
~~~

Writing \`return 5;\` in a void method, or a bare \`return;\` in a non-void method, is a compile error.

## Every path must return

The compiler checks that a non-void method returns a value on all paths:

~~~java
static String grade(int marks) {
    if (marks >= 40) {
        return "Pass";
    }
    // compile error: missing return statement
}
~~~

Even when you know the condition always holds, the compiler requires a return or a thrown exception on every path:

~~~java
static String grade(int marks) {
    if (marks >= 40) {
        return "Pass";
    }
    return "Fail";
}
~~~

## Unreachable code

Statements after an unconditional return can never run, and Java reports them as errors:

~~~java
return total;
System.out.println("done");   // compile error: unreachable statement
~~~

## Early returns

Returning as soon as the answer is known keeps code flat and avoids extra variables:

~~~java
static boolean contains(int[] nums, int target) {
    for (int n : nums) {
        if (n == target) {
            return true;      // found: exit the method, and the loop
        }
    }
    return false;             // checked everything
}
~~~

A return inside nested loops exits all of them at once, which is often cleaner than labeled breaks.

## A common bug: returning too early

~~~java
static boolean allPositive(int[] nums) {
    for (int n : nums) {
        if (n > 0) {
            return true;      // wrong: decides after the first element
        } else {
            return false;
        }
    }
    return true;
}
~~~

This returns after checking only the first element. For "all elements satisfy X", return false as soon as one fails, and return true only after the loop:

~~~java
for (int n : nums) {
    if (n <= 0) return false;
}
return true;
~~~

## One return or many?

An older style rule says a method should have a single return at the end. Modern practice generally accepts multiple returns when they make the logic clearer, especially guard clauses at the top. Long methods with returns scattered throughout are hard to follow, but the fix is shorter methods.

## Returning booleans directly

~~~java
// Verbose
if (age >= 18) return true;
else return false;

// Direct
return age >= 18;
~~~

## Returning multiple values

A Java method returns one value. To return several, return an object that holds them: an array, a small class, or a record:

~~~java
record MinMax(int min, int max) { }

static MinMax minMax(int[] nums) {
    int min = nums[0], max = nums[0];
    for (int n : nums) {
        min = Math.min(min, n);
        max = Math.max(max, n);
    }
    return new MinMax(min, max);
}
~~~

## return and finally

If a method returns from inside a \`try\` block, the \`finally\` block still runs before the method exits. A return inside finally overrides an earlier return or a thrown exception, which hides errors; avoid returning from finally.

## return in main and lambdas

\`return;\` in \`main\` ends the main method, which usually ends a single-threaded program. To exit with a status code, use \`System.exit(code)\`. Inside a lambda, return exits only the lambda, not the enclosing method.

## How interviewers test this

Expect "missing return statement" compile questions, the premature return bug in "check all elements" loops, finally-with-return output puzzles, and "how do you return multiple values?" Explain the every-path rule, unreachable code, early returns for searches, and suggest records or arrays for multiple results.`,
    sources: [BRANCHING, JLS_STATEMENTS],
  },
};
