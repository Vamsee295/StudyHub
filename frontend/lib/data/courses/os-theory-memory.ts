// Long-form theory for OS modules 7-9 (memory management, virtual memory, file and I/O systems). Original writing.
import { LessonTheory } from './utils';

const OSTEP = { title: "Operating Systems: Three Easy Pieces (Arpaci-Dusseau), free online", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" };
const LINUX_MM = { title: "Linux kernel documentation: Memory Management", url: "https://docs.kernel.org/mm/index.html", license: "GPL-2.0" };
const LINUX_FS = { title: "Linux kernel documentation: Filesystems", url: "https://docs.kernel.org/filesystems/index.html", license: "GPL-2.0" };
const MIT_6S081 = { title: "MIT 6.1810 Operating System Engineering (xv6 notes and labs)", url: "https://pdos.csail.mit.edu/6.1810/" };
const DENNING_WS = { title: "Peter Denning, The Working Set Model for Program Behavior (1968)", url: "https://dl.acm.org/doi/10.1145/363095.363141" };
const RAID_PAPER = { title: "Patterson, Gibson, Katz, A Case for Redundant Arrays of Inexpensive Disks (RAID) (1988)", url: "https://dl.acm.org/doi/10.1145/50202.50214" };

export const osMemoryTheory: Record<string, LessonTheory> = {
  "logical-vs-physical-addresses": {
    theory: `Every address your program uses is an illusion. The CPU generates logical addresses, and hardware called the memory management unit (MMU) translates each one into a physical address in RAM. That translation is what lets every process believe it owns memory starting at zero, and what keeps processes out of each other's memory. This lesson explains address binding, logical versus physical addresses, and the base-and-limit scheme that introduces relocation and protection.

## Two kinds of address

A **logical address** (also called a virtual address) is what the CPU produces when a program reads or writes memory. Each process has its own logical address space, typically starting at 0. A **physical address** is a real location in RAM chips.

When two processes both access logical address 1000, they reach different physical locations, because the OS sets up a different translation for each. That's the foundation of process isolation.

## When addresses get bound

A program refers to memory symbolically, such as a variable named \`total\`. At some point, those names must become concrete addresses. That step is **address binding**, and it can happen at three times:

| Binding time | How | Can the process move? |
|---|---|---|
| Compile time | The compiler writes absolute addresses into the code | No; it must load at that exact spot |
| Load time | Addresses are fixed when the loader places the program in memory | Not after loading |
| Execution time | Hardware translates every access as the program runs | Yes, at any time |

Early systems used compile-time binding, which meant a program could only run at one location. Modern systems bind at execution time, which is what makes paging, swapping and memory sharing possible.

## The memory management unit

The MMU is hardware between the CPU and memory that translates every logical address to a physical one, on every access. Software can't afford to do this, because a program makes billions of memory accesses per second. The OS's job is to set up the MMU's translation information for each process and switch it during context switches.

## Base and limit registers

The simplest MMU uses two registers per running process:

- **Base (relocation) register**: the physical address where the process's memory starts
- **Limit register**: the size of the process's memory

On every access, the hardware checks that the logical address is less than the limit, then adds the base:

~~~text
if logical >= limit: trap to the OS (addressing error)
physical = base + logical
~~~

With base 14000 and limit 3000, logical address 346 becomes physical 14346, and logical address 3500 causes a trap, because it's outside the process's memory.

## Relocation and protection together

Base and limit registers give two features at once. **Relocation**: the OS can load a process anywhere, or move it later, by changing the base register, without changing the program. **Protection**: the limit check stops a process from reading or writing outside its region, whether by bug or by design.

Only the kernel may change the base and limit registers. If user code could set them, a program could point its base at another process's memory, so loading them is a privileged instruction.

## The limits of a single base and limit

Giving each process one contiguous region has costs, which the next lessons address. Free memory gets broken into scattered holes as processes come and go (external fragmentation). A process can't easily grow, because the memory after it may be in use. And processes can't share memory selectively, such as a common library. Paging and segmentation replace the single base and limit with finer-grained translation that solves all three.

## Seeing addresses in practice

You can watch logical addresses on a real system. On Linux, printing the address of a local variable in two copies of the same program often shows identical values, because each process has its own address space. Address space layout randomization (ASLR) shifts those addresses between runs, making it harder for attackers to predict where code and data live. Running \`cat /proc/self/maps\` lists the regions of the current process's address space.

## How interviewers test this

Expect "Logical vs physical address", "What does the MMU do?" and a base-and-limit calculation. Explain that the CPU generates logical addresses and the MMU translates them on every access, then show base + logical with the limit check. Mentioning that execution-time binding is what allows processes to move shows you understand why the design matters.`,
    sources: [OSTEP, MIT_6S081, LINUX_MM]
  },

  "contiguous-allocation-fragmentation": {
    theory: `Contiguous allocation gives each process one continuous block of physical memory. It's the most direct way to share memory between processes, and it teaches the central problem of memory management: fragmentation, where free memory exists but can't be used. This lesson explains fixed and variable partitioning, the first-fit, best-fit and worst-fit strategies, the two kinds of fragmentation, and why paging replaced contiguous allocation.

## Fixed partitioning

The earliest approach divides memory into fixed-size partitions at boot, say four partitions of 8 MB. Each process gets one partition. A 3 MB process in an 8 MB partition wastes 5 MB that nobody else can use. That waste inside an allocated block is **internal fragmentation**. Fixed partitioning also caps both the number of processes and the size of each one.

## Variable partitioning

Variable partitioning gives each process exactly the memory it requests. Memory starts as one large free block, called a hole. As processes arrive, the OS carves blocks out of holes; as they exit, their blocks become holes again, merging with neighbouring holes when possible.

Over time, memory becomes a patchwork of allocated blocks and holes of many sizes. The OS needs a policy for which hole to use for each request.

## Fit strategies

Three classic strategies choose a hole for a request:

- **First fit**: scan the holes in order and take the first one large enough. It's fast, because it stops early
- **Best fit**: take the smallest hole that's large enough. It preserves large holes but leaves tiny leftover slivers
- **Worst fit**: take the largest hole, hoping the leftover is still large enough to be useful. Simulations show it usually performs worst

Using the course's example (holes of 100, 500, 200, 300 and 600 KB, and requests of 212, 417, 112 and 426 KB), best fit satisfies all four requests, while first fit and worst fit both leave the 426 KB request waiting. Studies across many workloads show first fit and best fit perform similarly in memory use, and first fit is faster.

## External fragmentation

Variable partitioning avoids internal fragmentation and introduces **external fragmentation**: enough total free memory exists for a request, but it's split into holes, none large enough. You might have 500 KB free in total but no hole larger than 150 KB, so a 200 KB request fails.

The 50-percent rule describes how bad this gets: with first fit, for every N allocated blocks, about 0.5N blocks are lost to fragmentation, so roughly a third of memory can become unusable.

## Compaction

Compaction moves allocated blocks together so all free space becomes one large hole. It needs execution-time address binding, because every moved process must keep running with new physical addresses, which base registers make possible. It's expensive: the system copies large amounts of memory and pauses processes while doing it. Compaction treats the symptom rather than the cause.

## Internal versus external fragmentation

| | Internal | External |
|---|---|---|
| Where the waste is | Inside an allocated block | Between allocated blocks |
| Caused by | Fixed-size units larger than needed | Variable-size allocation over time |
| Example | A 4 KB page holding 1 KB in a process's last page | 500 KB free in total, but no hole over 150 KB |
| Fix | Smaller allocation units | Compaction, or non-contiguous allocation |

## Why paging won

The root cause of external fragmentation is the requirement that a process's memory be contiguous. Paging removes that requirement: memory is divided into equal fixed-size frames, and a process's pages can occupy any free frames, in any order. Any free frame can satisfy any page request, so external fragmentation disappears. The price is a small amount of internal fragmentation, averaging half a page per process, which is a far better trade.

## Fragmentation beyond the OS

The same ideas apply inside programs. The \`malloc\` allocator in the C library manages a heap with holes, uses fit strategies, and suffers external fragmentation in long-running programs. Allocators such as jemalloc and tcmalloc group objects by size class to reduce it, which is a form of fixed-size allocation chosen deliberately.

## How interviewers test this

Exams give a list of holes and requests and ask which strategy satisfies all requests. Track the leftover sizes after each allocation. Interviewers ask "Internal vs external fragmentation" and "How does paging solve external fragmentation?" Answer that any frame can hold any page, so there are no unusable holes between allocations.`,
    sources: [OSTEP, LINUX_MM]
  },

  "paging-and-tlb": {
    theory: `Paging divides a process's logical memory into fixed-size pages and physical memory into frames of the same size, so any page can sit in any free frame. It eliminates external fragmentation and is the basis of memory management in every modern OS. This lesson explains how addresses are split and translated, how big page tables get, and how the translation lookaside buffer (TLB) makes translation fast enough to use.

## Pages and frames

Logical memory is divided into **pages**, and physical memory into **frames**, both of the same size, typically 4 KB. Each process has a **page table** that maps page numbers to frame numbers. A process's pages can be scattered across physical memory in any order, while the process still sees one continuous address space.

## Splitting an address

With a page size of 2^n bytes, the low n bits of a logical address are the **offset** within the page, and the remaining high bits are the **page number**. With 4 KB pages (2^12), the bottom 12 bits are the offset.

Translation replaces the page number with the frame number from the page table and keeps the offset unchanged:

~~~text
physical address = frame number × page size + offset
~~~

The offset never changes, because the byte's position within the page is the same as its position within the frame.

## Page-table entries hold more than a frame number

Each page-table entry stores the frame number plus control bits:

- **Valid bit**: whether the page is in memory and part of the process's address space
- **Protection bits**: read, write and execute permissions, so code pages can be made read-only
- **Dirty bit**: whether the page has been modified since it was loaded, so the OS knows whether to write it back
- **Referenced bit**: whether the page was accessed recently, used by page replacement

A write to a read-only page, or any access to an invalid page, traps to the OS. That's how the system catches bugs and implements features such as copy-on-write.

## How big is a page table?

Take a 32-bit address space with 4 KB pages. The offset uses 12 bits, leaving 20 bits for the page number, so there are 2^20, about a million, pages. With 4-byte entries, the page table needs 4 MB per process. With 100 processes, that's 400 MB of page tables, most describing memory the processes never use. For 64-bit address spaces a flat table would be astronomically large. Multilevel page tables, covered in the next lesson, fix this.

## The cost of translation

A page table lives in memory. Without help, every memory access becomes two: one to read the page-table entry and one to access the data. That would halve the speed of every program, which is unacceptable.

## The translation lookaside buffer

The TLB is a small, fast cache inside the MMU that holds recent page-to-frame translations, typically 64 to a few thousand entries. On each access:

- **TLB hit**: the translation is in the TLB, so only one memory access is needed
- **TLB miss**: the hardware (or OS) walks the page table, then stores the translation in the TLB for next time

Programs have strong locality, using the same pages repeatedly, so hit rates above 99% are common.

## Effective access time

The effective access time (EAT) measures the average cost of a memory access:

~~~text
EAT = h × (t + m) + (1 − h) × (t + 2m)
~~~

Here h is the hit ratio, t the TLB lookup time and m the memory access time. With h = 0.8, t = 20 ns and m = 100 ns: 0.8 × 120 + 0.2 × 220 = 96 + 44 = 140 ns, compared with 200 ns without a TLB. At a realistic 99% hit ratio, the EAT falls to about 121 ns.

## Sharing pages

Because translation happens per page, two processes can map the same physical frame into their address spaces. Shared libraries such as the C library are loaded once and mapped read-only into every process that uses them, saving large amounts of memory. Copy-on-write after \`fork()\` uses the same mechanism.

## Huge pages

Larger pages, such as 2 MB or 1 GB on x86-64, mean fewer page-table entries and fewer TLB misses for programs that use large amounts of memory, such as databases and virtual machines. The cost is more internal fragmentation, so systems use huge pages selectively.

## How interviewers test this

Exams ask for the number of page-number bits, the page-table size, or the effective access time. Show each step: offset bits from the page size, page-number bits from the rest, entries × entry size for the table, and the EAT formula with your numbers. Interviewers ask "Why do we need a TLB?", answered with the two-memory-access problem.`,
    sources: [OSTEP, LINUX_MM, MIT_6S081]
  },

  "multilevel-paging-segmentation": {
    theory: `A flat page table for a large address space wastes memory on entries for pages a process never uses. Multilevel page tables solve this by paging the page table itself, and inverted page tables solve it by indexing physical frames instead of virtual pages. Segmentation offers a different view of memory based on the program's logical parts. This lesson explains all three and how modern systems combine them.

## The problem with flat page tables

A 32-bit process with 4 KB pages needs a million-entry, 4 MB page table, even if it uses only a few megabytes. Most of a process's address space is empty: code and data near the bottom, the stack near the top, and a vast unused gap between. A flat table spends entries on every page of that gap.

## Two-level paging

Two-level paging splits the page number into two parts. For a 32-bit address with 4 KB pages, a common split is:

~~~text
| p1: 10 bits | p2: 10 bits | offset: 12 bits |
~~~

The first 10 bits index an **outer page table**, whose entries point to **inner page tables**. The next 10 bits index the chosen inner table, which gives the frame number. Each inner table covers 4 MB of address space and occupies exactly one 4 KB page.

The saving comes from leaving inner tables out. If a region of 4 MB is entirely unused, its outer entry is marked invalid and no inner table exists. A small process might need only the outer table plus two or three inner tables, about 16 KB instead of 4 MB.

## Deeper hierarchies

64-bit address spaces need more levels. x86-64 uses four levels to translate 48-bit virtual addresses, and newer processors support five levels for 57-bit addresses. Each level is a 4 KB page holding 512 entries of 8 bytes, so each level consumes 9 bits of the address.

## The cost of more levels

Every level adds a memory access on a TLB miss: a four-level walk needs four page-table reads before the data access itself. This is why TLB hit rates matter so much, and why processors cache intermediate page-table entries in addition to final translations. Huge pages also help, because a 2 MB page skips the last level entirely.

## Inverted page tables

An inverted page table flips the structure: it has one entry per physical frame rather than per virtual page, storing which process and which page occupy that frame. Its size depends on physical memory, not on the size or number of address spaces, so it stays small however large the virtual address space is.

The catch is lookup. To translate an address, the system must find the entry holding a given process and page number, which would mean searching the whole table. Systems use a hash table keyed on process and page to make lookups fast. Inverted page tables appeared in architectures such as PowerPC and IA-64. Sharing memory is awkward with them, because each frame records only one owner.

## Segmentation

Segmentation divides a process's memory into variable-size logical units that match how programmers think: a code segment, a data segment, a heap and a stack. A logical address becomes a pair: segment number and offset. A **segment table** stores each segment's base and limit, and the hardware checks the offset against the limit, then adds the base.

Segments make protection and sharing natural: mark the code segment read-only and share it between processes running the same program. Because segments vary in size, segmentation suffers from external fragmentation, the same problem as contiguous allocation.

## Paging versus segmentation

| | Paging | Segmentation |
|---|---|---|
| Unit | Fixed-size pages | Variable-size logical segments |
| Visible to the programmer | No | Yes |
| Fragmentation | Internal (last page) | External |
| Address | Page number and offset | Segment number and offset |
| Protection and sharing | Per page | Per logical segment |

## Combining them

Segmented paging divides memory into segments for protection and then pages each segment, avoiding external fragmentation. Older x86 processors used this design. Modern 64-bit operating systems keep segments essentially flat, with base zero and maximum limit, and rely on paging for everything, using page-level protection bits for read-only code and non-executable data.

## How interviewers test this

GATE asks how many levels a page table needs, or how much memory a multilevel table uses. Work out the entries per page (page size divided by entry size), the bits each level consumes, and divide the page-number bits by bits per level. Interviewers ask "Paging vs segmentation", answered with the table above.`,
    sources: [OSTEP, LINUX_MM, MIT_6S081]
  },

  "demand-paging-page-faults": {
    theory: `Virtual memory lets a process use more memory than physically exists by keeping only the pages it's actively using in RAM and the rest on disk. Demand paging loads each page only when it's first touched. This lesson explains how demand paging works, exactly what happens during a page fault, how page faults affect the effective access time, and how copy-on-write makes \`fork()\` cheap.

## The idea behind virtual memory

Programs rarely need all their code and data at once. A word processor carries spell-check dictionaries, printing code and import filters, but a typical session touches a fraction of them. Virtual memory takes advantage of this: each process gets a large virtual address space, and only the pages in use occupy physical frames. The rest wait in a swap area on disk, or in the program file itself.

The benefits are large: programs can be bigger than physical memory, more programs fit in memory at once, and programs start faster because they don't load everything up front.

## Demand paging

With demand paging, no page is loaded until the process first accesses it. Every page-table entry has a valid bit. When a process starts, its pages are marked invalid (not in memory). The first access to each page triggers a page fault, and the OS loads it. A process that never touches part of its code never loads it.

## What happens on a page fault

When a process accesses a page whose valid bit is 0, the hardware traps to the OS, and the OS runs these steps:

1. Check whether the address is legal for this process. If not, terminate it with a segmentation fault
2. Find a free frame. If none is free, run the page-replacement algorithm to choose a victim, and write the victim to disk first if it's dirty
3. Schedule a disk read to load the page into the frame, and block the process meanwhile
4. When the read finishes, update the page-table entry with the frame number and set the valid bit
5. Restart the instruction that caused the fault, which now succeeds

Restarting the instruction is a hardware requirement: the CPU must be able to undo a partially completed instruction and run it again from the start.

## Page faults are expensive

A memory access takes on the order of 100 ns. Servicing a page fault from disk takes milliseconds, tens of thousands of times longer. The effective access time with page faults is:

~~~text
EAT = (1 − p) × memory_access + p × fault_time
~~~

With a 200 ns memory access, an 8 ms fault time and one fault per 1,000 accesses, the EAT is about 8,200 ns, 40 times slower than a system with no faults. To keep slowdown under 10%, p must be below 0.0000025, fewer than one fault per 400,000 accesses. SSDs shorten fault times, but the gap stays huge.

## Why it works anyway

Those numbers would make virtual memory useless if programs accessed memory randomly. They don't. **Locality of reference** means programs reuse the same pages repeatedly (temporal locality) and access nearby addresses (spatial locality). A loop runs the same instructions on neighbouring array elements, so once its pages are in memory, it runs without faulting.

## Major and minor faults

Not every page fault reads from disk. A **major fault** needs disk input. A **minor fault** happens when the page is already in memory but not yet mapped into this process, for example a shared library page another process loaded, or a page in the file cache. Minor faults cost microseconds rather than milliseconds. On Linux, \`/usr/bin/time -v\` reports both counts for a program.

## Copy-on-write

After \`fork()\`, parent and child have identical address spaces. Copying every page immediately would be slow and usually wasted, since the child often calls \`exec()\` right away. Copy-on-write lets both processes share the same physical pages, marked read-only. When either one writes to a shared page, the write faults, and the OS copies that single page, gives the writer the private copy, and resumes. Pages nobody writes are never copied.

## Memory-mapped files

The same machinery maps files into memory. With \`mmap()\`, a file appears as a range of addresses; reading those addresses faults pages in from the file, and modified pages are written back. Databases and programs that process large files use memory mapping to let the OS handle caching.

## How interviewers test this

Expect "What is a page fault and how is it handled?" and an EAT calculation. List the steps from trap to instruction restart, and in the calculation, convert milliseconds to nanoseconds before multiplying. Explaining copy-on-write as a use of page faults shows you see virtual memory as a general mechanism.`,
    sources: [OSTEP, LINUX_MM, MIT_6S081]
  },

  "page-replacement-algorithms": {
    theory: `When a page fault occurs and memory is full, the OS must evict a page to make room. The choice matters: evict a page that's needed again soon and you cause another fault almost immediately. This lesson explains the optimal algorithm that sets the benchmark, FIFO and its surprising anomaly, LRU and why it works, and the clock algorithm real systems use to approximate LRU cheaply.

## The goal

Page replacement aims to minimize page faults. Each fault costs milliseconds, so even a small improvement in the fault rate makes a large difference in performance. Algorithms are compared on a **reference string**, the sequence of pages a program accesses, with a fixed number of frames.

## Optimal (OPT)

The optimal algorithm evicts the page that won't be used for the longest time in the future. It produces the fewest possible faults for any reference string. In the course's example string with 3 frames, OPT causes 7 faults.

OPT can't be implemented, because the OS doesn't know the future. Its role is as a benchmark: if a practical algorithm comes within a few percent of OPT on real traces, there's little left to gain.

## FIFO

First-in, first-out evicts the page that has been in memory longest. It needs only a queue, so it's cheap. Its flaw is that age says nothing about usefulness: the oldest page might be the most heavily used, such as a page of a frequently called function. On the example string, FIFO causes 10 faults.

## Belady's anomaly

Intuition says more frames should mean fewer faults. FIFO can violate this. For the reference string 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5, FIFO causes 9 faults with 3 frames and 10 faults with 4 frames. This is **Belady's anomaly**.

LRU and OPT never show the anomaly, because they're **stack algorithms**: the set of pages in memory with n frames is always a subset of the set with n + 1 frames. Adding a frame can only keep more useful pages, never fewer.

## LRU

Least recently used evicts the page that hasn't been accessed for the longest time. It uses the recent past to predict the near future, relying on temporal locality: pages used recently are likely to be used again soon. On the example string, LRU causes 9 faults, between FIFO and OPT, and on real workloads it usually comes much closer to OPT than FIFO does.

## Why exact LRU is impractical

Exact LRU needs the time of every single memory access, or a list reordered on every access. With billions of accesses per second, doing that in software is impossible, and hardware support is too costly. Real systems approximate LRU using one bit the hardware sets cheaply.

## The reference bit and the clock algorithm

Each page-table entry has a **reference bit** that the hardware sets whenever the page is accessed. The **clock algorithm** (second chance) arranges frames in a circle with a pointer, like a clock hand:

1. Look at the page under the hand
2. If its reference bit is 1, clear it to 0 (giving the page a second chance) and advance the hand
3. If its reference bit is 0, the page hasn't been used since the hand last passed, so evict it

Recently used pages keep getting their bits set and survive; idle pages are found and evicted. The **enhanced clock** algorithm also considers the dirty bit, preferring clean, unreferenced pages, because evicting them needs no disk write.

## What Linux does

Linux approximates LRU with active and inactive lists. Pages start on the inactive list and move to the active list when accessed again, and reclaim takes pages from the tail of the inactive list. Recent kernels add a multi-generational LRU that tracks page ages in more detail, improving performance under memory pressure on phones and servers.

## Frame allocation

Replacement can be **global**, choosing a victim from any process, or **local**, choosing only from the faulting process's own frames. Global replacement uses memory more flexibly but lets one process's behaviour hurt others. Most general-purpose systems use global replacement with safeguards against thrashing, the subject of the next lesson.

## How interviewers test this

Exams give a reference string and a frame count and ask for the number of faults under FIFO, LRU and OPT. Draw a table with one column per reference, and mark each fault. Interviewers ask "What is Belady's anomaly?", answered with FIFO, the definition, and the fact that stack algorithms such as LRU are immune.`,
    sources: [OSTEP, LINUX_MM]
  },

  "thrashing-and-working-set": {
    theory: `Thrashing is the state where a system spends most of its time moving pages between memory and disk instead of running programs. It can make a machine almost unusable, and the natural response, running more programs to use the "idle" CPU, makes it worse. This lesson explains why thrashing happens, how the working-set model describes what each process needs, and how the page-fault frequency method keeps a system out of trouble.

## What thrashing looks like

You open too many applications on a laptop with limited RAM. The disk light stays on, every click takes seconds, and the CPU usage meter shows low activity. Programs aren't computing; they're waiting for pages. That's thrashing.

## How it starts

Each process needs a certain set of pages to make progress. If it has fewer frames than that, it faults, the OS evicts one of its pages to make room, and the evicted page is needed again almost immediately, causing another fault. The process spends its time waiting for the disk.

With global replacement, a faulting process steals frames from other processes, which then start faulting too. Soon every process is waiting on page faults.

## The vicious circle

The early scheduling systems made thrashing worse through a feedback loop:

1. Processes wait on page faults, so CPU utilization drops
2. The scheduler sees an idle CPU and admits more processes to use it
3. The new processes take frames from existing ones
4. Every process now has even fewer frames and faults more
5. CPU utilization drops further

The degree of multiprogramming keeps rising while useful work falls toward zero. The right response is the opposite: run fewer processes, so each has enough frames.

## Locality and the working set

Programs exhibit **locality**: over any short period, they use a small set of pages. A loop uses its code page and the data pages it's iterating over; when the program moves to another phase, the set changes. Thrashing happens when a process can't hold its current locality in memory.

Peter Denning's **working-set model** (1968) makes this precise. The working set WS(t, Δ) is the set of pages a process referenced in the most recent Δ memory references. If Δ is chosen well, the working set approximates the process's current locality.

## Using the working set

The OS estimates each process's working-set size WSS. If D is the sum of all working-set sizes and m is the number of available frames:

- if D ≤ m, every process can hold its working set, and the system runs well
- if D > m, thrashing will happen, so the OS suspends one or more processes, swapping them out entirely, and gives their frames to the rest

Suspended processes resume later when memory frees up. Running fewer processes at full speed finishes more work than running many processes that all thrash.

## Choosing Δ

The window Δ sets what counts as "recent":

- **Too small**: the working set misses pages the process will need, so it underestimates and the process faults
- **Too large**: the working set spans several program phases, overestimates, and wastes frames
- **Infinite**: the working set becomes every page the process ever touched

Tracking exact working sets is costly, so systems approximate them with reference bits sampled at timer interrupts.

## Page-fault frequency

The page-fault frequency (PFF) method controls thrashing more directly by watching each process's fault rate:

- **Above an upper bound**: the process needs more frames, so give it some
- **Below a lower bound**: the process has more frames than it needs, so take some back
- **No free frames for a process above the bound**: suspend a process to free memory

PFF reacts to the symptom that matters, the fault rate, without estimating working sets.

## Thrashing on today's systems

Modern systems still thrash under memory pressure, and they defend in other ways too. Linux's out-of-memory killer terminates a process when memory runs out completely. Phones kill background apps aggressively to protect the foreground app. Servers often run with little or no swap, preferring a fast crash and restart over a slow thrashing state. Monitoring tools such as \`vmstat\` show swap activity in the \`si\` and \`so\` columns; sustained non-zero values signal trouble.

## How interviewers test this

Expect "What is thrashing and how do you prevent it?" Describe the vicious circle, explain that the cause is too little memory per process for its locality, and give the fixes: reduce the degree of multiprogramming, use the working-set model, or control page-fault frequency. Pointing out that adding processes makes thrashing worse is the key insight.`,
    sources: [DENNING_WS, OSTEP, LINUX_MM]
  },

  "file-system-basics": {
    theory: `A file system turns a disk, which only knows numbered blocks, into the files and folders you use every day. It decides where each file's data lives, how directories find files, and how free space is tracked. This lesson explains files and directories, the three ways of allocating blocks to files, how UNIX inodes reach terabyte-sized files with a handful of pointers, and how free space is managed.

## Files and their attributes

A **file** is a named collection of related data that persists after programs exit. The file system stores attributes alongside each file's data:

- **Name** and type (often shown by an extension such as \`.pdf\`)
- **Size** and **location** of its data blocks on disk
- **Owner** and **permissions** (who may read, write or execute it)
- **Timestamps**: created, last modified, last accessed

On UNIX-like systems these attributes, except the name, live in a structure called an inode. Names live in directories.

## Directories

A **directory** maps names to files. Directory structures evolved over time:

- **Single-level**: one directory for everyone, so names must be unique across all users
- **Two-level**: one directory per user
- **Tree-structured**: directories inside directories, the structure every modern system uses
- **Acyclic graph**: a tree plus links, so one file can appear in several directories

UNIX supports two kinds of link. A **hard link** is another directory entry pointing to the same inode, so both names are equal and the data stays until the last link is removed. A **symbolic (soft) link** is a small file containing a path, which breaks if the target is deleted or moved.

## Contiguous allocation

Contiguous allocation stores each file in consecutive blocks, recorded as a start block and a length. Reading is fast, sequentially and randomly, because block k of a file is at start + k. The drawbacks mirror contiguous memory allocation: external fragmentation as files are created and deleted, and files that can't grow when the next block is taken. CD-ROMs and DVDs, which are written once, use it well.

## Linked allocation

Linked allocation stores each block with a pointer to the next one, and the directory records the first block. Any free block can be used, so there's no external fragmentation and files grow easily.

Random access is slow, because reading block k means following k pointers from the start. A single corrupted pointer also loses the rest of the file. FAT (File Allocation Table) improves on this by moving all the pointers into one table at the start of the disk, which can be cached in memory to speed up following the chain. FAT is still common on USB drives and memory cards.

## Indexed allocation

Indexed allocation gives each file an index block that lists all its data blocks. Random access is fast, because the index gives block k's location directly, and there's no external fragmentation. The cost is the index block itself, which is wasteful for tiny files and too small for large ones.

## The UNIX inode

UNIX inodes solve the index-size problem with a mix of direct and indirect pointers. A classic inode has 12 direct pointers to data blocks, then one single-indirect pointer (to a block full of pointers), one double-indirect and one triple-indirect.

With 4 KB blocks and 4-byte pointers, each pointer block holds 1,024 pointers, so:

- direct pointers reach 12 × 4 KB = 48 KB
- single indirect adds 1,024 × 4 KB = 4 MB
- double indirect adds 1,024² × 4 KB = 4 GB
- triple indirect adds 1,024³ × 4 KB = 4 TB

Small files, the vast majority, are reached through direct pointers with no extra reads, and huge files are still possible. Modern file systems such as ext4 and XFS use **extents** instead, recording runs of contiguous blocks as a start and length, which describes large files far more compactly.

## Free-space management

The file system must track free blocks quickly:

- **Bitmap**: one bit per block, compact and fast for finding runs of free blocks
- **Linked list**: free blocks point to each other, using no extra space but slow to search
- **Grouping and counting**: store addresses of several free blocks together, or record runs as a start and count

## Journaling

A crash in the middle of creating a file can leave the directory, inode and bitmap inconsistent. Journaling file systems, such as ext4 and NTFS, first write the intended changes to a journal, then apply them, so recovery after a crash replays or discards incomplete operations, the same idea as a database's write-ahead log.

## How interviewers test this

Exams ask for the maximum file size with a given inode layout, or which allocation method suits random access. Interviewers ask "Hard link vs soft link" and "What is an inode?" Show the pointer arithmetic step by step, and explain that a hard link shares the inode while a soft link stores a path.`,
    sources: [OSTEP, LINUX_FS]
  },

  "disk-scheduling": {
    theory: `On a hard disk drive, the read-write head must physically move to the right track before reading data, and that movement, the seek, dominates access time. Disk scheduling decides the order in which pending requests are served to reduce total head movement. This lesson explains how a disk works, each classic scheduling algorithm with its trade-offs, and why solid-state drives changed the picture.

## How a hard disk works

A hard disk has spinning platters coated with magnetic material, and an arm with read-write heads that moves across them. Data sits in concentric tracks, and tracks at the same position across platters form a cylinder. Reading a block takes three steps:

- **Seek time**: moving the arm to the right cylinder, typically several milliseconds
- **Rotational latency**: waiting for the right sector to spin under the head, about 4 ms on average at 7,200 RPM
- **Transfer time**: reading the data, which is fast once the head is in place

Seek time is the part scheduling can reduce, by serving requests in an order that minimizes arm movement.

## FCFS

First-come, first-served serves requests in arrival order. It's fair, but the head swings back and forth across the disk. On the course's example queue (requests 98, 183, 37, 122, 14, 124, 65, 67 with the head at 53), FCFS moves the head 640 cylinders.

## SSTF

Shortest seek time first always serves the pending request closest to the head. On the example, total movement drops to 236 cylinders. The risk is starvation: if requests keep arriving near the head, a request at the far edge may wait indefinitely, the same weakness as shortest job first in CPU scheduling.

## SCAN: the elevator

SCAN moves the head in one direction, serving every request along the way, until it reaches the end of the disk, then reverses. It behaves like an elevator going up and down a building, and every request is served within two sweeps, so nothing starves. On the example, moving toward cylinder 0 first, SCAN totals 236 cylinders.

SCAN's weakness is uneven waiting. When a new request arrives for a region the head has passed a moment ago, it waits for the head to go all the way to the end and come back.

## C-SCAN

Circular SCAN serves requests in one direction only. When the head reaches the end, it jumps back to the beginning without serving anything, and sweeps in the same direction again. Waiting times become more uniform, because every position is treated the same way. Textbooks differ on whether the return jump counts as head movement, so state your assumption in exam answers.

## LOOK and C-LOOK

LOOK and C-LOOK are SCAN and C-SCAN with one improvement: the head reverses (or jumps back) at the last pending request instead of travelling to the physical end of the disk. On the example, LOOK toward 0 totals 208 cylinders, better than SCAN's 236, because it skips the empty stretch to cylinder 0. In practice, LOOK-style algorithms perform best among the classic ones.

## Comparison

| Algorithm | Idea | Example total | Issue |
|---|---|---|---|
| FCFS | Arrival order | 640 | Wild head movement |
| SSTF | Nearest request next | 236 | Starvation of far requests |
| SCAN | Sweep to the end, reverse | 236 | Uneven waiting |
| LOOK | Sweep to the last request, reverse | 208 | Uneven waiting |
| C-SCAN, C-LOOK | One direction, jump back | Depends on convention | More uniform waiting |

## Solid-state drives change everything

SSDs have no moving parts: reading any block takes about the same time regardless of its address. Seek optimization becomes irrelevant, and the classic algorithms lose their purpose. Linux uses minimal schedulers for fast NVMe drives, such as \`none\` or \`mq-deadline\`, which focus on fairness and latency guarantees rather than head movement.

SSDs bring their own concerns. Flash memory can't overwrite data in place; it erases large blocks and rewrites them, so the drive's controller manages wear and garbage collection internally. The OS helps with the TRIM command, telling the drive which blocks are no longer in use.

## How interviewers test this

Exams give a request queue, a starting head position and a direction, and ask for total head movement under each algorithm. Write the service order first, then sum the distances, and note whether SCAN goes to the disk's edge and whether the C-SCAN jump counts. Interviewers may ask "Why don't SSDs need disk scheduling?", answered with the absence of seek time.`,
    sources: [OSTEP, LINUX_FS]
  },

  "io-systems-and-raid": {
    theory: `Input and output devices range from keyboards that produce a few bytes per second to network cards and SSDs that move gigabytes. The OS must communicate with all of them efficiently, and must protect data against device failures. This lesson explains programmed I/O, interrupts and direct memory access (DMA), the kernel services that sit above device drivers, and how RAID combines disks for speed and reliability.

## Three ways to talk to a device

The CPU can wait for a device in three ways, and each suits a different situation:

| Technique | How it works | Good for |
|---|---|---|
| Programmed I/O (polling) | The CPU repeatedly reads the device's status register until it's ready | Devices that respond within a few microseconds |
| Interrupt-driven I/O | The CPU starts the operation and does other work; the device interrupts when finished | Keyboards, mice, network packets |
| Direct memory access (DMA) | A DMA controller moves a whole block between the device and memory, then interrupts once | Disks, SSDs, network cards, any bulk transfer |

## Polling and interrupts

Polling wastes CPU time when the device is slow, because the CPU spins checking status instead of running programs. Interrupts free the CPU, but each interrupt has overhead: saving state, running a handler and restoring state. For a device that produces events extremely fast, such as a 100 Gbit network card, interrupts can overwhelm the CPU. Linux's NAPI handles this by switching a busy network card to polling until traffic slows down, then back to interrupts.

## Direct memory access

Copying a 4 KB block one word at a time through the CPU would keep the CPU busy for the whole transfer. With DMA, the CPU tells the DMA controller the source, destination and size, then goes back to other work. The controller transfers the block directly between the device and memory, and raises one interrupt when it's done. That's why a large file copy doesn't consume a full CPU core.

## Kernel I/O services

Above the drivers, the kernel provides services every device benefits from:

- **Buffering**: smooth out speed differences between producer and consumer. Double buffering lets the device fill one buffer while a program reads the other
- **Caching**: keep copies of recently used disk blocks in memory, the page cache, so repeated reads skip the disk entirely
- **Spooling**: queue output for a device that serves one job at a time, such as a printer, so programs don't wait for it
- **Device drivers**: present every device through a standard interface, so programs read from a USB stick and an NVMe drive the same way

## Why RAID exists

A single disk has a limited speed and fails eventually, taking its data with it. RAID (redundant array of independent disks) combines several disks to gain speed, reliability or both. Two techniques underlie every RAID level:

- **Striping**: spread data across disks so reads and writes happen in parallel
- **Redundancy**: store mirrored copies or parity information so data survives a disk failure

## RAID levels

| Level | Technique | Survives | Usable capacity with n disks |
|---|---|---|---|
| RAID 0 | Striping only | No failure | n disks |
| RAID 1 | Mirroring | 1 disk per mirror pair | n / 2 |
| RAID 5 | Striping with distributed parity | 1 disk | n − 1 |
| RAID 6 | Striping with double parity | 2 disks | n − 2 |
| RAID 10 | Mirrored pairs, striped together | 1 disk per pair | n / 2 |

RAID 0 is fastest and offers no protection: one failed disk loses everything. RAID 5's parity is the XOR of the data blocks in each stripe, so any single missing block can be reconstructed from the others.

## The cost of parity

RAID 5 writes are slow, because updating one data block means reading the old data and old parity, then writing the new data and new parity: four disk operations for one logical write. Rebuilding a failed disk in a large RAID 5 array can take many hours, and a second failure during the rebuild loses the array. That's why RAID 6 and RAID 10 are preferred for large disks and databases.

## RAID isn't a backup

RAID protects against a disk dying, not against deleting the wrong file, ransomware, a controller writing garbage to every disk, or a fire. Each of those destroys data on all disks at once. Backups, ideally stored separately, protect against them; RAID and backups solve different problems.

## How interviewers test this

Expect "What is DMA and why is it useful?" and "Explain the RAID levels." For DMA, describe the CPU handing the transfer to a controller and receiving one interrupt at the end. For RAID, give each level's technique, failure tolerance and capacity, and add that RAID isn't a backup, which interviewers like to hear.`,
    sources: [RAID_PAPER, OSTEP, LINUX_FS]
  }
};
