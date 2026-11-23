// Long-form theory for CN modules 6-8 (transport, application, security). Original writing.
import { LessonTheory } from './utils';

const SYSTEMS_APPROACH = { title: "Peterson and Davie, Computer Networks: A Systems Approach (free online)", url: "https://book.systemsapproach.org/", license: "CC BY 4.0" };
const STANFORD_CS144 = { title: "Stanford CS144: Introduction to Computer Networking", url: "https://cs144.github.io/" };
const RFC_9293 = { title: "RFC 9293: Transmission Control Protocol (TCP)", url: "https://www.rfc-editor.org/rfc/rfc9293" };
const RFC_5681 = { title: "RFC 5681: TCP Congestion Control", url: "https://www.rfc-editor.org/rfc/rfc5681" };
const RFC_1034 = { title: "RFC 1034: Domain Names, Concepts and Facilities", url: "https://www.rfc-editor.org/rfc/rfc1034" };
const RFC_9110 = { title: "RFC 9110: HTTP Semantics", url: "https://www.rfc-editor.org/rfc/rfc9110" };
const RFC_8446 = { title: "RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3", url: "https://www.rfc-editor.org/rfc/rfc8446" };
const MDN_HTTP = { title: "MDN Web Docs: HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP", license: "CC BY-SA 2.5" };
const OWASP_TOP10 = { title: "OWASP Top Ten", url: "https://owasp.org/www-project-top-ten/", license: "CC BY-SA 4.0" };
const HPBN = { title: "Ilya Grigorik, High Performance Browser Networking (free online)", url: "https://hpbn.co/" };

export const cnUpperTheory: Record<string, LessonTheory> = {
  "tcp-vs-udp-and-ports": {
    theory: `IP delivers packets to a host, but a host runs many programs at once: a browser, a music app, a chat client. The transport layer delivers data to the right program and decides how much reliability to provide. This lesson explains ports and sockets, compares TCP and UDP in detail, and explains why video calls, games and the newest version of HTTP all chose UDP.

## From hosts to processes

An IP address identifies a machine. A **port number**, a 16-bit value from 0 to 65,535, identifies a process on that machine. Port ranges have conventions:

- **Well-known ports (0 to 1023)**: standard services, such as 80 for HTTP and 443 for HTTPS
- **Registered ports (1024 to 49151)**: applications such as MySQL (3306) and PostgreSQL (5432)
- **Ephemeral ports (49152 to 65535)**: temporary ports the operating system assigns to the client side of a connection

When your browser connects to a server, it uses an ephemeral port on your side and port 443 on the server's side.

## Sockets and the four-tuple

A **socket** is the endpoint a program uses to send and receive data. A TCP connection is identified by four values: source IP, source port, destination IP and destination port. This four-tuple is why one web server listening on port 443 can serve thousands of browsers at once: every connection differs in at least the client's address or port.

## TCP: reliable byte streams

The Transmission Control Protocol (TCP) gives applications a reliable, ordered stream of bytes. It provides:

- **Connection setup**: a three-way handshake before data flows
- **Reliability**: lost segments are detected and retransmitted
- **Ordering**: segments are reassembled in the right order, even if they arrived out of order
- **Flow control**: the sender never overwhelms the receiver's buffer
- **Congestion control**: the sender slows down when the network is overloaded

TCP is a byte stream with no message boundaries. If the sender writes 100 bytes and then 200 bytes, the receiver might read 300 bytes at once or 50 bytes at a time. Applications that need messages must add their own framing, such as HTTP's \`Content-Length\` header.

## UDP: lightweight datagrams

The User Datagram Protocol (UDP) adds only ports and a checksum to IP. There's no connection setup, no acknowledgement, no retransmission, no ordering and no congestion control. Each send is an independent datagram that arrives once, arrives out of order, or doesn't arrive at all. In exchange, UDP has an 8-byte header compared with TCP's 20 or more, and no setup delay.

## Comparing TCP and UDP

| | TCP | UDP |
|---|---|---|
| Connection | Three-way handshake first | None |
| Reliability | Guaranteed delivery, retransmission | Best effort |
| Ordering | In order | None |
| Data model | Byte stream | Separate messages (datagrams) |
| Header | 20 to 60 bytes | 8 bytes |
| Congestion control | Built in | Up to the application |
| Typical uses | Web, email, file transfer, SSH | DNS, video calls, games, streaming, DHCP |

## Why real-time apps choose UDP

In a video call, a voice packet that arrives 300 ms late is useless: the conversation has moved on. TCP would hold back every later packet until the lost one is retransmitted, a problem called **head-of-line blocking**, so one lost packet freezes the stream. Over UDP, the application skips the lost packet, conceals the gap, and keeps playing. Games send position updates many times per second for the same reason: the newest update matters, and old ones aren't worth waiting for.

## QUIC: reliability built on UDP

QUIC is a newer transport protocol that runs over UDP and rebuilds reliability, congestion control and encryption on top. It carries multiple independent streams, so a lost packet delays only its own stream, and it combines connection and encryption setup into fewer round trips. HTTP/3 runs over QUIC. QUIC uses UDP because routers and firewalls everywhere already pass UDP, while deploying a brand-new protocol in the IP header would take decades.

## Ports to know

Interviews often expect these: 20 and 21 (FTP), 22 (SSH), 23 (Telnet), 25 (SMTP), 53 (DNS), 67 and 68 (DHCP), 80 (HTTP), 110 (POP3), 143 (IMAP) and 443 (HTTPS).

## How interviewers test this

Expect "TCP vs UDP" and "Which protocol would you use for a video call, a file download or DNS, and why?" Use the comparison table, then justify each choice: file downloads need every byte (TCP), DNS queries are small and quick to retry (UDP), and real-time media can't wait for retransmissions (UDP).`,
    sources: [RFC_9293, SYSTEMS_APPROACH, HPBN, STANFORD_CS144]
  },

  "tcp-connection-management": {
    theory: `TCP turns an unreliable network into a reliable conversation. To do that, it sets up shared state at both ends before data flows, numbers every byte it sends, acknowledges what arrives, and tears the connection down carefully at the end. This lesson explains the three-way handshake, sequence numbers and acknowledgements, retransmission, the four-way close with its TIME_WAIT state, and the SYN flood attack.

## The three-way handshake

Before data flows, client and server exchange three segments:

1. **SYN**: the client sends a segment with the SYN flag and a randomly chosen initial sequence number, x
2. **SYN-ACK**: the server replies with its own SYN and initial sequence number, y, and acknowledges the client's with ack = x + 1
3. **ACK**: the client acknowledges the server's number with ack = y + 1

Both sides now know the other's starting sequence number and have agreed to communicate. The SYN consumes one sequence number even though it carries no data, which is why the acknowledgement is x + 1.

## Why three messages

Each side must confirm that the other received its initial sequence number. With only two messages, the server would never learn whether its SYN-ACK arrived. The handshake also protects against old, delayed duplicate SYN segments from earlier connections, which would otherwise open phantom connections. Initial sequence numbers are random so that attackers can't guess them and inject forged segments into a connection.

## Sequence numbers and acknowledgements

TCP numbers every byte, not every segment. A segment carrying bytes 1,001 to 2,000 has sequence number 1,001. Acknowledgements are **cumulative**: an ACK of 2,001 means "I've received every byte up to 2,000; send 2,001 next". If a segment in the middle is lost, the receiver keeps acknowledging the last byte it received in order, until the gap is filled.

## Detecting and recovering from loss

TCP detects loss in two ways:

- **Retransmission timeout (RTO)**: if no acknowledgement arrives in time, the sender resends. TCP estimates the round-trip time continuously, smoothing measurements and tracking their variation, so the timeout adapts to the path
- **Fast retransmit**: when a segment is lost but later ones arrive, the receiver sends duplicate ACKs for the last in-order byte. Three duplicate ACKs tell the sender a segment was almost certainly lost, so it resends immediately without waiting for the timeout

With the selective acknowledgement (SACK) option, the receiver also reports which blocks beyond the gap arrived, so the sender resends only what's missing.

## The four-way close

TCP is full duplex, so each direction closes separately:

1. The side that finishes first sends FIN, meaning "I have no more data to send"
2. The other side acknowledges it, and may keep sending its own data
3. When the second side finishes, it sends its own FIN
4. The first side acknowledges that FIN

The two middle steps can be combined into a single FIN-ACK when both sides finish at once, giving a three-segment close.

## TIME_WAIT

After sending the final ACK, the side that closed first waits in the TIME_WAIT state for twice the maximum segment lifetime, commonly 60 seconds in total on Linux. TIME_WAIT has two purposes: if the final ACK is lost, the other side resends its FIN, and the waiting side can acknowledge it again; and old segments from this connection are given time to disappear from the network, so they can't be mistaken for segments of a new connection on the same ports.

Busy servers that close many connections can accumulate thousands of TIME_WAIT entries. That's normal, and it's one reason HTTP keeps connections open for multiple requests.

## Connection states

A TCP endpoint moves through states such as LISTEN, SYN_SENT, SYN_RECEIVED, ESTABLISHED, FIN_WAIT, CLOSE_WAIT, TIME_WAIT and CLOSED. Running \`netstat -an\` or \`ss -tan\` shows every connection's state. Many connections stuck in CLOSE_WAIT usually mean an application bug: the remote side closed, but the local program never closed its socket.

## SYN floods

A SYN flood exploits the handshake. An attacker sends huge numbers of SYN segments, often from forged source addresses, and never completes the handshake. The server allocates state for each half-open connection until its backlog is full, and then it can't accept legitimate clients.

**SYN cookies** defend against this. Instead of storing state when a SYN arrives, the server encodes the connection's details into its initial sequence number. A legitimate client's final ACK carries that number back, letting the server rebuild the state. Attackers who never send the final ACK cost the server nothing.

## How interviewers test this

Expect "Explain the TCP three-way handshake", "Why three and not two?", "What is TIME_WAIT for?" and "What is a SYN flood?" Draw the handshake with sequence numbers, give both reasons for TIME_WAIT, and explain SYN cookies as the defence.`,
    sources: [RFC_9293, SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "tcp-flow-and-congestion-control": {
    theory: `A TCP sender has to answer one question continuously: how much data can I have in flight right now? Two limits decide. Flow control protects the receiver from being overwhelmed, and congestion control protects the network itself. This lesson explains the receive window, slow start, congestion avoidance, how TCP reacts to loss, the throughput limit set by window and round-trip time, and the modern algorithms CUBIC and BBR.

## Two different problems

Flow control and congestion control are often confused, and they solve different problems:

| | Flow control | Congestion control |
|---|---|---|
| Protects | The receiver's buffer | The routers and links in between |
| Signal | The receive window the receiver advertises | Loss or delay that the sender infers |
| Variable | rwnd | cwnd (congestion window) |

The sender may have at most min(rwnd, cwnd) bytes unacknowledged at any time.

## Flow control with the receive window

Every TCP acknowledgement carries the receiver's **receive window**: how much free buffer space it has. If an application reads slowly, its buffer fills, the advertised window shrinks, and the sender slows down. If the window reaches zero, the sender stops and periodically probes until the receiver announces space again.

## The throughput limit

Because at most one window of data can be in flight per round trip, maximum throughput is roughly:

~~~text
throughput ≈ window / RTT
~~~

The original TCP header limits the window to 65,535 bytes. With a 100 ms round trip, that caps throughput at 65,535 × 8 / 0.1, about 5.2 Mbit/s, however fast the link is. The **window scale** option, negotiated during the handshake, multiplies the window to allow up to about 1 GB, so modern TCP can fill fast, long-distance links.

## Why congestion control exists

In 1986, the internet suffered **congestion collapse**: throughput on some links fell to a thousandth of their capacity. Senders retransmitted lost packets aggressively, which added more traffic to overloaded routers, which dropped even more packets. Van Jacobson's congestion control algorithms, added to TCP in 1988, fixed this by making senders back off when they detect congestion. Every TCP connection since then plays by these rules.

## Slow start

A new connection doesn't know how much capacity the path has, so it starts small and probes. The congestion window starts at a few segments, about 10 in modern systems, and grows by one segment for every acknowledgement received. Since a full window of acknowledgements arrives per round trip, cwnd doubles every RTT. "Slow start" grows exponentially; the name only means it starts small.

## Congestion avoidance

Once cwnd reaches the **slow start threshold** (ssthresh), TCP switches to congestion avoidance and grows cwnd by about one segment per round trip. Linear growth probes for more capacity cautiously, because the sender is now near the level where congestion occurred before.

## Reacting to loss

TCP treats packet loss as a signal of congestion and reacts according to how it was detected:

- **Timeout**: a serious signal that nothing is getting through. TCP sets ssthresh to half the current cwnd, resets cwnd to one segment, and starts slow start again
- **Three duplicate ACKs**: later packets are still arriving, so the congestion is mild. TCP Reno halves cwnd, sets ssthresh to the new value, and continues with linear growth, skipping slow start (fast recovery)

Growing linearly and halving on loss is called **AIMD** (additive increase, multiplicative decrease). It produces TCP's characteristic sawtooth pattern of cwnd over time, and it's what lets many connections share a link fairly.

## A worked trace

With ssthresh at 16 segments and cwnd starting at 1: cwnd grows 1, 2, 4, 8, 16 over five round trips (slow start), then 17, 18, 19, 20 (congestion avoidance). A timeout at 20 sets ssthresh to 10 and cwnd to 1, and slow start begins again. If three duplicate ACKs had signalled the loss instead, Reno would set cwnd and ssthresh to 10 and continue linearly from there.

## CUBIC and BBR

Classic Reno grows too slowly on links with high bandwidth and long delays. **CUBIC**, the default in Linux, Windows and macOS, grows cwnd along a cubic curve based on the time since the last loss, recovering capacity much faster on fast links. Google's **BBR** takes a different approach: instead of waiting for loss, it measures the path's bottleneck bandwidth and minimum round-trip time, and paces sending to match them. That keeps queues short, which reduces latency and avoids bufferbloat.

## How interviewers test this

Expect "Flow control vs congestion control", a cwnd trace question, and the window / RTT throughput calculation. For the trace, mark where slow start ends at ssthresh, and apply the correct reaction for a timeout versus three duplicate ACKs. Mention CUBIC or BBR to show you know what systems use today.`,
    sources: [RFC_5681, RFC_9293, SYSTEMS_APPROACH, HPBN]
  },

  "dns": {
    theory: `People remember names like \`www.iitm.ac.in\`; networks route by IP addresses. The Domain Name System (DNS) translates between them, and it handles billions of lookups a day without any single server knowing every name. This lesson explains DNS's hierarchy, how a lookup is resolved step by step, the common record types, caching and time-to-live, and the security problems DNS faces.

## Why DNS is distributed

In the early internet, every host downloaded one file, \`HOSTS.TXT\`, listing every name and address. As the network grew, that file became impossible to keep current. DNS, introduced in 1983, replaced it with a distributed, hierarchical database. Each organization runs the part of the namespace it owns, and no single server needs to know everything.

## The hierarchy

DNS names are read from right to left, from general to specific:

- **Root**: the top of the tree, served by 13 named root server identities, each run as many copies around the world using anycast
- **Top-level domains (TLDs)**: \`.com\`, \`.org\`, \`.in\`, \`.edu\` and hundreds more, each run by a registry
- **Second-level domains**: \`google.com\` or \`ac.in\`, delegated to an organization
- **Subdomains**: \`www.google.com\` or \`mail.iitm.ac.in\`, managed by that organization

Each level delegates authority for the levels below it to name servers, called **authoritative servers** for their part of the tree.

## Resolving a name

When you type \`www.example.com\`, the lookup proceeds through several caches and servers:

1. The browser checks its own cache, then asks the operating system, which checks its cache and the local hosts file
2. The OS sends the query to a **recursive resolver**, usually run by your ISP or a public service such as 1.1.1.1 or 8.8.8.8
3. If the resolver hasn't cached the answer, it asks a root server, which replies with the name servers for \`.com\`
4. The resolver asks a \`.com\` TLD server, which replies with the name servers for \`example.com\`
5. The resolver asks \`example.com\`'s authoritative server, which returns the address
6. The resolver caches the answer and returns it to your machine

## Recursive and iterative queries

The client's query to the resolver is **recursive**: "find the full answer for me". The resolver's queries to the root, TLD and authoritative servers are **iterative**: each server answers with the best referral it has, "I don't know, but ask these servers", and the resolver follows the referrals itself. Root and TLD servers only give referrals, which keeps their load manageable.

## Record types

DNS stores several kinds of records:

| Type | Maps | Example use |
|---|---|---|
| A | Name to IPv4 address | \`example.com\` to \`93.184.215.14\` |
| AAAA | Name to IPv6 address | The same name over IPv6 |
| CNAME | Alias to a canonical name | \`www.shop.com\` pointing at a CDN hostname |
| MX | Domain to mail servers, with priorities | Where to deliver email for a domain |
| NS | Domain to its authoritative name servers | Delegation |
| TXT | Arbitrary text | Email authentication (SPF, DKIM), domain verification |
| PTR | Address to name (reverse lookup) | Logging and mail-server checks |

## Caching and TTL

Every record carries a **time to live** (TTL) in seconds, chosen by the domain's owner. Resolvers cache answers for that long, which is why DNS can serve the whole internet: most lookups are answered from a nearby cache without touching the root or TLD servers.

TTL is a trade-off. A long TTL, such as a day, reduces lookups but means a change takes up to a day to reach everyone. Before moving a website to new servers, administrators lower the TTL to a few minutes, wait for old caches to expire, then make the change.

## DNS over UDP and TCP

Most DNS queries and responses are small, so DNS uses UDP on port 53 for speed. Responses too large for a single UDP datagram, and zone transfers between servers, use TCP. Newer options encrypt DNS to keep lookups private from anyone watching the network: DNS over HTTPS (DoH) and DNS over TLS (DoT).

## Security problems

Classic DNS has no authentication, which allows attacks:

- **Cache poisoning**: an attacker tricks a resolver into caching a forged answer, sending users to a malicious server. Resolvers defend with random query IDs and random source ports, and DNSSEC lets resolvers verify that answers are signed by the real owner
- **DNS amplification**: attackers send small queries with a forged source address, and servers send large responses to the victim, flooding it

## How interviewers test this

Expect "What happens during a DNS lookup?", "Recursive vs iterative queries" and "What's the difference between A, CNAME and MX records?" Walk through the resolution steps including caches, explain who does recursive and iterative work, and give one example per record type.`,
    sources: [RFC_1034, SYSTEMS_APPROACH, HPBN]
  },

  "http-and-https": {
    theory: `The Hypertext Transfer Protocol (HTTP) is the language of the web: browsers, mobile apps and backend services all exchange data with it. HTTP is a request-response protocol with a readable text structure that has evolved through three major versions to cut latency. This lesson explains requests and responses, methods and their properties, status codes, statelessness and cookies, and how HTTP/1.1, HTTP/2 and HTTP/3 differ.

## Requests and responses

A client sends a request, and the server sends back a response. A request has a method, a path, a version, headers and an optional body:

~~~http
GET /api/courses?level=beginner HTTP/1.1
Host: studyhub.example
Accept: application/json
Cookie: session_id=abc123
~~~

The response has a status line, headers, a blank line and a body:

~~~http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

{"courses": [...]}
~~~

Headers carry metadata: what format the client accepts, how long the response may be cached, and which cookies apply.

## Methods

HTTP methods state the intent of a request:

| Method | Purpose | Safe | Idempotent |
|---|---|---|---|
| GET | Read a resource | Yes | Yes |
| POST | Create a resource or submit data | No | No |
| PUT | Replace a resource at a known URL | No | Yes |
| PATCH | Change part of a resource | No | Not necessarily |
| DELETE | Remove a resource | No | Yes |
| HEAD | GET without the body | Yes | Yes |
| OPTIONS | Ask which methods are allowed (used for CORS checks) | Yes | Yes |

**Safe** means the request doesn't change server state. **Idempotent** means sending it several times has the same effect as sending it once. Idempotency matters when networks fail: a client that times out can safely retry a PUT or DELETE, but retrying a POST might create two orders or charge a card twice. Payment APIs solve this with idempotency keys, a unique ID per request that the server uses to recognize retries.

## Status codes

The first digit of a status code gives its class:

- **1xx informational**: 101 Switching Protocols, used to upgrade to WebSockets
- **2xx success**: 200 OK, 201 Created, 204 No Content
- **3xx redirection**: 301 Moved Permanently, 302 Found, 304 Not Modified (use your cached copy)
- **4xx client error**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests
- **5xx server error**: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout

401 and 403 are often confused. 401 means the server doesn't know who you are, so authenticate. 403 means it knows who you are, and you're not allowed.

## Statelessness and cookies

HTTP is **stateless**: each request is independent, and the server doesn't remember previous ones. Statelessness makes servers easier to scale, since any server behind a load balancer can handle any request. But applications need state, such as who's logged in. **Cookies** provide it: the server sends a \`Set-Cookie\` header, and the browser returns the cookie on every later request to that site.

Cookie attributes control security:

- **HttpOnly**: JavaScript can't read the cookie, which limits damage from cross-site scripting
- **Secure**: the cookie is sent only over HTTPS
- **SameSite**: limits sending the cookie on cross-site requests, which defends against cross-site request forgery

## HTTP/1.1

HTTP/1.0 opened a new TCP connection for every request, paying a handshake each time. HTTP/1.1 (1997) kept connections open for multiple requests (persistent connections) and required the \`Host\` header, which lets one IP address serve many websites. Responses on one connection still come back in order, so a slow response blocks those behind it. Browsers worked around this by opening about six connections per site.

## HTTP/2

HTTP/2 (2015) uses a binary format and **multiplexes** many requests as independent streams over a single TCP connection, so a slow response no longer blocks others at the HTTP level. It also compresses headers with HPACK, which matters because pages send dozens of requests with nearly identical headers. One problem remains: TCP itself delivers bytes in order, so a single lost packet stalls every stream on the connection.

## HTTP/3

HTTP/3 (2022) runs over QUIC instead of TCP. QUIC handles streams independently, so a lost packet delays only its own stream. It also combines connection setup and encryption into one round trip, or zero for repeat visits. HTTP/3 is widely supported by browsers and large sites, and it falls back to HTTP/2 where UDP is blocked.

## HTTPS

HTTPS is HTTP sent over TLS, which encrypts the traffic, protects it from tampering and verifies the server's identity with a certificate. The TLS lesson in the security module explains how.

## How interviewers test this

Expect "GET vs POST", "PUT vs POST", "401 vs 403", "What does stateless mean?" and "What's new in HTTP/2 and HTTP/3?" Explain idempotency with a retry example, and describe each version as solving the head-of-line blocking left by the previous one.`,
    sources: [RFC_9110, MDN_HTTP, HPBN]
  },

  "email-ftp-websockets": {
    theory: `Beyond the web, several application protocols do specific jobs: sending and retrieving email, transferring files, opening remote shells, and keeping a live two-way connection between a browser and a server. This lesson explains how email moves with SMTP and is read with POP3 or IMAP, how FTP's two-connection design works and why SFTP replaced it, and how WebSockets let servers push data to browsers.

## How email travels

Sending an email from a Gmail account to a college address involves several steps:

1. Your mail client submits the message to your provider's outgoing server using SMTP, usually on port 587 with authentication
2. That server looks up the recipient domain's MX records in DNS to find its mail servers
3. It delivers the message to the recipient's server using SMTP on port 25
4. The recipient's mail client later retrieves the message using IMAP or POP3

SMTP pushes mail between servers. Retrieval is a separate problem with separate protocols.

## POP3 and IMAP

POP3 and IMAP both let a client read mail stored on a server, and they make different assumptions:

| | POP3 | IMAP |
|---|---|---|
| Model | Download, then usually delete from the server | Mail stays on the server |
| Devices | Suits one device | Keeps phone, laptop and web in sync |
| Folders and read status | Stored locally | Stored on the server |
| Ports | 110, or 995 with TLS | 143, or 993 with TLS |

IMAP dominates today because people read mail on several devices, and they expect read status and folders to match everywhere.

## Email authentication

SMTP originally let anyone claim any sender address, which made spoofing and phishing trivial. Three DNS-based mechanisms now verify senders:

- **SPF**: a TXT record listing which servers may send mail for a domain
- **DKIM**: the sending server signs messages, and the receiver checks the signature against a public key in DNS
- **DMARC**: the domain's policy for what receivers should do when SPF or DKIM fails, plus reporting

Large providers now reject or flag mail that fails these checks.

## FTP's two connections

The File Transfer Protocol (FTP) uses two separate TCP connections. The **control connection** on port 21 carries commands such as listing a directory or requesting a file. A separate **data connection** carries the actual file. Keeping control out of band lets the client issue commands while transfers run.

In **active mode**, the server opens the data connection back to the client, which fails when the client is behind NAT or a firewall. In **passive mode**, the client opens both connections, which works through NAT and is the common default today.

## Why SFTP replaced FTP

Plain FTP sends usernames, passwords and files unencrypted, so anyone on the network path can read them. Two secure options replaced it:

- **SFTP**: file transfer over SSH, using one encrypted connection on port 22
- **FTPS**: FTP wrapped in TLS, which keeps FTP's two-connection design

Most systems use SFTP, often through tools such as \`scp\`, \`sftp\` or \`rsync\` over SSH.

## SSH

SSH (Secure Shell), on port 22, gives you an encrypted remote terminal, file transfer and port forwarding. It authenticates servers by their host keys, warning you if a server's key changes, and authenticates users by password or, better, by key pairs. It replaced Telnet (port 23), which sent everything, including passwords, as plain text.

## WebSockets

HTTP is request-response: the server can only reply to something the client asked. Applications such as chat, live dashboards, multiplayer games and collaborative editors need the server to push data whenever something happens.

A WebSocket connection starts as an ordinary HTTP request with an \`Upgrade: websocket\` header. The server replies 101 Switching Protocols, and the same TCP connection becomes a persistent, full-duplex channel. Either side can send messages at any time, with a small framing overhead per message and no repeated HTTP headers.

## Alternatives to WebSockets

Not every real-time feature needs a WebSocket:

- **Server-Sent Events**: a one-way stream from server to browser over ordinary HTTP, a good fit for notifications and live feeds, with automatic reconnection
- **Long polling**: the client sends a request that the server holds open until data is available, then the client immediately sends another; it works everywhere, with more overhead

Choose WebSockets when both sides send frequently, Server-Sent Events when only the server pushes, and long polling when compatibility matters most.

## How interviewers test this

Expect "SMTP vs POP3 vs IMAP", "Why does FTP use two connections?" and "How do WebSockets differ from HTTP?" Describe SMTP as push and the others as retrieval, explain FTP's out-of-band control and why SFTP replaced it, and describe the WebSocket upgrade and full-duplex channel.`,
    sources: [SYSTEMS_APPROACH, MDN_HTTP, HPBN]
  },

  "what-happens-when-you-type-a-url": {
    theory: `"What happens when you type a URL into your browser and press Enter?" is one of the most common interview questions in software engineering. It tests whether you can connect everything in the networking course into one story. This lesson walks through the full journey for \`https://www.example.com\`, layer by layer, and explains how to adapt the answer's depth to what the interviewer wants.

## 1. Parsing the URL

The browser splits the URL into parts: the scheme (\`https\`), the host (\`www.example.com\`), the port (443, the default for HTTPS), and the path (\`/\`). If you typed text that isn't a URL, the browser treats it as a search query instead. Browsers also check an HSTS list of sites that must always use HTTPS, and upgrade the request if needed.

## 2. Resolving the name

The browser needs the server's IP address. It checks its own DNS cache, then asks the operating system, which checks its cache and the hosts file. If neither has the answer, the OS asks the configured recursive resolver. On a cache miss, the resolver queries a root server, then the \`.com\` TLD servers, then \`example.com\`'s authoritative servers, caches the answer for its TTL, and returns the address.

## 3. Reaching the gateway

The IP address belongs to a server on another network, so the laptop must send the packet to its default gateway. If it doesn't have the gateway's MAC address cached, it broadcasts an ARP request and gets the reply. Frames on the local network carry the gateway's MAC address, while the packets inside carry the server's IP address.

## 4. Opening a connection

The browser opens a TCP connection to port 443 with the three-way handshake: SYN, SYN-ACK, ACK. That costs one round trip. If the browser and server both support HTTP/3, it uses QUIC over UDP instead, combining transport and encryption setup in one round trip.

## 5. Setting up encryption

On top of TCP, the browser and server perform a TLS handshake. The browser proposes cipher suites and sends a key share. The server replies with its own key share and its certificate. The browser checks that the certificate is valid, unexpired, issued for \`www.example.com\`, and signed by a chain of authorities it trusts. Both sides derive the same session keys, and from now on everything is encrypted. TLS 1.3 needs one round trip, and resumed sessions can need zero.

## 6. Sending the HTTP request

The browser sends an HTTP request, such as \`GET /\`, with headers including \`Host\`, cookies for the site, the accepted content types and compression formats. With HTTP/2 or HTTP/3, this request becomes one stream on the shared connection.

## 7. Crossing the internet

Packets leave the laptop, cross the Wi-Fi access point and campus switches, and reach the edge router, where NAT replaces the private source address with a public one. Routers along the path each look up the destination in their tables using longest prefix match and forward the packet toward it, across ISP networks connected by BGP. The request may reach a CDN edge server near the user rather than the origin, if the site uses one.

## 8. The server's side

At the destination, a load balancer picks one of many application servers. A reverse proxy may terminate TLS, serve cached content, or forward the request. The application server runs code that may read from a cache such as Redis or query a database, builds the response, and sends it back with a status code, headers and a body.

## 9. Rendering the page

The browser receives HTML and starts building the page:

- it parses HTML into the DOM (Document Object Model) and CSS into the CSSOM
- it discovers more resources, such as stylesheets, scripts, images and fonts, and requests them, reusing the open connection
- it runs JavaScript, which may change the page and make further requests
- it computes the layout and paints pixels on the screen

## 10. After the page loads

The connection stays open for further requests (keep-alive) and closes eventually with TCP's FIN exchange. DNS answers, TLS session tickets and cached resources make the next visit much faster.

## Adapting the depth

Interviewers use this question to explore your strongest areas. Start with a short summary: URL parsing, DNS, TCP, TLS, HTTP, server processing and rendering. Then go deep wherever the interviewer steers you: DNS caching and TTLs, certificate validation, load balancing and CDNs, or the browser's rendering pipeline. Naming the layer at each step shows you understand the model rather than reciting a list.

## How interviewers test this

The question is open-ended, so structure is what's being graded. Give the skeleton in order, mention caching at every level (browser, OS, resolver, CDN), and be ready for follow-ups such as "What if DNS fails?", "How does the browser trust the certificate?" or "What does the load balancer do?"`,
    sources: [SYSTEMS_APPROACH, HPBN, MDN_HTTP]
  },

  "cryptography-basics": {
    theory: `Cryptography is the foundation of network security. Every secure connection combines a few building blocks: symmetric encryption for speed, public-key cryptography for exchanging keys and proving identity, and hash functions for integrity. This lesson explains each building block, what it guarantees and what it doesn't, why real protocols combine them, and how passwords should be stored.

## Four security goals

Each cryptographic tool provides one or more of these goals:

- **Confidentiality**: only the intended recipient can read the data
- **Integrity**: any change to the data is detected
- **Authentication**: you know who sent the data
- **Non-repudiation**: the sender can't later deny sending it

## Symmetric encryption

Symmetric encryption uses one shared secret key for both encryption and decryption. AES (Advanced Encryption Standard) and ChaCha20 are the standard algorithms today. They're fast, encrypting gigabytes per second on modern processors, often with dedicated hardware instructions.

The problem is key distribution: both sides need the same secret key, and they can't send it over the network in plain text without an eavesdropper seeing it. With many users, every pair would need its own key.

## Public-key cryptography

Public-key (asymmetric) cryptography gives each party a key pair: a public key shared openly and a private key kept secret. Data encrypted with the public key can only be decrypted with the matching private key. RSA and elliptic-curve cryptography (ECC) are the main families.

Anyone can encrypt a message to you with your public key, and only you can read it, which solves key distribution. The cost is speed: public-key operations are roughly a thousand times slower than symmetric encryption, so they're used for small amounts of data, such as keys and signatures.

## Key exchange

The Diffie-Hellman key exchange lets two parties agree on a shared secret over a public channel without ever sending it. Each side generates a temporary key pair, they exchange public values, and each combines its own private value with the other's public value to compute the same secret. An eavesdropper who sees both public values can't compute it.

Modern protocols use **ephemeral** elliptic-curve Diffie-Hellman (ECDHE), generating new key pairs for every session. If a server's long-term key is stolen later, past sessions stay secret, a property called **forward secrecy**.

## Hash functions

A cryptographic hash function turns any input into a fixed-size fingerprint, such as SHA-256's 256-bit output. Good hash functions have three properties: the same input always gives the same output, you can't work backwards from the output to the input, and it's infeasible to find two inputs with the same output. Changing a single bit of the input changes about half the output bits.

Hashes check integrity: download a file and compare its hash with the published one. MD5 and SHA-1 are broken, because researchers can produce collisions, so use SHA-256 or SHA-3.

## Message authentication codes

A hash alone doesn't prove who created a message, because an attacker can modify the message and recompute the hash. A **message authentication code** (MAC), such as HMAC-SHA256, mixes a shared secret key into the hash. Only someone with the key can produce a valid tag, so a valid tag proves both integrity and that the sender holds the key.

## Digital signatures

A digital signature is created with the sender's private key and verified with their public key. Anyone can verify it, but only the private-key holder could have produced it. Signatures provide integrity, authentication and non-repudiation. They don't provide confidentiality: a signed message is still readable by anyone. RSA signatures, ECDSA and Ed25519 are common.

## Hybrid encryption

Real protocols combine the tools, using each for what it does best. TLS, SSH and secure messaging apps follow the same pattern:

1. Use public-key cryptography and key exchange to agree on a fresh symmetric session key
2. Use signatures and certificates to verify the other side's identity
3. Encrypt all bulk data with fast symmetric encryption and protect it with authentication tags

## Storing passwords

Passwords should never be stored in plain text or with reversible encryption, because a database leak would expose every user. Store a salted hash instead, using an algorithm designed to be slow, such as bcrypt, scrypt or Argon2. The **salt**, a random value per user, makes identical passwords produce different hashes and defeats precomputed tables. The deliberate slowness makes guessing billions of passwords impractical. Fast hashes such as plain SHA-256 are the wrong tool here, because attackers can try billions per second on graphics cards.

## How interviewers test this

Expect "Symmetric vs asymmetric encryption", "What's the difference between hashing and encryption?" and "How should passwords be stored?" Explain the speed and key-distribution trade-off, that hashing is one-way while encryption is reversible with a key, and that passwords need slow, salted hashes such as bcrypt or Argon2.`,
    sources: [SYSTEMS_APPROACH, RFC_8446, OWASP_TOP10]
  },

  "tls-and-certificates": {
    theory: `Transport Layer Security (TLS) is the protocol behind the padlock in your browser. It encrypts traffic, detects tampering and proves that you're talking to the real server and not an impostor. This lesson explains what TLS guarantees, walks through the TLS 1.3 handshake, explains how certificates and certificate authorities create trust, and clarifies what HTTPS does and doesn't hide.

## What TLS provides

TLS runs on top of a transport connection and gives three guarantees:

- **Confidentiality**: data is encrypted with keys only the two endpoints know
- **Integrity**: any modification is detected, because every record carries an authentication tag
- **Server authentication**: the server proves its identity with a certificate; mutual TLS also authenticates the client

HTTPS is HTTP sent over TLS. TLS also secures email transport, database connections, VPNs and many APIs.

## A short history

TLS grew out of Netscape's SSL (Secure Sockets Layer). SSL 2.0 and 3.0 and TLS 1.0 and 1.1 all have known weaknesses and are disabled in modern browsers. TLS 1.2 (2008) is still widely used, and TLS 1.3 (2018) is the current version. People still say "SSL certificate", but the protocol in use is TLS.

## The TLS 1.3 handshake

TLS 1.3 completes its handshake in one round trip:

1. **ClientHello**: the client sends the cipher suites it supports, a key share for elliptic-curve Diffie-Hellman, and the server name it wants, through the Server Name Indication (SNI) extension
2. **ServerHello and encrypted extensions**: the server chooses a cipher suite and sends its own key share. Both sides can now compute the shared secret, so everything after this point is encrypted
3. **Certificate and verification**: the server sends its certificate and a signature over the handshake made with its private key, proving it holds the key matching the certificate
4. **Finished**: both sides confirm the handshake wasn't tampered with, and application data starts flowing

For a returning visitor, TLS 1.3 can resume a session with zero round trips, sending data in the first flight. That "0-RTT" data can be replayed by an attacker, so servers accept it only for safe, idempotent requests.

## Forward secrecy

TLS 1.3 requires ephemeral key exchange, generating new key pairs for every connection. The server's long-term private key is used only to sign the handshake, never to encrypt the session key. If that private key is stolen years later, recorded past sessions still can't be decrypted. Older TLS configurations that encrypted session keys directly with the server's RSA key lacked this property.

## Certificates

A certificate binds a public key to an identity, such as \`studyhub.example\`. It contains the domain names it covers (in the Subject Alternative Name field), the public key, a validity period, and the signature of the certificate authority (CA) that issued it.

Certificates come in validation levels. Domain-validated certificates prove only that the requester controls the domain, and they're the most common. Let's Encrypt issues them free and automatically, which drove HTTPS adoption from a minority of web traffic to the large majority.

## The chain of trust

Browsers and operating systems ship with a set of trusted root CA certificates. Root CAs rarely sign website certificates directly; they sign intermediate CAs, which sign websites. When you connect, the server sends its own certificate plus the intermediates, and the browser checks:

- every signature in the chain, up to a trusted root
- the validity dates of every certificate
- that the requested domain appears in the certificate
- that the certificate hasn't been revoked

If any check fails, the browser shows a full-page warning. Clicking through those warnings defeats the purpose of TLS, because an attacker could be presenting their own certificate.

## Certificate Transparency

Because any trusted CA can issue a certificate for any domain, a mistaken or compromised CA could issue a fraudulent one. Certificate Transparency requires CAs to publish every certificate they issue in public, append-only logs, and browsers reject certificates that aren't logged. Domain owners can monitor the logs and spot certificates they didn't request.

## What HTTPS hides and what it doesn't

HTTPS encrypts the URL path, query string, headers, cookies and body. Observers on the network still see the IP addresses you connect to, the amount and timing of traffic, and usually the hostname, which leaks through DNS lookups and the SNI field. Encrypted DNS and Encrypted Client Hello (ECH) close those two leaks where both sides support them.

## How interviewers test this

Expect "How does HTTPS work?", "How does the browser know a certificate is valid?" and "What is forward secrecy?" Describe the handshake as key exchange plus certificate verification, walk the chain of trust to a root CA, and explain that ephemeral keys protect past sessions even if the server's key leaks.`,
    sources: [RFC_8446, SYSTEMS_APPROACH, HPBN]
  },

  "firewalls-and-common-attacks": {
    theory: `Network security combines defences that control traffic, such as firewalls and VPNs, with an understanding of how attacks work, so you can design systems that resist them. This lesson explains packet-filtering, stateful and application firewalls, intrusion detection and VPNs, then walks through the attacks every developer should be able to explain, each with its defence.

## Packet-filtering firewalls

A packet-filtering firewall allows or blocks packets based on header fields: source and destination IP addresses, ports and protocol. A rule might allow incoming TCP to port 443 and block everything else. Packet filters are fast and stateless: they judge each packet alone, so writing rules that allow replies to outgoing connections without opening holes is awkward.

## Stateful firewalls

A stateful firewall tracks connections. When a campus computer opens a connection to a web server, the firewall records it and automatically allows the reply packets, while still blocking unsolicited incoming connections. Almost every modern firewall, including the ones built into home routers and operating systems, is stateful.

## Application firewalls

A web application firewall (WAF) inspects HTTP requests themselves, looking for attack patterns such as SQL injection or cross-site scripting payloads in parameters. WAFs add a useful layer, but they can't replace fixing vulnerabilities in the application, because attackers vary their payloads to slip past pattern matching.

## Intrusion detection and prevention

An intrusion detection system (IDS) watches traffic for suspicious patterns, such as port scans, known exploit signatures or unusual volumes, and raises alerts. An intrusion prevention system (IPS) sits inline and blocks matching traffic automatically. Both need tuning: too sensitive and they flood operators with false alarms; too loose and they miss real attacks.

## VPNs

A virtual private network (VPN) creates an encrypted tunnel across an untrusted network. Remote employees use VPNs to reach internal systems, and companies link offices with site-to-site VPNs. IPsec, WireGuard and TLS-based VPNs are common. Many organizations are moving to **zero trust**, verifying every request's user and device instead of trusting anything inside the network perimeter.

## Denial of service

A denial-of-service (DoS) attack overwhelms a target so legitimate users can't reach it. A distributed DoS (DDoS) uses thousands of compromised devices, often insecure cameras and routers, sending traffic at once. Attacks target different layers: flooding bandwidth, exhausting connection tables with SYN floods, or sending expensive application requests. Defences include rate limiting, absorbing traffic with CDNs and scrubbing services, SYN cookies and autoscaling.

## Interception and spoofing

Several attacks place the attacker in the middle of communication:

- **Man in the middle (MITM)**: the attacker relays and possibly alters traffic between two parties. TLS with proper certificate validation defeats it, and HSTS stops attackers from downgrading a connection to plain HTTP
- **ARP spoofing**: on a local network, the attacker sends forged ARP replies claiming to be the gateway, so victims send traffic through them. Switch features such as dynamic ARP inspection and end-to-end encryption defend against it
- **DNS spoofing**: forged DNS answers send users to malicious servers. DNSSEC and encrypted DNS help, and TLS still catches the wrong certificate

## Web application attacks

The OWASP Top Ten lists the most critical web application risks. Three appear in nearly every interview:

| Attack | How it works | Defence |
|---|---|---|
| SQL injection | User input is inserted into a SQL query and changes its meaning | Parameterized queries; least-privilege database accounts |
| Cross-site scripting (XSS) | Injected script runs in other users' browsers | Encode output; Content Security Policy; HttpOnly cookies |
| Cross-site request forgery (CSRF) | A malicious site makes a logged-in user's browser send unwanted requests | SameSite cookies; anti-CSRF tokens |

## SQL injection in detail

If an application builds a query by concatenating input, such as \`"SELECT * FROM users WHERE email = '" + email + "'"\`, an attacker can enter \`x' OR '1'='1\` and the query returns every user. The fix is a parameterized query, where the database receives the SQL and the values separately, so input is always treated as data and never as code. Escaping input by hand is error-prone; parameterized queries remove the whole class of bug.

## Phishing and social engineering

Many breaches start with people rather than protocols. Phishing emails trick users into entering credentials on fake login pages or running malware. Multi-factor authentication limits the damage of stolen passwords, phishing-resistant methods such as hardware security keys stop it almost entirely, and email authentication (SPF, DKIM and DMARC) makes spoofed sender addresses easier to catch.

## Defence in depth

No single control stops every attack. Secure systems layer defences: firewalls limit what's reachable, TLS protects data in transit, the application validates input and uses parameterized queries, accounts have only the permissions they need, and monitoring detects what gets through. Each layer covers gaps in the others.

## How interviewers test this

Expect "Stateful vs stateless firewall", "What is a DDoS attack and how do you mitigate it?" and "Explain SQL injection, XSS and CSRF with their fixes." Give one sentence on how each attack works and one on its defence. Ending with defence in depth shows you think about security as a system.`,
    sources: [OWASP_TOP10, SYSTEMS_APPROACH, RFC_8446]
  }
};
