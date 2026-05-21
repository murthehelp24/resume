"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AmbientStar {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  phase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  color: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ambientStarsRef = useRef<AmbientStar[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);

  const mousePos = useRef({ x: -1000, y: -1000 });
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Soft spring for the mouse glow
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 120 });

  const [isDark, setIsDark] = useState(true);

  // ── Theme observer ────────────────────────────────────────────────────────
  useEffect(() => {
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const obs = new MutationObserver(checkTheme);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // ── Canvas sizing + ambient star generation ───────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      // Generate more stars for better constellation links
      const count = Math.min(Math.floor((w * h) / 10000), 250);
      ambientStarsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.5,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Mouse tracker ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      mouseX.set(touch.clientX);
      mouseY.set(touch.clientY);
      mousePos.current = { x: touch.clientX, y: touch.clientY };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [mouseX, mouseY]);

  // ── Main render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let frameCount = 0;

    const spawnShootingStar = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = Math.random() * w;
      const y = -20;
      const speed = Math.random() * 10 + 5;
      shootingStarsRef.current.push({
        x, y, vx: (Math.random() - 0.2) * 4 + 2, vy: speed,
        length: Math.random() * 80 + 50, alpha: 1.0,
        color: isDark ? "#ffffff" : "#e6391a",
      });
    };

    const render = () => {
      frameCount++;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isLowPerf = w < 768;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = isDark ? "screen" : "source-over";

      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const linkRadius = isLowPerf ? 120 : 180;

      // ── 1. Shooting Stars ──────────────────────────────────────────────
      if (frameCount % 240 === 0 && Math.random() > 0.5) spawnShootingStar();
      const ss = shootingStarsRef.current;
      for (let i = ss.length - 1; i >= 0; i--) {
        const s = ss[i];
        s.x += s.vx; s.y += s.vy; s.alpha -= 0.01;
        if (s.alpha <= 0) { ss.splice(i, 1); continue; }
        ctx.globalAlpha = s.alpha * 0.5;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10);
        ctx.stroke();
      }

      // ── 2. Ambient Stars & Constellation Links ──────────────────────────
      const stars = ambientStarsRef.current;
      // Contrast: Lines are Cyan/Electric Blue, Background glow is Red
      const lineStrokeColor = isDark ? "165, 243, 252" : "8, 145, 178"; // Cyan-200 vs Cyan-700
      const pointGlowColor = isDark ? "255, 255, 255" : "109, 40, 217";

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.phase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.phase) + 1) * 0.4 + 0.2;
        
        const dx = mx - star.x;
        const dy = my - star.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        // Draw Link if close
        if (dist < linkRadius && mx > -100) {
          const opacity = (1 - dist / linkRadius) * 0.6;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineStrokeColor}, ${opacity})`;
          ctx.lineWidth = 1.2; // Increased from 0.8
          ctx.moveTo(mx, my);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();

          // Connect nearby stars to each other too (limited for perf)
          if (!isLowPerf) {
            for (let j = i + 1; j < stars.length; j++) {
              const other = stars[j];
              const d2x = star.x - other.x;
              const d2y = star.y - other.y;
              const d2 = Math.sqrt(d2x * d2x + d2y * d2y);
              if (d2 < 60) {
                const sdist = Math.sqrt((mx - other.x)**2 + (my - other.y)**2);
                if (sdist < linkRadius) {
                  const sOpacity = (1 - sdist / linkRadius) * (1 - d2 / 60) * 0.3;
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(${lineStrokeColor}, ${sOpacity})`;
                  ctx.lineWidth = 0.8;
                  ctx.moveTo(star.x, star.y);
                  ctx.lineTo(other.x, other.y);
                  ctx.stroke();
                }
              }
            }
          }
          
          // Draw small glow at star point
          ctx.globalAlpha = opacity;
          ctx.fillStyle = isDark ? "#ffffff" : `rgb(${pointGlowColor})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size + 1, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Base Star
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = isDark ? "#ffffff" : "#64748b";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-(--background) transition-colors duration-500 overflow-hidden">
      {/* Soft Follower Glow */}
      <motion.div
        className="absolute h-[300px] w-[300px] rounded-full opacity-[0.08] blur-[60px]"
        style={{
          left: smoothX, top: smoothY, x: "-50%", y: "-50%",
          background: isDark ? "radial-gradient(circle, #e6391a 0%, transparent 70%)" : "radial-gradient(circle, #6d28d9 0%, transparent 70%)",
        }}
      />

      {/* Static ambient orbs */}
      <div className="absolute -top-[12%] -left-[8%] h-[550px] w-[550px] rounded-full blur-[120px]" style={{ opacity: isDark ? 0.22 : 0.12, background: isDark ? "rgba(139,92,246,0.35)" : "rgba(167,139,250,0.2)" }} />
      <div className="absolute -bottom-[12%] -right-[8%] h-[650px] w-[650px] rounded-full blur-[140px]" style={{ opacity: isDark ? 0.18 : 0.1, background: isDark ? "rgba(6,182,212,0.2)" : "rgba(103,232,249,0.12)" }} />

      {/* Overlays */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, var(--card-border) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
    </div>
  );
}
