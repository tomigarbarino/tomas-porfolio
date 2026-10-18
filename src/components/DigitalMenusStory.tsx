"use client";

import { recordMissionEvent } from "@/lib/visitor-missions";
import { useId, useRef, useState } from "react";
import { ArtifactDrag } from "./ArtifactDrag";
import { AsciiVideo } from "./AsciiVideo";
import { useChapterScrollView } from "./StoryWorkbenches";
import "./digital-menus-story.css";

const beats = [
  { label: "Make something", title: "An idea beyond the screen.", copy: "I wanted to bring digital menus to restaurants." },
  { label: "Take it outside", title: "I went to the restaurants.", copy: "On my own, I approached restaurants and offered digital menus." },
  { label: "Start a conversation", title: "Building also meant explaining.", copy: "Making something also meant starting the conversation." },
] as const;

export function DigitalMenusStory({ active, paused, src, poster }: { active: boolean; paused: boolean; src: string; poster: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const { scrollView } = useChapterScrollView("story-conversations", beats.length, { active, paused: false }, frame);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const cornerId = useId();
  const cornerOpen = hovered || focused || pinned;

  return <div className="digital-menus-story" data-beat={scrollView} data-motion={active && !paused}>
    <div className="origin-story__cafe-print" aria-hidden="true">
      <AsciiVideo src={src} poster={poster} paused={paused} className="origin-story__video" />
    </div>
    <div ref={frame} className="digital-menus-story__frame" data-drag-frame>
      <ArtifactDrag label="Move the conceptual menu" />
      <div className="digital-menus-story__paper" data-corner-open={cornerOpen}>
        <p className="digital-menus-story__menu-label">Conceptual menu</p>
        <strong className="digital-menus-story__menu-title">MENU</strong>
        <span className="digital-menus-story__rule" aria-hidden="true" />
        <span className="digital-menus-story__lines" aria-hidden="true"><i /><i /><i /><i /></span>
        <span id={cornerId} className="digital-menus-story__corner-note" hidden={!cornerOpen}>Out of<br />the screen.</span>
        <button
          className="digital-menus-story__corner"
          type="button"
          aria-label="Peek under the menu corner"
          aria-expanded={cornerOpen}
          aria-controls={cornerId}
          onPointerEnter={event => { if (event.pointerType === "mouse" && !event.buttons) setHovered(true); }}
          onPointerLeave={() => setHovered(false)}
          onPointerCancel={() => setHovered(false)}
          onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setFocused(true); }}
          onBlur={() => setFocused(false)}
          onClick={() => { if (!pinned) recordMissionEvent("menu-fold"); setPinned(current => !current); }}
          onKeyDown={event => {
            if (event.key !== "Escape" || event.defaultPrevented) return;
            setPinned(false); setHovered(false); setFocused(false);
            event.preventDefault(); event.stopPropagation();
          }}
        ><span className="digital-menus-story__fold" aria-hidden="true">↗</span></button>
      </div>
    </div>
    <div className="digital-menus-story__beats" role="group" aria-label="From an idea to conversations">
      {beats.map((beat, index) => <div key={beat.label} className="digital-menus-story__beat" data-selected={scrollView === index} aria-hidden={scrollView !== index} inert={scrollView !== index}>
        <p className="digital-menus-story__beat-label">0{index + 1} / {beat.label}</p>
        <h4>{beat.title}</h4>
        <p>{beat.copy}</p>
      </div>)}
    </div>
  </div>;
}

/** A fictional interaction example, separate from the factual career story. */
export function DigitalMenuConcept() {
  const id = useId();
  const [dish, setDish] = useState("Mushroom toast");
  const [available, setAvailable] = useState(true);

  return <details className="digital-menu-concept" data-no-drag>
    <summary>What if today’s special took one edit?</summary>
    <div className="digital-menu-concept__body">
      <p className="digital-menu-concept__label">Concept / fictional menu</p>
      <label htmlFor={`${id}-dish`}>Today’s special</label>
      <input id={`${id}-dish`} type="text" value={dish} maxLength={40} onChange={event => setDish(event.target.value)} />
      <label className="digital-menu-concept__availability"><input type="checkbox" checked={available} onChange={event => setAvailable(event.target.checked)} />Available today</label>
      <output className="digital-menu-concept__preview" data-available={available} aria-label="Menu preview">
        <span>{dish.trim() || "Today’s special"}</span><span>{available ? "Available" : "Sold out"}</span>
      </output>
    </div>
  </details>;
}
