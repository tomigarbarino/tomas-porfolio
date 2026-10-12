import Link from "next/link";
import "./agora-case.css";
import { ArtifactDrag } from "./ArtifactDrag";
import { AgoraFlow } from "./AgoraFlow";

export function AgoraCase() {
  return (
    <section id="agora" className="agora-case agora-preview" aria-labelledby="agora-title">
      <div className="agora-case__inner" data-drag-boundary>
        <header className="agora-case__header" data-scroll-depth="14">
          <span className="agora-case__registration" aria-hidden="true" />
          <div className="agora-case__index">
            <span aria-hidden="true">03</span>
            <p className="agora-case__brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/agora-logo.svg" alt="Agora" width="126" height="37" />
              <span>Flock I+D / Product case</span>
            </p>
          </div>
          <div className="agora-case__intro" data-drag-frame>
            <ArtifactDrag label="Move the Agora introduction" />
            <p className="agora-case__kicker">Product ownership · Applied AI</p>
            <h2 id="agora-title">Hiring decisions<br />need context.</h2>
            <p className="agora-case__summary">Agora connects role requirements, CV evidence and technical interviews with the recruiter workflow. At Flock I+D, I work as its Product Owner and take part in hands-on AI implementation.</p>
            <div className="agora-case__meta"><span>My role / Product Owner</span><span className="agora-case__status"><i aria-hidden="true" />Ongoing product work</span></div>
            <p className="agora-case__scope">Discovery → priorities → architecture → candidate experience → AI implementation.</p>
            <Link className="agora-preview__link" href="/en/agora" prefetch={false}>Open the Agora case <span aria-hidden="true">↗</span></Link>
          </div>
        </header>
        <div className="agora-case__content">
          <div className="agora-preview__decision" data-scroll-depth="-16">
            <p className="agora-case__label">Inside the case / a real decision</p>
            <h3 id="agora-decision-title">Missing requirements.<br />An automatic rejection.</h3>
            <p>A search without structured skills became a 0% match and an automatic rejection. The education catalog also missed English degree names. I helped define a bounded fix: human review for searches with no structured skills and an expanded catalog, while the structural search-creation work stayed on the roadmap.</p>
            <Link href="/en/agora#decision" prefetch={false}>Follow the diagnosis, trade-offs and team-reported check <span aria-hidden="true">→</span></Link>
          </div>
          <AgoraFlow />
          <footer className="agora-case__footer">
            <div><p className="agora-case__label">The full case</p><p className="agora-case__footer-status">Product. Decision. Evidence.</p></div>
            <Link href="/en/agora" prefetch={false}>Explore Agora <span aria-hidden="true">→</span></Link>
          </footer>
        </div>
      </div>
    </section>
  );
}
