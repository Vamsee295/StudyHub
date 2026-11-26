# Stacks, queues and monotonic stacks (Striver A2Z stack & queue step, NeetCode stack).
SQ = "Stack & Queue"

Q(SQ, "next-greater-element-i", "Next Greater Element I", "Easy", "nextGreaterElement(nums1: int[], nums2: int[]) -> int[]",
  "nums1 is a subset of nums2 (distinct values). For each x in nums1, find the first value greater than x to its right in nums2, or -1.",
  [C([4, 1, 2], [1, 3, 4, 2]), C([2, 4], [1, 2, 3, 4]), C([1], [1]), C([3, 5], [6, 5, 4, 3, 2, 1, 7])],
  lambda a, b: [next((y for y in b[b.index(x) + 1:] if y > x), -1) for x in a], "Monotonic stack over nums2 fills a map value -> next greater.", ["Monotonic Stack", "Hash Map"])

Q(SQ, "next-greater-element-ii", "Next Greater Element II", "Medium", "nextGreaterElements(nums: int[]) -> int[]",
  "nums is circular. For each element, return the first greater value found by moving forward (wrapping around), or -1.",
  [C([1, 2, 1]), C([1, 2, 3, 4, 3]), C([5]), C([3, 3, 3]), C(rl(20, 0, 15))],
  lambda a: [next((a[(i + d) % len(a)] for d in range(1, len(a)) if a[(i + d) % len(a)] > a[i]), -1) for i in range(len(a))],
  "Loop twice over the indices (i % n) with a stack of unresolved indices.", ["Monotonic Stack"])

Q(SQ, "previous-smaller-element", "Previous Smaller Element", "Easy", "prevSmaller(nums: int[]) -> int[]",
  "For each element, return the nearest value to its left that is strictly smaller, or -1.",
  [C([4, 5, 2, 10, 8]), C([3, 2, 1]), C([1, 2, 3]), C(rl(15, 0, 20))],
  lambda a: [next((a[j] for j in range(i - 1, -1, -1) if a[j] < a[i]), -1) for i in range(len(a))], "Keep an increasing stack; pop values >= the current one.", ["Monotonic Stack"])

Q(SQ, "stock-span", "Online Stock Span", "Medium", "stockSpan(prices: int[]) -> int[]",
  "The span of today's price is how many consecutive days, ending today, the price was <= today's price. Return the span for every day.",
  [C([100, 80, 60, 70, 60, 75, 85]), C([10, 4, 5, 90, 120, 80]), C([5]), C(rl(15, 1, 50))],
  lambda p: [next((i - j for j in range(i - 1, -1, -1) if p[j] > p[i]), i + 1) for i in range(len(p))], "Stack of (price, span) pairs; merge spans of smaller prices.", ["Monotonic Stack"])

Q(SQ, "largest-rectangle-histogram", "Largest Rectangle in Histogram", "Hard", "largestRectangleArea(heights: int[]) -> int",
  "heights are bars of width 1. Return the area of the largest rectangle inside the histogram.",
  [C([2, 1, 5, 6, 2, 3]), C([2, 4]), C([1]), C([6, 2, 5, 4, 5, 1, 6]), C(rl(20, 0, 15))],
  lambda h: max(min(h[i:j]) * (j - i) for i in range(len(h)) for j in range(i + 1, len(h) + 1)),
  "For each bar, the widest rectangle of its height spans to the previous and next smaller bars.", ["Monotonic Stack", "Arrays"])

Q(SQ, "maximal-rectangle", "Maximal Rectangle", "Hard", "maximalRectangle(matrix: int[][]) -> int",
  "matrix holds 0s and 1s. Return the area of the largest rectangle containing only 1s.",
  [C([[1, 0, 1, 0, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1], [1, 0, 0, 1, 0]]), C([[0]]), C([[1]]), C([[rng.randint(0, 1) for _ in range(6)] for _ in range(5)])],
  lambda m: _max_rect(m), "Row by row, build histogram heights and reuse Largest Rectangle in Histogram.", ["Monotonic Stack", "Matrix", "Dynamic Programming"])

Q(SQ, "asteroid-collision", "Asteroid Collision", "Medium", "asteroidCollision(asteroids: int[]) -> int[]",
  "Positive asteroids move right, negative move left, all at the same speed. When two meet, the smaller one explodes (both if equal). Return the asteroids left after all collisions.",
  [C([5, 10, -5]), C([8, -8]), C([10, 2, -5]), C([-2, -1, 1, 2]), C([1, -2, -2, -2])], lambda a: _asteroids(a),
  "Stack: a left-moving asteroid fights right-moving ones on top of the stack.", ["Stack", "Simulation"])

Q(SQ, "remove-k-digits", "Remove K Digits", "Medium", "removeKdigits(num: String, k: int) -> String",
  "Remove k digits from the number string num to make the smallest possible number. Return it without leading zeros (\"0\" if empty).",
  [C("1432219", 3), C("10200", 1), C("10", 2), C("112", 1), C("9876543210", 5)], lambda n, k: _remove_k(n, k),
  "Greedy with an increasing stack: pop a larger previous digit while you still have removals.", ["Monotonic Stack", "Greedy"])

Q(SQ, "sum-subarray-minimums", "Sum of Subarray Minimums", "Medium", "sumSubarrayMins(arr: int[]) -> int",
  "Return the sum of min(b) over every contiguous subarray b of arr, modulo 1,000,000,007.",
  [C([3, 1, 2, 4]), C([11, 81, 94, 43, 3]), C([5]), C(rl(30, 1, 100))],
  lambda a: sum(min(a[i:j]) for i in range(len(a)) for j in range(i + 1, len(a) + 1)) % (10**9 + 7),
  "Each a[i] is the minimum of (i - prevLess) * (nextLessOrEqual - i) subarrays.", ["Monotonic Stack"])

Q(SQ, "sum-subarray-ranges", "Sum of Subarray Ranges", "Medium", "subArrayRanges(nums: int[]) -> int",
  "The range of a subarray is its max minus its min. Return the sum of ranges of all subarrays.",
  [C([1, 2, 3]), C([1, 3, 3]), C([4, -2, -3, 4, 1]), C(rl(20, -20, 20))],
  lambda a: sum(max(a[i:j]) - min(a[i:j]) for i in range(len(a)) for j in range(i + 1, len(a) + 1)),
  "(sum of subarray maximums) - (sum of subarray minimums), each with monotonic stacks.", ["Monotonic Stack"])

Q(SQ, "simplify-path", "Simplify Path", "Medium", "simplifyPath(path: String) -> String",
  "Convert an absolute Unix path to its canonical form: single slashes, no trailing slash, '.' removed and '..' going up one directory (never above root).",
  [C("/home/"), C("/home//foo/"), C("/home/user/Documents/../Pictures"), C("/../"), C("/.../a/../b/c/../d/./")], lambda p: _simplify(p),
  "Split on '/', push names, pop on '..', ignore '' and '.'.", ["Stack", "Strings"])

Q(SQ, "basic-calculator-ii", "Basic Calculator II", "Medium", "calculate(s: String) -> int",
  "Evaluate s containing non-negative integers, +, -, *, / and spaces. Division truncates toward zero. No parentheses.",
  [C("3+2*2"), C(" 3/2 "), C(" 3+5 / 2 "), C("14-3/2"), C("1*2-3/4+5*6-7*8+9/10")], lambda s: _calc(s),
  "Push numbers on a stack; apply * and / immediately to the top, push negatives for -. Sum the stack.", ["Stack", "Math"])

Q(SQ, "min-add-valid-parentheses", "Minimum Add to Make Parentheses Valid", "Easy", "minAddToMakeValid(s: String) -> int",
  "Return the minimum number of '(' or ')' insertions needed to make s a valid parentheses string.",
  [C("())"), C("((("), C("()"), C("()))(("), C(rs(30, "()"))], lambda s: _min_add(s), "Track open count; an unmatched ')' needs an insertion. Add the leftover opens.", ["Stack", "Greedy"])

Q(SQ, "score-of-parentheses", "Score of Parentheses", "Medium", "scoreOfParentheses(s: String) -> int",
  "s is balanced. \"()\" scores 1, AB scores A + B, and (A) scores 2 * A. Return the score of s.",
  [C("()"), C("(())"), C("()()"), C("(()(()))"), C("((()()))")], lambda s: _score(s), "Each \"()\" at depth d contributes 2^d.", ["Stack"])

Q(SQ, "longest-valid-parentheses", "Longest Valid Parentheses", "Hard", "longestValidParentheses(s: String) -> int",
  "Return the length of the longest valid (well-formed) parentheses substring of s.",
  [C("(()"), C(")()())"), C(""), C("()(()"), C(rs(40, "()"))], lambda s: _lvp(s), "Stack of indices with a base marker; the length is i - stack top after a match.", ["Stack", "Dynamic Programming"])

Q(SQ, "make-string-great", "Make The String Great", "Easy", "makeGood(s: String) -> String",
  "Repeatedly remove two adjacent characters that are the same letter in different cases (like 'a' and 'A'). Return the final string.",
  [C("leEeetcode"), C("abBAcC"), C("s"), C("Pp"), C("mC")], lambda s: reduce(lambda st, c: st[:-1] if st and st[-1] != c and st[-1].lower() == c.lower() else st + c, s, ""),
  "Stack: pop when the top is the same letter with the opposite case.", ["Stack", "Strings"])

Q(SQ, "remove-duplicate-letters", "Remove Duplicate Letters", "Medium", "removeDuplicateLetters(s: String) -> String",
  "Remove duplicate letters so every letter appears once, and the result is the smallest in lexicographic order among all such results.",
  [C("bcabc"), C("cbacdcbc"), C("a"), C("abacb"), C("leetcode")], lambda s: _rdl(s),
  "Greedy stack: pop a larger letter if it appears again later; skip letters already in the stack.", ["Monotonic Stack", "Greedy"])

Q(SQ, "validate-stack-sequences", "Validate Stack Sequences", "Medium", "validateStackSequences(pushed: int[], popped: int[]) -> boolean",
  "pushed and popped are permutations of distinct values. Return true if they could be the result of push and pop operations on an initially empty stack.",
  [C([1, 2, 3, 4, 5], [4, 5, 3, 2, 1]), C([1, 2, 3, 4, 5], [4, 3, 5, 1, 2]), C([1], [1]), C([2, 1, 0], [1, 2, 0])], lambda a, b: _valid_seq(a, b),
  "Simulate: push each value, then pop while the top matches the next value to pop.", ["Stack", "Simulation"])

Q(SQ, "time-to-buy-tickets", "Time Needed to Buy Tickets", "Easy", "timeRequiredToBuy(tickets: int[], k: int) -> int",
  "People queue to buy tickets; tickets[i] is how many person i wants. Each second the front person buys one ticket and, if they need more, goes to the back. Return the seconds until person k finishes.",
  [C([2, 3, 2], 2), C([5, 1, 1, 1], 0), C([1], 0), C([4, 2, 6, 3], 1)], lambda t, k: sum(min(x, t[k] if i <= k else t[k] - 1) for i, x in enumerate(t)),
  "Simulate with a queue, or note person i before k buys min(t[i], t[k]) and after k buys min(t[i], t[k] - 1).", ["Queue", "Simulation"])

Q(SQ, "dota2-senate", "Dota2 Senate", "Medium", "predictPartyVictory(senate: String) -> String",
  "Senators from Radiant ('R') and Dire ('D') vote in order; each can ban one opposing senator. Banned senators lose all rights. Rounds repeat until one party remains. Return \"Radiant\" or \"Dire\".",
  [C("RD"), C("RDD"), C("DDRRR"), C("RRDDD"), C("DRRDRDRDRDDRDRDR")], lambda s: _senate(s),
  "Two queues of indices; the smaller index bans the other and re-enters with index + n.", ["Queue", "Greedy"])

Q(SQ, "reveal-cards-increasing", "Reveal Cards in Increasing Order", "Medium", "deckRevealedIncreasing(deck: int[]) -> int[]",
  "Cards (distinct values) are revealed by: take the top card, then move the next top card to the bottom, repeating. Return an ordering of deck so the cards are revealed in increasing order.",
  [C([17, 13, 11, 2, 3, 5, 7]), C([1, 1000]), C([5]), C([4, 1, 3, 2])], lambda d: _reveal(d),
  "Simulate the reveal on a queue of positions 0..n-1 and drop sorted cards into them.", ["Queue", "Simulation", "Sorting"])

Q(SQ, "students-unable-to-eat", "Number of Students Unable to Eat Lunch", "Easy", "countStudents(students: int[], sandwiches: int[]) -> int",
  "Students (0 or 1, their preferred sandwich) queue; sandwiches form a stack (index 0 on top). The front student takes the top sandwich if it matches, otherwise goes to the back. Return how many students can't eat.",
  [C([1, 1, 0, 0], [0, 1, 0, 1]), C([1, 1, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1]), C([0], [1]), C([0, 1], [1, 0])], lambda st, sw: _lunch(st, sw),
  "Order doesn't matter for students: count preferences, and stop at the first sandwich nobody left wants.", ["Queue", "Simulation"])

Q(SQ, "132-pattern", "132 Pattern", "Medium", "find132pattern(nums: int[]) -> boolean",
  "Return true if there are i < j < k with nums[i] < nums[k] < nums[j].",
  [C([1, 2, 3, 4]), C([3, 1, 4, 2]), C([-1, 3, 2, 0]), C([1, 0, 1, -4, -3]), C(rl(15, -10, 10))],
  lambda a: any(a[i] < a[k] < a[j] for i in range(len(a)) for j in range(i + 1, len(a)) for k in range(j + 1, len(a))),
  "Scan from the right with a decreasing stack; track the best \"2\" popped so far.", ["Monotonic Stack"])

Q(SQ, "crawler-log-folder", "Crawler Log Folder", "Easy", "minOperations(logs: String[]) -> int",
  "A file system starts at the main folder. \"../\" moves to the parent (stays at main if already there), \"./\" stays, \"x/\" moves into child x. Return how many steps it takes to get back to main afterwards.",
  [C(["d1/", "d2/", "../", "d21/", "./"]), C(["d1/", "d2/", "./", "d3/", "../", "d31/"]), C(["d1/", "../", "../", "../"]), C(["./"])],
  lambda logs: reduce(lambda d, l: max(0, d - 1) if l == "../" else d if l == "./" else d + 1, logs, 0), "Only the depth matters: it's a stack's size.", ["Stack", "Strings"])


def _max_rect(m):
    best, h = 0, [0] * len(m[0])
    for row in m:
        h = [h[c] + 1 if row[c] else 0 for c in range(len(row))]
        best = max(best, max((min(h[i:j]) * (j - i) for i in range(len(h)) for j in range(i + 1, len(h) + 1)), default=0))
    return best


def _asteroids(a):
    st = []
    for x in a:
        alive = True
        while alive and x < 0 and st and st[-1] > 0:
            if st[-1] < -x:
                st.pop()
            elif st[-1] == -x:
                st.pop()
                alive = False
            else:
                alive = False
        if alive:
            st.append(x)
    return st


def _remove_k(n, k):
    st = []
    for d in n:
        while k and st and st[-1] > d:
            st.pop()
            k -= 1
        st.append(d)
    st = st[: len(st) - k] if k else st
    return "".join(st).lstrip("0") or "0"


def _simplify(p):
    st = []
    for part in p.split("/"):
        if part == "..":
            if st:
                st.pop()
        elif part and part != ".":
            st.append(part)
    return "/" + "/".join(st)


def _calc(s):
    st, num, op = [], 0, "+"
    s = s.replace(" ", "") + "+"
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
            continue
        if op == "+":
            st.append(num)
        elif op == "-":
            st.append(-num)
        elif op == "*":
            st.append(st.pop() * num)
        else:
            st.append(int(st.pop() / num))
        op, num = ch, 0
    return sum(st)


def _min_add(s):
    open_, add = 0, 0
    for c in s:
        if c == "(":
            open_ += 1
        elif open_:
            open_ -= 1
        else:
            add += 1
    return add + open_


def _score(s):
    st = [0]
    for c in s:
        if c == "(":
            st.append(0)
        else:
            v = st.pop()
            st[-1] += max(2 * v, 1)
    return st[0]


def _lvp(s):
    st, best = [-1], 0
    for i, c in enumerate(s):
        if c == "(":
            st.append(i)
        else:
            st.pop()
            if not st:
                st.append(i)
            else:
                best = max(best, i - st[-1])
    return best


def _rdl(s):
    last = {c: i for i, c in enumerate(s)}
    st, seen = [], set()
    for i, c in enumerate(s):
        if c in seen:
            continue
        while st and st[-1] > c and last[st[-1]] > i:
            seen.discard(st.pop())
        st.append(c)
        seen.add(c)
    return "".join(st)


def _valid_seq(a, b):
    st, j = [], 0
    for x in a:
        st.append(x)
        while st and st[-1] == b[j]:
            st.pop()
            j += 1
    return not st


def _senate(s):
    n = len(s)
    r = deque(i for i, c in enumerate(s) if c == "R")
    d = deque(i for i, c in enumerate(s) if c == "D")
    while r and d:
        a, b = r.popleft(), d.popleft()
        if a < b:
            r.append(a + n)
        else:
            d.append(b + n)
    return "Radiant" if r else "Dire"


def _reveal(deck):
    idx, out = deque(range(len(deck))), [0] * len(deck)
    for card in sorted(deck):
        out[idx.popleft()] = card
        if idx:
            idx.append(idx.popleft())
    return out


def _lunch(st, sw):
    cnt = Counter(st)
    for i, s in enumerate(sw):
        if cnt[s] == 0:
            return len(sw) - i
        cnt[s] -= 1
    return 0
