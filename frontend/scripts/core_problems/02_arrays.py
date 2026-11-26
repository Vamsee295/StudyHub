# Arrays (Striver A2Z arrays step, Blind 75, LeetCode classics).
A = "Arrays"

Q(A, "check-sorted", "Check if Array Is Sorted", "Easy", "isSorted(nums: int[]) -> boolean",
  "Return true if nums is sorted in non-decreasing order.",
  [C([1, 2, 2, 5]), C([3, 1, 2]), C([7]), C([5, 5, 5]), C([1, 3, 2, 4])], lambda a: a == sorted(a),
  "Compare each element with the one before it.")

Q(A, "linear-search", "Linear Search", "Easy", "search(nums: int[], target: int) -> int",
  "Return the index of the first occurrence of target in nums, or -1 if it isn't there.",
  [C([4, 2, 7, 2], 2), C([1, 2, 3], 5), C([9], 9), C(rl(20, 0, 9), 7), C([], 1)], lambda a, t: a.index(t) if t in a else -1,
  "Scan from the left and stop at the first match.")

Q(A, "left-rotate-one", "Left Rotate by One", "Easy", "rotateLeft(nums: int[]) -> int[]",
  "Move every element one place to the left; the first element goes to the end. Return the array.",
  [C([1, 2, 3, 4, 5]), C([7]), C([3, 9]), C(rl(10))], lambda a: a[1:] + a[:1],
  "Save nums[0], shift the rest left, put the saved value last.")

Q(A, "union-sorted", "Union of Two Sorted Arrays", "Easy", "findUnion(a: int[], b: int[]) -> int[]",
  "Given two sorted arrays, return their union: every distinct value from either array, in increasing order.",
  [C([1, 2, 3, 4, 5], [2, 3, 4, 4, 5]), C([1, 1, 2], [3, 3]), C([], [4]), C(sorted(rl(10, 0, 9)), sorted(rl(10, 0, 9)))],
  lambda a, b: sorted(set(a) | set(b)), "Two pointers like merge, skipping a value equal to the last one written.", ["Two Pointers"])

Q(A, "intersection-sorted", "Intersection of Two Sorted Arrays", "Easy", "intersection(a: int[], b: int[]) -> int[]",
  "Given two sorted arrays, return the distinct values that appear in both, in increasing order.",
  [C([1, 2, 2, 3, 4], [2, 2, 4, 6]), C([1, 3], [2, 4]), C([5], [5]), C(sorted(rl(12, 0, 9)), sorted(rl(12, 0, 9)))],
  lambda a, b: sorted(set(a) & set(b)), "Advance the pointer at the smaller value; on a match, record it once and advance both.", ["Two Pointers"])

Q(A, "rearrange-by-sign", "Rearrange Array Elements by Sign", "Medium", "rearrangeArray(nums: int[]) -> int[]",
  "nums has an equal number of positive and negative integers. Return an arrangement that alternates positive, negative, positive, ... starting with a positive, keeping the original order within each sign.",
  [C([3, 1, -2, -5, 2, -4]), C([-1, 1]), C([1, 2, -3, -4]), C([-5, 4, -3, 2, -1, 6])],
  lambda a: [x for pair in zip([v for v in a if v > 0], [v for v in a if v < 0]) for x in pair],
  "Write positives to even indices and negatives to odd indices of a result array.")

Q(A, "next-permutation", "Next Permutation", "Medium", "nextPermutation(nums: int[]) -> int[]",
  "Rearrange nums into the next lexicographically greater permutation and return it. If it's the largest permutation, return the smallest one (sorted ascending).",
  [C([1, 2, 3]), C([3, 2, 1]), C([1, 1, 5]), C([1, 3, 2]), C([2, 3, 1, 3, 3])], lambda a: _next_perm(a),
  "From the right, find the first i with nums[i] < nums[i+1]; swap it with the smallest larger value to its right; reverse the suffix.")

Q(A, "leaders", "Leaders in an Array", "Easy", "leaders(nums: int[]) -> int[]",
  "An element is a leader if it is strictly greater than every element to its right. The last element is always a leader. Return all leaders in their original order.",
  [C([16, 17, 4, 3, 5, 2]), C([1, 2, 3]), C([5]), C([7, 7, 3]), C(rl(15, 0, 30))],
  lambda a: [a[i] for i in range(len(a)) if all(a[i] > x for x in a[i + 1:])],
  "Scan from the right keeping the maximum seen; collect values above it, then reverse.")

Q(A, "majority-element-ii", "Majority Element II", "Medium", "majorityElement(nums: int[]) -> int[]",
  "Return every value that appears more than n / 3 times in nums, in increasing order.",
  [C([3, 2, 3]), C([1]), C([1, 2]), C([2, 2, 1, 1, 1, 2, 2]), C([4, 4, 5, 5, 6, 6, 4, 5])],
  lambda a: sorted(v for v, c in Counter(a).items() if c > len(a) // 3), "At most two such values exist: extended Boyer-Moore with two candidates.", ["Hash Map"])

Q(A, "four-sum", "4Sum", "Medium", "fourSum(nums: int[], target: int) -> int[][]",
  "Return all unique quadruplets [a, b, c, d] of values from nums (distinct indices) that add up to target. Each quadruplet is sorted ascending, and the list is in lexicographic order.",
  [C([1, 0, -1, 0, -2, 2], 0), C([2, 2, 2, 2, 2], 8), C([1, 2, 3], 6), C([-3, -1, 0, 2, 4, 5], 2)],
  lambda a, t: [list(q) for q in sorted({tuple(sorted(c)) for c in itertools.combinations(a, 4) if sum(c) == t})],
  "Sort, fix two indices with loops, then two pointers for the rest; skip duplicates at every level.", ["Two Pointers", "Sorting"])

Q(A, "maximum-product-subarray", "Maximum Product Subarray", "Medium", "maxProduct(nums: int[]) -> int",
  "Return the largest product of any contiguous non-empty subarray of nums.",
  [C([2, 3, -2, 4]), C([-2, 0, -1]), C([-2, 3, -4]), C([0, 2]), C(rl(12, -4, 4))],
  lambda a: max(math.prod(a[i:j]) for i in range(len(a)) for j in range(i + 1, len(a) + 1)),
  "Track both the max and the min product ending here: a negative number swaps them.", ["Dynamic Programming"])

Q(A, "repeating-and-missing", "Find the Repeating and Missing Number", "Medium", "findTwo(nums: int[]) -> int[]",
  "nums has n numbers from 1..n where exactly one value appears twice and one value is missing. Return [repeating, missing].",
  [C([3, 1, 3]), C([1, 2, 2, 4]), C([2, 2]), C([4, 3, 6, 2, 1, 1])],
  lambda a: [next(v for v, c in Counter(a).items() if c == 2), next(v for v in range(1, len(a) + 1) if v not in a)],
  "Use the sum and the sum of squares of 1..n, or a frequency array.", ["Math", "Hash Map"])

Q(A, "count-inversions", "Count Inversions", "Medium", "countInversions(nums: int[]) -> int",
  "An inversion is a pair i < j with nums[i] > nums[j]. Return how many inversions nums has. Aim for O(n log n).",
  [C([5, 3, 2, 4, 1]), C([1, 2, 3]), C([3, 2, 1]), C([2, 4, 1, 3, 5]), C(rl(40, 0, 100))],
  lambda a: sum(a[i] > a[j] for i in range(len(a)) for j in range(i + 1, len(a))),
  "Merge sort: when you take from the right half, every remaining element on the left forms an inversion.", ["Sorting", "Divide and Conquer"])

Q(A, "reverse-pairs", "Reverse Pairs", "Hard", "reversePairs(nums: int[]) -> int",
  "Return how many pairs i < j satisfy nums[i] > 2 * nums[j].",
  [C([1, 3, 2, 3, 1]), C([2, 4, 3, 5, 1]), C([5]), C([-5, -5]), C(rl(40, -100, 100))],
  lambda a: sum(a[i] > 2 * a[j] for i in range(len(a)) for j in range(i + 1, len(a))),
  "Merge sort again: before merging two sorted halves, count pairs with a moving pointer. Use long for 2 * nums[j].", ["Sorting", "Divide and Conquer"])

Q(A, "find-duplicate-number", "Find the Duplicate Number", "Medium", "findDuplicate(nums: int[]) -> int",
  "nums has n + 1 integers in [1, n]; exactly one value repeats (possibly several times). Return it without modifying the array and with O(1) extra space.",
  [C([1, 3, 4, 2, 2]), C([3, 1, 3, 4, 2]), C([1, 1]), C([2, 2, 2, 2]), C([5, 1, 4, 3, 2, 5])],
  lambda a: Counter(a).most_common(1)[0][0], "Treat i -> nums[i] as a linked list; Floyd's cycle detection finds the entrance.", ["Two Pointers"])

Q(A, "third-maximum", "Third Maximum Number", "Easy", "thirdMax(nums: int[]) -> int",
  "Return the third largest distinct value in nums. If there are fewer than three distinct values, return the largest.",
  [C([3, 2, 1]), C([1, 2]), C([2, 2, 3, 1]), C([5, 5, 5]), C(rl(20))],
  lambda a: sorted(set(a))[-3] if len(set(a)) >= 3 else max(a), "Keep three variables for the top three distinct values.")

Q(A, "plus-one", "Plus One", "Easy", "plusOne(digits: int[]) -> int[]",
  "digits holds a non-negative integer, most significant digit first. Add one and return the resulting digits.",
  [C([1, 2, 3]), C([4, 3, 2, 1]), C([9]), C([9, 9, 9]), C([1, 0, 9])], lambda d: [int(c) for c in str(int("".join(map(str, d))) + 1)],
  "Walk from the end: a 9 becomes 0 and carries; anything else increments and stops. All 9s grow by a leading 1.", ["Math"])

Q(A, "find-disappeared-numbers", "Find All Numbers Disappeared in an Array", "Easy", "findDisappearedNumbers(nums: int[]) -> int[]",
  "nums has n integers, each in [1, n]. Return every value in [1, n] that does not appear, in increasing order.",
  [C([4, 3, 2, 7, 8, 2, 3, 1]), C([1, 1]), C([1, 2, 3]), C([2, 2, 2, 2])], lambda a: [v for v in range(1, len(a) + 1) if v not in set(a)],
  "Mark presence in place by negating nums[value - 1]; positives left over are the missing ones.")

Q(A, "array-sign", "Sign of the Product of an Array", "Easy", "arraySign(nums: int[]) -> int",
  "Return 1 if the product of all values in nums is positive, -1 if negative, and 0 if it is zero. Don't compute the product.",
  [C([-1, -2, -3, -4, 3, 2, 1]), C([1, 5, 0, 2, -3]), C([-1, 1, -1, 1, -1]), C([7])],
  lambda a: 0 if 0 in a else (-1) ** sum(x < 0 for x in a), "Only zeros and the count of negatives matter.", ["Math"])

Q(A, "check-sorted-rotated", "Check if Array Is Sorted and Rotated", "Easy", "check(nums: int[]) -> boolean",
  "Return true if nums could be a non-decreasing array rotated some number of positions (including zero).",
  [C([3, 4, 5, 1, 2]), C([2, 1, 3, 4]), C([1, 2, 3]), C([1, 1, 1]), C([2, 1])],
  lambda a: sum(a[i] > a[(i + 1) % len(a)] for i in range(len(a))) <= 1, "Count the places where nums[i] > nums[(i + 1) % n]; at most one is allowed.")


def _next_perm(a):
    a = a[:]
    i = len(a) - 2
    while i >= 0 and a[i] >= a[i + 1]:
        i -= 1
    if i >= 0:
        j = len(a) - 1
        while a[j] <= a[i]:
            j -= 1
        a[i], a[j] = a[j], a[i]
    a[i + 1:] = reversed(a[i + 1:])
    return a
