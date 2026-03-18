"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ─── Skill groups data ────────────────────────────────────────────────────── */
const skillGroups = [
  {
    id: "frontend",
    title: "Frontend Core",
    tagline: "Building scalable interfaces.",
    accent: "var(--accent)",
    glowRgb: "108,99,255",
    skills: [
      { name: "HTML5", icon: "🌐" },
      { name: "CSS3", icon: "🎨" },
      { name: "JavaScript", icon: "⚡" },
      { name: "TypeScript", icon: "🔷" },
      { name: "React.js", icon: "⚛️" },
      { name: "Next.js", icon: "▲" },
      { name: "Vite", icon: "🚀" },
    ],
  },
  {
    id: "3d-web",
    title: "3D & Advanced Web",
    tagline: "Crafting immersive web experiences.",
    accent: "var(--accent2)",
    glowRgb: "255,107,157",
    skills: [
      { name: "Three.js", icon: "🎮" },
      { name: "WebGL", icon: "🌀" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Data",
    tagline: "Powering robust server architectures.",
    accent: "var(--accent3)",
    glowRgb: "0,217,184",
    skills: [
      { name: "Node.js", icon: "🟢" },
      { name: "Express.js", icon: "🛤️" },
      { name: "MongoDB", icon: "🍃" },
      { name: "SQL", icon: "📊" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "Python", icon: "🐍" },
    ],
  },
  {
    id: "automation",
    title: "Automation & Growth",
    tagline: "Engineering growth automation systems.",
    accent: "var(--accent)",
    glowRgb: "108,99,255",
    skills: [
      { name: "n8n", icon: "⚙️" },
      { name: "Twilio", icon: "📱" },
      { name: "GoHighLevel", icon: "📈" },
      { name: "Lead Gen Systems", icon: "🎯" },
      { name: "Cold Outreach", icon: "📧" },
    ],
  },
];

/* ─── Animation config ─────────────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const sectionReveal = {
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

const cardReveal = (i: number) => ({
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 0.1 + i * 0.12,
      ease: EASE,
    },
  },
});

const skillPillReveal = (i: number) => ({
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.3 + i * 0.05,
      ease: EASE,
    },
  },
});

/* ─── Floating oscillation keyframe offsets per card ── */
const FLOAT_OFFSETS = [0, 1.2, 2.5, 3.8];

/* ─── Cursor spotlight hook (reused pattern from ExperienceSection) ──────── */
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

/* ─── Tilt card sub-component ──────────────────────────────────────────────── */
function TiltCard({
  group,
  index,
}: {
  group: (typeof skillGroups)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      rotateX.set(ny * -10);
      rotateY.set(nx * 10);
    },
    [rotateX, rotateY]
  );

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      className="ts-card"
      variants={cardReveal(index)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      whileHover={{
        scale: 1.04,
        boxShadow: `0 20px 60px rgba(0,0,0,0.45), 0 0 30px rgba(${group.glowRgb},0.15)`,
        borderColor: `rgba(${group.glowRgb}, 0.35)`,
        transition: { type: "spring", stiffness: 280, damping: 20 },
      }}
      whileTap={{ scale: 0.97 }}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 800,
        animationDelay: `${FLOAT_OFFSETS[index]}s`,
      }}
    >
      {/* Accent top border */}
      <div
        className="ts-card-accent"
        style={{
          background: `linear-gradient(90deg, ${group.accent}, transparent)`,
        }}
      />

      {/* Card header */}
      <div className="ts-card-header">
        <h3 className="ts-card-title" style={{ color: group.accent }}>
          {group.title}
        </h3>
        <p className="ts-card-tagline">{group.tagline}</p>
      </div>

      {/* Skill pills */}
      <div className="ts-card-pills">
        {group.skills.map((skill, si) => (
          <motion.span
            key={skill.name}
            className="ts-pill"
            variants={skillPillReveal(si)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{
              borderColor: `rgba(${group.glowRgb}, 0.5)`,
              color: "var(--text)",
              scale: 1.08,
              transition: { duration: 0.2 },
            }}
          >
            <span className="ts-pill-icon">{skill.icon}</span>
            {skill.name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export default function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { pos, visible } = useCursorSpotlight(sectionRef);

  return (
    <section id="techstack" className="ts-section" ref={sectionRef}>
      {/* Cursor-following gradient spotlight */}
      <div
        className="ts-cursor-spotlight"
        style={{
          left: pos.x,
          top: pos.y,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Ambient decorative blobs */}
      <div className="ts-blob ts-blob--1" aria-hidden="true" />
      <div className="ts-blob ts-blob--2" aria-hidden="true" />
      <div className="ts-blob ts-blob--3" aria-hidden="true" />

      <div className="ts-inner">
        {/* ── Section heading ── */}
        <motion.div
          className="ts-header"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="eyebrow">
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Capabilities</span>
          </div>

          <motion.h2
            className="ts-heading"
            variants={headingReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            Tech <span className="ts-heading-gradient">Arsenal</span>
          </motion.h2>

          <motion.p
            className="ts-subtext"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            The tools, frameworks, and systems I wield to build
            performant products and drive measurable growth.
          </motion.p>
        </motion.div>

        {/* ── Floating skill ecosystem ── */}
        <div className="ts-ecosystem">
          {skillGroups.map((group, i) => (
            <TiltCard key={group.id} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
