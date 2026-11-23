// Computer Networks Modules 1-3: Basics, OSI & TCP/IP, Physical & Data Link
import { CourseLesson } from './types';

export const networkBasicsLessons: CourseLesson[] = [
  {
    id: "what-is-a-network",
    slug: "what-is-a-network",
    title: "What is a Computer Network? LAN, MAN, WAN and Network Devices",
    description: "Network types by scale and the devices that connect them: hub, switch, router, gateway.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Definition",
          content: "A computer network is a set of devices (nodes) connected by links so they can share data and resources. The internet is a network of networks: millions of independently run networks connected by routers using common protocols (TCP/IP)."
        },
        {
          type: "table",
          title: "Networks by Scale",
          headers: ["Type", "Range", "Example", "Typical technology"],
          rows: [
            ["PAN", "A few metres", "Phone ↔ earbuds", "Bluetooth"],
            ["LAN", "A building or campus", "College computer lab", "Ethernet, Wi-Fi"],
            ["MAN", "A city", "City-wide cable network", "Metro Ethernet, fibre"],
            ["WAN", "Countries and continents", "A bank's branches, the internet", "Leased lines, MPLS, the internet"]
          ]
        },
        {
          type: "table",
          title: "Network Devices",
          headers: ["Device", "Layer", "What it does"],
          rows: [
            ["Repeater", "Physical (1)", "Regenerates a weakening signal to extend its distance"],
            ["Hub", "Physical (1)", "Copies every incoming bit to all ports. One collision domain, no intelligence"],
            ["Bridge", "Data link (2)", "Connects two LAN segments and filters frames by MAC address"],
            ["Switch", "Data link (2)", "A multi-port bridge: learns MAC addresses and forwards frames only to the right port"],
            ["Router", "Network (3)", "Forwards packets between different networks using IP addresses and routing tables"],
            ["Gateway", "Up to 7", "Translates between different protocols or architectures"]
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Hub vs switch vs router?",
              trap: "Saying they all 'connect computers'.",
              solution: "A hub repeats bits to every port (layer 1; all ports share one collision domain). A switch forwards frames by MAC address to one port (layer 2; each port is its own collision domain, but one broadcast domain). A router connects different networks by IP address (layer 3; each interface is a separate broadcast domain)."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which device separates broadcast domains?",
          options: ["Hub", "Repeater", "Switch (without VLANs)", "Router"],
          answer: 3,
          explanation: "Routers don't forward layer-2 broadcasts, so each router interface is its own broadcast domain. Switches separate collision domains but not broadcast domains (unless VLANs are used)."
        },
        {
          type: "takeaways",
          items: [
            "PAN < LAN < MAN < WAN by geographic scale.",
            "Hub = L1 repeat to everyone; switch = L2 MAC forwarding; router = L3 IP routing between networks.",
            "Switches split collision domains; routers split broadcast domains."
          ]
        }
      ]
    }
  },
  {
    id: "network-topologies",
    slug: "network-topologies",
    title: "Network Topologies",
    description: "Bus, star, ring, mesh, tree and hybrid layouts, with link-count formulas and failure behaviour.",
    estimatedMinutes: 12,
    content: {
      sections: [
        {
          type: "table",
          title: "Topologies Compared",
          headers: ["Topology", "Layout", "Cables for n nodes", "Pros", "Cons"],
          rows: [
            ["Bus", "All nodes on one backbone cable", "1 backbone", "Cheap, simple", "One cable break brings the network down; collisions"],
            ["Star", "Every node connects to a central switch/hub", "n", "Easy to add nodes; one link failure affects one node", "The central device is a single point of failure"],
            ["Ring", "Each node connects to two neighbours in a loop", "n", "Ordered access (token passing)", "One break can stop the whole ring (unless it's a dual ring)"],
            ["Mesh (full)", "Every node connects to every other node", "n(n − 1)/2", "Highly reliable, many redundant paths", "Expensive; doesn't scale"],
            ["Tree", "A hierarchy of stars", "n − 1", "Scalable, structured", "Failure near the root cuts off whole branches"],
            ["Hybrid", "A mix (e.g. star of stars, partial mesh)", "Varies", "Flexible", "Complex"]
          ]
        },
        {
          type: "quickCheck",
          question: "How many links does a full mesh of 6 devices need, and how many I/O ports does each device need?",
          options: ["15 links, 5 ports each", "30 links, 6 ports each", "6 links, 2 ports each", "36 links, 6 ports each"],
          answer: 0,
          explanation: "n(n − 1)/2 = 6 × 5 / 2 = 15 links, and each device connects to the other n − 1 = 5."
        },
        {
          type: "takeaways",
          items: ["Full mesh needs n(n − 1)/2 links.", "Most real LANs are physically star-shaped (everything plugs into a switch)."]
        }
      ]
    }
  },
  {
    id: "transmission-media-and-switching",
    slug: "transmission-media-and-switching",
    title: "Transmission Media, Transmission Modes and Switching",
    description: "Guided vs wireless media, simplex/half/full duplex, and circuit vs packet switching.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "table",
          title: "Transmission Media",
          headers: ["Medium", "Type", "Notes"],
          rows: [
            ["Twisted pair (Cat5e/Cat6)", "Guided", "Cheap; twisting reduces interference; Ethernet up to 100 m per run"],
            ["Coaxial cable", "Guided", "Better shielding; cable TV and broadband"],
            ["Optical fibre", "Guided", "Light pulses; very high bandwidth, long distance, immune to electromagnetic interference"],
            ["Radio / microwave / satellite", "Unguided (wireless)", "Wi-Fi, cellular, satellite links; mobility, but shared and noisy"]
          ]
        },
        {
          type: "table",
          title: "Transmission Modes",
          headers: ["Mode", "Direction", "Example"],
          rows: [
            ["Simplex", "One way only", "Keyboard → computer, TV broadcast"],
            ["Half duplex", "Both ways, one at a time", "Walkie-talkie, classic Wi-Fi channel access"],
            ["Full duplex", "Both ways at the same time", "Phone call, switched Ethernet"]
          ]
        },
        {
          type: "table",
          title: "Circuit vs Packet Switching",
          headers: ["", "Circuit switching", "Packet switching"],
          rows: [
            ["Path", "A dedicated path is reserved before data flows", "Data is split into packets that are routed independently"],
            ["Resources", "Reserved for the whole call, even when silent", "Shared on demand (statistical multiplexing)"],
            ["Delay", "Setup delay, then constant", "Variable (queuing at routers)"],
            ["Efficiency for bursty data", "Poor", "High"],
            ["Example", "Traditional telephone network", "The internet"]
          ]
        },
        {
          type: "text",
          title: "Virtual Circuits",
          content: "Virtual circuit switching sits in between: a path is set up first (like circuit switching), but links are still shared as packets (like packet switching). Each packet carries a short circuit ID instead of a full address. MPLS and older ATM/Frame Relay networks use this approach. The datagram approach (plain IP) routes every packet independently."
        },
        {
          type: "quickCheck",
          question: "The internet mainly uses:",
          options: ["Circuit switching", "Datagram packet switching", "Message switching", "Virtual circuits only"],
          answer: 1,
          explanation: "IP routes each packet independently; there's no reserved end-to-end path."
        },
        {
          type: "takeaways",
          items: ["Fibre = highest bandwidth and distance.", "Circuit switching reserves resources; packet switching shares them; the internet is packet-switched."]
        }
      ]
    }
  },
  {
    id: "network-performance-delays",
    slug: "network-performance-delays",
    title: "Bandwidth, Throughput and the Four Delays",
    description: "Transmission, propagation, queuing and processing delay, plus bandwidth-delay product numericals.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Delays a Packet Experiences at Each Hop",
          headers: ["Delay", "Cause", "Formula"],
          rows: [
            ["Transmission delay (Tt)", "Pushing all of the packet's bits onto the link", "L / B (packet length / bandwidth)"],
            ["Propagation delay (Tp)", "The signal travelling along the link", "d / v (distance / signal speed, ~2 × 10^8 m/s in cable or fibre)"],
            ["Queuing delay", "Waiting in the router's buffer", "Depends on traffic load"],
            ["Processing delay", "Header checks, route lookup", "Usually microseconds"]
          ]
        },
        {
          type: "dryRun",
          title: "Worked Example",
          iterations: [
            { step: "Given", variables: { "Packet": "1000 bytes", "Bandwidth": "1 Mbps", "Distance": "2000 km", "Speed": "2 × 10^8 m/s" }, description: "" },
            { step: "Tt", variables: { "L / B": "8000 bits / 10^6 bps = 8 ms" }, description: "Convert bytes to bits first: × 8." },
            { step: "Tp", variables: { "d / v": "2 × 10^6 m / 2 × 10^8 m/s = 10 ms" }, description: "" },
            { step: "Total (ignoring queuing)", variables: { "Tt + Tp": "18 ms" }, description: "" },
            { step: "Bandwidth-delay product", variables: { "B × Tp": "10^6 × 0.01 = 10,000 bits" }, description: "How many bits are 'in flight' on the link at once. It decides how big a sliding window must be to keep the link busy." }
          ]
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Mixing bytes and bits. Bandwidth is in bits per second, file sizes are usually in bytes.",
            "In networking, 1 Mbps = 10^6 bps (decimal), while 1 KB of memory is often 1024 bytes. Read the question's convention.",
            "Thinking a faster link reduces propagation delay. Bandwidth affects only transmission delay; propagation depends on distance."
          ]
        },
        {
          type: "text",
          title: "Bandwidth vs Throughput vs Latency",
          content: "Bandwidth: the maximum rate a link supports.\nThroughput: the rate actually achieved end to end, limited by the slowest (bottleneck) link, congestion and protocol overhead.\nLatency: the time for one bit to travel from source to destination. A satellite link can have high bandwidth but terrible latency."
        },
        {
          type: "quickCheck",
          question: "Upgrading a link from 10 Mbps to 100 Mbps changes which delay?",
          options: ["Propagation delay", "Transmission delay", "Both equally", "Neither"],
          answer: 1,
          explanation: "Transmission delay L/B shrinks 10×. Propagation delay depends only on distance and signal speed."
        },
        {
          type: "takeaways",
          items: ["Tt = L/B, Tp = d/v. Convert bytes to bits.", "Bandwidth-delay product = bits in flight; windows must cover it."]
        }
      ]
    }
  }
];

export const osiModelLessons: CourseLesson[] = [
  {
    id: "osi-seven-layers",
    slug: "osi-seven-layers",
    title: "The OSI Model: Seven Layers",
    description: "Each layer's job, its data unit, devices and protocols, and why networks are layered at all.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Why Layering?",
          content: "Networking is split into layers so that each one solves one problem and relies only on the layer below it. You can switch from Wi-Fi to Ethernet (lower layers) without changing your browser (top layer). The OSI model is the 7-layer reference model used for teaching and discussion. Real networks run the simpler TCP/IP stack."
        },
        {
          type: "table",
          title: "The Seven Layers (top to bottom)",
          headers: ["#", "Layer", "Responsibility", "Data unit", "Examples"],
          rows: [
            ["7", "Application", "Network services for applications", "Data / message", "HTTP, DNS, SMTP, FTP"],
            ["6", "Presentation", "Formatting, encryption, compression", "Data", "TLS (often placed here), JPEG, UTF-8"],
            ["5", "Session", "Opening, managing and closing sessions; checkpoints", "Data", "RPC, NetBIOS"],
            ["4", "Transport", "Process-to-process delivery, reliability, flow control, ports", "Segment (TCP) / datagram (UDP)", "TCP, UDP"],
            ["3", "Network", "Logical addressing and routing across networks", "Packet", "IP, ICMP, routers"],
            ["2", "Data link", "Node-to-node delivery on one link, framing, MAC addresses, error detection", "Frame", "Ethernet, Wi-Fi (802.11), switches"],
            ["1", "Physical", "Sending raw bits as signals", "Bit", "Cables, hubs, repeaters, radio"]
          ]
        },
        {
          type: "callout",
          title: "Mnemonic",
          content: "Top to bottom: All People Seem To Need Data Processing (Application, Presentation, Session, Transport, Network, Data link, Physical). Bottom to top: Please Do Not Throw Sausage Pizza Away."
        },
        {
          type: "table",
          title: "Delivery Scope by Layer",
          headers: ["Layer", "Delivers between", "Address used"],
          rows: [
            ["Data link", "Neighbouring nodes (hop to hop)", "MAC address (48-bit)"],
            ["Network", "Source host → destination host, across many hops", "IP address"],
            ["Transport", "Source process → destination process", "Port number (16-bit)"]
          ]
        },
        {
          type: "quickCheck",
          question: "Which layer is responsible for routing packets between different networks?",
          options: ["Data link", "Network", "Transport", "Session"],
          answer: 1,
          explanation: "The network layer (IP) handles logical addressing and choosing paths across networks."
        },
        {
          type: "takeaways",
          items: [
            "7 layers: Application, Presentation, Session, Transport, Network, Data link, Physical.",
            "Data units: bit → frame → packet → segment → data.",
            "MAC = hop to hop; IP = host to host; port = process to process."
          ]
        }
      ]
    }
  },
  {
    id: "tcp-ip-model-and-encapsulation",
    slug: "tcp-ip-model-and-encapsulation",
    title: "The TCP/IP Model and Encapsulation",
    description: "How the 4/5-layer internet stack maps to OSI, and how headers are added and removed on the way.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "table",
          title: "OSI vs TCP/IP",
          headers: ["TCP/IP layer", "Corresponding OSI layers", "Protocols"],
          rows: [
            ["Application", "Application + Presentation + Session", "HTTP, DNS, SMTP, TLS, SSH"],
            ["Transport", "Transport", "TCP, UDP, QUIC (over UDP)"],
            ["Internet", "Network", "IP, ICMP"],
            ["Link (network access)", "Data link + Physical", "Ethernet, Wi-Fi, ARP"]
          ]
        },
        {
          type: "code",
          title: "Encapsulation on the Sender",
          language: "text",
          code: "Application:  [ HTTP request data ]\nTransport:    [ TCP hdr | HTTP data ]                              = segment\nNetwork:      [ IP hdr | TCP hdr | HTTP data ]                     = packet\nData link:    [ Eth hdr | IP hdr | TCP hdr | HTTP data | Eth trailer(CRC) ] = frame\nPhysical:     01101001...                                          = bits",
          explanation: "Each layer adds its own header (the data link layer also adds a trailer). The receiver removes them in reverse order (decapsulation). Routers only look up to the IP header; switches only up to the Ethernet header."
        },
        {
          type: "table",
          title: "OSI vs TCP/IP: Key Differences",
          headers: ["OSI", "TCP/IP"],
          rows: [
            ["7 layers, a reference model", "4 (or 5) layers, the stack actually used"],
            ["Model defined first, protocols later", "Protocols came first, then the model"],
            ["Clean separation of session and presentation", "Applications handle those themselves"]
          ]
        },
        {
          type: "quickCheck",
          question: "Which header does a router need to read in order to forward a packet?",
          options: ["HTTP header", "TCP header", "IP header", "Only the Ethernet trailer"],
          answer: 2,
          explanation: "Routers are layer-3 devices: they decapsulate the frame, read the IP destination, then re-encapsulate it in a new frame for the next hop."
        },
        {
          type: "takeaways",
          items: ["TCP/IP: Application, Transport, Internet, Link.", "Each layer wraps the data from above with its own header; the receiver unwraps in reverse."]
        }
      ]
    }
  },
  {
    id: "devices-and-domains",
    slug: "devices-and-domains",
    title: "Collision Domains, Broadcast Domains and Layer Mapping",
    description: "Counting collision and broadcast domains in a topology, a favourite interview and GATE question.",
    estimatedMinutes: 12,
    content: {
      sections: [
        {
          type: "text",
          title: "Definitions",
          content: "Collision domain: the part of the network where two simultaneous transmissions collide. Hubs extend a collision domain; each switch or router port starts a new one.\n\nBroadcast domain: the set of devices that receive a layer-2 broadcast (such as an ARP request). Hubs and switches pass broadcasts on; router interfaces (and VLANs) separate them."
        },
        {
          type: "dryRun",
          title: "Count the Domains",
          iterations: [
            { step: "Topology", variables: { "Router": "2 interfaces", "Interface 1": "switch with 4 PCs", "Interface 2": "hub with 3 PCs" }, description: "" },
            { step: "Collision domains", variables: { "Switch side": "4 (one per switch port to a PC) + 1 (switch ↔ router link)", "Hub side": "1 (the whole hub + its link to the router)", "Total": "6" }, description: "" },
            { step: "Broadcast domains", variables: { "Total": "2 (one per router interface)" }, description: "" }
          ]
        },
        {
          type: "quickCheck",
          question: "A single 24-port switch (no VLANs) with 24 PCs connected has:",
          options: ["1 collision domain, 24 broadcast domains", "24 collision domains, 1 broadcast domain", "24 of each", "1 of each"],
          answer: 1,
          explanation: "Each switch port is its own collision domain, but broadcasts reach every port: one broadcast domain."
        },
        {
          type: "takeaways",
          items: ["Hub: one shared collision domain. Switch: one per port. Router: one broadcast domain per interface."]
        }
      ]
    }
  }
];

export const dataLinkLessons: CourseLesson[] = [
  {
    id: "framing-and-error-detection",
    slug: "framing-and-error-detection",
    title: "Framing and Error Detection: Parity, Checksum, CRC",
    description: "How frames are delimited, and how receivers detect corrupted bits, with a full CRC calculation.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Framing",
          content: "The data link layer splits the bit stream into frames so the receiver knows where each one starts and ends.\nCharacter count: the header states the frame length (fragile: one corrupted count desynchronizes everything after it).\nByte stuffing: a flag byte marks the frame boundaries; if the flag value appears in the data, an escape byte is inserted before it.\nBit stuffing (HDLC): the flag is 01111110; after five consecutive 1s in the data, the sender inserts a 0 so the flag pattern never appears inside the data."
        },
        {
          type: "table",
          title: "Error-Detection Techniques",
          headers: ["Method", "How", "Detects", "Used in"],
          rows: [
            ["Single parity bit", "Add 1 bit so the count of 1s is even (or odd)", "Any odd number of bit errors; misses even-numbered errors", "Memory, simple serial links"],
            ["2-D parity", "Parity for every row and column", "All 1-, 2- and 3-bit errors; can correct single-bit errors", "Teaching example"],
            ["Checksum", "One's-complement sum of 16-bit words", "Many errors; weaker than CRC", "IP, TCP, UDP headers"],
            ["CRC", "Remainder of polynomial (modulo-2) division", "All burst errors of length ≤ degree of the generator, and more", "Ethernet, Wi-Fi frames"]
          ]
        },
        {
          type: "dryRun",
          title: "CRC: Data 100100, Generator 1101 (x³ + x² + 1)",
          iterations: [
            { step: 1, variables: { "Degree r": "3", "Appended data": "100100 000" }, description: "Append r zeros to the data." },
            { step: 2, variables: { "Divide (XOR)": "100100000 ÷ 1101" }, description: "Long division with XOR instead of subtraction, and no carries." },
            { step: 3, variables: { "Remainder": "001" }, description: "This is the CRC." },
            { step: 4, variables: { "Transmitted": "100100 001" }, description: "Data followed by the CRC." },
            { step: 5, variables: { "Receiver": "100100001 ÷ 1101 → remainder 000" }, description: "Zero remainder: no error detected. If a bit flips (e.g. 100100011), the remainder is non-zero (010), so the error is detected." }
          ]
        },
        {
          type: "text",
          title: "Detection vs Correction",
          content: "Detecting errors needs less redundancy than correcting them. Hamming distance d is the minimum number of bit positions in which two valid codewords differ.\nTo detect s errors you need d ≥ s + 1. To correct t errors you need d ≥ 2t + 1.\nHamming codes correct single-bit errors using r check bits, where 2^r ≥ m + r + 1 (m = data bits)."
        },
        {
          type: "quickCheck",
          question: "Using even parity, which received byte definitely contains an error?",
          options: ["10110100", "11110000", "10000001", "11100000"],
          answer: 3,
          explanation: "11100000 has three 1s (odd), which breaks even parity. The others each have an even number of 1s."
        },
        {
          type: "takeaways",
          items: [
            "Bit stuffing inserts a 0 after five 1s so the 01111110 flag stays unique.",
            "CRC: append r zeros, divide using XOR, send the remainder; the receiver expects remainder 0.",
            "Detect s errors: d ≥ s + 1. Correct t errors: d ≥ 2t + 1."
          ]
        }
      ]
    }
  },
  {
    id: "flow-control-sliding-window",
    slug: "flow-control-sliding-window",
    title: "Flow Control: Stop-and-Wait, Go-Back-N, Selective Repeat",
    description: "Link efficiency, window sizes and sequence-number bits, with numericals.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Stop-and-Wait",
          content: "Send one frame, then wait for its ACK before sending the next. It's simple but wastes the link while waiting.\n\nEfficiency η = Tt / (Tt + 2Tp) = 1 / (1 + 2a), where a = Tp / Tt.\n\nFrom the delay lesson: Tt = 8 ms and Tp = 10 ms, so a = 1.25 and η = 1 / 3.5 ≈ 28.6%. The link is idle more than 70% of the time."
        },
        {
          type: "text",
          title: "Sliding Window (Pipelining)",
          content: "Send up to N frames before needing an ACK. To keep the link 100% busy, N ≥ 1 + 2a. In the example, 1 + 2(1.25) = 3.5, so a window of 4 frames is needed.\n\nEfficiency with window N = min(1, N / (1 + 2a))."
        },
        {
          type: "table",
          title: "Go-Back-N vs Selective Repeat",
          headers: ["", "Go-Back-N (GBN)", "Selective Repeat (SR)"],
          rows: [
            ["Sender window", "N", "N"],
            ["Receiver window", "1 (accepts only the next in-order frame)", "N (buffers out-of-order frames)"],
            ["On a lost frame", "Resend it AND every frame sent after it", "Resend only the lost frame"],
            ["ACKs", "Cumulative", "Individual"],
            ["Max window with k-bit sequence numbers", "2^k − 1", "2^(k − 1)"],
            ["Complexity", "Simple receiver", "Receiver needs buffers and sorting"]
          ]
        },
        {
          type: "think",
          question: "With 3-bit sequence numbers (0-7), why can't Selective Repeat use a window of 5?",
          answerReveal: "If all the ACKs are lost, the sender resends frames 0-4. Meanwhile the receiver has moved its window to expect 5, 6, 7, 0, 1. The old frames 0 and 1 fall inside the new window and are wrongly accepted as new data. With a window of 2^(k−1) = 4, the old and new windows never overlap."
        },
        {
          type: "quickCheck",
          question: "Go-Back-N with 4-bit sequence numbers. What is the maximum sender window size?",
          options: ["16", "15", "8", "4"],
          answer: 1,
          explanation: "For GBN, the window is at most 2^k − 1 = 15."
        },
        {
          type: "takeaways",
          items: [
            "Stop-and-wait η = 1 / (1 + 2a), with a = Tp / Tt.",
            "A window of 1 + 2a frames fills the pipe.",
            "GBN: window ≤ 2^k − 1, resend everything after a loss. SR: window ≤ 2^(k−1), resend only what was lost."
          ]
        }
      ]
    }
  },
  {
    id: "mac-protocols",
    slug: "mac-protocols",
    title: "Medium Access Control: ALOHA, CSMA/CD, CSMA/CA",
    description: "How devices share one channel, ALOHA efficiency, CSMA/CD minimum frame size, and why Wi-Fi avoids collisions.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Random-Access Protocols",
          headers: ["Protocol", "Rule", "Max efficiency"],
          rows: [
            ["Pure ALOHA", "Send whenever you have data; if no ACK arrives, wait a random time and resend", "1/(2e) ≈ 18.4%"],
            ["Slotted ALOHA", "Send only at the start of a time slot", "1/e ≈ 36.8%"],
            ["CSMA", "Listen first; send only if the channel is idle", "Better, but collisions still happen because of propagation delay"],
            ["CSMA/CD", "CSMA + stop as soon as a collision is detected, then use exponential backoff", "Classic shared Ethernet"],
            ["CSMA/CA", "Avoid collisions: wait random backoff slots, optionally reserve with RTS/CTS, and use ACKs", "Wi-Fi (802.11)"]
          ]
        },
        {
          type: "text",
          title: "CSMA/CD Minimum Frame Size",
          content: "A sender must still be transmitting when news of a collision gets back to it, otherwise it can't know its frame collided. So:\nTt ≥ 2 × Tp, which gives minimum frame size L = 2 × Tp × B.\n\nClassic 10 Mbps Ethernet: the slot time (worst-case round trip) is 51.2 μs, so L = 51.2 × 10^-6 × 10^7 = 512 bits = 64 bytes. That's why Ethernet frames are at least 64 bytes and short frames are padded."
        },
        {
          type: "text",
          title: "Binary Exponential Backoff",
          content: "After the n-th collision, a station waits K × slot time, where K is chosen at random from 0 to 2^min(n, 10) − 1. After 16 failed attempts it gives up. Repeated collisions spread retries further apart, so the channel calms down."
        },
        {
          type: "think",
          question: "Why does Wi-Fi use collision avoidance (CA) instead of collision detection (CD)?",
          answerReveal: "A radio can't easily listen while it transmits (its own signal drowns out everything else), and the hidden-terminal problem means two stations may not hear each other even though both reach the access point. So Wi-Fi avoids collisions using random backoff, RTS/CTS reservations and ACKs for every frame."
        },
        {
          type: "quickCheck",
          question: "A CSMA/CD network runs at 100 Mbps with a maximum one-way propagation delay of 5 μs. What is the minimum frame size?",
          options: ["500 bits", "1000 bits", "125 bits", "64 bytes always"],
          answer: 1,
          explanation: "L = 2 × Tp × B = 2 × 5 × 10^-6 × 10^8 = 1000 bits."
        },
        {
          type: "takeaways",
          items: [
            "Pure ALOHA 18.4%, slotted ALOHA 36.8%.",
            "CSMA/CD minimum frame size = 2 × Tp × B (64 bytes for classic Ethernet).",
            "Wi-Fi uses CSMA/CA because collisions can't be detected reliably over radio."
          ]
        }
      ]
    }
  },
  {
    id: "ethernet-switching-vlans",
    slug: "ethernet-switching-vlans",
    title: "Ethernet, MAC Addresses, Switch Learning, STP and VLANs",
    description: "How switches learn where devices are, how loops are prevented, and how VLANs split one switch into many LANs.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "MAC Addresses",
          content: "A MAC address is a 48-bit hardware address burned into each network interface, written as six hex pairs (3C:52:82:1A:9F:04). The first 24 bits (OUI) identify the manufacturer. FF:FF:FF:FF:FF:FF is the broadcast address. MAC addresses only matter on the local link; routers replace the Ethernet header at every hop, while the IP addresses stay the same end to end (unless NAT is involved)."
        },
        {
          type: "code",
          title: "Ethernet Frame (simplified)",
          language: "text",
          code: "| Preamble 7B | SFD 1B | Dest MAC 6B | Src MAC 6B | Type 2B | Payload 46-1500B | CRC 4B |",
          explanation: "The Type field (e.g. 0x0800 = IPv4, 0x0806 = ARP) tells the receiver which protocol is inside. The 46-byte minimum payload is what pads frames up to the 64-byte minimum."
        },
        {
          type: "text",
          title: "How a Switch Learns",
          content: "1. A frame arrives on port 3 from MAC A. The switch records 'A is on port 3' in its MAC table.\n2. It looks up the destination MAC:\n   known → forward only to that port (filtering);\n   unknown or broadcast → send out of every port except the incoming one (flooding).\n3. Entries expire after a timeout (often 300 s), so a device that moves is relearned.\nThe switch learns entirely from source addresses; nobody configures the table."
        },
        {
          type: "text",
          title: "Spanning Tree Protocol (STP)",
          content: "Redundant links between switches create loops. A broadcast frame would circulate forever and multiply (a broadcast storm), because Ethernet frames have no TTL. STP (802.1D) elects a root bridge and blocks redundant ports so the active topology becomes a loop-free tree. If a link fails, a blocked port is re-enabled. RSTP (802.1w) converges much faster."
        },
        {
          type: "text",
          title: "VLANs",
          content: "A VLAN logically splits one physical switch into several isolated broadcast domains (for example, separate VLANs for students, staff and the server room). Traffic between VLANs must go through a router or a layer-3 switch. Trunk links carry several VLANs between switches by tagging each frame with a 12-bit VLAN ID (802.1Q), which allows up to 4094 usable VLANs."
        },
        {
          type: "quickCheck",
          question: "A switch receives a frame whose destination MAC isn't in its table. It will:",
          options: ["Drop the frame", "Send it back to the sender", "Flood it out of all ports except the incoming one", "Forward it to the router only"],
          answer: 2,
          explanation: "Unknown unicast frames are flooded. When the destination replies, the switch learns its port."
        },
        {
          type: "takeaways",
          items: [
            "MAC = 48-bit link-local hardware address; it changes at every hop, while IP stays end to end.",
            "Switches learn from source MACs, forward to known ports, and flood unknown destinations.",
            "STP blocks loops; VLANs split broadcast domains; 802.1Q tags frames on trunks."
          ]
        }
      ]
    }
  }
];
