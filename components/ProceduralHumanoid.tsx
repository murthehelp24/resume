"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
      color: isDark ? 0x1a0a0a : 0x9ca3af, // Mahogany vs Silver
      metalness: 0.9,
      roughness: 0.1,
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
      emissiveIntensity: isDark ? 10.0 : 6.0,
      toneMapped: false,
    }),
    // Cyan light on foot (Reference image accent)
    cyanLight: new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: isDark ? 8.0 : 4.0,
      toneMapped: false,
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

      {/* ══════════ TORSO (Compact & Rounded) ══════════ */}
      <group ref={chestGroupRef} position={[0, 0.2, 0]}>
        
        {/* Main Chest (Glossy White) */}
        <mesh material={materials.whiteArmor}>
          <sphereGeometry args={[0.38, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.1]} />
        </mesh>
        
        {/* Lower Torso Detail (Dark) */}
        <mesh position={[0, -0.25, 0]} material={materials.matteDark}>
          <cylinderGeometry args={[0.2, 0.25, 0.15, 32]} />
        </mesh>

        {/* Vermilion side lights */}
        <mesh position={[-0.22, -0.1, 0.2]} material={materials.accentGlow}>
          <boxGeometry args={[0.04, 0.08, 0.02]} />
        </mesh>
        <mesh position={[0.22, -0.1, 0.2]} material={materials.accentGlow}>
          <boxGeometry args={[0.04, 0.08, 0.02]} />
        </mesh>

        {/* ══════════ LEFT ARM ══════════ */}
        <group position={[-0.45, 0.1, 0]} ref={leftArmGroupRef}>
          {/* Shoulder ball */}
          <mesh material={materials.whiteArmor}>
            <sphereGeometry args={[0.12, 24, 24]} />
          </mesh>
          
          <group position={[-0.1, -0.22, 0]} rotation={[0, 0, 0.1]}>
            {/* Upper Arm */}
            <mesh material={materials.whiteArmor}>
              <capsuleGeometry args={[0.07, 0.15, 12, 24]} />
            </mesh>
            
            {/* Elbow (exposed mechanical) */}
            <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.matteDark}>
              <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
            </mesh>

            {/* Forearm */}
            <group position={[0, -0.32, 0]}>
              <mesh material={materials.whiteArmor}>
                <capsuleGeometry args={[0.08, 0.18, 12, 24]} />
              </mesh>
              
              {/* Hand (Detailed mechanical fingers) */}
              <group position={[0, -0.2, 0]}>
                <mesh material={materials.matteDark}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                </mesh>
                {[ -0.04, -0.015, 0.015, 0.04 ].map((x, i) => (
                  <mesh key={`lf-${i}`} position={[x, -0.08, 0.01]} material={materials.matteDark}>
                    <capsuleGeometry args={[0.02, 0.06, 4, 8]} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </group>

        {/* ══════════ RIGHT ARM ══════════ */}
        <group position={[0.45, 0.1, 0]} ref={rightArmGroupRef}>
          <mesh material={materials.whiteArmor}>
            <sphereGeometry args={[0.12, 24, 24]} />
          </mesh>
          
          <group position={[0.1, -0.22, 0]} rotation={[0, 0, -0.1]}>
            <mesh material={materials.whiteArmor}>
              <capsuleGeometry args={[0.07, 0.15, 12, 24]} />
            </mesh>
            
            <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.matteDark}>
              <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
            </mesh>

            <group position={[0, -0.32, 0]}>
              <mesh material={materials.whiteArmor}>
                <capsuleGeometry args={[0.08, 0.18, 12, 24]} />
              </mesh>
              
              {/* Hand */}
              <group position={[0, -0.2, 0]}>
                <mesh material={materials.matteDark}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                </mesh>
                {[ -0.04, -0.015, 0.015, 0.04 ].map((x, i) => (
                  <mesh key={`rf-${i}`} position={[x, -0.08, 0.01]} material={materials.matteDark}>
                    <capsuleGeometry args={[0.02, 0.06, 4, 8]} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* ══════════ HEAD (Large Chibi Head) ══════════ */}
      <group ref={headGroupRef} position={[0, 0.85, 0]}>
        {/* Main Head Sphere */}
        <mesh material={materials.whiteArmor}>
          <sphereGeometry args={[0.55, 48, 48]} />
        </mesh>
        
        {/* Large Dark Visor */}
        <mesh position={[0, 0, 0.1]} material={materials.darkChrome}>
          <sphereGeometry args={[0.48, 48, 48, 0, Math.PI * 2, 0.5, 1.8]} />
        </mesh>

        {/* Glowing Eyes inside Visor - ENHANCED MULTI-LAYERED TECH EYES (VERMILION) */}
        {[[-0.18, 0.05, 0.48], [0.18, 0.05, 0.48]].map((pos, i) => (
          <group key={`eye-group-${i}`} position={pos as [number, number, number]}>
            <mesh material={materials.accentGlow}>
              <sphereGeometry args={[0.035, 16, 16]} />
            </mesh>
            <mesh rotation={[0, 0, 0]} material={materials.accentGlow}>
              <torusGeometry args={[0.055, 0.008, 8, 32]} />
            </mesh>
            <mesh material={materials.accentGlow}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color={0xe6391a} transparent opacity={0.25} />
            </mesh>
            <mesh position={[0, 0, 0.01]} material={materials.matteDark}>
              <planeGeometry args={[0.12, 0.005]} />
            </mesh>
          </group>
        ))}

        {/* "Ear" details / Side pods */}
        <group position={[-0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={materials.whiteArmor}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 32]} />
          </mesh>
          <mesh position={[0, 0.07, 0]} material={materials.accentGlow}>
            <torusGeometry args={[0.12, 0.02, 16, 32]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
        </group>
        <group position={[0.52, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh material={materials.whiteArmor}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 32]} />
          </mesh>
          <mesh position={[0, 0.07, 0]} material={materials.accentGlow}>
            <torusGeometry args={[0.12, 0.02, 16, 32]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
        </group>

        {/* Antenna */}
        <group position={[-0.4, 0.35, -0.1]} rotation={[-0.2, 0, 0.3]}>
          <mesh material={materials.matteDark}>
            <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
          </mesh>
          <mesh position={[0, 0.15, 0]} material={materials.accentGlow}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>
        </group>
      </group>

      {/* ══════════ LEGS (Chunky & Cute) ══════════ */}
      <group position={[0, -0.2, 0]}>
        {/* Left Leg */}
        <group position={[-0.22, 0, 0]}>
          <mesh material={materials.matteDark}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
          <group position={[0, -0.25, 0]}>
            <mesh material={materials.whiteArmor}>
              <sphereGeometry args={[0.18, 24, 24]} />
            </mesh>
            <mesh position={[0, -0.2, 0.05]} rotation={[0, 0, Math.PI / 2]} material={materials.matteDark}>
              <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
            </mesh>
            <group position={[0, -0.5, 0]}>
              <mesh material={materials.whiteArmor}>
                <capsuleGeometry args={[0.15, 0.25, 12, 24]} />
              </mesh>
              <mesh position={[0, -0.15, 0.15]} material={materials.accentGlow}>
                <sphereGeometry args={[0.04, 16, 16]} />
              </mesh>
              <mesh position={[0, -0.25, 0.1]} material={materials.whiteArmor}>
                <boxGeometry args={[0.18, 0.1, 0.3]} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Right Leg */}
        <group position={[0.22, 0, 0]}>
          <mesh material={materials.matteDark}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
          <group position={[0, -0.25, 0]}>
            <mesh material={materials.whiteArmor}>
              <sphereGeometry args={[0.18, 24, 24]} />
            </mesh>
            <mesh position={[0, -0.2, 0.05]} rotation={[0, 0, Math.PI / 2]} material={materials.matteDark}>
              <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
            </mesh>
            <group position={[0, -0.5, 0]}>
              <mesh material={materials.whiteArmor}>
                <capsuleGeometry args={[0.15, 0.25, 12, 24]} />
              </mesh>
              <mesh position={[0, -0.15, 0.15]} material={materials.accentGlow}>
                <sphereGeometry args={[0.04, 16, 16]} />
              </mesh>
              <mesh position={[0, -0.25, 0.1]} material={materials.whiteArmor}>
                <boxGeometry args={[0.18, 0.1, 0.3]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

    </group>
  );
}
