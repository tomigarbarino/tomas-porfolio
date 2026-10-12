"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { useMotionPreference } from "./MotionPreference";
import "./case-study-directory.css";

const cases = [
  {
    id: "agora", number: "01", name: "Agora", href: "/en/agora",
    title: "Missing context. Human judgment.",
    description: "Read the product decision and its scoped check",
    logo: "/media/agora-logo.svg", logoWidth: 126, logoHeight: 37,
    image: "/media/agora-interview-ready.png", width: 1440, height: 900,
    caption: "Interview readiness / Figma design",
  },
  {
    id: "trainly", number: "02", name: "Trainly", href: "/en/trainly",
    title: "From company knowledge to understanding.",
    description: "Explore the learning experience and implementation",
    logo: "/media/trainly/trainly-logo.svg", logoWidth: 148, logoHeight: 36,
    image: "/media/trainly/campus-ai.png", width: 1350, height: 652,
    caption: "AI campus / Published demo",
  },
] as const;

type CaseId = typeof cases[number]["id"];
type ActivePreview = { id: CaseId; input: "mouse" | "keyboard" };
type Point = { x: number; y: number };

export function CaseStudyDirectory() {
  const { paused } = useMotionPreference();
  const [active, setActive] = useState<ActivePreview | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<Partial<Record<CaseId, HTMLAnchorElement>>>({});
  const hoveredRef = useRef<CaseId | null>(null);
  const focusedRef = useRef<CaseId | null>(null);
  const pointRef = useRef<Point>({ x: 0, y: 0 });
  const followRef = useRef<((point: Point) => void) | null>(null);
  const product = cases.find((item) => item.id === active?.id);

  function dismiss() {
    hoveredRef.current = null;
    focusedRef.current = null;
    setActive(null);
  }

  function enter(event: PointerEvent<HTMLAnchorElement>, id: CaseId) {
    if (event.pointerType !== "mouse") return;
    pointRef.current = { x: event.clientX, y: event.clientY };
    hoveredRef.current = id;
    setActive({ id, input: "mouse" });
  }

  useEffect(() => {
    const preview = previewRef.current;
    const link = active ? linksRef.current[active.id] : null;
    if (!preview || !link || !active) return;
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
        preview!.style.setProperty("--preview-room", `${Math.max(0, room - 154)}px`);
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
  }, [active, paused]);

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
            onPointerLeave={() => {
              hoveredRef.current = null;
              setActive(focusedRef.current ? { id: focusedRef.current, input: "keyboard" } : null);
            }}
            onPointerDown={(event) => { if (event.pointerType !== "mouse") dismiss(); }}
            onFocus={(event) => {
              if (!event.currentTarget.matches(":focus-visible")) return;
              focusedRef.current = item.id;
              setActive({ id: item.id, input: "keyboard" });
            }}
            onBlur={() => {
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
        <div ref={previewRef} key={product.id} className="case-preview" data-product={product.id} data-input={active.input} aria-hidden="true">
          <div className="case-preview__window">
            <div className="case-preview__bar"><span>CASE_{product.number} / {product.name.toUpperCase()}</span><span className="case-preview__dots">● ● ●</span></div>
            <div className="case-preview__brand"><Image src={product.logo} alt="" width={product.logoWidth} height={product.logoHeight} unoptimized /><span>PRODUCT<br />PREVIEW ↗</span></div>
            <div className="case-preview__screen"><Image src={product.image} alt="" loading="eager" width={384} height={Math.round(384 * product.height / product.width)} /></div>
            <div className="case-preview__caption"><span>{product.caption}</span><span>↗</span></div>
          </div>
        </div>, document.body,
      ) : null}
    </>
  );
}
