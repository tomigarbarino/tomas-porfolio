"use client";

import { Fragment, useId, useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import ArtifactDrag from "./ArtifactDrag";
import { useChapterScrollView } from "./StoryWorkbenches";
import "./conceptual-product-flow.css";

const stages = [
  { label: "Problem & hypothesis", shortLabel: "Problem", title: "A course should not silently choose.", copy: "Conflicting sources need a visible decision before generation." },
  { label: "Research", title: "Keep the source in view.", copy: "Connect proposed chapters to the documents behind them." },
  { label: "Implementation", displayLabel: "Implement", title: "Surface the conflict in the plan.", copy: "Make the plan reviewable, so a person can resolve the conflict before generation." },
  { label: "Validation", displayLabel: "Validate", title: "Unresolved means blocked.", copy: "The captured demo keeps approval and generation disabled until the conflict is resolved." },
  { label: "Insights", title: "AI proposes. A person decides.", copy: "A person owns the plan." },
] as const;

const contributions = {
  agora: { name: "Agora", title: "Product ownership + AI.", copy: "I own product priorities, build AI features and shape candidate UX.", href: "/en/agora#decision" },
  trainly: { name: "Trainly", title: "Learning frontend + AI.", copy: "I connect the learning frontend, AI integration and assessment.", href: "/en/trainly#experience" },
} as const;

type Props = {
  active: boolean;
  paused: boolean;
  product: keyof typeof contributions | null;
  contributionId: string;
  onInspectStage: () => void;
};

export function ConceptualProductFlow({ active: visible, paused, product, contributionId, onInspectStage }: Props) {
  const id = useId();
  const frameRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  // Motion controls stop decoration, never the narrative selected by reading.
  const { scrollView: scrollStage, view: active, setHoveredView, setFocusedView } = useChapterScrollView("story-interfaces", stages.length, { active: visible, paused: false }, frameRef);
  const contribution = product ? contributions[product] : null;

  function inspect(index: number, keyboard = false) {
    onInspectStage();
    if (keyboard) { setHoveredView(null); setFocusedView(index); }
    else setHoveredView(index);
  }

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
      data-motion={visible && !paused}
      onPointerLeave={() => setHoveredView(null)}
      onBlurCapture={event => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setFocusedView(null);
      }}
      onKeyDown={event => {
        if (event.key !== "Escape" || event.defaultPrevented) return;
        setHoveredView(null);
        setFocusedView(null);
        onInspectStage();
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <ArtifactDrag label="Move the product process" relatedTargets={stages.map((stage, index) => ({ label: stage.label, id: `${id}-move-step-${index}` }))} />
      <p className="conceptual-flow__heading">{contribution ? "Flock / product contributions" : "Trainly / one product rule"} <span className="conceptual-flow__current">0{active + 1} / current</span></p>
      <div className="conceptual-flow__rail" role="group" aria-label="Trainly product process">
        {stages.map((stage, index) => (
          <Fragment key={stage.label}>
            {index > 0 ? <i className="conceptual-flow__connection" data-lit={active >= index} aria-hidden="true">→</i> : null}
            <div className="conceptual-flow__item" data-drag-frame data-flow-node={index}>
              <ArtifactDrag label={`Move ${stage.label} node`} menuId={`${id}-move-step-${index}`} className="artifact-drag--keyboard" />
              <button
              ref={element => { buttons.current[index] = element; }}
              type="button"
              className="conceptual-flow__node"
              data-drag-enabled
              id={`${id}-node-${index}`}
              aria-expanded={!contribution && active === index}
              aria-current={index === active ? "step" : undefined}
              aria-controls={`${id}-note-${index}`}
              onPointerMove={event => {
                if (event.pointerType !== "mouse" || event.buttons) return;
                inspect(index);
              }}
              onFocus={event => {
                if (!event.currentTarget.matches(":focus-visible")) return;
                inspect(index, true);
              }}
              onBlur={() => setFocusedView(null)}
              onClick={() => inspect(index, true)}
              onKeyDown={event => navigate(event, index)}
            >
              <span className="conceptual-flow__number">0{index + 1}</span>{" "}
              {"shortLabel" in stage ? <><span className="conceptual-flow__label--full">{stage.label}</span><span className="conceptual-flow__label--short">{stage.shortLabel}</span></> : "displayLabel" in stage ? stage.displayLabel : stage.label}
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
            aria-hidden={contribution !== null || active !== index}
            inert={contribution !== null || active !== index}
            data-selected={!contribution && active === index}
          >
            <p className="conceptual-flow__note-label">0{index + 1} / {stage.label}</p>
            <p className="conceptual-flow__note-title">{stage.title}</p>
            <p>{stage.copy}</p>
            {index === stages.length - 1 ? <Link className="conceptual-flow__case-link" href="/en/trainly#experience">Explore Trainly <span aria-hidden="true">↗</span></Link> : null}
          </div>
        ))}
        <div
          id={contributionId}
          className="conceptual-flow__note conceptual-flow__contribution"
          data-flock-contribution
          data-selected={contribution !== null}
          aria-hidden={contribution === null}
          inert={contribution === null}
          role="region"
          aria-label="My product contribution"
        >
          {contribution ? <>
            <p className="conceptual-flow__note-label">{contribution.name} / my contribution</p>
            <p className="conceptual-flow__note-title">{contribution.title}</p>
            <p>{contribution.copy}</p>
            <Link className="conceptual-flow__case-link" href={contribution.href}>Explore {contribution.name} <span aria-hidden="true">↗</span></Link>
          </> : null}
        </div>
      </div>
    </div>
  );
}
