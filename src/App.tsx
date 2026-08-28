import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BrainCircuit,
  Boxes,
  Code2,
  Github,
  Linkedin,
  Mail,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { useLanguage } from "./contexts/LanguageContext";
import { portfolioContent } from "./i18n/content";
import "./App.css";
import "./trainly-showcase.css";
import { usePortfolioMotion } from "./hooks/usePortfolioMotion";
import { applySeoMetadata, getPagePath, getSeoMetadata } from "./lib/seo";

type ProjectMeta = {
  id: string;
  icon: LucideIcon;
  href: string;
};

const projectMeta: ProjectMeta[] = [
  {
    id: "insurance-workflow",
    icon: ShieldCheck,
    href: "mailto:tomasgarbarino.dev@gmail.com?subject=Insurance%20workflow%20walkthrough",
  },
  {
    id: "immersive-ai",
    icon: AudioLines,
    href: "mailto:tomasgarbarino.dev@gmail.com?subject=Conversational%20AI%20walkthrough",
  },
  {
    id: "prime-os",
    icon: BrainCircuit,
    href: "mailto:tomasgarbarino.dev@gmail.com?subject=Prime%20OS%20walkthrough",
  },
];

const capabilityIcons = [Sparkles, Code2, Workflow];

const toolkit = [
  "Next.js",
  "React",
  "TypeScript",
  "OpenAI",
  "ElevenLabs",
  "Supabase",
  "Vercel",
  "Three.js",
];

const TrainlyShowcase = ({ sourceNote, assetsLabel }: { sourceNote: string; assetsLabel: string }) => (
  <div className="trainly-real-product" aria-label="Trainly product visuals">
    <div className="trainly-real-header">
      <img src="/trainly-logo.svg" alt="Trainly" />
      <span>{assetsLabel}</span>
    </div>

    <div className="trainly-real-stage">
      <div className="trainly-flow-title" role="img" aria-label="Trainly campus product interface" />
      <div className="trainly-flow-assets" role="img" aria-label="Trainly team training interface" />
      <div className="trainly-module-grid" role="img" aria-label="Trainly actionable metrics interface" />

      <div className="trainly-source-note">
        {sourceNote}
      </div>
    </div>
  </div>
);

function App() {
  const portfolioRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const copy = portfolioContent[language];
  const trainlyPath = getPagePath("trainly", language);

  usePortfolioMotion(portfolioRef);

  useEffect(() => {
    applySeoMetadata(getSeoMetadata("home", language));
  }, [language]);

  return (
    <div className="portfolio-shell" ref={portfolioRef}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={copy.homeLabel}>
          <span className="brand-copy">
            <strong>Tomás Garbarino</strong>
            <small>{copy.role}</small>
          </span>
        </a>

        <nav className="site-nav" aria-label={copy.primaryNav}>
          <a href="#work" data-section-link="work"><span className="nav-index">01</span> {copy.nav.work}</a>
          <a href="#experience" data-section-link="experience"><span className="nav-index">02</span> {copy.nav.experience}</a>
          <a href="#about" data-section-link="about"><span className="nav-index">03</span> {copy.nav.about}</a>
        </nav>

        <div className="header-tools">
          <LanguageSwitch />
          <a className="header-cta" href="https://www.linkedin.com/in/tomas-garbarino/" target="_blank" rel="noreferrer">
            <span className="header-cta-label">{copy.talk}</span>
            <span className="header-cta-icon"><ArrowUpRight size={14} /></span>
          </a>
        </div>
      </header>

      <main>
        <section className="hero section-wrap" id="top">
          <div className="hero-copy">
            <div className="eyebrow-pill" data-hero-reveal>
              <span className="status-dot" />
              {copy.availability}
            </div>

            <div className="hero-role" data-hero-reveal>{copy.heroRole}</div>

            <h1 aria-label={copy.heroAria}>
              <span className="hero-line-mask">
                <span className="hero-line" data-hero-line>{copy.heroLineOne}</span>
              </span>
              <span className="hero-line-mask">
                <span className="hero-line hero-line-accent" data-hero-line>
                  {copy.heroLineTwo}
                </span>
              </span>
            </h1>

            <p className="hero-subtitle" data-hero-reveal>
              {copy.heroSubtitle}
            </p>

            <div className="hero-actions" data-hero-reveal>
              <a className="btn btn-primary" href="#trainly">
                {copy.viewWork} <ArrowRight size={17} />
              </a>
              <a
                className="btn btn-secondary"
                href="https://github.com/tomigarbarino"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={17} /> GitHub
              </a>
            </div>

            <div className="proof-row" aria-label={copy.highlights} data-hero-reveal>
              {copy.proof.map(([company, detail]) => (
                <div key={company}><strong>{company}</strong><span>{detail}</span></div>
              ))}
            </div>
          </div>

          <div className="hero-system" aria-label={copy.buildLogAria}>
            <div className="system-glow system-glow-one" />
            <div className="system-glow system-glow-two" />
            <div className="system-window proof-console">
              <div className="window-topbar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>{copy.console.file}</span>
                <span className="live-chip">{copy.console.live}</span>
              </div>

              <div className="system-body">
                <div className="system-label-row">
                  <div className="system-label">{copy.console.label}</div>
                  <span>{copy.console.count}</span>
                </div>
                <a className="flow-node flow-node-active" href="#trainly">
                  <span className="node-icon"><Boxes size={16} /></span>
                  <div>
                    <small>01 · TRAINLY</small>
                    <strong>{copy.console.trainly}</strong>
                  </div>
                  <span className="node-state current">{copy.console.current}</span>
                </a>
                <div className="flow-line" />
                <a className="flow-node" href="#insurance-workflow">
                  <span className="node-icon"><ShieldCheck size={16} /></span>
                  <div>
                    <small>02 · INSURANCE WORKFLOW</small>
                    <strong>{copy.console.insurance}</strong>
                  </div>
                  <span className="node-state">{copy.console.prototype}</span>
                </a>
                <div className="flow-line" />
                <a className="flow-node" href="#immersive-ai">
                  <span className="node-icon"><AudioLines size={16} /></span>
                  <div>
                    <small>03 · VOICE + 3D</small>
                    <strong>{copy.console.voice}</strong>
                  </div>
                  <span className="node-state">R&D</span>
                </a>
                <p className="console-footnote">{copy.console.footnote}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Toolkit">
          <div className="trust-track">
            {copy.trust.map((item, index) => (
              <Fragment key={item}>
                <span>{item}</span>{index < copy.trust.length - 1 && <i />}
              </Fragment>
            ))}
          </div>
        </section>

        <section className="motion-marquee" aria-hidden="true">
          <div className="marquee-row marquee-row-primary" data-marquee="left">
            <span>{copy.marquee[0]}</span>
          </div>
          <div className="marquee-row marquee-row-outline" data-marquee="right">
            <span>{copy.marquee[1]}</span>
          </div>
        </section>

        <section className="section-wrap work-section" id="work">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{copy.work.kicker}</span>
              <h2>{copy.work.title}</h2>
            </div>
            <p>
              {copy.work.intro}
            </p>
          </div>

          <article className="featured-project trainly-featured" id="trainly">
            <div className="featured-copy">
              <div className="project-meta">
                <span className="current-badge">{copy.work.current}</span>
                <span>{copy.work.meta}</span>
              </div>

              <img className="trainly-copy-logo" src="/trainly-logo.svg" alt="Trainly" />

              <p className="featured-lead">
                {copy.work.lead}
              </p>
              <p className="featured-description">
                {copy.work.description}
              </p>

              <div className="role-grid">
                {copy.work.roles.map(([label, value]) => (
                  <div key={label}><span>{label}</span><strong>{value}</strong></div>
                ))}
              </div>

              <div className="featured-proof">
                <span>{copy.work.verifiable}</span>
                <p>{copy.work.verifiableText}</p>
              </div>

              <a className="text-link" href={trainlyPath}>
                {copy.work.readCase} <ArrowRight size={16} />
              </a>
            </div>

            <TrainlyShowcase sourceNote={copy.trainlyAssets} assetsLabel={copy.realAssets} />
          </article>

          <div className="project-reel" data-horizontal-reel>
            <div className="project-reel-heading">
              <div>
                <span className="section-kicker">{copy.work.supporting}</span>
                <strong>{copy.work.mindset}</strong>
              </div>
              <span className="reel-instruction">{copy.work.explore}</span>
            </div>

            <div className="reel-orb" aria-hidden="true">
              <span />
            </div>

            <div className="project-track" data-horizontal-track>
              {projectMeta.map((meta, index) => {
                const project = copy.projects[index];
                const Icon = meta.icon;
                return (
                  <article
                    className="project-card"
                    data-project-panel
                    data-index={`0${index + 1}`}
                    id={meta.id}
                    key={project.title}
                  >
                    <div className="project-card-visual" aria-hidden="true">
                      <span className="orbit-ring orbit-ring-outer" />
                      <span className="orbit-ring orbit-ring-inner" />
                      <span className="orbit-pulse" />
                      <Icon size={30} />
                      <span className="orbit-caption">{project.eyebrow}</span>
                    </div>
                    <div className="project-card-top">
                      <div className="project-icon"><Icon size={20} /></div>
                      <span className="project-status">{project.status}</span>
                    </div>
                    <span className="project-eyebrow">{project.eyebrow}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-proof">
                      <span>{copy.work.proof}</span>
                      <p>{project.proof}</p>
                    </div>
                    <div className="tag-row">
                      {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <a className="project-link" href={meta.href}>
                      {project.linkLabel} <ArrowUpRight size={14} />
                    </a>
                  </article>
                );
              })}
            </div>

            <div className="reel-progress" aria-hidden="true">
              <span data-reel-progress />
            </div>
          </div>
        </section>

        <section className="section-wrap capability-section" id="about">
          <div className="section-heading compact-heading">
            <div>
              <span className="section-kicker">{copy.capabilities.kicker}</span>
              <h2>{copy.capabilities.title}</h2>
            </div>
          </div>

          <div className="capability-grid">
            {copy.capabilitiesList.map((capability, index) => {
              const Icon = capabilityIcons[index];
              return (
                <div className="capability-card" key={capability.title}>
                  <Icon size={21} />
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </div>
              );
            })}
          </div>

          <div className="toolkit-row">
            <span>{copy.capabilities.toolkit}</span>
            <div>
              {toolkit.map((tool) => <strong key={tool}>{tool}</strong>)}
            </div>
          </div>
        </section>

        <section className="section-wrap experience-section" id="experience">
          <div className="section-heading compact-heading">
            <div>
              <span className="section-kicker">{copy.experience.kicker}</span>
              <h2>{copy.experience.title}</h2>
            </div>
          </div>

          <div className="experience-list">
            {copy.experiences.map((experience, index) => (
              <article className="experience-row" key={experience.company}>
                <div className="experience-index">0{index + 1}</div>
                <div className="experience-period">{experience.period}</div>
                <div className="experience-title">
                  <h3>{experience.role}</h3>
                  <span>{experience.company}</span>
                </div>
                <p>{experience.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap contact-section" id="contact">
          <div className="contact-panel">
            <div>
              <span className="section-kicker">{copy.contact.kicker}</span>
              <h2>{copy.contact.title}</h2>
              <p>
                {copy.contact.body}
              </p>
            </div>
            <div className="contact-actions">
              <a
                className="btn btn-primary"
                href="https://www.linkedin.com/in/tomas-garbarino/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={17} /> {copy.contact.linkedin}
              </a>
              <a className="btn btn-secondary" href="mailto:tomasgarbarino.dev@gmail.com">
                <Mail size={17} /> {copy.contact.email}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="new-footer section-wrap">
        <div>
          <span>Tomás Garbarino · {language === "es" ? "Ingeniero de Producto" : "Product Engineer"}</span>
        </div>
        <div className="footer-links">
          <a href="https://github.com/tomigarbarino" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/tomas-garbarino/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>

      <nav className="mobile-dock" aria-label={copy.mobileNav}>
        <a href="#work" data-section-link="work"><Boxes size={16} /> {copy.mobile.work}</a>
        <a href="#experience" data-section-link="experience"><Code2 size={16} /> {copy.mobile.experience}</a>
        <a href="mailto:tomasgarbarino.dev@gmail.com"><Mail size={16} /> {copy.mobile.email}</a>
      </nav>
    </div>
  );
}

export default App;
