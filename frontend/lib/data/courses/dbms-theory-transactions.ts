// Long-form theory for DBMS modules 6-8 (transactions, concurrency control, recovery). Original writing.
import { LessonTheory } from './utils';

const CMU_445 = { title: "CMU 15-445/645 Database Systems (free lectures and notes)", url: "https://15445.courses.cs.cmu.edu/" };
const SILBERSCHATZ = { title: "Database System Concepts (Silberschatz, Korth, Sudarshan) companion site", url: "https://www.db-book.com/" };
const PG_MVCC = { title: "PostgreSQL documentation: Concurrency Control", url: "https://www.postgresql.org/docs/current/mvcc.html", license: "PostgreSQL License" };
const PG_WAL = { title: "PostgreSQL documentation: Reliability and the Write-Ahead Log", url: "https://www.postgresql.org/docs/current/wal.html", license: "PostgreSQL License" };
const SQLITE_ATOMIC = { title: "SQLite: Atomic Commit In SQLite", url: "https://www.sqlite.org/atomiccommit.html", license: "Public domain" };
const SQLITE_WAL = { title: "SQLite: Write-Ahead Logging", url: "https://www.sqlite.org/wal.html", license: "Public domain" };
const ARIES = { title: "Mohan et al., ARIES: A Transaction Recovery Method (1992)", url: "https://dl.acm.org/doi/10.1145/128765.128770" };

export const dbmsTransactionsTheory: Record<string, LessonTheory> = {
  "what-is-a-transaction": {
    theory: `A transaction is a group of database operations that the DBMS treats as one indivisible unit: either all of them take effect, or none do. Transactions are how a database stays correct when programs crash, servers lose power, or many users work at once. This lesson explains what a transaction is, how you control one in SQL, and the states a transaction passes through.

## Why one statement isn't enough

Many real actions need several writes. Paying a hostel fee from a student wallet means subtracting from the wallet, inserting a payment record and marking the fee as paid. If the server crashes after the first write, the student has lost money and the college has no record of it.

A transaction wraps all three writes so the database can promise one of two outcomes: everything happened, or nothing did. There's no in-between state for anyone to see or for a crash to leave behind.

## Controlling transactions in SQL

You start a transaction, run your statements, then either commit or roll back:

~~~sql
START TRANSACTION;
UPDATE wallet SET balance = balance - 4500 WHERE roll_no = 101;
INSERT INTO payment (roll_no, amount) VALUES (101, 4500);
UPDATE fee SET paid = TRUE WHERE roll_no = 101 AND term = '2026-S1';
COMMIT;
~~~

\`COMMIT\` makes every change permanent and visible to others. \`ROLLBACK\` discards every change since the transaction began. PostgreSQL writes \`BEGIN\` instead of \`START TRANSACTION\`; both mean the same thing.

## Autocommit

Most database clients run in autocommit mode by default: every statement is its own transaction and commits as soon as it finishes. That's convenient for one-off queries and dangerous for multi-step actions, because a failure after the first statement leaves the first change committed. Whenever several statements must succeed together, start an explicit transaction.

## Savepoints

A savepoint marks a point inside a transaction that you can roll back to without abandoning everything:

~~~sql
START TRANSACTION;
INSERT INTO admission (roll_no, course) VALUES (205, 'CSE');
SAVEPOINT after_admission;
INSERT INTO hostel_allotment (roll_no, room) VALUES (205, 'B-112');
ROLLBACK TO SAVEPOINT after_admission;  -- no room free, keep admission
COMMIT;
~~~

The admission survives while the failed hostel allotment is undone. Savepoints suit long workflows where one optional step may fail.

## The five transaction states

Every transaction moves through these states:

- **Active**: running its reads and writes
- **Partially committed**: the last statement has run, but the changes may still exist only in memory
- **Committed**: the commit record is safely on disk, so the changes will survive any crash
- **Failed**: an error, constraint violation or crash means it can't continue normally
- **Aborted**: the DBMS has rolled back every change, restoring the database to its state before the transaction began

Committed and aborted are the two final states. After an abort, the application can retry the whole transaction (useful after a deadlock) or give up (useful after a constraint violation such as a duplicate roll number).

## Where "committed" happens

The moment of commit is precise: a transaction is committed when its commit record reaches durable storage, not when the \`COMMIT\` statement is typed and not when the data pages are written. A crash one microsecond after that record is written still preserves the transaction, while a crash one microsecond before rolls it back. The recovery lessons explain how the log makes this possible.

## Keep transactions short

A transaction holds locks or old row versions until it ends. A transaction left open while a user stares at a form blocks other users and prevents cleanup. Do the slow work (user input, network calls) before you start the transaction, then run the database writes quickly and commit.

## Transactions in application code

Applications wrap the statements in a try block, commit on success, and roll back on any error. In Python with a database driver, the pattern looks like this:

~~~python
try:
    cur.execute("UPDATE wallet SET balance = balance - %s "
                "WHERE roll_no = %s", (4500, 101))
    cur.execute("INSERT INTO payment (roll_no, amount) "
                "VALUES (%s, %s)", (101, 4500))
    conn.commit()
except Exception:
    conn.rollback()
    raise
~~~

The rollback in the error path is what keeps a failed payment from leaving the wallet debited. Frameworks such as Django and Spring wrap this pattern in a decorator or annotation so you don't repeat it.

## How interviewers test this

Expect "What is a transaction?" with an example, and "What are the states of a transaction?" Use a multi-step example such as a fee payment, explain why the steps must succeed together, and draw the five states with the transitions between them.`,
    sources: [SILBERSCHATZ, CMU_445, SQLITE_ATOMIC]
  },

  "acid-properties": {
    theory: `ACID names the four guarantees a transaction gives you: Atomicity, Consistency, Isolation and Durability. Each one prevents a specific failure, and each is implemented by a specific part of the DBMS. This lesson explains all four with one example, a wallet-to-wallet transfer between two students, because naming the failure each property prevents is what separates a strong interview answer from a recited one.

## The running example

Ravi sends 500 rupees from his campus wallet to Meena's. Ravi has 2000 and Meena has 1000, so the total is 3000 before and must be 3000 after. The transaction reads Ravi's balance, writes 1500, reads Meena's balance, and writes 1500.

## Atomicity: all or nothing

Atomicity means the transaction's writes happen completely or not at all. Suppose the server crashes after writing Ravi's new balance but before writing Meena's. Without atomicity, 500 rupees vanish: Ravi has 1500, Meena still has 1000.

The DBMS prevents this with an undo log. Before changing a value, it records the old value. If the transaction doesn't commit, recovery uses those records to restore every old value, so the crash leaves no trace.

## Consistency: valid state to valid state

Consistency means a transaction takes the database from one valid state to another valid state. "Valid" combines two kinds of rules:

- **Declared constraints** the DBMS enforces: primary keys, foreign keys, \`CHECK (balance >= 0)\`
- **Business rules** the transaction must respect: the total money in the system stays the same during a transfer

The DBMS rejects any transaction that violates a declared constraint. It can't know your business rules, so a buggy transfer that adds 600 to Meena while subtracting 500 from Ravi would commit happily. Consistency is therefore a shared responsibility: the DBMS enforces constraints, and the programmer writes correct transactions.

## Isolation: no half-finished views

Isolation means concurrent transactions don't see each other's incomplete work. While the transfer runs, an audit query sums all balances. Without isolation it might read Ravi's new balance (1500) and Meena's old balance (1000) and report 2500, a total that never existed.

The concurrency control system provides isolation, using locks or multiversion concurrency control (MVCC). The ideal is that concurrent transactions produce the same result as running them one after another in some order. The isolation-levels lesson explains how databases let you trade some of that guarantee for speed.

## Durability: committed means permanent

Durability means that once the database reports "committed", the change survives any later crash. If the app shows "Transfer successful" and the server loses power a second later, the transfer must still be there after restart.

The DBMS provides durability with a write-ahead log (WAL): before reporting a commit, it forces the transaction's log records to disk. Data pages can be written later, because recovery can redo any committed change from the log.

## Who enforces what

| Property | Failure it prevents | Mechanism |
|---|---|---|
| Atomicity | Half-finished transfer after a crash | Undo log, rollback |
| Consistency | Rule-breaking data | Constraints plus correct transaction code |
| Isolation | Reading another transaction's half-done work | Locks or MVCC |
| Durability | Losing a committed change after a crash | Write-ahead log, flushed at commit |

## ACID in non-relational databases

"NoSQL means no transactions" is out of date. Many NoSQL systems guarantee atomic operations on a single document or key, and several support multi-document ACID transactions, including MongoDB since version 4.0. Many distributed stores choose BASE instead (basically available, soft state, eventually consistent), trading immediate consistency for availability across data centers. The NoSQL lesson covers that trade-off.

## A crash timeline

Walk through the transfer with a crash at different moments. A crash before the first write leaves both balances untouched. A crash after Ravi's write but before commit is undone by recovery, so both balances return to 2000 and 1000. A crash after the commit record reaches the log is redone by recovery if the data pages were never written, so both balances end at 1500. In no case does anyone observe 500 rupees missing, which is atomicity and durability working together.

## How interviewers test this

The question is almost always "Explain ACID with an example." Use the transfer, and for each letter state the failure it prevents and the mechanism that enforces it. Mentioning that consistency depends partly on the application shows you understand the property rather than the acronym.`,
    sources: [SILBERSCHATZ, CMU_445, PG_WAL]
  },

  "isolation-levels": {
    theory: `Perfect isolation is expensive, so databases let you choose how much of it you need. The SQL standard defines four isolation levels, each allowing fewer anomalies than the one before. This lesson explains the four anomalies (dirty reads, non-repeatable reads, phantoms and lost updates), which level prevents which, and how to prevent the lost update that the standard levels miss by default.

## Why databases offer a choice

Stronger isolation means more waiting and more transactions aborted and retried. A dashboard showing approximate counts doesn't need the guarantees a ticket-booking system needs. Isolation levels let each transaction pick its own trade-off between correctness and throughput.

## Dirty read

A dirty read happens when one transaction reads data another transaction has written but not yet committed. Transaction A sets a student's fee status to paid. Transaction B reads "paid" and issues a hall ticket. Then A rolls back because the payment gateway declined. B acted on a value that never officially existed.

## Non-repeatable read

A non-repeatable read happens when a transaction reads the same row twice and gets different values, because another transaction updated and committed it in between. A report reads a course fee as 50,000 at the start and 55,000 at the end, so its totals don't add up.

## Phantom read

A phantom read happens when a transaction re-runs a query over a range and sees rows appear or disappear, because another transaction inserted or deleted rows matching the condition. A count of CSE students returns 120, then 121 a moment later within the same transaction.

The difference from a non-repeatable read: phantoms involve new or removed rows, while non-repeatable reads involve changed values in existing rows.

## Lost update

A lost update happens when two transactions read the same value, both compute a new value from it, and the second write overwrites the first. Two clerks each see 10 seats left in an elective, each enrolls one student and writes 9. The correct answer is 8.

## The four standard levels

| Level | Dirty read | Non-repeatable read | Phantom |
|---|---|---|---|
| \`READ UNCOMMITTED\` | Possible | Possible | Possible |
| \`READ COMMITTED\` | Prevented | Possible | Possible |
| \`REPEATABLE READ\` | Prevented | Prevented | Possible |
| \`SERIALIZABLE\` | Prevented | Prevented | Prevented |

Each level removes one more anomaly. \`SERIALIZABLE\` guarantees the result equals some one-at-a-time ordering of the transactions.

## What real databases do

Defaults differ, and so do implementations:

- **PostgreSQL, Oracle and SQL Server** default to \`READ COMMITTED\`
- **MySQL InnoDB** defaults to \`REPEATABLE READ\`, and its snapshots plus gap locks also prevent most phantoms
- **PostgreSQL** treats \`READ UNCOMMITTED\` as \`READ COMMITTED\`, so dirty reads never happen there
- **PostgreSQL's** \`SERIALIZABLE\` uses serializable snapshot isolation: it lets transactions run in parallel and aborts one if their combination couldn't happen serially, so your code must retry

## Preventing lost updates

The lost update isn't listed in the standard table, and \`READ COMMITTED\` allows it. You prevent it in one of three ways:

- **Atomic update**: do the arithmetic in the database, \`UPDATE elective SET seats = seats - 1 WHERE id = 7 AND seats > 0\`, then check that one row changed
- **Row lock**: read with \`SELECT ... FOR UPDATE\`, which locks the row until commit, so the second clerk waits for the first
- **Optimistic check**: store a version number, and update with \`WHERE version = 5\`; if no row changes, someone else got there first, so reload and retry

The atomic update is usually the best choice, because it needs no extra round trip and holds the lock for the shortest time.

## Choosing a level

Most applications run at \`READ COMMITTED\` and protect their few critical read-modify-write paths with atomic updates or \`FOR UPDATE\`. Reach for \`SERIALIZABLE\` when correctness depends on several rows together, such as "at least one doctor must stay on call", and add retry logic for serialization failures.

## How interviewers test this

Expect "Explain isolation levels" and "What's the difference between a non-repeatable read and a phantom?" Name each anomaly with a short example and the lowest level that prevents it. Then explain the lost update and the \`SELECT ... FOR UPDATE\` fix, because interviewers use it to check practical experience.`,
    sources: [PG_MVCC, CMU_445, SILBERSCHATZ]
  },

  "schedules-and-serializability": {
    theory: `When transactions run concurrently, their operations interleave, and some interleavings produce wrong results. Serializability is the formal definition of a correct interleaving: one that's equivalent to running the transactions one after another. This lesson defines schedules, conflicts and conflict serializability, and explains the precedence-graph test that GATE asks about every year.

## Schedules

A schedule is the order in which the operations of several transactions execute. We write R1(A) for "transaction 1 reads A" and W2(B) for "transaction 2 writes B".

A **serial schedule** runs transactions one at a time: all of T1, then all of T2. Serial schedules are always correct, assuming each transaction is correct alone, but they waste time, because one transaction waiting on disk blocks everyone. A **concurrent schedule** interleaves operations to keep the CPU and disks busy. The goal of concurrency control is to allow only concurrent schedules that are as correct as some serial one.

## Serializable schedules

A concurrent schedule is **serializable** if its effect on the database equals the effect of some serial schedule of the same transactions. There are two practical ways to define "equals": conflict equivalence and view equivalence.

## Conflicting operations

Two operations conflict if all three conditions hold:

- they belong to different transactions
- they access the same data item
- at least one of them is a write

Read-read pairs never conflict, because swapping two reads changes nothing. Read-write, write-read and write-write pairs conflict, because their order changes what's read or what's finally stored.

## Conflict serializability

You can swap adjacent operations that don't conflict without changing the outcome. A schedule is **conflict serializable** if such swaps can turn it into a serial schedule. Equivalently, the order of every conflicting pair in the schedule matches the order of the transactions in some serial schedule.

## The precedence-graph test

Checking all swaps is slow, so you build a precedence (serialization) graph instead:

1. Draw one node per transaction
2. For each conflicting pair where Ti's operation comes first, draw an edge Ti → Tj
3. If the graph has no cycle, the schedule is conflict serializable, and a topological sort of the graph gives an equivalent serial order
4. If the graph has a cycle, the schedule isn't conflict serializable

## A worked example

Take S = R1(A), R2(A), W1(A), W2(A). The conflicts on A are: R1(A) before W2(A), giving T1 → T2; R2(A) before W1(A), giving T2 → T1; and W1(A) before W2(A), giving T1 → T2. The edges T1 → T2 and T2 → T1 form a cycle, so S isn't conflict serializable.

This schedule is the lost update: both transactions read A, both write it, and T1's write is overwritten. The cycle in the graph is the formal version of that bug.

## View serializability

View equivalence is a weaker condition. Two schedules are view equivalent if:

- each transaction reads the initial value of the same items in both schedules
- each read gets its value from the same write in both schedules
- the same transaction performs the final write of each item

Every conflict-serializable schedule is view serializable, but some view-serializable schedules aren't conflict serializable. The difference always involves **blind writes**, writes to an item the transaction never read. Testing view serializability is NP-complete, so real systems enforce conflict serializability instead, usually through locking or timestamps.

## A schedule that passes the test

Take S = R1(A), W1(A), R2(A), W2(A), R1(B), W1(B). The conflicts on A all run from T1 to T2: W1(A) comes before R2(A) and before W2(A). T2 never touches B, so B adds no edges. The graph has the single edge T1 → T2 and no cycle, so S is conflict serializable and equivalent to running T1 completely, then T2. The interleaving still helps: T2 starts its work on A while T1 moves on to B.

## How serializability connects to practice

Databases don't build precedence graphs at run time. Protocols such as two-phase locking guarantee that every schedule they allow is conflict serializable, so no check is needed. PostgreSQL's serializable mode tracks dangerous patterns of read-write dependencies between transactions and aborts one when a cycle becomes possible, which is the same idea applied dynamically.

## How interviewers test this

GATE gives a schedule and asks whether it's conflict serializable, view serializable, or both. Build the precedence graph, list every conflicting pair, and look for cycles. If there's no cycle, give the serial order from a topological sort. If there's a cycle, check for blind writes before concluding it isn't view serializable either.`,
    sources: [SILBERSCHATZ, CMU_445, PG_MVCC]
  },

  "recoverable-schedules": {
    theory: `Serializability assumes every transaction commits, but real transactions abort. When one transaction has read data from another that later aborts, the database may be unable to undo the damage correctly. Recoverability classifies schedules by how safely they handle aborts. This lesson explains the three classes, recoverable, cascadeless and strict, and why most real systems produce strict schedules.

## The problem aborts create

T1 writes a student's CGPA as 9.1. T2 reads 9.1 and uses it to grant a scholarship, then commits. Now T1 aborts, because the grade entry was wrong, and the CGPA goes back to 7.8. T2 has already committed a scholarship based on a value that never officially existed, and committed work can't be undone. The database is now inconsistent with no way to fix it automatically.

## Recoverable schedules

A schedule is **recoverable** if a transaction commits only after every transaction it read from has committed. In the example, T2 read from T1, so T2 must not commit before T1 does. If T1 aborts, T2 is still uncommitted and can be aborted too.

A schedule that violates this rule is irrecoverable, and every practical system forbids irrecoverable schedules.

## Cascading rollback

Recoverable schedules can still be costly. Suppose T2 read from T1, T3 read from T2, and T4 read from T3, with none committed yet. If T1 aborts, T2 must abort, which forces T3 to abort, which forces T4 to abort. One failure triggers a chain of rollbacks, called a **cascading rollback** (or cascading abort), wasting all that work.

## Cascadeless schedules

A schedule is **cascadeless** (avoids cascading aborts) if transactions read only committed data. If T2 can't read T1's value until T1 commits, T1's abort never affects T2, and no chain can start. Every cascadeless schedule is also recoverable.

## Strict schedules

A schedule is **strict** if no transaction reads or overwrites a data item until the last transaction that wrote it has committed or aborted. Strictness adds a rule about writes, not only reads.

The write rule matters for undo. Suppose T1 writes A, T2 overwrites A, and then T1 aborts. Restoring A to the value before T1 would wipe out T2's write. In a strict schedule T2 couldn't overwrite A until T1 finished, so undo can restore old values from the log without considering other transactions.

## How the classes nest

The classes form nested sets:

- **Strict** schedules are all cascadeless
- **Cascadeless** schedules are all recoverable
- **Recoverable** schedules are a subset of all schedules

In set notation: strict ⊂ cascadeless ⊂ recoverable. These properties are independent of serializability: a schedule can be serializable but irrecoverable, or recoverable but not serializable. A correct system needs both.

## Spotting the class in an exam schedule

For each read, note which transaction wrote the value and when that writer commits or aborts:

1. If a reader commits before its writer commits, the schedule is **not recoverable**
2. If it's recoverable but some read happens before its writer commits, it's **recoverable but not cascadeless**
3. If all reads are of committed data, check writes: if some item is overwritten before its previous writer finishes, it's **cascadeless but not strict**
4. Otherwise, it's **strict**

## A worked classification

Take S = W1(A), R2(A), W1(B), C1, C2, where C means commit. T2 reads A written by T1, and T2 commits after T1, so S is recoverable. But T2 reads A before T1 commits, so S isn't cascadeless: if T1 had aborted, T2 would have had to abort too. Moving R2(A) after C1 would make the schedule cascadeless, and since no item is overwritten early, also strict.

## What real databases produce

Strict two-phase locking, used by most lock-based databases, holds every exclusive lock until commit or abort, so other transactions can't read or overwrite uncommitted data. That produces strict schedules automatically. MVCC databases achieve the same effect differently: readers see only committed versions, so they never depend on a transaction that might abort.

## How interviewers test this

GATE gives a schedule with commits and aborts and asks which class it belongs to. Apply the four checks in order. Placement interviews ask "What is a cascading rollback and how do you prevent it?" The answer: read only committed data, which strict two-phase locking or MVCC guarantees.`,
    sources: [SILBERSCHATZ, CMU_445]
  },

  "locking-and-2pl": {
    theory: `Locking is the oldest and most widely taught way to keep concurrent transactions correct. A transaction must hold a lock on data before using it, and conflicting locks make other transactions wait. This lesson explains shared and exclusive locks, why locking alone isn't enough, how two-phase locking (2PL) guarantees serializability, and the variants real databases use.

## Shared and exclusive locks

There are two basic lock modes:

- **Shared (S) lock**: required to read. Many transactions can hold S locks on the same item at once
- **Exclusive (X) lock**: required to write. Only one transaction can hold it, and no S locks can coexist with it

| Held \\ Requested | S | X |
|---|---|---|
| S | Granted | Wait |
| X | Wait | Wait |

Only shared plus shared is compatible, which is why many readers can work together but a writer needs the item to itself.

## Why locks alone aren't enough

Locking each item while you use it doesn't guarantee serializability. Suppose T1 locks A, updates it, releases the lock, then locks B and updates it. Between T1's release of A and its lock on B, T2 can read the new A and the old B, a combination no serial order would produce. The problem is releasing locks too early, which lets other transactions slip between your operations.

## Two-phase locking

Two-phase locking adds one rule about timing. Each transaction has two phases:

1. **Growing phase**: it may acquire locks but may not release any
2. **Shrinking phase**: it may release locks but may not acquire any new ones

The moment a transaction acquires its last lock is its **lock point**. The key theorem: every schedule produced under 2PL is conflict serializable, and the equivalent serial order is the order of the transactions' lock points.

## What basic 2PL doesn't prevent

Basic 2PL guarantees serializability and nothing more. Two problems remain:

- **Cascading rollbacks**: T1 can release an X lock in its shrinking phase before committing, T2 reads the value, and then T1 aborts
- **Deadlocks**: T1 holds A and waits for B while T2 holds B and waits for A. Neither can proceed, and 2PL's rules don't stop this from happening

## Strict and rigorous 2PL

Real databases use stronger variants:

| Variant | Rule | Adds |
|---|---|---|
| Basic 2PL | Grow, then shrink | Conflict serializability |
| Strict 2PL | Hold every X lock until commit or abort | Strict schedules, no cascading rollbacks |
| Rigorous 2PL | Hold every lock (S and X) until commit or abort | Serial order equals commit order |
| Conservative 2PL | Acquire every lock before starting | No deadlocks, but needs all items in advance |

Strict 2PL is the common choice in lock-based systems. Conservative 2PL is rare, because transactions often don't know which rows they'll touch until they run.

## Lock granularity

A lock can cover a whole database, a table, a page or a single row. Locking rows allows more concurrency but means managing many locks; locking a table is cheap but blocks everyone. Databases usually lock rows and may escalate to a table lock when one transaction holds too many row locks.

## Intention locks

Mixed granularity raises a problem: before taking an X lock on the whole \`student\` table, how does a transaction know nobody holds a row lock inside it? Scanning every row lock would be slow.

**Intention locks** solve this. Before locking a row in X mode, a transaction places an intention-exclusive (IX) lock on the table. Before locking a row in S mode, it places an intention-shared (IS) lock. A transaction wanting an X lock on the table sees the IX or IS lock and waits, without inspecting any rows. SIX (shared plus intention-exclusive) covers "read the whole table, update a few rows".

## Locking versus MVCC

Pure locking makes readers and writers block each other. Many modern databases, including PostgreSQL, Oracle and MySQL InnoDB, combine row locks for writers with MVCC for readers, so a long report doesn't block updates. The deadlocks lesson covers MVCC in more detail.

## How interviewers test this

Expect "What is two-phase locking and what does it guarantee?" and "Does 2PL prevent deadlocks?" The answers: 2PL guarantees conflict serializability, and no, only conservative 2PL avoids deadlocks. Mention that strict 2PL is what databases use and why: it prevents cascading rollbacks.`,
    sources: [SILBERSCHATZ, CMU_445, PG_MVCC]
  },

  "deadlocks-and-timestamps": {
    theory: `A deadlock is a cycle of transactions, each waiting for a lock that the next one holds, so none can ever proceed. This lesson explains how databases detect and break deadlocks, the timestamp-based schemes that prevent them, the timestamp-ordering protocol that avoids locks altogether, and multiversion concurrency control (MVCC), the approach most modern databases use for reads.

## How a deadlock forms

T1 locks the \`student\` row for roll number 101 to update a CGPA, then requests the \`fee\` row for 101. Meanwhile T2 has locked that \`fee\` row and now requests the \`student\` row. T1 waits for T2, and T2 waits for T1. Without intervention, both wait forever.

The four Coffman conditions must all hold for a deadlock: mutual exclusion (locks are exclusive), hold and wait (a transaction holds one lock while requesting another), no preemption (locks can't be taken away), and circular wait. Breaking any one of them prevents deadlock.

## Detection with a wait-for graph

Most databases let deadlocks happen and then break them. The DBMS keeps a **wait-for graph** with an edge Ti → Tj whenever Ti waits for a lock Tj holds. A cycle in the graph is a deadlock.

When it finds a cycle, the DBMS picks a **victim**, aborts it to release its locks, and lets the others continue. Victims are chosen to waste the least work: the youngest transaction, the one holding the fewest locks, or the one that's cheapest to roll back. PostgreSQL checks for deadlocks after a transaction has waited for one second (\`deadlock_timeout\`), and MySQL InnoDB detects them immediately by default.

## Prevention with timestamps

Prevention schemes avoid cycles by deciding, at the moment of a lock request, who may wait. Each transaction gets a timestamp when it starts; a smaller timestamp means older. Two classic schemes use it:

- **Wait-die**: if an older transaction requests a lock held by a younger one, it waits. If a younger transaction requests a lock held by an older one, the younger one dies (aborts) and restarts later
- **Wound-wait**: if an older transaction requests a lock held by a younger one, it wounds (aborts) the younger one and takes the lock. If a younger transaction requests a lock held by an older one, it waits

In both schemes, waits only go in one direction of age, so a cycle can't form. An aborted transaction restarts with its original timestamp, so it eventually becomes the oldest and can't starve.

## Timestamp ordering

The timestamp-ordering protocol avoids locks entirely. Each transaction T has a timestamp TS(T), and each data item Q records R-TS(Q), the largest timestamp that has read it, and W-TS(Q), the largest timestamp that has written it.

The rules force operations into timestamp order:

- **Read(Q) by T**: if TS(T) < W-TS(Q), a younger transaction already overwrote Q, so T aborts. Otherwise the read proceeds and R-TS(Q) is updated
- **Write(Q) by T**: if TS(T) < R-TS(Q) or TS(T) < W-TS(Q), a younger transaction already used or replaced Q, so T aborts. Otherwise the write proceeds and W-TS(Q) becomes TS(T)

Nobody waits, so there are no deadlocks, but transactions may restart often under contention. Thomas's write rule relaxes the second check: if TS(T) ≥ R-TS(Q) but TS(T) < W-TS(Q), the write is outdated and nobody read in between, so it's ignored instead of aborting T.

## MVCC: readers and writers stop blocking

Multiversion concurrency control keeps several versions of each row instead of overwriting it. A write creates a new version tagged with the writing transaction. Each transaction reads from a **snapshot**: the versions committed before it started (in repeatable read) or before each statement started (in read committed).

The practical benefit is large: readers never block writers, and writers never block readers. A long attendance report reads a consistent snapshot while teachers keep updating attendance. Only two writers changing the same row still need a lock.

Old versions must eventually be removed. PostgreSQL's \`VACUUM\` reclaims them, and MySQL InnoDB's purge thread does the same. A transaction left open for hours prevents cleanup, which is another reason to keep transactions short.

## Avoiding deadlocks in application code

Databases detect deadlocks, but you can make them rare:

- **Consistent order**: always lock rows in the same order, such as by ascending roll number
- **Short transactions**: hold locks for as little time as possible
- **Indexes on filtered columns**: an update without a usable index may lock far more rows than it needs
- **Retry on deadlock errors**: treat the victim's error as a signal to retry the whole transaction

## How interviewers test this

Expect "What is a deadlock and how do databases handle it?" Describe the wait-for graph and victim selection, then the difference between wait-die and wound-wait (who waits, who aborts). Finish with MVCC, since interviewers increasingly ask how PostgreSQL or MySQL avoid read locks.`,
    sources: [PG_MVCC, SILBERSCHATZ, CMU_445]
  },

  "failures-and-logging": {
    theory: `Recovery is how a database keeps its atomicity and durability promises when something fails. The central tool is the log, an append-only record of every change, written according to the write-ahead logging (WAL) rules. This lesson explains the kinds of failure a database must survive, why the buffer pool makes recovery necessary, what a log record contains, and why WAL is the rule everything else depends on.

## Three kinds of failure

Each kind of failure loses something different:

- **Transaction failure**: one transaction can't continue, because of a constraint violation, a deadlock or an application error. Only that transaction's work must be undone
- **System crash**: power loss, an operating system crash or a killed database process. Everything in main memory is lost, but the disk survives
- **Media failure**: a disk dies or its data is corrupted. Data on that disk is lost, and recovery needs backups plus archived logs

Logging handles the first two directly. Media failure needs copies on other devices, such as backups and replicas.

## Why recovery is needed at all

Writing every change straight to its place on disk would be far too slow, because disks are thousands of times slower than memory. So the DBMS reads data pages into a memory area called the **buffer pool**, changes them there, and writes them back later.

That speed creates two risks at the moment of a crash:

- A committed transaction's changes might still be only in memory, so durability is at risk
- An uncommitted transaction's changes might already be on disk, because the buffer pool evicted a page early, so atomicity is at risk

Recovery repairs both: it redoes committed changes that didn't reach disk and undoes uncommitted changes that did.

## What a log record contains

The log is an append-only file of records. A typical sequence for a transfer looks like this:

~~~text
<T1, start>
<T1, wallet[101], 2000, 1500>
<T1, wallet[205], 1000, 1500>
<T1, commit>
<T2, start>
<T2, fee[307], unpaid, paid>
~~~

An update record holds the transaction ID, the item, the old value (the before-image, used for undo) and the new value (the after-image, used for redo). Each record also gets a log sequence number (LSN), and every data page remembers the LSN of the last change applied to it. If the crash happened after the last line, T1 committed and must be redone if needed, while T2 never committed and must be undone.

## The write-ahead logging rules

WAL consists of two rules:

1. **Log before data**: before a changed data page is written to disk, the log records describing that change must already be on disk. This guarantees undo information exists for anything that reaches disk
2. **Log before commit**: before a transaction is reported as committed, all its log records, including the commit record, must be on disk. This guarantees redo information exists for anything reported as committed

The log is written sequentially, which disks and SSDs handle well. Committing therefore needs one sequential log flush, not scattered writes of every changed page. That's why WAL makes databases both safe and fast.

## Group commit

Flushing the log for every single commit would limit a busy system to the number of flushes the disk can do per second. Databases use **group commit**: transactions that commit within a few milliseconds of each other share one flush. Throughput rises sharply while each transaction still waits for its own commit record to be durable.

## WAL beyond recovery

The same log has other uses. Replicas apply the primary's WAL to stay in sync, which is how PostgreSQL streaming replication works. Point-in-time recovery restores a backup and replays archived WAL up to a chosen moment, which undoes an accidental \`DROP TABLE\`. SQLite offers a WAL mode that also lets readers proceed while one writer appends to the log.

## Steal and force policies

Two buffer-pool policies decide what recovery must handle. **Steal** means the buffer pool may write an uncommitted transaction's page to disk to free memory, which requires undo. **Force** means every page a transaction changed is written to disk at commit, which removes the need for redo but makes each commit slow. Almost every real database uses steal and no-force: pages leave memory whenever convenient, and commits only flush the log. WAL is what makes that fast combination safe.

## How interviewers test this

Expect "What is write-ahead logging and why is it needed?" Explain the buffer pool first, because WAL makes no sense without it, then state both rules and what each guarantees. If asked about crash recovery, describe the redo of committed work and undo of uncommitted work using the log records.`,
    sources: [PG_WAL, SQLITE_WAL, SQLITE_ATOMIC, CMU_445]
  },

  "undo-redo-checkpoints": {
    theory: `After a crash, the recovery manager reads the log to decide which transactions to redo and which to undo. This lesson explains the two update strategies that determine whether undo is needed, the basic recovery rule, how checkpoints keep recovery fast, and the three phases of ARIES, the algorithm behind recovery in IBM DB2 and Microsoft SQL Server.

## Deferred and immediate update

When may a transaction's changes reach the data pages on disk? Two strategies answer differently:

- **Deferred update**: changes are written to the database only after the transaction commits. Uncommitted work never reaches disk, so recovery needs only redo
- **Immediate update**: changes may be written to disk at any time, even before commit. Recovery needs both undo and redo

Most real databases use immediate update, because forcing every page to stay in memory until commit would exhaust the buffer pool on large transactions. That's why the log stores both old and new values.

## The basic recovery rule

After a crash, the recovery manager scans the log and sorts transactions into two groups:

- **Winners**: transactions with both a start record and a commit record. Redo them, because their changes may not have reached disk
- **Losers**: transactions with a start record but no commit or abort record. Undo them, because their changes may have reached disk

Undo goes backwards through the log, newest record first, so that when a transaction changed the same item twice, the oldest value is restored last. Redo goes forwards, oldest record first, so changes are reapplied in their original order.

## Idempotence

Recovery itself can crash. If power fails again halfway through recovery, the next attempt starts over, so redo and undo must be safe to repeat. Page LSNs make redo idempotent: a log record is reapplied only if the page's LSN is older than the record's LSN, meaning the change isn't already on the page.

## Checkpoints

Without checkpoints, recovery would scan the entire log since the database was created, which could take hours. A checkpoint limits how far back recovery must look. A basic (non-fuzzy) checkpoint does three things:

1. Pause new updates briefly
2. Write all modified buffer pages to disk
3. Append a \`<checkpoint L>\` record, where L lists the transactions active at that moment

After a crash, recovery starts from the last checkpoint. Transactions that committed before it are already on disk and need nothing. Only transactions in L, or started afterwards, need redo or undo. Real databases use fuzzy checkpoints that don't pause activity, writing pages in the background and recording which pages were still dirty.

## A worked example

The log contains: T1 start, T1 commit, T2 start, \`<checkpoint {T2}>\`, T3 start, T2 commit, T4 start, then a crash. T1 committed before the checkpoint, so it needs nothing. T2 was active at the checkpoint and committed afterwards, so it's redone. T3 and T4 have no commit record, so both are undone.

## ARIES

ARIES (Algorithms for Recovery and Isolation Exploiting Semantics), published in 1992, is the standard recovery design. It runs in three phases:

1. **Analysis**: scan forward from the last checkpoint to rebuild the dirty page table (which pages might be out of date on disk) and the transaction table (which transactions were active, the losers)
2. **Redo**: starting from the oldest change that might be missing from disk, reapply every logged change, including those of losers. ARIES calls this "repeating history": the database returns to the exact state at the moment of the crash
3. **Undo**: roll back the loser transactions, newest change first

During undo, ARIES writes a compensation log record (CLR) for each change it reverses. If the system crashes during undo, the next recovery sees the CLRs and doesn't undo the same change twice. Repeating history before undoing is what makes this work cleanly with row-level locks and fine-grained logging.

## Shadow paging

Shadow paging is an alternative that avoids an undo log. The database keeps two page tables. A transaction writes changed pages to new locations and builds a new page table pointing at them, while the old (shadow) table still points at the original pages. Committing means atomically switching one pointer to the new table, and aborting means discarding the new pages.

The design is clean but scales poorly: data becomes fragmented across the disk, garbage collection is needed, and concurrent transactions are hard to support. Copy-on-write file systems and some embedded stores use related ideas.

## How interviewers test this

GATE gives a log with a checkpoint and asks which transactions are redone and which are undone. Mark each transaction as committed before the checkpoint, committed after it, or never committed, then apply the rule. Placement interviews ask "What is a checkpoint and why is it needed?" Answer: it bounds how much of the log recovery has to read.`,
    sources: [ARIES, PG_WAL, CMU_445, SILBERSCHATZ]
  }
};
