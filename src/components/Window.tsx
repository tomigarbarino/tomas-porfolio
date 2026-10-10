"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from "react";

type Point = { x: number; y: number };
type Props = {
  children: ReactNode;
  container: RefObject<HTMLDivElement | null>;
  minimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
};

export function Window({ children, container, minimized, onMinimize, onClose }: Props) {
  const node = useRef<HTMLElement>(null);
  const drag = useRef<{ pointer: number; start: Point; origin: Point; active: boolean; touch: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [position, setPosition] = useState<Point | null>(null);
  const [moving, setMoving] = useState(false);

  function clamp(point: Point) {
    const parent = container.current, current = node.current;
    if (!parent || !current) return point;
    return {
      x: Math.max(20, Math.min(point.x, parent.clientWidth - current.offsetWidth - 20)),
      y: Math.max(110, Math.min(point.y, parent.clientHeight - current.offsetHeight - 88)),
    };
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
    const handle = target?.closest<HTMLButtonElement>(".window-drag");
    if (!handle && (e.altKey || target?.closest("a,button,input,textarea,select,summary,[contenteditable]:not([contenteditable='false']),[role='button'],[role='link'],[role='slider'],[role='checkbox'],[role='radio'],[role='switch'],video[controls],audio[controls],iframe,[data-no-drag]"))) return;
    const origin = { x: node.current.offsetLeft, y: node.current.offsetTop };
    drag.current = { pointer: e.pointerId, start: { x: e.clientX, y: e.clientY }, origin, active: Boolean(handle), touch: e.pointerType === "touch" && !handle };
    if (handle) {
      e.preventDefault();
      node.current.setPointerCapture(e.pointerId);
      handle.focus({ preventScroll: true });
      setPosition(clamp(origin));
      setMoving(true);
    }
  }
  function move(e: PointerEvent<HTMLElement>) {
    const active = drag.current;
    if (!active || e.pointerId !== active.pointer) return;
    const dx = e.clientX - active.start.x, dy = e.clientY - active.start.y;
    if (!active.active) {
      if (Math.hypot(dx, dy) < 6) return;
      if (active.touch && Math.abs(dx) <= Math.abs(dy) * 1.2) { drag.current = null; return; }
      active.active = true;
      node.current?.setPointerCapture(e.pointerId);
      node.current?.querySelector<HTMLButtonElement>(".window-drag")?.focus({ preventScroll: true });
      setMoving(true);
    }
    e.preventDefault();
    suppressClick.current = true;
    setPosition(clamp({ x: active.origin.x + dx, y: active.origin.y + (active.touch ? 0 : dy) }));
  }
  function up(e: PointerEvent<HTMLElement>) {
    if (e.type === "lostpointercapture" && e.target !== node.current) return;
    const active = drag.current;
    if (!active || e.pointerId !== active.pointer) return;
    drag.current = null;
    setMoving(false);
    if (e.type === "pointercancel" && active.active) setPosition(clamp(active.origin));
    if (node.current?.hasPointerCapture(e.pointerId)) node.current.releasePointerCapture(e.pointerId);
  }
  function key(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Home") { e.preventDefault(); setPosition(null); return; }
    if (e.key === "Escape" && drag.current) {
      e.preventDefault();
      setPosition(clamp(drag.current.origin));
      if (node.current?.hasPointerCapture(drag.current.pointer)) node.current.releasePointerCapture(drag.current.pointer);
      drag.current = null; setMoving(false); return;
    }
    if (!e.key.startsWith("Arrow") || !node.current) return;
    e.preventDefault();
    const step = e.shiftKey ? 60 : 20;
    const point = position ?? { x: node.current.offsetLeft, y: node.current.offsetTop };
    setPosition(clamp({ x: point.x + (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0), y: point.y + (e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0) }));
  }

  return (
    <article ref={node} className={`project-window${position ? " has-position" : ""}${moving ? " is-dragging" : ""}`} data-drag-surface data-artifact-dragging={moving ? "true" : undefined} hidden={minimized} aria-label="Trainly project window" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onClickCapture={event => {
      if (suppressClick.current && event.detail > 0) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
    }} style={position ? { left: position.x, top: position.y, right: "auto" } : undefined}>
      <div className="window-titlebar">
        <button type="button" className="window-drag" aria-label="Move Trainly window" aria-describedby="window-move-help" onKeyDown={key}>
          <span>TRAINLY / PRODUCT CASE</span><span className="artifact-drag__grip" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Minimize Trainly window" onClick={onMinimize}>–</button>
        <button type="button" aria-label="Close Trainly window" onClick={onClose}>×</button>
      </div>
      <p id="window-move-help" className="sr-only">Drag any part of the window. Hold Alt to select text. Use arrow keys to move this window. Shift moves faster. Home resets its position.</p>
      <div className="window-content">{children}</div>
    </article>
  );
}
