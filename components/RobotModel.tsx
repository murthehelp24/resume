"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the ThreeCanvas to avoid SSR (Server-Side Rendering) issues
const ThreeCanvas = dynamic(
  () => import("./ThreeCanvas").then((mod) => mod.ThreeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-[370px] h-[520px] rounded-2xl flex flex-col items-center justify-center bg-radial from-[#131124]/40 to-transparent border border-white/5">
        {/* Pulsing Glow Aura */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-64 w-64 rounded-full bg-violet-500/10 blur-3xl animate-pulse" />
        </div>

        {/* Premium Spinner and Text */}
        <Loader2 className="w-7 h-7 text-violet-400 animate-spin mb-4 opacity-75" />
        <span className="text-xs uppercase tracking-[0.25em] text-violet-300/40 font-semibold select-none">
          Initializing 3D Core...
        </span>
      </div>
    ),
  }
);

export function RobotModel() {
  return (
    <div className="relative flex items-center justify-center w-[370px] h-[520px]">
      <ThreeCanvas />
    </div>
  );
}
