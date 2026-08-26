import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  FileStack,
  Gauge,
  MessageCircleMore,
  Network,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import "../trainly-case-study.css";

const chapters = [
  ["01", "Challenge", "challenge"],
  ["02", "Product loop", "loop"],
  ["03", "Experience", "experience"],
  ["04", "Validation", "validation"],
  ["05", "System", "system"],
  ["06", "Learnings", "learnings"],
];

const loop = [
  { icon: FileStack, step: "01", title: "Source", text: "Upload manuals, procedures and existing knowledge." },
  { icon: BrainCircuit, step: "02", title: "Structure", text: "Specialized agents turn source material into a learning sequence." },
  { icon: Sparkles, step: "03", title: "Learn", text: "Chapters, visuals, quizzes and flashcards create multiple learning paths." },
  { icon: MessageCircleMore, step: "04", title: "Validate", text: "A live AI interview tests reasoning instead of answer recognition." },
  { icon: Gauge, step: "05", title: "Improve", text: "Managers see progress and gaps, closing the feedback loop." },
];

function TrainlyCaseStudy() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Trainly case study — Tomás Garbarino";
    window.scrollTo(0, 0);
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="trainly-case">
      <header className="site-header case-site-header">
        <a className="brand" href="/#top" aria-label="Tomás Garbarino portfolio">
          <span className="brand-copy">
            <strong>Tomás Garbarino</strong>
            <small>Product Engineer / AI Builder</small>
          </span>
        </a>

        <nav className="site-nav case-site-nav" aria-label="Case study navigation">
          <a href="#challenge"><span className="nav-index">01</span> Challenge</a>
          <a href="#experience"><span className="nav-index">02</span> Experience</a>
          <a href="#system"><span className="nav-index">03</span> System</a>
        </nav>

        <a className="header-cta" href="https://www.linkedin.com/in/tomas-garbarino/" target="_blank" rel="noreferrer">
          <span className="header-cta-label">Let&apos;s talk</span>
          <span className="header-cta-icon"><ArrowUpRight size={14} /></span>
        </a>
      </header>

      <main>
        <section className="case-hero">
          <div className="case-hero-copy">
            <div className="case-kicker"><span /> PRODUCT CASE STUDY · 2026</div>
            <h1>From scattered documents to <em>evidence of competence.</em></h1>
            <p className="case-intro">Trainly is a multi-agent learning platform designed around one uncomfortable truth: course completion does not prove understanding.</p>
            <div className="case-meta">
              <div><span>ROLE</span><strong>Product Engineer</strong></div>
              <div><span>SCOPE</span><strong>Product flow · Frontend · AI</strong></div>
              <div><span>STATUS</span><strong>Active validation</strong></div>
            </div>
          </div>
          <figure className="case-hero-visual">
            <img src="/trainly/case-study/hero.png" alt="Trainly visual identity on an orange background" />
            <figcaption>TRAINLY · LEARNING VALIDATION SYSTEM</figcaption>
          </figure>
        </section>

        <div className="case-layout">
          <aside className="case-sidebar" aria-label="Case study sections">
            <span>JUMP TO</span>
            {chapters.map(([index, label, id]) => <a href={`#${id}`} key={id}><small>{index}</small>{label}</a>)}
          </aside>

          <article className="case-story">
            <section className="case-section challenge-section" id="challenge">
              <div className="case-section-label">01 · THE CHALLENGE</div>
              <h2>Access is not learning.<br />Completion is not competence.</h2>
              <div className="case-problem-grid">
                <p>Corporate learning often stops at delivery: a person receives a document, attends a session or completes a course. The organization still cannot tell whether that knowledge can be explained or applied.</p>
                <div className="case-thesis"><span>THE PRODUCT BET</span><strong>What if existing company knowledge could become structured training—and understanding could be tested in conversation?</strong></div>
              </div>
              <div className="case-frictions">
                <div><span>01</span><p>Operational knowledge is scattered across PDFs, manuals and processes.</p></div>
                <div><span>02</span><p>Building and updating courses manually makes training slow to scale.</p></div>
                <div><span>03</span><p>Attendance and multiple-choice scores reveal little about real reasoning.</p></div>
                <div><span>04</span><p>Managers lack a clear view of understanding and knowledge gaps.</p></div>
              </div>
            </section>

            <section className="case-section" id="loop">
              <div className="case-section-label">02 · THE PRODUCT LOOP</div>
              <h2>A closed system for teaching, evaluating and improving.</h2>
              <p className="case-section-intro">Trainly is not another course repository or a chatbot attached to one. Its value comes from connecting content generation, individual learning, conversational assessment and team visibility.</p>
              <div className="case-loop">
                {loop.map(({ icon: Icon, step, title, text }) => <div className="case-loop-item" key={step}><div><span>{step}</span><Icon size={21} /></div><h3>{title}</h3><p>{text}</p></div>)}
              </div>
              <figure className="case-wide-image warm-frame"><img loading="lazy" decoding="async" src="/trainly/case-study/learning-experience.png" alt="Trainly concept showing documents transformed into learning experiences" /></figure>
            </section>

            <section className="case-section" id="experience">
              <div className="case-section-label">03 · LEARNING EXPERIENCE</div>
              <h2>Generation is useful only when it creates a coherent path.</h2>
              <div className="case-two-column">
                <p>The system interprets one or more source documents, identifies themes and relationships, then sequences prerequisites, explanations and examples. Specialized agents create chapters and complementary formats instead of producing a flat summary.</p>
                <div className="case-detail-list">
                  <span><CheckCircle2 size={17} /> Chapters with structured progression</span>
                  <span><CheckCircle2 size={17} /> Generated visual reinforcement</span>
                  <span><CheckCircle2 size={17} /> Quizzes and flashcards</span>
                  <span><CheckCircle2 size={17} /> Narration and live evaluations</span>
                </div>
              </div>
              <figure className="case-wide-image"><img loading="lazy" decoding="async" src="/trainly/campus-ai.png" alt="Trainly AI campus interface" /></figure>
              <figure className="case-wide-image"><img loading="lazy" decoding="async" src="/trainly/case-study/ai-design.png" alt="Trainly learning formats including presentations, flashcards and live evaluations" /></figure>
            </section>

            <section className="case-section validation-section" id="validation">
              <div className="case-section-label">04 · COMPETENCY VALIDATION</div>
              <h2>Replace answer recognition with a conversation that reveals reasoning.</h2>
              <div className="validation-card">
                <div className="validation-orbit"><MessageCircleMore size={34} /><span /></div>
                <div><span>LIVE AI INTERVIEW</span><p>The evaluator asks technical questions, requests examples and follows the learner&apos;s reasoning. The goal is to distinguish understanding from repetition—not to simulate a human examiner for its own sake.</p></div>
              </div>
              <figure className="case-wide-image"><img loading="lazy" decoding="async" src="/trainly/case-study/validation.png" alt="Trainly visual for conversational competency validation" /></figure>
            </section>

            <section className="case-section" id="system">
              <div className="case-section-label">05 · PRODUCT SYSTEM</div>
              <h2>Individual learning on one side. Operational visibility on the other.</h2>
              <p className="case-section-intro">The learner experience is paired with an administrative layer where managers can inspect progress, results and gaps. This turns training into an observable product loop.</p>
              <div className="case-image-pair">
                <figure><img loading="lazy" decoding="async" src="/trainly/capacitar-equipos.png" alt="Trainly team training product interface" /><figcaption>TEAM TRAINING</figcaption></figure>
                <figure><img loading="lazy" decoding="async" src="/trainly/metricas-accionables.png" alt="Trainly actionable metrics dashboard" /><figcaption>ACTIONABLE EVIDENCE</figcaption></figure>
              </div>
              <div className="architecture-card">
                <div><Network size={24} /><span>SYSTEM ARCHITECTURE</span></div>
                <ul>
                  <li><strong>Next.js</strong><span>Product interface and application layer</span></li>
                  <li><strong>Supabase</strong><span>Users, training, results and progress</span></li>
                  <li><strong>LangGraph</strong><span>Agent orchestration and stateful workflows</span></li>
                  <li><strong>OpenAI + Gemini</strong><span>Text generation and visual reinforcement</span></li>
                </ul>
              </div>
            </section>

            <section className="case-section learnings-section" id="learnings">
              <div className="case-section-label">06 · LEARNINGS & NEXT</div>
              <h2>The strongest insight was not about AI. It was about the loop.</h2>
              <blockquote>Training becomes more useful when teaching, evaluating and improving are designed as one connected system.</blockquote>
              <div className="case-next-grid">
                <div><span>LEARNING</span><p>Existing institutional knowledge can be the raw material for faster, contextual training.</p></div>
                <div><span>LEARNING</span><p>Visual variety supports complex content, but structure matters more than content volume.</p></div>
                <div><span>NEXT</span><p>Deeper personalization and industry-specific evaluation patterns.</p></div>
                <div><span>NEXT</span><p>Richer dashboards, traceability and feedback for managers and learners.</p></div>
              </div>
              <div className="case-honesty"><span>CURRENT EVIDENCE</span><p>The product flow, interface and technical architecture are implemented and demo-ready. Quantitative learning outcomes are not presented here because they have not yet been validated at a level worth claiming.</p></div>
            </section>
          </article>
        </div>

        <section className="case-close">
          <img src="/trainly-logo.svg" alt="Trainly" />
          <h2>Build the system.<br />Validate the learning.</h2>
          <a className="btn btn-primary" href="/#work">Explore more work <ArrowRight size={18} /></a>
        </section>
      </main>

      <footer className="new-footer section-wrap case-footer"><span>Tomás Garbarino · Product Engineer</span><a href="/">Back to portfolio</a></footer>
    </div>
  );
}

export default TrainlyCaseStudy;
