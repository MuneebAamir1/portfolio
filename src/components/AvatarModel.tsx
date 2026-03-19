"use client";
import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

// ---------- constants you can tweak easily ----------
const FRAME_TOP = 0.95;
const FRAME_BOT = 0.45;
// Breathing
const BREATH_AMPLITUDE = 0.008;
const BREATH_SPEED = 0.55;
const BREATH_SCALE_AMP = 0.003;
// Tilt: slight right lean (radians). ~0.07 ≈ 4°, very subtle but noticeable.
const BASE_TILT_Z = -0.07;
// Cursor parallax strength — how much the model follows global mouse
const PARALLAX_STRENGTH = 0.12;
// ----------------------------------------------------

// Shared mouse position (normalised -1..1) updated from HeroRight wrapper
let globalMouse = { x: 0, y: 0 };
export function setGlobalMouse(nx: number, ny: number) {
  globalMouse.x = nx;
  globalMouse.y = ny;
}

// ── Scroll-driven rotation offset (set from outside R3F, read in useFrame) ──
// Using a plain mutable ref so there are ZERO re-renders inside the Canvas.
let scrollRotYOffset = 0;
export function setScrollRotY(radians: number) {
  scrollRotYOffset = radians;
}

function Model() {
  const { scene, animations } = useGLTF("/model.glb");
  const modelRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.keys(actions)[0];
      actions[firstAction]?.play();
    }
  }, [actions]);

  useEffect(() => {
    if (!scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());

    const visibleHeight = size.y * (FRAME_TOP - FRAME_BOT);
    const scale = 2.0 / Math.max(visibleHeight, size.x, 0.001);
    scene.scale.setScalar(scale);

    const box2 = new THREE.Box3().setFromObject(scene);
    const min2 = box2.min;
    const size2 = box2.getSize(new THREE.Vector3());

    const cx = (box2.min.x + box2.max.x) / 2;
    scene.position.x = -cx;

    const focalFrac = FRAME_BOT + (FRAME_TOP - FRAME_BOT) * 0.45;
    const focalY = min2.y + size2.y * focalFrac;
    scene.position.y += -focalY;
  }, [scene]);

  return <primitive object={scene} ref={modelRef} />;
}

function SceneCanvas() {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: 0, y: 0 });
  // Smooth parallax target
  const parallaxRef = useRef({ x: 0, y: 0 });
  const clock = useRef(new THREE.Clock());

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    targetRotRef.current.x = Math.max(
      -0.4, Math.min(0.4, targetRotRef.current.x + e.movementY * 0.005)
    );
    targetRotRef.current.y += e.movementX * 0.009;
  };

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth drag rotation
    const rx = rotRef.current.x + (targetRotRef.current.x - rotRef.current.x) * 0.07;
    const ry = rotRef.current.y + (targetRotRef.current.y - rotRef.current.y) * 0.07;
    rotRef.current.x = rx;
    rotRef.current.y = ry;

    // Smooth cursor parallax (lazy follow)
    parallaxRef.current.x += (globalMouse.x - parallaxRef.current.x) * 0.04;
    parallaxRef.current.y += (globalMouse.y - parallaxRef.current.y) * 0.04;

    // Apply all rotations.
    // scrollRotYOffset is added on top — it never resets drag/parallax.
    groupRef.current.rotation.x = rx + parallaxRef.current.y * PARALLAX_STRENGTH;
    groupRef.current.rotation.y = ry + parallaxRef.current.x * PARALLAX_STRENGTH + scrollRotYOffset;
    groupRef.current.rotation.z = BASE_TILT_Z;

    // Breathing
    const t = clock.current.getElapsedTime();
    const breath = Math.sin(t * Math.PI * 2 * BREATH_SPEED);
    groupRef.current.position.y = breath * BREATH_AMPLITUDE;
    const s = 1 + breath * BREATH_SCALE_AMP;
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <Model />
    </group>
  );
}

import { motion } from "framer-motion";

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginTop: "40px" }}>
        <div className="spinner" style={{ borderColor: "rgba(108, 99, 255, 0.2)", borderTopColor: "var(--accent)" }}></div>
        <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", color: "var(--accent)" }}>
          {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

export default function AvatarModel({ wrapStyle }: { wrapStyle?: any }) {
  return (
    <motion.div className="model-canvas-wrap" style={wrapStyle}>
      <Canvas camera={{ position: [0, 0, 2.2], fov: 42 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[1.5, 2.5, 2.5]} intensity={0.9} color={0xffffff} />
        <directionalLight position={[-2, 0.5, 1.5]} intensity={0.35} color={0x8888ff} />
        <pointLight position={[-1, 2, -2]} intensity={0.5} distance={8} color={0xFF6B9D} />
        <pointLight position={[0, 3, 0]} intensity={0.3} distance={6} color={0x6C63FF} />
        <Suspense fallback={<CanvasLoader />}>
          <SceneCanvas />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

useGLTF.preload("/model.glb");
