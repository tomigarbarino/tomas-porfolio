import Image from "next/image";
import type { ReactNode } from "react";
import rawStudy from "@/content/jev-study.json";
import { JEV_PUBLICATION } from "@/lib/publications";
import "./jev-study.css";

type TextBlock = { type: "paragraph" | "listItem" | "equation"; text: string };
type HeadingBlock = { type: "heading"; id: string; text: string };
type ReferenceBlock = { type: "reference"; number: number; text: string };
type FigureBlock = { type: "figure"; number: number; caption: string; src: string; width: number; height: number };
type Block = TextBlock | HeadingBlock | ReferenceBlock | FigureBlock | { type: "table"; id: string };
type Study = { title: string; subtitle: string; sections: { id: string; title: string; blocks: Block[] }[]; tables: { id: string; label: string; caption: string; columns: string[]; rows: string[][] }[] };
const study = rawStudy as Study;

function Citations({ text }: { text: string }) {
  return text.split(/(\[\d+(?:,\s*\d+)*\])/g).map((part, index) => {
    const match = /^\[(\d+(?:,\s*\d+)*)\]$/.exec(part);
    if (!match) return part;
    const numbers = match[1].split(/,\s*/).map(Number);
    // [0, 1] is a probability interval, not a bibliography reference.
    if (numbers.some(n => n < 1 || n > 25)) return part;
    return <span key={index}>[{numbers.map((number, i) => <span key={number}>{i > 0 && ", "}<a href={`#jev-ref-${number}`} aria-label={`Referencia ${number}`}>{number}</a></span>)}]</span>;
  });
}

function Contents() {
  return <nav aria-label="Índice del estudio"><ol>{study.sections.map(section => <li key={section.id}><a href={`#jev-${section.id}`}>{section.title}</a></li>)}</ol></nav>;
}

function StudyTable({ id }: { id: string }) {
  const table = study.tables.find(item => item.id === id)!;
  return <figure className="jev-table" id={table.id}>
    <p className="jev-table__hint">Deslizá la tabla para ver todas las columnas ↔</p>
    <div className="jev-table__scroll" role="region" aria-label={`Tabla ${table.label}`} tabIndex={0}>
      <table aria-describedby={`${table.id}-caption`}>
        <caption>Tabla {table.label}</caption>
        <thead><tr>{table.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((cell, col) => col === 0 ? <th scope="row" key={col}>{cell}</th> : <td key={col}>{table.label === "C1" && col === 2 ? <strong>{cell}</strong> : cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <figcaption id={`${table.id}-caption`}><Citations text={table.caption} /></figcaption>
  </figure>;
}

function Blocks({ blocks }: { blocks: Block[] }) {
  const rendered: ReactNode[] = [];
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (block.type === "reference" || block.type === "listItem") {
      const type = block.type;
      const items: ReactNode[] = [];
      do {
        const item = blocks[index];
        if (item.type === "reference") items.push(<li key={item.number} id={`jev-ref-${item.number}`} value={item.number}>{item.text}</li>);
        else if (item.type === "listItem") items.push(<li key={index}><Citations text={item.text.replace(/^\d\.\s*/, "")} /></li>);
        index++;
      } while (index < blocks.length && blocks[index].type === type);
      index--;
      rendered.push(<ol key={index} className={type === "reference" ? "jev-references" : "jev-list"}>{items}</ol>);
    } else if (block.type === "heading") {
      rendered.push(<h4 id={block.id} key={index}>{block.text}</h4>);
    } else if (block.type === "table") {
      rendered.push(<StudyTable id={block.id} key={index} />);
    } else if (block.type === "figure") {
      rendered.push(<figure className="jev-figure" id={`jev-figure-${block.number}`} key={index}>
        <a href={block.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar figura ${block.number}: ${block.caption.replace(/^Figura \d+\. /, "")}`}>
          <Image src={block.src} width={block.width} height={block.height} unoptimized alt={block.caption} sizes="(max-width: 900px) 90vw, 980px" />
          <span>Ampliar figura {block.number} ↗</span>
        </a>
        <figcaption><Citations text={block.caption} /></figcaption>
      </figure>);
    } else if (block.type === "equation") {
      rendered.push(<p key={index} className="jev-equation">{block.text}</p>);
    } else {
      rendered.push(<p key={index}><Citations text={block.text} /></p>);
    }
  }
  return rendered;
}

export function JevStudy() {
  return <article id="jev-study" className="jev-study" lang="es" aria-labelledby="jev-study-title" tabIndex={-1}>
    <header className="jev-study__header">
      <div className="jev-study__bar"><span>RESEARCH FILE 001 / ESTUDIO COMPLETO</span><span>TEXTO WEB + PDF</span></div>
      <div className="jev-study__intro"><p className="eyebrow">INVESTIGACIÓN / OCTUBRE 2026</p><h2 id="jev-study-title">{study.title}</h2><p className="jev-study__subtitle">{study.subtitle}</p><p className="jev-study__byline">Por {JEV_PUBLICATION.author} · <time dateTime={JEV_PUBLICATION.publishedAt}>4 de octubre de 2026</time></p><p>Texto completo del estudio, con sus 7 figuras, 8 tablas, referencias y apéndices. Podés leerlo directamente acá o guardar el documento original.</p><div className="jev-study__actions"><a className="wr-ink-link" href="#jev-resumen">Empezar a leer ↓</a><a href={JEV_PUBLICATION.documentUrl} download>Descargar informe completo · PDF ↓</a></div></div>
    </header>
    <div className="jev-study__layout">
      <aside id="jev-contents" className="jev-study__contents"><p>ÍNDICE / 16 SECCIONES</p><div className="jev-study__desktop-contents"><Contents /></div><details className="jev-study__mobile-contents"><summary>Abrir índice del estudio <span aria-hidden="true">+</span></summary><Contents /></details></aside>
      <div className="jev-study__body">{study.sections.map(section => <section id={`jev-${section.id}`} key={section.id} className="jev-section" aria-labelledby={`jev-${section.id}-title`}>
        <div className="jev-section__heading"><h3 id={`jev-${section.id}-title`}>{section.title}</h3><a href="#jev-contents" aria-label={`Volver al índice desde ${section.title}`}>Índice ↑</a></div>
        <Blocks blocks={section.blocks} />
      </section>)}</div>
    </div>
    <footer className="jev-study__footer"><p>FIN DEL ESTUDIO / DOCUMENTO COMPLETO DISPONIBLE</p><a className="wr-ink-link" href={JEV_PUBLICATION.documentUrl} download>Descargar informe en PDF ↓</a><a href="#jev-guide">Ver notas de lectura en inglés ↓</a></footer>
  </article>;
}
