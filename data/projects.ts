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
    id: "onlyfriendssss",
    title: "OnlyFriendssss - Activity Matching Platform",
    description:
      "A social platform for activity matching. Features AI Face Verification, Real-time Chat, and Google Maps API for trip routing. Integrated Firebase Auth & JWT for secure user sessions and a Peer-to-Peer Trust Score system.",
    tags: [
      "React (Vite)",
      "Node.js",
      "Express",
      "Prisma (MySQL)",
      "Socket.io",
      "Firebase Auth",
      "Tailwind CSS 4",
      "Framer Motion",
    ],
    github: "https://github.com/piecahcih/onlyfriendssss-frontend",
    demo: "https://onlyfriendssss.vercel.app/",
    featured: true,
    deviceType: "mobile",
    bgColor: "bg-linear-to-br from-orange-600/90 to-red-600/90",
    screenshots: ["/projects/onlyfriendssss.png"],
  },
  {
    id: "dongcard",
    title: "DONGCARD - One Piece Card E-commerce",
    description:
      "Full-stack e-commerce platform using React, Node.js, and Prisma. Features database transactions for reliable inventory management, secure JWT Authentication, and a robust Admin Dashboard with complex filtering.",
    tags: ["React", "Node.js", "Prisma", "MySQL", "Tailwind CSS", "JWT", "Zustand"],
    github: "https://github.com/murthehelp24/Project-Dongcard-New",
    demo: "https://project-dongcard-new-a2rs.vercel.app",
    featured: true,
    deviceType: "desktop",
    bgColor: "bg-linear-to-br from-blue-600/90 to-indigo-600/90",
    screenshots: ["/projects/image.png"],
  },
  {
    id: "job-Tracking",
    title: "Job-Tracking - Job Application Tracker",
    description:
      "A specialized platform for managing and tracking job applications. Built with Next.js and Prisma, it features a comprehensive dashboard for monitoring application statuses, company details, and progress throughout the recruitment lifecycle.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostCSS", "Tailwind CSS", "Vercel"],
    github: "https://github.com/murthehelp24/Job-tackking",
    demo: "https://job-tackking.vercel.app/",
    featured: true,
    deviceType: "mobile",
    bgColor: "bg-linear-to-br from-indigo-900/90 to-slate-900/90",
    screenshots: ["/projects/job-tackking.webp"],
  },
];
