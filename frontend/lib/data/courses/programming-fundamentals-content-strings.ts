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
      definition: "A String is a sequence of characters. In Java, String is a class representing text data. Strings are immutable—once created, their content cannot be changed.",
      whyItMatters: "Strings are one of the most commonly used data types for representing names, messages, text processing, and user input.",
      coreConcept: "Strings are objects (not primitives). They are immutable. String literals are stored in a special memory area called the String pool. Use double quotes for String literals.",
      syntax: "String name = \"Hello\";",
      javaExample: "// Create strings\nString s1 = \"Hello\";  // String literal\nString s2 = new String(\"World\");  // String object\nString s3 = \"Hello\" + \" \" + \"World\";  // Concatenation\n\n// Immutability\nString original = \"Java\";\noriginal.toUpperCase();  // Returns new String\nSystem.out.println(original);  // Still \"Java\"\n\nString upper = original.toUpperCase();\nSystem.out.println(upper);  // \"JAVA\"",
      howItWorks: "String literals are created in String pool for memory efficiency. Multiple references to same literal point to same object. new String() creates distinct object. Methods return new Strings due to immutability.",
      realWorldUse: "Names, messages, file paths, URLs, user input, text processing, data parsing, display text.",
      commonMistakes: [
        "Using == instead of .equals() to compare content",
        "Thinking String is a primitive type",
        "Expecting String methods to modify the original",
        "Creating Strings unnecessarily with 'new'"
      ],
      interviewQuestions: [
        { question: "What does String immutability mean?", answer: "Once a String object is created, its content cannot be changed. Methods that appear to modify return new String objects instead." },
        { question: "What is the String pool?", answer: "A special memory area in the heap where String literals are stored. If two literals have same content, they reference the same object in the pool for efficiency." }
      ],
      quickRevision: "String = immutable sequence of characters. Use \"\" for literals. Use .equals() for comparison, not ==.",
      practicePrompt: "Create three different Strings and print them concatenated with spaces.",
      quickCheck: {
        question: "Are Strings in Java mutable or immutable?",
        options: ["Mutable", "Immutable", "Depends on declaration", "Only literals are immutable"],
        answer: 1,
        explanation: "All Strings in Java are immutable. Once created, their content cannot be changed. Any modification creates a new String object."
      }
    }
  },
  {
    slug: "string-creation",
    title: "String Creation",
    content: {
      definition: "Strings can be created using literals (double quotes) or the new keyword. String literals are interned in the String pool, while new String() creates distinct objects.",
      whyItMatters: "Understanding creation methods helps you write efficient code and understand String comparison behavior.",
      coreConcept: "Preferred: String s = \"text\"; (uses pool, efficient). Alternative: String s = new String(\"text\"); (creates new object, usually unnecessary).",
      syntax: "String s1 = \"Hello\";  // Literal - preferred\nString s2 = new String(\"Hello\");  // Object\nString s3 = new String(char[] data);",
      javaExample: "// String literals\nString s1 = \"Java\";\nString s2 = \"Java\";\nSystem.out.println(s1 == s2);  // true (same object in pool)\n\n// new String()\nString s3 = new String(\"Java\");\nString s4 = new String(\"Java\");\nSystem.out.println(s3 == s4);  // false (different objects)\nSystem.out.println(s3.equals(s4));  // true (same content)\n\n// From char array\nchar[] chars = {'H', 'i'};\nString s5 = new String(chars);  // \"Hi\"",
      howItWorks: "Literals: JVM checks pool, reuses if exists, creates if not. new String(): Always creates new object. intern() manually adds to pool.",
      realWorldUse: "Most String creation uses literals. Use new String() only when you specifically need distinct objects or converting from char arrays.",
      commonMistakes: [
        "Unnecessarily using new String() for literals",
        "Expecting == to work for content comparison",
        "Not understanding pool vs heap",
        "Creating Strings in tight loops (inefficient)"
      ],
      interviewQuestions: [
        { question: "What is the difference between String s = \"text\" and String s = new String(\"text\")?", answer: "Literal uses String pool (shared). new String() creates new object in heap (not shared), even if \"text\" exists in pool." },
        { question: "What does the intern() method do?", answer: "intern() adds the String to the String pool (if not present) and returns the pooled reference, enabling == comparison." }
      ],
      quickRevision: "Prefer literals (\"text\"). new String() creates distinct object. Literals share pool reference.",
      practicePrompt: "Create two Strings with same content using literals and compare them with == and .equals().",
      quickCheck: {
        question: "What is printed?\nString s1 = \"Hello\";\nString s2 = \"Hello\";\nSystem.out.println(s1 == s2);",
        options: ["true", "false", "Compile error", "Runtime error"],
        answer: 0,
        explanation: "Both literals point to the same object in the String pool, so == returns true (same reference)."
      }
    }
  },
  {
    slug: "string-indexing",
    title: "String Indexing",
    content: {
      definition: "String indexing allows access to individual characters at specific positions. Indices range from 0 to length()-1, similar to arrays.",
      whyItMatters: "Character-level access is essential for string processing, validation, parsing, and text analysis.",
      coreConcept: "Use charAt(index) to get character at position. Index 0 is first character. length() gives total characters. Accessing invalid index throws StringIndexOutOfBoundsException.",
      syntax: "char ch = str.charAt(index);",
      javaExample: "String str = \"Hello\";\n\n// Access characters\nchar first = str.charAt(0);  // 'H'\nchar second = str.charAt(1);  // 'e'\nchar last = str.charAt(str.length() - 1);  // 'o'\n\n// Print all characters\nfor (int i = 0; i < str.length(); i++) {\n    System.out.println(str.charAt(i));\n}\n\n// Invalid: str.charAt(5) throws StringIndexOutOfBoundsException",
      howItWorks: "charAt(i) returns primitive char at index i. Unlike arrays, cannot use [] for Strings. Must use charAt() method. Throws exception for invalid index.",
      realWorldUse: "Character validation, counting vowels/consonants, password strength checking, parsing formatted text, text encryption.",
      commonMistakes: [
        "Using str[0] instead of str.charAt(0) (wrong syntax)",
        "Accessing index >= length()",
        "Forgetting that charAt() returns char, not String",
        "Using length instead of length() for Strings"
      ],
      interviewQuestions: [
        { question: "How do you access the first character of a String?", answer: "Use charAt(0). Example: char first = str.charAt(0);" },
        { question: "What is the difference between String.length() and array.length?", answer: "String.length() is a method (needs parentheses). array.length is a property (no parentheses)." }
      ],
      quickRevision: "charAt(i) returns char at index. Index 0 to length()-1. length() is method, not property.",
      practicePrompt: "Write code that prints each character of your name on a separate line.",
      quickCheck: {
        question: "What does \"Java\".charAt(2) return?",
        options: ["'J'", "'a'", "'v'", "'a' (second one)"],
        answer: 2,
        explanation: "Index 0='J', 1='a', 2='v', 3='a'. charAt(2) returns 'v'."
      }
    }
  },
  {
    slug: "length-method",
    title: "length()",
    content: {
      definition: "The length() method returns the number of characters in a String. It's a method (not a property like arrays).",
      whyItMatters: "Knowing String length is essential for loops, validation, bounds checking, and string processing.",
      coreConcept: "length() returns int representing character count. Empty string has length 0. Remember: method for String (length()), property for array (length).",
      syntax: "int len = str.length();",
      javaExample: "String name = \"Alice\";\nint len = name.length();  // 5\n\nString empty = \"\";\nSystem.out.println(empty.length());  // 0\n\n// Use in loops\nfor (int i = 0; i < name.length(); i++) {\n    System.out.println(name.charAt(i));\n}\n\n// Validation\nString password = \"abc\";\nif (password.length() < 8) {\n    System.out.println(\"Password too short\");\n}",
      howItWorks: "length() counts characters in the String. Includes spaces and special characters. Does not count null terminator (Java handles this internally).",
      realWorldUse: "Input validation (minimum length), loop bounds, truncation checks, password strength, limiting user input.",
      commonMistakes: [
        "Using str.length without parentheses (compile error)",
        "Confusing with array.length (no parentheses)",
        "Comparing String.length() with 1 to check empty (use 0)",
        "Not handling null Strings (NullPointerException)"
      ],
      interviewQuestions: [
        { question: "What is the length of an empty String?", answer: "0. Empty String (\"\") has zero characters." },
        { question: "How do you check if a String is empty?", answer: "Use str.isEmpty() or str.length() == 0. Modern approach: str.isEmpty() is clearer." }
      ],
      quickRevision: "length() returns character count. Remember parentheses. Empty string length = 0.",
      practicePrompt: "Write code that checks if a username is between 5 and 15 characters.",
      quickCheck: {
        question: "What is \"Hello World\".length()?",
        options: ["10", "11", "12", "Error"],
        answer: 1,
        explanation: "Counts all characters including space. H-e-l-l-o-space-W-o-r-l-d = 11 characters."
      }
    }
  },
  {
    slug: "charat-method",
    title: "charAt()",
    content: {
      definition: "The charAt(int index) method returns the character at the specified index. It enables character-level access to strings.",
      whyItMatters: "charAt() is the primary way to access individual characters for processing, validation, and analysis.",
      coreConcept: "Returns primitive char. Index must be 0 to length()-1. Throws StringIndexOutOfBoundsException for invalid index. Cannot modify characters (String immutable).",
      syntax: "char ch = str.charAt(index);",
      javaExample: "String word = \"Programming\";\n\n// Access specific characters\nchar first = word.charAt(0);  // 'P'\nchar middle = word.charAt(5);  // 'a'\nchar last = word.charAt(word.length() - 1);  // 'g'\n\n// Count vowels\nint vowelCount = 0;\nfor (int i = 0; i < word.length(); i++) {\n    char ch = word.charAt(i);\n    if (ch == 'a' || ch == 'e' || ch == 'i' || \n        ch == 'o' || ch == 'u') {\n        vowelCount++;\n    }\n}\nSystem.out.println(\"Vowels: \" + vowelCount);",
      howItWorks: "Method accesses internal character array. Returns char value at specified position. Validates index before access, throws exception if out of bounds.",
      realWorldUse: "Character validation, vowel/consonant counting, palindrome checking, character frequency analysis, parsing.",
      commonMistakes: [
        "Treating returned char as String",
        "Accessing negative or >= length() index",
        "Using charAt() in tight loops without caching length()",
        "Not handling exception for dynamic indices"
      ],
      interviewQuestions: [
        { question: "Can you modify a String character using charAt()?", answer: "No. Strings are immutable. charAt() only reads. To 'modify', create new String with changed character." },
        { question: "What exception does charAt() throw for invalid index?", answer: "StringIndexOutOfBoundsException when index is negative or >= length()." }
      ],
      quickRevision: "charAt(i) returns char at index. Read-only (Strings immutable). Index 0 to length()-1.",
      practicePrompt: "Count how many times the letter 'a' appears in a given String.",
      quickCheck: {
        question: "What happens if you call \"Hi\".charAt(5)?",
        options: [
          "Returns null",
          "Returns ' '",
          "Throws StringIndexOutOfBoundsException",
          "Returns the last character"
        ],
        answer: 2,
        explanation: "\"Hi\" has length 2 (indices 0, 1). Index 5 is out of bounds, throwing StringIndexOutOfBoundsException."
      }
    }
  },
  {
    slug: "substring-method",
    title: "substring()",
    content: {
      definition: "The substring() method extracts a portion of a String. It has two forms: substring(beginIndex) returns from beginIndex to end, and substring(beginIndex, endIndex) returns from beginIndex to endIndex-1.",
      whyItMatters: "substring() is essential for extracting parts of strings, parsing data, and text processing.",
      coreConcept: "substring(start) returns from start to end. substring(start, end) returns from start to end-1 (end is exclusive). Returns new String (immutable).",
      syntax: "String sub1 = str.substring(startIndex);\nString sub2 = str.substring(startIndex, endIndex);",
      javaExample: "String text = \"Hello World\";\n\n// substring(start) - from start to end\nString s1 = text.substring(6);  // \"World\"\n\n// substring(start, end) - from start to end-1\nString s2 = text.substring(0, 5);  // \"Hello\"\nString s3 = text.substring(6, 11);  // \"World\"\n\n// Extract middle\nString s4 = text.substring(3, 8);  // \"lo Wo\"\n\n// Common: get first N characters\nString first3 = text.substring(0, 3);  // \"Hel\"",
      howItWorks: "Creates new String from specified range. endIndex is exclusive (not included). If indices invalid, throws StringIndexOutOfBoundsException.",
      realWorldUse: "Extracting usernames from emails, parsing formatted data, truncating text, getting file extensions, splitting tokens.",
      commonMistakes: [
        "Forgetting endIndex is exclusive",
        "Using substring(0, length()) to copy (just assign)",
        "Invalid indices (start > end or < 0)",
        "Expecting original String to be modified"
      ],
      interviewQuestions: [
        { question: "What does \"Java\".substring(1, 3) return?", answer: "\"av\". Starts at index 1 ('a'), up to but not including index 3 (second 'a'). So index 1 and 2." },
        { question: "How do you extract the last 3 characters of a String?", answer: "str.substring(str.length() - 3). Start from 3 characters before end, go to the end." }
      ],
      quickRevision: "substring(start) = start to end. substring(start, end) = start to end-1 (exclusive). Returns new String.",
      practicePrompt: "Extract and print the first and last 3 characters of \"Programming\".",
      quickCheck: {
        question: "What does \"Programming\".substring(3, 7) return?",
        options: ["\"gram\"", "\"gramm\"", "\"ogra\"", "\"ramm\""],
        answer: 0,
        explanation: "Indices 3, 4, 5, 6 (not 7, exclusive). P(0)r(1)o(2)g(3)r(4)a(5)m(6) = \"gram\"."
      }
    }
  },
  {
    slug: "string-comparison",
    title: "String Comparison",
    content: {
      definition: "String comparison checks if two Strings are equal or determines their ordering. Use .equals() for content equality, == for reference equality, and compareTo() for ordering.",
      whyItMatters: "Correct String comparison is critical for validation, sorting, searching, and conditional logic. Using == causes bugs.",
      coreConcept: "== compares references (memory addresses). .equals() compares content. .equalsIgnoreCase() ignores case. compareTo() returns negative/zero/positive for ordering.",
      syntax: "str1.equals(str2)  // content equality\nstr1 == str2  // reference equality\nstr1.compareTo(str2)  // ordering",
      javaExample: "String s1 = \"Hello\";\nString s2 = \"Hello\";\nString s3 = new String(\"Hello\");\n\n// equals() - content\nSystem.out.println(s1.equals(s2));  // true\nSystem.out.println(s1.equals(s3));  // true\n\n// == - reference\nSystem.out.println(s1 == s2);  // true (same pool object)\nSystem.out.println(s1 == s3);  // false (different objects)\n\n// equalsIgnoreCase()\nSystem.out.println(\"Hello\".equalsIgnoreCase(\"hello\"));  // true\n\n// compareTo() - ordering\nSystem.out.println(\"apple\".compareTo(\"banana\"));  // negative\nSystem.out.println(\"zebra\".compareTo(\"apple\"));  // positive\nSystem.out.println(\"test\".compareTo(\"test\"));  // 0",
      howItWorks: "equals() checks character-by-character. compareTo() uses lexicographic ordering (dictionary order based on Unicode values). Returns 0 if equal, negative if first < second, positive if first > second.",
      realWorldUse: "User authentication (password check), sorting lists, searching, validation, case-insensitive matching.",
      commonMistakes: [
        "Using == instead of .equals() for content",
        "Not using equalsIgnoreCase() when case doesn't matter",
        "Comparing null Strings (NullPointerException)",
        "Not understanding compareTo() return values"
      ],
      interviewQuestions: [
        { question: "Why should you never use == to compare String content?", answer: "== compares references (memory addresses), not content. Two Strings with same content can be different objects, causing == to return false incorrectly." },
        { question: "What does compareTo() return?", answer: "0 if equal, negative if first < second (lexicographically), positive if first > second. The magnitude indicates the character difference." }
      ],
      quickRevision: "equals() = content. == = reference. equalsIgnoreCase() = ignore case. compareTo() = ordering (0/neg/pos).",
      practicePrompt: "Compare \"apple\" and \"Apple\" using equals(), equalsIgnoreCase(), and ==.",
      quickCheck: {
        question: "What is the correct way to check if two Strings have the same content?",
        options: [
          "str1 == str2",
          "str1.equals(str2)",
          "str1.compare(str2)",
          "str1.contentEquals(str2)"
        ],
        answer: 1,
        explanation: ".equals() compares content character-by-character. This is the standard way to check String equality in Java."
      }
    }
  },
  {
    slug: "basic-string-problems",
    title: "Basic String Problems",
    content: {
      definition: "Basic String problems involve common operations like reversing, palindrome checking, counting characters, and simple transformations. These develop string manipulation skills.",
      whyItMatters: "These fundamental patterns appear frequently in coding interviews and real-world text processing tasks.",
      coreConcept: "Use charAt() for character access, length() for bounds, substring() for extraction, equals() for comparison. Build new Strings or use StringBuilder for modifications.",
      syntax: "// Common patterns for String manipulation",
      javaExample: "// 1. Reverse a String\nString original = \"Hello\";\nString reversed = \"\";\nfor (int i = original.length() - 1; i >= 0; i--) {\n    reversed += original.charAt(i);\n}\nSystem.out.println(reversed);  // \"olleH\"\n\n// 2. Check palindrome\nString word = \"radar\";\nboolean isPalindrome = true;\nfor (int i = 0; i < word.length() / 2; i++) {\n    if (word.charAt(i) != word.charAt(word.length() - 1 - i)) {\n        isPalindrome = false;\n        break;\n    }\n}\nSystem.out.println(isPalindrome);  // true\n\n// 3. Count vowels\nString text = \"Programming\";\nint vowelCount = 0;\nfor (int i = 0; i < text.length(); i++) {\n    char ch = Character.toLowerCase(text.charAt(i));\n    if (ch == 'a' || ch == 'e' || ch == 'i' || \n        ch == 'o' || ch == 'u') {\n        vowelCount++;\n    }\n}\nSystem.out.println(\"Vowels: \" + vowelCount);  // 3",
      howItWorks: "Reverse: iterate backwards, build new String. Palindrome: compare characters from both ends moving inward. Count: iterate, check each character.",
      realWorldUse: "Text validation, data cleaning, format conversion, word games, password validation, search preprocessing.",
      commonMistakes: [
        "String concatenation in loops (inefficient, use StringBuilder)",
        "Not handling case sensitivity in palindrome/vowel checks",
        "Off-by-one errors in reverse/palindrome logic",
        "Forgetting empty String edge cases"
      ],
      interviewQuestions: [
        { question: "How do you efficiently reverse a String?", answer: "Use StringBuilder: new StringBuilder(str).reverse().toString(); or loop backwards building a new String." },
        { question: "What makes a String a palindrome?", answer: "A palindrome reads the same forwards and backwards. Check by comparing characters from both ends: str.charAt(i) == str.charAt(len-1-i)." }
      ],
      quickRevision: "Reverse: loop backwards. Palindrome: compare from both ends. Count: iterate and check condition. Use StringBuilder for efficiency.",
      practicePrompt: "Write a program that checks if a word is a palindrome (case-insensitive).",
      quickCheck: {
        question: "Which of these is a palindrome?",
        options: ["\"hello\"", "\"racecar\"", "\"java\"", "\"world\""],
        answer: 1,
        explanation: "\"racecar\" reads the same forwards and backwards: r-a-c-e-c-a-r."
      }
    }
  }
];
