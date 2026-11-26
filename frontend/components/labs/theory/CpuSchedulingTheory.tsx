import { Analogy, Figure, Formula, Step, Terms, Worked, svgMute, svgText, type LabContent } from "@/components/labs/LabTheory";
import { schedule, type Algorithm, type Proc } from "@/lib/labs/scheduling";

// One small example used all the way through. Every chart and number below is computed by the
// same schedule() function the visualizer uses, so the theory and the lab can never disagree.
const EXAMPLE: Proc[] = [
  { id: "P1", arrival: 0, burst: 5, priority: 2 },
  { id: "P2", arrival: 1, burst: 3, priority: 1 },
  { id: "P3", arrival: 2, burst: 1, priority: 3 },
];
const TONE: Record<string, string> = { P1: "var(--accent)", P2: "var(--note)", P3: "var(--gold)" };

/** The CPU as a single counter with a queue of processes waiting their turn. */
function QueueDiagram() {
  return (
    <svg viewBox="0 0 560 150" className="h-auto w-full min-w-[480px]" role="img" aria-label="Processes P3, P2 and P1 wait in the ready queue; the CPU runs one process at a time">
      <text x="10" y="20" fontSize="12" style={svgMute}>Ready queue (waiting)</text>
      {["P3", "P2", "P1"].map((p, i) => (
        <g key={p}>
          <rect x={10 + i * 92} y={36} width={80} height={56} rx="10" fill={TONE[p]} fillOpacity="0.2" stroke={TONE[p]} strokeWidth="2" />
          <text x={50 + i * 92} y={70} fontSize="16" textAnchor="middle" style={svgText}>{p}</text>
        </g>
      ))}
      <path d="M 290 64 L 350 64" stroke="var(--ink)" strokeWidth="2" markerEnd="url(#arrow-cpu)" />
      <defs>
        <marker id="arrow-cpu" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--ink)" />
        </marker>
      </defs>
      <rect x={360} y={26} width={180} height={76} rx="12" fill="var(--card-2)" stroke="var(--ink)" strokeWidth="2.4" />
      <text x={450} y={60} fontSize="18" textAnchor="middle" style={svgText}>CPU</text>
      <text x={450} y={82} fontSize="11" textAnchor="middle" style={svgMute}>runs one at a time</text>
      <text x={10} y={130} fontSize="11" style={svgMute}>The scheduler decides which waiting process goes to the CPU next.</text>
    </svg>
  );
}

/** A Gantt chart for one algorithm on the example processes. */
function Gantt({ algo, quantum = 2 }: { algo: Algorithm; quantum?: number }) {
  const r = schedule(EXAMPLE, algo, quantum);
  const end = r.gantt.at(-1)!.end;
  const W = 520;
  const x = (t: number) => 20 + (t / end) * W;
  return (
    <svg viewBox="0 0 560 74" className="h-auto w-full min-w-[480px]" role="img" aria-label={r.gantt.map((s) => `${s.id ?? "idle"} from ${s.start} to ${s.end}`).join(", ")}>
      {r.gantt.map((s, i) => (
        <g key={i}>
          <rect x={x(s.start)} y={8} width={x(s.end) - x(s.start)} height={34} fill={s.id ? TONE[s.id] : "var(--card-2)"} fillOpacity="0.3" stroke={s.id ? TONE[s.id] : "var(--hair)"} strokeWidth="1.5" />
          <text x={(x(s.start) + x(s.end)) / 2} y={30} fontSize="13" textAnchor="middle" style={svgText}>{s.id ?? "idle"}</text>
        </g>
      ))}
      {[0, ...r.gantt.map((s) => s.end)].map((t, i) => (
        <text key={i} x={x(t)} y={60} fontSize="11" textAnchor="middle" style={svgMute}>{t}</text>
      ))}
    </svg>
  );
}

function ResultTable({ algo }: { algo: Algorithm }) {
  const r = schedule(EXAMPLE, algo, 2);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[14px] tabular-nums">
        <thead>
          <tr className="border-b border-hair text-body">
            {["Process", "Arrival", "Burst", "Finishes at", "Turnaround", "Waiting"].map((h) => (
              <th key={h} className="py-1.5 pr-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hair">
          {r.procs.map((p) => (
            <tr key={p.id}>
              <td className="py-1.5 pr-3 font-mono font-bold text-ink">{p.id}</td>
              <td className="py-1.5 pr-3">{p.arrival}</td>
              <td className="py-1.5 pr-3">{p.burst}</td>
              <td className="py-1.5 pr-3">{p.completion}</td>
              <td className="py-1.5 pr-3">{p.completion} − {p.arrival} = <strong>{p.turnaround}</strong></td>
              <td className="py-1.5 pr-3">{p.turnaround} − {p.burst} = <strong>{p.waiting}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[14px] text-ink">Average waiting time: <strong>{r.avgWaiting.toFixed(2)}</strong></p>
    </div>
  );
}

const avgWait = (a: Algorithm) => schedule(EXAMPLE, a, 2).avgWaiting.toFixed(2);

function Theory() {
  return (
    <>
      <Step n={1} title="One CPU, many programs">
        <p>
          Your computer seems to run a browser, music and a code editor at the same time. A single CPU core can actually run only{" "}
          <strong>one program at a time</strong>. It switches between them so fast that it looks simultaneous.
        </p>
        <p>
          Each running program is called a <strong>process</strong>. Processes that are ready to run wait in a line called the <strong>ready queue</strong>.
          The part of the operating system that picks who runs next is the <strong>scheduler</strong>, and the rule it uses is the{" "}
          <strong>scheduling algorithm</strong>.
        </p>
        <Analogy>
          a single billing counter in a shop. Customers queue up; the cashier serves one at a time. Who should go first: whoever came first, or the
          person buying one item?
        </Analogy>
        <Figure caption="Processes wait in the ready queue. The scheduler sends one to the CPU at a time.">
          <QueueDiagram />
        </Figure>
      </Step>

      <Step n={2} title="The words you need">
        <Terms
          items={[
            ["Arrival time", "When the process joins the ready queue."],
            ["Burst time", "How much CPU time it needs to finish."],
            ["Priority", "How important it is. In this lab, a lower number means higher priority (1 beats 3)."],
            ["Non-preemptive", "Once a process starts, it runs until it finishes."],
            ["Preemptive", "The scheduler can pause a running process to run a better one, and resume it later."],
            ["Gantt chart", "A timeline bar showing which process had the CPU at each moment."],
          ]}
        />
      </Step>

      <Step n={3} title="How we judge a schedule">
        <p>For each process we calculate three times. Lower is better for all of them.</p>
        <Formula>
          Turnaround = finish time − arrival time
          <br />
          Waiting = turnaround − burst time
          <br />
          Response = first time it ran − arrival time
        </Formula>
        <p>
          <strong>Waiting time</strong> is time spent sitting in the queue doing nothing. Algorithms are usually compared by their{" "}
          <strong>average waiting time</strong>.
        </p>
        <Worked title="first come, first served">
          <p>
            Three processes: P1 arrives at 0 needing 5 units, P2 at 1 needing 3, P3 at 2 needing 1. Served in arrival order, the timeline looks like
            this:
          </p>
          <Figure caption="FCFS: P1 runs first because it arrived first, even though P3 needs only 1 unit.">
            <Gantt algo="FCFS" />
          </Figure>
          <ResultTable algo="FCFS" />
        </Worked>
      </Step>

      <Step n={4} title="The algorithms">
        <Terms
          items={[
            [
              "FCFS (first come, first served)",
              <>Serve in arrival order, like a normal queue. Simple and fair, but one long job makes everyone behind it wait: the <strong>convoy effect</strong>.</>,
            ],
            [
              "SJF (shortest job first)",
              <>When the CPU is free, pick the waiting process with the smallest burst. Gives the lowest average waiting time of any non-preemptive rule, but needs burst times known in advance, and long jobs can wait forever (<strong>starvation</strong>).</>,
            ],
            ["SRTF (shortest remaining time first)", <>The preemptive version of SJF. If a new process needs less time than what the current one has left, it takes over.</>],
            [
              "Round Robin",
              <>Each process gets a fixed slice of time, the <strong>quantum</strong>, then goes to the back of the queue. Fair, and everyone starts quickly, which is why time-sharing systems use it.</>,
            ],
            ["Priority", <>Run the highest-priority process. Low-priority processes can starve; a fix called <strong>aging</strong> raises a process&apos;s priority the longer it waits.</>],
          ]}
        />
        <p>Here is the same example under each rule. Watch how P3, the tiny job, gets served sooner:</p>
        <Figure caption={`SJF: when P1 finishes at 5, the shortest waiting job (P3) goes next. Average waiting ${avgWait("SJF")}.`}>
          <Gantt algo="SJF" />
        </Figure>
        <Figure caption={`SRTF: P2 interrupts P1 at 1, then P3 interrupts P2 at 2. Average waiting ${avgWait("SRTF")}, the lowest here.`}>
          <Gantt algo="SRTF" />
        </Figure>
        <Figure caption={`Round Robin with quantum 2: everyone gets turns of 2 units. Average waiting ${avgWait("RR")}.`}>
          <Gantt algo="RR" />
        </Figure>
        <p>
          When two processes tie, this lab picks the one that arrived first, then the one listed first, so every run gives the same answer.
        </p>
      </Step>
    </>
  );
}

export const cpuSchedulingContent: LabContent = {
  minutes: 10,
  learn: [
    "Explain why an operating system needs a scheduler",
    "Calculate turnaround, waiting and response time from a Gantt chart",
    "Describe FCFS, SJF, SRTF, Round Robin and Priority scheduling",
    "Spot the convoy effect and starvation, and know their fixes",
  ],
  guide: [
    "Pick an algorithm with the buttons at the top.",
    "Edit arrival, burst and priority for each process, or add more.",
    "Read the Gantt chart and the table of times below it.",
    "Compare average waiting time across all algorithms at the bottom.",
  ],
  check: [
    { q: "A process arrives at 2, needs 4 units, and finishes at 10. What are its turnaround and waiting times?", a: <>Turnaround = 10 − 2 = 8. Waiting = 8 − 4 = 4.</> },
    { q: "What is the difference between SJF and SRTF?", a: <>SJF is non-preemptive: a started job runs to the end. SRTF is preemptive: a newly arrived job with less remaining time takes over the CPU.</> },
    { q: "Why can Round Robin feel more responsive than FCFS?", a: <>Every process gets the CPU within a few quanta, so nobody waits behind one long job before starting.</> },
  ],
  Theory,
};
