"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const RADIUS = 165;
  const SIZE = 380;

  const rotRef = useRef({ rx: 0.2, ry: 0 });
  const velRef = useRef({ vx: 0, vy: 0.004 });
  const dragRef = useRef({ active: false, lx: 0, ly: 0 });
  const rafRef = useRef<number>(0);

  const [items, setItems] = useState(() =>
    BASE.map((p) => ({ ...p, scale: 1, opacity: 1 }))
  );

  const tick = useCallback(() => {
    if (!dragRef.current.active) {
      rotRef.current.ry += velRef.current.vy;
      rotRef.current.rx += velRef.current.vx;
      velRef.current.vx *= 0.98;
    }

    setItems(
      BASE.map((p) => {
        const r1 = rotateY(p, rotRef.current.ry);
        const r2 = rotateX(r1, rotRef.current.rx);
        const depth = (r2.z + 1.5) / 2.5;
        return {
          x: r2.x,
          y: r2.y,
          z: r2.z,
          scale: Math.max(0.25, depth),
          opacity: Math.max(0.15, depth * 0.95),
        };
      })
    );

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  /* --- Mouse handlers --- */
  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { active: true, lx: e.clientX, ly: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
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

  /* --- Touch handlers --- */
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    dragRef.current = { active: true, lx: t.clientX, ly: t.clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current.active) return;
    const t = e.touches[0];
    const dx = t.clientX - dragRef.current.lx;
    const dy = t.clientY - dragRef.current.ly;
    rotRef.current.ry += dx * 0.008;
    rotRef.current.rx += dy * 0.008;
    dragRef.current.lx = t.clientX;
    dragRef.current.ly = t.clientY;
  };
  const onTouchEnd = () => {
    dragRef.current.active = false;
  };

  return (
    <div
      className="relative mx-auto select-none cursor-grab active:cursor-grabbing"
      style={{ width: SIZE, height: SIZE }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.07) 0%, transparent 70%)",
          border: "1px solid rgba(139,92,246,0.15)",
        }}
      />

      {/* Wireframe grid lines — SVG overlay */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        {/* Latitude circles */}
        {[0.25, 0.5, 0.75].map((t) => {
          const r = RADIUS * Math.sin(Math.PI * t);
          return (
            <ellipse
              key={t}
              cx={SIZE / 2}
              cy={SIZE / 2 - RADIUS * Math.cos(Math.PI * t)}
              rx={r}
              ry={r * 0.28}
              fill="none"
              stroke="rgba(139,92,246,0.12)"
              strokeWidth={0.8}
            />
          );
        })}
        {/* Longitude arcs (equator ellipse) */}
        <ellipse
          cx={SIZE / 2}
          cy={SIZE / 2}
          rx={RADIUS}
          ry={RADIUS * 0.28}
          fill="none"
          stroke="rgba(139,92,246,0.15)"
          strokeWidth={0.8}
        />
        {/* Vertical circle */}
        <ellipse
          cx={SIZE / 2}
          cy={SIZE / 2}
          rx={RADIUS * 0.28}
          ry={RADIUS}
          fill="none"
          stroke="rgba(139,92,246,0.12)"
          strokeWidth={0.8}
        />
        {/* Main circle */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(139,92,246,0.15)"
          strokeWidth={1}
        />
      </svg>

      {/* Tech icons */}
      {TECH.map((tech, i) => {
        const p = items[i];
        if (!p) return null;
        const { Icon } = tech;
        const cx = SIZE / 2 + p.x * RADIUS;
        const cy = SIZE / 2 + p.y * RADIUS;
        const iconSize = Math.round(14 + p.scale * 20); // 14–34px
        const showLabel = p.z > 0.15;

        return (
          <div
            key={tech.name}
            className="absolute flex flex-col items-center pointer-events-none"
            style={{
              left: cx,
              top: cy,
              transform: "translate(-50%, -50%)",
              opacity: p.opacity,
              zIndex: Math.round((p.z + 1) * 50),
            }}
          >
            <Icon size={iconSize} style={{ color: tech.color }} />
            {showLabel && (
              <span
                className="mt-0.5 text-[7px] font-bold uppercase tracking-widest leading-none"
                style={{ color: tech.color }}
              >
                {tech.name}
              </span>
            )}
          </div>
        );
      })}

      {/* Drag hint */}
      <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-(--muted) pointer-events-none select-none opacity-60">
        drag to rotate
      </p>
    </div>
  );
}
