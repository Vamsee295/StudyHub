import type { LessonQuestions } from './index';

export const osQuestions: LessonQuestions = {
  "what-is-an-os": [
    { q: "Which is NOT a core responsibility of an operating system?", o: ["Process management", "Memory management", "Compiling application source code", "File system management"], a: 2, e: "Compilers are user-level programs. The OS manages processes, memory, files, devices and protection." },
    { q: "Why does the CPU have user mode and kernel mode?", o: ["To protect the system from faulty or malicious programs", "To run two programs at once", "To save battery", "To speed up arithmetic"], a: 0, e: "Privileged instructions run only in kernel mode, so a user program can't take over hardware or other processes." },
    { q: "The OS acting as a 'resource allocator' means what?", o: ["It decides how CPU time, memory and devices are shared among programs", "It allocates IP addresses", "It writes data to the cloud", "It schedules meetings"], a: 0, e: "The OS arbitrates conflicting requests for resources fairly and efficiently." },
  ],
  "types-of-operating-systems": [
    { q: "Which OS type must guarantee a response within a strict deadline?", o: ["Batch OS", "Hard real-time OS", "Time-sharing OS", "Network OS"], a: 1, e: "Hard real-time systems, such as airbag controllers, treat a missed deadline as a failure." },
    { q: "What does a time-sharing OS mainly aim to minimize?", o: ["Throughput", "Response time for interactive users", "Disk usage", "Memory size"], a: 1, e: "Time-sharing switches the CPU rapidly among users so each gets quick interactive responses." },
    { q: "Multiprogramming increases what?", o: ["CPU utilization, by running another job while one waits for I/O", "Clock speed", "RAM capacity", "Disk size"], a: 0, e: "Keeping several jobs in memory lets the CPU switch to a ready job instead of idling during I/O." },
  ],
  "system-calls": [
    { q: "What happens when a program makes a system call?", o: ["A trap switches the CPU to kernel mode to run the OS service", "The program is terminated", "The CPU resets", "The call runs in user mode directly"], a: 0, e: "A system call triggers a trap, the CPU enters kernel mode, the kernel performs the service and returns." },
    { q: "Which of these is a system call on Unix-like systems?", o: ["printf()", "fork()", "strlen()", "malloc() always"], a: 1, e: "fork() is a system call. printf and strlen are library functions; malloc may call brk or mmap internally only sometimes." },
    { q: "Why do programs usually call library wrappers instead of raw system calls?", o: ["Wrappers are portable and handle details such as register setup", "Raw system calls are illegal", "Wrappers run in kernel mode", "Wrappers avoid the kernel entirely"], a: 0, e: "APIs such as POSIX or the C library hide architecture-specific system call conventions and add buffering." },
  ],
  "kernel-architectures": [
    { q: "What is the main advantage of a microkernel?", o: ["Fewer context switches", "Better fault isolation, since services run in user space", "Faster system calls", "Smaller applications"], a: 1, e: "Drivers and services run as user processes, so a crash in one doesn't bring down the kernel." },
    { q: "Linux is usually described as which kind of kernel?", o: ["Microkernel", "Exokernel", "Monolithic with loadable modules", "Pure hybrid"], a: 2, e: "Linux runs most services in kernel space but supports loadable modules for drivers." },
    { q: "What is the main cost of a microkernel design?", o: ["Extra message passing between user-space services", "No support for drivers", "No memory protection", "Single-user only"], a: 0, e: "Services communicate through IPC, adding overhead compared with direct calls inside a monolithic kernel." },
  ],
  "process-and-pcb": [
    { q: "Which memory segment holds dynamically allocated objects?", o: ["Text", "Stack", "Heap", "Data"], a: 2, e: "malloc and new allocate from the heap, which grows toward the stack." },
    { q: "Which is NOT stored in a process control block?", o: ["Program counter", "Process state", "Open file table pointer", "The source code of the program"], a: 3, e: "The PCB stores the execution context and bookkeeping, not source code." },
    { q: "Local variables of a function live in which segment?", o: ["Stack", "Heap", "Text", "BSS"], a: 0, e: "Each function call pushes a stack frame holding its locals, parameters and return address." },
  ],
  "process-states-and-schedulers": [
    { q: "A process waiting for disk I/O to finish is in which state?", o: ["Ready", "Running", "Waiting (blocked)", "Terminated"], a: 2, e: "A blocked process can't run until its event completes, then it moves to ready." },
    { q: "Which scheduler controls the degree of multiprogramming?", o: ["Short-term scheduler", "Long-term scheduler", "Dispatcher", "Interrupt handler"], a: 1, e: "The long-term (job) scheduler decides how many processes are admitted into memory." },
    { q: "Which transition happens when a running process's time slice expires?", o: ["Running to ready", "Running to waiting", "Ready to waiting", "Waiting to running"], a: 0, e: "A timer interrupt preempts the process and returns it to the ready queue." },
  ],
  "context-switching": [
    { q: "Why is context switching considered pure overhead?", o: ["No useful user work happens while state is saved and restored", "It deletes processes", "It increases RAM", "It only happens at boot"], a: 0, e: "The CPU spends the switch saving and loading registers and kernel state, not running application code." },
    { q: "Which indirect cost often makes context switches expensive?", o: ["Cache and TLB contents become cold for the new process", "The disk spins down", "The network disconnects", "The kernel reboots"], a: 0, e: "After a switch, the new process's data isn't in the caches or TLB, so early accesses miss." },
    { q: "Why are thread switches within one process cheaper than process switches?", o: ["Threads share the address space, so page tables don't change", "Threads don't have registers", "Threads never block", "Threads skip the scheduler"], a: 0, e: "Switching threads of the same process keeps the memory mapping, avoiding TLB flushes on many systems." },
  ],
  "process-creation-fork": [
    { q: "How many processes exist after a program calls fork() three times in sequence, with no conditions?", o: ["3", "4", "6", "8"], a: 3, e: "Each fork doubles the number of processes: 2³ = 8." },
    { q: "What does fork() return in the child process?", o: ["The parent's PID", "0", "-1", "The child's PID"], a: 1, e: "fork returns 0 to the child and the child's PID to the parent, or -1 on failure." },
    { q: "A child has exited but its parent hasn't called wait(). What is the child called?", o: ["Orphan", "Daemon", "Zombie", "Thread"], a: 2, e: "A zombie keeps its process table entry so the parent can collect its exit status." },
  ],
  "inter-process-communication": [
    { q: "Which IPC mechanism is usually fastest for large data?", o: ["Shared memory", "Message passing through the kernel", "Signals", "Files"], a: 0, e: "After setup, shared memory needs no kernel copies, though processes must synchronize access themselves." },
    { q: "An unnamed pipe created with pipe() can be used between which processes?", o: ["Any two processes on the system", "Related processes, such as parent and child", "Processes on different machines", "Only kernel threads"], a: 1, e: "Unnamed pipes are inherited through fork. Named pipes (FIFOs) work between unrelated processes." },
    { q: "Which IPC mechanism can connect processes on different machines?", o: ["Shared memory", "Unnamed pipes", "Sockets", "Semaphores"], a: 2, e: "Sockets communicate over a network, as well as locally." },
  ],
  "threads-vs-processes": [
    { q: "Which resource do threads of the same process NOT share?", o: ["Heap", "Global variables", "Open files", "Stack"], a: 3, e: "Each thread has its own stack and registers; code, data, heap and open files are shared." },
    { q: "Why is a bug in one thread potentially dangerous for the whole process?", o: ["Threads share memory, so one can corrupt data or crash the process", "Threads share the CPU only", "Threads can't use files", "Threads run in kernel mode"], a: 0, e: "There's no memory isolation between threads, unlike between processes." },
    { q: "Which is generally cheaper to create?", o: ["A thread", "A process", "Both cost the same", "Neither can be created at runtime"], a: 0, e: "A thread reuses the process's address space and resources, so creation needs less work than a new process." },
  ],
  "user-vs-kernel-threads": [
    { q: "In the many-to-one model, what happens when one user thread makes a blocking system call?", o: ["Only that thread blocks", "The whole process blocks", "The kernel creates a new thread", "Nothing; calls never block"], a: 1, e: "All user threads map to one kernel thread, so a blocking call stops all of them." },
    { q: "Which threading model do Linux and Windows mainly use?", o: ["Many-to-one", "One-to-one", "Many-to-many only", "No threads"], a: 1, e: "Each user thread maps to a kernel thread, allowing true parallelism on multiple cores." },
    { q: "What's an advantage of user-level threads?", o: ["Very fast creation and switching without kernel involvement", "True parallelism on multiple cores", "Blocking calls don't block other threads", "Kernel-level scheduling"], a: 0, e: "User-level threads are managed by a library, avoiding system calls, at the cost of the limitations above." },
  ],
  "multithreading-benefits-and-issues": [
    { q: "What is the difference between concurrency and parallelism?", o: ["Concurrency is tasks making progress in overlapping time; parallelism is tasks running at the same instant", "They mean the same", "Parallelism needs only one core", "Concurrency requires multiple machines"], a: 0, e: "A single core can be concurrent by interleaving; parallelism needs multiple cores executing simultaneously." },
    { q: "Why do servers use thread pools?", o: ["To avoid the cost of creating a thread per request and bound resource use", "To make code single-threaded", "To avoid locks", "To increase thread stack size"], a: 0, e: "Reusing a fixed set of worker threads saves creation cost and prevents unbounded thread growth." },
    { q: "According to Amdahl's law, if 20% of a program is serial, what is the maximum speedup with unlimited cores?", o: ["2×", "5×", "20×", "Unlimited"], a: 1, e: "Maximum speedup is 1 / serial fraction = 1 / 0.2 = 5." },
  ],
  "scheduling-criteria": [
    { q: "Turnaround time equals what?", o: ["Completion time minus arrival time", "Burst time minus waiting time", "Completion time minus burst time", "Arrival time plus burst time"], a: 0, e: "Turnaround is the total time from arrival to completion." },
    { q: "Waiting time equals what?", o: ["Turnaround time minus burst time", "Completion time minus arrival time", "Burst time minus arrival time", "Response time plus burst time"], a: 0, e: "Waiting time is turnaround minus the time actually spent running." },
    { q: "Response time measures what?", o: ["Time from arrival until the process first gets the CPU", "Total time to finish", "Time spent in I/O", "Number of processes finished per second"], a: 0, e: "Response time matters for interactive systems; it's the delay before first execution." },
  ],
  "fcfs-sjf-srtf": [
    { q: "Processes with bursts 24, 3 and 3 arrive at time 0 in that order. What is the average waiting time under FCFS?", o: ["3", "17", "10", "27"], a: 1, e: "Waits are 0, 24 and 27, averaging 51 / 3 = 17. Short jobs stuck behind a long one is the convoy effect." },
    { q: "Same processes (24, 3, 3), scheduled by non-preemptive SJF. What is the average waiting time?", o: ["3", "17", "6", "9"], a: 0, e: "Order 3, 3, 24 gives waits 0, 3 and 6, averaging 3." },
    { q: "What is the main practical problem with SJF?", o: ["Burst lengths aren't known in advance", "It always starves short jobs", "It can't be preemptive", "It needs multiple CPUs"], a: 0, e: "Real systems estimate bursts, for example with exponential averaging of past bursts." },
  ],
  "round-robin-and-priority": [
    { q: "What happens to Round Robin as the time quantum becomes very large?", o: ["It behaves like FCFS", "It behaves like SJF", "It starves processes", "It stops preempting I/O"], a: 0, e: "If every process finishes within one quantum, no preemption happens, which is FCFS." },
    { q: "What happens if the RR quantum is much smaller than the context switch time?", o: ["Most CPU time is wasted on switching", "Throughput improves", "Waiting time drops to zero", "Starvation occurs"], a: 0, e: "Tiny quanta cause constant switches, so overhead dominates useful work." },
    { q: "Which technique prevents starvation in priority scheduling?", o: ["Aging", "Paging", "Thrashing", "Swapping out high priority jobs"], a: 0, e: "Aging gradually raises the priority of waiting processes so they eventually run." },
  ],
  "multilevel-queue-scheduling": [
    { q: "In a multilevel feedback queue, what typically happens to a process that uses its full time slice?", o: ["It moves to a lower-priority queue", "It moves to a higher-priority queue", "It is terminated", "It stays forever in the top queue"], a: 0, e: "CPU-bound processes sink to lower queues, leaving higher queues for interactive ones." },
    { q: "How does a multilevel queue differ from a multilevel feedback queue?", o: ["Processes can't move between queues in a plain multilevel queue", "Multilevel queues have one queue", "Feedback queues have no priorities", "They are identical"], a: 0, e: "Plain multilevel queues assign each process permanently; feedback queues move processes based on behaviour." },
    { q: "Which scheduler did Linux use from 2.6.23 until it was replaced by EEVDF in 6.6?", o: ["O(1) scheduler", "Completely Fair Scheduler (CFS)", "Round Robin only", "FCFS"], a: 1, e: "CFS used a red-black tree ordered by virtual runtime to share the CPU fairly." },
  ],
  "race-conditions-critical-section": [
    { q: "Two threads each run count++ 1000 times without synchronization. What can the final count be?", o: ["Always 2000", "Any value up to 2000, often less", "Always 1000", "Always 0"], a: 1, e: "count++ is a read-modify-write; interleaved updates can be lost." },
    { q: "Which requirement says a process outside its critical section must not block others from entering?", o: ["Mutual exclusion", "Progress", "Bounded waiting", "Atomicity"], a: 1, e: "Progress means the choice of who enters next can't be postponed indefinitely by processes not trying to enter." },
    { q: "Bounded waiting guarantees what?", o: ["A limit on how many times others can enter before a waiting process gets its turn", "The critical section is short", "No context switches occur", "Only one thread exists"], a: 0, e: "Bounded waiting prevents starvation of a process waiting to enter." },
  ],
  "petersons-and-hardware-support": [
    { q: "Peterson's solution uses which two shared variables?", o: ["A flag array and a turn variable", "A mutex and a semaphore", "Two monitors", "A counter and a timer"], a: 0, e: "flag[i] signals intent to enter; turn breaks ties politely." },
    { q: "Why can Peterson's algorithm fail on modern CPUs without extra care?", o: ["Instruction reordering and caches can break its assumptions without memory barriers", "It needs three processes", "It uses too much memory", "It only works on GPUs"], a: 0, e: "Compilers and CPUs may reorder loads and stores; memory fences are needed for correctness." },
    { q: "What does compare-and-swap (CAS) do atomically?", o: ["Updates a value only if it still equals an expected value", "Swaps two registers", "Compares two files", "Locks the whole memory bus forever"], a: 0, e: "CAS is the building block for lock-free data structures and spinlocks." },
  ],
  "mutex-and-semaphores": [
    { q: "A counting semaphore initialized to 3 represents what?", o: ["Three identical resources available", "A binary lock", "Three processes waiting", "A deadlock"], a: 0, e: "Each wait (P) takes one unit; each signal (V) returns one." },
    { q: "Which statement about a mutex is true?", o: ["Only the thread that locked it should unlock it", "Any thread can unlock it", "It can count above one", "It never blocks"], a: 0, e: "A mutex has ownership; semaphores don't." },
    { q: "Why is busy waiting wasteful on a single-core system?", o: ["The spinning thread burns CPU that the lock holder needs to finish", "It uses too much disk", "It causes page faults", "It frees memory"], a: 0, e: "Spinning makes sense only on multicore systems with short waits; otherwise blocking is better." },
  ],
  "classic-synchronization-problems": [
    { q: "In the bounded-buffer producer-consumer solution, what are the semaphores empty, full and mutex initialized to?", o: ["n, 0 and 1", "0, n and 1", "1, 1 and 0", "n, n and n"], a: 0, e: "empty counts free slots (n), full counts filled slots (0), and mutex protects the buffer (1)." },
    { q: "What risk does the first readers-writers solution (readers preference) have?", o: ["Writers can starve", "Readers can starve", "Deadlock always occurs", "Data is never shared"], a: 0, e: "A steady stream of readers can keep writers waiting forever." },
    { q: "Which fix prevents deadlock in the dining philosophers problem?", o: ["Make one philosopher pick up forks in the opposite order", "Add more philosophers", "Let everyone pick up the left fork first", "Remove the forks"], a: 0, e: "Breaking the symmetric order removes circular wait." },
  ],
  "monitors-and-condition-variables": [
    { q: "What does a monitor guarantee automatically?", o: ["Only one thread is active inside it at a time", "No deadlocks ever", "Threads never wait", "Infinite buffers"], a: 0, e: "A monitor provides mutual exclusion over its procedures; condition variables handle waiting." },
    { q: "Why should a condition be re-checked in a while loop after wait() returns?", o: ["Spurious wakeups and other threads may change the state", "wait() never returns", "It improves cache use", "The compiler requires it"], a: 0, e: "With Mesa semantics, the signalled thread runs later, so the condition may no longer hold." },
    { q: "What happens to a signal() on a condition variable when no thread is waiting?", o: ["It is lost", "It is saved for later", "It deadlocks", "It increments a counter"], a: 0, e: "Unlike a semaphore's V, a condition variable signal has no memory." },
  ],
  "deadlock-conditions": [
    { q: "Which is NOT one of the four Coffman deadlock conditions?", o: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"], a: 2, e: "The condition is NO preemption. All four must hold for deadlock." },
    { q: "In a resource allocation graph with single-instance resources, a cycle means what?", o: ["Deadlock exists", "Deadlock is impossible", "Deadlock might exist", "The graph is invalid"], a: 0, e: "With one instance per resource, a cycle is both necessary and sufficient for deadlock." },
    { q: "With multiple instances per resource type, a cycle in the graph means what?", o: ["Deadlock definitely exists", "Deadlock might exist", "No deadlock", "Starvation"], a: 1, e: "A cycle is necessary but not sufficient when resources have several instances." },
  ],
  "deadlock-prevention-and-avoidance": [
    { q: "Ordering all resources and requesting them in increasing order prevents which condition?", o: ["Circular wait", "Mutual exclusion", "No preemption", "Hold and wait"], a: 0, e: "A global order makes a cycle of waits impossible." },
    { q: "What does the Banker's algorithm check before granting a request?", o: ["Whether the resulting state is safe", "Whether the process is high priority", "Whether memory is full", "Whether a deadlock already exists"], a: 0, e: "It grants a request only if some sequence still lets every process finish." },
    { q: "In the Banker's algorithm, Need equals what?", o: ["Max minus Allocation", "Available minus Allocation", "Allocation minus Max", "Max plus Available"], a: 0, e: "Need is how much more each process may still request." },
  ],
  "deadlock-detection-and-recovery": [
    { q: "What does the 'ostrich approach' to deadlocks mean?", o: ["Ignore deadlocks, assuming they're rare", "Kill all processes", "Prevent all four conditions", "Use the Banker's algorithm"], a: 0, e: "Most general-purpose OSes leave deadlock handling to applications or administrators." },
    { q: "Which recovery method rolls a process back to an earlier safe state?", o: ["Rollback using checkpoints", "Process termination only", "Increasing RAM", "Defragmentation"], a: 0, e: "Rollback restores a checkpoint and restarts from there, releasing resources." },
    { q: "For single-instance resources, detection can use which graph?", o: ["Wait-for graph", "Precedence graph", "Page table", "Gantt chart"], a: 0, e: "A wait-for graph links processes directly; a cycle indicates deadlock." },
  ],
  "logical-vs-physical-addresses": [
    { q: "Which hardware unit translates logical addresses to physical addresses at runtime?", o: ["MMU", "ALU", "DMA controller", "Disk controller"], a: 0, e: "The memory management unit performs translation on every memory access." },
    { q: "With a relocation register of 14000, logical address 346 maps to what physical address?", o: ["14346", "13654", "346", "14000"], a: 0, e: "Physical address = base + logical = 14000 + 346." },
    { q: "Which address binding time lets a process move in memory during execution?", o: ["Execution time", "Compile time", "Load time", "Link time"], a: 0, e: "Execution-time binding, supported by the MMU, allows relocation while running." },
  ],
  "contiguous-allocation-fragmentation": [
    { q: "Free holes of 100 KB, 500 KB, 200 KB, 300 KB and 600 KB. Which hole does best fit choose for 212 KB?", o: ["300 KB", "500 KB", "600 KB", "200 KB"], a: 0, e: "Best fit picks the smallest hole that fits: 300 KB." },
    { q: "Total free memory is enough for a request, but no single block is big enough. What is this?", o: ["External fragmentation", "Internal fragmentation", "Thrashing", "Paging"], a: 0, e: "External fragmentation leaves free memory scattered in small pieces." },
    { q: "Which technique removes external fragmentation by moving processes together?", o: ["Compaction", "Swapping", "Caching", "Prefetching"], a: 0, e: "Compaction shuffles allocated blocks to create one large free block; it needs dynamic relocation." },
  ],
  "paging-and-tlb": [
    { q: "With 4 KB pages and 32-bit logical addresses, how many bits form the page offset?", o: ["12", "20", "10", "32"], a: 0, e: "4 KB = 2¹², so 12 offset bits and 20 page number bits." },
    { q: "Memory access takes 100 ns, TLB lookup is negligible and the hit ratio is 80%. What is the effective access time?", o: ["120 ns", "100 ns", "180 ns", "200 ns"], a: 0, e: "0.8 × 100 + 0.2 × 200 = 120 ns; a miss needs one extra access for the page table." },
    { q: "Paging eliminates which kind of fragmentation?", o: ["External fragmentation", "Internal fragmentation", "Both", "Neither"], a: 0, e: "Any free frame fits any page, but the last page of a process may be partly empty (internal fragmentation)." },
  ],
  "multilevel-paging-segmentation": [
    { q: "Why use multilevel page tables?", o: ["To avoid allocating a huge single page table for sparse address spaces", "To make lookups faster than one level", "To remove the TLB", "To eliminate page faults"], a: 0, e: "Only the parts of the table actually used need to exist in memory." },
    { q: "An inverted page table has one entry per what?", o: ["Physical frame", "Virtual page of each process", "Process", "Disk block"], a: 0, e: "Its size scales with physical memory, not with virtual address spaces." },
    { q: "Segmentation divides a program into what?", o: ["Variable-size logical units such as code, stack and data", "Fixed-size pages", "Disk sectors", "Threads"], a: 0, e: "Segments match the programmer's view, but variable sizes reintroduce external fragmentation." },
  ],
  "demand-paging-page-faults": [
    { q: "What causes a page fault?", o: ["Accessing a page not currently in physical memory", "Dividing by zero", "A full disk", "A network timeout"], a: 0, e: "The MMU finds the page marked invalid, traps to the OS, which loads it from disk." },
    { q: "Memory access is 200 ns, fault service is 8 ms, and the fault rate is 1 in 1000. Roughly what is the effective access time?", o: ["About 8.2 µs", "About 200 ns", "About 8 ms", "About 400 ns"], a: 0, e: "0.999 × 200 ns + 0.001 × 8,000,000 ns ≈ 8,200 ns. Even rare faults dominate." },
    { q: "Pure demand paging means what?", o: ["No page is loaded until it's first referenced", "All pages load at start", "Pages never leave memory", "Only the kernel is paged"], a: 0, e: "A process starts with no pages in memory and faults them in as needed." },
  ],
  "page-replacement-algorithms": [
    { q: "Which algorithm can show Belady's anomaly?", o: ["FIFO", "LRU", "Optimal", "LFU in all cases"], a: 0, e: "With FIFO, more frames can cause more faults. Stack algorithms such as LRU and Optimal can't." },
    { q: "Reference string 7, 0, 1, 2, 0, 3, 0, 4 with 3 frames under FIFO. How many page faults?", o: ["7", "6", "5", "8"], a: 0, e: "Faults on 7, 0, 1, 2, 3, 0 (after 0 was evicted) and 4; only the first repeat of 0 hits. That's 7 faults." },
    { q: "Why can't the optimal algorithm be used in practice?", o: ["It needs to know future references", "It's too slow to code", "It uses too many frames", "It causes Belady's anomaly"], a: 0, e: "Optimal evicts the page used farthest in the future, so it serves only as a benchmark." },
  ],
  "thrashing-and-working-set": [
    { q: "What is thrashing?", o: ["The system spends more time paging than executing", "The CPU overheats", "The disk is full", "Threads deadlock"], a: 0, e: "Too few frames for active pages causes constant faults and low CPU utilization." },
    { q: "Why can increasing the degree of multiprogramming make thrashing worse?", o: ["Each process gets even fewer frames", "It adds more RAM", "It reduces page faults", "It disables swapping"], a: 0, e: "When utilization drops, a naive scheduler admits more processes, deepening the frame shortage." },
    { q: "The working set model allocates frames based on what?", o: ["Pages referenced in the recent window of time", "Process size", "Priority", "File size"], a: 0, e: "Giving each process its working set keeps its locality in memory and prevents thrashing." },
  ],
  "file-system-basics": [
    { q: "Which allocation method gives fast random access but suffers external fragmentation?", o: ["Contiguous allocation", "Linked allocation", "Indexed allocation", "FAT chains"], a: 0, e: "Contiguous files allow direct block calculation but need contiguous free space." },
    { q: "What does an inode NOT store in Unix file systems?", o: ["The file's name", "File size", "Owner and permissions", "Block pointers"], a: 0, e: "Names live in directory entries that map names to inode numbers; that's why hard links work." },
    { q: "Linked allocation is poor for which access pattern?", o: ["Random access", "Sequential reads", "Appending", "Creating small files"], a: 0, e: "Reaching block n means following n pointers from the start." },
  ],
  "disk-scheduling": [
    { q: "Head at 53, queue 98, 183, 37, 122, 14, 124, 65, 67. What is the total head movement under FCFS?", o: ["640", "236", "208", "382"], a: 0, e: "Summing the distances in arrival order gives 640 cylinders." },
    { q: "Which algorithm can starve requests far from the head?", o: ["SSTF", "FCFS", "C-SCAN", "SCAN"], a: 0, e: "Shortest seek time first keeps serving nearby requests, so distant ones may wait indefinitely." },
    { q: "How does C-SCAN differ from SCAN?", o: ["It returns to the start without serving requests, giving more uniform waits", "It serves in both directions", "It picks the nearest request", "It never moves the head"], a: 0, e: "C-SCAN treats the disk as circular, so wait times are more even." },
  ],
  "io-systems-and-raid": [
    { q: "What does DMA allow?", o: ["Devices to transfer data to memory without the CPU copying each byte", "Faster CPU clock", "More RAM", "Encrypting the disk"], a: 0, e: "The DMA controller moves blocks and interrupts the CPU when done." },
    { q: "Which RAID level offers striping with distributed parity and survives one disk failure?", o: ["RAID 5", "RAID 0", "RAID 1", "RAID 0+0"], a: 0, e: "RAID 5 spreads parity across all disks, tolerating any single disk failure." },
    { q: "Why are interrupts preferred over polling for slow devices?", o: ["The CPU does other work instead of repeatedly checking device status", "Polling is impossible", "Interrupts are slower", "Polling needs DMA"], a: 0, e: "Polling wastes cycles when events are rare; interrupts notify the CPU only when needed." },
  ],
};
