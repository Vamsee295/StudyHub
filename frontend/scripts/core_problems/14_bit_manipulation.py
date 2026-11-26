# Bit manipulation (Striver A2Z bit manipulation step, LeetCode classics).
BM = "Bit Manipulation"

def _xor_upto(n):
    return [n, 1, n + 1, 0][n % 4]


Q(BM, "check-kth-bit", "Check if the K-th Bit Is Set", "Easy", "isKthBitSet(n: int, k: int) -> boolean",
  "Return true if bit k (0 = least significant) of the non-negative integer n is 1.",
  [C(5, 0), C(5, 1), C(4, 2), C(0, 3), C(1073741824, 30)], lambda n, k: bool(n >> k & 1), "(n >> k) & 1, or n & (1 << k).")

Q(BM, "set-kth-bit", "Set the K-th Bit", "Easy", "setKthBit(n: int, k: int) -> int",
  "Return n with bit k (0 = least significant) set to 1.",
  [C(10, 2), C(15, 3), C(0, 0), C(8, 3), C(1, 29)], lambda n, k: n | (1 << k), "n | (1 << k).")

Q(BM, "toggle-kth-bit", "Toggle the K-th Bit", "Easy", "toggleKthBit(n: int, k: int) -> int",
  "Return n with bit k (0 = least significant) flipped.",
  [C(10, 1), C(10, 2), C(0, 4), C(7, 0)], lambda n, k: n ^ (1 << k), "n ^ (1 << k).")

Q(BM, "swap-without-temp", "Swap Two Numbers Without a Temporary Variable", "Easy", "swap(a: int, b: int) -> int[]",
  "Return [b, a], swapping the values with XOR (no third variable).",
  [C(5, 9), C(0, 1), C(-3, 7), C(42, 42)], lambda a, b: [b, a], "a ^= b; b ^= a; a ^= b.")

Q(BM, "single-number-ii", "Single Number II", "Medium", "singleNumber(nums: int[]) -> int",
  "Every value in nums appears three times except one, which appears once. Return it in O(n) time and O(1) space.",
  [C([2, 2, 3, 2]), C([0, 1, 0, 1, 0, 1, 99]), C([-2, -2, 1, 1, 4, 1, 4, 4, -4, -2]), C([7])], lambda a: next(v for v, c in Counter(a).items() if c == 1),
  "Count each bit position modulo 3; the leftover bits form the answer.", ["Arrays"])

Q(BM, "single-number-iii", "Single Number III", "Medium", "singleNumber(nums: int[]) -> int[]",
  "Exactly two values in nums appear once; all others appear twice. Return the two values in increasing order.",
  [C([1, 2, 1, 3, 2, 5]), C([-1, 0]), C([0, 1]), C([4, 1, 2, 1, 2, 9, 7, 7])], lambda a: sorted(v for v, c in Counter(a).items() if c == 1),
  "XOR everything to get a ^ b; split the numbers by any set bit of it and XOR each group.", ["Arrays"])

Q(BM, "reverse-bits", "Reverse Bits", "Easy", "reverseBits(n: int) -> int",
  "Reverse the 32 bits of n and return the result. (Inputs are even, so the answer fits in a signed 32-bit int.)",
  [C(43261596), C(0), C(2), C(1073741824), C(964176192)], lambda n: int(f"{n:032b}"[::-1], 2), "Loop 32 times: result = (result << 1) | (n & 1); n >>= 1.")

Q(BM, "hamming-distance", "Hamming Distance", "Easy", "hammingDistance(x: int, y: int) -> int",
  "Return the number of bit positions where x and y differ.",
  [C(1, 4), C(3, 1), C(0, 0), C(2147483647, 0), C(93, 73)], lambda x, y: bin(x ^ y).count("1"), "Count the set bits of x ^ y.")

Q(BM, "xor-1-to-n", "XOR of Numbers from 1 to N", "Easy", "xorUpTo(n: int) -> int",
  "Return 1 ^ 2 ^ ... ^ n in O(1).",
  [C(5), C(1), C(4), C(0), C(1000000000)], _xor_upto, "The XOR prefix repeats every 4: n, 1, n + 1, 0 for n % 4 = 0, 1, 2, 3.", ["Math"])

Q(BM, "xor-l-to-r", "XOR of Numbers in a Range", "Easy", "xorRange(l: int, r: int) -> int",
  "Return l ^ (l + 1) ^ ... ^ r.",
  [C(3, 5), C(1, 3), C(4, 8), C(7, 7), C(123456, 999999999)], lambda l, r: _xor_upto(r) ^ _xor_upto(l - 1), "xorUpTo(r) ^ xorUpTo(l - 1).", ["Math"])

Q(BM, "divide-two-integers", "Divide Two Integers", "Medium", "divide(dividend: int, divisor: int) -> int",
  "Divide without using *, / or %. Truncate toward zero. If the result overflows the 32-bit signed range, return 2^31 - 1.",
  [C(10, 3), C(7, -3), C(0, 1), C(-2147483648, -1), C(-2147483648, 2), C(2147483647, 1)],
  lambda a, b: min(2**31 - 1, max(-2**31, abs(a) // abs(b) * (1 if (a < 0) == (b < 0) else -1))),
  "Work with longs (or negatives) and subtract the largest shifted divisor (divisor << k) that fits, adding 1 << k.", ["Math"])

Q(BM, "min-bit-flips", "Minimum Bit Flips to Convert Number", "Easy", "minBitFlips(start: int, goal: int) -> int",
  "Return the minimum number of single-bit flips to turn start into goal.",
  [C(10, 7), C(3, 4), C(0, 0), C(1000000000, 1)], lambda s, g: bin(s ^ g).count("1"), "Same as Hamming distance.")

Q(BM, "number-complement", "Number Complement", "Easy", "findComplement(num: int) -> int",
  "Flip every bit of num's binary representation (no leading zeros) and return the result.",
  [C(5), C(1), C(10), C(2147483647), C(8)], lambda n: n ^ ((1 << n.bit_length()) - 1), "XOR with a mask of all 1s as long as num's bit length.")

Q(BM, "binary-gap", "Binary Gap", "Easy", "binaryGap(n: int) -> int",
  "Return the longest distance between two adjacent 1 bits of n (positions differ by the gap), or 0 if there are fewer than two 1s.",
  [C(22), C(8), C(5), C(6), C(1041)], lambda n: max((b - a for a, b in zip(_ones(n), _ones(n)[1:])), default=0), "Track the index of the last 1 seen while scanning bits.")

Q(BM, "range-bitwise-and", "Bitwise AND of Numbers Range", "Medium", "rangeBitwiseAnd(left: int, right: int) -> int",
  "Return the bitwise AND of every number from left to right inclusive.",
  [C(5, 7), C(0, 0), C(1, 2147483647), C(12, 15), C(600000000, 2147483645)], lambda l, r: _range_and(l, r), "The answer is the common binary prefix of left and right.")

Q(BM, "total-hamming-distance", "Total Hamming Distance", "Medium", "totalHammingDistance(nums: int[]) -> int",
  "Return the sum of Hamming distances over every pair of values in nums.",
  [C([4, 14, 2]), C([4, 14, 4]), C([1]), C(rl(30, 0, 1000))], lambda a: sum(bin(a[i] ^ a[j]).count("1") for i in range(len(a)) for j in range(i + 1, len(a))),
  "For each bit, ones * zeros pairs differ there.", ["Math"])

Q(BM, "maximum-xor-pair", "Maximum XOR of Two Numbers in an Array", "Medium", "findMaximumXOR(nums: int[]) -> int",
  "Return the maximum of nums[i] ^ nums[j] over all pairs (i may equal j).",
  [C([3, 10, 5, 25, 2, 8]), C([14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70]), C([0]), C(rl(30, 0, 100000))],
  lambda a: max(x ^ y for x in a for y in a), "Build the answer bit by bit from the top with a prefix set, or use a binary trie.", ["Trie", "Hash Set"])

Q(BM, "sum-without-plus", "Sum of Two Integers", "Medium", "getSum(a: int, b: int) -> int",
  "Return a + b without using + or -.",
  [C(1, 2), C(2, 3), C(-5, 3), C(-12, -8), C(1000, -1000)], lambda a, b: a + b, "a ^ b adds without carry; (a & b) << 1 is the carry. Repeat until the carry is 0.", ["Math"])

Q(BM, "decode-xored-array", "Decode XORed Array", "Easy", "decode(encoded: int[], first: int) -> int[]",
  "encoded[i] = arr[i] ^ arr[i + 1]. Given encoded and arr[0] = first, return arr.",
  [C([1, 2, 3], 1), C([6, 2, 7, 3], 4), C([], 9), C(rl(8, 0, 30), 5)], lambda e, f: list(itertools.accumulate(e, lambda x, y: x ^ y, initial=f)),
  "arr[i + 1] = arr[i] ^ encoded[i].", ["Arrays"])

Q(BM, "min-flips-or", "Minimum Flips to Make a OR b Equal to c", "Medium", "minFlips(a: int, b: int, c: int) -> int",
  "Return the fewest single-bit flips in a and b so that a | b == c.",
  [C(2, 6, 5), C(4, 2, 7), C(1, 2, 3), C(8, 3, 5)], lambda a, b, c: sum((2 if (a >> i & 1) and (b >> i & 1) else (a >> i & 1) + (b >> i & 1)) if not (c >> i & 1) else int(not ((a | b) >> i & 1)) for i in range(32)),
  "Bit by bit: if c's bit is 0, flip every 1 in a and b; if it's 1 and both are 0, flip one.")

Q(BM, "alternating-bits", "Binary Number with Alternating Bits", "Easy", "hasAlternatingBits(n: int) -> boolean",
  "Return true if adjacent bits of n always differ.",
  [C(5), C(7), C(11), C(10), C(1)], lambda n: "00" not in bin(n) and "11" not in bin(n), "x = n ^ (n >> 1) must be all 1s: check x & (x + 1) == 0.")

Q(BM, "xor-operation-array", "XOR Operation in an Array", "Easy", "xorOperation(n: int, start: int) -> int",
  "nums[i] = start + 2 * i for i in 0..n-1. Return the XOR of all elements of nums.",
  [C(5, 0), C(4, 3), C(1, 7), C(10, 5)], lambda n, s: reduce(lambda x, y: x ^ y, (s + 2 * i for i in range(n)), 0), "A direct loop is fine; there is also an O(1) formula.", ["Math"])

Q(BM, "prime-set-bits", "Prime Number of Set Bits in Binary Representation", "Easy", "countPrimeSetBits(left: int, right: int) -> int",
  "Count numbers in [left, right] whose number of set bits is a prime number.",
  [C(6, 10), C(10, 15), C(1, 1), C(842, 888)], lambda l, r: sum(bin(x).count("1") in (2, 3, 5, 7, 11, 13, 17, 19) for x in range(l, r + 1)), "Bit counts are at most 20, so check against a small set of primes.", ["Math"])

Q(BM, "concatenated-binary", "Concatenation of Consecutive Binary Numbers", "Medium", "concatenatedBinary(n: int) -> int",
  "Concatenate the binary representations of 1 to n in order and return that number modulo 1,000,000,007.",
  [C(1), C(3), C(12), C(100000)], lambda n: reduce(lambda acc, i: ((acc << i.bit_length()) | i) % (10**9 + 7), range(1, n + 1), 0),
  "Shift the running value left by the bit length of i, add i, take the modulo.", ["Math"])

Q(BM, "prefix-xor-original", "Find the Original Array of Prefix Xor", "Medium", "findArray(pref: int[]) -> int[]",
  "pref[i] = arr[0] ^ arr[1] ^ ... ^ arr[i]. Return arr.",
  [C([5, 2, 0, 3, 1]), C([13]), C([0, 0, 7]), C(rl(10, 0, 100))], lambda p: [p[0]] + [p[i] ^ p[i - 1] for i in range(1, len(p))], "arr[i] = pref[i] ^ pref[i - 1].", ["Arrays"])

Q(BM, "neighboring-xor", "Neighboring Bitwise XOR", "Medium", "doesValidArrayExist(derived: int[]) -> boolean",
  "derived[i] = original[i] ^ original[(i + 1) % n] for some binary array original. Return true if such an original exists.",
  [C([1, 1, 0]), C([1, 1]), C([1, 0]), C([0]), C([rng.randint(0, 1) for _ in range(9)])], lambda d: reduce(lambda x, y: x ^ y, d) == 0,
  "XOR of all derived values equals original[0] ^ original[0] = 0.", ["Arrays"])


def _ones(n):
    return [i for i in range(32) if n >> i & 1]


def _range_and(l, r):
    shift = 0
    while l != r:
        l, r, shift = l >> 1, r >> 1, shift + 1
    return l << shift
