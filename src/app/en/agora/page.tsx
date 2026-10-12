import type { Metadata } from "next";
import { AgoraDossier } from "@/components/AgoraDossier";

export const metadata: Metadata = {
  title: "Agora — product ownership and applied AI",
  description: "Agora case study by Tomás Garbarino at Flock I+D: recruiting workflows, candidate experience and a real decision to route missing requirements to human review.",
  alternates: { canonical: "https://tomas-garbarino.vercel.app/en/agora" },
  openGraph: {
    title: "Agora — Hiring decisions need context",
    description: "Product ownership, customer discovery and hands-on AI implementation. A recruiting case by Tomás Garbarino.",
    type: "article",
    images: [{ url: "/media/agora-candidate-upload.png", width: 1440, height: 900, alt: "Agora candidate upload — interface reference" }],
  },
};

export default function AgoraPage() {
  return <AgoraDossier />;
}
