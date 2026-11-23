// IPv4 subnet calculator and equal-size subnet splitter.
export interface SubnetInfo {
  address: string; prefix: number; mask: string; wildcard: string;
  network: string; broadcast: string; firstHost: string; lastHost: string;
  totalAddresses: number; usableHosts: number; ipClass: string; isPrivate: boolean;
}

export function parseIp(ip: string): number | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const v = Number(p);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n;
}

export const toIp = (n: number) => [24, 16, 8, 0].map((s) => (Math.floor(n / 2 ** s) % 256)).join(".");

// Unsigned 32-bit mask arithmetic without bitwise sign issues.
const maskOf = (prefix: number) => (prefix === 0 ? 0 : (2 ** 32 - 2 ** (32 - prefix)));

export function parseCidr(input: string): { ip: number; prefix: number } | null {
  const m = input.trim().match(/^([\d.]+)\s*\/\s*(\d{1,2})$/);
  if (!m) return null;
  const ip = parseIp(m[1]);
  const prefix = Number(m[2]);
  if (ip === null || prefix > 32) return null;
  return { ip, prefix };
}

export function subnetInfo(ip: number, prefix: number): SubnetInfo {
  const size = 2 ** (32 - prefix);
  const network = Math.floor(ip / size) * size;
  const broadcast = network + size - 1;
  // RFC 3021: /31 links use both addresses; /32 is a single host.
  const usable = prefix === 32 ? 1 : prefix === 31 ? 2 : size - 2;
  const first = prefix >= 31 ? network : network + 1;
  const last = prefix >= 31 ? broadcast : broadcast - 1;
  const firstOctet = Math.floor(ip / 2 ** 24);
  const ipClass = firstOctet < 128 ? "A" : firstOctet < 192 ? "B" : firstOctet < 224 ? "C" : firstOctet < 240 ? "D (multicast)" : "E (reserved)";
  const inRange = (base: string, bits: number) => {
    const b = parseIp(base)!;
    const s = 2 ** (32 - bits);
    return Math.floor(ip / s) * s === b;
  };
  return {
    address: toIp(ip), prefix,
    mask: toIp(maskOf(prefix)), wildcard: toIp(2 ** 32 - 1 - maskOf(prefix)),
    network: toIp(network), broadcast: toIp(broadcast),
    firstHost: toIp(first), lastHost: toIp(last),
    totalAddresses: size, usableHosts: usable, ipClass,
    isPrivate: inRange("10.0.0.0", 8) || inRange("172.16.0.0", 12) || inRange("192.168.0.0", 16),
  };
}

/** Split a network into 2^k equal subnets of the new prefix (capped for display). */
export function splitSubnet(ip: number, prefix: number, newPrefix: number, limit = 64): SubnetInfo[] {
  if (newPrefix < prefix || newPrefix > 32) return [];
  const base = Math.floor(ip / 2 ** (32 - prefix)) * 2 ** (32 - prefix);
  const step = 2 ** (32 - newPrefix);
  const count = Math.min(2 ** (newPrefix - prefix), limit);
  return Array.from({ length: count }, (_, i) => subnetInfo(base + i * step, newPrefix));
}
