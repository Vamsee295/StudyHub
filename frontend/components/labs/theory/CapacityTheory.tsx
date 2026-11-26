import { Analogy, Figure, Formula, Step, Terms, Worked, svgMute, svgText, type LabContent } from "@/components/labs/LabTheory";
import { estimate, formatBits, formatBytes, formatCount, type EstimateInput } from "@/lib/labs/estimate";

// The worked example runs the same estimate() as the visualizer's "Photo sharing" preset.
const EX: EstimateInput = { dau: 10_000_000, readsPerUser: 50, writesPerUser: 0.2, writeSizeKB: 1000, readSizeKB: 200, retentionYears: 5, replication: 3, peakFactor: 3, rpsPerServer: 2000 };
const r = estimate(EX);
const n = (x: number) => Math.round(x).toLocaleString("en-US");

/** Users → requests per day → requests per second → peak. */
function FunnelDiagram() {
  const boxes: [string, string][] = [
    ["Daily users", formatCount(EX.dau)],
    ["Reads per day", formatCount(EX.dau * EX.readsPerUser)],
    ["Reads per second", formatCount(r.readQps)],
    ["At peak (×3)", formatCount(r.readQps * EX.peakFactor)],
  ];
  return (
    <svg viewBox="0 0 600 130" className="h-auto w-full min-w-[520px]" role="img" aria-label="10 million users making 50 reads each is 500 million reads a day, about 5,800 per second, and about 17,400 per second at peak">
      <defs>
        <marker id="arr-cap" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--ink)" />
        </marker>
      </defs>
      {boxes.map(([label, value], i) => (
        <g key={label}>
          <rect x={6 + i * 150} y={24} width={124} height={70} rx="12" fill={i === 3 ? "var(--accent)" : "var(--card-2)"} fillOpacity={i === 3 ? 0.2 : 1} stroke={i === 3 ? "var(--accent)" : "var(--ink)"} strokeWidth="2" />
          <text x={68 + i * 150} y={54} fontSize="18" textAnchor="middle" style={svgText}>{value}</text>
          <text x={68 + i * 150} y={78} fontSize="11" textAnchor="middle" style={svgMute}>{label}</text>
          {i < 3 && <path d={`M ${132 + i * 150} 59 L ${152 + i * 150} 59`} stroke="var(--ink)" strokeWidth="2" markerEnd="url(#arr-cap)" />}
        </g>
      ))}
      <text x="6" y="118" fontSize="10" style={svgMute}>× 50 reads each  →  ÷ 86,400 seconds in a day  →  × 3 for the busiest hour</text>
    </svg>
  );
}

function Theory() {
  return (
    <>
      <Step n={1} title="Why estimate before building">
        <p>
          Before designing a system, engineers ask: <strong>how big will this get?</strong> A website for 100 users runs on one small server; an app for 100
          million users needs databases, caches and many servers. Getting the size roughly right decides the whole design.
        </p>
        <p>
          These quick calculations are called <strong>back-of-the-envelope estimates</strong>, because you could do them on the back of an envelope. In
          system design interviews you are expected to do them out loud, and the goal is the <strong>right order of magnitude</strong> (thousands or
          millions?), not exact numbers.
        </p>
        <Analogy>
          planning food for a wedding. You don&apos;t count grains of rice; you estimate guests × plates per guest, then add extra for the rush at dinner
          time. Systems are sized the same way.
        </Analogy>
      </Step>

      <Step n={2} title="Numbers worth remembering">
        <Terms
          items={[
            ["86,400", "Seconds in a day (24 × 60 × 60). Round it to 100,000 when you do it in your head."],
            ["QPS", "Queries (requests) per second. The basic unit for how busy a server is."],
            ["Peak factor", "Traffic is not flat: evenings are busier than 4 a.m. Peak traffic is often 2 to 3 times the daily average."],
            ["KB, MB, GB, TB", "Each is 1,000 times the one before (this lab uses powers of 1,000 for simple maths). 1 TB = 1,000 GB = 1,000,000 MB."],
            ["Bits vs bytes", "Storage is measured in bytes, network speed in bits. 1 byte = 8 bits, so multiply by 8 for bandwidth."],
            ["Replication", "Data is stored in several copies (often 3) so one broken disk doesn't lose it. That multiplies storage."],
          ]}
        />
      </Step>

      <Step n={3} title="From users to requests per second">
        <p>Start with daily active users (DAU) and how often each one does something:</p>
        <Formula>average QPS = (users × actions per user per day) ÷ 86,400 · peak QPS = average × peak factor</Formula>
        <Worked title="a photo-sharing app">
          <p>
            {formatCount(EX.dau)} daily users each open {EX.readsPerUser} photos a day: {n(EX.dau * EX.readsPerUser)} reads a day. Divide by 86,400 seconds:
            about <strong>{n(r.readQps)} reads per second</strong> on average. They upload {EX.writesPerUser} photos a day each, which is about{" "}
            <strong>{n(r.writeQps)} writes per second</strong>.
          </p>
          <Figure caption="The same arithmetic as a pipeline. Peak traffic, not the average, decides how many servers you need.">
            <FunnelDiagram />
          </Figure>
        </Worked>
      </Step>

      <Step n={4} title="Storage, bandwidth and servers">
        <Formula>
          storage per day = writes per day × size per write
          <br />
          total storage = per day × 365 × years × copies
          <br />
          bandwidth = reads per second × response size × 8 (bits)
          <br />
          servers = peak QPS ÷ what one server handles, plus spare room
        </Formula>
        <Worked title="the same photo app">
          <p>
            Uploads: {n(EX.dau * EX.writesPerUser)} photos a day × {EX.writeSizeKB.toLocaleString("en-US")} KB = <strong>{formatBytes(r.storagePerDayBytes)}</strong> of new
            data a day. Kept for {EX.retentionYears} years in {EX.replication} copies: <strong>{formatBytes(r.totalStorageBytes)}</strong>.
          </p>
          <p>
            Serving {EX.readSizeKB} KB thumbnails at peak needs about <strong>{formatBits(r.peakEgressBitsPerSec)}</strong> of outgoing bandwidth, far too much
            for one server, which is why such apps use a CDN.
          </p>
          <p>
            At {n(r.peakQps)} requests per second at peak and {EX.rpsPerServer.toLocaleString("en-US")} per server, with 1.5× spare room, you need about{" "}
            <strong>{r.servers} app servers</strong>. The lab never suggests fewer than 2, so one failure doesn&apos;t take the site down.
          </p>
        </Worked>
        <p>
          The visualizer turns these results into design hints, such as adding a cache when reads far outnumber writes. Try the presets and change one
          input at a time to see which numbers it moves.
        </p>
      </Step>
    </>
  );
}

export const capacityContent: LabContent = {
  minutes: 8,
  learn: [
    "Explain why engineers estimate scale before designing",
    "Convert daily users into average and peak requests per second",
    "Estimate storage, bandwidth and server counts",
    "Read what the numbers mean for the design (cache, CDN, sharding)",
  ],
  guide: [
    "Load a preset (photo sharing, URL shortener or chat) to start.",
    "Change one input at a time, like daily users or file size.",
    "Read each result with the formula shown beneath it.",
    "Check the hints at the bottom for what the numbers suggest.",
  ],
  check: [
    { q: "1 million users each make 10 requests a day. Roughly what is the average QPS?", a: <>10 million ÷ 86,400 ≈ 116 requests per second. Using 100,000 for the seconds gives about 100, close enough for an estimate.</> },
    { q: "Why multiply by 8 when working out bandwidth?", a: <>Sizes are in bytes but network speed is measured in bits, and 1 byte = 8 bits.</> },
    { q: "Why size servers for peak traffic instead of the average?", a: <>Traffic rises and falls through the day. Servers sized for the average would be overloaded during the busy hours.</> },
  ],
  Theory,
};
