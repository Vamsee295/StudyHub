// Core CS practice banks (authored MCQs), keyed by course then lesson.
import type { Level } from "./core";
import { DBMS, type CsItem } from "./cs-dbms";
import { OS } from "./cs-os";
import { CN } from "./cs-cn";
import { OOP } from "./cs-oop";
import { SQL } from "./cs-sql";

export const CS_BANKS: Record<string, Record<string, CsItem[]>> = { dbms: DBMS, os: OS, "computer-networks": CN, oop: OOP, sql: SQL };

const lv = (i: number, n: number): Level => (i < n / 3 ? "Easy" : i < (2 * n) / 3 ? "Medium" : "Hard");
export const csBank = (items: CsItem[]) => items.map(([q, c, w1, w2, w3, e], i) => ({ level: lv(i, items.length), q, o: [c, w1, w2, w3], e }));
