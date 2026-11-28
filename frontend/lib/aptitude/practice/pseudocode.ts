// Generated output-prediction practice for the Pseudocode course. Each template builds the code text and
// runs the same logic in TypeScript, so the printed answer is computed, never typed by hand.
import { near, type Generator, type Maker, type RawQ, type Rng } from "./core";

const ASK = "What does this pseudocode print?";
const idiv = (a: number, b: number) => Math.trunc(a / b);
const code = (...lines: string[]) => lines.join("\n");

/** Numeric output: the answer plus three nearby wrong values (and any traps passed in `extra`). */
function pn(r: Rng, src: string, ans: number, e: string, extra: number[] = [], q = ASK): RawQ {
  const step = Math.max(1, Math.round(Math.abs(ans) * 0.15));
  return { q, code: src, correct: String(ans), wrong: near(r, ans, { step, extra }).map(String), explanation: e };
}
/** Text output with hand-picked trap answers. */
const pt = (src: string, correct: string, wrong: string[], e: string, q = ASK): RawQ => ({ q, code: src, correct, wrong, explanation: e });
const distinct = (r: Rng, n: number, lo: number, hi: number) => {
  const s = new Set<number>();
  while (s.size < n) s.add(r.int(lo, hi));
  return [...s];
};
const bin = (n: number, w = 4) => n.toString(2).padStart(w, "0");

// ── 1. How to read pseudocode ──
const read: Generator = {
  Easy: [
    (r) => {
      const [a, b] = [r.int(2, 9), r.int(10, 20)];
      return pt(code("Integer a, b, c", `Set a = ${a}, b = ${b}`, "c = a + b", "a = c - a", "b = c - b", "Print a, b"), `${b} ${a}`, [`${a} ${b}`, `${b} ${b}`, `${a + b} ${a}`],
        `c = ${a} + ${b} = ${a + b}; a = ${a + b} − ${a} = ${b}; b = ${a + b} − ${b} = ${a}. The values swap.`);
    },
    (r) => {
      const [x, y] = distinct(r, 2, 2, 30);
      return pt(code(`Integer x = ${x}, y = ${y}`, "x = y", "y = x", "Print x, y"), `${y} ${y}`, [`${y} ${x}`, `${x} ${y}`, `${x} ${x}`],
        `x = y makes x = ${y}, and the old ${x} is lost. Then y = x = ${y}. This is not a swap.`);
    },
  ],
  Medium: [
    (r) => {
      const [p, q] = [r.int(2, 6), r.int(5, 15)];
      const p1 = p * q, q1 = q - p1, p2 = p1 + q1;
      return pt(code(`Integer p = ${p}, q = ${q}`, "p = p * q", "q = q - p", "p = p + q", "Print p, q"), `${p2} ${q1}`, [`${p1} ${q1}`, `${p2} ${q}`, `${q1} ${p2}`],
        `p = ${p} × ${q} = ${p1}; q = ${q} − ${p1} = ${q1}; p = ${p1} + (${q1}) = ${p2}.`);
    },
    (r) => {
      const a = r.int(20, 99), k = r.int(3, 9);
      const b = idiv(a, k), c = a % k;
      return pt(code("Integer a, b, c", `a = ${a}`, `b = a / ${k}`, `c = a mod ${k}`, "Print b, c"), `${b} ${c}`, [`${(a / k).toFixed(1)} ${c}`, `${c} ${b}`, `${b + 1} ${c}`],
        `Integer division drops the fraction: ${a} / ${k} = ${b}. The remainder is ${a} − ${b} × ${k} = ${c}.`);
    },
  ],
  Hard: [
    (r) => {
      const [a, b, c] = distinct(r, 3, 1, 12);
      return pt(code(`Integer a = ${a}, b = ${b}, c = ${c}, t`, "t = a", "a = b", "b = c", "c = t", "a = a + c", "Print a, b, c"), `${b + a} ${c} ${a}`, [`${b} ${c} ${a}`, `${a + c} ${b} ${c}`, `${b + c} ${c} ${a}`],
        `After the rotation a = ${b}, b = ${c}, c = ${a}. Then a = ${b} + ${a} = ${a + b}.`);
    },
    (r) => {
      const [x, y] = distinct(r, 2, 3, 25);
      return pt(code(`Integer x = ${x}, y = ${y}`, "x = x + y", "y = x - y", "x = x - y", "x = x * 2", "Print x, y"), `${2 * y} ${x}`, [`${2 * x} ${y}`, `${y} ${x}`, `${2 * (x + y)} ${x}`],
        `The first three lines swap x and y without a temporary (x = ${y}, y = ${x}). Then x doubles to ${2 * y}.`);
    },
  ],
};

// ── 2. Operators and precedence ──
const ops: Generator = {
  Easy: [
    (r) => {
      const [a, b, c] = [r.int(2, 9), r.int(2, 9), r.int(2, 9)];
      return pn(r, code(`Print ${a} + ${b} * ${c}`), a + b * c, `Multiplication first: ${b} × ${c} = ${b * c}, then ${a} + ${b * c} = ${a + b * c}.`, [(a + b) * c]);
    },
    (r) => {
      const [a, b, c, d] = [r.int(2, 9), r.int(2, 9), r.int(2, 6), r.int(1, 9)];
      return pn(r, code(`Print (${a} + ${b}) * ${c} - ${d}`), (a + b) * c - d, `Brackets first: ${a + b}; then × ${c} = ${(a + b) * c}; then − ${d} = ${(a + b) * c - d}.`, [a + b * c - d, (a + b) * (c - d)]);
    },
  ],
  Medium: [
    (r) => {
      const [a, b, c, d, e, f] = [r.int(10, 30), r.int(3, 7), r.int(2, 6), r.int(2, 6), r.int(10, 40), r.int(3, 7)];
      const ans = (a % b) + c * d - idiv(e, f);
      return pn(r, code("Integer x", `x = ${a} mod ${b} + ${c} * ${d} - ${e} / ${f}`, "Print x"), ans,
        `mod, * and / come before + and −: ${a} mod ${b} = ${a % b}, ${c} × ${d} = ${c * d}, ${e} / ${f} = ${idiv(e, f)} (Integer). ${a % b} + ${c * d} − ${idiv(e, f)} = ${ans}.`, [((a % b) + c) * d - idiv(e, f)]);
    },
    (r) => {
      const [a, b, c] = [r.int(1, 9), r.int(1, 9), r.int(1, 9)];
      const p1 = a > b, p2 = b < c, p3 = a === c;
      const v = (p1 && p2) || p3 ? 1 : 0;
      return pt(code(`Integer a = ${a}, b = ${b}, c = ${c}`, "Print (a > b) && (b < c) || (a == c)"), String(v), [String(1 - v), "-1", "2"],
        `a > b is ${p1}, b < c is ${p2}, a == c is ${p3}. && binds tighter than ||: (${p1} && ${p2}) || ${p3} = ${v === 1}, printed as ${v}.`, "What is printed? (true prints 1, false prints 0)");
    },
  ],
  Hard: [
    (r) => {
      const [a0, b0] = [r.int(2, 9), r.int(2, 6)];
      const a1 = a0 + b0, b1 = b0 * a1, a2 = a1 - (b1 % 7);
      return pt(code(`Integer a = ${a0}, b = ${b0}`, "a += b", "b *= a", "a -= b mod 7", "Print a, b"), `${a2} ${b1}`, [`${a1} ${b1}`, `${a2} ${b0 * a0}`, `${a1 - b1 % 7 + 1} ${b1}`],
        `a = ${a0} + ${b0} = ${a1}; b = ${b0} × ${a1} = ${b1}; b mod 7 = ${b1 % 7}, so a = ${a1} − ${b1 % 7} = ${a2}.`);
    },
    (r) => {
      const [a, b, c] = [r.int(20, 60), r.int(3, 7), r.int(2, 5)];
      const ans = idiv(a, b) * c;
      return pn(r, code(`Print ${a} / ${b} * ${c}`), ans, `/ and * have equal precedence and run left to right: ${a} / ${b} = ${idiv(a, b)} (Integer), then × ${c} = ${ans}.`, [idiv(a, b * c), idiv(a * c, b)]);
    },
  ],
};

// ── 3. Conditions and branches ──
const cond: Generator = {
  Easy: [
    (r) => {
      const [x, k] = [r.int(1, 30), r.int(5, 20)];
      const ans = x > k ? x - k : x + k;
      return pn(r, code(`Integer x = ${x}`, `if (x > ${k})`, `  Print x - ${k}`, "else", `  Print x + ${k}`, "end if"), ans,
        `${x} > ${k} is ${x > k}, so the ${x > k ? "if" : "else"} branch runs: ${ans}.`, [x > k ? x + k : x - k]);
    },
    (r) => {
      const n = r.int(5, 40);
      const ans = n % 2 === 0 ? n / 2 : 3 * n + 1;
      return pn(r, code(`Integer n = ${n}`, "if (n mod 2 == 0)", "  Print n / 2", "else", "  Print 3 * n + 1", "end if"), ans,
        `${n} is ${n % 2 === 0 ? "even" : "odd"}, so it prints ${ans}.`, [n % 2 === 0 ? 3 * n + 1 : idiv(n, 2)]);
    },
  ],
  Medium: [
    (r) => {
      const s = r.int(30, 99);
      const g = s >= 90 ? "A" : s >= 75 ? "B" : s >= 50 ? "C" : "D";
      return pt(code(`Integer s = ${s}`, 'if (s >= 90) Print "A"', 'else if (s >= 75) Print "B"', 'else if (s >= 50) Print "C"', 'else Print "D"', "end if"), g, ["A", "B", "C", "D"].filter((x) => x !== g),
        `Checks run top to bottom and stop at the first true one: ${s} gives ${g}.`);
    },
    (r) => {
      const [a, b, c] = distinct(r, 3, 1, 50);
      const m = Math.max(a, b, c);
      return pt(code(`Integer a = ${a}, b = ${b}, c = ${c}`, "if (a > b)", "  if (a > c) Print a else Print c", "else", "  if (b > c) Print b else Print c", "end if"), String(m),
        [...[a, b, c].filter((x) => x !== m).map(String), String(m + 1)], `The nested checks pick the largest of the three: ${m}.`);
    },
  ],
  Hard: [
    (r) => {
      const [a, b, c] = [r.int(2, 20), r.int(2, 20), r.int(0, 3)];
      const ans = a % 2 === 0 && b % 3 === 0 ? a + b : a > b || c === 0 ? a - b : a * b;
      return pn(r, code(`Integer a = ${a}, b = ${b}, c = ${c}`, "if (a mod 2 == 0 && b mod 3 == 0)", "  Print a + b", "else if (a > b || c == 0)", "  Print a - b", "else", "  Print a * b", "end if"), ans,
        `First test: ${a} even is ${a % 2 === 0}, ${b} divisible by 3 is ${b % 3 === 0}. Second: ${a} > ${b} is ${a > b}, c == 0 is ${c === 0}. Result ${ans}.`, [a + b, a - b, a * b].filter((v) => v !== ans));
    },
    (r) => {
      const x0 = r.int(8, 25);
      let x = x0;
      if (x > 10) x -= 5;
      if (x > 10) x -= 5; else x += 3;
      const alt = x0 > 10 ? x0 - 5 : x0 + 3; // trap: reading the else as part of the first if
      return pn(r, code(`Integer x = ${x0}`, "if (x > 10) x = x - 5", "if (x > 10) x = x - 5", "else x = x + 3", "Print x"), x,
        `The two ifs are separate, and the second sees the updated x. Trace: ${x0} → ${x0 > 10 ? x0 - 5 : x0} → ${x}.`, [alt]);
    },
  ],
};

// ── 4. Loops and tracing ──
const fib = (n: number) => {
  let [a, b] = [0, 1];
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
};
const digitSum = (n: number) => String(n).split("").reduce((s, d) => s + +d, 0);
const loops: Generator = {
  Easy: [
    (r) => {
      const n = r.int(5, 25);
      return pn(r, code("Integer s = 0", `for i = 1 to ${n}`, "  s = s + i", "end for", "Print s"), (n * (n + 1)) / 2, `It adds 1 + 2 + … + ${n} = ${n} × ${n + 1} / 2 = ${(n * (n + 1)) / 2}.`, [(n * (n - 1)) / 2, n * n]);
    },
    (r) => {
      const n = r.int(3, 7);
      let p = 1;
      for (let i = 1; i <= n; i++) p *= i;
      return pn(r, code("Integer p = 1", `for i = 1 to ${n}`, "  p = p * i", "end for", "Print p"), p, `p multiplies 1 × 2 × … × ${n} = ${n}! = ${p}.`, [p / n]);
    },
  ],
  Medium: [
    (r) => {
      const n = r.int(100, 9999);
      return pn(r, code(`Integer n = ${n}, s = 0`, "while (n > 0)", "  s = s + n mod 10", "  n = n / 10", "end while", "Print s"), digitSum(n),
        `Each pass adds the last digit and removes it. Digits of ${n}: ${String(n).split("").join(" + ")} = ${digitSum(n)}.`, [String(n).length]);
    },
    (r) => {
      const [n, k] = [r.int(20, 100), r.int(3, 9)];
      return pn(r, code("Integer count = 0", `for i = 1 to ${n}`, `  if (i mod ${k} == 0) count = count + 1`, "end for", "Print count"), Math.floor(n / k),
        `It counts multiples of ${k} from 1 to ${n}: ⌊${n} / ${k}⌋ = ${Math.floor(n / k)}.`, [Math.floor(n / k) + 1]);
    },
  ],
  Hard: [
    (r) => {
      const n = r.int(120, 9876);
      const rev = +String(n).split("").reverse().join("");
      return pn(r, code(`Integer n = ${n}, rev = 0`, "while (n > 0)", "  rev = rev * 10 + n mod 10", "  n = n / 10", "end while", "Print rev"), rev,
        `Each pass moves the last digit of n onto the end of rev, so it reverses the number: ${rev}.`, [n, digitSum(n)]);
    },
    (r) => {
      const n = r.int(5, 12);
      return pn(r, code("Integer a = 0, b = 1, c", `for i = 1 to ${n}`, "  c = a + b", "  a = b", "  b = c", "end for", "Print b"), fib(n + 1),
        `a and b walk along the Fibonacci numbers 0, 1, 1, 2, 3, 5 … After ${n} passes b = ${fib(n + 1)}.`, [fib(n), fib(n + 2)]);
    },
  ],
};

// ── 5. Nested loops and counting ──
const nested: Generator = {
  Easy: [
    (r) => {
      const [n, m] = [r.int(3, 12), r.int(3, 12)];
      return pn(r, code("Integer count = 0", `for i = 1 to ${n}`, `  for j = 1 to ${m}`, "    count = count + 1", "  end for", "end for", "Print count"), n * m,
        `The inner loop runs ${m} times for each of the ${n} outer passes: ${n} × ${m} = ${n * m}.`, [n + m]);
    },
    (r) => {
      const n = r.int(4, 15);
      return pn(r, code("Integer count = 0", `for i = 1 to ${n}`, "  for j = 1 to i", "    count = count + 1", "  end for", "end for", "Print count"), (n * (n + 1)) / 2,
        `The inner loop runs 1, 2, …, ${n} times: total ${n} × ${n + 1} / 2 = ${(n * (n + 1)) / 2}.`, [n * n, (n * (n - 1)) / 2]);
    },
  ],
  Medium: [
    (r) => {
      const n = r.int(3, 8);
      const ans = (n * (n + 1) * (n + 2)) / 6;
      return pn(r, code("Integer s = 0", `for i = 1 to ${n}`, "  for j = 1 to i", "    s = s + j", "  end for", "end for", "Print s"), ans,
        `For each i the inner loop adds 1 + … + i. Summing those triangle numbers up to ${n} gives ${ans}.`, [(n * (n + 1)) / 2]);
    },
    (r) => {
      const n = r.int(4, 14);
      return pn(r, code("Integer count = 0", `for i = 1 to ${n}`, `  for j = i + 1 to ${n}`, "    count = count + 1", "  end for", "end for", "Print count"), (n * (n - 1)) / 2,
        `This counts pairs i < j from 1 to ${n}: ${n} × ${n - 1} / 2 = ${(n * (n - 1)) / 2}.`, [(n * (n + 1)) / 2, n * n]);
    },
  ],
  Hard: [
    (r) => {
      const [n, k] = [r.int(4, 9), r.int(3, 5)];
      let c = 0;
      for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) if ((i + j) % k === 0) c++;
      return pn(r, code("Integer count = 0", `for i = 1 to ${n}`, `  for j = 1 to ${n}`, `    if ((i + j) mod ${k} == 0) count = count + 1`, "  end for", "end for", "Print count"), c,
        `Count the pairs (i, j) from 1 to ${n} whose sum is a multiple of ${k}. Listing them by sum gives ${c}.`, [Math.floor((n * n) / k)]);
    },
    (r) => {
      const [m, n] = [r.int(2, 6), r.int(10, 100)];
      let steps = 0;
      for (let i = 1; i < n; i *= 2) steps++;
      return pn(r, code("Integer count = 0, i", `for j = 1 to ${m}`, "  i = 1", `  while (i < ${n})`, "    i = i * 2", "    count = count + 1", "  end while", "end for", "Print count"), m * steps,
        `i doubles 1, 2, 4, … and stops at the first value ≥ ${n}: ${steps} steps. The outer loop repeats this ${m} times: ${m * steps}.`, [m * (steps + 1), steps]);
    },
  ],
};

// ── 6. Functions and parameters ──
const funcs: Generator = {
  Easy: [
    (r) => {
      const [a, b, n] = [r.int(2, 6), r.int(1, 9), r.int(2, 12)];
      return pn(r, code("Function f(Integer x)", `  return x * ${a} + ${b}`, "End Function", `Print f(${n})`), n * a + b, `f(${n}) = ${n} × ${a} + ${b} = ${n * a + b}.`, [n * (a + b)]);
    },
    (r) => {
      const k = r.int(2, 30);
      return pt(code("Function change(Integer x)", "  x = x + 10", "End Function", `Integer a = ${k}`, "change(a)", "Print a"), String(k), [String(k + 10), "10", "0"],
        `Integers are passed by value: change gets a copy, so a stays ${k}.`);
    },
  ],
  Medium: [
    (r) => {
      const [a, p, q] = [r.int(1, 6), r.int(2, 9), r.int(2, 6)];
      const fx = p + a, ans = fx * q - fx;
      return pn(r, code("Function f(Integer x)", `  return x + ${a}`, "End Function", "Function g(Integer x, Integer y)", "  return x * y - x", "End Function", `Print g(f(${p}), ${q})`), ans,
        `Inner call first: f(${p}) = ${fx}. Then g(${fx}, ${q}) = ${fx} × ${q} − ${fx} = ${ans}.`, [p * q - p + a]);
    },
    (r) => {
      const n = r.int(3, 9);
      const ans = (n * (n + 1) * (2 * n + 1)) / 6;
      return pn(r, code("Function sq(Integer n)", "  Integer s = 0", "  for i = 1 to n", "    s = s + i * i", "  end for", "  return s", "End Function", `Print sq(${n})`), ans,
        `It adds the squares 1² + … + ${n}² = ${n}(${n + 1})(${2 * n + 1}) / 6 = ${ans}.`, [(n * (n + 1)) / 2]);
    },
  ],
  Hard: [
    (r) => {
      const [x, y] = distinct(r, 2, 2, 20);
      return pn(r, code(`Integer x = ${x}        // global`, "Function h()", `  Integer x = ${y}      // local`, "  x = x + 1", "  return x", "End Function", "Print h() + x"), y + 1 + x,
        `Inside h the local x hides the global: h() returns ${y + 1}. Outside, x is still the global ${x}. Total ${y + 1 + x}.`, [2 * x + 1, 2 * (y + 1)]);
    },
    (r) => {
      const [n, m] = [r.int(5, 15), r.int(3, 4)];
      let s = 0;
      for (let i = 1; i <= n; i++) s += i % m;
      return pn(r, code("Function f(Integer x)", `  return x mod ${m}`, "End Function", "Integer s = 0", `for i = 1 to ${n}`, "  s = s + f(i)", "end for", "Print s"), s,
        `f(i) cycles ${Array.from({ length: m }, (_, k) => (k + 1) % m).join(", ")}. Adding them for i = 1 to ${n} gives ${s}.`, [(n * (n + 1)) / 2 % m]);
    },
  ],
};

// ── 7. Recursion tracing ──
const recur: Generator = {
  Easy: [
    (r) => {
      const k = r.int(4, 15);
      return pn(r, code("Function f(Integer n)", "  if (n == 0) return 0", "  return n + f(n - 1)", "End Function", `Print f(${k})`), (k * (k + 1)) / 2,
        `f(${k}) = ${k} + ${k - 1} + … + 1 + 0 = ${(k * (k + 1)) / 2}.`, [(k * (k - 1)) / 2]);
    },
    (r) => {
      const k = r.int(3, 7);
      let f = 1;
      for (let i = 2; i <= k; i++) f *= i;
      return pn(r, code("Function f(Integer n)", "  if (n <= 1) return 1", "  return n * f(n - 1)", "End Function", `Print f(${k})`), f, `f(${k}) = ${k} × ${k - 1} × … × 1 = ${f}.`, [f / k]);
    },
  ],
  Medium: [
    (r) => {
      const [a, b, k] = [r.int(1, 4), r.int(1, 5), r.int(4, 7)];
      const v = [a, b];
      for (let i = 2; i <= k; i++) v.push(v[i - 1] + v[i - 2]);
      return pn(r, code("Function f(Integer n)", `  if (n == 0) return ${a}`, `  if (n == 1) return ${b}`, "  return f(n - 1) + f(n - 2)", "End Function", `Print f(${k})`), v[k],
        `Build up from the bottom: ${v.map((x, i) => `f(${i}) = ${x}`).join(", ")}.`, [v[k - 1]]);
    },
    (r) => {
      const g = r.int(2, 12), a = g * r.int(2, 9), b = g * r.int(2, 9);
      const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x);
      return pn(r, code("Function f(Integer a, Integer b)", "  if (b == 0) return a", "  return f(b, a mod b)", "End Function", `Print f(${a}, ${b})`), gcd(a, b),
        `This is Euclid's algorithm, so it returns the HCF of ${a} and ${b}: ${gcd(a, b)}.`, [Math.min(a, b), (a * b) / gcd(a, b)]);
    },
  ],
  Hard: [
    (r) => {
      const [n, d] = [r.int(3, 5), r.int(1, 2)];
      const down: number[] = [];
      for (let i = n; i > 0; i -= d) down.push(i);
      const seq = [...down, ...[...down].reverse()].join(" ");
      return pt(code("Function f(Integer n)", "  if (n > 0)", "    Print n", `    f(n - ${d})`, "    Print n", "  end if", "End Function", `f(${n})`), seq,
        [down.join(" "), [...[...down].reverse(), ...down].join(" "), [...down, ...down].join(" ")],
        `Each call prints n on the way down, then again after the inner call returns, on the way back up: ${seq}.`);
    },
    (r) => {
      const n = r.int(4, 7);
      const calls = (k: number): number => (k <= 1 ? 1 : 1 + calls(k - 1) + calls(k - 2));
      return pn(r, code("Function f(Integer n)", "  if (n <= 1) return n", "  return f(n - 1) + f(n - 2)", "End Function", `f(${n})`), calls(n),
        `Calls C(n) = 1 + C(n − 1) + C(n − 2) with C(0) = C(1) = 1, giving C(${n}) = ${calls(n)}.`, [fib(n), 2 ** n], `How many times is f called in total (counting the first call)?`);
    },
    (r) => {
      const [x, n] = [r.int(2, 3), r.int(5, 10)];
      return pn(r, code("Function p(Integer x, Integer n)", "  if (n == 0) return 1", "  Integer h = p(x, n / 2)", "  if (n mod 2 == 0) return h * h", "  return h * h * x", "End Function", `Print p(${x}, ${n})`), x ** n,
        `This is fast exponentiation: it returns ${x} to the power ${n} = ${x ** n}.`, [x * n, x ** (n - 1)]);
    },
  ],
};

// ── 8. Arrays and strings (indices start at 0) ──
const arr = (xs: number[]) => `[${xs.join(", ")}]`;
const arrays: Generator = {
  Easy: [
    (r) => {
      const a = Array.from({ length: 6 }, () => r.int(1, 20));
      const s = a.filter((x) => x % 2 === 0).reduce((p, x) => p + x, 0);
      return pn(r, code(`Integer arr[] = ${arr(a)}`, "Integer s = 0", "for i = 0 to 5", "  if (arr[i] mod 2 == 0) s = s + arr[i]", "end for", "Print s"), s,
        `It adds the even elements: ${a.filter((x) => x % 2 === 0).join(" + ") || "none"} = ${s}.`, [a.reduce((p, x) => p + x, 0) - s]);
    },
    (r) => {
      const a = r.shuffle([0, 1, 2, 3, 4, 5]);
      const k = r.int(0, 5);
      return pt(code(`Integer arr[] = ${arr(a)}`, `Print arr[arr[${k}]]`), String(a[a[k]]), [String(a[k]), String(k), String(a[(a[k] + 1) % 6])].filter((x, i, xs) => xs.indexOf(x) === i && x !== String(a[a[k]])).concat(["6", "-1"]).slice(0, 3),
        `Inside first: arr[${k}] = ${a[k]}. Then arr[${a[k]}] = ${a[a[k]]}.`);
    },
  ],
  Medium: [
    (r) => {
      const a = distinct(r, 6, 1, 50);
      const mi = a.indexOf(Math.max(...a));
      return pt(code(`Integer arr[] = ${arr(a)}`, "Integer m = 0", "for i = 1 to 5", "  if (arr[i] > arr[m]) m = i", "end for", "Print m"), String(mi),
        [String(Math.max(...a)), String(mi + 1), String(a.indexOf(Math.min(...a)))], `m keeps the index of the largest value, ${Math.max(...a)}, which sits at index ${mi}.`);
    },
    (r) => {
      const a = distinct(r, 6, 1, 40), k = r.int(0, 5);
      return pt(code(`Integer arr[] = ${arr(a)}`, "for i = 0 to 2", "  swap(arr[i], arr[5 - i])", "end for", `Print arr[${k}]`), String(a[5 - k]),
        [String(a[k]), String(a[(6 - k) % 6]), String(a[(7 - k) % 6])], `The loop reverses the array, so position ${k} now holds the old arr[${5 - k}] = ${a[5 - k]}.`);
    },
  ],
  Hard: [
    (r) => {
      const a = Array.from({ length: 6 }, () => r.int(1, 9)), k = r.int(2, 5);
      const p = a.reduce<number[]>((acc, x, i) => [...acc, (acc[i - 1] ?? 0) + x], []);
      return pn(r, code(`Integer arr[] = ${arr(a)}`, "for i = 1 to 5", "  arr[i] = arr[i] + arr[i - 1]", "end for", `Print arr[${k}]`), p[k],
        `Each element becomes the running total up to it: arr[${k}] = ${a.slice(0, k + 1).join(" + ")} = ${p[k]}.`, [a[k] + a[k - 1]]);
    },
    (r) => {
      const ch = r.pick(["A", "C", "G", "K", "M", "P"]), k = r.int(1, 5);
      const code0 = ch.charCodeAt(0);
      return pn(r, code(`Character c = '${ch}'`, `Integer d = c + ${k}`, "Print d"), code0 + k, `'${ch}' has code ${code0} ('A' = 65). Stored in an Integer, ${code0} + ${k} prints as ${code0 + k}.`, [code0, code0 + k + 32]);
    },
    (r) => {
      const a = distinct(r, 5, 1, 30);
      const b = [...a];
      for (let i = 0; i < 4; i++) if (b[i] > b[i + 1]) [b[i], b[i + 1]] = [b[i + 1], b[i]];
      return pt(code(`Integer arr[] = ${arr(a)}`, "for i = 0 to 3", "  if (arr[i] > arr[i + 1]) swap(arr[i], arr[i + 1])", "end for", "Print arr"), arr(b),
        [arr([...a].sort((x, y) => x - y)), arr(a), arr([...a].sort((x, y) => y - x))], `One bubble pass carries the largest value to the end but does not fully sort: ${arr(b)}.`);
    },
  ],
};

// ── 9. Bitwise operations ──
const bits: Generator = {
  Easy: [
    (r) => {
      const [a, b] = distinct(r, 2, 1, 15);
      const op = r.pick(["&", "|", "^"] as const);
      const v = op === "&" ? a & b : op === "|" ? a | b : a ^ b;
      const name = { "&": "AND (1 only where both are 1)", "|": "OR (1 where either is 1)", "^": "XOR (1 where they differ)" }[op];
      return pn(r, code(`Print ${a} ${op} ${b}`), v, `${a} = ${bin(a)}, ${b} = ${bin(b)}. Bitwise ${name}: ${bin(v)} = ${v}.`, [a & b, a | b, a ^ b, a + b].filter((x) => x !== v));
    },
  ],
  Medium: [
    (r) => {
      const [a, k] = [r.int(3, 40), r.int(1, 3)];
      const left = r.next() < 0.5;
      const v = left ? a << k : a >> k;
      return pn(r, code(`Print ${a} ${left ? "<<" : ">>"} ${k}`), v,
        left ? `Shifting left by ${k} multiplies by 2^${k}: ${a} × ${2 ** k} = ${v}.` : `Shifting right by ${k} divides by 2^${k} and drops the remainder: ${a} / ${2 ** k} = ${v}.`, [left ? a >> k : a << k, a * k]);
    },
    (r) => {
      const n = r.int(9, 255);
      const c = n.toString(2).split("").filter((d) => d === "1").length;
      return pn(r, code(`Integer n = ${n}, c = 0`, "while (n > 0)", "  c = c + (n & 1)", "  n = n >> 1", "end while", "Print c"), c, `It counts the 1 bits of ${n} = ${n.toString(2)}: ${c}.`, [n.toString(2).length]);
    },
  ],
  Hard: [
    (r) => {
      const [a, b, c, d] = [r.int(1, 15), r.int(1, 15), r.int(1, 15), r.int(1, 7)];
      const v = ((a ^ b) & c) | d;
      return pn(r, code(`Integer a = ${a}, b = ${b}, c = ${c}, d = ${d}`, "Print ((a ^ b) & c) | d"), v,
        `a ^ b = ${bin(a)} ^ ${bin(b)} = ${bin(a ^ b)}; & c (${bin(c)}) = ${bin((a ^ b) & c)}; | d (${bin(d)}) = ${bin(v)} = ${v}.`, [(a ^ b) & c, (a | b) & c | d]);
    },
    (r) => {
      const [a, b] = distinct(r, 2, 2, 20);
      return pt(code(`Integer a = ${a}, b = ${b}`, "a = a ^ b", "b = a ^ b", "a = a ^ b", "a = a << 1", "Print a, b"), `${2 * b} ${a}`, [`${2 * a} ${b}`, `${b} ${a}`, `${a ^ b} ${a}`],
        `Three XORs swap a and b (a = ${b}, b = ${a}). Then a << 1 doubles a to ${2 * b}.`);
    },
  ],
};

// ── 10. Data types and overflow ──
const types: Generator = {
  Easy: [
    (r) => {
      const b = r.int(2, 6), a0 = r.int(7, 40), a = a0 % b === 0 ? a0 + 1 : a0;
      const exact = Math.round((a / b) * 100) / 100;
      return pt(code(`Integer a = ${a}, b = ${b}`, "Float c = a / b", "Print c"), `${idiv(a, b)}.0`, [String(exact), `${idiv(a, b) + 1}.0`, String(idiv(a, b))].filter((x) => x !== `${idiv(a, b)}.0`),
        `Both operands are Integers, so ${a} / ${b} = ${idiv(a, b)} first; storing it in a Float gives ${idiv(a, b)}.0.`);
    },
    (r) => {
      const [a, b] = [r.int(240, 255), r.int(5, 30)];
      return pn(r, code(`unsigned char x = ${a}`, `x = x + ${b}`, "Print x"), (a + b) % 256, `unsigned char holds 0 to 255 and wraps: (${a} + ${b}) mod 256 = ${(a + b) % 256}.`, [a + b, 255]);
    },
  ],
  Medium: [
    (r) => {
      const [a, b] = [r.int(118, 127), r.int(3, 15)];
      const v = ((a + b + 128) % 256) - 128;
      return pn(r, code(`signed char y = ${a}`, `y = y + ${b}`, "Print y"), v, `signed char holds −128 to 127. ${a} + ${b} = ${a + b} is above 127, so it wraps by 256: ${a + b} − 256 = ${v}.`, [a + b, -v]);
    },
    (r) => {
      const x = r.int(2, 9) + r.pick([0.2, 0.5, 0.8, 0.9]);
      const neg = r.next() < 0.5;
      const v = neg ? -x : x;
      return pn(r, code(`Float f = ${v}`, "Integer i = (Integer) f", "Print i"), Math.trunc(v), `Casting to Integer drops the fraction toward zero: ${v} becomes ${Math.trunc(v)}.`, [neg ? Math.floor(v) : Math.ceil(v), Math.round(v) === Math.trunc(v) ? Math.trunc(v) + (neg ? -2 : 2) : Math.round(v)]);
    },
  ],
  Hard: [
    (r) => {
      const k = r.int(1, 10);
      const v = -2147483648 + k - 1;
      return pn(r, code("Integer x = 2147483647     // 32-bit signed maximum", `x = x + ${k}`, "Print x"), v, `Adding 1 to 2147483647 wraps to −2147483648; adding ${k} lands ${k - 1} above it: ${v}.`, [2147483647 + k, -2147483648]);
    },
    (r) => {
      const ch = r.pick(["a", "c", "f", "h", "m", "p"]), k = r.int(1, 6);
      const out = String.fromCharCode(ch.charCodeAt(0) + k);
      return pt(code(`Character c = '${ch}'`, `c = c + ${k}`, "Print c"), out, [String(ch.charCodeAt(0) + k), out.toUpperCase(), String.fromCharCode(ch.charCodeAt(0) + k + 1)],
        `Characters are stored as codes; '${ch}' + ${k} is the code of '${out}', and a Character variable prints the letter.`);
    },
  ],
};

// ── 11. Recognising algorithms ──
interface Algo { name: string; body: (v: string) => string[]; run: (n: number) => number }
const ALGOS: Algo[] = [
  { name: "The sum of the digits of n", body: (v) => [`while (n > 0)`, `  ${v} = ${v} + n mod 10`, "  n = n / 10", "end while"], run: digitSum },
  { name: "The number of digits in n", body: (v) => [`while (n > 0)`, `  ${v} = ${v} + 1`, "  n = n / 10", "end while"], run: (n) => String(n).length },
  { name: "n with its digits reversed", body: (v) => [`while (n > 0)`, `  ${v} = ${v} * 10 + n mod 10`, "  n = n / 10", "end while"], run: (n) => +String(n).split("").reverse().join("") },
  { name: "The largest digit of n", body: (v) => [`while (n > 0)`, `  if (n mod 10 > ${v}) ${v} = n mod 10`, "  n = n / 10", "end while"], run: (n) => Math.max(...String(n).split("").map(Number)) },
  { name: "The number of 1s in n's binary form", body: (v) => [`while (n > 0)`, `  ${v} = ${v} + (n & 1)`, "  n = n >> 1", "end while"], run: (n) => n.toString(2).split("").filter((d) => d === "1").length },
  { name: "The sum 1 + 2 + … + n", body: (v) => ["for i = 1 to n", `  ${v} = ${v} + i`, "end for"], run: (n) => (n * (n + 1)) / 2 },
  { name: "The number of divisors of n", body: (v) => ["for i = 1 to n", `  if (n mod i == 0) ${v} = ${v} + 1`, "end for"], run: (n) => Array.from({ length: n }, (_, i) => i + 1).filter((i) => n % i === 0).length },
];
const algoCode = (a: Algo, fn: string, v: string) => code(`Function ${fn}(Integer n)`, `  Integer ${v} = 0`, ...a.body(v).map((l) => "  " + l), `  return ${v}`, "End Function");
const recog: Generator = {
  Easy: [
    (r) => {
      const a = r.pick(ALGOS), fn = r.pick(["mystery", "f", "calc", "work", "g"]), v = r.pick(["s", "t", "k", "r", "x"]);
      return pt(algoCode(a, fn, v), a.name, r.shuffle(ALGOS.filter((x) => x !== a)).slice(0, 3).map((x) => x.name),
        `Trace it on a small number (for example n = 123) and the pattern shows: it returns ${a.name.toLowerCase()}.`, "What does this function return for a positive n?");
    },
  ],
  Medium: [
    (r) => {
      const a = r.pick(ALGOS.slice(0, 5)), n = r.int(1000, 9999), v = r.pick(["s", "t", "k"]);
      return pn(r, code(algoCode(a, "f", v), `Print f(${n})`), a.run(n), `f returns ${a.name.toLowerCase()}. For ${n} that is ${a.run(n)}.`, [a.run(n) + 1]);
    },
  ],
  Hard: [
    (r) => {
      const a = r.pick(ALGOS.slice(5)), n = r.int(10, 40), v = r.pick(["s", "t", "k"]);
      return pn(r, code(algoCode(a, "f", v), `Print f(${n})`), a.run(n), `f returns ${a.name.toLowerCase()}. For n = ${n} that is ${a.run(n)}.`, [a.run(n - 1)]);
    },
    (r) => {
      const [x, y] = [r.int(10, 60), r.int(10, 60)];
      const gcd = (p: number, q: number): number => (q ? gcd(q, p % q) : p);
      return pt(code("Function f(Integer a, Integer b)", "  while (b != 0)", "    Integer t = b", "    b = a mod b", "    a = t", "  end while", "  return a", "End Function", `Print f(${x}, ${y})`), String(gcd(x, y)),
        [String((x * y) / gcd(x, y)), String(Math.min(x, y)), String(Math.abs(x - y) || 1)].filter((v) => v !== String(gcd(x, y))).concat(["0"]).slice(0, 3),
        `This loop is Euclid's algorithm, so it returns the HCF of ${x} and ${y}: ${gcd(x, y)}.`);
    },
  ],
};

// ── 12. Exam strategy: a mixed set drawn from every topic ──
const ALL = [read, ops, cond, loops, nested, funcs, recur, arrays, bits, types, recog];
const mix = (level: keyof Generator): Maker[] => [(r) => r.pick(r.pick(ALL)[level]!)(r)];

export const pseudocodeGenerators: Record<string, Generator> = {
  "how-to-read-pseudocode": read,
  "operators-and-precedence": ops,
  "conditions-and-branches": cond,
  "loops-and-tracing": loops,
  "nested-loops-and-counting": nested,
  "functions-and-parameters": funcs,
  "recursion-tracing": recur,
  "arrays-and-strings": arrays,
  "bitwise-operations": bits,
  "data-types-and-overflow": types,
  "recognising-algorithms": recog,
  "pseudocode-exam-strategy": { Easy: mix("Easy"), Medium: mix("Medium"), Hard: mix("Hard") },
};
