"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

const menuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.35, ease: "easeInOut" as const },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.38, ease: "easeInOut" as const },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -12 },
  open: { opacity: 1, x: 0 },
};
// per-item transition applied via `transition` prop directly on the element

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar" style={{ overflow: "visible" }}>
      <div className="navbar-logo">Muneeb Aamir</div>

      {/* Desktop links — hidden on mobile via CSS media query */}
      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="nav-link">{l.label}</Link>
          </li>
        ))}
        <li>
          <Link href="#start" className="nav-cta">Get Started</Link>
        </li>
      </ul>

      {/* Hamburger */}
      <button
        className="nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        style={{ zIndex: 200, position: "relative" }}
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.25 }}
        />
        <motion.span
          animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.25 }}
        />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            key="mobile-menu"
            className="mobile-nav-links"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
              padding: "1.2rem 2rem 1.6rem",
              background: "rgba(4, 4, 12, 0.97)",
              backdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              overflow: "hidden",
            }}
          >
            {links.map((l, i) => (
              <motion.li key={l.href} variants={itemVariants} transition={{ delay: i * 0.06, duration: 0.25, ease: "easeOut" as const }}>
                <Link
                  href={l.href}
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                  style={{ display: "block", padding: "0.65rem 0", fontSize: "1rem" }}
                >
                  {l.label}
                </Link>
              </motion.li>
            ))}
            <motion.li variants={itemVariants} transition={{ delay: links.length * 0.06, duration: 0.25, ease: "easeOut" as const }} style={{ marginTop: "0.8rem" }}>
              <Link
                href="#start"
                className="nav-cta"
                onClick={() => setIsOpen(false)}
                style={{ display: "inline-block" }}
              >
                Get Started
              </Link>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
