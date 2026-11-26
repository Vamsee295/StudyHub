import { Analogy, Figure, Formula, Step, Terms, Worked, svgMute, svgText, type LabContent } from "@/components/labs/LabTheory";

/** One loop = n boxes; a loop inside a loop = an n × n grid. */
function LoopsDiagram() {
  const n = 6;
  const s = 26;
  return (
    <svg viewBox="0 0 560 230" className="h-auto w-full min-w-[480px]" role="img" aria-label="A single loop over 6 items takes 6 steps; a loop inside a loop takes 36 steps">
      <text x="0" y="16" fontSize="12" style={svgText}>One loop: for each item</text>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x={i * (s + 4)} y={30} width={s} height={s} rx="5" fill="var(--note)" fillOpacity="0.25" stroke="var(--note)" strokeWidth="1.5" />
          <text x={i * (s + 4) + s / 2} y={48} fontSize="11" textAnchor="middle" style={svgText}>{i + 1}</text>
        </g>
      ))}
      <text x="0" y="82" fontSize="11" style={svgMute}>n = 6 items → 6 steps → O(n)</text>

      <text x="300" y="16" fontSize="12" style={svgText}>Loop inside a loop: every pair</text>
      {Array.from({ length: n * n }, (_, k) => {
        const r = Math.floor(k / n);
        const c = k % n;
        return <rect key={k} x={300 + c * s} y={30 + r * s} width={s - 3} height={s - 3} rx="4" fill="var(--accent)" fillOpacity="0.22" stroke="var(--accent)" strokeWidth="1.2" />;
      })}
      <text x="300" y="206" fontSize="11" style={svgMute}>n = 6 → 6 × 6 = 36 steps → O(n²)</text>
    </svg>
  );
}

/** Binary search throws away half the list each step: 16 → 8 → 4 → 2 → 1. */
function HalvingDiagram() {
  const rows = [16, 8, 4, 2, 1];
  const cell = 24;
  return (
    <svg viewBox="0 0 560 200" className="h-auto w-full min-w-[480px]" role="img" aria-label="Halving 16 items four times leaves one: binary search takes about log2 of n steps">
      {rows.map((count, r) => (
        <g key={r}>
          <text x="0" y={r * 38 + 20} fontSize="11" style={svgMute}>{r === 0 ? "start" : `step ${r}`}</text>
          {Array.from({ length: 16 }, (_, i) => {
            const alive = i < count;
            return (
              <rect
                key={i}
                x={70 + i * (cell + 2)}
                y={r * 38 + 4}
                width={cell}
                height={24}
                rx="4"
                fill={alive ? "var(--gold)" : "var(--card-2)"}
                fillOpacity={alive ? 0.45 : 1}
                stroke={alive ? "var(--gold)" : "var(--hair)"}
              />
            );
          })}
          <text x={70 + 16 * (cell + 2) + 4} y={r * 38 + 20} fontSize="11" style={svgText}>{count} left</text>
        </g>
      ))}
    </svg>
  );
}

const CLASSES: [string, (n: number) => number][] = [
  ["O(1)", () => 1],
  ["O(log n)", (n) => Math.log2(n)],
  ["O(n)", (n) => n],
  ["O(n log n)", (n) => n * Math.log2(n)],
  ["O(n²)", (n) => n * n],
];
const fmt = (x: number) => Math.round(x).toLocaleString("en-IN");

function GrowthTable() {
  const sizes = [10, 1_000, 1_000_000];
  return (
    <div className="overflow-x-auto rounded-xl border-[1.5px] border-hair bg-card">
      <table className="w-full text-left text-[14px] tabular-nums">
        <caption className="px-4 pt-3 text-left font-mono text-[11px] uppercase tracking-wider text-mute">Steps needed, by input size n</caption>
        <thead>
          <tr className="border-b border-hair text-body">
            <th className="px-4 py-2 font-semibold">Class</th>
            {sizes.map((n) => (
              <th key={n} className="px-4 py-2 font-semibold">n = {fmt(n)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hair">
          {CLASSES.map(([label, f]) => (
            <tr key={label}>
              <td className="px-4 py-2 font-mono font-bold text-ink">{label}</td>
              {sizes.map((n) => (
                <td key={n} className="px-4 py-2 font-mono text-body">{fmt(f(n))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Theory() {
  return (
    <>
      <Step n={1} title="Why we need Big-O">
        <p>
          Two programs can give the same answer while one finishes in a blink and the other takes all night. Timing them with a stopwatch doesn&apos;t
          settle it, because a fast laptop and an old phone give different times for the same code.
        </p>
        <p>
          So instead of measuring seconds, we <strong>count the steps</strong> a program takes and ask one question:{" "}
          <strong>as the input gets bigger, how fast does the number of steps grow?</strong> That growth is what Big-O describes.
        </p>
        <Analogy>
          looking for a friend&apos;s name in a phone book. Reading every page from the start takes longer the thicker the book. Opening it in the
          middle and jumping left or right barely gets slower even when the book doubles in size. Same task, very different growth.
        </Analogy>
      </Step>

      <Step n={2} title="Counting steps">
        <p>
          The input size is called <strong>n</strong>: the number of items in a list, characters in a string, and so on. Look at what the code does
          with them.
        </p>
        <Worked title="adding up a list">
          <pre className="overflow-x-auto rounded-lg bg-paper-2 p-3 font-mono text-[13px] text-ink">{`int sum = 0;
for (int x : nums) {   // runs once per item
    sum += x;
}`}</pre>
          <p>
            With 6 numbers the loop runs 6 times; with 1,000 numbers, 1,000 times. The steps grow in step with n, so this is <strong>O(n)</strong>,
            read &quot;order n&quot; or &quot;linear time&quot;.
          </p>
        </Worked>
        <Worked title="comparing every pair">
          <pre className="overflow-x-auto rounded-lg bg-paper-2 p-3 font-mono text-[13px] text-ink">{`for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)   // runs n times for EACH i
        compare(nums[i], nums[j]);`}</pre>
          <p>
            For each of the n values of i, the inner loop runs n times: n × n steps in total. That is <strong>O(n²)</strong>, &quot;quadratic&quot;.
            Doubling the input makes it four times slower.
          </p>
        </Worked>
        <Figure caption="A single loop does one step per item. A loop inside a loop does one step per pair, so its work grows as a square.">
          <LoopsDiagram />
        </Figure>
      </Step>

      <Step n={3} title="The two simplifying rules">
        <p>Big-O only cares about the shape of the growth when n is large, so we simplify:</p>
        <Terms
          items={[
            ["Drop constants", <>3n steps and n steps grow the same way, so both are O(n). A constant factor only changes the speed, not the shape.</>],
            ["Keep the biggest term", <>n² + 5n + 20 is O(n²). When n is a million, n² is a trillion and 5n is a rounding error.</>],
          ]}
        />
        <Formula>5n² + 3n + 7 → keep 5n² → drop the 5 → O(n²)</Formula>
      </Step>

      <Step n={4} title="The classes you will meet">
        <Terms
          items={[
            ["O(1) constant", "The same work whatever n is. Reading the first item of an array, or looking up a key in a hash map."],
            ["O(log n) logarithmic", "Halves the problem each step. Binary search on a sorted list of a million items needs only about 20 steps."],
            ["O(n) linear", "Touches every item once. Finding the largest number in an unsorted list."],
            ["O(n log n)", "A little more than linear. Good sorting algorithms such as merge sort land here."],
            ["O(n²) quadratic", "Every item against every other. Simple sorts like bubble sort, or checking all pairs."],
            ["O(2ⁿ) exponential", "Doubles with each extra item. Trying every subset of a set: 30 items already means over a billion subsets."],
          ]}
        />
        <Figure caption="Binary search on 16 sorted items: each comparison throws away half of what is left, so 4 steps reach a single item. That is log₂ 16 = 4.">
          <HalvingDiagram />
        </Figure>
        <GrowthTable />
        <p>
          Read the last row of the table: at a million items, an O(n²) algorithm needs a <strong>trillion</strong> steps while O(n log n) needs about
          20 million. That gap is why choosing the right algorithm matters more than a faster computer.
        </p>
      </Step>

      <Step n={5} title="Using Big-O in a coding test">
        <p>
          Coding platforms give a time limit (often 1 to 2 seconds) and the largest n. A common rule of thumb is that a computer does roughly{" "}
          <strong>10⁸ simple operations per second</strong>. Use it to work out which complexity will pass before you write any code:
        </p>
        <Formula>
          n ≤ 20 → O(2ⁿ) is fine · n ≤ 5,000 → O(n²) is fine · n ≤ 10⁶ → you need O(n log n) or O(n)
        </Formula>
        <p>The visualizer below does this arithmetic for you: slide n and see which classes still fit in one second.</p>
      </Step>
    </>
  );
}

export const bigOContent: LabContent = {
  minutes: 8,
  learn: [
    "Explain what Big-O measures and why we count steps instead of seconds",
    "Work out the Big-O of a simple loop and a loop inside a loop",
    "Order the common classes from O(1) to O(2ⁿ) by how fast they grow",
    "Use a problem's limits to decide which complexity will pass",
  ],
  guide: [
    "Drag the n slider to change the input size.",
    "Tap a class to hide or show its line on the chart.",
    "Read the table: it shows the steps and time for each class at your n.",
    "Find the n where O(n²) stops fitting in one second.",
  ],
  check: [
    { q: "What is the Big-O of a loop that runs n times, with another loop inside it that also runs n times?", a: <>O(n²). The inner loop runs n times for each of the n outer passes, so n × n steps.</> },
    { q: "Simplify 4n + 100 to Big-O.", a: <>O(n). Drop the constant 100 and the factor 4; only the shape of the growth matters.</> },
    { q: "Why is binary search O(log n)?", a: <>Each step halves what is left to search, so the number of steps is how many times you can halve n before reaching 1, which is log₂ n.</> },
  ],
  Theory,
};
