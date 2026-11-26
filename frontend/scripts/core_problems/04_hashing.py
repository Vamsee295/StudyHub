# Hashing: hash maps and sets (Striver basic hashing, NeetCode arrays & hashing, LeetCode classics).
H = "Hashing"

Q(H, "contains-duplicate-ii", "Contains Duplicate II", "Easy", "containsNearbyDuplicate(nums: int[], k: int) -> boolean",
  "Return true if there are two different indices i and j with nums[i] == nums[j] and |i - j| <= k.",
  [C([1, 2, 3, 1], 3), C([1, 0, 1, 1], 1), C([1, 2, 3, 1, 2, 3], 2), C([5], 0), C(rl(30, 0, 15), 4)],
  lambda a, k: any(a[i] == a[j] for i in range(len(a)) for j in range(i + 1, min(len(a), i + k + 1))),
  "Remember the last index of each value in a map.", ["Hash Map", "Sliding Window"])

Q(H, "ransom-note", "Ransom Note", "Easy", "canConstruct(ransomNote: String, magazine: String) -> boolean",
  "Return true if ransomNote can be built from the letters of magazine, using each magazine letter at most once.",
  [C("a", "b"), C("aa", "ab"), C("aa", "aab"), C("", "x"), C("hello", "ollehxyz")], lambda r, m: not (Counter(r) - Counter(m)),
  "Count the magazine's letters, then spend them on the note.", ["Hash Map", "Strings"])

Q(H, "word-pattern", "Word Pattern", "Easy", "wordPattern(pattern: String, s: String) -> boolean",
  "s is words separated by single spaces. Return true if s follows pattern: a one-to-one match between pattern letters and words.",
  [C("abba", "dog cat cat dog"), C("abba", "dog cat cat fish"), C("aaaa", "dog cat cat dog"), C("abc", "b c a"), C("aaa", "x x x x")],
  lambda p, s: (w := s.split()) is not None and len(w) == len(p) and len(set(p)) == len(set(w)) == len(set(zip(p, w))),
  "Two maps, letter->word and word->letter, must never disagree.", ["Hash Map", "Strings"])

Q(H, "jewels-and-stones", "Jewels and Stones", "Easy", "numJewelsInStones(jewels: String, stones: String) -> int",
  "jewels lists the stone types that are jewels; each character of stones is a stone you have. Return how many of your stones are jewels. Letters are case-sensitive.",
  [C("aA", "aAAbbbb"), C("z", "ZZ"), C("abc", "aabbccd"), C("x", "")], lambda j, s: sum(c in set(j) for c in s),
  "Put jewels in a set and count stones that are in it.", ["Hash Set", "Strings"])

Q(H, "intersection-of-arrays-ii", "Intersection of Two Arrays II", "Easy", "intersect(nums1: int[], nums2: int[]) -> int[]",
  "Return the intersection of the two arrays where each value appears as many times as it shows in both. Return the values in increasing order.",
  [C([1, 2, 2, 1], [2, 2]), C([4, 9, 5], [9, 4, 9, 8, 4]), C([1], [2]), C(rl(15, 0, 6), rl(15, 0, 6))],
  lambda a, b: sorted((Counter(a) & Counter(b)).elements()), "Count one array, then walk the other decrementing counts.", ["Hash Map"])

Q(H, "find-the-difference", "Find the Difference", "Easy", "findTheDifference(s: String, t: String) -> String",
  "t is s shuffled with one extra letter added. Return that letter as a one-character string.",
  [C("abcd", "abcde"), C("", "y"), C("a", "aa"), C("xyz", "zxwy")], lambda s, t: next(iter(Counter(t) - Counter(s))),
  "Count letters, or XOR every character code of both strings.", ["Hash Map", "Bit Manipulation"])

Q(H, "number-of-good-pairs", "Number of Good Pairs", "Easy", "numIdenticalPairs(nums: int[]) -> int",
  "A pair (i, j) is good if nums[i] == nums[j] and i < j. Return the number of good pairs.",
  [C([1, 2, 3, 1, 1, 3]), C([1, 1, 1, 1]), C([1, 2, 3]), C(rl(40, 0, 5))], lambda a: sum(c * (c - 1) // 2 for c in Counter(a).values()),
  "Each value seen c times before adds c new pairs when it appears again.", ["Hash Map", "Math"])

Q(H, "unique-occurrences", "Unique Number of Occurrences", "Easy", "uniqueOccurrences(arr: int[]) -> boolean",
  "Return true if every distinct value in arr occurs a different number of times.",
  [C([1, 2, 2, 1, 1, 3]), C([1, 2]), C([-3, 0, 1, -3, 1, 1, 1, -3, 10, 0]), C([7])],
  lambda a: len(set(Counter(a).values())) == len(Counter(a)), "Count values, then check the counts are distinct with a set.", ["Hash Map"])

Q(H, "degree-of-array", "Degree of an Array", "Easy", "findShortestSubArray(nums: int[]) -> int",
  "The degree of an array is the highest frequency of any value. Return the length of the shortest contiguous subarray with the same degree as nums.",
  [C([1, 2, 2, 3, 1]), C([1, 2, 2, 3, 1, 4, 2]), C([5]), C([1, 1, 2, 2, 2, 1])], lambda a: _degree(a),
  "For each value record its count, first index and last index.", ["Hash Map"])

Q(H, "sum-of-unique", "Sum of Unique Elements", "Easy", "sumOfUnique(nums: int[]) -> int",
  "Return the sum of the values that appear exactly once in nums.",
  [C([1, 2, 3, 2]), C([1, 1, 1, 1]), C([1, 2, 3, 4, 5]), C(rl(30, 0, 20))], lambda a: sum(v for v, c in Counter(a).items() if c == 1),
  "Count, then add values whose count is 1.", ["Hash Map"])

Q(H, "lucky-integer", "Find Lucky Integer in an Array", "Easy", "findLucky(arr: int[]) -> int",
  "A lucky integer's frequency equals its value. Return the largest lucky integer, or -1 if there is none.",
  [C([2, 2, 3, 4]), C([1, 2, 2, 3, 3, 3]), C([2, 2, 2, 3, 3]), C([1])], lambda a: max((v for v, c in Counter(a).items() if v == c), default=-1),
  "Count values and keep the best value equal to its count.", ["Hash Map"])

Q(H, "distribute-candies", "Distribute Candies", "Easy", "distributeCandies(candyType: int[]) -> int",
  "Alice has an even number n of candies, candyType[i] being each candy's type. She may eat n / 2 of them. Return the most different types she can eat.",
  [C([1, 1, 2, 2, 3, 3]), C([1, 1, 2, 3]), C([6, 6, 6, 6]), C(rl(20, 0, 30))], lambda a: min(len(set(a)), len(a) // 2),
  "The answer is limited by both the number of types and n / 2.", ["Hash Set"])

Q(H, "longest-harmonious-subsequence", "Longest Harmonious Subsequence", "Easy", "findLHS(nums: int[]) -> int",
  "A harmonious array has max - min exactly 1. Return the length of the longest harmonious subsequence of nums (0 if none).",
  [C([1, 3, 2, 2, 5, 2, 3, 7]), C([1, 2, 3, 4]), C([1, 1, 1, 1]), C(rl(30, 0, 6))],
  lambda a: max((c + Counter(a)[v + 1] for v, c in Counter(a).items() if v + 1 in Counter(a)), default=0),
  "Count values; for each v with v + 1 present, count[v] + count[v + 1] is a candidate.", ["Hash Map"])

Q(H, "max-balloons", "Maximum Number of Balloons", "Easy", "maxNumberOfBalloons(text: String) -> int",
  "Return how many times you can form the word \"balloon\" using each character of text at most once.",
  [C("nlaebolko"), C("loonbalxballpoon"), C("leetcode"), C("balloonballoonballoon")],
  lambda t: min(Counter(t)[c] // n for c, n in Counter("balloon").items()), "Count letters; l and o are needed twice.", ["Hash Map", "Strings"])

Q(H, "close-strings", "Determine if Two Strings Are Close", "Medium", "closeStrings(word1: String, word2: String) -> boolean",
  "Two strings are close if you can turn one into the other by (1) swapping any two characters, or (2) turning every occurrence of one existing character into another existing character and vice versa. Return whether word1 and word2 are close.",
  [C("abc", "bca"), C("a", "aa"), C("cabbba", "abbccc"), C("uau", "ssx")],
  lambda a, b: set(a) == set(b) and sorted(Counter(a).values()) == sorted(Counter(b).values()),
  "Same set of letters, and the same multiset of counts.", ["Hash Map", "Strings", "Sorting"])

Q(H, "equal-row-column-pairs", "Equal Row and Column Pairs", "Medium", "equalPairs(grid: int[][]) -> int",
  "Return the number of pairs (row i, column j) of the n x n grid where row i and column j contain the same values in the same order.",
  [C([[3, 2, 1], [1, 7, 6], [2, 7, 7]]), C([[3, 1, 2, 2], [1, 4, 4, 5], [2, 4, 2, 2], [2, 4, 2, 2]]), C([[5]]), C([[1, 1], [1, 1]])],
  lambda g: sum(Counter(map(tuple, g))[col] for col in zip(*g)), "Count rows as tuples (or strings) in a map, then look up each column.", ["Hash Map", "Matrix"])

Q(H, "four-sum-ii", "4Sum II", "Medium", "fourSumCount(nums1: int[], nums2: int[], nums3: int[], nums4: int[]) -> int",
  "Return how many tuples (i, j, k, l) satisfy nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.",
  [C([1, 2], [-2, -1], [-1, 2], [0, 2]), C([0], [0], [0], [0]), C([1], [1], [1], [1]), C(rl(8, -5, 5), rl(8, -5, 5), rl(8, -5, 5), rl(8, -5, 5))],
  lambda a, b, c, d: (lambda ab: sum(ab[-(x + y)] for x in c for y in d))(Counter(x + y for x in a for y in b)),
  "Store every a + b sum's count in a map, then look up -(c + d).", ["Hash Map"])

Q(H, "highest-frequency-element", "Most Frequent Element", "Easy", "mostFrequent(nums: int[]) -> int",
  "Return the value that occurs most often in nums. If several tie, return the smallest of them.",
  [C([1, 3, 2, 3, 1, 3]), C([4, 4, 5, 5]), C([9]), C(rl(30, 0, 8))], lambda a: min(Counter(a).items(), key=lambda kv: (-kv[1], kv[0]))[0],
  "Count with a map, then pick (highest count, smallest value).", ["Hash Map"])

Q(H, "count-distinct", "Count Distinct Elements", "Easy", "countDistinct(nums: int[]) -> int",
  "Return how many distinct values nums contains.",
  [C([1, 2, 2, 3, 3, 3]), C([5, 5, 5]), C([]), C(rl(50, 0, 25))], lambda a: len(set(a)), "Add everything to a hash set and return its size.", ["Hash Set"])

Q(H, "valid-sudoku", "Valid Sudoku", "Medium", "isValidSudoku(board: String[]) -> boolean",
  "board has 9 strings of 9 characters: digits 1-9 or '.' for empty. Return true if the filled cells are valid: no repeated digit in any row, column or 3 x 3 box. The board need not be solvable.",
  [C(["53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"]),
   C(["83..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"]),
   C([".........", ".........", ".........", ".........", ".........", ".........", ".........", ".........", "........."]),
   C(["1........", ".1.......", ".........", ".........", ".........", ".........", ".........", ".........", "........."])],
  lambda b: _sudoku_ok(b), "One set per row, column and box; box index = (r / 3) * 3 + c / 3.", ["Hash Set", "Matrix"])


def _degree(a):
    first, last, cnt = {}, {}, Counter(a)
    for i, v in enumerate(a):
        first.setdefault(v, i)
        last[v] = i
    deg = max(cnt.values())
    return min(last[v] - first[v] + 1 for v in cnt if cnt[v] == deg)


def _sudoku_ok(b):
    seen = set()
    for r in range(9):
        for c in range(9):
            v = b[r][c]
            if v == ".":
                continue
            for key in ((v, "r", r), (v, "c", c), (v, "b", r // 3, c // 3)):
                if key in seen:
                    return False
                seen.add(key)
    return True
