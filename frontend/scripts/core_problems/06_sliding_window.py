# Sliding window (Striver sliding window & two pointer playlist, NeetCode, LeetCode classics).
SW = "Sliding Window"

def _subs(a):
    return [a[i:j] for i in range(len(a)) for j in range(i + 1, len(a) + 1)]


Q(SW, "max-average-subarray", "Maximum Average Subarray I", "Easy", "findMaxAverage(nums: int[], k: int) -> double",
  "Return the maximum average of any contiguous subarray of length k.",
  [C([1, 12, -5, -6, 50, 3], 4), C([5], 1), C([-1, -2, -3], 2), C(rl(30, -20, 20), 5)], lambda a, k: max(sum(a[i:i + k]) for i in range(len(a) - k + 1)) / k,
  "Slide a window of size k keeping its sum; divide the best sum by k at the end.", ["Arrays"])

Q(SW, "max-vowels-substring", "Maximum Number of Vowels in a Substring of Given Length", "Medium", "maxVowels(s: String, k: int) -> int",
  "Return the maximum number of vowels in any substring of s of length k.",
  [C("abciiidef", 3), C("aeiou", 2), C("leetcode", 3), C("rhythms", 4), C(rs(40, "abeiox"), 6)],
  lambda s, k: max(sum(c in "aeiou" for c in s[i:i + k]) for i in range(len(s) - k + 1)), "Add the entering character, subtract the leaving one.", ["Strings"])

Q(SW, "character-replacement", "Longest Repeating Character Replacement", "Medium", "characterReplacement(s: String, k: int) -> int",
  "You may change at most k characters of s (uppercase letters). Return the length of the longest substring of one repeated letter you can get.",
  [C("ABAB", 2), C("AABABBA", 1), C("A", 0), C("AAAA", 2), C(rs(30, "ABC"), 3)],
  lambda s, k: max(len(t) for t in _subs(s) if len(t) - max(Counter(t).values()) <= k),
  "Window is valid while length - (count of its most frequent letter) <= k.", ["Strings", "Hash Map"])

Q(SW, "permutation-in-string", "Permutation in String", "Medium", "checkInclusion(s1: String, s2: String) -> boolean",
  "Return true if some permutation of s1 is a substring of s2.",
  [C("ab", "eidbaooo"), C("ab", "eidboaoo"), C("adc", "dcda"), C("abc", "ab"), C("hello", "ooolleoooleh")],
  lambda a, b: any(Counter(b[i:i + len(a)]) == Counter(a) for i in range(len(b) - len(a) + 1)), "Compare letter counts of a fixed window of size len(s1) as it slides.", ["Strings", "Hash Map"])

Q(SW, "find-all-anagrams", "Find All Anagrams in a String", "Medium", "findAnagrams(s: String, p: String) -> int[]",
  "Return every start index in s where an anagram of p begins, in increasing order.",
  [C("cbaebabacd", "abc"), C("abab", "ab"), C("a", "ab"), C("aaaa", "aa")],
  lambda s, p: [i for i in range(len(s) - len(p) + 1) if Counter(s[i:i + len(p)]) == Counter(p)], "Same fixed-size window as Permutation in String; record each match.", ["Strings", "Hash Map"])

Q(SW, "minimum-window-substring", "Minimum Window Substring", "Hard", "minWindow(s: String, t: String) -> String",
  "Return the shortest substring of s that contains every character of t (with multiplicity). If there are several, return the leftmost; if none, return \"\".",
  [C("ADOBECODEBANC", "ABC"), C("a", "a"), C("a", "aa"), C("aaflslflsldkalskaaa", "aaa"), C("bba", "ab")],
  lambda s, t: min((s[i:j] for i in range(len(s)) for j in range(i + 1, len(s) + 1) if not (Counter(t) - Counter(s[i:j]))), key=len, default=""),
  "Expand right until the window covers t, then shrink left while it still does, recording the best.", ["Strings", "Hash Map"])

Q(SW, "sliding-window-maximum", "Sliding Window Maximum", "Hard", "maxSlidingWindow(nums: int[], k: int) -> int[]",
  "Return the maximum of each window of size k as it slides from left to right.",
  [C([1, 3, -1, -3, 5, 3, 6, 7], 3), C([1], 1), C([9, 8, 7, 6], 2), C(rl(30), 4)], lambda a, k: [max(a[i:i + k]) for i in range(len(a) - k + 1)],
  "Keep a deque of indices with decreasing values; the front is the window's max.", ["Arrays", "Queue", "Monotonic Queue"])

Q(SW, "max-consecutive-ones-iii", "Max Consecutive Ones III", "Medium", "longestOnes(nums: int[], k: int) -> int",
  "nums is binary. You may flip at most k zeros. Return the longest run of consecutive 1s you can get.",
  [C([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2), C([0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3), C([0, 0], 0), C([rng.randint(0, 1) for _ in range(30)], 4)],
  lambda a, k: max((len(t) for t in _subs(a) if t.count(0) <= k), default=0), "Shrink the window when it holds more than k zeros.", ["Arrays"])

Q(SW, "fruit-into-baskets", "Fruit Into Baskets", "Medium", "totalFruit(fruits: int[]) -> int",
  "Walking along a row of trees (fruits[i] is the type), you pick one fruit from each tree but your two baskets each hold only one type. Return the most fruit you can pick from one contiguous stretch.",
  [C([1, 2, 1]), C([0, 1, 2, 2]), C([1, 2, 3, 2, 2]), C([3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]), C(rl(30, 0, 3))],
  lambda a: max(len(t) for t in _subs(a) if len(set(t)) <= 2), "Longest window with at most two distinct values.", ["Arrays", "Hash Map"])

Q(SW, "longest-ones-after-deleting", "Longest Subarray of 1s After Deleting One Element", "Medium", "longestSubarray(nums: int[]) -> int",
  "nums is binary. Delete exactly one element, then return the length of the longest run of 1s.",
  [C([1, 1, 0, 1]), C([0, 1, 1, 1, 0, 1, 1, 0, 1]), C([1, 1, 1]), C([0, 0]), C([rng.randint(0, 1) for _ in range(30)])],
  lambda a: max(len(t) - 1 for t in _subs(a) if t.count(0) <= 1), "Window with at most one zero; answer is its size minus one.", ["Arrays"])

Q(SW, "substrings-with-all-three", "Number of Substrings Containing All Three Characters", "Medium", "numberOfSubstrings(s: String) -> int",
  "s contains only a, b and c. Return how many substrings contain at least one of each.",
  [C("abcabc"), C("aaacb"), C("abc"), C("aaa"), C(rs(30))], lambda s: sum(set(t) >= set("abc") for t in _subs(s)),
  "For each right end, count left starts that still include all three: track the last index of each letter.", ["Strings", "Hash Map"])

Q(SW, "nice-subarrays", "Count Number of Nice Subarrays", "Medium", "numberOfSubarrays(nums: int[], k: int) -> int",
  "A subarray is nice if it contains exactly k odd numbers. Return the number of nice subarrays.",
  [C([1, 1, 2, 1, 1], 3), C([2, 4, 6], 1), C([2, 2, 2, 1, 2, 2, 1, 2, 2, 2], 2), C(rl(25, 0, 9), 3)],
  lambda a, k: sum(sum(x % 2 for x in t) == k for t in _subs(a)), "exactly(k) = atMost(k) - atMost(k - 1).", ["Arrays", "Prefix Sum"])

Q(SW, "binary-subarrays-with-sum", "Binary Subarrays With Sum", "Medium", "numSubarraysWithSum(nums: int[], goal: int) -> int",
  "nums is binary. Return how many non-empty subarrays sum to goal.",
  [C([1, 0, 1, 0, 1], 2), C([0, 0, 0, 0, 0], 0), C([1, 1, 1], 4), C([rng.randint(0, 1) for _ in range(25)], 3)],
  lambda a, g: sum(sum(t) == g for t in _subs(a)), "atMost(goal) - atMost(goal - 1), or prefix sums with a count map.", ["Arrays", "Prefix Sum"])

Q(SW, "max-points-from-cards", "Maximum Points You Can Obtain from Cards", "Medium", "maxScore(cardPoints: int[], k: int) -> int",
  "Take exactly k cards, each time from the start or the end of the row. Return the maximum total points.",
  [C([1, 2, 3, 4, 5, 6, 1], 3), C([2, 2, 2], 2), C([9, 7, 7, 9, 7, 7, 9], 7), C(rl(20, 1, 50), 6)],
  lambda a, k: max(sum(a[:i]) + sum(a[len(a) - (k - i):]) for i in range(k + 1)), "Equivalently, find the minimum-sum window of n - k cards left behind.", ["Arrays", "Prefix Sum"])

Q(SW, "subarrays-k-different", "Subarrays with K Different Integers", "Hard", "subarraysWithKDistinct(nums: int[], k: int) -> int",
  "Return how many subarrays contain exactly k distinct integers.",
  [C([1, 2, 1, 2, 3], 2), C([1, 2, 1, 3, 4], 3), C([1, 1, 1], 1), C(rl(25, 1, 4), 2)],
  lambda a, k: sum(len(set(t)) == k for t in _subs(a)), "exactly(k) = atMost(k) - atMost(k - 1), each a standard sliding window.", ["Arrays", "Hash Map"])

Q(SW, "longest-substring-at-most-k-distinct", "Longest Substring with At Most K Distinct Characters", "Medium", "lengthOfLongestSubstringKDistinct(s: String, k: int) -> int",
  "Return the length of the longest substring of s with at most k distinct characters.",
  [C("eceba", 2), C("aa", 1), C("abaccc", 2), C("abc", 0), C(rs(30, "abcd"), 3)],
  lambda s, k: max((len(t) for t in _subs(s) if len(set(t)) <= k), default=0), "Shrink from the left whenever the window has more than k distinct letters.", ["Strings", "Hash Map"])

Q(SW, "subarrays-avg-threshold", "Number of Sub-arrays of Size K and Average at Least Threshold", "Medium", "numOfSubarrays(arr: int[], k: int, threshold: int) -> int",
  "Return how many subarrays of size k have an average greater than or equal to threshold.",
  [C([2, 2, 2, 2, 5, 5, 5, 8], 3, 4), C([11, 13, 17, 23, 29, 31, 7, 5, 2, 3], 3, 5), C([1], 1, 1), C(rl(30, 0, 20), 4, 10)],
  lambda a, k, th: sum(sum(a[i:i + k]) >= k * th for i in range(len(a) - k + 1)), "Compare window sums with k * threshold to avoid division.", ["Arrays"])

Q(SW, "min-recolors", "Minimum Recolors to Get K Consecutive Black Blocks", "Easy", "minimumRecolors(blocks: String, k: int) -> int",
  "blocks has 'W' (white) and 'B' (black). Return the fewest whites you must repaint black to get k consecutive black blocks.",
  [C("WBBWWBBWBW", 7), C("WBWBBBW", 2), C("BBB", 3), C(rs(25, "WB"), 6)], lambda b, k: min(b[i:i + k].count("W") for i in range(len(b) - k + 1)),
  "Count whites in each window of size k; the minimum is the answer.", ["Strings"])

Q(SW, "defuse-the-bomb", "Defuse the Bomb", "Easy", "decrypt(code: int[], k: int) -> int[]",
  "code is circular. Replace each element: if k > 0, by the sum of the next k elements; if k < 0, by the sum of the previous |k| elements; if k == 0, by 0. Return the new array.",
  [C([5, 7, 1, 4], 3), C([1, 2, 3, 4], 0), C([2, 4, 9, 3], -2), C(rl(10, 1, 20), 4)],
  lambda c, k: [0 if k == 0 else sum(c[(i + d) % len(c)] for d in (range(1, k + 1) if k > 0 else range(k, 0))) for i in range(len(c))],
  "A window of size |k| moving around the circle with modulo indices.", ["Arrays"])

Q(SW, "distinct-substrings-size-three", "Substrings of Size Three with Distinct Characters", "Easy", "countGoodSubstrings(s: String) -> int",
  "Return how many substrings of length 3 have three different characters (count every occurrence).",
  [C("xyzzaz"), C("aababcabc"), C("ab"), C(rs(30, "abcd"))], lambda s: sum(len(set(s[i:i + 3])) == 3 for i in range(len(s) - 2)),
  "Check each window of three characters.", ["Strings"])

Q(SW, "grumpy-bookstore", "Grumpy Bookstore Owner", "Medium", "maxSatisfied(customers: int[], grumpy: int[], minutes: int) -> int",
  "customers[i] arrive in minute i; if grumpy[i] is 1 they are unsatisfied. Once, the owner can stay calm for `minutes` consecutive minutes. Return the maximum number of satisfied customers.",
  [C([1, 0, 1, 2, 1, 1, 7, 5], [0, 1, 0, 1, 0, 1, 0, 1], 3), C([1], [0], 1), C([4, 10, 10], [1, 1, 0], 2), C(rl(15, 0, 9), [rng.randint(0, 1) for _ in range(15)], 4)],
  lambda c, g, m: sum(x for x, y in zip(c, g) if not y) + max(sum(c[j] for j in range(i, i + m) if g[j]) for i in range(len(c) - m + 1)),
  "Base satisfied total plus the best window of grumpy-minute customers you can win back.", ["Arrays"])

Q(SW, "min-swaps-group-ones", "Minimum Swaps to Group All 1s Together II", "Medium", "minSwaps(nums: int[]) -> int",
  "nums is a circular binary array. A swap exchanges any two elements. Return the minimum swaps to put all 1s next to each other.",
  [C([0, 1, 0, 1, 1, 0, 0]), C([0, 1, 1, 1, 0, 0, 1, 1, 0]), C([1, 1, 0, 0, 1]), C([0, 0]), C([rng.randint(0, 1) for _ in range(20)])],
  lambda a: 0 if sum(a) == 0 else min(sum(1 for d in range(sum(a)) if a[(i + d) % len(a)] == 0) for i in range(len(a))),
  "Window size = number of 1s; the answer is the fewest zeros in any circular window of that size.", ["Arrays"])

Q(SW, "maximum-erasure-value", "Maximum Erasure Value", "Medium", "maximumUniqueSubarray(nums: int[]) -> int",
  "Return the maximum sum of a contiguous subarray whose elements are all distinct.",
  [C([4, 2, 4, 5, 6]), C([5, 2, 1, 2, 5, 2, 1, 2, 5]), C([7]), C(rl(30, 1, 15))], lambda a: max(sum(t) for t in _subs(a) if len(set(t)) == len(t)),
  "Grow the window; when a value repeats, shrink from the left past its previous copy.", ["Arrays", "Hash Set"])

Q(SW, "frequency-most-frequent", "Frequency of the Most Frequent Element", "Medium", "maxFrequency(nums: int[], k: int) -> int",
  "In one operation you can increment any element by 1. With at most k operations, return the highest possible frequency of any value.",
  [C([1, 2, 4], 5), C([1, 4, 8, 13], 5), C([3, 9, 6], 2), C(rl(15, 1, 20), 10)],
  lambda a, k: (lambda s: max(j - i for i in range(len(s)) for j in range(i + 1, len(s) + 1) if s[j - 1] * (j - i) - sum(s[i:j]) <= k))(sorted(a)),
  "Sort; a window can all become its max if max * size - sum <= k.", ["Arrays", "Sorting", "Greedy"])

Q(SW, "min-ops-reduce-x", "Minimum Operations to Reduce X to Zero", "Medium", "minOperations(nums: int[], x: int) -> int",
  "Each operation removes the leftmost or rightmost element and subtracts it from x. Return the fewest operations to make x exactly 0, or -1 if impossible.",
  [C([1, 1, 4, 2, 3], 5), C([5, 6, 7, 8, 9], 4), C([3, 2, 20, 1, 1, 3], 10), C([1, 1], 3)],
  lambda a, x: min((i + j for i in range(len(a) + 1) for j in range(len(a) - i + 1) if sum(a[:i]) + sum(a[len(a) - j:]) == x), default=-1),
  "Find the longest middle window whose sum is total - x.", ["Arrays", "Prefix Sum"])
