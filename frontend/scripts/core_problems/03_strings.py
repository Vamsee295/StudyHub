# Strings (Striver A2Z strings step, LeetCode classics).
S = "Strings"

Q(S, "remove-outermost-parentheses", "Remove Outermost Parentheses", "Easy", "removeOuterParentheses(s: String) -> String",
  "s is a valid parentheses string made of primitive groups like \"(()())\". Remove the outermost pair of every primitive group and return the result.",
  [C("(()())(())"), C("(()())(())(()(()))"), C("()()"), C("((()))")], lambda s: _strip_outer(s),
  "Track depth: copy a character unless it opens at depth 0 or closes back to depth 0.", ["Stack"])

Q(S, "largest-odd-number", "Largest Odd Number in String", "Easy", "largestOddNumber(num: String) -> String",
  "num is a large integer written as a string. Return the largest-valued odd integer that is a non-empty substring of num, or \"\" if there is none.",
  [C("52"), C("4206"), C("35427"), C("7"), C("2468")], lambda s: s[: max((i + 1 for i, c in enumerate(s) if int(c) % 2), default=0)],
  "Find the last odd digit; everything up to it is the answer.")

Q(S, "isomorphic-strings", "Isomorphic Strings", "Easy", "isIsomorphic(s: String, t: String) -> boolean",
  "Two strings are isomorphic if the characters of s can be replaced one-to-one to get t (no two characters map to the same one). Return whether s and t are isomorphic.",
  [C("egg", "add"), C("foo", "bar"), C("paper", "title"), C("badc", "baba"), C("a", "a")],
  lambda s, t: len(set(s)) == len(set(t)) == len(set(zip(s, t))), "Keep two maps (s->t and t->s) and check both stay consistent.", ["Hash Map"])

Q(S, "rotate-string", "Rotate String", "Easy", "rotateString(s: String, goal: String) -> boolean",
  "Return true if goal can be obtained by moving some number of characters from the front of s to its back.",
  [C("abcde", "cdeab"), C("abcde", "abced"), C("aa", "a"), C("", ""), C("abab", "baba")], lambda s, g: len(s) == len(g) and g in s + s,
  "Every rotation of s is a substring of s + s.")

Q(S, "sort-characters-by-frequency", "Sort Characters by Frequency", "Medium", "frequencySort(s: String) -> String",
  "Sort the characters of s by how often they occur, most frequent first. Characters with equal frequency appear in increasing character order (by code).",
  [C("tree"), C("cccaaa"), C("Aabb"), C("z"), C("mississippi")],
  lambda s: "".join(ch * n for ch, n in sorted(Counter(s).items(), key=lambda kv: (-kv[1], kv[0]))),
  "Count characters, then sort the distinct characters by (count desc, char asc), or bucket by count.", ["Hash Map", "Sorting"])

Q(S, "max-nesting-depth", "Maximum Nesting Depth of Parentheses", "Easy", "maxDepth(s: String) -> int",
  "s is a valid expression with digits, operators and parentheses. Return the maximum depth of nested parentheses.",
  [C("(1+(2*3)+((8)/4))+1"), C("(1)+((2))+(((3)))"), C("1+2"), C("()(())")], lambda s: max(itertools.accumulate((c == "(") - (c == ")") for c in s), default=0) if s else 0,
  "Count +1 for \"(\" and -1 for \")\" and remember the maximum.")

Q(S, "roman-to-integer", "Roman to Integer", "Easy", "romanToInt(s: String) -> int",
  "Convert a Roman numeral (I, V, X, L, C, D, M with subtractive pairs like IV and CM) to an integer.",
  [C("III"), C("LVIII"), C("MCMXCIV"), C("IX"), C("MMMCMXCIX")], lambda s: _roman(s),
  "Add each value, but subtract it when the next symbol is larger.", ["Math", "Hash Map"])

Q(S, "string-to-integer-atoi", "String to Integer (atoi)", "Medium", "myAtoi(s: String) -> int",
  ["Implement atoi: skip leading spaces, read an optional + or -, then read digits until a non-digit. Clamp the result to the 32-bit signed range [-2^31, 2^31 - 1]. If no digits are read, return 0."],
  [C("42"), C("   -042"), C("1337c0d3"), C("0-1"), C("words and 987"), C("-91283472332"), C("+")], lambda s: _atoi(s),
  "Handle each phase in order: spaces, sign, digits. Check for overflow before multiplying by 10.")

Q(S, "longest-palindromic-substring", "Longest Palindromic Substring", "Medium", "longestPalindrome(s: String) -> String",
  "Return the longest palindromic substring of s. If several have the same length, return the one that starts first.",
  [C("babad"), C("cbbd"), C("a"), C("forgeeksskeegfor"), C("abacdfgdcaba")],
  lambda s: max((s[i:j] for i in range(len(s)) for j in range(i + 1, len(s) + 1) if s[i:j] == s[i:j][::-1]), key=len),
  "Expand around every centre (each character and each gap); keep the longest seen.", ["Two Pointers", "Dynamic Programming"])

Q(S, "sum-of-beauty", "Sum of Beauty of All Substrings", "Medium", "beautySum(s: String) -> int",
  "The beauty of a string is (highest character frequency) - (lowest frequency among characters that appear). Return the sum of the beauty of every substring of s.",
  [C("aabcb"), C("aabcbaa"), C("a"), C("abc"), C(rs(25))],
  lambda s: sum((lambda c: max(c.values()) - min(c.values()))(Counter(s[i:j])) for i in range(len(s)) for j in range(i + 1, len(s) + 1)),
  "For each start, extend the end one character at a time while updating a count[26].", ["Hash Map"])

Q(S, "reverse-vowels", "Reverse Vowels of a String", "Easy", "reverseVowels(s: String) -> String",
  "Reverse only the vowels (a, e, i, o, u in either case) of s and return it.",
  [C("hello"), C("leetcode"), C("aA"), C("xyz"), C("Programming")], lambda s: _rev_vowels(s),
  "Two pointers from both ends that stop on vowels and swap.", ["Two Pointers"])

Q(S, "length-of-last-word", "Length of Last Word", "Easy", "lengthOfLastWord(s: String) -> int",
  "s is words separated by spaces (possibly with trailing spaces). Return the length of the last word.",
  [C("Hello World"), C("   fly me   to   the moon  "), C("luffy is still joyboy"), C("a")], lambda s: len(s.split()[-1]),
  "Skip trailing spaces from the end, then count letters until the next space.")

Q(S, "is-subsequence", "Is Subsequence", "Easy", "isSubsequence(s: String, t: String) -> boolean",
  "Return true if s is a subsequence of t: you can delete some characters of t, without reordering, to get s.",
  [C("abc", "ahbgdc"), C("axc", "ahbgdc"), C("", "abc"), C("b", "c"), C("ace", "abcde")], lambda s, t: _is_subseq(s, t),
  "Walk t once with a pointer into s that advances on each match.", ["Two Pointers"])

Q(S, "count-palindromic-substrings", "Palindromic Substrings", "Medium", "countSubstrings(s: String) -> int",
  "Return how many substrings of s are palindromes (substrings at different positions count separately).",
  [C("abc"), C("aaa"), C("a"), C("abba"), C(rs(30, "ab"))],
  lambda s: sum(s[i:j] == s[i:j][::-1] for i in range(len(s)) for j in range(i + 1, len(s) + 1)),
  "Expand around each of the 2n - 1 centres and count every successful expansion.", ["Two Pointers", "Dynamic Programming"])

Q(S, "find-first-occurrence", "Find the Index of the First Occurrence", "Easy", "strStr(haystack: String, needle: String) -> int",
  "Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.",
  [C("sadbutsad", "sad"), C("leetcode", "leeto"), C("hello", "ll"), C("a", "a"), C("mississippi", "issip")], lambda h, n: h.find(n),
  "Try each start position and compare; KMP makes it O(n + m).")


def _strip_outer(s):
    out, d = [], 0
    for c in s:
        if c == "(":
            if d:
                out.append(c)
            d += 1
        else:
            d -= 1
            if d:
                out.append(c)
    return "".join(out)


def _roman(s):
    v = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
    return sum(-v[c] if i + 1 < len(s) and v[c] < v[s[i + 1]] else v[c] for i, c in enumerate(s))


def _atoi(s):
    m = re.match(r"\s*([+-]?)(\d+)", s)
    if not m:
        return 0
    n = int(m.group(2)) * (-1 if m.group(1) == "-" else 1)
    return max(-2**31, min(2**31 - 1, n))


def _rev_vowels(s):
    idx = [i for i, c in enumerate(s) if c in "aeiouAEIOU"]
    out = list(s)
    for i, j in zip(idx, reversed(idx)):
        out[i] = s[j]
    return "".join(out)


def _is_subseq(s, t):
    it = iter(t)
    return all(c in it for c in s)
