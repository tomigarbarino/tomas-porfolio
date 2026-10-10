"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AsciiVideo } from "./AsciiVideo";
import { useMotionPreference } from "./MotionPreference";
import { PortfolioDialogs, type PortfolioDialog } from "./PortfolioDialogs";
import { Window } from "./Window";
import { SceneDiscoveries } from "./SceneDiscoveries";
import { SiteHeader } from "./SiteHeader";

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
        <div className="hero-copy" data-scroll-depth="18"><h1 id="hero-title">Tomás<br />Garbarino.</h1><p><span className="hero-role">Product Engineer / Applied AI</span><br />Real problems. Working systems.</p><p className="hero-contribution">I connect customer discovery, product decisions and hands-on AI implementation.</p><a className="button-primary mobile-case-link" href="#work">Explore selected work →</a><div className="mobile-routes"><button type="button" onClick={() => setSelected("profile")}>Quick profile →</button><a href="#story">Story →</a><button type="button" onClick={() => setSelected("quests")}>Side quests +</button><a href="#contact">Contact ↗</a></div></div>
        {windowState !== "closed" && <Window container={stage} minimized={windowState === "minimized"} onMinimize={() => hideWindow("minimized")} onClose={() => hideWindow("closed")}><div className="trainly-artifact" role="img" aria-label="Conceptual Trainly loop: Source, Learn, Assess"><span className="trainly-edition">01 / PRODUCT EXPERIMENT</span><strong className="trainly-wordmark">TRAINLY<span aria-hidden="true">↗</span></strong><div className="trainly-loop" aria-hidden="true"><span>SOURCE</span><span>LEARN</span><span>ASSESS</span></div><span className="trainly-print-note">KNOWLEDGE. IN A LOOP.</span></div><p>AI-powered learning & assessment</p><p className="window-scope">Product flow · Frontend · AI integration</p><Link className="button-primary" href="/en/trainly" prefetch={false}>Open Trainly / full case →</Link></Window>}
        <footer className="hero-footer"><a href="#agora">Agora / product ownership + AI →</a><button type="button" onClick={() => setSelected("profile")}>Quick profile →</button><button type="button" onClick={() => setSelected("quests")}>Side quests +</button><button ref={restore} type="button" className="restore-window" hidden={windowState === "open"} onClick={openWindow}>{windowState === "minimized" ? "Restore Trainly ↑" : "Open Trainly window +"}</button></footer>
      </div>
      <PortfolioDialogs selected={selected} onDismiss={() => setSelected(null)} />
    </section>
  );
}
