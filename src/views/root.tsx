import type { Metadata, Viewport } from "next";
import { MissionTrail } from "@/components/MissionTrail";
import localFont from "next/font/local";
import { PersonalCursor } from "@/components/PersonalCursor";
import { CursorInkTrail } from "@/components/CursorInkTrail";
import { CaseStudyPreviewProvider } from "@/components/CaseStudyDirectory";
import { HOME_DESCRIPTION, HOME_PATH, SITE_NAME, SITE_URL } from "@/lib/seo";
import "@/app/globals.css";
import "@/i18n/localized.css";
import { languageAlternates } from "@/i18n/routes";

const display = localFont({ src: "../../public/fonts/BarlowCondensed-Black.ttf", variable: "--font-display", weight: "900", display: "swap" });
const mono = localFont({ src: "../../public/fonts/IBMPlexMono-Regular.ttf", variable: "--font-mono", weight: "400", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: HOME_PATH, languages: languageAlternates(HOME_PATH) },
  title: {
    default: "Tomás Garbarino | Product Engineer / Applied AI",
    template: "%s | Tomás Garbarino",
  },
  description: HOME_DESCRIPTION,
  authors: [{ name: "Tomás Garbarino" }],
  openGraph: {
    url: `${SITE_URL}${HOME_PATH}`,
    siteName: SITE_NAME,
    title: "Tomás Garbarino | Product Engineer / Applied AI",
    description:
      "Real problems. Working systems. Product engineering, frontend and AI integration.",
    type: "website",
    images: [{ url: "/media/hero-ascii.png", width: 1152, height: 648, alt: "Tomás Garbarino — Observatory portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tomás Garbarino | Product Engineer / Applied AI",
    description: HOME_DESCRIPTION,
    images: [{ url: "/media/hero-ascii.png", alt: "Tomás Garbarino — Observatory portfolio" }],
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
      <body className={`${display.variable} ${mono.variable}`}><PersonalCursor /><CursorInkTrail /><CaseStudyPreviewProvider>{children}</CaseStudyPreviewProvider><MissionTrail /></body>
    </html>
  );
}
