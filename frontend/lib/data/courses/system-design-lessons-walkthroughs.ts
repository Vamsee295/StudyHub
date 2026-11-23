// System Design module 5: step-by-step design walkthroughs. Original writing; problem list
// follows the CC BY 4.0 system-design-primer, cited per lesson.
import { CourseLesson } from './types';
import { sdLesson, SDP, AWS_BUILDERS, AWESOME_SCALABILITY, HPBN } from './system-design-shared';

export const sdWalkthroughLessons: CourseLesson[] = [
  sdLesson("design-url-shortener", "Design a URL Shortener",
    "A full walkthrough: requirements, estimates, ID generation, storage, caching and analytics.", 30,
`A URL shortener turns a long link into a short one, such as \`sho.rt/aZ3kQ9b\`, and redirects visitors to the original. It's the most common warm-up design problem because it touches every core idea: estimation, ID generation, read-heavy scaling and caching. This walkthrough follows the four-step framework from requirements to deep dives.

## Step 1: requirements

**Functional:**

- Create a short URL for a long URL, optionally with a custom alias and expiry
- Redirect a short URL to its long URL
- Optional: click analytics per link

**Non-functional:**

- Heavily read-dominated: assume a 100:1 read-to-write ratio
- Redirects must be fast, under about 50 ms at p99 excluding the user's network
- Highly available: a broken redirect breaks every page that links to it
- Short codes shouldn't be guessable in sequence, to avoid enumeration

## Step 2: estimates

Assume 100 million new URLs per month.

- **Writes**: 10⁸ ÷ (2.5 × 10⁶ seconds) ≈ 40 per second
- **Reads**: 100 × 40 = 4,000 per second on average, perhaps 10,000 at peak
- **Storage**: each record (code, long URL up to about 2 KB, owner, timestamps) averages around 500 bytes. Over 5 years: 100M × 12 × 5 = 6 billion URLs × 500 bytes = 3 TB

**Code length**: with 62 characters (a–z, A–Z, 0–9), 7 characters give 62⁷ ≈ 3.5 trillion combinations, far more than 6 billion. Seven characters is enough.

## Step 3: high-level design

**API:**

~~~http
POST /api/urls        { "longUrl": "...", "alias": "optional", "expiresAt": "optional" }
-> 201 { "shortUrl": "https://sho.rt/aZ3kQ9b" }

GET /{code}
-> 301 or 302 redirect with Location: <longUrl>
~~~

**Components:**

~~~text
Client -> Load balancer -> Stateless app servers -> Redis cache -> Database
                                         \\-> Analytics events -> Queue -> Analytics store
~~~

**Data model**: a table \`urls(code PRIMARY KEY, long_url, user_id, created_at, expires_at)\`. Lookups are always by code, a perfect key-value access pattern, so a key-value or wide-column store such as DynamoDB or Cassandra fits well. A relational database with code as the primary key also works at this scale.

## Step 4: deep dive on ID generation

The central question is how to generate unique short codes. Three approaches:

**1. Hash the long URL**, for example MD5 or SHA-256, and take the first 7 Base62 characters. The same URL always produces the same code, which deduplicates. But truncated hashes collide, so you must check the database and retry with a salt on collision, which adds a read to every write.

**2. Counter plus Base62 encoding.** A unique 64-bit number per URL, Base62-encoded, gives a short code with no collisions. The counter must be unique across servers:

- a single database sequence becomes a bottleneck and single point of failure
- **range allocation** fixes this: each app server reserves a block of IDs, such as 1,000,000 at a time, from a coordinator such as ZooKeeper or a database row, then hands them out locally. A crashed server wastes the rest of its block, which is acceptable
- a **Snowflake-style** ID combines timestamp, machine ID and sequence bits, generated locally with no coordination

Sequential IDs produce guessable codes. Shuffle them by encrypting or permuting the number before encoding, so consecutive IDs don't map to consecutive codes.

**3. Pre-generated keys.** A key generation service creates random unique codes ahead of time and stores them in a pool; servers take batches. No collision checks on the hot path, at the cost of another service.

Range allocation with a permutation step is a strong interview answer: no collisions, no coordination per request, and non-sequential codes.

**Custom aliases** go through a uniqueness check; conflicts return 409 Conflict.

## Deep dive: fast redirects

Reads dominate, so cache aggressively. Put code → long URL in Redis with cache-aside. Link popularity is highly skewed, so even a modest cache holds the hot set and serves most redirects. With a 90%+ hit ratio, the database sees a few hundred reads per second. A CDN or edge cache can serve redirects for the hottest links too.

**301 or 302?** A 301 (permanent) lets browsers cache the redirect, cutting load, but later clicks never reach your servers, so analytics miss them. A 302 (temporary) sends every click through you. Choose 302 if analytics matter, 301 if they don't.

## Deep dive: analytics and expiry

Don't write analytics synchronously in the redirect path. Publish a click event (code, timestamp, country, referrer) to a queue or log such as Kafka, and let consumers aggregate counts into an analytics store. The redirect stays fast even if analytics lag.

For expiry, check \`expires_at\` on read and return 410 Gone for expired links; a background job purges expired rows later. Cache TTLs must not outlive a link's expiry.

## Scaling and reliability

- App servers are stateless behind a redundant load balancer
- Shard the URL table by hash of the code if one database isn't enough
- Replicate the database and cache across availability zones
- Rate limit link creation per user or IP to stop spam and abuse, and check long URLs against malware lists

## How interviewers test this

Expect the full design with special attention to ID generation, cache strategy and 301 versus 302. Show the estimate that justifies 7 Base62 characters, compare hashing with counters, and keep analytics off the critical path.`,
    [SDP, AWESOME_SCALABILITY],
    {
      check: { question: "Why might a URL shortener return 302 instead of 301?", options: ["So every click reaches the server and can be counted for analytics", "302 is faster", "301 is not allowed for redirects", "302 enables HTTPS"], answer: 0, explanation: "Browsers cache 301s, so repeat clicks bypass the server." },
      takeaways: ["7 Base62 characters give about 3.5 trillion codes.", "Range-allocated counters with Base62 avoid collisions and per-request coordination; permute IDs to avoid guessable codes.", "Cache code-to-URL mappings; popularity is highly skewed.", "Keep analytics asynchronous through a queue."],
      traps: [
        { question: "Use one auto-increment column for all IDs.", trap: "A single sequence is a bottleneck and produces guessable codes.", solution: "Allocate ID ranges per server and permute before encoding." },
        { question: "Truncate an MD5 hash to 7 characters and you're done.", trap: "Truncated hashes collide.", solution: "Check for collisions and retry, or use a counter-based scheme." },
      ],
    }),

  sdLesson("design-news-feed", "Design a News Feed",
    "Fan-out on write vs read, the celebrity problem, feed storage, ranking and pagination.", 30,
`A news feed shows each user recent posts from people they follow, like the home timelines of Twitter, Instagram or LinkedIn. The central challenge is fan-out: one post must appear in the feeds of every follower, and some users have millions. This walkthrough covers requirements, the fan-out-on-write versus fan-out-on-read decision, the hybrid approach used in practice, storage, ranking and pagination.

## Step 1: requirements

**Functional:**

- Users publish posts (text, images)
- Users follow other users
- Users see a feed of posts from people they follow, newest or ranked first, with infinite scroll

**Non-functional:**

- Feed loads in under about 200 ms
- High availability; slightly stale feeds are acceptable (eventual consistency)
- Read-heavy: feeds are viewed far more often than posts are created

## Step 2: estimates

Assume 300 million daily active users, each opening the feed 10 times and posting 0.5 times per day, with an average of 200 followed accounts.

- **Feed reads**: 3 × 10⁹ per day ≈ 30,000 per second, perhaps 100,000 at peak
- **Posts**: 1.5 × 10⁸ per day ≈ 1,500 per second
- **Fan-out writes**, if every post is copied to every follower's feed: 1,500 × average followers (say 200) = 300,000 feed insertions per second

That last number drives the design.

## Step 3: high-level design

~~~text
Post service -> Posts DB (+ media in object storage)
            \\-> Fan-out service -> Feed cache (per-user lists in Redis)
Feed service <- reads feed cache, hydrates post details from post cache
Social graph service: who follows whom
~~~

APIs: \`POST /posts\`, \`POST /users/{id}/follow\`, \`GET /feed?cursor=...\`.

## Fan-out on write (push)

When a user posts, the fan-out service looks up their followers and inserts the post ID into each follower's precomputed feed list, typically a Redis list or sorted set capped at a few hundred entries.

- **Pros**: feed reads are instant, since the feed is already assembled
- **Cons**: writes are expensive, and a user with 50 million followers triggers 50 million inserts, delaying delivery and wasting work for inactive followers

## Fan-out on read (pull)

The feed is built when requested: fetch the list of followed accounts, get each one's recent posts, merge and sort.

- **Pros**: posting is cheap; no wasted work for inactive users
- **Cons**: reads are slow and expensive, since a user following 500 accounts needs 500 lookups and a merge on every feed load

## The hybrid approach

Production systems combine both:

- **Ordinary users** (most accounts): fan out on write to their followers' feed caches
- **Celebrities** (accounts above a follower threshold, such as 100,000): don't fan out. At read time, the feed service merges the precomputed feed with recent posts from the celebrities the user follows
- **Inactive users**: skip pushing to users who haven't logged in recently; build their feed on demand when they return

This bounds write amplification while keeping reads fast. Twitter publicly described a design along these lines.

## Storage

- **Posts**: a sharded store keyed by post ID, with media in object storage behind a CDN. Post IDs from a Snowflake-style generator are roughly time-ordered, which helps sorting
- **Social graph**: follower and following lists, sharded by user ID, often in a wide-column or graph store
- **Feed cache**: per-user lists of post IDs only, not full posts, to keep memory small. The feed service **hydrates** IDs into full posts using a post cache, so edits and deletions appear everywhere

## Ranking

A chronological feed sorts by time. Ranked feeds score candidates by predicted engagement: author affinity, recency, post type and interaction counts. A common pipeline gathers a few hundred candidates from the feed cache and celebrity posts, scores them with a model, and returns the top results. Ranking adds latency, so scores are often precomputed or cached.

## Pagination

Use **cursor-based pagination** with the last seen post ID or timestamp: \`GET /feed?cursor=1724400000123&limit=20\`. Offset pagination breaks in a feed, because new posts shift every page and cause duplicates.

## Other details

- **New follows**: backfill a few recent posts from the followed account into the follower's feed
- **Deletes**: remove post IDs lazily; hydration skips deleted posts
- **Fan-out queue**: run fan-out through a message queue so posting returns immediately and workers scale independently

## How interviewers test this

Expect "fan-out on write or read?" and "how do you handle celebrities?" Quantify write amplification, propose the hybrid model, store post IDs in per-user feed caches, hydrate posts at read time, and paginate with cursors.`,
    [SDP, AWESOME_SCALABILITY, AWS_BUILDERS],
    {
      check: { question: "How do hybrid feed designs handle accounts with millions of followers?", options: ["They skip fan-out for them and merge their posts at read time", "They fan out to every follower synchronously", "They block celebrity posts", "They store feeds only in SQL joins"], answer: 0, explanation: "Pulling celebrity posts at read time avoids millions of writes per post." },
      takeaways: ["Fan-out on write makes reads fast but amplifies writes; fan-out on read does the opposite.", "Use a hybrid: push for ordinary users, pull for celebrities, lazy builds for inactive users.", "Store post IDs in feed caches and hydrate full posts at read time.", "Paginate feeds with cursors, not offsets."],
      traps: [
        { question: "Fan out every post to every follower.", trap: "A celebrity post triggers tens of millions of writes.", solution: "Exclude high-follower accounts from fan-out and merge them on read." },
        { question: "Store full post objects in each follower's feed list.", trap: "Huge memory use, and edits must update millions of copies.", solution: "Store IDs and hydrate from a post cache." },
      ],
    }),

  sdLesson("design-chat-system", "Design a Chat System",
    "Real-time messaging with WebSockets, message routing, storage, ordering, presence and offline delivery.", 30,
`A chat system such as WhatsApp, Slack or Messenger delivers messages between users in near real time, keeps history, shows who's online, and delivers messages to users who were offline. The challenges are maintaining millions of persistent connections, routing each message to the right server, and storing a huge, write-heavy message history. This walkthrough covers requirements, connections, routing, storage, ordering, presence and group chat.

## Step 1: requirements

**Functional:**

- One-to-one and small group chats (say up to a few hundred members)
- Message history, synced across a user's devices
- Online presence and last seen
- Delivery and read receipts
- Push notifications for offline users

**Non-functional:**

- Low delivery latency, under a few hundred milliseconds
- No lost messages; delivery at least once with deduplication
- Per-conversation ordering
- High availability at massive scale

## Step 2: estimates

Assume 500 million daily active users sending 40 messages each per day.

- **Messages**: 2 × 10¹⁰ per day ≈ 200,000 per second on average, perhaps 1 million at peak
- **Storage**: at about 200 bytes per message, 2 × 10¹⁰ × 200 = 4 TB per day, roughly 1.5 PB per year before replication
- **Connections**: perhaps 100 million concurrent connections at peak. If one server holds about 100,000 to a few hundred thousand idle connections, that's hundreds to a thousand chat servers

The write volume and connection count shape the design.

## Step 3: connections

HTTP is request-response, so the server can't push messages. Options:

- **Polling**: the client asks every few seconds. Wasteful and slow
- **Long polling**: the server holds the request until a message arrives. Better, but connections constantly reconnect
- **WebSockets**: one persistent, full-duplex connection per device. The standard choice for chat

Clients connect through a load balancer to a fleet of **chat servers** that hold WebSocket connections. Chat servers are stateful in one sense: each knows which users are connected to it. Everything else, such as history and user data, lives in shared stores.

## Step 4: routing a message

When Asha sends a message to Ravi:

1. Asha's device sends the message over its WebSocket to chat server A, with a client-generated message ID for deduplication
2. Server A assigns a sequence number for the conversation, persists the message, and acknowledges to Asha (one tick)
3. Server A looks up which server holds Ravi's connection, in a **session registry** such as Redis mapping user ID to server ID
4. If Ravi is online on server B, A forwards the message to B, often through a message bus or direct RPC, and B pushes it down Ravi's WebSocket
5. Ravi's device acknowledges receipt (two ticks); a read event later updates the read receipt
6. If Ravi is offline, the message waits in storage, and a push notification goes through APNs or FCM

~~~text
Asha -> Chat server A -> Message store
                     \\-> Session registry: Ravi -> server B
                     \\-> Chat server B -> Ravi    (or push notification if offline)
~~~

## Storage

Chat history is write-heavy, append-only and read by conversation, usually the most recent messages. A wide-column store such as Cassandra or HBase fits well: partition by conversation ID and cluster by message sequence or timestamp, so loading recent messages is one sequential read. Facebook Messenger used HBase, and Discord moved from Cassandra to ScyllaDB for this workload.

Store media in object storage behind a CDN, sending only the URL in the message.

## Ordering

Clocks across devices disagree, so client timestamps can't order messages reliably. Assign a monotonically increasing **sequence number per conversation** on the server when the message is persisted. Clients display messages by sequence number and detect gaps, requesting missing messages after reconnecting. Global ordering across all conversations isn't needed.

## Offline sync and multiple devices

Each device remembers the last sequence number it has seen per conversation. On reconnect, it asks for everything newer. This handles offline periods, multiple devices and flaky networks with one mechanism. Deduplicate by client message ID, since retries after a lost acknowledgement resend the same message.

## Presence

Presence uses heartbeats: connected clients send a heartbeat every few seconds; if heartbeats stop for, say, 30 seconds, the user is marked offline and last seen is updated. Broadcasting every status change to every contact is expensive for users with many contacts, so systems often fetch presence only for conversations currently on screen.

## Group chat

For small groups, the server fans out each message to all members' connections, looking up each member's server in the registry. Message storage stays per conversation, so history is stored once. Huge channels, as in Slack or Discord, fan out differently, with clients pulling recent messages rather than receiving individual pushes for every member.

## End-to-end encryption

Apps such as WhatsApp and Signal encrypt messages on the sender's device so servers can't read them, using the Signal protocol. The server then routes and stores ciphertext only, which limits server-side features such as search.

## How interviewers test this

Expect connection handling (WebSockets), message routing across servers, storage choice, ordering, and offline delivery. Use a session registry, per-conversation sequence numbers, a wide-column message store, client message IDs for deduplication, and push notifications for offline users.`,
    [SDP, HPBN, AWESOME_SCALABILITY],
    {
      check: { question: "How should a chat system order messages within a conversation?", options: ["With a server-assigned sequence number per conversation", "By each sender's device clock", "Alphabetically", "By message size"], answer: 0, explanation: "Device clocks drift; a per-conversation sequence gives a consistent order and detects gaps." },
      takeaways: ["Use WebSockets for real-time delivery and a session registry to find each user's server.", "Store messages in a wide-column store partitioned by conversation.", "Order with per-conversation sequence numbers; sync devices by last-seen sequence.", "Deduplicate by client message ID and notify offline users via push."],
      traps: [
        { question: "Order messages by the sender's timestamp.", trap: "Device clocks disagree, so order breaks.", solution: "Assign server-side sequence numbers per conversation." },
        { question: "Have clients poll for new messages every second.", trap: "Huge wasted load and higher latency.", solution: "Use persistent WebSocket connections." },
      ],
    }),

  sdLesson("design-notification-system", "Design a Notification System",
    "Send push, SMS and email reliably at scale: queues, templates, preferences, retries and deduplication.", 30,
`A notification system delivers messages to users across channels: mobile push, SMS, email and in-app alerts. Almost every product needs one: order updates, login alerts, reminders, marketing campaigns. The challenges are integrating unreliable third-party providers, respecting user preferences, avoiding duplicates and absorbing huge bursts. This walkthrough covers requirements, architecture, delivery pipeline, reliability and rate limiting.

## Step 1: requirements

**Functional:**

- Send notifications through push (iOS and Android), SMS and email, plus in-app
- Triggered by other services (transactional) or scheduled campaigns (bulk)
- Respect user preferences and opt-outs per channel and category
- Templates with personalization, such as "Hi Asha, your order has shipped"

**Non-functional:**

- Transactional notifications, such as one-time passwords, delivered within seconds
- No lost notifications, and avoid duplicates
- Handle bursts, such as a campaign to 50 million users
- Track delivery status

## Step 2: estimates

Assume 10 million push, 1 million SMS and 5 million emails per day for transactional traffic, with campaigns that occasionally target tens of millions at once. The average rate is low, around 200 per second, but campaigns create bursts far above that. Third-party providers have their own rate limits and costs, especially SMS.

The design must absorb bursts without slowing time-sensitive messages.

## Step 3: high-level architecture

~~~text
Services / Scheduler -> Notification API -> Validation, preferences, templating
                                              -> Priority queues per channel
                                                   -> Channel workers -> Providers (APNs, FCM, SMS gateway, email service)
                                              -> Notification log (status, dedup)
~~~

**Components:**

- **Notification API**: accepts requests like \`{ userId, type: "order_shipped", data: {...}, idempotencyKey }\`
- **Preference and contact store**: per-user opt-outs, quiet hours, device tokens, phone numbers and emails
- **Template service**: renders localized content per channel
- **Queues**: separate queues per channel and priority, so a huge email campaign can't delay one-time passwords
- **Channel workers**: pull from queues, call providers, record results
- **Notification log**: stores each notification's status for deduplication, retries and analytics

## Step 4: the delivery pipeline

1. A service calls the API with an event and an idempotency key
2. The API validates the request, loads preferences, and drops channels the user has disabled or that fall in quiet hours
3. It renders templates and enqueues one job per channel onto the right priority queue
4. It returns 202 Accepted immediately; delivery is asynchronous
5. Workers dequeue jobs, call the provider, and update the log: sent, delivered, failed

Separating acceptance from delivery lets the API stay fast during bursts while workers drain queues at the rate providers allow.

## Reliability

**Retries**: provider calls fail transiently. Workers retry with exponential backoff and jitter, up to a limit, then move the job to a dead-letter queue for inspection. Some failures are permanent, such as an invalid device token, which should be removed from the user's record rather than retried.

**At-least-once delivery and deduplication**: queues may redeliver a job after a worker crash. Before sending, workers check the notification log for the idempotency key or job ID and skip if already sent. Duplicate SMS messages cost money and annoy users, so this check matters.

**Provider failover**: for critical channels like SMS, integrate two providers and switch when one degrades.

**Persistence**: write each notification to the log before enqueueing, using the outbox pattern, so a crash between the two steps doesn't lose it.

## Rate limiting and user experience

- **Provider limits**: throttle workers to each provider's allowed rate
- **Per-user limits**: cap how many notifications one user gets per hour, and batch low-priority ones into a digest
- **Priorities**: one-time passwords and security alerts jump ahead of marketing
- **Quiet hours and time zones**: schedule campaigns in each user's local time

## Tracking and analytics

Record sent, delivered, opened and clicked events. Providers report delivery through callbacks or webhooks; emails use tracking pixels and link redirects. These events feed dashboards and help prune unengaged users from campaigns.

## Security and compliance

Store contact details securely, honour unsubscribe links (required for marketing email in many jurisdictions), and never include sensitive data such as full card numbers in notification content.

## How interviewers test this

Expect the pipeline design, plus "How do you avoid duplicate notifications?" and "How do you stop a campaign from delaying OTPs?" Use per-channel priority queues, asynchronous workers, preference checks before enqueueing, retries with backoff and dead-letter queues, and idempotency checks against a notification log.`,
    [SDP, AWS_BUILDERS],
    {
      check: { question: "How do you stop a 50-million-email campaign from delaying one-time-password SMS messages?", options: ["Separate queues per channel and priority, with OTPs on a high-priority queue", "Send everything through one queue", "Send OTPs by email instead", "Disable campaigns"], answer: 0, explanation: "Isolating queues keeps bulk traffic from blocking time-critical messages." },
      takeaways: ["Accept requests quickly and deliver asynchronously through queues.", "Use separate queues per channel and priority.", "Retry transient provider failures with backoff; dead-letter persistent failures.", "Deduplicate with idempotency keys and a notification log; respect preferences and quiet hours."],
      traps: [
        { question: "Call the SMS provider directly inside the API request.", trap: "Provider latency and outages hit the caller, and bursts overwhelm the provider.", solution: "Queue the job and let rate-limited workers deliver it." },
        { question: "A worker crashed after sending; the job is redelivered.", trap: "The user receives the SMS twice.", solution: "Check the notification log by idempotency key before sending." },
      ],
    }),
];
