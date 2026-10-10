import "./agora-case.css";
import { ArtifactDrag } from "./ArtifactDrag";
import { PeelSticker } from "./PeelSticker";
import { AgoraFlow } from "./AgoraFlow";

const contributions = [
  {
    title: "Product direction",
    body: "I own product definition and prioritization, connecting customer needs with the next product decisions.",
  },
  {
    title: "Architecture + AI",
    body: "I make architecture decisions and implement AI features directly, working across the product and its agents.",
  },
  {
    title: "Customer discovery",
    body: "I take part in customer discovery and commercial conversations, bringing that context into the product work.",
  },
  {
    title: "Candidate experience",
    body: "I work on UX and UI, with particular attention to the candidate experience alongside recruiter workflows.",
  },
] as const;

const productAreas = [
  {
    label: "Recruiter workspace",
    title: "The hiring context, together.",
    body: "A backoffice for recruiters, searches and candidates, with ranking, history and a talent pool.",
  },
  {
    label: "Candidate application + agents",
    title: "An experience on both sides.",
    body: "A candidate application and automated technical interviews powered by Python and OpenAI agents.",
  },
  {
    label: "Integrations + operations",
    title: "Connected to the workflow.",
    body: "Manatal integration and bulk upload of searches support the recruiter workflow.",
  },
] as const;

const stack = ["Next.js", "Supabase", "Python", "OpenAI", "AWS Amplify", "Railway"] as const;

export function AgoraCase() {
  return (
    <section id="agora" className="agora-case" aria-labelledby="agora-title">
      <div className="agora-case__inner" data-drag-boundary>
        <header className="agora-case__header" data-scroll-depth="14">
          <span className="agora-case__registration" aria-hidden="true" />
          <div className="agora-case__index">
            <span aria-hidden="true">03</span>
            <p className="agora-case__brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/agora-logo.svg" alt="Agora" width="126" height="37" /><span>Product case</span>
            </p>
          </div>
          <div className="agora-case__intro" data-drag-frame>
            <ArtifactDrag label="Move the Agora introduction" />
            <p className="agora-case__kicker">Product ownership · Applied AI</p>
            <h2 id="agora-title">From requirement<br />to evidence.</h2>
            <p className="agora-case__summary">
              A recruiting product connecting role criteria, candidate information
              and AI interviews with the recruiter workflow.
            </p>
            <div className="agora-case__meta">
              <span>My role / Product Owner</span>
              <span className="agora-case__status"><i aria-hidden="true" />Ongoing product work</span>
            </div>
            <p className="agora-case__scope">Product priorities, customer discovery, architecture and hands-on AI implementation.</p>
          </div>
        </header>

        <div className="agora-case__content">
          <section className="agora-decision" aria-labelledby="agora-decision-title">
            <div className="agora-decision__heading">
              <p className="agora-case__label">A product decision / anonymized</p>
              <h3 id="agora-decision-title">Missing requirements should trigger review, not rejection.</h3>
              <p>A reported rejection exposed a search with no structured skills and an education catalog that missed English degree names.</p>
            </div>
            <div className="agora-decision__cards">
              <section data-drag-frame aria-labelledby="agora-decision-diagnosis">
                <ArtifactDrag label="Move the Agora diagnosis card" />
                <p className="agora-decision__label">01 / Diagnose</p>
                <h4 id="agora-decision-diagnosis">Missing context became certainty.</h4>
                <p>The search had no structured skills for the matcher to consume. That absence became a 0% match and an automatic rejection. The catalog also failed to recognize education expressed in English.</p>
              </section>
              <section data-drag-frame aria-labelledby="agora-decision-fix">
                <ArtifactDrag label="Move the Agora decision card" />
                <p className="agora-decision__label">02 / Make the bounded change</p>
                <h4 id="agora-decision-fix">Put human review before rejection.</h4>
                <p>I helped define a bounded fix: send searches with no structured skills to human review, remove them from talent-pool suggestions, and extend the education catalog to English degree names.</p>
              </section>
              <section data-drag-frame aria-labelledby="agora-decision-tradeoff">
                <ArtifactDrag label="Move the Agora trade-off card" />
                <p className="agora-decision__label">03 / Keep the next step visible</p>
                <h4 id="agora-decision-tradeoff">A guardrail now. Structure next.</h4>
                <p>Another evaluator shared the same catalog; reading the public advert would mix promotional copy with requirements. Structured search templates, imports and AI prefill remained on the roadmap.</p>
              </section>
            </div>
            <div className="agora-decision__validation">
              <p className="agora-decision__label">Team-reported validation</p>
              <p>The team replayed the calculation before release: one decision changed without changing scores. It then checked the affected case and a control search after release.</p>
              <p className="agora-decision__limit">Reported by the team; not independently verified for this portfolio. This bounded check does not measure overall matching accuracy or fairness.</p>
            </div>
          </section>
          <section className="agora-gallery" data-scroll-depth="-28" aria-labelledby="agora-design-title">
            <header className="agora-gallery__heading"><p className="agora-case__label">Inside the product</p><h3 id="agora-design-title">Designed for<br />the other side, too.</h3><p>Candidate experience / selected Figma designs.</p></header>
            <div className="agora-gallery__pieces" data-drag-boundary>
              <figure className="agora-gallery__frame agora-gallery__frame--upload" data-drag-frame>
                <ArtifactDrag label="Move the Agora CV upload design" />
                <div className="agora-gallery__bar"><span>Agora / Candidate application</span><i aria-hidden="true">↗</i></div>
                {/* Figma design evidence: an empty upload state, not a live production capture. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/agora-candidate-upload.png" alt="Agora candidate CV upload design with an empty upload area" width="1440" height="900" loading="lazy" decoding="async" />
                <figcaption>Candidate CV upload / Figma design <a href="https://www.figma.com/design/gKp8MoVlJ2vdftqeyqmyht/Agora---Design-file?node-id=4672-8410" target="_blank" rel="noreferrer">View source ↗</a></figcaption>
              </figure>
              <figure className="agora-gallery__frame agora-gallery__frame--interview" data-drag-frame>
                <ArtifactDrag label="Move the Agora interview design" />
                <div className="agora-gallery__bar"><span>Agora / AI interview</span><i aria-hidden="true">↗</i></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/agora-device-check.png" alt="Agora candidate interview device check design, before the interview starts" width="1440" height="900" loading="lazy" decoding="async" />
                <figcaption>Interview preparation / Figma design <a href="https://www.figma.com/design/gKp8MoVlJ2vdftqeyqmyht/Agora---Design-file?node-id=5822-10016" target="_blank" rel="noreferrer">View source ↗</a></figcaption>
              </figure>
            </div>
          </section>
          <div className="agora-case__problem" data-scroll-depth="-20">
            <section data-drag-frame aria-labelledby="agora-problem">
              <ArtifactDrag label="Move the Agora problem card" />
              <p className="agora-case__label">The problem</p>
              <h3 id="agora-problem">Hiring context<br />gets fragmented.</h3>
              <p>
                Role requirements, CVs, interviews and recruiter decisions are
                parts of the same process. When they live in separate places,
                the context needed to review a candidate gets fragmented.
              </p>
            </section>
            <section data-drag-frame aria-labelledby="agora-approach">
              <ArtifactDrag label="Move the Agora approach card" />
              <p className="agora-case__label">The product approach</p>
              <h3 id="agora-approach">Keep the evidence<br />with the criteria.</h3>
              <p>
                Agora connects CV matching by criterion, supporting evidence and
                automated technical interviews with the tools recruiters use
                to organize and review candidates.
              </p>
            </section>
          </div>

          <AgoraFlow />

          <section className="agora-case__contribution" data-scroll-depth="-16" aria-labelledby="agora-contribution">
            <div className="agora-case__section-heading">
              <p className="agora-case__label">My contribution</p>
              <h3 id="agora-contribution">Product decisions.<br />Hands-on AI work.</h3>
              <aside className="agora-play" aria-label="Agora developer sticker"><PeelSticker art="depends" title="It depends." fact="I work on candidate UX as well as recruiter workflows, product decisions and hands-on AI features." tone="violet" /></aside>
            </div>
            <div className="agora-case__contribution-card" data-drag-frame>
              <ArtifactDrag label="Move the Agora contribution card" />
              <dl>
                {contributions.map((item) => (
                  <div key={item.title}><dt>{item.title}</dt><dd>{item.body}</dd></div>
                ))}
              </dl>
            </div>
          </section>

          <section className="agora-case__product" data-scroll-depth="-16" aria-labelledby="agora-product">
            <div className="agora-case__section-heading">
              <p className="agora-case__label">Product scope</p>
              <h3 id="agora-product">One product.<br />Connected workflows.</h3>
            </div>
            <div className="agora-case__areas" data-drag-frame>
              <ArtifactDrag label="Move the Agora scope card" />
              {productAreas.map((area) => (
                <div key={area.label}>
                  <p className="agora-case__area-label">{area.label}</p>
                  <h4>{area.title}</h4>
                  <p>{area.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="agora-case__stack" data-scroll-depth="10" aria-labelledby="agora-stack">
            <div className="agora-case__section-heading">
              <p className="agora-case__label">Product stack</p>
              <h3 id="agora-stack">Application.<br />Agents. Infrastructure.</h3>
            </div>
            <ul>{stack.map((technology) => <li key={technology}>{technology}</li>)}</ul>
          </section>

          <footer className="agora-case__footer">
            <div><p className="agora-case__label">Current status</p><p className="agora-case__footer-status">Ongoing product work.</p></div>
            <a href="#contact">Talk through this work <span aria-hidden="true">→</span></a>
          </footer>
        </div>
      </div>
    </section>
  );
}
