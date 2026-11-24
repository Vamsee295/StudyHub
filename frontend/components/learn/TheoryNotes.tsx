import { Fragment, ReactNode } from "react";
import { BookOpen, Library, type LucideIcon } from "lucide-react";

/** Reading typography shared by lesson theory and lesson blocks (DESIGN §3: 17px / 1.75, max ~68ch). */
export const prose = {
  p: "text-[17px] leading-[1.75] text-body",
  list: "space-y-2 pl-6 text-[17px] leading-[1.75] text-body marker:text-accent",
  code: "rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.88em] text-ink break-words",
  // code stays a dark island in both themes, so its colours are fixed
  pre: "overflow-x-auto rounded-xl border-[2.4px] border-line bg-night p-5 font-mono text-[13.5px] leading-relaxed text-[#f5efe6]",
  callout: "rounded-xl border-[1.5px] border-hair bg-paper-2 px-5 py-4 text-[16px] leading-relaxed text-ink",
  link: "text-accent-ink underline underline-offset-2",
};

/** Lesson section heading: condensed label with a rust icon. */
export function LessonHeading({ icon: Icon = BookOpen, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <h2 className="label-cond mb-3 flex items-center gap-2 text-[20px]">
      <Icon aria-hidden className="size-[18px] text-accent" /> {children}
    </h2>
  );
}

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
      out.push(<code key={m.index} className={prose.code}>{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("**")) {
      out.push(<strong key={m.index} className="font-semibold text-ink">{tok.slice(2, -2)}</strong>);
    } else {
      const [, label, href] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      const external = /^https?:\/\//.test(href);
      out.push(
        <a key={m.index} href={href} className={prose.link}
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
        <pre key={key} tabIndex={0} className={prose.pre}><code>{code.join("\n")}</code></pre>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      out.push(<h4 key={key} className="label-cond mt-2 text-[19px]">{inline(line.slice(4))}</h4>);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      out.push(<h3 key={key} className="display mt-6 text-[28px]">{inline(line.slice(3))}</h3>);
      i++; continue;
    }
    if (line.startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const [head, , ...body] = rows;                 // second row is the |---| separator
      out.push(
        <div key={key} tabIndex={0} className="overflow-x-auto rounded-xl border-[1.5px] border-hair">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b-[1.5px] border-hair bg-paper-2">
              <tr>{cells(head).map((c, j) => <th key={j} className="px-4 py-2.5 font-mono text-[12px] font-medium uppercase tracking-wider text-ink">{inline(c)}</th>)}</tr>
            </thead>
            <tbody className="divide-y-[1.5px] divide-hair">
              {body.map((r, k) => (
                <tr key={k}>{cells(r).map((c, j) => <td key={j} className="px-4 py-2.5 align-top text-[15px] text-body">{inline(c)}</td>)}</tr>
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
        <div key={key} className={prose.callout}>{inline(quote.join(" "))}</div>
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
        <List key={key} className={`${ordered ? "list-decimal" : "list-disc"} ${prose.list}`}>
          {items.map((it, k) => <li key={k}>{inline(it)}</li>)}
        </List>
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3} |```|~~~|\||> |- |\d+\. )/.test(lines[i])) para.push(lines[i++]);
    out.push(<p key={key} className={prose.p}>{inline(para.join(" "))}</p>);
  }
  return out;
}

export function TheoryNotes({ markdown }: { markdown: string }) {
  return (
    <section className="flex flex-col gap-4">
      <LessonHeading>Theory</LessonHeading>
      {blocks(markdown).map((b, i) => <Fragment key={i}>{b}</Fragment>)}
    </section>
  );
}

export function LessonSources({ sources }: { sources: { title: string; url: string; license?: string }[] }) {
  return (
    <section className="border-t-[1.5px] border-hair pt-6">
      <LessonHeading icon={Library}>Sources &amp; further reading</LessonHeading>
      <ul className="space-y-1.5 text-[15px]">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className={prose.link}>{s.title}</a>
            {s.license && <span className="ml-2 font-mono text-[12px] text-mute">({s.license})</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
