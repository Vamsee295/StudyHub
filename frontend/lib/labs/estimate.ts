// Back-of-the-envelope capacity estimator for system design.
export interface EstimateInput {
  dau: number;              // daily active users
  readsPerUser: number;     // reads per user per day
  writesPerUser: number;    // writes per user per day
  writeSizeKB: number;      // stored bytes per write, in KB
  readSizeKB: number;       // response size per read, in KB
  retentionYears: number;
  replication: number;      // copies stored
  peakFactor: number;       // peak / average
  rpsPerServer: number;     // capacity of one app server
}

export interface EstimateResult {
  readQps: number; writeQps: number; peakQps: number;
  storagePerDayBytes: number; totalStorageBytes: number;
  peakEgressBitsPerSec: number; servers: number;
}

const SECONDS_PER_DAY = 86_400;

export function estimate(i: EstimateInput): EstimateResult {
  const readQps = (i.dau * i.readsPerUser) / SECONDS_PER_DAY;
  const writeQps = (i.dau * i.writesPerUser) / SECONDS_PER_DAY;
  const peakQps = (readQps + writeQps) * i.peakFactor;
  const storagePerDayBytes = i.dau * i.writesPerUser * i.writeSizeKB * 1000;
  const totalStorageBytes = storagePerDayBytes * 365 * i.retentionYears * i.replication;
  const peakEgressBitsPerSec = readQps * i.peakFactor * i.readSizeKB * 1000 * 8;
  // ponytail: assumes uniform requests; real sizing adds headroom per endpoint cost. 1.5x headroom, min 2 for redundancy.
  const servers = Math.max(2, Math.ceil((peakQps / Math.max(1, i.rpsPerServer)) * 1.5));
  return { readQps, writeQps, peakQps, storagePerDayBytes, totalStorageBytes, peakEgressBitsPerSec, servers };
}

export function formatBytes(b: number): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
  let u = 0;
  while (b >= 1000 && u < units.length - 1) { b /= 1000; u++; }
  return `${b >= 100 ? b.toFixed(0) : b >= 10 ? b.toFixed(1) : b.toFixed(2)} ${units[u]}`;
}

export function formatBits(b: number): string {
  const units = ["bit/s", "Kbit/s", "Mbit/s", "Gbit/s", "Tbit/s"];
  let u = 0;
  while (b >= 1000 && u < units.length - 1) { b /= 1000; u++; }
  return `${b >= 100 ? b.toFixed(0) : b >= 10 ? b.toFixed(1) : b.toFixed(2)} ${units[u]}`;
}

export function formatCount(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n >= 10 ? n.toFixed(0) : n.toFixed(1);
}
