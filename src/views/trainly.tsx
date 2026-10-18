import { TrainlyDossier } from "@/components/TrainlyDossier";
import { StructuredData } from "@/components/StructuredData";
import { caseStudyMetadata, caseStudyStructuredData } from "@/lib/seo";

export const metadata = caseStudyMetadata("trainly");

export default function TrainlyPage() {
  return <><StructuredData data={caseStudyStructuredData("trainly")} /><TrainlyDossier /></>;
}
