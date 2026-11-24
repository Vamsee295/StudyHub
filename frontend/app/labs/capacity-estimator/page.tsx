"use client";

import { useState } from "react";
import { LabShell, cardCls, focusRing, inputCls } from "@/components/labs/LabShell";
import { EstimateInput, estimate, formatBits, formatBytes, formatCount } from "@/lib/labs/estimate";

const FIELDS: { key: keyof EstimateInput; label: string; hint: string; step?: number }[] = [
  { key: "dau", label: "Daily active users", hint: "e.g. 10,000,000" },
  { key: "readsPerUser", label: "Reads per user per day", hint: "views, feed loads, lookups", step: 0.1 },
  { key: "writesPerUser", label: "Writes per user per day", hint: "posts, uploads, messages", step: 0.1 },
  { key: "writeSizeKB", label: "Stored size per write (KB)", hint: "a photo ≈ 1,000 KB; a tweet ≈ 1 KB", step: 0.1 },
  { key: "readSizeKB", label: "Response size per read (KB)", hint: "thumbnail ≈ 200 KB; JSON ≈ 5 KB", step: 0.1 },
  { key: "retentionYears", label: "Retention (years)", hint: "how long data is kept", step: 0.5 },
  { key: "replication", label: "Replication factor", hint: "copies of stored data" },
  { key: "peakFactor", label: "Peak / average traffic", hint: "2 to 3 is typical", step: 0.5 },
  { key: "rpsPerServer", label: "Requests/s per app server", hint: "1,000 to 10,000 for light APIs" },
];

const PRESETS: Record<string, EstimateInput> = {
  "Photo sharing": { dau: 10_000_000, readsPerUser: 50, writesPerUser: 0.2, writeSizeKB: 1000, readSizeKB: 200, retentionYears: 5, replication: 3, peakFactor: 3, rpsPerServer: 2000 },
  "URL shortener": { dau: 10_000_000, readsPerUser: 30, writesPerUser: 0.3, writeSizeKB: 0.5, readSizeKB: 0.5, retentionYears: 5, replication: 3, peakFactor: 3, rpsPerServer: 5000 },
  "Chat app": { dau: 500_000_000, readsPerUser: 100, writesPerUser: 40, writeSizeKB: 0.2, readSizeKB: 0.2, retentionYears: 1, replication: 3, peakFactor: 3, rpsPerServer: 5000 },
};

export default function CapacityLab() {
  const [input, setInput] = useState<EstimateInput>(PRESETS["Photo sharing"]);
  const r = estimate(input);

  const results: [string, string, string][] = [
    ["Read QPS (average)", formatCount(r.readQps), "reads per day ÷ 86,400"],
    ["Write QPS (average)", formatCount(r.writeQps), "writes per day ÷ 86,400"],
    ["Peak QPS", formatCount(r.peakQps), "(reads + writes) × peak factor"],
    ["New storage per day", formatBytes(r.storagePerDayBytes), "writes per day × size per write"],
    ["Total storage", formatBytes(r.totalStorageBytes), "per day × 365 × years × replication"],
    ["Peak egress bandwidth", formatBits(r.peakEgressBitsPerSec), "peak reads × response size × 8 bits"],
    ["App servers", String(r.servers), "peak QPS ÷ per-server capacity × 1.5 headroom (min 2)"],
  ];

  const hints: string[] = [];
  if (r.peakEgressBitsPerSec > 1e9) hints.push("Egress exceeds 1 Gbit/s: serve media and static responses from a CDN.");
  if (r.writeQps * input.peakFactor > 5000) hints.push("Peak writes exceed about 5,000/s: one database primary may struggle; consider sharding or a write-optimized store.");
  if (r.readQps > 10 * Math.max(r.writeQps, 0.001)) hints.push("Reads dominate writes by 10× or more: caching and read replicas pay off.");
  if (r.totalStorageBytes > 1e14) hints.push("Storage passes 100 TB: keep large blobs in object storage, with metadata in the database.");

  return (
    <LabShell slug="capacity-estimator">
      <section className={cardCls}>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(PRESETS).map((k) => (
            <button key={k} type="button" onClick={() => setInput(PRESETS[k])} className={`px-3 py-1.5 rounded-lg border border-hair text-[13px] text-body hover:border-accent ${focusRing}`}>Load: {k}</button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FIELDS.map((f) => (
            <label key={f.key} className="flex flex-col gap-1 text-[13px] font-medium text-ink">
              {f.label}
              <input type="number" min={0} step={f.step ?? 1} value={input[f.key]}
                onChange={(e) => setInput((s) => ({ ...s, [f.key]: Math.max(0, Number(e.target.value) || 0) }))} className={`${inputCls} tabular-nums`} />
              <span className="text-[11.5px] font-normal text-mute">{f.hint}</span>
            </label>
          ))}
        </div>
      </section>

      <section className={cardCls}>
        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
          {results.map(([k, v, how]) => (
            <div key={k} className="flex flex-col border-b border-hair/60 py-2">
              <div className="flex justify-between gap-4">
                <dt className="text-[13px] text-body">{k}</dt>
                <dd className="text-[16px] font-mono font-bold tabular-nums text-ink">{v}</dd>
              </div>
              <span className="text-[11.5px] text-mute">{how}</span>
            </div>
          ))}
        </dl>
      </section>

      {hints.length > 0 && (
        <section className={cardCls} aria-live="polite">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-ink mb-2">What these numbers suggest</h2>
          <ul className="list-disc pl-5 space-y-1 text-[14px] text-body">{hints.map((h) => <li key={h}>{h}</li>)}</ul>
        </section>
      )}
    </LabShell>
  );
}
