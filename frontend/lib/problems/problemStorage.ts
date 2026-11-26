import { acceptedAt } from "@/lib/problems/submissions";

export type ProblemStatus = "unsolved" | "attempted" | "solved";

const STATUS_KEY = "studyhub_problem_statuses";
// When each problem was first solved (ms). Feeds the activity heatmap and the practice streak.
const SOLVED_AT_KEY = "studyhub_problem_solved_at";

export const problemStorage = {
  getAllStatuses(): Record<string, ProblemStatus> {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(STATUS_KEY);
      const statuses: Record<string, ProblemStatus> = raw ? JSON.parse(raw) : {};
      // an accepted submission (possibly synced from another device) means solved
      for (const id of Object.keys(acceptedAt())) statuses[id] = "solved";
      return statuses;
    } catch (e) {
      console.warn("[problemStorage] Failed to read problem statuses:", e);
      return {};
    }
  },

  /** First-solve time per problem id, in ms. */
  getSolvedAt(): Record<string, number> {
    if (typeof window === "undefined") return {};
    try {
      const at: Record<string, number> = JSON.parse(localStorage.getItem(SOLVED_AT_KEY) || "{}");
      for (const [id, t] of Object.entries(acceptedAt())) if (!at[id] || t < at[id]) at[id] = t;
      return at;
    } catch {
      return {};
    }
  },

  getStatus(id: string): ProblemStatus {
    const statuses = this.getAllStatuses();
    return statuses[id] || "unsolved";
  },

  setStatus(id: string, status: ProblemStatus): void {
    if (typeof window === "undefined") return;
    try {
      const statuses = this.getAllStatuses();
      if (status === "unsolved") {
        delete statuses[id];
      } else {
        statuses[id] = status;
      }
      localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
      const at = this.getSolvedAt();
      if (status === "solved" && !at[id]) at[id] = Date.now(); // keep the first solve
      if (status === "unsolved") delete at[id];
      localStorage.setItem(SOLVED_AT_KEY, JSON.stringify(at));
      window.dispatchEvent(
        new CustomEvent("studyhub:problem_status_updated", {
          detail: { id, status },
        })
      );
    } catch (e) {
      console.warn("[problemStorage] Failed to write problem status:", e);
    }
  },

  toggleStatus(id: string): ProblemStatus {
    const current = this.getStatus(id);
    const next: ProblemStatus = current === "solved" ? "unsolved" : "solved";
    this.setStatus(id, next);
    return next;
  },
};
