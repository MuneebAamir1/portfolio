import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import "./sections.css";
import "./polish.css";

/* ─── Font loading via next/font (zero render-blocking) ──────────────────── */
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: true,
});

/* ═══════════════════════════════════════════════════════════════════════════
   SEO CONFIGURATION
   All meta tags are injected via Next.js Metadata API — zero client JS.
   ═══════════════════════════════════════════════════════════════════════════ */

const SITE_URL = "https://muneebaamir.dev";

export const metadata: Metadata = {
  /* ── Primary Meta ───────────────────────────────────────────────────────── */
  title: "Full Stack Developer & Creative Technologist | Muneeb Aamir",
  description: "Muneeb Aamir — Full Stack Developer specializing in React, Next.js & Node.js. Building fast, modern web experiences. Available for freelance & full-time roles.",
  keywords: [
    "full stack developer",
    "React Next.js developer",
    "frontend developer Pakistan",
    "hire web developer",
    "Muneeb Aamir portfolio",
  ],
  authors: [{ name: "Muneeb Aamir" }],
  creator: "Muneeb Aamir",
  publisher: "Muneeb Aamir",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/` },
  metadataBase: new URL(SITE_URL),

  /* ── Open Graph / Facebook ──────────────────────────────────────────────── */
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    title: "Muneeb Aamir — Full Stack Developer",
    description: "I build fast, accessible, and visually sharp web apps using React, Next.js, and Node.js. Check out my projects and let's work together.",
    siteName: "Muneeb Aamir",
    locale: "en_US",
    images: [
      {
        url: "https://muneebaamir.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Muneeb Aamir — Portfolio",
      },
    ],
  },

  /* ── Twitter Card ───────────────────────────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "Muneeb Aamir — Full Stack Developer",
    description: "React · Next.js · Node.js developer. I craft fast, modern web experiences. Explore my work and get in touch.",
    site: "@muneebaamir",
    creator: "@muneebaamir",
    images: ["https://muneebaamir.dev/og-image.png"],
  },

  /* ── Technical Meta ─────────────────────────────────────────────────────── */
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "theme-color": "#0f0f0f",
    "revisit-after": "7 days",
    "content-language": "en",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        {/* ── Structured Data — JSON-LD ──────────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muneeb Aamir",
              url: SITE_URL,
              image: "https://muneebaamir.dev/apple-touch-icon.png",
              telephone: "+923360465208",
              jobTitle: "Full Stack Developer",
              description: "Personal portfolio of Muneeb Aamir, a Full Stack Developer building modern web applications with React, Next.js, TypeScript, and Node.js.",
              sameAs: [
                "https://github.com/MuneebAamir1",
                "https://linkedin.com/in/muneeb-aamir",
                "https://twitter.com/muneebaamir",
              ],
            }),
          }}
        />


      </head>
      <body>
        {/* ── Skip-to-content link (accessibility) ──────────────────────── */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
