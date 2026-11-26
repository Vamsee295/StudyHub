# Greedy (Striver A2Z greedy step, NeetCode greedy, LeetCode classics).
G = "Greedy"

Q(G, "lemonade-change", "Lemonade Change", "Easy", "lemonadeChange(bills: int[]) -> boolean",
  "Each lemonade costs $5. Customers pay with $5, $10 or $20 bills in order, and you start with no change. Return true if you can give everyone correct change.",
  [C([5, 5, 5, 10, 20]), C([5, 5, 10, 10, 20]), C([5]), C([10]), C([5, 5, 10, 20, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 5, 5, 20, 5, 20, 5])], lambda b: _lemonade(b),
  "Track $5 and $10 counts; for $20 prefer giving one $10 + one $5.", ["Arrays"])

Q(G, "jump-game-ii", "Jump Game II", "Medium", "jump(nums: int[]) -> int",
  "nums[i] is the maximum jump from index i. Return the minimum number of jumps to reach the last index (it's always reachable).",
  [C([2, 3, 1, 1, 4]), C([2, 3, 0, 1, 4]), C([0]), C([1, 1, 1, 1]), C([5, 9, 3, 2, 1, 0, 2, 3, 3, 1, 0, 0])], lambda a: _jumps(a),
  "BFS by levels: track the end of the current jump's reach and the farthest next reach.", ["Arrays", "Dynamic Programming"])

Q(G, "gas-station", "Gas Station", "Medium", "canCompleteCircuit(gas: int[], cost: int[]) -> int",
  "Station i has gas[i]; driving to the next station costs cost[i]. Return the starting index to travel the circle once, or -1. The answer is unique if it exists.",
  [C([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]), C([2, 3, 4], [3, 4, 3]), C([5], [4]), C([3, 1, 1], [1, 2, 2])], lambda g, c: _gas(g, c),
  "If total gas >= total cost an answer exists; restart the candidate after any point where the tank goes negative.", ["Arrays"])

Q(G, "candy", "Candy", "Hard", "candy(ratings: int[]) -> int",
  "Each child gets at least one candy, and a child with a higher rating than a neighbour gets more candy than that neighbour. Return the minimum total.",
  [C([1, 0, 2]), C([1, 2, 2]), C([5]), C([1, 3, 4, 5, 2]), C(rl(20, 0, 9))], lambda r: _candy(r),
  "Left-to-right pass for left neighbours, right-to-left pass for right neighbours, take the max per child.", ["Arrays"])

Q(G, "partition-labels", "Partition Labels", "Medium", "partitionLabels(s: String) -> int[]",
  "Split s into as many parts as possible so each letter appears in at most one part. Return the sizes of the parts in order.",
  [C("ababcbacadefegdehijhklij"), C("eccbbbbdec"), C("a"), C("abc")], lambda s: _labels(s),
  "Record each letter's last index; cut when the current index equals the furthest last index seen.", ["Hash Map", "Two Pointers"])

Q(G, "min-arrows-balloons", "Minimum Number of Arrows to Burst Balloons", "Medium", "findMinArrowShots(points: int[][]) -> int",
  "Balloons span [xstart, xend] horizontally. An arrow shot at x bursts every balloon with xstart <= x <= xend. Return the minimum arrows to burst all.",
  [C([[10, 16], [2, 8], [1, 6], [7, 12]]), C([[1, 2], [3, 4], [5, 6], [7, 8]]), C([[1, 2], [2, 3], [3, 4], [4, 5]]), C([[1, 5]])], lambda p: _arrows(p),
  "Sort by end; shoot at the first end and skip every balloon that starts by then.", ["Sorting", "Intervals"])

Q(G, "valid-parenthesis-string", "Valid Parenthesis String", "Medium", "checkValidString(s: String) -> boolean",
  "s has '(', ')' and '*'. A '*' can be '(', ')' or empty. Return true if s can be valid.",
  [C("()"), C("(*)"), C("(*))"), C(")("), C("(((((*(()((((*((**(((()()*)()()()*((((**)())*)*)))))))(())(()))())((*()()(((()((()*(())*(()**)()(())")], lambda s: _valid_star(s),
  "Track the range [low, high] of possible open counts; fail if high < 0, clamp low at 0, valid if low == 0 at the end.", ["Strings", "Stack"])

Q(G, "task-scheduler", "Task Scheduler", "Medium", "leastInterval(tasks: String, n: int) -> int",
  "tasks is a string of uppercase letters (one per task). Equal tasks must be at least n intervals apart; idle intervals are allowed. Return the fewest intervals to finish all tasks.",
  [C("AAABBB", 2), C("ACABDB", 1), C("AAABBB", 3), C("AAAAAABCDEFG", 2), C("A", 5)],
  lambda t, n: max(len(t), (max(Counter(t).values()) - 1) * (n + 1) + list(Counter(t).values()).count(max(Counter(t).values()))),
  "Frame around the most frequent task: (maxCount - 1) * (n + 1) + number of tasks with maxCount, at least len(tasks).", ["Hash Map", "Heap"])

Q(G, "maximum-units-truck", "Maximum Units on a Truck", "Easy", "maximumUnits(boxTypes: int[][], truckSize: int) -> int",
  "boxTypes[i] = [numberOfBoxes, unitsPerBox]. The truck carries at most truckSize boxes. Return the maximum total units.",
  [C([[1, 3], [2, 2], [3, 1]], 4), C([[5, 10], [2, 5], [4, 7], [3, 9]], 10), C([[1, 1]], 5), C([[2, 1], [4, 4], [3, 1], [4, 1]], 1)], lambda b, t: _units(b, t),
  "Take boxes with the most units first.", ["Sorting"])

Q(G, "maximum-69-number", "Maximum 69 Number", "Easy", "maximum69Number(num: int) -> int",
  "num has only digits 6 and 9. Change at most one digit (6 to 9 or 9 to 6) to get the largest number.",
  [C(9669), C(9996), C(9999), C(6)], lambda n: int(str(n).replace("6", "9", 1)), "Turn the first 6 into a 9.", ["Math"])

Q(G, "min-platforms", "Minimum Number of Platforms", "Medium", "findPlatform(arr: int[], dep: int[]) -> int",
  "Train i arrives at arr[i] and departs at dep[i] (HHMM times). A platform can't hold two trains at once; a train arriving at the same minute another departs needs another platform. Return the minimum number of platforms.",
  [C([900, 940, 950, 1100, 1500, 1800], [910, 1200, 1120, 1130, 1900, 2000]), C([900, 1100, 1235], [1000, 1200, 1240]), C([1000], [1030]), C([900, 1000], [1000, 1100])],
  lambda a, d: max(sum(ai <= t <= di for ai, di in zip(a, d)) for t in range(0, 2400)), "Sort arrivals and departures; sweep counting trains present.", ["Sorting", "Two Pointers"])

Q(G, "job-sequencing", "Job Sequencing Problem", "Medium", "jobScheduling(deadline: int[], profit: int[]) -> int[]",
  "Each job takes one unit of time and must finish by its deadline to earn its profit; one job at a time. Return [number of jobs done, maximum profit].",
  [C([4, 1, 1, 1], [20, 10, 40, 30]), C([2, 1, 2, 1, 1], [100, 19, 27, 25, 15]), C([3, 1, 2, 2], [50, 10, 20, 30]), C([1], [5])], lambda d, p: _jobs(d, p),
  "Sort by profit descending; put each job in the latest free slot at or before its deadline.", ["Sorting"])

Q(G, "fractional-knapsack", "Fractional Knapsack", "Medium", "fractionalKnapsack(val: int[], wt: int[], capacity: int) -> double",
  "Items have values and weights; you may take fractions of an item. Return the maximum total value that fits in capacity.",
  [C([60, 100, 120], [10, 20, 30], 50), C([60, 100], [10, 20], 50), C([10, 20, 30], [5, 10, 15], 100), C([500], [30], 10)], lambda v, w, c: _frac(v, w, c),
  "Take items by value/weight ratio, the last one possibly partly.", ["Sorting"])

Q(G, "min-coins-greedy", "Minimum Coins (Indian Currency)", "Easy", "minCoins(amount: int) -> int[]",
  "Using denominations 2000, 500, 200, 100, 50, 20, 10, 5, 2 and 1, return the coins/notes that make amount with the fewest pieces, largest first.",
  [C(43), C(1000), C(0), C(2789)], lambda n: _coins(n), "Greedy works because these denominations are canonical: always take the largest that fits.")

Q(G, "shortest-job-first", "Shortest Job First (Average Waiting Time)", "Easy", "averageWaitTime(bt: int[]) -> int",
  "All processes arrive at time 0 with burst times bt. Run them shortest first and return the average waiting time, rounded down.",
  [C([4, 3, 7, 1, 2]), C([1, 2, 3, 4]), C([5]), C(rl(10, 1, 20))], lambda bt: sum(itertools.accumulate(sorted(bt)[:-1])) // len(bt),
  "Sort; each job waits for the sum of all shorter jobs before it.", ["Sorting"])

Q(G, "two-city-scheduling", "Two City Scheduling", "Medium", "twoCitySchedCost(costs: int[][]) -> int",
  "2n people; costs[i] = [costA, costB] to fly person i to city A or B. Exactly n go to each city. Return the minimum total cost.",
  [C([[10, 20], [30, 200], [400, 50], [30, 20]]), C([[259, 770], [448, 54], [926, 667], [184, 139], [840, 118], [577, 469]]), C([[1, 2], [3, 1]])],
  lambda c: (lambda s: sum(a for a, b in s[: len(c) // 2]) + sum(b for a, b in s[len(c) // 2:]))(sorted(c, key=lambda x: x[0] - x[1])),
  "Sort by costA - costB; send the first half to A.", ["Sorting"])

Q(G, "hand-of-straights", "Hand of Straights", "Medium", "isNStraightHand(hand: int[], groupSize: int) -> boolean",
  "Return true if the cards can be split into groups of groupSize consecutive values.",
  [C([1, 2, 3, 6, 2, 3, 4, 7, 8], 3), C([1, 2, 3, 4, 5], 4), C([1], 1), C([8, 10, 12], 3), C([1, 1, 2, 2, 3, 3], 3)], lambda h, g: _straights(h, g),
  "Take the smallest remaining card and try to build its whole group; a sorted map of counts makes this easy.", ["Hash Map", "Sorting"])

Q(G, "merge-triplets", "Merge Triplets to Form Target Triplet", "Medium", "mergeTriplets(triplets: int[][], target: int[]) -> boolean",
  "Merging two triplets takes the element-wise max. Return true if merging some of the triplets can produce exactly target.",
  [C([[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]), C([[3, 4, 5], [4, 5, 6]], [3, 2, 5]), C([[2, 5, 3], [2, 3, 4], [1, 2, 5], [5, 2, 3]], [5, 5, 5]), C([[1, 1, 1]], [1, 1, 1])],
  lambda ts, t: (lambda ok: [max((x[i] for x in ok), default=-1) for i in range(3)] == t)([x for x in ts if all(x[i] <= t[i] for i in range(3))]),
  "Ignore triplets exceeding target anywhere; the rest can be merged freely, so check they reach every target value.", ["Arrays"])

Q(G, "remove-covered-intervals", "Remove Covered Intervals", "Medium", "removeCoveredIntervals(intervals: int[][]) -> int",
  "Remove every interval covered by another ([a, b] is covered by [c, d] if c <= a and b <= d). Return how many intervals remain.",
  [C([[1, 4], [3, 6], [2, 8]]), C([[1, 4], [2, 3]]), C([[1, 2]]), C([[3, 10], [4, 10], [5, 11]])],
  lambda iv: sum(not any(j != i and o[0] <= x[0] and x[1] <= o[1] for j, o in enumerate(iv)) for i, x in enumerate(iv)),
  "Sort by start ascending, end descending; count intervals that extend past the maximum end so far.", ["Sorting", "Intervals"])

Q(G, "min-deletions-unique-freq", "Minimum Deletions to Make Character Frequencies Unique", "Medium", "minDeletions(s: String) -> int",
  "Delete characters so that no two different characters have the same frequency. Return the minimum deletions.",
  [C("aab"), C("aaabbbcc"), C("ceabaacb"), C("abcabc"), C(rs(40, "abcdef"))], lambda s: _uniq_freq(s),
  "Sort frequencies descending; lower each one below the previous (stopping at 0), counting deletions.", ["Hash Map", "Sorting"])

Q(G, "broken-calculator", "Broken Calculator", "Medium", "brokenCalc(startValue: int, target: int) -> int",
  "The calculator can only double the value or subtract 1. Return the fewest operations to turn startValue into target.",
  [C(2, 3), C(5, 8), C(3, 10), C(1024, 1), C(1, 1000000000)], lambda s, t: _broken(s, t), "Work backwards from target: halve it when even, add 1 when odd, until it's <= startValue.", ["Math"])

Q(G, "bag-of-tokens", "Bag of Tokens", "Medium", "bagOfTokensScore(tokens: int[], power: int) -> int",
  "Play a token face up (pay its value in power, gain 1 score) or face down (gain its value in power, lose 1 score). Each token is used at most once. Return the maximum score.",
  [C([100], 50), C([200, 100], 150), C([100, 200, 300, 400], 200), C([71, 55, 82], 54)], lambda t, p: _tokens(t, p),
  "Sort; buy score with the cheapest token, sell score for the most expensive one when stuck.", ["Sorting", "Two Pointers"])

Q(G, "max-ice-cream", "Maximum Ice Cream Bars", "Medium", "maxIceCream(costs: int[], coins: int) -> int",
  "Return the most ice cream bars you can buy with coins.",
  [C([1, 3, 2, 4, 1], 7), C([10, 6, 8, 7, 7, 8], 5), C([1, 6, 3, 1, 2, 5], 20), C(rl(20, 1, 30), 60)],
  lambda c, k: sum(1 for x in itertools.accumulate(sorted(c)) if x <= k), "Buy the cheapest first (counting sort works for small costs).", ["Sorting"])

Q(G, "min-cost-move-chips", "Minimum Cost to Move Chips to The Same Position", "Easy", "minCostToMoveChips(position: int[]) -> int",
  "Moving a chip by 2 is free; moving it by 1 costs 1. Return the minimum cost to move all chips to one position.",
  [C([1, 2, 3]), C([2, 2, 2, 3, 3]), C([1, 1000000000]), C(rl(15, 1, 100))], lambda p: min(sum(x % 2 for x in p), sum(1 - x % 2 for x in p)),
  "Only parity matters: move the smaller parity group.", ["Math"])

Q(G, "monotone-increasing-digits", "Monotone Increasing Digits", "Medium", "monotoneIncreasingDigits(n: int) -> int",
  "Return the largest number <= n whose digits are non-decreasing from left to right.",
  [C(10), C(1234), C(332), C(0), C(120), C(987654321)], lambda n: next(x for x in range(n, -1, -1) if list(str(x)) == sorted(str(x))) if n < 2000 else _monotone(n),
  "Find the first drop, decrement that digit (moving left while it breaks order) and fill the rest with 9s.", ["Math"])

Q(G, "wiggle-subsequence", "Wiggle Subsequence", "Medium", "wiggleMaxLength(nums: int[]) -> int",
  "A wiggle sequence alternates strictly up and down. Return the length of the longest wiggle subsequence of nums.",
  [C([1, 7, 4, 9, 2, 5]), C([1, 17, 5, 10, 13, 15, 10, 5, 16, 8]), C([1, 2, 3, 4, 5, 6, 7, 8, 9]), C([3, 3, 3]), C(rl(20, 0, 9))], lambda a: _wiggle(a),
  "Count direction changes, ignoring equal neighbours.", ["Dynamic Programming"])

Q(G, "reduce-array-half", "Reduce Array Size to The Half", "Medium", "minSetSize(arr: int[]) -> int",
  "Choose a set of values and remove all their occurrences. Return the smallest set size that removes at least half of the array.",
  [C([3, 3, 3, 3, 5, 5, 5, 2, 2, 7]), C([7, 7, 7, 7, 7, 7]), C([1, 9]), C(rl(30, 0, 9))],
  lambda a: next(i + 1 for i, s in enumerate(itertools.accumulate(sorted(Counter(a).values(), reverse=True))) if 2 * s >= len(a)),
  "Remove the most frequent values first.", ["Hash Map", "Sorting", "Heap"])


def _lemonade(b):
    five = ten = 0
    for x in b:
        if x == 5:
            five += 1
        elif x == 10:
            five, ten = five - 1, ten + 1
        elif ten:
            five, ten = five - 1, ten - 1
        else:
            five -= 3
        if five < 0:
            return False
    return True


def _jumps(a):
    jumps = end = far = 0
    for i in range(len(a) - 1):
        far = max(far, i + a[i])
        if i == end:
            jumps, end = jumps + 1, far
    return jumps


def _gas(g, c):
    if sum(g) < sum(c):
        return -1
    start = tank = 0
    for i in range(len(g)):
        tank += g[i] - c[i]
        if tank < 0:
            start, tank = i + 1, 0
    return start


def _candy(r):
    c = [1] * len(r)
    for i in range(1, len(r)):
        if r[i] > r[i - 1]:
            c[i] = c[i - 1] + 1
    for i in range(len(r) - 2, -1, -1):
        if r[i] > r[i + 1]:
            c[i] = max(c[i], c[i + 1] + 1)
    return sum(c)


def _labels(s):
    last = {c: i for i, c in enumerate(s)}
    out, start, end = [], 0, 0
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            out.append(end - start + 1)
            start = i + 1
    return out


def _arrows(p):
    n, end = 0, None
    for s, e in sorted(p, key=lambda x: x[1]):
        if end is None or s > end:
            n, end = n + 1, e
    return n


def _valid_star(s):
    lo = hi = 0
    for c in s:
        lo += 1 if c == "(" else -1
        hi += 1 if c != ")" else -1
        if hi < 0:
            return False
        lo = max(lo, 0)
    return lo == 0


def _units(b, t):
    total = 0
    for n, u in sorted(b, key=lambda x: -x[1]):
        take = min(n, t)
        total, t = total + take * u, t - take
    return total


def _jobs(d, p):
    slots = [False] * (max(d) + 1)
    cnt = prof = 0
    for dd, pp in sorted(zip(d, p), key=lambda x: -x[1]):
        for t in range(dd, 0, -1):
            if not slots[t]:
                slots[t] = True
                cnt, prof = cnt + 1, prof + pp
                break
    return [cnt, prof]


def _frac(v, w, c):
    total = 0.0
    for vi, wi in sorted(zip(v, w), key=lambda x: -x[0] / x[1]):
        take = min(wi, c)
        total += vi * take / wi
        c -= take
        if c == 0:
            break
    return round(total, 6)


def _coins(n):
    out = []
    for d in (2000, 500, 200, 100, 50, 20, 10, 5, 2, 1):
        while n >= d:
            out.append(d)
            n -= d
    return out


def _straights(h, g):
    if len(h) % g:
        return False
    cnt = Counter(h)
    for x in sorted(cnt):
        k = cnt[x]
        if k:
            for y in range(x, x + g):
                if cnt[y] < k:
                    return False
                cnt[y] -= k
    return True


def _uniq_freq(s):
    used, dels = set(), 0
    for f in sorted(Counter(s).values(), reverse=True):
        while f and f in used:
            f, dels = f - 1, dels + 1
        used.add(f)
    return dels


def _broken(s, t):
    ops = 0
    while t > s:
        t = t // 2 if t % 2 == 0 else t + 1
        ops += 1
    return ops + s - t


def _tokens(t, p):
    t = sorted(t)
    i, j, score, best = 0, len(t) - 1, 0, 0
    while i <= j:
        if p >= t[i]:
            p, score, i = p - t[i], score + 1, i + 1
            best = max(best, score)
        elif score:
            p, score, j = p + t[j], score - 1, j - 1
        else:
            break
    return best


def _monotone(n):
    d = list(str(n))
    mark = len(d)
    for i in range(len(d) - 1, 0, -1):
        if d[i] < d[i - 1]:
            d[i - 1] = str(int(d[i - 1]) - 1)
            mark = i
    return int("".join(d[:mark] + ["9"] * (len(d) - mark)))


def _wiggle(a):
    up = down = 1
    for i in range(1, len(a)):
        if a[i] > a[i - 1]:
            up = down + 1
        elif a[i] < a[i - 1]:
            down = up + 1
    return max(up, down) if a else 0
