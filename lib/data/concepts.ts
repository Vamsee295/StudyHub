import { Concept } from "@/types";

export const concepts: Concept[] = [
  {
    key: "polymorphism",
    title: "Polymorphism",
    simple:
      "Different classes responding to the same method call, each in their own way, behind one unified interface.",
    analogy:
      "A universal remote's single Power button turns on a TV, an AC, or a soundbar. The remote sends one generic signal, but each device runs its own boot sequence in response.",
    interview:
      "Separate the two types clearly: overloading is resolved at compile time via static binding, overriding is resolved at runtime via dynamic dispatch. Mentioning that the runtime looks up the subclass implementation through a virtual method table shows you understand the mechanism, not just the vocabulary.",
    mistake:
      "Confusing overloading with overriding. Overriding needs the exact same method signature, can't narrow access permissions, and static methods can't be overridden — only hidden.",
    related: ["Inheritance", "Dynamic Dispatch", "Method Overriding", "Abstraction"],
  },
  {
    key: "acid",
    title: "ACID Transactions",
    simple:
      "Four guarantees — atomicity, consistency, isolation, durability — that keep database transactions reliable even through a crash.",
    analogy:
      "An ATM withdrawal debits your balance and dispenses cash. If power fails mid-transaction, both actions roll back together — you're never left with a debited balance and no cash.",
    interview:
      "Walk through each letter: atomicity via undo logs, consistency as maintained invariants, isolation as transactions not seeing uncommitted data, durability as committed data surviving a crash via redo logs.",
    mistake:
      "Treating isolation as absolute. There are distinct isolation levels — read uncommitted, read committed, repeatable read, serializable — and each permits different anomalies like dirty or phantom reads.",
    related: ["Transactions", "Write-Ahead Log", "Isolation Levels", "MVCC"],
  },
  {
    key: "deadlock",
    title: "Deadlock",
    simple:
      "A set of processes are all blocked because each is holding a resource the next one needs.",
    analogy:
      "Two cars meet head-on on a single-lane bridge. Neither can move forward, and neither will back up first.",
    interview:
      "Name the four necessary conditions — mutual exclusion, hold-and-wait, no preemption, circular wait — then explain that breaking just one, usually circular wait via strict resource ordering, prevents deadlock entirely.",
    mistake:
      "Confusing deadlock with livelock or starvation. In deadlock, processes are fully inactive; in livelock they keep changing state in response to each other without making progress.",
    related: ["Race Condition", "Mutex", "Starvation", "Resource Ordering"],
  },
  {
    key: "dns",
    title: "DNS Lookup Cycle",
    simple:
      "The internet's distributed phonebook, converting a hostname like example.com into a machine IP address.",
    analogy:
      "Asking a librarian for a book. The front desk points you to a wing, the wing desk points you to a shelf, and the shelf has the exact copy you need.",
    interview:
      "Trace the chain: browser cache, OS cache, the ISP's recursive resolver, the root server, the TLD server, and finally the authoritative name server that returns the actual record with its TTL.",
    mistake:
      "Forgetting that caching happens at multiple layers at once — browser, OS and resolver — which is usually why a DNS change takes time to actually propagate.",
    related: ["TCP Handshake", "TTL", "Resolvers", "HTTPS"],
  },
];
