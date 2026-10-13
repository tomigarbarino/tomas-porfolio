import Image from "next/image";
import { ArtifactDrag } from "./ArtifactDrag";
import "./agora-research.css";

export const JEV_PAPER_URL = "https://www.flocklabs.ar/research/como-decide-jev-en-agora-probabilidades-umbrales-y-revision-humana";

const results = [
  { id: "jev", label: "JEV", value: "80.9%", interval: "95% CI 75.0–86.4", width: "80.9%" },
  { id: "historical", label: "Previous evaluator", value: "54.1%", interval: "95% CI 47.1–60.3", width: "54.1%" },
] as const;

export function AgoraResearch() {
  return <div className="ajr">
    <div className="ajr-motion" data-scroll-depth="-12">
      <article className="ajr-window" data-drag-frame aria-labelledby="jev-study-title">
        <ArtifactDrag label="Move the JEV research window" />
        <div className="ajr-titlebar"><span>AGORA / RESEARCH FILE 01</span><span aria-hidden="true">↗</span></div>
        <div className="ajr-study">
          <p className="ad-label">Published by Tomás Garbarino / Flock Labs</p>
          <h3 id="jev-study-title">A model score.<br />A product decision.</h3>
          <p className="ajr-deck">I authored a retrospective study of JEV in Agora: how it evaluates interviews, where CV decisions diverge, and when a person should review.</p>
          <dl className="ajr-corpus" aria-label="Study dataset">
            <div><dt>Applications</dt><dd>496</dd></div>
            <div><dt>Interviews</dt><dd>48</dd></div>
            <div><dt>Questions extracted</dt><dd>221</dd></div>
          </dl>

          <div className="ajr-comparison" aria-labelledby="jev-comparison-title">
            <div className="ajr-result-heading"><h4 id="jev-comparison-title">Agreement with the<br />majority reference panel</h4><p className="ajr-delta"><strong>+26.8</strong><span>percentage points<br />vs. previous evaluator</span></p></div>
            <p className="ajr-denominator">Main comparison: 220 questions from 48 interviews.</p>
            <dl className="ajr-results">{results.map(result => <div className="ajr-result" data-evaluator={result.id} key={result.id}>
              <dt>{result.label}</dt><dd><strong>{result.value}</strong><span>{result.interval}</span></dd>
              <dd className="ajr-track" aria-hidden="true"><span style={{ width: result.width }} /></dd>
            </div>)}</dl>
            <p className="ajr-reading">Measured against a blind three-model panel. This is evaluation agreement; hiring outcomes were not measured.</p>
          </div>

          <div className="ajr-policy">
            <div><p className="ad-label">The CV trade-off</p><h4>More review.<br />Fewer automatic decisions.</h4></div>
            <div><p className="ajr-review-count">32 <span aria-hidden="true">→</span> 136</p><p>Applications routed to a person when the rejection threshold moved from 0.30 to 0.05 in the retrospective analysis of 496 applications.</p></div>
          </div>
          <p className="ajr-insight">The threshold is a product choice: how much review is worth avoiding a mistaken rejection? The alternative threshold was evaluated offline; its production rollout was not established by this study.</p>
          <a className="ajr-paper-link" href={JEV_PAPER_URL} target="_blank" rel="noopener noreferrer">Read the full research <span aria-hidden="true">↗</span></a>
        </div>
      </article>
    </div>

    <div className="ajr-contribution-motion" data-scroll-depth="10">
      <article className="ajr-contribution" data-drag-frame aria-labelledby="jev-contribution-title">
        <ArtifactDrag label="Move the JEV contribution note" />
        <p className="ad-label">My contribution / product + implementation</p>
        <h3 id="jev-contribution-title">Make the decision<br />reviewable.</h3>
        <p>I implemented structured search requirements, criterion-level CV evidence, JEV integrations and human-review controls with AI coding agents. The team built the base platform; my work connects its decision rules, interface and validation.</p>
        <div className="ajr-evidence">
          <Image src="/media/agora/agora-03-evidencia-por-requisito.png" alt="Agora’s actual recruiter interface in a fictional local demo: requirements with CV evidence, an uncertain Excel requirement at 48%, a review reason and the options to approve and invite or not advance." width={1440} height={900} sizes="(max-width: 799px) 88vw, 900px" draggable={false} />
        </div>
        <p>This local demo uses fictional data. Mentioning Excel does not establish the required experience: the recruiter sees the CV excerpts, records a review reason and chooses the next action. I designed and implemented this review interface to keep the judgment connected to its evidence. <a className="ajr-evidence-link" href="/media/agora/agora-03-evidencia-por-requisito.png" target="_blank" rel="noopener noreferrer">Inspect the full review <span aria-hidden="true">↗</span></a></p>
      </article>
    </div>

    <div className="ajr-method">
      <p className="ad-label">What the study can tell us</p>
      <p>The CV study covers one client’s call-center sales search in Spanish. It used 60 applications labeled by one person from the product team, with results sensitive to those labels. The interview study covers 48 interviews. These findings inform product decisions; they do not establish hiring quality or fairness across groups.</p>
      <details className="ad-disclosure">
        <summary>Study design and uncertainty <span aria-hidden="true">+</span></summary>
        <div className="ajr-method-detail">
          <p>A blind panel of three models from two families provided the main reference. Of 221 extracted interview questions, 220 had a majority label. Confidence intervals resampled interviews; paired comparisons used McNemar’s test with Holm correction.</p>
          <p>For CVs, the human-labeled sample deliberately included more ambiguous cases. The displayed 0.05 threshold was explored on that same sample. Repeated cross-validation selected thresholds by cost, without a reserved holdout set. Population estimates used sampling weights and alternative labels changed the estimates. The review counts above are exact counts over the retrospective dataset.</p>
          <p>The author is part of the Agora team. The paper’s study and the missing-requirements production incident earlier in this case use different data and answer different questions.</p>
        </div>
      </details>
    </div>
  </div>;
}
