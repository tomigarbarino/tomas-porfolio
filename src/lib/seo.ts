import { portfolioContent, trainlyContent } from "../i18n/content";
import type { Language } from "../contexts/LanguageContext";

export const SITE_URL = "https://tomas-garbarino.vercel.app";

export type SeoPage = "home" | "trainly";

export type SeoMetadata = {
  canonical: string;
  description: string;
  image?: string;
  language: Language;
  locale: string;
  page: SeoPage;
  pathname: string;
  title: string;
  type: "profile" | "article";
};

const PERSON_ID = `${SITE_URL}/#tomas-garbarino`;

export const getPagePath = (page: SeoPage, language: Language) => {
  if (page === "trainly") return language === "en" ? "/en/trainly" : "/trainly";
  return language === "en" ? "/en" : "/";
};

export const getLanguageFromPathname = (pathname: string): Language =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";

export const getPageFromPathname = (pathname: string): SeoPage => {
  const normalizedPathname = pathname.replace(/\/+$/, "");
  return normalizedPathname.endsWith("/trainly") ? "trainly" : "home";
};

export const getSeoMetadata = (page: SeoPage, language: Language): SeoMetadata => {
  const copy = page === "trainly" ? trainlyContent[language] : portfolioContent[language];
  const pathname = getPagePath(page, language);

  return {
    canonical: `${SITE_URL}${pathname}`,
    description: copy.description,
    image: page === "trainly" ? `${SITE_URL}/trainly/case-study/hero.png` : undefined,
    language,
    locale: language === "es" ? "es_AR" : "en_US",
    page,
    pathname,
    title: copy.title,
    type: page === "trainly" ? "article" : "profile",
  };
};

export const getStructuredData = ({ canonical, description, image, language, page, title }: SeoMetadata) => {
  const person = {
    "@id": PERSON_ID,
    "@type": "Person",
    name: "Tomás Garbarino",
    alternateName: "Tomas Garbarino",
    jobTitle: language === "es" ? "Ingeniero de Producto" : "Product Engineer",
    description,
    url: `${SITE_URL}/`,
    email: "mailto:tomasgarbarino.dev@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    },
    knowsAbout: [
      "AI product engineering",
      "Product strategy",
      "Frontend engineering",
      "AI agents",
      "Human-in-the-loop systems",
      "Rapid product validation",
    ],
    sameAs: [
      "https://www.linkedin.com/in/tomas-garbarino/",
      "https://github.com/tomigarbarino",
      "https://www.flocklabs.ar/",
    ],
  };

  if (page === "home") {
    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${canonical}#profile`,
      url: canonical,
      name: title,
      description,
      inLanguage: language === "es" ? "es-AR" : "en",
      mainEntity: person,
      hasPart: {
        "@type": "CreativeWork",
        name: "Trainly",
        url: `${SITE_URL}${getPagePath("trainly", language)}`,
        author: { "@id": PERSON_ID },
      },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#case-study`,
    url: canonical,
    name: title,
    headline: title,
    description,
    inLanguage: language === "es" ? "es-AR" : "en",
    image,
    author: person,
    about: {
      "@type": "SoftwareApplication",
      name: "Trainly",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      description,
    },
  };
};

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
};

const upsertLink = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
};

export const applySeoMetadata = (metadata: SeoMetadata) => {
  if (typeof document === "undefined") return;

  const { canonical, description, image, language, locale, page, title, type } = metadata;
  document.title = title;
  document.documentElement.lang = language === "es" ? "es-AR" : "en";

  upsertMeta('meta[name="description"]', { name: "description", content: description });
  upsertMeta('meta[name="author"]', { name: "author", content: "Tomás Garbarino" });
  upsertMeta('meta[name="robots"]', { name: "robots", content: "index, follow, max-image-preview:large" });
  upsertMeta('meta[name="language"]', { name: "language", content: language === "es" ? "Spanish (Argentina)" : "English" });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
  upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: locale });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: image ? "summary_large_image" : "summary" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });

  upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonical });
  upsertLink('link[rel="alternate"][hreflang="es-AR"]', { rel: "alternate", hreflang: "es-AR", href: `${SITE_URL}${getPagePath(page, "es")}` });
  upsertLink('link[rel="alternate"][hreflang="en"]', { rel: "alternate", hreflang: "en", href: `${SITE_URL}${getPagePath(page, "en")}` });
  upsertLink('link[rel="alternate"][hreflang="x-default"]', { rel: "alternate", hreflang: "x-default", href: `${SITE_URL}${getPagePath(page, "es")}` });

  const staleOgImage = document.head.querySelector('meta[property="og:image"]');
  const staleTwitterImage = document.head.querySelector('meta[name="twitter:image"]');
  if (image) {
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
  } else {
    staleOgImage?.remove();
    staleTwitterImage?.remove();
  }

  let structuredData = document.head.querySelector<HTMLScriptElement>('#seo-structured-data');
  if (!structuredData) {
    structuredData = document.createElement("script");
    structuredData.id = "seo-structured-data";
    structuredData.type = "application/ld+json";
    document.head.appendChild(structuredData);
  }
  structuredData.textContent = JSON.stringify(getStructuredData(metadata));
};
