import Image from "next/image";
import Link from "next/link";
import { ArtifactDrag } from "./ArtifactDrag";
import "./agora-research.css";

export function AgoraResearch() {
  return <div className="ajr">
    <aside className="ajr-related"><p className="ad-label">Related reading / Writing &amp; Research</p><h3>A threshold is a product decision.</h3><p>My separate JEV study explores evaluation agreement and human-review thresholds. Read the findings, methods and limitations in the research section.</p><Link href="/writing/jev">Read the JEV research guide →</Link></aside>
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

  </div>;
}
