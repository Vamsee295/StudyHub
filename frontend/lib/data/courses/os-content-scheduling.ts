// OS Modules 4-6: CPU Scheduling, Process Synchronization, Deadlocks
import { CourseLesson } from './types';

export const cpuSchedulingLessons: CourseLesson[] = [
  {
    id: "scheduling-criteria",
    slug: "scheduling-criteria",
    title: "Scheduling Criteria and the Timing Formulas",
    description: "Arrival, burst, completion, turnaround, waiting and response time, and what a good scheduler optimizes.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Preemptive vs Non-Preemptive",
          content: "Non-preemptive: once a process gets the CPU, it keeps it until it finishes or blocks for I/O.\nPreemptive: the OS can take the CPU away (a timer interrupt, or a higher-priority process arriving). Every modern general-purpose OS is preemptive."
        },
        {
          type: "table",
          title: "Time Definitions (memorize these)",
          headers: ["Term", "Meaning", "Formula"],
          rows: [
            ["Arrival Time (AT)", "When the process enters the ready queue", "Given"],
            ["Burst Time (BT)", "CPU time it needs", "Given"],
            ["Completion Time (CT)", "When it finishes", "Read off the Gantt chart"],
            ["Turnaround Time (TAT)", "Total time in the system", "TAT = CT − AT"],
            ["Waiting Time (WT)", "Time spent in the ready queue", "WT = TAT − BT"],
            ["Response Time (RT)", "Time until it first gets the CPU", "RT = first start − AT"]
          ]
        },
        {
          type: "table",
          title: "What Schedulers Optimize",
          headers: ["Criterion", "Goal"],
          rows: [
            ["CPU utilization", "Maximize (keep the CPU busy)"],
            ["Throughput", "Maximize (processes completed per unit time)"],
            ["Turnaround time", "Minimize"],
            ["Waiting time", "Minimize (the only thing the scheduling algorithm directly controls)"],
            ["Response time", "Minimize (matters most for interactive systems)"],
            ["Fairness", "No process starves"]
          ]
        },
        {
          type: "quickCheck",
          question: "A process arrives at t = 2, needs 4 units of CPU, and completes at t = 11. Its waiting time is:",
          options: ["9", "5", "7", "4"],
          answer: 1,
          explanation: "TAT = 11 − 2 = 9, so WT = 9 − 4 = 5."
        },
        {
          type: "takeaways",
          items: ["TAT = CT − AT; WT = TAT − BT; RT = first run − AT.", "Draw the Gantt chart first; every number comes from it."]
        }
      ]
    }
  },
  {
    id: "fcfs-sjf-srtf",
    slug: "fcfs-sjf-srtf",
    title: "FCFS, SJF and SRTF with a Worked Example",
    description: "First-come-first-served, shortest job first and shortest remaining time first on the same workload.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "table",
          title: "Workload Used Throughout",
          headers: ["Process", "Arrival", "Burst"],
          rows: [["P1", "0", "5"], ["P2", "1", "3"], ["P3", "2", "1"], ["P4", "3", "2"]]
        },
        {
          type: "code",
          title: "FCFS (non-preemptive, in arrival order)",
          language: "text",
          code: "Gantt: | P1 0-5 | P2 5-8 | P3 8-9 | P4 9-11 |\n\nProc  CT  TAT=CT-AT  WT=TAT-BT\nP1     5      5         0\nP2     8      7         4\nP3     9      7         6\nP4    11      8         6\nAverage TAT = 27/4 = 6.75   Average WT = 16/4 = 4.0",
          explanation: "Convoy effect: short jobs P3 and P4 are stuck waiting behind the long P1."
        },
        {
          type: "code",
          title: "SJF (non-preemptive, shortest burst among the ready processes)",
          language: "text",
          code: "t=0: only P1 is ready -> runs 0-5\nt=5: ready P2(3), P3(1), P4(2) -> P3, then P4, then P2\nGantt: | P1 0-5 | P3 5-6 | P4 6-8 | P2 8-11 |\n\nProc  CT  TAT  WT\nP1     5    5   0\nP2    11   10   7\nP3     6    4   3\nP4     8    5   3\nAverage TAT = 24/4 = 6.0   Average WT = 13/4 = 3.25",
          explanation: "SJF gives the minimum average waiting time among non-preemptive algorithms."
        },
        {
          type: "code",
          title: "SRTF (preemptive SJF)",
          language: "text",
          code: "t=0 P1 runs (rem 5)\nt=1 P2 arrives (3) < P1 rem 4  -> preempt, P2 runs\nt=2 P3 arrives (1) < P2 rem 2  -> preempt, P3 runs 2-3 (done)\nt=3 P4 arrives (2); P2 rem 2, P4 2, P1 4 -> tie, earlier arrival P2 runs 3-5\nt=5 P4 runs 5-7, then P1 runs 7-11\nGantt: | P1 0-1 | P2 1-2 | P3 2-3 | P2 3-5 | P4 5-7 | P1 7-11 |\n\nProc  CT  TAT  WT\nP1    11   11   6\nP2     5    4   1\nP3     3    1   0\nP4     7    4   2\nAverage TAT = 20/4 = 5.0   Average WT = 9/4 = 2.25",
          explanation: "SRTF is optimal for average waiting time overall, but long jobs (here P1) can starve if short jobs keep arriving."
        },
        {
          type: "table",
          title: "Comparison",
          headers: ["Algorithm", "Avg WT here", "Pros", "Cons"],
          rows: [
            ["FCFS", "4.00", "Simple, no starvation", "Convoy effect, poor for interactive use"],
            ["SJF", "3.25", "Optimal among non-preemptive", "Needs burst times in advance; starvation"],
            ["SRTF", "2.25", "Optimal average WT", "Starvation, more context switches, needs burst times"]
          ]
        },
        {
          type: "text",
          title: "How Can SJF Know Burst Times?",
          content: "It can't know them exactly. Real systems predict the next CPU burst using exponential averaging:\nτ(n+1) = α · t(n) + (1 − α) · τ(n)\nwhere t(n) is the actual length of the last burst, τ(n) the previous prediction, and α (often 0.5) controls how much recent history counts."
        },
        {
          type: "quickCheck",
          question: "Which algorithm suffers from the convoy effect?",
          options: ["SRTF", "Round Robin", "FCFS", "Priority with aging"],
          answer: 2,
          explanation: "In FCFS one long CPU-bound job holds up all the short jobs queued behind it."
        },
        {
          type: "takeaways",
          items: [
            "FCFS: arrival order, convoy effect.",
            "SJF: shortest burst first, optimal non-preemptive average WT.",
            "SRTF: preemptive SJF, optimal average WT, risk of starvation."
          ]
        }
      ]
    }
  },
  {
    id: "round-robin-and-priority",
    slug: "round-robin-and-priority",
    title: "Round Robin and Priority Scheduling",
    description: "Time quanta, the RR queue rules, priority scheduling, starvation and aging.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Round Robin (RR)",
          content: "Each process gets a fixed time quantum q. If it doesn't finish within q, it is preempted and goes to the back of the ready queue. RR is designed for time-sharing: no process waits more than (n − 1) × q before it runs again.\n\nQueue rule used here (the common exam convention): when a process arrives at the same moment another's quantum expires, the new arrival enters the queue first, then the preempted process."
        },
        {
          type: "code",
          title: "RR with q = 2 (same workload: P1 0/5, P2 1/3, P3 2/1, P4 3/2)",
          language: "text",
          code: "t=0-2  P1 (rem 3)     queue at t=2: P2, P3, P1\nt=2-4  P2 (rem 1)     P4 arrived at 3 -> queue: P3, P1, P4, P2\nt=4-5  P3 (done)      queue: P1, P4, P2\nt=5-7  P1 (rem 1)     queue: P4, P2, P1\nt=7-9  P4 (done)      queue: P2, P1\nt=9-10 P2 (done)\nt=10-11 P1 (done)\n\nProc  CT  TAT  WT\nP1    11   11   6\nP2    10    9   6\nP3     5    3   2\nP4     9    6   4\nAverage TAT = 29/4 = 7.25   Average WT = 18/4 = 4.5",
          explanation: "Average waiting time is worse than SJF here, but every process gets the CPU quickly, so response time is good."
        },
        {
          type: "table",
          title: "Choosing the Quantum",
          headers: ["Quantum", "Effect"],
          rows: [
            ["Very large", "RR behaves like FCFS"],
            ["Very small", "Huge context-switch overhead"],
            ["Rule of thumb", "About 80% of CPU bursts should finish within one quantum"]
          ]
        },
        {
          type: "text",
          title: "Priority Scheduling",
          content: "Each process has a priority, and the CPU goes to the highest-priority ready process. (Check the convention in the question: in many textbooks a smaller number means higher priority.) It can be preemptive or non-preemptive.\n\nProblem: starvation. Low-priority processes may never run if higher-priority work keeps arriving.\nSolution: aging. Gradually raise the priority of processes that have been waiting a long time, so every process eventually runs."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Is SJF a special case of priority scheduling?",
              trap: "Saying no, they're different algorithms.",
              solution: "Yes. SJF is priority scheduling where priority = predicted next CPU burst (shorter means higher priority). FCFS is priority scheduling with priority = arrival time."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Round Robin with a very large time quantum behaves like:",
          options: ["SJF", "FCFS", "SRTF", "Priority"],
          answer: 1,
          explanation: "If the quantum is longer than every burst, no process is ever preempted, so it runs in arrival order, which is FCFS."
        },
        {
          type: "takeaways",
          items: [
            "RR: fixed quantum, good response time, no starvation.",
            "Quantum too large → FCFS; too small → switching overhead.",
            "Priority scheduling starves low-priority processes; aging fixes this."
          ]
        }
      ]
    }
  },
  {
    id: "multilevel-queue-scheduling",
    slug: "multilevel-queue-scheduling",
    title: "Multilevel Queues, MLFQ and Real-World Schedulers",
    description: "Separate queues per process class, feedback queues that learn behaviour, and how Linux CFS works.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Multilevel Queue (MLQ)",
          content: "The ready queue is split into permanent queues by process type, for example system → interactive → batch. Each queue can use its own algorithm (RR for interactive, FCFS for batch). Scheduling between queues is usually fixed priority (lower queues run only when the higher ones are empty) or a time split such as 80% / 20%. Processes never move between queues, so lower queues can starve."
        },
        {
          type: "text",
          title: "Multilevel Feedback Queue (MLFQ)",
          content: "Processes move between queues based on how they behave:\n- A new process starts in the top queue (highest priority, small quantum).\n- If it uses its whole quantum (CPU-bound), it moves down one level (lower priority, larger quantum).\n- If it gives up the CPU early (I/O-bound, interactive), it stays high.\n- Aging, or a periodic boost back to the top, prevents starvation.\n\nResult: interactive processes get fast response, and CPU-bound jobs still finish. MLFQ is the most general (and most complex) classic scheduler."
        },
        {
          type: "text",
          title: "Linux CFS (Completely Fair Scheduler)",
          content: "From kernel 2.6.23, CFS tracks each task's virtual runtime (CPU time used, weighted by its nice value) and always runs the task with the smallest virtual runtime, so the task that has had the least CPU goes next. Tasks are kept in a red-black tree ordered by virtual runtime, so picking the next task is fast. Since kernel 6.6, CFS is being replaced by EEVDF, which keeps the same fairness idea and adds latency deadlines."
        },
        {
          type: "quickCheck",
          question: "In MLFQ, a process that keeps using its full time quantum will:",
          options: ["Move up to a higher-priority queue", "Move down to a lower-priority queue", "Be terminated", "Stay in the same queue forever"],
          answer: 1,
          explanation: "Using the full quantum marks it as CPU-bound, so it's demoted. That keeps the top queues free for interactive tasks."
        },
        {
          type: "takeaways",
          items: [
            "MLQ: fixed queues per process class; can starve the lower queues.",
            "MLFQ: processes move between queues based on behaviour; aging prevents starvation.",
            "Linux CFS: run the task with the least virtual runtime, kept in a red-black tree."
          ]
        }
      ]
    }
  }
];

export const synchronizationLessons: CourseLesson[] = [
  {
    id: "race-conditions-critical-section",
    slug: "race-conditions-critical-section",
    title: "Race Conditions and the Critical Section Problem",
    description: "Why count++ is unsafe with threads, and the three requirements every critical-section solution must meet.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Race Condition",
          content: "A race condition happens when the result depends on the timing of threads or processes that share data.\n\ncount++ looks like one step, but the CPU runs it as three:\n1. load count into a register\n2. add 1 to the register\n3. store the register back to count\nIf two threads interleave these steps, one increment can be lost."
        },
        {
          type: "dryRun",
          title: "Losing an Update (count starts at 5)",
          iterations: [
            { step: 1, variables: { "T1": "load → reg1 = 5" }, description: "" },
            { step: 2, variables: { "T2": "load → reg2 = 5" }, description: "A context switch happens before T1 stores its result." },
            { step: 3, variables: { "T1": "reg1 = 6, store → count = 6" }, description: "" },
            { step: 4, variables: { "T2": "reg2 = 6, store → count = 6" }, description: "Two increments ran, but count is 6 instead of 7." }
          ]
        },
        {
          type: "text",
          title: "Critical Section",
          content: "The critical section is the part of the code that accesses shared data. Every process follows the pattern:\nentry section → critical section → exit section → remainder section\n\nA correct solution must satisfy three requirements:\n1. Mutual exclusion: at most one process is inside its critical section at a time.\n2. Progress: if no process is in the critical section, the choice of who enters next can't be postponed forever, and only the processes trying to enter take part in that choice.\n3. Bounded waiting: there is a limit on how many times others can enter before a waiting process gets its turn (no starvation)."
        },
        {
          type: "think",
          question: "A solution uses a shared variable turn and lets P0 enter only when turn == 0 and P1 only when turn == 1, flipping turn on exit. Which requirement fails?",
          answerReveal: "Progress. The processes must strictly alternate. If P0 wants to enter twice in a row while P1 is busy in its remainder section, P0 is blocked even though the critical section is empty."
        },
        {
          type: "quickCheck",
          question: "Which requirement guarantees that a waiting process won't wait forever while others keep entering?",
          options: ["Mutual exclusion", "Progress", "Bounded waiting", "Atomicity"],
          answer: 2,
          explanation: "Bounded waiting limits how many times other processes can enter before a requesting process gets in."
        },
        {
          type: "takeaways",
          items: [
            "Read-modify-write on shared data is not atomic, so races lose updates.",
            "A correct critical-section solution needs mutual exclusion, progress and bounded waiting."
          ]
        }
      ]
    }
  },
  {
    id: "petersons-and-hardware-support",
    slug: "petersons-and-hardware-support",
    title: "Peterson's Solution and Hardware Support (Test-and-Set, CAS)",
    description: "A classic software solution for two processes, and the atomic instructions real locks are built on.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Peterson's Solution (2 processes)",
          language: "c",
          code: "bool flag[2] = {false, false};   // flag[i]: process i wants to enter\nint turn;                        // whose turn it is to yield\n\nvoid enter(int i) {\n    int j = 1 - i;\n    flag[i] = true;              // I want to enter\n    turn = j;                    // but you go first if you also want to\n    while (flag[j] && turn == j)\n        ;                        // busy wait\n}\n\nvoid leave(int i) {\n    flag[i] = false;\n}",
          explanation: "It satisfies all three requirements for two processes. On modern CPUs it needs memory barriers, because the compiler and CPU may reorder these loads and stores."
        },
        {
          type: "code",
          title: "Atomic Hardware Instructions",
          language: "c",
          code: "// Test-and-Set: atomically return the old value and set the flag to true\nbool test_and_set(bool *target) {\n    bool old = *target;\n    *target = true;\n    return old;\n}\n\n// Spinlock built on it\nwhile (test_and_set(&lock))\n    ;                 // spin until the old value was false\n/* critical section */\nlock = false;\n\n// Compare-and-Swap: set *value = new_val only if *value == expected\nint compare_and_swap(int *value, int expected, int new_val) {\n    int old = *value;\n    if (old == expected) *value = new_val;\n    return old;\n}",
          explanation: "The hardware runs each function as one indivisible instruction. They're written in C here only to show what they do. A simple test-and-set lock gives mutual exclusion but not bounded waiting."
        },
        {
          type: "table",
          title: "Busy Waiting (Spinlocks): When It's OK",
          headers: ["Good when", "Bad when"],
          rows: [
            ["Critical sections are very short and there are multiple cores (the wait is shorter than a context switch)", "Waits are long, or there is a single core (spinning wastes the CPU the lock holder needs)"]
          ]
        },
        {
          type: "quickCheck",
          question: "Peterson's solution as written guarantees mutual exclusion for how many processes?",
          options: ["Exactly 2", "Any number", "Only 1", "Exactly 3"],
          answer: 0,
          explanation: "The classic version is for two processes. The generalization to n processes is the filter (or bakery) algorithm."
        },
        {
          type: "takeaways",
          items: [
            "Peterson: flag + turn, correct for 2 processes, needs memory barriers on modern hardware.",
            "Real locks are built on atomic instructions such as test-and-set and compare-and-swap.",
            "Spinlocks suit short waits on multicore machines only."
          ]
        }
      ]
    }
  },
  {
    id: "mutex-and-semaphores",
    slug: "mutex-and-semaphores",
    title: "Mutex Locks and Semaphores",
    description: "wait/signal (P/V), binary vs counting semaphores, mutex vs semaphore, and semaphore value questions.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Mutex",
          content: "A mutex (mutual exclusion lock) has two operations: acquire() and release(). Only the thread that acquired it should release it (ownership). Waiting threads are put to sleep instead of spinning."
        },
        {
          type: "code",
          title: "Semaphore Operations",
          language: "c",
          code: "// S is an integer accessed only through these atomic operations\nwait(S) {          // also called P(), down()\n    S--;\n    if (S < 0) block this process;   // add it to S's waiting queue\n}\n\nsignal(S) {        // also called V(), up()\n    S++;\n    if (S <= 0) wake up one waiting process;\n}",
          explanation: "With this blocking implementation, a negative value −k means k processes are waiting."
        },
        {
          type: "table",
          title: "Types and Uses",
          headers: ["Type", "Values", "Use"],
          rows: [
            ["Binary semaphore", "0 or 1", "Mutual exclusion (like a mutex, but without ownership)"],
            ["Counting semaphore", "Any integer", "N identical resources, e.g. 5 database connections (initialize to 5)"],
            ["Semaphore initialized to 0", "0", "Ordering: make S2 run only after S1 (S1; signal(s) in one thread, wait(s); S2 in the other)"]
          ]
        },
        {
          type: "table",
          title: "Mutex vs Semaphore",
          headers: ["", "Mutex", "Semaphore"],
          rows: [
            ["Purpose", "Locking (mutual exclusion)", "Signalling and counting resources"],
            ["Ownership", "Yes: only the owner unlocks it", "No: any thread can signal"],
            ["Count", "Locked or unlocked", "An integer"],
            ["Typical bug", "Unlocking from the wrong thread", "Mismatched wait/signal pairs"]
          ]
        },
        {
          type: "think",
          question: "A counting semaphore starts at 7. Then 20 wait() and 15 signal() operations are performed. What is the final value?",
          answerReveal: "7 − 20 + 15 = 2. Each wait subtracts 1 and each signal adds 1, regardless of order (using the blocking implementation where the value may go negative)."
        },
        {
          type: "quickCheck",
          question: "To allow at most 3 threads to use a pool of 3 printers at once, initialize a counting semaphore to:",
          options: ["0", "1", "3", "−3"],
          answer: 2,
          explanation: "The initial value is the number of available identical resources."
        },
        {
          type: "takeaways",
          items: [
            "wait/P decrements and may block; signal/V increments and may wake a waiter.",
            "Binary semaphore = lock-like; counting semaphore = N resources; initialized to 0 = ordering.",
            "A mutex has an owner; a semaphore doesn't."
          ]
        }
      ]
    }
  },
  {
    id: "classic-synchronization-problems",
    slug: "classic-synchronization-problems",
    title: "Classic Problems: Producer-Consumer, Readers-Writers, Dining Philosophers",
    description: "The three canonical synchronization problems and their semaphore solutions.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "Bounded-Buffer Producer-Consumer",
          language: "c",
          code: "semaphore mutex = 1;   // protects the buffer\nsemaphore empty = N;   // free slots\nsemaphore full  = 0;   // filled slots\n\nproducer() {\n    while (true) {\n        item = produce();\n        wait(empty);       // wait for a free slot\n        wait(mutex);\n        add_to_buffer(item);\n        signal(mutex);\n        signal(full);      // one more item available\n    }\n}\n\nconsumer() {\n    while (true) {\n        wait(full);        // wait for an item\n        wait(mutex);\n        item = remove_from_buffer();\n        signal(mutex);\n        signal(empty);     // one more free slot\n        consume(item);\n    }\n}",
          explanation: "Order matters: swapping wait(empty) and wait(mutex) in the producer can deadlock. A producer holding mutex while waiting for an empty slot blocks the consumer from ever freeing one."
        },
        {
          type: "code",
          title: "Readers-Writers (readers' preference)",
          language: "c",
          code: "semaphore rw_mutex = 1;   // exclusive access for writers\nsemaphore mutex = 1;      // protects read_count\nint read_count = 0;\n\nwriter() {\n    wait(rw_mutex);\n    /* write */\n    signal(rw_mutex);\n}\n\nreader() {\n    wait(mutex);\n    read_count++;\n    if (read_count == 1) wait(rw_mutex);   // first reader locks out writers\n    signal(mutex);\n    /* read (many readers at once) */\n    wait(mutex);\n    read_count--;\n    if (read_count == 0) signal(rw_mutex); // last reader lets writers in\n    signal(mutex);\n}",
          explanation: "Many readers can read at the same time, but writers can starve while readers keep arriving. Writer-preference versions fix that, at the cost of starving readers instead."
        },
        {
          type: "text",
          title: "Dining Philosophers",
          content: "Five philosophers sit around a table with five chopsticks, one between each pair. A philosopher needs both neighbouring chopsticks to eat.\n\nNaive solution: everyone picks up their left chopstick, then their right. If all five pick up their left at the same moment, everyone waits forever: deadlock.\n\nFixes:\n- Allow at most 4 philosophers at the table at once (a counting semaphore initialized to 4).\n- Asymmetry: odd-numbered philosophers pick up left first, even-numbered pick up right first.\n- Pick up both chopsticks only if both are free (check and take inside a critical section, or use a monitor)."
        },
        {
          type: "quickCheck",
          question: "In the producer-consumer solution, what are the initial values of empty and full for a buffer of size N?",
          options: ["empty = 0, full = N", "empty = N, full = 0", "both 1", "both N"],
          answer: 1,
          explanation: "At the start, all N slots are empty and nothing is full."
        },
        {
          type: "takeaways",
          items: [
            "Producer-consumer: mutex = 1, empty = N, full = 0; wait on the counting semaphore before the mutex.",
            "Readers-writers: the first reader locks writers out, the last reader lets them in; watch for starvation.",
            "Dining philosophers shows how symmetric resource grabbing deadlocks."
          ]
        }
      ]
    }
  },
  {
    id: "monitors-and-condition-variables",
    slug: "monitors-and-condition-variables",
    title: "Monitors and Condition Variables",
    description: "A higher-level synchronization construct, wait/notify, and why you always check conditions in a while loop.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Monitor",
          content: "A monitor is a language-level construct: shared data plus the procedures that operate on it, where only one thread can be active inside the monitor at a time. The compiler or runtime adds the locking, so programmers can't forget a wait() or signal() the way they can with raw semaphores.\n\nCondition variables let a thread wait inside the monitor until something becomes true:\nx.wait(): release the monitor lock and sleep until signalled.\nx.signal(): wake one waiting thread (it does nothing if none are waiting, unlike a semaphore signal, which is remembered)."
        },
        {
          type: "code",
          title: "Java: Every Object Is a Monitor",
          language: "java",
          code: "class BoundedBuffer {\n    private final int[] items = new int[10];\n    private int count, putIdx, takeIdx;\n\n    public synchronized void put(int x) throws InterruptedException {\n        while (count == items.length) wait();   // buffer full\n        items[putIdx] = x; putIdx = (putIdx + 1) % items.length; count++;\n        notifyAll();                            // wake waiting consumers\n    }\n\n    public synchronized int take() throws InterruptedException {\n        while (count == 0) wait();              // buffer empty\n        int x = items[takeIdx]; takeIdx = (takeIdx + 1) % items.length; count--;\n        notifyAll();\n        return x;\n    }\n}",
          explanation: "Always use while, not if, around wait(). After waking, the condition may already be false again (another thread got there first), and spurious wakeups are allowed."
        },
        {
          type: "quickCheck",
          question: "Why must a condition be re-checked in a while loop after wait() returns?",
          options: ["wait() never returns", "The condition may be false again by the time the thread runs", "It's required by the compiler", "To release the lock"],
          answer: 1,
          explanation: "Another thread may have changed the state between the signal and this thread re-acquiring the lock, and spurious wakeups can also happen."
        },
        {
          type: "takeaways",
          items: [
            "A monitor = shared data + procedures, with automatic mutual exclusion.",
            "A condition-variable signal is lost if nobody is waiting; a semaphore signal is remembered.",
            "Wrap wait() in a while loop."
          ]
        }
      ]
    }
  }
];

export const deadlockLessons: CourseLesson[] = [
  {
    id: "deadlock-conditions",
    slug: "deadlock-conditions",
    title: "Deadlock: The Four Conditions and Resource Allocation Graphs",
    description: "The Coffman conditions, resource allocation graphs, and the minimum-resources formula.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Definition",
          content: "A set of processes is deadlocked when each one is waiting for a resource held by another process in the set, so none of them can ever continue.\n\nT1 holds the printer and wants the scanner; T2 holds the scanner and wants the printer."
        },
        {
          type: "table",
          title: "The Four Necessary Conditions (Coffman)",
          headers: ["Condition", "Meaning"],
          rows: [
            ["Mutual exclusion", "At least one resource can be held by only one process at a time"],
            ["Hold and wait", "A process holds at least one resource while waiting for more"],
            ["No preemption", "Resources can't be forcibly taken away; they're released voluntarily"],
            ["Circular wait", "A cycle P1 → P2 → ... → Pn → P1, where each waits for the next one's resource"]
          ]
        },
        {
          type: "text",
          title: "Resource Allocation Graph (RAG)",
          content: "Process nodes are circles; resource nodes are squares, with one dot per instance.\nRequest edge: P → R (P is waiting for R).\nAssignment edge: R → P (an instance of R is held by P).\n\nIf every resource has a single instance: a cycle means deadlock.\nIf resources have multiple instances: a cycle means deadlock is possible, but not certain."
        },
        {
          type: "dryRun",
          title: "Minimum Resources to Guarantee No Deadlock",
          iterations: [
            { step: "Setup", variables: { "Processes": "n = 3", "Each needs at most": "k = 4 units" }, description: "How many units R guarantee that a deadlock can never happen?" },
            { step: "Worst case", variables: { "Allocation": "each holds k − 1 = 3 units", "Total held": "n(k − 1) = 9" }, description: "Every process is one unit short: deadlock if R = 9." },
            { step: "Answer", variables: { "R ≥ n(k − 1) + 1": "10" }, description: "One extra unit lets some process finish and release its resources, and then the rest can follow." }
          ]
        },
        {
          type: "quickCheck",
          question: "4 processes each need at most 3 units of a resource. What is the minimum number of units that guarantees no deadlock?",
          options: ["8", "9", "12", "4"],
          answer: 1,
          explanation: "n(k − 1) + 1 = 4 × 2 + 1 = 9."
        },
        {
          type: "takeaways",
          items: [
            "All four conditions must hold for a deadlock; break any one and it can't happen.",
            "RAG: with single-instance resources a cycle means deadlock; with multiple instances only possibly.",
            "Minimum resources for safety: n(k − 1) + 1."
          ]
        }
      ]
    }
  },
  {
    id: "deadlock-prevention-and-avoidance",
    slug: "deadlock-prevention-and-avoidance",
    title: "Deadlock Prevention and Avoidance (Banker's Algorithm)",
    description: "Breaking each Coffman condition, safe states, and a complete Banker's algorithm example.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "table",
          title: "Prevention: Break One Condition",
          headers: ["Condition", "How to break it", "Cost"],
          rows: [
            ["Mutual exclusion", "Make resources shareable (read-only files, spooling)", "Impossible for most resources"],
            ["Hold and wait", "Request every resource at once, or release everything before requesting more", "Low utilization, starvation"],
            ["No preemption", "Take resources from waiting processes (practical for CPU and memory)", "Not possible for printers or locks mid-use"],
            ["Circular wait", "Number the resources and always request them in increasing order", "The most practical approach; used for lock ordering in real code"]
          ]
        },
        {
          type: "text",
          title: "Avoidance: Stay in a Safe State",
          content: "Avoidance grants a request only if the system stays in a safe state, meaning there is some order (a safe sequence) in which every process can get its maximum need and finish.\n\nSafe state → no deadlock is possible.\nUnsafe state → deadlock may happen, but isn't guaranteed.\n\nThe Banker's algorithm needs every process to declare its maximum need up front."
        },
        {
          type: "table",
          title: "Banker's Example: Resources A = 10, B = 5, C = 7",
          headers: ["Process", "Allocation (A B C)", "Max (A B C)", "Need = Max − Alloc"],
          rows: [
            ["P0", "0 1 0", "7 5 3", "7 4 3"],
            ["P1", "2 0 0", "3 2 2", "1 2 2"],
            ["P2", "3 0 2", "9 0 2", "6 0 0"],
            ["P3", "2 1 1", "2 2 2", "0 1 1"],
            ["P4", "0 0 2", "4 3 3", "4 3 1"]
          ]
        },
        {
          type: "dryRun",
          title: "Safety Algorithm (Available = 10 5 7 − total allocated 7 2 5 = 3 3 2)",
          iterations: [
            { step: 1, variables: { "Work": "3 3 2", "Pick": "P1 (need 1 2 2 ≤ 3 3 2)" }, description: "P1 can finish and releases its allocation 2 0 0." },
            { step: 2, variables: { "Work": "5 3 2", "Pick": "P3 (need 0 1 1)" }, description: "Releases 2 1 1." },
            { step: 3, variables: { "Work": "7 4 3", "Pick": "P4 (need 4 3 1)" }, description: "Releases 0 0 2." },
            { step: 4, variables: { "Work": "7 4 5", "Pick": "P0 (need 7 4 3)" }, description: "Releases 0 1 0." },
            { step: 5, variables: { "Work": "7 5 5", "Pick": "P2 (need 6 0 0)" }, description: "Releases 3 0 2 → Work = 10 5 7." },
            { step: "Result", variables: { "Safe sequence": "<P1, P3, P4, P0, P2>" }, description: "Every process can finish, so the state is safe. Other safe sequences may also exist." }
          ]
        },
        {
          type: "text",
          title: "Resource-Request Algorithm",
          content: "When Pi requests resources:\n1. If Request > Need, it's an error (it asked for more than it declared).\n2. If Request > Available, Pi must wait.\n3. Otherwise pretend to grant it: Available −= Request, Allocation += Request, Need −= Request.\n4. Run the safety algorithm. If the state is safe, grant it for real; if not, roll back and make Pi wait."
        },
        {
          type: "quickCheck",
          question: "An unsafe state means:",
          options: ["The system is deadlocked", "Deadlock may happen", "Deadlock is impossible", "Some process has crashed"],
          answer: 1,
          explanation: "Unsafe doesn't mean deadlocked. It only means the OS can no longer guarantee that every process will finish."
        },
        {
          type: "takeaways",
          items: [
            "Prevention breaks a Coffman condition; ordering resources (no circular wait) is the most practical.",
            "Avoidance (Banker's) grants a request only if a safe sequence still exists.",
            "Need = Max − Allocation; repeatedly pick a process whose Need ≤ Work, then Work += its Allocation."
          ]
        }
      ]
    }
  },
  {
    id: "deadlock-detection-and-recovery",
    slug: "deadlock-detection-and-recovery",
    title: "Deadlock Detection, Recovery and the Ostrich Approach",
    description: "Wait-for graphs, detection for multi-instance resources, recovery options, and what real OSs actually do.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Detection",
          content: "Let deadlocks happen, then find them.\n\nSingle-instance resources: collapse the RAG into a wait-for graph (Pi → Pj when Pi waits for a resource Pj holds). A cycle means deadlock. Finding a cycle takes O(n²) time.\n\nMultiple-instance resources: run a Banker-like algorithm using current requests instead of maximum needs. Any process that can never be marked finished is deadlocked."
        },
        {
          type: "table",
          title: "Recovery Options",
          headers: ["Option", "How", "Trade-off"],
          rows: [
            ["Kill all deadlocked processes", "Abort every process in the cycle", "Simple, but loses a lot of work"],
            ["Kill one at a time", "Abort a victim, re-run detection, repeat", "Choose by priority, work done, resources held"],
            ["Resource preemption", "Take resources from a victim and roll it back to a safe point", "Needs checkpointing; avoid picking the same victim every time (starvation)"]
          ]
        },
        {
          type: "text",
          title: "The Ostrich Algorithm",
          content: "General-purpose operating systems such as Linux and Windows mostly ignore deadlocks among user processes, like an ostrich with its head in the sand. Deadlocks are rare, and prevention or avoidance would slow everything down. Applications are expected to avoid them themselves (lock ordering, timeouts). Databases are different: they actively detect deadlocks and abort a victim transaction."
        },
        {
          type: "quickCheck",
          question: "Which approach do Linux and Windows mainly use for deadlocks between user processes?",
          options: ["Banker's algorithm", "Ignore them (ostrich)", "Conservative 2PL", "Detection every second"],
          answer: 1,
          explanation: "The cost of prevention or avoidance outweighs how rarely deadlocks happen, so ordinary OSs leave it to applications."
        },
        {
          type: "takeaways",
          items: [
            "Detection: a cycle in the wait-for graph (single instance), or a detection algorithm (multiple instances).",
            "Recovery: abort processes or preempt resources, choosing victims carefully.",
            "Real OSs mostly use the ostrich approach; databases detect deadlocks and kill a victim."
          ]
        }
      ]
    }
  }
];
