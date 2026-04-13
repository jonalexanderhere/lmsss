export const previewCourses = [
  {
    id: "course-net-01",
    slug: "advanced-networking-fundamentals",
    title: "Advanced Networking Fundamentals",
    category: "Networking",
    progress: 72,
    lessons: 14,
    labs: 5
  },
  {
    id: "course-cyber-01",
    slug: "defensive-cybersecurity-basics",
    title: "Defensive Cybersecurity Basics",
    category: "Cybersecurity",
    progress: 49,
    lessons: 10,
    labs: 4
  },
  {
    id: "course-sys-01",
    slug: "linux-server-administration",
    title: "Linux Server Administration",
    category: "System Administration",
    progress: 81,
    lessons: 12,
    labs: 6
  }
];

export const chartData = [
  { week: "W1", networking: 62, cybersecurity: 48, sysadmin: 55 },
  { week: "W2", networking: 70, cybersecurity: 58, sysadmin: 61 },
  { week: "W3", networking: 76, cybersecurity: 64, sysadmin: 68 },
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
  level: "Technician",
  weakness: "Subnetting CIDR /27 ke atas dan analisis routing table statik.",
  recommendation: "Ulangi modul subnetting lanjutan, lalu kerjakan lab routing dua segmen VLAN.",
  next_step: "Lanjut ke Advanced Subnetting Drill kemudian Mini Project Inter-VLAN Routing."
};
