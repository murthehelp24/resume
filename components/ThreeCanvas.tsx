"use client";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, Stage, Environment, ContactShadows } from "@react-three/drei";
import { ProceduralHumanoid } from "./ProceduralHumanoid";

export function ThreeCanvas() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative w-full h-[520px] rounded-2xl overflow-hidden transition-colors duration-500 ${isDark ? "bg-radial from-[#1a0a0a]/60" : "bg-radial from-[#ffffff]/40"} to-transparent`}>
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          {/* Environment adapts to theme */}
          <Environment preset={isDark ? "studio" : "city"} intensity={isDark ? 0.4 : 0.8} />

          {/* Lighting Setup */}
          <ambientLight intensity={isDark ? 0.2 : 0.5} />

          {/* Key Light */}
          <directionalLight
            position={[-5, 8, 4]}
            intensity={isDark ? 1.2 : 1.5}
            color={isDark ? "#e6391a" : "#ffffff"}
            castShadow
          />

          {/* Fill Light */}
          <directionalLight
            position={[5, 3, 2]}
            intensity={isDark ? 0.6 : 0.4}
            color={isDark ? "#f3f3f3" : "#e5e7eb"}
          />

          {/* Rim Lights for depth */}
          <pointLight
            position={[4, 2, -4]}
            intensity={isDark ? 1.5 : 0.8}
            color={isDark ? "#ff5e00" : "#ffffff"}
          />

          {/* Grounding Shadows */}
          <ContactShadows
            position={[0, -2.4, 0]}
            opacity={isDark ? 0.5 : 0.2}
            scale={10}
            blur={2.5}
            far={4}
            color={isDark ? "#1a0a0a" : "#6b7280"}
          />

          {/* Main Humanoid Model */}
          <ProceduralHumanoid />


          {/* Orbit Controls (constrained so user can rotate, but it stays locked on the hero section) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.7}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {/* Glossy Floor Platform Glow */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 320,
          height: 16,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(230, 57, 26, 0.25) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}
