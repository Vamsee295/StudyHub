# Dynamic programming (Striver DP series / A2Z DP step, NeetCode 1-D and 2-D DP).
DP = "Dynamic Programming"
MOD = 10**9 + 7

Q(DP, "frog-jump", "Frog Jump", "Easy", "frogJump(heights: int[]) -> int",
  "A frog on stair 0 wants to reach the last stair, jumping 1 or 2 stairs at a time. A jump from i to j costs |heights[i] - heights[j]|. Return the minimum total cost.",
  [C([10, 20, 30, 10]), C([10, 50, 10]), C([7]), C(rl(20, 0, 100))], lambda h: _frog(h, 2),
  "dp[i] = min(dp[i-1] + |h[i]-h[i-1]|, dp[i-2] + |h[i]-h[i-2]|).")

Q(DP, "frog-jump-k", "Frog Jump with K Distances", "Medium", "frogJumpK(heights: int[], k: int) -> int",
  "Same as Frog Jump, but the frog can jump 1 to k stairs at a time. Return the minimum total cost.",
  [C([10, 30, 40, 50, 20], 3), C([10, 20, 10], 1), C([40, 10, 20, 70, 80, 10, 20, 70, 80, 60], 4), C(rl(20, 0, 100), 3)], lambda h, k: _frog(h, k),
  "dp[i] = min over j in 1..k of dp[i-j] + |h[i]-h[i-j]|.")

Q(DP, "house-robber-ii", "House Robber II", "Medium", "rob(nums: int[]) -> int",
  "Houses are in a circle, so the first and last are neighbours. You can't rob two adjacent houses. Return the most money you can rob.",
  [C([2, 3, 2]), C([1, 2, 3, 1]), C([1, 2, 3]), C([5]), C(rl(20, 0, 50))], lambda a: a[0] if len(a) == 1 else max(_rob(a[1:]), _rob(a[:-1])),
  "Run House Robber twice: without the first house and without the last.", ["Arrays"])

Q(DP, "ninja-training", "Ninja's Training", "Medium", "ninjaTraining(points: int[][]) -> int",
  "points[d] gives the merit points for 3 activities on day d. You can't do the same activity on two consecutive days. Return the maximum total points.",
  [C([[1, 2, 5], [3, 1, 1], [3, 3, 3]]), C([[10, 40, 70], [20, 50, 80], [30, 60, 90]]), C([[18, 11, 19]]), C([rl(3, 0, 50) for _ in range(8)])], lambda p: _ninja(p),
  "dp[day][last] = best total up to day when the activity done on day isn't `last`.")

Q(DP, "unique-paths-ii", "Unique Paths II", "Medium", "uniquePathsWithObstacles(obstacleGrid: int[][]) -> int",
  "Move only right or down from the top-left to the bottom-right; cells with 1 are obstacles. Return the number of paths.",
  [C([[0, 0, 0], [0, 1, 0], [0, 0, 0]]), C([[0, 1], [0, 0]]), C([[1]]), C([[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 0]])], lambda g: _paths_obs(g),
  "paths[r][c] = 0 on an obstacle, else up + left.", ["Matrix"])

Q(DP, "minimum-path-sum", "Minimum Path Sum", "Medium", "minPathSum(grid: int[][]) -> int",
  "Moving only right or down, return the minimum sum of cells on a path from the top-left to the bottom-right.",
  [C([[1, 3, 1], [1, 5, 1], [4, 2, 1]]), C([[1, 2, 3], [4, 5, 6]]), C([[7]]), C([rl(5, 0, 9) for _ in range(4)])], lambda g: _min_path(g),
  "dp[r][c] = grid[r][c] + min(up, left).", ["Matrix"])

Q(DP, "triangle", "Triangle", "Medium", "minimumTotal(triangle: int[][]) -> int",
  "From the top of the triangle, move to an adjacent number on the row below (index i or i + 1). Return the minimum path sum to the bottom.",
  [C([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]), C([[-10]]), C([[1], [2, 3]]), C([rl(i + 1, -9, 9) for i in range(6)])], lambda t: _triangle(t),
  "Bottom-up: each cell adds the smaller of its two children.", ["Arrays"])

Q(DP, "min-falling-path-sum", "Minimum Falling Path Sum", "Medium", "minFallingPathSum(matrix: int[][]) -> int",
  "A falling path starts in any cell of the first row and moves to the next row's cell directly below or diagonally left/right. Return the minimum sum of a falling path.",
  [C([[2, 1, 3], [6, 5, 4], [7, 8, 9]]), C([[-19, 57], [-40, -5]]), C([[5]]), C([rl(5, -20, 20) for _ in range(5)])], lambda m: _falling(m),
  "dp[r][c] = m[r][c] + min of the three cells above it.", ["Matrix"])

Q(DP, "subset-sum", "Subset Sum Equal to K", "Medium", "isSubsetSum(nums: int[], k: int) -> boolean",
  "nums has positive integers. Return true if some subset sums exactly to k.",
  [C([3, 34, 4, 12, 5, 2], 9), C([3, 34, 4, 12, 5, 2], 30), C([1], 1), C([2, 4, 6], 5)], lambda a, k: k in _subset_sums(a),
  "dp[s] is true if sum s is reachable; process each number from high s to low.", ["Arrays"])

Q(DP, "partition-equal-subset-sum", "Partition Equal Subset Sum", "Medium", "canPartition(nums: int[]) -> boolean",
  "Return true if nums can be split into two subsets with equal sums.",
  [C([1, 5, 11, 5]), C([1, 2, 3, 5]), C([1, 1]), C([2, 2, 3, 5]), C(rl(15, 1, 20))], lambda a: sum(a) % 2 == 0 and sum(a) // 2 in _subset_sums(a),
  "It's Subset Sum with target total / 2 (odd totals are impossible).", ["Arrays"])

Q(DP, "count-subsets-sum-k", "Count Subsets with Sum K", "Medium", "perfectSum(nums: int[], k: int) -> int",
  "nums has non-negative integers. Return how many subsets (by index) sum to k, modulo 1,000,000,007.",
  [C([5, 2, 3, 10, 6, 8], 10), C([2, 5, 1, 4, 3], 10), C([0, 0, 1], 1), C(rl(15, 0, 6), 12)], lambda a, k: _count_subsets(a, k),
  "dp[s] += dp[s - x] processed backwards; zeros double the count, so include s = 0 updates.", ["Arrays"])

Q(DP, "zero-one-knapsack", "0/1 Knapsack", "Medium", "knapsack(weights: int[], values: int[], capacity: int) -> int",
  "Each item can be taken at most once. Return the maximum total value with total weight at most capacity.",
  [C([1, 2, 3], [10, 15, 40], 6), C([4, 5, 1], [1, 2, 3], 4), C([5], [10], 4), C([3, 4, 5, 9, 4], [3, 4, 4, 10, 4], 11)], lambda w, v, c: _knap01(w, v, c),
  "dp[c] = max(dp[c], dp[c - w] + v), looping capacity downwards for each item.", ["Arrays"])

Q(DP, "coin-change-ii", "Coin Change II", "Medium", "change(amount: int, coins: int[]) -> int",
  "Return the number of combinations of coins (unlimited of each, order doesn't matter) that make up amount.",
  [C(5, [1, 2, 5]), C(3, [2]), C(10, [10]), C(0, [7]), C(100, [3, 7, 11])], lambda amt, coins: _change(amt, coins),
  "Loop coins outside and amounts inside so each combination is counted once.", ["Arrays"])

Q(DP, "unbounded-knapsack", "Unbounded Knapsack", "Medium", "unboundedKnapsack(weights: int[], values: int[], capacity: int) -> int",
  "Each item can be taken any number of times. Return the maximum total value with total weight at most capacity.",
  [C([1, 3, 4, 5], [10, 40, 50, 70], 8), C([1, 50], [1, 30], 100), C([6], [7], 5), C([2, 3], [3, 5], 7)], lambda w, v, c: _knap_unb(w, v, c),
  "dp[c] = max over items of dp[c - w] + v, looping capacity upwards.", ["Arrays"])

Q(DP, "rod-cutting", "Rod Cutting", "Medium", "cutRod(price: int[]) -> int",
  "price[i] is the price of a piece of length i + 1. The rod's length is price.length. Cut it into pieces to maximise the total price and return that maximum.",
  [C([1, 5, 8, 9, 10, 17, 17, 20]), C([3, 5, 8, 9, 10, 17, 17, 20]), C([5]), C([2, 5, 7, 8])], lambda p: _knap_unb(list(range(1, len(p) + 1)), p, len(p)),
  "Unbounded knapsack where lengths are weights.", ["Arrays"])

Q(DP, "edit-distance", "Edit Distance", "Medium", "minDistance(word1: String, word2: String) -> int",
  "Return the minimum number of single-character insertions, deletions or replacements to turn word1 into word2.",
  [C("horse", "ros"), C("intention", "execution"), C("", "abc"), C("same", "same"), C("kitten", "sitting")], lambda a, b: _edit(a, b),
  "dp[i][j] = dp[i-1][j-1] if characters match, else 1 + min(insert, delete, replace).", ["Strings"])

Q(DP, "longest-palindromic-subsequence", "Longest Palindromic Subsequence", "Medium", "longestPalindromeSubseq(s: String) -> int",
  "Return the length of the longest subsequence of s that is a palindrome.",
  [C("bbbab"), C("cbbd"), C("a"), C("agbdba"), C(rs(30, "abcd"))], lambda s: _lcs_len(s, s[::-1]), "It's the LCS of s and its reverse.", ["Strings"])

Q(DP, "min-insertions-palindrome", "Minimum Insertion Steps to Make a String Palindrome", "Hard", "minInsertions(s: String) -> int",
  "Return the minimum number of characters to insert anywhere in s to make it a palindrome.",
  [C("zzazz"), C("mbadm"), C("leetcode"), C("a"), C(rs(25, "abc"))], lambda s: len(s) - _lcs_len(s, s[::-1]), "n - (longest palindromic subsequence).", ["Strings"])

Q(DP, "distinct-subsequences", "Distinct Subsequences", "Hard", "numDistinct(s: String, t: String) -> int",
  "Return how many distinct subsequences of s equal t. (The answer fits in a 32-bit integer.)",
  [C("rabbbit", "rabbit"), C("babgbag", "bag"), C("abc", ""), C("a", "b"), C("aaaaa", "aa")], lambda s, t: _distinct(s, t),
  "dp[i][j] = dp[i-1][j] + (s[i-1] == t[j-1] ? dp[i-1][j-1] : 0).", ["Strings"])

Q(DP, "wildcard-matching", "Wildcard Matching", "Hard", "isMatch(s: String, p: String) -> boolean",
  "'?' matches any one character and '*' matches any sequence (including empty). Return true if p matches all of s.",
  [C("aa", "a"), C("aa", "*"), C("cb", "?a"), C("adceb", "*a*b"), C("acdcb", "a*c?b")], lambda s, p: re.fullmatch(re.escape(p).replace(r"\*", ".*").replace(r"\?", "."), s, re.S) is not None,
  "dp[i][j]: '*' either matches nothing (dp[i][j-1]) or one more character (dp[i-1][j]).", ["Strings", "Greedy"])

Q(DP, "word-break", "Word Break", "Medium", "wordBreak(s: String, wordDict: String[]) -> boolean",
  "Return true if s can be split into a sequence of dictionary words (words may be reused).",
  [C("leetcode", ["leet", "code"]), C("applepenapple", ["apple", "pen"]), C("catsandog", ["cats", "dog", "sand", "and", "cat"]), C("aaaaaaab", ["a", "aa", "aaa"])], lambda s, d: _wb(s, d),
  "dp[i] is true if some word ends at i and dp[i - len(word)] is true.", ["Strings", "Hash Set"])

Q(DP, "decode-ways", "Decode Ways", "Medium", "numDecodings(s: String) -> int",
  "Letters A-Z are encoded as 1-26. Return how many ways the digit string s can be decoded (\"06\" isn't a valid code).",
  [C("12"), C("226"), C("06"), C("11106"), C("1111111111")], lambda s: _decode_ways(s), "dp[i] adds dp[i-1] for a valid single digit and dp[i-2] for a valid pair 10-26.", ["Strings"])

Q(DP, "stock-cooldown", "Best Time to Buy and Sell Stock with Cooldown", "Medium", "maxProfit(prices: int[]) -> int",
  "Buy and sell as many times as you like, holding at most one share; after selling you must wait one day before buying again. Return the maximum profit.",
  [C([1, 2, 3, 0, 2]), C([1]), C([6, 1, 3, 2, 4, 7]), C(rl(20, 1, 30))], lambda p: _cooldown(p), "Three states per day: holding, just sold (cooldown), resting.", ["Arrays"])

Q(DP, "target-sum", "Target Sum", "Medium", "findTargetSumWays(nums: int[], target: int) -> int",
  "Put '+' or '-' before every number of nums. Return how many expressions evaluate to target.",
  [C([1, 1, 1, 1, 1], 3), C([1], 1), C([1, 0], 1), C(rl(12, 0, 6), 4)], lambda a, t: _target_sum(a, t),
  "Equivalent to counting subsets with sum (total + target) / 2.", ["Backtracking"])

Q(DP, "matrix-chain", "Matrix Chain Multiplication", "Hard", "matrixMultiplication(arr: int[]) -> int",
  "Matrix i has dimensions arr[i-1] x arr[i]. Return the minimum number of scalar multiplications to multiply the whole chain.",
  [C([2, 1, 3, 4]), C([1, 2, 3, 4, 3]), C([3, 4]), C([10, 30, 5, 60])], lambda a: _mcm(a),
  "dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + arr[i-1] * arr[k] * arr[j].", ["Arrays"])

Q(DP, "best-time-stock-iii", "Best Time to Buy and Sell Stock III", "Hard", "maxProfit(prices: int[]) -> int",
  "You may complete at most two transactions (buy then sell; no overlapping). Return the maximum profit.",
  [C([3, 3, 5, 0, 0, 3, 1, 4]), C([1, 2, 3, 4, 5]), C([7, 6, 4, 3, 1]), C(rl(20, 1, 50))], lambda p: _stock_k(p, 2),
  "Track the best balance after buy1, sell1, buy2 and sell2 day by day.", ["Arrays"])


def _frog(h, k):
    dp = [0] + [float("inf")] * (len(h) - 1)
    for i in range(1, len(h)):
        dp[i] = min(dp[i - j] + abs(h[i] - h[i - j]) for j in range(1, min(k, i) + 1))
    return dp[-1]


def _rob(a):
    x = y = 0
    for v in a:
        x, y = y, max(y, x + v)
    return y


def _ninja(p):
    prev = [0, 0, 0]
    for row in p:
        prev = [row[a] + max(prev[b] for b in range(3) if b != a) for a in range(3)]
    return max(prev)


def _paths_obs(g):
    R, Cc = len(g), len(g[0])
    dp = [[0] * Cc for _ in range(R)]
    for r in range(R):
        for c in range(Cc):
            if g[r][c]:
                continue
            dp[r][c] = 1 if r == c == 0 else (dp[r - 1][c] if r else 0) + (dp[r][c - 1] if c else 0)
    return dp[-1][-1]


def _min_path(g):
    R, Cc = len(g), len(g[0])
    dp = [[0] * Cc for _ in range(R)]
    for r in range(R):
        for c in range(Cc):
            prev = [x for x in ((dp[r - 1][c] if r else None), (dp[r][c - 1] if c else None)) if x is not None]
            dp[r][c] = g[r][c] + (min(prev) if prev else 0)
    return dp[-1][-1]


def _triangle(t):
    row = t[-1][:]
    for r in range(len(t) - 2, -1, -1):
        row = [t[r][i] + min(row[i], row[i + 1]) for i in range(len(t[r]))]
    return row[0]


def _falling(m):
    prev = m[0][:]
    for r in range(1, len(m)):
        prev = [m[r][c] + min(prev[max(0, c - 1):c + 2]) for c in range(len(m[0]))]
    return min(prev)


def _subset_sums(a):
    s = {0}
    for x in a:
        s |= {y + x for y in s}
    return s


def _count_subsets(a, k):
    dp = [1] + [0] * k
    for x in a:
        for s in range(k, x - 1, -1):
            dp[s] = (dp[s] + dp[s - x]) % MOD
    return dp[k]


def _knap01(w, v, c):
    dp = [0] * (c + 1)
    for wi, vi in zip(w, v):
        for cap in range(c, wi - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - wi] + vi)
    return dp[c]


def _change(amt, coins):
    dp = [1] + [0] * amt
    for c in coins:
        for a in range(c, amt + 1):
            dp[a] += dp[a - c]
    return dp[amt]


def _knap_unb(w, v, c):
    dp = [0] * (c + 1)
    for cap in range(1, c + 1):
        dp[cap] = max([dp[cap - wi] + vi for wi, vi in zip(w, v) if wi <= cap] + [0])
    return dp[c]


def _edit(a, b):
    dp = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        prev, dp[0] = dp[0], i
        for j in range(1, len(b) + 1):
            cur = dp[j]
            dp[j] = prev if a[i - 1] == b[j - 1] else 1 + min(prev, dp[j], dp[j - 1])
            prev = cur
    return dp[-1]


def _lcs_len(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            dp[i][j] = dp[i - 1][j - 1] + 1 if a[i - 1] == b[j - 1] else max(dp[i - 1][j], dp[i][j - 1])
    return dp[-1][-1]


def _distinct(s, t):
    dp = [1] + [0] * len(t)
    for ch in s:
        for j in range(len(t), 0, -1):
            if t[j - 1] == ch:
                dp[j] += dp[j - 1]
    return dp[-1]


def _wb(s, d):
    ws, dp = set(d), [True] + [False] * len(s)
    for i in range(1, len(s) + 1):
        dp[i] = any(dp[i - len(w)] and s[i - len(w):i] == w for w in ws if len(w) <= i)
    return dp[-1]


def _decode_ways(s):
    a, b = 1, 0  # ways up to i, ways up to i - 1
    prev = ""
    for ch in s:
        cur = (a if ch != "0" else 0) + (b if prev and 10 <= int(prev + ch) <= 26 else 0)
        a, b, prev = cur, a, ch
    return a


def _cooldown(p):
    hold, sold, rest = -10**9, 0, 0
    for x in p:
        hold, sold, rest = max(hold, rest - x), hold + x, max(rest, sold)
    return max(sold, rest)


def _target_sum(a, t):
    total = sum(a)
    if (total + t) % 2 or abs(t) > total:
        return 0
    k = (total + t) // 2
    dp = [1] + [0] * k
    for x in a:
        for s in range(k, x - 1, -1):
            dp[s] += dp[s - x]
    return dp[k]


def _mcm(a):
    n = len(a)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):
        for i in range(1, n - length + 1):
            j = i + length - 1
            dp[i][j] = min(dp[i][k] + dp[k + 1][j] + a[i - 1] * a[k] * a[j] for k in range(i, j))
    return dp[1][n - 1] if n > 2 else 0


def _stock_k(p, k):
    buy, sell = [-10**9] * (k + 1), [0] * (k + 1)
    for x in p:
        for t in range(1, k + 1):
            buy[t] = max(buy[t], sell[t - 1] - x)
            sell[t] = max(sell[t], buy[t] + x)
    return sell[k]
