// Self-check for lab logic against textbook examples. Usage: npx tsx scripts/check-labs.ts
import assert from "node:assert/strict";
import { schedule, Proc } from "../lib/labs/scheduling";
import { simulatePaging } from "../lib/labs/paging";
import { parseCidr, subnetInfo, splitSubnet } from "../lib/labs/subnet";
import { estimate } from "../lib/labs/estimate";

const near = (a: number, b: number, msg: string) => assert.ok(Math.abs(a - b) < 1e-9, `${msg}: got ${a}, want ${b}`);
const P = (rows: [string, number, number, number?][]): Proc[] => rows.map(([id, arrival, burst, priority = 0]) => ({ id, arrival, burst, priority }));

// Silberschatz: bursts 24, 3, 3 at time 0
const convoy = P([["P1", 0, 24], ["P2", 0, 3], ["P3", 0, 3]]);
near(schedule(convoy, "FCFS").avgWaiting, 17, "FCFS convoy");
near(schedule(convoy, "SJF").avgWaiting, 3, "SJF");
near(schedule(convoy, "RR", 4).avgWaiting, 17 / 3, "RR q=4");
// SRTF example: (0,8) (1,4) (2,9) (3,5) -> 6.5
near(schedule(P([["P1", 0, 8], ["P2", 1, 4], ["P3", 2, 9], ["P4", 3, 5]]), "SRTF").avgWaiting, 6.5, "SRTF");
// Non-preemptive priority: bursts 10,1,2,1,5, priorities 3,1,4,5,2 -> 8.2
near(schedule(P([["P1", 0, 10, 3], ["P2", 0, 1, 1], ["P3", 0, 2, 4], ["P4", 0, 1, 5], ["P5", 0, 5, 2]]), "PRIORITY").avgWaiting, 8.2, "Priority");
// Idle gap is shown in the Gantt chart
const gap = schedule(P([["A", 0, 2], ["B", 5, 1]]), "FCFS");
assert.deepEqual(gap.gantt, [{ id: "A", start: 0, end: 2 }, { id: null, start: 2, end: 5 }, { id: "B", start: 5, end: 6 }]);

// Page replacement on the classic string with 3 frames: FIFO 15, LRU 12, OPT 9
const refs = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
assert.equal(simulatePaging(refs, 3, "FIFO").faults, 15);
assert.equal(simulatePaging(refs, 3, "LRU").faults, 12);
assert.equal(simulatePaging(refs, 3, "OPT").faults, 9);
// Belady's anomaly: FIFO gets 9 faults with 3 frames but 10 with 4
const belady = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
assert.equal(simulatePaging(belady, 3, "FIFO").faults, 9);
assert.equal(simulatePaging(belady, 4, "FIFO").faults, 10);

// Subnets
const c = parseCidr("192.168.10.77/27")!;
const s = subnetInfo(c.ip, c.prefix);
assert.deepEqual([s.network, s.broadcast, s.firstHost, s.lastHost, s.mask, s.usableHosts], ["192.168.10.64", "192.168.10.95", "192.168.10.65", "192.168.10.94", "255.255.255.224", 30]);
assert.equal(s.isPrivate, true);
assert.equal(subnetInfo(parseCidr("10.0.5.0/23")!.ip, 23).broadcast, "10.0.5.255");
assert.equal(subnetInfo(parseCidr("8.8.8.8/32")!.ip, 32).usableHosts, 1);
assert.equal(subnetInfo(parseCidr("10.0.0.0/31")!.ip, 31).usableHosts, 2);
assert.equal(subnetInfo(parseCidr("0.0.0.0/0")!.ip, 0).mask, "0.0.0.0");
assert.equal(parseCidr("300.1.1.1/24"), null);
assert.deepEqual(splitSubnet(parseCidr("192.168.0.0/24")!.ip, 24, 26).map((x) => x.network), ["192.168.0.0", "192.168.0.64", "192.168.0.128", "192.168.0.192"]);

// Estimates: 10M DAU x 50 reads -> about 5,787 reads/s
const e = estimate({ dau: 1e7, readsPerUser: 50, writesPerUser: 0.2, writeSizeKB: 1000, readSizeKB: 200, retentionYears: 1, replication: 1, peakFactor: 3, rpsPerServer: 2000 });
assert.ok(Math.abs(e.readQps - 5787.037) < 0.01);
assert.equal(e.storagePerDayBytes, 2e12); // 2 TB/day
assert.ok(e.servers >= 2);

console.log("lab checks passed");
