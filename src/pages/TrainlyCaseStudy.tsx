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
import { LanguageSwitch } from "../components/LanguageSwitch";
import { useLanguage } from "../contexts/LanguageContext";
import { portfolioContent, trainlyContent } from "../i18n/content";
import "../trainly-case-study.css";
import { applySeoMetadata, getPagePath, getSeoMetadata } from "../lib/seo";

const chapterIds = ["challenge", "loop", "experience", "validation", "system", "learnings"];
const loopIcons = [FileStack, BrainCircuit, Sparkles, MessageCircleMore, Gauge];

function TrainlyCaseStudy() {
  const { language } = useLanguage();
  const copy = trainlyContent[language];
  const portfolioCopy = portfolioContent[language];
  const homePath = getPagePath("home", language);
  const projectInquiryHref = `mailto:tomasgarbarino.dev@gmail.com?subject=${encodeURIComponent(portfolioCopy.contact.mailSubject)}&body=${encodeURIComponent(portfolioCopy.contact.mailBody)}`;

  useEffect(() => {
    applySeoMetadata(getSeoMetadata("trainly", language));
    window.scrollTo(0, 0);
  }, [language]);

  return (
    <div className="trainly-case">
      <header className="site-header case-site-header">
        <a className="brand" href={`${homePath}#top`} aria-label={copy.homeLabel}>
          <span className="brand-copy">
            <strong>Tomás Garbarino</strong>
            <small>{copy.role}</small>
          </span>
        </a>

        <nav className="site-nav case-site-nav" aria-label={copy.navLabel}>
          <a href="#challenge"><span className="nav-index">01</span> {copy.nav[0]}</a>
          <a href="#experience"><span className="nav-index">02</span> {copy.nav[1]}</a>
          <a href="#system"><span className="nav-index">03</span> {copy.nav[2]}</a>
        </nav>

        <div className="header-tools">
          <LanguageSwitch />
          <a className="header-cta" href={projectInquiryHref} data-cta="case-header-project-inquiry">
            <span className="header-cta-label">{copy.talk}</span>
            <span className="header-cta-icon"><ArrowUpRight size={14} /></span>
          </a>
        </div>
      </header>

      <main>
        <section className="case-hero">
          <div className="case-hero-copy">
            <div className="case-kicker"><span /> {copy.kicker}</div>
            <h1>{copy.hero[0]}<em>{copy.hero[1]}</em></h1>
            <p className="case-intro">{copy.intro}</p>
            <div className="case-meta">
              {copy.meta.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
            </div>
          </div>
          <figure className="case-hero-visual">
            <img src="/trainly/case-study/hero.png" alt={copy.heroAlt} />
            <figcaption>{copy.heroCaption}</figcaption>
          </figure>
        </section>

        <div className="case-layout">
          <aside className="case-sidebar" aria-label={copy.sidebarLabel}>
            <span>{copy.jump}</span>
            {copy.chapters.map((label, index) => <a href={`#${chapterIds[index]}`} key={chapterIds[index]}><small>0{index + 1}</small>{label}</a>)}
          </aside>

          <article className="case-story">
            <section className="case-section challenge-section" id="challenge">
              <div className="case-section-label">{copy.challenge.label}</div>
              <h2>{copy.challenge.title[0]}<br />{copy.challenge.title[1]}</h2>
              <div className="case-problem-grid">
                <p>{copy.challenge.body}</p>
                <div className="case-thesis"><span>{copy.challenge.betLabel}</span><strong>{copy.challenge.bet}</strong></div>
              </div>
              <div className="case-frictions">
                {copy.challenge.frictions.map((friction, index) => <div key={friction}><span>0{index + 1}</span><p>{friction}</p></div>)}
              </div>
            </section>

            <section className="case-section" id="loop">
              <div className="case-section-label">{copy.loop.label}</div>
              <h2>{copy.loop.title}</h2>
              <p className="case-section-intro">{copy.loop.intro}</p>
              <div className="case-loop">
                {copy.loop.steps.map(([title, text], index) => {
                  const Icon = loopIcons[index];
                  return <div className="case-loop-item" key={title}><div><span>0{index + 1}</span><Icon size={21} /></div><h3>{title}</h3><p>{text}</p></div>;
                })}
              </div>
              <figure className="case-wide-image warm-frame"><img loading="lazy" decoding="async" src="/trainly/case-study/learning-experience.png" alt={copy.experience.learningAlt} /></figure>
            </section>

            <section className="case-section" id="experience">
              <div className="case-section-label">{copy.experience.label}</div>
              <h2>{copy.experience.title}</h2>
              <div className="case-two-column">
                <p>{copy.experience.body}</p>
                <div className="case-detail-list">
                  {copy.experience.details.map((detail) => <span key={detail}><CheckCircle2 size={17} /> {detail}</span>)}
                </div>
              </div>
              <figure className="case-wide-image"><img loading="lazy" decoding="async" src="/trainly/campus-ai.png" alt={copy.experience.campusAlt} /></figure>
              <figure className="case-wide-image"><img loading="lazy" decoding="async" src="/trainly/case-study/ai-design.png" alt={copy.experience.designAlt} /></figure>
            </section>

            <section className="case-section validation-section" id="validation">
              <div className="case-section-label">{copy.validation.label}</div>
              <h2>{copy.validation.title}</h2>
              <div className="validation-card">
                <div className="validation-orbit"><MessageCircleMore size={34} /><span /></div>
                <div><span>{copy.validation.live}</span><p>{copy.validation.body}</p></div>
              </div>
              <figure className="case-wide-image"><img loading="lazy" decoding="async" src="/trainly/case-study/validation.png" alt={copy.validation.imageAlt} /></figure>
            </section>

            <section className="case-section" id="system">
              <div className="case-section-label">{copy.system.label}</div>
              <h2>{copy.system.title}</h2>
              <p className="case-section-intro">{copy.system.intro}</p>
              <div className="case-image-pair">
                <figure><img loading="lazy" decoding="async" src="/trainly/capacitar-equipos.png" alt="Interfaz de capacitación de equipos en Trainly" /><figcaption>{copy.system.team}</figcaption></figure>
                <figure><img loading="lazy" decoding="async" src="/trainly/metricas-accionables.png" alt="Tablero de métricas accionables de Trainly" /><figcaption>{copy.system.evidence}</figcaption></figure>
              </div>
              <div className="architecture-card">
                <div><Network size={24} /><span>{copy.system.architecture}</span></div>
                <ul>
                  {copy.system.tech.map(([technology, description]) => <li key={technology}><strong>{technology}</strong><span>{description}</span></li>)}
                </ul>
              </div>
            </section>

            <section className="case-section learnings-section" id="learnings">
              <div className="case-section-label">{copy.learnings.label}</div>
              <h2>{copy.learnings.title}</h2>
              <blockquote>{copy.learnings.quote}</blockquote>
              <div className="case-next-grid">
                {copy.learnings.cards.map(([label, body], index) => <div key={`${label}-${index}`}><span>{label}</span><p>{body}</p></div>)}
              </div>
              <div className="case-honesty"><span>{copy.learnings.honesty}</span><p>{copy.learnings.honestyBody}</p></div>
            </section>
          </article>
        </div>

        <section className="case-close">
          <img src="/trainly-logo.svg" alt="Trainly" />
          <h2>{copy.close[0]}<br />{copy.close[1]}</h2>
          <a className="btn btn-primary" href={`${homePath}#work`}>{copy.explore} <ArrowRight size={18} /></a>
        </section>
      </main>

      <footer className="new-footer section-wrap case-footer"><span>Tomás Garbarino · {language === "es" ? "Ingeniero de Producto" : "Product Engineer"}</span><a href={homePath}>{copy.back}</a></footer>
    </div>
  );
}

export default TrainlyCaseStudy;
