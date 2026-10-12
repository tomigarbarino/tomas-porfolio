"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArtifactDrag } from "./ArtifactDrag";
import { useMotionPreference } from "./MotionPreference";
import "./hogarth-apple-sticker.css";

/** A personal career annotation, rather than an Apple project artefact. */
export function HogarthAppleSticker({ className = "" }: { className?: string }) {
  const id = useId();
  const { paused } = useMotionPreference();
  const touchFocus = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [disclosure, setDisclosure] = useState<"preview" | "pinned" | "dismissed">("preview");
  const open = disclosure === "pinned" || (disclosure === "preview" && (hovered || focused));

  function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
    // ArtifactDrag owns Escape while a move is in progress.
    if (event.key !== "Escape" || event.defaultPrevented || !open) return;
    setDisclosure("dismissed");
    event.preventDefault();
    event.stopPropagation();
  }

  return <aside
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
      aria-label="Peel the Apple sticker"
      aria-pressed={disclosure === "pinned"}
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
        <Image src="/media/stickers/apple-frontend.svg" alt="" width={160} height={160} sizes="88px" draggable={false} />
      </span>
      <span className="hogarth-apple-sticker__curl" aria-hidden="true" />
    </button>
    <ArtifactDrag label="Move the Apple career sticker" className="hogarth-apple-sticker__move" />
    <span id={`${id}-hint`} className="hogarth-apple-sticker__hint">Hover or focus to peel. Press to pin; Escape releases. Drag anywhere to move.</span>
  </aside>;
}

export default HogarthAppleSticker;
