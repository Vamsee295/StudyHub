// Generated practice for the Data Interpretation course. Every question builds its own table or chart
// from random values and computes the answer from them.
import { fmt, frac, num, type DataSpec, type Generator, type RawQ, type Rng } from "./core";

const YEARS = ["2019", "2020", "2021", "2022", "2023", "2024"];
const COMPANIES = ["P", "Q", "R", "S", "T"];
const r2 = (x: number) => Math.round(x * 100) / 100;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const vals = (r: Rng, n: number, lo: number, hi: number, step = 5) => Array.from({ length: n }, () => step * r.int(Math.ceil(lo / step), Math.floor(hi / step)));
const ratio = (a: number, b: number) => frac(a, b).includes("/") ? frac(a, b).replace("/", " : ") : `${frac(a, b)} : 1`;
const pick2 = (r: Rng, n: number) => {
  const a = r.int(0, n - 1);
  let b = r.int(0, n - 2);
  if (b >= a) b++;
  return [a, b];
};
/** A question whose answer is one of a list of names (years, companies…). */
const nameQ = (r: Rng, q: string, data: DataSpec, correct: string, pool: string[], e: string): RawQ => ({ q, data, correct, wrong: r.shuffle(pool.filter((x) => x !== correct)).slice(0, 3), explanation: e });
const pctStr = (x: number) => `${fmt(r2(x))}%`;
const pctQ = (r: Rng, q: string, data: DataSpec, p: number, e: string, extra: number[] = []): RawQ =>
  ({ ...num(r, q, r2(p), e, { step: Math.max(1, Math.round(Math.abs(p) * 0.15)), unit: "%", extra: extra.map(r2) }), data });

// ── Tables ──
function prodTable(r: Rng) {
  const years = YEARS.slice(0, 4);
  const rows = COMPANIES.map((c) => [c, ...vals(r, 4, 20, 95)] as [string, ...number[]]);
  const data: DataSpec = { kind: "table", title: "Cars produced (in thousands) by five companies", headers: ["Company", ...years], rows };
  const row = (i: number) => rows[i].slice(1) as number[];
  return { data, years, row, rows };
}
const tables: Generator = {
  Easy: [
    (r) => {
      const t = prodTable(r), i = r.int(0, 4);
      return { ...num(r, `What is the total production of company ${COMPANIES[i]} over the four years?`, sum(t.row(i)), `${t.row(i).join(" + ")} = ${sum(t.row(i))} thousand.`, { unit: " thousand" }), data: t.data };
    },
    (r) => {
      const t = prodTable(r), y = r.int(0, 3);
      const col = t.rows.map((x) => x[y + 1] as number);
      return { ...num(r, `How many cars (in thousands) did all five companies produce in ${t.years[y]}?`, sum(col), `Add the ${t.years[y]} column: ${col.join(" + ")} = ${sum(col)}.`, { unit: " thousand" }), data: t.data };
    },
  ],
  Medium: [
    (r) => {
      const t = prodTable(r), i = r.int(0, 4);
      return { ...num(r, `What is the average yearly production of company ${COMPANIES[i]}?`, r2(sum(t.row(i)) / 4), `Average = ${sum(t.row(i))} / 4 = ${fmt(r2(sum(t.row(i)) / 4))} thousand.`, { unit: " thousand", step: 3 }), data: t.data };
    },
    (r) => {
      const t = prodTable(r), i = r.int(0, 4), [a, b] = [r.int(0, 2), 3];
      const [x, y] = [t.row(i)[a], t.row(i)[b]];
      return pctQ(r, `By what percent did company ${COMPANIES[i]}'s production change from ${t.years[a]} to ${t.years[b]}? (negative means a fall)`, t.data, ((y - x) / x) * 100,
        `Change = (${y} − ${x}) / ${x} × 100 = ${pctStr(((y - x) / x) * 100)}. Always divide by the earlier year.`, [((y - x) / y) * 100]);
    },
  ],
  Hard: [
    (r) => {
      const t = prodTable(r), [i, j] = pick2(r, 5);
      const [a, b] = [sum(t.row(i)), sum(t.row(j))];
      return { q: `What is the ratio of the total production of ${COMPANIES[i]} to that of ${COMPANIES[j]}?`, data: t.data, correct: ratio(a, b), wrong: [ratio(b, a), ratio(a + 5, b), ratio(a, b + 5)],
        explanation: `Totals: ${COMPANIES[i]} = ${a}, ${COMPANIES[j]} = ${b}. ${a} : ${b} simplifies to ${ratio(a, b)}.` };
    },
    (r) => {
      const t = prodTable(r);
      const totals = COMPANIES.map((_, i) => sum(t.row(i)));
      const best = totals.indexOf(Math.max(...totals));
      if (totals.filter((x) => x === totals[best]).length > 1) return { q: "", correct: "", wrong: [], explanation: "" }; // tie: skipped
      return nameQ(r, "Which company produced the most cars over the four years?", t.data, COMPANIES[best], COMPANIES,
        `Totals: ${COMPANIES.map((c, i) => `${c} ${totals[i]}`).join(", ")}. The highest is ${COMPANIES[best]}.`);
    },
  ],
};

function twoProducts(r: Rng) {
  const a = vals(r, 6, 30, 120), b = vals(r, 6, 30, 120);
  const data: DataSpec = { kind: "table", title: "Units sold (in hundreds) of two products", headers: ["Year", "Product A", "Product B"], rows: YEARS.map((y, i) => [y, a[i], b[i]]) };
  return { a, b, data };
}
const compare: Generator = {
  Easy: [
    (r) => {
      const { a, b, data } = twoProducts(r);
      const d = a.map((x, i) => Math.abs(x - b[i])), best = d.indexOf(Math.max(...d));
      if (d.filter((x) => x === d[best]).length > 1) return { q: "", correct: "", wrong: [], explanation: "" };
      return nameQ(r, "In which year was the difference between the sales of A and B the largest?", data, YEARS[best], YEARS, `Differences by year: ${d.join(", ")}. The largest is ${d[best]} in ${YEARS[best]}.`);
    },
    (r) => {
      const { a, data } = twoProducts(r);
      return { ...num(r, "What were the total sales of product A over the six years (in hundreds)?", sum(a), `${a.join(" + ")} = ${sum(a)}.`), data };
    },
  ],
  Medium: [
    (r) => {
      const { a, b, data } = twoProducts(r), y = r.int(0, 5);
      if (a[y] === b[y]) return { q: "", correct: "", wrong: [], explanation: "" };
      const [hi, lo, hn, ln] = b[y] > a[y] ? [b[y], a[y], "B", "A"] : [a[y], b[y], "A", "B"];
      return pctQ(r, `In ${YEARS[y]}, by what percent were the sales of ${hn} more than those of ${ln}?`, data, ((hi - lo) / lo) * 100,
        `(${hi} − ${lo}) / ${lo} × 100 = ${pctStr(((hi - lo) / lo) * 100)}. "More than ${ln}" means divide by ${ln}.`, [((hi - lo) / hi) * 100]);
    },
    (r) => {
      const { a, data } = twoProducts(r);
      const avg = sum(a) / 6, c = a.filter((x) => x > avg).length;
      return { ...num(r, "In how many years were the sales of A above A's six-year average?", c, `Average = ${sum(a)} / 6 = ${fmt(r2(avg))}. Years above it: ${c}.`, { min: 0, step: 1 }), data };
    },
  ],
  Hard: [
    (r) => {
      const { a, data } = twoProducts(r);
      const g = a.slice(1).map((x, i) => ((x - a[i]) / a[i]) * 100), best = g.indexOf(Math.max(...g));
      if (g.filter((x) => x === g[best]).length > 1) return { q: "", correct: "", wrong: [], explanation: "" };
      return nameQ(r, "In which year did product A show the highest percentage growth over the previous year?", data, YEARS[best + 1], YEARS.slice(1),
        `Growth by year: ${g.map((x, i) => `${YEARS[i + 1]} ${pctStr(x)}`).join(", ")}. Highest: ${YEARS[best + 1]}. The biggest jump in units is not always the biggest percentage.`);
    },
    (r) => {
      const { a, b, data } = twoProducts(r);
      return { q: "What is the ratio of total sales of A to total sales of B over the six years?", data, correct: ratio(sum(a), sum(b)), wrong: [ratio(sum(b), sum(a)), ratio(sum(a) + 5, sum(b)), ratio(sum(a), sum(b) + 10)],
        explanation: `Totals: A = ${sum(a)}, B = ${sum(b)}. ${sum(a)} : ${sum(b)} = ${ratio(sum(a), sum(b))}.` };
    },
  ],
};

// ── Bar graphs ──
function branches(r: Rng) {
  const labels = YEARS.slice(0, 5);
  const x = vals(r, 5, 20, 100), y = vals(r, 5, 20, 100);
  const data: DataSpec = { kind: "bar", title: "Sales of two branches (₹ lakh)", labels, series: [{ name: "Branch X", values: x }, { name: "Branch Y", values: y }], unit: "₹ lakh" };
  return { labels, x, y, data };
}
const bars: Generator = {
  Easy: [
    (r) => {
      const b = branches(r);
      return { ...num(r, "What were Branch X's total sales over the five years?", sum(b.x), `${b.x.join(" + ")} = ₹${sum(b.x)} lakh.`, { prefix: "₹", unit: " lakh" }), data: b.data };
    },
    (r) => {
      const b = branches(r), i = r.int(0, 4);
      return { ...num(r, `What is the difference between the sales of the two branches in ${b.labels[i]}?`, Math.abs(b.x[i] - b.y[i]), `|${b.x[i]} − ${b.y[i]}| = ₹${Math.abs(b.x[i] - b.y[i])} lakh.`, { prefix: "₹", unit: " lakh", min: 0, extra: [b.x[i] + b.y[i]] }), data: b.data };
    },
  ],
  Medium: [
    (r) => {
      const b = branches(r), [i, j] = [r.int(0, 2), r.int(3, 4)];
      return pctQ(r, `By what percent did Branch Y's sales change from ${b.labels[i]} to ${b.labels[j]}? (negative means a fall)`, b.data, ((b.y[j] - b.y[i]) / b.y[i]) * 100,
        `(${b.y[j]} − ${b.y[i]}) / ${b.y[i]} × 100 = ${pctStr(((b.y[j] - b.y[i]) / b.y[i]) * 100)}.`, [((b.y[j] - b.y[i]) / b.y[j]) * 100]);
    },
    (r) => {
      const b = branches(r);
      return { ...num(r, "What were Branch Y's average yearly sales?", r2(sum(b.y) / 5), `${sum(b.y)} / 5 = ₹${fmt(r2(sum(b.y) / 5))} lakh.`, { prefix: "₹", unit: " lakh", step: 3 }), data: b.data };
    },
  ],
  Hard: [
    (r) => {
      const b = branches(r);
      const c = b.x.filter((v, i) => v > b.y[i]).length;
      return { ...num(r, "In how many years did Branch X sell more than Branch Y?", c, `Compare year by year: X is ahead in ${c} of the 5 years.`, { min: 0, step: 1 }), data: b.data };
    },
    (r) => {
      const b = branches(r), [i, j] = pick2(r, 5);
      const [p, q] = [b.x[i] + b.y[i], b.x[j] + b.y[j]];
      return { q: `What is the ratio of the combined sales in ${b.labels[i]} to the combined sales in ${b.labels[j]}?`, data: b.data, correct: ratio(p, q), wrong: [ratio(q, p), ratio(b.x[i], b.x[j]), ratio(p + 5, q)],
        explanation: `${b.labels[i]}: ${b.x[i]} + ${b.y[i]} = ${p}. ${b.labels[j]}: ${b.x[j]} + ${b.y[j]} = ${q}. Ratio ${ratio(p, q)}.` };
    },
  ],
};

// ── Line graphs ──
function enrol(r: Rng) {
  const a = vals(r, 6, 10, 60), b = vals(r, 6, 10, 60);
  const data: DataSpec = { kind: "line", title: "Students enrolled (in hundreds) at two colleges", labels: YEARS, series: [{ name: "College A", values: a }, { name: "College B", values: b }] };
  return { a, b, data };
}
const lines: Generator = {
  Easy: [
    (r) => {
      const { a, data } = enrol(r);
      const inc = a.slice(1).map((x, i) => x - a[i]), best = inc.indexOf(Math.max(...inc));
      if (inc[best] <= 0 || inc.filter((x) => x === inc[best]).length > 1) return { q: "", correct: "", wrong: [], explanation: "" };
      const pairs = YEARS.slice(1).map((y, i) => `${YEARS[i]} to ${y}`);
      return nameQ(r, "Between which two consecutive years did College A's enrolment rise the most?", data, pairs[best], pairs, `Year-on-year changes: ${inc.join(", ")}. The largest rise is ${inc[best]} (${pairs[best]}).`);
    },
    (r) => {
      const { b, data } = enrol(r);
      return { ...num(r, "What is College B's total enrolment over the six years (in hundreds)?", sum(b), `${b.join(" + ")} = ${sum(b)}.`), data };
    },
  ],
  Medium: [
    (r) => {
      const { a, data } = enrol(r);
      return pctQ(r, "By what percent did College A's enrolment change from 2019 to 2024? (negative means a fall)", data, ((a[5] - a[0]) / a[0]) * 100,
        `(${a[5]} − ${a[0]}) / ${a[0]} × 100 = ${pctStr(((a[5] - a[0]) / a[0]) * 100)}.`, [((a[5] - a[0]) / a[5]) * 100]);
    },
    (r) => {
      const { a, b, data } = enrol(r);
      const avg = (sum(a) + sum(b)) / 12;
      return { ...num(r, "What is the average yearly enrolment per college across both colleges (in hundreds)?", r2(avg), `(${sum(a)} + ${sum(b)}) / 12 = ${fmt(r2(avg))}.`, { step: 2 }), data };
    },
  ],
  Hard: [
    (r) => {
      const { a, b, data } = enrol(r);
      const gap = a.map((x, i) => Math.abs(x - b[i])), best = gap.indexOf(Math.max(...gap));
      if (gap.filter((x) => x === gap[best]).length > 1) return { q: "", correct: "", wrong: [], explanation: "" };
      return nameQ(r, "In which year was the gap between the two colleges the widest?", data, YEARS[best], YEARS, `Gaps by year: ${gap.join(", ")}. The widest is ${gap[best]} in ${YEARS[best]}.`);
    },
    (r) => {
      const { a, b, data } = enrol(r);
      return pctQ(r, "College A's total enrolment is what percent of College B's total?", data, (sum(a) / sum(b)) * 100, `${sum(a)} / ${sum(b)} × 100 = ${pctStr((sum(a) / sum(b)) * 100)}.`, [(sum(b) / sum(a)) * 100]);
    },
  ],
};

// ── Pie charts ──
const CATS = ["Food", "Rent", "Education", "Transport", "Savings", "Others"];
function budget(r: Rng) {
  const p = CATS.map(() => 5);
  for (let left = 70; left > 0; left -= 5) p[r.int(0, 5)] += 5;
  const income = 1000 * r.int(40, 120);
  const data: DataSpec = { kind: "pie", title: "A family's monthly spending", labels: CATS, values: p, note: `Monthly income: ₹${fmt(income)}` };
  return { p, income, data };
}
const pies: Generator = {
  Easy: [
    (r) => {
      const { p, income, data } = budget(r), i = r.int(0, 5);
      return { ...num(r, `How much does the family spend on ${CATS[i]} each month?`, (income * p[i]) / 100, `${p[i]}% of ₹${fmt(income)} = ₹${fmt((income * p[i]) / 100)}.`, { prefix: "₹" }), data };
    },
    (r) => {
      const { p, data } = budget(r), i = r.int(0, 5);
      return { ...num(r, `What is the central angle of the ${CATS[i]} slice?`, r2(p[i] * 3.6), `The full circle is 360°, so ${p[i]}% × 3.6 = ${fmt(r2(p[i] * 3.6))}°.`, { unit: "°", step: 18, min: 1 }), data };
    },
  ],
  Medium: [
    (r) => {
      const { p, income, data } = budget(r), [i, j] = pick2(r, 6);
      const d = (Math.abs(p[i] - p[j]) * income) / 100;
      if (!d) return { q: "", correct: "", wrong: [], explanation: "" };
      return { ...num(r, `How much more is spent on the larger of ${CATS[i]} and ${CATS[j]} than on the smaller?`, d, `The gap is ${Math.abs(p[i] - p[j])}% of ₹${fmt(income)} = ₹${fmt(d)}.`, { prefix: "₹" }), data };
    },
    (r) => {
      const { p, data } = budget(r), [i, j] = pick2(r, 6);
      return { q: `What is the ratio of spending on ${CATS[i]} to spending on ${CATS[j]}?`, data, correct: ratio(p[i], p[j]), wrong: [ratio(p[j], p[i]), ratio(p[i] + 5, p[j]), ratio(p[i], p[j] + 5)],
        explanation: `Only the percentages matter: ${p[i]} : ${p[j]} = ${ratio(p[i], p[j])}.` };
    },
  ],
  Hard: [
    (r) => {
      const { p, income, data } = budget(r), i = r.int(0, 5), g = r.pick([10, 20, 25, 50]);
      const v = (income * (1 + g / 100) * p[i]) / 100;
      return { ...num(r, `If income rises by ${g}% and the shares stay the same, how much will go to ${CATS[i]}?`, v, `New income = ₹${fmt(income * (1 + g / 100))}. ${p[i]}% of it = ₹${fmt(v)}.`, { prefix: "₹", extra: [(income * p[i]) / 100] }), data };
    },
    (r) => {
      const { p, data } = budget(r), [i, j] = pick2(r, 6);
      if (p[i] <= p[j]) return { q: "", correct: "", wrong: [], explanation: "" };
      return pctQ(r, `Spending on ${CATS[i]} is what percent more than spending on ${CATS[j]}?`, data, ((p[i] - p[j]) / p[j]) * 100,
        `(${p[i]} − ${p[j]}) / ${p[j]} × 100 = ${pctStr(((p[i] - p[j]) / p[j]) * 100)}. The base is ${CATS[j]}.`, [p[i] - p[j], ((p[i] - p[j]) / p[i]) * 100]);
    },
  ],
};

// ── Mixed graphs: share of students per department plus each department's boys : girls ratio ──
const DEPTS = ["Arts", "Science", "Commerce", "Law", "Medicine"];
const SPLITS: [number, number][] = [[1, 1], [2, 3], [3, 2], [1, 4], [4, 1], [3, 7], [7, 3], [9, 1]];
function college(r: Rng) {
  const p = DEPTS.map(() => 10);
  for (let left = 50; left > 0; left -= 5) p[r.int(0, 4)] += 5;
  const total = 1000 * r.int(2, 8);
  const split = DEPTS.map(() => r.pick(SPLITS));
  const count = p.map((x) => (total * x) / 100);
  const girls = count.map((c, i) => (c * split[i][1]) / (split[i][0] + split[i][1]));
  const data: DataSpec = { kind: "table", title: `Students by department (total ${fmt(total)})`, headers: ["Department", "Share of students", "Boys : Girls"], rows: DEPTS.map((d, i) => [d, `${p[i]}%`, `${split[i][0]} : ${split[i][1]}`]) };
  return { p, total, count, girls, boys: count.map((c, i) => c - girls[i]), data };
}
const mixed: Generator = {
  Easy: [
    (r) => {
      const c = college(r), i = r.int(0, 4);
      return { ...num(r, `How many students are in ${DEPTS[i]}?`, c.count[i], `${c.p[i]}% of ${fmt(c.total)} = ${fmt(c.count[i])}.`), data: c.data };
    },
  ],
  Medium: [
    (r) => {
      const c = college(r), i = r.int(0, 4);
      return { ...num(r, `How many girls study ${DEPTS[i]}?`, c.girls[i], `${DEPTS[i]} has ${fmt(c.count[i])} students; girls are their share of the ratio: ${fmt(c.girls[i])}.`, { extra: [c.boys[i]] }), data: c.data };
    },
    (r) => {
      const c = college(r), [i, j] = pick2(r, 5);
      return { ...num(r, `How many boys are there in ${DEPTS[i]} and ${DEPTS[j]} together?`, c.boys[i] + c.boys[j], `Boys: ${DEPTS[i]} ${fmt(c.boys[i])} + ${DEPTS[j]} ${fmt(c.boys[j])} = ${fmt(c.boys[i] + c.boys[j])}.`, { extra: [c.girls[i] + c.girls[j]] }), data: c.data };
    },
  ],
  Hard: [
    (r) => {
      const c = college(r), [i, j] = pick2(r, 5);
      return { q: `What is the ratio of girls in ${DEPTS[i]} to boys in ${DEPTS[j]}?`, data: c.data, correct: ratio(c.girls[i], c.boys[j]), wrong: [ratio(c.boys[j], c.girls[i]), ratio(c.boys[i], c.girls[j]), ratio(c.girls[i] + 50, c.boys[j])],
        explanation: `Girls in ${DEPTS[i]} = ${fmt(c.girls[i])}; boys in ${DEPTS[j]} = ${fmt(c.boys[j])}. Ratio ${ratio(c.girls[i], c.boys[j])}.` };
    },
    (r) => {
      const c = college(r), g = sum(c.girls);
      return pctQ(r, "What percent of all students are girls?", c.data, (g / c.total) * 100, `Total girls = ${c.girls.map(fmt).join(" + ")} = ${fmt(g)}. ${fmt(g)} / ${fmt(c.total)} × 100 = ${pctStr((g / c.total) * 100)}.`);
    },
  ],
};

// ── Caselets: data given as a paragraph ──
function school(r: Rng) {
  const n = 100 * r.int(8, 30), sci = r.pick([40, 45, 55, 60, 65]), sg = r.pick([20, 25, 40, 50]);
  const science = (n * sci) / 100, commerce = n - science, sGirls = (science * sg) / 100, cGirls = 10 * r.int(Math.ceil(commerce / 50), Math.floor(commerce / 15));
  const text = `A college has ${fmt(n)} students. ${sci}% study Science and the rest study Commerce. ${sg}% of the Science students are girls. Commerce has ${fmt(cGirls)} girls.`;
  return { n, science, commerce, sGirls, cGirls, text };
}
function shop(r: Rng) {
  const mon = 10 * r.int(5, 15), d = 5 * r.int(1, 4), price = 10 * r.int(5, 30);
  const days = [0, 1, 2, 3, 4].map((k) => mon + k * d);
  const text = `A shop sold ${mon} pens on Monday. Each day from Tuesday to Friday it sold ${d} more pens than the day before. Every pen costs ₹${price}.`;
  return { days, price, d, text };
}
const caselet: Generator = {
  Easy: [
    (r) => {
      const s = school(r);
      return num(r, `${s.text}\n\nHow many Science students are boys?`, s.science - s.sGirls, `Science = ${fmt(s.science)}; girls = ${fmt(s.sGirls)}; boys = ${fmt(s.science - s.sGirls)}.`, { extra: [s.sGirls] });
    },
    (r) => {
      const s = shop(r);
      return num(r, `${s.text}\n\nHow many pens were sold on Friday?`, s.days[4], `Friday is 4 days after Monday: ${s.days[0]} + 4 × ${s.d} = ${s.days[4]}.`, { extra: [s.days[3]] });
    },
  ],
  Medium: [
    (r) => {
      const s = school(r);
      return num(r, `${s.text}\n\nHow many girls are there in the college?`, s.sGirls + s.cGirls, `Science girls ${fmt(s.sGirls)} + Commerce girls ${fmt(s.cGirls)} = ${fmt(s.sGirls + s.cGirls)}.`);
    },
    (r) => {
      const s = shop(r);
      return num(r, `${s.text}\n\nHow many pens were sold from Monday to Friday?`, sum(s.days), `${s.days.join(" + ")} = ${sum(s.days)}.`, { extra: [s.days[0] * 5] });
    },
  ],
  Hard: [
    (r) => {
      const s = school(r);
      const p = ((s.commerce - s.cGirls) / s.n) * 100;
      return { ...num(r, `${s.text}\n\nWhat percent of all students are Commerce boys?`, r2(p), `Commerce = ${fmt(s.commerce)}; boys = ${fmt(s.commerce - s.cGirls)}; ${fmt(s.commerce - s.cGirls)} / ${fmt(s.n)} × 100 = ${pctStr(p)}.`, { unit: "%", step: 3 }) };
    },
    (r) => {
      const s = shop(r);
      return num(r, `${s.text}\n\nWhat was the shop's revenue from pens on Wednesday and Thursday together?`, (s.days[2] + s.days[3]) * s.price,
        `Wednesday ${s.days[2]} + Thursday ${s.days[3]} = ${s.days[2] + s.days[3]} pens × ₹${s.price} = ₹${fmt((s.days[2] + s.days[3]) * s.price)}.`, { prefix: "₹" });
    },
  ],
};

// ── Data sufficiency ──
const DS = ["Statement I alone is sufficient", "Statement II alone is sufficient", "Both statements together are needed", "Neither statement is sufficient, even together"];
const ds = (q: string, i1: string, i2: string, ans: number, e: string): RawQ => ({ q: `${q}\n\nI. ${i1}\nII. ${i2}`, correct: DS[ans], wrong: DS.filter((_, k) => k !== ans), explanation: e });
const suff: Generator = {
  Easy: [
    (r) => {
      const [k, m] = [r.int(2, 9), r.int(10, 40)];
      return ds("What is A's age?", `A is ${k} years older than B.`, `B is ${m} years old.`, 2, `I alone links A to an unknown B; II alone says nothing about A. Together: A = ${m} + ${k} = ${m + k}.`);
    },
    (r) => {
      const [c, s] = [10 * r.int(20, 60), 10 * r.int(61, 90)];
      return ds("What is the profit percentage on an item?", `It was bought for ₹${c} and sold for ₹${s}.`, `It was sold for ₹${s}.`, 0, `I gives both prices: profit = (${s} − ${c}) / ${c} × 100 = ${fmt(r2(((s - c) * 100) / c))}%. II gives only the selling price.`);
    },
  ],
  Medium: [
    (r) => {
      const [a, n] = [r.int(2, 7), r.int(20, 80)];
      return ds("What is the value of x?", "x is a positive whole number.", `${a}x + 3 = ${a * n + 3}.`, 1, `II alone gives x = ${n}. I only says x is positive, which does not fix it.`);
    },
    (r) => {
      const n = r.int(30, 60);
      return ds("How many girls are in the class?", `The class has ${n} students.`, "There are more boys than girls.", 3, "Even together we only know the girls are fewer than half of the class, not the exact number.");
    },
  ],
  Hard: [
    (r) => {
      const [s, g] = [10 * r.int(20, 90), r.pick([5, 10, 20, 25])];
      return ds("What were the company's sales in 2024?", `Sales in 2023 were ₹${s} crore.`, `Sales grew by ${g}% from 2023 to 2024.`, 2, `Together: ${s} × ${1 + g / 100} = ₹${fmt(r2(s * (1 + g / 100)))} crore. Neither alone is enough.`);
    },
    (r) => {
      const [t, p] = [r.int(40, 90), r.pick([20, 25, 40, 50])];
      return ds(`In a test of ${t} questions, how many did Ravi answer correctly?`, `Ravi answered ${p}% of the questions wrongly and attempted all of them.`, "Ravi scored more than his friend.", 0,
        `I alone: correct = ${100 - p}% of ${t} = ${fmt(r2((t * (100 - p)) / 100))}. II is about a comparison, not a count.`);
    },
    (r) => {
      const [l, w] = [r.int(5, 20), r.int(3, 12)];
      return ds("What is the area of the rectangle?", `Its perimeter is ${2 * (l + w)} m.`, `Its length is ${l} m.`, 2, `From I, length + breadth = ${l + w}; with II, breadth = ${w}. Area = ${l} × ${w} = ${l * w} m².`);
    },
  ],
};

export const diGenerators: Record<string, Generator> = {
  "reading-tables": tables,
  "data-comparison": compare,
  "bar-graphs": bars,
  "line-graphs": lines,
  "pie-charts": pies,
  "mixed-graphs": mixed,
  "caselet-di": caselet,
  "di-data-sufficiency": suff,
};
