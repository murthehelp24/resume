"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface AmbientStar {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  phase: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  decay: number;
  type: "star" | "nebula" | "meteor";
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ambientStarsRef = useRef<AmbientStar[]>([]);
  const particleArrayRef = useRef<SparkleParticle[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const mouseX = useMotionValue(-1000); // Start off-screen
  const mouseY = useMotionValue(-1000);

  // Smooth springs for mouse follower spotlight
  const springConfig = { damping: 30, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [isDark, setIsDark] = useState(true);

  // Track light/dark mode changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Handle window resizing and high DPI scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Generate static background stars
      const stars: AmbientStar[] = [];
      const starCount = Math.floor((width * height) / 18000); // Dense cosmic sky (approx 1 star per 18k pixels)
      for (let i = 0; i < Math.min(starCount, 120); i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.6 + 0.4,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
      ambientStarsRef.current = stars;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Spawn new cosmic particles
  const spawnParticle = (x: number, y: number) => {
    const particles = particleArrayRef.current;
    if (particles.length > 130) {
      particles.shift();
    }

    const rand = Math.random();
    let type: "star" | "nebula" | "meteor" = "star";
    let size = Math.random() * 3.5 + 1.5;
    let decay = Math.random() * 0.012 + 0.008; // Slower decay for beautiful trails
    let vx = (Math.random() - 0.5) * 2.2;
    let vy = (Math.random() - 0.5) * 2.2 - 0.15; // Slow upward drift

    // Cosmic space palette: Deep Violet, Electric Cyan, Galactic Pink, Starlight White, Solar Gold
    const darkColors = ["#a855f7", "#06b6d4", "#ec4899", "#ffffff", "#fef08a"];
    const lightColors = ["#7c3aed", "#0891b2", "#db2777", "#475569", "#d97706"];
    const colors = isDark ? darkColors : lightColors;
    const color = colors[Math.floor(Math.random() * colors.length)];

    if (rand < 0.18) {
      // 18% Shooting meteors: fast, long streaks, decay quickly
      type = "meteor";
      size = Math.random() * 2.0 + 1.2;
      decay = Math.random() * 0.025 + 0.02; // Rapid decay
      vx = (Math.random() - 0.5) * 6.5;
      vy = (Math.random() - 0.5) * 6.5 - 0.6;
    } else if (rand < 0.52) {
      // 34% Nebula gas dust: very large, slow floating, low opacity
      type = "nebula";
      size = Math.random() * 14 + 8;
      decay = Math.random() * 0.009 + 0.005; // Float longer
      vx = (Math.random() - 0.5) * 0.6;
      vy = (Math.random() - 0.5) * 0.6 - 0.1;
    } else {
      // 48% Twinkling 4-pointed stars
      type = "star";
      size = Math.random() * 4.0 + 1.8;
      decay = Math.random() * 0.014 + 0.008;
      vx = (Math.random() - 0.5) * 1.8;
      vy = (Math.random() - 0.5) * 1.8 - 0.2;
    }

    particles.push({
      x,
      y,
      vx,
      vy,
      size,
      maxSize: size * 1.5,
      alpha: 1.0,
      color,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.07,
      decay,
      type,
    });
  };

  // Setup mouse tracking and particle spawning
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Spawn trails proportionally to movement distance
      if (dist > 5) {
        const count = Math.min(Math.floor(dist / 6) + 1, 3);
        for (let i = 0; i < count; i++) {
          const offsetX = (Math.random() - 0.5) * 12;
          const offsetY = (Math.random() - 0.5) * 12;
          spawnParticle(e.clientX + offsetX, e.clientY + offsetY);
        }
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isDark]);

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Draw a flared 4-pointed star
    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(0, 0, size, 0);
      c.quadraticCurveTo(0, 0, 0, size);
      c.quadraticCurveTo(0, 0, -size, 0);
      c.quadraticCurveTo(0, 0, 0, -size);
      c.closePath();
      c.fill();
      c.restore();
    };

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, width, height);

      // Compositing for premium neon space-glow look
      ctx.globalCompositeOperation = isDark ? "screen" : "source-over";

      // 1. Draw static background stars (twinkling)
      const stars = ambientStarsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.phase += star.twinkleSpeed;
        const alpha = 0.15 + (Math.sin(star.phase) + 1) * 0.35; // Twinkle oscillation

        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${alpha})` : `rgba(75, 85, 99, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw dynamic cursor particles
      const particles = particleArrayRef.current;

      // 3. Draw constellation lines between nearby particles
      const maxDistance = 65; // px distance to draw a line
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          // Skip shooting meteors to keep constellation grids clean
          if (p1.type === "meteor" || p2.type === "meteor") continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.14 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = isDark ? `rgba(168, 85, 247, ${lineAlpha})` : `rgba(124, 58, 237, ${lineAlpha})`; // Cosmic purple line
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 4. Draw constellation lines connecting particles to the mouse pointer
      const cx = mouseX.get();
      const cy = mouseY.get();
      if (cx > -500 && cy > -500) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.type === "meteor") continue;

          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            const lineAlpha = (1 - dist / 80) * 0.12 * p.alpha;
            ctx.strokeStyle = isDark ? `rgba(6, 182, 212, ${lineAlpha})` : `rgba(8, 145, 178, ${lineAlpha})`; // Cosmic cyan line to cursor
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(cx, cy);
            ctx.stroke();
          }
        }
      }

      // 5. Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // Air drag
        p.vy *= 0.96;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        
        // Neon glow setup in Dark Mode
        if (isDark) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.type === "star" ? 8 : (p.type === "meteor" ? 4 : 0);
        }

        const currentSize = p.size * (0.4 + p.alpha * 0.6);

        if (p.type === "star") {
          ctx.globalAlpha = p.alpha;
          drawSparkle(ctx, p.x, p.y, currentSize, p.rotation);
        } else if (p.type === "meteor") {
          ctx.globalAlpha = p.alpha * 0.75;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = currentSize * 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.8, p.y - p.vy * 1.8); // Shoot streak
          ctx.stroke();
        } else {
          // Nebula cloud: large, very soft & transparent
          ctx.globalAlpha = p.alpha * 0.18;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fill();
        }

        if (isDark) {
          ctx.shadowBlur = 0; // Reset shadow blur
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-(--background) transition-colors duration-500 overflow-hidden">
      {/* Dynamic Cosmic Mouse-Follower Glow */}
      <motion.div
        className="absolute h-[900px] w-[900px] rounded-full mix-blend-screen dark:mix-blend-plus-lighter"
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%",
          background: isDark
            ? "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(6, 182, 212, 0.1) 45%, transparent 70%)" // Purple-Cyan mix
            : "radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, rgba(103, 232, 249, 0.08) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Static Ambient Orbs - Top Left (Cosmic Purple) */}
      <div
        className="absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full opacity-25 blur-[130px] dark:opacity-20"
        style={{ background: isDark ? "rgba(139, 92, 246, 0.25)" : "rgba(167, 139, 250, 0.15)" }}
      />

      {/* Static Ambient Orbs - Bottom Right (Cosmic Cyan) */}
      <div
        className="absolute -bottom-[10%] -right-[10%] h-[700px] w-[700px] rounded-full opacity-20 blur-[150px] dark:opacity-15"
        style={{ background: isDark ? "rgba(6, 182, 212, 0.15)" : "rgba(103, 232, 249, 0.1)" }}
      />

      {/* Fine Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* High-fidelity Canvas for sparkles and constellation layers */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
    </div>
  );
}
