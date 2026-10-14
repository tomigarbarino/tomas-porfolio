"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { ArtifactDrag } from "./ArtifactDrag";
import "./story-workbenches.css";
import { storyReadingLine } from "./story-scroll";

type Props = { active: boolean; paused: boolean };

const layouts = [
  { label: "Compact", copy: "One column. A clear reading order when the interface has less room." },
  { label: "Editorial", copy: "A stronger hierarchy. The same pieces, with a different rhythm." },
  { label: "Wide", copy: "More room to compose. Components keep their place in the system." },
] as const;

const responsibilities = [
  { label: "Build", copy: "I built the SaaS frontend from the ground up with React and TypeScript." },
  { label: "Organize", copy: "I organized the frontend by domain, giving product features a clearer structure." },
  { label: "Lead", copy: "Frontend leadership remained hands-on: I continued delivering product features." },
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

export function useChapterScrollView(chapterId: string, count: number, { active, paused }: Props, frameRef: RefObject<HTMLDivElement | null>) {
  const [scrollView, setScrollView] = useState(0);
  const scrollViewRef = useRef(0);
  const [hoveredView, setHoveredView] = useState<number | null>(null);
  const [focusedView, setFocusedView] = useState<number | null>(null);
  useEffect(() => {
    const chapter = document.getElementById(chapterId);
    const surface = frameRef.current;
    if (!active || paused || !chapter || !surface) return;
    let raf = 0;
    let heldPointer: number | null = null;
    let lastScrollY = window.scrollY;
    function sync() {
      raf = 0;
      if (document.hidden || heldPointer !== null || surface!.hasAttribute("data-artifact-dragging")) return;
      const box = chapter!.getBoundingClientRect();
      if (!box.height) return;
      // Same reading band as OriginStory; no added scroll distance or wheel capture.
      const line = storyReadingLine(chapter!.closest(".origin-story"));
      const progress = Math.max(0, Math.min(1, (line - box.top) / box.height));
      const next = Math.min(count - 1, Math.floor(progress * count));
      if (window.scrollY !== lastScrollY || next !== scrollViewRef.current) {
        // Manual exploration lasts until reading resumes, without blurring controls.
        setHoveredView(null);
        setFocusedView(null);
      }
      lastScrollY = window.scrollY;
      if (next !== scrollViewRef.current) {
        scrollViewRef.current = next;
        setScrollView(next);
      }
    }
    function schedule() {
      if (!raf && !document.hidden) raf = requestAnimationFrame(sync);
    }
    function down(event: PointerEvent) {
      if (event.isPrimary && event.button === 0) heldPointer = event.pointerId;
    }
    function release(event: PointerEvent) {
      if (heldPointer === event.pointerId) heldPointer = null;
      schedule();
    }
    function blur() { heldPointer = null; schedule(); }
    function visibility() {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; heldPointer = null; }
      else schedule();
    }
    const resize = new ResizeObserver(schedule);
    resize.observe(chapter);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointerup", release, true);
    window.addEventListener("pointercancel", release, true);
    window.addEventListener("blur", blur);
    surface.addEventListener("pointerdown", down, true);
    document.addEventListener("visibilitychange", visibility);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointerup", release, true);
      window.removeEventListener("pointercancel", release, true);
      window.removeEventListener("blur", blur);
      surface.removeEventListener("pointerdown", down, true);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [chapterId, count, active, paused, frameRef]);
  return { scrollView, view: focusedView ?? hoveredView ?? scrollView, setHoveredView, setFocusedView };
}

export function HogarthWorkbench({ active, paused }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const preview = useRef<HTMLDivElement>(null);
  const id = useId();
  const { scrollView, view, setHoveredView, setFocusedView } = useChapterScrollView("story-hogarth", layouts.length, { active, paused }, frameRef);
  useInspectionHalo(preview, active && !paused);

  return <div ref={frameRef} className="story-workbench story-workbench--hogarth" data-drag-frame data-view={view} data-scroll-view={scrollView} data-motion={active && !paused}>
    <ArtifactDrag label="Move the Hogarth interface study" />
    <header className="story-workbench__bar"><p>Hogarth / frontend<span>Conceptual interface study</span></p></header>
    <div className="story-workbench__controls" role="group" aria-label="Interface composition">
      {layouts.map((layout, index) => <button key={layout.label} type="button" ref={node => { buttons.current[index] = node; }} aria-pressed={view === index} aria-controls={`${id}-preview ${id}-detail`} onPointerEnter={event => { if (event.pointerType === "mouse" && !event.buttons) setHoveredView(index); }} onPointerLeave={() => setHoveredView(null)} onPointerCancel={() => setHoveredView(null)} onFocus={() => setFocusedView(index)} onBlur={() => setFocusedView(null)} onClick={() => setFocusedView(index)} onKeyDown={event => moveFocus(event, index, buttons)}>{layout.label}</button>)}
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

export function BatechDomainMap({ active, paused, controller }: Props & { controller: ReturnType<typeof useChapterScrollView> }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const { scrollView, view, setHoveredView, setFocusedView } = controller;
  return <div ref={frameRef} className="story-workbench story-workbench--batech" data-drag-frame data-view={view} data-scroll-view={scrollView} data-motion={active && !paused}>
    <ArtifactDrag label="Move the Batech responsibility map" />
    <div className="story-workbench__controls" role="group" aria-label="Batech responsibilities">
      {responsibilities.map((responsibility, index) => <button key={responsibility.label} type="button" ref={node => { buttons.current[index] = node; }} aria-pressed={view === index} aria-controls={`${id}-detail`} onPointerEnter={event => { if (event.pointerType === "mouse" && !event.buttons) setHoveredView(index); }} onPointerLeave={() => setHoveredView(null)} onPointerCancel={() => setHoveredView(null)} onFocus={() => setFocusedView(index)} onBlur={() => setFocusedView(null)} onClick={() => setFocusedView(index)} onKeyDown={event => moveFocus(event, index, buttons)}>{responsibility.label}</button>)}
    </div>
    <div className="story-workbench__detail" id={`${id}-detail`}><p>{responsibilities[view].copy}</p></div>
  </div>;
}
