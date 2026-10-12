"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AsciiVideo } from "./AsciiVideo";
import { useMotionPreference } from "./MotionPreference";
import { PortfolioDialogs, type PortfolioDialog } from "./PortfolioDialogs";
import { Window } from "./Window";
import { SceneDiscoveries } from "./SceneDiscoveries";
import { SiteHeader } from "./SiteHeader";
import "./hero-case-window.css";

export function Observatory() {
  const stage = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLButtonElement>(null);
  const { paused } = useMotionPreference();
  const [windowState, setWindowState] = useState<"open" | "minimized" | "closed">("open");
  const [selected, setSelected] = useState<PortfolioDialog>(null);

  useEffect(() => {
    function openDialog(event: Event) {
      if (event instanceof CustomEvent && (event.detail === "profile" || event.detail === "quests")) setSelected(event.detail);
    }
    window.addEventListener("tg-portfolio-dialog", openDialog);
    return () => window.removeEventListener("tg-portfolio-dialog", openDialog);
  }, []);

  function hideWindow(state: "minimized" | "closed") {
    setWindowState(state);
    requestAnimationFrame(() => restore.current?.focus({ preventScroll: true }));
  }
  function openWindow() {
    setWindowState("open");
    requestAnimationFrame(() => stage.current?.querySelector<HTMLButtonElement>(".window-drag")?.focus({ preventScroll: true }));
  }

  return (
    <section className="observatory" id="top" aria-labelledby="hero-title">
      <div className="hero-world" aria-hidden="true"><AsciiVideo src="/media/hero-ascii.mp4" poster="/media/hero-ascii.png" paused={paused} /></div>
      <div className="observatory-stage" ref={stage}>
        <div className="scene-ink" aria-hidden="true" />
        <SiteHeader context="home" />
        <a className="scene-caption" href="#batech"><span>BATECH / COMPANY FOOTAGE</span><span>My role: frontend leadership</span></a>
        <SceneDiscoveries onPlay={() => setSelected("quests")} />
        <div className="hero-copy" data-scroll-depth="18"><h1 id="hero-title">Tomás<br />Garbarino.</h1><p><span className="hero-role">Product Engineer / Applied AI</span><br />Real problems. Working systems.</p><p className="hero-contribution">I connect customer discovery, product decisions and hands-on AI implementation.</p><a className="button-primary mobile-case-link" href="#work">Explore case studies →</a><div className="mobile-routes"><button type="button" onClick={() => setSelected("profile")}>Quick profile →</button><a href="#story">Story →</a><button type="button" onClick={() => setSelected("quests")}>Side quests +</button><a href="#contact">Contact ↗</a></div></div>
        {windowState !== "closed" && <Window project="Agora" container={stage} minimized={windowState === "minimized"} onMinimize={() => hideWindow("minimized")} onClose={() => hideWindow("closed")}>
          <div className="hero-case-artifact" role="img" aria-label="Conceptual Agora guardrail: missing requirements go to human review">
            <span className="hero-case-artifact__edition">01 / A REAL PRODUCT DECISION</span>
            <div className="hero-case-artifact__brand"><Image src="/media/agora-logo.svg" alt="" width={126} height={37} draggable={false} /><span aria-hidden="true">↗</span></div>
            <div className="hero-case-artifact__flow" aria-hidden="true"><span>NO CRITERIA</span><b>→</b><span>HUMAN REVIEW</span></div>
            <span className="hero-case-artifact__note">CONTEXT BEFORE CONFIDENCE.</span>
          </div>
          <p>Recruiting workflows. AI with context.</p>
          <p className="window-scope">Flock I+D / Product Owner</p>
          <Link className="button-primary" href="/en/agora" prefetch={true}>Read the Agora case →</Link>
        </Window>}
        <footer className="hero-footer"><a href="#trainly">Trainly / learning &amp; assessment →</a><button type="button" onClick={() => setSelected("profile")}>Quick profile →</button><button type="button" onClick={() => setSelected("quests")}>Side quests +</button><button ref={restore} type="button" className="restore-window" hidden={windowState === "open"} onClick={openWindow}>{windowState === "minimized" ? "Restore Agora ↑" : "Open Agora window +"}</button></footer>
      </div>
      <PortfolioDialogs selected={selected} onDismiss={() => setSelected(null)} />
    </section>
  );
}
