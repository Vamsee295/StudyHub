import type { VisualMap } from "./types";

const c = "os";

export const osVisuals: VisualMap = {
  [`${c}/what-is-an-os`]: {
    plain:
      "The operating system is the manager of a busy restaurant. The hardware is the kitchen; programs are customers. The OS decides who gets the stove when, keeps customers out of each other's food, and gives everyone a simple menu (system calls) instead of letting them walk into the kitchen.",
    diagram: `flowchart TB
  U["Users"] --> A["Applications<br/>browser · IDE · games"]
  A -->|"system calls"| O["Operating system<br/>processes · memory · files · devices"]
  O --> H["Hardware<br/>CPU · RAM · disk · network"]`,
    caption: "The OS sits between programs and hardware.",
  },
  [`${c}/system-calls`]: {
    plain:
      "A program can't touch hardware directly. To read a file it makes a system call: a formal request that switches the CPU into kernel mode, lets the OS do the work safely, then switches back. Like ringing the bell at a bank counter instead of walking into the vault.",
    diagram: `sequenceDiagram
  participant P as Program (user mode)
  participant K as Kernel
  participant D as Disk
  P->>K: read(file) system call, trap into kernel mode
  K->>D: issue disk read
  D-->>K: data
  K-->>P: copy data, return to user mode`,
    caption: "A system call crosses from user mode into kernel mode and back.",
  },
  [`${c}/kernel-architectures`]: {
    plain:
      "A monolithic kernel puts everything (file systems, drivers, scheduling) in one big program: fast, but one buggy driver can crash it all. A microkernel keeps only the essentials inside and runs the rest as separate services: safer, but with more messaging overhead.",
    diagram: `flowchart LR
  subgraph Monolithic["Monolithic (Linux)"]
    M["scheduler + memory + FS + drivers<br/>all in kernel space"]
  end
  subgraph Micro["Microkernel (QNX, Minix)"]
    K["tiny kernel: IPC, scheduling"]
    S1["FS server"] --> K
    S2["driver server"] --> K
  end`,
    caption: "Everything inside the kernel, or a tiny kernel plus services.",
  },
  [`${c}/process-and-pcb`]: {
    plain:
      "A program is a recipe on a shelf; a process is someone actually cooking it right now, with ingredients out and a place in the recipe. The OS keeps a file card for each process, the PCB, recording its state, registers, memory and open files.",
    diagram: `flowchart LR
  P["Process"] --> PCB["PCB<br/>PID · state<br/>program counter · registers<br/>memory info · open files<br/>priority"]`,
    caption: "The Process Control Block is the OS's record of a process.",
  },
  [`${c}/process-states-and-schedulers`]: {
    plain:
      "A process waits in line (ready), gets the CPU (running), and may have to stop to wait for something like a disk read (waiting), after which it rejoins the line. It moves between these states many times before it finishes.",
    diagram: `stateDiagram-v2
  [*] --> New
  New --> Ready: admitted
  Ready --> Running: scheduler dispatch
  Running --> Ready: interrupt / time slice over
  Running --> Waiting: I/O or event wait
  Waiting --> Ready: I/O done
  Running --> Terminated: exit
  Terminated --> [*]`,
    caption: "The five-state process model.",
  },
  [`${c}/context-switching`]: {
    plain:
      "A context switch is a chef switching between two orders: save exactly where you were on order A (its PCB), load where you left off on order B, carry on. It's pure overhead, no cooking happens during the switch, so switching too often wastes time.",
    diagram: `sequenceDiagram
  participant A as Process A
  participant OS as OS
  participant B as Process B
  A->>OS: interrupt / time slice ends
  OS->>OS: save A's registers into PCB A
  OS->>OS: load B's registers from PCB B
  OS->>B: resume B
  Note over OS: no useful work during the switch`,
    caption: "Save one process's state, restore another's.",
  },
  [`${c}/process-creation-fork`]: {
    plain:
      "fork() makes a near-identical copy of the running process. Both continue from the same line, but fork returns 0 in the child and the child's PID in the parent, so each knows which one it is. Two forks in a row make four processes.",
    diagram: `flowchart TB
  P["Parent (PID 100)"] -->|"fork()"| P2["Parent continues<br/>fork returned 101"]
  P -->|"fork()"| C["Child (PID 101)<br/>fork returned 0"]`,
    caption: "One call, two processes, two different return values.",
  },
  [`${c}/inter-process-communication`]: {
    plain:
      "Processes have separate memory, so to cooperate they need a channel. Shared memory is a whiteboard both can write on (fast, needs coordination). Message passing is sending notes through the OS (simpler, slower).",
    diagram: `flowchart LR
  subgraph Shared["Shared memory"]
    A1["Process A"] --> M[("shared region")]
    B1["Process B"] --> M
  end
  subgraph Msg["Message passing"]
    A2["Process A"] -->|"send"| K["kernel queue"] -->|"receive"| B2["Process B"]
  end`,
    caption: "Two ways for processes to talk.",
  },
  [`${c}/threads-vs-processes`]: {
    plain:
      "A process is a house; threads are the people living in it. They share the kitchen and living room (code, data, open files) but each has their own diary (stack and registers). Starting a new person is cheaper than building a new house.",
    diagram: `flowchart TB
  subgraph Process
    S["shared: code · heap · files"]
    T1["Thread 1<br/>stack + registers"]
    T2["Thread 2<br/>stack + registers"]
    T3["Thread 3<br/>stack + registers"]
  end`,
    caption: "Threads share the process's memory but have their own stacks.",
  },
  [`${c}/scheduling-criteria`]: {
    plain:
      "Schedulers are judged on a few numbers: how busy the CPU stays, how many jobs finish per second, and from each job's view, turnaround (submit to finish), waiting (time in the ready queue) and response (submit to first run).",
    diagram: `flowchart LR
  A["Arrival"] -->|"waiting"| S["First run (response)"] --> R["…runs and waits…"] --> C["Completion"]
  A -.->|"turnaround = completion − arrival"| C`,
    caption: "Turnaround = waiting + burst; waiting = turnaround − burst.",
  },
  [`${c}/fcfs-sjf-srtf`]: {
    plain:
      "FCFS serves jobs in arrival order, like a single bank queue: simple, but one long job holds everyone up (the convoy effect). SJF picks the shortest job next, which gives the lowest average waiting time, if you know job lengths.",
    diagram: `gantt
  title FCFS: P1 (burst 8), P2 (4), P3 (2), all arrive at 0
  dateFormat X
  axisFormat %s
  section CPU
  P1 :0, 8
  P2 :8, 12
  P3 :12, 14`,
    caption: "FCFS order: average waiting = (0 + 8 + 12) / 3 ≈ 6.7. SJF would order P3, P2, P1 for ≈ 2.7.",
  },
  [`${c}/round-robin-and-priority`]: {
    plain:
      "Round robin gives each job a fixed time slice, like passing a microphone around a circle: talk for 2 seconds, then the next person. Nobody waits forever, so it feels responsive, but tiny slices waste time switching.",
    diagram: `gantt
  title Round robin, quantum = 2: P1 (5), P2 (3), P3 (1)
  dateFormat X
  axisFormat %s
  section CPU
  P1 :0, 2
  P2 :2, 4
  P3 :4, 5
  P1 :5, 7
  P2 :7, 8
  P1 :8, 9`,
    caption: "Each process runs at most 2 units, then goes to the back of the queue.",
  },
  [`${c}/multilevel-queue-scheduling`]: {
    plain:
      "A multilevel queue is a hospital with separate lines: emergencies first, then appointments, then walk-ins. Each line can have its own rule. The feedback version moves a job down a line if it keeps using its whole slice, so quick interactive jobs stay at the front.",
    diagram: `flowchart TB
  Q0["Queue 0 · RR q=8 · highest priority"] --> Q1["Queue 1 · RR q=16"] --> Q2["Queue 2 · FCFS · lowest"]
  Q0 -.->|"used whole slice → demote"| Q1`,
    caption: "Multilevel feedback queue: CPU-heavy jobs sink, interactive ones stay up.",
  },
  [`${c}/race-conditions-critical-section`]: {
    plain:
      "Two people editing the same shared document line at the same moment can each overwrite the other's change. In code, two threads both doing count++ can lose an update. The fix is a critical section: only one thread at a time may run that code.",
    diagram: `sequenceDiagram
  participant T1 as Thread 1
  participant M as count (= 5)
  participant T2 as Thread 2
  T1->>M: read 5
  T2->>M: read 5
  T1->>M: write 6
  T2->>M: write 6
  Note over M: two increments, but count is 6, not 7`,
    caption: "A lost update: both threads read the old value.",
  },
  [`${c}/mutex-and-semaphores`]: {
    plain:
      "A mutex is the single key to a bathroom: whoever holds it goes in, everyone else waits. A counting semaphore is a car park with N spaces and a counter at the gate: cars enter while spaces remain, and wait when the counter hits zero.",
    diagram: `flowchart LR
  W["wait(S)<br/>S = S − 1, block if S < 0"] --> CS["critical section"] --> SG["signal(S)<br/>S = S + 1, wake a waiter"]`,
    caption: "wait before entering, signal when leaving.",
  },
  [`${c}/classic-synchronization-problems`]: {
    plain:
      "Producer-consumer is a bakery shelf with limited space: bakers must wait when it's full, customers must wait when it's empty, and only one person should rearrange the shelf at a time. Three semaphores handle it: empty slots, full slots and a mutex.",
    diagram: `flowchart LR
  P["Producer"] -->|"wait(empty), wait(mutex)<br/>add item<br/>signal(mutex), signal(full)"| B[("Bounded buffer")]
  B -->|"wait(full), wait(mutex)<br/>remove item<br/>signal(mutex), signal(empty)"| C["Consumer"]`,
    caption: "Bounded buffer with empty, full and mutex semaphores.",
  },
  [`${c}/deadlock-conditions`]: {
    plain:
      "Deadlock is four cars at a four-way junction, each waiting for the car on its right. It needs all four conditions at once: exclusive resources, holding while waiting, no taking things away by force, and a circle of waiting. Break any one and deadlock can't happen.",
    diagram: `flowchart LR
  P1((P1)) -->|"waits for"| R2["R2"]
  R2 -->|"held by"| P2((P2))
  P2 -->|"waits for"| R1["R1"]
  R1 -->|"held by"| P1`,
    caption: "A resource allocation graph with a cycle: deadlock.",
  },
  [`${c}/deadlock-prevention-and-avoidance`]: {
    plain:
      "Banker's algorithm is a careful bank manager: before lending, they check there is still some order in which every customer could finish and repay. If granting a request could leave no such order (an unsafe state), the customer must wait.",
    diagram: `flowchart TB
  R["process requests resources"] --> Q{"pretend to grant:<br/>is there a safe sequence?"}
  Q -->|"yes"| G["grant"]
  Q -->|"no"| W["make it wait"]`,
    caption: "Banker's algorithm only grants requests that keep the system safe.",
  },
  [`${c}/logical-vs-physical-addresses`]: {
    plain:
      "Every program thinks its memory starts at address 0, like every flat numbering its rooms from 1. The MMU translates each program's logical address into the real physical address in RAM, so programs can't see or damage each other's memory.",
    diagram: `flowchart LR
  CPU["CPU: logical address 346"] --> MMU["MMU<br/>+ relocation 14000"] --> RAM["physical address 14346"]`,
    caption: "The MMU maps logical addresses to physical ones.",
  },
  [`${c}/contiguous-allocation-fragmentation`]: {
    plain:
      "If each program needs one unbroken block of memory, free space ends up as scattered small gaps, like parking where cars left gaps too small for a bus. That's external fragmentation. Paging avoids it by not needing one big block.",
    diagram: `flowchart LR
  A["OS"] --- B["P1 · 100 KB"] --- F1["free 30 KB"] --- C["P2 · 200 KB"] --- F2["free 40 KB"] --- D["P3 · 80 KB"] --- F3["free 20 KB"]`,
    caption: "90 KB free in total, but a 60 KB process can't fit in any single gap.",
  },
  [`${c}/paging-and-tlb`]: {
    plain:
      "Paging chops a program into equal pages and RAM into equal frames, so any page can go in any free frame, like a book whose chapters are shelved wherever there's space, with a table saying where each one went. The TLB is a small fast cache of recent lookups.",
    diagram: `flowchart LR
  L["logical address<br/>page 2 · offset 100"] --> T{"TLB hit?"}
  T -->|"yes"| F["frame 7"]
  T -->|"no"| PT["page table<br/>page 2 → frame 7"] --> F
  F --> P["physical address<br/>frame 7 · offset 100"]`,
    caption: "Page number is translated; the offset is carried across unchanged.",
  },
  [`${c}/demand-paging-page-faults`]: {
    plain:
      "With demand paging, a program's pages are only loaded when first used, like a library fetching a book from storage only when someone asks for it. Touching a page that isn't in RAM causes a page fault: the OS fetches it from disk and retries.",
    diagram: `sequenceDiagram
  participant P as Process
  participant M as MMU
  participant OS as OS
  participant D as Disk
  P->>M: access page 5
  M->>OS: page fault (not in RAM)
  OS->>D: read page 5
  D-->>OS: page data
  OS->>M: update page table
  M-->>P: retry the instruction`,
    caption: "Handling a page fault.",
  },
  [`${c}/page-replacement-algorithms`]: {
    plain:
      "When RAM is full and a new page is needed, one page must go. FIFO evicts the oldest, LRU evicts the one unused for longest, and Optimal evicts the one needed furthest in the future (impossible in practice, but the yardstick for the others).",
    diagram: `flowchart LR
  N["need page 4, RAM full<br/>[7, 0, 1]"] --> F["FIFO: evict 7 (oldest)"]
  N --> L["LRU: evict least recently used"]
  N --> O["Optimal: evict page used furthest ahead"]`,
    caption: "Three ways to pick a victim page.",
  },
  [`${c}/thrashing-and-working-set`]: {
    plain:
      "Thrashing is a desk too small for the books you need: you spend all your time swapping books on and off the desk and never actually read. When processes don't have enough frames, they page-fault constantly and CPU use collapses.",
    diagram: `flowchart LR
  A["more processes"] --> B["fewer frames each"] --> C["more page faults"] --> D["CPU waits on disk"] --> E["OS adds more processes<br/>(sees idle CPU)"] --> B`,
    caption: "The thrashing spiral.",
  },
  [`${c}/disk-scheduling`]: {
    plain:
      "The disk head is a lift serving floor requests. FCFS goes in request order and zig-zags a lot. SCAN goes all the way one direction then back, like a real lift, which cuts the total travel a lot.",
    diagram: `flowchart LR
  S["head at 53 · requests 98 183 37 122 14 124 65 67"] --> F["FCFS: 53→98→183→37→… total 640"]
  S --> SC["SCAN up: 53→65→67→98→122→124→183→end→37→14"]`,
    caption: "Same requests, very different head movement.",
  },
};
