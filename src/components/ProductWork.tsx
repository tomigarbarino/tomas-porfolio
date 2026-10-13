import Link from "next/link";
import { AgoraCase } from "./AgoraCase";
import { ArtifactDrag } from "./ArtifactDrag";
import { PeelSticker } from "./PeelSticker";
import { QuickProfileButton } from "./QuickProfileButton";
import { CaseStudyDirectory } from "./CaseStudyDirectory";
import { trainlyCase } from "@/data/portfolio";
import "./product-work.css";

export function ProductWork() {
  return (
    <section id="work" className="pw" aria-labelledby="work-title">
      <header className="pw-work-header">
        <div className="pw-work-topline">
          <p className="pw-detail-label">Two products / Flock I+D</p>
          <nav className="pw-direct" aria-label="Profile and contact">
            <QuickProfileButton />
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <h2 id="work-title">Case studies.</h2>
        <p className="pw-work-deck">A decision in recruiting. A learning experience built around understanding.</p>
      </header>
      <CaseStudyDirectory />
      <AgoraCase />
      <div className="pw-reading">
        <article id="trainly" className="pw-case pw-case--trainly" data-scroll-depth="-20" data-drag-boundary aria-labelledby="trainly-title">
          <header className="pw-case-header" data-scroll-depth="10">
            <div className="pw-case-index"><span>02</span><p>Trainly / Product case</p></div>
            <div>
              <p className="pw-case-kicker">{trainlyCase.category}</p>
              <h3 id="trainly-title">{trainlyCase.title}</h3>
              <div className="pw-case-meta"><span className="pw-status"><i aria-hidden="true" />{trainlyCase.status}</span></div>
            </div>
          </header>
          <div className="pw-case-content">
            <aside className="case-play case-play--trainly" aria-label="Trainly developer sticker"><PeelSticker art="human" title="Human in the loop." fact="Finishing a course is a milestone. Explaining and applying the knowledge is the question this product explores." tone="lime" /></aside>
            <div className="pw-problem-grid">
              <section data-drag-frame aria-labelledby="trainly-problem">
                <ArtifactDrag label="Move the Trainly problem card" />
                <p className="pw-detail-label">The problem</p>
                <h4 id="trainly-problem">{trainlyCase.problem.title}</h4>
                <p>{trainlyCase.problem.body}</p>
              </section>
              <section data-drag-frame aria-labelledby="trainly-contribution">
                <ArtifactDrag label="Move the Trainly contribution card" />
                <p className="pw-detail-label">My contribution</p>
                <h4 id="trainly-contribution">Connect learning and conversation.</h4>
                <p>I work on the learning journey and frontend, connecting structured company knowledge, conversational assessment and manager visibility with the AI integration.</p>
              </section>
            </div>
            <section className="pw-evidence" data-drag-frame aria-labelledby="trainly-evidence">
              <ArtifactDrag label="Move the Trainly evidence card" />
              <div><p className="pw-detail-label">Current state</p><h4 id="trainly-evidence">{trainlyCase.statusHeadline}</h4></div>
              <div><p>Clients use Trainly, and the product continues to grow. Explore the implemented flow, interface and architecture in the full case.</p></div>
            </section>
            <div className="pw-case-actions"><Link className="pw-case-cta" href={trainlyCase.href} prefetch={true}>Read the Trainly case <span aria-hidden="true">→</span></Link><a className="pw-text-link" href="#contact">Let’s talk <span aria-hidden="true">↓</span></a></div>
          </div>
        </article>
      </div>
    </section>
  );
}
