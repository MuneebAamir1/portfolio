import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muneeb Aamir",
  description: "A passionate developer crafting immersive digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
