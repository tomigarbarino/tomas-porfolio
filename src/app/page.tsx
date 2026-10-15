import { Observatory } from "@/components/Observatory";
import { ProductWork } from "@/components/ProductWork";
import { OriginStory } from "@/components/OriginStory";
import { MotionPreference } from "@/components/MotionPreference";
import { AmbientMotion } from "@/components/AmbientMotion";
import { PeelSticker } from "@/components/PeelSticker";
import { ScrollMotion } from "@/components/ScrollMotion";
import { CVDownloadLink } from "@/components/CVDownloadLink";
import { StructuredData } from "@/components/StructuredData";
import { profileStructuredData } from "@/lib/seo";
import "./portfolio-art-direction.css";

export default function Home() {
  return (
    <>
    <StructuredData data={profileStructuredData} />
    <MotionPreference>
      <AmbientMotion />
      <ScrollMotion />
      <a className="skip-link" href="#work">Skip to case studies</a>
      <main id="main">
        <div className="portfolio-backdrop" aria-hidden="true" />
        <Observatory />
        <OriginStory />
        <ProductWork />
        <section className="contact-section" data-art-direction="collage" data-drag-boundary id="contact" aria-labelledby="contact-title">
          <div className="contact-label"><p className="eyebrow">NEXT / BUILD SOMETHING USEFUL</p><a href="#top">Back to top ↑</a></div>
          <h2 id="contact-title" data-scroll-depth="-22">A real problem?<br /><span>Let’s work on it.</span></h2>
          <a className="contact-email" href="mailto:tomasgarbarino.dev@gmail.com">tomasgarbarino.dev@gmail.com ↗</a>
          <p className="contact-fit">Open to Product Engineer and Forward Deployed Engineer opportunities with teams building useful AI products.</p>
          <CVDownloadLink className="contact-cv" ariaLabel="Download CV · English PDF">Download CV <span>· English PDF</span> <span aria-hidden="true">↓</span></CVDownloadLink>
          <aside className="contact-play" data-scroll-depth="-32" aria-label="Developer sticker"><PeelSticker art="commit" title="One more commit." fact="A useful first question: what should the product help someone do?" tone="pink" /></aside>
          <div className="contact-bottom"><div id="profile"><p>TOMÁS GARBARINO</p><p className="muted">Product Engineer / Applied AI</p></div><nav aria-label="Social profiles"><a href="https://www.linkedin.com/in/tomas-garbarino/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/tomigarbarino" target="_blank" rel="noreferrer">GitHub ↗</a></nav><span className="contact-signature" aria-hidden="true">TG_</span></div>
        </section>
      </main>
    </MotionPreference>
    </>
  );
}
