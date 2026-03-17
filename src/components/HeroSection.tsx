"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import AvatarModel, { setGlobalMouse, setScrollRotY } from "./AvatarModel";
import HeroBackground from "./HeroBackground";

const phrases = ["immersive experiences", "beautiful interfaces", "performant solutions"];

// Spring config — high damping, no bounce, cinematic feel
const SP = { stiffness: 60, damping: 24, mass: 1 };

export default function HeroSection() {
  // ─── Mobile detection — CSS can't override Framer Motion inline styles ──────
  const [isMobile, setIsMobile] = useState(false);
  // modelTargetX: how far to shift hero-right to the left side of the screen.
  // Hero-right starts in the right grid column (≈75% from left).
  // Left column center ≈ 25% from left → shift needed ≈ -50vw.
  const [modelTargetX, setModelTargetX] = useState(-700);
  useEffect(() => {
    const compute = () => {
      setIsMobile(window.innerWidth <= 768);
      // Shift by ~50% of viewport so model lands in the left half
      setModelTargetX(-(window.innerWidth * 0.50));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // ─── Typing effect ────────────────────────────────────────────────────────
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;
    if (isDeleting) {
      if (text === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        timeout = setTimeout(() => { }, 500);
      } else {
        timeout = setTimeout(() => setText(currentPhrase.substring(0, text.length - 1)), 50);
      }
    } else {
      if (text === currentPhrase) {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      } else {
        timeout = setTimeout(() => setText(currentPhrase.substring(0, text.length + 1)), 100);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  // ─── Cursor parallax ──────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -((e.clientY / window.innerHeight) * 2 - 1);
    setGlobalMouse(nx, ny);
  }, []);

  // ─── Scroll timeline setup ────────────────────────────────────────────────
  // scrollRootRef is attached to a 260vh tall div.
  // hero-sticky-scene inside is position:sticky top:0 — it stays visible.
  // useScroll tracks how far the tall div has scrolled through the viewport:
  //   progress 0   = tall div top at viewport top   (user at very top)
  //   progress 1   = tall div bottom at viewport top (user scrolled 260vh)
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRootRef,
    offset: ["start start", "end end"],
  });

  // PHASE 1 (0 → 25%): Hero text fades out + drifts up + blurs
  const heroOpacity = useSpring(useTransform(scrollYProgress, [0, 0.25], [1, 0]), SP);
  const heroY = useSpring(useTransform(scrollYProgress, [0, 0.25], [0, -55]), SP);
  const heroFilter = useTransform(scrollYProgress, [0, 0.25], ["blur(0px)", "blur(8px)"]);

  // Socials + scroll-hint fade out with text
  const uiOpacity = useSpring(useTransform(scrollYProgress, [0, 0.20], [1, 0]), SP);

  // PHASE 2 (26 → 68%): Model glides to LEFT side + rotates to FACE RIGHT (toward About text)
  // modelTargetX shifts by ~50vw so model lands in the left half of the viewport.
  // +0.8 rad = ~46° positive Y rotation = model's face turns toward the right (About text side).
  const modelX = useSpring(useTransform(scrollYProgress, [0.26, 0.68], [0, modelTargetX]), SP);
  // Scale up to 1.25 so the model is larger *only* in the About section
  const modelScale = useSpring(useTransform(scrollYProgress, [0.26, 0.68], [1, 1.25]), SP);
  const modelRotY = useSpring(useTransform(scrollYProgress, [0.26, 0.68], [0, 0.9]), SP);

  // FRAME TRANSITION (26 → 50%): Remove the box, glow, and badges so the model stands freely
  const frameBorderColor = useTransform(scrollYProgress, [0.26, 0.50], ["rgba(255, 255, 255, 0.07)", "rgba(255, 255, 255, 0)"]);
  const frameBg = useTransform(scrollYProgress, [0.26, 0.50], ["rgba(255, 255, 255, 0.015)", "rgba(255, 255, 255, 0)"]);
  const frameBlur = useTransform(scrollYProgress, [0.26, 0.50], ["blur(0.5px)", "blur(0px)"]);
  const decorateOpacity = useTransform(scrollYProgress, [0.26, 0.50], [1, 0]); // Fades out hero badges/glow
  // About-phase badges fade IN during Phase 3
  const aboutBadgeOpacity = useSpring(useTransform(scrollYProgress, [0.63, 0.82], [0, 1]), SP);

  const frameStyle = {
    borderColor: frameBorderColor,
    background: frameBg,
    backdropFilter: frameBlur,
    WebkitBackdropFilter: frameBlur,
  };

  // Bridge: push R3F rotation from a MotionValue — zero React re-renders
  useMotionValueEvent(modelRotY, "change", (v) => setScrollRotY(v));

  // PHASE 3 (63 → 85%): About overlay slides in from right
  const aboutOpacity = useSpring(useTransform(scrollYProgress, [0.63, 0.85], [0, 1]), SP);
  // Use positive px slide-in so it comes FROM right
  const aboutXRaw = useTransform(scrollYProgress, [0.63, 0.85], [120, 0]);
  const aboutX = useSpring(aboutXRaw, SP);
  // Disable pointer-events when essentially invisible
  const aboutPE = useTransform(aboutOpacity, (v) => (v > 0.05 ? "auto" : "none"));

  return (
    // SCROLL ROOT — 260vh tall. Inner sticky scene stays at top: 0.
    <div ref={scrollRootRef} className="hero-scroll-root">

      {/* STICKY SCENE — 100vh, pinned to viewport while user scrolls the root */}
      <div className="hero-sticky-scene" onMouseMove={handleMouseMove as any}>

        {/* Interactive canvas background — orbs, cursor glow, dot grid.
            Uses heroOpacity so it fades out with the text in Phase 1. */}
        <HeroBackground opacity={heroOpacity} />

        {/* ══ EXISTING HERO — untouched structure, classes, entrance animations ══
            Only additive: style= scroll motion values on outer containers.    */}
        <section className="hero">

          {/* hero-left: was plain div, now motion.div so we can bind opacity/y/filter.
              All children, classes, entrance animations exactly the same.     */}
          <motion.div
            className="hero-left"
            style={{ opacity: heroOpacity, y: heroY, filter: heroFilter }}
          >
            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="eyebrow-line"></div>
              <span className="eyebrow-text">Available for work</span>
            </motion.div>

            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <span className="line1">Hi, I&apos;m</span>
              <span className="line2">Muneeb Aamir</span>
            </motion.h1>

            <motion.p
              className="hero-role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              I build &nbsp;<span className="typed-text">{text}</span><span className="cursor"></span>
            </motion.p>

            <motion.p
              className="hero-desc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              A passionate developer crafting immersive digital experiences. I turn ideas into pixel-perfect, performant products that people love to use.
            </motion.p>

            <motion.div
              className="skill-chips"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <span className="chip">React</span>
              <span className="chip">Three.js</span>
              <span className="chip">Node.js</span>
              <span className="chip">Figma</span>
              <span className="chip">TypeScript</span>
              <span className="chip">WebGL</span>
            </motion.div>

            <motion.div
              className="cta-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
            >
              <a href="#" className="btn btn-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                View Projects
              </a>
              <a href="#" className="btn btn-ghost">Download CV</a>
            </motion.div>
          </motion.div>

          {/* hero-right: not rendered at all on mobile — isMobile check prevents
              Framer Motion inline styles from overriding CSS display:none       */}
          {!isMobile && (
            <motion.div
              className="hero-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{ x: modelX, scale: modelScale }}
            >
              <div className="model-frame">
                {/* Glow ring — fades out with Hero badges */}
                <motion.div className="glow-ring" style={{ opacity: decorateOpacity }}></motion.div>

                {/* HERO badges — fade out as model moves left */}
                <motion.div className="badge b1" style={{ opacity: decorateOpacity }}><div className="badge-dot green"></div>Open to opportunities</motion.div>
                <motion.div className="badge b2" style={{ opacity: decorateOpacity }}><div className="badge-dot purple"></div>3+ Years Experience</motion.div>
                <motion.div className="badge b3" style={{ opacity: decorateOpacity }}><div className="badge-dot pink"></div>20+ Projects</motion.div>

                {/* ABOUT badges — different positions (ab1/ab2/ab3) so they don't stack on Hero badges */}
                <motion.div className="badge ab1" style={{ opacity: aboutBadgeOpacity }}><div className="badge-dot green"></div>Full Stack Dev</motion.div>
                <motion.div className="badge ab2" style={{ opacity: aboutBadgeOpacity }}><div className="badge-dot purple"></div>UI/UX Focused</motion.div>
                <motion.div className="badge ab3" style={{ opacity: aboutBadgeOpacity }}><div className="badge-dot pink"></div>Problem Solver</motion.div>

                <AvatarModel wrapStyle={frameStyle} />
              </div>
              <div className="model-hint">Let's discuss your ideas</div>
            </motion.div>
          )}

          {/* Socials — fade out with hero text via uiOpacity */}
          <motion.div
            className="socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            style={{ opacity: uiOpacity }}
          >
            <a href="#" className="social-link" title="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
            </a>
            <a href="#" className="social-link" title="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="#" className="social-link" title="Twitter/X">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63z" /></svg>
            </a>
          </motion.div>

          {/* Scroll hint — vanishes early */}
          <motion.div
            className="scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.4 }}
            style={{ opacity: uiOpacity }}
          >
            <div className="scroll-mouse"><div className="scroll-dot"></div></div>
            <span className="scroll-label">Scroll</span>
          </motion.div>
        </section>

        {/* ══ ABOUT OVERLAY ══════════════════════════════════════════════════
            Absolutely positioned on top of the sticky scene.
            Slides in from the RIGHT during Phase 3 (63-85%).
            opacity:0 initially so it never blocks hero interactions.     */}
        <motion.div
          className="about-overlay"
          style={{ opacity: aboutOpacity, x: aboutX }}
        >
          <div className="about-panel">
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>
              <div className="eyebrow-line" />
              <span className="eyebrow-text">About Me</span>
            </div>

            <h2 className="about-panel-heading">
              Crafting digital<br />
              <span className="about-panel-gradient">experiences</span> that matter
            </h2>

            <p className="about-panel-desc">
              I&apos;m a full-stack developer and creative technologist with 3+ years of experience
              building immersive, production-ready applications. I specialise in the intersection
              of design and engineering — beautiful interfaces, clean code.
            </p>

            <div className="about-panel-stats">
              <div className="stat-card">
                <span className="stat-number">3+</span>
                <span className="stat-label">Years Exp.</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">20+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">100%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </div>

            <div className="about-panel-chips">
              {["React", "Three.js", "WebGL", "Node.js", "TypeScript", "Figma"].map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
