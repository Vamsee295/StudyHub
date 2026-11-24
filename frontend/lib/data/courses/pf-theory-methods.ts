// Long-form theory for Programming Fundamentals module 8: methods. Original writing.
import { LessonTheory } from './utils';

const METHODS = { title: "The Java Tutorials: Defining Methods", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html" };
const ARGS = { title: "The Java Tutorials: Passing Information to a Method or a Constructor", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html" };
const RETURNING = { title: "The Java Tutorials: Returning a Value from a Method", url: "https://docs.oracle.com/javase/tutorial/java/javaOO/returnvalue.html" };
const JLS_METHODS = { title: "JLS 8.4: Method Declarations", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4" };
const JLS_OVERLOAD = { title: "JLS 15.12: Method Invocation Expressions", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.12" };
const JLS_SCOPE = { title: "JLS 6.3: Scope of a Declaration", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html#jls-6.3" };
const CLEAN_FUNCTIONS = { title: "Refactoring.Guru: Extract Method", url: "https://refactoring.guru/extract-method" };
const JVM_FRAMES = { title: "JVM Specification 2.6: Frames", url: "https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html#jvms-2.6" };

export const pfMethodsTheory: Record<string, LessonTheory> = {
  "what-is-a-method": {
    theory: `A method is a named block of code that performs a specific task and can be run whenever it's needed by calling its name. Methods are the basic unit of organization in Java programs: \`main\` is a method, \`System.out.println\` is a method, and every useful program is built from many small methods that call each other. This lesson explains what a method is, how calling and returning work, the parts of a method, built-in versus user-defined methods, and how methods relate to functions in other languages.

## A first method

~~~java
public class Greeter {
    static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public static void main(String[] args) {
        greet("Asha");
        greet("Ravi");
    }
}
~~~

\`greet\` is **defined** once and **called** twice. Each call runs the method's body with a different value for \`name\`.

## Definition versus call

- A **method definition** (or declaration) describes what the method does: its name, inputs, output type and body. Defining a method doesn't run it
- A **method call** (or invocation) runs it: \`greet("Asha");\`

You can define a method once and call it from many places, which is the point of having methods.

## What happens during a call

1. The arguments are evaluated: \`"Asha"\`
2. Their values are copied into the method's parameters: \`name = "Asha"\`
3. Control jumps to the first statement of the method body
4. The body runs until it reaches a \`return\` statement or the closing brace
5. Control returns to the point right after the call, bringing back a return value if there is one

Behind the scenes, each call gets its own **stack frame** holding its parameters and local variables. When the method returns, the frame is discarded.

## Parts of a method

~~~java
public static int add(int a, int b) {
    return a + b;
}
~~~

| Part | In the example | Meaning |
|---|---|---|
| Access modifier | \`public\` | Who can call it |
| \`static\` | \`static\` | Belongs to the class; callable without an object |
| Return type | \`int\` | Type of the value sent back, or \`void\` for none |
| Name | \`add\` | How callers refer to it |
| Parameter list | \`(int a, int b)\` | Inputs, with types |
| Body | \`{ return a + b; }\` | The statements that run |

The name plus the parameter types form the method's **signature**. The method syntax lesson covers each part in detail.

## Methods that compute versus methods that act

- Some methods **return a value**: \`Math.max(3, 7)\` returns 7, which the caller can store or use
- Some methods **perform an action** and return nothing (\`void\`): \`System.out.println\` prints text

A well-designed method usually does one or the other: it answers a question or it changes something. Mixing both, such as a method that prints and also returns a computed value, makes code harder to reuse.

## Built-in and user-defined methods

Java's standard library provides thousands of methods: \`Math.sqrt\`, \`String.length\`, \`Arrays.sort\`, \`Integer.parseInt\`. Learning to find and use library methods saves time and avoids bugs. **User-defined** methods are the ones you write for your own program's tasks, like \`calculateGrade\` or \`isPrime\`.

## Static and instance methods

\`static\` methods belong to the class and are called through the class name or directly from other static methods: \`Math.max(a, b)\`. **Instance** methods belong to objects and are called on an object: \`name.length()\`, \`list.add(x)\`. At this stage, most methods you write will be static, called from \`main\`. The OOP course covers instance methods in depth.

## Methods and functions

Other languages call similar constructs **functions** (C, Python, JavaScript) or **procedures** (functions that return nothing). In Java, every method belongs to a class; there are no standalone functions, though static methods behave much like them. The underlying idea is the same everywhere: package a computation behind a name.

## The main method

\`public static void main(String[] args)\` is the entry point the JVM calls to start a program. It's an ordinary static method with a special signature. \`args\` holds command-line arguments. Programs grow by having main call other methods rather than putting all code inside main.

## Naming methods

Methods use **camelCase** names that start with a verb, describing what they do: \`calculateTotal\`, \`printReport\`, \`findMax\`. Methods returning booleans read as questions: \`isEven\`, \`hasAccess\`, \`canVote\`. A good name lets readers understand a call without reading the body.

## How interviewers test this

Expect "What is a method?", "What is a method signature?", "Difference between a parameter and an argument?" and tracing calls in output questions. Explain definition versus call, the call steps including the stack frame, the parts of a method, and the difference between returning a value and performing an action.`,
    sources: [METHODS, JVM_FRAMES],
  },

  "why-use-methods": {
    theory: `Methods exist because programs grow. A 20-line program can live in \`main\`, but a 2,000-line program written as one block is impossible to understand, test or change safely. Methods break programs into named, reusable pieces, each doing one job. This lesson explains the benefits of methods (reuse, readability, testing, abstraction and easier change), how to recognize when code should become a method, and how to size methods well.

## Avoiding repetition

Without methods, the same logic gets copied:

~~~java
// Checking three numbers for primality without a method
boolean p1 = true;
for (int d = 2; d * d <= a; d++) if (a % d == 0) { p1 = false; break; }
boolean p2 = true;
for (int d = 2; d * d <= b; d++) if (b % d == 0) { p2 = false; break; }
// ...and again for c
~~~

With a method:

~~~java
static boolean isPrime(int n) {
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) return false;
    }
    return true;
}

boolean p1 = isPrime(a), p2 = isPrime(b), p3 = isPrime(c);
~~~

Notice the copied version even has a bug: it treats 0 and 1 as prime. With a method, fixing the \`n < 2\` case once fixes every caller. The principle is often called **DRY: Don't Repeat Yourself**. Every copy of duplicated code is a place where a future fix might be forgotten.

## Readability

A well-named method call reads like a sentence:

~~~java
int[] marks = readMarks(sc);
double avg = average(marks);
char grade = gradeFor(avg);
printReport(marks, avg, grade);
~~~

A reader understands the program's flow without reading any method body. When they need detail, they open one method. This is **abstraction**: hiding how something is done behind a name that says what it does.

## Testing

Small methods with clear inputs and outputs are straightforward to check:

~~~java
assert isPrime(2);
assert !isPrime(1);
assert isPrime(97);
assert !isPrime(100);
~~~

Testing one 300-line main method requires running the whole program with many inputs and inspecting output. Testing \`isPrime\` alone takes four lines. Real projects use testing frameworks like JUnit that call methods directly.

## Easier change

When requirements change, a method localizes the change. If grading rules change, only \`gradeFor\` changes; callers keep working. Without methods, the grading logic might be scattered across several places, each needing an identical edit.

## Divide and conquer

Methods let you solve a big problem by solving smaller ones. Writing a program to "process exam results" is intimidating; writing \`readMarks\`, \`average\`, \`gradeFor\` and \`printReport\` one at a time is manageable. This **top-down design**, starting with high-level steps and filling them in, is how experienced developers approach large tasks.

## Teamwork and reuse

Methods define clear boundaries. One developer can write \`average\` while another writes \`printReport\`, agreeing only on parameters and return types. Useful methods move into shared utility classes or libraries and get reused across projects, which is exactly how the Java standard library came to exist.

## Debugging

When something goes wrong, small methods narrow the search. A stack trace shows which method failed, and testing each method separately isolates the bug quickly.

## When to extract a method

Signs that code should become a method:

- the same or similar code appears in two or more places
- a block of code needs a comment to explain what it does; the comment often makes a good method name
- a method is too long to see on one screen
- a loop body or condition is complex enough to deserve a name
- you want to test a piece of logic on its own

Moving code into a new method is a standard refactoring called **Extract Method**, supported automatically by IDEs.

## How big should a method be?

There's no fixed rule, but useful guidelines are:

- a method should do **one thing**, which its name describes
- if you can't name it without "and", such as \`readAndValidateAndSave\`, it probably does too much
- most good methods are short: a few lines to a few dozen
- parameters should be few; more than about four suggests the method does too much or needs an object grouping its inputs

Don't go to the opposite extreme of one-line methods that only rename a single operation; extraction should make code clearer, not more scattered.

## Cost of method calls

Calling a method has a tiny overhead, but the JIT compiler inlines small, frequently called methods, removing it entirely. Never avoid methods for performance reasons; readability and correctness matter far more.

## How interviewers test this

Expect "Why do we use methods?", "What is DRY?" and code-review questions where repeated logic should be extracted. Name reuse, readability, testing, easier change and abstraction, show a before-and-after example, and give the signs that code should become a method.`,
    sources: [METHODS, CLEAN_FUNCTIONS],
  },

  "method-syntax": {
    theory: `Every Java method declaration follows the same structure: modifiers, a return type, a name, a parameter list in parentheses, an optional throws clause, and a body in braces. Each part has precise rules, and small mistakes in them produce some of the most common compile errors beginners see. This lesson walks through each part of a method declaration, how to call methods correctly, where methods can be declared, and the errors to recognize.

## The full shape

~~~java
public static double average(int[] values) throws IllegalArgumentException {
    if (values.length == 0) throw new IllegalArgumentException("empty array");
    int sum = 0;
    for (int v : values) sum += v;
    return (double) sum / values.length;
}
~~~

\`modifiers returnType name(parameters) throws ExceptionList { body }\`

## Modifiers

- **Access modifiers** control visibility: \`public\` (anywhere), \`protected\`, package-private (no keyword), and \`private\` (only within the class)
- **\`static\`** means the method belongs to the class and can be called without creating an object
- Others you'll meet later: \`final\` (can't be overridden), \`abstract\` (no body), \`synchronized\` (one thread at a time)

At this stage, helper methods called from \`main\` are usually declared \`static\`, often \`private static\` when only the same class uses them.

## Return type

The return type states what the method sends back: a primitive (\`int\`, \`boolean\`), a reference type (\`String\`, \`int[]\`), or \`void\` for nothing. It's required; there's no default. Every path through a non-void method must return a value of that type.

## Name

Method names follow identifier rules (letters, digits, \`_\` and \`$\`, not starting with a digit, not a keyword) and the camelCase convention, starting with a verb: \`computeTax\`, \`isValid\`.

## Parameter list

Parameters are declared like variables, separated by commas, each with its own type:

~~~java
static int clamp(int value, int min, int max) { ... }   // correct
static int clamp(int value, min, max) { ... }           // compile error: each needs a type
static void ping() { ... }                              // no parameters: empty parentheses
~~~

A method can accept a variable number of arguments with **varargs**, written \`type...\`:

~~~java
static int sum(int... nums) {
    int total = 0;
    for (int n : nums) total += n;
    return total;
}
sum(1, 2);          // 3
sum(1, 2, 3, 4);    // 10
sum();              // 0
~~~

Inside the method, \`nums\` is an array. A varargs parameter must be the last one, and a method can have only one.

## Throws clause

\`throws\` lists checked exceptions the method may pass to its caller, such as \`throws IOException\`. Unchecked exceptions like IllegalArgumentException may be listed for documentation but don't have to be. Exceptions are covered in depth later.

## Body

The body is a block of statements in braces. It may declare local variables, use control flow, call other methods, and must end every path with a return in non-void methods. A method with no body, ending in a semicolon, is only allowed for abstract or interface methods.

## Calling methods

~~~java
double avg = average(scores);            // static method in the same class
double root = Math.sqrt(16);             // static method in another class: ClassName.method
int len = name.length();                 // instance method: object.method
printReport();                           // no arguments: parentheses still required
~~~

Arguments must match the parameters in number, order and type (allowing widening such as int to double). Forgetting parentheses, \`name.length\`, is a compile error for methods.

## Where methods live

- methods are declared **inside a class**, at the same level as fields
- methods **can't be nested** inside other methods in Java (lambdas and local classes are the closest equivalents)
- the order of methods in a class doesn't matter: \`main\` can call a method declared below it

~~~java
public class App {
    public static void main(String[] args) {
        helper();               // fine, even though helper is declared later
    }
    static void helper() { }
}
~~~

## Calling instance methods from static ones

A static method can't directly call an instance method of the same class, because there's no object:

~~~java
public class App {
    void show() { }
    public static void main(String[] args) {
        show();                 // compile error: non-static method cannot be referenced from a static context
        new App().show();       // works: call it on an object
    }
}
~~~

This error is among the most common for beginners. Making helper methods \`static\` avoids it until you learn about objects.

## Common compile errors

| Error message (approximate) | Typical cause |
|---|---|
| missing return statement | A path in a non-void method doesn't return |
| incompatible types | Returning or passing the wrong type |
| cannot find symbol | Misspelled method name, wrong class, or missing import |
| method X cannot be applied to given types | Wrong number or types of arguments |
| non-static method cannot be referenced from a static context | Calling an instance method from main |
| illegal start of expression | A method declared inside another method, or a missing brace |

## Documentation comments

Javadoc comments above a method describe its purpose, parameters and return value, and tools generate documentation from them:

~~~java
/**
 * Returns the average of the given values.
 * @param values the numbers to average; must not be empty
 * @return the arithmetic mean
 */
~~~

## How interviewers test this

Expect "What are the parts of a method declaration?", compile-error spotting, "Can a method be declared inside another method?" and "Why can't main call a non-static method directly?" Name each part, explain varargs rules, state that methods can't nest, and explain the static context error with the fix.`,
    sources: [METHODS, JLS_METHODS],
  },

  "method-parameters": {
    theory: `Parameters are the inputs a method declares; arguments are the actual values passed when it's called. Java passes every argument **by value**: the method receives a copy. For primitives, that copy is the number itself; for objects and arrays, the copy is a reference to the same object. This one rule explains why a method can change an array's contents but can't swap two variables in its caller, a classic interview topic. This lesson covers parameters and arguments, pass-by-value for primitives and references, varargs, and parameter design.

## Parameters and arguments

~~~java
static double area(double width, double height) {   // width, height: parameters
    return width * height;
}

double a = area(4.0, 2.5);                          // 4.0, 2.5: arguments
~~~

Parameters behave like local variables initialized with the argument values. Arguments are matched to parameters **by position**: the first argument goes to the first parameter. Java has no named arguments, so \`area(2.5, 4.0)\` silently swaps them; descriptive names and distinct types reduce this risk.

## Argument conversion

Arguments may be widened to match parameter types:

~~~java
static double half(double x) { return x / 2; }
half(7);          // int 7 is widened to 7.0
~~~

Narrowing isn't automatic: passing a double to an int parameter is a compile error without a cast.

## Pass-by-value with primitives

~~~java
static void addTen(int x) {
    x = x + 10;
}

int score = 50;
addTen(score);
System.out.println(score);   // 50: unchanged
~~~

The method changes its own copy, \`x\`. The caller's variable is unaffected. To get a result back, return it: \`score = addTen(score);\` with a method that returns \`x + 10\`.

## Pass-by-value with references

For arrays and objects, the value copied is a **reference**, pointing to the same object:

~~~java
static void doubleAll(int[] arr) {
    for (int i = 0; i < arr.length; i++) arr[i] *= 2;
}

int[] nums = {1, 2, 3};
doubleAll(nums);
System.out.println(Arrays.toString(nums));   // [2, 4, 6]
~~~

Both \`nums\` and \`arr\` refer to one array, so changes to its elements are visible to the caller.

But reassigning the parameter only redirects the copy:

~~~java
static void replace(int[] arr) {
    arr = new int[]{9, 9, 9};    // arr now points to a new array; nums is untouched
}

replace(nums);
System.out.println(Arrays.toString(nums));   // still [2, 4, 6]
~~~

## Why Java isn't pass-by-reference

In true pass-by-reference (as in C++ with \`&\` parameters), a method could make the caller's variable point somewhere else. Java can't:

~~~java
static void swap(int a, int b) {
    int t = a; a = b; b = t;     // swaps the copies only
}

static void swap(String x, String y) {
    String t = x; x = y; y = t;  // swaps the copied references only
}
~~~

Neither version affects the caller. To swap, swap elements of an array or fields of an object, which the method can reach through the shared reference:

~~~java
static void swap(int[] arr, int i, int j) {
    int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
}
~~~

The precise statement: **Java is always pass-by-value; for objects, the value passed is a reference.**

## Immutable objects behave like primitives

Strings and wrapper objects can't be modified, so a method can never change the caller's String:

~~~java
static void shout(String s) {
    s = s.toUpperCase();     // creates a new string; the caller's is unchanged
}
~~~

## Varargs

\`type... name\` accepts zero or more arguments as an array:

~~~java
static int max(int first, int... rest) {
    int m = first;
    for (int r : rest) m = Math.max(m, r);
    return m;
}
max(4);           // 4
max(4, 9, 2);     // 9
~~~

Requiring \`first\` separately guarantees at least one argument. Varargs must be the last parameter. \`String.format\` and \`List.of\` use varargs.

## final parameters

Declaring \`final int x\` prevents reassigning the parameter inside the method. It has no effect on callers but can make long methods clearer.

## Designing parameters

- **few parameters**: more than about four makes calls hard to read and prone to mix-ups; group related values into an object or record
- **avoid boolean flag parameters**: \`print(report, true)\` doesn't say what true means; two methods, or an enum, read better
- **validate inputs** at the start of public methods: throw \`IllegalArgumentException\` for invalid values
- **don't surprise callers**: if a method modifies an array argument, make that clear in its name or documentation, such as \`sortInPlace\`

## How interviewers test this

Expect "Is Java pass-by-value or pass-by-reference?", the swap method that doesn't work, array modification versus reassignment output questions, and varargs rules. State that Java always passes by value, explain that references are copied so shared objects can be mutated but caller variables can't be redirected, and show the array-based swap.`,
    sources: [ARGS, JLS_METHODS],
  },

  "return-values": {
    theory: `A return value is the result a method sends back to its caller. Methods that compute something, such as a maximum, a grade or whether a number is prime, should return the result rather than print it, so callers can store it, test it or combine it with other values. Java checks return types strictly at compile time. This lesson covers return types and the return statement, using returned values, returning early, returning arrays and objects, returning multiple values, and common mistakes.

## Declaring and returning

~~~java
static int square(int n) {
    return n * n;
}
~~~

The return type, \`int\`, promises the method always produces an int. The \`return\` statement ends the method and sends the value back. Widening is allowed: a method declared to return \`double\` may \`return 5;\`. Narrowing isn't: returning a double from an int method is a compile error without a cast.

## Using the returned value

~~~java
int s = square(7);                          // store it
System.out.println(square(3) + square(4));  // use it in an expression: 25
if (isPrime(n)) { ... }                     // use it in a condition
int y = square(square(2));                  // pass it to another call: 16
~~~

A method call that returns a value is an **expression**, usable anywhere a value of that type is.

Ignoring a return value is legal but often a bug:

~~~java
name.toUpperCase();     // result discarded: name is unchanged
name = name.toUpperCase();
~~~

## Return versus print

Compare:

~~~java
static void printMax(int a, int b) {
    System.out.println(Math.max(a, b));
}

static int max(int a, int b) {
    return Math.max(a, b);
}
~~~

\`printMax\` can only display the result. \`max\` can be printed, stored, compared, summed or tested. Computing methods should return values; leave printing to the code that handles output. This separation makes methods reusable and testable.

## Every path must return

~~~java
static String sign(int n) {
    if (n > 0) return "positive";
    else if (n < 0) return "negative";
    // compile error: missing return statement
}
~~~

The compiler can't prove the conditions cover all cases, so it requires a return on the final path:

~~~java
static String sign(int n) {
    if (n > 0) return "positive";
    if (n < 0) return "negative";
    return "zero";
}
~~~

Throwing an exception also satisfies the rule for paths that should never happen.

## Returning early

A return can appear anywhere, ending the method immediately:

~~~java
static int indexOf(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;   // found: stop searching
    }
    return -1;                            // conventional "not found"
}
~~~

## Returning booleans

Methods that answer yes-or-no questions return booleans and are named as questions:

~~~java
static boolean isEven(int n) {
    return n % 2 == 0;            // not: if (n % 2 == 0) return true; else return false;
}
~~~

## Returning arrays

~~~java
static int[] evensUpTo(int n) {
    int[] result = new int[n / 2];
    for (int i = 0; i < result.length; i++) result[i] = 2 * (i + 1);
    return result;
}
~~~

The method returns a reference to a new array. For "no results", returning an empty array (\`new int[0]\`) is safer than returning null, because callers can loop over it without a null check.

## Returning objects

Methods can return any object: a String, a List, a custom class. Returning null to mean "nothing found" is common but forces every caller to check; \`Optional<T>\` makes "may be absent" explicit:

~~~java
static Optional<String> findUser(String id) { ... }
findUser("u1").ifPresent(System.out::println);
~~~

## Returning multiple values

A Java method returns exactly one value. To return several, package them:

~~~java
record Stats(int min, int max, double average) { }

static Stats stats(int[] nums) {
    int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;
    long sum = 0;
    for (int n : nums) {
        min = Math.min(min, n);
        max = Math.max(max, n);
        sum += n;
    }
    return new Stats(min, max, (double) sum / nums.length);
}
~~~

A record (or small class) names each value. Returning an array like \`new int[]{min, max}\` works but loses meaning: which index is which?

## Return values and method chaining

When a method returns an object, you can call a method on the result directly:

~~~java
String cleaned = input.trim().toLowerCase().replace(" ", "-");
~~~

Each call returns a new String that the next call operates on.

## Common mistakes

- printing inside a method instead of returning, then trying to use the "result"
- forgetting to assign the returned value
- returning inside a loop on the first element when the whole array must be checked
- returning null where an empty array or collection would be safer
- mismatched types: returning an int expression from a method declared \`void\`

## How interviewers test this

Expect "missing return statement" puzzles, "return vs print" discussions, methods that must return a boolean directly, and "how do you return multiple values?" Explain the every-path rule, why computing methods should return rather than print, empty arrays instead of null, and records for multiple results.`,
    sources: [RETURNING, JLS_METHODS],
  },

  "void-methods": {
    theory: `A \`void\` method performs an action but returns no value to its caller. Printing a report, saving a file, sorting an array in place, updating a counter or sending a message are all actions whose purpose is their effect, not a result. Knowing when a method should be void and when it should return something is a core design skill. This lesson covers declaring and calling void methods, early returns, side effects, void methods that modify their arguments, and the trade-offs between void and value-returning designs.

## Declaring a void method

~~~java
static void printBanner(String title) {
    System.out.println("=".repeat(title.length() + 4));
    System.out.println("| " + title + " |");
    System.out.println("=".repeat(title.length() + 4));
}
~~~

\`void\` in place of a return type means "returns nothing". The method ends when it reaches its closing brace or a bare \`return;\`.

## Calling a void method

A void method call is a **statement** on its own:

~~~java
printBanner("Results");
~~~

It isn't an expression, so it can't be stored or used in a calculation:

~~~java
String x = printBanner("Results");   // compile error: void cannot be assigned
System.out.println(printBanner("x"));  // compile error: 'void' type not allowed here
~~~

## Early return in void methods

\`return;\` with no value exits immediately, useful for guard clauses:

~~~java
static void printAverage(int[] marks) {
    if (marks.length == 0) {
        System.out.println("No marks recorded");
        return;
    }
    int sum = 0;
    for (int m : marks) sum += m;
    System.out.printf("Average: %.2f%n", (double) sum / marks.length);
}
~~~

Returning a value from a void method (\`return 0;\`) is a compile error.

## Side effects

A **side effect** is any change a method makes that's visible outside it: printing, writing files, modifying an array argument, changing a static variable, or sending a network request. Void methods exist for their side effects; without one, a void method would accomplish nothing.

## Void methods that modify arrays

Because arrays are passed as references, a void method can change the caller's array:

~~~java
static void fillWith(int[] arr, int value) {
    for (int i = 0; i < arr.length; i++) arr[i] = value;
}

int[] slots = new int[5];
fillWith(slots, -1);      // slots is now {-1, -1, -1, -1, -1}
~~~

\`Arrays.sort(arr)\` is a void library method that sorts in place. Methods that modify their arguments should make it obvious through their names or documentation, because callers may not expect their data to change.

## Void methods can't change primitives

~~~java
static void increment(int count) {
    count++;            // changes the local copy only
}
~~~

To update a number, return the new value instead: \`count = increment(count);\` with a method that returns \`count + 1\`.

## Command-query separation

A widely used design principle says methods should either:

- **do something** (a command, usually void), or
- **answer something** (a query, returning a value without side effects)

but not both. Compare:

~~~java
// Mixed: prints and returns
static int printAndSum(int[] arr) { ... }

// Separated
static int sum(int[] arr) { ... }               // query
static void printArray(int[] arr) { ... }        // command
~~~

The separated version lets you compute a sum without printing, test \`sum\` easily, and call either one independently. Exceptions exist (for example \`list.remove(i)\` both removes and returns the element), but the principle is a good default.

## Testing void methods

Value-returning methods are tested by checking the returned value. Void methods are tested by checking their effects: the array's contents after the call, the file that was written, or captured output. This is harder, which is one reason to keep computation in value-returning methods and confine void methods to thin layers of input and output.

## When to make a method void

- its purpose is output: printing, logging, drawing
- it changes the state of an object or data structure in place, such as sorting, clearing or adding
- it triggers an external action: saving, sending, deleting

## When to return a value instead

- the method computes a result the caller may want to use
- the caller might want to print it differently, store it, or test it
- the method creates something new, such as a new array, rather than changing an existing one

A useful habit: write the computation as a value-returning method, and call it from a separate void method that prints.

## main is void

\`public static void main(String[] args)\` returns nothing to the JVM. To report success or failure to the operating system, a program calls \`System.exit(status)\`, where 0 conventionally means success.

## How interviewers test this

Expect "What does void mean?", "Can a void method have a return statement?", compile errors from using a void call as a value, and design questions on whether a method should return or print. Explain bare \`return;\`, side effects, modifying arrays through references, and command-query separation.`,
    sources: [RETURNING, METHODS],
  },

  "method-overloading-basics": {
    theory: `Method overloading means defining several methods with the same name in one class, as long as their parameter lists differ. It lets one intuitive name cover variations of the same operation: \`println\` prints ints, doubles, strings and objects; \`Math.max\` works for ints, longs, floats and doubles. The compiler picks the right version from the arguments at the call site. This lesson covers what makes overloads valid, how the compiler chooses, the resolution rules for widening, boxing and varargs, and design guidelines.

## A first example

~~~java
static int add(int a, int b) {
    return a + b;
}

static double add(double a, double b) {
    return a + b;
}

static int add(int a, int b, int c) {
    return a + b + c;
}

add(2, 3);        // calls add(int, int): 5
add(2.5, 1.5);    // calls add(double, double): 4.0
add(1, 2, 3);     // calls add(int, int, int): 6
~~~

## What makes overloads valid

Overloaded methods must differ in their **parameter lists**:

- number of parameters: \`area(double side)\` and \`area(double w, double h)\`
- types of parameters: \`print(int x)\` and \`print(String s)\`
- order of parameter types: \`f(int a, String b)\` and \`f(String b, int a)\`

These differences **don't** count:

- return type only: \`int parse(String s)\` and \`double parse(String s)\` can't coexist
- parameter names only: \`f(int a)\` and \`f(int b)\` are the same signature
- access modifiers or \`static\`

The rule follows from the call site: \`parse("5")\` gives the compiler no way to choose by return type, because callers can ignore return values.

## How the compiler chooses

Overload resolution happens at **compile time**, using the declared types of the arguments. The compiler works in phases and stops at the first that finds a match:

1. **Exact match or widening**: int to long, int to double, char to int, without boxing
2. **Boxing and unboxing**: int to Integer and back
3. **Varargs**

Within a phase, it picks the **most specific** method, the one whose parameter types are narrowest. If two are equally specific, the call is ambiguous and doesn't compile.

## Widening beats boxing

~~~java
static void show(long x) { System.out.println("long"); }
static void show(Integer x) { System.out.println("Integer"); }

show(5);     // prints "long"
~~~

Phase 1 finds \`show(long)\` by widening, so boxing to Integer is never considered.

## Boxing beats varargs

~~~java
static void show(Integer x) { System.out.println("Integer"); }
static void show(int... xs) { System.out.println("varargs"); }

show(5);     // prints "Integer"
~~~

## Exact match wins

~~~java
static void show(int x) { System.out.println("int"); }
static void show(double x) { System.out.println("double"); }

show(5);      // int
show(5.0);    // double
show('A');    // int: char widens to int before double
show(5L);     // double: long widens to double, and no long version exists
~~~

## Ambiguity

~~~java
static void f(int a, double b) { }
static void f(double a, int b) { }

f(1, 2);      // compile error: ambiguous
~~~

Both methods need one widening conversion, and neither is more specific. Casting an argument resolves it: \`f(1, 2.0)\`.

## Null arguments

~~~java
static void print(Object o) { System.out.println("Object"); }
static void print(String s) { System.out.println("String"); }

print(null);  // String: String is more specific than Object
~~~

Adding \`print(Integer i)\` makes \`print(null)\` ambiguous, since neither String nor Integer is more specific than the other.

## Overloading in the standard library

- \`System.out.println\` has versions for every primitive, char[], String and Object
- \`Math.abs\`, \`Math.max\` and \`Math.min\` for int, long, float and double
- \`String.valueOf\` for every primitive and Object
- \`Arrays.sort\` for each primitive array type and for objects, with or without a comparator

## Overloading versus overriding

| | Overloading | Overriding |
|---|---|---|
| Where | Same class (or subclass adds a version) | Subclass replaces a parent method |
| Parameters | Must differ | Must match |
| Decided | At compile time, from argument types | At runtime, from the object's type |

Overriding belongs to object-oriented programming and is covered in the OOP course.

## Design guidelines

- overloads should do **the same conceptual thing** with different inputs; don't overload unrelated operations under one name
- avoid overloads with the same number of parameters whose types convert into each other, such as \`(int, double)\` and \`(double, int)\`; they confuse readers and invite ambiguity
- have simpler overloads delegate to the most complete one, so the logic lives in one place:

~~~java
static double round(double x) { return round(x, 2); }
static double round(double x, int places) {
    double factor = Math.pow(10, places);
    return Math.round(x * factor) / factor;
}
~~~

- when names would be clearer, use different names instead: \`readInt\` and \`readLine\` rather than three \`read\` overloads

## How interviewers test this

Expect "Can you overload by return type?", output questions on widening versus boxing versus varargs, \`print(null)\` puzzles, and "overloading vs overriding?" State the valid differences, explain compile-time selection in three phases with most-specific choice, show ambiguity and its fix, and give library examples.`,
    sources: [METHODS, JLS_OVERLOAD],
  },

  "scope-and-tracing": {
    theory: `Scope is the region of a program where a name, such as a variable or parameter, can be used. Tracing is following a program's execution step by step, tracking each variable's value and each method call. Together they let you predict exactly what code does, which is how you debug, how you solve output questions, and how you reason about recursion later. This lesson covers local, parameter, block and class scope, shadowing, variable lifetime, the call stack, and a systematic tracing method.

## Local scope

A local variable exists from its declaration to the end of the block that contains it:

~~~java
static void demo() {
    int a = 5;                 // a is in scope from here
    if (a > 0) {
        int b = a * 2;         // b is in scope only inside this block
        System.out.println(b);
    }
    System.out.println(b);     // compile error: b is out of scope
}                              // a goes out of scope here
~~~

Each method has its own locals. A variable named \`count\` in \`main\` and another \`count\` in \`helper\` are completely separate.

## Parameter scope

Parameters are in scope throughout the method body, behaving like locals initialized by the caller.

## Loop variable scope

~~~java
for (int i = 0; i < 3; i++) { }
System.out.println(i);         // compile error: i only exists in the loop
~~~

Declare the variable before the loop if you need it afterward.

## No redeclaration in nested scopes

Java forbids declaring a local variable with the same name as another local or parameter still in scope:

~~~java
static void f(int x) {
    int x = 5;                 // compile error: x is already defined
    for (int i = 0; i < 2; i++) {
        int i = 7;             // compile error
    }
}
~~~

Sequential blocks can reuse a name, because the first variable is out of scope by then:

~~~java
for (int i = 0; i < 3; i++) { }
for (int i = 0; i < 5; i++) { }   // fine
~~~

## Class scope and shadowing

Fields (variables declared in a class, outside methods) are in scope in every method of the class. A local variable or parameter with the same name **shadows** the field:

~~~java
public class Counter {
    static int count = 100;

    static void show() {
        int count = 5;
        System.out.println(count);           // 5: the local shadows the field
        System.out.println(Counter.count);   // 100: the field, named explicitly
    }
}
~~~

For instance fields, \`this.count\` reaches the field. Shadowing is legal but confusing; it's best avoided except in constructors and setters, where \`this.name = name\` is a standard idiom.

## Lifetime versus scope

**Scope** is a compile-time idea: where the name is visible in the source. **Lifetime** is a runtime idea: how long the storage exists. A local variable's storage lives in its method's stack frame and disappears when the method returns. Objects live on the heap as long as something references them, even after the local variable that created them is gone, for example when a method returns a new array.

## The call stack

Each method call pushes a **frame** onto the call stack holding its parameters and locals. When the method returns, its frame is popped and control continues in the caller:

~~~java
static int square(int n) { return n * n; }
static int sumOfSquares(int a, int b) { return square(a) + square(b); }

public static void main(String[] args) {
    int r = sumOfSquares(2, 3);
    System.out.println(r);
}
~~~

1. main's frame: \`args\`, \`r\` (not yet assigned)
2. call sumOfSquares(2, 3): new frame with a = 2, b = 3
3. call square(2): new frame with n = 2, returns 4, frame popped
4. call square(3): new frame with n = 3, returns 9, frame popped
5. sumOfSquares returns 13, frame popped
6. main assigns r = 13 and prints 13

When an exception occurs, the **stack trace** lists these frames from the innermost call outward, showing exactly which chain of calls led to the error.

## A tracing method

For output questions and debugging:

1. **List variables** as columns in a table, one table (or section) per method call
2. **Execute line by line**, updating values; never skip ahead based on what the code "should" do
3. **On a call**, start a new section for the callee with parameters copied from the arguments
4. **On return**, write the returned value back at the call site and cross out the callee's section
5. **Track output** in a separate column as it's printed

## Tracing pass-by-value

~~~java
static void change(int x, int[] arr) {
    x = 99;
    arr[0] = 99;
}

int a = 1;
int[] b = {1, 2};
change(a, b);
System.out.println(a + " " + b[0]);   // 1 99
~~~

In the trace, \`x\` is a copy of \`a\`, so changing it leaves \`a\` at 1. \`arr\` holds a copy of the reference in \`b\`, so \`arr[0] = 99\` changes the shared array.

## Debugger tracing

IDEs automate tracing: set a breakpoint, run in debug mode, and step over (run the next line) or step into (enter a method call) while watching variables and the call stack. Hand-tracing and debugger tracing build the same mental model; interviews require doing it by hand.

## How interviewers test this

Expect output questions with shadowed variables, out-of-scope compile errors, nested method calls and pass-by-value with arrays. Explain block scope and the no-redeclaration rule, shadowing and \`ClassName.field\` or \`this.field\`, scope versus lifetime, and trace calls frame by frame with a variable table.`,
    sources: [JLS_SCOPE, JVM_FRAMES],
  },
};
