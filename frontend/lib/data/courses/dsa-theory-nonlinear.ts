// Long-form theory for DSA trees, heaps and graphs. Original writing.
import { LessonTheory } from './utils';
import { ODS, THE_ALGORITHMS, TIH, CP_ALGO, MIT_6006, JAVA_API } from './dsa-theory-sources';

export const dsaNonlinearTheory: Record<string, LessonTheory> = {
  "binary-tree-traversals": {
    theory: `A binary tree is a hierarchy where each node has at most two children, called left and right. Trees model file systems, organization charts, expression parsing and database indexes, and they're the most common data structure in coding interviews after arrays. This lesson explains tree vocabulary, the three depth-first traversals, how to think recursively about trees, and how to traverse without recursion.

## Vocabulary

A tree starts at the **root**. Each node has a value and references to up to two children. Nodes without children are **leaves**. Other terms you'll need:

- **Depth** of a node: the number of edges from the root to it; the root has depth 0
- **Height** of a tree: the number of edges on the longest path from the root to a leaf; some sources count nodes instead, so state your convention
- **Subtree**: a node together with all its descendants
- **Full binary tree**: every node has 0 or 2 children
- **Complete binary tree**: every level is full except possibly the last, which fills from the left; heaps use this shape
- **Balanced tree**: the heights of left and right subtrees differ by a small amount at every node, keeping the height around log n

~~~java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
~~~

A balanced tree with n nodes has height about log₂ n, while a degenerate tree, where every node has one child, has height n − 1 and behaves like a linked list. Many tree algorithms cost O(h), so this difference matters.

## The three depth-first traversals

Depth-first traversals visit a whole subtree before moving on. They differ only in when the current node is processed relative to its subtrees:

| Traversal | Order | Typical use |
|---|---|---|
| Pre-order | Node, left, right | Copying or serializing a tree |
| In-order | Left, node, right | Visiting a binary search tree in sorted order |
| Post-order | Left, right, node | Deleting a tree, computing sizes or heights |

For the tree with root 1, left child 2 (with children 4 and 5) and right child 3, pre-order gives 1, 2, 4, 5, 3; in-order gives 4, 2, 5, 1, 3; and post-order gives 4, 5, 2, 3, 1.

## Recursive traversal

Recursion matches the tree's shape: a tree is a node plus two smaller trees.

~~~java
void inorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    inorder(node.left, out);
    out.add(node.val);
    inorder(node.right, out);
}
~~~

Moving the \`out.add\` line before or after the recursive calls gives pre-order or post-order. Each node is visited once, so traversal is O(n) time. The recursion stack uses O(h) space: O(log n) for a balanced tree and O(n) for a degenerate one.

## Thinking recursively

Most tree problems follow one template: solve the problem for the left and right subtrees, then combine the results at the current node. Computing the height:

~~~java
int height(TreeNode node) {
    if (node == null) return -1;   // edges convention: a leaf has height 0
    return 1 + Math.max(height(node.left), height(node.right));
}
~~~

The pattern is post-order: children's answers come first. Other problems that fit it include counting nodes, summing values, checking whether two trees are identical, mirroring a tree and checking whether a tree is symmetric. Trust the recursive call to return the right answer for its subtree, and focus on the combining step and the base case.

## Passing information down

Some problems pass information from parent to child instead, which is pre-order style. To check whether any root-to-leaf path sums to a target, pass the remaining sum down: at each node, subtract its value, and at a leaf, check whether the remainder is zero. Problems often combine both directions: pass constraints down and return results up.

## Iterative traversal

An explicit stack replaces the call stack, which avoids \`StackOverflowError\` on deep trees. Iterative pre-order pushes the right child before the left, so the left is processed first:

~~~java
Deque<TreeNode> stack = new ArrayDeque<>();
if (root != null) stack.push(root);
while (!stack.isEmpty()) {
    TreeNode node = stack.pop();
    out.add(node.val);
    if (node.right != null) stack.push(node.right);
    if (node.left != null) stack.push(node.left);
}
~~~

Iterative in-order walks left as far as possible, pushing nodes, then pops a node, visits it, and moves to its right child. Iterative post-order is trickiest; one approach runs a modified pre-order (node, right, left) and reverses the output.

## Morris traversal

Morris traversal performs an in-order traversal in O(1) extra space by temporarily linking each node's in-order predecessor back to it, then removing the link on the second visit. It modifies the tree during the traversal, so it's rarely used in practice, but it's a known answer when an interviewer asks for constant space.

## Reconstructing trees

Pre-order plus in-order uniquely determines a binary tree with distinct values. The first pre-order value is the root; its position in the in-order sequence splits the remaining values into left and right subtrees. A hash map from value to in-order index makes this O(n). Pre-order and post-order together don't uniquely determine a general binary tree.

## How interviewers test this

Expect to write all three traversals recursively and at least one iteratively, compute height or size, and solve "combine children's answers" problems such as symmetric tree and path sum. State the traversal order you're using and the O(h) space cost of recursion.`,
    sources: [ODS, TIH, THE_ALGORITHMS]
  },

  "level-order-traversal": {
    theory: `Level-order traversal visits a tree level by level, from the root downward and left to right within each level. It's breadth-first search applied to trees, and it uses a queue instead of recursion. Any question involving levels, such as the right side view, the maximum width or the minimum depth, points to it. This lesson explains the algorithm, the level-size technique for processing one level at a time, and the problems built on it.

## Why a queue

Depth-first traversal goes deep before going wide, and a stack, explicit or the call stack, drives it. Level-order needs the opposite: finish all nodes at depth d before any at depth d + 1. A FIFO queue gives exactly that, because children are added behind every node already waiting.

## The basic algorithm

~~~java
List<Integer> levelOrder(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    if (root == null) return out;
    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        TreeNode node = q.poll();
        out.add(node.val);
        if (node.left != null) q.offer(node.left);
        if (node.right != null) q.offer(node.right);
    }
    return out;
}
~~~

Every node enters and leaves the queue once, so the time is O(n). The queue holds at most one level plus part of the next, so space is O(w), where w is the maximum width of the tree. For a complete binary tree, the last level holds about n/2 nodes, so space is O(n).

## Processing one level at a time

Many problems need to know where each level ends. Record the queue's size at the start of each level; exactly that many nodes belong to the current level:

~~~java
while (!q.isEmpty()) {
    int levelSize = q.size();
    List<Integer> level = new ArrayList<>();
    for (int i = 0; i < levelSize; i++) {
        TreeNode node = q.poll();
        level.add(node.val);
        if (node.left != null) q.offer(node.left);
        if (node.right != null) q.offer(node.right);
    }
    result.add(level);
}
~~~

Children added during the loop belong to the next level, and the fixed \`levelSize\` keeps them out of the current one. Reading \`q.size()\` inside the loop condition instead of saving it first is a classic bug, because the size changes as children are added.

## Problems built on levels

Once you can process one level at a time, many problems become small changes:

- **Right side view**: record the last node of each level
- **Level averages or maximums**: aggregate each level's values
- **Zigzag order**: alternate the direction in which each level's values are added, or reverse every other level
- **Bottom-up order**: collect levels normally, then reverse the list of levels
- **Connect next pointers**: link each node to the next node in its level

## Minimum depth

The minimum depth is the number of nodes on the shortest path from the root to a leaf. BFS finds it efficiently: the first leaf reached in level order is the nearest one, so you can stop immediately. A DFS solution must explore the whole tree. One trap applies to both: a node with only one child isn't a leaf, so the recursive \`1 + min(left, right)\` gives a wrong answer when one child is \`null\`.

This early stop illustrates the general rule: BFS finds the shortest path, in edges, in any unweighted structure, because it explores in order of distance.

## Maximum width

The width of a level is the distance between its leftmost and rightmost non-null nodes, counting the gaps. Number nodes as in a heap: if a node has index i, its children have 2i and 2i + 1. The width of a level is the last index minus the first index plus one. To prevent the indices from overflowing in deep trees, subtract the level's first index from every index in that level before computing children.

## Serializing a tree

Level-order is a natural format for writing a tree to a string, including \`null\` markers for missing children: \`[1, 2, 3, null, 4]\`. Deserializing reads the values in the same order, using a queue of parents waiting for children. This is the format used by many coding platforms to describe trees.

## DFS can do it too

Level-order questions can also be solved with DFS by passing the depth as a parameter and storing results by depth: for the right side view, visit the right child first and record the first node seen at each new depth. DFS uses O(h) space instead of O(w), which is better for wide, shallow trees and worse for deep, narrow ones.

## How interviewers test this

Expect level-order traversal, zigzag order, right side view, minimum depth and maximum width. Use the saved level size to separate levels, explain why BFS finds the minimum depth first, and compare the O(w) space of BFS with the O(h) space of DFS.`,
    sources: [TIH, ODS, THE_ALGORITHMS]
  },

  "binary-search-trees": {
    theory: `A binary search tree (BST) keeps its values ordered: every value in a node's left subtree is smaller than the node's value, and every value in its right subtree is larger. That ordering lets search, insertion and deletion skip half of the remaining tree at each step, as long as the tree stays balanced. This lesson explains the BST property, the core operations, validation, deletion, the balance problem, and how Java's \`TreeMap\` solves it.

## The BST property

For every node, all values in the left subtree are less than the node's value, and all values in the right subtree are greater. The property applies to whole subtrees, not only to immediate children. A tree where 10 has left child 5, and 5 has right child 12, satisfies the rule at node 5, but violates it at node 10, because 12 sits in 10's left subtree.

An in-order traversal of a BST visits values in sorted order. Many BST problems rely on this fact.

## Searching

Compare the target with the current node, and go left if it's smaller or right if it's larger:

~~~java
TreeNode search(TreeNode node, int target) {
    while (node != null && node.val != target) {
        node = (target < node.val) ? node.left : node.right;
    }
    return node;
}
~~~

Each step descends one level, so search costs O(h), where h is the tree's height.

## Insertion

Search for the value; where the search falls off the tree is where the new node belongs:

~~~java
TreeNode insert(TreeNode node, int val) {
    if (node == null) return new TreeNode(val);
    if (val < node.val) node.left = insert(node.left, val);
    else if (val > node.val) node.right = insert(node.right, val);
    return node;
}
~~~

New nodes always become leaves, and insertion costs O(h). This version ignores duplicates; a BST that allows them must pick a consistent side or store a count per node.

## Deletion

Deletion has three cases:

1. **The node is a leaf**: remove it
2. **The node has one child**: replace the node with that child
3. **The node has two children**: replace its value with its **in-order successor**, the smallest value in its right subtree, then delete the successor from the right subtree. The successor has no left child, so its deletion falls into case 1 or 2

The in-order predecessor, the largest value in the left subtree, works equally well. Deletion costs O(h).

## Validating a BST

The common wrong solution checks only that each node is greater than its left child and smaller than its right child, which misses the 10, 5, 12 example above. The correct approach passes down the range of allowed values:

~~~java
boolean isValid(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (node.val <= low || node.val >= high) return false;
    return isValid(node.left, low, node.val) && isValid(node.right, node.val, high);
}
// call: isValid(root, Long.MIN_VALUE, Long.MAX_VALUE)
~~~

Using \`long\` bounds avoids failing on nodes holding \`Integer.MIN_VALUE\` or \`Integer.MAX_VALUE\`. An alternative performs an in-order traversal and checks that each value is greater than the previous one.

## Other BST problems

The ordering supports efficient answers to many questions:

- **Minimum and maximum**: follow left or right pointers to the end
- **k-th smallest element**: in-order traversal, stopping at the k-th value; storing subtree sizes in each node makes it O(h)
- **Lowest common ancestor**: walk from the root; when the two targets fall on different sides of a node, or one equals it, that node is the answer
- **Floor and ceiling**: the largest value at most x, or the smallest at least x, found in one descent
- **Range queries**: visit only subtrees that can overlap the range
- **Converting a sorted array to a balanced BST**: make the middle element the root and recurse on each half

## The balance problem

All BST operations cost O(h). With random insertions, the expected height is O(log n). But inserting values in sorted order, such as 1, 2, 3, 4, 5, makes every node a right child, and the tree becomes a linked list with height n − 1. Every operation then costs O(n).

**Self-balancing trees** fix this by restructuring with **rotations** after insertions and deletions:

- **AVL trees** keep the heights of every node's subtrees within 1 of each other, giving faster lookups
- **Red-black trees** enforce looser colour rules, guaranteeing height at most about 2 log₂(n + 1), with fewer rotations on updates

Both guarantee O(log n) operations. Interviews rarely ask you to implement them, but you should know they exist and why.

## TreeMap and TreeSet

Java's \`TreeMap\` and \`TreeSet\` are red-black trees. Beyond \`put\`, \`get\` and \`remove\` in O(log n), they offer ordered queries that hash maps can't:

| Method | Returns |
|---|---|
| \`floorKey(x)\` | Largest key ≤ x |
| \`ceilingKey(x)\` | Smallest key ≥ x |
| \`lowerKey(x)\`, \`higherKey(x)\` | Strictly smaller or larger keys |
| \`firstKey()\`, \`lastKey()\` | Minimum and maximum |
| \`headMap\`, \`tailMap\`, \`subMap\` | Views of key ranges |

Use them for calendar booking, interval scheduling and "nearest value" problems.

## How interviewers test this

Expect validate a BST, k-th smallest element, lowest common ancestor in a BST, insertion and deletion. Explain why checking only immediate children fails, describe the three deletion cases, and explain how sorted insertions degrade a plain BST and how self-balancing trees prevent it.`,
    sources: [ODS, MIT_6006, JAVA_API]
  },

  "classic-tree-problems": {
    theory: `A few tree problems appear in interviews again and again, and they share techniques: returning more than one value from a recursive call, tracking a global answer while computing a different local value, and reasoning about where two paths meet. This lesson works through the diameter of a binary tree, balanced tree checking, maximum path sum and the lowest common ancestor, explaining the reusable idea behind each.

## Diameter of a binary tree

The diameter is the number of edges on the longest path between any two nodes. The path doesn't have to pass through the root.

The key observation: every path has a highest node, where it turns from going up to going down. At that node, the longest path through it is the height of its left subtree plus the height of its right subtree, plus two edges connecting them. Measuring height in nodes rather than edges absorbs those two edges:

~~~java
int diameter = 0;

int depth(TreeNode node) {
    if (node == null) return 0;
    int left = depth(node.left);
    int right = depth(node.right);
    diameter = Math.max(diameter, left + right);   // path turning at this node
    return 1 + Math.max(left, right);              // longest downward path
}
~~~

## Two different values

This is the central technique of the lesson. The function **returns** one value, the longest downward path, which the parent needs. It **records** a different value, the best path that turns at this node, in a variable outside the recursion. The parent can't extend a path that turns at a child, because a path can't fork, so only the downward path is returned.

The naive alternative computes height separately at every node, costing O(n²) on a degenerate tree. Combining both in one post-order pass is O(n).

## Checking balance

A tree is height-balanced if, at every node, the heights of its two subtrees differ by at most one. Calling a separate height function at every node is O(n²). Instead, return the height from a single pass, using a sentinel value of −1 to signal "unbalanced":

~~~java
int check(TreeNode node) {
    if (node == null) return 0;
    int left = check(node.left);
    if (left == -1) return -1;
    int right = check(node.right);
    if (right == -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
}
~~~

The tree is balanced if \`check(root) != -1\`. The early returns stop work as soon as an imbalance is found. Encoding failure in the return value avoids a second pass.

## Maximum path sum

Given a tree whose nodes can hold negative values, find the maximum sum of any path. This is the diameter pattern with weights:

- the function returns the best downward path sum starting at this node
- it records the best path turning at this node: the node's value plus the best gains from both sides

The twist is negative values: a subtree with a negative best path should be ignored, not added. So clamp each child's contribution at zero:

~~~java
int best = Integer.MIN_VALUE;

int gain(TreeNode node) {
    if (node == null) return 0;
    int left = Math.max(0, gain(node.left));
    int right = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + left + right);
    return node.val + Math.max(left, right);
}
~~~

Initializing \`best\` to \`Integer.MIN_VALUE\` rather than 0 handles trees where every value is negative; the answer then is the single largest node.

## Lowest common ancestor

The lowest common ancestor (LCA) of two nodes p and q is the deepest node that has both as descendants, where a node counts as its own descendant.

In a general binary tree, search both subtrees:

~~~java
TreeNode lca(TreeNode node, TreeNode p, TreeNode q) {
    if (node == null || node == p || node == q) return node;
    TreeNode left = lca(node.left, p, q);
    TreeNode right = lca(node.right, p, q);
    if (left != null && right != null) return node;   // p and q split here
    return (left != null) ? left : right;
}
~~~

Each call returns p, q, the LCA, or \`null\`. If both sides return something, p and q are in different subtrees, so this node is where their paths meet. If only one side returns something, pass it up: it's either one target or an LCA found lower down. This runs in O(n) time.

The code assumes both nodes exist in the tree. If one might be missing, the function returns the other node, which is wrong; you'd need to confirm both were found.

In a BST, the ordering makes it faster: if both values are smaller than the current node, go left; if both are larger, go right; otherwise, the current node is the LCA. That's O(h) with no recursion needed.

## The general lessons

These problems share three habits worth adopting:

- **Post-order for bottom-up answers**: compute children first, combine at the parent
- **Return one value, record another**: when the answer is a path that turns, but the parent needs a path that continues
- **Encode extra information in the return value**: sentinels such as −1 for failure, or returning a node to signal "found"

## How interviewers test this

Expect diameter of a binary tree, balanced binary tree, maximum path sum and lowest common ancestor, often as a sequence of increasing difficulty. Explain the difference between the returned value and the recorded answer, give the O(n) argument for doing everything in one pass, and state your assumptions, such as both LCA targets existing.`,
    sources: [TIH, THE_ALGORITHMS, CP_ALGO]
  },

  "heap-basics": {
    theory: `A binary heap is a complete binary tree that keeps one ordering rule: in a min-heap, every parent is smaller than or equal to its children. That rule puts the minimum at the root, where it can be read in O(1) and removed in O(log n). Heaps power priority queues, scheduling, Dijkstra's algorithm and heap sort. This lesson explains the heap property, the array representation, sift up and sift down, and why building a heap from an array takes only O(n).

## The heap property

In a **min-heap**, every node's value is at most its children's values, so the smallest element sits at the root. In a **max-heap**, every node is at least its children, putting the largest at the root.

A heap is only partially ordered. Siblings have no required order, and an in-order traversal doesn't produce sorted output. The heap guarantees one thing: the root is the minimum or maximum. That weaker guarantee is what makes heap operations cheaper than keeping a fully sorted structure.

## Shape: a complete binary tree

A heap is also a **complete** binary tree: every level is full except possibly the last, which fills from the left. That shape keeps the height at ⌊log₂ n⌋, which bounds every operation at O(log n).

## The array representation

A complete tree fits in an array with no gaps and no pointers. Store the nodes level by level; for a node at index i, in a zero-indexed array:

~~~text
parent(i)      = (i - 1) / 2
leftChild(i)   = 2i + 1
rightChild(i)  = 2i + 2
~~~

The heap \`[1, 3, 2, 7, 4]\` has 1 at the root, children 3 and 2, and 3's children are 7 and 4. Navigating by arithmetic instead of pointers saves memory and keeps the data contiguous, which is cache friendly. Some textbooks use one-indexed arrays, where the formulas become i/2, 2i and 2i + 1.

## Insertion with sift up

To insert, place the new element at the end of the array, the next free spot in the bottom level, which keeps the tree complete. It may now be smaller than its parent, so swap it upward until the heap property holds:

~~~java
void siftUp(int[] heap, int i) {
    while (i > 0 && heap[i] < heap[(i - 1) / 2]) {
        swap(heap, i, (i - 1) / 2);
        i = (i - 1) / 2;
    }
}
~~~

The element rises at most the height of the tree, so insertion is O(log n).

## Removing the minimum with sift down

The minimum is at index 0. To remove it, move the last element to the root, shrink the size, and push the new root downward, swapping it with its **smaller** child until it's no larger than both children:

~~~java
void siftDown(int[] heap, int i, int size) {
    while (true) {
        int smallest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < size && heap[l] < heap[smallest]) smallest = l;
        if (r < size && heap[r] < heap[smallest]) smallest = r;
        if (smallest == i) return;
        swap(heap, i, smallest);
        i = smallest;
    }
}
~~~

Swapping with the smaller child matters: swapping with the larger one would place a larger value above a smaller sibling and break the property. Removal is O(log n).

## Operation costs

| Operation | Cost |
|---|---|
| Peek at the minimum | O(1) |
| Insert | O(log n) |
| Remove the minimum | O(log n) |
| Build a heap from n elements | O(n) |
| Search for an arbitrary value | O(n) |
| Remove an arbitrary element | O(n) to find, O(log n) to fix |

## Building a heap in O(n)

Inserting n elements one at a time costs O(n log n). The bottom-up method, called heapify, is faster: start from the last non-leaf node, at index n/2 − 1, and sift down every node in reverse order to the root.

It looks like O(n log n), since each sift down costs up to O(log n). But most nodes are near the bottom, where sifting down is cheap. About half the nodes are leaves and need no work, a quarter can move down one level, an eighth can move two, and so on. The sum n/4 · 1 + n/8 · 2 + n/16 · 3 + ... converges to O(n). This is a favourite interview question because the answer is surprising.

## Heaps versus other structures

| Need | Best structure |
|---|---|
| Repeatedly take the minimum or maximum | Heap |
| Sorted order of all elements | Sorted array or balanced BST |
| Find, delete or update arbitrary elements by key | Balanced BST (TreeMap) |
| Minimum and maximum at once | Two heaps, or a TreeMap |

A balanced BST can also return the minimum in O(log n), but a heap does it in O(1), uses a compact array, and has smaller constants.

## How interviewers test this

Expect "How is a heap stored in an array?", "Explain insert and extract-min", and "Why is building a heap O(n)?" Give the index formulas, describe sift up and sift down with the smaller-child rule, and walk through the level-by-level sum for the O(n) build.`,
    sources: [ODS, MIT_6006, CP_ALGO]
  },

  "priority-queue-top-k": {
    theory: `A priority queue always removes the element with the highest priority rather than the oldest. In Java, \`PriorityQueue\` is a binary heap, and it solves a family of "top k" problems efficiently: the k largest elements, the k most frequent, the k closest points and the running median. This lesson explains how to use \`PriorityQueue\` with comparators, the counterintuitive choice of heap type for top-k problems, and the two-heap technique for medians.

## PriorityQueue in Java

\`PriorityQueue\` is a min-heap by default:

~~~java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
minHeap.offer(5);
minHeap.offer(1);
int smallest = minHeap.peek();   // 1
int removed = minHeap.poll();    // 1
~~~

\`offer\` and \`poll\` are O(log n), \`peek\` and \`size\` are O(1). \`remove(Object)\` and \`contains\` are O(n), because a heap can't search efficiently.

Iterating over a \`PriorityQueue\` or printing it doesn't show sorted order; it shows the internal array. Only repeated \`poll\` calls produce elements in priority order.

## Custom comparators

For objects or custom orders, pass a comparator:

~~~java
// points closest to the origin first
PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> Integer.compare(a[0] * a[0] + a[1] * a[1], b[0] * b[0] + b[1] * b[1]));
~~~

Avoid writing comparators as \`(a, b) -> a - b\`. Subtraction overflows when values have opposite signs and large magnitudes, producing wrong orderings. \`Integer.compare\` or \`Comparator.comparingInt\` is always safe.

## Top k largest: use a min-heap

To find the k largest elements in a stream of n, the natural instinct is a max-heap of all n elements, then k removals: O(n + k log n) with O(n) memory. The better approach keeps a **min-heap of size k**:

~~~java
PriorityQueue<Integer> heap = new PriorityQueue<>();
for (int x : nums) {
    heap.offer(x);
    if (heap.size() > k) heap.poll();   // drop the smallest
}
// heap now holds the k largest; heap.peek() is the k-th largest
~~~

The heap holds the k largest elements seen so far, and its root is the smallest of them, the one to evict when something bigger arrives. This costs O(n log k) time and O(k) space. When k is much smaller than n, and especially when the data arrives as a stream too large to store, this is the right design.

The rule: to keep the k **largest**, use a **min**-heap; to keep the k **smallest**, use a **max**-heap. The heap's root is always the weakest member, ready to be evicted.

## The k-th largest element

The root of the size-k min-heap is the k-th largest element, so the same code answers that question in O(n log k). **Quickselect**, a variant of quick sort's partition that only recurses into the side containing the k-th position, does it in O(n) on average, but O(n²) in the worst case and it modifies the array. Mention both and their trade-offs.

## Top k frequent elements

Count frequencies with a hash map, then keep a min-heap of size k ordered by frequency:

~~~java
PriorityQueue<Map.Entry<Integer, Integer>> heap =
    new PriorityQueue<>(Comparator.comparingInt(Map.Entry::getValue));
for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
    heap.offer(e);
    if (heap.size() > k) heap.poll();
}
~~~

That's O(n log k). **Bucket sort** does better: create buckets indexed by frequency, from 1 to n, place each element in its frequency's bucket, and read buckets from the highest down until you have k elements. That's O(n), because frequencies can't exceed n.

## K closest points

To find the k points closest to the origin, keep a max-heap of size k ordered by distance; the root is the farthest of the current k, evicted when a closer point arrives. Compare squared distances to avoid floating-point square roots, which are slower and introduce rounding error.

## The running median with two heaps

To report the median of a stream after each new number, split the numbers into two halves:

- a **max-heap** holding the smaller half, whose root is the largest of the small numbers
- a **min-heap** holding the larger half, whose root is the smallest of the large numbers

Keep the heaps balanced so their sizes differ by at most one. The median is the root of the bigger heap, or the average of both roots when the sizes are equal. Adding a number:

1. Push it onto the max-heap
2. Move the max-heap's root to the min-heap, which keeps every small number at most every large number
3. If the min-heap is now bigger, move its root back to the max-heap

Each insertion is O(log n), and reading the median is O(1). The same two-heap balance appears in scheduling problems such as IPO capital selection.

## Recognizing heap problems

Phrases such as "k largest", "k smallest", "k most frequent", "k closest", "median of a stream" and "repeatedly take the smallest" point to a heap. So do greedy algorithms that always pick the best available option, such as merging the two smallest ropes or scheduling tasks by deadline.

## How interviewers test this

Expect k-th largest element, top k frequent elements, k closest points and find median from data stream. Explain why a min-heap keeps the k largest, give the O(n log k) cost, mention quickselect or bucket sort as alternatives, and use \`Integer.compare\` in comparators.`,
    sources: [JAVA_API, TIH, THE_ALGORITHMS]
  },

  "merge-k-sorted-and-heap-sort": {
    theory: `Two classic algorithms show heaps at work. Merging k sorted lists uses a small heap to always pick the next smallest element among k candidates, and heap sort uses a heap to sort an array in place with guaranteed O(n log n) time. This lesson explains both in detail, compares heap sort with merge sort and quick sort, and covers related k-way problems such as the smallest range covering k lists.

## Merging k sorted lists

Given k sorted linked lists with N nodes in total, produce one sorted list. At every step, the next output node is the smallest among the k current heads. A min-heap of those heads finds it in O(log k):

~~~java
ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
    for (ListNode head : lists) if (head != null) heap.offer(head);
    ListNode dummy = new ListNode(0), tail = dummy;
    while (!heap.isEmpty()) {
        ListNode node = heap.poll();
        tail.next = node;
        tail = node;
        if (node.next != null) heap.offer(node.next);
    }
    return dummy.next;
}
~~~

Each of the N nodes is pushed and popped once, at O(log k) each, so the total is O(N log k) time with O(k) heap space. Skip \`null\` heads when initializing, or the comparator throws a \`NullPointerException\`.

## Comparing approaches for k lists

| Approach | Time | Extra space |
|---|---|---|
| Merge into a growing result, one list at a time | O(N · k) | O(1) |
| Collect all values, sort, rebuild | O(N log N) | O(N) |
| Min-heap of current heads | O(N log k) | O(k) |
| Pairwise divide and conquer | O(N log k) | O(log k) stack |

When k is much smaller than N, log k is far smaller than log N, so the heap and divide-and-conquer methods win. Divide and conquer merges lists in pairs, like rounds of a tournament; each node takes part in about log k merges.

## External sorting

The k-way merge is how databases and big-data systems sort files larger than memory. They sort chunks that fit in memory, write each as a sorted run to disk, then merge all runs with a heap, reading each run sequentially. This is why the k-way merge matters beyond interviews.

## Other k-way problems

The same heap of "current candidates from each source" solves several problems:

- **K-th smallest in a sorted matrix**: rows are sorted lists; push the first element of each row and pop k times, pushing each popped element's right neighbour
- **K pairs with the smallest sums**: from two sorted arrays, start with pairs \`(i, 0)\`, and after popping a pair, push its next pair in the second array
- **Smallest range covering k lists**: keep one element from each list in a min-heap and track the current maximum. The range from the heap's minimum to that maximum covers every list. Pop the minimum, advance its list, update the maximum, and stop when a list runs out

## Heap sort

Heap sort sorts an array in place using a max-heap:

1. **Build** a max-heap from the array bottom-up, in O(n)
2. **Extract** repeatedly: swap the root, the current maximum, with the last element of the heap region, shrink the heap by one, and sift the new root down

~~~java
void heapSort(int[] a) {
    int n = a.length;
    for (int i = n / 2 - 1; i >= 0; i--) siftDown(a, i, n);   // build max-heap
    for (int end = n - 1; end > 0; end--) {
        swap(a, 0, end);          // largest goes to its final place
        siftDown(a, 0, end);      // restore the heap in a[0..end-1]
    }
}
~~~

Here \`siftDown\` swaps with the **larger** child, because it maintains a max-heap. After each extraction, the sorted region at the end of the array grows by one, holding the largest elements in order.

## Heap sort's properties

Heap sort runs in O(n log n) in every case and uses O(1) extra space. Neither merge sort, which needs O(n) space, nor quick sort, which has an O(n²) worst case, offers both. But heap sort isn't stable, and it's usually slower than quick sort in practice: sifting down jumps between distant array positions, causing cache misses.

That's why heap sort serves as a safety net in **introsort**, used by C++'s \`std::sort\`: it begins with quick sort and switches to heap sort if recursion goes too deep, guaranteeing O(n log n).

## Comparing the three O(n log n) sorts

| | Merge sort | Quick sort | Heap sort |
|---|---|---|---|
| Worst case | O(n log n) | O(n²) | O(n log n) |
| Extra space | O(n) | O(log n) | O(1) |
| Stable | Yes | No | No |
| Practical speed | Good | Usually fastest | Slower, cache unfriendly |

## How interviewers test this

Expect merge k sorted lists, with a comparison of approaches, and occasionally heap sort itself. Give the O(N log k) argument, handle null lists, and explain why heap sort guarantees O(n log n) in O(1) space but loses to quick sort in practice.`,
    sources: [MIT_6006, TIH, THE_ALGORITHMS]
  },

  "graph-representation": {
    theory: `A graph is a set of vertices connected by edges. Graphs model road networks, social networks, the web, course prerequisites, network routing and dependency systems, and many interview problems are graph problems in disguise. This lesson covers graph terminology, the three ways to store a graph, how to choose between them, and how to recognize graphs hidden in grids and word puzzles.

## Terminology

A graph G = (V, E) has a set of **vertices** V, also called nodes, and **edges** E connecting pairs of them. Key distinctions:

- **Directed or undirected**: a directed edge goes one way, like a one-way street or a Twitter follow; an undirected edge goes both ways, like a Facebook friendship
- **Weighted or unweighted**: weights represent distance, cost or time on each edge
- **Cyclic or acyclic**: a cycle is a path that returns to its start. A directed acyclic graph (DAG) has none, and models dependencies
- **Connected**: in an undirected graph, every vertex can reach every other. The maximal connected pieces are **connected components**
- **Degree**: the number of edges at a vertex. In directed graphs, **in-degree** counts incoming edges and **out-degree** counts outgoing ones
- **Dense or sparse**: dense graphs have close to V² edges; sparse ones have far fewer, often close to V

A **tree** is a connected, undirected graph with no cycles. It always has exactly V − 1 edges.

## Adjacency matrix

An adjacency matrix is a V × V grid where \`matrix[u][v]\` is 1, or the edge's weight, if there's an edge from u to v:

~~~java
boolean[][] adj = new boolean[n][n];
adj[u][v] = true;
adj[v][u] = true;   // undirected: set both directions
~~~

Checking whether an edge exists is O(1), but the matrix always uses O(V²) memory, and listing a vertex's neighbours costs O(V) even if it has few. For a social network with a billion users, a matrix would need 10¹⁸ cells. Matrices suit small or dense graphs.

## Adjacency list

An adjacency list stores, for each vertex, a list of its neighbours:

~~~java
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
for (int[] e : edges) {
    adj.get(e[0]).add(e[1]);
    adj.get(e[1]).add(e[0]);   // omit for directed graphs
}
~~~

Memory is O(V + E), and iterating over a vertex's neighbours costs O(its degree). This is the default for interviews and most real systems, because real graphs are usually sparse. For weighted graphs, store pairs such as \`int[]{neighbour, weight}\`. When vertices are strings or unknown in advance, use \`Map<String, List<String>>\`.

## Edge list

An edge list is an array of \`(u, v, weight)\` entries. It uses O(E) memory and is the input format most problems give you. It's inefficient for finding neighbours, but it's exactly what Kruskal's minimum spanning tree algorithm needs, since Kruskal sorts the edges by weight.

## Choosing a representation

| Operation | Adjacency matrix | Adjacency list | Edge list |
|---|---|---|---|
| Memory | O(V²) | O(V + E) | O(E) |
| Does edge (u, v) exist? | O(1) | O(degree of u) | O(E) |
| List neighbours of u | O(V) | O(degree of u) | O(E) |
| Add an edge | O(1) | O(1) | O(1) |
| Best for | Dense graphs, quick edge checks | Sparse graphs, traversal | Sorting edges (Kruskal) |

## Building from input

Most problems give an edge list plus the number of vertices. Converting it to an adjacency list is the first step. Two common bugs: forgetting to add the reverse edge in undirected graphs, and assuming vertices are numbered from 0 when the problem numbers them from 1. Check the constraints for both.

## Implicit graphs

Many problems never mention a graph. Recognizing the hidden graph is often the hardest step:

- **Grids**: each cell is a vertex, connected to its up, down, left and right neighbours. Counting islands is counting connected components
- **Word ladders**: each word is a vertex, with edges between words differing by one letter. The shortest transformation sequence is a shortest path
- **State spaces**: in a lock puzzle, each combination is a vertex, and each turn of a wheel is an edge
- **Dependencies**: course prerequisites and build systems form directed graphs; a valid order exists only if there's no cycle

For implicit graphs, you generate neighbours on the fly instead of building an adjacency list, which saves memory when the graph is large.

## Graph sizes in practice

Real graphs are large and sparse. The web has billions of pages, each linking to a few dozen others. Road networks have millions of intersections, each with a handful of roads. This sparsity is why adjacency lists dominate, and why graph algorithms are measured as O(V + E) rather than O(V²).

## How interviewers test this

Expect "Adjacency matrix versus adjacency list?" and problems where you must build a graph from edges or recognize one in a grid. State V and E, choose the list for sparse graphs, and watch for directed versus undirected edges and the indexing base.`,
    sources: [ODS, MIT_6006, CP_ALGO]
  },

  "bfs-and-dfs": {
    theory: `Breadth-first search (BFS) and depth-first search (DFS) are the two fundamental ways to explore a graph. BFS spreads outward in rings of increasing distance and finds shortest paths in unweighted graphs. DFS follows one path as deep as possible before backtracking, which makes it the basis for detecting cycles, finding connected components and topological sorting. This lesson explains both algorithms, the visited set, and the classic problems they solve, including counting islands and multi-source BFS.

## Breadth-first search

BFS uses a queue. It visits the start vertex, then all vertices one edge away, then all two edges away, and so on:

~~~java
int[] bfs(List<List<Integer>> adj, int start) {
    int[] dist = new int[adj.size()];
    Arrays.fill(dist, -1);
    Queue<Integer> q = new ArrayDeque<>();
    dist[start] = 0;
    q.offer(start);
    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : adj.get(u)) {
            if (dist[v] == -1) {          // not visited yet
                dist[v] = dist[u] + 1;
                q.offer(v);
            }
        }
    }
    return dist;
}
~~~

Because BFS processes vertices in order of distance, the first time it reaches a vertex is via a shortest path, counted in edges. That makes BFS the right tool for shortest paths in **unweighted** graphs. With weights, it fails, and you need Dijkstra's algorithm.

## Mark when you enqueue

Mark a vertex visited when you add it to the queue, not when you remove it. If you wait until removal, the same vertex can be added many times by different neighbours before it's processed, wasting time and memory, and in dense graphs the queue can grow far beyond V.

## Depth-first search

DFS goes deep first, using recursion or an explicit stack:

~~~java
void dfs(List<List<Integer>> adj, int u, boolean[] visited) {
    visited[u] = true;
    for (int v : adj.get(u)) {
        if (!visited[v]) dfs(adj, v, visited);
    }
}
~~~

Recursive DFS is concise, but deep graphs can overflow the call stack; a path of 100,000 vertices will crash Java's default stack. An iterative version with an explicit stack avoids this.

## Why the visited set matters

Trees have no cycles, so tree traversals don't need a visited set. Graphs do. Without one, an undirected edge between u and v sends DFS back and forth forever, and any cycle causes infinite loops. Track visited vertices in a boolean array when vertices are numbered, or a hash set otherwise.

## Complexity

Both BFS and DFS visit each vertex once and examine each edge once in a directed graph, or twice in an undirected graph, so both run in O(V + E) time with an adjacency list. With an adjacency matrix, finding neighbours costs O(V) per vertex, giving O(V²). Space is O(V) for the visited set plus the queue or stack.

## Choosing between them

| Need | Use |
|---|---|
| Shortest path in an unweighted graph | BFS |
| Minimum number of moves or steps | BFS |
| Visit everything, count components | Either; DFS is shorter to write |
| Cycle detection, topological sort | DFS |
| Explore all paths, backtracking | DFS |
| Graph is deep, risking stack overflow | BFS, or iterative DFS |

## Counting islands

Given a grid of \`'1'\` (land) and \`'0'\` (water), count the islands, where land cells connect horizontally and vertically. Scan the grid; each time you find unvisited land, increment the count and flood-fill the whole island with DFS or BFS, marking cells visited. The answer is the number of times a flood fill starts. Each cell is visited a constant number of times, so the cost is O(rows × cols).

Marking cells by overwriting them, such as changing \`'1'\` to \`'0'\`, saves a separate visited array but modifies the input; say so, or ask whether that's allowed.

## Multi-source BFS

Some problems start from many sources at once. In the rotting oranges problem, every rotten orange spreads rot to its neighbours each minute; find how long until all oranges rot. Put **all** initially rotten oranges in the queue at time 0, then run BFS level by level. Each level is one minute. Running a separate BFS from each source would be much slower.

The same idea computes, for every cell, the distance to the nearest gate, exit or zero: start from all targets at once.

## Shortest path in a grid

BFS on a grid finds the minimum number of steps from a start to a target, treating each cell as a vertex and moves as edges. Problems often add a twist that becomes part of the state, such as being allowed to break k walls. Then each vertex is \`(row, col, wallsLeft)\`, and the visited set tracks that full state.

## Bipartite checking

A graph is bipartite if its vertices can be split into two groups with every edge crossing between them. Colour the start vertex, then colour each neighbour the opposite colour with BFS or DFS. If an edge ever connects two vertices of the same colour, the graph isn't bipartite. Remember to start a new search from every uncoloured vertex, since the graph might be disconnected.

## How interviewers test this

Expect number of islands, rotting oranges, shortest path in a binary matrix, clone graph and bipartite checks. Choose BFS for shortest paths and DFS for exhaustive exploration, mark vertices when enqueued, restart searches for disconnected graphs, and state the O(V + E) complexity.`,
    sources: [CP_ALGO, MIT_6006, TIH]
  },

  "topological-sort": {
    theory: `A topological sort orders the vertices of a directed acyclic graph (DAG) so every edge points forward: for each edge u → v, u comes before v. It answers questions such as "In what order can I take these courses?" or "In what order should these build steps run?" A topological order exists only when the graph has no cycle, so the same algorithms also detect cycles. This lesson explains Kahn's algorithm, the DFS-based method, cycle detection with three colours, and the applications.

## When an order exists

If courses A, B and C require each other in a loop, no order works: each course must come before the one before it. A topological order exists exactly when the directed graph has no cycle. A DAG can have many valid orders; any one of them is a correct answer unless the problem asks for a specific one, such as the lexicographically smallest.

## Kahn's algorithm (BFS)

Kahn's algorithm repeatedly removes vertices with no remaining prerequisites:

1. Compute the **in-degree** of every vertex: how many edges point into it
2. Put every vertex with in-degree 0 in a queue; they have no prerequisites
3. Remove a vertex from the queue and add it to the order. For each of its outgoing edges, decrement the target's in-degree; if it reaches 0, add the target to the queue
4. Repeat until the queue is empty

~~~java
List<Integer> topoSort(int n, List<List<Integer>> adj) {
    int[] indegree = new int[n];
    for (int u = 0; u < n; u++) for (int v : adj.get(u)) indegree[v]++;
    Queue<Integer> q = new ArrayDeque<>();
    for (int u = 0; u < n; u++) if (indegree[u] == 0) q.offer(u);
    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
        int u = q.poll();
        order.add(u);
        for (int v : adj.get(u)) {
            if (--indegree[v] == 0) q.offer(v);
        }
    }
    return order.size() == n ? order : List.of();   // empty means a cycle
}
~~~

If the order contains fewer than n vertices, the rest are stuck in a cycle: their in-degrees never reached 0. That's the cycle check built into Kahn's algorithm. The complexity is O(V + E).

## Kahn's variants

Swapping the queue for a min-heap produces the lexicographically smallest order, at O(V log V + E). Processing the queue level by level, like a level-order traversal, groups vertices into "semesters": the number of levels is the minimum number of rounds needed when independent tasks can run in parallel.

## The DFS method

DFS gives a topological order through **finishing times**. A vertex finishes after every vertex reachable from it has finished. So if you add each vertex to a list when it finishes, then reverse the list, every vertex appears before everything it points to.

~~~java
void dfs(int u, List<List<Integer>> adj, boolean[] visited, Deque<Integer> stack) {
    visited[u] = true;
    for (int v : adj.get(u)) if (!visited[v]) dfs(v, adj, visited, stack);
    stack.push(u);   // push on finish; the stack's top-to-bottom is the order
}
~~~

Run it from every unvisited vertex. Pushing onto a stack on finish and reading from top to bottom performs the reversal automatically.

## Detecting cycles with three colours

In a directed graph, a visited array alone can't detect cycles: reaching an already visited vertex might mean a cycle, or might mean another branch already finished it. Three states separate the cases:

| Colour | Meaning |
|---|---|
| White | Not visited yet |
| Grey | On the current DFS path, still being explored |
| Black | Finished, along with everything reachable from it |

During DFS, colour a vertex grey on entry and black on exit. Reaching a **grey** vertex means you've found an edge back to a vertex on the current path: a cycle. Reaching a black vertex is safe, because it was fully explored by an earlier branch.

In an undirected graph, cycle detection is different: a cycle exists if DFS reaches a visited vertex other than the one it came from. Union-find, covered later, also detects cycles in undirected graphs.

## Kahn versus DFS

| | Kahn's algorithm | DFS method |
|---|---|---|
| Approach | Remove vertices with in-degree 0 | Reverse finishing order |
| Cycle detection | Fewer than V vertices output | Reaching a grey vertex |
| Recursion | None | Recursive, unless converted |
| Extras | Levels and lexicographic order come naturally | Natural for other DFS-based analysis |

Both run in O(V + E). In interviews, Kahn's algorithm is often preferred because it's iterative and its cycle check is clear.

## Applications

Topological sorting appears wherever dependencies exist:

- **Course schedule**: can all courses be finished, and in what order?
- **Build systems**: Make, Gradle and Bazel compile each module after its dependencies
- **Package managers**: npm and pip install dependencies before the packages that need them
- **Spreadsheets**: recompute cells after the cells they reference
- **Task scheduling**: running jobs in a pipeline after their inputs are ready

## Alien dictionary

A harder problem gives a list of words sorted in an unknown alphabet and asks for the alphabet's order. Compare each pair of adjacent words: the first position where they differ gives an edge from one letter to the other. Topologically sort the letters. Two edge cases matter: if a word comes before its own prefix, such as \`"abc"\` before \`"ab"\`, the input is invalid; and a cycle means no valid alphabet exists.

## How interviewers test this

Expect course schedule I and II, alien dictionary and parallel task scheduling. Model prerequisites as directed edges, choose Kahn's algorithm or DFS, explain how each detects a cycle, and state the O(V + E) complexity. Check the edge direction carefully: "a requires b" means the edge goes from b to a.`,
    sources: [CP_ALGO, MIT_6006, TIH]
  },

  "dijkstra-shortest-path": {
    theory: `Dijkstra's algorithm finds the shortest paths from one source vertex to every other vertex in a graph with non-negative edge weights. It powers route planning and network routing protocols such as OSPF. BFS can't do this job, because with weights, the path with fewer edges isn't necessarily the cheapest. This lesson explains how Dijkstra's algorithm works, its priority queue implementation, why negative weights break it, and the alternatives for other situations.

## Why BFS isn't enough

BFS finds paths with the fewest edges. With weights, a direct road of 10 km can be longer than a route through two roads of 3 km each. You need to explore in order of total distance, not number of edges.

## The idea

Dijkstra's algorithm is greedy. It keeps a tentative distance for every vertex, starting at 0 for the source and infinity elsewhere. Repeatedly:

1. Pick the unfinished vertex with the smallest tentative distance; its distance is now final
2. **Relax** each outgoing edge u → v with weight w: if \`dist[u] + w < dist[v]\`, update \`dist[v]\`

Relaxing means checking whether going through u gives a shorter path to v.

## Why the greedy choice is safe

When the closest unfinished vertex u is picked, no shorter path to it can be discovered later. Any other path would have to leave the finished region through some unfinished vertex, which is already at least as far as u, and with non-negative weights, continuing from there can only add distance. This argument is exactly where negative weights break the algorithm.

## The priority queue implementation

A min-heap keyed by distance finds the closest vertex efficiently:

~~~java
int[] dijkstra(List<List<int[]>> adj, int src) {   // adj: {neighbour, weight}
    int n = adj.size();
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
    pq.offer(new int[]{src, 0});
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int u = top[0], d = top[1];
        if (d > dist[u]) continue;            // stale entry, skip
        for (int[] edge : adj.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{v, dist[v]});
            }
        }
    }
    return dist;
}
~~~

## Lazy deletion

Java's \`PriorityQueue\` can't decrease the key of an existing entry efficiently. So instead of updating a vertex's entry, the code pushes a new entry with the better distance. The old entry stays in the heap. When it's popped later, its distance is larger than \`dist[u]\`, and the \`continue\` line skips it. Forgetting that check doesn't make the answer wrong, but it can make the algorithm much slower on dense graphs.

## Complexity

With a binary heap and lazy deletion, the heap can hold up to E entries, and each push or pop costs O(log E), which is O(log V). The total is O((V + E) log V). For dense graphs, a version without a heap that scans an array for the minimum each round costs O(V²), which is better when E is close to V².

## Recovering the path

To recover the actual route rather than its length, keep a \`parent\` array: whenever you relax an edge u → v successfully, set \`parent[v] = u\`. Follow parents backwards from the target to the source, then reverse.

## Early exit

If you only need the distance to one target, stop when the target is popped from the heap. Its distance is final at that point, and the rest of the graph doesn't need exploring.

## Negative weights

Dijkstra's algorithm fails with negative edge weights. Consider edges A → B with weight 2, A → C with weight 5, and C → B with weight −4. Dijkstra finalizes B at distance 2, but the path through C costs 5 − 4 = 1. The vertex was finalized too early, because a later negative edge made a longer-looking path cheaper.

For graphs with negative weights, use the **Bellman-Ford algorithm**: relax every edge V − 1 times, in O(V · E). A further round that still finds an improvement proves a negative cycle exists, in which case shortest paths aren't defined.

## Choosing a shortest-path algorithm

| Graph | Algorithm | Time |
|---|---|---|
| Unweighted | BFS | O(V + E) |
| Weights 0 or 1 only | 0-1 BFS with a deque | O(V + E) |
| Non-negative weights | Dijkstra | O((V + E) log V) |
| Negative weights allowed | Bellman-Ford | O(V · E) |
| DAG, any weights | Relax edges in topological order | O(V + E) |
| All pairs of vertices | Floyd-Warshall | O(V³) |

Route planners for real maps add heuristics, as in the **A-star** algorithm, which steers the search toward the target using an estimate such as straight-line distance.

## Variations in interviews

Some problems hide the weights or modify the state:

- **Network delay time**: run Dijkstra from the source; the answer is the largest finite distance, or −1 if some vertex is unreachable
- **Path with minimum effort**: the cost of a path is its largest single step, not the sum; Dijkstra still works with \`max\` replacing addition
- **Cheapest flights within k stops**: the state becomes (city, stops used), or Bellman-Ford limited to k + 1 rounds

## How interviewers test this

Expect network delay time, path with minimum effort and cheapest flights with k stops. Explain the greedy choice and why it needs non-negative weights, describe lazy deletion and the stale-entry check, give the O((V + E) log V) complexity, and know when to use BFS or Bellman-Ford instead.`,
    sources: [CP_ALGO, MIT_6006, THE_ALGORITHMS]
  },

  "union-find-and-mst": {
    theory: `Union-find, also called a disjoint set union (DSU), tracks a collection of elements split into groups, and answers two questions almost instantly: which group does this element belong to, and can these two groups be merged? With two optimizations, each operation runs in nearly constant time. Union-find solves dynamic connectivity problems and is the engine of Kruskal's minimum spanning tree algorithm. This lesson explains the structure, its optimizations, and its main applications, including Kruskal's and Prim's algorithms.

## The operations

Union-find maintains disjoint sets, each identified by a representative element called its **root**:

- **find(x)**: return the root of x's set. Two elements are in the same set if their roots match
- **union(x, y)**: merge the sets containing x and y

Each set is stored as a tree, using a \`parent\` array. An element whose parent is itself is a root. Initially, every element is its own set.

## A naive version and its problem

\`find\` follows parent pointers up to the root, and \`union\` links one root under the other. Without care, the trees become long chains: linking 1 under 2, then 2 under 3, and so on makes \`find(1)\` take O(n) steps.

## Optimization 1: union by rank or size

When merging, attach the **smaller** tree under the root of the larger one. A tree's height then grows only when two trees of equal rank merge, so heights stay O(log n). Tracking the size of each set is equally effective and also answers "how big is this group?"

## Optimization 2: path compression

During \`find\`, make every node on the path point directly to the root. Later finds on those nodes take one step:

~~~java
class DSU {
    int[] parent, size;

    DSU(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);   // path compression
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;                        // already connected
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;                                   // smaller under larger
        size[ra] += size[rb];
        return true;
    }
}
~~~

## Nearly constant time

With both optimizations, a sequence of m operations on n elements takes O(m · α(n)) time, where α is the inverse Ackermann function. It grows so slowly that α(n) is at most 4 for any n that could fit in the observable universe, so each operation is effectively O(1). Either optimization alone gives O(log n) per operation.

Returning a boolean from \`union\` is a useful convention: \`false\` means the two elements were already connected, which is exactly the signal for cycle detection.

## Applications

Union-find suits problems where connections only get added:

- **Counting connected components**: start with n components and decrement on every successful union
- **Cycle detection in undirected graphs**: an edge whose endpoints already share a root closes a cycle. This finds the redundant connection in a graph that was a tree plus one extra edge
- **Accounts merge**: group accounts sharing an email address by unioning them
- **Number of islands II**: land appears cell by cell, and after each addition, report the island count, unioning with adjacent land
- **Equations and equivalences**: process all "equal" constraints with union, then check "not equal" constraints with find

Union-find can't remove connections efficiently. If edges get deleted, other techniques are needed.

## Minimum spanning trees

A **spanning tree** of a connected, weighted, undirected graph connects all vertices using V − 1 edges and no cycles. A **minimum spanning tree** (MST) has the smallest total edge weight. MSTs answer questions such as the cheapest way to connect cities with cable or to lay out a power grid.

## Kruskal's algorithm

Kruskal's algorithm builds the MST greedily from the cheapest edges:

1. Sort all edges by weight
2. For each edge in order, add it if its endpoints are in different components, using union-find; otherwise skip it, since it would form a cycle
3. Stop after adding V − 1 edges

Sorting dominates, so the cost is O(E log E). The greedy choice is safe because of the **cut property**: for any division of the vertices into two groups, the cheapest edge crossing between them belongs to some MST.

## Prim's algorithm

Prim's algorithm grows one tree from a starting vertex. A min-heap holds edges leaving the tree; repeatedly take the cheapest edge that reaches a new vertex, add that vertex, and push its edges. The cost is O(E log V) with a binary heap.

| | Kruskal | Prim |
|---|---|---|
| Approach | Sort edges, join components | Grow one tree from a vertex |
| Data structure | Union-find | Min-heap |
| Time | O(E log E) | O(E log V) |
| Suits | Sparse graphs, edge lists | Dense graphs, adjacency lists |

## Connecting points

A typical interview problem gives n points and asks for the minimum cost to connect them all, where cost is Manhattan distance. Every pair is a possible edge, so the graph is complete with about n²/2 edges. Prim's algorithm with an O(n²) array-based implementation avoids storing and sorting all the edges.

## How interviewers test this

Expect number of connected components, redundant connection, accounts merge and minimum cost to connect points. Write union-find with both optimizations, explain the nearly constant time bound, use union's return value for cycle detection, and compare Kruskal's and Prim's algorithms.`,
    sources: [CP_ALGO, MIT_6006, THE_ALGORITHMS]
  }
};
