"use client";

import { motion } from "framer-motion";
import { Mail, FileText } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { socials } from "@/data/config";

export function Contact() {
  const contactItems = [
    {
      key: "github",
      icon: FaGithub as React.ElementType,
      title: "GitHub",
      desc: "Check out my source code and projects.",
      href: socials.find((s) => s.name === "GitHub")?.url ?? "#",
      color: "from-(--accent) to-[#801b0a]", // Vermilion to Dark Mahogany
    },
    {
      key: "resume",
      icon: FileText,
      title: "Resume",
      desc: "Download my PDF resume.",
      href: "/resume.pdf",
      color: "from-[#4b5563] to-[#1f2937]", // Slate/Silver theme
    },
    {
      key: "email",
      icon: Mail,
      title: "Email",
      desc: "Contact me directly via email.",
      href: socials.find((s) => s.name === "Email")?.url ?? "#",
      color: "from-(--accent) via-[#b91c1c] to-[#450a0a]", // Warm Vermilion Gradient
    },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden pt-0 pb-24 sm:pb-32"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 px-2 text-3xl font-bold text-pretty sm:text-5xl md:text-6xl">
            Contact <span className="text-gradient-shimmer">Me</span>
          </h2>
          <p className="mx-auto max-w-2xl px-3 text-base text-(--muted) sm:text-lg md:text-xl">
            Open for new opportunities, both freelance and full-time.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {contactItems.map((item, i) => (
            <motion.a
              key={item.key}
              href={item.href}
              target={item.href.startsWith("http") || item.href.endsWith(".pdf") ? "_blank" : undefined}
              rel={item.href.startsWith("http") || item.href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
              className="group glass relative cursor-pointer overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-105 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
              />
              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className={`h-16 w-16 rounded-2xl bg-linear-to-br ${item.color} p-0.5`}>
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-(--background)">
                    {(() => {
                      const Icon = item.icon as any;
                      return <Icon size={32} style={{ color: "var(--foreground)" }} />;
                    })()}
                  </div>
                </div>
                <div>
                  <h3
                    className={`bg-linear-to-br ${item.color} mb-2 bg-clip-text px-1 text-xl font-bold text-transparent sm:text-2xl`}
                  >
                    {item.title}
                  </h3>
                  <p className="px-1 text-xs text-(--muted) sm:text-sm">{item.desc}</p>
                </div>
                <div
                  className={`bg-linear-to-br ${item.color} mt-2 bg-clip-text text-sm font-semibold text-transparent transition-transform duration-300 group-hover:translate-x-2`}
                >
                  Open →
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
