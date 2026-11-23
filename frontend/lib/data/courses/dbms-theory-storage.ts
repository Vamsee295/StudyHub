// Long-form theory for DBMS modules 9-10 (indexing, NoSQL and scaling). Original writing.
import { LessonTheory } from './utils';

const CMU_445 = { title: "CMU 15-445/645 Database Systems (free lectures and notes)", url: "https://15445.courses.cs.cmu.edu/" };
const PG_INDEXES = { title: "PostgreSQL documentation: Indexes", url: "https://www.postgresql.org/docs/current/indexes.html", license: "PostgreSQL License" };
const PG_EXPLAIN = { title: "PostgreSQL documentation: Using EXPLAIN", url: "https://www.postgresql.org/docs/current/using-explain.html", license: "PostgreSQL License" };
const SQLITE_FILE = { title: "SQLite: Database File Format (B-tree pages)", url: "https://www.sqlite.org/fileformat2.html", license: "Public domain" };
const SQLITE_PLANNER = { title: "SQLite: The SQLite Query Optimizer Overview", url: "https://www.sqlite.org/optoverview.html", license: "Public domain" };
const SD_PRIMER = { title: "donnemartin/system-design-primer", url: "https://github.com/donnemartin/system-design-primer", license: "CC BY 4.0" };
const DYNAMO = { title: "DeCandia et al., Dynamo: Amazon's Highly Available Key-value Store (2007)", url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf" };
const BREWER = { title: "Eric Brewer, CAP Twelve Years Later: How the Rules Have Changed (2012)", url: "https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/" };

export const dbmsStorageTheory: Record<string, LessonTheory> = {
  "file-organization-and-indexes": {
    theory: `An index is a separate data structure that lets the database find rows without reading the whole table, the way a textbook's index lets you find a topic without reading every page. To understand indexes, you first need to know how tables sit on disk and why the cost of a query is counted in disk blocks. This lesson covers file organizations, the main index types, dense and sparse indexes, and the block-access calculations GATE asks about.

## Disk blocks are the unit of cost

Disks and SSDs read and write data in fixed-size blocks (pages), typically 4 KB to 16 KB. Reading one byte costs the same as reading the whole block, and reading a block from storage is thousands of times slower than processing it in memory. So database designers count **block accesses**, not comparisons, when estimating query cost.

A table of 30,000 student records at 100 bytes each fills 3,000 blocks of 1 KB. Finding one student by scanning means reading up to 3,000 blocks. Every technique in this lesson exists to cut that number.

## File organizations

The way rows are arranged in the table's file decides the cost of a search before any index exists:

- **Heap file**: rows go wherever there's free space, in no particular order. Inserts are fast, but finding a row means scanning: b/2 blocks on average, where b is the number of blocks
- **Sorted (sequential) file**: rows are kept in order of one key. Binary search finds a row in about log₂(b) block reads, and range queries read consecutive blocks. Inserts are expensive, because rows must shift to keep the order
- **Hashed file**: a hash of the key decides which bucket (block) holds the row, so an equality search reads about one block. Range queries get no help, because hashing scatters neighbouring keys

## Primary, clustering and secondary indexes

Indexes are classified by their relationship to the file's order:

| Index | Built on | File sorted by that field? | Entries |
|---|---|---|---|
| Primary | A unique ordering key | Yes | One per block (sparse) |
| Clustering | A non-unique ordering field | Yes | One per distinct value (sparse) |
| Secondary | Any other field | No | One per row (dense) |

A file can be physically sorted only one way, so a table has at most one primary or clustering index. It can have as many secondary indexes as you like, each costing extra space and extra work on every insert.

## Dense and sparse indexes

A **dense** index has an entry for every search-key value in the file. A **sparse** index has entries for only some values, usually the first key in each block. To find a key with a sparse index, you locate the last index entry not greater than the key, jump to that block, and scan within it.

Sparse indexes are smaller and work only when the file is sorted on the indexed key. Dense indexes work on any file, and they can answer "does this value exist?" from the index alone.

## A block-access calculation

GATE often asks how much an index helps. Take 30,000 records of 100 bytes, 1,024-byte blocks, and index entries of 15 bytes (key plus pointer), with the file sorted on the key:

1. **Blocking factor**: ⌊1024 / 100⌋ = 10 records per block, so the file has 3,000 blocks
2. **Without an index**: binary search needs ⌈log₂ 3000⌉ = 12 block reads
3. **Sparse primary index**: one entry per data block gives 3,000 entries; ⌊1024 / 15⌋ = 68 entries fit per block, so the index has ⌈3000 / 68⌉ = 45 blocks
4. **With the index**: ⌈log₂ 45⌉ = 6 reads to search the index, plus 1 to read the data block, giving 7

Going from 12 to 7 reads helps, and a multilevel index (an index on the index) cuts it to 3 or 4. That idea, taken to its conclusion, is the B+ tree in the next lesson.

## Clustered and non-clustered indexes

Interviewers use these terms more than "primary" and "secondary". A **clustered** index stores the table's rows in the index's order; in MySQL InnoDB and SQL Server, the leaf pages of the clustered index are the table itself, and it's built on the primary key by default. A **non-clustered** index is a separate structure whose entries point to rows, by a row ID or by the clustered key.

The practical consequence: a range query on the clustered key reads rows stored next to each other, while the same query through a non-clustered index may jump to a different page for every row. PostgreSQL stores tables as heaps and treats every index as non-clustered; its \`CLUSTER\` command reorders a table once but doesn't maintain the order afterwards.

## Indexes aren't free

Every index costs disk space and memory for its pages. Every \`INSERT\`, \`DELETE\` and indexed-column \`UPDATE\` must update every index on the table. A table with ten indexes makes each insert do eleven writes. Index the columns your frequent queries filter, join and sort on, and drop indexes nothing uses.

## How interviewers test this

Expect "What is an index and how does it speed up queries?", "Clustered vs non-clustered index", and "Why not index every column?" For the first, mention block reads; for the second, physical order and one-per-table; for the third, write cost and space. GATE asks the block-access calculation, so practice the four steps above.`,
    sources: [CMU_445, PG_INDEXES, SQLITE_FILE]
  },

  "b-trees-and-b-plus-trees": {
    theory: `The B+ tree is the index structure behind almost every relational database: PostgreSQL, MySQL, Oracle, SQL Server and SQLite all use it as their default index. It stays shallow even for billions of rows, it keeps itself balanced as data changes, and it handles both exact lookups and range queries. This lesson explains why binary trees don't work on disk, how B-trees and B+ trees differ, how insertion keeps the tree balanced, and how to calculate a tree's order.

## Why not a binary search tree

A balanced binary search tree over a million keys has a height of about 20. On disk, each level means reading a different block, so a lookup costs 20 block reads. Binary trees are tall because each node holds one key and two children.

A B-tree makes each node as wide as a disk block. If a node holds 200 keys, it has about 200 children, so three levels cover 200 × 200 × 200 = 8 million keys and four levels cover 1.6 billion. The top levels are small enough to stay cached in memory, so most lookups read only one or two blocks from storage.

## B-trees and B+ trees

Both are balanced trees of wide nodes, and they differ in where the data lives:

| | B-tree | B+ tree |
|---|---|---|
| Data pointers | In internal nodes and leaves | Only in leaves |
| Internal nodes | Keys, data pointers and child pointers | Keys and child pointers only |
| Keys | Each appears once | Internal keys repeat in the leaves |
| Leaves | Not linked | Linked in key order |
| Range query | Needs repeated tree traversal | Find the start, then follow leaf links |

Two advantages make the B+ tree the database standard. Internal nodes hold no data pointers, so more keys fit per node, the fan-out rises and the tree gets shorter. The linked leaves turn a range query such as \`WHERE cgpa BETWEEN 7 AND 8\` into one descent plus a sequential walk.

## The rules of a B+ tree

For a tree of order p, where p is the maximum number of children per node:

- every internal node except the root has between ⌈p/2⌉ and p children
- the root has at least 2 children, unless it's the only node
- a node with k children holds k − 1 keys that separate the subtrees
- all leaves are at the same depth, so the tree is always perfectly balanced
- leaves hold key and record-pointer pairs, plus a pointer to the next leaf

The minimum-occupancy rule keeps nodes at least half full, which bounds the height. Search, insert and delete all take O(log n) block accesses.

## Insertion and splits

To insert a key, find the correct leaf and add the key in sorted position. If the leaf overflows, split it into two leaves and add a separator key to the parent. The rules for what moves up are specific:

- **Leaf split**: the separator is **copied** up, so it also stays as the first key of the right leaf, because every key must exist in a leaf
- **Internal split**: the middle key is **moved** up and doesn't stay in either half

If the parent overflows, it splits too, and the split can travel up to the root. Splitting the root creates a new root above it, and that's the only way the tree grows taller. All leaves therefore stay at the same depth automatically.

Deletion works in reverse: if a node falls below half full, it borrows a key from a sibling or merges with it, and merges can travel upwards and shrink the tree.

## Calculating the order

GATE gives a block size, key size and pointer size and asks for the maximum order. For an internal node, p child pointers and p − 1 keys must fit in one block. With a 512-byte block, 8-byte keys and 6-byte pointers:

~~~text
p × 6 + (p − 1) × 8 ≤ 512
14p − 8 ≤ 512
p ≤ 37.14, so p = 37
~~~

For a leaf, count key and record-pointer pairs plus one next-leaf pointer: n × (key + record pointer) + pointer ≤ block size.

## Composite indexes and the leftmost prefix

An index on \`(dept_id, salary)\` is sorted by \`dept_id\` first, then by \`salary\` within each department, like a phone book sorted by surname, then first name. It helps \`WHERE dept_id = 5\` and \`WHERE dept_id = 5 AND salary > 50000\`. It can't efficiently help \`WHERE salary > 50000\` alone, because matching salaries are scattered across every department. That's the **leftmost-prefix rule**, and it decides the column order of every composite index you design.

## How interviewers test this

The classic question is "Why do databases use B+ trees instead of binary trees or hash tables?" Answer with fan-out and block reads (short trees), linked leaves (range queries and sorting), and self-balancing (consistent performance). GATE asks order calculations and the number of keys after a sequence of insertions, so practice drawing splits.`,
    sources: [CMU_445, SQLITE_FILE, PG_INDEXES]
  },

  "hashing-and-index-choice": {
    theory: `Hash indexes find a row in about one step when you know its exact key, but they can't help with ranges or sorting. Choosing the right index means matching the structure to the queries you run, then checking that the database actually uses it. This lesson explains static and extendible hashing, compares hash and B+ tree indexes, and gives practical rules for designing indexes and reading a query plan.

## How hash indexing works

A hash function turns a key into a bucket number, and the bucket (one or more blocks) holds the entries for that key. Looking up \`roll_no = 2045\` means computing the hash, reading the bucket, and scanning its few entries: about one block access, regardless of table size.

The catch is that hashing deliberately scatters keys. Roll numbers 2045 and 2046 land in unrelated buckets, so a query for roll numbers between 2000 and 2100 gets no help from a hash index.

## Static hashing and its problem

Static hashing fixes the number of buckets in advance. As the table grows, buckets fill and spill into overflow chains, and lookups slow down as they follow those chains. Doubling the number of buckets means rehashing every entry at once, which is expensive and blocks the table while it runs.

## Extendible hashing

Extendible hashing grows smoothly. It keeps a directory of 2^d pointers, where d is the global depth, and uses the first d bits of each hash to pick a directory slot. Several slots may point to the same bucket, and each bucket records its own local depth.

When a bucket overflows, only that bucket splits:

1. If its local depth is less than the global depth, split it into two buckets and update the directory slots that pointed to it
2. If its local depth equals the global depth, double the directory first (d increases by 1), then split

Most splits touch one bucket, so growth costs stay small and spread out. **Linear hashing** is a related scheme that splits buckets one at a time in a fixed round-robin order and needs no directory.

## Hash index versus B+ tree

| Query | Hash index | B+ tree index |
|---|---|---|
| \`WHERE roll_no = 2045\` | About 1 block read | 2 to 4 block reads |
| \`WHERE cgpa BETWEEN 7 AND 8\` | No help | One descent, then a leaf walk |
| \`ORDER BY created_at\` | No help | Rows already in order |
| \`WHERE name LIKE 'Ra%'\` | No help | Works as a prefix range |
| Typical use | In-memory tables, hash joins | Default index almost everywhere |

The B+ tree is a few block reads slower on exact matches, and in exchange it handles everything else. That's why it's the default, and why PostgreSQL's \`CREATE INDEX\` builds a B-tree unless you ask for \`USING hash\`.

## Rules for designing indexes

Use these rules when deciding what to index:

- **Selectivity**: index columns that narrow results to few rows, such as \`email\` or \`order_id\`. A column like \`is_active\`, where 95% of rows share one value, rarely helps, because reading most of the table through an index is slower than scanning it
- **Equality before range in composite indexes**: for \`WHERE dept_id = 5 AND salary > 50000\`, build \`(dept_id, salary)\`, not the reverse
- **Covering indexes**: if an index contains every column a query needs, the database answers from the index alone, an index-only scan
- **Functions hide columns**: \`WHERE YEAR(created_at) = 2025\` can't use an index on \`created_at\`. Rewrite it as a range: \`created_at >= '2025-01-01' AND created_at < '2026-01-01'\`
- **Leading wildcards**: \`LIKE '%son'\` has no fixed prefix, so a B+ tree can't help
- **Foreign keys**: index them, because joins and cascading deletes search on them, and PostgreSQL doesn't create those indexes automatically

## Check the plan

Never assume an index is used; ask the database. PostgreSQL and MySQL show the chosen plan with \`EXPLAIN\`, and \`EXPLAIN ANALYZE\` runs the query and reports real timings. SQLite uses \`EXPLAIN QUERY PLAN\`:

~~~sql
EXPLAIN QUERY PLAN
SELECT * FROM employees WHERE department = 'Sales';
~~~

Before an index exists, SQLite reports \`SCAN employees\`. After \`CREATE INDEX idx_dept ON employees(department)\`, it reports \`SEARCH employees USING INDEX idx_dept (department=?)\`. You can run both in the StudyHub SQL Lab.

## When the planner ignores your index

The optimizer estimates costs from table statistics, and it may choose a full scan when your filter matches a large fraction of rows, because sequential reads are faster than many random ones. Stale statistics cause bad choices too: run \`ANALYZE\` after large data changes so the planner's row estimates match reality.

## How interviewers test this

Expect "Hash index vs B+ tree index" (equality only versus equality, ranges and sorting) and a design question such as "Which index would you create for this query?" Talk about selectivity and column order, then mention checking the result with \`EXPLAIN\`, which shows you've done this on a real database.`,
    sources: [PG_INDEXES, PG_EXPLAIN, SQLITE_PLANNER, CMU_445]
  },

  "sql-vs-nosql-and-cap": {
    theory: `"SQL or NoSQL?" is one of the most common design questions in interviews, and the honest answer depends on the data and how it's accessed. This lesson compares relational and NoSQL databases, explains the CAP theorem and its extension PACELC, and describes BASE, the consistency model many distributed stores choose. The goal is to make the choice from requirements rather than habit.

## What NoSQL changes

NoSQL is a family of databases that drop some relational features to gain others. Most of them change three things:

- **Data model**: documents, key-value pairs, wide columns or graphs instead of tables joined by keys
- **Schema**: flexible or schema-on-read, so records in one collection can have different fields
- **Scaling**: designed to spread data across many machines from the start

The cost is usually weaker ad-hoc querying, fewer joins, and in many systems, weaker transaction guarantees across records.

## Comparing the two

| | Relational (SQL) | NoSQL |
|---|---|---|
| Schema | Fixed, changed through migrations | Flexible per record |
| Relationships | Joins across tables | Embedding or application-side joins |
| Transactions | Multi-row ACID | Often single-record; some offer multi-record |
| Scaling | Vertical first; sharding is extra work | Horizontal by design |
| Queries | Rich ad-hoc SQL | Optimized for known access patterns |

## Choosing from the requirements

Use the access pattern and consistency needs to decide:

- **Money, inventory, bookings, grades**: relational. You need multi-row transactions and constraints, because a half-applied payment is unacceptable
- **Product catalogs with varying attributes**: document stores fit well, because each product's fields differ
- **Sessions, caches, rate-limit counters**: key-value stores, because every access is "get or set by key" and speed matters most
- **Event logs and time series at hundreds of thousands of writes per second**: wide-column stores spread writes across many nodes
- **Social graphs and recommendations**: graph databases follow relationships many hops deep efficiently

Many systems combine stores, a practice called polyglot persistence. A college platform might keep enrollments in PostgreSQL, sessions in Redis and course search in Elasticsearch.

## The CAP theorem

The CAP theorem concerns distributed data stores, systems that keep copies of data on several machines. It names three properties:

- **Consistency (C)**: every read returns the most recent write, as if there were one copy
- **Availability (A)**: every request to a working node gets a non-error response
- **Partition tolerance (P)**: the system keeps working when the network splits the nodes into groups that can't communicate

The theorem says that while a network partition is happening, a system must give up either consistency or availability. Networks do fail, so partition tolerance isn't optional. The real choice is between C and A during a partition.

## CP and AP systems

A **CP** system refuses or delays requests on the side of the partition that can't confirm the latest data, rather than return stale values. ZooKeeper, etcd and MongoDB with majority writes behave this way. An **AP** system keeps answering on both sides and reconciles the copies afterwards, accepting that some reads are stale. Cassandra, DynamoDB in its default mode and CouchDB behave this way.

A single-node database is often described as "CA", but that only means it has no partitions to tolerate, because it isn't distributed.

## PACELC

CAP says nothing about normal operation, when there's no partition. PACELC extends it: during a **P**artition, choose **A** or **C**; **E**lse, choose between **L**atency and **C**onsistency. Even with a healthy network, waiting for several replicas to confirm a write adds latency. Cassandra and DynamoDB favour low latency by default, while systems such as Google Spanner pay latency for strong consistency.

## BASE

Many AP systems describe their guarantees as BASE:

- **Basically available**: the system answers even during failures
- **Soft state**: replicas may hold different values for a while as updates propagate
- **Eventually consistent**: if writes stop, all replicas converge to the same value

ACID favours correctness at each step. BASE favours availability and scale, and pushes some conflict handling into the application, such as merging two shopping carts edited on both sides of a partition.

## How interviewers test this

For "MongoDB or MySQL for X?", name the access pattern and consistency need first, then the choice. For CAP, state that partitions force a choice between consistency and availability, give one CP and one AP example, and mention PACELC to show you know CAP's limits.`,
    sources: [BREWER, DYNAMO, SD_PRIMER, CMU_445]
  },

  "replication-sharding-partitioning": {
    theory: `A single database server eventually runs out of room for reads, writes, data or uptime. Replication, partitioning and sharding are the three techniques for going beyond one machine, and each solves a different bottleneck. This lesson explains how each works, the problems each introduces, and how to choose a shard key, using a growing student platform as the example.

## Start by scaling up

Vertical scaling means moving to a bigger machine: more CPU, more memory, faster SSDs. It needs no code changes and keeps every guarantee of a single database. Its limits are cost, a hard ceiling on machine size, and a single point of failure. Most systems should scale up as far as is affordable before adding the complexity below.

## Replication

Replication keeps copies of the same data on several nodes. It serves two goals: more read capacity, because replicas answer read queries, and high availability, because a replica can take over if the primary fails.

In **leader-follower** (primary-replica) replication, all writes go to the leader, which streams its changes (often its write-ahead log) to followers. The timing of that stream is a key decision:

- **Synchronous**: the leader waits for a follower to confirm before acknowledging a write. No committed write is lost if the leader dies, but every write gets slower
- **Asynchronous**: the leader acknowledges immediately. Writes are fast, but a leader crash can lose the most recent writes, and followers may serve slightly stale data

Many deployments use one synchronous follower for safety and several asynchronous ones for read capacity.

## Replication lag in practice

Asynchronous followers run behind the leader by milliseconds to seconds. A student updates their phone number, the next page load reads from a follower that hasn't caught up, and the old number appears. The fix is **read-your-writes consistency**: route a user's reads to the leader for a short time after they write, or to a follower known to have reached their last write.

## Multi-leader and leaderless replication

**Multi-leader** replication accepts writes at several nodes, for example one per data center. It survives a data center outage, but two leaders can change the same row at once, so the system needs a conflict-resolution rule.

**Leaderless** replication, used by Dynamo-style stores such as Cassandra, sends each write to several replicas and reads from several. With N replicas, waiting for W write acknowledgements and R read responses guarantees that a read sees the latest write when W + R > N, because the read set and write set must overlap. With N = 3, W = 2 and R = 2 satisfies this.

## Partitioning

Partitioning splits one large table into smaller pieces inside one database. PostgreSQL's declarative partitioning can split an \`attendance\` table by month, so a query for one month reads one partition, and old months can be detached and archived instantly. Partitioning helps manageability and scans, but the data still lives on one server.

## Sharding

Sharding spreads partitions across different servers, each holding a subset of the rows. It's the only one of the three techniques that scales writes and total data size beyond one machine. The cost is complexity:

- **Cross-shard queries**: a query that needs rows from every shard must ask every shard and merge results
- **Cross-shard transactions**: atomic updates spanning shards need distributed protocols such as two-phase commit, which are slow and fragile
- **Rebalancing**: adding a shard means moving data while the system keeps running

## Choosing a shard key

The shard key decides which shard holds each row, and it's hard to change later:

| Strategy | Example | Strength | Weakness |
|---|---|---|---|
| Range | roll numbers 1 to 1M on shard 1 | Efficient range scans | New rows pile onto the last shard (hot spot) |
| Hash | shard = hash(user_id) mod N | Even spread | Range queries hit every shard |
| Directory | a lookup table maps college to shard | Flexible placement | The lookup service becomes critical |
| Geographic | Indian users on a Mumbai shard | Low latency, data residency | Uneven load across regions |

Plain \`hash mod N\` moves most keys when N changes. **Consistent hashing** places shards and keys on a ring, so adding a shard moves only the keys between it and its neighbour.

## Choosing among the techniques

Match the technique to the bottleneck: replication for read load and availability, partitioning for tables with hundreds of millions of rows on one server, and sharding only when writes or data size exceed what one server can handle. Sharding too early adds permanent complexity that a bigger server or a read replica would have avoided.

## How interviewers test this

Expect "Replication vs sharding" (copies for reads and availability versus splitting data for writes and size), "What is replication lag and how do you handle it?", and the quorum condition W + R > N. For shard keys, discuss hot spots and why consistent hashing helps.`,
    sources: [DYNAMO, SD_PRIMER, CMU_445]
  }
};
