export const missions = [
  {
    id: "loop",
    title: "Connect the learning loop",
    objective: "Build a three-step path from source material to understanding.",
    brief: "You are designing a learning experience. Choose what comes next at each step.",
    steps: [
      { question: "What starts a learning loop?", answer: "source", options: [{ id: "learn", label: "Learn" }, { id: "source", label: "Source" }, { id: "assess", label: "Assess" }], feedback: "Start with source material. The flow needs something to work from." },
      { question: "Now help someone use that material.", answer: "learn", options: [{ id: "assess", label: "Assess" }, { id: "publish", label: "Publish" }, { id: "learn", label: "Learn" }], feedback: "Learning comes next: turn the material into an experience someone can use." },
      { question: "How do you see what they understood?", answer: "assess", options: [{ id: "assess", label: "Assess" }, { id: "publish", label: "Publish" }, { id: "source", label: "Source" }], feedback: "Assessment reveals understanding. Shipping alone does not tell you what someone learned." },
    ],
    success: "Source → Learn → Assess. You connected a simplified learning loop inspired by Trainly.",
    href: "/en/trainly",
    link: "Explore the Trainly case →",
  },
  {
    id: "evidence",
    title: "Catch the unsupported claim",
    objective: "Review an AI draft and decide what the evidence allows you to publish.",
    brief: "Mission scenario: a source packet records a code change and a passing local test. The AI draft also says the product was deployed to production.",
    steps: [
      { question: "Which sentence is supported by this packet?", answer: "local", options: [{ id: "live", label: "The product is live in production." }, { id: "local", label: "The local test passed." }, { id: "clients", label: "Clients already use the product." }], feedback: "A passing local test supports a test result. It does not establish deployment or client use." },
      { question: "The deployment claim is still in the draft. What should the export gate do?", answer: "block", options: [{ id: "export", label: "Export the entire draft." }, { id: "hide", label: "Hide the warning and continue." }, { id: "block", label: "Block export until the claim is removed or supported." }], feedback: "An unsupported claim must be removed or backed by evidence before the draft can be exported." },
    ],
    success: "You kept the claim within the evidence and stopped an unsupported export. Try the working gate in Orquestador next.",
    href: "/en/orquestador",
    link: "Try the Orquestador demo →",
  },
  {
    id: "research",
    title: "Read beyond the headline",
    objective: "Separate a research finding from a promise the study cannot make.",
    brief: "JEV reported 80.9% vs 54.1% agreement with historical labels in its main comparison. Your task: choose a defensible interpretation.",
    steps: [
      { question: "What does this comparison measure?", answer: "agreement", options: [{ id: "outcomes", label: "A guaranteed improvement in hiring outcomes." }, { id: "agreement", label: "Agreement with the study's historical labels." }, { id: "fairness", label: "Fairness across demographic groups." }], feedback: "Agreement with historical labels is the measured result. Hiring outcomes and demographic fairness require separate evidence." },
      { question: "What is still needed before using this result for hiring decisions?", answer: "review", options: [{ id: "review", label: "Human review, broader validation and a fairness evaluation." }, { id: "nothing", label: "Nothing: the higher number proves it is ready." }, { id: "automatic", label: "Replace human judgment with the score." }], feedback: "The study is retrospective. Its result does not remove the need for validation, fairness evaluation or human review." },
    ],
    success: "You separated an observed result from an unproven outcome. The full JEV research explains the method and its limits.",
    href: "/writing/jev",
    link: "Read the JEV research →",
  },
];

export function answerMission(id: string, step: number, choice: string) {
  const mission = missions.find(item => item.id === id);
  const current = Number.isInteger(step) && step >= 0 ? mission?.steps[step] : undefined;
  const accepted = Boolean(current && current.answer === choice);
  return { accepted, step: accepted ? step + 1 : step, complete: Boolean(accepted && mission && step + 1 === mission.steps.length) };
}

export function readCompleted(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    return Array.isArray(value) ? missions.filter(mission => value.includes(mission.id)).map(mission => mission.id) : [];
  } catch { return []; }
}

const storageKey = "tg-visitor-missions-v1";
const changeEvent = "tg-missions-changed";
let snapshot: string | null = null;
let loaded = false;

export function getMissionSnapshot() {
  if (!loaded) {
    try { snapshot = window.sessionStorage.getItem(storageKey); } catch { /* Keep progress in memory when storage is unavailable. */ }
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
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function saveMissionCompletion(id: string) {
  const completed = readCompleted(getMissionSnapshot());
  writeCompleted([...completed, id]);
}

export function resetMissions() { writeCompleted([]); }

function writeCompleted(ids: string[]) {
  snapshot = JSON.stringify(readCompleted(JSON.stringify(ids)));
  loaded = true;
  try { window.sessionStorage.setItem(storageKey, snapshot); } catch { /* The in-memory snapshot still works. */ }
  window.dispatchEvent(new Event(changeEvent));
}
