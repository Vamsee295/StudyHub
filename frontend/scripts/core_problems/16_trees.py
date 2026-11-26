# Binary trees and BSTs (Striver A2Z trees step, NeetCode trees). Trees are level-order lists with None.
TR = "Trees"
TN = "The tree is given in level order with null for missing children; your function receives the root TreeNode (val, left, right)."


def _ino(n):
    return [] if not n else _ino(n.l) + [n.v] + _ino(n.r)


def _bst(vals):
    root = None
    for v in vals:
        root = _bst_ins(root, v)
    return root


def _bst_ins(n, v):
    if not n:
        return T(v)
    if v < n.v:
        n.l = _bst_ins(n.l, v)
    else:
        n.r = _bst_ins(n.r, v)
    return n


BST1 = untree(_bst([8, 3, 10, 1, 6, 14, 4, 7, 13]))
BST2 = untree(_bst([5, 3, 6, 2, 4, 7]))
TREE1 = [3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]

Q(TR, "preorder-traversal", "Binary Tree Preorder Traversal", "Easy", "preorderTraversal(root: TreeNode) -> int[]",
  ["Return the node values in preorder: node, then left subtree, then right subtree.", TN],
  [C([1, None, 2, 3]), C([]), C([1, 2, 3, 4, 5, 6, 7]), C(TREE1)], lambda r: (lambda f: f(f, tree(r)))(lambda f, n: [] if not n else [n.v] + f(f, n.l) + f(f, n.r)),
  "Recursion, or a stack: pop a node, record it, push right then left.", ["DFS", "Stack"])

Q(TR, "postorder-traversal", "Binary Tree Postorder Traversal", "Easy", "postorderTraversal(root: TreeNode) -> int[]",
  ["Return the node values in postorder: left subtree, right subtree, then the node.", TN],
  [C([1, None, 2, 3]), C([]), C([1, 2, 3, 4, 5, 6, 7]), C(TREE1)], lambda r: (lambda f: f(f, tree(r)))(lambda f, n: [] if not n else f(f, n.l) + f(f, n.r) + [n.v]),
  "Recursion; iteratively, a reversed (node, right, left) preorder gives postorder.", ["DFS", "Stack"])

Q(TR, "symmetric-tree", "Symmetric Tree", "Easy", "isSymmetric(root: TreeNode) -> boolean",
  ["Return true if the tree is a mirror of itself around its centre.", TN],
  [C([1, 2, 2, 3, 4, 4, 3]), C([1, 2, 2, None, 3, None, 3]), C([1]), C([1, 2, 2, 2, None, 2])], lambda r: _mirror(tree(r).l, tree(r).r) if r else True,
  "mirror(a, b): both empty, or equal values with mirror(a.left, b.right) and mirror(a.right, b.left).", ["DFS", "BFS"])

Q(TR, "balanced-tree", "Balanced Binary Tree", "Easy", "isBalanced(root: TreeNode) -> boolean",
  ["A tree is height-balanced if, at every node, the heights of the two subtrees differ by at most 1. Return whether the tree is balanced.", TN],
  [C([3, 9, 20, None, None, 15, 7]), C([1, 2, 2, 3, 3, None, None, 4, 4]), C([]), C([1, None, 2, None, 3])], lambda r: _height_bal(tree(r)) >= 0,
  "Return -1 from the height function as soon as a subtree is unbalanced, so it's one O(n) pass.", ["DFS"])

Q(TR, "min-depth", "Minimum Depth of Binary Tree", "Easy", "minDepth(root: TreeNode) -> int",
  ["Return the number of nodes on the shortest path from the root down to a leaf (0 for an empty tree).", TN],
  [C([3, 9, 20, None, None, 15, 7]), C([2, None, 3, None, 4, None, 5, None, 6]), C([]), C([1, 2])], lambda r: _min_depth(tree(r)),
  "BFS and stop at the first leaf. In recursion, a node with one child isn't a leaf.", ["BFS", "DFS"])

Q(TR, "count-complete-nodes", "Count Complete Tree Nodes", "Easy", "countNodes(root: TreeNode) -> int",
  ["The tree is complete (every level full except possibly the last, filled from the left). Return its node count in less than O(n).", TN],
  [C([1, 2, 3, 4, 5, 6]), C([]), C([1]), C(list(range(1, 25)))], lambda r: len(r), "If the left-most and right-most depths match, the subtree is perfect: 2^h - 1 nodes. Otherwise recurse.", ["Binary Search", "DFS"])

Q(TR, "right-side-view", "Binary Tree Right Side View", "Medium", "rightSideView(root: TreeNode) -> int[]",
  ["Return the values you'd see standing on the right of the tree: the last node of each level, top to bottom.", TN],
  [C([1, 2, 3, None, 5, None, 4]), C([1, None, 3]), C([]), C([1, 2, 3, 4])], lambda r: [lvl[-1] for lvl in _levels(tree(r))],
  "Level-order traversal keeping the last node of each level (or DFS visiting right first).", ["BFS", "DFS"])

Q(TR, "zigzag-level-order", "Binary Tree Zigzag Level Order Traversal", "Medium", "zigzagLevelOrder(root: TreeNode) -> int[][]",
  ["Return the level order traversal, alternating direction: left to right, then right to left, and so on.", TN],
  [C([3, 9, 20, None, None, 15, 7]), C([1]), C([]), C([1, 2, 3, 4, 5, 6, 7])], lambda r: [lvl if i % 2 == 0 else lvl[::-1] for i, lvl in enumerate(_levels(tree(r)))],
  "BFS by levels and reverse every other level.", ["BFS"])

Q(TR, "top-view", "Top View of Binary Tree", "Medium", "topView(root: TreeNode) -> int[]",
  ["Give the root horizontal distance 0, a left child hd - 1 and a right child hd + 1. The top view is, for each hd from left to right, the first node reached in level order. Return those values.", TN],
  [C([1, 2, 3]), C([10, 20, 30, 40, 60, 90, 100]), C([1, 2, 3, None, 4, None, None, None, 5, None, 6]), C([1])], lambda r: _view(tree(r), top=True),
  "BFS with (node, hd); record a node only for the first time its hd appears.", ["BFS", "Hash Map"])

Q(TR, "bottom-view", "Bottom View of Binary Tree", "Medium", "bottomView(root: TreeNode) -> int[]",
  ["With the same horizontal distances as Top View, the bottom view is, for each hd from left to right, the last node reached in level order. Return those values.", TN],
  [C([20, 8, 22, 5, 3, None, 25, None, None, 10, 14]), C([1, 3, 2]), C([1]), C([1, 2, 3, 4, 5, 6, 7])], lambda r: _view(tree(r), top=False),
  "BFS with (node, hd); overwrite the map entry for an hd every time.", ["BFS", "Hash Map"])

Q(TR, "lca-bst", "Lowest Common Ancestor of a BST", "Medium", "lowestCommonAncestor(root: TreeNode, p: int, q: int) -> int",
  ["root is a binary search tree with distinct values. p and q are values of two nodes in it. Return the value of their lowest common ancestor (a node can be its own ancestor).", TN],
  [C(BST2, 2, 4), C(BST2, 2, 7), C(BST2, 3, 4), C(BST1, 13, 4)], lambda r, p, q: _lca_bst(tree(r), p, q),
  "If both values are smaller go left, both larger go right; otherwise you're at the split point.", ["Binary Search Tree", "DFS"])

Q(TR, "lca-binary-tree", "Lowest Common Ancestor of a Binary Tree", "Medium", "lowestCommonAncestor(root: TreeNode, p: int, q: int) -> int",
  ["Values are distinct; p and q are values of two nodes in the tree. Return the value of their lowest common ancestor.", TN],
  [C(TREE1, 5, 1), C(TREE1, 5, 4), C([1, 2], 1, 2), C(TREE1, 7, 8)], lambda r, p, q: _lca(tree(r), p, q).v,
  "Return the node if it's p or q; if both subtrees return something, this node is the LCA.", ["DFS"])

Q(TR, "kth-smallest-bst", "Kth Smallest Element in a BST", "Medium", "kthSmallest(root: TreeNode, k: int) -> int",
  ["Return the k-th smallest value (1-based) in the binary search tree.", TN],
  [C([3, 1, 4, None, 2], 1), C([5, 3, 6, 2, 4, None, None, 1], 3), C(BST1, 5), C([1], 1)], lambda r, k: sorted(x for x in r if x is not None)[k - 1],
  "An inorder traversal visits a BST in sorted order; stop at the k-th node.", ["Binary Search Tree", "DFS"])

Q(TR, "insert-into-bst", "Insert into a Binary Search Tree", "Medium", "insertIntoBST(root: TreeNode, val: int) -> TreeNode",
  ["Insert val (not already present) into the BST as a new leaf, following the usual rule (smaller goes left), and return the root.", TN],
  [C([4, 2, 7, 1, 3], 5), C([40, 20, 60, 10, 30, 50, 70], 25), C([], 5), C(BST2, 1)], lambda r, v: untree(_bst_ins(tree(r), v)),
  "Walk down comparing with each node until you reach an empty child spot.", ["Binary Search Tree"])

Q(TR, "search-bst", "Search in a Binary Search Tree", "Easy", "searchBST(root: TreeNode, val: int) -> TreeNode",
  ["Return the subtree rooted at the node whose value is val, or an empty tree if it isn't there.", TN],
  [C([4, 2, 7, 1, 3], 2), C([4, 2, 7, 1, 3], 5), C(BST1, 6), C([1], 1)], lambda r, v: untree(_find(tree(r), v)),
  "Go left when val is smaller, right when larger.", ["Binary Search Tree"])

Q(TR, "max-path-sum", "Binary Tree Maximum Path Sum", "Hard", "maxPathSum(root: TreeNode) -> int",
  ["A path is any sequence of connected nodes, each used once; it needn't pass through the root. Return the maximum path sum.", TN],
  [C([1, 2, 3]), C([-10, 9, 20, None, None, 15, 7]), C([-3]), C([5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1]), C([2, -1])], lambda r: _max_path(tree(r)),
  "At each node, the best downward gain is val + max(0, left gain, right gain); a path through it is val + both gains.", ["DFS", "Dynamic Programming"])

Q(TR, "build-from-pre-in", "Construct Binary Tree from Preorder and Inorder Traversal", "Medium", "buildTree(preorder: int[], inorder: int[]) -> TreeNode",
  "Values are distinct. Rebuild the binary tree from its preorder and inorder traversals and return its root.",
  [C([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]), C([-1], [-1]), C([1, 2], [2, 1]), C([1, 2, 4, 5, 3, 6], [4, 2, 5, 1, 6, 3])], lambda pre, ino: untree(_build(pre, ino)),
  "preorder[0] is the root; its position in inorder splits the left and right subtrees. Use a value -> index map.", ["Divide and Conquer", "Hash Map"])

Q(TR, "sorted-array-to-bst", "Convert Sorted Array to Binary Search Tree", "Easy", "sortedArrayToBST(nums: int[]) -> TreeNode",
  "nums is sorted ascending. Build a height-balanced BST by always choosing the left-middle element, nums[(lo + hi) / 2], as the root of each range. Return the root.",
  [C([-10, -3, 0, 5, 9]), C([1, 3]), C([7]), C(list(range(1, 11)))], lambda a: untree(_from_sorted(a, 0, len(a) - 1)),
  "Recursively: the middle element becomes the root, the halves become the subtrees.", ["Divide and Conquer"])

Q(TR, "max-width-tree", "Maximum Width of Binary Tree", "Medium", "widthOfBinaryTree(root: TreeNode) -> int",
  ["The width of a level is the distance between its leftmost and rightmost nodes, counting the null positions between them as in a complete tree. Return the maximum width.", TN],
  [C([1, 3, 2, 5, 3, None, 9]), C([1, 3, 2, 5, None, None, 9, 6, None, 7]), C([1, 3, 2, 5]), C([1])], lambda r: _width(tree(r)),
  "Number nodes like a heap (left 2i, right 2i + 1) during BFS; width = last - first + 1 per level.", ["BFS"])

Q(TR, "count-good-nodes", "Count Good Nodes in Binary Tree", "Medium", "goodNodes(root: TreeNode) -> int",
  ["A node is good if no node on the path from the root to it has a greater value. Return how many good nodes there are.", TN],
  [C([3, 1, 4, 3, None, 1, 5]), C([3, 3, None, 4, 2]), C([1]), C([2, None, 4, 10, 8, None, None, 4])], lambda r: _good(tree(r), -10**9),
  "DFS carrying the maximum seen on the path.", ["DFS"])

Q(TR, "subtree-of-another", "Subtree of Another Tree", "Easy", "isSubtree(root: TreeNode, subRoot: TreeNode) -> boolean",
  ["Return true if some node of root has a subtree identical (structure and values) to subRoot.", TN],
  [C([3, 4, 5, 1, 2], [4, 1, 2]), C([3, 4, 5, 1, 2, None, None, None, None, 0], [4, 1, 2]), C([1, 1], [1]), C([1, 2, 3], [2, 3])], lambda a, b: _has_sub(tree(a), tree(b)),
  "For each node, check Same Tree against subRoot.", ["DFS"])

Q(TR, "merge-two-trees", "Merge Two Binary Trees", "Easy", "mergeTrees(root1: TreeNode, root2: TreeNode) -> TreeNode",
  ["Overlay the two trees: overlapping nodes add their values; a node present in only one tree is used as is. Return the merged root.", TN],
  [C([1, 3, 2, 5], [2, 1, 3, None, 4, None, 7]), C([1], [1, 2]), C([], [5]), C([], [])], lambda a, b: untree(_merge(tree(a), tree(b))),
  "Recursively: if either is empty return the other; otherwise add values and merge children.", ["DFS"])

Q(TR, "binary-tree-paths", "Binary Tree Paths", "Easy", "binaryTreePaths(root: TreeNode) -> String[]",
  ["Return every root-to-leaf path as a string like \"1->2->5\", in DFS order (left subtree before right).", TN],
  [C([1, 2, 3, None, 5]), C([1]), C([1, 2, 3, 4, 5, 6, 7]), C([10, None, 20, 30])], lambda r: _paths(tree(r), ""),
  "DFS carrying the path string; add it when you reach a leaf.", ["DFS", "Backtracking", "Strings"])

Q(TR, "flatten-to-list", "Flatten Binary Tree to Linked List", "Medium", "flatten(root: TreeNode) -> TreeNode",
  ["Flatten the tree in place into a \"linked list\" using right pointers, in preorder, with every left child null. Return the root.", TN],
  [C([1, 2, 5, 3, 4, None, 6]), C([]), C([0]), C([1, 2, 3])], lambda r: untree(reduce(lambda acc, v: T(v, None, acc), reversed(_pre(tree(r))), None)) if r else [],
  "For each node, hang the right subtree under the right-most node of the left subtree, then move left to right.", ["DFS", "Linked List"])


def _mirror(a, b):
    if not a or not b:
        return a is b
    return a.v == b.v and _mirror(a.l, b.r) and _mirror(a.r, b.l)


def _height_bal(n):
    if not n:
        return 0
    l, r = _height_bal(n.l), _height_bal(n.r)
    return -1 if l < 0 or r < 0 or abs(l - r) > 1 else 1 + max(l, r)


def _min_depth(n):
    if not n:
        return 0
    if not n.l or not n.r:
        return 1 + _min_depth(n.l or n.r)
    return 1 + min(_min_depth(n.l), _min_depth(n.r))


def _levels(root):
    out, lvl = [], [root] if root else []
    while lvl:
        out.append([n.v for n in lvl])
        lvl = [c for n in lvl for c in (n.l, n.r) if c]
    return out


def _view(root, top):
    seen, q = {}, deque([(root, 0)])
    while q:
        n, hd = q.popleft()
        if top:
            seen.setdefault(hd, n.v)
        else:
            seen[hd] = n.v
        if n.l:
            q.append((n.l, hd - 1))
        if n.r:
            q.append((n.r, hd + 1))
    return [seen[k] for k in sorted(seen)]


def _lca_bst(n, p, q):
    while True:
        if p < n.v and q < n.v:
            n = n.l
        elif p > n.v and q > n.v:
            n = n.r
        else:
            return n.v


def _lca(n, p, q):
    if not n or n.v in (p, q):
        return n
    l, r = _lca(n.l, p, q), _lca(n.r, p, q)
    return n if l and r else l or r


def _find(n, v):
    while n and n.v != v:
        n = n.l if v < n.v else n.r
    return n


def _max_path(root):
    best = -10**18

    def gain(n):
        nonlocal best
        if not n:
            return 0
        l, r = max(0, gain(n.l)), max(0, gain(n.r))
        best = max(best, n.v + l + r)
        return n.v + max(l, r)

    gain(root)
    return best


def _build(pre, ino):
    if not pre:
        return None
    i = ino.index(pre[0])
    return T(pre[0], _build(pre[1:i + 1], ino[:i]), _build(pre[i + 1:], ino[i + 1:]))


def _from_sorted(a, lo, hi):
    if lo > hi:
        return None
    mid = (lo + hi) // 2
    return T(a[mid], _from_sorted(a, lo, mid - 1), _from_sorted(a, mid + 1, hi))


def _width(root):
    best, lvl = 0, [(root, 0)]
    while lvl:
        best = max(best, lvl[-1][1] - lvl[0][1] + 1)
        lvl = [(c, 2 * i + k) for n, i in lvl for k, c in ((0, n.l), (1, n.r)) if c]
    return best


def _good(n, mx):
    return 0 if not n else (n.v >= mx) + _good(n.l, max(mx, n.v)) + _good(n.r, max(mx, n.v))


def _has_sub(a, b):
    return bool(a) and (untree(a) == untree(b) or _has_sub(a.l, b) or _has_sub(a.r, b))


def _merge(a, b):
    if not a or not b:
        return a or b
    return T(a.v + b.v, _merge(a.l, b.l), _merge(a.r, b.r))


def _paths(n, pre):
    if not n:
        return []
    s = f"{pre}->{n.v}" if pre else str(n.v)
    if not n.l and not n.r:
        return [s]
    return _paths(n.l, s) + _paths(n.r, s)


def _pre(n):
    return [] if not n else [n.v] + _pre(n.l) + _pre(n.r)
