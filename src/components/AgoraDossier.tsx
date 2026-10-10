"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AmbientMotion } from "./AmbientMotion";
import { ArtifactDrag } from "./ArtifactDrag";
import { AgoraFlow } from "./AgoraFlow";
import { AsciiVideo } from "./AsciiVideo";
import { MotionPreference, useMotionPreference } from "./MotionPreference";
import { PeelSticker } from "./PeelSticker";
import { ScrollMotion } from "./ScrollMotion";
import { SiteHeader } from "./SiteHeader";
import "@/app/portfolio-art-direction.css";
import "./agora-case.css";
import "./agora-dossier.css";

const sections = [
  { id: "overview", label: "Context + role" },
  { id: "flow", label: "Product flow" },
  { id: "decision", label: "The decision" },
  { id: "experience", label: "Candidate experience" },
  { id: "system", label: "Product system" },
  { id: "next", label: "What comes next" },
] as const;

const contributions = [
  { title: "Product direction", body: "I work on product definition and prioritization, connecting customer needs with the next product decisions." },
  { title: "Architecture + AI", body: "I make architecture decisions and implement AI features directly, working across the product and its agents." },
  { title: "Customer discovery", body: "I take part in customer discovery and commercial conversations, bringing that context into the product work." },
  { title: "Candidate experience", body: "I work on UX and UI, with attention to the candidate experience alongside recruiter workflows." },
] as const;

const designs = [
  {
    id: "candidate-upload", src: "/media/agora-candidate-upload.png", title: "Candidate CV upload",
    alt: "Agora candidate CV upload Figma design with an empty upload area",
    caption: "An empty upload state in the candidate application.",
    source: "https://www.figma.com/design/gKp8MoVlJ2vdftqeyqmyht/Agora---Design-file?node-id=4672-8410",
  },
  {
    id: "interview-preparation", src: "/media/agora-device-check.png", title: "Interview preparation",
    alt: "Agora candidate interview device-check Figma design, before an interview starts",
    caption: "Device preparation before the AI interview begins.",
    source: "https://www.figma.com/design/gKp8MoVlJ2vdftqeyqmyht/Agora---Design-file?node-id=5822-10016",
  },
] as const;

function AgoraAtmosphere() {
  const { paused } = useMotionPreference();
  return <div className="ad-world" aria-hidden="true"><AsciiVideo src="/media/hero-ascii.mp4" poster="/media/hero-ascii.png" paused={paused} /></div>;
}

function AgoraSectionNav() {
  const [current, setCurrent] = useState<string>(sections[0].id);

  useEffect(() => {
    const elements = sections.flatMap(section => {
      const element = document.getElementById(section.id);
      return element ? [element] : [];
    });
    function syncHash() {
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); }
      catch { return; }
      const sectionId = target?.closest<HTMLElement>(".ad-section")?.id;
      if (sectionId && sections.some(section => section.id === sectionId)) setCurrent(sectionId);
    }
    function syncVisible() {
      const line = window.innerHeight * .18;
      const positions = elements.map(element => ({ id: element.id, box: element.getBoundingClientRect() }));
      const reading = positions.find(({ box }) => box.top <= line && box.bottom > line);
      const upcoming = positions.find(({ box }) => box.top > line && box.top < window.innerHeight * .4);
      if (reading ?? upcoming) setCurrent((reading ?? upcoming)!.id);
    }
    let observer: IntersectionObserver;
    function observe() {
      observer?.disconnect();
      observer = new IntersectionObserver(syncVisible, {
        rootMargin: `-${Math.round(window.innerHeight * .18)}px 0px -${Math.round(window.innerHeight * .6)}px 0px`,
        threshold: 0,
      });
      elements.forEach(element => observer.observe(element));
      syncVisible();
    }
    observe();
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("resize", observe);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("resize", observe);
    };
  }, []);

  return <nav className="ad-nav" aria-label="Agora case sections"><p>Inside the case</p>{sections.map((section, index) => <a key={section.id} href={`#${section.id}`} aria-current={current === section.id ? "location" : undefined} onClick={() => setCurrent(section.id)}><span>0{index + 1}</span>{section.label}<i aria-hidden="true">↗</i></a>)}</nav>;
}

function SectionHeading({ number, label, title, children }: { number: string; label: string; title: ReactNode; children?: ReactNode }) {
  return <header className="ad-section-heading" data-scroll-depth="10"><p className="ad-label"><span>{number}</span> / {label}</p><h2>{title}</h2>{children && <div className="ad-section-intro">{children}</div>}</header>;
}

function CandidateFrame({ design, hero = false }: { design: typeof designs[number]; hero?: boolean }) {
  return <figure id={hero ? undefined : design.id} className={`ad-design${hero ? " ad-design--hero" : ""}`} data-drag-frame>
    <ArtifactDrag label={`Move the Agora ${design.title.toLowerCase()} design${hero ? " in the hero" : ""}`} />
    <div className="ad-design-bar"><span>Agora / {design.title}</span><span aria-hidden="true">↗</span></div>
    {/* These are existing, empty Figma states, not a live candidate record. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={design.src} alt={design.alt} width="1440" height="900" loading={hero ? "eager" : "lazy"} decoding="async" />
    <figcaption><div><span className="ad-design-kind">Figma design</span><p>{design.caption}</p></div><a href={design.source} target="_blank" rel="noreferrer">View source ↗</a></figcaption>
  </figure>;
}

export function AgoraDossier() {
  return <MotionPreference><AmbientMotion /><ScrollMotion />
    <a className="skip-link" href="#overview">Skip to Agora case study</a>
    <main id="main" className="ad">
      <div className="portfolio-backdrop" aria-hidden="true" />
      <AgoraAtmosphere />
      <SiteHeader context="case" backHref="/#agora" />
      <section className="ad-hero" id="top" data-drag-boundary aria-labelledby="agora-case-title">
        <div className="ad-hero-copy" data-scroll-depth="12">
          <p className="ad-label ad-hero-label">Case file 03 / Flock I+D</p>
          <h1 id="agora-case-title">Agora.<br /><span>Keep the<br />context.</span></h1>
          <p className="ad-hero-deck">From role requirements to evidence a recruiter can review.</p>
          <p className="ad-hero-scope">As Product Owner at Flock I+D, I connect product priorities, customer discovery, architecture decisions and hands-on AI implementation.</p>
          <dl className="ad-role"><div><dt>My role</dt><dd>Product Owner</dd></div><div><dt>Product</dt><dd>Recruiting + applied AI</dd></div><div><dt>Status</dt><dd>Ongoing product work</dd></div></dl>
          <a className="ad-link ad-link--primary" href="#decision">Read the decision <span aria-hidden="true">↓</span></a>
        </div>
        <div className="ad-hero-art" data-scroll-depth="-18">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ad-logo" src="/media/agora-logo.svg" alt="Agora product logo" width="126" height="37" />
          <CandidateFrame design={designs[0]} hero />
          <p className="ad-hero-edition" aria-hidden="true">ROLE CRITERIA<br />↘ HUMAN REVIEW</p>
          <aside className="ad-hero-sticker" aria-label="A note on product judgment"><PeelSticker art="depends" title="It depends." fact="Missing requirements should trigger human review. A missing input cannot support a confident rejection." tone="violet" /></aside>
        </div>
      </section>

      <div className="ad-case-layout" id="case-content">
        <aside className="ad-rail"><AgoraSectionNav /><p className="ad-rail-note">03 / AGORA<br />Product ownership + AI<br />Flock I+D</p></aside>
        <div className="ad-content">
          <section className="ad-section" id="overview" data-drag-boundary aria-labelledby="agora-overview-title">
            <SectionHeading number="01" label="Context + role" title={<span id="agora-overview-title">Hiring context<br />gets fragmented.</span>}><p>Role requirements, CVs, interviews and recruiter decisions are parts of the same process. When they live in separate places, the context needed to review a candidate gets fragmented.</p></SectionHeading>
            <div className="ad-overview-grid">
              <ol className="ad-context-list"><li><span>01</span><div><h3>Define the search.</h3><p>The role and its structured criteria establish what needs to be reviewed.</p></div></li><li><span>02</span><div><h3>Connect the evidence.</h3><p>Criterion-level CV matching and interview context support the review.</p></div></li><li><span>03</span><div><h3>Keep a person in the decision.</h3><p>The recruiter workspace brings together ranking, history and a talent pool.</p></div></li></ol>
              <div className="ad-product-bet" data-drag-frame><ArtifactDrag label="Move the Agora product approach" /><p className="ad-label">The product approach</p><h3>Keep the evidence<br />with the criteria.</h3><p>Agora connects criterion-level CV matching and automated technical interviews with the tools recruiters use to organize and review candidates.</p><span aria-hidden="true">↗</span></div>
            </div>
            <div className="ad-contribution-heading"><p className="ad-label">My contribution</p><p>Product decisions and hands-on AI work, across both sides of the experience.</p></div>
            <div className="ad-contributions">{contributions.map((item, index) => <article key={item.title} data-drag-frame><ArtifactDrag label={`Move the ${item.title.toLowerCase()} contribution`} /><p className="ad-label">0{index + 1}</p><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
          </section>

          <section className="ad-section ad-flow-section" id="flow" data-drag-boundary aria-labelledby="agora-flow-title">
            <SectionHeading number="02" label="Product flow" title={<span id="agora-flow-title">Criteria. Evidence.<br />Human context.</span>}><p>The diagram explains relationships in the product. Inspect Evidence or Recruiter review to explore the missing-input guardrail, and move the pieces to follow their connections.</p></SectionHeading>
            <AgoraFlow />
            <p className="ad-note">Illustrative product flow and explanation. It contains no real CV, candidate record or live result.</p>
          </section>

          <section className="ad-section ad-decision-section" id="decision" data-drag-boundary aria-labelledby="agora-decision-title">
            <SectionHeading number="03" label="A real product decision / anonymized" title={<span id="agora-decision-title">Missing requirements<br />should trigger review,<br /><em>not rejection.</em></span>}><p>A reported rejection exposed two different failures: a search without structured skills and an education catalog that missed English degree names.</p></SectionHeading>
            <div className="ad-incident-grid">
              <article data-drag-frame data-agora-decision-step="missing-skills"><ArtifactDrag label="Move the missing skills diagnosis" /><p className="ad-label">01 / Missing requirements</p><h3>No structured skills.<br />A 0% match.</h3><p>The requirements were in a public advert the matcher did not consume. With no structured skills in the search, missing context became a 0% match and an automatic rejection.</p></article>
              <article data-drag-frame data-agora-decision-step="education-catalog"><ArtifactDrag label="Move the education catalog diagnosis" /><p className="ad-label">02 / A catalog gap</p><h3>Education existed.<br />The alias did not.</h3><p>The Spanish-language education catalog did not recognize English degree names and levels. The resulting rejection explanation also missed the candidate’s stated education.</p></article>
            </div>
            <div className="ad-decision-rule" data-drag-frame data-agora-decision-step="bounded-fix">
              <ArtifactDrag label="Move the bounded Agora fix" />
              <p className="ad-label">The bounded fix / my contribution</p>
              <h3>No structured skills<br /><span aria-hidden="true">→ </span>human review.</h3>
              <p>I helped define a bounded fix: route searches with no structured skills to human review, remove them from talent-pool suggestions, and extend the education catalog to recognize English degree names and levels.</p>
              <p className="ad-rule-kind">Illustrative rule / no candidate record</p>
            </div>
            <details className="ad-disclosure"><summary>Why this fix? The alternatives considered <span aria-hidden="true">+</span></summary><dl className="ad-alternatives"><div><dt>Use another evaluator</dt><dd>It shared the same education catalog, so that recognition gap would remain.</dd></div><div><dt>Read the public advert</dt><dd>That would mix promotional copy with structured role requirements.</dd></div><div><dt>Repair search creation structurally</dt><dd>Templates, imports and AI prefill needed more time. They remained on the roadmap while the bounded guardrail addressed the missing-input state.</dd></div></dl></details>
            <section className="ad-validation" aria-labelledby="agora-validation-title">
              <header><p className="ad-label">Team-reported validation</p><h3 id="agora-validation-title">Check the change.<br />Check the boundary.</h3></header>
              <ol><li><span>Before release</span><p>The team reported two searches affected by missing structured skills. Replaying the calculation changed one decision without changing scores.</p></li><li><span>After release</span><p>A read-only check, reported by the team, confirmed human review and education recognition for the affected case. A control search stayed unchanged.</p></li></ol>
              <p className="ad-note">Reported by the team; not independently verified for this portfolio. This bounded replay and control check do not measure overall matching accuracy, fairness or business impact.</p>
            </section>
          </section>

          <section className="ad-section" id="experience" data-drag-boundary aria-labelledby="agora-experience-title">
            <SectionHeading number="04" label="Candidate experience" title={<span id="agora-experience-title">Designed for<br />the other side, too.</span>}><p>The product includes a candidate application as well as recruiter workflows. These selected Figma designs show empty preparation states: uploading a CV and checking devices before an interview.</p></SectionHeading>
            <div className="ad-design-gallery">{designs.map(design => <CandidateFrame key={design.id} design={design} />)}</div>
            <p className="ad-note">Design evidence / selected Figma frames. These images are not live production captures or records of a real application.</p>
          </section>

          <section className="ad-section" id="system" data-drag-boundary aria-labelledby="agora-system-title">
            <SectionHeading number="05" label="Product system" title={<span id="agora-system-title">Application.<br />Agents. Operations.</span>}><p>A recruiter workspace, a candidate application and AI workflows meet around the same hiring context. Manatal integration and bulk upload of searches support the recruiter workflow.</p></SectionHeading>
            <div className="ad-system-grid"><article data-drag-frame><ArtifactDrag label="Move the Agora application responsibility" /><p className="ad-label">Application</p><h3>Both sides<br />of the workflow.</h3><p>Recruiter searches, candidate context, ranking and history; candidate preparation and interview entry.</p><p className="ad-stack-group">Next.js · Supabase</p></article><article data-drag-frame><ArtifactDrag label="Move the Agora AI responsibility" /><p className="ad-label">AI workflows</p><h3>Evidence and<br />interviews.</h3><p>CV matching against role criteria and automated technical interviews with AI agents.</p><p className="ad-stack-group">Python · OpenAI</p></article><article data-drag-frame><ArtifactDrag label="Move the Agora operations responsibility" /><p className="ad-label">Infrastructure</p><h3>Supporting<br />the product.</h3><p>Hosting and operational services across the application and its agent workflows.</p><p className="ad-stack-group">AWS Amplify · Railway</p></article></div>
            <p className="ad-note">Conceptual grouping of the declared product stack and responsibilities. Deployment topology and implementation internals are not included in this case.</p>
          </section>

          <section className="ad-section ad-next" id="next" aria-labelledby="agora-next-title">
            <SectionHeading number="06" label="Current status" title={<span id="agora-next-title">Ongoing<br />product work.</span>}><p>The immediate guardrail addressed searches with no structured skills. Structured templates, imports and AI prefill remain the next structural direction, alongside continued work on the candidate and recruiter experience.</p></SectionHeading>
            <div className="ad-next-grid"><Link className="ad-related" href="/en/trainly" prefetch={false}><span className="ad-label">Another case / Trainly</span><strong>Learning,<br />in a loop.</strong><span>Product flow · Frontend · AI integration <i aria-hidden="true">↗</i></span></Link><div className="ad-contact"><p className="ad-label">Bring the context.</p><h3>Have a real<br />product problem?</h3><Link className="ad-link ad-link--primary" href="/#contact" prefetch={false}>Talk through the work <span aria-hidden="true">↗</span></Link><Link className="ad-link" href="/#work" prefetch={false}>Back to selected work <span aria-hidden="true">←</span></Link></div></div>
            <footer className="ad-footer"><span>Tomás Garbarino / Product Engineer · Applied AI</span><a href="#top">Back to top ↑</a><span aria-hidden="true">TG_</span></footer>
          </section>
        </div>
      </div>
    </main>
  </MotionPreference>;
}
