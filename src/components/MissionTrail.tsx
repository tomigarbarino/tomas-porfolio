"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import Link from "next/link";
import { completedMissions, getMissionSnapshot, getServerMissionSnapshot, missions, readMissionState, subscribeMissions, trackMission } from "@/lib/visitor-missions";
import "./mission-trail.css";

export function MissionTrail() {
  const raw = useSyncExternalStore(subscribeMissions, getMissionSnapshot, getServerMissionSnapshot);
  const state = readMissionState(raw);
  const mission = missions.find(item => item.id === state.active);
  const completed = completedMissions(state);
  if (!mission) return null;
  const found = completed.includes(mission.id);
  function openBoard(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !document.querySelector(".observatory")) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("tg-portfolio-dialog", { detail: "quests" }));
  }
  return <aside className="mission-trail" aria-label="Exploration mission">
    <details key={mission.id}>
      <summary><span aria-hidden="true">{found ? "✳" : "⌖"}</span><span><span className="mission-trail__status" role="status" aria-live="polite" aria-atomic="true">{found ? "Discovery complete" : "On the trail"} · {completed.length} / {missions.length}</span><strong>{mission.title}</strong></span></summary>
      <div className="mission-trail__body">
        <p>{mission.objective}</p>
        <ul>{mission.checkpoints.map(checkpoint => <li key={checkpoint.id}><span aria-hidden="true">{state.events.includes(checkpoint.id) ? "✓" : "○"}</span> {checkpoint.label}{state.events.includes(checkpoint.id) && <span className="sr-only"> — Found</span>}</li>)}</ul>
        <details><summary>Need a clue?</summary><p>{mission.hint}</p></details>
        <Link href="/#missions" onClick={openBoard}>Mission board →</Link>
        <button type="button" onClick={() => trackMission(null)}>Stop tracking</button>
      </div>
    </details>
  </aside>;
}
