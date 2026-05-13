export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  deviceType: "desktop" | "mobile";
  bgColor?: string;
  screenshots?: string[];
}

export const projects: Project[] = [
  {
    id: "dongcard",
    title: "DongCard",
    description:
      "Digital business card management system with QR Code and easy-to-use profile sharing.",
    tags: ["Next.js", "TypeScript", "Prisma", "SQLite"],
    github: "https://github.com/yourusername/dongcard",
    featured: true,
    deviceType: "desktop",
    bgColor: "bg-linear-to-br from-[#D2E603]/80 to-[#1B2118]/80",
    screenshots: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
    ],
  },
  {
    id: "onlyfriendssss",
    title: "OnlyFriendssss",
    description:
      "Social platform for close friends with real-time chat and activity feed.",
    tags: ["React", "Vite", "Express", "Prisma"],
    github: "https://github.com/yourusername/onlyfriendssss",
    featured: true,
    deviceType: "mobile",
    bgColor: "bg-linear-to-br from-[#6E7A61]/90 to-[#1B2118]/90",
    screenshots: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    id: "resume-portfolio",
    title: "Resume Portfolio",
    description:
      "Dynamic Portfolio and Resume builder using Next.js + App Router with Tailwind CSS.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/yourusername/resume",
    featured: true,
    deviceType: "desktop",
    bgColor: "bg-linear-to-br from-[#1B2118]/90 to-[#D2E603]/70",
    screenshots: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1400&auto=format&fit=crop",
    ],
  },
  {
    id: "news-app",
    title: "News App",
    description:
      "News reading app with beautiful minimalist design detail page and responsive layout.",
    tags: ["Next.js", "Clerk", "TypeScript", "Tailwind"],
    github: "https://github.com/yourusername/news-app",
    featured: true,
    deviceType: "mobile",
    bgColor: "bg-linear-to-br from-[#D2E603]/90 to-[#6E7A61]/90",
    screenshots: [
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=900&auto=format&fit=crop",
    ],
  },
];
