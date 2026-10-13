"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AmbientMotion } from "./AmbientMotion";
import { ArtifactDrag } from "./ArtifactDrag";
import { AgoraFlow } from "./AgoraFlow";
import { AgoraDecisionReplay } from "./AgoraDecisionReplay";
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
  { id: "decision", label: "The decision" },
  { id: "flow", label: "Product flow" },
  { id: "experience", label: "Candidate experience" },
  { id: "system", label: "Product system" },
  { id: "next", label: "What comes next" },
] as const;

const contributions = [
  { title: "Product direction", body: "I work on product definition and priorities. In this case, I helped define the immediate guardrail while the structural search-creation fix stayed on the roadmap.", href: "#decision", link: "The product decision" },
  { title: "Architecture + AI", body: "I participate in architecture decisions and implement AI features directly, connecting the application with its agent workflows.", href: "#system", link: "The product system" },
  { title: "Customer discovery", body: "I discover customer needs and bring commercial context into product decisions. This case starts with a concrete report from a talent team.", href: "#decision", link: "Where the case started" },
  { title: "Candidate experience", body: "My UX/UI work includes the candidate journey alongside recruiter workflows, from entering a profile to preparing for an interview.", href: "#experience", link: "The candidate journey" },
] as const;

const designs = [
  {
    id: "candidate-upload", src: "/media/agora-candidate-upload.png", title: "Candidate CV upload",
    alt: "Agora candidate CV upload interface reference with an empty upload area",
  },
  {
    id: "interview-preparation", src: "/media/agora-device-check.png", title: "Interview preparation",
    alt: "Agora candidate interview device-check interface reference, before an interview starts",
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
      try {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        if (!hash || hash === "top") { setCurrent(sections[0].id); return; }
        target = document.getElementById(hash);
      }
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
      else if (positions[0]?.box.top > line) setCurrent(sections[0].id);
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
          <p className="ad-label ad-hero-label">Case file 01 / Flock I+D</p>
          <h1 id="agora-case-title">Agora.<br /><span>Keep the<br />context.</span></h1>
          <p className="ad-hero-deck">A trainee was rejected. The problem was missing context.</p>
          <p className="ad-hero-scope">On Agora at Flock I+D, I’m the Product Owner. My work spans customer discovery, product priorities, architecture decisions, hands-on AI implementation and candidate UX/UI.</p>
          <dl className="ad-role"><div><dt>My role</dt><dd>Product Owner</dd></div><div><dt>Product</dt><dd>Recruiting + applied AI</dd></div><div><dt>Status</dt><dd>Live with clients · Growing</dd></div></dl>
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
        <aside className="ad-rail"><AgoraSectionNav /><p className="ad-rail-note">01 / AGORA<br />Product ownership + AI<br />Flock I+D</p></aside>
        <div className="ad-content">
          <section className="ad-section" id="overview" data-drag-boundary aria-labelledby="agora-overview-title">
            <SectionHeading number="01" label="Context + my contribution" title={<span id="agora-overview-title">Product owner.<br />Hands-on builder.</span>}><p>Agora connects CV matching, AI technical interviews and a recruiter backoffice with ranking, history and a searchable talent pool. At Flock I+D, my role crosses product decisions and implementation.</p></SectionHeading>
            <div className="ad-art-group" data-scroll-depth="-12"><div className="ad-contributions">{contributions.map((item, index) => <article key={item.title} data-drag-frame><ArtifactDrag label={`Move the ${item.title.toLowerCase()} contribution`} /><p className="ad-label">0{index + 1} / My contribution</p><h3>{item.title}</h3><p>{item.body}</p><a className="ad-contribution-link" href={item.href}>{item.link} <span aria-hidden="true">↗</span></a></article>)}</div></div>
          </section>

          <section className="ad-section ad-decision-section" id="decision" data-drag-boundary aria-labelledby="agora-decision-title">
            <SectionHeading number="02" label="A real product decision" title={<span id="agora-decision-title">Missing requirements<br />should trigger review,<br /><em>not rejection.</em></span>}><p>A talent team flagged a Systems student rejected for a trainee search. The explanation blamed missing studies. Two separate failures sat behind that decision.</p></SectionHeading>
            <div className="ad-incident-grid">
              <article data-drag-frame data-agora-decision-step="missing-skills"><ArtifactDrag label="Move the missing skills diagnosis" /><p className="ad-label">01 / Missing requirements</p><h3>No structured skills.<br />A 0% match.</h3><p>The requirements were in a public advert the matcher did not consume. With no structured skills in the search, missing context became a 0% match and an automatic rejection.</p></article>
              <article data-drag-frame data-agora-decision-step="education-catalog"><ArtifactDrag label="Move the education catalog diagnosis" /><p className="ad-label">02 / A catalog gap</p><h3>Education existed.<br />The alias did not.</h3><p>The Spanish-language education catalog did not recognize English degree names and levels. The resulting rejection explanation also missed the candidate’s stated education.</p></article>
            </div>
            <div className="ad-decision-rule" data-drag-frame data-agora-decision-step="bounded-fix">
              <ArtifactDrag label="Move the bounded Agora fix" />
              <p className="ad-label">The bounded fix / my contribution</p>
              <h3>No structured skills<br /><span aria-hidden="true">→ </span>human review.</h3>
              <p>I helped define a bounded fix: route searches with no structured skills to human review, remove them from talent-pool suggestions, and extend the education catalog to recognize English degree names and levels.</p>
              <AgoraDecisionReplay />
            </div>
            <p className="ad-tradeoff">The structural fix was to prevent searches without requirements. Templates, Manatal imports and AI prefill needed more time, so the immediate guardrail stayed small while that work remained on the roadmap.</p>
            <details className="ad-disclosure"><summary>Why this fix? The alternatives considered <span aria-hidden="true">+</span></summary><dl className="ad-alternatives"><div><dt>Use another evaluator</dt><dd>It shared the same education catalog, so that recognition gap would remain.</dd></div><div><dt>Read the public advert</dt><dd>That would mix promotional copy with structured role requirements.</dd></div><div><dt>Repair search creation structurally</dt><dd>Templates, imports and AI prefill needed more time. They remained on the roadmap while the bounded guardrail addressed the missing-input state.</dd></div></dl></details>
            <section className="ad-validation" aria-labelledby="agora-validation-title">
              <header><p className="ad-label">Validation</p><h3 id="agora-validation-title">One decision changed.<br />Scores stayed the same.</h3></header>
              <ol><li><span>Before release</span><p>The team reported two searches affected by missing structured skills. Replaying the calculation changed one decision without changing scores.</p></li><li><span>After release</span><p>A read-only check, reported by the team, confirmed human review and education recognition for the affected case. A control search stayed unchanged.</p></li></ol>
            </section>
          </section>

          <section className="ad-section ad-flow-section" id="flow" data-drag-boundary aria-labelledby="agora-flow-title">
            <SectionHeading number="03" label="Product flow" title={<span id="agora-flow-title">Criteria. Evidence.<br />Human context.</span>}><p>Role criteria define the review. Jev connects CV evidence to each criterion; voice interviews add technical context. Recruiters see the candidate’s combined history.</p></SectionHeading>
            <AgoraFlow />
          </section>

          <section className="ad-section" id="experience" data-drag-boundary aria-labelledby="agora-experience-title">
            <SectionHeading number="04" label="Candidate experience" title={<span id="agora-experience-title">Candidate UX is<br />part of the product.</span>}><p>My scope also includes candidate UX/UI. These product designs show two moments in that journey: uploading a CV and preparing devices for an AI interview.</p></SectionHeading>
            <aside className="ad-section-sticker ad-section-sticker--human" data-scroll-depth="14"><PeelSticker art="human" title="Human in the loop." fact="A CV upload and a device check are part of the same candidate journey as the interview." tone="pink" /></aside>
            <div className="ad-art-group" data-scroll-depth="-12"><div className="ad-design-gallery">{designs.map(design => <CandidateFrame key={design.id} design={design} />)}</div></div>
          </section>

          <section className="ad-section" id="system" data-drag-boundary aria-labelledby="agora-system-title">
            <SectionHeading number="05" label="Product system" title={<span id="agora-system-title">The product behind<br />the decision.</span>}><p>I contribute to architecture decisions and AI features across these product responsibilities. Manatal integration and bulk search uploads support the recruiter workflow.</p></SectionHeading>
            <aside className="ad-section-sticker ad-section-sticker--commit" data-scroll-depth="-14"><PeelSticker art="commit" title="Small change. Clear check." fact="Check the affected cases, unchanged scores and a control. The scope of a change is part of the decision." tone="lime" /></aside>
            <div className="ad-art-group" data-scroll-depth="-12"><div className="ad-system-grid"><article data-drag-frame><ArtifactDrag label="Move the Agora application responsibility" /><p className="ad-label">Application</p><h3>Both sides<br />of the workflow.</h3><p>Recruiter searches, candidate context, ranking and history; candidate preparation and interview entry.</p><p className="ad-stack-group">Next.js · Supabase</p></article><article data-drag-frame><ArtifactDrag label="Move the Agora AI responsibility" /><p className="ad-label">AI workflows</p><h3>Evidence and<br />interviews.</h3><p>CV matching against role criteria and automated technical interviews with AI agents.</p><p className="ad-stack-group">Python · OpenAI</p></article><article data-drag-frame><ArtifactDrag label="Move the Agora operations responsibility" /><p className="ad-label">Infrastructure</p><h3>Supporting<br />the product.</h3><p>Hosting and operational services across the application and its agent workflows.</p><p className="ad-stack-group">AWS Amplify · Railway</p></article></div></div>
          </section>

          <section className="ad-section ad-next" id="next" aria-labelledby="agora-next-title">
            <SectionHeading number="06" label="Current status / in use and growing" title={<span id="agora-next-title">The next iteration:<br />better inputs.</span>}><p>Agora is used by clients and continues to grow. The immediate guardrail addressed searches with no structured skills. Structured templates, imports and AI prefill remain the next structural direction, alongside continued work on the candidate and recruiter experience.</p></SectionHeading>
            <div className="ad-next-grid"><Link className="ad-related" href="/en/trainly" prefetch={true}><span className="ad-label">Another case / Trainly</span><strong>Learning,<br />in a loop.</strong><span>Product flow · Frontend · AI integration <i aria-hidden="true">↗</i></span></Link><div className="ad-contact"><p className="ad-label">Bring the context.</p><h3>Building an<br />AI product?</h3><Link className="ad-link ad-link--primary" href="/#contact" prefetch={true}>Let’s talk product engineering <span aria-hidden="true">↗</span></Link><Link className="ad-link" href="/#work" prefetch={true}>Back to selected work <span aria-hidden="true">←</span></Link></div></div>
            <footer className="ad-footer"><span>Tomás Garbarino / Product Engineer · Applied AI</span><a href="#top">Back to top ↑</a><span aria-hidden="true">TG_</span></footer>
          </section>
        </div>
      </div>
    </main>
  </MotionPreference>;
}
