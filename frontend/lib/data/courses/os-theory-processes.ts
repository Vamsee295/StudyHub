// Long-form theory for OS modules 1-2 (introduction, processes). Original writing.
import { LessonTheory } from './utils';

const OSTEP = { title: "Operating Systems: Three Easy Pieces (Arpaci-Dusseau), free online", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" };
const MIT_6S081 = { title: "MIT 6.1810 Operating System Engineering (xv6 notes and labs)", url: "https://pdos.csail.mit.edu/6.1810/" };
const LINUX_MAN = { title: "Linux man-pages project: system calls (section 2)", url: "https://man7.org/linux/man-pages/dir_section_2.html" };
const LINUX_KERNEL_DOCS = { title: "The Linux kernel documentation", url: "https://docs.kernel.org/", license: "GPL-2.0" };

export const osProcessesTheory: Record<string, LessonTheory> = {
  "what-is-an-os": {
    theory: `An operating system (OS) is the software that manages a computer's hardware and gives programs a safer, more convenient way to use it. Without an OS, every program would need its own code to drive the disk, share the CPU with other programs and stay out of their memory. This lesson explains the two jobs an OS does, what the kernel is, and how the hardware's user and kernel modes keep programs from taking over the machine.

## Two jobs: referee and illusionist

An OS does two jobs at once. As a **resource manager** (a referee), it decides which program gets the CPU next, how much memory each one may use, and in what order disk requests are served. As an **abstraction provider** (an illusionist), it hides messy hardware behind clean ideas: a file instead of disk sectors, a process instead of raw CPU registers, a socket instead of a network card's packet buffers.

Each abstraction is an illusion the OS maintains. Your program behaves as if it has the CPU to itself, a private memory starting at address zero, and files that persist forever. Underneath, dozens of programs share one CPU, physical memory is scattered, and disks fail. Most of this course explains how the OS keeps those illusions up.

## What the OS manages

The main subsystems map onto the hardware:

- **Process management**: create, schedule, pause and terminate running programs
- **Memory management**: give each process its own address space and keep processes out of each other's memory
- **File systems**: organize persistent data into files and directories on disks and SSDs
- **Device management**: drive hardware through device drivers, interrupts and buffering
- **Protection and security**: user accounts, permissions, and isolation between programs
- **Networking**: protocol stacks and sockets for talking to other machines

## The kernel

The **kernel** is the core of the OS that's always loaded in memory and runs with full hardware privileges. It contains the scheduler, memory manager, file systems and drivers (depending on the design, as the kernel-architecture lesson explains). Everything else you think of as "the OS", such as the shell, the desktop and system utilities, runs as ordinary programs that ask the kernel for services.

## User mode and kernel mode

The CPU itself enforces the boundary between programs and the kernel. A mode bit records whether the current code is trusted:

- **Kernel mode**: any instruction may run, including privileged ones such as talking to devices, changing memory mappings or disabling interrupts
- **User mode**: privileged instructions are blocked. If a program tries one, the CPU raises an exception and the kernel takes over, usually terminating the program

Applications always run in user mode. That's what stops a buggy game from overwriting the file system or reading another user's passwords from memory.

## Crossing the boundary

User programs enter the kernel in three controlled ways:

- **System calls**: the program deliberately asks for a service, such as reading a file
- **Interrupts**: hardware signals the CPU, for example the timer firing or a disk finishing a read
- **Exceptions (traps)**: the running instruction causes a problem, such as dividing by zero or touching an invalid address

In each case the CPU switches to kernel mode and jumps to a handler the kernel registered at boot time. A program can't choose an arbitrary kernel address to jump to, so it can only use the doors the kernel built.

## The timer interrupt keeps the OS in charge

If a program runs an infinite loop and never makes a system call, how does the OS regain control? Before starting a program, the kernel programs a hardware timer to interrupt the CPU after a few milliseconds. When the timer fires, control returns to the kernel, which can switch to another program. This **preemption** is why one runaway program can't freeze a modern desktop.

## Interrupts versus traps

| | Interrupt | Trap or exception |
|---|---|---|
| Source | A hardware device | The current instruction |
| Timing | Asynchronous: arrives at any moment | Synchronous: caused by the instruction |
| Examples | Timer, keyboard, disk done, packet arrived | \`read()\` system call, divide by zero, page fault |

## How interviewers test this

Expect "What is an operating system?" and "Why do we need user mode and kernel mode?" For the first, name both jobs, resource manager and abstraction provider, with one example each. For the second, explain that privileged instructions are blocked in user mode, so a faulty or malicious program can't damage the system, and that system calls, interrupts and exceptions are the only ways into the kernel.`,
    sources: [OSTEP, MIT_6S081]
  },

  "types-of-operating-systems": {
    theory: `Operating systems evolved as hardware got cheaper and users wanted different things from computers: first maximum throughput, then fast response, then predictable timing. Each era produced a type of OS that still exists in some form today. This lesson walks through batch, multiprogramming, time-sharing, multiprocessor, real-time, distributed and embedded systems, and explains the goal each design optimizes.

## Batch systems: keep the expensive machine busy

Early computers cost millions and filled rooms, so idle time was waste. Batch systems collected jobs (payroll, scientific calculations) on punched cards, grouped similar ones, and ran them one after another without human interaction. The goal was throughput: jobs completed per hour.

The weakness was idle CPU time. When a job waited for a tape drive, which took milliseconds while the CPU could run millions of instructions, the CPU sat unused.

## Multiprogramming: fill the waiting time

Multiprogramming keeps several jobs in memory at once. When the running job waits for input or output, the OS switches the CPU to another job that's ready. The CPU stays busy as long as at least one job can run.

Multiprogramming switches only when a job blocks. A job that computes for an hour without doing input or output keeps the CPU the whole time, which is acceptable for batch work and frustrating for interactive users.

## Time-sharing: fast response for many users

Time-sharing (multitasking) adds preemption. Each program gets a short time slice, typically a few milliseconds, and a timer interrupt forces a switch when it expires. Switches happen so often that every user at a terminal feels the machine is responding to them alone.

The goal shifts from throughput to response time. Linux, Windows and macOS are all time-sharing systems, which is why you can type in an editor while a large compile runs in the background.

## Multiprocessor systems: real parallelism

Multiprocessor systems have two or more CPUs (or cores) sharing memory. Several programs truly run at the same instant instead of taking turns. Almost every machine today is multiprocessor: a laptop has 8 to 16 cores and a server can have over 100.

The OS must now schedule work across cores, keep shared data structures safe when two cores update them at once, and decide whether to keep a process on the same core to reuse its cached data.

## Real-time systems: deadlines first

A real-time OS (RTOS) must finish tasks within strict time limits. Speed alone isn't the goal; predictability is. Real-time systems come in two kinds:

- **Hard real-time**: missing a deadline is a failure. An airbag controller, a pacemaker or a car's anti-lock brakes must react within milliseconds every single time
- **Soft real-time**: missing a deadline degrades quality but is tolerated. A video call that drops a frame or a game that stutters for a moment

RTOSes such as FreeRTOS, Zephyr and VxWorks use priority-based preemptive scheduling and avoid features with unpredictable timing, such as swapping memory to disk.

## Distributed systems: many machines as one

A distributed OS (or distributed system) makes a network of computers cooperate, sharing storage and work, and sometimes presenting them as one system. Cluster managers and distributed file systems are modern examples. The goals are scalability and fault tolerance: if one machine fails, the others continue.

## Embedded and mobile systems

Embedded systems run inside devices: washing machines, routers, smart meters. They have limited memory and power and often a single fixed purpose. Mobile OSes such as Android and iOS are time-sharing systems tuned for battery life, touch input and strict app sandboxing.

## Comparing the goals

| Type | Main goal | Example today |
|---|---|---|
| Batch | Throughput | Nightly payroll or report jobs |
| Multiprogramming | CPU utilization | Foundation of every modern OS |
| Time-sharing | Response time | Linux, Windows, macOS |
| Multiprocessor | Parallel throughput | Every multicore machine |
| Real-time | Meeting deadlines | Automotive and medical controllers |
| Distributed | Scale and fault tolerance | Cluster and cloud systems |
| Embedded and mobile | Efficiency, battery | Routers, Android, iOS |

## How interviewers test this

The most common question is "Multiprogramming vs multitasking": multiprogramming switches only when a job blocks, to keep the CPU busy, while multitasking adds timer-based time slices for responsiveness. The second is "Hard vs soft real-time", answered with one example of each.`,
    sources: [OSTEP, LINUX_KERNEL_DOCS]
  },

  "system-calls": {
    theory: `A system call is how a user program asks the kernel to do something it isn't allowed to do itself, such as reading a file, creating a process or sending data over the network. System calls are the official interface between applications and the OS, and every program you've written depends on them, usually through a library. This lesson explains what happens during a system call, the main categories, and why their cost shapes how programs do input and output.

## Why programs can't do it themselves

User programs run in user mode, where instructions that touch devices or change memory mappings are blocked. A program that wants to read a file needs the disk driver, the file system and permission checks, all of which live in the kernel. The only way to reach them is to ask, and the asking mechanism is the system call.

## What happens during \`read()\`

Calling \`read(fd, buf, 100)\` in C sets off this sequence:

1. The C library wrapper places the system-call number for \`read\` and its arguments in CPU registers
2. It executes a special trap instruction (\`syscall\` on x86-64)
3. The CPU switches to kernel mode and jumps to the kernel's system-call entry point
4. The kernel checks the arguments: is \`fd\` an open file, and is \`buf\` memory this process owns?
5. The kernel performs the read, possibly blocking the process until the disk responds
6. The kernel stores the return value (bytes read, or an error code) in a register
7. A return-from-trap instruction switches back to user mode, and execution continues after the call

Step 4 matters for security. The kernel never trusts pointers from user programs, because a malicious program could pass the address of kernel memory and trick the kernel into overwriting it.

## Library functions versus system calls

Most programmers never write a trap instruction. They call library functions that wrap system calls:

- \`printf\` formats text in user space, then calls the \`write\` system call
- \`fopen\` calls \`open\`, and \`malloc\` occasionally calls \`brk\` or \`mmap\` to get more memory from the kernel
- Java's \`FileInputStream.read\` eventually calls \`read\` through the JVM

The distinction appears in interviews: \`printf\` isn't a system call, but it uses one.

## Categories of system calls

| Category | UNIX and Linux examples | Windows examples |
|---|---|---|
| Process control | \`fork\`, \`exec\`, \`exit\`, \`wait\` | \`CreateProcess\`, \`ExitProcess\` |
| File management | \`open\`, \`read\`, \`write\`, \`close\` | \`CreateFile\`, \`ReadFile\` |
| Device management | \`ioctl\`, \`read\`, \`write\` | \`DeviceIoControl\` |
| Information | \`getpid\`, \`time\`, \`uname\` | \`GetCurrentProcessId\` |
| Communication | \`pipe\`, \`socket\`, \`shmget\` | \`CreatePipe\` |
| Protection | \`chmod\`, \`chown\` | \`SetFileSecurity\` |

On UNIX-like systems, devices often appear as files, so \`read\` and \`write\` work on a terminal, a pipe or a disk file alike. That uniformity is one of UNIX's most influential design choices.

## The cost of a system call

A system call costs far more than a normal function call: switching modes, saving registers, checking arguments, and disturbing the CPU's caches. Writing a 1 MB file one byte at a time would make a million system calls.

That cost is why libraries buffer input and output. The C library's \`printf\` collects output in a user-space buffer and calls \`write\` once the buffer fills or a newline reaches a terminal. Java's \`BufferedReader\` does the same for reads. If your program logs heavily or copies large files, buffering is often the difference between seconds and minutes.

## Watching system calls

On Linux, \`strace\` prints every system call a program makes. Running \`strace ls\` shows \`openat\`, \`getdents64\`, \`write\` and many more. It's one of the fastest ways to see why a program is slow or failing, such as a missing configuration file it keeps trying to open. Windows offers Process Monitor for the same purpose.

## Avoiding the trap for hot calls

Some calls run so often that even the mode switch hurts, such as reading the current time thousands of times per second in a game or a database. Linux maps a small page of kernel-provided code, the vDSO (virtual dynamic shared object), into every process. Calls such as \`clock_gettime\` run there in user mode, reading time data the kernel keeps updated, so they finish without entering the kernel at all.

## How interviewers test this

Expect "What is a system call?" and "Is \`printf\` a system call?" Describe the trap into kernel mode and the argument checks, then explain that \`printf\` is a library function that eventually calls \`write\`. Mentioning buffering as the response to system-call cost shows practical understanding.`,
    sources: [LINUX_MAN, OSTEP, MIT_6S081]
  },

  "kernel-architectures": {
    theory: `Kernel architecture is the decision about which OS services run inside the privileged kernel and which run as ordinary user processes. The choice trades speed against isolation: services inside the kernel call each other quickly but can crash the whole system, while services outside are protected from each other but must communicate through slower messages. This lesson explains monolithic, microkernel, hybrid and layered designs, with the real systems that use each.

## The question every kernel design answers

Every OS has the same list of services: scheduling, memory management, file systems, network stacks and device drivers. A designer must decide which of them run in kernel mode, sharing one address space, and which run in user mode as separate processes. Kernel mode is fast and dangerous; user mode is protected and costs extra communication.

## Monolithic kernels

A monolithic kernel runs all core services in one large kernel address space. The scheduler, memory manager, file systems, network stack and drivers call each other directly as ordinary function calls.

The advantage is speed: reading a file goes from the system-call handler to the file system to the disk driver without any boundary crossings. The disadvantage is that every component shares the kernel's privileges. A bug in one obscure driver can corrupt kernel memory and crash the whole machine, and the kernel's huge code size makes it harder to verify.

Linux and the traditional UNIX kernels are monolithic.

## Loadable kernel modules

Linux softens the monolithic design with **loadable kernel modules**: drivers and file systems that can be added to or removed from a running kernel with \`modprobe\`, without rebooting. That gives much of the flexibility associated with microkernels. Modules still run in kernel mode, though, so a faulty module can still crash the system.

## Microkernels

A microkernel keeps only the minimum in kernel mode: basic scheduling, address-space management and inter-process communication (IPC). File systems, drivers and network stacks run as user-mode server processes that communicate by passing messages.

Reading a file becomes a conversation: the application sends a message to the file-system server, which sends a message to the disk-driver server, and replies come back the same way. Each message needs the kernel to switch between processes, which costs time.

The payoff is isolation. A crashing driver is one failed process that can be restarted while the rest of the system keeps running. The small kernel is also easier to verify: seL4, a microkernel, has a machine-checked mathematical proof that its code matches its specification. QNX, used in cars and medical devices, and MINIX 3 are microkernels.

## Hybrid kernels

Hybrid kernels start from a microkernel-like structure but move performance-critical services back into kernel mode. Windows NT and its descendants, and Apple's XNU kernel in macOS and iOS (which combines the Mach microkernel with BSD components), are hybrids. In practice they run most services in kernel space, so their behaviour is closer to monolithic than the label suggests.

## Layered design

A layered OS stacks components so each layer uses only the services of the layer below: hardware at the bottom, then memory management, then process management, then file systems, then the user interface. Strict layering makes each layer testable in isolation. In practice it's hard to choose an order, because components need each other in both directions, and every layer crossing adds overhead. Dijkstra's THE system (1968) is the classic example, and modern kernels use layering ideas inside subsystems rather than across the whole OS.

## Comparison

| Design | In kernel mode | Strength | Weakness | Examples |
|---|---|---|---|---|
| Monolithic | All core services | Fast direct calls | One bug can crash all | Linux, traditional UNIX |
| Microkernel | IPC, scheduling, memory | Isolation, verifiability | Message-passing overhead | QNX, seL4, MINIX 3 |
| Hybrid | Most services, microkernel-style structure | Balance | Complexity | Windows NT, macOS XNU |
| Layered | Strict stack of layers | Clean, testable | Hard to order, overhead | THE OS |

## The trend toward isolation in practice

Modern systems borrow microkernel ideas without changing architecture. Linux runs some drivers in user space, eBPF lets small verified programs run safely in the kernel, and virtual machines and containers add isolation layers above the kernel. The core trade-off of speed versus isolation keeps appearing, now at different levels of the stack.

## How interviewers test this

Expect "Monolithic vs microkernel": describe what runs in kernel mode in each, then the trade-off between performance and fault isolation. Name Linux as monolithic with loadable modules and Windows or macOS as hybrid. If you mention seL4's formal verification, you show you know why small kernels matter beyond the textbook answer.`,
    sources: [OSTEP, LINUX_KERNEL_DOCS, MIT_6S081]
  },

  "process-and-pcb": {
    theory: `A process is a program in execution: the code plus everything that describes its current activity, such as its memory, open files and CPU registers. The process is the OS's main abstraction for running work, and the process control block (PCB) is the kernel's record of each one. This lesson explains the difference between a program and a process, the layout of a process's memory, and what the PCB stores.

## Program versus process

A **program** is a passive file on disk, such as \`/usr/bin/python3\` or \`chrome.exe\`. A **process** is an active instance of that program: loaded into memory, with a current instruction, data being changed, and files open.

One program can run as many processes at once. Three terminal windows running Python are three processes executing the same program file, each with its own variables and its own position in the code. Modern browsers go further, running each tab as a separate process so a crashing website can't take down the others.

## The memory layout of a process

Each process sees its own address space, a range of memory addresses that appears to start at zero. The OS divides it into regions:

- **Text (code)**: the machine instructions, usually marked read-only so a bug can't overwrite the program
- **Data**: global and static variables, split into initialized data and BSS (zero-initialized)
- **Heap**: memory allocated at run time with \`malloc\` or \`new\`, growing upwards
- **Stack**: one frame per active function call, holding local variables, arguments and return addresses, growing downwards

The heap and stack grow towards each other from opposite ends, which lets either one use the free space between them. Infinite recursion keeps adding stack frames until the stack hits its limit, producing a stack overflow. Allocating memory without freeing it grows the heap until the process runs out, a memory leak.

## The process control block

The kernel tracks every process with a data structure called the **process control block (PCB)**, named \`task_struct\` in Linux. It contains everything the kernel needs to manage and resume the process:

| Field | Purpose |
|---|---|
| Process ID and parent ID | Identify the process and its creator |
| State | New, ready, running, waiting or terminated |
| Program counter | Address of the next instruction to run |
| CPU registers | Saved values while the process isn't running |
| Scheduling information | Priority, time used, position in scheduler queues |
| Memory-management information | Page table location, memory limits |
| Open files | Table of files, pipes and sockets the process uses |
| Accounting | CPU time consumed, resource limits |

When a process stops running, the kernel saves its registers and program counter into its PCB. When it runs again, the kernel loads them back, and the process continues as if nothing happened. That save and restore is the context switch, covered in its own lesson.

## Processes form a tree

Every process except the first is created by another process, its parent. On Linux, the first user process (\`systemd\` or \`init\`, PID 1) starts system services, which start more processes. Running \`pstree\` shows this family tree. When a parent exits before its children, PID 1 adopts the orphans, which the fork lesson explains.

## Isolation between processes

Each process has a private address space, enforced by the memory-management hardware. Process A can't read or write process B's memory, even if both run the same program. That isolation is why a crash in one process rarely affects another, and why processes need explicit inter-process communication to share data.

## Seeing processes on a real system

You can inspect processes directly. On Linux, \`ps aux\` lists them with their IDs, CPU and memory use, and \`/proc/<pid>/maps\` shows a process's memory regions. On Windows, Task Manager's Details tab shows the same information.

## Process identifiers and limits

Each process gets a process ID (PID), a number the kernel reuses after a process exits and its parent collects its status. Systems cap the number of processes to protect themselves: Linux's \`pid_max\` has a kernel default of 32,768, and many distributions raise it to 4,194,304 at boot, and per-user limits stop one account from starving the rest. A runaway script that forks endlessly, a fork bomb, is stopped by those limits rather than by luck.

## How interviewers test this

Expect "Difference between a program and a process", "What does the PCB contain?" and "Where are local variables stored?" Answer with the passive file versus active instance distinction, list the main PCB fields, and say that local variables live in the stack frame of the function that declared them.`,
    sources: [OSTEP, LINUX_KERNEL_DOCS, MIT_6S081]
  },

  "process-states-and-schedulers": {
    theory: `A process doesn't run continuously from start to finish. It waits for input, gets paused so others can run, and occasionally gets moved out of memory entirely. The process state model describes these stages, and the OS's schedulers decide when a process moves between them. This lesson explains the five-state model, the suspended states, and the three schedulers that control a process's lifecycle.

## The five states

A process is always in exactly one of these states:

- **New**: being created; the OS is setting up its PCB and memory
- **Ready**: able to run and waiting for a CPU
- **Running**: executing instructions on a CPU
- **Waiting (blocked)**: unable to continue until an event happens, such as a disk read finishing or a key press
- **Terminated**: finished; the OS is cleaning up its resources

On a single core, only one process is running at a time; the rest are ready or waiting. A machine with 8 cores can have up to 8 running processes at once.

## The transitions

The transitions between states each have a specific cause:

- **New to ready**: the OS admits the process
- **Ready to running**: the scheduler dispatches it to a CPU
- **Running to ready**: a timer interrupt ends its time slice, or a higher-priority process arrives
- **Running to waiting**: the process requests input or output, or waits for an event
- **Waiting to ready**: the event completes, such as the disk read finishing
- **Running to terminated**: the process exits or is killed

One transition never happens: waiting directly to running. When a waiting process's event completes, it joins the ready queue and must be dispatched again. The scheduler stays in control of who gets the CPU.

## Queues

The OS organizes processes into queues. The **ready queue** holds processes waiting for a CPU. Each device has a **device queue** of processes waiting for it. Scheduling is the job of moving processes between these queues and the CPU.

## Suspended states

When memory runs short, the OS can move a whole process out of memory to disk (swap it out). That adds two states:

- **Ready-suspended**: would be ready, but its memory is on disk
- **Waiting-suspended**: waiting for an event, and its memory is on disk

When memory frees up, the process is swapped back in and returns to ready or waiting. With these, the model has seven states. Modern systems usually swap individual pages rather than whole processes, but the idea of suspension remains.

## Three schedulers

Different schedulers make decisions at different time scales:

| Scheduler | Decision | Frequency | Controls |
|---|---|---|---|
| Long-term (job scheduler) | Which new jobs to admit into memory | Rarely, seconds to minutes | The degree of multiprogramming |
| Short-term (CPU scheduler) | Which ready process runs next | Hundreds of times per second | CPU allocation |
| Medium-term (swapper) | Which processes to swap out and back in | Occasionally | Memory pressure |

The short-term scheduler must be fast, because it runs hundreds of times per second, and time spent choosing is time not spent running programs. The long-term scheduler matters most in batch systems; desktop systems admit nearly every program you launch.

## CPU-bound and I/O-bound processes

Processes behave differently while running:

- **CPU-bound**: long stretches of computation and few input or output requests, such as video encoding or training a model
- **I/O-bound**: short bursts of computation between frequent waits, such as a text editor, web server or database client

A good mix keeps both the CPU and the devices busy. If every process is CPU-bound, devices sit idle; if every process is I/O-bound, the CPU sits idle while everything waits. Schedulers often favour I/O-bound processes, because they use the CPU briefly and then free it, which keeps interactive programs responsive.

## Following one process through its states

A student runs a script that reads a large CSV file and prints a summary. It starts in **new**, is admitted to **ready**, and gets dispatched to **running**. Its first \`read\` call blocks it in **waiting** until the disk returns data, after which it goes back to **ready**. While it parses rows its time slice expires several times, cycling between **running** and **ready**. When it prints the summary and exits, it moves to **terminated**, and its parent shell collects the exit status.

## How interviewers test this

Expect "Draw the process state diagram" and "Which transition is impossible?" Draw the five states with labelled transitions, and point out that a waiting process can't move straight to running. For "long-term vs short-term scheduler", contrast how often each runs and what each controls.`,
    sources: [OSTEP, LINUX_KERNEL_DOCS]
  },

  "context-switching": {
    theory: `A context switch is the CPU stopping one process (or thread) and starting another, saving everything needed to resume the first one later. Context switches make multitasking possible, and they're pure overhead: no user work happens while one is in progress. This lesson explains what's saved, what triggers a switch, why switches cost more than their direct time, and why switching threads is cheaper than switching processes.

## Why switch at all

A single core runs one instruction stream at a time. To run dozens of processes "at once", the OS switches between them many times per second. Each process must believe it ran continuously, so the OS must save exactly where it stopped and restore it perfectly later.

## What triggers a switch

Three situations hand control to the kernel, which may then switch:

- **Timer interrupt**: the running process's time slice expired
- **Blocking system call**: the process asked for something slow, such as reading from disk, so it can't continue until the request completes
- **Higher-priority work**: an interrupt makes a more important process ready, and the scheduler preempts the current one

Not every entry into the kernel causes a switch. A fast system call such as \`getpid\` returns to the same process.

## The steps of a switch

When the kernel decides to switch from process A to process B, it follows these steps:

1. Save A's CPU state (program counter, stack pointer, general-purpose registers) into A's PCB
2. Update A's state to ready or waiting and place it in the right queue
3. Ask the scheduler to choose the next process, B
4. Switch the memory mapping to B's address space, by loading B's page-table base into the CPU
5. Restore B's saved CPU state from B's PCB
6. Return to user mode, continuing B at the instruction where it last stopped

From A's point of view, nothing happened except that the clock jumped forward.

## The direct cost

Saving and restoring registers takes a few microseconds on modern hardware. That's small, but it adds up: a system doing 10,000 switches per second spends time on overhead that grows with the switch rate. This is why schedulers choose time slices of several milliseconds rather than microseconds.

A useful exercise: if a context switch takes 1 ms and the time slice is 4 ms, each cycle spends 1 ms switching and 4 ms working, so 1/5, or 20%, of CPU time is wasted. With a 100 ms slice, the waste falls below 1%, but interactive programs wait longer for their turn.

## The indirect cost: cold caches

The larger cost comes after the switch. The CPU keeps recently used data in fast caches, and it keeps recent address translations in the translation lookaside buffer (TLB). Process B's data isn't in those caches, so its first instructions miss repeatedly and wait for main memory, which is roughly 100 times slower than the L1 cache.

Switching address spaces can also invalidate TLB entries, so every memory access must walk the page tables again until the TLB refills. Modern CPUs reduce this with tagged TLB entries (process-context identifiers on x86), which let entries from several processes coexist.

## Threads switch more cheaply

Threads of the same process share one address space. Switching between them skips step 4 entirely: there's no page-table change and no TLB disruption, and the shared code and data may still be in the caches. That's a large part of why threads are called lightweight, and why a busy server uses a pool of threads rather than one process per request.

## Measuring switches

On Linux, \`vmstat 1\` reports context switches per second in its \`cs\` column, and \`pidstat -w\` breaks them down per process into voluntary switches (the process blocked) and involuntary ones (it was preempted). A high involuntary count suggests too many busy threads competing for too few cores.

## How interviewers test this

Expect "What is a context switch and what's saved during it?" and "Why are thread switches cheaper than process switches?" For the first, list the saved state and the PCB's role. For the second, explain that threads share an address space, so there's no page-table switch and the caches and TLB stay useful. The time-slice overhead calculation is a common follow-up.`,
    sources: [OSTEP, MIT_6S081, LINUX_KERNEL_DOCS]
  },

  "process-creation-fork": {
    theory: `On UNIX-like systems, new processes are created by copying an existing one with \`fork()\` and then, usually, replacing the copy's program with \`exec()\`. The parent can wait for the child with \`wait()\`. This pair of steps is unusual, and it explains several behaviours that appear in interviews: fork-counting puzzles, zombie processes and orphan processes. This lesson explains each call and each behaviour.

## fork: one call, two returns

\`fork()\` creates a new process that's a near-exact copy of the caller: same code, same variables, same open files, and the same position in the program. Both processes continue from the line after \`fork()\`. The only difference is the return value:

- in the child, \`fork()\` returns 0
- in the parent, it returns the child's process ID
- on failure, it returns −1 in the parent and no child exists

Programs use that return value to branch: \`if (pid == 0)\` runs child code, and the else branch runs parent code. The copy is independent, so a variable changed in the child doesn't change in the parent.

## Copy-on-write makes fork cheap

Copying gigabytes of memory for every \`fork()\` would be slow, and usually wasted, because the child often replaces itself immediately with \`exec()\`. Modern kernels use **copy-on-write**: parent and child initially share the same physical memory pages, marked read-only. Only when one of them writes to a page does the kernel copy that single page. A fork followed by exec copies almost nothing.

## exec: replace the program

\`exec()\` (in variants such as \`execlp\` and \`execvp\`) loads a new program into the current process, replacing its code, data, heap and stack. The process ID stays the same, and open files stay open unless marked close-on-exec. If \`exec()\` succeeds, it never returns, because the code that called it no longer exists.

A shell runs a command by combining the two: it forks, the child execs the command, and the parent waits. Separating creation from loading lets the child adjust things in between, such as redirecting its output to a file before exec. That's how \`ls > files.txt\` works.

## wait: collect the child

\`wait()\` (or \`waitpid()\`) makes the parent block until a child exits, then returns the child's exit status. That status tells the parent whether the child succeeded and lets the kernel finish cleaning up the child.

## Counting fork calls

Every \`fork()\` doubles the number of processes executing the code after it. Three calls in a row, \`fork(); fork(); fork();\`, produce 2 × 2 × 2 = 8 processes, so a following \`printf\` prints 8 times. In general, n sequential forks give 2^n processes, of which 2^n − 1 are new children.

Conditions change the count. In \`if (fork() && fork()) fork();\`, the first child gets 0 from the first fork, so the \`&&\` short-circuits and that child skips the rest. The parent calls the second fork, whose child also gets 0 and skips. Only the parent reaches the third fork, so the total is 4 processes. For any puzzle with conditions, trace each branch instead of applying the formula.

## Zombie processes

When a child exits, the kernel frees its memory but keeps a small entry in the process table, holding its exit status, until the parent calls \`wait()\`. A child in this state is a **zombie**: it's dead, but its entry remains.

A few zombies are harmless and disappear when the parent collects them. A parent that creates many children and never waits for them fills the process table, and eventually the system can't create new processes. The fix is to call \`wait()\`, or to handle the \`SIGCHLD\` signal and wait for children as they exit.

## Orphan processes

An **orphan** is a child whose parent exits first. The orphan keeps running normally. The kernel re-parents it to PID 1 (\`init\` or \`systemd\`), which periodically waits for its adopted children, so orphans never become permanent zombies. Background services are often started as deliberate orphans, a technique called daemonizing.

## Windows takes a different approach

Windows creates processes with one call, \`CreateProcess\`, which creates a new process and loads a program in a single step. There's no fork-then-exec split, which is simpler to use but less flexible for tasks such as setting up redirection between the two steps.

## How interviewers test this

Expect fork-counting puzzles, "What does fork return?", and "Zombie vs orphan". For counting, use 2^n for sequential calls and trace branches when conditions appear. For zombie versus orphan, say who died first: a zombie is a dead child whose parent hasn't waited; an orphan is a living child whose parent died.`,
    sources: [LINUX_MAN, OSTEP, MIT_6S081]
  },

  "inter-process-communication": {
    theory: `Processes are isolated by design: each has a private address space, so one process can't read another's variables. Inter-process communication (IPC) covers the mechanisms the OS provides for processes that need to cooperate, such as a shell pipeline or a browser's tab processes talking to its main process. This lesson explains the two IPC models, shared memory and message passing, and the main mechanisms built on them.

## Why processes need IPC

Splitting work across processes has real benefits: isolation (a crash in one doesn't kill the others), security (each process gets only the permissions it needs), and parallelism across cores. Chrome runs each site in its own process for exactly these reasons. But cooperating processes must exchange data, and isolation means they can't do it by sharing variables.

## The two models

Every IPC mechanism follows one of two models:

| | Shared memory | Message passing |
|---|---|---|
| How it works | A region of memory is mapped into both processes | The kernel copies data from sender to receiver |
| Speed | Fastest; no kernel involvement after setup | Slower; a system call and copy per message |
| Synchronization | Your responsibility (semaphores, mutexes) | Built into send and receive |
| Works across machines | No | Yes, with sockets |
| Typical use | Large data on one machine | Small messages, distributed systems |

## Shared memory

With shared memory, two processes ask the kernel to map the same physical pages into both address spaces, using \`shmget\` or \`mmap\` on Linux. After that, a write by one process is visible to the other immediately, at memory speed.

The danger is that the kernel no longer coordinates access. If both processes update the same counter at once, they can lose updates, exactly as threads do. Shared memory is always paired with synchronization such as a semaphore, covered in the synchronization module. Databases such as PostgreSQL use shared memory for their buffer cache, with careful locking around it.

## Pipes

A **pipe** is a one-way byte stream: one process writes into one end and another reads from the other. Anonymous pipes connect related processes, typically a parent and child, and the shell uses them for pipelines:

~~~bash
ps aux | grep python | wc -l
~~~

The shell creates two pipes and three processes, connecting each process's output to the next one's input. The kernel buffers data between them (typically 64 KB on Linux) and blocks a writer when the buffer is full or a reader when it's empty, which gives automatic flow control.

**Named pipes (FIFOs)** have a name in the file system, created with \`mkfifo\`, so unrelated processes can open them like files.

## Message queues

A message queue is a kernel-managed list of discrete messages. Unlike a pipe's continuous byte stream, each message keeps its boundaries and can carry a type or priority, so a receiver can pick messages of a particular type. POSIX and System V both provide message queues.

## Sockets

A **socket** is an endpoint for communication that works between processes on the same machine (UNIX domain sockets) or across a network (TCP and UDP sockets). Sockets are the foundation of client-server programs: a web server listens on a socket, and each browser connection is a socket pair. Because the same interface works locally and remotely, a program can move from one machine to many without changing how it communicates.

## Signals

A **signal** is an asynchronous notification with no data attached beyond its type. \`SIGINT\` is sent when you press Ctrl+C, \`SIGTERM\` asks a process to exit cleanly, and \`SIGKILL\` terminates it immediately and can't be caught. A process can install handlers for most signals, for example to save work before exiting. Signals tell a process that something happened; they don't transfer data.

## Choosing a mechanism

Match the mechanism to the need:

- **Large data, same machine, maximum speed**: shared memory plus a semaphore
- **Streaming output from one process to the next**: a pipe
- **Discrete messages with priorities**: a message queue
- **Client and server, possibly on different machines**: sockets
- **Notifying a process of an event**: a signal

## How interviewers test this

Expect "What are the IPC mechanisms?" and "Shared memory vs message passing". List the mechanisms with one use each, then compare the two models on speed, synchronization and whether they work across machines. Explaining how the shell builds a pipeline from pipes is a strong concrete example.`,
    sources: [OSTEP, LINUX_MAN]
  }
};
