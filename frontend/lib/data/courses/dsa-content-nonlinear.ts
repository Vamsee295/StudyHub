// DSA Modules 7-10: Hashing, Trees, Heaps, Graphs
// All Java code is compiled and tested.
import { CourseLesson } from './types';

export const hashingLessons: CourseLesson[] = [
  {
    id: "how-hashmap-works",
    slug: "how-hashmap-works",
    title: "How HashMap Works: Hashing, Collisions and Load Factor",
    description: "Buckets, hash functions, chaining, resizing, Java 8 treeification, and the equals/hashCode contract.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "The Idea",
          content: "A hash map stores key-value pairs in an array of buckets. hash(key) picks the bucket, so get and put take O(1) time on average, with no searching.\n\nJava's HashMap: index = (n − 1) & (h ^ (h >>> 16)), where h = key.hashCode() and n is the table size (a power of 2). Mixing in the high bits spreads keys more evenly."
        },
        {
          type: "table",
          title: "Collision Handling",
          headers: ["Strategy", "How", "Used by"],
          rows: [
            ["Separate chaining", "Each bucket holds a list of entries", "Java HashMap (a bucket becomes a red-black tree once it has more than 8 entries and the table has at least 64 buckets)"],
            ["Open addressing: linear probing", "If a slot is taken, try the next slot", "Python dict (a variant), many C++ maps"],
            ["Open addressing: double hashing", "Step size comes from a second hash", "Textbook alternative"]
          ]
        },
        {
          type: "text",
          title: "Load Factor and Resizing",
          content: "Load factor = entries / buckets. Java resizes (doubles the table and redistributes all entries) when it exceeds 0.75. A single resize costs O(n), but resizes are rare, so put is amortized O(1).\nWorst case: if every key collides, operations degrade to O(n) with lists, or O(log n) with Java 8+'s treeified buckets."
        },
        {
          type: "code",
          title: "The equals / hashCode Contract",
          language: "java",
          code: "class Point {\n    final int x, y;\n    Point(int x, int y) { this.x = x; this.y = y; }\n    @Override public boolean equals(Object o) {\n        if (!(o instanceof Point)) return false;\n        Point p = (Point) o;\n        return x == p.x && y == p.y;\n    }\n    @Override public int hashCode() { return Objects.hash(x, y); }   // equal objects -> equal hash\n}\n\nSet<Point> seen = new HashSet<>();\nseen.add(new Point(1, 2));\nseen.contains(new Point(1, 2));   // true only because BOTH methods are overridden",
          explanation: "Override equals without hashCode and the two equal points land in different buckets, so contains() returns false. Keys must also not change after insertion (use immutable keys)."
        },
        {
          type: "table",
          title: "HashMap vs TreeMap vs LinkedHashMap",
          headers: ["", "HashMap", "LinkedHashMap", "TreeMap"],
          rows: [
            ["Order", "None", "Insertion (or access) order", "Sorted by key"],
            ["get / put", "O(1) average", "O(1) average", "O(log n)"],
            ["Extra", "–", "Basis for LRU caches", "floorKey, ceilingKey, range views"]
          ]
        },
        {
          type: "quickCheck",
          question: "Java's HashMap resizes when the number of entries exceeds:",
          options: ["The table size", "0.75 × the table size", "0.5 × the table size", "Never; it uses chaining"],
          answer: 1,
          explanation: "The default load factor is 0.75. A 16-bucket table resizes after its 12th entry."
        },
        {
          type: "takeaways",
          items: [
            "Average O(1) get/put; worst case O(n), or O(log n) with treeified buckets.",
            "Collisions: chaining or open addressing. Resize at load factor 0.75.",
            "Override equals AND hashCode together; keep keys immutable."
          ]
        }
      ]
    }
  },
  {
    id: "hashing-patterns",
    slug: "hashing-patterns",
    title: "Hashing Patterns: Frequency Counting, Seen-Before and Longest Consecutive",
    description: "Turn O(n²) lookups into O(1) with HashMap and HashSet.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Frequency Counting: First Non-Repeating Character",
          language: "java",
          code: "static char firstNonRepeating(String s) {\n    Map<Character, Integer> freq = new LinkedHashMap<>();   // keeps first-seen order\n    for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);\n    for (Map.Entry<Character, Integer> e : freq.entrySet())\n        if (e.getValue() == 1) return e.getKey();\n    return '_';\n}\n// \"swiss\" -> 'w'",
          explanation: "merge(key, 1, Integer::sum) is the idiomatic Java counter. getOrDefault(key, 0) + 1 also works."
        },
        {
          type: "code",
          title: "HashSet: Longest Consecutive Sequence in O(n)",
          language: "java",
          code: "static int longestConsecutive(int[] nums) {\n    Set<Integer> set = new HashSet<>();\n    for (int x : nums) set.add(x);\n    int best = 0;\n    for (int x : set) {\n        if (set.contains(x - 1)) continue;          // only start counting at a run's beginning\n        int len = 1;\n        while (set.contains(x + len)) len++;\n        best = Math.max(best, len);\n    }\n    return best;\n}\n// {100, 4, 200, 1, 3, 2} -> 4   (1, 2, 3, 4)",
          explanation: "Without the 'start of run' check this is O(n²) in the worst case. With it, each number is visited by the inner while at most once."
        },
        {
          type: "text",
          title: "Two Sum, Revisited",
          content: "The Arrays module's Two Sum lesson uses the 'seen-before' pattern: for each x, check whether target − x is already in the map, then store x. It's the template for any 'find a partner element' problem."
        },
        {
          type: "practice",
          title: "Practice Problems",
          problems: [{ id: "1", title: "Two Sum", difficulty: "Easy" }]
        },
        {
          type: "quickCheck",
          question: "Which structure answers 'has this value appeared before?' in O(1)?",
          options: ["ArrayList", "HashSet", "TreeSet", "LinkedList"],
          answer: 1,
          explanation: "HashSet.contains is O(1) on average. TreeSet is O(log n); the list types are O(n)."
        },
        {
          type: "takeaways",
          items: ["Count with a HashMap (merge / getOrDefault).", "Check membership with a HashSet.", "Store what you've seen so far to avoid an inner loop."]
        }
      ]
    }
  },
  {
    id: "prefix-sum-with-hashmap",
    slug: "prefix-sum-with-hashmap",
    title: "Prefix Sums + HashMap: Subarray Sum Equals K",
    description: "Count subarrays with a given sum in O(n), even with negative numbers.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "The Insight",
          content: "Let prefix[j] be the sum of the first j elements. The subarray (i, j] sums to k exactly when prefix[j] − prefix[i] = k, i.e. prefix[i] = prefix[j] − k.\n\nSo while scanning, keep a map of 'how many times has each prefix sum appeared?'. At each position, add the count of (currentSum − k)."
        },
        {
          type: "code",
          title: "Subarray Sum Equals K",
          language: "java",
          code: "static int subarraySum(int[] nums, int k) {\n    Map<Integer, Integer> seen = new HashMap<>();\n    seen.put(0, 1);                 // empty prefix: subarrays starting at index 0\n    int sum = 0, count = 0;\n    for (int x : nums) {\n        sum += x;\n        count += seen.getOrDefault(sum - k, 0);\n        seen.merge(sum, 1, Integer::sum);\n    }\n    return count;\n}\n// {1, 1, 1}, k = 2 -> 2      {1, 2, 3}, k = 3 -> 2  ([1,2] and [3])",
          explanation: "seen.put(0, 1) is easy to forget, and it's essential: it counts subarrays that start at the very beginning."
        },
        {
          type: "dryRun",
          title: "Trace: {1, 2, 3}, k = 3",
          iterations: [
            { step: "x = 1", variables: { sum: "1", "sum − k": "-2 (0 times)", count: "0", seen: "{0:1, 1:1}" }, description: "" },
            { step: "x = 2", variables: { sum: "3", "sum − k": "0 (1 time)", count: "1", seen: "{0:1, 1:1, 3:1}" }, description: "Found [1, 2]." },
            { step: "x = 3", variables: { sum: "6", "sum − k": "3 (1 time)", count: "2", seen: "{..., 6:1}" }, description: "Found [3]." }
          ]
        },
        {
          type: "warning",
          title: "Why Not a Sliding Window?",
          items: [
            "A sliding window only works when all numbers are non-negative (so the sum only grows as the window expands).",
            "With negative numbers, shrinking the window can increase the sum, so use the prefix-sum hash map instead."
          ]
        },
        {
          type: "quickCheck",
          question: "What is seen.put(0, 1) for?",
          options: ["Avoiding null pointers", "Counting subarrays that begin at index 0", "Handling k = 0 only", "Sorting the map"],
          answer: 1,
          explanation: "If the prefix sum itself equals k, then sum − k = 0 must already be in the map, representing the empty prefix."
        },
        {
          type: "takeaways",
          items: ["subarray(i, j] = k ⇔ prefix[i] = prefix[j] − k.", "Seed the map with {0: 1}.", "Works with negative numbers, unlike a sliding window."]
        }
      ]
    }
  }
];

export const treeLessons: CourseLesson[] = [
  {
    id: "binary-tree-traversals",
    slug: "binary-tree-traversals",
    title: "Binary Trees and DFS Traversals (Pre, In, Post-order)",
    description: "Tree vocabulary, recursive traversals, and how to think recursively about trees.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Vocabulary",
          content: "A binary tree is made of nodes, each with at most two children (left and right). The top node is the root; nodes with no children are leaves. Height = the number of nodes on the longest root-to-leaf path (some books count edges instead). A full binary tree of height h has 2^h − 1 nodes.\n\nExample tree used in this module:\n        4\n      /   \\\n     2     6\n    / \\   / \\\n   1   3 5   7"
        },
        {
          type: "code",
          title: "The Three DFS Orders",
          language: "java",
          code: "class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }\n\nstatic void preorder(TreeNode n, List<Integer> out) {   // root, left, right\n    if (n == null) return;\n    out.add(n.val); preorder(n.left, out); preorder(n.right, out);\n}\nstatic void inorder(TreeNode n, List<Integer> out) {    // left, root, right\n    if (n == null) return;\n    inorder(n.left, out); out.add(n.val); inorder(n.right, out);\n}\nstatic void postorder(TreeNode n, List<Integer> out) {  // left, right, root\n    if (n == null) return;\n    postorder(n.left, out); postorder(n.right, out); out.add(n.val);\n}",
          explanation: "The name says where the root goes: pre = before its children, in = between them, post = after them."
        },
        {
          type: "table",
          title: "Outputs on the Example Tree",
          headers: ["Traversal", "Order", "Typical use"],
          rows: [
            ["Preorder", "4, 2, 1, 3, 6, 5, 7", "Copying or serializing a tree"],
            ["Inorder", "1, 2, 3, 4, 5, 6, 7", "Sorted order for a BST"],
            ["Postorder", "1, 3, 2, 5, 7, 6, 4", "Deleting a tree, computing heights / sizes bottom-up"]
          ]
        },
        {
          type: "code",
          title: "Thinking Recursively: Height",
          language: "java",
          code: "static int height(TreeNode n) {\n    return n == null ? 0 : 1 + Math.max(height(n.left), height(n.right));\n}\n// example tree -> 3",
          explanation: "Trust the recursion: assume the calls return correct answers for the subtrees, then combine them. Most tree problems are 'compute something from the left and right answers' (a postorder pattern)."
        },
        {
          type: "quickCheck",
          question: "Which traversal of a binary search tree outputs its values in sorted order?",
          options: ["Preorder", "Inorder", "Postorder", "Level order"],
          answer: 1,
          explanation: "Inorder visits the left subtree (smaller values), then the root, then the right subtree (larger values)."
        },
        {
          type: "takeaways",
          items: ["Pre = root first, in = root in the middle, post = root last.", "Recursive tree code: a null base case, then combine the left and right results.", "Time O(n); stack space O(h), the tree height."]
        }
      ]
    }
  },
  {
    id: "level-order-traversal",
    slug: "level-order-traversal",
    title: "Level-Order Traversal (BFS on Trees)",
    description: "Process a tree level by level with a queue, the basis for right-side view, zigzag and minimum depth.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Level Order, Grouped by Level",
          language: "java",
          code: "static List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> res = new ArrayList<>();\n    if (root == null) return res;\n    Queue<TreeNode> q = new ArrayDeque<>();\n    q.offer(root);\n    while (!q.isEmpty()) {\n        int size = q.size();                  // number of nodes on this level\n        List<Integer> level = new ArrayList<>();\n        for (int i = 0; i < size; i++) {\n            TreeNode n = q.poll();\n            level.add(n.val);\n            if (n.left != null) q.offer(n.left);\n            if (n.right != null) q.offer(n.right);\n        }\n        res.add(level);\n    }\n    return res;\n}\n// example tree -> [[4], [2, 6], [1, 3, 5, 7]]",
          explanation: "Capturing q.size() before the inner loop is the trick that separates the levels."
        },
        {
          type: "list",
          title: "Variations (one small change each)",
          items: [
            "**Right-side view**: keep only the last node of each level.",
            "**Zigzag order**: reverse every other level.",
            "**Minimum depth**: return the level number of the first leaf you meet (BFS finds it before exploring deeper levels).",
            "**Average of each level**: sum the level list."
          ]
        },
        {
          type: "quickCheck",
          question: "Why is BFS better than DFS for finding the minimum depth of a very unbalanced tree?",
          options: ["BFS uses less memory always", "BFS stops at the first leaf it reaches, which is on the shallowest level", "DFS can't find leaves", "There's no difference"],
          answer: 1,
          explanation: "DFS may explore a very deep branch first; BFS explores level by level, so the first leaf it finds is the shallowest one."
        },
        {
          type: "takeaways",
          items: ["A queue + level size = level-order traversal.", "Use BFS for anything 'per level' or 'nearest'."]
        }
      ]
    }
  },
  {
    id: "binary-search-trees",
    slug: "binary-search-trees",
    title: "Binary Search Trees: Insert, Search and Validate",
    description: "The BST property, O(h) operations, why balance matters, and the classic validation trap.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "The BST Property",
          content: "For every node: all values in its left subtree are smaller, and all values in its right subtree are larger. Search, insert and delete follow one path down, costing O(h).\nA balanced tree has h = O(log n). Inserting sorted data into a plain BST builds a 'linked list' with h = n, so operations become O(n). Self-balancing trees (AVL, red-black, as used by TreeMap) keep h = O(log n)."
        },
        {
          type: "code",
          title: "Insert",
          language: "java",
          code: "static TreeNode insertBST(TreeNode root, int val) {\n    if (root == null) return new TreeNode(val);\n    if (val < root.val) root.left = insertBST(root.left, val);\n    else root.right = insertBST(root.right, val);\n    return root;\n}\n// inserting 4, 2, 6, 1, 3, 5, 7 builds the balanced example tree",
          explanation: "Search follows the same path: go left if smaller, right if larger, and stop when equal or at null."
        },
        {
          type: "code",
          title: "Validate a BST (pass down bounds)",
          language: "java",
          code: "static boolean isValidBST(TreeNode n, long lo, long hi) {\n    if (n == null) return true;\n    if (n.val <= lo || n.val >= hi) return false;\n    return isValidBST(n.left, lo, n.val) && isValidBST(n.right, n.val, hi);\n}\n// call: isValidBST(root, Long.MIN_VALUE, Long.MAX_VALUE)",
          explanation: "long bounds avoid failing on nodes whose value is Integer.MIN_VALUE or Integer.MAX_VALUE."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Is it enough to check node.left.val < node.val < node.right.val at every node?",
              trap: "Saying yes.",
              solution: "No. Tree 5 → left 1, right 6, and 6 has a left child 3. Every parent-child pair looks fine, but 3 sits in 5's right subtree while being smaller than 5. Every node must lie within the (lo, hi) range set by ALL its ancestors. Alternatively, check that the inorder traversal is strictly increasing."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Inserting 1, 2, 3, 4, 5 in that order into an empty BST gives a tree of height:",
          options: ["3", "5", "2", "log 5"],
          answer: 1,
          explanation: "Each value goes right of the previous one, forming a chain of height 5. That's why balancing matters."
        },
        {
          type: "takeaways",
          items: ["BST operations are O(h): O(log n) when balanced, O(n) when skewed.", "Validate with (lo, hi) bounds, not just parent-child comparisons.", "Java's TreeMap/TreeSet are balanced (red-black) BSTs."]
        }
      ]
    }
  },
  {
    id: "classic-tree-problems",
    slug: "classic-tree-problems",
    title: "Classic Tree Problems: Diameter and Lowest Common Ancestor",
    description: "Combine answers from both subtrees: diameter in one pass, and LCA of two nodes.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "Diameter (longest path between any two nodes)",
          language: "java",
          code: "static int diameter;\nstatic int depthForDiameter(TreeNode n) {\n    if (n == null) return 0;\n    int l = depthForDiameter(n.left), r = depthForDiameter(n.right);\n    diameter = Math.max(diameter, l + r);     // longest path through n, counted in edges\n    return 1 + Math.max(l, r);                // depth of n for its parent\n}\n// example tree -> diameter 4 (1 -> 2 -> 4 -> 6 -> 7)",
          explanation: "One postorder pass, O(n). The recursion returns one thing (depth) while updating another (the best path seen so far). This 'return X, track Y' pattern also solves maximum path sum."
        },
        {
          type: "code",
          title: "Lowest Common Ancestor (any binary tree)",
          language: "java",
          code: "static TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {\n    if (root == null || root == p || root == q) return root;\n    TreeNode l = lca(root.left, p, q);\n    TreeNode r = lca(root.right, p, q);\n    if (l != null && r != null) return root;   // p and q are on different sides\n    return l != null ? l : r;                  // both on one side\n}\n// example: lca(1, 3) = 2, lca(1, 7) = 4",
          explanation: "In a BST there's a simpler O(h) version: if both values are smaller than root go left, if both are larger go right, otherwise root is the LCA."
        },
        {
          type: "quickCheck",
          question: "In the diameter code, why is the answer kept in a separate variable instead of being returned?",
          options: ["Java can't return two values", "The longest path may not pass through the root, but the parent needs depth, not diameter", "For speed", "It's a style choice"],
          answer: 1,
          explanation: "A parent can only extend a single downward branch (depth). The best path through any node is a different quantity, so it's tracked globally."
        },
        {
          type: "takeaways",
          items: ["Postorder 'combine children' solves height, diameter and path sums.", "LCA: return the node that sees p and q on different sides."]
        }
      ]
    }
  }
];

export const heapLessons: CourseLesson[] = [
  {
    id: "heap-basics",
    slug: "heap-basics",
    title: "Binary Heaps: Array Representation, Sift Up and Sift Down",
    description: "How a heap is stored in an array, and the O(log n) insert and extract operations.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Heap Properties",
          content: "A binary heap is a complete binary tree (every level filled left to right) with the heap order property: in a min-heap, every parent ≤ its children, so the minimum is at the root.\n\nBecause it's complete, it fits in an array with no pointers. For index i:\nparent = (i − 1) / 2, left child = 2i + 1, right child = 2i + 2."
        },
        {
          type: "code",
          title: "A Min-Heap From Scratch",
          language: "java",
          code: "class MinHeap {\n    private int[] a = new int[16];\n    private int size = 0;\n\n    void add(int x) {                                        // O(log n)\n        if (size == a.length) a = Arrays.copyOf(a, size * 2);\n        a[size] = x;\n        int i = size++;\n        while (i > 0 && a[(i - 1) / 2] > a[i]) {             // sift up\n            swap(i, (i - 1) / 2);\n            i = (i - 1) / 2;\n        }\n    }\n\n    int poll() {                                             // O(log n), removes the min\n        int top = a[0];\n        a[0] = a[--size];                                    // move the last element to the root\n        int i = 0;\n        while (true) {                                       // sift down\n            int l = 2 * i + 1, r = l + 1, s = i;\n            if (l < size && a[l] < a[s]) s = l;\n            if (r < size && a[r] < a[s]) s = r;\n            if (s == i) break;\n            swap(i, s);\n            i = s;\n        }\n        return top;\n    }\n\n    boolean isEmpty() { return size == 0; }\n    private void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }\n}\n// add 5, 3, 8, 1, 9, 2 then poll repeatedly -> 1, 2, 3, 5, 8, 9",
          explanation: "The tree's height is log n, so sift up and sift down each take at most log n swaps."
        },
        {
          type: "table",
          title: "Heap Operation Costs",
          headers: ["Operation", "Cost"],
          rows: [["Peek min/max", "O(1)"], ["Insert", "O(log n)"], ["Extract min/max", "O(log n)"], ["Build a heap from n elements (heapify)", "O(n), not O(n log n)"], ["Search for an arbitrary value", "O(n)"]]
        },
        {
          type: "quickCheck",
          question: "In an array-based heap, what are the children of index 3?",
          options: ["6 and 7", "7 and 8", "4 and 5", "1 and 2"],
          answer: 1,
          explanation: "2i + 1 = 7 and 2i + 2 = 8."
        },
        {
          type: "takeaways",
          items: ["A heap is a complete tree stored in an array: parent (i − 1)/2, children 2i+1 and 2i+2.", "Insert = append + sift up; extract = move the last to the root + sift down; both O(log n).", "Building a heap from an array is O(n)."]
        }
      ]
    }
  },
  {
    id: "priority-queue-top-k",
    slug: "priority-queue-top-k",
    title: "PriorityQueue and Top-K Problems",
    description: "Java's PriorityQueue, custom comparators, kth largest, and top-k frequent elements.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "PriorityQueue Basics",
          language: "java",
          code: "PriorityQueue<Integer> minHeap = new PriorityQueue<>();                   // smallest first\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\nPriorityQueue<int[]> byDist = new PriorityQueue<>((a, b) -> a[1] - b[1]); // custom comparator\n\nminHeap.offer(5); minHeap.offer(1); minHeap.offer(3);\nminHeap.peek();   // 1\nminHeap.poll();   // 1",
          explanation: "Iterating a PriorityQueue or printing it does NOT give sorted order. Only repeated poll() does."
        },
        {
          type: "code",
          title: "Kth Largest Element: a Min-Heap of Size k",
          language: "java",
          code: "static int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> pq = new PriorityQueue<>();      // holds the k largest seen so far\n    for (int x : nums) {\n        pq.offer(x);\n        if (pq.size() > k) pq.poll();                        // drop the smallest\n    }\n    return pq.peek();                                        // smallest of the k largest\n}\n// {3, 2, 1, 5, 6, 4}, k = 2 -> 5",
          explanation: "O(n log k) time and O(k) space. That's better than sorting (O(n log n)) when k is small, and it works on a stream of data."
        },
        {
          type: "code",
          title: "Top K Frequent Elements",
          language: "java",
          code: "static int[] topKFrequent(int[] nums, int k) {\n    Map<Integer, Integer> freq = new HashMap<>();\n    for (int x : nums) freq.merge(x, 1, Integer::sum);\n    PriorityQueue<Integer> pq = new PriorityQueue<>((x, y) -> freq.get(x) - freq.get(y));\n    for (int x : freq.keySet()) {\n        pq.offer(x);\n        if (pq.size() > k) pq.poll();                         // evict the least frequent\n    }\n    int[] res = new int[k];\n    for (int i = k - 1; i >= 0; i--) res[i] = pq.poll();     // most frequent first\n    return res;\n}\n// {1, 1, 1, 2, 2, 3}, k = 2 -> {1, 2}",
          explanation: "The pattern: to keep the k largest, use a min-heap of size k. To keep the k smallest, use a max-heap of size k."
        },
        {
          type: "warning",
          title: "Comparator Pitfall",
          items: [
            "`(a, b) -> a - b` can overflow for large or negative ints (e.g. Integer.MIN_VALUE). `Integer.compare(a, b)` is always safe."
          ]
        },
        {
          type: "quickCheck",
          question: "To find the 10 largest values in a stream of 10 million numbers, use:",
          options: ["A max-heap of all numbers", "A min-heap of size 10", "Sort everything", "A HashSet"],
          answer: 1,
          explanation: "O(n log 10) time and O(10) memory. The heap's root is the smallest of the current top 10, ready to be evicted."
        },
        {
          type: "takeaways",
          items: ["k largest → min-heap of size k; k smallest → max-heap of size k.", "O(n log k) beats sorting for small k.", "Only poll() returns heap elements in order."]
        }
      ]
    }
  },
  {
    id: "merge-k-sorted-and-heap-sort",
    slug: "merge-k-sorted-and-heap-sort",
    title: "Merging K Sorted Lists and Heap Sort",
    description: "K-way merging with a heap, and how heap sort sorts in place in O(n log n).",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Merge K Sorted Arrays",
          language: "java",
          code: "static List<Integer> mergeKSorted(List<int[]> lists) {\n    // heap entries: {value, which list, index within that list}\n    PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> x[0] - y[0]);\n    for (int i = 0; i < lists.size(); i++)\n        if (lists.get(i).length > 0) pq.offer(new int[]{lists.get(i)[0], i, 0});\n    List<Integer> out = new ArrayList<>();\n    while (!pq.isEmpty()) {\n        int[] t = pq.poll();\n        out.add(t[0]);\n        int[] src = lists.get(t[1]);\n        if (t[2] + 1 < src.length) pq.offer(new int[]{src[t[2] + 1], t[1], t[2] + 1});\n    }\n    return out;\n}\n// [1,4,5], [1,3,4], [2,6] -> [1, 1, 2, 3, 4, 4, 5, 6]",
          explanation: "The heap never holds more than k entries, so for N total elements this is O(N log k). The same idea is used in external sorting and in merging database sorted runs."
        },
        {
          type: "text",
          title: "Heap Sort",
          content: "1. Build a max-heap from the array in place: O(n).\n2. Repeatedly swap the root (the maximum) with the last element of the heap, shrink the heap by one, and sift the new root down: n × O(log n).\nResult: O(n log n) in every case with O(1) extra space, but it isn't stable and it's less cache-friendly than quicksort, so it's rarely the default in practice."
        },
        {
          type: "quickCheck",
          question: "Merging k sorted lists with N elements in total using a heap costs:",
          options: ["O(N k)", "O(N log k)", "O(N log N)", "O(k log N)"],
          answer: 1,
          explanation: "Each of the N elements is pushed and popped once, and the heap size is at most k."
        },
        {
          type: "takeaways",
          items: ["K-way merge = a heap of each list's current element: O(N log k).", "Heap sort: O(n log n) always, in place, not stable."]
        }
      ]
    }
  }
];

export const graphLessons: CourseLesson[] = [
  {
    id: "graph-representation",
    slug: "graph-representation",
    title: "Graphs: Terminology and Representation",
    description: "Directed vs undirected, weighted graphs, adjacency lists vs matrices, and grids as graphs.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Terminology",
          content: "A graph G = (V, E) is a set of vertices (nodes) and edges (connections).\nDirected: edges have a direction (Twitter follows). Undirected: edges go both ways (Facebook friends).\nWeighted: edges carry costs (road distances).\nCycle: a path that returns to its start. DAG: a directed acyclic graph (task dependencies).\nConnected component: a maximal set of vertices that can all reach each other."
        },
        {
          type: "table",
          title: "Adjacency List vs Adjacency Matrix",
          headers: ["", "Adjacency list", "Adjacency matrix"],
          rows: [
            ["Space", "O(V + E)", "O(V²)"],
            ["Is there an edge (u, v)?", "O(degree of u)", "O(1)"],
            ["Iterate over u's neighbours", "O(degree of u)", "O(V)"],
            ["Best for", "Sparse graphs (most real graphs)", "Dense graphs, small V"]
          ]
        },
        {
          type: "code",
          title: "Building an Adjacency List in Java",
          language: "java",
          code: "int n = 6;\nint[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 4}, {3, 5}, {4, 5}};\nList<List<Integer>> adj = new ArrayList<>();\nfor (int i = 0; i < n; i++) adj.add(new ArrayList<>());\nfor (int[] e : edges) {\n    adj.get(e[0]).add(e[1]);\n    adj.get(e[1]).add(e[0]);      // omit this line for a directed graph\n}\n// Weighted: List<List<int[]>> with entries {neighbor, weight}",
          explanation: "This 6-node graph (0-1, 0-2, 1-3, 2-4, 3-5, 4-5) is used throughout the module."
        },
        {
          type: "text",
          title: "Grids Are Graphs",
          content: "In a 2D grid, each cell is a vertex and edges connect it to its up, down, left and right neighbours. You rarely build an adjacency list; just loop over the directions:\nint[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};\nIslands, mazes, flood fill and the shortest path in a matrix are all graph problems."
        },
        {
          type: "quickCheck",
          question: "A social network with 1 million users, each with about 200 friends, should be stored as:",
          options: ["An adjacency matrix", "An adjacency list", "A single array", "A binary tree"],
          answer: 1,
          explanation: "A matrix would need 10^12 cells. An adjacency list needs about 2 × 10^8 entries (V + E)."
        },
        {
          type: "takeaways",
          items: ["Adjacency list: O(V + E), the default choice.", "Matrix: O(1) edge checks, O(V²) space.", "Treat grids as implicit graphs with 4 (or 8) directions."]
        }
      ]
    }
  },
  {
    id: "bfs-and-dfs",
    slug: "bfs-and-dfs",
    title: "BFS and DFS: Traversal, Shortest Paths and Counting Islands",
    description: "The two fundamental graph traversals, when to use which, and the number-of-islands problem.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "code",
          title: "Breadth-First Search (queue)",
          language: "java",
          code: "static List<Integer> bfs(List<List<Integer>> adj, int start) {\n    boolean[] seen = new boolean[adj.size()];\n    List<Integer> order = new ArrayList<>();\n    Queue<Integer> q = new ArrayDeque<>();\n    q.offer(start);\n    seen[start] = true;                 // mark when ENQUEUED, not when dequeued\n    while (!q.isEmpty()) {\n        int u = q.poll();\n        order.add(u);\n        for (int v : adj.get(u))\n            if (!seen[v]) { seen[v] = true; q.offer(v); }\n    }\n    return order;\n}\n// from 0: [0, 1, 2, 3, 4, 5]",
          explanation: "BFS explores in rings of increasing distance, so in an unweighted graph the first time it reaches a node is along a shortest path."
        },
        {
          type: "code",
          title: "Depth-First Search (recursion)",
          language: "java",
          code: "static void dfs(List<List<Integer>> adj, int u, boolean[] seen, List<Integer> order) {\n    seen[u] = true;\n    order.add(u);\n    for (int v : adj.get(u))\n        if (!seen[v]) dfs(adj, v, seen, order);\n}\n// from 0: [0, 1, 3, 5, 4, 2]",
          explanation: "DFS goes as deep as possible before backtracking. Use an explicit stack if the graph is deep enough to risk StackOverflowError."
        },
        {
          type: "table",
          title: "BFS vs DFS",
          headers: ["", "BFS", "DFS"],
          rows: [
            ["Data structure", "Queue", "Stack / recursion"],
            ["Shortest path (unweighted)", "Yes", "No"],
            ["Memory", "The widest level", "The deepest path"],
            ["Great for", "Shortest paths, level-by-level work, nearest X", "Connectivity, cycle detection, topological order, backtracking"],
            ["Time", "O(V + E)", "O(V + E)"]
          ]
        },
        {
          type: "code",
          title: "Number of Islands (DFS flood fill on a grid)",
          language: "java",
          code: "static int numIslands(char[][] grid) {\n    int count = 0;\n    for (int r = 0; r < grid.length; r++)\n        for (int c = 0; c < grid[0].length; c++)\n            if (grid[r][c] == '1') { count++; sink(grid, r, c); }\n    return count;\n}\nstatic void sink(char[][] g, int r, int c) {\n    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;\n    g[r][c] = '0';                                   // mark visited by sinking the land\n    sink(g, r + 1, c); sink(g, r - 1, c); sink(g, r, c + 1); sink(g, r, c - 1);\n}\n// 11000 / 11000 / 00100 / 00011 -> 3 islands",
          explanation: "Each new '1' found by the scan is a new island; the flood fill erases it so it isn't counted again. O(rows × cols)."
        },
        {
          type: "quickCheck",
          question: "You need the minimum number of moves for a knight to reach a square on a chessboard. Use:",
          options: ["DFS", "BFS", "Dijkstra with random weights", "Topological sort"],
          answer: 1,
          explanation: "Every move costs 1 (an unweighted graph), so BFS finds the minimum number of moves."
        },
        {
          type: "takeaways",
          items: [
            "BFS = queue = shortest path in unweighted graphs; mark nodes when you enqueue them.",
            "DFS = recursion = connectivity, flood fill, cycles.",
            "Both are O(V + E)."
          ]
        }
      ]
    }
  },
  {
    id: "topological-sort",
    slug: "topological-sort",
    title: "Topological Sort and Cycle Detection in Directed Graphs",
    description: "Order tasks with dependencies using Kahn's algorithm, and detect impossible (cyclic) schedules.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "What and Why",
          content: "A topological order lists the vertices of a DAG so that every edge u → v has u before v. Examples: course prerequisites, build systems, and spreadsheet recalculation order. It exists only if the graph has no cycle."
        },
        {
          type: "code",
          title: "Kahn's Algorithm (BFS on in-degrees)",
          language: "java",
          code: "static List<Integer> topoSort(int n, int[][] edges) {\n    List<List<Integer>> adj = new ArrayList<>();\n    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n    int[] indeg = new int[n];\n    for (int[] e : edges) { adj.get(e[0]).add(e[1]); indeg[e[1]]++; }\n\n    Queue<Integer> q = new ArrayDeque<>();\n    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);   // no prerequisites\n    List<Integer> order = new ArrayList<>();\n    while (!q.isEmpty()) {\n        int u = q.poll();\n        order.add(u);\n        for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);  // v's prerequisites are all done\n    }\n    return order.size() == n ? order : null;                      // null means there's a cycle\n}\n// edges 5->2, 5->0, 4->0, 4->1, 2->3, 3->1  ->  [4, 5, 2, 0, 3, 1]\n// edges 0->1, 1->0                          ->  null (cycle)",
          explanation: "If a cycle exists, its vertices never reach in-degree 0, so fewer than n vertices get output. That's the cycle check for 'Can I finish all courses?'."
        },
        {
          type: "text",
          title: "DFS Alternative",
          content: "Run DFS and add each vertex to a list after all its descendants finish (postorder), then reverse the list. For cycle detection with DFS, use three colours: white (unvisited), grey (on the current path) and black (done). Reaching a grey vertex means a back edge, which means a cycle."
        },
        {
          type: "quickCheck",
          question: "Kahn's algorithm outputs only 4 of 6 vertices. What does that mean?",
          options: ["The graph is disconnected", "The graph contains a cycle", "The algorithm has a bug", "Two vertices have no edges"],
          answer: 1,
          explanation: "Vertices on a cycle always keep a positive in-degree, so they're never added to the queue. Disconnected parts would still be output."
        },
        {
          type: "takeaways",
          items: ["Topological order exists only for DAGs.", "Kahn's: repeatedly take vertices with in-degree 0; if fewer than n come out, there's a cycle.", "O(V + E)."]
        }
      ]
    }
  },
  {
    id: "dijkstra-shortest-path",
    slug: "dijkstra-shortest-path",
    title: "Dijkstra's Shortest Path Algorithm",
    description: "Shortest paths with non-negative weights using a priority queue, plus when to use Bellman-Ford instead.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "code",
          title: "Dijkstra With a Priority Queue",
          language: "java",
          code: "static int[] dijkstra(List<List<int[]>> adj, int src) {   // adj entries: {neighbor, weight}\n    int[] dist = new int[adj.size()];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);   // {node, distance}\n    pq.offer(new int[]{src, 0});\n    while (!pq.isEmpty()) {\n        int[] cur = pq.poll();\n        int u = cur[0];\n        if (cur[1] > dist[u]) continue;                  // stale entry: a better path was already found\n        for (int[] e : adj.get(u)) {\n            int v = e[0], nd = dist[u] + e[1];\n            if (nd < dist[v]) { dist[v] = nd; pq.offer(new int[]{v, nd}); }   // relax\n        }\n    }\n    return dist;\n}",
          explanation: "O((V + E) log V). The 'stale entry' check replaces the decrease-key operation Java's PriorityQueue lacks."
        },
        {
          type: "dryRun",
          title: "Undirected edges: 0-1 (4), 0-2 (1), 2-1 (2), 1-3 (1), 2-3 (5), 3-4 (3)",
          iterations: [
            { step: "pop 0 (0)", variables: { "dist": "[0, 4, 1, ∞, ∞]" }, description: "Relax 0→1 = 4 and 0→2 = 1." },
            { step: "pop 2 (1)", variables: { "dist": "[0, 3, 1, 6, ∞]" }, description: "0→2→1 = 3 beats 4. 0→2→3 = 6." },
            { step: "pop 1 (3)", variables: { "dist": "[0, 3, 1, 4, ∞]" }, description: "0→2→1→3 = 4 beats 6." },
            { step: "pop 3 (4)", variables: { "dist": "[0, 3, 1, 4, 7]" }, description: "3→4 gives 7." },
            { step: "done", variables: { "Shortest distances": "[0, 3, 1, 4, 7]" }, description: "Stale entries (1 at 4, 3 at 6) are skipped when popped." }
          ]
        },
        {
          type: "table",
          title: "Choosing a Shortest-Path Algorithm",
          headers: ["Situation", "Algorithm", "Time"],
          rows: [
            ["Unweighted (all edges cost 1)", "BFS", "O(V + E)"],
            ["Non-negative weights", "Dijkstra", "O((V + E) log V)"],
            ["Negative weights, or detecting negative cycles", "Bellman-Ford (relax all edges V − 1 times)", "O(V · E)"],
            ["All pairs, small V", "Floyd-Warshall", "O(V³)"],
            ["Weights are only 0 or 1", "0-1 BFS with a deque", "O(V + E)"]
          ]
        },
        {
          type: "quickCheck",
          question: "Why can't Dijkstra handle negative edge weights?",
          options: ["The priority queue can't store negatives", "It finalizes a node when it's popped, but a later negative edge could make that distance smaller", "It's too slow", "It can; it just needs more memory"],
          answer: 1,
          explanation: "Dijkstra assumes that once the closest unvisited node is popped, its distance can't improve. Negative edges break that assumption."
        },
        {
          type: "takeaways",
          items: ["Dijkstra = a greedy algorithm with a min-heap on distance; non-negative weights only.", "Skip stale heap entries instead of using decrease-key.", "Unweighted → BFS; negative weights → Bellman-Ford."]
        }
      ]
    }
  },
  {
    id: "union-find-and-mst",
    slug: "union-find-and-mst",
    title: "Union-Find (Disjoint Set Union) and Minimum Spanning Trees",
    description: "Near-constant-time connectivity checks, and Kruskal's algorithm for the cheapest network connecting all nodes.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "Union-Find With Path Compression",
          language: "java",
          code: "static int[] parent;\n\nstatic int find(int x) {                       // representative of x's set\n    return parent[x] == x ? x : (parent[x] = find(parent[x]));   // path compression\n}\n\nstatic boolean union(int a, int b) {           // false if already connected\n    int ra = find(a), rb = find(b);\n    if (ra == rb) return false;\n    parent[ra] = rb;\n    return true;\n}\n// init: parent[i] = i for every i",
          explanation: "With path compression plus union by rank/size, each operation is effectively O(1) (inverse Ackermann). Path compression alone is already very fast in practice."
        },
        {
          type: "text",
          title: "Minimum Spanning Tree (MST)",
          content: "An MST connects all V vertices of a weighted undirected graph using V − 1 edges with the minimum total weight. Examples: laying cable or roads, and clustering.\n\nKruskal's: sort the edges by weight and add each edge unless it would form a cycle (Union-Find checks this). O(E log E).\nPrim's: grow the tree from a start vertex, always adding the cheapest edge leaving the tree (priority queue). O(E log V). Good for dense graphs."
        },
        {
          type: "code",
          title: "Kruskal's Algorithm",
          language: "java",
          code: "static int kruskal(int n, int[][] edges) {              // edges: {u, v, weight}\n    Arrays.sort(edges, (a, b) -> a[2] - b[2]);\n    parent = new int[n];\n    for (int i = 0; i < n; i++) parent[i] = i;\n    int total = 0;\n    for (int[] e : edges)\n        if (union(e[0], e[1])) total += e[2];            // only edges that join two components\n    return total;\n}\n// graph from the Dijkstra lesson -> MST weight 7  (edges 0-2:1, 1-3:1, 2-1:2, 3-4:3)",
          explanation: "Greedy works here because of the cut property: the cheapest edge crossing any cut always belongs to some MST."
        },
        {
          type: "quickCheck",
          question: "An MST of a connected graph with 10 vertices has how many edges?",
          options: ["10", "9", "45", "It depends on the weights"],
          answer: 1,
          explanation: "Every spanning tree of V vertices has exactly V − 1 edges."
        },
        {
          type: "takeaways",
          items: ["Union-Find: find with path compression, union joins the roots, near-O(1) per operation.", "Kruskal = sort the edges + skip edges that form a cycle (Union-Find).", "An MST has V − 1 edges."]
        }
      ]
    }
  }
];
