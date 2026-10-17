import Link from "next/link";
import { JEV_PUBLICATION } from "@/lib/publications";
import "./writing-research.css";

export function WritingResearch() {
  return <section className="writing-preview" id="writing" aria-labelledby="writing-title" tabIndex={-1}>
    <div><p className="eyebrow">FROM THE NOTEBOOK / 01</p><h2 id="writing-title">Writing <span>&amp; Research.</span></h2><p>Questions I investigate while building products. Methods, findings and the limits of what they tell us.</p><Link href="/writing">Open the catalogue →</Link></div>
    <article><p className="eyebrow">RESEARCH / <time dateTime={JEV_PUBLICATION.publishedAt}>{JEV_PUBLICATION.displayDate}</time></p><h3><Link href="/writing/jev">How JEV decides in Agora ↗</Link></h3><p>When should an AI score become a decision—and when should a person review it?</p><p className="writing-preview__credit">By Tomás Garbarino · Complete study + PDF</p></article>
  </section>;
}
