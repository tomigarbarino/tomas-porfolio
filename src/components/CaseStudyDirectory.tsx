"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { useMotionPreference } from "./MotionPreference";
import "./case-study-directory.css";

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
type ActivePreview = { id: CaseId; input: "mouse" | "keyboard" };
type Point = { x: number; y: number };
const cascadeLayers = [5, 4, 3, 2, 1] as const;

export function CaseStudyDirectory() {
  const { paused } = useMotionPreference();
  const [active, setActive] = useState<ActivePreview | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<Partial<Record<CaseId, HTMLAnchorElement>>>({});
  const hoveredRef = useRef<CaseId | null>(null);
  const focusedRef = useRef<CaseId | null>(null);
  const pointRef = useRef<Point>({ x: 0, y: 0 });
  const followRef = useRef<((point: Point) => void) | null>(null);
  const exitRef = useRef<Animation | null>(null);
  const product = cases.find((item) => item.id === active?.id);

  const cancelExit = useCallback(() => {
    exitRef.current?.cancel();
    exitRef.current = null;
  }, []);

  const dismiss = useCallback(() => {
    cancelExit();
    hoveredRef.current = null;
    focusedRef.current = null;
    setActive(null);
  }, [cancelExit]);

  function enter(event: PointerEvent<HTMLAnchorElement>, id: CaseId) {
    if (event.pointerType !== "mouse") return;
    cancelExit();
    pointRef.current = { x: event.clientX, y: event.clientY };
    hoveredRef.current = id;
    setActive({ id, input: "mouse" });
  }

  function leave() {
    hoveredRef.current = null;
    if (focusedRef.current) {
      cancelExit();
      setActive({ id: focusedRef.current, input: "keyboard" });
      return;
    }
    const stack = previewRef.current?.firstElementChild;
    if (!stack || paused) { dismiss(); return; }
    cancelExit();
    const animation = stack.animate([
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(.97) translateY(4px)" },
    ], { duration: 140, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" });
    exitRef.current = animation;
    animation.onfinish = () => {
      if (exitRef.current === animation) dismiss();
    };
  }

  useEffect(() => () => cancelExit(), [cancelExit]);

  useEffect(() => {
    const preview = previewRef.current;
    const link = active ? linksRef.current[active.id] : null;
    if (!preview || !link || !active) return;
    if (paused && exitRef.current) {
      preview.dataset.ready = "false";
      exitRef.current.finish();
      return;
    }
    preview.style.removeProperty("--preview-room");
    let frame = 0;
    let lastTime = 0;
    let position = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    const width = preview.offsetWidth;
    let height = preview.offsetHeight;
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
        preview!.style.setProperty("--preview-room", `${Math.max(0, room - 112)}px`);
        height = preview!.offsetHeight;
        hasRoom = height <= room;
      }
      return place({ x: rect.right - width - 28, y: below >= above ? rect.bottom - 8 : rect.top - height - 40 });
    }

    function paint() {
      preview!.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
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
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", dismiss, { passive: true, capture: true });
    window.addEventListener("resize", resize);
    window.addEventListener("blur", dismiss);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      followRef.current = null;
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", dismiss);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [active, paused, dismiss]);

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
              cancelExit();
              focusedRef.current = null;
              setActive(hoveredRef.current ? { id: hoveredRef.current, input: "mouse" } : null);
            }}
            onClick={dismiss}>
            <span>{item.number} / {item.name}</span><strong>{item.title}</strong>
            <small>{item.description}</small><b aria-hidden="true">↗</b>
          </Link>
        ))}
      </nav>
      {product && active ? createPortal(
        <div ref={previewRef} key={product.id} className="case-preview" data-product={product.id} data-input={active.input} data-cascade={active.input === "mouse" && !paused} aria-hidden="true">
          <div className="case-preview__stack">
            {active.input === "mouse" && !paused ? cascadeLayers.map((depth, index) => (
              <div key={depth} className="case-preview__echo" style={{
                "--echo-offset": `${-depth * 7}px`,
                "--echo-delay": `${index * 24}ms`,
                zIndex: index,
              } as CSSProperties}>
                <div className="case-preview__bar"><span>{product.id}.exe / 0{index + 1}</span><span className="case-preview__controls">– □ ×</span></div>
                <div className="case-preview__echo-body" />
              </div>
            )) : null}
            <div className="case-preview__window">
              <div className="case-preview__bar"><span>CASE_{product.number} / {product.name.toUpperCase()}</span><span className="case-preview__controls">– □ ×</span></div>
              <div className="case-preview__brand"><Image src={product.logo} alt="" width={product.logoWidth} height={product.logoHeight} unoptimized /><span>PRODUCT<br />PREVIEW ↗</span></div>
              <div className="case-preview__screen"><Image src={product.image} alt="" loading="eager" width={384} height={Math.round(384 * product.height / product.width)} /></div>
            </div>
          </div>
        </div>, document.body,
      ) : null}
    </>
  );
}
