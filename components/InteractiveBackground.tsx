"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AmbientStar {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  phase: number;
}

interface Stardust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  decay: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  color: string;
  active: boolean;
}

interface StarBurst {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ambientStarsRef = useRef<AmbientStar[]>([]);
  const stardustRef = useRef<Stardust[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const starBurstsRef = useRef<StarBurst[]>([]);

  const mousePos = useRef({ x: -1000, y: -1000 });
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);

  // Multiple springs for multi-layered nebula effect
  const springFast = { damping: 25, stiffness: 160 };
  const springMed = { damping: 35, stiffness: 80 };
  const springSlow = { damping: 45, stiffness: 40 };

  const smoothXFast = useSpring(mouseX, springFast);
  const smoothYFast = useSpring(mouseY, springFast);
  const smoothXMed = useSpring(mouseX, springMed);
  const smoothYMed = useSpring(mouseY, springMed);
  const smoothXSlow = useSpring(mouseX, springSlow);
  const smoothYSlow = useSpring(mouseY, springSlow);

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
      
      setIsMobile(w < 768);
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      // Generate ambient twinkle stars
      const count = Math.min(Math.floor((w * h) / 14000), 150);
      ambientStarsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.8 + 0.3,
        twinkleSpeed: Math.random() * 0.018 + 0.004,
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

    const DUST_COLORS_DARK = ["#ffffff", "#e6391a", "#818cf8", "#c084fc", "#a5f3fc"];
    const DUST_COLORS_LIGHT = ["#e6391a", "#f59e0b", "#fbbf24", "#d97706", "#b45309"];

    let raf: number;
    let frameCount = 0;

    const drawStar4 = (c: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(0, 0, size * 0.35, 0);
      c.quadraticCurveTo(0, 0, 0, size);
      c.quadraticCurveTo(0, 0, -size * 0.35, 0);
      c.quadraticCurveTo(0, 0, 0, -size);
      c.closePath();
      c.fill();
      c.restore();
    };

    const spawnShootingStar = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const fromTop = Math.random() > 0.4;
      const x = fromTop ? Math.random() * w : -20;
      const y = fromTop ? -20 : Math.random() * (h * 0.5);
      const speed = Math.random() * 12 + 8;
      const angle = fromTop ? (Math.PI / 4) + (Math.random() - 0.5) * (Math.PI / 6) : (Math.random() * Math.PI) / 8;
      const colors = isDark ? ["#ffffff", "#e0f2fe", "#a5f3fc", "#c7d2fe"] : ["#f59e0b", "#fbbf24", "#d97706", "#fcd34d"];

      shootingStarsRef.current.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        length: Math.random() * 100 + 80, alpha: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)], active: true,
      });
    };

    const render = () => {
      frameCount++;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const isLowPerf = w < 768;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = isDark ? "screen" : "source-over";

      // ── 1. Ambient Twinkle ─────────────────────────────────────────────
      const stars = ambientStarsRef.current;
      ctx.fillStyle = isDark ? "#ffffff" : "#64748b";
      for (const star of stars) {
        star.phase += star.twinkleSpeed;
        ctx.globalAlpha = 0.12 + (Math.sin(star.phase) + 1) * 0.38;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 2. Shooting Stars ──────────────────────────────────────────────
      if (frameCount % (isLowPerf ? 180 : 120) === 0 && Math.random() > 0.4) spawnShootingStar();
      const ss = shootingStarsRef.current;
      for (let i = ss.length - 1; i >= 0; i--) {
        const s = ss[i];
        s.x += s.vx; s.y += s.vy; s.alpha -= 0.012;
        if (s.alpha <= 0 || s.x > w + 50 || s.y > h + 50) { ss.splice(i, 1); continue; }
        const tailX = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.length;
        const tailY = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.length;
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, s.color);
        ctx.globalAlpha = s.alpha;
        if (isDark && !isLowPerf) { ctx.shadowColor = s.color; ctx.shadowBlur = 8; }
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(s.x, s.y); ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // ── 3. Stardust Particle System ──────────────────────────────────
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      if (mx > -500 && my > -500) {
        const count = isLowPerf ? (frameCount % 2 === 0 ? 1 : 0) : 2;
        for (let i = 0; i < count; i++) {
          const colors = isDark ? DUST_COLORS_DARK : DUST_COLORS_LIGHT;
          stardustRef.current.push({
            x: mx + (Math.random() - 0.5) * 12,
            y: my + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 0.6,
            size: Math.random() * 2.2 + 0.8,
            life: 1.0,
            decay: Math.random() * 0.02 + 0.008,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }

        if (Math.random() < 0.12 && !isLowPerf) {
          starBurstsRef.current.push({
            x: mx, y: my, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
            size: Math.random() * 7 + 3, alpha: 1.0, decay: Math.random() * 0.025 + 0.015,
            color: isDark ? "#ffffff" : "#e6391a", rotation: Math.random() * Math.PI * 2,
          });
        }
      }

      const dust = stardustRef.current;
      for (let i = dust.length - 1; i >= 0; i--) {
        const p = dust[i];
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.98; p.vy *= 0.98;
        p.life -= p.decay;
        if (p.life <= 0) { dust.splice(i, 1); continue; }
        
        ctx.globalAlpha = p.life * 0.8;
        ctx.fillStyle = p.color;
        if (isDark && !isLowPerf && p.life > 0.4) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 5;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── 4. Star bursts ────────────────────────────────────────────────
      const bursts = starBurstsRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx; b.y += b.vy; b.vx *= 0.94; b.vy *= 0.94; b.alpha -= b.decay; b.rotation += 0.06;
        if (b.alpha <= 0) { bursts.splice(i, 1); continue; }
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = b.color;
        if (isDark && !isLowPerf) { ctx.shadowColor = b.color; ctx.shadowBlur = 10; }
        drawStar4(ctx, b.x, b.y, b.size * b.alpha, b.rotation);
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  // Responsive nebula sizes
  const nebulaSizes = useMemo(() => ({
    slow: isMobile ? 300 : 450,
    med: isMobile ? 180 : 280,
    fast: isMobile ? 70 : 100,
  }), [isMobile]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-(--background) transition-colors duration-500 overflow-hidden">
      {/* Nebula Layers - Fully Responsive */}
      <motion.div
        className="absolute rounded-full opacity-[0.14] blur-[80px]"
        style={{
          width: nebulaSizes.slow, height: nebulaSizes.slow,
          left: smoothXSlow, top: smoothYSlow, x: "-50%", y: "-50%",
          background: "radial-gradient(circle, #e6391a 0%, transparent 75%)",
          mixBlendMode: isDark ? "screen" : "multiply",
        }}
      />
      <motion.div
        className="absolute rounded-full opacity-[0.22] blur-[50px]"
        style={{
          width: nebulaSizes.med, height: nebulaSizes.med,
          left: smoothXMed, top: smoothYMed, x: "-50%", y: "-50%",
          background: isDark ? "radial-gradient(circle, #818cf8 0%, transparent 75%)" : "radial-gradient(circle, #f59e0b 0%, transparent 75%)",
          mixBlendMode: isDark ? "screen" : "multiply",
        }}
      />
      <motion.div
        className="absolute rounded-full opacity-[0.3] blur-[25px]"
        style={{
          width: nebulaSizes.fast, height: nebulaSizes.fast,
          left: smoothXFast, top: smoothYFast, x: "-50%", y: "-50%",
          background: isDark ? "radial-gradient(circle, #ffffff 0%, transparent 75%)" : "radial-gradient(circle, #ffffff 0%, transparent 75%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Static ambient orbs */}
      <div className="absolute -top-[12%] -left-[8%] h-[550px] w-[550px] rounded-full blur-[120px]" style={{ opacity: isDark ? 0.22 : 0.12, background: isDark ? "rgba(139,92,246,0.35)" : "rgba(167,139,250,0.2)" }} />
      <div className="absolute -bottom-[12%] -right-[8%] h-[650px] w-[650px] rounded-full blur-[140px]" style={{ opacity: isDark ? 0.18 : 0.1, background: isDark ? "rgba(6,182,212,0.2)" : "rgba(103,232,249,0.12)" }} />

      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, var(--card-border) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
    </div>
  );
}
