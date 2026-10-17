import Image from "next/image";
import Link from "next/link";
import "./orquestador-case.css";

export function OriginalWork() {
  return (
    <section className="original-work" id="original-work" aria-labelledby="original-work-title">
      <div className="original-work__copy">
        <p className="eyebrow">OWN PROJECT / ORQUESTADOR DE ENTREGABLES</p>
        <h2 id="original-work-title">A draft needs<br /><span>something behind it.</span></h2>
        <p>A recurring progress update, with source links, explicit states and a human review step. Follow a recorded local AI run, then try an unsupported claim and watch the gate block it.</p>
        <div className="original-work__links"><Link className="button-primary" href="/en/orquestador">Read the project case →</Link><a href="https://orquestador-entregables-tomas.vercel.app/?caso=avance" target="_blank" rel="noreferrer">Try the guided demo ↗</a></div>
        <p className="original-work__note">Public-source snapshot · recorded AI run · browser replay in Spanish</p>
      </div>
      <Link className="original-work__capture" href="/en/orquestador" aria-label="Open the Orquestador original project case">
        <span>ORQUESTADOR / EVIDENCE → REVIEW</span>
        <Image src="/media/orquestador/guided-demo.jpg" width={1536} height={730} alt="Actual Orquestador interface showing public commit sources and a draft awaiting human review" sizes="(max-width: 900px) 90vw, 46vw" />
        <span>Inspect the flow, the failure and the engineering decisions →</span>
      </Link>
    </section>
  );
}
