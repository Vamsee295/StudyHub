# Linked lists (Striver A2Z linked list step, NeetCode). Reference solutions work on Python lists of values;
# students get real ListNode objects in every language.
LL = "Linked List"
NOTE = "The list is given as values in order; your function receives its head ListNode (fields val and next)."

Q(LL, "remove-list-elements", "Remove Linked List Elements", "Easy", "removeElements(head: ListNode, val: int) -> ListNode",
  ["Remove every node whose value equals val and return the new head.", NOTE],
  [C([1, 2, 6, 3, 4, 5, 6], 6), C([], 1), C([7, 7, 7, 7], 7), C(rl(12, 0, 4), 2)], lambda h, v: [x for x in h if x != v],
  "A dummy node before head makes removing the head the same as any other node.")

Q(LL, "list-length", "Length of a Linked List", "Easy", "getLength(head: ListNode) -> int",
  ["Return the number of nodes in the list.", NOTE], [C([1, 2, 3, 4]), C([]), C([9]), C(rl(25))], lambda h: len(h),
  "Walk the list with a pointer, counting nodes until null.")

Q(LL, "search-in-list", "Search in a Linked List", "Easy", "searchKey(head: ListNode, key: int) -> boolean",
  ["Return true if some node holds key.", NOTE], [C([1, 2, 3, 4], 3), C([1, 2, 3], 5), C([], 0), C([5], 5)], lambda h, k: k in h,
  "Traverse until you find key or reach null.")

Q(LL, "insert-at-position", "Insert into a Linked List", "Easy", "insertAt(head: ListNode, pos: int, val: int) -> ListNode",
  ["Insert a new node with value val so it ends up at index pos (0 = new head; pos equal to the length appends). Return the head.", NOTE],
  [C([1, 2, 3], 1, 9), C([1, 2, 3], 0, 9), C([1, 2, 3], 3, 9), C([], 0, 4)], lambda h, p, v: h[:p] + [v] + h[p:],
  "Walk to the node before position pos and splice the new node in; pos 0 replaces the head.")

Q(LL, "delete-at-position", "Delete a Node at a Position", "Easy", "deleteAt(head: ListNode, pos: int) -> ListNode",
  ["Delete the node at index pos (0-based, always valid) and return the head.", NOTE],
  [C([1, 2, 3, 4], 2), C([1, 2, 3, 4], 0), C([5], 0), C([1, 2, 3], 2)], lambda h, p: h[:p] + h[p + 1:],
  "Stop at the node before pos and set its next to next.next.")

Q(LL, "rotate-list", "Rotate List", "Medium", "rotateRight(head: ListNode, k: int) -> ListNode",
  ["Rotate the list to the right by k places and return the new head.", NOTE],
  [C([1, 2, 3, 4, 5], 2), C([0, 1, 2], 4), C([], 3), C([1], 99), C(rl(9), 1000000)],
  lambda h, k: h[-(k % len(h)):] + h[:-(k % len(h))] if h and k % len(h) else h,
  "Find the length and tail, join tail to head, then cut at length - k % length.")

Q(LL, "reverse-list-ii", "Reverse Linked List II", "Medium", "reverseBetween(head: ListNode, left: int, right: int) -> ListNode",
  ["Reverse the nodes from position left to position right (1-based, inclusive) and return the head.", NOTE],
  [C([1, 2, 3, 4, 5], 2, 4), C([5], 1, 1), C([3, 5], 1, 2), C(list(range(1, 11)), 3, 8)], lambda h, l, r: h[: l - 1] + h[l - 1: r][::-1] + h[r:],
  "Walk to the node before left, then repeatedly move the next node to the front of the reversed part.")

Q(LL, "swap-nodes-in-pairs", "Swap Nodes in Pairs", "Medium", "swapPairs(head: ListNode) -> ListNode",
  ["Swap every two adjacent nodes (swap the nodes, not just the values) and return the head.", NOTE],
  [C([1, 2, 3, 4]), C([]), C([1]), C([1, 2, 3]), C(rl(10))], lambda h: [x for i in range(0, len(h), 2) for x in h[i:i + 2][::-1]],
  "With a dummy: point prev at second, first at the rest, second at first; move prev two nodes on.")

Q(LL, "reverse-k-group", "Reverse Nodes in k-Group", "Hard", "reverseKGroup(head: ListNode, k: int) -> ListNode",
  ["Reverse the nodes of the list k at a time. A final group with fewer than k nodes stays as it is.", NOTE],
  [C([1, 2, 3, 4, 5], 2), C([1, 2, 3, 4, 5], 3), C([1], 1), C(list(range(1, 12)), 4)],
  lambda h, k: [x for i in range(0, len(h), k) for x in (h[i:i + k][::-1] if len(h[i:i + k]) == k else h[i:i + k])],
  "Check that k nodes remain, reverse them, connect to the previous group's tail, repeat.")

Q(LL, "sort-list", "Sort List", "Medium", "sortList(head: ListNode) -> ListNode",
  ["Sort the list in ascending order. Aim for O(n log n) time (merge sort on the list).", NOTE],
  [C([4, 2, 1, 3]), C([-1, 5, 3, 4, 0]), C([]), C(rl(30))], lambda h: sorted(h), "Split at the middle with slow/fast pointers, sort both halves, merge.", ["Sorting", "Divide and Conquer"])

Q(LL, "partition-list", "Partition List", "Medium", "partition(head: ListNode, x: int) -> ListNode",
  ["Rearrange the list so all nodes with value less than x come before nodes with value >= x, keeping the original order within each part.", NOTE],
  [C([1, 4, 3, 2, 5, 2], 3), C([2, 1], 2), C([], 0), C(rl(12, 0, 9), 5)], lambda h, x: [v for v in h if v < x] + [v for v in h if v >= x],
  "Build two lists (less, rest) with dummy heads and join them.", ["Two Pointers"])

Q(LL, "remove-duplicates-ii-list", "Remove Duplicates from Sorted List II", "Medium", "deleteDuplicates(head: ListNode) -> ListNode",
  ["The list is sorted. Delete every node whose value is duplicated, keeping only values that appear once.", NOTE],
  [C([1, 2, 3, 3, 4, 4, 5]), C([1, 1, 1, 2, 3]), C([]), C([1, 1]), C(sorted(rl(15, 0, 8)))], lambda h: [v for v in h if h.count(v) == 1],
  "With a dummy: when a run of equal values starts, skip the whole run.")

Q(LL, "add-two-numbers-ii", "Add Two Numbers II", "Medium", "addTwoNumbers(l1: ListNode, l2: ListNode) -> ListNode",
  ["Each list stores a non-negative number with its most significant digit first. Return their sum as a list in the same order.", NOTE],
  [C([7, 2, 4, 3], [5, 6, 4]), C([2, 4, 3], [5, 6, 4]), C([0], [0]), C([9, 9, 9], [1])], lambda a, b: [int(c) for c in str(int("".join(map(str, a))) + int("".join(map(str, b))))],
  "Push digits on two stacks (or reverse both lists), add from the back with a carry.", ["Math", "Stack"])

Q(LL, "sort-012-list", "Sort a Linked List of 0s, 1s and 2s", "Medium", "sortList012(head: ListNode) -> ListNode",
  ["The list holds only 0, 1 and 2. Sort it by relinking nodes (not by counting and overwriting).", NOTE],
  [C([1, 2, 2, 1, 2, 0, 2, 2]), C([2, 2, 0, 1]), C([0]), C([rng.randint(0, 2) for _ in range(20)])], lambda h: sorted(h),
  "Three dummy lists for 0s, 1s and 2s; join them at the end.")

Q(LL, "reorder-list", "Reorder List", "Medium", "reorderList(head: ListNode) -> ListNode",
  ["Reorder L0 -> L1 -> ... -> Ln into L0 -> Ln -> L1 -> Ln-1 -> L2 -> ... and return the head.", NOTE],
  [C([1, 2, 3, 4]), C([1, 2, 3, 4, 5]), C([1]), C(list(range(1, 10)))], lambda h: [h[i // 2] if i % 2 == 0 else h[-(i // 2 + 1)] for i in range(len(h))],
  "Find the middle, reverse the second half, then weave the two halves together.", ["Two Pointers", "Stack"])

Q(LL, "delete-middle-node", "Delete the Middle Node of a Linked List", "Medium", "deleteMiddle(head: ListNode) -> ListNode",
  ["Delete the middle node (index floor(n / 2), 0-based) and return the head. A single-node list becomes empty.", NOTE],
  [C([1, 3, 4, 7, 1, 2, 6]), C([1, 2, 3, 4]), C([2, 1]), C([5])], lambda h: h[: len(h) // 2] + h[len(h) // 2 + 1:], "Slow/fast pointers, with slow stopping one node before the middle.", ["Two Pointers"])

Q(LL, "double-a-number", "Double a Number Represented as a Linked List", "Medium", "doubleIt(head: ListNode) -> ListNode",
  ["The list holds a non-negative number's digits, most significant first (no leading zeros except 0 itself). Return the list for twice that number.", NOTE],
  [C([1, 8, 9]), C([9, 9, 9]), C([0]), C([5, 0, 0])], lambda h: [int(c) for c in str(int("".join(map(str, h))) * 2)],
  "A digit's carry depends only on whether the next digit is >= 5, so one forward pass works.", ["Math"])

Q(LL, "merge-nodes-between-zeros", "Merge Nodes in Between Zeros", "Medium", "mergeNodes(head: ListNode) -> ListNode",
  ["The list starts and ends with 0 and has no two consecutive 0s. Replace each group of nodes between two 0s by one node holding their sum, and remove the 0s.", NOTE],
  [C([0, 3, 1, 0, 4, 5, 2, 0]), C([0, 1, 0, 3, 0, 2, 2, 0]), C([0, 7, 0])], lambda h: [sum(g) for k, g in itertools.groupby(h, key=bool) if k],
  "Walk the list summing values; at each 0, emit the sum.")

Q(LL, "binary-list-to-integer", "Convert Binary Number in a Linked List to Integer", "Easy", "getDecimalValue(head: ListNode) -> int",
  ["Each node holds a bit, most significant first. Return the number's decimal value.", NOTE],
  [C([1, 0, 1]), C([0]), C([1, 1, 1, 1]), C([1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0])], lambda h: int("".join(map(str, h)), 2),
  "value = value * 2 + node.val for each node.", ["Math", "Bit Manipulation"])

Q(LL, "remove-nodes-greater-right", "Remove Nodes From Linked List", "Medium", "removeNodes(head: ListNode) -> ListNode",
  ["Remove every node that has a node with a strictly greater value anywhere to its right.", NOTE],
  [C([5, 2, 13, 3, 8]), C([1, 1, 1, 1]), C([9]), C(rl(12, 0, 20))], lambda h: [x for i, x in enumerate(h) if all(x >= y for y in h[i + 1:])],
  "Reverse, keep a running maximum dropping smaller nodes, reverse back. Or a monotonic stack.", ["Monotonic Stack", "Recursion"])

Q(LL, "swap-kth-nodes", "Swapping Nodes in a Linked List", "Medium", "swapNodes(head: ListNode, k: int) -> ListNode",
  ["Swap the values of the k-th node from the start and the k-th node from the end (1-based) and return the head.", NOTE],
  [C([1, 2, 3, 4, 5], 2), C([7, 9, 6, 6, 7, 8, 3, 0, 9, 5], 5), C([1], 1), C([1, 2], 1)], lambda h, k: _swap_k(h, k),
  "A pointer k - 1 steps ahead, then move both until the lead reaches the end.", ["Two Pointers"])

Q(LL, "maximum-twin-sum", "Maximum Twin Sum of a Linked List", "Medium", "pairSum(head: ListNode) -> int",
  ["The list has even length n. Node i and node n - 1 - i are twins. Return the maximum twin sum.", NOTE],
  [C([5, 4, 2, 1]), C([4, 2, 2, 3]), C([1, 100000]), C(rl(12, 1, 50))], lambda h: max(h[i] + h[-1 - i] for i in range(len(h) // 2)),
  "Reverse the second half, then walk both halves together.", ["Two Pointers", "Stack"])

Q(LL, "insert-gcd-nodes", "Insert Greatest Common Divisors in Linked List", "Medium", "insertGreatestCommonDivisors(head: ListNode) -> ListNode",
  ["Between every pair of adjacent nodes, insert a node holding their greatest common divisor.", NOTE],
  [C([18, 6, 10, 3]), C([7]), C([12, 8]), C(rl(8, 1, 60))], lambda h: [x for a, b in zip(h, h[1:]) for x in (a, math.gcd(a, b))] + h[-1:],
  "For each node with a next, splice in new ListNode(gcd(a, b)) and skip over it.", ["Math"])


def _swap_k(h, k):
    h = h[:]
    h[k - 1], h[-k] = h[-k], h[k - 1]
    return h
