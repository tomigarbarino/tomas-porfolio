import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { MotionPreference } from "@/components/MotionPreference";
import { StructuredData } from "@/components/StructuredData";
import { JEV_PUBLICATION } from "@/lib/publications";
import { writingMetadata, writingStructuredData } from "@/lib/writing-seo";
import "@/components/writing-research.css";

export const metadata = writingMetadata(false);

export default function WritingPage() {
  return <MotionPreference>
    <StructuredData data={writingStructuredData(false)} />
    <a className="skip-link" href="#writing-main">Skip to writing catalogue</a>
    <SiteHeader context="writing" backHref="/#writing" />
    <main className="wr-page" id="writing-main">
      <header className="wr-heading"><p className="eyebrow">THE NOTEBOOK / TOMÁS GARBARINO</p><h1>Writing <span>&amp; Research.</span></h1><p>What I investigate while building products. A place for questions, methods and findings that deserve a closer look.</p></header>
      <section className="wr-catalogue" aria-labelledby="catalogue-title">
        <div className="wr-catalogue__bar"><h2 id="catalogue-title">Card catalogue</h2><span>01 ENTRY / RESEARCH</span></div>
        <div className="wr-catalogue__body">
          <aside className="wr-index-note"><span className="eyebrow">PULL A CARD</span><p>Follow the question.<br />Inspect the evidence.</p><span>Each entry keeps the source, my contribution and its limits together.</span></aside>
          <details className="wr-card">
            <summary><span className="wr-card__tab">RESEARCH / 001 <span aria-hidden="true">↓</span></span><time dateTime={JEV_PUBLICATION.publishedAt}>{JEV_PUBLICATION.displayDate}</time><h3>How JEV decides<br />in Agora.</h3><p>From AI scores to decisions a person can review.</p><span className="wr-card__pull">Open the catalogue card <span aria-hidden="true">+</span></span></summary>
            <div className="wr-card__drawer"><p>A retrospective study of interview evaluation and CV review thresholds. Read the complete study directly on this site, with all figures, tables and appendices, or download the original report. I authored the paper as part of the Agora team.</p><dl><div><dt>Focus</dt><dd>Evaluation agreement · Decision policy · Human review</dd></div><div><dt>Author</dt><dd>Tomás Garbarino · Original in Spanish</dd></div></dl><Link className="wr-ink-link" href="/writing/jev">Read the study + notes →</Link><a href={JEV_PUBLICATION.documentUrl} download>Download the full report ↓</a></div>
          </details>
        </div>
      </section>
      <footer className="wr-footer"><p>Research informs the work.<br />The work raises the next question.</p><Link href="/#work">Explore my work →</Link><Link href="/#contact">Discuss a product or role ↗</Link></footer>
    </main>
  </MotionPreference>;
}
