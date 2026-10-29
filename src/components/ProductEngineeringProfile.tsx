import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "./SiteHeader";
import { MotionPreference } from "./MotionPreference";
import { StructuredData } from "./StructuredData";
import { productEngineeringProfile } from "@/content/product-engineering-profile";
import { PERSON_ID, SITE_URL } from "@/lib/seo";
import "./product-engineering-profile.css";

export function ProductEngineeringProfile({ language }: { language: "en" | "es" }) {
  const copy = productEngineeringProfile[language];
  const path = language === "es" ? "/es/product-engineering" : "/product-engineering";
  const images = [
    { src: "/media/agora/agora-03-evidencia-por-requisito.png", width: 1440, height: 900 },
    { src: "/media/trainly/trainly-02-plan-decision-bloqueante@2x.png", width: 2880, height: 1800 },
  ];

  return <MotionPreference>
    <StructuredData data={{
      "@context": "https://schema.org", "@type": "ProfilePage",
      "@id": `${SITE_URL}${path}#profile`, url: `${SITE_URL}${path}`,
      name: copy.title, description: copy.description, inLanguage: language,
      mainEntity: { "@type": "Person", "@id": PERSON_ID, name: "Tomás Garbarino", url: SITE_URL, jobTitle: "Product Engineer / Applied AI", sameAs: ["https://www.linkedin.com/in/tomas-garbarino/", "https://github.com/tomigarbarino"] },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    }} />
    <a className="skip-link" href="#profile-main">{copy.skipLabel}</a>
    <SiteHeader context="writing" backHref={language === "es" ? "/es" : "/"} backLabel={copy.backLabel} />
    <main id="profile-main" className="pe-page">
      <header className="pe-intro">
        <p className="eyebrow">{copy.identity}</p>
        <h1>{copy.title}<span aria-hidden="true">.</span></h1>
        <p className="pe-lead">{copy.lead}</p>
        <a className="pe-contact-link" href="#project">{copy.contactHeading} <span aria-hidden="true">↗</span></a>
      </header>

      <section className="pe-scope" aria-labelledby="scope-title">
        <h2 id="scope-title">{copy.scope.heading}</h2>
        <dl>{copy.scope.items.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl>
      </section>

      <section className="pe-evidence" aria-labelledby="evidence-title">
        <h2 id="evidence-title">{copy.proofHeading}</h2>
        {copy.proofCards.map((proof, index) => <article className="pe-case" key={proof.href}>
          {images[index] ? <Link className="pe-case__image" href={proof.href} aria-label={proof.linkLabel}><Image {...images[index]} alt={proof.title} sizes="(max-width: 720px) 100vw, 440px" /></Link> : <div className="pe-paper" aria-hidden="true"><span>FLOCK LABS / 2026</span><strong>JEV</strong><span>Tomás Garbarino</span></div>}
          <div className="pe-case__body"><h3>{proof.title}</h3><p>{proof.claim}</p><p className="pe-attribution">{proof.attribution}</p><p className="pe-limitation">{proof.limitation}</p><Link className="pe-case__link" href={proof.href}>{proof.linkLabel} <span aria-hidden="true">→</span></Link></div>
        </article>)}
      </section>

      <section className="pe-fit" aria-labelledby="fit-title"><h2 id="fit-title">{copy.fit.heading}</h2><p>{copy.fit.text}</p></section>
      <section className="pe-contact" id="project" aria-labelledby="project-title"><h2 id="project-title">{copy.contactHeading}</h2><p>{copy.contactPrompt.text}</p><a className="button-primary" href={copy.contactPrompt.href}>{copy.contactPrompt.label} <span aria-hidden="true">↗</span></a></section>
    </main>
  </MotionPreference>;
}
