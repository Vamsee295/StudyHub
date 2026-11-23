// CPU scheduling simulator: FCFS, SJF, SRTF, Round Robin, Priority (non-preemptive and preemptive).
export interface Proc { id: string; arrival: number; burst: number; priority: number }
export interface Slice { id: string | null; start: number; end: number } // id null = CPU idle
export interface ProcResult extends Proc { completion: number; turnaround: number; waiting: number; response: number }
export type Algorithm = "FCFS" | "SJF" | "SRTF" | "RR" | "PRIORITY" | "PRIORITY_P";

export interface ScheduleResult { gantt: Slice[]; procs: ProcResult[]; avgWaiting: number; avgTurnaround: number; avgResponse: number }

function push(gantt: Slice[], id: string | null, start: number, end: number) {
  if (end <= start) return;
  const last = gantt[gantt.length - 1];
  if (last && last.id === id && last.end === start) last.end = end;
  else gantt.push({ id, start, end });
}

export function schedule(input: Proc[], algo: Algorithm, quantum = 2): ScheduleResult {
  const procs = input.map((p, i) => ({ ...p, idx: i, remaining: p.burst, firstRun: -1, completion: 0 }));
  const gantt: Slice[] = [];
  let time = 0;
  let done = 0;
  const n = procs.length;
  // Ties break by arrival, then input order, so results are deterministic.
  const byArrival = (a: typeof procs[0], b: typeof procs[0]) => a.arrival - b.arrival || a.idx - b.idx;

  if (algo === "RR") {
    const order = [...procs].sort(byArrival);
    const queue: typeof procs = [];
    let next = 0;
    const admit = (t: number) => { while (next < n && order[next].arrival <= t) queue.push(order[next++]); };
    admit(time);
    while (done < n) {
      if (queue.length === 0) { push(gantt, null, time, order[next].arrival); time = order[next].arrival; admit(time); continue; }
      const p = queue.shift()!;
      if (p.firstRun < 0) p.firstRun = time;
      const run = Math.min(quantum, p.remaining);
      push(gantt, p.id, time, time + run);
      time += run;
      p.remaining -= run;
      admit(time); // arrivals during the slice join before the preempted process
      if (p.remaining > 0) queue.push(p);
      else { p.completion = time; done++; }
    }
  } else {
    const preemptive = algo === "SRTF" || algo === "PRIORITY_P";
    const key = (p: typeof procs[0]) =>
      algo === "FCFS" ? p.arrival :
      algo === "SJF" ? p.burst :
      algo === "SRTF" ? p.remaining : p.priority; // lower number = higher priority
    while (done < n) {
      const ready = procs.filter((p) => p.arrival <= time && p.remaining > 0);
      if (ready.length === 0) {
        const nextArrival = Math.min(...procs.filter((p) => p.remaining > 0).map((p) => p.arrival));
        push(gantt, null, time, nextArrival);
        time = nextArrival;
        continue;
      }
      ready.sort((a, b) => key(a) - key(b) || byArrival(a, b));
      const p = ready[0];
      if (p.firstRun < 0) p.firstRun = time;
      let run = p.remaining;
      if (preemptive) {
        const upcoming = procs.filter((q) => q.arrival > time && q.remaining > 0).map((q) => q.arrival);
        if (upcoming.length) run = Math.min(run, Math.min(...upcoming) - time);
      }
      push(gantt, p.id, time, time + run);
      time += run;
      p.remaining -= run;
      if (p.remaining === 0) { p.completion = time; done++; }
    }
  }

  const results: ProcResult[] = procs.map(({ idx, remaining, firstRun, ...p }) => ({
    ...p,
    turnaround: p.completion - p.arrival,
    waiting: p.completion - p.arrival - p.burst,
    response: firstRun - p.arrival,
  }));
  const avg = (f: (r: ProcResult) => number) => results.reduce((s, r) => s + f(r), 0) / Math.max(1, n);
  return { gantt, procs: results, avgWaiting: avg((r) => r.waiting), avgTurnaround: avg((r) => r.turnaround), avgResponse: avg((r) => r.response) };
}
