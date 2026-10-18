import { AgoraDossier } from "@/components/AgoraDossier";
import { StructuredData } from "@/components/StructuredData";
import { caseStudyMetadata, caseStudyStructuredData } from "@/lib/seo";

export const metadata = caseStudyMetadata("agora");

export default function AgoraPage() {
  return <><StructuredData data={caseStudyStructuredData("agora")} /><AgoraDossier /></>;
}
