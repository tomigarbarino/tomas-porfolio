"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { answerMission, getMissionSnapshot, getServerMissionSnapshot, missions, readCompleted, resetMissions, saveMissionCompletion, subscribeMissions } from "@/lib/visitor-missions";

export function VisitorMissions({ active, onDismiss }: { active: boolean; onDismiss: () => void }) {
  const [missionId, setMissionId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState(false);
  const status = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const previousMission = useRef<string | null>(null);
  const raw = useSyncExternalStore(subscribeMissions, getMissionSnapshot, getServerMissionSnapshot);
  const completed = readCompleted(raw);
  const mission = missions.find(item => item.id === missionId);
  const finished = Boolean(mission && step === mission.steps.length);

  useEffect(() => {
    if (!active) return;
    const target = missionId && previousMission.current === missionId ? status.current : title.current;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "start" });
    previousMission.current = missionId;
  }, [active, missionId, step, wrong]);

  function start(id: string) {
    setStep(0);
    setWrong(false);
    setMissionId(id);
  }

  function choose(choice: string) {
    if (!mission || finished || wrong) return;
    const result = answerMission(mission.id, step, choice);
    setWrong(!result.accepted);
    if (result.accepted) setStep(result.step);
    if (result.complete) saveMissionCompletion(mission.id);
  }

  return <>
    <div className="quest-heading"><p className="eyebrow">OPTIONAL MISSIONS / YOU ARE THE PLAYER</p>{mission && <button type="button" onClick={() => setMissionId(null)}>← Mission board</button>}</div>
    <h2 ref={title} tabIndex={-1} id="dialog-title">{mission ? mission.title : "Your turn.\nPick a mission."}</h2>
    {!mission ? <>
      <p>Make a product decision, solve a small challenge, and see why your choice matters. No timer. No sign-up.</p>
      <div className="mission-total" aria-live="polite" aria-atomic="true"><span>{completed.length} / {missions.length} <span>missions complete</span></span><progress aria-label="Completed missions" value={completed.length} max={missions.length} /></div>
      {completed.length === missions.length && <p className="mission-all-done">All missions complete. Thanks for playing.</p>}
      <div className="quest-list mission-board">{missions.map((item, index) => <button key={item.id} type="button" onClick={() => start(item.id)}>
        <span className="mission-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <span className="mission-summary"><strong>{item.title}</strong><span>{item.objective}</span><span className="mission-state">{completed.includes(item.id) ? "✓ Complete · Play again" : "Start mission →"}</span></span>
      </button>)}</div>
      <p className="quest-note">Progress stays in this tab for this session, including when you switch languages. If browser storage is blocked, it lasts until you leave this page.</p>
      {completed.length > 0 && <button type="button" className="game-replay" onClick={() => { resetMissions(); title.current?.focus({ preventScroll: true }); title.current?.scrollIntoView({ block: "start" }); }}>Reset mission progress ↺</button>}
    </> : <div className="learning-game visitor-mission">
      <p className="mission-brief">{mission.brief}</p>
      <ol className="game-progress" aria-label="Mission steps">{mission.steps.map((item, index) => <li key={item.answer} className={step > index ? "connected" : ""} aria-current={step === index ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{step > index ? "✓" : "·"}</li>)}</ol>
      <div ref={status} tabIndex={-1} aria-live="polite" aria-atomic="true">{finished ? <><h3>Mission complete.</h3><p>{mission.success}</p></> : <><p className="mission-step-label">Step {step + 1} / {mission.steps.length}</p><h3 className="mission-question">{mission.steps[step].question}</h3>{wrong && <p className="game-feedback">{mission.steps[step].feedback}</p>}</>}</div>
      {!finished && !wrong && <div className="game-options">{mission.steps[step].options.map(option => <button key={option.id} type="button" onClick={() => choose(option.id)}>{option.label}<span aria-hidden="true"> →</span></button>)}</div>}
      {wrong && <button type="button" className="button-primary" onClick={() => setWrong(false)}>Try again →</button>}
      {finished && <div className="mission-finish"><button type="button" className="button-primary" onClick={() => setMissionId(null)}>Back to your missions →</button><Link href={mission.href} onClick={onDismiss}>{mission.link}</Link><button type="button" className="game-replay" onClick={() => start(mission.id)}>Play again ↺</button></div>}
    </div>}
  </>;
}
