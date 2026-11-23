import type { LessonQuestions } from './index';

export const dsaQuestions: LessonQuestions = {
  "big-o-notation": [
    { q: "What is the simplified Big-O of 3n² + 100n + 7?", o: ["O(n²)", "O(3n²)", "O(n² + n)", "O(100n)"], a: 0, e: "Drop constants and lower-order terms; n² dominates." },
    { q: "Appending to an ArrayList is O(1) amortized. What does 'amortized' mean here?", o: ["Averaged over a long sequence of appends, each costs O(1)", "Every single append is O(1)", "It's the average over random inputs", "It's the best case"], a: 0, e: "Occasional O(n) resizes are spread across many cheap appends." },
    { q: "With n = 10⁵, which complexity will likely time out at about 10⁸ operations per second?", o: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], a: 0, e: "10¹⁰ operations takes around 100 seconds; the others finish in milliseconds." },
  ],
  "analyzing-time-complexity": [
    { q: "What is the complexity of: for (i = 1; i < n; i *= 2)?", o: ["O(log n)", "O(n)", "O(n log n)", "O(√n)"], a: 0, e: "i doubles each iteration, reaching n after about log₂ n steps." },
    { q: "What does T(n) = 2T(n/2) + O(n) solve to?", o: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], a: 0, e: "This is merge sort's recurrence; each of log n levels does O(n) work." },
    { q: "for (size = n; size > 0; size /= 2) { for (j = 0; j < size; j++) {...} } runs in what time?", o: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], a: 0, e: "The inner work sums to n + n/2 + n/4 + ... < 2n." },
  ],
  "space-complexity": [
    { q: "What is the space complexity of recursive DFS on a balanced binary tree of n nodes?", o: ["O(log n)", "O(1)", "O(n²)", "O(n log n)"], a: 0, e: "The call stack holds one frame per level; a balanced tree has about log n levels." },
    { q: "Why can a recursive solution throw StackOverflowError on a 100,000-node linked list in Java?", o: ["Each call adds a stack frame and the stack has a fixed size", "Java has no recursion limit", "The heap is full", "Garbage collection fails"], a: 0, e: "Recursion depth equals list length here, and Java doesn't optimize tail calls." },
    { q: "Two Sum with a hash map trades what?", o: ["O(n) extra space for O(n) time", "Time for less code", "Correctness for speed", "Nothing; it's strictly better in every way"], a: 0, e: "The brute force is O(n²) time with O(1) space; the map costs memory." },
  ],
  "problem-solving-framework": [
    { q: "Constraints say n ≤ 20. Which approach is likely intended?", o: ["Exponential search such as subsets or bitmask DP", "Only O(log n) solutions", "O(n³) only", "A single linear scan only"], a: 0, e: "2²⁰ is about a million, so exponential approaches fit." },
    { q: "What should you do first in a coding interview?", o: ["Restate the problem and ask clarifying questions", "Start coding the optimal solution", "Write test cases only", "Ask for the answer"], a: 0, e: "Misunderstanding the problem wastes everything after it." },
    { q: "A problem asks for the shortest path in an unweighted grid. Which tool fits?", o: ["BFS", "DFS", "Binary search", "Heap sort"], a: 0, e: "BFS explores in order of distance, so the first arrival is the shortest path." },
  ],
  "two-sum-lesson": [
    { q: "In the one-pass hash map solution, why check for the complement before inserting the current number?", o: ["So an element isn't paired with itself", "To save memory", "To sort the array", "It doesn't matter at all"], a: 0, e: "With [3, 4] and target 6, inserting 3 first would wrongly match 3 with itself." },
    { q: "Which approach solves Two Sum on a sorted array in O(1) extra space?", o: ["Two pointers from both ends", "Hash map", "Binary search tree", "Brute force with a set"], a: 0, e: "Move the left pointer up if the sum is too small, the right pointer down if too large." },
    { q: "What is the time complexity of Three Sum using sort plus two pointers?", o: ["O(n²)", "O(n)", "O(n³)", "O(n log n)"], a: 0, e: "Sorting costs O(n log n); fixing each element and scanning the rest costs O(n²)." },
  ],
  "arrays-lesson-2": [
    { q: "Why is array access by index O(1)?", o: ["The address is computed as base + index × element size", "Arrays are hash tables", "The CPU caches every element", "Java searches from both ends"], a: 0, e: "Contiguous storage makes any element's address a single calculation." },
    { q: "What is the time to insert at the start of an array of n elements?", o: ["O(n)", "O(1)", "O(log n)", "O(n log n)"], a: 0, e: "Every element must shift one position right." },
    { q: "Why can comparing two Integer objects with == fail in Java?", o: ["It compares references, and only values from -128 to 127 are cached", "Integer has no equals method", "== always throws", "Integers are primitives"], a: 0, e: "Use .equals() or unbox to int for value comparison." },
  ],
  "arrays-lesson-3": [
    { q: "Why use mid = lo + (hi − lo) / 2 instead of (lo + hi) / 2?", o: ["To avoid integer overflow", "It's faster", "It rounds up", "It handles negatives"], a: 0, e: "lo + hi can exceed the int range for large indices." },
    { q: "In [1, 2, 2, 2, 3], what index does lower bound for 2 return?", o: ["1", "2", "3", "0"], a: 0, e: "Lower bound finds the first index with value ≥ target." },
    { q: "Which phrase suggests 'binary search on the answer'?", o: ["Minimize the maximum", "Count all subarrays", "Reverse the list", "Find all permutations"], a: 0, e: "A monotonic feasibility check over candidate answers allows binary search." },
  ],
  "arrays-lesson-4": [
    { q: "Rotating [1,2,3,4,5,6,7] right by 3 with the reversal method: what's the first step?", o: ["Reverse the whole array", "Reverse the first 3 elements", "Reverse the last 3 elements", "Sort the array"], a: 0, e: "Reverse all, then the first k, then the rest." },
    { q: "In Container With Most Water, which pointer should move?", o: ["The one at the shorter line", "The one at the taller line", "Both always", "Neither"], a: 0, e: "Moving the taller line can't increase the area, since the shorter line limits height." },
    { q: "What does the Dutch national flag algorithm sort in one pass?", o: ["An array of 0s, 1s and 2s", "Strings by length", "Any integers", "Linked lists"], a: 0, e: "Three pointers partition the array into three regions." },
  ],
  "arrays-lesson-5": [
    { q: "Which sort is stable?", o: ["Merge sort", "Quick sort", "Heap sort", "Selection sort (standard)"], a: 0, e: "Merge sort keeps equal elements in their original order when it takes from the left half on ties." },
    { q: "When does quick sort hit O(n²)?", o: ["When pivots repeatedly split the array very unevenly", "On random input", "When the array has duplicates only", "Never"], a: 0, e: "Always picking the first element of sorted input gives partitions of size n − 1 and 0." },
    { q: "Why can't a comparison sort beat Ω(n log n) in the worst case?", o: ["A decision tree must distinguish n! orderings", "Computers are too slow", "Memory is limited", "Recursion is expensive"], a: 0, e: "A binary tree with n! leaves has height at least log₂(n!) ≈ n log n." },
  ],
  "arrays-lesson-6": [
    { q: "With prefix[0] = 0, how do you get the sum of a[l..r] inclusive?", o: ["prefix[r + 1] − prefix[l]", "prefix[r] − prefix[l]", "prefix[r] + prefix[l]", "prefix[l + 1] − prefix[r]"], a: 0, e: "prefix[i] is the sum of the first i elements." },
    { q: "Why initialize Kadane's algorithm with a[0] rather than 0?", o: ["So arrays of all negative numbers return the largest element", "To save memory", "It's faster", "To handle empty arrays"], a: 0, e: "Starting at 0 would wrongly return 0 when every element is negative." },
    { q: "Why does the variable sliding window fail for subarray sum = k with negative numbers?", o: ["Expanding the window can decrease the sum, so shrinking isn't monotonic", "Negative numbers can't be summed", "Windows need sorted input", "It works fine"], a: 0, e: "Use prefix sums with a hash map instead." },
  ],
  "strings-in-java": [
    { q: "Why is concatenating strings with += in a loop O(n²)?", o: ["Each += copies the whole string into a new object", "Strings are linked lists", "The JVM locks the string", "It isn't; it's O(n)"], a: 0, e: "StringBuilder appends to one growing buffer in O(n) total." },
    { q: "What does 'c' − 'a' give for c = 'd'?", o: ["3", "4", "100", "'d'"], a: 0, e: "Characters are numbers; 'd' is 3 after 'a'." },
    { q: "How should you compare the contents of two Java strings?", o: ["s1.equals(s2)", "s1 == s2", "s1.compareTo(s2) == 1", "s1.hashCode() > s2.hashCode()"], a: 0, e: "== compares references; equals compares characters." },
  ],
  "palindromes-and-anagrams": [
    { q: "How many centers does expand-around-center check for a string of length n?", o: ["2n − 1", "n", "n²", "n / 2"], a: 0, e: "n single-character centers plus n − 1 gaps for even-length palindromes." },
    { q: "Why is counting characters better than sorting for checking anagrams?", o: ["Counting is O(n); sorting is O(n log n)", "Sorting can't compare strings", "Counting uses no memory", "They're identical"], a: 0, e: "A 26-element count array works in linear time for lowercase input." },
    { q: "What signature groups 'eat', 'tea' and 'ate' together?", o: ["Their sorted letters, 'aet'", "Their length", "Their first letter", "Their hash code"], a: 0, e: "All anagrams share the same sorted letters or character counts." },
  ],
  "sliding-window-on-strings": [
    { q: "What is the longest substring without repeating characters in 'abcabcbb'?", o: ["3", "2", "4", "8"], a: 0, e: "The window grows to 'abc', then each repeat forces the left edge forward, so no window exceeds length 3." },
    { q: "Why is the sliding window O(n) despite a nested while loop?", o: ["Each character enters and leaves the window at most once", "The inner loop runs once", "Strings are short", "Java optimizes it"], a: 0, e: "Both pointers move at most n times in total." },
    { q: "How do you count substrings with exactly k distinct characters?", o: ["atMost(k) − atMost(k − 1)", "atMost(k) + atMost(k − 1)", "atMost(k) only", "A single window"], a: 0, e: "'Exactly' isn't monotonic, but 'at most' is, so subtract." },
  ],
  "linked-list-basics": [
    { q: "Why use a dummy head node?", o: ["It removes special cases when the head changes", "It speeds up traversal", "It saves memory", "It sorts the list"], a: 0, e: "Every real node then has a predecessor, including the first." },
    { q: "When inserting newNode after prev, which line must come first?", o: ["newNode.next = prev.next", "prev.next = newNode", "prev = newNode", "newNode = null"], a: 0, e: "Overwriting prev.next first loses the rest of the list." },
    { q: "What is the cost of accessing the k-th node of a singly linked list?", o: ["O(k)", "O(1)", "O(log k)", "O(k²)"], a: 0, e: "You must follow k next pointers from the head." },
  ],
  "reverse-a-linked-list": [
    { q: "In iterative reversal, what does the function return at the end?", o: ["prev", "cur", "head", "next"], a: 0, e: "When cur becomes null, prev points to the new head." },
    { q: "What extra space does recursive reversal use?", o: ["O(n) for the call stack", "O(1)", "O(log n)", "O(n²)"], a: 0, e: "One frame per node, which can overflow on long lists." },
    { q: "In the recursive version, what does head.next.next = head do?", o: ["Makes the node after head point back to head", "Deletes head", "Moves head to the end without linking", "Creates a new node"], a: 0, e: "Then head.next = null breaks the old link to avoid a cycle." },
  ],
  "fast-and-slow-pointers": [
    { q: "In Floyd's cycle detection, why can't the fast pointer skip over the slow one inside a cycle?", o: ["The gap shrinks by exactly one each step", "The fast pointer moves one step", "The list is sorted", "It can skip"], a: 0, e: "Gaining one node per step means the gap reaches zero exactly." },
    { q: "After the pointers meet, how do you find the cycle's entry?", o: ["Reset one pointer to head and move both one step at a time", "Move both two steps", "Count all nodes", "Reverse the list"], a: 0, e: "From a = k·c − b, both pointers reach the entry after a steps." },
    { q: "How do you remove the n-th node from the end in one pass?", o: ["Move a leader n steps ahead, then move both until the leader reaches the end", "Reverse the list twice", "Use binary search", "Sort the list"], a: 0, e: "The follower then sits just before the target when using a dummy head." },
  ],
  "merge-sorted-lists": [
    { q: "What extra space does iterative merging of two sorted linked lists use?", o: ["O(1)", "O(n)", "O(n + m)", "O(log n)"], a: 0, e: "It relinks existing nodes instead of copying." },
    { q: "Why is merging k lists one at a time slow?", o: ["Early nodes are re-scanned in every later merge, giving O(N·k)", "It uses recursion", "It needs a heap", "It isn't stable"], a: 0, e: "A heap or pairwise merging achieves O(N log k)." },
    { q: "To merge two sorted arrays in place when the first has spare space at the end, fill from which end?", o: ["The back", "The front", "The middle", "Either"], a: 0, e: "Filling from the front would overwrite unread elements of the first array." },
  ],
  "stack-basics": [
    { q: "Which Java class is recommended for a stack?", o: ["ArrayDeque", "Stack", "Vector", "LinkedHashMap"], a: 0, e: "Stack extends synchronized Vector; ArrayDeque is faster and LIFO-focused." },
    { q: "How does a min stack return the minimum in O(1)?", o: ["A second stack stores the minimum so far at each level", "It sorts on every push", "It scans the stack", "It uses a heap"], a: 0, e: "Push min(x, currentMin) alongside each element." },
    { q: "Simplify the path '/a/./b/../../c/'. What's the result?", o: ["/c", "/a/c", "/a/b/c", "/"], a: 0, e: "'.' is ignored, each '..' pops: a, b pushed, then two pops, then c." },
  ],
  "balanced-parentheses": [
    { q: "Which string passes every check during the scan but is still invalid?", o: ["'(('", "'())'", "'(]'", "'()'"], a: 0, e: "Unclosed brackets remain on the stack, so the final isEmpty check is required." },
    { q: "With only '(' and ')', what can replace the stack?", o: ["A counter that must never go negative and must end at zero", "A queue", "A hash map", "Nothing"], a: 0, e: "One bracket type needs only a depth count." },
    { q: "In longest valid parentheses, why push -1 onto the stack first?", o: ["It marks the base before the first character for length calculation", "To avoid empty stack errors only", "To count opening brackets", "It's not needed"], a: 0, e: "Lengths are measured from the last unmatched position." },
  ],
  "monotonic-stack": [
    { q: "For next greater element, what order does the stack keep from bottom to top?", o: ["Decreasing values", "Increasing values", "Random order", "Sorted indices only"], a: 0, e: "Any larger incoming element pops and resolves smaller ones." },
    { q: "Why is the monotonic stack algorithm O(n)?", o: ["Each index is pushed and popped at most once", "The inner loop never runs", "It sorts first", "It uses binary search"], a: 0, e: "Total pops are bounded by n across the whole scan." },
    { q: "Largest rectangle in a histogram needs, for each bar, which two values?", o: ["Previous smaller and next smaller bars", "Previous and next greater bars", "The tallest and shortest bars", "Sum of heights"], a: 0, e: "The bar's full-height rectangle extends between its nearest shorter neighbours." },
  ],
  "expression-evaluation": [
    { q: "Evaluate the postfix expression '5 3 −'.", o: ["2", "−2", "8", "15"], a: 0, e: "Pop 3 (right operand), then 5 (left): 5 − 3 = 2." },
    { q: "What is '3 + 4 * 2' in postfix?", o: ["3 4 2 * +", "3 4 + 2 *", "+ 3 * 4 2", "3 + 4 2 *"], a: 0, e: "Multiplication binds tighter, so it's applied before the addition." },
    { q: "Which algorithm converts infix to postfix?", o: ["Shunting-yard", "Kadane's", "Dijkstra's shortest path", "Floyd's"], a: 0, e: "Dijkstra's shunting-yard algorithm uses an operator stack with precedence rules." },
  ],
  "queue-basics-circular-queue": [
    { q: "In a circular queue of capacity 5 with front = 3 and size = 4, where does the next element go?", o: ["Index 2", "Index 7", "Index 4", "Index 0"], a: 0, e: "(front + size) % capacity = 7 % 5 = 2." },
    { q: "Why does a naive array queue report 'full' while space remains?", o: ["front and rear only move forward, leaving freed slots unused", "Arrays can't hold queues", "Java limits array size", "The queue is a stack"], a: 0, e: "A circular buffer wraps indices to reuse freed slots." },
    { q: "Which Queue method returns null instead of throwing when the queue is empty?", o: ["poll()", "remove()", "element()", "add()"], a: 0, e: "offer, poll and peek return special values; add, remove and element throw." },
  ],
  "deque-sliding-window-maximum": [
    { q: "Why can an element smaller than a later element be removed from the deque?", o: ["It can never be the maximum while the larger, newer element is in the window", "It's a duplicate", "It's out of the window", "Deques can't hold small values"], a: 0, e: "The newer, larger element outlives it and dominates it." },
    { q: "What does the deque store in the sliding window maximum solution?", o: ["Indices with decreasing values", "Values in increasing order", "The window's sum", "All elements"], a: 0, e: "Indices let you detect expired elements; values decrease from front to back." },
    { q: "What is the time complexity of the monotonic deque solution?", o: ["O(n)", "O(n log k)", "O(n·k)", "O(k)"], a: 0, e: "Each index is added and removed at most once." },
  ],
  "queue-using-stacks": [
    { q: "When should elements move from the in-stack to the out-stack?", o: ["Only when the out-stack is empty", "After every push", "After every pop", "Never"], a: 0, e: "Moving earlier would put newer elements above older ones and break FIFO order." },
    { q: "What is the amortized cost per queue operation?", o: ["O(1)", "O(n)", "O(log n)", "O(n²)"], a: 0, e: "Each element is pushed and popped at most twice over its lifetime." },
    { q: "Implementing a stack with one queue makes which operation O(n)?", o: ["push, which rotates the queue", "pop", "top", "isEmpty"], a: 0, e: "After adding, rotate the other elements behind the new one so it's at the front." },
  ],
  "how-hashmap-works": [
    { q: "What is the default load factor threshold in Java's HashMap?", o: ["0.75", "0.5", "1.0", "0.9"], a: 0, e: "The table doubles when entries exceed 75% of the bucket count." },
    { q: "Since Java 8, what happens when one bucket gets more than 8 entries (with 64+ buckets)?", o: ["The list becomes a red-black tree", "The map throws an exception", "The entries are discarded", "The map shrinks"], a: 0, e: "Treeification caps the bucket's worst case at O(log n)." },
    { q: "If you override equals but not hashCode, what can go wrong?", o: ["Equal keys land in different buckets, so get() can't find them", "Nothing", "HashMap throws on put", "Keys become immutable"], a: 0, e: "Equal objects must have equal hash codes for hashing to work." },
  ],
  "hashing-patterns": [
    { q: "In longest consecutive sequence, a number starts a run only if what holds?", o: ["num − 1 isn't in the set", "num + 1 isn't in the set", "num is even", "num is the smallest overall"], a: 0, e: "Counting upward only from run starts keeps total work O(n)." },
    { q: "Which algorithm finds a majority element in O(1) extra space?", o: ["Boyer-Moore voting", "Kadane's", "Floyd's", "Dijkstra's"], a: 0, e: "It cancels pairs of different elements; the majority survives." },
    { q: "What key groups words that are anagrams of each other?", o: ["Sorted letters or a character-count signature", "Word length", "First letter", "Reversed word"], a: 0, e: "All anagrams share the same signature." },
  ],
  "prefix-sum-with-hashmap": [
    { q: "Why seed the prefix-count map with {0: 1}?", o: ["To count subarrays starting at index 0", "To avoid null keys", "To speed up lookups", "It's not needed"], a: 0, e: "It represents the empty prefix before the first element." },
    { q: "For [1, 2, 3] and k = 3, how many subarrays sum to k?", o: ["2", "1", "3", "0"], a: 0, e: "Prefix sums are 1, 3 and 6; the subarrays [1, 2] and [3] both sum to 3." },
    { q: "To find the longest subarray with equal 0s and 1s, what transformation helps?", o: ["Replace 0 with −1 and find the longest subarray summing to 0", "Sort the array", "Reverse the array", "Count 1s only"], a: 0, e: "Balanced subarrays then sum to zero." },
  ],
  "binary-tree-traversals": [
    { q: "Which traversal visits a BST's values in sorted order?", o: ["In-order", "Pre-order", "Post-order", "Level-order"], a: 0, e: "Left, node, right follows the BST ordering." },
    { q: "Which traversal suits deleting a tree?", o: ["Post-order", "Pre-order", "In-order", "Level-order"], a: 0, e: "Children are processed before their parent." },
    { q: "Which pair of traversals uniquely determines a binary tree with distinct values?", o: ["Pre-order and in-order", "Pre-order and post-order", "Post-order alone", "Level-order alone"], a: 0, e: "Pre-order gives roots; in-order splits left and right subtrees." },
  ],
  "level-order-traversal": [
    { q: "Why save the queue size before processing a level?", o: ["Children added during the loop belong to the next level", "To save memory", "To sort the level", "It's not needed"], a: 0, e: "Reading q.size() inside the loop condition mixes levels." },
    { q: "Why is BFS good for minimum depth?", o: ["The first leaf reached is the nearest one, so it can stop early", "BFS uses less memory always", "DFS can't find leaves", "BFS sorts nodes"], a: 0, e: "BFS explores in order of depth." },
    { q: "What is BFS's space complexity on a tree?", o: ["O(w), the maximum width", "O(h), the height", "O(1)", "O(log n) always"], a: 0, e: "The queue holds up to one full level." },
  ],
  "binary-search-trees": [
    { q: "Why does checking only that each node is between its children fail to validate a BST?", o: ["The rule applies to whole subtrees, not just children", "It's too slow", "It rejects valid trees", "BSTs allow any order"], a: 0, e: "Pass down low and high bounds to each subtree." },
    { q: "When deleting a node with two children, what replaces its value?", o: ["Its in-order successor", "Its left child", "Its parent", "The root"], a: 0, e: "The smallest value in the right subtree keeps the ordering valid." },
    { q: "Inserting 1, 2, 3, 4, 5 into a plain BST gives what height?", o: ["4 (a chain)", "2", "3", "1"], a: 0, e: "Sorted inserts create a degenerate tree; self-balancing trees prevent this." },
  ],
  "classic-tree-problems": [
    { q: "In the diameter solution, what does the recursive function return?", o: ["The longest downward path from the node", "The diameter", "The node count", "The tree's height only at the root"], a: 0, e: "It records the best turning path separately, since a parent can't extend a fork." },
    { q: "In maximum path sum, why clamp child gains at zero?", o: ["A negative subtree should be ignored, not added", "To avoid overflow", "To count nodes", "It's required by Java"], a: 0, e: "Adding a negative branch only lowers the sum." },
    { q: "In a BST, when is the current node the LCA of p and q?", o: ["When p and q fall on different sides of it, or one equals it", "When both are smaller", "When both are larger", "Always the root"], a: 0, e: "Otherwise move left or right toward both targets." },
  ],
  "heap-basics": [
    { q: "In a zero-indexed array heap, what is the left child of index i?", o: ["2i + 1", "2i", "i / 2", "2i + 2"], a: 0, e: "Right child is 2i + 2; parent is (i − 1) / 2." },
    { q: "Why does sift down swap with the smaller child in a min-heap?", o: ["Swapping with the larger child would break the heap property", "It's faster", "It balances the tree", "It's arbitrary"], a: 0, e: "The smaller child must become the parent of the other." },
    { q: "What is the cost of building a heap bottom-up from n elements?", o: ["O(n)", "O(n log n)", "O(log n)", "O(n²)"], a: 0, e: "Most nodes are near the bottom and sift down only a little." },
  ],
  "priority-queue-top-k": [
    { q: "To keep the k largest elements of a stream, which heap do you use?", o: ["A min-heap of size k", "A max-heap of all elements", "A max-heap of size k", "No heap"], a: 0, e: "The root is the weakest of the top k, ready to be evicted." },
    { q: "Why avoid (a, b) -> a − b as a comparator?", o: ["Subtraction can overflow", "It's too slow", "It sorts descending", "Java forbids it"], a: 0, e: "Use Integer.compare(a, b) instead." },
    { q: "For a running median, what do the two heaps hold?", o: ["A max-heap of the smaller half and a min-heap of the larger half", "Two min-heaps", "Two max-heaps", "Even and odd numbers"], a: 0, e: "The roots sit on either side of the median." },
  ],
  "merge-k-sorted-and-heap-sort": [
    { q: "What is the time complexity of merging k lists with N total nodes using a heap?", o: ["O(N log k)", "O(N k)", "O(N log N)", "O(k log N)"], a: 0, e: "Each node is pushed and popped once at O(log k)." },
    { q: "Which property does heap sort have?", o: ["O(n log n) worst case with O(1) extra space", "Stable", "O(n) best case", "Cache friendly"], a: 0, e: "It's neither stable nor cache friendly, but it guarantees O(n log n) in place." },
    { q: "Introsort switches from quick sort to heap sort when what happens?", o: ["Recursion gets too deep", "The array is small", "The array is sorted", "Duplicates appear"], a: 0, e: "That guarantees O(n log n) even with bad pivots." },
  ],
  "graph-representation": [
    { q: "What memory does an adjacency list use?", o: ["O(V + E)", "O(V²)", "O(E²)", "O(V)"], a: 0, e: "One list per vertex with one entry per edge end." },
    { q: "When is an adjacency matrix a good choice?", o: ["Small or dense graphs needing quick edge checks", "Huge sparse graphs", "Trees with millions of nodes", "Never"], a: 0, e: "It costs O(V²) memory but answers 'is there an edge?' in O(1)." },
    { q: "How many edges does a tree with V vertices have?", o: ["V − 1", "V", "V + 1", "2V"], a: 0, e: "A connected acyclic graph on V vertices has exactly V − 1 edges." },
  ],
  "bfs-and-dfs": [
    { q: "When should BFS mark a vertex as visited?", o: ["When it's added to the queue", "When it's removed from the queue", "After all neighbours are processed", "Never"], a: 0, e: "Marking on dequeue lets the same vertex be queued many times." },
    { q: "In rotting oranges, why start BFS from all rotten oranges at once?", o: ["Multi-source BFS spreads from every source in parallel, one level per minute", "To save memory", "Because DFS is wrong", "To sort the grid"], a: 0, e: "Separate BFS runs would be slower and harder to combine." },
    { q: "What is the time complexity of BFS with an adjacency list?", o: ["O(V + E)", "O(V²)", "O(E log V)", "O(V E)"], a: 0, e: "Each vertex and edge is processed a constant number of times." },
  ],
  "topological-sort": [
    { q: "In Kahn's algorithm, how is a cycle detected?", o: ["Fewer than V vertices appear in the output", "A vertex has in-degree 0", "The queue is empty at start", "A grey vertex is reached"], a: 0, e: "Vertices in a cycle never reach in-degree 0." },
    { q: "In DFS-based cycle detection on directed graphs, reaching which colour signals a cycle?", o: ["Grey", "White", "Black", "Any visited vertex"], a: 0, e: "Grey vertices are on the current path, so reaching one means a back edge." },
    { q: "'Course A requires course B' becomes which edge?", o: ["B → A", "A → B", "Both directions", "No edge"], a: 0, e: "B must come before A in the order." },
  ],
  "dijkstra-shortest-path": [
    { q: "Why does Dijkstra fail with negative edge weights?", o: ["A vertex may be finalized before a cheaper path through a negative edge is found", "It loops forever always", "It can't use heaps", "It needs a DAG"], a: 0, e: "Use Bellman-Ford when negative weights exist." },
    { q: "What does the 'if (d > dist[u]) continue' check do?", o: ["Skips stale heap entries left by lazy deletion", "Detects negative cycles", "Stops at the target", "Sorts the heap"], a: 0, e: "Java's PriorityQueue can't decrease keys, so outdated entries remain." },
    { q: "What is Dijkstra's complexity with a binary heap?", o: ["O((V + E) log V)", "O(V + E)", "O(V³)", "O(V E)"], a: 0, e: "Each edge relaxation may push to the heap at O(log V)." },
  ],
  "union-find-and-mst": [
    { q: "With path compression and union by size, what is the cost per operation?", o: ["Nearly constant, O(α(n))", "O(n)", "O(log n) always", "O(n²)"], a: 0, e: "The inverse Ackermann function is at most 4 for any practical n." },
    { q: "In Kruskal's algorithm, an edge is skipped when what holds?", o: ["Its endpoints are already in the same component", "Its weight is large", "It's the first edge", "It connects two leaves"], a: 0, e: "Adding it would create a cycle." },
    { q: "How many edges does a minimum spanning tree of V vertices have?", o: ["V − 1", "V", "E", "V / 2"], a: 0, e: "Any spanning tree has exactly V − 1 edges." },
  ],
  "recursion-fundamentals": [
    { q: "Why compute half = power(x, n / 2) once instead of calling it twice?", o: ["Calling twice makes the work O(n) instead of O(log n)", "To save one variable", "Java forbids two calls", "It changes the answer"], a: 0, e: "Two calls per level double the work at every level." },
    { q: "Which part of a recursive function prevents infinite recursion?", o: ["The base case", "The return type", "The parameters", "The recursive call"], a: 0, e: "Every recursive call must move toward a base case." },
    { q: "Why take n as a long in power(x, n)?", o: ["Negating Integer.MIN_VALUE overflows an int", "Longs are faster", "Doubles need longs", "It's not necessary"], a: 0, e: "-(-2³¹) doesn't fit in a 32-bit int." },
  ],
  "subsets-and-permutations": [
    { q: "What common bug returns a list of empty lists from a backtracking solution?", o: ["Adding path itself instead of a copy", "Missing base case", "Wrong loop bounds", "Using recursion"], a: 0, e: "Every entry references the same list, which is emptied at the end." },
    { q: "How many subsets does a set of 5 distinct elements have?", o: ["32", "25", "120", "10"], a: 0, e: "2⁵ = 32, including the empty set." },
    { q: "To skip duplicate subsets from [1, 2, 2], what must you do first?", o: ["Sort the input", "Reverse it", "Remove duplicates", "Use a queue"], a: 0, e: "Then skip nums[i] when it equals nums[i − 1] at the same level." },
  ],
  "combination-sum-and-n-queens": [
    { q: "In Combination Sum with reusable candidates, why recurse with i instead of i + 1?", o: ["To allow using the same candidate again", "To avoid duplicates", "To stop early", "To sort the candidates"], a: 0, e: "Passing i + 1 would allow each candidate only once." },
    { q: "In N-Queens, which index identifies a cell's anti-diagonal?", o: ["row + col", "row − col", "row × col", "col − row only"], a: 0, e: "Cells on the same anti-diagonal share row + col." },
    { q: "Why does sorting candidates enable pruning in Combination Sum?", o: ["Once one candidate exceeds the remaining sum, all later ones do too", "Sorting removes duplicates", "It reduces memory", "It isn't needed"], a: 0, e: "The loop can break instead of trying each larger candidate." },
  ],
  "dp-introduction": [
    { q: "What two properties make a problem suitable for DP?", o: ["Overlapping subproblems and optimal substructure", "Sorted input and small n", "Recursion and loops", "Greedy choice and sorting"], a: 0, e: "Reusable subproblem answers combine into an optimal solution." },
    { q: "How does tabulation differ from memoization?", o: ["Tabulation fills a table bottom-up with loops; memoization caches recursive calls", "They're identical", "Memoization is always faster", "Tabulation uses recursion"], a: 0, e: "Tabulation avoids recursion depth limits and often allows space optimization." },
    { q: "What's the space of an optimized Fibonacci DP?", o: ["O(1)", "O(n)", "O(n²)", "O(log n)"], a: 0, e: "Only the previous two values are needed." },
  ],
  "one-dimensional-dp": [
    { q: "What is the House Robber recurrence?", o: ["dp[i] = max(dp[i − 1], dp[i − 2] + nums[i])", "dp[i] = dp[i − 1] + nums[i]", "dp[i] = min(dp[i − 1], dp[i − 2])", "dp[i] = nums[i]"], a: 0, e: "Either skip house i or rob it and add the best from two houses back." },
    { q: "With coins [1, 3, 4] and amount 6, how many coins does the optimum use?", o: ["2", "3", "4", "1"], a: 0, e: "3 + 3 uses two coins; greedy 4 + 1 + 1 uses three." },
    { q: "To count coin combinations where order doesn't matter, which loop is outer?", o: ["Coins", "Amounts", "Either", "Neither"], a: 0, e: "Amount-outer counts permutations, treating 1 + 2 and 2 + 1 separately." },
  ],
  "knapsack-01": [
    { q: "In the 1D 0/1 knapsack, why does the capacity loop run backwards?", o: ["So dp[c − w] still holds values from before this item", "It's faster", "To handle negative weights", "To sort items"], a: 0, e: "Forward iteration would reuse the same item, giving unbounded knapsack." },
    { q: "Why is the O(n·W) knapsack DP called pseudo-polynomial?", o: ["Its cost grows with the numeric value W, not the input length", "It's exponential in n", "It uses recursion", "It only works for small n"], a: 0, e: "A huge capacity makes the table huge even for few items." },
    { q: "Partition Equal Subset Sum reduces to which problem?", o: ["Subset sum with target total / 2", "Longest increasing subsequence", "Coin change", "Edit distance"], a: 0, e: "If the total is odd, the answer is false immediately." },
  ],
  "two-dimensional-dp": [
    { q: "What are the edit distance base cases?", o: ["dp[i][0] = i and dp[0][j] = j", "All zeros", "dp[0][0] = 1", "dp[i][i] = 0"], a: 0, e: "Turning a string into an empty one costs one deletion per character." },
    { q: "If a[i−1] == b[j−1], what is dp[i][j] in LCS?", o: ["dp[i−1][j−1] + 1", "max(dp[i−1][j], dp[i][j−1])", "dp[i−1][j] + 1", "0"], a: 0, e: "Matching last characters extend the LCS of the shorter prefixes." },
    { q: "How many unique paths cross a 3 × 3 grid moving only right or down?", o: ["6", "9", "4", "12"], a: 0, e: "C(4, 2) = 6: two rights and two downs in any order." },
  ],
  "longest-increasing-subsequence": [
    { q: "In the O(n²) LIS DP, why return the max over all dp[i] rather than dp[n − 1]?", o: ["The LIS can end at any index", "dp[n − 1] is always 1", "To handle duplicates", "It's faster"], a: 0, e: "dp[i] is the LIS ending at i, and the best may end earlier." },
    { q: "In the O(n log n) method, what does tails[k] store?", o: ["The smallest possible tail of an increasing subsequence of length k + 1", "The actual LIS", "The largest element seen", "The count of subsequences"], a: 0, e: "Only its length is guaranteed to be meaningful." },
    { q: "For Russian doll envelopes, why sort equal widths by height descending?", o: ["So two envelopes of the same width can't be counted as nested", "To speed up sorting", "To find the tallest envelope", "It's arbitrary"], a: 0, e: "Descending heights stop the LIS from picking both." },
  ],
};
