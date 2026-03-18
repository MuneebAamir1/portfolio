"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   HOW TO CONNECT EMAILJS:
   ────────────────────────
   1. Install:  npm install @emailjs/browser
   2. Go to https://www.emailjs.com/ → create a free account.
   3. Create a Service  (e.g. "Gmail") → copy the SERVICE_ID.
   4. Create a Template → use variables like {{name}}, {{email}},
      {{subject}}, {{message}}.  Copy the TEMPLATE_ID.
   5. Go to Account → copy your PUBLIC_KEY.
   6. Replace the placeholder `handleSubmit` below with:

      import emailjs from "@emailjs/browser";

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        try {
          await emailjs.send(
            "YOUR_SERVICE_ID",
            "YOUR_TEMPLATE_ID",
            {
              name: form.name,
              email: form.email,
              subject: form.subject,
              message: form.message,
            },
            "YOUR_PUBLIC_KEY"
          );
          setStatus("success");
          setForm({ name: "", email: "", subject: "", message: "" });
        } catch {
          setStatus("error");
        }
      };

   7. Map the template variables to the form field names above.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Animation config ─────────────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const slideLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  },
});

const slideRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  },
});

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: EASE },
  },
});

/* ─── Cursor spotlight ─────────────────────────────────────────────────────── */
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

/* ─── Social links ─────────────────────────────────────────────────────────── */
const socials = [
  {
    name: "GitHub",
    href: "https://github.com/MuneebAamir1",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63z" />
      </svg>
    ),
  },
];

/* ─── Component ────────────────────────────────────────────────────────────── */
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { pos, visible } = useCursorSpotlight(sectionRef);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Placeholder submit — replace with EmailJS (see comments at top)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
      return;
    }

    setStatus("sending");

    // Simulate send — replace with real EmailJS call
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }, 1200);
  };

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      {/* Cursor spotlight */}
      <div
        className="contact-spotlight"
        style={{
          left: pos.x,
          top: pos.y,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Ambient blobs */}
      <div className="contact-blob contact-blob--1" aria-hidden="true" />
      <div className="contact-blob contact-blob--2" aria-hidden="true" />

      <div className="contact-inner">
        {/* ── Left column: intro ── */}
        <motion.div
          className="contact-intro"
          variants={slideLeft(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="eyebrow">
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Get In Touch</span>
          </div>

          <h2 className="contact-heading">
            Let&apos;s Start a{" "}
            <span className="contact-heading-gradient">Conversation</span>
          </h2>

          <p className="contact-desc">
            Have a project in mind, a role to discuss, or just want to connect?
            I&apos;d love to hear from you. Drop me a message and I&apos;ll get
            back within 24 hours.
          </p>

          {/* Availability badge */}
          <div className="contact-availability">
            <div className="contact-avail-dot" />
            <span>Available for freelance & full-time opportunities</span>
          </div>

          {/* Social links */}
          <div className="contact-socials">
            {socials.map((s) => (
              <motion.a
                key={s.name}
                href={s.href}
                className="social-link"
                title={s.name}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, borderColor: "rgba(108,99,255,0.5)" }}
                transition={{ duration: 0.2 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>

          {/* Email display */}
          <div className="contact-email-display">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4L12 13 2 4" />
            </svg>
            <span>muneebaamir.dev@gmail.com</span>
          </div>
        </motion.div>

        {/* ── Right column: form card ── */}
        <motion.div
          className="contact-form-card"
          variants={slideRight(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            {/* Name */}
            <motion.div className="contact-field" variants={fadeUp(0.2)}>
              <label htmlFor="contact-name" className="contact-label">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="contact-input"
                required
              />
            </motion.div>

            {/* Email */}
            <motion.div className="contact-field" variants={fadeUp(0.27)}>
              <label htmlFor="contact-email" className="contact-label">Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="contact-input"
                required
              />
            </motion.div>

            {/* Subject */}
            <motion.div className="contact-field" variants={fadeUp(0.34)}>
              <label htmlFor="contact-subject" className="contact-label">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                className="contact-input"
              />
            </motion.div>

            {/* Message */}
            <motion.div className="contact-field" variants={fadeUp(0.41)}>
              <label htmlFor="contact-message" className="contact-label">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                className="contact-input contact-textarea"
                rows={5}
                required
              />
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp(0.48)}>
              <motion.button
                type="submit"
                className="btn btn-primary contact-submit"
                disabled={status === "sending"}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 45px rgba(108,99,255,0.5)",
                }}
                whileTap={{ scale: 0.96 }}
              >
                {status === "sending" ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Sending...
                  </>
                ) : status === "success" ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Message Sent!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send Message
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Status messages */}
            {status === "success" && (
              <motion.div
                className="contact-toast contact-toast--success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ✓ Your message has been sent successfully!
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                className="contact-toast contact-toast--error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Please fill in all required fields.
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
