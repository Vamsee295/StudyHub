// Small helpers shared by the Community board.

/** The backend sends naive UTC timestamps ("2026-11-26T09:43:09"); read them as UTC, not local time. */
export const parseUtc = (s: string) => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`);

/** Threads-style short age: now, 5m, 3h, 2d, then a date. */
export function ago(iso: string, now = Date.now()): string {
  const d = parseUtc(iso);
  const s = Math.max(0, (now - d.getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d`;
  const sameYear = d.getFullYear() === new Date(now).getFullYear();
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", ...(sameYear ? {} : { year: "numeric" }) });
}

export const fullDate = (iso: string) =>
  parseUtc(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const HASHTAG = /#([a-z0-9][\w-]{0,29})/gi;

/** Hashtags in a post, lowercased and de-duplicated: "#DSA and #dsa #two-pointers" -> ["dsa", "two-pointers"]. */
export function hashtags(text: string): string[] {
  return [...new Set([...text.matchAll(HASHTAG)].map((m) => m[1].toLowerCase()))];
}

/** Split text into plain parts and hashtag parts, for rendering hashtags as links. */
export function splitHashtags(text: string): { text: string; tag?: string }[] {
  const out: { text: string; tag?: string }[] = [];
  let last = 0;
  for (const m of text.matchAll(HASHTAG)) {
    if (m.index! > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], tag: m[1].toLowerCase() });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export const postLink = (id: string) => `${window.location.origin}/community?post=${id}`;
