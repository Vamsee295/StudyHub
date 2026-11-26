# Basics: loops, conditionals and number manipulation (Striver A2Z "Basic Maths", LeetCode easy classics).
B = "Basics"

Q(B, "count-digits", "Count Digits", "Easy", "countDigits(n: int) -> int",
  "Given a non-negative integer n, return how many digits it has. 0 has one digit.",
  [C(12345), C(0), C(7), C(1000000), C(2147483647)], lambda n: len(str(n)),
  "Divide by 10 until the number becomes 0, counting the steps (handle 0 separately).", ["Math", "Loops"])

Q(B, "palindrome-number", "Palindrome Number", "Easy", "isPalindrome(x: int) -> boolean",
  "Return true if the integer x reads the same backward as forward. Negative numbers are never palindromes. Try it without converting to a string.",
  [C(121), C(-121), C(10), C(0), C(1234321), C(123421)], lambda x: str(x) == str(x)[::-1],
  "Build the reversed number digit by digit (rev = rev * 10 + x % 10) and compare.", ["Math"])

Q(B, "reverse-integer", "Reverse Integer", "Medium", "reverse(x: int) -> int",
  "Reverse the digits of a 32-bit signed integer x. If the reversed value falls outside the 32-bit signed range [-2^31, 2^31 - 1], return 0.",
  [C(123), C(-123), C(120), C(0), C(1534236469), C(-2147483412)],
  lambda x: (lambda r: r if -2**31 <= r <= 2**31 - 1 else 0)(int(str(abs(x))[::-1]) * (1 if x >= 0 else -1)),
  "Pop digits with % 10 and push with * 10. Check for overflow before each push.", ["Math"])

Q(B, "gcd", "Greatest Common Divisor", "Easy", "gcd(a: int, b: int) -> int",
  "Return the greatest common divisor of two positive integers a and b.",
  [C(12, 18), C(17, 5), C(100, 75), C(7, 7), C(1071, 462)], math.gcd,
  "Euclid: gcd(a, b) = gcd(b, a % b), and gcd(a, 0) = a.", ["Math"])

Q(B, "lcm", "Least Common Multiple", "Easy", "lcm(a: int, b: int) -> int",
  "Return the least common multiple of two positive integers a and b. The answer fits in a 32-bit integer.",
  [C(4, 6), C(5, 7), C(12, 18), C(1, 9), C(21, 6)], lambda a, b: a * b // math.gcd(a, b),
  "lcm(a, b) = a / gcd(a, b) * b. Divide first to avoid overflow.", ["Math"])

Q(B, "all-divisors", "All Divisors", "Easy", "divisors(n: int) -> int[]",
  "Return every positive divisor of n in increasing order. Aim for O(sqrt(n)).",
  [C(36), C(1), C(13), C(100), C(97)], lambda n: [d for d in range(1, n + 1) if n % d == 0],
  "Divisors come in pairs (d, n / d) with d <= sqrt(n). Collect both halves, then merge in order.", ["Math"])

Q(B, "is-prime", "Check Prime", "Easy", "isPrime(n: int) -> boolean",
  "Return true if n is a prime number. 0 and 1 are not prime.",
  [C(2), C(1), C(17), C(21), C(7919), C(1000000)], lambda n: n > 1 and all(n % d for d in range(2, math.isqrt(n) + 1)),
  "Only test divisors up to sqrt(n).", ["Math"])

Q(B, "fizz-buzz", "Fizz Buzz", "Easy", "fizzBuzz(n: int) -> String[]",
  "Return an array of strings for 1..n: \"FizzBuzz\" for multiples of 15, \"Fizz\" for multiples of 3, \"Buzz\" for multiples of 5, otherwise the number itself.",
  [C(3), C(5), C(15), C(1)], lambda n: ["FizzBuzz" if i % 15 == 0 else "Fizz" if i % 3 == 0 else "Buzz" if i % 5 == 0 else str(i) for i in range(1, n + 1)],
  "Check divisibility by 15 first, then 3, then 5.", ["Conditionals", "Loops"])

Q(B, "sum-1-to-n", "Sum of First N Numbers", "Easy", "sumN(n: int) -> int",
  "Return 1 + 2 + ... + n. Try both a loop and the closed formula.",
  [C(5), C(1), C(0), C(100), C(10000)], lambda n: n * (n + 1) // 2, "n(n + 1) / 2.", ["Math", "Loops"])

Q(B, "count-primes", "Count Primes", "Medium", "countPrimes(n: int) -> int",
  "Return how many prime numbers are strictly less than n. Use the Sieve of Eratosthenes.",
  [C(10), C(0), C(1), C(2), C(100), C(5000)], lambda n: sum(1 for k in range(2, n) if all(k % d for d in range(2, math.isqrt(k) + 1))),
  "Mark multiples of each prime p starting from p * p as composite.", ["Math", "Arrays"])

Q(B, "power-of-three", "Power of Three", "Easy", "isPowerOfThree(n: int) -> boolean",
  "Return true if n is a power of three (1, 3, 9, 27, ...).",
  [C(27), C(0), C(-3), C(9), C(45), C(1162261467)], lambda n: n > 0 and 3 ** round(math.log(n, 3)) == n,
  "Keep dividing by 3 while divisible; you should end at 1.", ["Math", "Loops"])

Q(B, "ugly-number", "Ugly Number", "Easy", "isUgly(n: int) -> boolean",
  "An ugly number is a positive integer whose only prime factors are 2, 3 and 5. Return true if n is ugly. 1 counts as ugly.",
  [C(6), C(1), C(14), C(0), C(-6), C(600)], lambda n: n > 0 and reduce(_strip, (2, 3, 5), n) == 1,
  "Divide out every 2, 3 and 5; ugly numbers end at 1.", ["Math"])

Q(B, "add-digits", "Add Digits", "Easy", "addDigits(num: int) -> int",
  "Repeatedly add all digits of num until one digit remains, and return it.",
  [C(38), C(0), C(9), C(99999), C(123456789)], lambda num: 0 if num == 0 else 1 + (num - 1) % 9,
  "Loop until it's one digit, or use the digital-root formula 1 + (num - 1) % 9.", ["Math"])

Q(B, "happy-number", "Happy Number", "Easy", "isHappy(n: int) -> boolean",
  "Replace n by the sum of the squares of its digits, repeatedly. If this reaches 1, n is happy; if it loops forever without reaching 1, it isn't. Return whether n is happy.",
  [C(19), C(2), C(1), C(7), C(4)], lambda n: _happy(n),
  "Detect the cycle with a set of seen values, or with slow and fast pointers.", ["Math", "Hash Set"])

Q(B, "valid-perfect-square", "Valid Perfect Square", "Easy", "isPerfectSquare(num: int) -> boolean",
  "Return true if num is a perfect square, without using a built-in square root.",
  [C(16), C(14), C(1), C(808201), C(2147483647)], lambda num: math.isqrt(num) ** 2 == num,
  "Binary search k in [1, num] for k * k == num (use long for the product).", ["Math", "Binary Search"])

Q(B, "excel-column-number", "Excel Column Number", "Easy", "titleToNumber(columnTitle: String) -> int",
  "Excel columns are labelled A, B, ..., Z, AA, AB, ... Given a column title, return its column number (A = 1, Z = 26, AA = 27).",
  [C("A"), C("AB"), C("ZY"), C("FXSHRXW")], lambda s: reduce(lambda a, ch: a * 26 + ord(ch) - 64, s, 0),
  "It's base 26 with digits 1..26: result = result * 26 + (ch - 'A' + 1).", ["Math", "Strings"])

Q(B, "excel-column-title", "Excel Column Title", "Easy", "convertToTitle(columnNumber: int) -> String",
  "Given a column number, return its Excel column title (1 = A, 28 = AB, 701 = ZY).",
  [C(1), C(28), C(701), C(2147483647), C(52)], lambda n: _title(n),
  "Subtract 1 before each % 26 step, because there's no zero digit.", ["Math", "Strings"])

Q(B, "factorial-trailing-zeroes", "Factorial Trailing Zeroes", "Medium", "trailingZeroes(n: int) -> int",
  "Return how many trailing zeros n! has. Do it in O(log n) without computing n!.",
  [C(3), C(5), C(0), C(25), C(10000)], lambda n: sum(n // 5 ** k for k in range(1, 20)),
  "Each zero comes from a factor 10 = 2 x 5, and 5s are rarer. Count n/5 + n/25 + n/125 + ...", ["Math"])

Q(B, "self-dividing-numbers", "Self Dividing Numbers", "Easy", "selfDividingNumbers(left: int, right: int) -> int[]",
  "A self-dividing number is divisible by every one of its digits and contains no 0. Return all self-dividing numbers in [left, right].",
  [C(1, 22), C(47, 85), C(10, 10), C(100, 130)], lambda l, r: [x for x in range(l, r + 1) if "0" not in str(x) and all(x % int(d) == 0 for d in str(x))],
  "For each number, peel off digits with % 10 and test them.", ["Math", "Loops"])

Q(B, "tribonacci", "N-th Tribonacci Number", "Easy", "tribonacci(n: int) -> int",
  "T0 = 0, T1 = 1, T2 = 1 and T(n+3) = T(n) + T(n+1) + T(n+2). Return T(n).",
  [C(4), C(25), C(0), C(1), C(37)], lambda n: reduce(lambda t, _: (t[1], t[2], sum(t)), range(n), (0, 1, 1))[0],
  "Keep the last three values in variables and roll them forward.", ["Math", "Loops"])

Q(B, "base-7", "Base 7", "Easy", "convertToBase7(num: int) -> String",
  "Return the base-7 representation of the integer num as a string (negative numbers keep a leading minus).",
  [C(100), C(-7), C(0), C(48), C(-1000000)], lambda n: ("-" if n < 0 else "") + _base(abs(n), 7),
  "Repeatedly take num % 7 and divide by 7; the digits come out in reverse.", ["Math", "Strings"])


def _strip(x, p):
    while x % p == 0:
        x //= p
    return x


def _happy(n):
    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = sum(int(d) ** 2 for d in str(n))
    return n == 1


def _title(n):
    s = ""
    while n:
        n -= 1
        s = chr(65 + n % 26) + s
        n //= 26
    return s


def _base(n, b):
    if n == 0:
        return "0"
    s = ""
    while n:
        s = str(n % b) + s
        n //= b
    return s
