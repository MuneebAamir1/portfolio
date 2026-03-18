"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ─── Experience data ──────────────────────────────────────────────────────── */
const experiences = [
  {
    id: 1,
    role: "Full Stack Developer",
    type: "Freelancing",
    company: "Self-Employed",
    location: "Remote",
    period: "Aug 2025 — Present",
    description:
      "Building end-to-end web applications for clients worldwide — from interactive landing pages to complex SaaS dashboards. Specialising in React, Next.js, Node.js, and database architecture with a focus on pixel-perfect UI and optimized performance.",
    skills: ["React", "Next.js", "Node.js", "MongoDB", "TypeScript", "Tailwind"],
    accent: "var(--accent)",   // purple
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 2,
    role: "Frontend Developer",
    type: "Internship",
    company: "Dev Hub Co.",
    location: "Islamabad",
    period: "Jan 2026 — Present",
    description:
      "Contributing to production-grade frontend systems with a focus on responsive design, component architecture, and modern tooling. Collaborating closely with senior engineers and designers to ship polished user interfaces.",
    skills: ["React", "TypeScript", "Figma", "REST APIs", "Git", "Agile"],
    accent: "var(--accent2)",  // pink
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="12" y1="2" x2="12" y2="22" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: 3,
    role: "Sales & Outreach Specialist",
    type: "Part-time",
    company: "Stratify AI",
    location: "Remote",
    period: "Feb 2026 — Present",
    description:
      "Driving B2B outreach and client acquisition for an AI-powered analytics startup. Combining technical knowledge with strategic communication to connect prospective clients with cutting-edge AI solutions.",
    skills: ["B2B Sales", "CRM", "AI Tools", "Cold Outreach", "Strategy", "Analytics"],
    accent: "var(--accent3)",  // teal
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
];

/* ─── Animation variants ───────────────────────────────────────────────────── */
// Matches existing project easing: [0.22, 1, 0.36, 1]
const EASE = [0.22, 1, 0.36, 1] as const;

const sectionFade = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const headingReveal = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};

const cardVariant = (i: number) => ({
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      delay: i * 0.15,
      ease: EASE,
    },
  },
});

/* ─── Cursor spotlight hook ────────────────────────────────────────────────── */
function useCursorSpotlight(sectionRef: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [sectionRef]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [sectionRef, onMove]);

  return { pos, visible };
}

/* ─── Component ────────────────────────────────────────────────────────────── */
export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { pos, visible } = useCursorSpotlight(sectionRef);

  // Timeline scroll progress for the glowing progress indicator
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 85%", "end 20%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    mass: 1,
  });
  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="experience"
      className="experience-section"
      ref={sectionRef}
    >
      {/* ── Cursor-following gradient spotlight ── */}
      <div
        className="exp-cursor-spotlight"
        style={{
          left: pos.x,
          top: pos.y,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* ── Ambient decorative blobs ── */}
      <div className="exp-blob exp-blob--1" aria-hidden="true" />
      <div className="exp-blob exp-blob--2" aria-hidden="true" />

      <div className="experience-inner">
        {/* ── Section heading ── */}
        <motion.div
          className="exp-header"
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="eyebrow">
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Career Journey</span>
          </div>

          <motion.h2
            className="exp-heading"
            variants={headingReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            My <span className="exp-heading-gradient">Experience</span>
          </motion.h2>

          <motion.p
            className="exp-subtext"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            A timeline of roles that shaped my craft — from building full-stack
            products to driving growth at AI startups.
          </motion.p>
        </motion.div>

        {/* ── Timeline ── */}
        <div className="timeline" ref={timelineRef}>
          {/* Glowing progress line */}
          <div className="timeline-track">
            <motion.div
              className="timeline-progress"
              style={{ height: progressHeight }}
            />
          </div>

          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              className={`timeline-item ${i % 2 === 0 ? "timeline-item--left" : "timeline-item--right"}`}
              variants={cardVariant(i)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {/* Timeline node */}
              <div className="timeline-node">
                <div
                  className="timeline-node-dot"
                  style={{ borderColor: exp.accent, boxShadow: `0 0 12px ${exp.accent}` }}
                />
              </div>

              {/* Experience card */}
              <motion.div
                className="exp-card"
                whileHover={{
                  scale: 1.03,
                  y: -6,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(108,99,255,0.12)",
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Accent top line */}
                <div
                  className="exp-card-accent"
                  style={{
                    background: `linear-gradient(90deg, ${exp.accent}, transparent)`,
                  }}
                />

                <div className="exp-card-header">
                  <div
                    className="exp-card-icon"
                    style={{ color: exp.accent }}
                  >
                    {exp.icon}
                  </div>
                  <div>
                    <span
                      className="exp-card-type"
                      style={{ color: exp.accent }}
                    >
                      {exp.type}
                    </span>
                    <h3 className="exp-card-role">{exp.role}</h3>
                  </div>
                </div>

                <div className="exp-card-meta">
                  <span className="exp-card-company">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    {exp.company}
                  </span>
                  <span className="exp-card-location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {exp.location}
                  </span>
                  <span className="exp-card-period">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {exp.period}
                  </span>
                </div>

                <p className="exp-card-desc">{exp.description}</p>

                <div className="exp-card-skills">
                  {exp.skills.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
