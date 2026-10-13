import type { Metadata } from "next";
import { AgoraDossier } from "@/components/AgoraDossier";

export const metadata: Metadata = {
  title: "Agora — product ownership and applied AI",
  description: "Agora case study by Tomás Garbarino at Flock I+D: product ownership, reviewable AI decisions, real interfaces and published JEV evaluation research.",
  alternates: { canonical: "https://tomas-garbarino.vercel.app/en/agora" },
  openGraph: {
    title: "Agora — Hiring decisions need context",
    description: "Product ownership, hands-on AI implementation and published JEV evaluation research. A recruiting case by Tomás Garbarino.",
    type: "article",
    images: [{ url: "/media/agora/agora-c1-candidato-ingreso.png", width: 1440, height: 900, alt: "Agora candidate entry — actual interface with fictional demo data" }],
  },
};

export default function AgoraPage() {
  return <AgoraDossier />;
}
