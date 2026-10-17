import type { Metadata } from "next";

export const SITE_URL = "https://tomas-garbarino.vercel.app";
export const SITE_NAME = "Tomás Garbarino — Product Engineer / Applied AI";
export const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const HOME_DESCRIPTION =
  "Product Engineer / Applied AI at Flock I+D. Customer discovery, product decisions and hands-on AI for Agora and Trainly. Former Frontend Lead at Batech.";

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Tomás Garbarino",
  url: `${SITE_URL}/`,
  jobTitle: "Product Engineer / Applied AI",
  description:
    "I connect customer discovery, product decisions and hands-on AI implementation.",
  worksFor: { "@type": "Organization", name: "Flock I+D" },
  sameAs: [
    "https://www.linkedin.com/in/tomas-garbarino/",
    "https://github.com/tomigarbarino",
  ],
} as const;

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
} as const;

const cases = {
  orquestador: {
    path: "/en/orquestador",
    name: "Orquestador de entregables",
    title: "Orquestador — an original evidence-backed workflow project",
    description: "An original project by Tomás Garbarino: public-source inputs, a recorded local AI run, evidence checks, a blocked unsupported claim and a draft for human review.",
    shareTitle: "Orquestador — Your progress update, with the evidence attached",
    shareDescription: "Inspect a source-linked progress draft, download the Markdown and test the evidence check in a recorded workflow replay.",
    image: {
      url: "/media/orquestador/guided-demo.jpg", width: 1536, height: 730,
      alt: "Actual Orquestador guided demo with public source evidence and a reviewable draft",
    },
  },
  agora: {
    path: "/en/agora",
    name: "Agora",
    title: "Agora — product ownership and applied AI",
    description:
      "Agora case study by Tomás Garbarino at Flock I+D: product ownership, reviewable AI decisions, real interfaces and published JEV evaluation research.",
    shareTitle: "Agora — Hiring decisions need context",
    shareDescription:
      "Product ownership, hands-on AI implementation and published JEV evaluation research. A recruiting case by Tomás Garbarino at Flock I+D.",
    image: {
      url: "/media/agora/agora-03-evidencia-por-requisito.png",
      width: 1440,
      height: 900,
      alt: "Agora criterion evidence and human review — actual interface with fictional demo data",
    },
    citation:
      `${SITE_URL}/writing/jev`,
  },
  trainly: {
    path: "/en/trainly",
    name: "Trainly",
    title: "Trainly — learning validation system",
    description:
      "Trainly case study by Tomás Garbarino at Flock I+D: product flow, frontend and AI integration connecting structured learning and conversational assessment.",
    shareTitle: "Trainly — From documents to evidence of competence",
    shareDescription:
      "A product engineering case by Tomás Garbarino at Flock I+D. Learning, evaluation and improvement in one connected system.",
    image: {
      url: "/media/trainly/trainly-02-plan-decision-bloqueante@2x.png",
      width: 2880,
      height: 1800,
      alt: "Trainly source-linked plan and a blocking human decision — actual interface with fictional demo data",
    },
  },
} as const;

type CaseStudy = keyof typeof cases;

export function caseStudyMetadata(key: CaseStudy): Metadata {
  const item = cases[key];
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `${SITE_URL}${item.path}` },
    openGraph: {
      url: `${SITE_URL}${item.path}`,
      siteName: SITE_NAME,
      title: item.shareTitle,
      description: item.shareDescription,
      type: "article",
      images: [item.image],
    },
    twitter: {
      card: "summary_large_image",
      title: item.shareTitle,
      description: item.shareDescription,
      images: [{ url: item.image.url, alt: item.image.alt }],
    },
  };
}

export const profileStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    person,
    website,
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: HOME_DESCRIPTION,
      inLanguage: "en",
      mainEntity: { "@id": PERSON_ID },
      isPartOf: { "@id": WEBSITE_ID },
    },
  ],
} as const;

export function caseStudyStructuredData(key: CaseStudy) {
  const item = cases[key];
  const url = `${SITE_URL}${item.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      website,
      {
        // Authorship describes this case narrative, not sole product authorship.
        "@type": "CreativeWork",
        "@id": `${url}#case-study`,
        url,
        name: item.title,
        description: item.description,
        inLanguage: "en",
        author: { "@id": PERSON_ID },
        about: { "@type": "Thing", name: item.name },
        mainEntityOfPage: url,
        isPartOf: { "@id": WEBSITE_ID },
        image: `${SITE_URL}${item.image.url}`,
        ...("citation" in item ? { citation: item.citation } : {}),
      },
    ],
  } as const;
}
