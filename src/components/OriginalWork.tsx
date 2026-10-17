import Image from "next/image";
import Link from "next/link";
import "./orquestador-case.css";

export function OriginalWork() {
  return (
    <section className="original-work" id="original-work" aria-labelledby="original-work-title">
      <div className="original-work__copy">
        <p className="eyebrow">OWN PROJECT / ORQUESTADOR DE ENTREGABLES</p>
        <h2 id="original-work-title">Your progress update.<br /><span>With the evidence attached.</span></h2>
        <p>Turn a source packet into a progress draft you can inspect and save. Trace each item to its source, test an unsupported claim, and see what a human still needs to review.</p>
        <div className="original-work__links"><Link className="button-primary" href="/en/orquestador">Read the project case →</Link><a href="https://orquestador-entregables-tomas.vercel.app/?caso=avance" target="_blank" rel="noreferrer">Try the guided demo ↗</a></div>
        <p className="original-work__note">Own project · recorded AI run · inspectable deliverable · English walkthrough / Spanish draft</p>
      </div>
      <Link className="original-work__capture" href="/en/orquestador" aria-label="Open the Orquestador original project case">
        <span>ORQUESTADOR / EVIDENCE → REVIEW</span>
        <Image src="/media/orquestador/guided-demo.jpg" width={1536} height={730} alt="Actual Orquestador interface showing public commit sources and a draft awaiting human review" sizes="(max-width: 900px) 90vw, 46vw" />
        <span>Inspect the flow, the failure and the engineering decisions →</span>
      </Link>
    </section>
  );
}
