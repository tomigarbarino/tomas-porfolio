import { Observatory } from "@/components/Observatory";
import { ProductWork } from "@/components/ProductWork";
import { OriginStory } from "@/components/OriginStory";
import { MotionPreference } from "@/components/MotionPreference";
import { AgoraCase } from "@/components/AgoraCase";
import { AmbientMotion } from "@/components/AmbientMotion";
import { PeelSticker } from "@/components/PeelSticker";
import { ScrollMotion } from "@/components/ScrollMotion";
import "./portfolio-art-direction.css";

export default function Home() {
  return (
    <MotionPreference>
      <AmbientMotion />
      <ScrollMotion />
      <a className="skip-link" href="#work">Skip to selected work</a>
      <main id="main">
        <div className="portfolio-backdrop" aria-hidden="true" />
        <Observatory />
        <OriginStory />
        <ProductWork />
        <AgoraCase />
        <section className="contact-section" data-art-direction="collage" data-drag-boundary id="contact" aria-labelledby="contact-title">
          <div className="contact-label"><p className="eyebrow">NEXT / BUILD SOMETHING USEFUL</p><a href="#top">Back to top ↑</a></div>
          <h2 id="contact-title" data-scroll-depth="-22">A real problem?<br /><span>Let’s work on it.</span></h2>
          <a className="contact-email" href="mailto:tomasgarbarino.dev@gmail.com">tomasgarbarino.dev@gmail.com ↗</a>
          <p className="contact-fit">I connect customer discovery, product decisions, interfaces and hands-on AI implementation.</p>
          <details className="work-annotation contact-annotation"><summary>Where I fit <span aria-hidden="true">+</span></summary><p>Product Engineer / Applied AI. Exploring product and forward deployed engineering, with a focus on customer problems and the systems that need to work.</p></details>
          <aside className="contact-play" data-scroll-depth="-32" aria-label="Developer sticker"><PeelSticker art="commit" title="One more commit." fact="From changing game files to building AI products. The habit is the same: try, learn, make it work." tone="pink" /></aside>
          <div className="contact-bottom"><div id="profile"><p>TOMÁS GARBARINO</p><p className="muted">Product Engineer / Applied AI<br />Exploring product and forward deployed engineering.</p></div><nav aria-label="Social profiles"><a href="https://www.linkedin.com/in/tomas-garbarino/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/tomigarbarino" target="_blank" rel="noreferrer">GitHub ↗</a></nav><span className="contact-signature" aria-hidden="true">TG_</span></div>
        </section>
      </main>
    </MotionPreference>
  );
}
