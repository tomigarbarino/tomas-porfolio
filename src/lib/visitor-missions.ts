export const missions = [
  { id: "paper", title: "Something under the paper", objective: "Find a folded corner in the story and reveal what is underneath.", hint: "A digital menu has a corner you can lift. Press it to keep the hidden note open.", href: "/#story-conversations", checkpoints: [{ id: "menu-fold", label: "Lift the menu corner" }] },
  { id: "sticker", title: "A note behind the sticker", objective: "Find a developer sticker and uncover its hidden note.", hint: "There is one near Trainly and another near the contact details. Press the sticker to pin its note open.", href: "/#trainly", checkpoints: [{ id: "sticker-note", label: "Pin a sticker note open" }] },
  { id: "gate", title: "Break it. Bring it back.", objective: "Explore the delivery desk. Make the draft disappear, then restore it.", hint: "In Orquestador, try the unsupported deployment claim. Once export is blocked, restore the recorded selection.", href: "/en/orquestador#orq-demo", checkpoints: [{ id: "gate-blocked", label: "Trigger the evidence block" }, { id: "gate-restored", label: "Restore the review draft" }] },
  { id: "zoom", title: "Beyond the frame", objective: "Find a research figure and take a closer look beyond its frame.", hint: "Open a figure from the JEV study. In the vector viewer, press + to enlarge it.", href: "/writing/jev", checkpoints: [{ id: "figure-enlarged", label: "Enlarge a research figure" }] },
  { id: "arcade", title: "Lost + Found", objective: "Find the hidden arcade and recover a matching pair of signals.", hint: "Follow the initials at the very bottom of the portfolio. A page that should not exist has something to play.", href: "/#top", checkpoints: [{ id: "arcade-found", label: "Find the secret entrance" }, { id: "packet-recovered", label: "Recover a matching pair" }] },
];

export type MissionState = { version: 2; events: string[]; active: string | null };
export const emptyMissionState = (): MissionState => ({ version: 2, events: [], active: null });

/** Discoveries are recorded only by deliberate interactions, in checkpoint order. */
export function applyDiscovery(state: MissionState, event: string): MissionState {
  const mission = missions.find(item => item.checkpoints.some(checkpoint => checkpoint.id === event));
  const index = mission?.checkpoints.findIndex(checkpoint => checkpoint.id === event) ?? -1;
  if (!mission || state.events.includes(event) || !mission.checkpoints.slice(0, index).every(checkpoint => state.events.includes(checkpoint.id))) return state;
  return { ...state, events: [...state.events, event] };
}

export function readMissionState(raw: string | null): MissionState {
  try {
    const value = JSON.parse(raw ?? "null");
    if (!value || value.version !== 2 || !Array.isArray(value.events)) return emptyMissionState();
    let state = emptyMissionState();
    for (const event of value.events) if (typeof event === "string") state = applyDiscovery(state, event);
    return { ...state, active: missions.some(mission => mission.id === value.active) ? value.active : null };
  } catch { return emptyMissionState(); }
}

export function completedMissions(state: MissionState) {
  return missions.filter(mission => mission.checkpoints.every(checkpoint => state.events.includes(checkpoint.id))).map(mission => mission.id);
}

const storageKey = "tg-visitor-missions-v2";
const changeEvent = "tg-missions-changed";
let snapshot: string | null = null;
let loaded = false;

export function getMissionSnapshot() {
  if (!loaded) {
    try { snapshot = window.sessionStorage.getItem(storageKey); } catch { /* Progress still works in memory. */ }
    loaded = true;
  }
  return snapshot;
}
export function getServerMissionSnapshot() { return null; }
export function subscribeMissions(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    try { if (event.storageArea !== window.sessionStorage) return; } catch { return; }
    snapshot = event.newValue;
    callback();
  };
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", onStorage);
  return () => { window.removeEventListener(changeEvent, callback); window.removeEventListener("storage", onStorage); };
}
export function recordMissionEvent(event: string) {
  const state = readMissionState(getMissionSnapshot());
  const next = applyDiscovery(state, event);
  if (next !== state) writeState(next);
}
export function trackMission(id: string | null) {
  if (id !== null && !missions.some(mission => mission.id === id)) return;
  writeState({ ...readMissionState(getMissionSnapshot()), active: id });
}
export function resetMissions() { writeState(emptyMissionState()); }
function writeState(state: MissionState) {
  const next = JSON.stringify(state);
  if (next === getMissionSnapshot()) return;
  snapshot = next;
  loaded = true;
  try { window.sessionStorage.setItem(storageKey, snapshot); } catch { /* Keep the in-memory snapshot. */ }
  window.dispatchEvent(new Event(changeEvent));
}
