import type { LessonQuestions } from './index';

export const cnQuestions: LessonQuestions = {
  "what-is-a-network": [
    { q: "A network covering a single college campus is best described as what?", o: ["PAN", "LAN", "WAN", "MAN"], a: 1, e: "A local area network covers a building or campus; WANs span cities and countries." },
    { q: "What does a protocol define?", o: ["The format, order and meaning of messages exchanged between parties", "The cable colour", "The speed of light in fibre", "The operating system's kernel"], a: 0, e: "Protocols are agreed rules for communication, such as TCP or HTTP." },
    { q: "Which property describes the internet's packet switching?", o: ["Messages are split into packets that share links on demand", "A dedicated circuit is reserved per call", "Only one user can send at a time", "Data travels only over satellites"], a: 0, e: "Packet switching shares link capacity statistically rather than reserving it." },
  ],
  "network-topologies": [
    { q: "In which topology does a single central device failure take down the whole network?", o: ["Star", "Full mesh", "Ring with dual links", "Partial mesh"], a: 0, e: "Every node connects through the hub or switch, so it's a single point of failure." },
    { q: "How many links does a full mesh of 6 nodes need?", o: ["15", "6", "30", "12"], a: 0, e: "n(n − 1) / 2 = 6 × 5 / 2 = 15." },
    { q: "What's the main drawback of a bus topology?", o: ["A break in the backbone cable disrupts everyone", "It needs too many cables", "It needs a central switch", "It can't carry broadcast traffic"], a: 0, e: "All devices share one cable, so a fault or collision affects the whole segment." },
  ],
  "transmission-media-and-switching": [
    { q: "Which medium is immune to electromagnetic interference?", o: ["Optical fibre", "Unshielded twisted pair", "Coaxial cable", "Shielded twisted pair"], a: 0, e: "Fibre carries light, not electrical signals, so EMI doesn't affect it." },
    { q: "Which switching method reserves a dedicated path for the whole session?", o: ["Circuit switching", "Packet switching", "Message switching", "Cell switching"], a: 0, e: "Traditional telephone networks reserve a circuit end to end." },
    { q: "Why is packet switching more efficient for bursty data?", o: ["Idle capacity is shared instead of reserved per user", "It never has queuing delay", "It guarantees bandwidth", "It uses no headers"], a: 0, e: "Most data traffic is bursty; reserving circuits would waste capacity during silences." },
  ],
  "network-performance-delays": [
    { q: "Which delay depends on the packet length and link bandwidth?", o: ["Transmission delay", "Propagation delay", "Processing delay", "Queuing delay only"], a: 0, e: "Transmission delay = L / R, the time to push all bits onto the link." },
    { q: "A 1,000 km link with signals at 2 × 10⁸ m/s has what propagation delay?", o: ["5 ms", "0.5 ms", "50 ms", "2 ms"], a: 0, e: "10⁶ m / (2 × 10⁸ m/s) = 0.005 s = 5 ms." },
    { q: "What is the bandwidth-delay product a measure of?", o: ["How many bits can be in flight on the link", "The packet error rate", "The number of hops", "The router's queue size"], a: 0, e: "Bandwidth × delay is the 'volume of the pipe', important for sizing TCP windows." },
  ],
  "osi-seven-layers": [
    { q: "Which OSI layer handles routing between networks?", o: ["Network layer", "Data link layer", "Transport layer", "Session layer"], a: 0, e: "Layer 3 forwards packets using logical addresses such as IP." },
    { q: "Which layer provides end-to-end reliability and ports?", o: ["Transport layer", "Network layer", "Physical layer", "Presentation layer"], a: 0, e: "Layer 4 protocols such as TCP deliver data between processes reliably." },
    { q: "Encryption and data format translation belong to which OSI layer?", o: ["Presentation layer", "Application layer", "Session layer", "Data link layer"], a: 0, e: "Layer 6 handles syntax, encoding, compression and encryption in the OSI model." },
  ],
  "tcp-ip-model-and-encapsulation": [
    { q: "What is the data unit at the transport layer for TCP called?", o: ["Segment", "Frame", "Packet", "Bit"], a: 0, e: "Transport: segments (or datagrams for UDP); network: packets; link: frames." },
    { q: "During encapsulation, which header is added last before transmission on Ethernet?", o: ["The Ethernet frame header", "The TCP header", "The IP header", "The HTTP header"], a: 0, e: "Each layer wraps the one above, so the link layer header is outermost." },
    { q: "The TCP/IP model's application layer combines which OSI layers?", o: ["Application, presentation and session", "Transport and network", "Data link and physical", "Session and transport"], a: 0, e: "TCP/IP folds the top three OSI layers into one application layer." },
  ],
  "devices-and-domains": [
    { q: "Each port of a switch forms its own what?", o: ["Collision domain", "Broadcast domain", "Subnet", "VLAN automatically"], a: 0, e: "Switches separate collision domains per port but forward broadcasts within the LAN." },
    { q: "Which device separates broadcast domains?", o: ["Router", "Hub", "Switch without VLANs", "Repeater"], a: 0, e: "Routers don't forward layer 2 broadcasts between interfaces." },
    { q: "A hub operates at which layer?", o: ["Physical layer", "Data link layer", "Network layer", "Transport layer"], a: 0, e: "A hub repeats electrical signals to all ports without reading addresses." },
  ],
  "framing-and-error-detection": [
    { q: "Which error detection method is used in Ethernet frames?", o: ["CRC-32", "Single parity bit", "Hamming code", "MD5"], a: 0, e: "The frame check sequence is a 32-bit cyclic redundancy check." },
    { q: "A single even parity bit can detect which errors?", o: ["Any odd number of flipped bits", "Any even number of flipped bits", "All burst errors", "No errors"], a: 0, e: "Flipping two bits keeps parity the same, so even-count errors go unnoticed." },
    { q: "What is bit stuffing used for?", o: ["Preventing the frame's flag pattern from appearing inside the data", "Encrypting data", "Compressing frames", "Correcting errors"], a: 0, e: "In HDLC, a 0 is inserted after five consecutive 1s so data never mimics the 01111110 flag." },
  ],
  "flow-control-sliding-window": [
    { q: "In Go-Back-N, if frame 3 is lost, what does the sender retransmit?", o: ["Frame 3 and all frames sent after it", "Only frame 3", "Only frames before 3", "Nothing"], a: 0, e: "The receiver discards out-of-order frames, so everything from the lost frame onward is resent." },
    { q: "With n-bit sequence numbers, what is the maximum Selective Repeat window size?", o: ["2^(n−1)", "2^n − 1", "2^n", "n"], a: 0, e: "Selective Repeat needs the window to be at most half the sequence space to avoid ambiguity." },
    { q: "Stop-and-wait has poor efficiency when what is large?", o: ["The bandwidth-delay product", "The packet header", "The checksum", "The number of hosts"], a: 0, e: "The sender idles for a full round trip after each frame, wasting most of a long fat pipe." },
  ],
  "mac-protocols": [
    { q: "Which MAC method does classic wired Ethernet use?", o: ["CSMA/CD", "CSMA/CA", "Token passing", "TDMA"], a: 0, e: "Classic shared Ethernet detects collisions and backs off; switched full-duplex Ethernet has no collisions." },
    { q: "Why does Wi-Fi use collision avoidance instead of detection?", o: ["A radio can't reliably hear collisions while transmitting", "Wi-Fi has no collisions", "CSMA/CD is patented", "Wi-Fi uses cables"], a: 0, e: "Hidden stations and the strength of its own signal stop a transmitter detecting collisions, so 802.11 avoids them." },
    { q: "What is the maximum throughput of pure ALOHA?", o: ["About 18%", "About 37%", "100%", "About 50%"], a: 0, e: "Pure ALOHA peaks at 1/(2e) ≈ 18.4%; slotted ALOHA doubles it to about 36.8%." },
  ],
  "ethernet-switching-vlans": [
    { q: "How does a switch learn which port a MAC address is on?", o: ["From the source address of frames it receives", "From DNS", "From DHCP", "From the destination address only"], a: 0, e: "The switch records source MAC and incoming port in its MAC table." },
    { q: "What does a switch do with a frame for an unknown destination MAC?", o: ["Floods it out all ports except the incoming one", "Drops it", "Sends it to the router", "Returns it to the sender"], a: 0, e: "Flooding ensures delivery; the reply teaches the switch the location." },
    { q: "Which standard adds VLAN tags to Ethernet frames?", o: ["IEEE 802.1Q", "IEEE 802.11", "IEEE 802.3ad", "IEEE 802.1X"], a: 0, e: "802.1Q inserts a 4-byte tag carrying a 12-bit VLAN ID." },
  ],
  "ipv4-addressing-and-header": [
    { q: "What does the TTL field in the IPv4 header prevent?", o: ["Packets looping forever", "Packet fragmentation", "Checksum errors", "Address exhaustion"], a: 0, e: "Each router decrements TTL and discards the packet at zero." },
    { q: "What is the minimum IPv4 header size?", o: ["20 bytes", "40 bytes", "8 bytes", "60 bytes"], a: 0, e: "20 bytes without options; up to 60 bytes with options." },
    { q: "Which address range is reserved for loopback?", o: ["127.0.0.0/8", "10.0.0.0/8", "169.254.0.0/16", "192.168.0.0/16"], a: 0, e: "127.0.0.1 is the most common loopback address." },
  ],
  "arp-dhcp-icmp-nat": [
    { q: "What does ARP resolve?", o: ["An IP address to a MAC address", "A domain name to an IP address", "A MAC address to a port", "A port to a process"], a: 0, e: "ARP finds the hardware address for an IP on the local network." },
    { q: "What is the correct order of the DHCP exchange?", o: ["Discover, Offer, Request, Acknowledge", "Request, Offer, Discover, Acknowledge", "Offer, Discover, Acknowledge, Request", "Discover, Request, Offer, Acknowledge"], a: 0, e: "DORA: the client discovers, servers offer, the client requests one, the server acknowledges." },
    { q: "Which tool relies on ICMP Time Exceeded messages?", o: ["traceroute", "nslookup", "curl", "ssh"], a: 0, e: "traceroute sends packets with increasing TTLs and records which router reports expiry." },
  ],
  "routing-algorithms": [
    { q: "Which routing protocol is a link-state protocol?", o: ["OSPF", "RIP", "BGP", "EIGRP"], a: 0, e: "OSPF floods link-state advertisements and runs Dijkstra on the full map." },
    { q: "What problem does distance-vector routing suffer from?", o: ["Count to infinity", "Too much flooding", "Needing a full map", "Slow DNS resolution"], a: 0, e: "Bad news propagates slowly as routers keep raising their metrics; split horizon helps." },
    { q: "Which protocol routes between autonomous systems on the internet?", o: ["BGP", "OSPF", "RIP", "ARP"], a: 0, e: "BGP is a path-vector protocol that exchanges reachability between ISPs and large networks." },
  ],
  "ipv6": [
    { q: "How long is an IPv6 address?", o: ["128 bits", "64 bits", "32 bits", "256 bits"], a: 0, e: "IPv6 uses 128-bit addresses, written as eight groups of four hex digits." },
    { q: "Which IPv4 feature did IPv6 remove from routers?", o: ["Fragmentation in transit", "Time to live", "Source address", "Payload"], a: 0, e: "Only the source host fragments in IPv6; routers send ICMPv6 Packet Too Big instead." },
    { q: "Which mechanism replaces ARP in IPv6?", o: ["Neighbor Discovery Protocol", "DHCPv4", "RARP", "IGMP"], a: 0, e: "NDP uses ICMPv6 messages to find neighbours' link-layer addresses and routers." },
  ],
  "subnet-masks-and-cidr": [
    { q: "How many usable host addresses does a /26 subnet have?", o: ["62", "64", "30", "126"], a: 0, e: "2⁶ = 64 addresses minus network and broadcast = 62." },
    { q: "What is the subnet mask for /20?", o: ["255.255.240.0", "255.255.255.0", "255.255.248.0", "255.255.224.0"], a: 0, e: "20 one-bits: 255.255 plus 11110000 = 240 in the third octet." },
    { q: "What is the network address of 192.168.10.77/27?", o: ["192.168.10.64", "192.168.10.0", "192.168.10.96", "192.168.10.32"], a: 0, e: "/27 blocks are multiples of 32; 77 falls in the block starting at 64." },
  ],
  "subnetting-and-vlsm": [
    { q: "What is the broadcast address of 10.0.5.0/23?", o: ["10.0.5.255", "10.0.4.255", "10.0.6.255", "10.0.5.127"], a: 0, e: "/23 blocks pair third octets 4–5, so 10.0.5.0 sits in 10.0.4.0/23 whose broadcast is 10.0.5.255." },
    { q: "In VLSM, which subnet should be allocated first?", o: ["The one needing the most hosts", "The one needing the fewest hosts", "Alphabetical order", "Random order"], a: 0, e: "Allocating the largest blocks first keeps alignment and avoids overlaps." },
    { q: "Which prefix fits exactly 2 hosts for a point-to-point link?", o: ["/30", "/29", "/28", "/32"], a: 0, e: "A /30 has 4 addresses, 2 usable; /31 is also allowed for point-to-point links by RFC 3021." },
  ],
  "supernetting-longest-prefix": [
    { q: "A router has routes 10.0.0.0/8 and 10.1.0.0/16. Which is used for 10.1.2.3?", o: ["10.1.0.0/16", "10.0.0.0/8", "Both equally", "Neither"], a: 0, e: "Longest prefix match picks the most specific route." },
    { q: "Which supernet summarizes 192.168.0.0/24 to 192.168.3.0/24?", o: ["192.168.0.0/22", "192.168.0.0/23", "192.168.0.0/16", "192.168.0.0/21"], a: 0, e: "Four contiguous /24s aligned at 0 summarize to a /22." },
    { q: "What is the main benefit of route aggregation?", o: ["Smaller routing tables", "More IP addresses", "Faster DNS", "Stronger encryption"], a: 0, e: "Summarizing many prefixes into one reduces memory and update traffic in routers." },
  ],
  "tcp-vs-udp-and-ports": [
    { q: "Which protocol suits a live video call best?", o: ["UDP", "TCP", "FTP", "SMTP"], a: 0, e: "Late packets are useless in real time; UDP avoids head-of-line blocking from retransmissions." },
    { q: "What is the UDP header size?", o: ["8 bytes", "20 bytes", "40 bytes", "4 bytes"], a: 0, e: "UDP has four 2-byte fields: source port, destination port, length and checksum." },
    { q: "Which four values identify a TCP connection?", o: ["Source IP, source port, destination IP, destination port", "MAC addresses and VLAN", "Only destination IP and port", "Process ID and user ID"], a: 0, e: "The four-tuple distinguishes connections, so one server port can serve many clients." },
  ],
  "tcp-connection-management": [
    { q: "What does the server send in the second step of the three-way handshake?", o: ["SYN-ACK", "SYN", "ACK", "FIN"], a: 0, e: "The server acknowledges the client's SYN and sends its own SYN in one segment." },
    { q: "Which side enters TIME_WAIT?", o: ["The side that closes the connection first", "The side that closes last", "Both sides always", "Neither"], a: 0, e: "The active closer waits 2 × MSL to resend the final ACK if needed and let old segments expire." },
    { q: "How do SYN cookies defend against SYN floods?", o: ["The server stores no state until the handshake completes", "They block all SYNs", "They encrypt traffic", "They increase the backlog"], a: 0, e: "Connection details are encoded into the initial sequence number and rebuilt from the final ACK." },
  ],
  "tcp-flow-and-congestion-control": [
    { q: "During slow start, how does the congestion window grow?", o: ["It doubles every round trip", "By one segment per round trip", "It stays fixed", "It halves every round trip"], a: 0, e: "cwnd grows by one segment per ACK, which doubles it each RTT until ssthresh." },
    { q: "In TCP Reno, what happens after three duplicate ACKs?", o: ["cwnd is halved and growth continues linearly", "cwnd resets to 1", "The connection closes", "Nothing changes"], a: 0, e: "Fast retransmit and fast recovery treat duplicate ACKs as mild congestion." },
    { q: "A window of 64 KB over a 100 ms RTT caps throughput at roughly what?", o: ["About 5 Mbit/s", "About 64 Mbit/s", "About 640 Mbit/s", "About 500 kbit/s"], a: 0, e: "65,535 × 8 bits / 0.1 s ≈ 5.2 Mbit/s, which is why window scaling exists." },
  ],
  "dns": [
    { q: "Which DNS record maps a domain to its mail servers?", o: ["MX", "A", "CNAME", "PTR"], a: 0, e: "MX records list mail exchangers with priorities." },
    { q: "Who performs iterative queries to root, TLD and authoritative servers?", o: ["The recursive resolver", "The browser", "The authoritative server", "The root server"], a: 0, e: "The client asks the resolver recursively; the resolver follows referrals iteratively." },
    { q: "Why do administrators lower a record's TTL before migrating servers?", o: ["So caches expire quickly and pick up the new address", "To speed up DNSSEC", "To reduce DNS traffic", "To block old clients"], a: 0, e: "A long TTL keeps stale answers cached for hours; lowering it first shortens the switchover." },
  ],
  "http-and-https": [
    { q: "Which HTTP method is idempotent but not safe?", o: ["PUT", "GET", "POST", "HEAD"], a: 0, e: "Repeating a PUT has the same effect, but it changes server state, so it isn't safe." },
    { q: "Which status code means the user is authenticated but not permitted?", o: ["403", "401", "404", "500"], a: 0, e: "401 means 'who are you?'; 403 means 'I know who you are, and you can't do this'." },
    { q: "What problem does HTTP/3 solve that HTTP/2 still had?", o: ["TCP head-of-line blocking across streams", "Lack of headers", "Missing cookies", "No encryption"], a: 0, e: "HTTP/3 runs over QUIC, where a lost packet delays only its own stream." },
  ],
  "email-ftp-websockets": [
    { q: "Which protocol keeps email on the server and syncs folders across devices?", o: ["IMAP", "POP3", "SMTP", "FTP"], a: 0, e: "IMAP stores mail and its state on the server; POP3 typically downloads and deletes." },
    { q: "Why does active-mode FTP often fail behind NAT?", o: ["The server opens the data connection back to the client", "FTP has no ports", "NAT blocks port 21 always", "FTP uses UDP"], a: 0, e: "Inbound connections to a NATed client usually fail; passive mode has the client open both." },
    { q: "Which status code does a server send to accept a WebSocket upgrade?", o: ["101 Switching Protocols", "200 OK", "301 Moved Permanently", "426 Upgrade Required"], a: 0, e: "After 101, the TCP connection becomes a full-duplex WebSocket channel." },
  ],
  "what-happens-when-you-type-a-url": [
    { q: "What happens first after the browser parses a URL whose IP isn't cached?", o: ["A DNS lookup", "A TLS handshake", "An HTTP request", "Page rendering"], a: 0, e: "The browser needs the server's IP address before it can open a connection." },
    { q: "Why does the laptop send an ARP request during this process?", o: ["To find the default gateway's MAC address", "To find the website's MAC address", "To resolve the domain name", "To get an IP via DHCP"], a: 0, e: "The server is on another network, so frames go to the gateway's MAC while packets carry the server's IP." },
    { q: "What does the browser check about the server's certificate?", o: ["Chain to a trusted root, validity dates, hostname and revocation", "Only that it exists", "Its file size", "That it matches the IP address"], a: 0, e: "Any failed check produces a warning, because an attacker could be presenting a certificate." },
  ],
  "cryptography-basics": [
    { q: "Why do protocols use public-key crypto only to set up a symmetric key?", o: ["Public-key operations are far slower", "Symmetric keys can't be shared", "Public keys can't encrypt", "Symmetric crypto is insecure"], a: 0, e: "Hybrid designs exchange or agree on a key with public-key crypto, then encrypt bulk data symmetrically." },
    { q: "Which property does a digital signature NOT provide?", o: ["Confidentiality", "Integrity", "Authentication", "Non-repudiation"], a: 0, e: "A signed message is still readable by anyone; signatures prove origin and detect tampering." },
    { q: "How should passwords be stored?", o: ["Salted with a slow hash such as bcrypt or Argon2", "Encrypted with AES", "As plain SHA-256 hashes", "In plain text with access control"], a: 0, e: "Slow, salted hashes resist offline guessing and precomputed tables." },
  ],
  "tls-and-certificates": [
    { q: "How many round trips does a full TLS 1.3 handshake need?", o: ["One", "Two", "Three", "Zero always"], a: 0, e: "TLS 1.3 completes in one round trip; resumed sessions can send data in zero." },
    { q: "What gives TLS 1.3 forward secrecy?", o: ["Ephemeral Diffie-Hellman key exchange", "RSA key transport", "Long certificate lifetimes", "Using SHA-1"], a: 0, e: "Fresh keys per session mean a stolen long-term key can't decrypt recorded past sessions." },
    { q: "Which HTTPS detail is still visible to network observers without ECH?", o: ["The hostname in the SNI field", "The URL path", "The cookies", "The request body"], a: 0, e: "The path, headers and body are encrypted; SNI and IP addresses leak the destination." },
  ],
  "firewalls-and-common-attacks": [
    { q: "What does a stateful firewall do that a stateless packet filter doesn't?", o: ["Tracks connections and allows matching reply traffic automatically", "Inspects HTML", "Encrypts traffic", "Assigns IP addresses"], a: 0, e: "Connection tracking lets replies in while still blocking unsolicited inbound connections." },
    { q: "What is the proper fix for SQL injection?", o: ["Parameterized queries", "Hiding error messages", "A longer password", "Using HTTPS"], a: 0, e: "Parameters keep user input as data, never as SQL code." },
    { q: "Which cookie attribute helps defend against CSRF?", o: ["SameSite", "HttpOnly", "Secure", "Max-Age"], a: 0, e: "SameSite stops browsers sending the cookie on most cross-site requests." },
  ],
};
