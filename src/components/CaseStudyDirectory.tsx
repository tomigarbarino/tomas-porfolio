"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMotionPreference } from "./MotionPreference";
import "./case-study-directory.css";

const cascadeLayouts = {
  agora: [
    { x: .02, y: .08, size: 220, title: "candidate", image: "/media/agora/agora-c1-candidato-ingreso.png" },
    { x: .76, y: .03, size: 252, title: "evidence", image: "/media/agora/agora-03-evidencia-por-requisito.png" },
    { x: .4, y: .8, size: 216, title: "signal", words: ["EVIDENCE", "FIRST."], note: "CRITERION-LEVEL MATCHING", tone: "paper" },
    { x: .02, y: .78, size: 186, title: "review", words: ["HUMAN", "JUDGMENT."], note: "CONTEXT MATTERS", tone: "accent" },
    { x: .98, y: .94, size: 202, title: "ready", image: "/media/agora/agora-c3-candidato-entrevista-lista.png" },
  ],
  trainly: [
    { x: .03, y: .04, size: 220, title: "lesson", image: "/media/trainly/trainly-03-actividad-clase-narrada-tutor.png" },
    { x: .87, y: .07, size: 242, title: "plan", image: "/media/trainly/trainly-02-plan-decision-bloqueante@2x.png" },
    { x: .03, y: .9, size: 218, title: "practice", words: ["LEARN", "BY DOING."], note: "PRACTICE / FEEDBACK", tone: "accent" },
    { x: .88, y: .94, size: 250, title: "follow-up", image: "/media/trainly/trainly-05-seguimiento-responsable.png" },
    { x: .5, y: .46, size: 200, title: "source", words: ["COMPANY", "KNOWLEDGE."], note: "SOURCE → LEARNING", tone: "paper" },
  ],
} as const;

const cases = [
  {
    id: "agora", number: "01", name: "Agora", href: "/en/agora",
    title: "Missing context. Human judgment.",
    description: "Read the product decision and its scoped check",
    logo: "/media/agora-logo.svg", logoWidth: 126, logoHeight: 37,
    image: "/media/agora/agora-03-evidencia-por-requisito.png", width: 1440, height: 900,
  },
  {
    id: "trainly", number: "02", name: "Trainly", href: "/en/trainly",
    title: "From company knowledge to understanding.",
    description: "Explore the learning experience and implementation",
    logo: "/media/trainly/trainly-logo.svg", logoWidth: 148, logoHeight: 36,
    image: "/media/trainly/trainly-02-plan-decision-bloqueante@2x.png", width: 2880, height: 1800,
  },
] as const;

type CaseId = typeof cases[number]["id"];
type ActivePreview = { id: CaseId; input: "mouse" | "keyboard"; entrance?: number };
type Point = { x: number; y: number };

type PreviewActions = {
  registerLink: (id: CaseId, node: HTMLAnchorElement | null) => void;
  enter: (event: PointerEvent<HTMLAnchorElement>, id: CaseId) => void;
  move: (event: PointerEvent<HTMLAnchorElement>) => void;
  leave: () => void;
  focus: (event: FocusEvent<HTMLAnchorElement>, id: CaseId) => void;
  blur: () => void;
  navigate: (event: MouseEvent<HTMLAnchorElement>) => void;
  dismiss: () => void;
};

const PreviewContext = createContext<PreviewActions | null>(null);

export function CaseStudyPreviewProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const { paused } = useMotionPreference();
  const [active, setActive] = useState<ActivePreview | null>(null);
  const previewRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<Partial<Record<CaseId, HTMLAnchorElement>>>({});
  const hoveredRef = useRef<CaseId | null>(null);
  const focusedRef = useRef<CaseId | null>(null);
  const pointRef = useRef<Point>({ x: 0, y: 0 });
  const followRef = useRef<((point: Point) => void) | null>(null);
  const freezeRef = useRef<(() => void) | null>(null);
  const previewHoveredRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissedPointRef = useRef<Point | null>(null);
  const exitRef = useRef<Animation[]>([]);
  const recoveryRef = useRef<Animation[]>([]);
  const entranceRef = useRef(0);
  const product = cases.find((item) => item.id === active?.id);

  const cancelCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const cancelExit = useCallback(() => {
    exitRef.current.forEach((animation) => animation.cancel());
    recoveryRef.current.forEach((animation) => animation.cancel());
    exitRef.current = [];
    recoveryRef.current = [];
  }, []);

  const dismiss = useCallback(() => {
    // Hide before canceling fills: React may remove the portal on the following frame.
    if (previewRef.current) previewRef.current.dataset.ready = "false";
    cancelCloseTimer();
    freezeRef.current?.();
    cancelExit();
    hoveredRef.current = null;
    focusedRef.current = null;
    previewHoveredRef.current = false;
    setActive(null);
  }, [cancelCloseTimer, cancelExit]);

  function enter(event: PointerEvent<HTMLAnchorElement>, id: CaseId) {
    if (event.pointerType !== "mouse") return;
    const dismissedAt = dismissedPointRef.current;
    // Removing a hovered window can expose a trigger under the stationary
    // pointer. Only a deliberate re-entry, not that hit-test change, reopens it.
    if (dismissedAt && dismissedAt.x === event.clientX && dismissedAt.y === event.clientY) return;
    dismissedPointRef.current = null;
    cancelCloseTimer();
    previewHoveredRef.current = false;
    const recovering = active?.id === id && exitRef.current.length > 0;
    const continuing = active?.id === id;
    const nodes = recovering ? Array.from(previewRef.current?.querySelectorAll<HTMLElement>(".case-preview__echo,.case-preview__window") ?? []) : [];
    const starts = nodes.map((node) => {
      const style = getComputedStyle(node);
      return { opacity: style.opacity, transform: style.transform };
    });
    if (!recovering && previewRef.current) previewRef.current.dataset.ready = "false";
    cancelExit();
    if (previewRef.current) {
      previewRef.current.dataset.exiting = "false";
      const window = previewRef.current.querySelector<HTMLElement>(".case-preview__window");
      if (window) window.inert = false;
    }
    if (recovering) {
      const animations = nodes.map((node, index) => node.animate([
        starts[index], { opacity: 1, transform: "none" },
      ], { duration: 180, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }));
      recoveryRef.current = animations;
    }
    pointRef.current = { x: event.clientX, y: event.clientY };
    hoveredRef.current = id;
    setActive({ id, input: "mouse", entrance: continuing ? active.entrance : ++entranceRef.current });
  }

  const closeSoftly = useCallback(() => {
    cancelCloseTimer();
    if (exitRef.current.length) return;
    const preview = previewRef.current;
    if (!preview || paused) { dismiss(); return; }
    freezeRef.current?.();
    previewHoveredRef.current = false;
    preview.dataset.exiting = "true";
    const windows = Array.from(preview.querySelectorAll<HTMLElement>(".case-preview__echo")).reverse();
    const main = preview.querySelector<HTMLElement>(".case-preview__window");
    if (main) {
      main.inert = true;
      windows.push(main);
    }
    // Sample together before applying animations so a quick leave never flashes a hidden window.
    const starts = windows.map((node) => {
      const style = getComputedStyle(node);
      return { opacity: style.opacity, transform: style.transform };
    });
    cancelExit();
    const animations = windows.map((node, index) => node.animate([
      starts[index],
      { opacity: 0, transform: "translateY(6px) scale(.985)" },
    ], { duration: 200, delay: index * 200, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" }));
    exitRef.current = animations;
    const last = animations.at(-1);
    if (!last) { dismiss(); return; }
    last.onfinish = () => {
      if (exitRef.current.at(-1) === last) dismiss();
    };
  }, [paused, dismiss, cancelExit, cancelCloseTimer]);

  function scheduleClose() {
    cancelCloseTimer();
    // Freeze the last position so the window can be reached rather than chased.
    freezeRef.current?.();
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      if (!hoveredRef.current && !focusedRef.current && !previewHoveredRef.current) closeSoftly();
    }, 300);
  }

  function leave() {
    hoveredRef.current = null;
    dismissedPointRef.current = null;
    if (focusedRef.current) {
      cancelExit();
      setActive({ id: focusedRef.current, input: "keyboard" });
      return;
    }
    if (!previewHoveredRef.current) scheduleClose();
  }

  function holdPreview(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || previewRef.current?.dataset.exiting === "true") return;
    cancelCloseTimer();
    freezeRef.current?.();
    pointRef.current = { x: event.clientX, y: event.clientY };
    previewHoveredRef.current = true;
  }

  function leavePreview(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse") return;
    previewHoveredRef.current = false;
    if (!hoveredRef.current && !focusedRef.current) scheduleClose();
  }

  function registerLink(id: CaseId, node: HTMLAnchorElement | null) {
    if (node) linksRef.current[id] = node;
    else delete linksRef.current[id];
  }

  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse") return;
    pointRef.current = { x: event.clientX, y: event.clientY };
    followRef.current?.(pointRef.current);
  }

  function focus(event: FocusEvent<HTMLAnchorElement>, id: CaseId) {
    if (!event.currentTarget.matches(":focus-visible")) return;
    dismissedPointRef.current = null;
    cancelCloseTimer();
    cancelExit();
    if (previewRef.current) {
      previewRef.current.dataset.exiting = "false";
      const window = previewRef.current.querySelector<HTMLElement>(".case-preview__window");
      if (window) window.inert = false;
    }
    focusedRef.current = id;
    setActive({ id, input: "keyboard" });
  }

  function blur() {
    focusedRef.current = null;
    if (hoveredRef.current) {
      cancelExit();
      setActive({ id: hoveredRef.current, input: "mouse", entrance: active?.id === hoveredRef.current ? active.entrance : ++entranceRef.current });
    } else if (!previewHoveredRef.current) {
      closeSoftly();
    }
  }

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    hoveredRef.current = null;
    focusedRef.current = null;
    previewHoveredRef.current = false;
    closeSoftly();
  }

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    hoveredRef.current = null;
    focusedRef.current = null;
    closeSoftly();
  }, [pathname, closeSoftly]);

  useEffect(() => () => { cancelCloseTimer(); cancelExit(); }, [cancelCloseTimer, cancelExit]);

  useEffect(() => {
    const preview = previewRef.current;
    const floating = floatingRef.current;
    const link = active ? linksRef.current[active.id] : null;
    if (!preview || !floating || !active) return;
    if (paused && exitRef.current.length) {
      preview.dataset.ready = "false";
      exitRef.current.forEach((animation) => animation.finish());
      return;
    }
    if (paused) recoveryRef.current.forEach((animation) => animation.finish());
    // The directory unmounts on navigation; the root-owned exit keeps its last position.
    if (!link) return;
    floating.style.removeProperty("--preview-room");
    let frame = 0;
    let lastTime = 0;
    let position = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    const width = floating.offsetWidth;
    let height = floating.offsetHeight;
    let hasRoom = true;

    function place(point: Point) {
      const margin = 16;
      const x = point.x + width + 28 > window.innerWidth - margin ? point.x - width - 28 : point.x + 28;
      return {
        x: Math.max(margin, Math.min(x, window.innerWidth - width - margin)),
        y: Math.max(margin, Math.min(point.y + 24, window.innerHeight - height - margin)),
      };
    }

    function anchor() {
      const rect = link!.getBoundingClientRect();
      const above = rect.top - 32;
      const below = window.innerHeight - rect.bottom - 32;
      if (active!.input === "keyboard") {
        const room = Math.max(above, below);
        floating!.style.setProperty("--preview-room", `${Math.max(0, room - 112)}px`);
        height = floating!.offsetHeight;
        hasRoom = height <= room;
      }
      return place({ x: rect.right - width - 28, y: below >= above ? rect.bottom - 8 : rect.top - height - 40 });
    }

    function paint() {
      floating!.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    }

    function tick(time: number) {
      frame = 0;
      const delta = lastTime ? Math.min(time - lastTime, 64) : 16.7;
      lastTime = time;
      const ease = 1 - Math.exp(-delta / 65);
      position.x += (target.x - position.x) * ease;
      position.y += (target.y - position.y) * ease;
      if (Math.abs(target.x - position.x) + Math.abs(target.y - position.y) < .15) {
        position = { ...target };
        lastTime = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
      paint();
    }

    position = active.input === "keyboard" || paused ? anchor() : place(pointRef.current);
    target = { ...position };
    paint();
    preview.dataset.ready = hasRoom ? "true" : "false";
    followRef.current = active.input === "mouse" && !paused ? (point) => {
      target = place(point);
      if (!frame) frame = requestAnimationFrame(tick);
    } : null;
    freezeRef.current = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      target = { ...position };
      followRef.current = null;
    };

    function key(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      dismissedPointRef.current = { ...pointRef.current };
      dismiss();
    }
    function resize() { dismiss(); }
    function visibility() { if (document.hidden) dismiss(); }
    function blur() {
      hoveredRef.current = null;
      focusedRef.current = null;
      previewHoveredRef.current = false;
      closeSoftly();
    }
    function pointerOut(event: globalThis.PointerEvent) {
      if (event.pointerType === "mouse" && event.relatedTarget === null) blur();
    }
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", blur, { passive: true, capture: true });
    window.addEventListener("resize", resize);
    window.addEventListener("blur", blur);
    window.addEventListener("pointerout", pointerOut);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      followRef.current = null;
      freezeRef.current = null;
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", blur, true);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", blur);
      window.removeEventListener("pointerout", pointerOut);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [active, paused, dismiss, closeSoftly]);

  return (
    <PreviewContext.Provider value={{ registerLink, enter, move, leave, focus, blur, navigate, dismiss }}>
      {children}
      {product && active ? createPortal(
        <aside ref={previewRef} key={`${product.id}:${active.entrance ?? 0}`} className="case-preview" aria-label={`${product.name} case preview`} data-product={product.id} data-input={active.input} data-cascade={active.input === "mouse" && !paused}>
          <div className="case-preview__stage">
            {active.input === "mouse" && !paused ? cascadeLayouts[product.id].map((layer, index) => (
              <div key={layer.title} className="case-preview__echo" aria-hidden="true" inert style={{
                "--echo-x": layer.x,
                "--echo-y": layer.y,
                "--echo-size": `${layer.size}px`,
                "--echo-delay": `${index * 30}ms`,
                zIndex: index,
              } as CSSProperties}>
                <div className="case-preview__bar"><span>{product.id} / {layer.title}</span><span className="case-preview__controls">– □ ×</span></div>
                {"words" in layer ? (
                  <div className="case-preview__keyword" data-tone={layer.tone}>
                    <strong>{layer.words.map((word) => <span key={word}>{word}</span>)}</strong>
                    <small>{layer.note}</small>
                  </div>
                ) : (
                  <div className="case-preview__echo-body"><Image src={layer.image} alt="" loading="eager" width={384} height={240} /></div>
                )}
              </div>
            )) : null}
            <div ref={floatingRef} className="case-preview__follow">
              <Link className="case-preview__window" href={product.href} prefetch={true} tabIndex={-1} aria-label={`CASE_${product.number} / ${product.name.toUpperCase()} — PRODUCT PREVIEW — open case study`} onPointerEnter={holdPreview} onPointerMove={event => { pointRef.current = { x: event.clientX, y: event.clientY }; }} onPointerLeave={leavePreview} onClick={navigate}>
                <div aria-hidden="true">
                <div className="case-preview__bar"><span>CASE_{product.number} / {product.name.toUpperCase()}</span><span className="case-preview__controls">– □ ×</span></div>
                <div className="case-preview__brand"><Image src={product.logo} alt="" width={product.logoWidth} height={product.logoHeight} unoptimized /><span>PRODUCT<br />PREVIEW ↗</span></div>
                <div className="case-preview__screen"><Image src={product.image} alt="" loading="eager" width={384} height={Math.round(384 * product.height / product.width)} /></div>
                </div>
              </Link>
            </div>
          </div>
        </aside>, document.body,
      ) : null}
    </PreviewContext.Provider>
  );
}

export function CaseStudyDirectory() {
  const preview = useContext(PreviewContext);
  if (!preview) throw new Error("CaseStudyDirectory requires CaseStudyPreviewProvider");

  return (
    <nav className="pw-case-directory" aria-label="Case studies">
      {cases.map((item) => (
        <Link key={item.id} ref={(node) => preview.registerLink(item.id, node)}
          href={item.href} prefetch={true} data-case-preview={item.id}
          onPointerEnter={(event) => preview.enter(event, item.id)}
          onPointerMove={preview.move}
          onPointerLeave={preview.leave}
          onPointerDown={(event) => { if (event.pointerType !== "mouse") preview.dismiss(); }}
          onFocus={(event) => preview.focus(event, item.id)}
          onBlur={preview.blur}
          onClick={preview.navigate}>
          <span>{item.number} / {item.name}</span><strong>{item.title}</strong>
          <small>{item.description}</small><b aria-hidden="true">↗</b>
        </Link>
      ))}
    </nav>
  );
}
