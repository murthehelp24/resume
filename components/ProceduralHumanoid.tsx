"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ProceduralHumanoid() {
  const robotGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const chestGroupRef = useRef<THREE.Group>(null);
  const leftArmGroupRef = useRef<THREE.Group>(null);
  const rightArmGroupRef = useRef<THREE.Group>(null);

  // Materials - enhanced for maximum realism
  const materials = useMemo(() => ({
    // Satin metallic silver - premium aluminum/titanium finish
    silver: new THREE.MeshPhysicalMaterial({
      color: 0xd8d8e5,
      metalness: 0.9,
      roughness: 0.18,
      envMapIntensity: 2.2,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
    }),
    // Glossy black - head helmet obsidian/polycarbonate look
    headBlack: new THREE.MeshPhysicalMaterial({
      color: 0x050508,
      metalness: 0.8,
      roughness: 0.1,
      envMapIntensity: 3.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    }),
    // Matte dark - structural carbon/reinforced polymer
    darkJoint: new THREE.MeshStandardMaterial({
      color: 0x121214,
      metalness: 0.6,
      roughness: 0.7,
      envMapIntensity: 0.8,
    }),
    // Glowing cyan/blue - core energy and sensors
    visorGlow: new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0ea5e9,
      emissiveIntensity: 8.0,
      toneMapped: false,
    }),
    // Secondary accent glow (White/Blue)
    eyeGlow: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 12.0,
      toneMapped: false,
    }),
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Gentle idle floating
    if (robotGroupRef.current) {
      robotGroupRef.current.position.y = Math.sin(time * 1.4) * 0.06;
      robotGroupRef.current.rotation.z = Math.sin(time * 0.7) * 0.005;
    }

    // Breathing
    if (chestGroupRef.current) {
      const b = 1.0 + Math.sin(time * 1.8) * 0.004;
      chestGroupRef.current.scale.set(b, b, b);
    }

    // Mouse look-at
    const tx = state.pointer.x * 0.35;
    const ty = state.pointer.y * 0.15;

    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, tx, 0.06);
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -ty, 0.06);
    }
    if (chestGroupRef.current) {
      chestGroupRef.current.rotation.y = THREE.MathUtils.lerp(chestGroupRef.current.rotation.y, tx * 0.15, 0.06);
    }

    // Subtle arm sway
    if (leftArmGroupRef.current) {
      leftArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        leftArmGroupRef.current.rotation.z, -0.08 + Math.sin(time * 1.4) * 0.008, 0.07
      );
    }
    if (rightArmGroupRef.current) {
      rightArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        rightArmGroupRef.current.rotation.z, 0.08 - Math.sin(time * 1.4) * 0.008, 0.07
      );
    }
  });

  return (
    <group ref={robotGroupRef} position={[0, 0, 0]}>

      {/* ══════════ TORSO/CHEST (Silver) ══════════ */}
      <group ref={chestGroupRef} position={[0, 0.4, 0]}>

        {/* Main chest plate - tapered silver */}
        <mesh position={[0, 0, 0]} material={materials.silver}>
          <cylinderGeometry args={[0.62, 0.42, 0.95, 32]} />
        </mesh>
        {/* Rounded shoulder cap on top */}
        <mesh position={[0, 0.42, 0]} material={materials.silver}>
          <sphereGeometry args={[0.62, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        </mesh>

        {/* Small circular chest emblem */}
        <mesh position={[0, 0.2, 0.44]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkJoint}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 24]} />
        </mesh>
        <mesh position={[0, 0.2, 0.455]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkJoint}>
          <torusGeometry args={[0.08, 0.015, 12, 24]} />
        </mesh>
        {/* Core Glow Center */}
        <mesh position={[0, 0.2, 0.45]} material={materials.eyeGlow}>
          <sphereGeometry args={[0.03, 16, 16]} />
        </mesh>

        {/* ── SPINE (Exposed dark mechanical vertebrae) ── */}
        <mesh position={[0, -0.7, 0]} material={materials.darkJoint}>
          <cylinderGeometry args={[0.08, 0.08, 0.55, 16]} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={`spine-${i}`} position={[0, -0.5 - i * 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkJoint}>
            <torusGeometry args={[0.13, 0.035, 8, 24]} />
          </mesh>
        ))}

        {/* ── NECK ── */}
        <mesh position={[0, 0.68, 0]} material={materials.darkJoint}>
          <cylinderGeometry args={[0.12, 0.16, 0.28, 24]} />
        </mesh>

        {/* ── PELVIS ── */}
        <group position={[0, -1.14, 0]}>
          {/* Silver pelvis bowl */}
          <mesh material={materials.silver}>
            <sphereGeometry args={[0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
          </mesh>
          <mesh position={[0, -0.08, 0]} material={materials.darkJoint}>
            <cylinderGeometry args={[0.3, 0.24, 0.16, 32]} />
          </mesh>
          {/* Horizontal hip bar */}
          <mesh position={[0, -0.16, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.darkJoint}>
            <cylinderGeometry args={[0.12, 0.12, 0.52, 16]} />
          </mesh>
        </group>

        {/* ══════════ LEFT ARM ══════════ */}
        <group ref={leftArmGroupRef} position={[-0.76, 0.35, 0]}>
          {/* Shoulder ball joint (dark) */}
          <mesh material={materials.darkJoint}>
            <sphereGeometry args={[0.16, 24, 24]} />
          </mesh>
          {/* Shoulder guard (silver) */}
          <mesh position={[-0.02, 0.06, 0]} material={materials.silver}>
            <sphereGeometry args={[0.22, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
          </mesh>
          {/* Bolts on shoulder guard */}
          <mesh position={[-0.02, 0.18, 0.12]} material={materials.darkJoint}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>
          <mesh position={[-0.02, 0.18, -0.12]} material={materials.darkJoint}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>

          {/* Upper arm (silver sleeve) */}
          <group position={[-0.04, -0.35, 0]} rotation={[0, 0, 0.06]}>
            <mesh material={materials.silver}>
              <capsuleGeometry args={[0.1, 0.36, 12, 24]} />
            </mesh>

            {/* Elbow (dark sphere joint) */}
            <mesh position={[0, -0.26, 0]} material={materials.darkJoint}>
              <sphereGeometry args={[0.11, 16, 16]} />
            </mesh>

            {/* Forearm (silver sleeve) */}
            <group position={[0, -0.55, 0]} rotation={[0, 0, -0.06]}>
              <mesh material={materials.silver}>
                <capsuleGeometry args={[0.085, 0.34, 12, 24]} />
              </mesh>

              {/* Wrist (dark) */}
              <mesh position={[0, -0.22, 0]} material={materials.darkJoint}>
                <sphereGeometry args={[0.07, 12, 12]} />
              </mesh>

              {/* Hand (dark matte block) */}
              <group position={[0, -0.3, 0.01]}>
                <mesh material={materials.darkJoint}>
                  <boxGeometry args={[0.12, 0.13, 0.065]} />
                </mesh>
                {/* Fingers */}
                <mesh position={[-0.035, -0.1, 0]} material={materials.darkJoint}>
                  <boxGeometry args={[0.022, 0.07, 0.022]} />
                </mesh>
                <mesh position={[-0.01, -0.11, 0]} material={materials.darkJoint}>
                  <boxGeometry args={[0.022, 0.08, 0.022]} />
                </mesh>
                <mesh position={[0.015, -0.11, 0]} material={materials.darkJoint}>
                  <boxGeometry args={[0.022, 0.08, 0.022]} />
                </mesh>
                <mesh position={[0.04, -0.1, 0]} material={materials.darkJoint}>
                  <boxGeometry args={[0.022, 0.07, 0.022]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* ══════════ RIGHT ARM ══════════ */}
        <group ref={rightArmGroupRef} position={[0.76, 0.35, 0]}>
          {/* Shoulder ball joint (dark) */}
          <mesh material={materials.darkJoint}>
            <sphereGeometry args={[0.16, 24, 24]} />
          </mesh>
          {/* Shoulder guard (silver) */}
          <mesh position={[0.02, 0.06, 0]} material={materials.silver}>
            <sphereGeometry args={[0.22, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
          </mesh>
          {/* Bolts on shoulder guard */}
          <mesh position={[0.02, 0.18, 0.12]} material={materials.darkJoint}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>
          <mesh position={[0.02, 0.18, -0.12]} material={materials.darkJoint}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>

          {/* Upper arm (silver sleeve) */}
          <group position={[0.04, -0.35, 0]} rotation={[0, 0, -0.06]}>
            <mesh material={materials.silver}>
              <capsuleGeometry args={[0.1, 0.36, 12, 24]} />
            </mesh>

            {/* Elbow (dark sphere joint) */}
            <mesh position={[0, -0.26, 0]} material={materials.darkJoint}>
              <sphereGeometry args={[0.11, 16, 16]} />
            </mesh>

            {/* Forearm (silver sleeve) */}
            <group position={[0, -0.55, 0]} rotation={[0, 0, 0.06]}>
              <mesh material={materials.silver}>
                <capsuleGeometry args={[0.085, 0.34, 12, 24]} />
              </mesh>

              {/* Wrist (dark) */}
              <mesh position={[0, -0.22, 0]} material={materials.darkJoint}>
                <sphereGeometry args={[0.07, 12, 12]} />
              </mesh>

              {/* Hand (dark matte block) */}
              <group position={[0, -0.3, 0.01]}>
                <mesh material={materials.darkJoint}>
                  <boxGeometry args={[0.12, 0.13, 0.065]} />
                </mesh>
                {/* Fingers */}
                <mesh position={[-0.04, -0.1, 0]} material={materials.darkJoint}>
                  <boxGeometry args={[0.022, 0.07, 0.022]} />
                </mesh>
                <mesh position={[-0.015, -0.11, 0]} material={materials.darkJoint}>
                  <boxGeometry args={[0.022, 0.08, 0.022]} />
                </mesh>
                <mesh position={[0.01, -0.11, 0]} material={materials.darkJoint}>
                  <boxGeometry args={[0.022, 0.08, 0.022]} />
                </mesh>
                <mesh position={[0.035, -0.1, 0]} material={materials.darkJoint}>
                  <boxGeometry args={[0.022, 0.07, 0.022]} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* ══════════ HEAD (Glossy black helmet + cyan visor strip on top) ══════════ */}
      <group ref={headGroupRef} position={[0, 1.28, 0]}>
        {/* Main head dome (glossy black) */}
        <mesh material={materials.headBlack}>
          <sphereGeometry args={[0.36, 48, 48]} />
        </mesh>

        {/* Chin/jaw extension */}
        <mesh position={[0, -0.12, 0.04]} material={materials.headBlack}>
          <sphereGeometry args={[0.3, 32, 32, 0, Math.PI * 2, Math.PI / 3, Math.PI / 2.5]} />
        </mesh>

        {/* Cyan/blue visor strip on top of head */}
        <mesh position={[0, 0.22, 0.06]} rotation={[0.25, 0, 0]} material={materials.visorGlow}>
          <torusGeometry args={[0.22, 0.04, 8, 32, Math.PI]} />
        </mesh>

        {/* Face visor area (dark recessed plate) */}
        <mesh position={[0, 0.04, 0.28]} rotation={[0, 0, 0]} material={materials.darkJoint}>
          <planeGeometry args={[0.34, 0.22]} />
        </mesh>

        {/* Glowing Eyes */}
        <mesh position={[-0.1, 0.06, 0.32]} material={materials.eyeGlow}>
          <sphereGeometry args={[0.025, 16, 16]} />
        </mesh>
        <mesh position={[0.1, 0.06, 0.32]} material={materials.eyeGlow}>
          <sphereGeometry args={[0.025, 16, 16]} />
        </mesh>
      </group>

      {/* ══════════ LEFT LEG ══════════ */}
      <group position={[-0.22, -0.74, 0]}>
        {/* Hip socket (dark) */}
        <mesh material={materials.darkJoint}>
          <sphereGeometry args={[0.11, 16, 16]} />
        </mesh>

        {/* Thigh (silver) */}
        <group position={[0, -0.38, 0]}>
          <mesh material={materials.silver}>
            <capsuleGeometry args={[0.11, 0.54, 12, 24]} />
          </mesh>

          {/* Knee (dark sphere) */}
          <mesh position={[0, -0.34, 0.02]} material={materials.darkJoint}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>

          {/* Shin (silver) */}
          <group position={[0, -0.72, 0]}>
            <mesh material={materials.silver}>
              <capsuleGeometry args={[0.09, 0.52, 12, 24]} />
            </mesh>

            {/* Ankle (dark) */}
            <mesh position={[0, -0.32, 0]} material={materials.darkJoint}>
              <cylinderGeometry args={[0.055, 0.055, 0.1, 12]} />
            </mesh>

            {/* Foot (dark, sleek) */}
            <mesh position={[0, -0.4, 0.08]} material={materials.darkJoint}>
              <boxGeometry args={[0.13, 0.08, 0.3]} />
            </mesh>
            {/* Toe tip */}
            <mesh position={[0, -0.4, 0.26]} material={materials.darkJoint}>
              <boxGeometry args={[0.1, 0.06, 0.08]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ══════════ RIGHT LEG ══════════ */}
      <group position={[0.22, -0.74, 0]}>
        {/* Hip socket (dark) */}
        <mesh material={materials.darkJoint}>
          <sphereGeometry args={[0.11, 16, 16]} />
        </mesh>

        {/* Thigh (silver) */}
        <group position={[0, -0.38, 0]}>
          <mesh material={materials.silver}>
            <capsuleGeometry args={[0.11, 0.54, 12, 24]} />
          </mesh>

          {/* Knee (dark sphere) */}
          <mesh position={[0, -0.34, 0.02]} material={materials.darkJoint}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>

          {/* Shin (silver) */}
          <group position={[0, -0.72, 0]}>
            <mesh material={materials.silver}>
              <capsuleGeometry args={[0.09, 0.52, 12, 24]} />
            </mesh>

            {/* Ankle (dark) */}
            <mesh position={[0, -0.32, 0]} material={materials.darkJoint}>
              <cylinderGeometry args={[0.055, 0.055, 0.1, 12]} />
            </mesh>

            {/* Foot (dark, sleek) */}
            <mesh position={[0, -0.4, 0.08]} material={materials.darkJoint}>
              <boxGeometry args={[0.13, 0.08, 0.3]} />
            </mesh>
            {/* Toe tip */}
            <mesh position={[0, -0.4, 0.26]} material={materials.darkJoint}>
              <boxGeometry args={[0.1, 0.06, 0.08]} />
            </mesh>
          </group>
        </group>
      </group>

    </group>
  );
}
