"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import ArtifactDrag from "./ArtifactDrag";
import { useMotionPreference } from "./MotionPreference";
import "./peel-sticker.css";

const subscribeHydration = () => () => {};
const clientHydration = () => true;
const serverHydration = () => false;

const stickerArt = {
  human: "/media/stickers/dev-human.png",
  duck: "/media/stickers/dev-duck.png",
  depends: "/media/stickers/dev-depends.png",
  commit: "/media/stickers/dev-commit.png",
} as const;

type PeelStickerProps = {
  art: keyof typeof stickerArt;
  title: string;
  fact: string;
  tone?: "pink" | "lime" | "violet" | "cream";
  className?: string;
};

export function PeelSticker({ art, title, fact, tone = "pink", className = "" }: PeelStickerProps) {
  const id = useId();
  const stickerRef = useRef<HTMLElement>(null);
  const revealed = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { paused } = useMotionPreference();
  // The motion store serves paused during SSR; wait for client preferences before arming.
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydration, serverHydration);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const touchFocus = useRef(false);
  const [disclosure, setDisclosure] = useState<"preview" | "pinned" | "dismissed">("preview");
  const open = disclosure === "pinned" || (disclosure === "preview" && (hovered || focused));

  useEffect(() => {
    if (!hydrated || revealed.current) return;
    const sticker = stickerRef.current;
    if (!sticker) return;
    let observer: IntersectionObserver | null = null;
    function show() {
      revealed.current = true;
      sticker!.dataset.scrollReveal = "visible";
      observer?.disconnect();
      if (observerRef.current === observer) observerRef.current = null;
    }
    const bounds = sticker.getBoundingClientRect();
    if (paused || !("IntersectionObserver" in window)
      || sticker.contains(document.activeElement)
      || (bounds.top < window.innerHeight && bounds.bottom > 0)) {
      show();
      return;
    }
    sticker.dataset.scrollReveal = "pending";
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) show();
    }, { threshold: .12 });
    observerRef.current = observer;
    observer.observe(sticker);
    return () => {
      observer?.disconnect();
      if (observerRef.current === observer) observerRef.current = null;
    };
  }, [hydrated, paused]);

  function revealImmediately() {
    revealed.current = true;
    if (stickerRef.current) stickerRef.current.dataset.scrollReveal = "visible";
    observerRef.current?.disconnect();
    observerRef.current = null;
  }

  function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape" || event.defaultPrevented || !open) return;
    setDisclosure("dismissed");
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <aside
      ref={stickerRef}
      className={`peel-sticker ${className}`.trim()}
      data-drag-frame
      data-art={art}
      data-tone={tone}
      data-open={open}
      data-pinned={disclosure === "pinned"}
      onFocusCapture={revealImmediately}
      onKeyDown={closeOnEscape}
      aria-label={`${title} sticker`}
      onPointerEnter={(event) => {
        revealImmediately();
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => {
        setHovered(false);
        if (!focused && disclosure === "dismissed") setDisclosure("preview");
      }}
    >
      <div className="peel-sticker__arrival">
      <div className="peel-sticker__decal">
        <button
          type="button"
          className="peel-sticker__reveal"
          aria-label={`Read note: ${title}`}
          aria-expanded={open}
          aria-controls={`${id}-fact`}
          aria-describedby={`${id}-hint`}
          onPointerCancel={() => {
            touchFocus.current = false;
            setHovered(false);
            if (!focused && disclosure === "dismissed") setDisclosure("preview");
          }}
          onPointerDown={(event) => {
            touchFocus.current = event.pointerType === "touch";
          }}
          onFocus={() => setFocused(!touchFocus.current)}
          onBlur={() => {
            touchFocus.current = false;
            setFocused(false);
            if (!hovered && disclosure === "dismissed") setDisclosure("preview");
          }}
          onClick={() => setDisclosure(disclosure === "pinned" ? "dismissed" : "pinned")}
        >
          <span className="peel-sticker__title" id={`${id}-title`}>{title}</span>
          <span className="peel-sticker__backing" aria-hidden="true">
            <Image src={stickerArt[art]} alt="" width={1024} height={1024} sizes="(max-width: 600px) 240px, 254px" draggable={false} />
          </span>
          <span className="peel-sticker__face" aria-hidden="true">
            <Image src={stickerArt[art]} alt="" width={1024} height={1024} sizes="(max-width: 600px) 240px, 254px" draggable={false} />
          </span>
        </button>

        <div
          className="peel-sticker__fact"
          id={`${id}-fact`}
          role="region"
          aria-labelledby={`${id}-title`}
          aria-hidden={!open}
          inert={!open}
        >
          <p>{fact}</p>
        </div>
      </div>

      <span className="peel-sticker__hint" id={`${id}-hint`}>
        Hover or focus to preview. Press to keep the note open, press again to close. Escape closes it.
      </span>
      <ArtifactDrag label={`Move sticker: ${title}`} className="peel-sticker__move" />
      </div>
    </aside>
  );
}

export default PeelSticker;
