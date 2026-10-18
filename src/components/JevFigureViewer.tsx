"use client";

import { recordMissionEvent } from "@/lib/visitor-missions";
import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { LanguageSwitch } from "./LanguageSwitch";
import "./jev-figure-viewer.css";

type Figure = { number: number; src: string; width: number; height: number; mode: string };

export function JevFigureViewer({ figure, caption, original }: { figure: Figure; caption: string; original: string }) {
  const [zoom, setZoom] = useState(1);
  const id = useId();
  return <main className="jev-viewer" lang="es">
    <header><Link href={`/writing/jev#jev-figure-${figure.number}`}>← Volver al estudio</Link><span>JEV / FIGURA {String(figure.number).padStart(2, "0")} / VECTOR</span><LanguageSwitch /></header>
    <h1>Una mirada más cerca.</h1>
    <p id={`${id}-hint`}>Ampliá la figura y desplazate dentro del panel. Con teclado: enfocá el panel y usá las flechas para recorrerlo.</p>
    <div className="jev-viewer__toolbar" role="group" aria-label="Ampliación de la figura">
      <button type="button" onClick={() => setZoom(Math.max(1, zoom - .5))} disabled={zoom === 1} aria-label="Reducir figura">−</button>
      <output aria-live="polite" aria-atomic="true">{zoom * 100}%</output>
      <button type="button" onClick={() => { recordMissionEvent("figure-enlarged"); setZoom(Math.min(4, zoom + .5)); }} disabled={zoom === 4} aria-label="Ampliar figura">+</button>
      <button type="button" onClick={() => setZoom(1)}>Ajustar al panel</button>
      <a href={figure.src} download={`jev-figura-${figure.number}.svg`}>Descargar SVG ↓</a>
    </div>
    <div className="jev-viewer__canvas" role="region" aria-label={`Figura ${figure.number} ampliada`} aria-describedby={`${id}-hint`} tabIndex={0}>
      <Image src={figure.src} width={figure.width} height={figure.height} unoptimized priority alt={caption} style={{ width: `${zoom * 100}%` }} />
    </div>
    <p className="jev-viewer__caption">{caption}</p>
    <p className="jev-viewer__provenance">{figure.mode === "native-workflow" || figure.mode === "native-published-counts" ? "Redibujado en vector a partir del contenido publicado." : "Marcas vectorizadas de la figura publicada; ejes y textos redibujados. Sin recalcular datos."} Tipografía: Barlow Condensed e IBM Plex Mono.</p>
    {figure.number === 3 && <p className="jev-viewer__provenance">La barra negra del original se muestra en crema.</p>}
    <footer><a href={original} target="_blank" rel="noopener noreferrer">Comparar con la figura original ↗</a><Link href={`/writing/jev#jev-figure-${figure.number}`}>Seguir leyendo el estudio →</Link></footer>
  </main>;
}
