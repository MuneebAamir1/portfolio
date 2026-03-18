"use client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection from "@/components/ProjectsSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        {/* Stacking wrapper — ensures all sections below the hero's
            260vh scroll-root sit ABOVE the fixed hero scene (z-index 2).
            The opaque background paints over the hero as the user scrolls past. */}
        <div style={{ position: "relative", zIndex: 5, background: "var(--bg)" }}>
          {/* Global animated background system */}
          <div className="global-bg" aria-hidden="true">
            <div className="global-bg-mesh" />
            <div className="global-depth-blob global-depth-blob--1" />
            <div className="global-depth-blob global-depth-blob--2" />
            <div className="global-depth-blob global-depth-blob--3" />
            <div className="global-noise" />
          </div>

          <ExperienceSection />
          <TechStackSection />
          <ProjectsSection />
          <CTASection />
          <ContactSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
