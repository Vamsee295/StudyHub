// System Design modules 3-4: data storage, async processing and reliability. Original writing;
// topic coverage follows the CC BY 4.0 system-design-primer, cited per lesson.
import { CourseLesson } from './types';
import { sdLesson, SDP, SRE_BOOK, AWS_BUILDERS, DYNAMO, AWESOME_SCALABILITY } from './system-design-shared';

export const sdDataLessons: CourseLesson[] = [
  sdLesson("database-replication-and-sharding", "Database Replication, Partitioning and Sharding",
    "Scale reads with replicas and writes with sharding, and handle the problems each creates.", 25,
`The database is usually the first component to buckle under growth, because app servers scale out easily and data doesn't. Two techniques scale it: replication copies data to more machines to handle more reads and survive failures, and sharding splits data across machines to handle more writes and storage. This lesson explains both, their variants, and the problems they introduce.

## Leader-follower replication

In **leader-follower** (primary-replica) replication, one node, the leader, accepts all writes and streams changes to followers, which serve reads.

~~~text
          writes                 replication log
Client  ------->  Leader  ------------------------>  Followers
Client  <----------------------- reads ---------------  Followers
~~~

Benefits: read capacity grows with each follower, followers can live in other regions for local reads, and a follower can be promoted if the leader fails.

## Synchronous versus asynchronous replication

- **Synchronous**: the leader waits for followers to confirm before acknowledging a write. No data loss on failover, but writes are slower, and a slow follower stalls writes
- **Asynchronous**: the leader acknowledges immediately and replicates in the background. Fast writes, but a leader crash can lose the most recent writes, and followers lag behind

Most systems use asynchronous replication, sometimes with one synchronous follower (semi-synchronous) to guarantee at least one up-to-date copy.

## Replication lag

With asynchronous followers, a read may hit a replica that hasn't received the latest write. A user updates their profile, refreshes, and sees the old version. Mitigations:

- **Read-your-writes**: route a user's reads to the leader for a short time after they write, or read the user's own data from the leader
- **Monotonic reads**: pin each user to one replica so they never see data go backwards
- **Lag-aware routing**: avoid replicas that report lag above a threshold

## Multi-leader and leaderless replication

**Multi-leader** replication accepts writes at several leaders, often one per region, and syncs them. Writes are fast everywhere, but concurrent writes to the same record conflict and need resolution, such as last-write-wins or merging.

**Leaderless** replication, used by Dynamo-style stores such as Cassandra, sends each write to several replicas. With N replicas, a write succeeds after W confirmations and a read queries R replicas. If W + R > N, read and write sets overlap, so reads see the latest acknowledged write. Tuning W and R trades latency against consistency per query.

## Partitioning and sharding

Replication copies all data everywhere, so it doesn't help once writes or total data outgrow one machine. **Sharding** (horizontal partitioning) splits rows across machines, each holding a subset:

- **Range-based**: users A–M on shard 1, N–Z on shard 2. Range queries are efficient, but some ranges get hot
- **Hash-based**: shard = hash(user_id) mod N. Even spread, but range queries hit every shard, and changing N moves most keys; consistent hashing, covered later, fixes the last problem
- **Directory-based**: a lookup service maps each key to its shard. Flexible, but the directory must itself be scaled and highly available

**Vertical partitioning** is different: it splits tables or columns by feature, such as moving the users table and the orders table to different databases. It's a quick first step but has a limit, since each feature's table can still outgrow one machine.

## Choosing a shard key

The shard key decides everything. A good key:

- spreads load evenly, so no shard is hot
- keeps data that's queried together on the same shard
- rarely needs to change

For a chat app, sharding messages by conversation ID keeps each conversation on one shard. Sharding by timestamp sends all new writes to one shard, creating a hotspot.

## Problems sharding introduces

- **Cross-shard queries**: joins and aggregations across shards need application-level fan-out or a separate analytics store
- **Cross-shard transactions**: atomic updates spanning shards need two-phase commit or sagas, both complex
- **Hot keys**: a celebrity's account can overload its shard; split hot keys or cache them
- **Resharding**: adding shards means moving data while serving traffic

Because of these costs, shard only when needed: first add indexes, caching, read replicas and a bigger machine. Many companies run a single well-tuned primary much longer than they expect.

## How interviewers test this

Expect "How would you scale the database?" Walk the ladder: indexes and caching, read replicas for read load, vertical partitioning, then sharding with a justified shard key. Mention replication lag and read-your-writes, and name the cross-shard costs.`,
    [SDP, DYNAMO, AWESOME_SCALABILITY],
    {
      check: { question: "Read replicas mainly help with which load?", options: ["Read-heavy load", "Write-heavy load", "Storage beyond one machine", "Cross-shard joins"], answer: 0, explanation: "All writes still go to the leader; sharding is needed to scale writes and storage." },
      takeaways: ["Replication scales reads and adds failover; sharding scales writes and storage.", "Asynchronous replication is fast but can lose recent writes and causes lag.", "Pick a shard key that spreads load and keeps related data together.", "Shard last: indexes, caching, replicas and bigger machines come first."],
      traps: [
        { question: "Shard messages by created_at.", trap: "All new writes hit one shard.", solution: "Shard by a high-cardinality key such as conversation_id." },
        { question: "A user updates their profile and sees the old one.", trap: "Reading from a lagging replica.", solution: "Serve read-your-writes from the leader after a user's write." },
      ],
    }),

  sdLesson("sql-vs-nosql-choosing-storage", "SQL vs NoSQL: Choosing the Right Data Store",
    "Relational databases, key-value, document, wide-column, graph and object storage, and how to pick.", 20,
`Choosing a data store is one of the most consequential design decisions, because it shapes queries, scaling and consistency for years. No database is best at everything. This lesson compares relational databases with the main NoSQL families, adds object storage and search engines, and gives a decision approach you can explain in an interview.

## Relational databases

Relational databases such as PostgreSQL and MySQL store data in tables with schemas, support joins and SQL, and provide ACID transactions.

Choose them when:

- data is structured and relationships matter, such as users, orders and payments
- you need transactions across multiple rows or tables
- queries are varied and not all known in advance

Their scaling limit is writes on a single primary, which replicas don't fix. With good indexing and hardware, a single primary handles a large share of real-world workloads, and sharding or distributed SQL systems such as CockroachDB, Spanner or Vitess extend it further.

## Key-value stores

Key-value stores such as Redis, Memcached and DynamoDB map a key to an opaque value with O(1) lookups.

- Extremely fast, and straightforward to partition across nodes
- Queries only by key; no rich filtering or joins
- Uses: caches, sessions, rate-limit counters, feature flags, shopping carts

## Document stores

Document stores such as MongoDB and Couchbase store JSON-like documents, each potentially with different fields.

- Flexible schema, and nested data stays together, so one read fetches a whole entity
- Weaker join support; relationships across documents are handled in the application
- Uses: product catalogues with varied attributes, content management, user profiles

## Wide-column stores

Wide-column stores such as Cassandra, HBase and Bigtable organize data by row key into column families, designed for huge write volumes across many machines.

- Linear write scaling, tunable consistency, multi-region replication
- You design tables around queries; ad-hoc queries are hard
- Uses: time series, event logs, messaging history, IoT data

## Graph databases

Graph databases such as Neo4j store nodes and edges directly, making multi-hop relationship queries fast.

- Uses: social graphs ("friends of friends"), recommendations, fraud rings, knowledge graphs
- Less suited to bulk aggregation or plain key lookups

## Object storage and search

Two other stores appear in almost every design:

- **Object storage** such as Amazon S3 or Google Cloud Storage holds large binary files: images, videos, backups. It's cheap, durable and effectively unlimited, accessed by key over HTTP. Store the file there and keep only its URL and metadata in the database
- **Search engines** such as Elasticsearch and OpenSearch build inverted indexes for full-text search, ranking and faceted filters. They're usually fed from the primary database, not used as the source of truth

## Comparison

| Store | Data model | Strength | Weakness |
|---|---|---|---|
| Relational | Tables, schema | Transactions, joins, flexible queries | Write scaling beyond one primary |
| Key-value | Key → value | Speed, straightforward scaling | Query only by key |
| Document | JSON documents | Flexible schema, nested reads | Cross-document joins |
| Wide-column | Rows and column families | Massive writes, multi-region | Query-driven modelling |
| Graph | Nodes and edges | Relationship traversal | Aggregations |
| Object storage | Files by key | Cheap, durable bulk storage | Not a query engine |

## Polyglot persistence

Real systems combine stores, each for what it does best. An e-commerce platform might use PostgreSQL for orders and payments, Redis for sessions and caching, Elasticsearch for product search, S3 for product images, and a wide-column store for clickstream events. The cost is operational: more systems to run, monitor and keep in sync, usually via change data capture or event streams.

## A decision approach

Ask these questions in order:

1. Do we need multi-row transactions or complex relational queries? If yes, start relational
2. What are the main access patterns? Key lookups suggest key-value; whole-entity reads suggest documents
3. What's the write volume and scale? Massive write rates across regions suggest wide-column
4. Are relationships the core of the queries? Consider a graph database
5. Are there large files or full-text search needs? Add object storage or a search engine

"Use NoSQL because it scales" isn't a reason on its own. State the access pattern and requirement that drives the choice.

## How interviewers test this

Expect "SQL or NoSQL for this system, and why?" Tie the choice to transactions, access patterns and write volume, store media in object storage, and mention polyglot persistence with its operational cost.`,
    [SDP, AWESOME_SCALABILITY, DYNAMO],
    {
      check: { question: "Where should a video-sharing app store the video files themselves?", options: ["Object storage such as S3, with metadata in a database", "In a relational table as BLOBs", "In Redis", "In the search index"], answer: 0, explanation: "Object storage is cheap, durable and built for large files; the database keeps URLs and metadata." },
      takeaways: ["Relational databases suit transactions and varied queries.", "Key-value stores suit fast lookups by key; documents suit whole-entity reads.", "Wide-column stores suit massive write volumes; graphs suit relationship queries.", "Combine stores per need, and justify each with an access pattern."],
      traps: [
        { question: "Use MongoDB because NoSQL scales.", trap: "No link to requirements or access patterns.", solution: "Explain transactions, query shapes and write volume, then choose." },
        { question: "Store user-uploaded images in the database.", trap: "Bloats the database and its backups.", solution: "Put files in object storage and store references." },
      ],
    }),

  sdLesson("caching", "Caching Strategies and Pitfalls",
    "Where to cache, cache-aside vs write-through vs write-back, eviction, invalidation and stampedes.", 25,
`Caching keeps frequently used data in fast storage, usually memory, so most requests avoid slow work such as database queries or remote calls. A good cache can cut latency from tens of milliseconds to under one and reduce database load by an order of magnitude. Caching also introduces its hardest problems: stale data and invalidation. This lesson covers cache layers, update strategies, eviction, invalidation and the failure modes interviewers ask about.

## Where caches live

Caching happens at every layer:

- **Client**: browser caches and mobile app storage
- **CDN**: static and shareable content at the edge
- **Web server / reverse proxy**: cached HTTP responses
- **Application**: an in-process cache in each server, or a distributed cache such as Redis or Memcached shared by all servers
- **Database**: buffer pools and query caches inside the database itself

In-process caches are fastest but each server has its own copy, so data can differ between servers. A distributed cache is shared and consistent across servers, at the cost of a network hop.

## What to cache

Good candidates are read often, change rarely and are expensive to compute: user profiles, product details, rendered page fragments, computed feeds, session data. Data accessed with a skewed distribution benefits most: if 20% of items get 80% of reads, caching that 20% captures most of the benefit.

## Cache-aside (lazy loading)

The application manages the cache directly:

1. Look up the key in the cache
2. On a hit, return it
3. On a miss, read from the database, store the result in the cache with a TTL, and return it

~~~text
value = cache.get(key)
if value is null:
    value = db.query(key)
    cache.set(key, value, ttl=300)
return value
~~~

Only requested data is cached, and a cache failure degrades performance without breaking correctness. Downsides: each miss costs three trips, and data can be stale until the TTL expires or the key is invalidated. Cache-aside is the most common strategy.

## Write-through

Every write goes to the cache and the database together, so the cache is always current. Reads are fast and fresh, but writes are slower, and the cache fills with data that may never be read. It's often combined with cache-aside for reads.

## Write-back (write-behind)

Writes go to the cache only, and the cache flushes them to the database asynchronously, often in batches. Writes are fast, but if the cache node fails before flushing, data is lost. It suits high-volume, loss-tolerant data such as view counters, not orders or payments.

## Refresh-ahead

The cache refreshes popular entries before they expire, so users rarely see a miss. It works well when access patterns are predictable, and wastes work when predictions are wrong.

## Eviction policies

Memory is limited, so caches evict entries when full:

| Policy | Evicts | Notes |
|---|---|---|
| LRU (least recently used) | The entry unused for longest | The most common default |
| LFU (least frequently used) | The entry used least often | Better for stable popularity |
| FIFO | The oldest entry | Rarely ideal |
| TTL expiry | Entries past their time to live | Bounds staleness |

Redis supports several of these as configurable policies.

## Invalidation

When the underlying data changes, cached copies become stale. Strategies:

- **TTL**: accept staleness up to a bound, such as 5 minutes. Simplest, and often good enough
- **Delete on write**: when data changes, delete the cache key so the next read reloads it. Deleting is safer than updating the cache, because two concurrent updates can write cache values in the wrong order
- **Event-driven invalidation**: publish change events, often from the database's change log, and have cache consumers react

Even with delete-on-write, races exist: a reader can load old data from the database moments before a writer deletes the key, then write the stale value back into the cache. Short TTLs bound the damage.

## Failure modes

- **Cache stampede** (thundering herd): a hot key expires and thousands of requests miss at once, all hitting the database. Fixes: a lock so only one request rebuilds the value, serving stale data while refreshing, or adding random jitter to TTLs
- **Cache penetration**: requests for keys that don't exist always miss and hit the database, sometimes as an attack. Fix: cache "not found" results briefly, or use a Bloom filter
- **Hot keys**: one key gets so much traffic that its cache node saturates. Fix: replicate the key across nodes or keep a local in-process copy
- **Cold start**: after a restart, an empty cache sends all traffic to the database. Fix: warm the cache before taking traffic

## How interviewers test this

Expect "Where would you add caching?", "Cache-aside vs write-through?" and "How do you keep the cache consistent?" Place caches at the right layers, default to cache-aside with TTLs and delete-on-write, and explain stampede protection for hot keys.`,
    [SDP, AWS_BUILDERS, AWESOME_SCALABILITY],
    {
      check: { question: "A popular key expires and thousands of requests hit the database at once. What is this called?", options: ["A cache stampede (thundering herd)", "Cache penetration", "Write-back loss", "Replication lag"], answer: 0, explanation: "Fix it with a rebuild lock, stale-while-revalidate or TTL jitter." },
      takeaways: ["Cache data that is read often, changes rarely and is expensive to produce.", "Cache-aside is the default; write-through keeps caches fresh; write-back is fast but can lose data.", "Delete cache keys on writes and bound staleness with TTLs.", "Protect hot keys from stampedes, penetration and node saturation."],
      traps: [
        { question: "Update the cached value on every write.", trap: "Concurrent writes can leave the cache with the older value.", solution: "Delete the key and let the next read repopulate it." },
        { question: "Use write-back caching for payments.", trap: "A cache node failure loses unflushed writes.", solution: "Use write-back only for loss-tolerant data such as counters." },
      ],
    }),

  sdLesson("consistent-hashing", "Consistent Hashing",
    "Distribute keys across nodes so adding or removing a node moves only a small fraction of data.", 20,
`When data or requests are spread across N servers, the obvious approach, server = hash(key) mod N, breaks badly when N changes: almost every key moves to a different server. Consistent hashing fixes this, so adding or removing a node moves only about 1/N of the keys. It underpins distributed caches, Dynamo-style databases, and load balancers that need affinity. This lesson explains the problem, the hash ring, virtual nodes and where it's used.

## The problem with mod N

Suppose 4 cache servers and keys placed with hash(key) mod 4. Adding a fifth server changes the formula to mod 5, and a key's server changes unless hash(key) mod 4 happens to equal hash(key) mod 5. Roughly 80% of keys move.

For a cache, that means a sudden flood of misses that can overload the database. For a database, it means moving most of the data. Either way, scaling becomes dangerous.

## The hash ring

Consistent hashing maps both servers and keys onto the same circular space, for example 0 to 2³² − 1, arranged as a ring:

1. Hash each server's ID to a position on the ring
2. Hash each key to a position on the ring
3. Assign each key to the first server found moving clockwise from its position

~~~text
          S1
     k3 /    \\ k1
       S3      S2
          \\  /
           k2
~~~

When a server joins, it takes over only the keys between its position and the previous server's position. When a server leaves, only its keys move to the next server clockwise. On average, adding or removing one of N servers moves about 1/N of the keys.

## Lookup implementation

Keep server positions in a sorted structure, such as a sorted array or a balanced tree (Java's TreeMap). To find a key's server, hash the key and find the smallest position greater than or equal to it, wrapping around to the start of the ring if necessary. With a sorted array and binary search, lookups cost O(log N).

## The imbalance problem

With few servers, random positions divide the ring unevenly: one server might own 40% of the ring while another owns 10%. Uneven ownership means uneven load. And when a server fails, all its keys land on a single neighbour, which may be overwhelmed.

## Virtual nodes

The fix is **virtual nodes**: place each physical server at many positions on the ring, for example 100 to 200, by hashing "S1-0", "S1-1" and so on. Each server then owns many small arcs scattered around the ring.

Benefits:

- **Even distribution**: many small arcs average out, so each server's share approaches 1/N
- **Smooth rebalancing**: when a server leaves, its many arcs spread across many other servers instead of one neighbour
- **Heterogeneous capacity**: a server with twice the capacity gets twice as many virtual nodes

The cost is a larger lookup table, which is negligible in practice.

## Replication on the ring

Dynamo-style databases store each key on the first R distinct physical servers clockwise from its position. Losing one server leaves R − 1 copies, and the ring tells every node where copies live without a central directory.

## Where consistent hashing is used

- **Distributed caches**: client libraries for Memcached and Redis clusters use it so adding a cache node invalidates only a fraction of keys
- **Databases**: Amazon Dynamo, Cassandra and Riak place and replicate data with it
- **Load balancing with affinity**: routing a user or session to the same backend while tolerating backend changes
- **CDNs and content routing**: mapping objects to cache servers within a location

Redis Cluster uses a related approach, fixed hash slots: 16,384 slots assigned to nodes, moved slot by slot during resharding.

## Alternatives

**Rendezvous hashing** (highest random weight) computes a score for each key-server pair and picks the highest, giving similar minimal movement without a ring. **Jump consistent hash** maps keys to numbered buckets with almost no memory. Both are worth naming to show breadth.

## How interviewers test this

Expect "How would you distribute data across cache nodes?" and "What happens when a node is added?" Explain why mod N moves most keys, describe the ring with clockwise assignment, add virtual nodes for balance, and give real systems that use it.`,
    [SDP, DYNAMO],
    {
      check: { question: "With consistent hashing and N servers, roughly what fraction of keys move when one server is added?", options: ["About 1/N", "About half", "Almost all", "None"], answer: 0, explanation: "Only keys in the new server's arc move; mod N hashing moves most keys." },
      takeaways: ["hash(key) mod N moves most keys when N changes.", "Consistent hashing places keys and servers on a ring; keys go to the next server clockwise.", "Virtual nodes even out load and spread a failed server's keys.", "Used by Dynamo, Cassandra and distributed cache clients."],
      traps: [
        { question: "Add a cache node with mod N hashing during peak traffic.", trap: "Most keys remap and the database is flooded with misses.", solution: "Use consistent hashing so only about 1/N of keys move." },
        { question: "Three servers on a ring with one position each.", trap: "Uneven arcs give uneven load.", solution: "Use many virtual nodes per server." },
      ],
    }),
];

export const sdAsyncLessons: CourseLesson[] = [
  sdLesson("message-queues-and-event-streaming", "Message Queues and Event Streaming",
    "Decouple services with queues and logs: delivery guarantees, ordering, backpressure and Kafka vs RabbitMQ.", 25,
`Not every task should happen while a user waits. Sending email, resizing images, updating search indexes and fanning out notifications can run in the background. Message queues and event streams make that possible: producers publish messages, and consumers process them at their own pace. This lesson explains why asynchronous processing helps, queues versus logs, delivery guarantees, ordering and backpressure.

## Why go asynchronous

Asynchronous messaging gives three benefits:

- **Lower latency**: the request returns as soon as the work is queued. Uploading a video returns in milliseconds while transcoding happens later
- **Decoupling**: producers don't need to know who consumes their messages, and either side can be deployed, scaled or fail independently
- **Load levelling**: a traffic spike fills the queue instead of overwhelming downstream services, which drain it at a steady rate

The cost is complexity: eventual consistency, duplicate messages, monitoring queue depth and debugging flows that cross services.

## Queues versus logs

Two main models exist:

| | Message queue | Event log (stream) |
|---|---|---|
| Examples | RabbitMQ, Amazon SQS | Apache Kafka, Amazon Kinesis, Redpanda |
| After consumption | Message is removed | Message stays for the retention period |
| Consumers | Compete for messages | Each consumer group reads independently at its own offset |
| Replay | Not possible | Rewind offsets to reprocess history |
| Typical use | Task distribution to workers | Event streaming, multiple subscribers, analytics |

In a queue, each message goes to one worker, which suits jobs like "send this email". In a log, many independent consumers, such as search indexing, analytics and notifications, can each read every event.

## Delivery guarantees

Messages can be lost or duplicated when producers, brokers or consumers fail. Systems offer three levels:

- **At most once**: messages may be lost but never duplicated. Acceptable for metrics where occasional loss doesn't matter
- **At least once**: messages are never lost but may be delivered more than once. The common default
- **Exactly once**: each message's effect happens once. Achievable within some systems, such as Kafka transactions between topics, but end to end it usually means at-least-once delivery plus idempotent processing

With at-least-once delivery, consumers must be **idempotent**: processing the same message twice must have the same effect as once. Techniques include storing processed message IDs and skipping repeats, or using upserts keyed by a unique ID.

## Acknowledgements and dead letters

A consumer acknowledges a message only after processing succeeds. If it crashes first, the message becomes visible again for another consumer. Messages that fail repeatedly, perhaps because they're malformed, move to a **dead-letter queue** after a few attempts, so they don't block the queue forever and can be inspected later.

## Ordering

Global ordering across a large system is expensive. Kafka guarantees order only within a **partition**, so choosing the partition key decides what's ordered: partitioning by user ID keeps each user's events in order while allowing parallel processing across users. SQS standard queues don't guarantee order; FIFO queues do, with lower throughput.

## Backpressure

If consumers fall behind, queues grow without limit. Monitor **queue depth** and consumer lag, and respond by:

- autoscaling consumers based on lag
- rate limiting producers when queues exceed a threshold
- shedding or deferring low-priority work

A growing queue is an early warning that a downstream service is struggling.

## Choosing between them

Pick a work queue such as SQS or RabbitMQ when each task needs exactly one worker and nobody needs history. Pick a log such as Kafka when several systems react to the same events, when you need to replay events after a bug fix, or when throughput reaches hundreds of thousands of messages per second. Managed services reduce operational effort for both.

## Common patterns

- **Work queue**: background jobs distributed across workers
- **Publish-subscribe**: one event, many interested consumers
- **Fan-out**: one message becomes many, such as a post delivered to thousands of followers' feeds
- **Event sourcing**: store every change as an event, and rebuild state by replaying the log
- **Outbox pattern**: write the event to an outbox table in the same database transaction as the data change, then publish it, so data and events never disagree

## How interviewers test this

Expect "Which parts would you make asynchronous?", "Kafka vs RabbitMQ?" and "How do you avoid processing a message twice?" Move slow, non-blocking work behind a queue, choose a queue or a log by consumer pattern, assume at-least-once delivery with idempotent consumers, and partition by key for ordering.`,
    [SDP, AWS_BUILDERS, AWESOME_SCALABILITY],
    {
      check: { question: "With at-least-once delivery, what must consumers be?", options: ["Idempotent, so duplicates have no extra effect", "Single-threaded", "Stateless with no database", "Faster than producers always"], answer: 0, explanation: "Retries after failures can deliver a message twice." },
      takeaways: ["Queues cut latency, decouple services and absorb spikes.", "Queues hand each message to one worker; logs let many consumer groups replay events.", "Assume at-least-once delivery and make consumers idempotent.", "Kafka orders messages within a partition, so choose the partition key carefully."],
      traps: [
        { question: "Kafka guarantees ordering, so all events are in order.", trap: "Order holds only within a partition.", solution: "Partition by the key whose events must stay ordered." },
        { question: "Send the email inside the signup request.", trap: "Slow third-party calls add latency and failures to the request.", solution: "Queue the email and process it asynchronously." },
      ],
    }),

  sdLesson("rate-limiting", "Rate Limiting",
    "Protect services with token bucket, leaky bucket and window algorithms, locally and across a cluster.", 20,
`Rate limiting caps how many requests a client can make in a period. It protects services from abuse and overload, keeps costs predictable, and ensures one heavy user can't degrade everyone else. "Design a rate limiter" is also a classic interview question in its own right. This lesson explains the main algorithms, how to enforce limits across many servers, and how to communicate limits to clients.

## Why rate limit

- **Prevent abuse**: credential stuffing, scraping and denial-of-service attempts
- **Protect capacity**: keep one client's burst from exhausting shared resources
- **Fairness and cost control**: enforce plan quotas and cap spending on expensive downstream APIs

Limits can apply per user, per API key, per IP address, per endpoint, or globally.

## Token bucket

A bucket holds up to B tokens and refills at R tokens per second. Each request takes one token; if the bucket is empty, the request is rejected.

- Allows bursts up to B, then a steady rate of R
- Memory-light: store the token count and last refill time per client
- Used widely, including by AWS and Stripe

Refill lazily on each request: compute tokens added since the last request, cap at B, then decide.

## Leaky bucket

Requests enter a queue that drains at a fixed rate. If the queue is full, new requests are dropped. It smooths traffic into a steady outflow, which suits protecting a downstream system that can't handle bursts, but bursts of legitimate traffic wait or get dropped.

## Fixed window counter

Count requests per client per fixed window, such as each calendar minute, and reject once the count exceeds the limit.

- Cheap: one counter per client per window, for example an atomic increment in Redis with an expiry
- Edge problem: a client can send the full limit at 12:00:59 and again at 12:01:00, doubling the allowed rate around the boundary

## Sliding window log

Store a timestamp for every request and count those within the last window. It's exact but uses memory proportional to the request rate, which is expensive at high volumes.

## Sliding window counter

A hybrid: keep counts for the current and previous fixed windows, and weight the previous count by how much of it overlaps the sliding window:

~~~text
estimate = current_count + previous_count × (1 − elapsed_fraction_of_current_window)
~~~

It's nearly as accurate as the log, with the memory cost of fixed windows. It's a strong default for APIs.

## Comparing algorithms

| Algorithm | Bursts | Memory | Accuracy |
|---|---|---|---|
| Token bucket | Allowed up to bucket size | Low | Good |
| Leaky bucket | Smoothed out | Low (queue) | Good |
| Fixed window | Double burst at edges | Lowest | Approximate |
| Sliding log | Precise | High | Exact |
| Sliding window counter | Mostly precise | Low | Close to exact |

## Distributed rate limiting

With many API servers, per-server counters let a client exceed the limit by spreading requests across servers. Options:

- **Centralized store**: keep counters in Redis and update them atomically with INCR plus EXPIRE, or with a Lua script that checks and updates in one step to avoid race conditions
- **Sticky routing**: route each client to one limiter instance by consistent hashing
- **Local limits with sync**: each server enforces a share of the limit and periodically syncs, trading accuracy for speed

The centralized Redis approach is the usual interview answer. Mention that the limiter adds a network hop and that if Redis is unavailable you must decide whether to **fail open** (allow requests, preserving availability) or **fail closed** (reject them, preserving protection).

## Where to enforce limits

Limits usually live at the edge, in an API gateway or reverse proxy, so rejected traffic never reaches application servers. Finer, business-specific limits, such as five password attempts per account per hour, live in the application.

## Telling clients

Return **429 Too Many Requests** with a \`Retry-After\` header, and expose limit headers such as \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\` and \`X-RateLimit-Reset\`. Well-behaved clients back off with exponential delays and jitter instead of retrying immediately.

## How interviewers test this

Expect "Design a rate limiter" or "How would you stop one client overloading the API?" Choose token bucket or sliding window counter with reasons, store counters in Redis with atomic operations, enforce at the gateway, return 429 with Retry-After, and state the fail-open versus fail-closed decision.`,
    [SDP, AWS_BUILDERS],
    {
      check: { question: "Which rate-limiting algorithm allows short bursts up to a fixed size while enforcing an average rate?", options: ["Token bucket", "Leaky bucket", "Fixed window counter", "Sliding window log"], answer: 0, explanation: "A full bucket permits a burst; refills enforce the long-term rate." },
      takeaways: ["Token bucket allows bursts; leaky bucket smooths traffic.", "Fixed windows are cheap but allow double bursts at boundaries; sliding window counters fix this cheaply.", "Use atomic Redis operations for limits across many servers.", "Return 429 with Retry-After, and decide fail-open vs fail-closed."],
      traps: [
        { question: "Each API server keeps its own counter.", trap: "Clients exceed the limit by spreading requests across servers.", solution: "Use a shared store such as Redis with atomic updates." },
        { question: "Read the counter, then write count + 1.", trap: "Concurrent requests race past the limit.", solution: "Use INCR or a Lua script that checks and updates atomically." },
      ],
    }),

  sdLesson("reliability-patterns", "Reliability Patterns: Timeouts, Retries, Circuit Breakers and Observability",
    "Keep partial failures contained with timeouts, backoff, circuit breakers, bulkheads, and SLO-driven monitoring.", 25,
`In a distributed system, something is always failing: a server, a network link, a dependency. Reliability doesn't come from preventing failures; it comes from containing them so one slow component doesn't take down everything. This lesson covers timeouts, retries with backoff and jitter, circuit breakers, bulkheads, graceful degradation, and the monitoring practices, SLIs and SLOs, that tell you when users are affected.

## Cascading failures

Imagine service A calls service B, and B becomes slow. A's threads wait on B, A runs out of threads, and now A is slow for its own callers. Failures spread upstream like this, called a **cascading failure**. Most reliability patterns exist to break this chain.

## Timeouts

Every network call needs a timeout. Without one, a hung dependency holds resources forever. Choose timeouts from the dependency's measured latency, such as a little above its p99, and make sure the total of nested timeouts fits within the user-facing deadline. Passing a deadline along with each request lets downstream services stop work that no longer matters.

## Retries with exponential backoff and jitter

Many failures are transient, so retrying helps. But naive retries make outages worse: if every client retries immediately, a struggling service receives several times its normal load. Retry safely:

- retry only **idempotent** operations, or use idempotency keys
- use **exponential backoff**: wait 100 ms, then 200, 400, 800 and so on
- add **jitter**, randomizing each wait, so clients don't retry in synchronized waves
- cap the number of attempts, and use a **retry budget**, such as retries limited to 10% of requests

## Circuit breakers

A circuit breaker wraps calls to a dependency and tracks failures:

| State | Behaviour |
|---|---|
| Closed | Calls pass through; failures are counted |
| Open | After too many failures, calls fail immediately without contacting the dependency |
| Half-open | After a cool-down, a few trial calls go through; success closes the circuit, failure reopens it |

Failing fast saves resources, gives the struggling dependency time to recover, and lets the caller use a fallback immediately. Libraries such as Resilience4j implement this pattern.

## Bulkheads

Ships have watertight compartments so one breach doesn't sink the ship. In software, **bulkheads** isolate resources: separate thread pools or connection pools per dependency, so a slow payment service can exhaust only its own pool, not the threads serving product pages.

## Graceful degradation and load shedding

When parts fail, serve a reduced experience rather than an error: show cached recommendations, hide the reviews widget, or queue an order for later confirmation. Under overload, **load shedding** rejects low-priority requests early, such as analytics beacons, to keep critical ones, such as checkout, working.

## Redundancy and failover

Run every critical component with redundancy across failure domains: multiple instances, multiple availability zones, and for the highest availability, multiple regions. Test failover regularly; untested failover often fails when it's needed. Chaos engineering, deliberately injecting failures as Netflix's Chaos Monkey does, builds confidence that recovery works.

## SLIs, SLOs and error budgets

Monitoring must answer one question: are users affected?

- A **service level indicator** (SLI) measures user experience, such as the fraction of requests that succeed in under 300 ms
- A **service level objective** (SLO) sets a target for it, such as 99.9% over 30 days
- The **error budget** is the allowed shortfall: 0.1% of requests, about 43 minutes of full downtime per month

When the budget is healthy, teams ship features faster; when it's spent, they prioritize reliability work. Google's SRE book popularized this approach.

## Observability

Three signals help you understand a running system:

- **Metrics**: numeric time series, such as request rate, error rate and latency percentiles. The RED method (rate, errors, duration) suits services; the USE method (utilization, saturation, errors) suits resources
- **Logs**: detailed records of events, structured as JSON with request IDs so they can be searched
- **Traces**: the path of one request across services, showing where time is spent, collected with tools such as OpenTelemetry

Alert on symptoms users feel, such as SLO burn rate, rather than on every CPU spike.

## How interviewers test this

Expect "What happens if this service goes down?" and "How do you prevent cascading failures?" Add timeouts everywhere, retries with backoff and jitter for idempotent calls, circuit breakers and bulkheads around dependencies, graceful degradation, and SLO-based monitoring with metrics, logs and traces.`,
    [SRE_BOOK, AWS_BUILDERS, SDP],
    {
      check: { question: "Why add jitter to retry delays?", options: ["So clients don't retry in synchronized waves that overload the service", "To make retries faster", "To guarantee exactly-once delivery", "To skip the timeout"], answer: 0, explanation: "Randomized delays spread retries out over time." },
      takeaways: ["Every remote call needs a timeout that fits the overall deadline.", "Retry only idempotent operations, with exponential backoff, jitter and a cap.", "Circuit breakers fail fast; bulkheads isolate resources per dependency.", "Define SLIs and SLOs, use error budgets, and alert on user-facing symptoms."],
      traps: [
        { question: "Retry failed calls immediately, five times.", trap: "Synchronized retries multiply load on a struggling service.", solution: "Use exponential backoff with jitter and a retry budget." },
        { question: "Our health dashboard shows CPU, so we know users are fine.", trap: "Resource metrics don't show user experience.", solution: "Measure SLIs such as success rate and p99 latency against SLOs." },
      ],
    }),
];
