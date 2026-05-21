"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
  SiPrisma,
  SiDocker,
  SiGit,
  SiPostgresql,
  SiMongodb,
  SiVercel,
  SiFigma,
} from "react-icons/si";
import { FaGithub } from "react-icons/fa";

const TECH = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "Tailwind", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Prisma", Icon: SiPrisma, color: "#818cf8" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#336791" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { name: "Vercel", Icon: SiVercel, color: "#e4e4e7" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
  { name: "GitHub", Icon: FaGithub, color: "#a1a1aa" },
];

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Distribute N points evenly on a sphere using Fibonacci spiral */
function fibonacciSphere(n: number): Vec3[] {
  const points: Vec3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return points;
}

function rotateY(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function rotateX(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

const BASE = fibonacciSphere(TECH.length);

export function TechGlobe() {
  const [size, setSize] = useState(380);
  const [radius, setRadius] = useState(165);
  const [isDark, setIsDark] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Extra cosmic particles
  const PARTICLES = useMemo(() =>
    fibonacciSphere(24).map(p => ({ ...p, r: Math.random() * 2 + 1 })),
    []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSize(300);
        setRadius(130);
      } else {
        setSize(380);
        setRadius(165);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rotRef = useRef({ rx: 0.2, ry: 0 });
  const velRef = useRef({ vx: 0, vy: 0.004 });
  const dragRef = useRef({ active: false, lx: 0, ly: 0 });
  const hoverRef = useRef({ active: false, x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    if (!dragRef.current.active) {
      const speedMult = hoverRef.current.active ? 0.3 : 1;
      rotRef.current.ry += velRef.current.vy * speedMult;
      rotRef.current.rx += velRef.current.vx * speedMult;
      velRef.current.vx *= 0.98;
    }

    // Update Particles
    PARTICLES.forEach((p, i) => {
      const el = particlesRef.current[i];
      if (!el) return;
      const r1 = rotateY(p, rotRef.current.ry * 1.5); // Drift faster
      const r2 = rotateX(r1, rotRef.current.rx * 1.5);
      const opacity = Math.max(0.1, (r2.z + 1) / 2);
      el.style.transform = `translate(-50%, -50%) translate(${r2.x * (radius * 1.15)}px, ${r2.y * (radius * 1.15)}px)`;
      el.style.opacity = opacity.toString();
    });

    // Update Tech Icons
    BASE.forEach((p, i) => {
      const el = itemsRef.current[i];
      if (!el) return;

      const r1 = rotateY(p, rotRef.current.ry);
      const r2 = rotateX(r1, rotRef.current.rx);

      const cx = size / 2 + r2.x * radius;
      const cy = size / 2 + r2.y * radius;

      let extraScale = 0;
      let extraGlow = 0;

      if (hoverRef.current.active) {
        const dx = cx - hoverRef.current.x;
        const dy = cy - hoverRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const threshold = 60;

        if (dist < threshold && r2.z > 0) {
          const power = (1 - dist / threshold);
          extraScale = power * 0.5;
          extraGlow = power;
        }
      }

      const depth = (r2.z + 1.5) / 2.5;
      const scale = Math.max(0.25, depth) + extraScale;
      // Higher base opacity for light mode
      const baseOpacity = isDark ? 0.15 : 0.35;
      const opacity = Math.max(baseOpacity, depth * 0.95) + extraGlow * 0.5;

      el.style.transform = `translate(-50%, -50%) translate(${r2.x * radius}px, ${r2.y * radius}px) scale(${scale})`;
      el.style.opacity = opacity.toString();
      el.style.zIndex = Math.round((r2.z + 1) * 50).toString();
      el.style.filter = extraGlow > 0 ? `drop-shadow(0 0 ${extraGlow * 10}px currentColor)` : "none";

      const label = el.querySelector("span");
      if (label) {
        label.style.display = (r2.z > 0.15 || extraGlow > 0.2) ? "block" : "none";
        // Make label bolder in light mode
        label.style.fontWeight = isDark ? "700" : "800";
      }
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [size, radius, PARTICLES, isDark]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  /* --- Mouse handlers --- */
  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { active: true, lx: e.clientX, ly: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    hoverRef.current = { active: true, x, y };

    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lx;
    const dy = e.clientY - dragRef.current.ly;
    rotRef.current.ry += dx * 0.008;
    rotRef.current.rx += dy * 0.008;
    velRef.current.vy = dx * 0.002;
    velRef.current.vx = dy * 0.001;
    dragRef.current.lx = e.clientX;
    dragRef.current.ly = e.clientY;
  };
  const onMouseUp = () => {
    dragRef.current.active = false;
  };
  const onMouseEnter = () => {
    hoverRef.current.active = true;
  };
  const onMouseLeave = () => {
    dragRef.current.active = false;
    hoverRef.current.active = false;
  };

  /* --- Touch handlers --- */
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    dragRef.current = { active: true, lx: t.clientX, ly: t.clientY };
    hoverRef.current.active = true;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    hoverRef.current.x = t.clientX - rect.left;
    hoverRef.current.y = t.clientY - rect.top;

    if (!dragRef.current.active) return;
    const dx = t.clientX - dragRef.current.lx;
    const dy = t.clientY - dragRef.current.ly;
    rotRef.current.ry += dx * 0.008;
    rotRef.current.rx += dy * 0.008;
    dragRef.current.lx = t.clientX;
    dragRef.current.ly = t.clientY;
  };
  const onTouchEnd = () => {
    dragRef.current.active = false;
    hoverRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto select-none cursor-grab active:cursor-grabbing"
      style={{ width: size, height: size }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)",
          border: "1px solid rgba(139,92,246,0.1)",
        }}
      />

      {/* Wireframe grid lines — SVG overlay */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Latitude circles */}
        {[0.25, 0.5, 0.75].map((t) => {
          const r = radius * Math.sin(Math.PI * t);
          return (
            <ellipse
              key={t}
              cx={size / 2}
              cy={size / 2 - radius * Math.cos(Math.PI * t)}
              rx={r}
              ry={r * 0.28}
              fill="none"
              stroke={isDark ? "rgba(139,92,246,0.12)" : "rgba(109,40,217,0.3)"}
              strokeWidth={0.8}
            />
          );
        })}
        {/* Longitude arcs (equator ellipse) */}
        <ellipse
          cx={size / 2}
          cy={size / 2}
          rx={radius}
          ry={radius * 0.28}
          fill="none"
          stroke={isDark ? "rgba(139,92,246,0.15)" : "rgba(109,40,217,0.35)"}
          strokeWidth={0.8}
        />
        {/* Vertical circle */}
        <ellipse
          cx={size / 2}
          cy={size / 2}
          rx={radius * 0.28}
          ry={radius}
          fill="none"
          stroke={isDark ? "rgba(139,92,246,0.12)" : "rgba(109,40,217,0.3)"}
          strokeWidth={0.8}
        />
        {/* Main circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isDark ? "rgba(139,92,246,0.15)" : "rgba(109,40,217,0.35)"}
          strokeWidth={1}
        />
      </svg>

      {/* Cosmic Particles */}
      {PARTICLES.map((_, i) => (
        <div
          key={`p-${i}`}
          ref={(el) => {
            particlesRef.current[i] = el;
          }}
          className={`absolute h-1 w-1 rounded-full pointer-events-none ${isDark ? "bg-white/40" : "bg-violet-600/40"}`}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Tech icons */}
      {TECH.map((tech, i) => {
        const { Icon } = tech;
        return (
          <div
            key={tech.name}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            className="absolute flex flex-col items-center pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Icon size={24} style={{ color: tech.color }} />
            <span
              className="mt-0.5 text-[7px] font-bold uppercase tracking-widest leading-none"
              style={{ color: tech.color }}
            >
              {tech.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
