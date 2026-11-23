// Computer Networks Modules 6-8: Transport Layer, Application Layer, Network Security
import { CourseLesson } from './types';

export const transportLayerLessons: CourseLesson[] = [
  {
    id: "tcp-vs-udp-and-ports",
    slug: "tcp-vs-udp-and-ports",
    title: "TCP vs UDP, Ports and Sockets",
    description: "Process-to-process delivery, well-known ports, and when to choose UDP over TCP.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Ports and Sockets",
          content: "IP delivers packets to a host; the transport layer delivers them to the right process using 16-bit port numbers.\nWell-known ports: 0-1023. Registered: 1024-49151. Ephemeral (temporary client ports): 49152-65535.\n\nA TCP connection is identified by its 4-tuple: (source IP, source port, destination IP, destination port). That's how one web server on port 443 can serve thousands of clients at once."
        },
        {
          type: "table",
          title: "TCP vs UDP",
          headers: ["", "TCP", "UDP"],
          rows: [
            ["Connection", "Connection-oriented (handshake first)", "Connectionless"],
            ["Reliability", "Guaranteed, in-order delivery; retransmits losses", "Best effort: no ACKs, no retransmission"],
            ["Flow / congestion control", "Yes", "No"],
            ["Header", "20-60 bytes", "8 bytes"],
            ["Data model", "Byte stream (no message boundaries)", "Messages (datagrams keep their boundaries)"],
            ["Use cases", "Web (HTTP/1.1, HTTP/2), email, file transfer, SSH", "DNS, video calls, online games, streaming, DHCP, QUIC (HTTP/3)"]
          ]
        },
        {
          type: "table",
          title: "Ports to Memorize",
          headers: ["Port", "Protocol"],
          rows: [
            ["20/21", "FTP data / control"], ["22", "SSH"], ["23", "Telnet"], ["25", "SMTP"],
            ["53", "DNS (UDP, and TCP for large responses)"], ["67/68", "DHCP server / client"], ["80", "HTTP"],
            ["110", "POP3"], ["143", "IMAP"], ["443", "HTTPS"], ["3306", "MySQL"], ["5432", "PostgreSQL"]
          ]
        },
        {
          type: "think",
          question: "Why do video calls use UDP even though packets can be lost?",
          answerReveal: "A retransmitted packet would arrive too late to be useful. Real-time media prefers to skip a lost frame rather than stall the whole stream waiting for it (TCP's head-of-line blocking). The application handles loss itself with concealment and error correction."
        },
        {
          type: "quickCheck",
          question: "Which protocol does DNS primarily use for normal queries?",
          options: ["TCP port 53", "UDP port 53", "UDP port 67", "TCP port 443"],
          answer: 1,
          explanation: "Normal DNS queries are small request/response pairs over UDP 53. TCP 53 is used for zone transfers and large responses."
        },
        {
          type: "takeaways",
          items: ["Ports identify processes; a 4-tuple identifies a TCP connection.", "TCP = reliable ordered byte stream; UDP = lightweight datagrams with no guarantees."]
        }
      ]
    }
  },
  {
    id: "tcp-connection-management",
    slug: "tcp-connection-management",
    title: "TCP Three-Way Handshake, Teardown and Reliability",
    description: "SYN / SYN-ACK / ACK, sequence numbers, the four-way close, TIME_WAIT, and how TCP recovers from loss.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "Three-Way Handshake",
          language: "text",
          code: "Client                                   Server (LISTEN)\n  | --- SYN, seq = x ---------------------> |   SYN_RCVD\n  | <-- SYN + ACK, seq = y, ack = x + 1 --- |\n  | --- ACK, ack = y + 1 -----------------> |   ESTABLISHED\nESTABLISHED",
          explanation: "Both sides choose random initial sequence numbers (ISNs) and confirm each other's. The SYN consumes one sequence number even though it carries no data."
        },
        {
          type: "think",
          question: "Why three messages and not two?",
          answerReveal: "Each side must confirm that the other received its initial sequence number. With only two messages, the server can't know its own SYN arrived, and an old duplicate SYN from a previous connection could open a half-open connection on the server."
        },
        {
          type: "code",
          title: "Connection Teardown (four-way)",
          language: "text",
          code: "Client                         Server\n  | --- FIN -------------------> |   (client is done sending)\n  | <-- ACK --------------------- |\n  |          ...server may still send data...\n  | <-- FIN --------------------- |   (server is done sending)\n  | --- ACK -------------------> |\nTIME_WAIT (2 × MSL) then CLOSED",
          explanation: "TCP is full duplex, so each direction is closed separately. TIME_WAIT makes sure the final ACK can be resent if it's lost, and lets old duplicate segments die out before the port pair is reused."
        },
        {
          type: "table",
          title: "How TCP Achieves Reliability",
          headers: ["Mechanism", "Purpose"],
          rows: [
            ["Sequence numbers (per byte)", "Order the data and detect duplicates"],
            ["Cumulative ACKs", "'I have received everything up to byte N − 1'"],
            ["Retransmission timeout (RTO)", "Resend if no ACK arrives in time (based on a smoothed RTT estimate)"],
            ["Fast retransmit", "3 duplicate ACKs → resend immediately, without waiting for the timeout"],
            ["Checksum", "Detect corrupted segments"],
            ["SACK option", "Tell the sender exactly which blocks arrived"]
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "What is a SYN flood attack?",
              trap: "Confusing it with a generic DDoS.",
              solution: "The attacker sends many SYNs (often from spoofed addresses) and never completes the handshake. The server keeps half-open connections until its backlog is full and it can't accept real clients. Defences: SYN cookies (no state stored until the final ACK), bigger backlogs, rate limiting."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "A sender receives three duplicate ACKs for the same sequence number. TCP will:",
          options: ["Wait for the timeout", "Fast-retransmit the missing segment", "Close the connection", "Double the window"],
          answer: 1,
          explanation: "Duplicate ACKs mean later segments are arriving, so one segment was probably lost. TCP resends it right away (fast retransmit)."
        },
        {
          type: "takeaways",
          items: [
            "Handshake: SYN → SYN-ACK → ACK; each SYN and FIN uses one sequence number.",
            "Close: FIN/ACK in each direction; the side that closes first waits in TIME_WAIT.",
            "Reliability comes from sequence numbers, ACKs, timers, fast retransmit and checksums."
          ]
        }
      ]
    }
  },
  {
    id: "tcp-flow-and-congestion-control",
    slug: "tcp-flow-and-congestion-control",
    title: "TCP Flow Control and Congestion Control",
    description: "Receiver window vs congestion window, slow start, AIMD, Tahoe vs Reno, and throughput numericals.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "table",
          title: "Flow Control vs Congestion Control",
          headers: ["", "Flow control", "Congestion control"],
          rows: [
            ["Protects", "The receiver (don't overflow its buffer)", "The network (don't overload routers)"],
            ["Signal", "Receive window (rwnd) advertised by the receiver", "Loss or delay inferred by the sender"],
            ["Variable", "rwnd", "cwnd (congestion window)"]
          ]
        },
        {
          type: "text",
          title: "The Sending Window",
          content: "The sender may have at most min(rwnd, cwnd) unacknowledged bytes in flight.\nMaximum throughput ≈ window / RTT. With the classic 64 KB window limit and a 100 ms RTT: 65535 × 8 / 0.1 ≈ 5.24 Mbps, no matter how fast the link is. The window-scale option allows windows up to 1 GB on fast, long links."
        },
        {
          type: "table",
          title: "Congestion-Control Phases",
          headers: ["Phase", "Rule", "Growth"],
          rows: [
            ["Slow start", "cwnd starts small (1 MSS in classic exams, about 10 MSS today) and grows by 1 MSS per ACK", "Doubles every RTT (exponential) until it reaches ssthresh"],
            ["Congestion avoidance", "cwnd += 1 MSS per RTT", "Linear (additive increase)"],
            ["Timeout", "ssthresh = cwnd / 2; cwnd = 1 MSS; back to slow start", "Severe reaction"],
            ["3 duplicate ACKs (Reno)", "ssthresh = cwnd / 2; cwnd = ssthresh (fast recovery)", "Multiplicative decrease, but no return to slow start"]
          ]
        },
        {
          type: "dryRun",
          title: "cwnd Over Time (Tahoe, ssthresh = 16, timeout when cwnd = 20)",
          iterations: [
            { step: "RTT 1-5", variables: { "cwnd": "1, 2, 4, 8, 16" }, description: "Slow start doubles until it reaches ssthresh = 16." },
            { step: "RTT 6-10", variables: { "cwnd": "17, 18, 19, 20, (timeout)" }, description: "Congestion avoidance: +1 per RTT." },
            { step: "After timeout", variables: { "ssthresh": "20 / 2 = 10", "cwnd": "1" }, description: "Slow start again: 1, 2, 4, 8, then linear growth from 10." },
            { step: "If it were 3 dup ACKs (Reno)", variables: { "ssthresh": "10", "cwnd": "10" }, description: "Continue linearly from 10: this is the AIMD 'sawtooth'." }
          ]
        },
        {
          type: "text",
          title: "Modern Variants",
          content: "CUBIC (the default in Linux and Windows) grows cwnd along a cubic curve, so it recovers faster on high-bandwidth links. BBR (Google) estimates the bottleneck bandwidth and RTT directly instead of treating loss as the congestion signal."
        },
        {
          type: "quickCheck",
          question: "In slow start, cwnd grows:",
          options: ["Linearly per RTT", "Exponentially (doubling) per RTT", "By half per RTT", "It doesn't change"],
          answer: 1,
          explanation: "Each ACK adds 1 MSS, and one window's worth of ACKs arrives per RTT, so cwnd doubles every RTT."
        },
        {
          type: "takeaways",
          items: [
            "Flow control (rwnd) protects the receiver; congestion control (cwnd) protects the network.",
            "Slow start doubles cwnd until ssthresh, then it grows linearly (AIMD).",
            "Timeout → cwnd = 1; triple duplicate ACK (Reno) → cwnd = ssthresh = cwnd/2.",
            "Throughput ≤ window / RTT."
          ]
        }
      ]
    }
  }
];

export const applicationLayerLessons: CourseLesson[] = [
  {
    id: "dns",
    slug: "dns",
    title: "DNS: How Names Become IP Addresses",
    description: "The DNS hierarchy, recursive vs iterative resolution, record types, caching and TTL.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "The Hierarchy",
          content: "DNS is a distributed, hierarchical database:\nRoot servers (.) → TLD servers (.com, .in, .org) → authoritative servers for each domain (google.com).\nNo single server knows everything, which makes it scale."
        },
        {
          type: "code",
          title: "Resolving www.example.com",
          language: "text",
          code: "Browser cache -> OS cache / hosts file -> recursive resolver (ISP, 8.8.8.8, 1.1.1.1)\nRecursive resolver, if not cached:\n  1. asks a root server        -> 'ask the .com TLD servers'\n  2. asks a .com TLD server    -> 'ask example.com's authoritative servers'\n  3. asks the authoritative NS -> 'www.example.com A 93.184.215.14'\n  4. caches the answer for its TTL and returns it to the client",
          explanation: "Client → resolver is a recursive query (do all the work for me). Resolver → root, TLD and authoritative servers are iterative queries (each one just says where to ask next)."
        },
        {
          type: "table",
          title: "Common Record Types",
          headers: ["Type", "Maps", "Example"],
          rows: [
            ["A", "Name → IPv4", "example.com → 93.184.215.14"],
            ["AAAA", "Name → IPv6", "example.com → 2606:2800::..."],
            ["CNAME", "Alias → canonical name", "www.shop.com → shop.cdn.net"],
            ["MX", "Domain → mail server (with priority)", "gmail.com → gmail-smtp-in.l.google.com"],
            ["NS", "Domain → its authoritative name servers", "example.com → a.iana-servers.net"],
            ["TXT", "Arbitrary text (SPF, verification)", "\"v=spf1 include:_spf.google.com ~all\""],
            ["PTR", "IP → name (reverse lookup)", "14.215.184.93.in-addr.arpa → example.com"]
          ]
        },
        {
          type: "quickCheck",
          question: "Which record type tells other mail servers where to deliver email for a domain?",
          options: ["A", "CNAME", "MX", "NS"],
          answer: 2,
          explanation: "MX (mail exchanger) records list the mail servers for a domain, with priorities."
        },
        {
          type: "takeaways",
          items: [
            "Root → TLD → authoritative; resolvers cache answers according to the TTL.",
            "Client → resolver is recursive; resolver → servers is iterative.",
            "Know A, AAAA, CNAME, MX, NS, TXT, PTR."
          ]
        }
      ]
    }
  },
  {
    id: "http-and-https",
    slug: "http-and-https",
    title: "HTTP: Methods, Status Codes, Versions, Cookies",
    description: "The protocol of the web, from request format to HTTP/2 and HTTP/3, statelessness and cookies.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "An HTTP Request and Response",
          language: "http",
          code: "GET /api/courses?level=beginner HTTP/1.1\nHost: studyhub.example\nAccept: application/json\nCookie: session_id=abc123\n\nHTTP/1.1 200 OK\nContent-Type: application/json\nCache-Control: max-age=60\nSet-Cookie: theme=dark; HttpOnly; Secure; SameSite=Lax\n\n{\"courses\": [...]}",
          explanation: "Request = method + path + version, then headers, a blank line and an optional body. Response = status line, headers, blank line, body."
        },
        {
          type: "table",
          title: "Methods",
          headers: ["Method", "Purpose", "Safe", "Idempotent"],
          rows: [
            ["GET", "Read a resource", "Yes", "Yes"],
            ["POST", "Create / submit", "No", "No"],
            ["PUT", "Replace a resource entirely", "No", "Yes"],
            ["PATCH", "Partially update a resource", "No", "Not necessarily"],
            ["DELETE", "Remove a resource", "No", "Yes"],
            ["HEAD / OPTIONS", "Headers only / allowed methods (CORS preflight)", "Yes", "Yes"]
          ]
        },
        {
          type: "table",
          title: "Status Codes",
          headers: ["Class", "Meaning", "Common codes"],
          rows: [
            ["1xx", "Informational", "101 Switching Protocols (WebSocket upgrade)"],
            ["2xx", "Success", "200 OK, 201 Created, 204 No Content"],
            ["3xx", "Redirection", "301 Moved Permanently, 302 Found, 304 Not Modified"],
            ["4xx", "Client error", "400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests"],
            ["5xx", "Server error", "500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout"]
          ]
        },
        {
          type: "table",
          title: "HTTP Versions",
          headers: ["Version", "Key change"],
          rows: [
            ["HTTP/1.0", "A new TCP connection for every request"],
            ["HTTP/1.1", "Persistent (keep-alive) connections, Host header; requests on one connection are answered in order (head-of-line blocking)"],
            ["HTTP/2", "Binary framing, many streams multiplexed over one TCP connection, header compression (HPACK)"],
            ["HTTP/3", "Runs over QUIC (UDP), so a lost packet stalls only its own stream; faster connection setup"]
          ]
        },
        {
          type: "text",
          title: "Statelessness and Cookies",
          content: "HTTP is stateless: each request is independent, and the server doesn't remember earlier ones. To keep a user logged in, the server sets a cookie (often a session ID or a token), and the browser sends it back with every request to that site.\nSecurity flags: HttpOnly (JavaScript can't read it, which limits XSS damage), Secure (sent only over HTTPS), SameSite (limits cross-site sending, which helps against CSRF)."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "401 vs 403?",
              trap: "Treating them as the same.",
              solution: "401 Unauthorized means you aren't authenticated (no credentials or bad credentials), so log in. 403 Forbidden means you are authenticated but not allowed to access this resource."
            },
            {
              question: "Is PUT the same as POST?",
              trap: "Saying both just 'send data'.",
              solution: "PUT is idempotent and targets a known URL (replace the resource at /users/7). POST isn't idempotent and usually creates a new resource whose URL the server decides. Sending the same POST twice can create two records."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which HTTP version removes TCP-level head-of-line blocking by running over UDP?",
          options: ["HTTP/1.0", "HTTP/1.1", "HTTP/2", "HTTP/3"],
          answer: 3,
          explanation: "HTTP/3 uses QUIC over UDP, so each stream recovers from loss independently."
        },
        {
          type: "takeaways",
          items: [
            "GET, PUT and DELETE are idempotent; POST isn't.",
            "Status classes: 2xx ok, 3xx redirect, 4xx client error, 5xx server error.",
            "HTTP is stateless; cookies carry session state."
          ]
        }
      ]
    }
  },
  {
    id: "email-ftp-websockets",
    slug: "email-ftp-websockets",
    title: "Email (SMTP, POP3, IMAP), FTP, SSH and WebSockets",
    description: "How email is sent and retrieved, file transfer, remote shells, and real-time web connections.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "table",
          title: "Email Protocols",
          headers: ["Protocol", "Direction", "Port", "Notes"],
          rows: [
            ["SMTP", "Push: client → server and server → server", "25 (server to server), 587 (submission)", "Sends mail"],
            ["POP3", "Pull: server → client", "110 / 995 (TLS)", "Downloads mail, usually deleting it from the server; one device"],
            ["IMAP", "Pull, synchronized", "143 / 993 (TLS)", "Mail stays on the server; folders sync across devices"]
          ]
        },
        {
          type: "text",
          title: "FTP and SSH",
          content: "FTP uses two connections: control (port 21, commands) and data (port 20 in active mode, or a negotiated port in passive mode). It's out-of-band control, and it sends passwords in plain text, so SFTP (over SSH) or FTPS is used today.\n\nSSH (port 22) gives an encrypted remote shell, file transfer (scp, sftp) and port forwarding. Telnet (23) does the same job unencrypted and is obsolete."
        },
        {
          type: "text",
          title: "WebSockets",
          content: "HTTP is request/response: the server can't push data on its own. A WebSocket starts as an HTTP request with 'Upgrade: websocket'. The server replies 101 Switching Protocols, and the same TCP connection becomes a persistent, full-duplex channel. Used for chat, live dashboards, multiplayer games and collaborative editors. Alternatives: Server-Sent Events (one-way server → client) and long polling."
        },
        {
          type: "quickCheck",
          question: "Which protocol keeps emails on the server and syncs read status across a phone and a laptop?",
          options: ["SMTP", "POP3", "IMAP", "FTP"],
          answer: 2,
          explanation: "IMAP stores mail on the server and synchronizes state across all clients."
        },
        {
          type: "takeaways",
          items: ["SMTP sends; POP3 and IMAP retrieve (IMAP syncs).", "FTP: separate control and data connections.", "WebSocket = HTTP upgrade to a full-duplex persistent connection."]
        }
      ]
    }
  },
  {
    id: "what-happens-when-you-type-a-url",
    slug: "what-happens-when-you-type-a-url",
    title: "What Happens When You Type a URL and Press Enter",
    description: "The classic interview question, answered layer by layer from DNS to the rendered page.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "list",
          title: "Step by Step: https://www.example.com",
          items: [
            "**1. Parse the URL**: scheme https, host www.example.com, default port 443, path /.",
            "**2. DNS lookup**: browser cache → OS cache → hosts file → recursive resolver → root → .com TLD → authoritative server. Result: an IP address.",
            "**3. ARP**: the destination is on another network, so the laptop ARPs for its default gateway's MAC address.",
            "**4. TCP handshake** with IP:443: SYN, SYN-ACK, ACK. (With HTTP/3, a QUIC handshake over UDP instead.)",
            "**5. TLS handshake**: agree on a cipher, the server sends its certificate, the browser verifies it against trusted CAs, and both derive session keys (TLS 1.3 takes 1 round trip).",
            "**6. HTTP request**: GET / with Host, cookies and Accept headers, encrypted inside TLS.",
            "**7. Network path**: packets travel through switches (L2) and routers (L3); NAT rewrites addresses at home; possibly a CDN edge, a load balancer and a reverse proxy.",
            "**8. Server side**: a web server or app server handles the request (maybe querying a database or cache) and returns an HTTP response.",
            "**9. Rendering**: the browser parses HTML into the DOM and CSS into the CSSOM, runs JavaScript, fetches sub-resources (often reusing the connection), lays out and paints the page.",
            "**10. Connection reuse / close**: keep-alive keeps the connection open for further requests; eventually FIN/ACK closes it."
          ]
        },
        {
          type: "callout",
          title: "How to Answer in an Interview",
          content: "Start with the 6-step skeleton: URL parsing, DNS, TCP, TLS, HTTP request/response, rendering. Then go deeper wherever the interviewer steers you (DNS caching, TLS certificates, load balancers, browser rendering). Naming the layer for each step shows you understand the model, not just memorized steps."
        },
        {
          type: "quickCheck",
          question: "Which happens FIRST after you press Enter on a new domain (nothing cached)?",
          options: ["TLS handshake", "TCP handshake", "DNS resolution", "HTTP GET"],
          answer: 2,
          explanation: "You can't open a TCP connection without the server's IP address, so DNS comes first."
        },
        {
          type: "takeaways",
          items: ["Order: DNS → (ARP) → TCP → TLS → HTTP → render.", "Mention caches at every level: browser, OS, resolver, CDN."]
        }
      ]
    }
  }
];

export const networkSecurityLessons: CourseLesson[] = [
  {
    id: "cryptography-basics",
    slug: "cryptography-basics",
    title: "Cryptography Basics: Symmetric, Asymmetric, Hashing, Signatures",
    description: "The building blocks of secure communication and what each one guarantees.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "The Building Blocks",
          headers: ["Primitive", "Keys", "Gives you", "Examples"],
          rows: [
            ["Symmetric encryption", "One shared secret key", "Confidentiality; fast", "AES, ChaCha20"],
            ["Asymmetric (public-key) encryption", "Public key encrypts / private key decrypts", "Key exchange and confidentiality without a pre-shared secret; slow", "RSA, ECC"],
            ["Hash function", "No key", "A fixed-size fingerprint; integrity", "SHA-256, SHA-3 (MD5 and SHA-1 are broken)"],
            ["MAC / HMAC", "Shared key", "Integrity + authenticity", "HMAC-SHA256"],
            ["Digital signature", "Private key signs / public key verifies", "Integrity + authenticity + non-repudiation", "RSA signatures, ECDSA, Ed25519"],
            ["Key exchange", "Each side's own key pair", "Agree on a shared secret over an open channel", "Diffie-Hellman, ECDHE"]
          ]
        },
        {
          type: "text",
          title: "Why Combine Them (Hybrid Encryption)",
          content: "Asymmetric cryptography solves key distribution but is about 1000× slower. Symmetric cryptography is fast but needs a shared key. Real protocols (TLS, SSH, PGP) use asymmetric methods to agree on or exchange a random symmetric session key, then encrypt the bulk data with AES or ChaCha20."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Calling hashing 'encryption'. A hash can't be reversed with a key, and passwords should be stored hashed, never encrypted.",
            "Using plain fast hashes (SHA-256) for passwords. Use slow, salted algorithms (bcrypt, scrypt, Argon2).",
            "Thinking a signature hides the data. It proves who sent it and that it wasn't altered; it doesn't provide confidentiality."
          ]
        },
        {
          type: "quickCheck",
          question: "Alice signs a message. Which key does Bob use to verify the signature?",
          options: ["Alice's private key", "Alice's public key", "Bob's private key", "A shared symmetric key"],
          answer: 1,
          explanation: "Signatures are created with the signer's private key and verified with the signer's public key."
        },
        {
          type: "takeaways",
          items: [
            "Symmetric = fast bulk encryption; asymmetric = key exchange and signatures.",
            "Hash = integrity fingerprint; HMAC adds a key; a signature adds non-repudiation.",
            "Store passwords with salted, slow hashes such as bcrypt or Argon2."
          ]
        }
      ]
    }
  },
  {
    id: "tls-and-certificates",
    slug: "tls-and-certificates",
    title: "TLS/HTTPS and Certificates",
    description: "What the TLS handshake achieves, how certificate chains establish trust, and what HTTPS protects.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "What TLS Provides",
          content: "TLS (the successor to SSL) runs on top of TCP and gives:\nConfidentiality: data is encrypted with symmetric session keys.\nIntegrity: tampering is detected (AEAD ciphers such as AES-GCM).\nAuthentication: the server proves its identity with a certificate (and optionally the client does too, in mutual TLS).\nHTTPS is simply HTTP over TLS."
        },
        {
          type: "code",
          title: "TLS 1.3 Handshake (simplified, 1 round trip)",
          language: "text",
          code: "Client -> Server: ClientHello (supported ciphers, key share for ECDHE, SNI = hostname)\nServer -> Client: ServerHello (chosen cipher, its key share)\n                  {Certificate, CertificateVerify (signature), Finished}   <- already encrypted\nClient: verifies the certificate chain + signature, derives the same session keys\nClient -> Server: {Finished}  then encrypted application data (HTTP)",
          explanation: "ECDHE provides forward secrecy: even if the server's private key leaks later, recorded past sessions can't be decrypted."
        },
        {
          type: "text",
          title: "Certificates and the Chain of Trust",
          content: "A certificate binds a domain name to a public key and is signed by a Certificate Authority (CA). Browsers trust a built-in set of root CAs. A typical chain: the leaf certificate (studyhub.example) is signed by an intermediate CA, which is signed by a root CA in the trust store.\n\nThe browser checks: the signatures up the chain, the validity dates, that the domain matches (CN/SAN), and revocation status. If any check fails, it shows a warning."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Does HTTPS hide which website I'm visiting?",
              trap: "Saying it hides everything.",
              solution: "It encrypts the URL path, headers and body. The destination IP is visible, and the hostname usually leaks through DNS and the SNI field. Encrypted DNS and Encrypted Client Hello (ECH) address those leaks."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "What property ensures past sessions stay secret even if the server's private key is later stolen?",
          options: ["Non-repudiation", "Forward secrecy", "Integrity", "Certificate pinning"],
          answer: 1,
          explanation: "Ephemeral (EC)DHE keys are thrown away after each session, so the long-term key can't decrypt recorded traffic."
        },
        {
          type: "takeaways",
          items: [
            "TLS = confidentiality + integrity + server authentication.",
            "Certificates chain up to trusted root CAs.",
            "TLS 1.3: 1-RTT handshake, forward secrecy by default."
          ]
        }
      ]
    }
  },
  {
    id: "firewalls-and-common-attacks",
    slug: "firewalls-and-common-attacks",
    title: "Firewalls, VPNs and Common Attacks",
    description: "Packet filtering vs stateful firewalls, VPNs, and the attacks every developer should be able to explain.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Defences",
          headers: ["Tool", "What it does"],
          rows: [
            ["Packet-filter firewall", "Allows or denies packets by IP, port and protocol (stateless rules)"],
            ["Stateful firewall", "Tracks connections, so reply traffic is allowed automatically"],
            ["Application firewall / WAF", "Inspects HTTP content (blocks SQL injection and XSS patterns)"],
            ["VPN", "An encrypted tunnel (IPsec, WireGuard, TLS-based) that joins a remote device or site to a private network"],
            ["IDS / IPS", "Detects (IDS) or blocks (IPS) suspicious traffic patterns"]
          ]
        },
        {
          type: "table",
          title: "Common Attacks",
          headers: ["Attack", "How it works", "Defence"],
          rows: [
            ["DoS / DDoS", "Flood a target with traffic or requests (often from a botnet)", "Rate limiting, CDNs and scrubbing services, autoscaling"],
            ["Man-in-the-middle", "Intercept or alter traffic between two parties", "TLS with certificate validation, HSTS"],
            ["ARP spoofing", "Fake ARP replies redirect LAN traffic through the attacker", "Dynamic ARP inspection, encryption"],
            ["DNS spoofing / cache poisoning", "Fake DNS answers send users to malicious IPs", "DNSSEC, randomized query IDs and ports"],
            ["SQL injection", "User input changes the meaning of an SQL query", "Parameterized queries, least privilege"],
            ["XSS", "Injected script runs in other users' browsers", "Output encoding, Content Security Policy, HttpOnly cookies"],
            ["CSRF", "A malicious site makes a logged-in user's browser send unwanted requests", "SameSite cookies, CSRF tokens"],
            ["Phishing", "Tricking users into revealing credentials", "MFA, user awareness, email authentication (SPF/DKIM/DMARC)"]
          ]
        },
        {
          type: "code",
          title: "SQL Injection and the Fix",
          language: "python",
          code: "# VULNERABLE: input becomes part of the SQL text\nquery = f\"SELECT * FROM users WHERE email = '{email}'\"\n# email = \"x' OR '1'='1\"  ->  returns every user\n\n# SAFE: parameterized query; input is always treated as data\ncursor.execute(\"SELECT * FROM users WHERE email = %s\", (email,))",
          explanation: "Escaping input by hand is error-prone. Parameterized queries are the real fix."
        },
        {
          type: "quickCheck",
          question: "Which defence mainly protects against CSRF?",
          options: ["Parameterized queries", "SameSite cookies / CSRF tokens", "RAID", "DNSSEC"],
          answer: 1,
          explanation: "CSRF relies on the browser automatically attaching cookies to cross-site requests; SameSite cookies and per-form tokens stop that."
        },
        {
          type: "takeaways",
          items: [
            "Stateful firewalls track connections; WAFs inspect HTTP; VPNs tunnel traffic securely.",
            "Know DDoS, MITM, ARP/DNS spoofing, SQL injection, XSS and CSRF, each with its defence."
          ]
        }
      ]
    }
  }
];
