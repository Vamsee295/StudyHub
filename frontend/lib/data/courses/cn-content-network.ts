// Computer Networks Modules 4-5: Network Layer, Subnetting
import { CourseLesson } from './types';

export const networkLayerLessons: CourseLesson[] = [
  {
    id: "ipv4-addressing-and-header",
    slug: "ipv4-addressing-and-header",
    title: "IPv4 Addressing, Classes and the IP Header",
    description: "Address structure, classful ranges, private addresses, key header fields and fragmentation.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "IPv4 Addresses",
          content: "An IPv4 address is 32 bits, written as four decimal octets (192.168.1.10). It has two parts: the network ID (which network) and the host ID (which device on that network). A subnet mask or prefix length (/24) says where the split is.\n\nIPv4 has 2^32 ≈ 4.3 billion addresses, which isn't enough. CIDR, NAT and IPv6 exist because of that shortage."
        },
        {
          type: "table",
          title: "Classful Addressing (historical, still asked in exams)",
          headers: ["Class", "First octet", "Leading bits", "Default mask", "Networks / hosts per network"],
          rows: [
            ["A", "1 – 126", "0", "/8 (255.0.0.0)", "126 networks, 2^24 − 2 hosts"],
            ["B", "128 – 191", "10", "/16 (255.255.0.0)", "2^14 networks, 2^16 − 2 hosts"],
            ["C", "192 – 223", "110", "/24 (255.255.255.0)", "2^21 networks, 254 hosts"],
            ["D", "224 – 239", "1110", "–", "Multicast"],
            ["E", "240 – 255", "1111", "–", "Reserved / experimental"]
          ]
        },
        {
          type: "table",
          title: "Special Addresses",
          headers: ["Range", "Purpose"],
          rows: [
            ["10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16", "Private (RFC 1918); not routed on the internet; used behind NAT"],
            ["127.0.0.0/8", "Loopback (127.0.0.1 = this machine)"],
            ["169.254.0.0/16", "Link-local (a DHCP server wasn't found)"],
            ["Host bits all 0", "The network address itself"],
            ["Host bits all 1", "Directed broadcast for that network"],
            ["255.255.255.255", "Limited broadcast (this local network)"]
          ]
        },
        {
          type: "table",
          title: "Key IPv4 Header Fields (20-60 bytes)",
          headers: ["Field", "Purpose"],
          rows: [
            ["Version, IHL", "4; header length in 32-bit words (min 5 = 20 bytes)"],
            ["Total length", "Header + data, up to 65,535 bytes"],
            ["Identification, Flags (DF, MF), Fragment offset", "Fragmentation and reassembly"],
            ["TTL", "Decremented at each router; the packet is dropped at 0 (prevents endless loops)"],
            ["Protocol", "What's inside: 6 = TCP, 17 = UDP, 1 = ICMP"],
            ["Header checksum", "Covers the header only; recomputed at each hop (because TTL changes)"],
            ["Source / destination address", "32 bits each"]
          ]
        },
        {
          type: "dryRun",
          title: "Fragmentation: 4000-byte datagram (20 header + 3980 data), link MTU 1500",
          iterations: [
            { step: 1, variables: { "Max data per fragment": "1500 − 20 = 1480 bytes (a multiple of 8 ✓)" }, description: "The fragment offset is counted in 8-byte units, so data sizes (except the last) must be multiples of 8." },
            { step: 2, variables: { "Fragment 1": "data 1480, offset 0, MF = 1" }, description: "" },
            { step: 3, variables: { "Fragment 2": "data 1480, offset 1480/8 = 185, MF = 1" }, description: "" },
            { step: 4, variables: { "Fragment 3": "data 3980 − 2960 = 1020, offset 2960/8 = 370, MF = 0" }, description: "The last fragment has MF = 0. Total lengths: 1500, 1500, 1040." },
            { step: "Note", variables: { "Reassembly": "only at the destination host" }, description: "Routers fragment but never reassemble. IPv6 routers don't fragment at all; senders use path-MTU discovery." }
          ]
        },
        {
          type: "quickCheck",
          question: "Which of these is a private IPv4 address?",
          options: ["172.32.10.5", "192.169.1.1", "10.45.2.8", "11.0.0.1"],
          answer: 2,
          explanation: "10.0.0.0/8 is private. 172.32.x.x is outside 172.16.0.0/12 (which ends at 172.31.255.255), and 192.169.x.x isn't in 192.168.0.0/16."
        },
        {
          type: "takeaways",
          items: [
            "IPv4 = 32 bits split into network and host parts by the mask.",
            "Private ranges: 10/8, 172.16/12, 192.168/16.",
            "Fragment offsets are in 8-byte units; only the destination reassembles."
          ]
        }
      ]
    }
  },
  {
    id: "arp-dhcp-icmp-nat",
    slug: "arp-dhcp-icmp-nat",
    title: "ARP, DHCP, ICMP and NAT",
    description: "The helper protocols that make IP work: finding MACs, getting an address, error reporting and address sharing.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "table",
          title: "The Helper Protocols",
          headers: ["Protocol", "Problem it solves", "How"],
          rows: [
            ["ARP", "I know the next hop's IP; what is its MAC?", "Broadcast 'Who has 192.168.1.1?'; the owner replies with its MAC by unicast; the answer is cached"],
            ["DHCP", "A new device needs an IP address, mask, gateway and DNS server", "DORA: Discover (broadcast) → Offer → Request → Acknowledge; addresses are leased for a time"],
            ["ICMP", "Report errors and diagnose problems", "Echo request/reply (ping), destination unreachable, time exceeded (used by traceroute)"],
            ["NAT", "Many private devices share one public IP", "The router rewrites source IP:port and keeps a translation table"]
          ]
        },
        {
          type: "code",
          title: "ARP and DHCP in Action (what you can observe)",
          language: "bash",
          code: "# Show the ARP cache (IP -> MAC mappings)\narp -a\n\n# Renew a DHCP lease\nipconfig /renew          # Windows\nsudo dhclient -r && sudo dhclient   # Linux\n\n# ICMP\nping 8.8.8.8              # echo request / reply\ntracert google.com        # Windows; traceroute on Linux/macOS",
          explanation: "traceroute sends packets with TTL = 1, 2, 3, ... Each router that drops a packet when its TTL reaches 0 sends back an ICMP 'time exceeded', which reveals that router's address."
        },
        {
          type: "text",
          title: "How NAT (PAT) Works",
          content: "Laptop 192.168.1.5:50000 → server 142.250.1.1:443.\nThe home router replaces the source with its public address and a free port: 49.36.10.20:61001. It records 61001 ↔ 192.168.1.5:50000.\nThe reply arrives at 49.36.10.20:61001; the router looks up its table and forwards it to 192.168.1.5:50000.\n\nSide effects: devices behind NAT can't receive unsolicited inbound connections (which needs port forwarding), and it breaks end-to-end addressing. Saving IPv4 addresses is its main benefit."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "ARP is used to find the MAC of a host on another network. True?",
              trap: "Saying yes.",
              solution: "No. ARP works only within the local network. For a remote destination, the host ARPs for its default gateway's MAC and sends the frame to the router. The IP destination stays the remote host."
            },
            {
              question: "Why does DHCP Discover use broadcast?",
              trap: "Saying 'to be fast'.",
              solution: "The client has no IP address yet and doesn't know the DHCP server's address, so it sends from 0.0.0.0 to 255.255.255.255. In larger networks, relay agents forward these broadcasts to a central server."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "traceroute discovers each router along a path by relying on:",
          options: ["ARP replies", "ICMP time-exceeded messages", "DHCP offers", "DNS lookups"],
          answer: 1,
          explanation: "Each router that decrements the TTL to 0 drops the packet and sends back ICMP 'time exceeded', revealing its address."
        },
        {
          type: "takeaways",
          items: [
            "ARP: IP → MAC on the local link. DHCP: automatic configuration (DORA).",
            "ICMP: ping and traceroute. NAT: many private hosts behind one public IP using port translation."
          ]
        }
      ]
    }
  },
  {
    id: "routing-algorithms",
    slug: "routing-algorithms",
    title: "Routing: Distance Vector, Link State, RIP, OSPF and BGP",
    description: "How routers build their tables, count-to-infinity, Dijkstra-based routing, and routing between ISPs.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Forwarding vs Routing",
          content: "Forwarding: the per-packet action of looking up the destination in the table and sending the packet out of the right interface (nanoseconds, in hardware).\nRouting: the background process of building that table by exchanging information with other routers (seconds, in software)."
        },
        {
          type: "table",
          title: "Distance Vector vs Link State",
          headers: ["", "Distance vector", "Link state"],
          rows: [
            ["Each router knows", "Only distances advertised by its neighbours", "The full topology map"],
            ["Shares", "Its whole table, with its neighbours only", "Its own links, flooded to every router"],
            ["Algorithm", "Bellman-Ford: D(x→y) = min over neighbours v of { c(x,v) + D(v→y) }", "Dijkstra's shortest path"],
            ["Convergence", "Slow; count-to-infinity problem", "Fast"],
            ["Protocols", "RIP (metric = hop count, max 15)", "OSPF, IS-IS"]
          ]
        },
        {
          type: "text",
          title: "Count-to-Infinity",
          content: "Line topology A — B — C. A reaches C at cost 2 through B. The link B—C fails. B no longer reaches C directly, but A advertises 'I can reach C at cost 2', so B believes it can get there through A at cost 3. Then A updates to 4 through B, B to 5, and so on, increasing until the cost reaches 'infinity' (16 in RIP).\n\nMitigations: split horizon (don't advertise a route back to the neighbour you learned it from), poison reverse (advertise it back with an infinite cost), and route timeouts."
        },
        {
          type: "table",
          title: "Interior vs Exterior Routing",
          headers: ["Scope", "Protocol", "Notes"],
          rows: [
            ["Inside one organization (an autonomous system)", "OSPF, RIP, IS-IS (IGPs)", "Optimize path cost"],
            ["Between autonomous systems (ISPs)", "BGP (EGP)", "A path-vector protocol; policy-driven (business agreements), not just shortest path"]
          ]
        },
        {
          type: "quickCheck",
          question: "Which protocol uses Dijkstra's algorithm on a full topology map?",
          options: ["RIP", "OSPF", "BGP", "ARP"],
          answer: 1,
          explanation: "OSPF is a link-state protocol: every router floods its link-state advertisements and runs Dijkstra's algorithm locally."
        },
        {
          type: "takeaways",
          items: [
            "Distance vector: Bellman-Ford, neighbours only, count-to-infinity (RIP).",
            "Link state: flood the topology, run Dijkstra, fast convergence (OSPF).",
            "BGP routes between ISPs based on policy."
          ]
        }
      ]
    }
  },
  {
    id: "ipv6",
    slug: "ipv6",
    title: "IPv6",
    description: "Why IPv6 exists, address notation, what changed in the header, and how IPv4 and IPv6 coexist.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Addresses",
          content: "IPv6 addresses are 128 bits (2^128 ≈ 3.4 × 10^38), written as eight groups of four hex digits:\n2001:0db8:0000:0000:0000:ff00:0042:8329\nShortening rules: drop leading zeros in each group, and replace ONE run of all-zero groups with ::\n→ 2001:db8::ff00:42:8329\n::1 is loopback. fe80::/10 is link-local. Global unicast addresses usually come from 2000::/3."
        },
        {
          type: "table",
          title: "IPv4 vs IPv6",
          headers: ["", "IPv4", "IPv6"],
          rows: [
            ["Address size", "32 bits", "128 bits"],
            ["Header", "20-60 bytes, variable, has a checksum", "Fixed 40 bytes, no checksum; options moved into extension headers"],
            ["Fragmentation", "By routers and senders", "Only by the sender (path-MTU discovery)"],
            ["Configuration", "Manual or DHCP", "SLAAC (self-configuration) or DHCPv6"],
            ["Broadcast", "Yes", "No; multicast and anycast instead"],
            ["ARP", "ARP", "Neighbour Discovery (ICMPv6)"],
            ["NAT", "Common", "Not needed"]
          ]
        },
        {
          type: "text",
          title: "Transition Mechanisms",
          content: "Dual stack: devices run IPv4 and IPv6 side by side (the most common approach).\nTunnelling: IPv6 packets are carried inside IPv4 packets across IPv4-only parts of the network.\nTranslation (NAT64/DNS64): lets IPv6-only clients reach IPv4-only servers."
        },
        {
          type: "quickCheck",
          question: "Which is a valid compressed form of 2001:0db8:0000:0000:0000:0000:1428:57ab?",
          options: ["2001:db8::1428:57ab", "2001:db8:::1428:57ab", "2001:db8::0::1428:57ab", "2001::db8::1428:57ab"],
          answer: 0,
          explanation: ":: may appear only once and replaces the consecutive zero groups; leading zeros are dropped."
        },
        {
          type: "takeaways",
          items: ["IPv6 = 128-bit addresses, fixed 40-byte header, no broadcast, no router fragmentation.", ":: can be used only once per address."]
        }
      ]
    }
  }
];

export const subnettingLessons: CourseLesson[] = [
  {
    id: "subnet-masks-and-cidr",
    slug: "subnet-masks-and-cidr",
    title: "Subnet Masks and CIDR: Network, Broadcast and Host Range",
    description: "The step-by-step method to find the network address, broadcast address and usable hosts for any address/prefix.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "CIDR Notation",
          content: "CIDR (Classless Inter-Domain Routing) writes the prefix length explicitly: 192.168.10.77/26 means the first 26 bits are the network part.\nNetwork address = IP AND mask. Hosts per subnet = 2^(32 − prefix) − 2 (the network and broadcast addresses are reserved)."
        },
        {
          type: "table",
          title: "Prefix Cheat Sheet (last octet)",
          headers: ["Prefix", "Mask", "Block size", "Usable hosts"],
          rows: [
            ["/24", "255.255.255.0", "256", "254"],
            ["/25", "255.255.255.128", "128", "126"],
            ["/26", "255.255.255.192", "64", "62"],
            ["/27", "255.255.255.224", "32", "30"],
            ["/28", "255.255.255.240", "16", "14"],
            ["/29", "255.255.255.248", "8", "6"],
            ["/30", "255.255.255.252", "4", "2 (point-to-point links)"]
          ]
        },
        {
          type: "dryRun",
          title: "Analyse 192.168.10.77/26",
          iterations: [
            { step: 1, variables: { "Mask": "255.255.255.192", "Interesting octet": "4th" }, description: "26 bits = 8 + 8 + 8 + 2, so the split is inside the 4th octet." },
            { step: 2, variables: { "Block size": "256 − 192 = 64" }, description: "Subnets start at 0, 64, 128, 192." },
            { step: 3, variables: { "77 falls in": "64 – 127" }, description: "" },
            { step: 4, variables: { "Network": "192.168.10.64", "Broadcast": "192.168.10.127" }, description: "" },
            { step: 5, variables: { "Usable range": ".65 – .126", "Hosts": "2^6 − 2 = 62" }, description: "" }
          ]
        },
        {
          type: "think",
          question: "Are 10.1.5.130/25 and 10.1.5.100/25 on the same subnet?",
          answerReveal: "No. With /25 the block size is 128, so the 4th-octet subnets are 0-127 and 128-255. .100 is in 10.1.5.0/25 and .130 is in 10.1.5.128/25. They need a router to communicate."
        },
        {
          type: "quickCheck",
          question: "What is the broadcast address of 172.16.45.200/27?",
          options: ["172.16.45.223", "172.16.45.255", "172.16.45.207", "172.16.45.192"],
          answer: 0,
          explanation: "/27 → block size 32 → subnets ..., 192, 224. 200 lies in 192-223, so the broadcast address is .223."
        },
        {
          type: "takeaways",
          items: [
            "Block size = 256 − mask octet. Find the block the address falls in.",
            "Network = start of the block, broadcast = end, hosts = 2^(host bits) − 2."
          ]
        }
      ]
    }
  },
  {
    id: "subnetting-and-vlsm",
    slug: "subnetting-and-vlsm",
    title: "Subnetting a Network and VLSM",
    description: "Splitting an address block into equal subnets, and variable-length subnets sized to real needs.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Fixed-Length Subnetting",
          content: "To create N equal subnets, borrow b host bits so that 2^b ≥ N.\n\nExample: split 192.168.1.0/24 into 4 subnets. b = 2, new prefix /26, block size 64.\n192.168.1.0/26 (hosts .1-.62)\n192.168.1.64/26 (.65-.126)\n192.168.1.128/26 (.129-.190)\n192.168.1.192/26 (.193-.254)\nEach has 62 usable hosts."
        },
        {
          type: "dryRun",
          title: "VLSM: from 192.168.1.0/24, departments need 100, 50 and 25 hosts",
          iterations: [
            { step: 1, variables: { "Rule": "allocate the largest requirement first" }, description: "This keeps every block aligned on its own boundary." },
            { step: "100 hosts", variables: { "Needs": "2^7 − 2 = 126 ≥ 100 → /25", "Subnet": "192.168.1.0/25 (.1 – .126)" }, description: "" },
            { step: "50 hosts", variables: { "Needs": "2^6 − 2 = 62 ≥ 50 → /26", "Subnet": "192.168.1.128/26 (.129 – .190)" }, description: "" },
            { step: "25 hosts", variables: { "Needs": "2^5 − 2 = 30 ≥ 25 → /27", "Subnet": "192.168.1.192/27 (.193 – .222)" }, description: "" },
            { step: "Left over", variables: { "Free": "192.168.1.224/27" }, description: "Kept for future use, e.g. several /30 point-to-point router links." }
          ]
        },
        {
          type: "quickCheck",
          question: "How many /28 subnets fit into a /24?",
          options: ["8", "14", "16", "32"],
          answer: 2,
          explanation: "28 − 24 = 4 borrowed bits gives 2^4 = 16 subnets, each with 14 usable hosts."
        },
        {
          type: "takeaways",
          items: [
            "N subnets need ⌈log2 N⌉ borrowed bits; H hosts need h bits with 2^h − 2 ≥ H.",
            "VLSM: allocate the biggest subnets first to avoid overlap and wasted space."
          ]
        }
      ]
    }
  },
  {
    id: "supernetting-longest-prefix",
    slug: "supernetting-longest-prefix",
    title: "Supernetting, Route Aggregation and Longest Prefix Match",
    description: "Combining routes to shrink routing tables, and how routers choose between overlapping routes.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Supernetting (Route Aggregation)",
          content: "Contiguous networks can be advertised as one shorter prefix.\n200.1.0.0/24, 200.1.1.0/24, 200.1.2.0/24 and 200.1.3.0/24 differ only in the last 2 bits of the third octet, so they combine into 200.1.0.0/22.\nConditions: the block count is a power of 2, the blocks are contiguous, and the first block starts on a boundary of the combined size (the third octet is divisible by 4 here)."
        },
        {
          type: "text",
          title: "Longest Prefix Match",
          content: "When several routing-table entries match a destination, the router uses the most specific one (the longest prefix).\n\nTable:\n10.0.0.0/8 → interface A\n10.1.0.0/16 → interface B\n10.1.2.0/24 → interface C\n\n10.1.2.5 matches all three → C (/24 is the longest)\n10.1.9.9 matches /8 and /16 → B\n10.200.0.1 matches only /8 → A\n0.0.0.0/0 (the default route) matches everything and is used only when nothing else matches."
        },
        {
          type: "quickCheck",
          question: "A router has routes 172.16.0.0/12 → X and 172.16.4.0/22 → Y. Where does it send a packet for 172.16.6.9?",
          options: ["X", "Y", "Both", "It drops the packet"],
          answer: 1,
          explanation: "172.16.4.0/22 covers 172.16.4.0 to 172.16.7.255, which includes 172.16.6.9, and /22 is longer than /12."
        },
        {
          type: "takeaways",
          items: ["Aggregate contiguous, aligned, power-of-2 blocks into one shorter prefix.", "Routers always pick the longest matching prefix; 0.0.0.0/0 is the fallback."]
        }
      ]
    }
  }
];
