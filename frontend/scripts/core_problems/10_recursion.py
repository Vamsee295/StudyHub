# Recursion (Striver A2Z recursion basics + "Strivers recursion", LeetCode classics). Backtracking has its own section.
R = "Recursion"

Q(R, "print-1-to-n", "Numbers 1 to N with Recursion", "Easy", "oneToN(n: int) -> int[]",
  "Return [1, 2, ..., n] built with recursion (no loops).",
  [C(5), C(1), C(0), C(12)], lambda n: list(range(1, n + 1)), "Solve n - 1 first, then append n.")

Q(R, "print-n-to-1", "Numbers N to 1 with Recursion", "Easy", "nToOne(n: int) -> int[]",
  "Return [n, n - 1, ..., 1] built with recursion (no loops).",
  [C(5), C(1), C(0), C(9)], lambda n: list(range(n, 0, -1)), "Put n first, then recurse on n - 1.")

Q(R, "reverse-array-recursive", "Reverse an Array with Recursion", "Easy", "reverse(nums: int[]) -> int[]",
  "Reverse nums using recursion: swap the ends, then recurse on the inside.",
  [C([1, 2, 3, 4, 5]), C([7]), C([]), C(rl(10))], lambda a: a[::-1], "reverse(l, r): swap nums[l], nums[r], then reverse(l + 1, r - 1); stop when l >= r.", ["Arrays", "Two Pointers"])

Q(R, "palindrome-recursive", "Check Palindrome with Recursion", "Easy", "isPalindrome(s: String) -> boolean",
  "Return true if s reads the same forwards and backwards (exact characters), using recursion.",
  [C("madam"), C("hello"), C(""), C("abba"), C("ab")], lambda s: s == s[::-1], "Compare s[i] with s[n - 1 - i] and recurse on i + 1 until the middle.", ["Strings"])

Q(R, "count-good-numbers", "Count Good Numbers", "Medium", "countGoodNumbers(n: int) -> int",
  "A digit string is good if digits at even indices are even (0,2,4,6,8) and digits at odd indices are prime (2,3,5,7). Return how many good digit strings of length n exist, modulo 1,000,000,007.",
  [C(1), C(4), C(50), C(806166225)], lambda n: pow(5, (n + 1) // 2, 10**9 + 7) * pow(4, n // 2, 10**9 + 7) % (10**9 + 7),
  "Answer = 5^ceil(n/2) * 4^floor(n/2). Write fast power recursively: x^n = (x^(n/2))^2 (times x if n is odd). Use long.", ["Math"])

Q(R, "sort-stack-recursive", "Sort a Stack with Recursion", "Medium", "sortStack(stack: int[]) -> int[]",
  "stack is given bottom to top. Sort it so the smallest value is at the bottom, using only recursion and push/pop (no loops, no extra data structure). Return it bottom to top.",
  [C([41, 3, 32, 2, 11]), C([3, 2, 1]), C([5]), C(rl(10))], lambda a: sorted(a),
  "Pop the top, sort the rest recursively, then insert the popped value into its place recursively.", ["Stack"])

Q(R, "reverse-stack-recursive", "Reverse a Stack with Recursion", "Medium", "reverseStack(stack: int[]) -> int[]",
  "stack is given bottom to top. Reverse it using only recursion and push/pop. Return it bottom to top.",
  [C([4, 1, 3, 2]), C([1, 2]), C([9]), C(rl(8))], lambda a: a[::-1], "Pop the top, reverse the rest, then insert the popped value at the bottom (another recursion).", ["Stack"])

Q(R, "tower-of-hanoi", "Tower of Hanoi", "Medium", "hanoi(n: int) -> int[][]",
  "Move n disks from rod 1 to rod 3 using rod 2, one disk at a time, never placing a larger disk on a smaller one. Return the moves as [from, to] pairs in order (the standard minimal sequence).",
  [C(1), C(2), C(3), C(4)], lambda n: _hanoi(n, 1, 3, 2), "Move n - 1 disks to the helper rod, move the largest, then move n - 1 disks on top of it.")

Q(R, "pascal-row", "Pascal's Triangle Row", "Easy", "getRow(rowIndex: int) -> int[]",
  "Return row rowIndex (0-based) of Pascal's triangle.",
  [C(3), C(0), C(1), C(10), C(20)], lambda r: [math.comb(r, k) for k in range(r + 1)], "Build each row from the previous one, or use C(r, k) = C(r, k - 1) * (r - k + 1) / k.", ["Math", "Dynamic Programming"])

Q(R, "kth-symbol-grammar", "K-th Symbol in Grammar", "Medium", "kthGrammar(n: int, k: int) -> int",
  "Row 1 is \"0\". Each next row replaces 0 with 01 and 1 with 10. Return the k-th (1-based) symbol of row n.",
  [C(1, 1), C(2, 1), C(2, 2), C(4, 5), C(30, 417219134)], lambda n, k: bin(k - 1).count("1") % 2,
  "Symbol k of row n comes from symbol ceil(k/2) of row n - 1, flipped if k is even.", ["Math", "Bit Manipulation"])

Q(R, "find-the-winner", "Find the Winner of the Circular Game", "Medium", "findTheWinner(n: int, k: int) -> int",
  "n friends sit in a circle numbered 1..n. Counting k clockwise (including the current friend) removes that friend; counting continues from the next one. Return the winner.",
  [C(5, 2), C(6, 5), C(1, 1), C(7, 3), C(500, 7)], lambda n, k: reduce(lambda w, m: (w + k) % m, range(2, n + 1), 0) + 1,
  "Josephus: J(1) = 0, J(n) = (J(n - 1) + k) % n (0-based).", ["Math", "Queue"])

Q(R, "decode-string", "Decode String", "Medium", "decodeString(s: String) -> String",
  "Decode s where k[encoded] means encoded repeated k times. Brackets may nest.",
  [C("3[a]2[bc]"), C("3[a2[c]]"), C("2[abc]3[cd]ef"), C("abc"), C("10[x]")], lambda s: _decode(s),
  "Recursively decode the inside of each bracket, or use a stack of (count, built-so-far).", ["Stack", "Strings"])

Q(R, "binary-strings-no-consecutive-ones", "Binary Strings Without Consecutive 1s", "Medium", "generate(n: int) -> String[]",
  "Return every binary string of length n with no two adjacent 1s, in lexicographic order.",
  [C(3), C(1), C(2), C(4)], lambda n: sorted(s for s in map("".join, itertools.product("01", repeat=n)) if "11" not in s),
  "Recurse adding '0' always and '1' only if the last character isn't '1'. Adding '0' first keeps the order.", ["Strings", "Backtracking"])

Q(R, "steps-to-zero", "Number of Steps to Reduce a Number to Zero", "Easy", "numberOfSteps(num: int) -> int",
  "If num is even, divide it by 2; otherwise subtract 1. Return how many steps until it reaches 0.",
  [C(14), C(8), C(123), C(0), C(1000000)], lambda n: _steps(n), "steps(n) = 0 if n == 0, else 1 + steps(n / 2 or n - 1).", ["Math", "Bit Manipulation"])

Q(R, "gray-code", "Gray Code", "Medium", "grayCode(n: int) -> int[]",
  "Return the standard n-bit reflected Gray code sequence starting at 0 (2^n values, consecutive values differ in one bit).",
  [C(1), C(2), C(3), C(4)], lambda n: [i ^ (i >> 1) for i in range(1 << n)], "gray(n) = gray(n - 1) followed by gray(n - 1) reversed with the top bit set.", ["Bit Manipulation", "Math"])

Q(R, "different-ways-parentheses", "Different Ways to Add Parentheses", "Medium", "diffWaysToCompute(expression: String) -> int[]",
  "expression has numbers and the operators +, - and *. Return every result you can get by adding parentheses in all possible ways, sorted ascending (duplicates kept).",
  [C("2-1-1"), C("2*3-4*5"), C("11"), C("1+2*3")], lambda e: sorted(_ways(e)), "Split at each operator, recurse on both sides, combine every pair of results.", ["Divide and Conquer", "Dynamic Programming"])

Q(R, "elimination-game", "Elimination Game", "Medium", "lastRemaining(n: int) -> int",
  "Start with 1..n. Remove every other number from left to right starting with the first, then every other from right to left, alternating until one number is left. Return it.",
  [C(9), C(1), C(2), C(100), C(1000000)], lambda n: _elim(n), "Track the head, the step and the count; the head moves when going left-to-right or when the count is odd.", ["Math"])

Q(R, "count-and-say", "Count and Say", "Medium", "countAndSay(n: int) -> String",
  "countAndSay(1) = \"1\"; countAndSay(n) reads countAndSay(n - 1) aloud as runs: \"21\" is one 2 then one 1, so the next term is \"1211\". Return the n-th term.",
  [C(1), C(4), C(5), C(10)], lambda n: reduce(lambda s, _: "".join(f"{len(list(g))}{k}" for k, g in itertools.groupby(s)), range(n - 1), "1"),
  "Recursively build term n - 1, then encode its runs.", ["Strings"])

Q(R, "subset-xor-sum", "Sum of All Subset XOR Totals", "Easy", "subsetXORSum(nums: int[]) -> int",
  "Return the sum of the XOR of every subset of nums (the empty subset's XOR is 0).",
  [C([1, 3]), C([5, 1, 6]), C([3, 4, 5, 6, 7, 8]), C([7])],
  lambda a: sum(reduce(lambda x, y: x ^ y, c, 0) for r in range(len(a) + 1) for c in itertools.combinations(a, r)),
  "Recurse with (index, xorSoFar): include or skip nums[index].", ["Bit Manipulation", "Backtracking"])

Q(R, "predict-the-winner", "Predict the Winner", "Medium", "predictTheWinner(nums: int[]) -> boolean",
  "Two players alternately take a number from either end of nums, player 1 first, both playing optimally. Return true if player 1's total is at least player 2's.",
  [C([1, 5, 2]), C([1, 5, 233, 7]), C([7]), C([2, 4, 55, 6, 8]), C(rl(10, 0, 30))], lambda a: _best(tuple(a)) >= 0,
  "best(l, r) = max(nums[l] - best(l + 1, r), nums[r] - best(l, r - 1)): your lead over the opponent.", ["Dynamic Programming", "Game Theory"])

Q(R, "integer-replacement", "Integer Replacement", "Medium", "integerReplacement(n: int) -> int",
  "If n is even, replace it with n / 2; if odd, with n + 1 or n - 1. Return the fewest replacements to reach 1.",
  [C(8), C(7), C(4), C(1), C(65535), C(2147483647)], lambda n: _intrep(n), "Recurse on both choices for odd n with memoisation (use long for n + 1).", ["Math", "Dynamic Programming"])

Q(R, "remove-all-occurrences", "Remove All Occurrences of a Substring", "Medium", "removeOccurrences(s: String, part: String) -> String",
  "Repeatedly remove the leftmost occurrence of part from s until none remains. Return the result.",
  [C("daabcbaabcbc", "abc"), C("axxxxyyyyb", "xy"), C("aaa", "b"), C("abcabc", "abc")], lambda s, p: _remove_all(s, p),
  "Remove the first match and recurse, or build with a stack and check its end.", ["Strings", "Stack"])

Q(R, "strobogrammatic-ii", "Strobogrammatic Number II", "Medium", "findStrobogrammatic(n: int) -> String[]",
  "A strobogrammatic number looks the same rotated 180 degrees (0, 1, 8 map to themselves; 6 and 9 swap). Return all of length n without leading zeros (except \"0\" itself), sorted.",
  [C(1), C(2), C(3), C(4)], lambda n: sorted(_strobo(n, n)), "Build from the middle out: wrap each length n - 2 answer with the pairs 00, 11, 69, 88, 96 (no 00 on the outermost layer).", ["Strings", "Math"])

Q(R, "recursive-digit-sum", "Super Digit", "Medium", "superDigit(n: String, k: int) -> int",
  "Concatenate the digit string n k times to get p. The super digit of a number is itself if it has one digit, otherwise the super digit of the sum of its digits. Return the super digit of p.",
  [C("148", 3), C("9875", 4), C("123", 3), C("7", 100000)], lambda n, k: (lambda s: 9 if s % 9 == 0 else s % 9)(sum(map(int, n)) * k),
  "Sum n's digits once and multiply by k, then recurse on the digit sum of that number.", ["Math"])

Q(R, "unique-digit-numbers", "Count Numbers with Unique Digits", "Medium", "countNumbersWithUniqueDigits(n: int) -> int",
  "Return how many integers x with 0 <= x < 10^n have no repeated digit.",
  [C(2), C(0), C(1), C(3), C(8)], lambda n: sum(1 for x in range(10 ** min(n, 6)) if len(set(str(x))) == len(str(x))) if n <= 6 else [1, 10, 91, 739, 5275, 32491, 168571, 712891, 2345851][n],
  "count(k digits) = 9 * 9 * 8 * ... (k factors); add them up for k = 1..n plus 1 for zero.", ["Math", "Dynamic Programming"])


def _hanoi(n, a, c, b):
    return [] if n == 0 else _hanoi(n - 1, a, b, c) + [[a, c]] + _hanoi(n - 1, b, c, a)


def _decode(s):
    stack, cur, num = [], "", 0
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == "[":
            stack.append((cur, num))
            cur, num = "", 0
        elif ch == "]":
            prev, k = stack.pop()
            cur = prev + cur * k
        else:
            cur += ch
    return cur


def _steps(n):
    return 0 if n == 0 else 1 + _steps(n // 2 if n % 2 == 0 else n - 1)


def _ways(e):
    if e.isdigit():
        return [int(e)]
    out = []
    for i, ch in enumerate(e):
        if ch in "+-*":
            for x in _ways(e[:i]):
                for y in _ways(e[i + 1:]):
                    out.append(x + y if ch == "+" else x - y if ch == "-" else x * y)
    return out


def _elim(n):
    head, step, left = 1, 1, True
    while n > 1:
        if left or n % 2:
            head += step
        n //= 2
        step *= 2
        left = not left
    return head


@lru_cache(None)
def _best(t):
    if len(t) == 1:
        return t[0]
    return max(t[0] - _best(t[1:]), t[-1] - _best(t[:-1]))


@lru_cache(None)
def _intrep(n):
    if n == 1:
        return 0
    if n % 2 == 0:
        return 1 + _intrep(n // 2)
    return 1 + min(_intrep(n + 1), _intrep(n - 1))


def _remove_all(s, p):
    while p in s:
        s = s.replace(p, "", 1)
    return s


def _strobo(n, total):
    if n == 0:
        return [""]
    if n == 1:
        return ["0", "1", "8"]
    out = []
    for mid in _strobo(n - 2, total):
        for a, b in (("0", "0"), ("1", "1"), ("6", "9"), ("8", "8"), ("9", "6")):
            if n == total and a == "0":
                continue
            out.append(a + mid + b)
    return out
