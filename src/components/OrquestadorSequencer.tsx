"use client";

import { recordMissionEvent } from "@/lib/visitor-missions";
import { useId, useState } from "react";
import packet from "@/content/orquestador-sources.json";
import selection from "@/content/orquestador-selection.json";
import { controlarSeleccion, salidaConFallo } from "@/lib/orquestador/caso-guiado.mjs";

const steps = ["Sources", "Selection", "Evidence check", "Deliverable"];
const original = JSON.stringify(selection);

export function OrquestadorSequencer() {
  const [step, setStep] = useState(3);
  const [failure, setFailure] = useState(false);
  const id = useId();
  const output = failure ? salidaConFallo(original) : original;
  const selected = JSON.parse(output) as typeof selection;
  const result = controlarSeleccion(packet, output);
  const status = failure ? "Blocked: no deployment evidence. No draft available." : step === 3 ? "Draft ready for human review. Nothing sent." : `Step ${step + 1} of 4: ${steps[step]}.`;

  return <section className="orq-sequencer" id="orq-demo" aria-labelledby={`${id}-title`}>
    <div className="orq-sequencer__bar"><h3 id={`${id}-title`}>DELIVERY DESK / PROGRESS UPDATE</h3><span>RECORDED RUN · 17 OCT 2026</span></div>
    <p className="orq-sequencer__intro">Here is the deliverable: a progress update with a source behind each item. Trace it back through the steps, or introduce an unsupported claim to see why the whole draft gets blocked. This replay uses a saved model response.</p>
    <ol className="orq-sequencer__steps">{steps.map((label, index) => <li key={label}><button type="button" aria-pressed={step === index} aria-controls={`${id}-screen`} onClick={() => setStep(index)}><span>0{index + 1}</span>{label}<i aria-hidden="true" data-on={step === index} /></button></li>)}</ol>
    <p className="orq-sequencer__status" role="status" aria-live="polite" aria-atomic="true" data-blocked={failure}>{status}</p>
    <div className="orq-sequencer__transport"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>← Previous step</button><button type="button" disabled={step === 3} onClick={() => setStep(step + 1)}>Next step →</button><button type="button" className="orq-sequencer__break" onClick={() => { recordMissionEvent(failure ? "gate-restored" : "gate-blocked"); setFailure(!failure); setStep(failure ? 3 : 2); }}>{failure ? "Restore recorded selection" : "Try unsupported “deployed” claim"}</button></div>
    <div className="orq-sequencer__screen" id={`${id}-screen`} role="region" aria-label={steps[step]}>
      {step === 0 && <><p className="eyebrow">INPUT / PUBLIC SNAPSHOT {packet.head.slice(0, 7)}</p><h4>Three records. One bounded source packet.</h4><ul>{packet.fuentes.map(source => <li key={source.id}><span>{source.id}<br />{source.sha.slice(0, 7)}</span><div><a href={source.url} target="_blank" rel="noreferrer" lang={source.id === "C3" ? "es" : "en"}>{source.titulo} ↗</a><p className="orq-case__note">Captured in main · {source.fecha}</p></div></li>)}</ul><p className="orq-case__note">Each record belongs to the captured main history. A deployment would require separate evidence.</p></>}
      {step === 1 && <><p className="eyebrow">MODEL OUTPUT / {failure ? "DELIBERATELY MODIFIED" : "ORIGINAL RECORDED SELECTION"}</p><h4>The model chooses records and states.</h4><div className="orq-selection">{selected.items.map((item: { id: string; estado: string }) => <div key={item.id}><span>{item.id}</span><span>→</span><strong data-invalid={item.estado !== "en_main"}>{item.estado}</strong></div>)}</div><p className="orq-case__note">The final wording comes from the source titles, rather than claims invented by the model.</p><details className="orq-raw"><summary>Inspect the selected JSON</summary><pre lang="es">{JSON.stringify(JSON.parse(output), null, 2)}</pre></details></>}
      {step === 2 && <><p className="eyebrow">EVIDENCE GATE / {result.ok ? "PASS" : "BLOCKED"}</p><h4>{result.ok ? "Every selected state has support." : "A claim outran its evidence."}</h4><p>{result.ok ? "All three IDs are known and unique. Their selected state matches the source packet." : "C1 now claims desplegado (deployed). The source supports only en_main. One unsupported item blocks every export."}</p><dl className="orq-checks"><div><dt>Source supports</dt><dd>en_main</dd></div><div><dt>Selected state for C1</dt><dd data-invalid={failure}>{failure ? "desplegado" : "en_main"}</dd></div><div><dt>Draft / export</dt><dd>{result.ok ? "Available for review" : "Blocked in full"}</dd></div></dl>{!result.ok && <ul className="orq-gate-errors" lang="es">{result.errores.map(error => <li key={error}>{error}</li>)}</ul>}<p className="orq-case__note">This gate checks a closed selection contract. A person still reviews relevance and wording.</p></>}
      {step === 3 && <><p className="eyebrow">OUTPUT / {result.ok ? "PENDING HUMAN REVIEW" : "NO DRAFT"}</p>{result.borrador ? <><article className="orq-deliverable" aria-labelledby={`${id}-draft-title`}><header><span>DRAFT / HUMAN REVIEW</span><h4 id={`${id}-draft-title`}>Progress with evidence</h4><p>Public snapshot: {packet.capturado_en.slice(0, 10)} · Base: {packet.head.slice(0, 7)}</p></header><ol>{result.registros.map(record => <li key={record.id}><span className="orq-deliverable__state">{record.id} / EN MAIN</span><h5 lang={record.id === "C3" ? "es" : "en"}>{record.titulo}</h5><a href={record.url} target="_blank" rel="noreferrer">Evidence · {record.sha.slice(0, 7)} ↗</a></li>)}</ol><footer><p>Production deployment has not been verified.</p><p>Pending: review relevance and wording. No message has been sent or published.</p></footer></article><div className="orq-export"><a href={`data:text/markdown;charset=utf-8,${encodeURIComponent(result.borrador)}`} download="orquestador-avance-borrador.md">Download original Spanish draft · Markdown ↓</a><span>Local file · pending your review</span></div><details className="orq-raw"><summary>Inspect the generated Markdown</summary><pre lang="es">{result.borrador}</pre></details></> : <><h4>Draft removed.</h4><p>There is no partial deliverable or download. Restore the recorded selection to produce the review draft again.</p></>}</>}
    </div>
    <p className="orq-case__note">Source titles retain their original language. The download preserves the recorded Spanish draft. <a href="https://github.com/tomigarbarino/orquestador-entregables/tree/main/ejemplo/caso-publico" target="_blank" rel="noreferrer">Inspect the original record ↗</a></p>
  </section>;
}
