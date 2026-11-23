// DBMS Modules 9-10: Indexing & B+ Trees, NoSQL & Scaling
import { CourseLesson } from './types';

export const indexingLessons: CourseLesson[] = [
  {
    id: "file-organization-and-indexes",
    slug: "file-organization-and-indexes",
    title: "File Organization and Index Types",
    description: "Heap and sorted files, primary / clustered / secondary indexes, dense vs sparse, with block-access calculations.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Why Indexes Exist",
          content: "Disk is read in blocks (pages), typically 4-16 KB. Query cost is measured mainly in block accesses, because reading a block from disk is far slower than processing it in memory.\n\nWithout an index, finding one row means scanning the whole table. An index is a separate, smaller structure (search key → pointer to row) that lets the DBMS jump to the right block, just like the index at the back of a textbook."
        },
        {
          type: "table",
          title: "File Organizations",
          headers: ["Organization", "How rows are stored", "Search cost (b = number of blocks)", "Good for"],
          rows: [
            ["Heap (unordered)", "Appended wherever there is space", "b/2 on average, b in the worst case", "Fast inserts, full scans"],
            ["Sorted (sequential)", "Ordered by a key", "log2(b) with binary search", "Range queries on that key"],
            ["Hashed", "Bucket chosen by hash(key)", "About 1 block for equality", "Exact-match lookups"]
          ]
        },
        {
          type: "table",
          title: "Index Types",
          headers: ["Index", "Defined on", "Data file order", "Dense or sparse"],
          rows: [
            ["Primary index", "The ordering key field, which is unique", "Sorted on that key", "Sparse: one entry per block"],
            ["Clustering index", "An ordering field that is NOT unique", "Sorted on that field", "Sparse: one entry per distinct value"],
            ["Secondary index", "Any other field (unique or not)", "Not ordered on that field", "Dense: one entry per row"]
          ]
        },
        {
          type: "text",
          title: "Dense vs Sparse",
          content: "Dense index: an entry for every search-key value (every row). Larger, but it can answer 'does this exist?' from the index alone.\nSparse index: entries for only some values, usually the first key of each block. Smaller, but it only works when the data file is sorted on that key.\n\nA table can have at most one primary or clustering index, because the rows can only be physically sorted one way. It can have many secondary indexes."
        },
        {
          type: "dryRun",
          title: "Block-Access Calculation (a GATE classic)",
          iterations: [
            { step: "Given", variables: { "Records": "30,000", "Record size": "100 B", "Block size": "1024 B", "Index entry": "15 B (key + pointer)" }, description: "The file is sorted on the key." },
            { step: 1, variables: { "Blocking factor": "floor(1024/100) = 10 records/block", "Data blocks": "30,000 / 10 = 3,000" }, description: "" },
            { step: 2, variables: { "Binary search on data": "ceil(log2 3000) = 12 block accesses" }, description: "Without an index." },
            { step: 3, variables: { "Index entries (sparse)": "3,000 (one per data block)", "Index blocking factor": "floor(1024/15) = 68", "Index blocks": "ceil(3000/68) = 45" }, description: "Build a primary (sparse) index." },
            { step: 4, variables: { "Search": "ceil(log2 45) + 1 = 6 + 1 = 7 block accesses" }, description: "Binary search the index, then read one data block. From 12 down to 7; a multi-level index cuts this further." }
          ]
        },
        {
          type: "table",
          title: "Clustered vs Non-Clustered (interview terms)",
          headers: ["", "Clustered index", "Non-clustered index"],
          rows: [
            ["Data order", "Table rows are physically stored in index order", "A separate structure pointing to rows"],
            ["Per table", "Only one", "Many"],
            ["Leaf level contains", "The actual rows (InnoDB, SQL Server)", "Key + row locator (row ID or the clustered key)"],
            ["Typical", "The primary key in InnoDB", "Indexes on email, created_at, ..."]
          ]
        },
        {
          type: "quickCheck",
          question: "How many clustered indexes can a table have?",
          options: ["0", "1", "As many as its columns", "Unlimited"],
          answer: 1,
          explanation: "Rows can be physically sorted in only one order, so there is at most one clustered index. Secondary (non-clustered) indexes are unlimited."
        },
        {
          type: "takeaways",
          items: [
            "Cost is counted in block accesses.",
            "Primary and clustering indexes are sparse and need sorted data; secondary indexes are dense.",
            "One clustered index per table; many non-clustered ones."
          ]
        }
      ]
    }
  },
  {
    id: "b-trees-and-b-plus-trees",
    slug: "b-trees-and-b-plus-trees",
    title: "B-Trees and B+ Trees",
    description: "Structure, order, insertion with splits, why databases prefer B+ trees, and height calculations.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "text",
          title: "Why Not a Binary Search Tree?",
          content: "A balanced BST on 1 million keys has height about 20, which means 20 disk reads per lookup. B-trees are short, wide trees: each node fills one disk block and holds hundreds of keys. With a fan-out of 200, three levels can index 200 × 200 × 200 = 8 million keys, so a lookup takes only 3-4 block reads. The top levels usually stay cached in memory as well."
        },
        {
          type: "table",
          title: "B-Tree vs B+ Tree",
          headers: ["", "B-Tree", "B+ Tree"],
          rows: [
            ["Where data pointers live", "In internal nodes and leaves", "Only in leaves"],
            ["Internal nodes", "Keys + data pointers + child pointers", "Keys + child pointers only, so more keys fit per node"],
            ["Duplicate keys in the tree", "Each key appears once", "Keys in internal nodes repeat in the leaves"],
            ["Leaves linked", "No", "Yes, a linked list in key order"],
            ["Range query", "Needs a tree traversal", "Find the start key, then walk the leaf chain"],
            ["Used by", "Some file systems", "Almost every relational DBMS index"]
          ]
        },
        {
          type: "text",
          title: "B+ Tree Rules (order p = maximum number of child pointers)",
          content: "- Every internal node except the root has between ceil(p/2) and p children.\n- The root has at least 2 children (unless it is a leaf).\n- A node with k children holds k − 1 keys.\n- All leaves are at the same depth: the tree is always perfectly balanced.\n- Leaves hold (key, record pointer) pairs and a pointer to the next leaf.\n\nBalance is kept by splitting full nodes on insert and merging or borrowing on delete, so searching, inserting and deleting are all O(log n)."
        },
        {
          type: "dryRun",
          title: "Insertion With a Split (leaf capacity 3 keys)",
          iterations: [
            { step: 1, variables: { "Leaf": "[10, 20, 30]" }, description: "The leaf is full." },
            { step: 2, variables: { "Insert": "25", "Overflow": "[10, 20, 25, 30]" }, description: "Too many keys: split the leaf into two." },
            { step: 3, variables: { "Left leaf": "[10, 20]", "Right leaf": "[25, 30]" }, description: "" },
            { step: 4, variables: { "Parent gets": "25" }, description: "In a leaf split the separator is COPIED up (it stays in the right leaf). In an internal-node split the middle key is MOVED up. If the parent overflows, it splits too. A root split is the only way the tree grows taller." }
          ]
        },
        {
          type: "dryRun",
          title: "Order Calculation (GATE pattern)",
          iterations: [
            { step: "Given", variables: { "Block": "512 B", "Key": "8 B", "Child pointer": "6 B" }, description: "Find the maximum order p of an internal node." },
            { step: 1, variables: { "Constraint": "p × 6 + (p − 1) × 8 ≤ 512" }, description: "p pointers and p − 1 keys must fit in one block." },
            { step: 2, variables: { "Solve": "14p − 8 ≤ 512 → p ≤ 37.1" }, description: "" },
            { step: 3, variables: { "Order": "p = 37" }, description: "Leaf order uses (key + record pointer) pairs plus one next-leaf pointer: n(key + record ptr) + ptr ≤ block size." }
          ]
        },
        {
          type: "code",
          title: "Indexes in SQL",
          language: "sql",
          code: "-- B+ tree index (the default in MySQL InnoDB and PostgreSQL)\nCREATE INDEX idx_student_email ON student(email);\n\n-- Composite index: leftmost-prefix rule\nCREATE INDEX idx_dept_salary ON employee(dept_id, salary);\n-- Can use the index:   WHERE dept_id = 5\n-- Can use the index:   WHERE dept_id = 5 AND salary > 50000\n-- Can't use it well:   WHERE salary > 50000   (skips the leftmost column)\n\n-- Check whether the index is used\nEXPLAIN SELECT * FROM employee WHERE dept_id = 5 AND salary > 50000;",
          explanation: "A composite B+ tree is sorted by the first column, then by the second, like a phone book sorted by surname and then first name."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Why do databases use B+ trees instead of hash tables or BSTs for indexes?",
              trap: "Answering only 'because they're balanced'.",
              solution: "High fan-out means few disk reads (each node is one page). Linked leaves make range queries and ORDER BY cheap, which hashing can't do. They stay balanced under inserts and deletes. And internal nodes hold no data pointers, so more keys fit per page than in a B-tree."
            },
            {
              question: "Should you index every column?",
              trap: "Saying yes, because indexes make queries faster.",
              solution: "No. Every index slows down INSERT, UPDATE and DELETE (each index must be updated) and uses disk and memory. Index columns used in WHERE, JOIN and ORDER BY that are selective. Low-selectivity columns such as a gender flag rarely help."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which property makes B+ trees especially good for range queries such as 'salary BETWEEN 30k AND 50k'?",
          options: ["Keys in internal nodes are unique", "Leaves are linked in sorted order", "Nodes are always full", "The tree height is 1"],
          answer: 1,
          explanation: "After finding 30k, the DBMS walks the linked leaves sideways until it passes 50k, without going back up the tree."
        },
        {
          type: "takeaways",
          items: [
            "B+ trees: data pointers only in leaves, leaves linked, always balanced, O(log n) operations.",
            "Leaf split copies the separator up; internal split moves it up; the tree grows only at the root.",
            "Order: p × pointer + (p − 1) × key ≤ block size.",
            "Composite indexes follow the leftmost-prefix rule; use EXPLAIN to check usage."
          ]
        }
      ]
    }
  },
  {
    id: "hashing-and-index-choice",
    slug: "hashing-and-index-choice",
    title: "Hash Indexes and Choosing the Right Index",
    description: "Static and extendible hashing, hash vs B+ tree, covering indexes, and how query planners use indexes.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Hash-Based Indexing",
          content: "A hash function maps a search key to a bucket (one or more blocks). An equality lookup ('WHERE id = 42') costs about one block access.\n\nStatic hashing: a fixed number of buckets. As data grows, overflow chains get longer and lookups slow down.\nExtendible hashing: a directory of 2^d pointers (d = global depth). When a bucket overflows, only that bucket splits. The directory doubles only when the overflowing bucket's local depth equals the global depth.\nLinear hashing: buckets split one at a time in a fixed round-robin order, so no directory is needed."
        },
        {
          type: "table",
          title: "Hash Index vs B+ Tree Index",
          headers: ["Query", "Hash index", "B+ tree index"],
          rows: [
            ["`WHERE id = 42`", "Excellent (~1 I/O)", "Very good (~3-4 I/O)"],
            ["`WHERE price BETWEEN 100 AND 200`", "Useless", "Excellent"],
            ["`ORDER BY created_at`", "Useless", "Returns rows already sorted"],
            ["`WHERE name LIKE 'Ra%'`", "Useless", "Works (prefix range)"],
            ["Where it's used", "Memory tables, hash joins, some key-value stores", "Default index almost everywhere"]
          ]
        },
        {
          type: "list",
          title: "Index Design Checklist",
          items: [
            "**Selectivity**: index columns that filter out most rows (email, order_id), not near-constant ones (is_active).",
            "**Covering index**: if the index holds every column a query needs, the DBMS answers from the index alone (an index-only scan).",
            "**Composite order**: put equality-filtered columns first and range-filtered columns last.",
            "**Functions defeat indexes**: `WHERE YEAR(created_at) = 2025` can't use an index on created_at. Rewrite it as a range: `created_at >= '2025-01-01' AND created_at < '2026-01-01'`.",
            "**Leading wildcard**: `LIKE '%son'` can't use a B+ tree index.",
            "**Write cost**: each extra index slows down inserts and updates."
          ]
        },
        {
          type: "think",
          question: "A query on a 50 million row table uses WHERE status = 'DELIVERED' AND customer_id = 991. 90% of orders are DELIVERED. Which index would you create?",
          answerReveal: "An index on customer_id, or a composite (customer_id, status). customer_id is highly selective. status is not: 90% of rows match it, so an index on status alone is nearly useless and the planner would probably ignore it."
        },
        {
          type: "quickCheck",
          question: "Which query can NOT benefit from a B+ tree index on last_name?",
          options: ["WHERE last_name = 'Rao'", "WHERE last_name LIKE 'Ra%'", "WHERE last_name LIKE '%ao'", "ORDER BY last_name"],
          answer: 2,
          explanation: "A leading wildcard has no fixed prefix to search the sorted tree for, so the DBMS must scan."
        },
        {
          type: "takeaways",
          items: [
            "Hash indexes are only for equality; B+ trees handle equality, ranges and sorting.",
            "Extendible hashing grows smoothly by splitting buckets and doubling a directory.",
            "Index selective columns, follow the leftmost prefix, and avoid functions on indexed columns."
          ]
        }
      ]
    }
  }
];

export const nosqlScalingLessons: CourseLesson[] = [
  {
    id: "sql-vs-nosql-and-cap",
    slug: "sql-vs-nosql-and-cap",
    title: "SQL vs NoSQL, CAP Theorem and BASE",
    description: "When to choose relational or NoSQL databases, and the consistency trade-offs of distributed systems.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "SQL vs NoSQL",
          headers: ["", "Relational (SQL)", "NoSQL"],
          rows: [
            ["Schema", "Fixed, defined up front", "Flexible / schema-on-read"],
            ["Data model", "Tables + joins", "Document, key-value, wide-column, graph"],
            ["Transactions", "Full multi-row ACID", "Varies: often single-item, some support multi-item ACID"],
            ["Scaling", "Traditionally vertical (bigger machine); horizontal via sharding is harder", "Designed for horizontal scaling across many nodes"],
            ["Query power", "Rich ad-hoc queries, joins, aggregations", "Optimized for known access patterns"],
            ["Choose when", "Money, inventory, bookings, strong relationships", "Huge scale, flexible data, caching, feeds, telemetry"]
          ]
        },
        {
          type: "text",
          title: "CAP Theorem",
          content: "In a distributed data store, when a network partition happens (some nodes can't talk to others), you must choose between:\nConsistency (C): every read sees the latest write.\nAvailability (A): every request gets a non-error response.\n\nPartition tolerance (P) isn't optional in a real network, so the practical choice is CP or AP during a partition.\n\nCP: refuse or delay requests rather than return stale data. Examples: HBase, MongoDB with majority writes, etcd/ZooKeeper.\nAP: always answer, even if the data may be stale, and reconcile later. Examples: Cassandra, DynamoDB (default), CouchDB.\n\nPACELC extends CAP: even with no partition (Else), you trade Latency against Consistency."
        },
        {
          type: "text",
          title: "BASE",
          content: "BASE is the philosophy of many AP systems:\nBasically Available: the system answers even during failures.\nSoft state: data may change without new input as replicas sync.\nEventual consistency: if writes stop, all replicas eventually converge.\n\nACID favors correctness. BASE favors availability and scale."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "MongoDB or MySQL for an e-commerce app?",
              trap: "Picking one as always better.",
              solution: "Use the access pattern. Orders, payments and inventory need multi-row ACID and relational integrity, so a relational DB fits. A product catalog with varied attributes, sessions or activity feeds can fit a document or key-value store. Many systems use both (polyglot persistence)."
            },
            {
              question: "Does CAP mean you choose 2 of 3 at all times?",
              trap: "Saying 'my system is CA'.",
              solution: "CA only exists on a single node, where partitions can't happen. Any distributed system must tolerate partitions, so the real decision is C versus A while a partition is happening."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "During a network partition, a system keeps accepting writes on both sides and merges them later. It is choosing:",
          options: ["CP", "AP", "CA", "ACID"],
          answer: 1,
          explanation: "It stays available and gives up immediate consistency, reconciling afterwards: AP with eventual consistency."
        },
        {
          type: "takeaways",
          items: [
            "Choose SQL vs NoSQL by consistency needs and access patterns, not popularity.",
            "CAP: during a partition, pick consistency or availability.",
            "BASE = basically available, soft state, eventually consistent."
          ]
        }
      ]
    }
  },
  {
    id: "replication-sharding-partitioning",
    slug: "replication-sharding-partitioning",
    title: "Replication, Partitioning and Sharding",
    description: "How databases scale reads and writes beyond one machine, and the problems that come with it.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Scaling Techniques",
          headers: ["Technique", "What it is", "Solves", "Costs"],
          rows: [
            ["Vertical scaling", "A bigger machine (CPU, RAM, SSD)", "Everything, up to a limit", "Expensive; a hard ceiling; single point of failure"],
            ["Replication", "Copies of the same data on several nodes", "Read scaling, high availability", "Replication lag, write conflicts"],
            ["Partitioning", "Split one table into parts (by range, list or hash) inside one DB", "Faster scans, easier archiving", "Queries spanning partitions"],
            ["Sharding", "Partitions spread across different servers", "Write scaling, huge datasets", "Cross-shard joins/transactions, rebalancing"]
          ]
        },
        {
          type: "text",
          title: "Replication Topologies",
          content: "Leader-follower (primary-replica): all writes go to the leader, which streams changes to followers that serve reads. Synchronous replication waits for a follower to confirm (safer, slower). Asynchronous doesn't wait (faster, but a crash can lose the latest writes, and readers may see stale data).\n\nMulti-leader: several nodes accept writes. Useful across data centers, but conflicting writes must be resolved.\n\nLeaderless (Dynamo-style): clients write to and read from several replicas. With N replicas, W write acknowledgements and R read responses, W + R > N guarantees that reads overlap the latest write."
        },
        {
          type: "table",
          title: "Choosing a Shard Key",
          headers: ["Strategy", "Example", "Pros", "Cons"],
          rows: [
            ["Range", "user_id 1-1M on shard 1, 1M-2M on shard 2", "Efficient range scans", "Hot spots (all new users land on the last shard)"],
            ["Hash", "shard = hash(user_id) mod N", "Even spread", "Range queries hit every shard; changing N moves most keys (use consistent hashing)"],
            ["Directory / lookup", "A table maps tenant → shard", "Flexible placement", "The lookup service becomes critical"],
            ["Geo", "Indian users on the Mumbai shard", "Low latency, data residency", "Uneven load"]
          ]
        },
        {
          type: "think",
          question: "Users complain that their profile edit 'disappears' right after saving, then reappears seconds later. What's happening and how do you fix it?",
          answerReveal: "Replication lag: the write went to the leader, but the follow-up read was served by an asynchronous replica that hadn't caught up. Fix it with read-your-writes consistency: read the user's own data from the leader for a short time after they write, or route their reads to replicas that have reached their last write position."
        },
        {
          type: "quickCheck",
          question: "With N = 3 replicas, which (W, R) configuration guarantees that a read sees the latest write?",
          options: ["W = 1, R = 1", "W = 1, R = 2", "W = 2, R = 2", "W = 2, R = 1"],
          answer: 2,
          explanation: "W + R must be greater than N: 2 + 2 = 4 > 3. The other options don't guarantee that the read set overlaps the write set."
        },
        {
          type: "takeaways",
          items: [
            "Replication scales reads and availability; sharding scales writes and data size.",
            "Async replication causes lag; use read-your-writes when users must see their own changes.",
            "Shard keys decide hot spots; consistent hashing reduces data movement when nodes change.",
            "Quorum rule: W + R > N."
          ]
        }
      ]
    }
  }
];
