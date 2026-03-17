"use client";
import { useEffect, useRef } from "react";
import { motion, MotionValue } from "framer-motion";

interface Props {
  opacity: MotionValue<number>;
}

// Floating gradient orbs configuration
const ORB_CONFIG = [
  { xBase: 0.12, yBase: 0.28, r: 0.42, color: [108, 99, 255] as [number,number,number], speed: 0.00025, phase: 0     },
  { xBase: 0.82, yBase: 0.62, r: 0.35, color: [255, 107, 157] as [number,number,number], speed: 0.00032, phase: 2.1  },
  { xBase: 0.50, yBase: 0.08, r: 0.30, color: [0, 217, 184]   as [number,number,number], speed: 0.00020, phase: 4.3  },
  { xBase: 0.78, yBase: 0.15, r: 0.25, color: [108, 99, 255]  as [number,number,number], speed: 0.00038, phase: 1.7  },
];

export default function HeroBackground({ opacity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Smooth mouse — use refs so zero React re-renders
  const mouse    = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const raf      = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();

    const onMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX / w, y: e.clientY / h };
    };

    window.addEventListener("resize",    resize);
    window.addEventListener("mousemove", onMouse);

    const draw = (t: number) => {
      // Smooth lerp for mouse glow — 8% lerp per frame ≈ very cinematic drag
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.06;
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.06;

      ctx.clearRect(0, 0, w, h);

      // ── Floating orbs ───────────────────────────────────────────────────────
      for (const orb of ORB_CONFIG) {
        const ox = (orb.xBase + Math.sin(t * orb.speed             + orb.phase) * 0.14) * w;
        const oy = (orb.yBase + Math.cos(t * orb.speed * 1.33 + orb.phase) * 0.10) * h;
        const radius = orb.r * Math.min(w, h);
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius);
        g.addColorStop(0, `rgba(${orb.color},0.20)`);
        g.addColorStop(1, `rgba(${orb.color},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // ── Cursor glow ─────────────────────────────────────────────────────────
      const mx = smoothMouse.current.x * w;
      const my = smoothMouse.current.y * h;

      // Inner bright spot
      const g1 = ctx.createRadialGradient(mx, my, 0, mx, my, 180);
      g1.addColorStop(0, "rgba(108,99,255,0.13)");
      g1.addColorStop(1, "rgba(108,99,255,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Outer wide haze
      const g2 = ctx.createRadialGradient(mx, my, 0, mx, my, 500);
      g2.addColorStop(0, "rgba(255,107,157,0.06)");
      g2.addColorStop(1, "rgba(255,107,157,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // ── Subtle dot grid (every 48px, tiny 1px) ──────────────────────────────
      const spacing = 48;
      ctx.fillStyle = "rgba(255,255,255,0.025)";
      for (let gx = spacing / 2; gx < w; gx += spacing) {
        for (let gy = spacing / 2; gy < h; gy += spacing) {
          // Proximity fade: dots near cursor glow slightly
          const dx = gx - mx, dy = gy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const bright = Math.max(0, 1 - dist / 350) * 0.12;
          ctx.fillStyle = `rgba(255,255,255,${0.022 + bright})`;
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity,
      }}
    />
  );
}
