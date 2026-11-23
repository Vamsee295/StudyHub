import type { LessonQuestions } from './index';

export const systemDesignQuestions: LessonQuestions = {
  "system-design-interview-framework": [
    { q: "Which is a non-functional requirement?", o: ["Redirects must complete in under 50 ms at p99", "Users can create short links", "Users can set a custom alias", "Links can expire"], a: 0, e: "Non-functional requirements describe qualities such as latency, scale and availability." },
    { q: "Why state trade-offs out loud during the interview?", o: ["Interviewers grade reasoning, not only the final diagram", "It fills time", "It's required by the rubric to mention costs in dollars", "It replaces estimation"], a: 0, e: "Every choice has a cost; explaining it shows judgement." },
  ],
  "scalability-performance-latency": [
    { q: "A system is fast for one user but slows under load. What kind of problem is this?", o: ["A scalability problem", "A performance problem only", "A correctness bug", "A security issue"], a: 0, e: "Performance is speed for one user; scalability is staying fast as load grows." },
    { q: "What is the main limit of vertical scaling?", o: ["A hard ceiling on machine size, plus a single point of failure", "It needs a load balancer", "It requires stateless code", "It can't run databases"], a: 0, e: "Horizontal scaling removes the ceiling at the cost of distributed complexity." },
  ],
  "back-of-the-envelope-estimation": [
    { q: "10 million users each upload 0.2 photos of 1 MB per day. Roughly how much storage per day?", o: ["2 TB", "200 GB", "20 TB", "2 GB"], a: 0, e: "2 million photos × 1 MB = 2 × 10⁶ MB = 2 TB." },
    { q: "Why multiply average traffic by 2 to 3 when sizing servers?", o: ["Traffic peaks well above the daily average", "To account for bits versus bytes", "Because of replication", "It's not necessary"], a: 0, e: "Systems must survive peak load, not average load." },
  ],
  "availability-and-consistency": [
    { q: "Two components in sequence each have 99.9% availability. What's the combined availability?", o: ["About 99.8%", "99.9%", "99.99%", "99.0%"], a: 0, e: "Sequential availabilities multiply: 0.999 × 0.999 ≈ 0.998." },
    { q: "Which feature most needs strong consistency?", o: ["An account balance", "A like counter", "A product review list", "A trending topics widget"], a: 0, e: "Money must never be read stale or double spent." },
  ],
  "dns-and-cdn": [
    { q: "What is the standard way to make CDN cache invalidation painless for static assets?", o: ["Put a version or content hash in the file name", "Set max-age=0 on everything", "Purge the whole CDN on each deploy", "Avoid caching JavaScript"], a: 0, e: "A new deploy references a new URL, so old copies don't matter." },
    { q: "Why is DNS-based failover slow?", o: ["Resolvers and browsers cache answers until the TTL expires", "DNS uses TCP only", "DNS servers are in one region", "DNS can't return multiple addresses"], a: 0, e: "Some clients also ignore TTLs, so changes propagate gradually." },
  ],
  "load-balancers-and-reverse-proxies": [
    { q: "Which algorithm suits requests whose durations vary widely?", o: ["Least connections", "Round robin", "Random with no health checks", "Alphabetical by IP"], a: 0, e: "It avoids piling new work onto servers busy with long requests." },
    { q: "Why are sticky sessions a last resort?", o: ["They unbalance load and lose sessions when a server dies", "They're slower to configure", "They require HTTP/3", "They disable TLS"], a: 0, e: "Store sessions in a shared cache instead." },
  ],
  "api-design": [
    { q: "Which pagination suits an infinite-scroll feed?", o: ["Cursor-based pagination", "Offset pagination", "Page numbers only", "No pagination"], a: 0, e: "Cursors stay stable as new items arrive and stay fast at depth." },
    { q: "Where does gRPC fit best?", o: ["Internal service-to-service calls needing speed and typed contracts", "Public browser APIs without a proxy", "Static file delivery", "Email delivery"], a: 0, e: "Browsers need a proxy such as gRPC-Web to call it." },
  ],
  "database-replication-and-sharding": [
    { q: "In a leaderless store with N = 3, which settings guarantee reads see the latest acknowledged write?", o: ["W = 2, R = 2", "W = 1, R = 1", "W = 1, R = 2", "W = 3, R = 0"], a: 0, e: "W + R > N makes the read and write sets overlap." },
    { q: "What does sharding make harder?", o: ["Cross-shard joins and transactions", "Single-key lookups", "Adding indexes", "Read caching"], a: 0, e: "Queries spanning shards need fan-out, and atomic updates need 2PC or sagas." },
  ],
  "sql-vs-nosql-choosing-storage": [
    { q: "Which store suits full-text product search with ranking and filters?", o: ["A search engine such as Elasticsearch", "A key-value cache", "A graph database", "Object storage"], a: 0, e: "Inverted indexes power full-text search; the primary database stays the source of truth." },
    { q: "Which store fits 'friends of friends who like this page' queries?", o: ["A graph database", "A key-value store", "Object storage", "A message queue"], a: 0, e: "Multi-hop relationship traversal is what graph databases optimize." },
  ],
  "caching": [
    { q: "What is cache penetration?", o: ["Repeated requests for keys that don't exist always miss and hit the database", "A hot key expiring", "Cache memory running out", "A cache node failing"], a: 0, e: "Cache 'not found' results briefly or use a Bloom filter." },
    { q: "Which caching strategy can lose data if a cache node fails?", o: ["Write-back", "Cache-aside", "Write-through", "Read-through with TTL"], a: 0, e: "Write-back acknowledges writes before they reach the database." },
  ],
  "consistent-hashing": [
    { q: "What problem do virtual nodes solve?", o: ["Uneven load from few positions on the ring", "Slow hash functions", "Network partitions", "Lack of replication"], a: 0, e: "Many small arcs per server average out ownership." },
    { q: "How does Redis Cluster distribute keys?", o: ["16,384 hash slots assigned to nodes", "Pure mod N hashing", "Alphabetical ranges", "Random placement"], a: 0, e: "Slots move between nodes during resharding." },
  ],
  "message-queues-and-event-streaming": [
    { q: "Several independent systems must each process every event and replay history. Which fits?", o: ["An event log such as Kafka", "A work queue that deletes messages", "A cron job", "Direct HTTP calls"], a: 0, e: "Logs retain events and let each consumer group track its own offset." },
    { q: "What does a dead-letter queue hold?", o: ["Messages that failed processing repeatedly", "Messages already processed", "High-priority messages", "Encrypted messages"], a: 0, e: "It stops poison messages blocking the main queue." },
  ],
  "rate-limiting": [
    { q: "What HTTP status code signals a rate limit?", o: ["429 Too Many Requests", "403 Forbidden", "503 Service Unavailable", "400 Bad Request"], a: 0, e: "Add a Retry-After header so clients know when to try again." },
    { q: "What is the weakness of the fixed window counter?", o: ["Clients can double the allowed rate around window boundaries", "It uses too much memory", "It can't use Redis", "It never resets"], a: 0, e: "Sliding window counters fix this cheaply." },
  ],
  "reliability-patterns": [
    { q: "What does an open circuit breaker do?", o: ["Fails calls immediately without contacting the dependency", "Retries forever", "Doubles timeouts", "Routes all traffic to the dependency"], a: 0, e: "After a cool-down it lets trial calls through (half-open)." },
    { q: "A 99.9% monthly SLO gives roughly how much allowed full downtime per month?", o: ["About 43 minutes", "About 4 minutes", "About 7 hours", "About 1 day"], a: 0, e: "0.1% of 30 days ≈ 43.2 minutes: the error budget." },
  ],
  "design-url-shortener": [
    { q: "Why permute counter-based IDs before Base62 encoding?", o: ["So consecutive links don't get guessable sequential codes", "To make codes longer", "To avoid collisions", "To compress URLs"], a: 0, e: "A bijective permutation keeps uniqueness while hiding the sequence." },
    { q: "Where should click analytics be recorded?", o: ["Asynchronously, by publishing events to a queue", "Synchronously in the redirect before responding", "In the browser only", "Nowhere"], a: 0, e: "Keeping analytics off the critical path keeps redirects fast." },
  ],
  "design-news-feed": [
    { q: "What does a per-user feed cache usually store?", o: ["Post IDs, hydrated into posts at read time", "Full copies of each post", "Only follower counts", "Rendered HTML pages"], a: 0, e: "IDs keep memory small, and edits appear everywhere." },
    { q: "With fan-out on write, which action is expensive?", o: ["Publishing a post from an account with many followers", "Reading the feed", "Following a user", "Liking a post"], a: 0, e: "Each post is copied into every follower's feed." },
  ],
  "design-chat-system": [
    { q: "How does a chat server know where to deliver a message for another user?", o: ["It looks up the user's server in a session registry", "It broadcasts to every server", "It asks the client", "It stores messages until polled"], a: 0, e: "A registry such as Redis maps user IDs to connected servers." },
    { q: "Which store suits write-heavy chat history read by conversation?", o: ["A wide-column store partitioned by conversation ID", "A single relational table with no partitioning", "Object storage only", "A graph database"], a: 0, e: "Recent messages for a conversation become one sequential read." },
  ],
  "design-notification-system": [
    { q: "What should happen to a push notification for an invalid device token?", o: ["Remove the token instead of retrying", "Retry forever", "Send it by email automatically", "Ignore and keep the token"], a: 0, e: "Permanent failures shouldn't be retried; clean up bad tokens." },
    { q: "Why does the notification API return 202 Accepted?", o: ["Delivery happens asynchronously after the request is queued", "The notification was already delivered", "The request was rejected", "It's required by APNs"], a: 0, e: "Separating acceptance from delivery keeps the API fast during bursts." },
  ],
};
