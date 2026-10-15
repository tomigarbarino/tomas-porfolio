"use client";

import { useEffect, useRef, type RefObject } from "react";
import "./move-controls.css";

export type MovePoint = { x: number; y: number };
export type MoveCommands = { move: (delta: MovePoint) => void; reset: () => void };

type Props = {
  id: string;
  label: string;
  trigger: RefObject<HTMLButtonElement | null>;
  onMove: (delta: MovePoint) => void;
  onReset: () => void;
};

/** Kept beside its trigger in the DOM so a modal dialog does not make it inert. */
export function MoveControls({ id, label, trigger, onMove, onReset }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = panel.current;
    const button = trigger.current;
    if (!current || !button) return;
    let raf = 0;
    let focusWasInside = false;

    function positionListeners(listen: boolean) {
      if (listen) {
        window.addEventListener("resize", schedule);
        window.addEventListener("scroll", schedule, { passive: true, capture: true });
        window.visualViewport?.addEventListener("resize", schedule);
        window.visualViewport?.addEventListener("scroll", schedule);
      } else {
        window.removeEventListener("resize", schedule);
        window.removeEventListener("scroll", schedule, true);
        window.visualViewport?.removeEventListener("resize", schedule);
        window.visualViewport?.removeEventListener("scroll", schedule);
      }
    }

    function place() {
      if (!current!.matches(":popover-open")) return;
      const rect = button!.getBoundingClientRect();
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0;
      const top = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? document.documentElement.clientWidth;
      const height = viewport?.height ?? window.innerHeight;
      const box = current!.getBoundingClientRect();
      const x = Math.max(left + 8, Math.min(rect.right - box.width, left + width - box.width - 8));
      const below = rect.bottom + 8;
      const y = Math.max(top + 8, Math.min(below + box.height <= top + height - 8 ? below : rect.top - box.height - 8, top + height - box.height - 8));
      current!.style.left = `${x}px`;
      current!.style.top = `${y}px`;
      current!.dataset.positioned = "true";
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; place(); });
    }

    function beforeToggle(event: Event) {
      if ((event as ToggleEvent).newState === "closed") {
        focusWasInside = current!.contains(document.activeElement);
      }
    }

    function toggle(event: Event) {
      const open = (event as ToggleEvent).newState === "open";
      button!.setAttribute("aria-expanded", String(open));
      positionListeners(open);
      if (open) {
        place();
        current!.querySelector<HTMLButtonElement>("[data-move-direction]")?.focus({ preventScroll: true });
      } else {
        current!.removeAttribute("data-positioned");
        // Preserve focus on an outside control when it was deliberately clicked.
        if (focusWasInside && (current!.contains(document.activeElement) || document.activeElement === document.body)) {
          button!.focus({ preventScroll: true });
        }
      }
    }

    current.addEventListener("beforetoggle", beforeToggle);
    current.addEventListener("toggle", toggle);
    return () => {
      cancelAnimationFrame(raf);
      current.removeEventListener("beforetoggle", beforeToggle);
      current.removeEventListener("toggle", toggle);
      positionListeners(false);
    };
  }, [trigger]);

  function close() {
    panel.current?.hidePopover();
    trigger.current?.focus({ preventScroll: true });
  }

  return (
    <div ref={panel} id={id} popover="auto" role="dialog" aria-label={`Position controls: ${label}`} className="move-controls" data-no-drag onClick={event => event.stopPropagation()} onKeyDown={event => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      close();
    }}>
      <div className="move-controls__heading">
        <span>Move object</span>
        <button type="button" aria-label="Close position controls" onClick={close}>×</button>
      </div>
      <div className="move-controls__pad" role="group" aria-label="Move in 40 pixel steps">
        <button type="button" className="move-controls__up" data-move-direction aria-label="Move up" onClick={() => onMove({ x: 0, y: -40 })}>↑</button>
        <button type="button" className="move-controls__left" data-move-direction aria-label="Move left" onClick={() => onMove({ x: -40, y: 0 })}>←</button>
        <button type="button" className="move-controls__reset" onClick={onReset}>Reset</button>
        <button type="button" className="move-controls__right" data-move-direction aria-label="Move right" onClick={() => onMove({ x: 40, y: 0 })}>→</button>
        <button type="button" className="move-controls__down" data-move-direction aria-label="Move down" onClick={() => onMove({ x: 0, y: 40 })}>↓</button>
      </div>
      <p>Click or tap. No dragging needed.</p>
    </div>
  );
}
