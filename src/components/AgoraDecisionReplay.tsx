"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { useMotionPreference } from "./MotionPreference";
import "./agora-decision-replay.css";

const states = [
  { id: "before", label: "Before guardrail", decision: "0% match", outcome: "Automatic rejection" },
  { id: "with", label: "With guardrail", decision: "Decision held", outcome: "Talent review" },
] as const;

type ReplayState = typeof states[number]["id"];

export function AgoraDecisionReplay() {
  const id = useId();
  const { paused, reducedMotion } = useMotionPreference();
  const [pinned, setPinned] = useState<ReplayState>("with");
  const [hovered, setHovered] = useState<ReplayState | null>(null);
  const [focused, setFocused] = useState<ReplayState | null>(null);
  const preview = hovered ?? focused;
  const active = preview ?? pinned;
  const selected = states.find(state => state.id === active)!;
  const showingPreview = preview !== null && preview !== pinned;

  function restore(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    setPinned("with");
    setHovered(null);
    setFocused(null);
  }

  return (
    <div className="agora-decision-replay" data-state={active} data-motion={paused || reducedMotion ? "paused" : "playing"} role="group" aria-label="Compare the reported guardrail" onKeyDown={restore}>
      <div className="agora-decision-replay__controls">
        {states.map(state => (
          <button
            key={state.id}
            type="button"
            aria-pressed={pinned === state.id}
            aria-controls={`${id}-sequence`}
            aria-describedby={`${id}-help`}
            data-preview={showingPreview && active === state.id}
            onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(state.id); }}
            onPointerLeave={() => setHovered(current => current === state.id ? null : current)}
            onPointerCancel={() => setHovered(current => current === state.id ? null : current)}
            onFocus={() => setFocused(state.id)}
            onBlur={() => setFocused(current => current === state.id ? null : current)}
            onClick={() => { setPinned(state.id); setHovered(null); setFocused(null); }}
          >
            {state.label}
          </button>
        ))}
      </div>
      <p className="agora-decision-replay__status" role="status" aria-live="polite" aria-atomic="true">
        <span>{showingPreview ? "Preview" : "Selected"}</span> / {selected.label}
        <span className="agora-decision-replay__sr">. No structured skills. {selected.decision}. {selected.outcome}.</span>
      </p>
      <ol className="agora-decision-replay__sequence" id={`${id}-sequence`} aria-label="Illustrative decision sequence">
        <li>
          <p className="agora-decision-replay__step"><span aria-hidden="true">01</span> / Input</p>
          <div className="agora-decision-replay__values"><p data-active="true">No structured skills</p></div>
        </li>
        <li>
          <p className="agora-decision-replay__step"><span aria-hidden="true">02</span> / State</p>
          <div className="agora-decision-replay__values">
            {states.map(state => <p key={state.id} data-active={active === state.id} aria-hidden={active !== state.id}>{state.decision}</p>)}
          </div>
        </li>
        <li>
          <p className="agora-decision-replay__step"><span aria-hidden="true">03</span> / Outcome</p>
          <div className="agora-decision-replay__values">
            {states.map(state => <p key={state.id} data-active={active === state.id} aria-hidden={active !== state.id}>{state.outcome}</p>)}
          </div>
        </li>
      </ol>
      <p className="agora-decision-replay__sr" id={`${id}-help`}>Hover or focus to preview; select to keep a state. Escape restores With guardrail.</p>
    </div>
  );
}
