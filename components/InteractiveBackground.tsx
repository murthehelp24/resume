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
  type: "star" | "circle";
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ambientStarsRef = useRef<AmbientStar[]>([]);
  const particleArrayRef = useRef<SparkleParticle[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const mouseX = useMotionValue(-1000); // Start off-screen
  const mouseY = useMotionValue(-1000);

  // Faster spring for immediate feedback during testing
  const springConfig = { damping: 30, stiffness: 200 };
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

      // Generate ambient stars
      const stars: AmbientStar[] = [];
      const starCount = Math.floor((width * height) / 22000); // approx 1 star per 22k pixels
      for (let i = 0; i < Math.min(starCount, 90); i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
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

  // Spawn new particles
  const spawnParticle = (x: number, y: number) => {
    const particles = particleArrayRef.current;
    if (particles.length > 120) {
      particles.shift();
    }

    // Gorgeous colors matching Coffee & Vermilion theme
    const colors = isDark
      ? ["#e6391a", "#ffffff", "#ffb25c", "#a5f3fc"] // Vermilion red, white, golden-amber, icy-blue
      : ["#e6391a", "#ffffff", "#ff8a65", "#475569"]; // Vermilion red, white, soft orange-red, slate grey

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const type = Math.random() > 0.45 ? "star" : "circle";

    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5 - 0.2, // Slight upward drift
      size: Math.random() * 3.5 + 1.5,
      maxSize: Math.random() * 8 + 4,
      alpha: 1.0,
      color: randomColor,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.06,
      decay: Math.random() * 0.015 + 0.012,
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

      // Only spawn if mouse moves more than 6px to prevent clutter
      if (dist > 6) {
        const count = Math.min(Math.floor(dist / 8) + 1, 3);
        for (let i = 0; i < count; i++) {
          const offsetX = (Math.random() - 0.5) * 10;
          const offsetY = (Math.random() - 0.5) * 10;
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
      // Clear with support for high DPI
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, width, height);

      // Compositing for premium neon-glow look
      ctx.globalCompositeOperation = isDark ? "screen" : "source-over";

      // 1. Draw static background stars (twinkling)
      const stars = ambientStarsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.phase += star.twinkleSpeed;
        const alpha = 0.15 + (Math.sin(star.phase) + 1) * 0.35; // Oscillation [0.15, 0.85]

        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${alpha})` : `rgba(75, 85, 99, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw dynamic cursor trail particles
      const particles = particleArrayRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // Air resistance / friction
        p.vy *= 0.96;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        // Apply a gorgeous subtle glow around particles in dark mode
        if (isDark) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
        }

        const currentSize = p.size * (0.4 + p.alpha * 0.6); // Scale down slightly over lifetime

        if (p.type === "star") {
          drawSparkle(ctx, p.x, p.y, currentSize, p.rotation);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        if (isDark) {
          ctx.shadowBlur = 0; // Reset shadow for next render
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
      {/* Ambient spotlights and gradients */}
      <motion.div
        className="absolute h-[800px] w-[800px] rounded-full mix-blend-screen dark:mix-blend-plus-lighter"
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)",
          opacity: 0.2,
          filter: "blur(50px)",
        }}
      />

      {/* Static Ambient Orbs - Top Left */}
      <div
        className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "var(--accent)" }}
      />

      {/* Static Ambient Orbs - Bottom Right */}
      <div
        className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full opacity-10 blur-[150px]"
        style={{ background: "var(--gradient-end)" }}
      />

      {/* Fine Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* High-fidelity Canvas for sparkles layer */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
    </div>
  );
}
