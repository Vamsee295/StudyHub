import type { VisualMap } from "./types";

export const osCnMoreVisuals: VisualMap = {
  // ── Operating systems ──
  "os/types-of-operating-systems": {
    plain:
      "Operating systems are built for different jobs. Batch systems run queued jobs with no user present, time-sharing systems give many users the illusion of their own computer, real-time systems must meet hard deadlines (like airbag controllers), and distributed systems spread work over many machines.",
    diagram: `flowchart TB
  O["Operating systems"] --> B["Batch<br/>jobs queued, no interaction"]
  O --> T["Time-sharing<br/>many users, quick time slices"]
  O --> R["Real-time<br/>hard deadlines"]
  O --> D["Distributed<br/>many machines, one system"]
  O --> M["Mobile / embedded<br/>battery, small devices"]`,
    caption: "OS types by what they're designed for.",
  },
  "os/user-vs-kernel-threads": {
    plain:
      "User-level threads are managed by a library inside the program, so the kernel sees just one worker; if it blocks, all of them wait. Kernel threads are known to the OS, which can run them on different cores and keep others going when one blocks.",
    diagram: `flowchart TB
  subgraph ManyToOne["Many-to-one"]
    u1["U1"] --> k1["K"]
    u2["U2"] --> k1
    u3["U3"] --> k1
  end
  subgraph OneToOne["One-to-one (Linux, Windows)"]
    a1["U1"] --> b1["K1"]
    a2["U2"] --> b2["K2"]
  end`,
    caption: "Threading models: how user threads map to kernel threads.",
  },
  "os/multithreading-benefits-and-issues": {
    plain:
      "Concurrency is one cook switching between two dishes; parallelism is two cooks each making a dish at the same time. A thread pool is a fixed team of cooks taking orders from a queue, instead of hiring a new cook for every order.",
    diagram: `flowchart LR
  T[["task queue"]] --> W1["worker 1"]
  T --> W2["worker 2"]
  T --> W3["worker 3"]
  W1 --> D["done"]
  W2 --> D
  W3 --> D`,
    caption: "A thread pool reuses a fixed set of workers.",
  },
  "os/petersons-and-hardware-support": {
    plain:
      "Test-and-set is an atomic 'check the lock and grab it' in one unbreakable step, so two threads can't both see the lock free at the same moment. A spinlock just keeps trying until it gets it.",
    diagram: `flowchart TB
  A["TestAndSet(lock)<br/>returns old value, sets true atomically"] --> Q{"old value was false?"}
  Q -->|"yes"| C["got the lock: critical section"]
  Q -->|"no"| A
  C --> R["lock = false"]`,
    caption: "A spinlock built on an atomic instruction.",
  },
  "os/monitors-and-condition-variables": {
    plain:
      "A monitor is a room only one thread can be in at a time, with waiting benches inside (condition variables). A thread that can't continue sits on a bench with wait(), leaving the room free; another thread calls signal() when the condition might now hold.",
    diagram: `flowchart LR
  E["entry queue"] --> M["monitor<br/>one thread inside"]
  M -->|"wait(notEmpty)"| C["condition queue"]
  C -->|"signal(notEmpty)"| M`,
    caption: "Mutual exclusion plus waiting on conditions.",
  },
  "os/deadlock-detection-and-recovery": {
    plain:
      "Detection lets deadlocks happen, then looks for cycles in the wait-for graph and breaks them by killing or rolling back a process. Many OSes simply ignore deadlocks (the ostrich approach) because they're rare and prevention is costly.",
    diagram: `flowchart LR
  D["periodically build wait-for graph"] --> Q{"cycle found?"}
  Q -->|"no"| D
  Q -->|"yes"| R["recover: abort a process<br/>or preempt resources"]`,
    caption: "Detect, then recover.",
  },
  "os/multilevel-paging-segmentation": {
    plain:
      "A single page table for a big address space would be huge and mostly empty. Two-level paging is a table of tables: the outer table points to inner page tables, which are only created for regions actually in use.",
    diagram: `flowchart LR
  A["address: p1 · p2 · offset"] --> O["outer table [p1]"] --> I["inner table [p2]"] --> F["frame"] --> P["frame + offset"]`,
    caption: "Two-level page table lookup.",
  },
  "os/file-system-basics": {
    plain:
      "An inode is a file's ID card: it stores size, owner, permissions and pointers to the disk blocks holding the data, but not the name. A directory is just a list mapping names to inode numbers.",
    diagram: `flowchart LR
  D["directory: notes.txt → inode 42"] --> I["inode 42<br/>size · owner · permissions<br/>block pointers"]
  I --> B1["block 108"]
  I --> B2["block 109"]
  I --> B3["block 230"]`,
    caption: "Names live in directories; metadata and block lists in inodes.",
  },
  "os/io-systems-and-raid": {
    plain:
      "With DMA the CPU hands a whole transfer to a helper chip and gets on with other work; it's interrupted only once, when the transfer is done. Without it, the CPU would have to move every byte itself.",
    diagram: `sequenceDiagram
  participant CPU
  participant DMA as DMA controller
  participant Disk
  CPU->>DMA: copy 4 KB from disk to address X
  CPU->>CPU: runs other processes
  DMA->>Disk: read blocks
  Disk-->>DMA: data, written straight to memory
  DMA-->>CPU: interrupt: transfer complete`,
    caption: "Direct Memory Access frees the CPU during transfers.",
  },

  // ── Computer networks ──
  "computer-networks/transmission-media-and-switching": {
    plain:
      "Circuit switching reserves a whole lane for your call from start to end, like a phone line: guaranteed, but idle lanes are wasted. Packet switching chops data into packets that share the road with everyone else, like the postal system: efficient, but packets can queue.",
    diagram: `flowchart LR
  subgraph Circuit
    A1["A"] ==>|"reserved path"| B1["B"]
  end
  subgraph Packet
    A2["A"] -->|"p1"| R1["router"] --> B2["B"]
    A2 -->|"p2"| R2["router"] --> B2
  end`,
    caption: "A dedicated path versus shared, independently routed packets.",
  },
  "computer-networks/mac-protocols": {
    plain:
      "CSMA/CD is polite conversation on a shared line: listen first, talk if it's quiet, and if two people start together, both stop, wait a random time and try again. Wi-Fi can't hear collisions, so it uses CSMA/CA and tries to avoid them up front.",
    diagram: `flowchart TB
  L["sense the channel"] --> Q{"idle?"}
  Q -->|"no"| L
  Q -->|"yes"| T["transmit"]
  T --> C{"collision?"}
  C -->|"no"| D["done"]
  C -->|"yes"| J["send jam, random backoff"] --> L`,
    caption: "CSMA/CD as used by classic Ethernet.",
  },
  "computer-networks/ethernet-switching-vlans": {
    plain:
      "A switch learns who lives where by reading the sender's MAC address on every frame and noting the port it came from. Frames for a known address go only to that port; unknown ones are flooded to all ports until it learns.",
    diagram: `flowchart LR
  F["frame from AA:01 on port 1"] --> S["switch table<br/>AA:01 → port 1<br/>BB:02 → port 3"]
  S -->|"to BB:02"| P3["port 3 only"]`,
    caption: "Switch learning by source MAC address.",
  },
  "computer-networks/ipv6": {
    plain:
      "IPv4's 4.3 billion addresses ran out. IPv6 uses 128-bit addresses, written as eight groups of hex, enough to give every grain of sand its own address. Runs of zeros can be shortened with ::, once per address.",
    diagram: `flowchart LR
  A["2001:0db8:0000:0000:0000:0000:0000:0001"] -->|"drop leading zeros, :: once"| B["2001:db8::1"]`,
    caption: "Writing an IPv6 address in short form.",
  },
  "computer-networks/supernetting-longest-prefix": {
    plain:
      "When several routes match an address, the router picks the most specific one, the longest matching prefix, like a postman preferring a street address over just the city. Aggregation does the reverse: merges neighbouring routes into one shorter prefix.",
    diagram: `flowchart TB
  D["destination 192.168.1.37"] --> A["192.168.0.0/16 matches"]
  D --> B["192.168.1.0/24 matches"]
  D --> C["192.168.1.32/27 matches ✓ longest"]`,
    caption: "Longest prefix match wins.",
  },
  "computer-networks/email-ftp-websockets": {
    plain:
      "Email uses different protocols for sending and reading. SMTP pushes mail from your app to your server and between servers; IMAP (or POP3) lets the recipient's app read it from their server.",
    diagram: `flowchart LR
  A["Alice's app"] -->|"SMTP"| S1["Alice's mail server"] -->|"SMTP"| S2["Bob's mail server"] -->|"IMAP / POP3"| B["Bob's app"]`,
    caption: "Push with SMTP, pull with IMAP or POP3.",
  },
  "computer-networks/cryptography-basics": {
    plain:
      "Symmetric encryption uses one shared key, like a house key copied for two people: fast, but how do you hand over the key safely? Asymmetric uses a pair: anyone can lock with your public key, only your private key unlocks. TLS uses asymmetric to agree a key, then symmetric for speed.",
    diagram: `flowchart TB
  subgraph Symmetric
    P1["plaintext"] -->|"shared key"| C1["ciphertext"] -->|"same key"| P2["plaintext"]
  end
  subgraph Asymmetric
    P3["plaintext"] -->|"Bob's public key"| C2["ciphertext"] -->|"Bob's private key"| P4["plaintext"]
  end`,
    caption: "One shared key versus a public/private key pair.",
  },
};
