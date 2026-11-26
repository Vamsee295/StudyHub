# Sorting: custom orders, intervals and sort-then-scan (LeetCode classics, NeetCode intervals).
SO = "Sorting"

Q(SO, "relative-sort-array", "Relative Sort Array", "Easy", "relativeSortArray(arr1: int[], arr2: int[]) -> int[]",
  "arr2 has distinct values, all present in arr1. Sort arr1 so values appear in arr2's order; values not in arr2 go at the end in ascending order.",
  [C([2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19], [2, 1, 4, 3, 9, 6]), C([28, 6, 22, 8, 44, 17], [22, 28, 8, 6]), C([5, 1], [1]), C([3, 3, 1], [3, 1])],
  lambda a, b: sorted(a, key=lambda x: (b.index(x), 0) if x in b else (len(b), x)), "Count each value, emit arr2's values in order, then the rest ascending (counting sort works).", ["Hash Map"])

Q(SO, "sort-by-frequency-asc", "Sort Array by Increasing Frequency", "Easy", "frequencySort(nums: int[]) -> int[]",
  "Sort nums by how often each value occurs, least frequent first. Values with the same frequency go in decreasing order.",
  [C([1, 1, 2, 2, 2, 3]), C([2, 3, 1, 3, 2]), C([-1, 1, -6, 4, 5, -6, 1, 4, 1]), C(rl(20, 0, 6))],
  lambda a: sorted(a, key=lambda x: (Counter(a)[x], -x)), "Count, then sort with the comparator (count asc, value desc).", ["Hash Map"])

Q(SO, "largest-number", "Largest Number", "Medium", "largestNumber(nums: int[]) -> String",
  "Arrange the non-negative integers in nums to form the largest possible number and return it as a string (no leading zeros, so [0, 0] gives \"0\").",
  [C([10, 2]), C([3, 30, 34, 5, 9]), C([0, 0]), C([1]), C([432, 43243])],
  lambda a: str(int("".join(sorted(map(str, a), key=__import__("functools").cmp_to_key(lambda x, y: (y + x > x + y) - (y + x < x + y)))))),
  "Compare two numbers as strings: put a before b if a + b > b + a.", ["Strings", "Greedy"])

Q(SO, "h-index", "H-Index", "Medium", "hIndex(citations: int[]) -> int",
  "citations[i] is the citations of paper i. The h-index is the largest h such that at least h papers have at least h citations each. Return it.",
  [C([3, 0, 6, 1, 5]), C([1, 3, 1]), C([0]), C([100]), C(rl(20, 0, 30))],
  lambda c: max(h for h in range(len(c) + 1) if sum(x >= h for x in c) >= h), "Sort descending; h is the last position i (1-based) with citations >= i.", ["Arrays"])

Q(SO, "meeting-rooms", "Meeting Rooms", "Easy", "canAttendMeetings(intervals: int[][]) -> boolean",
  "Given meeting time intervals [start, end), return true if one person can attend all of them (no two overlap; one ending at t and another starting at t is fine).",
  [C([[0, 30], [5, 10], [15, 20]]), C([[7, 10], [2, 4]]), C([]), C([[1, 5], [5, 8]])],
  lambda iv: all(a[1] <= b[0] for a, b in zip(sorted(iv), sorted(iv)[1:])), "Sort by start; any meeting starting before the previous one ends is a clash.", ["Intervals"])

Q(SO, "meeting-rooms-ii", "Meeting Rooms II", "Medium", "minMeetingRooms(intervals: int[][]) -> int",
  "Given meeting intervals [start, end), return the minimum number of rooms needed so no two meetings in a room overlap.",
  [C([[0, 30], [5, 10], [15, 20]]), C([[7, 10], [2, 4]]), C([[1, 5], [5, 8], [2, 6], [6, 9]]), C([[1, 2]])],
  lambda iv: max(sum(s <= t < e for s, e in iv) for t in range(0, 1001)) if iv else 0,
  "Sort starts and ends separately and sweep: a start before the earliest end needs a new room. Or a min-heap of end times.", ["Intervals", "Heap"])

Q(SO, "non-overlapping-intervals", "Non-overlapping Intervals", "Medium", "eraseOverlapIntervals(intervals: int[][]) -> int",
  "Return the minimum number of intervals to remove so the rest don't overlap. Touching intervals like [1,2] and [2,3] don't overlap.",
  [C([[1, 2], [2, 3], [3, 4], [1, 3]]), C([[1, 2], [1, 2], [1, 2]]), C([[1, 2], [2, 3]]), C([[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]])],
  lambda iv: len(iv) - _max_keep(iv), "Sort by end and greedily keep each interval that starts after the last kept one ends.", ["Intervals", "Greedy"])

Q(SO, "insert-interval", "Insert Interval", "Medium", "insert(intervals: int[][], newInterval: int[]) -> int[][]",
  "intervals is sorted and non-overlapping. Insert newInterval, merging where needed, and return the sorted non-overlapping result.",
  [C([[1, 3], [6, 9]], [2, 5]), C([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]), C([], [5, 7]), C([[1, 5]], [6, 8])],
  lambda iv, nw: _merge_all(iv + [nw]), "Copy intervals ending before it, merge the overlapping ones into it, copy the rest.", ["Intervals"])

Q(SO, "sort-the-people", "Sort the People", "Easy", "sortPeople(names: String[], heights: int[]) -> String[]",
  "heights are distinct. Return the names sorted by height, tallest first.",
  [C(["Mary", "John", "Emma"], [180, 165, 170]), C(["Alice", "Bob", "Bob"], [155, 185, 150]), C(["A"], [1])],
  lambda n, h: [x for _, x in sorted(zip(h, n), reverse=True)], "Sort indices by height descending, then map to names.", ["Strings"])

Q(SO, "maximum-gap", "Maximum Gap", "Medium", "maximumGap(nums: int[]) -> int",
  "Return the largest difference between two successive elements of nums in sorted order, or 0 if nums has fewer than two elements. Try to do it in linear time.",
  [C([3, 6, 9, 1]), C([10]), C([1, 10000000]), C(rl(30, 0, 1000))], lambda a: max((b - x for x, b in zip(sorted(a), sorted(a)[1:])), default=0),
  "Sorting works in O(n log n). Linear: bucket by (max - min) / (n - 1); the gap is between buckets.", ["Bucket Sort"])

Q(SO, "array-partition", "Array Partition", "Easy", "arrayPairSum(nums: int[]) -> int",
  "Group the 2n integers into n pairs to maximise the sum of min(a, b) over all pairs. Return that sum.",
  [C([1, 4, 3, 2]), C([6, 2, 6, 5, 1, 2]), C([1, 1]), C(rl(16, -20, 20))], lambda a: sum(sorted(a)[::2]), "Sort and pair neighbours: take every other element.", ["Greedy"])

Q(SO, "minimum-absolute-difference", "Minimum Absolute Difference", "Easy", "minimumAbsDifference(arr: int[]) -> int[][]",
  "arr has distinct integers. Return all pairs [a, b] (a < b) with the minimum absolute difference, in ascending order.",
  [C([4, 2, 1, 3]), C([1, 3, 6, 10, 15]), C([3, 8, -10, 23, 19, -4, -14, 27]), C([5, 9])],
  lambda a: (lambda s, m: [[x, y] for x, y in zip(s, s[1:]) if y - x == m])(sorted(a), min(y - x for x, y in zip(sorted(a), sorted(a)[1:]))),
  "Sort; only adjacent elements can be closest.", ["Arrays"])

Q(SO, "height-checker", "Height Checker", "Easy", "heightChecker(heights: int[]) -> int",
  "Students should stand in non-decreasing order of height. Return how many indices hold the wrong height compared with the sorted order.",
  [C([1, 1, 4, 2, 1, 3]), C([5, 1, 2, 3, 4]), C([1, 2, 3, 4, 5]), C(rl(20, 1, 9))], lambda h: sum(x != y for x, y in zip(h, sorted(h))),
  "Compare with a sorted copy (counting sort since heights are small).", ["Arrays"])

Q(SO, "largest-perimeter-triangle", "Largest Perimeter Triangle", "Easy", "largestPerimeter(nums: int[]) -> int",
  "Return the largest perimeter of a triangle with non-zero area formed from three of the lengths, or 0 if none can be formed.",
  [C([2, 1, 2]), C([1, 2, 1, 10]), C([3, 6, 2, 3]), C(rl(15, 1, 40))],
  lambda a: max((x + y + z for x, y, z in itertools.combinations(sorted(a), 3) if x + y > z), default=0), "Sort descending; the first three consecutive values with a[i] < a[i+1] + a[i+2] win.", ["Greedy", "Math"])

Q(SO, "custom-sort-string", "Custom Sort String", "Medium", "customSortString(order: String, s: String) -> String",
  "order has distinct letters. Permute s so its letters that appear in order follow that order; letters not in order go at the end, in their original relative order.",
  [C("cba", "abcd"), C("bcafg", "abcd"), C("kqep", "pekeq"), C("xyz", "hello")],
  lambda o, s: "".join(sorted([c for c in s if c in o], key=o.index)) + "".join(c for c in s if c not in o),
  "Count letters of s, emit them in order's sequence, then the rest.", ["Hash Map", "Strings"])

Q(SO, "sort-by-parity-ii", "Sort Array by Parity II", "Easy", "sortArrayByParityII(nums: int[]) -> int[]",
  "Half of nums is even and half odd. Put evens at even indices and odds at odd indices, keeping each group's original order.",
  [C([4, 2, 5, 7]), C([2, 3]), C([3, 1, 4, 2]), C([1, 3, 5, 2, 4, 6])],
  lambda a: [x for p in zip([v for v in a if v % 2 == 0], [v for v in a if v % 2]) for x in p], "Two write pointers: one for even slots, one for odd slots.", ["Two Pointers"])

Q(SO, "rank-transform", "Rank Transform of an Array", "Easy", "arrayRankTransform(arr: int[]) -> int[]",
  "Replace each element by its rank: the smallest value gets 1, equal values share a rank, and ranks are consecutive.",
  [C([40, 10, 20, 30]), C([100, 100, 100]), C([37, 12, 28, 9, 100, 56, 80, 5, 12]), C([])],
  lambda a: [sorted(set(a)).index(x) + 1 for x in a], "Sort distinct values and map each to its position + 1.", ["Hash Map"])

Q(SO, "smaller-than-current", "How Many Numbers Are Smaller Than the Current Number", "Easy", "smallerNumbersThanCurrent(nums: int[]) -> int[]",
  "For each nums[i], count how many values in nums are strictly smaller.",
  [C([8, 1, 2, 2, 3]), C([6, 5, 4, 8]), C([7, 7, 7, 7]), C(rl(20, 0, 100))], lambda a: [sum(y < x for y in a) for x in a],
  "Sort a copy; the first index of each value is its answer (or counting sort since values are small).", ["Hash Map"])

Q(SO, "reorder-log-files", "Reorder Data in Log Files", "Medium", "reorderLogFiles(logs: String[]) -> String[]",
  "Each log is an identifier followed by words. Letter-logs (words are letters) come first, sorted by content then identifier; digit-logs (words are digits) follow in their original order.",
  [C(["dig1 8 1 5 1", "let1 art can", "dig2 3 6", "let2 own kit dig", "let3 art zero"]), C(["a1 9 2 3 1", "g1 act car", "zo4 4 7", "ab1 off key dog", "a8 act zoo"])],
  lambda logs: sorted([l for l in logs if l.split(" ", 1)[1][0].isalpha()], key=lambda l: (l.split(" ", 1)[1], l.split(" ", 1)[0])) + [l for l in logs if l.split(" ", 1)[1][0].isdigit()],
  "Split off the identifier; sort letter-logs with the key (content, id) and append digit-logs as they were.", ["Strings"], visible=1)

Q(SO, "max-product-three", "Maximum Product of Three Numbers", "Easy", "maximumProduct(nums: int[]) -> int",
  "Return the maximum product of three numbers in nums.",
  [C([1, 2, 3]), C([1, 2, 3, 4]), C([-1, -2, -3]), C([-100, -98, -1, 2, 3, 4]), C(rl(20, -30, 30))],
  lambda a: max(math.prod(c) for c in itertools.combinations(a, 3)), "After sorting: max(three largest, two smallest x largest).", ["Math"])

Q(SO, "min-moves-equal-ii", "Minimum Moves to Equal Array Elements II", "Medium", "minMoves2(nums: int[]) -> int",
  "A move increments or decrements one element by 1. Return the minimum moves to make all elements equal.",
  [C([1, 2, 3]), C([1, 10, 2, 9]), C([5]), C(rl(25, -50, 50))], lambda a: sum(abs(x - sorted(a)[len(a) // 2]) for x in a),
  "Everything should move to the median.", ["Math"])

Q(SO, "count-smaller-after-self", "Count of Smaller Numbers After Self", "Hard", "countSmaller(nums: int[]) -> int[]",
  "Return counts where counts[i] is how many elements to the right of nums[i] are smaller than it.",
  [C([5, 2, 6, 1]), C([-1]), C([-1, -1]), C(rl(30, -20, 20))], lambda a: [sum(y < x for y in a[i + 1:]) for i, x in enumerate(a)],
  "Merge sort with indices: while merging, count how many right-half elements jumped ahead of each left element.", ["Divide and Conquer", "Binary Indexed Tree"])

Q(SO, "car-fleet", "Car Fleet", "Medium", "carFleet(target: int, position: int[], speed: int[]) -> int",
  "Cars drive toward target on a one-lane road; a car can't pass the one ahead but can catch up and then travel together as a fleet. Return how many fleets arrive at target.",
  [C(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]), C(10, [3], [3]), C(100, [0, 2, 4], [4, 2, 1]), C(10, [6, 8], [3, 2])], lambda t, p, s: _fleets(t, p, s),
  "Sort by position descending and compare arrival times; a slower car ahead absorbs those behind it.", ["Stack", "Monotonic Stack"])

Q(SO, "sort-matrix-diagonally", "Sort the Matrix Diagonally", "Medium", "diagonalSort(mat: int[][]) -> int[][]",
  "Sort every top-left to bottom-right diagonal of mat in ascending order and return the matrix.",
  [C([[3, 3, 1, 1], [2, 2, 1, 2], [1, 1, 1, 2]]), C([[11, 25, 66, 1, 69, 7], [23, 55, 17, 45, 15, 52], [75, 31, 36, 44, 58, 8], [22, 27, 33, 25, 68, 4], [84, 28, 14, 11, 5, 50]]), C([[5]])],
  lambda m: _diag_sort(m), "Cells on one diagonal share r - c. Collect, sort and write back per diagonal.", ["Matrix"])

Q(SO, "sort-by-bits", "Sort Integers by the Number of 1 Bits", "Easy", "sortByBits(arr: int[]) -> int[]",
  "Sort arr by the number of 1 bits in each value, and by value when the counts are equal.",
  [C([0, 1, 2, 3, 4, 5, 6, 7, 8]), C([1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1]), C([10, 100, 1000, 10000]), C(rl(15, 0, 64))],
  lambda a: sorted(a, key=lambda x: (bin(x).count("1"), x)), "Comparator on (bitCount, value).", ["Bit Manipulation"])


def _max_keep(iv):
    keep, end = 0, -10**9
    for s, e in sorted(iv, key=lambda x: x[1]):
        if s >= end:
            keep, end = keep + 1, e
    return keep


def _merge_all(iv):
    out = []
    for s, e in sorted(iv):
        if out and s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out


def _fleets(t, p, s):
    fleets, slowest = 0, 0.0
    for pos, sp in sorted(zip(p, s), reverse=True):
        time = (t - pos) / sp
        if time > slowest:
            fleets, slowest = fleets + 1, time
    return fleets


def _diag_sort(m):
    m = [r[:] for r in m]
    diags = defaultdict(list)
    for r in range(len(m)):
        for c in range(len(m[0])):
            diags[r - c].append(m[r][c])
    for v in diags.values():
        v.sort(reverse=True)
    for r in range(len(m)):
        for c in range(len(m[0])):
            m[r][c] = diags[r - c].pop()
    return m
