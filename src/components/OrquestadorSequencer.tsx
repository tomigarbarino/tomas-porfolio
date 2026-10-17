"use client";

import { useId, useState } from "react";
import packet from "@/content/orquestador-sources.json";
import selection from "@/content/orquestador-selection.json";
import { controlarSeleccion, salidaConFallo } from "@/lib/orquestador/caso-guiado.mjs";

const steps = ["Sources", "Selection", "Evidence gate", "Draft"];
const original = JSON.stringify(selection);

export function OrquestadorSequencer() {
  const [step, setStep] = useState(0);
  const [failure, setFailure] = useState(false);
  const id = useId();
  const output = failure ? salidaConFallo(original) : original;
  const result = controlarSeleccion(packet, output);
  const status = failure ? "Blocked: no deployment evidence. No draft available." : step === 3 ? "Draft ready for human review. Nothing sent." : `Step ${step + 1} of 4: ${steps[step]}.`;

  return <section className="orq-sequencer" aria-labelledby={`${id}-title`}>
    <div className="orq-sequencer__bar"><h3 id={`${id}-title`}>REPLAY / EVIDENCE SEQUENCER</h3><span>RECORDED RUN · 17 OCT 2026</span></div>
    <p className="orq-sequencer__intro">Step through the saved run. Then change a claim and test the same gate used in the original demo. No live model call.</p>
    <ol className="orq-sequencer__steps">{steps.map((label, index) => <li key={label}><button type="button" aria-pressed={step === index} aria-controls={`${id}-screen`} onClick={() => setStep(index)}><span>0{index + 1}</span>{label}<i aria-hidden="true" data-on={step === index} /></button></li>)}</ol>
    <div className="orq-sequencer__screen" id={`${id}-screen`} role="region" aria-label={steps[step]}>
      {step === 0 && <><p className="eyebrow">INPUT / PUBLIC SNAPSHOT {packet.head.slice(0, 7)}</p><ul>{packet.fuentes.map(source => <li key={source.id}><span>{source.id} / en_main</span><a href={source.url} target="_blank" rel="noreferrer" lang={source.id === "C3" ? "es" : "en"}>{source.titulo} ↗</a></li>)}</ul><p className="orq-case__note">Membership in the captured main history is verified. Deployment is unverified.</p></>}
      {step === 1 && <><p className="eyebrow">MODEL OUTPUT / {failure ? "DELIBERATELY MODIFIED" : "ORIGINAL RECORDED SELECTION"}</p><pre lang="es">{JSON.stringify(JSON.parse(output), null, 2)}</pre><p className="orq-case__note">The model selects IDs and states. It does not write the draft’s claims.</p></>}
      {step === 2 && <><p className="eyebrow">EVIDENCE GATE / {result.ok ? "PASS" : "BLOCKED"}</p><h4>{result.ok ? "Every selected state has support." : "A claim outran its evidence."}</h4><p>{result.ok ? "Three known IDs. No duplicates or free-text claims. Each state is en_main, matching its source." : "C1 was changed to desplegado (deployed). The source only supports en_main. One invalid item blocks the entire draft."}</p><p className="orq-case__note">This validates the closed selection contract. It does not certify arbitrary AI-written prose.</p></>}
      {step === 3 && <><p className="eyebrow">OUTPUT / {result.ok ? "PENDING HUMAN REVIEW" : "NO DRAFT"}</p>{result.borrador ? <pre lang="es">{result.borrador}</pre> : <><h4>Draft removed.</h4><p>Restore the recorded selection to produce a draft. No partial result is kept.</p></>}</>}
    </div>
    <p className="orq-sequencer__status" role="status" aria-live="polite" aria-atomic="true" data-blocked={failure}>{status}</p>
    <div className="orq-sequencer__transport"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>← Previous step</button><button type="button" disabled={step === 3} onClick={() => setStep(step + 1)}>Next step →</button><button type="button" className="orq-sequencer__break" onClick={() => { setFailure(!failure); setStep(2); }}>{failure ? "Restore recorded selection" : "Try unsupported “deployed” claim"}</button></div>
    <p className="orq-case__note">The original Spanish source titles and draft are preserved. <a href="https://github.com/tomigarbarino/orquestador-entregables/tree/main/ejemplo/caso-publico" target="_blank" rel="noreferrer">Inspect the original record ↗</a></p>
  </section>;
}
