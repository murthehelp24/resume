"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

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
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const laserCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const ambientStarsRef = useRef<AmbientStar[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const mousePos = useRef({ x: -1000, y: -1000 });

  // Tracking eye positions from 3D space
  const laserPosRef = useRef<{ left: { x: number; y: number }; right: { x: number; y: number } } | null>(null);

  // High-stiffness spring for HUD follow
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 200 });

  const [isDark, setIsDark] = useState(true);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFiring, setIsFiring] = useState(false);
  const isFiringRef = useRef(false);

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

  // ── Mouse tracker ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      mousePos.current = { x: e.clientX, y: e.clientY };
      setCoords({ x: e.clientX, y: e.clientY });
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      mouseX.set(touch.clientX);
      mouseY.set(touch.clientY);
      mousePos.current = { x: touch.clientX, y: touch.clientY };
      setCoords({ x: Math.round(touch.clientX), y: Math.round(touch.clientY) });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [mouseX, mouseY]);

  // ── Laser Position Listener ────────────────────────────────────────────────
  useEffect(() => {
    const handleLaserPos = (e: any) => {
      laserPosRef.current = e.detail;
    };
    window.addEventListener("laser-pos", handleLaserPos);
    return () => window.removeEventListener("laser-pos", handleLaserPos);
  }, []);

  // ── Click to Fire ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleMouseDown = () => {
      setIsFiring(true);
      isFiringRef.current = true;
      document.documentElement.setAttribute("data-firing", "true");
    };
    const handleMouseUp = () => {
      setIsFiring(false);
      isFiringRef.current = false;
      document.documentElement.setAttribute("data-firing", "false");
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // ── Canvas Sizing ─────────────────────────────────────────────────────────
  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const laserCanvas = laserCanvasRef.current;
    if (!bgCanvas || !laserCanvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      [bgCanvas, laserCanvas].forEach(canvas => {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(dpr, dpr);
      });

      const count = Math.min(Math.floor((w * h) / 12000), 180);
      ambientStarsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.3,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Main Render Loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const laserCanvas = laserCanvasRef.current;
    if (!bgCanvas || !laserCanvas) return;
    
    const bgCtx = bgCanvas.getContext("2d");
    const laserCtx = laserCanvas.getContext("2d");
    if (!bgCtx || !laserCtx) return;

    let raf: number;
    let frameCount = 0;

    const spawnShootingStar = () => {
      const w = window.innerWidth;
      shootingStarsRef.current.push({
        x: Math.random() * w, y: -20, vx: (Math.random() - 0.5) * 4 + 2, vy: Math.random() * 8 + 6,
        length: Math.random() * 80 + 40, alpha: 1.0,
        color: isDark ? "#ffffff" : "#e6391a",
      });
    };

    const render = () => {
      frameCount++;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // 1. BG RENDER
      bgCtx.clearRect(0, 0, w, h);
      bgCtx.globalCompositeOperation = isDark ? "screen" : "source-over";

      const stars = ambientStarsRef.current;
      bgCtx.fillStyle = isDark ? "#ffffff" : "#64748b";
      for (const star of stars) {
        star.phase += star.twinkleSpeed;
        bgCtx.globalAlpha = 0.15 + (Math.sin(star.phase) + 1) * 0.35;
        bgCtx.beginPath();
        bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        bgCtx.fill();
      }

      if (frameCount % 300 === 0 && Math.random() > 0.5) spawnShootingStar();
      const ss = shootingStarsRef.current;
      for (let i = ss.length - 1; i >= 0; i--) {
        const s = ss[i];
        s.x += s.vx; s.y += s.vy; s.alpha -= 0.01;
        if (s.alpha <= 0) { ss.splice(i, 1); continue; }
        bgCtx.globalAlpha = s.alpha * 0.4;
        bgCtx.strokeStyle = s.color;
        bgCtx.lineWidth = 1;
        bgCtx.beginPath();
        bgCtx.moveTo(s.x, s.y);
        bgCtx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
        bgCtx.stroke();
      }

      // 2. LASER RENDER (Top Layer)
      laserCtx.clearRect(0, 0, w, h);
      if (isFiringRef.current && mousePos.current.x > -500 && laserPosRef.current) {
        const mx = mousePos.current.x;
        const my = mousePos.current.y;
        const { left, right } = laserPosRef.current;
        
        laserCtx.save();
        laserCtx.globalCompositeOperation = "lighter";
        
        [left, right].forEach(eye => {
          // Beam Outer Glow
          laserCtx.shadowBlur = 15;
          laserCtx.shadowColor = "#ff0000";
          laserCtx.strokeStyle = "rgba(230, 57, 26, 0.7)";
          laserCtx.lineWidth = 4;
          laserCtx.beginPath();
          laserCtx.moveTo(eye.x, eye.y);
          laserCtx.lineTo(mx, my);
          laserCtx.stroke();

          // Core White Beam
          laserCtx.shadowBlur = 0;
          laserCtx.strokeStyle = "#ffffff";
          laserCtx.lineWidth = 1.5;
          laserCtx.beginPath();
          laserCtx.moveTo(eye.x, eye.y);
          laserCtx.lineTo(mx, my);
          laserCtx.stroke();
        });

        // Muzzle flare at source eyes
        laserCtx.fillStyle = "#ffffff";
        [left, right].forEach(eye => {
          laserCtx.beginPath();
          laserCtx.arc(eye.x, eye.y, 3, 0, Math.PI * 2);
          laserCtx.fill();
        });

        // Target Impact Flare
        laserCtx.shadowBlur = 10;
        laserCtx.shadowColor = "#ffffff";
        laserCtx.beginPath();
        laserCtx.arc(mx, my, 5, 0, Math.PI * 2);
        laserCtx.fill();
        
        laserCtx.restore();
      }

      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  return (
    <>
      {/* ── BACKGROUND LAYER (Fixed & Hidden) ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-(--background) transition-colors duration-500 overflow-hidden">
        {/* Background Glow */}
        <motion.div
          className="absolute h-[400px] w-[400px] rounded-full opacity-[0.05] blur-[100px]"
          style={{
            left: smoothX, top: smoothY, x: "-50%", y: "-50%",
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          }}
        />

        {/* Ambient Orbs */}
        <div className="absolute -top-[12%] -left-[8%] h-[550px] w-[550px] rounded-full blur-[120px]" style={{ opacity: isDark ? 0.22 : 0.12, background: isDark ? "rgba(139,92,246,0.35)" : "rgba(167,139,250,0.2)" }} />
        <div className="absolute -bottom-[12%] -right-[8%] h-[650px] w-[650px] rounded-full blur-[140px]" style={{ opacity: isDark ? 0.18 : 0.1, background: isDark ? "rgba(6,182,212,0.2)" : "rgba(103,232,249,0.12)" }} />

        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, var(--card-border) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

        <canvas ref={bgCanvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
      </div>

      {/* ── HUD & LASER LAYER (Always on top) ── */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {/* Laser Canvas */}
        <canvas ref={laserCanvasRef} className="absolute inset-0 block w-full h-full" />

        {/* Robot HUD */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{
            left: smoothX, top: smoothY,
            x: "-50%", y: "-50%",
            opacity: useTransform(mouseX, (v) => v < -500 ? 0 : 1),
          }}
          animate={{ scale: isFiring ? 0.85 : 1 }}
        >
          {/* HUD Elements */}
          <div className={`absolute h-4 w-4 border-2 rounded-full transition-colors ${isFiring ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : "border-(--accent)/40"}`} />
          <div className={`absolute h-px w-8 transition-colors ${isFiring ? "bg-red-500" : "bg-(--accent)/60"}`} />
          <div className={`absolute w-px h-8 transition-colors ${isFiring ? "bg-red-500" : "bg-(--accent)/60"}`} />

          <motion.div
            className={`absolute h-24 w-24 border-2 border-dashed rounded-full transition-colors ${isFiring ? "border-red-500" : "border-(--accent)/30"}`}
            animate={{ rotate: isFiring ? 720 : 360 }}
            transition={{ duration: isFiring ? 2 : 10, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className={`absolute h-16 w-16 border border-dashed rounded-full transition-colors ${isFiring ? "border-red-600" : "border-cyan-400/30"}`}
            animate={{ rotate: -360 * 2 }}
            transition={{ duration: isFiring ? 1.5 : 6, repeat: Infinity, ease: "linear" }}
          />

          <div className="absolute -top-12 flex flex-col items-center">
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isFiring ? "text-red-500 animate-pulse" : "text-(--accent)/40"}`}>
              {isFiring ? "LOCKED & FIRING" : "SCANNING..."}
            </span>
          </div>

          {/* Corner Brackets */}
          {[
            { pos: "-top-6 -left-6", border: "border-t border-l", animate: { x: isFiring ? 8 : 0, y: isFiring ? 8 : 0 } },
            { pos: "-top-6 -right-6", border: "border-t border-r", animate: { x: isFiring ? -8 : 0, y: isFiring ? 8 : 0 } },
            { pos: "-bottom-6 -left-6", border: "border-b border-l", animate: { x: isFiring ? 8 : 0, y: isFiring ? -8 : 0 } },
            { pos: "-bottom-6 -right-6", border: "border-b border-r", animate: { x: isFiring ? -8 : 0, y: isFiring ? -8 : 0 } }
          ].map((corner, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 ${corner.pos} ${corner.border} transition-colors ${isFiring ? "border-red-500 scale-125" : "border-(--accent)/50"}`}
              animate={corner.animate}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
}
