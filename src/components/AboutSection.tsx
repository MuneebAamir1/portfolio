"use client";
import { motion } from "framer-motion";

/**
 * AboutSection
 * ──────────────
 * Uses Framer Motion whileInView for reliable scroll-triggered reveal.
 * Each element fades + rises when it enters the viewport — no dependency
 * on scroll progress values, works even if the page barely scrolls.
 */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, margin: "-80px" },
});

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      {/* Decorative ambient blob */}
      <div className="about-blob" aria-hidden="true" />

      <div className="about-inner">
        {/* ── Left: Text content ── */}
        <div className="about-text">
          <motion.div className="eyebrow" {...fadeUp(0)}>
            <div className="eyebrow-line" />
            <span className="eyebrow-text">About Me</span>
          </motion.div>

          <motion.h2 className="about-heading" {...fadeUp(0.08)}>
            Crafting digital<br />
            <span className="about-heading-gradient">experiences</span> that matter
          </motion.h2>

          <motion.p className="about-desc" {...fadeUp(0.18)}>
            I'm a full-stack developer and creative technologist with 3+ years
            of experience building immersive, production-ready applications. I
            specialise in the intersection of design and engineering — where
            beautiful interfaces meet clean, scalable code.
          </motion.p>

          <motion.p className="about-desc" {...fadeUp(0.26)}>
            Whether it's a 3D portfolio, a data-heavy dashboard, or a
            pixel-perfect landing page, I approach every project with the same
            obsession for detail and performance.
          </motion.p>

          <motion.div className="about-stats" {...fadeUp(0.36)}>
            <div className="stat-card">
              <span className="stat-number">3+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">20+</span>
              <span className="stat-label">Projects Shipped</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">100%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
          </motion.div>
        </div>

        {/* ── Right: Skill grid ── */}
        <motion.div className="about-skills" {...fadeUp(0.15)}>
          {[
            { icon: "⚛️", label: "React / Next.js",  sub: "App Router, SSR, RSC" },
            { icon: "🎮", label: "Three.js / WebGL",  sub: "3D, Shaders, R3F" },
            { icon: "🎨", label: "UI / UX Design",    sub: "Figma, Motion" },
            { icon: "🟢", label: "Node / Express",    sub: "REST, GraphQL" },
            { icon: "🗃️", label: "Databases",         sub: "Postgres, MongoDB" },
            { icon: "☁️", label: "Cloud & DevOps",    sub: "Vercel, AWS, Docker" },
          ].map((s, i) => (
            <motion.div key={s.label} className="skill-card" {...fadeUp(0.18 + i * 0.07)}>
              <span className="skill-icon">{s.icon}</span>
              <div>
                <div className="skill-name">{s.label}</div>
                <div className="skill-sub">{s.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
