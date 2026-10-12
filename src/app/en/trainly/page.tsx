import type { Metadata } from "next";
import { TrainlyDossier } from "@/components/TrainlyDossier";

export const metadata: Metadata = {
  title: "Trainly — learning validation system",
  description: "Trainly product case study: operational knowledge, structured learning and conversational competency validation. Product flow, frontend and AI integration.",
  alternates: { canonical: "https://tomas-garbarino.vercel.app/en/trainly" },
  openGraph: {
    title: "Trainly — From documents to evidence of competence",
    description: "A product engineering case by Tomás Garbarino. Learning, evaluation and improvement in one connected system.",
    type: "article",
  },
};

export default function TrainlyPage() {
  return <TrainlyDossier />;
}
