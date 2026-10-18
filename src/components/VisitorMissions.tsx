"use client";

import { useEffect, useRef, useSyncExternalStore, type MouseEvent } from "react";
import { completedMissions, getMissionSnapshot, getServerMissionSnapshot, missions, readMissionState, resetMissions, subscribeMissions, trackMission } from "@/lib/visitor-missions";

type Props = { active: boolean; onDismiss: () => void; onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void };
export function VisitorMissions({ active, onDismiss, onNavigate }: Props) {
  const title = useRef<HTMLHeadingElement>(null);
  const raw = useSyncExternalStore(subscribeMissions, getMissionSnapshot, getServerMissionSnapshot);
  const state = readMissionState(raw);
  const completed = completedMissions(state);
  useEffect(() => { if (active) title.current?.focus({ preventScroll: true }); }, [active]);

  function explore(event: MouseEvent<HTMLAnchorElement>, mission: typeof missions[number]) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    trackMission(mission.id);
    const target = mission.href.split("#")[1];
    if (target && document.getElementById(target)) onNavigate(event, target);
    else onDismiss();
  }

  return <>
    <p className="eyebrow">SIDE QUESTS / FOLLOW YOUR CURIOSITY</p>
    <h2 ref={title} tabIndex={-1} id="dialog-title">{"Go looking.\nFind something."}</h2>
    <p>Lift a corner. Uncover a note. Follow a strange link. Discoveries count when you interact with the portfolio, even before you track a mission.</p>
    <div className="mission-total" aria-live="polite" aria-atomic="true"><span>{completed.length} / {missions.length} <span>missions complete</span></span><progress aria-label="Completed missions" value={completed.length} max={missions.length} /></div>
    {completed.length === missions.length && <p className="mission-all-done">All missions complete. Thanks for playing.</p>}
    <div className="quest-list mission-board">{missions.map((mission, index) => <article key={mission.id}>
      <span className="mission-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div className="mission-summary"><h3>{mission.title}</h3><p>{mission.objective}</p>
        <ul className="mission-checkpoints">{mission.checkpoints.map(checkpoint => <li key={checkpoint.id}><span aria-hidden="true">{state.events.includes(checkpoint.id) ? "✓" : "○"}</span> {checkpoint.label}{state.events.includes(checkpoint.id) && <span className="sr-only"> — Found</span>}</li>)}</ul>
        <details><summary>Need a clue?</summary><p>{mission.hint}</p></details>
        <a href={mission.href} onClick={event => explore(event, mission)}>{completed.includes(mission.id) ? "Explore again →" : "Track & explore →"}</a>
        {completed.includes(mission.id) && <span className="mission-state">✓ Found</span>}
      </div>
    </article>)}</div>
    <p className="quest-note">Progress stays in this tab for this session, including when you switch languages. If browser storage is blocked, it lasts until you leave this page.</p>
    {state.events.length > 0 && <button type="button" className="game-replay" onClick={() => { resetMissions(); title.current?.focus({ preventScroll: true }); title.current?.scrollIntoView({ block: "start" }); }}>Reset mission progress ↺</button>}
  </>;
}
