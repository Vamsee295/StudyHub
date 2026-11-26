import type { VisualMap } from "./types";

const c = "computer-networks";

export const cnVisuals: VisualMap = {
  [`${c}/what-is-a-network`]: {
    plain:
      "A network is computers joined so they can share things, like houses joined by roads and a postal service. Your laptop, the Wi-Fi router, your ISP and a server in another country are all stops along the route a message takes.",
    diagram: `flowchart LR
  L["Laptop"] --> W["Wi-Fi router"] --> I["ISP"] --> N(("Internet")) --> S["Server"]
  P["Phone"] --> W`,
    caption: "Your data hops through several networks to reach a server.",
  },
  [`${c}/network-topologies`]: {
    plain:
      "Topology is the shape of the wiring. A star connects everyone to a central switch (one cable fails, only one device drops). A bus shares one cable. A ring passes data around a circle. A mesh links many devices directly for reliability.",
    diagram: `flowchart TB
  subgraph Star
    H["switch"] --- a1["A"]
    H --- b1["B"]
    H --- c1["C"]
    H --- d1["D"]
  end
  subgraph Ring
    a2["A"] --- b2["B"] --- c2["C"] --- d2["D"] --- a2
  end`,
    caption: "Star and ring topologies.",
  },
  [`${c}/network-performance-delays`]: {
    plain:
      "A packet's journey has four delays: processing (the router reads the address), queuing (waiting in line), transmission (pushing all the bits onto the wire, size ÷ bandwidth) and propagation (the signal travelling, distance ÷ speed).",
    diagram: `flowchart LR
  P["processing"] --> Q["queuing"] --> T["transmission<br/>L / R"] --> R["propagation<br/>d / s"]`,
    caption: "Total delay per hop = processing + queuing + transmission + propagation.",
  },
  [`${c}/osi-seven-layers`]: {
    plain:
      "The OSI model splits networking into seven layers, each with one job, like a postal system: you write the letter (application), it's put in an envelope, sorted, routed between cities, and finally carried by a truck (physical). Each layer only talks to the one above and below.",
    diagram: `flowchart TB
  L7["7 Application · HTTP, DNS"] --> L6["6 Presentation · encryption, encoding"] --> L5["5 Session · sessions"] --> L4["4 Transport · TCP, UDP · ports"] --> L3["3 Network · IP · routing"] --> L2["2 Data link · Ethernet · MAC"] --> L1["1 Physical · bits on cable / radio"]`,
    caption: "Mnemonic from the top: All People Seem To Need Data Processing.",
  },
  [`${c}/tcp-ip-model-and-encapsulation`]: {
    plain:
      "Sending data is like nesting envelopes. Your message gets a TCP header (which app, which piece), then an IP header (which computer), then an Ethernet frame (which next device on this cable). The receiver opens the envelopes in reverse.",
    diagram: `flowchart TB
  D["Data"] --> S["TCP header + data = segment"]
  S --> P["IP header + segment = packet"]
  P --> F["Ethernet header + packet + trailer = frame"]
  F --> B["bits on the wire"]`,
    caption: "Each layer wraps the one above in its own header.",
  },
  [`${c}/devices-and-domains`]: {
    plain:
      "A hub shouts every message to everyone (layer 1). A switch learns who is on which port and sends frames only there (layer 2). A router connects different networks and picks paths using IP addresses (layer 3).",
    diagram: `flowchart LR
  H["Hub · L1<br/>repeats to all ports"] --> S["Switch · L2<br/>forwards by MAC"] --> R["Router · L3<br/>routes by IP"]`,
    caption: "Smarter devices work at higher layers.",
  },
  [`${c}/framing-and-error-detection`]: {
    plain:
      "Noise can flip bits on the way. The sender adds a short check value (like a CRC) computed from the data; the receiver recomputes it. If they don't match, the frame was damaged and is thrown away or resent.",
    diagram: `flowchart LR
  S["data 1101011011"] -->|"append CRC 1110"| T["frame on the wire"] --> R{"receiver recomputes CRC<br/>matches?"}
  R -->|"yes"| OK["accept"]
  R -->|"no"| X["discard / resend"]`,
    caption: "A checksum travels with the data to detect corruption.",
  },
  [`${c}/flow-control-sliding-window`]: {
    plain:
      "Stop-and-wait sends one frame and waits for its reply, which wastes the line. Sliding window lets the sender have several frames in flight at once, like posting several letters before the first reply arrives, then slides forward as acknowledgements come back.",
    diagram: `sequenceDiagram
  participant S as Sender (window 3)
  participant R as Receiver
  S->>R: frame 0
  S->>R: frame 1
  S->>R: frame 2
  R-->>S: ACK 0
  S->>R: frame 3 (window slides)
  R-->>S: ACK 1`,
    caption: "Up to 3 frames in flight; each ACK lets the window move on.",
  },
  [`${c}/ipv4-addressing-and-header`]: {
    plain:
      "An IPv4 address is 32 bits written as four numbers, like 192.168.1.10. Part of it names the network (the street) and part names the device (the house number). The subnet mask says where the split is.",
    diagram: `flowchart LR
  A["192.168.1.10 / 24"] --> N["network part<br/>192.168.1"]
  A --> H["host part<br/>.10"]`,
    caption: "/24 means the first 24 bits are the network part.",
  },
  [`${c}/arp-dhcp-icmp-nat`]: {
    plain:
      "DHCP is the hotel receptionist who hands you a room number (IP address) when you arrive. ARP is shouting 'who has 192.168.1.1?' to find a device's hardware (MAC) address. NAT lets a whole house share one public address, like one street address for a block of flats.",
    diagram: `sequenceDiagram
  participant C as New laptop
  participant D as DHCP server
  C->>D: DISCOVER (broadcast)
  D-->>C: OFFER 192.168.1.23
  C->>D: REQUEST 192.168.1.23
  D-->>C: ACK (lease granted)`,
    caption: "DHCP's four-step DORA exchange.",
  },
  [`${c}/routing-algorithms`]: {
    plain:
      "Routers build maps of the network to pick the best next hop. Distance vector routers just tell their neighbours 'I can reach X in 3 hops' (like asking directions). Link state routers each learn the whole map and run Dijkstra.",
    diagram: `flowchart LR
  A((A)) ---|"1"| B((B))
  B ---|"2"| C((C))
  A ---|"5"| C
  C ---|"1"| D((D))`,
    caption: "Best path A → D: A → B → C → D (cost 4), not via the direct A–C link (cost 6).",
  },
  [`${c}/subnet-masks-and-cidr`]: {
    plain:
      "CIDR notation /n says how many leading bits are the network. A /24 leaves 8 bits for hosts: 256 addresses, minus 2 reserved (network and broadcast), so 254 usable. Each extra bit of network halves the hosts.",
    diagram: `flowchart LR
  A["/24 · 256 addresses · 254 hosts"] --> B["/25 · 128 · 126 hosts"] --> C["/26 · 64 · 62 hosts"] --> D["/27 · 32 · 30 hosts"]`,
    caption: "Usable hosts = 2^(32 − n) − 2.",
  },
  [`${c}/subnetting-and-vlsm`]: {
    plain:
      "Subnetting cuts one big network into smaller ones, like dividing a floor into offices. VLSM lets the offices be different sizes, so a 50-person team gets a /26 and a 2-router link gets a /30, wasting fewer addresses.",
    diagram: `flowchart TB
  N["192.168.1.0/24"] --> A["192.168.1.0/26 · 62 hosts · Sales"]
  N --> B["192.168.1.64/27 · 30 hosts · HR"]
  N --> C["192.168.1.96/30 · 2 hosts · router link"]`,
    caption: "Variable-length subnets sized to each need.",
  },
  [`${c}/tcp-vs-udp-and-ports`]: {
    plain:
      "TCP is a registered courier: it confirms delivery, keeps things in order and resends lost parcels. UDP is dropping leaflets: fast, no guarantees. Video calls and games prefer UDP's speed; web pages and payments need TCP's reliability.",
    diagram: `flowchart LR
  T["TCP<br/>connection · ordered · reliable<br/>HTTP, SSH, email"] --- U["UDP<br/>no connection · fast · best effort<br/>DNS, video calls, games"]`,
    caption: "Reliability versus speed.",
  },
  [`${c}/tcp-connection-management`]: {
    plain:
      "Before sending data, TCP does a three-way handshake, like a phone call: 'Can you hear me?' 'Yes, can you hear me?' 'Yes!'. Both sides agree on starting sequence numbers so they can track every byte.",
    diagram: `sequenceDiagram
  participant C as Client
  participant S as Server
  C->>S: SYN (seq = x)
  S-->>C: SYN-ACK (seq = y, ack = x + 1)
  C->>S: ACK (ack = y + 1)
  Note over C,S: connection established, data can flow`,
    caption: "The TCP three-way handshake.",
  },
  [`${c}/tcp-flow-and-congestion-control`]: {
    plain:
      "TCP speeds up carefully. In slow start it doubles how much it sends each round trip; past a threshold it grows by one at a time. When a packet is lost it assumes the network is crowded and cuts back, like easing off the accelerator in traffic.",
    diagram: `flowchart LR
  SS["slow start<br/>cwnd doubles"] -->|"reach ssthresh"| CA["congestion avoidance<br/>cwnd + 1 per RTT"]
  CA -->|"3 duplicate ACKs"| FR["halve cwnd<br/>fast recovery"]
  CA -->|"timeout"| R["cwnd = 1<br/>back to slow start"]
  FR --> CA
  R --> SS`,
    caption: "How TCP's congestion window grows and shrinks.",
  },
  [`${c}/dns`]: {
    plain:
      "DNS is the internet's phone book: it turns google.com into an IP address. Your resolver asks the root servers, which point to the .com servers, which point to Google's own name server, which gives the answer. The result is cached so next time is instant.",
    diagram: `flowchart LR
  B["Browser"] -->|"1 google.com?"| R["Resolver<br/>(your ISP)"]
  R -->|"2 ask"| Root["Root server"]
  Root -.->|"3 try .com"| R
  R -->|"4 ask"| T[".com server"]
  T -.->|"5 try ns1.google.com"| R
  R -->|"6 ask"| A["google.com<br/>name server"]
  A -.->|"7 142.250.183.14"| R
  R -.->|"8 answer, cached"| B`,
    caption: "Iterative DNS resolution: the resolver asks each server in turn (numbers show the order).",
  },
  [`${c}/http-and-https`]: {
    plain:
      "HTTP is a conversation of requests and responses: the browser asks 'GET /index.html', the server answers '200 OK' with the page. HTTPS is the same conversation inside a sealed, tamper-proof envelope (TLS), so nobody in between can read or change it.",
    diagram: `sequenceDiagram
  participant B as Browser
  participant S as Server
  B->>S: GET /courses HTTP/1.1
  S-->>B: 200 OK + HTML
  B->>S: GET /style.css
  S-->>B: 200 OK + CSS`,
    caption: "HTTP is request → response, repeated for every resource.",
  },
  [`${c}/what-happens-when-you-type-a-url`]: {
    plain:
      "Typing a URL sets off a relay: find the server's address (DNS), open a connection (TCP), set up encryption (TLS), ask for the page (HTTP), then the browser builds and paints it, fetching CSS, JavaScript and images along the way.",
    diagram: `flowchart LR
  U["type URL"] --> D["DNS lookup"] --> T["TCP handshake"] --> S["TLS handshake"] --> H["HTTP request"] --> R["server responds"] --> P["browser parses, renders, paints"]`,
    caption: "The classic interview question, step by step.",
  },
  [`${c}/tls-and-certificates`]: {
    plain:
      "TLS uses a certificate as a website's ID card, signed by a trusted authority, so you know you're really talking to your bank. The two sides then agree on a secret key that only they know and use it to encrypt everything else.",
    diagram: `sequenceDiagram
  participant C as Browser
  participant S as Server
  C->>S: ClientHello (supported ciphers, random)
  S-->>C: ServerHello + certificate
  C->>C: verify certificate chain
  C->>S: key exchange
  Note over C,S: both derive the same session key
  C->>S: encrypted HTTP`,
    caption: "A simplified TLS handshake.",
  },
  [`${c}/firewalls-and-common-attacks`]: {
    plain:
      "A firewall is a security guard at the gate with a list of rules: allow web traffic on port 443, block everything else from outside. It can't stop every attack, but it shrinks what attackers can even reach.",
    diagram: `flowchart LR
  I(("Internet")) --> F{"Firewall rules"}
  F -->|"port 443 allowed"| W["Web server"]
  F -->|"port 22 from outside ✗"| X["dropped"]`,
    caption: "Traffic is allowed or dropped by rule.",
  },
};
