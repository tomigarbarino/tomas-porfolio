"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArtifactDrag } from "./ArtifactDrag";
import "./portfolio-dialogs.css";

export type PortfolioDialog = "profile" | "quests" | null;
type Props = { selected: PortfolioDialog; onDismiss: () => void };
const chapterShortcuts = [
  { id: "story-files", label: "01 / MINECRAFT FILES" },
  { id: "story-conversations", label: "02 / DIGITAL MENUS" },
  { id: "story-hogarth", label: "03 / HOGARTH → BATECH → FLOCK" },
];
const steps = [
  { question: "What starts a learning loop?", answer: "Source", feedback: "Start with source material. The flow needs something to work from." },
  { question: "Now help someone use that material.", answer: "Learn", feedback: "Learning comes next: turn the material into an experience someone can use." },
  { question: "How do you see what they understood?", answer: "Assess", feedback: "Assessment reveals understanding. Shipping alone does not tell you what someone learned." },
];

export function PortfolioDialogs({ selected, onDismiss }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const gameStatus = useRef<HTMLDivElement>(null);
  const questTitle = useRef<HTMLHeadingElement>(null);
  const navigationTarget = useRef<HTMLElement | null>(null);
  const [view, setView] = useState<"hub" | "game">("hub");
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState(false);
  const dismiss = useRef(onDismiss);
  useEffect(() => { dismiss.current = onDismiss; }, [onDismiss]);
  useEffect(() => {
    if (selected !== "quests") return;
    if (view === "game") gameStatus.current?.focus({ preventScroll: true });
    else questTitle.current?.focus({ preventScroll: true });
  }, [selected, view, step, wrong]);

  useEffect(() => {
    const node = dialog.current;
    if (!node || !selected) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    navigationTarget.current = null;
    node.showModal();
    close.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      if (node.open) node.close();
      document.body.style.overflow = overflow;
      const destination = navigationTarget.current;
      if (destination) {
        // Close the modal before native fragment scrolling and focus transfer.
        if (window.location.hash === "#" + destination.id) destination.scrollIntoView({ block: "start" });
        else window.location.hash = destination.id;
        requestAnimationFrame(() => {
          if (!node.open && destination.isConnected) destination.focus({ preventScroll: true });
        });
      } else previous?.focus({ preventScroll: true });
    };
  }, [selected]);

  function choose(value: string) {
    if (value === steps[step].answer) { setStep(step + 1); setWrong(false); }
    else setWrong(true);
  }

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.tabIndex = -1;
    navigationTarget.current = target;
    onDismiss();
  }

  return (
    <dialog ref={dialog} className="portfolio-dialog" data-drag-frame aria-labelledby="dialog-title" onClose={() => dismiss.current()} onClick={e => {
      if (e.target !== e.currentTarget) return;
      const rect = e.currentTarget.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dismiss.current();
    }}>
      <div className="dialog-bar"><span>{selected === "profile" ? "QUICK PROFILE / TOMÁS GARBARINO" : "SIDE QUESTS"}</span><ArtifactDrag label="Move this window" /><button ref={close} type="button" aria-label="Close dialog" onClick={onDismiss}>×</button></div>
      <div className="dialog-content">
        {selected === "profile" ? <>
          <p className="eyebrow">PRODUCT ENGINEER / APPLIED AI</p>
          <h2 id="dialog-title">Product Engineer.<br />Applied AI.</h2>
          <p>Currently at Flock I+D.</p>
          <dl className="profile-grid"><div><dt>Current products</dt><dd>Agora · Product Owner<br />Trainly · Product Engineer</dd></div><div><dt>Opportunities</dt><dd>Product Engineer / Forward Deployed Engineer</dd></div><div><dt>Product status</dt><dd>Agora and Trainly are used by clients and growing.</dd></div></dl>
          <div className="dialog-actions"><a className="button-primary" href="#work" onClick={event => navigate(event, "work")}>View case studies →</a><a href="mailto:tomasgarbarino.dev@gmail.com">Get in touch ↗</a></div>
          <p><a href="/en/orquestador">Own project: Orquestador — evidence, AI and human review →</a></p><div className="profile-links"><a href="https://www.linkedin.com/in/tomas-garbarino/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/tomigarbarino" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        </> : <>
          <div className="quest-heading"><p className="eyebrow">A LITTLE CONTEXT. A LITTLE PLAY.</p>{view !== "hub" && <button type="button" onClick={() => setView("hub")}>← All quests</button>}</div>
          <h2 ref={questTitle} tabIndex={-1} id="dialog-title">{view === "hub" ? "Follow a lead.\nOr play a little." : "Connect the loop."}</h2>
          {view === "hub" && <><p>Jump to a chapter, or connect a learning loop.</p><div className="quest-list">{chapterShortcuts.map(item => <a key={item.id} href={`#${item.id}`} onClick={event => navigate(event, item.id)}><span>{item.label}</span><span aria-hidden="true">↗</span></a>)}<button type="button" className="game-entry" onClick={() => { setStep(0); setWrong(false); setView("game"); }}><span>04 / CONNECT A LEARNING LOOP</span><span>Play →</span></button></div><a href="#work" onClick={event => navigate(event, "work")}>Case studies →</a></>}
          {view === "game" && <div className="learning-game">
            <ol className="game-progress" aria-label="Learning loop progress">{["Source", "Learn", "Assess"].map((label, index) => <li key={label} className={step > index ? "connected" : ""}><span>{String(index + 1).padStart(2, "0")}</span>{step > index ? label : "?"}</li>)}</ol>
            <div ref={gameStatus} tabIndex={-1} aria-live="polite" aria-atomic="true">{step === 3 ? <><h3>Loop connected.</h3><p>Source → Learn → Assess. A simplified learning loop inspired by Trainly.</p></> : <><p className="game-question">{steps[step].question}</p>{wrong && <p className="game-feedback">{steps[step].feedback}</p>}</>}</div>
            {step < 3 && !wrong && <div className="game-options">{["Source", "Learn", "Assess", "Publish"].map(option => <button type="button" key={option} onClick={() => choose(option)}>{option} →</button>)}</div>}
            {wrong && <button type="button" className="button-primary" onClick={() => setWrong(false)}>Try again →</button>}
            {step === 3 && <><a className="button-primary" href="#trainly" onClick={event => navigate(event, "trainly")}>See the Trainly case →</a><button type="button" className="game-replay" onClick={() => { setStep(0); setWrong(false); }}>Play again ↺</button></>}
          </div>}
        </>}
      </div>
    </dialog>
  );
}
