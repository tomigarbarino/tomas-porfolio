"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from "react";
import { MoveControls } from "./MoveControls";

type Point = { x: number; y: number };
type Props = {
  project?: string;
  children: ReactNode;
  container: RefObject<HTMLDivElement | null>;
  minimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
};

export function Window({ children, container, minimized, onMinimize, onClose, project = "Trainly" }: Props) {
  const node = useRef<HTMLElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const controlsId = useId();
  const helpId = useId();
  const keyboardStart = useRef<Point | null>(null);
  const drag = useRef<{ pointer: number; start: Point; origin: Point; active: boolean; touch: boolean; capture: HTMLElement } | null>(null);
  const suppressClick = useRef(false);
  const [position, setPosition] = useState<Point | null>(null);
  const [moving, setMoving] = useState(false);

  function clamp(point: Point) {
    const parent = container.current, current = node.current;
    if (!parent || !current) return point;
    const maxX = parent.clientWidth - current.offsetWidth - 20;
    const maxY = parent.clientHeight - current.offsetHeight - 88;
    const minX = Math.min(20, Math.max(0, maxX));
    const minY = Math.min(110, Math.max(0, maxY));
    return { x: Math.max(minX, Math.min(point.x, Math.max(minX, maxX))), y: Math.max(minY, Math.min(point.y, Math.max(minY, maxY))) };
  }

  useEffect(() => {
    const parent = container.current;
    if (!parent) return;
    const observer = new ResizeObserver(() => {
      if (node.current?.offsetWidth) setPosition(current => current ? clamp(current) : current);
    });
    observer.observe(parent);
    if (node.current) observer.observe(node.current);
    return () => observer.disconnect();
    // clamp reads current DOM dimensions; the observer owns resize updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container]);

  function down(e: PointerEvent<HTMLElement>) {
    if (!e.isPrimary || e.button !== 0 || !node.current) return;
    suppressClick.current = false;
    const target = e.target instanceof Element ? e.target : null;
    const grip = target?.closest<HTMLButtonElement>(".window-drag");
    if (!grip && (e.altKey || target?.closest("a,button,input,textarea,select,summary,[contenteditable]:not([contenteditable='false']),[role='button'],[role='link'],[role='slider'],[role='checkbox'],[role='radio'],[role='switch'],video[controls],audio[controls],iframe,[data-no-drag]"))) return;
    const origin = { x: node.current.offsetLeft, y: node.current.offsetTop };
    drag.current = { pointer: e.pointerId, start: { x: e.clientX, y: e.clientY }, origin, active: false, touch: e.pointerType === "touch" && !grip, capture: grip ?? node.current };
    // Capture on the button preserves a stationary click on the button. Actual
    // dragging transfers capture to the window after the movement threshold.
    grip?.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<HTMLElement>) {
    const active = drag.current;
    if (!active || e.pointerId !== active.pointer) return;
    const dx = e.clientX - active.start.x, dy = e.clientY - active.start.y;
    if (!active.active) {
      if (Math.hypot(dx, dy) < 6) return;
      if (active.touch && Math.abs(dx) <= Math.abs(dy) * 1.2) { drag.current = null; return; }
      active.active = true;
      active.capture = node.current!;
      keyboardStart.current = null;
      node.current?.setPointerCapture(e.pointerId);
      node.current?.querySelector<HTMLButtonElement>(".window-drag")?.focus({ preventScroll: true });
      setMoving(true);
    }
    e.preventDefault();
    suppressClick.current = true;
    setPosition(clamp({ x: active.origin.x + dx, y: active.origin.y + (active.touch ? 0 : dy) }));
  }
  function up(e: PointerEvent<HTMLElement>) {
    const active = drag.current;
    if (e.type === "lostpointercapture" && e.target !== active?.capture) return;
    if (!active || e.pointerId !== active.pointer) return;
    drag.current = null;
    setMoving(false);
    if (e.type === "pointercancel" && active.active) setPosition(clamp(active.origin));
    if (active.capture.hasPointerCapture(e.pointerId)) active.capture.releasePointerCapture(e.pointerId);
  }
  function key(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Home") { e.preventDefault(); e.stopPropagation(); keyboardStart.current ??= position ?? { x: node.current?.offsetLeft ?? 0, y: node.current?.offsetTop ?? 0 }; setPosition(null); return; }
    if (e.key === "Escape" && drag.current) {
      e.preventDefault();
      e.stopPropagation();
      setPosition(clamp(drag.current.origin));
      if (drag.current.capture.hasPointerCapture(drag.current.pointer)) drag.current.capture.releasePointerCapture(drag.current.pointer);
      drag.current = null; setMoving(false); return;
    }
    if (e.key === "Escape" && keyboardStart.current) { e.preventDefault(); e.stopPropagation(); setPosition(clamp(keyboardStart.current)); keyboardStart.current = null; return; }
    if (!e.key.startsWith("Arrow") || !node.current) return;
    e.preventDefault();
    e.stopPropagation();
    const step = e.shiftKey ? 60 : 20;
    const point = position ?? { x: node.current.offsetLeft, y: node.current.offsetTop };
    keyboardStart.current ??= point;
    setPosition(clamp({ x: point.x + (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0), y: point.y + (e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0) }));
  }

  return (
    <article ref={node} className={`project-window${position ? " has-position" : ""}${moving ? " is-dragging" : ""}`} data-drag-surface data-artifact-dragging={moving ? "true" : undefined} hidden={minimized} aria-label={`${project} project window`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onClickCapture={event => {
      if (suppressClick.current && event.detail > 0) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
    }} style={position ? { left: position.x, top: position.y, right: "auto" } : undefined}>
      <div className="window-titlebar">
        <button ref={handle} type="button" className="window-drag" aria-label={`${project} / Product case — move window`} aria-describedby={helpId} aria-haspopup="dialog" aria-controls={controlsId} aria-expanded="false" popoverTarget={controlsId} onKeyDown={key} onBlur={() => { keyboardStart.current = null; }}>
          <span>{project.toUpperCase()} / PRODUCT CASE</span>
        </button>
        <button type="button" aria-label={`Minimize ${project} window`} onClick={onMinimize}>–</button>
        <button type="button" aria-label={`Close ${project} window`} onClick={onClose}>×</button>
      </div>
      <p id={helpId} className="sr-only">Press for click or tap position controls, or drag any part of the window. Hold Alt to select text. Use arrow keys to move this window. Shift moves faster. Home resets its position. Escape restores the position at the start of a keyboard move.</p>
      <MoveControls id={controlsId} label={`${project} window`} trigger={handle} onMove={delta => {
        keyboardStart.current = null;
        setPosition(current => {
          const point = current ?? { x: node.current?.offsetLeft ?? 0, y: node.current?.offsetTop ?? 0 };
          return clamp({ x: point.x + delta.x, y: point.y + delta.y });
        });
      }} onReset={() => { keyboardStart.current = null; setPosition(null); }} />
      <div className="window-content">{children}</div>
    </article>
  );
}
