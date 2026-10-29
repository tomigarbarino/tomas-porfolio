import { ProductEngineeringProfile } from "@/components/ProductEngineeringProfile";
import { productEngineeringProfile } from "@/content/product-engineering-profile";
import { contentPageMetadata } from "@/lib/seo";

const copy = productEngineeringProfile.en;
export const metadata = contentPageMetadata({ path: "/product-engineering", title: `${copy.title} | Tomás Garbarino`, description: copy.description, language: "en" });
export default function Page() { return <ProductEngineeringProfile language="en" />; }
