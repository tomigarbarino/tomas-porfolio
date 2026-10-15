"use client";

import { useEffect, useId, useRef } from "react";
import { MoveControls, type MoveCommands, type MoveTarget } from "./MoveControls";
import "./artifact-drag.css";

type Position = { x: number; y: number };
type Gesture = {
  pointerId: number;
  pointerType: string;
  clientX: number;
  clientY: number;
  start: Position;
  fromGrip: boolean;
  dragging: boolean;
  capture: HTMLElement;
};

const functionalControl = "a[href], button, input, select, textarea, summary, [contenteditable]:not([contenteditable='false']), [role='button'], [role='link'], [role='slider'], [role='checkbox'], [role='radio'], [role='switch'], video[controls], audio[controls], iframe, .window-drag, [data-no-drag]";

export function ArtifactDrag({ label, className = "", menuId, relatedTargets }: { label: string; className?: string; menuId?: string; relatedTargets?: readonly MoveTarget[] }) {
  const handleRef = useRef<HTMLButtonElement>(null);
  const commandsRef = useRef<MoveCommands | null>(null);
  const instructionsId = useId();
  const generatedControlsId = useId();
  const controlsId = menuId ?? generatedControlsId;

  useEffect(() => {
    const handle = handleRef.current;
    const frame = handle?.closest<HTMLElement>("[data-drag-frame]");
    if (!handle || !frame) return;

    // Native dialogs live in the top layer, outside their ancestors' visual bounds.
    // A frame may also bound its children; its own movement uses the parent boundary.
    const boundary = frame.tagName === "DIALOG" ? null : frame.parentElement?.closest<HTMLElement>("[data-drag-boundary]") ?? null;
    const initialStyle = getComputedStyle(frame);
    let position: Position = {
      x: parseFloat(initialStyle.getPropertyValue("--artifact-x")) || 0,
      y: parseFloat(initialStyle.getPropertyValue("--artifact-y")) || 0,
    };
    let applied = { ...position };
    let gesture: Gesture | null = null;
    let keyboardStart: Position | null = null;
    let raf = 0;
    let needsClamp = false;
    let suppressClickUntil = 0;
    let holdTimer = 0;
    frame.setAttribute("data-drag-surface", "true");

    function textAtPoint(x: number, y: number) {
      const caret = document.caretPositionFromPoint?.(x, y);
      const fallback = !caret ? document.caretRangeFromPoint?.(x, y) : null;
      const node = caret?.offsetNode ?? fallback?.startContainer;
      const offset = caret?.offset ?? fallback?.startOffset ?? 0;
      if (node?.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) return false;
      const element = node.parentElement;
      if (!element || element.closest("[data-drag-frame]") !== frame || getComputedStyle(element).userSelect === "none") return false;
      // Caret APIs can return the nearest text even when the press is in padding.
      // Only reserve the native gesture when it actually starts on a glyph.
      const range = document.createRange();
      range.setStart(node, Math.max(0, offset - 1));
      range.setEnd(node, Math.min(node.textContent.length, offset + 1));
      return Array.from(range.getClientRects()).some(rect => x >= rect.left - 3 && x <= rect.right + 3 && y >= rect.top && y <= rect.bottom);
    }

    function selectionAtPoint(x: number, y: number) {
      const selection = window.getSelection();
      if (!selection?.rangeCount || selection.isCollapsed) return false;
      return Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index)).some(range =>
        Array.from(range.getClientRects()).some(rect => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)
      );
    }

    function bounds() {
      if (boundary) return boundary.getBoundingClientRect();
      return { left: 0, top: 0, right: document.documentElement.clientWidth, bottom: window.innerHeight };
    }

    function clamp(next: Position): Position {
      // A hidden chapter/dialog has no layout box. Clamping its zero rectangle
      // would turn the boundary's page coordinates into a persistent offset.
      if (!frame!.getClientRects().length || !frame!.offsetWidth || !frame!.offsetHeight) return next;
      const area = bounds();
      const rect = frame!.getBoundingClientRect();
      const grip = handle!.getBoundingClientRect();
      // An oversized artwork cannot fit in full: keep its handle reachable instead.
      const horizontal = rect.width <= area.right - area.left ? rect : grip;
      const vertical = rect.height <= area.bottom - area.top ? rect : grip;
      const minX = applied.x + area.left - horizontal.left;
      const maxX = applied.x + area.right - horizontal.right;
      const minY = applied.y + area.top - vertical.top;
      const maxY = applied.y + area.bottom - vertical.bottom;
      return {
        x: Math.max(minX, Math.min(maxX, next.x)),
        y: Math.max(minY, Math.min(maxY, next.y)),
      };
    }

    function schedule(next: Position, constrain = true) {
      position = next;
      needsClamp = constrain;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (needsClamp) position = clamp(position);
        frame!.style.setProperty("--artifact-x", `${position.x}px`);
        frame!.style.setProperty("--artifact-y", `${position.y}px`);
        applied = { ...position };
        frame!.dispatchEvent(new CustomEvent("tg-artifact-move", { bubbles: true, detail: { ...applied } }));
      });
    }

    commandsRef.current = {
      move(delta) {
        keyboardStart = null;
        schedule({ x: position.x + delta.x, y: position.y + delta.y });
      },
      reset() { keyboardStart = null; schedule({ x: 0, y: 0 }); },
    };

    function release(cancel: boolean) {
      if (!gesture) return;
      const previous = gesture;
      gesture = null;
      window.clearTimeout(holdTimer);
      holdTimer = 0;
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerCancel);
      window.removeEventListener("keydown", gestureKeyDown, true);
      window.removeEventListener("blur", cancelGesture);
      document.removeEventListener("selectionchange", nativeSelection);
      frame!.removeAttribute("data-artifact-dragging");
      handle!.removeAttribute("data-dragging");
      if (previous.dragging) {
        suppressClickUntil = Date.now() + 500;
        if (cancel) schedule(previous.start);
      }
      if (previous.capture.hasPointerCapture(previous.pointerId)) previous.capture.releasePointerCapture(previous.pointerId);
    }

    function activate(event: PointerEvent) {
      if (!gesture) return;
      event.preventDefault();
      event.stopPropagation();
      gesture.dragging = true;
      window.clearTimeout(holdTimer);
      holdTimer = 0;
      keyboardStart = null;
      const selection = window.getSelection();
      if (selection?.anchorNode && frame!.contains(selection.anchorNode)) selection.removeAllRanges();
      handle!.focus({ preventScroll: true });
      frame!.setAttribute("data-artifact-dragging", "true");
      handle!.setAttribute("data-dragging", "true");
      gesture.capture.setPointerCapture(gesture.pointerId);
    }

    function pointerDown(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0 || gesture) return;
      // A fresh press is never the synthetic click left by a previous drag.
      suppressClickUntil = 0;
      const target = event.target instanceof Element ? event.target : null;
      if (!target || target.closest("[data-drag-frame]") !== frame) return;
      const fromGrip = handle!.contains(target);
      if (!fromGrip && (event.altKey || selectionAtPoint(event.clientX, event.clientY))) return;
      const stickerFace = frame!.classList.contains("peel-sticker") && target.closest(".peel-sticker__reveal");
      const control = target.closest(functionalControl);
      const enabledControl = control?.hasAttribute("data-drag-enabled");
      if (!fromGrip && !stickerFace && control && !enabledControl) return;
      // A dialog backdrop targets the dialog, but must remain a dismiss action.
      if (frame!.tagName === "DIALOG" && target === frame) {
        const rect = frame!.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      }
      gesture = {
        pointerId: event.pointerId, pointerType: event.pointerType,
        clientX: event.clientX, clientY: event.clientY, start: { ...position },
        fromGrip, dragging: false, capture: fromGrip ? handle! : frame!,
      };
      // Until intent is clear, leave clicks, focus and native vertical scrolling alone.
      window.addEventListener("pointermove", pointerMove, { passive: false });
      window.addEventListener("pointerup", pointerUp);
      window.addEventListener("pointercancel", pointerCancel);
      window.addEventListener("keydown", gestureKeyDown, true);
      window.addEventListener("blur", cancelGesture);
      document.addEventListener("selectionchange", nativeSelection);
      if (event.pointerType === "touch" && !fromGrip && textAtPoint(event.clientX, event.clientY)) {
        // Yield before the browser's long press. Do not synthesize a range or
        // prevent its callout; native selection handles must keep their gesture.
        holdTimer = window.setTimeout(() => release(false), 400);
      }
      // The grip's touch-action keeps touch dragging available. A stationary
      // press must still produce a normal click to open position controls.
    }

    function mouseDown(event: MouseEvent) {
      // PointerEvent.detail does not carry the browser's multi-click count.
      // mousedown arrives before its default word/paragraph selection begins.
      if (event.detail > 1 && gesture && !gesture.fromGrip && textAtPoint(event.clientX, event.clientY)) release(false);
    }

    function nativeSelection() {
      if (!gesture || gesture.dragging || gesture.pointerType !== "touch") return;
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.anchorNode && frame!.contains(selection.anchorNode)) release(false);
    }

    function nativeContextMenu() {
      if (gesture && !gesture.dragging) release(false);
    }

    function pointerMove(event: PointerEvent) {
      if (!gesture || event.pointerId !== gesture.pointerId) return;
      const dx = event.clientX - gesture.clientX;
      const dy = event.clientY - gesture.clientY;
      const horizontalTouch = gesture.pointerType === "touch" && !gesture.fromGrip;
      if (!gesture.dragging) {
        if (Math.hypot(dx, dy) < 6) return;
        if (horizontalTouch) {
          if (Math.abs(dy) >= Math.abs(dx)) { release(false); return; }
          if (Math.abs(dx) < 6 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
        }
        activate(event);
      }
      event.preventDefault();
      event.stopPropagation();
      schedule({ x: gesture.start.x + dx, y: gesture.start.y + (horizontalTouch ? 0 : dy) });
    }

    function pointerUp(event: PointerEvent) {
      if (!gesture || event.pointerId !== gesture.pointerId) return;
      if (gesture.dragging) { event.preventDefault(); event.stopPropagation(); }
      release(false);
    }

    function pointerCancel(event: PointerEvent) {
      // Touch starts with implicit capture on the pressed descendant. Ignore its
      // bubbled loss when capture transfers to the frame after drag intent.
      if (event.type === "lostpointercapture" && event.target !== gesture?.capture) return;
      if (gesture?.pointerId === event.pointerId) release(true);
    }

    function gestureKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !gesture) return;
      if (gesture.dragging) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      release(true);
      keyboardStart = null;
    }

    function cancelGesture() { release(true); }

    function surfaceClick(event: MouseEvent) {
      if (!event.detail || Date.now() >= suppressClickUntil) return;
      suppressClickUntil = 0;
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    function nativeDrag(event: DragEvent) {
      const target = event.target instanceof Element ? event.target : null;
      if (target && target.closest("[data-drag-frame]") === frame && target.closest("img")) event.preventDefault();
    }

    function keyDown(event: KeyboardEvent) {
      const steps: Record<string, Position> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
      const step = steps[event.key];
      if (step) {
        event.preventDefault();
        event.stopPropagation();
        keyboardStart ??= { ...position };
        const distance = event.shiftKey ? 40 : 10;
        schedule({ x: position.x + step.x * distance, y: position.y + step.y * distance });
      } else if (event.key === "Home") {
        event.preventDefault();
        event.stopPropagation();
        keyboardStart ??= { ...position };
        schedule({ x: 0, y: 0 });
      } else if (event.key === "Escape" && (gesture || keyboardStart)) {
        event.preventDefault();
        event.stopPropagation();
        if (gesture) release(true);
        else if (keyboardStart) schedule(keyboardStart);
        keyboardStart = null;
      }
    }

    function blur() { keyboardStart = null; }
    function click(event: MouseEvent) { event.stopPropagation(); }
    function resize() {
      if (!frame!.getClientRects().length || !frame!.offsetWidth || !frame!.offsetHeight) return;
      schedule({ ...position });
    }
    frame.addEventListener("pointerdown", pointerDown);
    frame.addEventListener("mousedown", mouseDown);
    frame.addEventListener("contextmenu", nativeContextMenu);
    frame.addEventListener("lostpointercapture", pointerCancel);
    frame.addEventListener("click", surfaceClick, true);
    frame.addEventListener("dragstart", nativeDrag);
    handle.addEventListener("keydown", keyDown);
    handle.addEventListener("blur", blur);
    handle.addEventListener("click", click);
    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    if (boundary) observer.observe(boundary);

    return () => {
      release(false);
      commandsRef.current = null;
      if (raf) cancelAnimationFrame(raf);
      frame.removeAttribute("data-drag-surface");
      observer.disconnect();
      window.removeEventListener("resize", resize);
      frame.removeEventListener("pointerdown", pointerDown);
      frame.removeEventListener("mousedown", mouseDown);
      frame.removeEventListener("contextmenu", nativeContextMenu);
      frame.removeEventListener("lostpointercapture", pointerCancel);
      frame.removeEventListener("click", surfaceClick, true);
      frame.removeEventListener("dragstart", nativeDrag);
      handle.removeEventListener("keydown", keyDown);
      handle.removeEventListener("blur", blur);
      handle.removeEventListener("click", click);
    };
  }, []);

  return (
    <>
      <button ref={handleRef} type="button" className={`artifact-drag ${className}`.trim()} aria-label={label} aria-describedby={instructionsId} aria-haspopup="dialog" aria-controls={controlsId} aria-expanded="false" popoverTarget={controlsId}>
        <span className="artifact-drag__label" aria-hidden="true">Move</span>
      </button>
      <span id={instructionsId} className="artifact-drag__instructions">Press for click or tap position controls, or drag to move. Double click then drag text to select, or hold Alt. On touch, hold text to select. Arrow keys move ten pixels; hold Shift for forty. Home resets. Escape restores the position at the start of this move.</span>
      <MoveControls id={controlsId} label={label} trigger={handleRef} relatedTargets={relatedTargets} onMove={delta => commandsRef.current?.move(delta)} onReset={() => commandsRef.current?.reset()} />
    </>
  );
}

export default ArtifactDrag;
