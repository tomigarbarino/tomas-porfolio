import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PersonalCursor } from "@/components/PersonalCursor";
import { CursorInkTrail } from "@/components/CursorInkTrail";
import { CaseStudyPreviewProvider } from "@/components/CaseStudyDirectory";
import "./globals.css";

const display = localFont({ src: "../../public/fonts/BarlowCondensed-Black.ttf", variable: "--font-display", weight: "900", display: "swap" });
const mono = localFont({ src: "../../public/fonts/IBMPlexMono-Regular.ttf", variable: "--font-mono", weight: "400", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://tomas-garbarino.vercel.app"),
  alternates: { canonical: "/" },
  title: {
    default: "Tomás Garbarino | Product Engineer / Applied AI",
    template: "%s | Tomás Garbarino",
  },
  description:
    "Product Engineer / Applied AI. Customer discovery, product decisions and hands-on AI at Agora; Trainly and frontend leadership at Batech.",
  authors: [{ name: "Tomás Garbarino" }],
  openGraph: {
    title: "Tomás Garbarino | Product Engineer / Applied AI",
    description:
      "Real problems. Working systems. Product engineering, frontend and AI integration.",
    type: "website",
    images: [{ url: "/media/hero-ascii.png", width: 1152, height: 648, alt: "Tomás Garbarino — Observatory portfolio" }],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080909",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable}`}><PersonalCursor /><CursorInkTrail /><CaseStudyPreviewProvider>{children}</CaseStudyPreviewProvider></body>
    </html>
  );
}
