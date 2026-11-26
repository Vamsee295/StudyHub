# Binary search: on arrays and on the answer (Striver A2Z binary search step).
BS = "Binary Search"

def _feasible_min(lo, hi, ok):
    """Smallest x in [lo, hi] with ok(x) true (ok is monotonic)."""
    while lo < hi:
        mid = (lo + hi) // 2
        if ok(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo


Q(BS, "lower-bound", "Lower Bound", "Easy", "lowerBound(nums: int[], x: int) -> int",
  "nums is sorted. Return the first index i with nums[i] >= x, or nums.length if there is none.",
  [C([1, 2, 2, 3], 2), C([3, 5, 8, 15, 19], 9), C([1, 2, 3], 10), C([5], 1), C(sorted(rl(30, 0, 50)), 25)], lambda a, x: bisect.bisect_left(a, x),
  "If nums[mid] >= x, mid could be the answer: record it and go left.")

Q(BS, "upper-bound", "Upper Bound", "Easy", "upperBound(nums: int[], x: int) -> int",
  "nums is sorted. Return the first index i with nums[i] > x, or nums.length if there is none.",
  [C([1, 2, 2, 3], 2), C([3, 5, 8, 9, 15, 19], 9), C([1, 2, 3], 0), C([5], 5), C(sorted(rl(30, 0, 50)), 25)], lambda a, x: bisect.bisect_right(a, x),
  "Same as lower bound with > instead of >=.")

Q(BS, "floor-and-ceil", "Floor and Ceil in a Sorted Array", "Easy", "floorCeil(nums: int[], x: int) -> int[]",
  "nums is sorted. Return [floor, ceil]: the largest value <= x and the smallest value >= x. Use -1 for a missing one.",
  [C([3, 4, 4, 7, 8, 10], 5), C([3, 4, 4, 7, 8, 10], 8), C([2, 5], 1), C([2, 5], 9)],
  lambda a, x: [max((v for v in a if v <= x), default=-1), min((v for v in a if v >= x), default=-1)], "Two binary searches, or one that tracks both candidates.")

Q(BS, "count-occurrences", "Count Occurrences in a Sorted Array", "Easy", "count(nums: int[], x: int) -> int",
  "nums is sorted. Return how many times x appears, in O(log n).",
  [C([2, 2, 3, 3, 3, 3, 4], 3), C([1, 1, 2, 2, 2, 2, 2, 3], 2), C([1, 2], 5), C(sorted(rl(40, 0, 10)), 4)], lambda a, x: a.count(x),
  "upperBound(x) - lowerBound(x).")

Q(BS, "search-rotated-ii", "Search in Rotated Sorted Array II", "Medium", "search(nums: int[], target: int) -> boolean",
  "nums was sorted (with possible duplicates) then rotated. Return true if target is in nums.",
  [C([2, 5, 6, 0, 0, 1, 2], 0), C([2, 5, 6, 0, 0, 1, 2], 3), C([1, 0, 1, 1, 1], 0), C([1], 1), C([3, 1, 2, 3, 3, 3, 3], 2)], lambda a, t: t in a,
  "Like the distinct version, but when nums[lo] == nums[mid] == nums[hi] you can only shrink both ends by one.", ["Arrays"])

Q(BS, "rotation-count", "Find Out How Many Times an Array Has Been Rotated", "Easy", "findKRotation(nums: int[]) -> int",
  "A sorted array of distinct values was rotated right k times. Return k (the index of the minimum).",
  [C([4, 5, 6, 7, 0, 1, 2]), C([3, 4, 5, 1, 2]), C([1, 2, 3]), C([2, 1])], lambda a: a.index(min(a)),
  "Binary search for the minimum, as in Minimum in a Rotated Sorted Array.", ["Arrays"])

Q(BS, "single-element-sorted", "Single Element in a Sorted Array", "Medium", "singleNonDuplicate(nums: int[]) -> int",
  "nums is sorted; every value appears exactly twice except one that appears once. Return it in O(log n).",
  [C([1, 1, 2, 3, 3, 4, 4, 8, 8]), C([3, 3, 7, 7, 10, 11, 11]), C([5]), C([1, 1, 2])], lambda a: next(v for v, c in Counter(a).items() if c == 1),
  "Before the single element, pairs start at even indices; after it, at odd indices.", ["Arrays"])

Q(BS, "peak-in-mountain", "Peak Index in a Mountain Array", "Medium", "peakIndexInMountainArray(arr: int[]) -> int",
  "arr strictly increases then strictly decreases. Return the index of its peak in O(log n).",
  [C([0, 1, 0]), C([0, 2, 1, 0]), C([0, 10, 5, 2]), C([3, 5, 3, 2, 0]), C([1, 3, 7, 9, 12, 8, 4])], lambda a: a.index(max(a)),
  "If arr[mid] < arr[mid + 1] the peak is to the right; otherwise it's at mid or to the left.", ["Arrays"])

Q(BS, "nth-root", "Find the Nth Root of an Integer", "Easy", "nthRoot(n: int, m: int) -> int",
  "Return the integer x with x^n == m, or -1 if no such integer exists.",
  [C(3, 27), C(4, 69), C(2, 1), C(5, 3125), C(2, 1000000)], lambda n, m: next((x for x in range(m + 1) if x ** n == m), -1) if m < 10**4 else (lambda r: r if r ** n == m else -1)(round(m ** (1 / n))),
  "Binary search x in [1, m]; compute x^n with early exit to avoid overflow.", ["Math"])

Q(BS, "min-days-bouquets", "Minimum Number of Days to Make m Bouquets", "Medium", "minDays(bloomDay: int[], m: int, k: int) -> int",
  "Flower i blooms on day bloomDay[i]. A bouquet needs k adjacent bloomed flowers. Return the minimum day to make m bouquets, or -1 if impossible.",
  [C([1, 10, 3, 10, 2], 3, 1), C([1, 10, 3, 10, 2], 3, 2), C([7, 7, 7, 7, 12, 7, 7], 2, 3), C([1000000000, 1000000000], 1, 1)],
  lambda b, m, k: -1 if m * k > len(b) else _feasible_min(min(b), max(b), lambda d: sum(len(list(g)) // k for ok, g in itertools.groupby(x <= d for x in b) if ok) >= m),
  "Binary search the day; for a day d, count bouquets by scanning runs of bloomed flowers.")

Q(BS, "smallest-divisor", "Find the Smallest Divisor Given a Threshold", "Medium", "smallestDivisor(nums: int[], threshold: int) -> int",
  "Choose a positive integer divisor, divide every element by it rounding up, and sum the results. Return the smallest divisor whose sum is at most threshold.",
  [C([1, 2, 5, 9], 6), C([44, 22, 33, 11, 1], 5), C([19], 5), C([2, 3, 5, 7, 11], 11)],
  lambda a, th: _feasible_min(1, max(a), lambda d: sum(-(-x // d) for x in a) <= th), "The sum shrinks as the divisor grows: binary search it.")

Q(BS, "ship-within-days", "Capacity To Ship Packages Within D Days", "Medium", "shipWithinDays(weights: int[], days: int) -> int",
  "Packages must ship in the given order; each day the ship carries packages up to its capacity. Return the least capacity that ships everything within days.",
  [C([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5), C([3, 2, 2, 4, 1, 4], 3), C([1, 2, 3, 1, 1], 4), C(rl(20, 1, 30), 6)],
  lambda w, d: _feasible_min(max(w), sum(w), lambda cap: _parts(w, cap) <= d), "Search capacity in [max(weights), sum(weights)]; count days greedily.")

Q(BS, "kth-missing-positive", "Kth Missing Positive Number", "Easy", "findKthPositive(arr: int[], k: int) -> int",
  "arr is strictly increasing positive integers. Return the k-th positive integer missing from arr.",
  [C([2, 3, 4, 7, 11], 5), C([1, 2, 3, 4], 2), C([5, 6, 7], 3), C([1, 3], 1)], lambda a, k: [x for x in range(1, max(a) + k + 1) if x not in a][k - 1],
  "Missing count before index i is arr[i] - (i + 1); binary search where it reaches k.", ["Arrays"])

Q(BS, "aggressive-cows", "Aggressive Cows", "Hard", "aggressiveCows(stalls: int[], k: int) -> int",
  "Place k cows in the stalls (positions given) so the minimum distance between any two cows is as large as possible. Return that distance.",
  [C([0, 3, 4, 7, 10, 9], 4), C([4, 2, 1, 3, 6], 2), C([1, 2, 8, 4, 9], 3), C([10, 1, 2, 7, 5], 3)],
  lambda s, k: max(d for d in range(0, max(s) - min(s) + 1) if _cows(sorted(s), d) >= k), "Binary search the distance; greedily place cows left to right.", ["Sorting"])

Q(BS, "book-allocation", "Allocate Minimum Number of Pages", "Hard", "findPages(books: int[], students: int) -> int",
  "Give each student a contiguous block of books (at least one each, every book assigned). Minimise the maximum pages any student reads. Return it, or -1 if there are more students than books.",
  [C([12, 34, 67, 90], 2), C([25, 46, 28, 49, 24], 4), C([15, 17, 20], 5), C([10, 20, 30, 40], 1)],
  lambda b, s: -1 if s > len(b) else _feasible_min(max(b), sum(b), lambda cap: _parts(b, cap) <= s), "Binary search the maximum pages; count students greedily.")

Q(BS, "split-array-largest-sum", "Split Array Largest Sum", "Hard", "splitArray(nums: int[], k: int) -> int",
  "Split nums into k non-empty contiguous subarrays so that the largest subarray sum is as small as possible. Return that sum.",
  [C([7, 2, 5, 10, 8], 2), C([1, 2, 3, 4, 5], 2), C([1, 4, 4], 3), C(rl(20, 0, 40), 4)],
  lambda a, k: _feasible_min(max(a), sum(a), lambda cap: _parts(a, cap) <= k), "Same pattern as book allocation (and the painter's partition).", ["Dynamic Programming", "Greedy"])

Q(BS, "kth-element-two-sorted", "K-th Element of Two Sorted Arrays", "Medium", "kthElement(a: int[], b: int[], k: int) -> int",
  "Return the k-th smallest element (1-based) of the union of two sorted arrays. Aim for O(log(min(n, m))).",
  [C([2, 3, 6, 7, 9], [1, 4, 8, 10], 5), C([100, 112, 256, 349, 770], [72, 86, 113, 119, 265, 445, 892], 7), C([1], [2], 2), C(sorted(rl(10, 0, 50)), sorted(rl(12, 0, 50)), 9)],
  lambda a, b, k: sorted(a + b)[k - 1], "Binary search how many elements to take from the smaller array, like median of two sorted arrays.", ["Divide and Conquer"])

Q(BS, "row-with-max-ones", "Row with Maximum Ones", "Easy", "rowWithMax1s(mat: int[][]) -> int",
  "Each row of the binary matrix is sorted (0s then 1s). Return the index of the row with the most 1s (the first such row), or -1 if there are no 1s.",
  [C([[0, 1, 1, 1], [0, 0, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0]]), C([[0, 0], [1, 1]]), C([[0, 0], [0, 0]]), C([[0, 1], [0, 1]])],
  lambda m: -1 if not any(map(sum, m)) else max(range(len(m)), key=lambda i: (sum(m[i]), -i)), "Count 1s per row with lower bound of 1, or walk a staircase from the top-right.", ["Matrix"])

Q(BS, "search-2d-matrix", "Search a 2D Matrix", "Medium", "searchMatrix(matrix: int[][], target: int) -> boolean",
  "Rows are sorted, and each row's first value is greater than the previous row's last. Return true if target is in the matrix, in O(log(m * n)).",
  [C([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3), C([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13), C([[1]], 1), C([[1, 3]], 2)],
  lambda m, t: any(t in r for r in m), "Treat it as one sorted array of m * n: index i is matrix[i / n][i % n].", ["Matrix"])

Q(BS, "search-2d-matrix-ii", "Search a 2D Matrix II", "Medium", "searchMatrix(matrix: int[][], target: int) -> boolean",
  "Each row is sorted left to right and each column top to bottom. Return true if target is in the matrix.",
  [C([[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 5), C([[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 20), C([[-5]], -5), C([[1, 1]], 2)],
  lambda m, t: any(t in r for r in m), "Start at the top-right corner: go left if it's too big, down if too small.", ["Matrix", "Two Pointers"])

Q(BS, "median-row-sorted-matrix", "Median in a Row-wise Sorted Matrix", "Hard", "median(matrix: int[][]) -> int",
  "Each row of the matrix is sorted and the total number of elements is odd. Return the median, without flattening and sorting everything.",
  [C([[1, 3, 5], [2, 6, 9], [3, 6, 9]]), C([[1], [2], [3]]), C([[1, 3, 8]]), C([[1, 1, 2], [2, 3, 3], [1, 4, 9]])],
  lambda m: sorted(x for r in m for x in r)[len(m) * len(m[0]) // 2], "Binary search the value: count elements <= mid with upper bound in each row.", ["Matrix"])

Q(BS, "next-greatest-letter", "Find Smallest Letter Greater Than Target", "Easy", "nextGreatestLetter(letters: String, target: String) -> String",
  "letters is a sorted string of lowercase letters; target is one letter. Return the smallest letter in letters that is strictly greater than target, wrapping around to the first letter if there is none.",
  [C("cfj", "a"), C("cfj", "c"), C("xxyy", "z"), C("eeeeffff", "e")], lambda s, t: next((c for c in s if c > t), s[0]), "Upper bound on the target; wrap to index 0 at the end.", ["Strings"])


def _parts(a, cap):
    parts, cur = 1, 0
    for x in a:
        if cur + x > cap:
            parts, cur = parts + 1, 0
        cur += x
    return parts


def _cows(s, d):
    n, last = 1, s[0]
    for x in s[1:]:
        if x - last >= d:
            n, last = n + 1, x
    return n
