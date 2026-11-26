"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, MessageCircleQuestion, SendHorizontal, Trash2, X } from "lucide-react";
import { clsx } from "clsx";
import { aiApi, type ChatMessage, type ChatReply } from "@/lib/api/ai";
import { getAuthToken } from "@/lib/api/client";

/** Inline markdown the assistant uses: **bold**, *italic*, `code`, [text](/path). Built as React nodes, never HTML. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*\s][^*]*\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    if (/^`[^`]+`$/.test(part))
      return (
        <code key={i} className="rounded bg-paper-2 px-1 font-mono text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith("/") && !href.startsWith("//"))
        return (
          <Link key={i} href={href} className="font-semibold text-accent-ink underline underline-offset-2">
            {label}
          </Link>
        );
      if (/^https:\/\//.test(href))
        return (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-accent-ink underline underline-offset-2">
            {label}
          </a>
        );
      return <span key={i}>{label}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

function Markdown({ text }: { text: string }) {
  const blocks = text.split(/```[\w+-]*\n?([\s\S]*?)```/g); // odd indexes are code blocks
  return (
    <>
      {blocks.map((b, i) =>
        i % 2 ? (
          <pre key={i} className="my-2 overflow-x-auto rounded-lg bg-ink p-3 font-mono text-[12.5px] leading-relaxed text-paper">
            {b.trimEnd()}
          </pre>
        ) : (
          b
            .split(/\n{2,}/)
            .filter((p) => p.trim())
            .map((p, j) => {
              const lines = p.split("\n").filter((l) => l.trim());
              if (lines.length > 1 && lines.every((l) => l.trim().startsWith("|"))) {
                const rows = lines.filter((l) => !/^\s*\|[\s:|-]+\|\s*$/.test(l)).map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
                return (
                  <div key={`${i}-${j}`} className="my-2 overflow-x-auto">
                    <table className="w-full border-collapse text-[12.5px]">
                      <tbody>
                        {rows.map((r, k) => (
                          <tr key={k} className={k === 0 ? "font-semibold" : undefined}>
                            {r.map((c, m) => (
                              <td key={m} className="border-[1.5px] border-hair px-2 py-1 align-top">
                                {inline(c)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              if (lines.every((l) => /^\s*([-*]|\d+\.)\s/.test(l)))
                return (
                  <ul key={`${i}-${j}`} className="my-1.5 list-disc space-y-1 pl-5">
                    {lines.map((l, k) => (
                      <li key={k}>{inline(l.replace(/^\s*([-*]|\d+\.)\s/, ""))}</li>
                    ))}
                  </ul>
                );
              return (
                <p key={`${i}-${j}`} className="my-1.5">
                  {lines.map((l, k) => (
                    <span key={k}>
                      {k > 0 && <br />}
                      {inline(l.replace(/^#+\s*/, ""))}
                    </span>
                  ))}
                </p>
              );
            })
        )
      )}
    </>
  );
}

const suggestionsFor = (path: string) =>
  path.startsWith("/learn/") && path.split("/").length > 3
    ? ["Explain this lesson simply", "Give me an interview question on this", "What should I study next?"]
    : path.startsWith("/practice")
      ? ["How do I approach two-pointer problems?", "Explain time complexity with an example", "Where do I start with DSA?"]
      : path.startsWith("/templates")
        ? ["How do I write strong resume bullets?", "What should a fresher put on a resume?", "How do I prepare for an HR round?"]
        : ["Make me a 4-week DSA plan", "Explain deadlock in operating systems", "What can I do on StudyHub?"];

type Turn = ChatMessage & { sources?: ChatReply["sources"] };

/** "Ask StudyHub": a chat panel that answers from StudyHub's own lessons (backend RAG) and links to them. */
export function Assistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    let live = true;
    (async () => {
      const [status, token] = await Promise.all([aiApi.status().catch(() => null), getAuthToken()]);
      if (!live) return;
      setBlocked(!status ? "The assistant needs the StudyHub server, which isn't reachable right now." : !status.available ? "The assistant isn't switched on for this server yet." : !token ? "Sign in to ask the assistant." : null);
    })();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      live = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  const send = async (q: string) => {
    const question = q.trim();
    if (!question || busy) return;
    const next: Turn[] = [...turns, { role: "user", content: question }];
    setTurns(next);
    setText("");
    setErr("");
    setBusy(true);
    try {
      const r = await aiApi.chat(
        next.map(({ role, content }) => ({ role, content })),
        pathname
      );
      setTurns([...next, { role: "assistant", content: r.reply, sources: r.sources }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
      setTurns(turns);
      setText(question);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        className={clsx(
          "brut fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-paper md:bottom-6 md:right-6",
          open && "max-md:hidden"
        )}
      >
        {open ? <X className="size-5" /> : <MessageCircleQuestion className="size-5" />}
        <span className="label-cond text-[15px]">{open ? "Close" : "Ask StudyHub"}</span>
      </button>

      {open && (
        <div
          id="assistant-panel"
          role="dialog"
          aria-label="Ask StudyHub"
          className="brut fixed inset-x-2 bottom-2 top-16 z-50 flex flex-col rounded-2xl bg-card md:inset-auto md:bottom-24 md:right-6 md:h-[min(620px,calc(100dvh-8rem))] md:w-[400px]"
        >
          <div className="flex items-center justify-between gap-2 border-b-[1.5px] border-hair px-4 py-3">
            <div>
              <p className="label-cond text-[18px] leading-none">Ask StudyHub</p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-mute">Answers from StudyHub lessons · AI can be wrong</p>
            </div>
            <div className="flex items-center gap-1">
              {turns.length > 0 && (
                <button type="button" onClick={() => setTurns([])} aria-label="Clear conversation" className="tap rounded-lg p-2 text-mute hover:text-ink">
                  <Trash2 className="size-4" />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="tap rounded-lg p-2 text-mute hover:text-ink">
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 text-[14px] leading-relaxed text-ink" aria-live="polite">
            {turns.length === 0 && (
              <div className="py-2">
                <p className="text-body">Ask about any topic, a problem you&apos;re stuck on, or how to use StudyHub. Answers link to the lessons they come from.</p>
                <div className="mt-3 flex flex-col items-start gap-2">
                  {suggestionsFor(pathname).map((s) => (
                    <button key={s} type="button" disabled={!!blocked} onClick={() => send(s)} className="rounded-full border-[1.5px] border-hair px-3 py-1.5 text-left text-[13px] hover:border-ink disabled:opacity-50">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {turns.map((m, i) =>
              m.role === "user" ? (
                <p key={i} className="my-3 ml-8 rounded-2xl rounded-br-sm bg-ink px-3 py-2 text-paper">
                  {m.content}
                </p>
              ) : (
                <div key={i} className="my-3 mr-4">
                  <Markdown text={m.content} />
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.sources.map((s) => (
                        <Link key={s.url + s.title} href={s.url} className="max-w-full truncate rounded-full bg-paper-2 px-2.5 py-1 font-mono text-[11px] text-mute hover:text-ink">
                          {s.title.split(" · ").slice(-2).join(" · ")}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
            {busy && (
              <p className="my-3 flex items-center gap-2 text-mute">
                <Loader2 className="size-4 animate-spin" /> Thinking…
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(text);
            }}
            className="border-t-[1.5px] border-hair p-3"
          >
            {(blocked || err) && (
              <p role="alert" className={clsx("mb-2 text-[12.5px]", err ? "text-danger" : "text-mute")}>
                {err || blocked}
              </p>
            )}
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(text);
                  }
                }}
                rows={1}
                maxLength={2000}
                disabled={!!blocked}
                placeholder="Ask a question…"
                aria-label="Your question"
                className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border-2 border-hair bg-paper px-3 py-2.5 text-[16px] text-ink outline-none placeholder:text-mute focus:border-accent disabled:opacity-60 md:text-[14px]"
              />
              <button type="submit" disabled={!!blocked || busy || !text.trim()} aria-label="Send" className="tap grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-paper disabled:opacity-40">
                <SendHorizontal className="size-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
