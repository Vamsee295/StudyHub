import { Course } from './types';
import { generateLessons } from './utils';

export const computerNetworksCourse: Course = {
  id: "course-cn",
  slug: "computer-networks",
  title: "Computer Networks",
  description: "Understand the OSI model, TCP/IP, and how the internet works.",
  category: "Core CS",
  icon: "Globe",
  displayOrder: 7,
  modules: [
    {
      id: "cn-mod-1",
      slug: "network-basics",
      title: "Network Basics",
      description: "LAN, WAN, Topologies, and transmission media.",
      difficulty: "Beginner",
      estimatedMinutes: 60,
      lessons: generateLessons("network-basics", 4)
    },
    {
      id: "cn-mod-2",
      slug: "osi-model",
      title: "OSI & TCP/IP Models",
      description: "Deep dive into the 7 layers of OSI and the TCP/IP stack.",
      difficulty: "Intermediate",
      estimatedMinutes: 90,
      lessons: generateLessons("osi-model", 6)
    },
    {
      id: "cn-mod-3",
      slug: "physical-data-link",
      title: "Physical & Data Link Layers",
      description: "MAC addresses, framing, error detection, and switching.",
      difficulty: "Intermediate",
      estimatedMinutes: 75,
      lessons: generateLessons("physical-data-link", 5)
    },
    {
      id: "cn-mod-4",
      slug: "network-layer",
      title: "Network Layer",
      description: "IPv4 vs IPv6, IP addressing, and routing algorithms.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: generateLessons("network-layer", 6)
    },
    {
      id: "cn-mod-5",
      slug: "subnetting",
      title: "Subnetting",
      description: "Classful vs Classless addressing, CIDR, and subnet masks.",
      difficulty: "Advanced",
      estimatedMinutes: 75,
      lessons: generateLessons("subnetting", 5)
    },
    {
      id: "cn-mod-6",
      slug: "transport-layer",
      title: "Transport Layer",
      description: "TCP vs UDP, 3-way handshake, flow control, and congestion control.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: generateLessons("transport-layer", 6)
    },
    {
      id: "cn-mod-7",
      slug: "application-layer",
      title: "Application Layer",
      description: "HTTP/HTTPS, DNS, FTP, SMTP, and WebSockets.",
      difficulty: "Intermediate",
      estimatedMinutes: 75,
      lessons: generateLessons("application-layer", 5)
    },
    {
      id: "cn-mod-8",
      slug: "network-security",
      title: "Network Security",
      description: "Cryptography, TLS/SSL, firewalls, and common attacks.",
      difficulty: "Intermediate",
      estimatedMinutes: 75,
      lessons: generateLessons("network-security", 5)
    }
  ]
};
