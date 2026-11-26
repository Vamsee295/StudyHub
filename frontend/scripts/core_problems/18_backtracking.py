# Backtracking (Striver A2Z recursion/backtracking, NeetCode backtracking). Outputs with many answers are
# requested in a stated order so they can be compared exactly.
BT = "Backtracking"
SUDOKU = ["53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"]

Q(BT, "subsets-ii", "Subsets II", "Medium", "subsetsWithDup(nums: int[]) -> int[][]",
  "nums may contain duplicates. Return all distinct subsets; each subset sorted ascending, the list in lexicographic order.",
  [C([1, 2, 2]), C([0]), C([4, 4, 4, 1, 4]), C([3, 1, 2])], lambda a: [list(t) for t in sorted({tuple(sorted(c)) for r in range(len(a) + 1) for c in itertools.combinations(a, r)})],
  "Sort first; at each level skip a value equal to the previous one at the same depth.", ["Recursion", "Bit Manipulation"])

Q(BT, "combination-sum", "Combination Sum", "Medium", "combinationSum(candidates: int[], target: int) -> int[][]",
  "candidates are distinct positive integers, each usable any number of times. Return every unique combination summing to target, each sorted ascending, the list in lexicographic order.",
  [C([2, 3, 6, 7], 7), C([2, 3, 5], 8), C([2], 1), C([7, 3, 2], 18)], lambda c, t: sorted(_combos(sorted(c), t, 0, True)),
  "Recurse with a start index; you may stay on the same candidate to reuse it.", ["Recursion"])

Q(BT, "combination-sum-ii", "Combination Sum II", "Medium", "combinationSum2(candidates: int[], target: int) -> int[][]",
  "Each candidate may be used once and candidates may repeat. Return every unique combination summing to target, each sorted ascending, the list in lexicographic order.",
  [C([10, 1, 2, 7, 6, 1, 5], 8), C([2, 5, 2, 1, 2], 5), C([1], 2), C([4, 1, 1, 4, 4, 4, 4, 2, 3, 5], 10)], lambda c, t: [list(x) for x in sorted({tuple(x) for x in _combos(sorted(c), t, 0, False)})],
  "Sort; skip equal values at the same depth; move to i + 1 after choosing i.", ["Recursion"])

Q(BT, "combination-sum-iii", "Combination Sum III", "Medium", "combinationSum3(k: int, n: int) -> int[][]",
  "Find all combinations of k distinct numbers from 1-9 that sum to n. Each combination ascending, the list in lexicographic order.",
  [C(3, 7), C(3, 9), C(4, 1), C(2, 18), C(9, 45)], lambda k, n: [list(c) for c in itertools.combinations(range(1, 10), k) if sum(c) == n],
  "Choose numbers in increasing order and prune when the sum overshoots.", ["Recursion"])

Q(BT, "combinations", "Combinations", "Medium", "combine(n: int, k: int) -> int[][]",
  "Return all combinations of k numbers chosen from 1..n, each ascending, in lexicographic order.",
  [C(4, 2), C(1, 1), C(5, 3), C(3, 3)], lambda n, k: [list(c) for c in itertools.combinations(range(1, n + 1), k)], "Recurse choosing the next number after the last chosen one.", ["Recursion"])

Q(BT, "permutations-ii", "Permutations II", "Medium", "permuteUnique(nums: int[]) -> int[][]",
  "nums may contain duplicates. Return all distinct permutations in lexicographic order.",
  [C([1, 1, 2]), C([1, 2, 3]), C([2, 2, 1, 1]), C([0])], lambda a: [list(p) for p in sorted(set(itertools.permutations(a)))],
  "Sort, and skip nums[i] if it equals nums[i - 1] and nums[i - 1] isn't used in the current path.", ["Recursion"])

Q(BT, "letter-combinations-phone", "Letter Combinations of a Phone Number", "Medium", "letterCombinations(digits: String) -> String[]",
  "Digits 2-9 map to letters as on a phone keypad (2 = abc, ..., 7 = pqrs, 9 = wxyz). Return every letter combination the digits could spell, in lexicographic order. Empty input gives an empty list.",
  [C("23"), C(""), C("2"), C("79")], lambda d: ["".join(p) for p in itertools.product(*[_PAD[c] for c in d])] if d else [],
  "One recursion level per digit, looping over its letters.", ["Strings", "Hash Map"])

Q(BT, "palindrome-partitioning", "Palindrome Partitioning", "Medium", "partition(s: String) -> String[]",
  "Return every way to split s into palindromic parts. Write each partition as its parts joined by '|' (e.g. \"a|a|b\"), in the order a depth-first search tries shorter first parts first.",
  [C("aab"), C("a"), C("aba"), C("abba")], lambda s: ["|".join(p) for p in _pal_parts(s)],
  "At each start index, try every end index whose substring is a palindrome, recurse on the rest.", ["Strings", "Dynamic Programming"])

Q(BT, "word-search", "Word Search", "Medium", "exist(board: String[], word: String) -> boolean",
  "board is a grid of letters (one string per row). Return true if word can be traced through adjacent cells (up, down, left, right), using each cell at most once.",
  [C(["ABCE", "SFCS", "ADEE"], "ABCCED"), C(["ABCE", "SFCS", "ADEE"], "SEE"), C(["ABCE", "SFCS", "ADEE"], "ABCB"), C(["a"], "a"), C(["aa"], "aaa")],
  lambda b, w: _word_exist(b, w), "DFS from every cell, marking cells as visited on the way in and unmarking on the way out.", ["Matrix", "DFS"])

Q(BT, "n-queens-ii", "N-Queens II", "Hard", "totalNQueens(n: int) -> int",
  "Return how many ways n queens can be placed on an n x n board so that no two attack each other.",
  [C(4), C(1), C(2), C(6), C(8)], lambda n: [1, 1, 0, 0, 2, 10, 4, 40, 92, 352][n], "Place one queen per row; track used columns and both diagonals (r + c and r - c).", ["Recursion"])

Q(BT, "sudoku-solver", "Sudoku Solver", "Hard", "solveSudoku(board: String[]) -> String[]",
  "board is 9 strings of 9 characters, digits or '.' for empty. The puzzle has exactly one solution. Return the solved board in the same format.",
  [C(SUDOKU), C(["..9748...", "7........", ".2.1.9...", "..7...24.", ".64.1.59.", ".98...3..", "...8.3.2.", "........6", "...2759.."])], lambda b: _solve_sudoku(b),
  "Find an empty cell, try digits that don't clash with its row, column and box, recurse, undo on failure.", ["Matrix", "Hash Set"], visible=1)

Q(BT, "rat-in-maze", "Rat in a Maze", "Medium", "findPath(maze: int[][]) -> String[]",
  "The rat starts at the top-left of an n x n maze (1 = open, 0 = blocked) and must reach the bottom-right, moving U, D, L or R without revisiting a cell. Return every path as a string of moves, in lexicographic order.",
  [C([[1, 0, 0, 0], [1, 1, 0, 1], [1, 1, 0, 0], [0, 1, 1, 1]]), C([[1, 0], [1, 0]]), C([[1, 1, 1], [1, 0, 1], [1, 1, 1]]), C([[1]])], lambda m: sorted(_rat(m)),
  "DFS trying D, L, R, U (alphabetical) with a visited grid; record the path at the target.", ["Matrix", "Recursion"])

Q(BT, "m-coloring", "M-Coloring Problem", "Medium", "graphColoring(n: int, edges: int[][], m: int) -> boolean",
  "Return true if the undirected graph with vertices 0..n-1 can be coloured with at most m colours so that no edge joins two vertices of the same colour.",
  [C(4, [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]], 3), C(3, [[0, 1], [1, 2], [0, 2]], 2), C(1, [], 1), C(5, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]], 2)], lambda n, e, m: _color(n, e, m),
  "Assign colours vertex by vertex, checking only already-coloured neighbours; backtrack on conflict.", ["Graphs"])

Q(BT, "word-break-ii", "Word Break II", "Hard", "wordBreak(s: String, wordDict: String[]) -> String[]",
  "Insert spaces into s so every word is in wordDict (words may be reused). Return every possible sentence, sorted lexicographically.",
  [C("catsanddog", ["cat", "cats", "and", "sand", "dog"]), C("pineapplepenapple", ["apple", "pen", "applepen", "pine", "pineapple"]), C("catsandog", ["cats", "dog", "sand", "and", "cat"]), C("aaaa", ["a", "aa"])],
  lambda s, d: sorted(_wb2(s, tuple(d))), "Recurse on each dictionary prefix; memoise results by start index.", ["Dynamic Programming", "Strings", "Trie"])

Q(BT, "restore-ip-addresses", "Restore IP Addresses", "Medium", "restoreIpAddresses(s: String) -> String[]",
  "Insert three dots into the digit string s to form valid IPv4 addresses (four parts 0-255, no leading zeros except \"0\" itself). Return all of them, sorted lexicographically.",
  [C("25525511135"), C("0000"), C("101023"), C("1111"), C("010010")], lambda s: sorted(_ips(s)), "Choose 1-3 digits for each of the four parts, validating as you go.", ["Strings"])

Q(BT, "letter-case-permutation", "Letter Case Permutation", "Medium", "letterCasePermutation(s: String) -> String[]",
  "Each letter of s may be lowercase or uppercase. Return every resulting string, sorted lexicographically.",
  [C("a1b2"), C("3z4"), C("12345"), C("C")], lambda s: sorted({"".join(p) for p in itertools.product(*[(c.lower(), c.upper()) if c.isalpha() else (c,) for c in s])}),
  "Branch on each letter (lower and upper), pass digits through.", ["Strings", "Bit Manipulation"])

Q(BT, "beautiful-arrangement", "Beautiful Arrangement", "Medium", "countArrangement(n: int) -> int",
  "A permutation perm of 1..n is beautiful if for every position i (1-based), perm[i] is divisible by i or i is divisible by perm[i]. Return how many beautiful permutations exist.",
  [C(2), C(1), C(3), C(6), C(10)], lambda n: _beautiful(n), "Fill positions one by one with unused numbers that satisfy the rule.", ["Bit Manipulation", "Dynamic Programming"])

Q(BT, "expression-add-operators", "Expression Add Operators", "Hard", "addOperators(num: String, target: int) -> String[]",
  "Insert +, - or * between the digits of num (operands may not have leading zeros) so the expression evaluates to target. Return all such expressions, sorted lexicographically.",
  [C("123", 6), C("232", 8), C("3456237490", 9191), C("105", 5), C("00", 0)], lambda n, t: sorted(_add_ops(n, t)),
  "Recurse carrying the running value and the last operand, so * can undo and redo the last term.", ["Math", "Strings"])

Q(BT, "partition-k-equal-subsets", "Partition to K Equal Sum Subsets", "Medium", "canPartitionKSubsets(nums: int[], k: int) -> boolean",
  "Return true if nums can be divided into k non-empty subsets with equal sums.",
  [C([4, 3, 2, 3, 5, 2, 1], 4), C([1, 2, 3, 4], 3), C([2, 2, 2, 2, 3, 4, 5], 4), C([5], 1)], lambda a, k: _k_parts(a, k),
  "Sort descending; fill buckets with backtracking, skipping buckets with the same current sum.", ["Dynamic Programming", "Bit Manipulation"])

Q(BT, "matchsticks-square", "Matchsticks to Square", "Medium", "makesquare(matchsticks: int[]) -> boolean",
  "Return true if all matchsticks can form a square (each used exactly once, none broken).",
  [C([1, 1, 2, 2, 2]), C([3, 3, 3, 3, 4]), C([5, 5, 5, 5]), C([1, 1, 1])], lambda a: len(a) >= 4 and _k_parts(a, 4), "It's partition into 4 equal subsets.", ["Dynamic Programming"])

Q(BT, "split-descending-consecutive", "Splitting a String Into Descending Consecutive Values", "Medium", "splitString(s: String) -> boolean",
  "Return true if s can be split into two or more substrings whose numeric values are in descending order with each adjacent pair differing by exactly 1.",
  [C("1234"), C("050043"), C("9080701"), C("10009998"), C("21")], lambda s: _split_desc(s), "Try every first number, then greedily look for value - 1 next.", ["Strings"])

Q(BT, "max-length-unique-concat", "Maximum Length of a Concatenated String with Unique Characters", "Medium", "maxLength(arr: String[]) -> int",
  "Choose a subsequence of arr whose concatenation has all distinct characters. Return the maximum possible length.",
  [C(["un", "iq", "ue"]), C(["cha", "r", "act", "ers"]), C(["abcdefghijklmnopqrstuvwxyz"]), C(["aa", "bb"])],
  lambda arr: max((len(s) for r in range(len(arr) + 1) for c in itertools.combinations(arr, r) for s in ["".join(c)] if len(set(s)) == len(s)), default=0),
  "Include or skip each word, keeping a 26-bit mask of used letters.", ["Bit Manipulation", "Strings"])

Q(BT, "additive-number", "Additive Number", "Medium", "isAdditiveNumber(num: String) -> boolean",
  "An additive number's digits split into at least three numbers where each is the sum of the two before it (no leading zeros). Return whether num is additive.",
  [C("112358"), C("199100199"), C("1023"), C("101"), C("000")], lambda s: _additive(s), "Choose the first two numbers; the rest is forced. Use big integers or long.", ["Strings", "Math"])

Q(BT, "path-max-gold", "Path with Maximum Gold", "Medium", "getMaximumGold(grid: int[][]) -> int",
  "Each cell has some gold (0 = empty, can't enter). Start anywhere with gold, move up/down/left/right, never revisit a cell, and collect gold as you go. Return the most gold you can collect.",
  [C([[0, 6, 0], [5, 8, 7], [0, 9, 0]]), C([[1, 0, 7], [2, 0, 6], [3, 4, 5], [0, 3, 0], [9, 0, 20]]), C([[0]]), C([[1, 1], [1, 1]])], lambda g: _gold(g),
  "DFS from every gold cell, temporarily zeroing cells on the path.", ["Matrix", "DFS"])

Q(BT, "unique-paths-iii", "Unique Paths III", "Hard", "uniquePathsIII(grid: int[][]) -> int",
  "In the grid, 1 is the start, 2 the end, 0 empty and -1 an obstacle. Count the 4-directional walks from start to end that visit every non-obstacle cell exactly once.",
  [C([[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 2, -1]]), C([[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 2]]), C([[0, 1], [2, 0]]), C([[1, 2]])], lambda g: _paths3(g),
  "DFS counting remaining empty cells; a walk counts only if it reaches 2 with none left.", ["Matrix", "DFS"])

Q(BT, "word-search-ii", "Word Search II", "Hard", "findWords(board: String[], words: String[]) -> String[]",
  "Return every word from words that can be traced on the board (adjacent cells, each used once per word), sorted lexicographically.",
  [C(["oaan", "etae", "ihkr", "iflv"], ["oath", "pea", "eat", "rain"]), C(["ab", "cd"], ["abcb"]), C(["a"], ["a", "b"]), C(["abc", "aed", "afg"], ["abcdefg", "gfedcbaaa", "eaabcdgfa", "befa", "dgc", "ade"])],
  lambda b, ws: sorted({w for w in ws if _word_exist(b, w)}), "Put the words in a trie and DFS the board once, walking the trie as you go.", ["Trie", "Matrix"])

Q(BT, "letter-tile-possibilities", "Letter Tile Possibilities", "Medium", "numTilePossibilities(tiles: String) -> int",
  "Return how many distinct non-empty sequences of letters you can make using the tiles (each tile at most once per sequence).",
  [C("AAB"), C("AAABBC"), C("V"), C("ABCD")], lambda t: len({p for r in range(1, len(t) + 1) for p in itertools.permutations(t, r)}),
  "Backtrack over letter counts: for each letter with count > 0, use it, count 1, recurse, restore.", ["Hash Map", "Strings"])

Q(BT, "fair-cookies", "Fair Distribution of Cookies", "Medium", "distributeCookies(cookies: int[], k: int) -> int",
  "Give every bag of cookies to one of k children. The unfairness is the largest total any child gets. Return the minimum unfairness.",
  [C([8, 15, 10, 20, 8], 2), C([6, 1, 3, 2, 2, 4, 1, 2], 3), C([5, 5], 2), C([1, 2, 3, 4, 5, 6, 7], 3)], lambda c, k: _cookies(c, k),
  "Assign bags one by one to each child, pruning when a child's total already exceeds the best answer.", ["Dynamic Programming", "Bit Manipulation"])


_PAD = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}


def _combos(c, t, start, reuse):
    if t == 0:
        return [[]]
    out = []
    for i in range(start, len(c)):
        if c[i] > t:
            break
        for rest in _combos(c, t - c[i], i if reuse else i + 1, reuse):
            out.append([c[i]] + rest)
    return out


def _pal_parts(s):
    if not s:
        return [[]]
    return [[s[:i]] + rest for i in range(1, len(s) + 1) if s[:i] == s[:i][::-1] for rest in _pal_parts(s[i:])]


def _word_exist(b, w):
    R, Cc = len(b), len(b[0])

    def dfs(r, c, i, seen):
        if i == len(w):
            return True
        if not (0 <= r < R and 0 <= c < Cc) or (r, c) in seen or b[r][c] != w[i]:
            return False
        seen.add((r, c))
        ok = any(dfs(r + dr, c + dc, i + 1, seen) for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        seen.discard((r, c))
        return ok

    return any(dfs(r, c, 0, set()) for r in range(R) for c in range(Cc))


def _solve_sudoku(b):
    g = [list(r) for r in b]

    def ok(r, c, d):
        return all(g[r][j] != d for j in range(9)) and all(g[i][c] != d for i in range(9)) and all(
            g[i][j] != d for i in range(r // 3 * 3, r // 3 * 3 + 3) for j in range(c // 3 * 3, c // 3 * 3 + 3))

    def solve():
        for r in range(9):
            for c in range(9):
                if g[r][c] == ".":
                    for d in "123456789":
                        if ok(r, c, d):
                            g[r][c] = d
                            if solve():
                                return True
                            g[r][c] = "."
                    return False
        return True

    solve()
    return ["".join(r) for r in g]


def _rat(m):
    n, out = len(m), []
    if not m[0][0]:
        return out

    def dfs(r, c, path, seen):
        if (r, c) == (n - 1, n - 1):
            out.append(path)
            return
        for ch, dr, dc in (("D", 1, 0), ("L", 0, -1), ("R", 0, 1), ("U", -1, 0)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and m[nr][nc] and (nr, nc) not in seen:
                seen.add((nr, nc))
                dfs(nr, nc, path + ch, seen)
                seen.discard((nr, nc))

    dfs(0, 0, "", {(0, 0)})
    return out


def _color(n, e, m):
    adj = defaultdict(set)
    for a, b in e:
        adj[a].add(b)
        adj[b].add(a)
    col = [0] * n

    def go(v):
        if v == n:
            return True
        for c in range(1, m + 1):
            if all(col[u] != c for u in adj[v]):
                col[v] = c
                if go(v + 1):
                    return True
                col[v] = 0
        return False

    return go(0)


@lru_cache(None)
def _wb2(s, d):
    if not s:
        return [""]
    out = []
    for w in d:
        if s.startswith(w):
            out += [w + (" " + rest if rest else "") for rest in _wb2(s[len(w):], d)]
    return out


def _ips(s):
    out = []
    for a, b, c in itertools.combinations(range(1, len(s)), 3):
        parts = [s[:a], s[a:b], s[b:c], s[c:]]
        if all(p and len(p) <= 3 and int(p) <= 255 and (p == "0" or p[0] != "0") for p in parts):
            out.append(".".join(parts))
    return out


def _beautiful(n):
    used = [False] * (n + 1)

    def go(i):
        if i > n:
            return 1
        total = 0
        for v in range(1, n + 1):
            if not used[v] and (v % i == 0 or i % v == 0):
                used[v] = True
                total += go(i + 1)
                used[v] = False
        return total

    return go(1)


def _add_ops(num, target):
    out = []

    def go(i, expr, val, last):
        if i == len(num):
            if val == target:
                out.append(expr)
            return
        for j in range(i + 1, len(num) + 1):
            s = num[i:j]
            if len(s) > 1 and s[0] == "0":
                break
            x = int(s)
            if i == 0:
                go(j, s, x, x)
            else:
                go(j, expr + "+" + s, val + x, x)
                go(j, expr + "-" + s, val - x, -x)
                go(j, expr + "*" + s, val - last + last * x, last * x)

    go(0, "", 0, 0)
    return out


def _k_parts(a, k):
    total = sum(a)
    if total % k:
        return False
    target, a = total // k, sorted(a, reverse=True)
    if a[0] > target:
        return False
    buckets = [0] * k

    def go(i):
        if i == len(a):
            return True
        seen = set()
        for b in range(k):
            if buckets[b] + a[i] <= target and buckets[b] not in seen:
                seen.add(buckets[b])
                buckets[b] += a[i]
                if go(i + 1):
                    return True
                buckets[b] -= a[i]
        return False

    return go(0)


def _split_desc(s):
    def go(i, prev, parts):
        if i == len(s):
            return parts >= 2
        for j in range(i + 1, len(s) + 1):
            v = int(s[i:j])
            if prev is None or v == prev - 1:
                if go(j, v, parts + 1):
                    return True
        return False

    return go(0, None, 0)


def _additive(s):
    for i in range(1, len(s)):
        for j in range(i + 1, len(s)):
            a, b = s[:i], s[i:j]
            if (len(a) > 1 and a[0] == "0") or (len(b) > 1 and b[0] == "0"):
                continue
            x, y, k, seq = int(a), int(b), j, 0
            while k < len(s):
                z = str(x + y)
                if not s.startswith(z, k):
                    break
                k, x, y, seq = k + len(z), y, x + y, seq + 1
            if k == len(s) and seq >= 1:
                return True
    return False


def _gold(g):
    R, Cc = len(g), len(g[0])

    def dfs(r, c):
        if not (0 <= r < R and 0 <= c < Cc) or not g[r][c]:
            return 0
        v, g[r][c] = g[r][c], 0
        best = v + max(dfs(r + dr, c + dc) for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        g[r][c] = v
        return best

    return max(dfs(r, c) for r in range(R) for c in range(Cc))


def _paths3(g):
    R, Cc = len(g), len(g[0])
    empty = sum(v != -1 for row in g for v in row)
    sr, sc = next((r, c) for r in range(R) for c in range(Cc) if g[r][c] == 1)

    def dfs(r, c, left):
        if not (0 <= r < R and 0 <= c < Cc) or g[r][c] == -1:
            return 0
        if g[r][c] == 2:
            return int(left == 1)
        v, g[r][c] = g[r][c], -1
        total = sum(dfs(r + dr, c + dc, left - 1) for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        g[r][c] = v
        return total

    return dfs(sr, sc, empty)


def _cookies(c, k):
    best, kids = [sum(c)], [0] * k

    def go(i):
        if i == len(c):
            best[0] = min(best[0], max(kids))
            return
        for j in range(k):
            if kids[j] + c[i] < best[0]:
                kids[j] += c[i]
                go(i + 1)
                kids[j] -= c[i]
            if kids[j] == 0:
                break

    go(0)
    return best[0]
