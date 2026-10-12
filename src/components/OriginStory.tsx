"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AsciiVideo } from "@/components/AsciiVideo";
import { useMotionPreference } from "@/components/MotionPreference";
import { ArtifactDrag } from "@/components/ArtifactDrag";
import { BatechVideo } from "@/components/BatechVideo";
import "./origin-story.css";
import { BatechDomainMap, HogarthWorkbench } from "./StoryWorkbenches";
import { FlockStoryStudio } from "./FlockStoryStudio";
import { HogarthAppleSticker } from "./HogarthAppleSticker";
import { storyReadingLine } from "./story-scroll";

const chapters = [
  {
    id: "files",
    label: "Minecraft",
    eyebrow: "01 / Minecraft files",
    title: ["Before I knew", "it was code."],
    copy: "I changed Minecraft game files to make things happen, before I knew what programming was.",
    role: "Curiosity, before code",
    src: "/media/minecraft-ascii.mp4",
    poster: "/media/minecraft-ascii.png",
    mediaNote: "Animated photo reference / not a personal artefact",
  },
  {
    id: "conversations",
    label: "Digital menus",
    eyebrow: "02 / Digital menus",
    title: ["An idea became", "a conversation."],
    copy: "I went to restaurants on my own to offer digital menus. Making something also meant starting the conversation.",
    role: "Taking an idea to people",
    src: "/media/cafe-ascii.mp4",
    poster: "/media/cafe-ascii.png",
    mediaNote: "Animated photo reference / not a client or personal artefact",
  },
  {
    id: "hogarth",
    label: "Hogarth Worldwide",
    eyebrow: "03 / Hogarth Worldwide",
    title: ["Hogarth Worldwide.", "Into product teams."],
    role: "Frontend Developer",
    copy: "At Hogarth Worldwide, I worked on frontend engineering for Apple-related projects. The curiosity that started in game files had become professional work on interfaces.",
    src: "/media/hero-ascii.mp4",
    poster: "/media/hero-ascii.png",
    mediaNote: "Conceptual interface study / no Hogarth or Apple project imagery shown",
  },
  {
    id: "batech",
    label: "Batech",
    eyebrow: "04 / Batech",
    title: ["Batech.", "From builder to lead."],
    role: "Frontend Engineer → Frontend Lead",
    copy: "I built the SaaS frontend from the ground up with React and TypeScript and organized it by domain. I grew from the only frontend engineer into frontend leadership while continuing to deliver product features.",
    src: "/media/hero-ascii.mp4",
    poster: "/media/hero-ascii.png",
    mediaNote: "Batech company footage / my contribution: frontend engineering and leadership",
    href: "#batech",
    link: "See the Batech work",
  },
  {
    id: "interfaces",
    label: "Flock I+D",
    eyebrow: "05 / Flock I+D",
    title: ["Flock I+D.", "Product meets AI."],
    role: "Product Engineer / AI R&D",
    copy: "At Flock I+D, I work as a Product Engineer, taking features from discovery to delivery: understanding user needs, defining requirements, prioritizing, making architecture decisions, implementing and validating the result. I’m currently working on two products: Agora and Trainly.",
    src: "/media/hero-ascii.mp4",
    poster: "/media/hero-ascii.png",
    mediaNote: "Agora + Trainly / product brands · conceptual flow",
    projects: [
      { name: "Agora", logo: "/media/agora-logo.svg", logoWidth: 126, logoHeight: 37, scope: "My role / Product Owner", action: "I work across customer discovery, product priorities, architecture decisions and hands-on AI implementation. I also work on candidate UX and UI alongside recruiter workflows.", href: "/en/agora", link: "Open the Agora case" },
      { name: "Trainly", logo: "/media/trainly/trainly-logo.svg", logoWidth: 328, logoHeight: 80, scope: "My scope / Product flow · Frontend · AI", action: "I work on the product flow and frontend that connect learning, conversational assessment and manager visibility, together with the AI integration.", href: "/en/trainly", link: "Open the Trainly case" },
    ],
  },
] as const;

function StoryArt({ chapter, index, paused, active }: { chapter: typeof chapters[number]; index: number; paused: boolean; active: boolean }) {
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
        <span className="origin-story__art-index" aria-hidden="true">0{index + 1}</span>
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
        <span className="origin-story__art-index" aria-hidden="true">0{index + 1}</span>
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

  if (chapter.id === "hogarth") {
    return <div className="origin-story__art origin-story__art--hogarth" data-drag-boundary data-selected={active} aria-hidden={!active} inert={!active}>
      <span className="origin-story__art-index" aria-hidden="true">0{index + 1}</span>
      <HogarthWorkbench active={active} paused={paused} />
    </div>;
  }

  if (chapter.id === "batech") {
    return <div className="origin-story__art origin-story__art--batech" data-drag-boundary data-selected={active} aria-hidden={!active} inert={!active}>
      <span className="origin-story__art-index" aria-hidden="true">0{index + 1}</span>
      <figure className="origin-story__company-film" data-drag-frame><ArtifactDrag label="Move the Batech story film" /><BatechVideo active={active} describedBy={`${lensFilterId}-caption`} /><figcaption id={`${lensFilterId}-caption`}>Company footage / my role: frontend</figcaption></figure>
      <BatechDomainMap active={active} paused={paused} />
    </div>;
  }

  return (
    <div className="origin-story__art origin-story__art--interfaces" data-drag-boundary data-selected={active} aria-hidden={!active} inert={!active}>
      <span className="origin-story__art-index" aria-hidden="true">0{index + 1}</span>
      <FlockStoryStudio active={active} paused={paused} />
    </div>
  );
}

export function OriginStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [artIndex, setArtIndex] = useState(0);
  const [artVisible, setArtVisible] = useState(false);
  const { paused, setPaused, reducedMotion } = useMotionPreference();
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<Array<HTMLElement | null>>([]);
  const id = useId();
  const headingId = `${id}-heading`;
  const artChapter = chapters[artIndex];

  useEffect(() => {
    const stage = stageRef.current;
    const story = stage?.closest<HTMLElement>(".origin-story");
    const visual = stage?.closest<HTMLElement>(".origin-story__visual");
    const scenes = sceneRefs.current.filter((scene): scene is HTMLElement => scene !== null);
    if (!stage || !scenes.length) return;
    let frame = 0;
    let navigationFrame = 0;
    let heldPointer: number | null = null;
    let pointerFocus = false;
    let inViewport = false;

    function sync() {
      frame = 0;
      if (document.hidden) return;
      const line = storyReadingLine(story ?? null);
      const positions = scenes.map(scene => scene.getBoundingClientRect());
      const reading = positions.findIndex(box => box.top <= line && box.bottom > line);
      const preceding = positions.findLastIndex(box => box.top <= line);
      const next = reading >= 0 ? reading : Math.max(0, preceding);
      setActiveIndex(current => current === next ? current : next);
      // Keyboard exploration and active gestures keep their surface available.
      // Mouse-click focus must not pin an earlier chapter after reading resumes.
      const keyboardFocus = !pointerFocus && stage!.contains(document.activeElement) && document.activeElement?.matches(":focus-visible");
      if (heldPointer === null && !keyboardFocus && !stage!.querySelector("[data-artifact-dragging]")) {
        setArtIndex(current => current === next ? current : next);
      }
    }
    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(sync);
    }
    function visibility() {
      setArtVisible(inViewport && !document.hidden);
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; heldPointer = null; }
      else schedule();
    }
    const artObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      visibility();
    }, { threshold: .03 });
    const readingObserver = new IntersectionObserver(schedule, { rootMargin: "-25% 0px -45% 0px", threshold: 0 });
    const resize = new ResizeObserver(schedule);
    const visualResize = new ResizeObserver(() => {
      if (story && visual) story.style.setProperty("--story-sticky-height", `${visual.offsetHeight}px`);
      schedule();
    });
    artObserver.observe(stage);
    if (visual) visualResize.observe(visual);
    scenes.forEach(scene => { readingObserver.observe(scene); resize.observe(scene); });

    function down(event: PointerEvent) {
      if (event.isPrimary && event.button === 0) {
        pointerFocus = true;
        heldPointer = event.pointerId;
      }
    }
    function keyboard(event: KeyboardEvent) {
      // Canceling a pointer drag does not begin keyboard exploration.
      if (heldPointer === null && event.key !== "Escape") pointerFocus = false;
    }
    function readingIntent() {
      // Explicit native scrolling resumes reading even after keyboard exploration.
      // Focus-induced scrolling still keeps its keyboard surface available.
      pointerFocus = true;
    }
    function release(event: PointerEvent) {
      if (heldPointer === event.pointerId) heldPointer = null;
      schedule();
    }
    function blur() { heldPointer = null; schedule(); }
    function legacyChapter(event: Event) {
      if (!(event instanceof CustomEvent) || !Number.isInteger(event.detail)) return;
      const target = scenes[event.detail];
      if (target) {
        cancelAnimationFrame(navigationFrame);
        navigationFrame = requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" }));
      }
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointerup", release, true);
    window.addEventListener("pointercancel", release, true);
    window.addEventListener("blur", blur);
    window.addEventListener("keydown", keyboard, true);
    window.addEventListener("wheel", readingIntent, { passive: true });
    window.addEventListener("touchmove", readingIntent, { passive: true });
    window.addEventListener("tg-story-chapter", legacyChapter);
    stage.addEventListener("pointerdown", down, true);
    stage.addEventListener("focusout", schedule);
    document.addEventListener("visibilitychange", visibility);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(navigationFrame);
      artObserver.disconnect(); readingObserver.disconnect(); resize.disconnect(); visualResize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointerup", release, true);
      window.removeEventListener("pointercancel", release, true);
      window.removeEventListener("blur", blur);
      window.removeEventListener("keydown", keyboard, true);
      window.removeEventListener("wheel", readingIntent);
      window.removeEventListener("touchmove", readingIntent);
      window.removeEventListener("tg-story-chapter", legacyChapter);
      stage.removeEventListener("pointerdown", down, true);
      stage.removeEventListener("focusout", schedule);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <section id="story" className="origin-story origin-story--scroll" data-chapter={artChapter.id} data-step={chapters[activeIndex].id} data-art-active={artVisible && !paused} aria-labelledby={headingId}>
      <header className="origin-story__header">
        <div className="origin-story__intro">
          <p className="origin-story__kicker">Story / from files to product teams</p>
          <h2 id={headingId}>The same curiosity.</h2>
          <p className="origin-story__summary">Different problems. The same instinct: make something, take it to people, and keep learning.</p>
          <a className="origin-story__fast-track" href="#work">Selected work <span aria-hidden="true">↗</span></a>
        </div>
        <nav className="origin-story__timeline" aria-label="Career stages">
          {chapters.map((chapter, index) => <a key={chapter.id} href={`#story-${chapter.id}`} aria-current={activeIndex === index ? "step" : undefined}><span aria-hidden="true">0{index + 1}</span>{chapter.label}<i aria-hidden="true">↘</i></a>)}
        </nav>
      </header>

      <div className="origin-story__scroll-layout">
        <aside className="origin-story__visual" aria-label="Story artifacts">
          <div className="origin-story__stage" data-drag-boundary ref={stageRef}>
            {chapters.map((chapter, index) => <StoryArt key={chapter.id} chapter={chapter} index={index} active={artIndex === index} paused={paused || !artVisible || artIndex !== index} />)}
          </div>
          <p className="origin-story__media-note">{chapters.map((chapter, index) => <span key={chapter.id} data-selected={artIndex === index} aria-hidden={artIndex !== index}>{chapter.mediaNote}</span>)}</p>
          <div className="origin-story__progress" aria-hidden="true"><span>0{activeIndex + 1} / 05</span><div>{chapters.map((chapter, index) => <i key={chapter.id} data-current={activeIndex === index} data-complete={activeIndex > index} />)}</div></div>
        </aside>

        <div className="origin-story__scene-list">
          {chapters.map((chapter, index) => <article key={chapter.id} id={`story-${chapter.id}`} ref={node => { sceneRefs.current[index] = node; }} className="origin-story__scene" data-story-step={chapter.id} data-selected={activeIndex === index} aria-labelledby={`${id}-${chapter.id}-title`} tabIndex={-1} data-drag-boundary>
            <p className="origin-story__scene-kicker">{chapter.eyebrow}</p>
            <h3 className="origin-story__title" id={`${id}-${chapter.id}-title`}>{chapter.title.map(line => <span key={line}>{line}</span>)}</h3>
            <p className="origin-story__scene-role">{chapter.role}</p>
            <div className={`origin-story__reading${chapter.id === "hogarth" ? " origin-story__reading--hogarth" : ""}`} data-drag-frame>
              <ArtifactDrag label={`Move the ${chapter.label} story card`} />
              {chapter.id === "hogarth" ? <div className="origin-story__apple-slot"><HogarthAppleSticker /></div> : null}
              <p className="origin-story__copy">{chapter.copy}</p>
              {"href" in chapter ? <a className="origin-story__episode-link" href={chapter.href}>{chapter.link} <span aria-hidden="true">↗</span></a> : null}
            </div>
            {"projects" in chapter ? <div className="origin-story__projects" data-drag-boundary>{chapter.projects.map(project => <article key={project.name} data-drag-frame>
              <ArtifactDrag label={`Move the ${project.name} career card`} />
              <p className="origin-story__episode-kind">Project / Flock I+D</p>
              <h4><span className="origin-story__project-brand"><Image src={project.logo} alt={project.name} width={project.logoWidth} height={project.logoHeight} /></span></h4>
              <p className="origin-story__project-scope">{project.scope}</p>
              <p>{project.action}</p>
              <a className="origin-story__episode-link" href={project.href}>{project.link} <span aria-hidden="true">↗</span></a>
            </article>)}</div> : null}
          </article>)}
        </div>
      </div>

      <footer className="origin-story__footer">
        <a className="origin-story__work-link" href="#work">Explore the work <span aria-hidden="true">→</span></a>
        <p className="origin-story__status">Five stages. One continuing story.</p>
        <div className="origin-story__utilities"><button type="button" disabled={reducedMotion} title={reducedMotion ? "Your device is set to reduced motion." : undefined} onClick={() => setPaused(!paused)}>{reducedMotion ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}</button></div>
      </footer>
    </section>
  );
}
