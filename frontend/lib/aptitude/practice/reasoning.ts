// Generated practice for Logical Reasoning. Every answer is computed from the generated puzzle.
import { num, type Generator, type RawQ, type Rng } from "./core";

const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const at = (i: number) => L[((i % 26) + 26) % 26];
const pos = (c: string) => L.indexOf(c);
const choice = (q: string, correct: string, wrong: string[], explanation: string): RawQ => ({ q, correct, wrong, explanation });
const uniq = (xs: string[], not: string) => [...new Set(xs.filter((x) => x !== not))].slice(0, 3);
const NAMES = ["Asha", "Ravi", "Meera", "Kiran", "Arjun", "Divya", "Farhan", "Neha", "Rohit", "Sana", "Vikram", "Pooja", "Imran", "Lata", "Tarun"];
const names = (r: Rng, n: number) => r.shuffle(NAMES).slice(0, n);
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const WORDS = ["CAT", "DOG", "SUN", "PEN", "BOOK", "TREE", "FISH", "LAMP", "GOLD", "MILK", "ROSE", "SHIP", "CODE", "DESK", "KING"];

function series(r: Rng): { terms: number[]; next: number; rule: string } {
  const t = r.int(0, 5);
  if (t === 0) {
    const a = r.int(2, 30), d = r.int(3, 12);
    const terms = Array.from({ length: 5 }, (_, i) => a + i * d);
    return { terms, next: a + 5 * d, rule: `add ${d} each time` };
  }
  if (t === 1) {
    const a = r.int(1, 6), k = r.pick([2, 3]);
    const terms = Array.from({ length: 5 }, (_, i) => a * k ** i);
    return { terms, next: a * k ** 5, rule: `multiply by ${k}` };
  }
  if (t === 2) {
    const s = r.int(1, 6), c = r.pick([-1, 1, 2, 3]);
    const terms = Array.from({ length: 5 }, (_, i) => (s + i) ** 2 + c);
    return { terms, next: (s + 5) ** 2 + c, rule: `n² ${c >= 0 ? "+" : "−"} ${Math.abs(c)} for n = ${s}, ${s + 1}, …` };
  }
  if (t === 3) {
    const a = r.int(1, 10), d = r.int(1, 4), k = r.int(1, 3);
    const terms = [a];
    for (let i = 1; i < 5; i++) terms.push(terms[i - 1] + d + (i - 1) * k);
    return { terms, next: terms[4] + d + 4 * k, rule: `differences ${d}, ${d + k}, ${d + 2 * k}, … grow by ${k}` };
  }
  if (t === 4) {
    const a = r.int(1, 5), m = r.pick([2, 3]), c = r.pick([1, -1, 2]);
    const terms = [a];
    for (let i = 1; i < 5; i++) terms.push(terms[i - 1] * m + c);
    return { terms, next: terms[4] * m + c, rule: `× ${m} ${c >= 0 ? "+" : "−"} ${Math.abs(c)}` };
  }
  const a = r.int(1, 9), b = r.int(10, 30), d1 = r.int(2, 5), d2 = r.int(5, 10);
  const terms = [a, b, a + d1, b + d2, a + 2 * d1];
  return { terms, next: b + 2 * d2, rule: `two series alternate: ${a}, ${a + d1}, ${a + 2 * d1} (+${d1}) and ${b}, ${b + d2}, … (+${d2})` };
}

/** A clean random chain like A > B ≥ C = D, with its definite relation between the ends. */
function chain(r: Rng) {
  const letters = r.shuffle(["P", "Q", "R", "S", "T", "M", "N", "K"]).slice(0, 4);
  const dir = r.pick(["up", "down", "mixed"]);
  const ups = [">", "≥", "="], downs = ["<", "≤", "="];
  const signs = [0, 1, 2].map(() => (dir === "up" ? r.pick(ups) : dir === "down" ? r.pick(downs) : r.pick([...ups, ...downs])));
  const hasUp = signs.some((s) => s === ">" || s === "≥"), hasDown = signs.some((s) => s === "<" || s === "≤");
  const strict = signs.some((s) => s === ">" || s === "<");
  let rel: string;
  if (hasUp && hasDown) rel = "No definite relation";
  else if (!hasUp && !hasDown) rel = `${letters[0]} = ${letters[3]}`;
  else if (hasUp) rel = `${letters[0]} ${strict ? ">" : "≥"} ${letters[3]}`;
  else rel = `${letters[0]} ${strict ? "<" : "≤"} ${letters[3]}`;
  const text = letters.map((l, i) => (i < 3 ? `${l} ${signs[i]} ` : l)).join("");
  return { letters, text, rel };
}

export const reasoningGenerators: Record<string, Generator> = {
  "number-series": {
    Easy: [
      (r) => {
        const s = series(r);
        return num(r, `Find the next number: ${s.terms.join(", ")}, ?`, s.next, `Rule: ${s.rule}. Next: ${s.next}.`, { step: Math.max(1, Math.round(Math.abs(s.next - s.terms[4]) / 2)) });
      },
    ],
    Medium: [
      (r) => {
        const s = series(r);
        const i = r.int(1, 3), missing = s.terms[i];
        const shown = s.terms.map((x, k) => (k === i ? "?" : x));
        return num(r, `Find the missing number: ${shown.join(", ")}, ${s.next}`, missing, `Rule: ${s.rule}, so the missing term is ${missing}.`, { step: Math.max(1, Math.round(Math.abs(s.terms[i] - s.terms[i - 1]) / 2)) });
      },
    ],
    Hard: [
      (r) => {
        const a = r.int(2, 9), d = r.int(3, 9), terms = Array.from({ length: 6 }, (_, k) => a + k * d), i = r.int(1, 4), wrong = terms[i] + r.pick([-2, -1, 1, 2]);
        const shown = terms.map((x, k) => (k === i ? wrong : x));
        return choice(`Find the wrong term: ${shown.join(", ")}`, `${wrong}`, uniq(shown.map(String), `${wrong}`).slice(0, 3), `The rule is +${d}: ${terms.join(", ")}. ${wrong} should be ${terms[i]}.`);
      },
    ],
  },
  "alphabet-series": {
    Easy: [
      (r) => {
        const s = r.int(0, 12), d = r.int(2, 5), t = Array.from({ length: 5 }, (_, i) => at(s + i * d));
        return choice(`Find the next letter: ${t.join(", ")}, ?`, at(s + 5 * d), uniq([at(s + 5 * d + 1), at(s + 5 * d - 1), at(s + 4 * d + 1), at(s + 6 * d)], at(s + 5 * d)), `Each letter moves ${d} places forward (${t.map((c) => pos(c) + 1).join(", ")}), so next is ${at(s + 5 * d)}.`);
      },
    ],
    Medium: [
      (r) => {
        const s = r.int(0, 6), d = r.int(1, 3), t: string[] = [];
        let p = s;
        for (let i = 0; i < 5; i++) {
          t.push(at(p));
          p += d + i;
        }
        return choice(`Find the next letter: ${t.join(", ")}, ?`, at(p), uniq([at(p + 1), at(p - 1), at(p + 2), at(p - 2)], at(p)), `Gaps grow by one: +${d}, +${d + 1}, +${d + 2}, +${d + 3}, so the next gap is +${d + 4}: ${at(p)}.`);
      },
    ],
    Hard: [
      (r) => {
        const s = r.int(0, 10), t = Array.from({ length: 4 }, (_, i) => at(s + i * 3) + at(25 - s - i * 3));
        const ans = at(s + 12) + at(25 - s - 12);
        return choice(`Find the next pair: ${t.join(", ")}, ?`, ans, uniq([at(s + 12) + at(25 - s - 11), at(s + 13) + at(25 - s - 12), at(s + 11) + at(25 - s - 13), at(25 - s - 12) + at(s + 12)], ans), `First letters move +3; second letters are their mirror from the end (A↔Z): ${ans}.`);
      },
    ],
  },
  "alphanumeric-series": {
    Easy: [
      (r) => {
        const s = r.int(0, 10), d = r.int(1, 3), k = r.int(1, 4), n0 = r.int(1, 5);
        const t = Array.from({ length: 4 }, (_, i) => `${at(s + i * d)}${n0 + i * k}`);
        const ans = `${at(s + 4 * d)}${n0 + 4 * k}`;
        return choice(`Find the next term: ${t.join(", ")}, ?`, ans, uniq([`${at(s + 4 * d)}${n0 + 4 * k + 1}`, `${at(s + 4 * d + 1)}${n0 + 4 * k}`, `${at(s + 3 * d)}${n0 + 4 * k}`, `${at(s + 4 * d + 1)}${n0 + 5 * k}`], ans), `Letters move +${d}, numbers +${k}: ${ans}.`);
      },
    ],
    Medium: [
      (r) => {
        const s = r.int(0, 8);
        const t = Array.from({ length: 4 }, (_, i) => `${at(s + i * 2)}${pos(at(s + i * 2)) + 1}`);
        const ans = `${at(s + 8)}${pos(at(s + 8)) + 1}`;
        return choice(`Find the next term: ${t.join(", ")}, ?`, ans, uniq([`${at(s + 8)}${pos(at(s + 8))}`, `${at(s + 7)}${pos(at(s + 8)) + 1}`, `${at(s + 9)}${pos(at(s + 9)) + 1}`, `${at(s + 8)}${pos(at(s + 8)) + 2}`], ans), `Each letter is followed by its position in the alphabet, and letters skip one: ${ans}.`);
      },
    ],
    Hard: [
      (r) => {
        const s = r.int(0, 6), n = r.int(2, 4);
        const t = Array.from({ length: 4 }, (_, i) => `${n ** (i + 1)}${at(s + i * 4)}`);
        const ans = `${n ** 5}${at(s + 16)}`;
        return choice(`Find the next term: ${t.join(", ")}, ?`, ans, uniq([`${n ** 5}${at(s + 15)}`, `${n ** 4 * (n + 1)}${at(s + 16)}`, `${n * 5}${at(s + 16)}`, `${n ** 5}${at(s + 17)}`], ans), `Numbers are powers of ${n}; letters move +4: ${ans}.`);
      },
    ],
  },
  "analogies": {
    Easy: [
      (r) => {
        const a = r.int(2, 9), b = r.int(2, 15);
        return num(r, `${a} : ${a * a} :: ${b} : ?`, b * b, `Each number is paired with its square: ${b}² = ${b * b}.`, { extra: [b * 2, b ** 3] });
      },
    ],
    Medium: [
      (r) => {
        const a = r.int(2, 6), b = r.int(2, 9);
        return num(r, `${a} : ${a ** 3} :: ${b} : ?`, b ** 3, `Each number is paired with its cube: ${b}³ = ${b ** 3}.`, { extra: [b * b] });
      },
      (r) => {
        const k = r.int(1, 4), s1 = r.int(0, 20), s2 = r.int(0, 20);
        const x = at(s1) + at(s1 + 1), y = at(s1 + k) + at(s1 + 1 + k), z = at(s2) + at(s2 + 1), ans = at(s2 + k) + at(s2 + 1 + k);
        return choice(`${x} : ${y} :: ${z} : ?`, ans, uniq([at(s2 + k + 1) + at(s2 + 2 + k), at(s2 + k) + at(s2 + k), at(s2 - k) + at(s2 + 1 - k), at(s2 + 1 + k) + at(s2 + k)], ans), `Each letter moves ${k} places forward: ${z} → ${ans}.`);
      },
    ],
    Hard: [
      (r) => {
        const a = r.int(2, 9), b = r.int(2, 12);
        return num(r, `${a} : ${a * a + a} :: ${b} : ?`, b * b + b, `The rule is n² + n: ${b}² + ${b} = ${b * b + b}.`, { extra: [b * b, b * b - b] });
      },
    ],
  },
  "odd-one-out": {
    Easy: [
      (r) => {
        const sq = r.shuffle([16, 25, 36, 49, 64, 81, 100, 121, 144]).slice(0, 3), odd = r.pick([18, 27, 45, 50, 63, 72, 80, 98]);
        return choice(`Find the odd one out: ${r.shuffle([...sq, odd]).join(", ")}`, `${odd}`, sq.map(String), `${sq.join(", ")} are perfect squares; ${odd} isn't.`);
      },
    ],
    Medium: [
      (r) => {
        const pr = r.shuffle([11, 13, 17, 19, 23, 29, 31, 37, 41, 43]).slice(0, 3), odd = r.pick([21, 27, 33, 39, 49, 51, 57]);
        return choice(`Find the odd one out: ${r.shuffle([...pr, odd]).join(", ")}`, `${odd}`, pr.map(String), `${pr.join(", ")} are prime; ${odd} = ${[3, 7, 17, 19].find((d) => odd % d === 0)} × ${odd / [3, 7, 17, 19].find((d) => odd % d === 0)!}.`);
      },
    ],
    Hard: [
      (r) => {
        const d = r.int(2, 4), groups = [0, 1, 2].map(() => {
          const s = r.int(0, 15);
          return at(s) + at(s + d) + at(s + 2 * d);
        });
        const s = r.int(0, 15), odd = at(s) + at(s + d) + at(s + 2 * d + 1);
        return choice(`Find the odd one out: ${r.shuffle([...groups, odd]).join(", ")}`, odd, groups, `In the others each letter is ${d} places after the previous one; in ${odd} the last gap is ${d + 1}.`);
      },
    ],
  },
  "coding-decoding": {
    Easy: [
      (r) => {
        const k = r.int(1, 3), [w1, w2] = r.shuffle(WORDS).slice(0, 2), code = (w: string, s: number) => [...w].map((c) => at(pos(c) + s)).join("");
        return choice(`If ${w1} is written as ${code(w1, k)}, how is ${w2} written?`, code(w2, k), uniq([code(w2, k + 1), code(w2, -k), code(w2, k).split("").reverse().join(""), code(w2, k - 1 || 2)], code(w2, k)), `Each letter moves ${k} place${k > 1 ? "s" : ""} forward: ${w2} → ${code(w2, k)}.`);
      },
    ],
    Medium: [
      (r) => {
        const [w1, w2] = r.shuffle(WORDS).slice(0, 2), mirror = (w: string) => [...w].map((c) => at(25 - pos(c))).join("");
        return choice(`In a code, ${w1} is written as ${mirror(w1)}. How is ${w2} written?`, mirror(w2), uniq([[...w2].map((c) => at(pos(c) + 1)).join(""), mirror(w2).split("").reverse().join(""), [...w2].map((c) => at(24 - pos(c))).join(""), w2.split("").reverse().join("")], mirror(w2)), `Each letter is replaced by its mirror from the other end (A↔Z, B↔Y): ${w2} → ${mirror(w2)}.`);
      },
    ],
    Hard: [
      (r) => {
        const [w1, w2] = r.shuffle(WORDS).slice(0, 2), sum = (w: string) => [...w].reduce((s, c) => s + pos(c) + 1, 0);
        return num(r, `If ${w1} is coded as ${sum(w1)}, what is the code for ${w2}?`, sum(w2), `The code is the sum of letter positions: ${[...w2].map((c) => `${c}=${pos(c) + 1}`).join(", ")}, total ${sum(w2)}.`, { step: 2 });
      },
    ],
  },
  "blood-relations": {
    Easy: [
      (r) => {
        const [a, b, c] = names(r, 3);
        return choice(`${a} is the father of ${b}. ${b} is the sister of ${c}. How is ${a} related to ${c}?`, "Father", ["Brother", "Uncle", "Grandfather"], `${b} and ${c} are siblings, so ${b}'s father is also ${c}'s father.`);
      },
      (r) => {
        const [a, b] = names(r, 2);
        return choice(`${a}'s father is ${b}'s only son. How is ${b} related to ${a}?`, "Grandfather", ["Father", "Uncle", "Brother"], `${b}'s son is ${a}'s father, so ${b} is ${a}'s grandfather.`);
      },
    ],
    Medium: [
      (r) => {
        const [a, b, c] = names(r, 3);
        return choice(`${a} is the brother of ${b}. ${b} is the mother of ${c}. How is ${a} related to ${c}?`, "Maternal uncle", ["Father", "Grandfather", "Cousin"], `${a} is the brother of ${c}'s mother: ${c}'s maternal uncle.`);
      },
      (r) => {
        const [x, y, z] = names(r, 3);
        return choice(`${x} is the wife of ${y}. ${y} is the brother of ${z}. How is ${x} related to ${z}?`, "Sister-in-law", ["Sister", "Mother", "Aunt"], `${x} is married to ${z}'s brother, so she is ${z}'s sister-in-law.`);
      },
    ],
    Hard: [
      (r) => {
        const [m, n] = names(r, 2);
        return choice(`${m} is the son of ${n}'s only brother. How is ${m} related to ${n}?`, "Nephew", ["Son", "Brother", "Cousin"], `${m}'s father is ${n}'s brother, so ${m} is ${n}'s nephew.`);
      },
      (r) => {
        const [a, b, c, d] = names(r, 4);
        return choice(`${a} is ${b}'s sister. ${c} is ${b}'s mother. ${d} is ${c}'s father. How is ${a} related to ${d}?`, "Granddaughter", ["Daughter", "Niece", "Sister"], `${d} is the father of ${a}'s mother, so ${a} is ${d}'s granddaughter.`);
      },
      () => choice(`Pointing to a man, a woman said, "His mother is the only daughter of my mother." How is the woman related to the man?`, "Mother", ["Sister", "Aunt", "Grandmother"], `The only daughter of her mother is the woman herself, so she is the man's mother.`),
    ],
  },
  "direction-sense": {
    Easy: [
      (r) => {
        const start = r.int(0, 3), turns = Array.from({ length: 3 }, () => r.pick(["right", "left"])), dirs = ["North", "East", "South", "West"];
        let d = start;
        for (const t of turns) d = (d + (t === "right" ? 1 : 3)) % 4;
        return choice(`You face ${dirs[start]} and turn ${turns.join(", then ")}. Which way do you face now?`, dirs[d], dirs.filter((x) => x !== dirs[d]), `Each right turn moves one step clockwise (N → E → S → W); each left one step back. You end facing ${dirs[d]}.`);
      },
    ],
    Medium: [
      (r) => {
        const [a, b] = r.pick([[3, 4], [6, 8], [5, 12], [8, 6], [4, 3], [12, 5]]), n = names(r, 1)[0];
        return num(r, `${n} walks ${a} km north, then ${b} km east. How far is ${n} from the start?`, Math.hypot(a, b), `The path makes a right angle: √(${a}² + ${b}²) = ${Math.hypot(a, b)} km.`, { unit: " km", step: 1, extra: [a + b] });
      },
    ],
    Hard: [
      (r) => {
        const n = names(r, 1)[0], a = r.int(3, 9), b = r.int(2, 8), c = a + r.pick([3, 4, 6, 8]), d = b;
        // north a, east b, south c, west d → net: south (c − a), east 0
        return choice(`${n} walks ${a} km north, ${b} km east, ${c} km south and ${d} km west. Where is ${n} now relative to the start?`, `${c - a} km south`, [`${c - a} km north`, `${c + a} km south`, `${b} km east`], `North and south: ${a} − ${c} = −${c - a} (south). East and west cancel (${b} − ${d} = 0). So ${c - a} km south.`);
      },
    ],
  },
  "ranking-and-ordering": {
    Easy: [
      (r) => {
        const t = r.int(3, 25), b = r.int(3, 25), n = names(r, 1)[0];
        return num(r, `${n} is ${t}th from the top and ${b}th from the bottom in a class. How many students are there?`, t + b - 1, `Total = top + bottom − 1 = ${t} + ${b} − 1 = ${t + b - 1} (${n} is counted twice).`, { step: 1, extra: [t + b] });
      },
    ],
    Medium: [
      (r) => {
        const total = r.int(20, 60), left = r.int(3, total - 2), n = names(r, 1)[0];
        return num(r, `In a row of ${total} people, ${n} is ${left}th from the left. What is ${n}'s position from the right?`, total - left + 1, `From the right = total − left + 1 = ${total} − ${left} + 1 = ${total - left + 1}.`, { step: 1, extra: [total - left] });
      },
    ],
    Hard: [
      (r) => {
        const total = r.int(30, 60), a = r.int(5, 12), bRight = r.int(5, 12), bLeft = total - bRight + 1, [x, y] = names(r, 2);
        return num(r, `In a row of ${total}, ${x} is ${a}th from the left and ${y} is ${bRight}th from the right. How many people sit between them?`, bLeft - a - 1, `${y} is ${bLeft}th from the left. Between positions ${a} and ${bLeft}: ${bLeft} − ${a} − 1 = ${bLeft - a - 1}.`, { step: 1, min: 0 });
      },
    ],
  },
  "clocks-calendars": {
    Easy: [
      (r) => {
        const d = r.int(0, 6), n = r.int(10, 100);
        return choice(`Today is ${DAYS[d]}. What day will it be after ${n} days?`, DAYS[(d + n) % 7], DAYS.filter((x) => x !== DAYS[(d + n) % 7]).slice(0, 3), `${n} mod 7 = ${n % 7}, so move ${n % 7} day${n % 7 === 1 ? "" : "s"} forward: ${DAYS[(d + n) % 7]}.`);
      },
    ],
    Medium: [
      (r) => {
        const h = r.int(1, 11), m = r.pick([0, 10, 15, 20, 30, 40, 45, 50]), raw = Math.abs(30 * h - 5.5 * m), ang = Math.min(raw, 360 - raw);
        return num(r, `What is the angle between the hands of a clock at ${h}:${String(m).padStart(2, "0")}?`, ang, `|30H − 5.5M| = |${30 * h} − ${5.5 * m}| = ${raw}°${raw > 180 ? `; the smaller angle is 360 − ${raw} = ${ang}°` : ""}.`, { unit: "°", step: 5, min: 0 });
      },
    ],
    Hard: [
      (r) => {
        const d = r.int(0, 6), leap = r.next() < 0.5, monthIdx = r.pick([2, 3, 4]), monthNames = ["January", "February", "March", "April", "May"];
        const days = [31, leap ? 29 : 28, 31, 30];
        const passed = days.slice(0, monthIdx).reduce((a, b) => a + b, 0);
        return choice(`1 January of a ${leap ? "leap" : "non-leap"} year is a ${DAYS[d]}. What day is 1 ${monthNames[monthIdx]}?`, DAYS[(d + passed) % 7], DAYS.filter((x) => x !== DAYS[(d + passed) % 7]).slice(0, 3), `Days from 1 Jan to 1 ${monthNames[monthIdx]}: ${passed}; ${passed} mod 7 = ${passed % 7}, so ${DAYS[(d + passed) % 7]}.`);
      },
    ],
  },
  "syllogisms": (() => {
    const TERMS = [["cats", "animals", "pets"], ["pens", "books", "bags"], ["roses", "flowers", "plants"], ["doctors", "teachers", "singers"], ["cars", "buses", "trucks"], ["apples", "fruits", "gifts"]];
    const mk = (prem: (a: string, b: string, c: string) => string, ok: (a: string, b: string, c: string) => string, bad: (a: string, b: string, c: string) => string[], why: string) => (r: Rng) => {
      const [a, b, c] = r.pick(TERMS);
      return choice(`Statements: ${prem(a, b, c)} Which conclusion definitely follows?`, ok(a, b, c), bad(a, b, c), why);
    };
    return {
      Easy: [
        mk((a, b, c) => `All ${a} are ${b}. All ${b} are ${c}.`, (a, _b, c) => `All ${a} are ${c}.`, (a, b, c) => [`All ${c} are ${a}.`, `No ${a} are ${c}.`, `All ${b} are ${a}.`], "All A are B and all B are C gives all A are C. The reverse (all C are A) doesn't follow."),
        mk((a, b, c) => `All ${a} are ${b}. No ${b} are ${c}.`, (a, _b, c) => `No ${a} are ${c}.`, (a, b, c) => [`Some ${a} are ${c}.`, `All ${c} are ${a}.`, `All ${b} are ${c}.`], "Every A is inside B, and B shares nothing with C, so no A is C."),
      ],
      Medium: [
        mk((a, b, c) => `Some ${a} are ${b}. All ${b} are ${c}.`, (a, _b, c) => `Some ${a} are ${c}.`, (a, b, c) => [`All ${a} are ${c}.`, `No ${a} are ${c}.`, `All ${c} are ${b}.`], "The A's that are B are also C, so some A are C. 'All A are C' goes too far."),
        mk((a, b, c) => `All ${a} are ${b}. Some ${c} are ${a}.`, (_a, b, c) => `Some ${c} are ${b}.`, (a, b, c) => [`All ${c} are ${b}.`, `No ${c} are ${b}.`, `All ${b} are ${a}.`], "The C's that are A are inside B, so some C are B."),
      ],
      Hard: [
        mk((a, b, c) => `No ${a} are ${b}. All ${c} are ${a}.`, (_a, b, c) => `No ${c} are ${b}.`, (a, b, c) => [`Some ${c} are ${b}.`, `All ${b} are ${c}.`, `All ${a} are ${c}.`], "C sits inside A, and A shares nothing with B, so no C is B."),
        mk((a, b, c) => `Some ${a} are ${b}. Some ${b} are ${c}.`, () => "No definite conclusion follows", (a, _b, c) => [`Some ${a} are ${c}.`, `All ${a} are ${c}.`, `No ${a} are ${c}.`], "Two 'some' statements don't link: the A's that are B might not be the B's that are C."),
      ],
    } as Generator;
  })(),
  "data-sufficiency": (() => {
    const OPTS = ["Statement I alone is sufficient", "Statement II alone is sufficient", "Both statements together are needed", "Neither is sufficient"];
    const q = (text: string, i1: string, i2: string, ans: number, why: string): RawQ => choice(`${text}\nI. ${i1}\nII. ${i2}`, OPTS[ans], OPTS.filter((_, k) => k !== ans), why);
    return {
      Easy: [
        (r) => { const x = r.int(2, 20); return q("What is the value of x?", `2x = ${2 * x}`, `x + y = ${x + r.int(1, 9)}`, 0, `I gives x = ${x}. II has two unknowns.`); },
        (r) => { const a = r.int(10, 40); return q("How old is Ravi?", "Ravi is older than his sister", `Ravi will be ${a + 5} in five years`, 1, `II gives his age: ${a}. I only compares.`); },
      ],
      Medium: [
        (r) => { const x = r.int(5, 20), y = r.int(1, 4); return q("What is the value of x?", `x + y = ${x + y}`, `x − y = ${x - y}`, 2, `Together: adding gives 2x = ${2 * x}, so x = ${x}. Each alone has two unknowns.`); },
        () => q("Is the integer n even?", "n is divisible by 4", "n is a multiple of 3", 0, "I: every multiple of 4 is even. II: multiples of 3 can be odd or even."),
      ],
      Hard: [
        () => q("What is A's age?", "A is twice as old as B", "B is three years younger than C", 3, "Even together there's no actual number for any age."),
        (r) => { const p = r.int(2, 9) * 100; return q("What is the price of a pen?", `5 pens and 3 books cost ₹${p}`, "A book costs twice as much as a pen", 2, "Together: 5p + 3(2p) = 11p gives p. Each alone has two unknowns."); },
      ],
    } as Generator;
  })(),
  "seating-arrangement": {
    Easy: [
      (r) => {
        const ps = names(r, 5);
        const clues = [`${ps[0]} sits at the left end.`, ...ps.slice(1).map((p, i) => `${p} sits immediately right of ${ps[i]}.`)];
        return choice(`Five friends sit in a row facing north. ${r.shuffle(clues).join(" ")} Who sits in the middle?`, ps[2], [ps[0], ps[1], ps[4]], `Start from the left end and follow the 'immediately right of' clues: ${ps.join(", ")}. The middle seat is ${ps[2]}.`);
      },
    ],
    Medium: [
      (r) => {
        const ps = names(r, 5);
        const clues = [`${ps[4]} sits at the right end.`, ...ps.slice(0, 4).map((p, i) => `${p} sits immediately left of ${ps[i + 1]}.`)];
        return choice(`Five people sit in a row facing north. ${r.shuffle(clues).join(" ")} Who sits second from the left?`, ps[1], [ps[0], ps[2], ps[3]], `Build from the right end leftwards: ${ps.join(", ")}. Second from left: ${ps[1]}.`);
      },
    ],
    Hard: [
      (r) => {
        const ps = names(r, 6);
        const clues = [`${ps[0]} sits at one end, on the left.`, ...ps.slice(1).map((p, i) => `${p} sits immediately right of ${ps[i]}.`)];
        const i = r.int(0, 2), j = r.int(i + 2, 5);
        return num(r, `Six people sit in a row facing north. ${r.shuffle(clues).join(" ")} How many people sit between ${ps[i]} and ${ps[j]}?`, j - i - 1, `The order is ${ps.join(", ")}. Between ${ps[i]} and ${ps[j]}: ${ps.slice(i + 1, j).join(", ")}.`, { step: 1, min: 0 });
      },
    ],
  },
  "puzzles": {
    Easy: [
      (r) => {
        const ps = names(r, 4), clues = [`${ps[0]} is taller than ${ps[1]}.`, `${ps[1]} is taller than ${ps[2]}.`, `${ps[2]} is taller than ${ps[3]}.`];
        return choice(`${r.shuffle(clues).join(" ")} Who is the shortest?`, ps[3], ps.slice(0, 3), `Chain: ${ps.join(" > ")}. Shortest: ${ps[3]}.`);
      },
    ],
    Medium: [
      (r) => {
        const ps = names(r, 5), clues = [`${ps[1]} is heavier than ${ps[2]} but lighter than ${ps[0]}.`, `${ps[3]} is lighter than ${ps[2]}.`, `${ps[4]} is the lightest.`];
        return choice(`${r.shuffle(clues).join(" ")} Who is the second heaviest?`, ps[1], [ps[0], ps[2], ps[3]], `Order: ${ps.join(" > ")}. Second heaviest: ${ps[1]}.`);
      },
    ],
    Hard: [
      (r) => {
        const ps = names(r, 5), floors = r.shuffle([1, 2, 3, 4, 5]);
        const by = (f: number) => ps[floors.indexOf(f)];
        const clues = [`${by(5)} lives on the top floor.`, `${by(1)} lives on the ground floor (floor 1).`, `${by(3)} lives directly above ${by(2)}.`, `${by(4)} lives directly below ${by(5)}.`];
        return choice(`Five people live on floors 1 to 5, one per floor. ${r.shuffle(clues).join(" ")} Who lives on floor 2?`, by(2), [by(1), by(3), by(4)], `Floors 5 and 1 are fixed; floor 4 is directly below 5; the pair 'directly above' takes 3 and 2. So floor 2: ${by(2)}.`);
      },
    ],
  },
  "cubes-and-dice": {
    Easy: [
      (r) => {
        const n = r.int(3, 8);
        return num(r, `A ${n} × ${n} × ${n} cube painted on all faces is cut into unit cubes. How many have exactly three painted faces?`, 8, "Only the 8 corner cubes have three painted faces, whatever the size.", { step: 4, min: 0, extra: [12 * (n - 2), 6 * (n - 2) ** 2] });
      },
      (r) => {
        const top = r.int(1, 6);
        return num(r, `A standard die shows ${top} on top. What is on the bottom face?`, 7 - top, `Opposite faces of a standard die add up to 7: 7 − ${top} = ${7 - top}.`, { step: 1, min: 1 });
      },
    ],
    Medium: [
      (r) => {
        const n = r.int(3, 8);
        return num(r, `A ${n} × ${n} × ${n} painted cube is cut into unit cubes. How many have exactly two painted faces?`, 12 * (n - 2), `Edge cubes without corners: 12 × (${n} − 2) = ${12 * (n - 2)}.`, { step: 6, min: 0 });
      },
    ],
    Hard: [
      (r) => {
        const n = r.int(3, 9), k = r.pick([0, 1]);
        return k === 0
          ? num(r, `A ${n} × ${n} × ${n} painted cube is cut into unit cubes. How many have no paint?`, (n - 2) ** 3, `Inner cubes: (${n} − 2)³ = ${(n - 2) ** 3}.`, { step: 4, min: 0 })
          : num(r, `A ${n} × ${n} × ${n} painted cube is cut into unit cubes. How many have exactly one painted face?`, 6 * (n - 2) ** 2, `Face centres: 6 × (${n} − 2)² = ${6 * (n - 2) ** 2}.`, { step: 6, min: 0 });
      },
    ],
  },
  "venn-diagrams": {
    Easy: [
      (r) => {
        const both = r.int(5, 20), a = both + r.int(10, 30), b = both + r.int(10, 30), none = r.int(0, 20), total = a + b - both + none;
        return num(r, `Of ${total} students, ${a} like tea, ${b} like coffee and ${both} like both. How many like neither?`, none, `At least one = ${a} + ${b} − ${both} = ${a + b - both}; neither = ${total} − ${a + b - both} = ${none}.`, { step: 3, min: 0 });
      },
    ],
    Medium: [
      (r) => {
        const both = r.int(5, 20), a = both + r.int(10, 30), b = both + r.int(10, 30);
        return num(r, `${a} people play cricket, ${b} play football and ${both} play both. How many play only cricket?`, a - both, `Only cricket = cricket − both = ${a} − ${both} = ${a - both}.`, { step: 3, min: 0, extra: [a] });
      },
    ],
    Hard: [
      (r) => {
        const all3 = r.int(2, 6), ab = all3 + r.int(2, 8), bc = all3 + r.int(2, 8), ac = all3 + r.int(2, 8), a = ab + ac - all3 + r.int(5, 20), b = ab + bc - all3 + r.int(5, 20), c = ac + bc - all3 + r.int(5, 20);
        const union = a + b + c - ab - bc - ac + all3;
        return num(r, `A = ${a}, B = ${b}, C = ${c}, A∩B = ${ab}, B∩C = ${bc}, A∩C = ${ac} and all three = ${all3}. How many are in at least one set?`, union, `Add the three, subtract the pairs, add back the centre: ${a + b + c} − ${ab + bc + ac} + ${all3} = ${union}.`, { step: 4, extra: [a + b + c - ab - bc - ac] });
      },
    ],
  },
  "inequalities": {
    Easy: [
      (r) => {
        let c = chain(r);
        for (let i = 0; i < 5 && c.rel === "No definite relation"; i++) c = chain(r);
        const [p, , , s] = c.letters;
        const opts = [`${p} > ${s}`, `${p} < ${s}`, `${p} = ${s}`, `${p} ≥ ${s}`, `${p} ≤ ${s}`, "No definite relation"];
        return choice(`Statement: ${c.text}. What is the relation between ${p} and ${s}?`, c.rel, uniq(opts, c.rel), `Follow the signs from ${p} to ${s}: ${c.rel === "No definite relation" ? "they point in opposite directions" : "they all point the same way"}, so ${c.rel}.`);
      },
    ],
    Medium: [
      (r) => {
        const c = chain(r), [p, , , s] = c.letters;
        const opts = [`${p} > ${s}`, `${p} < ${s}`, `${p} = ${s}`, `${p} ≥ ${s}`, `${p} ≤ ${s}`, "No definite relation"];
        return choice(`Statement: ${c.text}. What can you conclude about ${p} and ${s}?`, c.rel, uniq(opts, c.rel), `Same direction throughout gives a definite relation (strict if any sign is strict); opposite directions give no definite relation. Here: ${c.rel}.`);
      },
    ],
    Hard: [
      (r) => {
        const [x, y, z] = r.shuffle(["J", "K", "L", "M", "N"]).slice(0, 3);
        return choice(`Statement: ${x} ≥ ${y} = ${z}. Conclusions: I. ${x} > ${z}   II. ${x} = ${z}`, "Either I or II follows", ["Only I follows", "Only II follows", "Neither follows"], `${x} ≥ ${z}, so exactly one of '>' and '=' must be true: either I or II.`);
      },
    ],
  },
  "input-output": {
    Easy: [
      (r) => {
        const xs = r.shuffle(Array.from({ length: 5 }, () => r.int(10, 99))).filter((v, i, a) => a.indexOf(v) === i);
        while (xs.length < 5) xs.push(r.int(100, 150));
        const min = Math.min(...xs), step1 = [min, ...xs.filter((x) => x !== min)];
        return choice(`Input: ${xs.join(" ")}. In each step the smallest remaining number moves to the left end (after those already moved). What is step 1?`, step1.join(" "), uniq([[...xs].sort((a, b) => a - b).join(" "), [Math.max(...xs), ...xs.filter((x) => x !== Math.max(...xs))].join(" "), [...xs].reverse().join(" "), [xs[1], xs[0], ...xs.slice(2)].join(" ")], step1.join(" ")), `The smallest number, ${min}, moves to the front; the rest keep their order.`);
      },
    ],
    Medium: [
      (r) => {
        const xs = r.shuffle([12, 27, 35, 48, 51, 63, 74, 86, 92].slice(0, 9)).slice(0, 5);
        let cur = [...xs], steps = 0;
        for (let i = 0; i < 5; i++) {
          const rest = cur.slice(i), m = Math.min(...rest);
          const next = [...cur.slice(0, i), m, ...rest.filter((x) => x !== m)];
          if (next.join() !== cur.join()) {
            steps = i + 1;
            cur = next;
          }
        }
        return num(r, `Input: ${xs.join(" ")}. In each step the smallest remaining number moves left, after those already placed. After how many steps is the line final?`, steps, `Do it step by step; the last step that changes the line is step ${steps}. Final: ${cur.join(" ")}.`, { step: 1, min: 0 });
      },
    ],
    Hard: [
      (r) => {
        const xs = r.shuffle([15, 28, 33, 46, 52, 67, 71, 84]).slice(0, 5), out = xs.map((x) => (x % 2 ? x + 1 : x / 2));
        return choice(`A machine changes each number: if odd it adds 1, if even it halves it. Input: ${xs.join(" ")}. What is the output?`, out.join(" "), uniq([xs.map((x) => (x % 2 ? x - 1 : x / 2)).join(" "), xs.map((x) => (x % 2 ? x + 1 : x * 2)).join(" "), [...out].reverse().join(" "), xs.map((x) => x + 1).join(" ")], out.join(" ")), `Apply the rule to each number in place: ${xs.map((x, i) => `${x} → ${out[i]}`).join(", ")}.`);
      },
    ],
  },

  // ── New topics ──
  "artificial-language": {
    Easy: [
      (r) => {
        const codes = r.shuffle(["pa", "ki", "lo", "mu", "te", "zi", "ra", "nu", "fo"]).slice(0, 5);
        const words = r.shuffle(["red", "big", "ball", "game", "fast", "car", "new", "book"]).slice(0, 5);
        // s1: w0 w1 w2 ; s2: w2 w3 ; → w2's code is the common one
        const s1 = r.shuffle([codes[0], codes[1], codes[2]]).join(" "), s2 = r.shuffle([codes[2], codes[3]]).join(" ");
        return choice(`In a code language, '${s1}' means '${words[0]} ${words[1]} ${words[2]}' and '${s2}' means '${words[2]} ${words[3]}'. What is the code for '${words[2]}'?`, codes[2], [codes[0], codes[1], codes[3]], `'${words[2]}' is the only word in both sentences, and '${codes[2]}' is the only code in both.`);
      },
    ],
    Medium: [
      (r) => {
        const codes = r.shuffle(["pa", "ki", "lo", "mu", "te", "zi", "ra", "nu"]).slice(0, 5);
        const words = r.shuffle(["sky", "is", "blue", "sea", "deep", "very", "wide"]).slice(0, 5);
        const s1 = r.shuffle([codes[0], codes[1], codes[2]]).join(" "), s2 = r.shuffle([codes[2], codes[3], codes[1]]).join(" "), s3 = r.shuffle([codes[3], codes[4]]).join(" ");
        return choice(`'${s1}' means '${words[0]} ${words[1]} ${words[2]}', '${s2}' means '${words[2]} ${words[3]} ${words[1]}', and '${s3}' means '${words[3]} ${words[4]}'. What is the code for '${words[0]}'?`, codes[0], [codes[1], codes[2], codes[3]], `The first two sentences share ${words[1]} and ${words[2]} (codes ${codes[1]} and ${codes[2]}); the third gives ${words[3]} = ${codes[3]}. The remaining code in sentence 1, ${codes[0]}, is '${words[0]}'.`);
      },
    ],
  },
  "arithmetic-reasoning": {
    Easy: [
      (r) => {
        const h = r.int(10, 40), cows = r.int(2, h - 2), legs = 2 * (h - cows) + 4 * cows;
        return num(r, `A farm has hens and cows: ${h} heads and ${legs} legs in all. How many cows are there?`, cows, `If all were hens there'd be ${2 * h} legs. The extra ${legs - 2 * h} legs come 2 per cow: ${cows} cows.`, { step: 2, min: 0 });
      },
    ],
    Medium: [
      (r) => {
        const n = r.int(4, 12), gap = r.pick([2, 3, 4, 5]);
        return num(r, `Trees are planted ${gap} m apart along a ${(n - 1) * gap} m road, with one at each end. How many trees are there?`, n, `Gaps = ${(n - 1) * gap} / ${gap} = ${n - 1}; trees = gaps + 1 = ${n}.`, { step: 1, min: 1, extra: [n - 1] });
      },
    ],
    Hard: [
      (r) => {
        const total = r.int(10, 30) * 10, x = r.int(2, 5), y = r.int(2, 5);
        const each = total / (x + y);
        return Number.isInteger(each)
          ? num(r, `₹${total} is shared so that A gets ${x} parts and B gets ${y} parts. How much does B get?`, y * each, `${x + y} parts = ₹${total}; one part = ₹${each}; B gets ${y} × ${each} = ₹${y * each}.`, { prefix: "₹" })
          : num(r, `A clock strikes once at 1, twice at 2, and so on up to 12 times at 12. How many strikes in 12 hours?`, 78, `1 + 2 + … + 12 = 12 × 13 / 2 = 78.`, { step: 6 });
      },
    ],
  },
  "mathematical-operations": {
    Easy: [
      (r) => {
        const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9);
        return num(r, `If + means × and × means +, find ${a} + ${b} × ${c}.`, a * b + c, `Substitute: ${a} × ${b} + ${c} = ${a * b} + ${c} = ${a * b + c} (multiply first).`, { extra: [a + b * c, (a + b) * c] });
      },
    ],
    Medium: [
      (r) => {
        const b = r.int(2, 6), a = b * r.int(2, 9), c = r.int(2, 9), d = r.int(1, 9);
        return num(r, `If − means ÷, ÷ means +, + means × and × means −, find ${a} − ${b} + ${c} ÷ ${d}.`, (a / b) * c + d, `Substitute: ${a} ÷ ${b} × ${c} + ${d} = ${a / b} × ${c} + ${d} = ${(a / b) * c + d}.`, { extra: [a - b + c + d] });
      },
    ],
    Hard: [
      (r) => {
        const x = r.int(2, 9), y = r.int(2, 9);
        return num(r, `If a ★ b = a² − b, find (${x} ★ ${y}) ★ 3.`, (x * x - y) ** 2 - 3, `${x} ★ ${y} = ${x * x} − ${y} = ${x * x - y}; then ${x * x - y} ★ 3 = ${(x * x - y) ** 2} − 3 = ${(x * x - y) ** 2 - 3}.`, { extra: [x * x - y - 3] });
      },
    ],
  },
};

