"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const ids = navItems.map((item) => item.href.replace("#", ""));
      let current = ids[0];
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 140) {
          current = ids[i];
          break;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-6">
      <nav className="flex items-center justify-center px-4">
        <div className="flex h-12 sm:h-14 items-center gap-0.5 sm:gap-1 rounded-full glass-strong px-2 sm:px-4 shadow-xl shadow-black/10">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;
            return (
              <a
                key={item.href}
                href={item.href}
                className="relative rounded-full px-2.5 py-1.5 sm:px-5 sm:py-2.5 text-[11px] sm:text-sm font-semibold transition-colors"
                style={{ color: isActive ? "var(--foreground)" : "var(--muted)" }}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "var(--accent)",
                      opacity: 0.1,
                      border: "1px solid var(--accent)",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
          
          <div className="mx-1 h-4 w-px bg-(--card-border) sm:mx-2" />
          
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
