import type { DataSpec } from "@/lib/aptitude/practice/core";

const COLORS = ["var(--color-accent)", "var(--color-ink)", "var(--color-gold)", "var(--color-note)", "var(--color-mute)", "var(--color-warning)"];
const W = 480, H = 230, L = 36, B = 26, T = 14;

/** Draws the table or chart a data-interpretation question is about. */
export function DataView({ data }: { data: DataSpec }) {
  return (
    <figure className="mt-2 rounded-lg border-[1.5px] border-hair bg-card p-3">
      <figcaption className="mb-2 text-[13px] font-semibold">{data.title}</figcaption>
      {data.kind === "table" ? <Table data={data} /> : data.kind === "pie" ? <Pie data={data} /> : <Chart data={data} />}
    </figure>
  );
}

function Table({ data }: { data: Extract<DataSpec, { kind: "table" }> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b-[1.5px] border-hair text-left font-mono text-[11px] uppercase tracking-wider text-mute">
            {data.headers.map((h) => <th key={h} className="py-1.5 pr-3 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className="border-b border-hair last:border-0">
              {row.map((c, j) => <td key={j} className={j ? "py-1.5 pr-3 font-mono" : "py-1.5 pr-3"}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Legend({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-body">
      {items.map((name, i) => (
        <li key={name} className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block size-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
          {name}
        </li>
      ))}
    </ul>
  );
}

function Chart({ data }: { data: Extract<DataSpec, { kind: "bar" | "line" }> }) {
  const max = Math.ceil(Math.max(...data.series.flatMap((s) => s.values)) / 20) * 20 || 20;
  const plotW = W - L - 8, plotH = H - B - T;
  const y = (v: number) => T + plotH - (v / max) * plotH;
  const slot = plotW / data.labels.length;
  const x = (i: number) => L + slot * i + slot / 2;
  const ticks = [0, 1, 2, 3, 4].map((k) => (max / 4) * k);
  const barW = Math.min(22, (slot * 0.7) / data.series.length);
  const label = `${data.title}: ${data.series.map((s) => `${s.name} ${data.labels.map((l, i) => `${l} ${s.values[i]}`).join(", ")}`).join("; ")}`;
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full text-ink">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - 8} y1={y(t)} y2={y(t)} stroke="var(--color-hair)" />
            <text x={L - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="var(--color-mute)">{t}</text>
          </g>
        ))}
        {data.labels.map((l, i) => <text key={l} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="currentColor">{l}</text>)}
        {data.kind === "bar"
          ? data.series.map((s, si) => s.values.map((v, i) => {
              const bx = x(i) - (barW * data.series.length) / 2 + si * barW;
              return (
                <g key={`${si}-${i}`}>
                  <rect x={bx} y={y(v)} width={barW - 2} height={T + plotH - y(v)} fill={COLORS[si]} rx="2" />
                  <text x={bx + (barW - 2) / 2} y={y(v) - 3} textAnchor="middle" fontSize="9" fill="currentColor">{v}</text>
                </g>
              );
            }))
          : data.series.map((s, si) => (
              <g key={si}>
                <polyline points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" stroke={COLORS[si]} strokeWidth="2" />
                {s.values.map((v, i) => (
                  <g key={i}>
                    <circle cx={x(i)} cy={y(v)} r="3" fill={COLORS[si]} />
                    <text x={x(i)} y={y(v) + (si ? 13 : -6)} textAnchor="middle" fontSize="9" fill="currentColor">{v}</text>
                  </g>
                ))}
              </g>
            ))}
      </svg>
      <Legend items={data.series.map((s) => s.name)} />
    </>
  );
}

function Pie({ data }: { data: Extract<DataSpec, { kind: "pie" }> }) {
  const total = data.values.reduce((a, b) => a + b, 0);
  const slices = data.values.map((v, i) => {
    const before = data.values.slice(0, i).reduce((a, b) => a + b, 0);
    const a0 = -Math.PI / 2 + (before / total) * 2 * Math.PI, a1 = a0 + (v / total) * 2 * Math.PI;
    const p = (a: number) => `${100 + 90 * Math.cos(a)} ${100 + 90 * Math.sin(a)}`;
    return <path key={i} d={`M100 100 L${p(a0)} A90 90 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`} fill={COLORS[i % COLORS.length]} stroke="var(--color-card)" strokeWidth="1.5" />;
  });
  return (
    <div className="flex flex-wrap items-center gap-4">
      <svg viewBox="0 0 200 200" role="img" aria-label={`${data.title}: ${data.labels.map((l, i) => `${l} ${data.values[i]}%`).join(", ")}`} className="w-40 shrink-0">
        {slices}
      </svg>
      <div>
        <Legend items={data.labels.map((l, i) => `${l} ${data.values[i]}%`)} />
        {data.note && <p className="mt-2 text-[13px] font-medium">{data.note}</p>}
      </div>
    </div>
  );
}
