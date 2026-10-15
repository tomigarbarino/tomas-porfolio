import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArtifactDrag } from "./ArtifactDrag";
import { PeelSticker } from "./PeelSticker";
import { AmbientMotion } from "./AmbientMotion";
import { MotionPreference } from "./MotionPreference";
import { TrainlyCaseMotion } from "./TrainlyCaseMotion";
import { TrainlyLoopExplorer } from "./TrainlyLoopExplorer";
import { TrainlySectionNav } from "./TrainlySectionNav";
import { SiteHeader } from "./SiteHeader";
import { ScrollMotion } from "./ScrollMotion";
import { trainlyCase } from "@/data/portfolio";
import { trainlyDossier } from "@/data/trainly-dossier";
import "@/app/portfolio-art-direction.css";
import "./trainly-dossier.css";

function SectionHeading({ number, label, title, children }: { number: string; label: string; title: ReactNode; children?: ReactNode }) {
  return <header className="td-section-heading" data-scroll-depth="10"><p className="td-label"><span>{number}</span> / {label}</p><h2>{title}</h2>{children && <div className="td-section-intro">{children}</div>}</header>;
}

function EvidenceFrame({ id, image, title, alt, width, height, priority = false }: { id?: string; image: string; title: string; alt: string; width: number; height: number; priority?: boolean }) {
  const source = `/media/trainly/${image}`;
  return <figure id={id} className="td-evidence-frame" data-drag-frame>
    <ArtifactDrag label={`Move ${title}`} />
    <div className="td-frame-bar"><span>{title}</span><a href={source} target="_blank" rel="noopener noreferrer" aria-label={`Open image at full size: ${title} (new tab)`}>Open image <span aria-hidden="true">↗</span></a></div>
    <Image src={source} alt={alt} width={width} height={height} draggable={false} priority={priority} sizes={priority ? "(max-width: 799px) 94vw, 48vw" : "(max-width: 799px) 94vw, (max-width: 1179px) 84vw, 1000px"} />
  </figure>;
}

export function TrainlyDossier() {
  return <MotionPreference><AmbientMotion /><ScrollMotion />
    <a className="skip-link" href="#case-content">Skip to case study</a>
    <main id="main" className="td">
      <div className="portfolio-backdrop" aria-hidden="true" />
      <TrainlyCaseMotion />
      <SiteHeader context="case" />
      <section className="td-hero" id="top" data-drag-boundary aria-labelledby="trainly-case-title">
        <div className="td-hero-copy" data-scroll-depth="14"><p className="td-label">Case file 02 / Flock I+D</p><h1 id="trainly-case-title">Trainly.<br /><span>Learning,<br />in a loop.</span></h1><p className="td-hero-deck">From scattered documents to evidence of competence.</p><p className="td-hero-description">At Flock I+D, I work on product flow, frontend and AI integration for Trainly’s learning and conversational assessment workflows.</p><dl className="td-role"><div><dt>My role</dt><dd>Product Engineer</dd></div><div><dt>My scope</dt><dd>Product flow · Frontend · AI</dd></div><div><dt>Status</dt><dd>{trainlyCase.status}</dd></div></dl><a className="td-link td-link--primary" href="#challenge">Open the case <span aria-hidden="true">↓</span></a></div>
        <div className="td-hero-art" data-scroll-depth="-36">
          <EvidenceFrame image="trainly-03-actividad-clase-narrada-tutor.png" title="Trainly / lesson + contextual tutor" alt="Actual Trainly interface with fictional demo data: a narrated lesson beside the AI tutor's explain, example and practice-question actions." width={1440} height={900} priority />
          <div className="td-hero-sticker"><PeelSticker art="duck" title="Ask the duck." fact="The evaluator asks for explanations and examples, then follows the learner’s reasoning." tone="cream" /></div>
          <p className="td-hero-edition" aria-hidden="true">KNOWLEDGE<br />→ LEARNING<br />→ EVIDENCE</p>
        </div>
      </section>

      <div className="td-case-layout" id="case-content">
        <aside className="td-rail"><TrainlySectionNav sections={trainlyDossier.sections} /><p className="td-rail-note">02 / TRAINLY<br />Flock I+D</p></aside>
        <div className="td-content">
          <section id="challenge" className="td-section td-challenge" data-scroll-depth="-24" data-drag-boundary aria-labelledby="trainly-challenge-title">
            <SectionHeading number="01" label="The challenge" title={<span id="trainly-challenge-title">Understanding<br />needs evidence.</span>}><p>Corporate learning often stops at delivery: a person receives a document, attends a session or completes a course. The organization still needs to know whether that knowledge can be explained or applied.</p></SectionHeading>
            <div className="td-challenge-grid"><ol className="td-friction-list">{trainlyDossier.challenges.map((item,index) => <li key={item}><span>0{index+1}</span><p>{item}</p></li>)}</ol><div className="td-product-bet" data-drag-frame><ArtifactDrag label="Move the Trainly product bet" /><p className="td-label">The product bet</p><h3>Teach it.<br />Question it.<br />Improve it.</h3><p>What if existing company knowledge could become structured training—and understanding could be tested in conversation?</p><span className="td-bet-mark" aria-hidden="true">↗</span></div></div>
            <div className="td-contribution"><p className="td-label">My contribution</p><p>{trainlyCase.contribution}</p><ul>{trainlyCase.scope.map(item => <li key={item}>{item}</li>)}</ul><p className="td-contribution-context">The team built the initial platform, document import and oral assessment. My work includes source handling, the reviewable plan, narration, learning progression and the manager’s action center. These captures show the actual application in a local demo with fictional data.</p></div>
          </section>

          <section id="loop" className="td-section" data-scroll-depth="-24" aria-labelledby="trainly-loop-title">
            <SectionHeading number="02" label="The product loop" title={<span id="trainly-loop-title">One connected<br />feedback loop.</span>}><p>The value comes from connecting content generation, individual learning, conversational assessment and team visibility.</p></SectionHeading>
            <TrainlyLoopExplorer />
            <details className="td-disclosure"><summary>Read all five stages <span aria-hidden="true">+</span></summary><ol>{trainlyDossier.stages.map(item => <li key={item.name}><strong>{item.name}</strong><p>{item.body} {item.detail}</p></li>)}</ol></details>
          </section>

          <section id="experience" className="td-section" data-scroll-depth="-24" data-drag-boundary aria-labelledby="trainly-experience-title">
            <SectionHeading number="03" label="Learning experience" title={<span id="trainly-experience-title">Before the course,<br />a human decision.</span>}><p>Generating a course is easy. Keeping it faithful to the source is the harder product problem. I worked on a reviewable plan that traces chapters to the source material and blocks generation when a contradiction needs a person’s decision.</p><p>Here, two sections disagree about a height threshold. The training owner must resolve that conflict before approving the plan. The AI proposes the structure; the person owns the decision.</p></SectionHeading>
            <EvidenceFrame id="learning-sequence" image="trainly-02-plan-decision-bloqueante@2x.png" title="01 / Source → plan → human decision" alt="Actual Trainly plan review with fictional demo data: chapters cite source documents, a conflicting height threshold requires a human decision, and Approve plan and generate is disabled." width={2880} height={1800} />
            <div className="td-evidence-pair"><div className="td-format-note" data-drag-frame><ArtifactDrag label="Move the learning formats note" /><p className="td-label">One path / multiple formats</p><ul>{trainlyDossier.formats.map((item,index) => <li key={item}><span>0{index+1}</span>{item}</li>)}</ul></div><p className="td-experience-story">After review, the same material becomes a learning path. I worked on narration, source context and presentations by level. In the lesson, a learner can pause to ask the tutor for an explanation, an example or a practice question tied to the current slide.</p></div>
            <EvidenceFrame id="trainly-campus" image="trainly-03-actividad-clase-narrada-tutor.png" title="02 / Narrated lesson + contextual tutor" alt="Actual Trainly learning interface with fictional demo data: a narrated lesson and slide-specific AI tutor with explanation, example and question actions." width={1440} height={900} />
          </section>

          <section id="validation" className="td-section td-validation" data-scroll-depth="-24" data-drag-boundary aria-labelledby="trainly-validation-title">
            <SectionHeading number="04" label="Practice & assessment" title={<span id="trainly-validation-title">Test the answer.<br />Explore the reasoning.</span>}><p>Quizzes give the learner a practice check. Conversational assessment follows a separate path: technical questions, concrete examples and follow-up on the learner’s reasoning.</p></SectionHeading>
            <div id="evaluation-approach" className="td-validation-note" data-drag-frame><ArtifactDrag label="Move the conversational assessment note" /><p className="td-label">Live AI interview / product approach</p><div><span>Ask</span><i aria-hidden="true">→</i><span>Explain</span><i aria-hidden="true">→</i><span>Explore</span></div><p>Technical questions. Concrete examples. Follow-up on the reasoning.</p></div>
            <EvidenceFrame image="trainly-04-cuestionario-feedback.png" title="Practice / quiz feedback" alt="Actual Trainly quiz with fictional demo data: an incorrect answer is highlighted in red after a completed chapter." width={1440} height={900} />
            <p className="td-evidence-insight">The quiz surfaced an improvement opportunity: it marks an incorrect answer, but does not yet explain it or reveal the correct one. A useful feedback loop needs to help the learner recover, not just record the mistake.</p>
          </section>

          <section id="system" className="td-section" data-scroll-depth="-24" data-drag-boundary aria-labelledby="trainly-system-title">
            <SectionHeading number="05" label="The product system" title={<span id="trainly-system-title">Individual learning.<br />A next step for the team.</span>}><p>A dashboard needs to lead to action. I worked on the manager’s center so it surfaces overdue training, a priority case and follow-up or reminder actions alongside progress and active study time.</p></SectionHeading>
            <EvidenceFrame id="trainly-manager" image="trainly-05-seguimiento-responsable.png" title="Team training / manager action center" alt="Actual Trainly manager interface with fictional demo data: priority cases, overdue assignments, follow-up and reminder actions, and active study time by chapter." width={1440} height={900} />
            <div className="td-architecture"><header><p className="td-label">System responsibilities</p><h3>Tools and roles<br />across the product.</h3></header><dl>{trainlyCase.system.map((item,index) => <div key={item.name} data-drag-frame><dt><span>0{index+1}</span>{item.name}</dt><dd><ArtifactDrag label={`Move the ${item.name} system card`} />{item.purpose}</dd></div>)}</dl></div>
          </section>

          <section id="learnings" className="td-section" data-scroll-depth="-24" data-drag-boundary aria-labelledby="trainly-learnings-title">
            <SectionHeading number="06" label="Learnings & next" title={<span id="trainly-learnings-title">The insight<br />was the loop.</span>}><p>Training becomes more useful when teaching, evaluating and improving are designed as one connected system.</p></SectionHeading>
            <div className="td-learnings-grid">{trainlyDossier.learnings.map(item => <article key={item.title} data-kind={item.label.toLowerCase()} data-drag-frame><ArtifactDrag label={`Move note: ${item.title}`} /><p className="td-label">{item.label}</p><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
            <div className="td-status" data-drag-frame><ArtifactDrag label="Move the Trainly evidence status" /><p className="td-label">Current status / in use and growing</p><h3>In use.<br />Growing.</h3><p>Clients use Trainly, and the product continues to grow. Explore the product flow, interface and implementation.</p></div>
          </section>
        </div>
      </div>
      <footer className="td-footer"><Image src="/media/trainly/trainly-logo.svg" alt="Trainly" width={328} height={80} /><h2 data-scroll-depth="-20">Build the system.<br /><span>Validate the learning.</span></h2><div><Link className="td-link td-link--primary" href="/en/agora" prefetch={true}>Next case / Agora <span aria-hidden="true">↗</span></Link><Link className="td-link" href="/#work" prefetch={true}>Explore more work →</Link><Link className="td-link" href="/#contact" prefetch={true}>Let’s work together ↗</Link></div><p>Tomás Garbarino / Product Engineer · Applied AI</p></footer>
    </main>
  </MotionPreference>;
}
