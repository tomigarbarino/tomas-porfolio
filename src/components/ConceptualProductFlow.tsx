"use client";

import { Fragment, useId, useRef, useState, type KeyboardEvent } from "react";
import ArtifactDrag from "./ArtifactDrag";
import "./conceptual-product-flow.css";

const stages = [
  { label: "Experience", copy: "Frontend work: the screens, states and feedback people use." },
  { label: "Product flow", copy: "Product work: connecting learning, assessment and team visibility." },
  { label: "Integration", copy: "AI work: connecting the interface to agents and their results." },
] as const;

export function ConceptualProductFlow() {
  const id = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const active = dismissed ? null : hovered ?? focused ?? pinned;

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
      className="origin-story__system-map conceptual-flow"
      data-drag-frame
      data-drag-boundary
      data-open={active !== null}
      data-stage={active ?? "none"}
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
        if (event.key !== "Escape" || event.defaultPrevented || active === null) return;
        setPinned(null);
        setDismissed(true);
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <ArtifactDrag label="Move the conceptual product flow" />
      <p className="conceptual-flow__heading">Conceptual product flow</p>
      <div className="conceptual-flow__rail" role="group" aria-label="Conceptual product flow">
        {stages.map((stage, index) => (
          <Fragment key={stage.label}>
            {index > 0 ? <i className="conceptual-flow__connection" data-lit={active !== null && active >= index} aria-hidden="true">→</i> : null}
            <div className="conceptual-flow__item" data-drag-frame data-flow-node={index}>
              <ArtifactDrag label={`Move ${stage.label} node`} />
              <button
              ref={element => { buttons.current[index] = element; }}
              type="button"
              className="conceptual-flow__node"
              data-drag-enabled
              id={`${id}-node-${index}`}
              aria-expanded={active === index}
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
