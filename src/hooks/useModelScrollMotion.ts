/**
 * useModelScrollMotion
 * ─────────────────────
 * Tracks window scroll (no target — most reliable approach).
 * Maps scrollY in pixels to:
 *   • x  — DOM translateX on hero-right (model glides left)
 *   • rotY — Three.js Y rotation offset (model turns left)
 *   • scale — subtle depth reduction
 *
 * All values are spring-smoothed for cinematic, no-snap feel.
 */

"use client";
import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

// ── Responsive transform targets ──────────────────────────────
const RANGES = {
  desktop: { x: -260, rotY: -0.55, scale: 0.9 },
  tablet:  { x: -160, rotY: -0.4,  scale: 0.92 },
  mobile:  { x: 0,    rotY: -0.2,  scale: 0.95 },
} as const;

function getRange() {
  if (typeof window === "undefined") return RANGES.desktop;
  if (window.innerWidth < 640)  return RANGES.mobile;
  if (window.innerWidth < 1024) return RANGES.tablet;
  return RANGES.desktop;
}

// Spring config — high damping, no bounce, feels weighty and premium
const SPRING = { stiffness: 60, damping: 24, mass: 1 };

export interface ScrollMotionValues {
  /** CSS translateX (px) — apply to hero-right via style={{ x }} */
  x: MotionValue<number>;
  /** CSS scale — apply to hero-right via style={{ scale }} */
  scale: MotionValue<number>;
  /** Three.js Y rotation offset (radians) — push to setScrollRotY() */
  rotY: MotionValue<number>;
  /** Raw scrollY in px — used by AboutSection whileInView is preferred,
   *  but kept here for any additional scroll-linked effects */
  scrollY: MotionValue<number>;
}

export function useModelScrollMotion(): ScrollMotionValues {
  const range = getRange();

  // Track raw window scroll — no target, works everywhere
  const { scrollY } = useScroll();

  // Hero section is 100vh. We animate the model from scroll=0 (hero top)
  // to scroll=window.innerHeight * 0.8 (80% down the hero).
  // Using concrete pixel ranges makes this viewport-independent.
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const scrollEnd = vh * 0.85; // animation fully settled by 85% of hero scroll

  const rawX     = useTransform(scrollY, [0, scrollEnd], [0, range.x]);
  const rawRotY  = useTransform(scrollY, [0, scrollEnd], [0, range.rotY]);
  const rawScale = useTransform(scrollY, [0, scrollEnd], [1, range.scale]);

  // Spring-smooth for buttery, physically-believable feel
  const x     = useSpring(rawX,     SPRING);
  const rotY  = useSpring(rawRotY,  SPRING);
  const scale = useSpring(rawScale, SPRING);

  return { x, scale, rotY, scrollY };
}
