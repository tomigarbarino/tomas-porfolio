"use client";

import { useEffect, useRef, useState } from "react";
import { ArtifactDrag } from "./ArtifactDrag";

export type PortfolioDialog = "profile" | "quests" | null;
type Props = { selected: PortfolioDialog; onDismiss: () => void };
const facts = [
  { title: "Before I knew it was code.", copy: "I started changing Minecraft files to make the game do different things, before I understood what programming was. Curiosity came first.", label: "01 / MINECRAFT FILES" },
  { title: "Out of the browser. Into restaurants.", copy: "I went to restaurants on my own to offer digital menus. It was an early move from making something to talking to the people who might use it.", label: "02 / DIGITAL MENUS" },
  { title: "The interface became the system.", copy: "My path moved through frontend work at Hogarth, frontend leadership at Batech and product engineering with AI R&D at Flock.", label: "03 / INTERFACES → AI" },
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
  const [view, setView] = useState<"hub" | "fact" | "game">("hub");
  const [fact, setFact] = useState(0);
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState(false);
  const dismiss = useRef(onDismiss);
  useEffect(() => { dismiss.current = onDismiss; }, [onDismiss]);
  useEffect(() => {
    if (selected !== "quests") return;
    if (view === "game") gameStatus.current?.focus({ preventScroll: true });
    else questTitle.current?.focus({ preventScroll: true });
  }, [selected, view, fact, step, wrong]);

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
      (navigationTarget.current ?? previous)?.focus({ preventScroll: true });
    };
  }, [selected]);

  function choose(value: string) {
    if (value === steps[step].answer) { setStep(step + 1); setWrong(false); }
    else setWrong(true);
  }

  function navigate(id: string, chapter?: number) {
    const target = document.getElementById(id);
    if (target) {
      target.tabIndex = -1;
      navigationTarget.current = target;
    }
    if (chapter !== undefined) window.dispatchEvent(new CustomEvent("tg-story-chapter", { detail: chapter }));
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
          <h2 id="dialog-title">From interfaces<br />to applied AI.</h2>
          <p>I build product experiences for AI-powered workflows, connecting product flow, frontend and AI integration.</p>
          <dl className="profile-grid"><div><dt>Current focus</dt><dd>Product engineering & AI R&D</dd></div><div><dt>Exploring</dt><dd>Product Engineer / Forward Deployed Engineer</dd></div><div><dt>Selected work</dt><dd>Agora / Trainly / Batech</dd></div></dl>
          <p>At Agora, I work as Product Owner across client discovery, product priorities, architecture decisions and hands-on AI implementation.</p>
          <p className="muted">Agora is ongoing product work. Trainly is demo-ready and in active validation. My contribution at Batech is frontend engineering and leadership.</p>
          <div className="dialog-actions"><a className="button-primary" href="#work" onClick={() => navigate("work")}>See selected work →</a><a href="mailto:tomasgarbarino.dev@gmail.com">Get in touch ↗</a></div>
          <div className="profile-links"><a href="https://www.linkedin.com/in/tomas-garbarino/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/tomigarbarino" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        </> : <>
          <div className="quest-heading"><p className="eyebrow">A LITTLE CONTEXT. A LITTLE PLAY.</p>{view !== "hub" && <button type="button" onClick={() => setView("hub")}>← All quests</button>}</div>
          <h2 ref={questTitle} tabIndex={-1} id="dialog-title">{view === "hub" ? "There’s more\nto the story." : view === "fact" ? facts[fact].title : "Connect the loop."}</h2>
          {view === "hub" && <><p>A few things behind the work.</p><div className="quest-list">{facts.map((item, index) => <button type="button" key={item.label} onClick={() => { setFact(index); setView("fact"); }}><span>{item.label}</span><span>↗</span></button>)}<button type="button" className="game-entry" onClick={() => { setStep(0); setWrong(false); setView("game"); }}><span>04 / CONNECT A LEARNING LOOP</span><span>Play →</span></button></div><a href="#work" onClick={() => navigate("work")}>Selected work →</a></>}
          {view === "fact" && <><p className="eyebrow">{facts[fact].label}</p><p>{facts[fact].copy}</p><a className="button-primary" href={`#story-${["files", "conversations", "hogarth"][fact]}`} onClick={() => navigate(`story-${["files", "conversations", "hogarth"][fact]}`)}>Explore the story →</a></>}
          {view === "game" && <div className="learning-game">
            <ol className="game-progress" aria-label="Learning loop progress">{["Source", "Learn", "Assess"].map((label, index) => <li key={label} className={step > index ? "connected" : ""}><span>{String(index + 1).padStart(2, "0")}</span>{step > index ? label : "?"}</li>)}</ol>
            <div ref={gameStatus} tabIndex={-1} aria-live="polite" aria-atomic="true">{step === 3 ? <><h3>Loop connected.</h3><p>Source → Learn → Assess. A simplified learning loop inspired by Trainly.</p></> : <><p className="game-question">{steps[step].question}</p>{wrong && <p className="game-feedback">{steps[step].feedback}</p>}</>}</div>
            {step < 3 && !wrong && <div className="game-options">{["Source", "Learn", "Assess", "Publish"].map(option => <button type="button" key={option} onClick={() => choose(option)}>{option} →</button>)}</div>}
            {wrong && <button type="button" className="button-primary" onClick={() => setWrong(false)}>Try again →</button>}
            {step === 3 && <><a className="button-primary" href="#trainly" onClick={() => navigate("trainly")}>See the Trainly case →</a><button type="button" className="game-replay" onClick={() => { setStep(0); setWrong(false); }}>Play again ↺</button></>}
          </div>}
        </>}
      </div>
    </dialog>
  );
}
