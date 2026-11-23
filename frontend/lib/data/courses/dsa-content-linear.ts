// DSA Modules 3-6: Strings, Linked List, Stack, Queue
// All Java code is compiled and tested.
import { CourseLesson } from './types';

export const stringLessons: CourseLesson[] = [
  {
    id: "strings-in-java",
    slug: "strings-in-java",
    title: "Strings in Java: Immutability, StringBuilder and Character Tricks",
    description: "Why String concatenation in loops is slow, how StringBuilder fixes it, and the char arithmetic used everywhere.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Immutability",
          content: "Java Strings are immutable: every 'change' creates a new String object. So `s = s + c` inside a loop copies the whole string each time: O(n²) for n appends. StringBuilder keeps a resizable char buffer: append is amortized O(1), and the whole build is O(n)."
        },
        {
          type: "code",
          title: "Essentials",
          language: "java",
          code: "String s = \"hello\";\ns.length();            // 5\ns.charAt(1);           // 'e'\ns.substring(1, 4);     // \"ell\" (end index exclusive)\ns.indexOf('l');        // 2\ns.toCharArray();       // char[] you can sort or modify\n\nStringBuilder sb = new StringBuilder();\nfor (char c : s.toCharArray()) sb.append(c);\nsb.reverse().toString();   // \"olleh\"\n\n// char arithmetic: map 'a'..'z' to 0..25\nint idx = 'c' - 'a';           // 2\nchar up = Character.toUpperCase('q');\nboolean ok = Character.isLetterOrDigit('7');\n\n// Equality: ALWAYS equals(), never ==\nboolean same = s.equals(\"hello\");",
          explanation: "== compares references. It may 'work' for literals because of the string pool, then fail for strings built at run time."
        },
        {
          type: "code",
          title: "Reverse the Words in a Sentence",
          language: "java",
          code: "static String reverseWords(String s) {\n    String[] words = s.trim().split(\"\\\\s+\");      // split on runs of whitespace\n    StringBuilder sb = new StringBuilder();\n    for (int i = words.length - 1; i >= 0; i--) {\n        sb.append(words[i]);\n        if (i > 0) sb.append(' ');\n    }\n    return sb.toString();\n}\n// \"  the sky  is blue \" -> \"blue is sky the\"",
          explanation: "trim() removes the outer spaces; the regex \\s+ collapses multiple inner spaces."
        },
        {
          type: "quickCheck",
          question: "Building a 100,000-character string with s += c in a loop is roughly:",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
          answer: 2,
          explanation: "Each += copies the current string, so the copies add up to 1 + 2 + ... + n = O(n²). Use StringBuilder."
        },
        {
          type: "takeaways",
          items: ["Strings are immutable; use StringBuilder for repeated appends.", "Compare with equals(), not ==.", "c − 'a' maps lowercase letters to 0-25 for counting arrays."]
        }
      ]
    }
  },
  {
    id: "palindromes-and-anagrams",
    slug: "palindromes-and-anagrams",
    title: "Palindromes and Anagrams",
    description: "Two-pointer palindrome checks, frequency-count anagram checks, and grouping anagrams with a hash map.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "Valid Palindrome (ignoring case and symbols)",
          language: "java",
          code: "static boolean isPalindrome(String s) {\n    int i = 0, j = s.length() - 1;\n    while (i < j) {\n        while (i < j && !Character.isLetterOrDigit(s.charAt(i))) i++;\n        while (i < j && !Character.isLetterOrDigit(s.charAt(j))) j--;\n        if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) return false;\n        i++; j--;\n    }\n    return true;\n}\n// \"A man, a plan, a canal: Panama\" -> true\n// \"race a car\"                     -> false",
          explanation: "O(n) time and O(1) space. There's no need to build a cleaned copy of the string."
        },
        {
          type: "code",
          title: "Valid Anagram With a Frequency Array",
          language: "java",
          code: "static boolean isAnagram(String s, String t) {\n    if (s.length() != t.length()) return false;\n    int[] count = new int[26];\n    for (int i = 0; i < s.length(); i++) {\n        count[s.charAt(i) - 'a']++;\n        count[t.charAt(i) - 'a']--;\n    }\n    for (int c : count) if (c != 0) return false;\n    return true;\n}\n// (\"listen\", \"silent\") -> true, (\"rat\", \"car\") -> false",
          explanation: "O(n) instead of the O(n log n) of sorting both strings. For Unicode input, use a HashMap<Character, Integer>."
        },
        {
          type: "code",
          title: "Group Anagrams",
          language: "java",
          code: "static List<List<String>> groupAnagrams(String[] words) {\n    Map<String, List<String>> groups = new LinkedHashMap<>();\n    for (String w : words) {\n        char[] key = w.toCharArray();\n        Arrays.sort(key);                                   // anagrams share the sorted form\n        groups.computeIfAbsent(new String(key), k -> new ArrayList<>()).add(w);\n    }\n    return new ArrayList<>(groups.values());\n}\n// {\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"} -> [[eat, tea, ate], [tan, nat], [bat]]",
          explanation: "O(n · k log k) for n words of length k. A 26-count signature as the key makes it O(n · k)."
        },
        {
          type: "quickCheck",
          question: "Which key correctly groups anagrams together?",
          options: ["The word's length", "The word's first letter", "The word's sorted characters", "The word's hashCode()"],
          answer: 2,
          explanation: "All anagrams have identical sorted characters ('eat', 'tea' and 'ate' all become 'aet')."
        },
        {
          type: "takeaways",
          items: ["Palindromes: two pointers from both ends.", "Anagrams: compare character counts.", "Grouping: a hash map from a canonical key to a list."]
        }
      ]
    }
  },
  {
    id: "sliding-window-on-strings",
    slug: "sliding-window-on-strings",
    title: "Variable Sliding Window: Longest Substring Without Repeating Characters",
    description: "Grow and shrink a window to find the longest or shortest substring that satisfies a condition.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "The Variable Window Template",
          content: "Expand the right edge one step at a time. When the window breaks the condition, move the left edge forward until it's valid again. Record the best window as you go.\nEach index enters and leaves the window at most once, so the total is O(n)."
        },
        {
          type: "code",
          title: "Longest Substring Without Repeating Characters",
          language: "java",
          code: "static int lengthOfLongestSubstring(String s) {\n    Map<Character, Integer> last = new HashMap<>();   // char -> last index seen\n    int best = 0, left = 0;\n    for (int right = 0; right < s.length(); right++) {\n        char c = s.charAt(right);\n        if (last.containsKey(c) && last.get(c) >= left)\n            left = last.get(c) + 1;                    // jump past the previous copy\n        last.put(c, right);\n        best = Math.max(best, right - left + 1);\n    }\n    return best;\n}\n// \"abcabcbb\" -> 3 (\"abc\"), \"pwwkew\" -> 3 (\"wke\"), \"abba\" -> 2",
          explanation: "The check `last.get(c) >= left` matters. For 'abba', the old 'a' at index 0 lies outside the current window when the second 'a' arrives, so left must not jump backwards."
        },
        {
          type: "dryRun",
          title: "Trace on \"abcabcbb\"",
          iterations: [
            { step: "right = 0-2", variables: { window: "abc", left: "0", best: "3" }, description: "No repeats yet." },
            { step: "right = 3 ('a')", variables: { "a last at": "0", left: "1", window: "bca" }, description: "Repeat: move left past the old 'a'." },
            { step: "right = 4 ('b')", variables: { left: "2", window: "cab" }, description: "" },
            { step: "right = 7 ('b')", variables: { left: "7", window: "b" }, description: "best stays 3." }
          ]
        },
        {
          type: "practice",
          title: "Practice Problems",
          problems: [{ id: "3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium" }]
        },
        {
          type: "quickCheck",
          question: "What makes this sliding window O(n) rather than O(n²)?",
          options: ["The HashMap is sorted", "left and right each only move forward, at most n times", "The string is short", "Characters are compared in pairs"],
          answer: 1,
          explanation: "Both pointers only advance, so their combined movement is at most 2n."
        },
        {
          type: "takeaways",
          items: ["'Longest/shortest substring with property X' → variable sliding window.", "Track window state in a map or count array; shrink from the left when the window becomes invalid."]
        }
      ]
    }
  }
];

export const linkedListLessons: CourseLesson[] = [
  {
    id: "linked-list-basics",
    slug: "linked-list-basics",
    title: "Linked List Basics: Nodes, Traversal, Insert and Delete",
    description: "How singly and doubly linked lists work, their costs compared with arrays, and the dummy-node trick.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "The Node",
          language: "java",
          code: "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int v) { val = v; }\n}\n\n// Build 1 -> 2 -> 3 and traverse it\nListNode head = new ListNode(1);\nhead.next = new ListNode(2);\nhead.next.next = new ListNode(3);\nfor (ListNode cur = head; cur != null; cur = cur.next)\n    System.out.print(cur.val + \" \");     // 1 2 3",
          explanation: "Each node points to the next one; the last node points to null. You only hold a reference to the head."
        },
        {
          type: "table",
          title: "Linked List vs Array",
          headers: ["Operation", "Array", "Singly linked list"],
          rows: [
            ["Access the i-th element", "O(1)", "O(n): must walk from the head"],
            ["Insert or delete at the head", "O(n) shift", "O(1)"],
            ["Insert or delete after a known node", "O(n) shift", "O(1)"],
            ["Memory", "Compact, cache-friendly", "Extra pointer per node, scattered in memory"]
          ]
        },
        {
          type: "text",
          title: "The Dummy (Sentinel) Node Trick",
          content: "Many list operations need special handling when the head itself changes (deleting the first node, merging, building a new list). Create `ListNode dummy = new ListNode(0); dummy.next = head;`, work from dummy, and return `dummy.next`. The head then becomes an ordinary node, with no special case."
        },
        {
          type: "code",
          title: "Remove the N-th Node From the End (one pass)",
          language: "java",
          code: "static ListNode removeNthFromEnd(ListNode head, int n) {\n    ListNode dummy = new ListNode(0); dummy.next = head;\n    ListNode fast = dummy, slow = dummy;\n    for (int i = 0; i <= n; i++) fast = fast.next;   // gap of n + 1\n    while (fast != null) { fast = fast.next; slow = slow.next; }\n    slow.next = slow.next.next;                      // unlink the target\n    return dummy.next;\n}\n// 1->2->3->4->5, n = 2  ->  1->2->3->5",
          explanation: "Keeping a gap of n + 1 leaves slow just before the node to delete. The dummy handles deleting the head (n = list length)."
        },
        {
          type: "quickCheck",
          question: "Doubly linked lists add a prev pointer. What does that buy you?",
          options: ["O(1) random access", "O(1) deletion of a node given only a reference to it", "Less memory", "Automatic sorting"],
          answer: 1,
          explanation: "With prev, you can unlink a node without searching for its predecessor. That's how LinkedHashMap and LRU caches work."
        },
        {
          type: "takeaways",
          items: ["Lists: O(1) insert/delete at known positions, O(n) access.", "Use a dummy node to avoid head special cases.", "Two pointers with a gap find positions measured from the end."]
        }
      ]
    }
  },
  {
    id: "reverse-a-linked-list",
    slug: "reverse-a-linked-list",
    title: "Reversing a Linked List (Iterative and Recursive)",
    description: "The three-pointer reversal every interviewer asks for, plus the recursive version.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Iterative: prev, curr, next",
          language: "java",
          code: "static ListNode reverseList(ListNode head) {\n    ListNode prev = null, curr = head;\n    while (curr != null) {\n        ListNode next = curr.next;   // 1. remember the rest of the list\n        curr.next = prev;            // 2. reverse this link\n        prev = curr;                 // 3. advance prev\n        curr = next;                 // 4. advance curr\n    }\n    return prev;                     // new head\n}\n// 1->2->3->4->5  ->  5->4->3->2->1",
          explanation: "O(n) time, O(1) space. Saving next before overwriting curr.next is the step people forget."
        },
        {
          type: "dryRun",
          title: "Reversing 1 -> 2 -> 3",
          iterations: [
            { step: 1, variables: { prev: "null", curr: "1", "after": "1->null" }, description: "next = 2; point 1 back to null." },
            { step: 2, variables: { prev: "1", curr: "2", "after": "2->1->null" }, description: "next = 3; point 2 back to 1." },
            { step: 3, variables: { prev: "2", curr: "3", "after": "3->2->1->null" }, description: "next = null; point 3 back to 2." },
            { step: "end", variables: { prev: "3", curr: "null" }, description: "Return prev (3) as the new head." }
          ]
        },
        {
          type: "code",
          title: "Recursive",
          language: "java",
          code: "static ListNode reverseRec(ListNode head) {\n    if (head == null || head.next == null) return head;   // last node becomes the new head\n    ListNode newHead = reverseRec(head.next);\n    head.next.next = head;     // the node after me now points back to me\n    head.next = null;          // I become the tail\n    return newHead;\n}",
          explanation: "Elegant, but it uses O(n) call-stack space and can overflow on very long lists, so mention that trade-off in interviews."
        },
        {
          type: "practice",
          title: "Practice Problems",
          problems: [{ id: "2", title: "Add Two Numbers", difficulty: "Medium" }]
        },
        {
          type: "quickCheck",
          question: "What does the iterative reversal return?",
          options: ["head", "curr", "prev", "null"],
          answer: 2,
          explanation: "When curr becomes null, prev points to the old tail, which is the new head."
        },
        {
          type: "takeaways",
          items: ["Save next, reverse the link, advance prev, advance curr.", "Iterative: O(1) space. Recursive: O(n) stack space."]
        }
      ]
    }
  },
  {
    id: "fast-and-slow-pointers",
    slug: "fast-and-slow-pointers",
    title: "Fast and Slow Pointers: Middle Node and Cycle Detection",
    description: "Floyd's tortoise and hare for finding the middle and detecting cycles in O(1) space.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Middle of the List",
          language: "java",
          code: "static ListNode middle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;          // 1 step\n        fast = fast.next.next;     // 2 steps\n    }\n    return slow;\n}\n// 1..5 -> 3,   1..6 -> 4 (the second middle)",
          explanation: "When fast reaches the end, slow has covered half the distance."
        },
        {
          type: "code",
          title: "Cycle Detection (Floyd's algorithm)",
          language: "java",
          code: "static boolean hasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;    // fast lapped slow inside a loop\n    }\n    return false;                          // fast hit the end, so there's no loop\n}",
          explanation: "In a cycle, the gap between fast and slow shrinks by 1 each step, so they must meet. O(n) time, O(1) space, compared with O(n) space for a HashSet of visited nodes."
        },
        {
          type: "think",
          question: "After they meet, how do you find where the cycle starts?",
          answerReveal: "Reset one pointer to head and move both one step at a time; they meet at the cycle's entrance. The distance from head to the start equals the distance from the meeting point to the start (going round the loop)."
        },
        {
          type: "quickCheck",
          question: "Why check fast != null && fast.next != null?",
          options: ["To speed it up", "Because fast moves 2 steps, so both nodes must exist", "To detect the cycle", "It's optional"],
          answer: 1,
          explanation: "fast.next.next would throw a NullPointerException if fast or fast.next is null."
        },
        {
          type: "takeaways",
          items: ["Slow moves 1 step, fast moves 2: middle node, cycle detection, cycle start.", "O(1) space alternative to hashing visited nodes."]
        }
      ]
    }
  },
  {
    id: "merge-sorted-lists",
    slug: "merge-sorted-lists",
    title: "Merging Sorted Lists",
    description: "Merge two sorted lists with a dummy node, the building block of merge sort on lists and k-way merges.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "Merge Two Sorted Lists",
          language: "java",
          code: "static ListNode mergeTwo(ListNode a, ListNode b) {\n    ListNode dummy = new ListNode(0), tail = dummy;\n    while (a != null && b != null) {\n        if (a.val <= b.val) { tail.next = a; a = a.next; }\n        else                { tail.next = b; b = b.next; }\n        tail = tail.next;\n    }\n    tail.next = (a != null) ? a : b;     // attach whatever remains\n    return dummy.next;\n}\n// 1->2->4 + 1->3->4  ->  1->1->2->3->4->4",
          explanation: "O(n + m) time and O(1) extra space: nodes are re-linked, not copied."
        },
        {
          type: "text",
          title: "Building On It",
          content: "Sort a linked list: find the middle (fast/slow), split, sort each half recursively, then merge. That's O(n log n), and it doesn't need random access.\nMerge k sorted lists: use a min-heap of the k current heads, giving O(N log k) (covered in the Heaps module)."
        },
        {
          type: "practice",
          title: "Practice Problems",
          problems: [{ id: "21", title: "Merge Two Sorted Lists", difficulty: "Easy" }]
        },
        {
          type: "quickCheck",
          question: "After the loop ends, why can the remaining list be attached directly?",
          options: ["It's empty", "It's already sorted and every value is ≥ what's been merged", "Java sorts it", "It must be reversed first"],
          answer: 1,
          explanation: "The leftover list is sorted, and all its values are at least as large as the last merged node."
        },
        {
          type: "takeaways",
          items: ["Dummy + tail pointer is the standard way to build a new list.", "Merge is the core of list merge sort and k-way merging."]
        }
      ]
    }
  }
];

export const stackLessons: CourseLesson[] = [
  {
    id: "stack-basics",
    slug: "stack-basics",
    title: "Stacks: LIFO, Java Deque and Where Stacks Appear",
    description: "Push/pop/peek in O(1), why to use ArrayDeque instead of Stack, and real uses of stacks.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "LIFO",
          content: "A stack is Last-In, First-Out, like a pile of plates. Three operations, all O(1): push (add to the top), pop (remove from the top), peek (look at the top).\n\nWhere stacks appear: the function call stack, undo/redo, browser back navigation, expression parsing, DFS, and matching brackets."
        },
        {
          type: "code",
          title: "Stacks in Java",
          language: "java",
          code: "Deque<Integer> stack = new ArrayDeque<>();   // preferred\nstack.push(1);\nstack.push(2);\nstack.push(3);\nstack.peek();     // 3\nstack.pop();      // 3\nstack.pop();      // 2\nstack.isEmpty();  // false (1 is left)",
          explanation: "java.util.Stack extends Vector (synchronized and legacy). ArrayDeque is faster and is the recommended stack and queue implementation."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Calling pop() or peek() on an empty ArrayDeque: pop() throws NoSuchElementException and peek() returns null. Check isEmpty() first.",
            "ArrayDeque doesn't allow null elements.",
            "Iterating a Deque used as a stack goes from top to bottom, not in insertion order."
          ]
        },
        {
          type: "quickCheck",
          question: "Push 1, 2, 3, pop once, push 4. What does peek() return?",
          options: ["1", "2", "3", "4"],
          answer: 3,
          explanation: "After popping 3, the stack is [1, 2]; pushing 4 makes 4 the top."
        },
        {
          type: "takeaways",
          items: ["Stack = LIFO with O(1) push, pop and peek.", "Use ArrayDeque, not Stack, in Java."]
        }
      ]
    }
  },
  {
    id: "balanced-parentheses",
    slug: "balanced-parentheses",
    title: "Balanced Parentheses",
    description: "The classic stack problem: verify that every bracket is closed in the correct order.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "Valid Parentheses",
          language: "java",
          code: "static boolean isValid(String s) {\n    Deque<Character> stack = new ArrayDeque<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(') stack.push(')');          // push the EXPECTED closer\n        else if (c == '[') stack.push(']');\n        else if (c == '{') stack.push('}');\n        else if (stack.isEmpty() || stack.pop() != c) return false;\n    }\n    return stack.isEmpty();                     // leftover openers -> invalid\n}\n// \"({[]})\" -> true   \"(]\" -> false   \"((\" -> false   \")\" -> false",
          explanation: "Pushing the expected closing bracket makes the check a single comparison. O(n) time, O(n) space."
        },
        {
          type: "list",
          title: "The Three Ways to Fail",
          items: [
            "**Wrong type**: `(]`: the popped expectation doesn't match.",
            "**Closer with nothing open**: `)`: the stack is empty when a closer arrives.",
            "**Unclosed opener**: `((`: the stack isn't empty at the end."
          ]
        },
        {
          type: "practice",
          title: "Practice Problems",
          problems: [{ id: "20", title: "Valid Parentheses", difficulty: "Easy" }]
        },
        {
          type: "quickCheck",
          question: "If the input contains only '(' and ')', what simpler structure could replace the stack?",
          options: ["A queue", "An integer counter", "A HashMap", "A sorted array"],
          answer: 1,
          explanation: "Increment on '(' and decrement on ')'. It's invalid if the counter ever goes negative or doesn't end at 0. With several bracket types you need the stack."
        },
        {
          type: "takeaways",
          items: ["Push openers (or their expected closers), pop on closers and compare.", "Check for an empty stack during the scan and at the end."]
        }
      ]
    }
  },
  {
    id: "monotonic-stack",
    slug: "monotonic-stack",
    title: "Monotonic Stack: Next Greater Element",
    description: "Keep a stack in sorted order to answer 'next greater/smaller' questions for every element in O(n).",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Idea",
          content: "For each element, find the next element to its right that is larger. Brute force is O(n²). A monotonic stack keeps the indices still waiting for an answer, with their values decreasing from bottom to top. When a bigger value arrives, it is the answer for every smaller waiting element, so pop them."
        },
        {
          type: "code",
          title: "Next Greater Element",
          language: "java",
          code: "static int[] nextGreater(int[] nums) {\n    int[] res = new int[nums.length];\n    Arrays.fill(res, -1);                       // default: no greater element\n    Deque<Integer> stack = new ArrayDeque<>();  // indices; their values are decreasing\n    for (int i = 0; i < nums.length; i++) {\n        while (!stack.isEmpty() && nums[stack.peek()] < nums[i])\n            res[stack.pop()] = nums[i];         // nums[i] answers everything smaller below it\n        stack.push(i);\n    }\n    return res;\n}\n// {2, 1, 2, 4, 3} -> {4, 2, 4, -1, -1}",
          explanation: "Each index is pushed and popped at most once, so it's O(n) overall despite the nested while."
        },
        {
          type: "dryRun",
          title: "Trace on {2, 1, 2, 4, 3}",
          iterations: [
            { step: "i=0 (2)", variables: { stack: "[0]", res: "-1 -1 -1 -1 -1" }, description: "Push." },
            { step: "i=1 (1)", variables: { stack: "[0, 1]" }, description: "1 < 2, so just push." },
            { step: "i=2 (2)", variables: { popped: "1 → res[1] = 2", stack: "[0, 2]" }, description: "2 > 1: answer index 1. 2 isn't > 2, so stop." },
            { step: "i=3 (4)", variables: { popped: "2, 0 → res = 4", stack: "[3]" }, description: "4 answers both waiting 2s." },
            { step: "i=4 (3)", variables: { stack: "[3, 4]" }, description: "No greater element remains; both keep -1." }
          ]
        },
        {
          type: "list",
          title: "Problems Solved by the Same Idea",
          items: [
            "Daily temperatures (days until a warmer day): store `i - index` instead of the value.",
            "Stock span, previous smaller element (just change the comparison or the direction).",
            "Largest rectangle in a histogram, trapping rain water (Hard; based on 'previous/next smaller')."
          ]
        },
        {
          type: "quickCheck",
          question: "Why is the monotonic-stack solution O(n) even though it has a while loop inside a for loop?",
          options: ["The while loop runs at most once", "Every index is pushed once and popped at most once", "Java optimizes it", "It isn't; it's O(n²)"],
          answer: 1,
          explanation: "Amortized analysis: at most n pushes and at most n pops in total."
        },
        {
          type: "takeaways",
          items: ["'Next/previous greater/smaller' → monotonic stack.", "Store indices, not values, so you can compute distances too.", "Amortized O(n): each element enters and leaves once."]
        }
      ]
    }
  },
  {
    id: "expression-evaluation",
    slug: "expression-evaluation",
    title: "Evaluating Expressions: Postfix (Reverse Polish) Notation",
    description: "How stacks evaluate expressions, infix vs postfix, and the operand-order trap for - and /.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Infix vs Postfix",
          content: "Infix: (2 + 1) * 3. It needs precedence rules and parentheses.\nPostfix (Reverse Polish Notation): 2 1 + 3 *. Operators come after their operands, and no parentheses are needed.\nCompilers and calculators convert infix to postfix (Dijkstra's shunting-yard algorithm, using an operator stack), then evaluate the postfix form with an operand stack."
        },
        {
          type: "code",
          title: "Evaluate Reverse Polish Notation",
          language: "java",
          code: "static int evalRPN(String[] tokens) {\n    Deque<Integer> st = new ArrayDeque<>();\n    for (String t : tokens) {\n        switch (t) {\n            case \"+\": st.push(st.pop() + st.pop()); break;\n            case \"*\": st.push(st.pop() * st.pop()); break;\n            case \"-\": { int b = st.pop(), a = st.pop(); st.push(a - b); break; }   // order matters!\n            case \"/\": { int b = st.pop(), a = st.pop(); st.push(a / b); break; }\n            default:  st.push(Integer.parseInt(t));\n        }\n    }\n    return st.pop();\n}\n// [\"2\",\"1\",\"+\",\"3\",\"*\"] -> 9          ((2 + 1) * 3)\n// [\"4\",\"13\",\"5\",\"/\",\"+\"] -> 6         (4 + 13 / 5)",
          explanation: "The first pop is the RIGHT operand. Getting a − b backwards is the most common bug."
        },
        {
          type: "quickCheck",
          question: "Evaluate the postfix expression: 5 1 2 + 4 * + 3 -",
          options: ["14", "12", "17", "8"],
          answer: 0,
          explanation: "1 + 2 = 3; 3 × 4 = 12; 5 + 12 = 17; 17 − 3 = 14."
        },
        {
          type: "takeaways",
          items: ["Postfix needs no precedence rules or parentheses; evaluate it with one stack.", "For − and /, the first value popped is the right operand."]
        }
      ]
    }
  }
];

export const queueLessons: CourseLesson[] = [
  {
    id: "queue-basics-circular-queue",
    slug: "queue-basics-circular-queue",
    title: "Queues and Circular Queues",
    description: "FIFO operations, Java's Queue interface, and implementing a fixed-size circular buffer.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "FIFO",
          content: "A queue is First-In, First-Out, like a line at a ticket counter. Enqueue at the back and dequeue at the front, both O(1). Queues appear in BFS, task scheduling, printer spooling, message brokers and rate limiters."
        },
        {
          type: "code",
          title: "Queues in Java",
          language: "java",
          code: "Queue<Integer> q = new ArrayDeque<>();\nq.offer(1); q.offer(2); q.offer(3);   // enqueue\nq.peek();   // 1  (front)\nq.poll();   // 1  (dequeue)\nq.size();   // 2\n// offer/poll/peek return false/null on failure; add/remove/element throw exceptions",
          explanation: "Use ArrayDeque (or LinkedList) for a plain queue, and PriorityQueue when elements should come out by priority instead of arrival order."
        },
        {
          type: "code",
          title: "Circular Queue (fixed capacity, array-based)",
          language: "java",
          code: "class CircularQueue {\n    private final int[] data;\n    private int head = 0, size = 0;\n    CircularQueue(int k) { data = new int[k]; }\n\n    boolean enqueue(int x) {\n        if (size == data.length) return false;            // full\n        data[(head + size) % data.length] = x;            // wrap around\n        size++;\n        return true;\n    }\n    Integer dequeue() {\n        if (size == 0) return null;                       // empty\n        int x = data[head];\n        head = (head + 1) % data.length;\n        size--;\n        return x;\n    }\n}\n// capacity 3: enqueue 1,2,3 -> enqueue(4) fails; dequeue() -> 1; enqueue(4) now succeeds",
          explanation: "A plain array queue wastes the slots in front of the head after dequeues. The modulo wrap-around reuses them. Tracking size avoids the 'full or empty?' ambiguity when head == tail."
        },
        {
          type: "quickCheck",
          question: "In a circular queue with capacity 5, head = 3 and size = 4. Where does the next enqueue go?",
          options: ["Index 7", "Index 2", "Index 0", "It's full"],
          answer: 1,
          explanation: "(head + size) % capacity = (3 + 4) % 5 = 2."
        },
        {
          type: "takeaways",
          items: ["Queue = FIFO, O(1) offer and poll.", "A circular queue reuses array slots with modulo arithmetic.", "Use offer/poll/peek to avoid exceptions."]
        }
      ]
    }
  },
  {
    id: "deque-sliding-window-maximum",
    slug: "deque-sliding-window-maximum",
    title: "Deque: Sliding Window Maximum",
    description: "A double-ended queue kept in decreasing order gives the max of every window in O(n).",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Problem",
          content: "Return the maximum of every window of size k. Brute force is O(n·k). A deque of indices whose values decrease from front to back keeps the current window's maximum at the front."
        },
        {
          type: "code",
          title: "Sliding Window Maximum",
          language: "java",
          code: "static int[] maxSlidingWindow(int[] nums, int k) {\n    int[] res = new int[nums.length - k + 1];\n    Deque<Integer> dq = new ArrayDeque<>();            // indices, values decreasing\n    for (int i = 0; i < nums.length; i++) {\n        if (!dq.isEmpty() && dq.peekFirst() <= i - k)\n            dq.pollFirst();                             // front left the window\n        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i])\n            dq.pollLast();                              // smaller values can never be a max again\n        dq.offerLast(i);\n        if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];\n    }\n    return res;\n}\n// {1, 3, -1, -3, 5, 3, 6, 7}, k = 3 -> {3, 3, 5, 5, 6, 7}",
          explanation: "A value smaller than a newer value can never be a window maximum again (the newer one stays in the window longer), so it's discarded. Each index enters and leaves once: O(n)."
        },
        {
          type: "quickCheck",
          question: "Why does the deque store indices instead of values?",
          options: ["Indices use less memory", "To tell when the front element has left the window", "Values can't go in a deque", "To sort them"],
          answer: 1,
          explanation: "The check `peekFirst() <= i - k` needs positions to expire elements."
        },
        {
          type: "takeaways",
          items: ["A monotonic deque = a monotonic stack that can also drop elements from the front.", "Sliding window max/min in O(n)."]
        }
      ]
    }
  },
  {
    id: "queue-using-stacks",
    slug: "queue-using-stacks",
    title: "Implementing a Queue With Two Stacks",
    description: "A classic design question showing amortized O(1) operations.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "Queue Using Two Stacks",
          language: "java",
          code: "class MyQueue {\n    private final Deque<Integer> in = new ArrayDeque<>(), out = new ArrayDeque<>();\n\n    void push(int x) { in.push(x); }\n\n    int pop()  { peek(); return out.pop(); }\n\n    int peek() {\n        if (out.isEmpty())\n            while (!in.isEmpty()) out.push(in.pop());   // reverse the order exactly once\n        return out.peek();\n    }\n\n    boolean empty() { return in.isEmpty() && out.isEmpty(); }\n}\n// push 1, push 2 -> peek() = 1, pop() = 1",
          explanation: "Pouring `in` into `out` reverses the order, so the oldest element ends up on top of `out`. Only refill `out` when it's empty."
        },
        {
          type: "text",
          title: "Amortized Analysis",
          content: "A single pop can cost O(n) when it triggers a transfer. But each element is moved from in to out at most once in its lifetime, so n operations cost O(n) in total, which is amortized O(1) per operation. The mirror question, a stack using queues, needs O(n) push or pop."
        },
        {
          type: "quickCheck",
          question: "Push 1, 2, 3; pop; push 4; pop. What does the second pop return?",
          options: ["1", "2", "3", "4"],
          answer: 1,
          explanation: "FIFO order: the first pop returns 1, the second returns 2 (it's still in `out` from the first transfer)."
        },
        {
          type: "takeaways",
          items: ["Two stacks = a queue: transfer only when the output stack is empty.", "Amortized O(1): each element moves once."]
        }
      ]
    }
  }
];
