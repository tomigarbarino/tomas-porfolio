import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BrainCircuit,
  Boxes,
  Code2,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "./App.css";

type Project = {
  title: string;
  eyebrow: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
};

type Experience = {
  period: string;
  role: string;
  company: string;
  description: string;
};

const TRAINLY_URL =
  "https://www.flocklabs.ar/projects/trainly-la-herramienta-para-validar-competencias-2-2-2";

const projects: Project[] = [
  {
    title: "Multi-agent Insurance Workflow",
    eyebrow: "AI OPERATIONS",
    description:
      "An operational prototype where AI agents help analyze a claim, consult policy and evidence, surface missing information and escalate decisions to a human operator.",
    tags: ["Agent orchestration", "Human-in-the-loop", "Operational UX"],
    icon: ShieldCheck,
  },
  {
    title: "Immersive & Conversational AI",
    eyebrow: "EXPERIMENTATION",
    description:
      "Real-time conversational AI, voice and immersive 3D interfaces explored as faster ways to create and iterate training experiences.",
    tags: ["Voice AI", "3D", "Real-time", "Rapid prototyping"],
    icon: AudioLines,
  },
  {
    title: "Prime OS",
    eyebrow: "PERSONAL R&D",
    description:
      "A personal operating system for turning fragmented context into better decisions, testable actions and measurable feedback loops.",
    tags: ["Agents", "Memory", "Tool use", "Decision systems"],
    icon: BrainCircuit,
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
    description: "LLMs, tool workflows, agents and human checkpoints designed around real product outcomes.",
    icon: Sparkles,
  },
  {
    title: "Product engineering",
    description: "From ambiguous requirement to interaction model, frontend, integrations, data and deployment.",
    icon: Code2,
  },
  {
    title: "Fast validation",
    description: "Prototype the riskiest assumption first, put it in front of real context and iterate from evidence.",
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

function App() {
  return (
    <div className="portfolio-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Tomás Garbarino home">
          <span className="brand-mark">TG</span>
          <span className="brand-copy">
            <strong>Tomás Garbarino</strong>
            <small>Product Engineer · AI</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
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
            <div className="eyebrow-pill">
              <span className="status-dot" />
              Building AI products at Flock I+D
            </div>

            <h1>
              I turn messy workflows into <span>AI products people can actually use.</span>
            </h1>

            <p className="hero-subtitle">
              Product Engineer working across product thinking, UX, frontend, AI integrations and rapid validation — from an ambiguous problem to a working system.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#trainly">
                Explore current work <ArrowRight size={17} />
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

            <div className="proof-row" aria-label="Professional highlights">
              <div>
                <strong>2022 → now</strong>
                <span>Shipping digital products</span>
              </div>
              <div>
                <strong>Product + AI</strong>
                <span>Current operating space</span>
              </div>
              <div>
                <strong>Buenos Aires</strong>
                <span>Open to global work</span>
              </div>
            </div>
          </div>

          <div className="hero-system" aria-label="AI product workflow visualization">
            <div className="system-glow system-glow-one" />
            <div className="system-glow system-glow-two" />
            <div className="system-window">
              <div className="window-topbar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>product-system.ts</span>
                <span className="live-chip">LIVE</span>
              </div>

              <div className="system-body">
                <div className="system-label">HOW I BUILD</div>
                <div className="flow-node flow-node-active">
                  <span className="node-icon"><Boxes size={16} /></span>
                  <div>
                    <small>01 · FRAME</small>
                    <strong>Understand the real workflow</strong>
                  </div>
                  <span className="node-state">context</span>
                </div>
                <div className="flow-line" />
                <div className="flow-node">
                  <span className="node-icon"><BrainCircuit size={16} /></span>
                  <div>
                    <small>02 · BUILD</small>
                    <strong>Prototype the AI interaction</strong>
                  </div>
                  <span className="node-state">system</span>
                </div>
                <div className="flow-line" />
                <div className="flow-node">
                  <span className="node-icon"><Workflow size={16} /></span>
                  <div>
                    <small>03 · VALIDATE</small>
                    <strong>Test in real context and iterate</strong>
                  </div>
                  <span className="node-state">signal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Toolkit">
          <div className="trust-track">
            <span>PRODUCT ENGINEERING</span>
            <i />
            <span>AI WORKFLOWS</span>
            <i />
            <span>RAPID PROTOTYPING</span>
            <i />
            <span>HUMAN-IN-THE-LOOP</span>
            <i />
            <span>REAL-TIME EXPERIENCES</span>
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

          <article className="featured-project" id="trainly">
            <div className="featured-copy">
              <div className="project-meta">
                <span className="current-badge">CURRENT FOCUS</span>
                <span>FLOCK · PRODUCTO · VALIDATION</span>
              </div>

              <h3>Trainly</h3>
              <p className="featured-lead">
                An AI-assisted product focused on learning workflows and competency validation.
              </p>
              <p className="featured-description">
                My current focus is helping turn the idea into a product that can be demonstrated, validated with real use cases and iterated from feedback — working across product flow, frontend, AI integrations and experimentation.
              </p>

              <div className="role-grid">
                <div>
                  <span>MY LENS</span>
                  <strong>Product engineering</strong>
                </div>
                <div>
                  <span>STAGE</span>
                  <strong>Validation</strong>
                </div>
                <div>
                  <span>LOOP</span>
                  <strong>Build → test → learn</strong>
                </div>
              </div>

              <a className="text-link" href={TRAINLY_URL} target="_blank" rel="noreferrer">
                Read the official Trainly research <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="trainly-product" aria-label="Trainly concept interface">
              <div className="trainly-topbar">
                <div className="trainly-brand">
                  <span className="trainly-logo"><GraduationCap size={16} /></span>
                  <div>
                    <strong>Trainly</strong>
                    <small>Learning workspace</small>
                  </div>
                </div>
                <span className="validation-chip">Validation</span>
              </div>

              <div className="trainly-layout">
                <aside className="trainly-sidebar">
                  <span className="sidebar-item active">Overview</span>
                  <span className="sidebar-item">Learning paths</span>
                  <span className="sidebar-item">Knowledge</span>
                  <span className="sidebar-item">Validation</span>
                </aside>

                <div className="trainly-main">
                  <div className="trainly-heading-row">
                    <div>
                      <small>CURRENT LEARNING FLOW</small>
                      <strong>Operational onboarding</strong>
                    </div>
                    <span className="mini-action">AI assisted</span>
                  </div>

                  <div className="trainly-cards">
                    <div className="mini-card">
                      <span>01</span>
                      <strong>Capture knowledge</strong>
                      <small>Turn operational context into structured learning.</small>
                    </div>
                    <div className="mini-card emphasized">
                      <span>02</span>
                      <strong>Guide & practice</strong>
                      <small>Use AI to support learning through the workflow.</small>
                    </div>
                  </div>

                  <div className="competency-card">
                    <div className="competency-header">
                      <div>
                        <small>COMPETENCY</small>
                        <strong>Process understanding</strong>
                      </div>
                      <span>In validation</span>
                    </div>
                    <div className="progress-track"><span /></div>
                    <div className="competency-footer">
                      <span>Context</span>
                      <span>Practice</span>
                      <span>Evidence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="project-grid">
            {projects.map((project) => {
              const Icon = project.icon;
              return (
                <article className="project-card" key={project.title}>
                  <div className="project-icon"><Icon size={20} /></div>
                  <span className="project-eyebrow">{project.eyebrow}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-row">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </article>
              );
            })}
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

        <section className="section-wrap contact-section">
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
    </div>
  );
}

export default App;
