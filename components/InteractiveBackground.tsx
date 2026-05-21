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

interface CometTrailPoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
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

  // Comet trail: an array of past mouse positions with fading alpha
  const trailRef = useRef<CometTrailPoint[]>([]);

  // Autonomous shooting stars crossing the sky
  const shootingStarsRef = useRef<ShootingStar[]>([]);

  // Small sparkle burst particles that shoot off trail
  const starBurstsRef = useRef<StarBurst[]>([]);

  const mousePos = useRef({ x: -1000, y: -1000 });
  const prevMousePos = useRef({ x: -1000, y: -1000 });

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 25, stiffness: 160 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

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
      prevMousePos.current = { ...mousePos.current };
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  // ── Main render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Comet colours (head → tail gradient)
    const COMET_COLORS_DARK = [
      "#ffffff",  // head — pure white
      "#e0f2fe",  // ice-blue
      "#a5f3fc",  // cyan
      "#818cf8",  // indigo
      "#c084fc",  // violet
      "#f0abfc",  // magenta
    ];
    const COMET_COLORS_LIGHT = [
      "#f59e0b",
      "#d97706",
      "#b45309",
      "#fbbf24",
      "#fcd34d",
    ];

    const STARBURST_COLORS_DARK = ["#ffffff", "#a5f3fc", "#c084fc", "#fde68a", "#6ee7b7"];
    const STARBURST_COLORS_LIGHT = ["#f59e0b", "#d97706", "#fbbf24", "#d97706", "#fcd34d"];

    let raf: number;
    let frameCount = 0;

    // Helper: draw a sharp 4-pointed star/sparkle
    const drawStar4 = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rot: number
    ) => {
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

    // Spawn an autonomous shooting star from a random edge
    const spawnShootingStar = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Spawn from top edge or left edge
      const fromTop = Math.random() > 0.4;
      const x = fromTop ? Math.random() * w : -20;
      const y = fromTop ? -20 : Math.random() * (h * 0.5);

      // Velocity aimed diagonally down-right
      const speed = Math.random() * 12 + 8;
      const angle = fromTop
        ? (Math.PI / 4) + (Math.random() - 0.5) * (Math.PI / 6)
        : (Math.random() * Math.PI) / 8;

      const colors = isDark
        ? ["#ffffff", "#e0f2fe", "#a5f3fc", "#c7d2fe"]
        : ["#f59e0b", "#fbbf24", "#d97706", "#fcd34d"];

      shootingStarsRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 100 + 80,
        alpha: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        active: true,
      });
    };

    const render = () => {
      frameCount++;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = isDark ? "screen" : "source-over";

      const isLowPerf = w < 768;

      // ── 1. Ambient twinkling background stars ─────────────────────────────
      const stars = ambientStarsRef.current;
      ctx.fillStyle = isDark ? "#ffffff" : "#64748b";
      for (const star of stars) {
        star.phase += star.twinkleSpeed;
        const alpha = 0.12 + (Math.sin(star.phase) + 1) * 0.38;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 2. Autonomous shooting stars ──────────────────────────────────────
      // Spawn one randomly every ~120 frames (or 180 on mobile)
      if (frameCount % (isLowPerf ? 180 : 120) === 0 && Math.random() > 0.4) {
        spawnShootingStar();
      }

      const ss = shootingStarsRef.current;
      for (let i = ss.length - 1; i >= 0; i--) {
        const s = ss[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.012;

        if (s.alpha <= 0 || s.x > w + 50 || s.y > h + 50) {
          ss.splice(i, 1);
          continue;
        }

        // Draw the shooting star as a gradient line
        const tailX = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.length;
        const tailY = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.6, `rgba(255,255,255,${s.alpha * 0.3})`);
        grad.addColorStop(1, s.color);

        ctx.globalAlpha = s.alpha;
        if (isDark && !isLowPerf) {
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 8;
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Tiny sparkle at the head
        ctx.fillStyle = isDark ? "#ffffff" : "#fef3c7";
        ctx.globalAlpha = s.alpha * 0.9;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 3. Mouse comet trail ──────────────────────────────────────────────
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Optimization: Throttled trail point creation (every 2 frames)
      if (mx > -500 && my > -500 && frameCount % 2 === 0) {
        const colors = isDark ? COMET_COLORS_DARK : COMET_COLORS_LIGHT;
        const colorIdx = Math.floor(Math.random() * 3); // bias toward head colors

        // Push new trail point at cursor
        trailRef.current.push({
          x: mx + (Math.random() - 0.5) * 4,
          y: my + (Math.random() - 0.5) * 4,
          alpha: 1.0,
          size: Math.random() * 3.5 + 2,
          color: colors[colorIdx],
        });

        // Occasionally spawn a starburst sparkle (disable on mobile)
        if (Math.random() < 0.22 && !isLowPerf) {
          const bc = isDark ? STARBURST_COLORS_DARK : STARBURST_COLORS_LIGHT;
          starBurstsRef.current.push({
            x: mx,
            y: my,
            vx: (Math.random() - 0.5) * 3.5,
            vy: (Math.random() - 0.5) * 3.5 - 0.8,
            size: Math.random() * 5 + 2.5,
            alpha: 1.0,
            decay: Math.random() * 0.022 + 0.012,
            color: bc[Math.floor(Math.random() * bc.length)],
            rotation: Math.random() * Math.PI * 2,
          });
        }
      }

      // Trim trail length (keep last 60 points, or 30 on mobile)
      const MAX_TRAIL = isLowPerf ? 30 : 60;
      const trail = trailRef.current;
      if (trail.length > MAX_TRAIL) trail.splice(0, trail.length - MAX_TRAIL);

      // Draw comet trail (oldest → newest, fading)
      const trailColors = isDark ? COMET_COLORS_DARK : COMET_COLORS_LIGHT;
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        // Each point fades as it gets older (position in array = age)
        p.alpha = (i / trail.length) * 0.95;

        const tailColorIdx = Math.min(
          Math.floor(((trail.length - 1 - i) / trail.length) * trailColors.length),
          trailColors.length - 1
        );
        const color = trailColors[tailColorIdx];

        ctx.globalAlpha = p.alpha;
        if (isDark && !isLowPerf) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 6;
        }
        ctx.fillStyle = color;

        // Draw a small glowing disc for each trail point
        const sz = p.size * p.alpha + 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Comet head glow: brightest white circle at cursor
      if (mx > -500 && my > -500) {
        ctx.globalAlpha = 0.85;
        if (isDark && !isLowPerf) {
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 18;
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = isLowPerf ? 0 : 12;
          ctx.fillStyle = isDark ? "#ffffff" : "#fbbf24";
        }
        ctx.beginPath();
        ctx.arc(mx, my, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── 4. Star burst particles ───────────────────────────────────────────
      const bursts = starBurstsRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.93;
        b.vy *= 0.93;
        b.alpha -= b.decay;
        b.rotation += 0.05;

        if (b.alpha <= 0) {
          bursts.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = b.alpha * 0.9;
        ctx.fillStyle = b.color;
        if (isDark) {
          ctx.shadowColor = b.color;
          ctx.shadowBlur = 6;
        }
        drawStar4(ctx, b.x, b.y, b.size * b.alpha, b.rotation);
        ctx.shadowBlur = 0;
      }

      // Trim bursts pool
      if (bursts.length > 80) bursts.splice(0, bursts.length - 80);

      ctx.globalAlpha = 1.0;
      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-(--background) transition-colors duration-500 overflow-hidden">
      {/* Mouse-follower nebula glow (large soft spotlight) */}
      <motion.div
        className="absolute h-[800px] w-[800px] rounded-full"
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%",
          background: isDark
            ? "radial-gradient(circle, rgba(129,140,248,0.18) 0%, rgba(6,182,212,0.08) 50%, transparent 70%)"
            : "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(8,145,178,0.06) 55%, transparent 72%)",
          filter: "blur(55px)",
          mixBlendMode: isDark ? "screen" : "normal",
        }}
      />

      {/* Static ambient orb — top-left (cosmic purple) */}
      <div
        className="absolute -top-[12%] -left-[8%] h-[550px] w-[550px] rounded-full blur-[120px]"
        style={{
          opacity: isDark ? 0.22 : 0.12,
          background: isDark ? "rgba(139,92,246,0.35)" : "rgba(167,139,250,0.2)",
        }}
      />

      {/* Static ambient orb — bottom-right (cosmic cyan) */}
      <div
        className="absolute -bottom-[12%] -right-[8%] h-[650px] w-[650px] rounded-full blur-[140px]"
        style={{
          opacity: isDark ? 0.18 : 0.1,
          background: isDark ? "rgba(6,182,212,0.2)" : "rgba(103,232,249,0.12)",
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--card-border) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* High-DPI canvas for comet trail + shooting stars + sparkles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
      />
    </div>
  );
}
