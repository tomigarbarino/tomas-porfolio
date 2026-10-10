import Image from "next/image";
import Link from "next/link";
import { BatechVideo } from "./BatechVideo";
import { ArtifactDrag } from "./ArtifactDrag";
import { PeelSticker } from "./PeelSticker";
import { QuickProfileButton } from "./QuickProfileButton";
import {
  batechCase,
  portfolioMedia,
  trainlyCase,
} from "@/data/portfolio";
import "./product-work.css";

export function ProductWork() {
  return (
    <section id="work" className="pw" aria-labelledby="work-title">
      <nav className="pw-case-directory" aria-label="Selected cases">
        <p className="pw-detail-label">Three ways I contribute</p>
        <Link href="/en/agora" prefetch={false}><span>Agora</span><strong>Product decisions. Applied AI.</strong><small>Flock I+D · Product Owner · Ongoing</small><b aria-hidden="true">↗</b></Link>
        <Link href={trainlyCase.href} prefetch={false}><span>Trainly</span><strong>From source material to learning.</strong><small>Product flow · Frontend · AI integration · Active validation</small><b aria-hidden="true">↗</b></Link>
        <a href="#batech"><span>Batech</span><strong>The frontend behind the product.</strong><small>Frontend engineering &amp; leadership · Company context</small><b aria-hidden="true">↗</b></a>
      </nav>
      <div className="pw-process">
        <div className="pw-process-intro" data-scroll-depth="14">
          <div className="pw-process-topline">
            <p className="pw-eyebrow">Selected work / Trainly</p>
            <nav className="pw-direct" aria-label="Profile and contact">
              <QuickProfileButton />
              <a href="#contact">Contact</a>
            </nav>
          </div>
          <h2 id="work-title">Open the product.<br />See the thinking.</h2>
          <p className="pw-process-description">Trainly / AI-powered training and assessment.</p>
        </div>

        <div className="pw-world" data-scroll-depth="-36" data-drag-boundary aria-label="Conceptual views of Trainly, followed by a real product image">
          <div className="pw-plane-position pw-plane-position--context" data-drag-frame tabIndex={0} role="group" aria-label="Trainly context, bring this view forward">
            <ArtifactDrag label="Move the context plane" />
            <div className="pw-plane pw-plane--context">
              <p className="pw-plane-label">Context</p>
              <ul className="pw-context-list">
                <li>People</li>
                <li>Goals</li>
                <li>Constraints</li>
              </ul>
              <p className="pw-concept-label">Conceptual view</p>
            </div>
          </div>
          <div className="pw-plane-position pw-plane-position--flow" data-drag-frame tabIndex={0} role="group" aria-label="Trainly learning flow, bring this view forward">
            <ArtifactDrag label="Move the learning flow plane" />
            <div className="pw-plane pw-plane--flow">
              <p className="pw-plane-label">Learning flow</p>
              <ol className="pw-flow-list">
                {trainlyCase.loop.map((step) => <li key={step.name}>{step.name}</li>)}
              </ol>
              <p className="pw-concept-label">Conceptual view</p>
            </div>
          </div>
          <div className="pw-plane-position pw-plane-position--product" data-drag-frame tabIndex={0} role="group" aria-label="Trainly product experience, bring this view forward">
            <ArtifactDrag label="Move the Trainly product plane" />
            <figure className="pw-plane pw-plane--product">
              <p className="pw-product-label">Trainly / Product experience</p>
              <Image
                className="pw-product-image"
                src={portfolioMedia.trainly.src}
                alt={portfolioMedia.trainly.alt}
                width={portfolioMedia.trainly.width}
                height={portfolioMedia.trainly.height}
                sizes="(max-width: 1179px) 90vw, 600px"
              />
              <figcaption className="pw-product-scope">
                My scope / Product flow · Frontend<br />
                AI integration / Active validation
              </figcaption>
            </figure>
          </div>
          <p className="pw-scene-label pw-scene-label--context">01 / Context</p>
          <span className="pw-leader pw-leader--context" aria-hidden="true">
            {/* Preserve the exported SVG's intrinsic dimensions inside its Figma slot. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/context-leader.svg" alt="" />
          </span>
          <p className="pw-scene-label pw-scene-label--flow">02 / Process</p>
          <span className="pw-leader pw-leader--flow" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/process-leader.svg" alt="" />
          </span>
        </div>

        <div className="pw-process-footer">
          <p>Trainly / Public demo asset</p>
          <Link className="pw-process-cta" href={trainlyCase.href} prefetch={false}>Read the Trainly case <span aria-hidden="true">→</span></Link>
        </div>
      </div>

      <div className="pw-reading">
        <article id="trainly" className="pw-case pw-case--trainly" data-scroll-depth="-20" data-drag-boundary aria-labelledby="trainly-title">
          <header className="pw-case-header" data-scroll-depth="10">
            <div className="pw-case-index"><span>01</span><p>Trainly / Product case</p></div>
            <div>
              <p className="pw-case-kicker">{trainlyCase.category}</p>
              <h3 id="trainly-title">{trainlyCase.title}</h3>
              <div className="pw-case-meta">
                <span>Product flow · Frontend · AI integration</span>
                <span className="pw-status"><i aria-hidden="true" />{trainlyCase.status}</span>
              </div>
            </div>
          </header>

          <div className="pw-case-content">
            <aside className="case-play case-play--trainly" aria-label="Trainly developer sticker"><PeelSticker art="human" title="Human in the loop." fact="My scope connects the learning flow, frontend experience and AI integration." tone="lime" /></aside>
            <div className="pw-problem-grid">
              <section data-drag-frame aria-labelledby="trainly-problem">
                <ArtifactDrag label="Move the Trainly problem card" />
                <p className="pw-detail-label">The problem</p>
                <h4 id="trainly-problem">{trainlyCase.problem.title}</h4>
                <p>{trainlyCase.problem.body}</p>
              </section>
              <section data-drag-frame aria-labelledby="trainly-bet">
                <ArtifactDrag label="Move the product bet card" />
                <p className="pw-detail-label">The product bet</p>
                <h4 id="trainly-bet">{trainlyCase.bet.title}</h4>
                <p>{trainlyCase.bet.body}</p>
              </section>
            </div>

            <details className="work-annotation"><summary>Open the thinking / learning loop <span aria-hidden="true">+</span></summary><p>Source → Structure → Learn → Validate → Improve. The case follows these stages from product flow to implementation.</p></details>
            <section className="pw-scope" aria-labelledby="trainly-scope">
              <div><p className="pw-detail-label">My contribution</p><h4 id="trainly-scope">Product experience.<br />Connected to AI.</h4></div>
              <div><p>{trainlyCase.contribution}</p><ul className="pw-scope-tags">{trainlyCase.scope.map((scope) => <li key={scope}>{scope}</li>)}</ul></div>
            </section>

            <section className="pw-evidence" data-drag-frame aria-labelledby="trainly-evidence">
              <ArtifactDrag label="Move the Trainly evidence card" />
              <div><p className="pw-detail-label">Current evidence</p><h4 id="trainly-evidence">{trainlyCase.statusHeadline}</h4></div>
              <div><p>{trainlyCase.evidence}</p><p className="pw-evidence-limit">{trainlyCase.limits}</p></div>
            </section>
            <div className="pw-case-actions"><Link className="pw-case-cta" href={trainlyCase.href} prefetch={false}>Explore the full Trainly case <span aria-hidden="true">→</span></Link><a className="pw-text-link" href="#batech">Next / Batech <span aria-hidden="true">↓</span></a></div>
          </div>
        </article>

        <article id="batech" className="pw-case pw-case--batech" data-scroll-depth="-24" data-drag-boundary aria-labelledby="batech-title">
          <header className="pw-case-header" data-scroll-depth="10">
            <div className="pw-case-index"><span>02</span><p>Batech / Experience</p></div>
            <div><p className="pw-case-kicker">{batechCase.category}</p><h3 id="batech-title">{batechCase.title}</h3><p className="pw-batech-intro">{batechCase.context}</p></div>
          </header>
          <div className="pw-case-content">
            <aside className="case-play case-play--batech" aria-label="Batech developer sticker"><PeelSticker art="commit" title="One more commit." fact="At Batech I worked on frontend engineering and leadership for AI and computer-vision products." tone="pink" /></aside>
            <section className="pw-batech-contribution" aria-labelledby="batech-contribution">
              <p id="batech-contribution" className="pw-detail-label">My contribution / React + TypeScript</p>
              <ol>{batechCase.contributions.map((item, index) => <li key={item.title}><span>0{index + 1}</span><div><h4>{item.title}</h4><p>{item.body}</p></div></li>)}</ol>
            </section>
            <figure className="pw-batech-media" data-drag-frame>
              <ArtifactDrag label="Move the Batech video frame" />
              <BatechVideo />
              <figcaption id="batech-media-caption">{portfolioMedia.batech.credit}. My contribution was frontend engineering.</figcaption>
            </figure>
            <details className="work-annotation work-annotation--pink"><summary>What I built / frontend layer <span aria-hidden="true">+</span></summary><p>React + TypeScript. My contribution covers the frontend foundation, organization by domain and frontend leadership.</p></details>
            <section className="pw-evidence pw-evidence--batech" data-drag-frame aria-labelledby="batech-evidence">
              <ArtifactDrag label="Move the Batech evidence card" />
              <div><p className="pw-detail-label">Scope &amp; evidence</p><h4 id="batech-evidence">Frontend contribution.<br />Company context.</h4></div>
              <div><p>{batechCase.evidence}</p><p className="pw-evidence-limit">{batechCase.limits}</p></div>
            </section>
            <div className="pw-case-actions"><a className="pw-case-cta" href={batechCase.source} target="_blank" rel="noopener noreferrer">View the published portfolio <span aria-hidden="true">↗</span></a><a className="pw-text-link" href="#agora">Next / Agora <span aria-hidden="true">↓</span></a></div>
          </div>
        </article>
      </div>
    </section>
  );
}
