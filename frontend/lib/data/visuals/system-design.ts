import type { VisualMap } from "./types";

const c = "system-design";

export const sdVisuals: VisualMap = {
  [`${c}/system-design-interview-framework`]: {
    plain:
      "A system design interview is planning a building, not laying bricks. Agree what it must do and how big it gets, sketch the main rooms (services and storage), then zoom into the hardest part and discuss trade-offs. Ask before you assume.",
    diagram: `flowchart LR
  R["1 Requirements<br/>functional + scale"] --> E["2 Estimates<br/>QPS, storage"] --> A["3 API + data model"] --> H["4 High-level design"] --> D["5 Deep dive<br/>bottlenecks"] --> T["6 Trade-offs<br/>+ wrap up"]`,
    caption: "A repeatable structure for a 45-minute design round.",
  },
  [`${c}/scalability-performance-latency`]: {
    plain:
      "Scaling up (vertical) is buying a bigger truck; scaling out (horizontal) is buying more trucks. A bigger truck has a size limit and is a single point of failure; more trucks need someone to split the load, but can grow almost without limit.",
    diagram: `flowchart LR
  subgraph Vertical
    S1["1 server<br/>8 → 64 cores"]
  end
  subgraph Horizontal
    LB["load balancer"] --> A["server"]
    LB --> B["server"]
    LB --> C["server"]
  end`,
    caption: "Bigger machine versus more machines.",
  },
  [`${c}/back-of-the-envelope-estimation`]: {
    plain:
      "Estimation is rough maths to size a system: users × actions per day ÷ seconds in a day gives requests per second. You only need the right order of magnitude to choose between one server and a thousand.",
    diagram: `flowchart LR
  U["100 M daily users"] --> A["× 10 reads each<br/>= 1 B reads / day"] --> Q["÷ 86,400 s<br/>≈ 12,000 reads / s"] --> P["peak × 2–3<br/>≈ 30,000 / s"]`,
    caption: "From users to requests per second.",
  },
  [`${c}/availability-and-consistency`]: {
    plain:
      "Availability is how often the system answers; 99.9% still allows about 8.8 hours of downtime a year, 99.99% about 53 minutes. Consistency is whether every reader sees the latest write. Across machines you often trade a little of one for the other.",
    diagram: `flowchart LR
  A["99% · 3.65 days down / year"] --> B["99.9% · 8.8 hours"] --> C["99.99% · 53 minutes"] --> D["99.999% · 5 minutes"]`,
    caption: "Each extra nine cuts allowed downtime by 10×.",
  },
  [`${c}/dns-and-cdn`]: {
    plain:
      "A CDN keeps copies of your images and videos in data centres all over the world, like a chain of local warehouses. A user in Chennai is served from Chennai instead of from a server in Virginia, so pages load much faster.",
    diagram: `flowchart LR
  U1["User in Chennai"] --> E1["CDN edge · Chennai"]
  U2["User in London"] --> E2["CDN edge · London"]
  E1 -->|"cache miss only"| O["Origin server"]
  E2 -->|"cache miss only"| O`,
    caption: "Edges serve cached content close to users; only misses reach the origin.",
  },
  [`${c}/load-balancers-and-reverse-proxies`]: {
    plain:
      "A load balancer is the receptionist sending each visitor to a free counter. It spreads requests over many servers, skips servers that fail health checks, and lets you add servers without users noticing.",
    diagram: `flowchart LR
  C["Clients"] --> LB["Load balancer<br/>round robin · least connections"]
  LB --> S1["App server 1"]
  LB --> S2["App server 2"]
  LB --> S3["App server 3 ✗ unhealthy"]`,
    caption: "Traffic goes only to healthy servers.",
  },
  [`${c}/api-design`]: {
    plain:
      "An API is the menu your service offers. REST uses nouns and HTTP verbs: GET /users/42 reads, POST /orders creates. Good APIs are predictable, versioned and paginated, so clients don't break when you change things inside.",
    diagram: `flowchart LR
  G["GET /orders?page=2"] --> L["list"]
  P["POST /orders"] --> N["create"]
  R["GET /orders/17"] --> O["read one"]
  D["DELETE /orders/17"] --> X["delete"]`,
    caption: "Resources as nouns, actions as HTTP methods.",
  },
  [`${c}/database-replication-and-sharding`]: {
    plain:
      "Replication copies the database to followers so reads spread out and a backup is ready if the leader dies. Sharding splits the data by a key (like user id) so each server holds only a slice, which spreads writes and storage too.",
    diagram: `flowchart TB
  App["App"] -->|"writes"| L[("Leader")]
  L -->|"replicates"| F1[("Follower")]
  L -->|"replicates"| F2[("Follower")]
  App -->|"reads"| F1
  App -->|"reads"| F2`,
    caption: "Leader-follower replication: write to one, read from many.",
  },
  [`${c}/sql-vs-nosql-choosing-storage`]: {
    plain:
      "Pick storage by access pattern, not fashion. Relationships and transactions (orders, payments) suit SQL. Huge volumes of simple key lookups suit key-value stores. Documents, wide-column, graph and search engines each fit their own kind of question.",
    diagram: `flowchart TB
  Q{"Main need?"} -->|"transactions, joins"| S["SQL · PostgreSQL, MySQL"]
  Q -->|"key → value at scale"| K["Key-value · Redis, DynamoDB"]
  Q -->|"flexible documents"| D["Document · MongoDB"]
  Q -->|"time series, huge writes"| W["Wide-column · Cassandra"]
  Q -->|"full-text search"| E["Search · Elasticsearch"]`,
    caption: "Choose the store that fits the question.",
  },
  [`${c}/caching`]: {
    plain:
      "A cache is a sticky note of answers you looked up recently. Cache-aside: check the note first; on a miss, ask the database and write the answer on the note for next time. It makes reads fast, but notes can go out of date, so they expire.",
    diagram: `sequenceDiagram
  participant A as App
  participant C as Cache
  participant D as Database
  A->>C: get user:42
  C-->>A: miss
  A->>D: SELECT … WHERE id = 42
  D-->>A: row
  A->>C: set user:42 (TTL 5 min)
  Note over A,C: next read is a cache hit`,
    caption: "The cache-aside pattern.",
  },
  [`${c}/consistent-hashing`]: {
    plain:
      "Consistent hashing places servers and keys on a circle; each key belongs to the next server clockwise. Adding or removing a server only moves the keys next to it, instead of reshuffling everything as hash mod N would.",
    diagram: `flowchart LR
  K1["key A"] --> S1["Server 1"]
  K2["key B"] --> S2["Server 2"]
  K3["key C"] --> S3["Server 3"]
  S1 --> S2 --> S3 --> S1`,
    caption: "A ring of servers: each key goes to the next server clockwise.",
  },
  [`${c}/message-queues-and-event-streaming`]: {
    plain:
      "A message queue is an order board in a kitchen: waiters pin orders, cooks take them when free. The waiter doesn't wait for the food, so spikes are absorbed, and if a cook is sick the orders just wait instead of being lost.",
    diagram: `flowchart LR
  P1["Order service"] --> Q[["Queue / topic"]]
  P2["Payment service"] --> Q
  Q --> C1["Email worker"]
  Q --> C2["Inventory worker"]
  Q --> C3["Analytics worker"]`,
    caption: "Producers and consumers are decoupled by the queue.",
  },
  [`${c}/rate-limiting`]: {
    plain:
      "A token bucket is a jar that refills with tokens at a steady rate. Each request takes a token; if the jar is empty, the request is refused (HTTP 429). Short bursts are fine while tokens last, but sustained floods are capped.",
    diagram: `flowchart LR
  R["refill 10 tokens / s"] --> B[("bucket · max 20")]
  Q["request"] --> C{"token available?"}
  B --> C
  C -->|"yes, take one"| OK["allow"]
  C -->|"no"| X["429 Too Many Requests"]`,
    caption: "The token bucket algorithm.",
  },
  [`${c}/reliability-patterns`]: {
    plain:
      "A circuit breaker is the fuse in your house: if a downstream service keeps failing, stop calling it for a while instead of piling up timeouts, then try one test call to see if it's back. It stops one failure spreading through the whole system.",
    diagram: `stateDiagram-v2
  [*] --> Closed
  Closed --> Open: failures exceed threshold
  Open --> HalfOpen: after cool-down
  HalfOpen --> Closed: test call succeeds
  HalfOpen --> Open: test call fails`,
    caption: "Circuit breaker states.",
  },
  [`${c}/design-url-shortener`]: {
    plain:
      "A URL shortener stores a mapping from a short code to a long URL. Creating one writes the mapping; visiting the short link looks it up (usually from a cache) and redirects. Reads vastly outnumber writes, so caching does most of the work.",
    diagram: `flowchart LR
  U["User"] -->|"GET /aZ3k9"| LB["Load balancer"] --> A["App servers"]
  A --> C[("Cache<br/>code → URL")]
  A --> D[("Database")]
  A -->|"301 redirect"| U`,
    caption: "Read path: look up the code, redirect.",
  },
  [`${c}/design-news-feed`]: {
    plain:
      "When someone posts, you can either copy the post into every follower's feed right away (fan-out on write, fast reads) or build each feed when it's opened (fan-out on read, cheap writes). Celebrities with millions of followers usually get the second treatment.",
    diagram: `flowchart LR
  P["New post"] --> F["Fan-out service"]
  F --> F1[("feed: follower 1")]
  F --> F2[("feed: follower 2")]
  F --> F3[("feed: follower 3")]
  R["Open feed"] --> F1`,
    caption: "Fan-out on write: precompute followers' feeds.",
  },
  [`${c}/design-chat-system`]: {
    plain:
      "Chat needs messages pushed the moment they're sent, so each online user keeps a WebSocket open to a chat server. The server stores the message, then pushes it down the recipient's socket, or queues a push notification if they're offline.",
    diagram: `sequenceDiagram
  participant A as Alice
  participant S as Chat server
  participant DB as Message store
  participant B as Bob
  A->>S: send "hi" (WebSocket)
  S->>DB: store message
  S->>B: push "hi" (WebSocket)
  B-->>S: delivered receipt
  S-->>A: ✓✓`,
    caption: "Real-time delivery over persistent connections.",
  },
  [`${c}/design-notification-system`]: {
    plain:
      "A notification system takes events, decides who should hear about them and how (push, SMS, email), and hands each to a worker queue per channel, with retries, so one slow email provider never delays phone pushes.",
    diagram: `flowchart LR
  E["Events"] --> N["Notification service<br/>preferences, templates"]
  N --> Q1[["push queue"]] --> W1["APNs / FCM"]
  N --> Q2[["SMS queue"]] --> W2["SMS provider"]
  N --> Q3[["email queue"]] --> W3["Email provider"]`,
    caption: "One queue per channel isolates failures.",
  },
  [`${c}/design-ride-sharing`]: {
    plain:
      "Ride sharing is a constant stream of driver locations plus matching. Drivers send their position every few seconds into a geospatial index; when a rider requests, the system finds nearby free drivers and offers the trip.",
    diagram: `flowchart LR
  D["Drivers<br/>location every 4 s"] --> L["Location service"] --> G[("Geo index<br/>e.g. geohash cells")]
  R["Rider request"] --> M["Matching service"] --> G
  M --> O["Offer to nearest driver"]`,
    caption: "Locations in, nearest match out.",
  },
  [`${c}/design-video-streaming`]: {
    plain:
      "Uploaded videos are transcoded into many resolutions and cut into small chunks, then spread across a CDN. The player picks the best quality the connection can handle and switches up or down chunk by chunk (adaptive bitrate).",
    diagram: `flowchart LR
  U["Upload"] --> T["Transcode<br/>240p … 4K, chunks"] --> S[("Object storage")] --> C["CDN"] --> P["Player<br/>adaptive bitrate"]`,
    caption: "Upload once, stream many versions everywhere.",
  },
  [`${c}/design-web-crawler`]: {
    plain:
      "A crawler is a librarian working through a to-read list: take a URL from the frontier, download it, save it, pull out its links, and add the new ones to the list, while checking duplicates and being polite to each website.",
    diagram: `flowchart LR
  F[["URL frontier"]] --> D["Downloader"] --> P["Parser"]
  P --> S[("Page store")]
  P --> X["Extract links"] --> U{"seen before?"}
  U -->|"no"| F`,
    caption: "The crawl loop.",
  },
  [`${c}/design-typeahead`]: {
    plain:
      "Typeahead suggests completions as you type. A trie stores phrases letter by letter, and each node remembers its most popular completions, so typing 'pla' instantly returns 'placement', 'plan', 'play' without searching everything.",
    diagram: `flowchart TB
  R["root"] --> P["p"] --> L["l"] --> A["a<br/>top: placement, plan, play"]
  A --> C["c → placement"]
  A --> N["n → plan"]
  A --> Y["y → play"]`,
    caption: "A trie with top suggestions cached at each prefix.",
  },
  [`${c}/design-payment-system`]: {
    plain:
      "Payments must never charge twice. Every request carries an idempotency key, the state of each payment is recorded step by step in a ledger, and calls to the bank are retried safely. Correctness beats speed here.",
    diagram: `stateDiagram-v2
  [*] --> Created: request + idempotency key
  Created --> Authorized: bank approves
  Authorized --> Captured: funds taken
  Created --> Failed: bank declines
  Captured --> Refunded: refund
  Captured --> [*]`,
    caption: "A payment's life, recorded in a ledger.",
  },
  [`${c}/design-file-storage`]: {
    plain:
      "File sync services split files into chunks and store each chunk once, keyed by its hash. Changing one paragraph re-uploads only the changed chunk; a metadata database remembers which chunks make up each file version.",
    diagram: `flowchart LR
  F["file.pdf"] --> C1["chunk a1f…"]
  F --> C2["chunk 9bd…"]
  F --> C3["chunk 4c2…"]
  C1 --> S[("Block storage<br/>dedup by hash")]
  C2 --> S
  C3 --> S
  F --> M[("Metadata DB<br/>file → chunk list")]`,
    caption: "Chunked, deduplicated storage.",
  },
};
