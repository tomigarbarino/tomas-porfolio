import { ProductEngineeringProfile } from "@/localized/es/components/ProductEngineeringProfile";
import { productEngineeringProfile } from "@/content/product-engineering-profile";
import { contentPageMetadata } from "@/lib/seo";

const copy = productEngineeringProfile.es;
export const metadata = contentPageMetadata({ path: "/es/product-engineering", title: `${copy.title} | Tomás Garbarino`, description: copy.description, language: "es" });
export default function Page() { return <ProductEngineeringProfile language="es" />; }
