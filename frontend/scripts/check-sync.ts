// Simulates two devices syncing through a fake server with the backend's last-write-wins rule.
// Usage: npx tsx scripts/check-sync.ts
class MemStorage { m = new Map<string, string>(); getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; } setItem(k: string, v: string) { this.m.set(k, String(v)); } removeItem(k: string) { this.m.delete(k); } clear() { this.m.clear(); } key(i: number) { return [...this.m.keys()][i] ?? null; } get length() { return this.m.size; } }
const proxied = (s: MemStorage) => new Proxy(s, { ownKeys: (t) => [...t.m.keys()], getOwnPropertyDescriptor: (t, k) => (t.m.has(k as string) ? { enumerable: true, configurable: true, value: t.m.get(k as string) } : Reflect.getOwnPropertyDescriptor(t, k)) });
const server = new Map<string, { key: string; value: unknown; updated_at: number }>();
const serverProgress: Record<string, unknown> = { "two-sum-lesson": { status: "completed", progress: 100, updated_at: "2026-11-24T06:00:00Z" } };
(globalThis as any).window = { dispatchEvent: () => true, addEventListener() {}, removeEventListener() {} };
(globalThis as any).Event = class { constructor(public type: string) {} };
(globalThis as any).fetch = async (url: string, opts: any) => {
  const body = opts?.body ? JSON.parse(opts.body) : null;
  let out: any;
  if (opts.method === "GET") out = { items: [...server.values()], learn_progress: serverProgress };
  else out = { items: body.items.map((it: any) => { const cur = server.get(it.key); if (!cur || it.updated_at >= cur.updated_at) server.set(it.key, it); return server.get(it.key); }) };
  return { ok: true, status: 200, json: async () => out };
};
const devA = proxied(new MemStorage()), devB = proxied(new MemStorage());
const use = (d: any) => { (globalThis as any).localStorage = d; d.setItem("pathward_access_token", "fake"); };
const tick = () => new Promise((r) => setTimeout(r, 5));
const J = (d: any, k: string) => JSON.parse(d.getItem(k) ?? "null");

(async () => {
  const sync = await import("../lib/sync/userSync");
  const study = await import("../lib/learn/study");
  const bm = await import("../lib/learn/bookmarks");
  const check = (name: string, ok: boolean) => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); if (!ok) process.exitCode = 1; };

  // Device A, signed out: data is kept locally, then adopted on first sign-in.
  use(devA); sync.setSyncEnabled(null);
  study.saveAttempt("dsa", { at: 1000, total: 10, correct: 7, seconds: 300, byModule: {} });
  bm.toggleBookmark("dsa", "two-sum-lesson");
  sync.setSyncEnabled("u1"); await sync.pull();
  check("A's signed-out data was pushed on sign-in", (server.get("studyhub:tests:dsa")?.value as any[])?.length === 1 && (server.get("studyhub_lesson_bookmarks_v1")?.value as any[])?.length === 1);
  check("A's lesson progress hydrated from server", J(devA, "studyhub_learn_progress_v2")?.["two-sum-lesson"]?.status === "completed");

  // Device B, same account: receives everything, adds a test, removes the bookmark.
  await tick(); use(devB); sync.setSyncEnabled("u1"); await sync.pull();
  check("B received A's test attempt and bookmark", J(devB, "studyhub:tests:dsa")?.length === 1 && J(devB, "studyhub_lesson_bookmarks_v1")?.length === 1);
  await tick(); study.saveAttempt("dsa", { at: 2000, total: 10, correct: 9, seconds: 250, byModule: {} });
  await tick(); bm.toggleBookmark("dsa", "two-sum-lesson"); await sync.flush();

  // Meanwhile A (offline) took another test before seeing B's changes.
  use(devA); await tick(); study.saveAttempt("dsa", { at: 1500, total: 10, correct: 8, seconds: 280, byModule: {} });
  await sync.pull();
  const tests = J(devA, "studyhub:tests:dsa") as { at: number }[];
  check("test history merged from both devices (3 attempts, newest first)", tests.map((t) => t.at).join(",") === "2000,1500,1000");
  check("bookmark removal on B propagated to A (not resurrected)", J(devA, "studyhub_lesson_bookmarks_v1")?.length === 0);
  check("server holds the merged history", (server.get("studyhub:tests:dsa")?.value as any[]).length === 3);

  // Shared computer: a different account signs in on device A.
  sync.setSyncEnabled(null); sync.setSyncEnabled("u2");
  check("u1's local data cleared when u2 signs in on the same browser", devA.getItem("studyhub:tests:dsa") === null && devA.getItem("studyhub_learn_progress_v2") === null);
  check("non-synced keys untouched", devA.getItem("pathward_access_token") === "fake");

  // Merge helpers directly.
  check("mergeTests caps at 20", sync.mergeTests(Array.from({ length: 15 }, (_, i) => ({ at: i })), Array.from({ length: 15 }, (_, i) => ({ at: 100 + i }))).length === 20);
  const p = sync.mergeProgress({ a: { status: "completed", progress: 100, updatedAt: "2026-11-24T10:00:00Z" } }, { a: { status: "in_progress", progress: 50, updated_at: "2026-11-24T09:00:00Z" } });
  check("newer local progress is not overwritten by older server progress", p.merged.a.status === "completed" && !p.changed);
})();
