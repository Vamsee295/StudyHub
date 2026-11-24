// Long-form theory for Programming Fundamentals module 7: strings. Original writing.
import { LessonTheory } from './utils';

const STRINGS_TUT = { title: "The Java Tutorials: Strings", url: "https://docs.oracle.com/javase/tutorial/java/data/strings.html" };
const STRING_API = { title: "Java SE API: java.lang.String", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html" };
const MANIPULATING = { title: "The Java Tutorials: Manipulating Characters in a String", url: "https://docs.oracle.com/javase/tutorial/java/data/manipstrings.html" };
const COMPARING = { title: "The Java Tutorials: Comparing Strings and Portions of Strings", url: "https://docs.oracle.com/javase/tutorial/java/data/comparestrings.html" };
const BUILDER = { title: "The Java Tutorials: The StringBuilder Class", url: "https://docs.oracle.com/javase/tutorial/java/data/buffers.html" };
const JEP_COMPACT = { title: "JEP 254: Compact Strings", url: "https://openjdk.org/jeps/254" };
const CHARACTER_API = { title: "Java SE API: java.lang.Character", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Character.html" };
const JLS_STRING_LIT = { title: "JLS 3.10.5: String Literals", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-3.html#jls-3.10.5" };

export const pfStringsTheory: Record<string, LessonTheory> = {
  "what-is-a-string": {
    theory: `A string is a sequence of characters: a name, a sentence, a password, a line of a file, a JSON document. Text is everywhere in software, so strings are among the most used types in any language. In Java, \`String\` is a class, not a primitive, and its objects are **immutable**: once created, their contents never change. That single design choice explains how strings behave, why \`==\` misleads, and why building text in loops needs \`StringBuilder\`. This lesson introduces strings, their immutability, the string pool, and how Java stores them.

## Strings in Java

~~~java
String name = "Asha";
String greeting = "Hello, " + name + "!";
System.out.println(greeting);          // Hello, Asha!
System.out.println(greeting.length()); // 12
~~~

\`String\` lives in \`java.lang\`, so it needs no import. Although it's a class, Java gives it special support: literals in double quotes, and \`+\` for concatenation.

## Characters and strings

A \`char\` holds a single character in single quotes, \`'A'\`; a \`String\` holds zero or more characters in double quotes, \`"A"\`. They're different types: \`'A' == "A"\` doesn't compile. The **empty string** \`""\` has length zero and is a valid object, unlike \`null\`, which means no object at all:

~~~java
String empty = "";
String none = null;
empty.length();   // 0
none.length();    // NullPointerException
~~~

## Immutability

String objects can't be changed. Methods that seem to modify a string return a **new** string:

~~~java
String s = "hello";
s.toUpperCase();
System.out.println(s);          // hello: unchanged
s = s.toUpperCase();
System.out.println(s);          // HELLO: s now refers to a new object
~~~

Forgetting to use the returned value is one of the most common string bugs.

Why immutable?

- **safe sharing**: many variables can refer to the same string without one changing it for the others
- **string pool**: identical literals can share one object
- **hash keys**: a string's hash code can be cached and never goes stale, which makes strings fast and reliable HashMap keys
- **security**: a file path or URL checked for safety can't be altered afterwards
- **thread safety**: immutable objects can be shared between threads without locks

## The string pool

String literals are stored in a special area of the heap called the **string pool**. Identical literals refer to the same object:

~~~java
String a = "java";
String b = "java";
String c = new String("java");
System.out.println(a == b);       // true: same pooled object
System.out.println(a == c);       // false: new creates a separate object
System.out.println(a.equals(c));  // true: same characters
~~~

Strings created at runtime (by concatenating variables, reading input, or \`new String\`) aren't pooled automatically. \`intern()\` returns the pooled version, though application code rarely needs it.

The lesson: \`==\` compares object identity, which depends on how the strings were created. **Always compare contents with \`equals\`.**

## Concatenation

\`+\` joins strings, converting other values to text:

~~~java
String info = "Age: " + 21 + ", active: " + true;
~~~

Because strings are immutable, each \`+\` in a loop creates a new string and copies all previous characters:

~~~java
String result = "";
for (int i = 0; i < 10000; i++) {
    result += i;          // creates 10,000 intermediate strings: O(n²) copying
}
~~~

\`StringBuilder\` is a mutable sequence of characters designed for building text:

~~~java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String result = sb.toString();
~~~

For a handful of concatenations in one expression, \`+\` is fine; the compiler optimizes it.

## How strings are stored

Internally, a String holds an array of bytes plus an encoding flag. Since Java 9 (**compact strings**), text containing only Latin-1 characters uses one byte per character, and other text uses two bytes per character in UTF-16. This halves memory for typical English text. Characters outside the Basic Multilingual Plane, such as many emoji, take two \`char\` values (a surrogate pair), so \`length()\` counts UTF-16 units, not visible characters.

## Strings and arrays

A string behaves like a read-only array of characters: you can read the character at an index with \`charAt\`, get its length, and convert it with \`toCharArray()\` when you need to modify characters. The following lessons cover indexing, length, charAt and substring in detail.

## Useful methods at a glance

| Method | Purpose |
|---|---|
| \`length()\` | Number of characters |
| \`charAt(i)\` | Character at index i |
| \`substring(a, b)\` | Part of the string |
| \`indexOf(s)\` | Position of a substring, or -1 |
| \`equals\`, \`equalsIgnoreCase\` | Compare contents |
| \`toUpperCase\`, \`toLowerCase\` | Change case |
| \`trim\`, \`strip\` | Remove surrounding whitespace |
| \`split(regex)\` | Break into parts |
| \`contains\`, \`startsWith\`, \`endsWith\` | Test contents |
| \`replace(a, b)\` | Replace occurrences |
| \`isEmpty\`, \`isBlank\` | Test for empty or whitespace-only |

## How interviewers test this

Expect "Why are strings immutable in Java?", "== vs equals for strings?", "What is the string pool?" and "String vs StringBuilder?" Explain immutability with its benefits, show the pool example with literals and \`new String\`, and explain the O(n²) cost of \`+=\` in loops.`,
    sources: [STRINGS_TUT, JEP_COMPACT],
  },

  "string-creation": {
    theory: `Java gives you several ways to create strings: literals, the \`new\` keyword, conversion from other types, building from characters or arrays, concatenation, formatting, and \`StringBuilder\`. Each has different effects on memory and performance, and interviewers frequently ask how many objects a given line creates. This lesson covers each creation method, the string pool's role, converting values to strings, multi-line text blocks, and choosing the right approach.

## String literals

~~~java
String city = "Pune";
~~~

The JVM looks for an identical string in the **string pool**. If one exists, the variable refers to it; otherwise the literal is added to the pool. Using literals is the normal, preferred way to create fixed text.

## The new keyword

~~~java
String city = new String("Pune");
~~~

This always creates a new String object on the heap, separate from the pooled literal \`"Pune"\`. The literal itself is also in the pool. So this line involves up to two objects: the pooled literal (if not already there) and the new heap object. There's almost never a reason to write \`new String("...")\` in application code; it wastes memory and makes \`==\` comparisons behave differently from literals.

## Compile-time constant folding

The compiler combines concatenations of literals and compile-time constants:

~~~java
String a = "Hel" + "lo";      // folded to "Hello" at compile time: pooled
String b = "Hello";
System.out.println(a == b);   // true

String part = "Hel";
String c = part + "lo";       // computed at runtime: a new object
System.out.println(c == b);   // false
~~~

If \`part\` were declared \`final String part = "Hel";\`, it would be a compile-time constant, and \`c == b\` would be true. These cases appear in output-prediction questions; the practical rule remains: compare strings with \`equals\`.

## From other types

~~~java
String s1 = String.valueOf(42);        // "42"
String s2 = Integer.toString(42);      // "42"
String s3 = "" + 42;                   // "42": works, but less clear
String s4 = String.valueOf(3.5);       // "3.5"
String s5 = String.valueOf(true);      // "true"
String s6 = String.valueOf('x');       // "x"
String s7 = obj.toString();            // object's text form
~~~

\`String.valueOf(obj)\` returns "null" for a null reference, while \`obj.toString()\` throws NullPointerException, so valueOf is safer when values might be null.

## From characters and arrays

~~~java
char[] letters = {'j', 'a', 'v', 'a'};
String s1 = new String(letters);               // "java"
String s2 = String.valueOf(letters);           // "java"
String s3 = new String(letters, 1, 2);         // "av": offset 1, count 2
String s4 = String.valueOf('x').repeat(3);     // "xxx"
~~~

Converting a string to a char array, modifying it, and creating a new string is the standard way to "edit" characters, since strings themselves are immutable:

~~~java
char[] chars = word.toCharArray();
chars[0] = Character.toUpperCase(chars[0]);
String capitalized = new String(chars);
~~~

## Concatenation

~~~java
String full = first + " " + last;
String joined = String.join(", ", List.of("a", "b", "c"));   // "a, b, c"
String concat = first.concat(last);
~~~

\`String.join\` places a separator between items without a trailing one, handy for output formatting.

## Formatting

~~~java
String line = String.format("%-10s %5.2f", name, price);
String msg = "%s scored %d".formatted(name, marks);    // Java 15+
~~~

Formatting creates readable text from several values with precise control over width and decimals.

## StringBuilder

When building text step by step, especially in loops, use StringBuilder:

~~~java
StringBuilder sb = new StringBuilder();
for (String word : words) {
    if (sb.length() > 0) sb.append(' ');
    sb.append(word);
}
String sentence = sb.toString();
~~~

StringBuilder is mutable: \`append\`, \`insert\`, \`delete\`, \`reverse\` and \`setCharAt\` change it in place, and \`toString()\` produces the final immutable String. \`StringBuffer\` is an older, synchronized version; StringBuilder is preferred unless multiple threads share one builder.

## Text blocks

For multi-line text (Java 15+):

~~~java
String html = """
    <ul>
      <li>One</li>
      <li>Two</li>
    </ul>
    """;
~~~

Text blocks keep line breaks, need no escaped quotes, and strip common indentation.

## Repeating and padding

~~~java
String line = "-".repeat(20);                       // 20 dashes
String padded = String.format("%5s", "ab");          // "   ab"
~~~

## Counting objects: a classic question

\`String s = new String("hi");\` creates one heap object, plus the pooled literal "hi" if it isn't already in the pool: one or two objects. \`String a = "hi"; String b = "hi";\` creates at most one object. Interviewers ask these to check understanding of the pool.

## Choosing a creation method

| Need | Use |
|---|---|
| Fixed text | Literal |
| Number or other value as text | \`String.valueOf\` |
| A few pieces joined once | \`+\` |
| A list with separators | \`String.join\` |
| Building in a loop | \`StringBuilder\` |
| Precise formatting | \`String.format\` or \`formatted\` |
| Multi-line text | Text block |
| Edit individual characters | \`toCharArray\`, modify, \`new String(chars)\` |

## How interviewers test this

Expect "Literal vs new String?", "How many objects does this line create?", "Why use StringBuilder?" and output questions on compile-time constant folding. Explain the pool, the extra heap object from \`new\`, folding of literal concatenation, valueOf versus toString for null safety, and StringBuilder for loops.`,
    sources: [STRING_API, BUILDER],
  },

  "string-indexing": {
    theory: `Like arrays, strings are indexed from zero: the first character is at index 0, and the last is at index \`length() - 1\`. Indexing is the basis of almost every string algorithm: reversing, checking palindromes, counting characters, finding patterns and parsing input. Unlike arrays, Java strings don't support square-bracket access; you read characters with \`charAt(i)\`. This lesson covers how string indices work, reading characters, searching for positions with indexOf, traversal, half-open ranges and the errors that out-of-range indices cause.

## Zero-based positions

~~~
String s = "CODE";
index:  0   1   2   3
char:  'C' 'O' 'D' 'E'
~~~

~~~java
System.out.println(s.charAt(0));               // C
System.out.println(s.charAt(s.length() - 1));  // E
~~~

\`s[0]\` doesn't compile in Java; strings aren't arrays. Use \`charAt\`.

## Out-of-range indices

~~~java
"CODE".charAt(4);    // StringIndexOutOfBoundsException: index 4, length 4
"".charAt(0);        // also throws: an empty string has no characters
~~~

Always check that an index is between 0 and \`length() - 1\` before reading, especially when computing indices like \`i + 1\` or \`length() - 1\` on a possibly empty string.

## Finding positions with indexOf

\`indexOf\` searches for a character or substring and returns the index of the first match, or -1 if it isn't found:

~~~java
String email = "asha@studyhub.dev";
int at = email.indexOf('@');            // 4
int dot = email.indexOf('.');           // 13
int missing = email.indexOf('#');       // -1
int second = "banana".indexOf('a', 2);  // 3: start searching from index 2
int last = "banana".lastIndexOf('a');   // 5
~~~

Checking \`indexOf(x) != -1\` tells you whether x occurs; \`contains(x)\` expresses that more readably. Combining indexOf with substring extracts parts of structured text:

~~~java
String user = email.substring(0, at);           // "asha"
String domain = email.substring(at + 1);        // "studyhub.dev"
~~~

Handle the -1 case before using the result as an index; \`substring(0, -1)\` throws.

## Counting occurrences with indexOf

~~~java
int count = 0, from = 0;
while ((from = text.indexOf("ab", from)) != -1) {
    count++;
    from += 1;          // move past this match (use += 2 to skip overlaps)
}
~~~

## Traversing characters

~~~java
String word = "level";
for (int i = 0; i < word.length(); i++) {
    char c = word.charAt(i);
    System.out.println(i + ": " + c);
}
~~~

Or convert to an array for a for-each loop:

~~~java
for (char c : word.toCharArray()) {
    if ("aeiou".indexOf(c) != -1) vowels++;
}
~~~

\`toCharArray()\` creates a copy, costing O(n) memory; \`charAt\` in an indexed loop avoids that.

## Index arithmetic patterns

~~~java
char first = s.charAt(0);
char last = s.charAt(s.length() - 1);
char mirror = s.charAt(s.length() - 1 - i);   // character at the same distance from the end
char middle = s.charAt(s.length() / 2);
~~~

The mirror index is the key to palindrome checks and reversals:

~~~java
boolean isPalindrome = true;
for (int i = 0; i < s.length() / 2; i++) {
    if (s.charAt(i) != s.charAt(s.length() - 1 - i)) {
        isPalindrome = false;
        break;
    }
}
~~~

Looping only to \`length() / 2\` compares each pair once.

## Characters as numbers

\`charAt\` returns a \`char\`, which is a numeric type, so characters support arithmetic:

~~~java
int digit = s.charAt(i) - '0';          // '7' becomes 7
int letterIndex = s.charAt(i) - 'a';    // 'c' becomes 2
char shifted = (char) (s.charAt(i) + 1);
~~~

These conversions power frequency arrays and parsing numbers digit by digit.

## Half-open ranges

String methods taking a range use a **start inclusive, end exclusive** convention: \`substring(1, 4)\` returns indices 1, 2 and 3. The length of the result is \`end - start\`. The convention lets ranges join cleanly: \`s.substring(0, k) + s.substring(k)\` always rebuilds \`s\`.

## Unicode caveat

Indices count UTF-16 code units, not visible characters. An emoji such as 😀 occupies two indices, so \`"😀".length()\` is 2 and \`charAt(0)\` returns half of it. For most interview problems, which use ASCII letters and digits, this doesn't matter; for user-facing text, \`codePoints()\` handles full characters correctly.

## Strings are read-only

You can read any index, but you can't assign to one: there's no \`setCharAt\` on String. To change characters, use a \`char[]\` or a \`StringBuilder\` (\`sb.setCharAt(i, 'x')\`), then convert back to a String.

## How interviewers test this

Expect palindrome checks, counting vowels or digits, finding the first non-repeating character, and extracting parts with indexOf. Explain zero-based indexing and charAt, the -1 result of indexOf, mirror indices, char arithmetic, half-open ranges and StringIndexOutOfBoundsException.`,
    sources: [MANIPULATING, STRING_API],
  },

  "length-method": {
    theory: `The \`length()\` method returns the number of characters in a string. It's the most called string method, because nearly every string algorithm needs it to set loop bounds, find the last character, check for empty input or compare sizes. Its rules are short but precise: it's a method with parentheses (unlike an array's \`length\` field), it counts UTF-16 units, and it throws on null. This lesson covers its behaviour, its uses in loops and validation, related methods such as isEmpty and isBlank, and the traps.

## Basic use

~~~java
String word = "Placement";
System.out.println(word.length());   // 9
System.out.println("".length());     // 0
System.out.println(" ".length());    // 1: a space is a character
System.out.println("a b".length());  // 3
~~~

\`length()\` counts every character, including spaces, punctuation, digits and escape-sequence characters such as \`\\n\` (which counts as one).

## Method versus field versus size

Java uses three different spellings for "how many", a frequent source of compile errors:

| Type | Syntax |
|---|---|
| String | \`s.length()\`: a method |
| Array | \`arr.length\`: a field, no parentheses |
| Collection (List, Set) | \`list.size()\`: a method |

\`s.length\` without parentheses and \`arr.length()\` with them both fail to compile.

## Loop bounds

The valid indices of a string are 0 to \`length() - 1\`:

~~~java
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
}
~~~

Using \`i <= s.length()\` reads one past the end and throws StringIndexOutOfBoundsException. Calling \`length()\` in the loop condition is fine: it returns a stored value in constant time, so there's no need to cache it in a variable for performance.

## The last character

~~~java
char last = s.charAt(s.length() - 1);
~~~

On an empty string, \`length() - 1\` is -1, and charAt throws. Check emptiness first when input may be empty.

## Empty and blank checks

~~~java
s.isEmpty()     // true only for "" (length 0)
s.isBlank()     // true for "", "   ", "\\t\\n": empty or whitespace only (Java 11+)
~~~

For user input, \`isBlank()\` is usually the right check, because a field containing only spaces isn't meaningful. \`s.length() == 0\` is equivalent to \`isEmpty()\`.

## Null versus empty

~~~java
String a = "";
String b = null;
a.length();      // 0
b.length();      // NullPointerException
~~~

An empty string is an object with zero characters; null is no object. Safe checks put the null test first, relying on short-circuit evaluation:

~~~java
if (s == null || s.isBlank()) {
    System.out.println("Please enter a value");
}
~~~

## Trimming before measuring

User input often carries stray spaces:

~~~java
String input = "  asha  ";
input.length();           // 8
input.trim().length();    // 4
input.strip().length();   // 4: strip also handles Unicode whitespace
~~~

Trim or strip before validating length requirements, such as a minimum username length.

## Validation examples

~~~java
boolean validPin = pin.length() == 4 && pin.chars().allMatch(Character::isDigit);
boolean validPassword = password.length() >= 8;
boolean fitsTweet = message.length() <= 280;
~~~

## Comparing lengths

Comparing lengths is a cheap first step in many algorithms: two strings of different lengths can't be equal, anagrams or rotations of each other.

~~~java
static boolean isRotation(String a, String b) {
    return a.length() == b.length() && (a + a).contains(b);
}
~~~

\`Comparator.comparingInt(String::length)\` sorts strings by length.

## Unicode and length

\`length()\` counts UTF-16 code units, not the characters a person sees:

~~~java
"café".length();     // 4
"😀".length();       // 2: one emoji, two code units
"😀".codePointCount(0, "😀".length());   // 1
~~~

Accented letters may also be represented as two code points (a letter plus a combining accent), depending on normalization. For user-visible length limits, \`codePointCount\` is closer to what users expect. For typical interview problems using ASCII, \`length()\` is exactly right.

## StringBuilder length

\`StringBuilder\` has \`length()\` too, and \`setLength(n)\` truncates or pads it, \`setLength(0)\` clears the builder for reuse.

## Performance

\`length()\` runs in O(1): the string stores its size. Interview complexity analysis often uses n to mean the string's length.

## A quick summary

\`length()\` returns the number of UTF-16 characters in O(1), including spaces and punctuation. Loop with \`i < s.length()\`, check for null before calling it, trim user input before validating lengths, and prefer \`isBlank()\` when a value made only of spaces should count as missing.

## How interviewers test this

Expect "length vs length() vs size()?", off-by-one loops with \`<=\`, empty and null input handling, and validation tasks. State that length() is O(1) and counts all characters including spaces, show null-safe checks with short-circuiting, distinguish isEmpty and isBlank, and mention the emoji caveat.`,
    sources: [STRING_API, STRINGS_TUT],
  },

  "charat-method": {
    theory: `\`charAt(index)\` returns the character at a given position in a string. It's the basic tool for examining text one character at a time: checking whether a character is a digit, counting vowels, comparing characters from both ends, or converting digits to numbers. Because it returns a \`char\`, a numeric type, it also enables arithmetic tricks that appear in many problems. This lesson covers how charAt works, character classification, char arithmetic, frequency counting, comparisons, and its exceptions.

## Basic use

~~~java
String s = "Java21";
char first = s.charAt(0);    // 'J'
char digit = s.charAt(4);    // '2'
~~~

Valid indices run from 0 to \`length() - 1\`. Anything else throws \`StringIndexOutOfBoundsException\`. charAt runs in O(1) time.

## Iterating with charAt

~~~java
int digits = 0, letters = 0, spaces = 0;
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    if (Character.isDigit(c)) digits++;
    else if (Character.isLetter(c)) letters++;
    else if (Character.isWhitespace(c)) spaces++;
}
~~~

## The Character class

\`Character\` provides static methods for classifying and converting:

| Method | Purpose |
|---|---|
| \`Character.isDigit(c)\` | 0 to 9 (and other Unicode digits) |
| \`Character.isLetter(c)\` | Any letter |
| \`Character.isLetterOrDigit(c)\` | Alphanumeric |
| \`Character.isUpperCase(c)\`, \`isLowerCase(c)\` | Case tests |
| \`Character.isWhitespace(c)\` | Space, tab, newline |
| \`Character.toUpperCase(c)\`, \`toLowerCase(c)\` | Case conversion |
| \`Character.getNumericValue(c)\` | Digit value |

These methods handle Unicode correctly and read better than range comparisons.

## char is a number

A \`char\` is a 16-bit unsigned integer holding a UTF-16 code unit, so characters can be compared and combined arithmetically:

~~~java
char c = 'C';
int code = c;                     // 67
boolean upper = c >= 'A' && c <= 'Z';
int pos = c - 'A';                // 2: position in the alphabet
char next = (char) (c + 1);       // 'D'
~~~

Key ASCII values to remember: \`'0'\` is 48, \`'A'\` is 65, \`'a'\` is 97. Lowercase and uppercase letters differ by 32.

## Converting digit characters

~~~java
char ch = '7';
int value = ch - '0';             // 7
~~~

Subtracting \`'0'\` maps '0' through '9' to 0 through 9, because digit characters are consecutive in the character table. This is how numbers are parsed digit by digit:

~~~java
int number = 0;
for (int i = 0; i < str.length(); i++) {
    number = number * 10 + (str.charAt(i) - '0');
}
~~~

A common bug: \`int value = ch;\` gives 55, the character code, not 7.

## Frequency counting

~~~java
int[] freq = new int[26];
for (int i = 0; i < word.length(); i++) {
    char c = Character.toLowerCase(word.charAt(i));
    if (c >= 'a' && c <= 'z') freq[c - 'a']++;
}
~~~

\`c - 'a'\` maps 'a' to index 0 and 'z' to index 25. With this array, checking anagrams, finding the first non-repeating character and counting distinct letters all take O(n). For arbitrary characters, use an array of size 128 (ASCII) or 256, or a \`HashMap<Character, Integer>\`.

## Comparing characters

Characters are primitives, so \`==\` compares them correctly:

~~~java
if (s.charAt(i) == 'a') { ... }
if (s.charAt(i) == s.charAt(j)) { ... }
~~~

Be careful mixing char and String: \`s.charAt(0) == "a"\` doesn't compile. For case-insensitive comparison, convert both with \`Character.toLowerCase\`.

## Concatenation trap

Adding chars produces an int, not a string:

~~~java
System.out.println('a' + 'b');        // 195: 97 + 98
System.out.println("" + 'a' + 'b');   // ab
System.out.println('a' + "b");        // ab
~~~

When either operand of \`+\` is a String, concatenation happens; with two chars, arithmetic happens.

## Building a result from characters

~~~java
StringBuilder sb = new StringBuilder();
for (int i = s.length() - 1; i >= 0; i--) {
    sb.append(s.charAt(i));
}
String reversed = sb.toString();
~~~

## Case conversion manually

~~~java
char lower = 'g';
char upper = (char) (lower - 32);            // 'G', ASCII only
char upper2 = Character.toUpperCase(lower);  // preferred: handles all alphabets
~~~

Toggling case with \`c ^ 32\` works for ASCII letters, a bit trick that appears in puzzles.

## charAt versus toCharArray

\`charAt\` reads characters without copying. \`toCharArray()\` creates a new array, useful when you need to modify or sort characters:

~~~java
char[] chars = word.toCharArray();
Arrays.sort(chars);
String sorted = new String(chars);    // "listen" becomes "eilnst"
~~~

Sorting characters gives a canonical form for anagram checks.

## How interviewers test this

Expect counting vowels, consonants, digits and spaces; converting a numeric string to an int without parseInt; anagram checks with a frequency array; and output puzzles like \`'a' + 'b'\`. Explain char arithmetic with \`- '0'\` and \`- 'a'\`, the Character helper methods, and the difference between char addition and string concatenation.`,
    sources: [CHARACTER_API, MANIPULATING],
  },

  "substring-method": {
    theory: `\`substring\` extracts part of a string as a new string. It's how programs pull a username from an email, an extension from a file name, a year from a date, or every window of characters in a sliding-window algorithm. Its range is half-open (start included, end excluded), a convention that confuses beginners but makes calculations cleaner. This lesson covers both forms of substring, the half-open convention, combining it with indexOf, its exceptions, its cost, and related methods.

## Two forms

~~~java
String s = "Programming";
s.substring(3);        // "gramming": from index 3 to the end
s.substring(0, 7);     // "Program": indices 0 to 6
s.substring(3, 7);     // "gram": indices 3, 4, 5, 6
~~~

- \`substring(begin)\`: from \`begin\` to the end
- \`substring(begin, end)\`: from \`begin\` up to, but not including, \`end\`

## The half-open convention

The end index is **exclusive**. That seems odd at first, but it has useful properties:

- the length of the result is \`end - begin\`: \`substring(3, 7)\` has 4 characters
- \`substring(0, k)\` gives the first k characters
- adjacent ranges join without overlap: \`s.substring(0, k) + s.substring(k)\` always equals \`s\`
- \`substring(i, i)\` is the empty string

Most Java APIs that take ranges, such as \`Arrays.copyOfRange\` and \`List.subList\`, follow the same convention.

## Valid ranges

The rules are \`0 <= begin <= end <= length()\`. Violations throw \`StringIndexOutOfBoundsException\`:

~~~java
"hello".substring(2, 10);   // end beyond length
"hello".substring(3, 1);    // begin after end
"hello".substring(-1);      // negative begin
"hello".substring(5);       // "": begin equal to length is allowed
~~~

## Combining with indexOf

Many extraction tasks find a delimiter, then cut around it:

~~~java
String email = "ravi.k@college.edu";
int at = email.indexOf('@');
String user = email.substring(0, at);         // "ravi.k"
String domain = email.substring(at + 1);      // "college.edu"

String file = "report.final.pdf";
String ext = file.substring(file.lastIndexOf('.') + 1);   // "pdf"
~~~

Always handle the case where the delimiter isn't found: indexOf returns -1, and \`substring(0, -1)\` throws. Note the \`+ 1\` to skip the delimiter itself.

## Common patterns

~~~java
String firstChar = s.substring(0, 1);
String lastChar = s.substring(s.length() - 1);
String withoutFirst = s.substring(1);
String withoutLast = s.substring(0, s.length() - 1);
String capitalized = s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
~~~

Each assumes the string isn't empty; guard with a length check when it might be.

## Generating all substrings

~~~java
for (int i = 0; i < s.length(); i++) {
    for (int j = i + 1; j <= s.length(); j++) {
        System.out.println(s.substring(i, j));
    }
}
~~~

A string of length n has n(n + 1) / 2 non-empty substrings. Note \`j <= s.length()\`, because the end index is exclusive. Brute-force solutions that check every substring are O(n²) substrings, each taking up to O(n) to create or check: O(n³) overall. Techniques such as sliding windows exist to avoid that.

## Sliding windows

Fixed-size windows move across a string:

~~~java
int k = 3;
for (int i = 0; i + k <= s.length(); i++) {
    String window = s.substring(i, i + k);
}
~~~

The condition \`i + k <= s.length()\` ensures the last window fits.

## Cost of substring

Since Java 7, \`substring\` copies the selected characters into a new string, costing O(k) time and memory for a result of length k. (Older Java versions shared the original's array, which could leak memory when a small substring kept a huge string alive.) In tight loops, compare characters with \`charAt\` or use index-based methods like \`regionMatches\` and \`startsWith(prefix, offset)\` instead of creating many substrings.

## Strings are immutable

\`substring\` doesn't change the original string; it returns a new one. \`s.substring(1);\` on its own line does nothing useful; assign the result: \`s = s.substring(1);\`.

## Related methods

| Method | Purpose |
|---|---|
| \`startsWith(prefix)\`, \`endsWith(suffix)\` | Test the beginning or end without extracting |
| \`contains(part)\` | Test for a substring anywhere |
| \`indexOf(part)\` | Find where a substring starts |
| \`split(regex)\` | Cut a string into many parts at delimiters |
| \`subSequence(a, b)\` | Same as substring, typed as CharSequence |
| \`StringBuilder.substring\` | Extract from a builder |

For structured formats like CSV lines, \`split\` is often clearer than repeated indexOf and substring.

## How interviewers test this

Expect "what does substring(2, 5) return?", extracting usernames or extensions, generating all substrings, and questions on exceptions. Explain the half-open range and its length rule, combine indexOf with substring while handling -1, count n(n + 1) / 2 substrings, and mention that substring copies characters in modern Java.`,
    sources: [STRING_API, MANIPULATING],
  },

  "string-comparison": {
    theory: `Comparing strings looks trivial but is one of the most common sources of bugs in Java. \`==\` compares whether two variables refer to the same object, not whether they contain the same text. Correct comparison uses \`equals\`, \`equalsIgnoreCase\` and \`compareTo\`, each with its own purpose. This lesson explains reference versus content equality, case-insensitive comparison, lexicographic ordering with compareTo, null-safe comparisons, and comparing prefixes and regions.

## == compares references

~~~java
String a = "hello";
String b = "hello";
String c = new String("hello");
String d = sc.nextLine();          // user types hello

System.out.println(a == b);   // true: same pooled literal
System.out.println(a == c);   // false: c is a separate object
System.out.println(a == d);   // false: input creates a new object
~~~

\`==\` happens to work for literals because of the string pool, which tricks beginners into thinking it compares text. It fails for strings from input, concatenation at runtime, or \`new\`. Code using \`==\` for strings is a bug even when tests pass.

## equals compares contents

~~~java
System.out.println(a.equals(c));   // true
System.out.println(a.equals(d));   // true
~~~

\`equals\` checks that both strings have the same length and the same characters in the same order. It's case-sensitive: \`"Java".equals("java")\` is false.

## Case-insensitive equality

~~~java
"YES".equalsIgnoreCase("yes");     // true
~~~

Use it for user commands, yes or no answers, and file extensions. Alternatively, normalize first: \`input.trim().toLowerCase().equals("yes")\`.

## Null safety

Calling a method on null throws NullPointerException:

~~~java
String input = null;
input.equals("admin");        // NullPointerException
"admin".equals(input);        // false: safe
Objects.equals(input, "admin"); // false: safe, handles both sides null
~~~

Putting the known non-null literal first, sometimes called a Yoda condition, avoids the exception. \`Objects.equals(a, b)\` is the clearest when either side might be null.

## Lexicographic ordering with compareTo

\`compareTo\` orders strings the way a dictionary does, character by character:

~~~java
"apple".compareTo("banana");   // negative: apple comes first
"banana".compareTo("apple");   // positive
"apple".compareTo("apple");    // 0
~~~

It returns a negative number, zero or a positive number. Only the sign is meaningful; don't rely on specific values such as -1.

How it works:

1. Compare characters at index 0, 1, 2 and so on
2. At the first difference, return the difference of those characters' codes: \`'a' - 'b'\` is -1
3. If one string runs out first, the shorter one comes first: \`"app".compareTo("apple")\` is negative, returning the length difference

## Uppercase sorts before lowercase

Character codes put all uppercase letters (65 to 90) before lowercase letters (97 to 122):

~~~java
"Zebra".compareTo("apple");    // negative: 'Z' (90) < 'a' (97)
"Zebra".compareToIgnoreCase("apple");   // positive
~~~

For human-friendly sorting, use \`compareToIgnoreCase\` or \`String.CASE_INSENSITIVE_ORDER\`. For language-aware sorting (accents, local alphabets), use \`java.text.Collator\`.

## Numbers as strings

String comparison isn't numeric:

~~~java
"10".compareTo("9");   // negative: '1' < '9'
~~~

Sorting \`{"10", "9", "100"}\` as strings gives \`{"10", "100", "9"}\`. Parse to numbers when numeric order matters.

## Sorting strings

~~~java
String[] names = {"Ravi", "asha", "Meera"};
Arrays.sort(names);                                  // [Meera, Ravi, asha]
Arrays.sort(names, String.CASE_INSENSITIVE_ORDER);   // [asha, Meera, Ravi]
names = Arrays.stream(names).sorted(Comparator.comparing(String::length)).toArray(String[]::new);
~~~

## Comparing parts

~~~java
url.startsWith("https://");
file.endsWith(".pdf");
text.contains("error");
a.regionMatches(true, 0, b, 0, 3);   // compare the first 3 chars, ignoring case
~~~

These avoid creating substrings only to compare them.

## contentEquals

\`s.contentEquals(sb)\` compares a String with a StringBuilder or other CharSequence. \`s.equals(sb)\` is always false, because equals requires the other object to also be a String.

## Switch on strings

A switch on a String uses \`equals\` internally, so it compares contents correctly. It throws NullPointerException if the string is null.

## Hash codes

Equal strings always have equal hash codes, which is why strings work reliably as HashMap and HashSet keys. Different strings can share a hash code, so maps still call equals to confirm matches.

## A quick summary

Use \`equals\` for exact text, \`equalsIgnoreCase\` when case shouldn't matter, and \`compareTo\` or \`compareToIgnoreCase\` for ordering. Never compare strings with \`==\`, even when it seems to work for literals. Put a known literal first or use \`Objects.equals\` when either side may be null, and parse numeric strings before comparing them as numbers. When sorting text for people to read, choose a case-insensitive or locale-aware comparator so the order matches what readers expect.

## How interviewers test this

Expect "== vs equals?", output questions with literals, \`new String\` and runtime concatenation, "how does compareTo work?", sorting with mixed case, and null-safe comparison. Explain reference versus content equality, the pool's misleading effect, lexicographic comparison including the length rule, uppercase-before-lowercase, and \`Objects.equals\` or literal-first equals for null safety.`,
    sources: [COMPARING, JLS_STRING_LIT],
  },

  "basic-string-problems": {
    theory: `A small set of string problems appears again and again in placement tests and first-round interviews: reversing a string, checking palindromes, counting vowels, detecting anagrams, finding the first non-repeating character, removing duplicates and reversing words. Each one combines indexing, loops and counting patterns you've learned. This lesson works through the classic problems with efficient solutions, the techniques behind them, and the edge cases interviewers check.

## Reverse a string

~~~java
static String reverse(String s) {
    StringBuilder sb = new StringBuilder(s.length());
    for (int i = s.length() - 1; i >= 0; i--) {
        sb.append(s.charAt(i));
    }
    return sb.toString();
}
~~~

\`new StringBuilder(s).reverse().toString()\` does it in one line. Using \`result += s.charAt(i)\` instead is O(n²) because each concatenation copies the string. A two-pointer swap on a \`char[]\` reverses in place with O(1) extra space beyond the array.

## Palindrome check

A palindrome reads the same forwards and backwards: "level", "racecar".

~~~java
static boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}
~~~

O(n) time, O(1) space. Common variation: ignore case and non-alphanumeric characters, so "A man, a plan, a canal: Panama" counts. Skip characters failing \`Character.isLetterOrDigit\` and compare with \`Character.toLowerCase\`.

## Count vowels and consonants

~~~java
int vowels = 0, consonants = 0;
for (char c : s.toLowerCase().toCharArray()) {
    if (c >= 'a' && c <= 'z') {
        if ("aeiou".indexOf(c) != -1) vowels++;
        else consonants++;
    }
}
~~~

Checking the letter range first ensures digits and spaces aren't counted as consonants.

## Anagram check

Two strings are anagrams if they contain the same characters with the same counts: "listen" and "silent".

~~~java
static boolean isAnagram(String a, String b) {
    if (a.length() != b.length()) return false;
    int[] count = new int[26];
    for (int i = 0; i < a.length(); i++) {
        count[a.charAt(i) - 'a']++;
        count[b.charAt(i) - 'a']--;
    }
    for (int c : count) if (c != 0) return false;
    return true;
}
~~~

O(n) time with a fixed-size array. The alternative, sorting both character arrays and comparing, is O(n log n). Clarify with the interviewer whether case and spaces matter, and use a larger array or a HashMap for characters beyond lowercase letters.

## First non-repeating character

~~~java
static char firstUnique(String s) {
    int[] count = new int[128];
    for (char c : s.toCharArray()) count[c]++;
    for (char c : s.toCharArray()) {
        if (count[c] == 1) return c;
    }
    return '\\0';     // none found
}
~~~

Two passes: count everything, then scan in order for the first count of 1. O(n) time. A nested-loop solution checking each character against all others is O(n²).

## Remove duplicate characters

~~~java
static String removeDuplicates(String s) {
    boolean[] seen = new boolean[128];
    StringBuilder sb = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (!seen[c]) {
            seen[c] = true;
            sb.append(c);
        }
    }
    return sb.toString();     // "programming" becomes "progamin"
}
~~~

This keeps the first occurrence of each character, preserving order. A \`LinkedHashSet<Character>\` achieves the same for any characters.

## Reverse the words in a sentence

~~~java
static String reverseWords(String sentence) {
    String[] words = sentence.trim().split("\\\\s+");
    StringBuilder sb = new StringBuilder();
    for (int i = words.length - 1; i >= 0; i--) {
        sb.append(words[i]);
        if (i > 0) sb.append(' ');
    }
    return sb.toString();     // "I love Java" becomes "Java love I"
}
~~~

\`trim()\` and \`"\\\\s+"\` handle extra spaces between and around words.

## Count words

\`s.trim().isEmpty() ? 0 : s.trim().split("\\\\s+").length\`. Without the empty check, an empty string would report one word.

## Character frequency

~~~java
Map<Character, Integer> freq = new TreeMap<>();
for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);
~~~

TreeMap prints characters in sorted order; HashMap is faster when order doesn't matter.

## Techniques behind these problems

| Technique | Problems |
|---|---|
| Two pointers | Reverse, palindrome |
| Frequency array or map | Anagram, first unique, most frequent character |
| Seen set | Remove duplicates, first repeated character |
| StringBuilder | Any problem that builds a result |
| Split on whitespace | Word problems |

## Edge cases to test

- empty string and single character
- all characters the same
- mixed case and spaces, if the problem allows them
- no answer exists, such as no unique character
- long input, where O(n²) approaches time out

Ask the interviewer about case sensitivity and allowed characters before coding; it changes the solution.

## How interviewers test this

Expect two or three of these problems in early rounds, with follow-ups on complexity and edge cases. Choose the right technique (two pointers, frequency array, seen set), use StringBuilder instead of repeated concatenation, state O(n) time and the space used, and test empty and single-character inputs aloud.`,
    sources: [STRING_API, BUILDER],
  },
};
