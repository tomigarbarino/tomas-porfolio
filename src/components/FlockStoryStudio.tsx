"use client";

import { useId, useState, type PointerEvent } from "react";
import { ArtifactDrag } from "@/components/ArtifactDrag";
import { ConceptualProductFlow } from "@/components/ConceptualProductFlow";
import "./flock-story-studio.css";

type Product = "agora" | "trainly";

export function FlockStoryStudio({ active, paused }: { active: boolean; paused: boolean }) {
  const id = useId();
  const [hovered, setHovered] = useState<Product | null>(null);
  const [focused, setFocused] = useState<Product | null>(null);
  const [pinned, setPinned] = useState<Product | null>(null);
  const selected = hovered ?? focused ?? pinned;

  function scan(event: PointerEvent<HTMLButtonElement>) {
    if (!active || paused || event.pointerType !== "mouse" || event.buttons) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    event.currentTarget.style.setProperty("--flock-scan-x", `${Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100))}%`);
    event.currentTarget.style.setProperty("--flock-scan-y", `${Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100))}%`);
  }

  function preview(product: Product) {
    return {
      onPointerEnter: (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === "mouse") setHovered(product);
      },
      onPointerLeave: () => setHovered(current => current === product ? null : current),
      onFocusCapture: () => { setHovered(null); setFocused(product); },
    };
  }

  return (
    <div className="flock-story-studio" data-product={selected ?? "none"} data-animated={active && !paused} onKeyDown={event => {
      if (event.key !== "Escape" || event.defaultPrevented || selected === null) return;
      setPinned(null); setHovered(null); setFocused(null);
      event.preventDefault(); event.stopPropagation();
    }}>
      <figure className="origin-story__system-film" data-drag-frame data-product="agora" data-preview={selected === "agora"} {...preview("agora")} onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(current => current === "agora" ? null : current);
      }}>
        <ArtifactDrag label="Move the Agora story design" />
        <div className="origin-story__system-film-media">
          <button
            type="button"
            className="flock-story-studio__surface"
            data-drag-enabled
            aria-label="Explore my Agora contribution"
            aria-pressed={pinned === "agora"}
            aria-describedby={`${id}-agora-scope`}
            onPointerMove={scan}
            onClick={() => setPinned(current => current === "agora" ? null : "agora")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/agora-candidate-upload.png" alt="Empty Agora CV upload Figma design" width="1440" height="900" loading="lazy" decoding="async" />
            <span className="flock-story-studio__scan" aria-hidden="true" />
            <span className="flock-story-studio__scope" id={`${id}-agora-scope`}>
              <strong>Agora / Product Owner</strong>
              <span>Candidate UX · AI</span>
            </span>
          </button>
        </div>
        <figcaption>Agora / candidate UX · Figma design</figcaption>
      </figure>
      <figure className="origin-story__product-plane origin-story__bridge" data-drag-frame data-product="trainly" data-preview={selected === "trainly"} {...preview("trainly")} onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(current => current === "trainly" ? null : current);
      }}>
        <ArtifactDrag label="Move the Trainly product image" />
        <button
          type="button"
          className="flock-story-studio__surface"
          data-drag-enabled
          aria-label="Explore my Trainly contribution"
          aria-pressed={pinned === "trainly"}
          aria-describedby={`${id}-trainly-scope`}
          onPointerMove={scan}
          onClick={() => setPinned(current => current === "trainly" ? null : "trainly")}
        >
          {/* The source keeps its complete aspect ratio; the tint never crops it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/trainly-product.png" alt="Trainly product interface" width="1350" height="652" loading="lazy" decoding="async" />
          <span className="flock-story-studio__scan" aria-hidden="true" />
          <span className="flock-story-studio__scope" id={`${id}-trainly-scope`}>
            <strong>Trainly / Product flow</strong>
            <span>Frontend · AI</span>
          </span>
        </button>
        <figcaption>Trainly / Product flow · Frontend · AI</figcaption>
      </figure>
      <ConceptualProductFlow />
    </div>
  );
}
