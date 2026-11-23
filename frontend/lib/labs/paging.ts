// Page replacement simulator: FIFO, LRU, Optimal.
export type PagingAlgorithm = "FIFO" | "LRU" | "OPT";
export interface PagingStep { page: number; frames: (number | null)[]; fault: boolean; evicted: number | null }

export function simulatePaging(refs: number[], frameCount: number, algo: PagingAlgorithm): { steps: PagingStep[]; faults: number } {
  const frames: (number | null)[] = Array(frameCount).fill(null);
  const loadedAt: number[] = Array(frameCount).fill(-1); // FIFO: when loaded
  const usedAt: number[] = Array(frameCount).fill(-1);   // LRU: last use
  const steps: PagingStep[] = [];
  let faults = 0;

  refs.forEach((page, t) => {
    const hit = frames.indexOf(page);
    if (hit >= 0) {
      usedAt[hit] = t;
      steps.push({ page, frames: [...frames], fault: false, evicted: null });
      return;
    }
    faults++;
    let slot = frames.indexOf(null);
    let evicted: number | null = null;
    if (slot < 0) {
      if (algo === "FIFO") slot = loadedAt.indexOf(Math.min(...loadedAt));
      else if (algo === "LRU") slot = usedAt.indexOf(Math.min(...usedAt));
      else {
        // Optimal: evict the page used farthest in the future (or never again).
        let farthest = -1;
        frames.forEach((f, i) => {
          const nextUse = refs.indexOf(f as number, t + 1);
          const dist = nextUse < 0 ? Infinity : nextUse;
          if (dist > farthest) { farthest = dist; slot = i; }
        });
      }
      evicted = frames[slot];
    }
    frames[slot] = page;
    loadedAt[slot] = t;
    usedAt[slot] = t;
    steps.push({ page, frames: [...frames], fault: true, evicted });
  });
  return { steps, faults };
}
