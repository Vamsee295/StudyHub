import { Analogy, Figure, Formula, Step, Terms, Worked, svgMute, svgText, type LabContent } from "@/components/labs/LabTheory";
import { parseIp, subnetInfo } from "@/lib/labs/subnet";

// The worked example is computed by the same subnetInfo() the visualizer uses.
const EX_IP = "192.168.10.77";
const EX_PREFIX = 27;
const ex = subnetInfo(parseIp(EX_IP)!, EX_PREFIX);

/** Place values of one octet, showing 77 = 64 + 8 + 4 + 1 = 01001101. */
function PlaceValues() {
  const values = [128, 64, 32, 16, 8, 4, 2, 1];
  const bits = (77).toString(2).padStart(8, "0").split("");
  return (
    <svg viewBox="0 0 560 130" className="h-auto w-full min-w-[480px]" role="img" aria-label="77 in binary is 01001101: 64 plus 8 plus 4 plus 1">
      {values.map((v, i) => {
        const on = bits[i] === "1";
        return (
          <g key={v}>
            <text x={40 + i * 62} y={20} fontSize="12" textAnchor="middle" style={svgMute}>{v}</text>
            <rect x={14 + i * 62} y={30} width={52} height={48} rx="8" fill={on ? "var(--accent)" : "var(--card-2)"} fillOpacity={on ? 0.22 : 1} stroke={on ? "var(--accent)" : "var(--hair)"} strokeWidth="2" />
            <text x={40 + i * 62} y={61} fontSize="20" textAnchor="middle" style={svgText}>{bits[i]}</text>
          </g>
        );
      })}
      <text x="14" y="110" fontSize="13" style={svgText}>77 = 64 + 8 + 4 + 1  →  01001101</text>
    </svg>
  );
}

/** A 32-bit address split into the network part (prefix) and host part. */
function BitsBar({ prefix }: { prefix: number }) {
  const w = 16;
  return (
    <svg viewBox="0 0 600 110" className="h-auto w-full min-w-[520px]" role="img" aria-label={`The first ${prefix} bits are the network part; the remaining ${32 - prefix} bits are the host part`}>
      {Array.from({ length: 32 }, (_, i) => {
        const net = i < prefix;
        const gap = Math.floor(i / 8) * 8;
        return (
          <rect key={i} x={10 + i * w + gap} y={30} width={w - 2} height={34} rx="3" fill={net ? "var(--accent)" : "var(--note)"} fillOpacity="0.25" stroke={net ? "var(--accent)" : "var(--note)"} strokeWidth="1.2" />
        );
      })}
      {[0, 1, 2, 3].map((o) => (
        <text key={o} x={10 + o * (8 * w + 8) + 4 * w} y={22} fontSize="11" textAnchor="middle" style={svgMute}>octet {o + 1}</text>
      ))}
      <rect x={10} y={78} width={12} height={12} rx="2" fill="var(--accent)" fillOpacity="0.25" stroke="var(--accent)" />
      <text x={28} y={88} fontSize="12" style={svgText}>network part: first {prefix} bits</text>
      <rect x={300} y={78} width={12} height={12} rx="2" fill="var(--note)" fillOpacity="0.25" stroke="var(--note)" />
      <text x={318} y={88} fontSize="12" style={svgText}>host part: last {32 - prefix} bits</text>
    </svg>
  );
}

/** The last octet 0–255 cut into /27 blocks of 32 addresses; .77 falls in the .64–.95 block. */
function BlockLine() {
  const size = 2 ** (32 - EX_PREFIX);
  const blocks = 256 / size;
  const W = 520;
  const bw = W / blocks;
  return (
    <svg viewBox="0 0 560 120" className="h-auto w-full min-w-[480px]" role="img" aria-label={`The last octet split into ${blocks} blocks of ${size}; address 77 sits in the block from 64 to 95`}>
      {Array.from({ length: blocks }, (_, b) => {
        const mine = b * size <= 77 && 77 < (b + 1) * size;
        return (
          <g key={b}>
            <rect x={20 + b * bw} y={30} width={bw - 3} height={40} rx="6" fill={mine ? "var(--gold)" : "var(--card-2)"} fillOpacity={mine ? 0.45 : 1} stroke={mine ? "var(--gold)" : "var(--hair)"} strokeWidth="2" />
            <text x={20 + b * bw + 4} y={88} fontSize="10" style={svgMute}>.{b * size}</text>
          </g>
        );
      })}
      <text x={20 + 2 * bw + bw / 2 - 1} y={55} fontSize="12" textAnchor="middle" style={svgText}>.77 here</text>
      <text x="20" y="18" fontSize="10" style={svgMute}>Last octet, 0 to 255, in blocks of {size} (because /{EX_PREFIX} leaves {32 - EX_PREFIX} host bits: 2^{32 - EX_PREFIX} = {size})</text>
      <text x="20" y="110" fontSize="11" style={svgMute}>Block .64–.95 → network .64, broadcast .95, hosts .65 to .94</text>
    </svg>
  );
}

function Theory() {
  return (
    <>
      <Step n={1} title="An IP address is a postal address">
        <p>
          Every device on a network needs an address so data can find it, just like a letter needs a postal address. An <strong>IPv4 address</strong>{" "}
          looks like <code className="rounded bg-paper-2 px-1 font-mono">192.168.10.77</code>: four numbers, each from 0 to 255, separated by dots.
        </p>
        <p>
          Each of the four numbers is called an <strong>octet</strong>, because computers store it as 8 bits (8 zeros and ones). Four octets × 8 bits ={" "}
          <strong>32 bits</strong> in total.
        </p>
        <Analogy>
          a street and a house number. &quot;MG Road&quot; tells the postman which area to go to; &quot;house 77&quot; tells him which door. An IP address
          has the same two parts: which <strong>network</strong>, and which <strong>device</strong> on it.
        </Analogy>
      </Step>

      <Step n={2} title="A quick binary refresher">
        <p>
          Each bit in an octet has a value: 128, 64, 32, 16, 8, 4, 2, 1. To write a number in binary, switch on the bits that add up to it. That is why an
          octet can only go up to 255: 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255.
        </p>
        <Figure caption="Writing 77 in binary: switch on 64, 8, 4 and 1.">
          <PlaceValues />
        </Figure>
      </Step>

      <Step n={3} title="Network part and host part">
        <p>
          The number after the slash, called the <strong>prefix</strong> or <strong>CIDR</strong>, says how many bits from the left belong to the network. In{" "}
          <code className="rounded bg-paper-2 px-1 font-mono">192.168.10.77/{EX_PREFIX}</code>, the first {EX_PREFIX} bits name the network and the last{" "}
          {32 - EX_PREFIX} bits name the device.
        </p>
        <Figure caption={`A /${EX_PREFIX} address: ${EX_PREFIX} network bits, ${32 - EX_PREFIX} host bits.`}>
          <BitsBar prefix={EX_PREFIX} />
        </Figure>
        <p>
          The <strong>subnet mask</strong> is the same information written as an address: the network bits set to 1, the host bits set to 0. /24 is{" "}
          <code className="rounded bg-paper-2 px-1 font-mono">255.255.255.0</code>; /{EX_PREFIX} is <code className="rounded bg-paper-2 px-1 font-mono">{ex.mask}</code>.
        </p>
      </Step>

      <Step n={4} title="The four numbers every subnet has">
        <Terms
          items={[
            ["Network address", "All host bits set to 0. It names the network itself, so no device can use it."],
            ["Broadcast address", "All host bits set to 1. A message sent here goes to every device on the network, so it can't be given to one device either."],
            ["Usable hosts", "Everything in between. That is why the count is 2 to the power of the host bits, minus 2."],
            ["Block size", "How many addresses the subnet covers: 2 to the power of the host bits."],
          ]}
        />
        <Formula>
          host bits = 32 − prefix
          <br />
          block size = 2^(host bits)
          <br />
          usable hosts = block size − 2
        </Formula>
        <Worked title={`${EX_IP}/${EX_PREFIX}`}>
          <p>
            Host bits = 32 − {EX_PREFIX} = {32 - EX_PREFIX}. Block size = 2^{32 - EX_PREFIX} = <strong>{ex.totalAddresses}</strong>. So the last octet is
            cut into blocks of {ex.totalAddresses}: 0–31, 32–63, 64–95, and so on. The address ends in 77, which falls in the 64–95 block.
          </p>
          <Figure caption={`With /${EX_PREFIX}, each block is ${ex.totalAddresses} addresses wide; 77 sits in 64–95.`}>
            <BlockLine />
          </Figure>
          <p>
            Network <strong>{ex.network}</strong> · broadcast <strong>{ex.broadcast}</strong> · usable hosts <strong>{ex.firstHost}</strong> to{" "}
            <strong>{ex.lastHost}</strong>, which is {ex.usableHosts} devices.
          </p>
        </Worked>
      </Step>

      <Step n={5} title="Subnetting: splitting a network">
        <p>
          <strong>Subnetting</strong> means cutting one network into smaller ones, for example one per department. You do it by moving bits from the host
          part to the network part: each bit you borrow <strong>doubles the number of subnets</strong> and <strong>halves the size of each</strong>.
        </p>
        <Formula>/24 → /26 borrows 2 bits → 2² = 4 subnets of 64 addresses (62 usable hosts each)</Formula>
        <p>
          Some ranges are <strong>private</strong> (RFC 1918): 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. They are used inside homes and offices and
          are never routed on the public internet. The visualizer tells you whether an address is private.
        </p>
      </Step>
    </>
  );
}

export const subnetContent: LabContent = {
  minutes: 10,
  learn: [
    "Read an IPv4 address and convert an octet to binary",
    "Explain what the /prefix and the subnet mask mean",
    "Find the network, broadcast and usable host range of any subnet",
    "Split a network into equal subnets by borrowing bits",
  ],
  guide: [
    "Type an address with a prefix, like 192.168.10.77/27.",
    "Read the network, broadcast and host range in the first panel.",
    "Look at the binary view: highlighted bits are the network part.",
    "Pick a new prefix to split the network into equal subnets.",
  ],
  check: [
    { q: "How many usable hosts does a /24 network have?", a: <>Host bits = 32 − 24 = 8, block size = 2⁸ = 256, usable = 256 − 2 = 254.</> },
    { q: "Why can't the network and broadcast addresses be given to a device?", a: <>The network address (all host bits 0) names the network itself, and the broadcast address (all host bits 1) reaches every device at once.</> },
    { q: "You split a /24 into /27s. How many subnets do you get?", a: <>You borrow 27 − 24 = 3 bits, so 2³ = 8 subnets of 32 addresses each.</> },
  ],
  Theory,
};
