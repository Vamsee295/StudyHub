// Long-form theory for OS modules 3-4 (threads, CPU scheduling). Original writing.
import { LessonTheory } from './utils';

const OSTEP = { title: "Operating Systems: Three Easy Pieces (Arpaci-Dusseau), free online", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" };
const LINUX_SCHED = { title: "Linux kernel documentation: Scheduler", url: "https://docs.kernel.org/scheduler/index.html", license: "GPL-2.0" };
const JAVA_CONCURRENCY = { title: "Java documentation: Concurrency tutorial (threads, executors)", url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/" };
const JAVA_VIRTUAL = { title: "JEP 444: Virtual Threads", url: "https://openjdk.org/jeps/444" };
const AMDAHL = { title: "Gene Amdahl, Validity of the single processor approach (1967)", url: "https://dl.acm.org/doi/10.1145/1465482.1465560" };

export const osSchedulingTheory: Record<string, LessonTheory> = {
  "threads-vs-processes": {
    theory: `A thread is an independent sequence of instructions inside a process. A process can run several threads, and they all share the process's memory while each keeps its own place in the code. Threads let one program do several things at once without the cost and isolation of separate processes. This lesson explains what threads share, what each owns, and the trade-offs between threads and processes.

## The idea

A process is a container: an address space, open files and other resources. A thread is an activity running inside that container. Every process starts with one thread, and it can create more.

Consider a word processor. One thread responds to your typing, a second checks spelling in the background, and a third saves a backup every few minutes. All three work on the same document in memory. If they were separate processes, each would need its own copy of the document, or a shared-memory arrangement to keep one copy in sync.

## What threads share and what they own

Threads of the same process share everything that belongs to the process, and each keeps what it needs to run independently:

| Shared by all threads | Private to each thread |
|---|---|
| Code (text section) | Thread ID |
| Global and static data | Program counter |
| Heap (dynamically allocated memory) | CPU registers |
| Open files and sockets | Stack (local variables, call frames) |
| Signal handlers, working directory | Thread-local storage |

The private stack is what lets each thread call functions independently. The shared heap is what lets threads cooperate without copying data.

## Why threads are cheaper

Creating a process means building a new address space, page tables and a PCB. Creating a thread needs only a stack and a small thread control block (TCB), because the address space already exists. Switching between threads of one process also skips the page-table switch, so the caches and translation lookaside buffer stay useful. On Linux, creating a thread is commonly several times faster than creating a process, and the gap grows with the size of the process's memory.

## Communication is free, and dangerous

Threads communicate by reading and writing shared variables, with no system call and no copying. That's their biggest advantage and their biggest risk. If two threads increment a shared counter at once, both can read the old value, add one, and write back the same result, losing an update. Shared data needs synchronization, which the synchronization module covers in detail.

## Isolation is weaker

Processes protect each other: a crash in one leaves the others running. Threads offer no such protection. A thread that dereferences a bad pointer causes a segmentation fault that terminates the entire process, killing every thread in it. A thread that corrupts the heap breaks every other thread that uses the heap.

## When to choose which

Choose processes for isolation and threads for cheap sharing:

- **Processes**: untrusted or crash-prone work (browser tabs), separate programs, security boundaries, using several machines
- **Threads**: parallel work on shared data within one program, responsive user interfaces, servers handling many connections

Many systems combine both. Chrome uses a process per site for isolation and many threads inside each process. PostgreSQL uses a process per connection, while MySQL uses a thread per connection: two valid answers to the same design question.

## Threads in practice

In Java, you start a thread by giving a \`Runnable\` to a \`Thread\` and calling \`start()\`. In Python, the \`threading\` module does the same, though the global interpreter lock (GIL) in standard CPython lets only one thread run Python code at a time, so threads help with waiting on input and output more than with parallel computation. In C, POSIX threads (\`pthread_create\`) provide the same model.

## Concurrency bugs depend on timing

Thread bugs are hard because they depend on the exact interleaving of instructions, which changes from run to run. A race condition might appear once in a thousand runs, or only on a machine with more cores. Testing alone rarely proves thread code correct; careful design with locks, immutable data and well-tested concurrent collections does.

## How interviewers test this

Expect "Process vs thread" and "What do threads share?" Answer with the table: shared code, data, heap and files; private stack, registers and program counter. Then give one trade-off each way: threads are cheaper and share data directly, while processes isolate failures.`,
    sources: [OSTEP, JAVA_CONCURRENCY]
  },

  "user-vs-kernel-threads": {
    theory: `Threads can be managed by a library in user space, by the kernel, or by a combination of both. The choice decides whether one blocked thread stalls the whole program and whether threads can use several CPU cores at once. This lesson explains user-level and kernel-level threads and the three ways of mapping one onto the other, with the languages and systems that use each.

## Who knows about the threads?

The central question is whether the kernel knows a thread exists. If it does, the kernel can schedule that thread on any core and keep the others running when it blocks. If it doesn't, the kernel sees only the process, and every scheduling decision about the threads happens in user space.

## User-level threads

User-level threads are created and scheduled by a library inside the process. The kernel sees one schedulable entity. Switching between user threads is a function call within the process, with no system call and no mode switch, so it's fast.

The weaknesses follow from the kernel's ignorance:

- **One blocks, all block**: if one user thread makes a blocking system call such as reading a file, the kernel blocks the whole process, including threads that could have run
- **No parallelism**: the kernel gives the process one CPU at a time, so its threads can't run on several cores at once

## Kernel-level threads

Kernel-level threads are known to and scheduled by the kernel. Each has its own entry in the kernel's scheduling structures. When one blocks on input or output, the kernel runs another thread of the same process, and threads can run truly in parallel on different cores.

The cost is that creating, switching and synchronizing kernel threads involves the kernel, which is slower than a function call in user space. Creating hundreds of thousands of them also uses significant kernel memory, mostly for their stacks.

## Many-to-one

The many-to-one model maps many user threads onto a single kernel thread. It's cheap and portable, and it inherits every weakness of user-level threads: one blocking call stops everything, and there's no parallelism. Early Java "green threads" and some older thread libraries used it. It has mostly disappeared from general-purpose systems.

## One-to-one

The one-to-one model maps each user thread to its own kernel thread. Blocking and parallelism both work correctly, at the cost of kernel involvement for every thread. Linux's POSIX threads (NPTL), Windows threads and Java's traditional platform threads all use one-to-one. It's the default in most systems today because kernels became efficient enough at managing many threads.

## Many-to-many

The many-to-many model multiplexes M user threads over N kernel threads, with M usually much larger than N. A user-space scheduler assigns runnable user threads to the available kernel threads, and when one blocks, the runtime moves the others to different kernel threads. You get cheap user threads and real parallelism together, at the cost of a complex runtime.

Go's goroutines work this way: a Go program can run hundreds of thousands of goroutines over a small pool of kernel threads, roughly one per core. Java 21's virtual threads follow the same idea: millions of lightweight threads mounted on a few carrier threads, with blocking operations automatically unmounting the virtual thread so its carrier can run another.

## Comparison

| Model | Mapping | Blocking call | Parallelism | Examples |
|---|---|---|---|---|
| Many-to-one | Many user threads to 1 kernel thread | Blocks every thread | None | Early Java green threads |
| One-to-one | Each user thread to its own kernel thread | Blocks only that thread | Yes | Linux pthreads, Windows, Java platform threads |
| Many-to-many | M user threads over N kernel threads | Runtime reschedules others | Yes | Go goroutines, Java virtual threads |

## Why many-to-many is coming back

Servers that handle tens of thousands of simultaneous connections can't afford a kernel thread per connection, but writing them with callbacks is hard to read and debug. Many-to-many runtimes let programmers write ordinary blocking code, one thread per connection, while the runtime keeps the number of kernel threads small. That's the motivation behind both goroutines and Java's virtual threads.

## How interviewers test this

Expect "User-level vs kernel-level threads" and "What happens in the many-to-one model when one thread blocks?" Explain that the kernel only sees one entity, so the whole process blocks. Then name the model your favourite platform uses: one-to-one for Linux and Java platform threads, many-to-many for Go and Java virtual threads.`,
    sources: [OSTEP, JAVA_VIRTUAL, JAVA_CONCURRENCY]
  },

  "multithreading-benefits-and-issues": {
    theory: `Multithreading lets one program use several CPU cores and stay responsive while waiting for slow work. It also introduces limits that more cores can't fix, and patterns that keep threaded code manageable. This lesson explains the benefits of threads, the difference between concurrency and parallelism, Amdahl's law, and why real programs use thread pools instead of creating a thread per task.

## Four benefits

Threads give a program four advantages:

- **Responsiveness**: a user interface thread keeps reacting to clicks while a background thread loads a file
- **Resource sharing**: threads share memory, so cooperating parts of a program exchange data without copying it
- **Economy**: creating and switching threads is cheaper than creating and switching processes
- **Scalability**: work divided across threads can run on every core of a multicore machine

## Concurrency and parallelism

These two words are often used interchangeably, and they mean different things. **Concurrency** is about structure: several tasks are in progress during the same period, possibly taking turns on one core. **Parallelism** is about execution: several tasks run at the same instant on different cores.

A single-core machine running a music player and a browser is concurrent but not parallel; the OS switches between them. An 8-core machine encoding a video in 8 pieces is parallel. You can have concurrency without parallelism, but parallelism needs concurrency, because you must first divide the work into independent tasks.

## Amdahl's law

Splitting work across more cores helps only with the part that can be split. If a fraction S of a program must run serially, the maximum speedup with N cores is:

~~~text
Speedup ≤ 1 / (S + (1 − S) / N)
~~~

Take a program that's 25% serial on 4 cores: 1 / (0.25 + 0.75 / 4) = 1 / 0.4375, about 2.29 times faster, not 4. With infinitely many cores the limit is 1 / S = 4 times. The serial part sets the ceiling, which is why reducing serial work, such as a single shared lock every thread waits for, often matters more than adding cores.

## Gustafson's view

Amdahl's law assumes a fixed problem size. In practice, people often use more cores to solve bigger problems in the same time, for example simulating a finer grid or training on more data. Gustafson's law describes that case, where the parallel part grows with the machine and speedups scale much better. Both views are correct; they answer different questions.

## Thread pools

Creating a new thread for every task, such as every web request, has three problems. Thread creation costs time on every request. Under a traffic spike the server creates thousands of threads, each with its own stack, and runs out of memory. And with far more runnable threads than cores, the CPU spends its time switching between them instead of working.

A **thread pool** solves all three. It keeps a fixed set of worker threads that take tasks from a queue. Requests wait in the queue when all workers are busy, which bounds memory use and keeps the number of runnable threads near the number of cores. Java's \`ExecutorService\`, web servers such as Tomcat, and database connection pools all follow this pattern.

## Sizing a pool

For CPU-bound work, a pool about the size of the core count is usually right, since more threads only add switching. For I/O-bound work, threads spend most of their time waiting, so a larger pool keeps the CPU busy. A common estimate is cores × (1 + wait time / compute time). Measure under realistic load rather than trusting any formula.

## Common threading problems

Threads bring their own failure modes:

- **Race conditions**: results depend on timing because shared data isn't protected
- **Deadlocks**: threads wait for each other's locks forever
- **Starvation**: a thread never gets the resource it needs because others always win
- **Contention**: many threads wait on one lock, so adding threads adds waiting instead of speed

Modern practice reduces these by sharing less: immutable data, message passing between threads, and thread-safe collections such as Java's \`ConcurrentHashMap\`.

## How interviewers test this

Expect "Concurrency vs parallelism" and an Amdahl's law calculation. State the distinction with the single-core example, and for Amdahl, show the formula, the numbers, and the 1 / S ceiling. Mentioning thread pools and why they beat one thread per request is a common follow-up in backend interviews.`,
    sources: [OSTEP, AMDAHL, JAVA_CONCURRENCY]
  },

  "scheduling-criteria": {
    theory: `CPU scheduling decides which ready process runs next. Before comparing algorithms, you need a precise way to measure what "good" means, and that's what the scheduling criteria and timing formulas provide. This lesson defines arrival, burst, completion, turnaround, waiting and response time, explains preemptive versus non-preemptive scheduling, and shows how to compute every metric from a Gantt chart.

## Why scheduling matters

With more ready processes than cores, some must wait. The scheduler's choices decide whether an interactive editor feels instant or sluggish, whether a batch job finishes overnight or by morning, and whether any process waits forever. Different systems want different things, so there's no single best algorithm, only the best fit for a goal.

## Preemptive and non-preemptive scheduling

A **non-preemptive** scheduler lets the running process keep the CPU until it finishes or blocks for input or output. A **preemptive** scheduler can take the CPU away, when a time slice expires or when a higher-priority process becomes ready.

Non-preemptive scheduling is simpler to implement and avoids some synchronization problems inside the kernel, but one long process can make everyone else wait. Every modern general-purpose OS is preemptive, because responsiveness matters more than that simplicity.

## The time definitions

Every scheduling calculation uses these quantities:

| Term | Meaning | Formula |
|---|---|---|
| Arrival time (AT) | When the process enters the ready queue | Given |
| Burst time (BT) | CPU time the process needs | Given |
| Completion time (CT) | When the process finishes | Read from the Gantt chart |
| Turnaround time (TAT) | Total time from arrival to completion | TAT = CT − AT |
| Waiting time (WT) | Time spent ready but not running | WT = TAT − BT |
| Response time (RT) | Time until the process first runs | RT = first start − AT |

For a process that never blocks, waiting time is everything in its turnaround that isn't running. Turnaround minus the time it actually ran (its burst) gives exactly that.

## A worked calculation

A process arrives at time 2, needs 4 units of CPU, first runs at time 5 and completes at time 11. Its turnaround is 11 − 2 = 9, its waiting time is 9 − 4 = 5, and its response time is 5 − 2 = 3.

The difference between waiting and response time matters with preemption. A process can start quickly, giving low response time, then get preempted several times, giving high waiting time. Interactive systems care most about response time, because users notice the first reaction.

## The Gantt chart

A Gantt chart is a timeline showing which process runs during each interval, such as \`| P1 0–5 | P2 5–8 | P3 8–9 |\`. Every metric comes from it: completion times are where each process's last block ends, and first-start times give response times. Drawing the chart carefully is most of the work in any scheduling question; the arithmetic afterwards is mechanical.

## What schedulers optimize

| Criterion | Goal | Who cares most |
|---|---|---|
| CPU utilization | Maximize | Everyone; an idle CPU is waste |
| Throughput | Maximize (processes finished per unit time) | Batch systems |
| Turnaround time | Minimize | Batch users waiting for results |
| Waiting time | Minimize | The direct target of the algorithm |
| Response time | Minimize | Interactive users |
| Fairness | No process starves | Shared systems |

These goals conflict. Running the shortest jobs first minimizes average waiting time but can starve long jobs. Short time slices improve response time but waste CPU on context switches. Choosing an algorithm means choosing which goals matter most.

## Waiting time is what scheduling controls

A process's burst time is fixed by its code, so the scheduler can't change how long a process computes. What it can change is how long processes wait in the ready queue, which is why waiting time is the standard measure for comparing algorithms in exams.

## Dispatch latency

Switching from one process to another isn't free. The dispatcher saves state, switches memory mappings and restores the next process, and the time this takes is called dispatch latency. Exam problems usually ignore it, but real schedulers account for it when choosing time-slice lengths, because switching too often wastes CPU time.

## How interviewers test this

Exams give a table of arrival and burst times and an algorithm, then ask for average waiting or turnaround time. Draw the Gantt chart first, then fill a table with CT, TAT = CT − AT and WT = TAT − BT for each process. Interviewers also ask "Preemptive vs non-preemptive", answered with what triggers a switch in each.`,
    sources: [OSTEP, LINUX_SCHED]
  },

  "fcfs-sjf-srtf": {
    theory: `First-come-first-served (FCFS), shortest job first (SJF) and shortest remaining time first (SRTF) are the three classic algorithms that order processes by arrival or by length. They're the foundation for every scheduling question, and comparing them shows why the order of execution changes average waiting time so much. This lesson explains each algorithm, its strengths and failures, and how real systems approximate burst lengths they can't know in advance.

## First-come-first-served

FCFS runs processes in the order they arrive, each to completion. It's a single FIFO queue: fair in a narrow sense, never starving anyone, and trivial to implement.

Its weakness is the **convoy effect**. If a long CPU-bound process arrives first, every short process behind it waits for the whole thing. In the course's example workload (P1 arrives at 0 needing 5 units, followed by short jobs P2, P3 and P4), FCFS gives an average waiting time of 4.0, mostly because P3 and P4 wait behind P1 and P2.

The convoy effect also hurts devices. While the long job computes, I/O-bound processes sit in the ready queue instead of keeping the disk busy, so both the CPU and the devices are used poorly.

## Shortest job first

SJF picks the ready process with the shortest next CPU burst. It's non-preemptive: once a process starts, it finishes its burst.

Running short jobs first is provably optimal for average waiting time among non-preemptive algorithms. The intuition: a job that runs early delays every job behind it by its own length, so putting short jobs first minimizes the total delay. On the example workload, SJF lowers the average waiting time from 4.0 to 3.25.

## Shortest remaining time first

SRTF is the preemptive version of SJF. Whenever a new process arrives, the scheduler compares its burst with the remaining time of the running process, and preempts if the newcomer is shorter. On the example, SRTF lowers the average waiting time further, to 2.25, the best of the three, because short arrivals never wait behind a long job in progress.

SRTF is optimal for average waiting time among all algorithms, but it pays for that with more context switches and the risk below.

## Starvation

Both SJF and SRTF can starve long processes. If short jobs keep arriving, a long job may wait indefinitely, because there's always something shorter to run. FCFS never starves anyone, which is one reason pure SJF is rare in practice. The usual fix, aging, raises a waiting process's priority over time and appears in the priority scheduling lesson.

## Predicting burst times

SJF needs to know the next burst length, and the OS can't know the future. Real systems predict it from history using **exponential averaging**:

~~~text
τ(n+1) = α · t(n) + (1 − α) · τ(n)
~~~

Here t(n) is the measured length of the most recent burst, τ(n) is the previous prediction, and α (between 0 and 1, often 0.5) sets how much weight recent behaviour gets. With α = 0.5, the prediction is the average of the last actual burst and the last prediction, so older bursts fade geometrically. An interactive process that keeps doing short bursts earns a short prediction and gets scheduled quickly.

## Comparison on the example workload

| Algorithm | Preemptive | Average waiting time | Main risk |
|---|---|---|---|
| FCFS | No | 4.00 | Convoy effect |
| SJF | No | 3.25 | Starvation; needs burst estimates |
| SRTF | Yes | 2.25 | Starvation; more switches; needs estimates |

## Where these ideas appear today

Pure FCFS still runs inside many systems where fairness of order matters more than average speed: print queues, network packet queues and most message brokers. SJF's idea survives in schedulers that favour short or interactive work, and in database and web servers that prioritize cheap requests so a few expensive reports can't stall everyone. Shortest-remaining-time thinking also appears in disk and network schedulers that serve the smallest pending transfers first.

## Tie-breaking

When two processes have equal bursts or remaining times, exams usually break ties by arrival time, then by process number. State your tie-breaking rule when you answer, because a different rule can change the Gantt chart and therefore the averages.

## How interviewers test this

Exams ask you to compute average waiting and turnaround times for these algorithms on a given workload, and interviewers ask "Which algorithm minimizes average waiting time?" The answer is SRTF overall and SJF among non-preemptive algorithms. Follow it with the catch: both need burst predictions and can starve long jobs.`,
    sources: [OSTEP, LINUX_SCHED]
  },

  "round-robin-and-priority": {
    theory: `Round robin (RR) and priority scheduling address what FCFS and SJF ignore: responsiveness for interactive users and the relative importance of different work. Round robin gives every process a fair turn on a timer, and priority scheduling runs the most important work first. This lesson explains both, how to choose a time quantum, and how aging prevents low-priority processes from starving.

## Round robin

Round robin gives each ready process a fixed time slice, the **quantum** q. A process that doesn't finish within q is preempted and goes to the back of the ready queue, and the next process runs. With n ready processes, no process waits more than (n − 1) × q before running again, which makes response time predictable.

RR is the basis of time-sharing. On the course's example workload with q = 2, its average waiting time is 4.5, worse than SJF's 3.25, but every process starts running within a few units of arriving. For interactive systems, that's the trade worth making.

## The queue rule that decides exam answers

When a process's quantum expires at the same moment a new process arrives, the order in the queue matters. The common exam convention puts the new arrival in the queue first, then the preempted process. Other conventions exist, so state the rule you use, because it changes the Gantt chart.

## Choosing the quantum

The quantum is the single most important design choice in round robin:

- **Too large**: no process is ever preempted, and round robin becomes FCFS, with the convoy effect
- **Too small**: the CPU spends a large share of its time on context switches. With a 1 ms switch and a 4 ms quantum, 20% of CPU time is overhead
- **Rule of thumb**: about 80% of CPU bursts should finish within one quantum, so most interactive work completes in a single turn

Real systems use quanta of roughly 1 to 100 ms, and Linux adjusts slice lengths dynamically based on load.

## Priority scheduling

Priority scheduling assigns each process a priority and always runs the highest-priority ready process. It can be preemptive (a newly ready higher-priority process interrupts the current one) or non-preemptive. Watch the convention in any question: in many textbooks a smaller number means higher priority, and in others the reverse.

Priorities can be internal, computed by the OS from measurable properties such as memory use or the ratio of I/O to CPU time, or external, set by users or administrators. On Linux, the \`nice\` value lets you lower a process's priority, for example to run a backup without slowing down interactive work.

## Starvation and aging

Priority scheduling's classic failure is **starvation**: a low-priority process may never run if higher-priority work keeps arriving. A well-known story describes a low-priority job found on a shut-down MIT mainframe in 1973 that had been waiting since 1967.

The fix is **aging**: gradually increase the priority of processes the longer they wait. A process might gain one priority level for every few seconds in the ready queue. Eventually even the lowest-priority process becomes the highest and runs.

## Priority inversion

A subtler problem appears when priorities meet locks. A low-priority process holds a lock that a high-priority process needs, and a medium-priority process keeps preempting the low-priority one. The high-priority process waits indefinitely, behind a medium-priority one it should outrank. This **priority inversion** famously caused repeated resets on NASA's Mars Pathfinder lander in 1997.

The standard fix is **priority inheritance**: while a low-priority process holds a lock that a high-priority one needs, it temporarily inherits the high priority, finishes its critical section quickly, and releases the lock.

## Connecting the algorithms

Many algorithms are special cases of priority scheduling. SJF is priority scheduling where priority is the predicted next burst, shorter meaning higher. FCFS is priority scheduling by arrival time. Round robin is FCFS with preemption on a timer. Seeing these connections makes it easier to reason about the trade-offs of any new algorithm you meet.

## How interviewers test this

Exams give a workload and a quantum and ask for average waiting time under RR. Interviewers ask "What happens if the quantum is too large or too small?" and "What is starvation and how does aging fix it?" Priority inversion with the Mars Pathfinder example is a strong addition in systems interviews.`,
    sources: [OSTEP, LINUX_SCHED]
  },

  "multilevel-queue-scheduling": {
    theory: `Real systems run a mix of work: interactive editors, background services and long batch jobs. No single algorithm suits all of them, so practical schedulers combine several queues and policies. This lesson explains multilevel queues, the multilevel feedback queue (MLFQ) that learns each process's behaviour, and how Linux's Completely Fair Scheduler (CFS) and its successor EEVDF approach the same problem.

## Multilevel queue scheduling

A multilevel queue divides the ready queue into several permanent queues by process type, for example system processes, interactive processes and batch jobs. Each queue can use its own algorithm: round robin for interactive work, FCFS for batch.

The scheduler must also choose between queues. Two approaches are common:

- **Fixed priority**: always serve the higher queue first; batch jobs run only when no interactive process is ready
- **Time slicing between queues**: give each queue a share of CPU time, such as 80% to interactive and 20% to batch

Processes never move between queues in this design. That keeps scheduling decisions cheap, but the scheduler must know each process's type in advance, and lower queues can starve under fixed priority.

## The problem MLFQ solves

The OS usually doesn't know whether a new process is interactive or CPU-bound, and a process can change its behaviour over time. A compiler reads files (I/O-bound), then optimizes code (CPU-bound). The multilevel feedback queue learns each process's behaviour from what it does and adjusts its priority accordingly.

## How MLFQ works

MLFQ uses several queues with decreasing priority and increasing quantum. Its rules are:

1. A new process enters the top queue, which has the highest priority and the shortest quantum
2. If a process uses its entire quantum, it's probably CPU-bound, so it moves down one queue
3. If a process gives up the CPU before its quantum ends, by blocking for input or output, it stays at its current level
4. The scheduler always runs a process from the highest non-empty queue
5. Periodically, every process is moved back to the top queue (a priority boost)

The result: interactive processes, which use short bursts, stay near the top and get fast response, while CPU-bound jobs sink to lower queues with longer quanta, where they run efficiently with fewer switches.

## Defending against starvation and gaming

Rule 5 prevents starvation. Without it, a steady stream of interactive processes could keep CPU-bound jobs at the bottom from ever running. The boost also helps a process whose behaviour changed from CPU-bound to interactive regain a high priority.

A clever program could game rule 3 by blocking for an instant right before its quantum expires, staying at the top forever. Modern MLFQ designs count the total CPU time a process uses at each level, regardless of how many times it blocked, and demote it once it exceeds that level's allowance.

## Linux's Completely Fair Scheduler

From kernel 2.6.23 (2007), Linux scheduled normal processes with the Completely Fair Scheduler. Instead of queues and fixed quanta, CFS tracks each task's **virtual runtime**: the CPU time it has used, scaled by its weight. Tasks with a lower \`nice\` value (higher priority) have higher weights, so their virtual runtime grows more slowly.

CFS always runs the task with the smallest virtual runtime, the one that has received the least fair share so far. It keeps tasks in a red-black tree ordered by virtual runtime, so finding the next task is fast. An interactive task that sleeps a lot accumulates little virtual runtime and gets the CPU quickly when it wakes, which produces good responsiveness without MLFQ's explicit rules.

## EEVDF

Linux 6.6 (2023) replaced CFS with EEVDF (Earliest Eligible Virtual Deadline First). It keeps CFS's fairness accounting and adds a virtual deadline for each task based on its requested time slice. Among tasks that are owed CPU time, it runs the one with the earliest deadline. Latency-sensitive tasks can request shorter slices and get scheduled sooner, which CFS handled only through heuristics.

## Real-time classes

Linux also provides real-time scheduling classes, \`SCHED_FIFO\` and \`SCHED_RR\`, for tasks with strict timing needs. Real-time tasks always run before normal ones, using fixed priorities. They're powerful and dangerous: a runaway real-time task can starve the whole system, so they require elevated privileges.

## How interviewers test this

Expect "Explain MLFQ" and "How does the Linux scheduler work?" For MLFQ, state the demotion rule, the stay-high rule for interactive processes and the periodic boost against starvation. For Linux, describe virtual runtime and the red-black tree, and mention EEVDF to show your knowledge is current.`,
    sources: [OSTEP, LINUX_SCHED]
  }
};
