import { reportContent } from "@/lib/admin";

/** Ask why, then send a report to the admins. Native prompt/alert keep it to one tap and fully accessible. */
export async function askAndReport(kind: "post" | "comment", id: string) {
  const reason = window.prompt(`What's wrong with this ${kind === "post" ? "post" : "reply"}? (spam, abuse, wrong information…)`);
  if (!reason?.trim()) return;
  try {
    await reportContent(kind, id, reason);
    window.alert("Thanks. An admin will review it.");
  } catch {
    window.alert("Couldn't send the report. Try again in a moment.");
  }
}
