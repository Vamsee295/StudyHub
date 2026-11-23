// Long-form theory for CN modules 4-5 (network layer, subnetting). Original writing.
import { LessonTheory } from './utils';

const SYSTEMS_APPROACH = { title: "Peterson and Davie, Computer Networks: A Systems Approach (free online)", url: "https://book.systemsapproach.org/", license: "CC BY 4.0" };
const STANFORD_CS144 = { title: "Stanford CS144: Introduction to Computer Networking", url: "https://cs144.github.io/" };
const RFC_791 = { title: "RFC 791: Internet Protocol", url: "https://www.rfc-editor.org/rfc/rfc791" };
const RFC_1918 = { title: "RFC 1918: Address Allocation for Private Internets", url: "https://www.rfc-editor.org/rfc/rfc1918" };
const RFC_4632 = { title: "RFC 4632: Classless Inter-domain Routing (CIDR)", url: "https://www.rfc-editor.org/rfc/rfc4632" };
const RFC_8200 = { title: "RFC 8200: Internet Protocol, Version 6 (IPv6)", url: "https://www.rfc-editor.org/rfc/rfc8200" };
const RFC_2131 = { title: "RFC 2131: Dynamic Host Configuration Protocol", url: "https://www.rfc-editor.org/rfc/rfc2131" };

export const cnNetworkTheory: Record<string, LessonTheory> = {
  "ipv4-addressing-and-header": {
    theory: `The Internet Protocol (IP) gives every device a logical address and moves packets from one network to another until they reach their destination. IPv4, defined in 1981, still carries most internet traffic. This lesson explains IPv4 addresses, the historical address classes, the special address ranges, the fields of the IPv4 header, and how fragmentation splits packets that are too large for a link.

## IPv4 addresses

An IPv4 address is 32 bits, written as four decimal numbers from 0 to 255 separated by dots, such as \`192.168.1.10\`. Each number is one byte, or octet. The address has two parts:

- **Network part**: identifies which network the device is on
- **Host part**: identifies the device within that network

A **subnet mask** or **prefix length** says where the split falls. In \`192.168.1.10/24\`, the first 24 bits (\`192.168.1\`) are the network and the last 8 bits identify the host. Routers forward packets by looking only at the network part, which keeps routing tables manageable.

## Why IPv4 ran out

32 bits allow about 4.3 billion addresses, which seemed plenty in 1981. With phones, laptops, servers and smart devices, the world now has far more devices than that. The regional registries handed out their last large free blocks between 2011 and 2019. Classless addressing (CIDR), network address translation (NAT) and IPv6 are the three responses, and each has its own lesson.

## Classful addressing

Before 1993, the first bits of an address fixed the size of its network:

| Class | First octet | Leading bits | Default mask | Hosts per network |
|---|---|---|---|---|
| A | 1 to 126 | 0 | /8 | about 16.7 million |
| B | 128 to 191 | 10 | /16 | 65,534 |
| C | 192 to 223 | 110 | /24 | 254 |
| D | 224 to 239 | 1110 | – | Multicast groups |
| E | 240 to 255 | 1111 | – | Reserved |

Classes wasted addresses badly. An organization needing 2,000 addresses was too big for a class C and got a class B with 65,534, leaving 63,000 unused. Classless addressing replaced this scheme, but exams and interviews still ask about classes.

## Special addresses

Several ranges have reserved meanings:

- **Private ranges** \`10.0.0.0/8\`, \`172.16.0.0/12\` and \`192.168.0.0/16\`: usable by anyone inside their own network and never routed on the public internet, so homes and campuses reuse them behind NAT
- **Loopback** \`127.0.0.0/8\`: \`127.0.0.1\` always means "this machine"
- **Link-local** \`169.254.0.0/16\`: self-assigned when no DHCP server answers, a common sign that a device failed to get an address
- **Network address**: host bits all 0, naming the network itself
- **Broadcast address**: host bits all 1, reaching every host on that network

## The IPv4 header

Every IPv4 packet starts with a header of 20 to 60 bytes. The fields that matter most are:

| Field | Purpose |
|---|---|
| Version, header length | 4 for IPv4; length in 32-bit words, minimum 5 (20 bytes) |
| Total length | Header plus data, up to 65,535 bytes |
| Identification, flags, fragment offset | Used to split and reassemble fragmented packets |
| Time to live (TTL) | Decremented by every router; the packet is dropped at 0 |
| Protocol | What's inside: 6 for TCP, 17 for UDP, 1 for ICMP |
| Header checksum | Covers the header only; recomputed at every hop because the TTL changes |
| Source and destination addresses | 32 bits each |

TTL prevents a packet caught in a routing loop from circulating forever. The \`traceroute\` tool exploits it, as the next lesson explains.

## Fragmentation

Each link has a maximum transmission unit (MTU), 1,500 bytes for Ethernet. When a router must send a packet larger than the next link's MTU, IPv4 lets it split the packet into fragments, each with its own IP header. The fragment offset field records each fragment's position in units of 8 bytes, so every fragment's data, except the last, must be a multiple of 8 bytes. The "more fragments" (MF) flag is set on every fragment except the last.

A 4,000-byte packet (20 bytes of header, 3,980 of data) crossing an MTU of 1,500 becomes three fragments carrying 1,480, 1,480 and 1,020 bytes of data, with offsets 0, 185 and 370. Only the destination host reassembles them; routers never do.

## Why fragmentation is avoided

If any one fragment is lost, the whole packet is lost. Fragments also burden routers and confuse firewalls. Modern hosts use **path MTU discovery**: they set the "don't fragment" flag, and a router that can't forward a packet replies with an ICMP message stating the MTU, so the sender shrinks its packets. IPv6 removes fragmentation by routers entirely.

## How interviewers test this

Expect fragmentation numericals, identifying private addresses, and "What is TTL for?" For fragmentation, compute the maximum data per fragment (MTU minus header, rounded down to a multiple of 8), then the offsets divided by 8. For TTL, explain loop prevention and how \`traceroute\` uses it.`,
    sources: [RFC_791, RFC_1918, SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "arp-dhcp-icmp-nat": {
    theory: `IP alone can't make a network work. A device needs an address before it can talk, it needs to find the hardware address of the next hop, the network needs a way to report problems, and private addresses need translating to reach the internet. Four helper protocols fill those gaps: DHCP, ARP, ICMP and NAT. This lesson explains each by following what happens when a student's laptop joins the campus Wi-Fi.

## DHCP: getting an address

When the laptop joins the network, it has no IP address and doesn't know where any server is. The Dynamic Host Configuration Protocol (DHCP) solves this in four messages, remembered as DORA:

1. **Discover**: the laptop broadcasts "Is there a DHCP server?" from address 0.0.0.0 to 255.255.255.255
2. **Offer**: a DHCP server replies with an available address, such as 10.20.5.47
3. **Request**: the laptop broadcasts that it accepts that offer, which tells any other servers their offers were declined
4. **Acknowledge**: the server confirms and assigns the address for a lease period

The acknowledgement also carries the subnet mask, the default gateway's address and the DNS servers. Addresses are leased, typically for hours or days, and the laptop renews before the lease expires. Leasing lets a campus reuse addresses as devices come and go.

## DHCP relays

DHCP Discover is a broadcast, and routers don't forward broadcasts. A campus with dozens of subnets would need a DHCP server on every one. Instead, routers run a **DHCP relay agent** that receives the broadcast on each subnet and forwards it as a unicast to one central DHCP server.

## ARP: finding the next hop's hardware address

To send a packet to the gateway at 10.20.5.1, the laptop must put the gateway's MAC address in the Ethernet frame. The Address Resolution Protocol (ARP) finds it. The laptop broadcasts "Who has 10.20.5.1? Tell 10.20.5.47". The gateway replies directly with its MAC address, and the laptop caches the answer for a few minutes. Running \`arp -a\` shows that cache.

ARP works only within one local network. To reach a server across the internet, the laptop doesn't ARP for the server; it ARPs for its gateway and sends the frame there, while the IP header keeps the server's address.

## ARP spoofing

ARP has no authentication: any device can send a reply claiming to own any IP address. An attacker on the same network can claim to be the gateway, so victims send their traffic through the attacker's machine. Managed switches defend with dynamic ARP inspection, and encryption such as TLS keeps intercepted traffic unreadable.

## ICMP: reporting problems

The Internet Control Message Protocol (ICMP) carries error and diagnostic messages. Common types include:

- **Echo request and reply**: the messages \`ping\` uses to check reachability and measure round-trip time
- **Destination unreachable**: no route to the network, no host at the address, or the port is closed
- **Time exceeded**: a router dropped a packet because its TTL reached 0
- **Fragmentation needed**: the packet is too big and has the "don't fragment" flag set, used by path MTU discovery

## How traceroute works

\`traceroute\` (\`tracert\` on Windows) discovers the routers along a path. It sends packets with TTL 1, then 2, then 3, and so on. The first router decrements TTL 1 to 0, drops the packet, and replies with ICMP time exceeded, revealing its address. The packet with TTL 2 reveals the second router, and so on until the destination answers. Blocking all ICMP breaks both \`traceroute\` and path MTU discovery, so firewalls should allow the important types.

## NAT: sharing one public address

The campus has thousands of devices with private addresses but only a few public IP addresses. Network address translation (NAT) lets them share. When the laptop at 10.20.5.47 connects from port 50000 to a web server, the campus router rewrites the source to its public address and a free port, such as 203.0.113.9:61001, and records the mapping. When the reply arrives at port 61001, the router looks up the mapping and forwards it to 10.20.5.47:50000. This port-based form is called PAT (port address translation) or NAT overload.

## NAT's side effects

NAT saved IPv4 from running out years earlier, at a cost. Devices behind NAT can't receive unsolicited incoming connections, which breaks peer-to-peer applications and requires port forwarding for servers. NAT also breaks the internet's original end-to-end model, in which every device had a globally reachable address. IPv6's large address space removes the need for NAT.

## How interviewers test this

Expect "Explain DHCP" (the DORA steps), "How does ARP work?", "How does traceroute work?" and "What is NAT?" A strong answer for ARP points out that a host ARPs for its gateway, not for remote servers. For NAT, explain the translation table with ports.`,
    sources: [RFC_2131, SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "routing-algorithms": {
    theory: `Routers forward each packet toward its destination using a routing table. Routing is the process of building those tables, by having routers share information about the network and compute the best paths. This lesson separates forwarding from routing, explains the two families of routing algorithms, distance vector and link state, their failure modes, and how routing works inside organizations and between internet providers.

## Forwarding and routing

Two different jobs happen in every router:

- **Forwarding**: for each arriving packet, look up the destination address in the table and send the packet out of the right interface. It happens for every packet, in nanoseconds, usually in specialized hardware
- **Routing**: build and update the table by exchanging information with other routers and computing paths. It runs in software, over seconds

An analogy: forwarding is reading a road sign at a junction, and routing is the work of deciding what the signs should say.

## Distance vector routing

In distance vector routing, each router keeps a table of its estimated distance to every destination and the neighbour to send through. Periodically, each router sends its whole table to its direct neighbours. When a router learns a neighbour's distances, it applies the Bellman-Ford equation:

~~~text
D(x, y) = min over neighbours v of { cost(x, v) + D(v, y) }
~~~

In words: my best distance to y is the cheapest of "the cost to reach a neighbour, plus that neighbour's distance to y". Each router knows only what its neighbours tell it, never the full map. The Routing Information Protocol (RIP) uses distance vector with hop count as its cost and treats 16 hops as unreachable.

## Count to infinity

Distance vector reacts quickly to good news and slowly to bad news. Consider routers in a line, A to B to C. A reaches C at cost 2 through B. Now the link from B to C fails. B no longer reaches C directly, but A still advertises "I can reach C at cost 2", so B concludes it can reach C through A at cost 3. A then updates to 4 through B, B to 5, and the costs climb step by step until they reach RIP's infinity of 16. Meanwhile, packets for C loop between A and B.

Two techniques limit this:

- **Split horizon**: don't advertise a route back to the neighbour you learned it from
- **Poison reverse**: advertise it back with an infinite cost, so the neighbour knows not to use you

## Link state routing

In link state routing, each router learns the complete topology. Every router measures the cost of its own links and floods a link-state advertisement (LSA) describing them to every router in the area. Once every router has every LSA, each one builds the same map and runs Dijkstra's shortest-path algorithm to compute its table.

Because every router sees the whole map, link state converges quickly and avoids count-to-infinity. The costs are memory for the full topology and CPU for Dijkstra. Open Shortest Path First (OSPF) and IS-IS are link state protocols, and they run inside most enterprise and ISP networks.

## Comparing the two

| | Distance vector | Link state |
|---|---|---|
| What each router knows | Distances reported by neighbours | The full topology |
| What it sends | Its whole table, to neighbours | Its own links, flooded to all |
| Algorithm | Bellman-Ford | Dijkstra |
| Convergence | Slow; count to infinity | Fast |
| Examples | RIP | OSPF, IS-IS |

## Autonomous systems

The internet is too large for every router to know every link. It's divided into **autonomous systems** (ASes), networks under one administration, such as an ISP, a cloud provider or a large university. Each AS gets a number.

- **Interior gateway protocols** (IGPs), such as OSPF, IS-IS and RIP, route within one AS, optimizing path cost
- **Exterior gateway protocols** route between ASes; the internet uses one, the Border Gateway Protocol (BGP)

## BGP: routing by policy

BGP is a path vector protocol. Each route advertisement lists the sequence of ASes it passes through, which lets routers detect loops: an AS rejects any path that already contains its own number. BGP chooses routes based on business policy as much as distance. An ISP prefers routes through customers, who pay it, over routes through providers it pays.

BGP trusts what neighbours announce, which causes real incidents. In 2008, a Pakistani ISP accidentally announced YouTube's addresses, and much of the world's YouTube traffic was diverted for hours. RPKI (resource public key infrastructure) now lets networks verify which AS may announce which addresses.

## How interviewers test this

Expect "Distance vector vs link state" and "What is count to infinity?" Use the comparison table and the three-router example. GATE also asks distance vector table updates and Dijkstra computations, so practise one of each by hand.`,
    sources: [SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "ipv6": {
    theory: `IPv6 is the long-term replacement for IPv4. Its 128-bit addresses remove the address shortage, and its redesigned header simplifies the work routers do on every packet. Deployment has taken decades, and both versions now run side by side. This lesson explains IPv6 address notation, what changed in the header, how devices configure themselves, and how IPv4 and IPv6 coexist.

## Why a new version

IPv4's 4.3 billion addresses ran out, and the workarounds, mainly NAT, broke the original design in which every device could reach every other. IPv6 has 2^128 addresses, about 3.4 × 10^38, enough to give every device on Earth trillions of addresses. The redesign also fixed other IPv4 pain points, such as router fragmentation and the per-hop checksum.

## Address notation

An IPv6 address is written as eight groups of four hexadecimal digits separated by colons:

~~~text
2001:0db8:0000:0000:0000:ff00:0042:8329
~~~

Two rules shorten it:

1. Drop leading zeros in each group: \`0db8\` becomes \`db8\` and \`0042\` becomes \`42\`
2. Replace one run of consecutive all-zero groups with \`::\`

Applying both gives \`2001:db8::ff00:42:8329\`. The \`::\` may appear only once in an address; otherwise you couldn't tell how many zero groups each one represents.

## Address types

IPv6 has several kinds of address:

- **Global unicast**: publicly routable, usually from \`2000::/3\`
- **Link-local**: \`fe80::/10\`, valid only on the local link; every IPv6 interface has one automatically
- **Loopback**: \`::1\`, the equivalent of \`127.0.0.1\`
- **Multicast**: \`ff00::/8\`, delivered to every member of a group
- **Anycast**: one address assigned to several machines, with packets delivered to the nearest one

IPv6 has no broadcast. Functions that used broadcast in IPv4, such as ARP, now use targeted multicast, so devices aren't interrupted by traffic that isn't for them.

## The simplified header

The IPv6 header has a fixed size of 40 bytes, with fewer fields than IPv4:

- the header checksum is gone, because the link layer and transport layer already check errors, and routers no longer recompute it at every hop
- options moved into optional **extension headers** chained after the main header, so routers can skip them
- fragmentation fields moved into an extension header used only by the sender
- the TTL is renamed **hop limit**, with the same meaning

A fixed-size header with fewer fields makes forwarding faster and more predictable in hardware.

## No fragmentation by routers

IPv6 routers never fragment packets. A router that receives a packet too large for the next link drops it and sends an ICMPv6 "packet too big" message stating the MTU. The sender then sends smaller packets. Every IPv6 link must support an MTU of at least 1,280 bytes, so packets of up to 1,280 bytes always get through without the sender needing to probe.

## Neighbour discovery and autoconfiguration

IPv6 replaces ARP with the **Neighbour Discovery Protocol**, part of ICMPv6, which finds neighbours' MAC addresses using multicast. Routers also send router advertisements announcing the network prefix.

With **stateless address autoconfiguration** (SLAAC), a device combines the advertised prefix with an interface identifier it generates itself, and gets a working global address with no DHCP server. Modern systems generate random, changing identifiers for privacy, so a phone's address doesn't reveal the same hardware ID on every network. DHCPv6 is still available when an organization wants central control.

## Transition mechanisms

IPv4 and IPv6 can't talk to each other directly, so networks use transition techniques:

| Mechanism | How it works |
|---|---|
| Dual stack | Devices and networks run IPv4 and IPv6 side by side; the most common approach |
| Tunnelling | IPv6 packets travel inside IPv4 packets across networks that only support IPv4 |
| Translation (NAT64 and DNS64) | Lets IPv6-only devices reach IPv4-only servers |

Many mobile networks now give phones IPv6-only connectivity and use NAT64 for the remaining IPv4-only services.

## Adoption today

Google's statistics show roughly 45 to 50% of its users reaching it over IPv6 in 2025, with large differences by country; India has been one of the highest-adoption countries, driven by mobile networks. Most of the remaining IPv4 traffic sits behind NAT, which keeps working for client devices.

## How interviewers test this

Expect "IPv4 vs IPv6", address-compression questions, and "Why doesn't IPv6 need NAT?" Compare address size, header size and checksum, fragmentation, broadcast and configuration. For compression, apply both rules and remember that \`::\` appears only once.`,
    sources: [RFC_8200, SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "subnet-masks-and-cidr": {
    theory: `Subnetting is the most heavily tested numerical topic in computer networks, and it's also a daily task for network engineers. Classless inter-domain routing (CIDR) replaced fixed address classes with prefixes of any length. This lesson explains how a subnet mask splits an address, why CIDR replaced classes, and the step-by-step method to find any address's network, broadcast and usable host range.

## What the mask does

A subnet mask has 1 bits for the network part and 0 bits for the host part. A /26 mask has 26 ones followed by 6 zeros:

~~~text
11111111.11111111.11111111.11000000 = 255.255.255.192
~~~

ANDing an address with its mask gives the network address. A host uses this to decide where to send a packet: if the destination's network address matches its own, the destination is on the local network and can be reached directly; otherwise the packet goes to the default gateway.

## Why CIDR replaced classes

Classful addressing offered only three network sizes: about 16 million, 65,000 or 254 hosts. Organizations received far more addresses than they needed, and routing tables grew with every class C network. CIDR, introduced in 1993, allows any prefix length, so an organization needing 1,000 addresses gets a /22 (1,022 usable hosts) instead of a whole class B. CIDR also allows aggregation, covered in the supernetting lesson, which keeps the global routing table smaller.

## The key formulas

For a prefix of length p:

- host bits = 32 − p
- addresses in the block = 2^(32 − p)
- usable hosts = 2^(32 − p) − 2, because the network address and broadcast address are reserved

A /30 has 4 addresses and 2 usable hosts, which is why it's used for point-to-point links between two routers. A /31 is a special case allowed for point-to-point links with no broadcast address.

## The block-size method

When the prefix falls inside an octet, one octet is "interesting" and the others are either fully network or fully host. The block size in the interesting octet is 256 minus the mask value in that octet. Subnets start at multiples of the block size.

| Prefix | Mask (last octet) | Block size | Usable hosts |
|---|---|---|---|
| /24 | 0 | 256 | 254 |
| /25 | 128 | 128 | 126 |
| /26 | 192 | 64 | 62 |
| /27 | 224 | 32 | 30 |
| /28 | 240 | 16 | 14 |
| /29 | 248 | 8 | 6 |
| /30 | 252 | 4 | 2 |

## A worked example

Analyse \`192.168.10.77/26\`:

1. The mask is 255.255.255.192, so the fourth octet is interesting
2. The block size is 256 − 192 = 64, so subnets start at 0, 64, 128 and 192
3. 77 falls between 64 and 127, so the subnet is \`192.168.10.64\`
4. The broadcast address is the last address in the block, \`192.168.10.127\`
5. Usable hosts run from \`.65\` to \`.126\`, which is 62 hosts

The same method works when the interesting octet is the third or second, as with /20 or /12. Find the block size in that octet; the octets after it run from 0 for the network address to 255 for the broadcast address.

## Same subnet or not

Two hosts can communicate directly only if they're in the same subnet. \`10.1.5.100/25\` and \`10.1.5.130/25\` look close, but with block size 128, the first is in the 0 to 127 subnet and the second in the 128 to 255 subnet. They need a router between them. Misconfigured masks cause exactly this kind of problem, where two machines on the same switch can't reach each other.

## Binary thinking helps

The block-size shortcut is fast, but it rests on binary. The network address keeps the network bits and sets every host bit to 0; the broadcast address sets every host bit to 1. When a question feels confusing, write the interesting octet in binary and mark the boundary. For 77 with a /26, 77 is \`01001101\`; keeping the first two bits and zeroing the rest gives \`01000000\` = 64.

## How interviewers test this

Exams give an address with a prefix and ask for the network address, broadcast address, number of hosts, or whether two addresses share a subnet. Use the block-size method and show each step. Interviewers sometimes add "Why subtract 2?", answered with the reserved network and broadcast addresses.`,
    sources: [RFC_4632, SYSTEMS_APPROACH]
  },

  "subnetting-and-vlsm": {
    theory: `Subnetting divides one address block into smaller networks, for example one per department or floor. Fixed-length subnetting makes every subnet the same size, while variable-length subnet masking (VLSM) sizes each subnet to its real needs. This lesson explains both methods, the order in which to allocate VLSM subnets so they never overlap, and the reasons organizations subnet at all.

## Why subnet

A single large network has practical problems: every device shares one broadcast domain, so broadcast traffic grows with size; security rules can't separate groups; and one misbehaving device can affect everyone. Subnetting divides the network so routers or layer 3 switches sit between groups, limiting broadcasts and letting you apply rules such as "students can't reach the exam server's admin port".

## Fixed-length subnetting

To create N equal subnets from a block, borrow b host bits, where 2^b ≥ N. Each borrowed bit doubles the number of subnets and halves their size.

Splitting \`192.168.1.0/24\` into 4 subnets needs b = 2, giving a new prefix of /26 with a block size of 64:

| Subnet | Usable hosts | Broadcast |
|---|---|---|
| 192.168.1.0/26 | .1 to .62 | .63 |
| 192.168.1.64/26 | .65 to .126 | .127 |
| 192.168.1.128/26 | .129 to .190 | .191 |
| 192.168.1.192/26 | .193 to .254 | .255 |

To size subnets by hosts instead, choose h host bits with 2^h − 2 ≥ the hosts needed. Fifty hosts need h = 6 (62 usable), so each subnet is a /26.

## The waste in fixed-length subnets

Real departments differ in size. If the computer science department needs 100 addresses and the admin office needs 10, fixed-length subnets must be large enough for 100, so every subnet gets 126 addresses, and the admin office wastes 116 of them. Across a campus, that waste can exhaust an address block quickly.

## VLSM: size each subnet to fit

Variable-length subnet masking gives each subnet its own prefix length. The method has one critical rule: allocate the largest subnets first. Large blocks must start on boundaries that are multiples of their size, and allocating small blocks first can fragment the space so a large block no longer fits anywhere.

## A worked VLSM example

From \`192.168.1.0/24\`, three departments need 100, 50 and 25 hosts:

1. **100 hosts** need 7 host bits (126 usable), so a /25: \`192.168.1.0/25\`, hosts \`.1\` to \`.126\`
2. **50 hosts** need 6 host bits (62 usable), so a /26: the next free block is \`192.168.1.128/26\`, hosts \`.129\` to \`.190\`
3. **25 hosts** need 5 host bits (30 usable), so a /27: the next free block is \`192.168.1.192/27\`, hosts \`.193\` to \`.222\`
4. **Left over**: \`192.168.1.224/27\`, kept for growth or split into /30 blocks for router-to-router links

Each subnet starts on a multiple of its own block size: 0 for the /25, 128 for the /26 and 192 for the /27. Checking that is the fastest way to verify a VLSM answer.

## Planning for growth

Real address plans leave room. If a department has 50 devices today and could have 70 next year, a /26 (62 hosts) will be too small soon, and renumbering a live network is painful. Network engineers size subnets for expected growth, keep spare blocks between allocations, and document the plan so the next person doesn't overlap an existing subnet.

## Checking a plan for overlaps

Before deploying a VLSM plan, list every subnet with its first and last address in a table, sorted by start address. Each subnet's first address must be greater than the previous subnet's last address. Overlapping subnets cause intermittent, confusing failures, because two routers each believe they own the same addresses, and a sorted table catches the mistake in seconds.

## Counting subnets and hosts

Exam questions often reverse the problem. "How many /28 subnets fit in a /24?" Borrowed bits are 28 − 24 = 4, so 2^4 = 16 subnets, each with 2^4 − 2 = 14 hosts. "What prefix gives at least 500 hosts?" You need 2^h − 2 ≥ 500, so h = 9, and the prefix is /23 (510 hosts).

## How interviewers test this

Expect a VLSM allocation problem or a "how many subnets and hosts" question. For VLSM, sort requirements largest first, pick the smallest block that fits each, and allocate consecutively from the start of the range, checking alignment. For counting, write the formula with the borrowed bits before computing.`,
    sources: [RFC_4632, SYSTEMS_APPROACH]
  },

  "supernetting-longest-prefix": {
    theory: `Supernetting combines several contiguous networks into one shorter prefix, so routers can advertise and store one route instead of many. Longest prefix match is the rule routers use when several routes in their table match the same destination. Together they keep internet routing tables manageable and let networks express both summary routes and specific exceptions. This lesson explains route aggregation, its conditions, and how longest prefix match decides each packet's path.

## Why aggregation matters

Every route a router knows takes memory in fast lookup hardware and time to process when it changes. The global internet routing table holds roughly a million IPv4 routes. Without aggregation, it would hold far more, because every small network would need its own entry in every core router on Earth.

Aggregation lets an ISP that has assigned hundreds of small blocks to its customers advertise one summary route to the rest of the internet. Outside routers need only one entry pointing toward that ISP, and the ISP's own routers handle the details.

## Combining blocks

Contiguous blocks that differ only in their last few network bits can merge into one shorter prefix. Consider four /24 networks:

~~~text
200.1.0.0/24   third octet 00000000
200.1.1.0/24   third octet 00000001
200.1.2.0/24   third octet 00000010
200.1.3.0/24   third octet 00000011
~~~

They share their first 22 bits and differ only in the last 2 bits of the third octet, so together they're exactly \`200.1.0.0/22\`. One route replaces four.

## The conditions for aggregation

Blocks can be summarized into one prefix only when three conditions hold:

1. **Power of two**: the number of blocks is 2, 4, 8 and so on
2. **Contiguous**: the blocks are consecutive, with no gaps
3. **Aligned**: the first block starts on a boundary of the combined size; for four /24 blocks combining into a /22, the third octet of the first block must be divisible by 4

The blocks \`200.1.1.0/24\` to \`200.1.4.0/24\` are four contiguous blocks, but they can't form a /22, because 1 isn't divisible by 4. Their binary patterns don't share a 22-bit prefix.

## Longest prefix match

A routing table often contains overlapping routes: a broad route and more specific ones inside it. When a packet arrives, several routes may match its destination. The router chooses the match with the **longest prefix**, the most specific route.

Consider this table:

| Route | Next hop |
|---|---|
| 10.0.0.0/8 | Interface A |
| 10.1.0.0/16 | Interface B |
| 10.1.2.0/24 | Interface C |
| 0.0.0.0/0 | Default gateway |

A packet for \`10.1.2.5\` matches all four routes and goes to C, the /24. A packet for \`10.1.9.9\` matches the /8, the /16 and the default, and goes to B. A packet for \`10.200.0.1\` matches only the /8 and the default, so it goes to A. A packet for \`8.8.8.8\` matches only the default route.

## The default route

\`0.0.0.0/0\` matches every address, because its prefix length is zero, but it's the least specific route possible. Longest prefix match therefore uses it only when nothing else matches. Every home router and most hosts rely on a default route pointing toward their ISP or gateway.

## Exceptions inside summaries

Longest prefix match lets networks combine summaries with exceptions. An ISP can advertise \`200.1.0.0/22\` while a customer who moved to another provider announces \`200.1.2.0/24\` from there. Routers everywhere prefer the more specific /24 for that customer's addresses and use the /22 for everything else in the block.

The same rule explains a class of internet incidents: announcing a more specific prefix attracts traffic away from the legitimate owner, which is why route-origin validation matters.

## How routers search fast

Routers must find the longest matching prefix for every packet, millions of times per second. Software uses tree structures called tries that walk the address bit by bit, remembering the last matching prefix. High-end hardware uses TCAM (ternary content-addressable memory), which compares an address against every route in parallel in a single cycle and returns the longest match.

## How interviewers test this

Exams ask you to aggregate a list of networks or choose the next hop for an address from a routing table. For aggregation, write the varying octet in binary and check the three conditions. For lookups, list every matching route, then pick the longest prefix, falling back to the default route.`,
    sources: [RFC_4632, SYSTEMS_APPROACH, STANFORD_CS144]
  }
};
