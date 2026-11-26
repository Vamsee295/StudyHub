# Prefix sums, difference arrays and prefix XOR (Striver, LeetCode classics).
PS = "Prefix Sum"

Q(PS, "range-sum-query", "Range Sum Query", "Easy", "rangeSums(nums: int[], queries: int[][]) -> int[]",
  "Each query [l, r] asks for nums[l] + ... + nums[r]. Return the answers in order. Precompute so each query is O(1).",
  [C([-2, 0, 3, -5, 2, -1], [[0, 2], [2, 5], [0, 5]]), C([5], [[0, 0]]), C([1, 2, 3, 4], [[1, 1], [0, 3], [2, 3]]), C(rl(20), [[0, 19], [3, 9], [10, 10], [5, 15]])],
  lambda a, qs: [sum(a[l:r + 1]) for l, r in qs], "prefix[i] = sum of the first i values; a range is prefix[r + 1] - prefix[l].", ["Arrays"])

Q(PS, "range-sum-2d", "Range Sum Query 2D", "Medium", "regionSums(matrix: int[][], queries: int[][]) -> int[]",
  "Each query [r1, c1, r2, c2] asks for the sum of the rectangle with corners (r1, c1) and (r2, c2), inclusive. Return the answers in order.",
  [C([[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]], [[2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]]), C([[7]], [[0, 0, 0, 0]]),
   C([[1, 2], [3, 4]], [[0, 0, 1, 1], [1, 0, 1, 1], [0, 1, 1, 1]])],
  lambda m, qs: [sum(m[r][c] for r in range(r1, r2 + 1) for c in range(c1, c2 + 1)) for r1, c1, r2, c2 in qs],
  "Build P[r+1][c+1] = sum of the top-left rectangle; answer by inclusion-exclusion of four corners.", ["Matrix"])

Q(PS, "contiguous-array", "Contiguous Array", "Medium", "findMaxLength(nums: int[]) -> int",
  "nums is binary. Return the length of the longest contiguous subarray with an equal number of 0s and 1s.",
  [C([0, 1]), C([0, 1, 0]), C([0, 1, 1, 1, 1, 1, 0, 0, 0]), C([1, 1]), C([rng.randint(0, 1) for _ in range(30)])],
  lambda a: max((j - i for i in range(len(a)) for j in range(i + 2, len(a) + 1, 2) if 2 * sum(a[i:j]) == j - i), default=0),
  "Count 0 as -1; a zero-sum subarray sits between two equal prefix sums. Store each prefix's first index.", ["Hash Map"])

Q(PS, "subarray-sums-divisible-by-k", "Subarray Sums Divisible by K", "Medium", "subarraysDivByK(nums: int[], k: int) -> int",
  "Return how many non-empty subarrays have a sum divisible by k.",
  [C([4, 5, 0, -2, -3, 1], 5), C([5], 9), C([-1, 2, 9], 2), C(rl(25, -10, 10), 3)],
  lambda a, k: sum(sum(a[i:j]) % k == 0 for i in range(len(a)) for j in range(i + 1, len(a) + 1)),
  "Count prefix sums by their remainder mod k (fix negative remainders); equal remainders pair up.", ["Hash Map"])

Q(PS, "continuous-subarray-sum", "Continuous Subarray Sum", "Medium", "checkSubarraySum(nums: int[], k: int) -> boolean",
  "Return true if nums has a subarray of length at least 2 whose sum is a multiple of k.",
  [C([23, 2, 4, 6, 7], 6), C([23, 2, 6, 4, 7], 13), C([5, 0, 0, 0], 3), C([1, 2], 4), C(rl(15, 0, 9), 7)],
  lambda a, k: any(sum(a[i:j]) % k == 0 for i in range(len(a)) for j in range(i + 2, len(a) + 1)),
  "Remember the first index of each prefix remainder; a repeat at least 2 apart means yes.", ["Hash Map", "Math"])

Q(PS, "highest-altitude", "Find the Highest Altitude", "Easy", "largestAltitude(gain: int[]) -> int",
  "A biker starts at altitude 0; gain[i] is the change between points i and i + 1. Return the highest altitude reached.",
  [C([-5, 1, 5, 0, -7]), C([-4, -3, -2, -1, 4, 3, 2]), C([1]), C(rl(20, -10, 10))], lambda g: max(0, *itertools.accumulate(g)),
  "Running sum, tracking the maximum (including the start at 0).", ["Arrays"])

Q(PS, "left-right-sum-differences", "Left and Right Sum Differences", "Easy", "leftRightDifference(nums: int[]) -> int[]",
  "Return answer where answer[i] = |(sum of elements left of i) - (sum of elements right of i)|.",
  [C([10, 4, 8, 3]), C([1]), C([1, 2, 3]), C(rl(10, 0, 20))], lambda a: [abs(sum(a[:i]) - sum(a[i + 1:])) for i in range(len(a))],
  "Keep a running left sum; right = total - left - nums[i].", ["Arrays"])

Q(PS, "min-start-value", "Minimum Value to Get Positive Step by Step Sum", "Easy", "minStartValue(nums: int[]) -> int",
  "Starting from a positive value, you add nums from left to right. Return the minimum start value so the running total is never below 1.",
  [C([-3, 2, -3, 4, 2]), C([1, 2]), C([1, -2, -3]), C(rl(15, -10, 10))], lambda a: max(1, 1 - min(itertools.accumulate(a))),
  "Find the minimum prefix sum m; you need start + m >= 1.", ["Arrays"])

Q(PS, "ways-to-split-array", "Number of Ways to Split Array", "Medium", "waysToSplitArray(nums: int[]) -> int",
  "A split at index i (0 <= i < n - 1) is valid if the sum of nums[0..i] is at least the sum of nums[i+1..n-1]. Return the number of valid splits.",
  [C([10, 4, -8, 7]), C([2, 3, 1, 0]), C([1, 1]), C(rl(20, -10, 10))], lambda a: sum(sum(a[:i + 1]) >= sum(a[i + 1:]) for i in range(len(a) - 1)),
  "One running prefix sum compared with total - prefix (use long for big inputs).", ["Arrays"])

Q(PS, "longest-subarray-sum-k", "Longest Subarray with Sum K", "Medium", "longestSubarrayWithSumK(nums: int[], k: int) -> int",
  "Return the length of the longest contiguous subarray summing to k (values may be negative), or 0 if none.",
  [C([10, 5, 2, 7, 1, 9], 15), C([-1, 2, 3], 6), C([1, -1, 5, -2, 3], 3), C(rl(25, -5, 5), 4)],
  lambda a, k: max((j - i for i in range(len(a)) for j in range(i + 1, len(a) + 1) if sum(a[i:j]) == k), default=0),
  "Map each prefix sum to its FIRST index; at j, look for prefix - k.", ["Hash Map"])

Q(PS, "longest-zero-sum-subarray", "Largest Subarray with 0 Sum", "Medium", "maxLen(nums: int[]) -> int",
  "Return the length of the longest contiguous subarray whose sum is 0.",
  [C([15, -2, 2, -8, 1, 7, 10, 23]), C([2, 10, 4]), C([1, 0, -1]), C(rl(25, -4, 4))],
  lambda a: max((j - i for i in range(len(a)) for j in range(i + 1, len(a) + 1) if sum(a[i:j]) == 0), default=0),
  "Two equal prefix sums enclose a zero-sum subarray.", ["Hash Map"])

Q(PS, "subarrays-xor-k", "Count Subarrays with XOR K", "Medium", "subarraysWithXorK(nums: int[], k: int) -> int",
  "Return how many subarrays have a bitwise XOR equal to k.",
  [C([4, 2, 2, 6, 4], 6), C([5, 6, 7, 8, 9], 5), C([1], 1), C(rl(25, 0, 15), 7)],
  lambda a, k: sum(reduce(lambda x, y: x ^ y, a[i:j]) == k for i in range(len(a)) for j in range(i + 1, len(a) + 1)),
  "prefixXor[j] ^ prefixXor[i] = xor of the subarray; count earlier prefixes equal to prefixXor[j] ^ k.", ["Hash Map", "Bit Manipulation"])

Q(PS, "car-pooling", "Car Pooling", "Medium", "carPooling(trips: int[][], capacity: int) -> boolean",
  "Each trip [passengers, from, to] picks people up at km `from` and drops them at km `to`. The car only drives east. Return true if it never holds more than capacity people.",
  [C([[2, 1, 5], [3, 3, 7]], 4), C([[2, 1, 5], [3, 3, 7]], 5), C([[3, 2, 7], [3, 7, 9], [8, 3, 9]], 11), C([[1, 0, 1]], 1)],
  lambda t, cap: all(sum(p for p, f, to in t if f <= x < to) <= cap for x in range(1001)),
  "Difference array: +p at from, -p at to; a running sum is the load at each km.", ["Arrays", "Difference Array"])

Q(PS, "corporate-flight-bookings", "Corporate Flight Bookings", "Medium", "corpFlightBookings(bookings: int[][], n: int) -> int[]",
  "Flights are numbered 1..n. Each booking [first, last, seats] reserves seats on every flight from first to last. Return the total seats reserved per flight.",
  [C([[1, 2, 10], [2, 3, 20], [2, 5, 25]], 5), C([[1, 2, 10], [2, 2, 15]], 2), C([[1, 1, 5]], 1), C([[2, 4, 3], [1, 3, 1]], 4)],
  lambda b, n: [sum(s for f, l, s in b if f <= i <= l) for i in range(1, n + 1)], "Add seats at first and subtract after last, then prefix-sum.", ["Arrays", "Difference Array"])

Q(PS, "range-addition", "Range Addition", "Medium", "getModifiedArray(length: int, updates: int[][]) -> int[]",
  "Start with an array of zeros of the given length. Each update [start, end, inc] adds inc to every index in [start, end]. Return the final array.",
  [C(5, [[1, 3, 2], [2, 4, 3], [0, 2, -2]]), C(3, []), C(4, [[0, 3, 1]]), C(6, [[0, 0, 5], [5, 5, -5], [1, 4, 2]])],
  lambda n, ups: [sum(inc for s, e, inc in ups if s <= i <= e) for i in range(n)], "Difference array again: O(1) per update, one prefix pass at the end.", ["Arrays", "Difference Array"])

Q(PS, "shifting-letters", "Shifting Letters", "Medium", "shiftingLetters(s: String, shifts: int[]) -> String",
  "shifts[i] means: shift the first i + 1 letters of s forward by shifts[i] (z wraps to a). Return the final string.",
  [C("abc", [3, 5, 9]), C("aaa", [1, 2, 3]), C("z", [52]), C("bad", [10, 20, 30])],
  lambda s, sh: "".join(chr((ord(c) - 97 + sum(sh[i:])) % 26 + 97) for i, c in enumerate(s)), "Letter i moves by the suffix sum of shifts from i; compute right to left mod 26.", ["Strings"])

Q(PS, "max-score-split-string", "Maximum Score After Splitting a String", "Easy", "maxScore(s: String) -> int",
  "Split the binary string s into two non-empty parts. The score is (zeros in the left part) + (ones in the right part). Return the maximum score.",
  [C("011101"), C("00111"), C("1111"), C("00"), C(rs(20, "01"))], lambda s: max(s[:i].count("0") + s[i:].count("1") for i in range(1, len(s))),
  "Count all ones first, then sweep the split point updating both counts.", ["Strings"])

Q(PS, "zero-filled-subarrays", "Number of Zero-Filled Subarrays", "Medium", "zeroFilledSubarray(nums: int[]) -> int",
  "Return the number of subarrays filled entirely with 0.",
  [C([1, 3, 0, 0, 2, 0, 0, 4]), C([0, 0, 0, 2, 0, 0]), C([2, 10, 2019]), C([rng.choice([0, 0, 1]) for _ in range(30)])],
  lambda a: sum(_run_tri(g) for k, g in itertools.groupby(a) if k == 0),
  "A run of r zeros contributes r(r + 1)/2; equivalently add the current run length at each zero.", ["Arrays", "Math"])

Q(PS, "sum-odd-length-subarrays", "Sum of All Odd Length Subarrays", "Easy", "sumOddLengthSubarrays(arr: int[]) -> int",
  "Return the sum of all elements of every odd-length subarray of arr.",
  [C([1, 4, 2, 5, 3]), C([1, 2]), C([10, 11, 12]), C(rl(15, 1, 30))],
  lambda a: sum(sum(a[i:j]) for i in range(len(a)) for j in range(i + 1, len(a) + 1, 2)), "Prefix sums make each subarray O(1); or count how many odd subarrays include each index.", ["Arrays", "Math"])

Q(PS, "minimum-average-difference", "Minimum Average Difference", "Medium", "minimumAverageDifference(nums: int[]) -> int",
  "For index i, the average difference is |floor(avg of first i + 1 elements) - floor(avg of the remaining elements)| (the average of zero elements is 0). Return the index with the smallest difference (the smallest such index on ties).",
  [C([2, 5, 3, 9, 5, 3]), C([0]), C([4, 2, 0]), C(rl(20, 0, 50))],
  lambda a: min(range(len(a)), key=lambda i: (abs(sum(a[:i + 1]) // (i + 1) - (sum(a[i + 1:]) // (len(a) - i - 1) if i < len(a) - 1 else 0)), i)),
  "Running prefix sum; suffix = total - prefix. Use long and integer division.", ["Arrays"])

Q(PS, "vowel-strings-in-ranges", "Count Vowel Strings in Ranges", "Medium", "vowelStrings(words: String[], queries: int[][]) -> int[]",
  "A word is a vowel string if it starts and ends with a vowel. For each query [l, r], count vowel strings among words[l..r].",
  [C(["aba", "bcb", "ece", "aa", "e"], [[0, 2], [1, 4], [1, 1]]), C(["a", "e", "i"], [[0, 2], [0, 1], [2, 2]]), C(["xyz"], [[0, 0]])],
  lambda w, qs: [sum(x[0] in "aeiou" and x[-1] in "aeiou" for x in w[l:r + 1]) for l, r in qs], "Prefix count of vowel strings; each query is a subtraction.", ["Strings"])

Q(PS, "ways-to-make-fair-array", "Ways to Make a Fair Array", "Medium", "waysToMakeFair(nums: int[]) -> int",
  "Removing one index shifts later elements. An array is fair if the sum at even indices equals the sum at odd indices. Return how many indices you could remove to make nums fair.",
  [C([2, 1, 6, 4]), C([1, 1, 1]), C([1, 2, 3]), C(rl(15, 1, 10))],
  lambda a: sum((lambda b: sum(b[0::2]) == sum(b[1::2]))(a[:i] + a[i + 1:]) for i in range(len(a))),
  "After removing i, elements to its right swap parity. Keep prefix even/odd sums and use totals for the right side.", ["Arrays"])

Q(PS, "grid-game", "Grid Game", "Medium", "gridGame(grid: int[][]) -> int",
  "A 2 x n grid. Robot 1 goes from top-left to bottom-right moving right or down once, collecting and zeroing the cells it visits. Then robot 2 does the same, maximising its total. Robot 1 plays to minimise robot 2's total. Return robot 2's total.",
  [C([[2, 5, 4], [1, 5, 1]]), C([[3, 3, 1], [8, 5, 2]]), C([[1, 3, 1, 15], [1, 3, 3, 1]]), C([rl(8, 1, 20), rl(8, 1, 20)])],
  lambda g: min(max(sum(g[0][i + 1:]), sum(g[1][:i])) for i in range(len(g[0]))), "If robot 1 drops down at column i, robot 2 gets max(top suffix after i, bottom prefix before i).", ["Arrays", "Matrix"])

Q(PS, "plates-between-candles", "Plates Between Candles", "Medium", "platesBetweenCandles(s: String, queries: int[][]) -> int[]",
  "s has '*' (plate) and '|' (candle). For each query [l, r], count plates in s[l..r] that have a candle somewhere to their left and right within that substring.",
  [C("**|**|***|", [[2, 5], [5, 9]]), C("***|**|*****|**||**|*", [[1, 17], [4, 5], [14, 17], [5, 11], [15, 16]]), C("|*|", [[0, 2], [0, 1]])],
  lambda s, qs: [(lambda t: t.strip("*").count("*"))(s[l:r + 1]) for l, r in qs], "Prefix count of plates, plus nearest candle to the right of l and to the left of r.", ["Strings", "Binary Search"])

Q(PS, "range-covered", "Check if All the Integers in a Range Are Covered", "Easy", "isCovered(ranges: int[][], left: int, right: int) -> boolean",
  "Each range [start, end] covers every integer in it. Return true if every integer in [left, right] is covered by at least one range.",
  [C([[1, 2], [3, 4], [5, 6]], 2, 5), C([[1, 10], [10, 20]], 21, 21), C([[1, 1]], 1, 1), C([[2, 3], [5, 6]], 2, 6)],
  lambda rg, l, r: all(any(s <= x <= e for s, e in rg) for x in range(l, r + 1)), "Difference array over the small value range, then check coverage > 0.", ["Arrays", "Difference Array"])

Q(PS, "xor-queries", "XOR Queries of a Subarray", "Medium", "xorQueries(arr: int[], queries: int[][]) -> int[]",
  "For each query [l, r], return arr[l] XOR arr[l + 1] XOR ... XOR arr[r].",
  [C([1, 3, 4, 8], [[0, 1], [1, 2], [0, 3], [3, 3]]), C([4, 8, 2, 10], [[2, 3], [1, 3], [0, 0], [0, 3]]), C([7], [[0, 0]])],
  lambda a, qs: [reduce(lambda x, y: x ^ y, a[l:r + 1]) for l, r in qs], "Prefix XOR: px[r + 1] ^ px[l].", ["Bit Manipulation"])

Q(PS, "prefix-common-array", "Find the Prefix Common Array of Two Arrays", "Medium", "findThePrefixCommonArray(A: int[], B: int[]) -> int[]",
  "A and B are permutations of 1..n. C[i] is how many numbers appear in both A[0..i] and B[0..i]. Return C.",
  [C([1, 3, 2, 4], [3, 1, 2, 4]), C([2, 3, 1], [3, 1, 2]), C([1], [1]), C([4, 1, 3, 2], [2, 4, 1, 3])],
  lambda a, b: [len(set(a[:i + 1]) & set(b[:i + 1])) for i in range(len(a))], "Count how many times each number has been seen across both arrays; it's common when its count hits 2.", ["Hash Map"])


def _run_tri(g):
    r = len(list(g))
    return r * (r + 1) // 2
