"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden pt-0 pb-10"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="section">
        <div className="mb-20 text-center">
          <span className="text-base font-bold uppercase tracking-widest text-(--accent)">
            Selected work
          </span>
          <h2 className="mt-4 px-2 text-3xl font-bold tracking-tight text-pretty sm:text-5xl md:text-6xl">
            Featured{" "}
            <span className="text-gradient-shimmer">Projects</span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl px-2 text-base font-light leading-relaxed text-(--muted) sm:text-xl">
            Projects built with Next.js, React, and TypeScript — with solid backends.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:gap-16 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          {projects
            .filter((p) => p.featured)
            .map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/murthehelp24"
            target="_blank"
            rel="noopener noreferrer"
            className="group mx-auto inline-flex max-w-[min(100%,22rem)] items-center gap-2 px-2 text-center text-sm font-semibold text-(--accent) transition-colors hover:text-(--accent-hover) sm:max-w-none sm:gap-3 sm:text-lg"
          >
            <span>See more on GitHub</span>
            <ExternalLink size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
