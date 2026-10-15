import Link from "next/link";
import { ArtifactDrag } from "./ArtifactDrag";
import "./agora-case.css";

const decision = [
  {
    label: "01 / The problem",
    title: "Missing context. An automatic rejection.",
    body: "A trainee search with no structured skills produced a 0% match. An education catalog also missed English degree names. A candidate was rejected for the wrong reasons.",
  },
  {
    label: "02 / My contribution",
    title: "Review, before rejection.",
    body: "I helped diagnose the gaps and define a bounded fix: human review for searches with no structured skills and an expanded education catalog. The structural search-creation work stayed on the roadmap.",
  },
  {
    label: "03 / Team-reported check",
    title: "One decision changed. Scores stayed the same.",
    body: "The pre-release replay changed one decision and no scores. After release, the candidate was in review, the education criterion was recognized and a control search was unchanged.",
  },
] as const;

export function AgoraCase() {
  return (
    <section id="agora" className="agora-case agora-preview" aria-labelledby="agora-title">
      <div className="agora-case__inner" data-drag-boundary>
        <header className="agora-case__header" data-scroll-depth="14">
          <span className="agora-case__registration" aria-hidden="true" />
          <div className="agora-case__index">
            <span aria-hidden="true">01</span>
            <p className="agora-case__brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/agora-logo.svg" alt="Agora" width="126" height="37" />
              <span>Flock I+D / Product case</span>
            </p>
          </div>
          <div className="agora-case__intro" data-drag-frame>
            <ArtifactDrag label="Move the Agora introduction" />
            <p className="agora-case__kicker">Product ownership · Applied AI</p>
            <h3 id="agora-title" className="agora-preview__title">Hiring decisions<br />need context.</h3>
            <p className="agora-case__summary">Agora connects role requirements, CV evidence and technical interviews with the recruiter workflow.</p>
            <div className="agora-case__meta"><span>My role / Product Owner + AI implementation</span><span className="agora-case__status"><i aria-hidden="true" />Live with clients · Growing</span></div>
          </div>
        </header>
        <div className="agora-case__content">
          <div className="agora-preview__decision" role="group" aria-labelledby="agora-decision-title">
            <p id="agora-decision-title" className="agora-case__label">Inside the case / a real decision</p>
            <div className="agora-preview__cards">
              {decision.map((step, index) => (
                <article key={step.label} data-drag-frame aria-labelledby={"agora-preview-step-" + index}>
                  <ArtifactDrag label={"Move the Agora " + (index === 0 ? "problem" : index === 1 ? "contribution" : "validation") + " card"} />
                  <p className="agora-preview__step-label">{step.label}</p>
                  <h4 id={"agora-preview-step-" + index}>{step.title}</h4>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="agora-preview__actions">
            <Link className="agora-preview__link" href="/en/agora" prefetch={true}>Read the Agora case <span aria-hidden="true">→</span></Link>
            <a href="#trainly">Next / Trainly <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
