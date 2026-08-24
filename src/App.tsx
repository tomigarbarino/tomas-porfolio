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
import { useRef } from "react";
import "./App.css";
import "./trainly-showcase.css";
import { usePortfolioMotion } from "./hooks/usePortfolioMotion";

type Project = {
  id: string;
  title: string;
  eyebrow: string;
  status: string;
  description: string;
  proof: string;
  tags: string[];
  icon: LucideIcon;
  href: string;
  linkLabel: string;
};

type Experience = {
  period: string;
  role: string;
  company: string;
  description: string;
};

const TRAINLY_URL =
  "https://www.flocklabs.ar/projects/trainly-la-herramienta-para-validar-competencias-2-2-2";

const TRAINLY_ASSETS = {
  upload:
    "https://raw.githubusercontent.com/tomigarbarino/trainly-demo/main/public/images/figma/slide06-subir.svg",
  process:
    "https://raw.githubusercontent.com/tomigarbarino/trainly-demo/main/public/images/figma/slide06-procesar.svg",
  create:
    "https://raw.githubusercontent.com/tomigarbarino/trainly-demo/main/public/images/figma/slide06-crear.svg",
  learn:
    "https://raw.githubusercontent.com/tomigarbarino/trainly-demo/main/public/images/figma/slide06-aprendizaje.svg",
  chapters:
    "https://raw.githubusercontent.com/tomigarbarino/trainly-demo/main/public/images/figma/slide07-capitulos.svg",
  quizzes:
    "https://raw.githubusercontent.com/tomigarbarino/trainly-demo/main/public/images/figma/slide07-quizzes.svg",
  evaluations:
    "https://raw.githubusercontent.com/tomigarbarino/trainly-demo/main/public/images/figma/slide07-evaluaciones.svg",
  flashcards:
    "https://raw.githubusercontent.com/tomigarbarino/trainly-demo/main/public/images/figma/slide07-flashcards.svg",
};

const projects: Project[] = [
  {
    id: "insurance-workflow",
    title: "Multi-agent Insurance Workflow",
    eyebrow: "AI OPERATIONS",
    status: "PROTOTYPE",
    description:
      "An operational prototype where AI agents help analyze a claim, consult policy and evidence, surface missing information and escalate decisions to a human operator.",
    proof:
      "Working flow: policy review, evidence checks, missing-data detection and human escalation.",
    tags: ["Agent orchestration", "Human-in-the-loop", "Operational UX"],
    icon: ShieldCheck,
    href: "mailto:tomasgarbarino.dev@gmail.com?subject=Insurance%20workflow%20walkthrough",
    linkLabel: "Request a walkthrough",
  },
  {
    id: "immersive-ai",
    title: "Immersive & Conversational AI",
    eyebrow: "EXPERIMENTATION",
    status: "EXPLORATION",
    description:
      "Real-time conversational AI, voice and immersive 3D interfaces explored as faster ways to create and iterate training experiences.",
    proof:
      "Interaction prototypes across realtime voice, 3D environments and training-content creation.",
    tags: ["Voice AI", "3D", "Real-time", "Rapid prototyping"],
    icon: AudioLines,
    href: "mailto:tomasgarbarino.dev@gmail.com?subject=Conversational%20AI%20walkthrough",
    linkLabel: "Request a walkthrough",
  },
  {
    id: "prime-os",
    title: "Prime OS",
    eyebrow: "PERSONAL R&D",
    status: "PRIVATE BUILD",
    description:
      "A personal operating system for turning fragmented context into better decisions, testable actions and measurable feedback loops.",
    proof:
      "Active private build exploring agent memory, tool use and decision feedback loops.",
    tags: ["Agents", "Memory", "Tool use", "Decision systems"],
    icon: BrainCircuit,
    href: "mailto:tomasgarbarino.dev@gmail.com?subject=Prime%20OS%20walkthrough",
    linkLabel: "Ask about the build",
  },
];

const experiences: Experience[] = [
  {
    period: "2026 — now",
    role: "Product Engineer",
    company: "Flock I+D",
    description:
      "Building and validating AI product initiatives end-to-end across product thinking, frontend, integrations and rapid experimentation. Current main focus: Trainly.",
  },
  {
    period: "2023 — 2025",
    role: "Frontend Engineer → Frontend Lead",
    company: "Batech",
    description:
      "Joined as the only frontend engineer and later took frontend leadership responsibility while evolving the product architecture and shipping product features.",
  },
  {
    period: "2022 — 2023",
    role: "Frontend Developer",
    company: "Hogarth Worldwide",
    description:
      "Built reusable frontend experiences for global brands, including Apple-related production work.",
  },
];

const capabilities = [
  {
    title: "AI product systems",
    description:
      "LLMs, tool workflows, agents and human checkpoints designed around real product outcomes.",
    icon: Sparkles,
  },
  {
    title: "Product engineering",
    description:
      "From ambiguous requirement to interaction model, frontend, integrations, data and deployment.",
    icon: Code2,
  },
  {
    title: "Fast validation",
    description:
      "Prototype the riskiest assumption first, put it in front of real context and iterate from evidence.",
    icon: Workflow,
  },
];

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

const TrainlyShowcase = () => (
  <div className="trainly-real-product" aria-label="Trainly product visuals">
    <div className="trainly-real-header">
      <img src="/trainly-logo.svg" alt="Trainly" />
      <span>REAL PRODUCT ASSETS</span>
    </div>

    <div className="trainly-real-stage">
      <div className="trainly-flow-title">
        <span>KNOWLEDGE → LEARNING</span>
        <strong>From source material to structured training</strong>
      </div>

      <div className="trainly-flow-assets">
        <div className="trainly-flow-asset">
          <span>01</span>
          <img src={TRAINLY_ASSETS.upload} alt="Upload knowledge into Trainly" />
        </div>
        <i>→</i>
        <div className="trainly-flow-asset">
          <span>02</span>
          <img src={TRAINLY_ASSETS.process} alt="Process knowledge with Trainly" />
        </div>
        <i>→</i>
        <div className="trainly-flow-asset">
          <span>03</span>
          <img src={TRAINLY_ASSETS.create} alt="Create training content with Trainly" />
        </div>
        <i>→</i>
        <div className="trainly-flow-asset">
          <span>04</span>
          <img src={TRAINLY_ASSETS.learn} alt="Learn with Trainly" />
        </div>
      </div>

      <div className="trainly-module-grid">
        <div className="trainly-module-card">
          <img src={TRAINLY_ASSETS.chapters} alt="Trainly chapters" />
          <span>Chapters</span>
        </div>
        <div className="trainly-module-card">
          <img src={TRAINLY_ASSETS.quizzes} alt="Trainly quizzes" />
          <span>Quizzes</span>
        </div>
        <div className="trainly-module-card">
          <img src={TRAINLY_ASSETS.evaluations} alt="Trainly evaluations" />
          <span>Evaluations</span>
        </div>
        <div className="trainly-module-card">
          <img src={TRAINLY_ASSETS.flashcards} alt="Trainly flashcards" />
          <span>Flashcards</span>
        </div>
      </div>

      <div className="trainly-source-note">
        Visual assets from the public Trainly demo · Flock I+D
      </div>
    </div>
  </div>
);

function App() {
  const portfolioRef = useRef<HTMLDivElement>(null);

  usePortfolioMotion(portfolioRef);

  return (
    <div className="portfolio-shell" ref={portfolioRef}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Tomás Garbarino home">
          <span className="brand-mark">TG</span>
          <span className="brand-copy">
            <strong>Tomás Garbarino</strong>
            <small>Product Engineer · AI</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#work" data-section-link="work">Work</a>
          <a href="#experience" data-section-link="experience">Experience</a>
          <a href="#about" data-section-link="about">About</a>
        </nav>

        <a
          className="header-cta"
          href="https://www.linkedin.com/in/tomas-garbarino/"
          target="_blank"
          rel="noreferrer"
        >
          Let's talk <ArrowUpRight size={15} />
        </a>
      </header>

      <main>
        <section className="hero section-wrap" id="top">
          <div className="hero-copy">
            <div className="eyebrow-pill" data-hero-reveal>
              <span className="status-dot" />
              Building AI products at Flock I+D
            </div>

            <div className="hero-role" data-hero-reveal>PRODUCT ENGINEER · AI PRODUCT BUILDER</div>

            <h1 aria-label="I turn messy workflows into AI products people can actually use.">
              <span className="hero-line-mask">
                <span className="hero-line" data-hero-line>I turn messy workflows</span>
              </span>
              <span className="hero-line-mask">
                <span className="hero-line hero-line-accent" data-hero-line>
                  into AI products people can actually use.
                </span>
              </span>
            </h1>

            <p className="hero-subtitle" data-hero-reveal>
              Product Engineer working across product thinking, UX, frontend, AI integrations and rapid validation — from an ambiguous problem to a working system.
            </p>

            <div className="hero-actions" data-hero-reveal>
              <a className="btn btn-primary" href="#trainly">
                View proof of work <ArrowRight size={17} />
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

            <div className="proof-row" aria-label="Professional highlights" data-hero-reveal>
              <div>
                <strong>Flock I+D</strong>
                <span>Product Engineer · current</span>
              </div>
              <div>
                <strong>Batech</strong>
                <span>Frontend Engineer → Lead</span>
              </div>
              <div>
                <strong>Hogarth</strong>
                <span>Global production work</span>
              </div>
            </div>
          </div>

          <div className="hero-system" aria-label="Selected product build log">
            <div className="system-glow system-glow-one" />
            <div className="system-glow system-glow-two" />
            <div className="system-window proof-console">
              <div className="window-topbar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>selected-build-log.json</span>
                <span className="live-chip">LIVE</span>
              </div>

              <div className="system-body">
                <div className="system-label-row">
                  <div className="system-label">PROOF CONSOLE</div>
                  <span>03 SELECTED BUILDS</span>
                </div>
                <a className="flow-node flow-node-active" href="#trainly">
                  <span className="node-icon"><Boxes size={16} /></span>
                  <div>
                    <small>01 · TRAINLY</small>
                    <strong>Product flow · frontend · AI integration</strong>
                  </div>
                  <span className="node-state current">CURRENT</span>
                </a>
                <div className="flow-line" />
                <a className="flow-node" href="#insurance-workflow">
                  <span className="node-icon"><ShieldCheck size={16} /></span>
                  <div>
                    <small>02 · INSURANCE WORKFLOW</small>
                    <strong>Multi-agent ops · human checkpoints</strong>
                  </div>
                  <span className="node-state">PROTOTYPE</span>
                </a>
                <div className="flow-line" />
                <a className="flow-node" href="#immersive-ai">
                  <span className="node-icon"><AudioLines size={16} /></span>
                  <div>
                    <small>03 · VOICE + 3D</small>
                    <strong>Realtime training experience experiments</strong>
                  </div>
                  <span className="node-state">R&D</span>
                </a>
                <p className="console-footnote">Open any build to inspect its scope and evidence.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Toolkit">
          <div className="trust-track">
            <span>PRODUCT ENGINEERING</span><i />
            <span>AI WORKFLOWS</span><i />
            <span>RAPID PROTOTYPING</span><i />
            <span>HUMAN-IN-THE-LOOP</span><i />
            <span>REAL-TIME EXPERIENCES</span>
          </div>
        </section>

        <section className="motion-marquee" aria-hidden="true">
          <div className="marquee-row marquee-row-primary" data-marquee="left">
            <span>BUILD · VALIDATE · SHIP · BUILD · VALIDATE · SHIP ·</span>
          </div>
          <div className="marquee-row marquee-row-outline" data-marquee="right">
            <span>PRODUCT · AI · EXPERIENCE · PRODUCT · AI · EXPERIENCE ·</span>
          </div>
        </section>

        <section className="section-wrap work-section" id="work">
          <div className="section-heading">
            <div>
              <span className="section-kicker">SELECTED WORK</span>
              <h2>Work that shows how I think.</h2>
            </div>
            <p>
              Less “technology showcase”, more problem → product → validation. The goal is to build useful systems and learn fast.
            </p>
          </div>

          <article className="featured-project trainly-featured" id="trainly">
            <div className="featured-copy">
              <div className="project-meta">
                <span className="current-badge">CURRENT FOCUS</span>
                <span>FLOCK · PRODUCTO · VALIDATION</span>
              </div>

              <img className="trainly-copy-logo" src="/trainly-logo.svg" alt="Trainly" />

              <p className="featured-lead">
                An AI-assisted product focused on transforming operational knowledge into structured learning and competency validation.
              </p>
              <p className="featured-description">
                My current focus is helping turn the idea into a product that can be demonstrated, validated with real use cases and iterated from feedback — working across product flow, frontend, AI integrations and experimentation.
              </p>

              <div className="role-grid">
                <div>
                  <span>WHAT I OWN</span>
                  <strong>Product flow + frontend</strong>
                </div>
                <div>
                  <span>STATUS</span>
                  <strong>Active validation</strong>
                </div>
                <div>
                  <span>EVIDENCE</span>
                  <strong>Research + real product assets</strong>
                </div>
              </div>

              <div className="featured-proof">
                <span>VERIFIABLE PROOF</span>
                <p>Public product research, real interface assets and a demo-ready product flow — with no invented outcome metrics.</p>
              </div>

              <a className="text-link" href={TRAINLY_URL} target="_blank" rel="noreferrer">
                Read the official Trainly research <ArrowUpRight size={16} />
              </a>
            </div>

            <TrainlyShowcase />
          </article>

          <div className="project-reel" data-horizontal-reel>
            <div className="project-reel-heading">
              <div>
                <span className="section-kicker">SUPPORTING BUILDS</span>
                <strong>Three experiments. One product mindset.</strong>
              </div>
              <span className="reel-instruction">SCROLL TO EXPLORE →</span>
            </div>

            <div className="reel-orb" aria-hidden="true">
              <span />
            </div>

            <div className="project-track" data-horizontal-track>
              {projects.map((project, index) => {
                const Icon = project.icon;
                return (
                  <article
                    className="project-card"
                    data-project-panel
                    data-index={`0${index + 1}`}
                    id={project.id}
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
                      <span>PROOF</span>
                      <p>{project.proof}</p>
                    </div>
                    <div className="tag-row">
                      {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <a className="project-link" href={project.href}>
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
              <span className="section-kicker">OPERATING MODE</span>
              <h2>Builder first. Technology second.</h2>
            </div>
          </div>

          <div className="capability-grid">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
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
            <span>Current toolkit</span>
            <div>
              {toolkit.map((tool) => <strong key={tool}>{tool}</strong>)}
            </div>
          </div>
        </section>

        <section className="section-wrap experience-section" id="experience">
          <div className="section-heading compact-heading">
            <div>
              <span className="section-kicker">EXPERIENCE</span>
              <h2>From frontend specialist to product builder.</h2>
            </div>
          </div>

          <div className="experience-list">
            {experiences.map((experience, index) => (
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
              <span className="section-kicker">NEXT</span>
              <h2>Have an interesting product or workflow problem?</h2>
              <p>
                I'm interested in AI Product Engineer / Product Engineer roles and selected projects where AI can create real operational value.
              </p>
            </div>
            <div className="contact-actions">
              <a
                className="btn btn-primary"
                href="https://www.linkedin.com/in/tomas-garbarino/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={17} /> Connect on LinkedIn
              </a>
              <a className="btn btn-secondary" href="mailto:tomasgarbarino.dev@gmail.com">
                <Mail size={17} /> Email me
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="new-footer section-wrap">
        <div>
          <span className="brand-mark small">TG</span>
          <span>Tomás Garbarino · Product Engineer</span>
        </div>
        <div className="footer-links">
          <a href="https://github.com/tomigarbarino" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/tomas-garbarino/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>

      <nav className="mobile-dock" aria-label="Mobile quick navigation">
        <a href="#work" data-section-link="work"><Boxes size={16} /> Work</a>
        <a href="#experience" data-section-link="experience"><Code2 size={16} /> Experience</a>
        <a href="mailto:tomasgarbarino.dev@gmail.com"><Mail size={16} /> Email</a>
      </nav>
    </div>
  );
}

export default App;
