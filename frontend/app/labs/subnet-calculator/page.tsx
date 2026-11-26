"use client";

import { useState } from "react";
import { LabShell, cardCls, inputCls } from "@/components/labs/LabShell";
import { subnetContent } from "@/components/labs/theory/SubnetTheory";
import { parseCidr, splitSubnet, subnetInfo } from "@/lib/labs/subnet";

const toBinary = (ip: string) => ip.split(".").map((o) => Number(o).toString(2).padStart(8, "0")).join(".");

export default function SubnetLab() {
  const [cidr, setCidr] = useState("192.168.10.77/27");
  const parsed = parseCidr(cidr);
  const info = parsed ? subnetInfo(parsed.ip, parsed.prefix) : null;
  const [splitTo, setSplitTo] = useState(parsed ? Math.min(32, parsed.prefix + 2) : 26);
  // Keep the split prefix valid when the CIDR's own prefix changes.
  const split = parsed ? Math.min(32, Math.max(splitTo, parsed.prefix)) : splitTo;
  const subnets = parsed ? splitSubnet(parsed.ip, parsed.prefix, split) : [];
  const totalSplits = parsed ? 2 ** (split - parsed.prefix) : 0;

  const rows: [string, string][] = info ? [
    ["Network address", info.network], ["Broadcast address", info.broadcast],
    ["First usable host", info.firstHost], ["Last usable host", info.lastHost],
    ["Subnet mask", `${info.mask}  (/${info.prefix})`], ["Wildcard mask", info.wildcard],
    ["Total addresses", info.totalAddresses.toLocaleString()], ["Usable hosts", info.usableHosts.toLocaleString()],
    ["Class (historical)", info.ipClass], ["Private (RFC 1918)", info.isPrivate ? "Yes" : "No"],
  ] : [];

  return (
    <LabShell slug="subnet-calculator" content={subnetContent}>
      <section className={cardCls}>
        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink max-w-md">
          IPv4 address with prefix (CIDR)
          <input value={cidr} onChange={(e) => setCidr(e.target.value)} className={`${inputCls} font-mono`} spellCheck={false} autoComplete="off"
            aria-invalid={!parsed} aria-describedby="cidr-help" />
        </label>
        <p id="cidr-help" className={`text-[12px] mt-1.5 ${parsed ? "text-mute" : "text-danger"}`}>
          {parsed ? "For example 10.0.5.0/23 or 172.16.4.9/20." : "Enter four numbers from 0 to 255 and a prefix from 0 to 32, like 192.168.1.0/24."}
        </p>
      </section>

      {info && (
        <>
          <section className={cardCls}>
            <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-hair/60 py-1.5">
                  <dt className="text-[13px] text-body">{k}</dt>
                  <dd className="text-[14px] font-mono tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            {info.prefix >= 31 && (
              <p className="text-[12px] text-mute mt-3">/31 networks use both addresses for point-to-point links (RFC 3021); /32 is a single host.</p>
            )}
          </section>

          <section className={cardCls}>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-ink mb-3">In binary</h2>
            <div className="overflow-x-auto font-mono text-[13px] tabular-nums leading-7">
              {[["Address", info.address], ["Mask", info.mask], ["Network", info.network]].map(([k, v]) => {
                const bits = toBinary(v);
                let seen = 0;
                return (
                  <div key={k} className="flex gap-4 whitespace-nowrap">
                    <span className="w-20 text-mute font-sans text-[12px]">{k}</span>
                    <span>{[...bits].map((ch, i) => {
                      if (ch === ".") return <span key={i} className="text-mute">.</span>;
                      const isNet = seen++ < info.prefix;
                      return <span key={i} className={isNet ? "text-accent-ink font-bold" : "text-body"}>{ch}</span>;
                    })}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[12px] text-mute mt-2">Highlighted bits are the network part ({info.prefix} bits); the rest identify hosts.</p>
          </section>

          <section className={cardCls}>
            <div className="flex flex-wrap items-end gap-4 mb-3">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-ink">Split into equal subnets</h2>
              <label className="flex items-center gap-2 text-[13px] text-ink">
                New prefix /
                <input type="number" min={info.prefix} max={32} value={split} onChange={(e) => setSplitTo(Math.min(32, Math.max(info.prefix, Number(e.target.value) || info.prefix)))} className={`${inputCls} w-20`} />
              </label>
              <span className="text-[13px] text-body tabular-nums">{totalSplits.toLocaleString()} subnets of {subnets[0]?.usableHosts.toLocaleString() ?? 0} usable hosts</span>
            </div>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-[13px] font-mono tabular-nums">
                <thead><tr className="border-b border-hair text-body font-sans"><th className="py-1.5 pr-4 font-semibold">#</th><th className="py-1.5 pr-4 font-semibold">Network</th><th className="py-1.5 pr-4 font-semibold">Host range</th><th className="py-1.5 font-semibold">Broadcast</th></tr></thead>
                <tbody>
                  {subnets.map((s, i) => (
                    <tr key={s.network} className="border-b border-hair/60 text-ink">
                      <td className="py-1.5 pr-4 text-mute">{i + 1}</td><td className="py-1.5 pr-4">{s.network}/{s.prefix}</td>
                      <td className="py-1.5 pr-4">{s.firstHost} – {s.lastHost}</td><td className="py-1.5">{s.broadcast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalSplits > subnets.length && <p className="text-[12px] text-mute mt-2">Showing the first {subnets.length} of {totalSplits.toLocaleString()}.</p>}
          </section>
        </>
      )}
    </LabShell>
  );
}
