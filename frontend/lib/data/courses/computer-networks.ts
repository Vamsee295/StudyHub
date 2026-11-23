import { Course, CourseLesson, CourseModule } from './types';
import { networkBasicsLessons, osiModelLessons, dataLinkLessons } from './cn-content-foundations';
import { networkLayerLessons, subnettingLessons } from './cn-content-network';
import { transportLayerLessons, applicationLayerLessons, networkSecurityLessons } from './cn-content-upper';

const minutes = (lessons: CourseLesson[]) => lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);

function cnModule(
  id: string,
  slug: string,
  title: string,
  description: string,
  difficulty: CourseModule["difficulty"],
  lessons: CourseLesson[]
): CourseModule {
  return { id, slug, title, description, difficulty, estimatedMinutes: minutes(lessons), lessons };
}

export const computerNetworksCourse: Course = {
  id: "course-cn",
  slug: "computer-networks",
  title: "Computer Networks",
  description: "How the internet works, layer by layer: OSI and TCP/IP, error detection and sliding windows, IP addressing and subnetting, routing, TCP congestion control, DNS and HTTP, and network security. Aligned with the GATE CS syllabus and placement interviews.",
  category: "Core CS",
  icon: "Globe",
  displayOrder: 7,
  modules: [
    cnModule("cn-mod-1", "network-basics", "Network Basics",
      "Network types and devices, topologies, transmission media, switching, and delay numericals.",
      "Beginner", networkBasicsLessons),
    cnModule("cn-mod-2", "osi-model", "OSI & TCP/IP Models",
      "The seven OSI layers, the TCP/IP stack, encapsulation, and collision vs broadcast domains.",
      "Beginner", osiModelLessons),
    cnModule("cn-mod-3", "physical-data-link", "Physical & Data Link Layers",
      "Framing, parity / checksum / CRC, sliding-window flow control, ALOHA and CSMA, Ethernet switching and VLANs.",
      "Intermediate", dataLinkLessons),
    cnModule("cn-mod-4", "network-layer", "Network Layer",
      "IPv4 addressing and fragmentation, ARP / DHCP / ICMP / NAT, routing algorithms, and IPv6.",
      "Intermediate", networkLayerLessons),
    cnModule("cn-mod-5", "subnetting", "Subnetting",
      "Subnet masks and CIDR, subnetting and VLSM, supernetting and longest prefix match.",
      "Advanced", subnettingLessons),
    cnModule("cn-mod-6", "transport-layer", "Transport Layer",
      "TCP vs UDP and ports, the three-way handshake and teardown, flow control and congestion control.",
      "Advanced", transportLayerLessons),
    cnModule("cn-mod-7", "application-layer", "Application Layer",
      "DNS, HTTP and its versions, email / FTP / WebSockets, and what happens when you type a URL.",
      "Intermediate", applicationLayerLessons),
    cnModule("cn-mod-8", "network-security", "Network Security",
      "Symmetric and public-key cryptography, TLS and certificates, firewalls, VPNs and common attacks.",
      "Intermediate", networkSecurityLessons),
  ]
};
