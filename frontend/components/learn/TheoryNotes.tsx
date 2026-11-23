import { Fragment, ReactNode } from "react";
import { BookOpen, Library } from "lucide-react";

// Renders the markdown subset used by lesson theory: ## / ### headings, paragraphs,
// - and 1. lists, > callouts, | tables |, ``` or ~~~ code fences, **bold**, `code`, [links](url).
// Builds React elements directly (no HTML injection).

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      out.push(<code key={m.index} className="bg-[var(--surface-subdued)] px-1.5 py-0.5 rounded text-[13px] font-mono text-[var(--ink)]">{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("**")) {
      out.push(<strong key={m.index} className="font-semibold text-[var(--ink)]">{tok.slice(2, -2)}</strong>);
    } else {
      const [, label, href] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      const external = /^https?:\/\//.test(href);
      out.push(
        <a key={m.index} href={href} className="text-[var(--accent)] underline underline-offset-2"
           {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{label}</a>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

function blocks(md: string): ReactNode[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const key = `b${i}`;
    if (!line.trim()) { i++; continue; }

    if (line.startsWith("```") || line.startsWith("~~~")) {
      const fence = line.slice(0, 3);
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith(fence)) code.push(lines[i++]);
      i++;
      out.push(
        <pre key={key} className="bg-[#1E1E1E] rounded-xl p-5 overflow-x-auto text-[13px] text-gray-300 font-mono leading-relaxed"><code>{code.join("\n")}</code></pre>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      out.push(<h4 key={key} className="text-[15px] font-semibold text-[var(--ink)] mt-2">{inline(line.slice(4))}</h4>);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      out.push(<h3 key={key} className="text-[18px] font-bold text-[var(--ink)] mt-4 tracking-tight">{inline(line.slice(3))}</h3>);
      i++; continue;
    }
    if (line.startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const [head, , ...body] = rows;                 // second row is the |---| separator
      out.push(
        <div key={key} className="overflow-x-auto border border-[var(--border)] rounded-xl">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#FAFAFA] border-b border-[var(--border)]">
              <tr>{cells(head).map((c, j) => <th key={j} className="px-4 py-2.5 font-semibold text-[var(--ink)]">{inline(c)}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {body.map((r, k) => (
                <tr key={k} className="bg-white">{cells(r).map((c, j) => <td key={j} className="px-4 py-2.5 text-[var(--ink-secondary)] align-top">{inline(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) quote.push(lines[i++].slice(2));
      out.push(
        <div key={key} className="bg-[var(--accent-soft)]/30 border-l-4 border-[var(--accent)] rounded-r-lg px-5 py-4 text-[15px] text-[var(--ink)] leading-relaxed">{inline(quote.join(" "))}</div>
      );
      continue;
    }
    const ordered = /^\d+\. /.test(line);
    if (ordered || line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : lines[i].startsWith("- "))) {
        items.push(lines[i++].replace(ordered ? /^\d+\. / : /^- /, ""));
      }
      const List = ordered ? "ol" : "ul";
      out.push(
        <List key={key} className={`${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-1.5 text-[15px] text-[var(--ink-secondary)] leading-relaxed`}>
          {items.map((it, k) => <li key={k}>{inline(it)}</li>)}
        </List>
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3} |```|~~~|\||> |- |\d+\. )/.test(lines[i])) para.push(lines[i++]);
    out.push(<p key={key} className="text-[15px] text-[var(--ink-secondary)] leading-[1.75]">{inline(para.join(" "))}</p>);
  }
  return out;
}

export function TheoryNotes({ markdown }: { markdown: string }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--ink)]">
        <BookOpen className="w-4 h-4 text-[var(--accent)]" /> Theory
      </h2>
      {blocks(markdown).map((b, i) => <Fragment key={i}>{b}</Fragment>)}
    </section>
  );
}

export function LessonSources({ sources }: { sources: { title: string; url: string; license?: string }[] }) {
  return (
    <section className="border-t border-[var(--border)] pt-6">
      <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-[var(--ink)]">
        <Library className="w-4 h-4 text-[var(--accent)]" /> Sources & further reading
      </h2>
      <ul className="space-y-1.5 text-[14px]">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline underline-offset-2">{s.title}</a>
            {s.license && <span className="text-[var(--ink-tertiary)] text-[12px] ml-2">({s.license})</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
