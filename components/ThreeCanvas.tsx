"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, Stage, Environment, ContactShadows } from "@react-three/drei";
import { ProceduralHumanoid } from "./ProceduralHumanoid";

export function ThreeCanvas() {
  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-radial from-[#131124]/40 to-transparent">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          {/* High-quality Environment for reflections */}
          <Environment preset="city" intensity={0.6} />

          {/* Moody Studio Lighting Setup */}
          <ambientLight intensity={0.2} />

          {/* Key Light (Strong Highlight, Top-Left) */}
          <directionalLight
            position={[-5, 8, 4]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Fill Light (Soft Blue, Front-Right) */}
          <directionalLight
            position={[5, 3, 2]}
            intensity={0.8}
            color="#93c5fd"
          />

          {/* Rim Backlight (Glowing Purple, Back-Right) */}
          <pointLight
            position={[4, 2, -4]}
            intensity={2}
            color="#a78bfa"
          />

          {/* Direct Rim Backlight (Pink/Violet, Back-Left) */}
          <pointLight
            position={[-4, 1, -4]}
            intensity={1.5}
            color="#ec4899"
          />

          {/* Grounding Shadows */}
          <ContactShadows
            position={[0, -2.4, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
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
          background: "radial-gradient(ellipse, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}
