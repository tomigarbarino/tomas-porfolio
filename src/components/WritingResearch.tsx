import Link from "next/link";
import { JEV_PUBLICATION } from "@/lib/publications";
import "./writing-research.css";

export function WritingResearch() {
  return (
    <section className="writing-research" id="writing" aria-labelledby="writing-title" tabIndex={-1}>
      <header className="writing-research__heading">
        <p className="eyebrow">WRITING / RESEARCH / PRODUCT DECISIONS</p>
        <h2 id="writing-title">Writing <span>&amp; Research.</span></h2>
        <p>Questions I investigate, decisions I test and what I learn while building products.</p>
      </header>
      <article className="research-paper" aria-labelledby="jev-publication-title">
        <div className="research-paper__body">
          <div className="research-paper__meta"><span>RESEARCH PAPER / 01</span><time dateTime={JEV_PUBLICATION.publishedAt}>{JEV_PUBLICATION.displayDate}</time></div>
          <h3 id="jev-publication-title">How JEV decides<br />in Agora.</h3>
          <p className="research-paper__original" lang="es">{JEV_PUBLICATION.title}</p>
          <p className="research-paper__byline">By {JEV_PUBLICATION.author} · Published at {JEV_PUBLICATION.publisher}</p>
          <p>I authored a retrospective study of AI interview evaluation and CV decision thresholds in Agora. The question: how should a model’s scores become decisions that a person can inspect and correct?</p>
          <div className="research-paper__links"><a className="button-primary" href={JEV_PUBLICATION.url} target="_blank" rel="noopener noreferrer">Read the paper ↗</a><Link href="/en/agora#research">See the Agora product context →</Link></div>
          <p className="research-paper__scope">Study corpus: 496 applications and 48 interviews. Evaluation agreement and review policies were studied; hiring outcomes were not measured. Full methods and limitations are in the paper.</p>
        </div>
        <aside className="research-paper__note" aria-labelledby="research-takeaway">
          <span className="research-paper__note-label">FIELD NOTE / THE TAKEAWAY</span>
          <h4 id="research-takeaway">A threshold is<br />a product decision.</h4>
          <p>Agreement between models is one signal. Choosing when to reject or ask for human review also requires a clear policy and calibration with people.</p>
          <div className="research-paper__sequence" aria-label="Study takeaway: evidence informs policy, followed by human review"><span>Evidence</span><span aria-hidden="true">↓</span><span>Decision policy</span><span aria-hidden="true">↓</span><span>Human review</span></div>
        </aside>
      </article>
    </section>
  );
}
