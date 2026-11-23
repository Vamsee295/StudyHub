// Long-form theory for DSA linked lists, stacks, queues and hashing. Original writing.
import { LessonTheory } from './utils';
import { ODS, THE_ALGORITHMS, TIH, CP_ALGO, MIT_6006, JAVA_API } from './dsa-theory-sources';

export const dsaLinearTheory: Record<string, LessonTheory> = {
  "linked-list-basics": {
    theory: `A linked list stores elements in separate nodes, each holding a value and a reference to the next node. Unlike an array, its elements don't sit side by side in memory, so it can grow one node at a time and insert anywhere without shifting. The price is that you can't jump to an index. This lesson explains singly and doubly linked lists, traversal, insertion and deletion, the dummy head technique, and when a linked list beats an array.

## Nodes and references

A node in a singly linked list holds data and a pointer to the next node:

~~~java
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}
~~~

The list is represented by a reference to its first node, the **head**. The last node's \`next\` is \`null\`. Every operation starts from the head and follows \`next\` references, because there's no address formula like an array's.

## Traversal

Visiting every node uses a moving pointer:

~~~java
ListNode cur = head;
while (cur != null) {
    System.out.println(cur.val);
    cur = cur.next;
}
~~~

Reaching the k-th node costs O(k), and searching for a value costs O(n). Copying \`head\` into \`cur\` matters: moving \`head\` itself would lose your only reference to the start of the list.

## Insertion

Inserting after a known node takes two pointer updates, done in the right order:

~~~java
newNode.next = prev.next;   // first, link the new node to the rest
prev.next = newNode;        // then, link the previous node to it
~~~

Reversing these two lines loses the rest of the list, because \`prev.next\` is overwritten before it's saved. Inserting at the head is O(1). Inserting at the tail is O(n) unless you keep a separate \`tail\` reference, which makes it O(1).

## Deletion

To delete a node, make its predecessor skip it: \`prev.next = prev.next.next\`. Java's garbage collector reclaims the removed node once nothing references it. The catch is that you need the predecessor, so deleting the node with a given value means traversing with a pointer one step behind.

A well-known puzzle asks you to delete a node when you only have a reference to it, not the head. Copy the next node's value into it, then delete the next node instead. This fails for the last node, which is worth mentioning.

## The dummy head

Operations at the head often need special cases: deleting the first node, or inserting before it, changes \`head\` itself. A **dummy** (sentinel) node placed before the real head removes those cases:

~~~java
ListNode dummy = new ListNode(0);
dummy.next = head;
ListNode prev = dummy;
while (prev.next != null) {
    if (prev.next.val == target) prev.next = prev.next.next;
    else prev = prev.next;
}
return dummy.next;
~~~

Now every real node has a predecessor, and the code handles deleting the head the same way as any other node. Use a dummy head whenever the head might change, including merging and partitioning lists.

## Doubly linked lists

A doubly linked list gives each node a \`prev\` pointer as well as \`next\`. That doubles the pointer updates per operation, but allows backward traversal and O(1) deletion of any node you hold a reference to, since its predecessor is directly reachable. Java's \`LinkedList\` is doubly linked. An LRU cache combines a hash map with a doubly linked list for exactly this reason: the map finds a node in O(1), and the list removes it and moves it to the front in O(1).

## Linked list versus array

| Operation | Array or ArrayList | Linked list |
|---|---|---|
| Access by index | O(1) | O(n) |
| Insert or delete at the front | O(n) | O(1) |
| Insert or delete at a known node | O(n) | O(1) |
| Insert at the end | O(1) amortized | O(1) with a tail pointer |
| Memory per element | The value | The value plus one or two pointers and an object header |
| Cache behaviour | Excellent | Poor |

In practice, arrays usually win, even for some insert-heavy workloads, because of cache locality. Linked lists shine when you hold references to nodes and need O(1) removal or reordering, as in LRU caches, or when building stacks and queues that never need indexing.

## Common pitfalls

Most linked list bugs come from a few mistakes:

- dereferencing \`null\`: always check \`cur != null\` before \`cur.next\`, and \`cur.next != null\` before \`cur.next.next\`
- losing the rest of the list by overwriting a \`next\` pointer before saving it
- moving the \`head\` reference during traversal
- forgetting to update a \`tail\` pointer after deleting the last node

Drawing boxes and arrows on paper and updating them step by step catches nearly all of these.

## How interviewers test this

Expect "Array versus linked list?", deleting nodes by value, inserting into a sorted list and the "delete a node given only that node" puzzle. Use a dummy head whenever the head might change, state the order of pointer updates, and check every null case aloud.`,
    sources: [ODS, JAVA_API, TIH]
  },

  "reverse-a-linked-list": {
    theory: `Reversing a linked list is the most frequently asked linked list problem, and it's a building block for harder ones such as palindrome checks, reversing in groups and reordering lists. The iterative solution uses three pointers and constant space; the recursive one is elegant but uses O(n) stack space. This lesson derives both, traces them step by step, and covers the common extensions.

## The goal

Turn \`1 → 2 → 3 → 4 → null\` into \`4 → 3 → 2 → 1 → null\` by changing the \`next\` pointers, without creating new nodes. The node values stay where they are; only the arrows flip direction.

## The iterative approach

Walk the list once, reversing each pointer as you go. You need three references:

- \`prev\`: the head of the already-reversed part, starting as \`null\`
- \`cur\`: the node being processed
- \`next\`: a saved reference to the rest of the list, because reversing \`cur.next\` would otherwise lose it

~~~java
ListNode reverse(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;   // save the rest
        cur.next = prev;            // reverse this pointer
        prev = cur;                 // grow the reversed part
        cur = next;                 // move on
    }
    return prev;                    // the new head
}
~~~

This is O(n) time and O(1) space.

## Tracing it

Starting with \`1 → 2 → 3 → null\`:

| Step | prev | cur | Reversed part | Remaining |
|---|---|---|---|---|
| Start | null | 1 | (empty) | 1 → 2 → 3 |
| 1 | 1 | 2 | 1 → null | 2 → 3 |
| 2 | 2 | 3 | 2 → 1 → null | 3 |
| 3 | 3 | null | 3 → 2 → 1 → null | (empty) |

When \`cur\` becomes \`null\`, \`prev\` points to the new head. Returning \`cur\` or the original \`head\` instead of \`prev\` is a common bug; the original head is now the tail.

## The loop invariant

At the start of each iteration, \`prev\` is the head of a correctly reversed list of the nodes already processed, and \`cur\` is the head of the unprocessed nodes, untouched. Each iteration moves one node from the second list to the front of the first. When the second list is empty, the whole list is reversed. Stating this invariant shows the interviewer you understand why the code works.

## The recursive approach

Recursion reverses the rest of the list first, then attaches the current node at the end:

~~~java
ListNode reverse(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverse(head.next);
    head.next.next = head;   // the node after head now points back to head
    head.next = null;        // head becomes the new tail
    return newHead;
}
~~~

The key line is \`head.next.next = head\`. After the recursive call, \`head.next\` is the tail of the reversed rest, and this line makes it point back to \`head\`. Setting \`head.next = null\` breaks the old forward link, which would otherwise create a two-node cycle.

The recursion is n levels deep, so it uses O(n) stack space and can overflow on lists of tens of thousands of nodes. Prefer the iterative version in production code and mention this trade-off in interviews.

## Reversing a sublist

To reverse only positions left through right, walk a pointer to the node before position left, using a dummy head in case left is 1. Then repeatedly take the node after the current one and move it to the front of the sublist. Each move is three pointer updates, and the whole operation is one pass, O(n) time and O(1) space.

## Reversing in groups of k

Reversing every group of k nodes, leaving a final short group unchanged, combines the pieces: check that k nodes remain, reverse them with the standard loop, connect the reversed group to the previous group's tail, and continue. Tracking the previous group's tail and the next group's head is where most bugs occur, so draw the connections before coding.

## Problems built on reversal

Reversal appears inside other problems:

- **Palindrome linked list**: find the middle with fast and slow pointers, reverse the second half, compare the halves, and optionally reverse back to restore the list. O(n) time and O(1) space
- **Reorder list**: turn \`1 → 2 → 3 → 4 → 5\` into \`1 → 5 → 2 → 4 → 3\` by finding the middle, reversing the second half and interleaving the two halves
- **Add two numbers stored in forward order**: reverse both lists so the least significant digits come first, add with a carry, and reverse the result

## How interviewers test this

Expect to reverse a list both iteratively and recursively, explain the space difference, and extend the idea to sublists or groups of k. Trace three nodes on paper with \`prev\`, \`cur\` and \`next\`, and state the invariant to show the solution isn't memorized.`,
    sources: [TIH, THE_ALGORITHMS, ODS]
  },

  "fast-and-slow-pointers": {
    theory: `The fast and slow pointer technique moves two pointers through a linked list at different speeds, usually one step and two steps at a time. The speed difference reveals structure that would otherwise need extra memory: the middle of the list, whether a cycle exists, and where it starts. This lesson explains finding the middle, Floyd's cycle detection, the proof for finding the cycle's entry point, and the technique's use outside linked lists.

## Finding the middle

Move \`slow\` one step and \`fast\` two steps at a time. When \`fast\` reaches the end, \`slow\` is at the middle, because it has travelled half as far:

~~~java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;
~~~

For an odd-length list such as 1 to 5, \`slow\` stops at 3. For an even-length list such as 1 to 6, it stops at 4, the second of the two middle nodes. To get the first middle node instead, start \`fast\` at \`head.next\`. Knowing which middle your loop returns matters when splitting a list for merge sort or a palindrome check.

This takes one pass and O(1) space, compared with counting the length first and walking again.

## Detecting a cycle

A cycle exists if following \`next\` pointers eventually revisits a node. A hash set of visited nodes detects this in O(n) time and O(n) space. Floyd's algorithm, also called the tortoise and hare, does it in O(1) space:

~~~java
boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}
~~~

If there's no cycle, \`fast\` reaches \`null\`. If there is one, both pointers eventually enter it, and inside the cycle the fast pointer gains one node on the slow pointer every step. The gap shrinks by one each step, so the fast pointer can't jump over the slow one; they must meet within one lap of the cycle. Compare nodes with \`==\`, which checks identity, not values, because different nodes can hold equal values.

## Finding where the cycle starts

After the pointers meet, reset one pointer to the head and move both one step at a time. They meet again exactly at the cycle's entry node.

The proof is a favourite interview question. Let:

- a = distance from the head to the cycle's entry
- b = distance from the entry to the meeting point, going forward
- c = length of the cycle

When they meet, the slow pointer has travelled a + b. The fast pointer has travelled twice as far, 2(a + b), and that also equals a + b plus some whole number of laps, k · c. So a + b = k · c, which gives a = k · c − b.

Now a pointer starting from the meeting point and moving a steps travels k · c − b: that's k full laps minus b, which lands exactly at the entry. A pointer from the head reaches the entry after a steps too. So the two meet at the entry.

## Measuring the cycle

Once the pointers meet inside the cycle, keep one fixed and move the other until it returns, counting steps. That count is the cycle's length c.

## Finding a duplicate number

Given an array of n + 1 integers, each between 1 and n, find the repeated number without modifying the array and with O(1) extra space. Treat each value as a pointer to the index it names: from index i, go to index \`nums[i]\`. Because two indices hold the same value, two paths lead into the same node, which forms a cycle, and the duplicate is the cycle's entry point. Floyd's algorithm finds it in O(n) time. This problem shows the technique applies to any sequence defined by repeatedly applying a function, not only to linked lists.

## Happy numbers

A number is "happy" if repeatedly replacing it with the sum of the squares of its digits eventually reaches 1. Unhappy numbers loop forever in a cycle that doesn't include 1. Running fast and slow pointers on the sequence of numbers detects the loop without storing every value seen.

## Other uses of two speeds

The same family of ideas covers related problems:

- **The k-th node from the end**: move one pointer k steps ahead, then move both together; when the leader reaches the end, the follower is at the k-th node from the end. This removes the n-th node from the end in one pass
- **Intersection of two lists**: walk both lists, and when a pointer reaches the end, redirect it to the other list's head. Both pointers travel the same total distance, so they meet at the intersection, or both reach \`null\` together

## How interviewers test this

Expect middle of the list, linked list cycle, cycle start, remove the n-th node from the end and find the duplicate number. Explain why the fast pointer can't skip the slow one, and be ready to derive a = k · c − b for the cycle entry proof.`,
    sources: [TIH, CP_ALGO, THE_ALGORITHMS]
  },

  "merge-sorted-lists": {
    theory: `Merging two sorted lists into one sorted list is a core operation: it's the second half of merge sort, and the basis for merging k lists, intersecting sorted data and combining results in databases. On linked lists, merging needs no extra memory, because you relink existing nodes. This lesson covers the iterative and recursive merge, merge sort on linked lists, merging k sorted lists, and related problems.

## The idea

Compare the heads of both lists, take the smaller, and repeat. Because each list is already sorted, the smaller head is the smallest remaining element overall. When one list runs out, attach the rest of the other, which is already sorted.

## The iterative merge

A dummy head avoids special-casing the first node, and a \`tail\` pointer marks where the next node attaches:

~~~java
ListNode merge(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != null) ? a : b;   // attach the remainder
    return dummy.next;
}
~~~

This is O(n + m) time and O(1) extra space, since it relinks existing nodes. Using \`<=\` takes from the first list on ties, which keeps the merge **stable**: equal elements keep their original relative order.

## The recursive merge

The recursive version states the logic compactly:

~~~java
ListNode merge(ListNode a, ListNode b) {
    if (a == null) return b;
    if (b == null) return a;
    if (a.val <= b.val) { a.next = merge(a.next, b); return a; }
    b.next = merge(a, b.next); return b;
}
~~~

It reads well but uses O(n + m) stack space, one frame per node. For long lists, the iterative version is safer.

## Merge sort on a linked list

Merge sort suits linked lists better than quick sort does. Quick sort relies on random access for partitioning, while merge sort needs only sequential access. The steps:

1. Find the middle with fast and slow pointers, starting \`fast\` at \`head.next\` so that two-node lists split evenly
2. Cut the list in two by setting the middle node's \`next\` to \`null\`
3. Sort each half recursively
4. Merge the two sorted halves

This runs in O(n log n) time. The recursion uses O(log n) stack space; a bottom-up version that merges runs of size 1, 2, 4 and so on achieves O(1) extra space.

## Merging k sorted lists

With k sorted lists totalling N nodes, there are three main approaches:

| Approach | Time | Extra space |
|---|---|---|
| Merge lists one at a time into a growing result | O(N · k) | O(1) |
| Min-heap of the current head of each list | O(N log k) | O(k) |
| Divide and conquer: merge pairs, then pairs of results | O(N log k) | O(log k) stack |

Merging one at a time is slow because early nodes get re-scanned in every later merge. The heap approach keeps the k current heads in a priority queue; each step removes the smallest, appends it, and pushes its successor. Divide and conquer pairs lists like a tournament, so each node takes part in about log k merges. The heap version is covered in more detail in the heaps module.

## Related problems

The two-pointer merge pattern appears in many forms:

- **Merging sorted arrays in place**: when the first array has spare space at the end, fill from the back, comparing the largest remaining elements. Filling from the front would overwrite unread values
- **Intersection of two sorted arrays**: advance the pointer with the smaller value; when values match, record them and advance both
- **Removing duplicates from a sorted list**: a single pointer skips nodes whose value equals the current node's
- **Partition list**: build two lists, one for values below x and one for the rest, each with a dummy head, then join them

## Edge cases

Test merges with one or both lists empty, lists of unequal lengths, all elements of one list smaller than all elements of the other, and duplicate values across lists. The final \`tail.next = a or b\` line handles most of these, which is why forgetting it is the most common bug.

## How interviewers test this

Expect merge two sorted lists, sort a linked list and merge k sorted lists. Use a dummy head and a tail pointer, explain why merging is O(n + m) with no extra memory, and compare the three approaches for k lists with their complexities.`,
    sources: [TIH, ODS, THE_ALGORITHMS]
  },

  "stack-basics": {
    theory: `A stack is a collection where the last element added is the first one removed: last in, first out (LIFO). It supports only a few operations, and each runs in O(1), yet stacks underpin function calls, undo features, expression parsing, depth-first search and a whole family of interview problems. This lesson explains stack operations, how to use them in Java correctly, how stacks are implemented, and how to recognize problems that need one.

## Operations

A stack supports three main operations, each O(1):

- **push(x)**: add x to the top
- **pop()**: remove and return the top element
- **peek()**: return the top element without removing it

plus \`isEmpty()\` and \`size()\`. Popping or peeking an empty stack is an error, so check \`isEmpty()\` first. Forgetting this check is the most common stack bug.

## Stacks in Java

Java's legacy \`Stack\` class extends \`Vector\`, which synchronizes every method, adding overhead you don't need, and exposes index-based methods that break the LIFO abstraction. The Java documentation recommends \`ArrayDeque\` instead:

~~~java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.push(2);
int top = stack.peek();   // 2
int x = stack.pop();      // 2
boolean empty = stack.isEmpty();
~~~

\`ArrayDeque\` is backed by a resizable circular array, so it's fast and cache friendly. Note two traps: \`pop()\` on an empty \`ArrayDeque\` throws \`NoSuchElementException\` while \`peek()\` returns \`null\`, and \`ArrayDeque\` doesn't accept \`null\` elements.

## Implementing a stack

Two implementations are standard:

- **Array-based**: keep an array and a \`top\` index. Push writes at \`top\` and increments; pop decrements and reads. Grow the array by doubling when full, giving O(1) amortized push
- **Linked-list-based**: push inserts a new node at the head, and pop removes the head. Every operation is O(1) worst case, at the cost of an extra pointer per element

Interviewers sometimes ask for a **min stack** that also returns the minimum element in O(1). Keep a second stack holding the minimum so far at each level: on push, push \`min(x, currentMin)\` onto it; on pop, pop both stacks. The top of the second stack is always the current minimum.

## The call stack

Every running program uses a stack to manage function calls. Calling a function pushes a frame with its parameters, local variables and return address; returning pops it. This is why recursion uses memory proportional to its depth, and why infinite recursion ends in a \`StackOverflowError\`. Any recursive algorithm can be converted to an iterative one by managing an explicit stack yourself, which avoids the depth limit.

## Where stacks appear

Stacks fit any situation where the most recent unfinished item must be handled first:

- **Undo**: each action is pushed; undo pops the latest
- **Browser back button**: visited pages are pushed; back pops
- **Matching brackets**: an opening bracket waits on the stack for its closing partner
- **Expression evaluation**: compilers and calculators use stacks to handle operator precedence
- **Depth-first search**: DFS explores the most recently discovered node first
- **Backtracking**: the current path through a maze or a decision tree acts as a stack

## Recognizing stack problems

Look for these clues:

- **Nesting or matching**: brackets, HTML tags, nested function calls
- **"Most recent" relationships**: the previous smaller element, the next greater element, the nearest taller building
- **Reversal**: reversing a sequence, or processing items in the reverse of their arrival order
- **Simulating recursion**: iterative tree traversals, iterative DFS
- **Collapsing adjacent pairs**: removing adjacent duplicates, asteroid collisions, backspace string compare

For example, to remove adjacent duplicate characters repeatedly, such as \`"abbaca"\` becoming \`"ca"\`, push each character, but pop instead when it matches the top. The stack holds the result.

## Simplifying a file path

Normalizing a Unix path such as \`/a/./b/../../c/\` to \`/c\` is a classic stack problem. Split on \`/\`. Skip empty parts and \`.\`; for \`..\`, pop if the stack isn't empty; push any other name. Join the stack's contents with \`/\`. The stack models the current directory path, which is why it works.

## How interviewers test this

Expect "What's a stack and where is it used?", "Why use ArrayDeque over Stack in Java?" and "Design a stack that returns its minimum in O(1)." Then expect stack problems such as valid parentheses, path simplification and adjacent duplicate removal. Name the LIFO clue that told you a stack fits.`,
    sources: [ODS, JAVA_API, TIH]
  },

  "balanced-parentheses": {
    theory: `Checking whether brackets are balanced is the classic stack problem. A string such as \`"({[]})"\` is valid because every opening bracket is closed by the matching type in the correct order, while \`"([)]"\` isn't. The stack works because the most recently opened bracket must be the first one closed. This lesson explains the algorithm, its edge cases, the counter shortcut for a single bracket type, and harder variants: minimum insertions, minimum removals and longest valid substring.

## Why a stack

Brackets nest: an inner pair must close before an outer one. When you meet a closing bracket, it must match the most recent unmatched opening bracket. "Most recent unmatched" is exactly what the top of a stack holds.

## The algorithm

Scan left to right. Push each opening bracket. On a closing bracket, the stack must be non-empty, and its top must be the matching opening bracket; pop it. At the end, the stack must be empty.

~~~java
boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') stack.push(c);
        else {
            if (stack.isEmpty()) return false;
            char open = stack.pop();
            if ((c == ')' && open != '(') ||
                (c == ']' && open != '[') ||
                (c == '}' && open != '{')) return false;
        }
    }
    return stack.isEmpty();
}
~~~

This is O(n) time and O(n) space in the worst case, when every character is an opening bracket.

## The three failure cases

A string is invalid in exactly three situations, and each maps to a check:

| Failure | Example | Check |
|---|---|---|
| Closing bracket with nothing open | \`"())"\` | Stack is empty on a closing bracket |
| Wrong type | \`"(]"\` | Popped bracket doesn't match |
| Unclosed brackets at the end | \`"(()"\` | Stack not empty after the scan |

Forgetting the final \`isEmpty()\` check is the most common bug: \`"(("\` passes every check during the scan.

A small optimization: an odd-length string can never be balanced, so return false immediately.

## Cleaner matching

A trick shortens the code: when you see an opening bracket, push the closing bracket you expect. Then a closing bracket must equal the popped value exactly:

~~~java
if (c == '(') stack.push(')');
else if (c == '[') stack.push(']');
else if (c == '{') stack.push('}');
else if (stack.isEmpty() || stack.pop() != c) return false;
~~~

A \`Map<Character, Character>\` from closing to opening brackets is another clean option, and it extends easily to angle brackets or other pairs.

## One bracket type: use a counter

With only \`(\` and \`)\`, you don't need a stack. Keep a counter: add one for \`(\` and subtract one for \`)\`. The string is valid if the counter never goes negative and ends at zero. That's O(1) space. With multiple types, a counter can't tell \`"(]"\` from \`"()"\`, so you need the stack to remember types.

## Minimum additions to make it valid

To find how many brackets must be inserted to balance a string of \`(\` and \`)\`, track two counts: \`open\`, unmatched opening brackets so far, and \`insert\`, closing brackets with no partner. On \`)\`, if \`open > 0\`, match it; otherwise one \`(\` must be inserted. The answer is \`insert + open\` at the end.

## Minimum removals to make it valid

To return a valid string by removing the fewest brackets, push the indices of opening brackets onto a stack. On \`)\`, pop if possible; otherwise mark this index for removal. After the scan, every index still on the stack is an unmatched \`(\` and must also be removed. Build the result by skipping marked indices. This runs in O(n).

## Longest valid parentheses substring

For \`")()())"\`, the longest valid substring is \`"()()"\`, of length 4. Push indices onto a stack, starting with \`-1\` as a base marker:

- on \`(\`, push its index
- on \`)\`, pop; if the stack is now empty, push the current index as the new base; otherwise, the valid length ending here is the current index minus the index on top of the stack

The base marker records where the last invalid position was, so each length is measured from it. This O(n) approach is a well-known hard problem, and the base marker is the key idea to explain.

## Generating valid combinations

A related problem generates all valid strings of n pairs. That uses backtracking rather than a stack: add \`(\` while fewer than n are open, add \`)\` while it wouldn't exceed the open count. The number of results is the n-th Catalan number, which grows roughly like 4ⁿ.

## How interviewers test this

Expect valid parentheses as a warm-up, often followed by minimum additions, minimum removals or longest valid parentheses. Name the three failure cases, explain why the counter works for one type but not several, and show how indices on the stack enable the harder variants.`,
    sources: [TIH, THE_ALGORITHMS, JAVA_API]
  },

  "monotonic-stack": {
    theory: `A monotonic stack keeps its elements in increasing or decreasing order. When a new element would break the order, the stack pops elements until the order is restored, and each pop answers a question about the popped element, such as "what's the next greater element?" Because every element is pushed and popped at most once, these O(n²) questions are answered in O(n). This lesson explains the technique, the next greater element problem, and its applications to temperatures, stock spans and the largest rectangle in a histogram.

## The next greater element problem

For each element in \`[2, 1, 2, 4, 3]\`, find the first element to its right that is larger, or −1 if none exists. The answer is \`[4, 2, 4, -1, -1]\`. Checking every element to the right of every element costs O(n²).

## The monotonic stack solution

Scan left to right, keeping a stack of indices whose next greater element hasn't been found yet. Their values are decreasing from bottom to top, because if a larger element had come after a smaller one, it would already have resolved it.

When a new element is larger than the value on top, it's the next greater element for that index: pop and record. Keep popping while the new element is larger. Then push the new index.

~~~java
int[] nextGreater(int[] a) {
    int n = a.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();   // indices
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && a[i] > a[stack.peek()]) {
            result[stack.pop()] = a[i];
        }
        stack.push(i);
    }
    return result;
}
~~~

Indices still on the stack at the end have no greater element, so they keep −1.

## Why it's O(n)

The \`while\` loop inside the \`for\` loop looks quadratic, but each index is pushed exactly once and popped at most once. Across the whole scan, the total number of pops is at most n, so the total work is O(n). This amortized argument is the point interviewers want to hear.

## Storing indices, not values

Storing indices instead of values gives you both: \`a[index]\` recovers the value, and the index lets you compute distances, write into a result array, and handle duplicate values correctly. Store indices by default.

## The four variants

Two choices produce four variants:

| Question | Scan direction | Stack order (bottom to top) | Pop while |
|---|---|---|---|
| Next greater to the right | Left to right | Decreasing | current > top |
| Next smaller to the right | Left to right | Increasing | current < top |
| Previous greater to the left | Left to right | Decreasing | current ≥ top; then the top is the answer |
| Previous smaller to the left | Left to right | Increasing | current ≤ top; then the top is the answer |

For "previous" questions, the answer for the current element is whatever remains on top after popping. Whether to use strict or non-strict comparisons depends on how the problem treats equal values, so check duplicates carefully.

## Daily temperatures

Given daily temperatures, find how many days each day must wait for a warmer one. This is next greater element where the answer is the distance: when index j is popped by index i, record \`i - j\`. The O(n) solution replaces an O(n²) scan.

## Circular arrays

If the array is circular, so the search wraps around to the start, loop over indices from 0 to 2n − 1 and use \`i % n\`. The second pass resolves elements whose next greater element lies before them. Only push indices during the first pass, or the results get overwritten incorrectly.

## Stock span

The span of a stock's price on a given day is how many consecutive days up to and including today had a price at most today's. That's the distance to the previous greater element. A decreasing stack of indices answers each day in amortized O(1), which also supports streaming input where prices arrive one at a time.

## Largest rectangle in a histogram

Given bar heights, find the largest rectangle formed by contiguous bars. For each bar, the widest rectangle using its full height extends left and right until a shorter bar. So the problem reduces to finding the previous smaller and next smaller element for every bar.

With an increasing stack, both come from a single pass. When bar i is shorter than the bar on top, the top bar's next smaller is i, and its previous smaller is the new top after popping. Its rectangle has width \`i - newTop - 1\`. Appending a bar of height 0 at the end flushes the remaining bars. This O(n) algorithm also solves the maximal rectangle in a binary matrix, by treating each row as the base of a histogram.

## Recognizing the pattern

Look for phrases such as "next greater", "previous smaller", "nearest taller", "how many days until", or "how far can it extend". Any question asking, for each element, about the first element in some direction that beats it in some comparison is a monotonic stack problem.

## How interviewers test this

Expect next greater element, daily temperatures, stock span and largest rectangle in a histogram. State what the stack holds, its order, when you pop and what a pop means, and give the amortized O(n) argument. For the histogram, explain how popping provides both boundaries at once.`,
    sources: [CP_ALGO, TIH, THE_ALGORITHMS]
  },

  "expression-evaluation": {
    theory: `Evaluating arithmetic expressions is a classic application of stacks, and it shows how compilers and calculators handle operator precedence and parentheses. The key idea is postfix notation, where operators follow their operands, which removes the need for parentheses and precedence rules. This lesson explains the three notations, how to evaluate postfix with a stack, how the shunting-yard algorithm converts infix to postfix, and how to evaluate infix expressions directly.

## Three notations

The same expression can be written three ways:

| Notation | Example | Operator position |
|---|---|---|
| Infix | \`(3 + 4) * 2\` | Between operands |
| Prefix (Polish) | \`* + 3 4 2\` | Before operands |
| Postfix (Reverse Polish) | \`3 4 + 2 *\` | After operands |

Infix is what people write, but it needs precedence rules and parentheses to be unambiguous. Without them, \`3 + 4 * 2\` could mean 14 or 11. Prefix and postfix are never ambiguous: the order of tokens fully determines the order of operations. Postfix was popularized by HP calculators and is how stack-based machines, such as the Java Virtual Machine, execute arithmetic.

## Evaluating postfix

Scan tokens left to right. Push numbers onto a stack. When you meet an operator, pop two operands, apply it, and push the result. At the end, the stack holds the answer.

~~~java
int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String t : tokens) {
        switch (t) {
            case "+" -> stack.push(stack.pop() + stack.pop());
            case "*" -> stack.push(stack.pop() * stack.pop());
            case "-" -> { int b = stack.pop(), a = stack.pop(); stack.push(a - b); }
            case "/" -> { int b = stack.pop(), a = stack.pop(); stack.push(a / b); }
            default -> stack.push(Integer.parseInt(t));
        }
    }
    return stack.pop();
}
~~~

This is O(n) time and O(n) space.

## Operand order

For subtraction and division, order matters. The first value popped is the **right** operand, because it was pushed last. For \`5 3 -\`, you pop 3 then 5, and compute 5 − 3. Swapping them is the most common bug in this problem. Addition and multiplication are commutative, so order doesn't matter there.

Also note that Java's integer division truncates toward zero, so \`-7 / 2\` is \`-3\`, not \`-4\`. Problems usually specify truncation, which matches Java's behaviour.

## Tracing an example

Evaluate \`2 1 + 3 *\`:

| Token | Action | Stack (bottom to top) |
|---|---|---|
| 2 | Push | 2 |
| 1 | Push | 2, 1 |
| + | Pop 1 and 2, push 3 | 3 |
| 3 | Push | 3, 3 |
| * | Pop 3 and 3, push 9 | 9 |

The result is 9, which matches \`(2 + 1) * 3\` in infix.

## Converting infix to postfix

Edsger Dijkstra's **shunting-yard algorithm** converts infix to postfix using a stack for operators:

1. Numbers go straight to the output
2. For an operator, pop operators from the stack to the output while the top has higher precedence, or equal precedence and the current operator is left-associative; then push the current operator
3. Push \`(\` onto the stack
4. For \`)\`, pop operators to the output until the matching \`(\`, then discard both parentheses
5. At the end, pop any remaining operators to the output

For \`3 + 4 * 2\`, the \`*\` has higher precedence than the \`+\` already on the stack, so it's pushed on top, and the output becomes \`3 4 2 * +\`, correctly multiplying first. Associativity matters for operators such as exponentiation, which is right-associative: \`2 ^ 3 ^ 2\` means \`2 ^ (3 ^ 2)\`.

## Evaluating infix directly

A calculator can evaluate infix in one pass with two stacks, one for numbers and one for operators, applying operators whenever precedence allows. That's shunting-yard with evaluation instead of output.

For the common interview version with only \`+\`, \`-\` and parentheses, a single stack is enough. Keep a running \`result\` and \`sign\`. On \`(\`, push the current result and sign and start fresh; on \`)\`, finish the inner result, then pop the sign and previous result and combine them. For a version with \`+\`, \`-\`, \`*\` and \`/\` but no parentheses, push signed numbers: push \`+n\` or \`-n\` for addition and subtraction, and for \`*\` or \`/\`, pop the previous number and push the product or quotient. Sum the stack at the end.

## Parsing details

Real input needs care: multi-digit numbers must be accumulated digit by digit, spaces skipped, and unary minus, as in \`-(2 + 3)\`, distinguished from binary minus. Handle these explicitly and mention them; they're where interview solutions usually break.

## Expression trees

Expressions also map to binary trees, with operators at internal nodes and numbers at leaves. A post-order traversal of the tree produces postfix, pre-order produces prefix, and in-order produces infix without parentheses. Compilers build such trees, called abstract syntax trees, before generating code.

## How interviewers test this

Expect evaluate reverse Polish notation and basic calculator problems. For postfix, explain why no precedence rules are needed and get the operand order right. For infix, describe shunting-yard or the sign-stack approach, and handle multi-digit numbers, spaces and unary minus.`,
    sources: [CP_ALGO, THE_ALGORITHMS, TIH]
  },

  "queue-basics-circular-queue": {
    theory: `A queue processes elements in arrival order: first in, first out (FIFO), like a line at a ticket counter. Queues manage tasks waiting for a processor, requests waiting for a server, and nodes waiting to be explored in breadth-first search. This lesson explains queue operations, how to use queues in Java, why a naive array queue wastes space, how a circular buffer fixes it, and where queues appear in real systems.

## Operations

A queue supports these operations, each O(1):

- **enqueue (offer)**: add an element at the back
- **dequeue (poll)**: remove and return the element at the front
- **peek**: look at the front element without removing it

plus \`isEmpty()\` and \`size()\`. Elements leave in the same order they arrived.

## Queues in Java

\`Queue\` is an interface, and Java provides several implementations:

~~~java
Queue<Integer> q = new ArrayDeque<>();
q.offer(1);
q.offer(2);
int front = q.peek();   // 1
int x = q.poll();       // 1
~~~

\`Queue\` has two forms of each method. \`add\`, \`remove\` and \`element\` throw exceptions on failure, while \`offer\`, \`poll\` and \`peek\` return \`false\` or \`null\`. Interview code typically uses \`offer\`, \`poll\` and \`peek\`.

\`ArrayDeque\` is the usual choice: backed by a circular array, fast and cache friendly. \`LinkedList\` also implements \`Queue\` and allows \`null\` elements, but allocates a node per element. For concurrent producers and consumers, \`java.util.concurrent\` offers blocking queues such as \`ArrayBlockingQueue\` and \`LinkedBlockingQueue\`.

## The problem with a naive array queue

Implement a queue with an array, a \`front\` index and a \`rear\` index. Enqueue writes at \`rear\` and advances it; dequeue reads at \`front\` and advances it. Both indices only move forward. After many operations, \`rear\` reaches the end of the array even though the slots before \`front\` are empty. The queue reports itself full while most of the array is unused.

Shifting all elements left after every dequeue fixes this, but makes dequeue O(n).

## The circular buffer

A circular queue treats the array as a ring: when an index moves past the last slot, it wraps to slot 0. Modular arithmetic does the wrapping:

~~~java
class CircularQueue {
    private final int[] data;
    private int front = 0, size = 0;

    CircularQueue(int capacity) { data = new int[capacity]; }

    boolean enqueue(int x) {
        if (size == data.length) return false;          // full
        data[(front + size) % data.length] = x;
        size++;
        return true;
    }

    int dequeue() {
        if (size == 0) throw new IllegalStateException("empty");
        int x = data[front];
        front = (front + 1) % data.length;
        size--;
        return x;
    }
}
~~~

Freed slots get reused, and every operation stays O(1).

## Telling full from empty

With only \`front\` and \`rear\` indices, a full queue and an empty queue look identical: in both cases \`front == rear\`. There are three standard fixes:

- keep a separate \`size\` counter, as above, which is the clearest
- leave one slot always unused, so the queue is full when \`(rear + 1) % capacity == front\`
- keep a boolean flag recording whether the last operation was an enqueue

Interviewers often ask about this ambiguity directly, so be ready to explain it.

## Growing a circular queue

A fixed capacity suits buffers with known limits, such as audio buffers or network packet rings. To grow, allocate a larger array and copy elements in queue order, starting from \`front\` and wrapping around, then reset \`front\` to 0. A plain \`Arrays.copyOf\` would scramble a queue that has wrapped. \`ArrayDeque\` grows this way automatically.

## A linked-list queue

A singly linked list with both \`head\` and \`tail\` pointers also gives O(1) operations: enqueue appends after the tail, and dequeue removes the head. When the last element is removed, remember to set \`tail\` to \`null\` as well, or it keeps pointing at a removed node.

## Queues in real systems

Queues appear throughout computing:

- **Operating systems**: ready queues hold processes waiting for the CPU, and I/O requests wait in device queues
- **Networking**: routers buffer packets in queues, and dropping packets when a queue fills is how congestion shows up
- **Web servers**: incoming requests wait in a queue for a free worker thread
- **Message brokers**: systems such as Kafka and RabbitMQ decouple services by passing messages through durable queues
- **Breadth-first search**: BFS visits nodes in the order discovered, which finds shortest paths in unweighted graphs

## Priority queues are different

A **priority queue** always removes the highest-priority element rather than the oldest. It's usually implemented with a heap, and it's covered in the heaps module. Don't confuse \`PriorityQueue\` in Java with a FIFO queue; iterating over it doesn't produce sorted order either.

## How interviewers test this

Expect "Stack versus queue?", "Design a circular queue" and "How do you tell a full circular queue from an empty one?" Use modular arithmetic for wrapping, track size explicitly, and connect queues to BFS and to producer-consumer systems.`,
    sources: [ODS, JAVA_API, TIH]
  },

  "deque-sliding-window-maximum": {
    theory: `A deque, short for double-ended queue, allows insertion and removal at both ends in O(1). That flexibility makes it the right tool for the sliding window maximum problem, where a monotonic deque reports the maximum of every window in O(n) total. This lesson explains deque operations in Java, walks through the monotonic deque solution and its proof, and covers related problems that use the same idea.

## Deque operations

A deque combines a stack and a queue. Java's \`Deque\` interface, implemented by \`ArrayDeque\`, provides:

| Front | Back |
|---|---|
| \`offerFirst(x)\` / \`addFirst(x)\` | \`offerLast(x)\` / \`addLast(x)\` |
| \`pollFirst()\` | \`pollLast()\` |
| \`peekFirst()\` | \`peekLast()\` |

All are O(1). Used only at one end, a deque is a stack: \`push\` and \`pop\` work on the front. Used at opposite ends, it's a queue. \`ArrayDeque\` implements both behaviours with a circular array that grows as needed.

## The sliding window maximum problem

Given an array and a window size k, report the maximum of every contiguous window of k elements. For \`[1, 3, -1, -3, 5, 3, 6, 7]\` with k = 3, the answer is \`[3, 3, 5, 5, 6, 7]\`.

Scanning each window costs O(n · k). A max-heap of the window's elements gives O(n log n), but removing elements that leave the window is awkward: you either search the heap or lazily skip stale entries. A monotonic deque does it in O(n).

## The key observation

Suppose a window contains 3 followed later by 5. As long as 5 is in the window, 3 can never be the maximum: 5 is larger, and 5 will stay in the window longer because it arrived later. So 3 is useless and can be discarded.

Discarding every such dominated element leaves elements in **decreasing** order from front to back. The front is always the current maximum.

## The algorithm

Keep a deque of indices whose values decrease from front to back. For each new index i:

1. Remove the front index if it has slid out of the window, meaning it's at most i − k
2. Remove indices from the back while their values are at most \`a[i]\`, because \`a[i]\` dominates them
3. Add i at the back
4. Once the first full window is formed, the front index holds the maximum

~~~java
int[] maxSlidingWindow(int[] a, int k) {
    int n = a.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();   // indices, values decreasing
    for (int i = 0; i < n; i++) {
        if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
        while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
        dq.offerLast(i);
        if (i >= k - 1) result[i - k + 1] = a[dq.peekFirst()];
    }
    return result;
}
~~~

## Why it's O(n)

Each index is added to the deque once and removed at most once, from either end. So the total work across the scan is O(n), even with the inner \`while\` loop. Space is O(k), since the deque never holds more than one window's indices.

## Why store indices

Storing values alone can't tell whether the front element has left the window. Indices answer that with one comparison, and the value is always available as \`a[index]\`. This mirrors the monotonic stack, where storing indices is also the default.

## Tracing the example

With k = 3 on \`[1, 3, -1, -3, 5, 3, 6, 7]\`:

| i | Value | Deque values after step | Window max |
|---|---|---|---|
| 0 | 1 | 1 | |
| 1 | 3 | 3 (1 removed) | |
| 2 | -1 | 3, -1 | 3 |
| 3 | -3 | 3, -1, -3 | 3 |
| 4 | 5 | 5 (3 expired; -1 and -3 dominated) | 5 |
| 5 | 3 | 5, 3 | 5 |
| 6 | 6 | 6 | 6 |
| 7 | 7 | 7 | 7 |

## The minimum, and both at once

For the sliding window minimum, keep values increasing instead, removing from the back while they're at least \`a[i]\`. Some problems need both, such as the longest subarray where the difference between maximum and minimum is at most a limit. Keep two deques, one decreasing for the maximum and one increasing for the minimum, inside a variable-size window. When the difference exceeds the limit, advance the left edge and expire front indices from both deques.

## Shortest subarray with sum at least K

With negative numbers allowed, the variable sliding window fails, but a monotonic deque over prefix sums works. Keep indices with increasing prefix sums. For each new prefix sum, pop from the front while the difference with the front's prefix sum is at least K, recording lengths; then pop from the back any index whose prefix sum is at least the current one, since the current index is a better start. This is one of the harder deque problems and shows how far the idea extends.

## How interviewers test this

Expect sliding window maximum as a common hard problem. Explain why dominated elements can be discarded, why the deque stays decreasing, why it stores indices, and why the total work is O(n). Mention the heap alternative and its O(n log n) cost to show you considered trade-offs.`,
    sources: [CP_ALGO, TIH, JAVA_API]
  },

  "queue-using-stacks": {
    theory: `Implementing a queue with two stacks is a classic design question. It tests whether you understand both structures, and it introduces amortized analysis with a clear, concrete example. The reverse problem, a stack built from queues, is also asked. This lesson explains the two-stack queue, proves its amortized O(1) cost, compares it with a version that's costly on every push, and covers the stack-from-queues design.

## The challenge

A stack gives you LIFO order, and a queue needs FIFO. The insight is that reversing a sequence twice restores its original order. Pushing elements onto one stack reverses them; moving them to a second stack reverses them again, putting the oldest element on top.

## The two-stack design

Use an \`in\` stack for arriving elements and an \`out\` stack for departing ones:

- **enqueue(x)**: push x onto \`in\`
- **dequeue()**: if \`out\` is empty, pop everything from \`in\` and push it onto \`out\`; then pop from \`out\`
- **peek()**: same transfer rule, then peek at \`out\`

~~~java
class MyQueue {
    private final Deque<Integer> in = new ArrayDeque<>();
    private final Deque<Integer> out = new ArrayDeque<>();

    void push(int x) { in.push(x); }

    int pop() { moveIfNeeded(); return out.pop(); }

    int peek() { moveIfNeeded(); return out.peek(); }

    boolean empty() { return in.isEmpty() && out.isEmpty(); }

    private void moveIfNeeded() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
    }
}
~~~

## The crucial rule

Transfer only when \`out\` is empty. If you moved elements while \`out\` still had some, newer elements would land on top of older ones in \`out\`, and the order would break. With the rule, every element in \`out\` is older than every element in \`in\`, and \`out\` holds its elements oldest on top. That invariant is what makes the design correct.

## Tracing it

Enqueue 1, 2 and 3, then dequeue twice, enqueue 4, and dequeue twice more:

| Operation | in (top last) | out (top last) | Returns |
|---|---|---|---|
| push 1, 2, 3 | 1, 2, 3 | (empty) | |
| pop | (empty) | 3, 2 | 1 (after moving all three) |
| pop | (empty) | 3 | 2 |
| push 4 | 4 | 3 | |
| pop | 4 | (empty) | 3 |
| pop | (empty) | (empty) | 4 (after moving 4) |

The output order is 1, 2, 3, 4: FIFO, as required.

## Amortized analysis

A single dequeue can cost O(n) when it triggers a transfer of n elements. But consider the life of one element: it's pushed onto \`in\` once, popped from \`in\` once, pushed onto \`out\` once, and popped from \`out\` once. That's four stack operations per element over its whole lifetime, no matter how operations interleave.

So any sequence of n queue operations performs at most 4n stack operations in total, and each queue operation costs O(1) **amortized**. The expensive transfer is paid for by the cheap pushes that came before it. This is the same reasoning used for dynamic array growth, where an occasional O(n) copy is spread across many O(1) appends.

## Amortized versus worst case

Amortized O(1) is a guarantee about total cost over a sequence, not about each operation. One dequeue can still take O(n). For most applications that's fine. For real-time systems that can't tolerate an occasional slow operation, such as audio processing, a worst-case O(1) queue, such as a circular buffer, is the better choice. Mentioning this distinction shows depth.

## A costly-push alternative

Another design keeps the queue's order in one stack at all times. On every enqueue, move everything to a helper stack, push the new element, and move everything back. Dequeue is then a single pop. But every enqueue costs O(n), with no amortization, because elements are moved repeatedly. The lazy two-stack design is strictly better in total work.

## A stack from queues

The reverse problem builds a LIFO stack from FIFO queues. With one queue: on push, add the new element, then rotate the queue by removing and re-adding the other size − 1 elements, so the newest element reaches the front. Pop and top then work on the front in O(1), while push costs O(n). Two-queue versions exist, but they don't improve the complexity; one of push or pop must be O(n), because a queue offers no way to reach its newest element cheaply.

## Why the design matters

Beyond interviews, the two-stack queue shows up in functional programming. Immutable lists support O(1) operations only at the front, so persistent queues in languages such as Haskell and Scala are built from two lists in this way. It's also used to build a queue that reports its minimum in O(1): implement each of the two stacks as a min stack, and the queue's minimum is the smaller of the two stacks' minimums.

## How interviewers test this

Expect "Implement a queue using stacks" and "Implement a stack using queues." Explain the transfer-only-when-empty rule, trace a mixed sequence of operations, and give the per-element argument for amortized O(1). Contrast amortized and worst-case guarantees to finish strongly.`,
    sources: [ODS, TIH, MIT_6006]
  },

  "how-hashmap-works": {
    theory: `A hash map stores key-value pairs and finds any key in O(1) time on average. It does this by converting each key into an array index with a hash function, so a lookup goes straight to the right slot instead of searching. This lesson explains hashing, how Java's \`HashMap\` resolves collisions, what the load factor controls, why the \`equals\` and \`hashCode\` contract matters, and when performance degrades.

## The core idea

An array gives O(1) access by index, but keys are often strings or objects, not small integers. A **hash function** turns a key into an integer, and taking that integer modulo the array size gives a slot, called a **bucket**. To find the key later, compute the same hash and look in the same bucket.

~~~text
bucket index = hash(key) mod (number of buckets)
~~~

A good hash function is deterministic, fast, and spreads keys evenly across buckets.

## Collisions

Different keys can map to the same bucket; with more possible keys than buckets, collisions are guaranteed. There are two main strategies for handling them:

- **Separate chaining**: each bucket holds a list of entries. Lookup hashes to the bucket and scans its list comparing keys
- **Open addressing**: all entries live in the array itself. On a collision, probe other slots in a fixed sequence, such as the next slot (linear probing), until finding an empty one or the key

Java's \`HashMap\` uses separate chaining. Python's \`dict\` uses open addressing.

## Inside Java's HashMap

Java's \`HashMap\` keeps an array of buckets whose length is always a power of two, starting at 16. To compute an index, it takes the key's \`hashCode()\`, mixes the high bits into the low bits with \`h ^ (h >>> 16)\`, then uses \`hash & (n - 1)\`, which equals \`hash mod n\` when n is a power of two but runs faster.

Each bucket holds a linked list of entries. Since Java 8, when a single bucket accumulates more than 8 entries and the table has at least 64 buckets, the list converts into a red-black tree. That caps the worst case for that bucket at O(log n) instead of O(n), which protects against poor hash codes and deliberate collision attacks.

## Load factor and resizing

The **load factor** is the ratio of entries to buckets. Java's default threshold is 0.75: when the number of entries exceeds 75% of the bucket count, the table doubles in size and every entry is redistributed, called **rehashing**.

The threshold is a trade-off. A lower load factor means fewer collisions and faster lookups but more wasted memory; a higher one saves memory but lengthens chains. Resizing costs O(n), but because the table doubles, its cost is spread across all insertions, so \`put\` stays O(1) amortized. If you know the size in advance, pass an initial capacity to the constructor to avoid repeated resizing.

## The equals and hashCode contract

\`HashMap\` relies on two methods of the key:

- \`hashCode()\` picks the bucket
- \`equals()\` confirms which entry in the bucket matches

The contract: if \`a.equals(b)\` is true, then \`a.hashCode() == b.hashCode()\` must also be true. If you override \`equals\` in your own class without overriding \`hashCode\`, two equal objects can land in different buckets, and \`map.get\` won't find a key you inserted. Always override both together, using the same fields. \`Objects.hash(field1, field2)\` builds a reasonable hash code, and Java records generate both methods correctly.

## Mutable keys

Never change a key's fields after inserting it. Its hash code changes, but it stays in the bucket chosen by the old hash, so lookups search the wrong bucket and the entry is effectively lost. This is one reason strings, which are immutable, make ideal keys.

## Complexity

| Operation | Average | Worst case |
|---|---|---|
| put, get, remove, containsKey | O(1) | O(log n) per bucket in Java 8+; O(n) with plain chaining |
| Iterating over all entries | O(n + capacity) | O(n + capacity) |

The average case assumes a hash function that spreads keys well. Iteration order in a \`HashMap\` isn't defined and can change after a resize. \`LinkedHashMap\` keeps insertion order, or access order for building LRU caches. \`TreeMap\` keeps keys sorted, using a red-black tree with O(log n) operations, and supports range queries such as \`floorKey\` and \`ceilingKey\`.

## HashSet

\`HashSet\` is a \`HashMap\` where the keys are the set's elements and the values are a shared dummy object. Everything above applies: O(1) average \`add\`, \`contains\` and \`remove\`, with the same \`equals\` and \`hashCode\` requirements.

## Hash flooding

If attackers know the hash function, they can submit many keys that collide, turning O(1) operations into slow ones and overloading a server. This attack hit many web frameworks in 2011. Defences include randomized hash seeds, used by Python, and tree-based buckets, used by Java.

## How interviewers test this

Expect "How does HashMap work internally?", "What happens on a collision?", "What's the load factor?" and "Why must equals and hashCode be consistent?" Cover hashing to a bucket, chaining with treeification in Java 8, resizing at 0.75 with amortized O(1), and the contract with a broken-key example.`,
    sources: [JAVA_API, ODS, MIT_6006]
  },

  "hashing-patterns": {
    theory: `Hash maps and hash sets turn slow searches into O(1) lookups, and a handful of patterns built on them solve a large share of interview problems. This lesson covers the main ones: frequency counting, seen-before checks, grouping by a computed key, and the longest consecutive sequence, which shows how a set can replace sorting. For each, it explains the clue in the problem that points to it.

## Frequency counting

Counting how often each element appears is the most common hashing pattern:

~~~java
Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) freq.merge(x, 1, Integer::sum);
~~~

\`merge\` inserts 1 for a new key or adds 1 to an existing count. \`getOrDefault(x, 0) + 1\` with \`put\` does the same in a more familiar form. For small known ranges, such as lowercase letters, an \`int[26]\` array is faster and avoids boxing.

Problems that use counting include:

- **First unique character**: count all characters, then scan again for the first with count 1
- **Majority element**: find the element appearing more than n/2 times. Counting works in O(n) space; the Boyer-Moore voting algorithm finds it in O(1) space by cancelling pairs of different elements
- **Top k frequent elements**: count, then use a heap of size k or bucket sort by frequency
- **Ransom note**: check that one string's character counts cover another's

## Seen-before checks

A hash set answers "have I seen this before?" in O(1):

- **Contains duplicate**: add elements to a set; if \`add\` returns \`false\`, the element was already present
- **Two Sum**: check whether the complement of the current element has been seen
- **Intersection of two arrays**: put one array in a set and check the other's elements against it
- **Happy number**: detect a repeated value in a sequence, which signals a loop

The clue for this pattern is any brute-force solution that searches earlier elements for a match. Replacing the search with a set or map lookup typically drops a factor of n.

## Grouping by a computed key

When items belong together because they share some property, compute that property as a key and group items in a map of lists:

~~~java
Map<String, List<String>> groups = new HashMap<>();
for (String w : words) {
    char[] c = w.toCharArray();
    Arrays.sort(c);
    groups.computeIfAbsent(new String(c), k -> new ArrayList<>()).add(w);
}
~~~

Grouping anagrams uses the sorted letters as the key. Other keys: the differences between consecutive characters for shifted strings such as \`"abc"\` and \`"bcd"\`, or the slope between two points for finding the most points on a line. The design work is choosing a key that's identical exactly when items belong together.

## Index maps

Sometimes you need positions, not counts. A map from value to its last index helps with:

- **Two Sum**, which returns indices
- **Contains duplicate within distance k**: store each value's latest index and check the gap
- **Longest substring without repeating characters**: jump the window's start past the previous occurrence

## Longest consecutive sequence

Given an unsorted array, find the length of the longest run of consecutive integers. In \`[100, 4, 200, 1, 3, 2]\`, the run 1, 2, 3, 4 has length 4. Sorting solves it in O(n log n), but the problem asks for O(n).

Put every number in a set. A number starts a run only if \`num - 1\` isn't in the set. For each such start, count upward while the next number exists:

~~~java
Set<Integer> set = new HashSet<>();
for (int x : nums) set.add(x);
int best = 0;
for (int x : set) {
    if (!set.contains(x - 1)) {
        int length = 1;
        while (set.contains(x + length)) length++;
        best = Math.max(best, length);
    }
}
~~~

The inner loop looks quadratic, but it only runs from run starts, and each number is visited by at most one run. So the total work is O(n). Iterating over the set rather than the array also avoids repeated work on duplicates.

## Choosing between a set, a map and an array

| Need | Structure |
|---|---|
| Membership only | \`HashSet\` |
| Counts or indices per key | \`HashMap\` |
| Keys in a small, known integer range | Plain array |
| Sorted keys or nearest-key queries | \`TreeMap\` or \`TreeSet\` |

Arrays are fastest when they fit. \`TreeMap\` costs O(log n) per operation but answers "the largest key below x" queries that hash maps can't.

## Costs to remember

Hashing trades memory for time: an O(n)-space map often replaces an O(n²) search. Hash maps in Java carry a large constant per entry, and boxing integers adds more. When asked for O(1) extra space, look for sorting with two pointers, or in-place tricks such as marking indices with negative signs when values fall in the range 1 to n.

## How interviewers test this

Expect contains duplicate, top k frequent, group anagrams, longest consecutive sequence and first unique character. Name the pattern, explain what the map or set stores, and state the space cost. For longest consecutive sequence, explain why checking \`num - 1\` keeps the total work linear.`,
    sources: [TIH, JAVA_API, THE_ALGORITHMS]
  },

  "prefix-sum-with-hashmap": {
    theory: `Combining prefix sums with a hash map solves subarray problems that sliding windows can't, especially when the array contains negative numbers. The idea: a subarray's sum is the difference of two prefix sums, so finding subarrays with a target sum becomes finding earlier prefix sums with a target difference, which is a hash map lookup. This lesson derives the technique on subarray sum equals k, then applies it to divisibility, balanced binary arrays and the longest subarray variants.

## The problem

Given an array of integers, which may be negative, and a target k, count the subarrays whose sum equals k. For \`[1, 1, 1]\` with k = 2, the answer is 2: the first two elements and the last two.

Checking every subarray with a running sum costs O(n²). A sliding window fails because, with negative numbers, extending a window can decrease its sum, so you can't decide when to shrink.

## The key identity

Define \`prefix[i]\` as the sum of the first i elements. The sum of the subarray from index j to index i − 1 is:

~~~text
sum(j .. i-1) = prefix[i] - prefix[j]
~~~

You want this to equal k, which means \`prefix[j] = prefix[i] - k\`. So for each position i, the number of subarrays ending there with sum k equals the number of earlier prefix sums equal to \`prefix[i] - k\`. A hash map from prefix sum to how many times it has occurred answers that in O(1).

## The algorithm

~~~java
int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    count.put(0, 1);              // the empty prefix
    int prefix = 0, result = 0;
    for (int x : nums) {
        prefix += x;
        result += count.getOrDefault(prefix - k, 0);
        count.merge(prefix, 1, Integer::sum);
    }
    return result;
}
~~~

This runs in O(n) time with O(n) space.

## Why seed the map with 0

The entry \`count.put(0, 1)\` represents the empty prefix before the first element. Without it, subarrays starting at index 0 are missed. For \`[3]\` with k = 3, the prefix sum after the first element is 3, and 3 − 3 = 0 must be found in the map. Forgetting this seed is the most common bug.

## Order matters

Look up \`prefix - k\` **before** adding the current prefix to the map. If you add first, then when k = 0, the current prefix matches itself, counting an empty subarray that doesn't exist.

## Tracing an example

For \`[1, 2, 3]\` with k = 3:

| Element | Prefix | Looking for | Found | Result | Map after |
|---|---|---|---|---|---|
| (start) | 0 | | | 0 | {0: 1} |
| 1 | 1 | -2 | 0 | 0 | {0: 1, 1: 1} |
| 2 | 3 | 0 | 1 | 1 | {0: 1, 1: 1, 3: 1} |
| 3 | 6 | 3 | 1 | 2 | {..., 6: 1} |

The two subarrays are \`[1, 2]\` and \`[3]\`.

## Longest subarray with sum k

To find the longest such subarray instead of counting them, store each prefix sum's **first** index rather than its count. For each position, if \`prefix - k\` was seen at index j, the subarray length is i − j. Only record a prefix sum's index the first time it appears, because the earliest occurrence gives the longest subarray. Seed the map with prefix 0 at index −1.

## Balanced binary arrays

To find the longest subarray with equal numbers of 0s and 1s, replace every 0 with −1. A balanced subarray then sums to 0, which is the longest-subarray-with-sum-k problem with k = 0. Transforming the input so a known technique applies is a powerful general move.

## Divisibility

To count subarrays whose sum is divisible by k, use the fact that a subarray sum is divisible by k exactly when its two prefix sums have the same remainder modulo k. So count prefix remainders in a map, or an array of size k, and for each position add the number of earlier prefixes with the same remainder.

Java's \`%\` can return a negative result for negative numbers: \`-1 % 5\` is \`-1\`. Normalize with \`((prefix % k) + k) % k\` so equal remainders match.

## Beyond sums

The technique applies whenever a quantity over a range is a difference of prefix values:

- **Prefix XOR**: the XOR of a subarray is \`prefixXor[i] ^ prefixXor[j]\`, so counting subarrays with XOR equal to k uses the same map
- **Paths in a tree summing to a target**: run the same counting over root-to-node prefix sums during DFS, removing each prefix from the map when backtracking
- **2D submatrix sums**: fix a pair of rows, compress columns into a 1D array of sums, and apply the 1D technique

## Choosing the right tool

| Situation | Technique |
|---|---|
| All values non-negative, longest or shortest window | Sliding window, O(1) space |
| Negative values allowed, count or find target sums | Prefix sum with hash map |
| Many range-sum queries, no target | Plain prefix sum array |

## How interviewers test this

Expect subarray sum equals k, continuous subarray sum, contiguous array of 0s and 1s, and subarray sums divisible by k. Derive the identity \`prefix[i] - prefix[j] = k\`, explain the seed value, check before inserting, and explain why a sliding window fails with negative numbers.`,
    sources: [TIH, CP_ALGO, THE_ALGORITHMS]
  }
};
