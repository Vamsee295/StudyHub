// Long-form theory for Programming Fundamentals modules 3-4: operators, input and output. Original writing.
import { LessonTheory } from './utils';

const OPERATORS = { title: "The Java Tutorials: Operators", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html" };
const OPS_ASSIGN = { title: "The Java Tutorials: Assignment, Arithmetic, and Unary Operators", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op1.html" };
const OPS_EQUALITY = { title: "The Java Tutorials: Equality, Relational, and Conditional Operators", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html" };
const OPS_BITWISE = { title: "The Java Tutorials: Bitwise and Bit Shift Operators", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op3.html" };
const JLS_EXPR = { title: "JLS Chapter 15: Expressions", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html" };
const JLS_LEXICAL = { title: "JLS Chapter 3: Lexical Structure (escape sequences)", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-3.html#jls-3.10.7" };
const PRINTSTREAM = { title: "Java SE API: PrintStream", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/PrintStream.html" };
const FORMATTER = { title: "Java SE API: Formatter (format string syntax)", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Formatter.html" };
const SCANNER = { title: "Java SE API: Scanner", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Scanner.html" };
const IO_TUT = { title: "The Java Tutorials: Basic I/O", url: "https://docs.oracle.com/javase/tutorial/essential/io/index.html" };
const EXCEPTIONS = { title: "The Java Tutorials: Exceptions", url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html" };

export const pfOperatorsIoTheory: Record<string, LessonTheory> = {
  "what-are-operators": {
    theory: `Operators are symbols that perform operations on values, such as \`+\` for addition, \`>\` for comparison and \`&&\` for combining conditions. Combined with variables and literals, they form **expressions**, the parts of a program that compute values. Every calculation, decision and loop condition in a program is built from operators. This lesson introduces the vocabulary of operators and expressions, the categories Java provides, and the general rules that govern how expressions are evaluated.

## Operands, operators and expressions

In \`price * quantity\`, the values \`price\` and \`quantity\` are **operands**, and \`*\` is the **operator**. The whole thing is an **expression**: it evaluates to a single value. Expressions nest: \`(price * quantity) + shipping\` is an expression containing another expression.

A **statement** is a complete instruction, usually ending in a semicolon. \`total = price * quantity + shipping;\` is a statement that contains expressions and stores their result.

## Operators by number of operands

- **unary** operators take one operand: \`-x\`, \`!done\`, \`count++\`
- **binary** operators take two: \`a + b\`, \`x > y\`, \`p && q\`
- the **ternary** operator takes three: \`condition ? valueIfTrue : valueIfFalse\`

## Java's operator categories

| Category | Operators | Result type | Example |
|---|---|---|---|
| Arithmetic | \`+ - * / %\` | Numeric | \`total / count\` |
| Assignment | \`= += -= *= /= %=\` and others | Value assigned | \`sum += x\` |
| Relational | \`== != < > <= >=\` | boolean | \`age >= 18\` |
| Logical | \`&& || !\` | boolean | \`isMember && hasPaid\` |
| Unary | \`+ - ++ -- !\` | Depends | \`i++\` |
| Bitwise and shift | \`& | ^ ~ << >> >>>\` | Integer | \`flags & MASK\` |
| Ternary | \`? :\` | Either branch's type | \`a > b ? a : b\` |
| Type comparison | \`instanceof\` | boolean | \`obj instanceof String\` |

Each category has its own lesson in this module.

## Evaluating expressions

Three rules decide how an expression with several operators is evaluated:

1. **Precedence**: operators with higher precedence are applied first. \`*\` binds tighter than \`+\`, so \`2 + 3 * 4\` is 14, not 20
2. **Associativity**: when operators share precedence, associativity decides the grouping. Most binary operators are left-associative: \`10 - 4 - 3\` is \`(10 - 4) - 3\`, which is 3. Assignment is right-associative: \`a = b = 5\` assigns 5 to b, then to a
3. **Evaluation order**: Java evaluates operands left to right. In \`f() + g()\`, f runs before g. This matters when operands have side effects

Parentheses override precedence and make intent clear. The operator precedence lesson covers the full table.

## Types in expressions

The type of an expression depends on its operands:

- \`7 / 2\` is integer division, giving 3
- \`7 / 2.0\` involves a double, so the result is 3.5
- \`"Total: " + 5\` involves a String, so \`+\` concatenates, giving "Total: 5"
- relational and logical operators always produce \`boolean\`

Small integer types such as byte and short are promoted to int before arithmetic, so \`byte + byte\` is an int.

## Side effects

Most operators produce a value without changing anything. Some also change variables, called **side effects**: assignment, \`++\` and \`--\`. Expressions with several side effects on the same variable, such as \`i = i++ + ++i\`, are legal in Java and well defined, but confusing; they appear in interview puzzles and should never appear in real code.

## Operator overloading

Some languages let programmers redefine operators for their own types. Java doesn't, with one built-in exception: \`+\` concatenates when either operand is a String. To add two BigDecimal values, you call \`a.add(b)\`, not \`a + b\`.

## Common beginner mistakes

- using \`=\` (assignment) where \`==\` (comparison) was meant
- expecting \`5 / 2\` to be 2.5
- forgetting that \`+\` with a String turns into concatenation: \`"Sum: " + 2 + 3\` is "Sum: 23"
- relying on precedence instead of parentheses in complex expressions
- comparing strings with \`==\` instead of \`equals\`

## Reading expressions like the compiler

When an expression confuses you, add parentheses according to precedence, then evaluate innermost first, left to right. Writing out intermediate values on paper is the fastest way to solve output puzzles and catch logic errors in your own code.

## How interviewers test this

Expect output questions mixing integer division, concatenation and precedence, plus "Name the types of operators in Java." List the categories with examples, explain precedence, associativity and left-to-right evaluation, and show how the operand types decide the result type.`,
    sources: [OPERATORS, JLS_EXPR],
  },

  "arithmetic-operators": {
    theory: `Arithmetic operators perform mathematical calculations: addition, subtraction, multiplication, division and remainder. They look familiar from school, but programming adds twists: integer division discards fractions, the remainder operator handles negative numbers in a specific way, values overflow silently, and \`+\` doubles as string concatenation. This lesson covers each operator, the type rules behind results, and the classic uses of \`%\` in programming problems.

## The five operators

| Operator | Meaning | Example | Result |
|---|---|---|---|
| \`+\` | Addition | \`7 + 2\` | 9 |
| \`-\` | Subtraction | \`7 - 2\` | 5 |
| \`*\` | Multiplication | \`7 * 2\` | 14 |
| \`/\` | Division | \`7 / 2\` | 3 (int division) |
| \`%\` | Remainder | \`7 % 2\` | 1 |

\`*\`, \`/\` and \`%\` have higher precedence than \`+\` and \`-\`, and all are left-associative.

## Integer division

When both operands are integers, \`/\` produces an integer, discarding the fractional part:

~~~java
int a = 17 / 5;          // 3
int b = -17 / 5;         // -3: truncation toward zero, not rounding down
double c = 17 / 5;       // 3.0: the division happened in int first
double d = 17 / 5.0;     // 3.4
double e = (double) 17 / 5;   // 3.4
~~~

To get a decimal result, at least one operand must be floating point before the division happens.

## Division by zero

- integer division by zero throws \`ArithmeticException: / by zero\`
- floating-point division by zero gives \`Infinity\` or \`-Infinity\`, and \`0.0 / 0.0\` gives \`NaN\` (not a number), with no exception

The same applies to \`%\`: \`5 % 0\` throws for integers.

## The remainder operator

\`a % b\` gives what's left over after dividing a by b. In Java, the result takes the **sign of the dividend** (the left operand):

~~~java
7 % 3      // 1
-7 % 3     // -1
7 % -3     // 1
5.5 % 2    // 1.5: works on doubles too
~~~

Because of the negative case, \`n % 2 == 1\` fails to detect odd negative numbers: \`-3 % 2\` is -1. Use \`n % 2 != 0\` instead. For a mathematical modulo that's always non-negative, use \`Math.floorMod(n, m)\`.

## Classic uses of %

~~~java
boolean even = n % 2 == 0;            // parity
int lastDigit = n % 10;               // last digit
n = n / 10;                           // drop last digit
boolean divisible = year % 4 == 0;    // divisibility
int index = (i + 1) % size;           // wrap around in a circular buffer
int hours = totalMinutes / 60, minutes = totalMinutes % 60;   // unit conversion
~~~

The digit-extraction pair, \`% 10\` and \`/ 10\`, appears in many problems: summing digits, reversing numbers, checking palindromes and Armstrong numbers.

## Result types

Before arithmetic, Java promotes operands:

- byte, short and char become int
- if either operand is long, the result is long; if either is float, float; if either is double, double

~~~java
byte x = 10, y = 20;
int sum = x + y;          // int, not byte
long big = 1_000_000 * 1_000_000;   // overflow! computed as int first
long ok = 1_000_000L * 1_000_000;   // correct: long arithmetic
~~~

The second line is a classic bug: both literals are int, so the multiplication overflows before the result is widened to long.

## Overflow

Integer arithmetic wraps around silently when it exceeds the type's range. \`Integer.MAX_VALUE + 1\` is \`Integer.MIN_VALUE\`. Use long for large values, or \`Math.addExact\` and \`Math.multiplyExact\`, which throw on overflow.

## + as concatenation

If either operand of \`+\` is a String, it concatenates, and evaluation is left to right:

~~~java
System.out.println(1 + 2 + "3");     // "33": 1 + 2 = 3, then "3" + "3"
System.out.println("1" + 2 + 3);     // "123"
System.out.println("1" + (2 + 3));   // "15"
~~~

## Floating-point arithmetic

Doubles carry small rounding errors: \`0.1 + 0.2\` is 0.30000000000000004. Avoid \`==\` comparisons on doubles and avoid doubles for money. The Math class adds more operations: \`Math.pow\`, \`Math.sqrt\`, \`Math.abs\`, \`Math.max\` and \`Math.round\`.

## Avoiding overflow in averages

\`(a + b) / 2\` overflows when a and b are both large ints. \`a + (b - a) / 2\` gives the same midpoint without overflow and is the standard way to compute the middle index in binary search.

## How interviewers test this

Expect outputs of \`-7 % 3\`, \`17 / 5\`, \`1 + 2 + "3"\` and long overflow puzzles, plus problems such as reversing or summing digits. Explain integer truncation toward zero, the sign rule for remainder, left-to-right concatenation, promotion rules, and the \`% 10\` and \`/ 10\` digit technique.`,
    sources: [OPS_ASSIGN, JLS_EXPR],
  },

  "assignment-operators": {
    theory: `The assignment operator \`=\` stores a value in a variable, and compound assignment operators such as \`+=\` combine an operation with assignment in one step. Assignment looks trivial, but it has precise rules: it's an expression with a value, it's right-associative, and compound forms include a hidden cast. These rules explain several interview puzzles and some real bugs. This lesson covers plain and compound assignment, chaining, the implicit narrowing cast, and assignment with references.

## Plain assignment

\`variable = expression;\` evaluates the right side and stores the result in the variable on the left:

~~~java
int score = 90;
score = score + 5;     // read 90, add 5, store 95
~~~

The left side must be something that can hold a value: a variable, a field or an array element. \`5 = x;\` doesn't compile. The value must be compatible with the variable's type, possibly after widening: \`double d = 5;\` stores 5.0.

## Assignment is not equality

In mathematics, \`x = x + 1\` is impossible; in programming, it means "replace x with x plus one". The equality comparison operator is \`==\`. Confusing them is a classic beginner bug; Java catches most cases, because \`if (x = 5)\` produces an int, not a boolean, and doesn't compile. With booleans it slips through: \`if (done = true)\` assigns and is always true.

## Compound assignment operators

| Operator | Equivalent to |
|---|---|
| \`a += b\` | \`a = (T) (a + b)\` |
| \`a -= b\` | \`a = (T) (a - b)\` |
| \`a *= b\` | \`a = (T) (a * b)\` |
| \`a /= b\` | \`a = (T) (a / b)\` |
| \`a %= b\` | \`a = (T) (a % b)\` |
| \`a &= b\`, \`a |= b\`, \`a ^= b\` | bitwise versions |
| \`a <<= b\`, \`a >>= b\`, \`a >>>= b\` | shift versions |

Here T is the type of \`a\`. They make accumulation patterns concise: \`total += price;\`, \`count -= 1;\`, \`product *= i;\`.

## The hidden cast

Compound assignment includes an implicit cast back to the variable's type:

~~~java
byte b = 10;
b = b + 5;      // compile error: b + 5 is an int
b += 5;         // compiles: equivalent to b = (byte) (b + 5)

int total = 10;
total += 2.7;   // compiles: total = (int) (10 + 2.7) = 12
~~~

The cast means compound assignment can silently truncate or overflow. \`total += 2.7\` quietly drops the fraction. Interviewers love this difference between \`b = b + 5\` and \`b += 5\`.

## Assignment is an expression

An assignment produces a value, the value assigned, which is why chaining works:

~~~java
int a, b, c;
a = b = c = 0;    // right-associative: c = 0, then b = 0, then a = 0
~~~

It also allows the common idiom of assigning and testing in one condition:

~~~java
String line;
while ((line = reader.readLine()) != null) {
    process(line);
}
~~~

The parentheses are required, because \`!=\` has higher precedence than \`=\`. Outside idioms like this, keep assignments as separate statements for readability.

## Evaluation order

In \`arr[i] = i = 2;\`, Java first evaluates the left operand's array and index, using the current value of i, then evaluates the right side. For compound assignment, the left operand's current value is saved before the right side is evaluated:

~~~java
int x = 5;
x += x++ * 2;   // x = 5 + (5 * 2) = 15
~~~

Puzzles like this test evaluation rules; real code should never mix side effects this way.

## Assignment with references

For object types, assignment copies the **reference**, not the object:

~~~java
int[] a = {1, 2, 3};
int[] b = a;      // b points to the same array
b[0] = 99;
System.out.println(a[0]);   // 99
~~~

Both variables now share one array. To copy the contents, use \`a.clone()\` or \`Arrays.copyOf(a, a.length)\`. The same applies to all objects and is one of the most important ideas for understanding Java.

## Strings and +=

\`s += "x"\` on a String creates a new String object each time, because Strings are immutable. In a loop of thousands of iterations, this creates many temporary objects; use \`StringBuilder\` and its \`append\` method instead.

## final variables

A \`final\` variable can be assigned only once. Any later assignment, including compound assignment, is a compile error.

## How interviewers test this

Expect "Why does \`b = b + 1\` fail for a byte while \`b += 1\` compiles?", chained assignment output, and aliasing with arrays. Explain the implicit narrowing cast in compound assignment, right associativity, assignment as an expression with a value, and that assigning references shares objects.`,
    sources: [OPS_ASSIGN, JLS_EXPR],
  },

  "relational-operators": {
    theory: `Relational operators compare two values and produce a boolean: true or false. They power every decision a program makes, from \`if (age >= 18)\` to loop conditions such as \`i < n\`. They're straightforward for numbers, but comparing objects, strings and floating-point values has traps that catch beginners and experienced developers alike. This lesson covers the six relational operators, type rules, comparing references versus contents, and floating-point comparison.

## The six operators

| Operator | Meaning | Example | Result for a = 5, b = 8 |
|---|---|---|---|
| \`==\` | Equal to | \`a == b\` | false |
| \`!=\` | Not equal to | \`a != b\` | true |
| \`<\` | Less than | \`a < b\` | true |
| \`>\` | Greater than | \`a > b\` | false |
| \`<=\` | Less than or equal | \`a <= 5\` | true |
| \`>=\` | Greater than or equal | \`b >= 10\` | false |

The result is always a \`boolean\`, which can be stored, returned, or used directly in conditions:

~~~java
boolean isAdult = age >= 18;
if (isAdult) { ... }
~~~

Writing \`if (isAdult == true)\` is redundant; \`if (isAdult)\` says the same thing.

## Type rules

- \`<\`, \`>\`, \`<=\` and \`>=\` work only on numeric types, including char
- \`==\` and \`!=\` work on numbers, booleans and references
- mixed numeric types are promoted before comparing: \`5 == 5.0\` is true
- chars compare by their Unicode values: \`'a' < 'b'\` is true, and \`'Z' < 'a'\` is true because uppercase letters come first

## No chained comparisons

Mathematics writes \`0 < x < 10\`. In Java, \`0 < x < 10\` doesn't compile: \`0 < x\` produces a boolean, which can't be compared with 10. Combine conditions with \`&&\`:

~~~java
if (x > 0 && x < 10) { ... }
~~~

## == on objects compares references

For reference types, \`==\` asks "are these the same object?", not "do they have the same contents?":

~~~java
String a = new String("java");
String b = new String("java");
System.out.println(a == b);        // false: two different objects
System.out.println(a.equals(b));   // true: same characters
~~~

String literals can appear to work with \`==\` because identical literals share one pooled object:

~~~java
String x = "java";
String y = "java";
System.out.println(x == y);   // true, but only because of the string pool
~~~

Strings built at runtime, read from input, or created with \`new\` aren't pooled, so \`==\` fails unpredictably. **Always compare string contents with \`equals\`**, or \`equalsIgnoreCase\` when case shouldn't matter.

## Wrapper objects

The same applies to Integer and other wrappers. \`Integer a = 1000, b = 1000; a == b\` is false with default settings, while small values from -128 to 127 are cached and compare true. Use \`equals\`, or compare primitives.

## Comparing objects for order

Relational operators don't work on objects: \`"apple" < "banana"\` doesn't compile. Use \`compareTo\`:

~~~java
int result = "apple".compareTo("banana");   // negative: apple comes first
~~~

\`compareTo\` returns a negative number, zero or a positive number for less than, equal and greater than. This is the basis for sorting.

## Floating-point comparison

Rounding errors make \`==\` unreliable for doubles:

~~~java
double sum = 0.1 + 0.2;
System.out.println(sum == 0.3);                    // false
System.out.println(Math.abs(sum - 0.3) < 1e-9);    // true
~~~

Compare doubles within a small tolerance (an epsilon) instead. Two more special cases: \`NaN\` isn't equal to anything, including itself, so \`x == x\` is false when x is NaN; use \`Double.isNaN(x)\`. And \`0.0 == -0.0\` is true.

## Comparing booleans

\`==\` and \`!=\` work on booleans. \`a != b\` on booleans is true exactly when one is true and the other false, which is logical exclusive or.

## Off-by-one errors

Choosing between \`<\` and \`<=\` is the source of many loop bugs. For an array of length n, valid indices are 0 to n - 1, so the loop condition is \`i < n\`, not \`i <= n\`, which would read past the end and throw ArrayIndexOutOfBoundsException.

## How interviewers test this

Expect "== vs equals for strings?", output questions with string literals versus \`new String\`, Integer caching, and "Why is 0.1 + 0.2 == 0.3 false?" Explain reference versus content comparison, recommend equals and compareTo for objects, use a tolerance for doubles, and note that chained comparisons need \`&&\`.`,
    sources: [OPS_EQUALITY, JLS_EXPR],
  },

  "logical-operators": {
    theory: `Logical operators combine boolean values into more complex conditions: AND, OR and NOT. They let programs express rules such as "the user is logged in and has paid" or "the input is empty or invalid". Java's \`&&\` and \`||\` short-circuit, skipping the right side when the answer is already known, which is both an optimization and a safety tool. This lesson covers the logical operators, truth tables, short-circuiting, the non-short-circuit variants, and how to simplify conditions.

## The three operators

| Operator | Name | True when |
|---|---|---|
| \`&&\` | Logical AND | Both operands are true |
| \`||\` | Logical OR | At least one operand is true |
| \`!\` | Logical NOT | The operand is false |

~~~java
boolean canEnroll = isLoggedIn && hasPaid;
boolean needsReview = isFlagged || score < 40;
boolean isOpen = !isClosed;
~~~

All operands must be booleans. Unlike C or JavaScript, Java doesn't treat numbers as true or false: \`if (count)\` doesn't compile.

## Truth tables

| A | B | A && B | A || B | !A |
|---|---|---|---|---|
| true | true | true | true | false |
| true | false | false | true | false |
| false | true | false | true | true |
| false | false | false | false | true |

## Short-circuit evaluation

\`&&\` and \`||\` evaluate the left operand first and skip the right one if the result is already decided:

- \`false && anything\` is false, so the right side isn't evaluated
- \`true || anything\` is true, so the right side isn't evaluated

This makes guard conditions safe:

~~~java
if (name != null && name.length() > 0) { ... }     // no NullPointerException
if (count != 0 && total / count > 50) { ... }      // no division by zero
if (i < arr.length && arr[i] == target) { ... }    // no index out of bounds
~~~

The order matters: put the check that protects the second condition first. Reversing them, \`name.length() > 0 && name != null\`, crashes when name is null.

Short-circuiting also saves work: put cheap or likely-decisive checks first, and expensive ones, such as database lookups, last.

## Side effects and short-circuiting

If the right operand has a side effect, it may not happen:

~~~java
int calls = 0;
boolean r = false && (++calls > 0);
System.out.println(calls);   // 0: the increment never ran
~~~

Avoid side effects inside conditions; code that depends on whether they run is confusing.

## Non-short-circuit operators: & and |

On booleans, \`&\` and \`|\` compute AND and OR but always evaluate both sides:

~~~java
if (name != null & name.length() > 0)   // NullPointerException when name is null
~~~

They're rarely what you want in conditions. They exist mainly as bitwise operators on integers, covered in the bitwise lesson. \`^\` on booleans is exclusive OR: true when exactly one operand is true.

## Precedence

\`!\` binds tightest, then \`&&\`, then \`||\`. So \`a || b && c\` means \`a || (b && c)\`. Relational operators bind tighter than logical ones, so \`x > 0 && x < 10\` needs no parentheses. When mixing \`&&\` and \`||\`, add parentheses for readers even when precedence gives the right answer.

## De Morgan's laws

Negating a compound condition flips AND and OR:

- \`!(a && b)\` is the same as \`!a || !b\`
- \`!(a || b)\` is the same as \`!a && !b\`

~~~java
// "not (between 1 and 10)"
if (!(x >= 1 && x <= 10)) { ... }
// equivalent, often clearer:
if (x < 1 || x > 10) { ... }
~~~

De Morgan's laws help simplify conditions and are a favourite question in aptitude and coding rounds.

## Writing readable conditions

- extract complex conditions into well-named booleans or methods: \`boolean eligible = age >= 18 && hasId;\`
- avoid double negatives such as \`!isNotValid\`
- compare booleans directly: \`if (done)\`, not \`if (done == true)\`
- return conditions directly: \`return age >= 18;\` instead of an if-else returning true or false

## Example: leap year

~~~java
boolean isLeap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
~~~

A year is a leap year if divisible by 4 but not by 100, unless it's divisible by 400. The parentheses make the rule readable at a glance.

## How interviewers test this

Expect "What is short-circuit evaluation?", "Difference between & and &&?", output puzzles where a side effect is skipped, and condition simplification with De Morgan's laws. Explain short-circuiting with the null-check guard, show that \`&\` evaluates both sides, and apply De Morgan's laws to rewrite a negated condition.`,
    sources: [OPS_EQUALITY, JLS_EXPR],
  },

  "unary-operators": {
    theory: `Unary operators act on a single operand. Java has unary plus and minus, logical NOT, bitwise complement, and the increment and decrement operators \`++\` and \`--\`. The increment operators come in prefix and postfix forms that behave differently inside expressions, which produces some of the most famous output puzzles in programming interviews. This lesson explains each unary operator, the exact difference between \`++i\` and \`i++\`, and the traps to avoid.

## The unary operators

| Operator | Name | Example | Effect |
|---|---|---|---|
| \`+\` | Unary plus | \`+x\` | Value of x (promotes small types to int) |
| \`-\` | Unary minus | \`-x\` | Negates x |
| \`++\` | Increment | \`++x\` or \`x++\` | Adds 1 to x |
| \`--\` | Decrement | \`--x\` or \`x--\` | Subtracts 1 from x |
| \`!\` | Logical NOT | \`!done\` | Flips a boolean |
| \`~\` | Bitwise complement | \`~x\` | Flips every bit |

## Unary minus

\`-x\` negates a number. One edge case: \`-Integer.MIN_VALUE\` is still \`Integer.MIN_VALUE\`, because +2,147,483,648 doesn't fit in an int and wraps around. \`Math.abs(Integer.MIN_VALUE)\` returns a negative number for the same reason, a known trap.

## Prefix versus postfix

Both forms add 1 to the variable. They differ in the **value of the expression**:

- **prefix** \`++x\`: increment first, then the expression's value is the new value
- **postfix** \`x++\`: the expression's value is the old value, then the variable is incremented

~~~java
int a = 5;
int b = ++a;    // a becomes 6, b gets 6

int c = 5;
int d = c++;    // d gets 5, c becomes 6
~~~

As standalone statements, \`i++;\` and \`++i;\` are equivalent; the difference only appears when the value is used.

## Tracing increments in expressions

Java evaluates operands left to right, applying each increment when its operand is evaluated:

~~~java
int x = 5;
int y = x++ + ++x;
// x++ gives 5, x is now 6
// ++x makes x 7, gives 7
// y = 5 + 7 = 12, x = 7
~~~

~~~java
int i = 1;
i = i++;
System.out.println(i);   // 1
~~~

The second puzzle surprises many people. \`i++\` evaluates to 1 and sets i to 2, then the assignment stores the expression's value, 1, back into i. The increment is overwritten.

These puzzles test precise understanding of evaluation order. Real code should never modify the same variable twice in one expression.

## Increments in loops

\`for (int i = 0; i < n; i++)\` is the idiomatic loop. Using \`++i\` there makes no difference in Java, since the value is discarded; modern compilers produce identical code. Choose one style and stay consistent.

## The hidden cast in ++ and --

Like compound assignment, \`++\` and \`--\` include an implicit cast:

~~~java
byte b = 127;
b++;            // compiles: b becomes -128 (overflow wraps)
char c = 'a';
c++;            // 'b'
~~~

\`b = b + 1\` wouldn't compile without a cast, but \`b++\` does. Incrementing chars is handy for iterating through letters.

## Logical NOT

\`!\` flips a boolean: \`!true\` is false. It's common in conditions such as \`if (!list.isEmpty())\` and toggles such as \`isVisible = !isVisible;\`. It applies only to booleans.

## Bitwise complement

\`~x\` flips every bit of an integer. Because Java uses two's complement for negative numbers, \`~x\` always equals \`-x - 1\`: \`~5\` is -6, and \`~0\` is -1. The bitwise lesson covers this representation.

## Precedence

Postfix operators have the highest precedence, followed by prefix and other unary operators, then multiplication. So \`-x++\` means \`-(x++)\`, and \`!a && b\` means \`(!a) && b\`.

## Increments can't apply to literals or expressions

\`5++\` and \`(a + b)++\` don't compile; the operand must be a variable, field or array element. \`final\` variables can't be incremented either.

## Common uses

- counters: \`count++\`
- moving through an array: \`arr[index++] = value;\` stores then advances, a compact idiom in array-filling code
- two pointers moving toward each other: \`left++; right--;\`

## How interviewers test this

Expect output puzzles such as \`x++ + ++x\`, \`i = i++\`, and \`byte b = 127; b++\`. Trace each operand left to right, applying prefix increments before use and postfix increments after, explain why \`i = i++\` leaves i unchanged, and mention the implicit cast that lets \`b++\` compile.`,
    sources: [OPS_ASSIGN, JLS_EXPR],
  },

  "bitwise-operators": {
    theory: `Bitwise operators work on the individual bits of integer values. They're the fastest operations a CPU performs and power low-level tasks such as flags, permissions, hashing, compression and graphics. They also solve a whole family of interview problems elegantly: checking powers of two, counting set bits, finding a unique element, and generating subsets. This lesson covers binary representation, the six bitwise operators, two's complement, and the bit tricks interviewers ask about most.

## Binary refresher

Integers are stored as binary digits. The int 13 is \`00000000 00000000 00000000 00001101\`, which is 8 + 4 + 1. Each position represents a power of two, counting from bit 0 on the right. Java's \`Integer.toBinaryString(13)\` shows "1101".

## The operators

| Operator | Name | Rule per bit | Example (5 = 0101, 3 = 0011) |
|---|---|---|---|
| \`&\` | AND | 1 if both bits are 1 | \`5 & 3\` = 0001 = 1 |
| \`|\` | OR | 1 if either bit is 1 | \`5 | 3\` = 0111 = 7 |
| \`^\` | XOR | 1 if bits differ | \`5 ^ 3\` = 0110 = 6 |
| \`~\` | NOT | Flip every bit | \`~5\` = -6 |
| \`<<\` | Left shift | Move bits left, fill with 0 | \`5 << 1\` = 1010 = 10 |
| \`>>\` | Signed right shift | Move bits right, copy the sign bit | \`-8 >> 1\` = -4 |
| \`>>>\` | Unsigned right shift | Move bits right, fill with 0 | \`-8 >>> 28\` = 15 |

## Two's complement

Java stores negative integers in **two's complement**: to negate a number, flip all its bits and add 1. The leftmost bit is the sign bit, 1 for negative. Consequences:

- \`~x == -x - 1\` for every int
- -1 is all ones: \`11111111...1111\`
- the int range is asymmetric: -2,147,483,648 to 2,147,483,647

## Shifts

- \`x << n\` multiplies by 2^n, as long as no bits overflow: \`1 << 10\` is 1024
- \`x >> n\` divides by 2^n, rounding toward negative infinity: \`-7 >> 1\` is -4
- \`>>>\` treats the number as unsigned, filling with zeros, so it's useful for negative values in hashing

Java masks the shift distance: for ints only the low 5 bits count, so \`1 << 32\` is 1, not 0.

## Working with individual bits

~~~java
boolean isSet = (n & (1 << i)) != 0;   // check bit i
n = n | (1 << i);                       // set bit i
n = n & ~(1 << i);                      // clear bit i
n = n ^ (1 << i);                       // toggle bit i
~~~

These four lines are the foundation of bit manipulation.

## Classic tricks

**Even or odd**: \`(n & 1) == 0\` means even, working for negatives too.

**Power of two**: a power of two has exactly one set bit, and subtracting 1 flips that bit and all bits below it:

~~~java
boolean isPowerOfTwo = n > 0 && (n & (n - 1)) == 0;
~~~

**Count set bits**: \`n & (n - 1)\` clears the lowest set bit, so loop until n is zero (Brian Kernighan's algorithm), or call \`Integer.bitCount(n)\`.

**Find the unique element**: XOR has the properties \`a ^ a = 0\` and \`a ^ 0 = a\`, and order doesn't matter. XOR-ing all elements of an array where every number appears twice except one leaves the unique number:

~~~java
int result = 0;
for (int x : nums) result ^= x;
~~~

**Swap without a temporary variable**: \`a ^= b; b ^= a; a ^= b;\`. Clever, but less readable than using a temp variable, and it breaks if a and b refer to the same array element.

## Flags and permissions

Bits can store many yes or no options in one integer:

~~~java
static final int READ = 1, WRITE = 2, EXECUTE = 4;   // 001, 010, 100
int perms = READ | WRITE;            // 011
boolean canWrite = (perms & WRITE) != 0;
perms &= ~WRITE;                     // revoke write
~~~

Unix file permissions (\`chmod 755\`) use exactly this idea. In Java application code, \`EnumSet\` is a more readable alternative built on the same bit-vector technique.

## Subsets with bitmasks

For a set of n items, the numbers 0 to 2^n - 1 represent every subset: bit i set means item i is included. This generates all subsets of small sets without recursion.

## Precedence trap

Bitwise operators have **lower** precedence than relational operators:

~~~java
if (n & 1 == 0)    // parsed as n & (1 == 0): doesn't compile for int n
if ((n & 1) == 0)  // correct
~~~

Always parenthesize bitwise expressions in comparisons.

## How interviewers test this

Expect "Check if a number is a power of two", "Count set bits", "Find the element appearing once", and outputs of \`~5\`, \`-8 >> 1\` and \`-8 >>> 1\`. Explain two's complement, the \`n & (n - 1)\` trick, XOR's cancelling property, and the difference between signed and unsigned right shift.`,
    sources: [OPS_BITWISE, JLS_EXPR],
  },

  "operator-precedence": {
    theory: `When an expression contains several operators, precedence and associativity decide which operations happen first. \`2 + 3 * 4\` is 14 because multiplication has higher precedence than addition. Most of the time precedence matches mathematical intuition, but some rules, especially around logical, bitwise, ternary and assignment operators, produce surprises. This lesson presents Java's precedence table, associativity, evaluation order, and the practical rule that parentheses beat memorization.

## Precedence table

From highest to lowest:

| Level | Operators | Associativity |
|---|---|---|
| 1 | Postfix \`x++ x--\` | Left to right |
| 2 | Prefix and unary \`++x --x + - ! ~\`, casts | Right to left |
| 3 | Multiplicative \`* / %\` | Left to right |
| 4 | Additive \`+ -\` | Left to right |
| 5 | Shift \`<< >> >>>\` | Left to right |
| 6 | Relational \`< > <= >= instanceof\` | Left to right |
| 7 | Equality \`== !=\` | Left to right |
| 8 | Bitwise AND \`&\` | Left to right |
| 9 | Bitwise XOR \`^\` | Left to right |
| 10 | Bitwise OR \`|\` | Left to right |
| 11 | Logical AND \`&&\` | Left to right |
| 12 | Logical OR \`||\` | Left to right |
| 13 | Ternary \`? :\` | Right to left |
| 14 | Assignment \`= += -= *=\` and others | Right to left |

A useful memory aid: unary, arithmetic, shift, comparison, bitwise, logical, ternary, assignment.

## Precedence in action

~~~java
int r1 = 2 + 3 * 4;          // 14
int r2 = (2 + 3) * 4;        // 20
int r3 = 10 - 2 - 3;         // 5: left-associative, (10 - 2) - 3
int r4 = 20 / 2 * 5;         // 50: (20 / 2) * 5, same level, left to right
boolean b = 5 > 3 && 2 > 4;  // false: comparisons first, then &&
~~~

## Associativity

When operators share a level, associativity decides grouping:

- **left to right** for most binary operators: \`a - b - c\` is \`(a - b) - c\`
- **right to left** for unary operators, ternary and assignment: \`a = b = c\` is \`a = (b = c)\`, and \`-~x\` is \`-(~x)\`

Nested ternaries group from the right: \`a ? b : c ? d : e\` means \`a ? b : (c ? d : e)\`.

## Precedence is not evaluation order

Precedence decides grouping, not the order operands are computed. Java always evaluates operands **left to right**:

~~~java
int i = 2;
int r = i * (i = 5);   // 2 * 5 = 10: the left operand i is read before the assignment
~~~

In \`a() + b() * c()\`, the multiplication groups first, but the methods are called in the order a, b, c. This distinction matters when operands have side effects.

## Classic traps

**Integer division before multiplication**:

~~~java
double pct = 1 / 4 * 100;      // 0.0: 1 / 4 is 0 in integer division
double ok = 100.0 * 1 / 4;     // 25.0
~~~

**Concatenation is left to right**:

~~~java
System.out.println("Sum: " + 2 + 3);    // "Sum: 23"
System.out.println("Sum: " + (2 + 3));  // "Sum: 5"
System.out.println(2 + 3 + " total");   // "5 total"
~~~

**Bitwise below comparison**:

~~~java
if ((flags & MASK) != 0)    // parentheses required
~~~

Without them, \`flags & MASK != 0\` parses as \`flags & (MASK != 0)\`, which doesn't compile for ints.

**&& before ||**:

~~~java
boolean r = true || false && false;   // true: && binds first, true || (false && false)
~~~

**Ternary below everything except assignment**:

~~~java
String s = "Score: " + score > 50 ? "pass" : "fail";   // compile error
~~~

The \`+\` runs first, producing a String, which can't be compared with \`>\`. Write \`"Score: " + (score > 50 ? "pass" : "fail")\`.

**Casts bind tightly**:

~~~java
double avg = (double) total / count;    // casts total, then divides: correct
double bad = (double) (total / count);  // divides in int first: truncated
~~~

## Parentheses are free

Parentheses cost nothing at runtime and make intent explicit. Professional style guides recommend them whenever an expression mixes operator families, such as arithmetic with bitwise, or \`&&\` with \`||\`. Code is read far more often than it's written; nobody should need the precedence table to understand your expressions.

## Solving precedence puzzles

1. add parentheses according to the table, highest precedence first
2. apply associativity for operators at the same level
3. evaluate operands left to right, applying side effects as they occur
4. track types: integer division, promotion and String concatenation

## How interviewers test this

Expect output questions such as \`1 / 4 * 100\`, \`"a" + 1 + 2\`, \`true || false && false\` and expressions mixing ternary with \`+\`. Group operators using the table, distinguish grouping from left-to-right operand evaluation, and recommend parentheses for readability.`,
    sources: [OPERATORS, JLS_EXPR],
  },

  "printing-output": {
    theory: `Printing output is how a program communicates results: to a user at a terminal, to a log file, or to you while debugging. Java's \`System.out\` provides \`print\`, \`println\` and \`printf\`, plus \`String.format\` for building formatted text. Formatting numbers, aligning columns and producing exactly the expected output are everyday tasks, and on coding platforms, output must match character for character. This lesson covers how printing works, string concatenation, formatted output, and printing efficiently.

## System.out

\`System.out\` is a \`PrintStream\` object connected to the program's **standard output**, usually the terminal. Its methods convert values to text and write them:

~~~java
System.out.println("Hello");     // text, then a newline
System.out.println(42);          // numbers are converted to text
System.out.println(3.5);
System.out.println(true);
System.out.println('A');
~~~

There's also \`System.err\`, the **standard error** stream, intended for error messages. Terminals usually show both, but they can be redirected separately: \`java App > out.txt\` captures only standard output.

## Concatenation

The \`+\` operator joins strings with other values:

~~~java
String name = "Asha";
int score = 92;
System.out.println("Student: " + name + ", score: " + score);
~~~

Watch the left-to-right rule: \`"Total: " + 5 + 3\` prints "Total: 53". Wrap arithmetic in parentheses: \`"Total: " + (5 + 3)\`.

## How objects print

Printing an object calls its \`toString()\` method. Classes without a custom \`toString\` print something like \`Student@1b6d3586\`. Arrays are the classic trap:

~~~java
int[] nums = {1, 2, 3};
System.out.println(nums);                    // [I@6d06d69c
System.out.println(Arrays.toString(nums));   // [1, 2, 3]
~~~

\`Arrays.toString\` prints a one-dimensional array; \`Arrays.deepToString\` prints nested arrays. Collections such as ArrayList already print their contents.

## Formatted output with printf

\`printf\` takes a format string with placeholders, followed by values:

~~~java
System.out.printf("%s scored %d marks%n", "Ravi", 88);
System.out.printf("Average: %.2f%n", 87.456);   // Average: 87.46
~~~

Common format specifiers:

| Specifier | Meaning | Example | Output |
|---|---|---|---|
| \`%d\` | Integer | \`printf("%d", 42)\` | 42 |
| \`%f\` | Decimal (6 places default) | \`printf("%f", 3.5)\` | 3.500000 |
| \`%.2f\` | Decimal with 2 places | \`printf("%.2f", 3.14159)\` | 3.14 |
| \`%s\` | String (or any object) | \`printf("%s", "hi")\` | hi |
| \`%c\` | Character | \`printf("%c", 'x')\` | x |
| \`%b\` | Boolean | \`printf("%b", true)\` | true |
| \`%n\` | Platform newline | | |
| \`%%\` | Literal percent sign | \`printf("100%%")\` | 100% |

\`printf\` doesn't add a newline automatically; end the format with \`%n\`.

## Width and alignment

A number between \`%\` and the letter sets a minimum width:

~~~java
System.out.printf("%-10s|%5d|%n", "Asha", 92);
System.out.printf("%-10s|%5d|%n", "Ravi", 8);
// Asha      |   92|
// Ravi      |    8|
~~~

A minus sign left-aligns. \`%05d\` pads with zeros: \`printf("%05d", 42)\` prints 00042. \`%,d\` adds grouping separators: 1,000,000.

## String.format

\`String.format\` uses the same syntax but returns a String instead of printing, useful for building messages:

~~~java
String msg = String.format("%s has %d new messages", user, count);
String price = String.format("%.2f", amount);
~~~

Since Java 15, \`"%s scored %d".formatted(name, score)\` does the same thing as an instance method.

## Rounding when printing

\`%.2f\` rounds for display (HALF_UP behaviour) without changing the stored value. For calculations that need exact decimal rounding, such as invoices, use \`BigDecimal\` with \`setScale\`.

## Printing efficiently

Each \`System.out.println\` call is relatively slow, because output is synchronized and may be flushed. Printing hundreds of thousands of lines one at a time can make competitive programming solutions time out. Build the output in a \`StringBuilder\` and print once:

~~~java
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= n; i++) sb.append(i).append('\\n');
System.out.print(sb);
~~~

A \`PrintWriter\` wrapped around \`System.out\` with a buffer is another common approach.

## Matching expected output exactly

Online judges compare output strictly. Common causes of "wrong answer" despite correct logic:

- extra or missing spaces, especially trailing spaces
- a missing final newline, or an extra blank line
- printing \`3.5\` when \`3.50\` was expected
- debug prints left in the code

## Printing for debugging

Temporary prints such as \`System.out.println("i=" + i + " sum=" + sum);\` reveal what a program is doing. Remove them before submitting. Real applications use logging frameworks, which add timestamps and levels and can be switched off without code changes.

## How interviewers test this

Expect formatting tasks such as printing to two decimal places or aligning a table, the array-printing trap, and concatenation puzzles. Show printf specifiers including width and precision, use Arrays.toString for arrays, and mention StringBuilder for large outputs.`,
    sources: [PRINTSTREAM, FORMATTER],
  },

  "print-vs-println": {
    theory: `\`print\` and \`println\` both write text to standard output; the only difference is that \`println\` adds a line separator after the text. That small difference controls the entire layout of console output, from single values to pattern problems that print grids of stars. This lesson explains both methods precisely, line separators across operating systems, how they combine in loops, buffering behaviour, and the subtle mistakes that produce misaligned output.

## The difference

~~~java
System.out.print("Hello");
System.out.print("World");
// HelloWorld

System.out.println("Hello");
System.out.println("World");
// Hello
// World
~~~

\`print\` leaves the cursor at the end of the text. \`println\` writes the text, then a line separator, moving the cursor to the start of the next line.

## println with no arguments

\`System.out.println();\` prints only a line separator, which ends the current line or adds a blank line. \`System.out.print();\` with no arguments doesn't compile; there's nothing to print.

## Line separators across platforms

Different operating systems end lines differently:

| System | Line separator | Escape |
|---|---|---|
| Linux, macOS | Line feed | \`\\n\` |
| Windows | Carriage return + line feed | \`\\r\\n\` |

\`println\` uses the platform's separator, available as \`System.lineSeparator()\`. In \`printf\`, \`%n\` produces the platform separator, while \`\\n\` always produces a line feed. For files exchanged between systems, or output compared by online judges, \`\\n\` is usually expected; most judges accept both.

## Combining print and println

\`print\` builds a line piece by piece; \`println\` finishes it. This combination is the basis of pattern printing:

~~~java
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= row; col++) {
        System.out.print("* ");
    }
    System.out.println();          // end the row
}
// *
// * *
// * * *
~~~

The inner loop uses \`print\` to stay on the same line; the \`println\` after it moves to the next row. Putting \`println\` inside the inner loop would print one star per line, the most common mistake in pattern problems.

## Separating values

Printing several values on one line requires explicit separators:

~~~java
for (int i = 1; i <= 5; i++) {
    System.out.print(i + " ");
}
System.out.println();
// 1 2 3 4 5   (with a trailing space)
~~~

Some judges reject trailing spaces. Options to avoid them:

~~~java
for (int i = 1; i <= 5; i++) {
    if (i > 1) System.out.print(" ");
    System.out.print(i);
}
System.out.println();
~~~

Or build the line with \`String.join(" ", parts)\` or a \`StringJoiner\`, which places separators only between items.

## What both methods accept

Both are overloaded for every primitive type, \`char[]\`, \`String\` and \`Object\`. Passing a \`char[]\` prints its characters, unlike other arrays:

~~~java
char[] letters = {'h', 'i'};
System.out.println(letters);              // hi
System.out.println("Letters: " + letters); // Letters: [C@1b6d3586
~~~

In the second line, concatenation calls the array's default \`toString\`, because the \`+\` turns the expression into a String before println sees it.

## null values

\`System.out.println((String) null)\` prints "null". Concatenating null also produces "null": \`"Value: " + null\`. Calling a method on a null reference, such as \`obj.toString()\`, throws NullPointerException, but printing the reference directly doesn't.

## Buffering and flushing

Standard output is buffered: text may sit in memory briefly before appearing. \`System.out\` is typically configured to flush when \`println\` is called, so \`print\` output may appear later than expected in some environments, for example before reading input. Calling \`System.out.flush()\` forces it out. When mixing \`System.out\` and \`System.err\`, lines can appear out of order because the streams are buffered separately.

## Prompts before input

When asking for input, \`print\` keeps the cursor on the same line as the prompt:

~~~java
System.out.print("Enter your name: ");
String name = scanner.nextLine();
~~~

Using \`println\` would put the user's typing on the line below.

## Performance

Each call costs something, so printing one character at a time in a large loop is slow. For big outputs, collect text in a \`StringBuilder\` and print once.

## Choosing between them

- \`println\` when each value or message belongs on its own line
- \`print\` when building a line from parts, or prompting for input
- \`printf\` when the output needs formatting, adding \`%n\` for a line break

## How interviewers test this

Expect pattern-printing problems where print and println placement decides the shape, questions on what \`System.out.println(charArray)\` prints, and output-matching issues like trailing spaces. Explain that println appends a platform line separator, show the inner print and outer println structure for patterns, and mention separators between values.`,
    sources: [PRINTSTREAM, IO_TUT],
  },

  "escape-sequences": {
    theory: `Some characters can't be typed directly inside a string literal: a double quote would end the string, a newline would break the line of code, and a backslash has special meaning. **Escape sequences** solve this with a backslash followed by a code, such as \`\\n\` for a newline or \`\\"\` for a quote. This lesson covers Java's escape sequences, Unicode escapes, text blocks for multi-line strings, and the common mistakes with backslashes in file paths and regular expressions.

## Java's escape sequences

| Sequence | Meaning |
|---|---|
| \`\\n\` | Newline (line feed) |
| \`\\t\` | Tab |
| \`\\"\` | Double quote |
| \`\\'\` | Single quote |
| \`\\\\\` | Backslash |
| \`\\r\` | Carriage return |
| \`\\b\` | Backspace |
| \`\\f\` | Form feed |
| \`\\s\` | Space (Java 15+) |
| \`\\0\` to \`\\377\` | Octal character value, such as \`\\0\` for the null character |

Any other character after a backslash, such as \`\\d\` in a normal string, is a compile error: "illegal escape character".

## Newlines and tabs

~~~java
System.out.println("Line one\\nLine two");
// Line one
// Line two

System.out.println("Name\\tScore\\nAsha\\t92");
// Name    Score
// Asha    92
~~~

Tabs jump to the next tab stop, often every 8 columns, so tab-aligned output can still look uneven when values have different lengths. For reliable alignment, use \`printf\` with widths, such as \`%-10s\`.

## Quotes inside strings

~~~java
System.out.println("She said \\"hello\\"");    // She said "hello"
System.out.println("It's fine");               // single quotes need no escape in strings
char quote = '\\'';                            // but they do in char literals
char dq = '"';                                 // double quote needs none in a char literal
~~~

## Backslashes

A literal backslash must be doubled:

~~~java
String path = "C:\\\\Users\\\\asha\\\\notes.txt";   // C:\\Users\\asha\\notes.txt
~~~

Writing \`"C:\\Users\\new"\` causes problems: \`\\U\` is an illegal escape, and \`\\n\` would silently become a newline. Two practical alternatives: use forward slashes, which Java accepts on Windows for file paths, or build paths with \`Path.of("C:", "Users", "asha")\`.

## Escapes and regular expressions

Regular expressions use backslashes too, so they double up. The regex for "one or more digits" is \`\\d+\`; in a Java string literal it becomes \`"\\\\d+"\`:

~~~java
boolean allDigits = "12345".matches("\\\\d+");
String[] words = sentence.split("\\\\s+");   // split on whitespace
~~~

Matching a literal dot needs \`"\\\\."\`, because a bare \`.\` in regex means "any character". \`"a.b.c".split(".")\` returns an empty array, a classic surprise; \`split("\\\\.")\` gives the three parts.

## Unicode escapes

\`\\u\` followed by four hex digits represents a Unicode character:

~~~java
System.out.println("\\u20B9 500");   // ₹ 500
char omega = '\\u03A9';               // Ω
~~~

Unicode escapes are processed **before** the compiler parses anything else, even inside comments. A comment containing \`\\u000A\` (a newline) can end the comment early, which leads to strange compile errors. This is a well-known Java puzzle.

## Text blocks

Java 15 added **text blocks** for multi-line strings, delimited by three double quotes:

~~~java
String json = """
    {
      "name": "Asha",
      "score": 92
    }
    """;
~~~

Inside a text block, newlines are kept as written, double quotes don't need escaping, and common leading indentation is removed automatically. They're ideal for JSON, SQL, HTML and test data. A backslash at the end of a line joins it with the next line, and \`\\s\` preserves a trailing space that would otherwise be stripped.

## Carriage return and backspace

\`\\r\` moves the cursor to the start of the line without advancing, which terminals use for progress indicators that overwrite themselves. \`\\b\` moves back one character. Their visible effect depends on the terminal and is rarely needed in application code.

## Counting characters

An escape sequence is written with two or more characters but represents one character in the string:

~~~java
System.out.println("a\\nb".length());   // 3
System.out.println("\\\\".length());     // 1
~~~

## Escapes in char literals

Char literals use the same escapes: \`'\\n'\`, \`'\\t'\`, \`'\\\\'\`, \`'\\''\`. Comparing characters with these is common when processing input, such as \`if (c == '\\n')\`.

## How interviewers test this

Expect output questions with \`\\n\`, \`\\t\` and \`\\"\`, string length puzzles involving escapes, and "Why does \`split(".")\` return nothing?" List the main sequences, explain double escaping in paths and regex, mention that Unicode escapes are processed before parsing, and show text blocks for multi-line strings.`,
    sources: [JLS_LEXICAL, PRINTSTREAM],
  },

  "taking-input-scanner": {
    theory: `Programs become useful when they respond to input. In Java, the \`Scanner\` class from \`java.util\` is the standard beginner-friendly way to read from the keyboard: it splits input into tokens and converts them to numbers, words or lines. Scanner is convenient but has a famous trap when mixing \`nextInt\` and \`nextLine\`, and it's slow for large inputs. This lesson covers creating a Scanner, reading each kind of value, how tokens and lines work, the newline trap, and faster alternatives.

## Creating a Scanner

~~~java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter your age: ");
        int age = sc.nextInt();
        System.out.println("Next year you'll be " + (age + 1));
        sc.close();
    }
}
~~~

\`System.in\` is the program's standard input stream, usually the keyboard. The Scanner wraps it and does the parsing.

## Reading methods

| Method | Reads | Example input | Result |
|---|---|---|---|
| \`nextInt()\` | Next token as int | \`42\` | 42 |
| \`nextLong()\` | Next token as long | \`9000000000\` | 9000000000 |
| \`nextDouble()\` | Next token as double | \`3.5\` | 3.5 |
| \`nextBoolean()\` | Next token as boolean | \`true\` | true |
| \`next()\` | Next token as String | \`hello world\` | "hello" |
| \`nextLine()\` | Rest of the current line | \`hello world\` | "hello world" |

There's no \`nextChar()\`; use \`sc.next().charAt(0)\`.

## Tokens versus lines

Most Scanner methods read **tokens**: chunks of text separated by whitespace (spaces, tabs, newlines). Whitespace between tokens is skipped, so these inputs are read the same way by three \`nextInt()\` calls:

~~~
10 20 30
~~~

~~~
10
20
30
~~~

\`nextLine()\` is different: it reads everything up to the end of the current line, including spaces, and consumes the line ending without including it.

## The nextInt and nextLine trap

~~~java
System.out.print("Age: ");
int age = sc.nextInt();
System.out.print("Name: ");
String name = sc.nextLine();   // returns "" immediately!
~~~

When the user types \`21\` and presses Enter, the input is \`21\\n\`. \`nextInt()\` reads 21 but leaves the newline in the buffer. \`nextLine()\` then reads up to that newline, finding an empty line.

Fixes:

- call an extra \`sc.nextLine()\` after \`nextInt()\` to consume the leftover newline
- or read every line with \`nextLine()\` and parse: \`int age = Integer.parseInt(sc.nextLine().trim());\`

The second approach avoids the trap entirely and is common in real programs.

## Reading a known number of values

A typical coding-round input format gives a count, then values:

~~~
5
3 8 1 9 4
~~~

~~~java
int n = sc.nextInt();
int[] arr = new int[n];
for (int i = 0; i < n; i++) {
    arr[i] = sc.nextInt();
}
~~~

## Reading until input ends

When the number of inputs isn't given, use the \`hasNext\` methods:

~~~java
while (sc.hasNextInt()) {
    int x = sc.nextInt();
    sum += x;
}
~~~

\`hasNextInt()\` returns false at the end of input, or when the next token isn't an integer. From a keyboard, end-of-input is signalled with Ctrl+D on Linux and macOS, or Ctrl+Z then Enter on Windows.

## Closing the Scanner

\`sc.close()\` releases the underlying stream. Closing a Scanner wrapped around \`System.in\` also closes System.in, so a second Scanner created later can't read anything. Create **one** Scanner for System.in and reuse it throughout the program. Try-with-resources (\`try (Scanner sc = new Scanner(System.in)) { ... }\`) closes it automatically.

## Locale and decimals

Scanner uses the system locale to parse numbers. On a machine set to a locale that uses commas for decimals, \`nextDouble()\` may reject "3.5". \`sc.useLocale(Locale.US)\` makes parsing consistent.

## Scanning strings and files

Scanner can read from other sources:

~~~java
Scanner words = new Scanner("apple banana cherry");
Scanner file = new Scanner(Path.of("data.txt"));
~~~

## Faster input for large data

Scanner uses regular expressions internally and is slow for hundreds of thousands of numbers, enough to cause timeouts in competitive programming. \`BufferedReader\` reads whole lines quickly:

~~~java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int n = Integer.parseInt(br.readLine().trim());
String[] parts = br.readLine().trim().split("\\\\s+");
~~~

Splitting lines and parsing them yourself is much faster. \`StringTokenizer\` is a lighter alternative to \`split\`.

## How interviewers test this

Expect "Why does nextLine return an empty string after nextInt?", "Difference between next and nextLine?" and "How do you read input faster than Scanner?" Explain tokens versus lines, show the leftover newline and both fixes, warn about closing System.in, and mention BufferedReader for large inputs.`,
    sources: [SCANNER, IO_TUT],
  },

  "input-parsing-errors": {
    theory: `Users type unexpected things: letters where numbers belong, empty lines, extra spaces, values out of range. A robust program expects bad input, detects it, and responds helpfully instead of crashing. In Java, parsing failures surface as exceptions such as \`InputMismatchException\` and \`NumberFormatException\`. This lesson covers the common parsing errors, handling them with try-catch, validating before parsing, re-prompting loops, and the difference between format errors and range errors.

## What goes wrong

~~~java
Scanner sc = new Scanner(System.in);
int age = sc.nextInt();   // user types "twenty"
~~~

The program crashes with:

~~~
Exception in thread "main" java.util.InputMismatchException
~~~

Common failure cases:

| Situation | Method | Exception |
|---|---|---|
| Letters where an int is expected | \`sc.nextInt()\` | \`InputMismatchException\` |
| Text that isn't a number | \`Integer.parseInt("12a")\` | \`NumberFormatException\` |
| Empty string | \`Integer.parseInt("")\` | \`NumberFormatException\` |
| Number too large for int | \`Integer.parseInt("9999999999")\` | \`NumberFormatException\` |
| No more input | \`sc.nextInt()\` at end of input | \`NoSuchElementException\` |
| Decimal where int is expected | \`sc.nextInt()\` with "3.5" | \`InputMismatchException\` |

Note that \`Integer.parseInt(" 42")\` also fails because of the leading space; call \`trim()\` first.

## Catching parsing exceptions

~~~java
String text = sc.nextLine().trim();
try {
    int age = Integer.parseInt(text);
    System.out.println("Age: " + age);
} catch (NumberFormatException e) {
    System.out.println("Please enter a whole number, not \\"" + text + "\\"");
}
~~~

The \`try\` block contains code that might fail; the \`catch\` block runs only if that exception is thrown. The program continues instead of crashing. Error messages should tell the user what went wrong and what's expected.

## Re-prompting until input is valid

~~~java
int age;
while (true) {
    System.out.print("Enter age (1-120): ");
    String line = sc.nextLine().trim();
    try {
        age = Integer.parseInt(line);
        if (age >= 1 && age <= 120) break;
        System.out.println("Age must be between 1 and 120.");
    } catch (NumberFormatException e) {
        System.out.println("That's not a number. Try again.");
    }
}
~~~

This pattern handles both kinds of bad input: wrong **format** (not a number) and wrong **range** (a number, but invalid). Both need checking; parsing successfully doesn't make a value valid.

## The Scanner token trap

If \`nextInt()\` throws InputMismatchException, the bad token **stays in the buffer**. A loop that calls \`nextInt()\` again will fail on the same token forever:

~~~java
while (true) {
    try {
        int n = sc.nextInt();
        break;
    } catch (InputMismatchException e) {
        System.out.println("Not a number");
        sc.next();     // discard the bad token, or the loop never ends
    }
}
~~~

Reading whole lines with \`nextLine()\` and parsing them avoids this problem.

## Validating before parsing

Scanner can check the next token without consuming it:

~~~java
System.out.print("Enter a number: ");
while (!sc.hasNextInt()) {
    System.out.println("Invalid, try again: ");
    sc.next();   // skip the bad token
}
int n = sc.nextInt();
~~~

\`hasNextInt()\`, \`hasNextDouble()\` and similar methods return true only if the next token can be parsed, avoiding exceptions altogether.

## Exceptions versus checks

Two styles exist:

- **look before you leap**: check first (\`hasNextInt\`, regex, \`isEmpty\`), then parse
- **easier to ask forgiveness**: parse and catch the exception

Java convention favours checks for expected situations and exceptions for unexpected ones, but parsing user input with try-catch is standard and readable. Don't catch \`Exception\` broadly: catching only \`NumberFormatException\` keeps unrelated bugs visible.

## Reading the stack trace

When an exception isn't caught, Java prints a **stack trace**:

~~~
Exception in thread "main" java.lang.NumberFormatException: For input string: "12a"
    at java.base/java.lang.Integer.parseInt(Integer.java:661)
    at Main.main(Main.java:8)
~~~

The first line names the exception and the offending input. Lines below show where it happened; find the first line from your own code, here \`Main.java:8\`. Reading stack traces quickly is one of the most useful debugging skills.

## Defensive input habits

- \`trim()\` input to remove stray spaces
- check for empty strings before parsing
- validate ranges after parsing
- use \`Long.parseLong\` when values might exceed the int range
- give specific, friendly error messages
- in coding rounds, input is usually guaranteed valid, so don't add validation the problem doesn't ask for; in real applications, never trust input

## Input validation and security

In real systems, unvalidated input causes far worse than crashes: SQL injection, buffer overflows in other languages, and crashes triggered deliberately. Validating type, length, format and range at the boundary where data enters a program is a core security practice.

## How interviewers test this

Expect "What happens if the user enters text for nextInt?", "Difference between InputMismatchException and NumberFormatException?" and "Write a loop that keeps asking until input is valid." Name the exceptions and their causes, show a re-prompt loop with try-catch and range checks, and explain why the bad token must be discarded.`,
    sources: [SCANNER, EXCEPTIONS],
  },
};
