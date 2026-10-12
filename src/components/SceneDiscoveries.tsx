"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import "./scene-discoveries.css";

const discoveries = [
  { id: "files", number: "01", title: "Before code.", subtitle: "Minecraft files", detail: "A small edit. A different game.", action: "Follow the files", chapter: 0 },
  { id: "menus", number: "02", title: "Into the world.", subtitle: "Digital menus", detail: "An idea, taken outside the screen.", action: "Open the menus chapter", chapter: 1 },
] as const;
type DiscoveryId = typeof discoveries[number]["id"];

export function SceneDiscoveries({ onPlay }: { onPlay: () => void }) {
  const [hovered, setHovered] = useState<DiscoveryId | null>(null);
  const [focused, setFocused] = useState<DiscoveryId | null>(null);
  const [focusedPanel, setFocusedPanel] = useState<DiscoveryId | null>(null);
  const [pinned, setPinned] = useState<DiscoveryId | null>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const suppressFocus = useRef(false);
  // A hovered object may preview over a focused object, but never hide an
  // actionable panel while its link or close control owns keyboard focus.
  const visible = focusedPanel ?? hovered ?? focused ?? pinned;

  function close(index: number) {
    setHovered(null);
    setFocused(null);
    setFocusedPanel(null);
    setPinned(null);
    suppressFocus.current = true;
    buttons.current[index]?.focus({ preventScroll: true });
    suppressFocus.current = false;
  }

  function escape(event: KeyboardEvent<HTMLElement>, index: number) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    close(index);
  }

  return (
    <div className="scene-discoveries" data-detail-open={visible !== null}>
      <div className="scene-stamp" aria-hidden="true"><span>CURIOUS<br />BY<br />DEFAULT</span></div>
      <svg className="scene-thread" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true"><path d="M320 290 C420 100 710 120 865 285 S1240 440 1260 610" /><path d="M310 302 C470 185 670 270 805 400" /><circle cx="320" cy="290" r="8" /><circle cx="865" cy="285" r="6" /></svg>
      {discoveries.map((item, index) => {
        const open = visible === item.id;
        return <article key={item.id} className={`discovery discovery--${item.id}`} data-open={open} onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(item.id); }} onPointerLeave={() => setHovered(current => current === item.id ? null : current)} onFocusCapture={event => {
          if (suppressFocus.current) return;
          const target = event.target as HTMLElement;
          setFocusedPanel(target.closest(".discovery-panel") ? item.id : null);
          if (target.matches(":focus-visible")) { setFocused(item.id); setHovered(null); }
        }} onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(current => current === item.id ? null : current);
            setFocusedPanel(current => current === item.id ? null : current);
          } else if (!(event.relatedTarget instanceof Element) || !event.relatedTarget.closest(".discovery-panel")) {
            setFocusedPanel(current => current === item.id ? null : current);
          }
        }} onKeyDown={event => escape(event, index)}>
          <button ref={element => { buttons.current[index] = element; }} type="button" className="discovery-object" aria-label={`Discover ${item.subtitle}`} aria-expanded={open} aria-controls={`discovery-${item.id}`} onClick={() => {
            // Explicit activation transfers focus even on browsers that do not
            // focus buttons on a pointer click, before another panel is hidden.
            buttons.current[index]?.focus({ preventScroll: true });
            setFocusedPanel(null);
            if (pinned === item.id) { setPinned(null); setHovered(null); setFocused(null); }
            else { setPinned(item.id); setHovered(item.id); }
          }}>
            <span className="discovery-number">{item.number} / FOUND IN THE FILES</span>
            <span className="discovery-image" aria-hidden="true"><span className="discovery-crosshair">+</span></span>
            <span className="discovery-title">{item.title}</span>
            <span className="discovery-subtitle">{item.subtitle}<span aria-hidden="true">↗</span></span>
          </button>
          <div className="discovery-panel" id={`discovery-${item.id}`} role="region" aria-label={item.subtitle} aria-hidden={!open} inert={!open}>
            <div className="discovery-panel-top"><span>FOUND / {item.number}</span><button type="button" aria-label={`Close ${item.subtitle} detail`} onClick={() => close(index)}>×</button></div>
            <p>{item.detail}</p>
            <a href={item.chapter === 0 ? "#story-files" : "#story-conversations"} onClick={() => {
              setHovered(null); setPinned(null); setFocused(null); setFocusedPanel(null);
              const story = document.getElementById(item.chapter === 0 ? "story-files" : "story-conversations");
              if (story) { story.tabIndex = -1; story.focus({ preventScroll: true }); }
            }}>{item.action} <span aria-hidden="true">↗</span></a>
          </div>
        </article>;
      })}
      <button type="button" className="scene-play" aria-label="Explore side quests" onClick={onPlay}><span aria-hidden="true" className="scene-play-plus">✳</span><span>SIDE<br /><strong>QUESTS</strong></span><span className="scene-play-note">a small detour ↗</span></button>
    </div>
  );
}
