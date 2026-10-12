"use client";

import { useEffect, useId, useRef, useState } from "react";
import { trainlyDossier } from "@/data/trainly-dossier";
import { ArtifactDrag } from "./ArtifactDrag";

const stageArtifacts = [
  { href: "#learning-sequence", label: "View source → learning concept", kind: "Concept visual", note: "Illustrates the transformation. A source document is not included in this dossier." },
  { href: "#learning-sequence", label: "View the learning sequence concept", kind: "Concept visual", note: "Illustrates a structured learning path; this is not an agent execution trace." },
  { href: "#trainly-campus", label: "Inspect the campus interface", kind: "Product interface", note: "The published capture shows the campus in its learning and onboarding state." },
  { href: "#evaluation-approach", label: "Read the evaluation approach", kind: "Product approach", note: "Questions and follow-up are described here. A learner conversation is not included." },
  { href: "#trainly-manager", label: "Inspect the manager interface", kind: "Product interface", note: "A public-demo capture of team training; demo values are not learning-outcome data." },
] as const;

export function TrainlyLoopExplorer() {
  const [active, setActive] = useState(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const stage = trainlyDossier.stages[active];
  function cancelPreview() {
    if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  }
  function select(index: number) {
    cancelPreview();
    setActive(index);
  }
  useEffect(() => () => { if (hoverTimer.current !== null) clearTimeout(hoverTimer.current); }, []);
  return (
    <div className="td-loop-explorer" data-drag-boundary>
      <p className="td-note">Conceptual product loop</p>
      <ol className="td-stage-list" aria-label="Explore the five product stages">
        {trainlyDossier.stages.map((item, index) => <li key={item.name}>
          <button id={`${panelId}-trigger-${index}`} type="button" aria-pressed={active === index} aria-controls={`${panelId}-stage-${index}`} onClick={() => select(index)} onPointerEnter={event => {
            if (event.pointerType !== "mouse") return;
            cancelPreview();
            hoverTimer.current = setTimeout(() => {
              if (!detailRef.current?.contains(document.activeElement)) select(index);
            }, 200);
          }} onPointerLeave={cancelPreview} onPointerCancel={cancelPreview} onFocus={event => { if (event.currentTarget.matches(":focus-visible")) select(index); }}><span>0{index + 1}</span><strong>{item.name}</strong><span aria-hidden="true">↗</span></button>
        </li>)}
      </ol>
      <div className="td-stage-detail" data-drag-frame ref={detailRef}>
        <ArtifactDrag label="Move the selected product stage" />
        <div className="td-stage-count" aria-hidden="true">0{active + 1}</div>
        <div className="td-stage-copy">
          {trainlyDossier.stages.map((item, index) => <div
            key={item.name}
            className="td-stage-content"
            id={`${panelId}-stage-${index}`}
            role="region"
            aria-labelledby={`${panelId}-trigger-${index}`}
            aria-hidden={active !== index}
            inert={active !== index}
            data-selected={active === index}
          >
            <p className="td-label">{item.name} / inside the loop</p><h3>{item.title}</h3><p>{item.body}</p><p>{item.detail}</p>
            <span className="td-stage-output">{item.output}</span>
            <div className="td-stage-artifact"><span>{stageArtifacts[index].kind}</span><a href={stageArtifacts[index].href}>{stageArtifacts[index].label} <span aria-hidden="true">↗</span></a><p>{stageArtifacts[index].note}</p></div>
          </div>)}
        </div>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Stage {active + 1} of {trainlyDossier.stages.length}: {stage.name}. {stage.title}</p>
      </div>
    </div>
  );
}
