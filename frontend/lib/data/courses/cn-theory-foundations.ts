// Long-form theory for CN modules 1-3 (basics, OSI and TCP/IP, data link). Original writing.
import { LessonTheory } from './utils';

const SYSTEMS_APPROACH = { title: "Peterson and Davie, Computer Networks: A Systems Approach (free online)", url: "https://book.systemsapproach.org/", license: "CC BY 4.0" };
const STANFORD_CS144 = { title: "Stanford CS144: Introduction to Computer Networking", url: "https://cs144.github.io/" };
const IEEE_8023 = { title: "IEEE 802.3 Ethernet Working Group", url: "https://www.ieee802.org/3/" };
const RFC_1122 = { title: "RFC 1122: Requirements for Internet Hosts", url: "https://www.rfc-editor.org/rfc/rfc1122" };

export const cnFoundationsTheory: Record<string, LessonTheory> = {
  "what-is-a-network": {
    theory: `A computer network is a set of devices connected by links so they can exchange data and share resources. The internet is a network of networks: millions of independently run networks joined by routers that agree on common rules. This lesson explains what a network is, how networks are classified by size, and what each kind of network device does, using your college campus as the example.

## Nodes, links and protocols

Every network has three ingredients:

- **Nodes**: devices that send, receive or forward data, such as laptops, phones, printers, switches and routers
- **Links**: the physical or wireless paths between nodes, such as copper cables, optical fibre and Wi-Fi radio
- **Protocols**: the agreed rules for formatting, sending and interpreting data, such as Ethernet, IP, TCP and HTTP

Protocols matter as much as wires. Two devices connected by a perfect cable still can't communicate unless they agree on how bits form messages and what those messages mean.

## Why networks exist

Networks let you share resources and information. The college lab shares one printer among 60 computers, students reach the exam portal from their hostel rooms, and the library catalogue is searchable from anywhere on campus. Without a network, each of those would need its own copy of the data or its own device.

## Classifying networks by size

Networks are grouped by the area they cover:

| Type | Range | Campus example | Typical technology |
|---|---|---|---|
| PAN (personal area network) | A few metres | Your phone and wireless earbuds | Bluetooth |
| LAN (local area network) | A building or campus | The computer lab, hostel Wi-Fi | Ethernet, Wi-Fi |
| MAN (metropolitan area network) | A city | A university linking campuses across a city | Metro Ethernet, fibre |
| WAN (wide area network) | Countries and continents | The college's connection to the internet | Leased lines, the internet |

The boundaries are about scale and ownership. A LAN is usually owned and run by one organization. A WAN crosses public land and is usually run by telecom companies that lease capacity to others.

## How a campus network fits together

Inside a lab, every computer plugs into a switch. Switches across buildings connect to the campus core. A router at the edge connects the campus to the internet service provider (ISP), which connects to larger ISPs, and so on up to the backbone networks that span continents. Your request to a website travels from your laptop through this hierarchy and back.

## Network devices

Each device works at a particular layer of the network stack, which decides what information it uses:

| Device | Layer | What it does |
|---|---|---|
| Repeater | Physical | Regenerates a weakening signal so it travels farther |
| Hub | Physical | Copies every incoming bit to every other port |
| Bridge | Data link | Connects two LAN segments and forwards frames by MAC address |
| Switch | Data link | A multi-port bridge that learns where each device is and forwards frames only to the right port |
| Router | Network | Forwards packets between different networks using IP addresses |
| Gateway | Up to application | Translates between different protocols |

## Hub, switch and router in practice

A hub is the oldest and dumbest option: everything it receives goes out of every port, so every device sees every frame and only one device can transmit at a time without collisions. Hubs are obsolete.

A switch learns which device is on which port by reading the source address of each frame, then sends each frame only where it needs to go. Many devices can transmit at once, and nobody sees other people's traffic by default. Every modern wired LAN is built from switches.

A router connects separate networks, such as the campus LAN and the ISP. It reads the destination IP address and chooses the next hop toward that network. Your home "Wi-Fi router" combines a router, a switch and a wireless access point in one box.

## Collision and broadcast domains

Two terms describe how far certain traffic spreads. A **collision domain** is the area where simultaneous transmissions interfere; every switch port starts a new one. A **broadcast domain** is the area a broadcast message reaches; switches pass broadcasts on, while routers stop them. The devices lesson in the next module works through counting both.

## How interviewers test this

Expect "Difference between a hub, a switch and a router" and "LAN vs WAN". Answer the first by the layer each works at and what it uses to forward: bits to everyone, frames by MAC address, packets by IP address. For the second, mention both scale and ownership, with campus examples.`,
    sources: [SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "network-topologies": {
    theory: `A topology is the shape of a network: how its nodes connect to each other. The topology decides how much cable you need, what happens when a link or device fails, and how easily the network grows. This lesson explains the bus, star, ring, mesh, tree and hybrid topologies, their trade-offs, and why almost every real LAN today is a star.

## Physical and logical topology

The **physical topology** is how cables and devices are actually connected. The **logical topology** is how data flows between nodes. They can differ: classic Ethernet over a hub was physically a star (every computer cabled to the hub) but logically a bus (every frame reached everyone). When exams ask about topology, they usually mean the physical layout.

## Bus

In a bus topology, every node connects to one shared backbone cable, terminated at both ends. Early Ethernet worked this way with coaxial cable. It needs little cable and is cheap to install. Its weaknesses are serious: one break in the backbone splits or disables the whole network, only one node can transmit at a time, and finding a fault means checking the whole cable.

## Star

In a star topology, every node connects to a central device, today a switch. Adding a computer to the lab means running one cable to the switch. A failed cable affects only the one computer it connects. The central switch is a single point of failure, which is why critical networks use redundant switches.

Stars dominate because each part can be managed on its own: every link can be tested, monitored and replaced individually, and switches give each port its own bandwidth.

## Ring

In a ring topology, each node connects to exactly two neighbours, forming a loop, and data travels around it. Token Ring and FDDI networks passed a token so that only its holder could transmit, which avoided collisions entirely. A single break stops a single ring, so FDDI used two counter-rotating rings that could wrap around a failure. Rings are now mostly found in metropolitan fibre networks built for fast recovery from cuts.

## Mesh

In a full mesh, every node connects directly to every other node. With n nodes, that takes n(n − 1)/2 links, and each node needs n − 1 ports. Six nodes need 15 links; fifty nodes need 1,225.

A full mesh is extremely reliable, because traffic has many alternative paths, but it doesn't scale. Real networks use **partial meshes**, connecting important nodes to several others. The internet's core, where large ISPs interconnect, is a partial mesh, which is why it survives individual link failures.

## Tree and hybrid

A **tree** (hierarchical) topology is a star of stars: access switches in each room connect to distribution switches per building, which connect to a core switch. It scales well and matches how organizations are laid out. A failure near the root cuts off everything below it, so the upper levels are usually made redundant.

A **hybrid** topology combines types, such as a campus built as a tree whose core switches form a partial mesh for redundancy. Almost every large network is a hybrid.

## Comparing the topologies

| Topology | Links for n nodes | Effect of one link failure | Scales well? |
|---|---|---|---|
| Bus | 1 backbone | Can take down everything | No |
| Star | n | Affects one node | Yes |
| Ring | n | Breaks the ring (unless dual) | Moderately |
| Full mesh | n(n − 1)/2 | Traffic reroutes | No |
| Tree | n − 1 | Cuts off a branch | Yes |

## Choosing a topology

Choose by weighing cost, reliability and growth. A lab of 40 computers is a star around one switch. A campus is a tree with a redundant core. A data center uses specialized designs, such as leaf-spine, in which every access ("leaf") switch connects to every core ("spine") switch, giving many equal paths between any two servers.

## Topology and failure planning

Network engineers ask one question of every design: what's the single point of failure? In a star, it's the central switch; in a tree, the root; in a bus, the backbone. Redundancy (two links, two switches, two power supplies) is added exactly where a failure would cut off the most users.

## How interviewers test this

Expect a link-count question ("How many links does a full mesh of 8 devices need?", answer 28) and "Advantages and disadvantages of star vs bus vs mesh". Use the table above, and mention that real networks are stars, trees and partial meshes because they balance cost against reliability.`,
    sources: [SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "transmission-media-and-switching": {
    theory: `Data has to travel over something, either a cable or the air, and the network has to decide how to share links among many conversations. This lesson explains guided and unguided transmission media, the three transmission modes, and the difference between circuit switching and packet switching, the design choice that made the internet possible.

## Guided media

Guided media carry signals along a physical path:

- **Twisted pair**: pairs of copper wires twisted together to reduce interference. Category 5e and 6 cables carry Ethernet at 1 to 10 Gbit/s for up to 100 m per run, and they wire almost every office and lab
- **Coaxial cable**: a central conductor inside shielding, which resists interference better than twisted pair. Cable TV and cable broadband use it
- **Optical fibre**: glass strands carrying pulses of light. Fibre offers enormous bandwidth, runs for kilometres without repeaters, and is immune to electromagnetic interference. Campus backbones, undersea cables and home fibre connections use it

Fibre comes in two kinds. **Multimode** fibre has a wider core and is cheaper, for distances up to a few hundred metres inside buildings. **Single-mode** fibre has a narrow core that carries one light path, reaching tens of kilometres.

## Unguided media

Unguided (wireless) media send signals through the air:

- **Radio**: Wi-Fi and cellular networks; signals pass through walls and support mobility
- **Microwave**: point-to-point links between towers that need a clear line of sight
- **Satellite**: links to orbiting satellites for remote areas; geostationary satellites add about 250 ms of one-way delay, while low-orbit constellations cut that substantially
- **Infrared**: short-range, line-of-sight links such as TV remotes

Wireless media are shared by everyone in range, which makes them noisier, slower and harder to secure than cables. The medium access lesson explains how Wi-Fi devices take turns.

## Transmission modes

Transmission modes describe the direction of data flow:

| Mode | Direction | Example |
|---|---|---|
| Simplex | One way only | Keyboard to computer, broadcast TV |
| Half duplex | Both ways, one at a time | Walkie-talkies; classic shared Ethernet |
| Full duplex | Both ways at the same time | Phone calls; switched Ethernet |

Modern switched Ethernet is full duplex: each cable has separate pairs for each direction, so a computer can send and receive at full speed simultaneously, and collisions can't happen.

## Circuit switching

Circuit switching reserves a dedicated path, with fixed capacity, from sender to receiver before any data flows. The traditional telephone network worked this way: dialling set up a circuit through every exchange, and that capacity was yours for the whole call.

The advantages are guaranteed bandwidth and constant delay once the call is established. The drawback is waste: the reserved capacity sits idle during silences, and most computer traffic is bursty, sending a burst of data and then nothing for a while.

## Packet switching

Packet switching breaks data into packets, each carrying the destination address, and sends them independently. Routers forward each packet toward its destination, and links are shared by everyone's packets on demand. This sharing is called **statistical multiplexing**.

Packet switching uses links far more efficiently for bursty traffic, which is why the internet is built on it. The cost is variable delay: packets wait in router queues when links are busy, and they can be dropped when queues overflow. Protocols such as TCP handle the resulting loss and reordering.

## Virtual circuits

Virtual circuit switching sits between the two. A path is set up before data flows, as in circuit switching, but links are still shared packet by packet. Each packet carries a short circuit identifier instead of a full address, so routers forward it with a quick table lookup. ATM and Frame Relay used virtual circuits, and MPLS, widely used inside ISP networks, applies the same idea.

## Comparison

| | Circuit switching | Packet switching (datagram) |
|---|---|---|
| Setup before data | Yes | No |
| Resources | Reserved for the session | Shared on demand |
| Delay | Constant after setup | Variable (queuing) |
| Efficiency for bursty data | Low | High |
| Example | Traditional telephone network | The internet |

## How interviewers test this

Expect "Circuit switching vs packet switching" and "Why does the internet use packet switching?" Answer with resource reservation versus sharing, and explain that computer traffic is bursty, so reserving capacity wastes it. For media questions, contrast fibre's bandwidth and distance with twisted pair's cost.`,
    sources: [SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "network-performance-delays": {
    theory: `Network performance comes down to how much data you can move and how long it takes to arrive. Those two ideas, bandwidth and latency, are often confused, and each depends on different factors. This lesson defines bandwidth, throughput and latency, breaks latency into its four delays, and explains the bandwidth-delay product, which decides how protocols must behave on fast, long links.

## Bandwidth, throughput and latency

Three terms describe performance:

- **Bandwidth**: the maximum rate a link can carry, in bits per second. A 1 Gbit/s Ethernet link has a bandwidth of 10^9 bits per second
- **Throughput**: the rate actually achieved end to end, which is limited by the slowest link on the path, by congestion and by protocol overhead
- **Latency**: the time for data to travel from source to destination

An analogy helps: bandwidth is the width of a highway, and latency is how long the drive takes. A wider highway carries more cars per hour but doesn't make any single car's trip shorter.

## The four delays at each hop

A packet experiences four delays at every node it passes:

| Delay | Cause | Formula or size |
|---|---|---|
| Transmission | Pushing all the packet's bits onto the link | L / B (packet length / bandwidth) |
| Propagation | The signal travelling along the link | d / v (distance / signal speed) |
| Queuing | Waiting in the router's buffer behind other packets | Varies with load |
| Processing | Checking headers and looking up the route | Usually microseconds |

## Transmission versus propagation

These two are the most commonly confused. Transmission delay depends on the packet's size and the link's bandwidth: it's the time to put the bits on the wire. Propagation delay depends on distance and the signal's speed in the medium, about 2 × 10^8 m/s in copper or fibre: it's the time for one bit to travel the length of the link.

Take a 1,000-byte packet on a 1 Mbit/s link that's 2,000 km long. Transmission delay is 8,000 bits / 10^6 bit/s = 8 ms. Propagation delay is 2 × 10^6 m / 2 × 10^8 m/s = 10 ms. Upgrading to a 10 Mbit/s link cuts the transmission delay to 0.8 ms and leaves the propagation delay unchanged, because light doesn't travel faster on a faster link.

## Queuing delay

Queuing delay depends on how busy the link is. When packets arrive faster than the link can send them, they wait in a buffer. As utilization approaches 100%, queuing delay grows sharply, and when the buffer fills, new packets are dropped. Excessively large buffers cause **bufferbloat**: queues so long that latency balloons to hundreds of milliseconds, which is why video calls lag on a home network when someone starts a large download.

## Round-trip time

Round-trip time (RTT) is the time for a message to go to the destination and a reply to come back. Many operations take several round trips: setting up a TCP connection takes one, and a TLS handshake adds at least one more. That's why physical distance matters so much for web performance. A user in Chennai reaching a server in Virginia faces an RTT of roughly 200 ms, no matter how much bandwidth either side has. Content delivery networks (CDNs) place servers near users to cut it.

## The bandwidth-delay product

The bandwidth-delay product, bandwidth × one-way propagation delay, is the number of bits "in flight" on a link at any moment. On the example link, 10^6 bit/s × 0.01 s = 10,000 bits are travelling down the wire at once.

This number decides how much data a sender must have outstanding to keep the link busy. If a protocol sends one packet and waits for an acknowledgement before sending the next, the link sits idle for most of each round trip. The sliding-window lesson builds directly on this idea, and TCP's window must be at least the bandwidth-delay product (measured over a round trip) to use a link fully.

## Units and conversions

Most mistakes in performance questions are unit errors:

- bandwidth is in **bits** per second, while file sizes are usually in **bytes**, so multiply bytes by 8
- networking uses decimal units, so 1 Mbit/s is 10^6 bit/s, while memory sizes often use 1 KB = 1,024 bytes
- convert everything to seconds and bits before dividing

## How interviewers test this

Expect numerical questions on transmission and propagation delay, and "What's the difference between bandwidth and latency?" For the numbers, write both formulas, convert units first, and add the delays. For the concept, use the highway analogy and point out that more bandwidth doesn't reduce propagation delay.`,
    sources: [SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "osi-seven-layers": {
    theory: `The Open Systems Interconnection (OSI) model divides networking into seven layers, each with one job, and each relying only on the layer below it. Real networks run the simpler TCP/IP stack, but the OSI model is the shared vocabulary engineers use to describe where a problem lives: "it's a layer 2 issue" means something specific. This lesson explains why networks are layered and what each of the seven layers does.

## Why layering

Networking involves many separate problems: sending bits over a wire, getting a frame to the next device, finding a route across continents, recovering lost data, and representing a web page. Layering assigns each problem to one layer with a defined interface to the layers above and below.

The payoff is independence. You can switch from Wi-Fi to Ethernet, changing the lower layers, without changing your browser at the top. A new application protocol can run over the existing internet without any router knowing about it. Each layer can evolve on its own.

## Layer 1: physical

The physical layer sends raw bits over a medium: voltage levels on copper, light pulses in fibre, or radio waves. It defines connectors, cable types, signal encoding and data rates. Hubs, repeaters, cables and network interface hardware operate here. The unit is the **bit**.

## Layer 2: data link

The data link layer moves frames between two directly connected devices on the same network. It groups bits into **frames**, adds physical (MAC) addresses, detects transmission errors with a checksum, and controls access to a shared medium. Ethernet and Wi-Fi (802.11) are data link protocols, and switches operate here.

## Layer 3: network

The network layer moves **packets** from the source host to the destination host, possibly across many intermediate networks. It provides logical addressing (IP addresses) and routing, choosing a path through the network. IP and ICMP work here, and routers are network-layer devices.

## Layer 4: transport

The transport layer delivers data between processes on the two hosts, using port numbers to identify which program on a machine the data is for. It can provide reliability, ordering, flow control and congestion control. TCP (segments) and UDP (datagrams) are transport protocols.

## Layer 5: session

The session layer manages conversations between applications: opening, maintaining and closing sessions, and adding checkpoints so a long transfer can resume after an interruption. In the TCP/IP world, applications handle these tasks themselves.

## Layer 6: presentation

The presentation layer deals with how data is represented: character encodings such as UTF-8, formats such as JPEG, compression, and encryption. TLS is often placed here, though in practice it sits between the transport and application layers.

## Layer 7: application

The application layer provides network services directly to applications: HTTP for the web, DNS for name lookup, SMTP for email, FTP and SSH. This is the layer users and developers interact with most.

## Remembering the order

From top to bottom, the mnemonic "All People Seem To Need Data Processing" gives Application, Presentation, Session, Transport, Network, Data link, Physical. From bottom to top, "Please Do Not Throw Sausage Pizza Away" works the same way.

## Delivery scope

Three layers deliver data at different scopes, which is a common interview point:

| Layer | Delivers between | Address used |
|---|---|---|
| Data link | Neighbouring devices on one network (hop to hop) | MAC address, 48 bits |
| Network | Source host and destination host, across many hops | IP address |
| Transport | Source process and destination process | Port number, 16 bits |

A packet from your laptop to a website keeps the same IP addresses end to end, while its MAC addresses change at every hop, because each hop is a different local network.

## Troubleshooting by layer

Engineers diagnose problems bottom-up. Is the cable plugged in and the link light on (layer 1)? Does the device have a link to the switch (layer 2)? Can it reach the gateway's IP address with \`ping\` (layer 3)? Is the port open (layer 4)? Does the application respond correctly (layer 7)? Each answer narrows the problem to one layer.

## How interviewers test this

Expect "Explain the OSI model" and "At which layer does a router or switch work?" Name each layer with its job, data unit and one protocol or device. The delivery-scope table is a strong addition, because it shows you understand why the layers exist, not only their names.`,
    sources: [SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "tcp-ip-model-and-encapsulation": {
    theory: `The TCP/IP model is the layered architecture the internet actually runs on. It has four layers instead of OSI's seven, and it grew out of working protocols rather than a committee design. This lesson maps TCP/IP onto OSI, then follows encapsulation, the process by which each layer wraps data with its own header as it travels down the stack and unwraps it on the way up.

## The four layers

The TCP/IP model has these layers, from top to bottom:

| TCP/IP layer | OSI equivalent | Protocols |
|---|---|---|
| Application | Application, presentation, session | HTTP, DNS, SMTP, SSH, TLS |
| Transport | Transport | TCP, UDP, QUIC |
| Internet | Network | IP, ICMP |
| Link (network access) | Data link and physical | Ethernet, Wi-Fi, ARP |

Some textbooks split the link layer into data link and physical, giving a five-layer model. Both versions describe the same protocols.

## Why TCP/IP won

In the 1980s, OSI was meant to become the global standard, with its model specified before its protocols. TCP/IP took the opposite path: researchers built protocols that worked, deployed them on ARPANET and then the early internet, and documented them in RFCs (requests for comments). Working, freely available implementations, especially in the BSD UNIX operating system, spread faster than OSI's specifications. Today OSI survives as a teaching model and vocabulary, while TCP/IP carries the traffic.

## The hourglass shape

The internet's architecture is often drawn as an hourglass. Many application protocols sit at the top and many link technologies at the bottom, but every packet passes through one protocol in the narrow waist: IP. Any application can run over any link, as long as both speak IP. That single common layer is why a video call can start on Wi-Fi, cross fibre and satellite links, and end on a 5G phone.

## Encapsulation

When an application sends data, each layer adds its own header in front (and the link layer also adds a trailer):

~~~text
Application:  [ HTTP request ]
Transport:    [ TCP hdr | HTTP request ]                   segment
Internet:     [ IP hdr | TCP hdr | HTTP request ]          packet
Link:         [ Eth hdr | IP hdr | TCP hdr | data | CRC ]  frame
~~~

Each layer treats everything handed down from above as an opaque payload. TCP doesn't parse HTTP, and IP doesn't parse TCP. Each header carries only what its own layer needs: ports for TCP, IP addresses for IP, MAC addresses and an error check for Ethernet.

## Decapsulation

The receiver reverses the process. The network card checks the Ethernet trailer's checksum and removes the Ethernet header, IP checks the destination address and removes its header, TCP reorders segments, acknowledges them and removes its header, and the application finally receives the HTTP request exactly as sent.

## What intermediate devices read

Devices along the path only open the layers they need:

- a **switch** reads the Ethernet header to choose an output port, then forwards the frame unchanged
- a **router** removes the Ethernet header, reads the IP header to choose the next hop, decrements the time-to-live field, and wraps the packet in a new Ethernet frame for the next link
- a **firewall or load balancer** may read the TCP or even HTTP headers to make decisions

That's why IP addresses stay the same end to end while MAC addresses change at every router.

## Overhead

Headers cost bandwidth. A TCP segment over IPv4 and Ethernet carries at least 20 bytes of TCP header, 20 bytes of IP header and 18 bytes of Ethernet header and trailer. With the usual 1,500-byte maximum Ethernet payload, about 1,460 bytes are left for application data, roughly 96% efficiency. Small packets, such as single keystrokes over SSH, are far less efficient, which is why protocols batch data where they can.

## OSI versus TCP/IP

| | OSI | TCP/IP |
|---|---|---|
| Layers | 7 | 4 (or 5) |
| Origin | Model first, protocols later | Protocols first, model documented after |
| Session and presentation | Separate layers | Handled by applications |
| Use today | Teaching and vocabulary | Runs the internet |

## How interviewers test this

Expect "OSI vs TCP/IP" and "What is encapsulation?" For the first, map the layers and explain why TCP/IP won. For the second, walk a request down the stack naming each header and data unit, then explain what a router reads and rewrites at each hop.`,
    sources: [SYSTEMS_APPROACH, RFC_1122, STANFORD_CS144]
  },

  "devices-and-domains": {
    theory: `Collision domains and broadcast domains describe how far certain traffic spreads through a network. They explain why hubs disappeared, why switches improved performance, and why large networks are split with routers and VLANs. This lesson defines both domains, shows how each device affects them, and works through the counting questions common in interviews and exams.

## Collision domains

A **collision domain** is the part of a network where two devices transmitting at the same moment interfere with each other. When frames collide, both are corrupted and must be resent, which wastes bandwidth.

On old shared Ethernet, every device on a hub was in one collision domain, so only one device could transmit successfully at a time. Adding devices made collisions more frequent, and performance fell as the network grew.

## How switches changed collisions

A switch gives each port its own collision domain. A frame from port 1 to port 5 doesn't interfere with a frame from port 2 to port 7, so many conversations happen at once. With full-duplex links, each cable carries traffic both ways simultaneously and collisions can't happen at all.

This is the main reason switches replaced hubs. A 24-port gigabit switch can carry many gigabit conversations in parallel, while a 24-port hub shared one channel among all devices.

## Broadcast domains

A **broadcast domain** is the set of devices that receive a broadcast frame, one sent to the address \`FF:FF:FF:FF:FF:FF\`. Some protocols depend on broadcasts. When your laptop needs the MAC address of the gateway, it broadcasts an ARP request, and when it joins a network, it broadcasts a DHCP discover message.

Switches forward broadcasts out of every port, so all devices connected through switches share one broadcast domain. Routers don't forward broadcasts, so each router interface marks the edge of a broadcast domain.

## Why broadcast domains must stay small

Every device in a broadcast domain must receive and process every broadcast. In a network of thousands of devices, ARP and DHCP broadcasts alone consume bandwidth and CPU time on every machine. A misbehaving device or a switching loop can trigger a **broadcast storm** that saturates the network. So large networks are divided into smaller broadcast domains with routers or VLANs.

## How each device affects the domains

| Device | Collision domains | Broadcast domains |
|---|---|---|
| Hub | One for all ports | One for all ports |
| Switch | One per port | One for all ports (per VLAN) |
| Router | One per interface | One per interface |

## VLANs split broadcast domains on one switch

A VLAN (virtual LAN) divides one physical switch into several logical switches. Ports in the student VLAN and ports in the staff VLAN are separate broadcast domains even though they share hardware. Traffic between VLANs must pass through a router or a layer 3 switch, which also lets the network apply security rules between them.

## A worked counting example

A router has two interfaces. Interface 1 connects to a switch with 4 PCs. Interface 2 connects to a hub with 3 PCs. Count each domain:

- **Collision domains on the switch side**: 4 (one per switch port to a PC) plus 1 (the switch-to-router link), so 5
- **Collision domains on the hub side**: the hub, its 3 PCs and its link to the router share one domain, so 1
- **Total collision domains**: 6
- **Broadcast domains**: one per router interface, so 2

Work through any topology the same way: count switch and router ports individually, treat each hub as one domain, and count broadcast domains by router interfaces (and VLANs).

## Layer mapping in one picture

The domains follow directly from what each device understands. A hub knows nothing about frames, so it can't separate anything. A switch understands MAC addresses, so it separates collisions but must flood broadcasts, which by definition go to everyone. A router understands IP networks, so it stops broadcasts at the network's edge.

## How interviewers test this

Expect a counting question and "Why did switches replace hubs?" Count carefully with the per-device rules, and explain that switches give each port its own collision domain and full-duplex links, while routers and VLANs limit broadcast domains to keep broadcast traffic manageable.`,
    sources: [SYSTEMS_APPROACH, IEEE_8023]
  },

  "framing-and-error-detection": {
    theory: `The physical layer delivers a stream of bits, and bits can flip because of electrical noise or interference. The data link layer turns that stream into frames with clear boundaries, then adds redundancy so the receiver can detect corrupted frames. This lesson explains framing methods, parity, checksums and cyclic redundancy checks (CRC), and the difference between detecting errors and correcting them.

## Why framing is needed

A receiver sees an unbroken series of bits and must find where each frame starts and ends. Without boundaries, it can't tell which bits form an address, which form data, and where the error check sits. Framing solves this.

## Framing methods

Three classic approaches mark frame boundaries:

- **Character count**: a field at the start states the frame's length. If a single bit error corrupts that count, the receiver misreads every following frame, so this method is fragile
- **Byte stuffing**: special flag bytes mark the start and end. If the flag value appears inside the data, the sender inserts an escape byte before it, and the receiver removes the escape
- **Bit stuffing**: HDLC frames start and end with the flag pattern 01111110. Inside the data, whenever the sender sends five consecutive 1 bits, it inserts a 0, so six 1s in a row can only mean a flag. The receiver removes any 0 that follows five 1s

Ethernet uses a different approach: a fixed preamble and start-of-frame delimiter, plus physical-layer signalling that marks idle periods between frames.

## Detection versus correction

There are two responses to errors. **Error detection** notices a corrupted frame, which is then discarded or resent. **Error correction** includes enough redundancy to repair the frame without resending.

Detection needs much less redundancy, so wired networks, where errors are rare and resending is cheap, use detection. Correction is worth its cost where resending is expensive or impossible: deep-space links, storage media, and wireless links with frequent errors.

## Parity bits

A single parity bit makes the number of 1 bits even (even parity) or odd (odd parity). If one bit flips, the count changes and the receiver notices. If two bits flip, the count's parity is unchanged and the error goes undetected. Single parity detects any odd number of bit errors and misses any even number.

Two-dimensional parity arranges data in rows and columns with a parity bit for each. It detects all 1-, 2- and 3-bit errors, and it can locate and correct a single-bit error at the intersection of the failing row and column.

## Checksums

An internet checksum adds the data as 16-bit words using one's-complement arithmetic and sends the complement of the sum. The receiver adds everything, including the checksum, and expects all 1 bits. Checksums are cheap to compute in software, so IP, TCP and UDP use them, though they miss some error patterns that CRC catches.

## Cyclic redundancy check

CRC treats the frame's bits as the coefficients of a polynomial and divides by an agreed generator polynomial using modulo-2 arithmetic, where subtraction is XOR and there are no carries. The remainder becomes the check value. The steps are:

1. Append r zero bits to the data, where r is the generator's degree
2. Divide by the generator using XOR long division
3. Replace the appended zeros with the r-bit remainder and send the result

The receiver divides the whole frame by the same generator. A remainder of zero means no error was detected. With data 100100 and generator 1101, the remainder is 001, so the sender transmits 100100001.

CRC is implemented in hardware at line speed and detects all burst errors shorter than or equal to the generator's degree, plus most longer ones. Ethernet and Wi-Fi use a 32-bit CRC called the frame check sequence.

## Hamming distance

The **Hamming distance** between two codewords is the number of bit positions where they differ. A code's minimum distance d sets its power:

- to **detect** up to s errors, you need d ≥ s + 1
- to **correct** up to t errors, you need d ≥ 2t + 1

Hamming codes add r check bits to m data bits, with 2^r ≥ m + r + 1, and correct any single-bit error. Server memory (ECC RAM) uses this idea to fix single-bit flips automatically.

## How interviewers test this

GATE asks CRC computations, bit-stuffing outputs and Hamming-distance bounds. Do CRC as XOR long division, writing every step. Placement interviews ask "How does CRC detect errors?" and "Parity vs CRC": explain the polynomial division briefly, then note that parity misses even-numbered errors while CRC catches burst errors.`,
    sources: [SYSTEMS_APPROACH, IEEE_8023]
  },

  "flow-control-sliding-window": {
    theory: `Flow control stops a fast sender from overwhelming a slow receiver, and reliable delivery makes sure lost frames are resent. The simplest approach, stop-and-wait, wastes most of a fast link's capacity. Sliding-window protocols fix that by keeping several frames in flight at once. This lesson explains stop-and-wait, link efficiency, Go-Back-N and Selective Repeat, and the rules that link window size to sequence-number bits.

## Stop-and-wait

In stop-and-wait, the sender transmits one frame and waits for an acknowledgement (ACK) before sending the next. If the ACK doesn't arrive within a timeout, it resends. A one-bit sequence number (0 or 1) lets the receiver recognize a duplicate frame when an ACK was lost and the sender resent.

Stop-and-wait is correct, and on long or fast links it wastes most of the link's capacity. The link carries one frame, then sits idle while the frame propagates to the receiver and the ACK propagates back.

## Link efficiency

Efficiency is the fraction of time the link spends sending useful data:

~~~text
efficiency = Tt / (Tt + 2Tp) = 1 / (1 + 2a),  where a = Tp / Tt
~~~

Here Tt is the transmission time of one frame and Tp the one-way propagation delay. With Tt = 8 ms and Tp = 10 ms, a = 1.25, so efficiency is 1 / 3.5, about 28.6%. The link is idle more than 70% of the time.

The larger a is, the worse stop-and-wait performs. Satellite links, with long propagation delays, and modern fibre, with short transmission times, both have large values of a.

## Sliding windows

A sliding-window protocol lets the sender transmit up to N frames before it must stop and wait for an ACK. As ACKs arrive, the window slides forward and new frames are sent. To keep the link fully busy, the window must cover a whole round trip:

~~~text
N ≥ 1 + 2a,  and efficiency = min(1, N / (1 + 2a))
~~~

In the example, 1 + 2a = 3.5, so a window of 4 frames keeps the link busy. This is the bandwidth-delay product from the performance lesson, expressed in frames.

## Go-Back-N

In Go-Back-N, the receiver accepts only the next expected frame in order and discards everything else. ACKs are cumulative: "ACK 5" means all frames up to 5 arrived. If frame 3 is lost, the receiver discards frames 4, 5 and 6 when they arrive, and the sender, after a timeout, resends frame 3 and every frame after it.

The receiver needs no buffering, at the cost of resending frames that had already arrived correctly. On links with frequent errors, that waste adds up.

## Selective Repeat

In Selective Repeat, the receiver buffers out-of-order frames and acknowledges each frame individually. If frame 3 is lost, frames 4, 5 and 6 are kept, and the sender resends only frame 3. Once it arrives, the receiver delivers 3 to 6 in order. Selective Repeat uses bandwidth efficiently and needs buffers and sorting at the receiver.

## Sequence numbers and window limits

Sequence numbers wrap around, so with k bits they run from 0 to 2^k − 1. The window must be small enough that the receiver can never confuse a new frame with a resent old one:

| Protocol | Maximum sender window with k-bit sequence numbers |
|---|---|
| Go-Back-N | 2^k − 1 |
| Selective Repeat | 2^(k−1) |

The Selective Repeat limit comes from a failure case. With 3-bit numbers (0 to 7) and a window of 5, the sender sends frames 0 to 4, and every ACK is lost. The receiver now expects 5, 6, 7, 0 and 1. The sender times out and resends the old frame 0, which falls inside the receiver's new window and is wrongly accepted as new data. A window of 4 keeps the old and new windows from overlapping.

## Where these ideas live today

Ethernet itself doesn't retransmit lost frames; TCP handles reliability end to end with a sliding window measured in bytes, plus selective acknowledgements (SACK) that resemble Selective Repeat. Wi-Fi does retransmit at the link layer, because wireless loss is common enough to fix close to where it happens.

## How interviewers test this

GATE asks efficiency calculations, minimum window sizes and sequence-number bits. Compute a = Tp / Tt first, then apply the formulas. Interviewers ask "Go-Back-N vs Selective Repeat": compare what the receiver buffers, what gets resent after a loss, and the window limits.`,
    sources: [SYSTEMS_APPROACH, STANFORD_CS144]
  },

  "mac-protocols": {
    theory: `When several devices share one channel, such as a Wi-Fi network or old shared Ethernet, they need rules for taking turns. Medium access control (MAC) protocols provide those rules. This lesson traces the evolution from ALOHA to carrier sensing, explains how Ethernet detected collisions and why that sets a minimum frame size, and why Wi-Fi avoids collisions instead of detecting them.

## The shared channel problem

If two devices transmit on a shared channel at the same time, their signals collide and both transmissions are lost. A MAC protocol decides who may transmit and when. Random-access protocols let devices transmit when they have data and recover from collisions, which suits bursty traffic where most devices are idle most of the time.

## Pure ALOHA

ALOHA, built at the University of Hawaii in 1971, was the first random-access protocol. A station transmits whenever it has data. If it doesn't receive an acknowledgement, it assumes a collision, waits a random time, and tries again.

A frame is vulnerable to collision for two frame times: any other frame that starts within one frame time before or after it overlaps. Under heavy load, pure ALOHA's maximum throughput is 1 / (2e), about 18.4% of the channel.

## Slotted ALOHA

Slotted ALOHA divides time into slots of one frame each, and stations may transmit only at the start of a slot. A collision can now happen only if two stations choose the same slot, which halves the vulnerable period and doubles the maximum throughput to 1 / e, about 36.8%. The cost is that stations need synchronized clocks.

## Carrier sensing

Carrier sense multiple access (CSMA) adds a rule people use in conversation: listen before you speak. A station checks whether the channel is busy and transmits only if it's idle. Collisions still happen, because of propagation delay: two stations can both sense an idle channel and start within microseconds of each other, before either signal reaches the other.

## CSMA/CD and classic Ethernet

Classic shared Ethernet used CSMA with collision detection (CSMA/CD). While transmitting, a station also listens. If it detects a collision, it stops immediately, sends a short jam signal so everyone notices, and backs off before retrying. Stopping early saves the time that would otherwise be wasted transmitting a doomed frame.

## Binary exponential backoff

After the n-th collision on a frame, a station waits K slot times, where K is chosen at random from 0 to 2^min(n,10) − 1. After the first collision K is 0 or 1; after the second, 0 to 3; and so on. Repeated collisions spread retries further apart, so the channel calms down under load. After 16 failed attempts, the station gives up and reports an error.

## Minimum frame size

For collision detection to work, a station must still be transmitting when news of a collision reaches it. The worst case is a collision at the far end of the cable, whose signal takes a full round trip to return:

~~~text
transmission time ≥ 2 × propagation delay
minimum frame size = 2 × Tp × bandwidth
~~~

For 10 Mbit/s Ethernet, the standard round-trip slot time is 51.2 µs, so the minimum frame is 51.2 × 10^-6 × 10^7 = 512 bits, or 64 bytes. That's why Ethernet frames are at least 64 bytes and short frames are padded.

## Why modern Ethernet doesn't need CSMA/CD

Switched, full-duplex Ethernet gives each device a dedicated link to a switch with separate paths in each direction, so collisions can't happen. CSMA/CD remains in the standard for historical compatibility but is effectively unused on modern wired networks. The 64-byte minimum frame survives as a legacy of that design.

## CSMA/CA and Wi-Fi

Wi-Fi uses CSMA with collision avoidance (CSMA/CA), because collision detection doesn't work well over radio. A radio's own transmission is millions of times stronger at its antenna than a distant station's signal, so it can't hear a collision while sending. And in the **hidden terminal problem**, two laptops on opposite sides of an access point can each reach the access point but not each other, so carrier sensing misses the conflict.

Wi-Fi responds in three ways: stations wait a random backoff before transmitting even when the channel seems idle, every unicast frame must be acknowledged, and stations can reserve the channel with request-to-send and clear-to-send (RTS/CTS) messages that everyone near the access point hears.

## How interviewers test this

GATE asks ALOHA efficiency, backoff ranges and minimum frame size calculations. Use the formula 2 × Tp × B with consistent units. Interviewers ask "Why does Wi-Fi use CSMA/CA instead of CSMA/CD?", answered with the inability to listen while transmitting and the hidden terminal problem.`,
    sources: [SYSTEMS_APPROACH, IEEE_8023]
  },

  "ethernet-switching-vlans": {
    theory: `Ethernet is the dominant technology for wired local networks, and switches are what make modern Ethernet fast and organized. This lesson explains MAC addresses and the Ethernet frame, how a switch learns where every device is without any configuration, how the Spanning Tree Protocol prevents loops from melting a network, and how VLANs divide one physical network into several logical ones.

## MAC addresses

Every network interface has a 48-bit MAC (media access control) address, written as six hexadecimal pairs such as \`3C:52:82:1A:9F:04\`. The first 24 bits form the organizationally unique identifier (OUI), assigned to the manufacturer, and the manufacturer assigns the rest. The address \`FF:FF:FF:FF:FF:FF\` is the broadcast address, delivered to every device on the network.

MAC addresses only matter within one local network. When a packet crosses a router, the router replaces the Ethernet header with a new one for the next link, while the IP addresses stay the same end to end. Modern phones randomize their MAC address on each Wi-Fi network to make tracking harder.

## The Ethernet frame

An Ethernet frame contains these fields in order:

| Field | Size | Purpose |
|---|---|---|
| Preamble and start delimiter | 8 bytes | Synchronize the receiver's clock and mark the frame start |
| Destination MAC | 6 bytes | Who the frame is for |
| Source MAC | 6 bytes | Who sent it |
| Type | 2 bytes | Protocol inside, such as 0x0800 for IPv4 or 0x0806 for ARP |
| Payload | 46 to 1,500 bytes | The data, padded to at least 46 bytes |
| Frame check sequence | 4 bytes | A 32-bit CRC to detect corruption |

The 1,500-byte maximum payload is the standard Ethernet MTU (maximum transmission unit). Data centers often enable "jumbo frames" of about 9,000 bytes to reduce per-frame overhead.

## How a switch learns

A switch keeps a MAC address table mapping addresses to ports. It builds the table entirely from traffic it sees:

1. A frame arrives on port 3 from MAC address A, so the switch records that A is reachable through port 3
2. The switch looks up the destination address in its table
3. If the destination is known, it forwards the frame only to that port, which is called filtering
4. If the destination is unknown or is the broadcast address, it sends the frame out of every port except the one it came in on, which is called flooding
5. Entries expire after a timeout, commonly 300 seconds, so a device that moves to another port is relearned

When the unknown destination replies, the switch learns its port from the reply's source address, and from then on traffic between the two goes only where it's needed. No administrator configures any of this.

## Loops and broadcast storms

Network designers add redundant links between switches so that one failed cable doesn't cut off a building. But redundant links create loops, and Ethernet frames have no time-to-live counter. A single broadcast frame circulates around the loop forever, multiplying at every switch that floods it. Within seconds the links saturate, switches' MAC tables thrash as the same addresses appear on different ports, and the network stops working. This is a **broadcast storm**.

## Spanning Tree Protocol

The Spanning Tree Protocol (STP, IEEE 802.1D) keeps redundant links while preventing loops. Switches exchange messages to elect a root bridge, the switch with the lowest bridge ID. Each switch then finds its lowest-cost path to the root and blocks any port that would create a loop. The active topology becomes a tree.

If an active link fails, switches recompute the tree and unblock a previously blocked port. Classic STP takes 30 to 50 seconds to converge; Rapid STP (802.1w) converges in a few seconds or less, which is why it's the modern default.

## VLANs

A VLAN (virtual LAN) divides one physical switching network into separate logical networks. A campus might put students, staff, servers and CCTV cameras into different VLANs on the same switches. Each VLAN is its own broadcast domain, so broadcasts from student laptops never reach the cameras, and traffic between VLANs must pass through a router or layer 3 switch, where security rules apply.

## Trunks and 802.1Q tagging

Links between switches usually carry several VLANs at once. These **trunk** links add a 4-byte 802.1Q tag to each frame, containing a 12-bit VLAN ID, so the receiving switch knows which VLAN the frame belongs to. Twelve bits allow 4,094 usable VLANs. Ports connected to end devices are **access** ports, belonging to one VLAN, and the switch adds and removes tags so ordinary devices never see them.

## How interviewers test this

Expect "How does a switch learn MAC addresses?", "What happens to a frame with an unknown destination?" and "What is STP and why is it needed?" Describe learning from source addresses, flooding unknown destinations, and STP blocking redundant ports to prevent broadcast storms. For VLANs, mention broadcast domains and 802.1Q tags.`,
    sources: [IEEE_8023, SYSTEMS_APPROACH, STANFORD_CS144]
  }
};
