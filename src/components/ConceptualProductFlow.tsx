"use client";

import { Fragment, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import ArtifactDrag from "./ArtifactDrag";
import "./conceptual-product-flow.css";
import { storyReadingLine } from "./story-scroll";

const stages = [
  { label: "Problem & hypothesis", copy: "Frame the real problem, the people affected and a testable product hypothesis." },
  { label: "Research", copy: "Talk to users, inspect the context and constraints, and turn findings into requirements." },
  { label: "Implementation", copy: "Prioritize a bounded solution and connect the product experience, frontend and AI." },
  { label: "Validation", copy: "Check actual behavior against the hypothesis and the expected requirements." },
  { label: "Insights", copy: "Turn what we learn into the next iteration: refine priorities, risks and the product hypothesis." },
] as const;

export function ConceptualProductFlow({ active: visible, paused }: { active: boolean; paused: boolean }) {
  const id = useId();
  const frameRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const [scrollStage, setScrollStage] = useState(0);
  const scrollStageRef = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const inspected = dismissed ? null : focused ?? hovered ?? pinned;
  const active = inspected ?? scrollStage;

  useEffect(() => {
    const chapter = document.getElementById("story-interfaces");
    const surface = frameRef.current;
    if (!visible || paused || !chapter || !surface) return;
    let raf = 0;
    let heldPointer: number | null = null;
    let lastScrollY = window.scrollY;
    function sync() {
      raf = 0;
      if (document.hidden || heldPointer !== null || surface!.querySelector('[data-artifact-dragging="true"]') || surface!.hasAttribute("data-artifact-dragging")) return;
      const box = chapter!.getBoundingClientRect();
      if (!box.height) return;
      const line = storyReadingLine(chapter!.closest(".origin-story"));
      const progress = Math.max(0, Math.min(1, (line - box.top) / box.height));
      const next = Math.min(stages.length - 1, Math.floor(progress * stages.length));
      if (window.scrollY !== lastScrollY || scrollStageRef.current !== next) {
        // Reading resumes after any real scroll, even within the same stage.
        // DOM focus and manual drag offsets remain with the user's controls.
        setHovered(null);
        setFocused(null);
        setPinned(null);
        setDismissed(false);
      }
      lastScrollY = window.scrollY;
      if (scrollStageRef.current !== next) {
        scrollStageRef.current = next;
        setScrollStage(next);
      }
    }
    function schedule() { if (!raf && !document.hidden) raf = requestAnimationFrame(sync); }
    function down(event: PointerEvent) { if (event.isPrimary && event.button === 0) heldPointer = event.pointerId; }
    function release(event: PointerEvent) { if (heldPointer === event.pointerId) heldPointer = null; schedule(); }
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
    document.addEventListener("visibilitychange", visibility);
    surface.addEventListener("pointerdown", down, true);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointerup", release, true);
      window.removeEventListener("pointercancel", release, true);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility);
      surface.removeEventListener("pointerdown", down, true);
    };
  }, [visible, paused]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % stages.length
      : event.key === "ArrowLeft" ? (index + stages.length - 1) % stages.length
      : event.key === "Home" ? 0 : event.key === "End" ? stages.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    buttons.current[next]?.focus({ preventScroll: true });
  }

  return (
    <div
      ref={frameRef}
      className="origin-story__system-map conceptual-flow conceptual-flow--process"
      data-drag-frame
      data-drag-boundary
      data-open="true"
      data-stage={active}
      data-scroll-stage={scrollStage}
      onPointerLeave={() => {
        setHovered(null);
        if (focused === null) setDismissed(false);
      }}
      onBlurCapture={event => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setFocused(null);
        if (hovered === null) setDismissed(false);
      }}
      onKeyDown={event => {
        if (event.key !== "Escape" || event.defaultPrevented || inspected === null) return;
        setPinned(null);
        setDismissed(true);
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <ArtifactDrag label="Move the product process" />
      <p className="conceptual-flow__heading">Product process <span className="conceptual-flow__current">0{active + 1} / current</span></p>
      <div className="conceptual-flow__rail" role="group" aria-label="Product process">
        {stages.map((stage, index) => (
          <Fragment key={stage.label}>
            {index > 0 ? <i className="conceptual-flow__connection" data-lit={active >= index} aria-hidden="true">→</i> : null}
            <div className="conceptual-flow__item" data-drag-frame data-flow-node={index}>
              <ArtifactDrag label={`Move ${stage.label} node`} />
              <button
              ref={element => { buttons.current[index] = element; }}
              type="button"
              className="conceptual-flow__node"
              data-drag-enabled
              id={`${id}-node-${index}`}
              aria-expanded={active === index}
              aria-current={index === active ? "step" : undefined}
              aria-controls={`${id}-note-${index}`}
              onPointerEnter={event => {
                if (event.pointerType !== "mouse") return;
                setHovered(index);
                setDismissed(false);
              }}
              onFocus={event => {
                if (!event.currentTarget.matches(":focus-visible")) return;
                setFocused(index);
                setHovered(null);
                setDismissed(false);
              }}
              onBlur={() => setFocused(current => current === index ? null : current)}
              onClick={() => {
                setPinned(pinned === index ? null : index);
                setDismissed(pinned === index);
              }}
              onKeyDown={event => navigate(event, index)}
            >
              <span className="conceptual-flow__number" aria-hidden="true">0{index + 1}</span>
              {stage.label}
              </button>
            </div>
          </Fragment>
        ))}
      </div>
      <div className="conceptual-flow__notes">
        {stages.map((stage, index) => (
          <div
            key={stage.label}
            className="conceptual-flow__note"
            id={`${id}-note-${index}`}
            role="region"
            aria-labelledby={`${id}-node-${index}`}
            aria-hidden={active !== index}
            inert={active !== index}
            data-selected={active === index}
          >
            <p className="conceptual-flow__note-label">0{index + 1} / {stage.label}</p>
            <p>{stage.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
