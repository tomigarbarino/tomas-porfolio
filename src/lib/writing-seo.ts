import type { Metadata } from "next";
import { PERSON_ID, SITE_NAME, SITE_URL } from "./seo";
import { JEV_PUBLICATION } from "./publications";

export function writingMetadata(article: boolean): Metadata {
  const path = article ? "/writing/jev" : "/writing";
  const title = article ? "How JEV decides — research and human review" : "Writing & Research";
  const description = article ? "Read the complete JEV study by Tomás Garbarino: methods, results, 7 figures, 8 tables, references and appendices, with the original PDF available to download." : "Research and writing by Tomás Garbarino on product engineering, AI evaluation and decisions people can inspect.";
  return { title, description, alternates: { canonical: `${SITE_URL}${path}` }, openGraph: { title, description, url: `${SITE_URL}${path}`, siteName: SITE_NAME, type: article ? "article" : "website", images: [{ url: "/media/hero-ascii.png", width: 1152, height: 648, alt: "Tomás Garbarino — Writing & Research" }] }, twitter: { card: "summary_large_image", title, description, images: ["/media/hero-ascii.png"] } };
}

export function writingStructuredData(article: boolean) {
  const url = `${SITE_URL}${article ? "/writing/jev" : "/writing"}`;
  const author = { "@type": "Person", "@id": PERSON_ID, name: JEV_PUBLICATION.author, url: SITE_URL };
  return { "@context": "https://schema.org", "@type": article ? "Article" : "CollectionPage", url, name: article ? "How JEV decides in Agora — complete study and reading notes" : "Writing & Research", inLanguage: article ? ["es", "en"] : "en", author, isPartOf: { "@type": "WebSite", url: SITE_URL, name: SITE_NAME }, ...(article ? { encoding: { "@type": "MediaObject", contentUrl: `${SITE_URL}/documents/jev-agora-research.pdf`, encodingFormat: "application/pdf", inLanguage: "es" }, hasPart: { "@type": "CreativeWork", name: JEV_PUBLICATION.title, url: `${SITE_URL}${JEV_PUBLICATION.documentUrl}`, inLanguage: "es", datePublished: JEV_PUBLICATION.publishedAt, author } } : { hasPart: { "@type": "Article", url: `${SITE_URL}/writing/jev`, name: "How JEV decides in Agora" } }) };
}
