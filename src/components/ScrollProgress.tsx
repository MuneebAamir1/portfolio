"use client";
import { useScroll, useSpring, motion } from "framer-motion";

/**
 * Scroll Progress Indicator
 * ─────────────────────────
 * Thin gradient bar at the top of the viewport that tracks page scroll.
 * Uses the same accent palette as the rest of the portfolio.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 0.5,
  });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
}
