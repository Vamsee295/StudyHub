// DBMS Modules 6-8: Transactions & ACID, Concurrency Control, Recovery
import { CourseLesson } from './types';

export const transactionLessons: CourseLesson[] = [
  {
    id: "what-is-a-transaction",
    slug: "what-is-a-transaction",
    title: "Transactions and Transaction States",
    description: "What a transaction is, COMMIT / ROLLBACK / SAVEPOINT, and the five transaction states.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Definition",
          content: "A transaction is a group of database operations that must succeed or fail together, as one logical unit of work.\n\nTransferring Rs. 500 from account A to account B is two writes: debit A, credit B. If the system crashes after the debit but before the credit, Rs. 500 disappears. Wrapping both writes in a transaction guarantees that either both happen or neither does."
        },
        {
          type: "code",
          title: "A Transaction in SQL",
          language: "sql",
          code: "START TRANSACTION;           -- BEGIN in PostgreSQL\n\nUPDATE account SET balance = balance - 500 WHERE acc_no = 'A';\nUPDATE account SET balance = balance + 500 WHERE acc_no = 'B';\n\n-- If both succeeded:\nCOMMIT;\n-- If anything failed instead:\n-- ROLLBACK;\n\n-- Partial rollback inside a long transaction\nSTART TRANSACTION;\nINSERT INTO orders VALUES (1, 'pending');\nSAVEPOINT after_order;\nINSERT INTO payments VALUES (1, 999);   -- suppose this fails\nROLLBACK TO SAVEPOINT after_order;      -- the order insert is kept\nCOMMIT;",
          explanation: "Many clients run in autocommit mode, where every single statement is its own transaction. Use an explicit transaction whenever several statements must succeed together."
        },
        {
          type: "table",
          title: "Transaction States",
          headers: ["State", "Meaning"],
          rows: [
            ["Active", "Executing its read/write operations"],
            ["Partially committed", "The last statement has run, but changes may still be only in memory"],
            ["Committed", "Changes are permanently recorded (the commit log record has reached disk)"],
            ["Failed", "An error or crash means it can't continue normally"],
            ["Aborted", "Rolled back; the database is restored to its state before the transaction. It may then be restarted or killed"]
          ]
        },
        {
          type: "code",
          title: "State Diagram",
          language: "text",
          code: "Active --(last operation)--> Partially Committed --(writes durable)--> Committed\n   |                                |\n   +----------(error)----> Failed <--(failure)\n                              |\n                          (rollback)\n                              v\n                           Aborted --> restart or kill",
          explanation: "Committed and Aborted are the two terminal states."
        },
        {
          type: "quickCheck",
          question: "A transaction executed its final statement, then a power cut happened before its changes were made durable. Which state was it in at the time of the failure?",
          options: ["Active", "Partially committed", "Committed", "Aborted"],
          answer: 1,
          explanation: "After the final statement but before commit is complete, it's partially committed. Recovery will roll it back, so it ends up aborted."
        },
        {
          type: "takeaways",
          items: [
            "A transaction is all-or-nothing: COMMIT makes it permanent, ROLLBACK undoes it.",
            "Five states: active, partially committed, committed, failed, aborted.",
            "SAVEPOINT allows a partial rollback inside a transaction."
          ]
        }
      ]
    }
  },
  {
    id: "acid-properties",
    slug: "acid-properties",
    title: "ACID Properties with the Bank Transfer Example",
    description: "Atomicity, Consistency, Isolation, Durability: what each means and which DBMS component guarantees it.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Scenario",
          content: "Transfer Rs. 500 from A (balance 2000) to B (balance 1000). Total money in the bank = 3000 and must stay 3000.\nT: read(A); A = A − 500; write(A); read(B); B = B + 500; write(B)"
        },
        {
          type: "table",
          title: "ACID Explained",
          headers: ["Property", "Guarantee", "What breaks without it", "Who enforces it"],
          rows: [
            ["Atomicity", "All operations happen, or none do", "Crash after write(A): A = 1500, B = 1000, and Rs. 500 vanishes", "Recovery manager (undo log)"],
            ["Consistency", "A transaction moves the DB from one valid state to another", "A bug credits B with 5000; the total no longer equals 3000", "Constraints + correct application logic"],
            ["Isolation", "Concurrent transactions don't see each other's half-done work", "Another transaction reads A = 1500 and B = 1000 mid-transfer and reports a total of 2500", "Concurrency control (locks, MVCC)"],
            ["Durability", "Once committed, changes survive crashes", "The user sees 'Transfer successful', the server crashes, and the transfer is gone", "Recovery manager (redo log, WAL)"]
          ]
        },
        {
          type: "callout",
          title: "The Consistency Nuance",
          content: "Atomicity, isolation and durability are guaranteed by the DBMS. Consistency is shared: the DBMS enforces declared constraints (keys, CHECK, foreign keys), but business rules like 'the total money stays constant' depend on the transaction being written correctly. The C in ACID is partly the programmer's job."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Explain ACID with an example.",
              trap: "Reciting the four words without saying what fails when each is missing.",
              solution: "Use the bank transfer. For each property, describe the failure it prevents (lost money on a crash, an inconsistent total, a mid-transfer read, a lost commit) and name the mechanism (undo log, constraints, locking/MVCC, redo log/WAL)."
            },
            {
              question: "Do NoSQL databases support ACID?",
              trap: "Saying 'No, NoSQL is BASE'.",
              solution: "It depends. Many offer single-document or single-key atomicity, and several (MongoDB 4.0+, DynamoDB transactions, FoundationDB) support multi-document ACID transactions. BASE (Basically Available, Soft state, Eventually consistent) describes the trade-off chosen by many distributed stores."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "A committed order disappears after a server crash. Which property was violated?",
          options: ["Atomicity", "Consistency", "Isolation", "Durability"],
          answer: 3,
          explanation: "Durability guarantees that committed data survives failures."
        },
        {
          type: "takeaways",
          items: [
            "Atomicity: all or nothing (undo). Durability: committed means permanent (redo/WAL).",
            "Isolation: concurrent transactions behave as if they ran one after another (locking/MVCC).",
            "Consistency: valid state to valid state, enforced by constraints plus correct transaction logic."
          ]
        }
      ]
    }
  },
  {
    id: "isolation-levels",
    slug: "isolation-levels",
    title: "Read Phenomena and Isolation Levels",
    description: "Dirty reads, non-repeatable reads, phantoms, lost updates, and which SQL isolation level prevents each.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Concurrency Problems",
          headers: ["Problem", "What happens", "Example"],
          rows: [
            ["Dirty read", "T2 reads data written by T1 that T1 hasn't committed yet", "T1 sets balance = 0, T2 reads 0, then T1 rolls back. T2 acted on a value that never existed."],
            ["Non-repeatable read", "T1 reads the same row twice and gets different values, because T2 updated and committed it in between", "A report reads a price as 100, then 120, within one transaction"],
            ["Phantom read", "T1 re-runs a range query and sees new or missing rows that T2 inserted or deleted", "`COUNT(*) WHERE dept = 'CSE'` returns 40, then 41"],
            ["Lost update", "Two transactions read a value, both modify it, and the second write overwrites the first", "Two clerks each add 1 to stock = 10; the final value is 11 instead of 12"]
          ]
        },
        {
          type: "table",
          title: "SQL Standard Isolation Levels",
          headers: ["Level", "Dirty read", "Non-repeatable read", "Phantom"],
          rows: [
            ["READ UNCOMMITTED", "Possible", "Possible", "Possible"],
            ["READ COMMITTED", "Prevented", "Possible", "Possible"],
            ["REPEATABLE READ", "Prevented", "Prevented", "Possible (by the standard)"],
            ["SERIALIZABLE", "Prevented", "Prevented", "Prevented"]
          ]
        },
        {
          type: "list",
          title: "Real-World Defaults",
          items: [
            "**PostgreSQL, Oracle, SQL Server**: READ COMMITTED by default.",
            "**MySQL InnoDB**: REPEATABLE READ by default. Its consistent snapshots plus next-key (gap) locks also block most phantoms.",
            "Higher isolation means fewer anomalies, but more blocking, more aborted transactions to retry, and lower throughput."
          ]
        },
        {
          type: "code",
          title: "Setting the Level and Avoiding Lost Updates",
          language: "sql",
          code: "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n\n-- Lost-update fix 1: do the arithmetic inside the database (atomic)\nUPDATE product SET stock = stock - 1 WHERE id = 7 AND stock > 0;\n\n-- Lost-update fix 2: lock the row while you read it\nSTART TRANSACTION;\nSELECT stock FROM product WHERE id = 7 FOR UPDATE;\n-- ... application logic ...\nUPDATE product SET stock = 9 WHERE id = 7;\nCOMMIT;",
          explanation: "Reading a value into the app, changing it there and writing it back without a lock is the classic lost-update bug."
        },
        {
          type: "think",
          question: "An online ticket system shows 1 seat left, and two users click 'Book' at the same moment. Both see 'confirmed'. Which problem is this, and how would you fix it?",
          answerReveal: "A lost update (or write skew): both read seats = 1 and both wrote seats = 0. Fix it with a conditional atomic update (UPDATE seats SET left = left - 1 WHERE id = ? AND left > 0, then check the affected row count), with SELECT ... FOR UPDATE, or with SERIALIZABLE isolation plus retrying the transaction that fails."
        },
        {
          type: "quickCheck",
          question: "Which is the lowest isolation level that prevents non-repeatable reads?",
          options: ["READ UNCOMMITTED", "READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE"],
          answer: 2,
          explanation: "REPEATABLE READ guarantees that a row read twice in the same transaction returns the same value."
        },
        {
          type: "takeaways",
          items: [
            "Know the four phenomena: dirty read, non-repeatable read, phantom, lost update.",
            "Each level up the table removes one more phenomenon; SERIALIZABLE removes them all.",
            "Prevent lost updates with atomic UPDATEs or SELECT ... FOR UPDATE."
          ]
        }
      ]
    }
  }
];

export const concurrencyControlLessons: CourseLesson[] = [
  {
    id: "schedules-and-serializability",
    slug: "schedules-and-serializability",
    title: "Schedules, Conflict Serializability and Precedence Graphs",
    description: "Serial vs concurrent schedules, conflicting operations, and how to test serializability with a precedence graph.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Schedules",
          content: "A schedule is the order in which the operations of several transactions run.\n\nSerial schedule: transactions run one after another with no interleaving. Always correct, but slow.\nConcurrent (non-serial) schedule: operations are interleaved. Faster, but it might produce a wrong result.\n\nSerializable schedule: a concurrent schedule whose effect equals that of some serial schedule. This is the correctness target for concurrency control."
        },
        {
          type: "table",
          title: "When Do Two Operations Conflict?",
          headers: ["Pair (different transactions, same data item)", "Conflict?"],
          rows: [
            ["Read – Read", "No (the order doesn't matter)"],
            ["Read – Write", "Yes"],
            ["Write – Read", "Yes"],
            ["Write – Write", "Yes"]
          ]
        },
        {
          type: "text",
          title: "Conflict Serializability Test",
          content: "1. Draw one node per transaction.\n2. For every conflicting pair where Ti's operation comes before Tj's, draw an edge Ti → Tj.\n3. If the graph has no cycle, the schedule is conflict serializable. A topological order of the graph gives an equivalent serial schedule.\n4. If there is a cycle, the schedule is not conflict serializable."
        },
        {
          type: "dryRun",
          title: "Example: S = R1(A), R2(A), W1(A), W2(A), R1(B), W2(B)",
          iterations: [
            { step: 1, variables: { "R2(A) before W1(A)": "edge T2 → T1" }, description: "A read by T2 followed by a write by T1 on A." },
            { step: 2, variables: { "R1(A) before W2(A)": "edge T1 → T2" }, description: "A read by T1 followed by a write by T2 on A." },
            { step: 3, variables: { "Graph": "T1 → T2 → T1" }, description: "That is a cycle." },
            { step: 4, variables: { "Result": "NOT conflict serializable" }, description: "This interleaving is the lost-update pattern: both read A, then both write it." }
          ]
        },
        {
          type: "text",
          title: "View Serializability",
          content: "View serializability is a weaker (more permissive) condition. Two schedules are view equivalent if they have the same initial reads, the same reads-from relationships and the same final writes.\n\nEvery conflict-serializable schedule is view serializable, but not every view-serializable schedule is conflict serializable. The difference comes from blind writes (writes with no earlier read of that item in the transaction). Testing view serializability is NP-complete, which is why real systems use conflict-based methods."
        },
        {
          type: "think",
          question: "S = R1(A), W1(A), R2(A), W2(A), R1(B), W1(B). Is it conflict serializable? If so, what is the equivalent serial order?",
          answerReveal: "Conflicts on A: W1(A) before R2(A) and W1(A) before W2(A), giving T1 → T2. T2 never touches B, so there are no other edges. The graph is acyclic, so S is conflict serializable and equivalent to the serial schedule T1, T2."
        },
        {
          type: "quickCheck",
          question: "A precedence graph has edges T1 → T2, T2 → T3 and T3 → T1. The schedule is:",
          options: ["Conflict serializable as T1, T2, T3", "Conflict serializable as T3, T2, T1", "Not conflict serializable", "Always view serializable"],
          answer: 2,
          explanation: "T1 → T2 → T3 → T1 is a cycle, so no serial order satisfies all the edges."
        },
        {
          type: "takeaways",
          items: [
            "Conflict = different transactions, same item, at least one write.",
            "No cycle in the precedence graph ⇔ conflict serializable; a topological sort gives the serial order.",
            "Conflict serializable ⊂ view serializable; blind writes make up the difference."
          ]
        }
      ]
    }
  },
  {
    id: "recoverable-schedules",
    slug: "recoverable-schedules",
    title: "Recoverable, Cascadeless and Strict Schedules",
    description: "Why some serializable schedules are still unsafe when transactions abort.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "The Problem",
          content: "Serializability assumes every transaction commits. Aborts create a new problem: if T2 read data written by T1 and then T1 aborts, T2 based its work on a value that never existed."
        },
        {
          type: "table",
          title: "Recoverability Classes (each is stricter than the one above)",
          headers: ["Class", "Rule", "Prevents"],
          rows: [
            ["Recoverable", "If T2 reads from T1, then T1 commits before T2 commits", "Committing based on data that is later rolled back"],
            ["Cascadeless (ACA)", "Transactions read only committed data", "Cascading rollback (one abort forcing many others)"],
            ["Strict", "No transaction reads or overwrites an item until the last transaction that wrote it has committed or aborted", "Problems with undoing overwritten values; allows simple undo using before-images"]
          ]
        },
        {
          type: "dryRun",
          title: "Spot the Problem: W1(A), R2(A), C2, A1",
          iterations: [
            { step: 1, variables: { "W1(A)": "T1 writes A (uncommitted)" }, description: "" },
            { step: 2, variables: { "R2(A)": "T2 reads T1's dirty value" }, description: "A dirty read." },
            { step: 3, variables: { "C2": "T2 commits" }, description: "T2's result is now permanent." },
            { step: 4, variables: { "A1": "T1 aborts" }, description: "T2 has committed using a value that is rolled back. Irrecoverable. To be recoverable, C2 must come after C1." }
          ]
        },
        {
          type: "quickCheck",
          question: "Which relationship is correct?",
          options: ["Recoverable ⊂ Cascadeless ⊂ Strict", "Strict ⊂ Cascadeless ⊂ Recoverable", "Cascadeless ⊂ Strict ⊂ Recoverable", "They are unrelated"],
          answer: 1,
          explanation: "Every strict schedule is cascadeless, and every cascadeless schedule is recoverable. The stricter the rule, the smaller the set."
        },
        {
          type: "takeaways",
          items: [
            "Recoverable: commit only after the transactions you read from have committed.",
            "Cascadeless: read only committed data, so there are no cascading aborts.",
            "Strict: don't read or write an item until its last writer finishes. Strict 2PL produces these."
          ]
        }
      ]
    }
  },
  {
    id: "locking-and-2pl",
    slug: "locking-and-2pl",
    title: "Locks and Two-Phase Locking (2PL)",
    description: "Shared and exclusive locks, the compatibility matrix, basic / strict / rigorous 2PL, and lock granularity.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Lock Compatibility",
          headers: ["Held \\ Requested", "Shared (S)", "Exclusive (X)"],
          rows: [
            ["Shared (S)", "Granted", "Wait"],
            ["Exclusive (X)", "Wait", "Wait"]
          ]
        },
        {
          type: "text",
          title: "Lock Types",
          content: "Shared (S) lock: needed to read. Many transactions can hold an S lock on the same item.\nExclusive (X) lock: needed to write. Only one transaction can hold it, and no S locks may coexist with it.\n\nLocking alone does not guarantee serializability. If a transaction releases a lock too early, another transaction can sneak in between its operations."
        },
        {
          type: "text",
          title: "Two-Phase Locking (2PL)",
          content: "Every transaction has two phases:\n1. Growing phase: it may acquire locks but may not release any.\n2. Shrinking phase: it may release locks but may not acquire any new ones.\nThe moment of its last lock acquisition is its lock point.\n\nTheorem: every schedule produced under 2PL is conflict serializable, in the order of the transactions' lock points.\n\nBasic 2PL does not prevent deadlocks or cascading rollbacks."
        },
        {
          type: "table",
          title: "2PL Variants",
          headers: ["Variant", "Rule", "Gives you", "Downside"],
          rows: [
            ["Basic 2PL", "Growing phase, then shrinking phase", "Conflict serializability", "Cascading rollbacks and deadlocks are possible"],
            ["Strict 2PL", "Hold all X locks until commit or abort", "Strict (cascadeless) schedules", "Deadlocks are still possible"],
            ["Rigorous 2PL", "Hold all locks (S and X) until commit or abort", "Serial order = commit order", "Less concurrency"],
            ["Conservative (static) 2PL", "Acquire every lock before starting", "No deadlocks", "Must know all items in advance; low concurrency"]
          ]
        },
        {
          type: "text",
          title: "Lock Granularity and Intention Locks",
          content: "Locks can cover a database, a table, a page or a single row. Fine granularity (row) means more concurrency but more locks to manage. Coarse granularity (table) means less overhead but more blocking.\n\nMultiple-granularity locking uses intention locks (IS, IX, SIX) on parents. Before locking a row in X mode, a transaction takes IX on the table, so a transaction wanting an X lock on the whole table can see the conflict immediately, without scanning every row lock."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Does 2PL prevent deadlocks?",
              trap: "Saying yes, because it's a locking protocol.",
              solution: "No. Basic and strict 2PL can both deadlock: T1 locks A and waits for B, while T2 locks B and waits for A. Only conservative 2PL avoids deadlock, by taking every lock up front."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which protocol guarantees both conflict serializability and no cascading rollbacks?",
          options: ["Basic 2PL", "Strict 2PL", "Timestamp ordering without the Thomas write rule", "No locking"],
          answer: 1,
          explanation: "Strict 2PL holds exclusive locks until commit, so nobody can read uncommitted data, and it inherits serializability from 2PL."
        },
        {
          type: "takeaways",
          items: [
            "S locks share, X locks exclude. Only S + S is compatible.",
            "2PL (growing, then shrinking) ⇒ conflict serializable.",
            "Strict 2PL is what most real databases use; it still needs deadlock handling."
          ]
        }
      ]
    }
  },
  {
    id: "deadlocks-and-timestamps",
    slug: "deadlocks-and-timestamps",
    title: "Deadlocks, Timestamp Ordering and MVCC",
    description: "Detecting and preventing deadlocks (wait-die, wound-wait), timestamp-based protocols and multiversion concurrency control.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Deadlock",
          content: "A deadlock is a cycle of transactions, each waiting for a lock held by the next one. None of them can ever continue on its own.\n\nT1: lock-X(A) ... waits for lock-X(B)\nT2: lock-X(B) ... waits for lock-X(A)"
        },
        {
          type: "table",
          title: "Handling Deadlocks",
          headers: ["Strategy", "How", "Notes"],
          rows: [
            ["Detection", "Maintain a wait-for graph (Ti → Tj when Ti waits for Tj); a cycle means deadlock. Abort a victim.", "What MySQL, PostgreSQL and SQL Server do. Victim = the youngest or cheapest transaction to roll back."],
            ["Timeout", "Abort any transaction that waits too long", "Simple, but can abort transactions that weren't deadlocked"],
            ["Prevention: wait-die", "Older requester waits; younger requester dies (aborts) and restarts with the SAME timestamp", "Non-preemptive"],
            ["Prevention: wound-wait", "Older requester wounds (aborts) the younger holder; younger requester waits", "Preemptive; fewer restarts in practice"],
            ["Ordering", "Every transaction locks resources in a global fixed order", "Common application-level fix"]
          ]
        },
        {
          type: "callout",
          title: "Remembering Wait-Die vs Wound-Wait",
          content: "In both schemes, older transactions get priority and an aborted transaction keeps its original timestamp, so it eventually becomes the oldest and can't starve. Wait-die: old waits for young, young dies. Wound-wait: old wounds young, young waits for old."
        },
        {
          type: "text",
          title: "Timestamp Ordering Protocol",
          content: "Each transaction gets a timestamp TS(T) when it starts. Each item Q stores R-TS(Q) (the largest timestamp that read it) and W-TS(Q) (the largest timestamp that wrote it).\n\nRead(Q) by T: if TS(T) < W-TS(Q), a younger transaction already overwrote Q, so abort T. Otherwise allow it and update R-TS(Q).\nWrite(Q) by T: if TS(T) < R-TS(Q) or TS(T) < W-TS(Q), abort T. Otherwise allow it and set W-TS(Q) = TS(T).\n\nNo locks means no deadlocks, but transactions may restart often. Thomas's write rule: on a write where TS(T) ≥ R-TS(Q) but TS(T) < W-TS(Q), ignore the outdated write instead of aborting (a younger write has already superseded it and nobody read it in between). This allows some view-serializable schedules."
        },
        {
          type: "text",
          title: "MVCC (Multiversion Concurrency Control)",
          content: "Instead of overwriting a row, a write creates a new version. Each transaction reads from a consistent snapshot: the versions committed when it started (or when the statement started, under READ COMMITTED).\n\nThe key benefit: readers never block writers and writers never block readers. Only writer-versus-writer conflicts need locks.\n\nPostgreSQL, MySQL InnoDB and Oracle all use MVCC. Old versions are cleaned up later (VACUUM in PostgreSQL, the purge thread in InnoDB)."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "What are the four necessary conditions for a deadlock?",
              trap: "Mixing them up with ACID or forgetting circular wait.",
              solution: "Mutual exclusion, hold and wait, no preemption, circular wait (the Coffman conditions, shared with operating systems). Breaking any one of them prevents deadlock."
            },
            {
              question: "How do you reduce deadlocks in an application?",
              trap: "Saying 'use a higher isolation level'. That usually increases them.",
              solution: "Access tables and rows in a consistent order, keep transactions short, add indexes so updates lock fewer rows, and catch the deadlock error and retry the transaction."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Under wound-wait, an OLDER transaction requests a lock held by a YOUNGER one. What happens?",
          options: ["The older one waits", "The older one aborts", "The younger one is aborted (wounded)", "Both abort"],
          answer: 2,
          explanation: "Wound-wait is preemptive: the older transaction wounds the younger holder, which rolls back and restarts with its original timestamp."
        },
        {
          type: "takeaways",
          items: [
            "Deadlock = cycle in the wait-for graph. Real DBMSs detect it and abort a victim.",
            "Wait-die (old waits, young dies) and wound-wait (old wounds, young waits) prevent deadlocks using timestamps.",
            "MVCC: readers and writers don't block each other; this is how modern databases implement isolation."
          ]
        }
      ]
    }
  }
];

export const recoveryLessons: CourseLesson[] = [
  {
    id: "failures-and-logging",
    slug: "failures-and-logging",
    title: "Failure Types, the Log and Write-Ahead Logging",
    description: "What can fail, what a log record contains, and why WAL makes atomicity and durability possible.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Types of Failure",
          headers: ["Failure", "Example", "What is lost"],
          rows: [
            ["Transaction failure", "Constraint violation, division by zero, deadlock victim", "Only that transaction's work: roll it back"],
            ["System crash", "Power cut, OS crash, DBMS process killed", "Main memory (the buffer pool); the disk survives"],
            ["Disk (media) failure", "Disk head crash, corrupted SSD", "Data on disk: restore from backup + archived logs"]
          ]
        },
        {
          type: "text",
          title: "Why Recovery Is Needed At All",
          content: "For speed, the DBMS changes pages in an in-memory buffer pool and writes them to disk later. So at the moment of a crash:\n- Some committed changes may not be on disk yet (a durability risk).\n- Some uncommitted changes may already be on disk (an atomicity risk).\nRecovery uses the log to redo the first kind and undo the second."
        },
        {
          type: "code",
          title: "Log Records",
          language: "text",
          code: "<T1, start>\n<T1, A, 2000, 1500>     -- <transaction, item, old value, new value>\n<T1, B, 1000, 1500>\n<T1, commit>\n<T2, start>\n<T2, C, 700, 600>\n-- crash here: T2 has no commit record",
          explanation: "The old value (before-image) allows UNDO. The new value (after-image) allows REDO."
        },
        {
          type: "callout",
          title: "Write-Ahead Logging (WAL): The Two Rules",
          content: "1. Before a modified data page is written to disk, the log records describing that change must already be on disk (this enables undo).\n2. Before a transaction is reported as committed, all its log records, including the commit record, must be on disk (this enables redo).\nThe log is written sequentially, which is fast, so committing requires only a log flush, not writing every changed data page."
        },
        {
          type: "quickCheck",
          question: "After a crash, the log shows <T2, start> and <T2, C, 700, 600> with no commit record. Recovery will:",
          options: ["Redo T2: C = 600", "Undo T2: C = 700", "Ignore T2", "Ask the user"],
          answer: 1,
          explanation: "T2 never committed, so atomicity requires undoing it, restoring the old value 700."
        },
        {
          type: "takeaways",
          items: [
            "Transaction failure, system crash and media failure need different recovery.",
            "Log records store old values (for undo) and new values (for redo).",
            "WAL: log before data, and log flushed before commit."
          ]
        }
      ]
    }
  },
  {
    id: "undo-redo-checkpoints",
    slug: "undo-redo-checkpoints",
    title: "Undo/Redo Recovery, Checkpoints and ARIES",
    description: "Deferred vs immediate update, how checkpoints shorten recovery, and the three phases of ARIES.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Update Strategies",
          headers: ["Strategy", "When data pages may reach disk", "Recovery needs"],
          rows: [
            ["Deferred update", "Only after the transaction commits", "REDO only (uncommitted work was never written)"],
            ["Immediate update", "Any time, even before commit", "UNDO and REDO"]
          ]
        },
        {
          type: "text",
          title: "The Basic Recovery Rule",
          content: "Scan the log after a crash:\n- A transaction with both <T, start> and <T, commit>: REDO it (its changes might not have reached disk).\n- A transaction with <T, start> but no commit or abort: UNDO it (its changes might have reached disk).\nUndo goes backwards through the log (newest first). Redo goes forwards (oldest first)."
        },
        {
          type: "text",
          title: "Checkpoints",
          content: "Without checkpoints, recovery would have to replay the entire log since the database was created.\n\nA checkpoint writes all modified buffer pages to disk and adds <checkpoint L> to the log, where L lists the transactions active at that moment.\n\nAfter a crash, recovery only needs to look at transactions that committed after the last checkpoint (redo them) and transactions in L or started later that never committed (undo them). Transactions that committed before the checkpoint are already safely on disk."
        },
        {
          type: "dryRun",
          title: "Recovery With a Checkpoint",
          iterations: [
            { step: "Log", variables: { "Before checkpoint": "T1 start, T1 commit, T2 start", "Checkpoint": "<checkpoint {T2}>", "After": "T3 start, T2 commit, T4 start, crash" }, description: "" },
            { step: "T1", variables: { "Action": "Nothing" }, description: "It committed before the checkpoint, so its pages were flushed." },
            { step: "T2", variables: { "Action": "REDO" }, description: "Active at the checkpoint and committed afterwards." },
            { step: "T3", variables: { "Action": "UNDO" }, description: "Started after the checkpoint, no commit record." },
            { step: "T4", variables: { "Action": "UNDO" }, description: "No commit record." }
          ]
        },
        {
          type: "table",
          title: "ARIES (used by DB2, SQL Server; InnoDB is similar)",
          headers: ["Phase", "What it does"],
          rows: [
            ["1. Analysis", "Scan forward from the last checkpoint to rebuild the dirty page table and the list of active (loser) transactions"],
            ["2. Redo", "Repeat history: reapply every logged change from the earliest dirty page's LSN, even changes of loser transactions"],
            ["3. Undo", "Roll back loser transactions backwards, writing compensation log records (CLRs) so a crash during recovery is also safe"]
          ]
        },
        {
          type: "text",
          title: "Shadow Paging (an alternative)",
          content: "Shadow paging keeps two page tables. Changes go to new copies of pages, and commit atomically switches the page-table pointer. Undo just means discarding the new copies, so no undo log is needed. Drawbacks: data gets fragmented, garbage collection is required, and concurrency is hard. SQLite's rollback journal and copy-on-write file systems use related ideas."
        },
        {
          type: "quickCheck",
          question: "Which recovery strategy needs only REDO and never UNDO?",
          options: ["Immediate update", "Deferred update", "ARIES", "Shadow paging with immediate writes"],
          answer: 1,
          explanation: "With deferred update, nothing uncommitted is ever written to the database, so there is nothing to undo."
        },
        {
          type: "takeaways",
          items: [
            "Committed (has a commit record) → redo; uncommitted → undo.",
            "Checkpoints limit how much of the log recovery must scan.",
            "ARIES: analysis, redo (repeat history), undo with CLRs."
          ]
        }
      ]
    }
  }
];
