// System Design module 5 (continued): more design walkthroughs. Original writing; problem list
// follows the CC BY 4.0 system-design-primer, cited per lesson.
import { CourseLesson } from './types';
import { sdLesson, SDP, AWS_BUILDERS, AWESOME_SCALABILITY, HPBN, CLOUDFLARE } from './system-design-shared';

export const sdMoreWalkthroughLessons: CourseLesson[] = [
  sdLesson("design-ride-sharing", "Design a Ride-Sharing App",
    "Location updates at scale, geospatial indexing, driver matching, trip state and surge pricing.", 30,
`A ride-sharing app such as Uber, Ola or Lyft matches riders with nearby drivers in seconds, tracks trips live on a map, and handles payments afterwards. The hard parts are ingesting a constant stream of driver locations, finding the nearest available drivers quickly, and managing each trip's state reliably. This walkthrough covers requirements, estimates, geospatial indexing, matching, trip state and surge pricing.

## Step 1: requirements

**Functional:**

- Drivers go online and share their location continuously
- Riders request a ride from a pickup point to a destination and see an estimated fare and arrival time
- The system matches a rider with a nearby available driver, who can accept or decline
- Both parties see each other's live location during the trip
- Payment is charged when the trip ends

**Non-functional:**

- Matching within a few seconds
- Location updates reflected with low latency, around a second or two
- High availability: a failed match means a lost customer
- Consistency where it matters: a driver must never be assigned to two riders at once

## Step 2: estimates

Assume 10 million daily trips and 1 million drivers online at peak, each sending a location update every 4 seconds.

- **Location updates**: 1,000,000 ÷ 4 = 250,000 writes per second at peak
- **Ride requests**: 10⁷ per day ≈ 100 per second on average, perhaps 1,000 at peak
- **Location data size**: each update (driver ID, latitude, longitude, timestamp, status) is about 50 bytes, so 250,000 × 50 bytes = 12.5 MB per second of incoming data

Location updates dominate. They're high volume, short-lived and only the latest value matters, so they belong in memory, not in a relational database row per update.

## Step 3: high-level design

~~~text
Driver app --(WebSocket, location every 4s)--> Location service --> In-memory geo index (Redis)
Rider app --> Ride request service --> Matching service --> queries geo index, offers trip to drivers
Trip service: trip state machine (DB)        Pricing service: fares, surge
Notification/push service                    Payment service (after trip)
~~~

Drivers keep a persistent connection to report location and receive trip offers. The location service updates a geospatial index held in memory. The matching service queries it for nearby available drivers when a request arrives.

## Deep dive: geospatial indexing

"Find available drivers within 2 km" can't be answered efficiently with a plain index on latitude and longitude, because a range on two columns scans too much. Spatial indexes divide the map into cells:

- **Geohash** encodes a location as a string where nearby places share prefixes, such as \`tdr1y\` for part of Bengaluru. Search the rider's cell plus its 8 neighbours, since a nearby driver may sit right across a cell boundary
- **Quadtrees** recursively split regions into four until each cell holds few drivers, adapting to dense city centres
- **H3**, Uber's open-source hexagonal grid, uses hexagons, which have uniform distances to all neighbours

Redis provides built-in geospatial commands (\`GEOADD\`, \`GEOSEARCH\`) based on geohashes, which suit this workload. Shard the index by city or region, since riders and drivers are local.

## Deep dive: matching

When a rider requests a trip:

1. Query the geo index for available drivers near the pickup point, expanding the radius if too few are found
2. Rank candidates by estimated time of arrival using road network routing, not straight-line distance, which ignores rivers and one-way streets
3. Offer the trip to the best driver, with a timeout of around 10 to 15 seconds; on decline or timeout, offer it to the next
4. On acceptance, atomically mark the driver unavailable and create the trip

The atomic step is essential. Two matching processes must not assign the same driver to two riders. Use a compare-and-set update on the driver's status, a short-lived lock, or route all matching for a region through a single partition owner.

## Deep dive: trip state

A trip moves through states: requested, matched, driver arriving, in progress, completed, cancelled, paid. Store trips in a durable database with these transitions enforced, because trips are financial records. Each transition emits an event to a stream so pricing, notifications, payments and analytics react independently.

During the trip, location updates flow to the rider through the same real-time channel used for driver tracking. Trip routes are also logged for fare calculation and dispute resolution, written in batches to cheaper storage.

## Surge pricing

When demand outstrips supply in an area, prices rise to attract drivers and temper demand. The pricing service computes, per geo cell every minute or so, the ratio of open requests to available drivers, and maps it to a multiplier. Riders see the price before confirming, and the quoted fare is locked for a short window so it doesn't change mid-request.

## Reliability

- Driver apps buffer location updates during brief network loss
- Location services are stateless apart from the in-memory index, which can be rebuilt from fresh updates within seconds after a failure
- Region-level isolation keeps an outage in one city from affecting others

## How interviewers test this

Expect location ingestion, nearby-driver search and double-assignment prevention. Size the location write rate, keep locations in an in-memory geospatial index sharded by region, search neighbouring cells, rank by ETA, and make driver assignment atomic.`,
    [SDP, AWESOME_SCALABILITY, AWS_BUILDERS],
    {
      check: { question: "Why search a geohash cell and its neighbours when finding nearby drivers?", options: ["A nearby driver may sit right across a cell boundary", "Neighbouring cells are cheaper to query", "Geohashes only work in groups of nine", "To find drivers in other cities"], answer: 0, explanation: "Cell boundaries are arbitrary, so a close driver can be in an adjacent cell." },
      takeaways: ["Location updates dominate write volume; keep them in an in-memory geo index.", "Use geohash, quadtree or H3 cells, and search neighbouring cells.", "Rank candidates by road ETA, not straight-line distance.", "Assign drivers atomically so no driver gets two trips."],
      traps: [
        { question: "Store every location update as a row in PostgreSQL.", trap: "250,000 writes per second of short-lived data overwhelms the database.", solution: "Keep the latest location in an in-memory geospatial index." },
        { question: "Two riders matched to the same driver.", trap: "Non-atomic check-then-assign.", solution: "Use compare-and-set on driver status or a single owner per region." },
      ],
    }),

  sdLesson("design-video-streaming", "Design a Video Streaming Platform",
    "Uploads, transcoding pipelines, adaptive bitrate streaming, CDNs and view counting.", 30,
`A video platform such as YouTube or Netflix accepts uploads, converts them into many formats, and streams them smoothly to millions of devices on networks ranging from fibre to patchy 4G. Storage and bandwidth dominate the cost, and playback quality depends on adapting to each viewer's connection. This walkthrough covers the upload pipeline, transcoding, adaptive bitrate streaming, delivery through CDNs, and metadata and view counts.

## Step 1: requirements

**Functional:**

- Creators upload videos
- Viewers watch videos on web, mobile and TV with smooth playback
- Search, recommendations and comments (out of scope for the core design, but mention them)
- View counts and basic analytics

**Non-functional:**

- Playback starts within about 2 seconds and rarely buffers
- Reads vastly outnumber uploads
- Uploads are durable: a creator's video must never be lost
- Global reach with low latency everywhere

## Step 2: estimates

Assume 500 hours of video uploaded per minute (a figure YouTube has cited publicly) and 1 billion views per day.

- **Raw upload storage**: an hour of HD source video might be 2 to 5 GB. 500 hours per minute × 60 × 24 ≈ 720,000 hours per day, so on the order of petabytes of raw uploads per day
- **Transcoded storage**: each video is stored in several resolutions and codecs, multiplying storage again
- **Egress bandwidth**: 1 billion views × an average of 5 minutes at roughly 3 Mbit/s ≈ 10⁹ × 300 s × 3 × 10⁶ bits ≈ 10¹⁸ bits per day, about 11 Tbit/s on average

Those bandwidth figures mean serving from your own origin servers is impossible. CDNs, and for the largest platforms their own edge caches inside ISPs, are mandatory.

## Step 3: high-level design

~~~text
Upload: Client -> Upload service (pre-signed URL) -> Object storage (raw)
                                  -> Event -> Transcoding pipeline -> Object storage (renditions + manifests)
Watch:  Client -> API (metadata, manifest URL) ; Client -> CDN edge -> Origin storage (on miss)
Metadata DB (videos, channels) ; View events -> Stream -> Counters/analytics
~~~

## Deep dive: uploads

Large files over unreliable networks need care:

- The API issues a **pre-signed URL** so the client uploads straight to object storage such as S3, keeping large transfers off application servers
- **Resumable, chunked uploads** split the file into parts, so a dropped connection resumes from the last chunk instead of restarting
- When the upload completes, storage emits an event that starts processing

## Deep dive: transcoding

The uploaded file is converted into many **renditions**: resolutions such as 240p to 4K, bitrates, and codecs such as H.264 for compatibility and VP9 or AV1 for efficiency. Transcoding is CPU-heavy, so it's parallelized:

1. Split the video into short segments, often a few seconds each
2. Transcode segments in parallel across a fleet of workers, coordinated through a queue or workflow engine
3. Generate thumbnails, extract audio, and run content checks
4. Package segments with **manifest files** that list every rendition

The pipeline is a directed graph of tasks. Failed tasks retry individually without redoing the whole video. The video becomes watchable as soon as a basic rendition is ready, with higher qualities following.

## Deep dive: adaptive bitrate streaming

Modern players use **HLS** (HTTP Live Streaming) or **MPEG-DASH**. Each rendition is cut into segments of 2 to 6 seconds, and a manifest lists them. The player:

- downloads the manifest
- measures available bandwidth and buffer level as it plays
- requests each next segment at the highest quality the connection can sustain, dropping quality when bandwidth falls and raising it when it recovers

Because segments are ordinary HTTP files, any CDN can cache them. Adaptive bitrate is why a video degrades to a lower resolution instead of freezing when you walk into a weak-signal area.

## Deep dive: delivery

Segments and manifests are served from CDN edges near viewers. Popularity is extremely skewed: a small fraction of videos gets most views, so edges hold the hot set while the long tail is fetched from origin on demand. The biggest platforms also place caches inside ISP networks, Netflix's Open Connect being a well-known example, to cut transit costs. Pre-positioning new popular releases at edges before launch avoids a thundering herd on the origin.

## Metadata and view counts

Video metadata (title, owner, renditions, status) lives in a sharded database with a cache in front, since it's read on every play. View counts are high-volume, write-heavy and tolerant of slight delay: clients send view events to a stream, consumers aggregate them in batches, and the displayed count updates every few seconds or minutes. Writing a database row per view would never keep up.

## How interviewers test this

Expect the upload pipeline, transcoding and how streaming adapts to bandwidth. Use pre-signed resumable uploads to object storage, parallel segment-based transcoding into multiple renditions, HLS or DASH with manifests, CDN delivery for the hot set, and batched view counting.`,
    [SDP, CLOUDFLARE, HPBN],
    {
      check: { question: "How does adaptive bitrate streaming avoid buffering on a weak connection?", options: ["The player requests later segments at a lower quality rendition", "The server compresses the whole file again", "The video pauses until bandwidth returns", "The CDN switches to UDP"], answer: 0, explanation: "Each short segment can come from a different rendition based on measured bandwidth." },
      takeaways: ["Upload directly to object storage with pre-signed, resumable chunked uploads.", "Transcode segments in parallel into many resolutions and codecs.", "Stream with HLS or DASH so players switch quality per segment.", "Serve segments from CDNs; count views asynchronously in batches."],
      traps: [
        { question: "Upload videos through the API servers.", trap: "Large transfers tie up application servers.", solution: "Issue pre-signed URLs so clients upload straight to object storage." },
        { question: "Increment a database counter on every view.", trap: "Billions of writes per day on hot rows.", solution: "Stream view events and aggregate in batches." },
      ],
    }),

  sdLesson("design-web-crawler", "Design a Web Crawler",
    "Crawl billions of pages politely: URL frontier, deduplication, DNS, robots.txt and freshness.", 30,
`A web crawler downloads pages, extracts their links, and follows them to discover more pages, feeding search engines, archives and AI datasets. Crawling billions of pages means managing an enormous queue of URLs, avoiding duplicates, staying polite to websites, and revisiting pages as they change. This walkthrough covers requirements, the crawl loop, the URL frontier, politeness, deduplication and freshness.

## Step 1: requirements

**Functional:**

- Start from seed URLs, fetch pages, extract links, and crawl recursively
- Store page content for downstream indexing
- Respect robots.txt and avoid overloading any site

**Non-functional:**

- **Scale**: billions of pages
- **Politeness**: never hammer a single host
- **Robustness**: survive malformed HTML, slow servers, crawler traps and crashes
- **Freshness**: revisit pages that change often

## Step 2: estimates

Assume 1 billion pages per month.

- **Fetch rate**: 10⁹ ÷ (2.5 × 10⁶ seconds) ≈ 400 pages per second, so plan for around 1,000 at peak
- **Storage**: at an average of 100 KB of HTML per page, 10⁹ × 100 KB = 100 TB per month, less after compression
- **Bandwidth**: 400 pages × 100 KB ≈ 40 MB per second, about 320 Mbit/s

The crawl isn't limited by raw compute. It's limited by politeness, network latency to slow sites, and managing state for billions of URLs.

## Step 3: the crawl loop

~~~text
Seed URLs -> URL frontier -> Fetchers (DNS cache, robots.txt check) -> Content store
                 ^                                  |
                 |---- URL filter + dedup <---- Link extractor
~~~

1. The **frontier** hands out the next URL to crawl
2. A **fetcher** resolves DNS, checks robots.txt, downloads the page with a timeout
3. The **parser** extracts text and links; content is checked for duplicates and stored
4. Extracted links are normalized, filtered, deduplicated and added back to the frontier

Fetchers are stateless workers that scale horizontally; the frontier and deduplication stores are the stateful core.

## Deep dive: the URL frontier

The frontier is more than a queue. It must balance two goals:

- **Priority**: crawl important pages first, judged by link popularity, site quality or change frequency
- **Politeness**: limit how often each host is contacted

A common design has two layers. **Front queues** order URLs by priority. **Back queues** group URLs by host, one host per queue, with a heap tracking when each host may next be contacted. A fetcher takes the host whose next-allowed time has arrived, fetches one URL, and schedules that host's next visit after a delay, often a second or more, or longer for slow sites.

With billions of URLs, the frontier lives on disk with in-memory buffers, partitioned across machines by hostname so each host's politeness is enforced by one owner.

## Deep dive: politeness and robots.txt

Before crawling a site, fetch and cache its \`/robots.txt\`, and obey its rules about disallowed paths and crawl delays. Identify the crawler with a clear user agent and contact URL. Back off sharply when a site returns errors or slows down. Ignoring politeness gets the crawler blocked and can harm small sites.

## Deep dive: deduplication

Two kinds of duplicates waste effort:

- **Duplicate URLs**: the same URL discovered many times. Normalize URLs (lowercase host, remove default ports and fragments, sort query parameters) and check a seen set. With billions of URLs, a **Bloom filter** tests membership in little memory, accepting a small false-positive rate that occasionally skips a new URL
- **Duplicate content**: different URLs with identical or near-identical pages, such as mirrors and printer versions. Exact duplicates are caught by hashing content; near-duplicates use **SimHash** or **MinHash** fingerprints, where similar documents produce similar fingerprints

## Deep dive: DNS and fetching

DNS lookups can take tens of milliseconds and become a bottleneck at hundreds of fetches per second. Run a local caching resolver and keep a DNS cache in the crawler. Fetch asynchronously with non-blocking I/O, so one worker handles hundreds of concurrent downloads while waiting on slow servers. Enforce timeouts and size limits.

## Robustness and traps

- **Crawler traps**: infinite URL spaces such as calendars with endless "next month" links, or session IDs in URLs. Limit URL length and depth per site, and cap pages per host
- **Malformed content**: parse defensively and skip pages that fail
- **Crashes**: checkpoint the frontier regularly so a restart resumes rather than starting over

## Freshness

Pages change at different rates: news homepages every few minutes, old blog posts rarely. Track how often each page has changed on past visits and schedule revisits accordingly. Conditional requests with \`If-Modified-Since\` or ETags avoid re-downloading unchanged pages.

## How interviewers test this

Expect the crawl loop, the frontier, politeness and deduplication. Separate stateless fetchers from a host-partitioned frontier with per-host delays, obey robots.txt, deduplicate URLs with normalization and Bloom filters and content with hashes or SimHash, cache DNS, and defend against traps.`,
    [SDP, AWESOME_SCALABILITY],
    {
      check: { question: "Why does a crawler's URL frontier keep a separate queue per host?", options: ["To enforce politeness delays so no single site is overloaded", "To sort URLs alphabetically", "Because DNS requires it", "To store page content"], answer: 0, explanation: "Per-host queues let the crawler schedule each host's next fetch after a delay." },
      takeaways: ["Separate stateless fetchers from a stateful frontier and dedup stores.", "Order by priority but enforce per-host politeness, and obey robots.txt.", "Normalize URLs and use Bloom filters; detect near-duplicate content with SimHash.", "Cache DNS, fetch asynchronously, and defend against crawler traps."],
      traps: [
        { question: "Use one FIFO queue of URLs.", trap: "Bursts of links from one site hammer that host.", solution: "Partition by host with per-host delays and a priority layer." },
        { question: "Store every seen URL in a hash set in memory.", trap: "Billions of URLs exceed memory.", solution: "Use a Bloom filter, accepting a small false-positive rate." },
      ],
    }),
];

export const sdFinalWalkthroughLessons: CourseLesson[] = [
  sdLesson("design-typeahead", "Design Search Autocomplete (Typeahead)",
    "Suggest completions in milliseconds with tries, precomputed top-k, caching and data pipelines.", 25,
`Typeahead suggests completions as a user types, such as showing "system design interview" after "sys". It has one of the tightest latency budgets of any feature: suggestions must appear within about 100 ms of each keystroke, or they feel laggy. This walkthrough covers requirements, the trie data structure, precomputing top suggestions, the data pipeline that keeps them fresh, and serving at scale.

## Step 1: requirements

**Functional:**

- As the user types a prefix, return the top 5 to 10 suggested queries
- Rank suggestions by popularity, possibly personalized or localized
- Filter offensive or unsafe suggestions

**Non-functional:**

- Response in under about 100 ms end to end, including the network
- Enormous read volume: every keystroke is a request
- Suggestions can lag real search trends by minutes or hours

## Step 2: estimates

Assume 100 million daily users, 10 searches each, and 6 keystrokes per search that trigger a lookup.

- **Lookups**: 10⁸ × 10 × 6 = 6 × 10⁹ per day ≈ 60,000 per second, perhaps 150,000 at peak
- **Data**: if 100 million distinct popular queries average 20 characters, the raw strings are about 2 GB, small enough to hold in memory per server along with their top-k data

Reads dwarf everything else, and the dataset fits in memory, which shapes the design: precompute and keep everything in RAM.

## Step 3: the trie

A **trie** (prefix tree) stores strings character by character. Each path from the root spells a prefix, and all queries sharing a prefix share a subtree. Finding the node for a prefix takes O(length of prefix) steps.

A naive lookup then searches the whole subtree for the most popular completions, which is far too slow for a short prefix like "s" with millions of descendants.

## Precomputing top-k

The key optimization: store the **top k completions at every trie node**, computed offline. A lookup walks to the prefix node and returns its stored list immediately, with no subtree search. This trades memory, since each node holds a small list, and build time for constant-time answers.

Further optimizations:

- cap prefix length, such as 20 to 50 characters, since long prefixes are rare
- compress chains of single-child nodes (a radix tree) to save memory

## Data pipeline

Suggestions come from search logs:

1. Search queries stream into a log such as Kafka
2. A batch or streaming job aggregates query counts over a recent window, weighting recent searches more, so trending queries rise
3. The job filters out offensive, personal or rare queries
4. It builds new tries with top-k lists and publishes them as versioned snapshots
5. Serving nodes load the new snapshot and swap it in atomically

Rebuilding hourly or daily is common; fast-moving trends can be blended in from a short-window streaming job.

## Serving

~~~text
Client (debounced) -> CDN / edge cache -> Load balancer -> Typeahead servers (trie in memory)
~~~

- **Sharding**: if the trie outgrows one server, shard by prefix range, such as a–f on one shard, while watching for uneven popularity across letters. Replicate each shard for availability and read throughput
- **Caching**: popular short prefixes are requested constantly, so cache their responses at the edge or in the browser for a few minutes
- **Client debouncing**: wait about 100 to 200 ms after the last keystroke before sending, and cancel in-flight requests when a new key is pressed. This alone can cut requests by half
- **Client-side prefix reuse**: results for "syst" can be filtered locally as the user types "syste", if the list is long enough

## Personalization and localization

Global popularity is a baseline. Blend in the user's own recent searches and region-specific trends at serving time, keeping the main trie shared. Personal history is a small per-user list merged with the global suggestions.

## Safety

Autocomplete can surface harmful or defamatory phrases, so filtering is a requirement, not an extra. Maintain blocklists, apply classifiers during the pipeline, and support fast manual removal that bypasses the normal rebuild cycle.

## How interviewers test this

Expect the data structure, how to make lookups fast, and how suggestions stay fresh. Use a trie with precomputed top-k per node held in memory, build it offline from aggregated logs, swap snapshots atomically, shard and replicate by prefix, and cut load with debouncing and caching.`,
    [SDP, AWESOME_SCALABILITY],
    {
      check: { question: "Why store the top-k completions at each trie node?", options: ["So a lookup returns results without searching the node's whole subtree", "To reduce memory use", "To support deletion", "To avoid needing a trie"], answer: 0, explanation: "Precomputation turns an expensive subtree search into reading a small stored list." },
      takeaways: ["Typeahead is read-heavy with a strict latency budget; keep data in memory.", "A trie with precomputed top-k per node gives near-constant lookups.", "Build tries offline from aggregated logs and swap snapshots atomically.", "Debounce clients, cache hot prefixes, and filter unsafe suggestions."],
      traps: [
        { question: "Query the search database with LIKE 'prefix%' on every keystroke.", trap: "Far too slow and expensive at 100,000+ requests per second.", solution: "Serve from an in-memory trie with precomputed results." },
        { question: "Update the trie on every search in real time.", trap: "Constant writes to a read-optimized structure.", solution: "Aggregate logs and rebuild periodically." },
      ],
    }),

  sdLesson("design-payment-system", "Design a Payment System",
    "Move money correctly: idempotency, payment state machines, ledgers, PSP integration and reconciliation.", 30,
`A payment system charges customers and pays out merchants, integrating with external payment service providers (PSPs) such as Razorpay, Stripe or card networks. Unlike most systems, correctness beats speed: a duplicated charge or a lost payment directly harms people and erodes trust. This walkthrough covers requirements, the payment flow, idempotency, state machines, double-entry ledgers, handling PSP uncertainty and reconciliation.

## Step 1: requirements

**Functional:**

- Customers pay for orders using cards, UPI, wallets or net banking through external PSPs
- Merchants receive payouts
- Refunds and payment status queries

**Non-functional:**

- **Correctness**: never charge twice, never lose a payment
- **Auditability**: every money movement is recorded and explainable
- **Security**: never store raw card numbers yourself; comply with PCI DSS
- Availability matters, but a delayed payment is better than a wrong one

## Step 2: estimates

Even a large platform handling 10 million payments per day averages around 100 per second, with peaks of perhaps 1,000 during sales. Volume is modest compared with feeds or chat. The difficulty is correctness and external dependencies, not throughput.

## Step 3: high-level flow

~~~text
Client -> Checkout -> Payment service -> PSP (card network / UPI)
                         |                   |
                   Payments DB          Webhook callback
                   Ledger (double-entry) <- updates
                   Reconciliation job <- PSP settlement files
~~~

1. Checkout creates a payment record with status \`created\` and an idempotency key
2. The payment service calls the PSP, which may redirect the user for authentication such as OTP
3. The PSP returns a result synchronously, or later through a **webhook**
4. The payment service updates the payment state and writes ledger entries
5. Downstream services, such as order fulfilment, react to a payment-succeeded event

## Deep dive: idempotency

Networks drop responses, users double-click, and clients retry. Every write must be idempotent:

- The client generates an **idempotency key** per checkout attempt and sends it with the request
- The payment service stores the key with the result, enforced by a unique constraint
- Repeated requests with the same key return the stored result instead of creating a new charge
- Calls to the PSP also carry an idempotency key, so retries to the PSP don't double-charge

## Deep dive: payment state machine

Each payment moves through explicit states:

~~~text
created -> pending (sent to PSP) -> succeeded | failed
succeeded -> refund_pending -> refunded
~~~

Only valid transitions are allowed, enforced in code and guarded with optimistic locking (a version column) so concurrent updates, such as a webhook arriving while a retry runs, can't corrupt the state. Every transition is recorded with a timestamp for auditing.

## Deep dive: the ledger

Money movements are recorded in a **double-entry ledger**: every transaction creates at least two entries that sum to zero, debiting one account and crediting another. When a customer pays ₹500, the customer receivable is credited and the platform's clearing account is debited; at settlement, money moves from clearing to the merchant's payable balance.

Rules that keep ledgers trustworthy:

- entries are **append-only**; mistakes are fixed by new correcting entries, never by editing history
- balances are derived from entries, so they can always be recomputed and verified
- amounts are stored as integers in the smallest unit (paise) or exact decimals, never floating point

## Deep dive: uncertainty with the PSP

The hardest case is a timeout: the payment service called the PSP, and no answer came back. The charge may or may not have happened. Never assume failure and retry blindly with a new request. Instead:

- mark the payment \`pending\` or \`unknown\`
- retry the status query, or resend with the same idempotency key, which the PSP deduplicates
- rely on the PSP's webhook, verifying its signature, to confirm the final outcome

Webhooks can arrive late, duplicated or out of order, so their handlers must be idempotent and check current state before transitioning.

## Reconciliation

Every day, PSPs send settlement reports listing what they processed. A **reconciliation** job compares these against internal records and flags mismatches: payments the PSP has that you don't, amounts that differ, or charges stuck in pending. Reconciliation catches bugs, lost webhooks and fraud that real-time logic misses, and it's what auditors examine.

## Security and compliance

Use the PSP's hosted fields or SDKs so raw card numbers never touch your servers, reducing PCI DSS scope; store only tokens the PSP returns. Encrypt sensitive data at rest, restrict access, and log every administrative action. Add fraud checks, such as velocity limits and risk scoring, before authorizing large or unusual payments.

## How interviewers test this

Expect "How do you prevent double charges?" and "What if the PSP times out?" Use idempotency keys end to end, an explicit state machine with optimistic locking, an append-only double-entry ledger with integer amounts, verified idempotent webhooks, and daily reconciliation.`,
    [AWS_BUILDERS, SDP],
    {
      check: { question: "A call to the PSP times out with no response. What should the payment service do?", options: ["Mark the payment pending and confirm the outcome via status query, same-key retry or webhook", "Assume failure and charge again with a new request", "Assume success and ship the order", "Delete the payment record"], answer: 0, explanation: "The charge may have happened; blind retries risk double charging." },
      takeaways: ["Correctness beats speed: never charge twice, never lose a payment.", "Use idempotency keys from the client through to the PSP.", "Model payments as a state machine with optimistic locking.", "Record money in an append-only double-entry ledger, and reconcile daily with PSP reports."],
      traps: [
        { question: "Store amounts as floating point rupees.", trap: "Rounding errors accumulate in balances.", solution: "Use integer paise or exact decimal types." },
        { question: "Edit a ledger entry to fix a mistake.", trap: "Destroys the audit trail.", solution: "Append a correcting entry; never modify history." },
      ],
    }),

  sdLesson("design-file-storage", "Design a File Storage and Sync Service",
    "Dropbox-style sync: chunking, deduplication, metadata, change notifications and conflicts.", 30,
`A file storage and sync service such as Dropbox, Google Drive or OneDrive keeps a user's files available on every device and in the browser, syncing changes automatically. The challenges are moving large files efficiently over unreliable networks, avoiding re-uploading unchanged data, notifying devices of changes quickly, and resolving conflicting edits. This walkthrough covers requirements, chunking, deduplication, the metadata service, sync notifications and conflict handling.

## Step 1: requirements

**Functional:**

- Upload, download and delete files; organize them in folders
- Sync changes across a user's devices automatically
- Share files and folders with others
- Keep version history to restore earlier versions

**Non-functional:**

- **Durability above all**: files must never be lost
- Efficient bandwidth use, since files can be gigabytes and networks unreliable
- Sync latency of seconds for small changes
- Scale to hundreds of millions of users and exabytes of data

## Step 2: estimates

Assume 50 million daily active users, each with 10 GB stored, and 2 file changes per day averaging 1 MB of changed data.

- **Total storage**: 50M × 10 GB = 500 PB, before replication, and more counting all registered users
- **Change rate**: 10⁸ changes per day ≈ 1,000 per second, about 1 GB per second of changed data
- **Metadata**: billions of file records, each a few hundred bytes, so terabytes of metadata

Storage is huge but mostly cold. The design must avoid moving whole files when only small parts change.

## Step 3: high-level design

~~~text
Client app (watcher, chunker, local DB)
   -> Block service -> Object storage (chunks by hash)
   -> Metadata service -> Metadata DB (files, versions, chunk lists)
   <- Notification service (long poll / WebSocket: "folder changed")
~~~

The client watches the local folder, splits changed files into chunks, uploads only new chunks, then commits a metadata update listing the file's chunks. Other devices are notified, fetch the new metadata, and download only the chunks they're missing.

## Deep dive: chunking

Files are split into **chunks**, often around 4 MB, each identified by a cryptographic hash of its contents. Benefits:

- **Resumable transfers**: a failed upload resumes from the last chunk
- **Parallel transfers**: several chunks upload at once
- **Delta sync**: editing part of a large file changes only some chunks, so only those upload

Fixed-size chunking shifts every chunk boundary when bytes are inserted near the start of a file. **Content-defined chunking**, which picks boundaries using a rolling hash of the content, keeps most boundaries stable after insertions, improving delta sync.

## Deep dive: deduplication

Because chunks are named by content hash, identical chunks are stored once. Before uploading, the client asks the block service which of its chunk hashes already exist and uploads only the missing ones. This deduplicates across a user's files and, if the provider chooses, across users, saving large amounts of storage for common files. Cross-user deduplication has privacy implications, since it can reveal whether someone else stored a file, so some services limit it to within an account.

## Deep dive: metadata

The metadata service is the source of truth for the file tree: file names, folder structure, owners, sharing permissions, versions, and for each version, the ordered list of chunk hashes. It needs strong consistency and transactions, since moving a folder or committing a new version must be atomic. A relational database sharded by user or namespace fits well, with caching for hot reads. Object storage holds chunk bytes only.

Committing a file version is a two-step protocol: upload all chunks first, then commit metadata referencing them. If the commit fails, the orphaned chunks are garbage-collected later; no reader ever sees a version whose chunks are missing.

## Deep dive: sync notifications

Devices must learn about changes quickly without polling constantly. Clients hold a **long-poll** or WebSocket connection to a notification service, which signals "namespace X changed". The client then asks the metadata service for changes since its last known cursor, a monotonically increasing journal position per namespace, and applies them. Offline devices catch up the same way when they reconnect.

## Deep dive: conflicts

Two devices can edit the same file while offline. When the second device commits, its base version no longer matches the latest. Most sync services don't try to merge arbitrary files. They keep both: the later commit is saved as a **conflicted copy** with the device name, and the user decides. Collaborative editors such as Google Docs avoid file-level conflicts entirely with real-time operational transformation or CRDTs, a different design.

## Durability and versions

Chunks are replicated across zones or encoded with **erasure coding**, which spreads data and parity fragments across many disks so the file survives multiple failures with less overhead than full copies. Version history comes cheaply: old versions are lists of chunk hashes that still exist, so restoring an old version means pointing metadata back at them. Retention policies eventually delete unreferenced chunks.

## How interviewers test this

Expect chunking, sync and conflicts. Split files into content-hashed chunks for resumable delta uploads and deduplication, keep a strongly consistent metadata service separate from chunk storage, notify clients with long polling plus change cursors, and save conflicted copies when concurrent offline edits collide.`,
    [SDP, AWESOME_SCALABILITY, AWS_BUILDERS],
    {
      check: { question: "Why name file chunks by a hash of their contents?", options: ["Identical chunks are stored once, and clients upload only chunks the server lacks", "Hashes make files smaller", "It encrypts the file", "It sorts files alphabetically"], answer: 0, explanation: "Content addressing enables deduplication and delta sync." },
      takeaways: ["Split files into content-hashed chunks for resumable, parallel, delta transfers.", "Deduplicate by uploading only chunks the server doesn't already have.", "Keep strongly consistent metadata separate from chunk storage; commit metadata after chunks upload.", "Notify devices via long polling plus change cursors, and save conflicted copies for concurrent edits."],
      traps: [
        { question: "Re-upload the whole file on every change.", trap: "Wastes bandwidth on large files with small edits.", solution: "Chunk files and upload only changed chunks." },
        { question: "Update metadata before chunks finish uploading.", trap: "Other devices may see a version with missing data.", solution: "Upload chunks first, then commit metadata atomically." },
      ],
    }),
];
