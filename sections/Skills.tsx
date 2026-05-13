"use client";

import { motion } from "framer-motion";
import { TechGlobe } from "@/components/TechGlobe";

const skillGroups = [
  {
    title: "Frontend",
    summary: "UI architecture and smooth user experiences",
    items: [
      "Next.js (App Router)",
      "React + TypeScript",
      "Tailwind CSS v4",
      "Framer Motion",
    ],
  },
  {
    title: "Backend",
    summary: "Reliable APIs and production-ready services",
    items: [
      "Node.js + REST API",
      "Prisma ORM",
      "SQLite / PostgreSQL",
      "Auth & middleware",
    ],
  },
  {
    title: "DevOps & Tools",
    summary: "From idea to quality deployment",
    items: [
      "Git + GitHub",
      "Vercel deployment",
      "pnpm workspace",
      "ESLint + TypeScript strict",
    ],
  },
];

export function Skills() {
  return (
    <section
      id="skills"
      className="relative overflow-hidden pt-0 pb-28"
      style={{ scrollMarginTop: "100px" }}
    >
      <div className="section">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-(--accent) sm:text-base">
            Tech stack
          </span>
          <h2 className="mt-2 px-2 text-3xl font-bold tracking-tight text-pretty sm:text-5xl md:text-6xl">
            My{" "}
            <span className="text-gradient-shimmer">Skills</span>
          </h2>
        </motion.div>
        {/* 3D Globe — Bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center mt-10"
        >
          <TechGlobe />
        </motion.div>
        {/* Skill groups — Top */}
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-(--card-border) bg-linear-to-br from-(--card) to-(--card-border) p-5 transition-all duration-200 hover:border-violet-400/40"
            >
              <h3 className="text-base font-semibold">{group.title}</h3>
              <p className="mt-1 text-xs text-(--muted)">{group.summary}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-(--muted)">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
