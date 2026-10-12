"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArtifactDrag } from "./ArtifactDrag";
import { useMotionPreference } from "./MotionPreference";
import "./hogarth-apple-sticker.css";

/** A personal career annotation, rather than an Apple project artefact. */
export function HogarthAppleSticker({ className = "" }: { className?: string }) {
  const id = useId();
  const { paused } = useMotionPreference();
  const stickerRef = useRef<HTMLElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const touchFocus = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [disclosure, setDisclosure] = useState<"preview" | "pinned" | "dismissed">("preview");
  const open = disclosure === "pinned" || (disclosure === "preview" && (hovered || focused));

  useEffect(() => {
    const sticker = stickerRef.current;
    const note = noteRef.current;
    if (!open || !sticker || !note) return;
    let frame = 0;
    function fitNote() {
      frame = 0;
      const box = sticker!.getBoundingClientRect();
      const width = note!.offsetWidth;
      const height = note!.offsetHeight;
      // The decal's drag offset stays exclusively owned by ArtifactDrag.
      // Only the disclosure shifts if its natural position would leave the viewport.
      const left = box.right - width;
      const top = box.top - 10 - height;
      const fittedLeft = Math.max(16, Math.min(document.documentElement.clientWidth - width - 16, left));
      const fittedTop = Math.max(16, Math.min(window.innerHeight - height - 16, top));
      note!.style.setProperty("--apple-note-x", `${fittedLeft - left}px`);
      note!.style.setProperty("--apple-note-y", `${fittedTop - top}px`);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(fitNote); }
    const resize = new ResizeObserver(schedule);
    resize.observe(note);
    sticker.addEventListener("tg-artifact-move", schedule);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    fitNote();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resize.disconnect();
      sticker.removeEventListener("tg-artifact-move", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
    };
  }, [open]);

  function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
    // ArtifactDrag owns Escape while a move is in progress.
    if (event.key !== "Escape" || event.defaultPrevented || !open) return;
    setDisclosure("dismissed");
    event.preventDefault();
    event.stopPropagation();
  }

  return <aside
    ref={stickerRef}
    className={`hogarth-apple-sticker ${className}`.trim()}
    data-drag-frame
    data-open={open}
    data-pinned={disclosure === "pinned"}
    data-motion={!paused}
    aria-label="Apple projects, through Hogarth"
    onKeyDown={closeOnEscape}
    onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
    onPointerLeave={() => {
      setHovered(false);
      if (!focused && disclosure === "dismissed") setDisclosure("preview");
    }}
  >
    <button
      type="button"
      className="hogarth-apple-sticker__reveal"
      data-drag-enabled
      aria-label="Read about my Apple-related work at Hogarth"
      aria-expanded={open}
      aria-controls={`${id}-note`}
      aria-describedby={`${id}-hint`}
      onPointerDown={event => { touchFocus.current = event.pointerType === "touch"; }}
      onPointerCancel={() => { touchFocus.current = false; setHovered(false); }}
      onFocus={() => setFocused(!touchFocus.current)}
      onBlur={() => {
        touchFocus.current = false;
        setFocused(false);
        if (!hovered && disclosure === "dismissed") setDisclosure("preview");
      }}
      onClick={() => setDisclosure(disclosure === "pinned" ? "dismissed" : "pinned")}
    >
      <span className="hogarth-apple-sticker__backing" aria-hidden="true" />
      <span className="hogarth-apple-sticker__face" aria-hidden="true">
        <Image src="/media/stickers/apple-frontend.svg" alt="" width={160} height={160} sizes="120px" draggable={false} />
      </span>
      <span className="hogarth-apple-sticker__curl" aria-hidden="true" />
    </button>
    <div ref={noteRef} id={`${id}-note`} className="hogarth-apple-sticker__note" role="region" aria-label="My Hogarth contribution" aria-hidden={!open} inert={!open}>
      <p><strong>Frontend / via Hogarth</strong>I worked on frontend engineering for Apple-related projects at Hogarth Worldwide.</p>
    </div>
    <ArtifactDrag label="Move the Apple career sticker" className="hogarth-apple-sticker__move" />
    <span id={`${id}-hint`} className="hogarth-apple-sticker__hint">Hover or focus to preview. Press to keep the note open, press again to close. Escape closes it. The whole sticker can be dragged.</span>
  </aside>;
}

export default HogarthAppleSticker;
