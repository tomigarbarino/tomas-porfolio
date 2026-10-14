"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { useMotionPreference } from "./MotionPreference";
import "./case-study-directory.css";

const cascadeLayouts = {
  agora: [
    { x: .02, y: .08, size: 220, title: "candidate", image: "/media/agora/agora-c1-candidato-ingreso.png" },
    { x: .76, y: .03, size: 252, title: "evidence", image: "/media/agora/agora-03-evidencia-por-requisito.png" },
    { x: .4, y: .8, size: 216, title: "interview", image: "/media/agora/agora-c3-candidato-entrevista-lista.png" },
    { x: .02, y: .78, size: 186, title: "review", image: "/media/agora/agora-03-evidencia-por-requisito.png" },
    { x: .98, y: .94, size: 202, title: "ready", image: "/media/agora/agora-c3-candidato-entrevista-lista.png" },
  ],
  trainly: [
    { x: .03, y: .04, size: 220, title: "lesson", image: "/media/trainly/trainly-03-actividad-clase-narrada-tutor.png" },
    { x: .87, y: .07, size: 242, title: "plan", image: "/media/trainly/trainly-02-plan-decision-bloqueante@2x.png" },
    { x: .03, y: .9, size: 218, title: "practice", image: "/media/trainly/trainly-04-cuestionario-feedback.png" },
    { x: .88, y: .94, size: 250, title: "follow-up", image: "/media/trainly/trainly-05-seguimiento-responsable.png" },
    { x: .5, y: .46, size: 180, title: "tutor", image: "/media/trainly/trainly-03-actividad-clase-narrada-tutor.png" },
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

export function CaseStudyDirectory() {
  const { paused } = useMotionPreference();
  const [active, setActive] = useState<ActivePreview | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<Partial<Record<CaseId, HTMLAnchorElement>>>({});
  const hoveredRef = useRef<CaseId | null>(null);
  const focusedRef = useRef<CaseId | null>(null);
  const pointRef = useRef<Point>({ x: 0, y: 0 });
  const followRef = useRef<((point: Point) => void) | null>(null);
  const exitRef = useRef<Animation[]>([]);
  const recoveryRef = useRef<Animation[]>([]);
  const entranceRef = useRef(0);
  const product = cases.find((item) => item.id === active?.id);

  const cancelExit = useCallback(() => {
    exitRef.current.forEach((animation) => animation.cancel());
    recoveryRef.current.forEach((animation) => animation.cancel());
    exitRef.current = [];
    recoveryRef.current = [];
  }, []);

  const dismiss = useCallback(() => {
    // Hide before canceling fills: React may remove the portal on the following frame.
    if (previewRef.current) previewRef.current.dataset.ready = "false";
    cancelExit();
    hoveredRef.current = null;
    focusedRef.current = null;
    setActive(null);
  }, [cancelExit]);

  function enter(event: PointerEvent<HTMLAnchorElement>, id: CaseId) {
    if (event.pointerType !== "mouse") return;
    const recovering = active?.id === id && exitRef.current.length > 0;
    const nodes = recovering ? Array.from(previewRef.current?.querySelectorAll<HTMLElement>(".case-preview__echo,.case-preview__window") ?? []) : [];
    const starts = nodes.map((node) => {
      const style = getComputedStyle(node);
      return { opacity: style.opacity, transform: style.transform };
    });
    if (!recovering && previewRef.current) previewRef.current.dataset.ready = "false";
    cancelExit();
    if (recovering) {
      const animations = nodes.map((node, index) => node.animate([
        starts[index], { opacity: 1, transform: "none" },
      ], { duration: 180, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }));
      recoveryRef.current = animations;
    }
    pointRef.current = { x: event.clientX, y: event.clientY };
    hoveredRef.current = id;
    setActive({ id, input: "mouse", entrance: recovering ? active.entrance : ++entranceRef.current });
  }

  const closeSoftly = useCallback(() => {
    if (exitRef.current.length) return;
    const preview = previewRef.current;
    if (!preview || paused) { dismiss(); return; }
    followRef.current = null;
    const windows = Array.from(preview.querySelectorAll<HTMLElement>(".case-preview__echo")).reverse();
    const main = preview.querySelector<HTMLElement>(".case-preview__window");
    if (main) windows.push(main);
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
  }, [paused, dismiss, cancelExit]);

  function leave() {
    hoveredRef.current = null;
    if (focusedRef.current) {
      cancelExit();
      setActive({ id: focusedRef.current, input: "keyboard" });
      return;
    }
    closeSoftly();
  }

  useEffect(() => () => cancelExit(), [cancelExit]);

  useEffect(() => {
    const preview = previewRef.current;
    const floating = floatingRef.current;
    const link = active ? linksRef.current[active.id] : null;
    if (!preview || !floating || !link || !active) return;
    if (paused && exitRef.current.length) {
      preview.dataset.ready = "false";
      exitRef.current.forEach((animation) => animation.finish());
      return;
    }
    if (paused) recoveryRef.current.forEach((animation) => animation.finish());
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

    function key(event: KeyboardEvent) { if (event.key === "Escape") dismiss(); }
    function resize() { dismiss(); }
    function visibility() { if (document.hidden) dismiss(); }
    function blur() {
      hoveredRef.current = null;
      focusedRef.current = null;
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
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", blur, true);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", blur);
      window.removeEventListener("pointerout", pointerOut);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [active, paused, dismiss, closeSoftly]);

  return (
    <>
      <nav className="pw-case-directory" aria-label="Case studies">
        {cases.map((item) => (
          <Link key={item.id} ref={(node) => { if (node) linksRef.current[item.id] = node; }}
            href={item.href} prefetch={true} data-case-preview={item.id}
            onPointerEnter={(event) => enter(event, item.id)}
            onPointerMove={(event) => {
              if (event.pointerType !== "mouse") return;
              pointRef.current = { x: event.clientX, y: event.clientY };
              followRef.current?.(pointRef.current);
            }}
            onPointerLeave={leave}
            onPointerDown={(event) => { if (event.pointerType !== "mouse") dismiss(); }}
            onFocus={(event) => {
              if (!event.currentTarget.matches(":focus-visible")) return;
              cancelExit();
              focusedRef.current = item.id;
              setActive({ id: item.id, input: "keyboard" });
            }}
            onBlur={() => {
              focusedRef.current = null;
              if (hoveredRef.current) {
                cancelExit();
                setActive({ id: hoveredRef.current, input: "mouse", entrance: active?.id === hoveredRef.current ? active.entrance : ++entranceRef.current });
              } else {
                closeSoftly();
              }
            }}
            onClick={dismiss}>
            <span>{item.number} / {item.name}</span><strong>{item.title}</strong>
            <small>{item.description}</small><b aria-hidden="true">↗</b>
          </Link>
        ))}
      </nav>
      {product && active ? createPortal(
        <div ref={previewRef} key={`${product.id}:${active.entrance ?? 0}`} className="case-preview" data-product={product.id} data-input={active.input} data-cascade={active.input === "mouse" && !paused} aria-hidden="true">
          <div className="case-preview__stage">
            {active.input === "mouse" && !paused ? cascadeLayouts[product.id].map((layer, index) => (
              <div key={layer.title} className="case-preview__echo" style={{
                "--echo-x": layer.x,
                "--echo-y": layer.y,
                "--echo-size": `${layer.size}px`,
                "--echo-delay": `${index * 30}ms`,
                zIndex: index,
              } as CSSProperties}>
                <div className="case-preview__bar"><span>{product.id} / {layer.title}</span><span className="case-preview__controls">– □ ×</span></div>
                <div className="case-preview__echo-body"><Image src={layer.image} alt="" loading="eager" width={384} height={240} /></div>
              </div>
            )) : null}
            <div ref={floatingRef} className="case-preview__follow">
              <div className="case-preview__window">
                <div className="case-preview__bar"><span>CASE_{product.number} / {product.name.toUpperCase()}</span><span className="case-preview__controls">– □ ×</span></div>
                <div className="case-preview__brand"><Image src={product.logo} alt="" width={product.logoWidth} height={product.logoHeight} unoptimized /><span>PRODUCT<br />PREVIEW ↗</span></div>
                <div className="case-preview__screen"><Image src={product.image} alt="" loading="eager" width={384} height={Math.round(384 * product.height / product.width)} /></div>
              </div>
            </div>
          </div>
        </div>, document.body,
      ) : null}
    </>
  );
}
