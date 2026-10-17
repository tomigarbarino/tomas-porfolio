"use client";

import { useEffect, useId, useRef, useState } from "react";
import { trainlyDossier } from "@/data/trainly-dossier";
import { ArtifactDrag } from "./ArtifactDrag";

const stageArtifacts = [
  { href: "#learning-sequence", label: "Explore the learning sequence" },
  { href: "#learning-sequence", label: "View the learning sequence" },
  { href: "#trainly-campus", label: "Inspect the campus interface" },
  { href: "#evaluation-approach", label: "Read the evaluation approach" },
  { href: "#trainly-manager", label: "Inspect the manager interface" },
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
      <div className="td-console-bar"><span>TRAINLY / LEARNING CONSOLE</span><span>MODULE 0{active + 1} / 05</span></div>
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
            <div className="td-stage-artifact"><a href={stageArtifacts[index].href}>{stageArtifacts[index].label} <span aria-hidden="true">↗</span></a></div>
          </div>)}
        </div>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Stage {active + 1} of {trainlyDossier.stages.length}: {stage.name}. {stage.title}</p>
      </div>
        <div className="td-console-transport"><button type="button" disabled={active === 0} onClick={() => select(active - 1)}>← Previous module</button><span aria-hidden="true">{trainlyDossier.stages.map((_, index) => <i key={index} data-active={index <= active} />)}</span><button type="button" disabled={active === trainlyDossier.stages.length - 1} onClick={() => select(active + 1)}>Next module →</button></div>
    </div>
  );
}
