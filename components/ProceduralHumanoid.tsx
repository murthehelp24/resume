"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Thruster({ isDark, offset = 0 }: { isDark: boolean; offset?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + offset;
    if (ref.current) {
      const s = 1 + Math.sin(t * 20) * 0.1;
      ref.current.scale.set(s, 1.5 + Math.sin(t * 25) * 0.4, s);
    }
    if (glowRef.current) {
      const gs = 1.2 + Math.sin(t * 20) * 0.2;
      glowRef.current.scale.set(gs, gs, gs);
    }
  });

  return (
    <group position={[0, -0.35, 0]}>
      {/* Core Flame */}
      <mesh ref={ref} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.08, 0.35, 12]} />
        <meshStandardMaterial
          color={0xff7e33}
          emissive={0xff3300}
          emissiveIntensity={isDark ? 20 : 10}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Outer Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={0xff5500}
          emissive={0xff2200}
          emissiveIntensity={isDark ? 12 : 6}
          transparent
          opacity={0.35}
        />
      </mesh>
      {/* Point light for local illumination */}
      <pointLight color={0xff4400} intensity={isDark ? 2 : 1} distance={1.5} />
    </group>
  );
}

export function ProceduralHumanoid() {
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

  const robotGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const chestGroupRef = useRef<THREE.Group>(null);
  const leftArmGroupRef = useRef<THREE.Group>(null);
  const rightArmGroupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);

  // Materials - Adapting to Theme
  const materials = useMemo(() => ({
    // Glossy White Armor
    whiteArmor: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: isDark ? 0.1 : 0.2,
      roughness: isDark ? 0.1 : 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: isDark ? 2.5 : 1.5,
    }),
    // Dark Chrome (Dark Mode) or Silver Chrome (Light Mode)
    darkChrome: new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x0a0505 : 0x4b5563, // Deep Black vs Slate
      metalness: 0.9,
      roughness: 0.05,
      envMapIntensity: 3.0,
    }),
    // Matte Mechanical Joints
    matteDark: new THREE.MeshStandardMaterial({
      color: isDark ? 0x150d0d : 0x4b5563,
      metalness: 0.4,
      roughness: 0.6,
    }),
    // Vermilion Glow (Consistent across themes)
    accentGlow: new THREE.MeshStandardMaterial({
      color: 0xe6391a,
      emissive: 0xe6391a,
      emissiveIntensity: isDark ? 12.0 : 8.0,
      toneMapped: false,
    }),
    // Soft Blush Pink
    blushGlow: new THREE.MeshStandardMaterial({
      color: 0xff66cc,
      emissive: 0xff66cc,
      emissiveIntensity: isDark ? 4.0 : 2.0,
      transparent: true,
      opacity: 0.6,
    }),
  }), [isDark]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Playful idle floating
    if (robotGroupRef.current) {
      robotGroupRef.current.position.y = Math.sin(time * 1.5) * 0.1;
      robotGroupRef.current.rotation.z = Math.sin(time * 0.8) * 0.02;
    }

    // Breathing
    if (chestGroupRef.current) {
      const b = 1.0 + Math.sin(time * 2) * 0.005;
      chestGroupRef.current.scale.set(b, b, b);
    }

    // Blinking logic (Gentler & Less frequent)
    const blinkTrigger = Math.sin(time * 2);
    const blink = blinkTrigger > 0.94 ? 0.1 : 1.0;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, blink, 0.4);
    if (rightEyeRef.current) rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, blink, 0.4);

    // Mouse look-at
    const tx = state.pointer.x * 0.45;
    const ty = state.pointer.y * 0.25;

    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, tx, 0.1);
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -ty, 0.1);
    }
  });

  return (
    <group ref={robotGroupRef} scale={1.1}>

      {/* ══════════ TORSO (Elegant & Rounded) ══════════ */}
      <group ref={chestGroupRef} position={[0, 0.22, 0]}>
        
        {/* Main Chest (Glossy White - Soft Egg Shape) */}
        <mesh material={materials.whiteArmor}>
          <sphereGeometry args={[0.36, 32, 32]} />
        </mesh>
        
        {/* Lower Torso Detail (Smooth Transition) */}
        <mesh position={[0, -0.2, 0]} material={materials.matteDark}>
          <capsuleGeometry args={[0.18, 0.15, 12, 24]} />
        </mesh>

        {/* Subtle Side Glows */}
        <mesh position={[-0.2, -0.05, 0.22]} material={materials.accentGlow}>
          <sphereGeometry args={[0.025, 16, 16]} />
        </mesh>
        <mesh position={[0.2, -0.05, 0.22]} material={materials.accentGlow}>
          <sphereGeometry args={[0.025, 16, 16]} />
        </mesh>

        {/* ══════════ LEFT ARM (Soft & Balanced) ══════════ */}
        <group position={[-0.42, 0.1, 0]} ref={leftArmGroupRef}>
          {/* Shoulder (Soft Ball) */}
          <mesh material={materials.whiteArmor}>
            <sphereGeometry args={[0.13, 24, 24]} />
          </mesh>
          
          <group position={[-0.08, -0.2, 0]} rotation={[0, 0, 0.2]}>
            {/* Upper Arm */}
            <mesh material={materials.whiteArmor}>
              <capsuleGeometry args={[0.075, 0.16, 12, 24]} />
            </mesh>
            
            {/* Elbow (Smooth Joint) */}
            <mesh position={[0, -0.15, 0]} material={materials.matteDark}>
              <sphereGeometry args={[0.065, 16, 16]} />
            </mesh>

            {/* Forearm */}
            <group position={[0, -0.3, 0]}>
              <mesh material={materials.whiteArmor}>
                <capsuleGeometry args={[0.085, 0.18, 12, 24]} />
              </mesh>
              
              {/* Hand (Simplified & Cute) */}
              <group position={[0, -0.2, 0]}>
                <mesh material={materials.matteDark}>
                  <sphereGeometry args={[0.065, 16, 16]} />
                </mesh>
                {[ -0.035, 0, 0.035 ].map((x, i) => (
                  <mesh key={`lf-${i}`} position={[x, -0.07, 0.01]} material={materials.matteDark}>
                    <capsuleGeometry args={[0.022, 0.06, 4, 8]} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </group>

        {/* ══════════ RIGHT ARM (Soft & Balanced) ══════════ */}
        <group position={[0.42, 0.1, 0]} ref={rightArmGroupRef}>
          <mesh material={materials.whiteArmor}>
            <sphereGeometry args={[0.13, 24, 24]} />
          </mesh>
          
          <group position={[0.08, -0.2, 0]} rotation={[0, 0, -0.2]}>
            <mesh material={materials.whiteArmor}>
              <capsuleGeometry args={[0.075, 0.16, 12, 24]} />
            </mesh>
            
            <mesh position={[0, -0.15, 0]} material={materials.matteDark}>
              <sphereGeometry args={[0.065, 16, 16]} />
            </mesh>

            <group position={[0, -0.3, 0]}>
              <mesh material={materials.whiteArmor}>
                <capsuleGeometry args={[0.085, 0.18, 12, 24]} />
              </mesh>
              
              {/* Hand */}
              <group position={[0, -0.2, 0]}>
                <mesh material={materials.matteDark}>
                  <sphereGeometry args={[0.065, 16, 16]} />
                </mesh>
                {[ -0.035, 0, 0.035 ].map((x, i) => (
                  <mesh key={`rf-${i}`} position={[x, -0.07, 0.01]} material={materials.matteDark}>
                    <capsuleGeometry args={[0.022, 0.06, 4, 8]} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* ══════════ HEAD (Polished Chibi Head) ══════════ */}
      <group ref={headGroupRef} position={[0, 0.82, 0]}>
        {/* Main Head Sphere (Slightly squashed for cuteness) */}
        <mesh material={materials.whiteArmor} scale={[1, 0.95, 1]}>
          <sphereGeometry args={[0.52, 48, 48]} />
        </mesh>
        
        {/* Sleek Visor */}
        <mesh position={[0, 0, 0.08]} material={materials.darkChrome}>
          <sphereGeometry args={[0.48, 48, 48, 0, Math.PI * 2, 0.5, 1.8]} />
        </mesh>

        {/* CUTE EYES WITH BLINKING ANIMATION */}
        <group position={[-0.18, -0.02, 0.45]} ref={leftEyeRef}>
          <mesh material={materials.accentGlow}>
            <sphereGeometry args={[0.06, 16, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.02]} material={materials.accentGlow}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={0xe6391a} transparent opacity={0.3} />
          </mesh>
        </group>
        <group position={[0.18, -0.02, 0.45]} ref={rightEyeRef}>
          <mesh material={materials.accentGlow}>
            <sphereGeometry args={[0.06, 16, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.02]} material={materials.accentGlow}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={0xe6391a} transparent opacity={0.3} />
          </mesh>
        </group>

        {/* BLUSH SPOTS */}
        <mesh position={[-0.28, -0.12, 0.4]} material={materials.blushGlow}>
          <sphereGeometry args={[0.045, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh position={[0.28, -0.12, 0.4]} material={materials.blushGlow}>
          <sphereGeometry args={[0.045, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>

        {/* "Ear" details / Side pods */}
        <group position={[-0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={materials.whiteArmor}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.accentGlow}>
            <torusGeometry args={[0.1, 0.015, 16, 32]} />
          </mesh>
        </group>
        <group position={[0.48, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh material={materials.whiteArmor}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.accentGlow}>
            <torusGeometry args={[0.1, 0.015, 16, 32]} />
          </mesh>
        </group>

        {/* Antenna (Simplified for cuteness) */}
        <group position={[-0.35, 0.35, -0.1]} rotation={[-0.2, 0, 0.3]}>
          <mesh material={materials.matteDark}>
            <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
          </mesh>
          <mesh position={[0, 0.1, 0]} material={materials.accentGlow}>
            <sphereGeometry args={[0.02, 16, 16]} />
          </mesh>
        </group>
      </group>

      {/* ══════════ LEGS (Rounded & Balanced) ══════════ */}
      <group position={[0, -0.18, 0]}>
        {/* Left Leg */}
        <group position={[-0.2, 0, 0]}>
          <mesh material={materials.matteDark}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          <group position={[0, -0.22, 0]}>
            <mesh material={materials.whiteArmor}>
              <sphereGeometry args={[0.16, 24, 24]} />
            </mesh>
            <mesh position={[0, -0.18, 0.04]} material={materials.matteDark}>
              <sphereGeometry args={[0.08, 16, 16]} />
            </mesh>
            <group position={[0, -0.42, 0]}>
              <mesh material={materials.whiteArmor}>
                <capsuleGeometry args={[0.13, 0.24, 12, 24]} />
              </mesh>
              
              {/* Soft Space Boot */}
              <group position={[0, -0.22, 0.06]}>
                <mesh material={materials.whiteArmor}>
                  <sphereGeometry args={[0.15, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
                </mesh>
                <mesh position={[0, -0.08, 0]} material={materials.matteDark}>
                  <cylinderGeometry args={[0.16, 0.16, 0.04, 32]} />
                </mesh>
              </group>
              <Thruster isDark={isDark} offset={0} />
            </group>
          </group>
        </group>

        {/* Right Leg */}
        <group position={[0.2, 0, 0]}>
          <mesh material={materials.matteDark}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          <group position={[0, -0.22, 0]}>
            <mesh material={materials.whiteArmor}>
              <sphereGeometry args={[0.16, 24, 24]} />
            </mesh>
            <mesh position={[0, -0.18, 0.04]} material={materials.matteDark}>
              <sphereGeometry args={[0.08, 16, 16]} />
            </mesh>
            <group position={[0, -0.42, 0]}>
              <mesh material={materials.whiteArmor}>
                <capsuleGeometry args={[0.13, 0.24, 12, 24]} />
              </mesh>
              
              {/* Soft Space Boot */}
              <group position={[0, -0.22, 0.06]}>
                <mesh material={materials.whiteArmor}>
                  <sphereGeometry args={[0.15, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
                </mesh>
                <mesh position={[0, -0.08, 0]} material={materials.matteDark}>
                  <cylinderGeometry args={[0.16, 0.16, 0.04, 32]} />
                </mesh>
              </group>
              <Thruster isDark={isDark} offset={Math.PI} />
            </group>
          </group>
        </group>
      </group>

    </group>
  );
}
