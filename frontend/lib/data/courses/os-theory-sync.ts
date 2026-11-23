// Long-form theory for OS modules 5-6 (synchronization, deadlocks). Original writing.
import { LessonTheory } from './utils';

const OSTEP = { title: "Operating Systems: Three Easy Pieces (Arpaci-Dusseau), free online", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" };
const LBOS = { title: "Allen B. Downey, The Little Book of Semaphores (free)", url: "https://greenteapress.com/wp/semaphores/", license: "CC BY-NC-SA 4.0" };
const JAVA_CONCURRENCY = { title: "Java documentation: Concurrency tutorial", url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/" };
const LINUX_LOCKING = { title: "Linux kernel documentation: Locking", url: "https://docs.kernel.org/locking/index.html", license: "GPL-2.0" };
const COFFMAN = { title: "Coffman, Elphick, Shoshani, System Deadlocks (1971)", url: "https://dl.acm.org/doi/10.1145/356586.356588" };

export const osSyncTheory: Record<string, LessonTheory> = {
  "race-conditions-critical-section": {
    theory: `A race condition happens when the result of a program depends on the exact timing of threads or processes that share data. Races cause bugs that appear once in a thousand runs and vanish when you add a print statement, which makes them some of the hardest bugs to find. This lesson explains why even \`count++\` is unsafe with threads, defines the critical-section problem, and states the three requirements every solution must meet.

## Why count++ isn't one step

In source code, \`count++\` looks like a single action. The CPU executes it as three separate instructions:

1. Load the value of \`count\` from memory into a register
2. Add one to the register
3. Store the register back to \`count\`

The OS can switch threads between any two instructions, and on a multicore machine two threads can run these steps at the same moment on different cores.

## Losing an update

Suppose \`count\` is 5 and two threads each increment it once. Thread 1 loads 5 into its register. Before it stores, thread 2 also loads 5. Thread 1 adds one and stores 6, then thread 2 adds one and stores 6. Two increments ran, and \`count\` is 6 instead of 7.

Run this a million times in each of two threads and the final count is usually well below two million, with a different total every run. Nothing crashed and nothing reported an error. The data is wrong, silently.

## Races in real systems

The same pattern appears far beyond counters. Two clerks book the last hostel room at once. Two requests withdraw money from the same wallet, each checking the balance before either writes. A program checks that a file doesn't exist, then creates it, while another process creates it in between (a time-of-check to time-of-use race, which attackers exploit). Each case is a read, a decision, and a write that should have been indivisible but wasn't.

## The critical-section problem

A **critical section** is the part of a program that accesses shared data. Every process that uses the shared data follows the same structure:

- **Entry section**: request permission to enter
- **Critical section**: access the shared data
- **Exit section**: announce that it's done
- **Remainder section**: everything else

The critical-section problem is designing the entry and exit sections so that the shared data stays correct.

## The three requirements

A correct solution must satisfy all three conditions:

- **Mutual exclusion**: at most one process is in its critical section at any time
- **Progress**: if no process is in its critical section and some want to enter, the choice of who enters next can't be postponed forever, and only processes trying to enter take part in the decision
- **Bounded waiting**: after a process requests entry, there's a limit on how many times others can enter before it gets its turn

Mutual exclusion protects the data. Progress prevents the system from stalling when the critical section is free. Bounded waiting prevents any one process from starving.

## A broken attempt: strict alternation

Consider two processes sharing a variable \`turn\`. Process 0 enters only when \`turn == 0\`, and sets \`turn = 1\` when it leaves; process 1 does the reverse. This guarantees mutual exclusion, because \`turn\` can't be both values at once.

It fails progress. If process 0 finishes its critical section and wants to enter again while process 1 is busy elsewhere, it must wait, because \`turn\` is 1. The critical section is empty, yet process 0 can't use it. The processes are forced to alternate even when one has nothing to do.

## Where solutions come from

Solutions fall into three levels, each covered in the following lessons:

- **Software algorithms**, such as Peterson's solution, use only ordinary reads and writes
- **Hardware instructions**, such as test-and-set and compare-and-swap, perform a read and write as one indivisible step
- **OS and language primitives**, such as mutexes, semaphores and monitors, build on those instructions and add sleeping instead of busy waiting

## Avoid sharing when you can

The surest way to avoid races is to avoid shared mutable data. Give each thread its own data and combine results at the end, pass messages instead of sharing variables, or use immutable objects. When sharing is necessary, keep critical sections as short as possible, so threads spend little time waiting for each other.

## How interviewers test this

Expect "What is a race condition?" and "What are the requirements of a critical-section solution?" Use the count++ example with the three instructions and the lost update, then name mutual exclusion, progress and bounded waiting with one sentence each. The strict-alternation example is a good way to show why progress matters.`,
    sources: [OSTEP, LBOS]
  },

  "petersons-and-hardware-support": {
    theory: `Locks have to be built from something. Peterson's solution shows that two processes can achieve mutual exclusion using only ordinary memory reads and writes, and atomic hardware instructions such as test-and-set and compare-and-swap make practical locks for any number of threads. This lesson explains both, why Peterson's solution fails on modern hardware without extra care, and when spinning on a lock is a good idea.

## Peterson's solution

Peterson's solution (1981) protects a critical section shared by two processes, numbered 0 and 1. It uses two shared variables:

- \`flag[i]\`: process i wants to enter
- \`turn\`: whose turn it is to go first when both want in

To enter, process i sets \`flag[i] = true\`, then politely sets \`turn = j\` (the other process). It then waits while \`flag[j]\` is true and \`turn == j\`. To leave, it sets \`flag[i] = false\`.

## Why it works

**Mutual exclusion**: if both processes want in, both set their flags, and both write \`turn\`. Only one write survives, because \`turn\` holds a single value, so exactly one process sees \`turn\` pointing at the other and waits.

**Progress**: if process j doesn't want to enter, \`flag[j]\` is false, so process i enters immediately.

**Bounded waiting**: when process i is waiting and process j leaves and immediately tries again, j sets \`turn = i\`, so i goes next. Neither can enter twice in a row while the other waits.

## Why it breaks on modern hardware

Peterson's proof assumes memory operations happen in program order. Modern CPUs and compilers reorder independent reads and writes for speed. If the read of \`flag[j]\` moves before the write of \`flag[i]\`, both processes can see the other's flag as false and enter together. A correct implementation today needs **memory barriers** (fences), instructions that stop reordering across them. Peterson's solution is therefore taught for the reasoning it shows, not used as written.

## Atomic hardware instructions

Hardware provides instructions that read and write a memory location as one indivisible step, so no other core can act in between.

**Test-and-set** sets a boolean to true and returns its previous value, atomically. A spinlock is a loop around it:

~~~c
while (test_and_set(&lock))
    ;  // spin: lock was already held
/* critical section */
lock = false;
~~~

The first thread to arrive sees \`false\` returned, which means it acquired the lock. Every other thread sees \`true\` and keeps looping until the holder resets \`lock\`.

**Compare-and-swap (CAS)** takes an address, an expected value and a new value. It stores the new value only if the current value equals the expected one, and returns the old value either way. CAS is the basis of lock-free programming: to increment a counter, a thread reads it, computes the new value, and uses CAS to store it only if nobody changed it in between, retrying otherwise. Java's \`AtomicInteger.incrementAndGet\` works this way.

## What a basic spinlock lacks

A test-and-set spinlock guarantees mutual exclusion but not bounded waiting: an unlucky thread can lose the race every time the lock is released. **Ticket locks** fix this. Each arriving thread atomically takes a ticket number, and the lock serves tickets in order, like a token system at a bank counter.

## Spinning versus sleeping

A spinning thread keeps a core busy doing nothing useful while it waits. Whether that's acceptable depends on the situation:

| Spin when | Sleep (block) when |
|---|---|
| Critical sections are a few instructions | Waits may be long |
| Several cores exist, so the holder is running elsewhere | There's a single core, so spinning stops the holder from running |
| A context switch would cost more than the wait | Many threads compete for the lock |

Operating system kernels use spinlocks for short critical sections, especially in interrupt handlers that can't sleep. Application locks, such as Linux's futex-based mutexes, usually spin briefly and then put the thread to sleep, which combines the advantages of both.

## How interviewers test this

Expect "Explain Peterson's solution" and "What is test-and-set or compare-and-swap?" For Peterson, describe \`flag\` and \`turn\` and walk through the case where both processes want in. For the hardware instructions, explain atomicity and sketch a spinlock. Mentioning that Peterson's solution needs memory barriers on modern CPUs shows depth.`,
    sources: [OSTEP, LINUX_LOCKING, JAVA_CONCURRENCY]
  },

  "mutex-and-semaphores": {
    theory: `Mutexes and semaphores are the standard synchronization tools that operating systems and libraries provide on top of atomic instructions. A mutex enforces mutual exclusion; a semaphore is a counter that can enforce mutual exclusion, limit access to a pool of resources, or make one thread wait for another. This lesson explains both, how blocking semaphores work, and the differences interviewers expect you to know.

## Mutex locks

A mutex (mutual exclusion lock) has two operations: \`acquire\` (lock) and \`release\` (unlock). A thread acquires the mutex before its critical section and releases it afterwards. If another thread holds the mutex, the caller waits, usually by sleeping rather than spinning, so it doesn't waste CPU.

A mutex has an **owner**: only the thread that locked it should unlock it. That rule lets libraries detect errors, such as a thread unlocking a mutex it doesn't hold, and supports features such as priority inheritance.

## Semaphores

A semaphore, invented by Edsger Dijkstra, is an integer S accessed only through two atomic operations:

- **wait(S)**, also called P or down: decrement S; if the result is negative, block the calling thread
- **signal(S)**, also called V or up: increment S; if threads are blocked, wake one of them

In this blocking implementation, a negative value −k means k threads are waiting. A semaphore remembers signals: if a thread signals before anyone waits, the count rises, and the next wait passes without blocking.

## Three uses of semaphores

The initial value decides what a semaphore does:

| Initial value | Use | Example |
|---|---|---|
| 1 (binary semaphore) | Mutual exclusion | Protect a shared counter |
| N (counting semaphore) | Limit concurrent access to N identical resources | 5 database connections in a pool |
| 0 | Ordering between threads | Make step B wait until step A finishes |

For ordering, thread 1 runs step A then calls \`signal(s)\`; thread 2 calls \`wait(s)\` then runs step B. Whichever thread runs first, B can't start until A has finished. This is how threads hand work to each other.

## Counting semaphore values

Exam questions ask for a semaphore's final value after a sequence of operations. Each wait subtracts 1 and each signal adds 1, regardless of order, in the blocking implementation. A semaphore starting at 7, after 20 waits and 15 signals, ends at 7 − 20 + 15 = 2.

## Mutex versus binary semaphore

The two look similar and differ in an important way:

| | Mutex | Binary semaphore |
|---|---|---|
| Purpose | Protect a critical section | Signal between threads, or protect a section |
| Ownership | Yes; the locker must unlock | No; any thread may signal |
| Typical bug | Unlocking from the wrong thread | Mismatched or missing signals |
| Extras | Priority inheritance, error checking | None |

Use a mutex to protect data and a semaphore to coordinate or count. Using a semaphore as a lock works, but you lose the ownership checks that catch bugs.

## How blocking semaphores are implemented

A blocking semaphore is a counter plus a queue of waiting threads, and the operations on it must themselves be atomic. The kernel protects them with a short spinlock: \`wait\` takes the spinlock, decrements the counter, and if it went negative, adds the thread to the queue, releases the spinlock and sleeps. \`signal\` takes the spinlock, increments, and wakes one queued thread. The spinlock is held for only a few instructions, so spinning is acceptable there.

## Common semaphore bugs

Semaphores are powerful, and a single misplaced call breaks them:

- **Swapped operations**: calling \`signal\` before the critical section and \`wait\` after it removes protection entirely
- **Missing signal**: one code path forgets to signal, and every later waiter blocks forever
- **Wrong order of waits**: taking two semaphores in different orders in different threads can deadlock, as the producer-consumer lesson shows

Higher-level tools, such as monitors and Java's \`synchronized\`, exist largely to prevent these mistakes.

## How interviewers test this

Expect "Mutex vs semaphore", "What is a counting semaphore used for?" and a final-value calculation. Answer the first with ownership and purpose, the second with a resource pool such as database connections, and the third by summing waits as −1 and signals as +1.`,
    sources: [OSTEP, LBOS, LINUX_LOCKING]
  },

  "classic-synchronization-problems": {
    theory: `Three classic problems capture most of the synchronization patterns you meet in real systems: the bounded-buffer producer-consumer problem, the readers-writers problem and the dining philosophers problem. Each one shows a different danger, such as overflow, starvation or deadlock, and the standard semaphore solutions show how to avoid it. This lesson explains each problem, its solution and the mistake that breaks it.

## Producer-consumer with a bounded buffer

Producers create items and place them in a shared buffer of fixed size N; consumers remove and process them. A print queue, a logging pipeline and a web server's request queue all follow this pattern. Three rules must hold:

- producers must wait when the buffer is full
- consumers must wait when the buffer is empty
- only one thread at a time may modify the buffer's internal structure

## The semaphore solution

Three semaphores enforce the three rules:

- \`empty\`, initialized to N, counts free slots
- \`full\`, initialized to 0, counts filled slots
- \`mutex\`, initialized to 1, protects the buffer itself

A producer calls \`wait(empty)\` to claim a slot, \`wait(mutex)\` to lock the buffer, adds the item, \`signal(mutex)\`, then \`signal(full)\` to announce a new item. A consumer mirrors it: \`wait(full)\`, \`wait(mutex)\`, remove, \`signal(mutex)\`, \`signal(empty)\`.

## The ordering trap

The order of the two waits matters. If a producer calls \`wait(mutex)\` before \`wait(empty)\` and the buffer is full, it sleeps while holding the mutex. No consumer can then acquire the mutex to remove an item, so nobody ever signals \`empty\`: a deadlock. The rule is to wait on the counting semaphore first and take the mutex only once you know you can proceed.

## Readers and writers

A shared resource, such as a timetable or a cached configuration, is read often and written rarely. Several readers can safely read at the same time, but a writer needs exclusive access. Treating every access with one mutex would make readers wait for each other for no reason.

## The readers-preference solution

Two semaphores and a counter implement it:

- \`rw_mutex\`, initialized to 1, gives exclusive access to writers
- \`read_count\` counts active readers
- \`mutex\`, initialized to 1, protects \`read_count\`

A writer waits on \`rw_mutex\`. A reader increments \`read_count\` under \`mutex\`; the first reader also waits on \`rw_mutex\`, locking writers out. When leaving, a reader decrements the count, and the last reader signals \`rw_mutex\`, letting writers in.

## Starvation in readers-writers

In the readers-preference version, a steady stream of readers keeps \`read_count\` above zero, so a waiting writer may never get in. Writers-preference versions block new readers once a writer is waiting, which can starve readers instead. Fair versions queue readers and writers in arrival order. Real libraries provide read-write locks, such as Java's \`ReentrantReadWriteLock\` and POSIX \`pthread_rwlock\`, with configurable fairness.

## The dining philosophers

Five philosophers sit at a round table with five chopsticks, one between each pair. Each alternates between thinking and eating, and needs both neighbouring chopsticks to eat. The problem models processes that each need several shared resources at once.

The naive solution, where each philosopher picks up the left chopstick and then the right, can deadlock: if all five pick up their left chopstick at the same moment, each waits forever for the right one, held by a neighbour.

## Three fixes for the philosophers

Each fix breaks one of the conditions that allows deadlock:

- **Limit the diners**: a counting semaphore initialized to 4 lets at most four philosophers try at once, so at least one can always get both chopsticks
- **Break the symmetry**: odd-numbered philosophers pick up the left chopstick first and even-numbered ones the right, so a circular wait can't form
- **Take both or neither**: a philosopher picks up chopsticks only when both are free, checking and taking them inside a critical section or a monitor

The second fix is the general principle behind lock ordering in real code: always acquire locks in one global order.

## Patterns behind the puzzles

The three problems map onto everyday engineering:

| Problem | Real-world form | Main danger |
|---|---|---|
| Producer-consumer | Work queues, pipelines | Deadlock from wrong wait order |
| Readers-writers | Caches, configuration, shared indexes | Starvation |
| Dining philosophers | Transactions needing several locks | Deadlock from circular waiting |

## How interviewers test this

Expect "Solve the producer-consumer problem with semaphores", with the initial values (\`empty\` = N, \`full\` = 0, \`mutex\` = 1) and the correct wait order. For dining philosophers, explain how the naive version deadlocks and give one fix with the reason it works.`,
    sources: [OSTEP, LBOS, JAVA_CONCURRENCY]
  },

  "monitors-and-condition-variables": {
    theory: `A monitor is a higher-level synchronization construct that bundles shared data with the procedures that use it, and guarantees that only one thread runs inside at a time. Condition variables let a thread inside a monitor wait until some state becomes true. Monitors exist because a single misplaced semaphore call can break a whole program. This lesson explains monitors, condition variables, signalling semantics, and why every wait belongs inside a while loop.

## Why semaphores aren't enough

Semaphores work, but correctness depends on every programmer placing every \`wait\` and \`signal\` correctly. Swap two calls, forget one on an error path, or take two semaphores in the wrong order, and the program races or deadlocks. These mistakes are scattered across the code, so they're hard to find in review.

## What a monitor is

A monitor is a module that contains shared data and the procedures that operate on it. The language or runtime guarantees that at most one thread is active inside the monitor at any time, by acquiring a lock on entry to every procedure and releasing it on exit. You can't forget to lock, because you never write the lock calls yourself.

Java builds this into the language: every object has a monitor lock, and a \`synchronized\` method acquires it automatically. C# uses the \`lock\` statement, and Python's \`threading.Condition\` supports the same pattern explicitly.

## Condition variables

Mutual exclusion alone can't express "wait until the buffer has an item". A condition variable is a queue of threads waiting for some condition to become true. It has two main operations:

- **wait()**: atomically release the monitor lock and sleep; when woken, reacquire the lock before returning
- **signal()** (or \`notify\`): wake one waiting thread, if any; \`broadcast\` (or \`notifyAll\`) wakes all of them

The atomic release-and-sleep in \`wait\` is essential. If a thread released the lock and then went to sleep in two steps, a signal could arrive between them and be missed, leaving the thread asleep forever.

## Signals aren't remembered

A semaphore counts signals, so a signal with no waiter isn't lost. A condition variable's signal is lost if nobody is waiting at that moment. That's why monitor code always checks the actual state (is the buffer empty?) rather than relying on having received a signal. The condition variable is only a way to sleep efficiently until the state might have changed.

## Always wait in a while loop

Correct monitor code waits in a loop that rechecks the condition:

~~~java
synchronized void put(int x) throws InterruptedException {
    while (count == items.length) wait();  // full: wait
    items[putIdx] = x;
    putIdx = (putIdx + 1) % items.length;
    count++;
    notifyAll();                           // wake consumers
}
~~~

The \`while\` matters for two reasons. Between the signal and the woken thread reacquiring the lock, another thread may enter and change the state again, for example by filling the slot the signal announced. And the language specifications for Java and POSIX threads allow **spurious wakeups**, where a thread returns from \`wait\` without any signal. An \`if\` would proceed on a false assumption in both cases; a \`while\` checks again.

## Signal semantics

When a thread signals, two threads want to run inside the monitor: the signaller and the woken waiter. Two designs answer who goes first:

- **Hoare semantics**: the waiter runs immediately and the signaller waits. The waiter knows the condition is still true, so an \`if\` would be safe
- **Mesa semantics**: the signaller continues and the waiter joins the queue for the lock. By the time it runs, the condition may be false again

Almost every real system, including Java, C# and POSIX threads, uses Mesa semantics, which is the deeper reason for the while loop.

## notify versus notifyAll

\`notify\` wakes one arbitrary waiter, and \`notifyAll\` wakes every waiter. \`notify\` is efficient but risky when threads wait for different conditions on the same monitor: it might wake a producer when a consumer was needed, and the woken producer goes back to sleep, leaving everyone waiting. \`notifyAll\` is safer at the cost of waking threads that immediately sleep again. Java's \`java.util.concurrent\` package offers \`Condition\` objects, which let you keep separate wait queues, such as "not full" and "not empty", and signal precisely.

## How interviewers test this

Expect "What is a monitor?", "Why use while instead of if around wait?" and "Difference between a semaphore signal and a condition variable signal". Answer with automatic mutual exclusion, the two reasons for the while loop (Mesa semantics and spurious wakeups), and the fact that condition-variable signals are lost if nobody waits.`,
    sources: [OSTEP, JAVA_CONCURRENCY, LBOS]
  },

  "deadlock-conditions": {
    theory: `A deadlock is a situation where a set of processes are all waiting for resources held by each other, so none of them can ever continue. Deadlocks freeze parts of a system without any error message, and they're common wherever processes or threads hold several locks or resources. This lesson explains the four necessary conditions for deadlock, how to model one with a resource allocation graph, and how to calculate the minimum resources that guarantee deadlock can't happen.

## A deadlock in everyday terms

Two students need both the department's only projector and its only laptop for a presentation. One takes the projector and goes looking for the laptop; the other takes the laptop and goes looking for the projector. Each waits for the other to finish, and neither will give up what they hold. Nothing moves until someone intervenes.

In software, the same thing happens when thread A locks the \`orders\` table and requests \`inventory\`, while thread B holds \`inventory\` and requests \`orders\`.

## The four Coffman conditions

In 1971, Coffman and colleagues showed that a deadlock can happen only if all four of these conditions hold at once:

- **Mutual exclusion**: at least one resource can be held by only one process at a time
- **Hold and wait**: a process holds at least one resource while waiting to acquire more
- **No preemption**: resources can't be forcibly taken away; a process releases them voluntarily
- **Circular wait**: there's a cycle of processes, each waiting for a resource held by the next

All four are necessary. Removing any one of them makes deadlock impossible, which is the basis of every prevention strategy in the next lesson.

## Resources and instances

A resource type can have several identical instances: three printers, or a pool of ten database connections. A process requesting a printer can use any free one. The number of instances matters for deadlock analysis, as the graph rules below show.

## Resource allocation graphs

A resource allocation graph (RAG) models the current state:

- processes are circles and resource types are squares, with a dot for each instance
- a **request edge** P → R means P is waiting for an instance of R
- an **assignment edge** R → P means an instance of R is held by P

Reading the graph depends on the number of instances:

- **Every resource has one instance**: a cycle means deadlock, guaranteed
- **Some resources have several instances**: a cycle means deadlock is possible but not certain, because a process outside the cycle might release an instance that breaks it

## A multi-instance example

Suppose resource R has two instances. P1 holds one and requests S; P2 holds S and requests R; P3 holds the other instance of R and isn't waiting for anything. There's a cycle through P1, S, P2 and R, but P3 will finish and release its instance of R. P2 then gets it, finishes, releases S, and P1 proceeds. A cycle existed, yet there's no deadlock, which is why multi-instance graphs need more analysis.

## Minimum resources to guarantee safety

Exams ask: n processes each need at most k units of a resource; how many units guarantee deadlock can't happen? Reason about the worst case. If every process holds k − 1 units and waits for one more, nobody can finish, and that uses n(k − 1) units. One extra unit lets some process complete and release all k units, which lets the others proceed one by one:

~~~text
minimum units = n(k − 1) + 1
~~~

With 3 processes each needing up to 4 units, the answer is 3 × 3 + 1 = 10.

## Deadlock, livelock and starvation

Three related problems are often confused:

| Problem | What happens | Example |
|---|---|---|
| Deadlock | Processes wait forever for each other | Two threads each holding a lock the other needs |
| Livelock | Processes keep changing state but make no progress | Two people stepping aside in a corridor, again and again |
| Starvation | One process waits indefinitely while others proceed | A low-priority job never scheduled |

## How interviewers test this

Expect "What are the necessary conditions for deadlock?" and "Does a cycle in a resource allocation graph always mean deadlock?" Name all four Coffman conditions with a short example each. For the graph question, answer yes for single-instance resources and "not necessarily" for multi-instance ones, with a reason.`,
    sources: [COFFMAN, OSTEP]
  },

  "deadlock-prevention-and-avoidance": {
    theory: `There are two proactive ways to handle deadlock. Prevention designs the system so that one of the four necessary conditions can never hold. Avoidance allows all four conditions but checks each resource request, granting it only if the system stays in a safe state. This lesson explains how to break each condition, what a safe state is, and how the Banker's algorithm decides whether to grant a request.

## Prevention: break one condition

Each Coffman condition can be targeted, with different costs:

| Condition | How to break it | Cost |
|---|---|---|
| Mutual exclusion | Make resources shareable, such as read-only files, or spool output through a single daemon | Impossible for most resources, like locks or a tape drive |
| Hold and wait | Request every resource at once, or release everything before asking for more | Resources sit idle; long waits; starvation |
| No preemption | Take resources from a waiting process and give them to others | Works for CPU and memory; not for a half-printed page |
| Circular wait | Number all resources and always request them in increasing order | Needs discipline; the most practical option |

## Lock ordering in real code

Breaking circular wait is the prevention technique you'll use most. If every thread acquires locks in the same global order, for example by ascending account ID or by table name, no cycle can form, because a thread holding a higher-numbered lock never waits for a lower-numbered one. A transfer between accounts 101 and 205 always locks 101 first, whichever direction the money moves.

## Avoidance: stay in a safe state

Avoidance needs one piece of advance information: each process declares the maximum number of instances of each resource it might ever need. With that, the OS can look ahead before granting a request.

A state is **safe** if there's some order of processes, called a **safe sequence**, in which each process can get its maximum need from the currently available resources plus those released by processes earlier in the sequence. A safe state can never lead to deadlock, because the OS can always run the processes in the safe-sequence order.

An **unsafe** state isn't necessarily deadlocked. It means the OS can no longer guarantee that every process will finish; deadlock may follow if processes request their full maximums.

## The Banker's algorithm data

Dijkstra's Banker's algorithm keeps four tables for n processes and m resource types:

- **Available**: free instances of each resource type
- **Max**: the maximum demand each process declared
- **Allocation**: instances each process currently holds
- **Need**: Max minus Allocation, what each process may still request

The name comes from a bank that never lends out cash in a way that would leave it unable to meet every customer's maximum credit line.

## The safety algorithm

To test whether a state is safe:

1. Set Work = Available and mark every process unfinished
2. Find an unfinished process whose Need is less than or equal to Work in every resource type
3. Assume it runs to completion: add its Allocation to Work and mark it finished
4. Repeat from step 2 until no process qualifies
5. If every process finished, the state is safe, and the order you picked them in is a safe sequence

In the course's worked example, with Available starting at (3, 3, 2), the algorithm finds the safe sequence P1, P3, P4, P0, P2, and Work grows to the full (10, 5, 7) once everything finishes.

## The resource-request algorithm

When process i requests resources:

1. If the request exceeds its Need, raise an error, because it asked for more than it declared
2. If the request exceeds Available, the process must wait
3. Otherwise, pretend to grant it: subtract from Available, add to Allocation, subtract from Need
4. Run the safety algorithm on the pretend state
5. If it's safe, grant the request for real; if not, roll back the pretend changes and make the process wait

## Why avoidance is rare in practice

The Banker's algorithm costs O(m × n²) per request, needs every process to declare its maximum needs in advance, and assumes a fixed number of processes and resources. General-purpose systems can't meet those assumptions: a web server doesn't know how many connections it will open. Avoidance appears mostly in teaching, and in specialized systems with known workloads.

## How interviewers test this

Exams give Allocation, Max and Available tables and ask whether the state is safe, or whether a request should be granted. Compute Need first, then run the safety algorithm step by step, writing Work after each process. Interviewers ask "How would you prevent deadlock in your code?", and the best answer is consistent lock ordering.`,
    sources: [OSTEP, COFFMAN]
  },

  "deadlock-detection-and-recovery": {
    theory: `Instead of preventing or avoiding deadlocks, a system can let them happen, detect them, and recover. This is often the most practical choice, because deadlocks are rare and prevention restricts every program all the time. This lesson explains detection with wait-for graphs and with a Banker's-style algorithm, the ways to recover, and why general-purpose operating systems mostly ignore deadlocks while databases handle them actively.

## Detection with single-instance resources

When each resource has a single instance, the resource allocation graph can be simplified into a **wait-for graph**: remove the resource nodes and draw an edge Pi → Pj whenever Pi waits for a resource held by Pj. A deadlock exists exactly when the wait-for graph has a cycle.

Finding a cycle with depth-first search takes O(n²) time for n processes in the worst case. The system runs the check periodically, or when a process has waited unusually long.

## Detection with multiple instances

With several instances per resource, cycles aren't enough. The detection algorithm resembles the Banker's safety algorithm, using each process's current **Request** in place of its maximum Need:

1. Set Work = Available; mark processes holding no resources as finished
2. Find an unfinished process whose Request fits within Work
3. Assume it completes: add its Allocation to Work and mark it finished
4. Repeat until no process qualifies
5. Every process still unfinished is deadlocked

The difference from avoidance is that detection looks at what processes are asking for now, not what they might ask for later.

## How often to run detection

Detection costs CPU time, so how often to run it is a trade-off. Running it on every resource request finds deadlocks immediately but adds overhead to every request. Running it every few minutes, or when CPU utilization drops, which can happen when many processes are stuck, is cheaper but leaves deadlocked processes stuck longer.

## Recovery by terminating processes

Once a deadlock is found, the system must break it. The bluntest option kills processes:

- **Abort every deadlocked process**: certain to work, but discards a lot of completed work
- **Abort one at a time**: kill a victim, rerun detection, and repeat until the cycle is gone

Choosing a victim means weighing several factors: the process's priority, how long it has run and how close it is to finishing, how many resources it holds, and whether it's interactive. Killing a process that has computed for an hour and is nearly done wastes far more than killing one that started a second ago.

## Recovery by preempting resources

The gentler option takes resources away from a victim and gives them to others. Three issues must be handled:

- **Victim selection**: choose which process loses which resources at the lowest cost
- **Rollback**: the victim must return to an earlier safe state, which needs checkpoints, or restart from the beginning
- **Starvation**: if cost always selects the same process, it may never finish, so the number of rollbacks should count as part of the cost

## The ostrich algorithm

General-purpose operating systems such as Linux and Windows mostly ignore deadlocks between user processes, an approach nicknamed the ostrich algorithm after the bird said to bury its head in the sand. The reasoning is economic: deadlocks among user programs are rare, and prevention or avoidance would slow down every program, all the time. When a user program deadlocks, the user or a watchdog kills it, and the application developer fixes the lock ordering.

The kernel itself is a different matter. Kernel developers use strict lock-ordering rules, and Linux includes a validator called lockdep that detects lock-order violations during testing, before they can deadlock in production.

## Databases detect deadlocks actively

Database systems take the opposite approach, because deadlocks between transactions are common: many transactions lock rows in unpredictable orders. PostgreSQL, MySQL, Oracle and SQL Server all maintain wait-for graphs, detect cycles, and abort a victim transaction, which receives an error. The application is expected to retry it. That's why database client code wraps transactions in retry loops.

## Comparing the strategies

| Strategy | When it acts | Cost | Used by |
|---|---|---|---|
| Prevention | Design time; a condition can't hold | Restricts all programs | Lock ordering in applications and kernels |
| Avoidance | Every request is checked | Heavy; needs maximums in advance | Specialized systems, teaching |
| Detection and recovery | After a deadlock forms | Periodic checks; lost work | Databases |
| Ignore (ostrich) | Never | Occasional manual restarts | General-purpose OSes for user processes |

## How interviewers test this

Expect "How does an OS handle deadlocks?" Describe all four strategies with their trade-offs, and say which real systems use each: databases detect and abort victims, general-purpose OSes mostly ignore user-level deadlocks, and applications prevent them with lock ordering.`,
    sources: [OSTEP, LINUX_LOCKING, COFFMAN]
  }
};
