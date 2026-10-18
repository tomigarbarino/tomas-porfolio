import type { Metadata } from "next";
import { languageAlternates } from "@/i18n/routes";
import { notFound } from "next/navigation";
import figures from "@/content/jev-figure-style.json";
import study from "@/content/jev-study.json";
import { JevFigureViewer } from "@/components/JevFigureViewer";

type StudyBlock = { type: string; number?: number; caption?: string; src?: string };

export async function generateMetadata({ params }: { params: Promise<{ number: string }> }): Promise<Metadata> {
  const { number } = await params;
  const path = `/writing/jev/figures/${number}`;
  return {
  alternates: { canonical: path, languages: languageAlternates(path) },
  title: "JEV · Vector figure viewer | Tomás Garbarino",
  description: "Explore the JEV research figures at full vector resolution.",
  robots: { index: false, follow: true },
  };
}
export const dynamicParams = false;
export function generateStaticParams() {
  return figures.figures.map(figure => ({ number: String(figure.number) }));
}

export default async function FigurePage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const figure = figures.figures.find(item => String(item.number) === number);
  const original = study.sections.flatMap<StudyBlock>(section => section.blocks).find(block => block.type === "figure" && block.number === figure?.number);
  if (!figure || !original || original.type !== "figure" || !original.caption || !original.src) notFound();
  return <JevFigureViewer figure={{ number: figure.number, src: figure.src, width: figure.width, height: figure.height, mode: figure.mode }} caption={original.caption} original={original.src} />;
}
