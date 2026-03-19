"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

/* ─── Animation config — matches existing portfolio easing ─────────────────── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const headingReveal = {
  hidden: { opacity: 0, scale: 1.12, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE },
  },
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  },
});

/* ─── Magnetic CTA button hook ─────────────────────────────────────────────── */
function useMagneticButton(ref: React.RefObject<HTMLAnchorElement | null>) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      setOffset({ x: dx, y: dy });
    },
    [ref]
  );

  const onLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, onMove, onLeave]);

  return offset;
}

/* ─── Component ────────────────────────────────────────────────────────────── */
export default function CTASection() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const magnetic = useMagneticButton(btnRef);

  return (
    <section className="cta-section" id="start">
      {/* Animated gradient background flow */}
      <div className="cta-gradient-bg" aria-hidden="true" />

      {/* Ambient blobs */}
      <div className="cta-blob cta-blob--1" aria-hidden="true" />
      <div className="cta-blob cta-blob--2" aria-hidden="true" />

      <div className="cta-inner">
        <motion.div
          className="cta-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Eyebrow */}
          <motion.div className="eyebrow" variants={fadeUp(0)}>
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Ready to Collaborate?</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="cta-heading"
            variants={headingReveal}
          >
            Let&apos;s Build Something{" "}
            <span className="cta-heading-gradient">Impactful</span> Together
          </motion.h2>

          {/* Subtext */}
          <motion.p className="cta-subtext" variants={fadeUp(0.2)}>
            I craft immersive, scalable digital products that push boundaries.
            Whether it&apos;s a startup MVP, a growth engine, or an interactive
            experience — let&apos;s make it happen.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="cta-buttons" variants={fadeUp(0.35)}>
            {/* Primary — magnetic + glow */}
            <div className="cta-btn-wrap">
              <div className="cta-btn-halo" aria-hidden="true" />
              <motion.a
                ref={btnRef}
                href="#contact"
                className="btn btn-primary cta-btn-primary"
                animate={{ x: magnetic.x, y: magnetic.y }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 50px rgba(108,99,255,0.55)",
                }}
                whileTap={{ scale: 0.96 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Start a Conversation
              </motion.a>
            </div>

            {/* Secondary ghost */}
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              View Resume
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
