// Module 8 - Strings (8 lessons)
import { CourseLessonContent } from './types';

export const stringsLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-a-string",
    title: "What is a String?",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand primitive types (`char`), objects vs references, heap memory, and array fundamentals."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "A Java `String` is an Immutable Stone Tablet. Once a String is constructed on the Heap, its character sequence is permanently carved in stone—no thread or method can mutate its contents in-place. When you call a method like `str.toUpperCase()`, Java does NOT alter the original tablet; it chisels a brand-new stone tablet with uppercase letters and returns a new reference pointer."
        },
        {
          type: "callout",
          title: "The 4 Critical Reasons for String Immutability",
          content: "1. **Security**: Sensitive parameters like database URLs, usernames, passwords, and file paths cannot be hijacked or corrupted by malicious code.\n2. **Thread Safety**: Multiple concurrent threads can safely read the same String instance simultaneously without synchronization locks.\n3. **Hash Code Caching**: Because the content never changes, `str.hashCode()` is calculated once and cached forever, making Strings ultra-fast keys in `HashMap` and `HashSet`.\n4. **String Constant Pool Optimization**: Enables memory sharing where millions of identical string literals point to a single shared heap object."
        },
        {
          type: "code",
          title: "Demonstrating String Immutability in Java",
          code: "// --- 1. IMMUTABILITY DEMONSTRATION ---\nString greeting = \"hello\";\n\n// Calling a transformation method does NOT modify 'greeting' in-place!\ngreeting.toUpperCase(); \nSystem.out.println(\"Original greeting: \" + greeting); // Still \"hello\"!\n\n// To capture the result, you MUST assign the returned new String reference:\nString loudGreeting = greeting.toUpperCase();\nSystem.out.println(\"New loud greeting:  \" + loudGreeting); // \"HELLO\"\n\n// --- 2. STRING CONCATENATION (+ operator) ---\nString firstName = \"Ada\";\nString lastName = \"Lovelace\";\nString fullName = firstName + \" \" + lastName; // Creates a new combined String on Heap\nSystem.out.println(\"Full Name: \" + fullName); // \"Ada Lovelace\"",
          language: "java",
          explanation: "Every String manipulation method in the Java Standard Library returns a freshly allocated String object, preserving the immutable integrity of the original instance."
        },
        {
          type: "text",
          title: "Internal Representation: Compact Strings (Java 9+)",
          content: "Under the hood in modern Java (Java 9+), a String is backed by a compact byte array:\n\n```java\npublic final class String {\n    private final byte[] value; // Raw byte storage\n    private final byte coder;   // LATIN1 (1 byte/char) or UTF16 (2 bytes/char)\n    private int hash;           // Cached hash code (defaults to 0)\n}\n```\nIf a String contains only ASCII/Latin-1 characters, Java stores each character using just 1 byte instead of 2 bytes, cutting heap memory consumption by up to 50%!"
        },
        {
          type: "tryIt",
          title: "Try It: Predict Immutability Output",
          code: "String word = \"planet\";\nword.concat(\" earth\");\nword.replace('p', 'P');\nSystem.out.println(\"Result: \" + word);",
          expectedOutput: "Result: planet",
          explanation: "Because the return values of concat() and replace() were not reassigned, 'word' remains 'planet'."
        },
        {
          type: "dryRun",
          title: "String Immutability Heap State Trace",
          iterations: [
            { step: 1, variables: { "greeting": "0x100 (\"hello\")" }, description: "Initial literal created in String Pool." },
            { step: 2, variables: { "greeting.toUpperCase()": "0x200 (\"HELLO\")" }, description: "New String object 0x200 created on Heap. Return value discarded." },
            { step: 3, variables: { "greeting": "0x100 (\"hello\")" }, description: "greeting pointer remains locked onto 0x100." }
          ]
        },
        {
          type: "warning",
          title: "Common String Mistakes",
          items: [
            "**Ignoring Return Values**: Calling `str.trim()`, `str.replace()`, or `str.toLowerCase()` without reassigning the variable.",
            "**String Concatenation in Heavy Loops**: Using `str += i` inside a 10,000-iteration loop creates 10,000 temporary garbage objects (use `StringBuilder` instead).",
            "**Confusing String with Primitive Types**: `String` is a reference class (`java.lang.String`), not a primitive."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why is String Final in Java?",
          traps: [
            {
              question: "Why is the `String` class declared as `public final class String` in Java?",
              trap: "Thinking it's just to prevent developers from adding helper methods.",
              solution: "If `String` were not `final`, a subclass could override methods like `equals()` or `hashCode()` to make Strings mutable or bypass security checks (e.g. altering a file path after permission verification). Declaring it `final` guarantees that no subclass can ever violate its immutability and security guarantees."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What happens when you invoke `str.concat(\" world\")` on a variable `String str = \"hello\";`?",
          options: [
            "`str` is modified in-place to \"hello world\"",
            "A compile error occurs",
            "A new String \"hello world\" is created and returned; `str` remains \"hello\"",
            "`str` becomes null"
          ],
          answer: 2,
          explanation: "Because Strings are immutable, concat() returns a brand-new String object containing the combined text, leaving the original variable unchanged."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Strings in Java are completely immutable reference objects.",
            "Immutability guarantees security, thread safety, hash code caching, and literal pooling.",
            "All transformation methods return new String instances.",
            "Backed by a compact `byte[]` array in modern Java."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore String Creation, comparing String Constant Pool literals against the `new String()` constructor and heap allocation."
        }
      ]
    }
  },
  {
    slug: "string-creation",
    title: "String Creation",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-a-string`, heap memory, and reference equality."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of String creation as The Public Library (String Constant Pool) vs Buying an Unshared Copy (`new String()`):\n• **String Literal (`\"Java\"`)**: You visit the public library. If 'Java' is already on the shelf, the JVM gives you a shared library card pointing to that exact instance.\n• **Constructor (`new String(\"Java\")`)**: You demand a brand-new, private copy printed on private paper in general Heap RAM, completely bypassing the shared library."
        },
        {
          type: "callout",
          title: "String Constant Pool (SCP) Mechanics",
          content: "The **String Constant Pool** is a specialized hash-table cache inside Heap memory:\n• When a string literal is encountered, the JVM checks the pool.\n• If found &rarr; returns the existing pooled reference ($O(1)$ memory savings).\n• If not found &rarr; creates a new object in the pool and caches it.\n\n⚠️ **Best Practice**: ALWAYS use string literals (`String s = \"text\";`). Avoid `new String(\"text\")` unless you explicitly require unshared object identity."
        },
        {
          type: "code",
          title: "String Literals vs new String() & The intern() Method",
          code: "// 1. STRING LITERALS (Interned into String Pool)\nString s1 = \"Code\";\nString s2 = \"Code\";\nSystem.out.println(s1 == s2); // TRUE! Both point to the same object in String Pool\n\n// 2. NEW STRING() CONSTRUCTOR (Forces distinct Heap object allocation)\nString s3 = new String(\"Code\");\nString s4 = new String(\"Code\");\nSystem.out.println(s1 == s3); // FALSE! s1 is in Pool, s3 is in general Heap\nSystem.out.println(s3 == s4); // FALSE! s3 and s4 are distinct Heap objects\nSystem.out.println(s1.equals(s3)); // TRUE! Both have identical content \"Code\"\n\n// 3. THE intern() METHOD\n// Retrieves the canonical representation from the String Pool\nString s5 = s3.intern();\nSystem.out.println(s1 == s5); // TRUE! s5 references the pooled object",
          language: "java",
          explanation: "The '==' operator checks if two references point to the exact same memory address. The '.equals()' method checks if the character contents match."
        },
        {
          type: "text",
          title: "Constructing Strings from Character & Byte Arrays",
          content: "Java provides specialized constructors to convert arrays into Strings (essential for cryptography, network I/O, and file streams):\n\n```java\nchar[] charArray = { 'J', 'a', 'v', 'a' };\nString fromChars = new String(charArray); // \"Java\"\n\nbyte[] utf8Bytes = { 72, 101, 108, 108, 111 }; // ASCII for 'H', 'e', 'l', 'l', 'o'\nString fromBytes = new String(utf8Bytes, java.nio.charset.StandardCharsets.UTF_8); // \"Hello\"\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Reference Equality vs Content Equality",
          code: "String a = \"StudyHub\";\nString b = new String(\"StudyHub\");\nSystem.out.println(\"a == b: \" + (a == b));\nSystem.out.println(\"a.equals(b): \" + a.equals(b));",
          expectedOutput: "a == b: false\na.equals(b): true",
          explanation: "'a' is in the String Pool while 'b' is a separate Heap object. Hence '==' is false, but '.equals()' is true."
        },
        {
          type: "dryRun",
          title: "Memory Pointer Trace: Literals vs new String()",
          iterations: [
            { step: 1, variables: { "String Pool": "\"Code\" @ 0xP1", "s1": "0xP1", "s2": "0xP1" }, description: "s1 and s2 share identical pool reference 0xP1." },
            { step: 2, variables: { "General Heap": "0xH1 (holds value \"Code\")", "s3": "0xH1" }, description: "new String() forces allocation of 0xH1 on heap." },
            { step: 3, variables: { "s3.intern()": "0xP1" }, description: "intern() returns reference to the shared pool object 0xP1." }
          ]
        },
        {
          type: "warning",
          title: "Common Creation Mistakes",
          items: [
            "**Using `new String(\"literal\")`**: Creates redundant heap objects, wasting memory and defeating the String Pool.",
            "**Using `==` to Check Equality**: `==` checks reference addresses, causing intermittent false negatives on Strings created dynamically.",
            "**Creating Strings in Tight Loops**: Concatenating strings with `+` in loops spawns millions of transient objects."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: How Many Objects Are Created?",
          traps: [
            {
              question: "How many objects are created by the statement: `String s = new String(\"Hello\");`?",
              trap: "Answering 1 object.",
              solution: "It creates **2 objects** (assuming \"Hello\" is not already in the String Pool):\n1. One object is created in the **String Constant Pool** for the literal `\"Hello\"`.\n2. One object is created in **General Heap Memory** by the `new String(...)` constructor.\nThe reference `s` points to the Heap object."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is printed by:\nString s1 = \"apple\";\nString s2 = \"apple\";\nSystem.out.println(s1 == s2);",
          options: [
            "false",
            "true",
            "Compile error",
            "NullPointerException"
          ],
          answer: 1,
          explanation: "Both literals point to the exact same pooled object in the String Constant Pool, so `s1 == s2` evaluates to true."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Always prefer string literals `String s = \"text\";` to leverage the String Constant Pool.",
            "`new String()` forces unpooled heap allocations.",
            "Use `.equals()` for content comparison; `==` compares memory addresses.",
            "`intern()` retrieves the canonical pooled reference."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore String Indexing, mastering 0-based character offsets and the `.charAt()` method."
        }
      ]
    }
  },
  {
    slug: "string-indexing",
    title: "String Indexing",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `string-creation`, zero-based indexing, and primitive `char` types."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "String indexing is a Row of Numbered Character Slots. A String is an ordered sequence of character boxes numbered strictly from $0$ to $\\text{length}() - 1$. Box 0 holds the initial letter, and Box $\\text{length}() - 1$ holds the final letter."
        },
        {
          type: "callout",
          title: "No Square Bracket Access in Java Strings",
          content: "⚠️ **CRITICAL SYNTAX RULE**: Unlike arrays, C++, Python, or JavaScript, Java does **NOT** permit square brackets for String indexing:\n• ❌ `char ch = str[0];` &rarr; **COMPILE ERROR!**\n• ✅ `char ch = str.charAt(0);` &rarr; **Correct Java Method Call**"
        },
        {
          type: "code",
          title: "Accessing Characters via charAt() & Boundary Validation",
          code: "String language = \"JAVA\";\n\n// 1. Zero-based indexing\nchar firstChar  = language.charAt(0); // 'J'\nchar secondChar = language.charAt(1); // 'A'\nchar thirdChar  = language.charAt(2); // 'V'\nchar lastChar   = language.charAt(language.length() - 1); // 'A'\n\nSystem.out.println(\"First: \" + firstChar + \", Last: \" + lastChar);\n\n// 2. Iterating through all character slots\nSystem.out.print(\"Slots: \");\nfor (int i = 0; i < language.length(); i++) {\n    System.out.print(\"[\" + i + \"]='\" + language.charAt(i) + \"' \");\n}\nSystem.out.println();",
          language: "java",
          explanation: "The charAt(i) method performs direct index access into the underlying byte/char storage array in O(1) constant time."
        },
        {
          type: "text",
          title: "StringIndexOutOfBoundsException Mechanics",
          content: "The JVM verifies bounds on every `charAt(index)` call:\n• Valid indices: $0 \\le \\text{index} < \\text{str.length}()$\n• Accessing index $< 0$ or index $\\ge \\text{str.length}()$ throws `StringIndexOutOfBoundsException`:\n\n```java\nString s = \"Hi\"; // length is 2 (indices 0 and 1)\nchar c = s.charAt(2); // THROWS StringIndexOutOfBoundsException!\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Extract First and Last Initials",
          code: "String word = \"Algorithm\";\nchar first = word.charAt(0);\nchar last = word.charAt(word.length() - 1);\nSystem.out.println(first + \"-\" + last);",
          expectedOutput: "A-m",
          explanation: "word.charAt(0) is 'A', and word.charAt(8) is 'm'."
        },
        {
          type: "dryRun",
          title: "Character Slot Index Map: \"CODE\"",
          iterations: [
            { step: 1, variables: { "Index 0": "'C'", "Unicode": "0x0043" }, description: "Initial character." },
            { step: 2, variables: { "Index 1": "'O'", "Unicode": "0x004F" }, description: "Second character." },
            { step: 3, variables: { "Index 2": "'D'", "Unicode": "0x0044" }, description: "Third character." },
            { step: 4, variables: { "Index 3 (length-1)": "'E'", "Unicode": "0x0045" }, description: "Final character." }
          ]
        },
        {
          type: "warning",
          title: "Common Indexing Pitfalls",
          items: [
            "**Attempting `str[i]`**: Square bracket indexing is only valid for arrays, not String objects.",
            "**Using `charAt(str.length())`**: The maximum valid index is `str.length() - 1`.",
            "**Attempting to Mutate via charAt**: Writing `str.charAt(0) = 'B';` is a compile error because Strings are immutable."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: UTF-16 Surrogate Pairs & Code Points",
          traps: [
            {
              question: "What does `\"😀\".length()` and `\"😀\".charAt(0)` return in Java?",
              trap: "Assuming length is 1 because it is a single emoji.",
              solution: "Because emojis and rare scripts reside outside the Basic Multilingual Plane (BMP), Java encodes them as **2 UTF-16 surrogate chars**. Therefore, `\"😀\".length()` returns **2**, and `charAt(0)` returns the high-surrogate char `'\\uD83D'`. To handle supplementary characters correctly, use `str.codePointAt(0)`."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is returned by `\"Pathway\".charAt(4)`?",
          options: [
            "'h'",
            "'w'",
            "'a'",
            "'y'"
          ],
          answer: 1,
          explanation: "Indices: P(0), a(1), t(2), h(3), w(4), a(5), y(6). Index 4 is 'w'."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Strings use 0-based character indexing running from 0 to `length() - 1`.",
            "Must use `str.charAt(i)` method (not `str[i]`).",
            "Out-of-bounds indices throw `StringIndexOutOfBoundsException`.",
            "Accessing characters is an O(1) constant time operation."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore the length() Method, contrasting String method calls with array fields and mastering empty vs blank checks."
        }
      ]
    }
  },
  {
    slug: "length-method",
    title: "length()",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `string-indexing`, method invocation syntax, and `null` reference handling."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "The `length()` method is a Digital Character Caliper. It measures the string and returns the exact count of 16-bit `char` code units in the sequence. Spaces, punctuation marks, digits, and escape sequences all count as real characters."
        },
        {
          type: "callout",
          title: "The 3 Size Access Paradigms in Java",
          content: "• **Arrays**: `arr.length` &rarr; Public immutable **field property** (NO parentheses).\n• **Strings**: `str.length()` &rarr; Public **method call** (REQUIRES parentheses `()`).\n• **Collections (`ArrayList`, `HashMap`)**: `list.size()` &rarr; Public **method call**."
        },
        {
          type: "code",
          title: "String Length, Empty vs Blank Checks & Defensive Null-Guards",
          code: "// 1. MEASURING LENGTH (Spaces & special chars count!)\nString phrase = \"Hello World!\";\nSystem.out.println(\"Length: \" + phrase.length()); // 12 (10 letters + 1 space + 1 exclamation)\n\n// 2. EMPTY vs BLANK vs NULL (Java 11+)\nString emptyStr = \"\";       // 0 characters\nString blankStr = \"   \";    // 3 whitespace characters\nString nullStr  = null;     // No object allocated!\n\nSystem.out.println(\"emptyStr.length():  \" + emptyStr.length());  // 0\nSystem.out.println(\"emptyStr.isEmpty(): \" + emptyStr.isEmpty()); // true (length == 0)\nSystem.out.println(\"blankStr.isEmpty(): \" + blankStr.isEmpty()); // false (length == 3)\nSystem.out.println(\"blankStr.isBlank(): \" + blankStr.isBlank()); // true (all whitespace)\n\n// 3. DEFENSIVE NULL-SAFE LENGTH CHECK\npublic static boolean isValidUsername(String username) {\n    // Always check for null FIRST before calling .length() to avoid NullPointerException!\n    if (username == null || username.trim().isEmpty()) {\n        return false;\n    }\n    return username.length() >= 4 && username.length() <= 20;\n}",
          language: "java",
          explanation: "Never invoke .length() on a reference without verifying that it is non-null, or a NullPointerException will be thrown."
        },
        {
          type: "text",
          title: "Escape Sequences and Character Count",
          content: "Escape sequences represent a single character in byte storage:\n• `\"\\n\".length()` is **1** (newline character)\n• `\"\\t\".length()` is **1** (tab character)\n• `\"\\\\\\\"\".length()` is **2** (one backslash + one double quote)"
        },
        {
          type: "tryIt",
          title: "Try It: Length of Escape Strings",
          code: "String text = \"A\\nB\\tC\";\nSystem.out.println(\"Length: \" + text.length());",
          expectedOutput: "Length: 5",
          explanation: "'A' (1) + '\\n' (1) + 'B' (1) + '\\t' (1) + 'C' (1) = 5 characters."
        },
        {
          type: "dryRun",
          title: "Length & Character Slot Trace",
          iterations: [
            { step: 1, variables: { "Input": "\"Java 21\"" }, description: "String with letters, space, and digits." },
            { step: 2, variables: { "Slot breakdown": "'J'(0), 'a'(1), 'v'(2), 'a'(3), ' '(4), '2'(5), '1'(6)" }, description: "7 total slots." },
            { step: 3, variables: { "length()": "7", "lastIndex": "6" }, description: "length() returns 7; last index is 6." }
          ]
        },
        {
          type: "warning",
          title: "Common length() Mistakes",
          items: [
            "**Omitting Parentheses**: Writing `str.length` (compile error; arrays use `.length`, strings use `.length()`).",
            "**NullPointerException**: Calling `str.length()` when `str == null`.",
            "**Confusing `isEmpty()` with `isBlank()`**: `\" \".isEmpty()` is `false` (length is 1), but `\" \".isBlank()` is `true`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Time Complexity of String.length()",
          traps: [
            {
              question: "What is the time complexity of `str.length()` in Java? Does it count characters on every call?",
              trap: "Assuming it loops through the string like C's strlen() in O(N).",
              solution: "In Java, `str.length()` is strictly **$O(1)$ constant time**. The length is stored as a pre-computed internal field in the String object header and returned immediately without any character counting."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the length of the string `\"Hi\\n\"`?",
          options: [
            "2",
            "3",
            "4",
            "5"
          ],
          answer: 1,
          explanation: "'H' (1) + 'i' (1) + '\\n' (1) = 3 characters total."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "`str.length()` returns total 16-bit char code units in O(1) time.",
            "Requires parentheses `()`, unlike array `arr.length`.",
            "Empty string `\"\"` has length 0; whitespace characters count toward length.",
            "Always perform null checks before calling `.length()`."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore charAt(), substring(), and String Comparisons in Batch 8B."
        }
      ]
    }
  },
  {
    slug: "charat-method",
    title: "charAt()",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `string-indexing`, 0-based coordinate systems, primitive `char` data types, and boundary conditions."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of `charAt(index)` as a **Precision Microscopic Probe**. You provide a single non-negative integer coordinate, and the probe directly inspects the internal contiguous byte/char array at that exact offset and retrieves the primitive `char` residing in that cell in $O(1)$ constant time."
        },
        {
          type: "callout",
          title: "Method Signature & Return Type",
          content: "• **Signature**: `public char charAt(int index)`\n• **Return Value**: Returns a primitive `char` (16-bit Unicode unit), NOT a `String` object.\n• **Immutability Constraint**: `charAt()` is strictly **read-only**. You cannot assign to it (e.g., `str.charAt(0) = 'X'` is a compilation error)."
        },
        {
          type: "code",
          title: "Reading Characters, Boundary Checks & Iteration",
          code: "public class CharAtDemo {\n    public static void main(String[] args) {\n        String title = \"Developer\";\n\n        // 1. Reading endpoints and specific characters\n        char firstLetter = title.charAt(0);                         // 'D'\n        char fifthLetter = title.charAt(4);                         // 'l'\n        char lastLetter  = title.charAt(title.length() - 1);        // 'r'\n\n        System.out.println(\"First: \" + firstLetter + \", Last: \" + lastLetter);\n\n        // 2. Linear traversal using charAt()\n        int vowelCount = 0;\n        for (int i = 0; i < title.length(); i++) {\n            char current = Character.toLowerCase(title.charAt(i));\n            if (current == 'a' || current == 'e' || current == 'i' || current == 'o' || current == 'u') {\n                vowelCount++;\n            }\n        }\n        System.out.println(\"Total vowels in \\\"\" + title + \"\\\": \" + vowelCount); // 4 ('e', 'e', 'o', 'e')\n    }\n}",
          language: "java",
          explanation: "Iterate from i = 0 up to i < title.length(). At each iteration, title.charAt(i) safely extracts the character at index i."
        },
        {
          type: "table",
          title: "charAt() Index vs Character Value Map: \"JAVA\"",
          headers: ["Index (`i`)", "Call `str.charAt(i)`", "Returned `char`", "ASCII / Hex Code", "Valid?"],
          rows: [
            ["-1", "str.charAt(-1)", "None", "N/A", "❌ Throws StringIndexOutOfBoundsException"],
            ["0", "str.charAt(0)", "'J'", "74 / 0x004A", "✅ Valid (First character)"],
            ["1", "str.charAt(1)", "'A'", "65 / 0x0041", "✅ Valid"],
            ["2", "str.charAt(2)", "'V'", "86 / 0x0056", "✅ Valid"],
            ["3", "str.charAt(3)", "'A'", "65 / 0x0041", "✅ Valid (Last character)"],
            ["4", "str.charAt(4)", "None", "N/A", "❌ Throws StringIndexOutOfBoundsException (4 == length)"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Extract First Letters for an Acronym",
          code: "String phrase = \"Structured Query Language\";\nString[] words = phrase.split(\" \");\nString acronym = \"\";\nfor (String w : words) {\n    acronym += w.charAt(0);\n}\nSystem.out.println(\"Acronym: \" + acronym);",
          expectedOutput: "Acronym: SQL",
          explanation: "Extracts character at index 0 of each word and concatenates them into the acronym 'SQL'."
        },
        {
          type: "dryRun",
          title: "Vowel Counting Loop State Trace: \"Code\"",
          iterations: [
            { step: 1, variables: { "i": "0", "charAt(0)": "'C'", "isVowel": "false", "vowelCount": "0" }, description: "Initial consonant 'C' evaluated." },
            { step: 2, variables: { "i": "1", "charAt(1)": "'o'", "isVowel": "true", "vowelCount": "1" }, description: "Vowel 'o' matches; count incremented to 1." },
            { step: 3, variables: { "i": "2", "charAt(2)": "'d'", "isVowel": "false", "vowelCount": "1" }, description: "Consonant 'd' evaluated." },
            { step: 4, variables: { "i": "3", "charAt(3)": "'e'", "isVowel": "true", "vowelCount": "2" }, description: "Vowel 'e' matches; count incremented to 2." }
          ]
        },
        {
          type: "warning",
          title: "Common charAt() Traps",
          items: [
            "**The `<= length()` Off-by-One**: Writing `for (int i = 0; i <= str.length(); i++)` crashes on the final iteration because valid indices end at `str.length() - 1`.",
            "**Attempting to Assign**: `str.charAt(0) = 'Z';` is illegal because String objects are immutable in Java.",
            "**Ignoring Null Checks**: Calling `.charAt()` on a `null` reference throws `NullPointerException` before any index checking happens.",
            "**Confusing char with String**: `str.charAt(0)` produces primitive `char` `'A'`, which cannot be compared using `.equals()` (use `==` for primitives, or `String.valueOf(ch)`)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Fast Character Frequency Array using charAt()",
          traps: [
            {
              question: "How do you count character frequencies of lowercase English letters in $O(N)$ time without using a HashMap?",
              trap: "Using a heavy HashMap<Character, Integer> with object boxing overhead.",
              solution: "Use a fixed-size integer array `int[] count = new int[26];` and index directly with `count[str.charAt(i) - 'a']++`. Because `char` arithmetic computes the zero-based offset in $O(1)$ memory without allocations."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What exception is thrown by `\"Java\".charAt(4)`?",
          options: [
            "NullPointerException",
            "ArrayIndexOutOfBoundsException",
            "StringIndexOutOfBoundsException",
            "NoSuchElementException"
          ],
          answer: 2,
          explanation: "Because \"Java\" has length 4, valid indices are 0, 1, 2, and 3. Requesting index 4 throws StringIndexOutOfBoundsException."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "`str.charAt(index)` retrieves the primitive `char` at the given 0-based index in $O(1)$ time.",
            "Valid indices strictly range from $0$ to $\\text{str.length}() - 1$.",
            "Strings are immutable; `charAt()` cannot be used as an assignment target.",
            "Combine `str.charAt(i)` with `Character` utility methods like `Character.isDigit()` and `Character.toUpperCase()` for robust character processing."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we examine the substring() Method, learning how to slice contiguous sub-sequences using half-open index intervals."
        }
      ]
    }
  },
  {
    slug: "substring-method",
    title: "substring()",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `string-indexing`, `length-method`, and half-open mathematical intervals $[\\text{start}, \\text{end})$."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of `substring(beginIndex, endIndex)` as a **Cookie Cutter Window**. The cutter drops over the string starting at the left boundary `beginIndex` (inclusive) and lifts up just before `endIndex` (exclusive). The characters inside the window are sliced out and encapsulated into a brand-new String object."
        },
        {
          type: "callout",
          title: "The Golden Formula: Result Length = endIndex - beginIndex",
          content: "Whenever you call `str.substring(beginIndex, endIndex)`:\n• The resulting substring length is always exactly **`endIndex - beginIndex`**.\n• Example: `\"Developer\".substring(0, 4)` &rarr; Length is $4 - 0 = 4$ (`\"Deve\"`).\n• Example: `\"Developer\".substring(3, 3)` &rarr; Length is $3 - 3 = 0$ (`\"\"` empty string)."
        },
        {
          type: "code",
          title: "Two Overloads of substring() in Action",
          code: "public class SubstringDemo {\n    public static void main(String[] args) {\n        String filename = \"report_2026_final.pdf\";\n\n        // OVERLOAD 1: substring(beginIndex) -> Slices to the end of string\n        int dotIndex = filename.lastIndexOf('.');\n        String extension = filename.substring(dotIndex); // \".pdf\"\n        System.out.println(\"Extension: \" + extension);\n\n        // OVERLOAD 2: substring(beginIndex, endIndex) -> Slices [beginIndex, endIndex)\n        String prefix = filename.substring(0, 6);       // \"report\"\n        String year   = filename.substring(7, 11);      // \"2026\"\n        System.out.println(\"Prefix: \" + prefix + \", Year: \" + year);\n\n        // EXTRACTING THE LAST N CHARACTERS SAFELY\n        int n = 4;\n        String lastN = filename.substring(filename.length() - n); // \".pdf\"\n        System.out.println(\"Last \" + n + \" chars: \" + lastN);\n    }\n}",
          language: "java",
          explanation: "substring(beginIndex) extracts from beginIndex all the way to string end. substring(beginIndex, endIndex) excludes the character at endIndex."
        },
        {
          type: "table",
          title: "substring() Index Range Rules: `str = \"PREPARATION\"` (length = 11)",
          headers: ["Call", "Indices Extracted", "Resulting Value", "Length Formula", "Status"],
          rows: [
            ["str.substring(0, 3)", "0, 1, 2", "\"PRE\"", "3 - 0 = 3", "✅ Valid"],
            ["str.substring(3, 7)", "3, 4, 5, 6", "\"PARA\"", "7 - 3 = 4", "✅ Valid"],
            ["str.substring(7)", "7, 8, 9, 10", "\"TION\"", "11 - 7 = 4", "✅ Valid (To end)"],
            ["str.substring(5, 5)", "None", "\"\"", "5 - 5 = 0", "✅ Valid (Empty string)"],
            ["str.substring(4, 2)", "Invalid", "N/A", "4 > 2", "❌ Throws StringIndexOutOfBoundsException"],
            ["str.substring(0, 12)", "Invalid", "N/A", "12 > length()", "❌ Throws StringIndexOutOfBoundsException"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Extract Email Domain Name",
          code: "String email = \"student@studyhub.edu\";\nint atIndex = email.indexOf('@');\nString domain = email.substring(atIndex + 1);\nSystem.out.println(\"Domain: \" + domain);",
          expectedOutput: "Domain: studyhub.edu",
          explanation: "indexOf('@') finds the @ symbol at index 7. substring(8) extracts everything after it."
        },
        {
          type: "dryRun",
          title: "Slicing Window Trace: `\"STUDY\".substring(1, 4)`",
          iterations: [
            { step: 1, variables: { "str": "\"STUDY\"", "beginIndex": "1", "endIndex": "4" }, description: "Full string has length 5: S(0), T(1), U(2), D(3), Y(4)." },
            { step: 2, variables: { "Index 1 (Included)": "'T'" }, description: "Start slice at beginIndex 1." },
            { step: 3, variables: { "Index 2 (Included)": "'U'" }, description: "Continue through index 2." },
            { step: 4, variables: { "Index 3 (Included)": "'D'" }, description: "Continue through index 3." },
            { step: 5, variables: { "Index 4 (Excluded)": "'Y' (Stop!)" }, description: "Hit endIndex 4; stop immediately. Return new String \"TUD\"." }
          ]
        },
        {
          type: "warning",
          title: "Common Substring Mistakes",
          items: [
            "**Assuming endIndex is Inclusive**: Writing `str.substring(0, 4)` extracts 4 characters (indices 0, 1, 2, 3), NOT 5.",
            "**Inverted Indices (`beginIndex > endIndex`)**: Calling `str.substring(5, 2)` crashes with `StringIndexOutOfBoundsException`.",
            "**Exceeding String Length**: `endIndex` can be at most `str.length()`. Any value $> \\text{length}()$ throws an exception.",
            "**Expecting Original String Mutation**: `str.substring(2)` returns a new string; it does NOT mutate `str`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Java 6 vs Java 7+ Substring Memory Leak",
          traps: [
            {
              question: "How did Java 6's `substring()` implementation differ from modern Java (Java 7u6+), and what interview bug did it cause?",
              trap: "Assuming `substring()` has always copied character arrays identically.",
              solution: "In Java 6, `substring()` did not create a new character array; it shared the parent string's massive internal `char[]` and merely stored a new `offset` and `count`. If you extracted a 3-character substring from a 100MB file string and cached the substring, the entire 100MB array stayed in memory, creating a catastrophic memory leak. In Java 7u6+, `substring()` always allocates a fresh, compact `char[]`/`byte[]` array containing only the sliced characters."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is returned by `\"HelloWorld\".substring(2, 6)`?",
          options: [
            "\"lloW\"",
            "\"elloW\"",
            "\"lloWo\"",
            "\"ello\""
          ],
          answer: 0,
          explanation: "Indices extracted are 2 ('l'), 3 ('l'), 4 ('o'), 5 ('W'). Index 6 is excluded. Length is 6 - 2 = 4. Result is \"lloW\"."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "`substring(start)` extracts from `start` to string end.",
            "`substring(start, end)` extracts characters in the half-open interval $[\\text{start}, \\text{end})$.",
            "Resulting length is strictly $\\text{endIndex} - \\text{beginIndex}$.",
            "Valid boundaries are $0 \\le \\text{beginIndex} \\le \\text{endIndex} \\le \\text{length}()$."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore String Comparison, mastering the critical differences between reference equality (==), value equality (.equals()), and lexicographical ordering (.compareTo())."
        }
      ]
    }
  },
  {
    slug: "string-comparison",
    title: "String Comparison",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-a-string`, `string-creation`, String Constant Pool interning, and reference vs value equality."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of String comparison as Three Different Types of Inspection:\n1. **Address Inspection (`==`)**: Checks if two people live at the exact same GPS building coordinates (same RAM pointer).\n2. **Content Inspection (`.equals()`)**: Checks if two distinct letters contain the exact same words written inside them.\n3. **Alphabetical Dictionary Ranking (`.compareTo()`)**: Checks which word appears earlier or later in a standard dictionary index."
        },
        {
          type: "callout",
          title: "The #1 Rule of Java Strings",
          content: "⚠️ **NEVER USE `==` TO COMPARE STRING CONTENT!**\n• `==` tests **reference identity** (whether both variables point to the same object in RAM).\n• `.equals()` tests **value equality** (whether both objects contain the identical sequence of characters).\n• Using `==` will cause subtle, intermittent bugs whenever strings are constructed dynamically from user input, network sockets, or database queries."
        },
        {
          type: "code",
          title: "The 4 Essential String Comparison Methods",
          code: "public class StringComparisonDemo {\n    public static void main(String[] args) {\n        String a = \"StudyHub\";\n        String b = \"StudyHub\";\n        String c = new String(\"StudyHub\");\n        String d = \"studyhub\";\n\n        // 1. CONTENT EQUALITY (.equals())\n        System.out.println(\"a.equals(b): \" + a.equals(b)); // true\n        System.out.println(\"a.equals(c): \" + a.equals(c)); // true (different objects, SAME text!)\n\n        // 2. REFERENCE IDENTITY (==)\n        System.out.println(\"a == b: \" + (a == b));         // true (both pooled)\n        System.out.println(\"a == c: \" + (a == c));         // FALSE! (c is distinct Heap object)\n\n        // 3. CASE-INSENSITIVE EQUALITY (.equalsIgnoreCase())\n        System.out.println(\"a.equalsIgnoreCase(d): \" + a.equalsIgnoreCase(d)); // true\n\n        // 4. LEXICOGRAPHICAL ORDERING (.compareTo())\n        // Returns: 0 if equal, < 0 if this < other, > 0 if this > other\n        System.out.println(\"\\\"apple\\\".compareTo(\\\"banana\\\"): \" + \"apple\".compareTo(\"banana\")); // negative (-1)\n        System.out.println(\"\\\"banana\\\".compareTo(\\\"apple\\\"): \" + \"banana\".compareTo(\"apple\")); // positive (+1)\n        System.out.println(\"\\\"test\\\".compareTo(\\\"test\\\"):     \" + \"test\".compareTo(\"test\"));     // 0\n    }\n}",
          language: "java",
          explanation: ".equals() checks character-by-character. compareTo() calculates the numerical difference between the first mismatched Unicode code points."
        },
        {
          type: "table",
          title: "Comparison Method Matrix",
          headers: ["Method / Operator", "Compares", "Return Type", "Null-Safe?", "Primary Use Case"],
          rows: [
            ["`s1 == s2`", "Memory reference address", "`boolean`", "✅ Yes (`null == null` is true)", "Checking if two references point to the exact same object."],
            ["`s1.equals(s2)`", "Exact character sequence", "`boolean`", "❌ No (throws NPE if `s1 == null`)", "Verifying passwords, IDs, codes, exact text."],
            ["`s1.equalsIgnoreCase(s2)`", "Character sequence ignoring case", "`boolean`", "❌ No (throws NPE if `s1 == null`)", "Command inputs, email logins, search queries."],
            ["`s1.compareTo(s2)`", "Lexicographical order (dictionary)", "`int` (<0, 0, >0)", "❌ No (throws NPE if `s1 == null`)", "Sorting alphabetical lists, binary search."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Yoda Condition to Avoid NullPointerException",
          code: "String userInputRole = null;\n\n// Unsafe: userInputRole.equals(\"ADMIN\") -> THROWS NullPointerException!\n// Safe 'Yoda' condition: Constant on the left!\nboolean isAdmin = \"ADMIN\".equals(userInputRole);\nSystem.out.println(\"Is Admin: \" + isAdmin);",
          expectedOutput: "Is Admin: false",
          explanation: "Calling .equals() on the literal string \"ADMIN\" is completely null-safe; it safely returns false without throwing an exception."
        },
        {
          type: "dryRun",
          title: "Lexicographical Comparison Trace: `\"cat\".compareTo(\"car\")`",
          iterations: [
            { step: 1, variables: { "Index 0": "'c' vs 'c'", "Unicode difference": "99 - 99 = 0" }, description: "First characters match; proceed to next index." },
            { step: 2, variables: { "Index 1": "'a' vs 'a'", "Unicode difference": "97 - 97 = 0" }, description: "Second characters match; proceed to next index." },
            { step: 3, variables: { "Index 2": "'t' vs 'r'", "Unicode difference": "116 - 114 = +2" }, description: "Characters mismatch! 't'(116) - 'r'(114) = +2." },
            { step: 4, variables: { "Return value": "+2" }, description: "Positive integer indicates \"cat\" comes after \"car\" in dictionary order." }
          ]
        },
        {
          type: "warning",
          title: "Common String Comparison Mistakes",
          items: [
            "**Using `==` for String logic**: Causes catastrophic bugs when comparing strings from Scanner, JSON, or DB.",
            "**Calling `.equals()` on Null References**: `userRole.equals(\"ADMIN\")` throws `NullPointerException` if `userRole` is null. Use `\"ADMIN\".equals(userRole)` or `Objects.equals(userRole, \"ADMIN\")`.",
            "**Misunderstanding `compareTo()` return value**: `compareTo()` returns a negative, zero, or positive integer (e.g. -5, 0, 12), NOT specifically -1 or 1. Check `result < 0` or `result == 0`.",
            "**Case Sensitivity in Sorting**: In Unicode ASCII, uppercase letters ('A'=65) come BEFORE lowercase letters ('a'=97). Hence `\"Zebra\".compareTo(\"apple\")` returns a negative number."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Objects.equals() vs .equals()",
          traps: [
            {
              question: "How do `Objects.equals(s1, s2)` and `s1.equals(s2)` handle `null` arguments differently?",
              trap: "Assuming they behave identically.",
              solution: "`s1.equals(s2)` throws `NullPointerException` if `s1` is null. In contrast, `java.util.Objects.equals(s1, s2)` first evaluates `(s1 == s2 || (s1 != null && s1.equals(s2)))`. It safely returns `true` if both are null, and `false` if only one is null, never throwing an NPE."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is printed by:\nString s1 = new String(\"hello\");\nString s2 = new String(\"hello\");\nSystem.out.println(s1 == s2);\nSystem.out.println(s1.equals(s2));",
          options: [
            "true then true",
            "false then true",
            "true then false",
            "false then false"
          ],
          answer: 1,
          explanation: "`s1 == s2` is false because `new` creates two distinct Heap objects. `s1.equals(s2)` is true because both contain identical character contents \"hello\"."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Always use `.equals()` to compare String text content; never use `==`.",
            "Use `.equalsIgnoreCase()` when matching case-insensitive strings.",
            "Use `.compareTo()` to determine lexicographical ordering (<0, 0, >0).",
            "Put literals on the left (`\"CONST\".equals(variable)`) or use `Objects.equals()` to prevent NullPointerExceptions."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we synthesize everything into Basic String Problems, implementing String Reversal, Palindrome Validation, and Anagram Checks with optimal time and space complexity."
        }
      ]
    }
  },
  {
    slug: "basic-string-problems",
    title: "Basic String Problems",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `charat-method`, `substring-method`, `string-comparison`, `for` loops, and array manipulation."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of String algorithms as **Pattern Pipelines**. Every core interview question relies on one of three fundamental machinery patterns:\n1. **Two-Pointer Convergence**: Scanning characters from both ends inward (Palindromes, In-Place Reversals).\n2. **Frequency Bucketing**: Accumulating character counts into fixed 26/128-element frequency arrays (Anagrams, Duplicates).\n3. **Mutable Buffer Accumulation (`StringBuilder`)**: Assembling new text dynamically without triggering quadratic $O(N^2)$ memory garbage."
        },
        {
          type: "callout",
          title: "The StringBuilder Performance Imperative",
          content: "⚠️ **CRITICAL INTERVIEW INSIGHT**: Because Strings are immutable, concatenating characters with `str += ch` inside an $N$-step loop creates $N$ intermediate String objects, degrading performance to **$O(N^2)$ time** and thrashing the Garbage Collector.\n\nAlways use **`StringBuilder`** for iterative string creation ($O(N)$ amortized time, single contiguous resizable buffer)."
        },
        {
          type: "code",
          title: "Problem 1: String Reversal (Two-Pointer char[] vs StringBuilder)",
          code: "public class StringReversal {\n    // Technique A: Built-in StringBuilder reverse (O(N) time, O(N) space)\n    public static String reverseWithBuilder(String input) {\n        if (input == null) return null;\n        return new StringBuilder(input).reverse().toString();\n    }\n\n    // Technique B: Two-Pointer In-Place Array Swap (O(N) time, O(N) auxiliary space)\n    public static String reverseTwoPointer(String input) {\n        if (input == null) return null;\n        char[] chars = input.toCharArray();\n        int left = 0;\n        int right = chars.length - 1;\n\n        while (left < right) {\n            char temp = chars[left];\n            chars[left] = chars[right];\n            chars[right] = temp;\n            left++;\n            right--;\n        }\n        return new String(chars);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(reverseWithBuilder(\"Pathway\")); // \"yawhtaP\"\n        System.out.println(reverseTwoPointer(\"Algorithm\")); // \"mhtiroglA\"\n    }\n}",
          language: "java",
          explanation: "Converting to char[] allows in-place swapping using two pointers until left >= right, avoiding repetitive String allocations."
        },
        {
          type: "code",
          title: "Problem 2: Palindrome Verification (Ignoring Case & Non-Alphanumeric)",
          code: "public class PalindromeChecker {\n    public static boolean isPalindrome(String s) {\n        if (s == null) return false;\n        \n        int left = 0;\n        int right = s.length() - 1;\n\n        while (left < right) {\n            // Skip non-alphanumeric characters\n            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {\n                left++;\n            }\n            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {\n                right--;\n            }\n\n            char leftChar  = Character.toLowerCase(s.charAt(left));\n            char rightChar = Character.toLowerCase(s.charAt(right));\n\n            if (leftChar != rightChar) {\n                return false; // Mismatch found!\n            }\n            left++;\n            right--;\n        }\n        return true; // All matched\n    }\n\n    public static void main(String[] args) {\n        System.out.println(isPalindrome(\"A man, a plan, a canal: Panama\")); // true\n        System.out.println(isPalindrome(\"race a car\"));                     // false\n    }\n}",
          language: "java",
          explanation: "Two pointers converge toward the center in O(N) time and O(1) extra space without allocating cleaned copy strings."
        },
        {
          type: "table",
          title: "Classic String Interview Problems & Optimal Complexities",
          headers: ["Problem", "Recommended Pattern", "Time Complexity", "Space Complexity", "Core Trap"],
          rows: [
            ["Reverse a String", "Two-pointer `char[]` swap or `StringBuilder`", "$O(N)$", "$O(N)$", "Using `str += charAt(i)` causing $O(N^2)$ time."],
            ["Valid Palindrome", "Two-pointer convergence with `isLetterOrDigit`", "$O(N)$", "$O(1)$", "Allocating new regex-cleaned strings instead of skipping in-place."],
            ["Valid Anagram", "Fixed 26-element `int[]` frequency count", "$O(N)$", "$O(1)$", "Sorting strings in $O(N \\log N)$ instead of counting in $O(N)$."],
            ["Count Vowels & Consonants", "Single-pass linear scan with `Character.isLetter`", "$O(N)$", "$O(1)$", "Forgetting punctuation and whitespace."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Valid Anagram Checker",
          code: "String s = \"anagram\";\nString t = \"nagaram\";\nboolean isAnagram = true;\nif (s.length() != t.length()) {\n    isAnagram = false;\n} else {\n    int[] counts = new int[26];\n    for (int i = 0; i < s.length(); i++) {\n        counts[s.charAt(i) - 'a']++;\n        counts[t.charAt(i) - 'a']--;\n    }\n    for (int count : counts) {\n        if (count != 0) { isAnagram = false; break; }\n    }\n}\nSystem.out.println(\"Is Anagram: \" + isAnagram);",
          expectedOutput: "Is Anagram: true",
          explanation: "Counts of each character in 's' are cancelled out by 't'. If all entries in counts are 0, they are anagrams."
        },
        {
          type: "dryRun",
          title: "Palindrome Two-Pointer Trace: `\"radar\"`",
          iterations: [
            { step: 1, variables: { "left": "0 ('r')", "right": "4 ('r')" }, description: "Left 'r' == Right 'r'. Matches! Increment left to 1, decrement right to 3." },
            { step: 2, variables: { "left": "1 ('a')", "right": "3 ('a')" }, description: "Left 'a' == Right 'a'. Matches! Increment left to 2, decrement right to 2." },
            { step: 3, variables: { "left": "2 ('d')", "right": "2 ('d')" }, description: "left == right. Pointers crossed. Loop terminates successfully -> Palindrome is TRUE." }
          ]
        },
        {
          type: "warning",
          title: "Common String Problem Traps",
          items: [
            "**String Concatenation in Loops**: Writing `for (...) { res += s.charAt(i); }` is an automatic red flag in coding interviews. Always use `StringBuilder`.",
            "**Ignoring Case Differences**: Forgetting `Character.toLowerCase()` before comparing causes false negatives in palindrome and anagram verification.",
            "**Forgetting Length Checks**: In Anagram questions, always guard with `if (s.length() != t.length()) return false;` immediately.",
            "**Negative Array Indices in Frequency Arrays**: Always ensure input characters are in the expected range before doing `char - 'a'`, or use a 128/256-size array to support full ASCII."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: In-Place String Mutation in Java",
          traps: [
            {
              question: "An interviewer asks: 'Write an in-place string reversal algorithm that operates with $O(1)$ auxiliary space in Java.' How should you answer?",
              trap: "Claiming you can mutate the Java `String` directly in-place without memory allocation.",
              solution: "Explain that because Java `String` instances are immutable and their internal byte arrays are private final fields, true in-place reversal of a `String` object without allocating a `char[]` or `StringBuilder` is impossible by language design. You can perform $O(1)$ space in-place reversal on a `char[]` or `StringBuilder`, but converting back to `String` will always require $O(N)$ memory."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Why is `StringBuilder` preferred over `+` string concatenation in loops?",
          options: [
            "`StringBuilder` uses less lines of code",
            "`StringBuilder` modifies a mutable buffer in O(N) amortized time instead of creating O(N) intermediate immutable objects in O(N^2) time",
            "`StringBuilder` is synchronized and thread-safe",
            "`StringBuilder` automatically validates palindromes"
          ],
          answer: 1,
          explanation: "String concatenation creates a brand-new String on every iteration copying previous characters ($O(N^2)$ time), whereas StringBuilder appends to a resizable buffer in $O(1)$ amortized time ($O(N)$ total time)."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Use two-pointer techniques for string reversal and palindrome verification.",
            "Use fixed-size frequency arrays (`int[26]` or `int[256]`) for $O(N)$ anagram and character frequency counting.",
            "Always use `StringBuilder` rather than `+` string concatenation when building strings iteratively.",
            "Java Strings are immutable; all mutation operations create new objects."
          ]
        },
        {
          type: "text",
          title: "Module Completion Summary",
          content: "🎉 **Congratulations! You have completed Module 8: Strings.** You have mastered String immutability, the String Constant Pool, zero-based indexing, length measurement, character slicing with `substring()`, reference vs content equality, and standard algorithmic string manipulation patterns."
        }
      ]
    }
  }
];

