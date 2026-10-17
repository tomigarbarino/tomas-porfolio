import Image from "next/image";
import Link from "next/link";
import { MotionPreference } from "@/components/MotionPreference";
import { SiteHeader } from "@/components/SiteHeader";
import { StructuredData } from "@/components/StructuredData";
import { caseStudyMetadata, caseStudyStructuredData } from "@/lib/seo";
import metrics from "@/content/orquestador-run.json";
import "@/components/orquestador-case.css";

export const metadata = caseStudyMetadata("orquestador");
const repo = "https://github.com/tomigarbarino/orquestador-entregables";
const demo = "https://orquestador-entregables-tomas.vercel.app/?caso=avance";

export default function OrquestadorPage() {
  return <>
    <StructuredData data={caseStudyStructuredData("orquestador")} />
    <MotionPreference>
      <a className="skip-link" href="#orquestador-main">Skip to project case</a>
      <SiteHeader context="case" backHref="/#original-work" />
      <main id="orquestador-main" className="orq-case">
        <header className="orq-case__hero">
          <p className="eyebrow">OWN PROJECT / PRODUCT DESIGN + ENGINEERING / 2026</p>
          <h1>From scattered work<br />to a <span>reviewable draft.</span></h1>
          <p className="orq-case__intro">Orquestador de entregables turns recurring reporting into a visible workflow: gather sources, select evidence, check claims and prepare a draft for a person to review.</p>
          <div className="orq-case__actions"><a className="button-primary" href={demo} target="_blank" rel="noreferrer">Try the guided demo ↗</a><a href={repo} target="_blank" rel="noreferrer">Inspect the source ↗</a></div>
          <p className="orq-case__note">Original personal project. The demo replays a recorded local-model run from public commits. Interface in Spanish; no accounts or model calls needed.</p>
        </header>

        <figure className="orq-case__figure">
          <Image src="/media/orquestador/guided-demo.jpg" width={1536} height={730} priority alt="Orquestador guided flow: three linked public commits, evidence control and a draft pending human review" sizes="(max-width: 900px) 94vw, 1200px" />
          <figcaption>Actual application capture. Public repository snapshot; the linked record includes the original input, model response and measurements.</figcaption>
        </figure>

        <section className="orq-case__section" aria-labelledby="orq-problem">
          <div><p className="eyebrow">01 / THE PROBLEM</p><h2 id="orq-problem">Reporting is a reconstruction task.</h2></div>
          <div><p>Code, tickets and conversations describe different parts of the work. Preparing a daily or progress deck means finding those pieces again, checking what actually happened and putting it into the team’s format.</p><p>The project makes that process configurable through recipes and a local web interface. This case narrows the demonstration to one progress update so the evidence, result and failure are easy to inspect.</p></div>
        </section>

        <section className="orq-case__section" aria-labelledby="orq-flow">
          <div><p className="eyebrow">02 / THE WORKING SLICE</p><h2 id="orq-flow">Four steps you can follow.</h2></div>
          <ol className="orq-case__flow">
            <li><b>01 — Capture</b><p>Three public commits, pinned to a repository snapshot. Their presence in main is verified; deployment status stays unverified.</p></li>
            <li><b>02 — Select</b><p>A local model selects record IDs and states through a closed JSON contract. Its original response is stored without hand editing.</p></li>
            <li><b>03 — Check</b><p>Reject unknown IDs, duplicates, free text and unsupported states. A single invalid item blocks the whole draft.</p></li>
            <li><b>04 — Review</b><p>Build the draft from source titles and links. A person still decides relevance and wording. This flow does not send it anywhere.</p></li>
          </ol>
        </section>

        <section className="orq-case__failure" aria-labelledby="orq-failure">
          <p className="eyebrow">03 / TRY TO BREAK THE CLAIM</p><h2 id="orq-failure">In main ≠ deployed.</h2>
          <p>The demo lets you change one selected item to “deployed.” The source packet does not support that state, so the gate removes the draft and explains what is missing. Restore the original selection to continue.</p>
          <div className="orq-case__comparison"><div><span>SOURCE SUPPORTS</span><strong>en_main</strong><p>Commit belongs to the captured main history.</p></div><div><span>DELIBERATE FAILURE</span><strong>desplegado → blocked</strong><p>No deployment evidence. No partial draft.</p></div></div>
          <a href={demo} target="_blank" rel="noreferrer">Replay the run, then choose “Probar fallo” ↗</a>
        </section>

        <section className="orq-case__section" aria-labelledby="orq-engineering">
          <div><p className="eyebrow">04 / ENGINEERING DECISIONS</p><h2 id="orq-engineering">Make the boundary explicit.</h2></div>
          <div><p><b>Constrain before generating.</b> The guided run selects IDs rather than composing arbitrary claims. The final text comes from the selected records. Reference matching alone would not prove the truth of free-form prose.</p><p><b>Share the gate.</b> The CLI replay and browser import the same pure validation module. The existing server reference matcher is also extracted into a browser-safe module without changing its API.</p><p><b>Keep the demo reproducible.</b> Input bytes are tied to the recorded run with SHA-256. Default replay needs no network; a separate explicit command runs local inference. CI runs the full tests, replay, existing smoke flows and static build.</p><p className="orq-case__note">Stack: React, Node.js, Vite, JSON/YAML recipes and a local Ollama capture. The broader local application uses Claude Code; this recorded slice does not claim to validate that full integration.</p></div>
        </section>

        <section className="orq-case__measurement" aria-labelledby="orq-measured">
          <p className="eyebrow">05 / MEASURED ON {metrics.capturedAt.slice(0, 10)}</p><h2 id="orq-measured">One recorded run. Clear limits.</h2>
          <dl><div><dt>Original wall time</dt><dd>{(metrics.wallMs / 1000).toFixed(1)} s</dd></div><div><dt>Input / output tokens</dt><dd>{metrics.inputTokens} / {metrics.outputTokens}</dd></div><div><dt>Selected records</dt><dd>3</dd></div></dl>
          <p>{metrics.model} via local Ollama. No remote-provider charge for this call; electricity and hardware costs were not measured. Human editing effort and time saved are also unmeasured. This is a demonstration sample, not a client outcome or a performance benchmark.</p>
          <a href={`${repo}/tree/main/ejemplo/caso-publico`} target="_blank" rel="noreferrer">Read the original run and source snapshot ↗</a>
        </section>

        <section className="orq-case__section" aria-labelledby="orq-next">
          <div><p className="eyebrow">06 / WHERE THIS COULD HELP</p><h2 id="orq-next">Start with one recurring deliverable.</h2></div>
          <div><p>For a team repeating the same reporting work, a scoped pilot would define one format, authorized sources and explicit approval rules. Then measure preparation time, factual corrections and review effort against the current process.</p><p>That is the product engineering work I want to do: turn a real operational problem into a small working system, test its failure modes and make its decisions inspectable.</p><p className="orq-case__note">Still to validate: usefulness with a real team, longer free-form deliverables and deployment evidence across live sources. No adoption, revenue or hours-saved claim is made here.</p></div>
        </section>

        <footer className="orq-case__contact"><p className="eyebrow">A WORKFLOW TO IMPROVE? A PRODUCT TEAM TO JOIN?</p><h2>Let’s make it<br /><span>useful in practice.</span></h2><div className="orq-case__actions"><a className="button-primary" href="mailto:tomasgarbarino.dev@gmail.com?subject=Workflow%20pilot">Discuss a workflow ↗</a><a href="mailto:tomasgarbarino.dev@gmail.com?subject=Product%20engineering%20opportunity">Discuss a product engineering role ↗</a><Link href="/#original-work">Back to portfolio →</Link></div></footer>
      </main>
    </MotionPreference>
  </>;
}
