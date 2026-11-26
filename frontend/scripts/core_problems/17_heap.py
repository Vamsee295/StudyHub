# Heaps / priority queues (Striver A2Z heaps step, NeetCode heap).
HP = "Heap"

Q(HP, "kth-largest-stream", "Kth Largest Element in a Stream", "Easy", "kthLargestStream(k: int, nums: int[], adds: int[]) -> int[]",
  "Start with nums. After each value in adds is added to the stream, record the k-th largest value so far. Return those records. (There are always at least k values after each add.)",
  [C(3, [4, 5, 8, 2], [3, 5, 10, 9, 4]), C(1, [], [-3, -2, -4, 0, 4]), C(2, [0], [-1, 1, -2, -4, 3]), C(4, rl(6), rl(8))],
  lambda k, nums, adds: [sorted(nums + adds[:i + 1])[-k] for i in range(len(adds))], "Keep a min-heap of size k; its top is the k-th largest.", ["Priority Queue", "Design"])

Q(HP, "kth-smallest-element", "Kth Smallest Element", "Easy", "kthSmallest(nums: int[], k: int) -> int",
  "Return the k-th smallest value of nums (1-based), using a heap rather than a full sort.",
  [C([7, 10, 4, 3, 20, 15], 3), C([7, 10, 4, 20, 15], 4), C([1], 1), C(rl(30), 12)], lambda a, k: sorted(a)[k - 1], "A max-heap of size k holds the k smallest; its top is the answer.", ["Priority Queue"])

Q(HP, "merge-k-sorted-arrays", "Merge K Sorted Arrays", "Medium", "mergeKArrays(arrays: int[][]) -> int[]",
  "Each row is sorted ascending. Return one sorted array with every element.",
  [C([[1, 4, 5], [1, 3, 4], [2, 6]]), C([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), C([[], [1]]), C([sorted(rl(5)) for _ in range(4)])], lambda arrs: sorted(x for r in arrs for x in r),
  "Push the first element of each row as (value, row, index); pop the smallest and push its row's next element.", ["Priority Queue", "Divide and Conquer"])

Q(HP, "sort-k-sorted", "Sort a Nearly Sorted Array", "Medium", "nearlySorted(nums: int[], k: int) -> int[]",
  "Every element is at most k positions away from its sorted position. Sort nums in O(n log k).",
  [C([6, 5, 3, 2, 8, 10, 9], 3), C([1, 4, 5, 2, 3, 6, 7, 8, 9, 10], 2), C([3], 0), C([2, 1, 4, 3, 6, 5], 1)], lambda a, k: sorted(a),
  "Keep a min-heap of the next k + 1 elements; pop the minimum each step.", ["Priority Queue", "Sorting"])

Q(HP, "connect-ropes", "Minimum Cost to Connect Ropes", "Medium", "minCost(ropes: int[]) -> int",
  "Connecting two ropes of lengths a and b costs a + b and gives a rope of length a + b. Return the minimum total cost to connect all ropes into one.",
  [C([4, 3, 2, 6]), C([4, 2, 7, 6, 9]), C([10]), C(rl(15, 1, 30))], lambda r: _ropes(r), "Always connect the two shortest ropes (Huffman style).", ["Priority Queue", "Greedy"])

Q(HP, "running-median", "Find Median from Data Stream", "Hard", "runningMedian(nums: int[]) -> int[]",
  "Values (all non-negative) arrive one by one. After each arrival, record the median of the values so far, rounded down when it's the average of two middle values. Return the records.",
  [C([5, 15, 1, 3]), C([5, 10, 15]), C([1, 2, 3, 4, 5, 6]), C(rl(15, 0, 100))],
  lambda a: [(lambda s: s[len(s) // 2] if len(s) % 2 else (s[len(s) // 2 - 1] + s[len(s) // 2]) // 2)(sorted(a[:i + 1])) for i in range(len(a))],
  "Two heaps: a max-heap for the lower half and a min-heap for the upper half, balanced in size.", ["Priority Queue", "Design"])

Q(HP, "top-k-frequent-words", "Top K Frequent Words", "Medium", "topKFrequent(words: String[], k: int) -> String[]",
  "Return the k most frequent words, most frequent first. Words with the same frequency go in lexicographic order.",
  [C(["i", "love", "leetcode", "i", "love", "coding"], 2), C(["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4), C(["a"], 1), C(["b", "a", "c", "b", "a"], 3)],
  lambda w, k: [x for x, _ in sorted(Counter(w).items(), key=lambda kv: (-kv[1], kv[0]))[:k]], "Count, then select with a heap ordered by (count desc, word asc).", ["Hash Map", "Priority Queue", "Strings"])

Q(HP, "kth-smallest-sorted-matrix", "Kth Smallest Element in a Sorted Matrix", "Medium", "kthSmallest(matrix: int[][], k: int) -> int",
  "Each row and column of the n x n matrix is sorted ascending. Return the k-th smallest element.",
  [C([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8), C([[-5]], 1), C([[1, 2], [1, 3]], 2), C([[1, 3, 5], [6, 7, 12], [11, 14, 14]], 6)], lambda m, k: sorted(x for r in m for x in r)[k - 1],
  "Min-heap seeded with the first column, popping k times; or binary search on the value.", ["Priority Queue", "Binary Search", "Matrix"])

Q(HP, "k-smallest-pairs", "Find K Pairs with Smallest Sums", "Medium", "kSmallestPairs(nums1: int[], nums2: int[], k: int) -> int[][]",
  "nums1 and nums2 are sorted. Return the k pairs [u, v] (u from nums1, v from nums2) with the smallest sums, ordered by sum, then by u, then by v.",
  [C([1, 7, 11], [2, 4, 6], 3), C([1, 1, 2], [1, 2, 3], 2), C([1, 2], [3], 3), C(sorted(rl(5, 0, 20)), sorted(rl(5, 0, 20)), 6)],
  lambda a, b, k: [list(p) for p in sorted(((u, v) for u in a for v in b), key=lambda p: (p[0] + p[1], p[0], p[1]))[:k]],
  "Heap of (sum, i, j) seeded with (i, 0) for each i; when popping (i, j), push (i, j + 1).", ["Priority Queue"])

Q(HP, "furthest-building", "Furthest Building You Can Reach", "Medium", "furthestBuilding(heights: int[], bricks: int, ladders: int) -> int",
  "Moving from building i to i + 1 is free if it's not taller; otherwise climb with bricks (one per unit of height difference) or one ladder. Return the furthest building index you can reach.",
  [C([4, 2, 7, 6, 9, 14, 12], 5, 1), C([4, 12, 2, 7, 3, 18, 20, 3, 19], 10, 2), C([14, 3, 19, 3], 17, 0), C([1, 5, 1, 2, 3, 4, 10000], 4, 1)], lambda h, b, l: _furthest(h, b, l),
  "Use ladders on the largest climbs: keep a min-heap of climbs and pay bricks for the smallest when it overflows ladders.", ["Priority Queue", "Greedy"])

Q(HP, "max-performance-team", "Maximum Performance of a Team", "Hard", "maxPerformance(n: int, speed: int[], efficiency: int[], k: int) -> int",
  "Pick at most k of the n engineers. A team's performance is (sum of speeds) x (minimum efficiency). Return the maximum performance modulo 1,000,000,007.",
  [C(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 2), C(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 3), C(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 4), C(1, [5], [3], 1)],
  lambda n, s, e, k: _perf(s, e, k), "Sort by efficiency descending; keep a min-heap of the k largest speeds so far.", ["Priority Queue", "Greedy", "Sorting"])

Q(HP, "ipo", "IPO", "Hard", "findMaximizedCapital(k: int, w: int, profits: int[], capital: int[]) -> int",
  "You start with capital w and may finish at most k projects. Project i needs capital[i] to start and adds profits[i] to your capital. Return the maximum final capital.",
  [C(2, 0, [1, 2, 3], [0, 1, 1]), C(3, 0, [1, 2, 3], [0, 1, 2]), C(1, 0, [1], [1]), C(2, 5, [4, 7, 1, 9], [6, 9, 1, 20])], lambda k, w, p, c: _ipo(k, w, p, c),
  "Sort projects by capital; unlock affordable ones into a max-heap of profits and take the best each round.", ["Priority Queue", "Greedy", "Sorting"])

Q(HP, "single-threaded-cpu", "Single-Threaded CPU", "Medium", "getOrder(tasks: int[][]) -> int[]",
  "tasks[i] = [enqueueTime, processingTime]. When idle, the CPU picks the available task with the shortest processing time (smallest index on ties) and runs it to completion. Return the order of task indices.",
  [C([[1, 2], [2, 4], [3, 2], [4, 1]]), C([[7, 10], [7, 12], [7, 5], [7, 4], [7, 2]]), C([[5, 2]]), C([[1, 1], [10, 2], [10, 1]])], lambda t: _cpu(t),
  "Sort by enqueue time; a heap of (processing, index) holds the available tasks; jump the clock when idle.", ["Priority Queue", "Sorting", "Simulation"])

Q(HP, "smallest-range-k-lists", "Smallest Range Covering Elements from K Lists", "Hard", "smallestRange(nums: int[][]) -> int[]",
  "Each list is sorted. Return the smallest range [a, b] that includes at least one number from every list. Smaller b - a wins; on a tie, the smaller a wins.",
  [C([[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]]), C([[1, 2, 3], [1, 2, 3], [1, 2, 3]]), C([[1], [5]]), C([[10, 10], [11, 11]])], lambda L: _smallest_range(L),
  "Heap of the current element of each list; track the max; advance the list holding the min.", ["Priority Queue", "Sliding Window"])

Q(HP, "remove-stones-min-total", "Remove Stones to Minimize the Total", "Medium", "minStoneSum(piles: int[], k: int) -> int",
  "k times, choose a pile and remove floor(pile / 2) stones from it (the same pile may be chosen again). Return the minimum total stones left.",
  [C([5, 4, 9], 2), C([4, 3, 6, 7], 3), C([1], 5), C(rl(15, 1, 100), 10)], lambda p, k: _halve_piles(p, k), "Always halve the largest pile: max-heap.", ["Priority Queue", "Greedy"])

Q(HP, "gifts-from-richest", "Take Gifts From the Richest Pile", "Easy", "pickGifts(gifts: int[], k: int) -> int",
  "Each second for k seconds, take the largest pile and leave floor(sqrt(pile)) gifts in it. Return the gifts left in total.",
  [C([25, 64, 9, 4, 100], 4), C([1, 1, 1, 1], 4), C([10], 2), C(rl(10, 1, 1000), 6)], lambda g, k: _gifts(g, k), "Max-heap; pop, push isqrt.", ["Priority Queue", "Simulation"])

Q(HP, "min-cost-hire-workers", "Minimum Cost to Hire K Workers", "Hard", "mincostToHireWorkers(quality: int[], wage: int[], k: int) -> double",
  "Hire exactly k workers. Each is paid in proportion to quality relative to the others in the group, and at least their minimum wage. Return the least total pay.",
  [C([10, 20, 5], [70, 50, 30], 2), C([3, 1, 10, 10, 1], [4, 8, 2, 2, 7], 3), C([4], [8], 1), C([2, 5, 3], [10, 15, 9], 2)], lambda q, w, k: round(_hire(q, w, k), 5),
  "Sort by wage/quality ratio; for each ratio as the group's rate, keep the k smallest qualities in a max-heap.", ["Priority Queue", "Greedy", "Sorting"])

Q(HP, "ugly-number-ii", "Ugly Number II", "Medium", "nthUglyNumber(n: int) -> int",
  "Ugly numbers have only 2, 3 and 5 as prime factors (1 is the first). Return the n-th ugly number.",
  [C(10), C(1), C(15), C(150), C(1690)], lambda n: _ugly(n), "Min-heap with a seen set, or three pointers multiplying by 2, 3 and 5.", ["Priority Queue", "Dynamic Programming", "Math"])

Q(HP, "super-ugly-number", "Super Ugly Number", "Medium", "nthSuperUglyNumber(n: int, primes: int[]) -> int",
  "A super ugly number has all prime factors in primes (1 is the first). Return the n-th one.",
  [C(12, [2, 7, 13, 19]), C(1, [2, 3, 5]), C(15, [3, 5, 7]), C(100, [2, 3, 11])], lambda n, ps: _super_ugly(n, ps), "One pointer per prime into the result list, like Ugly Number II.", ["Priority Queue", "Dynamic Programming"])

Q(HP, "max-score-k-ops", "Maximal Score After Applying K Operations", "Medium", "maxKelements(nums: int[], k: int) -> int",
  "k times: pick any index, add nums[i] to your score and replace nums[i] with ceil(nums[i] / 3). Return the maximum score.",
  [C([10, 10, 10, 10, 10], 5), C([1, 10, 3, 3, 3], 3), C([5], 3), C(rl(10, 1, 100), 8)], lambda a, k: _score_k(a, k), "Greedy with a max-heap.", ["Priority Queue", "Greedy"])

Q(HP, "k-max-sum-combinations", "K Maximum Sum Combinations", "Medium", "maxCombinations(a: int[], b: int[], k: int) -> int[]",
  "Return the k largest sums a[i] + b[j] (each pair of indices counts once), largest first.",
  [C([3, 2], [1, 4], 2), C([1, 4, 2, 3], [2, 5, 1, 6], 4), C([5], [5], 1), C(rl(6, 0, 20), rl(6, 0, 20), 5)], lambda a, b, k: sorted((x + y for x in a for y in b), reverse=True)[:k],
  "Sort both descending; a max-heap of (sum, i, j) with a visited set expands (i + 1, j) and (i, j + 1).", ["Priority Queue", "Sorting"])

Q(HP, "relative-ranks", "Relative Ranks", "Easy", "findRelativeRanks(score: int[]) -> String[]",
  "Scores are distinct. The top three get \"Gold Medal\", \"Silver Medal\" and \"Bronze Medal\"; everyone else gets their placement number as a string. Return each athlete's rank in input order.",
  [C([5, 4, 3, 2, 1]), C([10, 3, 8, 9, 4]), C([7]), C([1, 2])], lambda s: [(["Gold Medal", "Silver Medal", "Bronze Medal"] + [str(i) for i in range(4, len(s) + 1)])[sorted(s, reverse=True).index(x)] for x in s],
  "Sort indices by score descending (or use a max-heap) and assign labels.", ["Sorting", "Priority Queue"])

Q(HP, "max-product-k-increments", "Maximum Product After K Increments", "Medium", "maximumProduct(nums: int[], k: int) -> int",
  "k times, increment any element by 1. Return the maximum product of all elements, modulo 1,000,000,007.",
  [C([0, 4], 5), C([6, 3, 3, 2], 2), C([1], 10), C(rl(8, 0, 10), 6)], lambda a, k: _max_prod_k(a, k), "Always increment the smallest element: min-heap.", ["Priority Queue", "Greedy"])

Q(HP, "halve-array-sum", "Minimum Operations to Halve Array Sum", "Medium", "halveArray(nums: int[]) -> int",
  "An operation halves any one number (it can become a fraction). Return the minimum operations to reduce the array's sum by at least half.",
  [C([5, 19, 8, 1]), C([3, 8, 20]), C([1]), C(rl(10, 1, 100))], lambda a: _halve_sum(a), "Halve the current largest value each time (max-heap of doubles).", ["Priority Queue", "Greedy"])

Q(HP, "total-cost-hire-k", "Total Cost to Hire K Workers", "Medium", "totalCost(costs: int[], k: int, candidates: int) -> int",
  "Hire k workers in k rounds. Each round, pick the cheapest worker among the first `candidates` and last `candidates` remaining workers (smallest index on ties); they leave the line. Return the total cost.",
  [C([17, 12, 10, 2, 7, 2, 11, 20, 8], 3, 4), C([1, 2, 4, 1], 3, 3), C([5], 1, 1), C([31, 25, 72, 79, 74, 65, 84, 91, 18, 59, 27, 9, 81, 33, 17, 58], 11, 2)], lambda c, k, cand: _hire_k(c, k, cand),
  "Two min-heaps for the left and right candidate windows, refilled from the middle.", ["Priority Queue", "Two Pointers", "Simulation"])

Q(HP, "course-schedule-iii", "Course Schedule III", "Hard", "scheduleCourse(courses: int[][]) -> int",
  "courses[i] = [duration, lastDay]. Courses are taken one at a time starting on day 1 and must finish by lastDay. Return the maximum number of courses you can take.",
  [C([[100, 200], [200, 1300], [1000, 1250], [2000, 3200]]), C([[1, 2]]), C([[3, 2], [4, 3]]), C([[5, 5], [4, 6], [2, 6]])], lambda c: _sched3(c),
  "Sort by deadline; add each course, and if time overflows drop the longest course taken (max-heap).", ["Priority Queue", "Greedy", "Sorting"])


def _ropes(r):
    h = r[:]
    heapq.heapify(h)
    cost = 0
    while len(h) > 1:
        s = heapq.heappop(h) + heapq.heappop(h)
        cost += s
        heapq.heappush(h, s)
    return cost


def _furthest(h, b, l):
    heap = []
    for i in range(len(h) - 1):
        d = h[i + 1] - h[i]
        if d > 0:
            heapq.heappush(heap, d)
            if len(heap) > l:
                b -= heapq.heappop(heap)
                if b < 0:
                    return i
    return len(h) - 1


def _perf(s, e, k):
    best, total, heap = 0, 0, []
    for eff, sp in sorted(zip(e, s), reverse=True):
        heapq.heappush(heap, sp)
        total += sp
        if len(heap) > k:
            total -= heapq.heappop(heap)
        best = max(best, total * eff)
    return best % (10**9 + 7)


def _ipo(k, w, p, c):
    proj, heap, i = sorted(zip(c, p)), [], 0
    for _ in range(k):
        while i < len(proj) and proj[i][0] <= w:
            heapq.heappush(heap, -proj[i][1])
            i += 1
        if not heap:
            break
        w -= heapq.heappop(heap)
    return w


def _cpu(tasks):
    order = sorted(range(len(tasks)), key=lambda i: tasks[i][0])
    out, heap, t, i = [], [], 0, 0
    while len(out) < len(tasks):
        if not heap and t < tasks[order[i]][0]:
            t = tasks[order[i]][0]
        while i < len(order) and tasks[order[i]][0] <= t:
            heapq.heappush(heap, (tasks[order[i]][1], order[i]))
            i += 1
        d, idx = heapq.heappop(heap)
        t += d
        out.append(idx)
    return out


def _smallest_range(L):
    heap = [(r[0], i, 0) for i, r in enumerate(L)]
    heapq.heapify(heap)
    mx = max(r[0] for r in L)
    best = [heap[0][0], mx]
    while True:
        v, i, j = heapq.heappop(heap)
        if mx - v < best[1] - best[0] or (mx - v == best[1] - best[0] and v < best[0]):
            best = [v, mx]
        if j + 1 == len(L[i]):
            return best
        nv = L[i][j + 1]
        mx = max(mx, nv)
        heapq.heappush(heap, (nv, i, j + 1))


def _halve_piles(p, k):
    h = [-x for x in p]
    heapq.heapify(h)
    for _ in range(k):
        x = -heapq.heappop(h)
        heapq.heappush(h, -(x - x // 2))
    return -sum(h)


def _gifts(g, k):
    h = [-x for x in g]
    heapq.heapify(h)
    for _ in range(k):
        heapq.heappush(h, -math.isqrt(-heapq.heappop(h)))
    return -sum(h)


def _hire(q, w, k):
    best, total, heap = float("inf"), 0, []
    for ratio, qi in sorted((wi / qi, qi) for qi, wi in zip(q, w)):
        heapq.heappush(heap, -qi)
        total += qi
        if len(heap) > k:
            total += heapq.heappop(heap)
        if len(heap) == k:
            best = min(best, ratio * total)
    return best


def _ugly(n):
    u, i2, i3, i5 = [1], 0, 0, 0
    while len(u) < n:
        nxt = min(u[i2] * 2, u[i3] * 3, u[i5] * 5)
        u.append(nxt)
        i2 += u[i2] * 2 == nxt
        i3 += u[i3] * 3 == nxt
        i5 += u[i5] * 5 == nxt
    return u[n - 1]


def _super_ugly(n, ps):
    u, idx = [1], [0] * len(ps)
    while len(u) < n:
        nxt = min(u[idx[j]] * p for j, p in enumerate(ps))
        u.append(nxt)
        for j, p in enumerate(ps):
            if u[idx[j]] * p == nxt:
                idx[j] += 1
    return u[n - 1]


def _score_k(a, k):
    h = [-x for x in a]
    heapq.heapify(h)
    s = 0
    for _ in range(k):
        x = -heapq.heappop(h)
        s += x
        heapq.heappush(h, -(-(-x // 3)))
    return s


def _max_prod_k(a, k):
    h = a[:]
    heapq.heapify(h)
    for _ in range(k):
        heapq.heappush(h, heapq.heappop(h) + 1)
    return reduce(lambda x, y: x * y % (10**9 + 7), h, 1)


def _halve_sum(a):
    h = [-float(x) for x in a]
    heapq.heapify(h)
    target, ops, cut = sum(a) / 2, 0, 0.0
    while cut < target:
        x = -heapq.heappop(h)
        cut += x / 2
        heapq.heappush(h, -x / 2)
        ops += 1
    return ops


def _hire_k(c, k, cand):
    left, right = [], []
    i, j = 0, len(c) - 1
    total = 0
    for _ in range(k):
        while len(left) < cand and i <= j:
            heapq.heappush(left, (c[i], i))
            i += 1
        while len(right) < cand and i <= j:
            heapq.heappush(right, (c[j], j))
            j -= 1
        if right and (not left or right[0] < left[0]):
            total += heapq.heappop(right)[0]
        else:
            total += heapq.heappop(left)[0]
    return total


def _sched3(c):
    t, heap = 0, []
    for d, last in sorted(c, key=lambda x: x[1]):
        t += d
        heapq.heappush(heap, -d)
        if t > last:
            t += heapq.heappop(heap)
    return len(heap)
