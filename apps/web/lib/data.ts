export const previewCourses = [
  {
    id: "1",
    slug: "mikrotik-advanced-routing",
    title: "MikroTik Advanced Routing (UKK Prep)",
    category: "Networking",
    lessons: 12,
    labs: 5,
    progress: 75
  },
  {
    id: "2",
    slug: "linux-server-admin",
    title: "Linux Server Administration & Hardening",
    category: "System Admin",
    lessons: 8,
    labs: 3,
    progress: 40
  },
  {
    id: "3",
    slug: "network-security-fundamentals",
    title: "Network Security Fundamentals v2",
    category: "Cybersecurity",
    lessons: 15,
    labs: 6,
    progress: 15
  },
  {
    id: "4",
    slug: "cisco-ccna-switching-wireless",
    title: "Cisco CCNA: Switching & Wireless",
    category: "Networking",
    lessons: 20,
    labs: 8,
    progress: 0
  },
  {
    id: "5",
    slug: "fiber-optic-installation",
    title: "Fiber Optic Installation Standards",
    category: "Telecom",
    lessons: 6,
    labs: 2,
    progress: 0
  }
];

export const chartData = [
  { week: "W4", networking: 82, cybersecurity: 71, sysadmin: 78 }
];

export const quizPreview = [
  {
    id: "quiz-subnet-01",
    question: "Berapa jumlah host usable untuk subnet /27?",
    options: ["30", "32", "62", "14"],
    answer: "30"
  },
  {
    id: "quiz-routing-01",
    question: "Protocol mana yang termasuk dynamic routing?",
    options: ["STP", "RIP", "NAT", "ARP"],
    answer: "RIP"
  }
];

export const aiPreview = {
  level: "Network Specialist (L3 Candidate)",
  weakness: "BGP Path Selection & Firewall Rules Deep Packet Inspection",
  recommendation: "Fokus pada MikroTik Hands-on Lab #12 dan review materi 'Mangle Rules'.",
  next_step: "Selesaikan 2 Lab Lanjutan untuk masuk ke Rank 'Engineer'."
};
