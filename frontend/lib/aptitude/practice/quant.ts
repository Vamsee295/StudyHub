// Generated practice for Quantitative Aptitude. Every answer is computed from the numbers chosen.
import { fact, fmt, frac, gcd, isPrime, lcm, nCr, nPr, num, type Generator, type RawQ, type Rng } from "./core";

const rupee = (x: number) => `₹${fmt(x)}`;
const pickDistinct = (r: Rng, xs: number[], n: number) => r.shuffle(xs).slice(0, n);

const UNIT_CYCLES: Record<number, number[]> = { 0: [0], 1: [1], 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 4: [4, 6], 5: [5], 6: [6], 7: [7, 9, 3, 1], 8: [8, 4, 2, 6], 9: [9, 1] };
const unitDigit = (base: number, exp: number) => {
  const c = UNIT_CYCLES[base % 10];
  return c[(exp - 1) % c.length];
};
const powMod = (b: number, e: number, m: number) => {
  let res = 1, x = b % m;
  while (e > 0) {
    if (e & 1) res = (res * x) % m;
    x = (x * x) % m;
    e >>= 1;
  }
  return res;
};
const trailingZeros = (n: number) => {
  let z = 0;
  for (let p = 5; p <= n; p *= 5) z += Math.floor(n / p);
  return z;
};
const divisorCount = (n: number) => {
  let c = 0;
  for (let i = 1; i <= n; i++) if (n % i === 0) c++;
  return c;
};
const choice = (q: string, correct: string, wrong: string[], explanation: string): RawQ => ({ q, correct, wrong, explanation });

export const quantGenerators: Record<string, Generator> = {
  "number-system": {
    Easy: [
      (r) => {
        const b = r.pick([2, 3, 7, 8]), e = r.int(11, 99), d = unitDigit(b, e);
        const wrong = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== d)).slice(0, 3).map(String);
        return choice(`What is the unit digit of ${b}^${e}?`, `${d}`, wrong,
          `Unit digits of powers of ${b} repeat ${UNIT_CYCLES[b].join(", ")}. ${e} mod ${UNIT_CYCLES[b].length} = ${e % UNIT_CYCLES[b].length || UNIT_CYCLES[b].length} (0 means the last), so the unit digit is ${d}.`);
      },
    ],
    Medium: [
      (r) => {
        const n = r.pick([25, 30, 40, 50, 60, 75, 80, 100, 120, 150]), z = trailingZeros(n);
        return num(r, `How many zeros are at the end of ${n}! ?`, z, `Count the factors of 5: ${[5, 25, 125].filter((p) => p <= n).map((p) => `${n}/${p} = ${Math.floor(n / p)}`).join(", ")}. Total ${z}.`, { step: 1, min: 0 });
      },
    ],
    Hard: [
      (r) => {
        const b = r.pick([2, 3, 5]), m = r.pick([7, 9, 11, 13]), e = r.int(20, 80), ans = powMod(b, e, m);
        return num(r, `What is the remainder when ${b}^${e} is divided by ${m}?`, ans, `Find a power of ${b} that leaves 1 (or a short cycle) when divided by ${m}, reduce the exponent, then compute: the remainder is ${ans}.`, { step: 1, min: 0 });
      },
    ],
  },
  "types-of-numbers": {
    Easy: [
      (r) => {
        const p = r.pick([29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
        const comps = pickDistinct(r, [39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 95], 3);
        return choice("Which of these is a prime number?", `${p}`, comps.map(String), `${p} has no divisor other than 1 and itself. ${comps.map((c) => `${c} = ${[3, 7, 13, 17, 19].find((d) => c % d === 0)} × ${c / [3, 7, 13, 17, 19].find((d) => c % d === 0)!}`).join("; ")}.`);
      },
    ],
    Medium: [
      (r) => {
        const lo = r.pick([1, 10, 20, 30, 40, 50]), hi = lo + r.pick([20, 30]);
        let c = 0;
        for (let i = lo; i <= hi; i++) if (isPrime(i)) c++;
        return num(r, `How many prime numbers are there from ${lo} to ${hi}?`, c, `List them: ${Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter(isPrime).join(", ")}. That's ${c}.`, { step: 1, min: 0 });
      },
    ],
    Hard: [
      (r) => {
        const n = r.int(10, 40);
        return num(r, `What is the sum of the first ${n} odd natural numbers?`, n * n, `The sum of the first n odd numbers is n². ${n}² = ${n * n}.`, { extra: [n * (n + 1), n * n - n, (n + 1) * (n + 1)] });
      },
    ],
  },
  "divisibility-rules": {
    Easy: [
      (r) => {
        const k = r.pick([3, 4, 8, 9, 11]);
        const yes = k * r.int(1000, 9999);
        const nos = [0, 1, 2].map(() => {
          let x;
          do x = r.int(10000, 99999); while (x % k === 0);
          return x;
        });
        const rule: Record<number, string> = { 3: "digit sum divisible by 3", 4: "last two digits divisible by 4", 8: "last three digits divisible by 8", 9: "digit sum divisible by 9", 11: "difference of alternate digit sums divisible by 11" };
        return choice(`Which number is divisible by ${k}?`, `${yes}`, nos.map(String), `Rule for ${k}: ${rule[k]}. Only ${yes} passes (${yes} = ${k} × ${yes / k}).`);
      },
    ],
    Medium: [
      (r) => {
        const digits = [r.int(1, 9), r.int(0, 9), r.int(0, 9), r.int(0, 9)];
        const s = digits.reduce((a, b) => a + b, 0);
        const star = (9 - (s % 9)) % 9;
        return num(r, `What is the smallest digit * that makes ${digits[0]}${digits[1]}*${digits[2]}${digits[3]} divisible by 9?`, star, `Digit sum without * is ${s}. The next multiple of 9 is ${s + star}, so * = ${star}.`, { step: 1, min: 0 });
      },
    ],
    Hard: [
      (r) => {
        const a = r.int(2, 9), b = r.int(0, 9);
        // a b ? a b with ? chosen to make it divisible by 11: (a + ? + b) − (b + a) ... use 5-digit a b x b a
        const x = 0;
        const n = Number(`${a}${b}${x}${b}${a}`);
        const ok = n % 11 === 0;
        return choice(`Is ${n} divisible by 11?`, ok ? "Yes" : "No", ok ? ["No", "Only by 2", "Can't be determined"] : ["Yes", "Only by 2", "Can't be determined"], `Alternate digit sums: (${a} + ${x} + ${a}) − (${b} + ${b}) = ${2 * a - 2 * b}. ${ok ? "It's a multiple of 11 (or 0), so yes." : "That's not a multiple of 11, so no."}`);
      },
    ],
  },
  "factors-multiples": {
    Easy: [
      (r) => {
        const n = r.pick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 60, 72]);
        return num(r, `How many factors does ${n} have?`, divisorCount(n), `Factors of ${n}: ${Array.from({ length: n }, (_, i) => i + 1).filter((i) => n % i === 0).join(", ")}.`, { step: 1, min: 1 });
      },
    ],
    Medium: [
      (r) => {
        const a = r.pick([7, 13, 17, 19, 23]), b = r.int(200, 900), ans = Math.ceil(b / a) * a;
        return num(r, `What is the smallest multiple of ${a} greater than ${b}?`, ans === b ? ans + a : ans, `${b} ÷ ${a} = ${Math.floor(b / a)} remainder ${b % a}, so the next multiple is ${a} × ${Math.floor(b / a) + 1} = ${(Math.floor(b / a) + 1) * a}.`, { step: a });
      },
    ],
    Hard: [
      (r) => {
        const [p, q] = r.pick([[2, 3], [2, 5], [3, 5], [2, 7]]), a = r.int(2, 4), b = r.int(1, 3), n = p ** a * q ** b;
        return num(r, `How many factors does ${n} have?`, (a + 1) * (b + 1), `${n} = ${p}^${a} × ${q}^${b}. Number of factors = (${a} + 1)(${b} + 1) = ${(a + 1) * (b + 1)}.`, { step: 1, min: 1 });
      },
    ],
  },
  "lcm-hcf": {
    Easy: [
      (r) => {
        const g = r.int(2, 12), a = g * r.int(2, 9), b = g * r.int(2, 9);
        return num(r, `What is the HCF of ${a} and ${b}?`, gcd(a, b), `Largest number dividing both: HCF(${a}, ${b}) = ${gcd(a, b)}.`, { step: 1, min: 1, extra: [lcm(a, b) > 200 ? 1 : lcm(a, b)] });
      },
      (r) => {
        const a = r.int(4, 18), b = r.int(4, 18);
        return num(r, `What is the LCM of ${a} and ${b}?`, lcm(a, b), `LCM = a × b ÷ HCF = ${a} × ${b} ÷ ${gcd(a, b)} = ${lcm(a, b)}.`, { extra: [a * b, gcd(a, b)] });
      },
    ],
    Medium: [
      (r) => {
        const g = r.int(2, 9), x = r.int(2, 7), y = r.int(2, 7), a = g * x, b = g * y, l = lcm(a, b);
        return num(r, `The HCF of two numbers is ${gcd(a, b)} and their LCM is ${l}. One number is ${a}. Find the other.`, b, `HCF × LCM = product of the numbers: ${gcd(a, b)} × ${l} ÷ ${a} = ${b}.`);
      },
    ],
    Hard: [
      (r) => {
        const [a, b, c] = r.pick([[4, 6, 8], [6, 8, 12], [5, 10, 15], [6, 9, 12], [8, 12, 16], [10, 15, 20]]), l = lcm(lcm(a, b), c);
        return num(r, `Three bells ring every ${a}, ${b} and ${c} minutes. They ring together at 9:00. After how many minutes do they next ring together?`, l, `They ring together at multiples of LCM(${a}, ${b}, ${c}) = ${l} minutes.`, { step: a });
      },
    ],
  },
  "percentages": {
    Easy: [
      (r) => {
        const p = r.pick([5, 10, 12.5, 15, 20, 25, 30, 40, 75]), n = r.int(4, 40) * 40;
        return num(r, `What is ${p}% of ${n}?`, (p * n) / 100, `${p}% of ${n} = ${p} × ${n} ÷ 100 = ${fmt((p * n) / 100)}.`);
      },
      (r) => {
        const b = r.int(4, 25) * 20, a = (b * r.pick([10, 20, 25, 40, 50, 60, 75])) / 100;
        return num(r, `What percentage of ${b} is ${a}?`, (a / b) * 100, `${a} ÷ ${b} × 100 = ${fmt((a / b) * 100)}%.`, { unit: "%", step: 5, min: 0 });
      },
    ],
    Medium: [
      (r) => {
        const x = r.pick([10, 20, 25, 30]), y = r.pick([10, 20, 25]), net = x - y - (x * y) / 100;
        return choice(`A price rises by ${x}% and then falls by ${y}%. What is the net change?`, net === 0 ? "No change" : `${net > 0 ? "Increase" : "Decrease"} of ${fmt(Math.abs(net))}%`,
          [`${x - y === 0 ? "No change" : `${x - y > 0 ? "Increase" : "Decrease"} of ${fmt(Math.abs(x - y))}%`}`, `Decrease of ${fmt(Math.abs(net) + 2)}%`, `Increase of ${fmt(Math.abs(net) + 1)}%`].filter((v, i, a) => a.indexOf(v) === i),
          `Net = x − y − xy/100 = ${x} − ${y} − ${x}×${y}/100 = ${fmt(net)}%.`);
      },
    ],
    Hard: [
      (r) => {
        const p = r.int(2, 9) * 10000, g = r.pick([5, 10, 20]), ans = p * (1 + g / 100) ** 2;
        return num(r, `A town's population of ${fmt(p)} grows by ${g}% a year. What is it after 2 years?`, Math.round(ans), `P × (1 + ${g}/100)² = ${fmt(p)} × ${fmt((1 + g / 100) ** 2)} = ${fmt(Math.round(ans))}.`, { extra: [p + (2 * g * p) / 100] });
      },
    ],
  },
  "profit-and-loss": {
    Easy: [
      (r) => {
        const cp = r.int(5, 40) * 20, p = r.pick([10, 15, 20, 25, 30]);
        return num(r, `An item costs ${rupee(cp)} and is sold at ${p}% profit. What is the selling price?`, cp * (1 + p / 100), `SP = CP × (100 + profit%)/100 = ${cp} × ${100 + p}/100 = ${fmt(cp * (1 + p / 100))}.`, { prefix: "₹" });
      },
    ],
    Medium: [
      (r) => {
        const cp = r.int(5, 40) * 20, sp = cp + (cp * r.pick([-20, -10, 10, 20, 25])) / 100, g = ((sp - cp) / cp) * 100;
        return choice(`Bought for ${rupee(cp)}, sold for ${rupee(sp)}. What is the profit or loss percentage?`, `${g >= 0 ? "Profit" : "Loss"} ${fmt(Math.abs(g))}%`, [`${g >= 0 ? "Loss" : "Profit"} ${fmt(Math.abs(g))}%`, `${g >= 0 ? "Profit" : "Loss"} ${fmt(Math.abs(g) + 5)}%`, `${g >= 0 ? "Profit" : "Loss"} ${fmt(Math.abs((sp - cp) / sp) * 100)}%`], `(SP − CP)/CP × 100 = ${fmt(sp - cp)}/${cp} × 100 = ${fmt(g)}%. Always divide by CP.`);
      },
    ],
    Hard: [
      (r) => {
        const cp = r.int(4, 20) * 50, m = r.pick([20, 25, 40, 50]), d = r.pick([10, 20]), sp = cp * (1 + m / 100) * (1 - d / 100), g = ((sp - cp) / cp) * 100;
        return num(r, `A shop marks an item ${m}% above cost and gives a ${d}% discount. What is its profit percentage?`, g, `Take CP = 100: marked ${100 + m}, after ${d}% off ${fmt((100 + m) * (1 - d / 100))}. Profit ${fmt(g)}%.`, { unit: "%", step: 2, extra: [m - d] });
      },
    ],
  },
  "ratio-proportion": {
    Easy: [
      (r) => {
        const a = r.int(1, 5), b = r.int(1, 7), k = r.int(10, 60), total = (a + b) * k;
        return num(r, `Divide ₹${fmt(total)} in the ratio ${a} : ${b}. What is the larger share?`, Math.max(a, b) * k, `${a + b} parts = ${total}, so one part = ${k}; larger share = ${Math.max(a, b)} × ${k} = ${Math.max(a, b) * k}.`, { prefix: "₹", step: k });
      },
    ],
    Medium: [
      (r) => {
        const a = r.int(2, 9), b = a * r.int(2, 4), c = r.int(2, 9);
        return num(r, `Find the fourth proportional to ${a}, ${b} and ${c}.`, (b * c) / a, `a : b = c : d, so d = bc/a = ${b} × ${c} ÷ ${a} = ${fmt((b * c) / a)}.`);
      },
      (r) => {
        const x = r.int(2, 12), a = x * x * r.pick([1, 4]) / r.pick([1]), b = r.pick([4, 9, 16]);
        const m = Math.sqrt(a * b);
        return Number.isInteger(m)
          ? num(r, `Find the mean proportional between ${a} and ${b}.`, m, `Mean proportional = √(ab) = √(${a} × ${b}) = ${m}.`)
          : num(r, `Find the mean proportional between ${x * x} and 4.`, 2 * x, `√(${x * x} × 4) = ${2 * x}.`);
      },
    ],
    Hard: [
      (r) => {
        const [a, b] = [r.int(2, 5), r.int(2, 5)], [c, d] = [r.int(2, 5), r.int(2, 5)], p = a * c, q = b * d, g = gcd(p, q);
        return choice(`A : B = ${a} : ${b} and B : C = ${c} : ${d}. Find A : B : C.`, `${(a * c) / gcd(gcd(a * c, b * c), b * d)} : ${(b * c) / gcd(gcd(a * c, b * c), b * d)} : ${(b * d) / gcd(gcd(a * c, b * c), b * d)}`,
          [`${a} : ${b} : ${d}`, `${a} : ${b * c} : ${d}`, `${a + c} : ${b + c} : ${d + b}`], `Make B the same: multiply the first ratio by ${c} and the second by ${b}: ${a * c} : ${b * c} : ${b * d}, then simplify.${g ? "" : ""}`);
      },
    ],
  },
  "averages": {
    Easy: [
      (r) => {
        const xs = Array.from({ length: 5 }, () => r.int(10, 90)), s = xs.reduce((a, b) => a + b, 0);
        return num(r, `Find the average of ${xs.join(", ")}.`, s / 5, `Sum ${s} ÷ 5 = ${fmt(s / 5)}.`);
      },
    ],
    Medium: [
      (r) => {
        const n = r.int(8, 20), avg = r.int(30, 60), newAvg = avg + r.int(1, 3), x = newAvg * (n + 1) - avg * n;
        return num(r, `The average of ${n} numbers is ${avg}. When one more number is added the average becomes ${newAvg}. What number was added?`, x, `New total ${newAvg} × ${n + 1} = ${newAvg * (n + 1)}; old total ${avg} × ${n} = ${avg * n}; difference ${x}.`);
      },
    ],
    Hard: [
      (r) => {
        const n = r.int(6, 12), inc = r.pick([1, 1.5, 2, 2.5]), old = r.int(50, 70), nw = old + n * inc;
        return num(r, `The average weight of ${n} people rises by ${inc} kg when a person of ${old} kg is replaced by a new person. What does the new person weigh?`, nw, `Total rises by ${n} × ${inc} = ${n * inc} kg, so the new person weighs ${old} + ${n * inc} = ${fmt(nw)} kg.`, { unit: " kg" });
      },
    ],
  },
  "simple-interest": {
    Easy: [
      (r) => {
        const p = r.int(5, 50) * 1000, rate = r.pick([4, 5, 6, 8, 10, 12]), t = r.int(2, 5);
        return num(r, `Find the simple interest on ₹${fmt(p)} at ${rate}% per annum for ${t} years.`, (p * rate * t) / 100, `SI = P × R × T / 100 = ${fmt(p)} × ${rate} × ${t} / 100 = ${fmt((p * rate * t) / 100)}.`, { prefix: "₹" });
      },
    ],
    Medium: [
      (r) => {
        const p = r.int(5, 50) * 1000, rate = r.pick([4, 5, 6, 8, 10]), t = r.int(2, 6), si = (p * rate * t) / 100;
        return num(r, `₹${fmt(p)} earns ₹${fmt(si)} simple interest in ${t} years. What is the rate?`, rate, `R = SI × 100 / (P × T) = ${fmt(si)} × 100 / (${fmt(p)} × ${t}) = ${rate}%.`, { unit: "%", step: 1, min: 1 });
      },
    ],
    Hard: [
      (r) => {
        const rate = r.pick([5, 8, 10, 12.5, 20, 25]);
        return num(r, `In how many years does a sum double at ${rate}% simple interest?`, 100 / rate, `Doubling means SI = P, so T = 100 / R = 100 / ${rate} = ${fmt(100 / rate)} years.`, { unit: " years", step: 2, min: 1 });
      },
    ],
  },
  "compound-interest": {
    Easy: [
      (r) => {
        const p = r.int(1, 20) * 1000, rate = r.pick([5, 10, 20]), a = p * (1 + rate / 100) ** 2;
        return num(r, `Find the amount on ₹${fmt(p)} at ${rate}% compound interest for 2 years.`, a, `A = P(1 + R/100)² = ${fmt(p)} × ${fmt((1 + rate / 100) ** 2)} = ${fmt(a)}.`, { prefix: "₹", extra: [p + (2 * p * rate) / 100] });
      },
    ],
    Medium: [
      (r) => {
        const p = r.int(1, 20) * 1000, rate = r.pick([5, 10, 20]), ci = p * ((1 + rate / 100) ** 2 - 1);
        return num(r, `Find the compound interest on ₹${fmt(p)} at ${rate}% per annum for 2 years.`, ci, `CI = P[(1 + R/100)² − 1] = ${fmt(p)} × ${fmt((1 + rate / 100) ** 2 - 1)} = ${fmt(ci)}.`, { prefix: "₹", extra: [(2 * p * rate) / 100] });
      },
    ],
    Hard: [
      (r) => {
        const rate = r.pick([5, 10, 20]), d = r.int(2, 30) * 10, p = d / (rate / 100) ** 2;
        return num(r, `The difference between compound and simple interest on a sum for 2 years at ${rate}% is ₹${fmt(d)}. Find the sum.`, p, `For 2 years, CI − SI = P(R/100)². So P = ${fmt(d)} ÷ ${fmt((rate / 100) ** 2)} = ${fmt(p)}.`, { prefix: "₹" });
      },
    ],
  },
  "time-and-work": {
    Easy: [
      (r) => {
        const [a, b] = r.pick([[10, 15], [12, 24], [6, 12], [20, 30], [12, 18], [15, 30], [8, 24]]);
        return num(r, `A can finish a job in ${a} days and B in ${b} days. How long do they take together?`, (a * b) / (a + b), `Together = ab/(a + b) = ${a} × ${b} / ${a + b} = ${fmt((a * b) / (a + b))} days.`, { unit: " days", step: 2, min: 1, extra: [(a + b) / 2] });
      },
    ],
    Medium: [
      (r) => {
        const [a, t] = r.pick([[10, 6], [12, 8], [15, 10], [20, 12], [24, 8], [18, 9]]), b = (a * t) / (a - t);
        return num(r, `A and B together finish a job in ${t} days; A alone takes ${a} days. How long does B take alone?`, b, `B's rate = 1/${t} − 1/${a} = ${frac(a - t, a * t)}, so B takes ${fmt(b)} days.`, { unit: " days", step: 3, min: 1 });
      },
    ],
    Hard: [
      (r) => {
        const [a, b] = r.pick([[10, 15], [12, 24], [20, 30], [12, 18]]), wage = r.int(5, 30) * 100, shareA = (wage * b) / (a + b);
        return num(r, `A can do a job in ${a} days and B in ${b} days. They finish it together and are paid ₹${fmt(wage)}. What is A's share?`, shareA, `Shares follow work rates, 1/${a} : 1/${b} = ${b} : ${a}. A gets ${b}/${a + b} × ${fmt(wage)} = ${fmt(shareA)}.`, { prefix: "₹" });
      },
    ],
  },
  "pipes-and-cisterns": {
    Easy: [
      (r) => {
        const a = r.int(4, 30), b = r.int(4, 30);
        return num(r, `Two pipes fill a tank in ${a} and ${b} hours. How long do both take together?`, (a * b) / (a + b), `Together = ab/(a + b) = ${fmt((a * b) / (a + b))} hours.`, { unit: " hours", step: 1, min: 1 });
      },
    ],
    Medium: [
      (r) => {
        const f = r.int(4, 20), e = f + r.int(2, 20);
        return num(r, `A pipe fills a tank in ${f} hours and a leak empties it in ${e} hours. With both open, how long does filling take?`, (f * e) / (e - f), `Net rate = 1/${f} − 1/${e}; time = ${f} × ${e} / (${e} − ${f}) = ${fmt((f * e) / (e - f))} hours.`, { unit: " hours", step: 5, min: 1 });
      },
    ],
    Hard: [
      (r) => {
        const a = r.int(5, 20), b = r.int(5, 20), c = Math.max(a, b) + r.int(5, 30), t = 1 / (1 / a + 1 / b - 1 / c);
        return num(r, `Pipes A and B fill a tank in ${a} and ${b} hours; pipe C empties it in ${c} hours. All three are opened. How long does the tank take to fill?`, Math.round(t * 100) / 100, `Net rate = 1/${a} + 1/${b} − 1/${c}; time = ${fmt(t)} hours.`, { unit: " hours", step: 2, min: 1 });
      },
    ],
  },
  "time-speed-distance": {
    Easy: [
      (r) => {
        const v = r.pick([18, 36, 54, 72, 90, 108]);
        return num(r, `Convert ${v} km/h to m/s.`, (v * 5) / 18, `Multiply by 5/18: ${v} × 5/18 = ${fmt((v * 5) / 18)} m/s.`, { unit: " m/s", step: 5, min: 1 });
      },
    ],
    Medium: [
      (r) => {
        const [x, y] = r.pick([[40, 60], [30, 60], [60, 90], [20, 30], [36, 45]]);
        return num(r, `A car goes from A to B at ${x} km/h and returns at ${y} km/h. What is its average speed?`, (2 * x * y) / (x + y), `For equal distances, average speed = 2xy/(x + y) = ${fmt((2 * x * y) / (x + y))} km/h (not ${(x + y) / 2}).`, { unit: " km/h", extra: [(x + y) / 2] });
      },
    ],
    Hard: [
      (r) => {
        const a = r.int(3, 8) * 10, b = r.int(3, 8) * 10, d = (a + b) * r.int(2, 5);
        return num(r, `Two cars start ${d} km apart and drive towards each other at ${a} km/h and ${b} km/h. After how many hours do they meet?`, d / (a + b), `Closing speed ${a} + ${b} = ${a + b} km/h; time = ${d} / ${a + b} = ${fmt(d / (a + b))} hours.`, { unit: " hours", step: 1, min: 1 });
      },
    ],
  },
  "boats-and-streams": {
    Easy: [
      (r) => {
        const b = r.int(8, 20), s = r.int(2, 6);
        return num(r, `A boat moves at ${b} km/h in still water and the stream flows at ${s} km/h. What is its upstream speed?`, b - s, `Upstream speed = boat − stream = ${b} − ${s} = ${b - s} km/h.`, { unit: " km/h", step: 1, extra: [b + s] });
      },
    ],
    Medium: [
      (r) => {
        const b = r.int(8, 20), s = r.int(2, 6);
        return num(r, `A boat's downstream speed is ${b + s} km/h and upstream speed is ${b - s} km/h. Find the speed of the stream.`, s, `Stream = (down − up)/2 = (${b + s} − ${b - s})/2 = ${s} km/h.`, { unit: " km/h", step: 1, min: 1, extra: [b] });
      },
    ],
    Hard: [
      (r) => {
        const b = r.int(8, 15), s = r.int(2, 5), d = (b - s) * (b + s) * r.pick([1, 2]) / gcd(b - s, b + s), t = d / (b + s) + d / (b - s);
        return num(r, `A boat (${b} km/h in still water) goes ${fmt(d)} km downstream and back in a stream of ${s} km/h. How long does the round trip take?`, Math.round(t * 100) / 100, `Down: ${fmt(d)}/${b + s} h; up: ${fmt(d)}/${b - s} h; total ${fmt(t)} hours.`, { unit: " hours", step: 1, min: 1 });
      },
    ],
  },
  "trains": {
    Easy: [
      (r) => {
        const v = r.pick([36, 54, 72, 90]), t = r.int(6, 20);
        return num(r, `A train at ${v} km/h passes a pole in ${t} seconds. How long is the train?`, ((v * 5) / 18) * t, `Speed ${v} km/h = ${(v * 5) / 18} m/s; length = speed × time = ${(v * 5) / 18} × ${t} = ${((v * 5) / 18) * t} m.`, { unit: " m" });
      },
    ],
    Medium: [
      (r) => {
        const v = r.pick([36, 54, 72, 90]), L = r.int(10, 30) * 10, P = r.int(10, 30) * 10;
        return num(r, `A ${L} m train at ${v} km/h crosses a ${P} m platform. How many seconds does it take?`, (L + P) / ((v * 5) / 18), `Distance = train + platform = ${L + P} m; speed ${(v * 5) / 18} m/s; time = ${fmt((L + P) / ((v * 5) / 18))} s.`, { unit: " s", step: 3, extra: [L / ((v * 5) / 18)] });
      },
    ],
    Hard: [
      (r) => {
        const a = r.pick([36, 54, 72]), b = r.pick([18, 36, 54]), L1 = r.int(10, 25) * 10, L2 = r.int(10, 25) * 10, opp = r.next() < 0.5;
        const rel = ((opp ? a + b : Math.abs(a - b)) * 5) / 18;
        if (rel === 0) return num(r, `Two trains of ${L1} m and ${L2} m run in opposite directions at ${a} and ${b} km/h. How long do they take to cross each other?`, (L1 + L2) / (((a + b) * 5) / 18), `Relative speed ${a + b} km/h = ${fmt(((a + b) * 5) / 18)} m/s; time = ${L1 + L2} / that.`, { unit: " s", step: 2 });
        return num(r, `Two trains of ${L1} m and ${L2} m run in ${opp ? "opposite" : "the same"} direction${opp ? "s" : ""} at ${a} and ${b} km/h. How long do they take to cross each other?`, (L1 + L2) / rel, `Relative speed = ${opp ? `${a} + ${b}` : `${Math.max(a, b)} − ${Math.min(a, b)}`} = ${opp ? a + b : Math.abs(a - b)} km/h = ${fmt(rel)} m/s; time = (${L1} + ${L2}) / ${fmt(rel)} = ${fmt((L1 + L2) / rel)} s.`, { unit: " s", step: 3 });
      },
    ],
  },
  "basic-algebra": {
    Easy: [
      (r) => {
        const a = r.int(2, 9), b = r.int(1, 20), x = r.int(1, 12);
        return num(r, `Solve: ${a}x + ${b} = ${a * x + b}`, x, `${a}x = ${a * x + b} − ${b} = ${a * x}, so x = ${x}.`, { step: 1 });
      },
    ],
    Medium: [
      (r) => {
        const x = r.int(-5, 6), y = r.int(-5, 6);
        return num(r, `If x = ${x} and y = ${y}, find x² − 2xy + 3y.`, x * x - 2 * x * y + 3 * y, `${x}² − 2(${x})(${y}) + 3(${y}) = ${x * x} − ${2 * x * y} + ${3 * y} = ${x * x - 2 * x * y + 3 * y}.`, { step: 3 });
      },
    ],
    Hard: [
      (r) => {
        const a = r.int(2, 6), b = r.int(1, 9), c = r.int(2, 6), d = r.int(10, 30), x = r.int(2, 9);
        const rhs = c * x + d, lhsB = rhs - a * x; // a x + lhsB = c x + d
        return num(r, `Solve: ${a}x + ${lhsB} = ${c}x + ${d}`, x, `Move terms: (${a} − ${c})x = ${d} − ${lhsB}, so x = ${d - lhsB} / ${a - c} = ${x}.${b ? "" : ""}`, { step: 1 });
      },
    ],
  },
  "linear-equations": {
    Easy: [
      (r) => {
        const x = r.int(1, 15), y = r.int(1, 15);
        return num(r, `x + y = ${x + y} and x − y = ${x - y}. Find x.`, x, `Add the equations: 2x = ${2 * x}, so x = ${x}.`, { step: 1 });
      },
    ],
    Medium: [
      (r) => {
        const x = r.int(1, 10), y = r.int(1, 10), a = r.int(2, 5), b = r.int(2, 5);
        return num(r, `${a}x + ${b}y = ${a * x + b * y} and x + y = ${x + y}. Find y.`, y, `From the second, x = ${x + y} − y. Substitute: ${a}(${x + y} − y) + ${b}y = ${a * x + b * y} gives y = ${y}.`, { step: 1 });
      },
    ],
    Hard: [
      (r) => {
        const p = r.int(3, 9) * 5, q = r.int(2, 8) * 5, n1 = r.int(2, 6), n2 = r.int(2, 6), m1 = r.int(1, 5), m2 = r.int(1, 5);
        if (n1 * m2 === n2 * m1) return num(r, `3 pens and 2 books cost ₹${3 * p + 2 * q}; 1 pen and 1 book cost ₹${p + q}. What does a pen cost?`, p, `Subtract twice the second from the first: pen = ${3 * p + 2 * q} − ${2 * (p + q)} = ${p}.`, { prefix: "₹" });
        return num(r, `${n1} pens and ${m1} books cost ₹${n1 * p + m1 * q}; ${n2} pens and ${m2} books cost ₹${n2 * p + m2 * q}. What does a pen cost?`, p, `Solve the pair of equations (eliminate books): a pen costs ₹${p} and a book ₹${q}.`, { prefix: "₹", step: 5 });
      },
    ],
  },
  "quadratic-equations": {
    Easy: [
      (r) => {
        const p = r.int(1, 9), q = r.int(1, 9);
        return choice(`Find the roots of x² − ${p + q}x + ${p * q} = 0.`, `${Math.min(p, q)} and ${Math.max(p, q)}`, [`−${Math.min(p, q)} and −${Math.max(p, q)}`, `${p + q} and ${p * q}`, `${Math.min(p, q)} and ${Math.max(p, q) + 1}`], `Find two numbers with sum ${p + q} and product ${p * q}: ${p} and ${q}. So (x − ${p})(x − ${q}) = 0.`);
      },
    ],
    Medium: [
      (r) => {
        const a = r.int(1, 4), b = r.int(-12, 12), c = r.int(-12, 12);
        return choice(`For ${a === 1 ? "" : a}x² ${b >= 0 ? "+" : "−"} ${Math.abs(b)}x ${c >= 0 ? "+" : "−"} ${Math.abs(c)} = 0, what are the sum and product of the roots?`, `sum ${frac(-b, a).replace(/^(-?)/, "$1")}, product ${frac(c, a)}`, [`sum ${frac(b, a)}, product ${frac(c, a)}`, `sum ${frac(-b, a)}, product ${frac(-c, a)}`, `sum ${frac(c, a)}, product ${frac(-b, a)}`], `For ax² + bx + c = 0: sum = −b/a = ${frac(-b, a)}, product = c/a = ${frac(c, a)}.`);
      },
    ],
    Hard: [
      (r) => {
        const b = r.int(2, 10), c = r.int(1, 30), d = b * b - 4 * c;
        return choice(`What kind of roots does x² + ${b}x + ${c} = 0 have?`, d > 0 ? "Two distinct real roots" : d === 0 ? "Two equal real roots" : "No real roots", ["Two distinct real roots", "Two equal real roots", "No real roots", "Exactly three roots"].filter((x) => x !== (d > 0 ? "Two distinct real roots" : d === 0 ? "Two equal real roots" : "No real roots")).slice(0, 3), `Discriminant b² − 4ac = ${b * b} − ${4 * c} = ${d}: ${d > 0 ? "positive → two distinct real roots" : d === 0 ? "zero → equal roots" : "negative → no real roots"}.`);
      },
    ],
  },
  "algebraic-identities": {
    Easy: [
      (r) => {
        const a = r.int(11, 99);
        return num(r, `Using (a + b)², find ${a}².`, a * a, `${a}² = (${a - (a % 10)} + ${a % 10})² = ${(a - (a % 10)) ** 2} + 2 × ${a - (a % 10)} × ${a % 10} + ${(a % 10) ** 2} = ${a * a}.`);
      },
    ],
    Medium: [
      (r) => {
        const s = r.int(4, 15), p = r.int(1, Math.floor((s * s) / 4));
        return num(r, `If a + b = ${s} and ab = ${p}, find a² + b².`, s * s - 2 * p, `a² + b² = (a + b)² − 2ab = ${s * s} − ${2 * p} = ${s * s - 2 * p}.`, { extra: [s * s, s * s + 2 * p] });
      },
    ],
    Hard: [
      (r) => {
        const s = r.int(3, 10), p = r.int(1, 10);
        return num(r, `If a + b = ${s} and ab = ${p}, find a³ + b³.`, s ** 3 - 3 * p * s, `a³ + b³ = (a + b)³ − 3ab(a + b) = ${s ** 3} − 3 × ${p} × ${s} = ${s ** 3 - 3 * p * s}.`, { extra: [s ** 3] });
      },
    ],
  },
  "progressions": {
    Easy: [
      (r) => {
        const a = r.int(1, 20), d = r.int(2, 9), n = r.int(10, 30);
        return num(r, `Find the ${n}th term of the AP ${a}, ${a + d}, ${a + 2 * d}, …`, a + (n - 1) * d, `aₙ = a + (n − 1)d = ${a} + ${n - 1} × ${d} = ${a + (n - 1) * d}.`, { step: d, extra: [a + n * d] });
      },
    ],
    Medium: [
      (r) => {
        const a = r.int(1, 10), d = r.int(1, 6), n = r.int(10, 25);
        return num(r, `Find the sum of the first ${n} terms of ${a}, ${a + d}, ${a + 2 * d}, …`, (n * (2 * a + (n - 1) * d)) / 2, `Sₙ = n/2 × [2a + (n − 1)d] = ${n}/2 × [${2 * a} + ${(n - 1) * d}] = ${(n * (2 * a + (n - 1) * d)) / 2}.`);
      },
    ],
    Hard: [
      (r) => {
        const a = r.int(1, 5), q = r.pick([2, 3]), n = r.int(5, 8);
        return num(r, `Find the ${n}th term of the GP ${a}, ${a * q}, ${a * q * q}, …`, a * q ** (n - 1), `aₙ = a × r^(n − 1) = ${a} × ${q}^${n - 1} = ${a * q ** (n - 1)}.`, { extra: [a * q ** n] });
      },
    ],
  },
  "permutations": {
    Easy: [
      (r) => {
        const n = r.int(4, 7);
        return num(r, `In how many ways can ${n} people stand in a line?`, fact(n), `The first place has ${n} choices, the next ${n - 1}, and so on: ${n}! = ${fact(n)}.`, { extra: [fact(n - 1), n * n] });
      },
    ],
    Medium: [
      (r) => {
        const w = r.pick([["APPLE", 60], ["LEVEL", 30], ["BANANA", 60], ["LETTER", 180], ["SCHOOL", 360], ["COFFEE", 180]] as [string, number][]);
        return num(r, `How many different arrangements can be made of the letters of ${w[0]}?`, w[1], `${w[0].length}! divided by the factorial of each repeated letter's count gives ${w[1]}.`, { extra: [fact(w[0].length)] });
      },
    ],
    Hard: [
      (r) => {
        const n = r.int(5, 8);
        return num(r, `In how many ways can ${n} people sit around a round table?`, fact(n - 1), `Circular arrangements = (n − 1)! = ${n - 1}! = ${fact(n - 1)}.`, { extra: [fact(n)] });
      },
      (r) => {
        const n = r.int(6, 9), k = r.int(2, 4);
        return num(r, `How many ${k}-digit numbers with distinct digits can be formed from ${n} different non-zero digits?`, nPr(n, k), `ⁿPᵣ = ${n}!/(${n} − ${k})! = ${nPr(n, k)}.`, { extra: [nCr(n, k)] });
      },
    ],
  },
  "combinations": {
    Easy: [
      (r) => {
        const n = r.int(5, 12), k = r.int(2, 4);
        return num(r, `In how many ways can ${k} students be chosen from ${n}?`, nCr(n, k), `ⁿCᵣ = ${n}!/(${k}! × ${n - k}!) = ${nCr(n, k)}.`, { extra: [nPr(n, k)] });
      },
    ],
    Medium: [
      (r) => {
        const m = r.int(4, 7), w = r.int(3, 6), a = r.int(1, 3), b = r.int(1, 3);
        return num(r, `A committee of ${a} men and ${b} women is chosen from ${m} men and ${w} women. How many ways?`, nCr(m, a) * nCr(w, b), `${m}C${a} × ${w}C${b} = ${nCr(m, a)} × ${nCr(w, b)} = ${nCr(m, a) * nCr(w, b)}.`, { extra: [nCr(m + w, a + b)] });
      },
    ],
    Hard: [
      (r) => {
        const n = r.int(6, 12);
        return num(r, `How many diagonals does a ${n}-sided polygon have?`, (n * (n - 3)) / 2, `Diagonals = nC2 − n = ${nCr(n, 2)} − ${n} = ${(n * (n - 3)) / 2}.`, { extra: [nCr(n, 2)] });
      },
    ],
  },
  "probability": {
    Easy: [
      (r) => {
        const s = r.int(2, 12);
        let c = 0;
        for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === s) c++;
        return choice(`Two dice are thrown. What is the probability that the sum is ${s}?`, frac(c, 36), [frac(c + 1, 36), frac(Math.max(1, c - 1) === c ? c + 2 : Math.max(1, c - 1), 36), frac(1, 6) === frac(c, 36) ? frac(1, 12) : frac(1, 6)].filter((x, i, a) => a.indexOf(x) === i && x !== frac(c, 36)).concat([frac(c + 3, 36)]).slice(0, 3), `${c} of the 36 outcomes give ${s}, so ${frac(c, 36)}.`);
      },
    ],
    Medium: [
      (r) => {
        const red = r.int(2, 8), blue = r.int(2, 8);
        return choice(`A bag has ${red} red and ${blue} blue balls. One ball is drawn. What is the probability it is red?`, frac(red, red + blue), [frac(blue, red + blue), frac(red, blue) === frac(red, red + blue) ? frac(1, 2) : frac(red, blue), frac(red + 1, red + blue + 1)].filter((x, i, a) => a.indexOf(x) === i && x !== frac(red, red + blue)).concat(["1/3"]).slice(0, 3), `Favourable ${red} out of ${red + blue} balls.`);
      },
    ],
    Hard: [
      (r) => {
        const red = r.int(3, 7), blue = r.int(3, 7), n = red + blue;
        return choice(`A bag has ${red} red and ${blue} blue balls. Two are drawn together. What is the probability both are red?`, frac(nCr(red, 2), nCr(n, 2)), [frac(red * red, n * n), frac(nCr(blue, 2), nCr(n, 2)), frac(red, n)].filter((x, i, a) => a.indexOf(x) === i && x !== frac(nCr(red, 2), nCr(n, 2))).concat(["1/2"]).slice(0, 3), `${red}C2 / ${n}C2 = ${nCr(red, 2)}/${nCr(n, 2)} = ${frac(nCr(red, 2), nCr(n, 2))}.`);
      },
    ],
  },
  "geometry": {
    Easy: [
      (r) => {
        const a = r.int(30, 80), b = r.int(30, 80);
        return num(r, `Two angles of a triangle are ${a}° and ${b}°. Find the third.`, 180 - a - b, `Angles add up to 180°: 180 − ${a} − ${b} = ${180 - a - b}°.`, { unit: "°", step: 5 });
      },
    ],
    Medium: [
      (r) => {
        const n = r.int(5, 12);
        return num(r, `What is the sum of the interior angles of a ${n}-sided polygon?`, (n - 2) * 180, `(n − 2) × 180 = ${n - 2} × 180 = ${(n - 2) * 180}°.`, { unit: "°", step: 180 });
      },
    ],
    Hard: [
      (r) => {
        const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]]);
        return num(r, `A right triangle has legs ${a} cm and ${b} cm. Find the hypotenuse.`, c, `By Pythagoras, √(${a}² + ${b}²) = √${a * a + b * b} = ${c} cm.`, { unit: " cm", step: 1, extra: [a + b] });
      },
    ],
  },
  "mensuration": {
    Easy: [
      (r) => {
        const l = r.int(5, 30), w = r.int(3, 20);
        return num(r, `Find the area of a rectangle ${l} m by ${w} m.`, l * w, `Area = length × breadth = ${l * w} m².`, { unit: " m²", extra: [2 * (l + w)] });
      },
    ],
    Medium: [
      (r) => {
        const rad = r.pick([7, 14, 21, 3.5, 28]);
        return num(r, `Find the area of a circle of radius ${rad} cm (π = 22/7).`, (22 / 7) * rad * rad, `πr² = 22/7 × ${rad}² = ${fmt((22 / 7) * rad * rad)} cm².`, { unit: " cm²", extra: [2 * (22 / 7) * rad] });
      },
    ],
    Hard: [
      (r) => {
        const rad = r.pick([7, 14, 3.5]), h = r.int(5, 20);
        return num(r, `Find the volume of a cylinder with radius ${rad} cm and height ${h} cm (π = 22/7).`, (22 / 7) * rad * rad * h, `πr²h = 22/7 × ${rad}² × ${h} = ${fmt((22 / 7) * rad * rad * h)} cm³.`, { unit: " cm³" });
      },
      (r) => {
        const a = r.int(3, 12);
        return num(r, `Find the total surface area of a cube of side ${a} cm.`, 6 * a * a, `6a² = 6 × ${a}² = ${6 * a * a} cm².`, { unit: " cm²", extra: [a ** 3] });
      },
    ],
  },
  "data-interpretation": {
    Easy: [
      (r) => {
        const a = r.int(20, 80) * 10, g = r.pick([10, 20, 25, 40, 50]), b = a + (a * g) / 100;
        return num(r, `Sales were ${a} units in 2023 and ${b} units in 2024. What was the percentage growth?`, g, `(${b} − ${a}) / ${a} × 100 = ${g}%.`, { unit: "%", step: 5 });
      },
    ],
    Medium: [
      (r) => {
        const xs = Array.from({ length: 4 }, () => r.int(20, 90)), total = xs.reduce((a, b) => a + b, 0), i = r.int(0, 3);
        return num(r, `Four branches sold ${xs.join(", ")} units. What share of the total (to the nearest %) did branch ${i + 1} sell?`, Math.round((xs[i] / total) * 100), `${xs[i]} / ${total} × 100 ≈ ${Math.round((xs[i] / total) * 100)}%.`, { unit: "%", step: 3 });
      },
    ],
    Hard: [
      (r) => {
        const deg = r.pick([36, 45, 72, 90, 108, 120, 144]), total = r.int(2, 9) * 1000;
        return num(r, `In a pie chart of a ₹${fmt(total)} budget, travel takes ${deg}°. How much is spent on travel?`, (deg / 360) * total, `${deg}/360 × ${fmt(total)} = ${fmt((deg / 360) * total)}.`, { prefix: "₹" });
      },
    ],
  },
  "simplification-and-approximation": {
    Easy: [
      (r) => {
        const a = r.int(10, 50), b = r.int(2, 9) * r.int(2, 6), c = r.pick([2, 3, 4, 6]), d = r.int(1, 9);
        const bb = b - (b % c);
        return num(r, `Simplify: ${a} + ${bb} ÷ ${c} × 2 − ${d}`, a + (bb / c) * 2 - d, `Division first: ${bb} ÷ ${c} = ${bb / c}, × 2 = ${(bb / c) * 2}, then ${a} + ${(bb / c) * 2} − ${d} = ${a + (bb / c) * 2 - d}.`, { extra: [((a + bb) / c) * 2 - d] });
      },
    ],
    Medium: [
      (r) => {
        const n = r.int(12, 99);
        return num(r, `Find ${n} × 25 using the × 100 ÷ 4 trick.`, n * 25, `${n} × 100 = ${n * 100}, ÷ 4 = ${n * 25}.`, { extra: [n * 20] });
      },
      (r) => {
        const n = r.int(11, 89);
        return num(r, `What is ${n} × 11?`, n * 11, `Write the digits with their sum between (carrying if needed): ${n * 11}.`, { step: 10 });
      },
    ],
    Hard: [
      (r) => {
        const p = r.pick([20, 25, 40, 50, 60]), n = r.int(3, 9) * 100, m = r.int(11, 25), k = r.int(4, 9);
        return num(r, `Approximately, ${p - 0.03}% of ${n}.02 + ${m}.97 × ${k}.01 = ?`, (p * n) / 100 + (m + 1) * k, `Round: ${p}% of ${n} = ${(p * n) / 100}, and ${m + 1} × ${k} = ${(m + 1) * k}. Total ≈ ${(p * n) / 100 + (m + 1) * k}.`, { step: 15 });
      },
    ],
  },
  "surds-indices-and-logarithms": {
    Easy: [
      (r) => {
        const b = r.pick([2, 3, 5]), m = r.int(2, 6), n = r.int(2, 6);
        return choice(`Simplify ${b}^${m} × ${b}^${n}.`, `${b}^${m + n}`, [`${b}^${m * n}`, `${b * b}^${m + n}`, `${b}^${Math.abs(m - n) || 1}`], `Same base: add the exponents, ${m} + ${n} = ${m + n}.`);
      },
    ],
    Medium: [
      (r) => {
        const b = r.pick([2, 3]), k = r.int(3, 7), x = k - 1;
        return num(r, `Solve ${b}^(x + 1) = ${b ** k}.`, x, `${b ** k} = ${b}^${k}, so x + 1 = ${k} and x = ${x}.`, { step: 1 });
      },
      (r) => {
        const b = r.pick([2, 3, 5, 10]), k = r.int(2, 6);
        return num(r, `What is log base ${b} of ${b ** k}?`, k, `${b}^${k} = ${b ** k}, so the log is ${k}.`, { step: 1, min: 0 });
      },
    ],
    Hard: [
      (r) => {
        const n = r.pick([10, 15, 20, 25, 30, 40, 50]), digits = Math.floor(n * 0.30103) + 1;
        return num(r, `How many digits does 2^${n} have? (log 2 ≈ 0.30103)`, digits, `${n} × 0.30103 = ${fmt(n * 0.30103)}; digits = floor(that) + 1 = ${digits}.`, { step: 1, min: 1 });
      },
    ],
  },
  "problems-on-ages": {
    Easy: [
      (r) => {
        const s = r.int(5, 15), k = r.pick([2, 3, 4]), y = r.int(3, 10);
        return num(r, `A father is ${k} times as old as his son, who is ${s}. How old will the father be in ${y} years?`, k * s + y, `Father now ${k} × ${s} = ${k * s}; in ${y} years ${k * s + y}.`, { step: 2 });
      },
    ],
    Medium: [
      (r) => {
        const s = r.int(5, 15), f = 3 * s, y = f - 2 * s; // f + y = 2(s + y) → y = f − 2s = s
        return num(r, `A father is three times as old as his son. In ${y} years he will be twice as old. How old is the son now?`, s, `3s + ${y} = 2(s + ${y}) gives s = ${y}.`, { step: 2, min: 1 });
      },
    ],
    Hard: [
      (r) => {
        const k = r.int(2, 6), a = 5 * k, b = 3 * k, t = r.int(2, b - 1);
        return choice(`A : B = 5 : 3 now. ${t} years ago their ages were ${a - t} and ${b - t}. What is A's present age?`, `${a}`, [`${a + 5}`, `${b}`, `${a - t}`].filter((x) => x !== `${a}`), `Ratio 5 : 3 with A − B = ${a - b} means one part = ${k}; A = ${a}.`);
      },
    ],
  },
  "mixtures-and-alligation": {
    Easy: [
      (r) => {
        const c = r.int(2, 6) * 10, d = c + r.int(2, 5) * 10, m = c + r.int(1, (d - c) / 10 - 1) * 10;
        const g = gcd(d - m, m - c);
        return choice(`Rice at ₹${c}/kg and ₹${d}/kg is mixed to get ₹${m}/kg. In what ratio (cheaper : dearer)?`, `${(d - m) / g} : ${(m - c) / g}`, [`${(m - c) / g} : ${(d - m) / g}`, `${(d - m) / g + 1} : ${(m - c) / g}`, `1 : 1`].filter((x, i, a) => a.indexOf(x) === i && x !== `${(d - m) / g} : ${(m - c) / g}`).concat(["2 : 5"]).slice(0, 3), `(dearer − mean) : (mean − cheaper) = (${d} − ${m}) : (${m} − ${c}).`);
      },
    ],
    Medium: [
      (r) => {
        const total = r.int(4, 12) * 10, milk = (total * 2) / 3, water = total / 3;
        return num(r, `${total} L of milk and water are in the ratio 2 : 1. How much water must be added to make the ratio 1 : 2?`, 2 * milk - water, `Milk stays ${fmt(milk)} L; water must be 2 × ${fmt(milk)} = ${fmt(2 * milk)} L; add ${fmt(2 * milk - water)} L.`, { unit: " L" });
      },
    ],
    Hard: [
      (r) => {
        const v = r.pick([40, 50, 80, 100]), x = v / r.pick([10, 5]), n = r.pick([2, 3]), left = v * (1 - x / v) ** n;
        return num(r, `A vessel holds ${v} L of milk. ${x} L is replaced with water, ${n} times. How much milk is left?`, Math.round(left * 100) / 100, `${v} × (1 − ${x}/${v})^${n} = ${fmt(left)} L.`, { unit: " L", step: 2 });
      },
    ],
  },
  "partnership": {
    Easy: [
      (r) => {
        const a = r.int(2, 9) * 1000, b = r.int(2, 9) * 1000, p = (a + b) * r.int(1, 4);
        return num(r, `A invests ₹${fmt(a)} and B ₹${fmt(b)} for the same time. Profit ₹${fmt(p)}. What is A's share?`, (p * a) / (a + b), `Shares follow capital: ${a / gcd(a, b)} : ${b / gcd(a, b)}. A gets ${fmt((p * a) / (a + b))}.`, { prefix: "₹" });
      },
    ],
    Medium: [
      (r) => {
        const a = r.int(2, 6) * 1000, b = r.int(2, 6) * 1000, m = r.int(2, 6), ca = a * 12, cb = b * (12 - m), p = (ca + cb) / 100;
        return num(r, `A starts with ₹${fmt(a)}; B joins after ${m} months with ₹${fmt(b)}. Year's profit ₹${fmt(p)}. What is B's share?`, (p * cb) / (ca + cb), `A: ${fmt(a)} × 12 = ${fmt(ca)}; B: ${fmt(b)} × ${12 - m} = ${fmt(cb)}. B gets ${fmt(cb)}/${fmt(ca + cb)} of the profit = ${fmt((p * cb) / (ca + cb))}.`, { prefix: "₹" });
      },
    ],
    Hard: [
      (r) => {
        const [x, y] = r.pick([[3, 4], [2, 3], [4, 5], [3, 5]]), [tx, ty] = r.pick([[4, 9], [6, 8], [5, 6], [8, 3]]), p = (x * tx + y * ty) * 500;
        return num(r, `A invests ${x}k for ${tx} months and B invests ${y}k for ${ty} months. Profit ₹${fmt(p)}. What is A's share?`, (p * x * tx) / (x * tx + y * ty), `Capital × time: ${x * tx}k : ${y * ty}k, so A gets ${x * tx}/${x * tx + y * ty} × ${fmt(p)}.`, { prefix: "₹" });
      },
    ],
  },
  "remainders-and-unit-digits": {
    Easy: [
      (r) => {
        const b = r.pick([12, 23, 34, 47, 58, 69, 77, 88, 93]), e = r.int(10, 99), d = unitDigit(b, e);
        return num(r, `What is the unit digit of ${b}^${e}?`, d, `Only the last digit ${b % 10} matters; its cycle is ${UNIT_CYCLES[b % 10].join(", ")}, giving ${d}.`, { step: 1, min: 0 });
      },
    ],
    Medium: [
      (r) => {
        const a = r.int(20, 99), b = r.int(20, 99), m = r.pick([5, 6, 7, 9]);
        return num(r, `What is the remainder when ${a} × ${b} is divided by ${m}?`, (a * b) % m, `Multiply the remainders: (${a % m} × ${b % m}) mod ${m} = ${(a * b) % m}.`, { step: 1, min: 0 });
      },
    ],
    Hard: [
      (r) => {
        const b = r.pick([2, 3, 4, 5]), m = r.pick([7, 11, 13]), e = r.int(30, 99);
        return num(r, `What is the remainder when ${b}^${e} is divided by ${m}?`, powMod(b, e, m), `Use the cycle of remainders of powers of ${b} mod ${m} (or Fermat: ${b}^${m - 1} leaves 1): the remainder is ${powMod(b, e, m)}.`, { step: 1, min: 0 });
      },
    ],
  },

  // ── New topics ──
  "decimal-fractions": {
    Easy: [
      (r) => {
        const [p, q] = r.pick([[1, 4], [3, 8], [5, 8], [7, 20], [3, 25], [9, 40], [1, 16]]);
        return num(r, `Write ${p}/${q} as a decimal.`, p / q, `Divide the top by the bottom: ${p} ÷ ${q} = ${p / q}.`, { step: 0.05 });
      },
    ],
    Medium: [
      (r) => {
        const a = r.int(1, 8);
        return choice(`Write 0.${a}${a}${a}… (recurring) as a fraction.`, frac(a, 9), [frac(a, 10), frac(a, 99), frac(a * 10 + a, 100)], `A single recurring digit a is a/9: ${frac(a, 9)}.`);
      },
    ],
    Hard: [
      (r) => {
        const a = r.int(2, 9) / 10, b = r.int(2, 9) / 100, c = r.int(1, 5) / 100;
        return num(r, `Simplify (${a} × ${b}) ÷ ${c}.`, (a * b) / c, `${a} × ${b} = ${fmt(a * b)}; ÷ ${c} = ${fmt((a * b) / c)}. Count decimal places to avoid slips.`, { step: 0.2 });
      },
    ],
  },
  "square-and-cube-roots": {
    Easy: [
      (r) => {
        const n = r.int(11, 99);
        return num(r, `Find √${n * n}.`, n, `The square root is the number that times itself gives ${n * n}: ${n} × ${n} = ${n * n}.`, { step: 2 });
      },
    ],
    Medium: [
      (r) => {
        const n = r.int(4, 25);
        return num(r, `Find the cube root of ${n ** 3}.`, n, `The cube root is the number used three times: ${n} × ${n} × ${n} = ${n ** 3}.`, { step: 1 });
      },
    ],
    Hard: [
      (r) => {
        const n = r.int(11, 49);
        return num(r, `Find √${fmt((n * n) / 100)}.`, n / 10, `${fmt((n * n) / 100)} = ${n * n}/100, so the root is ${n}/10 = ${n / 10}.`, { step: 0.1 });
      },
      (r) => {
        const a = r.pick([16, 25, 36, 49, 64, 81, 100, 121, 144]), b = r.pick([4, 9, 16, 25]);
        return num(r, `Find √${a} + √${b} × √${b}.`, Math.sqrt(a) + b, `√${a} = ${Math.sqrt(a)}, and √${b} × √${b} = ${b}. Total ${Math.sqrt(a) + b}.`, { step: 2 });
      },
    ],
  },
  "chain-rule-and-variation": {
    Easy: [
      (r) => {
        const n = r.int(3, 9), cost = n * r.int(5, 40), m = r.int(10, 30);
        return num(r, `If ${n} pens cost ₹${cost}, what do ${m} pens cost?`, (cost / n) * m, `One pen ₹${fmt(cost / n)}; ${m} pens ₹${fmt((cost / n) * m)}. More pens, more cost: direct variation.`, { prefix: "₹" });
      },
    ],
    Medium: [
      (r) => {
        const men = r.int(4, 12), days = r.int(6, 30), men2 = r.pick([2, 3, 4, 5, 6].map((k) => men * k / 2).filter((x) => Number.isInteger(x) && x !== men));
        return num(r, `${men} workers finish a job in ${days} days. How many days do ${men2} workers take?`, (men * days) / men2, `Workers × days stays constant: ${men} × ${days} = ${men * days}; ${men * days} / ${men2} = ${fmt((men * days) / men2)} days.`, { unit: " days", step: 2, min: 1 });
      },
    ],
    Hard: [
      (r) => {
        const m1 = r.int(4, 10), d1 = r.int(6, 15), h1 = r.int(6, 9), m2 = m1 * 2, h2 = r.int(4, 8), w = r.pick([1, 2]);
        const d2 = (m1 * d1 * h1 * w) / (m2 * h2);
        return num(r, `${m1} men working ${h1} hours a day finish a job in ${d1} days. How many days will ${m2} men working ${h2} hours a day take to finish ${w === 1 ? "the same job" : "twice the work"}?`, Math.round(d2 * 100) / 100, `M₁D₁H₁/W₁ = M₂D₂H₂/W₂: ${m1} × ${d1} × ${h1} / 1 = ${m2} × D × ${h2} / ${w}, so D = ${fmt(d2)}.`, { unit: " days", step: 2, min: 1 });
      },
    ],
  },
  "problems-on-numbers": {
    Easy: [
      (r) => {
        const a = r.int(10, 60), b = r.int(1, a - 1);
        return num(r, `The sum of two numbers is ${a + b} and their difference is ${a - b}. Find the larger number.`, a, `Larger = (sum + difference)/2 = (${a + b} + ${a - b})/2 = ${a}.`, { step: 2 });
      },
    ],
    Medium: [
      (r) => {
        const t = r.int(1, 8), u = r.int(t + 1, 9);
        return num(r, `A two-digit number's digits add up to ${t + u}. Swapping the digits increases the number by ${9 * (u - t)}. Find the number.`, 10 * t + u, `Swapping increases it by 9 × (units − tens) = ${9 * (u - t)}, so units − tens = ${u - t}; with sum ${t + u}, tens = ${t}, units = ${u}: ${10 * t + u}.`, { step: 9 });
      },
    ],
    Hard: [
      (r) => {
        const x = r.int(5, 20);
        return num(r, `A number added to its square gives ${x * x + x}. Find the (positive) number.`, x, `x² + x = ${x * x + x}: try ${x}: ${x * x} + ${x} = ${x * x + x}.`, { step: 1, min: 1 });
      },
    ],
  },
  "races-and-games": {
    Easy: [
      (r) => {
        const d = r.pick([100, 200, 500, 1000]), b = r.int(1, 9) * (d / 100) * 2;
        return num(r, `In a ${d} m race, A beats B by ${b} m. How far has B run when A finishes?`, d - b, `When A covers ${d} m, B covers ${d} − ${b} = ${d - b} m.`, { unit: " m", step: 5 });
      },
    ],
    Medium: [
      (r) => {
        const d = r.pick([100, 200, 500]), ta = r.int(10, 40), bt = r.int(2, 8), tb = ta + bt;
        return num(r, `A runs ${d} m in ${ta} s and beats B by ${bt} s. By how many metres does A beat B?`, Math.round(((d * bt) / tb) * 100) / 100, `B's speed = ${d}/${tb} m/s; in ${bt} s B covers ${fmt((d * bt) / tb)} m, the margin.`, { unit: " m", step: 3 });
      },
    ],
    Hard: [
      (r) => {
        const [x, y] = r.pick([[10, 20], [20, 30], [10, 40], [25, 20], [20, 25]]), d = 100;
        // A beats B by x, B beats C by y (in 100 m races): when A runs 100, C runs (100−x)(100−y)/100
        const c = ((d - x) * (d - y)) / d;
        return num(r, `In a 100 m race A beats B by ${x} m, and B beats C by ${y} m. By how much does A beat C?`, d - c, `When A runs 100, B runs ${100 - x}; C runs ${100 - y}% of that = ${fmt(c)}. A wins by ${fmt(d - c)} m.`, { unit: " m", step: 3, extra: [x + y] });
      },
    ],
  },
  "heights-and-distances": {
    Easy: [
      (r) => {
        const d = r.int(10, 60);
        return num(r, `From a point ${d} m from a tower's base, the angle of elevation of the top is 45°. How tall is the tower?`, d, `tan 45° = 1 = height / ${d}, so height = ${d} m.`, { unit: " m", step: 5 });
      },
    ],
    Medium: [
      (r) => {
        const h = r.int(5, 40);
        return choice(`A tower is ${h} m tall. The angle of elevation from a point on the ground is 60°. How far is the point from the base?`, `${h}/√3 m`, [`${h}√3 m`, `${h} m`, `${2 * h} m`], `tan 60° = √3 = ${h} / d, so d = ${h}/√3 m (≈ ${fmt(h / Math.sqrt(3))} m).`);
      },
    ],
    Hard: [
      (r) => {
        const d = r.int(5, 30);
        return choice(`From a point ${d} m from a building, the angle of elevation is 30°. How tall is the building?`, `${d}/√3 m`, [`${d}√3 m`, `${d} m`, `${d}/2 m`], `tan 30° = 1/√3 = h / ${d}, so h = ${d}/√3 m (≈ ${fmt(d / Math.sqrt(3))} m).`);
      },
    ],
  },
  "stocks-and-shares": {
    Easy: [
      (r) => {
        const face = 100, div = r.pick([5, 6, 8, 10, 12]), n = r.int(10, 100);
        return num(r, `You own ${n} shares of face value ₹100 paying a ${div}% dividend. What is your annual income?`, n * div, `Dividend is on face value: ${div}% of ₹${face} = ₹${div} per share; ${n} shares give ₹${n * div}.`, { prefix: "₹" });
      },
    ],
    Medium: [
      (r) => {
        const div = r.pick([5, 8, 10, 12]), price = r.pick([80, 100, 120, 125, 150, 160, 200]);
        return num(r, `A ${div}% stock (face value ₹100) is bought at ₹${price}. What is the rate of return?`, (div / price) * 100, `Return = dividend / price paid = ${div}/${price} × 100 = ${fmt((div / price) * 100)}%.`, { unit: "%", step: 1 });
      },
    ],
    Hard: [
      (r) => {
        const div = r.pick([5, 8, 10]), price = r.pick([80, 100, 125]), inv = price * r.int(20, 100);
        return num(r, `₹${fmt(inv)} is invested in a ${div}% stock at ₹${price}. What is the annual income?`, (inv / price) * div, `Shares bought = ${fmt(inv)} / ${price} = ${inv / price}; income = ${inv / price} × ₹${div} = ${fmt((inv / price) * div)}.`, { prefix: "₹" });
      },
    ],
  },
  "true-and-bankers-discount": {
    Easy: [
      (r) => {
        const pw = r.int(5, 50) * 100, rate = r.pick([5, 8, 10, 12]), t = r.pick([1, 2, 3]);
        return num(r, `The present worth of a bill is ₹${fmt(pw)}, due in ${t} year${t > 1 ? "s" : ""} at ${rate}%. Find the true discount.`, (pw * rate * t) / 100, `True discount = interest on the present worth = ${fmt(pw)} × ${rate} × ${t} / 100 = ${fmt((pw * rate * t) / 100)}.`, { prefix: "₹" });
      },
    ],
    Medium: [
      (r) => {
        const amt = r.int(5, 50) * 100, rate = r.pick([5, 8, 10, 12]), t = r.pick([1, 2]);
        return num(r, `A bill of ₹${fmt(amt)} is due in ${t} year${t > 1 ? "s" : ""}. At ${rate}%, find the banker's discount.`, (amt * rate * t) / 100, `Banker's discount = simple interest on the face value = ${fmt(amt)} × ${rate} × ${t} / 100 = ${fmt((amt * rate * t) / 100)}.`, { prefix: "₹" });
      },
    ],
    Hard: [
      (r) => {
        const td = r.int(2, 20) * 10, rate = r.pick([5, 10]), t = r.pick([1, 2]), pw = (td * 100) / (rate * t), bg = (td * rate * t) / 100;
        return num(r, `The true discount on a bill due in ${t} year${t > 1 ? "s" : ""} at ${rate}% is ₹${fmt(td)}. Find the banker's gain.`, bg, `Banker's gain = interest on the true discount = ${fmt(td)} × ${rate} × ${t} / 100 = ${fmt(bg)} (present worth ₹${fmt(pw)}).`, { prefix: "₹" });
      },
    ],
  },
};
