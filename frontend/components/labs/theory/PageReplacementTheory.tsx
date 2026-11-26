import { clsx } from "clsx";
import { Analogy, Figure, Step, Terms, Worked, svgMute, svgText, type LabContent } from "@/components/labs/LabTheory";
import { simulatePaging, type PagingAlgorithm } from "@/lib/labs/paging";

// Every table and count below comes from the same simulatePaging() the visualizer uses.
const SMALL = [1, 2, 3, 1, 4, 1, 2];
const BELADY = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];

/** RAM is a small desk next to you; the disk is a big shelf across the room. */
function DeskDiagram() {
  return (
    <svg viewBox="0 0 560 150" className="h-auto w-full min-w-[480px]" role="img" aria-label="RAM holds a few pages in frames and is fast; the disk holds every page and is slow">
      <rect x="10" y="20" width="220" height="120" rx="12" fill="var(--card-2)" stroke="var(--ink)" strokeWidth="2.4" />
      <text x="120" y="44" fontSize="13" textAnchor="middle" style={svgText}>RAM: 3 frames (fast)</text>
      {["A", "C", "F"].map((p, i) => (
        <g key={p}>
          <rect x={28 + i * 66} y={60} width={56} height={56} rx="8" fill="var(--note)" fillOpacity="0.22" stroke="var(--note)" strokeWidth="2" />
          <text x={56 + i * 66} y={94} fontSize="16" textAnchor="middle" style={svgText}>{p}</text>
        </g>
      ))}
      <path d="M 240 80 L 320 80" stroke="var(--ink)" strokeWidth="2" markerEnd="url(#arr-pg)" />
      <path d="M 320 100 L 240 100" stroke="var(--ink)" strokeWidth="2" markerEnd="url(#arr-pg)" />
      <text x="280" y="70" fontSize="10" textAnchor="middle" style={svgMute}>evict</text>
      <text x="280" y="118" fontSize="10" textAnchor="middle" style={svgMute}>load</text>
      <defs>
        <marker id="arr-pg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--ink)" />
        </marker>
      </defs>
      <rect x="330" y="20" width="220" height="120" rx="12" fill="var(--paper-2)" stroke="var(--hair)" strokeWidth="2" />
      <text x="440" y="44" fontSize="13" textAnchor="middle" style={svgText}>Disk: every page (slow)</text>
      {["A", "B", "C", "D", "E", "F", "G", "H"].map((p, i) => (
        <g key={p}>
          <rect x={346 + (i % 4) * 48} y={58 + Math.floor(i / 4) * 40} width={40} height={32} rx="6" fill="var(--card)" stroke="var(--hair)" />
          <text x={366 + (i % 4) * 48} y={79 + Math.floor(i / 4) * 40} fontSize="13" textAnchor="middle" style={svgText}>{p}</text>
        </g>
      ))}
    </svg>
  );
}

function StepTable({ refs, frames, algo }: { refs: number[]; frames: number; algo: PagingAlgorithm }) {
  const run = simulatePaging(refs, frames, algo);
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-center font-mono text-[13px] tabular-nums">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left font-sans text-[11px] font-semibold text-mute">Page asked for</th>
            {run.steps.map((s, i) => (
              <th key={i} className="px-2.5 py-1 font-bold text-ink">{s.page}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: frames }, (_, f) => (
            <tr key={f}>
              <td className="px-2 py-1 text-left font-sans text-[11px] text-mute">Frame {f + 1}</td>
              {run.steps.map((s, i) => (
                <td key={i} className={clsx("border-[1.5px] border-hair px-2.5 py-1", s.fault && s.frames[f] === s.page ? "bg-accent/15 font-bold text-ink" : "text-body")}>
                  {s.frames[f] ?? ""}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="px-2 py-1 text-left font-sans text-[11px] text-mute">Result</td>
            {run.steps.map((s, i) => (
              <td key={i} className={clsx("px-1 py-1 font-sans text-[11px] font-semibold", s.fault ? "text-accent-ink" : "text-note")}>{s.fault ? "Fault" : "Hit"}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-[14px] text-ink">
        <strong>{run.faults}</strong> faults out of {refs.length} requests.
      </p>
    </div>
  );
}

const faults = (refs: number[], frames: number, algo: PagingAlgorithm) => simulatePaging(refs, frames, algo).faults;

function Theory() {
  return (
    <>
      <Step n={1} title="Memory is small, disk is big">
        <p>
          Programs live on the disk, but the CPU can only work with data that is in <strong>RAM</strong> (main memory). RAM is fast but small; the disk
          is huge but thousands of times slower.
        </p>
        <p>
          So the operating system cuts programs into equal fixed-size pieces called <strong>pages</strong>, and RAM into slots of the same size called{" "}
          <strong>frames</strong>. Only the pages being used right now are kept in frames.
        </p>
        <Analogy>
          a small desk and a big bookshelf across the room. You can keep only three books open on the desk. When you need a fourth, one has to go back
          to the shelf, and every trip to the shelf wastes time.
        </Analogy>
        <Figure caption="RAM has a few frames; the disk has every page. Moving pages between them is slow, so we want to do it as rarely as possible.">
          <DeskDiagram />
        </Figure>
      </Step>

      <Step n={2} title="Hits and faults">
        <Terms
          items={[
            ["Reference string", "The list of pages a program asks for, in order. For example 1, 2, 3, 1, 4."],
            ["Page hit", "The page is already in a frame. Fast, nothing to do."],
            ["Page fault", "The page is not in RAM, so it must be loaded from disk. Slow."],
            ["Eviction", "When every frame is full, one page must be removed to make room. Which one is the whole question."],
          ]}
        />
        <p>
          A <strong>page replacement algorithm</strong> decides which page to evict. A good one causes <strong>fewer faults</strong>.
        </p>
      </Step>

      <Step n={3} title="Three ways to choose">
        <Terms
          items={[
            ["FIFO (first in, first out)", "Evict the page that was loaded earliest, like the oldest item in a queue. Easy, but it may throw out a page that is still used all the time."],
            ["LRU (least recently used)", "Evict the page that has not been used for the longest time. The idea: what you used recently, you will probably use again soon."],
            ["Optimal", "Evict the page that will not be needed for the longest time in the future. It gives the fewest faults possible, but needs to see the future, so it is used as a benchmark rather than in real systems."],
          ]}
        />
        <Worked title={`FIFO with 3 frames on ${SMALL.join(", ")}`}>
          <p>
            The first three requests fill the empty frames (3 faults). Then 1 is a hit. Page 4 needs a frame: FIFO evicts <strong>1</strong>, the oldest,
            even though 1 was just used. So the very next request for 1 is a fault again.
          </p>
          <StepTable refs={SMALL} frames={3} algo="FIFO" />
        </Worked>
        <Worked title="LRU on the same requests">
          <p>
            When 4 arrives, the least recently used page is <strong>2</strong> (1 was used a moment ago). LRU evicts 2 and keeps 1, so the next request
            for 1 is a hit.
          </p>
          <StepTable refs={SMALL} frames={3} algo="LRU" />
        </Worked>
        <p>
          Faults on this string with 3 frames: FIFO {faults(SMALL, 3, "FIFO")}, LRU {faults(SMALL, 3, "LRU")}, Optimal {faults(SMALL, 3, "OPT")}. Highlighted
          cells show where a page was loaded.
        </p>
      </Step>

      <Step n={4} title="Belady's anomaly">
        <p>
          You would expect more frames to always mean fewer faults. For LRU and Optimal that is true. For FIFO it is <strong>not always</strong>: on some
          reference strings, adding a frame causes <strong>more</strong> faults. This surprise is called <strong>Belady&apos;s anomaly</strong>.
        </p>
        <Worked title={`FIFO on ${BELADY.join(" ")}`}>
          <p>
            With 3 frames FIFO has <strong>{faults(BELADY, 3, "FIFO")}</strong> faults. With 4 frames it has <strong>{faults(BELADY, 4, "FIFO")}</strong>.
            One more frame, more faults. LRU on the same string: {faults(BELADY, 3, "LRU")} faults with 3 frames, {faults(BELADY, 4, "LRU")} with 4.
          </p>
        </Worked>
        <p>Load the &quot;Belady&apos;s anomaly&quot; preset in the visualizer to see it in the faults-by-frames table.</p>
      </Step>
    </>
  );
}

export const pageReplacementContent: LabContent = {
  minutes: 8,
  learn: [
    "Explain pages, frames, hits and page faults",
    "Trace FIFO, LRU and Optimal on a reference string by hand",
    "Count page faults and compare algorithms",
    "Recognise Belady's anomaly and which algorithm shows it",
  ],
  guide: [
    "Type a reference string (page numbers separated by spaces) or load a preset.",
    "Set how many frames RAM has.",
    "Pick FIFO, LRU or Optimal and read the step-by-step table.",
    "Check the faults-by-frames table to compare all three.",
  ],
  check: [
    { q: "What is a page fault?", a: <>The program asked for a page that is not in RAM, so the operating system has to load it from disk.</> },
    { q: "Which page does LRU evict?", a: <>The one that has gone unused for the longest time.</> },
    { q: "Why isn't the Optimal algorithm used in real operating systems?", a: <>It needs to know which pages will be requested in the future, which the OS cannot know. It is used to measure how close other algorithms get.</> },
  ],
  Theory,
};
