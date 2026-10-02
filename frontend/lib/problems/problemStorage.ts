export type ProblemStatus = "unsolved" | "attempted" | "solved";

const STATUS_KEY = "studyhub_problem_statuses";

export const problemStorage = {
  getAllStatuses(): Record<string, ProblemStatus> {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(STATUS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("[problemStorage] Failed to read problem statuses:", e);
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
