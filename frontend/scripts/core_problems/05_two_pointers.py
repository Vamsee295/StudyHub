# Two pointers (NeetCode two pointers, Striver, LeetCode classics).
TP = "Two Pointers"

Q(TP, "remove-element", "Remove Element", "Easy", "removeElement(nums: int[], val: int) -> int[]",
  "Remove every occurrence of val from nums in place and return the remaining elements in their original order.",
  [C([3, 2, 2, 3], 3), C([0, 1, 2, 2, 3, 0, 4, 2], 2), C([1], 1), C(rl(15, 0, 4), 2)], lambda a, v: [x for x in a if x != v],
  "A write pointer copies each element that isn't val forward.", ["Arrays"])

Q(TP, "remove-duplicates-ii", "Remove Duplicates from Sorted Array II", "Medium", "removeDuplicates(nums: int[]) -> int[]",
  "nums is sorted. Remove duplicates in place so each value appears at most twice, and return the result.",
  [C([1, 1, 1, 2, 2, 3]), C([0, 0, 1, 1, 1, 1, 2, 3, 3]), C([1]), C(sorted(rl(20, 0, 5)))],
  lambda a: [x for i, x in enumerate(a) if i < 2 or not (a[i - 1] == x and a[i - 2] == x)],
  "Keep nums[i] when it differs from the element two places back in the written part.", ["Arrays"])

Q(TP, "three-sum-closest", "3Sum Closest", "Medium", "threeSumClosest(nums: int[], target: int) -> int",
  "Return the sum of three numbers in nums (distinct indices) that is closest to target. Exactly one closest sum exists.",
  [C([-1, 2, 1, -4], 1), C([0, 0, 0], 1), C([1, 1, 1, 0], -100), C([4, 0, 5, -5, 3, 3, 0, -4, -5], -2)],
  lambda a, t: min((sum(c) for c in itertools.combinations(a, 3)), key=lambda s: abs(s - t)),
  "Sort; fix i and move left/right pointers toward the target, tracking the closest sum.", ["Sorting", "Arrays"])

Q(TP, "valid-palindrome-ii", "Valid Palindrome II", "Easy", "validPalindrome(s: String) -> boolean",
  "Return true if s can become a palindrome by deleting at most one character.",
  [C("aba"), C("abca"), C("abc"), C("deeee"), C("cbbcc")], lambda s: any((t := s[:i] + s[i + 1:]) == t[::-1] for i in range(len(s))) or s == s[::-1],
  "Two pointers; at the first mismatch, try skipping either side once.", ["Strings", "Greedy"])

Q(TP, "trapping-rain-water", "Trapping Rain Water", "Hard", "trap(height: int[]) -> int",
  "height[i] is the height of a bar of width 1. Return how much rain water is trapped between the bars.",
  [C([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), C([4, 2, 0, 3, 2, 5]), C([1]), C([5, 4, 3]), C(rl(30, 0, 9))],
  lambda h: sum(max(0, min(max(h[:i + 1]), max(h[i:])) - h[i]) for i in range(len(h))),
  "Water at i = min(max left, max right) - height[i]. Two pointers move the side with the smaller max.", ["Arrays", "Stack", "Dynamic Programming"])

Q(TP, "boats-to-save-people", "Boats to Save People", "Medium", "numRescueBoats(people: int[], limit: int) -> int",
  "Each boat carries at most two people with total weight at most limit. Return the minimum number of boats to carry everyone (every person weighs at most limit).",
  [C([1, 2], 3), C([3, 2, 2, 1], 3), C([3, 5, 3, 4], 5), C(rl(20, 1, 10), 10)], lambda p, lim: _boats(p, lim),
  "Sort; pair the heaviest with the lightest whenever they fit.", ["Greedy", "Sorting"])

Q(TP, "sort-array-by-parity", "Sort Array by Parity", "Easy", "sortArrayByParity(nums: int[]) -> int[]",
  "Return nums with all even numbers first and all odd numbers after, keeping the original order within each group.",
  [C([3, 1, 2, 4]), C([0]), C([1, 3, 5, 2]), C(rl(15, 0, 20))], lambda a: [x for x in a if x % 2 == 0] + [x for x in a if x % 2],
  "Two passes with a write pointer, or a result array filled from both groups.", ["Arrays"])

Q(TP, "reverse-words-iii", "Reverse Words in a String III", "Easy", "reverseWords(s: String) -> String",
  "s is words separated by single spaces. Reverse the characters of each word while keeping word order.",
  [C("Let's take LeetCode contest"), C("Mr Ding"), C("a"), C("hello world")], lambda s: " ".join(w[::-1] for w in s.split(" ")),
  "For each word, swap characters from both ends inward.", ["Strings"])

Q(TP, "backspace-string-compare", "Backspace String Compare", "Easy", "backspaceCompare(s: String, t: String) -> boolean",
  "In s and t, '#' is a backspace. Return true if both strings are equal after applying the backspaces. Try O(1) extra space.",
  [C("ab#c", "ad#c"), C("ab##", "c#d#"), C("a#c", "b"), C("a##c", "#a#c"), C("xywrrmp", "xywrrmu#p")], lambda s, t: _bs(s) == _bs(t),
  "Walk both strings from the end, skipping characters that a '#' deletes.", ["Strings", "Stack"])

Q(TP, "min-difference-k-scores", "Minimum Difference Between Highest and Lowest of K Scores", "Easy", "minimumDifference(nums: int[], k: int) -> int",
  "Pick k scores from nums so that the difference between the highest and lowest picked score is as small as possible. Return that difference.",
  [C([90], 1), C([9, 4, 1, 7], 2), C([87063, 61094, 44530, 21297, 95857, 93551, 9918], 6), C(rl(20, 0, 100), 4)],
  lambda a, k: min(b - x for x, b in zip(sorted(a), sorted(a)[k - 1:])), "Sort; the best window is k consecutive values.", ["Sorting", "Sliding Window"])

Q(TP, "duplicate-zeros", "Duplicate Zeros", "Easy", "duplicateZeros(arr: int[]) -> int[]",
  "Duplicate each zero in arr, shifting the remaining elements right. Elements pushed past the original length are dropped. Return the array (same length).",
  [C([1, 0, 2, 3, 0, 4, 5, 0]), C([1, 2, 3]), C([0, 0, 0]), C([8, 4, 5, 0, 0, 0, 0, 7])],
  lambda a: [y for x in a for y in ([0, 0] if x == 0 else [x])][: len(a)], "Count how many zeros fit, then fill from the back with two pointers.", ["Arrays"])

Q(TP, "k-diff-pairs", "K-diff Pairs in an Array", "Medium", "findPairs(nums: int[], k: int) -> int",
  "Return the number of unique pairs of values (a, b) in nums with b - a == k (pairs from different indices).",
  [C([3, 1, 4, 1, 5], 2), C([1, 2, 3, 4, 5], 1), C([1, 3, 1, 5, 4], 0), C(rl(25, 0, 10), 3)],
  lambda a, k: sum(1 for v, c in Counter(a).items() if (c > 1 if k == 0 else v + k in Counter(a))),
  "Sort and use two pointers, or count values in a map (k == 0 needs a value seen twice).", ["Hash Map", "Sorting"])

Q(TP, "max-k-sum-pairs", "Max Number of K-Sum Pairs", "Medium", "maxOperations(nums: int[], k: int) -> int",
  "In one operation, remove two numbers that add up to k. Return the maximum number of operations.",
  [C([1, 2, 3, 4], 5), C([3, 1, 3, 4, 3], 6), C([2, 2, 2, 2], 4), C(rl(25, 1, 9), 10)], lambda a, k: _ksum(a, k),
  "Sort and close in with two pointers, removing a pair when the sum hits k.", ["Hash Map", "Sorting"])

Q(TP, "long-pressed-name", "Long Pressed Name", "Easy", "isLongPressedName(name: String, typed: String) -> boolean",
  "Some keys may have been held down while typing name, repeating a character. Return true if typed could be name typed with long presses.",
  [C("alex", "aaleex"), C("saeed", "ssaaedd"), C("leelee", "lleeelee"), C("a", "b"), C("alex", "alexxr")],
  lambda n, t: re.fullmatch("".join(re.escape(ch) + "{%d,}" % len(list(g)) for ch, g in itertools.groupby(n)), t) is not None
  and [k for k, _ in itertools.groupby(n)] == [k for k, _ in itertools.groupby(t)],
  "Walk both strings; extra characters in typed must repeat the previous typed character.", ["Strings"])

Q(TP, "merge-strings-alternately", "Merge Strings Alternately", "Easy", "mergeAlternately(word1: String, word2: String) -> String",
  "Merge two strings by alternating characters, starting with word1. Append the rest of the longer string at the end.",
  [C("abc", "pqr"), C("ab", "pqrs"), C("abcd", "pq"), C("x", "")], lambda a, b: "".join(x + y for x, y in itertools.zip_longest(a, b, fillvalue="")),
  "One index into each word; take from each while it has characters.", ["Strings"])

Q(TP, "shortest-distance-to-char", "Shortest Distance to a Character", "Easy", "shortestToChar(s: String, c: String) -> int[]",
  "c is a single character that occurs in s. Return an array where answer[i] is the distance from i to the nearest occurrence of c.",
  [C("loveleetcode", "e"), C("aaab", "b"), C("a", "a"), C("abba", "a")],
  lambda s, c: [min(abs(i - j) for j, ch in enumerate(s) if ch == c) for i in range(len(s))],
  "One pass left to right and one right to left, tracking the last position of c.", ["Strings", "Arrays"])

Q(TP, "reverse-only-letters", "Reverse Only Letters", "Easy", "reverseOnlyLetters(s: String) -> String",
  "Reverse only the English letters of s; every other character stays where it is.",
  [C("ab-cd"), C("a-bC-dEf-ghIj"), C("Test1ng-Leet=code-Q!"), C("7_28]")], lambda s: _rev_letters(s),
  "Two pointers that skip non-letters and swap letters.", ["Strings"])

Q(TP, "partition-around-pivot", "Partition Array According to Given Pivot", "Medium", "pivotArray(nums: int[], pivot: int) -> int[]",
  "Rearrange nums so all elements less than pivot come first, then elements equal to pivot, then elements greater, keeping the relative order within each group.",
  [C([9, 12, 5, 10, 14, 3, 10], 10), C([-3, 4, 3, 2], 2), C([1], 1), C(rl(15, 0, 9), 5)],
  lambda a, p: [x for x in a if x < p] + [x for x in a if x == p] + [x for x in a if x > p], "Fill less-than from the front and greater-than from the back of a result array.", ["Arrays"])

Q(TP, "count-pairs-less-than-target", "Count Pairs Whose Sum Is Less than Target", "Easy", "countPairs(nums: int[], target: int) -> int",
  "Return how many pairs i < j have nums[i] + nums[j] < target.",
  [C([-1, 1, 2, 3, 1], 2), C([-6, 2, 5, -2, -7, -1, 3], -2), C([5], 0), C(rl(30, -10, 10), 1)],
  lambda a, t: sum(a[i] + a[j] < t for i in range(len(a)) for j in range(i + 1, len(a))),
  "Sort; if nums[l] + nums[r] < target, all pairs (l, l+1..r) count, so add r - l and move l.", ["Sorting"])

Q(TP, "two-sum-less-than-k", "Two Sum Less Than K", "Easy", "twoSumLessThanK(nums: int[], k: int) -> int",
  "Return the largest sum nums[i] + nums[j] (i < j) that is strictly less than k, or -1 if none exists.",
  [C([34, 23, 1, 24, 75, 33, 54, 8], 60), C([10, 20, 30], 15), C([1, 2], 4), C(rl(20, 1, 50), 40)],
  lambda a, k: max((a[i] + a[j] for i in range(len(a)) for j in range(i + 1, len(a)) if a[i] + a[j] < k), default=-1),
  "Sort, then two pointers: a sum below k is a candidate and moves left up; otherwise move right down.", ["Sorting"])

Q(TP, "valid-triangle-number", "Valid Triangle Number", "Medium", "triangleNumber(nums: int[]) -> int",
  "Return how many triplets of indices can be the side lengths of a non-degenerate triangle (each pair of sides sums to more than the third).",
  [C([2, 2, 3, 4]), C([4, 2, 3, 4]), C([1, 1, 1]), C([0, 1, 1]), C(rl(15, 1, 12))],
  lambda a: sum(1 for x, y, z in itertools.combinations(sorted(a), 3) if x + y > z),
  "Sort; fix the largest side and count pairs to its left with two pointers.", ["Sorting", "Greedy"])

Q(TP, "minimize-max-pair-sum", "Minimize Maximum Pair Sum in Array", "Medium", "minPairSum(nums: int[]) -> int",
  "nums has even length. Split it into pairs so that the largest pair sum is as small as possible. Return that largest pair sum.",
  [C([3, 5, 2, 3]), C([3, 5, 4, 2, 4, 6]), C([1, 1]), C(rl(16, 1, 30))],
  lambda a: max(x + y for x, y in zip(sorted(a), sorted(a)[::-1])), "Sort and pair the smallest with the largest.", ["Greedy", "Sorting"])

Q(TP, "sum-of-square-numbers", "Sum of Square Numbers", "Medium", "judgeSquareSum(c: int) -> boolean",
  "Return true if there are non-negative integers a and b with a^2 + b^2 == c.",
  [C(5), C(3), C(0), C(4), C(2147483600), C(999999999)], lambda c: any(math.isqrt(c - a * a) ** 2 == c - a * a for a in range(math.isqrt(c) + 1)),
  "a starts at 0 and b at sqrt(c); move a up when the sum is small and b down when it's large. Use long.", ["Math", "Binary Search"])

Q(TP, "interval-list-intersections", "Interval List Intersections", "Medium", "intervalIntersection(firstList: int[][], secondList: int[][]) -> int[][]",
  "Each list holds sorted, disjoint closed intervals [start, end]. Return their intersection as a sorted list of intervals.",
  [C([[0, 2], [5, 10], [13, 23], [24, 25]], [[1, 5], [8, 12], [15, 24], [25, 26]]), C([[1, 3], [5, 9]], []), C([[1, 7]], [[3, 10]]), C([[1, 2]], [[3, 4]])],
  lambda A, B: [[max(a[0], b[0]), min(a[1], b[1])] for a in A for b in B if max(a[0], b[0]) <= min(a[1], b[1])],
  "Overlap = [max(starts), min(ends)] if non-empty; advance whichever interval ends first.", ["Arrays"])


def _boats(p, lim):
    p = sorted(p)
    i, j, n = 0, len(p) - 1, 0
    while i <= j:
        if p[i] + p[j] <= lim:
            i += 1
        j -= 1
        n += 1
    return n


def _bs(s):
    out = []
    for ch in s:
        if ch == "#":
            if out:
                out.pop()
        else:
            out.append(ch)
    return "".join(out)


def _ksum(a, k):
    cnt, ops = Counter(), 0
    for x in a:
        if cnt[k - x]:
            cnt[k - x] -= 1
            ops += 1
        else:
            cnt[x] += 1
    return ops


def _rev_letters(s):
    letters = [c for c in s if c.isalpha()]
    return "".join(letters.pop() if c.isalpha() else c for c in s)
