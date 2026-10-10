"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AsciiVideo } from "@/components/AsciiVideo";
import { useMotionPreference } from "@/components/MotionPreference";
import { ArtifactDrag } from "@/components/ArtifactDrag";
import { ConceptualProductFlow } from "@/components/ConceptualProductFlow";
import "./origin-story.css";

const chapters = [
  {
    id: "files",
    label: "Minecraft files",
    eyebrow: "01 / The same curiosity",
    title: ["Before I knew", "it was code."],
    copy: "I changed Minecraft game files to make things happen, before I knew what programming was.",
    src: "/media/minecraft-ascii.mp4",
    poster: "/media/minecraft-ascii.png",
    mediaNote: "Animated photo reference / not a personal artefact",
  },
  {
    id: "conversations",
    label: "Digital menus",
    eyebrow: "02 / Outside the screen",
    title: ["An idea became", "a conversation."],
    copy: "I went to restaurants on my own to offer digital menus. Making something also meant starting the conversation.",
    src: "/media/cafe-ascii.mp4",
    poster: "/media/cafe-ascii.png",
    mediaNote: "Animated photo reference / not a client or personal artefact",
  },
  {
    id: "interfaces",
    label: "Interfaces → AI",
    eyebrow: "03 / Connecting systems",
    title: ["Interfaces.", "Into AI products."],
    copy: "Frontend engineering and leadership became my way into AI product engineering. Today at Agora, I work across product priorities, customer discovery, architecture and AI features.",
    src: "/media/hero-ascii.mp4",
    poster: "/media/hero-ascii.png",
    mediaNote: "Batech company footage / my role: frontend leadership",
  },
] as const;

const experience = [
  ["Hogarth Worldwide", "Frontend engineering for Apple-related projects."],
  ["Batech", "Frontend engineering and leadership on AI and computer-vision products."],
  ["Flock", "Product Engineer, AI R&D."],
] as const;

const curiosityFacts = [
  ["Files", "My first experiments were changes to Minecraft game files."],
  ["Places", "I went to restaurants on my own to offer digital menus."],
  ["Work", "My work moved from frontend engineering into AI product engineering."],
] as const;

function StoryArt({ chapter, paused, active }: { chapter: typeof chapters[number]; paused: boolean; active: boolean }) {
  const lensFilterId = `story-lens-${useId()}`;
  const artRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const lensPoint = useRef({ x: 0, y: 0 });
  const stopLens = useRef<(() => void) | null>(null);
  useEffect(() => {
    const lens = lensRef.current;
    const handle = lens?.querySelector<HTMLButtonElement>(".artifact-drag");
    if (chapter.id !== "files" || !lens || !handle) return;
    let keyboardStart: { x: number; y: number } | null = null;
    function position(point: { x: number; y: number }) {
      Object.assign(lensPoint.current, point);
      lens!.style.setProperty("--lens-follow-x", `${point.x}px`);
      lens!.style.setProperty("--lens-follow-y", `${point.y}px`);
    }
    function keyboard(event: globalThis.KeyboardEvent) {
      stopLens.current?.();
      if (event.key.startsWith("Arrow") || event.key === "Home") {
        keyboardStart ??= { x: lensPoint.current.x, y: lensPoint.current.y };
        // Rebase before ArtifactDrag's clamp; zero manual offsets must remain
        // reachable even after follow compensated for a large explicit drag.
        if (event.key === "Home") position({ x: 0, y: 0 });
      } else if (event.key === "Escape" && keyboardStart) {
        position(keyboardStart);
        keyboardStart = null;
      }
    }
    function clear() { keyboardStart = null; }
    const drag = new MutationObserver(() => {
      if (lens.hasAttribute("data-artifact-dragging")) clear();
    });
    drag.observe(lens, { attributes: true, attributeFilter: ["data-artifact-dragging"] });
    handle.addEventListener("keydown", keyboard, true);
    handle.addEventListener("blur", clear);
    return () => {
      drag.disconnect();
      handle.removeEventListener("keydown", keyboard, true);
      handle.removeEventListener("blur", clear);
    };
  }, [chapter.id]);

  useEffect(() => {
    if (chapter.id !== "files" || paused || !active) return;
    const art = artRef.current;
    const lens = lensRef.current;
    const film = art?.querySelector<HTMLElement>(".origin-story__minecraft-image");
    if (!art || !lens || !film) return;
    let frame: number | null = null;
    let previous = 0;
    let heldPointer: number | null = null;
    let target = { ...lensPoint.current };

    function stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previous = 0;
      lens!.dataset.lensFollowing = "false";
      target = { ...lensPoint.current };
    }
    function follow(now: number) {
      if (document.hidden || heldPointer !== null || lens!.hasAttribute("data-artifact-dragging")) { stop(); return; }
      const elapsed = previous ? Math.min(40, now - previous) : 16;
      previous = now;
      const amount = 1 - Math.exp(-elapsed / 150);
      const point = lensPoint.current;
      point.x += (target.x - point.x) * amount;
      point.y += (target.y - point.y) * amount;
      const settled = Math.abs(target.x - point.x) + Math.abs(target.y - point.y) < .1;
      if (settled) Object.assign(point, target);
      lens!.style.setProperty("--lens-follow-x", `${point.x}px`);
      lens!.style.setProperty("--lens-follow-y", `${point.y}px`);
      if (settled) { frame = null; previous = 0; lens!.dataset.lensFollowing = "false"; }
      else frame = requestAnimationFrame(follow);
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || document.hidden) return;
      if (event.buttons || heldPointer !== null || lens!.hasAttribute("data-artifact-dragging")) { stop(); return; }
      const hit = event.target instanceof Node ? event.target : null;
      if (!hit || (!film!.contains(hit) && !lens!.contains(hit))) return;
      const bounds = art!.getBoundingClientRect();
      const image = film!.getBoundingClientRect();
      const rect = lens!.getBoundingClientRect();
      if (!bounds.width || !bounds.height || !rect.width || !rect.height) return;
      const draggedX = parseFloat(lens!.style.getPropertyValue("--artifact-x")) || 0;
      const draggedY = parseFloat(lens!.style.getPropertyValue("--artifact-y")) || 0;
      // Keep ArtifactDrag's offsets untouched. Its clamp and Home/Escape still
      // own translate; follow composes a separate, bounded transform around it.
      const baseX = rect.left - bounds.left - draggedX - lensPoint.current.x;
      const baseY = rect.top - bounds.top - draggedY - lensPoint.current.y;
      const minX = image.left - bounds.left + (bounds.width > 800 ? image.width * .46 : 12);
      const minY = Math.max(54, image.top - bounds.top + 38);
      const maxX = Math.max(minX, image.right - bounds.left - rect.width - 18);
      const maxY = Math.max(minY, image.bottom - bounds.top - rect.height - 32);
      const left = Math.max(minX, Math.min(maxX, event.clientX - bounds.left - rect.width / 2));
      const top = Math.max(minY, Math.min(maxY, event.clientY - bounds.top - rect.height / 2));
      target = { x: left - baseX - draggedX, y: top - baseY - draggedY };
      if (frame === null) { lens!.dataset.lensFollowing = "true"; frame = requestAnimationFrame(follow); }
    }
    function down(event: PointerEvent) {
      if (!event.isPrimary) return;
      heldPointer = event.pointerId;
      stop();
    }
    function release(event: PointerEvent) {
      if (heldPointer === event.pointerId) heldPointer = null;
      // A new mouse move resumes follow; releasing never undoes a manual move.
    }
    function keyboard() { stop(); }
    function hidden() { if (document.hidden) { heldPointer = null; stop(); } }
    function blur() { heldPointer = null; stop(); }
    stopLens.current = stop;
    art.addEventListener("pointermove", move, { passive: true });
    art.addEventListener("pointerdown", down, true);
    art.addEventListener("keydown", keyboard, true);
    window.addEventListener("pointerup", release, true);
    window.addEventListener("pointercancel", release, true);
    window.addEventListener("blur", blur);
    window.addEventListener("resize", stop);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      stop();
      stopLens.current = null;
      art.removeEventListener("pointermove", move);
      art.removeEventListener("pointerdown", down, true);
      art.removeEventListener("keydown", keyboard, true);
      window.removeEventListener("pointerup", release, true);
      window.removeEventListener("pointercancel", release, true);
      window.removeEventListener("blur", blur);
      window.removeEventListener("resize", stop);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [chapter.id, paused, active]);

  if (chapter.id === "files") {
    return (
      <div ref={artRef} className="origin-story__art origin-story__art--files" data-drag-boundary data-selected={active} aria-hidden={!active} inert={!active}>
        <div className="origin-story__minecraft-image" aria-hidden="true">
          <AsciiVideo src={chapter.src} poster={chapter.poster} paused={paused} className="origin-story__video" />
        </div>
        <div ref={lensRef} className="origin-story__selection origin-story__bridge" style={{ backdropFilter: `url("#${lensFilterId}")` }} data-drag-frame data-lens-following="false" aria-label="Color lens over the animated Minecraft reference">
          <svg className="origin-story__lens-filter" aria-hidden="true" focusable="false" width="0" height="0">
            <defs>
              <filter id={lensFilterId} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
                <feFlood floodColor="currentColor" result="tone" />
                <feComposite in="SourceGraphic" in2="tone" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
              </filter>
            </defs>
          </svg>
          <span className="origin-story__selection-label"><span>Chromatic study</span></span>
          <ArtifactDrag label="Move the color lens" />
          <span className="origin-story__selection-corner" aria-hidden="true" />
          <span className="origin-story__cursor" aria-hidden="true" />
        </div>
        <div className="origin-story__file-piece" data-drag-frame>
          <ArtifactDrag label="Move the game files note" />
          <span className="origin-story__file-fold" aria-hidden="true" />
          <p>Game files</p>
          <span className="origin-story__file-lines"><i /><i /><i /></span>
        </div>
      </div>
    );
  }

  if (chapter.id === "conversations") {
    return (
      <div className="origin-story__art origin-story__art--conversations" data-drag-boundary data-selected={active} aria-hidden={!active} inert={!active}>
        <div className="origin-story__cafe-print" aria-hidden="true">
          <AsciiVideo src={chapter.src} poster={chapter.poster} paused={paused} className="origin-story__video" />
        </div>
        <div className="origin-story__menu-piece origin-story__bridge" data-drag-frame>
          <ArtifactDrag label="Move the conceptual menu" />
          <p>Conceptual menu</p>
          <strong>MENU</strong>
          <span className="origin-story__menu-rule" />
          <span className="origin-story__menu-lines"><i /><i /><i /><i /><i /><i /></span>
          <span className="origin-story__menu-mark" />
        </div>
      </div>
    );
  }

  return (
    <div className="origin-story__art origin-story__art--interfaces" data-drag-boundary data-selected={active} aria-hidden={!active} inert={!active}>
      <figure className="origin-story__system-film" data-drag-frame>
        <ArtifactDrag label="Move the Batech story film" />
        <div className="origin-story__system-film-media" aria-hidden="true">
          <AsciiVideo src={chapter.src} poster={chapter.poster} paused={paused} className="origin-story__video" />
        </div>
        <figcaption>Batech / frontend leadership</figcaption>
      </figure>
      <figure className="origin-story__product-plane origin-story__bridge" data-drag-frame>
        <ArtifactDrag label="Move the Trainly product image" />
        {/* The real product image preserves its full frame and carries its scope. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/trainly-product.png" alt="Trainly product interface" width="1350" height="652" loading="lazy" decoding="async" />
        <figcaption>Trainly / Product flow · Frontend · AI</figcaption>
      </figure>
      <ConceptualProductFlow />
    </div>
  );
}

export function OriginStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [curiosityOpen, setCuriosityOpen] = useState(false);
  const [artVisible, setArtVisible] = useState(false);
  const { paused, setPaused, reducedMotion } = useMotionPreference();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const chapter = chapters[activeIndex];
  const headingId = `${id}-heading`;
  const curiosityId = `${id}-curiosity`;

  function cancelPreview() {
    if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  }
  useEffect(() => () => { if (hoverTimer.current !== null) clearTimeout(hoverTimer.current); }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let inViewport = false;
    function syncArtVisibility() {
      setArtVisible(inViewport && !document.hidden);
    }
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      syncArtVisibility();
    }, { threshold: 0.03 });

    observer.observe(stage);
    document.addEventListener("visibilitychange", syncArtVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncArtVisibility);
    };
  }, []);

  useEffect(() => {
    function handleStoryChapter(event: Event) {
      if (!(event instanceof CustomEvent)) return;

      const index: unknown = event.detail;
      if (
        typeof index !== "number" ||
        !Number.isInteger(index) ||
        index < 0 ||
        index >= chapters.length
      ) return;

      setActiveIndex(index);
    }

    window.addEventListener("tg-story-chapter", handleStoryChapter);
    return () => window.removeEventListener("tg-story-chapter", handleStoryChapter);
  }, []);

  function selectChapter(index: number, focusTab = false) {
    cancelPreview();
    setActiveIndex(index);
    if (focusTab) tabRefs.current[index]?.focus({ preventScroll: true });
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % chapters.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + chapters.length) % chapters.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = chapters.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectChapter(nextIndex, true);
  }

  return (
    <section id="story" className="origin-story" data-chapter={chapter.id} data-art-active={artVisible && !paused} aria-labelledby={headingId}>
      <header className="origin-story__header" data-scroll-depth="14">
        <div className="origin-story__intro">
          <p className="origin-story__kicker">Story / three chapters</p>
          <h2 id={headingId}>The same curiosity.</h2>
          <p className="origin-story__summary">Changing game files. Taking digital menus to restaurants. Building interfaces and AI products.</p>
          <p className="origin-story__contribution">Today, I connect customer discovery, product decisions and hands-on AI implementation.</p>
          <a className="origin-story__fast-track" href="#work">Selected work <span aria-hidden="true">↗</span></a>
        </div>
        <div className="origin-story__tabs" role="tablist" aria-label="Story chapters">
          {chapters.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`${id}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`${id}-panel-${item.id}`}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => selectChapter(index)}
              onPointerEnter={event => {
                if (event.pointerType !== "mouse") return;
                cancelPreview();
                hoverTimer.current = setTimeout(() => selectChapter(index), 200);
              }}
              onPointerLeave={cancelPreview}
              onPointerCancel={cancelPreview}
              onFocus={event => { if (event.currentTarget.matches(":focus-visible")) selectChapter(index); }}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span className="origin-story__tab-number" aria-hidden="true">0{index + 1}</span>
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="origin-story__stage" data-scroll-depth="-36" data-drag-boundary ref={stageRef}>
        {chapters.map((item,index) => <StoryArt key={item.id} chapter={item} active={activeIndex === index} paused={paused || !artVisible || activeIndex !== index} />)}
        <span className="origin-story__art-index" aria-hidden="true">0{activeIndex + 1}</span>

        {chapters.map((item, index) => (
          <article
            key={item.id}
            id={`${id}-panel-${item.id}`}
            className="origin-story__panel"
            role="tabpanel"
            aria-labelledby={`${id}-tab-${item.id}`}
            aria-hidden={activeIndex !== index}
            inert={activeIndex !== index}
            data-selected={activeIndex === index}
            data-story-panel={item.id}
            tabIndex={activeIndex === index ? 0 : -1}
          >
            <p className="origin-story__eyebrow">{item.eyebrow}</p>
            <h3 className="origin-story__title">
              {item.title.map((line) => <span key={line}>{line}</span>)}
            </h3>
            <div className="origin-story__reading" data-drag-frame>
              <ArtifactDrag label={`Move the ${item.label} story card`} />
              <p className="origin-story__copy">{item.copy}</p>
              {item.id === "interfaces" ? (
                <nav className="origin-story__case-links" aria-label="Explore project cases">
                  <a href="#agora">Agora <span aria-hidden="true">↗</span></a>
                  <a href="#trainly">Trainly <span aria-hidden="true">↗</span></a>
                  <a href="#batech">Batech <span aria-hidden="true">↗</span></a>
                </nav>
              ) : null}
            </div>
            <div className="origin-story__chapter-actions">
              {index < chapters.length - 1 ? (
                <button type="button" className="origin-story__next" onClick={() => selectChapter(index + 1, true)}>
                  Next chapter <span aria-hidden="true">→</span>
                </button>
              ) : (
                <a className="origin-story__next" href="#work">Explore the work <span aria-hidden="true">→</span></a>
              )}
              <button
                type="button"
                className="origin-story__previous"
                disabled={index === 0}
                onClick={() => selectChapter(index - 1, true)}
              >
                <span aria-hidden="true">←</span> Previous
              </button>
            </div>
          </article>
        ))}
        <p className="origin-story__media-note">{chapter.mediaNote}</p>
      </div>

      <dl className="origin-story__career" aria-label="Experience behind the work">
        {experience.map(([company, scope]) => <div key={company}><dt>{company}</dt><dd>{scope}</dd></div>)}
      </dl>

      <footer className="origin-story__footer">
        <a className="origin-story__work-link" href="#work">Skip to selected work <span aria-hidden="true">→</span></a>
        <p className="origin-story__status" role="status" aria-live="polite" aria-atomic="true">
          Chapter {activeIndex + 1} of {chapters.length}
        </p>
        <div className="origin-story__utilities">
          <button type="button" aria-expanded={curiosityOpen} aria-controls={curiosityId} onClick={() => setCuriosityOpen((open) => !open)}>
            Curiosity file <span aria-hidden="true">{curiosityOpen ? "−" : "+"}</span>
          </button>
          <button
            type="button"
            disabled={reducedMotion}
            title={reducedMotion ? "Your device is set to reduced motion." : undefined}
            onClick={() => setPaused(!paused)}
          >
            {reducedMotion ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}
          </button>
        </div>
      </footer>

      <aside id={curiosityId} className="origin-story__curiosity" aria-label="Curiosity file" hidden={!curiosityOpen}>
        <h3>A few things behind the work.</h3>
        <ul>
          {curiosityFacts.map(([label, fact]) => <li key={label}><span>{label}</span>{fact}</li>)}
        </ul>
      </aside>
    </section>
  );
}
