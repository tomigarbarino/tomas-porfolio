"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { ArtifactDrag } from "./ArtifactDrag";
import "./story-workbenches.css";

type Props = { active: boolean; paused: boolean };

const layouts = [
  { label: "Compact", copy: "One column. A clear reading order when the interface has less room." },
  { label: "Editorial", copy: "A stronger hierarchy. The same pieces, with a different rhythm." },
  { label: "Wide", copy: "More room to compose. Components keep their place in the system." },
] as const;

const responsibilities = [
  { label: "Build", copy: "I built the SaaS frontend from the ground up with React and TypeScript." },
  { label: "Organize", copy: "I organized the frontend by domain, giving product features a clearer structure." },
  { label: "Lead", copy: "I grew into frontend leadership while continuing to deliver product features." },
] as const;

function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number, buttons: RefObject<Array<HTMLButtonElement | null>>) {
  const count = buttons.current.length;
  const next = event.key === "ArrowRight" ? (index + 1) % count
    : event.key === "ArrowLeft" ? (index + count - 1) % count
    : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
  if (next === null) return;
  event.preventDefault();
  event.stopPropagation();
  buttons.current[next]?.focus({ preventScroll: true });
}

// Transient pointer motion stays outside React rendering and stops at rest.
function useInspectionHalo(surface: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const node = surface.current;
    const frame = node?.closest<HTMLElement>("[data-drag-frame]");
    if (!node || !frame || !enabled) return;
    let raf = 0;
    let previous = 0;
    const point = { x: 50, y: 50 };
    let target = { ...point };
    function stop() { cancelAnimationFrame(raf); raf = 0; previous = 0; }
    function follow(time: number) {
      if (document.hidden || frame!.hasAttribute("data-artifact-dragging")) { stop(); return; }
      const amount = 1 - Math.exp(-(previous ? Math.min(40, time - previous) : 16) / 150);
      previous = time;
      point.x += (target.x - point.x) * amount;
      point.y += (target.y - point.y) * amount;
      const settled = Math.abs(target.x - point.x) + Math.abs(target.y - point.y) < .1;
      if (settled) Object.assign(point, target);
      node!.style.setProperty("--inspect-x", `${point.x}%`);
      node!.style.setProperty("--inspect-y", `${point.y}%`);
      if (settled) { raf = 0; previous = 0; }
      else raf = requestAnimationFrame(follow);
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || event.buttons || document.hidden || frame!.hasAttribute("data-artifact-dragging")) { stop(); return; }
      const box = node!.getBoundingClientRect();
      if (!box.width || !box.height) return;
      target = {
        x: Math.max(6, Math.min(94, (event.clientX - box.left) / box.width * 100)),
        y: Math.max(6, Math.min(94, (event.clientY - box.top) / box.height * 100)),
      };
      if (!raf) raf = requestAnimationFrame(follow);
    }
    function hidden() { if (document.hidden) stop(); }
    node.addEventListener("pointermove", move, { passive: true });
    node.addEventListener("pointerleave", stop);
    frame.addEventListener("pointerdown", stop, true);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      stop();
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", stop);
      frame.removeEventListener("pointerdown", stop, true);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [surface, enabled]);
}

export function HogarthWorkbench({ active, paused }: Props) {
  const [view, setView] = useState(1);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const preview = useRef<HTMLDivElement>(null);
  const id = useId();
  useInspectionHalo(preview, active && !paused);

  return <div className="story-workbench story-workbench--hogarth" data-drag-frame data-view={view} data-motion={active && !paused}>
    <ArtifactDrag label="Move the Hogarth interface study" />
    <header className="story-workbench__bar"><p>Hogarth / frontend<span>Conceptual interface study</span></p></header>
    <div className="story-workbench__controls" role="group" aria-label="Interface composition">
      {layouts.map((layout, index) => <button key={layout.label} type="button" ref={node => { buttons.current[index] = node; }} aria-pressed={view === index} aria-controls={`${id}-preview ${id}-detail`} onPointerEnter={event => { if (event.pointerType === "mouse" && !event.buttons) setView(index); }} onFocus={() => setView(index)} onClick={() => setView(index)} onKeyDown={event => moveFocus(event, index, buttons)}>{layout.label}</button>)}
    </div>
    <div id={`${id}-preview`} ref={preview} className="story-workbench__preview" data-layout={view} aria-hidden="true">
      <div className="story-workbench__halo" />
      <div className="story-workbench__browser">
        <div className="story-workbench__mini-nav"><i /><i /><i /></div>
        <div className="story-workbench__mini-hero"><strong>INTERFACE</strong><i className="story-workbench__mini-lines" /><i className="story-workbench__mini-lines" /><i className="story-workbench__mini-lines" /></div>
        <div className="story-workbench__mini-cards"><i /><i /><i /></div>
      </div>
    </div>
    <div className="story-workbench__detail" id={`${id}-detail`}><p>{layouts[view].copy}</p></div>
  </div>;
}

export function BatechDomainMap({ active, paused }: Props) {
  const [view, setView] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  return <div className="story-workbench story-workbench--batech" data-drag-frame data-view={view} data-motion={active && !paused}>
    <ArtifactDrag label="Move the Batech responsibility map" />
    <header className="story-workbench__bar"><p>Build / organize / lead<span>Conceptual responsibility map</span></p></header>
    <div className="story-workbench__routes" aria-hidden="true">
      <svg viewBox="0 0 300 70" preserveAspectRatio="none"><path data-route="0" d="M30 16H150V54H270" /><path data-route="1" d="M30 54H90V16H210V54H270" /><path data-route="2" d="M30 16H270M150 16V54M30 54H270" /></svg>
      <span className="story-workbench__endpoint">UI</span><span className="story-workbench__endpoint">DOMAIN</span><span className="story-workbench__endpoint">TEAM</span>
    </div>
    <div className="story-workbench__controls" role="group" aria-label="Batech responsibilities">
      {responsibilities.map((responsibility, index) => <button key={responsibility.label} type="button" ref={node => { buttons.current[index] = node; }} aria-pressed={view === index} aria-controls={`${id}-detail`} onPointerEnter={event => { if (event.pointerType === "mouse" && !event.buttons) setView(index); }} onFocus={() => setView(index)} onClick={() => setView(index)} onKeyDown={event => moveFocus(event, index, buttons)}>{responsibility.label}</button>)}
    </div>
    <div className="story-workbench__detail" id={`${id}-detail`}><p>{responsibilities[view].copy}</p></div>
  </div>;
}
