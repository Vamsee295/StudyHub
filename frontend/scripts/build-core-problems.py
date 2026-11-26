"""
Builds StudyHub's core problem set: classic interview problems grouped by topic, easy to medium.

Every problem carries a reference solution in Python. The script runs it on each test input to
produce the expected output, so expected answers are computed, never typed by hand.

Writes:
  frontend/lib/problems/core.json       (problems with visible tests; read by problemRegistry.ts)
  backend/data/core_hidden_tests.json   (hidden tests the /execution/submit route appends)

Run from the repo root:  python frontend/scripts/build-core-problems.py
Problem statements are StudyHub's own wording of well-known exercises.
"""
from __future__ import annotations

import bisect
import heapq
import itertools
import json
import math
import random
import re
from collections import Counter, defaultdict, deque
from functools import lru_cache, reduce
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROBLEMS: list[dict] = []


def P(slug, title, difficulty, category, tags, description, sig, cases, solve, hint, constraints=(), visible=2):
    method, params, returns = sig
    PROBLEMS.append(dict(slug=slug, title=title, difficulty=difficulty, category=category, tags=tags, description=description,
                         method=method, params=params, returns=returns, cases=cases, solve=solve, hint=hint,
                         constraints=list(constraints), visible=visible))


rng = random.Random(7)  # fixed seed: the generated tests never change between runs
rand_list = lambda n, lo=-50, hi=50: [rng.randint(lo, hi) for _ in range(n)]

# ---------- tree / list helpers for reference solutions ----------
class T:
    def __init__(self, v, l=None, r=None):
        self.v, self.l, self.r = v, l, r


def tree(a):
    if not a or a[0] is None:
        return None
    root = T(a[0]); q = deque([root]); i = 1
    while q and i < len(a):
        n = q.popleft()
        if i < len(a) and a[i] is not None:
            n.l = T(a[i]); q.append(n.l)
        i += 1
        if i < len(a) and a[i] is not None:
            n.r = T(a[i]); q.append(n.r)
        i += 1
    return root


def untree(root):
    out, q = [], deque([root])
    while q:
        n = q.popleft()
        out.append(None if n is None else n.v)
        if n:
            q.append(n.l); q.append(n.r)
    while out and out[-1] is None:
        out.pop()
    return out


# =========================== ARRAYS ===========================
P("max-element", "Find the Largest Number", "Easy", "Arrays", ["Arrays"],
  ["Given a non-empty array of integers nums, return the largest value in it.",
   "Do it in a single pass without sorting."],
  ("findMax", [("nums", "int[]")], "int"),
  [{"nums": [3, 7, 2, 9, 4]}, {"nums": [-5, -2, -9]}, {"nums": [42]}, {"nums": rand_list(30)}, {"nums": [0, 0, 0]}],
  lambda nums: max(nums), "Keep the best value seen so far and compare every element with it.", ["1 <= nums.length <= 10^4"])

P("second-largest", "Second Largest Distinct Number", "Easy", "Arrays", ["Arrays"],
  ["Given an array of integers nums, return the second largest distinct value. If every value is the same, return -1."],
  ("secondLargest", [("nums", "int[]")], "int"),
  [{"nums": [12, 35, 1, 10, 34, 1]}, {"nums": [10, 10, 10]}, {"nums": [5, 9]}, {"nums": [7, 7, 3]}, {"nums": rand_list(25, 0, 100)}],
  lambda nums: sorted(set(nums))[-2] if len(set(nums)) > 1 else -1,
  "Track two variables, largest and second, updating them as you scan once.", ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^4"])

P("missing-number", "Missing Number", "Easy", "Arrays", ["Arrays", "Math"],
  ["An array nums holds n distinct numbers taken from the range 0 to n. Exactly one number in that range is missing. Return it."],
  ("missingNumber", [("nums", "int[]")], "int"),
  [{"nums": [3, 0, 1]}, {"nums": [0, 1]}, {"nums": [9, 6, 4, 2, 3, 5, 7, 0, 1]}, {"nums": [0]}, {"nums": [1]}],
  lambda nums: len(nums) * (len(nums) + 1) // 2 - sum(nums),
  "The sum of 0..n is n(n+1)/2. Subtract what you have.", ["1 <= n <= 10^4", "All numbers are distinct"])

P("max-consecutive-ones", "Max Consecutive Ones", "Easy", "Arrays", ["Arrays"],
  ["Given a binary array nums (only 0s and 1s), return the length of the longest run of consecutive 1s."],
  ("findMaxConsecutiveOnes", [("nums", "int[]")], "int"),
  [{"nums": [1, 1, 0, 1, 1, 1]}, {"nums": [1, 0, 1, 1, 0, 1]}, {"nums": [0, 0]}, {"nums": [1]}, {"nums": [rng.randint(0, 1) for _ in range(40)]}],
  lambda nums: max((len(s) for s in "".join(map(str, nums)).split("0")), default=0),
  "Count the current run; reset it to 0 on every 0 and remember the best.", ["1 <= nums.length <= 10^5"])

P("majority-element", "Majority Element", "Easy", "Arrays", ["Arrays", "Hash Map"],
  ["Given an array nums of size n, return the element that appears more than n / 2 times. Such an element always exists."],
  ("majorityElement", [("nums", "int[]")], "int"),
  [{"nums": [3, 2, 3]}, {"nums": [2, 2, 1, 1, 1, 2, 2]}, {"nums": [1]}, {"nums": [6, 5, 5]}, {"nums": [4] * 11 + rand_list(10, 0, 3)}],
  lambda nums: Counter(nums).most_common(1)[0][0],
  "Boyer-Moore voting: keep a candidate and a count; same value adds 1, different value subtracts 1.", ["1 <= n <= 5 * 10^4"])

P("rotate-array", "Rotate Array", "Medium", "Arrays", ["Arrays", "Two Pointers"],
  ["Given an integer array nums, rotate it to the right by k steps and return the rotated array.",
   "Example: [1,2,3,4,5,6,7] rotated by 3 is [5,6,7,1,2,3,4]."],
  ("rotate", [("nums", "int[]"), ("k", "int")], "int[]"),
  [{"nums": [1, 2, 3, 4, 5, 6, 7], "k": 3}, {"nums": [-1, -100, 3, 99], "k": 2}, {"nums": [1, 2], "k": 5}, {"nums": [1], "k": 0}, {"nums": rand_list(20), "k": 37}],
  lambda nums, k: nums[-(k % len(nums)):] + nums[:-(k % len(nums))] if k % len(nums) else nums,
  "k can be larger than the length: use k % n. Reversing the whole array, then both parts, rotates in place.",
  ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"])

P("product-except-self", "Product of Array Except Self", "Medium", "Arrays", ["Arrays", "Prefix Sum"],
  ["Given an integer array nums, return an array answer where answer[i] is the product of all elements of nums except nums[i].",
   "Solve it without using division, in O(n) time."],
  ("productExceptSelf", [("nums", "int[]")], "int[]"),
  [{"nums": [1, 2, 3, 4]}, {"nums": [-1, 1, 0, -3, 3]}, {"nums": [2, 3]}, {"nums": [0, 0, 2]}, {"nums": rand_list(10, -4, 4)}],
  lambda nums: [__import__("math").prod(nums[:i] + nums[i + 1:]) for i in range(len(nums))],
  "answer[i] = (product of everything left of i) x (product of everything right of i). Build both in two passes.",
  ["2 <= nums.length <= 10^5", "The product of any prefix or suffix fits in a 32-bit integer"])

# =========================== STRINGS ===========================
P("count-vowels", "Count the Vowels", "Easy", "Strings", ["Strings"],
  ["Given a string s, return how many vowels (a, e, i, o, u, in either case) it contains."],
  ("countVowels", [("s", "String")], "int"),
  [{"s": "Hello World"}, {"s": "rhythm"}, {"s": "AEIOUaeiou"}, {"s": ""}, {"s": "Programming is fun"}],
  lambda s: sum(c in "aeiouAEIOU" for c in s), "Loop over the characters and check membership in \"aeiouAEIOU\".", ["0 <= s.length <= 10^4"])

P("valid-palindrome", "Valid Palindrome", "Easy", "Strings", ["Strings", "Two Pointers"],
  ["A phrase is a palindrome if, after converting all letters to lowercase and removing every character that isn't a letter or digit, it reads the same forward and backward.",
   "Given a string s, return true if it is a palindrome."],
  ("isPalindrome", [("s", "String")], "boolean"),
  [{"s": "A man, a plan, a canal: Panama"}, {"s": "race a car"}, {"s": " "}, {"s": "0P"}, {"s": "No 'x' in Nixon"}],
  lambda s: (t := [c.lower() for c in s if c.isalnum()]) == t[::-1],
  "Two pointers from both ends; skip characters that aren't letters or digits.", ["1 <= s.length <= 2 * 10^5"])

P("longest-common-prefix", "Longest Common Prefix", "Easy", "Strings", ["Strings"],
  ["Return the longest string that is a prefix of every string in the array strs. If there is none, return an empty string."],
  ("longestCommonPrefix", [("strs", "String[]")], "String"),
  [{"strs": ["flower", "flow", "flight"]}, {"strs": ["dog", "racecar", "car"]}, {"strs": ["a"]}, {"strs": ["interview", "internet", "interval"]}, {"strs": ["", "b"]}],
  lambda strs: __import__("os").path.commonprefix(strs),
  "Compare character by character with the first string until any string differs or ends.", ["1 <= strs.length <= 200"])

P("first-unique-char", "First Unique Character", "Easy", "Strings", ["Strings", "Hash Map"],
  ["Given a string s of lowercase letters, return the index of the first character that appears exactly once. If there isn't one, return -1."],
  ("firstUniqChar", [("s", "String")], "int"),
  [{"s": "leetcode"}, {"s": "loveleetcode"}, {"s": "aabb"}, {"s": "z"}, {"s": "abcabd"}],
  lambda s: next((i for i, c in enumerate(s) if s.count(c) == 1), -1),
  "Count every character first (an int[26] works), then scan again for the first count of 1.", ["1 <= s.length <= 10^5"])

P("reverse-words", "Reverse Words in a String", "Medium", "Strings", ["Strings", "Two Pointers"],
  ["Given a string s, reverse the order of its words. Words are separated by spaces; the result must have single spaces between words and no leading or trailing spaces."],
  ("reverseWords", [("s", "String")], "String"),
  [{"s": "the sky is blue"}, {"s": "  hello world  "}, {"s": "a good   example"}, {"s": "single"}, {"s": " Bob    Loves  Alice   "}],
  lambda s: " ".join(reversed(s.split())), "Split on runs of spaces, then join the words in reverse order.", ["1 <= s.length <= 10^4"])

P("string-compression", "String Compression", "Medium", "Strings", ["Strings"],
  ["Compress a string by replacing each run of the same character with the character followed by the run length, but only if that makes it shorter. Example: \"aabcccccaaa\" becomes \"a2b1c5a3\".",
   "If the compressed string is not shorter than the original, return the original."],
  ("compress", [("s", "String")], "String"),
  [{"s": "aabcccccaaa"}, {"s": "abc"}, {"s": "aaaaaaaaaa"}, {"s": "a"}, {"s": "aabb"}],
  None,
  "Walk the string counting each run; build the result with a StringBuilder.", ["1 <= s.length <= 10^4"])

# =========================== HASHING ===========================
P("contains-duplicate", "Contains Duplicate", "Easy", "Hashing", ["Hash Set", "Arrays"],
  ["Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct."],
  ("containsDuplicate", [("nums", "int[]")], "boolean"),
  [{"nums": [1, 2, 3, 1]}, {"nums": [1, 2, 3, 4]}, {"nums": [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]}, {"nums": [7]}, {"nums": list(range(500))}],
  lambda nums: len(set(nums)) < len(nums), "Add each value to a hash set; if it is already there, you found a duplicate.", ["1 <= nums.length <= 10^5"])

P("valid-anagram", "Valid Anagram", "Easy", "Hashing", ["Hash Map", "Strings"],
  ["Given two strings s and t, return true if t is an anagram of s: the same letters with the same counts, in any order."],
  ("isAnagram", [("s", "String"), ("t", "String")], "boolean"),
  [{"s": "anagram", "t": "nagaram"}, {"s": "rat", "t": "car"}, {"s": "a", "t": "ab"}, {"s": "listen", "t": "silent"}, {"s": "aacc", "t": "ccac"}],
  lambda s, t: Counter(s) == Counter(t), "Count letters of s up and letters of t down in one int[26]; all zeros means anagram.", ["1 <= s.length, t.length <= 5 * 10^4"])

P("two-sum-count", "Count Pairs With a Given Sum", "Easy", "Hashing", ["Hash Map", "Arrays"],
  ["Given an integer array nums and an integer k, return how many index pairs (i, j) with i < j satisfy nums[i] + nums[j] == k."],
  ("countPairs", [("nums", "int[]"), ("k", "int")], "int"),
  [{"nums": [1, 5, 7, -1], "k": 6}, {"nums": [1, 1, 1, 1], "k": 2}, {"nums": [1, 2, 3], "k": 10}, {"nums": rand_list(40, -10, 10), "k": 0}, {"nums": [3], "k": 6}],
  lambda nums, k: sum(nums[i] + nums[j] == k for i in range(len(nums)) for j in range(i + 1, len(nums))),
  "Scan left to right; for each x, add how many times k - x was seen before, then record x in a map.", ["1 <= nums.length <= 10^5"])

P("longest-consecutive", "Longest Consecutive Sequence", "Medium", "Hashing", ["Hash Set", "Arrays"],
  ["Given an unsorted array of integers nums, return the length of the longest sequence of consecutive integers (like 1, 2, 3, 4) that can be formed from its values.",
   "Aim for O(n) time."],
  ("longestConsecutive", [("nums", "int[]")], "int"),
  [{"nums": [100, 4, 200, 1, 3, 2]}, {"nums": [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]}, {"nums": []}, {"nums": [1, 2, 0, 1]}, {"nums": rand_list(60, -30, 30)}],
  lambda nums: max((next(k for k in __import__("itertools").count() if x + k not in set(nums)) for x in set(nums) if x - 1 not in set(nums)), default=0),
  "Put everything in a set. Only start counting from x when x - 1 is not in the set.", ["0 <= nums.length <= 10^5"])

P("group-anagrams-count", "Count Anagram Groups", "Medium", "Hashing", ["Hash Map", "Strings", "Sorting"],
  ["Given an array of strings strs, group words that are anagrams of each other and return how many groups there are."],
  ("countGroups", [("strs", "String[]")], "int"),
  [{"strs": ["eat", "tea", "tan", "ate", "nat", "bat"]}, {"strs": [""]}, {"strs": ["a"]}, {"strs": ["abc", "bca", "cab", "xyz", "zyx", "q"]}, {"strs": ["ab", "ba", "ab"]}],
  lambda strs: len({"".join(sorted(s)) for s in strs}),
  "Use the sorted letters of each word as a key in a map (or set).", ["1 <= strs.length <= 10^4"])

# =========================== TWO POINTERS ===========================
P("move-zeroes", "Move Zeroes", "Easy", "Two Pointers", ["Two Pointers", "Arrays"],
  ["Given an integer array nums, move all 0s to the end while keeping the relative order of the other elements. Return the array."],
  ("moveZeroes", [("nums", "int[]")], "int[]"),
  [{"nums": [0, 1, 0, 3, 12]}, {"nums": [0]}, {"nums": [1, 2, 3]}, {"nums": [0, 0, 1]}, {"nums": [rng.choice([0, 0, rng.randint(1, 9)]) for _ in range(25)]}],
  lambda nums: [x for x in nums if x] + [0] * nums.count(0),
  "Keep a write pointer: copy each non-zero forward, then fill the rest with zeros.", ["1 <= nums.length <= 10^4"])

P("squares-sorted", "Squares of a Sorted Array", "Easy", "Two Pointers", ["Two Pointers", "Arrays", "Sorting"],
  ["Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number, also sorted in non-decreasing order.",
   "Try for O(n) instead of squaring and sorting."],
  ("sortedSquares", [("nums", "int[]")], "int[]"),
  [{"nums": [-4, -1, 0, 3, 10]}, {"nums": [-7, -3, 2, 3, 11]}, {"nums": [1]}, {"nums": [-5, -3, -1]}, {"nums": sorted(rand_list(20))}],
  lambda nums: sorted(x * x for x in nums),
  "The largest square is at one of the two ends. Fill the answer from the back with two pointers.", ["1 <= nums.length <= 10^4"])

P("two-sum-sorted", "Two Sum II (Sorted Input)", "Medium", "Two Pointers", ["Two Pointers", "Arrays", "Binary Search"],
  ["Given a 1-indexed array numbers sorted in non-decreasing order, find two numbers that add up to target and return their indices [index1, index2] with index1 < index2.",
   "There is exactly one solution. Use only constant extra space."],
  ("twoSum", [("numbers", "int[]"), ("target", "int")], "int[]"),
  [{"numbers": [2, 7, 11, 15], "target": 9}, {"numbers": [2, 3, 4], "target": 6}, {"numbers": [-1, 0], "target": -1}, {"numbers": [1, 3, 5, 8, 12, 20], "target": 25}, {"numbers": [5, 25, 75], "target": 100}],
  lambda numbers, target: next([i + 1, j + 1] for i in range(len(numbers)) for j in range(i + 1, len(numbers)) if numbers[i] + numbers[j] == target),
  "Start pointers at both ends: if the sum is too small move left up, if too big move right down.", ["2 <= numbers.length <= 3 * 10^4"])

P("container-most-water", "Container With Most Water", "Medium", "Two Pointers", ["Two Pointers", "Greedy", "Arrays"],
  ["height[i] is the height of a vertical line at position i. Pick two lines that, with the x-axis, hold the most water. Return that maximum amount.",
   "The water held between lines i and j is (j - i) x min(height[i], height[j])."],
  ("maxArea", [("height", "int[]")], "int"),
  [{"height": [1, 8, 6, 2, 5, 4, 8, 3, 7]}, {"height": [1, 1]}, {"height": [4, 3, 2, 1, 4]}, {"height": [1, 2, 1]}, {"height": rand_list(40, 0, 50)}],
  lambda height: max((j - i) * min(height[i], height[j]) for i in range(len(height)) for j in range(i + 1, len(height))),
  "Start with the widest pair and always move the shorter line inward: the taller one can't do better by moving.", ["2 <= height.length <= 10^5"])

# =========================== SLIDING WINDOW ===========================
P("max-sum-k", "Maximum Sum of k Consecutive Elements", "Easy", "Sliding Window", ["Sliding Window", "Arrays"],
  ["Given an integer array nums and an integer k, return the largest sum of any k consecutive elements."],
  ("maxSum", [("nums", "int[]"), ("k", "int")], "int"),
  [{"nums": [2, 1, 5, 1, 3, 2], "k": 3}, {"nums": [2, 3, 4, 1, 5], "k": 2}, {"nums": [-1, -2, -3], "k": 1}, {"nums": [5], "k": 1}, {"nums": rand_list(50), "k": 7}],
  lambda nums, k: max(sum(nums[i:i + k]) for i in range(len(nums) - k + 1)),
  "Sum the first k elements, then slide: add the new element, subtract the one that left.", ["1 <= k <= nums.length <= 10^5"])

P("min-size-subarray", "Minimum Size Subarray Sum", "Medium", "Sliding Window", ["Sliding Window", "Arrays"],
  ["Given an array of positive integers nums and a positive integer target, return the length of the shortest contiguous subarray whose sum is at least target. Return 0 if there is none."],
  ("minSubArrayLen", [("target", "int"), ("nums", "int[]")], "int"),
  [{"target": 7, "nums": [2, 3, 1, 2, 4, 3]}, {"target": 4, "nums": [1, 4, 4]}, {"target": 11, "nums": [1, 1, 1, 1, 1, 1, 1, 1]}, {"target": 15, "nums": [1, 2, 3, 4, 5]}, {"target": 50, "nums": rand_list(40, 1, 9)}],
  lambda target, nums: min((j - i for i in range(len(nums)) for j in range(i + 1, len(nums) + 1) if sum(nums[i:j]) >= target), default=0),
  "Grow the window to the right; while its sum is big enough, record the length and shrink from the left.", ["1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"])

P("longest-substring-k-distinct", "Longest Substring With At Most Two Distinct Letters", "Medium", "Sliding Window", ["Sliding Window", "Hash Map", "Strings"],
  ["Given a string s, return the length of the longest substring that contains at most two distinct characters."],
  ("lengthOfLongestSubstringTwoDistinct", [("s", "String")], "int"),
  [{"s": "eceba"}, {"s": "ccaabbb"}, {"s": "a"}, {"s": "abcabcabc"}, {"s": "".join(rng.choice("abc") for _ in range(40))}],
  lambda s: max((j - i for i in range(len(s)) for j in range(i + 1, len(s) + 1) if len(set(s[i:j])) <= 2), default=0),
  "Keep counts of the letters in the window; when there are 3 distinct, shrink from the left until there are 2.", ["1 <= s.length <= 10^5"])

# =========================== PREFIX SUM ===========================
P("running-sum", "Running Sum of an Array", "Easy", "Prefix Sum", ["Prefix Sum", "Arrays"],
  ["Given an array nums, return its running sum: result[i] = nums[0] + nums[1] + ... + nums[i]."],
  ("runningSum", [("nums", "int[]")], "int[]"),
  [{"nums": [1, 2, 3, 4]}, {"nums": [1, 1, 1, 1, 1]}, {"nums": [3, 1, 2, 10, 1]}, {"nums": [-2]}, {"nums": rand_list(20)}],
  lambda nums: list(__import__("itertools").accumulate(nums)), "Each answer is the previous answer plus the current element.", ["1 <= nums.length <= 1000"])

P("pivot-index", "Find Pivot Index", "Easy", "Prefix Sum", ["Prefix Sum", "Arrays"],
  ["Return the leftmost index where the sum of all numbers to its left equals the sum of all numbers to its right. If no such index exists, return -1."],
  ("pivotIndex", [("nums", "int[]")], "int"),
  [{"nums": [1, 7, 3, 6, 5, 6]}, {"nums": [1, 2, 3]}, {"nums": [2, 1, -1]}, {"nums": [0]}, {"nums": [-1, -1, 0, 1, 1, 0]}],
  lambda nums: next((i for i in range(len(nums)) if sum(nums[:i]) == sum(nums[i + 1:])), -1),
  "With the total sum known, right = total - left - nums[i]. One pass.", ["1 <= nums.length <= 10^4"])

P("subarray-sum-k", "Subarray Sum Equals K", "Medium", "Prefix Sum", ["Prefix Sum", "Hash Map", "Arrays"],
  ["Given an integer array nums and an integer k, return the number of contiguous subarrays whose sum equals k."],
  ("subarraySum", [("nums", "int[]"), ("k", "int")], "int"),
  [{"nums": [1, 1, 1], "k": 2}, {"nums": [1, 2, 3], "k": 3}, {"nums": [1, -1, 0], "k": 0}, {"nums": [3], "k": 3}, {"nums": rand_list(40, -5, 5), "k": 4}],
  lambda nums, k: sum(sum(nums[i:j]) == k for i in range(len(nums)) for j in range(i + 1, len(nums) + 1)),
  "A subarray (i, j] sums to k when prefix[j] - prefix[i] == k. Count earlier prefixes in a map.", ["1 <= nums.length <= 2 * 10^4"])

# =========================== SORTING ===========================
P("merge-sorted-arrays", "Merge Two Sorted Arrays", "Easy", "Sorting", ["Sorting", "Two Pointers", "Arrays"],
  ["Given two arrays a and b, each sorted in non-decreasing order, return one sorted array containing all their elements."],
  ("merge", [("a", "int[]"), ("b", "int[]")], "int[]"),
  [{"a": [1, 2, 3], "b": [2, 5, 6]}, {"a": [1], "b": []}, {"a": [], "b": [4, 8]}, {"a": [-3, 0, 9], "b": [-5, 1, 10, 11]}, {"a": sorted(rand_list(10)), "b": sorted(rand_list(12))}],
  lambda a, b: sorted(a + b), "Two pointers: take the smaller head each time, then copy whatever is left.", ["0 <= a.length, b.length <= 10^4"])

P("sort-colors", "Sort Colors", "Medium", "Sorting", ["Sorting", "Two Pointers", "Arrays"],
  ["nums contains only 0s, 1s and 2s (red, white, blue). Sort it so all 0s come first, then 1s, then 2s, without using a library sort. Return the array.",
   "A one-pass solution exists (the Dutch national flag algorithm)."],
  ("sortColors", [("nums", "int[]")], "int[]"),
  [{"nums": [2, 0, 2, 1, 1, 0]}, {"nums": [2, 0, 1]}, {"nums": [0]}, {"nums": [1, 1, 1]}, {"nums": [rng.randint(0, 2) for _ in range(30)]}],
  lambda nums: sorted(nums), "Keep three regions with pointers low, mid, high and swap 0s left, 2s right.", ["1 <= nums.length <= 300"])

P("merge-intervals", "Merge Intervals", "Medium", "Sorting", ["Sorting", "Arrays"],
  ["Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals and return the result sorted by start.",
   "Intervals that touch, like [1,4] and [4,5], also merge."],
  ("merge", [("intervals", "int[][]")], "int[][]"),
  [{"intervals": [[1, 3], [2, 6], [8, 10], [15, 18]]}, {"intervals": [[1, 4], [4, 5]]}, {"intervals": [[1, 4], [0, 4]]}, {"intervals": [[5, 7]]}, {"intervals": [[6, 8], [1, 9], [2, 4], [4, 7]]}],
  lambda intervals: (lambda s: __import__("functools").reduce(lambda acc, iv: acc[:-1] + [[acc[-1][0], max(acc[-1][1], iv[1])]] if acc and iv[0] <= acc[-1][1] else acc + [iv], s, []))(sorted(intervals)),
  "Sort by start. Then each interval either extends the last merged one or starts a new one.", ["1 <= intervals.length <= 10^4"])

P("sort-array", "Sort an Array (Merge Sort)", "Medium", "Sorting", ["Sorting", "Divide and Conquer", "Recursion"],
  ["Sort the integer array nums in ascending order and return it, without using any built-in sort. Aim for O(n log n): implement merge sort or quick sort yourself."],
  ("sortArray", [("nums", "int[]")], "int[]"),
  [{"nums": [5, 2, 3, 1]}, {"nums": [5, 1, 1, 2, 0, 0]}, {"nums": [1]}, {"nums": rand_list(60, -100, 100)}, {"nums": list(range(30, 0, -1))}],
  lambda nums: sorted(nums), "Merge sort: sort each half recursively, then merge the two sorted halves.", ["1 <= nums.length <= 5 * 10^4"])

# =========================== BINARY SEARCH ===========================
P("search-insert", "Search Insert Position", "Easy", "Binary Search", ["Binary Search", "Arrays"],
  ["Given a sorted array of distinct integers nums and a target, return the index of target if it is present, or the index where it would be inserted to keep the order. Use O(log n) time."],
  ("searchInsert", [("nums", "int[]"), ("target", "int")], "int"),
  [{"nums": [1, 3, 5, 6], "target": 5}, {"nums": [1, 3, 5, 6], "target": 2}, {"nums": [1, 3, 5, 6], "target": 7}, {"nums": [1, 3, 5, 6], "target": 0}, {"nums": [1], "target": 1}],
  lambda nums, target: __import__("bisect").bisect_left(nums, target),
  "Find the first index whose value is >= target. When the loop ends, low is the answer.", ["1 <= nums.length <= 10^4"])

P("first-last-position", "First and Last Position of a Value", "Medium", "Binary Search", ["Binary Search", "Arrays"],
  ["Given a sorted array nums and a target, return [first, last]: the first and last index where target appears, or [-1, -1] if it doesn't. Use O(log n) time."],
  ("searchRange", [("nums", "int[]"), ("target", "int")], "int[]"),
  [{"nums": [5, 7, 7, 8, 8, 10], "target": 8}, {"nums": [5, 7, 7, 8, 8, 10], "target": 6}, {"nums": [], "target": 0}, {"nums": [2, 2, 2, 2], "target": 2}, {"nums": [1, 3], "target": 3}],
  lambda nums, target: [nums.index(target), len(nums) - 1 - nums[::-1].index(target)] if target in nums else [-1, -1],
  "Run binary search twice: once biased left to find the first, once biased right to find the last.", ["0 <= nums.length <= 10^5"])

P("min-rotated", "Minimum in a Rotated Sorted Array", "Medium", "Binary Search", ["Binary Search", "Arrays"],
  ["A sorted array of distinct values was rotated at an unknown pivot, e.g. [0,1,2,4,5,6,7] became [4,5,6,7,0,1,2]. Return its smallest element in O(log n) time."],
  ("findMin", [("nums", "int[]")], "int"),
  [{"nums": [3, 4, 5, 1, 2]}, {"nums": [4, 5, 6, 7, 0, 1, 2]}, {"nums": [11, 13, 15, 17]}, {"nums": [2, 1]}, {"nums": [1]}],
  lambda nums: min(nums), "Compare mid with the right end: if nums[mid] > nums[right], the minimum is to the right of mid.", ["1 <= nums.length <= 5000"])

P("koko-bananas", "Koko Eating Bananas", "Medium", "Binary Search", ["Binary Search", "Arrays"],
  ["piles[i] is a pile of bananas. Koko eats at speed k bananas per hour: each hour she picks one pile and eats k from it (or the whole pile if it has fewer). She has h hours.",
   "Return the smallest integer speed k that lets her finish every pile within h hours."],
  ("minEatingSpeed", [("piles", "int[]"), ("h", "int")], "int"),
  [{"piles": [3, 6, 7, 11], "h": 8}, {"piles": [30, 11, 23, 4, 20], "h": 5}, {"piles": [30, 11, 23, 4, 20], "h": 6}, {"piles": [1], "h": 1}, {"piles": [312884470], "h": 312884469}],
  None,
  "Binary search on the answer: for a speed k, the hours needed are the sum of ceil(pile / k).", ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9"])

# =========================== RECURSION ===========================
P("factorial", "Factorial", "Easy", "Recursion", ["Recursion", "Math"],
  ["Return n! (n factorial), the product 1 x 2 x ... x n. By definition 0! = 1. Write it recursively."],
  ("factorial", [("n", "int")], "int"),
  [{"n": 5}, {"n": 0}, {"n": 1}, {"n": 10}, {"n": 12}],
  lambda n: __import__("math").factorial(n), "Base case: n <= 1 returns 1. Otherwise n x factorial(n - 1).", ["0 <= n <= 12"])

P("fibonacci", "Fibonacci Number", "Easy", "Recursion", ["Recursion", "Dynamic Programming"],
  ["The Fibonacci numbers start F(0) = 0, F(1) = 1, and F(n) = F(n - 1) + F(n - 2). Given n, return F(n)."],
  ("fib", [("n", "int")], "int"),
  [{"n": 2}, {"n": 3}, {"n": 4}, {"n": 0}, {"n": 30}],
  None,
  "Plain recursion recomputes the same values. Remember results (memoisation) or loop with two variables.", ["0 <= n <= 30"])

P("power-of-two", "Power of Two", "Easy", "Recursion", ["Recursion", "Math", "Bit Manipulation"],
  ["Given an integer n, return true if it is a power of two (1, 2, 4, 8, ...)."],
  ("isPowerOfTwo", [("n", "int")], "boolean"),
  [{"n": 1}, {"n": 16}, {"n": 3}, {"n": 0}, {"n": -8}, {"n": 1073741824}],
  lambda n: n > 0 and n & (n - 1) == 0, "Recursively: n is a power of two if n == 1, or n is even and n / 2 is a power of two.", ["-2^31 <= n <= 2^31 - 1"])

P("sum-digits", "Sum of Digits", "Easy", "Recursion", ["Recursion", "Math"],
  ["Given a non-negative integer n, return the sum of its decimal digits, using recursion."],
  ("sumDigits", [("n", "int")], "int"),
  [{"n": 1234}, {"n": 0}, {"n": 9}, {"n": 1000000}, {"n": 987654321}],
  lambda n: sum(map(int, str(n))), "sumDigits(n) = n % 10 + sumDigits(n / 10), with 0 as the base case.", ["0 <= n <= 2^31 - 1"])

P("pow-x-n", "Pow(x, n)", "Medium", "Recursion", ["Recursion", "Math"],
  ["Implement pow(x, n): x raised to the integer power n (n may be negative). Use fast exponentiation, O(log n)."],
  ("myPow", [("x", "double"), ("n", "int")], "double"),
  [{"x": 2.0, "n": 10}, {"x": 2.1, "n": 3}, {"x": 2.0, "n": -2}, {"x": 1.0, "n": 2147483647}, {"x": 0.5, "n": 4}],
  lambda x, n: round(x ** n, 9), "x^n = (x^(n/2))^2, times x when n is odd. For negative n, compute 1 / x^(-n).", ["-100 < x < 100", "-2^31 <= n <= 2^31 - 1"])

# =========================== STACK & QUEUE ===========================
P("remove-adjacent-duplicates", "Remove Adjacent Duplicates", "Easy", "Stack & Queue", ["Stack", "Strings"],
  ["Repeatedly remove two adjacent equal letters from s until no such pair remains. Return the final string."],
  ("removeDuplicates", [("s", "String")], "String"),
  [{"s": "abbaca"}, {"s": "azxxzy"}, {"s": "aa"}, {"s": "abc"}, {"s": "aabbccdd"}],
  lambda s: __import__("functools").reduce(lambda st, c: st[:-1] if st and st[-1] == c else st + c, s, ""),
  "Use a stack: push each letter, but pop instead when it equals the top.", ["1 <= s.length <= 10^5"])

P("baseball-game", "Baseball Game Scores", "Easy", "Stack & Queue", ["Stack", "Simulation"],
  ["You record scores from operations: an integer x adds a new score x; \"+\" adds the sum of the previous two scores; \"D\" adds double the previous score; \"C\" removes the previous score.",
   "Return the sum of all scores after every operation."],
  ("calPoints", [("operations", "String[]")], "int"),
  [{"operations": ["5", "2", "C", "D", "+"]}, {"operations": ["5", "-2", "4", "C", "D", "9", "+", "+"]}, {"operations": ["1", "C"]}, {"operations": ["3"]}, {"operations": ["1", "2", "+", "+", "D"]}],
  lambda operations: sum(__import__("functools").reduce(lambda st, op: st[:-1] if op == "C" else st + [st[-1] * 2] if op == "D" else st + [st[-1] + st[-2]] if op == "+" else st + [int(op)], operations, [])),
  "A stack of scores makes each operation a push or a pop.", ["1 <= operations.length <= 1000"])

P("next-greater", "Next Greater Element", "Medium", "Stack & Queue", ["Stack", "Monotonic Stack", "Arrays"],
  ["For each element of nums, find the first element to its right that is strictly greater. Return those values, using -1 where there is none."],
  ("nextGreater", [("nums", "int[]")], "int[]"),
  [{"nums": [4, 5, 2, 25]}, {"nums": [13, 7, 6, 12]}, {"nums": [1, 2, 3]}, {"nums": [3, 2, 1]}, {"nums": rand_list(25, 0, 30)}],
  lambda nums: [next((nums[j] for j in range(i + 1, len(nums)) if nums[j] > nums[i]), -1) for i in range(len(nums))],
  "Scan from the right with a stack of candidates; pop everything not greater than the current value.", ["1 <= nums.length <= 10^5"])

P("daily-temperatures", "Daily Temperatures", "Medium", "Stack & Queue", ["Stack", "Monotonic Stack", "Arrays"],
  ["Given daily temperatures, return an array where answer[i] is how many days after day i you wait for a warmer temperature, or 0 if it never comes."],
  ("dailyTemperatures", [("temperatures", "int[]")], "int[]"),
  [{"temperatures": [73, 74, 75, 71, 69, 72, 76, 73]}, {"temperatures": [30, 40, 50, 60]}, {"temperatures": [30, 60, 90]}, {"temperatures": [90, 80, 70]}, {"temperatures": rand_list(30, 30, 100)}],
  lambda temperatures: [next((j - i for j in range(i + 1, len(temperatures)) if temperatures[j] > temperatures[i]), 0) for i in range(len(temperatures))],
  "Keep a stack of indices still waiting for a warmer day; resolve them when a warmer one arrives.", ["1 <= temperatures.length <= 10^5"])

P("eval-rpn", "Evaluate Reverse Polish Notation", "Medium", "Stack & Queue", ["Stack", "Math"],
  ["Evaluate an arithmetic expression in Reverse Polish Notation, given as tokens. Operators are +, -, *, /. Division truncates toward zero. Return the result."],
  ("evalRPN", [("tokens", "String[]")], "int"),
  [{"tokens": ["2", "1", "+", "3", "*"]}, {"tokens": ["4", "13", "5", "/", "+"]}, {"tokens": ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]}, {"tokens": ["7"]}, {"tokens": ["3", "-4", "-"]}],
  lambda tokens: __import__("functools").reduce(lambda st, t: st[:-2] + [{"+": lambda a, b: a + b, "-": lambda a, b: a - b, "*": lambda a, b: a * b, "/": lambda a, b: int(a / b)}[t](st[-2], st[-1])] if t in "+-*/" and len(t) == 1 else st + [int(t)], tokens, [])[0],
  "Push numbers; on an operator pop two (the second popped is the left operand), apply it, push the result.", ["1 <= tokens.length <= 10^4"])

# =========================== LINKED LIST ===========================
P("reverse-linked-list", "Reverse Linked List", "Easy", "Linked List", ["Linked List", "Recursion"],
  ["Given the head of a singly linked list, reverse the list and return the new head.",
   "ListNode has fields val and next."],
  ("reverseList", [("head", "ListNode")], "ListNode"),
  [{"head": [1, 2, 3, 4, 5]}, {"head": [1, 2]}, {"head": []}, {"head": [7]}, {"head": rand_list(15)}],
  lambda head: head[::-1], "Walk the list keeping prev, curr and next; point curr.next back to prev at each step.", ["0 <= list length <= 5000"])

P("middle-linked-list", "Middle of the Linked List", "Easy", "Linked List", ["Linked List", "Two Pointers"],
  ["Return the middle node of a linked list. If there are two middle nodes, return the second one. (The returned list runs from that node to the end.)"],
  ("middleNode", [("head", "ListNode")], "ListNode"),
  [{"head": [1, 2, 3, 4, 5]}, {"head": [1, 2, 3, 4, 5, 6]}, {"head": [1]}, {"head": [1, 2]}, {"head": list(range(1, 12))}],
  lambda head: head[len(head) // 2:], "Slow pointer moves 1 step, fast moves 2; when fast reaches the end, slow is in the middle.", ["1 <= list length <= 100"])

P("remove-duplicates-list", "Remove Duplicates from Sorted List", "Easy", "Linked List", ["Linked List"],
  ["Given the head of a sorted linked list, delete duplicates so each value appears once. Return the list."],
  ("deleteDuplicates", [("head", "ListNode")], "ListNode"),
  [{"head": [1, 1, 2]}, {"head": [1, 1, 2, 3, 3]}, {"head": []}, {"head": [5, 5, 5]}, {"head": sorted(rand_list(20, 0, 8))}],
  lambda head: sorted(set(head)), "If curr.next has the same value as curr, skip it with curr.next = curr.next.next.", ["0 <= list length <= 300"])

P("merge-lists-palindrome", "Palindrome Linked List", "Easy", "Linked List", ["Linked List", "Two Pointers"],
  ["Given the head of a singly linked list, return true if its values read the same forward and backward."],
  ("isPalindrome", [("head", "ListNode")], "boolean"),
  [{"head": [1, 2, 2, 1]}, {"head": [1, 2]}, {"head": [1]}, {"head": [1, 2, 3, 2, 1]}, {"head": [1, 2, 3, 3, 1]}],
  lambda head: head == head[::-1], "Find the middle, reverse the second half, then compare the halves node by node.", ["1 <= list length <= 10^5"])

P("remove-nth-from-end", "Remove Nth Node From End", "Medium", "Linked List", ["Linked List", "Two Pointers"],
  ["Remove the n-th node from the end of a linked list and return its head."],
  ("removeNthFromEnd", [("head", "ListNode"), ("n", "int")], "ListNode"),
  [{"head": [1, 2, 3, 4, 5], "n": 2}, {"head": [1], "n": 1}, {"head": [1, 2], "n": 1}, {"head": [1, 2], "n": 2}, {"head": list(range(10)), "n": 10}],
  lambda head, n: head[:len(head) - n] + head[len(head) - n + 1:],
  "Move a fast pointer n steps ahead, then move both; a dummy node before head handles removing the head.", ["1 <= n <= list length <= 30"])

P("odd-even-list", "Odd Even Linked List", "Medium", "Linked List", ["Linked List"],
  ["Reorder a linked list so all nodes at odd positions (1st, 3rd, ...) come first, followed by nodes at even positions, keeping the relative order within each group."],
  ("oddEvenList", [("head", "ListNode")], "ListNode"),
  [{"head": [1, 2, 3, 4, 5]}, {"head": [2, 1, 3, 5, 6, 4, 7]}, {"head": []}, {"head": [1, 2]}, {"head": rand_list(11)}],
  lambda head: head[0::2] + head[1::2], "Build two chains, odd and even, as you walk; then attach even's head to odd's tail.", ["0 <= list length <= 10^4"])

# =========================== MATRIX ===========================
P("diagonal-sum", "Matrix Diagonal Sum", "Easy", "Matrix", ["Matrix", "Arrays"],
  ["Given a square matrix mat, return the sum of its primary diagonal and secondary diagonal, counting the centre element only once when n is odd."],
  ("diagonalSum", [("mat", "int[][]")], "int"),
  [{"mat": [[1, 2, 3], [4, 5, 6], [7, 8, 9]]}, {"mat": [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]]}, {"mat": [[5]]}, {"mat": [[1, 2], [3, 4]]}, {"mat": [rand_list(5, 0, 9) for _ in range(5)]}],
  lambda mat: sum(mat[i][i] + mat[i][len(mat) - 1 - i] for i in range(len(mat))) - (mat[len(mat) // 2][len(mat) // 2] if len(mat) % 2 else 0),
  "Add mat[i][i] and mat[i][n-1-i] for each row; subtract the centre once if n is odd.", ["1 <= n <= 100"])

P("rotate-image", "Rotate Image", "Medium", "Matrix", ["Matrix", "Arrays"],
  ["Rotate an n x n matrix 90 degrees clockwise and return it. Try to do it in place."],
  ("rotate", [("matrix", "int[][]")], "int[][]"),
  [{"matrix": [[1, 2, 3], [4, 5, 6], [7, 8, 9]]}, {"matrix": [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]}, {"matrix": [[1]]}, {"matrix": [[1, 2], [3, 4]]}],
  lambda matrix: [list(r) for r in zip(*matrix[::-1])], "Transpose the matrix, then reverse each row.", ["1 <= n <= 20"])

P("set-matrix-zeroes", "Set Matrix Zeroes", "Medium", "Matrix", ["Matrix", "Hash Set"],
  ["If an element of the matrix is 0, set its entire row and column to 0. Return the matrix."],
  ("setZeroes", [("matrix", "int[][]")], "int[][]"),
  [{"matrix": [[1, 1, 1], [1, 0, 1], [1, 1, 1]]}, {"matrix": [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]}, {"matrix": [[1]]}, {"matrix": [[1, 0]]}, {"matrix": [[1, 2, 3], [4, 5, 6]]}],
  lambda matrix: (lambda R, C: [[0 if i in R or j in C else v for j, v in enumerate(row)] for i, row in enumerate(matrix)])({i for i, r in enumerate(matrix) if 0 in r}, {j for r in matrix for j, v in enumerate(r) if v == 0}),
  "First record which rows and columns contain a zero, then zero them in a second pass.", ["1 <= m, n <= 200"])

P("spiral-order", "Spiral Order", "Medium", "Matrix", ["Matrix", "Simulation"],
  ["Return all elements of an m x n matrix in spiral order: along the top row, down the right column, back along the bottom, up the left, and inward."],
  ("spiralOrder", [("matrix", "int[][]")], "int[]"),
  [{"matrix": [[1, 2, 3], [4, 5, 6], [7, 8, 9]]}, {"matrix": [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]}, {"matrix": [[7]]}, {"matrix": [[1], [2], [3]]}],
  lambda matrix: (lambda f: f(f, [r[:] for r in matrix]))(lambda f, m: [] if not m else m[0] + f(f, [list(r) for r in zip(*m[1:])][::-1])),
  "Keep four boundaries (top, bottom, left, right) and shrink them after walking each side.", ["1 <= m, n <= 10"])

# =========================== BIT MANIPULATION ===========================
P("count-set-bits", "Number of 1 Bits", "Easy", "Bit Manipulation", ["Bit Manipulation"],
  ["Given a non-negative integer n, return how many 1 bits its binary representation has."],
  ("hammingWeight", [("n", "int")], "int"),
  [{"n": 11}, {"n": 128}, {"n": 0}, {"n": 2147483645}, {"n": 255}],
  lambda n: bin(n).count("1"), "n & (n - 1) clears the lowest set bit; count how many times you can do it.", ["0 <= n <= 2^31 - 1"])

P("single-number", "Single Number", "Easy", "Bit Manipulation", ["Bit Manipulation", "Arrays"],
  ["Every element in nums appears twice except one. Return that one, using O(1) extra space."],
  ("singleNumber", [("nums", "int[]")], "int"),
  [{"nums": [2, 2, 1]}, {"nums": [4, 1, 2, 1, 2]}, {"nums": [1]}, {"nums": [-3, 7, 7]}, {"nums": [9, 4, 9, 6, 4]}],
  lambda nums: __import__("functools").reduce(lambda a, b: a ^ b, nums), "x ^ x = 0 and x ^ 0 = x, so XOR of everything leaves the single number.", ["1 <= nums.length <= 3 * 10^4"])

P("counting-bits", "Counting Bits", "Easy", "Bit Manipulation", ["Bit Manipulation", "Dynamic Programming"],
  ["Given n, return an array ans of length n + 1 where ans[i] is the number of 1 bits in i."],
  ("countBits", [("n", "int")], "int[]"),
  [{"n": 2}, {"n": 5}, {"n": 0}, {"n": 16}],
  lambda n: [bin(i).count("1") for i in range(n + 1)], "ans[i] = ans[i >> 1] + (i & 1).", ["0 <= n <= 10^5"])

# =========================== GREEDY ===========================
P("assign-cookies", "Assign Cookies", "Easy", "Greedy", ["Greedy", "Sorting", "Two Pointers"],
  ["Child i is content with a cookie of size at least g[i]; cookie j has size s[j]. Each child gets at most one cookie. Return the maximum number of content children."],
  ("findContentChildren", [("g", "int[]"), ("s", "int[]")], "int"),
  [{"g": [1, 2, 3], "s": [1, 1]}, {"g": [1, 2], "s": [1, 2, 3]}, {"g": [10, 9, 8, 7], "s": [5, 6, 7, 8]}, {"g": [1], "s": []}, {"g": rand_list(15, 1, 10), "s": rand_list(12, 1, 10)}],
  lambda g, s: (lambda g, s: __import__("functools").reduce(lambda i, c: i + (i < len(g) and c >= g[i]), s, 0))(sorted(g), sorted(s)),
  "Sort both. Give each cookie, smallest first, to the least greedy child it can satisfy.", ["1 <= g.length <= 3 * 10^4", "0 <= s.length <= 3 * 10^4"])

P("stock-ii", "Best Time to Buy and Sell Stock II", "Medium", "Greedy", ["Greedy", "Arrays"],
  ["prices[i] is a stock's price on day i. You may buy and sell many times, holding at most one share at a time. Return the maximum profit."],
  ("maxProfit", [("prices", "int[]")], "int"),
  [{"prices": [7, 1, 5, 3, 6, 4]}, {"prices": [1, 2, 3, 4, 5]}, {"prices": [7, 6, 4, 3, 1]}, {"prices": [5]}, {"prices": rand_list(30, 1, 50)}],
  lambda prices: sum(max(0, prices[i + 1] - prices[i]) for i in range(len(prices) - 1)), "Add every positive day-to-day increase.", ["1 <= prices.length <= 3 * 10^4"])

P("jump-game", "Jump Game", "Medium", "Greedy", ["Greedy", "Arrays"],
  ["You start at index 0 of nums; nums[i] is the maximum jump length from i. Return true if you can reach the last index."],
  ("canJump", [("nums", "int[]")], "boolean"),
  [{"nums": [2, 3, 1, 1, 4]}, {"nums": [3, 2, 1, 0, 4]}, {"nums": [0]}, {"nums": [1, 0, 1]}, {"nums": [2, 0, 0]}],
  lambda nums: __import__("functools").reduce(lambda far, i: max(far, i + nums[i]) if far >= i else -1, range(len(nums)), 0) >= len(nums) - 1,
  "Track the furthest index reachable so far; if you ever stand beyond it, you're stuck.", ["1 <= nums.length <= 10^4"])

# =========================== TREES ===========================
TREE_NOTE = "The tree is given in level order, with null for a missing child (as on LeetCode). TreeNode has fields val, left and right."
P("max-depth-tree", "Maximum Depth of Binary Tree", "Easy", "Trees", ["Trees", "Recursion", "DFS"],
  ["Return the maximum depth of a binary tree: the number of nodes on the longest path from the root down to a leaf.", TREE_NOTE],
  ("maxDepth", [("root", "TreeNode")], "int"),
  [{"root": [3, 9, 20, None, None, 15, 7]}, {"root": [1, None, 2]}, {"root": []}, {"root": [1, 2, 3, 4, None, None, None, 5]}],
  lambda root: (lambda f: f(f, tree(root)))(lambda f, n: 0 if not n else 1 + max(f(f, n.l), f(f, n.r))),
  "depth(node) = 1 + max(depth(left), depth(right)); an empty tree has depth 0.", ["0 <= nodes <= 10^4"])

P("invert-tree", "Invert Binary Tree", "Easy", "Trees", ["Trees", "Recursion"],
  ["Mirror a binary tree (swap every node's left and right children) and return its root.", TREE_NOTE],
  ("invertTree", [("root", "TreeNode")], "TreeNode"),
  [{"root": [4, 2, 7, 1, 3, 6, 9]}, {"root": [2, 1, 3]}, {"root": []}, {"root": [1, 2]}],
  lambda root: untree((lambda f: f(f, tree(root)))(lambda f, n: n and T(n.v, f(f, n.r), f(f, n.l)))),
  "Swap the children of the root, then invert both subtrees recursively.", ["0 <= nodes <= 100"])

P("same-tree", "Same Tree", "Easy", "Trees", ["Trees", "Recursion"],
  ["Given the roots of two binary trees p and q, return true if they have the same shape and the same values.", TREE_NOTE],
  ("isSameTree", [("p", "TreeNode"), ("q", "TreeNode")], "boolean"),
  [{"p": [1, 2, 3], "q": [1, 2, 3]}, {"p": [1, 2], "q": [1, None, 2]}, {"p": [1, 2, 1], "q": [1, 1, 2]}, {"p": [], "q": []}],
  lambda p, q: untree(tree(p)) == untree(tree(q)), "Both empty: true. One empty or values differ: false. Otherwise compare left and right recursively.", ["0 <= nodes <= 100"])

P("inorder-traversal", "Binary Tree Inorder Traversal", "Easy", "Trees", ["Trees", "DFS", "Stack"],
  ["Return the values of a binary tree in inorder: left subtree, then the node, then right subtree.", TREE_NOTE],
  ("inorderTraversal", [("root", "TreeNode")], "int[]"),
  [{"root": [1, None, 2, 3]}, {"root": []}, {"root": [1]}, {"root": [4, 2, 6, 1, 3, 5, 7]}],
  lambda root: (lambda f: f(f, tree(root)))(lambda f, n: [] if not n else f(f, n.l) + [n.v] + f(f, n.r)),
  "Recursion is three lines. For an iterative version, push left children onto a stack.", ["0 <= nodes <= 100"])

P("path-sum", "Path Sum", "Easy", "Trees", ["Trees", "DFS"],
  ["Return true if the tree has a root-to-leaf path whose values add up to targetSum.", TREE_NOTE],
  ("hasPathSum", [("root", "TreeNode"), ("targetSum", "int")], "boolean"),
  [{"root": [5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1], "targetSum": 22}, {"root": [1, 2, 3], "targetSum": 5}, {"root": [], "targetSum": 0}, {"root": [1, 2], "targetSum": 1}],
  lambda root, targetSum: (lambda f: f(f, tree(root), targetSum))(lambda f, n, t: False if not n else (t == n.v if not n.l and not n.r else f(f, n.l, t - n.v) or f(f, n.r, t - n.v))),
  "Subtract each node's value as you go down; at a leaf, check whether what's left equals its value.", ["0 <= nodes <= 5000"])

P("level-order", "Binary Tree Level Order Traversal", "Medium", "Trees", ["Trees", "BFS", "Queue"],
  ["Return the values of a binary tree level by level, left to right: one list per level.", TREE_NOTE],
  ("levelOrder", [("root", "TreeNode")], "int[][]"),
  [{"root": [3, 9, 20, None, None, 15, 7]}, {"root": [1]}, {"root": []}, {"root": [1, 2, 3, 4, 5, 6, 7]}],
  lambda root: (lambda f: f(f, [tree(root)] if root else []))(lambda f, lvl: [] if not lvl else [[n.v for n in lvl]] + f(f, [c for n in lvl for c in (n.l, n.r) if c])),
  "Use a queue. Each round, process exactly as many nodes as the queue held at the start: that's one level.", ["0 <= nodes <= 2000"])

P("validate-bst", "Validate Binary Search Tree", "Medium", "Trees", ["Trees", "DFS", "Binary Search Tree"],
  ["Return true if the tree is a valid binary search tree: every node's left subtree holds only smaller values and its right subtree only larger values.", TREE_NOTE],
  ("isValidBST", [("root", "TreeNode")], "boolean"),
  [{"root": [2, 1, 3]}, {"root": [5, 1, 4, None, None, 3, 6]}, {"root": [5, 4, 6, None, None, 3, 7]}, {"root": [1]}, {"root": [2, 2, 2]}],
  lambda root: (lambda v: v == sorted(set(v)))((lambda f: f(f, tree(root)))(lambda f, n: [] if not n else f(f, n.l) + [n.v] + f(f, n.r))),
  "Pass down the allowed (low, high) range, or check that an inorder traversal is strictly increasing.", ["1 <= nodes <= 10^4"])

P("diameter-tree", "Diameter of Binary Tree", "Medium", "Trees", ["Trees", "DFS"],
  ["Return the diameter of a binary tree: the number of edges on the longest path between any two nodes. The path may skip the root.", TREE_NOTE],
  ("diameterOfBinaryTree", [("root", "TreeNode")], "int"),
  [{"root": [1, 2, 3, 4, 5]}, {"root": [1, 2]}, {"root": [1]}, {"root": [1, 2, None, 3, 4, 5, None, None, 6]}],
  None,
  "At each node the longest path through it is height(left) + height(right). Track the best while computing heights.", ["1 <= nodes <= 10^4"])

# =========================== HEAP ===========================
P("last-stone", "Last Stone Weight", "Easy", "Heap", ["Heap", "Priority Queue"],
  ["Each turn, smash the two heaviest stones x <= y together: if equal both vanish, otherwise a stone of weight y - x remains. Return the weight of the last stone, or 0 if none are left."],
  ("lastStoneWeight", [("stones", "int[]")], "int"),
  [{"stones": [2, 7, 4, 1, 8, 1]}, {"stones": [1]}, {"stones": [3, 3]}, {"stones": [10, 4, 2, 10]}, {"stones": rand_list(20, 1, 30)}],
  None,
  "A max-heap gives you the two heaviest stones each turn.", ["1 <= stones.length <= 30"])

P("kth-largest", "Kth Largest Element in an Array", "Medium", "Heap", ["Heap", "Priority Queue", "Sorting"],
  ["Return the k-th largest element of nums (in sorted order, not the k-th distinct). Try a min-heap of size k instead of sorting everything."],
  ("findKthLargest", [("nums", "int[]"), ("k", "int")], "int"),
  [{"nums": [3, 2, 1, 5, 6, 4], "k": 2}, {"nums": [3, 2, 3, 1, 2, 4, 5, 5, 6], "k": 4}, {"nums": [1], "k": 1}, {"nums": rand_list(50), "k": 10}, {"nums": [7, 7, 7], "k": 2}],
  lambda nums, k: sorted(nums)[-k], "Keep a min-heap of the k largest seen; its top is the answer.", ["1 <= k <= nums.length <= 10^5"])

P("top-k-frequent", "Top K Frequent Elements", "Medium", "Heap", ["Heap", "Hash Map", "Sorting"],
  ["Return the k most frequent elements of nums, ordered from most to least frequent. Break ties by the smaller value first."],
  ("topKFrequent", [("nums", "int[]"), ("k", "int")], "int[]"),
  [{"nums": [1, 1, 1, 2, 2, 3], "k": 2}, {"nums": [1], "k": 1}, {"nums": [4, 4, 5, 5, 6], "k": 2}, {"nums": rand_list(60, 0, 9), "k": 3}],
  lambda nums, k: [v for v, _ in sorted(Counter(nums).items(), key=lambda kv: (-kv[1], kv[0]))[:k]],
  "Count with a map, then pick the top k by (count desc, value asc) with a heap or a sort.", ["1 <= k <= number of distinct values"])

P("k-closest", "K Closest Points to Origin", "Medium", "Heap", ["Heap", "Sorting", "Math"],
  ["Given points [x, y], return the k points closest to the origin (0, 0), nearest first. Break ties by smaller x, then smaller y."],
  ("kClosest", [("points", "int[][]"), ("k", "int")], "int[][]"),
  [{"points": [[1, 3], [-2, 2]], "k": 1}, {"points": [[3, 3], [5, -1], [-2, 4]], "k": 2}, {"points": [[0, 1], [1, 0]], "k": 2}, {"points": [[rng.randint(-9, 9), rng.randint(-9, 9)] for _ in range(15)], "k": 4}],
  lambda points, k: sorted(points, key=lambda p: (p[0] ** 2 + p[1] ** 2, p[0], p[1]))[:k],
  "Compare squared distances (no square roots needed). A max-heap of size k keeps the closest.", ["1 <= k <= points.length <= 10^4"])

# =========================== BACKTRACKING ===========================
P("generate-parentheses", "Generate Parentheses", "Medium", "Backtracking", ["Backtracking", "Recursion", "Strings"],
  ["Given n pairs of parentheses, return every well-formed combination, sorted in lexicographic order (\"(\" comes before \")\")."],
  ("generateParenthesis", [("n", "int")], "String[]"),
  [{"n": 3}, {"n": 1}, {"n": 2}, {"n": 4}],
  lambda n: sorted((lambda f: f(f, "", 0, 0))(lambda f, s, o, c: [s] if len(s) == 2 * n else (f(f, s + "(", o + 1, c) if o < n else []) + (f(f, s + ")", o, c + 1) if c < o else []))),
  "Build the string character by character: add \"(\" while open < n, add \")\" while close < open.", ["1 <= n <= 8"])

P("subsets", "Subsets", "Medium", "Backtracking", ["Backtracking", "Recursion", "Bit Manipulation"],
  ["Given an array of distinct integers nums sorted ascending, return all of its subsets. Each subset keeps nums' order, and the list of subsets is in lexicographic order (so [] first, then [1], [1,2], ...)."],
  ("subsets", [("nums", "int[]")], "int[][]"),
  [{"nums": [1, 2, 3]}, {"nums": [0]}, {"nums": [1, 5]}, {"nums": [-1, 2, 4, 7]}],
  lambda nums: sorted([[nums[i] for i in range(len(nums)) if m >> i & 1] for m in range(1 << len(nums))]),
  "Depth-first: at each index decide to take nums[i] or skip it. Visiting \"take\" before moving on gives lexicographic order.", ["1 <= nums.length <= 10", "nums is sorted and distinct"])

P("permutations", "Permutations", "Medium", "Backtracking", ["Backtracking", "Recursion"],
  ["Given an array of distinct integers nums sorted ascending, return all permutations in lexicographic order."],
  ("permute", [("nums", "int[]")], "int[][]"),
  [{"nums": [1, 2, 3]}, {"nums": [0, 1]}, {"nums": [1]}, {"nums": [1, 2, 3, 4]}],
  lambda nums: [list(p) for p in __import__("itertools").permutations(nums)],
  "Choose each unused number in increasing order for the next position, recurse, then un-choose it.", ["1 <= nums.length <= 6", "nums is sorted and distinct"])

P("combination-sum-count", "Combination Sum (Count)", "Medium", "Backtracking", ["Backtracking", "Recursion", "Dynamic Programming"],
  ["Given distinct positive candidates and a target, count the unique combinations whose values add up to target. A candidate may be used any number of times; [2,2,3] and [3,2,2] are the same combination."],
  ("combinationSum", [("candidates", "int[]"), ("target", "int")], "int"),
  [{"candidates": [2, 3, 6, 7], "target": 7}, {"candidates": [2, 3, 5], "target": 8}, {"candidates": [2], "target": 1}, {"candidates": [1, 2], "target": 4}, {"candidates": [3, 4, 5], "target": 20}],
  lambda candidates, target: (lambda ways: ([ways.__setitem__(t, ways[t] + ways[t - c]) for c in candidates for t in range(c, target + 1)], ways[target])[1])([1] + [0] * target),
  "Recurse with a start index so you never go back to earlier candidates: that's what prevents duplicates.", ["1 <= candidates.length <= 30", "1 <= target <= 40"])

# =========================== GRAPHS ===========================
P("flood-fill", "Flood Fill", "Easy", "Graphs", ["Graphs", "DFS", "BFS", "Matrix"],
  ["image is a grid of colours. Starting at (sr, sc), recolour that pixel and every pixel connected to it (up, down, left, right) with the same original colour to the new colour. Return the image."],
  ("floodFill", [("image", "int[][]"), ("sr", "int"), ("sc", "int"), ("color", "int")], "int[][]"),
  [{"image": [[1, 1, 1], [1, 1, 0], [1, 0, 1]], "sr": 1, "sc": 1, "color": 2}, {"image": [[0, 0, 0], [0, 0, 0]], "sr": 0, "sc": 0, "color": 0}, {"image": [[0, 1], [1, 0]], "sr": 0, "sc": 0, "color": 5}, {"image": [[2, 2, 2], [2, 3, 2], [2, 2, 2]], "sr": 0, "sc": 0, "color": 9}],
  None,  # filled below
  "DFS or BFS from the start; if the new colour equals the old one, return the image unchanged.", ["1 <= m, n <= 50"])

P("number-of-islands", "Number of Islands", "Medium", "Graphs", ["Graphs", "DFS", "BFS", "Matrix"],
  ["grid is a map of 1s (land) and 0s (water). An island is land connected up, down, left or right. Return the number of islands."],
  ("numIslands", [("grid", "int[][]")], "int"),
  [{"grid": [[1, 1, 1, 1, 0], [1, 1, 0, 1, 0], [1, 1, 0, 0, 0], [0, 0, 0, 0, 0]]}, {"grid": [[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 1]]}, {"grid": [[0]]}, {"grid": [[rng.randint(0, 1) for _ in range(8)] for _ in range(6)]}],
  None,
  "Scan every cell; each time you find unvisited land, count an island and sink all of it with DFS or BFS.", ["1 <= m, n <= 300"])

P("max-area-island", "Max Area of Island", "Medium", "Graphs", ["Graphs", "DFS", "Matrix"],
  ["In a grid of 1s (land) and 0s (water), return the area (number of cells) of the largest island, or 0 if there is no land. Cells connect up, down, left and right."],
  ("maxAreaOfIsland", [("grid", "int[][]")], "int"),
  [{"grid": [[0, 0, 1, 0, 0], [0, 1, 1, 0, 1], [0, 1, 0, 0, 1], [0, 0, 0, 1, 1]]}, {"grid": [[0, 0, 0]]}, {"grid": [[1]]}, {"grid": [[rng.randint(0, 1) for _ in range(9)] for _ in range(7)]}],
  None,
  "Same as counting islands, but have the DFS return how many cells it sank.", ["1 <= m, n <= 50"])

P("rotting-oranges", "Rotting Oranges", "Medium", "Graphs", ["Graphs", "BFS", "Matrix"],
  ["In the grid, 0 is empty, 1 is a fresh orange and 2 is a rotten one. Every minute, fresh oranges next to a rotten one (up, down, left, right) rot. Return the minutes until none are fresh, or -1 if that never happens."],
  ("orangesRotting", [("grid", "int[][]")], "int"),
  [{"grid": [[2, 1, 1], [1, 1, 0], [0, 1, 1]]}, {"grid": [[2, 1, 1], [0, 1, 1], [1, 0, 1]]}, {"grid": [[0, 2]]}, {"grid": [[1]]}, {"grid": [[2, 1, 1, 1, 1, 1]]}],
  None,
  "Multi-source BFS: start the queue with every rotten orange and count levels.", ["1 <= m, n <= 10"])

P("number-of-provinces", "Number of Provinces", "Medium", "Graphs", ["Graphs", "DFS", "Union Find"],
  ["isConnected[i][j] is 1 if cities i and j are directly connected. A province is a group of cities connected directly or indirectly. Return the number of provinces."],
  ("findCircleNum", [("isConnected", "int[][]")], "int"),
  [{"isConnected": [[1, 1, 0], [1, 1, 0], [0, 0, 1]]}, {"isConnected": [[1, 0, 0], [0, 1, 0], [0, 0, 1]]}, {"isConnected": [[1]]}, {"isConnected": [[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]]}],
  None,
  "Run DFS from every unvisited city; each new start is a new province.", ["1 <= n <= 200"])

P("course-schedule", "Course Schedule", "Medium", "Graphs", ["Graphs", "Topological Sort", "BFS"],
  ["There are numCourses courses labelled 0 to numCourses - 1. prerequisites[i] = [a, b] means you must take b before a. Return true if you can finish every course (that is, there is no cycle)."],
  ("canFinish", [("numCourses", "int"), ("prerequisites", "int[][]")], "boolean"),
  [{"numCourses": 2, "prerequisites": [[1, 0]]}, {"numCourses": 2, "prerequisites": [[1, 0], [0, 1]]}, {"numCourses": 1, "prerequisites": []}, {"numCourses": 4, "prerequisites": [[1, 0], [2, 1], [3, 2]]}, {"numCourses": 3, "prerequisites": [[0, 1], [1, 2], [2, 0]]}],
  None,
  "Kahn's algorithm: repeatedly take courses with no remaining prerequisites; if you take all of them, there's no cycle.", ["1 <= numCourses <= 2000"])

# =========================== DYNAMIC PROGRAMMING ===========================
P("climbing-stairs", "Climbing Stairs", "Easy", "Dynamic Programming", ["Dynamic Programming", "Recursion"],
  ["You climb a staircase of n steps, taking 1 or 2 steps at a time. In how many distinct ways can you reach the top?"],
  ("climbStairs", [("n", "int")], "int"),
  [{"n": 2}, {"n": 3}, {"n": 1}, {"n": 10}, {"n": 45}],
  lambda n: __import__("functools").reduce(lambda ab, _: (ab[1], ab[0] + ab[1]), range(n), (1, 1))[0],
  "ways(n) = ways(n - 1) + ways(n - 2). It's Fibonacci in disguise.", ["1 <= n <= 45"])

P("min-cost-stairs", "Min Cost Climbing Stairs", "Easy", "Dynamic Programming", ["Dynamic Programming", "Arrays"],
  ["cost[i] is the cost of stepping on stair i. You can start at stair 0 or 1, and climb 1 or 2 stairs at a time. Return the minimum cost to reach just past the last stair."],
  ("minCostClimbingStairs", [("cost", "int[]")], "int"),
  [{"cost": [10, 15, 20]}, {"cost": [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]}, {"cost": [0, 0]}, {"cost": rand_list(25, 0, 99)}],
  None,
  "dp[i] = cost[i] + min(dp[i - 1], dp[i - 2]); the answer is min of the last two.", ["2 <= cost.length <= 1000"])

P("house-robber", "House Robber", "Medium", "Dynamic Programming", ["Dynamic Programming", "Arrays"],
  ["nums[i] is the money in house i along a street. You can't rob two adjacent houses. Return the most money you can rob."],
  ("rob", [("nums", "int[]")], "int"),
  [{"nums": [1, 2, 3, 1]}, {"nums": [2, 7, 9, 3, 1]}, {"nums": [5]}, {"nums": [2, 1, 1, 2]}, {"nums": rand_list(30, 0, 100)}],
  lambda nums: __import__("functools").reduce(lambda ab, x: (ab[1], max(ab[1], ab[0] + x)), nums, (0, 0))[1],
  "For each house: best = max(skip it, rob it + best from two houses back).", ["1 <= nums.length <= 100"])

P("coin-change", "Coin Change", "Medium", "Dynamic Programming", ["Dynamic Programming", "Arrays"],
  ["Given coin denominations and an amount, return the fewest coins that make up the amount, or -1 if it can't be made. You have unlimited coins of each kind."],
  ("coinChange", [("coins", "int[]"), ("amount", "int")], "int"),
  [{"coins": [1, 2, 5], "amount": 11}, {"coins": [2], "amount": 3}, {"coins": [1], "amount": 0}, {"coins": [186, 419, 83, 408], "amount": 6249}, {"coins": [3, 7], "amount": 5}],
  None,
  "dp[a] = 1 + min(dp[a - coin]) over coins that fit; dp[0] = 0.", ["1 <= coins.length <= 12", "0 <= amount <= 10^4"])

P("unique-paths", "Unique Paths", "Medium", "Dynamic Programming", ["Dynamic Programming", "Math", "Matrix"],
  ["A robot at the top-left of an m x n grid can only move right or down. How many different paths reach the bottom-right corner?"],
  ("uniquePaths", [("m", "int"), ("n", "int")], "int"),
  [{"m": 3, "n": 7}, {"m": 3, "n": 2}, {"m": 1, "n": 1}, {"m": 10, "n": 10}, {"m": 2, "n": 15}],
  lambda m, n: __import__("math").comb(m + n - 2, m - 1), "paths[r][c] = paths[r - 1][c] + paths[r][c - 1]; the first row and column are all 1.", ["1 <= m, n <= 100", "The answer fits in a 32-bit integer"])

P("lis", "Longest Increasing Subsequence", "Medium", "Dynamic Programming", ["Dynamic Programming", "Binary Search"],
  ["Return the length of the longest strictly increasing subsequence of nums (elements in order, not necessarily adjacent)."],
  ("lengthOfLIS", [("nums", "int[]")], "int"),
  [{"nums": [10, 9, 2, 5, 3, 7, 101, 18]}, {"nums": [0, 1, 0, 3, 2, 3]}, {"nums": [7, 7, 7, 7]}, {"nums": [4]}, {"nums": rand_list(40, 0, 60)}],
  None,
  "O(n^2): dp[i] = 1 + max(dp[j]) for j < i with nums[j] < nums[i]. O(n log n) uses binary search on tails.", ["1 <= nums.length <= 2500"])

P("lcs", "Longest Common Subsequence", "Medium", "Dynamic Programming", ["Dynamic Programming", "Strings"],
  ["Return the length of the longest subsequence common to strings text1 and text2 (characters in order, not necessarily adjacent)."],
  ("longestCommonSubsequence", [("text1", "String"), ("text2", "String")], "int"),
  [{"text1": "abcde", "text2": "ace"}, {"text1": "abc", "text2": "abc"}, {"text1": "abc", "text2": "def"}, {"text1": "placement", "text2": "plantation"}],
  None,
  "dp[i][j] = dp[i-1][j-1] + 1 if the characters match, else max(dp[i-1][j], dp[i][j-1]).", ["1 <= lengths <= 1000"])


# ---------- reference solutions too long for a lambda ----------
def flood_fill(image, sr, sc, color):
    img = [r[:] for r in image]; old = img[sr][sc]
    if old == color:
        return img
    st = [(sr, sc)]
    while st:
        r, c = st.pop()
        if 0 <= r < len(img) and 0 <= c < len(img[0]) and img[r][c] == old:
            img[r][c] = color; st += [(r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)]
    return img


def island_sizes(grid):
    g = [r[:] for r in grid]; sizes = []
    for i in range(len(g)):
        for j in range(len(g[0])):
            if g[i][j] == 1:
                n, st = 0, [(i, j)]
                while st:
                    r, c = st.pop()
                    if 0 <= r < len(g) and 0 <= c < len(g[0]) and g[r][c] == 1:
                        g[r][c] = 0; n += 1; st += [(r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)]
                sizes.append(n)
    return sizes


def oranges(grid):
    g = [r[:] for r in grid]
    q = deque((i, j) for i in range(len(g)) for j in range(len(g[0])) if g[i][j] == 2)
    fresh = sum(v == 1 for r in g for v in r); t = 0
    while q and fresh:
        for _ in range(len(q)):
            r, c = q.popleft()
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < len(g) and 0 <= nc < len(g[0]) and g[nr][nc] == 1:
                    g[nr][nc] = 2; fresh -= 1; q.append((nr, nc))
        t += 1
    return -1 if fresh else t


def provinces(m):
    seen, n = set(), 0
    for s in range(len(m)):
        if s not in seen:
            n += 1; st = [s]
            while st:
                u = st.pop()
                if u not in seen:
                    seen.add(u); st += [v for v in range(len(m)) if m[u][v]]
    return n


def compress(s):
    parts, i = [], 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]:
            j += 1
        parts.append(f"{s[i]}{j - i}"); i = j
    c = "".join(parts)
    return c if len(c) < len(s) else s


def koko(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        k = (lo + hi) // 2
        if sum(-(-p // k) for p in piles) <= h:
            hi = k
        else:
            lo = k + 1
    return lo


def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def diameter(root):
    best = 0

    def height(n):
        nonlocal best
        if not n:
            return 0
        l, r = height(n.l), height(n.r)
        best = max(best, l + r)
        return 1 + max(l, r)

    height(tree(root))
    return best


def last_stone(stones):
    h = [-s for s in stones]; heapq.heapify(h)
    while len(h) > 1:
        y, x = -heapq.heappop(h), -heapq.heappop(h)
        if y != x:
            heapq.heappush(h, -(y - x))
    return -h[0] if h else 0


def min_cost(cost):
    a = b = 0  # cheapest way to stand on the previous two stairs
    for c in cost:
        a, b = b, c + min(a, b)
    return min(a, b)


def can_finish(numCourses, prerequisites):
    indeg = [0] * numCourses; adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a); indeg[a] += 1
    q = deque(i for i in range(numCourses) if indeg[i] == 0); done = 0
    while q:
        u = q.popleft(); done += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return done == numCourses


def coin_change(coins, amount):
    INF = float("inf"); dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        dp[a] = min((dp[a - c] + 1 for c in coins if c <= a), default=INF)
    return -1 if dp[amount] == INF else dp[amount]


def lis(nums):
    dp = [1] * len(nums)
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)


def lcs(text1, text2):
    dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]
    for i in range(1, len(text1) + 1):
        for j in range(1, len(text2) + 1):
            dp[i][j] = dp[i - 1][j - 1] + 1 if text1[i - 1] == text2[j - 1] else max(dp[i - 1][j], dp[i][j - 1])
    return dp[-1][-1]


SOLVERS = {
    "string-compression": compress,
    "koko-bananas": koko,
    "fibonacci": fib,
    "diameter-tree": diameter,
    "last-stone": last_stone,
    "min-cost-stairs": min_cost,
    "flood-fill": flood_fill,
    "number-of-islands": lambda grid: len(island_sizes(grid)),
    "max-area-island": lambda grid: max(island_sizes(grid), default=0),
    "rotting-oranges": lambda grid: oranges(grid),
    "number-of-provinces": lambda isConnected: provinces(isConnected),
    "course-schedule": can_finish,
    "coin-change": coin_change,
    "lis": lambda nums: lis(nums),
    "lcs": lcs,
}


# ---------- compact specs: frontend/scripts/core_problems/*.py ----------
def C(*args):
    """One test case: positional arguments in the signature's order."""
    return args


def Q(cat, slug, title, diff, sig, desc, cases, solve, hint, tags=(), visible=2):
    """sig like "maxProfit(prices: int[], k: int) -> int"; desc a string or list; solve takes positional args."""
    method, plist, ret = re.match(r"\s*(\w+)\((.*)\)\s*->\s*(\S+)\s*$", sig).groups()
    params = [tuple(x.strip() for x in p.split(":")) for p in plist.split(",") if p.strip()]
    names = [n for n, _ in params]
    for c in cases:
        assert len(c) == len(names), (slug, c)
    P(slug, title, diff, cat, list(dict.fromkeys([cat, *tags])), [desc] if isinstance(desc, str) else desc,
      (method, params, ret), [dict(zip(names, c)) for c in cases],
      lambda **kw: solve(*[kw[n] for n in names]), hint, visible=visible)


def rl(n, lo=-50, hi=50):
    return [rng.randint(lo, hi) for _ in range(n)]


def rs(n, letters="abc"):
    return "".join(rng.choice(letters) for _ in range(n))


TOPIC_DIR = Path(__file__).resolve().parent / "core_problems"
for _f in sorted(TOPIC_DIR.glob("*.py")):
    exec(compile(_f.read_text(encoding="utf-8"), str(_f), "exec"), globals())  # topic files share this file's helpers


def build():
    out, hidden = {}, {}
    seen = set()
    for p in PROBLEMS:
        assert p["slug"] not in seen, p["slug"]
        seen.add(p["slug"])
        solve = p["solve"] or SOLVERS[p["slug"]]
        pid = f"c-{p['slug']}"
        tests = []
        for i, inp in enumerate(p["cases"]):
            args = {k: json.loads(json.dumps(v)) for k, v in inp.items()}
            expected = solve(**json.loads(json.dumps(args)))  # solve gets a copy, so it can't change the input
            assert set(args) == {n for n, _ in p["params"]}, (pid, args)
            tests.append({"input": args, "expectedOutput": expected})
        visible = [{"id": f"case-{i + 1}", **t} for i, t in enumerate(tests[: p["visible"]])]
        rest = [{"id": f"hidden-{i + 1}", **t} for i, t in enumerate(tests[p["visible"]:])]
        out[pid] = {
            "id": pid,
            "slug": p["slug"],
            "title": p["title"],
            "difficulty": p["difficulty"],
            "category": p["category"],
            "topics": p["tags"],
            "description": p["description"],
            "constraints": p["constraints"],
            "hint": p["hint"],
            "functionSignature": {
                "language": "java",
                "className": "Solution",
                "methodName": p["method"],
                "returnType": p["returns"],
                "parameters": [{"name": n, "type": t} for n, t in p["params"]],
            },
            "visibleTests": visible,
            "hiddenTests": [],
            "hiddenCount": len(rest),
        }
        hidden[pid] = rest
    (ROOT / "frontend/lib/problems/core.json").write_text(json.dumps(out, ensure_ascii=False) + "\n", encoding="utf-8")
    (ROOT / "backend/data/core_hidden_tests.json").write_text(json.dumps(hidden, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    by = Counter(p["category"] for p in PROBLEMS)
    print(f"{len(PROBLEMS)} problems:", dict(by))


if __name__ == "__main__":
    build()
