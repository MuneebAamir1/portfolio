"use client";
import React, { useRef, useState, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECTS DATA
   ─────────────
   HOW TO ADD A NEW PROJECT:
   1. Add an object to the `projects` array below.
   2. Supply a unique `id`, `title`, `desc`, and `tech` array.
   3. The `gradient` field defines the abstract placeholder visual.
      Use any CSS gradient string — it auto-fills the card visual.
   4. The carousel dynamically re-measures spacing from `projects.length`,
      so NO hardcoded translate values need changing.
   5. To use a real image later, replace the gradient div inside
      <ProjectVisual /> with a lazy-loaded <Image /> component.
   ═══════════════════════════════════════════════════════════════════════════ */

const projects = [
  {
    id: 1,
    title: "Immersive Portfolio",
    desc: "A cinematic 3D portfolio with scroll-driven storytelling and WebGL model integration.",
    tech: ["Next.js", "Three.js", "Framer Motion"],
    gradient: "linear-gradient(135deg, #6C63FF 0%, #FF6B9D 50%, #00D9B8 100%)",
    link: "https://muneebaamir.dev",
    github: "https://github.com/muneebaamir/portfolio",
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    desc: "Full-stack marketplace with real-time inventory, payments, and responsive storefront.",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    gradient: "linear-gradient(135deg, #FF6B9D 0%, #FF9A56 50%, #6C63FF 100%)",
    link: "#",
    github: "https://github.com/muneebaamir",
  },
  {
    id: 3,
    title: "AI Analytics Dashboard",
    desc: "Data visualization suite with live charts, anomaly detection, and predictive insights.",
    tech: ["Next.js", "Python", "PostgreSQL", "D3.js"],
    gradient: "linear-gradient(135deg, #00D9B8 0%, #6C63FF 50%, #FF6B9D 100%)",
    link: "#",
    github: "https://github.com/muneebaamir",
  },
  {
    id: 4,
    title: "Growth Automation Engine",
    desc: "Omni-channel outreach system with AI lead scoring and automated follow-ups.",
    tech: ["n8n", "Twilio", "GoHighLevel", "Node.js"],
    gradient: "linear-gradient(135deg, #6C63FF 0%, #00D9B8 50%, #FF9A56 100%)",
    link: "#",
    github: "https://github.com/muneebaamir",
  },
  {
    id: 5,
    title: "Real-Time Collaboration",
    desc: "WebSocket-powered workspace with live cursors, shared editing, and role-based access.",
    tech: ["React", "Socket.io", "Express", "Redis"],
    gradient: "linear-gradient(135deg, #FF9A56 0%, #FF6B9D 50%, #00D9B8 100%)",
    link: "#",
    github: "https://github.com/muneebaamir",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATION CONFIG
   ─────────────────
   Matches the existing portfolio easing + spring philosophy.
   ═══════════════════════════════════════════════════════════════════════════ */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const headingReveal = {
  hidden: { opacity: 0, scale: 1.15, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE },
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   DEPTH CAROUSEL MATH
   ────────────────────
   Transform mapping is index-based and scales with project count.
   Each card's visual properties are derived from its offset from the
   active index — no hardcoded pixel values.

   ADJUSTMENT NOTES:
   • SPREAD_X  — px gap between cards horizontally
   • SPREAD_Z  — px depth between card layers
   • SCALE_FALL — how quickly inactive cards shrink
   • BLUR_FALL  — blur px per depth level
   • OPACITY_FALL — opacity reduction per depth level
   ═══════════════════════════════════════════════════════════════════════════ */

const SPREAD_X = 320;
const SPREAD_Z = 120;
const SCALE_FALL = 0.12;
const BLUR_FALL = 2.5;
const OPACITY_FALL = 0.3;

function getCardTransform(index: number, activeIndex: number) {
  const offset = index - activeIndex;
  const absOffset = Math.abs(offset);
  const direction = Math.sign(offset);

  return {
    x: offset * SPREAD_X,
    z: -absOffset * SPREAD_Z,
    scale: Math.max(0.6, 1 - absOffset * SCALE_FALL),
    blur: absOffset * BLUR_FALL,
    opacity: Math.max(0.15, 1 - absOffset * OPACITY_FALL),
    rotateY: direction * -5 * Math.min(absOffset, 2),
    zIndex: 10 - absOffset,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOUSE LIGHT REFLECTION HOOK
   ═══════════════════════════════════════════════════════════════════════════ */

function useMouseReflection(cardRef: React.RefObject<HTMLDivElement | null>) {
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setLightPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [cardRef]
  );

  const onLeave = useCallback(() => {
    setLightPos({ x: 50, y: 50 });
  }, []);

  return { lightPos, onMove, onLeave };
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT CARD (memoized to avoid re-renders)
   ─────────────────────────────────────────────
   HOW TO LAZY LOAD MEDIA:
   Replace the `.proj-card-visual` gradient div with:
     <Image src={project.image} loading="lazy" ... />
   The gradient placeholder will be replaced on load.
   ═══════════════════════════════════════════════════════════════════════════ */

const ProjectCard = memo(function ProjectCard({
  project,
  isActive,
  transform,
  onClick,
}: {
  project: (typeof projects)[number];
  isActive: boolean;
  transform: ReturnType<typeof getCardTransform>;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { lightPos, onMove, onLeave } = useMouseReflection(cardRef);

  // Apply accessibility attributes ONLY after mount to prevent SSR hydration mismatch.
  // We avoid <button> because it strictly cannot contain nested <a> tags.
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.setAttribute("role", "button");
      cardRef.current.setAttribute("tabindex", "0");
      cardRef.current.setAttribute("aria-label", `Select project: ${project.title}`);
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      };
      cardRef.current.addEventListener("keydown", handleKeyDown);
      return () => {
        if (cardRef.current) {
          cardRef.current.removeEventListener("keydown", handleKeyDown);
        }
      };
    }
  }, [project.title, onClick]);

  return (
    <motion.div
      ref={cardRef}
      suppressHydrationWarning

      className={`proj-card ${isActive ? "proj-card--active" : ""}`}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{
        x: transform.x,
        scale: transform.scale,
        opacity: transform.opacity,
        rotateY: transform.rotateY,
        filter: `blur(${transform.blur}px)`,
      }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 24,
        mass: 1,
      }}
      style={{
        zIndex: transform.zIndex,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Mouse light reflection overlay */}
      <div
        className="proj-card-light"
        style={{
          background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,255,255,0.07) 0%, transparent 60%)`,
        }}
      />

      {/* Abstract gradient visual placeholder */}
      <div className="proj-card-visual">
        <div
          className="proj-card-gradient"
          style={{ background: project.gradient }}
        />
        {/* Mesh overlay for texture depth */}
        <div className="proj-card-mesh" />
      </div>

      {/* Card content */}
      <div className="proj-card-body">
        <h3 className="proj-card-title">{project.title}</h3>
        <p className="proj-card-desc">{project.desc}</p>
        <div className="proj-card-tech">
          {project.tech.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        {isActive && (
          <div className="proj-card-links">
            {project.link && project.link !== "#" && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} live demo`}
                className="proj-card-link"
                onClick={(e) => e.stopPropagation()}
              >
                Live Demo ↗
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source code on GitHub`}
                className="proj-card-link proj-card-link--ghost"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* Glow border on active */}
      {isActive && <div className="proj-card-glow" />}
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL PROGRESS INDICATOR
   ═══════════════════════════════════════════════════════════════════════════ */

function ProgressDots({
  total,
  active,
  onSelect,
}: {
  total: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="proj-dots">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={`proj-dot ${i === active ? "proj-dot--active" : ""}`}
          onClick={() => onSelect(i)}
          aria-label={`Go to project ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CURSOR SPOTLIGHT (consistent with previous sections)
   ═══════════════════════════════════════════════════════════════════════════ */

function useCursorSpotlight(ref: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const move = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    },
    [ref]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [ref, move]);

  return { pos, visible };
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { pos, visible } = useCursorSpotlight(sectionRef);

  // Wheel navigation — throttled for smooth experience
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // Only intercept horizontal-like scrolling or aggressive vertical
      if (Math.abs(e.deltaY) < 30) return;
      if (wheelTimeout.current) return; // throttle

      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 400);

      if (e.deltaY > 0 && activeIndex < projects.length - 1) {
        setActiveIndex((p) => p + 1);
      } else if (e.deltaY < 0 && activeIndex > 0) {
        setActiveIndex((p) => p - 1);
      }
    },
    [activeIndex]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setActiveIndex((p) => Math.min(p + 1, projects.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setActiveIndex((p) => Math.max(p - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Touch swipe for mobile
  const touchStart = useRef(0);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchStart.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        if (delta > 0 && activeIndex < projects.length - 1) {
          setActiveIndex((p) => p + 1);
        } else if (delta < 0 && activeIndex > 0) {
          setActiveIndex((p) => p - 1);
        }
      }
    },
    [activeIndex]
  );

  return (
    <section
      id="projects"
      className="proj-section"
      ref={sectionRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Background layers ── */}
      <div
        className="proj-cursor-spotlight"
        style={{
          left: pos.x,
          top: pos.y,
          opacity: visible ? 1 : 0,
        }}
      />
      <div className="proj-blob proj-blob--1" aria-hidden="true" />
      <div className="proj-blob proj-blob--2" aria-hidden="true" />

      {/* Animated background radial that shifts with active project */}
      <motion.div
        className="proj-bg-radial"
        animate={{
          background: projects[activeIndex].gradient,
          opacity: 0.06,
        }}
        transition={{ duration: 1.2, ease: EASE }}
        aria-hidden="true"
      />

      <div className="proj-inner">
        {/* ── Section heading ── */}
        <motion.div
          className="proj-header"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="eyebrow">
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Selected Work</span>
          </div>

          <motion.h2
            className="proj-heading"
            variants={headingReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            Featured <span className="proj-heading-gradient">Projects</span>
          </motion.h2>

          <motion.p
            className="proj-subtext"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            A curated selection of products I&apos;ve designed and
            engineered — each one built to push boundaries.
          </motion.p>
        </motion.div>

        {/* ── 3D Depth Carousel ── */}
        <div className="proj-carousel-wrap" onWheel={handleWheel}>
          <div className="proj-carousel" style={{ perspective: "1200px" }}>
            <AnimatePresence mode="popLayout">
              {projects.map((project, i) => {
                const transform = getCardTransform(i, activeIndex);
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isActive={i === activeIndex}
                    transform={transform}
                    onClick={() => setActiveIndex(i)}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <div className="proj-nav">
            <button
              className="proj-nav-btn"
              onClick={() => setActiveIndex((p) => Math.max(p - 1, 0))}
              disabled={activeIndex === 0}
              aria-label="Previous project"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="proj-nav-counter">
              {String(activeIndex + 1).padStart(2, "0")}{" "}
              <span className="proj-nav-sep">/</span>{" "}
              {String(projects.length).padStart(2, "0")}
            </span>
            <button
              className="proj-nav-btn"
              onClick={() =>
                setActiveIndex((p) => Math.min(p + 1, projects.length - 1))
              }
              disabled={activeIndex === projects.length - 1}
              aria-label="Next project"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Progress dots ── */}
        <ProgressDots
          total={projects.length}
          active={activeIndex}
          onSelect={setActiveIndex}
        />
      </div>
    </section>
  );
}
