"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "./MotionPreference";
import "./cursor-ink-trail.css";

const poolSize = 28;
const protectedContent = "a,button,input,select,textarea,label,summary,nav,header,footer,dialog,[contenteditable]:not([contenteditable='false']),[role='button'],[role='link'],[data-drag-frame],[data-drag-surface],article,figure,img,video,svg,canvas,iframe,p,h1,h2,h3,h4,h5,h6,dt,dd,li,table,pre,blockquote";
const halftone = [{ x: -5, y: -3, size: 3 }, { x: 3, y: 2, size: 2 }, { x: -3, y: 6, size: 1.5 }];

export function CursorInkTrail() {
  const trailRef = useRef<HTMLDivElement>(null);
  const { paused, reducedMotion } = useMotionPreference();

  useEffect(() => {
    const trail = trailRef.current;
    if (!trail) return;
    trail.dataset.enabled = "false";
    trail.dataset.activeCount = "0";
    if (paused || reducedMotion) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const dots = Array.from(trail.children) as HTMLElement[];
    const animations = new Map<HTMLElement, Animation>();
    const heldPointers = new Set<number>();
    const passiveCapture = { passive: true, capture: true };
    let nextDot = 0;
    let altHeld = false;
    let blockedUntil = 0;
    let lastMouse: { x: number; y: number } | null = null;
    let lastInk: { x: number; y: number; time: number } | null = null;

    function clear() {
      animations.forEach((animation, dot) => {
        animation.onfinish = null;
        animation.cancel();
        dot.dataset.active = "false";
      });
      animations.clear();
      trail!.dataset.activeCount = "0";
      lastInk = null;
    }

    function configure() {
      trail!.dataset.enabled = fine.matches ? "true" : "false";
      clear();
    }

    function emptyMargin(x: number, y: number, radius = 5) {
      const width = document.documentElement.clientWidth;
      const margin = Math.min(132, width * .12);
      if (x < radius || y < radius || x > width - radius || y > window.innerHeight - radius) return false;
      if (x > margin && x < width - margin) return false;
      // Sample the whole dot, not just its center, so ink stays clear of edges.
      return [[x, y], [x - radius, y], [x + radius, y], [x, y - radius], [x, y + radius]].every(([px, py]) => {
        const element = document.elementFromPoint(px, py);
        return element && !element.closest(protectedContent);
      });
    }

    function stamp(x: number, y: number) {
      halftone.forEach(({ x: offsetX, y: offsetY, size }) => {
        const px = x + offsetX;
        const py = y + offsetY;
        if (!emptyMargin(px, py)) return;
        const dot = dots[nextDot];
        nextDot = (nextDot + 1) % dots.length;
        const previous = animations.get(dot);
        if (previous) { previous.onfinish = null; previous.cancel(); }
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.dataset.active = "true";
        const animation = dot.animate([
          { opacity: .5, transform: `translate3d(${px}px,${py}px,0) scale(1)` },
          { opacity: .3, offset: .35, transform: `translate3d(${px}px,${py}px,0) scale(.95)` },
          { opacity: 0, transform: `translate3d(${px}px,${py}px,0) scale(.5)` },
        ], { duration: 680, easing: "cubic-bezier(.2,0,.4,1)" });
        animations.set(dot, animation);
        animation.onfinish = () => {
          if (animations.get(dot) !== animation) return;
          animations.delete(dot);
          dot.dataset.active = "false";
          trail!.dataset.activeCount = String(animations.size);
        };
      });
      trail!.dataset.activeCount = String(animations.size);
    }

    function move(event: PointerEvent) {
      const changed = !lastMouse || lastMouse.x !== event.clientX || lastMouse.y !== event.clientY;
      lastMouse = { x: event.clientX, y: event.clientY };
      altHeld = event.altKey;
      if (!fine.matches || event.pointerType !== "mouse" || event.buttons || heldPointers.size || altHeld || document.hidden || !document.hasFocus() || window.getSelection()?.toString() || document.documentElement.dataset.artifactSelecting === "true") { clear(); return; }
      if (!changed || performance.now() < blockedUntil) return;
      if (!emptyMargin(event.clientX, event.clientY)) { clear(); return; }
      const now = performance.now();
      if (lastInk && (now - lastInk.time < 48 || Math.hypot(event.clientX - lastInk.x, event.clientY - lastInk.y) < 14)) return;
      stamp(event.clientX, event.clientY);
      lastInk = { x: event.clientX, y: event.clientY, time: now };
    }

    function down(event: PointerEvent) { heldPointers.add(event.pointerId); clear(); }
    function release(event: PointerEvent) { heldPointers.delete(event.pointerId); clear(); }
    function scrollOrTouch() { blockedUntil = performance.now() + 180; clear(); }
    function keyboard(event: KeyboardEvent) { altHeld = event.altKey; clear(); }
    function selection() { if (window.getSelection()?.toString()) clear(); }
    function reset() { heldPointers.clear(); altHeld = false; clear(); }
    function outside(event: PointerEvent) { if (!event.relatedTarget) reset(); }

    configure();
    fine.addEventListener("change", configure);
    document.addEventListener("pointermove", move, passiveCapture);
    document.addEventListener("pointerdown", down, passiveCapture);
    document.addEventListener("pointerup", release, passiveCapture);
    document.addEventListener("pointercancel", release, passiveCapture);
    document.addEventListener("pointerout", outside, passiveCapture);
    document.addEventListener("keydown", keyboard, passiveCapture);
    document.addEventListener("keyup", keyboard, passiveCapture);
    document.addEventListener("focusin", clear, passiveCapture);
    document.addEventListener("selectionchange", selection, { passive: true });
    document.addEventListener("visibilitychange", reset, { passive: true });
    document.addEventListener("scroll", scrollOrTouch, passiveCapture);
    document.addEventListener("wheel", scrollOrTouch, passiveCapture);
    document.addEventListener("touchstart", scrollOrTouch, passiveCapture);
    document.addEventListener("touchmove", scrollOrTouch, passiveCapture);
    window.addEventListener("blur", reset, { passive: true });
    window.addEventListener("resize", scrollOrTouch, { passive: true });
    return () => {
      reset();
      trail.dataset.enabled = "false";
      fine.removeEventListener("change", configure);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointerup", release, true);
      document.removeEventListener("pointercancel", release, true);
      document.removeEventListener("pointerout", outside, true);
      document.removeEventListener("keydown", keyboard, true);
      document.removeEventListener("keyup", keyboard, true);
      document.removeEventListener("focusin", clear, true);
      document.removeEventListener("selectionchange", selection);
      document.removeEventListener("visibilitychange", reset);
      document.removeEventListener("scroll", scrollOrTouch, true);
      document.removeEventListener("wheel", scrollOrTouch, true);
      document.removeEventListener("touchstart", scrollOrTouch, true);
      document.removeEventListener("touchmove", scrollOrTouch, true);
      window.removeEventListener("blur", reset);
      window.removeEventListener("resize", scrollOrTouch);
    };
  }, [paused, reducedMotion]);

  return <div ref={trailRef} className="cursor-ink-trail" data-enabled="false" data-active-count="0" aria-hidden="true">{Array.from({ length: poolSize }, (_, index) => <span key={index} data-tone={index % 2 ? "lilac" : "pink"} data-active="false" />)}</div>;
}
