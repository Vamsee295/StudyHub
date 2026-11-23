// System Design modules 1-2: foundations and networking building blocks. Original writing;
// topic coverage follows the CC BY 4.0 system-design-primer, cited per lesson.
import { CourseLesson } from './types';
import { sdLesson, SDP, SRE_BOOK, AWS_BUILDERS, CLOUDFLARE, LATENCY, HPBN, AWESOME_SCALABILITY } from './system-design-shared';

export const sdFoundationLessons: CourseLesson[] = [
  sdLesson("system-design-interview-framework", "How to Approach a System Design Interview",
    "A repeatable four-step framework: requirements, estimates, high-level design, deep dives.", 20,
`A system design interview asks you to design a large system, such as a URL shortener or a chat app, in about 45 minutes. There's no single right answer. The interviewer grades how you structure an open problem, make trade-offs and communicate. This lesson gives you a four-step framework, explains what to say at each step, and lists the mistakes that sink most candidates.

## What interviewers are grading

Interviewers usually score four areas:

- **Problem scoping**: do you ask questions before designing, or rush into boxes and arrows?
- **Technical design**: are the components sensible, and do they fit the requirements?
- **Trade-off reasoning**: can you explain why you chose one option over another, and what it costs?
- **Communication**: can the interviewer follow your thinking, and do you respond well to hints?

A design that's 80% complete but clearly reasoned beats a complete design with no justification.

## Step 1: clarify requirements (about 5 minutes)

Split requirements into two kinds:

- **Functional requirements**: what the system does. For a URL shortener: create a short link, redirect to the long URL, optionally set an expiry or custom alias
- **Non-functional requirements**: how well it does it. Scale, latency, availability, consistency and durability targets

Ask questions that change the design:

- How many users, and how many requests per second?
- What is the read-to-write ratio?
- Which matters more when they conflict: availability or consistency?
- What latency is acceptable?
- Do we need analytics, authentication or multiple regions?

Write the agreed requirements down where the interviewer can see them, and explicitly park features you won't cover. Scoping well signals seniority.

## Step 2: estimate the scale (about 5 minutes)

Quick estimates tell you whether one server is enough or you need hundreds. Estimate:

- **Traffic**: requests per second, average and peak
- **Storage**: data per item × items per day × retention period
- **Bandwidth**: request size × requests per second

For example, 100 million new short links per month is about 40 writes per second on average. With a 100:1 read ratio, that's about 4,000 reads per second, perhaps 10,000 at peak. Round aggressively; the goal is the order of magnitude, not precision. The next lesson covers estimation in depth.

## Step 3: high-level design (about 10–15 minutes)

Draw the main components and the path of a request through them. A typical starting point:

~~~text
Client -> DNS -> CDN / Load balancer -> Stateless app servers -> Cache -> Database
                                                    \\-> Message queue -> Workers
~~~

Then define the core pieces:

- **API**: the main endpoints, such as \`POST /urls\` and \`GET /{code}\`
- **Data model**: the main tables or collections and their keys
- **Data flow**: what happens step by step for the most important read and write

Start small and make it work end to end before optimizing. A single database is a fine first draft; you'll scale it in the next step.

## Step 4: deep dives and bottlenecks (about 15–20 minutes)

Now improve the parts that break under the estimated load:

- Where is the bottleneck? Usually the database, so add caching, replicas or sharding
- What happens when a component fails? Add redundancy and explain failover
- How do you handle hot keys, such as one viral link?
- What are the consistency implications of caches and replicas?

Interviewers often steer this part. Follow their lead, and for each change, state the trade-off: "Adding a cache cuts read latency and database load, but cached data can be stale for up to the TTL."

## Wrapping up

In the final few minutes, summarize the design, name its weak points and suggest what you'd do next with more time: monitoring, analytics, multi-region deployment. Admitting limitations shows judgement.

## Common mistakes

- **Designing before asking questions**: you may solve the wrong problem
- **Jumping to buzzwords**: "use Kafka and microservices" without explaining why
- **Going silent**: the interviewer can't credit reasoning they can't hear
- **Over-engineering**: designing for a billion users when the requirements say ten thousand
- **Ignoring trade-offs**: every choice costs something; say what

## How interviewers test this

Every system design round follows this shape, so the framework itself is being tested. Scope first, estimate, sketch an end-to-end design, then deepen where load or failures demand it, stating each trade-off out loud.`,
    [SDP, AWESOME_SCALABILITY],
    {
      check: { question: "What should you do first in a system design interview?", options: ["Clarify functional and non-functional requirements", "Draw the database schema", "Pick a message queue", "Estimate cost in dollars"], answer: 0, explanation: "Requirements decide every later choice; designing first risks solving the wrong problem." },
      takeaways: ["Use four steps: requirements, estimates, high-level design, deep dives.", "Separate functional requirements (what) from non-functional ones (scale, latency, availability).", "Start with a small end-to-end design, then fix bottlenecks.", "State the trade-off of every decision out loud."],
      traps: [
        { question: "Design a news feed.", trap: "Drawing microservices and Kafka in the first minute.", solution: "Ask about scale, read/write ratio and freshness requirements first, then design." },
        { question: "Your design handles 10 users; the requirement is 10 million.", trap: "Never estimating load, so bottlenecks stay hidden.", solution: "Do quick traffic and storage estimates to know where scaling is needed." },
      ],
    }),

  sdLesson("scalability-performance-latency", "Scalability, Performance, Latency and Throughput",
    "Vertical vs horizontal scaling, stateless services, and the vocabulary of system performance.", 20,
`Scalability is a system's ability to handle more load by adding resources. It's different from performance: a system can be fast for one user and collapse under a thousand. This lesson defines the core vocabulary, compares vertical and horizontal scaling, explains why stateless services are the foundation of horizontal scaling, and introduces the latency numbers every engineer should know.

## Performance versus scalability

- A **performance problem** means the system is slow for a single user
- A **scalability problem** means the system is fast for one user but slows down under load

Fixing performance means making each request cheaper: better algorithms, indexes, caching. Fixing scalability means making the system able to use more resources effectively as load grows.

## Latency versus throughput

- **Latency** is the time to complete one operation, such as 50 ms for an API call
- **Throughput** is the number of operations completed per unit of time, such as 10,000 requests per second

They're related but distinct. Batching increases throughput but can raise latency, because items wait for the batch to fill. A good design aims for maximal throughput with acceptable latency.

## Measure percentiles, not averages

Averages hide pain. If 99 requests take 10 ms and one takes 5 seconds, the average is about 60 ms, which looks fine. Track percentiles:

- **p50**: the median experience
- **p99**: the slowest 1% of requests

Tail latency matters more than it seems. A page that makes 100 backend calls will hit at least one p99-slow call on most loads. Teams usually set targets on p99 or p99.9.

## Vertical scaling

**Vertical scaling** (scaling up) means moving to a bigger machine: more CPU cores, more RAM, faster disks.

| Pros | Cons |
|---|---|
| No code changes | Hard ceiling: the largest machine available |
| Straightforward to operate | Cost rises steeply at the high end |
| No distributed-systems complexity | Single point of failure |

Vertical scaling is often the right first move, especially for databases. A single modern server with dozens of cores and hundreds of gigabytes of RAM handles far more than many people expect.

## Horizontal scaling

**Horizontal scaling** (scaling out) means adding more machines and spreading load across them.

| Pros | Cons |
|---|---|
| Near-unlimited capacity | Needs load balancing |
| Commodity hardware is cheap | Data and state must be shared or partitioned |
| Redundancy: one machine failing isn't fatal | Distributed systems problems: consistency, partial failures |

Large systems scale horizontally, but it only works if the application is designed for it.

## Stateless services

A server is **stateless** if it keeps no client-specific data between requests. Any server can handle any request, so a load balancer can send traffic anywhere, and servers can be added or removed freely.

State still exists: sessions, carts, uploaded files. Move it out of the app servers into shared stores:

- sessions in a distributed cache such as Redis, or in signed tokens such as JWTs
- files in object storage such as Amazon S3
- persistent data in databases

Stateful servers, where a user must return to the same machine (sticky sessions), are harder to scale and lose data when a machine dies.

## Latency numbers to know

Rough orders of magnitude guide design decisions:

| Operation | Approximate time |
|---|---|
| L1 cache reference | 1 ns |
| Main memory reference | 100 ns |
| Read 1 MB sequentially from memory | 3 µs |
| SSD random read | 16 µs to 100 µs |
| Round trip within a data centre | 500 µs |
| Read 1 MB sequentially from SSD | about 50 µs to 1 ms |
| Disk seek (spinning disk) | 2 to 10 ms |
| Round trip India to US | 150 to 250 ms |

Two lessons follow: memory is about 1,000 times faster than a network round trip, which is why caches matter, and cross-continent round trips dominate user-facing latency, which is why CDNs and regional deployments matter.

## Where systems usually break first

As load grows, bottlenecks tend to appear in order: the database (too many queries or writes), then shared caches, then network bandwidth, then single coordinating components such as a primary database or a leader node. Scaling is the process of finding the next bottleneck and removing it.

## How interviewers test this

Expect "Vertical vs horizontal scaling?", "Why make services stateless?" and "Latency vs throughput?" Define each term precisely, use percentiles when discussing latency, and explain that stateless app tiers plus scaled data tiers are how most large systems grow.`,
    [SDP, LATENCY, SRE_BOOK],
    {
      check: { question: "Why do horizontally scaled web tiers keep app servers stateless?", options: ["So any server can handle any request and servers can be added or removed freely", "Because stateless servers use less CPU", "Because databases require it", "To avoid using a load balancer"], answer: 0, explanation: "Without per-server state, the load balancer can route anywhere and a failed server loses nothing." },
      takeaways: ["Performance is speed for one user; scalability is staying fast as load grows.", "Track p99 latency, not averages.", "Scale vertically first where it's enough; scale horizontally for capacity and redundancy.", "Move sessions, files and data out of app servers to make them stateless."],
      traps: [
        { question: "Our average latency is 60 ms, so users are happy.", trap: "Averages hide slow outliers.", solution: "Report p50, p95 and p99; tail latency affects many page loads." },
        { question: "Add more app servers to fix a slow site.", trap: "The bottleneck is often the database, not the app tier.", solution: "Measure first; add caching, replicas or sharding for the data tier." },
      ],
    }),

  sdLesson("back-of-the-envelope-estimation", "Back-of-the-Envelope Estimation",
    "Estimate traffic, storage, bandwidth and server counts quickly with powers of ten.", 20,
`Back-of-the-envelope estimation means calculating rough numbers for traffic, storage and bandwidth in a minute or two, so you know which parts of a design need scaling. Interviewers use it to check that your design matches the requirements. This lesson covers the numbers to memorize, a step-by-step method, a full worked example and the common mistakes.

## Why estimate

Without numbers, you can't tell whether a design is too weak or wildly over-built. Estimates answer questions like:

- Can one database handle the write rate, or do we need sharding?
- Does the dataset fit in memory, so we can cache all of it?
- How many app servers do we need at peak?
- Will storage cost matter over five years?

Precision doesn't matter. Being within a factor of two or three is good enough to make the right decision.

## Numbers to memorize

| Quantity | Value |
|---|---|
| Seconds in a day | 86,400, round to 100,000 (10⁵) |
| Seconds in a month | about 2.5 million (2.5 × 10⁶) |
| 1 million requests per day | about 12 requests per second |
| 1 KB, 1 MB, 1 GB, 1 TB, 1 PB | 10³, 10⁶, 10⁹, 10¹², 10¹⁵ bytes |
| A character in ASCII text | 1 byte |
| A typical photo | 200 KB to 2 MB |

A useful shortcut: requests per day divided by 100,000 gives requests per second, slightly overestimated, which is safe.

## Rough capacities

These vary widely with hardware and workload, so treat them as starting points to state as assumptions:

| Component | Rough capacity |
|---|---|
| Web/app server (lightweight API) | 1,000 to 10,000 requests per second |
| Relational database, indexed point queries | thousands to tens of thousands of queries per second |
| Redis on one node | 100,000+ operations per second |
| Kafka partition | tens of MB per second |

## The method

1. **Users and actions**: daily active users (DAU) and actions per user per day
2. **Requests per second**: total daily actions ÷ 10⁵, then multiply by 2 to 3 for peak
3. **Read/write split**: apply the read-to-write ratio
4. **Storage**: size per item × new items per day × days of retention
5. **Bandwidth**: request or response size × requests per second
6. **Servers**: peak RPS ÷ capacity per server, plus headroom

## Worked example: a photo-sharing app

Assume 10 million DAU, each viewing 50 photos and uploading 0.2 photos per day.

**Reads**: 10⁷ × 50 = 5 × 10⁸ views per day. Divided by 10⁵ seconds: 5,000 reads per second on average, about 15,000 at peak.

**Writes**: 10⁷ × 0.2 = 2 × 10⁶ uploads per day, about 20 per second on average.

**Storage**: at 1 MB per photo (after compression, plus thumbnails), 2 × 10⁶ MB = 2 TB per day. Over a year: about 730 TB, so roughly 1 PB per year. That rules out a single database for images; photos go to object storage, with only metadata in the database.

**Metadata**: if each photo's metadata row is 500 bytes, 2 × 10⁶ rows per day is 1 GB per day, a few hundred GB per year. That fits comfortably in a sharded or even a single large database.

**Bandwidth**: 15,000 peak views per second × 200 KB average thumbnail is about 3 GB per second. That's far too much to serve from app servers, so a CDN is essential.

**App servers**: at 2,000 requests per second each, 15,000 ÷ 2,000 ≈ 8 servers, so plan for 10 to 15 with headroom and redundancy.

Every number shaped the design: object storage for photos, a CDN for bandwidth, a modest metadata database and a small app fleet.

## Common mistakes

- **Mixing units**: bits versus bytes in bandwidth (network speeds are usually quoted in bits per second), or MB versus GB
- **Forgetting peaks**: traffic is never flat; size for 2 to 3 times the average, or more for spiky events like sales
- **Forgetting replication**: three replicas triple storage
- **False precision**: writing 5,787.04 requests per second wastes time and signals the wrong focus
- **Silent assumptions**: say every assumption out loud so the interviewer can correct it

## How interviewers test this

Expect to estimate QPS, storage and bandwidth for the system you're designing, then use the numbers to justify decisions. Round to powers of ten, state assumptions, separate reads from writes, and connect each result to a design choice such as caching, a CDN or sharding.`,
    [SDP, LATENCY],
    {
      check: { question: "Roughly how many requests per second is 100 million requests per day?", options: ["About 1,000", "About 100", "About 10,000", "About 100,000"], answer: 0, explanation: "10⁸ ÷ 10⁵ seconds ≈ 1,000 per second (more precisely about 1,160)." },
      takeaways: ["Round a day to 10⁵ seconds; 1 million per day ≈ 12 per second.", "Separate reads and writes, and size for 2–3× the average at peak.", "Estimate storage as item size × items per day × retention, then add replication.", "Tie every estimate to a design decision."],
      traps: [
        { question: "Bandwidth is 3 GB/s, so a 10 Gbps link is fine.", trap: "Confusing bytes and bits: 3 GB/s is 24 Gbps.", solution: "Network speeds are in bits; multiply bytes by 8." },
        { question: "We need 5,787 servers.", trap: "False precision.", solution: "Round to orders of magnitude and add headroom." },
      ],
    }),

  sdLesson("availability-and-consistency", "Availability, Consistency and the CAP Theorem",
    "Nines of availability, failover and replication, CAP, and strong vs eventual consistency.", 25,
`Distributed systems must decide what happens when machines or networks fail. Two properties trade off against each other: availability (the system keeps responding) and consistency (every read sees the latest write). This lesson explains how availability is measured in nines, the patterns that achieve it, the CAP theorem, and the consistency models you'll choose between in every design.

## Measuring availability

Availability is the fraction of time a system is usable, often expressed as "nines":

| Availability | Downtime per year | Downtime per month |
|---|---|---|
| 99% (two nines) | 3.65 days | 7.3 hours |
| 99.9% (three nines) | 8.8 hours | 43.8 minutes |
| 99.99% (four nines) | 52.6 minutes | 4.4 minutes |
| 99.999% (five nines) | 5.3 minutes | 26 seconds |

Each extra nine costs far more engineering effort. Choose a target the business needs, written as a **service level objective** (SLO), rather than chasing maximum nines.

## Availability in sequence and in parallel

When a request passes through components **in sequence**, availabilities multiply: two components at 99.9% give 99.9% × 99.9% ≈ 99.8%. More dependencies means lower availability.

When components run **in parallel** as redundant copies, the system fails only if all copies fail: two 99.9% copies give 1 − (0.001)² = 99.9999%. Redundancy is how reliable systems are built from unreliable parts.

## Availability patterns

Two main patterns provide redundancy:

- **Active-passive failover**: one node serves traffic while a standby monitors it with heartbeats. If the active node fails, the passive one takes over its IP address or role. Straightforward, but the standby sits idle, and failover takes seconds to minutes
- **Active-active**: all nodes serve traffic, and a load balancer spreads requests. Better resource use and no failover delay, but harder when nodes hold data that must stay consistent

Replication, covered in the database lessons, applies the same ideas to data: a primary with replicas, or multiple primaries.

## The CAP theorem

In a distributed data store, the CAP theorem says that when a **network partition** happens, separating some nodes from others, the system must choose:

- **Consistency (C)**: every read returns the most recent write, or an error
- **Availability (A)**: every request receives a non-error response, possibly with stale data

Partition tolerance isn't optional, because real networks do partition. So the practical choice is between **CP** and **AP** behaviour during partitions:

- **CP systems** refuse or delay some requests to avoid serving stale or conflicting data. Suitable for bank balances and inventory counts. Examples: systems using consensus such as ZooKeeper and etcd, and HBase
- **AP systems** keep answering, accepting that replicas may temporarily disagree. Suitable for social feeds, shopping carts and view counters. Examples: Cassandra and DynamoDB in their default configurations

When there's no partition, a system can offer both. The PACELC extension adds that even without partitions, systems trade **latency** against consistency: waiting for replicas to confirm makes writes slower.

## Consistency models

Between "always perfectly consistent" and "anything goes" lie several models:

| Model | Guarantee | Example use |
|---|---|---|
| Strong consistency (linearizability) | Reads always see the latest write | Account balances, locks, unique usernames |
| Read-your-writes | A user sees their own updates immediately | Profile edits, posting a comment |
| Monotonic reads | A user never sees data go backwards in time | Timelines, message lists |
| Eventual consistency | Replicas converge if updates stop | Like counts, DNS, search indexes |

Weak consistency, where a read may never see a write, appears in systems like live video and VoIP, where missing data is dropped.

## Choosing per feature

A single product often mixes models. In an e-commerce site:

- the payment and order record needs strong consistency
- the product catalogue and reviews can be eventually consistent
- the shopping cart favours availability: accepting an add-to-cart during a partition is better than an error

Stating which parts of your design need which guarantee, and why, is one of the strongest signals in a design interview.

## How interviewers test this

Expect "Explain the CAP theorem", "Would you choose consistency or availability for X?" and "What's eventual consistency?" Say that partitions force the choice, map each feature of the system to CP or AP with a business reason, and mention availability maths for sequential and redundant components.`,
    [SDP, SRE_BOOK, AWS_BUILDERS],
    {
      check: { question: "During a network partition, an AP system will do what?", options: ["Keep serving requests, possibly with stale data", "Reject all requests", "Guarantee linearizable reads", "Shut down the minority side only and stay consistent"], answer: 0, explanation: "AP systems choose availability; replicas reconcile after the partition heals." },
      takeaways: ["Each extra nine of availability costs much more; set an SLO the business needs.", "Sequential dependencies multiply availability down; redundancy multiplies failure probability down.", "Partitions force a choice between consistency and availability.", "Pick a consistency model per feature: strong for money, eventual for counters."],
      traps: [
        { question: "Which two of C, A and P does your system pick?", trap: "Treating partition tolerance as optional.", solution: "Partitions happen; the real choice is CP or AP behaviour during them." },
        { question: "Make everything strongly consistent to be safe.", trap: "Strong consistency everywhere costs latency and availability.", solution: "Use strong consistency only where correctness demands it." },
      ],
    }),
];

export const sdNetworkingLessons: CourseLesson[] = [
  sdLesson("dns-and-cdn", "DNS and Content Delivery Networks",
    "How DNS routes users, and how CDNs cut latency and offload traffic with edge caching.", 20,
`Before a request reaches your servers, it passes through DNS, which turns a hostname into an address, and often a content delivery network (CDN), which serves content from a location near the user. Both are critical to latency and availability at scale. This lesson explains how DNS can route traffic, how CDNs work, push versus pull CDNs, caching rules and the trade-offs of each.

## DNS as a traffic router

DNS maps names like \`api.example.com\` to IP addresses, with answers cached at many levels for their time to live (TTL). Beyond plain lookups, managed DNS services such as Route 53 and Cloudflare DNS can route intelligently:

- **Weighted round robin**: split traffic across servers or regions by percentage, useful for gradual rollouts
- **Latency-based routing**: send users to the region with the lowest measured latency
- **Geolocation routing**: send users to a region based on their location, for data-residency rules or language
- **Health-checked failover**: stop returning addresses of unhealthy endpoints

DNS routing is coarse. Because resolvers and browsers cache answers for the TTL, changes take effect gradually, and some clients ignore TTLs. That's why DNS usually picks a region, while load balancers handle fine-grained routing inside it.

## Why CDNs exist

A user in Chennai fetching an image from a server in Virginia pays roughly 200 ms per round trip, several times over for the TCP and TLS handshakes. A CDN keeps copies of content at **edge servers**, called points of presence, in hundreds of cities. The user connects to a nearby edge, a few milliseconds away, and gets the cached content.

CDNs provide:

- **Lower latency**: content travels a short distance
- **Offloading**: the origin serves a small fraction of requests; a 95% cache hit ratio cuts origin traffic twenty-fold
- **Resilience**: edges absorb traffic spikes and many DDoS attacks
- **Faster connections**: TLS terminates near the user, and the CDN keeps warm connections to the origin

## What to put on a CDN

Static assets are the classic case: images, video segments, JavaScript, CSS, fonts and downloadable files. Modern CDNs also cache API responses that are the same for many users, such as a product catalogue, and run code at the edge for personalization or authentication checks.

Responses that differ per user, such as account pages, generally aren't cached at the edge, or are cached only with careful cache keys.

## Pull CDNs

With a **pull CDN**, the edge fetches content from the origin the first time a user requests it, caches it, and serves later requests from the cache until it expires.

- Setup is minimal: point the CDN at your origin
- The first request in each region is slow (a cache miss)
- Good for sites with many assets and unpredictable access patterns

## Push CDNs

With a **push CDN**, you upload content to the CDN ahead of time, and you're responsible for updating it.

- No first-request miss
- You control exactly what's stored and when
- More operational work; suits large files that change rarely, such as software downloads or video libraries

## Cache control and invalidation

The origin controls caching with HTTP headers:

- \`Cache-Control: public, max-age=31536000, immutable\` for versioned assets that never change
- \`Cache-Control: no-store\` for sensitive, per-user responses
- \`ETag\` and \`Last-Modified\` for revalidation without downloading the full body

Invalidating cached content is hard, so the standard trick is **cache busting**: put a version or content hash in the file name, such as \`app.3f9a1c.js\`. A new deployment references a new URL, and old copies expire on their own. CDNs also offer purge APIs for emergencies.

## Anycast

Many CDNs and DNS providers use **anycast**: the same IP address is announced from many locations, and internet routing (BGP) delivers each user's packets to the nearest one. Anycast gives automatic failover, since a failed location stops announcing the address and traffic shifts elsewhere, and it spreads DDoS traffic across the whole network instead of one site.

## Trade-offs

CDNs cost money per gigabyte delivered, and stale content can surface if TTLs are long and invalidation is forgotten. Debugging becomes harder, since requests may never reach your logs. For dynamic, per-user content, the benefit is smaller.

## How interviewers test this

Expect "How would you serve images or video to users worldwide?" and "Push or pull CDN?" Put static and media content behind a CDN, explain cache hit ratio and offloading, use hashed file names for invalidation, and mention DNS-based latency or geo routing for multi-region systems.`,
    [SDP, CLOUDFLARE, HPBN],
    {
      check: { question: "What is the main downside of a pull CDN?", options: ["The first request for an object in each region is a cache miss served from the origin", "You must upload every file manually", "It can't cache images", "It disables HTTPS"], answer: 0, explanation: "Pull CDNs populate lazily; push CDNs avoid the first miss at the cost of managing uploads." },
      takeaways: ["DNS can route by weight, latency, geography and health, but changes are delayed by caching.", "CDNs serve content from edges near users, cutting latency and origin load.", "Pull CDNs fill on demand; push CDNs are pre-loaded.", "Version file names to make cache invalidation trivial."],
      traps: [
        { question: "Serve 3 GB/s of images from the app servers.", trap: "Ignoring bandwidth and global latency.", solution: "Store media in object storage and serve it through a CDN." },
        { question: "Fail over regions instantly by changing DNS.", trap: "Cached DNS answers keep old addresses until TTLs expire.", solution: "Use short TTLs, health checks, and load-balancer-level failover." },
      ],
    }),

  sdLesson("load-balancers-and-reverse-proxies", "Load Balancers and Reverse Proxies",
    "Distribute traffic across servers, L4 vs L7, algorithms, health checks and session handling.", 20,
`A load balancer spreads incoming requests across a pool of servers, so no single server is overwhelmed and failed servers are taken out of rotation. A reverse proxy sits in front of servers to handle shared concerns such as TLS and caching. They're the front door of almost every scalable system. This lesson covers layer 4 versus layer 7 balancing, balancing algorithms, health checks, sticky sessions and redundancy.

## What a load balancer does

A load balancer:

- **distributes requests** across healthy servers
- **removes failed servers** using health checks, so users don't hit dead machines
- **enables horizontal scaling**: add servers to the pool without clients noticing
- **provides a single entry point**, often handling TLS termination

Popular options include NGINX, HAProxy, Envoy and cloud load balancers such as AWS ALB/NLB and Google Cloud Load Balancing.

## Layer 4 versus layer 7

| | Layer 4 (transport) | Layer 7 (application) |
|---|---|---|
| Sees | IP addresses and ports | Full HTTP: path, headers, cookies |
| Routing | By connection | By request content |
| Speed | Fastest, minimal processing | More CPU per request |
| Features | Plain TCP/UDP forwarding | Path routing, header rewrites, auth, caching |
| Example | AWS NLB | AWS ALB, NGINX |

Layer 7 balancers can send \`/api/*\` to API servers and \`/images/*\` to media servers, or route by user or region. Layer 4 balancers suit raw throughput and non-HTTP protocols.

## Balancing algorithms

| Algorithm | How it works | Best when |
|---|---|---|
| Round robin | Each server in turn | Servers and requests are similar |
| Weighted round robin | Proportional to server capacity | Mixed server sizes |
| Least connections | Server with fewest active connections | Request durations vary widely |
| Least response time | Fastest recent responses | Latency-sensitive workloads |
| IP hash / consistent hash | Hash of client or key picks the server | Requests must reach the same server, for example a cache shard |

Round robin is a fine default. Least connections helps when some requests, such as report generation, take far longer than others.

## Health checks

The balancer periodically probes each server, for example \`GET /health\` every few seconds. A server failing several checks in a row is removed; passing again brings it back. A good health endpoint checks the server's own ability to serve, not every downstream dependency. If it checked the database and the database blipped, every server would be marked unhealthy at once, turning a small problem into a full outage.

## Sticky sessions

**Sticky sessions** (session affinity) send a user's requests to the same server, usually via a cookie. They make stateful servers work, but they unbalance load, and when that server dies, its users lose their sessions. The better approach is stateless servers with sessions stored in a shared cache or signed tokens. Use stickiness only when unavoidable, such as for WebSocket connections that live on one server.

## Avoiding a single point of failure

A single load balancer is itself a single point of failure. Production setups run balancers in pairs (active-passive with a floating IP, or active-active), or use managed cloud balancers that are redundant internally. DNS can also spread traffic across multiple balancer addresses.

## Reverse proxies

A **reverse proxy** accepts client requests on behalf of backend servers. Unlike a forward proxy, which acts for clients, it acts for servers. Even with one backend, a reverse proxy adds value:

- **TLS termination**: decrypt once at the edge, offloading backends
- **Compression and caching** of responses
- **Security**: hide backend addresses, filter malicious requests, enforce rate limits
- **Static file serving** directly from the proxy

Load balancers are reverse proxies that also distribute traffic. In practice, NGINX or Envoy often does both jobs.

## API gateways

An **API gateway** is a reverse proxy specialized for APIs: authentication, rate limiting, request routing to microservices, request transformation and usage metrics. In microservice architectures, it's the single front door that clients talk to.

## How interviewers test this

Expect "How do you distribute traffic across servers?", "L4 vs L7?" and "What happens when a server dies?" Place a redundant load balancer in front of stateless servers, choose an algorithm with a reason, describe health checks, and explain why sticky sessions are a last resort.`,
    [SDP, AWS_BUILDERS, CLOUDFLARE],
    {
      check: { question: "Which load balancer can route /api/* and /images/* to different server pools?", options: ["A layer 7 load balancer", "A layer 4 load balancer only", "DNS round robin", "A network switch"], answer: 0, explanation: "Only an application-layer balancer sees the HTTP path." },
      takeaways: ["Load balancers spread traffic, remove unhealthy servers and enable horizontal scaling.", "L4 balancers are fast and protocol-agnostic; L7 balancers route by HTTP content.", "Health checks should test the server itself, not every dependency.", "Prefer stateless servers over sticky sessions, and make the balancer redundant."],
      traps: [
        { question: "Our health check pings the database.", trap: "A database blip marks every server unhealthy at once.", solution: "Check local health; handle dependency failures with graceful degradation." },
        { question: "One load balancer in front of 50 servers.", trap: "The balancer becomes a single point of failure.", solution: "Run balancers redundantly or use a managed, redundant service." },
      ],
    }),

  sdLesson("api-design", "API Design: REST, gRPC, GraphQL and Idempotency",
    "Choose an API style, design resources, paginate, version, and make retries safe.", 20,
`APIs are the contracts between clients and services, and between services themselves. A well-designed API is predictable, efficient and safe to retry; a poor one leaks internals and breaks clients on every change. This lesson compares REST, gRPC and GraphQL, then covers resource design, pagination, versioning and idempotency, the details that come up in every design interview.

## REST

REST models the system as **resources** identified by URLs and manipulated with HTTP methods:

~~~http
GET    /users/42/orders?status=paid&limit=20
POST   /orders
GET    /orders/9001
PATCH  /orders/9001
DELETE /orders/9001
~~~

Strengths: it uses HTTP's existing features, including caching, status codes and tooling, and it's understood everywhere. Weaknesses: clients may need several calls to assemble a screen (under-fetching) or receive fields they don't need (over-fetching), and there's no enforced schema unless you add OpenAPI.

## gRPC

gRPC uses Protocol Buffers to define services and messages in a schema, generates client and server code, and runs over HTTP/2.

- **Fast and compact**: binary encoding and multiplexed connections
- **Strongly typed contracts**: breaking changes are caught at compile time
- **Streaming**: client, server and bidirectional streams
- **Downsides**: not natively callable from browsers without a proxy, and harder to debug by hand

gRPC is common for internal service-to-service communication where latency and contracts matter.

## GraphQL

GraphQL exposes a typed schema and lets clients request exactly the fields they need in one query:

~~~graphql
query { user(id: 42) { name orders(last: 5) { id total } } }
~~~

It suits apps with many screens needing different data shapes, such as mobile clients on slow networks. The costs: HTTP caching is harder, since most requests are POSTs to one endpoint, and naive resolvers cause the **N+1 query problem**, where fetching 20 orders triggers 20 separate database queries. Batching tools such as DataLoader fix this. Expensive queries need depth and cost limits.

## Comparing the styles

| | REST | gRPC | GraphQL |
|---|---|---|---|
| Best for | Public APIs, CRUD | Internal microservices | Flexible client-driven data needs |
| Format | JSON (usually) | Protocol Buffers | JSON |
| Caching | Native HTTP caching | Custom | Harder |
| Contract | Optional (OpenAPI) | Required schema | Required schema |

## Resource design

Good REST design uses nouns for resources (\`/orders\`, not \`/createOrder\`), plural collections, nested paths for clear ownership (\`/users/42/orders\`), and correct status codes: 201 for creation, 400 for invalid input, 404 for missing resources, 409 for conflicts, 429 for rate limits.

## Pagination

Never return unbounded lists. Two approaches:

- **Offset pagination**: \`?offset=40&limit=20\`. Familiar and supports jumping to page N, but slow for deep pages, and items shift when data changes
- **Cursor pagination**: \`?after=eyJpZCI6OTAwMX0&limit=20\`, where the cursor encodes the last item's sort key. Stable and fast at any depth, ideal for feeds and infinite scroll

Return the next cursor in the response so clients don't build it themselves.

## Versioning

APIs evolve. Additive changes, such as new optional fields, are safe. Breaking changes, such as removing or renaming fields, need a new version: \`/v2/orders\` in the path or a version header. Keep old versions running until clients migrate, and tell clients to ignore unknown fields.

## Errors and consistency of responses

Return errors in one consistent shape, such as \`{"error": {"code": "INSUFFICIENT_FUNDS", "message": "..."}}\`, with a machine-readable code clients can branch on and a message humans can read. Don't leak stack traces or internal hostnames. For long-running operations, return 202 Accepted with a status URL the client can poll, instead of holding the connection open.

## Idempotency

Networks fail mid-request, and clients retry. If a client sends "charge ₹500" and the response is lost, a retry might charge twice. An operation is **idempotent** if repeating it has the same effect as doing it once.

GET, PUT and DELETE are idempotent by definition; POST isn't. To make POSTs safe, clients send an **idempotency key**, a unique ID per logical operation:

~~~http
POST /payments
Idempotency-Key: 6f1c2b7e-0d1a-4b8e-9f2a-3c5d7e9a1b2c
~~~

The server stores the key with the result. A repeated key returns the stored result instead of charging again. Payment APIs such as Stripe use this pattern.

## How interviewers test this

Expect to define the API for the system you design, plus "REST vs gRPC vs GraphQL?", "How do you paginate a feed?" and "How do you make payments safe to retry?" Sketch the core endpoints early, choose cursor pagination for feeds, and use idempotency keys for non-idempotent writes.`,
    [SDP, AWS_BUILDERS],
    {
      check: { question: "How do payment APIs make a retried POST safe?", options: ["The client sends an idempotency key, and the server returns the stored result for repeats", "They use GET instead", "They disable retries", "They rely on HTTPS"], answer: 0, explanation: "The key identifies the logical operation, so a duplicate request doesn't execute twice." },
      takeaways: ["REST suits public CRUD APIs; gRPC suits fast typed internal calls; GraphQL suits flexible client data needs.", "Use cursor pagination for feeds and large lists.", "Make additive changes freely; version breaking changes.", "Use idempotency keys so retries of non-idempotent writes are safe."],
      traps: [
        { question: "Paginate a busy feed with OFFSET.", trap: "Deep offsets are slow and items shift between pages.", solution: "Use cursor (keyset) pagination." },
        { question: "GraphQL query fetching orders and their items is slow.", trap: "N+1 database queries from naive resolvers.", solution: "Batch lookups with a DataLoader-style layer." },
      ],
    }),
];
