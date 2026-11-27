import type { Formula } from "@/lib/data/formulas";

/** A table of formulas: what it's for, the formula, a worked example when there is one. */
export function FormulaTable({ rows }: { rows: Formula[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b-[1.5px] border-hair font-mono text-[11px] uppercase tracking-wider text-mute">
            <th className="py-2 pr-3 font-medium">For</th>
            <th className="py-2 pr-3 font-medium">Formula</th>
            <th className="py-2 font-medium">Example</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([use, formula, example]) => (
            <tr key={use} className="border-b border-hair align-top last:border-0">
              <td className="py-2 pr-3 text-body">{use}</td>
              <td className="py-2 pr-3 font-mono text-[13.5px]">{formula}</td>
              <td className="py-2 text-[13px] text-mute">{example ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FormulaSheet({ rows }: { rows?: Formula[] }) {
  if (!rows?.length) return null;
  return (
    <section aria-labelledby="formula-sheet" className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-hair bg-card p-4 md:p-5">
      <h2 id="formula-sheet" className="label-cond text-[22px]">Formula sheet</h2>
      <FormulaTable rows={rows} />
    </section>
  );
}
