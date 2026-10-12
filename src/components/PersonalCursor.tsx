"use client";

import { useEffect, useRef } from "react";
import "./personal-cursor.css";

export function PersonalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let enabled = false;
    let selectingText = false;
    let altHeld = false;
    let point = { x: 0, y: 0 };
    let target: Element | null = null;

    function hide() {
      cursor!.dataset.visible = "false";
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function selectionMode(active: boolean) {
      if (active === selectingText) return;
      selectingText = active;
      if (active) document.documentElement.dataset.artifactSelecting = "true";
      else delete document.documentElement.dataset.artifactSelecting;
    }

    function selectionChanged() {
      selectionMode(altHeld || Boolean(window.getSelection()?.toString()));
      if (selectingText) hide();
      else if (enabled && target && !raf) raf = requestAnimationFrame(paint);
    }

    function blur() { altHeld = false; selectionChanged(); hide(); }

    function configure() {
      enabled = fine.matches && !reduced.matches;
      if (enabled) document.documentElement.dataset.personalCursor = "true";
      else {
        delete document.documentElement.dataset.personalCursor;
        hide();
      }
    }

    function paint() {
      raf = 0;
      const editing = target?.closest("input,textarea,select,[contenteditable='true']");
      const selecting = Boolean(window.getSelection()?.toString());
      const dragging = target?.closest("[data-artifact-dragging='true'],.is-dragging");
      if (editing || document.documentElement.dataset.artifactSelecting === "true" || (selecting && !dragging)) { hide(); return; }
      const action = target?.closest("a,button,summary,[role='button']");
      const surface = target?.closest("[data-drag-surface]");
      const draggableAction = action?.matches(".peel-sticker__reveal,[data-drag-enabled]");
      cursor!.dataset.mode = dragging ? "drag" : action && !draggableAction ? "action" : surface ? "surface" : "idle";
      cursor!.style.transform = `translate3d(${point.x}px,${point.y}px,0)`;
      cursor!.dataset.visible = "true";
    }

    function move(event: PointerEvent) {
      altHeld = event.altKey;
      selectionMode(altHeld || Boolean(window.getSelection()?.toString()));
      if (!enabled || event.pointerType !== "mouse") { hide(); return; }
      point = { x: event.clientX, y: event.clientY };
      target = event.target instanceof Element ? event.target : null;
      if (!raf) raf = requestAnimationFrame(paint);
    }

    function leave(event: PointerEvent) { if (!event.relatedTarget) hide(); }
    function key(event: KeyboardEvent) {
      if (event.key === "Alt") { altHeld = true; selectionMode(true); hide(); }
      if (event.key === "Tab") hide();
    }
    function keyUp(event: KeyboardEvent) { if (event.key === "Alt") { altHeld = false; selectionChanged(); } }
    function visibility() { if (document.hidden) blur(); }

    configure();
    fine.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
    document.addEventListener("pointermove", move, { passive: true, capture: true });
    document.addEventListener("pointerup", move, { passive: true, capture: true });
    document.addEventListener("pointerout", leave, { passive: true });
    document.addEventListener("keydown", key);
    document.addEventListener("keyup", keyUp);
    document.addEventListener("selectionchange", selectionChanged);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", blur);
    return () => {
      blur();
      delete document.documentElement.dataset.personalCursor;
      delete document.documentElement.dataset.artifactSelecting;
      fine.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", move, true);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("keydown", key);
      document.removeEventListener("keyup", keyUp);
      document.removeEventListener("selectionchange", selectionChanged);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", blur);
    };
  }, []);

  return <div ref={cursorRef} className="personal-cursor" data-visible="false" data-mode="idle" aria-hidden="true"><span /></div>;
}
